import React, { createContext, useContext, ReactNode } from "react";

interface AnimationContextType {
  smoothScrollTo: (elementId: string) => void;
}

const AnimationContext = createContext<AnimationContextType>({
  smoothScrollTo: () => {},
});

interface AnimationProviderProps {
  children: ReactNode;
}

// Export the hook separately from the component file
export function useAnimation(): AnimationContextType {
  return useContext(AnimationContext);
}

// Main component
function AnimationProvider({ children }: AnimationProviderProps) {
  // Smooth scroll function
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const value = {
    smoothScrollTo,
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}

export default AnimationProvider;
