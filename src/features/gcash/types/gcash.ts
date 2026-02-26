import { z } from "zod";
import {
  createGCashEarningSchema,
  deleteGCashEarningSchema,
  gcashEarningSchema,
  updateGCashEarningSchema,
} from "@/features/gcash/validation/gcash";

export type GCashEarningData = z.infer<typeof gcashEarningSchema>;

export type CreateGCashEarning = z.input<typeof createGCashEarningSchema>;
export type UpdateGCashEarning = z.input<typeof updateGCashEarningSchema>;
export type DeleteGCashEarning = z.input<typeof deleteGCashEarningSchema>;
