import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { FloralMark } from "../../components/FloralMark";
import { easeExpoOut } from "../../lib/motion";
import { useMusic } from "../../audio/MusicProvider";
import { couple, ceremonies } from "../../content/couple";

const STORAGE_KEY = "kt-intro-seen";

/* Number of vertical panels the cover splits into on open. They lift away in a
   left-to-right stagger — a curtain rising off the page to reveal the hero. */
const PANELS = 6;

/* The opening — a refined title card that, on tap, rises away as a staggered
   curtain to reveal the hero section behind it. Pure translateY transforms, so
   it stays smooth on any device; no 3D, no clip-path gimmicks.

   The tap is required (and starts the music) because browsers block audio
   autoplay until the guest interacts. */
export function Cover() {
  const reduceMotion = useReducedMotion();
  const { start } = useMusic();
  /* SPA build (ssr:false), so sessionStorage is readable at first render —
     decide synchronously to avoid a flash of the hero before the cover mounts.
     #open (or ?replay) forces it back for testing. */
  const [show, setShow] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const forced = window.location.hash === "#open" || window.location.search.includes("replay");
    return forced || !sessionStorage.getItem(STORAGE_KEY);
  });
  const [opening, setOpening] = useState(false);
  const timers = useRef<number[]>([]);

  function open() {
    if (opening) return;
    start();
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpening(true);
    // Unmount once the last panel has cleared the top of the screen.
    const total = reduceMotion ? 520 : 1500;
    timers.current.push(window.setTimeout(() => setShow(false), total));
  }

  const date = ceremonies.damCuoi.solarDisplay;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="cover"
          className="fixed inset-0 z-[100] cursor-pointer"
          onClick={open}
          role="button"
          tabIndex={0}
          aria-label="Mở thiệp mời"
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open())}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: easeExpoOut }}
        >
          {/* CURTAIN — adjacent paper panels that together cover the screen,
              then lift off the top in a stagger. Under reduced motion they
              stay put and the whole gate just fades out. */}
          {Array.from({ length: PANELS }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 h-full"
              style={{
                left: `${(i * 100) / PANELS}%`,
                // Slight overlap hides sub-pixel seams between panels.
                width: `calc(${100 / PANELS}% + 1px)`,
                background: "linear-gradient(180deg, var(--color-paper-50), var(--color-paper-100))",
              }}
              initial={{ y: "0%" }}
              animate={{ y: opening && !reduceMotion ? "-101%" : "0%" }}
              transition={{
                duration: 1.05,
                delay: opening ? 0.28 + i * 0.07 : 0,
                ease: easeExpoOut,
              }}
            />
          ))}

          {/* TITLE — sits above the panels and lifts/fades out first so the
              curtain rises onto a clear field. */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
            animate={{ opacity: opening ? 0 : 1, y: opening ? -26 : 0 }}
            transition={{ duration: 0.5, ease: easeExpoOut }}
            style={{ pointerEvents: "none" }}
          >
            {/* Hairline frame, echoing the hero's cinematic frame. */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-6 md:inset-10"
              style={{ border: "1px solid color-mix(in oklch, var(--color-ink-400) 42%, transparent)" }}
              initial={{ opacity: 0, scale: 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.15, ease: easeExpoOut }}
            />

            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: easeExpoOut }}
              className="text-[0.62rem] md:text-xs font-medium uppercase tracking-[0.45em] text-[var(--color-ink-500)]"
            >
              Trân trọng kính mời
            </motion.span>

            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.45, ease: easeExpoOut }}
              className="my-7 text-[var(--color-ink-700)]"
            >
              <FloralMark size={46} />
            </motion.span>

            <h1 className="font-script leading-none text-[var(--color-ink-900)]">
              <motion.span
                className="block text-[clamp(3rem,11vw,5.5rem)]"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.6, ease: easeExpoOut }}
              >
                {couple.groom.full}
              </motion.span>
              <motion.span
                className="my-1 block text-[clamp(1.6rem,6vw,2.5rem)] text-[var(--color-rose)]"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.85, ease: easeExpoOut }}
              >
                &amp;
              </motion.span>
              <motion.span
                className="block text-[clamp(3rem,11vw,5.5rem)]"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 1.0, ease: easeExpoOut }}
              >
                {couple.bride.full}
              </motion.span>
            </h1>

            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 1.25, ease: easeExpoOut }}
              style={{ originX: 0.5 }}
              className="mt-8 block h-px w-24 bg-[var(--color-ink-400)]"
            />

            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4, ease: easeExpoOut }}
              className="mt-6 text-[0.72rem] md:text-sm font-medium uppercase tracking-[0.4em] text-[var(--color-ink-700)]"
            >
              {date}
            </motion.span>

            {/* Open cue — quiet pulse, fades the instant the curtain rises. */}
            <motion.span
              className="absolute bottom-[calc(env(safe-area-inset-bottom)+2.2rem)] md:bottom-14 flex items-center gap-2 text-[0.6rem] md:text-[0.68rem] font-medium uppercase tracking-[0.4em] text-[var(--color-ink-500)]"
              initial={{ opacity: 0 }}
              animate={
                reduceMotion
                  ? { opacity: 1 }
                  : { opacity: [0.5, 1, 0.5], transition: { duration: 2.6, delay: 1.8, repeat: Infinity, ease: "easeInOut" } }
              }
            >
              <OpenIcon />
              Chạm để mở thiệp
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Two small chevrons rising apart — a glyph for "open / lift". */
function OpenIcon() {
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden>
      <path d="M1 8 L8 2 L15 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
