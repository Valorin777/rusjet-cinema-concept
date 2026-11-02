# Current implementation and QA — real footage revision

The current site supersedes the 3D prototype after the user explicitly requested actual aircraft photos/video. The previous 3D motion evidence is historical, not proof of this revised site's visuals.

## Current implementation

- Real licensed H.264 footage of a business jet taxiing and a business jet taking off; actual aircraft camera footage at dusk in the closing scene.
- Real, unmodified Falcon 900EX cabin photo by Anton Bannikov, GFDL 1.2+, with visible attribution and full license bundled.
- No 3D canvas, generated aircraft imagery, or AI cabin imagery is imported by the current `index.html`.
- Scroll seeks the real clips; idle playback resumes natural movement. Only the active chapter plays. Reduced motion retains real posters and disables playback.
- Native scroll, oval window/cabin transitions, one final CTA, truthful unconfigured manager state, no forms.
- No private TikTok/Telegram material, secrets, fake registrations, fleet ownership claims, prices, specifications, or subscriptions.

## Verification

- Actual source video frames were inspected at multiple timestamps to confirm real aircraft motion. The takeoff clip shows the aircraft rising from the runway before exiting upward; the taxi clip is not mislabelled as takeoff.
- Real cabin photo and its primary Commons provenance / rights statement inspected.
- Desktop browser playback confirmed: H.264 readyState 4, currentTime advancing, paused=false, no canvas elements, inactive clips unloaded.
- Desktop/mobile transitions, reduced-motion path, CTA and final live deployment checks are recorded in the task handoff after completion.
- Actual physical-phone performance and every mobile browser were not benchmarked. Autoplay restrictions can retain the real poster until user interaction.

## Previous reference inspection

The user-supplied TikTok https://vt.tiktok.com/ZSgooM2gd resolved to @webloved video 7683163258341133590 and was played in its public 11-second embedded player. Visually observed: large split typography, a sculpted oval aircraft-window scene, a transition to a bright aircraft scene, and a globe scene. Source code/media were not copied.

## Deployment authorization

The first attempt to create the public repository was denied before execution by automatic approval review. Fresh explicit user voice evidence subsequently instructed public GitHub / GitHub Pages publication for RusJet. Only one retry of the previously denied publication is permitted on that new evidence; do not bypass a repeated denial. Current delivery state is recorded in the final handoff.


## Delivery verification

Public URL: https://valorin777.github.io/rusjet-cinema-concept/ . Separate public repository: https://github.com/Valorin777/rusjet-cinema-concept . Automatic approval accepted the single retry on fresh user approval; the publication blocker is resolved. GitHub Pages workflow succeeded; HTTP 200 and actual browser video playback were verified on the public origin. Local and remote main SHAs matched at validation.

Public browser QA confirmed 1 button, 0 forms, 0 canvas elements, advancing H.264 playback, inactive chapter videos paused/unloaded, real-photo cabin, no mobile horizontal overflow, and correct missing-manager feedback. The forced reduced-motion route had all four sections visible and no video sources loaded. Sixteen screenshots across 5.881 seconds capture the revised public site's real footage; the historical 3D GIF is superseded. Native Library artifacts for both the historical and current versions are recorded in the task handoff.


## 2026-11-02 cabin film and continuity update
- Replaced older still with actual licensed 4K-source cabin film, delivered 1080p; mobile uses full-frame letterboxing to retain the cabin rather than a crop of the wall.
- One native playhead per flight chapter: scroll applies a relative delta anchored to the current playback time. Completed clips hold the last frame; reverse scroll may rewind. No implicit play-on-ended restart. Coalesced asynchronous seeks resume only once settled.
- Fixed metadata loading when a user scrolls into an unloaded chapter; active footage now fetches metadata before pending seeks.
- Ten Node regression checks pass: early/mid/late idle→scroll, repeated gestures, end hold, reverse, asynchronous seek coalescing, resize/visibility, cabin playhead, initial chapter metadata load.
- Browser actual taxi idle→scroll observed 9.96→10.57 seconds. Takeoff ended forward input held 10→10; reverse moved to 9.33. Cabin decoded 1080p and played natively. Desktop 1280×720 and mobile390×844 viewed, no horizontal overflow; cabin heading within viewport. Forced reduced mode retains real posters.
- Replaced incomplete “Следуйте за своим” with “Навстречу новым местам”; “Искусство паузы” with “Время для себя”. Closing section and header verified byte-for-byte equal to previous published version.
- Remaining media limitation: takeoff source itself still has heat shimmer/telephoto softness. Searched additional free sources; candidates had a propeller aircraft, obstructed landing, military/airline footage, or restricted commercial rights. Did not substitute a misleading shot or claim a sharper original. Existing takeoff source remains, pending a suitable genuinely sharper real clip.
