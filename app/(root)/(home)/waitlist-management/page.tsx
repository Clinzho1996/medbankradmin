import HeaderBox from "@/components/HeaderBox";

import Table from "@/config/columns";
import HospitalWaitlistTable from "@/config/hospital-wait-columns";
import LabWaitlistTable from "@/config/lab-wait-columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

function UserManagement() {
	return (
		<div>
			<HeaderBox title="Waitlist Management" />

			<div className="w-full sm:w-[98%] mx-auto bg-white rounded-lg py-5 border-[1px] border-b-[1px] border-[#E2E4E9] mt-4">
				<Tabs defaultValue="user" className="bg-transparent">
					<TabsList className="flex flex-row h-fit justify-between bg-[#fff] w-full sm:w-[98%] mx-auto border-[1px] border-[#E2E4E9] rounded-lg">
						<TabsTrigger
							value="user"
							className="flex-1 p-2 rounded-md data-[state=active]:bg-[#ECFAF6] data-[state=active]:text-black text-sm text-center text-primary-6">
							Users
						</TabsTrigger>
						<div className="w-px bg-[#E2E4E9] my-2"></div>
						<TabsTrigger
							value="hospital"
							className="flex-1 p-2 rounded-md data-[state=active]:bg-[#ECFAF6] data-[state=active]:text-black text-sm text-center text-primary-6">
							Hospitals
						</TabsTrigger>
						<TabsTrigger
							value="lab"
							className="flex-1 p-2 rounded-md data-[state=active]:bg-[#ECFAF6] data-[state=active]:text-black text-sm text-center text-primary-6">
							Laboratories
						</TabsTrigger>
					</TabsList>

					<div className="w-full px-4 mt-[10px] lg:mt-0">
						<TabsContent value="user">
							<Table />
						</TabsContent>
						<TabsContent value="hospital">
							<HospitalWaitlistTable />
						</TabsContent>
						<TabsContent value="lab">
							<LabWaitlistTable />
						</TabsContent>
					</div>
				</Tabs>
			</div>
		</div>
	);
}

export default UserManagement;
