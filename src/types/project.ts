export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  demoUrl?: string;
  videoUrl?: string;
  projectRole?: string;
  year: string;
  category: string;
  images: Array<{ src: string; alt: string }>;
  technologies: Array<{ name: string; color?: string }>;
  displayType: "popup" | "page";
  slug?: string;
  technicalDetails?: string;
  projectChallenges?: string;
  implementationDetails?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  tags: string;
  demoUrl?: string;
  videoUrl?: string;
  projectRole?: string;
  year: string;
  category: string;
  imageUrl: string;
  images: string[];
  displayType: "popup" | "page";
  slug?: string;
  technicalDetails?: string;
  projectChallenges?: string;
  implementationDetails?: string;
}
