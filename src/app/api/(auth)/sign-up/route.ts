import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/features/auth/services/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const signedUp = await signUp(body);
    const signedUpError = !signedUp.success;

    if (signedUpError) {
      return NextResponse.json(
        {
          success: signedUp.success,
          message: signedUp.message,
        },
        { status: signedUp.status },
      );
    }

    return NextResponse.json(
      {
        success: signedUp.success,
        message: signedUp.message,
        data: signedUp.data,
      },
      { status: signedUp.status },
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
