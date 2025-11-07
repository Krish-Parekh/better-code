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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input";
import Link from "next/dist/client/link";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";

const registerSchema = z.object({
  username: z.string().min(1).max(255),
  email: z.email().max(255),
  password: z.string().min(8).max(255),
});

export default function RegisterForm() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    const response = await fetch("http://localhost:8000/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      console.log("Registered successfully");
    } else {
      console.log("Failed to register");
    }
  }

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <CardHeader>
            <CardTitle className="text-lg">Join the community</CardTitle>
            <CardDescription>
              Create an account to start solving coding challenges and track
              your progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField control={form.control} name="username" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="john.doe@example.com" />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Password" />
                    </FormControl>
                  </FormItem>
                )} />
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button onClick={form.handleSubmit(onSubmit)} type="submit" className="w-full py-2 font-medium cursor-pointer">
              Create account
            </Button>
          </CardFooter>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground dark:text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90 underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
