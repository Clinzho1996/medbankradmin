import type { Metadata } from "next";
import { IBM_Plex_Serif, Inter, Manrope } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "./AuthProvider/AuthProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSerif = IBM_Plex_Serif({
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: "--font-ibm-plex-serif",
});
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
	title: "Medbankr Admin Portal",
	description: "Integrated Digital Health Platform",
	themeColor: "#0D1420",
	icons: {
		icon: "/favicon.ico",
		apple: "/images/favicon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				{/* PWA meta tags */}
				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" content="#0D1420" />
				<link rel="apple-touch-icon" href="/images/favicon.png" />
			</head>
			<body
				className={`${inter.variable} ${ibmPlexSerif.variable} ${manrope.variable}`}>
				<AuthProvider>{children}</AuthProvider>
				<ToastContainer />
			</body>
		</html>
	);
}
