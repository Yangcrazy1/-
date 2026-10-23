# V0.11 actual test summary

Final HTML SHA-256: `14bdb6cb5b22bd199a9f3c43a0ec00bd57b7aa8a541d3394083347a261bb4cf0`.

89 logic checks passed. Browser smoke, actual traffic, touch layouts, offline launch and visual checks passed. All final reports match this HTML.

Cloud endurance: 603.97 real seconds; no JavaScript or Shader errors.

| Mode | Mean FPS | P95 interval ms | End draw calls | End triangles | Geometry / texture counts |
| --- | ---: | ---: | ---: | ---: | ---: |
| walk | 1.72 | 766.7 | 226 | 578296 | 290 / 70 |
| car | 4.94 | 316.7 | 301 | 542609 | 850 / 156 |
| heli | 5.09 | 316.5 | 320 | 609032 | 1215 / 182 |
| jet | 6.25 | 266.7 | 393 | 703352 | 1572 / 229 |

SwiftShader software GPU on a shared cloud CPU, not a phone. The walking phase overlapped browser smoke/visual/acceptance processes; FPS is a stress-run observation and is not comparable to isolated V0.10 measurements. No Android 30 FPS claim. JS heap is browser-reported and quantized; GPU bytes were not measured.

First-visit geometry/texture caches grew during the run; do not call this zero-growth memory. Final resource counts and per-phase samples are in endurance.json.

Xiaohongshu upload entry/docs are still pending. The supplied platform directory is a clearly labeled H5 static candidate, not an SDK mini-game project.
