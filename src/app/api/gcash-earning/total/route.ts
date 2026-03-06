import { NextResponse } from "next/server";
import { getGCashEarningTotal } from "@/features/gcash/services/gcash";

export const dynamic = "force-dynamic";

export async function GET() {
  const total = await getGCashEarningTotal();
  const failedToGetTotal = !total.success;

  if (failedToGetTotal) {
    return NextResponse.json(
      { success: total.success, message: total.message },
      { status: total.status },
    );
  }

  return NextResponse.json(
    {
      success: total.success,
      message: total.message,
      data: total.data,
    },
    { status: total.status },
  );
}
