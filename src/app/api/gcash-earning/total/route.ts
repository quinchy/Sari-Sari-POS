import { NextRequest, NextResponse } from "next/server";
import { getGCashEarningTotal } from "@/features/gcash/services/gcash";
import { getCurrentUser } from "@/features/auth/services/auth";
import {
  getCachedGCashEarningsTotal,
  setCachedGCashEarningsTotal,
} from "@/features/gcash/lib/gcash-redis";

export async function GET() {
  try {
    const currentUserResult = await getCurrentUser();
    if (!currentUserResult.success) {
      return NextResponse.json(
        { success: false, message: currentUserResult.message },
        { status: currentUserResult.status },
      );
    }

    const storeId = currentUserResult.data.user?.currentStoreId;
    if (!storeId) {
      return NextResponse.json(
        { success: false, message: "No store found" },
        { status: 400 },
      );
    }

    // Try cache first
    const cached = await getCachedGCashEarningsTotal(storeId);
    if (cached !== null) {
      return NextResponse.json(
        {
          success: true,
          message: "GCash earnings total retrieved successfully",
          data: cached,
        },
        { status: 200, headers: { "X-Cache": "HIT" } },
      );
    }

    const result = await getGCashEarningTotal();

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    // Cache the result
    await setCachedGCashEarningsTotal(storeId, result.data ?? 0);

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        data: result.data,
      },
      { status: 200 },
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
