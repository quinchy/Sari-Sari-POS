import { getGCashEarningTotal } from "@/features/gcash/services/gcash";
import { sendResponse } from "@/lib/response";

export const dynamic = "force-dynamic";

export async function GET() {
  const total = await getGCashEarningTotal();
  const failedToGetTotal = !total.success;

  if (failedToGetTotal) {
    return sendResponse({
      success: total.success,
      status: total.status,
      message: total.message,
      error: { code: "GET_GCASH_TOTAL_FAILED" },
    });
  }

  return sendResponse({
    success: total.success,
    status: total.status,
    message: total.message,
    data: total.data,
  });
}