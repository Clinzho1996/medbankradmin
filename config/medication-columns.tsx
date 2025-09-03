"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MedicationDataTable } from "./medication-table";

// This type is used to define the shape of our data.
export type Medication = {
	id: string;
	name: string;
	dosage: string;
	frequency: string;
	status: string;
	date: string;
};

declare module "next-auth" {
	interface Session {
		accessToken?: string;
	}
}

const MedicationTable = () => {
	const { id } = useParams(); // user id from route params
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [tableData, setTableData] = useState<Medication[]>([]);

	const fetchMedications = async () => {
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
				`https://api.medbankr.ai/api/v1/administrator/user/${id}/medication`,
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.data.status) {
				const formattedData = response.data.data.map((med: any) => ({
					id: med._id,
					name: med.name,
					dosage: `${med.dosage.value}${med.dosage.unit}`,
					frequency: `${med.frequency} time(s)/day`,
					status: med.intake_map?.[0]?.status || "pending",
					date: `${new Date(med.start_date).toLocaleDateString()} - ${new Date(
						med.end_date
					).toLocaleDateString()}`,
				}));

				setTableData(formattedData);
			} else {
				toast.error("Failed to fetch medications");
			}
		} catch (error) {
			console.error("Error fetching medications:", error);
			toast.error("Error fetching medications");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (id) fetchMedications();
	}, [id]);

	const columns: ColumnDef<Medication>[] = [
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
						{id.length > 10 ? `${id.slice(0, 10)}...` : id}
					</span>
				);
			},
		},
		{
			accessorKey: "name",
			header: "Medication Name",
			cell: ({ row }) => {
				const name = row.getValue<string>("name");
				return <span className="text-xs text-primary-6">{name}</span>;
			},
		},
		{
			accessorKey: "dosage",
			header: "Dosage",
			cell: ({ row }) => {
				const dosage = row.getValue<string>("dosage");
				return <span className="text-xs text-primary-6">{dosage}</span>;
			},
		},
		{
			accessorKey: "frequency",
			header: "Frequency",
			cell: ({ row }) => {
				const frequency = row.getValue<string>("frequency");
				return <span className="text-xs text-primary-6">{frequency}</span>;
			},
		},
		{
			accessorKey: "status",
			header: ({ column }) => (
				<Button
					variant="ghost"
					className="text-[13px] text-start items-start"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Status
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const status = row.getValue<string>("status");
				return (
					<div className={`status ${status === "taken" ? "green" : "red"}`}>
						{status}
					</div>
				);
			},
		},
		{
			accessorKey: "date",
			header: "Start & End Date",
			cell: ({ row }) => {
				const date = row.getValue<string>("date");
				return <span className="text-xs text-primary-6">{date}</span>;
			},
		},
		{
			id: "actions",
			header: "Action",
			cell: ({ row }) => {
				const actions = row.original;
				return (
					<div className="flex flex-row justify-start items-center gap-3">
						<Link href={`/medication/${actions.id}`}>
							<Button className="border border-[#E8E8E8]">View Details</Button>
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
				<MedicationDataTable columns={columns} data={tableData} />
			)}
		</>
	);
};

export default MedicationTable;
