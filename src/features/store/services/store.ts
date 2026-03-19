import type { Store } from "@/../prisma/generated/client";
import { createClient } from "@/lib/supabase/server";
import { storeRepository } from "@/repositories/store";
import { userRepository } from "@/repositories/user";
import type { Response } from "@/types/shared/response";

export async function getCurrentStore(): Promise<Response<{ store: Store }>> {
  const supabase = await createClient();

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  const failedToGetAuthUser = authError || !authUser;

  if (failedToGetAuthUser) {
    return {
      success: false,
      status: 401,
      message: "User not authenticated",
    };
  }

  const userId = authUser.id;

  const user = await userRepository.getById(userId);

  const userNotFound = !user;

  if (userNotFound) {
    return {
      success: false,
      status: 404,
      message: "User not found",
    };
  }

  const storeId = user.currentStoreId;

  const storeIdMissing = !storeId;

  if (storeIdMissing) {
    return {
      success: false,
      status: 404,
      message: "No current store set for user",
    };
  }

  const store = await storeRepository.getById(storeId);

  const storeNotFound = !store;

  if (storeNotFound) {
    return {
      success: false,
      status: 404,
      message: "Store not found",
    };
  }

  return {
    success: true,
    status: 200,
    message: "Store retrieved successfully",
    data: { store },
  };
}
