"use client";

import { useServerQuery } from "@/hooks/useQuery";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { StripedPattern } from "../ui/striped-pattern";
import type { IProblem, IResponse, SubmissionStatus } from "@/types";

const KEY = "/problems";

const getStatusBadge = (status: SubmissionStatus | null) => {
	switch (status) {
		case "ACCEPTED":
			return <Badge className="bg-green-500 text-white">Accepted</Badge>;
		case "REJECTED":
			return <Badge className="bg-red-500 text-white">Rejected</Badge>;
		case "PENDING":
			return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
		case "NOT_SUBMITTED":
		default:
			return <Badge variant="outline">Not Started</Badge>;
	}
};

export default function ProblemsTable() {
	const { data } = useServerQuery<IResponse<IProblem[]>>(KEY);

	return (
		<main>
			<div className="w-full border-b-2 border-dashed border-gray-200 flex justify-between bg-gray-50/50">
				<div className="p-4 w-fit">
					<h3 className="text-lg font-semibold">Problems</h3>
				</div>
				<div className="flex">
					<div className="border-l-2 border-dashed w-36 h-full border-gray-200/70 flex items-center justify-center">
						<h3 className="text-lg font-semibold">Status</h3>
					</div>
					<div className="border-l-2 border-dashed w-36 h-full border-gray-200/70 flex items-center justify-center">
						<h3 className="text-lg font-semibold">Companies</h3>
					</div>
					<div className="border-l-2 border-dashed w-36 h-full border-gray-200/70 flex items-center justify-center">
						<h3 className="text-lg font-semibold">Action</h3>
					</div>
				</div>
			</div>
			<div className="relative">
				<StripedPattern className="absolute inset-0 -z-10" />
				{data?.data?.map((problem) => {
					return (
						<div
							key={problem.id}
							className="w-full border-b-2 border-dashed border-gray-200/70 flex justify-between hover:bg-gray-50/50 transition-colors"
						>
							<div className="p-4 w-fit flex items-center gap-2">
								{problem.isPaid && (
									<Badge variant="outline" className="text-xs">
										Premium
									</Badge>
								)}
								<h2 className="text-lg font-bold text-ellipsis overflow-hidden whitespace-nowrap">
									{problem.title}
								</h2>
							</div>
							<div className="flex">
								<div className="border-l-2 border-dashed w-36 h-full border-gray-200/70 flex items-center justify-center">
									{getStatusBadge(problem.submissions)}
								</div>
								<div className="border-l-2 border-dashed w-36 h-full border-gray-200/70 flex flex-col items-center justify-center gap-2">
									<div className="flex -space-x-2 max-w-36">
										{problem.companies.length > 0 ? (
											problem.companies.map((company) => {
												return (
													<Avatar
														key={company.name}
														className="ring-1 ring-black/10 bg-white"
														title={company.name}
													>
														<AvatarImage src={company.logoUrl} />
														<AvatarFallback>
															{company.name.charAt(0)}
														</AvatarFallback>
													</Avatar>
												);
											})
										) : (
											<span className="text-xs text-gray-400">No companies</span>
										)}
									</div>
								</div>
								<div className="border-l-2 border-dashed w-36 h-full border-gray-200/70 flex cursor-pointer items-center justify-center hover:bg-gray-100 transition-colors">
									<Link href={`/problem/${problem.id}`}>
										<ArrowRight className="hover:translate-x-1 transition-all duration-300" />
									</Link>
								</div>
							</div>
						</div>
					);
				})}
				{data?.data && data.data.length === 0 && (
					<div className="p-8 text-center text-gray-500">
						No problems found
					</div>
				)}
			</div>
		</main>
	);
}
