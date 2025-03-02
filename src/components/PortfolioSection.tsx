import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  year: string;
  category: string;
  images: Array<{ src: string; alt: string }>;
  technologies: Array<{ name: string; color?: string }>;
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
  categories = ["All", "Web Development", "UI/UX Design", "Mobile Apps"],
  projects = [
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
        {
          src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015",
          alt: "Shopping cart",
        },
      ],
      technologies: [
        { name: "React", color: "bg-blue-100 text-blue-800" },
        { name: "Node.js", color: "bg-green-100 text-green-800" },
        { name: "MongoDB", color: "bg-green-100 text-green-800" },
        { name: "Stripe", color: "bg-purple-100 text-purple-800" },
        { name: "Tailwind CSS", color: "bg-cyan-100 text-cyan-800" },
      ],
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
        {
          src: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2070",
          alt: "Contact section",
        },
      ],
      technologies: [
        { name: "React", color: "bg-blue-100 text-blue-800" },
        { name: "TypeScript", color: "bg-blue-100 text-blue-800" },
        { name: "Tailwind CSS", color: "bg-cyan-100 text-cyan-800" },
        { name: "Framer Motion", color: "bg-purple-100 text-purple-800" },
        { name: "Vite", color: "bg-yellow-100 text-yellow-800" },
      ],
    },
    {
      id: "project-3",
      title: "Mobile Banking App",
      description:
        "A secure and user-friendly mobile banking application with transaction history, bill payments, and account management.",
      imageUrl:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070",
      tags: ["React Native", "Firebase", "Redux"],
      demoUrl: "https://example.com/banking-app",
      githubUrl: "https://github.com/example/banking-app",
      year: "2022",
      category: "Mobile Apps",
      images: [
        {
          src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070",
          alt: "Banking app dashboard",
        },
        {
          src: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=2070",
          alt: "Transaction history",
        },
        {
          src: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?q=80&w=2070",
          alt: "Payment screen",
        },
      ],
      technologies: [
        { name: "React Native", color: "bg-blue-100 text-blue-800" },
        { name: "Firebase", color: "bg-yellow-100 text-yellow-800" },
        { name: "Redux", color: "bg-purple-100 text-purple-800" },
        { name: "TypeScript", color: "bg-blue-100 text-blue-800" },
        { name: "Jest", color: "bg-red-100 text-red-800" },
      ],
    },
    {
      id: "project-4",
      title: "UI/UX Design System",
      description:
        "A comprehensive design system with reusable components, style guides, and documentation for consistent product design.",
      imageUrl:
        "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070",
      tags: ["Figma", "Design System", "UI/UX"],
      demoUrl: "https://example.com/design-system",
      year: "2023",
      category: "UI/UX Design",
      images: [
        {
          src: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070",
          alt: "Design system overview",
        },
        {
          src: "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=2072",
          alt: "Component library",
        },
        {
          src: "https://images.unsplash.com/photo-1618788372246-79faff0c3742?q=80&w=2027",
          alt: "Style guide",
        },
      ],
      technologies: [
        { name: "Figma", color: "bg-purple-100 text-purple-800" },
        { name: "Storybook", color: "bg-pink-100 text-pink-800" },
        { name: "Sketch", color: "bg-yellow-100 text-yellow-800" },
        { name: "Adobe XD", color: "bg-pink-100 text-pink-800" },
        { name: "Zeplin", color: "bg-orange-100 text-orange-800" },
      ],
    },
    {
      id: "project-5",
      title: "Task Management App",
      description:
        "A productivity app for managing tasks, projects, and team collaboration with real-time updates and notifications.",
      imageUrl:
        "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2072",
      tags: ["Vue.js", "Firebase", "Vuex"],
      demoUrl: "https://example.com/task-app",
      githubUrl: "https://github.com/example/task-app",
      year: "2022",
      category: "Web Development",
      images: [
        {
          src: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2072",
          alt: "Task app dashboard",
        },
        {
          src: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=2076",
          alt: "Project management view",
        },
        {
          src: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=2070",
          alt: "Calendar integration",
        },
      ],
      technologies: [
        { name: "Vue.js", color: "bg-green-100 text-green-800" },
        { name: "Firebase", color: "bg-yellow-100 text-yellow-800" },
        { name: "Vuex", color: "bg-green-100 text-green-800" },
        { name: "SCSS", color: "bg-pink-100 text-pink-800" },
        { name: "Jest", color: "bg-red-100 text-red-800" },
      ],
    },
    {
      id: "project-6",
      title: "Fitness Tracking App",
      description:
        "A mobile application for tracking workouts, nutrition, and fitness goals with personalized recommendations.",
      imageUrl:
        "https://images.unsplash.com/photo-1461773518188-b3e86f98242f?q=80&w=2069",
      tags: ["Flutter", "Firebase", "Dart"],
      demoUrl: "https://example.com/fitness-app",
      githubUrl: "https://github.com/example/fitness-app",
      year: "2023",
      category: "Mobile Apps",
      images: [
        {
          src: "https://images.unsplash.com/photo-1461773518188-b3e86f98242f?q=80&w=2069",
          alt: "Fitness app home screen",
        },
        {
          src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070",
          alt: "Workout tracking",
        },
        {
          src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053",
          alt: "Nutrition tracking",
        },
      ],
      technologies: [
        { name: "Flutter", color: "bg-blue-100 text-blue-800" },
        { name: "Dart", color: "bg-blue-100 text-blue-800" },
        { name: "Firebase", color: "bg-yellow-100 text-yellow-800" },
        { name: "Provider", color: "bg-purple-100 text-purple-800" },
        { name: "SQLite", color: "bg-gray-100 text-gray-800" },
      ],
    },
  ],
}: PortfolioSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  const handleViewDetails = (id: string) => {
    const project = projects.find((p) => p.id === id);
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

        <Tabs defaultValue={categories[0]} className="mb-12">
          <div className="flex justify-center">
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
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
                ))}
              </div>
            </TabsContent>
          ))}
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
            githubUrl={selectedProject.githubUrl}
            year={selectedProject.year}
          />
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;
