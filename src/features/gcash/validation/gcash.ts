import { z } from "zod";

export const gcashEarningSchema = z.strictObject({
  amount: z
    .number()
    .nonnegative("Amount must not be negative")
    .min(1, "Amount must be above 0")
    .max(1_000_000, "Amount must not exceed 1,000,000")
    .refine((n) => Number.isInteger(n * 100), {
      message: "Amount must have at most 2 decimal places",
    }),
  date: z.preprocess((arg) => {
    if (typeof arg === "string" && arg.length > 0) {
      const parsed = new Date(arg);
      return isNaN(parsed.getTime()) ? arg : parsed;
    }
    return arg;
  }, z.date().optional()),
});

export const gcashEarningInputSchema = z.strictObject({
  amount: z
    .number()
    .nonnegative("Amount must not be negative")
    .min(1, "Amount must be above 0")
    .max(1_000_000, "Amount must not exceed 1,000,000")
    .refine((n) => Number.isInteger(n * 100), {
      message: "Amount must have at most 2 decimal places",
    }),
  date: z.date().optional(),
});

export const createGCashEarningSchema = z.strictObject({
  storeId: z.uuid("Invalid store ID format"),
  amount: gcashEarningSchema.shape.amount,
  date: gcashEarningSchema.shape.date,
});

export const updateGCashEarningSchema = z.strictObject({
  id: z.uuid("Invalid ID format"),
  amount: gcashEarningSchema.shape.amount.optional(),
  date: gcashEarningSchema.shape.date,
});

export const deleteGCashEarningSchema = z.strictObject({
  id: z.uuid("Invalid ID format"),
});
