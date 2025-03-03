import { supabase } from "./supabase";

/**
 * Initializes storage buckets and tables
 */
export async function initializeStorage(): Promise<boolean> {
  try {
    console.log("Initializing storage...");

    // Create buckets
    await createBucketIfNotExists("portfolio-projects", true);
    await createBucketIfNotExists("portfolio-profile", true);

    // Create site_settings table
    try {
      const { data: settingsCheck, error: settingsError } = await supabase
        .from("site_settings")
        .select("count")
        .limit(1);

      if (settingsError) {
        console.log("Site settings table will be created on first insert");

        // Try to create a default settings entry
        const { getSiteSettings, updateSiteSettings } = await import(
          "./settings"
        );
        const defaultSettings = await getSiteSettings();
        const result = await updateSiteSettings(defaultSettings);
        console.log(
          "Created default site settings:",
          result ? "success" : "failed",
        );
      } else {
        console.log("Site settings check result:", settingsCheck);
      }
    } catch (err) {
      console.log("Error checking site_settings table:", err);
    }

    console.log("Storage initialization complete");
    return true;
  } catch (error) {
    console.error("Error in initializeStorage:", error);
    return false;
  }
}

/**
 * Creates a storage bucket if it doesn't exist
 * @param bucketName The name of the bucket to create
 * @param isPublic Whether the bucket should be public
 * @returns Success status
 */
export async function createBucketIfNotExists(
  bucketName: string,
  isPublic: boolean = true,
): Promise<boolean> {
  try {
    console.log(`Checking if bucket '${bucketName}' exists...`);

    // Check if bucket exists
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      console.error("Error listing buckets:", listError.message);
      // Try to create the bucket anyway
      console.log("Attempting to create bucket despite listing error...");
    } else {
      console.log(
        "Existing buckets:",
        buckets?.map((b) => b.name).join(", ") || "none",
      );
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName);

    if (!bucketExists) {
      // Create the bucket
      console.log(`Creating bucket '${bucketName}'...`);
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
      });

      if (error) {
        console.error("Error creating bucket:", error.message, error);

        // If bucket already exists error, consider it a success
        if (error.message.includes("already exists")) {
          console.log(
            `Bucket '${bucketName}' already exists (from error message)`,
          );
          return true;
        }
        return false;
      }
      console.log(`Bucket '${bucketName}' created successfully`);

      // Update bucket policy to make it public if requested
      if (isPublic) {
        console.log(`Setting bucket '${bucketName}' to public...`);
        try {
          const { error: updateError } = await supabase.storage.updateBucket(
            bucketName,
            {
              public: true,
            },
          );

          if (updateError) {
            console.error("Error making bucket public:", updateError.message);
          } else {
            console.log(`Bucket '${bucketName}' set to public successfully`);
          }
        } catch (updateErr) {
          console.error("Error updating bucket policy:", updateErr);
        }
      }
    } else {
      console.log(`Bucket '${bucketName}' already exists`);
    }

    return true;
  } catch (error) {
    console.error("Error in createBucketIfNotExists:", error);
    return false;
  }
}
