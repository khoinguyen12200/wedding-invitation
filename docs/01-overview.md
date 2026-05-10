# Overview

## The couple

**Gia Khôi & Huyền Trân.** Two ceremonies one month apart:

- **Lễ Ăn Hỏi** (engagement / lễ ăn hỏi) — **Chủ Nhật, ngày 5 tháng 7 năm 2026** (lunar 21/5, năm Bính Ngọ).
- **Lễ Cưới** (wedding) — **Chủ Nhật, ngày 2 tháng 8 năm 2026** (lunar 20/6, năm Bính Ngọ).

The site treats both as primary events — not one main + one footnote. Countdown, event cards, venue maps all show both.

## Purpose

A single-page wedding invitation website for a Vietnamese couple. Guests open the link from a phone (most likely from Zalo, Messenger, or SMS) and see a beautiful, animated invitation with the essential details: who, when, where, and how to celebrate.

The site lives at **two routes** — `/groom` for groom-side guests, `/bride` for bride-side guests. Both routes render the same components in the same order; only the ceremony times, venues (and possibly gift/RSVP contact) differ. See [Architecture §4](./02-architecture.md#4-two-routes-one-component-per-side-data-overrides) for the data shape.

## Audience

- **Primary**: Vietnamese-speaking guests (family members, friends, colleagues), age range 20–70. Most arrive on **mobile**, in portrait orientation, possibly on slow networks. Many will not have great taste for fussy UX — the page must feel obvious.
- **Secondary**: International guests who may need an English toggle. (Optional — see roadmap.)

## What "fantastic UI" means here

Not a template. Not a card. The user has been explicit: **the site must impress.** Motion is not decoration — it is the product. We are aiming for an Awwwards-tier experience that, when a guest opens the link, makes them stop scrolling Zalo and watch.

Concretely, that means:

- **Cinematic motion.** Scroll-driven storytelling, mask reveals, parallax depth, section transitions that feel choreographed. Not subtle "fade-up on view." Loud, intentional, expensive-feeling. See [Motion Choreography](./08-motion.md) for the full inventory of signature moments.
- **A real typographic system** — display + serif + Vietnamese-tuned sans, hand-tuned at every breakpoint. Not Tailwind defaults.
- **Imagery doing emotional heavy lifting**, but framed by motion that makes each photo land. Photos enter through masks and reveals, never plain fades.
- **One signature visual idea** — a recurring motif (floral mark, typographic glyph, ink wash, color shift) that threads the whole page so it reads as one continuous piece, not eight stacked sections.
- **A signature opening moment** — a 2–4 second hero entrance that earns the rest of the scroll. Think envelope opening, mask reveal, type morph.
- **Mobile-first, but desktop must show off.** On desktop we add cursor effects, deeper parallax, and any WebGL touches. The mobile experience is leaner but still cinematic.

The bar is: a guest watches the whole page through, end to end, the first time. They don't scroll past the hero. They don't bounce.

### What "impress" doesn't mean

We are not throwing every effect at the wall. Loud and considered are different. Specifically:

- No animation that delays content or blocks reading.
- No bounce, no spring overshoot on chrome (only on play moments).
- No autoplay sound. No carousel. No "scroll to discover" arrow.
- Everything degrades gracefully on `prefers-reduced-motion` and the Zalo in-app browser. A site that crashes on the bride's mom's phone is not impressive.

## Scope

**In scope**

- Single page, scroll-driven, all content rendered statically at build time.
- Vietnamese as the primary language. Diacritics-correct typography.
- Sections covered in [Content Structure](./04-content-structure.md): hero, save-the-date countdown, our story, ceremony details, gallery, venue map, gift info, thank-you.
- Responsive: mobile-first (375px and up), works up to desktop.
- Deployed to Firebase Hosting under a custom domain (TBD).
- Background music with a discreet mute toggle (optional, default off — see roadmap).

**Out of scope**

- No backend, no database, no auth.
- No RSVP form that writes to a server. If RSVP is desired, it links to Zalo / a Google Form / a phone number — see [Content Structure](./04-content-structure.md).
- No CMS. Content lives in TypeScript files in the repo.
- No analytics beyond basic Firebase Hosting metrics (revisit if needed).
- No multi-language switcher in v1 (English copy may be added inline if needed).

## Success criteria

1. The page loads and is interactive on a mid-tier Android phone over 4G in **under 3 seconds** to first meaningful paint.
2. All Vietnamese text renders with correct diacritics in every supported font weight.
3. Lighthouse mobile score ≥ 90 on Performance, Accessibility, Best Practices.
4. The couple is proud to share the link.

## Non-goals worth naming

- Not a generic "wedding website builder" — no admin UI, no theming engine. One couple, one site, hand-tuned.
- Not a SaaS — no users, no accounts.
- Not SEO-optimized for search engines. The link is shared directly; search traffic is irrelevant.
