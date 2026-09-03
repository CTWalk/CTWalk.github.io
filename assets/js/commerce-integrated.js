(() => {
  // CommerceOps scene — one stable product, one scenario at a time.
  // Scenario names are oversized transition graphics, not persistent competing headlines.

  const scene = document.querySelector('.scene[data-scene="1"]');
  const experience = document.getElementById('experience');
  const oldPlate = scene?.querySelector('.commerce-plate');
  if (!scene || !experience || !oldPlate) return;

  const assets = {
    checkout: 'https://raw.githubusercontent.com/CTWalk/CommerceOps/main/assets/showcase/checkout-412x915.png',
    expired: 'https://raw.githubusercontent.com/CTWalk/CommerceOps/main/assets/showcase/expired-coupon-412x915.png',
    unavailable: 'https://raw.githubusercontent.com/CTWalk/CommerceOps/main/assets/showcase/unavailable-variant-412x1000.png'
  };

  const style = document.createElement('style');
  style.dataset.commerceIntegrated = 'true';
  style.textContent = `
    .commerce-showcase{position:absolute;z-index:9;right:max(2vw,calc((100% - var(--content))/2));top:8%;width:min(59vw,870px);height:min(78vh,720px);overflow:visible;will-change:transform,opacity}
    .commerce-motion-root{position:absolute;inset:0;isolation:isolate}

    .commerce-transition-layer{position:absolute;z-index:4;right:0;left:auto;top:0;width:100vw;height:100%;overflow:visible;pointer-events:none}
    .commerce-transition-word{position:absolute;left:25%;top:49%;margin:0;max-width:none;color:#f5a524;font:650 clamp(7.2rem,13vw,13.8rem)/.88 Arial,"Helvetica Neue",Helvetica,sans-serif;letter-spacing:0;white-space:nowrap;text-transform:uppercase;text-shadow:0 18px 64px rgba(0,0,0,.26);opacity:0;transform:translate(-50%,-50%);will-change:left,opacity,transform}
    .commerce-transition-expired{top:46%}
    .commerce-transition-unavailable{top:49%}

    .commerce-phone{position:absolute;z-index:5;left:69%;top:50%;height:98%;aspect-ratio:412/915;transform:translate(-50%,-50%);border:1px solid rgba(255,255,255,.26);border-radius:clamp(22px,2.6vw,34px);background:#121417;box-shadow:0 38px 120px rgba(0,0,0,.5),inset 0 0 0 5px rgba(7,8,10,.94);overflow:hidden;will-change:transform,filter}
    .commerce-phone::before{content:"";position:absolute;z-index:8;left:50%;top:9px;width:25%;height:5px;transform:translateX(-50%);border-radius:99px;background:rgba(8,9,11,.82);box-shadow:0 1px 0 rgba(255,255,255,.08)}
    .commerce-phone-screen{position:absolute;inset:6px;border-radius:clamp(17px,2vw,28px);overflow:hidden;background:#f7f5ef}
    .commerce-phone-screen img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;opacity:0;will-change:opacity,transform,filter}
    .commerce-phone-screen img:first-child{opacity:1}

    @media(max-width:760px){
      .commerce-showcase{left:4vw;right:auto;top:6%;width:92vw;height:49vh;max-height:475px}
      .commerce-phone{left:72%;height:98%;border-radius:23px}.commerce-phone-screen{border-radius:18px}
      .commerce-transition-layer{right:-4vw;width:100vw}
      .commerce-transition-word{left:25%;top:48%;font-size:clamp(5rem,23vw,7.4rem);letter-spacing:0}
      .commerce-transition-expired{top:43%}
      .commerce-transition-unavailable{top:48%}
    }
    @media(prefers-reduced-motion:reduce){
      .commerce-phone-screen img{opacity:0!important;transform:none!important;filter:none!important}
      .commerce-phone-screen img.commerce-phone-expired{opacity:1!important}
      .commerce-transition-layer{display:none!important}
    }
  `;
  document.head.appendChild(style);

  const showcase = document.createElement('div');
  showcase.className = 'commerce-showcase scene-object';
  showcase.setAttribute(
    'aria-label',
    'CommerceOps QA practice scenarios: check out, expired promo, and unavailable.'
  );
  showcase.innerHTML = `
    <div class="commerce-motion-root">
      <div class="commerce-transition-layer" aria-hidden="true">
        <p class="commerce-transition-word commerce-transition-checkout">CHECK OUT</p>
        <p class="commerce-transition-word commerce-transition-expired">EXPIRED PROMO</p>
        <p class="commerce-transition-word commerce-transition-unavailable">UNAVAILABLE</p>
      </div>

      <div class="commerce-phone">
        <div class="commerce-phone-screen">
          <img class="commerce-phone-checkout" src="${assets.checkout}" alt="CommerceOps checkout screen" />
          <img class="commerce-phone-expired" src="${assets.expired}" alt="CommerceOps cart showing the expired WELCOME20 coupon result" />
          <img class="commerce-phone-unavailable" src="${assets.unavailable}" alt="CommerceOps product screen showing an unavailable variant" />
        </div>
      </div>
    </div>
  `;
  oldPlate.replaceWith(showcase);

  const blur = scene.querySelector('.scene-blur');
  if (blur) {
    blur.src = assets.checkout;
    blur.style.objectPosition = 'center 42%';
  }
  const repoLink = scene.querySelector('.scene-link');
  if (repoLink) repoLink.href = 'https://github.com/CTWalk/CommerceOps';

  const phone = showcase.querySelector('.commerce-phone');
  const images = [
    showcase.querySelector('.commerce-phone-checkout'),
    showcase.querySelector('.commerce-phone-expired'),
    showcase.querySelector('.commerce-phone-unavailable')
  ];
  const words = {
    checkout: showcase.querySelector('.commerce-transition-checkout'),
    expired: showcase.querySelector('.commerce-transition-expired'),
    unavailable: showcase.querySelector('.commerce-transition-unavailable')
  };

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

  function setSweep(node, p, start, end, fromX = 25, toX = 96, scalePeak = 1.03) {
    const local = clamp((p - start) / Math.max(.0001, end - start));
    const enter = ramp(local, .02, .18);
    const exit = 1 - ramp(local, .78, .98);
    const visible = enter * exit;
    const move = cubicOut(clamp((local - .18) / .8));
    const pulse = Math.sin(local * Math.PI);

    node.style.left = `${mix(fromX, toX, move)}%`;
    node.style.opacity = String(visible * .58);
    node.style.transform = `translate(-50%,-50%) scale(${1 + pulse * (scalePeak - 1)})`;

    return pulse * visible;
  }

  let raf = 0;
  function render() {
    const p = getScenePhase();

    // CHECK OUT now gets a deliberate resting beat before the first failure case.
    // The later EXPIRED -> UNAVAILABLE gap was already working, so that spacing stays intact.
    const checkoutEvent = setSweep(words.checkout, p, .03, .22, 25, 96, 1.025);
    const expiredEvent = setSweep(words.expired, p, .29, .50, 25, 96, 1.035);
    const unavailableEvent = setSweep(words.unavailable, p, .61, .84, 25, 96, 1.035);

    const toExpired = cubicRamp(p, .37, .45);
    const toUnavailable = cubicRamp(p, .68, .76);

    const weights = [
      1 - toExpired,
      toExpired * (1 - toUnavailable),
      toUnavailable
    ];

    images.forEach((image, index) => {
      const w = weights[index];
      image.style.opacity = String(w);
      image.style.transform = `scale(${1.014 - w * .014})`;
      image.style.filter = `brightness(${.955 + w * .045})`;
    });

    const eventPush = Math.max(checkoutEvent, expiredEvent, unavailableEvent);
    phone.style.transform = `translate(-50%,-50%) scale(${1 + eventPush * .035})`;
    phone.style.filter = `brightness(${1 + eventPush * .018})`;

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();
