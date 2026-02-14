import type {
	ServiceEndpoint,
	ServiceResult,
	ServiceStatus,
	CategoryResult,
	StatusSummary,
} from "@/types/status";
import type { ServiceCategory } from "@/types/status";

/** Per-request timeout: 15 seconds. */
const TIMEOUT_MS = 15_000;

/** Max concurrent requests to avoid hammering CFX. */
const MAX_CONCURRENCY = 4;

/** Retry config with exponential backoff. */
const MAX_RETRIES = 2;
const BASE_BACKOFF_MS = 1_000;

/** Simple sleep helper. */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Run an array of async fns with a concurrency cap.
 * Prevents slamming all endpoints at once.
 */
async function withConcurrency<T>(
	fns: (() => Promise<T>)[],
	limit: number,
): Promise<T[]> {
	const results: T[] = new Array(fns.length);
	let idx = 0;

	async function worker() {
		while (idx < fns.length) {
			const i = idx++;
			results[i] = await fns[i]();
		}
	}

	const workers = Array.from(
		{ length: Math.min(limit, fns.length) },
		() => worker(),
	);
	await Promise.all(workers);
	return results;
}

/**
 * Probe one endpoint and return a result.
 * Retries with exponential backoff on transient failures.
 * Respects rate-limit headers (Retry-After / 429).
 */
async function checkEndpoint(svc: ServiceEndpoint): Promise<ServiceResult> {
	let lastError: string | undefined;
	let lastStatusCode: number | null = null;
	let lastElapsed = 0;

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		// Exponential backoff between retries
		if (attempt > 0) {
			const backoff = BASE_BACKOFF_MS * 2 ** (attempt - 1);
			await sleep(backoff);
		}

		const start = performance.now();
		const ctrl = new AbortController();
		const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

		try {
			const res = await fetch(svc.url, {
				method: svc.method ?? "GET",
				signal: ctrl.signal,
				redirect: "follow",
				headers: {
					"User-Agent": "cfxstat.us/1.0 (status-checker)",
				},
			});

			clearTimeout(timer);
			lastElapsed = Math.round(performance.now() - start);
			lastStatusCode = res.status;

			// If we hit a rate-limit, honour Retry-After and retry
			if (res.status === 429) {
				const retryAfter = res.headers.get("Retry-After");
				const waitMs = retryAfter
					? Number.parseInt(retryAfter, 10) * 1000 || 5_000
					: 5_000;
				await sleep(Math.min(waitMs, 30_000));
				lastError = "Rate limited (429)";
				continue;
			}

			// Custom response validation if provided
			if (svc.validateResponse) {
				try {
					const body = await res.text();
					const isValid = svc.validateResponse(res.status, body);
					return {
						id: svc.id,
						name: svc.name,
						status: isValid ? "operational" : "degraded",
						responseTime: lastElapsed,
						statusCode: res.status,
						checkedAt: new Date().toISOString(),
					};
				} catch {
					return {
						id: svc.id,
						name: svc.name,
						status: "degraded",
						responseTime: lastElapsed,
						statusCode: res.status,
						checkedAt: new Date().toISOString(),
						error: "Response validation failed",
					};
				}
			}

			// Standard status-code check
			const expected = svc.expectedStatus ?? 200;
			const ok = svc.acceptRange
				? res.status >= 200 && res.status < 400
				: res.status === expected;

			if (ok) {
				return {
					id: svc.id,
					name: svc.name,
					status: "operational",
					responseTime: lastElapsed,
					statusCode: res.status,
					checkedAt: new Date().toISOString(),
				};
			}

			// 5xx errors are transient — retry
			if (res.status >= 500 && attempt < MAX_RETRIES) {
				lastError = `HTTP ${res.status}`;
				continue;
			}

			// Non-retryable failure
			return {
				id: svc.id,
				name: svc.name,
				status: "degraded",
				responseTime: lastElapsed,
				statusCode: res.status,
				checkedAt: new Date().toISOString(),
			};
		} catch (err) {
			clearTimeout(timer);
			lastElapsed = Math.round(performance.now() - start);
			const isTimeout = (err as Error).name === "AbortError";
			lastError = isTimeout ? "Request timed out" : (err as Error).message;

			// Timeouts and network errors are retryable
			if (attempt < MAX_RETRIES) {
					// Retry on next iteration
			}
		}
	}

	// All retries exhausted
	return {
		id: svc.id,
		name: svc.name,
		status: "major",
		responseTime: lastElapsed || TIMEOUT_MS,
		statusCode: lastStatusCode,
		checkedAt: new Date().toISOString(),
		error: lastError,
	};
}

/** Derive worst status from a list of results. */
function worstStatus(results: ServiceResult[]): ServiceStatus {
	if (results.some((r) => r.status === "major")) return "major";
	if (results.some((r) => r.status === "degraded")) return "degraded";
	if (results.some((r) => r.status === "partial")) return "partial";
	if (results.some((r) => r.status === "unknown")) return "unknown";
	return "operational";
}

/**
 * Check all services across all categories and return a full summary.
 * Uses concurrency limiting to avoid hammering endpoints.
 */
export async function checkAllServices(
	categories: ServiceCategory[],
): Promise<StatusSummary> {
	// Flatten all endpoints into tasks, preserving category mapping
	const tasks: {
		catIdx: number;
		svcIdx: number;
		fn: () => Promise<ServiceResult>;
	}[] = [];

	for (let ci = 0; ci < categories.length; ci++) {
		for (let si = 0; si < categories[ci].services.length; si++) {
			const svc = categories[ci].services[si];
			tasks.push({ catIdx: ci, svcIdx: si, fn: () => checkEndpoint(svc) });
		}
	}

	// Run all checks with concurrency cap
	const results = await withConcurrency(
		tasks.map((t) => t.fn),
		MAX_CONCURRENCY,
	);

	// Rebuild category results
	const categoryResults: CategoryResult[] = categories.map((cat) => ({
		id: cat.id,
		name: cat.name,
		icon: cat.icon,
		color: cat.color,
		overallStatus: "operational" as ServiceStatus,
		services: [] as ServiceResult[],
	}));

	for (let i = 0; i < tasks.length; i++) {
		categoryResults[tasks[i].catIdx].services.push(results[i]);
	}

	for (const cat of categoryResults) {
		cat.overallStatus = worstStatus(cat.services);
	}

	const allResults = categoryResults.flatMap((c) => c.services);
	const operationalCount = allResults.filter(
		(r) => r.status === "operational",
	).length;

	return {
		overall: worstStatus(allResults),
		categories: categoryResults,
		lastChecked: new Date().toISOString(),
		totalServices: allResults.length,
		operationalCount,
	};
}
