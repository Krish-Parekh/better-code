"use client";

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import Link from "next/link"
import { ArrowLeftIcon, PlayIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useParams } from "next/navigation"
import { useServerQuery } from "@/hooks/useQuery";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Question from "@/components/problem/question";
import CodeEditor from "@/components/problem/code-editor";
import TestCases from "@/components/problem/test-cases";

const KEY = `/problems`;

interface IResponse<T> {
  status: number
  message: string
  data: T
}
interface ITestCase {
  testCaseId: string
  input: string
  output: string
}
interface IProblemById {
  id: string;
  title: string
  bodyMdx: string
  metadata: {
    templates: {
      python: string
      javascript: string
      java: string
    }
  }
  testCases: ITestCase[]
}

export default function ProblemPage() {
  const { id } = useParams();
  const { data: problem } = useServerQuery<IResponse<IProblemById>>(`${KEY}/${id}`);

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
            className="bg-green-500 text-white hover:bg-green-600/90 disabled:opacity-50"
          >
            Submit
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
        {problem?.data?.bodyMdx && <Question bodyMdx={problem.data.bodyMdx as string} />}
      </ResizablePanel>
      <ResizablePanel defaultSize={60}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={60}>
            <CodeEditor templates={problem?.data?.metadata?.templates || { python: "", javascript: "", java: "" }} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40}>
            <TestCases testCases={problem?.data?.testCases || []} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
}