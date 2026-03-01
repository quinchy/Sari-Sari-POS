import AppHeader from "@/components/app-header";
import ProductsToolbar from "@/features/products/components/products-toolbar";

export default function ProductsPage() {
  return (
    <main className="flex flex-col gap-4">
      <AppHeader
        title="Products"
        description="Add, update, and manage products in your store with streamlined tools and a centralized workflow."
      />
      <ProductsToolbar />
    </main>
  );
}
