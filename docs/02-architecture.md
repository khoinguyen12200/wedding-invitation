# Architecture

## Tech stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | **React Router v7** (already scaffolded) | Used in **SPA mode** (`ssr: false`). Firebase Hosting is a static CDN; we don't need a Node runtime. |
| Language | **TypeScript** | Strict mode. |
| Build | **Vite 8** | Already wired in. |
| Styling — utility | **Tailwind CSS v4** | Already wired via `@tailwindcss/vite`. Use for layout, spacing, color tokens. |
| Styling — component | **SCSS** (`sass`) | Use for component-scoped styles, complex keyframe animations, mixins. CSS Modules pattern: `Hero.module.scss`. |
| Animation | **Framer Motion** (`motion` package) | Scroll-triggered reveals, stagger, hero entrance, gallery, page-wide scroll choreography. See [Motion Choreography](./08-motion.md). |
| Smooth scroll | **Lenis** | Site-wide on desktop. Auto-disabled on touch. |
| Icons | **lucide-react** | In-page line icons (map pin, copy, speaker, etc.). The brand floral mark stays hand-rolled. |
| Hosting | **Firebase Hosting** | See [Deployment](./05-deployment.md). |
| CI | **GitHub Actions** (TBD) | Build and deploy on push to `main`. |

### Packages to add

```
npm install motion lenis lucide-react sass
```

- `motion` is the modern package name for Framer Motion v11+.
- `lenis` is the buttery smooth-scroll library.
- `lucide-react` for in-page icons.
- `sass` for SCSS modules.

## Key architectural decisions

### 1. SPA mode, not SSR

`react-router.config.ts` ships with `ssr: true`. **Flip to `false`** before first deploy. Reasons:

- Firebase Hosting is a static CDN. No Node runtime, no edge functions needed for this scope.
- The site has zero per-request data; SSR adds build complexity for no payoff.
- A single `index.html` plus assets is the simplest possible deploy.

### 2. Tailwind + SCSS coexist, with clear roles

- **Tailwind** handles 80% of styling: layout, spacing, color tokens, responsive breakpoints, common typography utilities.
- **SCSS modules** handle the rest: complex keyframe animations, recursive selectors, fancy gradients, anything where a long Tailwind class chain would obscure intent.
- Inside an SCSS module, you can still use `@apply` for Tailwind utilities if a hybrid is cleanest.
- Global SCSS lives in `app/styles/globals.scss`; component styles live next to components as `*.module.scss`.

### 3. Content lives in code

There is no CMS. Each section's copy and photo references are typed objects in `app/content/*.ts`. This keeps editing surface tight (one PR per content change), makes diffs reviewable, and avoids any infrastructure beyond Firebase.

### 4. Two routes, one component, per-side data overrides

There are **two invitations** sharing the same site — one for **Nhà Trai** (groom's family guests), one for **Nhà Gái** (bride's family guests). The only differences are **ceremony times and venues** (and possibly RSVP contact + gift bank info). All other sections are identical.

**URL structure:**

```
/             → redirects to /groom (or render a neutral "both events" version — TBD)
/groom     → invitation tailored for groom's side
/bride      → invitation tailored for bride's side
```

Optional shorter aliases (`/nt`, `/ng`) can be added if guests find the long form awkward to type in chat — decision in roadmap.

**Implementation pattern:**

```ts
// app/routes.ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";
export default [
  index("routes/home.tsx"),                // /  (default = groom, or chooser)
  route("groom", "routes/home.tsx", { id: "groom" }),
  route("bride",  "routes/home.tsx", { id: "bride"  }),
] satisfies RouteConfig;
```

The route's `id` (or `useMatches()`) tells `home.tsx` which side it's rendering. Section components consume side-aware content via a single context:

```ts
// app/content/sides.ts
export const sides = {
  "groom": {
    label: "Họ Hàng Nhà Trai",
    events: {
      damNoi:  { date: "2026-07-05", time: "[TBD]", venue: "...", address: "..." },
      damCuoi: { date: "2026-08-02", time: "[TBD]", venue: "Tư gia nhà trai", address: "Số nhà 130/12, Phước Yên A, Phú Quới, Vĩnh Long" },
    },
    rsvp:  "[TBD: Zalo number for groom's side]",
    gifts: { /* groom's bank info */ },
  },
  "bride": {
    label: "Họ Hàng Nhà Gái",
    events: {
      damNoi:  { date: "2026-07-05", time: "[TBD]", venue: "Tư gia nhà gái", address: "Số nhà 46, Khu vực 8, Phường Long Mỹ, Thành phố Cần Thơ" },
      damCuoi: { date: "2026-08-02", time: "[TBD]", venue: "...", address: "..." },
    },
    rsvp:  "[TBD: Zalo number for bride's side]",
    gifts: { /* bride's bank info */ },
  },
} as const;

export type Side = keyof typeof sides;
```

Inside `home.tsx`, the side is read once and provided via a `SideContext`. Sections that vary by side (`Events`, `Venue`, `Gifts`, `RSVP`) read from context; sections that are identical (`Hero`, `Countdown`, `Story`, `Families`, `Gallery`, `Thank You`) ignore it.

**What varies by side:**

| Section | Varies? | Notes |
| --- | --- | --- |
| Hero | No | Names + both dates always shown |
| Countdown | No | Both ceremonies always counted |
| Story | No | Shared narrative |
| **Families** | No | Both families are always named — they're co-hosts of the wedding regardless of which guest opened the link |
| **Events** | Yes | Times and venues per side |
| Gallery | No | Same photos |
| **Venue** | Yes | Map shows the side-relevant venue prominent |
| **Gifts** | Maybe | Either show only the relevant family's bank info, or always show both — couple to decide |
| **RSVP** | Maybe | Could be a different phone per side (the parent receiving RSVPs) |
| Thank You | No | Shared closing |

A small **side label** appears once on the page (in the eyebrow above the Families section, or in the hero): "Trân trọng kính mời họ hàng nhà trai" / "...nhà gái" — so the guest immediately knows the link they got is the right one for them.

**Why two routes instead of one?** A single shared `/?side=groom` query param is simpler to implement but uglier to share in Zalo. Pretty paths read better in chat previews and are what guests will see when forwarded.

The site remains a single scrollable page within each route. Hash-based deep links (`/groom#story`, `/bride#venue`) work for in-page navigation.

### 5. Image strategy

- All photography goes through a build-time pipeline producing AVIF + WebP + JPG fallbacks at multiple widths.
- Use `vite-imagetools` or hand-export and import via `<picture>` — decision in roadmap Phase 2.
- LCP image (hero) is preloaded; everything else is lazy-loaded with a low-quality placeholder (LQIP) blur-up.
- Originals live in `public/photos/originals/` (gitignored once large), built outputs under `public/photos/`.

## Folder layout

```
wedding-invitation/
├── app/
│   ├── root.tsx                    # HTML shell, <head>, root error boundary
│   ├── routes.ts                   # Route table (index + groom + bride)
│   ├── routes/
│   │   └── home.tsx                # Composes all sections; reads side from route, provides via SideContext
│   ├── sections/                   # One file per page section
│   │   ├── Hero/
│   │   │   ├── Hero.tsx
│   │   │   └── Hero.module.scss
│   │   ├── Countdown/
│   │   ├── Story/
│   │   ├── Events/
│   │   ├── Gallery/
│   │   ├── Venue/
│   │   ├── Gifts/
│   │   └── ThankYou/
│   ├── components/                 # Cross-section primitives
│   │   ├── SectionHeading/
│   │   ├── ScrollReveal/           # Framer Motion wrapper
│   │   ├── Image/                  # responsive <picture> wrapper
│   │   └── MusicToggle/
│   ├── content/                    # All Vietnamese copy + data
│   │   ├── couple.ts               # Names, dates — shared
│   │   ├── families.ts             # Both families' parents + addresses — shared
│   │   ├── story.ts                # Story milestones — shared
│   │   ├── gallery.ts              # Photo manifest — shared
│   │   ├── sides.ts                # Per-side overrides (events, venue, gifts, rsvp)
│   │   └── ui.ts                   # Eyebrows, button labels, etc.
│   ├── styles/
│   │   ├── globals.scss            # Resets, font-face, root variables
│   │   ├── tokens.scss             # SCSS-side design tokens (mirrors Tailwind theme)
│   │   └── mixins.scss
│   ├── lib/
│   │   ├── motion.ts               # Shared Framer Motion variants & easings
│   │   └── format.ts               # Vietnamese date/time formatters
│   └── app.css                     # Tailwind entry (@import "tailwindcss")
├── public/
│   ├── photos/                     # Optimized photo assets
│   ├── audio/                      # Background music (optional)
│   └── og/                         # OG image for link previews
├── docs/
└── ...
```

## Vietnamese-specific concerns

- **Fonts must include Vietnamese subset.** Always specify `subsets: ["vietnamese"]` for Google Fonts, or self-host woff2 with `latin` + `vietnamese` ranges. See [Design System](./03-design-system.md) for the chosen families.
- **Diacritic stacking** can break with tight `line-height` on display sizes. Test "ằ", "ặ", "ỡ", "ự" at every display weight; bump line-height to ≥ 1.15 on display headings.
- **Date formatting**: `Intl.DateTimeFormat("vi-VN", …)` for runtime strings. Manually written display dates ("Chủ Nhật, 15 tháng 12 năm 2026") for hero/major typographic moments.

## Build & deploy

- `npm run build` produces a static SPA in `build/client/`.
- Firebase Hosting serves that directory directly. See [Deployment](./05-deployment.md).
- No environment variables are required for v1.
