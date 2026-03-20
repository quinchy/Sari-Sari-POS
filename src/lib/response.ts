import { NextResponse } from "next/server";
import type {
  ApiResponse,
  FailureResponse,
  FailureParams,
  SuccessResponse,
  SuccessParams,
} from "@/types/shared/response";

export function sendResponse<T>(
  params: SuccessParams<T> | FailureParams
): NextResponse<ApiResponse<T>> {
  const { success, status, message } = params;

  if (success) {
    return NextResponse.json(
      {
        success,
        status,
        message,
        data: params.data,
      } as SuccessResponse<T>,
      { status }
    );
  }

  return NextResponse.json(
    {
      success,
      status,
      message,
      error: params.error,
    } as FailureResponse,
    { status }
  );
}