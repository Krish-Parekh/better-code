"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const isProblemsPage = pathname === "/problems";
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <nav className="border-b-2 border-dashed border-gray-200 flex justify-between items-center">
      <Link className="p-4" href="/">
        <h1 className="text-2xl font-bold">BetterCode</h1>
      </Link>
      {isProblemsPage ? (
        <div className="w-96 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
            <Input
              placeholder="Search"
              className="w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="flex h-full">
          <div className="h-full cursor-pointer min-w-32">
            <Link
              href="/login"
              className="flex p-4 border-s-2 border-dashed border-gray-200 h-full items-center justify-center gap-4"
            >
              <h2 className="text-lg font-bold text-center">Login</h2>
            </Link>
          </div>
          <div className="h-full cursor-pointer min-w-32">
            <Link
              href="/register"
              className="flex p-4 border-s-2 border-dashed border-gray-200 h-full items-center justify-center gap-4"
            >
              <h2 className="text-lg font-bold text-center">Register</h2>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
