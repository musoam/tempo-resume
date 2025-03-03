import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { SiteSettings } from "@/lib/settings";
import { Project } from "@/types/project";
import { ContactFormData } from "@/lib/contact";

interface MockDataContextType {
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: SiteSettings) => Promise<SiteSettings | null>;
  projects: Project[];
  addProject: (project: any) => Promise<Project | null>;
  updateProject: (id: string, project: any) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;
  contactSubmissions: ContactFormData[];
  addContactSubmission: (
    submission: ContactFormData,
  ) => Promise<ContactFormData | null>;
  updateContactStatus: (id: string, status: string) => Promise<boolean>;
  deleteContactSubmission: (id: string) => Promise<boolean>;
}

const defaultSettings: SiteSettings = {
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

const defaultProjects: Project[] = [
  {
    id: "project-1",
    title: "E-commerce Website",
    description:
      "A modern e-commerce platform with a sleek UI, shopping cart functionality, and secure payment processing.",
    imageUrl:
      "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=2070",
    tags: ["React", "Node.js", "Stripe"],
    demoUrl: "https://example.com/ecommerce",
    githubUrl: "https://github.com/example/ecommerce",
    year: "2023",
    category: "Web Development",
    images: [
      {
        src: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=2070",
        alt: "E-commerce homepage",
      },
      {
        src: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070",
        alt: "Product listing page",
      },
    ],
    technologies: [
      { name: "React", color: "bg-blue-100 text-blue-800" },
      { name: "Node.js", color: "bg-green-100 text-green-800" },
    ],
    displayType: "popup",
    slug: "ecommerce-website",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "project-2",
    title: "Portfolio Website",
    description:
      "A personal portfolio website with smooth animations and a responsive design to showcase creative work.",
    imageUrl:
      "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=2070",
    tags: ["React", "Framer Motion", "Tailwind CSS"],
    demoUrl: "https://example.com/portfolio",
    githubUrl: "https://github.com/example/portfolio",
    year: "2023",
    category: "Web Development",
    images: [
      {
        src: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=2070",
        alt: "Portfolio homepage",
      },
      {
        src: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=2070",
        alt: "Projects section",
      },
    ],
    technologies: [
      { name: "React", color: "bg-blue-100 text-blue-800" },
      { name: "Tailwind CSS", color: "bg-cyan-100 text-cyan-800" },
    ],
    displayType: "popup",
    slug: "portfolio-website",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultContactSubmissions: ContactFormData[] = [
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
];

const MockDataContext = createContext<MockDataContextType | undefined>(
  undefined,
);

export const MockDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Use localStorage to persist state across page refreshes
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const savedSettings = localStorage.getItem("siteSettings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem("projects");
    return savedProjects ? JSON.parse(savedProjects) : defaultProjects;
  });

  const [contactSubmissions, setContactSubmissions] = useState<
    ContactFormData[]
  >(() => {
    const savedSubmissions = localStorage.getItem("contactSubmissions");
    return savedSubmissions
      ? JSON.parse(savedSubmissions)
      : defaultContactSubmissions;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("siteSettings", JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(
      "contactSubmissions",
      JSON.stringify(contactSubmissions),
    );
  }, [contactSubmissions]);

  // Site settings functions
  const updateSiteSettings = async (
    settings: SiteSettings,
  ): Promise<SiteSettings | null> => {
    try {
      console.log("Mock updating site settings:", settings);
      const updatedSettings = {
        ...settings,
        updatedAt: new Date().toISOString(),
      };
      setSiteSettings(updatedSettings);
      return updatedSettings;
    } catch (error) {
      console.error("Error in mock updateSiteSettings:", error);
      return null;
    }
  };

  // Project functions
  const addProject = async (project: any): Promise<Project | null> => {
    try {
      const newProject: Project = {
        id: `project-${Date.now()}`,
        ...project,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProjects([...projects, newProject]);
      return newProject;
    } catch (error) {
      console.error("Error in mock addProject:", error);
      return null;
    }
  };

  const updateProject = async (
    id: string,
    project: any,
  ): Promise<Project | null> => {
    try {
      const updatedProjects = projects.map((p) =>
        p.id === id
          ? { ...p, ...project, updatedAt: new Date().toISOString() }
          : p,
      );
      setProjects(updatedProjects);
      return updatedProjects.find((p) => p.id === id) || null;
    } catch (error) {
      console.error("Error in mock updateProject:", error);
      return null;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      setProjects(projects.filter((p) => p.id !== id));
      return true;
    } catch (error) {
      console.error("Error in mock deleteProject:", error);
      return false;
    }
  };

  // Contact submission functions
  const addContactSubmission = async (
    submission: ContactFormData,
  ): Promise<ContactFormData | null> => {
    try {
      const newSubmission: ContactFormData = {
        id: `submission-${Date.now()}`,
        ...submission,
        createdAt: new Date().toISOString(),
        status: "new",
      };
      setContactSubmissions([newSubmission, ...contactSubmissions]);
      return newSubmission;
    } catch (error) {
      console.error("Error in mock addContactSubmission:", error);
      return null;
    }
  };

  const updateContactStatus = async (
    id: string,
    status: string,
  ): Promise<boolean> => {
    try {
      setContactSubmissions(
        contactSubmissions.map((s) =>
          s.id === id
            ? {
                ...s,
                status: status as "new" | "read" | "replied" | "archived",
              }
            : s,
        ),
      );
      return true;
    } catch (error) {
      console.error("Error in mock updateContactStatus:", error);
      return false;
    }
  };

  const deleteContactSubmission = async (id: string): Promise<boolean> => {
    try {
      setContactSubmissions(contactSubmissions.filter((s) => s.id !== id));
      return true;
    } catch (error) {
      console.error("Error in mock deleteContactSubmission:", error);
      return false;
    }
  };

  return (
    <MockDataContext.Provider
      value={{
        siteSettings,
        updateSiteSettings,
        projects,
        addProject,
        updateProject,
        deleteProject,
        contactSubmissions,
        addContactSubmission,
        updateContactStatus,
        deleteContactSubmission,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
};

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error("useMockData must be used within a MockDataProvider");
  }
  return context;
};
