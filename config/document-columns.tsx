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

interface ApiResponse {
	data: {
		data: Transaction[];
	};
}

const trafficData = [
	{
		platform: "IOS",
		value: 143382,
		color: "#8B5CF6",
		barCount: 30,
	},
	{
		platform: "Android",
		value: 87974,
		color: "#34D399",
		barCount: 40,
	},
	{
		platform: "Web",
		value: 87974,
		color: "#F59E0B",
		barCount: 50,
	},
];

export type Transaction = {
	id: string;
	user: { first_name: string; last_name: string; other_name: string };
	name: string;
	first_name: string;
	last_name: string;
	other_name: string;
	amount: string;
	date: string;
	created: string;
	created_at: string;
	ref_id: string;
	status: string;
	narration: string;
};

declare module "next-auth" {
	interface Session {
		accessToken?: string;
	}
}

const DocumentTable = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [tableData, setTableData] = useState<Transaction[]>([]);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<any>(null);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

	const openDeleteModal = (row: any) => {
		setSelectedRow(row.original); // Use row.original to store the full row data
		setDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setDeleteModalOpen(false);
	};

	const fetchTransactionHistory = async () => {
		try {
			setIsLoading(true);
			const session = await getSession();

			if (!session?.accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}

			const response = await axios.get<ApiResponse>(
				"https://api.kuditrak.ng/api/v1/transaction/all",
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${session?.accessToken}`,
					},
				}
			);

			const fetchedData = response.data.data.data;

			console.log("Transaction Data:", fetchedData);

			const mappedData = fetchedData.map((item) => ({
				id: item.id,
				name: `${item.user.first_name} ${item.user.last_name} ${
					item.user.other_name || ""
				}`,
				first_name: item.user.first_name,
				user: item.user,
				last_name: item.user.last_name,
				other_name: item.user.other_name,
				amount: item.amount,
				date: item.date,
				narration: item.narration,
				ref_id: item.ref_id,
				created: item.created_at,
				created_at: item.created_at,
				status: item.ref_id ? "completed" : "pending",
			}));

			setTableData(mappedData);
		} catch (error) {
			console.error("Error fetching user data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTransactionHistory();
	}, []);

	const formatDate = (rawDate: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
		}; // Correct types
		const parsedDate = new Date(rawDate); // Ensure the date is parsed correctly
		return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
	};

	const renderBars = (filled: number, total: number, colors: string[]) => {
		return (
			<div className="flex flex-wrap gap-1 mt-2">
				{Array.from({ length: total }).map((_, index) => (
					<div
						key={index}
						className="w-[6px] h-12 rounded-sm"
						style={{
							backgroundColor:
								index < filled ? colors[index % colors.length] : "#E5E7EB",
						}}
					/>
				))}
			</div>
		);
	};

	const columns: ColumnDef<Transaction>[] = [
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
				if (!row) return null; // or return a placeholder
				const email = row.getValue<string>("email") || "Lab Results";
				return (
					<div className="flex flex-row justify-start items-center gap-2">
						<Image
							src="/images/fold2.png"
							alt={email}
							width={30}
							height={30}
							className="w-8 h-8 rounded-md"
						/>
						<span className="text-xs text-primary-6">{email}</span>
					</div>
				);
			},
		},

		{
			accessorKey: "amount",
			header: "Number of Files",
			cell: ({ row }) => {
				const amount = row.getValue<string>("amount");

				return <span className="text-xs text-primary-6">{amount}</span>;
			},
		},
		{
			accessorKey: "created",
			header: "Date Created",
			cell: ({ row }) => {
				const created = row.getValue<string>("created");

				return (
					<span className="text-xs text-primary-6">{formatDate(created)}</span>
				);
			},
		},

		{
			accessorKey: "narration",
			header: "Percentage",
			cell: ({ row }) => {
				// Generate random percentage between 0 and 100 for demonstration
				const percentage = Math.min(100, Math.round(Math.random() * 120)); // Ensures max 100%
				const colors = ["#8B5CF6", "#34D399", "#F59E0B", "#EF4444", "#3B82F6"]; // Different colors

				return (
					<div className="flex flex-row justify-start items-center gap-4">
						<span className="text-xs text-primary-6">
							{renderBars(
								Math.round((20 * percentage) / 100), // 20 bars total
								20, // Total bars
								colors
							)}
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
				const actions = row.original;

				return (
					<div className="flex flex-row justify-start items-center gap-5">
						<Button
							className="border-[#E8E8E8] border-[1px] text-sm font-medium text-[#6B7280] font-inter"
							onClick={() => openDeleteModal(row)}>
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

			{isDeleteModalOpen && (
				<Modal onClose={closeDeleteModal} isOpen={isDeleteModalOpen}>
					<div className="flex flex-col gap-4 w-full sm:w-[500px]">
						<div className="border-y p-3">
							<p className="text-xs text-[#6C7278]">AMOUNT</p>

							<div className="flex flex-row justify-start items-center gap-4">
								<span className=" text-dark-1 text-sm">
									₦{selectedRow?.amount}
								</span>
								<span className="status green">{selectedRow?.status}</span>
							</div>
						</div>

						<div className="border-b pb-3 px-3 flex flex-row justify-start items-center gap-10">
							<div className="flex flex-col justify-start gap-1">
								<p className="text-xs text-[#6C7278]">Transaction ID</p>
								<span className=" text-dark-1 text-sm">
									{selectedRow?.id.length > 10
										? selectedRow?.id.slice(0, 10) + "..."
										: selectedRow?.id}
								</span>
							</div>
							<p className="text-xs text-[#6C7278]">|</p>
							<div className="flex flex-col justify-start gap-1">
								<p className="text-xs text-[#6C7278]">Transaction Date</p>
								<span className=" text-dark-1 text-sm">
									{selectedRow?.created}
								</span>
							</div>
						</div>

						<div className="border-b pb-3 px-3 flex flex-row justify-start items-center gap-10 shadow-lg">
							<div className="flex flex-col justify-start gap-1">
								<p className="text-dark-1 text-xs ">Transaction Details</p>
							</div>
						</div>

						<div className="border border-secondary-1 rounded-lg p-3 flex flex-col gap-4 shadow-lg shadow-[#E4E5E73D]">
							<div className="flex flex-row justify-between items-center">
								<p className="text-xs text-[#6C7278]">Sender ID</p>
								<p className="text-sm text-dark-1">{selectedRow?.id}</p>
							</div>

							<div className="flex flex-row justify-between items-center">
								<p className="text-xs text-[#6C7278]">Sender Name</p>
								<p className="text-sm text-dark-1">{selectedRow?.name}</p>
							</div>

							<div className="flex flex-row justify-between items-center">
								<p className="text-xs text-[#6C7278]">Sender Email</p>
								<p className="text-sm text-dark-1">
									{selectedRow?.email}{" "}
									<span className="text-xs text-[#6C7278]">Not Provided</span>
								</p>
							</div>
							<div className="flex flex-row justify-between items-center">
								<p className="text-xs text-[#6C7278]">Type</p>
								<p className="text-sm text-dark-1">{selectedRow?.narration}</p>
							</div>

							<div className="flex flex-row justify-between items-center">
								<p className="text-xs text-[#6C7278]">Description</p>
								<p className="text-sm text-dark-1">
									Premium Individual - Monthly
								</p>
							</div>

							<div className="flex flex-row justify-between items-center">
								<p className="text-xs text-[#6C7278]">Payment Method</p>
								<p className="text-sm text-dark-1">Debit Card</p>
							</div>
						</div>

						<div className="flex flex-row justify-end items-center gap-3 font-inter mt-4">
							<Button
								className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
								onClick={closeDeleteModal}>
								Cancel
							</Button>
							<Button
								className="bg-secondary-1  text-dark-1 font-inter text-xs"
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
