"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn, signUp } from "@/features/auth/apis/auth";
import type {
  SignInData as SignInRequest,
  SignInResponse,
  SignUpData as SignUpRequest,
  SignUpResponse,
} from "@/features/auth/types/auth";

export function useSignIn() {
  const { isPending, mutateAsync } = useMutation<
    SignInResponse,
    Error,
    SignInRequest
  >({
    mutationFn: signIn,
  });

  return {
    isSigningIn: isPending,
    signIn: mutateAsync,
  };
}

export function useSignUp() {
  const { isPending, mutateAsync, error } = useMutation<
    SignUpResponse,
    Error,
    SignUpRequest
  >({
    mutationFn: signUp,
  });

  return {
    isSigningUp: isPending,
    signUp: mutateAsync,
    signUpError: error,
  };
}
