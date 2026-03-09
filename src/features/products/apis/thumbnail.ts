export const uploadThumbnail = async (file: File, name: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);

  const response = await fetch("/api/products/thumbnail", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to upload thumbnail");
  }

  return result.data;
};
