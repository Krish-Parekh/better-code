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
import Link from "next/link";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";

const loginSchema = z.object({
  email: z.email().max(255),
  password: z.string().min(8).max(255),
});

export default function LoginForm() {

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {}
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
            <form action="#" method="post" className="space-y-4">
              <Form {...form}>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="ephraim@blocks.so"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </Form>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full py-2 font-medium">
              Login
            </Button>
          </CardFooter>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground dark:text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
