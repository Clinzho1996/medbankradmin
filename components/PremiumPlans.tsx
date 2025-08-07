"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PaystackButton } from "react-paystack";

interface Plan {
	name: string;
	price: number;
	duration: string;
}

interface UserData {
	users: {
		email: string;
		subscription_plan_id?: string;
	};
}

interface SubscriptionPlan {
	id: string;
	subscription_plan_name: string;
	subscription_plan_amount: string;
}

interface PaystackResponse {
	reference: string;
	[key: string]: unknown;
}

export default function PremiumPlans() {
	const [checked, setChecked] = useState<string>("yearly");
	const [userData, setUserData] = useState<UserData | null>(null);
	const [plans, setPlans] = useState<Record<string, Plan>>({
		yearly: { name: "Yearly", price: 0, duration: "year" },
		quarterly: { name: "Quarterly", price: 0, duration: "quarter" },
		monthly: { name: "Monthly", price: 0, duration: "month" },
	});
	const router = useRouter();

	const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

	const selectedPlan = plans[checked];

	const handlePaymentSuccess = async (response: PaystackResponse) => {
		alert(`Payment Successful\nTransaction Ref: ${response.reference}`);

		try {
			localStorage.setItem("reference", response.reference);
			await formSubmit();
		} catch {
			alert("Failed to save transaction reference.");
		}
	};

	const formSubmit = async () => {
		try {
			const session = await getSession();

			if (!session?.accessToken) {
				console.error("No access token found.");
				return;
			}

			const ref = localStorage.getItem("reference");
			const subId = localStorage.getItem("subIdPremium");

			if (!ref || !subId) {
				throw new Error("Missing required data");
			}

			const { data } = await axios.post(
				"https://api.kuditrak.ng/api/v1/subscription",
				{
					ref,
					duration: selectedPlan.duration,
					amount: selectedPlan.price,
					subscription_plan_id: subId,
				},
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${session.accessToken}`,
					},
				}
			);

			if (data.status === "success") {
				alert("Premium plan updated successfully");
				router.push("/");
			} else {
				alert(data.message || "Subscription failed");
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);
			} else {
				alert("An unknown error occurred");
			}
		}
	};

	const fetchUserData = async () => {
		try {
			const session = await getSession();

			if (!session?.accessToken) {
				console.error("No access token found.");
				return;
			}

			const response = await axios.get("https://api.kuditrak.ng/api/v1/user", {
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${session.accessToken}`,
					redirect: "follow",
				},
			});

			if (response.status === 401) {
				throw new Error("Unauthorized. Please log in again.");
			}

			setUserData(response.data.data);
			localStorage.setItem(
				"userData",
				response.data.data.users.subscription_plan_id || ""
			);
		} catch (error: unknown) {
			console.error(
				"Error fetching user data:",
				error instanceof Error ? error.message : "Unknown error"
			);
		}
	};

	const fetchSubscriptionPlans = async () => {
		try {
			const session = await getSession();

			if (!session?.accessToken) {
				console.error("No access token found.");
				return;
			}

			const response = await axios.get(
				"https://api.kuditrak.ng/api/v1/subscription-plans",
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${session.accessToken}`,
						redirect: "follow",
					},
				}
			);

			if (response.data.status === "success") {
				localStorage.setItem("subIdPremium", response.data.data[1].id);

				const premiumPlan = response.data.data.find(
					(plan: SubscriptionPlan) => plan.subscription_plan_name === "Premium"
				);

				if (premiumPlan) {
					const monthlyAmount = parseFloat(
						premiumPlan.subscription_plan_amount
					);
					setPlans({
						monthly: {
							name: "Monthly",
							price: monthlyAmount,
							duration: "month",
						},
						quarterly: {
							name: "Quarterly",
							price: monthlyAmount * 2.8,
							duration: "quarter",
						},
						yearly: {
							name: "Yearly",
							price: monthlyAmount * 10.3,
							duration: "year",
						},
					});
				}
			}
		} catch (error) {
			console.error("Error fetching subscription plans:", error);
		}
	};

	useEffect(() => {
		fetchUserData();
		fetchSubscriptionPlans();
	}, []);

	const paystackConfig = {
		reference: new Date().getTime().toString(),
		email: userData?.users.email || "",
		amount: selectedPlan.price * 100,
		publicKey: PAYSTACK_PUBLIC_KEY,
		text: "Upgrade Now",
		onSuccess: handlePaymentSuccess,
		onClose: () => alert("Payment canceled"),
	};

	return (
		<div className="bg-white h-fit border border-gray-200 rounded-lg w-full">
			<div className="container mx-auto px-4 py-8">
				{/* Subscription Options */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-6">
					<div className="flex flex-col gap-3 mb-6">
						<p className="text-[#0A0D14] text-[16px] font-semibold">
							Premium Plan
						</p>
						<Image
							src="/images/rule.png"
							alt="premium plan"
							width={300}
							height={100}
							className="w-full object-contain"
						/>
					</div>
					<RadioGroup defaultValue={checked} onValueChange={setChecked}>
						{Object.entries(plans).map(([key, plan]) => (
							<div
								key={key}
								className="flex items-center space-x-4 p-4 border rounded-lg mb-3">
								<RadioGroupItem value={key} id={key} />
								<Label htmlFor={key} className="flex-1">
									<div className="flex justify-between items-center w-full">
										<span className="font-bold">{plan.name}</span>
										<span>
											₦{plan.price.toFixed(2)}/{plan.duration}
										</span>
									</div>
								</Label>
							</div>
						))}
					</RadioGroup>
				</div>

				{/* What&apos;s Included */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						What&apos;s included
					</h3>
					<div className="space-y-4">
						<div className="flex items-start gap-3">
							<CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
							<p className="text-gray-600">Connect up to 10 accounts</p>
						</div>
						<div className="flex items-start gap-3">
							<CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
							<p className="text-gray-600">
								Create unlimited budgets per month
							</p>
						</div>
					</div>
				</div>

				{/* Upgrade Button */}
				<PaystackButton
					{...paystackConfig}
					className="w-full bg-[#173634] text-white py-3 rounded-lg font-bold text-center block">
					Upgrade Now
				</PaystackButton>

				{/* Note */}
				<p className="text-gray-500 text-sm text-center mt-6 px-4">
					<span className="font-bold">Note:</span> Our payments are recurring.
					To cancel, simply terminate your subscription before the next charge
					is applied.
				</p>
			</div>
		</div>
	);
}
