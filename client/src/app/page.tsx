"use client";
import MaxWidthContainer from "@/components/common/max-width-container";
import Navbar from "@/components/common/navbar";
import { StripedPattern } from "@/components/magicui/striped-pattern";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import { Highlighter } from "@/components/ui/highlighter";
import { NumberTicker } from "@/components/ui/number-ticker";
import { TextAnimate } from "@/components/ui/text-animate";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <MaxWidthContainer className="h-screen border-s-2 border-e-2 border-dashed border-gray-200 flex flex-col">
      <Navbar />
      <main className="p-8 border-b-2 flex-1 border-dashed flex items-center justify-center border-gray-200 relative">
        <StripedPattern className="absolute inset-0 -z-10" />
        <div className="flex flex-col max-w-3xl gap-4 items-center justify-center">
          <TextAnimate className="text-7xl font-bold tracking-tighter"  animation="blurInUp" by="character" once>

            A New Way to Learn
          </TextAnimate>
          <p className="text-lg text-center">
            BetterCode is a platform to <Highlighter>practice coding</Highlighter> problems and improve
            your skills. Join us and start your coding journey today!
          </p>
          <Link href="/problems" >
            <Button size="lg" className="cursor-pointer">
              Get Started <ArrowUpRight />
            </Button>
          </Link>
        </div>
      </main>
      <div className="flex border-b-2 border-dashed border-gray-200">
        <div className="flex flex-col items-center flex-1 border-e-2 border-dashed border-gray-200 p-8">
          <NumberTicker value={50} className="text-4xl font-bold" />
          <p>Problems</p>
        </div>
        <div className="flex flex-col flex-1 items-center border-e-2 border-dashed border-gray-200 p-8">
          <NumberTicker value={3} className="text-4xl font-bold" />

          <p>Languages</p>
        </div>
        <div className="flex flex-col flex-1 items-center border-dashed border-gray-200 p-8">
          <NumberTicker value={10} className="text-4xl font-bold" />
          <p>Topics</p>
        </div>
      </div>
    </MaxWidthContainer>
  );
}
