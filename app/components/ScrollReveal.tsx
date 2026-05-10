import { motion } from "motion/react";
import type { ReactNode } from "react";
import { easeExpoOut } from "../lib/motion";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  amount?: number;
  yOffset?: number;
}

export function ScrollReveal({
  children,
  delay = 0,
  className,
  amount = 0.3,
  yOffset = 24,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1.0, delay, ease: easeExpoOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Mask reveal — for type and photo blocks */
export function MaskReveal({
  children,
  delay = 0,
  className,
  direction = "down",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "down" | "up" | "left" | "right";
}) {
  const initialClip =
    direction === "down" ? "inset(0 0 100% 0)" :
    direction === "up"   ? "inset(100% 0 0 0)" :
    direction === "left" ? "inset(0 100% 0 0)" :
                           "inset(0 0 0 100%)";

  return (
    <motion.div
      initial={{ clipPath: initialClip }}
      whileInView={{ clipPath: "inset(0 0 0 0)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.4, delay, ease: easeExpoOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
