"use client";

import { AccountForm } from "@/features/auth/components/account-form";
import { StoreForm } from "@/features/auth/components/store-form";
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
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useSignUpStore } from "@/features/auth/store/use-signup-store";
import { Activity } from "react";

export default function SignUp() {
  const step = useSignUpStore((state) => state.step);

  return (
    <>
      <Activity mode={step === 1 ? "visible" : "hidden"}>
        <Step1 />
      </Activity>
      <Activity mode={step === 2 ? "visible" : "hidden"}>
        <Step2 />
      </Activity>
    </>
  );
}

function Step1() {
  return (
    <div className="w-full min-w-sm lg:min-w-lg py-5 space-y-8">
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

function Step2() {
  const setStep = useSignUpStore((state) => state.setStep);
  const back = () => {
    setStep(1);
  };
  return (
    <div className="w-full min-w-sm lg:min-w-lg py-5 space-y-8">
      <CardHeader className="grid grid-cols-[auto_1fr] items-center gap-x-4">
        <Button variant="outline" size="icon" className="w-fit" onClick={back}>
          <HugeiconsIcon icon={ArrowLeft01Icon} />
        </Button>
        <div className="">
          <CardTitle className="text-3xl font-bold">Setup Store</CardTitle>
          <CardDescription>Choose a name for your Store</CardDescription>
        </div>
      </CardHeader>
      <Card>
        <CardContent>
          <StoreForm />
        </CardContent>
      </Card>
    </div>
  );
}
