const tracks = {
  backend: {
    title: 'Java 后端八股',
    sidebarLabel: 'Java 后端',
    breadcrumb: '后端八股',
    modules: [
      { name: 'Java 基础', topics: ['语言特性', '泛型与反射', '异常与 IO'] },
      { name: '集合与并发', topics: ['集合框架', '线程与线程池', '锁与并发工具'] },
      { name: 'JVM', topics: ['内存模型', '垃圾回收', '类加载与调优'] },
      { name: 'Spring 生态', topics: ['Spring 核心', 'Spring Boot', 'Spring Cloud'] },
      { name: '数据存储', topics: ['MySQL', 'Redis', 'Elasticsearch'] },
      { name: '中间件', topics: ['消息队列', '任务调度', '分布式协调'] },
      { name: '计算机基础', topics: ['网络协议', '操作系统', '数据结构与算法'] },
      { name: '系统设计', topics: ['分布式系统', '高可用与性能', '安全与稳定性'] },
    ],
  },
  agent: {
    title: 'Agent 八股',
    sidebarLabel: 'Agent',
    breadcrumb: 'Agent 八股',
    modules: [
      { name: '模型与推理', topics: ['模型基础', '推理参数', '模型选型'] },
      { name: '提示词与上下文', topics: ['Prompt 设计', '上下文工程', '结构化输出'] },
      { name: 'RAG', topics: ['文档处理', '检索与重排', '答案生成'] },
      { name: '工具调用', topics: ['Function Calling', '工具设计', '执行与容错'] },
      { name: 'Agent 架构', topics: ['ReAct', '规划与反思', '多 Agent 协作'] },
      { name: '记忆与状态', topics: ['短期记忆', '长期记忆', '会话状态'] },
      { name: '工作流编排', topics: ['节点与路由', '人工介入', '异步执行'] },
      { name: '评测与安全', topics: ['效果评测', '可观测性', '安全边界'] },
      { name: '工程落地', topics: ['成本与延迟', '生产部署', '可靠性'] },
    ],
  },
};

const state = { track: 'backend', moduleIndex: 0, topicIndex: null };
const $ = (id) => document.getElementById(id);

function setTrack(track) {
  if (!tracks[track]) return;
  state.track = track;
  state.moduleIndex = 0;
  state.topicIndex = null;
  history.replaceState(null, '', `#${track}`);
  render();
}

function selectModule(index) {
  state.moduleIndex = index;
  state.topicIndex = null;
  render();
  document.querySelector('.module-link.active')?.focus();
}

function selectTopic(index) {
  state.topicIndex = index;
  render();
  document.querySelector('.topic-card.selected')?.focus();
}

function render() {
  const track = tracks[state.track];
  const module = track.modules[state.moduleIndex];
  const total = track.modules.length;

  for (const key of Object.keys(tracks)) {
    const tab = $(`tab-${key}`);
    const active = key === state.track;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  }
  document.querySelector('.track-switch').dataset.active = state.track;
  $('workspace').setAttribute('aria-labelledby', `tab-${state.track}`);
  const pageTitle = $('page-title');
  if (pageTitle) pageTitle.textContent = track.title;
  const moduleCount = $('module-count');
  if (moduleCount) moduleCount.textContent = String(total);
  const sidebarTrackLabel = $('sidebar-track-label');
  if (sidebarTrackLabel) sidebarTrackLabel.textContent = track.sidebarLabel;
  $('breadcrumb-track').textContent = track.breadcrumb;
  $('breadcrumb-module').textContent = module.name;
  $('module-title').textContent = module.name;
  $('module-topic-count').textContent = `${module.topics.length} 个方向`;

  const nav = $('module-nav');
  nav.replaceChildren();
  const lens = document.createElement('span');
  lens.className = 'module-nav-lens';
  lens.setAttribute('aria-hidden', 'true');
  nav.append(lens);

  track.modules.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `module-link${index === state.moduleIndex ? ' active' : ''}`;
    button.setAttribute('aria-current', index === state.moduleIndex ? 'page' : 'false');
    button.innerHTML = '<span class="module-link-name"></span>';
    button.querySelector('.module-link-name').textContent = item.name;
    button.addEventListener('click', () => selectModule(index));
    nav.append(button);
  });

  const grid = $('topic-grid');
  grid.replaceChildren();
  module.topics.forEach((topic, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `topic-card${index === state.topicIndex ? ' selected' : ''}`;
    button.setAttribute('aria-pressed', String(index === state.topicIndex));
    button.innerHTML = `<span class="topic-icon" aria-hidden="true">${index + 1}</span><span class="topic-name"></span><span class="topic-chevron" aria-hidden="true">›</span>`;
    button.querySelector('.topic-name').textContent = topic;
    button.addEventListener('click', () => selectTopic(index));
    grid.append(button);
  });

  const selectedTopic = state.topicIndex === null ? null : module.topics[state.topicIndex];
  $('question-heading').textContent = selectedTopic || '题目';
  $('empty-title').textContent = selectedTopic ? `${selectedTopic}还没有题目` : '还没有题目';
  $('empty-description').textContent = selectedTopic ? '这个方向的复习内容会显示在这里。' : '选择一个复习方向，之后可在这里查看题目。';
}

document.querySelectorAll('.track-tab').forEach((tab) => {
  tab.addEventListener('click', () => setTrack(tab.dataset.track));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'ArrowRight' || event.key === 'End' ? 'agent' : 'backend';
    setTrack(next);
    $(`tab-${next}`).focus();
  });
});

const initialTrack = location.hash.replace('#', '');
if (tracks[initialTrack]) state.track = initialTrack;
window.addEventListener('hashchange', () => {
  const track = location.hash.replace('#', '');
  if (tracks[track] && track !== state.track) {
    state.track = track;
    state.moduleIndex = 0;
    state.topicIndex = null;
    render();
  }
});

// ==========================================================================
// Apple Liquid Glass Dynamic Specular Light Interaction
// ==========================================================================
function initLiquidSpecular() {
  const attachSpecularTracker = (element) => {
    let frameId = null;
    let rect = null;

    const updateRect = () => {
      rect = element.getBoundingClientRect();
    };

    element.addEventListener('pointerenter', updateRect, { passive: true });
    window.addEventListener('resize', updateRect, { passive: true });
    window.addEventListener('scroll', updateRect, { passive: true });

    element.addEventListener('pointermove', (event) => {
      if (!rect) updateRect();
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        if (!rect) return;
        element.style.setProperty('--specular-x', `${event.clientX - rect.left}px`);
        element.style.setProperty('--specular-y', `${event.clientY - rect.top}px`);
      });
    }, { passive: true });

    element.addEventListener('pointerleave', () => {
      if (frameId) cancelAnimationFrame(frameId);
      rect = null;
      element.style.removeProperty('--specular-x');
      element.style.removeProperty('--specular-y');
    }, { passive: true });
  };

  const header = document.querySelector('.header-inner');
  if (header) attachSpecularTracker(header);

  // Topic card hover sheen using container delegation
  const topicGrid = $('topic-grid');
  if (topicGrid) {
    let cardFrameId = null;
    let activeCard = null;
    let cardRect = null;

    topicGrid.addEventListener('pointermove', (event) => {
      const card = event.target.closest('.topic-card');
      if (!card) {
        activeCard = null;
        cardRect = null;
        return;
      }
      if (card !== activeCard) {
        activeCard = card;
        cardRect = card.getBoundingClientRect();
      }
      if (cardFrameId) cancelAnimationFrame(cardFrameId);
      cardFrameId = requestAnimationFrame(() => {
        if (!cardRect) cardRect = card.getBoundingClientRect();
        card.style.setProperty('--card-mouse-x', `${event.clientX - cardRect.left}px`);
        card.style.setProperty('--card-mouse-y', `${event.clientY - cardRect.top}px`);
      });
    }, { passive: true });

    topicGrid.addEventListener('pointerleave', () => {
      if (cardFrameId) cancelAnimationFrame(cardFrameId);
      activeCard = null;
      cardRect = null;
    }, { passive: true });
  }
}

// ==========================================================================
// Apple Liquid Glass Atmosphere Environment Mode Switcher & Dynamic Parallax
// ==========================================================================
function setAtmosphere(mode) {
  document.body.dataset.atmosphere = mode;
  const atmoSwitch = document.querySelector('.atmosphere-switch');
  if (atmoSwitch) {
    atmoSwitch.dataset.active = mode;
  }
  document.querySelectorAll('.atmo-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.atmo === mode);
  });
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', mode === 'obsidian' ? '#000000' : '#ffffff');
  }
}

let currentMistAnim = null;

function triggerAmbientMistDiffusion(x, y, targetMode) {
  const mist = $('backdrop-mist');
  if (!mist) return;

  if (currentMistAnim) {
    try {
      currentMistAnim.cancel();
    } catch (_) {}
    currentMistAnim = null;
  }

  // Calculate maximum distance to the 4 viewport corners to guarantee full coverage
  const maxDist = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  // The base mist element has a radius of 120px (240px diameter).
  // Target scale covers maxDist with a 35% margin to ensure the soft Gaussian falloff envelops corners.
  const targetScale = Math.max(20, Math.ceil((maxDist * 1.35) / 120));

  mist.className = `backdrop-mist mist-${targetMode}`;
  mist.style.left = `${x.toFixed(1)}px`;
  mist.style.top = `${y.toFixed(1)}px`;

  currentMistAnim = mist.animate([
    {
      transform: 'translate3d(-50%, -50%, 0) scale(0.1)',
      opacity: 0
    },
    {
      transform: `translate3d(-50%, -50%, 0) scale(${Math.round(targetScale * 0.25)})`,
      opacity: 0.85,
      offset: 0.22
    },
    {
      transform: `translate3d(-50%, -50%, 0) scale(${Math.round(targetScale * 0.65)})`,
      opacity: 0.60,
      offset: 0.55
    },
    {
      transform: `translate3d(-50%, -50%, 0) scale(${targetScale})`,
      opacity: 0.20,
      offset: 0.85
    },
    {
      transform: `translate3d(-50%, -50%, 0) scale(${Math.round(targetScale * 1.15)})`,
      opacity: 0,
      offset: 1.0
    }
  ], {
    duration: 1750,
    easing: 'cubic-bezier(0.12, 1, 0.28, 1)',
    fill: 'forwards'
  });

  currentMistAnim.onfinish = () => {
    mist.style.opacity = '0';
    mist.style.transform = 'translate3d(-9999px, -9999px, 0) scale(0.1)';
    mist.className = 'backdrop-mist';
    currentMistAnim = null;
  };
}

function initAtmosphere() {
  const urlAtmo = urlParams.get('atmo');
  const saved = urlAtmo || localStorage.getItem('bagu-atmosphere') || 'aurora';
  
  // Suppress transitions on initial load to prevent flashing
  document.body.classList.add('no-transition');
  setAtmosphere(saved);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.remove('no-transition');
    });
  });

  document.querySelectorAll('.atmo-tab').forEach((tab) => {
    tab.addEventListener('click', (event) => {
      const mode = tab.dataset.atmo;
      if (document.body.dataset.atmosphere === mode) return;

      const rect = tab.getBoundingClientRect();
      const x = (event.clientX && event.clientX > 0) ? event.clientX : (rect.left + rect.width / 2);
      const y = (event.clientY && event.clientY > 0) ? event.clientY : (rect.top + rect.height / 2);

      // Tactile button micro-spring feedback via Web Animations API (zero layout reflow)
      try {
        tab.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.08)', offset: 0.35 },
          { transform: 'scale(1)' }
        ], {
          duration: 480,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
        });
      } catch (_) {}

      // Permeate organic ambient mist radially outward from (x, y) across the screen
      triggerAmbientMistDiffusion(x, y, mode);

      // Synchronous seamless transition in perfect 0.95s phase alignment (zero stutter)
      setAtmosphere(mode);
      try {
        localStorage.setItem('bagu-atmosphere', mode);
      } catch (_) {}
    });
  });
}

function initHeaderCollapse() {
  const brandToggle = $('brand-toggle');
  if (!brandToggle) return;

  function setHeaderCollapsed(collapsed) {
    document.body.classList.toggle('header-collapsed', collapsed);
    brandToggle.setAttribute('aria-expanded', String(!collapsed));
    brandToggle.title = collapsed ? '展开顶部导航' : '收起顶部导航';
    brandToggle.setAttribute('aria-label', collapsed ? '展开顶部导航' : '收起顶部导航');
    try {
      localStorage.setItem('bagu-header-collapsed', collapsed ? 'true' : 'false');
    } catch (_) {}
  }

  const urlParams = new URLSearchParams(window.location.search);
  const isUrlCollapsed = urlParams.get('collapsed') === 'true';
  const saved = localStorage.getItem('bagu-header-collapsed') === 'true';
  if (isUrlCollapsed || saved) {
    setHeaderCollapsed(true);
  }

  brandToggle.addEventListener('click', (e) => {
    e.preventDefault();
    const isCurrentlyCollapsed = document.body.classList.contains('header-collapsed');
    setHeaderCollapsed(!isCurrentlyCollapsed);
  });

  const brandName = document.querySelector('.brand-name');
  if (brandName) {
    brandName.addEventListener('click', () => {
      if (document.body.classList.contains('header-collapsed')) {
        setHeaderCollapsed(false);
      }
    });
  }
}

const urlParams = new URLSearchParams(window.location.search);
const topicParam = urlParams.get('topic');
if (topicParam !== null && !isNaN(Number(topicParam))) {
  state.topicIndex = Number(topicParam);
}

function initModuleNavHoverTracker() {
  const nav = $('module-nav');
  if (!nav) return;
  nav.classList.add('has-lens');

  function getLens() {
    let lens = nav.querySelector('.module-nav-lens');
    if (!lens) {
      lens = document.createElement('span');
      lens.className = 'module-nav-lens';
      lens.setAttribute('aria-hidden', 'true');
      nav.prepend(lens);
    }
    return lens;
  }

  let activeIndex = -1;
  let isInside = false;
  let moveFrameId = null;
  let cachedMetrics = [];
  let navRect = null;

  function updateNavRect() {
    navRect = nav.getBoundingClientRect();
  }

  function updateMetrics() {
    const buttons = Array.from(nav.querySelectorAll('.module-link'));
    cachedMetrics = buttons.map((btn, index) => {
      const top = btn.offsetTop;
      const height = btn.offsetHeight;
      return {
        btn,
        index,
        top,
        height,
        centerY: top + height / 2,
      };
    });
  }

  // Nearest Centroid Projection: Mathematical Voronoi 1D proximity mapping
  function getNearestTarget(cursorY) {
    if (!cachedMetrics.length) return null;
    let closest = cachedMetrics[0];
    let minDistance = Math.abs(cursorY - closest.centerY);
    for (let i = 1; i < cachedMetrics.length; i++) {
      const distance = Math.abs(cursorY - cachedMetrics[i].centerY);
      if (distance < minDistance) {
        minDistance = distance;
        closest = cachedMetrics[i];
      }
    }
    return closest;
  }

  nav.addEventListener('pointerenter', () => {
    updateMetrics();
    updateNavRect();
    isInside = true;
  }, { passive: true });

  window.addEventListener('resize', () => {
    updateMetrics();
    updateNavRect();
  }, { passive: true });

  window.addEventListener('scroll', () => {
    updateNavRect();
  }, { passive: true });

  nav.addEventListener('pointermove', (event) => {
    // If elements refreshed by render() or metrics empty, refresh cache
    if (!cachedMetrics.length || cachedMetrics[0].btn.parentElement !== nav) {
      updateMetrics();
      updateNavRect();
    }
    if (!cachedMetrics.length) return;
    if (!navRect) updateNavRect();

    const cursorY = event.clientY - navRect.top;
    const target = getNearestTarget(cursorY);
    if (!target) return;

    const lens = getLens();
    const isNewItem = target.index !== activeIndex;

    // Apple Micro-Parallax: ±2.2px liquid magnetic follower based on distance from item center
    const deltaY = cursorY - target.centerY;
    const microOffset = Math.max(-2.2, Math.min(2.2, deltaY * 0.09));
    const targetY = target.top + microOffset;

    if (isNewItem) {
      activeIndex = target.index;
      cachedMetrics.forEach(m => m.btn.classList.toggle('is-hovered', m.index === activeIndex));
      lens.classList.remove('is-micro-tracking');
      lens.style.transition = 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1), height 0.12s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.14s ease-out';
    }

    if (moveFrameId) cancelAnimationFrame(moveFrameId);
    moveFrameId = requestAnimationFrame(() => {
      if (!isNewItem && !lens.classList.contains('is-micro-tracking')) {
        lens.classList.add('is-micro-tracking');
        lens.style.transition = 'transform 0.04s ease-out, height 0.12s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.14s ease-out';
      }

      lens.style.transform = `translate3d(0, ${targetY.toFixed(1)}px, 0) scale(1.01)`;
      lens.style.height = `${target.height}px`;
      lens.style.opacity = '1';

      // Zero-reflow specular spotlight: pure algebraic projection (eliminating forced layout reflow)
      const mouseX = event.clientX - navRect.left;
      const mouseY = cursorY - targetY;
      lens.style.setProperty('--lens-mouse-x', `${mouseX.toFixed(1)}px`);
      lens.style.setProperty('--lens-mouse-y', `${mouseY.toFixed(1)}px`);
    });
  }, { passive: true });

  nav.addEventListener('pointerleave', () => {
    if (moveFrameId) cancelAnimationFrame(moveFrameId);
    isInside = false;
    activeIndex = -1;
    navRect = null;
    cachedMetrics.forEach(m => m.btn.classList.remove('is-hovered'));

    const lens = getLens();
    lens.classList.remove('is-micro-tracking');
    lens.style.transition = 'opacity 0.18s ease-out, transform 0.20s var(--apple-spring)';
    const currentTranslate = lens.style.transform.match(/translate3d\([^)]+\)/)?.[0] || 'translate3d(0, 0px, 0)';
    lens.style.transform = `${currentTranslate} scale(0.96)`;
    lens.style.opacity = '0';
  }, { passive: true });
}

render();
initLiquidSpecular();
initAtmosphere();
initHeaderCollapse();
initModuleNavHoverTracker();

if (urlParams.get('hover-demo') === 'true') {
  setTimeout(() => {
    const links = document.querySelectorAll('.module-link');
    if (links[1]) {
      const lens = document.querySelector('.module-nav-lens');
      const nav = $('module-nav');
      if (lens && nav) {
        const btnRect = links[1].getBoundingClientRect();
        lens.style.transform = `translateY(${links[1].offsetTop}px) scale(1.01)`;
        lens.style.height = `${links[1].offsetHeight}px`;
        lens.style.setProperty('--lens-mouse-x', `${btnRect.width * 0.45}px`);
        lens.style.setProperty('--lens-mouse-y', `${btnRect.height * 0.5}px`);
        lens.style.opacity = '1';
        links[1].classList.add('is-hovered');
      }
    }
    const cards = document.querySelectorAll('.topic-card');
    if (cards[1]) cards[1].classList.add('pseudo-hover');
  }, 100);
}

