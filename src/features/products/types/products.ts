import { z } from "zod";
import {
  productSchema,
  createProductSchema,
} from "../validation/products";

// ============= Inferred Types =============

export type ProductData = z.infer<typeof productSchema>;

export type CreateProduct = z.input<typeof createProductSchema> & {
  thumbnail?: string;
};

// ============= Response Types =============

export type ProductResponse = {
  id: string;
  storeId: string;
  createdById: string;
  thumbnail: string | null;
  name: string;
  description: string | null;
  sku: string | null;
  barcode: string | null;
  brand: string | null;
  category: string | null;
  unit: string | null;
  size: string | null;
  cost_price: number | null;
  selling_price: number;
  stock: number;
  min_stock: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

export type ProductAliasResponse = {
  id: string;
  productId: string;
  name: string;
  created_at: Date;
  updated_at: Date;
};

export type ProductWithAliasesResponse = ProductResponse & {
  aliases: ProductAliasResponse[];
};

// ============= Column Types =============

export type ProductColumn = {
  id: string;
  thumbnail: string | null;
  name: string;
  description: string | null;
  cost_price: number | null;
  selling_price: number;
  stock: number;
  min_stock: number;
};

// ============= API Params =============

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

// ============= Hook Params =============

export interface UseGetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

// ============= Component Props =============

export interface ProductFormProps {
  product?: ProductResponse;
}

export interface ProductActionCellProps {
  product: ProductColumn;
}
