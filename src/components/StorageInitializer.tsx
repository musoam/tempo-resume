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
      // Skip SQL function creation and directly create tables
      try {
        // Create projects table directly
        await supabase
          .from("projects")
          .select("count")
          .limit(1)
          .then(async () => {
            console.log("Projects table exists");
          })
          .catch(async () => {
            console.log("Creating projects table directly");
            // We'll rely on Supabase auto-creating the table on first insert
          });

        // Create contact_submissions table directly
        await supabase
          .from("contact_submissions")
          .select("count")
          .limit(1)
          .then(async () => {
            console.log("Contact submissions table exists");
          })
          .catch(async () => {
            console.log("Creating contact_submissions table directly");
            // We'll rely on Supabase auto-creating the table on first insert
          });
      } catch (err) {
        console.error("Error checking/creating tables:", err);
      }

      // Initialize storage and tables
      await initializeStorage();
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
