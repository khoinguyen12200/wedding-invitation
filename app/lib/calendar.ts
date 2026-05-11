/* Calendar helpers — generate an .ics file and a Google Calendar
   compose URL for a ceremony.

   Why .ics: it's the universal calendar interchange format. Tapping
   one on iOS opens Apple Calendar with a pre-filled event; on Android
   the OS prompts to pick a calendar app (usually Google Calendar);
   on desktop the file imports into whatever calendar is configured.

   Why a Google Calendar URL too: on Android Chrome the .ics flow
   sometimes downloads to /Downloads/ instead of opening Calendar
   directly. The Google deep link is a reliable fallback for Android
   users who prefer GCal anyway. */

interface CalendarEvent {
  /** Event title — shown as SUMMARY in .ics, "text" param in GCal. */
  title: string;
  /** Calendar date in the local Vietnam calendar (Asia/Ho_Chi_Minh). */
  ymd: { year: number; month: number; day: number };
  /** Time range string from the ceremony data, e.g. "09:30 - 12:00".
   *  When the string isn't parseable (e.g. "TBD"), the event is
   *  written as an all-day event instead. */
  time: string;
  /** Free-form venue label rendered into the event location field. */
  location: string;
  /** Multi-line description; embed a URL back to the invite site here
   *  so the recipient can re-open it from their calendar entry. */
  description: string;
  /** Stable UID for the VEVENT. Required by ICS so updates de-dupe. */
  uid: string;
}

const pad = (n: number): string => n.toString().padStart(2, "0");

/* Try to parse a Vietnamese time-range string. Accepts:
     "09:30 - 12:00"
     "9h - 12h30"
     "9:00-12:30"
   Returns null when the string doesn't look like a time range — the
   caller then writes the event as all-day. */
function parseTimeRange(s: string): { startH: number; startM: number; endH: number; endM: number } | null {
  const m = s.match(/(\d{1,2})[:h](\d{0,2})\s*-\s*(\d{1,2})[:h](\d{0,2})/);
  if (!m) return null;
  return {
    startH: parseInt(m[1], 10),
    startM: m[2] ? parseInt(m[2], 10) : 0,
    endH: parseInt(m[3], 10),
    endM: m[4] ? parseInt(m[4], 10) : 0,
  };
}

const VN_TZ = "Asia/Ho_Chi_Minh";
const VN_OFFSET_HOURS = 7;

function nextDayYmd(year: number, month: number, day: number): { year: number; month: number; day: number } {
  /* Use UTC math so this is host-timezone-independent: a build running
     in any TZ produces the same calendar day +1. */
  const ms = Date.UTC(year, month - 1, day) + 24 * 3600 * 1000;
  const d = new Date(ms);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

function fmtUtcStamp(ms: number): string {
  const d = new Date(ms);
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/* RFC 5545 text escaping. Backslash first (so we don't double-escape
   the escapes we add next), then newlines, commas, semicolons. */
function icsEscape(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

/* Build the .ics file body. Two alarms are attached: one day before
   (recipients see it on Saturday for a Sunday ceremony) and two hours
   before (final reminder). For all-day events both alarms still fire,
   just relative to the day's start. */
export function buildIcsContent(ev: CalendarEvent): string {
  const t = parseTimeRange(ev.time);
  const { year, month, day } = ev.ymd;
  const ymdStr = `${year}${pad(month)}${pad(day)}`;

  let dtstart: string;
  let dtend: string;
  if (t) {
    dtstart = `DTSTART;TZID=${VN_TZ}:${ymdStr}T${pad(t.startH)}${pad(t.startM)}00`;
    dtend = `DTEND;TZID=${VN_TZ}:${ymdStr}T${pad(t.endH)}${pad(t.endM)}00`;
  } else {
    const next = nextDayYmd(year, month, day);
    const nextYmd = `${next.year}${pad(next.month)}${pad(next.day)}`;
    dtstart = `DTSTART;VALUE=DATE:${ymdStr}`;
    dtend = `DTEND;VALUE=DATE:${nextYmd}`;
  }

  const dtstamp = fmtUtcStamp(Date.now());

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Gia Khoi & Huyen Tran//Wedding Invitation//VI",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${ev.uid}`,
    `DTSTAMP:${dtstamp}`,
    dtstart,
    dtend,
    `SUMMARY:${icsEscape(ev.title)}`,
    `LOCATION:${icsEscape(ev.location)}`,
    `DESCRIPTION:${icsEscape(ev.description)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(ev.title)}`,
    "END:VALARM",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(ev.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

/* Build a Google Calendar render URL. Date format is UTC stamps for
   timed events ("YYYYMMDDTHHMMSSZ/...") or date-only for all-day
   ("YYYYMMDD/YYYYMMDD"). We URL-encode each param manually rather
   than via URLSearchParams because URLSearchParams escapes the `/`
   inside `dates`, which GCal rejects. */
export function buildGoogleCalendarUrl(ev: CalendarEvent): string {
  const t = parseTimeRange(ev.time);
  const { year, month, day } = ev.ymd;
  let datesParam: string;

  if (t) {
    /* Vietnam is UTC+7. We compute UTC by passing (localHour - 7) to
       Date.UTC — this is host-timezone-independent. */
    const startMs = Date.UTC(year, month - 1, day, t.startH - VN_OFFSET_HOURS, t.startM);
    const endMs = Date.UTC(year, month - 1, day, t.endH - VN_OFFSET_HOURS, t.endM);
    datesParam = `${fmtUtcStamp(startMs)}/${fmtUtcStamp(endMs)}`;
  } else {
    const ymdStr = `${year}${pad(month)}${pad(day)}`;
    const next = nextDayYmd(year, month, day);
    const nextYmd = `${next.year}${pad(next.month)}${pad(next.day)}`;
    datesParam = `${ymdStr}/${nextYmd}`;
  }

  const enc = encodeURIComponent;
  return (
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${enc(ev.title)}` +
    `&dates=${datesParam}` +
    `&location=${enc(ev.location)}` +
    `&details=${enc(ev.description)}` +
    `&ctz=${enc(VN_TZ)}`
  );
}

/* Trigger a client-side download of the .ics blob. Used by the
   calendar button — Safari/iOS interprets the file as a calendar
   event and pops the Add-to-Calendar sheet; Android prompts for an
   app to handle it. Falls back to Downloads/ silently if no handler
   is registered, which is harmless. */
export function downloadIcs(ev: CalendarEvent, filename: string): void {
  const ics = buildIcsContent(ev);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  /* Give the browser a tick to start consuming the blob before we
     revoke. Some mobile browsers (notably WebView-based ones) need
     this — revoking immediately can cancel the download. */
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
