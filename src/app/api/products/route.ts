import { type NextRequest, NextResponse } from "next/server";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductsLowStock,
  getProductsTotal,
  updateProduct,
} from "@/features/products/services/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const search = searchParams.get("search");
  const category = searchParams.get("category");

  const pageNum = page ? parseInt(page, 10) : undefined;
  const limitNum = limit ? parseInt(limit, 10) : undefined;

  const products = await getProducts({
    page: pageNum,
    limit: limitNum,
    search: search ?? undefined,
    category: category ?? undefined,
  });
  const isProductsError = !products.success;

  if (isProductsError) {
    return NextResponse.json(
      { success: products.success, message: products.message },
      { status: products.status },
    );
  }

  return NextResponse.json(
    {
      success: products.success,
      message: products.message,
      data: products.data ?? [],
      pagination: {
        page: products.page,
        limit: products.limit,
        total: products.total,
        totalPages: products.totalPages,
      },
    },
    { status: products.status },
  );
}

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

export async function PUT(request: NextRequest) {
  const body = await request.json();

  const updatedProduct = await updateProduct(body);
  const updatedProductError = !updatedProduct.success;

  if (updatedProductError) {
    return NextResponse.json(
      {
        success: updatedProduct.success,
        message: updatedProduct.message,
      },
      { status: updatedProduct.status },
    );
  }

  return NextResponse.json(
    {
      success: updatedProduct.success,
      message: updatedProduct.message,
      data: updatedProduct.data,
    },
    { status: updatedProduct.status },
  );
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();

  const deletedProduct = await deleteProduct({ id: body.id });
  const deletedProductError = !deletedProduct.success;

  if (deletedProductError) {
    return NextResponse.json(
      {
        success: deletedProduct.success,
        message: deletedProduct.message,
      },
      { status: deletedProduct.status },
    );
  }

  return NextResponse.json(
    {
      success: deletedProduct.success,
      message: deletedProduct.message,
      data: deletedProduct.data,
    },
    { status: deletedProduct.status },
  );
}
