"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { IconEdit, IconEye, IconEyeOff, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PostTable } from "./post-table";

const ReactQuill = dynamic(() => import("react-quill"), {
	ssr: false,
});

interface ApiResponse {
	id: string;
	post_title: string;
	post_body: string;
	post_image: string;
	post_status: string;
	post_author: string;
	created_at: string;
	updated_at: string;
}

declare module "next-auth" {
	interface Session {
		accessToken?: string;
	}
}

export type Post = {
	id: string;
	featuredImage: string;
	title: string;
	content: string;
	post_status: string;
	post_author: string;
	created_at: string;
	updated_at: string;
};

interface PostTableComponentProps {
	refreshKey: () => void;
}

const PostTableComponent = ({ refreshKey }: PostTableComponentProps) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [tableData, setTableData] = useState<Post[]>([]);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isEditModalOpen, setEditModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<any>(null);

	const [postTitle, setPostTitle] = useState("");
	const [content, setContent] = useState("");
	const [category, setCategory] = useState("News");
	const [coverImage, setCoverImage] = useState<File | null>(null);
	const [status, setStatus] = useState("draft");
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || null;
		setCoverImage(file);

		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			setPreviewImage(null);
		}
	};

	const modules = {
		toolbar: [
			[{ header: [1, 2, false] }],
			["bold", "italic", "underline", "strike", "blockquote"],
			[
				{ list: "ordered" },
				{ list: "bullet" },
				{ indent: "-1" },
				{ indent: "+1" },
			],
			["link", "image", "video", "code-block"],
			["clean"],
		],
	};

	const openDeleteModal = (row: any) => {
		setSelectedRow(row.original);
		setDeleteModalOpen(true);
	};

	const openEditModal = (row: any) => {
		setSelectedRow(row.original);
		setPostTitle(row.original.title);
		setContent(row.original.content);
		setStatus(row.original.post_status);
		setPreviewImage(row.original.featuredImage);
		setEditModalOpen(true);
	};

	const closeDeleteModal = () => {
		setDeleteModalOpen(false);
	};

	const closeEditModal = () => {
		setEditModalOpen(false);
	};

	const handleDelete = async () => {
		try {
			if (!selectedRow) return;

			const session = await getSession();

			if (!session?.accessToken) {
				console.error("No access token found.");
				return;
			}

			await axios.delete(
				`https://api.medbankr.ai/api/v1/administrator/blog/${selectedRow.id}`,
				{
					headers: {
						Authorization: `Bearer ${session?.accessToken}`,
					},
				}
			);
			toast.success("Post deleted successfully!");
			closeDeleteModal();
			refreshKey();
		} catch (error: any) {
			console.error("Error deleting Post:", error);
			const errorMessage =
				error.response?.data?.message ||
				"Failed to delete post. Please try again.";
			toast.error(errorMessage);
		}
	};

	const handleUpdatePost = async () => {
		try {
			setIsLoading(true);

			if (!postTitle.trim()) {
				toast.error("The post title is required.");
				setIsLoading(false);
				return;
			}
			if (!content.trim()) {
				toast.error("The post content is required.");
				setIsLoading(false);
				return;
			}

			const session = await getSession();
			if (!session || !session.accessToken) {
				toast.error("You need to be logged in to update a post.");
				setIsLoading(false);
				return;
			}

			const formData = new FormData();
			formData.append("post_title", postTitle);
			formData.append("content", content);
			formData.append("category", category);
			formData.append("status", status);

			// Add author information from session if available
			if (session.user?.name) {
				formData.append("author_name", session.user.name);
			}

			if (session.user?.image) {
				formData.append("author_image", session.user.image);
			}

			if (coverImage) {
				formData.append("cover_image", coverImage);
			}

			const response = await axios.put(
				`https://api.medbankr.ai/api/v1/administrator/blog/${selectedRow.id}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${session.accessToken}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (response.data.error) {
				toast.error(response.data.error);
			} else if (response.data.status === true) {
				toast.success("Post updated successfully!");
				closeEditModal();
				refreshKey();
			} else {
				toast.error("Failed to update post. Please try again.");
			}
		} catch (error: any) {
			console.error("Error updating post:", error);
			const errorMessage =
				error.response?.data?.message ||
				"An error occurred while updating the post.";
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePublishUnpublish = async (
		postId: string,
		newStatus: "publish" | "draft"
	) => {
		try {
			const session = await getSession();
			if (!session || !session.accessToken) {
				toast.error("You need to be logged in to update post status.");
				return;
			}

			const response = await axios.put(
				`https://api.medbankr.ai/api/v1/administrator/blog/${postId}/status`,
				{ status: newStatus },
				{
					headers: {
						Authorization: `Bearer ${session.accessToken}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (response.data.status === true) {
				toast.success(
					`Post ${
						newStatus === "publish" ? "published" : "unpublished"
					} successfully!`
				);
				refreshKey();
			} else {
				toast.error("Failed to update post status. Please try again.");
			}
		} catch (error: any) {
			console.error("Error updating post status:", error);
			const errorMessage =
				error.response?.data?.message ||
				"An error occurred while updating post status.";
			toast.error(errorMessage);
		}
	};

	const fetchPostData = async () => {
		try {
			setIsLoading(true);
			const session = await getSession();

			if (!session?.accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}

			const response = await axios.get<{ data: ApiResponse[] }>(
				"https://api.medbankr.ai/api/v1/administrator/blog",
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${session?.accessToken}`,
					},
				}
			);

			const fetchedData = response.data.data;

			console.log("Post Data:", fetchedData);

			const mappedData = fetchedData.map((item) => ({
				id: item.id,
				title: item.post_title,
				content: item.post_body,
				featuredImage: item.post_image,
				post_status: item.post_status,
				post_author: item.post_author,
				created_at: item.created_at,
				updated_at: item.updated_at,
			}));

			setTableData(mappedData);
		} catch (error: any) {
			console.error("Error fetching post data:", error);
			const errorMessage =
				error.response?.data?.message ||
				"Failed to fetch posts. Please try again.";
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchPostData();
	}, [refreshKey]);

	const columns: ColumnDef<Post>[] = [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
					className="check"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
					className="check"
				/>
			),
		},
		{
			accessorKey: "id",
			header: "ID",
			cell: ({ row }) => {
				const id = row.getValue<string>("id");

				return <span className="text-xs text-primary-6">{id}</span>;
			},
		},
		{
			accessorKey: "featuredImage",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						className="text-[13px] text-left"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Featured Image
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const featuredImage = row.getValue<string>("featuredImage");

				return (
					<Image
						src={featuredImage}
						alt={featuredImage}
						width={120}
						height={120}
						className="post w-[100px] h-[100px] object-cover"
					/>
				);
			},
		},
		{
			accessorKey: "title",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						className="text-xs text-black"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Title
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const title = row.getValue<string>("title");

				return <span className="text-xs text-dark">{title}</span>;
			},
		},
		{
			accessorKey: "content",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						className="text-[13px] text-left"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Content
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const content = row.getValue<string>("content");

				return (
					<span className="text-xs text-primary-6">
						{content.length > 150 ? content.slice(0, 150) + "..." : content}
					</span>
				);
			},
		},
		{
			accessorKey: "post_status",
			header: "Status",
			cell: ({ row }) => {
				const status = row.getValue<string>("post_status");
				const statusColor =
					status === "publish" ? "text-green-600" : "text-yellow-600";

				return (
					<span className={`text-xs font-medium ${statusColor}`}>
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</span>
				);
			},
		},
		{
			id: "actions",
			header: "Action",
			cell: ({ row }) => {
				const post = row.original;
				const isPublished = post.post_status === "publish";

				return (
					<div className="flex flex-row justify-start items-center gap-3">
						<Link href={`/blog/${post.id}`} target="_blank">
							<Button className="border-[#E8E8E8] border-[1px] text-xs font-medium text-[#6B7280] font-inter">
								View
							</Button>
						</Link>

						<Button
							className="border-[#E8E8E8] border-[1px] text-sm font-medium text-[#6B7280] font-inter"
							onClick={() => openEditModal(row)}>
							<IconEdit />
						</Button>

						<Button
							className={`border-[#E8E8E8] border-[1px] text-sm font-medium font-inter ${
								isPublished ? "text-red-600" : "text-green-600"
							}`}
							onClick={() =>
								handlePublishUnpublish(
									post.id,
									isPublished ? "draft" : "publish"
								)
							}>
							{isPublished ? <IconEyeOff /> : <IconEye />}
						</Button>

						<Button
							className="border-[#E8E8E8] border-[1px] text-sm font-medium text-[#6B7280] font-inter"
							onClick={() => openDeleteModal(row)}>
							<IconTrash />
						</Button>
					</div>
				);
			},
		},
	];

	// Category options
	const categories = [
		"News",
		"Health",
		"Technology",
		"Lifestyle",
		"Entertainment",
		"Sports",
		"Business",
		"Education",
	];

	return (
		<>
			<PostTable columns={columns} data={tableData} />

			{isEditModalOpen && (
				<Modal
					isOpen={isEditModalOpen}
					onClose={closeEditModal}
					title="Update Post"
					className="modal">
					<hr className="mb-4" />
					<div className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto ">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Post Title
							</label>
							<input
								type="text"
								value={postTitle}
								onChange={(e) => setPostTitle(e.target.value)}
								className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
								placeholder="Enter post title"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Category
							</label>
							<select
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm">
								{categories.map((cat) => (
									<option key={cat} value={cat}>
										{cat}
									</option>
								))}
							</select>
						</div>

						{/* File Picker - Render only on client */}
						{isClient && (
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Cover Image
								</label>
								<input
									type="file"
									accept="image/*"
									onChange={handleFileChange}
									className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
								/>
								{previewImage && (
									<div className="mt-2">
										<img
											src={previewImage}
											alt="Preview"
											className="w-32 h-32 object-cover rounded-md"
										/>
									</div>
								)}
							</div>
						)}

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Post Status
							</label>
							<select
								value={status}
								onChange={(e) => setStatus(e.target.value)}
								className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm">
								<option value="draft">Draft</option>
								<option value="publish">Publish</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Content
							</label>
							{isClient && (
								<ReactQuill
									value={content}
									onChange={setContent}
									modules={modules}
									className="mt-2"
									placeholder="Write your post content here..."
								/>
							)}
						</div>

						<div className="flex justify-end space-x-2">
							<Button
								variant="ghost"
								onClick={closeEditModal}
								className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs">
								Cancel
							</Button>
							<Button
								onClick={handleUpdatePost}
								className="bg-primary-2 text-white font-inter text-xs"
								disabled={isLoading}>
								{isLoading ? "Updating Post..." : "Update Post"}
							</Button>
						</div>
					</div>
				</Modal>
			)}

			{isDeleteModalOpen && (
				<Modal
					onClose={closeDeleteModal}
					isOpen={isDeleteModalOpen}
					className="modal">
					<p>Are you sure you want to delete this post?</p>

					<p className="text-sm text-primary-6">This can't be undone</p>
					<div className="flex flex-row justify-end items-center gap-3 font-inter mt-4">
						<Button
							className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
							onClick={closeDeleteModal}>
							Cancel
						</Button>
						<Button
							className="bg-[#F04F4A] text-white font-inter text-xs modal-delete"
							onClick={handleDelete}>
							Yes, Confirm
						</Button>
					</div>
				</Modal>
			)}
		</>
	);
};

export default PostTableComponent;
