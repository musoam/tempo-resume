import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import FileUploader from "./FileUploader";
import { listFiles, deleteFile } from "@/lib/supabase-storage";

interface ImageGalleryProps {
  bucket?: string;
  path?: string;
  onSelect?: (url: string) => void;
  className?: string;
  editable?: boolean;
}

interface ImageItem {
  name: string;
  url: string;
}

const ImageGallery = ({
  bucket = "portfolio",
  path = "images",
  onSelect = () => {},
  className = "",
  editable = true,
}: ImageGalleryProps) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(
        `Fetching images from bucket: ${bucket}, path: ${path || "root"}`,
      );

      // Import the listFiles function
      const { listFiles } = await import("@/lib/supabase-storage");

      // Fetch images from Supabase
      const files = await listFiles(bucket, path);

      // Convert to our format
      const imageItems = files.map((file) => ({
        name: file.name,
        url: file.url,
      }));

      console.log("Fetched images from Supabase:", imageItems);
      setImages(imageItems);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError("Failed to load images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [bucket, path]);

  const handleImageSelect = (url: string) => {
    setSelectedImage(url);
    onSelect(url);
  };

  const handleDeleteImage = async (imageName: string) => {
    if (!editable) return;

    setDeleting(imageName);
    try {
      // Import the deleteFile function
      const { deleteFile } = await import("@/lib/supabase-storage");

      const filePath = path ? `${path}/${imageName}` : imageName;
      const success = await deleteFile(filePath, bucket);

      if (success) {
        setImages(images.filter((img) => img.name !== imageName));
        if (selectedImage && selectedImage.includes(imageName)) {
          setSelectedImage(null);
        }
      } else {
        throw new Error("Failed to delete image");
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      setError("Failed to delete image. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const handleUploadComplete = (url: string) => {
    // Extract the filename from the URL
    const filename = url.split("/").pop() || "";

    // Add the new image to the gallery
    setImages([...images, { name: filename, url }]);
    setShowUploader(false);
  };

  return (
    <div className={`w-full ${className}`}>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="ml-2">Loading images...</span>
        </div>
      ) : (
        <>
          {editable && (
            <div className="mb-4 flex justify-end">
              <Button
                onClick={() => setShowUploader(!showUploader)}
                variant="outline"
                className="flex items-center gap-1"
              >
                {showUploader ? (
                  "Cancel"
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Image
                  </>
                )}
              </Button>
            </div>
          )}

          {showUploader && (
            <div className="mb-6">
              <FileUploader
                bucket={bucket}
                path={path}
                acceptedFileTypes="image/*"
                onUploadComplete={handleUploadComplete}
                onUploadError={(err) => setError(err)}
              />
            </div>
          )}

          {images.length === 0 && !loading ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No images found</p>
              {editable && (
                <Button
                  onClick={() => setShowUploader(true)}
                  variant="ghost"
                  className="mt-2"
                >
                  Upload your first image
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <motion.div
                  key={image.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`relative group aspect-square rounded-md overflow-hidden border ${selectedImage === image.url ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="w-full h-full cursor-pointer flex flex-col">
                    <div className="flex-grow">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                        onClick={() => {
                          console.log("Image clicked:", image.url);
                          onSelect(image.url);
                          setSelectedImage(image.url);
                          setShowUploader(false);
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="w-full py-2 px-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
                      onClick={() => {
                        console.log("Select button clicked:", image.url);
                        onSelect(image.url);
                        setSelectedImage(image.url);
                        setShowUploader(false);
                      }}
                    >
                      Select
                    </button>
                  </div>

                  {editable && (
                    <div className="absolute top-0 right-0 p-2">
                      {deleting === image.name ? (
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      ) : (
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image.name);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageGallery;
