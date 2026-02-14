import type { Incident, ServiceStatus } from "@/types/status";

const MAX_INCIDENTS = 200;
const RESOLVED_RETENTION_DAYS = 30;

let incidentsStore: Incident[] = [];

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

export function trackIncident(
	serviceId: string,
	serviceName: string,
	previousStatus: ServiceStatus,
	currentStatus: ServiceStatus,
): Incident | null {

	if (previousStatus === currentStatus || currentStatus === "unknown") {
		return null;
	}

	const existingIncident = incidentsStore.find(
		(i) => i.serviceId === serviceId && !i.resolvedAt,
	);

	if (existingIncident) {
		if (currentStatus === "operational") {
			existingIncident.resolvedAt = new Date().toISOString();
		} else {
			existingIncident.status = currentStatus;
		}
		cleanupOldIncidents();
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
		incidentsStore.unshift(newIncident);
		cleanupOldIncidents();
		return newIncident;
	}

	return null;
}

function cleanupOldIncidents(): void {
	const now = Date.now();
	const retentionMs = RESOLVED_RETENTION_DAYS * 24 * 60 * 60 * 1000;

	const cleaned = incidentsStore.filter((i) => {
		if (!i.resolvedAt) return true; // Keep unresolved
		const resolvedTime = new Date(i.resolvedAt).getTime();
		return now - resolvedTime < retentionMs;
	});

	incidentsStore = cleaned.slice(0, MAX_INCIDENTS);
}

export function addManualIncident(
	serviceId: string,
	serviceName: string,
	title: string,
	description: string,
	impact: "minor" | "major" | "critical",
): Incident {
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

	incidentsStore.unshift(incident);
	cleanupOldIncidents();

	return incident;
}

export function resolveIncident(incidentId: string): Incident | null {
	const incident = incidentsStore.find((i) => i.id === incidentId);

	if (incident && !incident.resolvedAt) {
		incident.resolvedAt = new Date().toISOString();
		cleanupOldIncidents();
		return incident;
	}

	return null;
}

export function getRecentIncidents(limit: number = 10): Incident[] {
	return incidentsStore.slice(0, limit);
}

export function getAllIncidents(): Incident[] {
	return incidentsStore;
}
