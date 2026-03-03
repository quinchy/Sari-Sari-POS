import { NextRequest, NextResponse } from "next/server";
import { getGCashEarningExtreme } from "@/features/gcash/services/gcash";
import { getCurrentUser } from "@/features/auth/services/auth";
import {
  getCachedGCashEarningsExtreme,
  setCachedGCashEarningsExtreme,
} from "@/lib/cache/redis";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as "highest" | "lowest";

    if (!type || !["highest", "lowest"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Type is required and must be 'highest' or 'lowest'" },
        { status: 400 },
      );
    }

    // Get current user for storeId
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
        { success: false, message: "No store selected" },
        { status: 400 },
      );
    }

    // Try cache first
    const cached = await getCachedGCashEarningsExtreme(storeId, type);
    if (cached !== null) {
      return NextResponse.json(
        {
          success: true,
          message: `GCash ${type} earning retrieved successfully`,
          data: cached,
        },
        { status: 200, headers: { "X-Cache": "HIT" } },
      );
    }

    const result = await getGCashEarningExtreme(type);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    // Cache the result
    if (result.data) {
      await setCachedGCashEarningsExtreme(storeId, type, result.data);
    }

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
