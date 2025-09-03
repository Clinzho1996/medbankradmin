"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconArrowRight } from "@tabler/icons-react";
import axios from "axios";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Folder {
	_id: string;
	name: string;
	folder_description: string;
	createdAt: string;
	files?: FileItem[];
}

interface FileItem {
	_id: string;
	name: string;
	type: string;
	createdAt: string;
	size?: string;
}

const HealthVault = () => {
	const { id } = useParams(); // get user id from route params
	const [folders, setFolders] = useState<Folder[]>([]);
	const [loading, setLoading] = useState(true);

	// Get session + token
	const getAuthHeaders = async () => {
		const session = await getSession();
		const accessToken = session?.accessToken;
		if (!accessToken) return null;
		return {
			Accept: "application/json",
			Authorization: `Bearer ${accessToken}`,
		};
	};

	// Fetch folders for a user
	useEffect(() => {
		const fetchFolders = async () => {
			try {
				const headers = await getAuthHeaders();
				if (!headers) return;

				const res = await axios.get(
					`https://api.medbankr.ai/api/v1/administrator/user/${id}/folder`,
					{ headers }
				);

				if (res.data.status) {
					setFolders(res.data.data);
				} else {
					toast.error("Failed to fetch folders");
				}
			} catch (err) {
				console.error(err);
				toast.error("Error fetching folders");
			} finally {
				setLoading(false);
			}
		};

		if (id) fetchFolders();
	}, [id]);

	// Fetch files in a folder
	const fetchFiles = async (folderId: string) => {
		try {
			const headers = await getAuthHeaders();
			if (!headers) return;

			const res = await axios.get(
				`https://api.medbankr.ai/api/v1/administrator/user/${id}/folder/${folderId}`,
				{ headers }
			);

			if (res.data.status) {
				setFolders((prev) =>
					prev.map((f) =>
						f._id === folderId ? { ...f, files: res.data.data.files } : f
					)
				);
			}
		} catch (err) {
			console.error(err);
			toast.error("Error fetching files");
		}
	};

	if (loading) {
		return <p className="p-4">Loading Health Vault...</p>;
	}

	return (
		<div className="flex h-full min-h-[600px] w-full">
			<Tabs
				defaultValue={folders[0]?._id}
				className="flex w-full gap-6"
				onValueChange={(val) => fetchFiles(val)}>
				{/* Sidebar */}
				<TabsList className="flex flex-col h-full w-[30%] p-2 bg-gray-50 border rounded-lg shadow-lg justify-start">
					<div className="flex flex-col gap-2 py-4">
						<p className="font-normal text-left">Health Vault</p>
						<p className="text-sm text-gray-500 text-left">
							Securely store and manage personal health records
						</p>
					</div>
					<div className="bg-white p-3 shadow-lg rounded-lg">
						{folders.map((folder) => (
							<TabsTrigger
								key={folder._id}
								value={folder._id}
								className="w-full justify-start px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg border mt-3">
								<div className="flex items-center w-full">
									<div className="mr-3 text-blue-500">
										<img
											src="/images/fold.png"
											alt="folder"
											className="w-8 h-8 object-contain"
										/>
									</div>
									<span className="flex-1 text-left font-medium">
										{folder.name}
									</span>
									<IconArrowRight className="w-4 h-4 ml-2 text-gray-400" />
								</div>
							</TabsTrigger>
						))}
					</div>
				</TabsList>

				{/* Content */}
				<div className="w-[70%]">
					{folders.map((folder) => (
						<TabsContent key={folder._id} value={folder._id} className="h-full">
							<Card className="h-full p-6 shadow-sm">
								<h2 className="text-xl font-semibold mb-2">{folder.name}</h2>
								<p className="text-sm text-gray-500 mb-6">
									{folder.folder_description}
								</p>

								<div className="space-y-4">
									{folder.files && folder.files.length > 0 ? (
										folder.files.map((file) => (
											<Card
												key={file._id}
												className="p-4 flex items-center shadow">
												{/* File Preview */}
												<div className="w-12 h-12 rounded-md flex items-center justify-center mr-4 overflow-hidden">
													<Image
														src="/images/pdfs.png"
														alt="PDF Icon"
														width={40}
														height={40}
													/>
												</div>

												{/* File Info */}
												<div className="flex-1">
													<h3 className="font-medium text-gray-800">
														{file.name}
													</h3>
													<div className="flex text-sm text-gray-500 mt-1">
														<span>
															{new Date(file.createdAt).toLocaleDateString()}
														</span>
														{file.size && (
															<>
																<span className="mx-2">•</span>
																<span>{file.size}</span>
															</>
														)}
													</div>
												</div>
											</Card>
										))
									) : (
										<p className="text-gray-500">No files in this folder</p>
									)}
								</div>
							</Card>
						</TabsContent>
					))}
				</div>
			</Tabs>
		</div>
	);
};

export default HealthVault;
