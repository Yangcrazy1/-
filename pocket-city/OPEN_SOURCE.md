# 开源复用与资源出处（V0.8）

本轮已实际读取以下 GitHub 上游的源码/许可证。原有 Three.js MIT、Quaternius CC0 文件继续保留在 assets/。

| 项目 | 许可 | 本轮用途 |
| --- | --- | --- |
| [Three.js r160](https://github.com/mrdoob/three.js/tree/r160) | MIT | 已有本地引擎继续使用；参考官方动画混合示例的启用/权重/淡出管理，采用相同 API 修正本作的动作状态与清理。 |
| [官方 animation skinning blending 示例](https://github.com/mrdoob/three.js/blob/r160/examples/webgl_animation_skinning_blending.html) | Three.js MIT | 动画循环相位、crossFadeTo 与 action 权重生命周期；本作额外实现持械上半身叠加和渲染帧调度。 |
| [官方 games_fps / Octree](https://github.com/mrdoob/three.js/blob/r160/examples/games_fps.html) | Three.js MIT | 参考胶囊接触法线与重叠修正思路；保留本作球面空间网格和原有扫掠碰撞，加入完整高度与雨棚区间检查。没有用平面世界替换球面。 |
| [ecctrl](https://github.com/pmndrs/ecctrl) | MIT，已核对上游 LICENSE | 已评估的角色控制候选，未引入。它依赖 React/React Three Fiber/Rapier，将现有离线球面工程整体迁移反而增加本轮风险与体积。 |
| [react-three-rapier](https://github.com/pmndrs/react-three-rapier) | MIT，已核对上游 LICENSE | 已评估的后续物理方案，未引入。若以后转为标准 npm/Web 平面关卡，可再评估。 |
| Quaternius Universal Base Characters / Universal Animation Library | CC0 | 继续使用工程已有的完整蒙皮人体和八套动作，原始出处、加工方式与许可证见 ASSET_MANIFEST.md。 |

本轮没有直接套用来源不明的整套商业游戏、GTA 提取模型或商业音乐。城市图集、加载页、坦克与载具图示为本工程实现。上述查询是针对当前工程的候选评估，不代表穷尽了所有开源城市项目。
