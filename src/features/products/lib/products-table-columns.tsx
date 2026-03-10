import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ProductColumn } from "@/features/products/types/products";
import { ProductActionCell } from "@/features/products/components/table/product-action-cell";

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-left w-fit">Product</div>,
    size: 400,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-3">
          {product.thumbnail && (
            <div className="w-12 h-12 rounded-md overflow-hidden bg-muted relative">
              <Image
                src={product.thumbnail}
                alt={product.name}
                width={500}
                height={500}
                className="object-cover"
              />
            </div>
          )}
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-sm font-medium truncate">{product.name}</span>
            <span className="text-xs text-muted-foreground truncate">
              {product.description || "—"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "cost_price",
    header: () => <div className="text-left w-fit">Cost Price</div>,
    size: 120,
    cell: ({ getValue }) => {
      const value = getValue<number | null>();
      return (
        <div className="text-left">
          {value !== null ? `₱ ${value.toFixed(2)}` : "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "selling_price",
    header: () => <div className="text-left w-fit">Selling Price</div>,
    size: 120,
    cell: ({ getValue }) => (
      <div className="text-left">₱ {getValue<number>().toFixed(2)}</div>
    ),
  },
  {
    accessorKey: "stock",
    header: () => <div className="text-left w-fit">Stock</div>,
    size: 80,
    cell: ({ row }) => {
      const stock = row.original.stock;
      const minStock = row.original.min_stock;
      const isLowStock = stock <= minStock;
      return (
        <div className={`text-left ${isLowStock ? "text-orange-500" : ""}`}>
          {stock}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-left w-fit">Action</div>,
    size: 60,
    cell: ({ row }) => {
      const product = row.original;
      return <ProductActionCell product={product} />;
    },
  },
];
