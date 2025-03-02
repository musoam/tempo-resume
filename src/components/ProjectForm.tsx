import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Plus, Image } from "lucide-react";
import { motion } from "framer-motion";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import FileUploader from "./FileUploader";
import ImageGallery from "./ImageGallery";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const projectSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  tags: z.string().optional(),
  demoUrl: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  githubUrl: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  year: z
    .string()
    .regex(/^\d{4}$/, { message: "Year must be a 4-digit number" }),
  category: z.string().min(1, { message: "Please select a category" }),
  displayType: z.enum(["popup", "page"]),
  slug: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  onSubmit?: (
    values: ProjectFormValues & { imageUrl: string; images: string[] },
  ) => void;
  initialValues?: Partial<
    ProjectFormValues & { imageUrl: string; images: string[] }
  >;
  categories?: string[];
  className?: string;
}

const ProjectForm = ({
  onSubmit = () => {},
  initialValues = {},
  categories = ["Web Development", "UI/UX Design", "Mobile Apps"],
  className = "",
}: ProjectFormProps) => {
  const [tags, setTags] = useState<string[]>(
    initialValues.tags ? initialValues.tags.split(",") : [],
  );
  const [tagInput, setTagInput] = useState("");
  const [mainImage, setMainImage] = useState<string>(
    initialValues.imageUrl || "",
  );
  const [additionalImages, setAdditionalImages] = useState<string[]>(
    initialValues.images || [],
  );
  const [showGallery, setShowGallery] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialValues.title || "",
      description: initialValues.description || "",
      tags: initialValues.tags || "",
      demoUrl: initialValues.demoUrl || "",
      githubUrl: initialValues.githubUrl || "",
      year: initialValues.year || new Date().getFullYear().toString(),
      category: initialValues.category || categories[0],
      displayType: initialValues.displayType || "popup",
      slug: initialValues.slug || "",
    },
  });

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue("tags", newTags.join(","));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags.join(","));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const handleMainImageSelect = (url: string) => {
    setMainImage(url);
    setShowGallery(false);
  };

  const handleAdditionalImageSelect = (url: string) => {
    if (!additionalImages.includes(url)) {
      setAdditionalImages([...additionalImages, url]);
    }
  };

  const removeAdditionalImage = (url: string) => {
    setAdditionalImages(additionalImages.filter((img) => img !== url));
  };

  const handleSubmit = (values: ProjectFormValues) => {
    if (!mainImage) {
      form.setError("root", {
        type: "manual",
        message: "Please select a main image for the project",
      });
      return;
    }

    onSubmit({
      ...values,
      imageUrl: mainImage,
      images: [mainImage, ...additionalImages],
    });
  };

  return (
    <div
      className={`w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md ${className}`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Project Details</h3>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your project..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input placeholder="2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add tags (press Enter)"
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <input
                type="hidden"
                {...form.register("tags")}
                value={tags.join(",")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="demoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/username/repo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="displayType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Type</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="popup">Popup</option>
                        <option value="page">Page</option>
                      </select>
                    </FormControl>
                    <FormDescription>
                      Choose how this project will be displayed on your
                      portfolio
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="my-awesome-project" {...field} />
                    </FormControl>
                    <FormDescription>
                      Custom URL path for this project (leave empty to generate
                      from title)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Project Images</h3>

            <div>
              <FormLabel>Main Image</FormLabel>
              {mainImage ? (
                <div className="relative rounded-md overflow-hidden aspect-video mb-2">
                  <img
                    src={mainImage}
                    alt="Main project image"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setMainImage("")}
                      className="mr-2"
                    >
                      Remove
                    </Button>
                    <Dialog open={showGallery} onOpenChange={setShowGallery}>
                      <DialogTrigger asChild>
                        <Button variant="secondary" size="sm">
                          Change
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Select Image</DialogTitle>
                        </DialogHeader>
                        <ImageGallery
                          bucket="portfolio-projects"
                          path=""
                          onSelect={handleMainImageSelect}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <Dialog open={showGallery} onOpenChange={setShowGallery}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-32 flex flex-col items-center justify-center border-dashed"
                      >
                        <Image className="h-8 w-8 mb-2 text-gray-400" />
                        <span>Select Main Image</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Select Image</DialogTitle>
                      </DialogHeader>
                      <ImageGallery
                        bucket="portfolio-projects"
                        path=""
                        onSelect={handleMainImageSelect}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
              {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.root.message}
                </p>
              )}
            </div>

            <div>
              <FormLabel>Additional Images</FormLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                {additionalImages.map((img, index) => (
                  <motion.div
                    key={img}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square rounded-md overflow-hidden"
                  >
                    <img
                      src={img}
                      alt={`Project image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(img)}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="aspect-square flex items-center justify-center border-dashed"
                    >
                      <Plus className="h-6 w-6" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Add Additional Images</DialogTitle>
                    </DialogHeader>
                    <ImageGallery
                      bucket="portfolio-projects"
                      path=""
                      onSelect={handleAdditionalImageSelect}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Save Project
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProjectForm;
