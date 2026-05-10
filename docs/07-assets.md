# Assets

What media this site needs, what shape it's in, and where it lives in the repo.

## Photos — current inventory

7 studio portraits dropped into `public/` (May 10, 2026). All are 4024×6048 (or close), shot in a clean white studio with soft directional light. Aesthetic matches **Mood A (Quiet luxury, warm ivory)** almost exactly — confirms the design direction.

| File | Orient. | Description | Best use |
| --- | --- | --- | --- |
| `LD3_0266.jpg` | Portrait | Full body, bride looking down at bouquet | Gallery |
| `LD3_0327.jpg` | Portrait | Full body, looking at each other | Gallery / Story |
| `LD3_0394.jpg` | Portrait | Foreheads touching, lots of negative space, soft shadow | **Hero (mobile)** — top candidate |
| `LD3_0478.jpg` | Portrait | Walking, "Save The Date · 02.08.2026" overlay (Lễ Cưới) | OG image / Lễ Cưới share card |
| `LD3_0608.jpg` | Portrait | Bride leaning on groom's shoulder, eyes closed | Gallery |
| `LD3_0609.jpg` | Portrait | Smiling, "Save The Date · 05.07.2026" overlay (Lễ Ăn Hỏi) | Lễ Ăn Hỏi share card |
| `LD3_0616.jpg` | Landscape | Showing the engagement ring | **Hero (desktop)** — top candidate |

**Caveats:**
- These are **raw originals at full resolution** — each file is **9–13MB** (total ~84MB). They cannot ship to Firebase as-is. The build pipeline (see below) must produce optimized variants before deploy.
- `LD3_0478.jpg` and `LD3_0609.jpg` have **burnt-in "Save The Date" overlays**. They are not raw photos — they're pre-rendered share cards. Don't use them as hero or in the regular gallery. They're useful for OG / link-preview images.
- The photo set is studio-only. If the couple wants outdoor / location shots in the gallery later, the gallery should reserve room for them or be intentionally curated as "studio series only."

### What's still missing

- More variety. 5 usable raw photos is enough for a tight gallery but a wider set (10–14) gives the gallery room to breathe.
- Optional: candid / behind-the-scenes shots for the Story timeline.
- A landscape hero alternative — `LD3_0616` is the only landscape; if there's another we can A/B them.

## Photo file naming (target structure)

The `LD3_*` photographer-export names are kept on disk for traceability, but inside the codebase we reference by semantic alias:

```
app/content/gallery.ts
  hero:      LD3_0394    (mobile portrait)
  heroAlt:   LD3_0616    (desktop landscape)
  gallery:   [LD3_0266, LD3_0327, LD3_0608, ...]
  ogCuoi:    LD3_0478    (Lễ Cưới share card)
  ogNoi:     LD3_0609    (Lễ Ăn Hỏi share card)
```

After build, optimized variants land in `public/photos/{name}-{width}.{format}` — original `LD3_*` files are moved to `public/photos/originals/` and gitignored once total exceeds ~50MB.

### Quality bar (going forward)

- Color-graded to one consistent palette before delivery. The current set already is — keep this consistency for any additions.
- Originals at full resolution from the photographer (we down-res in the build pipeline).
- No watermarks. No filter effects baked in (Instagram filters, etc.).
- Faces are sharp, not blurred. Reject any photo where motion blur isn't intentional.

### Quality bar

- Color-graded to one consistent palette before delivery. Not raw out-of-camera mix.
- Originals at full resolution from the photographer (we down-res in the build pipeline).
- No watermarks. No filter effects baked in (Instagram filters, etc.).
- Faces are sharp, not blurred. Reject any photo where motion blur isn't intentional.

### Build pipeline

Every photo in `public/photos/originals/` is processed at build time into:

- AVIF (best compression, modern browsers)
- WebP (broad support fallback)
- JPG (universal fallback)

Each format at 3 widths: `640w`, `1280w`, `1920w`. The `<picture>` element selects the right one.

We use either `vite-imagetools` (build-time, automatic) or hand-export via Squoosh / Sharp (more control, more friction). **Decision in roadmap Phase 2.**

### Gitignore

`public/photos/originals/` is gitignored once total size exceeds ~50MB. **The current set is already at ~84MB so this is now urgent** — we shouldn't be committing those raw `LD3_*.jpg` files. Add `public/LD3_*.jpg` to `.gitignore` (or move them to `public/photos/originals/` and gitignore that folder) before the next commit. Originals are kept in cloud storage (Google Drive folder, link in `[TBD: project ops doc]`); the build pipeline expects them locally for resizing.

## Fonts

Self-hosted woff2 in `app/fonts/`. We do **not** load from Google Fonts in production (avoids the FOIT and the third-party request).

### Files needed (Mood A, default)

```
app/fonts/
  be-vietnam-pro-400.woff2
  be-vietnam-pro-500.woff2
  be-vietnam-pro-600.woff2
  cormorant-garamond-400.woff2
  cormorant-garamond-500.woff2
  cormorant-garamond-600-italic.woff2
  lora-400.woff2
  lora-500-italic.woff2
  italianno-400.woff2          # accent — only if used
```

### Subsetting

Each woff2 must include `latin` + `vietnamese` ranges. If sourced from Google Fonts, use the [google-webfonts-helper](https://gwfh.mranftl.com/fonts) tool to download a Vietnamese-subset bundle. If sourced from Adobe Fonts or a foundry, confirm Vietnamese support before committing.

### `@font-face` declarations

In `app/styles/globals.scss`. Use `font-display: swap` to avoid FOIT, and explicit `unicode-range` for the Vietnamese subset to prevent loading it for non-Vietnamese characters.

## Audio (optional)

If background music is included:

- Format: **MP3** (broadest support including Zalo browser)
- Length: 60–180s, loop-friendly
- Size: under 2MB (compress aggressively — 96kbps is fine for ambient music)
- Lives at `public/audio/background.mp3`
- Default state is **off**; user opts in via the `MusicToggle`. Choice persists to `localStorage`.

> **[TBD]** Track selection. Couple to provide MP3 or YouTube link we can extract from with permission.

## Icons

We use **`lucide-react`** as the in-page icon library — clean line icons, tree-shakable, ~1KB per icon. Install in Phase 0:

```
npm install lucide-react
```

Used for:
- Map pin / direction arrow (`MapPin`, `Navigation`)
- Speaker on / speaker off for music toggle (`Volume2`, `VolumeX`)
- Copy for tap-to-copy account numbers (`Copy`, `Check`)
- Heart, sparkle, flower — sparingly, for accents (`Heart`, `Sparkles`, `Flower2`)

Anything that needs to be exact-weight-matched to the typography is **still hand-rolled** as inline SVG in `app/components/icons/` — specifically the brand floral mark (already in `public/favicon.svg`) and any custom dividers.

## Favicons + meta

Currently shipped:

```
public/
  favicon.svg                    ✓ Custom brass floral mark on ink ground (matches the couple's bouquet motif)
  favicon.ico                    ⚠ Default React Router placeholder — keep as fallback for IE/legacy or replace
```

Still to add before launch:

```
public/
  apple-touch-icon.png           # 180×180, raster of favicon.svg with safe-area padding
  og/og-cuoi.jpg                 # 1200×630 OG image for Lễ Cưới (use LD3_0478)
  og/og-noi.jpg                  # 1200×630 OG image for Lễ Ăn Hỏi (use LD3_0609)
  manifest.webmanifest           # Optional, for "Add to Home Screen"
```

The new favicon (`favicon.svg`) is a small floral sprig — line-drawn stem with brass dots forming a baby's-breath bouquet, mirroring the actual bouquet in the couple's photos. It's intentionally not a heart or wedding ring (too generic). Larger contexts (apple-touch-icon, share cards) will pair it with "K & T" monogram in serif.

## OG image content

When a guest pastes the link into Zalo / Messenger / iMessage / Twitter / Facebook, this is the preview card.

- `1200×630`, JPG (or PNG if there's transparency, though there shouldn't be)
- Should include: couple's names, date, optional photo or pattern
- Readable at thumbnail size — keep type large
- No URL on the image (it's redundant with the link itself)

Set in `app/root.tsx` `<head>`:

```html
<meta property="og:title" content="[TBD: Tên Chú Rể] & [TBD: Tên Cô Dâu]" />
<meta property="og:description" content="Trân trọng kính mời — [TBD: ngày]" />
<meta property="og:image" content="/og/og.jpg" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

## Inputs to collect from the couple

- [ ] All photos (originals, color-graded if possible) — drop in a Google Drive folder
- [ ] Choice of background music (or skip)
- [ ] Approval of OG image after we draft it
