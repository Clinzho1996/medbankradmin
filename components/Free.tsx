import { CheckCircle } from "lucide-react";
import Image from "next/image";

const Free = () => {
	return (
		<div className="bg-white h-fit w-full border rounded-lg border-gray-200">
			<div className="bg-white shadow-md rounded-lg p-5 mx-5 my-5">
				<div className="flex flex-col gap-3">
					<p className="text-[#0A0D14] text-[16px] font-semibold">Free Plan</p>
					<Image
						src="/images/rule.png"
						alt="free plan"
						width={300}
						height={100}
						className="w-full object-contain"
					/>
				</div>
				<div className="py-3">
					<h3 className="text-[#0A0D14] text-sm font-semibold">
						What&apos;s included
					</h3>

					<div className="mt-5 space-y-5">
						<div className="flex items-start gap-2.5">
							<CheckCircle className="text-[#37C390] w-4 h-4 mt-0.5" />
							<p className="text-[#4B5563] text-sm">
								Connect just a bank account
							</p>
						</div>

						<div className="flex items-start gap-2.5">
							<CheckCircle className="text-[#37C390] w-4 h-4 mt-0.5" />
							<p className="text-[#4B5563] text-sm">
								Create up to 3 budgets per month
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Free;
