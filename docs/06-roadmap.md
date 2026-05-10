# Roadmap

Phased plan from empty starter to deployed site. Each phase is a checkpoint where the work is shippable, even if incomplete.

## Phase 0 — Foundations (½ day)

Goal: project skeleton in place, ready for content and components.

- [ ] Install dependencies: `npm install motion lenis lucide-react sass`
- [ ] Flip `react-router.config.ts` to `ssr: false`
- [ ] Confirm `npm run build` produces `build/client/index.html`
- [ ] Move raw photos out of `public/` root into `public/photos/originals/` and gitignore that path (currently the 7 `LD3_*.jpg` files at ~84MB are committed — needs cleanup)
- [ ] Set up the photo build pipeline (decide: `vite-imagetools` vs hand-export with Sharp) and produce AVIF + WebP + JPG at 640w / 1280w / 1920w for each photo
- [ ] Set up SCSS entry: `app/styles/globals.scss`, `tokens.scss`, `mixins.scss`
- [ ] Wire SCSS into `app/root.tsx` alongside the Tailwind import
- [ ] Define design tokens in both `app.css` (Tailwind `@theme`) and `tokens.scss` — pick one as source of truth
- [ ] Add Vietnamese fonts (Be Vietnam Pro + Cormorant Garamond + Lora + Italianno) self-hosted via woff2 in `app/fonts/`, referenced in `globals.scss` `@font-face` with `latin` + `vietnamese` unicode-ranges
- [ ] Initialize Lenis at the root (skip on touch devices)
- [ ] Add `prefers-reduced-motion` context provider used by motion components
- [ ] Set up `firebase.json` and `.firebaserc` (see [Deployment](./05-deployment.md))
- [ ] Replace the React Router welcome route with an empty `home.tsx` route that renders `<main />`

**Done when:** site builds, deploys to a Firebase preview channel, shows a blank ivory page with the body font loaded correctly including diacritics.

## Phase 1 — Content scaffold + two-route setup (½–1 day)

Goal: all 10 sections present with placeholder content, both routes (`/groom`, `/bride`) wired, page is scrollable end-to-end.

- [ ] Update `app/routes.ts` to add `groom` and `bride` routes pointing to `home.tsx`
- [ ] Decide root (`/`) behavior: redirect to `/groom` (default) or render a neutral version. Implement choice
- [ ] Create `app/content/sides.ts` with the per-side overrides (events, venue, gifts, rsvp). Confirmed addresses go in; times stay `[TBD]`
- [ ] Create shared content files: `app/content/{couple,families,story,gallery,ui}.ts`
- [ ] Build a `SideContext` provider in `home.tsx` that reads the route and exposes `useSide()` to any section
- [ ] Build empty `<Section>` shells for all 10 sections in `app/sections/*` — Hero, Countdown, Story, **Families**, Events, Gallery, Venue, Gifts, RSVP, ThankYou
- [ ] Side-aware sections (Events, Venue, Gifts, RSVP) read from `useSide()`; shared sections ignore it
- [ ] Add the **side label** ("Trân trọng kính mời họ hàng nhà trai/gái") near the top of the page
- [ ] Compose all sections in `home.tsx` in the canonical order
- [ ] Add basic `SectionHeading` component
- [ ] Confirm scroll feels right on mobile (no horizontal overflow, comfortable section heights) on **both** routes
- [ ] Add a hidden anchor for each section so future nav links work

**Done when:** visiting `/groom` and `/bride` both render the full page with the right side-specific addresses already in place. Sections without per-side data are pixel-identical between routes.

## Phase 2 — Motion + hero (2–3 days)

The signature moment plus the global motion system. Disproportionate time investment because the user has explicitly asked for an Awwwards-tier feel — see [Motion Choreography](./08-motion.md). This is now **the** hardest phase.

- [ ] Build `app/lib/motion.ts` with all standard variants (`fadeUp`, `maskReveal`, `splitChars`, `splitLines`, `parallaxY`, `kenBurns`, `magnetic`, `staggerChildren`, `drawLine`)
- [ ] Build the **intro overlay** (3-second envelope/letter-open sequence) per [Motion §0](./08-motion.md#0-intro-overlay-page-open) — including session-cache, tap-to-skip, and Zalo bailout
- [ ] Hero photo pipeline: AVIF + WebP + JPG at 3 widths, blur-up LQIP, preloaded
- [ ] Hero entrance per [Motion §1](./08-motion.md#1-hero-entrance) — photo blur-in, brass rule, eyebrow, per-character name reveal, dates fade up, parallax engages
- [ ] Mobile portrait crop validated — both faces visible (using `LD3_0394.jpg`)
- [ ] Desktop landscape crop validated (using `LD3_0616.jpg`)
- [ ] Vietnamese diacritics tested in display sizes (verify "ặ", "ỡ", "ự" don't clash with line-height)
- [ ] LCP < 1.5s on a throttled 4G profile in Chrome DevTools
- [ ] Reduced-motion path tested in DevTools and on a phone with the OS setting on

**Done when:** opening the page on a phone feels expensive and intentional. Every motion variant is a reusable primitive. The couple says "wow" the first time they see it.

## Phase 3 — Choreographed sections (2–3 days)

Each section is a fully choreographed beat per [Motion Choreography](./08-motion.md), not a generic fade-up.

- [ ] Countdown — two countdowns (Lễ Ăn Hỏi + Lễ Cưới), client-side timers, opacity-crossfade on value change, floral parallax bg, post-event collapse for Lễ Ăn Hỏi after 5/7
- [ ] Story — scroll-scrubbed brass timeline line, alternating photo mask directions, per-line story reveals
- [ ] **Marquee divider** — horizontal couple-name + date strip between Story and Families, scroll-direction-reactive
- [ ] **Families / Trân trọng kính mời** — two-column block (Nhà Trai · Nhà Gái) with parents and addresses, vertical brass rule between columns on desktop, centered floral glyph, climactic per-character reveal of "Gia Khôi & Huyền Trân." Reverent pacing — slower than the rest of the page
- [ ] Events — two big cards (Lễ Ăn Hỏi + Lễ Cưới), top-down mask reveal, content sequenced inside, magnetic CTA on desktop
- [ ] Venue — embedded Google Maps `<iframe>` per ceremony, lazy-loaded with static placeholder
- [ ] Gifts — bank info, tap-to-copy with brass-flash + spring toast, optional VietQR
- [ ] Thank You — quiet final beat, script-font signature, optional outro fold

**Done when:** every section is content-complete and motion-complete, looks good on iPhone SE through 1440px desktop, holds 60fps during scroll.

## Phase 4 — Gallery (1–1.5 days)

- [ ] Photo pipeline run for all available photos (currently 5 usable raw + 2 share cards — request more from photographer)
- [ ] Asymmetric grid layout — not a uniform 3×3
- [ ] Per-row alternating mask reveal direction per [Motion §6](./08-motion.md#6-gallery)
- [ ] Scroll-linked Ken Burns on each photo while in viewport
- [ ] Lightbox via Framer Motion `layoutId` shared element transition — keyboard accessible, swipe-dismiss on mobile
- [ ] Captions optional, sans typeface, restrained

**Done when:** the gallery feels curated, not dumped — each photo lands like a beat, not a tile in a grid.

## Phase 5 — Polish (1 day)

- [ ] OG image and metadata for link previews (Zalo, Messenger preview cards)
- [ ] Favicon set including Apple touch icon
- [ ] Music toggle (optional, default off, persists to `localStorage`)
- [ ] `prefers-reduced-motion` audit: every animation has a static fallback
- [ ] Accessibility pass: alt text on all images, focus rings, color contrast ≥ 4.5:1 on body text, semantic landmarks
- [ ] Performance pass: Lighthouse mobile ≥ 90 on Performance/A11y/Best Practices
- [ ] Cross-browser smoke test: Safari iOS, Chrome Android, Zalo in-app browser

**Done when:** Lighthouse passes, link preview looks polished, the couple can share it without caveats.

## Phase 6 — Launch

- [ ] Final content swap — all `[TBD]` markers replaced
- [ ] Deploy to live channel: `firebase deploy --only hosting`
- [ ] Custom domain attached and SSL issued (if applicable)
- [ ] Share link tested in Zalo, Messenger, iMessage, SMS, email — all render the OG card correctly
- [ ] Couple reviews on their own phones

**Done when:** the link is shareable.

## Open questions

Resolved already:
- [x] Mood: A (Quiet luxury) — confirmed by the studio photo aesthetic
- [x] Ceremonies: Lễ Ăn Hỏi (5/7/2026) + Lễ Cưới (2/8/2026)

Still needed from the couple:
- [ ] Start times for each ceremony
- [ ] Venue addresses for both ceremonies
- [ ] Bank info for gifts — include or skip?
- [ ] RSVP via Zalo, Google Form, or skip?
- [ ] Background music — yes / no / which track?
- [ ] Custom domain — yes / no / what?
- [ ] English version — needed in v1 or skip for now?
- [ ] OG link preview — `LD3_0478` and `LD3_0609` are pre-rendered "Save the Date" cards from the photographer; use those as OG images, or do we want a hand-laid version?
- [ ] Story milestones — couple to provide 3–5 dated moments (when met, when started dating, when proposed, etc.)

## Risks / things to watch

- **Vietnamese diacritic stacking** in display fonts. Mitigation: pick families with strong Vietnamese support (Be Vietnam Pro, Cormorant, Lora are safe). Test early, before committing.
- **Photo weight is critical right now.** The 7 raw `LD3_*.jpg` files in `public/` total ~84MB. They are committed to git but must not ship. Phase 0 includes moving them out and building the resize pipeline; until that's done, every `npm run build` produces an unshippable bundle.
- **Zalo in-app browser quirks.** It's a Chromium fork but lags. Test there before declaring done. The intro overlay's panel-split wipe and any clip-path animations are the most fragile — they have explicit fallbacks in the motion doc.
- **Lenis on iOS.** Lenis fights iOS Safari momentum and feels broken. Disable on touch (the motion doc says so; the implementation must follow).
- **Two ceremony dates close together.** Lễ Ăn Hỏi is July 5 and Lễ Cưới is August 2 — 28 days apart. The site needs to handle "Lễ Ăn Hỏi is in the past, Lễ Cưới is upcoming" gracefully (the countdown has a post-event collapse for Lễ Ăn Hỏi).
- **Custom domain DNS propagation** can take 24–48h. Don't leave it for the day before the wedding.
- **Motion budget vs. stability trade-off.** Every fancy effect needs a reduced-motion fallback and a Zalo fallback. If we ship 9 sections of choreography but it tanks on the bride's mom's phone, we've shipped less than zero. Test on real devices early in Phase 2.
