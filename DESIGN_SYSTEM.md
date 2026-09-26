# Apple Liquid Glass 空间设计规范 (Design System Specification)

本项目采用 **Apple Liquid Glass (WWDC / macOS Tahoe / visionOS) 空间计算设计语言**。为了保证后续功能迭代与界面开发在视觉、手感、材质与物理交互上保持绝对的一致性，特制定本设计规范。

---

## 一、 核心设计哲学 (Core Design Philosophy)

1. **物理法则一致性 (Physical Coherence)**
   视窗内所有玻璃组件均模拟**同一光源照射下的同一批次高折射光学晶体**。禁止在局部出现“单层粗糙白线”与“精密切割微晶边缘”混杂的拼凑感。

2. **零阻断通透性 (Zero Milky Opacity)**
   底座容器（Chassis）彻底透明，直接将背景的多彩极光壁纸穿透至用户眼前。**严禁在容器外壳上叠加不透明/半透明磨砂白板**，避免出现双重叠加导致的“死白/白雾阻断”。

3. **同构不同形 (Harmonious Differentiation)**
   页面内不同模块根据其功能承载（密度、操作形式）拥有不同的交互形态，但其**材质厚度、边缘折射、受光反光、同心圆角逻辑必须 100% 成套统合**：
   - 导航模块（高信息密度）：采用**单物理层磁吸流体滑轨透镜**，轻盈跟手；
   - 内容模块（操作决策）：采用**独立浮动矩阵卡片**，微浮空并带有独立的聚光回弹。

---

## 二、 材质与光学层级模型 (Two-Tier Hierarchy Model)

全站界面严格划分为两个层级，任何新增模块均须明确归属于下列之一：

### 1. 容器底座层 (Chassis Layer)
* **适用对象**：`.module-sidebar`（侧边栏外壳）、`.main-panel`（主内容画布）、`.topic-grid`（网格底座）。
* **物理规则**：
  ```css
  background: transparent;
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  ```
* **约束**：绝对禁止添加任何全局模糊滤镜或大面积白雾放射光（如 `::after` 白光蒙层），保证背景极光 100% 畅通透出。

### 2. 交互透镜与实体卡片层 (Interactive Lens / Card Layer)
* **适用对象**：`.module-nav-lens`（导航悬浮透镜）、`.module-link.active`（激活指示条）、`.topic-card`（复习卡片）。
* **物理规则**：
  - **基础静置态**：`background: rgba(255, 255, 255, 0.32);`
  - **悬浮高亮态**：`background: rgba(255, 255, 255, 0.48 ~ 0.52);`
  - **光学折射核**：强制使用 `backdrop-filter: blur(20px) saturate(180%);`（通过 1.8x 饱和度增幅，使背后的极光折射更加饱满绚丽）。
  - **动态聚光灯**：必须绑定 pointer 实时坐标，通过 `::after` 渲染 200px~260px 的径向聚光反光 (`radial-gradient`)。

---

## 三、 视网膜双微晶边框标准 (Prismatic Specular Bezel Standard)

在浅色高亮背景（高光白/浅青/晨曦蓝）下，纯白描边（`rgba(255, 255, 255, ...)`）会因为与背景缺乏明度阶差而“隐形泛虚”。全站统一采用 **Apple 视网膜双微晶边框** 规范：

### 1. 浅色模式规范公式 (Light / Aurora Mode)
```css
/* 1. 外缘深色菲涅尔发丝线（解决边缘看不清问题，提供清晰的物理切割边界） */
border: 1px solid rgba(60, 60, 67, 0.12 ~ 0.14);

/* 2. 复合立体边缘光效 */
box-shadow:
  0 10px 24px -4px rgba(20, 25, 45, 0.08),       /* 柔和落地投影 */
  0 2px 6px -1px rgba(20, 25, 45, 0.03),         /* 近景物理遮挡 */
  inset 0 1.5px 0.5px rgba(255, 255, 255, 0.95), /* 顶端迎光面 100% 纯白晶体高光 */
  inset 0 0 0 1px rgba(255, 255, 255, 0.35);     /* 内缘微棱镜反光 */
```

### 2. 暗夜模式规范公式 (Obsidian Glass Mode)
```css
body[data-atmosphere="obsidian"] .your-component {
  border: 1px solid rgba(255, 255, 255, 0.14 ~ 0.16);
  /* 严格同构的 4 层投影结构，确保明暗切换时数学插值平滑 */
  box-shadow:
    0 14px 38px -4px rgba(0, 0, 0, 0.85),       /* 深邃环境接地阴影 */
    0 2px 8px rgba(0, 0, 0, 0.5),                /* 近景物理遮挡 */
    inset 0 1.5px 0 rgba(255, 255, 255, 0.22),   /* 顶端琉璃高光切边 */
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);   /* 内缘抗吞噬微暗反射 */
}
```

### 3. 视网膜同构阴影铁律 (Shadow Isomorphism Law)
在 CSS 中，**多重阴影补间的绝对前提是浅色与暗色模式的投影层数完全一致**：
- **严禁层数不对齐**：若浅色模式定义了 4 层阴影（含 2 个 inset），而暗色模式仅定义 2 层阴影，CSS 引擎无法进行向量插值，会在切换瞬间发生阴影撕裂与跳闪（Shadow Flicker）；
- **对齐法则**：任何组件的 `box-shadow` 在浅色与暗色模式下的逗号数量、inset 类型必须 1:1 严格对齐，仅补间颜色透明度与轻微偏移量。

---

## 四、 Apple R角美学与几何阶梯规范 (Apple Corner Radius & Concentric Geometry)

Apple 的 R 角美学由**「超椭圆平滑曲率 (Squircle)」**、**「严格数学同心圆角 (Concentric Radii)」** 与 **「离散阶梯体系 (Hierarchy Scale)」** 组成。禁止在项目中随意硬编码孤立的 R 角数值。

### 1. 全局 Apple R 角阶梯 Token (HIG Hierarchy Tokens)
全站统一定义并调用以下标准 CSS 变量：

| CSS 变量 Token | 像素值 | 适用层级与典型组件 | 视觉重量与设计意图 |
| :--- | :--- | :--- | :--- |
| `--radius-island` | `22px` | 浮动胶囊岛屿外壳 (`.header-inner`, `.module-sidebar`) | 宏观容器边界，平滑包容 |
| `--radius-card` | `18px` | 独立内容卡片与承托槽 (`.topic-card`, `.empty-state`) | 核心承托实体，沉稳利落 |
| `--radius-item` | `14px` | 列表交互条目与磁吸滑轨透镜 (`.module-link`, `.module-nav-lens`) | 高频点击项，轻盈精准 |
| `--radius-control`| `12px` | 中型交互控件与品牌外框 (`.brand:hover`, 独立次级按钮) | 按钮形态，适度收敛 |
| `--radius-badge` | `9px` | 微型视觉徽标与图标外壳 (`.brand-mark`, SF `.topic-icon`) | 视网膜级微感知图标 |
| `--radius-pill` | `999px`| 终极连续流体胶囊 (`.track-switch`, `.track-lens`, `.overview-count`) | 终极柔和无死角圆滑 |

### 2. 同心圆角几何法则 (Concentric Geometry Law)
嵌套组件的圆角半径必须保持严格的数学同心性，以确保在圆角转折路径上的“空气间隙 (Air Gap)”在物理视觉上绝对恒定：

$$\text{Radius}_{\text{inner}} = \text{Radius}_{\text{outer}} - \text{Padding}$$

* **公式验证实例**：
  - 侧边栏外壳 `.module-sidebar`：外径 $R_{\text{outer}} = \text{var(--radius-island)} = 22\text{px}$，内边距 $\text{Padding} = 8\text{px}$；
  - 内部条目与透镜 `.module-nav-lens` / `.module-link`：内径 $R_{\text{inner}} = 22 - 8 = 14\text{px} = \text{var(--radius-item)}$；
  - 差值恒等于内边距（8px），从直边到圆弧的视觉间隙浑然一体，消除压迫或转角夹肉感。

### 3. 等距内边距定理与零偏心定律 (Isotropic Padding & Zero-Eccentricity Law)
同心圆角法则生效的**绝对数学前提**是：转角处的横向内边距与纵向内边距必须**严格等距（$\text{Padding}_x = \text{Padding}_y$）**：
- **严禁非等距内边距（Anisotropic Padding）**：若容器左侧留白为 20px，上下留白为 10px，内外圆弧的圆心将发生偏心位移（Eccentricity），导致在 $45^\circ$ 转角处缝隙被剧烈挤压，形成失真的“月牙形非等宽走线”；
- **顶栏实测校准**：`.header-inner` 高度为 64px，内部 32px 徽标垂直留白为 $(64 - 32)/2 = 16\text{px}$。因此左侧与右侧内边距**必须严格等距设定为 16px**（而非 20px），确保上、下、左三向距离绝对相等，图标与外壳圆弧完美同心。

### 4. 反套娃与触点聚焦原则 (Anti-Nesting & Focal Affordance Rule)
- **严禁多层圆角套娃（Capsule Inception）**：严禁在带圆角的外层容器边缘，仅为了悬浮反馈再强行包裹一层包含“图标+文字”的次级圆角矩形（防止形成外壳 22px $\rightarrow$ 灰框 14px $\rightarrow$ 图标 9px 的三层曲率打架与视觉拥挤）；
- **触点聚焦（Focal Touchpoint）**：工具栏/导航栏的品牌文字必须保持纯净的 Typography 呼吸展示。悬浮与点击反馈应精准收敛于功能性超椭圆徽标（`.brand-mark`）本身（$1.04\times$ 弹性微缩放 + 微晶切边反光），严禁给整段文字强加背景贴片；
- **视觉降噪与去药丸标签（Toolbar Quiet Dignity）**：严禁在品牌 Logo 旁硬塞“`< 收起`”这类非标准的促销式/管理后台式药丸标签；折叠意图应通过系统原生 Tooltip (`title`)、无障碍属性 (`aria-expanded`) 与图标形态呼吸表达，坚守 Apple 产品的克制与留白。

### 5. 视网膜水感分段滑块规范 (Liquid Glass Slider Formula)
分段控制器（`.track-switch`）与模式切换器（`.atmosphere-switch`）的物理透镜滑块（`.track-lens`, `.atmo-lens`）**严禁使用 $\ge 90\%$ 不透明度的实心乳白塑料块**：
- **水感半透基底**：必须采用 `rgba(255, 255, 255, 0.72 ~ 0.78)`（暗夜：`rgba(255, 255, 255, 0.16)`），确保底层极光彩色光球能自然漫透；
- **180% 鲜活折射率**：维持 `-webkit-backdrop-filter: blur(16px) saturate(180%); backdrop-filter: blur(16px) saturate(180%);`；
- **双微晶高光切边**：顶部配置纯白物理高光切边 `inset 0 1px 0.5px rgba(255, 255, 255, 1)`，四周环绕微暗抗吞噬描边 `border: 0.5px solid rgba(60, 60, 67, 0.08)`。

### 6. 超椭圆徽标比例 (Squircle Ratio for Badges)
对于 32px~36px 的微型功能图标（如 32px 的 `.brand-mark` 和 34px 的 `.topic-icon`），其 R 角与尺寸的比值必须维持在 **1 : 3.75 ~ 1 : 3.8**（例如 $34 / 9 \approx 3.77$），精确对应 iOS App 图标的标准超椭圆收弧比例。

---

## 五、 动效手感与双时序物理准则 (Fluid Physics & Dual-Timing Framework)

全站动效严格解耦为两套互不干扰的物理时序模型：

### 1. 交互动效时序 (Interactive Micro-Physics)
- **快速回弹**：`var(--apple-spring)` $\rightarrow$ `cubic-bezier(0.16, 1, 0.3, 1)`（持续时间 130ms~180ms），专用于鼠标悬浮、点击释放、滑块到位；
- **点击微压**：`var(--apple-press)` $\rightarrow$ `cubic-bezier(0.2, 0.8, 0.2, 1)`（持续时间 80ms，`scale(0.985)`）。

### 2. 电影级环境光融解时序 (Cinematic Ambient Dissolve)
- **平缓调光曲线**：`var(--ambient-fade-timing)` $\rightarrow$ `cubic-bezier(0.4, 0, 0.2, 1)`；
- **黄金适应时长**：`var(--ambient-fade-duration)` $\rightarrow$ `0.85s`（文字色阶过渡：`--ambient-text-duration: 0.65s`）；
- **严禁滥用 Spring 曲线**：严禁在全屏明暗切换、渐变透明度、大面积卡片底色上使用陡降型弹簧曲线（防止前 100ms 暴降 70% 亮度引发视觉闪烁与人眼眩晕）。

### 3. 磁吸流体滑轨机制
- 对于纵向或横向连续列表（如目录、Tab），**严禁在每个子项上使用独立的鼠标移入动画**（会产生迟滞与重影）；
- **必须使用单个物理透镜 DOM 节点**在容器内通过 `transform: translateY(...)` 动态平滑吸附到目标项。

### 4. 60 FPS 渲染防掉帧
- 涉及跟随光标的高频样式更新（如 `--lens-mouse-x`、`--card-mouse-x`），**必须通过 `requestAnimationFrame` 进行节流批处理**；
- 动效属性仅限于 `transform` 与 `opacity`，开启 `will-change: transform`。

---

## 六、 氛围模式适配与电影级环境光融解 (Atmosphere Modes & Ambient Cross-Fade)

系统必须支持三种标准氛围模式无缝切换：
1. **极光流体 (Aurora - 默认)**：五重彩色光球（青、天蓝、紫罗兰、浅粉、薄荷绿）弥散游走，高折射高饱和度；
2. **晨曦天光 (Daylight)**：极简轻羽白色漫射光，饱和度略降，追求纸质与清晨天光的宁静感；
3. **暗夜琉璃 (Obsidian)**：深沉夜幕，底色纯黑（`#000000` / `#111114`），半透黑烟熏琉璃，深邃 OLED 质感。

### 🚨 核心准则：电影级环境光融解架构 (Cinematic Ambient Cross-Fade)
浅色与暗色模式的切换严禁生硬跳变与闪烁晕眩，必须遵循 Apple 电影级环境光衰减与调光体系：
1. **消灭渲染断点与滤镜闪变（禁止 `display: none` 与动态 `filter` 补间）**：
   - 严禁在暗夜模式下对 `.backdrop-mesh` 设置 `display: none !important`；
   - **禁止动态过渡高斯模糊滤镜**（`filter: blur(...)` 逐帧重绘会引发 GPU 采样阶跃与频闪）；极光光球维持固定滤镜，仅通过硬件级 `opacity: 0` 在 `0.85s cubic-bezier(0.4, 0, 0.2, 1)` 内平滑隐退与升起；
2. **三层底色并行融解与零下陷基底（GPU Direct Cross-Fade & Zero Luminance Dip）**：
   - 鉴于 CSS 原生无法平滑插值 `radial-gradient` 渐变背景，必须在 `.apple-spatial-backdrop` 内部并行放置三层独立的渐变层（`.backdrop-aurora`, `.backdrop-daylight`, `.backdrop-obsidian`）；
   - 背景容器底色必须随模式同频过渡（极光 `#f0f4fa`、晨曦 `#f5f5f7`、暗夜 `#000000`），彻底消除图层交叠中途因透底黑色而产生的“亮度下陷抽搐（Luminance Dip）”；
   - 渐变层常态 `opacity: 0; will-change: opacity; transition: opacity 0.85s cubic-bezier(0.4, 0, 0.2, 1);`，由状态属性驱动激活层 `opacity: 1;`，纯 GPU 纹理混合融解；
3. **视网膜同构阴影对齐（Shadow Isomorphism）**：
   - 浅色与暗色模式下的 `box-shadow` **投影层数必须严格一对一对齐**（如 4 层对 4 层），杜绝因层数不匹配导致浏览器无法数学插值而产生边缘瞬闪；
4. **长周期舒缓 S 曲线（0.85s Cinematic Ambient Dissolve）**：
   - 环境调光严禁使用陡降暴冲的快速弹簧曲线（Spring 曲线前 100ms 暴降 70% 亮度会直接引发人眼眩晕）；
   - 全站卡片、外壳、边框、阴影统一采用 **0.85s + `cubic-bezier(0.4, 0, 0.2, 1)`** 缓入缓出曲线，给瞳孔充分适应时间，如高档影院调光般温和优雅。

