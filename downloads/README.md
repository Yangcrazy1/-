# 小星球 · 自由之城 V0.10 清新海湾试玩

使用本仓库独立分支交付，main 保持原样。手机建议先下载 ZIP。

- [下载手机试玩 ZIP（约 1.8 MB）](./pocket-city-v0.10-mobile.zip?raw=true)
- [下载英文单文件 HTML（约 3.0 MB）](./pocket-city-v0.10-mobile.html?raw=true)
- [下载完整可接手源码（约 15.5 MB）](./pocket-city-v0.10-source.zip?raw=true)
- [材质／交通配置](./pocket-city-v0.10-config.json?raw=true)
- [同机位前后对比 HTML](./pocket-city-v0.10-before-after.html?raw=true)
- [测试摘要与实际云端 FPS／P95](../pocket-city/reports/v10/SUMMARY.md)
- [验收清单及已知问题](../pocket-city/ACCEPTANCE_V10.md)
- [SHA-256 校验](./pocket-city-v0.10-checksums.json)

下载 ZIP → 解压 → 用支持本地 HTML/JavaScript/WebGL 的外部浏览器打开 index.html。直接点击 HTML 若只显示代码，可改用 ZIP；聊天软件的文件预览不能代替浏览器运行。ZIP 内还包含前后对比、配置、验收说明和许可。

本轮 81 项逻辑回归、触控／水面／模型／交通浏览器检查通过，602.77 秒云端运行无脚本或 Shader 错误。云端 SwiftShader 平均约 5–7 FPS，不代表安卓 GPU，稳定 30 FPS 目标尚未真机验收；首次漫游 GPU 缓存增长已记录。没有提交平台上传审核。

---

# 小星球 · 自由之城 V0.9 试玩下载

这是独立下载分支，保留原 main 分支。仅为手机 H5 试玩，没有提交小红书平台审核。

- [下载手机试玩 ZIP（约 1.4 MB）](./pocket-city-v0.9-mobile.zip?raw=true)
- [下载单文件 HTML（约 2.9 MB）](./pocket-city-v0.9-mobile.html?raw=true)
- [下载完整开发工程（约 9.1 MB）](./pocket-city-v0.9-source.zip?raw=true)
- [文件校验信息](./pocket-city-v0.9-checksums.json)

手机优先下载 ZIP，解压后用支持本地 HTML、JavaScript 和 WebGL 的浏览器打开 index.html。聊天软件或「文件」预览可能不运行游戏脚本。iPhone 如不能运行本地文件，需要后续按指定目的地部署 HTTPS 试玩页。

包含地图、海湾沙滩、木栈桥、赌场外景、狮身人面像、实际移动的人车、CJ/Tommy 服装修正，保留既有载具、任务和电台。70 项逻辑回归通过；云端 Chromium WebGL 检查了实际运动、原生触摸滑动、模型预览和断网启动。未获得实体手机，不承诺真机帧率或本地文件兼容性。

完整工程中的 reports/v09/ 保留详细测试证据。源工程包含 Three.js MIT、Quaternius CC0 许可与资源出处。
