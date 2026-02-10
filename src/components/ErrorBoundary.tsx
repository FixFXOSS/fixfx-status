import { Link, ErrorComponent, ErrorComponentProps } from "@tanstack/react-router";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";

export function ErrorBoundary({ error, reset }: ErrorComponentProps) {
	const isDev = import.meta.env.DEV;

	return (
		<div className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
			<BackgroundEffects />

			<div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
				<div className="max-w-3xl w-full text-center space-y-8">
					{/* Error Icon */}
					<div className="relative inline-flex">
						<div className="relative">
							<AlertTriangle
								size={120}
								className="text-red-500 animate-pulse-slow"
								strokeWidth={1.5}
							/>
							<div className="absolute inset-0 blur-2xl bg-red-500/30 -z-10" />
						</div>
					</div>

					{/* Error Message */}
					<div className="space-y-4">
						<h1 className="text-4xl md:text-5xl font-bold text-white">
							Something Went Wrong
						</h1>
						<p className="text-gray-400 text-lg max-w-xl mx-auto">
							We encountered an unexpected error. Don't worry, our team has been
							notified. Please try refreshing the page or return home.
						</p>
					</div>

					{/* Error Details (Dev Only) */}
					{isDev && error && (
						<div className="mt-8 p-6 rounded-xl bg-red-950/20 border border-red-900/30 backdrop-blur-sm text-left max-w-2xl mx-auto">
							<p className="text-red-400 font-mono text-sm mb-3 font-semibold">
								Development Error Details:
							</p>
							<div className="space-y-2">
								<p className="text-red-300 font-mono text-xs">
									<strong>Message:</strong> {error.message}
								</p>
								{error.stack && (
									<pre className="text-red-300/70 font-mono text-xs overflow-x-auto whitespace-pre-wrap wrap-break-word">
										{error.stack}
									</pre>
								)}
							</div>
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
						<button
							type="button"
							onClick={() => {
								reset();
								window.location.reload();
							}}
							className="group relative px-8 py-4 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-105 w-full sm:w-auto"
						>
							<div className="relative z-10 flex items-center justify-center gap-2">
								<RefreshCw size={20} />
								<span>Try Again</span>
							</div>          
							<div className="absolute inset-0 bg-linear-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						</button>

						<Link
							to="/"
							className="group relative px-8 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/20 w-full sm:w-auto"
						>
							<div className="relative z-10 flex items-center justify-center gap-2">
								<Home size={20} />
								<span>Back to Home</span>
							</div>
						</Link>
					</div>

					{/* Help Text */}
					<div className="pt-8 space-y-2">
						<p className="text-gray-500 text-sm">
							If this issue persists, please contact us at{" "}
							<a
								href="mailto:hey@codemeapixel.dev"
								className="text-blue-400 hover:text-blue-300 transition-colors underline"
							>
								hey@codemeapixel.dev
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
