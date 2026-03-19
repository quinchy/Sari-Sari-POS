import { type NextRequest, NextResponse } from "next/server";
import { getUserFromPrisma } from "@/features/auth/services/get-user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: NextRequest) {
  try {
    const user = await getUserFromPrisma();
    const userError = !user.success;

    if (userError) {
      return NextResponse.json(
        { success: user.success, message: user.message },
        { status: user.status },
      );
    }

    return NextResponse.json(
      {
        success: user.success,
        message: user.message,
        data: user.data,
      },
      { status: user.status },
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
