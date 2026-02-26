import {
  CreateGCashEarning,
  DeleteGCashEarning,
  UpdateGCashEarning,
} from "@/features/gcash/types/gcash";
import {
  createGCashEarningSchema,
  deleteGCashEarningSchema,
  updateGCashEarningSchema,
} from "@/features/gcash/validation/gcash";

export const createGCashEarning = async (data: CreateGCashEarning) => {
  const validatedData = createGCashEarningSchema.parse(data);
  const response = await fetch("/api/gcash-earning", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedData),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to create GCash earning");
  }

  return result;
};

export const updateGCashEarning = async (data: UpdateGCashEarning) => {
  const validatedData = updateGCashEarningSchema.parse(data);
  const response = await fetch("/api/gcash-earning", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedData),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update GCash earning");
  }

  return result;
};

export const deleteGCashEarning = async (data: DeleteGCashEarning) => {
  const validatedData = deleteGCashEarningSchema.parse(data);
  const response = await fetch("/api/gcash-earning", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedData),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to delete GCash earning");
  }

  return result;
};
