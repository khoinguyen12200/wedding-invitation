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
}

/* The two auspicious couplets that flank the 囍 stamp.
   Left:  永 結 同 心  — eternal bond, one heart
   Right: 百 年 好 合  — hundred years of harmony
   Both are canonical 4-character wedding phrases used on traditional
   thiệp hồng and red Chinese wedding cards. */
const LEFT_COUPLET = ["永", "結", "同", "心"] as const;
const RIGHT_COUPLET = ["百", "年", "好", "合"] as const;

/* Drifting plum-blossom petals. Each row is a self-contained loop: petal
   appears off-screen, drifts diagonally across the card, rotates, fades
   out. Different delays/durations/paths make them feel natural rather
   than choreographed. */
const PETALS = [
  { delay: 3.0,  duration: 14, x: [40, 180, 320, 460, 580], y: [20, 80, 150, 220, 290], rot: [0, 180, 360, 540, 720] },
  { delay: 5.5,  duration: 16, x: [580, 440, 300, 160, 20], y: [40, 110, 180, 250, 310], rot: [0, -210, -420, -630, -840] },
  { delay: 8.0,  duration: 13, x: [120, 220, 320, 420, 540], y: [-10, 60, 140, 210, 280], rot: [0, 160, 320, 480, 640] },
  { delay: 10.5, duration: 18, x: [500, 380, 260, 140, 40],  y: [-10, 80, 160, 230, 300], rot: [0, -180, -360, -540, -720] },
  { delay: 13.0, duration: 15, x: [60, 200, 340, 480, 560],  y: [50, 120, 190, 250, 310], rot: [0, 200, 400, 600, 800] },
] as const;

/* Son-đỏ ceremonial card — traditional thiệp hồng in 2:1 landscape.

   The card lays out as a long horizontal frame, the way a real folded
   thiệp hồng reads when opened. The 囍 (Song Hỷ / Double Happiness) seal
   anchors the left like an ấn son pressed onto the page; the names sit
   on the right; "TÂN HÔN" tops the card and the date strip closes it
   at the bottom. Two vertical couplets flank the 囍 from the outer
   margins, and a 回紋 (meander) fretwork band runs above and below the
   central content — both unmistakably traditional Chinese wedding-card
   ornaments.

   Choreographed entrance:
     1-3. Three concentric frames draw clockwise from the top-center.
     4. Four cloud-spiral corners fade in, staggered.
     5. Fretwork bands fade in along the top and bottom.
     6. Header banner "TÂN HÔN" reveals.
     7. The 囍 STAMPS in with overshoot — climactic moment.
     8. Couplet characters draw in one-by-one like calligraphy strokes.
     9. Names line settles in beside the stamp.
     10. Date strip settles in.
     11. Ink-bleed haloes bloom outward, low-alpha, layered.
     12. Diagonal ink-grain crossfades in last.

   Idle motion (after the entrance lands):
     - 囍 breathes with a subtle scale 1.0 ↔ 1.015 loop.
     - Five plum-blossom petals drift across the card on independent paths.

   Reduced motion compresses the entire sequence to a single 0.6s
   opacity fade-in. No transforms, no loops, no drifting petals. */
export function VermilionSeal({
  groom,
  bride,
  header = "TÂN HÔN",
  date = "02 · 08 · MMXXVI",
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
      className="relative block w-full aspect-[2/1]"
      aria-label={`Ấn son ${groom} và ${bride}`}
    >
      {/* Ink-bleed haloes — soft vermilion fog filling the card outline. */}
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
        viewBox="0 0 600 300"
        className="relative block w-full h-full"
        preserveAspectRatio="xMidYMid meet"
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

          {/* 回紋 — Chinese meander / nested-square fretwork. Tiles
              horizontally at 14×14, two concentric squares per tile. The
              tile size and stroke weight are tuned so the band reads as
              an ornamental hairline rather than a thick decorative bar. */}
          <pattern
            id="seal-meander"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <rect
              x="1.5" y="1.5" width="11" height="11"
              fill="none"
              stroke="var(--color-seal)"
              strokeWidth="0.65"
              opacity="0.7"
            />
            <rect
              x="4.5" y="4.5" width="5" height="5"
              fill="none"
              stroke="var(--color-seal)"
              strokeWidth="0.65"
              opacity="0.7"
            />
          </pattern>

          <symbol id="cloud-corner" viewBox="0 0 24 24">
            <path
              d="M 2 14 Q 2 8 6 6 Q 10 4 12 8 Q 14 12 18 10 Q 22 8 22 14 L 22 22 L 14 22 Q 14 18 18 18 Q 14 18 12 14 Q 10 10 6 12 Q 2 14 2 22 L 2 14 Z"
              fill="var(--color-seal)"
              opacity="0.85"
            />
            <circle cx="6" cy="18" r="1.2" fill="var(--color-seal)" opacity="0.8" />
          </symbol>

          {/* Plum-blossom petal — single teardrop. The 5-petal blossom is
              authentic to traditional wedding cards, but at this scale a
              single petal reads more naturally as a drifting fragment. */}
          <symbol id="petal" viewBox="-6 0 12 14" overflow="visible">
            <path
              d="M 0 0 Q 5 5 0 13 Q -5 5 0 0 Z"
              fill="var(--color-seal)"
            />
          </symbol>
        </defs>

        {/* (1) OUTER thick frame — first stroke laid down. */}
        <motion.rect
          x="4" y="4" width="592" height="292"
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

        {/* (2) MID hairline frame */}
        <motion.rect
          x="13" y="13" width="574" height="274"
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

        {/* (3) INNER medium frame */}
        <motion.rect
          x="44" y="42" width="512" height="216"
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

        {/* (4) CLOUD-SPIRAL CORNERS — staggered fade, facing the seal's
            interior. */}
        <CloudCorner x={48} y={46} delay={1.15} viewport={viewport} reduceMotion={reduceMotion} />
        <g transform="rotate(90 539 57)">
          <CloudCorner x={528} y={46} delay={1.23} viewport={viewport} reduceMotion={reduceMotion} />
        </g>
        <g transform="rotate(180 539 243)">
          <CloudCorner x={528} y={232} delay={1.31} viewport={viewport} reduceMotion={reduceMotion} />
        </g>
        <g transform="rotate(270 59 243)">
          <CloudCorner x={48} y={232} delay={1.39} viewport={viewport} reduceMotion={reduceMotion} />
        </g>

        {/* (5) FRETWORK BANDS — 回紋 meander hairlines running above and
            below the central content. Drawn before the header banner so
            the banner's paper-50 rect masks the meander at its center,
            creating the traditional "header breaks out of the band" feel.
            Same for the date strip at the bottom. */}
        <motion.rect
          x="72" y="50" width="456" height="14"
          fill="url(#seal-meander)"
          {...(rmFade ?? {
            initial: { opacity: 0 },
            whileInView: { opacity: 1 },
            viewport,
            transition: { duration: 0.7, delay: 1.45, ease: easeExpoOut },
          })}
        />
        <motion.rect
          x="72" y="236" width="456" height="14"
          fill="url(#seal-meander)"
          {...(rmFade ?? {
            initial: { opacity: 0 },
            whileInView: { opacity: 1 },
            viewport,
            transition: { duration: 0.7, delay: 1.5, ease: easeExpoOut },
          })}
        />

        {/* (6) HEADER BANNER — TÂN HÔN at top center. The paper-50 rect
            masks the fretwork beneath, so the banner reads as carved out
            of the meander band. */}
        <motion.g
          {...(rmFade ?? {
            initial: { opacity: 0 },
            whileInView: { opacity: 1 },
            viewport,
            transition: { duration: 0.5, delay: 1.7, ease: easeExpoOut },
          })}
        >
          <rect x="240" y="46" width="120" height="22" fill="var(--color-paper-50)" />
          <line x1="200" y1="57" x2="240" y2="57" stroke="var(--color-seal)" strokeWidth="0.6" opacity="0.65" />
          <line x1="360" y1="57" x2="400" y2="57" stroke="var(--color-seal)" strokeWidth="0.6" opacity="0.65" />
          <text
            x="300" y="62"
            textAnchor="middle"
            fontFamily="'Be Vietnam Pro', sans-serif"
            fontWeight="900"
            fontSize="12"
            letterSpacing="4.5"
            fill="var(--color-seal)"
          >
            {header.toUpperCase()}
          </text>
        </motion.g>

        {/* (7) VERTICAL COUPLETS — two auspicious 4-character phrases as
            calligraphic pillars in the side margins. Each character draws
            in sequentially, staggered, after the header reveals.
            Left:  永 結 同 心 (eternal bond, one heart)
            Right: 百 年 好 合 (hundred years of harmony) */}
        {LEFT_COUPLET.map((char, i) => (
          <CoupletChar
            key={`l-${i}`}
            char={char}
            x={28}
            y={90 + i * 44}
            delay={1.9 + i * 0.12}
            viewport={viewport}
            reduceMotion={reduceMotion}
            rmFade={rmFade}
          />
        ))}
        {RIGHT_COUPLET.map((char, i) => (
          <CoupletChar
            key={`r-${i}`}
            char={char}
            x={572}
            y={90 + i * 44}
            delay={1.96 + i * 0.12}
            viewport={viewport}
            reduceMotion={reduceMotion}
            rmFade={rmFade}
          />
        ))}

        {/* (8) THE 囍 STAMP — climactic moment. Backing circle fades in
            slightly ahead so the character lands on a clear field. After
            the stamp settles, the wrapping group breathes with a subtle
            infinite scale loop. */}
        <motion.g
          style={{
            transformOrigin: "180px 152px",
            transformBox: "view-box",
          }}
          {...(reduceMotion
            ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport, transition: { duration: 0.6 } }
            : {
                initial: { scale: 1 },
                animate: { scale: [1, 1.015, 1] },
                transition: {
                  scale: {
                    duration: 3.6,
                    delay: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                },
              })}
        >
          <motion.circle
            cx="180" cy="152" r="50"
            fill="var(--color-paper-50)"
            opacity="0.92"
            {...(rmFade ?? {
              initial: { opacity: 0 },
              whileInView: { opacity: 0.92 },
              viewport,
              transition: { duration: 0.4, delay: 1.85, ease: easeExpoOut },
            })}
          />
          <motion.text
            x="180" y="178"
            textAnchor="middle"
            fontFamily="'Songti SC', 'STSong', 'SimSun', 'Noto Serif CJK SC', 'Noto Serif TC', serif"
            fontWeight="400"
            fontSize="86"
            fill="var(--color-seal)"
            style={{
              fontFeatureSettings: "'palt' 1",
              transformOrigin: "180px 152px",
              transformBox: "view-box",
            }}
            {...(rmFade ?? {
              initial: { opacity: 0, scale: 0.4, rotate: -6 },
              whileInView: { opacity: 1, scale: [0.4, 1.06, 1], rotate: [-6, 1.2, 0] },
              viewport,
              transition: {
                opacity: { duration: 0.4, delay: 2.0, ease: easeExpoOut },
                scale: { duration: 0.7, delay: 2.0, times: [0, 0.65, 1], ease: easeExpoOut },
                rotate: { duration: 0.7, delay: 2.0, times: [0, 0.65, 1], ease: easeExpoOut },
              },
            })}
          >
            囍
          </motion.text>
        </motion.g>

        {/* (9) NAMES — single line on the right of the stamp, vertically
            centered to the 囍. */}
        <motion.text
          x="395" y="158"
          textAnchor="middle"
          fontFamily="'Be Vietnam Pro', sans-serif"
          fontWeight="700"
          fontSize="13"
          letterSpacing="3"
          fill="var(--color-seal)"
          {...(rmFade ?? {
            initial: { opacity: 0 },
            whileInView: { opacity: 1 },
            viewport,
            transition: { duration: 0.5, delay: 2.7, ease: easeExpoOut },
          })}
        >
          {`${groom.toUpperCase()}  ·  ${bride.toUpperCase()}`}
        </motion.text>

        {/* (10) DATE STRIP — breaks out of the bottom fretwork band. */}
        <motion.g
          {...(rmFade ?? {
            initial: { opacity: 0 },
            whileInView: { opacity: 1 },
            viewport,
            transition: { duration: 0.5, delay: 2.9, ease: easeExpoOut },
          })}
        >
          <rect x="240" y="232" width="120" height="22" fill="var(--color-paper-50)" />
          <text
            x="300" y="247"
            textAnchor="middle"
            fontFamily="'Be Vietnam Pro', sans-serif"
            fontWeight="500"
            fontSize="8"
            letterSpacing="2.2"
            fill="var(--color-seal)"
            opacity="0.85"
          >
            {date}
          </text>
        </motion.g>

        {/* (11) DRIFTING PETALS — idle ambient motion. Five plum-blossom
            fragments loop on independent paths so the card feels alive
            without ever pulling the eye away from the names. Suppressed
            entirely under reduced-motion. */}
        {!reduceMotion && PETALS.map((petal, i) => (
          <DriftingPetal key={`petal-${i}`} {...petal} />
        ))}

        {/* (12) INK GRAIN — multiplied over the whole inner field, crossfades
            in last so the seal lands as a pressed-paper artifact. */}
        <motion.rect
          x="13" y="13" width="574" height="274"
          fill="url(#seal-grain)"
          opacity="0.16"
          style={{ mixBlendMode: "multiply" }}
          {...(rmFade ?? {
            initial: { opacity: 0 },
            whileInView: { opacity: 0.16 },
            viewport,
            transition: { duration: 1.0, delay: 2.8, ease: easeExpoOut },
          })}
        />
      </svg>
    </motion.div>
  );
}

/* One stagger-fading cloud-spiral corner. */
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

/* Single couplet character that fades + slides in from slightly above its
   final position — feels like a brush stroke landing. */
function CoupletChar({
  char,
  x,
  y,
  delay,
  viewport,
  reduceMotion,
  rmFade,
}: {
  char: string;
  x: number;
  y: number;
  delay: number;
  viewport: { once: boolean; amount: number };
  reduceMotion: boolean | null;
  rmFade: object | null;
}) {
  return (
    <motion.text
      x={x} y={y}
      textAnchor="middle"
      fontFamily="'Songti SC', 'STSong', 'SimSun', 'Noto Serif CJK SC', 'Noto Serif TC', serif"
      fontWeight="500"
      fontSize="18"
      fill="var(--color-seal)"
      opacity="0.88"
      style={{ fontFeatureSettings: "'palt' 1" }}
      {...(rmFade ?? {
        initial: { opacity: 0, y: y - 6 },
        whileInView: { opacity: 0.88, y },
        viewport,
        transition: { duration: 0.55, delay, ease: easeExpoOut },
      })}
    >
      {char}
    </motion.text>
  );
}

/* One drifting plum-blossom petal. Each instance runs its own infinite
   loop with the path baked in as keyframe arrays. */
function DriftingPetal({
  delay,
  duration,
  x,
  y,
  rot,
}: {
  delay: number;
  duration: number;
  x: readonly number[];
  y: readonly number[];
  rot: readonly number[];
}) {
  return (
    <motion.use
      href="#petal"
      width="12"
      height="14"
      opacity={0.28}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
      initial={{ x: x[0], y: y[0], rotate: rot[0], opacity: 0 }}
      animate={{
        x: [...x],
        y: [...y],
        rotate: [...rot],
        opacity: [0, 0.28, 0.32, 0.28, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: "linear",
      }}
    />
  );
}
