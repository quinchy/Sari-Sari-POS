"use client";

import { FallbackProvider } from "@/providers/fallback-provider";
import { GCashEarningTableHeader } from "@/features/gcash/components/table/gcash-earning-table-header";
import {
  TbodyFallback,
  TbodyError,
  TbodyNoData,
} from "@/features/gcash/components/table/gcash-earning-table-fallback";
import { Table } from "@/components/ui/table";
import { useGetGCashEarning } from "@/features/gcash/hooks/use-gcash-earning";
import GCashEarningTableBody from "@/features/gcash/components/table/gcash-earning-table-body";
import GCashEarningTableFooter from "@/features/gcash/components/table/gcash-earning-table-footer";

export default function GCashEarningTable() {
  const {
    gcashEarnings,
    isGCashEarningsLoading,
    isGCashEarningsError,
    refetchGCashEarnings,
  } = useGetGCashEarning();

  const isLoading = isGCashEarningsLoading;
  const isError = isGCashEarningsError;
  const isEmpty = gcashEarnings.length === 0;

  return (
    <Table>
      <GCashEarningTableHeader />
      <FallbackProvider
        isPending={isLoading}
        isError={isError}
        isEmpty={isEmpty}
        loadingFallback={<TbodyFallback />}
        errorFallback={<TbodyError resetAction={refetchGCashEarnings} />}
        noDataFallback={<TbodyNoData />}
      >
        <GCashEarningTableBody data={gcashEarnings} />
        <GCashEarningTableFooter data={gcashEarnings} />
      </FallbackProvider>
    </Table>
  );
}
