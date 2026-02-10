import { Link, createFileRoute } from "@tanstack/react-router";
import { Home, ArrowLeft } from "lucide-react";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";

export const Route = createFileRoute("/$")({
	component: NotFoundPage,
});

function NotFoundPage() {
	return (
		<div className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
			<BackgroundEffects />

			<div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
				<div className="max-w-2xl w-full text-center space-y-8">
					{/* 404 Display */}
					<div className="relative">
						<h1 className="text-[180px] font-bold leading-none bg-clip-text text-transparent bg-linear-to-br from-blue-400 via-cyan-400 to-blue-600 animate-pulse-slow">
							404
						</h1>
						<div className="absolute inset-0 blur-3xl bg-blue-500/20 -z-10" />
					</div>

					{/* Error Message */}
					<div className="space-y-4">
						<h2 className="text-3xl md:text-4xl font-bold text-white">
							Page Not Found
						</h2>
						<p className="text-gray-400 text-lg max-w-md mx-auto">
							The page you're looking for doesn't exist or has been moved. Let's
							get you back on track.
						</p>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
						<Link
							to="/"
						className="group relative px-8 py-4 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-105 w-full sm:w-auto"
					>
						<div className="relative z-10 flex items-center justify-center gap-2">
							<Home size={20} />
							<span>Back to Home</span>
						</div>
						<div className="absolute inset-0 bg-linear-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						</Link>

						<button
							type="button"
							onClick={() => window.history.back()}
							className="group relative px-8 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/20 w-full sm:w-auto"
						>
							<div className="relative z-10 flex items-center justify-center gap-2">
								<ArrowLeft size={20} />
								<span>Go Back</span>
							</div>
						</button>
					</div>

					{/* Helpful Links */}
					<div className="pt-8 space-y-3">
						<p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">
							Quick Links
						</p>
						<div className="flex flex-wrap gap-3 justify-center">
							<Link
								to="/"
								hash="community"
								className="px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 text-sm hover:bg-white/10 hover:text-white transition-all duration-200"
							>
								Community Resources
							</Link>
							<Link
								to="/"
								hash="tools"
								className="px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 text-sm hover:bg-white/10 hover:text-white transition-all duration-200"
							>
								Tools & Guides
							</Link>
							<Link
								to="/"
								hash="support"
								className="px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 text-sm hover:bg-white/10 hover:text-white transition-all duration-200"
							>
								Support Servers
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
