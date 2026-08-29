(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('uiux-test') !== '1') return;

  const experience = document.getElementById('experience');
  const scenes = [...document.querySelectorAll('.scene[data-scene]')];
  if (!experience || !scenes.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const html = document.documentElement;
  const previousScrollBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  html.dataset.uiuxTest = 'true';

  const sceneIds = {
    intro: '0',
    commerce: '1',
    nocode: '2',
    social: '3',
    cuesheet: '4',
    dca: '5',
    outro: '6'
  };

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const mix = (a, b, amount) => a + (b - a) * amount;
  const frame = () => new Promise(resolve => requestAnimationFrame(() => resolve()));

  async function flushFrames(count = 2) {
    for (let i = 0; i < count; i += 1) await frame();
  }

  function sceneFor(sceneId) {
    const normalized = sceneIds[sceneId] ?? String(sceneId);
    const scene = scenes.find(node => node.dataset.scene === normalized);
    if (!scene) throw new Error(`Unknown scene: ${sceneId}`);
    return scene;
  }

  function opacityOf(node) {
    if (!node) return 0;
    const value = Number.parseFloat(getComputedStyle(node).opacity);
    return Number.isFinite(value) ? value : 0;
  }

  function backgroundAlpha(node) {
    if (!node) return 0;
    const color = getComputedStyle(node).backgroundColor;
    const rgba = color.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/i);
    if (rgba) return clamp(Number.parseFloat(rgba[1]) || 0);
    return color === 'transparent' ? 0 : 1;
  }

  function documentProgress() {
    if (reduced) return 0;
    const travel = Math.max(1, experience.offsetHeight - window.innerHeight);
    const rect = experience.getBoundingClientRect();
    return clamp(-rect.top / travel);
  }

  async function setDocumentProgress(progress) {
    if (reduced) return;
    const travel = Math.max(1, experience.offsetHeight - window.innerHeight);
    window.scrollTo(0, travel * clamp(progress));
    await flushFrames(2);
  }

  async function waitForAssets(timeoutMs = 8000) {
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
    await flushFrames(3);
    return html.lang;
  }

  let boundsCache = null;
  let boundsCacheKey = '';

  function currentBoundsKey() {
    return `${window.innerWidth}x${window.innerHeight}:${reduced ? 'reduce' : 'normal'}`;
  }

  async function refineVisibilityEdge(scene, low, high, entering, threshold) {
    let left = clamp(low);
    let right = clamp(high);
    for (let i = 0; i < 8; i += 1) {
      const mid = (left + right) / 2;
      await setDocumentProgress(mid);
      const visible = opacityOf(scene) >= threshold;
      if (entering) {
        if (visible) right = mid;
        else left = mid;
      } else if (visible) {
        left = mid;
      } else {
        right = mid;
      }
    }
    return entering ? right : left;
  }

  async function discoverSceneBounds() {
    if (reduced) return null;
    const cacheKey = currentBoundsKey();
    if (boundsCache && boundsCacheKey === cacheKey) return boundsCache;

    const originalProgress = documentProgress();
    const sampleCount = 120;
    const threshold = 0.06;
    const samples = [];

    for (let i = 0; i <= sampleCount; i += 1) {
      const progress = i / sampleCount;
      await setDocumentProgress(progress);
      samples.push({
        progress,
        opacities: scenes.map(scene => opacityOf(scene))
      });
    }

    const result = {};
    for (const scene of scenes) {
      const index = scenes.indexOf(scene);
      const visibleSamples = samples.filter(sample => sample.opacities[index] >= threshold);
      if (!visibleSamples.length) continue;

      let start = visibleSamples[0].progress;
      let end = visibleSamples[visibleSamples.length - 1].progress;
      const step = 1 / sampleCount;

      if (start > 0) {
        start = await refineVisibilityEdge(scene, Math.max(0, start - step), start, true, threshold);
      }
      if (end < 1) {
        end = await refineVisibilityEdge(scene, end, Math.min(1, end + step), false, threshold);
      }

      result[scene.dataset.scene] = { start, end };
    }

    await setDocumentProgress(originalProgress);
    boundsCache = result;
    boundsCacheKey = cacheKey;
    return result;
  }

  async function setSceneProgress(sceneId, progress) {
    const scene = sceneFor(sceneId);
    if (reduced) {
      scene.scrollIntoView({ block: 'start', behavior: 'auto' });
      await flushFrames(3);
      return { scene: scene.dataset.scene, progress: 0, reduced: true };
    }

    const bounds = await discoverSceneBounds();
    const bound = bounds?.[scene.dataset.scene];
    if (!bound) throw new Error(`Visible range unavailable for scene ${sceneId}`);

    const local = clamp(progress);
    const target = mix(bound.start, bound.end, local);
    await setDocumentProgress(target);
    await waitForVisualSettle(scene.dataset.scene);
    return { scene: scene.dataset.scene, progress: local, documentProgress: target, reduced: false };
  }

  async function goToScene(sceneId) {
    return setSceneProgress(sceneId, 0.5);
  }

  const checkpointDefinitions = {
    'intro.settled': {
      scene: 'intro',
      range: [0, 0.42],
      prefer: 'first',
      score: scene => opacityOf(scene.querySelector('.scene-content'))
    },

    'commerce.checkout-event': {
      scene: 'commerce',
      range: [0.04, 0.42],
      score: scene => opacityOf(scene.querySelector('.commerce-transition-checkout'))
    },
    'commerce.quiet-after-checkout': {
      scene: 'commerce',
      range: [0.22, 0.52],
      score: scene => {
        const words = [...scene.querySelectorAll('.commerce-transition-word')];
        const loudestWord = Math.max(0, ...words.map(opacityOf));
        const checkout = opacityOf(scene.querySelector('.commerce-phone-checkout'));
        return checkout * (1 - loudestWord);
      }
    },
    'commerce.expired-promo': {
      scene: 'commerce',
      range: [0.34, 0.68],
      score: scene => opacityOf(scene.querySelector('.commerce-transition-expired'))
    },
    'commerce.unavailable': {
      scene: 'commerce',
      range: [0.58, 0.86],
      score: scene => opacityOf(scene.querySelector('.commerce-transition-unavailable'))
    },
    'commerce.final-settled': {
      scene: 'commerce',
      range: [0.72, 1],
      prefer: 'last',
      score: scene => {
        const words = [...scene.querySelectorAll('.commerce-transition-word')];
        const loudestWord = Math.max(0, ...words.map(opacityOf));
        const unavailable = opacityOf(scene.querySelector('.commerce-phone-unavailable'));
        return unavailable * (1 - loudestWord);
      }
    },

    'nocode.yaml-readable': {
      scene: 'nocode',
      range: [0.08, 0.40],
      prefer: 'first',
      score: scene => {
        const runner = opacityOf(scene.querySelector('.nocode-runner'));
        const steps = [...scene.querySelectorAll('.nocode-step')];
        const highlight = Math.max(0, ...steps.map(backgroundAlpha));
        return (1 - runner) * (1 - highlight);
      }
    },
    'nocode.execution': {
      scene: 'nocode',
      range: [0.30, 0.72],
      score: scene => {
        const steps = [...scene.querySelectorAll('.nocode-step')];
        return Math.max(0, ...steps.map(backgroundAlpha));
      }
    },
    'nocode.result-hold': {
      scene: 'nocode',
      range: [0.64, 1],
      prefer: 'last',
      score: scene => opacityOf(scene.querySelector('.nocode-runner'))
    },

    'social.product': {
      scene: 'social',
      range: [0.04, 0.38],
      prefer: 'first',
      score: scene => {
        const product = opacityOf(scene.querySelector('.social-product-initial,.social-product'));
        const finalPhone = opacityOf(scene.querySelector('.social-final-phone'));
        return product * (1 - finalPhone);
      }
    },
    'social.database': {
      scene: 'social',
      range: [0.24, 0.62],
      score: scene => Math.max(
        opacityOf(scene.querySelector('.social-db-heading')),
        opacityOf(scene.querySelector('.social-db-icon')),
        opacityOf(scene.querySelector('.social-db'))
      )
    },
    'social.web': {
      scene: 'social',
      range: [0.42, 0.78],
      score: scene => Math.max(
        opacityOf(scene.querySelector('.social-web-heading')),
        opacityOf(scene.querySelector('.social-e2e'))
      )
    },
    'social.final-phone': {
      scene: 'social',
      range: [0.68, 1],
      prefer: 'last',
      score: scene => opacityOf(scene.querySelector('.social-final-phone,.social-mobile-log'))
    },

    'cuesheet.workspace': {
      scene: 'cuesheet',
      range: [0.04, 0.38],
      prefer: 'first',
      score: scene => opacityOf(scene.querySelector('.cue-workspace'))
    },
    'cuesheet.conflict': {
      scene: 'cuesheet',
      range: [0.28, 0.66],
      score: scene => opacityOf(scene.querySelector('.cue-conflict'))
    },
    'cuesheet.review': {
      scene: 'cuesheet',
      range: [0.54, 1],
      prefer: 'last',
      score: scene => opacityOf(scene.querySelector('.cue-review'))
    },

    'dca.early-contribution': {
      scene: 'dca',
      range: [0.12, 0.50],
      score: scene => {
        const rows = [...scene.querySelectorAll('.audit-row')].slice(0, 3);
        const content = opacityOf(scene.querySelector('.scene-content'));
        return Math.max(0, ...rows.map(opacityOf)) * content;
      }
    },
    'dca.phrased-hold': {
      scene: 'dca',
      range: [0.24, 0.56],
      score: scene => {
        const rows = [...scene.querySelectorAll('.audit-row')];
        return opacityOf(rows[2]) * opacityOf(scene.querySelector('.scene-content'));
      }
    },
    'dca.late-contribution': {
      scene: 'dca',
      range: [0.48, 0.78],
      score: scene => {
        const rows = [...scene.querySelectorAll('.audit-row')];
        return Math.max(opacityOf(rows[5]), opacityOf(rows[6]));
      }
    },
    'dca.scanner-handoff': {
      scene: 'dca',
      range: [0.68, 0.92],
      score: scene => opacityOf(scene.querySelector('.audit-result-scan'))
    },
    'dca.pass': {
      scene: 'dca',
      range: [0.78, 1],
      prefer: 'last',
      score: scene => opacityOf(scene.querySelector('.audit-result-pass'))
    },

    'outro.settled': {
      scene: 'outro',
      range: [0.52, 1],
      prefer: 'last',
      score: scene => opacityOf(scene) * opacityOf(scene.querySelector('.scene-content'))
    }
  };

  function normalizeCheckpoint(checkpointId) {
    if (checkpointDefinitions[checkpointId]) return checkpointId;
    if (checkpointId.endsWith('.reduced')) {
      const sceneName = checkpointId.slice(0, -'.reduced'.length);
      if (sceneIds[sceneName] !== undefined) return checkpointId;
    }
    throw new Error(`Unknown checkpoint: ${checkpointId}`);
  }

  async function searchCheckpoint(definition) {
    const scene = sceneFor(definition.scene);
    const bounds = await discoverSceneBounds();
    const bound = bounds?.[scene.dataset.scene];
    if (!bound) throw new Error(`Visible range unavailable for checkpoint scene ${definition.scene}`);

    const [rangeStart, rangeEnd] = definition.range || [0, 1];
    const sampleCount = 28;
    let best = null;

    for (let i = 0; i <= sampleCount; i += 1) {
      const local = mix(rangeStart, rangeEnd, i / sampleCount);
      const progress = mix(bound.start, bound.end, local);
      await setDocumentProgress(progress);
      const score = clamp(Number(definition.score(scene)) || 0);

      if (!best || score > best.score + 0.0005) {
        best = { score, local, progress };
      } else if (Math.abs(score - best.score) <= 0.0005) {
        if (definition.prefer === 'last' && local > best.local) best = { score, local, progress };
        if (definition.prefer === 'first' && local < best.local) best = { score, local, progress };
      }
    }

    if (!best) throw new Error(`Unable to resolve checkpoint for ${definition.scene}`);
    await setDocumentProgress(best.progress);
    return { ...best, scene: scene.dataset.scene };
  }

  function relevantStyleNodes(scene) {
    const selectors = [
      '.scene-content',
      '.scene-object',
      '.nocode-step',
      '.nocode-runner',
      '.commerce-transition-word',
      '.commerce-phone-screen img',
      '.social-final-phone',
      '.social-layer-heading',
      '.social-db-icon',
      '.cue-frame',
      '.cue-phone-manager',
      '.cue-phone-cast',
      '.audit-row',
      '.audit-result',
      '.audit-result-pass',
      '.audit-result-scan'
    ];
    return [scene, ...scene.querySelectorAll(selectors.join(','))];
  }

  function roundedStyleValue(value) {
    return String(value).replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi, token => {
      const number = Number(token);
      return Number.isFinite(number) ? String(Math.round(number * 1000) / 1000) : token;
    });
  }

  function visualSignature(scene) {
    return relevantStyleNodes(scene).map(node => {
      const style = getComputedStyle(node);
      return [
        node.className || node.tagName,
        roundedStyleValue(style.opacity),
        roundedStyleValue(style.transform),
        roundedStyleValue(style.filter),
        roundedStyleValue(style.scale),
        roundedStyleValue(style.left),
        roundedStyleValue(style.top),
        roundedStyleValue(style.backgroundColor),
        roundedStyleValue(style.boxShadow)
      ].join('|');
    }).join('\n');
  }

  async function waitForVisualSettle(sceneId, options = {}) {
    const scene = sceneFor(sceneId);
    const stableFramesRequired = options.stableFrames ?? 4;
    const timeoutMs = options.timeoutMs ?? 1600;
    const started = performance.now();
    let stableFrames = 0;
    let previous = '';

    await flushFrames(2);

    while (performance.now() - started < timeoutMs) {
      await frame();
      const signature = visualSignature(scene);
      if (signature === previous) stableFrames += 1;
      else stableFrames = 0;
      previous = signature;
      if (stableFrames >= stableFramesRequired) {
        return { settled: true, stableFrames, elapsedMs: performance.now() - started };
      }
    }

    return { settled: false, stableFrames, elapsedMs: performance.now() - started };
  }

  async function goToCheckpoint(checkpointId) {
    const normalized = normalizeCheckpoint(checkpointId);

    if (normalized.endsWith('.reduced')) {
      const sceneName = normalized.slice(0, -'.reduced'.length);
      if (!reduced) throw new Error(`${normalized} requires prefers-reduced-motion: reduce`);
      const result = await goToScene(sceneName);
      return { checkpoint: normalized, ...result };
    }

    const definition = checkpointDefinitions[normalized];
    if (reduced) {
      const result = await goToScene(definition.scene);
      return { checkpoint: normalized, ...result };
    }

    const resolved = await searchCheckpoint(definition);
    const settle = await waitForVisualSettle(resolved.scene);
    return {
      checkpoint: normalized,
      scene: resolved.scene,
      sceneProgress: resolved.local,
      documentProgress: resolved.progress,
      score: resolved.score,
      settle
    };
  }

  function getState() {
    return {
      enabled: true,
      reducedMotion: reduced,
      locale: html.lang,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      documentProgress: documentProgress(),
      sceneOpacities: Object.fromEntries(
        scenes.map(scene => [scene.dataset.scene, opacityOf(scene)])
      ),
      checkpoints: Object.keys(checkpointDefinitions),
      scrollBehaviorOverride: html.style.scrollBehavior
    };
  }

  async function ready() {
    if (document.fonts?.ready) await document.fonts.ready;
    const assetsReady = await waitForAssets();
    await flushFrames(4);
    return { assetsReady, ...getState() };
  }

  const api = Object.freeze({
    version: 1,
    ready,
    setLanguage,
    goToScene,
    setSceneProgress,
    goToCheckpoint,
    waitForVisualSettle,
    getState,
    sceneIds: Object.freeze({ ...sceneIds }),
    checkpointIds: Object.freeze(Object.keys(checkpointDefinitions))
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

  window.dispatchEvent(new CustomEvent('portfolio-test-ready', { detail: { version: api.version } }));
})();
