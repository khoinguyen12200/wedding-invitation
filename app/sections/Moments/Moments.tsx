import { motion, useReducedMotion } from "motion/react";
import { ScrollReveal } from "../../components/ScrollReveal";
import { easeExpoOut } from "../../lib/motion";

interface LifestylePhoto {
  src: string;
  alt: string;
  /** object-position so face crops survive at any container aspect. */
  focal: string;
  /** Decorative tilt in degrees. Each photo gets a small, deliberate
   *  rotation so the album reads as pinned-by-hand rather than CMS-
   *  perfect. Range kept ≤ ±3°. */
  tilt: number;
}

/* Seven candid photos arranged into a chronological journey across
   five album "leaves" — from the first milestone (graduation, MMXXIII)
   to the destination (the wedding day, II · VIII · MMXXVI). The final
   leaf carries no photo: it's pure typography, the climax of the arc.

   The photos live at /public/photo_*.jpg as single-resolution Telegram
   exports. PHOTO OPTIMIZATION TODO: generate 640/1280 variants and
   AVIF/WebP for mobile-LCP on Zalo. Out of scope here. */
const PHOTOS = {
  dalatMountain: {
    src: "/photo_2026-05-11_14-42-01.jpg",
    alt: "Hai chúng con đứng nhìn ra biển mây ở Đà Lạt, áo len mùa đông.",
    focal: "50% 35%",
    tilt: -1.2,
  },
  dalatHood: {
    src: "/photo_2026-05-11_14-42-08.jpg",
    alt: "Selfie cận cảnh hai chúng con trong áo khoác mùa lạnh.",
    focal: "55% 40%",
    tilt: 1.6,
  },
  dalatGrass: {
    src: "/photo_2026-05-11_14-42-12.jpg",
    alt: "Hai chúng con ngồi trên cỏ nhìn ra dãy núi Đà Lạt.",
    focal: "50% 50%",
    tilt: -2.1,
  },
  herGrad: {
    src: "/photo_2026-05-11_14-42-42.jpg",
    alt: "Em mặc áo cử nhân đen đỏ trong ngày tốt nghiệp.",
    focal: "50% 32%",
    tilt: 1.4,
  },
  hisGrad: {
    src: "/photo_2026-05-11_14-42-46.jpg",
    alt: "Anh trong áo cử nhân ôm bó hoa trước giảng đường.",
    focal: "50% 40%",
    tilt: -1.8,
  },
  homeGaming: {
    src: "/photo_2026-05-11_10-22-27.jpg",
    alt: "Hai chúng con cùng nhau trong góc phòng buổi tối, ánh đèn ấm.",
    focal: "55% 40%",
    tilt: 2.4,
  },
  homeCuddly: {
    src: "/photo_2026-05-11_10-22-26.jpg",
    alt: "Selfie cận cảnh, em tựa má vào tay, anh ôm vai cười.",
    focal: "50% 40%",
    tilt: -2.6,
  },
} satisfies Record<string, LifestylePhoto>;

/* Album · Năm bên nhau — a personal photo album in the same ceremonial
   vocabulary as the rest of the site:
     - Cream paper surface (--color-paper-100)
     - Prata display ("font-luxury") for headings and dates
     - Pinyon Script ("font-script") for the romantic & flourish
     - Vermilion seal stamps as "passport-stamp" page tags
     - Be Vietnam Pro Light for captions
     - Fretwork hairlines (回紋 motif from the vermilion seal) between
       leaves so the album reads as deliberately bound

   Five leaves, chronologically ordered as a journey from ordinary
   days to the wedding day:
     L1 — Tốt nghiệp (offset pair, MMXXIII): the milestone, two paths
          becoming one.
     L2 — Đường lên Đà Lạt (solo hero, I · MMXXV): the first big trip
          together — adventure.
     L3 — Mùa lạnh (centered pair, I · MMXXV): closer, intimate
          travel moments with a Pinyon Script & floating between.
     L4 — Đêm muộn (overlap pair, IV · MMXXVI): settled life on the
          eve of the wedding.
     L5 — Bây giờ (typographic finale, II · VIII · MMXXVI): the
          destination. No photo — the wedding date itself is the page.

   Each LeafCaption's leaf number drives the "Trang 0N / 05" footer so
   the reader sees their position in the journey. Reduced motion drops
   to a static stacked layout — same content, no transforms, no tilts. */
export function Moments() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Khoảnh khắc"
      className="relative w-full overflow-hidden px-6 md:px-12 pt-32 md:pt-56 pb-24 md:pb-36"
      style={{ background: "var(--color-paper-100)" }}
    >
      <Header />

      <div className="mt-20 md:mt-28 max-w-5xl mx-auto space-y-28 md:space-y-44">
        <LeafGraduation reduceMotion={reduceMotion} />
        <FretworkRule />
        <LeafMountain reduceMotion={reduceMotion} />
        <FretworkRule />
        <LeafDaLat reduceMotion={reduceMotion} />
        <FretworkRule />
        <LeafHome reduceMotion={reduceMotion} />
        <FretworkRule />
        <LeafWedding />
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
   HEADER — small caps eyebrow above a Prata display line, with a
   short serif subtitle in Be Vietnam Pro Light. Matches the section-
   opening pattern used by Families and Countdown.
   ──────────────────────────────────────────────────────────────────── */
function Header() {
  return (
    <header className="max-w-3xl mx-auto text-center">
      <ScrollReveal>
        <p className="text-[0.65rem] md:text-xs font-medium tracking-[0.5em] uppercase text-[var(--color-ink-500)]">
          Khoảnh khắc · Của chúng con
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <h2
          className="font-luxury mt-7 text-[var(--color-ink-900)]"
          style={{
            fontSize: "clamp(2.5rem, 1.6rem + 4.5vw, 5rem)",
            lineHeight: 1.0,
            paddingBlock: "0.08em",
            textWrap: "balance",
          }}
        >
          Năm bên nhau
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <p
          className="mt-7 mx-auto max-w-[38ch] text-[var(--color-ink-700)] font-light text-[1.0625rem] md:text-[1.125rem]"
          style={{ lineHeight: 1.65 }}
        >
          Không kể hết được,
          <br />
          chỉ kịp giữ lại vài khoảnh khắc trên đường đi.
        </p>
      </ScrollReveal>
    </header>
  );
}

/* ────────────────────────────────────────────────────────────────────
   LEAF 2 — Solo hero. Đà Lạt mountain view. The first big trip
   together — caption sits on the left, photo dominates the right,
   vermilion stamp pinned to the photo's corner.
   ──────────────────────────────────────────────────────────────────── */
function LeafMountain({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <article className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
      <div className="md:col-span-5 md:order-1 order-2">
        <LeafCaption
          label="Đường lên Đà Lạt"
          date="Ngày đông · Đà Lạt"
          caption="Sáng đó dậy sớm để kịp biển mây. Lạnh buốt, mây thì bày ra ngay dưới chân."
          leaf={2}
          align="left"
        />
      </div>

      <div className="md:col-span-7 md:order-2 order-1">
        <PhotoMat
          photo={PHOTOS.dalatMountain}
          aspectClass="aspect-[4/5]"
          stamp={{ text1: "ĐÀ LẠT", text2: "PHỐ NÚI", corner: "br", tilt: -8 }}
          delay={0.2}
          reduceMotion={reduceMotion}
        />
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────────────
   LEAF 3 — Centered pair. Closer Đà Lạt moments with a Pinyon Script
   & floating between them. Caption sits above the pair, centered —
   the most romantic leaf in the album.
   ──────────────────────────────────────────────────────────────────── */
function LeafDaLat({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <article className="flex flex-col items-center">
      <LeafCaption
        label="Mùa lạnh"
          date="Hoàng hôn · Phố núi"
          caption="Chiều xuống chậm, hai đứa cũng chậm theo. Ngồi nán trên cỏ một chút nữa, không nói gì cũng được."
        leaf={3}
        align="center"
      />

      <div className="mt-16 md:mt-20 relative w-full grid grid-cols-2 gap-4 md:gap-12 items-center">
        <div className="justify-self-end w-full max-w-[280px] md:max-w-[360px]">
          <PhotoMat
            photo={PHOTOS.dalatHood}
            aspectClass="aspect-[3/4]"
            stamp={{ text1: "MÙA ĐÔNG", text2: "ÁO LEN", corner: "tl", tilt: 6 }}
            delay={0.2}
            reduceMotion={reduceMotion}
          />
        </div>

        <div className="w-full max-w-[280px] md:max-w-[360px]">
          <PhotoMat
            photo={PHOTOS.dalatGrass}
            aspectClass="aspect-square"
            delay={0.35}
            reduceMotion={reduceMotion}
          />
        </div>

        {/* Pinyon Script & — sits between the two photo mats. Pointer
            events disabled so it doesn't intercept hover/clicks on the
            photos behind it. */}
        <Ampersand
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          delay={0.5}
          reduceMotion={reduceMotion}
        />
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────────────
   LEAF 1 — Offset pair. The journey opens here: two graduation days
   staggered vertically, "two paths becoming one." The first leaf
   gets the simplest layout — no Pinyon Script on the caption yet, no
   ornament saturation; the album's voice will warm up as the journey
   progresses.
   ──────────────────────────────────────────────────────────────────── */
function LeafGraduation({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <article className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
      <div className="md:col-span-7 grid grid-cols-2 gap-4 md:gap-8 relative">
        <div className="md:mt-8">
          <PhotoMat
            photo={PHOTOS.herGrad}
            aspectClass="aspect-[3/4]"
            delay={0.2}
            reduceMotion={reduceMotion}
          />
        </div>

        <div className="md:-mt-8">
          <PhotoMat
            photo={PHOTOS.hisGrad}
            aspectClass="aspect-[3/4]"
            stamp={{ text1: "TỐT NGHIỆP", text2: "NGÀY VUI", corner: "br", tilt: -5 }}
            delay={0.35}
            reduceMotion={reduceMotion}
          />
        </div>

        {/* Small & between the two grad photos, top-aligned to the gap. */}
        <Ampersand
          size="sm"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          delay={0.5}
          reduceMotion={reduceMotion}
        />
      </div>

      <div className="md:col-span-5">
        <LeafCaption
          label="Tốt nghiệp"
          date="Mùa hè · Cần Thơ"
          caption="Hai ngày tốt nghiệp khác nhau, hai bức ảnh chụp riêng. Không ai đoán được sẽ tới đây."
          leaf={1}
          align="left"
        />
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────────────
   LEAF 4 — Overlap pair. The reflection beat. The previous leaves
   describe specific moments; this one steps back and summarizes the
   journey before handing off to the typographic finale. The two
   photos still play (overlap pair, larger + nested smaller), but the
   caption no longer narrates them — it's a "where we are now" line
   pointing at the wedding date.
   ──────────────────────────────────────────────────────────────────── */
function LeafHome({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <article className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
      <div className="md:col-span-5 md:order-1 order-2">
        <LeafCaption
          label="Tới hôm nay"
          date="Mùa hè · 2026"
          caption="Chừng đó năm, chừng đó chuyến đi, chừng đó câu chuyện. Đủ để biết ngày 02·08 sẽ là của chúng con."
          leaf={4}
          align="left"
        />
      </div>

      <div className="md:col-span-7 md:order-2 order-1 relative">
        {/* Main photo */}
        <div className="ml-auto w-full max-w-[420px]">
          <PhotoMat
            photo={PHOTOS.homeCuddly}
            aspectClass="aspect-[4/5]"
            stamp={{ text1: "MÙA HÈ", text2: "MMXXVI", corner: "tr", tilt: 5 }}
            delay={0.2}
            reduceMotion={reduceMotion}
          />
        </div>

        {/* Secondary photo, nested into the lower-left corner of the
            main mat, slightly overlapping. On mobile it tucks below
            rather than overlap so the layout doesn't get cramped. */}
        <div className="hidden md:block absolute left-0 bottom-[-6%] w-[44%] max-w-[260px]">
          <PhotoMat
            photo={PHOTOS.homeGaming}
            aspectClass="aspect-[3/4]"
            delay={0.5}
            reduceMotion={reduceMotion}
          />
        </div>

        {/* Mobile-only: stack the second photo below */}
        <div className="md:hidden mt-6 mr-auto w-[60%]">
          <PhotoMat
            photo={PHOTOS.homeGaming}
            aspectClass="aspect-[3/4]"
            delay={0.5}
            reduceMotion={reduceMotion}
          />
        </div>
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────────────
   PHOTO MAT — the album-page treatment. A cream paper-50 mat wraps
   the photo with generous padding (more at the bottom, like a real
   polaroid back). A subtle warm drop shadow lifts it off the page.
   The whole mat is rotated by `tilt` degrees so the page reads as
   pinned-by-hand. On scroll-in, the mat reveals with a clip-path
   inset + the rotation animates from 0 to its target tilt, like a
   photo settling into place.
   ──────────────────────────────────────────────────────────────────── */
interface PhotoMatProps {
  photo: LifestylePhoto;
  aspectClass: string;
  stamp?: SealStampProps;
  delay?: number;
  reduceMotion: boolean | null;
}

function PhotoMat({ photo, aspectClass, stamp, delay = 0, reduceMotion }: PhotoMatProps) {
  return (
    <motion.figure
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28, rotate: 0, clipPath: "inset(6% 4% 6% 4%)" }}
      whileInView={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, rotate: photo.tilt, clipPath: "inset(0% 0% 0% 0%)" }
      }
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.0, delay, ease: easeExpoOut }}
      className="relative inline-block w-full"
      style={{ transformOrigin: "center" }}
    >
      <div
        className={`relative ${aspectClass} w-full overflow-hidden`}
        style={{
          background: "var(--color-paper-50)",
          padding: "10px 10px 28px 10px",
          boxShadow:
            "0 1px 1px rgba(60,40,25,0.05), 0 18px 36px -16px rgba(60,40,25,0.22), 0 4px 10px -4px rgba(60,40,25,0.08)",
        }}
      >
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={photo.src}
            alt={photo.alt}
            className="block w-full h-full object-cover"
            style={{ objectPosition: photo.focal }}
            loading="lazy"
            decoding="async"
          />
          {/* Subtle vignette so the mat edge feels like a real photo
              print, not a flat web crop. */}
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(40,28,18,0.18) 100%)",
            }}
          />
        </div>

        {stamp ? <SealStamp {...stamp} /> : null}
      </div>
    </motion.figure>
  );
}

/* ────────────────────────────────────────────────────────────────────
   SEAL STAMP — a small round vermilion stamp pinned to a photo's
   corner. Two short text lines inside (place + year), traditional
   Chinese-stamp circular layout. Slightly tilted, low opacity so it
   reads as ink-soaked-into-paper, not a sticker.
   ──────────────────────────────────────────────────────────────────── */
interface SealStampProps {
  text1: string;
  text2: string;
  corner: "tl" | "tr" | "bl" | "br";
  /** Rotation in degrees. */
  tilt: number;
}

function SealStamp({ text1, text2, corner, tilt }: SealStampProps) {
  const cornerPos =
    corner === "tl" ? "top-3 left-3" :
    corner === "tr" ? "top-3 right-3" :
    corner === "bl" ? "bottom-9 left-3" :
                       "bottom-9 right-3";

  return (
    <motion.span
      aria-hidden
      initial={{ opacity: 0, scale: 0.6, rotate: tilt - 8 }}
      whileInView={{ opacity: 0.85, scale: 1, rotate: tilt }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay: 0.9, ease: easeExpoOut }}
      className={`absolute ${cornerPos} z-10 flex flex-col items-center justify-center rounded-full`}
      style={{
        width: 72,
        height: 72,
        border: "1.6px solid var(--color-seal)",
        boxShadow: "inset 0 0 0 4px var(--color-paper-50), inset 0 0 0 5px var(--color-seal)",
        background: "rgba(255, 255, 255, 0.0)",
        color: "var(--color-seal)",
        fontFamily: "'Be Vietnam Pro', sans-serif",
        letterSpacing: "0.12em",
        mixBlendMode: "multiply",
      }}
    >
      <span style={{ fontSize: 8.5, fontWeight: 900, lineHeight: 1.0 }}>{text1}</span>
      <span
        aria-hidden
        className="my-1 block"
        style={{ width: 18, height: 1, background: "var(--color-seal)", opacity: 0.7 }}
      />
      <span style={{ fontSize: 8, fontWeight: 500, lineHeight: 1.0 }}>{text2}</span>
    </motion.span>
  );
}

/* ────────────────────────────────────────────────────────────────────
   LEAF CAPTION — eyebrow + Prata date + Vietnamese one-liner + a leaf
   number tucked at the bottom. Alignment toggles between left and
   center per leaf so the rhythm varies across the album.
   ──────────────────────────────────────────────────────────────────── */
interface LeafCaptionProps {
  label: string;
  date: string;
  caption: string;
  leaf: number;
  align: "left" | "center";
}

function LeafCaption({ label, date, caption, leaf, align }: LeafCaptionProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";
  const ruleAlignClass = align === "center" ? "mx-auto" : "mx-0";

  return (
    <div className={`flex flex-col ${alignClass}`}>
      <ScrollReveal>
        <p className="text-[0.7rem] md:text-xs font-medium tracking-[0.45em] uppercase text-[var(--color-ink-500)]">
          {label}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <span
          className={`mt-4 block h-px w-10 ${ruleAlignClass}`}
          style={{ background: "var(--color-ink-400)", opacity: 0.45 }}
        />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <h3
          className="font-luxury mt-6 text-[var(--color-ink-900)] tabular-nums"
          style={{
            fontSize: "clamp(1.9rem, 1.3rem + 2.4vw, 3rem)",
            lineHeight: 1.0,
            paddingBlock: "0.06em",
            letterSpacing: "0.02em",
          }}
        >
          {date}
        </h3>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <p
          className="mt-6 max-w-[34ch] text-[var(--color-ink-700)] font-light text-[1rem] md:text-[1.0625rem]"
          style={{ lineHeight: 1.65 }}
        >
          {caption}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <p
          className="mt-10 text-[0.65rem] tracking-[0.4em] uppercase text-[var(--color-ink-500)] tabular-nums"
          style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500 }}
        >
          Trang 0{leaf} <span className="opacity-50">/ 05</span>
        </p>
      </ScrollReveal>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   AMPERSAND — Pinyon Script & in vermilion. The romantic flourish
   that floats between paired photos. Scale-and-fade in on view.
   ──────────────────────────────────────────────────────────────────── */
function Ampersand({
  className = "",
  size = "lg",
  delay = 0,
  reduceMotion,
}: {
  className?: string;
  size?: "sm" | "lg";
  delay?: number;
  reduceMotion: boolean | null;
}) {
  const fontSize = size === "sm" ? "clamp(3rem, 2rem + 4vw, 5rem)" : "clamp(4rem, 2.5rem + 6vw, 7rem)";

  return (
    <motion.span
      aria-hidden
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7, rotate: -6 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.95, delay, ease: easeExpoOut }}
      className={`font-script text-[var(--color-seal)] select-none ${className}`}
      style={{
        fontSize,
        lineHeight: 1,
        textShadow: "0 1px 0 var(--color-paper-50)",
      }}
    >
      &amp;
    </motion.span>
  );
}

/* ────────────────────────────────────────────────────────────────────
   FRETWORK RULE — a thin horizontal divider between leaves, echoing
   the 回紋 meander used inside the vermilion seal so the album feels
   visually bound to the rest of the site.
   ──────────────────────────────────────────────────────────────────── */
function FretworkRule() {
  return (
    <ScrollReveal>
      <div className="flex items-center justify-center gap-4 my-4 md:my-8">
        <span aria-hidden className="block h-px w-12 md:w-20 bg-[var(--color-ink-400)] opacity-40" />
        <svg
          width="32"
          height="14"
          viewBox="0 0 32 14"
          aria-hidden
          style={{ color: "var(--color-ink-500)" }}
        >
          <rect x="2" y="2" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.7" />
          <rect x="4.5" y="4.5" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.7" />
          <rect x="20" y="2" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.7" />
          <rect x="22.5" y="4.5" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.7" />
        </svg>
        <span aria-hidden className="block h-px w-12 md:w-20 bg-[var(--color-ink-400)] opacity-40" />
      </div>
    </ScrollReveal>
  );
}

/* ────────────────────────────────────────────────────────────────────
   LEAF 5 — Typographic finale. No photo: the wedding date itself is
   the page. The journey ends here, and the page hands off to the
   ceremonial blocks (marquee → Families → Events) right after.

   This leaf is the climax of the album's progression: the previous
   leaves used ornament sparingly; this one pulls every ceremonial
   element together — the large Prata date, a Pinyon Script & at hero
   scale, the vermilion seal stamp, and a single-line invitation
   closing the loop.
   ──────────────────────────────────────────────────────────────────── */
function LeafWedding() {
  return (
    <article className="relative flex flex-col items-center text-center pt-8 md:pt-12">
      <ScrollReveal>
        <p className="text-[0.7rem] md:text-xs font-medium tracking-[0.5em] uppercase text-[var(--color-ink-500)]">
          Bây giờ
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <span
          className="mt-5 block h-px w-10 mx-auto"
          style={{ background: "var(--color-seal)", opacity: 0.55 }}
        />
      </ScrollReveal>

      <ScrollReveal delay={0.25}>
        <h3
          className="font-luxury mt-8 text-[var(--color-ink-900)] tabular-nums"
          style={{
            fontSize: "clamp(2.6rem, 1.6rem + 5vw, 5.5rem)",
            lineHeight: 1.0,
            paddingBlock: "0.08em",
            letterSpacing: "0.04em",
          }}
        >
          02 · 08 · 2026
        </h3>
      </ScrollReveal>

      <ScrollReveal delay={0.32}>
        <p
          className="mt-3 text-[var(--color-ink-500)] font-light italic text-[0.95rem] md:text-[1rem]"
          style={{ lineHeight: 1.6 }}
        >
          Chủ Nhật, ngày 2 tháng 8 năm 2026
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <span
          aria-hidden
          className="font-script block text-[var(--color-seal)] mt-6"
          style={{
            fontSize: "clamp(4rem, 2.6rem + 5.5vw, 6.5rem)",
            lineHeight: 0.9,
          }}
        >
          &amp;
        </span>
      </ScrollReveal>

      <ScrollReveal delay={0.55}>
        <p
          className="mt-8 max-w-[34ch] mx-auto text-[var(--color-ink-700)] font-light italic text-[1rem] md:text-[1.0625rem]"
          style={{ lineHeight: 1.7 }}
        >
          Phần còn lại,
          <br />
          xin được kể tiếp cùng quý quan khách.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.7}>
        <p
          className="mt-12 text-[0.65rem] tracking-[0.4em] uppercase text-[var(--color-ink-500)] tabular-nums"
          style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500 }}
        >
          Trang 05 <span className="opacity-50">/ 05</span>
        </p>
      </ScrollReveal>
    </article>
  );
}
