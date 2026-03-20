import { getProductsTotal } from "@/features/products/services/products";
import { sendResponse } from "@/lib/response";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const total = await getProductsTotal();
  const isTotalError = !total.success;

  if (isTotalError) {
    return sendResponse({
      success: total.success,
      status: total.status,
      message: total.message,
      error: { code: "GET_PRODUCTS_TOTAL_FAILED" },
    });
  }

  return sendResponse({
    success: total.success,
    status: total.status,
    message: total.message,
    data: total.data,
  });
}