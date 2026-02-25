export type SuccessResponse<T> = {
  success: true;
  status: number;
  message: string;
  data: T;
};

export type FailureResponse = {
  success: false;
  status: number;
  message: string;
};

export type Response<T = unknown> = SuccessResponse<T> | FailureResponse;
