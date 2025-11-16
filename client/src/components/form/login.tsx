"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .max(255, "Email must be at most 255 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(255, "Password must be at most 255 characters"),
});

type TLoginSchema = z.infer<typeof loginSchema>;
export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: TLoginSchema) => {
    try {
      setIsLoading(true);
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/problems",
      });

      if (response.error) {
        toast.error(response.error.message);
      }

      if (response.data) {
        toast.success("Logged in successfully");
        router.push("/problems");
      }
    } catch (error) {
      toast.error("Failed to login, Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <CardHeader>
            <CardTitle className="text-lg">Sign in to Your Account</CardTitle>
            <CardDescription>
              Continue solving coding challenges and track your progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-sm font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90 underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full py-2 font-medium cursor-pointer"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground dark:text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90 underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
