import { IconFileExport, IconTransfer, IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import { Button } from "../ui/button";

function Profile() {
	return (
		<div className="border rounded-lg p-2">
			<div className="border bg-[#F6F8FA] p-2 rounded-lg">
				<div>
					<div className="flex flex-row justify-between items-center p-3">
						<p>Basic Information</p>
						<div className="flex flex-row justify-end items-center gap-2">
							<Button className="border bg-white">
								<IconTrash />
							</Button>
							<Button className="border bg-white">Refund</Button>
							<Button className="border bg-white">Cancel</Button>
							<Button className="border bg-white">Approve</Button>
							<Button className="border bg-white">
								<IconTransfer /> Transfer
							</Button>
							<Button className="cborder bg-secondary-1">
								<IconFileExport /> Export Data
							</Button>
						</div>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-1">
						<div className="flex flex-col gap-5">
							<Image
								src="/images/smartdna.png"
								alt="Profile Picture"
								width={50}
								height={50}
								className="rounded-md"
							/>

							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Booking ID</p>
									<p className="text-sm text-dark-1">BKG-001234</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Booking Date</p>
									<p className="text-sm text-dark-1 flex flex-row justify-start items-center gap-2">
										2025/07/04 - 09:30 AM
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Booking Status</p>
									<p className="status yellow w-full">Pending</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Payment Status</p>
									<p className="status green">Paid</p>
								</div>
							</div>

							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Provider ID</p>
									<p className="text-sm text-dark-1">PRV-001</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Fertility Name</p>
									<p className="text-sm text-dark-1">SmartDNA</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Service Offered </p>
									<p className="text-sm text-dark-1">Paternity DNA Test</p>
								</div>
							</div>
						</div>
					</div>

					<hr className="my-4" />

					<div className="flex flex-row justify-between items-center px-3 pb-1">
						<p>Patient Details</p>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-1">
						<div className="flex flex-col gap-5">
							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">End User ID</p>
									<p className="text-sm text-dark-1">USR-001</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">End User Name</p>
									<p className="text-sm text-dark-1">John Doe</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">
										End User Email Address
									</p>
									<p className="text-sm text-dark-1">john.doe@example.com</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">
										End User Phone Number
									</p>
									<p className="text-sm text-dark-1">+2348012345678</p>
								</div>
							</div>
						</div>
					</div>

					<hr className="my-4" />

					<div className="flex flex-row justify-between items-center px-3 pb-1">
						<p>Appointment Details</p>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-1">
						<div className="flex flex-col gap-5">
							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Provider ID</p>
									<p className="text-sm text-dark-1">PRV-001</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Consultation Fee</p>
									<p className="text-sm text-dark-1">₦20,000</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Status</p>
									<p className="status green">Confirmed</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Fertility Name</p>
									<p className="text-sm text-dark-1">SmartDNA</p>
								</div>
							</div>

							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Service Offered</p>
									<p className="text-sm text-dark-1">Paternity DNA Test</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Appointment Date</p>
									<p className="text-sm text-dark-1">2025/07/04 - 09:30 AM</p>
								</div>
							</div>
						</div>
					</div>
					<hr className="my-4" />
					<div className="flex flex-row justify-between items-center px-3 pb-1">
						<p>Consultation Fee and Coverage</p>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-1">
						<div className="flex flex-col gap-5">
							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Consultation Fee</p>
									<p className="text-sm text-dark-1">NGN40,000</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[75%]">
									<p className="text-xs text-[#6B7280]">Coverage</p>
									<p className="text-sm text-dark-1">
										Symptom Assessment, Expert Advice, Lab Tests, Medical
										History Review, Genetic Testing, Counseling, Follow-up
										Consultation
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
