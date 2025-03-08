import { supabase } from "./supabase";

/**
 * Migrates local data from MockDataProvider to Supabase
 */
export async function migrateLocalDataToSupabase() {
  try {
    console.log("Starting data migration to Supabase...");

    // Get data from localStorage
    const siteSettings = JSON.parse(
      localStorage.getItem("siteSettings") || "{}",
    );
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const contactSubmissions = JSON.parse(
      localStorage.getItem("contactSubmissions") || "[]",
    );

    // Migrate site settings
    if (siteSettings && Object.keys(siteSettings).length > 0) {
      console.log("Migrating site settings...");

      // Format site settings for Supabase
      const formattedSettings = {
        title: siteSettings.title,
        owner_name: siteSettings.ownerName,
        email: siteSettings.email,
        phone: siteSettings.phone || null,
        location: siteSettings.location || null,
        about: siteSettings.about,
        hero_title: siteSettings.heroTitle,
        hero_description: siteSettings.heroDescription,
        hero_image_url: siteSettings.heroImageUrl,
        social_links: siteSettings.socialLinks || [],
        updated_at: new Date().toISOString(),
      };

      // Check if settings already exist
      const { data: existingSettings } = await supabase
        .from("site_settings")
        .select("id")
        .limit(1);

      if (existingSettings && existingSettings.length > 0) {
        // Update existing settings
        const { data, error } = await supabase
          .from("site_settings")
          .update(formattedSettings)
          .eq("id", existingSettings[0].id)
          .select();

        if (error) throw error;
        console.log("Site settings updated:", data);
      } else {
        // Insert new settings
        const { data, error } = await supabase
          .from("site_settings")
          .insert([formattedSettings])
          .select();

        if (error) throw error;
        console.log("Site settings created:", data);
      }
    }

    // Migrate projects
    if (projects && projects.length > 0) {
      console.log(`Migrating ${projects.length} projects...`);

      for (const project of projects) {
        // Format project for Supabase
        const formattedProject = {
          title: project.title,
          description: project.description,
          imageUrl: project.imageUrl,
          tags: project.tags || [],
          demoUrl: project.demoUrl || null,
          videoUrl: project.videoUrl || null,
          projectRole: project.projectRole || null,
          year: project.year,
          category: project.category,
          images: project.images || [],
          technologies: project.technologies || [],
          displayType: project.displayType || "popup",
          slug:
            project.slug || project.title.toLowerCase().replace(/\s+/g, "-"),
          technicalDetails: project.technicalDetails || null,
          projectChallenges: project.projectChallenges || null,
          implementationDetails: project.implementationDetails || null,
          createdAt: project.createdAt || new Date().toISOString(),
          updatedAt: project.updatedAt || new Date().toISOString(),
        };

        // Check if project already exists
        const { data: existingProject } = await supabase
          .from("projects")
          .select("id")
          .eq("title", project.title)
          .limit(1);

        if (existingProject && existingProject.length > 0) {
          // Update existing project
          const { data, error } = await supabase
            .from("projects")
            .update(formattedProject)
            .eq("id", existingProject[0].id)
            .select();

          if (error) throw error;
          console.log(`Project "${project.title}" updated`);
        } else {
          // Insert new project
          const { data, error } = await supabase
            .from("projects")
            .insert([formattedProject])
            .select();

          if (error) throw error;
          console.log(`Project "${project.title}" created`);
        }
      }
    }

    // Migrate contact submissions
    if (contactSubmissions && contactSubmissions.length > 0) {
      console.log(
        `Migrating ${contactSubmissions.length} contact submissions...`,
      );

      for (const submission of contactSubmissions) {
        // Format submission for Supabase
        const formattedSubmission = {
          name: submission.name,
          email: submission.email,
          message: submission.message,
          status: submission.status || "new",
          created_at: submission.createdAt || new Date().toISOString(),
        };

        // Insert new submission (we don't update existing ones to avoid duplicates)
        const { data, error } = await supabase
          .from("contact_submissions")
          .insert([formattedSubmission])
          .select();

        if (error) {
          console.error(
            `Error migrating submission from ${submission.email}:`,
            error,
          );
          continue; // Continue with next submission
        }

        console.log(`Contact submission from ${submission.email} migrated`);
      }
    }

    console.log("Data migration completed successfully!");
    return true;
  } catch (error) {
    console.error("Error during data migration:", error);
    return false;
  }
}
