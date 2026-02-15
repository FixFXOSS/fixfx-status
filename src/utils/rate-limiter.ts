interface RateLimitEntry {
	timestamp: number;
	count: number;
}


const WEBHOOK_TEST_LIMITS = {
	MAX_TESTS_PER_HOUR: 5,
	HOUR_MS: 60 * 60 * 1000,
	MAX_TESTS_PER_MINUTE: 2,
	MINUTE_MS: 60 * 1000,
};

const DISCORD_BACKOFF = {
	INITIAL_MS: 1000,
	MAX_MS: 5 * 60 * 1000,
	MULTIPLIER: 2,
	MAX_RETRIES: 3,
};

let webhookTestLog: Map<string, RateLimitEntry[]> = new Map();
let discordBackoffMap: Map<string, { backoffUntil: number }> = new Map();

export function canTestWebhook(webhookId: string): {
	allowed: boolean;
	retryAfter?: number;
} {
	const now = Date.now();
	const entries = webhookTestLog.get(webhookId) || [];

	const recentEntries = entries.filter((e) => now - e.timestamp < WEBHOOK_TEST_LIMITS.HOUR_MS);

	if (recentEntries.length >= WEBHOOK_TEST_LIMITS.MAX_TESTS_PER_HOUR) {
		const oldestEntry = recentEntries[0];
		const retryAfter = WEBHOOK_TEST_LIMITS.HOUR_MS - (now - oldestEntry.timestamp);
		return { allowed: false, retryAfter };
	}

	const lastMinute = recentEntries.filter((e) => now - e.timestamp < WEBHOOK_TEST_LIMITS.MINUTE_MS);
	if (lastMinute.length >= WEBHOOK_TEST_LIMITS.MAX_TESTS_PER_MINUTE) {
		const oldestEntry = lastMinute[0];
		const retryAfter = WEBHOOK_TEST_LIMITS.MINUTE_MS - (now - oldestEntry.timestamp);
		return { allowed: false, retryAfter };
	}

	recentEntries.push({ timestamp: now, count: 1 });
	webhookTestLog.set(webhookId, recentEntries);

	return { allowed: true };
}

export function isInDiscordBackoff(): { inBackoff: boolean; waitTime?: number } {
	const backoff = discordBackoffMap.get("global");
	if (!backoff) {
		return { inBackoff: false };
	}

	const now = Date.now();
	if (now < backoff.backoffUntil) {
		return { inBackoff: true, waitTime: backoff.backoffUntil - now };
	}

	discordBackoffMap.delete("global");
	return { inBackoff: false };
}

export function recordDiscordRateLimit(
	retryAfterHeader?: string,
): { backoffMs: number; retryAfter: string } {
	let retryAfter = DISCORD_BACKOFF.INITIAL_MS;

	if (retryAfterHeader) {
		const seconds = parseInt(retryAfterHeader, 10);
		if (!isNaN(seconds)) {
			retryAfter = Math.min(seconds * 1000, DISCORD_BACKOFF.MAX_MS);
		}
	}

	const backoff = discordBackoffMap.get("global");
	const currentBackoff = backoff?.backoffUntil || 0;
	const newBackoffUntil = Math.max(currentBackoff, Date.now() + retryAfter);

	discordBackoffMap.set("global", { backoffUntil: newBackoffUntil });

	return {
		backoffMs: retryAfter,
		retryAfter: `${(retryAfter / 1000).toFixed(1)}s`,
	};
}

export async function sendWithRateLimitRetry(
	url: string,
	payload: unknown,
	maxRetries: number = DISCORD_BACKOFF.MAX_RETRIES,
): Promise<{
	success: boolean;
	error?: string;
	rateLimited?: boolean;
}> {
	let lastResponse: Response | null = null;
	let lastError: Error | null = null;

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		const backoffStatus = isInDiscordBackoff();
		if (backoffStatus.inBackoff && attempt > 0) {
			return {
				success: false,
				error: `Discord is rate limiting us. Waiting ${(backoffStatus.waitTime! / 1000).toFixed(1)}s before retrying.`,
				rateLimited: true,
			};
		}

		try {
			lastResponse = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (lastResponse.ok || lastResponse.status === 204) {
				return { success: true };
			}

			if (lastResponse.status === 429) {
				const retryAfter = lastResponse.headers.get("Retry-After");
				const { backoffMs, retryAfter: retryAfterStr } = recordDiscordRateLimit(retryAfter || undefined);

				if (attempt < maxRetries) {
					console.warn(`Discord rate limit hit (429). Waiting ${retryAfterStr} before retry ${attempt + 1}/${maxRetries}`);
					await new Promise((resolve) => setTimeout(resolve, backoffMs));
					continue;
				}

				return {
					success: false,
					error: `Discord rate limited us after ${maxRetries} retries. Please try again in ${retryAfterStr}.`,
					rateLimited: true,
				};
			}

			const errorData = await lastResponse.text().catch(() => "");
			return {
				success: false,
				error: `Discord returned ${lastResponse.status}. ${errorData || "Webhook may be invalid or expired."}`,
			};
		} catch (err) {
			lastError = err instanceof Error ? err : new Error(String(err));

			if (attempt < maxRetries) {
				const backoffMs = Math.min(
					DISCORD_BACKOFF.INITIAL_MS * Math.pow(DISCORD_BACKOFF.MULTIPLIER, attempt),
					DISCORD_BACKOFF.MAX_MS,
				);
				console.warn(`Network error sending webhook (attempt ${attempt + 1}/${maxRetries}). Retrying in ${backoffMs}ms`, lastError);
				await new Promise((resolve) => setTimeout(resolve, backoffMs));
				continue;
			}
		}
	}

	return {
		success: false,
		error: lastError?.message || "Failed to send webhook after retries",
	};
}

export function cleanupOldEntries(): void {
	const now = Date.now();
	for (const [webhookId, entries] of webhookTestLog.entries()) {
		const recentEntries = entries.filter((e) => now - e.timestamp < WEBHOOK_TEST_LIMITS.HOUR_MS);
		if (recentEntries.length === 0) {
			webhookTestLog.delete(webhookId);
		} else {
			webhookTestLog.set(webhookId, recentEntries);
		}
	}
}

export function resetRateLimits(): void {
	webhookTestLog.clear();
	discordBackoffMap.clear();
}
