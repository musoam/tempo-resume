import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import { supabase } from "@/lib/supabase";

interface Project {
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
  technicalDetails?: string;
  projectChallenges?: string;
  implementationDetails?: string;
}

interface PortfolioSectionProps {
  title?: string;
  subtitle?: string;
  projects?: Project[];
  categories?: string[];
}

const PortfolioSection = ({
  title = "My Portfolio",
  subtitle = "Check out some of my recent projects and creative work",
  categories = [
    "All",
    "Business-to-Business (B2B)",
    "Direct-to-Consumer (DTC)",
    "E-Commerce & Retail Marketing",
  ],
  projects: initialProjects,
}: PortfolioSectionProps) => {
  const [localProjects, setLocalProjects] = React.useState<Project[]>([]);

  React.useEffect(() => {
    const loadProjects = async () => {
      if (initialProjects) {
        setLocalProjects(initialProjects);
      } else {
        try {
          // Fetch projects directly from Supabase
          const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("year", { ascending: false });

          if (error) throw error;

          if (data) {
            // Transform data to match the Project type
            const formattedProjects = data.map((project) => ({
              id: project.id,
              title: project.title,
              description: project.description,
              imageUrl: project.imageUrl,
              tags: project.tags || [],
              demoUrl: project.demoUrl,
              videoUrl: project.videoUrl,
              projectRole: project.projectRole,
              year: project.year,
              category: project.category,
              images: project.images || [],
              technologies: project.technologies || [],
              displayType: project.displayType || "popup",
              slug: project.slug,
              technicalDetails: project.technicalDetails,
              projectChallenges: project.projectChallenges,
              implementationDetails: project.implementationDetails,
              createdAt: project.createdAt,
              updatedAt: project.updatedAt,
            }));

            setLocalProjects(formattedProjects);
          }
        } catch (error) {
          console.error("Error loading projects:", error);
        }
      }
    };

    loadProjects();
  }, [initialProjects]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sort projects by year (newest first)
  const sortedProjects = [...localProjects].sort((a, b) => {
    return parseInt(b.year) - parseInt(a.year);
  });

  const filteredProjects =
    selectedCategory === "All"
      ? sortedProjects
      : sortedProjects.filter(
          (project) => project.category === selectedCategory,
        );

  const handleViewDetails = (id: string) => {
    const project = localProjects.find((p) => p.id === id);
    if (project) {
      setSelectedProject(project);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section id="portfolio" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <Tabs
          defaultValue="All"
          className="mb-12"
          onValueChange={setSelectedCategory}
        >
          <div className="flex justify-center">
            <TabsList className="flex-wrap h-auto">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={selectedCategory} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    description={project.description}
                    imageUrl={project.imageUrl}
                    tags={project.tags}
                    demoUrl={project.demoUrl}
                    onViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">
                    No projects found in this category.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <Button variant="outline" className="group">
            View All Projects
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {selectedProject && (
          <ProjectModal
            isOpen={isModalOpen}
            onClose={closeModal}
            title={selectedProject.title}
            description={selectedProject.description}
            images={selectedProject.images}
            technologies={selectedProject.technologies}
            liveUrl={selectedProject.demoUrl}
            videoUrl={selectedProject.videoUrl}
            year={selectedProject.year}
            projectRole={selectedProject.projectRole}
            technicalDetails={selectedProject.technicalDetails}
            projectChallenges={selectedProject.projectChallenges}
            implementationDetails={selectedProject.implementationDetails}
          />
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;
