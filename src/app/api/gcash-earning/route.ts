import { NextRequest, NextResponse } from "next/server";
import {
  createGCashEarningSchema,
  updateGCashEarningSchema,
  deleteGCashEarningSchema,
} from "@/features/gcash/validation/gcash";
import {
  createGCashEarning,
  updateGCashEarning,
  deleteGCashEarning,
  getGCashEarning,
} from "@/features/gcash/services/gcash";
import { getCurrentUser } from "@/features/auth/services/auth";
import { formatZodError } from "@/lib/utils";
import {
  getCachedGCashEarnings,
  setCachedGCashEarnings,
  invalidateGCashEarningsCache,
  getGCashEarningsCacheKey,
} from "@/lib/cache/redis";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "15", 10);

    // Get current user to determine storeId (so cache key is per-store)
    const currentUserResult = await getCurrentUser();
    if (!currentUserResult.success) {
      return NextResponse.json(
        { success: false, message: currentUserResult.message },
        { status: currentUserResult.status },
      );
    }

    const user = currentUserResult.data.user;
    const storeId = user?.currentStoreId ?? null;

    if (!storeId) {
      return NextResponse.json(
        { success: false, message: "Missing storeId" },
        { status: 400 },
      );
    }

    // Build cache key and try reading from cache first (pass storeId, page, limit)
    const cacheKey = getGCashEarningsCacheKey(storeId, page, limit);
    const cached = await getCachedGCashEarnings<any>(storeId, page, limit);
    if (cached) {
      // cached is expected to be the full payload we return below
      return NextResponse.json(cached, {
        status: 200,
        headers: { "X-Cache": "HIT", "X-Cache-Key": cacheKey },
      });
    }

    // Fetch from DB/service if no cache
    const result = await getGCashEarning(page, limit);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    const payload = {
      success: true,
      message: result.message,
      data: result.data ?? [],
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };

    // Store the payload in cache for subsequent requests (store per-page)
    await setCachedGCashEarnings(storeId, payload, page, limit);

    return NextResponse.json(payload, { status: 200 });
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createGCashEarningSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: `Validation failed: ${formatZodError(parsed.error)}`,
        },
        { status: 400 },
      );
    }

    const result = await createGCashEarning(parsed.data);

    if (result.success && result.storeId) {
      await invalidateGCashEarningsCache(result.storeId);
    }

    return NextResponse.json(
      result.success
        ? { success: true, message: result.message, data: result.data }
        : { success: false, message: result.message },
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = updateGCashEarningSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: `Validation failed: ${formatZodError(parsed.error)}`,
        },
        { status: 400 },
      );
    }

    const result = await updateGCashEarning(parsed.data);

    if (result.success && result.storeId) {
      await invalidateGCashEarningsCache(result.storeId);
    }

    return NextResponse.json(
      result.success
        ? { success: true, message: result.message, data: result.data }
        : { success: false, message: result.message },
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

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = deleteGCashEarningSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: `Validation failed: ${formatZodError(parsed.error)}`,
        },
        { status: 400 },
      );
    }

    const result = await deleteGCashEarning(parsed.data.id);

    if (result.success && result.storeId) {
      await invalidateGCashEarningsCache(result.storeId);
    }

    return NextResponse.json(
      result.success
        ? { success: true, message: result.message, data: result.data }
        : { success: false, message: result.message },
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
