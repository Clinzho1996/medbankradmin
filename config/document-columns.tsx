"use client";

import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DocumentDataTables } from "./document-table";

interface ApiResponse {
	data: {
		data: Transaction[];
	};
}
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
			accessorKey: "name",
			header: "Sender",
			cell: ({ row }) => {
				if (!row) return null; // or return a placeholder
				const name = row.getValue<string>("name") || "N/A";
				const email = row.getValue<string>("email") || "N/A";
				return (
					<div className="flex flex-row justify-start items-center gap-2">
						<Image
							src="/images/avatar.png"
							alt={name}
							width={30}
							height={30}
							className="w-8 h-8 rounded-full"
						/>
						<span className="text-xs text-primary-6">{name}</span>
					</div>
				);
			},
		},

		{
			accessorKey: "amount",
			header: "Amount",
			cell: ({ row }) => {
				const amount = row.getValue<string>("amount");

				return <span className="text-xs text-primary-6">{amount}</span>;
			},
		},

		{
			accessorKey: "status",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						className="text-[13px] text-start items-start"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Status
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const status = row.getValue<string>("status");
				return (
					<div className={`status ${status === "completed" ? "green" : "red"}`}>
						{status}
					</div>
				);
			},
		},

		{
			accessorKey: "id",
			header: "Transaction ID",
			cell: ({ row }) => {
				const id = row.getValue<string>("id");

				return (
					<span className="text-xs text-primary-6">
						{id.length > 20 ? id.slice(0, 20) + "..." : id}
					</span>
				);
			},
		},
		{
			accessorKey: "created",
			header: "Created On",
			cell: ({ row }) => {
				const created = row.getValue<string>("created");

				return (
					<span className="text-xs text-primary-6">{formatDate(created)}</span>
				);
			},
		},

		{
			accessorKey: "narration",
			header: "Narration",
			cell: ({ row }) => {
				const narration = row.getValue<string>("narration");

				return <span className="text-xs text-primary-6">{narration}</span>;
			},
		},

		{
			id: "actions",
			header: "Action",
			cell: ({ row }) => {
				const actions = row.original;

				return (
					<div className="flex flex-row justify-start items-center gap-5">
						<Link href={`/booking-handling/${actions.id}`}>
							<Button className="border-[#E8E8E8] border-[1px] text-sm font-medium text-[#6B7280] font-inter">
								View Details
							</Button>
						</Link>
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
		</>
	);
};

export default DocumentTable;
