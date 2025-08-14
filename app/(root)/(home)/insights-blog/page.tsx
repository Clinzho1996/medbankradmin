"use client";

import HeaderBox from "@/components/HeaderBox";
import PostTableComponent from "@/config/post-columns";
import Image from "next/image";
import { useState } from "react";

function Learn() {
	const [refreshKey, setRefreshKey] = useState(0);

	return (
		<div>
			<HeaderBox title="Post Management" />
			<p className="text-sm text-[#6C7278] font-normal mb-4 p-3 bg-[#F4F6F8] border-b border-[#6C72781A]">
				Management of educational content, health campaigns, user
				communications, and marketing initiatives to engage users and promote
				health awareness
			</p>
			<div className="bg-[#F6F8FA] flex flex-col px-4 py-2 gap-4">
				<div className="bg-white flex flex-col border-b-[1px] border-[#E2E4E9] justify-between p-3 rounded-lg">
					<Image
						src="/images/post2.png"
						alt="post"
						width={800}
						height={180}
						className="w-full mt-4"
					/>
				</div>

				<div>
					<PostTableComponent
						refreshKey={() => {
							setRefreshKey((prevKey) => prevKey + 1);
							return refreshKey;
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default Learn;
