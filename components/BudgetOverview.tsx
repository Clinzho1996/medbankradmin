"use client";

import { IconInfoCircle, IconLink } from "@tabler/icons-react";
import axios from "axios";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BudgetOverviewResponse {
	total_budget_amount: string;
	total_budget_balance: string;
}

function BudgetOverview() {
	const [budgetData, setBudgetData] = useState<BudgetOverviewResponse | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(true);

	const fetchBudgetData = async () => {
		try {
			setIsLoading(true);
			const session = await getSession();

			if (!session?.accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}

			const response = await axios.get<BudgetOverviewResponse>(
				"https://api.kuditrak.ng/api/v1/analytics/budgets",
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${session.accessToken}`,
					},
				}
			);

			setBudgetData(response.data);

			console.log("Budget Data:", response.data);
		} catch (error) {
			console.error("Error fetching budget data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchBudgetData();
	}, []);

	const formatBalance = (amount: number | string) => {
		const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(numAmount ?? 0);
	};

	const getRemainingText = () => {
		if (!budgetData) return "";

		const spent =
			parseFloat(budgetData.total_budget_amount) -
			parseFloat(budgetData.total_budget_balance);
		const percentageSpent =
			(spent / parseFloat(budgetData.total_budget_amount)) * 100;

		if (percentageSpent > 80) {
			return "😱 Sapa go soon catch you bros, calm down!!";
		} else if (percentageSpent > 50) {
			return "You're spending wisely, but keep an eye on your budget!";
		} else {
			return "Great job! You're well within your budget limits.";
		}
	};

	if (isLoading) {
		return (
			<div className="border border-[#E2E4E9] rounded-lg p-4 w-full">
				<div className="flex justify-between items-center mb-4">
					<div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
					<div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
				</div>
				<div className="h-10 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
				<div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
			</div>
		);
	}

	return (
		<div className="border border-[#E2E4E9] rounded-lg w-full bg-white">
			<div className="flex flex-row justify-between items-center p-2">
				<div className="flex flex-row justify-start gap-2 items-center">
					<Image src="/images/info.png" alt="info" width={20} height={20} />
					<p className="text-sm font-medium text-black">
						Active Budget Overview
					</p>
				</div>
				<div className="flex flex-row justify-end gap-3 items-center">
					<Link href="/budget">
						<div className="flex flex-row justify-end gap-3 items-center border rounded-lg p-2 cursor-pointer">
							See all <IconLink size={16} />
						</div>
					</Link>
				</div>
			</div>

			<div className="px-3 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
				<h2 className="text-2xl font-normal">
					{budgetData
						? formatBalance(budgetData.total_budget_amount)
						: formatBalance(0)}
				</h2>
				{budgetData && (
					<p className="text-[10px] text-[#6B7280] bg-[#F6F8F9] p-2 rounded-lg flex flex-row justify-start gap-2 w-full">
						<span className="text-xs">
							<IconInfoCircle size={12} color="#E15C5C" />
						</span>{" "}
						Only {formatBalance(budgetData.total_budget_balance)} remains out of
						the {formatBalance(budgetData.total_budget_amount)} budget.
					</p>
				)}
			</div>

			{budgetData && (
				<p className="text-xs text-[#6B7280] bg-[#F6F8F9] p-2 rounded-b-lg">
					{getRemainingText()}
				</p>
			)}
		</div>
	);
}

export default BudgetOverview;
