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
  $('sidebar-track-label').textContent = track.sidebarLabel;
  $('breadcrumb-track').textContent = track.breadcrumb;
  $('breadcrumb-module').textContent = module.name;
  $('module-title').textContent = module.name;
  $('module-topic-count').textContent = `${module.topics.length} 个方向`;

  const nav = $('module-nav');
  nav.replaceChildren();
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
    element.addEventListener('pointermove', (event) => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        element.style.setProperty('--specular-x', `${event.clientX - rect.left}px`);
        element.style.setProperty('--specular-y', `${event.clientY - rect.top}px`);
      });
    });
    element.addEventListener('pointerleave', () => {
      if (frameId) cancelAnimationFrame(frameId);
      element.style.removeProperty('--specular-x');
      element.style.removeProperty('--specular-y');
    });
  };

  const header = document.querySelector('.header-inner');
  if (header) attachSpecularTracker(header);

  // Topic card hover sheen using container delegation
  const topicGrid = $('topic-grid');
  if (topicGrid) {
    let cardFrameId = null;
    topicGrid.addEventListener('pointermove', (event) => {
      const card = event.target.closest('.topic-card');
      if (!card) return;
      if (cardFrameId) cancelAnimationFrame(cardFrameId);
      cardFrameId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--card-mouse-x', `${event.clientX - rect.left}px`);
        card.style.setProperty('--card-mouse-y', `${event.clientY - rect.top}px`);
      });
    });
    topicGrid.addEventListener('pointerleave', (event) => {
      if (cardFrameId) cancelAnimationFrame(cardFrameId);
      const card = event.target.closest('.topic-card');
      if (card) {
        card.style.removeProperty('--card-mouse-x');
        card.style.removeProperty('--card-mouse-y');
      }
    });
  }
}

// ==========================================================================
// Apple Liquid Glass Atmosphere Environment Mode Switcher & Dynamic Parallax
// ==========================================================================
function setAtmosphere(mode) {
  document.body.dataset.atmosphere = mode;
  document.querySelectorAll('.atmo-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.atmo === mode);
  });
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', mode === 'obsidian' ? '#000000' : '#ffffff');
  }
}

function initAtmosphere() {
  const saved = localStorage.getItem('bagu-atmosphere') || 'aurora';
  setAtmosphere(saved);

  document.querySelectorAll('.atmo-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.atmo;
      setAtmosphere(mode);
      try {
        localStorage.setItem('bagu-atmosphere', mode);
      } catch (_) {}
    });
  });
}

function initAuroraParallax() {
  const mesh = document.querySelector('.backdrop-mesh');
  if (!mesh) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let rafId = null;

  window.addEventListener('pointermove', (event) => {
    if (document.body.dataset.atmosphere === 'obsidian') return;
    const nx = (event.clientX / window.innerWidth - 0.5) * 2;
    const ny = (event.clientY / window.innerHeight - 0.5) * 2;
    targetX = nx * 40;
    targetY = ny * 35;

    if (!rafId) {
      rafId = requestAnimationFrame(animateMesh);
    }
  }, { passive: true });

  function animateMesh() {
    if (document.body.dataset.atmosphere === 'obsidian') {
      mesh.style.transform = '';
      rafId = null;
      return;
    }

    currentX += (targetX - currentX) * 0.055;
    currentY += (targetY - currentY) * 0.055;
    mesh.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

    if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
      rafId = requestAnimationFrame(animateMesh);
    } else {
      rafId = null;
    }
  }
}

render();
initLiquidSpecular();
initAtmosphere();
initAuroraParallax();
