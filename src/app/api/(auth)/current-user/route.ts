import { NextResponse } from "next/server";
import { getCurrentUser } from "@/features/auth/services/auth";

export async function GET() {
  try {
    const result = await getCurrentUser();

    return NextResponse.json(
      result.success
        ? {
            success: true,
            message: result.message,
            data: result.data,
          }
        : {
            success: false,
            message: result.message,
          },
      { status: result.status },
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
