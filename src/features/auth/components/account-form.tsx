"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountFormSchema } from "@/features/auth/validations/auth";
import { AccountFormData } from "@/features/auth/types/auth";
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
import { useSignUpStore } from "@/features/auth/store/use-signup-store";

export function AccountForm() {
  const setStep = useSignUpStore((state) => state.setStep);
  const setAccountValues = useSignUpStore((state) => state.setAccountDatas);

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = (data: AccountFormData) => {
    setAccountValues(data);
    setStep(2);
  };

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
                  aria-invalid={fieldState.invalid}
                  placeholder="Re-enter the password"
                />
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" className="w-full">
        Next
      </Button>
    </form>
  );
}
