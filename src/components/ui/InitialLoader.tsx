import { Activity, CheckCircle2, Loader2, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import { serviceCategories } from "@/data/services";
import { cn } from "@/utils/cn";

const totalServices = serviceCategories.reduce(
	(sum, cat) => sum + cat.services.length,
	0,
);

/** How long each step lingers before moving to the next. */
const STEP_INTERVAL_MS = 1_800;

/**
 * Engaging initial loader shown while the first status check runs.
 * Cycles through service categories to show what's being probed.
 */
export function InitialLoader() {
	const [activeStep, setActiveStep] = useState(0);
	const [dots, setDots] = useState("");

	// Cycle through categories
	useEffect(() => {
		const interval = setInterval(() => {
			setActiveStep((prev) => {
				if (prev >= serviceCategories.length - 1) return prev;
				return prev + 1;
			});
		}, STEP_INTERVAL_MS);
		return () => clearInterval(interval);
	}, []);

	// Animate ellipsis
	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev.length >= 3 ? "" : `${prev}.`));
		}, 400);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex flex-col items-center justify-center py-16 gap-8 animate-in fade-in duration-500">
			{/* Pulse icon */}
			<div className="relative">
				<div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
				<div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20">
					<Activity size={28} className="text-blue-400" />
				</div>
			</div>

			{/* Title */}
			<div className="text-center space-y-2">
				<h2 className="text-lg font-semibold text-white">
					Running Status Checks{dots}
				</h2>
				<p className="text-sm text-gray-500 max-w-xs">
					Probing {totalServices} endpoints across {serviceCategories.length}{" "}
					categories. This may take a few seconds.
				</p>
			</div>

			{/* Category checklist */}
			<div className="w-full max-w-sm space-y-2">
				{serviceCategories.map((cat, idx) => {
					const isDone = idx < activeStep;
					const isCurrent = idx === activeStep;

					return (
						<div
							key={cat.id}
							className={cn(
								"flex items-center gap-3 rounded-lg border px-4 py-2.5 transition-all duration-500",
								isDone &&
									"border-emerald-500/15 bg-emerald-500/5 text-emerald-400",
								isCurrent &&
									"border-blue-500/20 bg-blue-500/5 text-blue-400 shadow-sm shadow-blue-500/5",
								!isDone &&
									!isCurrent &&
									"border-white/5 bg-white/2 text-gray-600",
							)}
						>
							{/* Icon */}
							<div className="shrink-0">
								{isDone ? (
									<CheckCircle2 size={16} className="text-emerald-400" />
								) : isCurrent ? (
									<Loader2 size={16} className="animate-spin text-blue-400" />
								) : (
									<Radio size={16} className="text-gray-600" />
								)}
							</div>

							{/* Label */}
							<span
								className={cn(
									"text-sm font-medium transition-colors duration-300",
									isDone && "text-emerald-400/80",
									isCurrent && "text-blue-300",
									!isDone && !isCurrent && "text-gray-600",
								)}
							>
								{cat.name}
							</span>

							{/* Service count */}
							<span
								className={cn(
									"ml-auto text-xs tabular-nums",
									isDone && "text-emerald-500/50",
									isCurrent && "text-blue-500/50",
									!isDone && !isCurrent && "text-gray-700",
								)}
							>
								{cat.services.length}{" "}
								{cat.services.length === 1 ? "service" : "services"}
							</span>
						</div>
					);
				})}
			</div>

			{/* Subtle footer */}
			<p className="text-[11px] text-gray-600 text-center">
				Checks run concurrently with retry &amp; rate-limit handling
			</p>
		</div>
	);
}
