import { type NextRequest } from "next/server";
import { getCurrentStore } from "@/features/store/services/store";
import { sendResponse } from "@/lib/response";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: NextRequest) {
  try {
    const store = await getCurrentStore();
    const storeError = !store.success;

    if (storeError) {
      return sendResponse({
        success: store.success,
        status: store.status,
        message: store.message,
        error: { code: "GET_STORE_FAILED" },
      });
    }

    return sendResponse({
      success: store.success,
      status: store.status,
      message: store.message,
      data: store.data,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      status: 500,
      message:
        error instanceof Error ? error.message : "Internal server error",
      error: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
}
