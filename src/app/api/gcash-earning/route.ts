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
  getGCashEarningsCacheKey,
  invalidateAllGCashEarningsCache,
} from "@/features/gcash/lib/gcash-redis";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    // Parse params - all optional now
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const yearNum = year ? parseInt(year, 10) : undefined;
    const monthNum = month ? parseInt(month, 10) : undefined;

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

    // If year and month are provided, return chart data (no caching for chart)
    if (yearNum !== undefined && monthNum !== undefined) {
      const result = await getGCashEarning
        (undefined, undefined, yearNum, monthNum);

      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: result.status },
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: result.message,
          data: result.data ?? [],
        },
        { status: 200 },
      );
    }

    // If page and limit are provided, return paginated data (with caching)
    if (pageNum !== undefined && limitNum !== undefined) {
      const cacheKey = getGCashEarningsCacheKey(storeId, pageNum, limitNum);
      const cached = await getCachedGCashEarnings<any>(storeId, pageNum, limitNum);
      if (cached) {
        return NextResponse.json(cached, {
          status: 200,
          headers: { "X-Cache": "HIT", "X-Cache-Key": cacheKey },
        });
      }

      const result = await getGCashEarning(pageNum, limitNum);

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

      await setCachedGCashEarnings(storeId, payload, pageNum, limitNum);

      return NextResponse.json(payload, { status: 200 });
    }

    // No params: return all data (no pagination, no caching)
    const result = await getGCashEarning();

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        data: result.data ?? [],
        pagination: {
          page: 1,
          limit: result.total ?? 0,
          total: result.total ?? 0,
          totalPages: 1,
        },
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
      await invalidateAllGCashEarningsCache(result.storeId);
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
      await invalidateAllGCashEarningsCache(result.storeId);
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
      await invalidateAllGCashEarningsCache(result.storeId);
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
