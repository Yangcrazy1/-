# PROJECT STATUS — V0.11 character and compact city repair

- Reference session: `01a16708-2512-71fc-94bc-1e85de06a0a9`.
- Repository `Yangcrazy1/-`, branch `codex/character-city-v011`, baseline commit `2f5a4e6bd2f9d360886771cce7802ab2b02c3040`.
- Current workspace is the baseline. Previous ZIPs have not overwritten any work.
- User confirmed: V0.9 character look, compact populated streets. Latest constraint: smaller map, more variety, fewer empty lots and visible distant scenery. Deliver a single downloadable HTML, no ZIP.
- Progress: 98%. Baseline saved in reports/v11/baseline/. Implementation, 89 logic checks, browser smoke, visual checks and acceptance passed. Final 600-second cloud endurance and verified HTTPS delivery are in progress.
- Baseline: 580 buildings; median approximate nearest facade gaps 3.61 / 3.47 / 3.32 metres by district. At 60 animation Hz, maximum ankle step in place is approximately 9.14 cm walking and 24.22 cm sprinting; this is a discontinuity diagnostic, not a physical foot-slip measurement.
- Suspected regressions: V0.10 leg/body remodelling and hard-gated foot IK; animation advancing faster than physics during slow render frames; sparse frontage placement and missing distant detail.
- Preserve all spherical city, traffic, pedestrian, vehicle, aircraft, mission, combat, radio, save and overview features.
- Environment: cloud Chromium / WebGL via SwiftShader, Node / Python. No physical phone available. Android FPS and local-file opening remain unverified.
- Remaining: implement, compare character poses and street views, run all regressions plus targeted movement/density tests, final browser checks, 600 second stability run and verify actual HTTPS HTML bytes.

- Product renamed to 侠盗自由城. New user request: additional Xiaohongshu upload version. Actual upload page or platform documents are pending; platform/h5-candidate clearly records this limitation.
- Current compact map: radius 116 m, 52 roads, 352 buildings, 21 pocket places, 3 offshore headlands. Median approximate nearest gaps 1.70 / 1.56 / 1.78 m.
- Browser: no JS / Shader errors, 20 red-stop / green-start trials, 9 control layouts, 3-finger cancellation, offline launch with no network requests. Preview memory stable at 11 geometries / 9 textures after six switches.
- Endurance reruns before the final shader-radius / version metadata correction were interrupted and are not accepted as final evidence. Final run must match the delivered file hash.

- Frozen final HTML: 2,998,319 bytes, SHA-256 `14bdb6cb5b22bd199a9f3c43a0ec00bd57b7aa8a541d3394083347a261bb4cf0`. Independent clean-directory rebuild is byte-identical. All 89 checks and final browser reports match this build.

- Implementation commit: `98389d1`; final evidence / download commit will be recorded after packaging.

- Final endurance completed: 603.97 real seconds; no script or Shader errors. Cloud mean FPS walk / car / heli / jet: 1.72 / 4.94 / 5.09 / 6.25. Walking overlapped the short browser checks on shared CPU; this is not comparable to isolated V0.10 or Android performance. Full limitations and P95 / draw / triangle / memory evidence: reports/v11/SUMMARY.md.
- Final-run GPU resource counts ended at 1,572 geometries / 229 textures. Initial-visit caches increased; actual GPU bytes and handset behavior remain unverified.
- Delivery status: HTML export / HTTPS verification in progress; Xiaohongshu upload target still pending user input.
