"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  columns,
  type GCashEarning,
} from "@/features/gcash/lib/gcash-earning-table-columns";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function GCashEarningTableHeader() {
  const headerTable = useReactTable<GCashEarning>({
    data: [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableHeader>
      {headerTable.getHeaderGroups().map((hg) => (
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
  );
}
