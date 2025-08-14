"use client";

import HeaderBox from "@/components/HeaderBox";
import StatCard from "@/components/StatCard";
import BookingTableComponent from "@/config/booking-columns";
import Image from "next/image";

interface CardData {
	amount: number;
	difference: number;
}

interface MonthlyIncomeResponse {
	current_month_income: number;
	previous_month_income: number;
	difference: number;
	type: string;
	percentage_change: string;
}

function BookingHandling() {
	return (
		<div>
			<HeaderBox title="Booking Handling Management" />
			<p className="text-sm text-[#6C7278] font-normal mb-4 p-3 bg-[#F4F6F8] border-b border-[#6C72781A]">
				Comprehensive management of appointment bookings, scheduling conflicts,
				provider availability, and booking analytics across the platform.
			</p>

			<div className="flex flex-col sm:flex-row justify-between items-start px-4 py-2 gap-2 w-full max-w-[100vw]">
				<div className="border-[1px] border-[#E2E4E9] rounded-lg w-full bg-white overflow-hidden p-3 flex flex-col gap-3">
					<div className="flex flex-row justify-start gap-2 items-center">
						<Image src="/images/info.png" alt="info" width={20} height={20} />
						<p className="text-sm font-medium text-black">Booking Metrics</p>
					</div>

					<div className="flex flex-row justify-start items-center w-full gap-3">
						<StatCard
							title="Total Bookings Today"
							value={45678}
							percentage="36%"
							positive
						/>

						<StatCard
							title="Total Bookings This Week"
							value={3456}
							percentage="24%"
							positive={false}
						/>
						<StatCard
							title="Total Bookings This Month"
							value={12345}
							percentage="18%"
							positive
						/>
						<StatCard
							title="Booking Success Rate"
							value={12345}
							percentage="18%"
							positive
						/>
					</div>

					<div className="flex flex-row justify-start items-center w-full gap-3">
						<StatCard
							title="Cancellation Rate"
							value={45678}
							percentage="36%"
							positive
						/>

						<StatCard
							title="Average Booking Value"
							value={3456}
							percentage="24%"
							positive
						/>
						<StatCard
							title="Total Revenue"
							value={12345}
							percentage="18%"
							positive={false}
						/>
						<StatCard
							title="Peak Booking Rates"
							value={12345}
							percentage="18%"
							positive
						/>
					</div>
				</div>
			</div>

			<div className="bg-[#F6F8FA] flex flex-col px-4 py-2 gap-4 max-w-[100vw]">
				<BookingTableComponent />
			</div>
		</div>
	);
}

export default BookingHandling;
