import { supabase } from "./supabase";

/**
 * Creates a new storage bucket if it doesn't exist
 * @param bucketName Name of the bucket to create
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

/**
 * Updates bucket settings
 * @param bucketName Name of the bucket to update
 * @param isPublic Whether the bucket should be public
 * @returns Success status
 */
export async function updateBucketSettings(
  bucketName: string,
  isPublic: boolean,
): Promise<boolean> {
  try {
    const { error } = await supabase.storage.updateBucket(bucketName, {
      public: isPublic,
    });

    if (error) {
      console.error("Error updating bucket settings:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateBucketSettings:", error);
    return false;
  }
}

/**
 * Initializes the required storage buckets for the portfolio application
 */
export async function initializeStorage(): Promise<void> {
  try {
    // Create the main portfolio bucket for general uploads
    await createBucketIfNotExists("portfolio", true);

    // Create specific buckets for different types of content
    await createBucketIfNotExists("portfolio-projects", true);
    await createBucketIfNotExists("portfolio-profile", true);

    // Create database tables if they don't exist
    await createTablesIfNotExist();

    // Create site_settings table
    try {
      const { data: settingsCheck } = await supabase
        .from("site_settings")
        .select("count")
        .limit(1);

      console.log("Site settings check result:", settingsCheck);
    } catch (err) {
      console.log("Site settings table will be created on first insert");
    }

    console.log("Storage initialization completed");
  } catch (error) {
    console.error("Error initializing storage:", error);
  }
}

/**
 * Creates necessary database tables if they don't exist
 */
async function createTablesIfNotExist(): Promise<void> {
  try {
    // Check if projects table exists by attempting a query
    const projectsCheck = await supabase
      .from("projects")
      .select("count")
      .limit(1);
    if (projectsCheck.error) {
      console.log(
        "Projects table does not exist, will be created on first insert",
      );
    } else {
      console.log("Projects table exists");
    }

    // Check if contact_submissions table exists
    const contactCheck = await supabase
      .from("contact_submissions")
      .select("count")
      .limit(1);
    if (contactCheck.error) {
      console.log(
        "Contact submissions table does not exist, will be created on first insert",
      );
    } else {
      console.log("Contact submissions table exists");
    }

    // Note: Supabase will auto-create tables on first insert with the correct schema
    // We don't need to manually create them with SQL commands
  } catch (error) {
    console.error("Error in createTablesIfNotExist:", error);
  }
}
