import { useReducedMotion } from "motion/react";

interface MarqueeProps {
  text: string;
  separator?: string;
  durationSec?: number;
  /** When true, the marquee renders the Prata serif at hero scale. Default: sans uppercase. */
  script?: boolean;
  /** Background tone. Default: ink-900. Pass "transparent" to inherit. */
  background?: string;
}

/* Pure-CSS infinite marquee.

   Earlier we drove this with `motion.div` + `useScroll` + `useVelocity`, but
   on a ~7rem Prata italic line at 6 copies the per-frame JS work showed up
   as scroll lag. The browser-native @keyframes path is GPU-composited, runs
   off the compositor thread, and has zero JS frame cost.

   The track is doubled (`text + separator` rendered twice end-to-end) and
   translated by exactly 50% to give a seamless loop. We never animate
   anything but `transform`, and the parent gets `will-change: transform` so
   it gets its own compositor layer instead of repainting the section. */
export function Marquee({
  text,
  separator = "·",
  durationSec = 38,
  script = false,
  background = "var(--color-ink-900)",
}: MarqueeProps) {
  const reduceMotion = useReducedMotion();

  const items = Array.from({ length: 4 });

  return (
    <section
      style={{ background }}
      aria-hidden="true"
      className="relative overflow-hidden border-y border-[var(--color-paper-200)]/15"
    >
      <div
        className={`flex w-max items-center whitespace-nowrap py-6 md:py-10 ${
          script
            ? "italic text-[clamp(2.5rem,1.6rem+5vw,5.5rem)] leading-none text-[var(--color-paper-50)]"
            : "font-medium uppercase tracking-[0.2em] text-[clamp(0.75rem,0.6rem+1vw,1.125rem)] text-[var(--color-paper-50)]"
        }`}
        style={{
          fontFamily: script ? "var(--font-serif)" : undefined,
          animation: reduceMotion ? undefined : `marquee-track ${durationSec}s linear infinite`,
          willChange: "transform",
        }}
      >
        {/* Two identical halves end-to-end. The animation translates by -50%,
            so when the first half scrolls off-screen the second is exactly in
            position to take its place. */}
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center" aria-hidden={half === 1 ? "true" : undefined}>
            {items.map((_, i) => (
              <span key={i} className="flex shrink-0 items-center">
                <span className="px-6 md:px-10">{text}</span>
                <span className={script ? "px-2 text-[var(--color-blush)]" : "px-3 text-[var(--color-paper-300)]"}>
                  {separator}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee-track {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </section>
  );
}
