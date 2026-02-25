import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { signUpSchema } from "@/features/auth/validations/auth";
import { userRepository } from "@/repositories/user";
import { storeRepository } from "@/repositories/store";
import { storeMemberRepository } from "@/repositories/store-member";
import { Response as AuthResponse } from "@/types/shared/response";
import { SignInData, SignUpData } from "@/features/auth/types/auth";

export async function signIn(
  data: SignInData,
): Promise<AuthResponse<{ user: any }>> {
  const { email, password } = data;

  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError) {
    return {
      success: false,
      status: 401,
      message: `Authentication failed: ${authError.message}`,
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
  const { email, password, firstName, lastName, storeName } = data;
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName },
    },
  });

  if (authError || !authData.user) {
    return {
      success: false,
      status: 400,
      message: `Authentication failed: ${authError?.message ?? "no user"}`,
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
    id: userId,
    name: storeName,
  });

  await storeMemberRepository.create({
    userId,
    storeId: store.id,
    role: "OWNER",
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

  if (error) {
    return {
      success: false,
      status: 400,
      message: error.message,
    };
  }

  return {
    success: true,
    status: 200,
    message: "Signed out successfully",
    data: null,
  };
}
