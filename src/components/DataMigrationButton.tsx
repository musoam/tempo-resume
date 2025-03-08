import React, { useState } from "react";
import { Button } from "./ui/button";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { migrateLocalDataToSupabase } from "@/lib/data-migration";

interface DataMigrationButtonProps {
  onComplete?: () => void;
  className?: string;
}

const DataMigrationButton = ({
  onComplete = () => {},
  className = "",
}: DataMigrationButtonProps) => {
  const [status, setStatus] = useState<
    "idle" | "migrating" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMigration = async () => {
    setStatus("migrating");
    setErrorMessage(null);

    try {
      const success = await migrateLocalDataToSupabase();

      if (success) {
        setStatus("success");
        onComplete();
      } else {
        throw new Error("Migration failed");
      }
    } catch (error) {
      console.error("Migration error:", error);
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    }
  };

  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {status === "migrating" && (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          )}
          {status === "success" && <Check className="h-5 w-5 text-green-500" />}
          {status === "error" && (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}

          <div>
            <h3 className="font-medium">
              {status === "idle" && "Migrate Local Data to Supabase"}
              {status === "migrating" && "Migrating Data..."}
              {status === "success" && "Data Migration Successful"}
              {status === "error" && "Data Migration Failed"}
            </h3>

            {status === "success" && (
              <p className="text-sm text-gray-500">
                All local data has been migrated to Supabase
              </p>
            )}

            {status === "error" && errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
        </div>

        {(status === "idle" || status === "error") && (
          <Button
            onClick={handleMigration}
            size="sm"
            variant={status === "error" ? "destructive" : "default"}
          >
            {status === "error" ? "Retry" : "Migrate Data"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DataMigrationButton;
