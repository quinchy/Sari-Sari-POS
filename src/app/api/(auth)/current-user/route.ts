// app/api/current-user/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/features/auth/services/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    const currentUserError = !currentUser.success;

    if (currentUserError) {
      return NextResponse.json(
        { success: currentUser.success, message: currentUser.message },
        { status: currentUser.status },
      );
    }

    return NextResponse.json(
      {
        success: currentUser.success,
        message: currentUser.message,
        data: currentUser.data,
      },
      { status: currentUser.status },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
