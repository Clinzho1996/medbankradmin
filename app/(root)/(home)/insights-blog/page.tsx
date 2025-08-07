import Blog from "@/components/Blog";
import HeaderBox from "@/components/HeaderBox";

function Learn() {
	return (
		<div>
			<HeaderBox title="Learn" />

			<div className="bg-[#F6F8FA] flex flex-col px-4 py-2 gap-2 w-full max-w-[100vw]">
				<Blog />
			</div>
		</div>
	);
}

export default Learn;
