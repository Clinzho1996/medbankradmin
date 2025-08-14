"use client";

import Profile from "@/components/booking/Profile";
import HeaderBox from "@/components/HeaderBox";
import Loader from "@/components/Loader";
import { IconArrowBack, IconCaretRightFilled } from "@tabler/icons-react";
import axios from "axios";
import { getSession } from "next-auth/react";
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

function BookingDetails() {
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
			<HeaderBox title="Booking Handling Management" />
			<div className="flex flex-row justify-start items-center gap-2 mb-4 p-3 bg-[#F4F6F8] border-b border-[#6C72781A] m-0">
				<Link
					href="/booking-handling"
					className="flex flex-row text-[#6B7280] justify-start text-sm items-center gap-2">
					<IconArrowBack /> Back to previous page
				</Link>
				<IconCaretRightFilled size={18} />
				<p className="text-sm text-[#161616] font-normal ">
					Detailed Profile View for BKG-001234 {userData?.first_name}{" "}
					{userData?.last_name}
				</p>
			</div>

			<div className="mx-auto rounded-lg w-full sm:w-[97.5%] bg-white overflow-hidden p-3 flex flex-col gap-3">
				<Profile />
			</div>
		</div>
	);
}

export default BookingDetails;
