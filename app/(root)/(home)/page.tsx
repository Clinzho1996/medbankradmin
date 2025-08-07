import HeaderBox from "@/components/HeaderBox";
import StatCard from "@/components/StatCard";
import SpendOverview from "@/components/TrafficSources";
import TransactionTracker from "@/components/TransactionTracker";
import TransactionTableComponent from "@/config/transaction-columns";
import Image from "next/image";

function Dashboard() {
	const formatBalance = (amount: number) => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(amount ?? 0);
	};
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
								value={45678}
								percentage="36%"
								positive
							/>

							<StatCard
								title="Total Active Users Today"
								value={3456}
								percentage="24%"
								positive={false}
							/>
							<StatCard
								title="Total Active Users Weekly"
								value={12345}
								percentage="18%"
								positive
							/>
							<StatCard
								title="Total Active Users Monthly"
								value={34567}
								percentage="54%"
								positive={false}
							/>
						</div>
						<div className="flex flex-row justify-between items-center w-full gap-3">
							<StatCard
								title="New Regitration Today"
								value={234}
								percentage="12%"
								positive
							/>

							<StatCard
								title="Total Active Appointments"
								value={345}
								percentage="81%"
								positive={false}
							/>
							<StatCard
								title="Total Specialist Provider"
								value={45678}
								percentage="10%"
								positive
							/>
							<StatCard
								title="Total Transactions"
								value={formatBalance(2524000)}
								percentage="24%"
								positive
							/>
						</div>
						<div className="flex flex-row justify-between items-center w-full gap-3">
							<StatCard
								title="Total Dcoument "
								value={45678}
								percentage="22%"
								positive
							/>

							<StatCard
								title="User Growth Rate"
								value={45678}
								percentage="16%"
								positive
							/>
							<StatCard
								title="User Retention Rate"
								value={45678}
								percentage="56%"
								positive={false}
							/>
							<StatCard
								title="Total Appointments"
								value={45678}
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
