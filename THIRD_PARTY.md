# Third-party notices and media provenance

## Real footage — Pexels License

The Pexels license permits free website use and editing and prohibits implying endorsement: https://www.pexels.com/license/ . Clips are used as illustrative stock footage in a clearly independent concept, not represented as the actual RusJet fleet or as endorsements.

- `dist/assets/footage/taxi.mp4` and `taxi-poster.jpg`: Jake Heinemann, “Airplane Preparing For Take Off”, https://www.pexels.com/video/airplane-preparing-for-take-off-1650628/ . Real business-jet taxi footage, trimmed from 1 second to 14 seconds, resized to 1600px, 25 fps, H.264, no audio. Not described as an actual takeoff.
- `dist/assets/footage/takeoff.mp4` and `takeoff-poster.jpg`: Alexander Grigorian, “Video of Jet Taking Off”, https://www.pexels.com/video/video-of-jet-taking-off-7397244/ . Real head-on private-jet footage; visually checked through rotation/climb and departure out of frame. Trimmed from 7 to 17 seconds, resized to 1600px, 30 fps, H.264, no audio. The provider's generated prose says “lands” while the title and observed rising trajectory show takeoff; no exact model is claimed.
- `dist/assets/footage/dusk.mp4`, `dusk-poster.jpg` and `sky-real.jpg`: Joerg Mangelsen, “Luxury Private Jet on Tarmac at Dusk”, https://www.pexels.com/video/luxury-private-jet-on-tarmac-at-dusk-34746862/ . Real exterior camera movement around a parked Embraer Phenom 300 (type visible on the aircraft), used in the closing background. Trimmed from 1 to 11 seconds, resized to 1600px, 25 fps, H.264, no audio. Sky texture is an extracted crop of sky from this same footage. The parked plane is not misdescribed as flying.

## Actual Falcon 900EX cabin photograph — GFDL 1.2 or later

`dist/assets/cabin-real.jpg` is an unmodified copy of “Dassault Falcon 900EX AN1409021.jpg”, photograph by **Anton Bannikov**, taken at JetExpo 2008, Moscow Vnukovo, on 19 September 2008. The photo page identifies the aircraft as Falcon 900EX, registration F-HBDA. It does not establish the EASy variant or RusJet operation.

Source: https://commons.wikimedia.org/wiki/File:Dassault_Falcon_900EX_AN1409021.jpg
Original transparent copy: https://upload.wikimedia.org/wikipedia/commons/0/02/Dassault_Falcon_900EX_AN1409021.jpg
License: GNU Free Documentation License, Version 1.2 or any later version, with no invariant sections, front-cover texts or back-cover texts. Full license copy: `dist/assets/GFDL-1.3.txt`, https://www.gnu.org/licenses/fdl-1.3.txt . Wikimedia VRTS ticket 2012092710005647 confirms the photographer's permission. The visible site footer carries attribution and a license link. The image file is unchanged; responsive display and a separate CSS dark overlay do not alter the distributed original image.

## Libraries and fonts

- GSAP and ScrollTrigger by GreenSock / Webflow, official `gsap` npm package. Standard No Charge License: https://gsap.com/community/standard-license/ . Original distribution notices are retained. This is a website, not a visual animation builder.
- Manrope, copyright the Manrope Project Authors, SIL Open Font License 1.1. Full license: `dist/assets/fonts/manrope-LICENSE.txt`.
- Cormorant Garamond, copyright the Cormorant Project Authors, SIL Open Font License 1.1. Full license: `dist/assets/fonts/cormorant-garamond-LICENSE.txt`.
- The unused original 3D prototype source in `src/aircraft.js` was authored for this concept; Three.js Authors' MIT license is retained at `dist/assets/vendor/THREE-LICENSE.txt`. Three.js is not loaded by the current website.
- FFmpeg is used only locally to prepare footage, not loaded or shipped to site visitors.

The simple text wordmark and abstract chevron are original concept treatments. RusJet, Dassault, Falcon, Embraer and other names belong to their respective owners. No official affiliation, fleet ownership, or endorsement is claimed. No user reference video, music, private data, or paid stock media is included.


## Cabin video added 2026-11-02
- RDNE Stock project, “Business People in Private Jet”, Pexels 5778859: https://www.pexels.com/video/business-people-in-private-jet-5778859/
- Original 3840×2160, 23.98fps real filmed stock, not CGI. Pexels free commercial-use license: https://www.pexels.com/license/
- Trim 0.3–7.3s, downsample to 1920×1080 H.264 CRF19, audio removed; poster extracted from the same film. Runtime files `assets/footage/cabin.mp4`, `cabin-poster.jpg`.
- Actors shown in a staged stock scene. No claim they are RusJet customers or that the depicted cabin belongs to RusJet; no aircraft model identification asserted.
- Supersedes the previous Falcon 900EX still on the visible website. Historic cabin still retained in repository with its existing license.
