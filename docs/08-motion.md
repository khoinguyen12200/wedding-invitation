# Motion Choreography

This is the per-section motion script. The principles and tooling live in [Design System §Motion](./03-design-system.md#motion); this doc says exactly what happens, in what order, with what timing, on each part of the page.

Read this like a film shot list. Each beat has a timing, a trigger, a fallback for `prefers-reduced-motion`, and a bail-out for the Zalo in-app browser when the effect is fragile.

## Global setup

- **Smooth scroll**: Lenis wraps the page on desktop. On touch devices we leave native scroll alone — Lenis on iOS Safari fights momentum and feels broken.
- **Scroll progress** is exposed via Framer Motion's `useScroll()` at the page level and per-section via `useScroll({ target: ref, offset: ["start end", "end start"] })`.
- **All transforms** use the shared `easeExpoOut = [0.16, 1, 0.3, 1]` from `app/lib/motion.ts`.
- **`prefers-reduced-motion` toggle** is read once at the root and provided via context. Components opt into the reduced path explicitly — no animation library auto-magic.
- **Fonts must load before the intro plays.** Use `document.fonts.ready` in the intro overlay so we never animate text mid-FOUT.

## 0. Intro overlay (page open)

**The moment a guest taps the link, this is the first thing they see.** It runs once per session (cached in `sessionStorage`); revisits within the session skip straight to the page.

**Beats:**

1. `t = 0`: solid `--ink-900` viewport. Brass favicon-style floral mark sits centered, scale 0.9, opacity 0.
2. `t = 200ms`: mark fades in, scales to 1.0 over 600ms.
3. `t = 800ms`: brass hairline draws horizontally outward from the mark, 600ms.
4. `t = 1200ms`: small caps line "Trân trọng kính mời" types in (per-character mask, 30ms stagger).
5. `t = 2200ms`: full-screen wipe — the ink panel splits horizontally and slides out top + bottom over 900ms. The hero photo is already loaded behind it.
6. `t = 3100ms`: overlay unmounted, hero entrance starts (see §1).

**Total runtime:** ~3 seconds. Tappable to skip — tapping triggers an immediate fade to ink-0% and skips to step 6.

**Reduced motion:** overlay shows for 400ms with a static fade out. No type-in, no draw, no wipe.

**Zalo bailout:** if the user agent string contains `Zalo`, swap the panel-split wipe for a single opacity fade. The split clip-path drops frames in Zalo's WebView.

## 1. Hero entrance

The signature moment. Couple's names, date, photo. Has 90% of the budget.

**Layout:** photo full-bleed in background; couple names center; date below; brass rule above the names.

**Beats (assumes intro overlay just finished):**

1. `t = 0`: hero photo already at opacity 0, scale 1.04, slight blur(8px). Begin: opacity → 1, scale → 1.0, blur → 0, over 1.6s.
2. `t = 300ms`: brass rule draws left-to-right, 800ms.
3. `t = 600ms`: small-caps eyebrow "Save the Date" fades up 16px, 700ms.
4. `t = 900ms`: couple names appear via per-character mask reveal (`splitChars` variant). "Gia Khôi" reveals left-to-right; "Huyền Trân" reveals left-to-right after a 200ms delay. Italianno script ampersand `&` between them fades in last with a slow scale 0.8 → 1.0.
5. `t = 1900ms`: dates (both ceremonies) fade up below names, 600ms.
6. `t = 2300ms`: subtle parallax engages — the hero photo translates `-4%` on `Y` over the next 1500ms while the user starts to scroll, signaling the page is alive.

**During scroll** (continuous, not discrete):
- Photo `y` shifts at parallax depth `0.3` (slower than scroll).
- Couple names `y` shifts at depth `-0.15` (faster than scroll, exits up sooner).
- Brass rule fades out at scroll progress 0.6.

**Reduced motion:** photo fades in at 600ms, names + date fade up together at 800ms, no parallax, no scrub.

## 2. Save-the-date / countdown

Two countdowns — one to **Lễ Ăn Hỏi** (5/7/2026), one to **Lễ Cưới** (2/8/2026). Layout: vertical stack on mobile, side-by-side on desktop.

**Beats on enter:**

1. Section eyebrow "Còn lại" fades up.
2. Each countdown card slides up 32px with 80ms stagger.
3. Numbers do **not** flip or roulette. They fade-cross between values (opacity-only crossfade, 200ms) when the value changes. Restrained.
4. A thin brass line under each card draws in over 700ms after the card lands.

**Continuous:**
- Numbers update every second. With reduced motion, every minute, and seconds slot is hidden.
- A single floral motif drifts very slowly in the background of this section, parallax depth `0.1`. Off when reduced motion is on.

## 3. Our story

Vertical timeline on the left, milestone content on the right. Three to five milestones.

**Beats per milestone (triggered when the milestone scrolls past 60% viewport):**

1. The vertical brass timeline line **draws downward** to this milestone's marker. The draw is scrub-linked to scroll, not on-enter, so the line is always exactly as long as how far you've read.
2. The milestone marker (a small filled circle) `scale 0 → 1`, 400ms.
3. Date label fades in left, 500ms.
4. Title fades up, 600ms.
5. Body paragraph splits per line and reveals with mask, 80ms stagger.
6. Optional milestone photo enters via side mask — direction alternates per milestone (left, right, left, right).

**Reduced motion:** the timeline line is fully drawn at section enter. Milestones fade in together when their parent enters view, no scrub.

## 4. Marquee divider

Between Story and Families: a horizontal marquee strip threading the page together. Used as the bridge from emotional content (Story) to formal content (Families + Events).

**Content:** "Gia Khôi & Huyền Trân · 02.08.2026 · Gia Khôi & Huyền Trân · 02.08.2026 · …" repeating.

**Behavior:**
- Scrolls horizontally on a continuous loop, 60s per cycle.
- Direction-reversed when the user scrolls *up* — gives a satisfying interplay with scroll direction.
- Display serif, italic, large (clamp to 14vw), brass on ivory.
- Reused as a divider before Gallery and before Thank-You.

**Reduced motion:** static text, no scroll loop.

## 5. Families / Trân trọng kính mời

The formal invitation block. Two columns (Nhà Trai left, Nhà Gái right on desktop), centered invitation language below. The motion here is **deliberately quieter** than its neighbors — Story before is scroll-scrubbed and active, Events after is mask-driven and visual; this block is reverent.

**Beats on enter (triggered when the section's eyebrow crosses 70% viewport):**

1. Eyebrow "Trân trọng kính mời" reveals via `splitChars`, 30ms stagger, 700ms total.
2. The two column headers ("NHÀ TRAI" / "NHÀ GÁI") fade up together, 600ms.
3. **Brass underline draws** beneath each column header simultaneously, 500ms — uses the `drawLine` variant.
4. **Vertical brass rule** between the two columns draws downward from the top of the column block, 900ms — only on desktop (`md+`). On mobile the columns stack and this rule is absent.
5. Within each column, lines reveal sequentially with 100ms stagger: father → mother → address (3 lines, each via `splitLines` mask). Both columns animate in parallel — left and right reveal at the same time, not one-after-the-other.
6. The centered glyph (the brass floral mark, same as favicon) fades in with a slow scale 0.85 → 1.0, 800ms, 400ms after columns finish.
7. The final invitation paragraph reveals via `splitLines`, 80ms stagger.
8. **The couple's names** "Gia Khôi & Huyền Trân" appear last as the climax of this section: per-character mask reveal (`splitChars`), display serif italic, oversized. The script `&` between them fades in last with a 1.0s scale 0.7 → 1.0. Total runtime ~1.4s.

**Hover (desktop only):**
- The address lines have a subtle tap-to-copy affordance — on hover the address gets a brass underline that draws in (`drawLine`, 400ms). On tap, the address copies and a small "Đã sao chép" toast appears in the corner of that column (same pattern as Gifts §9, but smaller and positioned in-column).

**Reduced motion:** eyebrow + columns + paragraph all fade in together, no per-line stagger, no draw lines. The centered glyph appears static. Couple's names fade in as a single unit, no per-character.

**Why this matters.** This is the section parents and elders will scrutinize most. Speed and flashiness here read as disrespectful. The motion needs to feel like an unfolding paper invitation — paced, considered, weighty. Don't be tempted to add parallax or scroll-scrub here.

## 6. Events (Lễ Ăn Hỏi + Lễ Cưới)

Two cards, large, one per ceremony. Each card has a venue address and a "Chỉ Đường" CTA.

**Beats per card (sequential, not staggered — these are big):**

1. Card enters via mask reveal, top-down, 1.0s.
2. Inside the card, content reveals in this order: ceremony title (small caps eyebrow) → solar date display → lunar date secondary line → time → venue name → address → CTA button.
3. Each line uses `splitLines` mask reveal, 80ms stagger, starting 300ms after the card finishes its mask.

**Hover (desktop only):**
- The CTA button uses the `magnetic` variant — it gently translates toward the cursor when within 80px.
- The card's address line gets a tap-to-copy affordance with a brass underline that draws in on hover.

**Reduced motion:** card fades in, content all visible at once, no stagger.

## 7. Gallery

Asymmetric grid of 8–12 photos. Mix of aspect ratios. The visual climax of the page.

**Layout choreography:**
- Photos are placed in 2-column rows on mobile, 3–4 column staggered grid on desktop.
- Row alternates reveal direction: row 1 reveals top-down, row 2 reveals bottom-up, row 3 left-to-right, row 4 right-to-left, etc. This rhythm is the "feel" of the gallery.

**Per-photo beat (when photo enters viewport):**

1. Mask reveal in the row's direction, 1.2s, expo-out.
2. After the mask completes, photo begins a slow Ken Burns: scale 1.05 → 1.0 over the entire scroll duration the photo is on screen (scroll-linked).
3. On hover (desktop): scale to 1.03, brightness up 8%, 400ms.

**Lightbox (optional, Phase 4):**
- Tap a photo: it animates from its grid position to fullscreen using Framer Motion `layoutId`. 800ms.
- Pinch-zoom and swipe-dismiss on mobile.
- Background blurs to ink with 0.85 opacity.

**Reduced motion:** plain opacity fade, no Ken Burns, no row direction trick.

## 8. Venue (map)

One map per ceremony. Embedded Google Maps `<iframe>`. Cards stack vertically.

**Beats:**

1. Section eyebrow fades up.
2. Map card enters with mask reveal, 1.0s.
3. The map `<iframe>` loads lazily — placeholder is a static map screenshot (Google Static Maps URL or hand-saved PNG) that fades to the live iframe when ready.
4. CTA "Chỉ Đường" button uses `magnetic` on desktop.

**Reduced motion:** card fades in, no mask.

## 9. Gifts

Bank info per side (groom, bride). Tap-to-copy account numbers with success feedback.

**Beats:**

1. Eyebrow + heading reveal.
2. Two cards (groom side, bride side) reveal with 200ms stagger.
3. Each card line reveals via `splitLines`.
4. QR codes (if used) fade in last with subtle scale 0.92 → 1.0.

**Tap-to-copy interaction:**

1. Tap account number → copy to clipboard.
2. Account number flashes brass briefly (200ms color flash).
3. Toast appears at the top of the section: "Đã sao chép" (Copied) — slides down from -16px, holds 1.6s, slides up out. Uses spring (because it's a play moment).

**Reduced motion:** copy still works, toast appears without the slide, no flash.

## 10. Thank you (outro)

Closing beat. A quiet fade.

**Beats:**

1. Floral motif fades in centered, 600ms.
2. "Lời cảm ơn" eyebrow fades up.
3. Body paragraph reveals via `splitLines`.
4. Couple name signature fades in last in script font (Italianno), 1.0s.
5. Brass rule draws below the signature, 800ms.

**Outro fold (optional, on scroll-end):**
- When the user has reached the page bottom and stopped scrolling for 800ms, the entire page subtly scales down 1% and the ink color of the background warms slightly. Mirrors the "envelope closing" feeling of the intro.
- Releases on any subsequent scroll.

**Reduced motion:** no outro fold, no script-font animation, simple opacity fade.

## Performance budget

| Concern | Limit |
| --- | --- |
| Hero LCP | < 1.5s on throttled 4G |
| Total JS for motion | < 60KB gz (Framer Motion is ~50KB; Lenis is ~6KB) |
| Layout thrash during scroll | Zero — every animated property is `transform` or `opacity` only |
| Frame rate target | 60fps on a 2021 mid-tier Android (Pixel 5a), 30fps minimum on Zalo WebView |

If a beat in this doc costs more than 2 frames during scroll, it gets cut or simplified.

## Checklist before declaring motion done

- [ ] Lighthouse mobile Performance ≥ 90
- [ ] All 8 sections tested with `prefers-reduced-motion: reduce` — each path is verified, not just "does nothing break"
- [ ] Tested in Zalo in-app browser on a real phone (not just Chrome DevTools UA spoofing)
- [ ] Tested on iOS Safari (gesture areas, momentum scroll)
- [ ] Tested on a low-end Android (Pixel 4a or older)
- [ ] No CLS from images (every `<picture>` has `width`/`height` or `aspect-ratio`)
- [ ] Intro overlay skips on tap; never blocks interaction
- [ ] No animation prevents the user from reading the page if they tap before it finishes
