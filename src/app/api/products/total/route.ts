import { NextResponse } from "next/server";
import { getProductsTotal } from "@/features/products/services/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const total = await getProductsTotal();
  const isTotalError = !total.success;

  if (isTotalError) {
    return NextResponse.json(
      { success: total.success, message: total.message },
      { status: total.status },
    );
  }

  return NextResponse.json(
    {
      success: total.success,
      message: total.message,
      data: total.data,
    },
    { status: total.status },
  );
}
