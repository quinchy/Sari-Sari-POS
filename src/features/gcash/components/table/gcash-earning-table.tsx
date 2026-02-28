"use client";

import { FallbackProvider } from "@/providers/fallback-provider";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  columns,
  type GCashEarning,
} from "@/features/gcash/lib/gcash-earning-table-columns";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import {
  TBodyLoading,
  TBodyError,
  TBodyNoData,
} from "@/components/table-fallback";
import { useGetGCashEarning } from "@/features/gcash/hooks/use-gcash-earning";

export default function GCashEarningTable() {
  const {
    gcashEarnings,
    isGCashEarningsLoading,
    isGCashEarningsError,
    isGCashEarningsEmpty,
    refetchGCashEarnings,
  } = useGetGCashEarning();
  const gcashEarningTable = useReactTable<GCashEarning>({
    data: gcashEarnings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const total = gcashEarnings.length;
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
        <TableBody>
          {rows.map((row) => {
            const rowData = row.original as GCashEarning;
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
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length} className="first:border-b-0">
              Total records: {total}
            </TableCell>
          </TableRow>
        </TableFooter>
      </FallbackProvider>
    </Table>
  );
}
