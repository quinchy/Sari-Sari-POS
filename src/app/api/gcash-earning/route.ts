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
} from "@/features/gcash/services/gcash";
import { formatZodError } from "@/lib/utils";

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
