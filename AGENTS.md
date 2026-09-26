# AI Agent 行为准则与项目设计规则 (Agent Guidelines & Design Rules)

本项目为 **八股复习站 (bagu-review-pages)**，采用 **Apple Liquid Glass (WWDC / macOS Tahoe / visionOS) 空间计算设计系统**。
所有在此项目中进行前端开发、UI 调整、样式重构或新功能扩展的 AI 助手与工程师，**必须严格遵守以下设计与工程规则**。

详细设计规范请参阅完整文档：[DESIGN_SYSTEM.md](file:///Users/liweihao/Documents/Codex/2026-09-23/sites-plugin-sites-openai-curated-remote/work/bagu-review-pages/DESIGN_SYSTEM.md)。

---

## 🚨 核心强制约束 (Hard Constraints)

### 1. 容器与底座底色规则 (Chassis Opacity Rule)
- **严禁给外层容器底座（如 `.module-sidebar`, `.main-panel`, `.topic-grid`）设置不透明或半透明的磨砂白底**；
- 容器必须维持 `background: transparent; -webkit-backdrop-filter: none; backdrop-filter: none;`；
- 背景极光（Aurora Mesh）必须在整个页面中无遮挡流动，不可在容器外壳上增加任何全尺寸白光蒙层。

### 2. 边框光学统一规则 (Dual-Specular Bezel Rule)
- 严禁在浅色模式下对玻璃组件使用单薄的纯白描边（`rgba(255, 255, 255, 0.4~0.6)` 会在浅色背景下直接隐形泛虚）；
- 所有玻璃组件（外框、卡片、浮动胶囊）的边框必须遵循 **Apple 视网膜双微晶边框**：
  ```css
  /* 外层环境微暗描边（抗白背景吞噬） */
  border: 1px solid rgba(60, 60, 67, 0.12 ~ 0.14);
  /* 顶端纯白晶体高光 + 内壁光泽反弹 */
  box-shadow:
    0 10px 24px -4px rgba(20, 25, 45, 0.08),
    0 2px 6px -1px rgba(20, 25, 45, 0.03),
    inset 0 1.5px 0 rgba(255, 255, 255, 0.95),
    inset 0 0 0 1px rgba(255, 255, 255, 0.35);
  ```
- 暗夜模式 (`body[data-atmosphere="obsidian"]`) 下统一转为 `border: 1px solid rgba(255, 255, 255, 0.14~0.16)`。

### 3. 毛玻璃与折射率规则 (Backdrop Filter Rule)
- 交互卡片（`.topic-card`）与弹窗必须采用高透水感毛玻璃（维持 `180%` 饱和度折射）：
  ```css
  background: rgba(255, 255, 255, 0.48 ~ 0.52);
  -webkit-backdrop-filter: blur(14px) saturate(180%);
  backdrop-filter: blur(14px) saturate(180%);
  ```
- 悬浮高速物理透镜（`.module-nav-lens`）采用 Apple Native Pro 视网膜双微晶水感层（`background: rgba(255, 255, 255, 0.65); backdrop-filter: none;`），彻底卸载高速移动时的实时重采样卷积负担，实现物理级 120Hz 零延迟响应并保障字迹印刷级锐利。

### 4. Apple R 角阶梯与同心圆角法则 (Concentric Radius Formula)
- 任何组件必须严格使用标准阶梯 Token，禁止硬编码孤立数值：
  - 岛屿外壳：`var(--radius-island)` (`22px`)；
  - 独立卡片：`var(--radius-card)` (`18px`)；
  - 列表透镜：`var(--radius-item)` (`14px`)；
  - 控件按钮：`var(--radius-control)` (`12px`)；
  - 徽标图标：`var(--radius-badge)` (`9px`)；
  - 连续胶囊：`var(--radius-pill)` (`999px`)。
- 任何嵌套组件必须满足数学同心圆角关系：
  $$\text{Radius}_{\text{inner}} = \text{Radius}_{\text{outer}} - \text{Padding}$$
- 例如外壳为 `var(--radius-island)` (22px)，内边距为 8px，则内层项目与滑块必须严格使用 `var(--radius-item)` (14px)。

### 5. 交互跟手与性能规则 (Interaction & 60 FPS Rule)
- 纵向/横向导航条目交互，必须采用**单个物理透镜（Single Lens）的磁吸连续滑动**（通过 `requestAnimationFrame` 驱动 `transform: translateY(...)`），严禁给每个 item 各自绑定延迟 hover 动效；
- **几何最近邻投影吸附（Nearest Centroid Projection）**：必须基于垂直中心点欧氏距离计算最近目标项，严禁粗暴二分或缺省直接瞬移到首尾项；
- **排版绝对静止准则（Typographic Stillness Rule）**：目录悬浮时严禁文本出现横向 `translateX` 抖动或字重拉扯，视线基准线必须绝对稳固，交互反馈纯粹由水感透镜与字色微光承担；
- **项内微磁吸浮动（Micro-Parallax Follower）**：透镜在当前项内部叠加 $\pm 2\text{px}$ 弹性随动，聚光灯反光严格锚定透镜即时视口包围盒；
- 动效曲线必须使用 Apple 标准阻尼 `var(--apple-spring)` (`cubic-bezier(0.16, 1, 0.3, 1)`)；
- 指针聚光灯反光坐标计算必须挂载在容器代理上，并使用 `requestAnimationFrame` 防抖节流。

### 6. 多氛围模式同步 (Tri-Atmosphere Support)
任何新增 UI 元素，必须在 `aurora`（极光，默认）、`daylight`（晨曦）和 `obsidian`（暗夜琉璃）三种模式下完成显色校验与暗夜样式配置。

### 7. 等距内边距与零偏心定律 (Isotropic Padding & Zero-Eccentricity Rule)
- 同心圆角公式 $R_{\text{inner}} = R_{\text{outer}} - \text{Padding}$ 生效的绝对前提是**横向与纵向内边距严格等距**（$\text{Padding}_x = \text{Padding}_y$）；
- 严禁在容器转角处设置非对称留白（如左侧 20px、上下 10px），否则内外圆心错位会在 $45^\circ$ 转角处产生挤压变形；转角处子元素必须维持三向距离绝对相等。

### 8. 反套娃与触点聚焦原则 (Anti-Nesting & Focal Affordance Rule)
- **严禁多层圆角套娃**：严禁在已有圆角的外层容器边缘，为复合实体（如“Logo+文本”）额外包裹一层次级悬浮圆角矩形，坚决杜绝“外壳 $\rightarrow$ 悬浮框 $\rightarrow$ 徽标”三层曲率打架；
- **触点聚焦**：悬浮/点击动效必须收敛于功能性超椭圆徽标（`.brand-mark`）本身，文字保持纯净排版；
- **视觉降噪**：严禁在品牌区硬塞“`< 收起`”等非标药丸标签，状态指示必须通过原生 Tooltip、无障碍属性与图标微动效克制表达。

### 9. 视网膜水感分段滑块规则 (Liquid Glass Slider Rule)
- 分段控制器（`.track-switch`, `.atmosphere-switch`）物理滑块严禁使用 $\ge 90\%$ 不透明度的实心乳白塑料块；
- 必须维持 `rgba(255, 255, 255, 0.72 ~ 0.78)` 水感半透基底 + `blur(16px) saturate(180%)` + 顶端 1px 晶体高光切边（`inset 0 1px 0.5px #fff`），暗夜模式同步转为 `rgba(255, 255, 255, 0.16)` 深熏黑琉璃。

### 10. 电影级环境水墨弥漫与零瞬断规则 (Cinematic Ambient Mist Permeation Rule)
- 模式切换（极光 $\leftrightarrow$ 晨曦 $\leftrightarrow$ 暗夜）严禁视觉硬切、频闪、眩晕、边界硬边与任何急促感；
- **点光源全局水墨弥漫体系 (Organic Mist Diffusion Engine)**：模式切换严禁任何可识别的几何边框或实心色盘；以所点击按钮的物理坐标 $(x, y)$ 为真实点光源，向四周展开纯正圆柔和水雾光幕（`.backdrop-mist`，核心叠加 `filter: blur(80px)` 与低对比度半透光谱），以 **1.75s `cubic-bezier(0.12, 1, 0.28, 1)`** 超长柔和阻尼曲线徐徐向外漫散充盈全屏，与底层 1.75s 影院级曲线无缝交叠，带来“天光从按钮舒缓漫入、薄雾轻抚全屏”的沉浸沐浴感；
- **零强制回流（Zero Forced Reflow）**：严禁在点击处理中执行 `void element.offsetWidth` 等触发同步样式重排的操作；微动效统一采用硬件级 Web Animations API (`element.animate`) 驱动，实现 100% 满帧硬件合成；
- **真实色谱对齐与零颜色突变**：光雾材质严格维持低饱和半透明雾气（峰值浓度 $\le 65\%$），中心向外呈二次方连续衰减，极光使用北欧纯净天光浅调（`rgba(240, 246, 255)` / `rgba(224, 242, 254)`），晨曦使用日光白雾，暗夜使用深熏夜幕水墨，严禁注入高饱和度伪色；
- **禁止滤镜补间与光斑猝死**：严禁在暗夜模式对 `.backdrop-mesh` 设置 `display: none !important`，光球维持硬件级 `opacity` 平滑淡隐；
- **零下陷双向底色混合**：背景底色渐变拆分为独立图层由 GPU `opacity 1.75s` 混合交叠，底座背景色随氛围同步过渡，杜绝中间帧透底露黑导致的“亮度下陷抽搐（Luminance Dip）”；
- **视网膜同构阴影对齐**：浅色与暗色模式的 `box-shadow` 投影层数严格一对一对齐，杜绝因层数不匹配引发的阴影突跳。

