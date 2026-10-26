# V0.13 final cloud evidence

Linux Chromium / WebGL / SwiftShader, shared CPU. No physical Android / iPhone / Xiaohongshu-container acceptance.

| Build | Mode | Seconds in complete run | Mean FPS | P95 rendered interval (ms) |
| --- | --- | --- | --- | --- |
| Single HTML | walk | 604.62 | 2.47 | 583.30 |
| Single HTML | car | 604.62 | 3.10 | 499.90 |
| Single HTML | heli | 604.62 | 2.73 | 500.00 |
| Single HTML | jet | 604.62 | 3.35 | 466.60 |
| MiniTool CSP + SDK mock | walk | 604.72 | 2.74 | 533.30 |
| MiniTool CSP + SDK mock | car | 604.72 | 3.24 | 483.20 |
| MiniTool CSP + SDK mock | heli | 604.72 | 2.87 | 466.70 |
| MiniTool CSP + SDK mock | jet | 604.72 | 3.34 | 499.90 |

Per-phase begin/end and sampled draws, triangles, geometries, textures and heap are in the corresponding endurance.json. Entering a new mode retains a test vehicle and visits new views; resource cache growth is recorded, not presented as a leak-free proof.

The single-HTML and MiniTool runs are sequential. Different default quality and role mean the FPS values are not a controlled comparison of package formats.

Base HTML SHA-256: `b35f30af3372f901b3e8590d073f968e0a4fa5cd7663fdbaaebc3fec636a5adf`.
