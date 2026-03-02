import { gCashEarningRepository } from "@/repositories/gcash-earning";
import { Response } from "@/types/shared/response";
import {
  CreateGCashEarning as CreateGCashEarningInput,
  UpdateGCashEarning as UpdateGCashEarningInput,
  GCashEarningResponse,
} from "@/features/gcash/types/gcash";
import { getCurrentUser } from "@/features/auth/services/auth";

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
    };
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

    return { success: false, status: 500, message };
  }
}

export async function updateGCashEarning(
  data: UpdateGCashEarningInput,
): Promise<Response<{ id: string }> & { storeId?: string }> {
  try {
    const gcashEarning = await gCashEarningRepository.update(data);

    return {
      success: true,
      status: 200,
      message: "GCash earning updated successfully",
      data: { id: gcashEarning.id },
      storeId: gcashEarning.storeId, // ✅ return storeId for cache invalidation
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

    return { success: false, status: 500, message };
  }
}

export async function deleteGCashEarning(
  id: string,
): Promise<Response<{ id: string }> & { storeId?: string }> {
  try {
    // ✅ fetch storeId before delete (so we can invalidate correct key)
    const existing = await gCashEarningRepository.getById(id);
    if (!existing) {
      return {
        success: false,
        status: 404,
        message: "GCash earning record not found",
      };
    }

    await gCashEarningRepository.delete(id);

    return {
      success: true,
      status: 200,
      message: "GCash earning deleted successfully",
      data: { id },
      storeId: existing.storeId,
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

    return { success: false, status: 500, message };
  }
}

export async function getGCashEarning(
  page: number = 1,
  limit: number = 15,
): Promise<
  Response<GCashEarningResponse[]> & {
    storeId?: string;
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  }
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
    const result = await gCashEarningRepository.getByStoreIdPageable(
      storeId,
      page,
      limit,
    );

    const mappedEarnings: GCashEarningResponse[] = result.data.map(
      (earning) => ({
        id: earning.id,
        storeId: earning.storeId,
        amount: earning.amount.toNumber(),
        created_at: earning.created_at,
        updated_at: earning.updated_at,
      }),
    );

    return {
      success: true,
      status: 200,
      message: "GCash earnings retrieved successfully",
      data: mappedEarnings,
      storeId,
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to retrieve GCash earnings";

    return { success: false, status: 500, message };
  }
}
