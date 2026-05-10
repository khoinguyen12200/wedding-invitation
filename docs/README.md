# Wedding Invitation — Docs

**Gia Khôi & Huyền Trân.** Single-page wedding invitation site, in Vietnamese, hosted on Firebase Hosting. Front-end only.

Two ceremonies:
- **Lễ Ăn Hỏi** — Sunday, July 5, 2026 (lunar 21/5, năm Bính Ngọ)
- **Lễ Cưới** — Sunday, August 2, 2026 (lunar 20/6, năm Bính Ngọ)

Two routes — same page, different ceremony times/venues per side:
- **`/groom`** — for groom-side guests (họ hàng nhà trai, Phú Quới · Vĩnh Long)
- **`/bride`** — for bride-side guests (họ hàng nhà gái, Long Mỹ · Cần Thơ)

## Index

1. [Overview](./01-overview.md) — purpose, audience, scope, non-goals.
2. [Architecture](./02-architecture.md) — tech stack, folder layout, build/deploy topology, key decisions.
3. [Design System](./03-design-system.md) — visual direction, typography, color, motion principles, component vocabulary.
4. [Content Structure](./04-content-structure.md) — sections of the site, Vietnamese copy templates, placeholders to fill in.
5. [Deployment](./05-deployment.md) — Firebase Hosting on GCP, project setup, CI.
6. [Roadmap](./06-roadmap.md) — phased implementation plan, milestones, open questions.
7. [Assets](./07-assets.md) — images (current inventory), audio, fonts.
8. [Motion Choreography](./08-motion.md) — full per-section motion script.

## How to use these docs

The docs are drafts. Anywhere you see `[TBD: …]`, that's a placeholder waiting on input from the couple. Fill those in (or replace with the real content) before implementation.

The roadmap is the operational doc — it lists phases in build order. The other docs are reference: read them when you need to know *why* a decision was made.
