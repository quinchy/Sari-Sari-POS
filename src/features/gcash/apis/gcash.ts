import {
  CreateGCashEarning,
  DeleteGCashEarning,
  UpdateGCashEarning,
  GCashEarningResponse,
} from "@/features/gcash/types/gcash";

export const getGCashEarning = async (): Promise<{
  success: boolean;
  message: string;
  data?: GCashEarningResponse[];
}> => {
  const response = await fetch("/api/gcash-earning", {
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
