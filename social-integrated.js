(() => {
  const scene = document.querySelector('.scene[data-scene="3"]');
  const showcase = scene?.querySelector('.social-showcase');
  const experience = document.getElementById('experience');
  if (!scene || !showcase || !experience) return;

  const assets = {
    product: 'https://github.com/user-attachments/assets/46073db9-02ac-4645-8784-721165d7d504',
    ci: 'https://github.com/user-attachments/assets/ac6484fd-78f5-4583-96e1-880e3fec1229',
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
    .social-motion-product,.social-motion-ci,.social-motion-proof{position:absolute;inset:0;width:100%;height:100%;will-change:opacity,transform,filter,clip-path}
    .social-motion-product{z-index:2;object-fit:cover;object-position:center top}
    .social-motion-ci{z-index:1;object-fit:contain;opacity:0;filter:brightness(.5) saturate(.75)}
    .social-release-world{position:absolute;z-index:4;inset:0;pointer-events:none;will-change:opacity,transform}
    .social-release-track{position:absolute;left:8%;right:8%;top:50%;height:80px;transform:translateY(-50%);overflow:visible}
    .social-release-line{fill:none;stroke:rgba(200,213,255,.46);stroke-width:1.4;stroke-linecap:round;filter:drop-shadow(0 0 7px rgba(142,169,255,.2))}
    .social-release-node{fill:#101723;stroke:rgba(200,213,255,.42);stroke-width:1.3;transition:none}
    .social-release-node.is-lit{fill:#9be9c2;stroke:#9be9c2;filter:drop-shadow(0 0 7px rgba(155,233,194,.48))}
    .social-release-pulse{fill:#e5ebff;filter:drop-shadow(0 0 9px rgba(142,169,255,.9))}
    .social-db-stage,.social-device-stage{position:absolute;z-index:6;left:50%;top:50%;color:#e9eeff;pointer-events:none;will-change:opacity,transform,width,height}
    .social-db-stage{width:150px;height:150px;display:grid;place-items:center;transform:translate(-50%,-50%) scale(.15);opacity:0}
    .social-db-stage svg{width:112px;height:112px;overflow:visible;filter:drop-shadow(0 15px 30px rgba(0,0,0,.3))}
    .social-db-stage svg *{fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
    .social-stage-name{position:absolute;left:50%;top:calc(50% + 74px);transform:translateX(-50%);margin:0;color:#f4f6ff;font:720 clamp(.72rem,1vw,.9rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.09em;white-space:nowrap;text-shadow:0 3px 18px rgba(0,0,0,.55)}
    .social-device-stage{width:280px;height:154px;border:1.5px solid rgba(229,235,255,.88);border-radius:15px;transform:translate(-50%,-50%) scale(.15);opacity:0;box-shadow:0 24px 60px rgba(0,0,0,.3),inset 0 0 0 1px rgba(255,255,255,.04)}
    .social-device-stage::before{content:"";position:absolute;left:0;right:0;top:27px;height:1px;background:rgba(229,235,255,.46)}
    .social-device-stage::after{content:"";position:absolute;left:18px;top:12px;width:5px;height:5px;border-radius:50%;background:rgba(229,235,255,.75);box-shadow:10px 0 0 rgba(229,235,255,.45),20px 0 0 rgba(229,235,255,.28)}
    .social-execution{position:absolute;inset:34px 18px 18px;display:grid;grid-template-columns:repeat(6,1fr);gap:8px;align-items:center;justify-items:center;opacity:1}
    .social-execution span{display:grid;width:24px;height:24px;place-items:center;border:1px solid rgba(200,213,255,.35);border-radius:50%;color:transparent;font:800 .66rem/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;transform:scale(.72);opacity:.36;will-change:opacity,transform,color,background}
    .social-execution span.is-done{color:#9be9c2;background:rgba(125,230,181,.1);border-color:rgba(155,233,194,.46);opacity:1;transform:scale(1)}
    .social-motion-proof{z-index:5;opacity:0;object-fit:cover;clip-path:circle(2% at 50% 50%);transform:scale(.88)}
    .social-proof-e2e{object-fit:contain;padding:5% 3%;background:#0d1117}
    .social-proof-readout{position:absolute;z-index:7;left:50%;top:50%;display:grid;justify-items:center;gap:8px;min-width:250px;transform:translate(-50%,-50%) scale(.92);opacity:0;color:#f4f7ff;text-align:center;text-shadow:0 3px 26px rgba(0,0,0,.72);will-change:opacity,transform}
    .social-proof-readout small{font:720 clamp(.64rem,.86vw,.78rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.1em;color:#cbd6f7}
    .social-proof-readout strong{display:flex;align-items:center;gap:10px;font:760 clamp(1.55rem,2.9vw,2.7rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:-.045em}
    .social-proof-readout .social-proof-check{display:grid;width:34px;height:34px;place-items:center;border:1px solid rgba(155,233,194,.3);border-radius:50%;background:rgba(125,230,181,.12);color:#9be9c2;font-size:.92rem;letter-spacing:0}
    .social-proof-readout em{font:600 clamp(.58rem,.76vw,.7rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:rgba(229,235,255,.72);font-style:normal;letter-spacing:.04em}
    .social-final-glow{position:absolute;z-index:3;left:12%;right:12%;top:50%;height:1px;background:linear-gradient(90deg,transparent,rgba(155,233,194,.16),transparent);box-shadow:0 0 40px rgba(125,230,181,.18);opacity:0;will-change:opacity}
    .social-delivered-stage{position:absolute;z-index:10;left:88%;top:50%;width:126px;height:126px;display:grid;place-items:center;color:#eaf8f1;opacity:0;transform:translate(-50%,-50%) scale(.24);pointer-events:none;will-change:opacity,transform}
    .social-delivered-stage svg{width:88px;height:88px;overflow:visible;filter:drop-shadow(0 12px 30px rgba(0,0,0,.36))}
    .social-delivered-stage svg *{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
    .social-delivered-stage .social-delivered-label{position:absolute;left:50%;top:calc(50% + 58px);margin:0;transform:translateX(-50%);color:#eef8f3;font:760 clamp(.62rem,.85vw,.76rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.12em;white-space:nowrap;text-shadow:0 3px 18px rgba(0,0,0,.6);opacity:0;will-change:opacity}
    .social-signoff-stage{position:absolute;z-index:9;left:88%;top:50%;height:94%;aspect-ratio:1081/1999;overflow:hidden;border:1px solid rgba(255,255,255,.22);border-radius:clamp(16px,2vw,27px);background:#f5f2ec;box-shadow:0 32px 100px rgba(0,0,0,.52);opacity:0;transform:translate(-50%,-50%) scale(.84);transform-origin:center;will-change:left,opacity,transform,filter}
    .social-signoff-stage img{display:block;width:100%;height:100%;object-fit:cover}
    .social-signoff-halo{position:absolute;z-index:8;left:88%;top:50%;width:44%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(155,233,194,.10),rgba(155,233,194,.025) 42%,transparent 70%);filter:blur(7px);opacity:0;transform:translate(-50%,-50%) scale(.72);will-change:left,opacity,transform}
    @media(max-width:760px){
      .social-showcase{left:4vw;right:auto;top:8%;width:92vw;max-height:44vh}
      .social-db-stage{width:112px;height:112px}.social-db-stage svg{width:82px;height:82px}.social-stage-name{top:calc(50% + 54px);font-size:.59rem}
      .social-device-stage{width:210px;height:116px}.social-device-stage::before{top:21px}.social-device-stage::after{top:9px;left:13px;transform:scale(.82);transform-origin:left top}
      .social-execution{inset:27px 12px 12px;gap:5px}.social-execution span{width:18px;height:18px;font-size:.52rem}
      .social-proof-e2e{padding:4% 2%}.social-proof-readout{min-width:190px}.social-proof-readout strong{font-size:clamp(1.25rem,6vw,1.8rem)}.social-proof-readout .social-proof-check{width:28px;height:28px}
      .social-delivered-stage{width:98px;height:98px}.social-delivered-stage svg{width:68px;height:68px}.social-delivered-stage .social-delivered-label{top:calc(50% + 45px);font-size:.55rem}
      .social-signoff-stage{height:93%;border-radius:17px}.social-signoff-halo{width:62%}
    }
    @media(prefers-reduced-motion:reduce){
      .social-motion-product,.social-motion-ci,.social-db-stage,.social-device-stage,.social-motion-proof,.social-proof-readout,.social-release-world,.social-final-glow,.social-delivered-stage{display:none!important}
      .social-signoff-stage{opacity:1!important;left:50%!important;transform:translate(-50%,-50%) scale(1)!important;filter:none!important}
      .social-signoff-halo{opacity:.8!important;left:50%!important;transform:translate(-50%,-50%) scale(1)!important}
    }
  `;
  document.head.appendChild(style);

  showcase.innerHTML = `
    <div class="social-motion-root">
      <img class="social-motion-product social-motion-surface" src="${assets.product}" alt="SocialPlatform desktop review queue" />
      <img class="social-motion-ci social-motion-surface" src="${assets.ci}" alt="Successful SocialPlatform CI run" />

      <div class="social-release-world" aria-hidden="true">
        <svg class="social-release-track" viewBox="0 0 110 20" preserveAspectRatio="none">
          <path class="social-release-line" pathLength="100" d="M5 10 H105" />
          <circle class="social-release-node" data-node="0" cx="5" cy="10" r="1.3" />
          <circle class="social-release-node" data-node="1" cx="23" cy="10" r="1.3" />
          <circle class="social-release-node" data-node="2" cx="41" cy="10" r="1.3" />
          <circle class="social-release-node" data-node="3" cx="59" cy="10" r="1.3" />
          <circle class="social-release-node" data-node="4" cx="77" cy="10" r="1.3" />
          <circle class="social-release-pulse" cx="5" cy="10" r="1.15" />
        </svg>
      </div>

      <div class="social-db-stage" aria-hidden="true">
        <svg viewBox="0 0 96 96">
          <ellipse cx="48" cy="22" rx="27" ry="10" pathLength="100" />
          <path d="M21 22v23c0 5.5 12.1 10 27 10s27-4.5 27-10V22" pathLength="100" />
          <path d="M21 45v23c0 5.5 12.1 10 27 10s27-4.5 27-10V45" pathLength="100" />
        </svg>
        <p class="social-stage-name">DB INTEGRITY</p>
      </div>

      <div class="social-device-stage" aria-hidden="true">
        <div class="social-execution">
          <span>✓</span><span>✓</span><span>✓</span><span>✓</span><span>✓</span><span>✓</span>
        </div>
        <p class="social-stage-name social-device-name">WEB E2E</p>
      </div>

      <img class="social-motion-proof social-motion-surface social-proof-db" src="${assets.db}" alt="Database integrity execution evidence from the successful CI run" />
      <div class="social-proof-readout social-readout-db" aria-hidden="true"><small>DB INTEGRITY</small><strong><span class="social-proof-check">✓</span>PASSED</strong></div>

      <img class="social-motion-proof social-motion-surface social-proof-e2e" src="${assets.e2e}" alt="Playwright E2E result showing six tests passed" />
      <div class="social-proof-readout social-readout-e2e" aria-hidden="true"><small>WEB E2E</small><strong><span class="social-proof-check">✓</span>6 PASSED</strong><em>29.9s</em></div>

      <div class="social-final-glow" aria-hidden="true"></div>
      <div class="social-delivered-stage" aria-hidden="true">
        <svg viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="28" pathLength="100" />
          <path d="M35 48l9 9 18-20" pathLength="100" />
        </svg>
        <p class="social-delivered-label">DELIVERED</p>
      </div>
      <div class="social-signoff-halo" aria-hidden="true"></div>
      <div class="social-signoff-stage">
        <img src="${assets.signoff}" alt="SocialPlatform moderation rules screen showing the engine running with three of three rules active" />
      </div>
    </div>
  `;

  const product = showcase.querySelector('.social-motion-product');
  const ci = showcase.querySelector('.social-motion-ci');
  const release = showcase.querySelector('.social-release-world');
  const track = showcase.querySelector('.social-release-line');
  const pulse = showcase.querySelector('.social-release-pulse');
  const nodes = [...showcase.querySelectorAll('.social-release-node')];
  const dbStage = showcase.querySelector('.social-db-stage');
  const dbStrokes = [...dbStage.querySelectorAll('svg *')];
  const device = showcase.querySelector('.social-device-stage');
  const checks = [...showcase.querySelectorAll('.social-execution span')];
  const proofs = {
    db: showcase.querySelector('.social-proof-db'),
    e2e: showcase.querySelector('.social-proof-e2e')
  };
  const readouts = {
    db: showcase.querySelector('.social-readout-db'),
    e2e: showcase.querySelector('.social-readout-e2e')
  };
  const finalGlow = showcase.querySelector('.social-final-glow');
  const delivered = showcase.querySelector('.social-delivered-stage');
  const deliveredStrokes = [...delivered.querySelectorAll('svg *')];
  const deliveredLabel = showcase.querySelector('.social-delivered-label');
  const signoff = showcase.querySelector('.social-signoff-stage');
  const signoffHalo = showcase.querySelector('.social-signoff-halo');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smooth = t => t * t * (3 - 2 * t);
  const ramp = (p, start, end) => smooth(clamp((p - start) / Math.max(.0001, end - start)));
  const cubicOut = t => 1 - Math.pow(1 - clamp(t), 3);
  const cubicRamp = (p, start, end) => cubicOut((p - start) / Math.max(.0001, end - start));
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

  function setProof(node, readout, amount, originX, originY, scale = 1) {
    if (!node || !readout) return;
    const circle = mix(2, 78, amount);
    node.style.opacity = String(amount);
    node.style.clipPath = `circle(${circle}% at ${originX}% ${originY}%)`;
    node.style.transformOrigin = `${originX}% ${originY}%`;
    node.style.transform = `scale(${mix(.88, scale, amount)})`;
    node.style.filter = `brightness(${mix(.72, .68, amount)}) saturate(${mix(.8, .9, amount)})`;
    const textIn = ramp(amount, .42, .82);
    readout.style.opacity = String(textIn);
    readout.style.transform = `translate(-50%,-50%) scale(${.92 + textIn * .08})`;
  }

  dbStrokes.forEach(stroke => {
    stroke.style.strokeDasharray = '100';
    stroke.style.strokeDashoffset = '100';
  });
  deliveredStrokes.forEach(stroke => {
    stroke.style.strokeDasharray = '100';
    stroke.style.strokeDashoffset = '100';
  });
  track.style.strokeDasharray = '100';
  track.style.strokeDashoffset = '100';

  let raf = 0;
  function render() {
    const p = getScenePhase();

    const productOut = ramp(p, .07, .18);
    const lineDraw = ramp(p, .10, .20);
    product.style.opacity = String(1 - productOut);
    product.style.transform = `translate3d(0,${-productOut * 8}px,0) scale(${1 - productOut * .055})`;
    product.style.filter = `brightness(${1 - productOut * .22}) saturate(${1 - productOut * .1})`;
    track.style.strokeDashoffset = String(100 * (1 - lineDraw));

    const dbStageIn = ramp(p, .20, .27);
    const dbProof = windowValue(p, .29, .35, .41, .46);
    const dbReturn = ramp(p, .45, .49);
    const webStageIn = ramp(p, .49, .57);
    const e2eProof = windowValue(p, .58, .63, .69, .74);
    const finalTrackReturn = ramp(p, .73, .78);
    const deliveryTravel = ramp(p, .78, .84);
    const deliveredIn = ramp(p, .82, .87);
    const deliveredDraw = ramp(p, .84, .89);
    const signoffFade = cubicRamp(p, .89, .95);
    const signoffRecenter = cubicRamp(p, .92, .97);
    const proofMax = Math.max(dbProof, e2eProof);

    const releaseBase = clamp(
      lineDraw * (1 - dbStageIn) +
      dbReturn * (1 - webStageIn) +
      finalTrackReturn
    ) * (1 - proofMax);
    const releaseAlpha = releaseBase * (1 - cubicRamp(p, .88, .94));
    release.style.opacity = String(releaseAlpha);
    release.style.transform = `scale(${.97 + releaseBase * .03})`;

    let pulseX = 5;
    if (p >= .12 && p < .20) pulseX = mix(5, 41, ramp(p, .12, .20));
    else if (p >= .20 && p < .49) pulseX = 41;
    else if (p >= .49 && p < .57) pulseX = mix(41, 77, ramp(p, .49, .57));
    else if (p >= .57 && p < .78) pulseX = 77;
    else pulseX = mix(77, 105, deliveryTravel);
    pulse.setAttribute('cx', pulseX.toFixed(2));
    pulse.style.opacity = String(releaseBase * (1 - cubicRamp(p, .82, .87)));

    const visited = [lineDraw > .18, lineDraw > .55, p >= .20, p >= .49, p >= .57];
    nodes.forEach((node, index) => {
      const lit = finalTrackReturn > .45 || visited[index];
      node.classList.toggle('is-lit', lit);
    });

    const dbDraw = ramp(p, .21, .28);
    const dbVisible = dbStageIn * (1 - ramp(p, .45, .49)) * (1 - dbProof * .8);
    dbStrokes.forEach((stroke, index) => {
      const local = clamp(dbDraw * 1.25 - index * .12);
      stroke.style.strokeDashoffset = String(100 * (1 - smooth(local)));
    });
    const dbX = mix(41, 50, dbStageIn);
    dbStage.style.left = `${dbX}%`;
    dbStage.style.opacity = String(dbVisible);
    dbStage.style.transform = `translate(-50%,-50%) scale(${.18 + dbStageIn * .82 + dbProof * .18})`;
    setProof(proofs.db, readouts.db, dbProof, 50, 50, 1.03);

    const deviceBase = webStageIn * (1 - finalTrackReturn);
    const deviceVisible = deviceBase * (1 - e2eProof * .82);
    const deviceX = mix(77, 50, webStageIn);
    const desktopWidth = window.innerWidth <= 760 ? 210 : 280;
    const desktopHeight = window.innerWidth <= 760 ? 116 : 154;
    device.style.left = `${deviceX}%`;
    device.style.width = `${desktopWidth}px`;
    device.style.height = `${desktopHeight}px`;
    device.style.borderRadius = '15px';
    device.style.opacity = String(deviceVisible);
    device.style.transform = `translate(-50%,-50%) scale(${.16 + webStageIn * .84 + e2eProof * .12})`;

    const checkProgress = ramp(p, .53, .59);
    checks.forEach((check, index) => {
      const done = checkProgress > (index + 1) / checks.length;
      check.classList.toggle('is-done', done);
      check.style.opacity = String(done ? 1 : .3);
      check.style.transform = `scale(${done ? 1 : .72})`;
    });

    setProof(proofs.e2e, readouts.e2e, e2eProof, 50, 50, 1.06);

    ci.style.opacity = String(finalTrackReturn * .14 * (1 - signoffFade));
    ci.style.transform = `scale(${1.035 - finalTrackReturn * .025})`;
    finalGlow.style.opacity = String(finalTrackReturn * (1 - cubicRamp(p, .86, .92)));

    deliveredStrokes.forEach((stroke, index) => {
      const local = clamp(deliveredDraw * 1.32 - index * .16);
      stroke.style.strokeDashoffset = String(100 * (1 - smooth(local)));
    });
    const deliveredFade = 1 - cubicRamp(p, .90, .95);
    delivered.style.opacity = String(deliveredIn * deliveredFade);
    delivered.style.transform = `translate(-50%,-50%) scale(${.24 + deliveredIn * .76})`;
    deliveredLabel.style.opacity = String(ramp(deliveredDraw, .55, .9) * deliveredFade);

    // Fade the real product state in from the release endpoint, then gently recenter it.
    const signoffX = mix(88, 50, signoffRecenter);
    signoff.style.left = `${signoffX}%`;
    signoff.style.opacity = String(signoffFade);
    signoff.style.transform = `translate(-50%,-50%) scale(${mix(.84, 1, signoffFade)})`;
    signoff.style.filter = `brightness(${mix(.9, 1, signoffFade)}) saturate(${mix(.94, 1, signoffFade)})`;

    signoffHalo.style.left = `${signoffX}%`;
    signoffHalo.style.opacity = String(signoffFade * .55);
    signoffHalo.style.transform = `translate(-50%,-50%) scale(${.72 + signoffFade * .28})`;

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();
