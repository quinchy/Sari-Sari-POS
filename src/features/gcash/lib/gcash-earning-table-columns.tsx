// gcash-earning-table-columns.ts
import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";

export type GCashEarning = {
  id: string;
  created_at: string | Date;
  amount: number;
};

export const columns: ColumnDef<GCashEarning>[] = [
  {
    accessorKey: "created_at",
    header: () => <div className="text-left">Date</div>,
    cell: ({ getValue }) => {
      const value = getValue() as string | Date;
      return formatDate(value);
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-left">Amount</div>,
    cell: ({ getValue }) => (
      <div className="text-left">₱ {getValue<number>()}</div>
    ),
  },
];
