import {
  CreateGCashEarning,
  DeleteGCashEarning,
  UpdateGCashEarning,
  GCashEarningResponse,
  GCashEarningChartData,
} from "@/features/gcash/types/gcash";

interface GetGCashEarningParams {
  page?: number;
  limit?: number;
  year?: number;
  month?: number;
}

export const getGCashEarning = async (
  params: GetGCashEarningParams = {},
): Promise<{
  success: boolean;
  message: string;
  data?: GCashEarningResponse[] | GCashEarningChartData[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const urlParams = new URLSearchParams();

  // Pagination params
  if (params.page !== undefined) {
    urlParams.set("page", params.page.toString());
  }
  if (params.limit !== undefined) {
    urlParams.set("limit", params.limit.toString());
  }

  // Chart params
  if (params.year !== undefined) {
    urlParams.set("year", params.year.toString());
  }
  if (params.month !== undefined) {
    urlParams.set("month", params.month.toString());
  }

  // Determine endpoint based on chart params
  const endpoint = params.year !== undefined && params.month !== undefined
    ? "/api/gcash-earning/chart"
    : "/api/gcash-earning";

  const response = await fetch(`${endpoint}?${urlParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch GCash earnings");
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
