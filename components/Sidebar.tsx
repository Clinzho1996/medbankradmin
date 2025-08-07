"use client";
import { overviewLinks, settingsLinks, sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const Sidebar = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const pathname = usePathname();
	const { data: session } = useSession();

	const handleLogout = async () => {
		try {
			await signOut({ redirect: true, callbackUrl: "/sign-in" });
			toast.success("Logout successful!");
		} catch (error) {
			toast.error("Failed to log out. Please try again.");
			console.error("Sign-out error:", error);
		}
	};

	const toggleSidebar = () => {
		setIsCollapsed(!isCollapsed);
	};

	return (
		<section
			className={cn(
				"sticky left-0 top-0 flex h-screen w-fit flex-col border-r-[1px] justify-between bg-primary-1 text-dark-3 max-sm:hidden z-10 border-[4px] border-white rounded-l-lg",
				{
					"lg:w-[80px]": isCollapsed,
					"lg:w-[264px]": !isCollapsed,
				}
			)}>
			<div className="flex flex-1 flex-col gap-2">
				{/* Logo and Toggle Button */}
				<div className="flex items-center justify-between border-b-[#CED0D51A] p-3 h-[80px]">
					{!isCollapsed ? (
						<Link href="/" className="flex items-center gap-1">
							<Image
								src="/images/medwhite.png"
								alt="Medbankr Logo"
								width={120}
								height={40}
								className="w-full justify-center h-full flex object-contain"
							/>
						</Link>
					) : (
						<Link href="/" className="flex items-center justify-center w-full">
							<Image
								src="/images/favicon.png"
								alt="Medbankr Logo"
								width={50}
								height={50}
								className="w-[50px] object-contain h-full flex"
							/>
						</Link>
					)}
					<button
						onClick={toggleSidebar}
						className="hidden bg-white rounded-full lg:flex items-center justify-center w-6 h-6  hover:bg-[#E9E9EB17]">
						<Image
							src={
								isCollapsed
									? "/images/arrow-right.png"
									: "/images/arrow-right.png"
							}
							alt="Toggle sidebar"
							width={20}
							height={20}
							className="w-4 h-4 object-contain"
						/>
					</button>
				</div>

				{!isCollapsed && (
					<>
						<div>
							<Image
								src="/images/liner.png"
								alt="sidebar asset"
								width={234}
								height={10}
								className="w-full object-cover rounded-lg"
							/>

							<div className="flex flex-col justify-center items-start gap-2 px-4 py-2">
								<h2 className="text-white text-[18px] font-inter font-bold">
									Welcome 👋🏻 <br /> {session?.user?.name}
								</h2>
								<p className="text-xs text-[#AEB5C2]">
									Control and manage the admin portal according to your role.
								</p>

								<Image
									src="/images/liner.png"
									alt="sidebar asset"
									width={234}
									height={10}
									className="w-full object-cover rounded-lg"
								/>
							</div>
						</div>
						<p className="text-sm font-normal text-[#FFFFFF80] pl-4 font-inter py-2">
							OVERVIEW
						</p>
					</>
				)}

				{/* Sidebar Links */}
				{overviewLinks.map((item) => {
					const isActive =
						pathname === item.route || pathname.startsWith(`${item.route}/`);

					return (
						<Link
							href={item.route}
							key={item.label}
							className={cn(
								"flex items-center justify-center sm:justify-start rounded-[8px] mx-auto sm:mx-4 my-0 border-[1px] border-[#FFFFFF0A]",
								{
									"shadow-inner shadow-[#C3FF9D38] border-[1px] border-secondary-1 bg-[#2D4F50]":
										isActive,
									"p-2": !isCollapsed,
									"p-3": isCollapsed,
								}
							)}>
							<div className="flex gap-2 items-center">
								<Image
									src={item.imgUrl}
									alt={item.label}
									width={20}
									height={20}
									className="w-[20px] h-[20px] object-contain flex"
								/>
								{!isCollapsed && (
									<p
										className={cn(
											"text-sm font-normal font-inter text-[#E9E9EB]",
											{
												"text-[#E9E9EB]": isActive,
											}
										)}>
										{item.label}
									</p>
								)}
							</div>
						</Link>
					);
				})}

				{!isCollapsed && (
					<>
						<div className="px-3 pt-4">
							<Image
								src="/images/liner.png"
								alt="sidebar asset"
								width={234}
								height={10}
								className="w-full object-cover rounded-lg"
							/>
						</div>
						<p className="text-sm font-normal text-[#FFFFFF80] pl-4 font-inter py-2">
							USER MANAGEMENT
						</p>
					</>
				)}
				{/* Sidebar Links */}
				{sidebarLinks.map((item) => {
					const isActive =
						pathname === item.route || pathname.startsWith(`${item.route}/`);

					return (
						<Link
							href={item.route}
							key={item.label}
							className={cn(
								"flex items-center justify-center sm:justify-start rounded-[8px] mx-auto sm:mx-4 my-0 border-[1px] border-[#FFFFFF0A]",
								{
									"shadow-inner shadow-[#C3FF9D38] border-[1px] border-secondary-1 bg-[#2D4F50]":
										isActive,
									"p-2": !isCollapsed,
									"p-3": isCollapsed,
								}
							)}>
							<div className="flex gap-2 items-center">
								<Image
									src={item.imgUrl}
									alt={item.label}
									width={20}
									height={20}
									className="w-[20px] h-[20px] object-contain flex"
								/>
								{!isCollapsed && (
									<p
										className={cn(
											"text-sm font-normal font-inter text-[#E9E9EB]",
											{
												"text-[#E9E9EB]": isActive,
											}
										)}>
										{item.label}
									</p>
								)}
							</div>
						</Link>
					);
				})}

				{!isCollapsed && (
					<>
						<div className="px-3 pt-4">
							<Image
								src="/images/liner.png"
								alt="sidebar asset"
								width={234}
								height={10}
								className="w-full object-cover rounded-lg"
							/>
						</div>
						<p className="text-sm font-normal text-[#FFFFFF80] pl-4 font-inter py-2">
							OPERATIONAL MANAGEMENT
						</p>
					</>
				)}

				{/* Settings Links */}
				{settingsLinks.map((item) => {
					const isActive =
						pathname === item.route || pathname.startsWith(`${item.route}/`);

					return (
						<Link
							href={item.route}
							key={item.label}
							className={cn(
								"flex items-center justify-center sm:justify-start rounded-[8px] mx-auto sm:mx-4 my-0 border-[1px] border-[#FFFFFF0A]",
								{
									"shadow-inner shadow-[#C3FF9D38] border-[1px] border-secondary-1":
										isActive,
									"p-2": !isCollapsed,
									"p-3": isCollapsed,
								}
							)}>
							<div className="flex gap-2 items-center">
								<Image
									src={item.imgUrl}
									alt={item.label}
									width={20}
									height={20}
									className="w-[20px] h-[20px] object-contain flex"
								/>
								{!isCollapsed && (
									<p
										className={cn(
											"text-sm font-normal font-inter text-[#E9E9EB]",
											{
												"text-[#E9E9EB]": isActive,
											}
										)}>
										{item.label}
									</p>
								)}
							</div>
						</Link>
					);
				})}
			</div>

			{/* Logout Button */}
			<div className="flex flex-col gap-2 mb-4">
				<div
					className={cn(
						"flex items-center justify-center sm:justify-start mx-4 my-0 cursor-pointer border-t-[1px] border-[#CED0D51A]",
						{
							"p-2": !isCollapsed,
							"p-3": isCollapsed,
						}
					)}
					onClick={handleLogout}>
					<div className="flex gap-2 items-center">
						<Image
							src="/icons/logout.svg"
							alt="settings"
							width={20}
							height={20}
							className="w-[20px] h-[20px] object-contain flex"
						/>
						{!isCollapsed && (
							<p className="text-sm font-normal font-inter text-[#E9E9EB]">
								Logout
							</p>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Sidebar;
