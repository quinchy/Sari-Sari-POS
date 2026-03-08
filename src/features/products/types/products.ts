import { z } from "zod";
import {
  productSchema,
  createProductSchema,
} from "../validation/products";

// ============= Inferred Types =============

export type ProductData = z.infer<typeof productSchema>;

export type CreateProduct = z.input<typeof createProductSchema>;

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

// ============= Component Props =============

export interface ProductFormProps {
  product?: ProductResponse;
}
