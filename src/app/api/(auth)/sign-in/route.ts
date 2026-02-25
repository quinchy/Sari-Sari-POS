import { NextRequest, NextResponse } from "next/server";
import { signInSchema } from "@/features/auth/validations/auth";
import { signIn } from "@/features/auth/services/auth";
import { formatZodError } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = signInSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: `Validation failed: ${formatZodError(parsed.error)}`,
        },
        { status: 400 },
      );
    }

    const result = await signIn(parsed.data);

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
