(() => {
  if (!window.matchMedia('(max-width: 760px)').matches) return;
  if (document.getElementById('mobile-fallback')) return;

  const html = document.documentElement;
  const params = new URLSearchParams(window.location.search);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const testMode = params.get('uiux-test') === '1';
  const TEST_TIME_MS = 6400;
  const REDUCED_TIME_MS = 0;
  const PROFILE_AVATAR = 'https://avatars.githubusercontent.com/u/100585900?v=4';

  const shaderState = Object.freeze({
    speed: 1.0,
    leftHeight: 1.0,
    rightHeight: 1.0,
    randomness: 0.0,
    density: 1.0,
    glow: 1.0
  });

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
    html[data-presentation="mobile-fallback"]{background:#030712;scroll-behavior:auto}
    html[data-presentation="mobile-fallback"] body{margin:0;overflow:hidden;background:#030712}

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
      background:#030712;
      color:#f6f0e7;
    }
    .mobile-fallback[hidden]{display:none!important}

    .mobile-fluid-blur,
    .mobile-fluid-canvas{
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      pointer-events:none;
    }
    .mobile-fluid-blur{
      z-index:0;
      filter:blur(72px) saturate(1.12);
      opacity:.52;
      transform:scale(1.06);
      transform-origin:center;
    }
    .mobile-fluid-canvas{
      z-index:1;
      display:block;
      opacity:.98;
    }

    .mobile-fluid-fallback{
      display:none;
      position:absolute;
      inset:-24px;
      z-index:1;
      pointer-events:none;
      filter:blur(24px) saturate(1.12);
      background:
        radial-gradient(75% 18% at 50% 0%,rgba(66,133,245,.78),rgba(234,67,53,.50) 34%,transparent 72%),
        radial-gradient(21% 66% at 100% 50%,rgba(251,188,4,.70),rgba(52,168,83,.44) 38%,transparent 74%),
        radial-gradient(75% 18% at 50% 100%,rgba(52,168,83,.68),rgba(66,133,245,.44) 36%,transparent 72%),
        radial-gradient(21% 66% at 0% 50%,rgba(234,67,53,.68),rgba(251,188,4,.42) 38%,transparent 74%);
    }
    .mobile-fallback.webgl-fallback .mobile-fluid-fallback{display:block}
    .mobile-fallback.webgl-fallback .mobile-fluid-blur,
    .mobile-fallback.webgl-fallback .mobile-fluid-canvas{display:none}

    .mobile-vignette{
      position:absolute;
      inset:0;
      z-index:2;
      pointer-events:none;
      background:radial-gradient(ellipse at 50% 49%,rgba(3,7,18,.34) 0%,rgba(3,7,18,.20) 40%,rgba(3,7,18,0) 72%);
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

    .mobile-center{
      flex:1 1 auto;
      min-height:0;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:15px;
      padding:20px 0 16px;
    }

    .mobile-profile{
      display:block;
      width:112px;
      height:112px;
      border-radius:50%;
      object-fit:cover;
      border:1px solid rgba(255,255,255,.18);
      box-shadow:0 18px 56px rgba(0,0,0,.46),0 0 0 1px rgba(255,255,255,.035);
      background:#0b0b0d;
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
      .mobile-center{gap:11px;padding:12px 0 10px}
      .mobile-profile{width:86px;height:86px}
      .mobile-message{font-size:.87rem;line-height:1.36}
      html[lang^="zh"] .mobile-message{font-size:.88rem;line-height:1.52}
      .mobile-github{font-size:.9rem}
    }

    @media(max-width:350px){
      .mobile-fallback-inner{padding-inline:18px}
      .mobile-title{font-size:clamp(3.65rem,19vw,4.75rem)}
      html[lang^="zh"] .mobile-title{font-size:clamp(3rem,15.6vw,4rem)}
      .mobile-profile{width:96px;height:96px}
      .mobile-message{font-size:.9rem}
    }
  `;
  document.head.appendChild(style);

  const fallback = document.createElement('section');
  fallback.className = 'mobile-fallback';
  fallback.id = 'mobile-fallback';
  fallback.setAttribute('aria-labelledby', 'mobile-fallback-title');
  fallback.innerHTML = `
    <canvas class="mobile-fluid-blur" id="mobile-fluid-blur" aria-hidden="true"></canvas>
    <canvas class="mobile-fluid-canvas" id="mobile-fluid-canvas" aria-hidden="true"></canvas>
    <div class="mobile-fluid-fallback" aria-hidden="true"></div>
    <div class="mobile-vignette" aria-hidden="true"></div>
    <div class="mobile-fallback-inner">
      <h1 class="mobile-title" id="mobile-fallback-title" data-mobile-copy="title"></h1>
      <div class="mobile-center">
        <img class="mobile-profile" src="${PROFILE_AVATAR}" alt="CTWalk GitHub profile" decoding="async" referrerpolicy="no-referrer">
        <a class="mobile-github" href="https://github.com/CTWalk" target="_blank" rel="noreferrer" data-mobile-copy="github"></a>
      </div>
      <p class="mobile-message" data-mobile-copy="message"></p>
    </div>
  `;

  const main = document.querySelector('main');
  if (main) main.insertAdjacentElement('beforebegin', fallback);
  else document.body.appendChild(fallback);

  const canvas = document.getElementById('mobile-fluid-canvas');
  const blurCanvas = document.getElementById('mobile-fluid-blur');
  const blurCtx = blurCanvas?.getContext('2d', { alpha: true }) || null;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  const gl = canvas
    ? (canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: true,
        powerPreference: 'low-power'
      }) || canvas.getContext('experimental-webgl'))
    : null;

  const vertexShaderSource = `
    attribute vec2 position;
    varying vec2 vUv;

    void main() {
      vUv = position * 0.5 + 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision highp float;

    varying vec2 vUv;

    uniform float uTime;
    uniform float uSpeed;
    uniform float uLeftHeight;
    uniform float uRightHeight;
    uniform float uRandomness;
    uniform float uDensity;
    uniform float uGlow;

    float wave(vec2 p, float frequency, float speed, float offset) {
      return sin(p.x * frequency + uTime * speed + offset)
        * cos(p.y * frequency + uTime * speed * 0.9 + offset);
    }

    float wrappedDistance(float value, float center) {
      float direct = abs(value - center);
      return min(direct, 1.0 - direct);
    }

    float colorWeight(float value, float center) {
      return 1.0 - smoothstep(0.10, 0.40, wrappedDistance(value, center));
    }

    vec3 fluidEdge(vec2 uv, float phase) {
      vec2 fluidUv = uv * vec2(3.0 * uDensity, 3.5);

      float warp1 = wave(fluidUv, 2.5, 1.5 * uSpeed, phase * 6.2831853);
      float warp2 = wave(
        fluidUv + vec2(warp1 * 0.3, 0.0),
        4.8,
        2.0 * uSpeed,
        1.8 + phase * 4.0
      );
      float warp3 = wave(
        fluidUv - vec2(0.0, warp2 * 0.2),
        7.2,
        2.5 * uSpeed,
        3.4 + phase * 5.0
      );

      float combinedWarp =
        warp1 * 0.5 +
        warp2 * 0.35 +
        warp3 * 0.15;

      vec3 colBlue   = vec3(0.26, 0.52, 0.96);
      vec3 colRed    = vec3(0.92, 0.26, 0.21);
      vec3 colYellow = vec3(0.98, 0.74, 0.02);
      vec3 colGreen  = vec3(0.20, 0.66, 0.33);

      float xFactor = fract(uv.x + phase + combinedWarp * 0.15);

      float wBlue   = colorWeight(xFactor, 0.125);
      float wRed    = colorWeight(xFactor, 0.375);
      float wYellow = colorWeight(xFactor, 0.625);
      float wGreen  = colorWeight(xFactor, 0.875);

      float totalWeight = wBlue + wRed + wYellow + wGreen;
      if (totalWeight > 0.0) {
        wBlue   /= totalWeight;
        wRed    /= totalWeight;
        wYellow /= totalWeight;
        wGreen  /= totalWeight;
      }

      vec3 colorMix =
        colBlue   * wBlue +
        colRed    * wRed +
        colYellow * wYellow +
        colGreen  * wGreen;

      float baseHeight = mix(uLeftHeight, uRightHeight, uv.x);
      float smoothBumps =
        sin(uv.x * 4.5 + uTime * 1.1 + phase * 5.0) * 0.35 +
        cos(uv.x * 10.0 - uTime * 1.8 + phase * 3.0) * 0.15 +
        sin(uv.x * 18.0 + uTime * 2.5 + phase * 7.0) * 0.06;

      float heightProfile =
        (baseHeight + smoothBumps * uRandomness) * uGlow;
      heightProfile = max(0.05, heightProfile);

      float heightFalloff =
        1.0 - smoothstep(0.0, 0.58 * heightProfile, uv.y);

      float ambientGlow =
        pow(max(0.0, 1.0 - uv.y), 2.5) * heightProfile;

      float intensity =
        heightFalloff * 0.85 +
        ambientGlow * 0.15;

      return colorMix * intensity;
    }

    void main() {
      vec2 uv = vUv;

      // The supplied CodePen renders one bottom fluid bar. Here the same
      // shader language is rotated/mirrored onto all four viewport edges.
      vec3 bottom = fluidEdge(vec2(uv.x, uv.y / 0.18), 0.00);
      vec3 right  = fluidEdge(vec2(uv.y, (1.0 - uv.x) / 0.15), 0.25);
      vec3 top    = fluidEdge(vec2(1.0 - uv.x, (1.0 - uv.y) / 0.18), 0.50);
      vec3 left   = fluidEdge(vec2(1.0 - uv.y, uv.x / 0.15), 0.75);

      vec3 finalColor = bottom + right + top + left;
      finalColor = min(finalColor, vec3(1.0));

      float luminance = max(finalColor.r, max(finalColor.g, finalColor.b));
      float grain = fract(
        sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453
      );
      finalColor += vec3(grain * 0.012 * luminance);

      float alpha = clamp(luminance * 1.18, 0.0, 1.0);
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  let program = null;
  let uniforms = null;
  let width = 0;
  let height = 0;
  let animationFrame = 0;
  let running = false;
  let currentTimeMs = reducedMotion ? REDUCED_TIME_MS : 0;
  let lastFrameMs = null;

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

  function createShader(type, source) {
    if (!gl) return null;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('[mobile-fallback] WebGL shader compile failed:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function initWebGL() {
    if (!gl) return false;

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return false;

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('[mobile-fallback] WebGL program link failed:', gl.getProgramInfoLog(program));
      return false;
    }

    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    uniforms = {
      time: gl.getUniformLocation(program, 'uTime'),
      speed: gl.getUniformLocation(program, 'uSpeed'),
      leftHeight: gl.getUniformLocation(program, 'uLeftHeight'),
      rightHeight: gl.getUniformLocation(program, 'uRightHeight'),
      randomness: gl.getUniformLocation(program, 'uRandomness'),
      density: gl.getUniformLocation(program, 'uDensity'),
      glow: gl.getUniformLocation(program, 'uGlow')
    };

    gl.useProgram(program);
    return true;
  }

  const webglReady = initWebGL();
  if (!webglReady) fallback.classList.add('webgl-fallback');

  function copyBlur() {
    if (!blurCtx || !blurCanvas || !canvas || !webglReady) return;
    blurCtx.clearRect(0, 0, blurCanvas.width, blurCanvas.height);
    blurCtx.drawImage(canvas, 0, 0, blurCanvas.width, blurCanvas.height);
  }

  function draw(timeMs = 0) {
    if (!gl || !program || !uniforms || !webglReady) return;

    currentTimeMs = Number(timeMs) || 0;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);

    gl.uniform1f(uniforms.time, currentTimeMs * 0.001);
    gl.uniform1f(uniforms.speed, shaderState.speed);
    gl.uniform1f(uniforms.leftHeight, shaderState.leftHeight);
    gl.uniform1f(uniforms.rightHeight, shaderState.rightHeight);
    gl.uniform1f(uniforms.randomness, shaderState.randomness);
    gl.uniform1f(uniforms.density, shaderState.density);
    gl.uniform1f(uniforms.glow, shaderState.glow);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    copyBlur();
  }

  function resize() {
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);

    if (canvas) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    if (blurCanvas) {
      blurCanvas.width = Math.max(1, Math.round((width * dpr) / 8));
      blurCanvas.height = Math.max(1, Math.round((height * dpr) / 8));
      blurCanvas.style.width = `${width}px`;
      blurCanvas.style.height = `${height}px`;
    }

    draw(currentTimeMs);
  }

  function animate(now) {
    if (!running) return;

    if (lastFrameMs == null) lastFrameMs = now;
    const delta = Math.min(50, Math.max(0, now - lastFrameMs));
    lastFrameMs = now;
    currentTimeMs += delta;

    draw(currentTimeMs);
    animationFrame = requestAnimationFrame(animate);
  }

  function start() {
    if (!webglReady || reducedMotion || testMode || running) return getState();
    running = true;
    lastFrameMs = null;
    animationFrame = requestAnimationFrame(animate);
    return getState();
  }

  function stop() {
    running = false;
    lastFrameMs = null;
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
      timeMs: currentTimeMs,
      canvasAvailable: Boolean(webglReady),
      webglAvailable: Boolean(webglReady),
      blurAvailable: Boolean(blurCtx),
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

  resize();
  if (webglReady) {
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