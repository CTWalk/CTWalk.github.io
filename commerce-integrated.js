(() => {
  // CommerceOps scene — one stable product, one scenario at a time.
  // The image and scenario name carry the whole explanation.

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

    .commerce-phone{position:absolute;z-index:5;left:69%;top:50%;height:98%;aspect-ratio:412/915;transform:translate(-50%,-50%);border:1px solid rgba(255,255,255,.26);border-radius:clamp(22px,2.6vw,34px);background:#121417;box-shadow:0 38px 120px rgba(0,0,0,.5),inset 0 0 0 5px rgba(7,8,10,.94);overflow:hidden;will-change:transform,filter}
    .commerce-phone::before{content:"";position:absolute;z-index:8;left:50%;top:9px;width:25%;height:5px;transform:translateX(-50%);border-radius:99px;background:rgba(8,9,11,.82);box-shadow:0 1px 0 rgba(255,255,255,.08)}
    .commerce-phone-screen{position:absolute;inset:6px;border-radius:clamp(17px,2vw,28px);overflow:hidden;background:#f7f5ef}
    .commerce-phone-screen img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;opacity:0;will-change:opacity,transform,filter}
    .commerce-phone-screen img:first-child{opacity:1}

    .commerce-scenario-copy{position:absolute;z-index:6;left:3%;top:50%;width:min(43%,350px);transform:translateY(-50%);color:#f2f0e9;pointer-events:none}
    .commerce-scenario-slot{position:relative;height:clamp(92px,12vw,130px)}
    .commerce-scenario-state{position:absolute;inset:0;display:flex;align-items:center;opacity:0;will-change:opacity,transform,filter}
    .commerce-scenario-state:first-child{opacity:1}
    .commerce-scenario-title{margin:0;color:#fff;font:680 clamp(1.85rem,3vw,3rem)/1.04 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:-.035em}

    @media(max-width:760px){
      .commerce-showcase{left:4vw;right:auto;top:6%;width:92vw;height:49vh;max-height:475px}
      .commerce-phone{left:72%;height:98%;border-radius:23px}.commerce-phone-screen{border-radius:18px}
      .commerce-scenario-copy{left:1%;top:48%;width:46%}
      .commerce-scenario-slot{height:84px}
      .commerce-scenario-title{font-size:1.25rem;line-height:1.08}
    }
    @media(prefers-reduced-motion:reduce){
      .commerce-phone-screen img{opacity:0!important;transform:none!important;filter:none!important}
      .commerce-phone-expired{opacity:1!important}
      .commerce-scenario-state{opacity:0!important;transform:none!important;filter:none!important}
      .commerce-scenario-expired{opacity:1!important}
    }
  `;
  document.head.appendChild(style);

  const showcase = document.createElement('div');
  showcase.className = 'commerce-showcase scene-object';
  showcase.setAttribute(
    'aria-label',
    'CommerceOps QA practice scenarios: check out, expired coupon, and unavailable variant.'
  );
  showcase.innerHTML = `
    <div class="commerce-motion-root">
      <div class="commerce-scenario-copy">
        <div class="commerce-scenario-slot">
          <div class="commerce-scenario-state commerce-scenario-checkout">
            <h3 class="commerce-scenario-title">Check out</h3>
          </div>
          <div class="commerce-scenario-state commerce-scenario-expired">
            <h3 class="commerce-scenario-title">Expired coupon</h3>
          </div>
          <div class="commerce-scenario-state commerce-scenario-unavailable">
            <h3 class="commerce-scenario-title">unavailable variant</h3>
          </div>
        </div>
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
  const states = [
    showcase.querySelector('.commerce-scenario-checkout'),
    showcase.querySelector('.commerce-scenario-expired'),
    showcase.querySelector('.commerce-scenario-unavailable')
  ];

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smooth = t => t * t * (3 - 2 * t);
  const cubicOut = t => 1 - Math.pow(1 - clamp(t), 3);
  const cubicRamp = (p, start, end) => cubicOut((p - start) / Math.max(.0001, end - start));

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

    const toExpired = cubicRamp(p, .28, .40);
    const toUnavailable = cubicRamp(p, .66, .78);

    const weights = [
      1 - toExpired,
      toExpired * (1 - toUnavailable),
      toUnavailable
    ];

    images.forEach((image, index) => {
      const w = weights[index];
      image.style.opacity = String(w);
      image.style.transform = `scale(${1.012 - w * .012})`;
      image.style.filter = `brightness(${.96 + w * .04})`;
    });

    states.forEach((state, index) => {
      const w = weights[index];
      state.style.opacity = String(w);
      const direction = index === 0 ? -1 : 1;
      state.style.transform = `translateY(${(1 - w) * direction * 8}px)`;
      state.style.filter = `blur(${(1 - w) * 1.5}px)`;
    });

    phone.style.transform = `translate(-50%,-50%) scale(${1 + Math.sin(p * Math.PI) * .006})`;

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();
