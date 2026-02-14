import { useState } from "react";

export function BackgroundEffects() {
	const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

	const handleMouseMove = (e: React.MouseEvent) => {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		setMousePos({
			x: ((e.clientX - rect.left) / rect.width) * 100,
			y: ((e.clientY - rect.top) / rect.height) * 100,
		});
	};

	return (
		// biome-ignore lint: pointer-events: none prevents actual interaction
		<div
			className="fixed inset-0 z-0 pointer-events-auto"
			onMouseMove={handleMouseMove}
			style={{ pointerEvents: "none" }}
			role="presentation"
		>
			{/* Base gradient */}
			<div className="absolute inset-0 bg-linear-to-b from-background via-[#0d0d0f] to-background" />

			{/* Subtle grid */}
			<div
				className="absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
						linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
					backgroundSize: "40px 40px",
				}}
			/>

			{/* Dynamic glow orbs */}
			<div
				className="absolute w-150 h-150 rounded-full blur-[120px] opacity-[0.07] transition-all duration-2000 ease-out"
				style={{
					background:
						"radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent 70%)",
					left: `${mousePos.x - 15}%`,
					top: `${mousePos.y - 15}%`,
				}}
			/>

			<div className="absolute top-[10%] right-[5%] w-72 h-72 bg-blue-500/4 rounded-full blur-3xl animate-float" />
			<div className="absolute bottom-[15%] left-[10%] w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-float-delayed" />
			<div className="absolute top-[60%] right-[15%] w-64 h-64 bg-cyan-400/3 rounded-full blur-3xl animate-float-slow" />

			{/* Noise texture overlay */}
			<div className="absolute inset-0 opacity-[0.015] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIxIi8+PC9zdmc+')]" />
		</div>
	);
}
