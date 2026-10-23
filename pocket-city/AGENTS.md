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
