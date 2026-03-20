import { type NextRequest } from "next/server";
import { getGCashEarningExtreme } from "@/features/gcash/services/gcash";
import { sendResponse } from "@/lib/response";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as "highest" | "lowest";

  const invalidType = !type || !["highest", "lowest"].includes(type);

  if (invalidType) {
    return sendResponse({
      success: false,
      status: 400,
      message: "Type is required and must be 'highest' or 'lowest'",
      error: { code: "INVALID_TYPE" },
    });
  }

  const extreme = await getGCashEarningExtreme(type);
  const failedToGetExtreme = !extreme.success;

  if (failedToGetExtreme) {
    return sendResponse({
      success: extreme.success,
      status: extreme.status,
      message: extreme.message,
      error: { code: "GET_EXTREME_FAILED" },
    });
  }

  return sendResponse({
    success: extreme.success,
    status: extreme.status,
    message: extreme.message,
    data: extreme.data,
  });
}