import type { User } from "@/../prisma/generated/client";
import {
  getCachedCurrentUser,
  setCachedCurrentUser,
} from "@/features/auth/lib/auth-redis";
import type { SignInData, SignUpData } from "@/features/auth/types/auth";
import { signInSchema, signUpSchema } from "@/features/auth/validations/auth";
import { createClient } from "@/lib/supabase/server";
import { formatZodError } from "@/lib/utils";
import { storeRepository } from "@/repositories/store";
import { storeMemberRepository } from "@/repositories/store-member";
import { userRepository } from "@/repositories/user";
import type { Response as AuthResponse } from "@/types/shared/response";

export async function getCurrentUser(): Promise<AuthResponse<{ user: User }>> {
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
      error: { code: "NOT_AUTHENTICATED" },
    };
  }

  const userId = authUser.id;

  const cached = await getCachedCurrentUser<{ user: User }>(userId);
  const isCached = !!cached;

  if (isCached) {
    return {
      success: true,
      status: 200,
      message: "User retrieved successfully",
      data: cached,
    };
  }

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

  const payload = { user };

  await setCachedCurrentUser(userId, payload);

  return {
    success: true,
    status: 200,
    message: "User retrieved successfully",
    data: payload,
  };
}

export async function signIn(
  data: SignInData,
): Promise<AuthResponse<{ user: any }>> {
  const parsed = signInSchema.safeParse(data);
  const validationFailed = !parsed.success;

  if (validationFailed) {
    return {
      success: false,
      status: 400,
      message: `Validation failed: ${formatZodError(parsed.error)}`,
      error: { code: "VALIDATION_FAILED", details: parsed.error.issues },
    };
  }

  const { email, password } = parsed.data;

  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  const signInFailed = authError;

  if (signInFailed) {
    return {
      success: false,
      status: 401,
      message: `Authentication failed: ${authError.message}`,
      error: {
        code: "AUTHENTICATION_FAILED",
        details: authError.message,
      },
    };
  }

  return {
    success: true,
    status: 200,
    message: "Login successful",
    data: { user: authData.user },
  };
}

export async function signUp(
  data: SignUpData,
): Promise<AuthResponse<{ user: any }>> {
  const parsed = signUpSchema.safeParse(data);
  const validationFailed = !parsed.success;

  if (validationFailed) {
    return {
      success: false,
      status: 400,
      message: `Validation failed: ${formatZodError(parsed.error)}`,
      error: { code: "VALIDATION_FAILED", details: parsed.error.issues },
    };
  }

  const { email, password, firstName, lastName, storeName } = parsed.data;
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName },
    },
  });

  const signUpFailed = authError || !authData.user;

  if (signUpFailed) {
    return {
      success: false,
      status: 400,
      message: `Authentication failed: ${authError?.message ?? "no user"}`,
      error: {
        code: "SIGNUP_FAILED",
        details: authError?.message ?? "no user",
      },
    };
  }

  if (!authData.user) {
    return {
      success: false,
      status: 400,
      message: "Authentication failed: no user",
      error: {
        code: "NO_USER_RETURNED",
      },
    };
  }

  const userId = authData.user.id;

  await userRepository.create({
    id: userId,
    firstName,
    lastName,
    email,
  });

  const store = await storeRepository.create({
    name: storeName,
  });

  await storeMemberRepository.create({
    userId,
    storeId: store.id,
    role: "OWNER",
  });

  await userRepository.update(userId, {
    currentStoreId: store.id,
  });

  return {
    success: true,
    status: 201,
    message: "Registration successful",
    data: {
      user: authData.user,
    },
  };
}

export async function signOut(): Promise<AuthResponse<null>> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  const signOutFailed = error;

  if (signOutFailed) {
    return {
      success: false,
      status: 400,
      message: error.message,
      error: {
        code: "SIGN_OUT_FAILED",
        details: error.message,
      },
    };
  }

  return {
    success: true,
    status: 200,
    message: "Signed out successfully",
    data: null,
  };
}
