import { createFileRoute } from "@tanstack/react-router";
import { getAllIncidents } from "@/utils/incident-tracker";

export const Route = createFileRoute("/api/status/rss")({
	server: {
		handlers: {
			GET: async () => {
				const incidents = getAllIncidents();
				const siteUrl = "https://cfxstat.us";
				const buildDate = new Date().toUTCString();
        
				const incidentItems = incidents
					.slice(0, 20)
					.map((inc) => {
						const itemDate = new Date(inc.startedAt).toUTCString();
						const resolvedStatus = inc.resolvedAt ? "Resolved" : "Ongoing";

						return [
							"<item>",
							`<title>${resolvedStatus}: ${inc.title}</title>`,
							`<description><![CDATA[<p><strong>${inc.serviceName}</strong></p><p>Status: ${inc.status}</p><p>Impact: ${inc.impact}</p>]]></description>`,
							`<link>${siteUrl}#${inc.serviceId}</link>`,
							`<guid>${siteUrl}/incident/${inc.id}</guid>`,
							`<pubDate>${itemDate}</pubDate>`,
							`<category>${inc.impact}</category>`,
							"</item>",
						].join("")
					})
					.join("\n")

				const rssXml =
					'<?xml version="1.0" encoding="UTF-8"?>' +
					"<rss version=\"2.0\">" +
					"<channel>" +
					"<title>CFX Status - Incident Feed</title>" +
					`<link>${siteUrl}</link>` +
					"<description>Real-time incident tracking for Cfx.re services</description>" +
					"<language>en-us</language>" +
					`<lastBuildDate>${buildDate}</lastBuildDate>` +
					"<image>" +
					`<url>${siteUrl}/meta/opengraph-image.svg</url>` +
					"<title>CFX Status</title>" +
					`<link>${siteUrl}</link>` +
					"</image>" +
					incidentItems +
					"</channel>" +
					"</rss>"

				return new Response(rssXml, {
					headers: {
						"Content-Type": "application/rss+xml; charset=utf-8",
						"Cache-Control": "public, max-age=300, s-maxage=600",
					},
				})
			},
		},
	},
});
