"use client";

import HeaderBox from "@/components/HeaderBox";
import StatCard from "@/components/StatCard";
import SpendOverview from "@/components/TrafficSources";
import TransactionTracker from "@/components/TransactionTracker";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionTableComponent from "@/config/transaction-columns";
import axios from "axios";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface DashboardData {
	user: {
		total: number;
		percentage_change: number;
	};
	active_user_today: {
		total: number;
		percentage_change: number;
	};
	active_user_week: {
		total: number;
		percentage_change: number;
	};
	active_user_month: {
		total: number;
		percentage_change: number;
	};
	new_registration: {
		total: number;
		percentage_change: number;
	};
	user_growth_rate: {
		total: number;
		percentage_change: number;
	};
	user_retention_rate: {
		total: number;
		percentage_change: number;
	};
}

interface DocumentData {
	total: number;
	percentage_change: number;
}

interface AdditionalStats {
	totalActiveAppointments: number;
	totalSpecialistProvider: number;
	totalTransactions: number;
	totalDocuments: number;
	totalAppointments: number;
}

function Dashboard() {
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(true);
	const [document, setDocument] = useState<DocumentData | null>(null);
	const [additionalStats, setAdditionalStats] =
		useState<AdditionalStats | null>(null);
	const [dataLoaded, setDataLoaded] = useState(false);

	const formatBalance = (amount: number) => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(amount ?? 0);
	};

	const fetchDashboardData = async () => {
		try {
			setIsLoading(true);
			setDataLoaded(false);
			const session = await getSession();
			const accessToken = session?.accessToken;

			if (!accessToken) {
				console.error("No access token found.");
				toast.error("No access token found. Please log in again.");
				setIsLoading(false);
				return;
			}

			// Fetch all data in parallel
			const [userResponse, documentResponse, additionalResponse] =
				await Promise.all([
					axios.get(
						"https://api.medbankr.ai/api/v1/administrator/dashboard/user",
						{
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${accessToken}`,
							},
						}
					),
					axios.get(
						"https://api.medbankr.ai/api/v1/administrator/dashboard/document",
						{
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${accessToken}`,
							},
						}
					),
					// Simulate additional stats fetch - replace with actual API calls
					new Promise((resolve) =>
						setTimeout(
							() =>
								resolve({
									data: {
										totalActiveAppointments: 345,
										totalSpecialistProvider: 45678,
										totalTransactions: 2524000,
										totalAppointments: 45678,
									},
								}),
							500
						)
					),
				]);

			if (userResponse.data.status === true) {
				setDashboardData(userResponse.data.data);
			} else {
				toast.error("Failed to fetch user dashboard data.");
			}

			if (documentResponse.data.status === true) {
				setDocument(documentResponse.data.data);
			} else {
				toast.error("Failed to fetch document data.");
			}

			// Set additional stats
			setAdditionalStats(
				(additionalResponse as { data: AdditionalStats }).data
			);
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
			toast.error("Failed to fetch dashboard data. Please try again.");
		} finally {
			setIsLoading(false);
			setDataLoaded(true);
		}
	};

	useEffect(() => {
		fetchDashboardData();
	}, []);

	// Main loading state
	if (isLoading) {
		return (
			<div className="w-full overflow-x-hidden">
				<HeaderBox title="Dashboard" />
				<p className="text-sm text-[#6C7278] font-normal mb-4 p-3 bg-[#F4F6F8] border border-[#6C72781A]">
					Glance overview of the platform&apos;s health, key performance
					indicators (KPIs), and recent administrative activities.
				</p>
				<div className="bg-[#fff] flex flex-col px-4 py-2 gap-2 w-full max-w-[100vw]">
					{/* Skeleton for KPI Section */}
					<div className="border-[1px] border-[#E2E4E9] rounded-lg w-full bg-white overflow-hidden p-3 flex flex-col gap-3">
						<div className="flex flex-row justify-start gap-2 items-center">
							<Skeleton className="h-5 w-5 bg-gray-300 rounded" />
							<Skeleton className="h-4 w-48 bg-gray-300" />
						</div>

						{/* Three rows of skeleton cards */}
						<div className="flex flex-row justify-start gap-2 items-center">
							<Skeleton className="h-5 w-5 bg-gray-300 rounded" />
							<Skeleton className="h-4 w-48 bg-gray-300" />
						</div>
						<div className="flex flex-row justify-start gap-2 items-center">
							<Skeleton className="h-5 w-5 bg-gray-300 rounded" />
							<Skeleton className="h-4 w-48 bg-gray-300" />
						</div>
						<div className="flex flex-row justify-start gap-2 items-center">
							<Skeleton className="h-5 w-5 bg-gray-300 rounded" />
							<Skeleton className="h-4 w-48 bg-gray-300" />
						</div>
					</div>

					{/* Skeleton for charts section */}
					<div className="flex flex-col sm:flex-row justify-between items-start gap-4 w-full">
						<div className="rounded-lg bg-white w-full sm:w-[50%] overflow-hidden">
							<div className="p-3 bg-white rounded-lg border border-[#E2E4E9]">
								<div className="flex flex-row justify-between items-center border-b-[1px] border-b-[#E2E4E9] py-2">
									<div className="flex flex-row justify-start gap-2 items-center">
										<Skeleton className="h-5 w-5 bg-gray-300 rounded" />
										<Skeleton className="h-4 w-32 bg-gray-300" />
									</div>
									<Skeleton className="h-8 w-32 bg-gray-300 rounded" />
								</div>
								<div className="py-3 h-48 flex items-center justify-center">
									<Skeleton className="h-full w-full bg-gray-300 rounded" />
								</div>
							</div>
						</div>
						<div className="rounded-lg bg-white w-full sm:w-[50%] overflow-hidden">
							<div className="p-3 bg-white rounded-lg border border-[#E2E4E9]">
								<div className="flex flex-row justify-between items-center border-b-[1px] border-b-[#E2E4E9] py-2">
									<div className="flex flex-row justify-start gap-2 items-center">
										<Skeleton className="h-5 w-5 bg-gray-300 rounded" />
										<Skeleton className="h-4 w-32 bg-gray-300" />
									</div>
									<Skeleton className="h-8 w-32 bg-gray-300 rounded" />
								</div>
								<div className="py-3 h-48 flex items-center justify-center">
									<Skeleton className="h-full w-full bg-gray-300 rounded" />
								</div>
							</div>
						</div>
					</div>

					{/* Skeleton for table section */}
					<div className="w-full overflow-x-auto">
						<div className="bg-white rounded-lg border border-[#E2E4E9]">
							<div className="p-3 border-b border-gray-200">
								<Skeleton className="h-6 w-40 bg-gray-300" />
							</div>
							<div className="p-4 space-y-3">
								{Array.from({ length: 5 }).map((_, index) => (
									<div key={index} className="flex gap-4">
										<Skeleton className="h-4 flex-1 bg-gray-300" />
										<Skeleton className="h-4 flex-1 bg-gray-300" />
										<Skeleton className="h-4 flex-1 bg-gray-300" />
										<Skeleton className="h-4 flex-1 bg-gray-300" />
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (!dataLoaded || !dashboardData || !additionalStats) {
		return (
			<div className="w-full overflow-x-hidden">
				<HeaderBox title="Dashboard" />
				<p className="text-sm text-[#6C7278] font-normal mb-4 p-3 bg-[#F4F6F8] border border-[#6C72781A]">
					Glance overview of the platform&apos;s health, key performance
					indicators (KPIs), and recent administrative activities.
				</p>
				<div className="bg-[#fff] flex flex-col px-4 py-2 gap-2 w-full max-w-[100vw]">
					<div className="text-center p-8">Failed to load dashboard data</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full overflow-x-hidden">
			<HeaderBox title="Dashboard" />
			<p className="text-sm text-[#6C7278] font-normal mb-4 p-3 bg-[#F4F6F8] border border-[#6C72781A]">
				Glance overview of the platform&apos;s health, key performance
				indicators (KPIs), and recent administrative activities.
			</p>
			<div className="bg-[#fff] flex flex-col px-4 py-2 gap-2 w-full max-w-[100vw]">
				{/* Account balance and budget overview */}
				<div className="flex flex-col sm:flex-row justify-between items-start gap-4 w-full">
					<div className="border-[1px] border-[#E2E4E9] rounded-lg w-full bg-white overflow-hidden p-3 flex flex-col gap-3">
						<div className="flex flex-row justify-start gap-2 items-center">
							<Image src="/images/info.png" alt="info" width={20} height={20} />
							<p className="text-sm font-medium text-black">
								Key Performance Indicators (KPIs)
							</p>
						</div>

						<div className="flex flex-row justify-between items-center w-full gap-3">
							<StatCard
								title="Total Users"
								value={dashboardData.user.total}
								percentage={`${dashboardData.user.percentage_change.toFixed(
									1
								)}%`}
								positive={dashboardData.user.percentage_change >= 0}
							/>

							<StatCard
								title="Total Active Users Today"
								value={dashboardData.active_user_today.total}
								percentage={`${dashboardData.active_user_today.percentage_change.toFixed(
									1
								)}%`}
								positive={
									dashboardData.active_user_today.percentage_change >= 0
								}
							/>
							<StatCard
								title="Total Active Users Weekly"
								value={dashboardData.active_user_week.total}
								percentage={`${dashboardData.active_user_week.percentage_change.toFixed(
									1
								)}%`}
								positive={dashboardData.active_user_week.percentage_change >= 0}
							/>
							<StatCard
								title="Total Active Users Monthly"
								value={dashboardData.active_user_month.total}
								percentage={`${dashboardData.active_user_month.percentage_change.toFixed(
									1
								)}%`}
								positive={
									dashboardData.active_user_month.percentage_change >= 0
								}
							/>
						</div>
						<div className="flex flex-row justify-between items-center w-full gap-3">
							<StatCard
								title="New Registration Today"
								value={dashboardData.new_registration.total}
								percentage={`${dashboardData.new_registration.percentage_change.toFixed(
									1
								)}%`}
								positive={dashboardData.new_registration.percentage_change >= 0}
							/>

							<StatCard
								title="Total Active Appointments"
								value={additionalStats.totalActiveAppointments}
								percentage="81%"
								positive={false}
							/>
							<StatCard
								title="Total Specialist Provider"
								value={additionalStats.totalSpecialistProvider}
								percentage="10%"
								positive
							/>
							<StatCard
								title="Total Transactions"
								value={formatBalance(additionalStats.totalTransactions)}
								percentage="24%"
								positive
							/>
						</div>
						<div className="flex flex-row justify-between items-center w-full gap-3">
							<StatCard
								title="Total Documents"
								value={document?.total ?? 0}
								percentage={`${document?.percentage_change?.toFixed(1) ?? 0}%`}
								positive={(document?.percentage_change ?? 0) >= 0}
							/>

							<StatCard
								title="User Growth Rate"
								value={dashboardData.user_growth_rate.total}
								percentage={`${dashboardData.user_growth_rate.percentage_change.toFixed(
									1
								)}%`}
								positive={dashboardData.user_growth_rate.percentage_change >= 0}
							/>
							<StatCard
								title="User Retention Rate"
								value={
									Math.round(dashboardData.user_retention_rate.total * 1000) /
									1000
								}
								percentage={`${dashboardData.user_retention_rate.percentage_change.toFixed(
									1
								)}%`}
								positive={
									dashboardData.user_retention_rate.percentage_change >= 0
								}
							/>
							<StatCard
								title="Total Appointments"
								value={additionalStats.totalAppointments}
								percentage="36%"
								positive
							/>
						</div>
					</div>
				</div>

				{/* Spend overview and expense tracking */}
				<div className="flex flex-col sm:flex-row justify-between items-start gap-4 w-full">
					<div className="rounded-lg bg-white w-full sm:w-[50%] overflow-hidden">
						<TransactionTracker />
					</div>
					<div className="rounded-lg bg-white w-full sm:w-[50%] overflow-hidden">
						<SpendOverview />
					</div>
				</div>

				{/* Recent transactions and activity feed */}
				<div className="w-full overflow-x-auto">
					<TransactionTableComponent />
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
