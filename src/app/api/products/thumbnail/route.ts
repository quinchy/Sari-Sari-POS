import { type NextRequest } from "next/server";
import { getCurrentUser } from "@/features/auth/services/auth";
import { createClient } from "@/lib/supabase/server";
import { uploadToSupabaseStorage } from "@/lib/supabase/storage";
import { sendResponse } from "@/lib/response";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  const currentUserResult = await getCurrentUser();

  if (!currentUserResult.success) {
    return sendResponse({
      success: false,
      status: currentUserResult.status,
      message: currentUserResult.message,
      error: { code: "GET_CURRENT_USER_FAILED" },
    });
  }

  const user = currentUserResult.data.user;
  const storeId = user?.currentStoreId;

  if (!storeId) {
    return sendResponse({
      success: false,
      status: 400,
      message: "No current store found",
      error: { code: "NO_STORE_FOUND" },
    });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const name = formData.get("name") as string | null;

  if (!file) {
    return sendResponse({
      success: false,
      status: 400,
      message: "No file provided",
      error: { code: "NO_FILE_PROVIDED" },
    });
  }

  if (!name) {
    return sendResponse({
      success: false,
      status: 400,
      message: "Product name is required",
      error: { code: "NO_NAME_PROVIDED" },
    });
  }

  if (file.size > MAX_FILE_SIZE) {
    return sendResponse({
      success: false,
      status: 400,
      message: "File must be less than 5MB",
      error: { code: "FILE_TOO_LARGE" },
    });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return sendResponse({
      success: false,
      status: 400,
      message: "File must be a valid image (JPEG, PNG, WebP, or GIF)",
      error: { code: "INVALID_FILE_TYPE" },
    });
  }

  try {
    // Generate UUID for the product (compatible with Prisma's gen_random_uuid())
    const productId = crypto.randomUUID();

    // Create filename: lowercase name with underscores + uuid + extension
    const slugifiedName = name.toLowerCase().replace(/\s+/g, "_");
    const extension = file.name.split(".").pop() || "png";
    const fileName = `${slugifiedName}_${productId}.${extension}`;

    // Path: storeId/filename
    const path = `${storeId}/${fileName}`;

    // Upload to Supabase
    const supabase = await createClient();
    await uploadToSupabaseStorage({
      supabase,
      bucket: "products",
      path,
      file,
      contentType: file.type,
    });

    // Return the path to be stored in the database
    return sendResponse({
      success: true,
      status: 200,
      message: "Thumbnail uploaded successfully",
      data: {
        thumbnailId: productId,
        thumbnail: path,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload thumbnail";

    return sendResponse({
      success: false,
      status: 500,
      message,
      error: { code: "UPLOAD_FAILED" },
    });
  }
}