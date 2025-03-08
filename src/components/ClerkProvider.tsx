import { ClerkProvider as ClerkProviderOriginal } from "@clerk/clerk-react";
import { ReactNode } from "react";

interface ClerkProviderProps {
  children: ReactNode;
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!clerkPubKey) {
    console.error("Missing Clerk publishable key");
    return <>{children}</>;
  }

  return (
    <ClerkProviderOriginal publishableKey={clerkPubKey}>
      {children}
    </ClerkProviderOriginal>
  );
}
