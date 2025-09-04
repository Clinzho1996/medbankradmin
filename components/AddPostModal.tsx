import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

// Dynamically import ReactQuill (Fixes "document is not defined" error)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface AddPostModalProps {
	isOpen: boolean;
	onClose: () => void;
	onPostAdded: () => void;
}

const AddPostModal = ({ isOpen, onClose, onPostAdded }: AddPostModalProps) => {
	const [isLoading, setIsLoading] = useState(false);
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

	const handleAddPost = async () => {
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
				toast.error("You need to be logged in to create a post.");
				setIsLoading(false);
				return;
			}

			const formData = new FormData();
			formData.append("post_title", postTitle);
			formData.append("content", content);
			formData.append("category", category);
			formData.append("status", status === "draft" ? "draft" : "publish");

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

			const response = await axios.post(
				"https://api.medbankr.ai/api/v1/administrator/blog", // Updated API endpoint
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
				toast.success("Post created successfully!");
				onPostAdded();
				onClose();
				// Reset form
				setPostTitle("");
				setContent("");
				setCategory("News");
				setCoverImage(null);
				setPreviewImage(null);
				setStatus("draft");
			} else {
				toast.error("Failed to create post. Please try again.");
			}
		} catch (error: any) {
			console.error("Error adding post:", error);
			const errorMessage =
				error.response?.data?.message ||
				"An error occurred while adding the post.";
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
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
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Add New Post"
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
					<ReactQuill
						value={content}
						onChange={setContent}
						modules={modules}
						className="mt-2"
						placeholder="Write your post content here..."
					/>
				</div>

				<div className="flex justify-end space-x-2">
					<Button
						variant="ghost"
						onClick={onClose}
						className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs">
						Cancel
					</Button>
					<Button
						onClick={handleAddPost}
						className="bg-secondary-1 cborder text-dark-1 font-inter text-xs"
						disabled={isLoading}>
						{isLoading ? "Adding Post..." : "Add Post"}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default AddPostModal;
