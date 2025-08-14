import HeaderBox from "@/components/HeaderBox";
import StatCard from "@/components/StatCard";
import DocumentTable from "@/config/document-columns";
import Image from "next/image";

function DocumentVault() {
	return (
		<div className="w-full overflow-x-hidden">
			<HeaderBox title="Document & Vault Management" />
			<p className="text-sm text-[#6C7278] font-normal mb-4 p-3 bg-[#F4F6F8] border-b border-[#6C72781A]">
				Administrative oversight of user health vaults, document storage,
				processing workflows, and data integrity management.
			</p>

			<div className="flex flex-col sm:flex-row justify-between items-start px-4 py-2 gap-2 w-full max-w-[100vw]">
				<div className="border-[1px] border-[#E2E4E9] rounded-lg w-full bg-white overflow-hidden p-3 flex flex-col gap-3">
					<div className="flex flex-row justify-start gap-2 items-center">
						<Image src="/images/info.png" alt="info" width={20} height={20} />
						<p className="text-sm font-medium text-black">Storage Metrics</p>
					</div>

					<div className="flex flex-row justify-start items-center w-full gap-3">
						<StatCard
							title="Total Storage Used"
							value={45678}
							percentage="36%"
							positive
						/>

						<StatCard
							title="Document Stored"
							value={3456}
							percentage="24%"
							positive={false}
						/>
						<StatCard
							title="Average Document Size"
							value={12345}
							percentage="18%"
							positive
						/>
						<StatCard
							title="Storage Growth Rate"
							value={12345}
							percentage="18%"
							positive
						/>
					</div>

					<div className="flex flex-row justify-start items-center w-full sm:w-[50%] gap-3">
						<StatCard
							title="Backup Status"
							value={45678}
							percentage="36%"
							positive
						/>

						<StatCard
							title="Last Backup Time"
							value={3456}
							percentage="24%"
							positive
						/>
					</div>
				</div>
			</div>

			<div className="bg-white flex flex-col px-4 py-2 gap-2 w-full max-w-[100vw]">
				<DocumentTable />
			</div>
		</div>
	);
}

export default DocumentVault;
