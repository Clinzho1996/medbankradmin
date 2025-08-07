"use client";

import { IconLogout2 } from "@tabler/icons-react";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function ResetPassword() {
	const { status } = useSession();
	const router = useRouter();
	const [email, setEmail] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isResending, setIsResending] = useState<boolean>(false);

	useEffect(() => {
		if (status === "authenticated") {
			toast.success("Login Successful!");
			router.push("/");
		}
	}, [status, router]);

	useEffect(() => {
		const storedEmail = localStorage.getItem("email");
		if (storedEmail) {
			setEmail(storedEmail);
		}
	}, []);

	const [otp, setOtp] = useState<{ [key: number]: string }>({
		1: "",
		2: "",
		3: "",
		4: "",
	});

	const refs: { [key: number]: React.RefObject<HTMLInputElement> } = {
		1: useRef(null),
		2: useRef(null),
		3: useRef(null),
		4: useRef(null),
	};

	const handleChange = (index: number, text: string) => {
		setOtp((prevOtp) => ({ ...prevOtp, [index]: text }));
		if (text) refs[index + 1]?.current?.focus();
		else refs[index - 1]?.current?.focus();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		const verificationCode = Object.values(otp).join("");

		try {
			const response = await axios.post(
				"https://api.kuditrak.ng/api/v1/auth/verify-reset-otp",
				{ otp: verificationCode },
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				}
			);

			if (response.data.data.user_id) {
				localStorage.setItem("userId", response.data.data.user_id);
			} else {
				console.error("user id is undefined");
			}

			if (response.status == 200) {
				toast.success("OTP verified successfully");
				router.push("/change-password");
			}
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				const errorMessage =
					error.response?.data?.message || "An error occurred";
				console.error("Error response:", error.response?.data);
				toast.error(errorMessage);
			} else {
				console.error("Unexpected error:", error);
				toast.error("An unexpected error occurred");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const resendCode = async () => {
		setIsResending(true);
		const userEmail = localStorage.getItem("email");
		console.log("Email Retrieved:", userEmail);

		try {
			const response = await axios.post(
				"https://api.kuditrak.ng/api/v1/auth/forgot-password",
				{ email: userEmail },
				{ headers: { Accept: "application/json", referer: "aitechma.com" } }
			);

			console.log(response.data);
			toast.success("OTP resent successfully");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				// Corrected error message access
				if (error.response && error.response.data) {
					toast.error(error?.response?.data?.message);
					console.log("Error response:", error.response.data);
				} else {
					toast.error("An error occurred.");
					console.log("Error response: An error occurred.");
				}
			} else {
				toast.error("Something went wrong. Please try again.");
				console.log("Unexpected error:", error);
			}
		} finally {
			setIsResending(false);
		}
	};

	return (
		<div className="w-full flex flex-col lg:flex-row justify-between items-center h-screen bg-[#fff]">
			<div className="w-full lg:w-[70%] flex flex-col gap-10 py-[2%] px-[4%] mx-auto my-auto">
				<div className="bg-[#fff] p-1 rounded-lg flex flex-col items-center ">
					<div className="bg-[#fff] w-full px-6 pt-10 rounded-lg flex flex-col items-center">
						<Image
							src="/images/favicon.png"
							alt="Logo"
							width={60}
							height={60}
							className="mx-auto mb-4"
						/>

						<p className="text-[20px] font-semibold text-dark-1 text-center font-inter mt-4">
							Enter Verification Code
						</p>
						<p className="text-sm text-[#6D717F] text-center mt-2 font-inter">
							We&apos;ve sent a code to{" "}
							<span className="font-semibold">{email}</span>
						</p>

						<form className="w-full mt-6" onSubmit={handleSubmit}>
							<div className="flex gap-4 mt-4 justify-center">
								<div className="mb-4 flex gap-4 justify-center">
									{[1, 2, 3, 4].map((num) => (
										<input
											key={num}
											type="text"
											maxLength={1}
											ref={refs[num]}
											value={otp[num]}
											onChange={(e) => handleChange(num, e.target.value)}
											className="w-[70px] h-20 bg-[#F4F6F8] text-dark-1 text-lg text-center rounded-lg p-2 border border-[#0000000D] placeholder:text-[#525254] focus:outline-none focus:border-secondary-1 mt-1 shadow-inner"
										/>
									))}
								</div>
							</div>

							<button
								type="submit"
								className="w-full bg-secondary-1 text-primary-1 font-inter p-2 rounded-lg mt-12 border-[3px] border-[#2FE0A833] flex flex-row justify-center items-center gap-2 hover:bg-secondary-1/90 transition-colors duration-300"
								disabled={isLoading}>
								{isLoading ? "Loading..." : "Verify OTP"}{" "}
								<IconLogout2 color="white" />
							</button>
						</form>
					</div>
					<div className="mt-4 flex flex-row items-center gap-2 ">
						<p className="text-gray-500">
							Experiencing issues receiving the code?
						</p>
						<button
							onClick={resendCode}
							disabled={isResending}
							className="text-secondary-1 underline">
							{isResending ? "Resending..." : "Resend Code"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
