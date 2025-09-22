"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LabDataTable } from "./lab-table";

export type Hospital = {
	id: string;
	name?: string;
	date: string;
	specialization: string;
	status?: string;
	email: string;
	provider_type: string;
};

interface ApiResponse {
	_id: string;
	name: string;
	provider_type: string;
	provider_specialization: string;
	emails: string[]; // This is an array of JSON strings
	status: string;
	createdAt: string;
	updatedAt: string;
	phone?: string[]; // Array of JSON strings
	address?: Array<{
		street: string;
		city: string;
		state: string;
		country: string;
		_id: string;
	}>;
	consultation_fee?: number;
	coverage?: Array<{
		name: string;
		fee: number;
		_id: string;
	}>;
	services?: string[]; // Array of JSON strings
}

declare module "next-auth" {
	interface Session {
		accessToken?: string;
	}
}

const LabTable = () => {
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [tableData, setTableData] = useState<Hospital[]>([]);
	const [isEditModalOpen, setEditModalOpen] = useState(false);
	const [editData, setEditData] = useState({
		id: "",
		name: "",
		email: "",
		specialization: "",
		provider_type: "laboratory",
	});

	// Helper function to parse JSON strings from arrays
	const parseJsonArray = (array: string[]): string[] => {
		if (!array || !Array.isArray(array)) return [];

		return array.flatMap((item) => {
			try {
				// Try to parse the JSON string
				const parsed = JSON.parse(item);
				// If it's an array, return its items, otherwise wrap it in an array
				return Array.isArray(parsed) ? parsed : [parsed];
			} catch (error) {
				// If parsing fails, return the original item as a string
				return [item];
			}
		});
	};

	const openEditModal = (row: any) => {
		const hospital = row.original;

		// Parse the email from the emails array
		const emails = parseJsonArray(hospital.rawEmails || []);
		const primaryEmail = emails[0] || "";

		setEditData({
			id: hospital.id,
			name: hospital.name || "",
			email: primaryEmail,
			specialization: hospital.specialization,
			provider_type: hospital.provider_type,
		});
		setEditModalOpen(true);
	};

	const closeEditModal = () => {
		setEditModalOpen(false);
	};

	const handleEditHospital = async () => {
		try {
			setIsLoading(true);
			const session = await getSession();
			const accessToken = session?.accessToken;

			if (!accessToken) {
				console.error("No access token found.");
				return;
			}

			const response = await axios.put(
				`https://api.medbankr.ai/api/v1/administrator/provider/${editData.id}`,
				{
					name: editData.name,
					provider_specialization: editData.specialization,
					emails: [editData.email], // Send as array
					provider_type: editData.provider_type,
				},
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.data.status === "true") {
				toast.success("Laboratory updated successfully.");
				fetchHospitals(); // Refresh the table data
				closeEditModal();
			}
		} catch (error) {
			console.error("Error updating laboratory:", error);
			toast.error("Failed to update laboratory. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const openDeleteModal = (row: any) => {
		setSelectedRow(row.original);
		setDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setDeleteModalOpen(false);
	};

	const fetchHospitals = async () => {
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
				"https://api.medbankr.ai/api/v1/administrator/provider?provider_type=laboratory",
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			// CORRECTED LOGIC: Check the top-level status property
			if (response.data.status === true) {
				// Map the API response to match the `Hospital` type
				const formattedData = response.data.data.map((lab: ApiResponse) => {
					const emails = parseJsonArray(lab.emails || []);
					const primaryEmail = emails[0] || "No email";

					return {
						id: lab._id,
						name: lab.name,
						date: lab.createdAt,
						specialization: lab.provider_specialization,
						status: lab.status,
						email: primaryEmail,
						provider_type: lab.provider_type,
						rawEmails: lab.emails,
						phone: lab.phone ? parseJsonArray(lab.phone) : [],
						address: lab.address || [],
						consultation_fee: lab.consultation_fee,
						coverage: lab.coverage || [],
						services: lab.services ? parseJsonArray(lab.services) : [],
					};
				});

				setTableData(formattedData);
				console.log("Laboratory Data:", formattedData); // This will now log
			}
		} catch (error) {
			console.error("Error fetching laboratory data:", error);
			toast.error("Failed to fetch laboratories. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchHospitals();
	}, []);

	const deleteHospital = async (id: string) => {
		try {
			const session = await getSession();
			const accessToken = session?.accessToken;

			if (!accessToken) {
				console.error("No access token found.");
				return;
			}

			const response = await axios.delete(
				`https://api.medbankr.ai/api/v1/administrator/provider/${id}`,
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.data.status === "true") {
				// Remove the deleted laboratory from the table
				setTableData((prevData) => prevData.filter((lab) => lab.id !== id));
				toast.success("Laboratory deleted successfully.");
			}
		} catch (error) {
			console.error("Error deleting laboratory:", error);
			toast.error("Failed to delete laboratory. Please try again.");
		}
	};

	const formatDate = (rawDate: string | Date) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		const parsedDate =
			typeof rawDate === "string" ? new Date(rawDate) : rawDate;
		return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
	};

	const columns: ColumnDef<Hospital>[] = [
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
				const lab = row.getValue<string>("id");

				return (
					<span className="text-xs text-primary-6">
						{lab.length > 10 ? `${lab.slice(0, 10)}...` : lab}
					</span>
				);
			},
		},
		{
			accessorKey: "name",
			header: "Laboratory Name",
			cell: ({ row }) => {
				const name = row.getValue<string>("name") || "Unnamed Laboratory";
				return <span className="text-xs text-primary-6">{name}</span>;
			},
		},
		{
			accessorKey: "specialization",
			header: "Specialization",
			cell: ({ row }) => {
				const specialization =
					row.getValue<string>("specialization") || "Not specified";
				return <span className="text-xs text-primary-6">{specialization}</span>;
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
					<div className={`status ${status === "active" ? "green" : "red"}`}>
						{status || "pending"}
					</div>
				);
			},
		},
		{
			accessorKey: "date",
			header: "Sign up Date",
			cell: ({ row }) => {
				const date = formatDate(row.getValue<string>("date")) || "N/A";
				return <span className="text-xs text-primary-6">{date}</span>;
			},
		},
		{
			id: "actions",
			header: "Action",
			cell: ({ row }) => {
				const lab = row.original;

				return (
					<div className="flex flex-row justify-start items-center gap-3">
						<Link href={`/health-care-providers/lab/${lab.id}`}>
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
				<LabDataTable columns={columns} data={tableData} />
			)}
			{isEditModalOpen && (
				<Modal
					isOpen={isEditModalOpen}
					onClose={closeEditModal}
					title="Edit Laboratory">
					<div className="bg-white p-0 rounded-lg transition-transform ease-in-out form">
						<div className="mt-3 pt-2">
							<div className="flex flex-col gap-2">
								<p className="text-xs text-primary-6">Laboratory Name</p>
								<Input
									type="text"
									placeholder="Enter Laboratory Name"
									className="focus:border-none mt-2"
									value={editData.name}
									onChange={(e) =>
										setEditData({ ...editData, name: e.target.value })
									}
								/>
								<p className="text-xs text-primary-6 mt-2">Email Address</p>
								<Input
									type="email"
									placeholder="Enter Email Address"
									className="focus:border-none mt-2"
									value={editData.email}
									onChange={(e) =>
										setEditData({ ...editData, email: e.target.value })
									}
								/>
								<p className="text-xs text-primary-6 mt-2">Specialization</p>
								<Input
									type="text"
									placeholder="Enter Specialization"
									className="focus:border-none mt-2"
									value={editData.specialization}
									onChange={(e) =>
										setEditData({ ...editData, specialization: e.target.value })
									}
								/>
								<p className="text-xs text-primary-6 mt-2">Provider Type</p>
								<Select
									value={editData.provider_type}
									onValueChange={(value) =>
										setEditData({ ...editData, provider_type: value })
									}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select Provider Type" />
									</SelectTrigger>
									<SelectContent className="bg-white z-10 select text-gray-300">
										<SelectItem value="hospital">Hospital</SelectItem>
										<SelectItem value="clinic">Clinic</SelectItem>
										<SelectItem value="laboratory">Laboratory</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<hr className="mt-4 mb-4 text-[#9F9E9E40]" color="#9F9E9E40" />
							<div className="flex flex-row justify-end items-center gap-3 font-inter">
								<Button
									className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
									onClick={closeEditModal}>
									Cancel
								</Button>
								<Button
									className="bg-primary-1 text-white font-inter text-xs"
									onClick={handleEditHospital}
									disabled={isLoading}>
									{isLoading ? "Updating Laboratory..." : "Update Laboratory"}
								</Button>
							</div>
						</div>
					</div>
				</Modal>
			)}

			{isDeleteModalOpen && (
				<Modal onClose={closeDeleteModal} isOpen={isDeleteModalOpen}>
					<p>
						Are you sure you want to delete {selectedRow?.name}'s laboratory?
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
								await deleteHospital(selectedRow.id);
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

export default LabTable;
