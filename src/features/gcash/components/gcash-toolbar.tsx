import { PlusSignCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import GCashEarningForm from "@/features/gcash/components/gcash-earning-form";

export default function GCashToolbar() {
  return (
    <section className="flex justify-end">
      <Sheet>
        <SheetTrigger
          render={
            <Button>
              <HugeiconsIcon
                icon={PlusSignCircleIcon}
                size={24}
                strokeWidth={2}
              />
              Add GCash Earning
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
