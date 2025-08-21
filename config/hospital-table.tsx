"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	RowSelectionState,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import Modal from "@/components/Modal";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	IconFileExport,
	IconPlus,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import axios from "axios";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { getSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

interface ApiResponse {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	picture: string | null;
	staff_code: string;
	role: string;
	is_active: boolean;
	last_logged_in: string | null;
	created_at: string;
	updated_at: string;
	status?: string;
}

interface HealthProviderFormData {
	// Step 1
	image: File | null;
	imagePreview: string | null;
	healthProviderName: string;
	providerType: "hospital" | "laboratory";
	specialization: string;
	description: string;
	officeEmail: string;
	services: string[];
	addresses: Array<{
		street: string;
		city: string;
		state: string;
		country: string;
	}>;

	// Step 2
	consultationFee: string;
	coverages: string[];
	licenseNumber: string;
	accreditationBody: string;
	expiryDate: string;
	certificationNumber: string;
	certificate: File | null;
	certificatePreview: string | null;
}

export function HospitalDataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [selectedStatus, setSelectedStatus] = useState<string>("View All");
	const [globalFilter, setGlobalFilter] = useState("");
	const [isModalOpen, setModalOpen] = useState(false);
	const [tableData, setTableData] = useState<TData[]>(data);
	const [currentStep, setCurrentStep] = useState(1);
	const [serviceSearch, setServiceSearch] = useState("");
	const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
	const [newAddress, setNewAddress] = useState({
		street: "",
		city: "",
		state: "",
		country: "",
	});
	const [coverageInput, setCoverageInput] = useState("");

	const [formData, setFormData] = useState<HealthProviderFormData>({
		image: null,
		imagePreview: null,
		healthProviderName: "",
		providerType: "hospital",
		specialization: "",
		description: "",
		officeEmail: "",
		services: [],
		addresses: [],
		consultationFee: "",
		coverages: [],
		licenseNumber: "",
		accreditationBody: "",
		expiryDate: "",
		certificationNumber: "",
		certificate: null,
		certificatePreview: null,
	});

	const imageInputRef = useRef<HTMLInputElement>(null);
	const certificateInputRef = useRef<HTMLInputElement>(null);

	const openModal = () => setModalOpen(true);
	const closeModal = () => {
		setModalOpen(false);
		setCurrentStep(1);
		setFormData({
			image: null,
			imagePreview: null,
			healthProviderName: "",
			providerType: "hospital",
			specialization: "",
			description: "",
			officeEmail: "",
			services: [],
			addresses: [],
			consultationFee: "",
			coverages: [],
			licenseNumber: "",
			accreditationBody: "",
			expiryDate: "",
			certificationNumber: "",
			certificate: null,
			certificatePreview: null,
		});
		setServiceSearch("");
		setNewAddress({ street: "", city: "", state: "", country: "" });
		setCoverageInput("");
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const preview = URL.createObjectURL(file);
			setFormData({
				...formData,
				image: file,
				imagePreview: preview,
			});
		}
	};

	const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const preview = URL.createObjectURL(file);
			setFormData({
				...formData,
				certificate: file,
				certificatePreview: preview,
			});
		}
	};

	const removeImage = () => {
		if (formData.imagePreview) {
			URL.revokeObjectURL(formData.imagePreview);
		}
		setFormData({
			...formData,
			image: null,
			imagePreview: null,
		});
	};

	const removeCertificate = () => {
		if (formData.certificatePreview) {
			URL.revokeObjectURL(formData.certificatePreview);
		}
		setFormData({
			...formData,
			certificate: null,
			certificatePreview: null,
		});
	};

	const addService = () => {
		if (
			serviceSearch.trim() &&
			!formData.services.includes(serviceSearch.trim())
		) {
			setFormData({
				...formData,
				services: [...formData.services, serviceSearch.trim()],
			});
			setServiceSearch("");
		}
	};

	const removeService = (index: number) => {
		const newServices = [...formData.services];
		newServices.splice(index, 1);
		setFormData({ ...formData, services: newServices });
	};

	const addAddress = () => {
		if (
			newAddress.street &&
			newAddress.city &&
			newAddress.state &&
			newAddress.country
		) {
			setFormData({
				...formData,
				addresses: [...formData.addresses, { ...newAddress }],
			});
			setNewAddress({ street: "", city: "", state: "", country: "" });
		}
	};

	const removeAddress = (index: number) => {
		const newAddresses = [...formData.addresses];
		newAddresses.splice(index, 1);
		setFormData({ ...formData, addresses: newAddresses });
	};

	const addCoverage = () => {
		if (
			coverageInput.trim() &&
			!formData.coverages.includes(coverageInput.trim())
		) {
			setFormData({
				...formData,
				coverages: [...formData.coverages, coverageInput.trim()],
			});
			setCoverageInput("");
		}
	};

	const removeCoverage = (index: number) => {
		const newCoverages = [...formData.coverages];
		newCoverages.splice(index, 1);
		setFormData({ ...formData, coverages: newCoverages });
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleNextStep = () => {
		setCurrentStep(2);
	};

	const handlePreviousStep = () => {
		setCurrentStep(1);
	};

	const handleSubmit = () => {
		// Implement form submission logic here
		console.log("Form data:", formData);
		toast.success("Health provider added successfully!");
		closeModal();
	};

	const handleReset = () => {
		setFormData({
			image: null,
			imagePreview: null,
			healthProviderName: "",
			providerType: "hospital",
			specialization: "",
			description: "",
			officeEmail: "",
			services: [],
			addresses: [],
			consultationFee: "",
			coverages: [],
			licenseNumber: "",
			accreditationBody: "",
			expiryDate: "",
			certificationNumber: "",
			certificate: null,
			certificatePreview: null,
		});
		setServiceSearch("");
		setNewAddress({ street: "", city: "", state: "", country: "" });
		setCoverageInput("");
	};

	// Sync `tableData` with `data` prop
	useEffect(() => {
		setTableData(data);
	}, [data]);

	// Function to filter data based on date range
	const filterDataByDateRange = () => {
		if (!dateRange?.from || !dateRange?.to) {
			setTableData(data); // Reset to all data
			return;
		}

		const filteredData = data.filter((farmer: any) => {
			const dateJoined = new Date(farmer.date);
			return dateJoined >= dateRange.from! && dateJoined <= dateRange.to!;
		});

		setTableData(filteredData);
	};

	useEffect(() => {
		filterDataByDateRange();
	}, [dateRange]);

	const handleStatusFilter = (status: string) => {
		setSelectedStatus(status);

		if (status === "View All") {
			setTableData(data); // Reset to all data
		} else {
			const filteredData = data?.filter(
				(farmer) =>
					(farmer as any)?.status?.toLowerCase() === status.toLowerCase()
			);

			setTableData(filteredData as TData[]);
		}
	};

	const handleExport = () => {
		// Convert the table data to a worksheet
		const worksheet = XLSX.utils.json_to_sheet(tableData);

		// Create a new workbook and add the worksheet
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Farmers");

		// Generate a binary string from the workbook
		const binaryString = XLSX.write(workbook, {
			bookType: "xlsx",
			type: "binary",
		});

		// Convert the binary string to a Blob
		const blob = new Blob([s2ab(binaryString)], {
			type: "application/octet-stream",
		});

		// Create a link element and trigger the download
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "staffs.xlsx";
		link.click();

		// Clean up
		URL.revokeObjectURL(url);
	};

	// Utility function to convert string to ArrayBuffer
	const s2ab = (s: string) => {
		const buf = new ArrayBuffer(s.length);
		const view = new Uint8Array(buf);
		for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
		return buf;
	};

	const bulkDeleteStaff = async () => {
		try {
			const session = await getSession();
			const accessToken = session?.accessToken;

			if (!accessToken) {
				console.error("No access token found.");
				toast.error("No access token found. Please log in again.");
				return;
			}

			const selectedIds = Object.keys(rowSelection).map(
				(index) => (tableData[parseInt(index)] as any)?.id
			);

			if (selectedIds.length === 0) {
				toast.warn("No staff selected for deletion.");
				return;
			}

			console.log("Selected IDs for deletion:", selectedIds);

			const response = await axios.delete(
				"https://api.wowdev.com.ng/api/v1/user/bulk/delete",
				{
					data: { user_ids: selectedIds }, // Ensure this matches the API's expected payload
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.status === 200) {
				toast.success("Selected staff deleted successfully!");

				// Update the table data by filtering out the deleted staff
				setTableData((prevData) =>
					prevData.filter((staff) => !selectedIds.includes((staff as any).id))
				);

				// Clear the selection
				setRowSelection({});
			}
		} catch (error) {
			console.error("Error bulk deleting staff:", error);
			if (axios.isAxiosError(error)) {
				toast.error(
					error.response?.data?.message ||
						"Failed to delete staff. Please try again."
				);
			} else {
				toast.error("An unexpected error occurred. Please try again.");
			}
		}
	};

	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			globalFilter,
		},
	});

	return (
		<div className="rounded-lg border-[1px] py-0">
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				className="modal "
				title={`Add Health Provider ${
					currentStep === 1 ? "(Step 1 of 2)" : "(Step 2 of 2)"
				}`}>
				{currentStep === 1 ? (
					<div className="space-y-4 ">
						<div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
							<div className="bg-white p-4 rounded-lg shadow-sm">
								{/* Column 1: Basic Info */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{/* Column 1 */}
									<div className="space-y-4">
										{/* Image Upload */}
										<div>
											<label className="text-sm font-medium text-gray-700">
												Health Provider Image
											</label>
											<div
												className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer mt-1"
												onClick={() => imageInputRef.current?.click()}>
												{formData.imagePreview ? (
													<div className="relative">
														<img
															src={formData.imagePreview}
															alt="Preview"
															className="w-full h-32 object-cover rounded-md"
														/>
														<button
															type="button"
															className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
															onClick={(e) => {
																e.stopPropagation();
																removeImage();
															}}>
															<IconX size={16} />
														</button>
													</div>
												) : (
													<>
														<div className="text-gray-400 mb-2">
															<IconPlus size={24} className="mx-auto" />
														</div>
														<p className="text-sm text-gray-500">
															Click to upload image
														</p>
														<p className="text-xs text-gray-400">
															JPEG, PNG (max 10MB)
														</p>
													</>
												)}
												<input
													type="file"
													ref={imageInputRef}
													className="hidden"
													onChange={handleImageUpload}
													accept="image/jpeg,image/png"
												/>
											</div>
										</div>

										{/* Health Provider Name */}
										<div>
											<label className="text-sm font-medium text-gray-700">
												Health Provider Name
											</label>
											<Input
												name="healthProviderName"
												value={formData.healthProviderName}
												onChange={handleInputChange}
												placeholder="Enter health provider name"
												className="mt-1"
											/>
										</div>

										{/* Provider Type */}
										<div>
											<label className="text-sm font-medium text-gray-700">
												Provider Type
											</label>
											<RadioGroup
												value={formData.providerType}
												onValueChange={(value: "hospital" | "laboratory") =>
													setFormData({ ...formData, providerType: value })
												}
												className="flex space-x-4 mt-1">
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="hospital" id="hospital" />
													<label htmlFor="hospital" className="text-sm">
														Hospital
													</label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="laboratory" id="laboratory" />
													<label htmlFor="laboratory" className="text-sm">
														Laboratory
													</label>
												</div>
											</RadioGroup>
										</div>

										{/* Specialization */}
										<div>
											<label className="text-sm font-medium text-gray-700">
												Specialization
											</label>
											<Input
												name="specialization"
												value={formData.specialization}
												onChange={handleInputChange}
												placeholder="Enter specialization"
												className="mt-1"
											/>
										</div>

										{/* Description */}
										<div>
											<label className="text-sm font-medium text-gray-700">
												Description
											</label>
											<Textarea
												name="description"
												value={formData.description}
												onChange={handleInputChange}
												placeholder="Enter description"
												className="mt-1"
												rows={3}
											/>
										</div>

										{/* Office Email */}
										<div>
											<label className="text-sm font-medium text-gray-700">
												Office Email Address
											</label>
											<Input
												name="officeEmail"
												type="email"
												value={formData.officeEmail}
												onChange={handleInputChange}
												placeholder="Enter office email"
												className="mt-1"
											/>
										</div>
									</div>

									{/* Column 2: Services */}
									<div className="space-y-4">
										<label className="text-sm font-medium text-gray-700">
											Services
										</label>
										<div className="flex space-x-2">
											<Input
												value={serviceSearch}
												onChange={(e) => setServiceSearch(e.target.value)}
												placeholder="Search and add services"
												className="flex-1"
											/>
											<Button type="button" onClick={addService}>
												Add
											</Button>
										</div>
										<div className="space-y-2">
											{formData.services.map((service, index) => (
												<div
													key={index}
													className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
													<span className="text-sm">{service}</span>
													<button
														type="button"
														onClick={() => removeService(index)}
														className="text-red-500 hover:text-red-700">
														<IconX size={16} />
													</button>
												</div>
											))}
										</div>
									</div>

									{/* Column 3: Address */}
									<div className="space-y-4">
										<label className="text-sm font-medium text-gray-700">
											Address
										</label>
										<div className="grid grid-cols-1 gap-2">
											<Input
												placeholder="Street"
												value={newAddress.street}
												onChange={(e) =>
													setNewAddress({
														...newAddress,
														street: e.target.value,
													})
												}
											/>
											<Input
												placeholder="City/LGA"
												value={newAddress.city}
												onChange={(e) =>
													setNewAddress({ ...newAddress, city: e.target.value })
												}
											/>
											<Input
												placeholder="State"
												value={newAddress.state}
												onChange={(e) =>
													setNewAddress({
														...newAddress,
														state: e.target.value,
													})
												}
											/>
											<Input
												placeholder="Country"
												value={newAddress.country}
												onChange={(e) =>
													setNewAddress({
														...newAddress,
														country: e.target.value,
													})
												}
											/>
											<Button type="button" onClick={addAddress}>
												Add Address
											</Button>
										</div>
										<div className="space-y-2">
											{formData.addresses.map((address, index) => (
												<div
													key={index}
													className="bg-gray-100 p-3 rounded relative">
													<button
														type="button"
														onClick={() => removeAddress(index)}
														className="absolute top-2 right-2 text-red-500 hover:text-red-700">
														<IconX size={16} />
													</button>
													<p className="text-sm">
														<strong>Street:</strong> {address.street}
													</p>
													<p className="text-sm">
														<strong>City:</strong> {address.city}
													</p>
													<p className="text-sm">
														<strong>State:</strong> {address.state}
													</p>
													<p className="text-sm">
														<strong>Country:</strong> {address.country}
													</p>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="flex justify-end pt-4 gap-3">
							<Button type="button" variant="outline" onClick={handleReset}>
								Reset
							</Button>
							<Button onClick={handleNextStep} className="bg-secondary-1">
								Next
							</Button>
						</div>
					</div>
				) : (
					<div className="space-y-4">
						<div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
							<div className="bg-white p-4 rounded-lg shadow-sm">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Column 1: Consultation Details */}
									<div className="space-y-4">
										<h3 className="font-medium text-gray-700">
											Consultation Details
										</h3>

										<div>
											<label className="text-sm font-medium text-gray-700">
												Consultation Fee
											</label>
											<Input
												name="consultationFee"
												type="number"
												value={formData.consultationFee}
												onChange={handleInputChange}
												placeholder="Enter consultation fee"
												className="mt-1"
											/>
										</div>

										<div>
											<label className="text-sm font-medium text-gray-700">
												Coverage
											</label>
											<div className="flex space-x-2 mt-1">
												<Input
													value={coverageInput}
													onChange={(e) => setCoverageInput(e.target.value)}
													placeholder="Enter coverage"
												/>
												<Button type="button" onClick={addCoverage}>
													Add
												</Button>
											</div>
											<div className="space-y-2 mt-2">
												{formData.coverages.map((coverage, index) => (
													<div
														key={index}
														className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
														<span className="text-sm">{coverage}</span>
														<button
															type="button"
															onClick={() => removeCoverage(index)}
															className="text-red-500 hover:text-red-700">
															<IconX size={16} />
														</button>
													</div>
												))}
											</div>
										</div>
									</div>

									{/* Column 2: Accreditation & License */}
									<div className="space-y-4">
										<h3 className="font-medium text-gray-700">
											Accreditation & License
										</h3>

										<div>
											<label className="text-sm font-medium text-gray-700">
												License Number
											</label>
											<Input
												name="licenseNumber"
												value={formData.licenseNumber}
												onChange={handleInputChange}
												placeholder="Enter license number"
												className="mt-1"
											/>
										</div>

										<div>
											<label className="text-sm font-medium text-gray-700">
												Accreditation Body
											</label>
											<Input
												name="accreditationBody"
												value={formData.accreditationBody}
												onChange={handleInputChange}
												placeholder="Enter accreditation body"
												className="mt-1"
											/>
										</div>

										<div>
											<label className="text-sm font-medium text-gray-700">
												Expiry Date
											</label>
											<Input
												name="expiryDate"
												type="date"
												value={formData.expiryDate}
												onChange={handleInputChange}
												className="mt-1"
											/>
										</div>

										<div>
											<label className="text-sm font-medium text-gray-700">
												Certification Number
											</label>
											<Input
												name="certificationNumber"
												value={formData.certificationNumber}
												onChange={handleInputChange}
												placeholder="Enter certification number"
												className="mt-1"
											/>
										</div>

										<div>
											<label className="text-sm font-medium text-gray-700">
												Certificate
											</label>
											<div
												className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer mt-1"
												onClick={() => certificateInputRef.current?.click()}>
												{formData.certificatePreview ? (
													<div className="relative">
														<div className="flex items-center justify-center bg-gray-100 w-full h-32 rounded-md">
															<span className="text-sm">
																Certificate uploaded
															</span>
														</div>
														<button
															type="button"
															className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
															onClick={(e) => {
																e.stopPropagation();
																removeCertificate();
															}}>
															<IconX size={16} />
														</button>
													</div>
												) : (
													<>
														<div className="text-gray-400 mb-2">
															<IconPlus size={24} className="mx-auto" />
														</div>
														<p className="text-sm text-gray-500">
															Click to upload certificate
														</p>
														<p className="text-xs text-gray-400">
															PDF, DOC (max 10MB)
														</p>
													</>
												)}
												<input
													type="file"
													ref={certificateInputRef}
													className="hidden"
													onChange={handleCertificateUpload}
													accept=".pdf,.doc,.docx"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="flex justify-end gap-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={handlePreviousStep}>
								Back
							</Button>
							<Button onClick={handleSubmit} className="bg-secondary-1">
								Submit
							</Button>
						</div>
					</div>
				)}
			</Modal>

			{/* Rest of the component remains the same */}
			<div className="p-3 flex flex-row justify-between border-b-[1px] border-[#E2E4E9] bg-white items-center gap-20 max-w-full rounded-lg">
				<div className="flex flex-row justify-start bg-white items-center rounded-lg mx-auto special-btn-farmer pr-2">
					{["View All", "Active", "Inactive"].map((status, index, arr) => (
						<p
							key={status}
							className={`px-4 py-2 text-center text-sm cursor-pointer border border-[#E2E4E9] overflow-hidden ${
								selectedStatus === status
									? "bg-primary-5 text-dark-1"
									: "text-dark-1"
							} 
			${index === 0 ? "rounded-l-lg firstRound" : ""} 
			${index === arr.length - 1 ? "rounded-r-lg lastRound" : ""}`}
							onClick={() => handleStatusFilter(status)}>
							{status}
						</p>
					))}
				</div>
				<div className="p-3 flex flex-row justify-end items-center gap-3 w-full ">
					<Button
						className="border-[#E8E8E8] border-[1px] bg-white"
						onClick={bulkDeleteStaff}>
						<IconTrash /> Delete
					</Button>
					<Button
						className="border-[#E8E8E8] border-[1px] bg-white"
						onClick={handleExport}>
						<IconFileExport /> Export Data
					</Button>
					<div className="w-[250px]">
						<DateRangePicker dateRange={dateRange} onSelect={setDateRange} />
					</div>
					<Button
						className="bg-secondary-1 border-[1px] border-[#173C3D] text-primary-1 font-inter cborder"
						onClick={openModal}>
						<IconPlus /> Add Health Provider
					</Button>
				</div>
			</div>

			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="bg-primary-3">
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id} className="bg-primary-3 text-xs">
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody className="bg-white">
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-left text-xs text-primary-6">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<div className="flex items-center justify-between bg-white rounded-lg py-3 px-2 border-t-[1px] border-gray-300 mt-2">
				<div className="flex-1 text-xs text-primary-6 text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="flex items-center space-x-10 lg:space-x-10 gap-3">
					<div className="flex items-center space-x-4 gap-2">
						<p className="text-xs text-primary-6 font-medium">Rows per page</p>
						<Select
							value={`${table.getState().pagination.pageSize}`}
							onValueChange={(value) => {
								table.setPageSize(Number(value));
							}}>
							<SelectTrigger className="h-8 w-[70px] bg-white z-10">
								<SelectValue
									placeholder={table.getState().pagination.pageSize}
								/>
							</SelectTrigger>
							<SelectContent side="top" className="bg-white">
								{[5, 10, 20, 30, 40, 50].map((pageSize) => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex w-[100px] items-center justify-center font-medium text-xs text-primary-6">
						{table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()} pages
					</div>
					<div className="flex items-center space-x-5 gap-2">
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}>
							<span className="sr-only">Go to first page</span>
							<ChevronsLeft />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}>
							<span className="sr-only">Go to previous page</span>
							<ChevronLeft />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}>
							<span className="sr-only">Go to next page</span>
							<ChevronRight />
						</Button>
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}>
							<span className="sr-only">Go to last page</span>
							<ChevronsRight />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
