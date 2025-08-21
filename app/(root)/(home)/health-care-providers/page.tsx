import HeaderBox from "@/components/HeaderBox";

import StatCard from "@/components/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Image from "next/image";
import Hospital from "./hospital/page";
import Laboratory from "./lab/page";

function HealthCare() {
	return (
		<div className="w-full overflow-x-hidden">
			<HeaderBox title="Health Care" />
			<p className="text-sm text-[#6C7278] font-normal mb-4 p-3 bg-[#F4F6F8] border border-[#6C72781A]">
				Manage healthcare provider accounts, ensuring seamless collaboration and
				high-quality patient care.
			</p>

			<div className="flex flex-col sm:flex-row justify-between items-start px-4 py-2 gap-2 w-full max-w-[100vw]">
				<div className="border-[1px] border-[#E2E4E9] rounded-lg w-full bg-white overflow-hidden p-3 flex flex-col gap-3">
					<div className="flex flex-row justify-start gap-2 items-center">
						<Image src="/images/info.png" alt="info" width={20} height={20} />
						<p className="text-sm font-medium text-black">Account Metrics</p>
					</div>

					<div className="flex flex-row justify-start items-center w-full gap-3">
						<StatCard
							title="Total Healthcare Provider"
							value={45678}
							percentage="36%"
							positive
						/>

						<StatCard
							title="Total Active Healthcare Provider"
							value={3456}
							percentage="24%"
							positive={false}
						/>
						<StatCard
							title="Total Inactive Healthcare Provider"
							value={12345}
							percentage="18%"
							positive
						/>
					</div>
				</div>
			</div>

			{/* Tabs */}

			<div className="w-full sm:w-[98%] mx-auto bg-white rounded-lg py-5 border-[1px] border-b-[1px] border-[#E2E4E9]">
				<Tabs defaultValue="hospital" className="bg-transparent">
					<TabsList className="flex flex-row h-fit justify-between bg-[#fff] w-full sm:w-[98%] mx-auto border-[1px] border-[#E2E4E9] rounded-lg">
						<TabsTrigger
							value="hospital"
							className="flex-1 p-2 rounded-md data-[state=active]:bg-[#ECFAF6] data-[state=active]:text-black text-sm text-center text-primary-6">
							Hospital Provider
						</TabsTrigger>
						<div className="w-px bg-[#E2E4E9] my-2"></div>
						<TabsTrigger
							value="laboratory"
							className="flex-1 p-2 rounded-md data-[state=active]:bg-[#ECFAF6] data-[state=active]:text-black text-sm text-center text-primary-6">
							Laboratory Test Provider
						</TabsTrigger>
					</TabsList>

					<div className="w-full px-4 mt-[10px] lg:mt-0">
						<TabsContent value="hospital">
							<Hospital />
						</TabsContent>
						<TabsContent value="laboratory">
							<Laboratory />
						</TabsContent>
					</div>
				</Tabs>
			</div>
		</div>
	);
}

export default HealthCare;
