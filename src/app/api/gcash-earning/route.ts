import { type NextRequest, NextResponse } from "next/server";
import {
  createGCashEarning,
  deleteGCashEarning,
  getGCashEarning,
  updateGCashEarning,
} from "@/features/gcash/services/gcash";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
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
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const createdGCashEarning = await createGCashEarning(body);
  const createdGCashEarningError = !createdGCashEarning.success;

  if (createdGCashEarningError) {
    return NextResponse.json(
      {
        success: createdGCashEarning.success,
        message: createdGCashEarning.message,
      },
      { status: createdGCashEarning.status },
    );
  }

  return NextResponse.json(
    {
      success: createdGCashEarning.success,
      message: createdGCashEarning.message,
      data: createdGCashEarning.data,
    },
    { status: createdGCashEarning.status },
  );
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  const updatedGCashEarning = await updateGCashEarning(body);
  const updatedGCashEarningError = !updatedGCashEarning.success;

  if (updatedGCashEarningError) {
    return NextResponse.json(
      {
        success: updatedGCashEarning.success,
        message: updatedGCashEarning.message,
      },
      { status: updatedGCashEarning.status },
    );
  }

  return NextResponse.json(
    {
      success: updatedGCashEarning.success,
      message: updatedGCashEarning.message,
      data: updatedGCashEarning.data,
    },
    { status: updatedGCashEarning.status },
  );
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();

  const deletedGCashEarning = await deleteGCashEarning({ id: body.id });
  const deletedGCashEarningError = !deletedGCashEarning.success;

  if (deletedGCashEarningError) {
    return NextResponse.json(
      {
        success: deletedGCashEarning.success,
        message: deletedGCashEarning.message,
      },
      { status: deletedGCashEarning.status },
    );
  }

  return NextResponse.json(
    {
      success: deletedGCashEarning.success,
      message: deletedGCashEarning.message,
      data: deletedGCashEarning.data,
    },
    { status: deletedGCashEarning.status },
  );
}
