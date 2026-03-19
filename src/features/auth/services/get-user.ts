import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User as PrismaUser } from "@/../prisma/generated/client";
import { createClient } from "@/lib/supabase/server";
import { userRepository } from "@/repositories/user";
import type { Response } from "@/types/shared/response";

export async function getSupabaseUser(): Promise<
  Response<{ user: SupabaseUser }>
> {
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

  return {
    success: true,
    status: 200,
    message: "User retrieved successfully",
    data: { user: authUser },
  };
}

export async function getUserFromPrisma(): Promise<
  Response<{ user: PrismaUser }>
> {
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

  return {
    success: true,
    status: 200,
    message: "User retrieved successfully",
    data: { user },
  };
}
