# Ali Bazoubandi — Interactive Case-Study Folder Portfolio

An interactive, scroll-driven personal portfolio shaped like a physical case-study folder. Built with Vite, TypeScript, GSAP + ScrollTrigger, Lenis smooth scroll, self-hosted Fontsource fonts (`Jost` & `Special Elite`), and Web Audio sound synthesis.

---

## Setup & Development

Requires Node.js >= 22.

```bash
npm install
npm run dev      # or: npm start (opens the browser)
```

Build for production (outputs static files to `dist/`):

```bash
npm run build
npm run preview
```

Quality gates:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint (typescript-eslint, strict)
npm run format      # Prettier write
npm run format:check
```

CI (`.github/workflows/ci.yml`) runs typecheck + lint + build on every push.

---

## Editing Personal Content

1. **Personal copy, bio, education, experience, skills, thesis, links & social handles**:
   Edit `src/content.ts`. Values still awaiting real data are marked with a `TODO` comment.
2. **Projects**:
   `src/projects.json` is the single source of truth (curated case studies). The GitHub
   API only **enriches** matching curated ids with live stars, topics, and a validated
   `homepage` link — it never replaces or adds arbitrary repositories. Repos listed in
   `EXCLUDED_REPOS` (`src/github.ts`, default `Portfolio` / `AliBazoubandi`) are never
   featured. Responses are cached in `sessionStorage` for 30 minutes to stay under the
   anonymous 60 req/hr rate limit; offline / rate-limited loads fall back to the curated
   list unchanged. Set `CONTENT.github.pinnedRepos` in `src/content.ts` to control spread
   order. If more than 4 projects are present, the Projects section paginates into
   2-project spreads.
3. **Photo & CV PDF**:
   - Replace `public/assets/photo-halftone.png` (recommended `480×480` square PNG/WebP).
   - Replace `public/assets/Ali-Bazoubandi-CV.pdf` (or update `CONTENT.cv.url`).
4. **Contact Form Endpoint**:
   Set `VITE_CONTACT_ENDPOINT` in `.env` (typed in `src/vite-env.d.ts`):
   ```env
   VITE_CONTACT_ENDPOINT=https://formspree.io/f/your_form_id
   ```
   Without an endpoint configured, the form provides a pre-filled `mailto:` dispatch link.
5. **Social preview**: `public/og-cover.png` (1200×630) is referenced by absolute URL in
   `index.html` (`og:image` / `twitter:image`) alongside a canonical link. Regenerate it
   from `public/og-cover.svg` if the cover design changes.

All dynamic strings interpolated into `innerHTML` pass through `esc()` (`src/escape.ts`),
and `index.html` ships a Content-Security-Policy meta tag.

---

## Tuning Scroll Choreography & Performance

Scroll distances, dwell weights, easing curves, and low-power detection thresholds live
in `src/config.ts`.

- `baseScrollDistancePx`: total scroll length for the full open → flip → close sequence.
- `weights`: relative duration of cover open, per-page dwell zones, flips, reverse cascade, and stamp slam.
- `easings`: GSAP easing curves for paper physics.
- `mobileBreakpointPx` (820): matches the mobile CSS breakpoint in `src/styles/*.css`.
  The desktop folder shift boundary (960px) is a separate, resize-safe function-based
  value in `src/timeline.ts`, re-evaluated on ScrollTrigger refresh.

Inner page scrolling only engages when a page truly overflows; otherwise the wheel is
forwarded to the outer choreography (`src/timeline.ts`, `overscroll-behavior: auto`).

---

## Deployment (Vercel / Netlify / Cloudflare Pages)

- **Build command**: `npm run build`
- **Output directory**: `dist`
- **404 page**: `dist/404.html` is automatically built alongside `dist/index.html`.
