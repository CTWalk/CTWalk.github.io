(() => {
  const scene = document.querySelector('.scene[data-scene="3"]');
  const showcase = scene?.querySelector('.social-showcase');
  const experience = document.getElementById('experience');
  if (!scene || !showcase || !experience) return;

  const assets = {
    product: 'https://github.com/user-attachments/assets/46073db9-02ac-4645-8784-721165d7d504',
    signoff: 'https://github.com/user-attachments/assets/b2fc999c-b87a-4b91-8230-870c9c78b193'
  };

  const style = document.createElement('style');
  style.dataset.socialIntegrated = 'true';
  style.textContent = `
    .social-showcase{
      top:11%;right:max(2.5vw,calc((100% - var(--content))/2));width:min(57vw,850px);
      overflow:visible;border:0;border-radius:0;background:transparent;box-shadow:none;backdrop-filter:none;-webkit-backdrop-filter:none
    }
    .social-motion-root{position:absolute;inset:0;isolation:isolate}
    .social-motion-surface{border:1px solid rgba(255,255,255,.18);border-radius:clamp(15px,1.7vw,25px);box-shadow:0 34px 100px rgba(0,0,0,.43);background:#0d1117}
    .social-motion-product,.social-final-product{position:absolute;inset:0;width:100%;height:100%;will-change:opacity,transform,filter}
    .social-motion-product{z-index:2;object-fit:cover;object-position:center top}
    .social-final-product{z-index:6;object-fit:contain;object-position:center;background:#0d1117;opacity:0}
    .social-vector-world{position:absolute;z-index:7;inset:0;pointer-events:none;overflow:visible}
    .social-vector-world svg{display:block;width:100%;height:100%;overflow:visible}
    .social-vector-world .social-line{fill:none;stroke:rgba(231,237,255,.56);stroke-width:1.25;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
    .social-vector-world .social-faint{stroke:rgba(231,237,255,.28)}
    .social-vector-world .social-strong{stroke:rgba(242,246,255,.82)}
    .social-vector-world text{fill:rgba(238,243,255,.66);font:620 13px/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:1.2px}
    .social-release-marker{fill:#f1f4ff;filter:drop-shadow(0 0 5px rgba(196,211,255,.28))}
    .social-release-node{fill:#10151d;stroke:rgba(231,237,255,.52);stroke-width:1.1;vector-effect:non-scaling-stroke}
    .social-db-layer,.social-web-layer{opacity:0;will-change:opacity,transform}
    .social-scan-line{stroke:rgba(242,246,255,.74);stroke-width:1.2;stroke-linecap:round;vector-effect:non-scaling-stroke;opacity:0}
    @media(max-width:760px){
      .social-showcase{left:4vw;right:auto;top:8%;width:92vw;max-height:44vh}
      .social-vector-world text{font-size:11px;letter-spacing:.9px}
    }
    @media(prefers-reduced-motion:reduce){
      .social-motion-product{display:none!important}
      .social-final-product{opacity:1!important;transform:none!important;filter:none!important}
      .social-db-layer,.social-web-layer,.social-release-marker{display:none!important}
      .social-vector-world{z-index:10!important;opacity:.62!important}
      .social-vector-world .social-release-base{stroke-dashoffset:0!important}
    }
  `;
  document.head.appendChild(style);

  showcase.setAttribute('aria-label', 'SocialPlatform release path moving through database and web verification layers');
  showcase.innerHTML = `
    <div class="social-motion-root">
      <img class="social-motion-product social-motion-surface" src="${assets.product}" alt="SocialPlatform desktop review queue" />
      <img class="social-final-product social-motion-surface" src="${assets.signoff}" alt="SocialPlatform moderation rules screen showing the engine running with three of three rules active" />

      <div class="social-vector-world" aria-hidden="true">
        <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet">
          <path class="social-line social-release-base" pathLength="1" d="M100 440 H900" />
          <circle class="social-release-node" cx="388" cy="440" r="5" />
          <circle class="social-release-node" cx="676" cy="440" r="5" />
          <circle class="social-release-node" cx="900" cy="440" r="5" />
          <text x="388" y="469" text-anchor="middle">DB</text>
          <text x="676" y="469" text-anchor="middle">WEB</text>
          <circle class="social-release-marker" cx="100" cy="440" r="5.5" />

          <g class="social-db-layer">
            <path class="social-line social-faint social-db-stem social-draw" pathLength="1" d="M388 435 C388 402 388 372 388 338" />
            <path class="social-line social-db-row social-draw" pathLength="1" d="M236 154 H548" />
            <path class="social-line social-db-row social-draw" pathLength="1" d="M236 198 H548" />
            <path class="social-line social-db-row social-draw" pathLength="1" d="M236 242 H548" />
            <path class="social-line social-db-row social-draw" pathLength="1" d="M236 286 H548" />
            <path class="social-line social-db-row social-draw" pathLength="1" d="M236 330 H548" />
            <path class="social-line social-faint social-draw" pathLength="1" d="M286 140 V344 M418 140 V344 M510 140 V344" />
            <circle class="social-release-node social-db-record" cx="259" cy="154" r="3.5" />
            <circle class="social-release-node social-db-record" cx="259" cy="198" r="3.5" />
            <circle class="social-release-node social-db-record" cx="259" cy="242" r="3.5" />
            <circle class="social-release-node social-db-record" cx="259" cy="286" r="3.5" />
            <circle class="social-release-node social-db-record" cx="259" cy="330" r="3.5" />
            <text x="236" y="122">DATABASE LAYER</text>
            <line class="social-scan-line social-db-scan" x1="224" x2="560" y1="150" y2="150" />
          </g>

          <g class="social-web-layer">
            <path class="social-line social-faint social-web-stem social-draw" pathLength="1" d="M676 435 C676 402 676 372 676 338" />
            <path class="social-line social-web-frame social-draw" pathLength="1" d="M472 136 H836 Q850 136 850 150 V322 Q850 336 836 336 H472 Q458 336 458 322 V150 Q458 136 472 136 Z" />
            <path class="social-line social-faint social-draw" pathLength="1" d="M458 176 H850" />
            <path class="social-line social-draw" pathLength="1" d="M492 205 H596 V252 H492 Z" />
            <path class="social-line social-draw" pathLength="1" d="M616 205 H816 V228 H616 Z" />
            <path class="social-line social-draw" pathLength="1" d="M616 242 H816 V294 H616 Z" />
            <path class="social-line social-faint social-draw" pathLength="1" d="M492 272 H596 V294 H492 Z" />
            <circle class="social-release-node" cx="482" cy="156" r="3" />
            <circle class="social-release-node" cx="494" cy="156" r="3" />
            <circle class="social-release-node" cx="506" cy="156" r="3" />
            <text x="458" y="108">WEB LAYER</text>
            <line class="social-scan-line social-web-scan" x1="476" x2="832" y1="194" y2="194" />
          </g>
        </svg>
      </div>
    </div>
  `;

  const product = showcase.querySelector('.social-motion-product');
  const finalProduct = showcase.querySelector('.social-final-product');
  const baseLine = showcase.querySelector('.social-release-base');
  const marker = showcase.querySelector('.social-release-marker');
  const dbLayer = showcase.querySelector('.social-db-layer');
  const webLayer = showcase.querySelector('.social-web-layer');
  const dbDraw = [...showcase.querySelectorAll('.social-db-layer .social-draw')];
  const webDraw = [...showcase.querySelectorAll('.social-web-layer .social-draw')];
  const dbScan = showcase.querySelector('.social-db-scan');
  const webScan = showcase.querySelector('.social-web-scan');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  baseLine.style.strokeDasharray = '1';
  baseLine.style.strokeDashoffset = reduced ? '0' : '1';
  [...dbDraw, ...webDraw].forEach(path => {
    path.style.strokeDasharray = '1';
    path.style.strokeDashoffset = '1';
  });
  if (reduced) return;

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smooth = t => {
    const x = clamp(t);
    return x * x * (3 - 2 * x);
  };
  const easeOut = t => 1 - Math.pow(1 - clamp(t), 4);
  const ramp = (p, start, end, easing = smooth) => easing((p - start) / Math.max(.0001, end - start));
  const mix = (a, b, t) => a + (b - a) * t;

  function getScenePhase() {
    const rect = experience.getBoundingClientRect();
    const travel = Math.max(1, experience.offsetHeight - window.innerHeight);
    const progress = clamp(-rect.top / travel);
    const durations = [1.5, 1.5, 2.15, 2.15, 1.5, 3.7];
    const timelineTotal = 12.5;
    const timelinePos = progress * timelineTotal;
    let step = 6;
    let cursor = 0;
    for (let i = 0; i < durations.length; i++) {
      const duration = durations[i];
      if (timelinePos <= cursor + duration) {
        step = i + clamp((timelinePos - cursor) / duration);
        break;
      }
      cursor += duration;
    }
    return clamp(((step - 3) + .56) / .82);
  }

  function setDraw(paths, amount) {
    paths.forEach((path, index) => {
      const local = clamp(amount * 1.18 - index * .035);
      path.style.strokeDashoffset = String(1 - smooth(local));
    });
  }

  function setLayer(group, amount) {
    group.style.opacity = String(amount);
    group.style.transformOrigin = '50% 78%';
    group.style.transform = `translate3d(0,${mix(5, 0, amount)}px,0)`;
  }

  let raf = 0;
  function render() {
    const p = getScenePhase();

    const lineDraw = ramp(p, .18, .25, easeOut);
    const dbTravel = ramp(p, .21, .30);
    const dbIn = ramp(p, .30, .35);
    const dbOut = ramp(p, .44, .49);
    const dbAmount = dbIn * (1 - dbOut);
    const dbScanPhase = ramp(p, .35, .43);

    const webTravel = ramp(p, .53, .65);
    const webIn = ramp(p, .65, .70);
    const webOut = ramp(p, .78, .83);
    const webAmount = webIn * (1 - webOut);
    const webScanPhase = ramp(p, .70, .77);

    const endTravel = ramp(p, .83, .90);
    const finalIn = ramp(p, .90, .96);
    const activeLayer = Math.max(dbAmount, webAmount);

    baseLine.style.strokeDashoffset = String(1 - lineDraw);

    let markerX = 100;
    if (p < .30) markerX = mix(100, 388, dbTravel);
    else if (p < .53) markerX = 388;
    else if (p < .65) markerX = mix(388, 676, webTravel);
    else if (p < .83) markerX = 676;
    else markerX = mix(676, 900, endTravel);
    marker.setAttribute('cx', markerX.toFixed(2));
    marker.style.opacity = String(lineDraw * (1 - finalIn));

    const productDim = Math.max(activeLayer * .92, finalIn);
    product.style.opacity = String(1 - finalIn);
    product.style.transform = 'scale(1)';
    product.style.filter = `brightness(${mix(1, .26, productDim)}) saturate(${mix(1, .58, productDim)})`;

    setLayer(dbLayer, dbAmount);
    setDraw(dbDraw, dbIn * (1 - dbOut));
    dbScan.style.opacity = String(dbAmount * Math.sin(Math.PI * dbScanPhase));
    const dbScanY = mix(150, 330, dbScanPhase);
    dbScan.setAttribute('y1', dbScanY.toFixed(1));
    dbScan.setAttribute('y2', dbScanY.toFixed(1));

    setLayer(webLayer, webAmount);
    setDraw(webDraw, webIn * (1 - webOut));
    webScan.style.opacity = String(webAmount * Math.sin(Math.PI * webScanPhase));
    const webScanY = mix(194, 312, webScanPhase);
    webScan.setAttribute('y1', webScanY.toFixed(1));
    webScan.setAttribute('y2', webScanY.toFixed(1));

    const vectorFade = 1 - ramp(p, .90, .96);
    showcase.querySelector('.social-vector-world').style.opacity = String(mix(1, .12, activeLayer) * vectorFade + activeLayer * vectorFade);

    finalProduct.style.opacity = String(finalIn);
    finalProduct.style.transform = `scale(${mix(.995, 1, finalIn)})`;
    finalProduct.style.filter = `brightness(${mix(.92, 1, finalIn)}) saturate(${mix(.96, 1, finalIn)})`;

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();
