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
  videoUrl?: string;
  year?: string;
  technicalDetails?: string;
  projectChallenges?: string;
  implementationDetails?: string;
  projectRole?: string;
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
  videoUrl,
  year = "2023",
  projectRole,
  technicalDetails,
  projectChallenges,
  implementationDetails,
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
            {projectRole && (
              <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {projectRole}
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="technical">Marketing Tech Stack</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
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
                <h3 className="text-lg font-medium">Industry segments</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {technologies.map((tech, index) => (
                    <li key={index}>{tech.name}</li>
                  ))}
                </ul>

                {/* Marketing Tech Stack */}
                {technicalDetails ? (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium">
                      Marketing Tech Stack
                    </h3>
                    <div
                      className="text-gray-700 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: technicalDetails
                          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\*(.+?)\*/g, "<em>$1</em>")
                          .replace(/^- (.+)$/gm, "<li>$1</li>")
                          .replace(/(<li>.+<\/li>)/g, "<ul>$1</ul>")
                          .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
                          .replace(/(<li>.+<\/li>)/g, "<ol>$1</ol>")
                          .replace(/\n/g, "<br/>"),
                      }}
                    />
                  </div>
                ) : null}

                {/* Market & Execution Challenges */}
                {projectChallenges ? (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium">
                      Market & Execution Challenges
                    </h3>
                    <div
                      className="text-gray-700 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: projectChallenges
                          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\*(.+?)\*/g, "<em>$1</em>")
                          .replace(/^- (.+)$/gm, "<li>$1</li>")
                          .replace(/(<li>.+<\/li>)/g, "<ul>$1</ul>")
                          .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
                          .replace(/(<li>.+<\/li>)/g, "<ol>$1</ol>")
                          .replace(/\n/g, "<br/>"),
                      }}
                    />
                  </div>
                ) : null}

                {/* Go-to-Market Strategy & Execution */}
                {implementationDetails ? (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium">
                      Go-to-Market Strategy & Execution
                    </h3>
                    <div
                      className="text-gray-700 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: implementationDetails
                          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\*(.+?)\*/g, "<em>$1</em>")
                          .replace(/^- (.+)$/gm, "<li>$1</li>")
                          .replace(/(<li>.+<\/li>)/g, "<ul>$1</ul>")
                          .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
                          .replace(/(<li>.+<\/li>)/g, "<ol>$1</ol>")
                          .replace(/\n/g, "<br/>"),
                      }}
                    />
                  </div>
                ) : null}

                {/* Video Section */}
                {videoUrl && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium">Project Video</h3>
                    <div className="aspect-video mt-2 rounded-md overflow-hidden">
                      <iframe
                        src={
                          videoUrl.includes("youtube.com")
                            ? videoUrl.replace("watch?v=", "embed/")
                            : videoUrl.includes("vimeo.com")
                              ? videoUrl.replace(
                                  "vimeo.com",
                                  "player.vimeo.com/video",
                                )
                              : videoUrl
                        }
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
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
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
