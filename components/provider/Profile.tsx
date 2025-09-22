"use client";

import Loader from "@/components/Loader";
import { IconFileExport, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";

interface ProviderData {
	_id: string;
	name: string;
	provider_image: string;
	provider_type: string;
	provider_specialization: string;
	description: string;
	emails: string[];
	phone: string[];
	address: Array<{
		street: string;
		city: string;
		state: string;
		country: string;
		_id: string;
	}>;
	consultation_fee: number;
	coverage: Array<{
		name: string;
		fee: number;
		_id: string;
	}>;
	license_number: string;
	accreditation_body: string;
	certification_expiry_date: string;
	certification_number: string;
	certificate_file: string;
	certificate_verification: boolean;
	services: string[];
	status: string;
	email_verification: boolean;
	createdAt: string;
	updatedAt: string;
}

function Profile() {
	const { id } = useParams();
	const [providerData, setProviderData] = useState<ProviderData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Helper function to parse JSON strings from arrays
	const parseJsonArray = (array: string[]): string[] => {
		if (!array || !Array.isArray(array)) return [];

		return array.flatMap((item) => {
			try {
				const parsed = JSON.parse(item);
				return Array.isArray(parsed) ? parsed : [parsed];
			} catch (error) {
				return [item];
			}
		});
	};

	const fetchProviderData = async () => {
		try {
			setIsLoading(true);
			const session = await getSession();
			const accessToken = session?.accessToken;

			if (!accessToken) {
				console.error("No access token found.");
				toast.error("No access token found. Please log in again.");
				return;
			}

			const response = await axios.get(
				`https://api.medbankr.ai/api/v1/administrator/provider/${id}`,
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			// CORRECTED LOGIC: Check the top-level boolean status
			if (response.data.status === true) {
				setProviderData(response.data.data);
			} else {
				toast.error("Failed to fetch provider data.");
			}
		} catch (error) {
			console.error("Error fetching provider data:", error);
			toast.error("Failed to fetch provider data. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleExportData = () => {
		// Export logic here
		toast.info("Export feature coming soon");
	};

	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		return new Date(dateString).toLocaleDateString("en-US", options);
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
		}).format(amount);
	};

	useEffect(() => {
		if (id) {
			fetchProviderData();
		}
	}, [id]);

	if (isLoading) {
		return <Loader />;
	}

	if (!providerData) {
		return (
			<div className="border rounded-lg p-2">
				<div className="border bg-[#F6F8FA] p-2 rounded-lg">
					<div className="bg-white p-6 shadow-lg rounded-lg mt-1 text-center">
						<p>Provider not found</p>
					</div>
				</div>
			</div>
		);
	}

	// Parse the data
	const emails = parseJsonArray(providerData.emails || []);
	const phoneNumbers = parseJsonArray(providerData.phone || []);
	const services = parseJsonArray(providerData.services || []);
	const primaryAddress = providerData.address?.[0] || {};
	const primaryEmail = emails[0] || "No email";
	const primaryPhone = phoneNumbers[0] || "No phone number";

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
							<Button
								className="cborder bg-secondary-1"
								onClick={handleExportData}>
								<IconFileExport /> Export Data
							</Button>
						</div>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-1">
						<div className="flex flex-col gap-5">
							<Image
								src={providerData.provider_image || "/images/medvisit.png"}
								alt="Profile Picture"
								width={150}
								height={50}
								className="rounded-lg w-fit h-12 object-cover border"
							/>

							<div className="flex flex-row justify-start items-start flex-wrap">
								<div className="flex flex-col gap-2 w-full sm:w-[25%] mb-4">
									<p className="text-xs text-[#6B7280]">Facility Name</p>
									<p className="text-sm text-dark-1">{providerData.name}</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%] mb-4">
									<p className="text-xs text-[#6B7280]">Specialization</p>
									<p className="text-sm text-dark-1">
										{providerData.provider_specialization}
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%] mb-4">
									<p className="text-xs text-[#6B7280]">Sign Up Date</p>
									<p className="text-sm text-dark-1">
										{formatDate(providerData.createdAt)}
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%] mb-4">
									<p className="text-xs text-[#6B7280]">Provider Status</p>
									<p
										className={`status ${
											providerData.status === "active" ? "green" : "red"
										}`}>
										{providerData.status}
									</p>
								</div>
							</div>

							<div className="flex flex-row justify-start items-start flex-wrap">
								<div className="flex flex-col gap-2 w-full sm:w-[25%] mb-4">
									<p className="text-xs text-[#6B7280]">Email Address</p>
									<p className="text-sm text-dark-1 flex flex-row justify-start items-center gap-2">
										{primaryEmail}
										<p
											className={`status ${
												providerData.email_verification ? "green" : "red"
											}`}>
											{providerData.email_verification
												? "Verified"
												: "Not Verified"}
										</p>
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%] mb-4">
									<p className="text-xs text-[#6B7280]">Phone Number</p>
									<p className="text-sm text-dark-1">{primaryPhone}</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[50%] mb-4">
									<p className="text-xs text-[#6B7280]">Description</p>
									<p className="text-sm text-dark-1">
										{providerData.description}
									</p>
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
							<div className="flex flex-row justify-start items-start flex-wrap">
								{services.map((service, index) => (
									<div
										key={index}
										className="flex flex-col gap-2 w-full sm:w-[25%] mb-4">
										<p className="text-xs text-[#6B7280]">
											{(index + 1).toString().padStart(3, "0")}
										</p>
										<p className="text-sm text-dark-1">{service}</p>
									</div>
								))}
							</div>
						</div>
					</div>

					<hr className="my-4" />

					<div className="flex flex-row justify-between items-center px-3 pb-1">
						<p>Consultation Fee and Coverage</p>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-1">
						<div className="flex flex-col gap-5">
							<div className="flex flex-row justify-start items-start flex-wrap">
								<div className="flex flex-col gap-2 w-full sm:w-[25%] mb-4">
									<p className="text-xs text-[#6B7280]">Consultation Fee</p>
									<p className="text-sm text-dark-1">
										{formatCurrency(providerData.consultation_fee)}
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[75%] mb-4">
									<p className="text-xs text-[#6B7280]">Coverage Plans</p>
									<div className="flex flex-wrap gap-2">
										{providerData.coverage.map((coverage, index) => (
											<span
												key={index}
												className="text-sm text-dark-1 bg-gray-100 px-2 py-1 rounded">
												{coverage.name} - {formatCurrency(coverage.fee)}
											</span>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>

					<hr className="my-4" />

					<div className="flex flex-row justify-between items-center px-3 pb-1">
						<p>Address</p>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-1">
						<div className="flex flex-col gap-5">
							<div className="flex flex-row justify-start items-start flex-wrap">
								<div className="flex flex-col gap-2 w-full sm:w-[25%] mb-4">
									<p className="text-xs text-[#6B7280]">Street</p>
									<p className="text-sm text-dark-1">
										{primaryAddress.street || "Not specified"}
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%] mb-4">
									<p className="text-xs text-[#6B7280]">City/LGA</p>
									<p className="text-sm text-dark-1">
										{primaryAddress.city || "Not specified"}
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%] mb-4">
									<p className="text-xs text-[#6B7280]">State</p>
									<p className="text-sm text-dark-1">
										{primaryAddress.state || "Not specified"}
									</p>
								</div>
								<div className="flex flex-col gap-2 w-full sm:w-[25%] mb-4">
									<p className="text-xs text-[#6B7280]">Country</p>
									<p className="text-sm text-dark-1">
										{primaryAddress.country || "Not specified"}
									</p>
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
							<div className="flex flex-row justify-start items-start flex-wrap">
								<div className="flex flex-col gap-2 w-full sm:w-[25%] mb-4">
									<p className="text-xs text-[#6B7280]">License Number</p>
									<p className="text-sm text-dark-1">
										{providerData.license_number}
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%] mb-4">
									<p className="text-xs text-[#6B7280]">Accreditation Body</p>
									<p className="text-sm text-dark-1">
										{providerData.accreditation_body}
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%] mb-4">
									<p className="text-xs text-[#6B7280]">Expiry Date</p>
									<p className="text-sm text-dark-1">
										{formatDate(providerData.certification_expiry_date)}
									</p>
								</div>
								<div className="flex flex-col gap-2 w-full sm:w-[25%] mb-4">
									<p className="text-xs text-[#6B7280]">Verification Status</p>
									<p
										className={`status ${
											providerData.certificate_verification ? "green" : "red"
										}`}>
										{providerData.certificate_verification
											? "Verified"
											: "Not Verified"}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-3">
						<div className="flex flex-col gap-5">
							<div className="flex flex-row justify-start items-start flex-wrap">
								<div className="flex flex-col gap-2 w-full sm:w-[25%] mb-4">
									<p className="text-xs text-[#6B7280]">Certification Number</p>
									<p className="text-sm text-dark-1">
										{providerData.certification_number}
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[50%] mb-4">
									<p className="text-xs text-[#6B7280]">Certificate File</p>
									{providerData.certificate_file ? (
										<div className="flex flex-row justify-start items-center gap-2 border w-fit p-2 rounded-lg">
											<Image
												src="/images/avatar.png"
												alt="Certificate"
												width={20}
												height={20}
												className="rounded-sm"
											/>
											<p className="text-sm">Certificate</p>
											<a
												href={providerData.certificate_file}
												target="_blank"
												rel="noopener noreferrer"
												className="text-secondary-1 text-sm hover:underline">
												Preview
											</a>
										</div>
									) : (
										<p className="text-sm text-dark-1">
											No certificate uploaded
										</p>
									)}
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
