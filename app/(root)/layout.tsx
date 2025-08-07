import Head from "next/head";

function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<Head>
				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" content="#0D1420" />
				<link rel="apple-touch-icon" href="/images/favicon.png" />
			</Head>
			<body>{children}</body>
		</html>
	);
}

export default RootLayout;
