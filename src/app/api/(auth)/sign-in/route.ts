import { type NextRequest, NextResponse } from "next/server";
import { signIn } from "@/features/auth/services/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const signedIn = await signIn(body);
    const signedInError = !signedIn.success;

    if (signedInError) {
      return NextResponse.json(
        {
          success: signedIn.success,
          message: signedIn.message,
        },
        { status: signedIn.status },
      );
    }

    return NextResponse.json(
      {
        success: signedIn.success,
        message: signedIn.message,
        data: signedIn.data,
      },
      { status: signedIn.status },
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
