import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignCircleIcon } from "@hugeicons/core-free-icons";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProductForm from "@/features/products/components/product-form";

export default function ProductToolbar() {
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
              Add Product
            </Button>
          }
        />
        <SheetContent showCloseButton={false}>
          <ProductForm />
        </SheetContent>
      </Sheet>
    </section>
  );
}
