"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useSignIn } from "@/features/auth/hooks/use-auth";
import { signInSchema } from "@/features/auth/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignInData as SignInFormData } from "@/features/auth/types/auth";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

export function SignInForm() {
  const { isSigningIn, signIn } = useSignIn();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const response = await signIn(data);
      console.log("Login successful:", response);
    } catch (error) {}
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                <FieldTitle>Email</FieldTitle>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  type="email"
                  disabled={isSigningIn}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your email"
                />
              </FieldContent>
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                <FieldTitle>Password</FieldTitle>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  type="password"
                  disabled={isSigningIn}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your password"
                />
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" disabled={isSigningIn} className="w-full">
        {isSigningIn ? (
          <>
            <Spinner />
            Signing In...
          </>
        ) : (
          "Sign-in"
        )}
      </Button>
    </form>
  );
}
