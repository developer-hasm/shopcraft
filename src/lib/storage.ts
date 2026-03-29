import { createClient } from "@/lib/supabase/server";
import {
  MAX_IMAGE_SIZE,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  STORAGE_BUCKET_IMAGES,
  STORAGE_BUCKET_FILES,
  SIGNED_URL_EXPIRY_SECONDS,
} from "@/config/products";

export interface UploadResult {
  url: string;
  path: string;
}

function generateFilePath(userId: string, fileName: string): string {
  const ext = fileName.split(".").pop() ?? "bin";
  const uniqueName = `${crypto.randomUUID()}.${ext}`;
  return `${userId}/${uniqueName}`;
}

export async function uploadProductImage(
  file: File,
  userId: string
): Promise<UploadResult> {
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`Image must be under ${MAX_IMAGE_SIZE / 1024 / 1024}MB`);
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
    throw new Error("Only JPEG, PNG, and WebP images are allowed");
  }

  const supabase = await createClient();
  const filePath = generateFilePath(userId, file.name);

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET_IMAGES)
    .upload(filePath, file, { contentType: file.type });

  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET_IMAGES)
    .getPublicUrl(filePath);

  return { url: urlData.publicUrl, path: filePath };
}

export async function uploadProductFile(
  file: File,
  userId: string
): Promise<UploadResult & { fileName: string; fileSize: number; mimeType: string }> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File must be under ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  const supabase = await createClient();
  const filePath = generateFilePath(userId, file.name);

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET_FILES)
    .upload(filePath, file, { contentType: file.type });

  if (error) throw new Error(`File upload failed: ${error.message}`);

  return {
    url: filePath,
    path: filePath,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
  };
}

export async function deleteStorageFile(
  bucket: string,
  path: string
): Promise<void> {
  const supabase = await createClient();
  await supabase.storage.from(bucket).remove([path]);
}

export async function getSignedDownloadUrl(
  filePath: string
): Promise<string | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET_FILES)
    .createSignedUrl(filePath, SIGNED_URL_EXPIRY_SECONDS);

  if (error || !data) return null;

  return data.signedUrl;
}
