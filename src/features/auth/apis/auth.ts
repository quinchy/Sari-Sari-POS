import type {
  SignInData as SignInRequest,
  SignInResponse,
  SignUpData as SignUpRequest,
  SignUpResponse,
} from "@/features/auth/types/auth";

export type { SignInRequest, SignInResponse, SignUpRequest, SignUpResponse };

export async function signIn(
  credentials: SignInRequest,
): Promise<SignInResponse> {
  const response = await fetch("/api/sign-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function signUp(
  credentials: SignUpRequest,
): Promise<SignUpResponse> {
  const response = await fetch("/api/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Sign up failed");
  }

  return data;
}
