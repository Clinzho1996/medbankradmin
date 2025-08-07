/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ["lh3.googleusercontent.com", "api.kuditrak.ng", "ui-avatars.com"],
	},
	experimental: {
		appDir: true,
	},
};

export default nextConfig;
