import type { Incident } from "@/types/status";

export interface StoredWebhook {
	id: string;
	url: string;
	name: string;
	createdAt: string;
	lastTestedAt?: string;
	lastTestSuccess?: boolean;
	active: boolean;
}

interface CloudflareEnv {
	WEBHOOKS?: any; // KVNamespace
}

const MAX_WEBHOOKS = 10;
const WEBHOOKS_KV_KEY = "cfxstat:webhooks";

function generateWebhookId(): string {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function isValidDiscordWebhook(url: string): boolean {
	try {
		const u = new URL(url);
		return (
			(u.hostname === "discord.com" || u.hostname.endsWith(".discord.com")) &&
			u.pathname.startsWith("/api/webhooks/")
		);
	} catch {
		return false;
	}
}

// In-memory fallback store for webhooks
let webhooksStore: StoredWebhook[] = [];

async function loadWebhooks(env?: CloudflareEnv): Promise<StoredWebhook[]> {
	// Try to load from KV if available
	if (env?.WEBHOOKS) {
		try {
			const data = await env.WEBHOOKS.get(WEBHOOKS_KV_KEY);
			if (data) {
				return JSON.parse(data) as StoredWebhook[];
			}
		} catch (err) {
			console.error("Failed to load webhooks from KV:", err);
		}
	}

	// Fallback to in-memory store
	return webhooksStore;
}

async function saveWebhooks(webhooks: StoredWebhook[], env?: CloudflareEnv): Promise<void> {
	const sliced = webhooks.slice(0, MAX_WEBHOOKS);

	// Save to KV if available
	if (env?.WEBHOOKS) {
		try {
			await env.WEBHOOKS.put(WEBHOOKS_KV_KEY, JSON.stringify(sliced));
		} catch (err) {
			console.error("Failed to save webhooks to KV:", err);
		}
	}

	// Always update in-memory store as fallback
	webhooksStore = sliced;
}

export async function addWebhook(
	url: string,
	name: string,
	env?: CloudflareEnv,
): Promise<StoredWebhook> {
	if (!isValidDiscordWebhook(url)) {
		throw new Error("Invalid Discord webhook URL");
	}

	const webhook: StoredWebhook = {
		id: generateWebhookId(),
		url,
		name: name || "Discord Webhook",
		createdAt: new Date().toISOString(),
		active: true,
	};

	const webhooks = await loadWebhooks(env);
	webhooks.unshift(webhook);
	await saveWebhooks(webhooks, env);

	return webhook;
}

export async function getWebhooks(env?: CloudflareEnv): Promise<StoredWebhook[]> {
	const webhooks = await loadWebhooks(env);
	return webhooks.filter((w) => w.active);
}

export async function getWebhook(id: string, env?: CloudflareEnv): Promise<StoredWebhook | null> {
	const webhooks = await loadWebhooks(env);
	return webhooks.find((w) => w.id === id) || null;
}

export async function removeWebhook(id: string, env?: CloudflareEnv): Promise<boolean> {
	const webhooks = await loadWebhooks(env);
	const webhook = webhooks.find((w) => w.id === id);

	if (webhook) {
		webhook.active = false;
		await saveWebhooks(webhooks, env);
		return true;
	}

	return false;
}

export async function updateWebhookTest(
	id: string,
	success: boolean,
	env?: CloudflareEnv,
): Promise<StoredWebhook | null> {
	const webhooks = await loadWebhooks(env);
	const webhook = webhooks.find((w) => w.id === id);

	if (webhook) {
		webhook.lastTestedAt = new Date().toISOString();
		webhook.lastTestSuccess = success;
		await saveWebhooks(webhooks, env);
		return webhook;
	}

	return null;
}

export interface DiscordEmbed {
	title: string;
	description: string;
	color: number;
	fields?: Array<{
		name: string;
		value: string;
		inline?: boolean;
	}>;
	timestamp?: string;
}

export function buildIncidentEmbed(incident: Incident): DiscordEmbed {
	const colors: Record<string, number> = {
		minor: 0xfbbf24, // amber
		major: 0xf97316, // orange
		critical: 0xef4444, // red
	};

	const statusEmojis: Record<string, string> = {
		operational: "✅",
		degraded: "⚠️",
		partial: "🔴",
		major: "🔴",
		unknown: "❓",
	};

	return {
		title: `${statusEmojis[incident.status] || ""} ${incident.title}`,
		description: incident.description || `Service: **${incident.serviceName}**`,
		color: colors[incident.impact] || 0x6b7280,
		fields: [
			{
				name: "Service",
				value: incident.serviceName,
				inline: true,
			},
			{
				name: "Status",
				value: incident.status.charAt(0).toUpperCase() + incident.status.slice(1),
				inline: true,
			},
			{
				name: "Impact",
				value: incident.impact.charAt(0).toUpperCase() + incident.impact.slice(1),
				inline: true,
			},
			{
				name: "Started",
				value: new Date(incident.startedAt).toLocaleString(),
				inline: true,
			},
			...(incident.resolvedAt
				? [
						{
							name: "Resolved",
							value: new Date(incident.resolvedAt).toLocaleString(),
							inline: true,
						},
					]
				: []),
		],
		timestamp: new Date().toISOString(),
	};
}

export async function sendWebhook(
	webhook: StoredWebhook,
	incident: Incident,
): Promise<{ success: boolean; error?: string }> {
	try {
		const embed = buildIncidentEmbed(incident);

		const response = await fetch(webhook.url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content: null,
				embeds: [embed],
				username: "CFX Status",
			}),
		});

		if (response.ok || response.status === 204) {
			return { success: true };
		}

		// Discord returned an error
		const errorText = await response.text();
		console.error(`Discord webhook error (${response.status}):`, errorText);
		
		return { 
			success: false, 
			error: `Discord returned ${response.status}. Webhook may be invalid or expired.` 
		};
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : String(err);
		console.error(`Failed to send webhook to ${webhook.id}:`, err);
		return { success: false, error: errorMsg };
	}
}
