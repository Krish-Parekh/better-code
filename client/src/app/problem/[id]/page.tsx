"use client";

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import Link from "next/link"
import { ArrowLeftIcon, Loader2, PlayIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useParams } from "next/navigation"
import { useServerQuery } from "@/hooks/useQuery";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Question from "@/components/problem/question";
import CodeEditor from "@/components/problem/code-editor";
import TestCases from "@/components/problem/test-cases";
import { useServerMutation } from "@/hooks/useMutation";
import { useSSE } from "@/hooks/useSSE";
import { useState, useEffect } from "react";
import type { TestCaseState } from "@/components/problem/test-cases";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SubmissionsTable from "@/components/problem/submissions-table";

import type { IResponse, IProblemById } from "@/types";

const KEY = `/api/problems`;

interface SubmissionStatus {
	type: "status" | "testCase" | "completed" | "failed";
	status: "PENDING" | "PROCESSING" | "ACCEPTED" | "REJECTED" | "PASSED" | "FAILED";
	message: string;
	currentTestCase?: number;
	totalTestCases?: number;
	passed?: boolean;
	expected?: string;
	actual?: string;
	error?: string;
	result?: any;
}

interface SubmissionStatus {
  type: "status" | "testCase" | "completed" | "failed";
  status: "PENDING" | "PROCESSING" | "ACCEPTED" | "REJECTED" | "PASSED" | "FAILED";
  message: string;
  currentTestCase?: number;
  totalTestCases?: number;
  passed?: boolean;
  expected?: string;
  actual?: string;
  error?: string;
  result?: any;
}

export default function ProblemPage() {
  const { id } = useParams();
  const { data: problem } = useServerQuery<IResponse<IProblemById>>(`${KEY}/${id}`);
  const [jobId, setJobId] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus | null>(null);
  const [testCaseStates, setTestCaseStates] = useState<Record<number, TestCaseState>>({});
  const [allTestsPassed, setAllTestsPassed] = useState(false);

  const { data, trigger, isMutating } = useServerMutation<{
    problemId: string;
    language: string;
    code: string;
  }, IResponse<{ jobId: string; statusURL: string }>>("/submissions");

  // Listen to SSE events when jobId is available
  useSSE<SubmissionStatus>(
    jobId ? `/submissions/${jobId}/status` : null,
    {
      onMessage: (data) => {
        setSubmissionStatus(data);
        console.log("SSE Event:", data);

        // Update test case states based on SSE events
        if (data.type === "testCase" && data.currentTestCase !== undefined) {
          const testCaseIndex = data.currentTestCase - 1; // Convert to 0-based index
          
          // If test case is running, mark it as running
          if (data.status === "PROCESSING" || data.status === "PENDING") {
            setTestCaseStates((prev) => ({
              ...prev,
              [testCaseIndex]: "running",
            }));
          } 
          // If test case has a result (passed/failed), update accordingly
          else if (data.status === "PASSED" || data.status === "FAILED" || data.passed !== undefined) {
            setTestCaseStates((prev) => ({
              ...prev,
              [testCaseIndex]: data.passed || data.status === "PASSED" ? "passed" : "failed",
            }));
          }
        }

        // Mark all test cases as running when processing starts
        if (data.type === "status" && data.status === "PROCESSING" && data.totalTestCases) {
          setTestCaseStates((prev) => {
            const newStates: Record<number, TestCaseState> = {};
            for (let i = 0; i < data.totalTestCases!; i++) {
              if (!prev[i] || prev[i] === "pending") {
                newStates[i] = "running";
              }
            }
            return { ...prev, ...newStates };
          });
        }

        // Check if all tests passed
        if (data.type === "completed" && data.status === "ACCEPTED") {
          setAllTestsPassed(true);
          // Mark all remaining test cases as passed
          if (data.totalTestCases) {
            setTestCaseStates((prev) => {
              const newStates: Record<number, TestCaseState> = {};
              for (let i = 0; i < data.totalTestCases!; i++) {
                if (prev[i] !== "failed") {
                  newStates[i] = "passed";
                }
              }
              return { ...prev, ...newStates };
            });
          }
        }

        // Reset on failure
        if (data.type === "failed" || data.status === "REJECTED") {
          setAllTestsPassed(false);
        }
      },
      onError: (error) => {
        setAllTestsPassed(false);
      },
    }
  );

  // Reset test case states when starting a new submission
  useEffect(() => {
    if (jobId) {
      setTestCaseStates({});
      setAllTestsPassed(false);
    }
  }, [jobId]);

  const handleSubmit = async () => {
    try {
      const result = await trigger({
        problemId: id as string,
        language: "python",
        code: "# Python - Two Sum\nclass Solution:\n    def solve(self, nums, target):\n        num_map = {}\n        for i, num in enumerate(nums):\n            complement = target - num\n            if complement in num_map:\n                return [num_map[complement], i]\n            num_map[num] = i\n        return []\n\nif __name__ == \"__main__\":\n    import sys\n    input_text = sys.stdin.read()\n    \n    lines = [line.strip() for line in input_text.splitlines() if line.strip()]\n    \n    nums = [int(x) for x in lines[0].split()]\n    target = int(lines[1])\n    \n    ans = Solution().solve(nums, target)\n    print(\",\".join(map(str, ans)))",
      });

      if (result?.data?.jobId) {
        setJobId(result.data.jobId);
        setSubmissionStatus({
          type: "status",
          status: "PENDING",
          message: "Submission queued...",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  }

  


  return <div className="h-screen max-h-screen overflow-hidden">
    <div className="p-3 flex justify-between items-center">
      <Link href="/problems">
        <ArrowLeftIcon className="size-6 cursor-pointer" />
      </Link>
      <div className="flex">
        <ButtonGroup>
          <Button variant="outline" size="icon" disabled>
            <PlayIcon className="size-4" />
          </Button>
          <Button
            className={allTestsPassed 
              ? "bg-green-600 text-white hover:bg-green-700/90 disabled:opacity-50" 
              : "bg-green-500 text-white hover:bg-green-600/90 disabled:opacity-50"
            }
            disabled={isMutating}
            onClick={handleSubmit}
          >
            {isMutating && <Loader2 className="size-4 animate-spin mr-2" />}
            {allTestsPassed ? "Accepted ✓" : isMutating ? "Submitting..." : "Submit"}
          </Button>
        </ButtonGroup>
      </div>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>

    <ResizablePanelGroup direction="horizontal" className="h-screen">
      <ResizablePanel defaultSize={40}>
        <Tabs defaultValue="problem" className="h-full flex flex-col">
          <div className="p-4 border-b">
            <TabsList>
              <TabsTrigger value="problem">Problem</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="problem" className="flex-1 overflow-auto m-0">
            {problem?.data?.bodyMdx && <Question bodyMdx={problem.data.bodyMdx as string} />}
          </TabsContent>
          <TabsContent value="submissions" className="flex-1 overflow-auto m-0">
            <SubmissionsTable problemId={id as string} />
          </TabsContent>
        </Tabs>
      </ResizablePanel>
      <ResizablePanel defaultSize={60}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={60}>
            <CodeEditor templates={problem?.data?.metadata?.templates || { python: "", javascript: "", java: "" }} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40}>
            <TestCases 
              testCases={problem?.data?.testCases || []} 
              testCaseStates={testCaseStates}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
}