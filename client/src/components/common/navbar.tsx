"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Navbar() {
  const { useSession, signOut } = authClient;
  const session = useSession();
  const user = session.data?.user;
  const isAuthenticated = !!user;
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await signOut();
      if (response.error) {
        toast.error(response.error.message);
      }
      if (response.data) {
        toast.success("Logged out successfully");
        router.push("/login");
      }
    } catch (error) {
      toast.error("Failed to logout, Please try again.");
    }
  }

  return (
    <nav className="border-b-2 border-dashed border-gray-200 flex justify-between items-center">
      <Link className="p-4" href="/">
        <h1 className="text-2xl font-bold">BetterCode</h1>
      </Link>
      {isAuthenticated && (
        <div className="flex h-full">
          <div
            className="h-full cursor-pointer min-w-32"
            onClick={handleLogout}
          >
            <div className="flex p-4 border-s-2 border-dashed border-gray-200 h-full items-center justify-center gap-4">
              <h2 className="text-lg font-bold text-center">Logout</h2>
            </div>
          </div>
        </div>
      )}
    </nav>
  );

}

