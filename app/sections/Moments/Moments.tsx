import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";

interface Scene {
  base: string;
  alt: string;
  /** Vietnamese chapter title — short, one breath. */
  title: string;
  /** Sub-line, italic, very quiet. */
  caption: string;
  /** Where the type sits in the frame. */
  anchor: "bl" | "br" | "tl" | "tr" | "center";
  /** Object-position for the photo, fine-tuned per shot so faces don't get clipped. */
  focal: string;
}

/* The five scenes follow a deliberate narrative arc — not a list of pretty
   words. Each title/caption is tied to what the photo actually shows:
     1. The first look (the couple sees each other)
     2. The quiet between them (closeness without words)
     3. Walking the path together (companionship as a choice)
     4. The wedding season (now, this summer)
     5. The invitation extended (to the guests reading this)
   Vietnamese register is formal — no "bạn" — so the closing scene addresses
   "quý quan khách" (honored guests) the way a printed wedding invitation
   would. */
const scenes: Scene[] = [
  {
    base: "ld3_0327",
    alt: "Hai chúng tôi nhìn nhau, ảnh studio.",
    title: "Gặp nhau",
    caption: "Một ánh mắt đầu tiên, một đời ghi nhớ.",
    anchor: "bl",
    focal: "50% 35%",
  },
  {
    base: "hero-portrait",
    alt: "Hai chúng tôi trán chạm trán, ảnh studio.",
    title: "Bên nhau",
    caption: "Trán chạm trán, lặng yên mà nói trăm điều.",
    anchor: "br",
    focal: "50% 30%",
  },
  {
    base: "ld3_0608",
    alt: "Hai chúng tôi đứng cạnh nhau dưới ánh sáng dịu.",
    title: "Đồng hành",
    caption: "Hai người, một con đường, một hướng đi về.",
    anchor: "tl",
    focal: "50% 25%",
  },
  {
    base: "ld3_0266",
    alt: "Cô dâu nhìn xuống bó hoa cưới.",
    title: "Mùa hoa",
    caption: "Hè năm Bính Ngọ, hoa nở đúng hẹn cho ngày trọng đại.",
    anchor: "center",
    focal: "55% 40%",
  },
  {
    base: "hero-landscape",
    alt: "Hai chúng tôi sát bên nhau, khung cảnh ngang.",
    title: "Lời mời",
    caption: "Trân trọng kính mời quý quan khách đến chung vui.",
    anchor: "br",
    focal: "55% 30%",
  },
];

/* The Cinema — letterbox edition.

   The section is `(N + 0.6) × 100vh` tall (a little less than before so the
   pin doesn't overstay). An inner sticky container holds:

     - a top letterbox bar with a thin progress line, chapter dots, and the
       active scene number,
     - the photo viewport in the middle (bounded, not full-bleed, so it
       doesn't feel like the image is overwhelming the screen),
     - a bottom letterbox bar with the section title, a 03/05 counter, and a
       persistent "↓ tiếp tục" scroll cue that flips to a "↓ tiếp theo" exit
       hint on the last scene.

   Letterboxing also gives a place for chrome that doesn't obstruct the
   photos; previously the eyebrow / counter / side slate were fighting the
   image.

   Reduced motion (and small viewports if we later wire it) drops to a static
   vertical stack of photos. */
export function Moments() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  if (reduceMotion) {
    return <MomentsStatic />;
  }

  return (
    <section
      ref={ref}
      aria-label="Khoảnh khắc"
      className="relative w-full"
      style={{
        height: `${scenes.length * 100 + 60}vh`,
        background: "var(--color-ink-950)",
      }}
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[var(--color-ink-950)]">
        {/* TOP LETTERBOX BAR */}
        <TopBar progress={scrollYProgress} total={scenes.length} />

        {/* PHOTO STAGE — bounded by the letterbox bars top and bottom. */}
        <div
          className="absolute left-0 right-0 overflow-hidden"
          style={{
            top: "var(--bar-h)",
            bottom: "var(--bar-h)",
          }}
        >
          {scenes.map((scene, i) => (
            <SceneFrame
              key={scene.base}
              scene={scene}
              index={i}
              progress={scrollYProgress}
              total={scenes.length}
            />
          ))}
        </div>

        {/* BOTTOM LETTERBOX BAR */}
        <BottomBar progress={scrollYProgress} total={scenes.length} />
      </div>

      <style>{`
        :where(section[aria-label="Khoảnh khắc"]) {
          --bar-h: 9vh;
        }
        @media (min-width: 768px) {
          :where(section[aria-label="Khoảnh khắc"]) {
            --bar-h: 11vh;
          }
        }
      `}</style>
    </section>
  );
}

interface SceneFrameProps {
  scene: Scene;
  index: number;
  progress: MotionValue<number>;
  total: number;
}

function SceneFrame({ scene, index, progress, total }: SceneFrameProps) {
  const slice = 1 / total;
  const start = index * slice;
  const end = (index + 1) * slice;

  /* TRUE OVERLAPPING CROSSFADE.

     Previously each scene's fade-out happened over the last 20% of its slice
     and the next scene's fade-in happened over the first 20% of *its* slice.
     The two ranges were back-to-back, not overlapping, so the transition was
     a hard sequence of fade-out then fade-in with a near-blank moment
     between. Net effect: middle scenes were only fully visible for ~12% of
     section scroll, while first/last got ~16% — middle scenes flashed by.

     Now the crossfade is a single window centered on the boundary between
     scenes. Both adjacent scenes share that window: as scene N fades 1→0,
     scene N+1 fades 0→1 over the SAME range. With a 3% crossfade, every
     scene gets ~17% of the section as solo time — equal viewing for each. */
  const c = 0.03;
  const halfC = c / 2;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  /* Input range markers, clamped to [0, 1] so Motion's WAAPI optimizer doesn't
     reject them. First scene starts at full opacity (no fade-in from black);
     last scene stays at full opacity through the section's tail. */
  const fadeInStart = Math.max(0, start - halfC);
  const fadeInEnd = isFirst ? 0 : Math.max(0, start + halfC);
  const fadeOutStart = isLast ? 1 : Math.min(1, end - halfC);
  const fadeOutEnd = Math.min(1, end + halfC);

  const opacity = useTransform(
    progress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [
      isFirst ? 1 : 0,
      1,
      1,
      isLast ? 1 : 0,
    ]
  );

  /* Gentler Ken Burns now that the photo is letterboxed — subtle pan, no
     aggressive zoom. */
  const scale = useTransform(progress, [start, end], [1.02, 1.06]);
  const photoY = useTransform(progress, [start, end], ["0%", "-2%"]);

  /* Caption fades in 0.01 progress AFTER the scene becomes solo and fades
     out aligned with the scene. The small delay lets the title land first,
     so the caption reads as a follow-up beat rather than competing with the
     headline. */
  const captionFadeInStart = isFirst ? 0 : Math.max(0, start + halfC);
  const captionFadeInEnd = Math.min(1, captionFadeInStart + 0.015);
  const captionOpacity = useTransform(
    progress,
    [captionFadeInStart, captionFadeInEnd, fadeOutStart, fadeOutEnd],
    [0, 1, 1, isLast ? 1 : 0]
  );

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0"
      aria-hidden={index !== 0 ? "true" : undefined}
    >
      {/* Stage — true cinema black, photo centered inside. The photo is
          object-contain so its native aspect is preserved end-to-end. On
          desktop a 4:5 portrait shows with vertical pillarbox (extra black
          on the sides), on mobile a portrait photo nearly fills the screen.
          This was previously object-cover which forced 1280w sources to
          upscale past native resolution and clipped a huge fraction of each
          shot. */}
      <motion.div
        style={{ scale, y: photoY }}
        className="absolute inset-0 flex items-center justify-center px-4 md:px-12 py-4 md:py-6"
      >
        <picture className="block max-w-full max-h-full">
          <source
            srcSet={`/photos/${scene.base}-640.jpg 640w, /photos/${scene.base}-1280.jpg 1280w, /photos/${scene.base}-1920.jpg 1920w`}
            sizes="(min-width: 1280px) 70vw, (min-width: 768px) 86vw, 96vw"
          />
          <img
            src={`/photos/${scene.base}-1280.jpg`}
            alt={scene.alt}
            className="block max-w-full max-h-[78vh] md:max-h-[78vh] w-auto h-auto"
            decoding="async"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </picture>
        <SceneScrim anchor={scene.anchor} />
      </motion.div>

      <SceneType scene={scene} captionOpacity={captionOpacity} />
    </motion.div>
  );
}

function SceneScrim({ anchor }: { anchor: Scene["anchor"] }) {
  const direction =
    anchor === "bl" ? "to top right" :
    anchor === "br" ? "to top left" :
    anchor === "tl" ? "to bottom right" :
    anchor === "tr" ? "to bottom left" :
                       "to bottom";
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background: `linear-gradient(${direction}, rgba(20,15,10,0.62) 0%, rgba(20,15,10,0.20) 38%, rgba(20,15,10,0) 60%)`,
      }}
    />
  );
}

interface SceneTypeProps {
  scene: Scene;
  captionOpacity: MotionValue<number>;
}

/* The title wrapper used to be a `motion.div` with a small scroll-tied
   `y: titleY` translate (12→-8px across the scene). That promoted the
   wrapper to a compositor layer; once on the compositor the browser
   rasterizes text once and transforms the bitmap, so the fractional pixel
   values from the scroll-linked motion value rendered the title noticeably
   soft on regular-DPI screens. The breathing animation was barely visible to
   begin with — we drop it for a static plain `<div>` so the type stays
   crisp. The caption keeps its scroll-tied opacity (opacity doesn't trigger
   the same rasterize-then-transform path). */
function SceneType({ scene, captionOpacity }: SceneTypeProps) {
  const positionClass =
    scene.anchor === "bl" ? "bottom-6 left-5 md:bottom-12 md:left-14 items-start text-left" :
    scene.anchor === "br" ? "bottom-6 right-5 md:bottom-12 md:right-14 items-end text-right" :
    scene.anchor === "tl" ? "top-6 left-5 md:top-12 md:left-14 items-start text-left" :
    scene.anchor === "tr" ? "top-6 right-5 md:top-12 md:right-14 items-end text-right" :
                            "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center text-center";

  return (
    <div
      className={`absolute z-20 flex flex-col gap-3 max-w-[78vw] md:max-w-[36rem] ${positionClass}`}
    >
      <h3
        className="font-luxury text-[var(--color-paper-50)]"
        style={{
          fontSize: "clamp(2.25rem, 1.4rem + 4.5vw, 4.75rem)",
          lineHeight: "1.0",
          paddingBlock: "0.06em",
          textWrap: "balance",
        }}
      >
        {scene.title}
      </h3>
      <motion.p
        style={{ opacity: captionOpacity }}
        className="font-italic-light text-[var(--color-paper-50)]/85 text-[0.95rem] md:text-[1.0625rem] leading-[1.6] max-w-[34ch]"
      >
        {scene.caption}
      </motion.p>
    </div>
  );
}

/* TOP LETTERBOX BAR
   Houses the progress line, chapter dots, and the active scene number.
   Black bar fixed-height (--bar-h). */
function TopBar({ progress, total }: { progress: MotionValue<number>; total: number }) {
  const fillWidth = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div
      className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 md:px-12"
      style={{ height: "var(--bar-h)", background: "var(--color-ink-950)" }}
    >
      {/* Left: section eyebrow */}
      <span className="text-[0.6rem] md:text-[0.7rem] font-medium tracking-[0.4em] uppercase text-[var(--color-paper-50)]/65">
        Khoảnh khắc · Của chúng tôi
      </span>

      {/* Center: chapter dots */}
      <div className="flex items-center gap-2 md:gap-3">
        {Array.from({ length: total }).map((_, i) => (
          <ChapterDot key={i} progress={progress} index={i} total={total} />
        ))}
      </div>

      {/* Right: active scene number */}
      <SceneIndex progress={progress} total={total} />

      {/* Bottom-edge progress line — anchored to the bottom of the top bar
          so it visually separates bar from photo and doubles as a scrubber. */}
      <motion.span
        aria-hidden
        className="absolute left-0 bottom-0 h-px bg-[var(--color-paper-50)]"
        style={{ width: fillWidth }}
      />
      <span aria-hidden className="absolute left-0 right-0 bottom-0 h-px bg-[var(--color-paper-50)]/12" />
    </div>
  );
}

function ChapterDot({ progress, index, total }: { progress: MotionValue<number>; index: number; total: number }) {
  /* A dot is "active" when the scroll progress is inside its slice. We use a
     transform so opacity tracks an analog blend between adjacent slices for
     a softer handoff.

     Critical: Motion's scroll-linked optimizer can promote these `useTransform`
     calls to WAAPI animations using the *input range as keyframe offsets*.
     WAAPI rejects offsets outside [0, 1] with "Offsets must be null or in the
     range [0,1]." — so the first and last dots (whose natural ranges extend
     to -slice and 1+slice) need to be clamped before they reach Motion. */
  const slice = 1 / total;
  const center = (index + 0.5) * slice;
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const opacityInput = [
    clamp(center - slice),
    clamp(center - slice * 0.5),
    center,
    clamp(center + slice * 0.5),
    clamp(center + slice),
  ];
  const widthInput = [
    clamp(center - slice * 0.5),
    center,
    clamp(center + slice * 0.5),
  ];
  const opacity = useTransform(progress, opacityInput, [0.30, 0.55, 1, 0.55, 0.30]);
  const width = useTransform(progress, widthInput, [12, 24, 12]);
  return (
    <motion.span
      aria-hidden
      style={{ opacity, width }}
      className="block h-px bg-[var(--color-paper-50)]"
    />
  );
}

function SceneIndex({ progress, total }: { progress: MotionValue<number>; total: number }) {
  const current = useTransform(progress, (p) => {
    const idx = Math.min(total - 1, Math.max(0, Math.floor(p * total)));
    return String(idx + 1).padStart(2, "0");
  });
  return (
    <div className="flex items-baseline gap-1 text-[var(--color-paper-50)]/85 font-medium tabular-nums">
      <motion.span className="text-[0.7rem] md:text-xs tracking-[0.3em] uppercase">
        Cảnh{" "}
      </motion.span>
      <motion.span className="text-[0.85rem] md:text-sm tracking-[0.2em]">{current}</motion.span>
    </div>
  );
}

/* BOTTOM LETTERBOX BAR
   Houses the chapter counter and a clear scroll cue. The cue text swaps from
   "Cuộn để xem" → "Tiếp theo" on the last frame so users know the section is
   about to release. */
function BottomBar({ progress, total }: { progress: MotionValue<number>; total: number }) {
  const totalLabel = String(total).padStart(2, "0");
  const current = useTransform(progress, (p) => {
    const idx = Math.min(total - 1, Math.max(0, Math.floor(p * total)));
    return String(idx + 1).padStart(2, "0");
  });

  /* Swap "Cuộn để xem" for "Tiếp theo" once the user is in the final 1.5
     scenes worth of scroll. The string is derived imperatively rather than as
     a MotionValue<string> because rendering a string-valued MotionValue
     directly trips Motion's TS overload (its child types only cover number /
     string MotionValues for known transform properties). */
  const exitThreshold = (total - 1.5) / total;
  const [cueText, setCueText] = useState("Cuộn để xem");
  useMotionValueEvent(progress, "change", (p) => {
    setCueText(p >= exitThreshold ? "Tiếp theo" : "Cuộn để xem");
  });

  /* Gentle pulsing cue arrow on the first 80% of the section, becoming a
     steady arrow toward the end. We just animate y of the arrow with CSS. */
  return (
    <div
      className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between px-5 md:px-12"
      style={{ height: "var(--bar-h)", background: "var(--color-ink-950)" }}
    >
      {/* Left: counter */}
      <div className="flex items-baseline gap-2 font-luxury text-[var(--color-paper-50)]/85">
        <motion.span style={{ fontSize: "clamp(1.25rem, 0.9rem + 1vw, 1.75rem)", lineHeight: 1 }} className="tabular-nums">
          {current}
        </motion.span>
        <span className="text-[0.65rem] md:text-[0.75rem] tracking-[0.3em] uppercase opacity-60">
          / {totalLabel}
        </span>
      </div>

      {/* Right: scroll cue with pulsing arrow */}
      <div className="flex items-center gap-3 text-[var(--color-paper-50)]/80">
        <motion.span className="text-[0.65rem] md:text-xs font-medium tracking-[0.32em] uppercase">
          {cueText}
        </motion.span>
        <span aria-hidden className="block w-px h-7 bg-[var(--color-paper-50)]/50 origin-top scroll-cue-pulse" />
      </div>

      {/* Top-edge hairline */}
      <span aria-hidden className="absolute left-0 right-0 top-0 h-px bg-[var(--color-paper-50)]/12" />

      <style>{`
        @keyframes scroll-cue-pulse {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50%      { transform: translateY(4px); opacity: 1; }
        }
        .scroll-cue-pulse { animation: scroll-cue-pulse 2.4s cubic-bezier(0.16,1,0.3,1) infinite; }
      `}</style>
    </div>
  );
}

/* Static fallback for prefers-reduced-motion. */
function MomentsStatic() {
  return (
    <section
      aria-label="Khoảnh khắc"
      className="relative w-full px-6 md:px-12 py-32 md:py-56"
      style={{ background: "var(--color-paper-50)" }}
    >
      <div className="max-w-3xl mx-auto">
        <p className="text-[0.65rem] md:text-xs font-medium tracking-[0.5em] uppercase text-[var(--color-ink-500)]">
          Khoảnh khắc
        </p>
        <h2
          className="font-luxury mt-5 text-[var(--color-ink-900)]"
          style={{ fontSize: "clamp(2.5rem,1.6rem+4.5vw,5rem)" }}
        >
          Của chúng tôi
        </h2>
        <div className="mt-16 space-y-20">
          {scenes.map((scene, i) => (
            <figure key={scene.base}>
              <div className="aspect-[4/5] w-full overflow-hidden bg-[var(--color-paper-200)]">
                <picture>
                  <source srcSet={`/photos/${scene.base}-640.jpg 640w, /photos/${scene.base}-1280.jpg 1280w`} sizes="(max-width: 768px) 100vw, 80vw" />
                  <img
                    src={`/photos/${scene.base}-1280.jpg`}
                    alt={scene.alt}
                    className="block h-full w-full object-cover"
                    style={{ objectPosition: scene.focal }}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </picture>
              </div>
              <figcaption className="mt-5">
                <span className="block text-[0.65rem] font-medium tracking-[0.4em] uppercase text-[var(--color-ink-500)]">
                  {`Cảnh ${String(i + 1).padStart(2, "0")}`}
                </span>
                <h3
                  className="font-luxury mt-3 text-[var(--color-ink-900)]"
                  style={{ fontSize: "clamp(2rem,1.2rem+3vw,3.5rem)", lineHeight: 1, paddingBlock: "0.06em" }}
                >
                  {scene.title}
                </h3>
                <p
                  className="font-italic-light mt-3 text-[var(--color-ink-500)] text-[1rem] md:text-lg"
                  style={{ lineHeight: 1.6 }}
                >
                  {scene.caption}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
