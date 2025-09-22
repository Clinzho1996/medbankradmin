"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

type ApiResponse = {
	status: boolean;
	message: string;
	data: {
		total_logins: number;
		platforms: {
			web: { count: number; percentage: number };
			android: { count: number; percentage: number };
			ios: { count: number; percentage: number };
			unknown: { count: number; percentage: number };
		};
	};
};

function TrafficSources() {
	const [selectedRange, setSelectedRange] = useState("last_12_months");
	const [trafficData, setTrafficData] = useState<
		{ platform: string; value: number; color: string; barCount: number }[]
	>([]);
	const [isLoading, setIsLoading] = useState(false);
	const maxValue = Math.max(...trafficData.map((item) => item.value), 1);

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

	useEffect(() => {
		const fetchTrafficData = async () => {
			setIsLoading(true);
			try {
				const session = await getSession();
				if (!session?.accessToken) {
					console.error("No access token found.");
					setIsLoading(false);
					return;
				}

				const response = await axios.get<ApiResponse>(
					`https://api.medbankr.ai/api/v1/administrator/dashboard/traffic?preiod=all`,
					{
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${session.accessToken}`,
						},
					}
				);

				const platforms = response.data.data.platforms;
				const formattedData = [
					{
						platform: "IOS",
						value: platforms.ios.count,
						color: "#8B5CF6",
						barCount: 50,
					},
					{
						platform: "Android",
						value: platforms.android.count,
						color: "#34D399",
						barCount: 50,
					},
					{
						platform: "Web",
						value: platforms.web.count,
						color: "#F59E0B",
						barCount: 50,
					},
				];

				setTrafficData(formattedData);
			} catch (error) {
				console.error("Error fetching traffic data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTrafficData();
	}, []);

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
				{isLoading ? (
					<p className="text-sm text-gray-500">Loading traffic data...</p>
				) : (
					trafficData.map(({ platform, value, color, barCount }, idx) => (
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

							{renderBars(
								Math.round((barCount * value) / maxValue), // scale relative to largest value
								barCount,
								color
							)}

							{/* Divider */}
							{idx < trafficData.length - 1 && (
								<hr className="my-4 border-gray-200" />
							)}
						</div>
					))
				)}
			</div>
		</div>
	);
}

export default TrafficSources;
