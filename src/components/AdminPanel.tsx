import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import StorageInitializer from "./StorageInitializer";
import ImageGallery from "./ImageGallery";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import ContactSubmissions from "./ContactSubmissions";
import SettingsForm from "./SettingsForm";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Project } from "@/types/project";

const AdminPanel = () => {
  const [storageInitialized, setStorageInitialized] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditingProject, setIsEditingProject] = useState(false);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Portfolio Admin</h1>

      {!storageInitialized && (
        <div className="mb-6">
          <StorageInitializer
            onInitialized={() => setStorageInitialized(true)}
          />
        </div>
      )}

      <Tabs defaultValue="media" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>
                Upload and manage images for your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Project Images</h3>
                  <ImageGallery bucket="portfolio-projects" path="" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Profile Images</h3>
                  <ImageGallery bucket="portfolio-profile" path="" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          {isEditingProject ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>
                      {selectedProject ? "Edit Project" : "Add New Project"}
                    </CardTitle>
                    <CardDescription>
                      {selectedProject
                        ? "Update project details"
                        : "Create a new portfolio project"}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingProject(false);
                      setSelectedProject(null);
                    }}
                  >
                    Back to List
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ProjectForm
                  initialValues={
                    selectedProject
                      ? {
                          title: selectedProject.title,
                          description: selectedProject.description,
                          tags: selectedProject.tags.join(","),
                          demoUrl: selectedProject.demoUrl || "",
                          videoUrl: selectedProject.videoUrl || "",
                          projectRole: selectedProject.projectRole || "",
                          year: selectedProject.year,
                          category: selectedProject.category,
                          imageUrl: selectedProject.imageUrl,
                          images: selectedProject.images.map((img) => img.src),
                          displayType: selectedProject.displayType,
                          slug: selectedProject.slug,
                          technicalDetails:
                            selectedProject.technicalDetails || "",
                          projectChallenges:
                            selectedProject.projectChallenges || "",
                          implementationDetails:
                            selectedProject.implementationDetails || "",
                        }
                      : {}
                  }
                  onSubmit={async (values) => {
                    try {
                      // Import the Supabase project functions
                      const { createProject, updateProject } = await import(
                        "@/lib/projects-supabase"
                      );

                      if (selectedProject) {
                        // Update existing project
                        const updated = await updateProject(
                          selectedProject.id,
                          values,
                        );
                        if (updated) {
                          alert("Project updated successfully!");
                          setIsEditingProject(false);
                          setSelectedProject(null);
                        } else {
                          throw new Error("Failed to update project");
                        }
                      } else {
                        // Create new project
                        console.log(
                          "Creating new project with values:",
                          values,
                        );
                        try {
                          // First make sure the storage buckets exist
                          const { createStorageBuckets } = await import(
                            "@/lib/create-storage-function"
                          );
                          const bucketsCreated = await createStorageBuckets();
                          console.log(
                            "Storage buckets created:",
                            bucketsCreated,
                          );

                          // Then create the project
                          console.log(
                            "Creating project with values:",
                            JSON.stringify(values),
                          );
                          const created = await createProject(values);
                          console.log("Project creation result:", created);

                          if (created) {
                            alert("Project created successfully!");
                            setIsEditingProject(false);
                          } else {
                            throw new Error(
                              "Failed to create project - null result returned",
                            );
                          }
                        } catch (createError) {
                          console.error("Error creating project:", createError);
                          alert(
                            `Error creating project: ${createError.message || "Unknown error"}`,
                          );
                        }
                      }
                    } catch (error) {
                      console.error("Error saving project:", error);
                      alert(
                        `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
                      );
                    }
                  }}
                />
              </CardContent>
            </Card>
          ) : (
            <ProjectList
              onEditProject={(project) => {
                setSelectedProject(project);
                setIsEditingProject(true);
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Form Submissions</CardTitle>
              <CardDescription>
                View and manage messages from your contact form
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactSubmissions />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Settings</CardTitle>
              <CardDescription>
                Configure your portfolio website settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
