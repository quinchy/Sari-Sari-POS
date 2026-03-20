import { type NextRequest } from "next/server";
import { getSupabaseUser } from "@/features/auth/services/get-user";
import { sendResponse } from "@/lib/response";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: NextRequest) {
  try {
    const user = await getSupabaseUser();
    const userError = !user.success;

    if (userError) {
      return sendResponse({
        success: user.success,
        status: user.status,
        message: user.message,
        error: { code: "GET_SUPABASE_USER_FAILED" },
      });
    }

    return sendResponse({
      success: user.success,
      status: user.status,
      message: user.message,
      data: user.data,
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