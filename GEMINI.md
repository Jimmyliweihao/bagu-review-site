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
- 交互卡片（`.topic-card`）与悬浮透镜（`.module-nav-lens`）必须采用高透水感毛玻璃：
  ```css
  background: rgba(255, 255, 255, 0.48 ~ 0.52);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  backdrop-filter: blur(20px) saturate(180%);
  ```
- 饱和度增幅必须维持在 `180%`，以还原穿透极光光球时的鲜活折射质感。

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

### 10. 电影级环境光融解与零瞬断规则 (Cinematic Ambient Cross-Fade Rule)
- 模式切换（极光 $\leftrightarrow$ 晨曦 $\leftrightarrow$ 暗夜）严禁视觉硬切、频闪与眩晕；
- **禁止滤镜补间与光斑猝死**：严禁在暗夜模式对 `.backdrop-mesh` 设置 `display: none !important`，严禁动态补间 `filter: blur(...)`（防止 GPU 重绘阶跃导致闪烁），光球必须维持固定滤镜并通过纯硬件级 `opacity` 在 `0.85s cubic-bezier(0.4, 0, 0.2, 1)` 内平滑淡隐；
- **零下陷双向底色混合**：背景底色渐变必须拆分为独立图层由 GPU `opacity 0.85s` 进行混合交叠，底座背景色必须随氛围同步过渡，杜绝中间帧透底露黑导致的“亮度下陷抽搐（Luminance Dip）”；
- **视网膜同构阴影对齐**：浅色与暗色模式的 `box-shadow` 投影层数必须严格一对一对齐，杜绝因层数不匹配引发的阴影突跳；
- **全局 0.85s 缓入缓出调光**：全站卡片、外框、边框与文字严禁使用前段暴冲的 Spring 曲线，统一配置 **0.85s + `cubic-bezier(0.4, 0, 0.2, 1)`** 影院级平滑 S 曲线，给瞳孔充分适应时间。

