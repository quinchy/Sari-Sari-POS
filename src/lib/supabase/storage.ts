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
