# RusJet — Выше ожиданий

An independent Russian-language cinematic scroll website concept. Separate from FIELD / FORM and all other projects.

Four scroll-directed scenes: an actual 3D trijet in blue-hour flight → sculpted window portal → warm cabin → an actual 3D runway takeoff, followed by a single booking CTA. No navigation, intermediate buttons, forms, analytics, or external runtime requests. All fonts, GSAP scripts and images are self-hosted.

## Run

Requires Python 3 for the static preview. The Three.js production bundle is already built. Dependencies are already vendored in `dist/`; no install is required to view or host it.

```sh
python3 -m http.server 4317 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4317 . `npm run check` checks application JavaScript syntax. `npm ci --ignore-scripts` installs the source toolchain. After changing `src/aircraft.js`, run `npm run build` to produce the minified self-contained Three.js bundle. GSAP and fonts are vendored separately.

## Publish

GitHub Pages serves the `dist/` artifact via `.github/workflows/pages.yml` with no framework build, paid services, secrets or third-party runtime APIs. The `.nojekyll` file preserves plain static delivery. Research references and local QA screenshots are not deployed.

## Manager handoff

`dist/app.js` has a single `managerUrl = null` setting. Set it to an approved HTTPS manager/chat URL after the contact is provided. At present the CTA updates a polite status message; it makes no submission and invents no contact.

## Accessibility and performance

- Native document scroll; no wheel/touch interception, scroll traps or custom cursor.
- Reduced-motion system preference shows the same four scenes as static readable sections. The `?motion=reduce` preview parameter also selects this fallback for QA.
- Without JavaScript or GSAP, static sections and the contact placeholder remain readable.
- Three.js renders an original mesh aircraft with curved fuselage, swept airfoil wings, three engines with rotating fans, curved cockpit glass, cabin windows and retracting gear. GSAP / ScrollTrigger directs the typography and scene transitions. No paid services, trackers, video, autoplay audio, remote scripts or remote model dependencies.
- The aircraft genuinely translates, banks and changes orientation. Camera perspective changes with scroll. Ambient flight motion continues at stationary scroll; runway lights move in 3D during takeoff. This is not a still-image displacement effect.
- One transparent WebGL canvas is reused between flight and takeoff. Pixel ratio is capped (1.35 mobile / 1.65 desktop), mobile rendering is capped at 30 fps. Rendering stops offscreen, in background tabs and under reduced motion; no GPU renders are issued during the window/cabin segment. Devices without WebGL retain clearly illustrative image fallbacks.
- Separate portrait flight and takeoff assets for mobile, local subset WOFF2 fonts, compressed JPEG images.
- One keyboard-focusable CTA with visible focus and live status feedback.

See `THIRD_PARTY.md` for licenses and `RESEARCH.md` for verified nomenclature and fleet-source limitations. Images are clearly labelled as AI illustrations of a design concept.
