import React, { useState, useEffect } from "react";
import { useMockData } from "./MockDataProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Plus, Image, Loader2 } from "lucide-react";
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
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import ImageGallery from "./ImageGallery";
import {
  SiteSettings,
  getSiteSettings,
  updateSiteSettings,
} from "@/lib/settings";

const socialLinkSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  url: z.string().url({ message: "Please enter a valid URL" }),
  icon: z.string().min(1, { message: "Icon is required" }),
});

const settingsSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  ownerName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  location: z.string().optional(),
  about: z
    .string()
    .min(10, { message: "About text must be at least 10 characters" }),
  heroTitle: z
    .string()
    .min(2, { message: "Hero title must be at least 2 characters" }),
  heroDescription: z
    .string()
    .min(10, { message: "Hero description must be at least 10 characters" }),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const SettingsForm = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState<string>("");
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [socialLinks, setSocialLinks] = useState<
    Array<{ name: string; url: string; icon: string }>
  >([]);
  const [newSocialLink, setNewSocialLink] = useState({
    name: "",
    url: "",
    icon: "Github",
  });

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      title: "",
      ownerName: "",
      email: "",
      phone: "",
      location: "",
      about: "",
      heroTitle: "",
      heroDescription: "",
    },
  });

  // Use the MockDataProvider directly
  const { siteSettings } = useMockData();

  useEffect(() => {
    const loadSettings = () => {
      setLoading(true);
      try {
        // Set form values from the context
        form.reset({
          title: siteSettings.title,
          ownerName: siteSettings.ownerName,
          email: siteSettings.email,
          phone: siteSettings.phone || "",
          location: siteSettings.location || "",
          about: siteSettings.about,
          heroTitle: siteSettings.heroTitle,
          heroDescription: siteSettings.heroDescription,
        });

        // Set other state
        setHeroImage(siteSettings.heroImageUrl);
        setSocialLinks(siteSettings.socialLinks);
      } catch (err) {
        console.error("Error loading settings:", err);
        setError("Failed to load settings. Using default values.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [form, siteSettings]);

  const handleHeroImageSelect = (url: string) => {
    setHeroImage(url);
    setShowImageGallery(false);
  };

  const addSocialLink = () => {
    try {
      // Validate the new social link
      socialLinkSchema.parse(newSocialLink);

      // Add to the list
      setSocialLinks([...socialLinks, { ...newSocialLink }]);

      // Reset the form
      setNewSocialLink({ name: "", url: "", icon: "Github" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("Invalid social link");
      }
    }
  };

  const removeSocialLink = (index: number) => {
    const newLinks = [...socialLinks];
    newLinks.splice(index, 1);
    setSocialLinks(newLinks);
  };

  // Get the updateSiteSettings function directly from the context
  const { updateSiteSettings } = useMockData();

  const onSubmit = async (values: SettingsFormValues) => {
    if (!heroImage) {
      setError("Please select a hero image");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      console.log("Submitting settings form with values:", values);
      console.log("Hero image:", heroImage);
      console.log("Social links:", socialLinks);

      const updatedSettings: SiteSettings = {
        ...values,
        heroImageUrl: heroImage,
        socialLinks: socialLinks,
      };

      console.log("Calling updateSiteSettings with:", updatedSettings);
      const result = await updateSiteSettings(updatedSettings);
      console.log("Result from updateSiteSettings:", result);

      if (!result) {
        throw new Error("Failed to save settings");
      }

      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-primary animate-spin mr-2" />
        <span>Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">General Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Portfolio Title</FormLabel>
                      <FormControl>
                        <Input placeholder="My Creative Portfolio" {...field} />
                      </FormControl>
                      <FormDescription>
                        This appears in the browser tab and header
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your full name as displayed on the site
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Hero Section</h3>

              <div className="mb-6">
                <FormLabel className="block mb-2">
                  Hero Background Image
                </FormLabel>
                {heroImage ? (
                  <div className="relative rounded-md overflow-hidden aspect-video mb-2">
                    <img
                      src={heroImage}
                      alt="Hero background"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setHeroImage("")}
                        className="mr-2"
                      >
                        Remove
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowImageGallery(true)}
                      >
                        Change
                      </Button>
                      <Dialog
                        open={showImageGallery}
                        onOpenChange={setShowImageGallery}
                      >
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Select Hero Image</DialogTitle>
                          </DialogHeader>
                          <ImageGallery
                            bucket="portfolio-profile"
                            path=""
                            onSelect={(url) => {
                              handleHeroImageSelect(url);
                              setShowImageGallery(false);
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-32 flex flex-col items-center justify-center border-dashed"
                      onClick={() => setShowImageGallery(true)}
                    >
                      <Image className="h-8 w-8 mb-2 text-gray-400" />
                      <span>Select Hero Image</span>
                    </Button>
                    <Dialog
                      open={showImageGallery}
                      onOpenChange={setShowImageGallery}
                    >
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Select Hero Image</DialogTitle>
                        </DialogHeader>
                        <ImageGallery
                          bucket="portfolio-profile"
                          path=""
                          onSelect={(url) => {
                            handleHeroImageSelect(url);
                            setShowImageGallery(false);
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="heroTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Product Designer & Developer"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Your title or role displayed in the hero section
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="heroDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Creating beautiful digital experiences with a focus on usability and performance."
                          {...field}
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormDescription>
                        A brief description of your work or expertise
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="contact@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="San Francisco, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">About Me</h3>
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="I'm a creative professional with expertise in web development and design."
                        {...field}
                        className="min-h-[150px]"
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description about yourself and your expertise
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Social Media Links</h3>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {socialLinks.map((link, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="gap-1 p-2"
                    >
                      {link.name}: {link.url.substring(0, 20)}...
                      <button
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <FormLabel>Platform</FormLabel>
                    <select
                      value={newSocialLink.icon}
                      onChange={(e) =>
                        setNewSocialLink({
                          ...newSocialLink,
                          name: e.target.value,
                          icon: e.target.value,
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Github">GitHub</option>
                      <option value="Twitter">Twitter</option>
                      <option value="Linkedin">LinkedIn</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Youtube">YouTube</option>
                      <option value="Dribbble">Dribbble</option>
                      <option value="Behance">Behance</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <FormLabel>URL</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://github.com/username"
                        value={newSocialLink.url}
                        onChange={(e) =>
                          setNewSocialLink({
                            ...newSocialLink,
                            url: e.target.value,
                          })
                        }
                      />
                      <Button type="button" onClick={addSocialLink}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SettingsForm;
