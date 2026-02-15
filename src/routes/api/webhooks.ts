import { createFileRoute } from "@tanstack/react-router";
import {
	addWebhook,
	getWebhooks,
	removeWebhook,
} from "@/utils/webhook-storage";

export const Route = createFileRoute("/api/webhooks")({
	server: {
		handlers: {
			GET: async (ctx) => {
				const webhooks = await getWebhooks((ctx as any).env);
				return Response.json({
					webhooks: webhooks.map((w) => ({
						id: w.id,
						name: w.name,
						createdAt: w.createdAt,
						lastTestedAt: w.lastTestedAt,
						lastTestSuccess: w.lastTestSuccess,
					})),
					count: webhooks.length,
					max: 10,
				});
			},

			POST: async (ctx) => {
				try {
					const body = (await ctx.request.json()) as {
						url: string;
						name?: string;
					};

					if (!body.url) {
						return Response.json(
							{ error: "Missing webhook URL" },
							{ status: 400 },
						);
					}

					if (!body.name || body.name.trim() === "") {
						return Response.json(
							{ error: "Webhook name is required" },
							{ status: 400 },
						);
					}

					const webhook = await addWebhook(body.url, body.name, (ctx as any).env);

					return Response.json(
						{
							success: true,
							webhook: {
								id: webhook.id,
								name: webhook.name,
								createdAt: webhook.createdAt,
							},
						},
						{ status: 201 },
					);
				} catch (err) {
					const message = (err as Error).message;
					if (message.includes("Invalid Discord webhook")) {
						return Response.json(
							{ 
								error: "Invalid Discord webhook URL. Please ensure it's a valid Discord webhook URL (e.g., https://discord.com/api/webhooks/...)" 
							},
							{ status: 400 },
						);
					}
					return Response.json(
						{ error: message || "Failed to add webhook" },
						{ status: 400 },
					);
				}
			},

			DELETE: async (ctx) => {
				const url = new URL(ctx.request.url);
				const id = url.searchParams.get("id");

				if (!id) {
					return Response.json(
						{ error: "Missing webhook ID" },
						{ status: 400 },
					);
				}

				const success = await removeWebhook(id, (ctx as any).env);

				if (!success) {
					return Response.json(
						{ error: "Webhook not found" },
						{ status: 404 },
					);
				}

				return Response.json({ success: true });
			},
		},
	},
});
