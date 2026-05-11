import { motion } from "motion/react";
import { ScrollReveal } from "../../components/ScrollReveal";
import { VermilionSeal } from "../../components/VermilionSeal";
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
            hairlineAlign="md:mx-0 md:ml-auto md:mr-0"
            delay={0.2}
          />
          <FamilyColumn
            label="Nhà Gái"
            father={sides.bride.parents.father}
            mother={sides.bride.parents.mother}
            address={sides.bride.address}
            align="md:text-left md:pl-16"
            hairlineAlign="md:mx-0 md:ml-0 md:mr-auto"
            delay={0.4}
          />
        </div>

        <ScrollReveal delay={0.3}>
          <p className="mt-24 md:mt-32 text-center font-light text-[var(--color-ink-700)] max-w-xl mx-auto leading-[1.7] text-[1.0625rem] md:text-[1.125rem]">
            Trân trọng kính mời quý quan khách đến chung vui cùng gia đình
            chúng tôi trong ngày lễ thành hôn của hai con:
          </p>
        </ScrollReveal>

        {/* Son-đỏ ceremonial card — the page's only saturated color, used
            once. Traditional thiệp hồng 2:1 landscape: 囍 stamp anchors the
            left, names sit on the right, header tops the card. Two vertical
            couplets (永結同心 / 百年好合) flank the central content from the
            outer margins, and a 回紋 (meander) fretwork band wraps above and
            below. Multi-stage choreographed entrance with idle motion after
            landing: the 囍 breathes and five plum-blossom petals drift
            across the card. */}
        <div className="mt-16 md:mt-24 flex justify-center">
          <div className="w-full max-w-[640px]">
            <VermilionSeal
              groom="Gia Khôi"
              bride="Huyền Trân"
              date="02 · 08 · MMXXVI"
            />
          </div>
        </div>

        <ScrollReveal delay={0.4}>
          <p className="mt-12 text-center text-[0.65rem] md:text-xs font-medium tracking-[0.5em] uppercase text-[var(--color-ink-500)]">
            ấn son · 02 · 08 · 2026
          </p>
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
  /** Text-align utilities for the column on desktop. */
  align: string;
  /** Auto-margin utilities for the hairline so it lines up with the column's
   *  text alignment. The previous version always pushed it right, which left
   *  the Nhà Gái (right-column / left-aligned) hairline visually orphaned at
   *  the wrong edge. */
  hairlineAlign: string;
  delay: number;
}

function FamilyColumn({ label, father, mother, address, align, hairlineAlign, delay }: FamilyColumnProps) {
  return (
    <ScrollReveal delay={delay} className={`text-center ${align}`}>
      <p className="text-[0.7rem] md:text-xs font-medium tracking-[0.4em] uppercase text-[var(--color-ink-900)]">
        {label}
      </p>
      <span className={`block mx-auto mt-5 h-px w-12 bg-[var(--color-ink-400)]/50 ${hairlineAlign}`} />

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
