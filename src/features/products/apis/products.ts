import {
  CreateProduct,
} from "@/features/products/types/products";

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
