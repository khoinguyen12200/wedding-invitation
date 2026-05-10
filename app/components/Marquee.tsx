import { motion, useReducedMotion, useScroll, useTransform, useVelocity } from "motion/react";
import { useRef } from "react";

interface MarqueeProps {
  text: string;
  separator?: string;
  durationSec?: number;
  /** When true, the marquee uses Italianno script. Default: sans uppercase. */
  script?: boolean;
  /** Background tone. Default: ink-900. Pass "transparent" to inherit. */
  background?: string;
}

/* Horizontal scroll loop. Direction reacts to vertical scroll velocity:
   scrolling down nudges the marquee left (faster), scrolling up reverses it. */
export function Marquee({
  text,
  separator = "·",
  durationSec = 38,
  script = false,
  background = "var(--color-ink-900)",
}: MarqueeProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  /* Map velocity to a direction nudge in [-1, 1]. */
  const nudge = useTransform(velocity, [-2000, 0, 2000], [-1, 0, 1]);

  const items = Array.from({ length: 6 });

  return (
    <section
      ref={ref}
      style={{ background }}
      aria-hidden="true"
      className="relative overflow-hidden border-y border-[var(--color-paper-200)]/15"
    >
      <motion.div
        animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={{
          duration: durationSec,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          // Subtle direction nudge from scroll velocity (motion is still primary)
          translateX: reduceMotion ? undefined : nudge,
        }}
        className={`flex shrink-0 items-center whitespace-nowrap py-6 md:py-10 ${
          script
            ? "font-[var(--font-script)] italic text-[clamp(3rem,2rem+6vw,7rem)] leading-none text-[var(--color-paper-50)]"
            : "font-medium uppercase tracking-[0.2em] text-[clamp(0.75rem,0.6rem+1vw,1.125rem)] text-[var(--color-paper-50)]"
        }`}
      >
        {items.map((_, i) => (
          <span key={i} className="flex shrink-0 items-center">
            <span className="px-6 md:px-10">{text}</span>
            <span className={script ? "px-2 text-[var(--color-blush)]" : "px-3 text-[var(--color-paper-300)]"}>
              {separator}
            </span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}
