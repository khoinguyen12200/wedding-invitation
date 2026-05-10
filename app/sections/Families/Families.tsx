import { motion } from "motion/react";
import { ScrollReveal } from "../../components/ScrollReveal";
import { FloralMark } from "../../components/FloralMark";
import { sides } from "../../content/sides";
import { easeExpoOut } from "../../lib/motion";

export function Families() {
  return (
    <section
      className="relative overflow-hidden px-6 md:px-12 py-32 md:py-56"
      style={{ background: "var(--color-paper-200)" }}
      aria-label="Trân trọng kính mời"
    >
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-center text-[0.65rem] md:text-xs font-medium tracking-[0.5em] uppercase text-[var(--color-ink-500)]">
            Trân trọng kính mời
          </p>
        </ScrollReveal>

        <div className="mt-20 md:mt-28 relative grid md:grid-cols-2 gap-20 md:gap-0">
          <motion.span
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, delay: 0.4, ease: easeExpoOut }}
            style={{ originY: 0 }}
            className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-[var(--color-ink-400)]/30"
          />

          <FamilyColumn
            label="Nhà Trai"
            father={sides.groom.parents.father}
            mother={sides.groom.parents.mother}
            address={sides.groom.address}
            align="md:text-right md:pr-16"
            delay={0.2}
          />
          <FamilyColumn
            label="Nhà Gái"
            father={sides.bride.parents.father}
            mother={sides.bride.parents.mother}
            address={sides.bride.address}
            align="md:text-left md:pl-16"
            delay={0.4}
          />
        </div>

        <ScrollReveal delay={0.2}>
          <div className="mt-20 md:mt-28 flex justify-center text-[var(--color-ink-700)]">
            <FloralMark size={36} />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="mt-10 text-center font-light text-[var(--color-ink-700)] max-w-xl mx-auto leading-[1.7] text-[1.0625rem] md:text-[1.125rem]">
            Trân trọng kính mời quý quan khách đến chung vui cùng gia đình
            chúng tôi trong ngày lễ thành hôn của hai con:
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <h2
            className="font-script mt-12 md:mt-16 text-center text-[var(--color-ink-900)]"
            style={{ fontSize: "clamp(3.5rem,2rem+7vw,9rem)", textWrap: "balance", lineHeight: "1.0" }}
          >
            Gia Khôi <span style={{ color: "var(--color-rose)" }}>&amp;</span> Huyền Trân
          </h2>
        </ScrollReveal>
      </div>
    </section>
  );
}

interface FamilyColumnProps {
  label: string;
  father: string;
  mother: string;
  address: { street: string; ward: string; province: string };
  align: string;
  delay: number;
}

function FamilyColumn({ label, father, mother, address, align, delay }: FamilyColumnProps) {
  return (
    <ScrollReveal delay={delay} className={`text-center ${align}`}>
      <p className="text-[0.7rem] md:text-xs font-medium tracking-[0.4em] uppercase text-[var(--color-ink-900)]">
        {label}
      </p>
      <span className="block mx-auto md:mx-0 md:ml-auto md:mr-0 mt-5 h-px w-12 bg-[var(--color-ink-400)]/50" />

      <div className="mt-8 space-y-3 font-light">
        <p className="leading-snug">
          <span className="text-[var(--color-ink-500)] mr-3 text-sm">Ông</span>
          <span className="text-[var(--color-ink-900)] text-lg md:text-xl font-medium">
            {father}
          </span>
        </p>
        <p className="leading-snug">
          <span className="text-[var(--color-ink-500)] mr-3 text-sm">Bà</span>
          <span className="text-[var(--color-ink-900)] text-lg md:text-xl font-medium">
            {mother}
          </span>
        </p>
      </div>

      <p className="mt-8 font-light text-[var(--color-ink-700)] leading-relaxed text-[0.95rem]">
        {address.street},<br />
        {address.ward},<br />
        {address.province}
      </p>
    </ScrollReveal>
  );
}
