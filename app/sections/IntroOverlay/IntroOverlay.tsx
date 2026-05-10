import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { FloralMark } from "../../components/FloralMark";
import { easeExpoOut } from "../../lib/motion";

const STORAGE_KEY = "kt-intro-seen";

export function IntroOverlay() {
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState<boolean | null>(null);

  /* Hydrate the show state from sessionStorage after mount.
     We initialize to null so the first render matches the static index.html (where this is invisible),
     then set the real value once we have window. Avoids a render mismatch. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem(STORAGE_KEY);
    setShow(!seen);
  }, []);

  useEffect(() => {
    if (!show) return;

    const fontsReady =
      typeof document !== "undefined" && document.fonts ? document.fonts.ready : Promise.resolve();

    let cancelled = false;
    fontsReady.then(() => {
      if (cancelled) return;
      const duration = reduceMotion ? 600 : 3100;
      const timer = window.setTimeout(() => dismiss(), duration);
      return () => window.clearTimeout(timer);
    });

    return () => {
      cancelled = true;
    };
  }, [show, reduceMotion]);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: easeExpoOut }}
          onClick={dismiss}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer"
          style={{ background: "var(--color-paper-50)" }}
          aria-label="Đang mở thư mời"
          role="presentation"
        >
          {!reduceMotion && (
            <>
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.15, ease: easeExpoOut }}
                className="text-[var(--color-ink-700)]"
              >
                <FloralMark size={56} />
              </motion.div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 1.0, ease: easeExpoOut }}
                style={{ originX: 0.5 }}
                className="mt-8 h-px w-24 bg-[var(--color-ink-500)]"
              />

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4, ease: easeExpoOut }}
                className="mt-8 text-[0.7rem] font-medium tracking-[0.4em] uppercase text-[var(--color-ink-500)]"
              >
                Trân trọng kính mời
              </motion.p>
            </>
          )}

          {reduceMotion && (
            <div className="text-[var(--color-ink-700)] flex flex-col items-center">
              <FloralMark size={48} />
              <p className="mt-6 text-xs tracking-[0.3em] uppercase text-[var(--color-ink-500)]">
                Trân trọng kính mời
              </p>
            </div>
          )}

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: reduceMotion ? 0.2 : 2.4 }}
            className="absolute bottom-8 text-[0.6rem] tracking-[0.4em] uppercase text-[var(--color-ink-500)]/60"
          >
            Chạm để bỏ qua
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
