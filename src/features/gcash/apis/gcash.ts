import {
  CreateGCashEarning,
  DeleteGCashEarning,
  UpdateGCashEarning,
  GCashEarningResponse,
  GetGCashEarningParams,
} from "@/features/gcash/types/gcash";
import { Pagination } from "@/types/shared/pagination";

export const getGCashEarning = async (
  params: GetGCashEarningParams = {},
): Promise<{
  success: boolean;
  message: string;
  data?: GCashEarningResponse[];
  pagination?: Pagination;
}> => {
  const urlParams = new URLSearchParams();

  if (params.page !== undefined) {
    urlParams.set("page", params.page.toString());
  }
  if (params.limit !== undefined) {
    urlParams.set("limit", params.limit.toString());
  }
  if (params.year !== undefined) {
    urlParams.set("year", params.year.toString());
  }
  if (params.month !== undefined) {
    urlParams.set("month", params.month.toString());
  }

  const response = await fetch(`/api/gcash-earning?${urlParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message);
  }

  return result;
};

export const createGCashEarning = async (data: CreateGCashEarning) => {
  const response = await fetch("/api/gcash-earning", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to create GCash earning");
  }

  return result;
};

export const updateGCashEarning = async (data: UpdateGCashEarning) => {
  const response = await fetch("/api/gcash-earning", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update GCash earning");
  }

  return result;
};

export const deleteGCashEarning = async (data: DeleteGCashEarning) => {
  const response = await fetch("/api/gcash-earning", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to delete GCash earning");
  }

  return result;
};

export const getGCashEarningTotal = async (): Promise<number> => {
  const response = await fetch("/api/gcash-earning/total", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch GCash earnings total");
  }

  return result.data;
};

export const getGCashEarningExtreme = async (
  type: "highest" | "lowest",
): Promise<{ id: string; amount: number; created_at: string }> => {
  const response = await fetch(`/api/gcash-earning/extreme?type=${type}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || `Failed to fetch GCash ${type} earning`);
  }

  return result.data;
};
