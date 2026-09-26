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
* **A. 静态交互卡片层 (Static Glass Cards)**：
  * **适用对象**：`.topic-card`（复习卡片）、`.hero`、`.question-pane`（题目看板）。
  * **物理规则**：
    - **基础静置态**：`background: rgba(255, 255, 255, 0.48 ~ 0.52);`
    - **光学折射核**：维持 `backdrop-filter: blur(14px) saturate(180%);`（通过 1.8x 饱和度增幅使背后的极光折射更加晶莹）。
    - **动态聚光灯**：通过父容器代理节流计算 `--card-mouse-x/y`，渲染 220px 柔和径向聚光反光。
* **B. 高速物理滑轨透镜 (High-Speed Native Pro Specular Lens)**：
  * **适用对象**：`.module-nav-lens`（目录磁吸滑块透镜）。
  * **物理规则 (Zero-Latency Direct Compositing)**：
    - **彻底卸载动态模糊**：**严禁在高速移动透镜上挂载 `backdrop-filter: blur(...)`**！快速位移会强制 GPU 逐帧执行 Framebuffer 读回与全屏卷积，引发掉帧，并导致运动瞬态中文边缘产生亚像素模糊毛边；
    - **原生高透微晶树脂**：采用 Apple Native Pro 晶体直出材质（极光 `rgba(255, 255, 255, 0.65)`、晨曦 `0.75`、暗夜 `0.12`）；
    - **双微晶高光切边**：配置顶端迎光面 1.5px 纯白晶体切边（`inset 0 1.5px 0 rgba(255, 255, 255, 0.98)`）与抗背景吞噬微暗描边（`border: 1px solid rgba(60, 60, 67, 0.13)`），呈现精密切割的高级水晶标尺质感；
    - **性能指标**：算力开销归零，位移 100% 走快速硬件 Alpha 混合器，稳锁 120Hz 物理极速，字迹印刷级锐利。

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

### 5. 36px 黄金高度分段器与晶体微符规范 (36px Toolbar & Switcher Standard)
- **黄金高度对齐**：工具栏中央方向切换器（`.track-switch`）与右侧氛围切换器（`.atmosphere-switch`）严格统一锁定为 **36px 黄金高度**，外层顶栏外壳维持 `min-height: 60px`；
- **晶体微符指示**：氛围控制器集成高精度晶体微符（`✦ 极光`、`☀️ 晨曦`、`🌙 暗夜`），字号 12.5px，图标与文字保持 5px 留白；
- **毛细分隔线**：标签之间注入 `1px × 14px` 的微细晶体分隔线（`rgba(60, 60, 67, 0.14)`），当任一相邻 Tab 处于激活或悬浮态时平滑隐退；
- **品牌区触点解耦**：品牌 Logo 超椭圆徽标封装为独立交互按钮（`.brand-mark-btn`），折叠顶栏行为严格收敛于徽标本身，避免点击品牌文字误触发折叠。

### 6. 视网膜水感分段滑块规范 (Liquid Glass Slider Formula)
分段控制器（`.track-switch`）与模式切换器（`.atmosphere-switch`）的物理透镜滑块（`.track-lens`, `.atmo-lens`）**严禁使用 $\ge 90\%$ 不透明度的实心乳白塑料块**：
- **水感半透基底**：必须采用 `rgba(255, 255, 255, 0.72 ~ 0.78)`（暗夜：`rgba(255, 255, 255, 0.16)`），确保底层极光彩色光球能自然漫透；
- **180% 鲜活折射率**：维持 `-webkit-backdrop-filter: blur(16px) saturate(180%); backdrop-filter: blur(16px) saturate(180%);`；
- **双微晶高光切边**：顶部配置纯白物理高光切边 `inset 0 1px 0.5px rgba(255, 255, 255, 1)`，四周环绕微暗抗吞噬描边 `border: 0.5px solid rgba(60, 60, 67, 0.08)`。

### 7. 超椭圆徽标比例 (Squircle Ratio for Badges)
对于 32px~36px 的微型功能图标（如 32px 的 `.brand-mark` 和 34px 的 `.topic-icon`），其 R 角与尺寸的比值必须维持在 **1 : 3.75 ~ 1 : 3.8**（例如 $34 / 9 \approx 3.77$），精确对应 iOS App 图标的标准超椭圆收弧比例。

---

## 五、 动效手感与双时序物理准则 (Fluid Physics & Dual-Timing Framework)

全站动效严格解耦为两套互不干扰的物理时序模型：

### 1. 交互动效时序 (Interactive Micro-Physics)
- **快速回弹**：`var(--apple-spring)` $\rightarrow$ `cubic-bezier(0.16, 1, 0.3, 1)`（持续时间 120ms~140ms），专用于鼠标悬浮、点击释放、滑块到位；
- **点击微压**：`var(--apple-press)` $\rightarrow$ `cubic-bezier(0.2, 0.8, 0.2, 1)`（持续时间 80ms，`scale(0.985)`）。

### 2. 电影级环境光融解时序 (Cinematic Ambient Dissolve)
- **平缓调光曲线**：`var(--ambient-fade-timing)` $\rightarrow$ `cubic-bezier(0.12, 1, 0.28, 1)`（超长柔和阻尼曲线）；
- **黄金适应时长**：`var(--ambient-fade-duration)` $\rightarrow$ `1.75s`（文字色阶过渡：`--ambient-text-duration: 1.75s`）；
- **严禁滥用 Spring 曲线**：严禁在全屏明暗切换、渐变透明度、大面积卡片底色上使用陡降型弹簧曲线（防止前 100ms 暴降 70% 亮度引发视觉闪烁与人眼眩晕）。

### 3. 120Hz 视网膜极速跟手与零重排代数投影 (Zero-Reflow & 120Hz V-Sync)
- **单帧 8.33ms 预算控制**：在 MacBook Pro ProMotion 120Hz 高刷屏下，单帧预算严格控制在 8.33ms 内；
- **零重排代数投影 (Zero-Reflow Law)**：**严禁在 `requestAnimationFrame` 内部读取刚被修改的 DOM 几何信息**（如 `lens.getBoundingClientRect()`），必须通过闭式代数投影计算光标在透镜内的局部坐标：
  $$\text{mouseX} = \text{clientX} - \text{navRect.left}$$
  $$\text{mouseY} = \text{cursorY} - \text{targetY}$$
  实现整个 RAF 帧纯写入的 0 阻塞、0 重新布局；
- **硬件 3D 图层绑定**：透镜位移必须使用 `translate3d(0, targetY, 0)` 强制锁定硬件合成层；
- **排版绝对静止准则 (Typographic Stillness Rule)**：目录项鼠标悬浮时**严禁文本出现横向 `translateX` 抖动或字重拉扯**，视线基准线必须绝对稳固，交互反馈纯粹由水感透镜与字色微光承担；
- **闪电吸附与微磁吸阻尼**：跳项吸附配置 `0.12s var(--apple-spring)`，项内微磁吸跟随配置 `0.04s ease-out`，实现“指哪打哪”的原生 Mac 桌面级跟手感。

---

## 六、 氛围模式适配与渲染管线优化 (Atmosphere Modes & Graphics Pipeline)

系统必须支持三种标准氛围模式无缝切换：
1. **极光流体 (Aurora - 默认)**：五重彩色光球（青、天蓝、紫罗兰、浅粉、薄荷绿）弥散游走，高折射高饱和度，搭配北欧空灵天光底座；
2. **晨曦天光 (Daylight)**：100% 极纯白透光工作室画布（`#ffffff`），搭配白瓷晶莹液态卡片与纯白日光光雾，彻底消除任何灰蓝偏色；
3. **暗夜琉璃 (Obsidian)**：深沉夜幕，底色纯黑（`#000000` / `#111114`），半透黑烟熏琉璃，深邃 OLED 质感。

### 🚨 核心渲染管线铁律 (Rendering Pipeline Constraints)

#### 1. 极光 5 阶自然样条与零重绘管线 (Zero-Repaint Spline Pipeline)
- **严禁在 `@keyframes` 中动态改变 `border-radius` 与 `filter`**：此类属性变动会迫使 CPU 每一帧对数百万像素重新栅格化，引发 GPU 复合管线雪崩；
- **固定超椭圆形态 + 纯 GPU 合成矩阵**：光球采用固定的超椭圆自然曲率，流动形态 100% 交由 GPU 硬件级 `transform: translate3d(...) rotate(...) scale(x, y)` 与 `opacity` 驱动；
- **5 阶自然样条渐变羽化**：光球采用 5 阶二次方样条渐变平滑衰减至 `transparent 90%`，使自身在光栅化时即呈现如同烟雨般的柔和边缘；
- **轻量晶体模糊与去 Overlay**：外层容器高斯模糊滤镜控制在 `blur(20px)`，同时去除全屏噪声层的 `mix-blend-mode: overlay`，彻底消除全屏帧缓冲区的二次回读计算。

#### 2. 晨曦天光纯净白瓷画布 (Daylight Pure White Canvas)
- **100% 极纯白透光基底**：背景完全交由硬件加速的 `#ffffff` 纯白无瑕工作室天光渐变承托，彻底消除任何偏蓝、发灰杂质；
- **晶莹白瓷液态玻璃**：卡片在晨曦模式下启用高通透白瓷玻璃（`--glass-fill: rgba(255, 255, 255, 0.72 ~ 0.90)`），配合 Apple 视网膜双微晶边框，呈现如瓷似玉的纯白高级质感；
- **动态光斑彻底归零**：进入晨曦模式后，底层 `.backdrop-mesh` 设为 `opacity: 0; pointer-events: none;`，获得零 GPU 负载与绝对稳定的纯白天光画布。

#### 3. 电影级环境水墨弥漫与零瞬断规则 (Cinematic Ambient Mist Permeation)
浅色与暗色模式的切换严禁生硬跳变与闪烁晕眩：
- **消灭渲染断点与滤镜闪变（禁止 `display: none` 与动态 `filter` 补间）**：严禁在暗夜模式下对 `.backdrop-mesh` 设置 `display: none !important`；光球维持固定滤镜，仅通过硬件级 `opacity: 0` 在 `1.75s cubic-bezier(0.12, 1, 0.28, 1)` 内平滑隐退与升起；
- **三层底色并行融解与零下陷基底（GPU Direct Cross-Fade & Zero Luminance Dip）**：在 `.apple-spatial-backdrop` 内部并行放置三层独立的渐变层（`.backdrop-aurora`, `.backdrop-daylight`, `.backdrop-obsidian`），由 GPU `opacity 1.75s` 进行混合交叠，底座背景色随模式同频过渡，杜绝中间帧透底露黑导致的“亮度下陷抽搐（Luminance Dip）”；
- **视网膜同构阴影对齐（Shadow Isomorphism）**：浅色与暗色模式下的 `box-shadow` **投影层数必须严格一对一对齐**（如 4 层对 4 层），杜绝因层数不匹配导致浏览器无法数学插值而产生边缘瞬闪；
- **全局 1.75s 缓入缓出调光**：全站卡片、外框、边框与文字统一配置 **1.75s + `cubic-bezier(0.12, 1, 0.28, 1)`** 影院级平滑 S 曲线，给瞳孔充分适应时间。

#### 4. 点光源全局水墨弥漫体系 (Ambient Mist Permeation Engine - Organic Radial Diffusion)
当用户点击顶部 `.atmosphere-switch` 切换极光、晨曦与暗夜模式时，采用真正的点光源水墨/晨雾弥散体系：
- **物理触点锚定辐射原点**：以用户点击按钮的物理坐标 $(x, y)$ 为真实点光源，生成纯正圆 1:1 高斯扩散光幕（`.backdrop-mist`），从按钮中心以 `scale(0.1)` 诞生，随时间向全屏外扩漫散，直径覆盖超 3500px，确保连绵覆盖至视口最远角落；
- **零切线边界与零方形裁切法则 (Zero Box / Zero-Cutoff Law)**：严禁使用任何 `16:9` 矩形 DOM 的物理尺度放大（防止长方形边角外推感）；光幕自身为严格正圆形，叠加 `filter: blur(80px)` 晶体高斯超羽化，漫散波前无可见几何硬线，呈现如同水墨滴入清水、天光穿透云海般的有机“弥漫”感；
- **目标色彩真实对齐与零颜色突变**：
  - **极光 (Aurora)**：采用与极光实景完美同构的北欧晨曦天光纯净白蓝浅调（核心 `rgba(240, 246, 255)` 至外围 `rgba(224, 242, 254)`），严禁使用刺眼的伪色霓虹紫，消除终态亮度阶跃与突变；
  - **晨曦 (Daylight)**：100% 极纯白日照水雾（全阶纯白 `rgba(255, 255, 255, ...)`），纯白阳光温柔抚平全屏；
  - **暗夜 (Obsidian)**：深邃夜幕水墨琉璃（`#000000` 核心漫散至深熏黑曜）；
- **零强制回流与 GPU 纯硬件合成**：点击处理中彻底废除 `void element.offsetWidth` 等同步回流调用；采用 Web Animations API (`element.animate`) 驱动硬件变换，保证在 1.75s 内以 `cubic-bezier(0.12, 1, 0.28, 1)` 满帧 120 FPS 展开，并与底层 1.75s CSS 属性过渡毫秒级同频平息。





