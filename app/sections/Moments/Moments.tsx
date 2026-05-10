import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ScrollReveal } from "../../components/ScrollReveal";
import { easeExpoOut } from "../../lib/motion";

interface PhotoCfg {
  base: string;
  alt: string;
  caption?: string;
}

const photos: PhotoCfg[] = [
  { base: "ld3_0327", alt: "Hai chúng tôi nhìn nhau, ảnh studio.", caption: "Một ánh nhìn." },
  { base: "hero-portrait", alt: "Hai chúng tôi trán chạm trán, ảnh studio.", caption: "Một khoảnh khắc thinh lặng." },
  { base: "ld3_0266", alt: "Cô dâu nhìn xuống bó hoa cưới.", caption: "Một mùa hoa." },
];

export function Moments() {
  return (
    <section
      className="relative overflow-hidden px-6 md:px-12 py-32 md:py-56"
      style={{ background: "var(--color-paper-50)" }}
      aria-label="Khoảnh khắc"
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <p className="text-[0.65rem] md:text-xs font-medium tracking-[0.5em] uppercase text-[var(--color-ink-500)]">
            Khoảnh khắc
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2
            className="font-luxury mt-5 text-[var(--color-ink-900)]"
            style={{ fontSize: "clamp(2.5rem,1.6rem+4.5vw,5rem)", textWrap: "balance" }}
          >
            Của chúng tôi
          </h2>
        </ScrollReveal>

        <div className="mt-20 md:mt-28 grid grid-cols-12 gap-x-4 md:gap-x-8 gap-y-16 md:gap-y-16">
          <Photo
            base={photos[0].base}
            alt={photos[0].alt}
            caption={photos[0].caption}
            aspect="4/5"
            colSpan="col-span-7 md:col-span-5"
            offset=""
            index={0}
          />
          <Photo
            base={photos[1].base}
            alt={photos[1].alt}
            caption={photos[1].caption}
            aspect="3/4"
            colSpan="col-span-5 col-start-8 md:col-span-4 md:col-start-8"
            offset="mt-24 md:mt-44"
            index={1}
          />
          <Photo
            base={photos[2].base}
            alt={photos[2].alt}
            caption={photos[2].caption}
            aspect="3/4"
            colSpan="col-span-8 col-start-3 md:col-span-5 md:col-start-4"
            offset="md:mt-20"
            index={2}
          />
        </div>
      </div>
    </section>
  );
}

interface PhotoProps {
  base: string;
  alt: string;
  caption?: string;
  aspect: string;
  colSpan: string;
  offset: string;
  index?: number;
}

function Photo({ base, alt, caption, aspect, colSpan, offset, index = 0 }: PhotoProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [40, -40]
  );

  // Staggered delay so photos 0/1 (same row on desktop) reveal in sequence
  // rather than simultaneously, giving the layout a visible cadence.
  const stagger = index * 0.18;

  return (
    <div ref={ref} className={`${colSpan} ${offset} relative`}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.3, ease: easeExpoOut, delay: stagger }}
        style={{ aspectRatio: aspect }}
        className="relative overflow-hidden w-full bg-[var(--color-paper-200)]"
      >
        {/* Scroll-tied parallax wrapper, kept separate from the entrance scale
            so the motion value and one-shot animation don't fight over transform. */}
        <motion.div style={{ y }} className="absolute inset-0">
          {/* Scale-settle: image starts slightly zoomed-in and relaxes to 1.0,
              so the reveal feels like the image is breathing into place. */}
          <motion.div
            initial={{ scale: reduceMotion ? 1 : 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 2.0, ease: easeExpoOut, delay: stagger + 0.1 }}
            className="absolute inset-0"
          >
            <picture>
              <source
                srcSet={`/photos/${base}-640.jpg 640w, /photos/${base}-1280.jpg 1280w, /photos/${base}-1920.jpg 1920w`}
                sizes="(max-width: 768px) 60vw, 40vw"
              />
              <img
                src={`/photos/${base}-1280.jpg`}
                alt={alt}
                className="block h-full w-full object-cover"
                decoding="async"
              />
            </picture>
          </motion.div>
        </motion.div>
      </motion.div>

      {caption && (
        <ScrollReveal delay={0.5 + stagger}>
          <p className="font-italic-light mt-4 md:mt-5 text-[var(--color-ink-500)] text-[0.95rem] md:text-base">
            {caption}
          </p>
        </ScrollReveal>
      )}
    </div>
  );
}
