import { AlertCircle, Check, CheckCircle2, XCircle } from "lucide-react";
import type { Incident } from "@/types/status";
import { cn } from "@/utils/cn";

interface IncidentHistoryProps {
	incidents: Incident[];
	isLoading?: boolean;
}

function formatTimeAgo(date: Date): string {
	const now = new Date();
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (seconds < 60) return `${seconds}s ago`;
	if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
	if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
	return `${Math.floor(seconds / 86400)}d ago`;
}

interface IncidentHistoryProps {
	incidents: Incident[];
	isLoading?: boolean;
}

export function IncidentHistory({ incidents, isLoading = false }: IncidentHistoryProps) {
	if (isLoading) {
		return (
			<div className="rounded-xl border border-white/6 bg-white/3 p-6">
				<h2 className="text-lg font-semibold text-white mb-4">Recent Incidents</h2>
				<div className="space-y-3">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="animate-pulse h-16 bg-white/5 rounded-lg" />
					))}
				</div>
			</div>
		);
	}

	if (incidents.length === 0) {
		return (
			<div className="rounded-xl border border-white/6 bg-white/3 p-6">
				<h2 className="text-lg font-semibold text-white mb-4">Recent Incidents</h2>
				<div className="flex items-center justify-center gap-2 text-gray-400 py-8">
					<CheckCircle2 size={16} />
					<span>No incidents recorded</span>
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-xl border border-white/6 bg-white/3 p-6">
			<h2 className="text-lg font-semibold text-white mb-4">Recent Incidents</h2>
			<div className="space-y-3 max-h-96 overflow-y-auto">
				{incidents.map((incident) => (
					<IncidentCard key={incident.id} incident={incident} />
				))}
			</div>
		</div>
	);
}

function IncidentCard({ incident }: { incident: Incident }) {
	const impactColors = {
		minor: "text-yellow-400 bg-yellow-500/10",
		major: "text-orange-400 bg-orange-500/10",
		critical: "text-red-400 bg-red-500/10",
	};

	const statusIcons = {
		operational: <Check size={14} className="text-emerald-400" />,
		degraded: <AlertCircle size={14} className="text-yellow-400" />,
		partial: <AlertCircle size={14} className="text-orange-400" />,
		major: <XCircle size={14} className="text-red-400" />,
		unknown: <AlertCircle size={14} className="text-gray-400" />,
	};

	const startTime = new Date(incident.startedAt);
	const endTime = incident.resolvedAt ? new Date(incident.resolvedAt) : null;

	return (
		<div className="border border-white/6 bg-white/2 rounded-lg p-4 hover:bg-white/3 transition-colors">
			<div className="flex items-start justify-between gap-3 mb-2">
				<div className="flex-1 min-w-0">
					<h3 className="text-sm font-medium text-white truncate">{incident.title}</h3>
					<p className="text-xs text-gray-500">{incident.serviceName}</p>
				</div>
				<span
					className={cn(
						"px-2 py-1 rounded text-xs font-medium shrink-0",
						impactColors[incident.impact],
					)}
				>
					{incident.impact}
				</span>
			</div>

			<div className="flex items-center gap-2 mb-3">
				<div className="flex items-center gap-1 text-xs text-gray-400">
					{statusIcons[incident.status]}
					<span className="capitalize">{incident.status}</span>
				</div>
				{incident.autoDetected && (
					<span className="px-1.5 py-0.5 text-xs bg-blue-500/10 text-blue-400 rounded">
						Auto-detected
					</span>
				)}
			</div>

			<div className="text-xs text-gray-500 space-y-1">
				<div>
					Started: {formatTimeAgo(startTime)}
				</div>
				{endTime && (
					<div>
						Resolved: {formatTimeAgo(endTime)}
					</div>
				)}
			</div>

			{incident.description && (
				<p className="text-xs text-gray-400 mt-3">{incident.description}</p>
			)}
		</div>
	);
}
