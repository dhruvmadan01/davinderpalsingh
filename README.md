# Davinder Pal Singh — Life Architect Coach

Landing page for a ten-level coaching journey.
Static HTML/CSS/JS — no build step, no framework, no dependencies.

---

## Set this before launch

| # | What | Where |
|---|------|-------|
| 1 | **WhatsApp number** — country code, no `+`, no spaces (e.g. `919812345678`) | `assets/js/site.js`, `WHATSAPP_NUMBER` at the top |
| 2 | **Bio** — real background, years of practice, credentials | `index.html` → `#about` |
| 3 | **Delivery language** — the Language row currently says sessions run in Hindi with English cohorts opening later. Confirm or correct it. | `index.html` → `#format` |
| 4 | **Site address** for the share/OG link | `index.html` → `og:url` |

Every such spot is marked with an `<!-- EDIT: ... -->` comment.

**Until the number is set**, the WhatsApp buttons scroll to the contact form
instead — no broken link ships, and a console warning explains why.

---

## Structure

```
index.html              the whole page
assets/css/fonts.css    self-hosted @font-face
assets/css/site.css     design tokens + all layout
assets/js/site.js       WhatsApp links, enquiry form, altimeter
calculator.html         the readiness check
assets/css/calculator.css
assets/js/calculator-data.js   weights, questions, DO/DON'T content
assets/js/calculator.js        flow, scoring output, local history
assets/fonts/           Newsreader + IBM Plex Sans (OFL)
assets/davinder.jpg     portrait, used in the hero and About (+ .webp)
assets/favicon.svg
```

## Design

The page is **one continuous sky**. Scrolling down means climbing: a warm dawn
horizon at the top, pale morning through the ten levels, then deep azure and
stratosphere by the footer. The levels sit on an **altimeter** — a measure line
whose amber fill tracks how far you have climbed, with the current level lit.
The levels are an explicit ordered sequence, so the numbering carries meaning
rather than decoration.

- **Display:** Newsreader · **Text:** IBM Plex Sans
- **Ink:** `#0E2440` — a blue-ink, not a tinted black
- **Accent:** `#E9A23B` — sun; CTAs, focus rings, the live tick. It also
  happens to sit on the saffron of the portrait, which ties the two together.

### Two things to know before editing

1. **The sky darkens across the climb’s last 230px**, pinned with
   `calc(100% - 230px)` rather than a percentage, and that stretch is
   deliberately free of text. This is what makes the switch from dark ink to
   light ink land in the same place at every viewport height. If you put
   content there, re-check contrast.
2. **All ten levels use dark ink.** An earlier version flipped some levels to
   light text partway up the climb; because the crossover moves with content
   height, it broke on mobile. Don’t reintroduce a per-level ink flip.

All text passes WCAG AA at 1440px and 390px, verified against rendered pixels.
Keyboard focus is visible and `prefers-reduced-motion` is respected.

## Readiness check (`calculator.html`)

A self-assessment: nine weighted dimensions, two questions each (18 total),
scored 0–10. It reports a score out of 100, five grouped areas, the biggest
blocker, a DO/DON'T board and a seven-day experiment, and keeps a local
history so repeat checks can be compared.

| Dimension | Weight | | Dimension | Weight |
|---|---|---|---|---|
| Action | 25 | | Intention | 8 |
| Focus | 20 | | Belief | 8 |
| Exposure | 10 | | Consistency | 6 |
| Conception | 10 | | Adoptability | 5 |
| Feeling | 8 | | **Total** | **100** |

**The model lives in `assets/js/calculator-data.js`.** Weights, question
wording, and the DO/DON'T and experiment content are all data there — edit
that file and the maths follows. The five reported areas are the
`COMPOSITES` array; regroup them by editing the `of` lists.

Three things worth knowing:

1. **"Biggest blocker" is weighted drag, not the lowest score** —
   `(10 − score) ÷ 10 × weight`. A 7/10 on Action (weight 25) drags more
   than a 3/10 on Consistency (weight 6), which is the point of having
   weights. The results page says so, because it surprises people.
2. **Identity, Core Alignment and Resistance weren't defined in the brief.**
   I grouped them as Identity = Feeling + Intention + Belief (24),
   Core Alignment = Exposure + Conception (20), and Resistance = 100 − score.
   Change the groupings in `COMPOSITES` if you meant something else.
3. **It does not predict outcomes.** It reports what the user told it and
   what to work on. Deliberately no "you will definitely achieve this" —
   an unfalsifiable promise invites people to blame themselves when
   circumstances, not effort, are what got in the way.

Results are stored in `localStorage` under `dps.readiness.v1`, on the user's
own device. Nothing is transmitted; there is no backend.

## Run locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Publish (GitHub Pages)

`.github/workflows/pages.yml` is included. Enable it once:

**Settings → Pages → Source → GitHub Actions**

Every push to `main` then deploys automatically.

## Fonts

Self-hosted so the page never waits on a third-party request. Both faces are
SIL Open Font License 1.1; licences are in `assets/fonts/`. Only the weights
actually used ship (Newsreader 400 + italic, Plex 400/500/600), Latin subset
only — about 45KB on the critical path.

## The portrait

`assets/davinder.*` is cropped from the supplied square, which was padded
with filler bars down both sides — the real photo is only the middle 504px.
The crop excludes those bars; don't re-crop from the original square without
trimming them, or the bars reappear at the image edges.

The same photo currently appears twice (hero and About). A second photo for
one of the two would read better — drop it in and point the `<figure>` at it.

## Not built yet

- A Hindi version, if the Hindi-speaking audience needs its own page
- A page per level, with the recorded/live breakdown and fees
- Real testimonials and outcomes — deliberately left out rather than invented
