import { NextResponse } from "next/server";

export type ErrorDetails = {
  code: string;
  details?: unknown;
};

export type SuccessResponse<T> = Readonly<{
  success: true;
  status: number;
  message: string;
  data: T;
}>;

export type FailureResponse = Readonly<{
  success: false;
  status: number;
  message: string;
  error: ErrorDetails;
}>;

export type ApiResponse<T> = SuccessResponse<T> | FailureResponse;

type SuccessParams<T> = {
  success: true;
  status: number;
  message: string;
  data: T;
};

type FailureParams = {
  success: false;
  status: number;
  message: string;
  error: ErrorDetails;
};

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