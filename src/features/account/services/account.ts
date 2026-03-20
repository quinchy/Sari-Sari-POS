import type { User as PrismaUser } from "@/../prisma/generated/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { userRepository } from "@/repositories/user";
import type { Response } from "@/types/shared/response";

export async function getUser(): Promise<Response<{ user: PrismaUser }>> {
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
      error: { code: "NOT_AUTHENTICATED", details: authError?.message },
    };
  }

  const userId = (authUser as SupabaseUser).id;

  const user = await userRepository.getById(userId);

  const userNotFound = !user;

  if (userNotFound) {
    return {
      success: false,
      status: 404,
      message: "User not found",
      error: { code: "USER_NOT_FOUND" },
    };
  }

  return {
    success: true,
    status: 200,
    message: "User retrieved successfully",
    data: { user },
  };
}

