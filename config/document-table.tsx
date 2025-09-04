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
import { IconPlus } from "@tabler/icons-react";
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

interface DocumentDataTablesProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

interface FolderData {
	name: string;
	folder_description: string;
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
		folder: any[];
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

export function DocumentDataTables<TData, TValue>({
	columns,
	data,
}: DocumentDataTablesProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [selectedStatus, setSelectedStatus] = useState<string>("View All");
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [globalFilter, setGlobalFilter] = useState("");
	const [isModalOpen, setModalOpen] = useState(false);
	const [tableData, setTableData] = useState(data);
	const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
	const [isCreating, setIsCreating] = useState(false);

	// Folder creation state
	const [folderData, setFolderData] = useState<FolderData>({
		name: "",
		folder_description: "",
	});

	const openModal = () => setModalOpen(true);
	const closeModal = () => {
		setModalOpen(false);
		// Reset form when closing modal
		setFolderData({
			name: "",
			folder_description: "",
		});
	};

	const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFolderData({ ...folderData, name: e.target.value });
	};

	const handleFolderDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setFolderData({ ...folderData, folder_description: e.target.value });
	};

	const handleCreateFolder = async () => {
		try {
			setIsCreating(true);
			const session = await getSession();
			const accessToken = session?.accessToken;

			if (!accessToken) {
				toast.error("No access token found. Please log in again.");
				return;
			}

			// Prepare payload according to API requirements
			const payload = {
				name: folderData.name,
				description: folderData.folder_description,
			};

			const response = await axios.post(
				"https://api.medbankr.ai/api/v1/administrator/vault",
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
				toast.success("Folder created successfully!");

				// Add the new folder to the table
				const newFolder = response.data.data;
				setTableData((prevData) => [newFolder as TData, ...prevData]);

				closeModal();
			}
		} catch (error: any) {
			console.error("Error creating folder:", error);
			const errorMessage =
				error.response?.data?.message ||
				"Failed to create folder. Please try again.";
			toast.error(errorMessage);
		} finally {
			setIsCreating(false);
		}
	};

	const filterDataByDateRange = () => {
		if (!dateRange?.from || !dateRange?.to) {
			setTableData(data); // Reset to all data
			return;
		}

		const filteredData = data.filter((folder: any) => {
			const dateCreated = new Date(folder.createdAt);
			return dateCreated >= dateRange.from! && dateCreated <= dateRange.to!;
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
				(folder) =>
					(folder as any)?.access?.toLowerCase() === status.toLowerCase()
			);

			setTableData(filteredData as TData[]);
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
			<Modal isOpen={isModalOpen} onClose={closeModal} title="Create Folder">
				<div className="w-[96%] sm:w-[500px] mx-auto">
					<div className="bg-[#F6F8FA] p-4 border rounded-lg">
						<div className="mb-4">
							<p className="text-sm font-medium">Vault Folder Creation</p>
							<p className="text-xs text-[#6B7280] mt-1">
								Add basic information about the folder you are creating
							</p>
						</div>

						<div className="bg-white p-4 rounded-lg shadow-lg">
							{/* Folder name input */}
							<div className="mb-4">
								<label className="block text-sm font-normal text-[#6B7280] mb-2">
									Folder Name
								</label>
								<Input
									type="text"
									placeholder="Enter name of folder"
									className="border border-gray-300 p-2 rounded-lg w-full"
									value={folderData.name}
									onChange={handleFolderNameChange}
								/>
							</div>

							{/* Folder description input */}
							<div className="mb-4">
								<label className="block text-sm font-normal text-[#6B7280] mb-2">
									Description
								</label>
								<textarea
									placeholder="Enter folder description"
									className="border border-gray-300 p-2 rounded-lg w-full h-24 resize-none"
									value={folderData.folder_description}
									onChange={handleFolderDescriptionChange}
								/>
							</div>
						</div>
					</div>

					<div className="flex flex-row justify-end items-center gap-3 mt-4">
						<Button
							className="border-[#E8E8E8] border-[1px] text-primary-6"
							onClick={closeModal}>
							Cancel
						</Button>
						<Button
							className="bg-secondary-1 text-dark-1"
							onClick={handleCreateFolder}
							disabled={
								isCreating || !folderData.name || !folderData.folder_description
							}>
							{isCreating ? "Creating..." : "Create Folder"}
						</Button>
					</div>
				</div>
			</Modal>

			<div
				className="bg-white flex flex-col border-b-[0px] border-[#E2E4E9] justify-start items-start rounded-lg"
				style={{
					borderTopLeftRadius: "0.5rem",
					borderTopRightRadius: "0.5rem",
				}}>
				<div className="p-3 flex flex-row justify-between border-b-[1px] border-[#E2E4E9] bg-white items-center gap-20 w-full rounded-lg">
					<div className="flex flex-row justify-start bg-white items-center rounded-lg mx-auto  w-full pr-2">
						{["View All", "Private", "Public"].map((status, index, arr) => (
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
					<div className="p-3 flex flex-row justify-end items-center gap-3 w-full ">
						<div className="w-[250px]">
							<DateRangePicker dateRange={dateRange} onSelect={setDateRange} />
						</div>
						<Button
							className="bg-secondary-1 border-[1px] border-[#173C3D] text-primary-1 font-inter cborder"
							onClick={openModal}>
							<IconPlus /> Create Folder
						</Button>
					</div>
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
