// Mock implementation without Supabase
import { useMockData } from "@/components/MockDataProvider";

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
    console.log("Saving contact form data:", formData);

    // Create a mock submission
    const newSubmission: ContactFormData = {
      id: `submission-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      message: formData.message,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    // In a real app, we would use the MockDataProvider context
    // But for simplicity in this function, we'll just return the mock data
    console.log("Created mock submission:", newSubmission);

    return newSubmission;
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
    // Mock data for contact submissions
    const mockSubmissions: ContactFormData[] = [
      {
        id: "submission-1",
        name: "Jane Smith",
        email: "jane@example.com",
        message:
          "I'm interested in hiring you for a web development project. Please contact me to discuss details.",
        createdAt: new Date().toISOString(),
        status: "new",
      },
      {
        id: "submission-2",
        name: "John Brown",
        email: "john@example.com",
        message:
          "Your portfolio is impressive! I'd like to discuss a potential collaboration on an upcoming project.",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        status: "read",
      },
      {
        id: "submission-3",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        message:
          "Hello! I saw your portfolio and I'm impressed with your work. Would you be available for a freelance project next month?",
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        status: "replied",
      },
      {
        id: "submission-4",
        name: "Michael Davis",
        email: "michael@example.com",
        message:
          "I need a website for my new business. Can you help me with that? Please let me know your availability and rates.",
        createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        status: "archived",
      },
    ];

    // Filter by status if provided
    const filteredSubmissions = status
      ? mockSubmissions.filter((sub) => sub.status === status)
      : mockSubmissions;

    console.log(
      `Returning ${filteredSubmissions.length} mock contact submissions${status ? ` with status: ${status}` : ""}`,
    );

    return filteredSubmissions;
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
    console.log(`Mock updating contact submission ${id} status to ${status}`);
    // In a real implementation, this would update the database
    // For now, we'll just return success
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
    console.log(`Mock deleting contact submission ${id}`);
    // In a real implementation, this would delete from the database
    // For now, we'll just return success
    return true;
  } catch (error) {
    console.error("Error in deleteContactSubmission:", error);
    return false;
  }
}
