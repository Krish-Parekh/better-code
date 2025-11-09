"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface TestCase {
  id: string;
  input: string;
  output: string;
}

type TestCaseStatus = "success" | "error" | "pending" | null;

interface TestCasesProps {
  testCases?: TestCase[];
  actualOutputs?: Record<string, string>;
  testCaseStatuses?: Record<string, TestCaseStatus>;
}

export default function TestCases({ 
  testCases = [], 
  actualOutputs = {},
  testCaseStatuses = {}
}: TestCasesProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  if (!testCases || testCases.length === 0) {
    return (
      <div className="h-full w-full p-4 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No test cases available</p>
      </div>
    );
  }

  const selectedTestCase = testCases[selectedIndex];
  const getStatusColor = (status: TestCaseStatus) => {
    switch (status) {
      case "success":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "error":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      default:
        return "bg-muted hover:bg-muted/80 text-foreground";
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-4 border-b flex gap-2 overflow-x-auto">
        {testCases.map((testCase, index) => {
          const status = testCaseStatuses[testCase.id] || null;
          return (
            <button
              key={testCase.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                selectedIndex === index
                  ? getStatusColor(status) + " ring-2 ring-offset-2 ring-offset-background ring-ring"
                  : getStatusColor(status)
              )}
            >
              Test Case {index + 1}
            </button>
          );
        })}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {selectedTestCase && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2 text-muted-foreground">Test Case:</p>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                <code>{selectedTestCase.input}</code>
              </pre>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm font-medium mb-2 text-muted-foreground">Expected Output:</p>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                <code>{selectedTestCase.output}</code>
              </pre>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm font-medium mb-2 text-muted-foreground">Actual Output:</p>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto min-h-[60px]">
                <code>{actualOutputs[selectedTestCase.id] || ""}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

