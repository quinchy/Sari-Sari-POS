import { createClient } from "@/lib/supabase/server";
import { signInSchema } from "@/features/auth/validations/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validationResult = signInSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: z.treeifyError(validationResult.error),
        },
        { status: 400 },
      );
    }

    const { email, password } = validationResult.data;

    const supabase = await createClient();

    // Sign in the user with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 401 });
    }

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: authData.user?.id,
          email: authData.user?.email,
          accessToken: authData.session?.access_token,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
