"use client";

import {
	IconCirclePlus,
	IconEdit,
	IconShieldBolt,
	IconUserBolt,
	IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";

function Roles() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);
	const [isEditMode, setIsEditMode] = useState(false);
	const [roleData, setRoleData] = useState({
		title: "",
		description: "",
		staffs: [] as string[],
		password: "FGEG23427_@%@=B2EDyyu",
		permissions: [] as string[],
	});
	const [searchInput, setSearchInput] = useState("");

	// Sample staff data
	const allStaffs = [
		"dolapo.d@medbankr.com",
		"stacy.a@medbankr.com",
		"abass.o@medbankr.com",
		"clinton.o@medbankr.com",
		"emma.a@medbankr.com",
	];

	// All available permissions
	const allPermissions = [
		"End User Management",
		"Staff Management",
		"Health Care Provider",
		"Booking Handling",
		"Document & Vault",
		"Support & Operations",
		"Content & Campaign",
		"AI & Symptom Checker",
		"Payment and Finance",
		"Subscription",
		"Analytics & Reporting",
		"Family Account",
		"Audit Trail",
		"Compliance & Legal",
		"System Settings",
	];

	const handleNextStep = () => {
		if (currentStep < 3) {
			setCurrentStep(currentStep + 1);
		} else {
			// Submit logic here
			console.log("Submitting role:", roleData);
			setIsModalOpen(false);
			resetForm();
		}
	};

	const handlePrevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const resetForm = () => {
		setRoleData({
			title: "",
			description: "",
			staffs: [],
			password: generatePassword(),
			permissions: [],
		});
		setCurrentStep(1);
		setIsEditMode(false);
	};

	const generatePassword = () => {
		const chars =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
		let password = "";
		for (let i = 0; i < 12; i++) {
			password += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return password;
	};

	const handleAddStaff = (staff: string) => {
		if (!roleData.staffs.includes(staff)) {
			setRoleData({
				...roleData,
				staffs: [...roleData.staffs, staff],
			});
		}
		setSearchInput("");
	};

	const handleRemoveStaff = (staff: string) => {
		setRoleData({
			...roleData,
			staffs: roleData.staffs.filter((s) => s !== staff),
		});
	};

	const handlePermissionChange = (permission: string, isChecked: boolean) => {
		if (isChecked) {
			setRoleData({
				...roleData,
				permissions: [...roleData.permissions, permission],
			});
		} else {
			setRoleData({
				...roleData,
				permissions: roleData.permissions.filter((p) => p !== permission),
			});
		}
	};

	type RoleType = {
		title: string;
		description?: string;
		staffs?: string[];
		password?: string;
		permissions?: string[];
	};

	const openEditModal = (role: RoleType) => {
		setIsEditMode(true);
		setRoleData({
			title: role.title,
			description: role.description || "",
			staffs: role.staffs || [],
			password: role.password || generatePassword(),
			permissions: role.permissions || [],
		});
		setIsModalOpen(true);
	};

	return (
		<div className="flex flex-col gap-3">
			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg border border-secondary-1 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold">
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
						<div className="flex justify-between mb-6">
							{[1, 2, 3].map((step) => (
								<div
									key={step}
									className={`flex flex-col items-center ${
										currentStep >= step ? "text-primary" : "text-gray-400"
									}`}>
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
												Title/name of Role
											</label>
											<input
												type="text"
												value={roleData.title}
												onChange={(e) =>
													setRoleData({ ...roleData, title: e.target.value })
												}
												placeholder="Enter name of role"
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

								<div className="p-4 border rounded-lg shadow-sm bg-[#F6F8FA]">
									<h3 className="font-medium mb-3">Assign Role to staffs:</h3>
									<div className="space-y-3 bg-white shadow-lg p-3 rounded-lg">
										<input
											type="text"
											value={searchInput}
											onChange={(e) => setSearchInput(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter" && searchInput) {
													handleAddStaff(searchInput);
												}
											}}
											placeholder="Search existing users by name, ID, email and press Enter to add them"
											className="w-full p-2 border rounded-md mb-2"
										/>
										<div className="flex flex-wrap gap-2">
											{roleData.staffs.map((staff) => (
												<div
													key={staff}
													className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
													{staff}
													<button
														onClick={() => handleRemoveStaff(staff)}
														className="ml-2 text-gray-500 hover:text-gray-700">
														<IconX size={16} />
													</button>
												</div>
											))}
										</div>
										<div className="space-y-2">
											{allStaffs
												.filter(
													(staff) =>
														staff.includes(searchInput) &&
														!roleData.staffs.includes(staff)
												)
												.map((staff) => (
													<div
														key={staff}
														className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
														onClick={() => handleAddStaff(staff)}>
														<span>{staff}</span>
														<IconCirclePlus
															size={18}
															className="text-primary"
														/>
													</div>
												))}
										</div>
									</div>
								</div>

								<div className="p-4 border rounded-lg shadow-sm bg-[#F6F8FA]">
									<h3 className="font-medium mb-3">
										Temporary Password (System generate password or manually
										set)
									</h3>
									<input
										type="text"
										value={roleData.password}
										onChange={(e) =>
											setRoleData({ ...roleData, password: e.target.value })
										}
										className="w-full p-2 border focus:border-secondary-1 rounded-md"
									/>
									<button
										onClick={() =>
											setRoleData({
												...roleData,
												password: generatePassword(),
											})
										}
										className="mt-2 text-sm text-secondary-1 hover:underline">
										Generate new password
									</button>
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
											MODULES
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
														checked={roleData.permissions.includes(permission)}
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
											<p className="text-sm text-gray-500">Role Title</p>
											<p className="font-medium">{roleData.title}</p>
										</div>
										<div>
											<p className="text-sm text-gray-500">Description</p>
											<p className="font-medium">{roleData.description}</p>
										</div>
									</div>
								</div>

								<div className="p-4 border rounded-lg shadow-sm bg-[#F6F8FA]">
									<h3 className="font-medium mb-3">Assigned Staff</h3>
									<div className="space-y-2 bg-white p-3 shadow-lg rounded-lg">
										{roleData.staffs.length > 0 ? (
											roleData.staffs.map((staff) => (
												<p key={staff} className="font-medium">
													{staff}
												</p>
											))
										) : (
											<p className="text-sm text-gray-500">No staff assigned</p>
										)}
									</div>
								</div>

								<div className="p-4 border rounded-lg shadow-sm bg-[#F6F8FA]">
									<h3 className="font-medium mb-3">Temporary Password</h3>
									<p className="font-mono bg-white shadow-lg p-2 rounded-lg">
										{roleData.password}
									</p>
								</div>

								<div className="p-4 border rounded-lg shadow-sm bg-[#F6F8FA]">
									<h3 className="font-medium mb-3">Permissions</h3>
									<div className="space-y-2 bg-white rounded-lg p-3 shadow-lg">
										{roleData.permissions.length > 0 ? (
											roleData.permissions.map((permission) => (
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
						<div className="flex justify-between mt-6">
							<button
								onClick={handlePrevStep}
								disabled={currentStep === 1}
								className={`px-4 py-2 rounded-md ${
									currentStep === 1
										? "bg-gray-200 text-gray-500 cursor-not-allowed"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}>
								Back
							</button>
							<button
								onClick={handleNextStep}
								className="px-4 py-2 bg-secondary-1 text-dark-1 rounded-md hover:bg-primary-dark">
								{currentStep === 3
									? isEditMode
										? "Update Role"
										: "Confirm Creation"
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

			<div className="flex flex-row flex-wrap justify-start items-center gap-3 w-full">
				<button
					onClick={() => {
						setIsModalOpen(true);
						setIsEditMode(false);
						setRoleData({
							title: "",
							description: "",
							staffs: [],
							password: generatePassword(),
							permissions: [],
						});
					}}
					className="flex flex-col gap-3 justify-start items-start bg-[#F6F8FA] p-3 border border-secondary-1 rounded-lg border-dashed w-full sm:w-[24%]">
					<IconCirclePlus color="#2fe0a8" />

					<p className="text-dark-1 text-sm text-left">Add new role</p>

					<p className="text-xs text-[#6B7280] text-left">
						Adjust permission for this role.
					</p>
				</button>

				{[
					{ title: "Admin", staffCount: 3 },
					{ title: "User Support Agent", staffCount: 3 },
					{ title: "Operational Manager", staffCount: 3 },
					{ title: "Marketing Manager", staffCount: 3 },
					{ title: "Legal Team", staffCount: 3 },
					{ title: "Content & AI Manager", staffCount: 3 },
					{ title: "Customer Support", staffCount: 3 },
				].map((role, index) => (
					<div
						key={index}
						className="flex flex-col gap-3 justify-start items-start bg-white p-3 border-[3px] shadow-lg shadow-[#2F30370D] rounded-lg w-full sm:w-[24%]">
						<div className="flex flex-row justify-between items-center w-full">
							<div>
								{role.title === "Admin" ? (
									<IconShieldBolt color="#6B7280" />
								) : (
									<IconUserBolt color="#6B7280" />
								)}
							</div>
							<div>
								<IconEdit
									color="#6B7280"
									className="cursor-pointer"
									onClick={() => openEditModal(role)}
								/>
							</div>
						</div>
						<p className="text-dark-1 text-sm text-left">
							{role.title}{" "}
							<span className="text-xs text-[#6B7280] text-left">
								({role.staffCount})
							</span>
						</p>
						<p className="text-xs text-[#6B7280] text-left">
							Limited access to some modules
						</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default Roles;
