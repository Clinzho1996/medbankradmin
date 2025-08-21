import HospitalTable from "@/config/hospital-columns";

function Hospital() {
	return (
		<div className="bg-white flex flex-col py-2 gap-2 w-full max-w-[100vw]">
			<HospitalTable />
		</div>
	);
}

export default Hospital;
