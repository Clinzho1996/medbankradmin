"use client";

import { IconLogout2 } from "@tabler/icons-react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ChangePassword() {
	const { status } = useSession();
	const router = useRouter();

	const [form, setForm] = useState({ password: "", confirmPassword: "" });
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	useEffect(() => {
		if (status === "authenticated") {
			toast.success("Login Successful!");
			router.push("/");
		}
	}, [status, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await axios.post(
				"https://api.comicscrolls.com/api/v1/auth/reset-password",
				{
					user_id: localStorage.getItem("userId"),
					password: form.password,
					password_confirmation: form.confirmPassword,
				},
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				}
			);

			if (response.status == 200) {
				toast.success("Password changed successfully");
				router.push("/sign-in");
			}
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
							Create New Password
						</p>
						<p className="text-sm text-[#6D717F] text-center mt-2 font-inter">
							Enter your credentials to set new password
						</p>

						<form className="w-full mt-6" onSubmit={handleSubmit}>
							<div className="mb-4 mt-4">
								<label className="text-sm text-[#6C7278] font-medium">
									New Password
								</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										value={form.password}
										onChange={(e) =>
											setForm({ ...form, password: e.target.value })
										}
										className="w-full bg-[#F4F6F8] text-dark-1 text-sm rounded-lg p-2 border border-[#0000000D] placeholder:text-[#6C7278] focus:outline-none focus:border-primary-1 mt-1 shadow-inner"
										required
									/>
									<button
										type="button"
										className="absolute right-3 top-[55%] translate-y-[-50%] text-[#696E77]"
										onClick={() => setShowPassword(!showPassword)}>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
							</div>

							<div className="mb-4 mt-4">
								<label className="text-sm text-[#6C7278] font-medium">
									Confirm Password
								</label>
								<div className="relative">
									<input
										type={showConfirmPassword ? "text" : "password"}
										placeholder="Enter your password"
										value={form.confirmPassword}
										onChange={(e) =>
											setForm({ ...form, confirmPassword: e.target.value })
										}
										className="w-full bg-[#F4F6F8] text-dark-1 text-sm rounded-lg p-2 border border-[#0000000D] placeholder:text-[#6C7278] focus:outline-none focus:border-primary-1 mt-1 shadow-inner"
										required
									/>
									<button
										type="button"
										className="absolute right-3 top-[55%] translate-y-[-50%] text-[#696E77]"
										onClick={() =>
											setShowConfirmPassword(!showConfirmPassword)
										}>
										{showConfirmPassword ? (
											<EyeOff size={18} />
										) : (
											<Eye size={18} />
										)}
									</button>
								</div>
							</div>

							<button
								type="submit"
								className="w-full bg-secondary-1 text-primary-1 font-inter p-2 rounded-lg mt-12 border-[3px] border-[#2FE0A833] flex flex-row justify-center items-center gap-2 hover:bg-secondary-1/90 transition-colors duration-300"
								disabled={isLoading}>
								{isLoading ? "Signing up..." : "Sign Up"}{" "}
								<IconLogout2 color="white" />
							</button>
						</form>
					</div>
					<div className="bg-primary p-3 mt-4 w-full text-center">
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
