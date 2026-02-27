"use client";

import { type ReactNode } from "react";

interface FallbackProviderProps {
  isPending?: boolean;
  isError?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
  noDataFallback?: ReactNode;
  children: ReactNode;
}

export function FallbackProvider({
  isPending = false,
  isError = false,
  error = null,
  isEmpty = false,
  loadingFallback,
  errorFallback,
  noDataFallback,
  children,
}: FallbackProviderProps) {
  if (isPending) {
    return <>{loadingFallback}</>;
  }

  if (isError) {
    return <>{errorFallback}</>;
  }

  if (isEmpty) {
    return <>{noDataFallback}</>;
  }

  return <>{children}</>;
}
