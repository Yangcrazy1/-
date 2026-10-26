# Pocket City V0.7 — development instructions

- The user wants a genuinely playable mobile spherical-city sandbox. Continue implementation when new references arrive; do not stop at plans or ask for routine reversible choices.
- Edit `src-v7/characters.js`, `world.js`, `interface.js`, `interface.css`; use `scripts-v7/build.py` to build. The compatibility core is in `src-v7/runtime-v6-checkpoint.js`.
- Keep the downloadable self-contained HTML below 10,000,000 bytes. Never inflate files to imply quality. Never introduce runtime CDN, remote texture, audio, or font dependencies.
- Keep CJ, Tommy and Michael visually distinguishable. All locomotion states must use the same weighted body mesh. Preserve authored anatomy; do not replace people with poles, capsules or stick figures.
- Retain three connected districts, pedestrians, traffic, police, tasks, driving, aircraft, weapons, wheels, radio and saves. Never silently drop working features during visual upgrades.
- Skin weights must sum to 1 (quantized weights sum to 255). Test deformation at planet-space positions, not only at the local origin.
- Complete world is a sphere; travel across longitude seams and poles must remain continuous. Preserve swept collisions, camera obstruction tests, safe boarding / exiting and non-overlapping building footprints.
- All three fast-travel destinations need visible nearby pedestrians and traffic immediately. Population recycling must preserve passengers, active vehicles, police, targeted actors and wrecks; avoid visible pop-in during normal traversal.
- New sessions begin at 08:00. The day is 300 active seconds. Menus, wheels, overview and background pause the solar clock. Do not advance it from clamped physics time alone.
- Run `python3 scripts-v7/build.py`, `node --check game-v7.js`, `npm test` after relevant code changes. Inspect every failed check. Verify actual mobile layouts through the environment's supported browser preview.
- Do not claim phone FPS, WebGL shader correctness, platform review or store readiness based only on Node tests or a cloud software renderer. Record actual testing limits.
- Preserve `ASSET_MANIFEST.md`, original CC0 credit and the Three.js MIT license. Do not package unlicensed GTA extracted assets or commercial songs; retain local music import and original synthesized stations.
- Do not publish, create an external repository or bind a platform identity without a specified destination. Source packaging and local fixes are already authorized.

## V0.8 continuation

- Read README_V08.md and OPEN_SOURCE.md first. V0.8 uses the existing `scripts-v7/build.py` entry point plus new `src-v8/` modules. Do not edit generated bundles.
- `npm test` now runs `verify-v8.cjs`, retaining all 51 V0.7 checks and adding 10 behavioral checks. Run the browser smoke after changes affecting loading, touch scrolling, renderer or UI.
- Retain taxi, Ferrari-style cars, tracked tank, helicopter and fighter. Native touch scrolling in menus must not be disabled by an ancestor's touch-action.
- Keep file-protocol policy limitations and software GPU measurements separate from actual phone validation. Do not describe the H5 package as approved by Xiaohongshu.
- Use existing isolated checkouts; do not create Git worktrees unless the user requests one.

## V0.9 continuation

- User explicitly prioritizes a downloadable mobile H5 playtest and debugging. Build a Xiaohongshu upload package only when subsequently requested.
- Read README_V09.md. Edit `src-v9/` for coast/landmarks/art/map. The build entry point remains `scripts-v7/build.py`; npm test runs 70 checks through `verify-v9.cjs`.
- Preserve normalized weights when cutting clothing seams. Attach new accessories with skeleton bind inverses, not an animated head/hand world matrix.
- Keep coastal blocking, walkable bridges/pier, clear landmark arrival points, and solid casino/sphinx collision. Browser checks: `scripts-v9/browser-smoke.py`.

## V0.10 fresh bay continuation

- User reference project/session: `01a16708-2512-71fc-94bc-1e85de06a0a9`. Read PROJECT_STATUS.md, README_V10.md, ACCEPTANCE_V10.md and current git status before editing. Current workspace is authoritative; never overwrite it with old ZIPs.
- User selected medium Android, 30 FPS target, and explicitly requires verified HTTPS mobile downloads like V0.9. Keep offline HTML below 10,000,000 bytes. Actual phone performance remains unverified without devices.
- Edit src-v10/ plus necessary compatibility hooks. Config is src-v10/config.json; it is embedded by scripts-v7/build.py. Maintain shared spherical wave/seabed/shore/bridge/walk/vehicle heights and local-frame normals; never project bay decks onto the antipode.
- Signals, pedestrian lights and traffic use one active clock. Retain all-red clearance and in-progress crossing protection. Cars must brake before the stop line and start smoothly; waterfront decks remain pedestrian-only.
- Preserve the same weighted body and skeleton through all protagonist states. Keep normalized weights, bind-space accessories, grounded feet, warm role-specific clothing, and resource disposal when changing actors/previews.
- npm test runs verify-v10.cjs with 81 cases. Legacy assertions remain; the radial error now compares analytic terrain, and melee waits for its preparation time before checking the same damage. Do not weaken those checks.
- UI/render changes require scripts-v10/browser-smoke.py and scripts-v10/acceptance.py; the latter injects QA hooks not present in delivered HTML. Confirm report hashes match the final HTML. Run scripts-v10/endurance.py for final 600-second cloud evidence, and describe SwiftShader limits.
- Update PROJECT_STATUS.md at substantive stages in Chinese progress updates. Keep pre/post camera evidence and explicit acceptance gaps. Package single English-named HTML, runnable ZIP, source, config, screenshots/checklist; verify ZIP CRC and actual HTTPS bytes before claiming delivery.

## V0.11 character / compact city continuation

- User confirmed V0.9 characters + compact streets, then requested smaller map, richer surroundings, distant scenery and the title “侠盗自由城”. Preserve the same body and avoid new hard-gated procedural pose changes.
- Read README_V11.md and PROJECT_STATUS.md. Edit src-v11 and necessary hooks. World radius comes from src-v11/config.json and must agree across CPU, water Shader, ground and navigation.
- npm test runs 89 checks, preserving the prior 81. Some old fixture coordinates are converted to preserve metre distances on the smaller sphere. Building centres need not remain over 5 m apart; actual non-overlap and at least 0.18 m geometric separation are required.
- scripts-v11 contains final browser / visual / acceptance / 600-second endurance checks. Keep report SHA values tied to the delivered HTML; never represent software GPU results as handset FPS.
- User explicitly wants a single HTML and no playable ZIP. New filename outlaw-liberty-city-v0.11-mobile.html. This overrides earlier ZIP packaging instructions for the playtest.
- User also requested a Xiaohongshu upload version. The actual upload entry / docs are pending; platform/h5-candidate is explicitly a static H5 candidate, not an SDK mini-game project. Do not call it upload-ready until the target format is confirmed and tested.

## V0.12 dense street continuation

- Continue from current V0.11 workspace; user says distant buildings still leave too much blank space. V0.12 keeps actors and all prior gameplay, reduces radius 116 → 104 m and narrows road surfaces.
- Read README_V12.md and PROJECT_STATUS.md. Edit src-v12/ and necessary compatibility hooks; build with scripts-v7/build.py. Current npm test is verify-v12.cjs (95 checks).
- Rendering uses a local logarithmic street projection; physics and overview remain spherical. Any screen picking, target labels, frustum bounds or camera ray changes must use the same mapping. Never apply this mapping to simulation coordinates or the overview globe.
- Use atan of tangent length and radial cosine near the player; acos quantizes millimetre offsets in GLSL. Nested preview / PMREM scenes must temporarily disable projection and restore the parent render state.
- Material projection hooks use a WeakSet because cloned userData flags alone do not prove that a cloned material retained its compile callback. Preserve Canvas fallback for instanced scenery.
- Browser checks / actual captures / final 600-second endurance live in scripts-v12 and reports/v12; freeze HTML before final evidence. No Android FPS claim from SwiftShader. Deliver single outlaw-liberty-city-v0.12-mobile.html, no playable ZIP.

## V0.13 island art / characters / MiniTool continuation

- User's latest reference is 1000117039.jpg: coral/orange, slate/ocean blue, cream frames, blue roofs, warm sand and clear cyan water. Preserve the compact R=104 cities and V0.12 projection; do not enlarge the map.
- Edit src-v13 plus required hooks. Heroes use continuous CC0 body topology, canonical duplicate-position skin weights and normals, bind-space painted clothes, and merged shoes. Never reapply the old triangle cutting / hard outline to a coastal13 body. Keep every protagonist's one body through actions.
- Build scripts-v7/build.py; npm test runs verify-v13.cjs (98 checks, retaining the prior 95). Browser, visual, acceptance and final 600-second evidence live in scripts-v13 and reports/v13; match artifact SHA.
- User explicitly requested a Xiaohongshu upload package. platform/xhs-minitool targets Creator MiniTool offline ZIP (root index.html and local classic scripts), based on publicly synchronized official 1.6.0 docs. Read its README.md and SOURCES.md. No eval / inline JS / network / Worker / WASM. ES2017 / Chrome 61. Keep native Storage error handling and schema. Do not call local CSP/mock evidence real-container acceptance or review approval.
- Phone playtest remains a single English-named HTML, no playable ZIP. The separate xhs-minitool ZIP is for platform upload, not for phone unpacking. Publish downloads to the already specified Yangcrazy1/- repository feature branch and verify actual HTTPS bytes. No new host, identity or main-branch push is implied.
