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
    .social-release-world{position:absolute;z-index:6;inset:0;pointer-events:none;will-change:opacity}
    .social-release-track{position:absolute;left:8%;right:8%;top:72%;height:44px;transform:translateY(-50%)}
    .social-release-line{position:absolute;left:0;right:0;top:50%;height:1px;background:rgba(224,232,255,.58);box-shadow:0 0 8px rgba(176,196,255,.12);transform:scaleX(0);transform-origin:left center;will-change:transform,opacity}
    .social-release-marker{position:absolute;z-index:3;left:0;top:50%;width:9px;height:9px;border-radius:50%;background:#edf2ff;box-shadow:0 0 11px rgba(190,207,255,.4);transform:translate(-50%,-50%);will-change:left,opacity,transform}
    .social-release-checkpoint{position:absolute;z-index:2;top:50%;width:7px;height:7px;border:1px solid rgba(224,232,255,.62);border-radius:50%;background:#111722;transform:translate(-50%,-50%);will-change:opacity}
    .social-release-checkpoint[data-point="db"]{left:38%}.social-release-checkpoint[data-point="web"]{left:70%}.social-release-checkpoint[data-point="end"]{left:100%}
    .social-checkpoint-label{position:absolute;left:50%;top:13px;margin:0;transform:translateX(-50%);color:rgba(238,243,255,.74);font:700 clamp(.6rem,.76vw,.7rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.09em;white-space:nowrap}
    .social-checkpoint-cue{position:absolute;z-index:7;top:72%;display:grid;place-items:center;color:#edf2ff;opacity:0;transform:translate(-50%,-50%) scale(.72);pointer-events:none;will-change:opacity,transform}
    .social-checkpoint-cue svg{overflow:visible;filter:drop-shadow(0 10px 24px rgba(0,0,0,.32))}
    .social-checkpoint-cue svg *{fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
    .social-db-cue{left:40%;width:62px;height:62px}.social-db-cue svg{width:50px;height:50px}
    .social-web-cue{left:67%;width:80px;height:54px;border:1.25px solid rgba(237,242,255,.86);border-radius:9px}
    .social-web-cue::before{content:"";position:absolute;left:0;right:0;top:13px;height:1px;background:rgba(237,242,255,.42)}
    .social-web-cue::after{content:"";position:absolute;left:9px;top:6px;width:3px;height:3px;border-radius:50%;background:rgba(237,242,255,.72);box-shadow:7px 0 0 rgba(237,242,255,.42),14px 0 0 rgba(237,242,255,.24)}
    .social-motion-evidence,.social-final-product{z-index:8;opacity:0;clip-path:circle(.8% at var(--origin-x) 72%);transform:scale(.96);transform-origin:var(--origin-x) 72%}
    .social-proof-db{--origin-x:40%;object-fit:cover;object-position:center}
    .social-proof-e2e{--origin-x:67%;object-fit:contain;padding:4% 3%;background:#0d1117}
    .social-final-product{--origin-x:92%;z-index:9;object-fit:contain;object-position:center;background:#0d1117}
    @media(max-width:760px){
      .social-showcase{left:4vw;right:auto;top:8%;width:92vw;max-height:44vh}
      .social-release-track{left:12%;right:12%;top:77%;height:36px}
      .social-checkpoint-label{top:11px;font-size:.54rem}
      .social-checkpoint-cue{top:77%}
      .social-db-cue{left:41%;width:48px;height:48px}.social-db-cue svg{width:38px;height:38px}
      .social-web-cue{left:65%;width:62px;height:42px;border-radius:7px}.social-web-cue::before{top:10px}.social-web-cue::after{left:7px;top:4px;transform:scale(.82);transform-origin:left top}
      .social-motion-evidence,.social-final-product{clip-path:circle(.8% at var(--origin-x) 77%);transform-origin:var(--origin-x) 77%}
      .social-proof-db{--origin-x:41%}.social-proof-e2e{--origin-x:65%;padding:2.5% 2%}.social-final-product{--origin-x:88%}
    }
    @media(prefers-reduced-motion:reduce){
      .social-motion-product,.social-motion-evidence,.social-checkpoint-cue,.social-release-marker{display:none!important}
      .social-final-product{opacity:1!important;clip-path:none!important;transform:none!important;filter:none!important}
      .social-release-world{z-index:10!important;opacity:.72!important}
      .social-release-line{transform:scaleX(1)!important}
      .social-release-checkpoint{opacity:.8!important}
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

      <div class="social-checkpoint-cue social-db-cue" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <ellipse cx="32" cy="17" rx="18" ry="7" />
          <path d="M14 17v15c0 4 8 7 18 7s18-3 18-7V17" />
          <path d="M14 32v15c0 4 8 7 18 7s18-3 18-7V32" />
        </svg>
      </div>
      <div class="social-checkpoint-cue social-web-cue" aria-hidden="true"></div>

      <img class="social-motion-evidence social-motion-surface social-proof-db" src="${assets.db}" alt="Database integrity execution evidence" />
      <img class="social-motion-evidence social-motion-surface social-proof-e2e" src="${assets.e2e}" alt="Playwright web E2E execution evidence" />
      <img class="social-final-product social-motion-surface" src="${assets.signoff}" alt="SocialPlatform moderation rules screen showing the engine running with three of three rules active" />
    </div>
  `;

  const product = showcase.querySelector('.social-motion-product');
  const release = showcase.querySelector('.social-release-world');
  const line = showcase.querySelector('.social-release-line');
  const marker = showcase.querySelector('.social-release-marker');
  const checkpoints = [...showcase.querySelectorAll('.social-release-checkpoint')];
  const dbCue = showcase.querySelector('.social-db-cue');
  const webCue = showcase.querySelector('.social-web-cue');
  const dbProof = showcase.querySelector('.social-proof-db');
  const webProof = showcase.querySelector('.social-proof-e2e');
  const finalProduct = showcase.querySelector('.social-final-product');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smooth = t => t * t * (3 - 2 * t);
  const ramp = (p, start, end) => smooth(clamp((p - start) / Math.max(.0001, end - start)));
  const mix = (a, b, t) => a + (b - a) * t;
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

  function setEvidence(node, amount, originX, originY) {
    const radius = mix(.8, 132, amount);
    node.style.opacity = String(amount);
    node.style.clipPath = `circle(${radius}% at ${originX}% ${originY}%)`;
    node.style.transformOrigin = `${originX}% ${originY}%`;
    node.style.transform = `scale(${mix(.96, 1, amount)})`;
    node.style.filter = `brightness(${mix(.88, 1, amount)}) saturate(${mix(.9, 1, amount)})`;
  }

  function setCue(node, amount) {
    node.style.opacity = String(amount);
    node.style.transform = `translate(-50%,-50%) scale(${mix(.72, 1, amount)})`;
  }

  let raf = 0;
  function render() {
    const p = getScenePhase();
    const mobile = window.innerWidth <= 760;
    const pathY = mobile ? 77 : 72;
    const dbOrigin = mobile ? 41 : 40;
    const webOrigin = mobile ? 65 : 67;
    const finalOrigin = mobile ? 88 : 92;

    const lineDraw = ramp(p, .18, .24);
    const dbTravel = ramp(p, .20, .30);
    const dbEvidence = windowValue(p, .30, .35, .43, .48);
    const dbCueAmount = windowValue(p, .27, .30, .32, .35) * (1 - dbEvidence);
    const webTravel = ramp(p, .53, .65);
    const webEvidence = windowValue(p, .65, .70, .78, .83);
    const webCueAmount = windowValue(p, .62, .65, .67, .70) * (1 - webEvidence);
    const endTravel = ramp(p, .83, .90);
    const finalIn = ramp(p, .88, .95);
    const evidenceMax = Math.max(dbEvidence, webEvidence);
    const pathFade = 1 - ramp(p, .90, .96);

    const productDim = ramp(p, .18, .27) * (1 - evidenceMax * .36);
    product.style.opacity = '1';
    product.style.transform = 'scale(1)';
    product.style.filter = `brightness(${mix(1, .58, productDim)}) saturate(${mix(1, .82, productDim)})`;

    line.style.transform = `scaleX(${lineDraw})`;

    let markerPosition = 0;
    if (p < .30) markerPosition = mix(0, 38, dbTravel);
    else if (p < .53) markerPosition = 38;
    else if (p < .65) markerPosition = mix(38, 70, webTravel);
    else if (p < .83) markerPosition = 70;
    else markerPosition = mix(70, 100, endTravel);
    marker.style.left = `${markerPosition}%`;

    const markerVisible = lineDraw * (1 - evidenceMax) * (1 - finalIn);
    marker.style.opacity = String(markerVisible);
    marker.style.transform = `translate(-50%,-50%) scale(${mix(.82, 1, markerVisible)})`;

    const releaseOpacity = lineDraw * mix(1, .14, evidenceMax) * pathFade;
    release.style.opacity = String(releaseOpacity);
    checkpoints.forEach(checkpoint => {
      checkpoint.style.opacity = String(mix(.62, .24, evidenceMax) * pathFade);
    });

    setCue(dbCue, dbCueAmount);
    setEvidence(dbProof, dbEvidence, dbOrigin, pathY);
    setCue(webCue, webCueAmount);
    setEvidence(webProof, webEvidence, webOrigin, pathY);

    const finalRadius = mix(.8, 142, finalIn);
    finalProduct.style.opacity = String(finalIn);
    finalProduct.style.clipPath = `circle(${finalRadius}% at ${finalOrigin}% ${pathY}%)`;
    finalProduct.style.transformOrigin = `${finalOrigin}% ${pathY}%`;
    finalProduct.style.transform = `scale(${mix(.94, 1, finalIn)})`;
    finalProduct.style.filter = `brightness(${mix(.9, 1, finalIn)}) saturate(${mix(.94, 1, finalIn)})`;

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();
