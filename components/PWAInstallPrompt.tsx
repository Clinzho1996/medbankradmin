"use client";

import { useEffect, useState } from "react";

export default function PWAInstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [showPrompt, setShowPrompt] = useState(false);
	const [isIos, setIsIos] = useState(false);
	const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);

	useEffect(() => {
		const userAgent = window.navigator.userAgent.toLowerCase();
		const isIOS = /iphone|ipad|ipod/.test(userAgent);
		const isStandalone = window.matchMedia(
			"(display-mode: standalone)"
		).matches;

		setIsIos(isIOS);
		setIsInStandaloneMode(isStandalone);

		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
			setShowPrompt(true);
		};

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt
			);
		};
	}, []);

	const handleInstall = async () => {
		if (!deferredPrompt) return;

		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === "accepted") {
			console.log("User accepted the install prompt");
		}
		setDeferredPrompt(null);
		setShowPrompt(false);
	};

	if (isIos && !isInStandaloneMode) {
		return (
			<div className="fixed bottom-4 left-4 right-4 bg-[#0D1420] text-white p-4 rounded-xl text-sm shadow-md text-center z-50">
				Install Kuditrak on iOS: Tap <strong>Share</strong> →{" "}
				<strong>Add to Home Screen</strong>
			</div>
		);
	}

	if (!showPrompt) return null;

	return (
		<button
			onClick={handleInstall}
			className="fixed bottom-4 left-4 right-4 bg-[#0D1420] text-white p-4 rounded-xl shadow-md text-sm z-50">
			Install Kuditrak App
		</button>
	);
}

// Global type declaration
interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}
