import React, { useState, useRef } from "react";
import { Upload, X, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface FileUploaderProps {
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
  bucket?: string;
  path?: string;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
  className?: string;
}

const FileUploader = ({
  onUploadComplete = () => {},
  onUploadError = () => {},
  bucket = "portfolio",
  path = "",
  acceptedFileTypes = "image/*",
  maxSizeMB = 5,
  className = "",
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSizeMB}MB limit`;
    }

    // Check file type if acceptedFileTypes is specified
    if (acceptedFileTypes && acceptedFileTypes !== "*") {
      const fileType = file.type;

      // Handle wildcards like "image/*"
      if (acceptedFileTypes.includes("*")) {
        const generalType = acceptedFileTypes.split("/")[0];
        if (!fileType.startsWith(`${generalType}/`)) {
          return `Only ${generalType} files are accepted`;
        }
      }
      // Handle specific types like "image/jpeg,image/png"
      else if (
        !acceptedFileTypes.split(",").some((type) => fileType === type.trim())
      ) {
        return `File type ${fileType} is not accepted`;
      }
    }

    return null;
  };

  const handleFileUpload = async (file: File) => {
    // Reset states
    setError(null);
    setUploadSuccess(false);

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      onUploadError(validationError);
      return;
    }

    setIsUploading(true);

    try {
      // Upload file to Supabase
      console.log("Uploading file to Supabase bucket:", bucket, "path:", path);

      // Import the uploadFile function
      const { uploadFile } = await import("@/lib/supabase-storage");
      const fileUrl = await uploadFile(file, bucket, path);

      if (fileUrl) {
        console.log("Upload successful, URL:", fileUrl);
        setUploadSuccess(true);
        onUploadComplete(fileUrl);
      } else {
        throw new Error("Upload failed - no URL returned");
      }
    } catch (err) {
      console.error("File upload error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      onUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const resetUploader = () => {
    setError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50"} ${error ? "border-red-500 bg-red-50" : ""} ${uploadSuccess ? "border-green-500 bg-green-50" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept={acceptedFileTypes}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
            <p className="text-sm text-gray-500">Uploading file...</p>
          </div>
        ) : uploadSuccess ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Check className="h-10 w-10 text-green-500 mb-2" />
            <p className="text-sm text-green-600 font-medium">
              Upload successful!
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                resetUploader();
              }}
              className="mt-2"
            >
              Upload another file
            </Button>
          </div>
        ) : (
          <>
            <Upload
              className={`h-10 w-10 mb-2 ${error ? "text-red-500" : "text-gray-400"}`}
            />
            <p className="text-sm font-medium mb-1">
              {error ? "Upload Error" : "Drag & drop a file or click to browse"}
            </p>
            <p className="text-xs text-gray-500 text-center">
              {error
                ? error
                : `Supports ${acceptedFileTypes.replace("*", "all")} files up to ${maxSizeMB}MB`}
            </p>
            {error && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  resetUploader();
                }}
                className="mt-2"
              >
                Try again
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
