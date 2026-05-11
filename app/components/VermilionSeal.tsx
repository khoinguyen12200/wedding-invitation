import { motion, useReducedMotion } from "motion/react";
import { easeExpoOut } from "../lib/motion";

interface VermilionSealProps {
  groom: string;
  bride: string;
  /** Header phrase. "TÂN HÔN" (new wedding) is universal; "VU QUY" / "LỄ
   *  THÀNH HÔN" are also valid. */
  header?: string;
  /** Bottom date strip — already-formatted display string. */
  date?: string;
  size?: number;
}

/* Son-đỏ ceremonial seal — multi-stage choreographed entrance.

   The seal builds itself in front of the reader rather than just stamping
   in:

     1. Outer thick frame draws clockwise from the top-center (pathLength
        animation) — the "registration mark" of a real ceremonial press.
     2. A faint mid-hairline frame draws on top while (1) is still drawing.
     3. The inner medium frame draws.
     4. Four cloud-spiral corners fade in, staggered.
     5. The "TÂN HÔN" header banner reveals.
     6. The 囍 (Song Hỷ / Double Happiness) character STAMPS in — scale 0.4 →
        1.06 → 1.0 (overshoot then settle), rotation jiggle, opacity. This is
        the climactic moment.
     7. Names line and date strip settle in.
     8. Two ink-bleed haloes bloom outward, low-alpha, layered, so the seal
        reads as ink soaking into the paper.
     9. The diagonal ink-grain pattern crossfades in last so the surface
        reads as pressed paper instead of a flat vector.

   Reduced motion drops to a single 0.6s opacity fade-in for the whole
   thing — no choreography, no transforms. */
export function VermilionSeal({
  groom,
  bride,
  header = "TÂN HÔN",
  date = "02 · 08 · MMXXVI",
  size = 320,
}: VermilionSealProps) {
  const reduceMotion = useReducedMotion();

  const viewport = { once: true, amount: 0.35 };

  /* When reduced motion is on, every element shares the same simple fade so
     the choreography "compresses" to one cue. */
  const rmFade = reduceMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport, transition: { duration: 0.6 } }
    : null;

  return (
    <motion.div
      style={{ width: size, height: size }}
      className="relative inline-block"
      aria-label={`Ấn son ${groom} và ${bride}`}
    >
      {/* Ink-bleed haloes — soft vermilion fog. Bloom outward AFTER the 囍
          stamps so it reads as ink soaking into the paper.
          Two layered blurs at different scales/durations give the bleed
          depth and movement. */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, scale: 1.0 }}
        whileInView={{ opacity: reduceMotion ? 0 : 0.10, scale: reduceMotion ? 1 : 1.06 }}
        viewport={viewport}
        transition={{ duration: 0.9, delay: reduceMotion ? 0 : 1.95, ease: easeExpoOut }}
        className="absolute inset-0"
        style={{ background: "var(--color-seal)", filter: "blur(8px)" }}
      />
      <motion.span
        aria-hidden
        initial={{ opacity: 0, scale: 1.0 }}
        whileInView={{ opacity: reduceMotion ? 0 : 0.06, scale: reduceMotion ? 1 : 1.13 }}
        viewport={viewport}
        transition={{ duration: 1.2, delay: reduceMotion ? 0 : 2.15, ease: easeExpoOut }}
        className="absolute inset-0"
        style={{ background: "var(--color-seal)", filter: "blur(16px)" }}
      />

      <svg
        viewBox="0 0 240 240"
        width={size}
        height={size}
        className="relative block"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="seal-grain"
            width="3"
            height="3"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(38)"
          >
            <rect width="3" height="3" fill="var(--color-seal)" />
            <rect width="3" height="0.4" y="1.3" fill="rgba(255,255,255,0.10)" />
          </pattern>

          <symbol id="cloud-corner" viewBox="0 0 24 24">
            <path
              d="M 2 14 Q 2 8 6 6 Q 10 4 12 8 Q 14 12 18 10 Q 22 8 22 14 L 22 22 L 14 22 Q 14 18 18 18 Q 14 18 12 14 Q 10 10 6 12 Q 2 14 2 22 L 2 14 Z"
              fill="var(--color-seal)"
              opacity="0.85"
            />
            <circle cx="6" cy="18" r="1.2" fill="var(--color-seal)" opacity="0.8" />
          </symbol>
        </defs>

        {/* (1) OUTER thick frame — first stroke laid down. The pathLength
            animation strokes the perimeter on. */}
        <motion.rect
          x="4" y="4" width="232" height="232"
          fill="none"
          stroke="var(--color-seal)"
          strokeWidth="3"
          {...(rmFade ?? {
            initial: { pathLength: 0, opacity: 0.6 },
            whileInView: { pathLength: 1, opacity: 1 },
            viewport,
            transition: {
              pathLength: { duration: 1.1, delay: 0, ease: easeExpoOut },
              opacity: { duration: 0.3, delay: 0, ease: "linear" },
            },
          })}
        />

        {/* (2) MID hairline frame — drawn while the outer is still being
            laid down, so the two feel like a single confident gesture. */}
        <motion.rect
          x="13" y="13" width="214" height="214"
          fill="none"
          stroke="var(--color-seal)"
          strokeWidth="0.5"
          opacity="0.55"
          {...(rmFade ?? {
            initial: { pathLength: 0 },
            whileInView: { pathLength: 1 },
            viewport,
            transition: { duration: 0.9, delay: 0.4, ease: easeExpoOut },
          })}
        />

        {/* (3) INNER medium frame — the "page" frame, where the header banner
            and date strip will break out from. */}
        <motion.rect
          x="22" y="22" width="196" height="196"
          fill="none"
          stroke="var(--color-seal)"
          strokeWidth="1.4"
          {...(rmFade ?? {
            initial: { pathLength: 0 },
            whileInView: { pathLength: 1 },
            viewport,
            transition: { duration: 0.9, delay: 0.7, ease: easeExpoOut },
          })}
        />

        {/* (4) CLOUD-SPIRAL CORNERS — staggered fade. Outer wrapping `<g>`
            holds the static rotation so each corner faces the seal's
            interior; inner motion.use carries the entrance. */}
        <CloudCorner x={26} y={26} delay={1.15} viewport={viewport} reduceMotion={reduceMotion} />
        <g transform="rotate(90 203 37)">
          <CloudCorner x={192} y={26} delay={1.23} viewport={viewport} reduceMotion={reduceMotion} />
        </g>
        <g transform="rotate(180 203 203)">
          <CloudCorner x={192} y={192} delay={1.31} viewport={viewport} reduceMotion={reduceMotion} />
        </g>
        <g transform="rotate(270 37 203)">
          <CloudCorner x={26} y={192} delay={1.39} viewport={viewport} reduceMotion={reduceMotion} />
        </g>

        {/* (5) HEADER BANNER — paper-colored rect that masks the inner frame
            so the eyebrow rules read as if the header is carved out. The
            white rect, side rules, and "TÂN HÔN" text all reveal together. */}
        <motion.g
          {...(rmFade ?? {
            initial: { opacity: 0 },
            whileInView: { opacity: 1 },
            viewport,
            transition: { duration: 0.5, delay: 1.55, ease: easeExpoOut },
          })}
        >
          <rect x="80" y="34" width="80" height="20" fill="var(--color-paper-50)" />
          <line x1="56" y1="44" x2="80" y2="44" stroke="var(--color-seal)" strokeWidth="0.6" opacity="0.65" />
          <line x1="160" y1="44" x2="184" y2="44" stroke="var(--color-seal)" strokeWidth="0.6" opacity="0.65" />
          <text
            x="120" y="49"
            textAnchor="middle"
            fontFamily="'Be Vietnam Pro', sans-serif"
            fontWeight="900"
            fontSize="11"
            letterSpacing="4"
            fill="var(--color-seal)"
          >
            {header.toUpperCase()}
          </text>
        </motion.g>

        {/* (6) THE 囍 STAMP — climactic moment. Scale keyframes give an
            overshoot-and-settle. The faint backing circle fades in slightly
            ahead so the character stamps onto a clear field. */}
        <motion.circle
          cx="120" cy="120" r="44"
          fill="var(--color-paper-50)"
          opacity="0.92"
          {...(rmFade ?? {
            initial: { opacity: 0 },
            whileInView: { opacity: 0.92 },
            viewport,
            transition: { duration: 0.4, delay: 1.7, ease: easeExpoOut },
          })}
        />
        <motion.text
          x="120" y="142"
          textAnchor="middle"
          fontFamily="'Songti SC', 'STSong', 'SimSun', 'Noto Serif CJK SC', 'Noto Serif TC', serif"
          fontWeight="400"
          fontSize="76"
          fill="var(--color-seal)"
          style={{
            fontFeatureSettings: "'palt' 1",
            transformOrigin: "120px 120px",
            transformBox: "view-box",
          }}
          {...(rmFade ?? {
            initial: { opacity: 0, scale: 0.4, rotate: -6 },
            whileInView: { opacity: 1, scale: [0.4, 1.06, 1], rotate: [-6, 1.2, 0] },
            viewport,
            transition: {
              opacity: { duration: 0.4, delay: 1.85, ease: easeExpoOut },
              scale: { duration: 0.7, delay: 1.85, times: [0, 0.65, 1], ease: easeExpoOut },
              rotate: { duration: 0.7, delay: 1.85, times: [0, 0.65, 1], ease: easeExpoOut },
            },
          })}
        >
          囍
        </motion.text>

        {/* (7) NAMES — settle in after the stamp. */}
        <motion.text
          x="120" y="182"
          textAnchor="middle"
          fontFamily="'Be Vietnam Pro', sans-serif"
          fontWeight="700"
          fontSize="10"
          letterSpacing="3.2"
          fill="var(--color-seal)"
          {...(rmFade ?? {
            initial: { opacity: 0 },
            whileInView: { opacity: 1 },
            viewport,
            transition: { duration: 0.5, delay: 2.45, ease: easeExpoOut },
          })}
        >
          {`${groom.toUpperCase()}  ·  ${bride.toUpperCase()}`}
        </motion.text>

        {/* (8) DATE STRIP — paper rect breaks out of the inner frame; date
            text rests in it. Both fade in just after the names. */}
        <motion.g
          {...(rmFade ?? {
            initial: { opacity: 0 },
            whileInView: { opacity: 1 },
            viewport,
            transition: { duration: 0.5, delay: 2.65, ease: easeExpoOut },
          })}
        >
          <rect x="80" y="196" width="80" height="20" fill="var(--color-paper-50)" />
          <text
            x="120" y="211"
            textAnchor="middle"
            fontFamily="'Be Vietnam Pro', sans-serif"
            fontWeight="500"
            fontSize="7.6"
            letterSpacing="3"
            fill="var(--color-seal)"
            opacity="0.85"
          >
            {date}
          </text>
        </motion.g>

        {/* (9) INK GRAIN — multiplied over the whole inner field. Crossfades
            in last so the seal lands as a pressed-paper artifact instead of
            a flat vector. */}
        <motion.rect
          x="13" y="13" width="214" height="214"
          fill="url(#seal-grain)"
          opacity="0.16"
          style={{ mixBlendMode: "multiply" }}
          {...(rmFade ?? {
            initial: { opacity: 0 },
            whileInView: { opacity: 0.16 },
            viewport,
            transition: { duration: 1.0, delay: 2.5, ease: easeExpoOut },
          })}
        />
      </svg>
    </motion.div>
  );
}

/* One stagger-fading cloud-spiral corner. Pure opacity; no scale, so we don't
   need to worry about transform-origin compositing on SVG `<use>`. */
function CloudCorner({
  x,
  y,
  delay,
  viewport,
  reduceMotion,
}: {
  x: number;
  y: number;
  delay: number;
  viewport: { once: boolean; amount: number };
  reduceMotion: boolean | null;
}) {
  if (reduceMotion) {
    return (
      <motion.use
        href="#cloud-corner"
        x={x} y={y} width="22" height="22"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewport}
        transition={{ duration: 0.6 }}
      />
    );
  }
  return (
    <motion.use
      href="#cloud-corner"
      x={x} y={y} width="22" height="22"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={viewport}
      transition={{ duration: 0.45, delay, ease: easeExpoOut }}
    />
  );
}
