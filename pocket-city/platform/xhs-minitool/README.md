# 侠盗自由城 — 小红书小工具离线 ZIP

本目录是 V0.13 当前工程的派生构建，不覆盖手机单 HTML。目标入口：小红书创作服务平台 → 小工具，`https://creator.xiaohongshu.com/new/red-app`。上传 `outlaw-liberty-city-v0.13-xhs-minitool.zip`，ZIP 根为 `index.html` 和 `assets/`，不要再套一层文件夹。

未登录用户账号、上传或提交审核。官方文档域名在此环境网络策略之外，因此使用公开 GitHub 中同步的官方 1.6.0 文档／近期 API 资料，并记录来源。实际后台若要求不同格式，需按其错误信息进一步适配；本包不是原生小游戏 `game.json` 工程。

## 构建

在本目录执行：

```bash
npm ci --ignore-scripts --cache /tmp/liberty-xhs-npm-cache
python3 build.py
node check.cjs
python3 audit.py
python3 browser.py
python3 endurance.py
python3 package.py
```

`build.py` 固定待交付 HTML 的 SHA，防止旧包覆盖最新修复。新游戏变更后先完成主工程回归，再更新固定 SHA 并重做平台验证。引擎依赖锁定 Three.js r160，构建工具 esbuild 0.25.5、Acorn 8.15.0；无运行时 npm / CDN 下载。

## 适配范围

- 经典外部脚本，无内联 JS / 事件属性、eval、new Function、模块、联网、Worker、WASM。
- 抽取内嵌图片到包内；骨骼二进制用 URL-safe base64 表示，解码后字节一致，避免把原始 `//...` 误识别为外链，未豁免网络规则。
- 树摇去除未使用网络加载器；禁用本游戏未使用的 WebXR；保留 WebGL、软件渲染回退和 MIT 许可。
- ES2017 / Chrome 61 语法检查；提供本工程用到的 fromEntries / flat / flatMap 与 CSS 布局回退。未在真实 Chrome 61 或 iOS JSCore 执行。
- 检测注入的 `window.xhs.miniTool`。9.46+ Storage 原生读取；未确认读取成功时不会写入默认档。无 SDK / 旧版 / 未知版本退回受保护的浏览器存档，浏览器存储被禁时可临时玩并提示未保存。
- 只操作原 `pocket-city-v4` 存档，字段兼容；异步写入串行合并、最新值优先。读写超时／损坏／容量错误明确反馈。
- 保留六套合成电台；平台音频选择限制使歌曲导入不可用；手机单 HTML 仍可导入。全屏按钮改为旋转提示。
- 默认流畅档，DPR 1，用户可按设备调整。没有真机 30 FPS 达标证明。
- 没有分享发布／登录／联网收集用户数据。SDK 由平台注入，无打包账号密钥或虚构 AppID。

静态验证使用 MIT 上游脚本原件；本地 CSP 比普通网页严格，禁止 inline script / unsafe-eval / connect / worker / frame / object。浏览器测试先运行实际生产包，再用单独路由的 QA 脚本验证交通、布局和触控。QA 接口不进入交付文件。Storage 使用本地 SDK mock，不能代表真实平台。

完整来源见 SOURCES.md；验证报告位于 `../../reports/xhs-v013/`，ZIP 的长度、CRC、SHA 与重建结果由 package.py 生成。
