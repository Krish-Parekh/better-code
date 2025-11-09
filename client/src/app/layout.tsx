import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AppProviders from "@/providers";
import { Toaster } from "sonner";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricole",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Better Code",
  description: "A clone of Leetcode built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(bricolage.className, "antialiased")}>
        <AppProviders>{children}</AppProviders>
        <Toaster />
        <SmoothCursor />
      </body>
    </html>
  );
}
