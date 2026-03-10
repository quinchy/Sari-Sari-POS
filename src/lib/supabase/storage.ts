import type { SupabaseClient } from "@supabase/supabase-js";

type UploadToSupabaseStorageParams = {
  supabase: SupabaseClient;
  bucket: string;
  path: string;
  file: File | Blob | ArrayBuffer;
  contentType?: string;
  upsert?: boolean;
};

export async function uploadToSupabaseStorage({
  supabase,
  bucket,
  path,
  file,
  contentType,
  upsert = false,
}: UploadToSupabaseStorageParams) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert,
    });

  if (error) {
    throw error;
  }

  return data;
}

type GetFromSupabaseStorageParams = {
  bucket: string;
  path: string;
};

/**
 * Gets the public URL for a file in Supabase storage.
 * If path is already a full URL, returns it as-is.
 * Otherwise, constructs the URL using the Supabase storage pattern.
 * Format: {SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}
 */
export function getFromSupabaseStorage({
  bucket,
  path,
}: GetFromSupabaseStorageParams): string | null {
  if (!path) return null;

  // If path is already a full URL, return it as-is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}
