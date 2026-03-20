import { type NextRequest } from "next/server";
import {
  createGCashEarning,
  deleteGCashEarning,
  getGCashEarning,
  updateGCashEarning,
} from "@/features/gcash/services/gcash";
import { sendResponse } from "@/lib/response";

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
    return sendResponse({
      success: gcashEarning.success,
      status: gcashEarning.status,
      message: gcashEarning.message,
      error: { code: "GET_GCASH_EARNING_ERROR" },
    });
  }

  return sendResponse({
    success: gcashEarning.success,
    status: gcashEarning.status,
    message: gcashEarning.message,
    data: {
      items: gcashEarning.data ?? [],
      pagination: {
        page: gcashEarning.page,
        limit: gcashEarning.limit,
        total: gcashEarning.total,
        totalPages: gcashEarning.totalPages,
      },
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const createdGCashEarning = await createGCashEarning(body);
  const createdGCashEarningError = !createdGCashEarning.success;

  if (createdGCashEarningError) {
    return sendResponse({
      success: createdGCashEarning.success,
      status: createdGCashEarning.status,
      message: createdGCashEarning.message,
      error: { code: "CREATE_GCASH_EARNING_FAILED" },
    });
  }

  return sendResponse({
    success: createdGCashEarning.success,
    status: createdGCashEarning.status,
    message: createdGCashEarning.message,
    data: createdGCashEarning.data,
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  const updatedGCashEarning = await updateGCashEarning(body);
  const updatedGCashEarningError = !updatedGCashEarning.success;

  if (updatedGCashEarningError) {
    return sendResponse({
      success: updatedGCashEarning.success,
      status: updatedGCashEarning.status,
      message: updatedGCashEarning.message,
      error: { code: "UPDATE_GCASH_EARNING_FAILED" },
    });
  }

  return sendResponse({
    success: updatedGCashEarning.success,
    status: updatedGCashEarning.status,
    message: updatedGCashEarning.message,
    data: updatedGCashEarning.data,
  });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();

  const deletedGCashEarning = await deleteGCashEarning({ id: body.id });
  const deletedGCashEarningError = !deletedGCashEarning.success;

  if (deletedGCashEarningError) {
    return sendResponse({
      success: deletedGCashEarning.success,
      status: deletedGCashEarning.status,
      message: deletedGCashEarning.message,
      error: { code: "DELETE_GCASH_EARNING_FAILED" },
    });
  }

  return sendResponse({
    success: deletedGCashEarning.success,
    status: deletedGCashEarning.status,
    message: deletedGCashEarning.message,
    data: deletedGCashEarning.data,
  });
}