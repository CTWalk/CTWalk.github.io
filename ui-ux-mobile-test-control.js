(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('uiux-test') !== '1') return;

  const html = document.documentElement;
  if (html.dataset.presentation !== 'mobile-fallback') return;

  const fallback = document.getElementById('mobile-fallback');
  const fallbackApi = window.__mobileFallback;
  if (!fallback || !fallbackApi) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const previousScrollBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  html.dataset.uiuxTest = 'true';

  const checkpointIds = Object.freeze([
    'mobile.fallback',
    'mobile.fallback.reduced'
  ]);

  const frame = () => new Promise(resolve => requestAnimationFrame(() => resolve()));

  async function flushFrames(count = 2) {
    for (let i = 0; i < count; i += 1) await frame();
  }

  async function waitForAssets(timeoutMs = 1000) {
    const started = performance.now();
    while (performance.now() - started < timeoutMs) {
      const images = [...document.images].filter(image => getComputedStyle(image).display !== 'none');
      if (images.every(image => image.complete && image.naturalWidth > 0)) return true;
      await frame();
    }
    return false;
  }

  async function setLanguage(locale) {
    const selected = locale === 'zh-TW' || locale === 'zh' ? 'zh' : 'en';
    if (typeof window.applyLanguage === 'function') {
      window.applyLanguage(selected);
    } else {
      const button = document.querySelector(`.lang-switch button[data-lang="${selected}"]`);
      if (!button) throw new Error(`Language control unavailable: ${locale}`);
      button.click();
    }
    fallbackApi.syncLanguage();
    await flushFrames(3);
    return html.lang;
  }

  function normalizeCheckpoint(checkpointId) {
    if (!checkpointIds.includes(checkpointId)) {
      throw new Error(`Unknown mobile checkpoint: ${checkpointId}`);
    }
    if (checkpointId === 'mobile.fallback.reduced' && !reduced) {
      throw new Error('mobile.fallback.reduced requires prefers-reduced-motion: reduce');
    }
    if (checkpointId === 'mobile.fallback' && reduced) {
      throw new Error('mobile.fallback requires normal motion mode');
    }
    return checkpointId;
  }

  async function waitForVisualSettle() {
    const started = performance.now();
    fallbackApi.setTime(reduced ? fallbackApi.reducedTimeMs : fallbackApi.testTimeMs);
    await flushFrames(3);
    return {
      settled: true,
      stableFrames: 3,
      elapsedMs: performance.now() - started
    };
  }

  async function goToCheckpoint(checkpointId) {
    const normalized = normalizeCheckpoint(checkpointId);
    const settle = await waitForVisualSettle();
    return {
      checkpoint: normalized,
      presentation: 'mobile-fallback',
      scene: null,
      sceneProgress: 0,
      documentProgress: 0,
      score: 1,
      reduced,
      fallbackTimeMs: fallbackApi.getState().timeMs,
      settle
    };
  }

  async function goToScene() {
    throw new Error('Desktop scenes are intentionally unavailable in mobile fallback mode');
  }

  async function setSceneProgress() {
    throw new Error('Desktop scene progress is intentionally unavailable in mobile fallback mode');
  }

  function getState() {
    return {
      enabled: true,
      presentation: 'mobile-fallback',
      reducedMotion: reduced,
      locale: html.lang,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      documentProgress: 0,
      sceneOpacities: {},
      checkpoints: [...checkpointIds],
      fallback: fallbackApi.getState(),
      scrollBehaviorOverride: html.style.scrollBehavior
    };
  }

  async function ready() {
    if (document.fonts?.ready) await document.fonts.ready;
    const assetsReady = await waitForAssets();
    const settle = await waitForVisualSettle();
    return { assetsReady, settle, ...getState() };
  }

  const api = Object.freeze({
    version: 3,
    ready,
    waitForAssets,
    setLanguage,
    goToScene,
    setSceneProgress,
    goToCheckpoint,
    waitForVisualSettle,
    getState,
    sceneIds: Object.freeze({}),
    checkpointIds
  });

  Object.defineProperty(window, '__portfolioTest', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: api
  });

  window.addEventListener('beforeunload', () => {
    html.style.scrollBehavior = previousScrollBehavior;
  }, { once: true });

  window.dispatchEvent(new CustomEvent('portfolio-test-ready', {
    detail: { version: api.version, presentation: 'mobile-fallback' }
  }));
})();