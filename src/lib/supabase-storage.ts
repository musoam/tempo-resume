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
    // Create the bucket if it doesn't exist
    await createBucketIfNotExists(bucket);

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
 * Creates a bucket if it doesn't exist
 * @param bucketName The name of the bucket to create
 * @returns Success status
 */
async function createBucketIfNotExists(bucketName: string): Promise<boolean> {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      console.error("Error listing buckets:", listError);
      return false;
    }

    const bucketExists = buckets.some((bucket) => bucket.name === bucketName);

    if (!bucketExists) {
      // Create the bucket
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true, // Make bucket public
      });

      if (error) {
        console.error("Error creating bucket:", error);
        return false;
      }

      console.log(`Bucket '${bucketName}' created successfully`);
    }

    return true;
  } catch (error) {
    console.error("Error in createBucketIfNotExists:", error);
    return false;
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
    // Create the bucket if it doesn't exist
    await createBucketIfNotExists(bucket);

    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path || "", {
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      throw error;
    }

    // If no data or empty array, return empty array
    if (!data || data.length === 0) {
      return [];
    }

    // Filter out folders and map to a simpler format
    const files = data
      .filter((item) => !item.name.endsWith("/"))
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
    return [];
  }
}
