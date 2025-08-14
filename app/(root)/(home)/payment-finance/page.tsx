"use client";

import HeaderBox from "@/components/HeaderBox";
import StatCard from "@/components/StatCard";
import TransactionTableComponent from "@/config/transaction-columns";
import Image from "next/image";

function Transactions() {
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
