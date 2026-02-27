"use client";

import { useGetGCashEarning } from "@/features/gcash/hooks/use-gcash-earning";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import {
  columns,
  type GCashEarning,
} from "@/features/gcash/lib/gcash-earning-table-columns";

export function useGCashEarningTable() {
  const { gcashEarnings } = useGetGCashEarning();

  const table = useReactTable<GCashEarning>({
    data: gcashEarnings ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return { table };
}
