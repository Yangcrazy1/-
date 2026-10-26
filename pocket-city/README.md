# 侠盗自由城 V0.13

紧凑海岛三城、橙蓝建筑和白窗框；连续肩部网格与 Tommy 头脸／后梳发型重制。保留全部既有玩法与存档。

- [本轮说明、手机打开与源码配置](README_V13.md)
- [验收证据与已知问题](ACCEPTANCE_V13.md)
- [实际分支、提交与最终交付状态](PROJECT_STATUS.md)
- [小红书小工具 ZIP 构建与上传说明](platform/xhs-minitool/README.md)
- [格式资料的精确来源与授权](platform/xhs-minitool/SOURCES.md)

手机试玩是单独的英文文件名 HTML，无需解压；小红书另有离线 ZIP，用于创作服务平台「小工具」入口。所有下载已实际通过 GitHub / raw HTTPS 获取并逐字节核验，记录在项目状态中。没有上传、真实小红书客户端或平台审核的通过声明。

源码 `src-v13/` 与既有兼容钩子，水面／交通配置 `src-v10/config.json`，地图与密度 `src-v11/config.json`。运行 `npm run build`、`npm run check`、`npm test`（98 项）；浏览器与持续运行脚本在 `scripts-v13/`，报告在 `reports/v13/`；平台适配及测试在 `platform/xhs-minitool/`。真实安卓的 30 FPS 目标仍需设备验收。

V0.7–V0.12 的文档、许可证、旧下载和报告保留作为历史，不代表当前包的验收。

[手机单 HTML（3.04 MB）](https://github.com/Yangcrazy1/-/raw/ebe574cd667955dc1a62c2402b4edde578fdb2d8/downloads/outlaw-liberty-city-v0.13-mobile.html) · [小红书小工具上传 ZIP（1.40 MB）](https://github.com/Yangcrazy1/-/raw/ebe574cd667955dc1a62c2402b4edde578fdb2d8/downloads/outlaw-liberty-city-v0.13-xhs-minitool.zip) · [人物与街区实拍对比](https://github.com/Yangcrazy1/-/raw/ebe574cd667955dc1a62c2402b4edde578fdb2d8/downloads/outlaw-liberty-city-v0.13-review.html)

手机长按 HTML 链接下载后，用支持 JavaScript / WebGL 的浏览器打开；小红书 ZIP 无需解压，去创作服务平台 → 小工具原样上传。
