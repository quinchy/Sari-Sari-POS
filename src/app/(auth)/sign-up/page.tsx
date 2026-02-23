import { AccountForm } from "@/features/auth/components/account-form";
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

export default function SignUp() {
  return (
    <div className="w-full max-w-lg space-y-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>
      <Card>
        <CardContent>
          <AccountForm />
        </CardContent>
      </Card>
      <CardFooter className="flex items-center justify-center">
        <h2 className="text-muted-foreground text-sm">
          Already have an account?
        </h2>
        <Button variant="link">
          <Link href="/login">Sign In</Link>
        </Button>
      </CardFooter>
    </div>
  );
}
