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
							<Button className="border bg-white">Deactivate Account</Button>
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
									<p className="text-xs text-[#6B7280]">Date of Birth</p>
									<p className="text-sm text-dark-1">January 1, 1990</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Account Status</p>
									<p className="status green">Active</p>
								</div>
							</div>

							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Gender</p>
									<p className="text-sm text-dark-1">Male</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Sign Up Date</p>
									<p className="text-sm text-dark-1">January 1, 2020</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Last Login</p>
									<p className="text-sm text-dark-1">January 1, 1990</p>
								</div>
							</div>

							<div className="flex flex-row justify-start \items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Subscription Type</p>
									<p className="text-sm text-dark-1">Premium</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%] ">
									<p className="text-xs text-[#6B7280]">Subscription Status</p>
									<p className="status green">Active</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[50%]">
									<p className="text-xs text-[#6B7280]">Uploaded ID</p>
									<div className="flex flex-row justify-start items-center gap-2 border w-fit p-2 rounded-lg">
										<Image
											src="/images/avatar.png"
											alt="Uploaded ID"
											width={20}
											height={20}
											className="rounded-sm"
										/>
										<p className="text-sm">National ID.png</p>
										<p className=" text-secondary-1 text-sm">Preview</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<hr className="my-4" />

					<div className="flex flex-row justify-between items-center px-3 pb-1">
						<p>Vital Stats</p>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-1">
						<div className="flex flex-col gap-5">
							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Weight</p>
									<p className="text-sm text-dark-1">140lbs</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Height</p>
									<p className="text-sm text-dark-1">5&apos;8</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Official Blood Group</p>
									<p className="text-sm text-dark-1">O+</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Official Genotype</p>
									<p className="text-sm text-dark-1">AA</p>
								</div>
							</div>
						</div>
					</div>

					<hr className="my-4" />

					<div className="flex flex-row justify-between items-center px-3 pb-1">
						<p>Medical Status</p>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-1">
						<div className="flex flex-col gap-5">
							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Ongoing Allergy</p>
									<p className="text-sm text-dark-1">Peanuts</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Chronic Conditions</p>
									<p className="text-sm text-dark-1">None</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Ongoing Medication</p>
									<p className="text-sm text-dark-1">None</p>
								</div>
							</div>
						</div>
					</div>

					<hr className="my-4" />

					<div className="flex flex-row justify-between items-center px-3 pb-1">
						<p>Emergency Contact</p>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-1">
						<div className="flex flex-col gap-5">
							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Full Name</p>
									<p className="text-sm text-dark-1">Oluwafemi Samson</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Phone Number</p>
									<p className="text-sm text-dark-1">08012345678</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Relationship</p>
									<p className="text-sm text-dark-1">Brother</p>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-3">
						<div className="flex flex-col gap-5">
							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Full Name</p>
									<p className="text-sm text-dark-1">Abass Olatunji</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Phone Number</p>
									<p className="text-sm text-dark-1">08012345678</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Relationship</p>
									<p className="text-sm text-dark-1">Son</p>
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
