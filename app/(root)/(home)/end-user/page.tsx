import HeaderBox from "@/components/HeaderBox";

function EndUser() {
	return (
		<div className="w-full overflow-x-hidden">
			<HeaderBox title="End User" />
			<p className="text-sm text-[#6C7278] font-normal mb-4 p-3 bg-[#F4F6F8] border border-[#6C72781A]">
				To manage all user accounts (end-users and specialist provider) on the
				MedBankr platform.
			</p>
		</div>
	);
}

export default EndUser;
