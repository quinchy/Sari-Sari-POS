import { type NextRequest } from "next/server";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductsLowStock,
  getProductsTotal,
  updateProduct,
} from "@/features/products/services/products";
import { sendResponse } from "@/lib/response";

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
    return sendResponse({
      success: products.success,
      status: products.status,
      message: products.message,
      error: { code: "GET_PRODUCTS_FAILED" },
    });
  }

  return sendResponse({
    success: products.success,
    status: products.status,
    message: products.message,
    data: {
      items: products.data ?? [],
      pagination: {
        page: products.page,
        limit: products.limit,
        total: products.total,
        totalPages: products.totalPages,
      },
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const createdProduct = await createProduct(body);
  const createdProductError = !createdProduct.success;

  if (createdProductError) {
    return sendResponse({
      success: createdProduct.success,
      status: createdProduct.status,
      message: createdProduct.message,
      error: { code: "CREATE_PRODUCT_FAILED" },
    });
  }

  return sendResponse({
    success: createdProduct.success,
    status: createdProduct.status,
    message: createdProduct.message,
    data: createdProduct.data,
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  const updatedProduct = await updateProduct(body);
  const updatedProductError = !updatedProduct.success;

  if (updatedProductError) {
    return sendResponse({
      success: updatedProduct.success,
      status: updatedProduct.status,
      message: updatedProduct.message,
      error: { code: "UPDATE_PRODUCT_FAILED" },
    });
  }

  return sendResponse({
    success: updatedProduct.success,
    status: updatedProduct.status,
    message: updatedProduct.message,
    data: updatedProduct.data,
  });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();

  const deletedProduct = await deleteProduct({ id: body.id });
  const deletedProductError = !deletedProduct.success;

  if (deletedProductError) {
    return sendResponse({
      success: deletedProduct.success,
      status: deletedProduct.status,
      message: deletedProduct.message,
      error: { code: "DELETE_PRODUCT_FAILED" },
    });
  }

  return sendResponse({
    success: deletedProduct.success,
    status: deletedProduct.status,
    message: deletedProduct.message,
    data: deletedProduct.data,
  });
}
