import type { ServiceCategory } from "@/types/status";

/**
 * All known Cfx.re / FiveM / RedM service endpoints to monitor.
 *
 * These URLs are publicly reachable and don't require authentication.
 * We perform lightweight HEAD/GET requests against them and report
 * whether they respond with the expected status code.
 *
 * Source: DNS enumeration of fivem.net subdomains — only endpoints
 * with active A/AAAA records and public-facing services are included.
 */
export const serviceCategories: ServiceCategory[] = [
	{
		id: "core",
		name: "Core Platform",
		icon: "Server",
		color: "text-blue-400",
		services: [
			{
				id: "cfx-web",
				name: "cfx.re Website",
				url: "https://cfx.re",
				description: "Main Cfx.re landing page",
			},
			{
				id: "www-fivem",
				name: "www.fivem.net",
				url: "https://www.fivem.net",
				description: "FiveM main website",
				acceptRange: true,
			},
			{
				id: "www-redm",
				name: "www.redm.net",
				url: "https://www.redm.net",
				description: "RedM main website",
				acceptRange: true,
			},
			{
				id: "forum",
				name: "Cfx.re Forum",
				url: "https://forum.cfx.re",
				description: "Community forum (forum.fivem.net)",
			},
			{
				id: "portal",
				name: "Cfx.re Portal",
				url: "https://portal.cfx.re",
				description: "Server management portal",
			},
			{
				id: "keymaster",
				name: "Keymaster",
				url: "https://keymaster.fivem.net",
				description: "License key management",
			},
		],
	},
	{
		id: "game-services",
		name: "Game Services",
		icon: "Gamepad2",
		color: "text-emerald-400",
		services: [
			{
				id: "servers-fivem",
				name: "FiveM Server List",
				url: "https://servers.fivem.net",
				description: "Public server browser API",
				acceptRange: true,
			},
			{
				id: "servers-live",
				name: "RedM Server List",
				url: "https://servers.redm.net",
				description: "Live server listing ingress",
				acceptRange: true,
			},
		],
	},
	{
		id: "runtime",
		name: "Runtime & Builds",
		icon: "Box",
		color: "text-amber-400",
		services: [
			{
				id: "runtime-win",
				name: "Windows Artifacts",
				url: "https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/",
				description: "runtime.fivem.net — Windows builds",
			},
			{
				id: "runtime-linux",
				name: "Linux Artifacts",
				url: "https://runtime.fivem.net/artifacts/fivem/build_proot_linux/master/",
				description: "runtime.fivem.net — Linux builds",
			},
			{
				id: "blacklist-nui",
				name: "NUI Blacklist",
				url: "https://runtime.fivem.net/nui-blacklist.json",
				description: "NUI Blacklist Policy",
				acceptRange: true,
			},
			{
				id: "changelogs",
				name: "Changelogs",
				url: "https://changelogs-live.fivem.net/api/changelog/versions/win32/server",
				description: "changelogs-live.fivem.net",
			},
			{
				id: "mirrors",
				name: "Mirrors",
				url: "https://mirrors.fivem.net",
				description: "mirrors.fivem.net — download mirrors",
				acceptRange: true,
			},
		],
	},
	{
		id: "content",
		name: "Content & Documentation",
		icon: "ShoppingBag",
		color: "text-violet-400",
		services: [
			{
				id: "marketplace",
				name: "Marketplace",
				url: "https://marketplace.cfx.re",
				description: "Official UGC marketplace",
			},
			{
				id: "docs",
				name: "Cfx.re Docs",
				url: "https://docs.fivem.net/docs/",
				description: "docs.fivem.net — official documentation",
			},
			{
				id: "docs-backend",
				name: "Docs Backend",
				url: "https://docs-backend.fivem.net",
				description: "docs-backend.fivem.net",
				acceptRange: true,
			},
			{
				id: "cookbook",
				name: "Cookbook",
				url: "https://cookbook.fivem.net",
				description: "cookbook.fivem.net — recipes & guides",
				acceptRange: true,
			},
		],
	},
	{
		id: "auth",
		name: "Authentication & APIs",
		icon: "ShieldCheck",
		color: "text-rose-400",
		services: [
			{
				id: "lambda",
				name: "Lambda",
				url: "https://lambda.fivem.net",
				description: "lambda.fivem.net — validation endpoint",
				validateResponse: (_status, body) => {
					// Lambda returns 503 but is operational if it has a valid version field
					try {
						const json = JSON.parse(body);
						return typeof json.version === "string" && json.version.length > 0;
					} catch {
						return false;
					}
				},
			},
			{
				id: "idms",
				name: "IDMS",
				url: "https://idms.fivem.net/.well-known/openid-configuration",
				description: "idms.fivem.net — identity management",
				acceptRange: true,
			},
		],
	},
	{
		id: "infra",
		name: "Infrastructure",
		icon: "Boxes",
		color: "text-cyan-400",
		services: [
			{
				id: "git",
				name: "Git",
				url: "https://git.fivem.net",
				description: "git.fivem.net — source repository",
				acceptRange: true,
			},
			{
				id: "sentry",
				name: "Sentry",
				url: "https://sentry.fivem.net",
				description: "sentry.fivem.net — error tracking",
				acceptRange: true,
			},
			{
				id: "crash-ingress",
				name: "Crash Ingress",
				url: "https://crash-ingress.fivem.net",
				description: "crash-ingress.fivem.net — crash reporting",
				acceptRange: true,
			},
		],
	},
];
