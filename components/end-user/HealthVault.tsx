import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";

const HealthVault = () => {
	const vaultSections = [
		{
			id: "medical-records",
			name: "Medical Records",
			icon: (
				<img
					src="/images/fold.png"
					alt="Medical Records"
					className="w-10 h-10 object-contain"
				/>
			),
			files: [
				{
					id: "1",
					name: "Annual Checkup Report",
					type: "pdf",
					date: "2025-06-15",
					size: "2.4MB",
					preview: "/placeholder-medical.jpg",
				},
				{
					id: "2",
					name: "Blood Test Results",
					type: "pdf",
					date: "2025-05-22",
					size: "1.8MB",
					preview: "/placeholder-blood.jpg",
				},
			],
		},
		{
			id: "prescriptions",
			name: "Prescriptions",
			icon: (
				<img
					src="/images/fold2.png"
					alt="Medical Records"
					className="w-10 h-10 object-contain"
				/>
			),
			files: [
				{
					id: "3",
					name: "Antibiotics Prescription",
					type: "pdf",
					date: "2025-07-10",
					size: "1.2MB",
					preview: "/placeholder-prescription.jpg",
				},
			],
		},
		{
			id: "scans",
			name: "Scans & Imaging",
			icon: (
				<img
					src="/images/fold3.png"
					alt="Medical Records"
					className="w-10 h-10 object-contain"
				/>
			),
			files: [
				{
					id: "4",
					name: "X-Ray Scan",
					type: "jpg",
					date: "2025-04-05",
					size: "3.5MB",
					preview: "/placeholder-xray.jpg",
				},
				{
					id: "5",
					name: "MRI Results",
					type: "pdf",
					date: "2025-03-18",
					size: "4.2MB",
					preview: "/placeholder-mri.jpg",
				},
			],
		},
		{
			id: "diagnosis",
			name: "Diagnosis",
			icon: (
				<img
					src="/images/fold4.png"
					alt="Medical Records"
					className="w-10 h-10 object-contain"
				/>
			),
			files: [
				{
					id: "6",
					name: "Health Insurance Policy",
					type: "pdf",
					date: "2025-01-10",
					size: "5.1MB",
					preview: "/placeholder-insurance.jpg",
				},
				{
					id: "7",
					name: "Diagnosis Report",
					type: "pdf",
					date: "2025-01-10",
					size: "5.1MB",
					preview: "/placeholder-insurance.jpg",
				},
				{
					id: "8",
					name: "Lab Results",
					type: "pdf",
					date: "2025-01-10",
					size: "5.1MB",
					preview: "/placeholder-insurance.jpg",
				},
			],
		},
		{
			id: "immunization",
			name: "Immunization Records",
			icon: (
				<img
					src="/images/fold3.png"
					alt="Medical Records"
					className="w-10 h-10 object-contain"
				/>
			),
			files: [
				{
					id: "6",
					name: "Immunization Certificate",
					type: "pdf",
					date: "2025-01-10",
					size: "5.1MB",
					preview: "/placeholder-insurance.jpg",
				},
			],
		},
		{
			id: "chronic",
			name: "Chronic Diseases",
			icon: (
				<img
					src="/images/fold4.png"
					alt="Medical Records"
					className="w-10 h-10 object-contain"
				/>
			),
			files: [
				{
					id: "6",
					name: "Chronic Disease Management Plan",
					type: "pdf",
					date: "2025-01-10",
					size: "5.1MB",
					preview: "/placeholder-insurance.jpg",
				},
			],
		},
		{
			id: "surgical",
			name: "Surgical & Hospitalization",
			icon: (
				<img
					src="/images/fold.png"
					alt="Medical Records"
					className="w-10 h-10 object-contain"
				/>
			),
			files: [
				{
					id: "6",
					name: "Surgical Report",
					type: "pdf",
					date: "2025-01-10",
					size: "5.1MB",
					preview: "/placeholder-insurance.jpg",
				},
			],
		},
		{
			id: "fitness",
			name: "Fitness & Wellness",
			icon: (
				<img
					src="/images/fold2.png"
					alt="Medical Records"
					className="w-10 h-10 object-contain"
				/>
			),
			files: [
				{
					id: "6",
					name: "Fitness Assessment",
					type: "pdf",
					date: "2025-01-10",
					size: "5.1MB",
					preview: "/placeholder-insurance.jpg",
				},
			],
		},
		{
			id: "insurance",
			name: "Insurance & Admins",
			icon: (
				<img
					src="/images/fold3.png"
					alt="Medical Records"
					className="w-10 h-10 object-contain"
				/>
			),
			files: [
				{
					id: "6",
					name: "Health Insurance Policy",
					type: "pdf",
					date: "2025-01-10",
					size: "5.1MB",
					preview: "/placeholder-insurance.jpg",
				},
			],
		},
		{
			id: "others",
			name: "Others",
			icon: (
				<img
					src="/images/fold4.png"
					alt="Medical Records"
					className="w-10 h-10 object-contain"
				/>
			),
			files: [
				{
					id: "6",
					name: "Other Medical Records",
					type: "pdf",
					date: "2025-01-10",
					size: "5.1MB",
					preview: "/placeholder-insurance.jpg",
				},
			],
		},
	];

	return (
		<div className="flex h-full min-h-[600px] w-full">
			<Tabs defaultValue="medical-records" className="flex w-full gap-6">
				{/* Vertical Tabs List - Left Side (30% width) */}
				<TabsList className="flex flex-col h-full w-[30%] p-2 bg-gray-50 border rounded-lg shadow-lg justify-start ">
					<div className="flex flex-col gap-2 py-4">
						<p className="font-normal text-left">Health Vault</p>
						<p className="text-sm text-gray-500 text-left">
							Securely store and manage personal health records
						</p>
					</div>
					<div className="bg-white p-3 shadow-lg rounded-lg">
						{vaultSections.map((section) => (
							<TabsTrigger
								key={section.id}
								value={section.id}
								className="w-full justify-start px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg border mt-3">
								<div className="flex items-center w-full">
									<div className="mr-3 text-blue-500">{section.icon}</div>
									<span className="flex-1 text-left font-medium">
										{section.name}
									</span>
									<IconArrowRight className="w-4 h-4 ml-2 text-gray-400" />
								</div>
							</TabsTrigger>
						))}
					</div>
				</TabsList>

				{/* Tab Content - Right Side (70% width) */}
				<div className="w-[70%]">
					{vaultSections.map((section) => (
						<TabsContent key={section.id} value={section.id} className="h-full">
							<Card className="h-full p-6 shadow-sm">
								<h2 className="text-xl font-semibold mb-6">{section.name}</h2>

								<div className="space-y-4">
									{section.files.map((file) => (
										<Card
											key={file.id}
											className="p-4 flex items-center shadow">
											{/* File Preview */}
											<div className="w-12 h-12  rounded-md flex items-center justify-center mr-4 overflow-hidden">
												{file.type === "pdf" ? (
													<Image
														src="/images/pdfs.png"
														alt="PDF Icon"
														width={40}
														height={40}
													/>
												) : (
													<Image
														src="/images/pdfs.png"
														alt="PDF Icon"
														width={40}
														height={40}
													/>
												)}
											</div>

											{/* File Info */}
											<div className="flex-1">
												<h3 className="font-medium text-gray-800">
													{file.name}
												</h3>
												<div className="flex text-sm text-gray-500 mt-1">
													<span>{file.date}</span>
													<span className="mx-2">•</span>
													<span>{file.size}</span>
												</div>
											</div>
										</Card>
									))}
								</div>
							</Card>
						</TabsContent>
					))}
				</div>
			</Tabs>
		</div>
	);
};

export default HealthVault;
