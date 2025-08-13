import HeaderBox from "@/components/HeaderBox";
import Roles from "@/components/staff/Roles";
import StatCard from "@/components/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StaffTable from "@/config/staff-columns";
import Image from "next/image";

function StaffManagement() {
	return (
		<div className="w-full overflow-x-hidden">
			<HeaderBox title="Staff Management" />
			<p className="text-sm text-[#6C7278] font-normal mb-4 p-3 bg-[#F4F6F8] border-b border-[#6C72781A]">
				Manage, control and administer user accounts, access rights, and digital
				identities within an organization or system.
			</p>

			<div className="flex flex-col sm:flex-row justify-between items-start  px-4 py-2 gap-2 w-full max-w-[100vw]">
				<div className="border-[1px] border-[#E2E4E9] rounded-lg w-full bg-white overflow-hidden p-3 flex flex-col gap-3">
					<div className="flex flex-row justify-start gap-2 items-center">
						<Image src="/images/info.png" alt="info" width={20} height={20} />
						<p className="text-sm font-medium text-black">Account Metrics</p>
					</div>

					<div className="flex flex-row justify-start items-center w-full gap-3">
						<StatCard
							title="Total Employees"
							value={45678}
							percentage="36%"
							positive
						/>

						<StatCard
							title="Total Active Employees"
							value={3456}
							percentage="24%"
							positive={false}
						/>
						<StatCard
							title="Total Suspended Employees"
							value={12345}
							percentage="18%"
							positive
						/>

						<StatCard
							title="Total Invited Employees"
							value={12345}
							percentage="18%"
							positive
						/>
					</div>
				</div>
			</div>

			<div className="border-[1px] border-[#E2E4E9] px-4 py-2 mx-auto rounded-lg w-full sm:w-[97.5%] bg-white overflow-hidden p-3 flex flex-col gap-3">
				<Tabs defaultValue="staffs" className="w-full">
					<TabsList>
						<TabsTrigger
							value="staffs"
							className="data-[state=active]:border-b-2 data-[state=active]:text-dark-1 text-[#6C7278] data-[state=active]:border-[#2FE0A8] data-[state=active]:shadow-none data-[state=active]:rounded-none">
							Staffs
						</TabsTrigger>
						<TabsTrigger
							value="roles_and_permissions"
							className="data-[state=active]:border-b-2 data-[state=active]:text-dark-1 text-[#6C7278] data-[state=active]:border-[#2FE0A8] data-[state=active]:shadow-none data-[state=active]:rounded-none">
							Roles and Permission Management
						</TabsTrigger>
					</TabsList>
					<TabsContent value="staffs">
						<StaffTable />
					</TabsContent>
					<TabsContent value="roles_and_permissions">
						<Roles />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

export default StaffManagement;
