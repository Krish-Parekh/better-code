"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Component that listens for auth:logout events and redirects to login
 */
export default function LogoutHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = () => {
      router.push("/login");
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [router]);

  return null;
}

