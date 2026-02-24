"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@/features/auth/hooks/use-auth";
import { storeFormSchema } from "@/features/auth/validations/auth";
import { StoreFormData } from "@/features/auth/types/auth";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSignUpStore } from "@/features/auth/store/use-signup-store";

export function StoreForm() {
  const { isSigningUp, signUp } = useSignUp();
  const accountDatas = useSignUpStore((state) => state.accountDatas);

  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      storeName: "",
    },
  });

  const onSubmit = (storeDatas: StoreFormData) => {
    const signUpData = {
      ...accountDatas,
      ...storeDatas,
    };
    signUp(signUpData);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
      <Controller
        name="storeName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              <FieldTitle>Store Name</FieldTitle>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldLabel>
            <FieldContent>
              <Input
                {...field}
                disabled={isSigningUp}
                aria-invalid={fieldState.invalid}
                placeholder="e.g. Alice Sari-Sari Store"
              />
            </FieldContent>
          </Field>
        )}
      />

      <Button type="submit" disabled={isSigningUp} className="w-full">
        {isSigningUp ? (
          <>
            <Spinner />
            Submitting
          </>
        ) : (
          "Submit"
        )}
      </Button>
    </form>
  );
}
