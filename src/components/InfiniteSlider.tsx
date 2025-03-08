import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [hovering, setHovering] = useState(false);
  const currentDuration =
    hovering && durationOnHover ? durationOnHover : duration;

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        className="flex w-max"
        style={{
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        animate={{
          x:
            direction === "horizontal"
              ? reverse
                ? [0, -1000, 0]
                : [0, -1000, 0]
              : 0,
          y:
            direction === "vertical"
              ? reverse
                ? [0, -1000, 0]
                : [0, -1000, 0]
              : 0,
        }}
        transition={{
          x: {
            duration: currentDuration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          },
          y: {
            duration: currentDuration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          },
        }}
        onHoverStart={() => durationOnHover && setHovering(true)}
        onHoverEnd={() => durationOnHover && setHovering(false)}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
