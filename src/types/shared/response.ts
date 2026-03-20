type ErrorDetails = {
  code: string;
  details?: unknown;
};

type BaseParams = {
  status: number;
  message: string;
};

export type SuccessResponse<T> = BaseParams & {
  success: true;
  data: T;
};

export type FailureResponse = BaseParams & {
  success: false;
  error: ErrorDetails;
};

export type SuccessParams<T> = SuccessResponse<T>;
export type FailureParams = FailureResponse;

export type ApiResponse<T> = SuccessResponse<T> | FailureResponse;

export type Response<T> = ApiResponse<T>;