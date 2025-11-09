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
import { useRouter } from "next/navigation";
import { useServerMutation } from "@/hooks/useMutation";
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
const KEY = "/auth/login";

export default function LoginForm() {
  const router = useRouter();
  const { trigger, isMutating } = useServerMutation<TLoginSchema, unknown>(
    KEY,
    {
      onSuccess: () => {
        toast.success("Logged in successfully");
        router.push("/problems");
      },
    },
  );
  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: TLoginSchema) => {
    await trigger(data);
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
                      <FormLabel>Password</FormLabel>
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
              disabled={isMutating}
              onClick={form.handleSubmit(onSubmit)}
            >
              {isMutating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Login
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
