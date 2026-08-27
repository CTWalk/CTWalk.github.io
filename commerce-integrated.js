(() => {
  const scene = document.querySelector('.scene[data-scene="1"]');
  const experience = document.getElementById('experience');
  const oldPlate = scene?.querySelector('.commerce-plate');
  if (!scene || !experience || !oldPlate) return;

  const assets = {
    cart: 'https://raw.githubusercontent.com/CTWalk/CommerceOps/main/assets/showcase/cart-412x915.png',
    expired: 'https://raw.githubusercontent.com/CTWalk/CommerceOps/main/assets/showcase/expired-coupon-412x915.png'
  };

  const style = document.createElement('style');
  style.dataset.commerceIntegrated = 'true';
  style.textContent = `
    .commerce-showcase{position:absolute;z-index:9;right:max(2vw,calc((100% - var(--content))/2));top:8%;width:min(58vw,860px);height:min(78vh,720px);overflow:visible;perspective:1200px;transform-style:preserve-3d;will-change:transform,opacity}
    .commerce-motion-root{position:absolute;inset:0;isolation:isolate;perspective:1200px}
    .commerce-phone{position:absolute;z-index:5;left:64%;top:50%;height:96%;aspect-ratio:412/915;transform:translate(-50%,-50%);border:1px solid rgba(255,255,255,.26);border-radius:clamp(22px,2.6vw,34px);background:#121417;box-shadow:0 38px 120px rgba(0,0,0,.5),inset 0 0 0 5px rgba(7,8,10,.94);overflow:hidden;will-change:left,transform,filter}
    .commerce-phone::before{content:"";position:absolute;z-index:8;left:50%;top:9px;width:25%;height:5px;transform:translateX(-50%);border-radius:99px;background:rgba(8,9,11,.82);box-shadow:0 1px 0 rgba(255,255,255,.08)}
    .commerce-phone-screen{position:absolute;inset:6px;border-radius:clamp(17px,2vw,28px);overflow:hidden;background:#f7f5ef}
    .commerce-phone-screen img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;will-change:opacity,transform,filter}
    .commerce-phone-cart{opacity:1}
    .commerce-phone-expired{opacity:0;transform:scale(1.018);filter:brightness(.96)}
    .commerce-ui-target{position:absolute;z-index:9;left:50%;top:68%;width:72%;height:15%;transform:translate(-50%,-50%) scale(.94);border:1px solid rgba(158,51,42,.62);border-radius:15px;box-shadow:0 0 0 5px rgba(158,51,42,.055),0 10px 28px rgba(0,0,0,.1);opacity:0;pointer-events:none;will-change:opacity,transform}

    .commerce-deck{position:absolute;z-index:2;left:57%;top:49%;width:min(39%,340px);aspect-ratio:1.28;transform:translate(-50%,-50%) rotate(-4deg) scale(.8);opacity:.48;will-change:opacity,transform}
    .commerce-deck-sheet{position:absolute;inset:0;border:1px solid rgba(255,255,255,.16);border-radius:18px;background:linear-gradient(145deg,rgba(236,233,224,.16),rgba(236,233,224,.055));box-shadow:0 24px 60px rgba(0,0,0,.2);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px)}
    .commerce-deck-sheet::before,.commerce-deck-sheet::after{content:"";position:absolute;left:18px;right:30%;height:1px;background:rgba(255,255,255,.13)}
    .commerce-deck-sheet::before{top:28px}.commerce-deck-sheet::after{top:43px}
    .commerce-deck-sheet.one{transform:translate(11px,-10px) rotate(5deg)}
    .commerce-deck-sheet.two{transform:translate(-7px,8px) rotate(-2deg)}
    .commerce-deck-sheet.three{transform:translate(3px,2px) rotate(1deg)}

    .commerce-sheet-wrap{position:absolute;z-index:7;left:57%;top:49%;width:min(39%,340px);aspect-ratio:1.28;transform:translate(-50%,-50%) rotate(-4deg) scale(.74);transform-style:preserve-3d;will-change:left,top,transform,opacity,filter}
    .commerce-sheet{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform;filter:drop-shadow(0 28px 45px rgba(0,0,0,.28))}
    .commerce-sheet-face{position:absolute;inset:0;display:flex;flex-direction:column;border:1px solid rgba(34,38,44,.18);border-radius:18px;background:#f1eee6;color:#24272c;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden}
    .commerce-sheet-face::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,rgba(255,255,255,.22),transparent 34%,rgba(70,60,48,.025));mix-blend-mode:multiply}
    .commerce-sheet-front{padding:clamp(20px,2.4vw,30px)}
    .commerce-sheet-back{padding:clamp(18px,2.2vw,27px);transform:rotateY(180deg)}
    .commerce-sheet-kicker{margin:0 0 12px;color:#727069;font:760 clamp(.58rem,.74vw,.69rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.11em;text-transform:uppercase}
    .commerce-sheet-title{margin:0;color:#22252a;font:700 clamp(1.35rem,2vw,2rem)/1.04 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:-.035em}
    .commerce-sheet-question{margin:auto 0 0;max-width:19ch;color:#4f514e;font:520 clamp(.82rem,1vw,.98rem)/1.42 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .commerce-sheet-code{display:inline-flex;align-items:center;align-self:flex-start;margin-top:15px;padding:7px 9px;border:1px solid rgba(36,39,44,.14);border-radius:8px;background:rgba(255,255,255,.42);color:#373a3f;font:700 clamp(.64rem,.76vw,.72rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.025em}
    .commerce-reference{display:grid;gap:8px;margin-top:auto}
    .commerce-ref-step{display:grid;grid-template-columns:24px 1fr;gap:8px;align-items:start;color:#4b4d49;font:560 clamp(.67rem,.82vw,.78rem)/1.28 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;opacity:0;transform:translateY(6px);will-change:opacity,transform}
    .commerce-ref-step b{display:grid;width:22px;height:22px;place-items:center;border:1px solid rgba(36,39,44,.14);border-radius:50%;color:#78766f;font:750 .55rem/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
    .commerce-reference-truth{margin-top:10px;padding-top:10px;border-top:1px solid rgba(36,39,44,.12);color:#34373b;font:700 clamp(.62rem,.76vw,.72rem)/1.45 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;opacity:0;transform:translateY(5px);will-change:opacity,transform}
    .commerce-reference-truth strong{color:#9e332a}

    .commerce-annotation{position:absolute;z-index:6;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;opacity:0;will-change:opacity}
    .commerce-annotation path{fill:none;stroke:rgba(241,238,230,.68);stroke-width:1.15;stroke-linecap:round;stroke-dasharray:100;stroke-dashoffset:100;filter:drop-shadow(0 0 7px rgba(255,255,255,.12));vector-effect:non-scaling-stroke}
    .commerce-annotation circle{fill:#f1eee6;opacity:0;filter:drop-shadow(0 0 8px rgba(255,255,255,.32))}
    .commerce-annotation-note{position:absolute;z-index:8;left:48%;top:70%;margin:0;color:rgba(255,255,255,.72);font:720 clamp(.56rem,.7vw,.66rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.09em;text-transform:uppercase;opacity:0;transform:translateY(5px);will-change:opacity,transform;pointer-events:none}

    @media(max-width:760px){
      .commerce-showcase{left:5vw;right:auto;top:6%;width:90vw;height:47vh;max-height:455px}
      .commerce-phone{left:69%;height:98%;border-radius:23px}.commerce-phone-screen{border-radius:18px}
      .commerce-deck{left:67%;top:48%;width:42%;transform:translate(-50%,-50%) rotate(-4deg) scale(.66)}
      .commerce-sheet-wrap{left:67%;top:48%;width:43%;transform:translate(-50%,-50%) rotate(-4deg) scale(.64)}
      .commerce-sheet-front{padding:14px}.commerce-sheet-back{padding:13px}
      .commerce-sheet-kicker{margin-bottom:7px;font-size:.46rem}.commerce-sheet-title{font-size:1.05rem}.commerce-sheet-question{font-size:.65rem;line-height:1.35}.commerce-sheet-code{margin-top:8px;padding:5px 6px;font-size:.49rem}
      .commerce-reference{gap:4px}.commerce-ref-step{grid-template-columns:16px 1fr;gap:5px;font-size:.5rem}.commerce-ref-step b{width:15px;height:15px;font-size:.4rem}.commerce-reference-truth{margin-top:5px;padding-top:5px;font-size:.47rem}
      .commerce-ui-target{top:68%;width:76%;height:15%;border-radius:10px}.commerce-annotation-note{font-size:.46rem}
    }
    @media(prefers-reduced-motion:reduce){
      .commerce-phone{left:69%!important;transform:translate(-50%,-50%)!important}.commerce-phone-cart{opacity:0!important}.commerce-phone-expired{opacity:1!important;transform:none!important;filter:none!important}
      .commerce-deck{opacity:.34!important}.commerce-sheet-wrap{left:21%!important;top:38%!important;opacity:1!important;transform:translate(-50%,-50%) rotate(-1deg) scale(1)!important}.commerce-sheet{transform:rotateY(180deg)!important}
      .commerce-ref-step,.commerce-reference-truth{opacity:1!important;transform:none!important}.commerce-ui-target{opacity:1!important;transform:translate(-50%,-50%) scale(1)!important}.commerce-annotation{opacity:.75!important}.commerce-annotation path{stroke-dashoffset:0!important}.commerce-annotation circle{opacity:1!important}.commerce-annotation-note{opacity:1!important;transform:none!important}
    }
  `;
  document.head.appendChild(style);

  const showcase = document.createElement('div');
  showcase.className = 'commerce-showcase scene-object';
  showcase.setAttribute('aria-label', 'CommerceOps QA practice challenge and reference verification example');
  showcase.innerHTML = `
    <div class="commerce-motion-root">
      <div class="commerce-deck" aria-hidden="true">
        <div class="commerce-deck-sheet one"></div>
        <div class="commerce-deck-sheet two"></div>
        <div class="commerce-deck-sheet three"></div>
      </div>

      <div class="commerce-phone">
        <div class="commerce-phone-screen">
          <img class="commerce-phone-cart" src="${assets.cart}" alt="CommerceOps cart screen" />
          <img class="commerce-phone-expired" src="${assets.expired}" alt="CommerceOps cart showing an expired coupon result" />
          <div class="commerce-ui-target" aria-hidden="true"></div>
        </div>
      </div>

      <div class="commerce-sheet-wrap">
        <div class="commerce-sheet">
          <section class="commerce-sheet-face commerce-sheet-front">
            <p class="commerce-sheet-kicker">QA PRACTICE · NEGATIVE PATH</p>
            <h3 class="commerce-sheet-title">Expired coupon</h3>
            <p class="commerce-sheet-question">Does <strong>WELCOME20</strong> actually reduce the order?</p>
            <span class="commerce-sheet-code">TRY THE PRODUCT</span>
          </section>
          <section class="commerce-sheet-face commerce-sheet-back">
            <p class="commerce-sheet-kicker">REFERENCE</p>
            <h3 class="commerce-sheet-title">What should be verified?</h3>
            <div class="commerce-reference">
              <div class="commerce-ref-step"><b>1</b><span>Observe the customer result.</span></div>
              <div class="commerce-ref-step"><b>2</b><span>Verify the persisted coupon state.</span></div>
              <div class="commerce-ref-step"><b>3</b><span>Confirm no discount was applied.</span></div>
            </div>
            <div class="commerce-reference-truth">WELCOME20 · <strong>rejected</strong> · expired</div>
          </section>
        </div>
      </div>

      <svg class="commerce-annotation" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength="100" d="M43 58 C53 58 55 67 66 68" />
        <circle cx="66" cy="68" r=".8" />
      </svg>
      <p class="commerce-annotation-note" aria-hidden="true">EXPECTED EVIDENCE</p>
    </div>
  `;
  oldPlate.replaceWith(showcase);

  const blur = scene.querySelector('.scene-blur');
  if (blur) {
    blur.src = assets.cart;
    blur.style.objectPosition = 'center 38%';
  }
  const repoLink = scene.querySelector('.scene-link');
  if (repoLink) repoLink.href = 'https://github.com/CTWalk/CommerceOps';

  const phone = showcase.querySelector('.commerce-phone');
  const cart = showcase.querySelector('.commerce-phone-cart');
  const expired = showcase.querySelector('.commerce-phone-expired');
  const target = showcase.querySelector('.commerce-ui-target');
  const deck = showcase.querySelector('.commerce-deck');
  const sheetWrap = showcase.querySelector('.commerce-sheet-wrap');
  const sheet = showcase.querySelector('.commerce-sheet');
  const steps = [...showcase.querySelectorAll('.commerce-ref-step')];
  const truth = showcase.querySelector('.commerce-reference-truth');
  const annotation = showcase.querySelector('.commerce-annotation');
  const annotationPath = showcase.querySelector('.commerce-annotation path');
  const annotationDot = showcase.querySelector('.commerce-annotation circle');
  const annotationNote = showcase.querySelector('.commerce-annotation-note');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smooth = t => t * t * (3 - 2 * t);
  const ramp = (p, start, end) => smooth(clamp((p - start) / Math.max(.0001, end - start)));
  const cubicOut = t => 1 - Math.pow(1 - clamp(t), 3);
  const cubicRamp = (p, start, end) => cubicOut((p - start) / Math.max(.0001, end - start));
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
    return clamp(((step - 1) + .43) / .88);
  }

  let raf = 0;
  function render() {
    const p = getScenePhase();
    const mobile = window.innerWidth <= 760;

    const pull = cubicRamp(p, .10, .27);
    const scenario = cubicRamp(p, .27, .41);
    const flip = cubicRamp(p, .46, .60);
    const annotationIn = ramp(p, .67, .74);
    const annotationOut = ramp(p, .82, .90);
    const annotationAmount = annotationIn * (1 - annotationOut);
    const putAway = cubicRamp(p, .84, .97);

    const startLeft = mobile ? 67 : 57;
    const pulledLeft = mobile ? 22 : 16;
    const startTop = mobile ? 48 : 49;
    const pulledTop = mobile ? 33 : 37;
    const startScale = mobile ? .64 : .74;
    const pulledScale = mobile ? .86 : 1;

    const leftAfterPull = mix(startLeft, pulledLeft, pull);
    const topAfterPull = mix(startTop, pulledTop, pull);
    const scaleAfterPull = mix(startScale, pulledScale, pull);
    const rotateAfterPull = mix(-4, -1, pull);

    sheetWrap.style.left = `${mix(leftAfterPull, startLeft, putAway)}%`;
    sheetWrap.style.top = `${mix(topAfterPull, startTop, putAway)}%`;
    const returnScale = mix(scaleAfterPull, startScale, putAway);
    const returnRotate = mix(rotateAfterPull, -4, putAway);
    sheetWrap.style.transform = `translate(-50%,-50%) rotate(${returnRotate}deg) scale(${returnScale * (1 - Math.sin(flip * Math.PI) * .025)})`;
    sheetWrap.style.opacity = String(1 - putAway * .34);
    sheetWrap.style.filter = `brightness(${1 - putAway * .08})`;

    sheet.style.transform = `rotateY(${flip * 180}deg)`;

    const phoneStart = mobile ? 69 : 64;
    const phoneOpen = mobile ? 74 : 71;
    const phoneLeft = mix(mix(phoneStart, phoneOpen, pull), phoneStart, putAway);
    phone.style.left = `${phoneLeft}%`;
    phone.style.transform = `translate(-50%,-50%) scale(${1 - pull * .018 + putAway * .018})`;
    phone.style.filter = `brightness(${1 - pull * .035 + annotationAmount * .025})`;

    cart.style.opacity = String(1 - scenario);
    cart.style.transform = `scale(${1 - scenario * .018})`;
    expired.style.opacity = String(scenario);
    expired.style.transform = `scale(${1.018 - scenario * .018})`;
    expired.style.filter = `brightness(${.96 + scenario * .04})`;

    deck.style.opacity = String(.48 - pull * .3 + putAway * .5);
    deck.style.transform = `translate(-50%,-50%) rotate(${-4 + pull * 2 - putAway * 2}deg) scale(${(mobile ? .66 : .8) + putAway * .03})`;

    steps.forEach((node, index) => {
      const visible = ramp(p, .58 + index * .055, .65 + index * .055) * (1 - putAway);
      node.style.opacity = String(visible);
      node.style.transform = `translateY(${(1 - visible) * 6}px)`;
    });
    const truthIn = ramp(p, .72, .79) * (1 - putAway);
    truth.style.opacity = String(truthIn);
    truth.style.transform = `translateY(${(1 - truthIn) * 5}px)`;

    annotation.style.opacity = String(annotationAmount);
    annotationPath.style.strokeDashoffset = String(100 * (1 - annotationAmount));
    annotationDot.style.opacity = String(ramp(annotationAmount, .72, 1));
    target.style.opacity = String(annotationAmount);
    target.style.transform = `translate(-50%,-50%) scale(${.94 + annotationAmount * .06})`;
    annotationNote.style.opacity = String(annotationAmount);
    annotationNote.style.transform = `translateY(${(1 - annotationAmount) * 5}px)`;

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();
