import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/* A small cream dot that lags the cursor on desktop pointer devices.
   Renders nothing on touch / reduced-motion. The dot scales up when hovering
   anchors and buttons via the data-cursor attribute pattern. */
export function CursorDot() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, { damping: 35, stiffness: 350, mass: 0.45 });
  const springY = useSpring(mouseY, { damping: 35, stiffness: 350, mass: 0.45 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (reduceMotion) return;

    setEnabled(true);

    const handleMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest("a, button, [data-cursor='hover']");
      setHovering(!!interactive);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [reduceMotion, mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        style={{ x: springX, y: springY }}
        className="pointer-events-none fixed left-0 top-0 z-[200] mix-blend-difference"
        aria-hidden="true"
      >
        <motion.div
          animate={{
            scale: hovering ? 3.2 : 1,
            opacity: hovering ? 0.95 : 0.85,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="-translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-[var(--color-paper-50)]"
        />
      </motion.div>
    </>
  );
}
