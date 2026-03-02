import {
  CreateGCashEarning,
  DeleteGCashEarning,
  UpdateGCashEarning,
  GCashEarningResponse,
} from "@/features/gcash/types/gcash";

export const getGCashEarning = async (
  page: number = 1,
  limit: number = 15,
): Promise<{
  success: boolean;
  message: string;
  data?: GCashEarningResponse[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", limit.toString());

  const response = await fetch(`/api/gcash-earning?${params.toString()}`, {
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
