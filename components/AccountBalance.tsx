"use client";

import { IconLink } from "@tabler/icons-react";
import axios from "axios";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Analytics {
	id: string;
	total_account_balance: number;
}
interface ApiResponse {
	status: "success" | "error";
	data: Analytics[];
	message?: string;
}

function AccountBalance() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [tableData, setTableData] = useState<Analytics[]>([]);

	const fetchBudgetData = async () => {
		try {
			setIsLoading(true);
			const session = await getSession();

			if (!session?.accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}

			const response = await axios.get<ApiResponse>(
				"https://api.kuditrak.ng/api/v1/analytics/account-balance",
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${session?.accessToken}`,
					},
				}
			);

			if (response.data.status === "success") {
				setTableData(response.data.data);
			}
		} catch (error) {
			console.error("Error fetching budget data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchBudgetData();
	}, []);

	const formatBalance = (amount: number) => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(amount ?? 0);
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
		<div className="border border-[#E2E4E9] rounded-lg">
			<div className="flex flex-row justify-between items-center  p-2">
				<div className="flex flex-row justify-start gap-2 items-center">
					<Image src="/images/info.png" alt="info" width={20} height={20} />
					<p className="text-sm font-medium text-black">Total Balance</p>
				</div>
				<div className="flex flex-row justify-end gap-3 items-center border rounded-lg p-2 cursor-pointer">
					See all <IconLink />
				</div>
			</div>

			<div className="px-3 py-6">
				<h2 className="text-2xl font-normal">
					{formatBalance(tableData[0]?.total_account_balance)}
				</h2>
			</div>

			<p className="text-xs text-[#6B7280] bg-[#F6F8F9] p-2 rounded-b-lg">
				<span className="text-xs text-green-600">↑ 3.24%</span> vs last month
			</p>
		</div>
	);
}

export default AccountBalance;
