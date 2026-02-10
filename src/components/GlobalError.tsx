import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export function GlobalError() {
	return (
		<html lang="en" className="dark">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Error | FixFX Links</title>
				<style
					dangerouslySetInnerHTML={{
						__html: `
							* {
								margin: 0;
								padding: 0;
								box-sizing: border-box;
							}
							body {
								font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
								background: #0a0a0f;
								color: #fff;
								display: flex;
								align-items: center;
								justify-content: center;
								min-height: 100vh;
								padding: 2rem;
							}
							.container {
								max-width: 42rem;
								text-align: center;
								position: relative;
								z-index: 10;
							}
							.icon-wrapper {
								display: inline-flex;
								margin-bottom: 2rem;
								position: relative;
							}
							.icon {
								width: 120px;
								height: 120px;
								color: #ef4444;
								animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
							}
							.glow {
								position: absolute;
								inset: 0;
								background: radial-gradient(circle, rgba(239, 68, 68, 0.3), transparent 70%);
								filter: blur(40px);
								z-index: -1;
							}
							h1 {
								font-size: 2.5rem;
								font-weight: 700;
								margin-bottom: 1rem;
								background: linear-gradient(135deg, #ef4444, #dc2626);
								-webkit-background-clip: text;
								-webkit-text-fill-color: transparent;
								background-clip: text;
							}
							p {
								color: #9ca3af;
								font-size: 1.125rem;
								margin-bottom: 2rem;
								line-height: 1.6;
							}
							.button-group {
								display: flex;
								flex-direction: column;
								gap: 1rem;
								align-items: center;
							}
							.button {
								display: inline-flex;
								align-items: center;
								gap: 0.5rem;
								padding: 1rem 2rem;
								border-radius: 0.75rem;
								font-weight: 600;
								font-size: 1.125rem;
								cursor: pointer;
								transition: all 0.3s;
								text-decoration: none;
								border: none;
								width: 100%;
								max-width: 300px;
								justify-content: center;
							}
							.button-primary {
								background: linear-gradient(135deg, #3b82f6, #06b6d4);
								color: white;
							}
							.button-primary:hover {
								transform: scale(1.05);
								box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
							}
							.button-secondary {
								background: rgba(255, 255, 255, 0.05);
								backdrop-filter: blur(10px);
								border: 1px solid rgba(255, 255, 255, 0.1);
								color: white;
							}
							.button-secondary:hover {
								background: rgba(255, 255, 255, 0.1);
								border-color: rgba(255, 255, 255, 0.2);
							}
							@keyframes pulse {
								0%, 100% {
									opacity: 1;
								}
								50% {
									opacity: 0.5;
								}
							}
							@media (min-width: 640px) {
								.button-group {
									flex-direction: row;
									justify-content: center;
								}
							}
							.bg-effects {
								position: fixed;
								inset: 0;
								z-index: 0;
								overflow: hidden;
							}
							.grid {
								position: absolute;
								inset: 0;
								opacity: 0.03;
								background-image: linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
									linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px);
								background-size: 40px 40px;
							}
							.orb {
								position: absolute;
								border-radius: 50%;
								filter: blur(80px);
								opacity: 0.1;
							}
							.orb-1 {
								top: 10%;
								right: 5%;
								width: 300px;
								height: 300px;
								background: #3b82f6;
								animation: float 20s ease-in-out infinite;
							}
							.orb-2 {
								bottom: 15%;
								left: 10%;
								width: 400px;
								height: 400px;
								background: #9333ea;
								animation: float 25s ease-in-out infinite reverse;
							}
							@keyframes float {
								0%, 100% {
									transform: translateY(0px) rotate(0deg);
								}
								50% {
									transform: translateY(-20px) rotate(5deg);
								}
							}
						`,
					}}
				/>
			</head>
			<body>
				<div className="bg-effects">
					<div className="grid" />
					<div className="orb orb-1" />
					<div className="orb orb-2" />
				</div>

				<div className="container">
					<div className="icon-wrapper">
						<svg
							className="icon"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="1.5"
						>
							<title>Error Icon</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
							/>
						</svg>
						<div className="glow" />
					</div>

					<h1>Critical Error</h1>
					<p>
						Something went seriously wrong. Please refresh the page or return to
						the home page.
					</p>

					<div className="button-group">
						<button
							type="button"
							className="button button-primary"
							onClick={() => window.location.reload()}
						>
							<svg
								width="20"
								height="20"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<title>Refresh</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
								/>
							</svg>
							<span>Refresh Page</span>
						</button>

						<a href="/" className="button button-secondary">
							<svg
								width="20"
								height="20"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<title>Home</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
								/>
							</svg>
							<span>Go Home</span>
						</a>
					</div>
				</div>
			</body>
		</html>
	);
}
