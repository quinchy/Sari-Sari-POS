"use client";

import { FallbackProvider } from "@/providers/fallback-provider";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { columns } from "@/features/gcash/lib/gcash-earning-table-columns";
import { GCashEarningColumn } from "@/features/gcash/types/gcash";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  const gcashEarningTable = useReactTable<GCashEarningColumn>({
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
        <TableFooter>
          <TableRow className="flex justify-between w-full">
            <TableCell colSpan={columns.length} className="border-b-0">
              <p className="text-muted-foreground">
                Showing{" "}
                <span className="font-bold text-foreground">{total}</span>{" "}
                {total > 1 ? "records" : "record"} of GCash Earning
              </p>
            </TableCell>
            <TableCell className="border-b-0 border-l-0">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TableCell>
          </TableRow>
        </TableFooter>
      </FallbackProvider>
    </Table>
  );
}
