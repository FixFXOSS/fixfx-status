import { createFileRoute } from "@tanstack/react-router";
import { getRecentIncidents } from "@/utils/incident-tracker";

export const Route = createFileRoute("/api/incidents")({
	server: {
		handlers: {
			GET: async (ctx) => {
				const limit = Number.parseInt(
					new URL(ctx.request.url).searchParams.get("limit") || "50",
				);
				const incidents = getRecentIncidents(Math.min(limit, 200));

				return Response.json(
					{
						incidents,
						total: incidents.length,
						lastUpdated: new Date().toISOString(),
					},
					{
						headers: {
							"Cache-Control": "public, max-age=60, s-maxage=60",
						},
					},
				);
			},
		},
	},
});

