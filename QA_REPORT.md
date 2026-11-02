# QA and implementation handoff — 2026-11-02

## Completed

- Independent project, no existing project files edited.
- Actual user TikTok video played and visually inspected (public embedded player, 11 seconds); oval window, split typography and aircraft scene informed the art direction.
- Original real 3D aircraft, not a flat still or image displacement: curved fuselage and cockpit glazing, profiled swept wings/winglets, three nacelles with rotating turbines, windows, trim, navigation lights, retractable gear.
- Scroll-driven 3D translation, changing aircraft orientation, banking, perspective camera trajectory, takeoff from a 3D runway, lift and gear retraction. Independent ambient aircraft transforms continue at stationary scroll.
- Window portal and illustrated warm cabin; final single booking CTA with truthful unconfigured-manager feedback.
- Static illustrated fallback for reduced motion / unavailable WebGL. No external runtime service, paid tool subscription, remote model, audio, forms, or invented manager contact.

## Verification performed

- `npm run build` and `npm run check`: pass.
- HTML local asset references: all present.
- Credential-pattern scan of deployable source and documentation: no matches.
- Actual browser desktop QA at 1280×720 and mobile QA at 390×844: all chapters inspected, no horizontal overflow.
- Continuous scroll captured as 16 real browser frames spanning 5.265 seconds; underlying mesh and camera transforms changed alongside viewport scroll from 0 to 810. `evidence/scroll-motion.json` records the capture and `evidence/real-3d-scroll-proof.gif` preserves its actual frame timing.
- Stationary-scroll evidence: `evidence/ambient-motion.json` records different 3D aircraft poses at identical scrollY=0 and identical mobile camera position, with matching before/after screenshots.
- Forward takeoff, increasing height, gear retraction and reverse scroll inspected visually on mobile.
- Browser output: approximately 56–59 draw calls and 52k–57k triangles in visible 3D scenes. Mobile rendering is capped at 30 fps; device frame rate was not benchmarked on a physical phone.
- Reduced-motion fallback exercised with `?motion=reduce`: zero canvases, all four sections visible at viewport height, ordinary document scrolling. System-preference handling inspected in source; global OS preferences were not changed.
- Final CTA clicked in browser: 1 button, 0 forms, expected live status message, no fabricated submission. No stale `aria-expanded` attribute.
- No application warnings/errors observed in captured browser logs filtered to the local origin.

## Source and deployment

- Entry point: `dist/index.html`.
- Original 3D source: `src/aircraft.js`; bundled production output: `dist/aircraft.js`.
- Scene/typography controller: `dist/app.js`.
- Launch: `npm run dev` (127.0.0.1:4317).
- Planned target: new public repository `Valorin777/rusjet-cinema-concept`, independent GitHub Pages URL.
- GitHub Pages workflow is prepared; no existing repository or Site was modified.

## Remaining blockers / limits

1. **Public publication denied before execution.** Automatic approval review rejected creation of the public GitHub repository because it judged the delegated evidence insufficiently explicit for this exact public release. No repository was created, no origin remote was installed, and no source was pushed. Do not work around the rejection. Await fresh explicit human approval naming public GitHub / GitHub Pages delivery for this independent RusJet concept, then retry the denied operation once.
2. Manager URL is intentionally unconfigured, pending the actual approved contact. The final button correctly explains this.
3. Official airline site `rusjet.aero` returns HTTP 403. The official operator register also could not be retrieved. Present fleet claims are consequently omitted. Correct aircraft nomenclature **Falcon 900EX EASy** is confirmed by Dassault; the 3D jet and AI artwork remain clearly illustrative and are not claimed as exact aircraft or actual RusJet fleet/cabins. See `RESEARCH.md`.
