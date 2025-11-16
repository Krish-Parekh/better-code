"use client";

import { useEffect, useState } from "react";
import { useMDXComponents } from "@/hooks/useMDX";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

interface QuestionProps {
    bodyMdx: string
}

export default function Question({ bodyMdx }: QuestionProps) {
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
    useEffect(() => {
        const fetchMdxSource = async () => {
            const mdxSource = await serialize(bodyMdx, { mdxOptions: { remarkPlugins: [remarkGfm] } });
            setMdxSource(mdxSource);
        }
        fetchMdxSource();
    }, [bodyMdx])
    return (
        <div className="h-full w-full p-4 pb-8 overflow-y-scroll">
            {mdxSource && (
                <MDXRemote {...mdxSource as unknown as MDXRemoteSerializeResult} components={useMDXComponents} />
            )}
        </div>
    )
}