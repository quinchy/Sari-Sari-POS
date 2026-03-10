import { NextResponse } from "next/server";
import { getProductsLowStock } from "@/features/products/services/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const lowStock = await getProductsLowStock();
  const isLowStockError = !lowStock.success;

  if (isLowStockError) {
    return NextResponse.json(
      { success: lowStock.success, message: lowStock.message },
      { status: lowStock.status },
    );
  }

  return NextResponse.json(
    {
      success: lowStock.success,
      message: lowStock.message,
      data: lowStock.data,
    },
    { status: lowStock.status },
  );
}
