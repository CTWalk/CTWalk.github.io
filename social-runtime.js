(() => {
  const scene = document.querySelector('.scene[data-scene="3"]');
  const showcase = scene?.querySelector('.social-showcase');
  const experience = document.getElementById('experience');
  if (!scene || !showcase || !experience) return;

  const assets = {
    product: 'https://github.com/user-attachments/assets/46073db9-02ac-4645-8784-721165d7d504',
    db: 'https://github.com/user-attachments/assets/78e165ea-d43d-4044-abd5-c189e70161a4',
    e2e: 'https://github.com/user-attachments/assets/7ea37734-4f73-4dcb-84fd-89d1c94e3418',
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
    .social-motion-product,.social-motion-evidence,.social-final-product{position:absolute;inset:0;width:100%;height:100%;will-change:opacity,transform,filter,clip-path}
    .social-motion-product{z-index:2;object-fit:cover;object-position:center top}
    .social-release-world{position:absolute;z-index:7;inset:0;pointer-events:none;will-change:opacity}
    .social-release-track{position:absolute;left:8%;right:8%;top:72%;height:40px;transform:translateY(-50%)}
    .social-release-line{position:absolute;left:0;right:0;top:50%;height:1px;background:rgba(225,233,255,.52);transform:scaleX(0);transform-origin:left center;will-change:transform,opacity}
    .social-release-marker{position:absolute;z-index:4;left:0;top:50%;width:8px;height:8px;border-radius:50%;background:#f0f4ff;box-shadow:0 0 0 1px rgba(240,244,255,.12),0 0 10px rgba(190,207,255,.28);transform:translate(-50%,-50%);will-change:left,opacity,transform}
    .social-release-checkpoint{position:absolute;z-index:3;top:50%;width:1px;height:11px;background:rgba(225,233,255,.5);transform:translate(-50%,-50%);transform-origin:center;will-change:opacity,transform,width}
    .social-release-checkpoint[data-point="db"]{left:38%}.social-release-checkpoint[data-point="web"]{left:70%}.social-release-checkpoint[data-point="end"]{left:100%}
    .social-checkpoint-label{position:absolute;left:50%;top:17px;margin:0;transform:translateX(-50%);color:rgba(238,243,255,.62);font:650 clamp(.58rem,.72vw,.68rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.085em;white-space:nowrap;will-change:opacity,transform}
    .social-motion-evidence,.social-final-product{z-index:8;opacity:0;transform:translate3d(0,0,0) scale(.985);background:#0d1117}
    .social-proof-db{object-fit:cover;object-position:center}
    .social-proof-e2e{object-fit:contain;padding:4% 3%;background:#0d1117}
    .social-final-product{z-index:9;object-fit:contain;object-position:center;background:#0d1117}
    @media(max-width:760px){
      .social-showcase{left:4vw;right:auto;top:8%;width:92vw;max-height:44vh}
      .social-release-track{left:12%;right:12%;top:77%;height:34px}
      .social-release-checkpoint{height:9px}.social-checkpoint-label{top:14px;font-size:.53rem}
      .social-proof-e2e{padding:2.5% 2%}
    }
    @media(prefers-reduced-motion:reduce){
      .social-motion-product,.social-motion-evidence,.social-release-marker{display:none!important}
      .social-final-product{opacity:1!important;clip-path:none!important;transform:none!important;filter:none!important}
      .social-release-world{z-index:10!important;opacity:.68!important}
      .social-release-line{transform:scaleX(1)!important}
      .social-release-checkpoint{opacity:.72!important;transform:translate(-50%,-50%)!important}
      .social-checkpoint-label{opacity:.8!important;transform:translateX(-50%)!important}
    }
  `;
  document.head.appendChild(style);

  showcase.setAttribute('aria-label', 'SocialPlatform product with database and web evidence along one release path');
  showcase.innerHTML = `
    <div class="social-motion-root">
      <img class="social-motion-product social-motion-surface" src="${assets.product}" alt="SocialPlatform desktop review queue" />

      <div class="social-release-world" aria-hidden="true">
        <div class="social-release-track">
          <span class="social-release-line"></span>
          <span class="social-release-checkpoint" data-point="db"><span class="social-checkpoint-label">DB</span></span>
          <span class="social-release-checkpoint" data-point="web"><span class="social-checkpoint-label">WEB</span></span>
          <span class="social-release-checkpoint" data-point="end"></span>
          <span class="social-release-marker"></span>
        </div>
      </div>

      <img class="social-motion-evidence social-motion-surface social-proof-db" src="${assets.db}" alt="Database integrity execution evidence" />
      <img class="social-motion-evidence social-motion-surface social-proof-e2e" src="${assets.e2e}" alt="Playwright web E2E execution evidence" />
      <img class="social-final-product social-motion-surface" src="${assets.signoff}" alt="SocialPlatform moderation rules screen showing the engine running with three of three rules active" />
    </div>
  `;

  const product = showcase.querySelector('.social-motion-product');
  const release = showcase.querySelector('.social-release-world');
  const line = showcase.querySelector('.social-release-line');
  const marker = showcase.querySelector('.social-release-marker');
  const dbCheckpoint = showcase.querySelector('[data-point="db"]');
  const webCheckpoint = showcase.querySelector('[data-point="web"]');
  const endCheckpoint = showcase.querySelector('[data-point="end"]');
  const dbProof = showcase.querySelector('.social-proof-db');
  const webProof = showcase.querySelector('.social-proof-e2e');
  const finalProduct = showcase.querySelector('.social-final-product');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const easeInOut = t => {
    const x = clamp(t);
    return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  };
  const easeOut = t => 1 - Math.pow(1 - clamp(t), 4);
  const ramp = (p, start, end, easing = easeInOut) => easing((p - start) / Math.max(.0001, end - start));
  const windowValue = (p, start, inEnd, outStart, end) => ramp(p, start, inEnd) * (1 - ramp(p, outStart, end));

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

  function setCheckpoint(node, active, evidenceAmount = 0) {
    if (!node) return;
    const label = node.querySelector('.social-checkpoint-label');
    const stretch = 1 + active * 9;
    node.style.opacity = String(mix(.48, .94, active) * (1 - evidenceAmount * .72));
    node.style.transform = `translate(-50%,-50%) scaleX(${stretch}) scaleY(${mix(1, .72, active)})`;
    if (label) {
      const labelAlpha = (1 - evidenceAmount) * mix(.72, 1, active);
      label.style.opacity = String(labelAlpha);
      label.style.transform = `translateX(-50%) translateY(${mix(0, 2, active)}px)`;
    }
  }

  function setEvidence(node, amount, originX, originY) {
    if (!node) return;
    const left = mix(originX, 0, amount);
    const right = mix(100 - originX, 0, amount);
    const top = mix(originY, 0, amount);
    const bottom = mix(100 - originY, 0, amount);
    const radius = mix(18, 0, amount);
    const lift = mix(8, 0, amount);
    const scale = mix(.985, 1, amount);
    node.style.opacity = String(clamp(amount * 1.35));
    node.style.clipPath = `inset(${top}% ${right}% ${bottom}% ${left}% round ${radius}px)`;
    node.style.transformOrigin = `${originX}% ${originY}%`;
    node.style.transform = `translate3d(0,${lift}px,0) scale(${scale})`;
    node.style.filter = `brightness(${mix(.92, 1, amount)}) saturate(${mix(.94, 1, amount)})`;
  }

  let raf = 0;
  function render() {
    const p = getScenePhase();
    const mobile = window.innerWidth <= 760;
    const pathY = mobile ? 77 : 72;
    const dbX = 38;
    const webX = 70;
    const endX = 100;

    const lineDraw = ramp(p, .18, .25, easeOut);
    const dbTravel = ramp(p, .20, .30);
    const dbArrival = windowValue(p, .275, .30, .465, .505);
    const dbEvidence = windowValue(p, .305, .355, .43, .49);
    const webTravel = ramp(p, .53, .65);
    const webArrival = windowValue(p, .625, .65, .795, .835);
    const webEvidence = windowValue(p, .655, .705, .77, .83);
    const endTravel = ramp(p, .83, .90);
    const finalArrival = ramp(p, .875, .91);
    const finalIn = ramp(p, .895, .96);
    const evidenceMax = Math.max(dbEvidence, webEvidence);
    const pathFade = 1 - ramp(p, .905, .965);

    const productDim = Math.max(dbEvidence, webEvidence, finalIn * .9);
    product.style.opacity = String(1 - finalIn * .18);
    product.style.transform = `scale(${mix(1, .994, productDim)})`;
    product.style.filter = `brightness(${mix(1, .52, productDim)}) saturate(${mix(1, .82, productDim)})`;

    line.style.transform = `scaleX(${lineDraw})`;

    let markerPosition = 0;
    if (p < .30) markerPosition = mix(0, dbX, dbTravel);
    else if (p < .53) markerPosition = dbX;
    else if (p < .65) markerPosition = mix(dbX, webX, webTravel);
    else if (p < .83) markerPosition = webX;
    else markerPosition = mix(webX, endX, endTravel);
    marker.style.left = `${markerPosition}%`;

    const markerVisible = lineDraw * (1 - evidenceMax * .94) * (1 - finalIn);
    const markerCompression = Math.max(dbArrival * (1 - dbEvidence), webArrival * (1 - webEvidence), finalArrival * (1 - finalIn));
    marker.style.opacity = String(markerVisible);
    marker.style.transform = `translate(-50%,-50%) scaleX(${mix(1, 1.9, markerCompression)}) scaleY(${mix(1, .62, markerCompression)})`;

    release.style.opacity = String(lineDraw * mix(1, .2, evidenceMax) * pathFade);

    setCheckpoint(dbCheckpoint, dbArrival, dbEvidence);
    setCheckpoint(webCheckpoint, webArrival, webEvidence);
    if (endCheckpoint) {
      endCheckpoint.style.opacity = String(mix(.42, .92, finalArrival) * pathFade);
      endCheckpoint.style.transform = `translate(-50%,-50%) scaleX(${mix(1, 7, finalArrival * (1 - finalIn))}) scaleY(${mix(1, .72, finalArrival)})`;
    }

    setEvidence(dbProof, dbEvidence, dbX, pathY);
    setEvidence(webProof, webEvidence, webX, pathY);
    setEvidence(finalProduct, finalIn, endX, pathY);

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();
