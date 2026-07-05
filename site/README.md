# Al-Ostath website (مؤسسة الأستاذ)

Static, dependency-free website. No build step, no framework — plain HTML/CSS/JS, RTL Arabic-first.

## Structure

- `index.html`, `about.html`, `council.html`, `awards.html`, `award-qissa.html`, `award-resha.html`,
  `initiatives.html`, `initiative-nasiyah.html`, `initiative-tumooh.html`, `initiative-wathba.html`,
  `contact.html` — the pages.
- `css/design-system.css` — buttons, badges, and the triangle-strip brand motif, on top of the design
  tokens in `_ds/.../tokens/`.
- `js/site.js` — scroll-reveal animation, triangle-strip rendering, mobile nav toggle, countdown timer,
  newsletter/contact form handling, and the initiatives filter tabs.
- `_ds/al-ostath-design-system-c72d6c2e-d878-4cca-886e-5c239837bdfa/` — design tokens (colors, type,
  spacing, elevation, fonts).
- `assets/` — logo lockups.

## Running locally

Any static file server works, e.g.:

```sh
cd site
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`.

## Deploying

Upload the contents of `site/` as-is to any static host (GitHub Pages, Netlify, Vercel, S3, etc.) — no
build step required.
