"use client";

import { ColumnDef, RowSelectionState } from "@tanstack/react-table";

import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DocumentDataTables } from "./document-table";

interface Folder {
	_id: string;
	access: string;
	folder_description: string;
	user_id: string;
	created_by: string;
	name: string;
	lock: boolean;
	child: any[];
	parent: string | null;
	createdAt: string;
	updatedAt: string;
	__v: number;
	current_size: number;
	total_file: number;
}

interface ApiResponse {
	status: boolean;
	message: string;
	data: {
		overview: {
			total_storage: number;
			total_file: number;
			avg_file_size: number;
			storage_growth: {
				total: number;
				filesThisWeek: number;
				filesLastWeek: number;
				percentChange: number;
			};
			backup_status: string;
			last_backup_date: string | null;
		};
		folder: Folder[];
		pagination: {
			total: number;
			page: number;
			limit: number;
			pages: number;
		};
	};
	error: string;
}

declare module "next-auth" {
	interface Session {
		accessToken?: string;
	}
}

const DocumentTable = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [tableData, setTableData] = useState<Folder[]>([]);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<Folder | null>(null);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

	const openDeleteModal = (row: Folder) => {
		setSelectedRow(row);
		setDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setDeleteModalOpen(false);
	};

	const fetchFolders = async () => {
		try {
			setIsLoading(true);
			const session = await getSession();

			if (!session?.accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}

			const response = await axios.get<ApiResponse>(
				"https://api.medbankr.ai/api/v1/administrator/vault",
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${session.accessToken}`,
					},
				}
			);

			if (response.data.status === true) {
				const folders = response.data.data.folder;
				console.log("Folders Data:", folders);
				setTableData(folders);
			}
		} catch (error) {
			console.error("Error fetching folder data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchFolders();
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

	const calculatePercentage = (currentSize: number): number => {
		// Assuming max storage is 100MB for demonstration
		// You might want to get this from the API response or use a different calculation
		const maxStorage = 100;
		return Math.min(100, Math.round((currentSize / maxStorage) * 100));
	};

	const renderBars = (percentage: number) => {
		const totalBars = 20;
		const filledBars = Math.round((totalBars * percentage) / 100);
		const colors = ["#8B5CF6", "#34D399", "#F59E0B", "#EF4444", "#3B82F6"];

		return (
			<div className="flex flex-wrap gap-1 mt-2">
				{Array.from({ length: totalBars }).map((_, index) => (
					<div
						key={index}
						className="w-[6px] h-12 rounded-sm"
						style={{
							backgroundColor:
								index < filledBars ? colors[index % colors.length] : "#E5E7EB",
						}}
					/>
				))}
			</div>
		);
	};

	const columns: ColumnDef<Folder>[] = [
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
			accessorKey: "_id",
			header: "ID",
			cell: ({ row }) => {
				const id = row.original._id;
				return (
					<span className="text-xs text-primary-6">
						FOL-{id.length > 10 ? `${id.slice(0, 10)}...` : id}
					</span>
				);
			},
		},
		{
			accessorKey: "name",
			header: "Folder Name",
			cell: ({ row }) => {
				const folder = row.original;
				return (
					<div className="flex flex-row justify-start items-center gap-2">
						<Image
							src="/images/fold2.png"
							alt={folder.name}
							width={30}
							height={30}
							className="w-8 h-8 rounded-md"
						/>
						<span className="text-xs text-primary-6">{folder.name}</span>
					</div>
				);
			},
		},
		{
			accessorKey: "total_file",
			header: "Number of Files",
			cell: ({ row }) => {
				const totalFiles = row.original.total_file;
				return <span className="text-xs text-primary-6">{totalFiles}</span>;
			},
		},
		{
			accessorKey: "createdAt",
			header: "Date Created",
			cell: ({ row }) => {
				const createdAt = row.original.createdAt;
				return (
					<span className="text-xs text-primary-6">
						{formatDate(createdAt)}
					</span>
				);
			},
		},
		{
			id: "percentage",
			header: "Percentage",
			cell: ({ row }) => {
				const folder = row.original;
				const percentage = calculatePercentage(folder.current_size);

				return (
					<div className="flex flex-row justify-start items-center gap-4">
						<span className="text-xs text-primary-6">
							{renderBars(percentage)}
						</span>
						<span className="bg-[#EFF1F5] p-2 border rounded-lg text-[#5B88FC]">
							{percentage}%
						</span>
					</div>
				);
			},
		},
		{
			id: "actions",
			header: "Action",
			cell: ({ row }) => {
				const folder = row.original;
				return (
					<div className="flex flex-row justify-start items-center gap-5">
						<Button
							className="border-[#E8E8E8] border-[1px] text-sm font-medium text-[#6B7280] font-inter"
							onClick={() => openDeleteModal(folder)}>
							View Details
						</Button>
					</div>
				);
			},
		},
	];

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<DocumentDataTables columns={columns} data={tableData} />
			)}

			{isDeleteModalOpen && selectedRow && (
				<Modal onClose={closeDeleteModal} isOpen={isDeleteModalOpen}>
					<div className="flex flex-col gap-4 w-full sm:w-[500px]">
						<div className="border-y p-3">
							<p className="text-xs text-[#6C7278]">FOLDER SIZE</p>
							<div className="flex flex-row justify-start items-center gap-4">
								<span className="text-dark-1 text-sm">
									{selectedRow.current_size.toFixed(2)} MB
								</span>
								<span className="status green">
									{selectedRow.lock ? "Locked" : "Unlocked"}
								</span>
							</div>
						</div>

						<div className="border-b pb-3 px-3 flex flex-row justify-start items-center gap-10">
							<div className="flex flex-col justify-start gap-1">
								<p className="text-xs text-[#6C7278]">Folder ID</p>
								<span className="text-dark-1 text-sm">
									{selectedRow._id.length > 10
										? selectedRow._id.slice(0, 10) + "..."
										: selectedRow._id}
								</span>
							</div>
							<p className="text-xs text-[#6C7278]">|</p>
							<div className="flex flex-col justify-start gap-1">
								<p className="text-xs text-[#6C7278]">Created Date</p>
								<span className="text-dark-1 text-sm">
									{formatDate(selectedRow.createdAt)}
								</span>
							</div>
						</div>

						<div className="border-b pb-3 px-3 flex flex-row justify-start items-center gap-10 shadow-lg">
							<div className="flex flex-col justify-start gap-1">
								<p className="text-dark-1 text-xs ">Folder Details</p>
							</div>
						</div>

						<div className="border border-secondary-1 rounded-lg p-3 flex flex-col gap-4 shadow-lg shadow-[#E4E5E73D]">
							<div className="flex flex-row justify-between items-center">
								<p className="text-xs text-[#6C7278]">Folder Name</p>
								<p className="text-sm text-dark-1">{selectedRow.name}</p>
							</div>

							<div className="flex flex-row justify-between items-center">
								<p className="text-xs text-[#6C7278]">Description</p>
								<p className="text-sm text-dark-1">
									{selectedRow.folder_description}
								</p>
							</div>

							<div className="flex flex-row justify-between items-center">
								<p className="text-xs text-[#6C7278]">Access Level</p>
								<p className="text-sm text-dark-1 capitalize">
									{selectedRow.access}
								</p>
							</div>

							<div className="flex flex-row justify-between items-center">
								<p className="text-xs text-[#6C7278]">Number of Files</p>
								<p className="text-sm text-dark-1">{selectedRow.total_file}</p>
							</div>

							<div className="flex flex-row justify-between items-center">
								<p className="text-xs text-[#6C7278]">Current Size</p>
								<p className="text-sm text-dark-1">
									{selectedRow.current_size.toFixed(2)} MB
								</p>
							</div>

							<div className="flex flex-row justify-between items-center">
								<p className="text-xs text-[#6C7278]">Lock Status</p>
								<p className="text-sm text-dark-1">
									{selectedRow.lock ? "Locked" : "Unlocked"}
								</p>
							</div>
						</div>

						<div className="flex flex-row justify-end items-center gap-3 font-inter mt-4">
							<Button
								className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
								onClick={closeDeleteModal}>
								Cancel
							</Button>
							<Button
								className="bg-secondary-1 text-dark-1 font-inter text-xs"
								onClick={() => {
									closeDeleteModal();
								}}>
								Edit
							</Button>
						</div>
					</div>
				</Modal>
			)}
		</>
	);
};

export default DocumentTable;
