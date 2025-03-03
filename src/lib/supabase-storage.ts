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
    const filePath = path ? `${path}/${file.name}` : file.name;
    console.log(`Uploading file to ${bucket}/${filePath}`);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
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
      throw error;
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
      .list(path || "", {
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      throw error;
    }

    // Filter out folders and map to a simpler format
    const files = data
      .filter((item) => !item.id.endsWith("/"))
      .map((item) => {
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(path ? `${path}/${item.name}` : item.name);

        return {
          name: item.name,
          url: urlData.publicUrl,
          metadata: item.metadata,
        };
      });

    return files;
  } catch (error) {
    console.error("Error in listFiles:", error);
    return null;
  }
}
