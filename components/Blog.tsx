"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { SkeletonCard } from "./BlogSkeleton";

interface Post {
	id: number;
	post_title: string;
	post_body: string;
	post_image: string;
	created_at: string;
}

interface ApiResponse {
	data: Post[];
}

function Blog() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const postsPerPage = 6;

	const fetchPosts = async () => {
		try {
			const response = await axios.get<ApiResponse>(
				"https://api.kuditrak.ng/api/v1/post",
				{
					headers: {
						Accept: "application/json",
						redirect: "follow",
					},
				}
			);

			setPosts(response.data.data);
			setIsLoading(false);
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.log(
					"Error fetching posts:",
					error.response?.data || error.message
				);
			} else {
				console.log("Unexpected error:", error);
			}
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	const formatDate = (rawDate: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		const parsedDate = new Date(rawDate);
		return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
	};

	// Get current posts for pagination
	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
	const totalPages = Math.ceil(posts.length / postsPerPage);

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	return (
		<section className="">
			<div className="bg-white px-[3%] py-[15%] lg:px-10 lg:py-10 rounded-lg">
				<h2 className="text-[28px] lg:text-[40px] font-extrabold font-inter mt-5 text-primary leading-[32px] sm:leading-[50px]">
					<span className="text-[#0D142080]">Say Goodbye to living </span>
					Paycheck to Paycheck
				</h2>
				<p className="text-[#0D1420B2] mt-5 text-sm">
					Introducing Kuditrak - Your Personal Finance Companion
				</p>

				<hr className="mt-5 border-[#0D1420B2]" />

				{/* Blog Posts Grid */}
				<div className="mt-10">
					{isLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[...Array(3)].map((_, index) => (
								<SkeletonCard key={index} />
							))}
						</div>
					) : (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{currentPosts.map((item: Post) => (
									<BlogCard
										key={item.id}
										id={item.id}
										img={item.post_image}
										title={item.post_title}
										description={item.post_body.slice(0, 90).concat("...")}
										date={formatDate(item.created_at)}
									/>
								))}
							</div>

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex justify-center mt-10">
									<nav className="flex items-center gap-2">
										<button
											onClick={() => paginate(Math.max(1, currentPage - 1))}
											disabled={currentPage === 1}
											className="px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
											&laquo; Prev
										</button>

										{Array.from({ length: totalPages }, (_, i) => i + 1).map(
											(number) => (
												<button
													key={number}
													onClick={() => paginate(number)}
													className={`px-3 py-1 rounded-md ${
														currentPage === number
															? "bg-primary text-white"
															: "hover:bg-gray-100"
													}`}>
													{number}
												</button>
											)
										)}

										<button
											onClick={() =>
												paginate(Math.min(totalPages, currentPage + 1))
											}
											disabled={currentPage === totalPages}
											className="px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
											Next &raquo;
										</button>
									</nav>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</section>
	);
}

export default Blog;
