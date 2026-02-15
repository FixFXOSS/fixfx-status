import type { Incident, ServiceStatus } from "@/types/status";
import { getWebhooks, sendWebhook } from "./webhook-storage";

const MAX_INCIDENTS = 200;
const RESOLVED_RETENTION_DAYS = 30;
const INCIDENTS_KV_KEY = "cfxstat:incidents";

interface CloudflareEnv {
	INCIDENTS?: any; // KVNamespace
	WEBHOOKS?: any; // KVNamespace
}

let incidentsStore: Incident[] = [];

async function loadIncidents(env?: CloudflareEnv): Promise<Incident[]> {
	if (env?.INCIDENTS) {
		try {
			const data = await env.INCIDENTS.get(INCIDENTS_KV_KEY);
			if (data) {
				return JSON.parse(data) as Incident[];
			}
		} catch (err) {
			console.error("Failed to load incidents from KV:", err);
		}
	}

	return incidentsStore;
}

async function saveIncidents(incidents: Incident[], env?: CloudflareEnv): Promise<void> {
	const sliced = incidents.slice(0, MAX_INCIDENTS);

	if (env?.INCIDENTS) {
		try {
			await env.INCIDENTS.put(INCIDENTS_KV_KEY, JSON.stringify(sliced));
		} catch (err) {
			console.error("Failed to save incidents to KV:", err);
		}
	}

	incidentsStore = sliced;
}

async function notifyWebhooks(incident: Incident, env?: CloudflareEnv): Promise<void> {
	try {
		const webhooks = await getWebhooks(env);
		if (webhooks.length === 0) return;

		const promises = webhooks.map((webhook) =>
			sendWebhook(webhook, incident)
				.then((result) => {
					if (!result.success && result.error) {
						console.warn(`Webhook ${webhook.name} failed:`, result.error);
					}
				})
				.catch((err) => {
					console.error(`Failed to send webhook to ${webhook.name}:`, err);
				}),
		);

		await Promise.all(promises);
	} catch (error) {
		console.error("Error notifying webhooks:", error);
	}
}

function getImpactLevel(
	previousStatus: ServiceStatus,
	newStatus: ServiceStatus,
): "minor" | "major" | "critical" {
	if (previousStatus === "operational" && (newStatus === "major" || newStatus === "partial")) {
		return "critical";
	}

	if (previousStatus === "operational" && newStatus === "degraded") {
		return "major";
	}

	return "minor";
}

function generateIncidentId(): string {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function trackIncident(
	serviceId: string,
	serviceName: string,
	previousStatus: ServiceStatus,
	currentStatus: ServiceStatus,
	env?: CloudflareEnv,
): Promise<Incident | null> {

	if (previousStatus === currentStatus || currentStatus === "unknown") {
		return null;
	}

	const incidents = await loadIncidents(env);
	const existingIncident = incidents.find(
		(i) => i.serviceId === serviceId && !i.resolvedAt,
	);

	if (existingIncident) {
		if (currentStatus === "operational") {
			existingIncident.resolvedAt = new Date().toISOString();
			await notifyWebhooks(existingIncident, env);
		} else {
			existingIncident.status = currentStatus;
			await notifyWebhooks(existingIncident, env);
		}
		await cleanupOldIncidents(incidents, env);
		return existingIncident;
	}

	if (currentStatus !== "operational") {
		const newIncident: Incident = {
			id: generateIncidentId(),
			serviceId,
			serviceName,
			startedAt: new Date().toISOString(),
			previousStatus,
			status: currentStatus,
			impact: getImpactLevel(previousStatus, currentStatus),
			title: `${serviceName} ${currentStatus === "degraded" ? "Degraded" : "Experiencing Issues"}`,
			autoDetected: true,
		};
		incidents.unshift(newIncident);
		await notifyWebhooks(newIncident, env);
		await cleanupOldIncidents(incidents, env);
		return newIncident;
	}

	return null;
}

async function cleanupOldIncidents(incidents: Incident[], env?: CloudflareEnv): Promise<void> {
	const now = Date.now();
	const retentionMs = RESOLVED_RETENTION_DAYS * 24 * 60 * 60 * 1000;

	const cleaned = incidents.filter((i) => {
		if (!i.resolvedAt) return true; // Keep unresolved
		const resolvedTime = new Date(i.resolvedAt).getTime();
		return now - resolvedTime < retentionMs;
	});

	await saveIncidents(cleaned, env);
}

export async function addManualIncident(
	serviceId: string,
	serviceName: string,
	title: string,
	description: string,
	impact: "minor" | "major" | "critical",
	env?: CloudflareEnv,
): Promise<Incident> {
	const incident: Incident = {
		id: generateIncidentId(),
		serviceId,
		serviceName,
		startedAt: new Date().toISOString(),
		status: "degraded",
		previousStatus: "operational",
		impact,
		title,
		description,
		autoDetected: false,
	};

	const incidents = await loadIncidents(env);
	incidents.unshift(incident);
	await cleanupOldIncidents(incidents, env);

	return incident;
}

export async function resolveIncident(incidentId: string, env?: CloudflareEnv): Promise<Incident | null> {
	const incidents = await loadIncidents(env);
	const incident = incidents.find((i) => i.id === incidentId);

	if (incident && !incident.resolvedAt) {
		incident.resolvedAt = new Date().toISOString();
		await notifyWebhooks(incident, env);
		await cleanupOldIncidents(incidents, env);
		return incident;
	}

	return null;
}

export async function getRecentIncidents(limit: number = 10, env?: CloudflareEnv): Promise<Incident[]> {
	const incidents = await loadIncidents(env);
	return incidents.slice(0, limit);
}

export async function getAllIncidents(env?: CloudflareEnv): Promise<Incident[]> {
	return loadIncidents(env);
}
