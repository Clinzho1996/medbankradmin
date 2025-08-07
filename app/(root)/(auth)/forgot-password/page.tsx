"use client";

import { IconLogout } from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ForgotPassword() {
	const { status } = useSession();
	const router = useRouter();

	const [form, setForm] = useState({ email: "" });
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (status === "authenticated") {
			toast.success("Login Successful!");
			router.push("/");
		}
	}, [status, router]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault(); // Prevents default form submission

		if (form.email === "") {
			toast.error("Please fill in all fields");
			return;
		}

		setIsLoading(true);

		try {
			const response = await axios.post(
				"https://api.kuditrak.ng/api/v1/auth/forgot-password",
				{ email: form.email },
				{
					headers: {
						Accept: "application/json",
						referer: "aitechma.com",
					},
				}
			);

			localStorage.setItem("email", form.email);
			toast.success("Email sent successfully!");
			console.log("Response Data:", response.data);

			// Ensure the reset password route exists in your app
			router.push("/reset-password");
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
			setIsLoading(false);
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
							Forgot Password?
						</p>
						<p className="text-sm text-[#6D717F] text-center mt-2 font-inter">
							Enter the email or phone number you have registered with so we
							could send you an OTP to reset your password
						</p>

						<form className="w-full mt-6" onSubmit={handleSubmit}>
							<div className="flex gap-4 mt-4">
								<div className="w-full">
									<label className="text-sm text-[#6C7278] font-medium mb-2">
										Email address
									</label>
									<input
										type="email"
										placeholder="Enter your email"
										value={form.email}
										onChange={(e) =>
											setForm({ ...form, email: e.target.value })
										}
										className="w-full bg-[#F4F6F8] text-dark-1 text-sm rounded-lg p-2 border border-[#0000000D] placeholder:text-[#6C7278] focus:outline-none focus:border-primary-1 mt-1 shadow-inner"
										required
									/>
								</div>
							</div>

							<button
								type="submit"
								className="w-full bg-secondary-1 text-primary-1 font-inter p-2 rounded-lg mt-12 border-[3px] border-[#2FE0A833] flex flex-row justify-center items-center gap-2 hover:bg-secondary-1/90 transition-colors duration-300"
								disabled={isLoading}>
								{isLoading ? "Loading..." : "Continue"}{" "}
								<IconLogout color="white" />
							</button>
						</form>
					</div>
					<div className="bg-primary p-3 mt-4 w-full text-center mt-4">
						<p className="text-[#7D7C81] text-sm">
							Experiencing any issues?{" "}
							<Link href="/" className="underline text-secondary-1">
								Contact Support
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
