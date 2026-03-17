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
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetProducts } from "@/features/products/hooks/use-products";
import { columns } from "@/features/products/lib/products-table-columns";
import type { ProductColumn } from "@/features/products/types/products";
import { FallbackProvider } from "@/components/providers/fallback-provider";

export default function ProductsTable() {
  const [pageIndex, setPageIndex] = useState(0);

  const {
    products,
    isProductsLoading,
    isProductsError,
    isProductsEmpty,
    refetchProducts,
    pagination,
  } = useGetProducts({ page: pageIndex + 1, limit: 15 });

  const productsTable = useReactTable<ProductColumn>({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = productsTable.getRowModel().rows;

  return (
    <Table>
      <TableHeader>
        {productsTable.getHeaderGroups().map((hg) => (
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
        isPending={isProductsLoading}
        isError={isProductsError}
        isEmpty={isProductsEmpty}
        loadingFallback={<TBodyLoading columnsCount={5} />}
        errorFallback={
          <TBodyError
            title="Failed to load Products"
            description="An error occured on retrieving Products. Please try again."
            columnsCount={5}
            resetAction={refetchProducts}
          />
        }
        noDataFallback={
          <TBodyNoData
            title="No Products Data found"
            description="Add a Product to get started."
            columnsCount={5}
          />
        }
      >
        <TableBody>
          {rows.map((row) => {
            const rowData = row.original as ProductColumn;
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
          isLoading={isProductsLoading}
        />
      </TableFooter>
    </Table>
  );
}
