import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  demoUrl?: string;
  onViewDetails: (id: string) => void;
}

const ProjectCard = ({
  id = "project-1",
  title = "Project Title",
  description = "A brief description of the project showcasing the key features and technologies used.",
  imageUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070",
  tags = ["React", "TypeScript", "Tailwind"],
  demoUrl = "#",
  onViewDetails = () => {},
}: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col bg-white dark:bg-gray-800 border-0 shadow-md">
        <div className="relative overflow-hidden aspect-video">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onViewDetails(id)}
                className="gap-1"
              >
                <Eye size={16} />
                Details
              </Button>
              {demoUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white text-black hover:bg-gray-100 gap-1"
                  onClick={() => window.open(demoUrl, "_blank")}
                >
                  <ExternalLink size={16} />
                  Demo
                </Button>
              )}
            </div>
          </div>
        </div>

        <CardContent className="flex-grow p-4">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
            {description}
          </p>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
