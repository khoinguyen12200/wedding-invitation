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
  const [remaining, setRemaining] = useState<Remaining | null>(() =>
    calc(side.ceremony.isoTarget)
  );

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
        {/* ── WHAT ── */}
        <ScrollReveal>
          <h2
            className="font-luxury text-[var(--color-ink-900)]"
            style={{
              fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
              lineHeight: 1.15,
              paddingBlock: "0.04em",
            }}
          >
            {side.ceremony.label}
          </h2>
        </ScrollReveal>

        {/* ── WHEN ── */}
        <ScrollReveal delay={0.1}>
          <p className="font-italic-light mt-3 text-[var(--color-ink-500)] text-[1rem] md:text-lg">
            {side.ceremony.solarFull}
          </p>
        </ScrollReveal>

        {/* ── Separator ── */}
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.4, delay: 0.3, ease: easeExpoOut }}
          style={{ originX: 0.5 }}
          className="block mx-auto mt-12 md:mt-16 h-px w-20 md:w-28 bg-[var(--color-ink-400)]/45"
        />

        {remaining ? (
          <div className="mt-14 md:mt-20">
            {/* ── Big days: Còn lại 82 ngày ── */}
            <ScrollReveal delay={0.35}>
              <div className="mt-4 md:mt-6 inline-flex items-baseline justify-center gap-3 md:gap-4">
                <span
                  className="font-script text-[var(--color-ink-500)]"
                  style={{
                    fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
                    lineHeight: 1.0,
                  }}
                >
                  Còn lại
                </span>
                <span
                  className="font-luxury tabular-nums text-[var(--color-ink-900)] leading-[0.85]"
                  style={{
                    fontSize: "clamp(6rem, 18vw, 13rem)",
                    paddingBlock: "0.02em",
                  }}
                  aria-label={`${remaining.days} ngày`}
                >
                  {remaining.days}
                </span>
                <span
                  className="font-script text-[var(--color-rose)]"
                  style={{
                    fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
                    lineHeight: 1.0,
                  }}
                >
                  ngày
                </span>
              </div>
            </ScrollReveal>

            {/* ── Hours · Minutes · Seconds ── */}
            <ScrollReveal delay={0.5}>
              <p className="mt-8 md:mt-10 inline-flex flex-wrap items-baseline justify-center gap-x-5 gap-y-2 text-[var(--color-ink-700)] text-[1.0625rem] md:text-xl">
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

function SupportingNumber({
  value,
  unit,
}: {
  value: number;
  unit: string;
}) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span
        className="font-luxury tabular-nums tracking-tight text-[var(--color-ink-900)]"
        style={{
          fontStyle: "normal",
          fontSize: "1.15em",
          paddingBlock: "0.04em",
        }}
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
  return (
    <span className="text-[var(--color-ink-400)] text-base md:text-lg">✦</span>
  );
}
