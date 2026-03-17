import { type NextRequest, NextResponse } from "next/server";
import { getGCashEarningExtreme } from "@/features/gcash/services/gcash";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as "highest" | "lowest";

  const invalidType = !type || !["highest", "lowest"].includes(type);

  if (invalidType) {
    return NextResponse.json(
      {
        success: false,
        message: "Type is required and must be 'highest' or 'lowest'",
      },
      { status: 400 },
    );
  }

  const extreme = await getGCashEarningExtreme(type);
  const failedToGetExtreme = !extreme.success;

  if (failedToGetExtreme) {
    return NextResponse.json(
      { success: extreme.success, message: extreme.message },
      { status: extreme.status },
    );
  }

  return NextResponse.json(
    {
      success: extreme.success,
      message: extreme.message,
      data: extreme.data,
    },
    { status: extreme.status },
  );
}
