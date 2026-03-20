import { type NextRequest } from "next/server";
import { signUp } from "@/features/auth/services/auth";
import { sendResponse } from "@/lib/response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const signedUp = await signUp(body);
    const signedUpError = !signedUp.success;

    if (signedUpError) {
      return sendResponse({
        success: signedUp.success,
        status: signedUp.status,
        message: signedUp.message,
        error: { code: "SIGN_UP_FAILED" },
      });
    }

    return sendResponse({
      success: signedUp.success,
      status: signedUp.status,
      message: signedUp.message,
      data: signedUp.data,
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
