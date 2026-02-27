// gcash-earning-table-columns.ts
import type { ColumnDef } from "@tanstack/react-table";

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
      const v = getValue() as string | Date;
      return new Date(v).toLocaleDateString();
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-left">Amount</div>,
    cell: ({ getValue }) => (
      <div className="text-left">{getValue<number>()}</div>
    ),
  },
];
