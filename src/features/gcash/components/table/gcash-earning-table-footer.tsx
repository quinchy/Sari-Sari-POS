"use client";

import {
  columns,
  type GCashEarning,
} from "@/features/gcash/lib/gcash-earning-table-columns";
import { TableCell, TableRow, TableFooter } from "@/components/ui/table";

interface GCashEarningTableFooterProps {
  data: GCashEarning[];
}

export default function GCashEarningTableFooter({
  data,
}: GCashEarningTableFooterProps) {
  const total = data.length;

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
