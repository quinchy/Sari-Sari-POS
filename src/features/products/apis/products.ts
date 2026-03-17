import type {
  CreateProduct,
  GetProductsParams,
  ProductColumn,
} from "@/features/products/types/products";
import type { Pagination } from "@/types/shared/pagination";

export const getProducts = async (
  params: GetProductsParams = {},
): Promise<{
  success: boolean;
  message: string;
  data?: ProductColumn[];
  pagination?: Pagination;
}> => {
  const urlParams = new URLSearchParams();

  if (params.page !== undefined) {
    urlParams.set("page", params.page.toString());
  }
  if (params.limit !== undefined) {
    urlParams.set("limit", params.limit.toString());
  }
  if (params.search !== undefined) {
    urlParams.set("search", params.search);
  }
  if (params.category !== undefined) {
    urlParams.set("category", params.category);
  }

  const response = await fetch(`/api/products?${urlParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message);
  }

  return result;
};

export const createProduct = async (data: CreateProduct) => {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to create product");
  }

  return result;
};

export const updateProduct = async (data: CreateProduct & { id: string }) => {
  const response = await fetch("/api/products", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update product");
  }

  return result;
};

export const deleteProduct = async (data: { id: string }) => {
  const response = await fetch("/api/products", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to delete product");
  }

  return result;
};

export const getProductsTotal = async (): Promise<number> => {
  const response = await fetch("/api/products/total", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch products total");
  }

  return result.data;
};

export const getProductsLowStock = async (): Promise<number> => {
  const response = await fetch("/api/products/low-stock", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch products low stock");
  }

  return result.data;
};
