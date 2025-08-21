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
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";

interface TransactionTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

interface FolderData {
	name: string;
	image: File | null;
	imagePreview: string | null;
}

export function DocumentDataTables<TData, TValue>({
	columns,
	data,
}: TransactionTableProps<TData, TValue>) {
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

	// Folder creation state
	const [folderData, setFolderData] = useState<FolderData>({
		name: "",
		image: null,
		imagePreview: null,
	});
	const [uploadedFiles, setUploadedFiles] = useState<
		Array<{ name: string; size: string; preview: string }>
	>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const openModal = () => setModalOpen(true);
	const closeModal = () => {
		setModalOpen(false);
		// Reset form when closing modal
		setFolderData({
			name: "",
			image: null,
			imagePreview: null,
		});
		setUploadedFiles([]);
	};

	const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFolderData({ ...folderData, name: e.target.value });
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const newFiles = Array.from(files).map((file) => {
			const preview = URL.createObjectURL(file);
			return {
				name: file.name,
				size: `${(file.size / (1024 * 1024)).toFixed(1)}mb`,
				preview,
			};
		});

		setUploadedFiles([...uploadedFiles, ...newFiles]);
	};

	const removeFile = (index: number) => {
		const newFiles = [...uploadedFiles];
		URL.revokeObjectURL(newFiles[index].preview); // Clean up memory
		newFiles.splice(index, 1);
		setUploadedFiles(newFiles);
	};

	const handleCreateFolder = () => {
		// Implement folder creation logic here
		console.log("Creating folder:", folderData.name);
		console.log("Uploaded files:", uploadedFiles);

		// Reset form and close modal after creation
		closeModal();

		// You would typically send this data to your API here
	};

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

	const table = useReactTable({
		data,
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
					<div className="bg-[#F6F8FA] p-2 border rounded-lg">
						<div className="p-3">
							<p className="text-sm font-medium">Vault Folder Creation</p>
							<p className="text-xs text-[#6B7280] mt-1">
								Add basic information about the folder you are creating
							</p>
						</div>

						<div className="bg-white p-3 rounded-lg shadow-lg mt-3">
							{/* Folder name input */}
							<p className="text-sm font-normal text-[#6B7280]">Folder Name</p>
							<Input
								type="text"
								placeholder="Enter name of folder"
								className="border border-gray-300 p-2 rounded-lg w-full mt-2"
								value={folderData.name}
								onChange={handleFolderNameChange}
							/>

							{/* File upload area */}
							<div className="border bg-[#F6F8FA] p-1 mt-2 rounded-lg">
								<div className="border bg-white p-1 rounded-lg">
									<div
										className="border bg-white p-1 border-dashed rounded-lg flex flex-row justify-start items-center gap-2 cursor-pointer"
										onClick={() => fileInputRef.current?.click()}>
										<Image
											src="/images/Images.png"
											alt="Folder Icon"
											width={32}
											height={32}
										/>
										<div>
											<p className="text-sm font-normal text-secondary-1 ">
												Click to upload folder image
											</p>
											<p className="text-xs font-normal text-[#A3A3A3] ">
												JPEG, and PNG less than 10MB
											</p>
										</div>
										<input
											type="file"
											ref={fileInputRef}
											className="hidden"
											onChange={handleFileUpload}
											multiple
											accept=".jpeg,.jpg,.png"
										/>
									</div>
								</div>
							</div>

							{/* Uploaded files preview */}
							{uploadedFiles.length > 0 && (
								<>
									<hr className="my-4" />
									{uploadedFiles.map((file, index) => (
										<div
											key={index}
											className="border bg-[#F6F8FA] p-1 mt-2 rounded-lg relative">
											<div className="border bg-white p-1 rounded-lg">
												<div className="border bg-white p-1 border-dashed rounded-lg flex flex-row justify-start items-center gap-2">
													<Image
														src="/images/fold2.png"
														alt="Folder Icon"
														width={68}
														height={68}
													/>
													<div className="flex-1">
														<p className="text-sm font-normal text-black ">
															{file.name}
														</p>
														<p className="text-xs font-normal text-[#A3A3A3] ">
															{file.size}
														</p>
													</div>
													<button
														className="p-1 text-gray-500 hover:text-red-500"
														onClick={(e) => {
															e.stopPropagation();
															removeFile(index);
														}}>
														<X size={16} />
													</button>
												</div>
											</div>
										</div>
									))}
								</>
							)}
						</div>
					</div>

					<div className="flex flex-row justify-end items-center gap-3 mt-4">
						<Button className="border" onClick={closeModal}>
							Cancel
						</Button>
						<Button
							className="bg-secondary-1"
							onClick={handleCreateFolder}
							disabled={!folderData.name || uploadedFiles.length === 0}>
							Submit
						</Button>
					</div>
				</div>
			</Modal>
			{/* Rest of your component remains the same */}
			<div
				className="bg-white flex flex-col border-b-[0px] border-[#E2E4E9] justify-start items-start rounded-lg"
				style={{
					borderTopLeftRadius: "0.5rem",
					borderTopRightRadius: "0.5rem",
				}}>
				<div className="p-3 flex flex-row justify-between border-b-[1px] border-[#E2E4E9] bg-white items-center gap-20 w-full rounded-lg">
					<div className="flex flex-row justify-start bg-white items-center rounded-lg mx-auto  w-full pr-2">
						{["All", "Active", "Inactive"].map((status, index, arr) => (
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
