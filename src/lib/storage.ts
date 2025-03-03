// This file is deprecated. Use supabase-storage.ts instead.
// Keeping this file for backward compatibility.

import {
  uploadFile as uploadToSupabase,
  deleteFile as deleteFromSupabase,
  listFiles as listSupabaseFiles,
} from "./supabase-storage";

export async function uploadFile(
  file: File,
  bucket: string = "portfolio",
  path?: string,
): Promise<string | null> {
  return uploadToSupabase(file, bucket, path);
}

export async function deleteFile(
  filePath: string,
  bucket: string = "portfolio",
): Promise<boolean> {
  return deleteFromSupabase(filePath, bucket);
}

export async function listFiles(bucket: string = "portfolio", path?: string) {
  return listSupabaseFiles(bucket, path);
}
