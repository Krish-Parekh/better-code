"use client";

import { useServerQuery } from "@/hooks/useQuery";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { StripedPattern } from "../ui/striped-pattern";

const KEY = "/problems";

interface IProblem {
  id: string;
  title: string;
  companies: {
    name: string;
    logoUrl: string;
  }[];
}

interface IResponse {
  status: number;
  message: string;
  data: IProblem[];
}
export default function ProblemsTable() {
  const { data } = useServerQuery<IResponse>(KEY);

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
              className="w-full border-b-2 border-dashed border-gray-200/70 flex justify-between"
            >
              <div className="p-4 w-fit">
                <h2 className="text-lg font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                  {problem.title}
                </h2>
              </div>
              <div className="flex">
                <div className="border-l-2 border-dashed w-36 h-full border-gray-200/70  flex items-center  justify-center">
                  <Badge variant="outline"> Not Started </Badge>
                </div>
                <div className="border-l-2 border-dashed w-36 h-full border-gray-200/70  flex flex-col items-center justify-center gap-2">
                  <div className="flex -space-x-2 max-w-36">
                    {problem.companies.map((company) => {
                      return (
                        <Avatar key={company.name} className="ring-1 ring-black/10 bg-white">
                          <AvatarImage src={company.logoUrl} />
                          <AvatarFallback>
                            {company.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      );
                    })}
                  </div>
                </div>
                <div className="border-l-2 border-dashed w-36 h-full border-gray-200/70  flex cursor-pointer items-center justify-center">
                  <Link href={`/problem/${problem.id}`}>
                    <ArrowRight className="hover:translate-x-1 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
