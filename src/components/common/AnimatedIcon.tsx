import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface AnimatedIconProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  animation?: "float" | "pulse" | "spin-slow" | "subtle-bounce" | "glow";
  className?: string;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  children,
  animation = "float",
  className = "",
  ...props
}) => {
  const getAnimationVariants = () => {
    switch (animation) {
      case "pulse":
        return {
          animate: {
            scale: [1, 1.06, 1],
            opacity: [0.92, 1, 0.92],
          },
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      case "spin-slow":
        return {
          animate: {
            rotate: [0, 360],
          },
          transition: {
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          },
        };
      case "subtle-bounce":
        return {
          animate: {
            y: [0, -4, 0],
          },
          transition: {
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      case "glow":
        return {
          animate: {
            scale: [1, 1.04, 1],
            filter: [
              "drop-shadow(0 0 2px rgba(56,189,248,0.2))",
              "drop-shadow(0 0 12px rgba(56,189,248,0.5))",
              "drop-shadow(0 0 2px rgba(56,189,248,0.2))",
            ],
          },
          transition: {
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      case "float":
      default:
        return {
          animate: {
            y: [0, -5, 0],
            rotate: [0, 1.5, 0, -1.5, 0],
          },
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
    }
  };

  const anim = getAnimationVariants();

  return (
    <motion.div
      animate={anim.animate}
      transition={anim.transition as any}
      whileHover={{ scale: 1.12, rotate: 3, transition: { duration: 0.2 } }}
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
