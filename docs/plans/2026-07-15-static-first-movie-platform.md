# Static-First Movie Platform Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Turn the existing visual prototype into a usable static-first movie site with its own JSON catalog, browser-local library state, playback, production deployment, and HTTPS.

**Architecture:** React pages consume repository interfaces rather than files or browser storage directly. Version one implements those interfaces with same-origin static JSON and localStorage; a future backend can replace them with `/api/titles/:id` and account-backed library adapters without rewriting page components. Code and the full catalog are deployed separately, while both belong to this project operationally.

**Tech Stack:** React 18, TypeScript, Vite, React Router, Artplayer, hls.js, Vitest, Nginx, rsync, Certbot.

---

### Task 1: Establish data contracts and repository boundaries

**Files:**
- Create: `src/types/title.ts`
- Create: `src/data/catalogRepository.ts`
- Create: `src/data/staticCatalogRepository.ts`
- Create: `src/data/catalogContext.tsx`
- Test: `src/data/staticCatalogRepository.test.ts`

**Steps:**
1. Define manifest, title summary, title detail, episode, source, home, catalog, and search-index types.
2. Define repository methods for manifest, home, catalog pages, title details, playback sources, and search.
3. Implement bucket calculation and same-origin JSON loading with request deduplication.
4. Test bucket lookup, HTTP errors, missing IDs, category lookup, and search matching.
5. Run `npm test` and verify all repository tests pass.

### Task 2: Add dynamic routing and data-driven pages

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`
- Modify: `src/pages/MoviesPage.tsx`
- Modify: `src/pages/MovieDetailPage.tsx`
- Modify: `src/pages/ShowDetailPage.tsx`
- Create: `src/pages/SearchPage.tsx`
- Create: `src/pages/LibraryPage.tsx`
- Create: `src/pages/NotFoundPage.tsx`
- Create: `src/components/AsyncState.tsx`

**Steps:**
1. Add React Router and routes for `/`, `/movies`, `/title/:id`, `/play/:id`, `/search`, `/favorites`, `/history`, and `*`.
2. Load home JSON and map real catalog records into the existing visual rails.
3. Load title details by ID and select the movie or episodic layout from `category`.
4. Render only fields that exist; remove fabricated cast images, reviews, language, music, durations, and episode descriptions.
5. Add explicit loading, request-failure, and not-found states.
6. Verify direct navigation and browser refresh for every route.

### Task 3: Add local library state

**Files:**
- Create: `src/types/library.ts`
- Create: `src/lib/libraryRepository.ts`
- Create: `src/lib/localStorageLibrary.ts`
- Create: `src/lib/libraryContext.tsx`
- Test: `src/lib/localStorageLibrary.test.ts`

**Steps:**
1. Store versioned favorites, history, and per-episode progress under `movie-night:library:v1`.
2. Validate and recover from malformed browser data.
3. Keep at most 100 history entries and synchronize changes across tabs.
4. Define merge-friendly timestamps for future account migration.
5. Test toggling favorites, history ordering, progress replacement, limits, and corrupt storage.

### Task 4: Add playback and progress tracking

**Files:**
- Create: `src/pages/PlayPage.tsx`
- Create: `src/components/VideoPlayer.tsx`
- Modify: `src/components/PlayButton.tsx`
- Modify: `package.json`

**Steps:**
1. Install and configure Artplayer and hls.js.
2. Load sources independently from title metadata so source failure does not break the detail page.
3. Support episode selection through URL query parameters.
4. Restore progress, save every 10 seconds and on pause/unload, and clear completed progress.
5. Add history only after 30 seconds of actual playback.
6. Verify HLS playback, episode switching, resume, and graceful CORS/source failures.

### Task 5: Own and validate the static catalog

**Files:**
- Modify: `.gitignore`
- Create: `public/data/.gitkeep`
- Create: `public/data.sample/manifest.json`
- Create: `scripts/sync-data.sh`
- Create: `scripts/validate-data.mjs`
- Create: `scripts/deploy-data.sh`
- Modify: `package.json`

**Steps:**
1. Ignore the full `public/data` tree while keeping a documented placeholder and small test fixture.
2. Bootstrap the local catalog from `/Users/zzm/Documents/mvnight/public/data` as a physical copy.
3. Extend the copied manifest with `schemaVersion` and `dataVersion` without changing title IDs.
4. Validate required files, counts, detail/source bucket parity, and representative records.
5. Upload data into a new server release directory and atomically switch the project data symlink.

### Task 6: Build, test, and visually verify

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`
- Modify: `src/styles.css`

**Steps:**
1. Install dependencies with `npm ci` after updating the lockfile.
2. Run unit tests, TypeScript validation, and production build.
3. Start the local server and inspect desktop and mobile pages in a real browser.
4. Verify that dynamic content does not overflow, disappear incoherently, or shift controls.
5. Verify browser console and network requests contain no unexpected errors.

### Task 7: Deploy code and configure Nginx/HTTPS

**Files:**
- Create: `scripts/deploy-code.sh`
- Create: `scripts/bootstrap-server.sh`
- Create: `docs/deploy.md`

**Steps:**
1. Audit the existing Nginx site and preserve a backup before replacement.
2. Upload the production build to a timestamped release and atomically switch `current`.
3. Configure `mvnight.xyz`, SPA fallback, static SEO fallback, gzip, cache policies, security headers, and `/data/` alias.
4. Stop and disable the superseded service only after identifying it and confirming the new static site is ready.
5. Obtain and install a Let's Encrypt certificate, redirect HTTP to HTTPS, and enable renewal.
6. Verify HTTPS, certificate chain, root page, `/title/:id`, `/data/manifest.json`, caching, and playback from the public domain.
