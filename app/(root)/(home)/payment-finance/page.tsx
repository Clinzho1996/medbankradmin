"use client";

import ActionCards from "@/components/ActionCards";
import HeaderBox from "@/components/HeaderBox";
import TransactionTableComponent from "@/config/transaction-columns";
import axios from "axios";
import { getSession } from "next-auth/react";
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
			<p className="text-sm text-[#6C7278] font-normal mb-4 p-3 bg-[#F4F6F8] border border-[#6C72781A]">
				Comprehensive financial management including payment processing, revenue
				tracking, transaction monitoring, and financial reporting for the
				MedBankr platform.
			</p>
			<div className="bg-[#F6F8FA] flex flex-col px-4 py-2 gap-2 w-full max-w-[100vw]">
				{isLoading ? (
					<div className="flex justify-center items-center h-32">
						<p>Loading data...</p>
					</div>
				) : (
					<div className="w-full overflow-x-auto flex flex-col sm:flex-row justify-between gap-3">
						<ActionCards
							title="Total Transactions"
							amount={totalTransactions.amount}
							difference={totalTransactions.difference}
						/>

						<ActionCards
							title="Total Monthly Income"
							amount={monthlyIncome.amount}
							difference={monthlyIncome.difference}
						/>

						<ActionCards
							title="Total Monthly Spending"
							amount={monthlySpending.amount}
							difference={monthlySpending.difference}
						/>
					</div>
				)}
			</div>

			<div className="bg-[#F6F8FA] flex flex-col px-4 py-2 gap-4 max-w-[100vw]">
				<TransactionTableComponent />
			</div>
		</div>
	);
}

export default Transactions;
