# Ali Bazoubandi — Interactive Case-Study Folder Portfolio

An interactive, scroll-driven personal portfolio shaped like a physical case-study folder. Built with Vite, TypeScript, GSAP + ScrollTrigger, Lenis smooth scroll, self-hosted Fontsource fonts (`Jost` & `Special Elite`), and Web Audio sound synthesis.

---

## Setup & Development

```bash
npm install
npm run dev
```

Build for production (outputs static files to `dist/`):

```bash
npm run build
npm run preview
```

---

## Editing Personal Content

1. **Personal copy, bio, education, experience, skills, thesis, links & social handles**:
   Edit `src/content.ts`. Every placeholder is marked with a `TODO` comment.
2. **Projects**:
   Edit `src/projects.json` for curated fallback/base case studies.
   Set `CONTENT.github.username` and `CONTENT.github.pinnedRepos` in `src/content.ts` to auto-fetch live repositories from the GitHub API (automatically falls back to `projects.json` on offline/rate-limit).
   If more than 4 projects are present, the Projects section automatically paginates into 2-project spreads.
3. **Photo & CV PDF**:
   - Replace `public/assets/photo-halftone.png` (recommended `480×480` square PNG/WebP).
   - Replace `public/assets/Ali-Bazoubandi-CV.pdf` (or update `CONTENT.cv.url` in `src/content.ts`).
4. **Contact Form Endpoint**:
   Set `VITE_CONTACT_ENDPOINT` in `.env` (e.g., a Formspree or Web3Forms endpoint):
   ```env
   VITE_CONTACT_ENDPOINT=https://formspree.io/f/your_form_id
   ```
   Without an endpoint configured, the form automatically provides a pre-filled `mailto:` dispatch link.

---

## Tuning Scroll Choreography & Performance

All scroll distances, dwell weights, easing curves, mobile breakpoint (`820px`), and low-power detection thresholds live in `src/config.ts`.

- `baseScrollDistancePx`: total scroll length for the full open → flip → close sequence.
- `weights`: relative duration of cover open, per-page dwell zones, flips, reverse cascade, and stamp slam.
- `easings`: GSAP easing curves for paper physics.

---

## Deployment (Vercel / Netlify / Cloudflare Pages)

- **Build command**: `npm run build`
- **Output directory**: `dist`
- **404 page**: `dist/404.html` is automatically built alongside `dist/index.html`.

