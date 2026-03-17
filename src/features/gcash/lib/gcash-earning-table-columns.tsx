import type { ColumnDef } from "@tanstack/react-table";
import { GCashEarningActionCell } from "@/features/gcash/components/table/gcash-earning-action-cell";
import type { GCashEarningColumn } from "@/features/gcash/types/gcash";
import { formatDate } from "@/lib/utils";

export const columns: ColumnDef<GCashEarningColumn>[] = [
  {
    accessorKey: "created_at",
    header: () => <div className="text-left w-fit">Date</div>,
    size: 1000,
    cell: ({ getValue }) => {
      const value = getValue() as string | Date;
      return formatDate(value);
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-left w-fit">Amount</div>,
    size: 1000,
    cell: ({ getValue }) => (
      <div className="text-left">₱ {getValue<number>()}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-left w-fit">Action</div>,
    size: 0,
    cell: ({ row }) => {
      const gcashEarning = row.original;
      return <GCashEarningActionCell gcashEarning={gcashEarning} />;
    },
  },
];
