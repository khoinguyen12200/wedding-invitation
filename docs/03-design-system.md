# Design System

This is the visual contract for the site. The goal is one coherent, considered look — not a kitchen sink of effects.

## Direction

The user has asked for a "fantastic UI." That rules out generic floral templates. We're targeting **editorial wedding** — closer to a fashion magazine cover than a greeting card. Big quiet typography, generous whitespace, a small number of premium colors, photography that breathes.

Two candidate moods are sketched below. The couple should pick one (or hand us a reference image and we'll calibrate). The rest of this doc assumes Mood A by default; swap tokens if Mood B is chosen.

### Mood A — *Quiet luxury, warm ivory*

Cream paper, deep ink black, a single accent of antique brass. Serif display, sans body. Reads like an invitation card from a Hanoi atelier. Restrained motion: long fades, slow parallax, no bounce. **Default mood.**

### Mood B — *Romantic dusk, deep red*

Áo dài red against muted blush and warm shadow. Brushy display serif (think of a wedding scroll), gold foil accents used sparingly. Slightly more dramatic motion: typographic reveals, ink-bleed transitions on section breaks.

> **[TBD]** Couple to confirm mood. Reference images from the couple welcome.

---

## Typography

Vietnamese-tuned families with `latin` + `vietnamese` subsets. Self-host woff2 in production for performance.

| Role | Family (Mood A) | Family (Mood B) | Notes |
| --- | --- | --- | --- |
| Display | **Cormorant Garamond** | **Playfair Display** | Used at 48–144px. `font-variation-settings` with optical size if available. |
| Serif body | **Lora** | **Lora** | 16–20px body copy, "story" sections. |
| Sans (UI / labels) | **Be Vietnam Pro** | **Be Vietnam Pro** | Designed for Vietnamese diacritics. Use for buttons, captions, dates. |
| Script accent (sparingly) | **Italianno** | **Pinyon Script** | Used max 1–2 times, for the couple's first names or a "& tình yêu" flourish. Never for body. |

Type scale (modular, ratio 1.25):

```
xs   12 / 16     labels, footnotes
sm   14 / 20     captions
base 16 / 26     body
lg   20 / 30     lead paragraphs
xl   24 / 32     subhead
2xl  32 / 40     section titles (mobile)
3xl  48 / 56     section titles (desktop)
4xl  72 / 80     hero secondary
5xl  96 / 100    hero primary (mobile)
6xl  144 / 144   hero primary (desktop)
```

**Vietnamese line-height rule.** Anything with display weight + diacritics needs at least `1.15` line-height to avoid stacking issues with "ặ", "ỡ", "ự". Test in `Be Vietnam Pro Black` and `Cormorant SemiBold` first.

## Color tokens

### Mood A — Quiet luxury (default)

```
--ivory-50   #FBF7F0   page background
--ivory-100  #F4ECDD
--ink-900    #1A1410   primary text
--ink-700    #3B302A   secondary text
--ink-500    #6E5E51   muted text, dividers
--brass-500  #A57F3D   single accent
--brass-300  #D4B27A   accent hover / glow
--rose-100   #EFD8CE   sparingly, romantic touches
--white      #FFFFFF
```

### Mood B — Romantic dusk (alternate)

```
--blush-50   #F8E8E0
--blush-100  #EBC9BC
--ruby-700   #6E1F22
--ruby-500   #9B2C2F
--gold-500   #B68B3A
--ink-900    #1F1414
--shadow     rgba(31, 20, 20, 0.65)
```

Tokens are mirrored in **`app/styles/tokens.scss`** (SCSS variables) and the Tailwind theme (CSS variables in `@theme` block in `app.css`). Both must stay in sync — pick one source of truth and re-export. Decision in roadmap.

## Motion

The motion budget for this site is large. We're aiming Awwwards-tier — restrained but ambitious, choreographed not random. **Framer Motion** (`motion` package) is the primary tool. **Lenis** for smooth scroll. GSAP allowed as an escape hatch only if a specific scroll-pinned scrub can't be done in Framer Motion's `useScroll` cleanly.

The full per-section choreography lives in [08-motion.md](./08-motion.md). This section sets the principles those choreographies are built from.

### Principles

1. **Choreography over animation.** Every reveal is part of a sequence with intentional order, timing, and rhythm. Avoid "everything fades up at 0.4s on view" — that reads as a template.
2. **Slow over fast.** Hero and section opens use `0.9s–1.6s` durations. Micro-interactions (hover, tap, copy) stay under `0.3s`.
3. **One signature easing**: `[0.16, 1, 0.3, 1]` (ease-out-expo). Used everywhere. Defined once in `app/lib/motion.ts` as `easeExpoOut`. Consistency = polish.
4. **No bouncing, no spring overshoot on chrome.** Springs only on play moments — music toggle, gallery hover, copy-success feedback.
5. **Stagger by 60–100ms.** Tight enough to feel alive, loose enough to read.
6. **Mask reveals over fades.** Where possible, photos enter via clipping mask (top-down, side-sweep, or radial), not plain opacity. Text enters via `clipPath` or per-line mask, not just translate-up.
7. **Scroll is the primary timeline.** Treat the page as a scrubbable film. Use `useScroll` with `offset` to pin behavior to specific scroll regions per section.
8. **Layered depth.** Hero, story, and gallery have at least 2–3 parallax layers (background photo, midground typography, foreground accent). Mobile drops to 2 layers max.
9. **Reduced-motion is a real path, not a token gesture.** When the user has it on: replace transforms with opacity-only, drop parallax/scrub entirely, kill the intro overlay, instant-on countdown. The site must still feel intentional in this mode.
10. **Test on Zalo in-app browser early.** Half the audience opens the link there. If a fancy effect drops to 15fps in Zalo, cut it.

### Tools and packages

```
npm install motion lenis
```

- `motion` — Framer Motion v11+, the core animation library.
- `lenis` — buttery smooth scroll, used site-wide. Disabled automatically on touch devices where native momentum is better.
- *Optional, only if needed:* `gsap` + `@gsap/react` for any scroll-pinned scrubbing the Framer Motion `useScroll` API can't express. Default: don't add it.

### Standard variants (defined in `lib/motion.ts`)

The library of variants we compose section animations from. Each section may extend with its own bespoke variant; these are the shared baseline.

| Variant | Description | Where used |
| --- | --- | --- |
| `fadeUp` | opacity 0→1, y +32→0, 1.0s, expo-out | section intros, fallback |
| `maskReveal` | `clip-path: inset(100% 0 0 0)` → `inset(0 0 0 0)`, 1.4s | photos, hero name |
| `maskRevealSide` | side-sweep clip, 1.2s | story photos, gallery rows |
| `splitChars` | per-character mask + y +1em → 0, stagger 30ms | hero couple names |
| `splitLines` | per-line mask, stagger 80ms | story paragraphs, thank-you |
| `parallaxY(depth)` | scroll-linked translateY, depth 0.1–0.4 | hero, story, gallery backgrounds |
| `kenBurns` | 8s scale 1.05 → 1.0 + slight pan | gallery hero shots |
| `magnetic` | cursor-following translate on desktop | event cards, CTA links |
| `staggerChildren` | base 0.08s | event cards, story milestones |
| `drawLine` | stroke-dasharray draw, 0.9s | brass dividers, timeline rule |

### Signature moments

These are the deliberate "wow" beats spread across the page. Each is choreographed in detail in [08-motion.md](./08-motion.md).

1. **Intro overlay** — 2–3s envelope/letter open before the page reveals. Skippable on tap.
2. **Hero entrance** — names appear via per-character mask; date types in; brass rule draws; photo fades up behind with parallax already engaged.
3. **Scroll-pinned name morph** — couple's names start hero-large, scrub-shrink to a header-sized mark as the user scrolls into Story.
4. **Story timeline scrub** — vertical scroll drives a horizontal timeline beneath the milestones; line draws as you read.
5. **Gallery mask reveals** — each photo enters via a directional clip-path, alternating direction by row.
6. **Marquee strips between sections** — couple's names + date in a slow horizontal marquee, used as section dividers, threading the page into one piece.
7. **Section curtain transitions** — a subtle ink/wash overlay sweeps as the user crosses certain section boundaries (hero → countdown, gallery → venue).
8. **Ambient micro-motion** — drifting petals or a single floral motif gently parallaxing in the background of hero and thank-you. Off when reduced-motion is on.
9. **Outro fold** — at the very bottom of the page, the thank-you "folds back" with a slow scale-down on scroll-end, mirroring the intro envelope.

Each is optional individually but cumulatively they are the product. Phase 2 of the [Roadmap](./06-roadmap.md) is the motion phase.

## Component vocabulary

A short list of recurring primitives we'll build:

- **`SectionHeading`** — eyebrow label (sans, uppercase, tracked) + main title (serif display) + optional rule.
- **`ScrollReveal`** — wraps children, applies `fadeUp` variant when `whileInView`. The single primitive used to animate sections in.
- **`Image`** — responsive `<picture>` with AVIF/WebP/JPG, blur-up placeholder, optional Ken Burns slow zoom for gallery hero shots.
- **`Divider`** — thin brass rule, optionally with a centered glyph (a small floral mark or "&").
- **`MusicToggle`** — fixed bottom-right, discreet, default off, persists choice to `localStorage`.
- **`Card`** — for event details. Cream background, ink border, ample padding. No drop shadows on Mood A; soft shadow on Mood B.

## Imagery rules

- All photos color-graded to a single palette before delivery to the repo. No raw out-of-camera mix.
- Aspect ratios used: `4/5` portrait (gallery primary), `16/9` landscape (hero, story), `1/1` square (couple portraits).
- Never crop a face awkwardly — the responsive variant for portrait orientation must keep both heads visible.
- Avoid generic stock floral overlays. If a motif is needed, commission or hand-pick one custom mark and use it consistently.

## Layout grid

- **Mobile (< 640px)**: single column, `padding-x: 24px`, content max-width: 100%.
- **Tablet (640–1024px)**: still single column, `padding-x: 48px`, content max-width: `560px` centered.
- **Desktop (> 1024px)**: 12-column grid optional for gallery & events, otherwise content max-width `720px` centered. **Never go full bleed except for hero and gallery hero shots.**

## What we won't do

- No glassmorphism. No neumorphism. No drop shadows on text. No emoji in production copy.
- No carousel that auto-advances. No autoplaying video with sound. No countdown with flipping numbers — use restrained typography.
- No "scroll to discover" arrow that bounces. The page invites scroll through composition, not by asking.
