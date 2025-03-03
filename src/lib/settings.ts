// Mock implementation without Supabase

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
    console.log("Getting mock site settings");
    // Just return default settings for mock implementation
    return getDefaultSettings();
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
    console.log("Mock updating site settings:", settings);

    // In a real implementation, this would update the database
    // For now, we'll just return the settings with an updated timestamp
    const updatedSettings = {
      ...settings,
      updatedAt: new Date().toISOString(),
      id: settings.id || "mock-settings-1",
    };

    console.log("Updated mock settings:", updatedSettings);
    return updatedSettings;
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
