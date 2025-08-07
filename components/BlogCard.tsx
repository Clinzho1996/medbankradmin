import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

function BlogCard({
	id,
	img,
	title,
	description,
	date,
}: {
	id: number;
	img: string;
	title: string;
	description: string;
	date: string;
}) {
	return (
		<div
			className="bg-[#EFF1F5] p-3 rounded-lg w-full border-2 border-white shadow-lg relative"
			key={id}>
			<Link href={`/learn/${id}`}>
				<Image
					src={img}
					alt="blog"
					width={450}
					height={200}
					className="rounded-sm w-[100%] h-[200px] object-cover"
				/>
			</Link>
			<div className="flex flex-row justify-start items-center mt-3 gap-3">
				<p className="text-[#86898F] lg:text-[12px] text-[10px] capitalize font-inter bg-white p-1 rounded-lg">
					Finance
				</p>
				<p className="text-[#86898F] lg:text-[12px] text-[10px] capitalize font-inter">
					{date}
				</p>
			</div>
			<Link href={`/learn/${id}`}>
				<h2 className="mt-4 text-primary lg:text-[16px] leading-[20px] lg:leading-[24px] text-sm font-medium font-inter">
					{title}
				</h2>
			</Link>
			<p
				className="text-[#6C7278] mt-2 lg:text-sm  text-xs font-inter font-light mb-20"
				dangerouslySetInnerHTML={{ __html: description }}
			/>
			<Link href={`/learn/${id}`}>
				<Button
					variant="outline"
					className="w-[90%] mx-auto mb-4 mt-10 bg-white rounded-lg absolute bottom-0 right-0 left-0">
					Read More
				</Button>{" "}
			</Link>
		</div>
	);
}

export default BlogCard;
