# PROJECT STATUS — V0.12 紧凑街景与庭院环境

- 参考会话：`01a16708-2512-71fc-94bc-1e85de06a0a9`。
- 仓库：`Yangcrazy1/-`；当前分支 `codex/cozy-dense-v012`，基线 `fb978f9`（V0.11）。没有用旧 ZIP 覆盖工程。
- 当前进度 100%：实现、95 项回归、最终浏览器验收 / 截图、604.83 秒独立持续运行、独立重建及 HTTPS 字节校验全部完成。
- 用户本轮问题：大面积路面、远处楼间空白；图 2 的木材、庭院、清新水岸为参考。保留 V0.11 三位主角和全部既有玩法。
- 半径 116 → 104 米，线性距离减 10.3%，球面面积减 19.6%；目前 320 栋建筑，近邻近似间距中位数 1.32 / 1.25 / 1.42 米（构建最终冻结后更新）。
- 技术原因：小球面的地平线过近，单纯缩小半径会进一步隐藏前方房屋。近景使用连续局部投影，模拟、导航、碰撞保持球面，总览仍显示真实星球；屏幕拾取及镜头障碍同步校正。
- 测试环境：Linux Chromium WebGL / SwiftShader、Node。暂无实体安卓手机；不将云端帧率视为真机 30 FPS 证明。
- 冻结 HTML：3,019,973 字节，SHA-256 `7d0d1d9245502c607c40b54b09f902fa06d2638bfb6a15506cede29655043dbc`。逻辑报告含相同哈希。
- 实现提交：`bb15013`。最终短时证据全部匹配冻结哈希，无脚本或 Shader 错误；9 个布局、三指取消、20 次红停绿起及离线零请求已验证。
- 最终持续运行 604.83 秒，无脚本／Shader 错误。分模式平均 FPS / P95 / 绘制 / 三角形 / 资源见 reports/v12/SUMMARY.md；均为 SwiftShader，不能当作安卓性能。
- 下载／证据提交：`b4b15a6f77a7cbd00302503b2f2450ffdefab736`。手机 HTML 与对比 HTML 的两种 GitHub HTTPS 地址均返回 200，长度和 SHA-256 与本地逐字节一致。
- 校验记录：`../downloads/outlaw-liberty-city-v0.12-download-verification.json`。GitHub 原始 HTML 返回 text/plain，手机长按链接选择“下载链接”，再从下载目录用浏览器打开。
- 主分支保持 `d30c042fff4f8bc01324b3d5440ae286463db6e0`；源码在当前工作分支。安卓真机表现及小红书上传入口仍未验证。
- 小红书上传格式仍待用户提供实际入口或文档；现有 H5 候选目录不表示已适配 SDK 或已审核。

<details><summary>上一版交付记录</summary>

# PROJECT STATUS — V0.11 character and compact city repair

- Reference session: `01a16708-2512-71fc-94bc-1e85de06a0a9`.
- Repository `Yangcrazy1/-`, branch `codex/character-city-v011`, baseline commit `2f5a4e6bd2f9d360886771cce7802ab2b02c3040`.
- Current workspace is the baseline. Previous ZIPs have not overwritten any work.
- User confirmed: V0.9 character look, compact populated streets. Latest constraint: smaller map, more variety, fewer empty lots and visible distant scenery. Deliver a single downloadable HTML, no ZIP.
- H5 repair / delivery progress: 100%. Baseline saved in reports/v11/baseline/. Implementation, 89 logic checks, browser smoke, visual checks and acceptance passed. The final 603.97-second cloud endurance and verified HTTPS delivery are complete.
- Baseline: 580 buildings; median approximate nearest facade gaps 3.61 / 3.47 / 3.32 metres by district. At 60 animation Hz, maximum ankle step in place is approximately 9.14 cm walking and 24.22 cm sprinting; this is a discontinuity diagnostic, not a physical foot-slip measurement.
- Suspected regressions: V0.10 leg/body remodelling and hard-gated foot IK; animation advancing faster than physics during slow render frames; sparse frontage placement and missing distant detail.
- Preserve all spherical city, traffic, pedestrian, vehicle, aircraft, mission, combat, radio, save and overview features.
- Environment: cloud Chromium / WebGL via SwiftShader, Node / Python. No physical phone available. Android FPS and local-file opening remain unverified.
- Next: obtain actual Xiaohongshu upload page / official docs and verify the matching format; perform physical handset playtests.

- Product renamed to 侠盗自由城. New user request: additional Xiaohongshu upload version. Actual upload page or platform documents are pending; platform/h5-candidate clearly records this limitation.
- Current compact map: radius 116 m, 52 roads, 352 buildings, 21 pocket places, 3 offshore headlands. Median approximate nearest gaps 1.70 / 1.56 / 1.78 m.
- Browser: no JS / Shader errors, 20 red-stop / green-start trials, 9 control layouts, 3-finger cancellation, offline launch with no network requests. Preview memory stable at 11 geometries / 9 textures after six switches.
- Endurance reruns before the final shader-radius / version metadata correction were interrupted and are not accepted as final evidence. Final run must match the delivered file hash.

- Frozen final HTML: 2,998,319 bytes, SHA-256 `14bdb6cb5b22bd199a9f3c43a0ec00bd57b7aa8a541d3394083347a261bb4cf0`. Independent clean-directory rebuild is byte-identical. All 89 checks and final browser reports match this build.

- Implementation commit: `98389d1`; final evidence / download commit: `19c422eb31220930a349fd4f293ac18ce27b3cd3`.

- Final endurance completed: 603.97 real seconds; no script or Shader errors. Cloud mean FPS walk / car / heli / jet: 1.72 / 4.94 / 5.09 / 6.25. Walking overlapped the short browser checks on shared CPU; this is not comparable to isolated V0.10 or Android performance. Full limitations and P95 / draw / triangle / memory evidence: reports/v11/SUMMARY.md.
- Final-run GPU resource counts ended at 1,572 geometries / 229 textures. Initial-visit caches increased; actual GPU bytes and handset behavior remain unverified.
- Delivery status: mobile HTML and comparison HTML published and retrieved over HTTPS with HTTP 200 / exact bytes. Xiaohongshu upload target is still pending user input.

- Main remains d30c042fff4f8bc01324b3d5440ae286463db6e0. Actual HTTPS proof: ../downloads/outlaw-liberty-city-v0.11-download-verification.json. Both download URL forms return text/plain, so long-press / download link may be required. Physical phone opening remains unverified.

</details>
