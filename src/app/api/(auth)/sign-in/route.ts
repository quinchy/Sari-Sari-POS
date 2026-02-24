import { createClient } from "@/lib/supabase/server";
import { signInSchema } from "@/features/auth/validations/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signInSchema.safeParse(body);

    if (!parsed.success) {
      const errors = z.flattenError(parsed.error);
      const formattedErrors = Object.values(errors.fieldErrors)
        .flat()
        .join(", ");

      return NextResponse.json(
        {
          success: false,
          message: `Validation failed: ${formattedErrors}`,
        },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;
    const supabase = await createClient();

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      return NextResponse.json(
        {
          success: false,
          message: `Authentication failed: ${authError.message}`,
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: {
          user: authData.user,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
