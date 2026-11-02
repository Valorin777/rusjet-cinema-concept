# Text contrast — 2026-11-02

The mobile cabin overlay was transparent over the middle of the frame. On short phones, the body copy crossed bright windows and became unreadable. A second issue affected laptops: the first scene lacked its own stacking context, allowing its shade to paint above later scenes and dim their text.

## Changes

- Isolate each scene's stacking context so its media and shade remain beneath its own text.
- Add softly feathered, text-sized dark scrims to the flight, cabin and departure copy. They move with the text during scroll transitions.
- Protect small captions, the progress indicator and header against bright footage.
- Increase cabin body-copy contrast and mobile type size.
- Compact the text layout in windows at most 600px high; allow the sticky stage to fit a landscape phone without cutting off its captions.
- Version the stylesheet URL to refresh cached styles.

The video sources, playback controller, Russian copy and final booking scene are unchanged. Header content and layout are unchanged; only its background contrast is protected.

## Verification

Inspected the actual rendered page in the in-app browser at 375×667, 390×844, 667×375, 1280×720 and 1366×600. Checked bright cabin frames, flight and takeoff text, the window transition, the closing scene, and the reduced-motion poster fallback. Inspected scroll entry/exit as well as settled text. No horizontal overflow was observed. At 667×375, cabin body text ends at y225 and the caption begins at y256; the full caption remains within the viewport.

The opaque portion of the main-copy scrim extends beyond its text before feathering. Its 82% dark layer provides approximately 9.4:1 contrast for cream text and 5.9:1 for the small warm labels even over unfiltered white, when the copy is fully visible. Intentional entry/exit fades are not included in these ratios.

`npm run build` passed JavaScript syntax checks and all 13 existing video-continuity tests. `git diff --check` passed. No playback code or footage changed. Evidence screenshots are stored locally under `evidence/contrast/` and excluded from the public source.

Coverage is browser viewport testing, not a claim of testing every physical phone or browser engine.
