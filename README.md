# दविंदर पाल सिंह — Life Architect Coach

हिंदी-first landing page for Davinder Pal Singh's ten-level coaching journey.
Static HTML/CSS/JS — no build step, no framework, no dependencies.

---

## पहले यह बदलें (required before launch)

| # | क्या | कहाँ |
|---|------|------|
| 1 | **WhatsApp नंबर** — country code सहित, बिना `+` और बिना space (जैसे `919812345678`) | `assets/js/site.js`, सबसे ऊपर `WHATSAPP_NUMBER` |
| 2 | **दविंदर जी की तस्वीर** — `assets/davinder.jpg` में डालकर `<img>` वाली line से comment हटाएँ | `index.html` → `.about__portrait` |
| 3 | **परिचय (bio)** — असली अनुभव, वर्ष और पृष्ठभूमि से बदलें | `index.html` → `#parichay` |
| 4 | **website का पता** — share/OG link | `index.html` → `og:url` |

`index.html` में हर ऐसी जगह पर `<!-- EDIT: ... -->` comment लगा है।

**जब तक नंबर नहीं डाला जाता**, WhatsApp बटन नीचे संपर्क form तक ले जाते हैं —
कोई टूटा हुआ link नहीं खुलता।

---

## ढाँचा (structure)

```
index.html              पूरा page — दस स्तर, परिचय, संपर्क
assets/css/fonts.css    self-hosted @font-face
assets/css/site.css     design tokens + सारा layout
assets/js/site.js       WhatsApp links, enquiry form, altimeter
assets/fonts/           Tiro Devanagari Hindi + Noto Sans Devanagari (OFL)
assets/favicon.svg
```

## Design

The page is **one continuous sky**. Scrolling down means climbing: a warm dawn
horizon at the top, pale morning through the ten levels, then deep azure and
stratosphere by the footer. The ten levels sit on an **altimeter** — a measure
line whose amber fill tracks how far you have climbed, with the current level
lit. The levels are an explicit sequence, so the numbering carries meaning
rather than decoration.

- **Display:** Tiro Devanagari Hindi · **Text:** Noto Sans Devanagari
- **Ink:** `#0E2440` (a blue-ink, not a tinted black)
- **Accent:** `#E9A23B` — sun; used for CTAs, focus rings and the live tick
- Devanagari runs at `line-height: 1.8` for matras above and below the line.

### Two things worth knowing before you edit

1. **The sky darkens in the climb's last 230px**, pinned with
   `calc(100% - 230px)` rather than a percentage. That stretch is deliberately
   empty of text, so the switch from dark ink to light ink lands in the same
   place at every viewport height. If you add content there, re-check contrast.
2. **All ten levels use dark ink.** An earlier version flipped some levels to
   light text partway up; because the crossover moves with content height, it
   broke on mobile. Don't reintroduce a per-level ink flip.

All text passes WCAG AA at 1440px and 390px. Keyboard focus is visible and
`prefers-reduced-motion` is respected.

## चलाकर देखें (run locally)

```bash
python3 -m http.server 8000
# फिर खोलें http://localhost:8000
```

## Publish (GitHub Pages)

`.github/workflows/pages.yml` शामिल है। एक बार enable करना होगा:

**Settings → Pages → Source → GitHub Actions**

उसके बाद हर push अपने आप publish हो जाएगा।

## Fonts

Self-hosted so the page never waits on a third-party request — this matters on
Indian mobile data. Both faces are SIL Open Font License 1.1; licences are in
`assets/fonts/`. Only the weights actually used (400/500/600) and the
Devanagari + Latin subsets are shipped, ~190KB on the critical path.

## आगे के लिए (not built yet)

- English version for the English-speaking audience
- हर स्तर का अपना page (recorded + live का ब्योरा, fees)
- असली testimonials और नतीजे — जानबूझकर खाली छोड़े गए हैं, क्योंकि बनाए हुए
  नहीं डाले जा सकते
