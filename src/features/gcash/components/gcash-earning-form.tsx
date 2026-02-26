"use client";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormHeader from "@/components/form-header";
import { gcashEarningInputSchema } from "@/features/gcash/validation/gcash";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GCashEarningData as GCashEarningFormData,
  GCashEarningInputData,
} from "@/features/gcash/types/gcash";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01FreeIcons } from "@hugeicons/core-free-icons";
import { useCreateGCashEarning } from "@/features/gcash/hooks/use-gcash-earning";
import { Spinner } from "@/components/ui/spinner";

export default function GCashEarningForm() {
  const { isCreateGCashEarningPending, createGCashEarning } =
    useCreateGCashEarning();

  const form = useForm<GCashEarningInputData>({
    resolver: zodResolver(gcashEarningInputSchema),
    defaultValues: {
      amount: 0,
      date: undefined,
    },
  });

  const onSubmit = (gcashEarningData: GCashEarningFormData) => {
    createGCashEarning({
      amount: gcashEarningData.amount,
      date: gcashEarningData.date,
    });
  };

  return (
    <main className="space-y-5">
      <header>
        <FormHeader
          title="Add GCash Earning"
          description="Add your daily GCash Earning for this day or other day."
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
        <Controller
          control={form.control}
          name="date"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                <FieldTitle>Date</FieldTitle>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldLabel>
              <FieldContent>
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        data-empty={!field.value}
                        className={cn(
                          "active:scale-100 w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground",
                          !field.value && "text-muted-foreground",
                        )}
                        onBlur={field.onBlur}
                      >
                        <HugeiconsIcon
                          icon={Calendar01FreeIcons}
                          size={24}
                          color="currentColor"
                          strokeWidth={1.5}
                        />
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a date"}
                      </Button>
                    }
                  />
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
              </FieldContent>
            </Field>
          )}
        />
        <Button type="submit" disabled={isCreateGCashEarningPending}>
          {isCreateGCashEarningPending ? (
            <>
              <Spinner />
              Submitting
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </main>
  );
}
