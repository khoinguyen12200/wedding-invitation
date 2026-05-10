# PRODUCT

## What this is

A wedding invitation website for **Gia Khôi & Huyền Trân**. Single page, all Vietnamese, hosted on Firebase. Two routes — `/groom` (groom-side) and `/bride` (bride-side) — same components, different ceremony times and venues.

Two ceremonies:
- **Lễ Ăn Hỏi** — Sunday, July 5, 2026 (lunar 21/5, năm Bính Ngọ)
- **Lễ Cưới** — Sunday, August 2, 2026 (lunar 20/6, năm Bính Ngọ)

## Register

**Brand.** The design IS the product. The visitor's impression — the moment they tap the link in Zalo — is the deliverable.

## Users

- **Vietnamese guests aged ~25–70**, mostly mobile (Zalo in-app browser is the dominant context). Many will be older relatives. Many will be first-time visitors who arrive with no expectation; they're not "users of an app," they're guests being formally invited.
- Two distinct cohorts: **groom-side** and **bride-side** (`/groom` and `/bride`). Each cohort sees their own ceremony times and venues.
- Most opens are one-shot: tap link, scroll once, share or close. The page must work end to end on first scroll.

## Brand voice

Three concrete words: **cinematic, hushed, full-frame.**

- *Cinematic* — the page advances like a film. Photos are the medium, not decoration. Scroll = projector.
- *Hushed* — confident silence. Big type, deep color, no chrome chatter. Reverence over decoration.
- *Full-frame* — photos go edge to edge. Type goes huge. Whitespace is generous. Nothing is timid.

## Strategic principles

1. **Photography is the medium.** The studio portraits (light-on-light, soft shadow, Mekong-Delta studio) are the entire emotional surface. Type sits with them, not on top of them.
2. **Vietnamese-first typography.** Diacritics ("ặ", "ỡ", "ự") are stress-tested at every display size. The font is *designed* for Vietnamese — Be Vietnam Pro — not adapted to it.
3. **Drenched color, single hue.** Deep wine-rose surface. Cream type. No competing accents. Color carries the voice; it isn't a tint.
4. **Reverence in the formal block.** The Families section ("Trân trọng kính mời" with both sets of parents named) is the most ceremonially weighted block. Motion there is paced and quiet, not flashy. Elders should not feel flash where they expect formality.
5. **Two routes, one product.** Groom-side and bride-side guests each get their own URL. Same design, different ceremony data. Don't build two products; build one product with one data axis.

## Anti-references — what we are NOT

- **Not editorial-typographic.** Cormorant / Playfair / Fraunces / drawn brass rules / small caps eyebrows / cream-and-ivory restraint = the saturated AI-template aesthetic of late 2025. Refuse on sight.
- **Not Pinterest wedding.** Floral watercolor borders, calligraphy script for everything, baby pink, "Mr. & Mrs.," gold-foil PNG overlays.
- **Not Squarespace template.** Centered hero stack with icon-title-subtitle cards, identical card grids for events, generic countdown flip-numbers.
- **Not Western-default.** No Roman dates without lunar dates, no English titles ("Save the Date") without Vietnamese parity, no defaulting to Western typography for Vietnamese names.
- **Not flashy where reverence is expected.** Parents' names don't bounce in. Family addresses don't have parallax. The Families block earns its motion budget through restraint, not effects.

## Success criteria

1. A guest opens the link in Zalo on a mid-tier Android. The hero LCP is under 1.5 seconds. They are pulled in.
2. Vietnamese diacritics render correctly at every size. No clashing tone marks at display weight.
3. Both `/groom` and `/bride` work end-to-end with their respective ceremony data.
4. Lighthouse mobile ≥ 90 on Performance / Accessibility / Best Practices.
5. The couple says "wow." Their parents say "trang trọng" (formal/respectful).

## Out of scope

- No backend. No CMS. No DB. Content lives in TypeScript files in the repo.
- No analytics beyond Firebase Hosting basics.
- No multilingual switcher (Vietnamese only in v1).
- No RSVP form that writes to a server. RSVP, if included, links to Zalo or a Google Form.
