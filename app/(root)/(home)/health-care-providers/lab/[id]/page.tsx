"use client";

import HeaderBox from "@/components/HeaderBox";
import Loader from "@/components/Loader";
import BookingAnalytics from "@/components/provider/BookingAnalytics";
import Profile from "@/components/provider/Profile";
import StatCard from "@/components/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconArrowBack, IconCaretRightFilled } from "@tabler/icons-react";
import axios from "axios";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export type Staff = {
	id: string;
	name: string;
	first_name: string;
	last_name: string;
	other_name: string;
	phone_number: string;
	mono_customer_id: string;
	date: string;
	role: string;
	staff: string;
	staff_code: string;
	status?: string;
	email: string;
	created_at: string;
	is_active: boolean;
};

interface ApiResponse {
	data: Staff; // Adjust to match your API structure
}

function LabDetails() {
	const { id } = useParams();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [userData, setUserData] = useState<Staff | null>(null);
	// Function to get the name initials from the user's name

	const fetchStaff = useCallback(async () => {
		setIsLoading(true);
		try {
			const session = await getSession();

			if (!session?.accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}

			const accessToken = session?.accessToken;

			const response = await axios.get<ApiResponse>(
				`https://api.kuditrak.ng/api/v1/user/${id}`,
				{
					headers: {
						Accept: "application/json",
						redirect: "follow",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			console.log("data", response?.data?.data);
			setUserData(response?.data?.data);
			setIsLoading(false);
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.log(
					"Error fetching post:",
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
		fetchStaff();
	}, [fetchStaff]);

	if (isLoading) {
		return <Loader />;
	}
	return (
		<div>
			<HeaderBox title="Health Care Management / Lab Details" />
			<div className="flex flex-row justify-start items-center gap-2 mb-4 p-3 bg-[#F4F6F8] border-b border-[#6C72781A] m-0">
				<Link
					href="/health-care-providers"
					className="flex flex-row text-[#6B7280] justify-start text-sm items-center gap-2">
					<IconArrowBack /> Back to previous page
				</Link>
				<IconCaretRightFilled size={18} />
				<p className="text-sm text-[#161616] font-normal ">
					Detailed profile view for {userData?.first_name} {userData?.last_name}
				</p>
			</div>
			<div className="flex flex-col sm:flex-row justify-between items-start px-4 py-2 gap-2 w-full max-w-[100vw]">
				<div className="border-[1px] border-[#E2E4E9] rounded-lg w-full bg-white overflow-hidden p-3 flex flex-col gap-3">
					<div className="flex flex-row justify-start gap-2 items-center">
						<Image src="/images/info.png" alt="info" width={20} height={20} />
						<p className="text-sm font-medium text-black">Activity Metrics</p>
					</div>

					<div className="flex flex-row justify-start items-center w-full gap-3">
						<StatCard
							title="Total Bookings"
							value={45678}
							percentage="36%"
							positive
						/>

						<StatCard
							title="Completed Appointments"
							value={3456}
							percentage="24%"
							positive={false}
						/>
						<StatCard
							title="Total Earnings"
							value={12345}
							percentage="18%"
							positive
						/>
						<StatCard
							title="Patient Satisfaction"
							value={12345}
							percentage="18%"
							positive
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
							Provider Profile Information
						</TabsTrigger>
						<TabsTrigger
							value="booking"
							className="data-[state=active]:border-b-2 data-[state=active]:text-dark-1 text-[#6C7278] data-[state=active]:border-[#2FE0A8] data-[state=active]:shadow-none data-[state=active]:rounded-none">
							Provider Booking Analytics
						</TabsTrigger>
					</TabsList>
					<TabsContent value="profile">
						<Profile />
					</TabsContent>
					<TabsContent value="booking">
						<BookingAnalytics />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

export default LabDetails;
