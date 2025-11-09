"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useServerQuery } from "@/hooks/useQuery";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useState, useEffect } from "react";
import { useMDXComponents } from "@/hooks/useMDX";
import { useParams } from "next/navigation";
import CodeEditor from "@/components/problem/code-editor";
import TestCases from "@/components/problem/test-cases";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ArrowLeftIcon } from "lucide-react";
import { PlayIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const KEY = `/problems`;

interface TestCase {
  id: string;
  input: string;
  output: string;
}

interface Problem {
  id: string;
  title: string;
  bodyMdx: string;
  createdAt: string;
  updatedAt: string;
  testCases: TestCase[];
}

interface IResponse {
  status: number;
  message: string;
  data?: Problem;
}

export default function ProblemPage() {
  const { id } = useParams();
  const { data: problem } = useServerQuery<IResponse>(`${KEY}/${id}`);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null,
  );
  useEffect(() => {
    const fetchMdxSource = async () => {
      if (problem?.data?.bodyMdx) {
        setMdxSource(await serialize(problem?.data?.bodyMdx));
      }
    };
    fetchMdxSource();
  }, [problem?.data?.bodyMdx]);
  return (
    <div className="h-screen max-h-screen overflow-hidden">
      <div className="p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/problems">
            <ArrowLeftIcon className="size-6 cursor-pointer" />
          </Link>
          <h1 className="text-2xl font-bold">{problem?.data?.title}</h1>

        </div>
        <div className="flex">
          <ButtonGroup>
            <Button variant="outline" size="icon" disabled>
              <PlayIcon className="size-4" />
            </Button>
            <Button className="bg-green-500 text-white hover:bg-green-600/90 disabled:opacity-50">
              Submit
            </Button>
          </ButtonGroup>
        </div>  
      </div>
      <ResizablePanelGroup direction="horizontal" className="h-screen">
        <ResizablePanel defaultSize={30}>
          {mdxSource && (
            <div className="h-full w-full p-4 overflow-y-scroll">
              <MDXRemote {...mdxSource} components={useMDXComponents} />
            </div>
          )}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={60}>
              <CodeEditor />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40}>
              <TestCases testCases={problem?.data?.testCases} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
