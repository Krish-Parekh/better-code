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
import remarkGfm from "remark-gfm";
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
import { useServerMutation } from "@/hooks/useMutation";
import { useEventSource } from "@/hooks/useEventSource";
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
  metadata: {
    templates: Record<string, string>;
  };
  testCases: TestCase[];
}

interface IResponse {
  status: number;
  message: string;
  data?: Problem;
}

interface SubmissionResult {
  type?: "progress" | "completed" | "failed";
  status?: string;
  results?: any;
  error?: string;
}

export default function ProblemPage() {
  const { id } = useParams();
  const { data: problem } = useServerQuery<IResponse>(`${KEY}/${id}`);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null,
  );
  const [submissionStatusUrl, setSubmissionStatusUrl] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { trigger } = useServerMutation<{ problemId: string, language: string, code: string }, { data: { jobId: string, statusURL: string } }>(`/submissions`, {
    onSuccess: (data) => {
      console.log("Submission created:", data?.data);
      // Set the status URL to start listening for updates
      const baseURL = process.env.NEXT_PUBLIC_SERVER_URL as string;
      setSubmissionStatusUrl(`${baseURL}${data?.data?.statusURL}`);
      setIsSubmitting(true);
    },
    onError: (error) => {
      console.error("Submission error:", error);
      setIsSubmitting(false);
    },
  });

  // Set up EventSource to listen for submission updates
  const { data: eventData, error: eventError, close } = useEventSource(
    submissionStatusUrl,
    {
      onError: (event) => {
        console.error("EventSource error:", event);
        setIsSubmitting(false);
      },
      enabled: !!submissionStatusUrl,
    }
  );

  // Update submission result when eventData changes
  useEffect(() => {
    if (eventData) {
      console.log("EventSource message:", eventData);
      setSubmissionResult(eventData);
      
      // Close connection if submission is completed or failed
      if (eventData.type === "completed" || eventData.type === "failed") {
        setIsSubmitting(false);
        close();
        setSubmissionStatusUrl(null);
      }
    }
  }, [eventData, close]);

  const [code, setCode] = useState<string>(problem?.data?.metadata?.templates?.python || "");

  useEffect(() => {
    const fetchMdxSource = async () => {
      if (problem?.data?.bodyMdx) {
        setMdxSource(
          await serialize(problem?.data?.bodyMdx, {
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }),
        );
      }
    };
    fetchMdxSource();
  }, [problem?.data?.bodyMdx]);

  const handleSubmit = async () => {
    // Reset previous submission state
    setSubmissionResult(null);
    setIsSubmitting(true);
    
    try {
      await trigger({
        problemId: id as string,
        language: "python",
        code,
      });
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="h-screen max-h-screen overflow-hidden">
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
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
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
          {mdxSource && (
            <div className="h-full w-full p-4 pb-8 overflow-y-scroll">
              <MDXRemote {...mdxSource} components={useMDXComponents} />
            </div>
          )}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={60}>
              <CodeEditor
                initialCode={code}
                onCodeChange={(code) => setCode(code)}
              />
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
