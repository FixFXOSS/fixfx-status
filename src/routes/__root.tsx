import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	component: RootComponent,
	errorComponent: ErrorBoundary,
	notFoundComponent: () => {
		if (typeof window !== "undefined") {
			window.location.href = "/404";
		}
		return null;
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "The unofficial Cfx.re Service Monitor",
			},
			{
				name: "description",
				content:
					"Unofficial real time status page for Cfx.re services monitor FiveM, RedM, Forum, Keymaster, and more.",
			},
			{
				name: "theme-color",
				content: "#0a0a0f",
			},
			{
				property: "og:title",
				content: "The unofficial Cfx.re Service Monitor",
			},
			{
				property: "og:description",
				content:
					"Real time monitoring of Cfx.re / FiveM / RedM infrastructure. See what's up, what's down, and response times.",
			},
			{
				property: "og:type",
				content: "website",
			},
			{
				property: "og:url",
				content: "https://cfxstat.us",
			},
			{
				property: "og:image",
				content: "/meta/opengraph-image.png",
			},
			{
				property: "og:image:width",
				content: "1200",
			},
			{
				property: "og:image:height",
				content: "630",
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: "The unofficial Cfx.re Service Monitor",
			},
			{
				name: "twitter:description",
				content:
					"Real time monitoring of Cfx.re / FiveM / RedM infrastructure. See what's up, what's down, and response times.",
			},
			{
				name: "twitter:image",
				content: "/meta/twitter-image.png",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "alternate",
				type: "application/rss+xml",
				href: "/api/status.rss",
				title: "CFX Status - Incident Feed",
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com",
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&family=JetBrains+Mono:wght@400;500;600;700&display=swap",
			},
			{
				rel: "icon",
				href: "/meta/icon.png",
				type: "image/png",
				sizes: "512x512",
			},
			{
				rel: "apple-touch-icon",
				href: "/meta/apple-icon.png",
				sizes: "180x180",
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootComponent() {
	return <Outlet />;
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
