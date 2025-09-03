"use client";

import Activity from "@/components/end-user/Activity";
import HealthVault from "@/components/end-user/HealthVault";
import Medication from "@/components/end-user/Medication";
import Profile from "@/components/end-user/Profile";
import HeaderBox from "@/components/HeaderBox";
import Loader from "@/components/Loader";
import StatCard from "@/components/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconArrowBack, IconCaretRightFilled } from "@tabler/icons-react";
import axios from "axios";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export type UserStats = {
	logins: {
		total: number;
		percentChange: number;
	};
	files: {
		total: number;
		percentChange: number;
	};
	medications: {
		total: number;
		percentChange: number;
	};
	chats: {
		total: number | null;
		percentChange: number;
	};
	user: {
		first_name?: string;
		last_name?: string;
		full_name?: string;
	};
};

function EndUserDetails() {
	const { id } = useParams();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [stats, setStats] = useState<UserStats | null>(null);

	const fetchUserDetails = useCallback(async () => {
		setIsLoading(true);
		try {
			const session = await getSession();

			if (!session?.accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}

			const accessToken = session?.accessToken;

			const response = await axios.get(
				`https://api.medbankr.ai/api/v1/administrator/user/${id}`,
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.data.status) {
				const data = response.data.data;
				setStats({
					logins: {
						total: data.logins.total,
						percentChange: data.logins.percentChange,
					},
					files: {
						total: data.files.total,
						percentChange: data.files.percentChange,
					},
					medications: {
						total: data.medications.total,
						percentChange: data.medications.percentChange,
					},
					chats: {
						total: data.chats.total,
						percentChange: data.chats.percentChange,
					},
					user: {
						first_name: data.user.data.user.full_name?.split(" ")[0] || "",
						last_name: data.user.data.user.full_name?.split(" ")[1] || "",
						full_name: data.user.data.user.full_name,
					},
				});
			}
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.log(
					"Error fetching user details:",
					error.response?.data || error.message
				);
			} else {
				console.log("Unexpected error:", error);
			}
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchUserDetails();
	}, [fetchUserDetails]);

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div>
			<HeaderBox title="User Management" />
			<div className="flex flex-row justify-start items-center gap-2 mb-4 p-3 bg-[#F4F6F8] border-b border-[#6C72781A] m-0">
				<Link
					href="/end-user"
					className="flex flex-row text-[#6B7280] justify-start text-sm items-center gap-2">
					<IconArrowBack /> Back to previous page
				</Link>
				<IconCaretRightFilled size={18} />
				<p className="text-sm text-[#161616] font-normal ">
					Detailed profile view for {stats?.user.full_name}
				</p>
			</div>
			<div className="flex flex-col sm:flex-row justify-between items-start px-4 py-2 gap-2 w-full max-w-[100vw]">
				<div className="border-[1px] border-[#E2E4E9] rounded-lg w-full bg-white overflow-hidden p-3 flex flex-col gap-3">
					<div className="flex flex-row justify-start gap-2 items-center">
						<Image src="/images/info.png" alt="info" width={20} height={20} />
						<p className="text-sm font-medium text-black">Account Metrics</p>
					</div>

					<div className="flex flex-row justify-start items-center w-full gap-3">
						<StatCard
							title="Total Login"
							value={stats?.logins.total ?? 0}
							percentage={`${stats?.logins.percentChange ?? 0}%`}
							positive={(stats?.logins.percentChange ?? 0) >= 0}
						/>

						<StatCard
							title="Document Uploaded"
							value={stats?.files.total ?? 0}
							percentage={`${stats?.files.percentChange ?? 0}%`}
							positive={(stats?.files.percentChange ?? 0) >= 0}
						/>

						<StatCard
							title="Symptoms Check Completed"
							value={stats?.chats.total ?? 0}
							percentage={`${stats?.chats.percentChange ?? 0}%`}
							positive={(stats?.chats.percentChange ?? 0) >= 0}
						/>

						<StatCard
							title="Medication Tracked"
							value={stats?.medications.total ?? 0}
							percentage={`${stats?.medications.percentChange ?? 0}%`}
							positive={(stats?.medications.percentChange ?? 0) >= 0}
						/>
					</div>
				</div>
			</div>

			<div className="border-[1px] border-[#E2E4E9] px-4 py-2 mx-auto rounded-lg w-full sm:w-[97.5%] bg-white overflow-hidden p-3 flex flex-col gap-3">
				<Tabs defaultValue="profile" className="w-full">
					<TabsList>
						<TabsTrigger
							value="profile"
							className="data-[state=active]:border-b-2 data-[state=active]:text-dark-1 text-[#6C7278] data-[state=active]:border-[#2FE0A8] data-[state=active]:shadow-none data-[state=active]:rounded-none">
							Profile Information
						</TabsTrigger>
						<TabsTrigger
							value="personal_health_vault"
							className="data-[state=active]:border-b-2 data-[state=active]:text-dark-1 text-[#6C7278] data-[state=active]:border-[#2FE0A8] data-[state=active]:shadow-none data-[state=active]:rounded-none">
							Personal Health Vault
						</TabsTrigger>
						<TabsTrigger
							value="medications_history"
							className="data-[state=active]:border-b-2 data-[state=active]:text-dark-1 text-[#6C7278] data-[state=active]:border-[#2FE0A8] data-[state=active]:shadow-none data-[state=active]:rounded-none">
							Medications History
						</TabsTrigger>
						<TabsTrigger
							value="user_activity_history"
							className="data-[state=active]:border-b-2 data-[state=active]:text-dark-1 text-[#6C7278] data-[state=active]:border-[#2FE0A8] data-[state=active]:shadow-none data-[state=active]:rounded-none">
							User Activity History
						</TabsTrigger>
					</TabsList>
					<TabsContent value="profile">
						<Profile />
					</TabsContent>
					<TabsContent value="personal_health_vault">
						<HealthVault />
					</TabsContent>
					<TabsContent value="medications_history">
						<Medication />
					</TabsContent>
					<TabsContent value="user_activity_history">
						<Activity />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

export default EndUserDetails;
