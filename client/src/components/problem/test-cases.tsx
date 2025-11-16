"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface TestCase {
  testCaseId: string;
  input: string;
  output: string;
}

interface TestCasesProps {
  testCases?: TestCase[];
}

export default function TestCases({ testCases = [] }: TestCasesProps) {
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
        {testCases.map((testCase, index) => (
          <button
            key={testCase.testCaseId}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
              selectedIndex === index
                ? "bg-primary text-primary-foreground ring-2 ring-offset-2 ring-offset-background ring-ring"
                : "bg-muted hover:bg-muted/80 text-foreground"
            )}
          >
            Test Case {index + 1}
          </button>
        ))}
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
