import { getProductsLowStock } from "@/features/products/services/products";
import { sendResponse } from "@/lib/response";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const lowStock = await getProductsLowStock();
  const isLowStockError = !lowStock.success;

  if (isLowStockError) {
    return sendResponse({
      success: lowStock.success,
      status: lowStock.status,
      message: lowStock.message,
      error: { code: "GET_LOW_STOCK_FAILED" },
    });
  }

  return sendResponse({
    success: lowStock.success,
    status: lowStock.status,
    message: lowStock.message,
    data: lowStock.data,
  });
}