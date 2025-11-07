import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/dist/client/link";

export default function RegisterForm() {
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
            <form action="#" method="post" className="space-y-4">
              <div>
                <Label
                  htmlFor="name-login-05"
                  className="text-sm font-medium text-foreground dark:text-foreground"
                >
                  Name
                </Label>
                <Input
                  type="text"
                  id="name-login-05"
                  name="name-login-05"
                  autoComplete="name-login-05"
                  placeholder="Name"
                  className="mt-2"
                />
              </div>

              <div>
                <Label
                  htmlFor="email-login-05"
                  className="text-sm font-medium text-foreground dark:text-foreground"
                >
                  Email
                </Label>
                <Input
                  type="email"
                  id="email-login-05"
                  name="email-login-05"
                  autoComplete="email-login-05"
                  placeholder="ephraim@blocks.so"
                  className="mt-2"
                />
              </div>

              <div>
                <Label
                  htmlFor="password-login-05"
                  className="text-sm font-medium text-foreground dark:text-foreground"
                >
                  Password
                </Label>
                <Input
                  type="password"
                  id="password-login-05   "
                  name="password-login-05"
                  autoComplete="password-login-05"
                  placeholder="Password"
                  className="mt-2"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full py-2 font-medium">
              Create account
            </Button>
          </CardFooter>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground dark:text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
