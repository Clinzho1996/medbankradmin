"use client";

import HeaderBox from "@/components/HeaderBox";
import StatCard from "@/components/StatCard";
import TransactionTableComponent from "@/config/transaction-columns";
import axios from "axios";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CardData {
	amount: number;
	difference: number;
}

interface MonthlyIncomeResponse {
	current_month_income: number;
	previous_month_income: number;
	difference: number;
	type: string;
	percentage_change: string;
}

function Transactions() {
	const [isLoading, setIsLoading] = useState(true);
	const [totalTransactions, setTotalTransactions] = useState<CardData>({
		amount: 0,
		difference: 0,
	});
	const [monthlyIncome, setMonthlyIncome] = useState<CardData>({
		amount: 0,
		difference: 0,
	});
	const [monthlySpending, setMonthlySpending] = useState<CardData>({
		amount: 0,
		difference: 0,
	});

	const fetchCardData = async () => {
		try {
			setIsLoading(true);
			const session = await getSession();

			if (!session?.accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}

			// Fetch all data in parallel
			const [transactionsRes, incomeRes, spendingRes] = await Promise.all([
				axios.get(
					"https://api.kuditrak.ng/api/v1/analytics/total-transactions",
					{
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${session.accessToken}`,
						},
					}
				),
				axios.get<{ status: string; data: MonthlyIncomeResponse }>(
					"https://api.kuditrak.ng/api/v1/analytics/monthly-income-comparison",
					{
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${session.accessToken}`,
						},
					}
				),
				axios.get(
					"https://api.kuditrak.ng/api/v1/analytics/monthly-spending-comparison",
					{
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${session.accessToken}`,
						},
					}
				),
			]);

			// Set data for each card
			if (transactionsRes.data.status === "success") {
				setTotalTransactions({
					amount: transactionsRes.data.data.total_transactions || 0,
					difference: transactionsRes.data.data.percentage_change || 0,
				});
			}

			if (incomeRes.data.status === "success") {
				setMonthlyIncome({
					amount: incomeRes.data.data.current_month_income || 0,
					difference: parseFloat(incomeRes.data.data.percentage_change) || 0,
				});
			}

			if (spendingRes.data.status === "success") {
				setMonthlySpending({
					amount: spendingRes.data.data.current_month_spending || 0,
					difference: parseFloat(spendingRes.data.data.percentage_change) || 0,
				});
			}
		} catch (error) {
			console.error("Error fetching card data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCardData();
	}, []);

	return (
		<div>
			<HeaderBox title="Transactions" />
			<p className="text-sm text-[#6C7278] font-normal mb-4 p-3 bg-[#F4F6F8] border-b border-[#6C72781A]">
				Comprehensive financial management including payment processing, revenue
				tracking, transaction monitoring, and financial reporting for the
				MedBankr platform.
			</p>

			<div className="flex flex-col sm:flex-row justify-between items-start px-4 py-2 gap-2 w-full max-w-[100vw]">
				<div className="border-[1px] border-[#E2E4E9] rounded-lg w-full bg-white overflow-hidden p-3 flex flex-col gap-3">
					<div className="flex flex-row justify-start gap-2 items-center">
						<Image src="/images/info.png" alt="info" width={20} height={20} />
						<p className="text-sm font-medium text-black">Account Metrics</p>
					</div>

					<div className="flex flex-row justify-start items-center w-full gap-3">
						<StatCard
							title="Total Revenue"
							value={45678}
							percentage="36%"
							positive
						/>

						<StatCard
							title="Monthly Recurring Revenue"
							value={3456}
							percentage="24%"
							positive={false}
						/>
						<StatCard
							title="Daily Revenue"
							value={12345}
							percentage="18%"
							positive
						/>
						<StatCard
							title="Revenue Growth Rate"
							value={12345}
							percentage="18%"
							positive
						/>
					</div>

					<div className="flex flex-row justify-start items-center w-full gap-3">
						<StatCard
							title="Payment Success Rate"
							value={45678}
							percentage="36%"
							positive
						/>

						<StatCard
							title="Total Transactions"
							value={3456}
							percentage="24%"
							positive
						/>
						<StatCard
							title="Charge Back Rate"
							value={12345}
							percentage="18%"
							positive={false}
						/>
						<StatCard
							title="Refund Rate"
							value={12345}
							percentage="18%"
							positive
						/>
					</div>
				</div>
			</div>

			<div className="bg-[#F6F8FA] flex flex-col px-4 py-2 gap-4 max-w-[100vw]">
				<TransactionTableComponent />
			</div>
		</div>
	);
}

export default Transactions;
