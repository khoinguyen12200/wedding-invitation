# DESIGN

Concrete tokens for the Gia Khôi & Huyền Trân wedding site. Keep this file authoritative — code reads from these tokens, not from improvised values.

## Color

**Strategy: Drenched.** The surface IS the color. One deep wine-rose tone bathes the page. Cream typography sits on top. Photos go full-bleed and punch through the saturation.

OKLCH, neutrals tinted toward the wine hue.

```
--wine-900   oklch(0.20 0.05  20)   deep ground (footer, deepest fold)
--wine-800   oklch(0.26 0.06  20)
--wine-700   oklch(0.32 0.07  20)   primary surface — page background
--wine-600   oklch(0.40 0.08  20)
--wine-500   oklch(0.50 0.09  20)   warm rule lines, separators
--wine-400   oklch(0.62 0.08  20)   muted text on dark
--wine-200   oklch(0.85 0.05  30)
--cream-50   oklch(0.97 0.015 75)   primary type color (cream-on-wine)
--cream-100  oklch(0.94 0.020 70)   default body text
--cream-300  oklch(0.86 0.025 65)   muted labels
--bone       oklch(0.78 0.020 60)   secondary text
--blush      oklch(0.88 0.040 25)   sparingly, romantic touches (single-use)
```

**Bans:**
- No `#000`, no `#fff`. Every neutral has a slight wine cast.
- No second accent color. The page is wine + cream. Period.
- No gradients on text. No glassmorphism. No drop shadows on type.

## Typography

**Single committed family: Be Vietnam Pro.** Designed by Andrew Phan for Vietnamese — full diacritic support at every weight. We use weight contrast (Black 900 vs Light 300) within one family as the typographic move. No second face.

Why not a serif: the editorial-serif lane is the AI-template trap (see PRODUCT.md anti-references). A single sans at extreme weight contrast reads as confident and contemporary, and lets Vietnamese diacritics breathe.

```
--font-display   "Be Vietnam Pro", system-ui, sans-serif    weight 900 (Black)
--font-body      "Be Vietnam Pro", system-ui, sans-serif    weight 300 (Light)
--font-label     "Be Vietnam Pro", system-ui, sans-serif    weight 500 (Medium), tracked
```

### Scale (fluid, modular ratio 1.333)

```
--text-xs    clamp(0.75rem,  0.7rem  + 0.2vw, 0.875rem)   small caps labels
--text-sm    clamp(0.875rem, 0.8rem  + 0.3vw, 1rem)
--text-base  clamp(1rem,     0.95rem + 0.4vw, 1.125rem)   body
--text-lg    clamp(1.25rem,  1.1rem  + 0.6vw, 1.5rem)
--text-xl    clamp(1.5rem,   1.3rem  + 0.9vw, 2rem)
--text-2xl   clamp(2rem,     1.6rem  + 1.6vw, 3rem)
--text-3xl   clamp(3rem,     2.2rem  + 3vw,   5rem)
--text-4xl   clamp(4rem,     3rem    + 4vw,   7rem)
--text-hero  clamp(4.5rem,   3rem    + 12vw,  15rem)      couple names
```

### Diacritic rules (Vietnamese-specific)

- Display-weight type (`--text-3xl` and up) requires `line-height: 1.1` minimum to clear stacked diacritics like "ặ", "ỡ", "ự."
- Tracking on display: `letter-spacing: -0.02em` for Black weight at hero scale.
- Light weight body uses default tracking, line-height 1.55.

## Layout

- **Mobile-first.** Phone (375–430px) is the primary canvas. Desktop is a generous extension.
- **Asymmetric, not centered.** The hero pushes "Gia Khôi" toward the left edge and "Huyền Trân" toward the right with the ampersand floating between, not stacked centered.
- **Generous, varied spacing.** Use `clamp()` for vertical rhythm; tight groupings inside cards, generous breathing room between sections.
- **No global container.** Sections set their own widths. Full-bleed photos break free.

## Photography

The seven studio portraits are the emotional core.

- Photos are **full-bleed where possible** — edge to edge on mobile, near-edge with breathing room on desktop.
- Color treatment: photos retain their natural soft warmth. Do **not** wash them in wine — they punch through *because* they're cream and warm against the wine surface.
- Hero: `LD3_0394.jpg` (mobile portrait, foreheads-touching) or `LD3_0616.jpg` (desktop landscape).
- All photos must ship as AVIF + WebP + JPG fallback at 640w / 1280w / 1920w.

## Motion

Framer Motion only. Easing is `[0.16, 1, 0.3, 1]` (ease-out-expo) by default.

- **Slow over fast.** Hero entrances are 1.0–1.6s. Micro-interactions stay under 300ms.
- **Mask reveals over fades.** Photos enter via clip-path. Type enters via per-character or per-line mask.
- **Scroll is the timeline.** Use `useScroll` with section-relative `offset`. Treat the page as scrubbable.
- **Reduced motion is a real path**, not a token gesture. Everything has a static fallback.
- **Zalo bailout.** Detect Zalo UA and swap fragile clip-path animations for opacity fades.

Full per-section choreography: [docs/08-motion.md](./docs/08-motion.md).

## Components

The page has very few primitives. Avoid abstraction creep.

- `<SideLabel>` — small caps Medium-weight Vietnamese label declaring "họ hàng nhà trai/gái." Only render once per page.
- `<Photo>` — `<picture>` element with AVIF / WebP / JPG sources at 3 widths, blur-up placeholder, optional clip-path entrance.
- `<ScrollReveal>` — wraps children, applies `whileInView` mask reveal. Default for section openings.
- `<Marquee>` — horizontal scroll loop with scroll-direction reactivity. Used as section divider only.
- `<Countdown>` — two countdowns (Lễ Ăn Hỏi + Lễ Cưới), opacity-crossfade on value change.

That's it. No card library, no icon button library, no design-system layer beyond these.

## Layering (z-index)

```
--z-photo       0     full-bleed background photos
--z-content     10    type, info blocks
--z-overlay     50    intro envelope, scrim layers
--z-marquee     20    section dividers
--z-fixed       100   music toggle, navigation chrome (rare)
```

## Accessibility

- Type contrast: cream-100 on wine-700 = 8.2:1. Passes AAA.
- Focus rings: 2px solid cream-50, offset 2px. Always visible.
- All photos have Vietnamese alt text describing the moment.
- `prefers-reduced-motion` honored across every animation.
- Skip-link to main content for keyboard users.
- Body text never below 16px.
