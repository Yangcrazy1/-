# PROJECT STATUS — Fresh Bay / V0.10

- Reference project/session: `01a16708-2512-71fc-94bc-1e85de06a0a9`.
- Repository: `Yangcrazy1/-`; initial branch `codex/mobile-playtest-v09`, initial commit `f59f72e63fcdcf626db6bacccb1297c45c7dd4a8`.
- Development baseline: current untracked `pocket-city/` V0.9 working tree, retained in full; no imported ZIP overwrote it. File hashes: `reports/v10/baseline/manifest.json`.
- Target: offline mobile H5, medium Android, stable 30 FPS goal. Platform upload is a later user-requested step.
- Art reference: warm natural timber, sage vegetation, clear turquoise shore and complete stylized adults. CJ image guides proportions, not extracted game assets.
- Current phase: 95 m bay sample implemented; 81 logic checks passed, including 20 vehicle and 20 protected pedestrian crossings. Browser acceptance and endurance remain in progress.
- Completion: implementation and testing 100%; delivery checksum verification in progress; implementation and acceptance still in progress.
- Testing environment: Linux cloud, Node 24 / Python 3.12, Chromium WebGL via SwiftShader. Physical Android/iPhone tests are unavailable; phone FPS and local-file compatibility remain unverified.
- Required evidence: same-camera before/after, logic regressions, 20 signal cycles, bounded effect recovery, touch/flight layouts, 10-minute cloud endurance with average FPS/P95/render calls/triangles/resource trends, download checksum.
- Next: implement coast/water and environmental sample, then traffic, actors/UI, performance/acceptance and verified HTTPS downloads.
- Preserved: connected spherical districts, all protagonists and weighted skeletons, cars/theft/police/tasks/weapons/radio/helicopter/fighter/saves/planet overview.

- Implementation branch: `codex/fresh-bay-v010`; baseline preservation commit: `c65ebc8`. Final source and download commits are recorded during packaging.
- Browser checks passed before final bridge/shore patch: 9 touch layouts, 20 actual AI crossings, water pixel motion, effect recovery, multi-touch cancellation, modal isolation, preview resources stable at 16 geometries / 6 textures. Final SHA checks passed; endurance completed.

- Final short checks match HTML SHA `60c380d5407060c849457a602ca48e3cdee524e04900d81d2bca55a116e82c8a`; 81 logic tests, WebGL smoke and acceptance pass. Camera-only tree canopy proxies added after visual inspection. Ten-minute final endurance is running; interrupted earlier run is not accepted as completion.

- Endurance: first 180-second walking phase completed without errors; driving phase is running. Resource increases on first visits are being measured rather than assumed to be leaks or zero growth.

- Implementation commit: `41c6861`; current branch `codex/fresh-bay-v010`. Final H5 SHA remains `60c380d5407060c849457a602ca48e3cdee524e04900d81d2bca55a116e82c8a`.
- Endurance completed: over 600 actual seconds, walking/driving/helicopter/fighter, no script or Shader errors. Detailed FPS/P95/resource changes: reports/v10/endurance.json and SUMMARY.md. Cache counts grow on first visits; do not claim zero growth.
- Source independently rebuilt to byte-identical HTML. Download artifacts are being packaged; verified HTTPS links will identify the final published commit. Main is preserved.

- Endurance result: 602.77 real seconds. Cloud SwiftShader averages approximately 5.00 / 6.40 / 5.72 / 6.94 FPS for walk / drive / heli / fighter; this does not establish Android 30 FPS. First-visit GPU caches increased to 1,672 geometries / 210 textures; trend is recorded, not described as zero growth.
