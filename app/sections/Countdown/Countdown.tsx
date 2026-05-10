import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Side } from "../../content/sides";
import { ScrollReveal } from "../../components/ScrollReveal";
import { easeExpoOut } from "../../lib/motion";

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calc(target: string): Remaining | null {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

interface CountdownProps {
  side: Side;
}

export function Countdown({ side }: CountdownProps) {
  const reduceMotion = useReducedMotion();
  const [remaining, setRemaining] = useState<Remaining | null>(() => calc(side.ceremony.isoTarget));

  useEffect(() => {
    const tick = () => setRemaining(calc(side.ceremony.isoTarget));
    tick();
    const interval = window.setInterval(tick, reduceMotion ? 60_000 : 1_000);
    return () => window.clearInterval(interval);
  }, [side.ceremony.isoTarget, reduceMotion]);

  return (
    <section
      className="relative overflow-hidden px-6 md:px-12 py-32 md:py-56"
      style={{ background: "var(--color-paper-100)" }}
      aria-label="Đếm ngược"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Eyebrow */}
        <ScrollReveal>
          <p className="text-[0.65rem] md:text-xs font-medium tracking-[0.5em] uppercase text-[var(--color-ink-500)]">
            Còn lại đến
          </p>
        </ScrollReveal>

        {/* Ceremony name in Pinyon Script — ties back to the hero's flying motif */}
        <ScrollReveal delay={0.1}>
          <h2
            className="font-script mt-6 md:mt-8 text-[var(--color-ink-900)] whitespace-nowrap"
            style={{ fontSize: "clamp(4rem,12vw,9rem)", lineHeight: "1.0", paddingBlock: "0.04em" }}
          >
            {side.ceremony.label}
          </h2>
        </ScrollReveal>

        {/* Date in italic Light, restrained */}
        <ScrollReveal delay={0.2}>
          <p className="font-italic-light mt-2 text-[var(--color-ink-500)] text-[1rem] md:text-lg">
            {side.ceremony.solarFull}
          </p>
        </ScrollReveal>

        {/* Decorative hairline */}
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.4, delay: 0.4, ease: easeExpoOut }}
          style={{ originX: 0.5 }}
          className="block mx-auto mt-14 md:mt-20 h-px w-24 md:w-32 bg-[var(--color-ink-400)]/55"
        />

        {remaining ? (
          <div className="mt-14 md:mt-20">
            {/* Hero days number, dramatic Prata serif */}
            <ScrollReveal delay={0.3}>
              <div className="relative inline-flex items-end justify-center gap-3 md:gap-5">
                <span
                  className="font-luxury tabular-nums text-[var(--color-ink-900)] leading-[0.9]"
                  style={{
                    fontSize: "clamp(8rem,28vw,22rem)",
                    paddingBlock: "0.02em",
                  }}
                  aria-label={`${remaining.days} ngày`}
                >
                  {remaining.days}
                </span>
                <span
                  className="font-script text-[var(--color-rose)] mb-2 md:mb-6"
                  style={{ fontSize: "clamp(2rem,6vw,5rem)", lineHeight: "1.0" }}
                >
                  ngày
                </span>
              </div>
            </ScrollReveal>

            {/* Supporting line, in italic — quiet rhythm */}
            <ScrollReveal delay={0.5}>
              <p className="font-italic-light mt-10 md:mt-14 inline-flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-[var(--color-ink-700)] text-[1.0625rem] md:text-xl">
                <span className="text-[var(--color-ink-500)]">và</span>
                <SupportingNumber value={remaining.hours} unit="giờ" />
                <Glyph />
                <SupportingNumber value={remaining.minutes} unit="phút" />
                <Glyph />
                <SupportingNumber value={remaining.seconds} unit="giây" />
              </p>
            </ScrollReveal>
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeExpoOut }}
            className="mt-14 text-2xl font-italic-light text-[var(--color-ink-500)]"
          >
            Đã diễn ra · {side.ceremony.solarDisplay}
          </motion.p>
        )}
      </div>
    </section>
  );
}

function SupportingNumber({ value, unit }: { value: number; unit: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span
        className="font-luxury tabular-nums tracking-tight text-[var(--color-ink-900)]"
        style={{ fontStyle: "normal", fontSize: "1.15em", paddingBlock: "0.04em" }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="not-italic text-sm md:text-base text-[var(--color-ink-500)] font-medium tracking-[0.18em] uppercase">
        {unit}
      </span>
    </span>
  );
}

function Glyph() {
  return <span className="text-[var(--color-ink-400)] text-base md:text-lg">✦</span>;
}
