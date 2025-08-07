import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				primary: {
					1: "#183d3d",
					2: "#0B111B",
					3: "#00000029",
					4: "#297C661F",
					5: "#FEF8EF",
					6: "#6B7280",
				},
				custom: {
					1: "#C3FF9D",
				},
				secondary: {
					1: "#2FE0A8",
					2: "#FFF8EB",
					3: "#FFDA97",
				},
				dark: {
					1: "#0A0D14",
					2: "#6B7280",
					3: "#6B728080",
				},
				red: "#F43F5E",
			},

			fontFamily: {
				inter: "var(--font-inter)",
				"ibm-plex-serif": "var(--font-ibm-plex-serif)",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
