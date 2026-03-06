import { gCashEarningRepository } from "@/repositories/gcash-earning";
import { Response } from "@/types/shared/response";
import {
  CreateGCashEarning as CreateGCashEarningInput,
  UpdateGCashEarning as UpdateGCashEarningInput,
  GCashEarningResponse,
} from "@/features/gcash/types/gcash";
import { getCurrentUser } from "@/features/auth/services/auth";
import { GetGCashEarningParams } from "@/features/gcash/types/gcash";
import { formatZodError } from "@/lib/utils";
import {
  getCachedGCashEarnings,
  setCachedGCashEarnings,
  buildGCashEarningsCacheKey,
  invalidateAllGCashEarningsCache,
} from "@/features/gcash/lib/gcash-redis";
import {
  createGCashEarningSchema,
  updateGCashEarningSchema,
  deleteGCashEarningSchema,
} from "@/features/gcash/validation/gcash";

export async function createGCashEarning(
  data: CreateGCashEarningInput,
): Promise<Response<{ id: string }> & { storeId?: string }> {
  const parsed = createGCashEarningSchema.safeParse(data);
  const validationFailed = !parsed.success;

  if (validationFailed) {
    return {
      success: false,
      status: 400,
      message: `Validation failed: ${formatZodError(parsed.error)}`,
    };
  }

  const currentUserResult = await getCurrentUser();
  const failedToGetCurrentUser = !currentUserResult.success;

  if (failedToGetCurrentUser) {
    return {
      success: currentUserResult.success,
      status: currentUserResult.status,
      message: currentUserResult.message,
    };
  }

  const user = currentUserResult.data.user;
  const storeId = user?.currentStoreId ?? null;
  const noStoreIdFound = !storeId;

  if (noStoreIdFound) {
    return {
      success: false,
      status: 400,
      message: "You don't have a current store. Please create a store first.",
    };
  }

  try {
    const gcashEarning = await gCashEarningRepository.create({
      ...parsed.data,
      storeId,
    });

    await invalidateAllGCashEarningsCache(storeId);

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

    const isDuplicateEntry = message.toLowerCase().includes("already exists");

    if (isDuplicateEntry) {
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
  const parsed = updateGCashEarningSchema.safeParse(data);
  const validationFailed = !parsed.success;

  if (validationFailed) {
    return {
      success: false,
      status: 400,
      message: `Validation failed: ${formatZodError(parsed.error)}`,
    };
  }

  try {
    const gcashEarning = await gCashEarningRepository.update(parsed.data);

    await invalidateAllGCashEarningsCache(gcashEarning.storeId);

    return {
      success: true,
      status: 200,
      message: "GCash earning updated successfully",
      data: { id: gcashEarning.id },
      storeId: gcashEarning.storeId,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update GCash earning";

    const isNotFound = message.toLowerCase().includes("not found");

    if (isNotFound) {
      return {
        success: false,
        status: 404,
        message: "GCash earning record not found",
      };
    }

    const isDuplicateEntry = message.toLowerCase().includes("already exists");

    if (isDuplicateEntry) {
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
  data: { id: string },
): Promise<Response<{ id: string }> & { storeId?: string }> {
  const parsed = deleteGCashEarningSchema.safeParse(data);
  const validationFailed = !parsed.success;

  if (validationFailed) {
    return {
      success: false,
      status: 400,
      message: `Validation failed: ${formatZodError(parsed.error)}`,
    };
  }

  try {
    const existing = await gCashEarningRepository.getById(parsed.data.id);
    const recordNotFound = !existing;

    if (recordNotFound) {
      return {
        success: false,
        status: 404,
        message: "GCash earning record not found",
      };
    }

    await gCashEarningRepository.delete(parsed.data.id);

    await invalidateAllGCashEarningsCache(existing.storeId);

    return {
      success: true,
      status: 200,
      message: "GCash earning deleted successfully",
      data: { id: parsed.data.id },
      storeId: existing.storeId,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete GCash earning";

    const isNotFound = message.toLowerCase().includes("not found");

    if (isNotFound) {
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
  params: GetGCashEarningParams = {},
): Promise<
  Response<GCashEarningResponse[]> & {
    storeId?: string;
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  }
> {
  const { page, limit, year, month } = params;

  const currentUser = await getCurrentUser();

  const errorCurrentUser = !currentUser.success;

  if (errorCurrentUser) {
    return {
      success: currentUser.success,
      status: currentUser.status,
      message: currentUser.message,
    };
  }

  const user = currentUser.data.user;
  const storeId = user?.currentStoreId ?? null;
  const noStoreIdFound = !storeId;

  if (noStoreIdFound) {
    return {
      success: false,
      status: 400,
      message:
        "You don't have a store selected. Please select or create a store first.",
    };
  }

  const isFilterByMonthAndYear = year !== undefined && month !== undefined;
  const isPaginated = page !== undefined && limit !== undefined;

  const cacheKey = buildGCashEarningsCacheKey(storeId, {
    page,
    limit,
    year,
    month,
  });

  try {
    const cached = await getCachedGCashEarnings<any>(cacheKey);
    const isCached = !!cached;

    if (isCached) {
      return cached;
    }

    if (isFilterByMonthAndYear) {
      const earnings = await gCashEarningRepository.getByStoreIdAndMonth(
        storeId,
        year,
        month,
      );

      const mappedEarnings: GCashEarningResponse[] = earnings.map((earning) => ({
        id: earning.id,
        storeId: earning.storeId,
        amount: earning.amount.toNumber(),
        created_at: earning.created_at,
        updated_at: earning.updated_at,
      }));

      const payload = {
        success: true,
        status: 200,
        message: "GCash earnings retrieved successfully",
        data: mappedEarnings,
        storeId,
      };

      await setCachedGCashEarnings(payload, storeId, {
        year,
        month,
      });

      return payload;
    }

    if (isPaginated) {
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

      const payload = {
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

      await setCachedGCashEarnings(payload, storeId, {
        page,
        limit,
      });

      return payload;
    }

    const allEarnings = await gCashEarningRepository.getByStoreId(storeId);

    const mappedEarnings: GCashEarningResponse[] = allEarnings.map(
      (earning) => ({
        id: earning.id,
        storeId: earning.storeId,
        amount: earning.amount.toNumber(),
        created_at: earning.created_at,
        updated_at: earning.updated_at,
      }),
    );

    const payload = {
      success: true,
      status: 200,
      message: "GCash earnings retrieved successfully",
      data: mappedEarnings,
      storeId,
      total: mappedEarnings.length,
    };

    await setCachedGCashEarnings(payload, storeId);

    return payload;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to retrieve GCash earnings";

    return { success: false, status: 500, message };
  }
}

export async function getGCashEarningTotal(): Promise<Response<number>> {
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
    const total = await gCashEarningRepository.getTotalByStoreId(storeId);

    return {
      success: true,
      status: 200,
      message: "GCash earnings total retrieved successfully",
      data: total,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to retrieve GCash earnings total";

    return { success: false, status: 500, message };
  }
}

export async function getGCashEarningExtreme(
  type: "highest" | "lowest",
): Promise<Response<{ id: string; amount: number; created_at: Date }>> {
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
    const earning =
      type === "highest"
        ? await gCashEarningRepository.getHighestByStoreId(storeId)
        : await gCashEarningRepository.getLowestByStoreId(storeId);

    if (!earning) {
      return {
        success: true,
        status: 200,
        message: `No GCash earnings found`,
        data: { id: "", amount: 0, created_at: new Date() },
      };
    }

    return {
      success: true,
      status: 200,
      message: `GCash ${type === "highest" ? "highest" : "lowest"} earning retrieved successfully`,
      data: {
        id: earning.id,
        amount: earning.amount.toNumber(),
        created_at: earning.created_at,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : `Failed to retrieve GCash ${type} earning`;

    return { success: false, status: 500, message };
  }
}
