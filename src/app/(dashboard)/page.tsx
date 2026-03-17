"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useSignOut } from "@/features/auth/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { uploadToSupabaseStorage } from "@/lib/supabase/storage";

export default function Page() {
  const { signOut, isSigningOut } = useSignOut();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      await uploadToSupabaseStorage({
        supabase,
        bucket: "products",
        path: file.name,
        file,
        contentType: file.type,
      });
      alert("Upload successful!");
      setFile(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <p>Dashboard</p>

      <div className="flex gap-2 mt-4">
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <Button onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? <Spinner /> : "Upload"}
        </Button>
      </div>

      <Button
        onClick={() => signOut()}
        disabled={isSigningOut}
        className="mt-4"
      >
        {isSigningOut ? (
          <>
            <Spinner />
            Signing Out
          </>
        ) : (
          "Sign Out"
        )}
      </Button>
    </div>
  );
}
