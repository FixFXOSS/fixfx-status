import { Mail, Rss, Send, Trash2, Play } from "lucide-react";
import { useState, useEffect } from "react";

interface Webhook {
	id: string;
	name: string;
	createdAt: string;
	lastTestedAt?: string;
	lastTestSuccess?: boolean;
}

export function Subscribe() {
	const [webhookUrl, setWebhookUrl] = useState("");
	const [webhookName, setWebhookName] = useState("");
	const [webhooks, setWebhooks] = useState<Webhook[]>([]);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
	const [testingId, setTestingId] = useState<string | null>(null);

	const loadWebhooks = async () => {
		try {
			const response = await fetch("/api/webhooks");
			const data = await response.json();
			setWebhooks(data.webhooks || []);
		} catch (error) {
			console.error("Failed to load webhooks:", error);
		}
	};

	useEffect(() => {
		loadWebhooks();
	}, []);

	const addWebhook = async (e: any) => {
		e.preventDefault();
		const url = webhookUrl.trim();
		const name = webhookName.trim();

		if (!url || !name) {
			setMessage({ type: "error", text: "Please fill in all fields" });
			return;
		}

		setLoading(true);
		setMessage(null);

		try {
			const response = await fetch("/api/webhooks", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ url, name }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to add webhook");
			}

			setMessage({ type: "success", text: "Webhook added! Remember to test it before relying on it." });
			setWebhookUrl("");
			setWebhookName("");
			await loadWebhooks();
		} catch (error) {
			setMessage({
				type: "error",
				text: error instanceof Error ? error.message : "Failed to add webhook",
			});
		} finally {
			setLoading(false);
		}
	};

	const testWebhook = async (id: string) => {
		setTestingId(id);
		try {
			const response = await fetch("/api/webhooks/test", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});

			const data = await response.json();

			if (!response.ok) {
				// Handle rate limiting
				if (response.status === 429) {
					const retryAfter = data.retryAfter || 60;
					setMessage({
						type: "error",
						text: `Rate limited. Please wait ${retryAfter} seconds before testing again.`,
					});
				} else {
					setMessage({
						type: "error",
						text: data.error || "Failed to send test message",
					});
				}
				return;
			}

			setMessage({ type: "success", text: "Test sent! Check your Discord server." });
			await loadWebhooks();
		} catch (error) {
			setMessage({ type: "error", text: "Failed to send test. Check webhook URL validity." });
		} finally {
			setTestingId(null);
		}
	};

	const deleteWebhook = async (id: string) => {
		if (!confirm("Delete this webhook?")) return;

		try {
			const response = await fetch(`/api/webhooks?id=${id}`, { method: "DELETE" });
			if (!response.ok) throw new Error("Failed to delete");

			setMessage({ type: "success", text: "Webhook removed" });
			await loadWebhooks();
		} catch (error) {
			setMessage({ type: "error", text: "Failed to delete webhook" });
		}
	};

	return (
		<div className="rounded-xl border border-white/6 bg-white/2 backdrop-blur-sm p-6 md:p-8">
			<h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>

			<div className="space-y-6">
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
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 shrink-0">
						<Send size={18} className="text-indigo-400" />
					</div>
					<div className="flex-1 min-w-0">
						<h4 className="text-sm font-medium text-white mb-3">Discord Webhooks</h4>
						<p className="text-xs text-gray-400 mb-3">
							Receive instant notifications in Discord when incidents occur
						</p>

						<form onSubmit={addWebhook} className="space-y-2 mb-4">
							<input
								type="text"
								placeholder="Webhook name (e.g., 'alerts-channel')"
								value={webhookName}
								onChange={(e) => setWebhookName(e.currentTarget.value)}
								disabled={loading}
								className="w-full px-3 py-2 text-xs rounded-lg bg-white/4 border border-white/8 text-white placeholder-gray-500 focus:border-indigo-500/50 focus:outline-none disabled:opacity-50"
							/>
							<input
								type="text"
								placeholder="Discord webhook URL"
								value={webhookUrl}
								onChange={(e) => setWebhookUrl(e.currentTarget.value)}
								disabled={loading}
								className="w-full px-3 py-2 text-xs rounded-lg bg-white/4 border border-white/8 text-white placeholder-gray-500 focus:border-indigo-500/50 focus:outline-none disabled:opacity-50"
							/>
							<button
								type="submit"
								disabled={loading}
								className="w-full px-3 py-1.5 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? "Adding..." : "Add Webhook"}
							</button>
						</form>

						{message && (
							<div
								className={`text-xs p-2 rounded mb-3 ${
									message!.type === "success"
										? "bg-green-500/10 text-green-400 border border-green-500/20"
										: "bg-red-500/10 text-red-400 border border-red-500/20"
								}`}
							>
								{message!.text}
							</div>
						)}

						{webhooks.length > 0 && (
							<div className="space-y-2">
								<p className="text-xs text-gray-500 font-medium">
									Active webhooks ({webhooks.length}/10)
								</p>
								{webhooks.map((webhook) => (
									<div
										key={webhook.id}
										className="flex items-center justify-between p-2 rounded-lg bg-white/2 border border-white/4"
									>
										<div className="flex-1 min-w-0">
											<p className="text-xs font-medium text-white truncate">{webhook.name}</p>
											<p className="text-xs text-gray-500">
												Created {new Date(webhook.createdAt).toLocaleDateString()}
											</p>
											{webhook.lastTestedAt && (
												<p
													className={`text-xs ${
														webhook.lastTestSuccess ? "text-green-400" : "text-red-400"
													}`}
												>
													Last tested: {new Date(webhook.lastTestedAt).toLocaleString()}
												</p>
											)}
										</div>
										<div className="flex gap-1">
											<button
												onClick={() => testWebhook(webhook.id)}
												disabled={testingId === webhook.id}
												className="p-1.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors disabled:opacity-50"
												title="Test webhook"
											>
												<Play size={14} />
											</button>
											<button
												onClick={() => deleteWebhook(webhook.id)}
												className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
												title="Delete webhook"
											>
												<Trash2 size={14} />
											</button>
										</div>
									</div>
								))}
							</div>
						)}
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
