import { motion, useReducedMotion } from "motion/react";
import { ScrollReveal } from "../../components/ScrollReveal";
import { FloralMark } from "../../components/FloralMark";

export function ThankYou() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden px-6 md:px-12 py-40 md:py-64 text-center"
      style={{ background: "var(--color-paper-200)" }}
      aria-label="Lời cảm ơn"
    >
      <ScrollReveal>
        <motion.div
          animate={
            reduceMotion ? undefined : { rotate: [0, 1.5, -1.5, 0], y: [0, -2, 2, 0] }
          }
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          className="text-[var(--color-ink-700)] inline-block"
        >
          <FloralMark size={56} />
        </motion.div>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <p className="mt-10 text-[0.65rem] md:text-xs font-medium tracking-[0.5em] uppercase text-[var(--color-ink-500)]">
          Lời cảm ơn
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <p className="mt-10 max-w-md mx-auto font-light leading-[1.7] text-[var(--color-ink-700)] text-[1.0625rem] md:text-lg">
          Trân trọng cảm ơn quý vị đã đồng hành cùng chúng mình.
          Mong sớm được gặp lại trong ngày trọng đại.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.5}>
        <p
          className="font-luxury mt-16 text-[var(--color-ink-900)]"
          style={{ fontSize: "clamp(2.5rem,1.5rem+4vw,5rem)", textWrap: "balance" }}
        >
          Gia Khôi <span className="font-italic-light" style={{ color: "var(--color-rose)" }}>&amp;</span> Huyền Trân
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.7}>
        <span className="mx-auto block mt-16 h-px w-12 bg-[var(--color-ink-400)]/40" />
        <p className="mt-8 text-[0.6rem] font-medium tracking-[0.5em] uppercase text-[var(--color-ink-500)]">
          Mmxxvi
        </p>
      </ScrollReveal>
    </section>
  );
}
