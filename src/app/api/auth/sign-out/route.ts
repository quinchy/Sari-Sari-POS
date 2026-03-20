import { signOut } from "@/features/auth/services/auth";
import { sendResponse } from "@/lib/response";

export async function POST() {
  try {
    const result = await signOut();

    if (!result.success) {
      return sendResponse({
        success: result.success,
        status: result.status,
        message: result.message,
        error: { code: "SIGN_OUT_FAILED" },
      });
    }

    return sendResponse({
      success: result.success,
      status: result.status,
      message: result.message,
      data: result.data,
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