"use client";

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormHeader from "@/components/form-header";
import { gcashEarningSchema } from "@/features/gcash/validation/gcash";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GCashEarningData as GCashEarningFormData } from "@/features/gcash/types/gcash";

export default function GCashEarningForm() {
  const form = useForm<GCashEarningFormData>({
    resolver: zodResolver(gcashEarningSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = (gcashEarningData: GCashEarningFormData) => {
    console.log(gcashEarningData);
  };

  return (
    <main className="space-y-5">
      <header>
        <FormHeader
          title="Add GCash Earning"
          description="Add your daily GCash Earning for this day."
        />
      </header>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-end gap-4"
      >
        <Controller
          control={form.control}
          name="amount"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                <FieldTitle>Amount</FieldTitle>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter your GCash Earning this day"
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FieldContent>
            </Field>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </main>
  );
}
