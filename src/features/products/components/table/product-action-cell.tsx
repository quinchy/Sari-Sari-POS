"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Edit01Icon,
  Delete01Icon,
  MoreVertical,
} from "@hugeicons/core-free-icons";
import { useDeleteProduct, useUpdateProduct } from "@/features/products/hooks/use-products";
import { ProductColumn, ProductActionCellProps } from "@/features/products/types/products";
import { Spinner } from "@/components/ui/spinner";
import ProductsForm from "@/features/products/components/products-form";

export function ProductActionCell({
  product,
}: ProductActionCellProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const { isDeleteProductPending, deleteProduct } = useDeleteProduct();
  const { isUpdateProductPending, updateProduct: updateProductMutate } = useUpdateProduct();

  const handleDelete = () => {
    deleteProduct(
      { id: product.id },
      {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
        },
      },
    );
  };

  const handleEdit = () => {
    setIsEditSheetOpen(true);
  };

  return (
    <div className="w-fit">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <HugeiconsIcon icon={MoreVertical} size={18} />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-sky-500 hover:bg-sky-50"
            onClick={handleEdit}
          >
            <HugeiconsIcon icon={Edit01Icon} size={16} className="mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500 hover:bg-red-50"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <HugeiconsIcon icon={Delete01Icon} size={16} className="mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent side="right" showCloseButton={false}>
          <ProductsForm
            product={{
              id: product.id,
              storeId: "",
              createdById: "",
              thumbnail: product.thumbnail,
              name: product.name,
              description: product.description,
              sku: null,
              barcode: null,
              brand: null,
              category: null,
              unit: null,
              size: null,
              cost_price: product.cost_price,
              selling_price: product.selling_price,
              stock: product.stock,
              min_stock: product.min_stock,
              is_active: true,
              created_at: new Date(),
              updated_at: new Date(),
            }}
          />
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleteProductPending}
              variant="destructive"
            >
              {isDeleteProductPending ? (
                <>
                  <Spinner /> Deleting
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
