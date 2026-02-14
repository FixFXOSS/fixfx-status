import { useState } from "react";
import { cn } from "@/utils/cn";

interface Tab {
	id: string;
	label: string;
	content: React.ReactNode;
}

interface TabsProps {
	tabs: Tab[];
	defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
	const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

	const activeTabContent = tabs.find((t) => t.id === activeTab)?.content;

	return (
		<div className="space-y-6">
			<div className="flex gap-2 border-b border-white/6">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={cn(
							"px-4 py-3 text-sm font-medium border-b-2 transition-colors",
							activeTab === tab.id
								? "border-blue-500 text-white"
								: "border-transparent text-gray-400 hover:text-gray-300",
						)}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div>{activeTabContent}</div>
		</div>
	);
}
