"use client";

import Banks from "@/components/Banks";
import HeaderBox from "@/components/HeaderBox";
import Profile from "@/components/Profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Settings() {
	return (
		<div className="bg-[#F6F8F9] min-h-screen w-full flex flex-col">
			<HeaderBox title="Settings" />
			<div className="bg-[#F6F8FA] flex flex-col h-full px-4 py-2 w-full max-w-[100vw]">
				<p className="text-sm font-normal text-[#6B7280] border-b border-[#E2E4E9] pb-2">
					Manage your account, security, and preferences
				</p>

				<div className="bg-[#EFF1F5] rounded-lg p-2 shadow-md mt-2 w-full">
					<div className="flex flex-row justify-start items-center gap-2 p-2 w-full">
						<Tabs defaultValue="profile" className="w-full">
							<TabsList className="flex flex-row justify-start bg-[#EFF1F5] gap-3">
								<TabsTrigger
									value="profile"
									className="data-[state=active]:bg-white data-[state=active]:text-dark-1 text-[#6C7278] data-[state=active]:shadow-lg">
									Profile Information
								</TabsTrigger>{" "}
								|
								<TabsTrigger
									value="banks"
									className="data-[state=active]:bg-white data-[state=active]:text-dark-1 text-[#6C7278] data-[state=active]:shadow-lg`">
									Linked Bank Accounts
								</TabsTrigger>
							</TabsList>
							<TabsContent value="profile" className="w-full">
								<Profile />
							</TabsContent>
							<TabsContent value="banks">
								<Banks />
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Settings;
