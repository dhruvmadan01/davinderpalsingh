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
assets/fonts/           Newsreader + IBM Plex Sans (OFL)
assets/davinder.jpg     portrait (+ .webp)
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

## Not built yet

- A Hindi version, if the Hindi-speaking audience needs its own page
- A page per level, with the recorded/live breakdown and fees
- Real testimonials and outcomes — deliberately left out rather than invented
