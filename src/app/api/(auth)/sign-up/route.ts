import { createClient } from "@/lib/supabase/server";
import { signUpSchema } from "@/features/auth/validations/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);

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

    const { email, password, firstName, lastName } = parsed.data;
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
      },
    });

    if (authError) {
      return NextResponse.json(
        {
          success: false,
          message: `Authentication failed: ${authError.message}`,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        data: {
          user: authData.user,
        },
      },
      { status: 201 },
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
