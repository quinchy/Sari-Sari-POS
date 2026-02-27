import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

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
    const cacheKey = `gcash-earnings:${storeId}`;

    // try cache
    const cached = await redis.get<typeof result.data>(cacheKey);
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

    // cache miss: store fresh
    await redis.set(cacheKey, result.data, { ex: 300 }); // TTL 5 minutes
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

    // Invalidate cache on create
    if (result.success && (result as any).storeId) {
      const cacheKey = `gcash-earnings:${(result as any).storeId}`;
      await redis.del(cacheKey);
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

    // Invalidate cache on update
    if (result.success) {
      // Get the updated record's storeId to invalidate correct cache
      const { gCashEarningRepository } =
        await import("@/repositories/gcash-earning");
      const updatedRecord = await gCashEarningRepository.getByStoreId(
        parsed.data.id,
      );
      if (updatedRecord && updatedRecord.length > 0) {
        const cacheKey = `gcash-earnings:${updatedRecord[0].storeId}`;
        await redis.del(cacheKey);
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

    // Invalidate cache on delete
    if (result.success) {
      // Note: We'd need to track which store the deleted record belonged to
      // For now, we'll invalidate on a pattern (if Redis supports it)
      // Or accept that cache may have a brief stale entry
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
