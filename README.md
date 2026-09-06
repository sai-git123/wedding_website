# Wedding Invitation — Vercel Ready

A premium, mobile-first wedding invitation built with vanilla HTML/CSS/JS. No build step, no framework — just static files you can deploy anywhere, including Vercel.

## 1. Edit only `config.js`

Every wedding-specific detail lives in `config.js`: names, date, images, events, and the WhatsApp message. Nothing else needs to change.

### Images (PNG or JPG — no SVG required)

Drop your files into `assets/` and point to them in `config.js`:

- **`door`** — a full-screen, portrait door image. It's split down the middle and animated as two halves opening outward in 3D, with a warm light glow at the seam.
- **`couplePhoto`** — the hero photograph.
- **`invitation`** — your designed invitation card, shown in the "Invitation" section and shared on WhatsApp.
- **`ogImage`** — used for link previews when the site URL is shared.

The placeholder files currently in `assets/` are simple SVGs so the site works out of the box; replace them with your own PNG/JPG files and update the paths (the extension doesn't matter, any image format works).

### Wedding date

Use an ISO date with timezone, e.g. `2026-11-25T10:30:00+05:30`. The countdown calculates days/hours/minutes/seconds automatically and swaps to a "celebration has begun" message once the date passes.

### Events

Add ceremonies to the `events` array in `config.js`, each with `name`, `date`, `time`, `venue`, `description`, and `maps` (any Google Maps link). On phones this becomes a horizontal, snap-swipeable set of cards that pop into view as you scroll; tapping a card opens its location in Google Maps.

### WhatsApp sharing

The share button sends the **invitation image itself**, not a link:

1. On supported mobile browsers, it uses the Web Share API with the invitation PNG as a real file plus your caption. Choosing WhatsApp in the native share sheet sends the image as media with the caption attached.
2. On browsers that can't share files (mainly desktop), it downloads the invitation image and opens WhatsApp with your caption pre-filled, so it can be attached in one extra tap. This is a platform limitation — WhatsApp's `wa.me` link scheme has no way to auto-attach a local file.

Set `whatsappPhone` in `config.js` (digits only, country code first, e.g. `"919876543210"`) to pre-target a specific contact, or leave it blank to let the guest choose who to send it to.

## Design

- Palette: ivory, cream, champagne-gold and muted olive.
- Type: **Sacramento** and **Allura** (Google Fonts) for names and script accents; **Cormorant Garamond** for body copy and **Jost** for small labels — chosen for a refined, editorial invitation feel rather than a generic sans-serif.
- Motion: the door is the one big orchestrated moment (3D open + glow); everything after that uses restrained, purposeful scroll reveals — fade, slide, scale, and blur-to-sharp — plus a light parallax on the hero photograph. All motion respects `prefers-reduced-motion`.
- A subtle CSS-only film grain and vignette sit over the whole page for texture, with no extra image assets required.

## Deploy to Vercel

Upload the `wedding-invite` folder to GitHub and import the repository into Vercel (or drag-and-drop deploy). No build command is required — it's a static site.
