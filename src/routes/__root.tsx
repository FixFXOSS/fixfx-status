import { HeadContent, Scripts, createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GlobalError } from "@/components/GlobalError";

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
				title: "Links | FixFX",
			},
			{
				name: "description",
				content:
					"FixFX — Your comprehensive resource for FiveM development. Documentation, guides, native references, and community tools.",
			},
			{
				name: "theme-color",
				content: "#0a0a0b",
			},
			{
				property: "og:title",
				content: "Links | FixFX",
			},
			{
				property: "og:description",
				content:
					"Your comprehensive resource for FiveM development — documentation, guides, native references, and community tools.",
			},
			{
				property: "og:type",
				content: "website",
			},
			{
				property: "og:url",
				content: "https://links.fixfx.wiki",
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
				content: "Links | FixFX",
			},
			{
				name: "twitter:description",
				content:
					"Your comprehensive resource for FiveM development — documentation, guides, native references, and community tools.",
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
