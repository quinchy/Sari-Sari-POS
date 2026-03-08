import { productRepository } from "@/repositories/product";
import { Response } from "@/types/shared/response";
import {
  CreateProduct,
  ProductResponse,
  ProductAliasResponse,
  ProductWithAliasesResponse,
} from "@/features/products/types/products";
import { getCurrentUser } from "@/features/auth/services/auth";
import { formatZodError } from "@/lib/utils";
import { createProductSchema } from "@/features/products/validation/products";

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
    };
  }

  const currentUserResult = await getCurrentUser();
  const failedToGetCurrentUser = !currentUserResult.success;

  if (failedToGetCurrentUser) {
    return {
      success: currentUserResult.success,
      status: currentUserResult.status,
      message: currentUserResult.message,
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
    };
  }

  const createdById = user?.id ?? null;

  if (!createdById) {
    return {
      success: false,
      status: 400,
      message: "Unable to identify the current user.",
    };
  }

  try {
    const product = await productRepository.create({
      ...parsed.data,
      storeId,
      createdById,
    });

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

    return { success: false, status: 500, message };
  }
}
