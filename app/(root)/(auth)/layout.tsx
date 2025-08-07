"use client";
import AuthSidebar from "@/components/AuthSidebar";
import Loader from "@/components/Loader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
	const session = useSession();
	const router = useRouter();

	useEffect(() => {
		// Redirect unauthenticated users to login page
		if (session?.status === "unauthenticated") {
			router.replace("/sign-in");
		}
	}, [session?.status, router]);

	if (session?.status === "loading") {
		return <Loader />;
	}
	return (
		<main>
			<div className="flex min-h-screen">
				<section className="flex min-h-screen flex-1 flex-col pb-6 bg-[#fff]">
					<div className="w-full flex flex-col gap-3">{children}</div>
				</section>
				<AuthSidebar />
			</div>
		</main>
	);
};

export default AuthLayout;
