"use client";

import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { HospitalWaitlistDataTable } from "./hospital-data-table";

// Define the expected API response type
interface ApiResponse {
	data: {
		pagination: {
			total: number;
			page: number;
			limit: number;
			pages: number;
		};
		users: HospitalWaitlistUser[];
	};
}

export interface HospitalWaitlistUser {
	_id: string;
	type: string;
	full_name: string;
	designation: string;
	phone: string;
	email: string;
	hospital_name: string;
	hospital_address: string;
	specialization: string;
	mark_handled: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

declare module "next-auth" {
	interface Session {
		accessToken?: string;
	}
}

const HospitalWaitlistTable = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isRestoreModalOpen, setRestoreModalOpen] = useState(false);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<HospitalWaitlistUser | null>(
		null
	);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [tableData, setTableData] = useState<HospitalWaitlistUser[]>([]);

	// Open modal functions
	const openRestoreModal = (row: { original: HospitalWaitlistUser }) => {
		setSelectedRow(row.original);
		setRestoreModalOpen(true);
	};

	const openDeleteModal = (row: { original: HospitalWaitlistUser }) => {
		setSelectedRow(row.original);
		setDeleteModalOpen(true);
	};

	// Close modal functions
	const closeRestoreModal = () => setRestoreModalOpen(false);
	const closeDeleteModal = () => setDeleteModalOpen(false);

	const fetchUserData = async () => {
		try {
			setIsLoading(true);
			const session = await getSession();

			if (!session?.accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}

			const response = await axios.get<ApiResponse>(
				"https://api.medbankr.ai/api/v1/administrator/waitlist/hospital",
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${session?.accessToken}`,
					},
				}
			);

			const fetchedData = response.data.data.users;

			// Map the data to match the expected structure
			const mappedData = fetchedData.map((item) => ({
				_id: item._id,
				type: item.type,
				full_name: item.full_name,
				designation: item.designation,
				phone: item.phone,
				email: item.email,
				hospital_name: item.hospital_name,
				hospital_address: item.hospital_address,
				specialization: item.specialization,
				mark_handled: item.mark_handled,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
				__v: item.__v,
			}));

			setTableData(mappedData);
		} catch (error) {
			console.error("Error fetching hospital waitlist data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUserData();
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

	// Define table columns
	const columns: ColumnDef<HospitalWaitlistUser>[] = [
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
				const id = row.getValue<string>("_id");
				return (
					<span className="text-xs text-primary-6">
						{id.length > 10 ? `${id.slice(0, 10)}...` : id}
					</span>
				);
			},
		},
		{
			accessorKey: "full_name",
			header: ({ column }) => (
				<Button
					variant="ghost"
					className="text-[13px] text-left"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const name = row.getValue<string>("full_name");
				return (
					<span className="name text-xs text-black capitalize">{name}</span>
				);
			},
		},
		{
			accessorKey: "email",
			header: ({ column }) => (
				<Button
					variant="ghost"
					className="text-[13px] text-left"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Email address
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const email = row.getValue<string>("email");
				return <span className="text-xs text-primary-6">{email}</span>;
			},
		},
		{
			accessorKey: "phone",
			header: ({ column }) => (
				<Button
					variant="ghost"
					className="text-[13px] text-left"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Phone Number
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const phone = row.getValue<string>("phone");
				return <span className="text-xs text-primary-6">{phone}</span>;
			},
		},
		{
			accessorKey: "hospital_name",
			header: ({ column }) => (
				<Button
					variant="ghost"
					className="text-[13px] text-left"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Hospital Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const hospitalName = row.getValue<string>("hospital_name");
				return <span className="text-xs text-primary-6">{hospitalName}</span>;
			},
		},
		{
			accessorKey: "specialization",
			header: ({ column }) => (
				<Button
					variant="ghost"
					className="text-[13px] text-left"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Specialization
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const specialization = row.getValue<string>("specialization");
				return <span className="text-xs text-primary-6">{specialization}</span>;
			},
		},
		{
			accessorKey: "designation",
			header: ({ column }) => (
				<Button
					variant="ghost"
					className="text-[13px] text-left"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Designation
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const designation = row.getValue<string>("designation");
				return <span className="text-xs text-primary-6">{designation}</span>;
			},
		},
		{
			accessorKey: "createdAt",
			header: "Date Joined",
			cell: ({ row }) => {
				const date = row.getValue<string>("createdAt");
				return (
					<span className="text-xs text-primary-6">{formatDate(date)}</span>
				);
			},
		},
	];

	const handleDelete = () => {
		const selectedRowIds = Object.keys(rowSelection).filter(
			(key) => rowSelection[key]
		);

		// Filter out selected rows using _id instead of id
		const filteredData = tableData.filter(
			(row) => !selectedRowIds.includes(row._id)
		);
		setTableData(filteredData);
		setRowSelection({}); // Clear row selection after deletion
		closeDeleteModal();
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<HospitalWaitlistDataTable columns={columns} data={tableData} />
			)}

			{isRestoreModalOpen && (
				<Modal onClose={closeRestoreModal} isOpen={isRestoreModalOpen}>
					<p className="mt-4">
						Are you sure you want to suspend {selectedRow?.full_name}'s account?
					</p>
					<p className="text-sm text-primary-6">This can't be undone</p>
					<div className="flex flex-row justify-end items-center gap-3 font-inter mt-4">
						<Button
							className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
							onClick={closeRestoreModal}>
							Cancel
						</Button>
						<Button className="bg-[#F04F4A] text-white font-inter text-xs modal-delete">
							Yes, Confirm
						</Button>
					</div>
				</Modal>
			)}

			{isDeleteModalOpen && (
				<Modal onClose={closeDeleteModal} isOpen={isDeleteModalOpen}>
					<p>
						Are you sure you want to delete {selectedRow?.full_name}'s account?
					</p>
					<p className="text-sm text-primary-6">This can't be undone</p>
					<div className="flex flex-row justify-end items-center gap-3 font-inter mt-4">
						<Button
							className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
							onClick={closeDeleteModal}>
							Cancel
						</Button>
						<Button
							className="bg-[#F04F4A] text-white font-inter text-xs modal-delete"
							onClick={handleDelete}>
							Yes, Delete
						</Button>
					</div>
				</Modal>
			)}
		</>
	);
};

export default HospitalWaitlistTable;
