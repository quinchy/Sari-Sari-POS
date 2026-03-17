"use client";

import { PlusSignCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import GCashEarningForm from "@/features/gcash/components/gcash-earning-form";

export default function ProductsToolbar() {
  return (
    <section className="flex justify-between">
      <Input
        placeholder="Search products..."
        variant="search"
        className="min-w-sm"
      />
      <Sheet>
        <SheetTrigger
          render={
            <Button>
              <HugeiconsIcon
                icon={PlusSignCircleIcon}
                size={24}
                strokeWidth={2}
              />
              Add Products
            </Button>
          }
        />
        <SheetContent showCloseButton={false}>
          <GCashEarningForm />
        </SheetContent>
      </Sheet>
    </section>
  );
}
