/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			"lh3.googleusercontent.com",
			"ui-avatars.com",
			"img.clerk.com",
			"res.cloudinary.com",
			"api.dicebear.com",
			"medbankr-admin-be.s3.us-east-1.amazonaws.com",
		],
	},
	experimental: {
		appDir: true,
	},
};

export default nextConfig;
