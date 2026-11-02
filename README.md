# RusJet — Выше ожиданий

Independent Russian-language cinematic scroll website concept. Separate from FIELD / FORM, LAST WIND and all other projects.

The current website uses **real licensed aircraft footage and a real Falcon 900EX cabin photograph**, following the user's request to replace the procedural 3D aircraft. Scroll seeks through the actual video; when scrolling stops, natural footage playback resumes. No drawn or generated aircraft appear in the current site. The original 3D prototype source remains in `src/aircraft.js` as an unused experiment / project history and is not imported or rendered.

## Run

The site is plain static HTML/CSS/JavaScript. No install or build is needed to view or host `dist/`.

```sh
python3 -m http.server 4317 --bind 127.0.0.1 --directory dist
```

`npm run check` validates both application scripts. `npm run build` performs the same static checks. No server, secret, paid service, tracker, form or API is needed.

## Story

Real business-jet taxi → expanding oval window → authentic Falcon 900EX cabin → real head-on takeoff → dusk aircraft and the single final CTA. GSAP / ScrollTrigger directs scene transitions and typography. The source clips are self-hosted, muted H.264 with frequent keyframes and fast-start metadata. Only the active chapter's video plays. Videos load as needed; reduced motion retains real stills and skips playback.

## Manager handoff

`dist/app.js` has `managerUrl = null`. Set this to an approved manager/chat HTTPS URL when supplied. The current button shows an honest contact-not-configured message and makes no submission.

## Attribution and factual limits

The site is explicitly an independent visual concept, not the official airline site. Stock planes and the archival cabin are not represented as RusJet fleet or its current equipment. No fleet counts, ownership, specifications, prices or destinations are invented. See `RESEARCH.md`.

All media licenses and source links are in `THIRD_PARTY.md`. The cabin photographer is credited in the visible footer, and the complete GFDL text is included in `dist/assets/GFDL-1.3.txt`. No footage or screenshots from the user's TikTok / Telegram reference are included.

## GitHub Pages

`.github/workflows/pages.yml` deploys `dist/` directly. Enable Pages with build type `workflow`, then push `main`. This project uses a new repository and does not modify another project. See `QA_REPORT.md` for verification status.
