import { type NextRequest, NextResponse } from "next/server";
import { getCurrentStore } from "@/features/store/services/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: NextRequest) {
  try {
    const store = await getCurrentStore();
    const storeError = !store.success;

    if (storeError) {
      return NextResponse.json(
        { success: store.success, message: store.message },
        { status: store.status },
      );
    }

    return NextResponse.json(
      {
        success: store.success,
        message: store.message,
        data: store.data,
      },
      { status: store.status },
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
