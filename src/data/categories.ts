import type { LinkCategory } from "@/types/links";

export const categories: LinkCategory[] = [
	{
		id: "community",
		name: "Community",
		icon: "Users",
		color: "text-purple-500",
		links: [
			{
				id: "discord-server",
				title: "Discord Server",
				url: "https://discord.gg/cYauqJfnNK",
				icon: "/discord.png",
				description: "Join our community on Discord",
				color: "bg-indigo-500",
			},
			{
				id: "github-repo",
				title: "GitHub Repository",
				url: "https://github.com/CodeMeAPixel/FixFX",
				icon: "Github",
				description: "Contribute to the FixFX project",
				color: "bg-gray-700",
			},
			{
				id: "cfx-forum",
				title: "CFX.re Forum",
				url: "https://forum.cfx.re",
				icon: "MessagesSquare",
				description: "Official Cfx.re community forum",
				color: "bg-orange-500",
			},
            {
                id: "cfx-portal",
                title: "CFX.re Portal",
                url: "https://portal.cfx.re",
                icon: "/fivem.png",
                description: "Your hub for managing servers, assets and subscriptions.",
                color: "bg-pink-500"
            },
            {
                id: "cfx-marketplace",
                title: "CFX.re Marketplace",
                url: "https://marketplace.cfx.re/",
                icon: "/fivem.png",
                description: "The Official Rockstar Modding UGC Marketplace for RedM & FiveM.",
                color: "bg-pink-500"
            }
		],
	},
	{
		id: "tools",
		name: "Tools & Guides",
		icon: "Wrench",
		color: "text-green-500",
		links: [
			{
				id: "cfx",
				title: "CitizenFX Documentation",
				url: "https://fixfx.wiki/docs/cfx",
				icon: "/fivem.png",
				description: "An introduction to the CFX Ecosystem.",
				color: "bg-pink-500",
			},
			{
				id: "txadmin",
				title: "txAdmin Documentation",
				url: "https://fixfx.wiki/docs/txadmin",
				icon: "/txadmin.png",
				description: "Unofficial guides and documentation for txAdmin.",
				color: "bg-emerald-500",
			},
			{
				id: "vmenu",
				title: "vMenu Documentation",
				url: "https://fixfx.wiki/docs/vmenu",
				icon: "/vespura.png",
				description: "Unofficial guides and documentation for vMenu.",
				color: "bg-violet-500",
			},
            {
                id: "frameworks",
                title: "Framework Documentation",
                url: "https://fixfx.wiki/docs/frameworks",
                icon: "BookOpen",
                description: "Unofficial guides and documentation for ESX, QBCore and more.",
                color: "bg-blue-500"
            },
            {
                id: "yorick",
                title: "Yorick Documentation",
                url: "https://docs.yorick.gg",
                icon: "BookOpen",
                description: "Community documentation to learn the basics of running a FiveM server",
                color: "bg-rose-500"
            }
		],
	},
    {
		id: "servers",
		name: "Support Servers",
		icon: "Wrench",
		color: "text-green-500",
		links: [
			{
				id: "txadmin",
				title: "txAdmin / txHub",
				url: "http://discord.gg/txadmin",
				icon: "/txadmin.png",
				description: "Join the txAdmin Discord Community.",
				color: "bg-green-500",
			},
			{
				id: "cfx-re",
				title: "CFX.re Project Hub",
				url: "http://discord.gg/fivem",
				icon: "/fivem.png",
				description: "Join the CFX.re Discord Community (FiveM/RedM).",
				color: "bg-pink-500",
			},
			{
				id: "vmenu",
				title: "Vespura's Coding Hub",
				url: "https://discord.gg/vespura-s-coding-paradise-285424882534187008",
				icon: "/vespura.png",
				description: "Join the Vespura Discord Community (vMenu).",
				color: "bg-purple-500",
			},
            {
                id: "ox",
                title: "Community OX",
                url: "https://discord.gg/u2nR76kTmC",
                icon: "/ox.png",
                description: "Join the OX Discord Community",
                color: "bg-red-500"
            },
            {
                id: "esx",
                title: "ESX",
                url: "https://discord.gg/P49McFapPP",
                icon: "/esx.png",
                description: "Join the ESX Discord Community",
                color: "bg-orange-500"
            },
            {
                id: "qbcore",
                title: "QBCore",
                url: "https://discord.gg/qbcore",
                icon: "/qbcore.webp",
                description: "Join the QBCore Discord Community",
                color: "bg-pink-500"
            },
            {
                id: "qbox",
                title: "Qbox Project",
                url: "https://discord.gg/qbox",
                icon: "/duck.png",
                description: "Join the Qbox Project Discord Community",
                color: "bg-yellow-500"
            },
            {
                id: "vorp",
                title: "VORP Core",
                url: "https://discord.gg/vorp-core",
                icon: "/vorp.png",
                description: "Join the VORP Core Discord Community",
                color: "bg-amber-600"
            }
		],
	},
];
