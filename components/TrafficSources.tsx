"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useState } from "react";

const trafficData = [
	{
		platform: "IOS",
		value: 143382,
		color: "#8B5CF6",
		barCount: 50,
	},
	{
		platform: "Android",
		value: 87974,
		color: "#34D399",
		barCount: 40,
	},
	{
		platform: "Web",
		value: 87974,
		color: "#F59E0B",
		barCount: 50,
	},
];

function TrafficSources() {
	const [selectedRange, setSelectedRange] = useState("last_12_months");

	const renderBars = (filled: number, total: number, color: string) => {
		return (
			<div className="flex flex-wrap gap-1 mt-2">
				{Array.from({ length: total }).map((_, index) => (
					<div
						key={index}
						className="w-[6px] h-12 rounded-sm"
						style={{
							backgroundColor: index < filled ? color : "#E5E7EB",
						}}
					/>
				))}
			</div>
		);
	};

	return (
		<div className="p-5 bg-white rounded-xl border border-gray-200 w-full">
			{/* Header */}
			<div className="flex justify-between items-center mb-5">
				<div className="flex items-center gap-2">
					<Image src="/images/info.png" alt="icon" width={18} height={18} />
					<h2 className="text-sm font-medium text-gray-800">Traffic Sources</h2>
				</div>

				<Select onValueChange={setSelectedRange} defaultValue={selectedRange}>
					<SelectTrigger className="w-[150px] h-8 text-xs border rounded-lg px-3">
						<SelectValue placeholder="Last 12 months" />
					</SelectTrigger>
					<SelectContent className="bg-white">
						<SelectGroup>
							<SelectItem value="last_12_months">Last 12 months</SelectItem>
							<SelectItem value="last_6_months">Last 6 months</SelectItem>
							<SelectItem value="last_3_months">Last 3 months</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>

			{/* Body */}
			<div className="space-y-6">
				{trafficData.map(({ platform, value, color, barCount }, idx) => (
					<div key={idx} className="mt-4">
						{/* Platform header */}
						<div className="flex justify-between items-center ">
							<p className="text-sm text-gray-800">
								Total user from {platform}
							</p>
							<p className="text-sm font-semibold text-gray-900">
								{value.toLocaleString()}
							</p>
						</div>

						{/* Bars */}
						{renderBars(
							Math.round((barCount * value) / 150000),
							barCount,
							color
						)}

						{/* Divider */}
						{idx < trafficData.length - 1 && (
							<hr className="my-4 border-gray-200" />
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default TrafficSources;
