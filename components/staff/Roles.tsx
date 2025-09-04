"use client";

import {
	IconCirclePlus,
	IconEdit,
	IconShieldBolt,
	IconUserBolt,
	IconX,
} from "@tabler/icons-react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Checkbox } from "../ui/checkbox";

function Roles() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);
	const [isEditMode, setIsEditMode] = useState(false);
	const [roleData, setRoleData] = useState({
		name: "",
		title: "",
		description: "",
		permission: [] as string[],
	});
	const [searchInput, setSearchInput] = useState("");
	const [allPermissions, setAllPermissions] = useState<string[]>([]);
	const [roles, setRoles] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	// Fetch all permissions
	const fetchPermissions = async () => {
		try {
			const session = await getSession();
			const accessToken = session?.accessToken;

			if (!accessToken) {
				console.error("No access token found.");
				return;
			}

			const response = await axios.get(
				"https://api.medbankr.ai/api/v1/administrator/permission/read/all",
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.data.status === true) {
				setAllPermissions(response.data.data);
			}
		} catch (error) {
			console.error("Error fetching permissions:", error);
			toast.error("Failed to fetch permissions");
		}
	};

	// Fetch all roles
	const fetchRoles = async () => {
		try {
			setIsLoading(true);
			const session = await getSession();
			const accessToken = session?.accessToken;

			if (!accessToken) {
				console.error("No access token found.");
				return;
			}

			const response = await axios.get(
				"https://api.medbankr.ai/api/v1/administrator/permission",
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.data.status === true) {
				setRoles(response.data.data);
			}
		} catch (error) {
			console.error("Error fetching roles:", error);
			toast.error("Failed to fetch roles");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchPermissions();
		fetchRoles();
	}, []);

	const handleNextStep = async () => {
		if (currentStep < 3) {
			setCurrentStep(currentStep + 1);
		} else {
			// Submit logic here
			try {
				const session = await getSession();
				const accessToken = session?.accessToken;

				if (!accessToken) {
					toast.error("No access token found. Please log in again.");
					return;
				}

				if (isEditMode) {
					// Update existing role
					const response = await axios.put(
						`https://api.medbankr.ai/api/v1/permissions/update/${roleData.name}`,
						roleData,
						{
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${accessToken}`,
								"Content-Type": "application/json",
							},
						}
					);

					if (response.data.status === true) {
						toast.success("Role updated successfully!");
						fetchRoles(); // Refresh roles list
					}
				} else {
					// Create new role
					const response = await axios.post(
						"https://api.medbankr.ai/api/v1/administrator/permission",
						roleData,
						{
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${accessToken}`,
								"Content-Type": "application/json",
							},
						}
					);

					if (response.data.status === true) {
						toast.success("Role created successfully!");
						fetchRoles(); // Refresh roles list
					}
				}

				setIsModalOpen(false);
				resetForm();
			} catch (error: any) {
				console.error("Error saving role:", error);
				const errorMessage =
					error.response?.data?.message ||
					"Failed to save role. Please try again.";
				toast.error(errorMessage);
			}
		}
	};

	const handlePrevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const resetForm = () => {
		setRoleData({
			name: "",
			title: "",
			description: "",
			permission: [],
		});
		setCurrentStep(1);
		setIsEditMode(false);
	};

	const handlePermissionChange = (permission: string, isChecked: boolean) => {
		if (isChecked) {
			setRoleData({
				...roleData,
				permission: [...roleData.permission, permission],
			});
		} else {
			setRoleData({
				...roleData,
				permission: roleData.permission.filter((p) => p !== permission),
			});
		}
	};

	const openEditModal = (role: any) => {
		setIsEditMode(true);
		setRoleData({
			name: role.name,
			title: role.title,
			description: role.description,
			permission: role.permission,
		});
		setIsModalOpen(true);
	};

	const deleteRole = async (roleName: string) => {
		try {
			const session = await getSession();
			const accessToken = session?.accessToken;

			if (!accessToken) {
				toast.error("No access token found. Please log in again.");
				return;
			}

			const response = await axios.delete(
				`https://api.medbankr.ai/api/v1/permissions/delete/${roleName}`,
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.data.status === true) {
				toast.success("Role deleted successfully!");
				fetchRoles(); // Refresh roles list
			}
		} catch (error: any) {
			console.error("Error deleting role:", error);
			const errorMessage =
				error.response?.data?.message ||
				"Failed to delete role. Please try again.";
			toast.error(errorMessage);
		}
	};

	return (
		<div className="flex flex-col gap-3">
			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg border border-secondary-1 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-4 border-b pb-3">
							<h2 className="text-sm text-gray-700 font-sequel  font-normal">
								{isEditMode ? "Edit Role" : "Create New Role"}
							</h2>
							<button
								onClick={() => {
									setIsModalOpen(false);
									resetForm();
								}}
								className="text-gray-500 hover:text-gray-700">
								<IconX size={20} />
							</button>
						</div>

						{/* Step indicator */}
						<div className="flex items-center justify-between mb-6 relative">
							{/* Connecting line */}
							<div className="absolute top-4 left-0 right-0 h-[2px] bg-gray-200 -z-10"></div>

							{[1, 2, 3].map((step) => (
								<div
									key={step}
									className={`flex flex-col items-center relative ${
										currentStep >= step ? "text-primary" : "text-gray-400"
									}`}>
									{/* Active line segment for completed steps */}
									{step > 1 && (
										<div
											className={`absolute w-full h-[2px]  top-4 ${
												currentStep >= step
													? "bg-secondary-1"
													: "bg-transparent"
											}`}
											style={{
												left: `calc(-100% - 70px)`,
												right: `calc(100% + 70px)`,
											}}></div>
									)}

									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center relative ${
											currentStep >= step
												? "bg-secondary-1 text-white"
												: "bg-gray-200"
										}`}>
										{step}
									</div>
									<span className="text-xs mt-1">
										{step === 1
											? "Basic Info"
											: step === 2
											? "Set Permission"
											: "Review Details"}
									</span>
								</div>
							))}
						</div>

						{/* Step 1: Basic Info */}
						{currentStep === 1 && (
							<div className="space-y-6">
								<div className="p-4 border rounded-lg bg-[#F6F8FA] shadow-sm">
									<h3 className="font-medium mb-3">Basic Details</h3>
									<p className="text-sm text-gray-500 mb-3">
										Add basic information about the role you are creating
									</p>
									<div className="space-y-4 bg-white shadow-lg rounded-lg p-3">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Name (Internal ID)
											</label>
											<input
												type="text"
												value={roleData.name}
												onChange={(e) =>
													setRoleData({ ...roleData, name: e.target.value })
												}
												placeholder="Enter internal name (e.g., super_admin)"
												className="w-full p-2 border rounded-md"
												disabled={isEditMode} // Don't allow editing name for existing roles
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Title/Display Name
											</label>
											<input
												type="text"
												value={roleData.title}
												onChange={(e) =>
													setRoleData({ ...roleData, title: e.target.value })
												}
												placeholder="Enter display name (e.g., Super Admin)"
												className="w-full p-2 border rounded-md"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Description or purpose
											</label>
											<textarea
												value={roleData.description}
												onChange={(e) =>
													setRoleData({
														...roleData,
														description: e.target.value,
													})
												}
												placeholder="Please provide a brief description of the role..."
												className="w-full p-2 border rounded-md h-24"
											/>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Step 2: Set Permissions */}
						{currentStep === 2 && (
							<div className="space-y-6">
								<div className="p-4 border rounded-lg shadow-sm bg-[#F6F8FA]">
									<h3 className="font-medium mb-3">Set Permissions</h3>
									<p className="text-sm text-gray-500 mb-3">
										Modify what individuals on the role can do
									</p>
									<div className="bg-white p-3 shadow-lg rounded-lg">
										<h4 className="font-medium mb-2 text-xs text-gray-500">
											PERMISSIONS
										</h4>
										<div className="space-y-3">
											{allPermissions.map((permission) => (
												<div
													key={permission}
													className="flex flex-row justify-between items-center space-x-2 border-b pb-2">
													<label
														htmlFor={permission}
														className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
														{permission}
													</label>

													<Checkbox
														id={permission}
														checked={roleData.permission.includes(permission)}
														onCheckedChange={(checked) =>
															handlePermissionChange(
																permission,
																checked as boolean
															)
														}
													/>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Step 3: Review Details */}
						{currentStep === 3 && (
							<div className="space-y-6">
								<div className="p-4 border rounded-lg shadow-sm bg-[#F6F8FA]">
									<h3 className="font-medium mb-3">Basic Details</h3>
									<div className="space-y-2 bg-white p-3 shadow-lg rounded-lg">
										<div>
											<p className="text-sm text-gray-500">
												Name (Internal ID)
											</p>
											<p className="font-medium">{roleData.name}</p>
										</div>
										<div>
											<p className="text-sm text-gray-500">Display Title</p>
											<p className="font-medium">{roleData.title}</p>
										</div>
										<div>
											<p className="text-sm text-gray-500">Description</p>
											<p className="font-medium">{roleData.description}</p>
										</div>
									</div>
								</div>

								<div className="p-4 border rounded-lg shadow-sm bg-[#F6F8FA]">
									<h3 className="font-medium mb-3">Permissions</h3>
									<div className="space-y-2 bg-white rounded-lg p-3 shadow-lg">
										{roleData.permission.length > 0 ? (
											roleData.permission.map((permission) => (
												<p key={permission} className="font-medium">
													{permission}
												</p>
											))
										) : (
											<p className="text-sm text-gray-500">
												No permissions selected
											</p>
										)}
									</div>
								</div>
							</div>
						)}

						{/* Navigation buttons */}
						<div className="flex justify-end mt-6 gap-3">
							<button
								onClick={handlePrevStep}
								disabled={currentStep === 1}
								className={`px-4 py-2 rounded-md ${
									currentStep === 1
										? "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
										: "bg-white text-gray-700 hover:bg-gray-300 border border-gray-300"
								}`}>
								Back
							</button>
							<button
								onClick={handleNextStep}
								className="px-4 py-2 bg-secondary-1 text-dark-1 rounded-md hover:bg-primary-dark">
								{currentStep === 3
									? isEditMode
										? "Update Role"
										: "Create Role"
									: "Next"}
							</button>
						</div>
					</div>
				</div>
			)}
			<div>
				<p className="text-sm text-[#6C7278] font-normal border-y py-2">
					Manage default roles, edit permissions, and create new roles with
					custom access.
				</p>
			</div>

			{isLoading ? (
				<div className="flex justify-center items-center py-8">
					<p>Loading roles...</p>
				</div>
			) : (
				<div className="flex flex-row flex-wrap justify-start items-center gap-3 w-full">
					<button
						onClick={() => {
							setIsModalOpen(true);
							setIsEditMode(false);
							setRoleData({
								name: "",
								title: "",
								description: "",
								permission: [],
							});
						}}
						className="flex flex-col gap-3 justify-start items-start bg-[#F6F8FA] p-3 border border-secondary-1 rounded-lg border-dashed w-full sm:w-[24%]">
						<IconCirclePlus color="#2fe0a8" />

						<p className="text-dark-1 text-sm text-left">Add new role</p>

						<p className="text-xs text-[#6B7280] text-left">
							Adjust permission for this role.
						</p>
					</button>

					{roles.map((role) => (
						<div
							key={role._id}
							className="flex flex-col gap-3 justify-start items-start bg-white p-3 border-[3px] shadow-lg shadow-[#2F30370D] rounded-lg w-full sm:w-[24%]">
							<div className="flex flex-row justify-between items-center w-full">
								<div>
									{role.name === "super" ? (
										<IconShieldBolt color="#6B7280" />
									) : (
										<IconUserBolt color="#6B7280" />
									)}
								</div>
								<div className="flex gap-2">
									<IconEdit
										color="#6B7280"
										className="cursor-pointer"
										onClick={() => openEditModal(role)}
									/>
									{role.name !== "super" && ( // Don't allow deleting super admin role
										<IconX
											color="#6B7280"
											className="cursor-pointer"
											onClick={() => deleteRole(role.name)}
										/>
									)}
								</div>
							</div>
							<p className="text-dark-1 text-sm text-left">
								{role.title}{" "}
								<span className="text-xs text-[#6B7280] text-left">
									({role.count || 0})
								</span>
							</p>
							<p className="text-xs text-[#6B7280] text-left">
								{role.permission.includes("*")
									? "Full access to all modules"
									: `Access to ${role.permission.length} permissions`}
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default Roles;
