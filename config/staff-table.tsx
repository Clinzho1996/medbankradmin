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

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { IconFileExport, IconPlus, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

interface Role {
	_id: string;
	name: string;
	title?: string;
	description: string;
	permission: string[];
	count?: number;
}

interface ApiResponse {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	picture: string | null;
	staff_code: string;
	role: string;
	is_active: boolean;
	last_logged_in: string | null;
	created_at: string;
	updated_at: string;
	status?: string;
}

export function StaffDataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [selectedStatus, setSelectedStatus] = useState<string>("View All");
	const [globalFilter, setGlobalFilter] = useState("");
	const [isModalOpen, setModalOpen] = useState(false);
	const [isAddModalOpen, setAddModalOpen] = useState(false);
	const [tableData, setTableData] = useState<TData[]>(data);
	const [isLoading, setIsLoading] = useState(false);
	const [isAdding, setIsAdding] = useState(false);
	const [roles, setRoles] = useState<Role[]>([]);
	const [isLoadingRoles, setIsLoadingRoles] = useState(false);

	const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

	// State for form inputs for adding new staff
	const [newStaffData, setNewStaffData] = useState({
		name: "",
		email: "",
		role: "",
	});

	// Fetch roles from API
	const fetchRoles = async () => {
		try {
			setIsLoadingRoles(true);
			const session = await getSession();
			const accessToken = session?.accessToken;

			if (!accessToken) {
				console.error("No access token found.");
				return;
			}

			const response = await axios.get(
				"https://api.medbankr.ai/api/v1/administrator/permission",
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.data.status === true) {
				setRoles(response.data.data);
			}
		} catch (error) {
			console.error("Error fetching roles:", error);
			toast.error("Failed to fetch roles");
		} finally {
			setIsLoadingRoles(false);
		}
	};

	useEffect(() => {
		fetchRoles();
	}, []);

	const openModal = () => setModalOpen(true);
	const closeModal = () => setModalOpen(false);
	const openAddModal = () => {
		setAddModalOpen(true);
		// Fetch roles again to ensure we have the latest data
		fetchRoles();
	};
	const closeAddModal = () => {
		setAddModalOpen(false);
		setNewStaffData({
			name: "",
			email: "",
			role: "",
		});
	};

	// Sync `tableData` with `data` prop
	useEffect(() => {
		setTableData(data);
	}, [data]);

	// Function to filter data based on date range
	const filterDataByDateRange = () => {
		if (!dateRange?.from || !dateRange?.to) {
			setTableData(data); // Reset to all data
			return;
		}

		const filteredData = data.filter((farmer: any) => {
			const dateJoined = new Date(farmer.date);
			return dateJoined >= dateRange.from! && dateJoined <= dateRange.to!;
		});

		setTableData(filteredData);
	};

	useEffect(() => {
		filterDataByDateRange();
	}, [dateRange]);

	const handleStatusFilter = (status: string) => {
		setSelectedStatus(status);

		if (status === "View All") {
			setTableData(data); // Reset to all data
		} else {
			const filteredData = data?.filter(
				(farmer) =>
					(farmer as any)?.status?.toLowerCase() === status.toLowerCase()
			);

			setTableData(filteredData as TData[]);
		}
	};

	const handleExport = () => {
		// Convert the table data to a worksheet
		const worksheet = XLSX.utils.json_to_sheet(tableData);

		// Create a new workbook and add the worksheet
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Farmers");

		// Generate a binary string from the workbook
		const binaryString = XLSX.write(workbook, {
			bookType: "xlsx",
			type: "binary",
		});

		// Convert the binary string to a Blob
		const blob = new Blob([s2ab(binaryString)], {
			type: "application/octet-stream",
		});

		// Create a link element and trigger the download
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "staffs.xlsx";
		link.click();

		// Clean up
		URL.revokeObjectURL(url);
	};

	// Utility function to convert string to ArrayBuffer
	const s2ab = (s: string) => {
		const buf = new ArrayBuffer(s.length);
		const view = new Uint8Array(buf);
		for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
		return buf;
	};

	const bulkDeleteStaff = async () => {
		try {
			const session = await getSession();
			const accessToken = session?.accessToken;

			if (!accessToken) {
				console.error("No access token found.");
				toast.error("No access token found. Please log in again.");
				return;
			}

			const selectedIds = Object.keys(rowSelection).map(
				(index) => (tableData[parseInt(index)] as any)?.id
			);

			if (selectedIds.length === 0) {
				toast.warn("No staff selected for deletion.");
				return;
			}

			console.log("Selected IDs for deletion:", selectedIds);

			const response = await axios.delete(
				"https://api.wowdev.com.ng/api/v1/user/bulk/delete",
				{
					data: { user_ids: selectedIds }, // Ensure this matches the API's expected payload
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.status === 200) {
				toast.success("Selected staff deleted successfully!");

				// Update the table data by filtering out the deleted staff
				setTableData((prevData) =>
					prevData.filter((staff) => !selectedIds.includes((staff as any).id))
				);

				// Clear the selection
				setRowSelection({});
			}
		} catch (error) {
			console.error("Error bulk deleting staff:", error);
			if (axios.isAxiosError(error)) {
				toast.error(
					error.response?.data?.message ||
						"Failed to delete staff. Please try again."
				);
			} else {
				toast.error("An unexpected error occurred. Please try again.");
			}
		}
	};

	const addStaff = async () => {
		try {
			setIsAdding(true);
			const session = await getSession();
			const accessToken = session?.accessToken;

			if (!accessToken) {
				console.error("No access token found.");
				toast.error("Authentication error. Please try again.");
				return;
			}

			// Prepare payload according to API requirements
			const payload = {
				name: newStaffData.name,
				email: newStaffData.email,
				role: newStaffData.role || "*", // Use "*" for Super Admin if no role specified
			};

			const response = await axios.post(
				"https://api.medbankr.ai/api/v1/administrator/staff",
				payload,
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (response.data.status === true) {
				toast.success("Staff member added successfully.");

				// Add the new staff to the table
				const newStaff = {
					id: response.data.data._id,
					public_id: response.data.data.public_id,
					pic: response.data.data.profile_pic,
					full_name: response.data.data.full_name,
					email: response.data.data.email,
					status: response.data.data.status,
					last_login: response.data.data.last_login,
					gender: response.data.data.gender,
					created_at: response.data.data.createdAt,
					verified: response.data.data.verified,
					role: response.data.data.role,
				};

				setTableData((prevData) => [newStaff as TData, ...prevData]);
				closeAddModal();
			}
		} catch (error: any) {
			console.error("Error adding staff:", error);
			const errorMessage =
				error.response?.data?.message ||
				"Failed to add staff. Please try again.";
			toast.error(errorMessage);
		} finally {
			setIsAdding(false);
		}
	};

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

	return (
		<div className="rounded-lg border-[1px] py-0">
			<div className="p-3 flex flex-row justify-between border-b-[1px] border-[#E2E4E9] bg-white items-center gap-20 max-w-full rounded-lg">
				<div className="flex flex-row justify-start bg-white items-center rounded-lg mx-auto special-btn-farmer pr-2">
					{["View All", "Active", "Inactive"].map((status, index, arr) => (
						<p
							key={status}
							className={`px-4 py-2 text-center text-sm cursor-pointer border border-[#E2E4E9] overflow-hidden ${
								selectedStatus === status
									? "bg-primary-5 text-dark-1"
									: "text-dark-1"
							} 
			${index === 0 ? "rounded-l-lg firstRound" : ""} 
			${index === arr.length - 1 ? "rounded-r-lg lastRound" : ""}`}
							onClick={() => handleStatusFilter(status)}>
							{status}
						</p>
					))}
				</div>
				<div className="p-3 flex flex-row justify-start items-center gap-3 w-full ">
					<Input
						placeholder="Search Staff..."
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
						className="focus:border-none bg-[#F9FAFB] w-full"
					/>
					<Button
						className="border-[#E8E8E8] border-[1px] bg-white"
						onClick={bulkDeleteStaff}>
						<IconTrash /> Delete
					</Button>

					<div className="w-[250px]">
						<DateRangePicker dateRange={dateRange} onSelect={setDateRange} />
					</div>
					<Button className="bg-primary-1 text-white" onClick={openAddModal}>
						<IconPlus className="mr-2" size={16} />
						Add Staff
					</Button>
					<Button
						className="bg-secondary-1 border-[1px] border-[#173C3D] text-primary-1 font-inter cborder"
						onClick={handleExport}>
						<IconFileExport /> Export Data
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

			{/* Add Staff Modal */}
			{isAddModalOpen && (
				<Modal
					onClose={closeAddModal}
					isOpen={isAddModalOpen}
					title="Add New Staff">
					<div className="bg-white p-0 rounded-lg transition-transform ease-in-out form modal-small">
						<div className="mt-3 pt-2">
							<div className="flex flex-col gap-2">
								<p className="text-xs text-primary-6">Full Name</p>
								<Input
									type="text"
									placeholder="Enter Full Name"
									className="focus:border-none mt-2"
									value={newStaffData.name}
									onChange={(e) =>
										setNewStaffData({ ...newStaffData, name: e.target.value })
									}
								/>
								<p className="text-xs text-primary-6 mt-2">Email Address</p>
								<Input
									type="email"
									placeholder="Enter Email Address"
									className="focus:border-none mt-2"
									value={newStaffData.email}
									onChange={(e) =>
										setNewStaffData({ ...newStaffData, email: e.target.value })
									}
								/>
								<p className="text-xs text-primary-6 mt-2">Role</p>
								{isLoadingRoles ? (
									<p className="text-xs text-gray-500">Loading roles...</p>
								) : (
									<Select
										value={newStaffData.role}
										onValueChange={(value) =>
											setNewStaffData({ ...newStaffData, role: value })
										}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select role" />
										</SelectTrigger>
										<SelectContent className="bg-white z-10 select text-gray-300">
											{roles.map((role) => (
												<SelectItem key={role._id} value={role.name}>
													{role.title || role.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							</div>
							<hr className="mt-4 mb-4 text-[#9F9E9E40]" color="#9F9E9E40" />
							<div className="flex flex-row justify-end items-center gap-3 font-inter">
								<Button
									className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
									onClick={closeAddModal}>
									Cancel
								</Button>
								<Button
									className="bg-primary-1 text-white font-inter text-xs"
									onClick={addStaff}
									disabled={
										isAdding ||
										!newStaffData.name ||
										!newStaffData.email ||
										!newStaffData.role
									}>
									{isAdding ? "Adding Staff..." : "Add Staff"}
								</Button>
							</div>
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
}
