import { NextRequest, NextResponse } from "next/server";
import { createProduct } from "@/features/products/services/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  const body = await request.json();

  const createdProduct = await createProduct(body);
  const createdProductError = !createdProduct.success;

  if (createdProductError) {
    return NextResponse.json(
      {
        success: createdProduct.success,
        message: createdProduct.message,
      },
      { status: createdProduct.status },
    );
  }

  return NextResponse.json(
    {
      success: createdProduct.success,
      message: createdProduct.message,
      data: createdProduct.data,
    },
    { status: createdProduct.status },
  );
}
