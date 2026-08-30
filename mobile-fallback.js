(() => {
  if (!window.matchMedia('(max-width: 760px)').matches) return;
  if (document.getElementById('mobile-fallback')) return;

  const html = document.documentElement;
  const params = new URLSearchParams(window.location.search);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const testMode = params.get('uiux-test') === '1';
  const TEST_TIME_MS = 6400;
  const REDUCED_TIME_MS = 0;

  const copy = {
    en: {
      title: 'Designed for\ndesktop.',
      message: 'This portfolio is designed as a desktop-first interactive experience. For the full project walkthrough, please view it on a desktop browser.',
      github: 'Open GitHub ↗'
    },
    zh: {
      title: '為桌面互動\n而設計',
      message: '此作品集以桌面互動體驗為主要呈現方式。建議使用電腦版瀏覽器，以完整查看專案流程、動態展示與設計細節。',
      github: '查看 GitHub ↗'
    }
  };

  const style = document.createElement('style');
  style.dataset.mobileFallback = 'true';
  style.textContent = `
    html[data-presentation="mobile-fallback"]{background:#040405;scroll-behavior:auto}
    html[data-presentation="mobile-fallback"] body{margin:0;overflow:hidden;background:#040405}

    html[data-presentation="mobile-fallback"] .nav{z-index:90;background:transparent;border:0;box-shadow:none}
    html[data-presentation="mobile-fallback"] .nav-inner{width:calc(100% - 40px);justify-content:flex-end}
    html[data-presentation="mobile-fallback"] .brand,
    html[data-presentation="mobile-fallback"] .github{display:none!important}
    html[data-presentation="mobile-fallback"] .lang-switch{gap:12px}
    html[data-presentation="mobile-fallback"] .lang-switch button{font-size:.78rem;font-weight:650;color:rgba(255,255,255,.68)}
    html[data-presentation="mobile-fallback"] .lang-switch button.active{color:#fff}

    .mobile-fallback{
      position:fixed;
      inset:0;
      z-index:70;
      display:block;
      width:100%;
      height:100vh;
      height:100svh;
      overflow:hidden;
      isolation:isolate;
      background:radial-gradient(ellipse at 50% 48%,#161116 0%,#09080b 37%,#040405 72%);
      color:#f6f0e7;
    }
    .mobile-fallback[hidden]{display:none!important}
    .mobile-aurora{position:absolute;inset:0;z-index:0;width:100%;height:100%;pointer-events:none}

    .mobile-edge-static{
      position:absolute;
      inset:-24px;
      z-index:0;
      pointer-events:none;
      opacity:.98;
      filter:blur(13px) saturate(1.22);
      background:
        radial-gradient(78% 23% at 53% 0%,rgba(255,91,29,.95) 0%,rgba(255,133,31,.54) 31%,transparent 69%),
        radial-gradient(28% 64% at 0% 43%,rgba(255,38,150,.90) 0%,rgba(170,54,255,.52) 35%,transparent 72%),
        radial-gradient(30% 61% at 100% 59%,rgba(48,255,188,.82) 0%,rgba(39,207,255,.54) 38%,transparent 74%),
        radial-gradient(76% 24% at 55% 100%,rgba(35,215,255,.96) 0%,rgba(100,78,255,.57) 36%,transparent 70%);
    }

    .mobile-rim{position:absolute;z-index:2;pointer-events:none;opacity:.96;filter:blur(6px);mix-blend-mode:screen}
    .mobile-rim-top{
      top:-5px;left:-8%;width:116%;height:18px;
      background:linear-gradient(90deg,transparent 0%,#ff2f9c 13%,#ff5128 39%,#ff9b27 66%,#eaff59 84%,transparent 100%);
      box-shadow:0 0 24px 9px rgba(255,93,38,.34);
    }
    .mobile-rim-left{
      top:13%;left:-6px;width:18px;height:70%;
      background:linear-gradient(180deg,transparent 0%,#ff347f 15%,#c536ff 46%,#6554ff 73%,#36c8ff 100%);
      box-shadow:0 0 25px 10px rgba(218,50,255,.30);
    }
    .mobile-rim-right{
      top:18%;right:-6px;width:18px;height:67%;
      background:linear-gradient(180deg,#eeff67 0%,#64ffad 34%,#2dd9ff 70%,transparent 100%);
      box-shadow:0 0 25px 10px rgba(54,231,203,.28);
    }
    .mobile-rim-bottom{
      bottom:-5px;left:-8%;width:116%;height:18px;
      background:linear-gradient(90deg,transparent 0%,#8758ff 15%,#396eff 37%,#2fd9ff 65%,#61ffc3 86%,transparent 100%);
      box-shadow:0 0 26px 10px rgba(45,205,255,.34);
    }

    .mobile-vignette{
      position:absolute;
      inset:0;
      z-index:1;
      pointer-events:none;
      background:
        radial-gradient(ellipse at 50% 47%,rgba(0,0,0,0) 0%,rgba(0,0,0,.10) 42%,rgba(0,0,0,.46) 83%),
        linear-gradient(to bottom,rgba(0,0,0,.04),rgba(0,0,0,.20));
    }

    .mobile-fallback-inner{
      position:relative;
      z-index:4;
      display:flex;
      flex-direction:column;
      width:100%;
      height:100%;
      padding:calc(70px + max(24px,env(safe-area-inset-top))) 22px max(30px,env(safe-area-inset-bottom));
    }

    .mobile-title{
      margin:0;
      max-width:6.1ch;
      color:#f6eee3;
      font-size:clamp(4.3rem,20.6vw,6.15rem);
      font-weight:700;
      line-height:.84;
      letter-spacing:-.072em;
      white-space:pre-line;
      text-wrap:initial;
      text-shadow:0 16px 52px rgba(0,0,0,.34);
    }

    .mobile-bottom{
      margin-top:auto;
      display:grid;
      gap:22px;
      padding-bottom:2px;
    }

    .mobile-message{
      max-width:30ch;
      margin:0;
      color:rgba(248,242,234,.94);
      font-size:1rem;
      font-weight:590;
      line-height:1.44;
      letter-spacing:-.016em;
      text-wrap:pretty;
    }

    .mobile-github{
      width:max-content;
      color:#fff;
      text-decoration:none;
      font-size:1rem;
      font-weight:680;
      line-height:1.2;
      padding-bottom:4px;
      border-bottom:1px solid rgba(255,255,255,.60);
    }
    .mobile-github:focus-visible{outline:2px solid #fff;outline-offset:6px}

    html[lang^="zh"] .mobile-title{
      max-width:6.1em;
      font-family:"PingFang TC","Noto Sans TC","Microsoft JhengHei",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      font-size:clamp(3.65rem,17vw,5.1rem);
      font-weight:670;
      line-height:.97;
      letter-spacing:-.048em;
      word-break:keep-all;
    }
    html[lang^="zh"] .mobile-message{
      max-width:17em;
      font-size:1rem;
      font-weight:560;
      line-height:1.64;
      letter-spacing:.004em;
      line-break:strict;
    }

    @media(max-height:720px) and (max-width:760px){
      .mobile-fallback-inner{padding-top:80px;padding-bottom:20px}
      .mobile-title{font-size:clamp(3.75rem,18vw,5rem)}
      html[lang^="zh"] .mobile-title{font-size:clamp(3.15rem,15vw,4.2rem)}
      .mobile-bottom{gap:15px}
      .mobile-message{font-size:.87rem;line-height:1.36}
      html[lang^="zh"] .mobile-message{font-size:.88rem;line-height:1.52}
      .mobile-github{font-size:.9rem}
    }

    @media(max-width:350px){
      .mobile-fallback-inner{padding-inline:18px}
      .mobile-title{font-size:clamp(3.65rem,19vw,4.75rem)}
      html[lang^="zh"] .mobile-title{font-size:clamp(3rem,15.6vw,4rem)}
      .mobile-message{font-size:.9rem}
    }
  `;
  document.head.appendChild(style);

  const fallback = document.createElement('section');
  fallback.className = 'mobile-fallback';
  fallback.id = 'mobile-fallback';
  fallback.setAttribute('aria-labelledby', 'mobile-fallback-title');
  fallback.innerHTML = `
    <canvas class="mobile-aurora" id="mobile-aurora" aria-hidden="true"></canvas>
    <div class="mobile-edge-static" aria-hidden="true"></div>
    <div class="mobile-rim mobile-rim-top" aria-hidden="true"></div>
    <div class="mobile-rim mobile-rim-left" aria-hidden="true"></div>
    <div class="mobile-rim mobile-rim-right" aria-hidden="true"></div>
    <div class="mobile-rim mobile-rim-bottom" aria-hidden="true"></div>
    <div class="mobile-vignette" aria-hidden="true"></div>
    <div class="mobile-fallback-inner">
      <h1 class="mobile-title" id="mobile-fallback-title" data-mobile-copy="title"></h1>
      <div class="mobile-bottom">
        <p class="mobile-message" data-mobile-copy="message"></p>
        <a class="mobile-github" href="https://github.com/CTWalk" target="_blank" rel="noreferrer" data-mobile-copy="github"></a>
      </div>
    </div>
  `;

  const main = document.querySelector('main');
  if (main) main.insertAdjacentElement('beforebegin', fallback);
  else document.body.appendChild(fallback);

  const canvas = document.getElementById('mobile-aurora');
  const context = canvas?.getContext('2d', { alpha: true, desynchronized: true }) || null;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  let width = 0;
  let height = 0;
  let animationFrame = 0;
  let running = false;
  let currentTime = reducedMotion ? REDUCED_TIME_MS : TEST_TIME_MS;

  function selectedLocale() {
    return html.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  }

  function syncLanguage() {
    const strings = copy[selectedLocale()];
    fallback.querySelectorAll('[data-mobile-copy]').forEach(node => {
      const key = node.dataset.mobileCopy;
      if (strings[key]) node.textContent = strings[key];
    });
    return html.lang;
  }

  function bloom(x, y, radiusX, radiusY, rgb, alpha) {
    if (!context) return;
    context.save();
    context.translate(x, y);
    context.scale(Math.max(1, radiusX), Math.max(1, radiusY));
    const gradient = context.createRadialGradient(0, 0, 0, 0, 0, 1);
    gradient.addColorStop(0, `rgba(${rgb},${alpha})`);
    gradient.addColorStop(.24, `rgba(${rgb},${alpha * .66})`);
    gradient.addColorStop(.58, `rgba(${rgb},${alpha * .22})`);
    gradient.addColorStop(1, `rgba(${rgb},0)`);
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, 1, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  function glowLine(x1, y1, x2, y2, gradient, shadowColor, alpha, widthPx) {
    if (!context) return;
    context.save();
    context.globalAlpha = alpha;
    context.strokeStyle = gradient;
    context.lineWidth = widthPx;
    context.lineCap = 'round';
    context.shadowBlur = 24;
    context.shadowColor = shadowColor;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.restore();
  }

  function draw(t = 0) {
    if (!context) return;
    currentTime = Number(t) || 0;
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = 'lighter';

    const a = Math.sin(currentTime * .00012);
    const b = Math.cos(currentTime * .000095 + 1.7);
    const c = Math.sin(currentTime * .00008 + 3.2);

    bloom(width * (.50 + a * .10), height * -.015, width * .52, height * .16, '255,78,31', .82);
    bloom(width * -.01, height * (.43 + b * .10), width * .20, height * .37, '255,43,154', .72);
    bloom(width * .05, height * (.88 + c * .04), width * .27, height * .23, '116,75,255', .64);
    bloom(width * (.62 + b * .08), height * 1.01, width * .46, height * .17, '40,212,255', .82);
    bloom(width * 1.01, height * (.58 + a * .10), width * .19, height * .35, '62,255,185', .64);

    const top = context.createLinearGradient(0, 0, width, 0);
    top.addColorStop(0, 'rgba(255,47,156,0)');
    top.addColorStop(.14, '#ff2f9c');
    top.addColorStop(.42, '#ff5128');
    top.addColorStop(.68, '#ff9b27');
    top.addColorStop(.86, '#eaff59');
    top.addColorStop(1, 'rgba(234,255,89,0)');

    const bottom = context.createLinearGradient(0, 0, width, 0);
    bottom.addColorStop(0, 'rgba(135,88,255,0)');
    bottom.addColorStop(.16, '#8758ff');
    bottom.addColorStop(.42, '#396eff');
    bottom.addColorStop(.68, '#2fd9ff');
    bottom.addColorStop(.87, '#61ffc3');
    bottom.addColorStop(1, 'rgba(97,255,195,0)');

    const left = context.createLinearGradient(0, 0, 0, height);
    left.addColorStop(0, 'rgba(255,52,127,0)');
    left.addColorStop(.18, '#ff347f');
    left.addColorStop(.48, '#c536ff');
    left.addColorStop(.76, '#6554ff');
    left.addColorStop(1, 'rgba(54,200,255,0)');

    const right = context.createLinearGradient(0, 0, 0, height);
    right.addColorStop(0, 'rgba(238,255,103,0)');
    right.addColorStop(.18, '#eeff67');
    right.addColorStop(.45, '#64ffad');
    right.addColorStop(.74, '#2dd9ff');
    right.addColorStop(1, 'rgba(45,217,255,0)');

    const pulse = .88 + Math.sin(currentTime * .00018) * .07;
    glowLine(0, 1.5, width, 1.5, top, 'rgba(255,91,40,.95)', pulse, 3.2);
    glowLine(0, height - 1.5, width, height - 1.5, bottom, 'rgba(45,205,255,.95)', pulse, 3.2);
    glowLine(1.5, 0, 1.5, height, left, 'rgba(211,54,255,.90)', pulse * .92, 3.0);
    glowLine(width - 1.5, 0, width - 1.5, height, right, 'rgba(58,238,198,.88)', pulse * .92, 3.0);

    context.globalCompositeOperation = 'source-over';
  }

  function resize() {
    if (!canvas || !context) return;
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(currentTime);
  }

  function animate(now) {
    if (!running) return;
    draw(now);
    animationFrame = requestAnimationFrame(animate);
  }

  function start() {
    if (!context || reducedMotion || testMode || running) return getState();
    running = true;
    animationFrame = requestAnimationFrame(animate);
    return getState();
  }

  function stop() {
    running = false;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    return getState();
  }

  function setTime(timeMs) {
    stop();
    draw(Number(timeMs) || 0);
    return getState();
  }

  function getState() {
    return {
      active: true,
      presentation: 'mobile-fallback',
      locale: html.lang,
      reducedMotion,
      testMode,
      running,
      timeMs: currentTime,
      canvasAvailable: Boolean(context),
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  syncLanguage();
  const languageObserver = new MutationObserver(syncLanguage);
  languageObserver.observe(html, { attributes: true, attributeFilter: ['lang'] });

  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (!reducedMotion && !testMode) start();
  });

  if (context) {
    resize();
    if (reducedMotion) setTime(REDUCED_TIME_MS);
    else if (testMode) setTime(TEST_TIME_MS);
    else start();
  }

  const api = Object.freeze({
    syncLanguage,
    start,
    stop,
    setTime,
    getState,
    testTimeMs: TEST_TIME_MS,
    reducedTimeMs: REDUCED_TIME_MS
  });

  Object.defineProperty(window, '__mobileFallback', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: api
  });

  window.addEventListener('beforeunload', () => {
    stop();
    languageObserver.disconnect();
  }, { once: true });

  window.dispatchEvent(new CustomEvent('mobile-fallback-ready', { detail: getState() }));
})();