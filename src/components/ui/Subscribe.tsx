import { Mail, Rss } from "lucide-react";

export function Subscribe() {
	return (
		<div className="rounded-xl border border-white/6 bg-white/2 backdrop-blur-sm p-6 md:p-8">
			<h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>

			<div className="space-y-4">
				<div className="flex items-start gap-4">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/15 shrink-0">
						<Rss size={18} className="text-orange-400" />
					</div>
					<div className="flex-1 min-w-0">
						<h4 className="text-sm font-medium text-white mb-1">RSS Feed</h4>
						<p className="text-xs text-gray-400 mb-2">
							Get incident updates in your favorite RSS reader
						</p>
						<a
							href="/api/status.rss"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors border border-orange-500/20 hover:border-orange-500/40"
						>
							Subscribe to Feed
						</a>
					</div>
				</div>
				<div className="flex items-start gap-4">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15 shrink-0">
						<Mail size={18} className="text-blue-400" />
					</div>
					<div className="flex-1 min-w-0">
						<h4 className="text-sm font-medium text-white mb-1">Email Digest</h4>
						<p className="text-xs text-gray-400">Coming soon</p>
					</div>
				</div>

				<div className="pt-2 border-t border-white/4 text-xs text-gray-500">
					<p>
						Stay informed about Cfx.re service status without spam. Updates only when incidents occur.
					</p>
				</div>
			</div>
		</div>
	);
}
