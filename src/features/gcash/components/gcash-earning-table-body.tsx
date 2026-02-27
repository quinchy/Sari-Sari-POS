"use client";

import { flexRender } from "@tanstack/react-table";
import { useGCashEarningTable } from "@/features/gcash/hooks/use-gcash-earning-table";
import { columns } from "@/features/gcash/lib/gcash-earning-table-columns";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function GCashEarningTableBody() {
  const { table } = useGCashEarningTable();
  const rows = table.getRowModel().rows;

  if (rows.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columns.length}>
            No GCash earnings found.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
