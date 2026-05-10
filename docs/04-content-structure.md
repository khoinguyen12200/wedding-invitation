# Content Structure

The site is a single scrollable page with **10 sections**, served at **two routes** — one per side of the family. The couple is **Gia Khôi & Huyền Trân**, with two ceremonies (**Lễ Ăn Hỏi** July 5, 2026 + **Lễ Cưới** August 2, 2026). Replace any remaining `[TBD: …]` markers as the couple confirms details.

## Two routes, one page

| Route | For | Side label |
| --- | --- | --- |
| `/groom` | Guests of the groom's family (họ hàng nhà trai) | "Trân trọng kính mời họ hàng nhà trai" |
| `/bride` | Guests of the bride's family (họ hàng nhà gái) | "Trân trọng kính mời họ hàng nhà gái" |
| `/` | Default — redirects to `/groom` (or shows neutral version) | — |

Each route uses **the same components in the same order**. Per-side data only changes:

- **Events** — ceremony **times** and **venue addresses** are different for each side. See §5.
- **Venue** (map) — shows the venue relevant to that side.
- **Gifts** — likely shows only the host family's bank info per side (couple to confirm).
- **RSVP** — may use a different contact number per side.

Everything else (Hero, Countdown, Story, Families, Gallery, Thank You) is **identical** across both routes — both sides see both names, both dates, both families, all photos.

A small **side label** appears once near the top of the page (likely as the eyebrow above the Families block) so a guest immediately knows their link is correct.

Implementation lives in `app/content/sides.ts` — see [Architecture §4](./02-architecture.md#4-two-routes-one-component-per-side-data-overrides).

## Section order

Order matters: hero is the first impression, thank-you is the last beat. The narrative arc is **emotional → formal → logistical → visual → practical**. Don't reshuffle without reason.

```
1. Hero            ┐
2. Countdown       │  emotional beats
3. Story           ┘
4. Families        ┐  formal invitation
5. Events          ┘  (varies per side)
6. Gallery         ┐
7. Venue           │  logistical / practical (varies per side)
8. Gifts           │  (may vary per side)
9. RSVP            ┘  (may vary per side)
10. Thank You         closing
```

## 1. Hero (Bìa)

**Goal:** First impression. Couple's names, both dates, one photo.

**Content (final):**
- Groom: **Gia Khôi**
- Bride: **Huyền Trân**
- Lễ Ăn Hỏi: Chủ Nhật, ngày 5 tháng 7 năm 2026 (21/5 năm Bính Ngọ)
- Lễ Cưới: Chủ Nhật, ngày 2 tháng 8 năm 2026 (20/6 năm Bính Ngọ)
- Hero photo: see [Assets](./07-assets.md). Top candidates: `LD3_0394.jpg` (mobile portrait, foreheads-touching, lots of negative space) or `LD3_0616.jpg` (desktop landscape, ring shown).
- Optional tagline: `[TBD: short Vietnamese line — e.g. "Một tình yêu — Một hành trình mới"]`

**Copy template:**

```
Save the Date

Trân trọng kính mời

Gia Khôi
&
Huyền Trân

Lễ Ăn Hỏi — Chủ Nhật, 05.07.2026
Lễ Cưới — Chủ Nhật, 02.08.2026
```

The hero shows **both dates** in the same visual block, equal weight. They're not competing — they're a pair.

## 2. Save the Date / Countdown (Đếm Ngược)

**Goal:** Build anticipation. **Two countdowns** — one to each ceremony — shown side-by-side on desktop, stacked on mobile.

**Data:**
- Lễ Ăn Hỏi target: `2026-07-05T00:00:00+07:00`
- Lễ Cưới target: `2026-08-02T00:00:00+07:00`
- Times of day: `[TBD: giờ bắt đầu mỗi lễ]`

**Copy template:**

```
Còn lại

— Lễ Ăn Hỏi —
[XX] ngày  [XX] giờ  [XX] phút  [XX] giây

— Lễ Cưới —
[XX] ngày  [XX] giờ  [XX] phút  [XX] giây
```

After Lễ Ăn Hỏi passes, that countdown card collapses to a small "Đã diễn ra · 05.07.2026" line; Lễ Cưới remains the primary count.

**Implementation note:** Numbers update every second client-side. If reduced motion is on, update every minute and skip the seconds slot. See [Motion Choreography §2](./08-motion.md).

## 3. Our Story (Câu Chuyện Của Chúng Tôi)

**Goal:** Personal warmth. Short timeline of the relationship.

**Content needed (per milestone):**
- Date (month + year), e.g. `Tháng 5, 2021`
- Title, e.g. `Lần đầu gặp gỡ`
- 1–2 sentence description
- Optional photo

**Suggested milestones (3–5 total, no more):**

```
Tháng 5, 2021     Lần đầu gặp gỡ
                  [TBD: nơi và hoàn cảnh hai người gặp nhau]

Tháng 12, 2022    Hẹn hò chính thức
                  [TBD: kỷ niệm bắt đầu yêu]

Tháng 6, 2025     Lời cầu hôn
                  [TBD: kể ngắn gọn về khoảnh khắc cầu hôn]

Tháng 12, 2026    Nên duyên vợ chồng
                  Là một chương mới của chúng tôi.
```

## 4. Families / Trân trọng kính mời

**Goal:** The formal Vietnamese invitation block — both families named, addressed, and joined. This is the most ceremonially important block on the page; the section before it (Story) is personal, the section after (Events) is logistical, and this is the bridge between "us" and "you (the guest)."

**Layout:** Two-column on desktop (Nhà Trai left, Nhà Gái right — convention), stacked on mobile (Nhà Trai first). A small brass glyph divides the two columns visually. Below the columns, centered: the formal invitation language and the couple's names.

**Content (final):**

| | Nhà Trai (groom's family) | Nhà Gái (bride's family) |
| --- | --- | --- |
| Ông | Nguyễn Quốc Bảo | Huỳnh Văn Thường |
| Bà | Phan Hồng Thắm | Trần Kim Mai |
| Địa chỉ | Số nhà 130/12, Phước Yên A, Phú Quới, Vĩnh Long | Số nhà 46, Khu vực 8, Phường Long Mỹ, Thành phố Cần Thơ |

**Copy template:**

```
Trân trọng kính mời

— NHÀ TRAI —                    — NHÀ GÁI —

Ông   Nguyễn Quốc Bảo           Ông   Huỳnh Văn Thường
Bà    Phan Hồng Thắm            Bà    Trần Kim Mai

Số nhà 130/12,                  Số nhà 46, Khu vực 8,
Phước Yên A, Phú Quới,          Phường Long Mỹ,
Vĩnh Long                       Thành phố Cần Thơ

                  ❦

  Trân trọng kính mời quý quan khách đến chung
  vui cùng gia đình chúng tôi trong ngày lễ
  thành hôn của hai con:

           Gia Khôi  &  Huyền Trân
```

**Typographic treatment:**
- "Trân trọng kính mời" — eyebrow, sans, small caps, tracked.
- "NHÀ TRAI" / "NHÀ GÁI" — sans, small caps, brass color, drawn brass underline.
- "Ông", "Bà" — labels in muted ink-500 sans; parent names in serif (Cormorant) at lead size.
- Addresses — sans body, ink-700.
- "❦" or the brass floral favicon mark — centered glyph between/below columns; serves as the visual hinge.
- Final invitation paragraph — serif body, generous line-height, centered.
- "Gia Khôi & Huyền Trân" — display serif, italic, oversized; the `&` in script (Italianno).

**Implementation note:** The two-column layout on desktop uses a thin vertical brass rule between columns, drawn in via `drawLine` on section enter. Per [Motion Choreography §5](./08-motion.md#5-families-trân-trọng-kính-mời).

## 5. Events (Sự Kiện) — varies per side

**Goal:** Logistics. Two ceremony cards, equal weight, in chronological order. **This section is the main place the two routes diverge** — each side shows ceremony times and venues relevant to its own guests.

### `/groom` (groom's side guests)

```
Lễ Ăn Hỏi
Chủ Nhật, ngày 5 tháng 7 năm 2026
(Nhằm ngày 21 tháng 5 năm Bính Ngọ)
[TBD: giờ bắt đầu cho khách nhà trai]

[TBD: địa điểm cho khách nhà trai]
[TBD: địa chỉ]

────────────────

Lễ Cưới
Chủ Nhật, ngày 2 tháng 8 năm 2026
(Nhằm ngày 20 tháng 6 năm Bính Ngọ)
[TBD: giờ bắt đầu cho khách nhà trai]

Tư gia nhà trai
Số nhà 130/12, Phước Yên A, Phú Quới, Vĩnh Long
```

### `/bride` (bride's side guests)

```
Lễ Ăn Hỏi
Chủ Nhật, ngày 5 tháng 7 năm 2026
(Nhằm ngày 21 tháng 5 năm Bính Ngọ)
[TBD: giờ bắt đầu cho khách nhà gái]

Tư gia nhà gái
Số nhà 46, Khu vực 8, Phường Long Mỹ, Thành phố Cần Thơ

────────────────

Lễ Cưới
Chủ Nhật, ngày 2 tháng 8 năm 2026
(Nhằm ngày 20 tháng 6 năm Bính Ngọ)
[TBD: giờ bắt đầu cho khách nhà gái]

[TBD: địa điểm cho khách nhà gái]
[TBD: địa chỉ]
```

Each card has a "Chỉ Đường" (Get Directions) button → opens Google Maps with the venue's address. Tap-to-copy on the address line.

**Open questions for the couple:**
- For each ceremony, which side's guests come, and at what time? Concretely:
  - Lễ Ăn Hỏi (5/7): both sides? Or only one? At what time(s)?
  - Lễ Cưới (2/8): both sides? Or only one? At what time(s)?
- Is there a separate **tiệc cưới** at a restaurant for either side? If yes, add a third card on that side.

**Data shape (`app/content/sides.ts`):**

```ts
events: {
  damNoi:  { date, time, venue, address, mapsUrl },
  damCuoi: { date, time, venue, address, mapsUrl },
  // optional: tiec: { ... } if a restaurant reception applies
}
```

**Note on naming.** The couple has used the colloquial **Lễ Ăn Hỏi / Lễ Cưới** pairing — a common informal naming. We keep these labels exactly. Don't formalize them to "Lễ Ăn Hỏi" / "Lễ Thành Hôn" unless the couple asks.

## 6. Gallery (Album Ảnh Cưới)

**Goal:** Visual heart of the site. Pre-wedding photos.

**Content needed:**
- 8–16 photos, color-graded to one palette
- Mix of aspect ratios: portrait, landscape, occasional square
- Optional captions (Vietnamese, short)

**Layout:** Asymmetric grid with intentional white space — not a uniform 3×3. See [Design System](./03-design-system.md) for image rules.

**Copy template (section header only):**

```
Album

Khoảnh khắc của chúng tôi
```

## 7. Venue (Địa Điểm)

**Goal:** Help guests get there. One map per primary venue.

**Content needed (per venue):**
- Venue name + Vietnamese address
- Coordinates (lat/lng) for the map
- Embedded map (Google Maps embed `<iframe>`, no API key needed for basic embeds)
- "Chỉ Đường" button (opens Google Maps app on mobile)

**Note on maps:** A static Google Maps embed `<iframe>` is fine for v1. If we want a styled map, we need the Maps JS API and a key — out of scope until requested.

## 8. Gifts (Mừng Cưới)

**Goal:** Make it easy for guests who want to send a gift.

**Content needed (per side, optional):**
- Bank: `[TBD: tên ngân hàng]`
- Account number: `[TBD]`
- Account name: `[TBD]`
- Optional: VietQR image (QR code with embedded transfer info)

**Copy template:**

```
Mừng cưới

Cảm ơn bạn vì sự có mặt và những lời chúc tốt đẹp.
Nếu bạn muốn gửi mừng cho hai chúng tôi, đây là thông tin chuyển khoản:

— Chú rể —
[Ngân hàng]
[Số tài khoản]
[Tên chủ tài khoản]
[QR code]

— Cô dâu —
[Ngân hàng]
[Số tài khoản]
[Tên chủ tài khoản]
[QR code]
```

Tap-to-copy on the account number. QR codes can be tapped to open the banking app via VietQR `napas://` deep links — keep this optional for v1.

## 9. RSVP (optional — Xác Nhận Tham Dự)

**Goal:** Let guests confirm attendance.

Since we have no backend, options are:

- **(A) Zalo / Phone link.** "Vui lòng nhắn tin xác nhận qua Zalo: [số điện thoại]". Simplest, most personal. **Recommended default.**
- **(B) Google Form embed.** Free, works without code. We embed an `<iframe>` and call it done.
- **(C) Skip RSVP.** If the guest list is small and the couple already knows who's coming.

> **[TBD]** Couple to choose A / B / C.

## 10. Thank You (Lời Cảm Ơn)

**Goal:** Closing beat. Warm sign-off.

**Copy template:**

```
Lời cảm ơn

Cảm ơn vì bạn đã là một phần trong câu chuyện của chúng tôi.
Hẹn gặp bạn vào ngày trọng đại.

— Gia Khôi & Huyền Trân
```

The brass floral mark from the favicon repeats here at large size, centered above the message. The couple's names sign off in script (Italianno). End of page.

---

## Inputs we still need from the couple

Confirmed already:
- [x] Couple names: **Gia Khôi & Huyền Trân**
- [x] Two ceremonies and dates: Lễ Ăn Hỏi 5/7/2026, Lễ Cưới 2/8/2026
- [x] Both family addresses (Long Mỹ Cần Thơ + Phú Quới Vĩnh Long)
- [x] Both sets of parents' names (Huỳnh Văn Thường & Trần Kim Mai · Nguyễn Quốc Bảo & Phan Hồng Thắm)
- [x] Photos: 7 studio portraits in `public/` — see [Assets](./07-assets.md)

Still needed (per-side):
- [ ] Lễ Ăn Hỏi (5/7) — start time + venue address for **nhà trai** guests
- [ ] Lễ Ăn Hỏi (5/7) — start time + venue address for **nhà gái** guests
- [ ] Lễ Cưới (2/8) — start time + venue address for **nhà trai** guests
- [ ] Lễ Cưới (2/8) — start time + venue address for **nhà gái** guests
- [ ] Either side has a separate **tiệc cưới** (restaurant reception)? If yes, name + address + time
- [ ] Bank account info per side (or just one side, or skip)
- [ ] RSVP contact per side (Zalo number for groom-side host, ditto bride-side)

Still needed (shared):
- [ ] Tagline / quote for hero (optional)
- [ ] 3–5 story milestones with dates and short text
- [ ] Background music track (optional, mp3, < 2MB, looping-friendly)
- [ ] Final mood: confirm Mood A (Quiet luxury) — recommended given the studio photos already match this palette perfectly
- [ ] Custom domain for Firebase Hosting (optional, e.g. `khoitran.love`, `cuoichungtoi.com`)
- [ ] Behavior at `/` (root) — redirect to `/groom` as default, or render a neutral version showing both sides' events?
