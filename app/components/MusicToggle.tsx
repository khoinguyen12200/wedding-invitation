import { motion, useReducedMotion } from "motion/react";
import { easeExpoOut } from "../lib/motion";
import { useMusic } from "../audio/MusicProvider";

/* Three equalizer bars. They bob on independent loops while the track plays
   and settle flat when it's paused, so the button's state reads at a glance
   without text. Heights are in the 24-unit viewBox. */
const BARS = [
  { x: 5.5, playing: [7, 15, 7], rest: 6, dur: 0.9, delay: 0 },
  { x: 11, playing: [14, 5, 14], rest: 10, dur: 1.05, delay: 0.18 },
  { x: 16.5, playing: [9, 17, 9], rest: 7, dur: 0.8, delay: 0.36 },
] as const;

/* Floating audio control, pinned bottom-right above every section. Sits behind
   the invitation cover (which has a higher stack), so it only becomes visible
   once the cover opens — at which point it already reflects the playing state. */
export function MusicToggle() {
  const { isPlaying, toggle } = useMusic();
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
      aria-pressed={isPlaying}
      title={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
      initial={{ opacity: 0, y: 14, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.9, ease: easeExpoOut }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+1.1rem)] right-5 md:bottom-7 md:right-7 z-[70] grid h-11 w-11 place-items-center rounded-full border backdrop-blur-sm"
      style={{
        background: "color-mix(in oklch, var(--color-paper-50) 86%, transparent)",
        borderColor: "color-mix(in oklch, var(--color-ink-400) 45%, transparent)",
        color: "var(--color-ink-800)",
        boxShadow: "0 4px 16px -6px rgba(35,26,18,0.28)",
      }}
    >
      {/* Faint rotating ring while playing — a quiet sign of life. */}
      {isPlaying && !reduceMotion && (
        <motion.span
          aria-hidden
          className="absolute inset-[3px] rounded-full"
          style={{ border: "1px solid color-mix(in oklch, var(--color-rose) 35%, transparent)" }}
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: 360, opacity: 0.7 }}
          transition={{
            rotate: { duration: 9, repeat: Infinity, ease: "linear" },
            opacity: { duration: 0.6 },
          }}
        />
      )}

      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <g>
          {BARS.map((bar, i) => {
            const animated = isPlaying && !reduceMotion;
            const heights: number[] = animated ? [...bar.playing] : [bar.rest];
            return (
              <motion.rect
                key={i}
                x={bar.x}
                width={2.4}
                rx={1.2}
                fill="currentColor"
                initial={false}
                animate={{
                  height: heights,
                  y: heights.map((h) => 12 - h / 2),
                }}
                transition={
                  animated
                    ? {
                        duration: bar.dur,
                        delay: bar.delay,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                      }
                    : { duration: 0.4, ease: easeExpoOut }
                }
              />
            );
          })}
        </g>
        {/* Slash when muted — unmistakable "sound off". */}
        {!isPlaying && (
          <motion.line
            x1="4"
            y1="20"
            x2="20"
            y2="4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.85 }}
            transition={{ duration: 0.4, ease: easeExpoOut }}
          />
        )}
      </svg>
    </motion.button>
  );
}
