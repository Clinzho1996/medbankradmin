"use client";

import HeaderBox from "@/components/HeaderBox";
import StatCard from "@/components/StatCard";
import DocumentTable from "@/config/document-columns";
import axios from "axios";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface OverviewData {
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
}

interface Folder {
	_id: string;
	access: string;
	folder_description: string;
	user_id: string;
	created_by: string;
	name: string;
	lock: boolean;
	child: any[];
	parent: string | null;
	createdAt: string;
	updatedAt: string;
	__v: number;
	current_size: number;
	total_file: number;
}
interface ApiResponse {
	status: boolean;
	message: string;
	data: {
		overview: OverviewData;
		folder: Folder[];
		pagination: {
			total: number;
			page: number;
			limit: number;
			pages: number;
		};
	};
	error: string;
}

function DocumentVault() {
	const [overview, setOverview] = useState<OverviewData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch vault data
	const fetchVaultData = async () => {
		try {
			setIsLoading(true);
			const session = await getSession();
			const accessToken = session?.accessToken;

			if (!accessToken) {
				toast.error("No access token found. Please log in again.");
				setIsLoading(false);
				return;
			}

			const response = await axios.get<ApiResponse>(
				"https://api.medbankr.ai/api/v1/administrator/vault",
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.data.status === true) {
				setOverview(response.data.data.overview);
			}
		} catch (error) {
			console.error("Error fetching user data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchVaultData();
	}, []);

	const formatDate = (dateString: string | null): string => {
		if (!dateString) return "Never";

		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (isLoading) {
		return (
			<div className="w-full overflow-x-hidden">
				<HeaderBox title="Document & Vault Management" />
				<p className="text-sm text-[#6C7278] font-normal mb-4 p-3 bg-[#F4F6F8] border-b border-[#6C72781A]">
					Administrative oversight of user health vaults, document storage,
					processing workflows, and data integrity management.
				</p>
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-1"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full overflow-x-hidden">
			<HeaderBox title="Document & Vault Management" />
			<p className="text-sm text-[#6C7278] font-normal mb-4 p-3 bg-[#F4F6F8] border-b border-[#6C72781A]">
				Administrative oversight of user health vaults, document storage,
				processing workflows, and data integrity management.
			</p>

			{overview && (
				<div className="flex flex-col sm:flex-row justify-between items-start px-4 py-2 gap-2 w-full max-w-[100vw]">
					<div className="border-[1px] border-[#E2E4E9] rounded-lg w-full bg-white overflow-hidden p-3 flex flex-col gap-3">
						<div className="flex flex-row justify-start gap-2 items-center">
							<Image src="/images/info.png" alt="info" width={20} height={20} />
							<p className="text-sm font-medium text-black">Storage Metrics</p>
						</div>

						<div className="flex flex-row  justify-start items-center w-full gap-3">
							<StatCard
								title="Total Storage Used"
								value={Number(overview.total_storage).toFixed(4)}
								unit="MB"
								percentage={`${Math.round(
									(overview.total_storage / 100) * 100
								)}%`}
								positive={overview.total_storage > 0}
							/>

							<StatCard
								title="Documents Stored"
								value={overview.total_file}
								unit="files"
								percentage={`${Math.round((overview.total_file / 100) * 100)}%`}
								positive={overview.total_file > 0}
							/>

							<StatCard
								title="Average Document Size"
								value={Number(overview.avg_file_size).toFixed(4)}
								unit="MB"
								percentage={`${Math.round(
									(overview.avg_file_size / 10) * 100
								)}%`}
								positive={overview.avg_file_size > 0}
							/>

							<StatCard
								title="Storage Growth Rate"
								value={overview.storage_growth.percentChange}
								unit="%"
								percentage={`${Math.abs(
									overview.storage_growth.percentChange
								)}%`}
								positive={overview.storage_growth.percentChange >= 0}
							/>
						</div>

						<div className="flex flex-row justify-start items-center w-full gap-3">
							<StatCard
								title="Files This Week"
								value={overview.storage_growth.filesThisWeek}
								unit="files"
								percentage={`${Math.round(
									(overview.storage_growth.filesThisWeek /
										(overview.storage_growth.filesThisWeek +
											overview.storage_growth.filesLastWeek || 1)) *
										100
								)}%`}
								positive={overview.storage_growth.filesThisWeek > 0}
							/>

							<StatCard
								title="Files Last Week"
								value={overview.storage_growth.filesLastWeek}
								unit="files"
								percentage={`${Math.round(
									(overview.storage_growth.filesLastWeek /
										(overview.storage_growth.filesThisWeek +
											overview.storage_growth.filesLastWeek || 1)) *
										100
								)}%`}
								positive={overview.storage_growth.filesLastWeek > 0}
							/>

							<StatCard
								title="Backup Status"
								value={overview.backup_status}
								unit=""
								percentage={
									overview.backup_status === "NEVER" ? "Never" : "Active"
								}
								positive={overview.backup_status !== "NEVER"}
							/>

							<StatCard
								title="Last Backup Time"
								value={
									overview.last_backup_date
										? formatDate(overview.last_backup_date)
										: "Never"
								}
								unit=""
								percentage={overview.last_backup_date ? "Completed" : "Pending"}
								positive={!!overview.last_backup_date}
							/>
						</div>
					</div>
				</div>
			)}

			<div className="bg-white flex flex-col px-4 py-2 gap-2 w-full max-w-[100vw]">
				<DocumentTable />
			</div>
		</div>
	);
}

export default DocumentVault;
