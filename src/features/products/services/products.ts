import { getUser as getAccountUser } from "@/features/account/services/account";
import {
  buildProductsCacheKey,
  getCachedProducts,
  getCachedProductsLowStock,
  getCachedProductsTotal,
  invalidateAllProductsCache,
  setCachedProducts,
  setCachedProductsLowStock,
  setCachedProductsTotal,
} from "@/features/products/lib/products-redis";
import type {
  CreateProduct,
  GetProductsParams,
  ProductColumn,
  ProductResponse,
} from "@/features/products/types/products";
import {
  createProductSchema,
  deleteProductSchema,
  updateProductSchema,
} from "@/features/products/validation/products";
import { getFromSupabaseStorage } from "@/lib/supabase/storage";
import { formatZodError } from "@/lib/utils";
import { productRepository } from "@/repositories/product";
import type { Response } from "@/types/shared/response";

const THUMBNAIL_BUCKET = "products";

const getThumbnailUrl = (path: string | null): string | null => {
  if (!path) return null;

  try {
    const url = getFromSupabaseStorage({
      bucket: THUMBNAIL_BUCKET,
      path,
    });
    return url;
  } catch (error) {
    console.error("Error getting thumbnail URL:", error);
    return null;
  }
};

const mapProductToColumn = (product: ProductResponse): ProductColumn => {
  const thumbnailUrl = getThumbnailUrl(product.thumbnail);
  return {
    id: product.id,
    thumbnail: thumbnailUrl,
    name: product.name,
    description: product.description,
    cost_price: product.cost_price,
    selling_price: product.selling_price,
    stock: product.stock,
    min_stock: product.min_stock,
  };
};

export async function createProduct(
  data: CreateProduct,
): Promise<Response<{ id: string }> & { storeId?: string }> {
  const parsed = createProductSchema.safeParse(data);
  const validationFailed = !parsed.success;

  if (validationFailed) {
    return {
      success: false,
      status: 400,
      message: `Validation failed: ${formatZodError(parsed.error)}`,
      error: { code: "VALIDATION_FAILED", details: parsed.error.issues },
    };
  }

  const currentUserResult = await getAccountUser();
  const failedToGetCurrentUser = !currentUserResult.success;

  if (failedToGetCurrentUser) {
    return {
      success: currentUserResult.success,
      status: currentUserResult.status,
      message: currentUserResult.message,
      error: currentUserResult.error,
    };
  }

  const user = currentUserResult.data.user;
  const storeId = user?.currentStoreId ?? null;
  const noStoreIdFound = !storeId;

  if (noStoreIdFound) {
    return {
      success: false,
      status: 400,
      message: "You don't have a current store. Please create a store first.",
      error: { code: "NO_CURRENT_STORE" },
    };
  }

  const createdById = user?.id ?? null;

  if (!createdById) {
    return {
      success: false,
      status: 400,
      message: "Unable to identify the current user.",
      error: { code: "USER_ID_MISSING" },
    };
  }

  try {
    const product = await productRepository.create({
      ...parsed.data,
      storeId,
      createdById,
    });

    await invalidateAllProductsCache(storeId);

    return {
      success: true,
      status: 201,
      message: "Product created successfully",
      data: { id: product.id },
      storeId,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create product";

    return {
      success: false,
      status: 500,
      message,
      error: { code: "PRODUCT_CREATE_FAILED", details: message },
    };
  }
}

export async function updateProduct(
  data: CreateProduct & { id: string },
): Promise<Response<{ id: string }> & { storeId?: string }> {
  const parsed = updateProductSchema.safeParse(data);
  const validationFailed = !parsed.success;

  if (validationFailed) {
    return {
      success: false,
      status: 400,
      message: `Validation failed: ${formatZodError(parsed.error)}`,
      error: { code: "VALIDATION_FAILED", details: parsed.error.issues },
    };
  }

  try {
    const product = await productRepository.update(parsed.data);

    await invalidateAllProductsCache(product.storeId);

    return {
      success: true,
      status: 200,
      message: "Product updated successfully",
      data: { id: product.id },
      storeId: product.storeId,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update product";

    const isNotFound = message.toLowerCase().includes("not found");

    if (isNotFound) {
      return {
        success: false,
        status: 404,
        message: "Product not found",
        error: { code: "PRODUCT_NOT_FOUND" },
      };
    }

    return {
      success: false,
      status: 500,
      message,
      error: { code: "PRODUCT_UPDATE_FAILED", details: message },
    };
  }
}

export async function deleteProduct(data: {
  id: string;
}): Promise<Response<{ id: string }> & { storeId?: string }> {
  const parsed = deleteProductSchema.safeParse(data);
  const validationFailed = !parsed.success;

  if (validationFailed) {
    return {
      success: false,
      status: 400,
      message: `Validation failed: ${formatZodError(parsed.error)}`,
      error: { code: "VALIDATION_FAILED", details: parsed.error.issues },
    };
  }

  try {
    const existing = await productRepository.getById(parsed.data.id);
    const recordNotFound = !existing;

    if (recordNotFound) {
      return {
        success: false,
        status: 404,
        message: "Product not found",
        error: { code: "PRODUCT_NOT_FOUND" },
      };
    }

    await productRepository.delete(parsed.data.id);

    await invalidateAllProductsCache(existing.storeId);

    return {
      success: true,
      status: 200,
      message: "Product deleted successfully",
      data: { id: parsed.data.id },
      storeId: existing.storeId,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete product";

    const isNotFound = message.toLowerCase().includes("not found");

    if (isNotFound) {
      return {
        success: false,
        status: 404,
        message: "Product not found",
        error: { code: "PRODUCT_NOT_FOUND" },
      };
    }

    return {
      success: false,
      status: 500,
      message,
      error: { code: "PRODUCT_DELETE_FAILED", details: message },
    };
  }
}

export async function getProducts(params: GetProductsParams = {}): Promise<
  Response<ProductColumn[]> & {
    storeId?: string;
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  }
> {
  const { page, limit, search, category } = params;

  const currentUser = await getAccountUser();

  const errorCurrentUser = !currentUser.success;

  if (errorCurrentUser) {
    return {
      success: currentUser.success,
      status: currentUser.status,
      message: currentUser.message,
      error: currentUser.error,
    };
  }

  const user = currentUser.data.user;
  const storeId = user?.currentStoreId ?? null;
  const noStoreIdFound = !storeId;

  if (noStoreIdFound) {
    return {
      success: false,
      status: 400,
      message:
        "You don't have a store selected. Please select or create a store first.",
      error: { code: "NO_STORE_SELECTED" },
    };
  }

  const isSearch = search !== undefined && search.length > 0;
  const isCategory = category !== undefined && category.length > 0;
  const isPaginated = page !== undefined && limit !== undefined;

  const cacheKey = buildProductsCacheKey(storeId, {
    page,
    limit,
    search,
    category,
  });

  try {
    const cached = await getCachedProducts<any>(cacheKey);
    const isCached = !!cached;

    if (isCached) {
      return cached;
    }

    if (isSearch) {
      const result = await productRepository.getByStoreIdAndSearch(
        storeId,
        search,
        page ?? 1,
        limit ?? 15,
      );

      const mappedProducts: ProductColumn[] = result.data.map((p) =>
        mapProductToColumn({
          id: p.id,
          storeId: p.storeId,
          createdById: p.createdById,
          thumbnail: p.thumbnail,
          name: p.name,
          description: p.description,
          sku: p.sku,
          barcode: p.barcode,
          brand: p.brand,
          category: p.category,
          unit: p.unit,
          size: p.size,
          cost_price: p.cost_price?.toNumber() ?? null,
          selling_price: p.selling_price.toNumber(),
          stock: p.stock,
          min_stock: p.min_stock,
          is_active: p.is_active,
          created_at: p.created_at,
          updated_at: p.updated_at,
        }),
      );

      const payload: Response<ProductColumn[]> & {
        storeId: string;
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      } = {
        success: true,
        status: 200,
        message: "Products retrieved successfully",
        data: mappedProducts,
        storeId,
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      };

      await setCachedProducts(payload, storeId, {
        search,
        page: page ?? 1,
        limit: limit ?? 15,
      });

      return payload;
    }

    if (isCategory) {
      const result = await productRepository.getByStoreIdAndCategory(
        storeId,
        category,
        page ?? 1,
        limit ?? 15,
      );

      const mappedProducts: ProductColumn[] = result.data.map((p) =>
        mapProductToColumn({
          id: p.id,
          storeId: p.storeId,
          createdById: p.createdById,
          thumbnail: p.thumbnail,
          name: p.name,
          description: p.description,
          sku: p.sku,
          barcode: p.barcode,
          brand: p.brand,
          category: p.category,
          unit: p.unit,
          size: p.size,
          cost_price: p.cost_price?.toNumber() ?? null,
          selling_price: p.selling_price.toNumber(),
          stock: p.stock,
          min_stock: p.min_stock,
          is_active: p.is_active,
          created_at: p.created_at,
          updated_at: p.updated_at,
        }),
      );

      const payload: Response<ProductColumn[]> & {
        storeId: string;
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      } = {
        success: true,
        status: 200,
        message: "Products retrieved successfully",
        data: mappedProducts,
        storeId,
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      };

      await setCachedProducts(payload, storeId, {
        category,
        page: page ?? 1,
        limit: limit ?? 15,
      });

      return payload;
    }

    if (isPaginated) {
      const result = await productRepository.getByStoreIdPageable(
        storeId,
        page,
        limit,
      );

      const mappedProducts: ProductColumn[] = result.data.map((p) =>
        mapProductToColumn({
          id: p.id,
          storeId: p.storeId,
          createdById: p.createdById,
          thumbnail: p.thumbnail,
          name: p.name,
          description: p.description,
          sku: p.sku,
          barcode: p.barcode,
          brand: p.brand,
          category: p.category,
          unit: p.unit,
          size: p.size,
          cost_price: p.cost_price?.toNumber() ?? null,
          selling_price: p.selling_price.toNumber(),
          stock: p.stock,
          min_stock: p.min_stock,
          is_active: p.is_active,
          created_at: p.created_at,
          updated_at: p.updated_at,
        }),
      );

      const payload: Response<ProductColumn[]> & {
        storeId: string;
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      } = {
        success: true,
        status: 200,
        message: "Products retrieved successfully",
        data: mappedProducts,
        storeId,
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      };

      await setCachedProducts(payload, storeId, {
        page,
        limit,
      });

      return payload;
    }

    const allProducts = await productRepository.getByStoreId(storeId);

    const mappedProducts: ProductColumn[] = await Promise.all(
      allProducts.map((p) =>
        mapProductToColumn({
          id: p.id,
          storeId: p.storeId,
          createdById: p.createdById,
          thumbnail: p.thumbnail,
          name: p.name,
          description: p.description,
          sku: p.sku,
          barcode: p.barcode,
          brand: p.brand,
          category: p.category,
          unit: p.unit,
          size: p.size,
          cost_price: p.cost_price?.toNumber() ?? null,
          selling_price: p.selling_price.toNumber(),
          stock: p.stock,
          min_stock: p.min_stock,
          is_active: p.is_active,
          created_at: p.created_at,
          updated_at: p.updated_at,
        }),
      ),
    );

    const payload: Response<ProductColumn[]> & {
      storeId: string;
      total: number;
    } = {
      success: true,
      status: 200,
      message: "Products retrieved successfully",
      data: mappedProducts,
      storeId,
      total: mappedProducts.length,
    };

    await setCachedProducts(payload, storeId);

    return payload;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to retrieve products";

    return {
      success: false,
      status: 500,
      message,
      error: { code: "PRODUCTS_FETCH_FAILED", details: message },
    };
  }
}

export async function getProductsTotal(): Promise<Response<number>> {
  const currentUserResult = await getAccountUser();
  const failedToGetCurrentUser = !currentUserResult.success;

  if (failedToGetCurrentUser) {
    return {
      success: currentUserResult.success,
      status: currentUserResult.status,
      message: currentUserResult.message,
      error: currentUserResult.error,
    };
  }

  const user = currentUserResult.data.user;
  const storeId = user?.currentStoreId ?? null;
  const noStoreIdFound = !storeId;

  if (noStoreIdFound) {
    return {
      success: false,
      status: 400,
      message: "You don't have a current store. Please create a store first.",
      error: { code: "NO_CURRENT_STORE" },
    };
  }

  try {
    const cached = await getCachedProductsTotal(storeId);
    const isCached = cached !== null;

    if (isCached) {
      return {
        success: true,
        status: 200,
        message: "Products total retrieved successfully",
        data: cached,
      };
    }

    const total = await productRepository.getTotalByStoreId(storeId);

    await setCachedProductsTotal(storeId, total);

    return {
      success: true,
      status: 200,
      message: "Products total retrieved successfully",
      data: total,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to retrieve products total";

    return {
      success: false,
      status: 500,
      message,
      error: { code: "PRODUCTS_TOTAL_FETCH_FAILED", details: message },
    };
  }
}

export async function getProductsLowStock(): Promise<Response<number>> {
  const currentUserResult = await getAccountUser();
  const failedToGetCurrentUser = !currentUserResult.success;

  if (failedToGetCurrentUser) {
    return {
      success: currentUserResult.success,
      status: currentUserResult.status,
      message: currentUserResult.message,
      error: currentUserResult.error,
    };
  }

  const user = currentUserResult.data.user;
  const storeId = user?.currentStoreId ?? null;
  const noStoreIdFound = !storeId;

  if (noStoreIdFound) {
    return {
      success: false,
      status: 400,
      message: "You don't have a current store. Please create a store first.",
      error: { code: "NO_CURRENT_STORE" },
    };
  }

  try {
    const cached = await getCachedProductsLowStock(storeId);
    const isCached = cached !== null;

    if (isCached) {
      return {
        success: true,
        status: 200,
        message: "Products low stock count retrieved successfully",
        data: cached,
      };
    }

    const count = await productRepository.getLowStockByStoreId(storeId);

    await setCachedProductsLowStock(storeId, count);

    return {
      success: true,
      status: 200,
      message: "Products low stock count retrieved successfully",
      data: count,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to retrieve products low stock count";

    return {
      success: false,
      status: 500,
      message,
      error: { code: "PRODUCTS_LOW_STOCK_FETCH_FAILED", details: message },
    };
  }
}
