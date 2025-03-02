import { supabase } from "./supabase";

/**
 * Uploads a file to Supabase Storage
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param path Optional path within the bucket
 * @returns URL of the uploaded file or null if upload failed
 */
export async function uploadFile(
  file: File,
  bucket: string = "portfolio",
  path?: string,
): Promise<string | null> {
  try {
    console.log("Starting file upload to bucket:", bucket, "path:", path);

    // Ensure the bucket exists before uploading
    const { createBucketIfNotExists } = await import("./supabase-admin");
    const bucketCreated = await createBucketIfNotExists(bucket, true);
    console.log(`Bucket ${bucket} creation status:`, bucketCreated);

    // Create a unique file name to avoid collisions
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;
    console.log("Generated file path:", filePath);

    // Upload the file to Supabase Storage
    console.log("Uploading file to Supabase...");
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true, // Changed to true to overwrite if file exists
      });

    if (error) {
      console.error("Error uploading file:", error.message, error);
      return null;
    }

    console.log("Upload successful, data:", data);

    // Get the public URL for the file
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    console.log("Generated public URL:", urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadFile:", error);
    return null;
  }
}

/**
 * Deletes a file from Supabase Storage
 * @param filePath The path of the file to delete
 * @param bucket The storage bucket name
 * @returns boolean indicating success or failure
 */
export async function deleteFile(
  filePath: string,
  bucket: string = "portfolio",
): Promise<boolean> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      console.error("Error deleting file:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteFile:", error);
    return false;
  }
}

/**
 * Lists all files in a bucket or path
 * @param bucket The storage bucket name
 * @param path Optional path within the bucket
 * @returns Array of file objects or null if operation failed
 */
export async function listFiles(bucket: string = "portfolio", path?: string) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path || "");

    if (error) {
      console.error("Error listing files:", error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in listFiles:", error);
    return null;
  }
}
