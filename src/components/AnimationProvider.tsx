import React, { createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

interface AnimationContextType {
  scrollYProgress: React.MutableRefObject<number>;
  smoothScrollTo: (elementId: string) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined,
);

interface AnimationProviderProps {
  children: ReactNode;
}

// Export the hook separately from the component file
function useAnimation(): AnimationContextType {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return context;
}

// Main component
function AnimationProvider({ children }: AnimationProviderProps) {
  // Set up scroll progress tracking
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

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

  return (
    <AnimationContext.Provider
      value={{
        scrollYProgress,
        smoothScrollTo,
      }}
    >
      {/* Progress bar that shows scroll position */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50"
        style={{ scaleX, transformOrigin: "left" }}
      />
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </AnimationContext.Provider>
  );
}

export { useAnimation };
export default AnimationProvider;
