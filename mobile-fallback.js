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
      eyebrow: 'QA / SDET · INTERACTIVE PORTFOLIO',
      title: 'Designed for\ndesktop.',
      message: 'This portfolio is designed as a desktop-first interactive experience. For the full project walkthrough, please view it on a desktop browser.',
      mode: 'DESKTOP / FULL EXPERIENCE',
      github: 'GitHub ↗'
    },
    zh: {
      eyebrow: 'QA / SDET · 互動式作品集',
      title: '為桌面互動\n而設計',
      message: '此作品集以桌面互動體驗為主要呈現方式。建議使用電腦版瀏覽器，以完整查看專案流程、動態展示與設計細節。',
      mode: 'DESKTOP / 完整體驗',
      github: 'GitHub ↗'
    }
  };

  const style = document.createElement('style');
  style.dataset.mobileFallback = 'true';
  style.textContent = `
    html[data-presentation="mobile-fallback"]{background:#070708;scroll-behavior:auto}
    html[data-presentation="mobile-fallback"] body{margin:0;overflow:hidden;background:#070708}
    html[data-presentation="mobile-fallback"] .nav{z-index:90;background:linear-gradient(to bottom,rgba(7,7,8,.58),rgba(7,7,8,.10) 72%,transparent)}
    html[data-presentation="mobile-fallback"] .nav-inner{width:calc(100% - 36px)}
    html[data-presentation="mobile-fallback"] .brand{font-size:.88rem;font-weight:760;letter-spacing:-.02em}
    html[data-presentation="mobile-fallback"] .github{display:none}
    html[data-presentation="mobile-fallback"] .lang-switch{gap:11px}
    html[data-presentation="mobile-fallback"] .lang-switch button{font-size:.72rem}

    .mobile-fallback{position:fixed;inset:0;z-index:70;display:block;width:100%;height:100vh;height:100svh;overflow:hidden;isolation:isolate;background:radial-gradient(circle at 50% 44%,rgba(30,24,26,.54),rgba(7,7,8,.96) 58%),#070708;color:#f5eee4}
    .mobile-fallback[hidden]{display:none!important}
    .mobile-aurora{position:absolute;inset:0;z-index:0;width:100%;height:100%;pointer-events:none}
    .mobile-ambient-fallback{position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse at 52% -8%,rgba(255,91,36,.34),transparent 36%),radial-gradient(ellipse at -5% 42%,rgba(255,48,142,.22),transparent 34%),radial-gradient(ellipse at 104% 62%,rgba(68,255,190,.18),transparent 34%),radial-gradient(ellipse at 52% 106%,rgba(44,204,255,.30),transparent 36%)}
    .mobile-vignette{position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse at 50% 48%,rgba(3,3,4,.02) 0%,rgba(3,3,4,.14) 44%,rgba(3,3,4,.62) 88%),linear-gradient(to bottom,rgba(0,0,0,.02),rgba(0,0,0,.20))}
    .mobile-fallback-inner{position:relative;z-index:3;display:grid;grid-template-rows:auto minmax(0,1fr) auto;width:100%;height:100%;padding:calc(64px + max(24px,env(safe-area-inset-top))) 20px max(22px,env(safe-area-inset-bottom));gap:14px}
    .mobile-hero{position:relative;align-self:start;padding-top:3px}
    .mobile-eyebrow{margin:0 0 14px;color:rgba(245,238,228,.60);font:720 .62rem/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.105em;text-transform:uppercase}
    .mobile-title{margin:0;max-width:6.2ch;color:#f4ece1;font-size:clamp(4.05rem,19.6vw,5.85rem);font-weight:690;line-height:.86;letter-spacing:-.068em;white-space:pre-line;text-wrap:initial;text-shadow:0 10px 40px rgba(0,0,0,.16)}
    .mobile-index{position:absolute;right:1px;bottom:4px;color:rgba(245,238,228,.46);font:650 .62rem/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.08em}

    .mobile-object{position:relative;align-self:center;justify-self:center;width:min(76vw,304px);aspect-ratio:16/10;transform:perspective(880px) rotateX(4deg) rotateY(-7deg);transform-origin:center;border:1px solid rgba(255,255,255,.14);border-radius:22px;overflow:hidden;background:linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.012) 40%,rgba(0,0,0,.18));box-shadow:0 36px 96px rgba(0,0,0,.52),inset 0 1px 0 rgba(255,255,255,.075)}
    .mobile-object::before{content:"";position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,.045),transparent 27%,transparent 72%,rgba(255,255,255,.025));pointer-events:none}
    .mobile-object-grid{position:absolute;inset:0;opacity:.16;background-image:linear-gradient(rgba(255,255,255,.065) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.065) 1px,transparent 1px);background-size:27px 27px;mask-image:radial-gradient(circle at 52% 48%,#000 0%,rgba(0,0,0,.76) 36%,transparent 78%);-webkit-mask-image:radial-gradient(circle at 52% 48%,#000 0%,rgba(0,0,0,.76) 36%,transparent 78%)}
    .mobile-object-core{position:absolute;inset:17%;border:1px solid rgba(255,255,255,.07);border-radius:16px;background:radial-gradient(circle at 48% 45%,rgba(255,255,255,.038),transparent 54%),rgba(5,5,6,.28);box-shadow:inset 0 0 42px rgba(255,255,255,.018)}
    .mobile-object-label{position:absolute;left:15px;bottom:13px;color:rgba(245,238,228,.38);font:650 .54rem/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.09em}

    .mobile-footer{align-self:end;display:grid;gap:20px}
    .mobile-message{max-width:29ch;margin:0;color:rgba(246,240,232,.91);font-size:.87rem;font-weight:620;line-height:1.38;letter-spacing:-.013em;text-wrap:pretty}
    .mobile-meta{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;color:rgba(245,238,228,.50);font:650 .61rem/1.25 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.065em;text-transform:uppercase}
    .mobile-meta a{color:rgba(255,255,255,.90);text-decoration:none;border-bottom:1px solid rgba(255,255,255,.34);padding-bottom:2px}
    .mobile-meta a:focus-visible{outline:2px solid #fff;outline-offset:5px}

    html[lang^="zh"] .mobile-eyebrow{letter-spacing:.075em;text-transform:none}
    html[lang^="zh"] .mobile-title{max-width:6.2em;font-family:"PingFang TC","Noto Sans TC","Microsoft JhengHei",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:clamp(3.45rem,16.3vw,4.85rem);font-weight:660;line-height:.98;letter-spacing:-.045em;word-break:keep-all}
    html[lang^="zh"] .mobile-message{max-width:17em;font-size:.89rem;font-weight:560;line-height:1.62;letter-spacing:.006em;line-break:strict}
    html[lang^="zh"] .mobile-meta{text-transform:none;letter-spacing:.045em}

    @media(max-height:720px) and (max-width:760px){
      .mobile-fallback-inner{padding-top:78px;padding-bottom:17px;gap:8px}
      .mobile-eyebrow{margin-bottom:10px}
      .mobile-title{font-size:clamp(3.55rem,17vw,4.8rem)}
      html[lang^="zh"] .mobile-title{font-size:clamp(3.05rem,14.7vw,4.15rem)}
      .mobile-object{width:min(62vw,245px)}
      .mobile-footer{gap:13px}
      .mobile-message{font-size:.79rem;line-height:1.32}
      html[lang^="zh"] .mobile-message{font-size:.82rem;line-height:1.48}
    }

    @media(max-width:350px){
      .mobile-fallback-inner{padding-inline:17px}
      .mobile-title{font-size:clamp(3.55rem,18.5vw,4.7rem)}
      .mobile-object{width:min(72vw,270px)}
      .mobile-message{font-size:.82rem}
    }

    @media(prefers-reduced-motion:reduce){
      .mobile-fallback{scroll-behavior:auto}
    }
  `;
  document.head.appendChild(style);

  const fallback = document.createElement('section');
  fallback.className = 'mobile-fallback';
  fallback.id = 'mobile-fallback';
  fallback.setAttribute('aria-labelledby', 'mobile-fallback-title');
  fallback.innerHTML = `
    <canvas class="mobile-aurora" id="mobile-aurora" aria-hidden="true"></canvas>
    <div class="mobile-ambient-fallback" id="mobile-ambient-fallback" aria-hidden="true"></div>
    <div class="mobile-vignette" aria-hidden="true"></div>
    <div class="mobile-fallback-inner">
      <div class="mobile-hero">
        <p class="mobile-eyebrow" data-mobile-copy="eyebrow"></p>
        <h1 class="mobile-title" id="mobile-fallback-title" data-mobile-copy="title"></h1>
        <span class="mobile-index">01</span>
      </div>
      <div class="mobile-object" aria-hidden="true">
        <div class="mobile-object-grid"></div>
        <div class="mobile-object-core"></div>
        <span class="mobile-object-label" data-mobile-copy="mode"></span>
      </div>
      <div class="mobile-footer">
        <p class="mobile-message" data-mobile-copy="message"></p>
        <div class="mobile-meta">
          <span>CTWalk · QA / SDET</span>
          <a href="https://github.com/CTWalk" target="_blank" rel="noreferrer" data-mobile-copy="github"></a>
        </div>
      </div>
    </div>
  `;

  const main = document.querySelector('main');
  if (main) main.insertAdjacentElement('beforebegin', fallback);
  else document.body.appendChild(fallback);

  const canvas = document.getElementById('mobile-aurora');
  const staticAmbient = document.getElementById('mobile-ambient-fallback');
  const context = canvas?.getContext('2d', { alpha: true, desynchronized: true }) || null;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  let width = 0;
  let height = 0;
  let animationFrame = 0;
  let running = false;
  let currentTime = reducedMotion ? REDUCED_TIME_MS : TEST_TIME_MS;

  const sources = [
    { rgb: '255,74,34', phase: 0.0, side: 'top', alpha: .55, rx: .64, ry: .19 },
    { rgb: '255,47,145', phase: 1.6, side: 'left', alpha: .43, rx: .23, ry: .48 },
    { rgb: '126,76,255', phase: 2.8, side: 'bottom-left', alpha: .46, rx: .34, ry: .24 },
    { rgb: '43,207,255', phase: 4.0, side: 'bottom', alpha: .61, rx: .53, ry: .20 },
    { rgb: '71,255,190', phase: 5.1, side: 'right', alpha: .38, rx: .21, ry: .44 }
  ];

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

  function positionFor(source, t) {
    const slowA = Math.sin(t * .000115 + source.phase);
    const slowB = Math.cos(t * .000087 + source.phase * .73);
    switch (source.side) {
      case 'top': return { x: (.54 + slowA * .105) * width, y: (-.085 + slowB * .018) * height };
      case 'left': return { x: (-.065 + slowA * .018) * width, y: (.38 + slowB * .115) * height };
      case 'bottom-left': return { x: (.09 + slowA * .075) * width, y: (.965 + slowB * .045) * height };
      case 'bottom': return { x: (.66 + slowA * .13) * width, y: (1.055 + slowB * .022) * height };
      case 'right': return { x: (1.052 + slowA * .018) * width, y: (.61 + slowB * .125) * height };
      default: return { x: width / 2, y: height / 2 };
    }
  }

  function glow(source, t) {
    const { x, y } = positionFor(source, t);
    const rx = Math.max(1, source.rx * width);
    const ry = Math.max(1, source.ry * height);

    context.save();
    context.translate(x, y);
    context.scale(rx, ry);

    const gradient = context.createRadialGradient(0, 0, 0, 0, 0, 1);
    gradient.addColorStop(0, `rgba(${source.rgb},${source.alpha})`);
    gradient.addColorStop(.30, `rgba(${source.rgb},${source.alpha * .58})`);
    gradient.addColorStop(.67, `rgba(${source.rgb},${source.alpha * .17})`);
    gradient.addColorStop(1, `rgba(${source.rgb},0)`);
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, 1, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  function draw(t = 0) {
    currentTime = Number.isFinite(t) ? t : 0;
    if (!context || !width || !height) return;

    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = 'screen';
    for (const source of sources) glow(source, currentTime);
    context.globalCompositeOperation = 'source-over';

    const rim = context.createLinearGradient(0, 0, width, height);
    rim.addColorStop(0, 'rgba(255,255,255,.052)');
    rim.addColorStop(.5, 'rgba(255,255,255,0)');
    rim.addColorStop(1, 'rgba(255,255,255,.035)');
    context.strokeStyle = rim;
    context.lineWidth = 1;
    context.strokeRect(.5, .5, width - 1, height - 1);
  }

  function animate(t) {
    if (!running) return;
    draw(t);
    animationFrame = requestAnimationFrame(animate);
  }

  function stop() {
    running = false;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }

  function start() {
    if (reducedMotion || testMode || !context || running) return;
    running = true;
    animationFrame = requestAnimationFrame(animate);
  }

  function setTime(timeMs = TEST_TIME_MS) {
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
      animated: running,
      timeMs: currentTime,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      canvas: Boolean(context)
    };
  }

  const languageObserver = new MutationObserver(syncLanguage);
  languageObserver.observe(html, { attributes: true, attributeFilter: ['lang'] });

  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  syncLanguage();
  if (context) {
    staticAmbient.hidden = true;
    resize();
    if (reducedMotion) setTime(REDUCED_TIME_MS);
    else if (testMode) setTime(TEST_TIME_MS);
    else start();
  }

  const api = Object.freeze({
    version: 1,
    syncLanguage,
    setTime,
    start,
    stop,
    resize,
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

  window.dispatchEvent(new CustomEvent('mobile-fallback-ready', { detail: getState() }));
})();