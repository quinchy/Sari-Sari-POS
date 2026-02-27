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
import {
  getCachedGCashEarnings,
  setCachedGCashEarnings,
  invalidateGCashEarningsCache,
} from "@/lib/cache/redis";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const result = await getGCashEarning();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: result.status },
      );
    }

    const storeId = (result as any).storeId;

    // Try to get from Redis cache
    const cached = await getCachedGCashEarnings(storeId);
    if (cached) {
      return NextResponse.json(
        {
          success: true,
          message: result.message,
          data: cached,
        },
        { status: 200 },
      );
    }

    // Cache miss: store fresh data in Redis
    await setCachedGCashEarnings(storeId, result.data, 300); // 5 minutes TTL

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

    // Invalidate Redis cache on successful creation
    if (result.success && (result as any).storeId) {
      await invalidateGCashEarningsCache((result as any).storeId);
    }

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

    // Invalidate Redis cache on successful update
    if (result.success) {
      // Get the updated record's storeId to invalidate correct cache
      const { gCashEarningRepository } =
        await import("@/repositories/gcash-earning");
      const updatedRecord = await gCashEarningRepository.getByStoreId(
        parsed.data.id,
      );
      if (updatedRecord && updatedRecord.length > 0) {
        await invalidateGCashEarningsCache(updatedRecord[0].storeId);
      }
    }

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

    // Invalidate Redis cache on successful delete
    if (result.success) {
      // Note: For delete, we don't have easy access to the storeId
      // You may want to enhance the service to return storeId on delete as well
    }

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
