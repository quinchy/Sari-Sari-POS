"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  TBodyError,
  TBodyLoading,
  TBodyNoData,
} from "@/components/layout/table-fallback";
import TablePagination from "@/components/layout/table-pagination";
import { FallbackProvider } from "@/components/providers/fallback-provider";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetGCashEarning } from "@/features/gcash/hooks/use-gcash-earning";
import { columns } from "@/features/gcash/lib/gcash-earning-table-columns";
import type { GCashEarningColumn } from "@/features/gcash/types/gcash";

export default function GCashEarningTable() {
  const [pageIndex, setPageIndex] = useState(0);

  const {
    gcashEarnings,
    isGCashEarningsLoading,
    isGCashEarningsError,
    isGCashEarningsEmpty,
    refetchGCashEarnings,
    pagination,
  } = useGetGCashEarning({ page: pageIndex + 1, limit: 15 });

  const gcashEarningTable = useReactTable<GCashEarningColumn>({
    data: gcashEarnings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = gcashEarningTable.getRowModel().rows;

  return (
    <Table>
      <TableHeader>
        {gcashEarningTable.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => (
              <TableHead key={header.id} style={{ width: header.getSize() }}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <FallbackProvider
        isPending={isGCashEarningsLoading}
        isError={isGCashEarningsError}
        isEmpty={isGCashEarningsEmpty}
        loadingFallback={<TBodyLoading columnsCount={3} />}
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
        <TableBody>
          {rows.map((row) => {
            const rowData = row.original as GCashEarningColumn;
            return (
              <TableRow key={rowData.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={`${rowData.id}-${cell.id}`}
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </FallbackProvider>
      <TableFooter>
        <TablePagination
          pageIndex={pageIndex}
          total={pagination.total}
          totalPages={pagination.totalPages}
          limit={pagination.limit}
          onPageChange={setPageIndex}
          isLoading={isGCashEarningsLoading}
        />
      </TableFooter>
    </Table>
  );
}
