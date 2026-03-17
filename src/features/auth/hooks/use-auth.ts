"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getCurrentUser,
  signIn,
  signOut,
  signUp,
} from "@/features/auth/apis/auth";
import type {
  CurrentUserResponse,
  SignInData as SignInRequest,
  SignInResponse,
  SignUpData as SignUpRequest,
  SignUpResponse,
} from "@/features/auth/types/auth";

export function useSignIn() {
  const router = useRouter();
  const { isPending, mutate } = useMutation<
    SignInResponse,
    Error,
    SignInRequest
  >({
    mutationFn: signIn,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    isSigningIn: isPending,
    signIn: mutate,
  };
}

export function useSignUp() {
  const router = useRouter();
  const { isPending, mutate } = useMutation<
    SignUpResponse,
    Error,
    SignUpRequest
  >({
    mutationFn: signUp,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    isSigningUp: isPending,
    signUp: mutate,
  };
}

export function useSignOut() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      toast.success("Signed out successfully");
      router.push("/sign-in");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    isSigningOut: isPending,
    signOut: mutate,
  };
}

export function useGetCurrentUser() {
  const { isLoading, refetch, data } = useQuery<CurrentUserResponse>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
  });

  return {
    isGettingCurrentUser: isLoading,
    getCurrentUser: refetch,
    currentUser: data?.data?.user,
  };
}
