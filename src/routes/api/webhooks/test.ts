import { createFileRoute } from "@tanstack/react-router";
import { getWebhook, updateWebhookTest } from "@/utils/webhook-storage";
import { buildIncidentEmbed } from "@/utils/webhook-storage";
import { canTestWebhook, sendWithRateLimitRetry } from "@/utils/rate-limiter";

export const Route = createFileRoute("/api/webhooks/test")({
	server: {
		handlers: {
			POST: async (ctx) => {
				try {
					const body = (await ctx.request.json()) as { id: string };

					if (!body.id) {
						return Response.json(
							{ error: "Missing webhook ID" },
							{ status: 400 },
						);
					}

					const webhook = await getWebhook(body.id, (ctx as any).env);

					if (!webhook) {
						return Response.json(
							{ error: "Webhook not found" },
							{ status: 404 },
						);
					}

					// Check rate limits
					const limitCheck = canTestWebhook(webhook.id);
					if (!limitCheck.allowed) {
						const retrySeconds = Math.ceil((limitCheck.retryAfter || 0) / 1000);
						return Response.json(
							{
								error: `Too many test attempts. Please wait ${retrySeconds} seconds before testing again.`,
								retryAfter: retrySeconds,
							},
							{ status: 429 },
						);
					}

					// Build test incident
					const testIncident = {
						id: "test",
						serviceId: "test-service",
						serviceName: "Test Service",
						startedAt: new Date().toISOString(),
						previousStatus: "operational" as const,
						status: "degraded" as const,
						impact: "minor" as const,
						title: "Test Incident - CFX Status",
						description: "This is a test message from CFX Status to verify your webhook is working.",
						autoDetected: false,
					};

					// Build Discord embed
					const embed = buildIncidentEmbed(testIncident);

					// Send with rate limit handling and retries
					const result = await sendWithRateLimitRetry(webhook.url, {
						embeds: [embed],
					});

					// Record test result
					await updateWebhookTest(webhook.id, result.success, (ctx as any).env);

					// Handle rate limit response
					if (result.rateLimited) {
						return Response.json(
							{ error: result.error },
							{ status: 429 },
						);
					}

					// Handle other errors
					if (!result.success) {
						return Response.json(
							{
								error: result.error || "Failed to send test message to Discord. Check the webhook URL is valid and hasn't expired.",
							},
							{ status: 500 },
						);
					}

					return Response.json({
						success: true,
						message: "Test message sent successfully! Check your Discord server.",
					});
				} catch (err) {
					const error = err as Error;
					console.error("Webhook test error:", error);
					return Response.json(
						{ error: error.message || "Failed to test webhook" },
						{ status: 500 },
					);
				}
			},
		},
	},
});
