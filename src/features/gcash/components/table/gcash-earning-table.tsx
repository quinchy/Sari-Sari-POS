"use client";

import { FallbackProvider } from "@/providers/fallback-provider";
import { GCashEarningTableHeader } from "@/features/gcash/components/table/gcash-earning-table-header";
import {
  TBodyLoading,
  TBodyError,
  TBodyNoData,
} from "@/components/table-fallback";
import { Table } from "@/components/ui/table";
import { useGetGCashEarning } from "@/features/gcash/hooks/use-gcash-earning";
import GCashEarningTableBody from "@/features/gcash/components/table/gcash-earning-table-body";
import GCashEarningTableFooter from "@/features/gcash/components/table/gcash-earning-table-footer";

export default function GCashEarningTable() {
  const {
    gcashEarnings,
    isGCashEarningsLoading,
    isGCashEarningsError,
    isGCashEarningsEmpty,
    refetchGCashEarnings,
  } = useGetGCashEarning();

  return (
    <Table>
      <GCashEarningTableHeader />
      <FallbackProvider
        isPending={isGCashEarningsLoading}
        isError={isGCashEarningsError}
        isEmpty={isGCashEarningsEmpty}
        loadingFallback={<TBodyLoading columnsCount={3} rowsCount={7} />}
        errorFallback={
          <TBodyError
            title="Failed to load GCash Earning"
            description="An error occured on retrieving GCash Earning. Please try again."
            columnsCount={3}
            resetAction={refetchGCashEarnings}
          />
        }
        noDataFallback={
          <TBodyNoData
            title="No GCash Earning Data found"
            description="Add a GCash Earning Data to get started."
            columnsCount={3}
          />
        }
      >
        <GCashEarningTableBody data={gcashEarnings} />
        <GCashEarningTableFooter data={gcashEarnings} />
      </FallbackProvider>
    </Table>
  );
}
