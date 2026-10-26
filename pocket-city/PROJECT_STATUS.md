# PROJECT STATUS — V0.13 海岛街区 / 肩部与 Tommy 重制 / 小红书适配

- 仓库 `Yangcrazy1/-`，当前分支 `codex/island-characters-v013`，源码提交 `f6e9ef6433714aa8a1c10f35b631a014aa8b5c8e`，工程基线 `c27720a`（V0.12）。现有工作区含本轮小红书适配修改，继续保留；不从旧 ZIP 覆盖。
- 新参考：用户 `1000117039.jpg`，MINIPOLY 风格海岛建筑、鲜明橙蓝立面、白窗框、蓝屋顶、青蓝海水与金色沙岸。以原创程序化资源重建风格，不提取商业资源。
- 新约束：人物肩膀出现破面，重做连续肩部网格；改善 Tommy 的头脸、发际线和后梳发型。沿用三位身份、同一动作骨架和全部既有玩法。
- 同时完成小红书小工具上传包；已找到 creator.xiaohongshu.com/new/red-app 的离线 ZIP 格式，需外置经典脚本、无 eval / 无联网、ES2017 / Chrome 61、原生 Storage 9.46+。格式参考来自公开同步的官方 1.6.0 资料，具体版本及来源将记录在平台目录。
- 当前进度 98%：实现冻结；98 项逻辑回归通过；三角色 8 套动作肩部接缝间距测得 0，7,601 顶点 / 11,802 三角形；Tommy 头脸／后梳发、CJ 悬浮纹身片已重做／清理。
- 软件回退实际测试：主动禁用全部 WebGL 后仍可启动，皮肤／上衣／裤子材质正确分开，无脚本错误；Shader 缺失时不会把身体全部染成衣色。
- 最终手机 HTML：3,035,963 字节，SHA-256 `b35f30af3372f901b3e8590d073f968e0a4fa5cd7663fdbaaebc3fec636a5adf`。同镜头实拍与断网启动、横竖屏／滑动／三城景点 smoke 已通过，浏览器无脚本错误。
- 平台版：12 文件 / 2,512,311 未压缩字节；4 外部经典脚本 ES2017，12 存档桥接检查；上游静态验证器零错误、零警告、零豁免。骨骼 buffer 使用等价 URL-safe base64，避免外链误报。CSS 回退已修复，九组布局此前通过；最终 SHA 完整验收通过；手机 HTML 已完成 604.62 秒持续运行，小红书 ZIP 已完成 604.72 秒独立持续运行。两包均无脚本／Shader 错误；平台版零 CSP 违规与外部请求。
- 持续运行统计：手机各模式平均 2.47 / 3.10 / 2.73 / 3.35 FPS，平台 2.74 / 3.24 / 2.87 / 3.34 FPS，均为云端 SwiftShader。不能作为安卓达标或两个包性能对比。访问新区域有缓存增长，详见 reports/v13/SUMMARY.md 和两份 endurance.json；未证明无限长运行资源完全收敛。
- 测试边界：Linux Chromium / WebGL / SwiftShader，原生 SDK 为本地 mock；没有实体安卓、小红书 iOS / Android 容器与后台账号。未上传、未审核，不把模拟测试作为平台通过证明。
- 交付文件：手机 `outlaw-liberty-city-v0.13-mobile.html` 3,035,963 字节；小红书 `outlaw-liberty-city-v0.13-xhs-minitool.zip` 1,403,005 字节，SHA-256 `5f5aec322f81b8b0f03acd9d68f1598658d343389cfef493bfb284f305032161`。独立／二次重建逐字节一致；ZIP CRC 和上游归档体积检查通过（12 文件、零警告）。
- 手机下载已在提交 `90182f3afb23a8c7968df96c849cf5cb3af5d3c9` 发布并实际取回验证；下一步发布最终 ZIP 并完成全部 HTTPS 字节核验。

<details><summary>V0.12 交付历史</summary>

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

</details>
