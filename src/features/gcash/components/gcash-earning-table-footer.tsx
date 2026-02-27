"use client";

import { useGCashEarningTable } from "@/features/gcash/hooks/use-gcash-earning-table";
import { columns } from "@/features/gcash/lib/gcash-earning-table-columns";
import { TableCell, TableRow, TableFooter } from "@/components/ui/table";

export default function GCashEarningTableFooter() {
  const { table } = useGCashEarningTable();
  const total = table.getRowModel().rows.length;

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={columns.length} className="first:border-b-0">
          Total records: {total}
        </TableCell>
      </TableRow>
    </TableFooter>
  );
}
