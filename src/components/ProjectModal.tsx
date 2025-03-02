import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectImage {
  src: string;
  alt: string;
}

interface Technology {
  name: string;
  color?: string;
}

interface ProjectModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  images?: ProjectImage[];
  technologies?: Technology[];
  liveUrl?: string;
  githubUrl?: string;
  year?: string;
}

const ProjectModal = ({
  isOpen = true,
  onClose = () => {},
  title = "Portfolio Website Redesign",
  description = "A complete redesign of a personal portfolio website with a focus on modern design principles, responsive layouts, and smooth animations. The project showcases creative work through an interactive gallery and provides an intuitive user experience.",
  images = [
    {
      src: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f",
      alt: "Portfolio website homepage",
    },
    {
      src: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d",
      alt: "Portfolio projects grid",
    },
    {
      src: "https://images.unsplash.com/photo-1558655146-d09347e92766",
      alt: "Portfolio contact section",
    },
  ],
  technologies = [
    { name: "React", color: "bg-blue-100 text-blue-800" },
    { name: "TypeScript", color: "bg-blue-100 text-blue-800" },
    { name: "Tailwind CSS", color: "bg-cyan-100 text-cyan-800" },
    { name: "Framer Motion", color: "bg-purple-100 text-purple-800" },
    { name: "Vite", color: "bg-yellow-100 text-yellow-800" },
  ],
  liveUrl = "https://example.com",
  githubUrl = "https://github.com/example/portfolio",
  year = "2023",
}: ProjectModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-white p-6 pb-2 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-500">{year}</span>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="technical">Technical Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={images[0].src}
                  alt={images[0].alt}
                  className="w-full h-full object-cover"
                />
              </div>

              <DialogDescription className="text-base leading-relaxed mt-4">
                {description}
              </DialogDescription>

              <div className="flex flex-wrap gap-2 mt-4">
                {technologies.map((tech, index) => (
                  <Badge
                    key={index}
                    className={tech.color || "bg-gray-100 text-gray-800"}
                  >
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex].src}
                    alt={images[currentImageIndex].alt}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={prevImage}
                    className="rounded-full bg-white/80 hover:bg-white/90"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={nextImage}
                    className="rounded-full bg-white/80 hover:bg-white/90"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-video rounded-md overflow-hidden ${index === currentImageIndex ? "ring-2 ring-primary" : ""}`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Technologies Used</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {technologies.map((tech, index) => (
                    <li key={index}>{tech.name}</li>
                  ))}
                </ul>

                <h3 className="text-lg font-medium mt-6">Project Challenges</h3>
                <p className="text-gray-700">
                  The main challenges in this project included implementing
                  smooth animations that work across different devices, creating
                  a responsive layout that maintains visual appeal on all screen
                  sizes, and optimizing image loading for performance.
                </p>

                <h3 className="text-lg font-medium mt-6">
                  Implementation Details
                </h3>
                <p className="text-gray-700">
                  The portfolio was built using React with TypeScript for type
                  safety. Tailwind CSS was used for styling, with custom
                  animations implemented through Framer Motion. The site is
                  fully responsive and features optimized image loading with
                  lazy loading techniques.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="p-6 pt-2 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {liveUrl && (
              <Button asChild className="flex-1">
                <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Live Site
                </a>
              </Button>
            )}
            {githubUrl && (
              <Button variant="outline" asChild className="flex-1">
                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.84 21.49C9.34 21.581 9.52 21.272 9.52 21.007C9.52 20.719 9.514 20.061 9.51 19.191C6.73 19.792 6.14 17.81 6.14 17.81C5.68 16.636 5.03 16.327 5.03 16.327C4.12 15.693 5.1 15.707 5.1 15.707C6.1 15.777 6.63 16.754 6.63 16.754C7.5 18.328 8.97 17.858 9.54 17.602C9.63 16.965 9.89 16.495 10.17 16.219C7.88 15.941 5.48 15.055 5.48 11.258C5.48 10.143 5.89 9.231 6.65 8.517C6.55 8.265 6.2 7.278 6.75 5.962C6.75 5.962 7.57 5.695 9.5 6.926C10.29 6.706 11.15 6.595 12 6.59C12.85 6.595 13.71 6.706 14.5 6.926C16.43 5.695 17.25 5.962 17.25 5.962C17.8 7.278 17.45 8.265 17.35 8.517C18.11 9.231 18.52 10.143 18.52 11.258C18.52 15.065 16.12 15.939 13.82 16.211C14.17 16.551 14.5 17.227 14.5 18.252C14.5 19.703 14.49 20.626 14.49 21.007C14.49 21.275 14.67 21.587 15.18 21.487C19.158 20.161 22 16.416 22 12C22 6.477 17.523 2 12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                  View Source Code
                </a>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
