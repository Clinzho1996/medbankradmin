import { IconFileExport, IconTrash } from "@tabler/icons-react";
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
							<Button className="border bg-white">Suspend</Button>
							<Button className="border bg-white">Reset Password</Button>
							<Button className="cborder bg-secondary-1">
								<IconFileExport /> Export Data
							</Button>
						</div>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-1">
						<div className="flex flex-col gap-5">
							<Image
								src="/images/avatar.png"
								alt="Profile Picture"
								width={50}
								height={50}
								className="rounded-full"
							/>

							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Full Name</p>
									<p className="text-sm text-dark-1">Confidence Clinton</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Email Address</p>
									<p className="text-sm text-dark-1 flex flex-row justify-start items-center gap-2">
										clinton@example.com <p className="status green">Verified</p>
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Role</p>
									<p className="text-sm text-dark-1">Administrator</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Account Status</p>
									<p className="status green">Active</p>
								</div>
							</div>

							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Sign Up Date</p>
									<p className="text-sm text-dark-1">2024-03-10 11:00 AM</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Last Login</p>
									<p className="text-sm text-dark-1">2025-07-04 09:20 AM</p>
								</div>
							</div>
						</div>
					</div>

					<hr className="my-4" />

					<div className="flex flex-row justify-between items-center px-3 pb-1">
						<p>Permission Access</p>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-1">
						<div className="flex flex-row flex-wrap gap-10">
							<p className="text-xs text-[#6B7280]">User Management</p>
							<p className="text-xs text-[#6B7280]">Health Care Provider</p>
							<p className="text-xs text-[#6B7280]">Staff Management</p>
							<p className="text-xs text-[#6B7280]">Booking Handling</p>{" "}
							<p className="text-xs text-[#6B7280]">Document & Vault</p>{" "}
							<p className="text-xs text-[#6B7280]">Support & Operations</p>{" "}
							<p className="text-xs text-[#6B7280]">Content & Campaign</p>{" "}
							<p className="text-xs text-[#6B7280]">Manage Users</p>{" "}
							<p className="text-xs text-[#6B7280]">Payment and Finance</p>{" "}
							<p className="text-xs text-[#6B7280]">Subscription Management</p>{" "}
							<p className="text-xs text-[#6B7280]">Analytical & Reporting</p>{" "}
							<p className="text-xs text-[#6B7280]">Audit Trail</p>{" "}
							<p className="text-xs text-[#6B7280]">Compliance & Legal</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
