import { z } from "zod";

const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB

const thumbnailSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_THUMBNAIL_SIZE, "Thumbnail must be less than 5MB")
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type),
    "Thumbnail must be a valid image (JPEG, PNG, WebP, or GIF)",
  )
  .optional();

export const productSchema = z.strictObject({
  name: z.string().min(1, "Name is required").max(255, "Name must not exceed 255 characters"),
  description: z.string().max(1000, "Description must not exceed 1000 characters").optional(),

  thumbnail: thumbnailSchema,
  thumbnailId: z.string().uuid().optional(),

  sku: z.string().max(100, "SKU must not exceed 100 characters").optional(),
  barcode: z.string().max(100, "Barcode must not exceed 100 characters").optional(),

  brand: z.string().max(100, "Brand must not exceed 100 characters").optional(),
  category: z.string().max(100, "Category must not exceed 100 characters").optional(),

  unit: z.string().max(50, "Unit must not exceed 50 characters").optional(),
  size: z.string().max(50, "Size must not exceed 50 characters").optional(),

  cost_price: z
    .number()
    .nonnegative("Cost price must not be negative")
    .max(1_000_000_000, "Cost price must not exceed 1,000,000,000")
    .refine((n) => n === undefined || Number.isInteger(n * 100), {
      message: "Cost price must have at most 2 decimal places",
    })
    .optional(),
  selling_price: z
    .number()
    .positive("Selling price must be above 0")
    .max(1_000_000_000, "Selling price must not exceed 1,000,000,000")
    .refine((n) => Number.isInteger(n * 100), {
      message: "Selling price must have at most 2 decimal places",
    }),

  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock must not be negative")
    .max(1_000_000, "Stock must not exceed 1,000,000")
    .optional(),
  min_stock: z
    .number()
    .int("Minimum stock must be an integer")
    .min(0, "Minimum stock must not be negative")
    .max(1_000_000, "Minimum stock must not exceed 1,000,000")
    .optional(),

  is_active: z.boolean().optional(),

  aliases: z
    .array(
      z.object({
        name: z.string().min(1, "Alias name is required").max(255, "Alias must not exceed 255 characters"),
      }),
    )
    .optional(),
});

export const createProductSchema = z.strictObject({
  name: productSchema.shape.name,
  description: productSchema.shape.description,
  thumbnail: z.string().optional(),
  sku: productSchema.shape.sku,
  barcode: productSchema.shape.barcode,
  brand: productSchema.shape.brand,
  category: productSchema.shape.category,
  unit: productSchema.shape.unit,
  size: productSchema.shape.size,
  cost_price: productSchema.shape.cost_price,
  selling_price: productSchema.shape.selling_price,
  stock: productSchema.shape.stock,
  min_stock: productSchema.shape.min_stock,
  is_active: productSchema.shape.is_active,
  aliases: productSchema.shape.aliases,
});
