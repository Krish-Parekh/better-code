import MaxWidthContainer from "@/components/common/max-width-container";
import Navbar from "@/components/common/navbar";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <MaxWidthContainer className="h-screen border-s-2 border-e-2 border-dashed border-gray-200 flex flex-col">
      <Navbar />
      <main className="p-8 border-b-2 flex-1 border-dashed flex items-center justify-center border-gray-200">
        <div className="flex flex-col max-w-2xl items-center justify-center">
          <h2 className="text-6xl font-bold mb-4 tracking-tighter text-center">
            A New Way to Learn
          </h2>
          <p className="mb-6 text-md text-center">
            BetterCode is a platform to practice coding problems and improve
            your skills. Join us and start your coding journey today!
          </p>
          <Link href="/get-started" >
            <Button size="lg" className="cursor-pointer">
              Get Started <ArrowUpRight />
            </Button>
          </Link>
        </div>
      </main>
      <div className="flex border-b-2 border-dashed border-gray-200">
        <div className="flex flex-col items-center flex-1 border-e-2 border-dashed border-gray-200 p-8">
          <h3 className="text-4xl font-bold">50+</h3>
          <p>Problems</p>
        </div>
        <div className="flex flex-col flex-1 items-center border-e-2 border-dashed border-gray-200 p-8">
          <h3 className="text-4xl font-bold">3+</h3>
          <p>Languages</p>
        </div>
        <div className="flex flex-col flex-1 items-center border-dashed border-gray-200 p-8">
          <h3 className="text-4xl font-bold">10+</h3>
          <p>Topics</p>
        </div>
      </div>
    </MaxWidthContainer>
  );
}
