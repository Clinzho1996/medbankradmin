"use client";

import HeaderBox from "@/components/HeaderBox";
import axios from "axios";
import parse from "html-react-parser";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Post {
	id: number;
	post_title: string;
	post_body: string;
	post_image: string;
	created_at: string;
}

interface ApiResponse {
	data: Post;
}

export default function BlogContent() {
	const { id } = useParams();
	const [post, setPost] = useState<Post | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchPost = async () => {
		try {
			const response = await axios.get<ApiResponse>(
				`https://api.kuditrak.ng/api/v1/post/${id}`,
				{
					headers: {
						Accept: "application/json",
						redirect: "follow",
					},
				}
			);

			setPost(response?.data?.data);
			setIsLoading(false);
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.log(
					"Error fetching post:",
					error.response?.data || error.message
				);
			} else {
				console.log("Unexpected error:", error);
			}
		}
	};

	useEffect(() => {
		fetchPost();
	}, [id]);

	const formatDate = (rawDate: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		const parsedDate = new Date(rawDate);
		return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
	};

	return (
		<section>
			{isLoading ? (
				<div className="w-full lg:w-[70%] p-[6%] flex flex-col gap-6">
					{/* Header Skeleton */}
					<div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse"></div>

					{/* Author Info Skeleton */}
					<div className="flex flex-row items-center gap-3">
						<div className="w-[50px] h-[50px] rounded-full bg-gray-200 animate-pulse"></div>
						<div className="flex flex-col gap-2">
							<div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
							<div className="h-3 w-48 bg-gray-200 rounded animate-pulse"></div>
						</div>
					</div>

					{/* Image Skeleton */}
					<div className="w-full h-[310px] lg:h-[475px] bg-gray-200 rounded-sm animate-pulse"></div>

					{/* Content Skeleton */}
					<div className="flex flex-col gap-3 mt-3">
						{[...Array(6)].map((_, i) => (
							<div
								key={i}
								className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
						))}
						<div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
					</div>
				</div>
			) : post ? (
				<div>
					<HeaderBox title={post.post_title} />
					<div className="w-full lg:w-[70%] px-[6%] py-[4%] flex flex-col gap-4 justify-start">
						<div className="flex flex-row justify-start items-center gap-3">
							<div>
								<Image
									src="/images/kudilogo.png"
									alt="avatar"
									width={50}
									height={50}
								/>
							</div>
							<div>
								<p>Kuditrak Management</p>
								<p className="text-[#86898F]">
									2 mins read • {formatDate(post.created_at)}
								</p>
							</div>
						</div>
						<div className="flex flex-row justify-start items-center mt-3">
							<Image
								src={post.post_image}
								alt={post.post_title}
								width={550}
								height={200}
								className="w-full h-[310px] lg:h-[475px] rounded-sm object-cover"
							/>
						</div>
						<div className="text-primary font-inter font-normal flex flex-col gap-3 mt-3">
							{parse(post.post_body)}
						</div>
					</div>
				</div>
			) : (
				<p>Post not found.</p>
			)}
		</section>
	);
}
