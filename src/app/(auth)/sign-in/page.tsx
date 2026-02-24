import { SignInForm } from "@/features/auth/components/sign-in-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignIn() {
  return (
    <div className="w-full min-w-sm lg:min-w-lg py-5 space-y-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Welcome back!</CardTitle>
        <CardDescription>
          Sign in to access your sari-sari store, and products.
        </CardDescription>
      </CardHeader>
      <Card>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
      <CardFooter className="flex items-center justify-center">
        <h2 className="text-muted-foreground text-sm">
          Don't have an account?
        </h2>
        <Button variant="link">
          <Link href="/sign-up">Sign up here</Link>
        </Button>
      </CardFooter>
    </div>
  );
}
