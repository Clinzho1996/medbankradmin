"use client";

import { ColumnDef } from "@tanstack/react-table";

import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { StaffDataTable } from "./staff-table";

// This type is used to define the shape of our data.
export type Staff = {
	id: string;
	name?: string;
	date: string;
	role: string;
	pic?: string | null;
	staff: string;
	status?: string;
	email: string;
};

declare module "next-auth" {
	interface Session {
		accessToken?: string;
	}
}

const StaffTable = () => {
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [tableData, setTableData] = useState<Staff[]>([]);

	const [pagination, setPagination] = useState({
		page: 1,
		limit: 50, // Increased limit to get more records
		total: 0,
		pages: 1,
	});

	const openDeleteModal = (row: any) => {
		setSelectedRow(row.original);
		setDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setDeleteModalOpen(false);
	};

	const fetchStaffs = async (page = 1, limit = 50) => {
		try {
			setIsLoading(true);
			const session = await getSession();

			const accessToken = session?.accessToken;
			if (!accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}

			const response = await axios.get(
				`https://api.medbankr.ai/api/v1/administrator/staff?page=${page}&limit=${limit}`,
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.data.status === true) {
				// Map the API response to match the `EndUser` type
				const formattedData = response.data.data.map((user: any) => ({
					id: user._id,
					public_id: user.public_id,
					pic: user.profile_pic,
					full_name: user.full_name,
					email: user.email,
					status: user.status,
					last_login: user.last_login,
					gender: user.gender,
					created_at: user.createdAt,
					verified: user.verified,
					role: user.role,
				}));

				setTableData(formattedData);

				// Update pagination info
				if (response.data.pagination) {
					setPagination(response.data.pagination);
				}

				console.log("Staffs Data:", formattedData);
				console.log("Pagination:", response.data.pagination);
			}
		} catch (error) {
			console.error("Error fetching user data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchStaffs(1, 50); // Fetch first page with higher limit
	}, []);

	const deleteStaff = async (id: string) => {
		try {
			const session = await getSession();
			const accessToken = session?.accessToken;

			if (!accessToken) {
				console.error("No access token found.");
				return;
			}

			const response = await axios.delete(
				`https://api.medbankr.ai/api/v1/administrator/staff`,
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					data: { id }, // 👈 send id in body instead of URL
				}
			);

			if (response.status === 200) {
				// Remove the deleted user from the table
				setTableData((prevData) => prevData.filter((user) => user.id !== id));
				toast.success("User deleted successfully.");
			}
		} catch (error) {
			console.error("Error deleting user:", error);
			toast.error("Failed to delete user. Please try again.");
		}
	};

	const formatDate = (rawDate: string | Date | null) => {
		if (!rawDate) return "N/A";

		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		const parsedDate =
			typeof rawDate === "string" ? new Date(rawDate) : rawDate;
		return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
	};

	const columns: ColumnDef<Staff>[] = [
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
			header: "User ID",
			cell: ({ row }) => {
				const staff = row.getValue<string>("id");

				return (
					<span className="text-xs text-primary-6">
						{staff.length > 10 ? `${staff.slice(0, 10)}...` : staff}
					</span>
				);
			},
		},
		{
			accessorKey: "full_name",
			header: "Full Name",
			cell: ({ row }) => {
				const name = row.getValue<string | null>("full_name") || "N/A";
				const pic = row.original.pic;
				return (
					<div className="flex flex-row justify-start items-center gap-2">
						<Image
							src={pic || "/images/avatar.png"}
							alt={name}
							width={30}
							height={30}
							className="w-8 h-8 rounded-full"
						/>
						<span className="text-xs text-primary-6 capitalize">{name}</span>
					</div>
				);
			},
		},
		{
			accessorKey: "email",
			header: "Email",
			cell: ({ row }) => {
				const email = row.getValue<string>("email");

				return <span className="text-xs text-primary-6">{email}</span>;
			},
		},

		{
			accessorKey: "role",
			header: "Role",
			cell: ({ row }) => {
				const role = row.getValue<string>("role");

				// if role is null, empty, or "*", default to "Super Admin"
				const displayRole = !role || role === "*" ? "Super Admin" : role;

				return (
					<span className="text-xs text-primary-6 capitalize">
						{displayRole}
					</span>
				);
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				let status = row.getValue<string | null>("status");

				// fallback: if status is null, show "inactive"
				status = status ?? "inactive";

				return (
					<div className={`status ${status === "active" ? "green" : "red"}`}>
						{status}
					</div>
				);
			},
		},

		{
			accessorKey: "created_at",
			header: "Created At",
			cell: ({ row }) => {
				const date = row.getValue<string>("created_at");

				return (
					<span className="text-xs text-primary-6">{formatDate(date)}</span>
				);
			},
		},
		{
			id: "actions",
			header: "Action",
			cell: ({ row }) => {
				const actions = row.original;

				return (
					<div className="flex flex-row justify-start items-center gap-3">
						<Link href={`/staff-management/${actions.id}`}>
							<Button className="border border-[#E8E8E8]">View Details</Button>
						</Link>

						<Button
							className="border border-[#E8E8E8]"
							onClick={() => openDeleteModal(row)}>
							<IconTrash color="#6B7280" />
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
				<StaffDataTable columns={columns} data={tableData} />
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
							onClick={async () => {
								await deleteStaff(selectedRow.id);
								closeDeleteModal();
							}}>
							Yes, Confirm
						</Button>
					</div>
				</Modal>
			)}
		</>
	);
};

export default StaffTable;
