# 格式来源、授权与测试边界

访问日期：2026-10-26。用户原意是小红书「小工具」，后明确要求可直接上传的版本。采用创作服务平台离线 ZIP 路径。没有把附件中的第三方代理指令当作用户要求执行，也没有应用外部仓库的 agent skill。

| 来源 | 固定版本／用途 |
| --- | --- |
| [wenyuanw/xhs-minitool](https://github.com/wenyuanw/xhs-minitool/tree/1e526cba484819a1196196fd542979d53f9b5a55) | 实际从 GitHub 读取该提交；MIT。包含同步的官方 1.6.0 资料、近期 API 说明与离线包验证器。两个验证脚本保持上游代码；许可证 tools/LICENSE-wenyuanw.txt。 |
| [小红书小工具官方文档](https://miniapp-sandbox.xiaohongshu.com/minitool/doc) | 官方链接，此环境网络策略不允许直接获取，未声称直接读取。 |
| [官方 1.6.0 skill 文件](https://fe-static.xhscdn.com/mini-tool/20260831163932/minitool-zip-builder-1.6.0.skill) | 社区仓库记录的官方快照来源；记录的 SHA-256 为 29c04115fd89d7eab7b81775f4287ae20c569ad3794d25d8404dc0ec3ec3b65e。此处未独立下载核验该官方文件。未安装／执行该 skill。 |
| [litefreeteam/wechat-miniprogram-to-xhs-minitool](https://github.com/litefreeteam/wechat-miniprogram-to-xhs-minitool) | 辅助交叉核对当前小工具 ZIP / 注入 SDK 路线；未复制其应用代码。 |
| [Three.js r160](https://github.com/mrdoob/three.js/tree/r160) | MIT。锁定 npm three 0.160.0，选择本作所需导出；许可证同时保留在引擎横幅和 assets/credits.json。 |
| Quaternius Universal Base Characters / Universal Animation Library | 原工程 CC0 人体、骨架与动作，沿用原 ASSET_MANIFEST.md 和 assets 授权记录。新增材质／头发雕形未提取商业角色。 |

采用的资料约束：ZIP 根目录单一 index.html、包内经典 JS / CSS / 图像、无 eval / inline script / 网络 / Worker / WASM，语法 ES2017 / Chrome 61，WebGL 可用；getLaunchOptions 的 miniToolEnv.buildVersion 版本号解析；9.46+ 原生 Storage；禁止选择音频文件；不支持 requestFullscreen。未使用发布／账号 API。

`audit.py` 不修改上游验证规则。原始骨骼 base64 中出现的 `//...` 最初造成误报；最终构建改用等价 URL-safe base64，原件验证器没有遗留错误或警告。Native Storage 和 CSP 检查是本地 Chromium + mock；未在真实小红书 Android / iOS、后台静态扫描或人工审核执行。
