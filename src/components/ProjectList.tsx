import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Plus, RefreshCw, ExternalLink, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { getProjects, deleteProject } from "@/lib/projects";
import { Project } from "@/types/project";
import { useNavigate } from "react-router-dom";
import { useMockData } from "./MockDataProvider";

interface ProjectListProps {
  onEditProject: (project: Project) => void;
}

const ProjectList = ({ onEditProject }: ProjectListProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      // Import the getProjects function from Supabase
      const { getProjects } = await import("@/lib/projects-supabase");
      const projectsData = await getProjects();

      if (projectsData) {
        setProjects(projectsData);
      } else {
        throw new Error("Failed to fetch projects");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      // Import the deleteProject function from Supabase
      const { deleteProject } = await import("@/lib/projects-supabase");
      const success = await deleteProject(id);
      if (success) {
        setProjects(projects.filter((project) => project.id !== id));
      } else {
        throw new Error("Failed to delete project");
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("Failed to delete project. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Projects</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProjects}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/admin/projects/new")}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-6 w-6 text-primary animate-spin" />
          <span className="ml-2">Loading projects...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No projects found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/admin/projects/new")}
          >
            Create your first project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/4 lg:w-1/5">
                      <div className="aspect-video rounded-md overflow-hidden bg-gray-100">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{project.category}</Badge>
                            <Badge variant="outline">{project.year}</Badge>
                            <Badge
                              className={
                                project.displayType === "popup"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }
                            >
                              {project.displayType === "popup"
                                ? "Popup"
                                : "Page"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditProject(project)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {project.tags.slice(0, 5).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.tags.length - 5} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-gray-400">
                          Updated {formatDate(project.updatedAt)}
                        </span>
                        <div className="flex gap-2">
                          {project.demoUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() =>
                                window.open(project.demoUrl, "_blank")
                              }
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Demo
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() =>
                              window.open(
                                `/project/${project.slug || project.id}`,
                                "_blank",
                              )
                            }
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
