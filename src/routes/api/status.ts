import { createFileRoute } from "@tanstack/react-router";
import { serviceCategories } from "@/data/services";
import { checkAllServices } from "@/utils/status-checker";

export const Route = createFileRoute("/api/status")({
	server: {
		handlers: {
			GET: async (ctx) => {
				const summary = await checkAllServices(serviceCategories, (ctx as any).env);
				return Response.json(summary, {
					headers: {
						"Cache-Control": "public, max-age=120, s-maxage=300",
					},
				});
			},
		},
	},
});
