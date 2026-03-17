import type { z } from "zod";
import type {
  createGCashEarningSchema,
  deleteGCashEarningSchema,
  gcashEarningSchema,
  updateGCashEarningSchema,
} from "../validation/gcash";

// ============= Inferred Types =============

export type GCashEarningData = z.infer<typeof gcashEarningSchema>;

export type CreateGCashEarning = z.input<typeof createGCashEarningSchema>;
export type UpdateGCashEarning = z.input<typeof updateGCashEarningSchema>;
export type DeleteGCashEarning = z.input<typeof deleteGCashEarningSchema>;

// ============= Response Types =============

export type GCashEarningResponse = {
  id: string;
  storeId: string;
  amount: number;
  created_at: Date;
  updated_at: Date;
};

export type GCashEarningChartResponse = {
  date: string;
  amount: number;
};

export type GCashEarningColumn = {
  id: string;
  created_at: string | Date;
  amount: number;
};

// ============= API Params =============

export interface GetGCashEarningParams {
  page?: number;
  limit?: number;
  year?: number;
  month?: number;
}

// ============= Hook Params =============

export interface UseGetGCashEarningParams {
  page?: number;
  limit?: number;
  year?: number;
  month?: number;
}

// ============= Component Props =============

export interface GCashEarningFormProps {
  gcashEarning?: {
    id: string;
    amount: number;
    created_at: string | Date;
  };
}

export interface GCashEarningActionCellProps {
  gcashEarning: GCashEarningColumn;
}
