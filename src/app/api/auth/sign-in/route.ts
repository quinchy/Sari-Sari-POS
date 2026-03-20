import { type NextRequest } from "next/server";
import { signIn } from "@/features/auth/services/auth";
import { sendResponse } from "@/lib/response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const signedIn = await signIn(body);
    const signedInError = !signedIn.success;

    if (signedInError) {
      return sendResponse({
        success: signedIn.success,
        status: signedIn.status,
        message: signedIn.message,
        error: { code: "SIGN_IN_FAILED" },
      });
    }

    return sendResponse({
      success: signedIn.success,
      status: signedIn.status,
      message: signedIn.message,
      data: signedIn.data,
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
