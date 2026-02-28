import { flexRender } from "@tanstack/react-table";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import {
  columns,
  type GCashEarning,
} from "@/features/gcash/lib/gcash-earning-table-columns";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function GCashEarningTableBody({
  data,
}: {
  data: GCashEarning[];
}) {
  const table = useReactTable<GCashEarning>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
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
  );
}
