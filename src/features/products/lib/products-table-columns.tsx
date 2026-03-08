import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";
import { GCashEarningActionCell } from "@/features/gcash/components/table/gcash-earning-action-cell";
import { GCashEarningColumn } from "@/features/gcash/types/gcash";

export const columns: ColumnDef<GCashEarningColumn>[] = [
  {
    accessorKey: "created_at",
    header: () => <div className="text-left w-fit">Product</div>,
    size: 1000,
    cell: ({ getValue }) => {
      const value = getValue() as string | Date;
      return formatDate(value);
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-left w-fit">Cost Price</div>,
    size: 1000,
    cell: ({ getValue }) => (
      <div className="text-left">₱ {getValue<number>()}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-left w-fit">Selling Price</div>,
    size: 1000,
    cell: ({ getValue }) => (
      <div className="text-left">₱ {getValue<number>()}</div>
    ),
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
