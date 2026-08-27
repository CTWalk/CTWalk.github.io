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
    .social-showcase{
      top:12%;
      right:max(2.5vw,calc((100% - var(--content))/2));
      width:min(56vw,840px);
      border-radius:clamp(14px,1.6vw,24px);
      background:#0d1117
    }
    .social-oryzo-product,.social-oryzo-ci-world,.social-oryzo-proof{
      position:absolute;inset:0;width:100%;height:100%
    }
    .social-oryzo-product{
      z-index:1;object-fit:cover;object-position:center top;background:#0d1117;
      will-change:opacity,transform,filter
    }
    .social-oryzo-ci-world{
      z-index:2;overflow:hidden;opacity:0;transform-origin:center;
      clip-path:inset(8% 9% 8% 9% round 20px);
      will-change:opacity,transform,clip-path
    }
    .social-oryzo-ci-base,.social-oryzo-ci-focus{
      position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#0d1117;
      transform-origin:center;will-change:opacity,filter,clip-path
    }
    .social-oryzo-ci-base{z-index:1}
    .social-oryzo-ci-focus{
      z-index:2;opacity:0;filter:brightness(1.06) contrast(1.02) saturate(1.02);
      clip-path:inset(50% 1.5% 50% 1.5% round 5px)
    }
    .social-oryzo-proof{
      z-index:4;opacity:0;background:#0d1117;object-fit:contain;
      clip-path:inset(48% 7% 48% 7% round 10px);
      transform:scale(.96);transform-origin:center;
      will-change:opacity,transform,clip-path,filter
    }
    .social-oryzo-proof-db{object-fit:cover;object-position:center}
    .social-oryzo-proof-e2e,.social-oryzo-proof-mobile{padding:5.5% 3.5%;background:#0d1117}
    @media(max-width:760px){
      .social-showcase{left:4vw;right:auto;top:8%;width:92vw;max-height:44vh}
      .social-oryzo-proof-e2e,.social-oryzo-proof-mobile{padding:4% 2%}
    }
    @media(prefers-reduced-motion:reduce){
      .social-oryzo-product,.social-oryzo-ci-focus,.social-oryzo-proof{display:none!important}
      .social-oryzo-ci-world{opacity:1!important;transform:none!important;clip-path:none!important}
      .social-oryzo-ci-base{filter:none!important}
    }
  `;
  document.head.appendChild(style);

  showcase.innerHTML = `
    <img class="social-oryzo-product" src="${assets.product}" alt="SocialPlatform desktop review queue" />
    <div class="social-oryzo-ci-world" aria-hidden="true">
      <img class="social-oryzo-ci-base" src="${assets.ci}" alt="" />
      <img class="social-oryzo-ci-focus" src="${assets.ci}" alt="" />
    </div>
    <img class="social-oryzo-proof social-oryzo-proof-db" src="${assets.db}" alt="Database integrity execution evidence from the same successful CI run" />
    <img class="social-oryzo-proof social-oryzo-proof-e2e" src="${assets.e2e}" alt="Playwright E2E result showing six tests passed" />
    <img class="social-oryzo-proof social-oryzo-proof-mobile" src="${assets.mobile}" alt="Mobile layout test result showing two tests passed" />
  `;

  const product = showcase.querySelector('.social-oryzo-product');
  const ciWorld = showcase.querySelector('.social-oryzo-ci-world');
  const ciBase = showcase.querySelector('.social-oryzo-ci-base');
  const ciFocus = showcase.querySelector('.social-oryzo-ci-focus');
  const proofs = {
    db: showcase.querySelector('.social-oryzo-proof-db'),
    e2e: showcase.querySelector('.social-oryzo-proof-e2e'),
    mobile: showcase.querySelector('.social-oryzo-proof-mobile')
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smooth = t => t * t * (3 - 2 * t);
  const mix = (a, b, t) => a + (b - a) * t;
  const ramp = (p, start, end) => smooth(clamp((p - start) / Math.max(.0001, end - start)));

  const jobs = {
    db: { y: .53 },
    e2e: { y: .71 },
    mobile: { y: .84 }
  };

  const proofRanges = {
    db: { openStart: .34, openEnd: .40, closeStart: .51, closeEnd: .57 },
    e2e: { openStart: .63, openEnd: .67, closeStart: .74, closeEnd: .78 },
    mobile: { openStart: .82, openEnd: .85, closeStart: .90, closeEnd: .93 }
  };

  const focusRanges = {
    db: { inStart: .29, inEnd: .33, outStart: .57, outEnd: .60 },
    e2e: { inStart: .59, inEnd: .62, outStart: .78, outEnd: .80 },
    mobile: { inStart: .79, inEnd: .81, outStart: .93, outEnd: .95 }
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
    return clamp(((step - 3) + .42) / .84);
  }

  function holdValue(phase, range) {
    if (phase < range.openStart) return 0;
    if (phase < range.openEnd) return ramp(phase, range.openStart, range.openEnd);
    if (phase <= range.closeStart) return 1;
    if (phase < range.closeEnd) return 1 - ramp(phase, range.closeStart, range.closeEnd);
    return 0;
  }

  function focusValue(phase, range) {
    if (phase < range.inStart) return 0;
    if (phase < range.inEnd) return ramp(phase, range.inStart, range.inEnd);
    if (phase <= range.outStart) return 1;
    if (phase < range.outEnd) return 1 - ramp(phase, range.outStart, range.outEnd);
    return 0;
  }

  function setProof(node, amount, originY, finalScale) {
    if (!node) return;
    const center = originY * 100;
    const bandHalf = mix(3.2, 50, amount);
    const top = clamp(center - bandHalf, 0, 96);
    const bottom = clamp(100 - (center + bandHalf), 0, 96);
    const side = mix(7, 0, amount);
    const radius = mix(10, 0, amount);
    node.style.opacity = String(amount);
    node.style.transformOrigin = `50% ${center}%`;
    node.style.transform = `scale(${mix(.96, finalScale, amount)})`;
    node.style.clipPath = `inset(${top}% ${side}% ${bottom}% ${side}% round ${radius}px)`;
    node.style.filter = `brightness(${mix(.92, 1, amount)})`;
  }

  function activeFocus(dbFocus, e2eFocus, mobileFocus) {
    if (dbFocus >= e2eFocus && dbFocus >= mobileFocus && dbFocus > 0) return { y: jobs.db.y, amount: dbFocus };
    if (e2eFocus >= mobileFocus && e2eFocus > 0) return { y: jobs.e2e.y, amount: e2eFocus };
    if (mobileFocus > 0) return { y: jobs.mobile.y, amount: mobileFocus };
    return { y: .5, amount: 0 };
  }

  let raf = 0;
  function render() {
    const phase = getScenePhase();

    // Hero transition: the product recedes while the CI surface grows into the same visual territory.
    const hero = ramp(phase, .11, .23);
    product.style.opacity = String(1 - hero);
    product.style.transform = `scale(${1 - hero * .045})`;
    product.style.filter = `brightness(${1 - hero * .18}) saturate(${1 - hero * .08})`;

    const dbProof = holdValue(phase, proofRanges.db);
    const e2eProof = holdValue(phase, proofRanges.e2e);
    const mobileProof = holdValue(phase, proofRanges.mobile);
    const proofMax = Math.max(dbProof, e2eProof, mobileProof);

    const dbFocus = focusValue(phase, focusRanges.db);
    const e2eFocus = focusValue(phase, focusRanges.e2e);
    const mobileFocus = focusValue(phase, focusRanges.mobile);
    const focus = activeFocus(dbFocus, e2eFocus, mobileFocus);

    const finalPullback = ramp(phase, .94, .985);
    const heroInset = (1 - hero) * 8;
    const heroSideInset = (1 - hero) * 9;
    const focusScale = focus.amount * .028;
    const pushScale = proofMax * .012;
    const ciScale = 1 + hero * .012 + focusScale + pushScale - finalPullback * .012;

    ciWorld.style.opacity = String(hero * (1 - proofMax));
    ciWorld.style.transformOrigin = `50% ${focus.y * 100}%`;
    ciWorld.style.transform = `scale(${ciScale})`;
    ciWorld.style.clipPath = `inset(${heroInset}% ${heroSideInset}% ${heroInset}% ${heroSideInset}% round ${mix(20, 0, hero)}px)`;

    // The real CI capture is the only focus UI: nearby content quiets, selected real pixels stay crisp.
    ciBase.style.filter = `brightness(${1 - focus.amount * .16}) saturate(${1 - focus.amount * .06})`;
    const bandHalf = 4.1;
    const focusTop = clamp(focus.y * 100 - bandHalf, 0, 100);
    const focusBottom = clamp(100 - (focus.y * 100 + bandHalf), 0, 100);
    ciFocus.style.opacity = String(focus.amount * (1 - proofMax));
    ciFocus.style.clipPath = `inset(${focusTop}% 1.5% ${focusBottom}% 1.5% round 5px)`;

    // Each proof uses the same origin relationship, but its own framing and tempo.
    setProof(proofs.db, dbProof, jobs.db.y, 1.02);
    setProof(proofs.e2e, e2eProof, jobs.e2e.y, 1.14);
    setProof(proofs.mobile, mobileProof, jobs.mobile.y, 1.12);

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();
