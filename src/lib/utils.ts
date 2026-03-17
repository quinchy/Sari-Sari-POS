import { type ClassValue, clsx } from "clsx";
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
    : "https://qwenta.quinchy.dev";

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function toManilaDateString(date: string | Date): string {
  const dateStr = new Date(date).toLocaleString("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [mm, dd, yyyy] = dateStr.split(",")[0].split("/");

  return `${yyyy}-${mm}-${dd}`;
}
