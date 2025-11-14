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

const verifyEmailSchema = z.object({
  token: z
    .string()
    .min(1, "Verification token is required")
    .max(255, "Token must be at most 255 characters"),
});

type TVerifyEmailSchema = z.infer<typeof verifyEmailSchema>;

export default function VerifyEmailForm() {
  const form = useForm<TVerifyEmailSchema>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      token: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: TVerifyEmailSchema) => {
    // UI only - no functionality
    console.log(data);
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <CardHeader>
            <CardTitle className="text-lg">Verify Your Email</CardTitle>
            <CardDescription>
              Enter the verification code sent to your email address to verify
              your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter verification code"
                          autoComplete="off"
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
            >
              Verify Email
            </Button>
          </CardFooter>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground dark:text-muted-foreground">
          Didn't receive the code?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90 underline"
          >
            Resend verification email
          </Link>
        </p>
      </div>
    </div>
  );
}
