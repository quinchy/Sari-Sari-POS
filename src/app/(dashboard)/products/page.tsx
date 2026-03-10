import AppHeader from "@/components/layout/app-header";
import ProductsToolbar from "@/features/products/components/products-toolbar";
import ProductsTable from "@/features/products/components/table/products-table";

export default function ProductsPage() {
  return (
    <main className="flex flex-col gap-4">
      <AppHeader
        title="Products"
        description="Add, update, and manage products in your store with streamlined tools and a centralized workflow."
      />
      <ProductsToolbar />
      <ProductsTable />
    </main>
  );
}
