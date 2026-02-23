"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSignUp } from "@/features/auth/hooks/use-auth";
import { signUpSchema } from "@/features/auth/validations/auth";
import { SignUpData as SignUpFormData } from "@/features/auth/types/auth";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldTitle,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export function AccountForm() {
  const router = useRouter();
  const { isSigningUp, signUp, signUpError } = useSignUp();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });
  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await signUp({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      toast.success(response.message);
      router.push("/sign-in");
    } catch (error) {
      console.log(error);
    }
  };
  if (signUpError) {
    toast.error(signUpError.message);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <FieldTitle>First Name</FieldTitle>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    type="text"
                    disabled={isSigningUp}
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. John"
                  />
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <FieldTitle>Last Name</FieldTitle>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    type="text"
                    disabled={isSigningUp}
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Doe"
                  />
                </FieldContent>
              </Field>
            )}
          />
        </div>

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
                  disabled={isSigningUp}
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. johndoe@gmail.com"
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
                  variant="password"
                  disabled={isSigningUp}
                  aria-invalid={fieldState.invalid}
                  placeholder="At least 8 characters"
                />
              </FieldContent>
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                <FieldTitle>Confirm Password</FieldTitle>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  variant="password"
                  disabled={isSigningUp}
                  aria-invalid={fieldState.invalid}
                  placeholder="Re-enter the password"
                />
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" disabled={isSigningUp} className="w-full">
        {isSigningUp ? (
          <>
            <Spinner />
            Creating...
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}
