import { SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { ReactNode } from "react";

interface AdminAuthProps {
  children: ReactNode;
}

export function AdminAuth({ children }: AdminAuthProps) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Please sign in to access the admin panel
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <SignIn redirectUrl="/admin" />
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  );
}
