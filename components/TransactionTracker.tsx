"use client";

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { IconRectangleFilled } from "@tabler/icons-react";
import axios from "axios";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Skeleton } from "./ui/skeleton";

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

interface ApiResponse {
	month: number;
	total_amount: string;
	total_users: string;
}

function TransactionTracker() {
	const [chartData, setChartData] = useState<
		{ month: string; totalAmount: number; totalUsers: number }[]
	>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedYear, setSelectedYear] = useState<string>(
		new Date().getFullYear().toString()
	);

	const fetchTransactionData = async () => {
		try {
			setIsLoading(true);
			const session = await getSession();

			if (!session?.accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}

			const response = await axios.get<ApiResponse[]>(
				`https://api.kuditrak.ng/api/v1/analytics/transactions-graph/${selectedYear}`,
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${session?.accessToken}`,
					},
				}
			);

			const dataMap = new Map(
				months.map((month) => [month, { totalAmount: 0, totalUsers: 0 }])
			);

			response.data.forEach((item) => {
				const monthIndex = item.month - 1;
				if (monthIndex >= 0 && monthIndex < 12) {
					dataMap.set(months[monthIndex], {
						totalAmount: parseFloat(item.total_amount),
						totalUsers: parseInt(item.total_users, 10),
					});
				}
			});

			const formattedData = Array.from(dataMap, ([month, values]) => ({
				month,
				...values,
			}));

			console.log("Transaction Data:", formattedData);
			setChartData(formattedData);
		} catch (error) {
			console.error("Error fetching transaction data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTransactionData();
	}, [selectedYear]);

	const chartConfig = {
		Users: {
			label: "Total Users",
			color: "hsl(var(--chart-1))",
		},
		Transaction: {
			label: "Total Transactions",
			color: "hsl(var(--chart-2))",
		},
	} satisfies ChartConfig;

	const formatBalance = (amount: number) => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
		}).format(amount ?? 0);
	};

	return (
		<div className="p-3 bg-white rounded-lg border border-[#E2E4E9]">
			<div className="flex flex-row justify-between items-center border-b-[1px] border-b-[#E2E4E9] py-2">
				<div className="flex flex-row justify-start gap-2 items-center">
					<Image src="/images/info.png" alt="info" width={20} height={20} />
					<p className="text-sm font-normal text-black">
						User Activity Overview
					</p>
				</div>
				<div className="flex flex-row justify-end gap-3 items-center">
					<Select onValueChange={setSelectedYear}>
						<SelectTrigger className="w-[120px]">
							<SelectValue placeholder="Select Year" />
						</SelectTrigger>
						<SelectContent className="bg-white">
							<SelectGroup className="bg-white">
								{Array.from({ length: 3 }, (_, i) => (
									<SelectItem
										key={i}
										value={(new Date().getFullYear() - i).toString()}>
										{new Date().getFullYear() - i}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</div>

			{isLoading ? (
				<div className="flex items-center space-x-4 w-full mt-4">
					<Skeleton className="h-12 bg-slate-300 w-12 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-4 bg-slate-300 w-[250px]" />
						<Skeleton className="h-4 bg-slate-300 w-[200px]" />
					</div>
				</div>
			) : (
				<div className="py-3 h-fit">
					<ChartContainer config={chartConfig}>
						<LineChart
							height={200}
							data={chartData}
							margin={{ top: 10, left: 12, right: 12, bottom: 10 }}>
							<CartesianGrid vertical={false} horizontal={true} />
							<XAxis
								dataKey="month"
								tickLine={false}
								axisLine={false}
								tickMargin={1}
								tickFormatter={(value) => value.slice(0, 3)}
							/>
							<ChartTooltip
								cursor={{ stroke: "#ccc", strokeWidth: 1 }}
								content={({ payload, label }) => {
									if (!payload || payload.length === 0) return null;
									const users = payload.find(
										(p) => p.dataKey === "totalUsers"
									)?.value;
									const transactions = payload.find(
										(p) => p.dataKey === "totalAmount"
									)?.value;
									return (
										<div className="custom-tooltip p-3 bg-white border-[1px] shadow-lg border-[#E4E4E7] rounded-lg w-[280px]">
											<p className="text-center font-bold font-inter">
												{label}
											</p>
											<div className="flex flex-row flex-wrap mt-3 gap-5 justify-center items-center">
												<div>
													<p className="text-bold font-inter text-xs text-center">
														{users}
													</p>
													<div className="flex flex-row justify-start items-center gap-1">
														<IconRectangleFilled size={10} color="#5F60E7" />
														<p className="text-primary-6">Users</p>
													</div>
												</div>
												<div>
													<p className="text-bold font-inter text-xs text-center">
														{formatBalance(Number(transactions) || 0)}
													</p>
													<div className="flex flex-row justify-start items-center gap-1">
														<IconRectangleFilled size={10} color="#CC27DD" />
														<p className="text-primary-6">Transactions</p>
													</div>
												</div>
											</div>
										</div>
									);
								}}
							/>
							<Line
								dataKey="totalUsers"
								type="monotone"
								stroke="#5F60E7"
								strokeWidth={2}
								dot={true}
								yAxisId="users" // Match the yAxisId here
							/>
							<Line
								dataKey="totalAmount"
								type="monotone"
								stroke="#CC27DD"
								strokeWidth={2}
								dot={{ r: 3 }}
							/>
						</LineChart>
					</ChartContainer>
				</div>
			)}
		</div>
	);
}

export default TransactionTracker;
