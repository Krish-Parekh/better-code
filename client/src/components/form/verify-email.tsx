"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function VerifyEmailForm() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const callbackURL = searchParams.get("callbackURL");
  const router = useRouter();

  const verifyEmail = async () => {
    try {
      if (token && callbackURL) {
        const response = await authClient.verifyEmail({
          query: { token },
        });

        if (response.error) {
          setStatus("error");
          toast.error(response.error.message);
        } else if (response.data) {
          setStatus("success");
          toast.success("Email verified successfully");
          router.push(callbackURL);
        }
      } else {
        setStatus("error");
        toast.error("Invalid verification link");
      }
    } catch (error) {
      setStatus("error");
      toast.error("Failed to verify email");
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token, callbackURL]);

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <CardHeader className="text-center space-y-3">
            <div className="flex justify-center">
              {status === "success" && (
                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
              )}
              {status === "error" && (
                <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-500" />
              )}
              {status === "loading" && (
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              )}
            </div>
            <CardTitle className="text-xl">
              {status === "success"
                ? "Email Verified"
                : status === "error"
                  ? "Verification Failed"
                  : "Verifying Email"}
            </CardTitle>
            <CardDescription>
              {status === "success"
                ? "Your email has been verified successfully"
                : status === "error"
                  ? "The verification link may have expired or is invalid"
                  : "Please wait while we confirm your email"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
