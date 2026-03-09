import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/features/auth/services/auth";
import { createClient } from "@/lib/supabase/server";
import { uploadToSupabaseStorage } from "@/lib/supabase/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  const currentUserResult = await getCurrentUser();

  if (!currentUserResult.success) {
    return NextResponse.json(
      { success: false, message: currentUserResult.message },
      { status: currentUserResult.status },
    );
  }

  const user = currentUserResult.data.user;
  const storeId = user?.currentStoreId;

  if (!storeId) {
    return NextResponse.json(
      { success: false, message: "No current store found" },
      { status: 400 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const name = formData.get("name") as string | null;

  if (!file) {
    return NextResponse.json(
      { success: false, message: "No file provided" },
      { status: 400 },
    );
  }

  if (!name) {
    return NextResponse.json(
      { success: false, message: "Product name is required" },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { success: false, message: "File must be less than 5MB" },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { success: false, message: "File must be a valid image (JPEG, PNG, WebP, or GIF)" },
      { status: 400 },
    );
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
    return NextResponse.json({
      success: true,
      message: "Thumbnail uploaded successfully",
      data: {
        thumbnailId: productId,
        thumbnail: path,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload thumbnail";

    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
