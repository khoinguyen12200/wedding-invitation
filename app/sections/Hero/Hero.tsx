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
      {/* Full-bleed photo. Mobile uses LD3_0608 (portrait); desktop uses
          hero-landscape. Curtain-down clipPath on entrance. */}
      <motion.div style={{ y: photoY, scale: photoScale }} className="absolute inset-0">
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.8, delay: 0.3, ease: easeExpoOut }}
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

      {/* CINEMATIC FRAME — a thin cream rectangle that draws clockwise around
          the hero on load. Echoes the seal's ceremonial frame at the page
          scale. Uses preserveAspectRatio="none" + non-scaling-stroke so the
          rect tracks the viewport's aspect while keeping a uniform stroke
          weight. Inset away from the edges so safe-area chrome sits outside
          the frame, and the type lives inside it. */}
      <FrameDraw />

      {/* TOP-LEFT SIDE LABEL — eyebrow + side line + side family name. */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.8, ease: easeExpoOut }}
        className="absolute top-[calc(env(safe-area-inset-top)+1.6rem)] left-8 md:top-12 md:left-16 z-20"
      >
        <span className="text-[0.65rem] md:text-xs font-medium tracking-[0.4em] uppercase text-[var(--color-ink-700)]">
          Trân trọng kính mời
        </span>
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.0, delay: 1.2, ease: easeExpoOut }}
          style={{ originX: 0 }}
          className="mt-2 block h-px w-12 bg-[var(--color-ink-700)]"
        />
        <span className="mt-2 block text-[0.7rem] md:text-sm font-medium tracking-[0.25em] uppercase text-[var(--color-ink-900)]">
          {side.label}
        </span>
      </motion.div>

      {/* RIGHT-EDGE VERTICAL CEREMONIAL COLUMN — desktop only. Replaces the
          old top-right ceremony date block with a single vertical strip that
          reads top-to-bottom along the right side of the frame. Carries the
          solar date, the lunar year, and the traditional Vietnamese wish
          "Trăm năm hạnh phúc" (a hundred years of happiness). The column
          sits between the inner frame line and the photo edge. */}
      <motion.div
        initial={{ opacity: 0, y: -32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.0, ease: easeExpoOut }}
        className="hidden md:flex absolute top-1/2 right-8 z-20 -translate-y-1/2"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        aria-hidden="true"
      >
        <span className="text-[0.7rem] font-medium tracking-[0.5em] uppercase text-[var(--color-ink-700)] flex items-center gap-6">
          <span>{side.ceremony.solarDisplay}</span>
          <span className="block w-px h-8 bg-[var(--color-ink-500)]/55" />
          <span>{`Năm ${side.ceremony.lunar.split(" ").slice(-2).join(" ")}`}</span>
          <span className="block w-px h-8 bg-[var(--color-ink-500)]/55" />
          <span className="text-[var(--color-ink-900)]">Trăm năm hạnh phúc</span>
        </span>
      </motion.div>

      {/* Names overlay — wrapper full-width on mobile, confined to the right
          half of the section on desktop. The names land via a left-to-right
          ink-sweep clipPath (whole-name, not per-character) so Pinyon Script's
          swash glyphs and connectors stay intact. */}
      <motion.div
        style={{ y: typeY, opacity: typeOpacity }}
        className="pointer-events-none absolute bottom-0 z-10 left-0 right-0 md:left-1/2 md:right-16 px-4 md:px-0 pb-32 md:pb-32"
      >
        <h1
          className="font-script flex flex-col items-stretch"
          style={{
            color: "var(--color-ink-900)",
            textShadow: "0 1px 18px rgba(245,237,221,0.45)",
          }}
        >
          <ScriptName
            text="Gia Khôi"
            baseDelay={1.4}
            sizeClass="text-[clamp(4.5rem,15vw,9rem)] md:text-[clamp(4.5rem,7.5vw,7rem)]"
            align="self-start"
          />

          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 2.0, ease: easeExpoOut }}
            className="block self-center my-[-0.15em] text-[clamp(3rem,7vw,5rem)] md:text-[clamp(3rem,4.5vw,4rem)]"
            style={{ lineHeight: "1.0", fontFamily: "var(--font-script)" }}
          >
            &amp;
          </motion.span>

          <ScriptName
            text="Huyền Trân"
            baseDelay={2.2}
            sizeClass="text-[clamp(4rem,14vw,8.5rem)] md:text-[clamp(4rem,7vw,6.5rem)]"
            align="self-end text-right"
          />
        </h1>
      </motion.div>

      {/* Mobile-only ceremony date strip — same content as the desktop vertical
          column, laid out horizontally above the names. */}
      <motion.div
        style={{ y: typeY, opacity: typeOpacity }}
        className="md:hidden absolute inset-x-0 bottom-0 z-10 px-6 pb-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 3.0, ease: easeExpoOut }}
          className="flex items-baseline gap-3"
        >
          <span className="text-[0.65rem] font-medium tracking-[0.4em] uppercase text-[var(--color-ink-700)] whitespace-nowrap">
            {side.ceremony.solarDisplay}
          </span>
          <span className="h-px flex-1 bg-[var(--color-ink-400)]/50" />
          <span className="text-[0.65rem] font-medium tracking-[0.32em] uppercase italic text-[var(--color-ink-500)] whitespace-nowrap">
            Trăm năm hạnh phúc
          </span>
        </motion.div>
      </motion.div>

      {/* BOTTOM-LEFT YEAR MARK — Roman + lunar year. Stamps in with a slight
          scale settle so it reads as imprinted, not just faded. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 3.4, ease: easeExpoOut }}
        className="absolute bottom-[calc(env(safe-area-inset-bottom)+1.2rem)] left-8 md:bottom-12 md:left-16 z-20"
      >
        <div className="flex items-baseline gap-3 text-[0.65rem] md:text-xs font-medium tracking-[0.4em] uppercase text-[var(--color-ink-500)]">
          <span>Mmxxvi</span>
          <span className="block w-6 h-px bg-[var(--color-ink-500)]/55" />
          <span>Bính Ngọ</span>
        </div>
      </motion.div>

      {/* BOTTOM-RIGHT SCROLL CUE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 3.6, ease: easeExpoOut }}
        className="absolute bottom-[calc(env(safe-area-inset-bottom)+1.2rem)] right-8 md:bottom-12 md:right-16 z-20"
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

/* The cream cinematic frame. A single SVG rect drawn around the hero with a
   strokeDasharray/strokeDashoffset pair animated to "draw on" the perimeter
   from a single point at the top center, around the right, bottom, left, and
   back to the top. preserveAspectRatio="none" lets the unit square track the
   viewport's aspect; vectorEffect="non-scaling-stroke" keeps the cream line
   exactly 1px regardless of how the rect stretches.

   We use a path (instead of motion.rect with `pathLength`) so we can control
   the start point of the draw — the path begins at the top-center and runs
   clockwise, which feels like a curtain being raised onto stage. */
function FrameDraw() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-5 md:inset-10 z-10"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ width: "calc(100% - 2.5rem)", height: "calc(100% - 2.5rem)" }}
      >
        <rect
          x="0.5" y="0.5" width="99" height="99"
          fill="none"
          stroke="rgba(245,237,221,0.55)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }

  /* Path starts at top-center, runs to top-right, down right edge, across the
     bottom to bottom-left, back up left, finishing at top-center. Clockwise. */
  const path = "M 50 0.5 L 99.5 0.5 L 99.5 99.5 L 0.5 99.5 L 0.5 0.5 Z";

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-5 md:inset-10 z-10"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <motion.path
        d={path}
        fill="none"
        stroke="rgba(245,237,221,0.62)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 2.4, delay: 0.6, ease: easeExpoOut },
          opacity: { duration: 0.4, delay: 0.6, ease: "linear" },
        }}
      />
    </svg>
  );
}

interface ScriptNameProps {
  text: string;
  baseDelay: number;
  sizeClass: string;
  align: string;
}

/* Whole-name ink-sweep reveal. A clipPath sweeps from a 100% inset on the
   right edge to 0% over ~1.6s, layered with a fast opacity fade-in. Reads as
   if a calligrapher is laying the name onto the paper.

   Per-character variants clipped Pinyon Script's swash glyphs (the long
   underflourish on G, the descender on y, the cross-stroke between letters)
   horizontally because each character lived in an inline-block + overflow
   hidden box that ended at the character's advance width. The whole-name
   sweep keeps every connector and swash intact. The slight negative top/
   bottom inset on the clipPath gives the descenders and ascenders extra
   vertical headroom so the sweep doesn't shave them off either. */
function ScriptName({ text, baseDelay, sizeClass, align }: ScriptNameProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <span
        className={`block whitespace-nowrap ${sizeClass} ${align}`}
        style={{ lineHeight: "1.0", paddingBlock: "0.04em" }}
      >
        {text}
      </span>
    );
  }

  return (
    <motion.span
      aria-label={text}
      initial={{ clipPath: "inset(-25% 100% -25% -10%)", opacity: 0 }}
      animate={{ clipPath: "inset(-25% -10% -25% -10%)", opacity: 1 }}
      transition={{
        clipPath: { duration: 1.8, delay: baseDelay, ease: easeExpoOut },
        opacity: { duration: 0.6, delay: baseDelay, ease: "linear" },
      }}
      className={`block whitespace-nowrap ${sizeClass} ${align}`}
      style={{ lineHeight: "1.0", paddingBlock: "0.04em" }}
    >
      {text}
    </motion.span>
  );
}
