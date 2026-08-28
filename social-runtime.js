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
    .social-motion-product,.social-motion-evidence,.social-final-product{position:absolute;inset:0;width:100%;height:100%;will-change:opacity,transform,filter}
    .social-motion-product{z-index:2;object-fit:cover;object-position:center top}
    .social-motion-evidence,.social-final-product{z-index:5;opacity:0;transform:translate3d(0,8px,0) scale(1.008);background:#0d1117}
    .social-proof-db{object-fit:cover;object-position:center}
    .social-proof-e2e{object-fit:contain;padding:4% 3%;background:#0d1117}
    .social-final-product{z-index:6;object-fit:contain;object-position:center;background:#0d1117}
    .social-release-world{position:absolute;z-index:8;inset:0;pointer-events:none;will-change:opacity}
    .social-release-track{position:absolute;left:9%;right:9%;top:76%;height:34px;transform:translateY(-50%)}
    .social-release-line{position:absolute;left:0;right:0;top:50%;height:1px;background:rgba(231,237,255,.5);transform:scaleX(0);transform-origin:left center;will-change:transform,opacity}
    .social-release-marker{position:absolute;z-index:3;left:0;top:50%;width:7px;height:7px;border-radius:50%;background:#eef3ff;box-shadow:0 0 8px rgba(196,211,255,.22);transform:translate(-50%,-50%);will-change:left,opacity}
    .social-release-checkpoint{position:absolute;top:50%;width:5px;height:5px;border-radius:50%;border:1px solid rgba(231,237,255,.52);background:#11161f;transform:translate(-50%,-50%);will-change:opacity}
    .social-release-checkpoint[data-point="db"]{left:38%}.social-release-checkpoint[data-point="web"]{left:70%}.social-release-checkpoint[data-point="end"]{left:100%}
    .social-checkpoint-label{position:absolute;left:50%;top:12px;margin:0;transform:translateX(-50%);color:rgba(238,243,255,.58);font:620 clamp(.57rem,.69vw,.66rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.08em;white-space:nowrap}
    @media(max-width:760px){
      .social-showcase{left:4vw;right:auto;top:8%;width:92vw;max-height:44vh}
      .social-release-track{left:12%;right:12%;top:79%;height:30px}
      .social-checkpoint-label{top:11px;font-size:.52rem}
      .social-proof-e2e{padding:2.5% 2%}
    }
    @media(prefers-reduced-motion:reduce){
      .social-motion-product,.social-motion-evidence,.social-release-marker{display:none!important}
      .social-final-product{opacity:1!important;transform:none!important;filter:none!important}
      .social-release-world{z-index:10!important;opacity:.66!important}
      .social-release-line{transform:scaleX(1)!important}
      .social-release-checkpoint{opacity:.72!important}
    }
  `;
  document.head.appendChild(style);

  showcase.setAttribute('aria-label', 'SocialPlatform product with database and web evidence along one release path');
  showcase.innerHTML = `
    <div class="social-motion-root">
      <img class="social-motion-product social-motion-surface" src="${assets.product}" alt="SocialPlatform desktop review queue" />
      <img class="social-motion-evidence social-motion-surface social-proof-db" src="${assets.db}" alt="Database integrity execution evidence" />
      <img class="social-motion-evidence social-motion-surface social-proof-e2e" src="${assets.e2e}" alt="Playwright web E2E execution evidence" />
      <img class="social-final-product social-motion-surface" src="${assets.signoff}" alt="SocialPlatform moderation rules screen showing the engine running with three of three rules active" />

      <div class="social-release-world" aria-hidden="true">
        <div class="social-release-track">
          <span class="social-release-line"></span>
          <span class="social-release-checkpoint" data-point="db"><span class="social-checkpoint-label">DB</span></span>
          <span class="social-release-checkpoint" data-point="web"><span class="social-checkpoint-label">WEB</span></span>
          <span class="social-release-checkpoint" data-point="end"></span>
          <span class="social-release-marker"></span>
        </div>
      </div>
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
  const smooth = t => {
    const x = clamp(t);
    return x * x * (3 - 2 * x);
  };
  const ramp = (p, start, end) => smooth((p - start) / Math.max(.0001, end - start));
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

  function setLayer(node, amount, offset = 8) {
    if (!node) return;
    node.style.opacity = String(amount);
    node.style.transform = `translate3d(0,${mix(offset, 0, amount)}px,0) scale(${mix(1.008, 1, amount)})`;
    node.style.filter = `brightness(${mix(.94, 1, amount)}) saturate(${mix(.96, 1, amount)})`;
  }

  let raf = 0;
  function render() {
    const p = getScenePhase();

    const lineDraw = ramp(p, .18, .25);
    const dbTravel = ramp(p, .20, .30);
    const dbEvidence = windowValue(p, .30, .345, .43, .475);
    const webTravel = ramp(p, .53, .65);
    const webEvidence = windowValue(p, .65, .695, .775, .82);
    const endTravel = ramp(p, .82, .89);
    const finalIn = ramp(p, .89, .95);
    const evidenceMax = Math.max(dbEvidence, webEvidence);
    const finalPathFade = 1 - ramp(p, .89, .955);

    product.style.opacity = String(1 - finalIn);
    product.style.transform = 'translate3d(0,0,0) scale(1)';
    product.style.filter = 'none';

    setLayer(dbProof, dbEvidence, 7);
    setLayer(webProof, webEvidence, 7);
    setLayer(finalProduct, finalIn, 5);

    line.style.transform = `scaleX(${lineDraw})`;

    let markerPosition = 0;
    if (p < .30) markerPosition = mix(0, 38, dbTravel);
    else if (p < .53) markerPosition = 38;
    else if (p < .65) markerPosition = mix(38, 70, webTravel);
    else if (p < .82) markerPosition = 70;
    else markerPosition = mix(70, 100, endTravel);
    marker.style.left = `${markerPosition}%`;

    const trackDuringEvidence = mix(1, .08, evidenceMax);
    release.style.opacity = String(lineDraw * trackDuringEvidence * finalPathFade);
    marker.style.opacity = String(lineDraw * (1 - evidenceMax) * (1 - finalIn));

    if (dbCheckpoint) dbCheckpoint.style.opacity = String(mix(.5, .16, dbEvidence) * finalPathFade);
    if (webCheckpoint) webCheckpoint.style.opacity = String(mix(.5, .16, webEvidence) * finalPathFade);
    if (endCheckpoint) endCheckpoint.style.opacity = String(.5 * finalPathFade);

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();
