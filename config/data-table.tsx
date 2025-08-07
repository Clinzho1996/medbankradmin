"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	RowSelectionState,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import * as XLSX from "xlsx";

import Modal from "@/components/Modal";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { IconCirclePlusFilled, IconFileExport } from "@tabler/icons-react";
import axios from "axios";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Budget } from "./columns";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

interface ApiResponse {
	status: string;
	data: Budget[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [globalFilter, setGlobalFilter] = useState("");
	const [selectedStatus, setSelectedStatus] = useState<string>("View All");
	const [tableData, setTableData] = useState<TData[]>(data);
	const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Updated form state to match API payload
	const [budgetForm, setBudgetForm] = useState({
		budget_category: "",
		budget_description: "",
		budget_deadline: "",
		budget_amount: "",
		remind_me_at: "monthly", // Default value
	});

	useEffect(() => {
		setTableData(data);
	}, [data]);

	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			globalFilter,
		},
	});

	const handleExport = () => {
		const worksheet = XLSX.utils.json_to_sheet(tableData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
		const binaryString = XLSX.write(workbook, {
			bookType: "xlsx",
			type: "binary",
		});
		const blob = new Blob([s2ab(binaryString)], {
			type: "application/octet-stream",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "budgets.xlsx";
		link.click();
		URL.revokeObjectURL(url);
	};

	const s2ab = (s: string) => {
		const buf = new ArrayBuffer(s.length);
		const view = new Uint8Array(buf);
		for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
		return buf;
	};

	const openBudgetModal = () => setIsBudgetModalOpen(true);
	const closeBudgetModal = () => setIsBudgetModalOpen(false);

	const handleBudgetFormChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setBudgetForm((prev) => ({ ...prev, [name]: value }));
	};

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
				setTableData(response.data.data as TData[]);
			}
		} catch (error) {
			console.error("Error fetching budget data:", error);
		} finally {
			setIsLoading(false);
		}
	};
	const handleBudgetSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const session = await getSession();
			const accessToken = session?.accessToken;

			if (!accessToken) {
				toast.error("Authentication required");
				return;
			}

			// Prepare payload matching API structure
			const payload = {
				budget_category: budgetForm.budget_category,
				budget_description: budgetForm.budget_description,
				budget_deadline: budgetForm.budget_deadline,
				budget_amount: budgetForm.budget_amount,
				remind_me_at: "monthly",
			};

			const response = await axios.post(
				"https://api.kuditrak.ng/api/v1/budget",
				payload,
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.status === 200 || response.status === 201) {
				toast.success("Budget created successfully!");
				closeBudgetModal();
				await fetchBudgetData(); // Refetch budget data after creation
				// Reset form
				setBudgetForm({
					budget_category: "",
					budget_description: "",
					budget_deadline: "",
					budget_amount: "",
					remind_me_at: "monthly",
				});
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error("Error creating budget:", error);
				toast.error(
					error?.response?.data?.message || "Failed to create budget"
				);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleStatusFilter = (status: string) => {
		setSelectedStatus(status);

		const statusMap: Record<string, string | null> = {
			"View All": null,
			Active: "active",
			Inactive: "inactive",
		};

		const apiStatus = statusMap[status];

		if (apiStatus === null) {
			setTableData(data);
		} else {
			const filteredData = data.filter(
				(budget: any) => budget.budget_status === apiStatus
			);
			setTableData(filteredData);
		}
	};

	useEffect(() => {
		handleStatusFilter(selectedStatus);
	}, [data]);

	return (
		<div className="rounded-lg border-[1px] py-0">
			<Modal
				onClose={closeBudgetModal}
				isOpen={isBudgetModalOpen}
				className="w-[500px] budget">
				<div className="bg-white border p-6 rounded-lg w-full max-w-md">
					<h2 className="text-xl font-semibold mb-2 text-center">
						Create New Budget
					</h2>
					<p className="text-sm text-gray-600 mb-6 text-center">
						Please provide the information below
					</p>

					<form onSubmit={handleBudgetSubmit}>
						<div className="space-y-4 mb-6 mt-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Budget Category*
								</label>
								<Select
									value={budgetForm.budget_category}
									onValueChange={(value) =>
										setBudgetForm((prev) => ({
											...prev,
											budget_category: value,
										}))
									}
									required>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent className="bg-white z-200 select">
										<SelectItem value="#Food">Food</SelectItem>
										<SelectItem value="#Vacation">Vacation</SelectItem>
										<SelectItem value="#Transport">Transport</SelectItem>
										<SelectItem value="#UtilityBill">Utility Bill</SelectItem>
										<SelectItem value="#Entertainment">
											Entertainment
										</SelectItem>
										<SelectItem value="#Healthcare">Healthcare</SelectItem>
										<SelectItem value="#Education">Education</SelectItem>
										<SelectItem value="#Groceries">Groceries</SelectItem>
										<SelectItem value="#Shopping">Shopping</SelectItem>
										<SelectItem value="#Housing">Housing</SelectItem>
										<SelectItem value="#Savings">Savings</SelectItem>
										<SelectItem value="#Insurance">Insurance</SelectItem>
										<SelectItem value="#LoanPayment">Loan Payment</SelectItem>
										<SelectItem value="#Miscellaneous">
											Miscellaneous
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Budget Description*
								</label>
								<Input
									type="text"
									name="budget_description"
									placeholder="e.g. Monthly food expenses"
									value={budgetForm.budget_description}
									onChange={handleBudgetFormChange}
									className="w-full"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Budget Amount (NGN)*
								</label>
								<Input
									type="number"
									name="budget_amount"
									placeholder="e.g. 50000"
									value={budgetForm.budget_amount}
									onChange={handleBudgetFormChange}
									className="w-full"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Deadline Date*
								</label>
								<Input
									type="date"
									name="budget_deadline"
									value={budgetForm.budget_deadline}
									onChange={handleBudgetFormChange}
									className="w-full"
									required
								/>
							</div>
						</div>

						<div className="flex justify-end space-x-3 mt-4 w-full gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={closeBudgetModal}
								className="px-4 py-2 w-full bg-[#F0F0F0] rounded-lg"
								disabled={isSubmitting}>
								Cancel
							</Button>
							<Button
								type="submit"
								className="bg-[#C3FF9D] hover:bg-[#B0E68C] px-4 py-2 w-full rounded-lg"
								disabled={isSubmitting}>
								{isSubmitting ? "Creating..." : "Create Budget"}
							</Button>
						</div>
					</form>
				</div>
			</Modal>

			<div className="p-3 flex flex-row justify-between border-b-[1px] border-[#E2E4E9] bg-white items-center rounded-t-lg">
				<div className="hidden lg:flex flex-row justify-start bg-white items-center rounded-lg special-btn-farmer pr-2">
					{["View All", "Active", "Inactive"].map((status, index, arr) => (
						<p
							key={status}
							className={`px-2 py-2 text-center text-sm cursor-pointer border border-[#E2E4E9] overflow-hidden ${
								selectedStatus === status
									? "bg-[#ECFAF6] text-dark-1 tab"
									: "text-[#344054]"
							} 
			${index === 0 ? "rounded-l-lg firstRound" : ""} 
			${index === arr.length - 1 ? "rounded-r-lg lastRound" : ""}`}
							onClick={() => handleStatusFilter(status)}>
							{status}
						</p>
					))}
				</div>
				<div className="p-3 flex flex-row justify-start items-center gap-3 w-full">
					<Input
						className="bg-[#F9FAFB] border-[#E8E8E8] border-[1px] w-full input"
						placeholder="Search budgets by name or amount..."
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
					/>

					<Button
						className="border-[#E8E8E8] border-[1px] hidden lg:flex"
						onClick={handleExport}>
						<IconFileExport /> Export
					</Button>
					<Button
						onClick={openBudgetModal}
						className="bg-[#C3FF9D] border border-[#FFFFFF00]">
						<IconCirclePlusFilled /> Create Budget
					</Button>
				</div>
			</div>

			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="bg-primary-3">
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id} className="bg-primary-3 text-xs">
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody className="bg-white">
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-left text-xs text-primary-6">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<div className="flex items-center justify-between bg-white rounded-lg py-3 px-2 border-t-[1px] border-gray-300 mt-2">
				<div className="flex-1 text-xs text-primary-6 text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="flex items-center space-x-10 lg:space-x-10 gap-3">
					<div className="flex items-center space-x-4 gap-2">
						<p className="text-xs text-primary-6 font-medium">Rows per page</p>
						<Select
							value={`${table.getState().pagination.pageSize}`}
							onValueChange={(value) => {
								table.setPageSize(Number(value));
							}}>
							<SelectTrigger className="h-8 w-[70px] bg-white z-10">
								<SelectValue
									placeholder={table.getState().pagination.pageSize}
								/>
							</SelectTrigger>
							<SelectContent side="top" className="bg-white">
								{[5, 10, 20, 30, 40, 50].map((pageSize) => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex w-[100px] items-center justify-center font-medium text-xs text-primary-6">
						{table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()} pages
					</div>
					<div className="flex items-center space-x-5 gap-2">
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}>
							<span className="sr-only">Go to first page</span>
							<ChevronsLeft />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}>
							<span className="sr-only">Go to previous page</span>
							<ChevronLeft />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}>
							<span className="sr-only">Go to next page</span>
							<ChevronRight />
						</Button>
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}>
							<span className="sr-only">Go to last page</span>
							<ChevronsRight />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
