import type {
  SignInData as SignInRequest,
  SignInResponse,
  SignUpData as SignUpRequest,
  SignUpResponse,
  SignOutResponse,
  CurrentUserResponse,
} from "@/features/auth/types/auth";

export type {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  CurrentUserResponse,
};

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const response = await fetch("/api/current-user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to get current user");
  }

  return data;
}

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

export async function signOut(): Promise<SignOutResponse> {
  const response = await fetch("/api/sign-out", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Sign out failed");
  }

  return data;
}
