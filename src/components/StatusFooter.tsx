import { Github, Heart } from "lucide-react";

export function StatusFooter() {
	return (
		<footer className="border-t border-white/6 bg-white/1">
			<div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
				<div className="flex flex-col items-center justify-between gap-3 text-xs text-gray-500 sm:flex-row">
					<p className="flex items-center gap-1">
						Made with <Heart size={12} className="text-red-400" /> by{" "}
						<a
							href="https://codemeapixel.dev"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-400 hover:text-white transition-colors underline underline-offset-2"
						>
							CodeMeAPixel
						</a>
					</p>

					<p className="text-center text-gray-600">
						Not affiliated with Cfx.re / Rockstar Games.
					</p>

					<a
						href="https://github.com/FixFXOSS/cfxstat.us"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
						aria-label="View source code on GitHub"
					>
						<Github size={14} />
						Source
					</a>
				</div>
			</div>
		</footer>
	);
}