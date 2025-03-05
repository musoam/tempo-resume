import { useEffect, useState } from "react";
import { initializeStorage } from "@/lib/supabase-admin";
import { Button } from "./ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface StorageInitializerProps {
  onInitialized?: () => void;
}

const StorageInitializer = ({
  onInitialized = () => {},
}: StorageInitializerProps) => {
  const [status, setStatus] = useState<
    "idle" | "initializing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialize = async () => {
    setStatus("initializing");
    setErrorMessage(null);

    try {
      // Import the createStorageBuckets function
      const { createStorageBuckets } = await import(
        "@/lib/create-storage-function"
      );

      // Create storage buckets directly
      const success = await createStorageBuckets();

      if (!success) {
        throw new Error("Failed to create storage buckets");
      }

      console.log("Storage buckets initialized successfully");
      setStatus("success");
      onInitialized();
    } catch (error) {
      console.error("Storage initialization failed:", error);
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    }
  };

  useEffect(() => {
    // Auto-initialize when component mounts
    initialize();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {status === "initializing" && (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {status === "error" && (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}

          <div>
            <h3 className="font-medium">
              {status === "idle" && "Storage Setup"}
              {status === "initializing" && "Initializing Storage..."}
              {status === "success" && "Storage Initialized"}
              {status === "error" && "Storage Initialization Failed"}
            </h3>

            {status === "success" && (
              <p className="text-sm text-gray-500">
                Supabase storage buckets are ready to use
              </p>
            )}

            {status === "error" && errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
        </div>

        {(status === "idle" || status === "error") && (
          <Button
            onClick={initialize}
            size="sm"
            variant={status === "error" ? "destructive" : "default"}
          >
            {status === "error" ? "Retry" : "Initialize"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default StorageInitializer;
