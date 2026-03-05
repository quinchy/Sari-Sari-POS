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
import { formatZodError } from "@/lib/utils";
import { invalidateAllGCashEarningsCache } from "@/features/gcash/lib/gcash-redis";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const yearNum = year ? parseInt(year, 10) : undefined;
    const monthNum = month ? parseInt(month, 10) : undefined;

    const gcashEarning = await getGCashEarning({
      page: pageNum,
      limit: limitNum,
      year: yearNum,
      month: monthNum,
    });
    const isGCashEarningError = !gcashEarning.success;

    if (isGCashEarningError) {
      return NextResponse.json(
        { success: gcashEarning.success, message: gcashEarning.message },
        { status: gcashEarning.status },
      );
    }

    return NextResponse.json(
      {
        success: gcashEarning.success,
        message: gcashEarning.message,
        data: gcashEarning.data ?? [],
        pagination: {
          page: gcashEarning.page,
          limit: gcashEarning.limit,
          total: gcashEarning.total,
          totalPages: gcashEarning.totalPages,
        },
      },
      { status: gcashEarning.status },
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
