import { supabase } from "./supabase";
import { Project, ProjectFormData } from "@/types/project";

/**
 * Fetches all projects from Supabase
 * @returns Array of projects or null if fetch failed
 */
export async function getProjects(): Promise<Project[] | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("year", { ascending: false });

    if (error) throw error;
    return data as Project[];
  } catch (error) {
    console.error("Error in getProjects:", error);
    return null;
  }
}

/**
 * Fetches a single project by ID
 * @param id The project ID
 * @returns The project or null if not found
 */
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Project;
  } catch (error) {
    console.error("Error in getProjectById:", error);
    return null;
  }
}

/**
 * Fetches a single project by slug
 * @param slug The project slug
 * @returns The project or null if not found
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data as Project;
  } catch (error) {
    console.error("Error in getProjectBySlug:", error);
    return null;
  }
}

/**
 * Creates a new project
 * @param projectData The project data
 * @returns The created project or null if creation failed
 */
export async function createProject(
  projectData: ProjectFormData,
): Promise<Project | null> {
  try {
    // Generate a slug from the title if not provided
    const slug =
      projectData.slug || projectData.title.toLowerCase().replace(/\s+/g, "-");

    // Format the images array for storage
    const images = Array.isArray(projectData.images)
      ? projectData.images.map((img, index) => ({
          src: img,
          alt: `${projectData.title} image ${index + 1}`,
        }))
      : [];

    // Format tags into an array
    const tags =
      typeof projectData.tags === "string" && projectData.tags
        ? projectData.tags.split(",")
        : [];

    // Create technologies array from tags
    const technologies = tags.map((tag) => ({
      name: tag,
      color: getColorForTag(tag),
    }));

    // Create a new project with all fields
    const newProject = {
      title: projectData.title,
      description: projectData.description,
      imageUrl: projectData.imageUrl,
      year: projectData.year,
      category: projectData.category,
      slug,
      tags,
      demoUrl: projectData.demoUrl || null,
      videoUrl: projectData.videoUrl || null,
      projectRole: projectData.projectRole || null,
      images,
      technologies,
      displayType: projectData.displayType || "popup",
      technicalDetails: projectData.technicalDetails || null,
      projectChallenges: projectData.projectChallenges || null,
      implementationDetails: projectData.implementationDetails || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Creating new project with data:", JSON.stringify(newProject));

    // Insert the new project
    const { data, error } = await supabase
      .from("projects")
      .insert([newProject])
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      throw error;
    }

    console.log("Project created successfully:", data);
    return data as Project;
  } catch (error) {
    console.error("Error in createProject:", error);
    return null; // Return null instead of re-throwing to prevent unhandled errors
  }
}

/**
 * Updates an existing project
 * @param id The project ID
 * @param projectData The updated project data
 * @returns The updated project or null if update failed
 */
export async function updateProject(
  id: string,
  projectData: ProjectFormData,
): Promise<Project | null> {
  try {
    console.log(`Starting update for project ${id}`);

    // Generate a slug from the title if not provided
    const slug =
      projectData.slug || projectData.title.toLowerCase().replace(/\s+/g, "-");

    // Format the images array for storage
    const images = Array.isArray(projectData.images)
      ? projectData.images.map((img, index) => ({
          src: img,
          alt: `${projectData.title} image ${index + 1}`,
        }))
      : [];

    // Format tags into an array
    const tags =
      typeof projectData.tags === "string" && projectData.tags
        ? projectData.tags.split(",")
        : [];

    // Create technologies array from tags
    const technologies = tags.map((tag) => ({
      name: tag,
      color: getColorForTag(tag),
    }));

    // Create a simple update object with only the fields we want to update
    const updatedProject = {
      title: projectData.title,
      description: projectData.description,
      imageUrl: projectData.imageUrl,
      tags,
      demoUrl: projectData.demoUrl || null,
      videoUrl: projectData.videoUrl || null,
      projectRole: projectData.projectRole || null,
      year: projectData.year,
      category: projectData.category,
      images,
      technologies,
      displayType: projectData.displayType || "popup",
      slug,
      technicalDetails: projectData.technicalDetails || null,
      projectChallenges: projectData.projectChallenges || null,
      implementationDetails: projectData.implementationDetails || null,
      updatedAt: new Date().toISOString(),
    };

    console.log("Updating project with data:", JSON.stringify(updatedProject));

    // Update in Supabase
    const { data, error } = await supabase
      .from("projects")
      .update(updatedProject)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Update error:", error);
      return null;
    }

    if (!data || data.length === 0) {
      console.error("No data returned from update");
      return null;
    }

    console.log("Updated project in Supabase:", data[0]);
    return data[0] as Project;
  } catch (error) {
    console.error("Error in updateProject:", error);
    return null;
  }
}

/**
 * Deletes a project
 * @param id The project ID
 * @returns Success status
 */
export async function deleteProject(id: string): Promise<boolean> {
  try {
    console.log(`Deleting project ${id} from Supabase`);
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteProject:", error);
    return false;
  }
}

/**
 * Helper function to get a color for a tag
 * @param tag The tag name
 * @returns A color class for the tag
 */
function getColorForTag(tag: string): string {
  // Map common technologies to colors
  const colorMap: Record<string, string> = {
    react: "bg-blue-100 text-blue-800",
    vue: "bg-green-100 text-green-800",
    angular: "bg-red-100 text-red-800",
    javascript: "bg-yellow-100 text-yellow-800",
    typescript: "bg-blue-100 text-blue-800",
    node: "bg-green-100 text-green-800",
    express: "bg-gray-100 text-gray-800",
    mongodb: "bg-green-100 text-green-800",
    postgresql: "bg-blue-100 text-blue-800",
    mysql: "bg-blue-100 text-blue-800",
    firebase: "bg-yellow-100 text-yellow-800",
    supabase: "bg-green-100 text-green-800",
    tailwind: "bg-cyan-100 text-cyan-800",
    css: "bg-blue-100 text-blue-800",
    html: "bg-orange-100 text-orange-800",
    figma: "bg-purple-100 text-purple-800",
    sketch: "bg-yellow-100 text-yellow-800",
    mobile: "bg-indigo-100 text-indigo-800",
    "react-native": "bg-blue-100 text-blue-800",
    flutter: "bg-blue-100 text-blue-800",
    swift: "bg-orange-100 text-orange-800",
    kotlin: "bg-purple-100 text-purple-800",
    aws: "bg-yellow-100 text-yellow-800",
    docker: "bg-blue-100 text-blue-800",
    kubernetes: "bg-blue-100 text-blue-800",
    graphql: "bg-pink-100 text-pink-800",
    rest: "bg-green-100 text-green-800",
    redux: "bg-purple-100 text-purple-800",
    nextjs: "bg-gray-100 text-gray-800",
    gatsby: "bg-purple-100 text-purple-800",
    svelte: "bg-red-100 text-red-800",
    python: "bg-blue-100 text-blue-800",
    django: "bg-green-100 text-green-800",
    flask: "bg-gray-100 text-gray-800",
    php: "bg-indigo-100 text-indigo-800",
    laravel: "bg-red-100 text-red-800",
    wordpress: "bg-blue-100 text-blue-800",
    shopify: "bg-green-100 text-green-800",
    woocommerce: "bg-purple-100 text-purple-800",
    ecommerce: "bg-green-100 text-green-800",
    ui: "bg-pink-100 text-pink-800",
    ux: "bg-indigo-100 text-indigo-800",
    design: "bg-purple-100 text-purple-800",
    responsive: "bg-blue-100 text-blue-800",
    pwa: "bg-purple-100 text-purple-800",
    spa: "bg-blue-100 text-blue-800",
    jamstack: "bg-pink-100 text-pink-800",
    headless: "bg-gray-100 text-gray-800",
    cms: "bg-green-100 text-green-800",
    strapi: "bg-blue-100 text-blue-800",
    contentful: "bg-blue-100 text-blue-800",
    sanity: "bg-red-100 text-red-800",
    animation: "bg-purple-100 text-purple-800",
    framer: "bg-purple-100 text-purple-800",
    gsap: "bg-green-100 text-green-800",
    threejs: "bg-black text-white",
    webgl: "bg-red-100 text-red-800",
    canvas: "bg-yellow-100 text-yellow-800",
    svg: "bg-orange-100 text-orange-800",
    game: "bg-red-100 text-red-800",
    unity: "bg-gray-100 text-gray-800",
    ar: "bg-purple-100 text-purple-800",
    vr: "bg-blue-100 text-blue-800",
    ai: "bg-green-100 text-green-800",
    ml: "bg-blue-100 text-blue-800",
    blockchain: "bg-blue-100 text-blue-800",
    web3: "bg-purple-100 text-purple-800",
    nft: "bg-pink-100 text-pink-800",
    crypto: "bg-yellow-100 text-yellow-800",
    solidity: "bg-gray-100 text-gray-800",
    rust: "bg-orange-100 text-orange-800",
    go: "bg-blue-100 text-blue-800",
    "c#": "bg-purple-100 text-purple-800",
    java: "bg-red-100 text-red-800",
    ruby: "bg-red-100 text-red-800",
    rails: "bg-red-100 text-red-800",
  };

  // Normalize tag for lookup (lowercase, remove spaces)
  const normalizedTag = tag.toLowerCase().trim();

  // Return the mapped color or a default
  return colorMap[normalizedTag] || "bg-gray-100 text-gray-800";
}
