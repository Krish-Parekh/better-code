"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { ITestCase } from "@/types";

export type TestCaseState = "pending" | "running" | "passed" | "failed";

interface TestCasesProps {
	testCases?: ITestCase[];
	testCaseStates?: Record<number, TestCaseState>;
}

export default function TestCases({ testCases = [], testCaseStates = {} }: TestCasesProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  if (!testCases || testCases.length === 0) {
    return (
      <div className="h-full w-full p-4 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No test cases available</p>
      </div>
    );
  }

  const selectedTestCase = testCases[selectedIndex];

  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-4 border-b flex gap-2 overflow-x-auto">
        {testCases.map((testCase, index) => {
          const state = testCaseStates[index] || "pending";
          const isSelected = selectedIndex === index;
          
          return (
            <button
              key={testCase.testCaseId}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2",
                isSelected && "ring-2 ring-offset-2 ring-offset-background ring-ring",
                state === "passed" && isSelected && "bg-green-500 text-white",
                state === "passed" && !isSelected && "bg-green-500/20 text-green-600 hover:bg-green-500/30",
                state === "failed" && isSelected && "bg-red-500 text-white",
                state === "failed" && !isSelected && "bg-red-500/20 text-red-600 hover:bg-red-500/30",
                state === "running" && "bg-blue-500/20 text-blue-600",
                state === "pending" && isSelected && "bg-primary text-primary-foreground",
                state === "pending" && !isSelected && "bg-muted hover:bg-muted/80 text-foreground"
              )}
            >
              {state === "passed" && <CheckCircle2 className="size-4" />}
              {state === "failed" && <XCircle className="size-4" />}
              {state === "running" && <Loader2 className="size-4 animate-spin" />}
              Test Case {index + 1}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selectedTestCase && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2 text-muted-foreground">
                Test Case:
              </p>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                <code>{selectedTestCase.input}</code>
              </pre>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium mb-2 text-muted-foreground">
                Expected Output:
              </p>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                <code>{selectedTestCase.output}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
