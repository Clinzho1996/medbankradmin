import HeaderBox from "@/components/HeaderBox";
import StatCard from "@/components/StatCard";
import EndUserTable from "@/config/end-user-columns";
import Image from "next/image";

function EndUser() {
	return (
		<div className="w-full overflow-x-hidden">
			<HeaderBox title="End User" />
			<p className="text-sm text-[#6C7278] font-normal mb-4 p-3 bg-[#F4F6F8] border border-[#6C72781A]">
				To manage all user accounts (end-users and specialist provider) on the
				MedBankr platform.
			</p>
			<div className="flex flex-col sm:flex-row justify-between items-start gap-4 w-full px-4 py-2 gap-2 w-full max-w-[100vw]">
				<div className="border-[1px] border-[#E2E4E9] rounded-lg w-full bg-white overflow-hidden p-3 flex flex-col gap-3">
					<div className="flex flex-row justify-start gap-2 items-center">
						<Image src="/images/info.png" alt="info" width={20} height={20} />
						<p className="text-sm font-medium text-black">Account Metrics</p>
					</div>

					<div className="flex flex-row justify-start items-center w-full gap-3">
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
					</div>
				</div>
			</div>
			<div className="bg-white flex flex-col px-4 py-2 gap-2 w-full max-w-[100vw]">
				<EndUserTable />
			</div>
		</div>
	);
}

export default EndUser;
