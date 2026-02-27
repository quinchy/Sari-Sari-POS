import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatZodError(error: z.ZodError): string {
  const flattened = z.flattenError(error);
  return Object.values(flattened.fieldErrors).flat().join(", ");
}

export const baseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_APP_URL
    : "https://sari-sari-pos.quinchy.dev";

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
