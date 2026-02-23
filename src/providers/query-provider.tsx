// app/providers/QueryProvider.tsx
"use client";

import { ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  // optionally import Devtools:
  // ReactQueryDevtools
} from "@tanstack/react-query";

// create a client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // optional defaults
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

type QueryProviderProps = {
  children: ReactNode;
};

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Uncomment if you want devtools */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}