import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { Side } from "../../content/sides";
import { easeExpoOut } from "../../lib/motion";

interface HeroProps {
  side: Side;
}

export function Hero({ side }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "14%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.06]);
  const typeY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "-10%"]);
  const typeOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] w-full overflow-hidden"
      style={{ background: "var(--color-paper-50)" }}
      aria-label="Hero — Gia Khôi & Huyền Trân"
    >
      {/* Full-bleed photo on every screen.
          Mobile uses LD3_0608 (portrait), desktop uses LD3_0616 (landscape). */}
      <motion.div style={{ y: photoY, scale: photoScale }} className="absolute inset-0">
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.6, delay: 0.3, ease: easeExpoOut }}
          className="relative h-full w-full"
        >
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/photos/ld3_0608-640.jpg 640w, /photos/ld3_0608-1280.jpg 1280w, /photos/ld3_0608-1920.jpg 1920w"
              sizes="100vw"
            />
            <source
              srcSet="/photos/hero-landscape-640.jpg 640w, /photos/hero-landscape-1280.jpg 1280w, /photos/hero-landscape-1920.jpg 1920w"
              sizes="100vw"
            />
            <img
              src="/photos/ld3_0608-1280.jpg"
              alt="Gia Khôi và Huyền Trân, ảnh studio."
              className="h-full w-full object-cover"
              fetchPriority="high"
              decoding="async"
              style={{ objectPosition: "50% 30%" }}
            />
          </picture>

          {/* Top scrim, just enough for the side label to read */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-44"
            style={{
              background:
                "linear-gradient(180deg, rgba(237,230,216,0.85) 0%, rgba(237,230,216,0) 100%)",
            }}
          />

          {/* Thin bottom fade only at the very edge so the photo bleeds cleanly
              into the cream surface of the next section. Photo remains dominant. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 md:h-44"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(237,230,216,0.35) 60%, var(--color-paper-50) 100%)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Top-left side label */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: easeExpoOut }}
        className="absolute top-[calc(env(safe-area-inset-top)+1.25rem)] left-6 md:top-10 md:left-12 z-20"
      >
        <span className="text-[0.65rem] md:text-xs font-medium tracking-[0.4em] uppercase text-[var(--color-ink-700)]">
          Trân trọng kính mời
        </span>
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.0, delay: 0.9, ease: easeExpoOut }}
          style={{ originX: 0 }}
          className="mt-2 block h-px w-12 bg-[var(--color-ink-700)]"
        />
        <span className="mt-2 block text-[0.7rem] md:text-sm font-medium tracking-[0.25em] uppercase text-[var(--color-ink-900)]">
          {side.label}
        </span>
      </motion.div>

      {/* Top-right ceremony date — desktop only */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7, ease: easeExpoOut }}
        className="hidden md:flex flex-col items-end absolute top-10 right-12 z-20 text-right"
      >
        <span className="text-xs font-medium tracking-[0.4em] uppercase text-[var(--color-ink-700)]">
          {side.ceremony.label}
        </span>
        <span className="font-luxury mt-2 text-[var(--color-ink-900)]" style={{ fontSize: "clamp(1.5rem,1.2rem+0.8vw,2rem)" }}>
          {side.ceremony.solarDisplay}
        </span>
        <span className="mt-1 text-xs font-light italic text-[var(--color-ink-500)]">
          Nhằm {side.ceremony.lunar}
        </span>
      </motion.div>

      {/* Names overlay — same internal layout on both viewports (groom left, & centered,
          bride right). Wrapper is full-width on mobile and confined to the right half
          of the section on desktop. */}
      <motion.div
        style={{ y: typeY, opacity: typeOpacity }}
        className="pointer-events-none absolute bottom-0 z-10 left-0 right-0 md:left-1/2 md:right-12 px-4 md:px-0 pb-32 md:pb-28"
      >
        <h1
          className="font-script flex flex-col items-stretch"
          style={{
            color: "var(--color-ink-900)",
            // Soft white glow so the dark type stays legible over dark areas
            // of the photo (groom's vest, deep shadows). Layered shadows: a wide
            // diffuse halo plus a tight inner glow.
            textShadow:
              "0 0 32px rgba(255,255,255,0.55), 0 0 12px rgba(255,255,255,0.45), 0 1px 2px rgba(255,255,255,0.6)",
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.9, ease: easeExpoOut }}
            className="block self-start whitespace-nowrap text-[clamp(4.5rem,15vw,9rem)] md:text-[clamp(4.5rem,7.5vw,7rem)]"
            style={{
              lineHeight: "1.0",
              paddingBlock: "0.04em",
            }}
          >
            Gia Khôi
          </motion.span>

          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 1.5, ease: easeExpoOut }}
            className="block self-center my-[-0.15em] text-[clamp(3rem,7vw,5rem)] md:text-[clamp(3rem,4.5vw,4rem)]"
            style={{
              lineHeight: "1.0",
              fontFamily: "var(--font-script)",
            }}
          >
            &amp;
          </motion.span>

          <motion.span
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.7, ease: easeExpoOut }}
            className="block self-end text-right whitespace-nowrap text-[clamp(4rem,14vw,8.5rem)] md:text-[clamp(4rem,7vw,6.5rem)]"
            style={{
              lineHeight: "1.0",
              paddingBlock: "0.04em",
            }}
          >
            Huyền Trân
          </motion.span>
        </h1>
      </motion.div>

      {/* Mobile-only ceremony date strip — sits at the very bottom of the hero, above the
          year mark / scroll cue but below the names block. */}
      <motion.div
        style={{ y: typeY, opacity: typeOpacity }}
        className="md:hidden absolute inset-x-0 bottom-0 z-10 px-4 pb-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 2.4, ease: easeExpoOut }}
          className="flex items-baseline gap-3"
        >
          <span className="text-[0.7rem] font-medium tracking-[0.4em] uppercase text-[var(--color-ink-700)] whitespace-nowrap">
            {side.ceremony.label}
          </span>
          <span className="h-px flex-1 bg-[var(--color-ink-400)]/50" />
          <span className="font-luxury text-[var(--color-ink-900)] text-xl">
            {side.ceremony.solarDisplay}
          </span>
        </motion.div>
      </motion.div>

      {/* Bottom-left year mark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 3.0, ease: easeExpoOut }}
        className="absolute bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-6 md:bottom-10 md:left-12 z-20 text-[0.65rem] md:text-xs font-medium tracking-[0.4em] uppercase text-[var(--color-ink-500)]"
      >
        Mmxxvi
      </motion.div>

      {/* Bottom-right scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 3.2, ease: easeExpoOut }}
        className="absolute bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-6 md:bottom-10 md:right-12 z-20"
      >
        <div className="flex items-center gap-3 text-[0.65rem] md:text-xs font-medium tracking-[0.32em] uppercase text-[var(--color-ink-500)]">
          <span>Lướt</span>
          <motion.span
            animate={reduceMotion ? {} : { y: [0, 4, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: easeExpoOut }}
            className="block w-px h-7 bg-[var(--color-ink-500)] origin-top"
          />
        </div>
      </motion.div>
    </section>
  );
}
