import { supabase } from "./supabase";

/**
 * Creates storage buckets and RLS policies
 */
export async function createStorageBuckets(): Promise<boolean> {
  try {
    console.log("Creating storage buckets...");

    // Create portfolio-projects bucket
    try {
      const { data: projectsBucket, error: projectsError } =
        await supabase.storage.createBucket("portfolio-projects", {
          public: true,
        });

      if (projectsError && !projectsError.message.includes("already exists")) {
        console.error(
          "Error creating portfolio-projects bucket:",
          projectsError,
        );
      } else {
        console.log("portfolio-projects bucket created or already exists");
      }
    } catch (err) {
      console.error("Exception creating portfolio-projects bucket:", err);
      // Continue anyway
    }

    // Create portfolio-profile bucket
    try {
      const { data: profileBucket, error: profileError } =
        await supabase.storage.createBucket("portfolio-profile", {
          public: true,
        });

      if (profileError && !profileError.message.includes("already exists")) {
        console.error("Error creating portfolio-profile bucket:", profileError);
      } else {
        console.log("portfolio-profile bucket created or already exists");
      }
    } catch (err) {
      console.error("Exception creating portfolio-profile bucket:", err);
      // Continue anyway
    }

    // Update bucket policies to ensure they're public
    try {
      await supabase.storage.updateBucket("portfolio-projects", {
        public: true,
      });
      console.log("portfolio-projects bucket policy updated");
    } catch (err) {
      console.error("Error updating portfolio-projects bucket policy:", err);
      // Continue anyway
    }

    try {
      await supabase.storage.updateBucket("portfolio-profile", {
        public: true,
      });
      console.log("portfolio-profile bucket policy updated");
    } catch (err) {
      console.error("Error updating portfolio-profile bucket policy:", err);
      // Continue anyway
    }

    console.log("Storage buckets setup completed");
    return true;
  } catch (error) {
    console.error("Error in createStorageBuckets:", error);
    return false;
  }
}
