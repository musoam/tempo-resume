import { supabase } from "./supabase";

export interface SiteSettings {
  id?: string;
  title: string;
  ownerName: string;
  email: string;
  phone?: string;
  location?: string;
  about: string;
  heroTitle: string;
  heroDescription: string;
  heroImageUrl: string;
  socialLinks: SocialLink[];
  updatedAt?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

/**
 * Gets the site settings
 * @returns The site settings or default values if not found
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching site settings:", error.message);
      return getDefaultSettings();
    }

    // Convert from database format to SiteSettings format
    return {
      id: data.id,
      title: data.title,
      ownerName: data.owner_name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      about: data.about,
      heroTitle: data.hero_title,
      heroDescription: data.hero_description,
      heroImageUrl: data.hero_image_url,
      socialLinks: data.social_links,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error("Error in getSiteSettings:", error);
    return getDefaultSettings();
  }
}

/**
 * Updates the site settings
 * @param settings The updated settings
 * @returns The updated settings or null if update failed
 */
export async function updateSiteSettings(
  settings: SiteSettings,
): Promise<SiteSettings | null> {
  try {
    console.log("Updating site settings:", settings);

    // Check if settings exist
    const { data: existingData, error: checkError } = await supabase
      .from("site_settings")
      .select("id")
      .limit(1);

    if (checkError) {
      console.log(
        "Error checking existing settings, will try insert:",
        checkError,
      );
    }

    // Convert socialLinks to a format Supabase can store (JSON string)
    const formattedSettings = {
      title: settings.title,
      owner_name: settings.ownerName,
      email: settings.email,
      phone: settings.phone,
      location: settings.location,
      about: settings.about,
      hero_title: settings.heroTitle,
      hero_description: settings.heroDescription,
      hero_image_url: settings.heroImageUrl,
      social_links: settings.socialLinks,
      updated_at: new Date().toISOString(),
    };

    console.log("Formatted settings for Supabase:", formattedSettings);
    let result;

    if (existingData && existingData.length > 0) {
      console.log("Updating existing settings with ID:", existingData[0].id);
      // Update existing settings
      result = await supabase
        .from("site_settings")
        .update(formattedSettings)
        .eq("id", existingData[0].id)
        .select();
    } else {
      console.log("Inserting new settings");
      // Insert new settings
      result = await supabase
        .from("site_settings")
        .insert([formattedSettings])
        .select();
    }

    if (result.error) {
      console.error("Error updating site settings:", result.error.message);
      return null;
    }

    console.log("Settings updated successfully:", result.data);

    // Convert the returned data back to our SiteSettings format
    if (result.data && result.data[0]) {
      const data = result.data[0];
      return {
        id: data.id,
        title: data.title,
        ownerName: data.owner_name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        about: data.about,
        heroTitle: data.hero_title,
        heroDescription: data.hero_description,
        heroImageUrl: data.hero_image_url,
        socialLinks: data.social_links,
        updatedAt: data.updated_at,
      };
    }

    return null;
  } catch (error) {
    console.error("Error in updateSiteSettings:", error);
    return null;
  }
}

/**
 * Returns default settings
 */
function getDefaultSettings(): SiteSettings {
  return {
    title: "My Creative Portfolio",
    ownerName: "John Doe",
    email: "contact@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    about:
      "I'm a creative professional with expertise in web development and design.",
    heroTitle: "Product Designer & Developer",
    heroDescription:
      "Creating beautiful digital experiences with a focus on usability and performance.",
    heroImageUrl:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070",
    socialLinks: [
      { name: "GitHub", url: "https://github.com", icon: "Github" },
      { name: "Twitter", url: "https://twitter.com", icon: "Twitter" },
      { name: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin" },
      { name: "Instagram", url: "https://instagram.com", icon: "Instagram" },
    ],
  };
}
