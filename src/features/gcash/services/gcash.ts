import { gCashEarningRepository } from "@/repositories/gcash-earning";
import { Response } from "@/types/shared/response";
import {
  CreateGCashEarning as CreateGCashEarningInput,
  UpdateGCashEarning as UpdateGCashEarningInput,
  GCashEarningResponse,
} from "@/features/gcash/types/gcash";
import { getCurrentUser } from "@/features/auth/services/auth";

/**
 * Create a GCash earning record.
 * Accepts an optional `date` on the input which will be used for the
 * record's `created_at` timestamp. Ensures there is only one record
 * per store per day (repository enforces this and will throw on conflict).
 */
export async function createGCashEarning(
  data: CreateGCashEarningInput,
): Promise<Response<{ id: string }> & { storeId?: string }> {
  const currentUserResult = await getCurrentUser();
  if (!currentUserResult.success) {
    return {
      success: false,
      status: currentUserResult.status,
      message: currentUserResult.message,
    };
  }

  const user = currentUserResult.data.user;
  const storeId = user?.currentStoreId ?? null;

  if (!storeId) {
    return {
      success: false,
      status: 400,
      message: "You don't have a current store. Please create a store first.",
    };
  }

  try {
    const gcashEarning = await gCashEarningRepository.create({
      ...data,
      storeId,
    });

    return {
      success: true,
      status: 201,
      message: "GCash earning created successfully",
      data: { id: gcashEarning.id },
      storeId,
    } as Response<{ id: string }> & { storeId: string };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create GCash earning";

    if (message.toLowerCase().includes("already exists")) {
      return {
        success: false,
        status: 409,
        message: "You already have a GCash earning for that date",
      };
    }

    return {
      success: false,
      status: 500,
      message,
    };
  }
}

/**
 * Update an existing GCash earning record.
 * If `data.date` is provided, the repository will validate that the
 * updated date does not cause a duplicate record for the same store/day.
 */
export async function updateGCashEarning(
  data: UpdateGCashEarningInput,
): Promise<Response<{ id: string }>> {
  try {
    const gcashEarning = await gCashEarningRepository.update(data);

    return {
      success: true,
      status: 200,
      message: "GCash earning updated successfully",
      data: { id: gcashEarning.id },
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update GCash earning";

    if (message.toLowerCase().includes("not found")) {
      return {
        success: false,
        status: 404,
        message: "GCash earning record not found",
      };
    }

    if (message.toLowerCase().includes("already exists")) {
      return {
        success: false,
        status: 409,
        message:
          "Another GCash earning record already exists for this store on the target date. Please choose a different date or update the existing record.",
      };
    }

    return {
      success: false,
      status: 500,
      message,
    };
  }
}

/**
 * Delete a GCash earning record.
 */
export async function deleteGCashEarning(id: string): Promise<Response<null>> {
  try {
    await gCashEarningRepository.delete(id);

    return {
      success: true,
      status: 200,
      message: "GCash earning deleted successfully",
      data: null,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete GCash earning";

    if (message.toLowerCase().includes("not found")) {
      return {
        success: false,
        status: 404,
        message: "GCash earning record not found",
      };
    }

    return {
      success: false,
      status: 500,
      message,
    };
  }
}

/**
 * Get all GCash earning records for the current user's store.
 */
export async function getGCashEarning(): Promise<
  Response<GCashEarningResponse[] & { storeId?: string }>
> {
  const currentUserResult = await getCurrentUser();
  if (!currentUserResult.success) {
    return {
      success: false,
      status: currentUserResult.status,
      message: currentUserResult.message,
    };
  }

  const user = currentUserResult.data.user;
  const storeId = user?.currentStoreId ?? null;

  if (!storeId) {
    return {
      success: false,
      status: 400,
      message: "You don't have a current store. Please create a store first.",
    };
  }

  try {
    const gcashEarnings = await gCashEarningRepository.getByStoreId(storeId);

    const mappedEarnings = gcashEarnings.map((earning) => ({
      id: earning.id,
      storeId: earning.storeId,
      amount: earning.amount.toNumber(),
      created_at: earning.created_at,
      updated_at: earning.updated_at,
    }));

    return {
      success: true,
      status: 200,
      message: "GCash earnings retrieved successfully",
      data: mappedEarnings,
      storeId,
    } as Response<GCashEarningResponse[]> & { storeId: string };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to retrieve GCash earnings";

    return {
      success: false,
      status: 500,
      message,
    };
  }
}
