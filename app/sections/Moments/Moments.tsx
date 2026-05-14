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

/* Album photos. Mapped to the four stories in docs/new-story.md:
     homeGaming → L1 (Khởi đầu, 02·01·2023)
     dalatMountain + dalatHood + dalatGrass → L2 (Đà Lạt)
     homeCuddly → L3 (Em đồng ý, 17·04·2025)
     studio0266 + studio0327 → L4 (Bây giờ, wedding attire)
   PHOTO OPTIMIZATION TODO: generate 640/1280 variants + AVIF/WebP for the
   Telegram exports too. Out of scope here. */
const PHOTOS = {
  homeGaming: {
    src: "/photo_2026-05-11_10-22-27.jpg",
    alt: "Hai chúng con cùng nhau trong góc phòng buổi tối, ánh đèn ấm.",
    focal: "55% 40%",
    tilt: 2.4,
  },
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
  homeCuddly: {
    src: "/photo_2026-05-11_10-22-26.jpg",
    alt: "Selfie cận cảnh, em tựa má vào tay, anh ôm vai cười.",
    focal: "50% 40%",
    tilt: -2.6,
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
  studio0266: {
    src: "/photos/ld3_0266-1280.jpg",
    alt: "Ảnh studio: anh trong vest đen, em trong áo cưới trắng, cùng nhìn xuống bó hoa.",
    focal: "50% 40%",
    tilt: -1.4,
  },
  studio0327: {
    src: "/photos/ld3_0327-1280.jpg",
    alt: "Ảnh studio: hai chúng con nhìn nhau, em cầm bó hoa cưới.",
    focal: "50% 40%",
    tilt: 1.8,
  },
} satisfies Record<string, LifestylePhoto>;

/* Album · Năm bên nhau — four leaves, one per story in
   docs/new-story.md. Slot rules: only display labels/dates that exist
   in the source (or directly map to a date already present elsewhere
   on the page). No invented seasons or place epithets.
     L1 — Khởi đầu / 02·01·2023: source has the date + "khởi đầu".
     L2 — Đà Lạt: source names only the place; no date displayed.
     L3 — Em đồng ý / 17·04·2025: source has the date + the quote.
     L4 — Bây giờ / 02·08·2026: source has no date, but "sắp về chung
          một nhà" points at the wedding day, which is the natural Prata
          anchor. Studio portraits + Pinyon & are the cinematic close.

   Reduced motion drops to a static stacked layout — same content, no
   transforms, no tilts. */
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
        <LeafBeginning reduceMotion={reduceMotion} />
        <FretworkRule />
        <LeafDaLat reduceMotion={reduceMotion} />
        <FretworkRule />
        <LeafEngagement reduceMotion={reduceMotion} />
        <FretworkRule />
        <LeafNow reduceMotion={reduceMotion} />
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
   HEADER — small caps eyebrow above a Prata display line, with a
   short serif subtitle in Be Vietnam Pro Light.
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
   LEAF 1 — Khởi đầu. The album opens quietly: one warm-lit photo of
   the two of them, caption to the left. No Pinyon ornament yet — the
   voice will warm up as the journey moves on.
   ──────────────────────────────────────────────────────────────────── */
function LeafBeginning({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <article className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
      <div className="md:col-span-5 md:order-1 order-2">
        <LeafCaption
          label="Khởi đầu"
          date="02 · 01 · 2023"
          caption="Khởi đầu một năm mới, cũng là khởi đầu của hành trình chúng con."
          leaf={1}
          align="left"
        />
      </div>

      <div className="md:col-span-7 md:order-2 order-1">
        <PhotoMat
          photo={PHOTOS.homeGaming}
          aspectClass="aspect-[4/5]"
          stamp={{ text1: "KHỞI ĐẦU", text2: "MMXXIII", corner: "br", tilt: -5 }}
          delay={0.2}
          reduceMotion={reduceMotion}
        />
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────────────
   LEAF 2 — Đà Lạt. The richest visual leaf: a mountain hero photo on
   top, two smaller frames below joined by a Pinyon Script &. This is
   the "first trip + favorite place" double-meaning, given the most
   space because the couple weighs Đà Lạt heavily in their own story.
   ──────────────────────────────────────────────────────────────────── */
function LeafDaLat({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <article className="flex flex-col items-center">
      <LeafCaption
        date="Đà Lạt"
        caption="Chuyến du lịch cùng nhau đầu tiên, và là nơi chúng con yêu thích nhất."
        leaf={2}
        align="center"
      />

      {/* Mountain hero photo */}
      <div className="mt-14 md:mt-20 w-full max-w-[460px]">
        <PhotoMat
          photo={PHOTOS.dalatMountain}
          aspectClass="aspect-[4/5]"
          delay={0.2}
          reduceMotion={reduceMotion}
        />
      </div>

      {/* Lower pair with Pinyon & between */}
      <div className="mt-10 md:mt-12 relative w-full grid grid-cols-2 gap-4 md:gap-12 items-center max-w-[640px]">
        <div className="justify-self-end w-full max-w-[260px] md:max-w-[300px]">
          <PhotoMat
            photo={PHOTOS.dalatHood}
            aspectClass="aspect-square"
            delay={0.35}
            reduceMotion={reduceMotion}
          />
        </div>

        <div className="w-full max-w-[260px] md:max-w-[300px]">
          <PhotoMat
            photo={PHOTOS.dalatGrass}
            aspectClass="aspect-square"
            delay={0.5}
            reduceMotion={reduceMotion}
          />
        </div>

        <Ampersand
          size="sm"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          delay={0.6}
          reduceMotion={reduceMotion}
        />
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────────────
   LEAF 3 — Em đồng ý. The proposal moment. Photo on the left, caption
   on the right with the specific date highlighted. The journey turns
   here, so the leaf gets a quieter, more direct treatment — no
   Pinyon ornament, no stamp clutter; the date itself is the weight.
   ──────────────────────────────────────────────────────────────────── */
function LeafEngagement({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <article className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
      <div className="md:col-span-6 md:order-1">
        <PhotoMat
          photo={PHOTOS.homeCuddly}
          aspectClass="aspect-square"
          stamp={{ text1: "ĐỒNG Ý", text2: "MMXXV", corner: "tl", tilt: 6 }}
          delay={0.2}
          reduceMotion={reduceMotion}
        />
      </div>

      <div className="md:col-span-6 md:order-2">
        <LeafCaption
          label="Em đồng ý"
          date="17 · 04 · 2025"
          caption="Câu “em đồng ý” được nói ra. Hành trình chúng con chính thức rẽ sang một trang mới."
          leaf={3}
          align="left"
        />
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────────────
   LEAF 4 — Bây giờ. The cinematic close, in wedding attire. Two
   studio frames bound by a hero-scale Pinyon Script &. This leaf
   replaces the prior typographic-only finale: the studio portraits
   themselves carry the ceremonial weight, and the album ends on
   "sắp được về chung một nhà" rather than a date callout (the date
   already lives in the hero, countdown, and events sections).
   ──────────────────────────────────────────────────────────────────── */
function LeafNow({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <article className="flex flex-col items-center">
      <LeafCaption
        label="Bây giờ"
        date="02 · 08 · 2026"
        caption="Trải qua nhiều thăng trầm, giờ đây, chúng con đã sắp được về chung một nhà."
        leaf={4}
        align="center"
      />

      {/* "Then" — graduation pair, smaller, staggered offset on desktop.
          Sits above the studio pair so the eye reads chronologically
          from school days to wedding attire, mirroring the "trải qua
          nhiều thăng trầm" arc in the caption. No Pinyon ornament here;
          the romantic flourish lives below with the studio pair. */}
      <div className="mt-14 md:mt-20 w-full grid grid-cols-2 gap-4 md:gap-10 items-center max-w-[520px]">
        <div className="md:mt-6 justify-self-end w-full max-w-[220px] md:max-w-[240px]">
          <PhotoMat
            photo={PHOTOS.herGrad}
            aspectClass="aspect-[3/4]"
            delay={0.2}
            reduceMotion={reduceMotion}
          />
        </div>
        <div className="md:-mt-6 w-full max-w-[220px] md:max-w-[240px]">
          <PhotoMat
            photo={PHOTOS.hisGrad}
            aspectClass="aspect-[3/4]"
            delay={0.3}
            reduceMotion={reduceMotion}
          />
        </div>
      </div>

      {/* "Now" — studio pair, larger, bound by hero-scale Pinyon &. */}
      <div className="mt-12 md:mt-16 relative w-full grid grid-cols-2 gap-4 md:gap-14 items-center max-w-[720px]">
        <div className="justify-self-end w-full max-w-[300px] md:max-w-[340px]">
          <PhotoMat
            photo={PHOTOS.studio0266}
            aspectClass="aspect-[3/4]"
            stamp={{ text1: "02 · 08", text2: "MMXXVI", corner: "br", tilt: -6 }}
            delay={0.2}
            reduceMotion={reduceMotion}
          />
        </div>

        <div className="w-full max-w-[300px] md:max-w-[340px]">
          <PhotoMat
            photo={PHOTOS.studio0327}
            aspectClass="aspect-[3/4]"
            delay={0.35}
            reduceMotion={reduceMotion}
          />
        </div>

        <Ampersand
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          delay={0.55}
          reduceMotion={reduceMotion}
        />
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
  /** Eyebrow text above the rule. Omit when the source story has no
   *  label for this beat (e.g. L2's "Đà Lạt" sits in the date slot). */
  label?: string;
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
      {label ? (
        <ScrollReveal>
          <p className="text-[0.7rem] md:text-xs font-medium tracking-[0.45em] uppercase text-[var(--color-ink-500)]">
            {label}
          </p>
        </ScrollReveal>
      ) : null}

      <ScrollReveal delay={0.1}>
        <span
          className={`${label ? "mt-4" : ""} block h-px w-10 ${ruleAlignClass}`}
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
          Trang 0{leaf} <span className="opacity-50">/ 04</span>
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
