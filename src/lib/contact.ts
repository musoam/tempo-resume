import { supabase } from "./supabase";

export interface ContactFormData {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
  status?: "new" | "read" | "replied" | "archived";
}

/**
 * Saves a contact form submission to Supabase
 * @param formData The contact form data
 * @returns The saved contact form data or null if save failed
 */
export async function saveContactForm(
  formData: ContactFormData,
): Promise<ContactFormData | null> {
  try {
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          status: "new",
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Error saving contact form:", error.message);
      return null;
    }

    return (data?.[0] as ContactFormData) || null;
  } catch (error) {
    console.error("Error in saveContactForm:", error);
    return null;
  }
}

/**
 * Gets all contact form submissions
 * @param status Optional status filter
 * @returns Array of contact form submissions or null if fetch failed
 */
export async function getContactSubmissions(
  status?: string,
): Promise<ContactFormData[] | null> {
  try {
    let query = supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching contact submissions:", error.message);
      return null;
    }

    return data as ContactFormData[];
  } catch (error) {
    console.error("Error in getContactSubmissions:", error);
    return null;
  }
}

/**
 * Updates the status of a contact form submission
 * @param id The ID of the submission to update
 * @param status The new status
 * @returns Success status
 */
export async function updateContactStatus(
  id: string,
  status: string,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating contact status:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateContactStatus:", error);
    return false;
  }
}

/**
 * Deletes a contact form submission
 * @param id The ID of the submission to delete
 * @returns Success status
 */
export async function deleteContactSubmission(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting contact submission:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteContactSubmission:", error);
    return false;
  }
}
