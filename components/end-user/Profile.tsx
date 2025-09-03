"use client";

import { IconFileExport, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "../Modal";
import { Button } from "../ui/button";

// Type definitions
interface User {
	_id: string;
	role: string;
	email: string;
	verified: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
	date_of_birth: string | null;
	full_name: string | null;
	gender: string | null;
	profile_pic: string | null;
	_basicinfo: boolean;
	terms: boolean;
	terms_date: string | null;
	public_id: string | null;
	status: "active" | "suspended" | "inactive";
}

interface Vital {
	_id: string;
	__v: number;
	blood_group: string | null;
	genotype: string | null;
	height: {
		value: number;
		unit: string;
		_id: string;
	} | null;
	weight: {
		value: number;
		unit: string;
		_id: string;
	} | null;
}

interface Medical {
	_id: string;
	__v: number;
	allergies: string[];
	chronic_conditions: string[];
	medications: string[];
}

interface Contact {
	_id: string;
	relationship: string;
	phone: string;
	full_name: string;
	__v: number;
}

interface Logins {
	total: number;
	loginsThisWeek: number;
	loginsLastWeek: number;
	last_login: string | null;
	percentChange: number;
}

interface UserData {
	user: {
		state: {
			user: boolean;
			medical: boolean;
			vital: boolean;
			contacts: boolean;
		};
		data: {
			user: User;
			vital: Vital | null;
			medical: Medical | null;
			contact: Contact[];
		};
	};
	logins: Logins;
	files: {
		total: number;
		filesThisWeek: number;
		filesLastWeek: number;
		percentChange: number;
	};
	medications: {
		total: number;
		medicationsThisWeek: number;
		medicationsLastWeek: number;
		percentChange: number;
	};
	chats: {
		total: number | null;
		chatsThisWeek: number | null;
		chatsLastWeek: number | null;
		percentChange: number;
	};
}

function Profile() {
	const { id } = useParams();
	const [userData, setUserData] = useState<UserData | null>(null);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

	const openDeleteModal = () => setIsDeleteModalOpen(true);
	const closeDeleteModal = () => setIsDeleteModalOpen(false);

	const openStatusModal = () => setIsStatusModalOpen(true);
	const closeStatusModal = () => setIsStatusModalOpen(false);

	const deleteUser = async () => {
		try {
			const session = await getSession();
			const accessToken = session?.accessToken;
			if (!accessToken) return;

			await axios.delete(`https://api.medbankr.ai/api/v1/administrator/user`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				data: { id },
			});

			closeDeleteModal();
			toast.success("User deleted successfully.");
			router.push("/end-user");
		} catch (error) {
			console.error("Error deleting user:", error);
			toast.error("Failed to delete user.");
		}
	};

	const toggleUserStatus = async () => {
		try {
			const session = await getSession();
			const accessToken = session?.accessToken;
			if (!accessToken || !userData) return;

			await axios.put(
				`https://api.medbankr.ai/api/v1/administrator/user/${id}/account-status`,
				{
					id: id,
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
				}
			);

			closeStatusModal();

			// Update local state to reflect the status change
			if (userData) {
				const newStatus =
					userData.user.data.user.status === "active" ? "suspended" : "active";
				setUserData({
					...userData,
					user: {
						...userData.user,
						data: {
							...userData.user.data,
							user: {
								...userData.user.data.user,
								status: newStatus,
							},
						},
					},
				});
			}

			toast.success(
				`User ${
					userData.user.data.user.status === "active"
						? "suspended"
						: "reactivated"
				} successfully.`
			);
		} catch (error) {
			console.error("Error changing user status:", error);
			toast.error(
				`Failed to ${
					userData?.user.data.user.status === "active"
						? "suspend"
						: "reactivate"
				} user.`
			);
		}
	};

	useEffect(() => {
		const fetchUser = async () => {
			try {
				setIsLoading(true);
				const session = await getSession();
				const accessToken = session?.accessToken;

				if (!accessToken) {
					console.error("No access token found.");
					setIsLoading(false);
					return;
				}

				const response = await axios.get(
					`https://api.medbankr.ai/api/v1/administrator/user/${id}`,
					{
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);

				if (response.status === 200 && response.data.status) {
					setUserData(response.data.data);
				}
			} catch (error) {
				console.error("Error fetching user:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (id) fetchUser();
	}, [id]);

	if (isLoading) {
		return <p className="p-4">Loading user details...</p>;
	}

	if (!userData) {
		return <p className="p-4">No user data found.</p>;
	}

	const { user, vital, medical, contact } = userData.user.data;
	const { logins } = userData;

	const isUserActive = user.status === "active";
	const statusButtonText = isUserActive
		? "Deactivate Account"
		: "Reactivate Account";
	const statusModalText = isUserActive
		? `Are you sure you want to suspend ${
				user.full_name || user.email
		  }'s account?`
		: `Are you sure you want to reactivate ${
				user.full_name || user.email
		  }'s account?`;
	const statusModalDescription = isUserActive
		? "They won't be able to log in"
		: "They will be able to log in again";

	return (
		<div className="border rounded-lg p-2">
			<div className="border bg-[#F6F8FA] p-2 rounded-lg">
				<div>
					<div className="flex flex-row justify-between items-center p-3">
						<p>Basic Information</p>
						<div className="flex flex-row justify-end items-center gap-2">
							<Button className="border bg-white" onClick={openDeleteModal}>
								<IconTrash />
							</Button>
							<Button className="border bg-white" onClick={openStatusModal}>
								{statusButtonText}
							</Button>

							<Button className="cborder bg-secondary-1">
								<IconFileExport /> Export Data
							</Button>
						</div>
					</div>

					{/* ==== BASIC INFO ==== */}
					<div className="bg-white p-6 shadow-lg rounded-lg mt-1">
						<div className="flex flex-col gap-5">
							<Image
								src={user.profile_pic || "/images/avatar.png"}
								alt="Profile Picture"
								width={150}
								height={150}
								className="rounded-full w-12 h-12 mb-2"
							/>

							<div className="flex flex-row justify-start items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Full Name</p>
									<p className="text-sm text-dark-1">
										{user.full_name || "N/A"}
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Email Address</p>
									<p className="text-sm text-dark-1 flex flex-row justify-start items-center gap-2">
										{user.email}
										<p className={`status ${user.verified ? "green" : "red"}`}>
											{user.verified ? "Verified" : "Unverified"}
										</p>
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Date of Birth</p>
									<p className="text-sm text-dark-1">
										{user.date_of_birth
											? new Date(user.date_of_birth).toDateString()
											: "N/A"}
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Account Status</p>
									<p
										className={`status ${
											user.status === "active" ? "green" : "red"
										}`}>
										{user.status}
									</p>
								</div>
							</div>

							<div className="flex flex-row justify-start items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Gender</p>
									<p className="text-sm text-dark-1">{user.gender || "N/A"}</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Sign Up Date</p>
									<p className="text-sm text-dark-1">
										{new Date(user.createdAt).toDateString()}
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Last Login</p>
									<p className="text-sm text-dark-1">
										{logins?.last_login
											? new Date(logins.last_login).toDateString()
											: "N/A"}
									</p>
								</div>
							</div>

							<div className="flex flex-row justify-start items-start">
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

					{/* ==== VITAL STATS ==== */}
					<div className="flex flex-row justify-between items-center px-3 pb-1">
						<p>Vital Stats</p>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-1">
						<div className="flex flex-col gap-5">
							<div className="flex flex-row justify-start items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Weight</p>
									<p className="text-sm text-dark-1">
										{vital?.weight
											? `${vital.weight.value} ${vital.weight.unit}`
											: "N/A"}
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Height</p>
									<p className="text-sm text-dark-1">
										{vital?.height
											? `${vital.height.value} ${vital.height.unit}`
											: "N/A"}
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Official Blood Group</p>
									<p className="text-sm text-dark-1">
										{vital?.blood_group || "N/A"}
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Official Genotype</p>
									<p className="text-sm text-dark-1">
										{vital?.genotype || "N/A"}
									</p>
								</div>
							</div>
						</div>
					</div>

					<hr className="my-4" />

					{/* ==== MEDICAL STATUS ==== */}
					<div className="flex flex-row justify-between items-center px-3 pb-1">
						<p>Medical Status</p>
					</div>

					<div className="bg-white p-6 shadow-lg rounded-lg mt-1">
						<div className="flex flex-col gap-5">
							<div className="flex flex-row justify-start items-start">
								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Ongoing Allergy</p>
									<p className="text-sm text-dark-1">
										{medical?.allergies && medical.allergies.length > 0
											? medical.allergies.join(", ")
											: "None"}
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Chronic Conditions</p>
									<p className="text-sm text-dark-1">
										{medical?.chronic_conditions &&
										medical.chronic_conditions.length > 0
											? medical.chronic_conditions.join(", ")
											: "None"}
									</p>
								</div>

								<div className="flex flex-col gap-2 w-full sm:w-[25%]">
									<p className="text-xs text-[#6B7280]">Ongoing Medication</p>
									<p className="text-sm text-dark-1">
										{medical?.medications && medical.medications.length > 0
											? medical.medications.join(", ")
											: "None"}
									</p>
								</div>
							</div>
						</div>
					</div>

					<hr className="my-4" />

					{/* ==== EMERGENCY CONTACT ==== */}
					<div className="flex flex-row justify-between items-center px-3 pb-1">
						<p>Emergency Contact</p>
					</div>

					{contact?.map((c: Contact) => (
						<div key={c._id} className="bg-white p-6 shadow-lg rounded-lg mt-3">
							<div className="flex flex-col gap-5">
								<div className="flex flex-row justify-start items-start">
									<div className="flex flex-col gap-2 w-full sm:w-[25%]">
										<p className="text-xs text-[#6B7280]">Full Name</p>
										<p className="text-sm text-dark-1">{c.full_name}</p>
									</div>

									<div className="flex flex-col gap-2 w-full sm:w-[25%]">
										<p className="text-xs text-[#6B7280]">Phone Number</p>
										<p className="text-sm text-dark-1">{c.phone}</p>
									</div>

									<div className="flex flex-col gap-2 w-full sm:w-[25%]">
										<p className="text-xs text-[#6B7280]">Relationship</p>
										<p className="text-sm text-dark-1">{c.relationship}</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* ==== DELETE MODAL ==== */}
			{isDeleteModalOpen && (
				<Modal onClose={closeDeleteModal} isOpen={isDeleteModalOpen}>
					<p>
						Are you sure you want to delete {user.full_name || user.email}
						&apos;s account?
					</p>
					<p className="text-sm text-primary-6">This can&apos;t be undone</p>
					<div className="flex flex-row justify-end items-center gap-3 font-inter mt-4">
						<Button
							className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
							onClick={closeDeleteModal}>
							Cancel
						</Button>
						<Button
							className="bg-[#F04F4A] text-white font-inter text-xs modal-delete"
							onClick={deleteUser}>
							Yes, Confirm
						</Button>
					</div>
				</Modal>
			)}

			{/* ==== STATUS MODAL ==== */}
			{isStatusModalOpen && (
				<Modal onClose={closeStatusModal} isOpen={isStatusModalOpen}>
					<p>{statusModalText}</p>
					<p className="text-sm text-primary-6">{statusModalDescription}</p>
					<div className="flex flex-row justify-end items-center gap-3 font-inter mt-4">
						<Button
							className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
							onClick={closeStatusModal}>
							Cancel
						</Button>
						<Button
							className={`${
								isUserActive ? "bg-[#F59E0B]" : "bg-[#10B981]"
							} text-white font-inter text-xs`}
							onClick={toggleUserStatus}>
							Yes, Confirm
						</Button>
					</div>
				</Modal>
			)}
		</div>
	);
}

export default Profile;
