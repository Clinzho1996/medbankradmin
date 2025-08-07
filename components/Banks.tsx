import { IconAlertCircle } from "@tabler/icons-react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define TypeScript interfaces
interface BankAccount {
	mono_account_id: string;
	institution: {
		bank_code: string;
		name: string;
	};
	name: string;
	account_number: string;
	balance: number;
}

interface UserData {
	users: {
		first_name: string;
		last_name: string;
		email: string;
		subscription_plan?: {
			subscription_plan_name: string;
		};
	};
}

interface BankLogoCode {
	[key: string]: string;
}

interface MonoConnectConfig {
	key: string;
	token: string;
	onSuccess: (data: { code: string; id: string }) => void;
	onClose: () => void;
	onError: (error: Error) => void;
}

interface MonoConnectInstance {
	setup: () => void;
	open: () => void;
}

declare global {
	interface Window {
		MonoConnect: {
			new (config: MonoConnectConfig): MonoConnectInstance;
		};
	}
}

interface Bank {
	code: string;
	logo: string;
	[key: string]: unknown;
}

interface AxiosErrorResponse {
	data?: unknown;
	status?: number;
	statusText?: string;
	headers?: unknown;
	config?: unknown;
}

const Banks = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
	const [bankLogoCode, setBankLogoCode] = useState<BankLogoCode>({});
	const [userData, setUserData] = useState<UserData | null>(null);
	const [widgetVisible, setWidgetVisible] = useState(false);
	const [widgetToken, setWidgetToken] = useState("");

	const [free, setFree] = useState(false);
	const [basic, setBasic] = useState(false);
	const [premium, setPremium] = useState(false);

	const MONO_SECRET_KEY = process.env.NEXT_PUBLIC_MONO_SECRET_KEY ?? "";

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://connect.withmono.com/connect.js";
		script.async = true;
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	useEffect(() => {
		if (widgetToken && widgetVisible) {
			const monoConnect = new window.MonoConnect({
				key: MONO_SECRET_KEY,
				token: widgetToken,
				onSuccess: async (data: { code: string; id: string }) => {
					console.log("Linked successfully:", data);
					setWidgetVisible(false);
					try {
						await sendCustomerIdToKuditrak(data.id);
						await loadBankAccounts();
					} catch (error) {
						console.error("Error handling successful connection:", error);
					}
				},
				onClose: () => {
					console.log("Widget closed");
					setWidgetVisible(false);
				},
				onError: (error: Error) => {
					console.error("Error linking account:", error);
					setWidgetVisible(false);
				},
			});

			monoConnect.setup();
			monoConnect.open();
		}
	}, [widgetToken, widgetVisible, MONO_SECRET_KEY]);

	const loadBankAccounts = async () => {
		try {
			const session = await getSession();
			if (!session?.accessToken) {
				console.error("No access token found.");
				return;
			}

			const accountsResponse = await axios.get(
				"https://api.kuditrak.ng/api/v1/account",
				{
					headers: {
						Authorization: `Bearer ${session.accessToken}`,
						Accept: "application/json",
					},
				}
			);

			const accounts = Array.isArray(accountsResponse.data.data.accounts)
				? accountsResponse.data.data.accounts
				: [];

			if (accounts.length > 0) {
				const allAccountDetails: BankAccount[] = [];

				for (const account of accounts) {
					const monoAccountId = account.mono_account_id;
					localStorage.setItem("accountId", monoAccountId);

					const accountDetailsResponse = await axios.get(
						`https://api.withmono.com/v2/accounts/${monoAccountId}`,
						{
							headers: {
								accept: "application/json",
								"mono-sec-key": MONO_SECRET_KEY,
							},
						}
					);

					const accountDetails = accountDetailsResponse.data.data.account;
					allAccountDetails.push(accountDetails);

					if (accountDetails.institution?.bank_code) {
						await getBankLogo(accountDetails.institution.bank_code);
					} else {
						console.warn("No bank code in account details.");
					}
				}

				setBankAccounts(allAccountDetails);
			} else {
				console.warn("No accounts found.");
			}
		} catch (error: unknown) {
			if (error && typeof error === "object" && "response" in error) {
				const errResponse = error as { response?: AxiosErrorResponse };
				if (errResponse.response?.data) {
					console.log("Error fetching accounts:", errResponse.response.data);
				} else {
					console.log("Error fetching accounts:", errResponse.response);
				}
			} else if (error instanceof Error) {
				console.log("Error fetching accounts:", error.message);
			} else {
				console.log("Error fetching accounts:", error);
			}
		}
	};

	const getBankLogo = async (bankCode: string) => {
		try {
			if (!bankCode) {
				console.warn("No bank code provided.");
				return;
			}

			const response = await axios.get("https://nigerianbanks.xyz");
			const banksData = response.data as Bank[];

			const bank = banksData.find((bank) => bank.code === bankCode);

			if (bank) {
				const bankLogoUrl = bank.logo;
				setBankLogoCode((prevLogos) => ({
					...prevLogos,
					[bankCode]: bankLogoUrl,
				}));
			} else {
				setBankLogoCode((prevLogos) => ({
					...prevLogos,
					[bankCode]: "",
				}));
				console.warn(`No logo found for bank code: ${bankCode}`);
			}
		} catch (error: unknown) {
			console.log("Error fetching bank data:", error);
			setBankLogoCode((prevLogos) => ({ ...prevLogos, [bankCode]: "" }));
		}
	};

	const fetchUserData = async () => {
		setIsLoading(true);
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
				},
			});

			if (response.status === 401) {
				throw new Error("Unauthorized. Please log in again.");
			}

			const subscriptionPlan =
				response?.data?.data?.users.subscription_plan?.subscription_plan_name;

			if (subscriptionPlan === "free") {
				setFree(true);
			} else if (subscriptionPlan === "basic") {
				setBasic(true);
			} else if (subscriptionPlan === "premium") {
				setPremium(true);
			}

			setUserData(response.data.data);
		} catch (error: unknown) {
			if (error && typeof error === "object" && "response" in error) {
				const errResponse = error as { response?: AxiosErrorResponse };
				if (errResponse.response?.data) {
					console.log("Error fetching user data:", errResponse.response.data);
				} else {
					console.log("Error fetching user data:", errResponse.response);
				}
			} else if (error instanceof Error) {
				console.log("Error fetching user data:", error.message);
			} else {
				console.log("Error fetching user data:", error);
			}
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUserData();
		loadBankAccounts();
	}, []);

	const sendCustomerIdToKuditrak = async (customerId: string) => {
		try {
			const session = await getSession();
			if (!session?.accessToken) {
				console.error("No access token found.");
				return;
			}
			await axios.post(
				"https://api.kuditrak.ng/api/v1/account",
				{ mono_customer_id: customerId },
				{
					headers: {
						Authorization: `Bearer ${session.accessToken}`,
						"Content-Type": "application/json",
					},
				}
			);
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.log("Error sending customer ID to Kuditrak:", error.message);
			} else {
				console.log("Error sending customer ID to Kuditrak:", error);
			}
		}
	};

	const initiateAccountLinking = async () => {
		const {
			first_name: firstName,
			last_name: lastName,
			email,
		} = userData?.users || {};
		if (!email || !firstName || !lastName) {
			alert("Please ensure your profile information is complete.");
			return;
		}

		if (free && bankAccounts.length >= 1) {
			alert(
				"You can only link 1 account on the Free plan. Please upgrade to link more accounts."
			);
			return;
		} else if (basic && bankAccounts.length >= 3) {
			alert(
				"You can only link 3 accounts on the Basic plan. Please upgrade to link more accounts."
			);
			return;
		} else if (premium && bankAccounts.length >= 10) {
			alert(
				"You have reached the maximum number of linked accounts on the Premium plan."
			);
			return;
		}

		try {
			setIsLoading(true);

			const response = await axios.post(
				"https://api.withmono.com/v2/accounts/auth",
				{
					customer: {
						name: `${firstName} ${lastName}`,
						email,
					},
					scope: "auth",
				},
				{
					headers: {
						accept: "application/json",
						"content-type": "application/json",
						"mono-sec-key": MONO_SECRET_KEY,
					},
				}
			);

			const token = response.data.data.token;
			setWidgetToken(token);
			setWidgetVisible(true);
		} catch (error: unknown) {
			if (error && typeof error === "object" && "response" in error) {
				const errResponse = error as { response?: AxiosErrorResponse };
				if (errResponse.response?.data) {
					console.log(
						"Error during linking accounts:",
						errResponse.response.data
					);
				} else {
					console.log("Error during linking accounts:", errResponse.response);
				}
			} else if (error instanceof Error) {
				console.log("Error during linking accounts:", error.message);
			} else {
				console.log("Error during linking accounts:", error);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const formatBalance = (balance: number, currency = "NGN") => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: currency,
			minimumFractionDigits: 2,
		}).format(balance / 100);
	};

	const LinkAccount = () => {
		const isButtonDisabled =
			(free && bankAccounts.length >= 1) ||
			(basic && bankAccounts.length >= 3) ||
			(premium && bankAccounts.length >= 10);

		return (
			<div className="mb-2 flex flex-col items-center">
				<div className="mb-2 flex flex-col items-center">
					<img
						className="w-16 h-16 object-contain mt-2"
						src="/images/bank-bg.png"
						alt="Bank illustration"
					/>
					<p className="text-center">
						Link all your bank accounts to your Kuditrak account
					</p>
					<a
						href="https://kuditrak.ng"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 font-semibold">
						Learn more
					</a>
				</div>

				<button
					onClick={initiateAccountLinking}
					disabled={isButtonDisabled}
					className={`w-full mt-8 py-2 rounded-lg flex justify-center items-center gap-2 border border-dashed ${
						isButtonDisabled ? "bg-gray-200 border-gray-500" : "border-gray-500"
					}`}>
					<span
						className={`text-base font-semibold text-center ${
							isButtonDisabled ? "text-gray-500" : "text-black"
						}`}>
						+ Link bank account
					</span>
				</button>

				{free && (
					<div className="border border-yellow-500 mx-1 mt-8 p-2 rounded-lg bg-yellow-50 flex items-start gap-1 w-full">
						<IconAlertCircle className="text-yellow-500 w-5 h-5 mt-0.5" />
						<p className="text-xs">
							You can only add a maximum of 1 account. Need <br /> more?
							Consider{" "}
							<button
								onClick={() => router.push("/home/PremiumPlan")}
								className="text-blue-600 font-semibold underline">
								upgrading
							</button>
						</p>
					</div>
				)}

				{basic && (
					<div className="border border-yellow-500 mx-1 mt-8 p-2 rounded-lg bg-yellow-50 flex items-start gap-1 w-full">
						<IconAlertCircle className="text-yellow-500 w-5 h-5 mt-0.5" />
						<p className="text-xs">
							You can only add a maximum of 3 accounts. Need <br /> more?
							Consider{" "}
							<button
								onClick={() => router.push("/home/PremiumPlan")}
								className="text-blue-600 font-semibold underline">
								upgrading
							</button>
						</p>
					</div>
				)}

				{premium && (
					<div className="border border-yellow-500 mx-1 mt-8 p-2 rounded-lg bg-yellow-50 flex items-start gap-1 w-full">
						<IconAlertCircle className="text-yellow-500 w-5 h-5 mt-0.5" />
						<p className="text-xs">
							You can add unlimited number of accounts. Need <br /> less?
							Consider{" "}
							<button
								onClick={() => router.push("/home/PremiumPlan")}
								className="text-blue-600 font-semibold underline">
								downgrading
							</button>
						</p>
					</div>
				)}
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className="p-4 flex flex-col justify-start">
				<div className="w-4/5 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
				<div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
				<div className="w-11/12 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
				<div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
			</div>
		);
	}

	return (
		<div className="w-full border border-green-400 bg-white p-3 shadow-lg rounded-lg min-h-screen">
			<div className="bg-white pt-5 px-5 rounded-t-2xl max-w-2xl mx-auto">
				<LinkAccount />

				<div className="border-b border-gray-200 py-2">
					<h2 className="text-gray-800 text-sm font-bold text-left capitalize">
						Linked bank Accounts
					</h2>
				</div>

				{isLoading ? (
					<div className="mt-5 flex justify-center">
						<div className="w-8 h-8 border-4 border-blue-900 rounded-full animate-spin"></div>
					</div>
				) : bankAccounts.length > 0 ? (
					bankAccounts
						.slice(0, free ? 1 : basic ? 3 : 100)
						.map((account, index) => (
							<div key={index} className="flex items-center gap-2 mt-5">
								{bankLogoCode[account.institution.bank_code] ? (
									<div className="w-14 h-14 border-2 border-blue-900 rounded-full p-0.5">
										<img
											src={bankLogoCode[account.institution.bank_code]}
											alt={account.institution.name}
											className="w-12 h-12 object-contain rounded-full"
										/>
									</div>
								) : (
									<img
										src="/status.png"
										alt="Default bank logo"
										className="w-12 h-12 object-contain rounded-full"
									/>
								)}
								<div>
									<h3 className="text-blue-900 font-bold capitalize text-sm">
										{account.name}
									</h3>
									<p className="text-blue-900 text-sm">
										{account.account_number} - {formatBalance(account.balance)}
									</p>
								</div>
							</div>
						))
				) : (
					<p className="mt-5">No account connected yet</p>
				)}
			</div>
		</div>
	);
};

export default Banks;
