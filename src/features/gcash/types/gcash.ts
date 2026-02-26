import { z } from "zod";
import { gcashEarningSchema } from "@/features/gcash/validation/gcash";

export type GCashEarningData = z.input<typeof gcashEarningSchema>;
