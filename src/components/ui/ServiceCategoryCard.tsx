import {
	Box,
	Boxes,
	ChevronDown,
	ChevronUp,
	Gamepad2,
	Server,
	ShieldCheck,
	ShoppingBag,
	Zap,
} from "lucide-react";
import { useState } from "react";
import type { CategoryResult, ServiceResult } from "@/types/status";
import { cn } from "@/utils/cn";
import { StatusBadge, statusConfig } from "./StatusBadge";

const iconMap: Record<string, React.ElementType> = {
	Server,
	Gamepad2,
	Box,
	Boxes,
	ShoppingBag,
	ShieldCheck,
};

function formatMs(ms: number | null): string {
	if (ms === null) return "—";
	if (ms < 1000) return `${ms}ms`;
	return `${(ms / 1000).toFixed(1)}s`;
}

function responseTimeColor(ms: number | null): string {
	if (ms === null) return "text-gray-500";
	if (ms < 300) return "text-emerald-400";
	if (ms < 800) return "text-yellow-400";
	if (ms < 2000) return "text-orange-400";
	return "text-red-400";
}

interface ServiceRowProps {
	service: ServiceResult;
}

function ServiceRow({ service }: ServiceRowProps) {
	const cfg = statusConfig[service.status];

	return (
		<div className="flex items-center justify-between gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-white/2">
			<div className="flex items-center gap-3 min-w-0">
				<span
					className={cn("flex h-2.5 w-2.5 rounded-full shrink-0", cfg.dot)}
				/>
				<span className="text-sm font-medium text-gray-200 truncate">
					{service.name}
				</span>
			</div>
			<div className="flex items-center gap-4 shrink-0">
				<div
					className={cn(
						"flex items-center gap-1 text-xs font-mono",
						responseTimeColor(service.responseTime),
					)}
				>
					<Zap size={12} />
					{formatMs(service.responseTime)}
				</div>
				{service.statusCode !== null && (
					<span
						className={cn(
							"text-xs font-mono px-1.5 py-0.5 rounded",
							service.status === "operational"
								? "text-emerald-400/70 bg-emerald-500/10"
								: "text-red-400/70 bg-red-500/10",
						)}
					>
						{service.statusCode}
					</span>
				)}

				<StatusBadge status={service.status} size="sm" showDot={false} />
			</div>
		</div>
	);
}

interface ServiceCategoryCardProps {
	category: CategoryResult;
	defaultOpen?: boolean;
}

export function ServiceCategoryCard({
	category,
	defaultOpen = false,
}: ServiceCategoryCardProps) {
	const [open, setOpen] = useState(defaultOpen);
	const Icon = iconMap[category.icon] ?? Server;
	const cfg = statusConfig[category.overallStatus];

	return (
		<div
			className={cn(
				"rounded-xl border backdrop-blur-sm transition-all duration-300",
				"bg-white/2 border-white/6",
				"hover:border-white/10 hover:bg-white/3",
			)}
		>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="flex w-full items-center justify-between gap-3 p-4 md:p-5"
			>
				<div className="flex items-center gap-3">
					<div
						className={cn(
							"flex h-10 w-10 items-center justify-center rounded-lg",
							cfg.bg,
						)}
					>
						<Icon size={20} className={category.color} />
					</div>
					<div className="text-left">
						<h3 className="text-base font-semibold text-white">
							{category.name}
						</h3>
						<p className="text-xs text-gray-500">
							{category.services.length} service
							{category.services.length !== 1 ? "s" : ""}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<StatusBadge status={category.overallStatus} size="sm" />
					{open ? (
						<ChevronUp size={16} className="text-gray-500" />
					) : (
						<ChevronDown size={16} className="text-gray-500" />
					)}
				</div>
			</button>
			{open && (
				<div className="border-t border-white/4 px-2 pb-2">
					{category.services.map((svc) => (
						<ServiceRow key={svc.id} service={svc} />
					))}
				</div>
			)}
		</div>
	);
}
