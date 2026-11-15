# Ali Bazoubandi — Interactive Case-Study Folder Portfolio

An interactive, scroll-driven personal portfolio shaped like a physical case-study folder.
Scrolling opens the cover, flips through top-bound dossier pages (About, Skills, Experience,
Thesis, Projects, Contact), then closes the folder and slams a **CASE CLOSED** stamp with a
hand-stamper, impact bloom, and paper recoil.

Built with **Vite + TypeScript**, **GSAP + ScrollTrigger**, **Lenis** smooth scroll,
self-hosted Fontsource fonts (`Jost` & `Special Elite`), and lazy-loaded Web Audio sound
effects. Ships as a static site — deployable to any static host or as a tiny nginx Docker
image.

---

## Highlights

- **Scroll-scrubbed 3D folder choreography** — cover open, per-page dwell zones, page flips,
  reverse cascade, cover close, and a physics-feeling stamp slam finale, all driven by one
  pinned master timeline (`src/timeline.ts`).
- **Personal AB emblem seal** — the orange/white hexagon emblem
  (`public/assets/badge-emblem.png`) sits inside a navy disc with an orange rim, wrapped in a
  paper ring seal with circular text. It appears on the folder cover and as the brand mark of
  the plain view.
- **Iran postage stamp** — the cover's location stamp uses the real flag photo
  (`public/assets/flag-iran.jpg`) inside a perforated, postmarked postage-stamp frame.
- **Face-focused halftone portrait** — the polaroid photo is cropped through a square frame
  with live-tunable zoom/pan CSS variables (see [Swapping the photo](#swapping-the-photo)).
- **Easter eggs** (intentional, keep them):
  - Click the round cover badge → it spins and stamps a secret case note.
  - Type `case` anywhere → `STAMP UNLOCKED: TOP SECRET // READY FOR HIRE`.
  - Konami code (↑↑↓↓←→←→ B A) → `KONAMI CLEARANCE: LEVEL 99 ENGINEER APPROVED!`.
- **Plain accessible view** — a light paper-styled, fully semantic version toggled from the
  top bar or via `?view=plain`. Low-power devices and `prefers-reduced-motion` users get an
  automatically simplified experience; a full `<noscript>` fallback covers disabled JS.
- **Sound, off by default** — real `page-flip.mp3` / `stamp.mp3` clips (~114 KB) are only
  fetched after the visitor enables sound from the top bar; a procedural Web Audio fallback
  plays instantly while clips load.
- **Curated projects + live GitHub enrichment** — `src/projects.json` is the source of truth;
  the GitHub API only enriches matching entries with stars/topics/homepage.
- **Contact form** — posts to a configurable endpoint with a pre-filled `mailto:` fallback.

---

## Setup & Development

Requires **Node.js >= 22**.

```bash
npm install
npm run dev      # or: npm start (opens the browser)
```

On Windows you can also double-click `run.bat` (or run `run.ps1`), which installs
dependencies on first launch and starts the dev server at <http://localhost:5173>.

Build for production (outputs static files to `dist/`):

```bash
npm run build    # tsc --noEmit && vite build
npm run preview
```

Quality gates:

```bash
npm run typecheck     # tsc --noEmit
npm run lint          # ESLint (typescript-eslint, strict)
npm run format        # Prettier write
npm run format:check
```

CI (`.github/workflows/ci.yml`) runs typecheck + lint + build on every push and PR.

---

## Docker

The image is a two-stage build: `node:22-alpine` compiles and bundles the site, then only the
`dist/` output is copied into `nginx:alpine`. The final image contains no Node runtime, no
source, and no `node_modules`.

### Docker Compose (recommended)

```bash
docker compose up -d --build
```

The site is served at <http://localhost:8081>. Stop it with `docker compose down`.

### Plain Docker

```bash
docker build -t portfolio .
docker run -d --name portfolio -p 8081:80 portfolio
```

### What the nginx config does (`nginx.conf`)

- Serves `dist/` with the styled **404 page** (`404.html`) for unknown paths, keeping a real
  `404` status.
- **Caching**: Vite's content-hashed bundles (`/assets/*-<hash>.js|css|woff2`) are cached for
  one year; unhashed public assets (portrait, flag, emblem, CV, audio) revalidate hourly;
  HTML always revalidates so new deploys appear immediately.
- **gzip** for text, JS, CSS, JSON, SVG, and XML; `nosniff` + `Referrer-Policy` headers
  (the CSP itself ships as a meta tag in `index.html`).
- A container **healthcheck** pings `/` every 30 s.
- Relative redirects, so mapping any host port (e.g. `8081:80`) never leaks `:80`.

To change the host port, edit the `ports` entry in `docker-compose.yml` (or `-p` flag).

---

## Editing Personal Content

### Copy, bio, links & socials

Edit `src/content.ts`. Values still awaiting real data are marked with a `TODO` comment.

### Projects

`src/projects.json` is the single source of truth (curated case studies). The GitHub API only
**enriches** matching curated ids with live stars, topics, and a validated `homepage` link —
it never replaces or adds arbitrary repositories. Repos listed in `EXCLUDED_REPOS`
(`src/github.ts`, default `Portfolio` / `AliBazoubandi`) are never featured. Responses are
cached in `sessionStorage` for 30 minutes to stay under the anonymous 60 req/hr rate limit;
offline / rate-limited loads fall back to the curated list unchanged. Set
`CONTENT.github.pinnedRepos` in `src/content.ts` to control spread order. If more than 4
projects are present, the Projects section paginates into 2-project spreads.

### Swapping the photo

1. Replace `public/assets/photo-halftone.png` with your image. Any resolution works (the
   current one is 1254×1254); a square PNG/WebP is recommended. Pop-art / halftone treatment
   matches the folder's print aesthetic best. The old placeholder is kept unused as
   `photo-halftone1.png`.
2. Tune the face crop in `src/styles/tokens.css` — the same variables drive both the cover
   polaroid and the plain-view photo:

   ```css
   --photo-zoom: 1.9; /* scale inside the square frame */
   --photo-pan-x: 20%; /* horizontal recentering */
   --photo-pan-y: 1%; /* vertical recentering */
   ```

   Pan is applied **pre-scale**, so tune zoom first, then pan to recenter the face. The
   frame clips overflow, so the white polaroid mat never gets covered.

3. If you change dimensions, update `CONTENT.photo.width` / `height` in `src/content.ts`.

### Badge emblem & flag

- **Emblem**: replace `public/assets/badge-emblem.png` (square PNG). It is clipped into the
  seal's center disc by `renderCircularBadge()` in `src/svg/assets.ts`; the ring text comes
  from `CONTENT.badgeEasterEgg.ringText`.
- **Flag**: replace `public/assets/flag-iran.jpg`, or point `CONTENT.location.flagCode` at a
  different country code (other flags are drawn as inline SVG in `renderFlagArtwork()`).

### CV PDF

Replace `public/assets/Ali-Bazoubandi-CV.pdf` (or update `CONTENT.cv.url`).

### Contact form endpoint

Set `VITE_CONTACT_ENDPOINT` in `.env` (typed in `src/vite-env.d.ts`):

```env
VITE_CONTACT_ENDPOINT=https://formspree.io/f/your_form_id
```

Without an endpoint configured, the form provides a pre-filled `mailto:` dispatch link.
For Docker builds, `.env` is never copied into the image — pass the endpoint as a build arg
instead: `docker build --build-arg VITE_CONTACT_ENDPOINT=https://... -t portfolio .`, or keep
it in `.env` next to `docker-compose.yml` and Compose forwards it automatically.

### Social preview

`public/og-cover.png` (1200×630) is referenced by absolute URL in `index.html`
(`og:image` / `twitter:image`) alongside a canonical link. Regenerate it from
`public/og-cover.svg` if the cover design changes.

---

## Tuning Scroll Choreography & Performance

Scroll distances, dwell weights, easing curves, and low-power detection thresholds live in
`src/config.ts`:

- `baseScrollDistancePx` (8200): total scroll length for the full open → flip → close
  sequence; `extraProjectPageScrollPx` adds length per extra Projects spread.
- `weights`: relative duration of cover open, per-page dwell zones, flips, reverse cascade,
  cover close, `stampSlam` (1.8), and `postStampHold` (1.2).
- `easings`: GSAP easing curves for paper physics (`stampSlam: 'power4.in'` gives the stamp
  its accelerating slam; the impact squash, bloom, and folder recoil are choreographed
  around it in `src/timeline.ts`).
- `performance`: simple mode latches when `prefers-reduced-motion` is set, cores ≤ 2,
  memory ≤ 2 GB, or an 8-frame probe averages < 36 fps — the folder then uses lightweight
  fades instead of the full 3D/stamp physics.
- `mobileBreakpointPx` (820): matches the mobile CSS breakpoint in `src/styles/*.css`.
  The desktop folder shift boundary (960px) is a separate, resize-safe function-based value
  in `src/timeline.ts`, re-evaluated on ScrollTrigger refresh.

Inner page scrolling only engages when a page truly overflows; otherwise the wheel is
forwarded to the outer choreography (`src/timeline.ts`, `overscroll-behavior: auto`).

---

## Project Structure

```
├── index.html / 404.html      # Entry + styled 404 (CSP meta, OG tags, noscript fallback)
├── public/
│   ├── assets/                # Portrait, AB emblem, Iran flag, CV PDF, audio clips
│   ├── favicon.svg, og-cover.*, robots.txt, sitemap.xml
├── src/
│   ├── main.ts                # Bootstrap, mode detection, view switching
│   ├── timeline.ts            # Master scroll choreography + stamp slam finale
│   ├── config.ts              # All tunable timings, weights, easings, thresholds
│   ├── content.ts             # Personal copy & settings (single source)
│   ├── projects.json          # Curated case studies
│   ├── github.ts              # Read-only GitHub enrichment + cache
│   ├── interactions.ts        # Easter eggs, parallax, copy-email, toasts
│   ├── audio.ts               # Lazy MP3 engine + procedural fallback
│   ├── plain.ts               # Accessible plain view
│   ├── pages/                 # cover, about, skills, experience, thesis, projects, contact
│   ├── svg/assets.ts          # Badge seal, postage flag stamp, icons
│   └── styles/                # tokens, folder, pages, plain
├── Dockerfile / nginx.conf / docker-compose.yml / .dockerignore
└── .github/workflows/ci.yml   # typecheck + lint + build
```

All dynamic strings interpolated into `innerHTML` pass through `esc()` (`src/escape.ts`),
and `index.html` ships a Content-Security-Policy meta tag (same-origin scripts/styles/fonts,
hash-allowlisted inline JSON-LD, GitHub API the only external connect target).

---

## Deployment

### Static hosts (Vercel / Netlify / Cloudflare Pages)

- **Build command**: `npm run build`
- **Output directory**: `dist`
- **404 page**: `dist/404.html` is automatically built alongside `dist/index.html`.

### Anywhere Docker runs

Use the included image (see [Docker](#docker)) — behind a reverse proxy, on a VPS, or on a
home server. Point your proxy at the container's port 80.
