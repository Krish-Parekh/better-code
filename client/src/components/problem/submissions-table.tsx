"use client";

import { useServerQuery } from "@/hooks/useQuery";
import { Badge } from "../ui/badge";
import { StripedPattern } from "../ui/striped-pattern";

interface ISubmission {
  id: string;
  language: string;
  runtime_ms: number;
  memory_kb: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
}

interface IResponse {
  status: number;
  message: string;
  data: ISubmission[];
}

interface SubmissionsTableProps {
  problemId: string;
}

export default function SubmissionsTable({ problemId }: SubmissionsTableProps) {
  const { data } = useServerQuery<IResponse>(`/submissions/problem/${problemId}`);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "default";
      case "REJECTED":
        return "destructive";
      case "PENDING":
        return "outline";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRuntime = (runtimeMs: number) => {
    if (runtimeMs < 1000) {
      return `${runtimeMs} ms`;
    }
    return `${(runtimeMs / 1000).toFixed(2)} s`;
  };

  const formatMemory = (memoryKb: number) => {
    if (memoryKb < 1024) {
      return `${memoryKb} KB`;
    }
    return `${(memoryKb / 1024).toFixed(2)} MB`;
  };

  return (
    <main>
      <div className="w-full border-b-2 border-dashed border-gray-200 flex justify-between bg-gray-50/50">
        <div className="p-4 w-fit">
          <h3 className="text-lg font-semibold">Submissions</h3>
        </div>
        <div className="flex">
          <div className="border-l-2 border-dashed w-32 h-full border-gray-200/70 flex items-center justify-center">
            <h3 className="text-lg font-semibold">Status</h3>
          </div>
          <div className="border-l-2 border-dashed w-32 h-full border-gray-200/70 flex items-center justify-center">
            <h3 className="text-lg font-semibold">Language</h3>
          </div>
          <div className="border-l-2 border-dashed w-32 h-full border-gray-200/70 flex items-center justify-center">
            <h3 className="text-lg font-semibold">Runtime</h3>
          </div>
          <div className="border-l-2 border-dashed w-32 h-full border-gray-200/70 flex items-center justify-center">
            <h3 className="text-lg font-semibold">Memory</h3>
          </div>
          <div className="border-l-2 border-dashed w-40 h-full border-gray-200/70 flex items-center justify-center">
            <h3 className="text-lg font-semibold">Date</h3>
          </div>
        </div>
      </div>
      <div className="relative">
        <StripedPattern className="absolute inset-0 -z-10" />
        {data?.data && data.data.length > 0 ? (
          data.data.map((submission) => {
            return (
              <div
                key={submission.id}
                className="w-full border-b-2 border-dashed border-gray-200/70 flex justify-between"
              >
                <div className="p-4 w-fit">
                  <h2 className="text-lg font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                    Submission
                  </h2>
                </div>
                <div className="flex">
                  <div className="border-l-2 border-dashed w-32 h-full border-gray-200/70 flex items-center justify-center">
                    <Badge variant={getStatusBadgeVariant(submission.status)}>
                      {submission.status}
                    </Badge>
                  </div>
                  <div className="border-l-2 border-dashed w-32 h-full border-gray-200/70 flex items-center justify-center">
                    <span className="text-sm font-medium uppercase">
                      {submission.language}
                    </span>
                  </div>
                  <div className="border-l-2 border-dashed w-32 h-full border-gray-200/70 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {formatRuntime(submission.runtime_ms)}
                    </span>
                  </div>
                  <div className="border-l-2 border-dashed w-32 h-full border-gray-200/70 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {formatMemory(submission.memory_kb)}
                    </span>
                  </div>
                  <div className="border-l-2 border-dashed w-40 h-full border-gray-200/70 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {formatDate(submission.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full border-b-2 border-dashed border-gray-200/70 flex justify-center items-center p-8">
            <p className="text-muted-foreground">No submissions yet</p>
          </div>
        )}
      </div>
    </main>
  );
}
