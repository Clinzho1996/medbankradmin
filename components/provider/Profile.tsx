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
								src="/images/medvisit.png"
								alt="Profile Picture"
								width={150}
								height={50}
								className="rounded-lg"
							/>

							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Facility Name</p>
									<p className="text-sm text-dark-1">Medvisit</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Specialization</p>
									<p className="text-sm text-dark-1">Medical Tourism</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Sign Up Date</p>
									<p className="text-sm text-dark-1">January 1, 1990</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Provider Status</p>
									<p className="status green">Active</p>
								</div>
							</div>

							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Email Address</p>
									<p className="text-sm text-dark-1 flex flex-row justify-start items-center gap-2">
										care@smartna.com.ng <p className="status green">Verified</p>
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Phone Number</p>
									<p className="text-sm text-dark-1">+234 803 123 4567</p>
								</div>
							</div>
						</div>
					</div>

					<hr className="my-4" />

					<div className="flex flex-row justify-between items-center px-3 pb-1">
						<p>Services</p>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-1">
						<div className="flex flex-col gap-5">
							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">001</p>
									<p className="text-sm text-dark-1">
										Personal Paternity DNA Test
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">002</p>
									<p className="text-sm text-dark-1">Paternity DNA Test</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">003</p>
									<p className="text-sm text-dark-1">Immigration DNA Test</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">004</p>
									<p className="text-sm text-dark-1">Legal DNA Test</p>
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

					<hr className="my-4" />

					<div className="flex flex-row justify-between items-center px-3 pb-1">
						<p>Adress</p>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-1">
						<div className="flex flex-col gap-5">
							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Street</p>
									<p className="text-sm text-dark-1">
										2A, Johnson Oguntuyo Street
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">LGA</p>
									<p className="text-sm text-dark-1">Gbagada</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">State</p>
									<p className="text-sm text-dark-1">Lagos</p>
								</div>
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Country</p>
									<p className="text-sm text-dark-1">Nigeria</p>
								</div>
							</div>
						</div>
					</div>

					<hr className="my-4" />

					<div className="flex flex-row justify-between items-center px-3 pb-1">
						<p>Accreditation</p>
					</div>
					<div className="bg-white p-6 shadow-lg rounded-lg mt-3">
						<div className="flex flex-col gap-5">
							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">License Body</p>
									<p className="text-sm text-dark-1">HF-001-2023</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Accreditation Body</p>
									<p className="text-sm text-dark-1">
										Federal Ministry of Health
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Expiry Date</p>
									<p className="text-sm text-dark-1">2025-12-31</p>
								</div>
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Verification Status</p>
									<p className="status green">Verified</p>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-3">
						<div className="flex flex-col gap-5">
							<div className="flex flex-row justify-start  items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Certifications</p>
									<p className="text-sm text-dark-1">
										ISO 9001:2015, JCI Accredited
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[50%]">
									<p className="text-xs text-[#6B7280]">Attachment</p>
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
				</div>
			</div>
		</div>
	);
}

export default Profile;
