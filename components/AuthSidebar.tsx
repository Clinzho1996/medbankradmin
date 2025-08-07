"use client";

import Image from "next/image";

const AuthSidebar = () => {
	return (
		<section className="max-sm:hidden w-full h-screen lg:w-1/2 relative border-[5px] border-[#fff] rounded-lg">
			<Image
				src="/images/frame.png"
				alt="auth-side"
				fill
				className="object-cover"
				priority
			/>
		</section>
	);
};

export default AuthSidebar;
