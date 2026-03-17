"use client";

import {
  Delete01Icon,
  Edit01Icon,
  MoreVertical,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import GCashEarningForm from "@/features/gcash/components/gcash-earning-form";
import { useDeleteGCashEarning } from "@/features/gcash/hooks/use-gcash-earning";
import {
  type GCashEarningActionCellProps,
  GCashEarningColumn,
} from "@/features/gcash/types/gcash";

export function GCashEarningActionCell({
  gcashEarning,
}: GCashEarningActionCellProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const { isDeleteGCashEarningPending, deleteGCashEarning } =
    useDeleteGCashEarning();

  const handleDelete = () => {
    deleteGCashEarning(
      { id: gcashEarning.id },
      {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
        },
      },
    );
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
            onClick={() => setIsEditSheetOpen(true)}
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
          <GCashEarningForm gcashEarning={gcashEarning} />
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete GCash Earning</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this GCash earning? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleteGCashEarningPending}
              variant="destructive"
            >
              {isDeleteGCashEarningPending ? (
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
