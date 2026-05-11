import { motion } from "motion/react";
import { ScrollReveal, MaskReveal } from "../../components/ScrollReveal";
import { couple } from "../../content/couple";
import type { Side } from "../../content/sides";
import { buildGoogleCalendarUrl, downloadIcs } from "../../lib/calendar";
import { easeExpoOut } from "../../lib/motion";

interface EventsProps {
  side: Side;
}

export function Events({ side }: EventsProps) {
  const fullAddress = `${side.address.street}, ${side.address.ward}, ${side.address.province}`;
  const mapsUrl = side.mapsUrl;

  /* Calendar event derived from the side's ceremony. The UID is
     deterministic per (ceremony × side) so re-adding doesn't create
     duplicates — the calendar app updates the existing event. */
  const venue = `${side.hostFamilyLabel}, ${fullAddress}`;
  const description =
    `Trân trọng kính mời quý quan khách đến chung vui ngày ${side.ceremony.label} ` +
    `của chúng con.\n\n` +
    `https://gk-ht.web.app`;
  const calendarEvent = {
    title: `${side.ceremony.label} · ${couple.groom.full} & ${couple.bride.full}`,
    ymd: side.ceremony.solar,
    time: side.time,
    location: venue,
    description,
    uid: `${side.ceremony.label.replace(/\s+/g, "-")}-${side.key}-2026@gk-ht.web.app`,
  };
  const gcalUrl = buildGoogleCalendarUrl(calendarEvent);
  const onAddToCalendar = () => {
    downloadIcs(calendarEvent, `${side.ceremony.label.replace(/\s+/g, "-")}.ics`);
  };

  return (
    <section
      className="relative overflow-hidden px-6 md:px-12 py-32 md:py-56"
      style={{ background: "var(--color-paper-50)" }}
      aria-label={side.ceremony.label}
    >
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <p className="text-[0.65rem] md:text-xs font-medium tracking-[0.5em] uppercase text-[var(--color-ink-500)]">
            Sự kiện
          </p>
        </ScrollReveal>

        <MaskReveal delay={0.15} direction="down">
          <h2
            className="font-luxury mt-6 text-[var(--color-ink-900)]"
            style={{ fontSize: "clamp(3.5rem,2rem+8vw,8rem)" }}
          >
            {side.ceremony.label}
          </h2>
        </MaskReveal>

        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, delay: 0.4, ease: easeExpoOut }}
          style={{ originX: 0 }}
          className="block mt-10 md:mt-14 h-px w-full bg-[var(--color-ink-400)]/35"
        />

        <div className="mt-12 md:mt-16 grid md:grid-cols-[max-content_1fr] gap-x-12 md:gap-x-20 gap-y-3">
          <ScrollReveal delay={0.3}>
            <p className="text-[0.65rem] md:text-xs font-medium tracking-[0.4em] uppercase text-[var(--color-ink-500)] md:pt-2">
              Ngày
            </p>
          </ScrollReveal>
          <div>
            <ScrollReveal delay={0.35}>
              <p className="font-light text-[var(--color-ink-900)] text-[1.125rem] md:text-xl leading-snug">
                {side.ceremony.solarFull}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <p className="mt-1 font-light italic text-[var(--color-ink-500)] text-base">
                Nhằm ngày {side.ceremony.lunar}
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div className="mt-12 md:mt-16 grid md:grid-cols-[max-content_1fr] gap-x-12 md:gap-x-20 gap-y-3">
          <ScrollReveal delay={0.45}>
            <p className="text-[0.65rem] md:text-xs font-medium tracking-[0.4em] uppercase text-[var(--color-ink-500)] md:pt-3">
              Giờ tổ chức
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.5}>
            <p
              className="font-luxury text-[var(--color-ink-900)] leading-[0.95]"
              style={{ fontSize: "clamp(2rem,1.2rem+3vw,3rem)", paddingBlock: "0.05em" }}
            >
              {side.time === "TBD" ? "—" : side.time}
            </p>
          </ScrollReveal>
        </div>

        <div className="mt-12 md:mt-16 grid md:grid-cols-[max-content_1fr] gap-x-12 md:gap-x-20 gap-y-3">
          <ScrollReveal delay={0.55}>
            <p className="text-[0.65rem] md:text-xs font-medium tracking-[0.4em] uppercase text-[var(--color-ink-500)] md:pt-2">
              Địa điểm
            </p>
          </ScrollReveal>
          <div>
            <ScrollReveal delay={0.6}>
              <p className="text-[var(--color-ink-900)] font-medium text-xl md:text-2xl leading-tight">
                {side.hostFamilyLabel}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.65}>
              <p className="mt-2 font-light text-[var(--color-ink-700)] leading-relaxed text-[1.0625rem] md:text-lg">
                {side.address.street},<br />
                {side.address.ward}, {side.address.province}
              </p>
            </ScrollReveal>
          </div>
        </div>

        <ScrollReveal delay={0.75}>
          <div className="mt-16 md:mt-20 flex flex-col items-start gap-5">
            <div className="flex flex-wrap items-baseline gap-x-10 gap-y-5">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-baseline gap-3 text-xs md:text-sm font-medium tracking-[0.32em] uppercase text-[var(--color-ink-900)] border-b border-[var(--color-ink-400)]/50 hover:border-[var(--color-ink-900)] pb-2 transition-colors"
              >
                <span>Chỉ đường</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: easeExpoOut }}
                  className="inline-block"
                  aria-hidden="true"
                >
                  →
                </motion.span>
              </a>

              {/* Add-to-calendar action — generates a .ics file and
                  triggers a download. iOS opens Apple Calendar; Android
                  prompts to pick a calendar app. Two alarms baked in
                  (1 day before, 2 hours before). */}
              <button
                type="button"
                onClick={onAddToCalendar}
                className="group inline-flex items-baseline gap-3 text-xs md:text-sm font-medium tracking-[0.32em] uppercase text-[var(--color-ink-900)] border-b border-[var(--color-ink-400)]/50 hover:border-[var(--color-ink-900)] pb-2 transition-colors"
              >
                <span>Thêm vào lịch</span>
                <motion.span
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: easeExpoOut }}
                  className="inline-block"
                  aria-hidden="true"
                >
                  ↓
                </motion.span>
              </button>
            </div>

            {/* Tertiary fallback for Android Chrome where the .ics
                download sometimes silently lands in /Downloads. The
                Google Calendar deep link opens a pre-filled compose
                form in the GCal app or web. */}
            <a
              href={gcalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.7rem] md:text-xs font-light tracking-[0.24em] uppercase text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] transition-colors"
            >
              Hoặc mở bằng Google Lịch <span aria-hidden>↗</span>
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.9}>
          <p className="mt-24 text-xs font-light italic text-[var(--color-ink-500)]">
            Trân trọng kính mời {side.label.toLowerCase()}.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
