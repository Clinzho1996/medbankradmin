import HeaderBox from "@/components/HeaderBox";

function DocumentVault() {
	return (
		<div className="w-full overflow-x-hidden">
			<HeaderBox title="Document Vault" />
			<p className="text-sm text-[#6C7278] font-normal mb-4 p-3 bg-[#F4F6F8] border border-[#6C72781A]">
				Administrative oversight of user health vaults, document storage,
				processing workflows, and data integrity management.
			</p>
		</div>
	);
}

export default DocumentVault;
