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
    mobile: 'https://github.com/user-attachments/assets/9c8a5f0e-b383-4a6e-b186-52b95149794b'
  };

  const style = document.createElement('style');
  style.dataset.socialIntegrated = 'true';
  style.textContent = `
    .social-v2-product,.social-v2-ci-world,.social-v2-proof{position:absolute;inset:0;width:100%;height:100%}
    .social-v2-product{z-index:1;object-fit:cover;object-position:center top;background:#0d1117;will-change:opacity,transform,filter}
    .social-v2-ci-world{z-index:2;opacity:0;transform-origin:center;will-change:opacity,transform}
    .social-v2-ci-base,.social-v2-ci-lens{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#0d1117;transform-origin:center;will-change:filter,opacity,clip-path}
    .social-v2-ci-base{z-index:1}
    .social-v2-ci-lens{z-index:2;opacity:0;filter:brightness(1.1) saturate(1.05);clip-path:inset(50% 3% 50% 3% round 8px)}
    .social-v2-job{position:absolute;z-index:3;left:6%;right:6%;top:50%;height:38px;display:flex;align-items:center;gap:9px;padding:0 10px;border-left:2px solid rgba(125,230,181,.9);background:linear-gradient(90deg,rgba(8,12,18,.88),rgba(8,12,18,.32) 62%,transparent);color:#f0f3f7;opacity:0;transform:translateY(-50%);pointer-events:none;will-change:top,opacity,transform}
    .social-v2-job-check{display:grid;width:18px;height:18px;place-items:center;border-radius:50%;background:rgba(125,230,181,.13);color:#9be9c2;font:750 .67rem/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;border:1px solid rgba(155,233,194,.25)}
    .social-v2-job strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:680 clamp(.61rem,.78vw,.75rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.015em;text-shadow:0 2px 12px rgba(0,0,0,.72)}
    .social-v2-proof{z-index:4;object-fit:contain;background:#0d1117;opacity:0;clip-path:inset(47% 12% 47% 12% round 10px);transform:scale(.72);will-change:opacity,transform,clip-path,filter;box-shadow:0 28px 80px rgba(0,0,0,.36)}
    .social-v2-proof-db{object-fit:cover;object-position:center}
    .social-v2-proof-e2e,.social-v2-proof-mobile{padding:7% 4%;background:#0d1117}
    @media(max-width:760px){
      .social-v2-job{left:4%;right:4%;height:30px;gap:6px;padding:0 7px}
      .social-v2-job-check{width:15px;height:15px;font-size:.56rem}
      .social-v2-job strong{font-size:.53rem}
      .social-v2-proof-e2e,.social-v2-proof-mobile{padding:5% 2%}
    }
    @media(prefers-reduced-motion:reduce){
      .social-v2-product,.social-v2-proof,.social-v2-ci-lens,.social-v2-job{display:none!important}
      .social-v2-ci-world{opacity:1!important;transform:none!important}
      .social-v2-ci-base{filter:none!important}
    }
  `;
  document.head.appendChild(style);

  showcase.innerHTML = `
    <img class="social-v2-product" src="${assets.product}" alt="SocialPlatform desktop review queue" />
    <div class="social-v2-ci-world" aria-hidden="true">
      <img class="social-v2-ci-base" src="${assets.ci}" alt="" />
      <img class="social-v2-ci-lens" src="${assets.ci}" alt="" />
      <div class="social-v2-job"><span class="social-v2-job-check">✓</span><strong></strong></div>
    </div>
    <img class="social-v2-proof social-v2-proof-db" src="${assets.db}" alt="Database integrity execution evidence from the same successful CI run" />
    <img class="social-v2-proof social-v2-proof-e2e" src="${assets.e2e}" alt="Playwright E2E result showing six tests passed" />
    <img class="social-v2-proof social-v2-proof-mobile" src="${assets.mobile}" alt="Mobile layout test result showing two tests passed" />
  `;

  const product = showcase.querySelector('.social-v2-product');
  const ciWorld = showcase.querySelector('.social-v2-ci-world');
  const ciBase = showcase.querySelector('.social-v2-ci-base');
  const ciLens = showcase.querySelector('.social-v2-ci-lens');
  const job = showcase.querySelector('.social-v2-job');
  const jobName = job.querySelector('strong');
  const proofs = {
    db: showcase.querySelector('.social-v2-proof-db'),
    e2e: showcase.querySelector('.social-v2-proof-e2e'),
    mobile: showcase.querySelector('.social-v2-proof-mobile')
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smooth = t => t * t * (3 - 2 * t);
  const mix = (a, b, t) => a + (b - a) * t;
  const windowValue = (p, start, inEnd, outStart, end) =>
    smooth(clamp((p - start) / Math.max(.0001, inEnd - start))) *
    (1 - smooth(clamp((p - outStart) / Math.max(.0001, end - outStart))));

  const jobs = {
    db: { y: .53, name: 'db-integrity-tests' },
    e2e: { y: .71, name: 'e2e-tests' },
    mobile: { y: .84, name: 'mobile-layout-tests' }
  };

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
    const rel = step - 3;
    return clamp((rel + .42) / .84);
  }

  function proofValue(phase, type) {
    if (type === 'db') return windowValue(phase, .27, .36, .42, .48);
    if (type === 'e2e') return windowValue(phase, .54, .60, .64, .69);
    return windowValue(phase, .74, .80, .84, .89);
  }

  function currentJob(phase) {
    if (phase < .48) return { ...jobs.db, type: 'db' };
    if (phase < .54) {
      const t = smooth(clamp((phase - .48) / .06));
      return { y: mix(jobs.db.y, jobs.e2e.y, t), name: t < .5 ? jobs.db.name : jobs.e2e.name, type: t < .5 ? 'db' : 'e2e' };
    }
    if (phase < .69) return { ...jobs.e2e, type: 'e2e' };
    if (phase < .74) {
      const t = smooth(clamp((phase - .69) / .05));
      return { y: mix(jobs.e2e.y, jobs.mobile.y, t), name: t < .5 ? jobs.e2e.name : jobs.mobile.name, type: t < .5 ? 'e2e' : 'mobile' };
    }
    return { ...jobs.mobile, type: 'mobile' };
  }

  function setProof(node, amount, originY) {
    if (!node) return;
    const halfHeight = mix(3.2, 46, amount);
    const center = originY * 100;
    const top = clamp(center - halfHeight, 0, 96);
    const bottom = clamp(100 - (center + halfHeight), 0, 96);
    const side = mix(12, 3.5, amount);
    node.style.opacity = String(amount);
    node.style.transformOrigin = `50% ${center}%`;
    node.style.transform = `scale(${.72 + amount * .31})`;
    node.style.clipPath = `inset(${top}% ${side}% ${bottom}% ${side}% round ${10 + amount * 8}px)`;
    node.style.filter = `brightness(${.86 + amount * .14})`;
  }

  let raf = 0;
  function render() {
    const phase = getScenePhase();
    const productOut = smooth(clamp((phase - .10) / .10));
    const ciIn = smooth(clamp((phase - .12) / .10));
    const dbProof = proofValue(phase, 'db');
    const e2eProof = proofValue(phase, 'e2e');
    const mobileProof = proofValue(phase, 'mobile');
    const proofMax = Math.max(dbProof, e2eProof, mobileProof);
    const markerIn = smooth(clamp((phase - .20) / .05));
    const markerOut = 1 - smooth(clamp((phase - .89) / .055));
    const markerAlpha = markerIn * markerOut * (1 - proofMax * .78);
    const focus = markerIn * markerOut;
    const active = currentJob(phase);

    product.style.opacity = String(1 - productOut);
    product.style.transform = `translate3d(0,${-productOut * 5}px,0) scale(${1 - productOut * .045})`;
    product.style.filter = `brightness(${1 - productOut * .16})`;

    const panPercent = (0.5 - active.y) * 40 * focus;
    const ciScale = 1 + focus * .075;
    ciWorld.style.opacity = String(ciIn * (1 - proofMax * .62));
    ciWorld.style.transform = `translate3d(0,${panPercent}%,0) scale(${ciScale})`;
    ciBase.style.filter = `brightness(${1 - focus * .31 - proofMax * .18}) saturate(${1 - focus * .12})`;

    const band = 4.4;
    const top = clamp(active.y * 100 - band, 0, 100);
    const bottom = clamp(100 - (active.y * 100 + band), 0, 100);
    ciLens.style.opacity = String(markerAlpha * .96);
    ciLens.style.clipPath = `inset(${top}% 2.5% ${bottom}% 2.5% round 8px)`;

    job.style.top = `${active.y * 100}%`;
    job.style.opacity = String(markerAlpha);
    job.style.transform = `translateY(-50%) scale(${.985 + markerAlpha * .015})`;
    jobName.textContent = active.name;

    const screenY = clamp(.5 + (active.y - .5) * ciScale + panPercent / 100, .08, .92);
    setProof(proofs.db, dbProof, screenY);
    setProof(proofs.e2e, e2eProof, screenY);
    setProof(proofs.mobile, mobileProof, screenY);

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();
