"use client";

import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";

// Define the expected API response type
interface ApiResponse {
	status: string;
	data: Budget[];
}

export interface Budget {
	id: string;
	user_id: string;
	budget_category: string;
	budget_description: string;
	budget_deadline: string;
	budget_amount: string;
	budget_balance: string;
	budget_status: string;
	remind_me_at: string;
	created_at: string;
	updated_at: string;
}

declare module "next-auth" {
	interface Session {
		accessToken?: string;
	}
}

const Table = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isCloseModalOpen, setCloseModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<Budget | null>(null);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [tableData, setTableData] = useState<Budget[]>([]);
	const [progress, setProgress] = useState(0);

	const openDeleteModal = (row: { original: Budget }) => {
		setSelectedRow(row.original);
		setDeleteModalOpen(true);
	};

	const openCloseModal = (row: { original: Budget }) => {
		setSelectedRow(row.original);
		setCloseModalOpen(true);
	};

	const closeDeleteModal = () => setDeleteModalOpen(false);
	const closeCloseModal = () => setCloseModalOpen(false);

	const fetchBudgetData = async () => {
		try {
			setIsLoading(true);
			const session = await getSession();

			if (!session?.accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}

			const response = await axios.get<ApiResponse>(
				"https://api.kuditrak.ng/api/v1/budget",
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${session?.accessToken}`,
					},
				}
			);

			if (response.data.status === "success") {
				setTableData(response.data.data);

				const totalBalance = response.data.data.reduce(
					(sum, budget) => sum + parseFloat(budget.budget_balance || "0"),
					0
				);
				const totalAmount = response.data.data.reduce(
					(sum, budget) => sum + parseFloat(budget.budget_amount || "0"),
					0
				);
				const calculatedProgress =
					totalAmount > 0 ? totalBalance / totalAmount : 0;

				setProgress(Math.min(Math.max(calculatedProgress, 0), 1));
			}
		} catch (error) {
			console.error("Error fetching budget data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchBudgetData();
	}, []);

	const handleDelete = () => {
		const selectedRowIds = Object.keys(rowSelection).filter(
			(key) => rowSelection[key]
		);

		// Filter out selected rows
		const filteredData = tableData.filter(
			(row) => !selectedRowIds.includes(row.id)
		);
		setTableData(filteredData);
		setRowSelection({});
		closeDeleteModal();
	};

	const formatDate = (rawDate: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "short",
			day: "numeric",
		};
		const parsedDate = new Date(rawDate);
		return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
	};

	const formatCurrency = (amount: string) => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			minimumFractionDigits: 2,
		}).format(parseFloat(amount));
	};

	// Define table columns
	const columns: ColumnDef<Budget>[] = [
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
			accessorKey: "budget_category",
			header: ({ column }) => (
				<Button
					variant="ghost"
					className="text-[13px] text-left"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Category
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const category = row.getValue<string>("budget_category");
				return (
					<span className="text-xs text-black capitalize">{category}</span>
				);
			},
		},
		{
			accessorKey: "budget_description",
			header: "Description",
			cell: ({ row }) => {
				const description = row.getValue<string>("budget_description");
				return <span className="text-xs text-primary-6">{description}</span>;
			},
		},
		{
			accessorKey: "budget_amount",
			header: ({ column }) => (
				<Button
					variant="ghost"
					className="text-[13px] text-left"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Amount
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const amount = row.getValue<string>("budget_amount");
				return (
					<span className="text-xs text-primary-6">
						{formatCurrency(amount)}
					</span>
				);
			},
		},
		{
			accessorKey: "budget_balance",
			header: "Balance",
			cell: ({ row }) => {
				const balance = row.getValue<string>("budget_balance");
				return (
					<span className="text-xs text-primary-6">
						{formatCurrency(balance)}
					</span>
				);
			},
		},
		{
			accessorKey: "progress",
			header: "Spending Progress",
			cell: ({ row }) => {
				const amount = parseFloat(row.getValue<string>("budget_amount"));
				const balance = parseFloat(row.getValue<string>("budget_balance"));
				const spent = amount - balance;
				const progress = (spent / amount) * 100;
				const progressPercentage = Math.min(Math.max(progress, 0), 100); // Clamp between 0-100

				return (
					<div className="flex items-center gap-2 w-full">
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className={`h-2 rounded-full ${
									progressPercentage < 50
										? "bg-green-500 bggreen"
										: "bg-red-500 bgred"
								}`}
								style={{ width: `${progressPercentage}%` }}
							/>
						</div>
						<span className="text-xs text-gray-600 w-12">
							{progressPercentage.toFixed(0)}%
						</span>
					</div>
				);
			},
		},
		{
			accessorKey: "budget_status",
			header: "Status",
			cell: ({ row }) => {
				const status = row.getValue<string>("budget_status");
				return (
					<span
						className={`text-xs px-2 py-1 rounded-full ${
							status === "active" ? "bg-green-100 status green" : "status red"
						}`}>
						{status}
					</span>
				);
			},
		},
		{
			accessorKey: "budget_deadline",
			header: "Deadline",
			cell: ({ row }) => {
				const deadline = row.getValue<string>("budget_deadline");
				return (
					<span className="text-xs text-primary-6">{formatDate(deadline)}</span>
				);
			},
		},
		{
			accessorKey: "remind_me_at",
			header: "Reminder",
			cell: ({ row }) => {
				const reminder = row.getValue<string>("remind_me_at");
				return (
					<span className="text-xs text-primary-6 capitalize">{reminder}</span>
				);
			},
		},
	];

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<DataTable columns={columns} data={tableData} />
			)}
		</>
	);
};

export default Table;
