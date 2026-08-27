(() => {
  // CommerceOps scene — negative-path validation thesis.
  // Motion grammar: REFRAME -> DISPROVE -> REPLACE.
  //
  // The phone owns the scene first. Scroll widens the framing to reveal one
  // inspection slot beside the same product. The weak page assertion is struck,
  // then the DB assertion replaces it in exactly the same position.

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
    .commerce-showcase{position:absolute;z-index:9;right:max(2vw,calc((100% - var(--content))/2));top:8%;width:min(59vw,870px);height:min(78vh,720px);overflow:hidden;will-change:transform,opacity}
    .commerce-motion-root{position:absolute;inset:0;isolation:isolate}
    .commerce-stage-shadow{position:absolute;z-index:0;left:5%;right:3%;bottom:4%;height:26%;border-radius:50%;background:radial-gradient(ellipse at center,rgba(0,0,0,.24),rgba(0,0,0,0) 70%);filter:blur(22px);opacity:.72;pointer-events:none}

    .commerce-phone{position:absolute;z-index:5;left:57%;top:50%;height:96%;aspect-ratio:412/915;transform:translate(-50%,-50%) scale(1.035);border:1px solid rgba(255,255,255,.26);border-radius:clamp(22px,2.6vw,34px);background:#121417;box-shadow:0 38px 120px rgba(0,0,0,.5),inset 0 0 0 5px rgba(7,8,10,.94);overflow:hidden;will-change:left,transform,filter}
    .commerce-phone::before{content:"";position:absolute;z-index:8;left:50%;top:9px;width:25%;height:5px;transform:translateX(-50%);border-radius:99px;background:rgba(8,9,11,.82);box-shadow:0 1px 0 rgba(255,255,255,.08)}
    .commerce-phone-screen{position:absolute;inset:6px;border-radius:clamp(17px,2vw,28px);overflow:hidden;background:#f7f5ef}
    .commerce-phone-screen img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;will-change:opacity,transform,filter}
    .commerce-phone-cart{opacity:1}
    .commerce-phone-expired{opacity:0;transform:scale(1.012);filter:brightness(.97)}

    .commerce-inspection{position:absolute;z-index:4;left:27%;top:49%;width:min(48%,410px);height:min(43%,300px);transform:translate(-50%,-50%) translateX(-22px);border:1px solid rgba(35,39,44,.17);border-radius:20px;background:#f1eee6;color:#23262b;box-shadow:0 30px 75px rgba(0,0,0,.28);opacity:0;clip-path:inset(0 100% 0 0 round 20px);will-change:opacity,transform,clip-path,filter}
    .commerce-inspection::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(118deg,rgba(255,255,255,.22),transparent 38%,rgba(70,60,48,.025));mix-blend-mode:multiply}
    .commerce-inspection-head{position:absolute;z-index:3;left:clamp(20px,2.3vw,30px);right:clamp(20px,2.3vw,30px);top:clamp(18px,2vw,25px)}
    .commerce-practice-label{margin:0;color:#74716a;font:760 clamp(.56rem,.72vw,.67rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.11em;text-transform:uppercase}
    .commerce-inspection-title{margin:11px 0 0;color:#22252a;font:700 clamp(1.28rem,1.95vw,1.95rem)/1.05 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:-.035em}

    .commerce-slot{position:absolute;z-index:3;left:clamp(20px,2.3vw,30px);right:clamp(20px,2.3vw,30px);bottom:clamp(22px,2.5vw,34px);height:35%;overflow:hidden}
    .assertion-state{position:absolute;left:0;right:0;bottom:0;will-change:opacity,transform,filter}
    .assertion-label{margin:0 0 clamp(6px,.72vw,9px);color:#77736b;font:760 clamp(.54rem,.68vw,.63rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.1em;text-transform:uppercase}
    .assertion-code{position:relative;margin:0;color:#2e3135;font:700 clamp(.72rem,.9vw,.86rem)/1.35 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.015em;white-space:nowrap}
    .assertion-code .k{color:#9e332a}
    .assertion-naive{opacity:0;transform:translateX(12px)}
    .assertion-proof{opacity:0;transform:translateX(18px)}
    .assertion-strike{position:absolute;left:-2px;right:100%;top:50%;height:2px;background:#9e332a;transform:translateY(-50%) rotate(-1.5deg);transform-origin:left center;pointer-events:none;box-shadow:0 0 0 .5px rgba(158,51,42,.35);will-change:right,opacity}

    @media(max-width:760px){
      .commerce-showcase{left:4vw;right:auto;top:6%;width:92vw;height:49vh;max-height:475px}
      .commerce-phone{left:54%;height:98%;border-radius:23px}.commerce-phone-screen{border-radius:18px}
      .commerce-inspection{left:24%;top:47%;width:47%;height:45%;border-radius:14px;clip-path:inset(0 100% 0 0 round 14px)}
      .commerce-inspection-head{left:13px;right:13px;top:12px}.commerce-practice-label{font-size:.43rem}.commerce-inspection-title{margin-top:6px;font-size:1rem}
      .commerce-slot{left:13px;right:13px;bottom:13px;height:36%}.assertion-label{margin-bottom:4px;font-size:.4rem}.assertion-code{font-size:.51rem;line-height:1.3}
    }
    @media(prefers-reduced-motion:reduce){
      .commerce-phone{left:72%!important;transform:translate(-50%,-50%)!important}
      .commerce-phone-cart{opacity:0!important}.commerce-phone-expired{opacity:1!important;transform:none!important;filter:none!important}
      .commerce-inspection{opacity:1!important;transform:translate(-50%,-50%)!important;clip-path:inset(0 0 0 0 round 20px)!important}
      .assertion-naive{opacity:0!important;transform:translateX(-16px)!important}.assertion-proof{opacity:1!important;transform:none!important}.assertion-strike{right:0!important;opacity:1!important}
    }
  `;
  document.head.appendChild(style);

  const showcase = document.createElement('div');
  showcase.className = 'commerce-showcase scene-object';
  showcase.setAttribute(
    'aria-label',
    'CommerceOps negative-path exercise. The application is reframed to reveal an inspection view where a page assertion is disproved and replaced by a persisted-state assertion.'
  );
  showcase.innerHTML = `
    <div class="commerce-motion-root">
      <div class="commerce-stage-shadow" aria-hidden="true"></div>

      <section class="commerce-inspection">
        <div class="commerce-inspection-head">
          <p class="commerce-practice-label">NEGATIVE PATH · COMMERCEOPS</p>
          <h3 class="commerce-inspection-title">Expired coupon</h3>
        </div>
        <div class="commerce-slot">
          <div class="assertion-state assertion-naive">
            <p class="assertion-label">A junior asserts</p>
            <p class="assertion-code">
              expect(<span class="k">page</span>).toContain('expired')
              <span class="assertion-strike" aria-hidden="true"></span>
            </p>
          </div>
          <div class="assertion-state assertion-proof">
            <p class="assertion-label">The test we ship</p>
            <p class="assertion-code"><span class="k">db</span>.coupon_reject.reason === 'expired'</p>
          </div>
        </div>
      </section>

      <div class="commerce-phone">
        <div class="commerce-phone-screen">
          <img class="commerce-phone-cart" src="${assets.cart}" alt="CommerceOps cart before the coupon result resolves" />
          <img class="commerce-phone-expired" src="${assets.expired}" alt="CommerceOps cart showing the rejected WELCOME20 coupon" />
        </div>
      </div>
    </div>
  `;
  oldPlate.replaceWith(showcase);

  const blur = scene.querySelector('.scene-blur');
  if (blur) {
    blur.src = assets.expired;
    blur.style.objectPosition = 'center 42%';
  }
  const repoLink = scene.querySelector('.scene-link');
  if (repoLink) repoLink.href = 'https://github.com/CTWalk/CommerceOps';

  const phone = showcase.querySelector('.commerce-phone');
  const cart = showcase.querySelector('.commerce-phone-cart');
  const expired = showcase.querySelector('.commerce-phone-expired');
  const inspection = showcase.querySelector('.commerce-inspection');
  const naive = showcase.querySelector('.assertion-naive');
  const naiveCode = naive.querySelector('.assertion-code');
  const strike = showcase.querySelector('.assertion-strike');
  const proof = showcase.querySelector('.assertion-proof');

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

  // .00-.22 product resolves while the phone owns the frame
  // .20-.42 framing widens: phone shifts right, inspection slot is uncovered
  // .36-.50 page assertion settles into the single slot
  // .50-.66 strike disproves it
  // .62-.78 same slot replaces page assertion with DB assertion
  // .78-1.00 quiet reading hold
  let raf = 0;
  function render() {
    const p = getScenePhase();
    const mobile = window.innerWidth <= 760;

    const productResult = cubicRamp(p, .00, .22);
    cart.style.opacity = String(1 - productResult);
    cart.style.transform = `scale(${1 - productResult * .008})`;
    expired.style.opacity = String(productResult);
    expired.style.transform = `scale(${1.012 - productResult * .012})`;
    expired.style.filter = `brightness(${.97 + productResult * .03})`;

    const reframe = cubicRamp(p, .20, .42);
    const phoneStart = mobile ? 54 : 57;
    const phoneEnd = mobile ? 72 : 73;
    phone.style.left = `${mix(phoneStart, phoneEnd, reframe)}%`;
    phone.style.transform = `translate(-50%,-50%) scale(${mix(1.035, 1, reframe)})`;

    inspection.style.opacity = String(ramp(p, .24, .37));
    inspection.style.transform = `translate(-50%,-50%) translateX(${mix(-22, 0, reframe)}px)`;
    inspection.style.clipPath = `inset(0 ${(1 - reframe) * 100}% 0 0 round ${mobile ? 14 : 20}px)`;

    const naiveIn = cubicRamp(p, .36, .50);
    const strikeAmount = cubicRamp(p, .50, .66);
    const replace = cubicRamp(p, .62, .78);

    naive.style.opacity = String(naiveIn * (1 - replace));
    naive.style.transform = `translateX(${mix(12, -22, replace)}px)`;
    naiveCode.style.filter = `brightness(${1 - strikeAmount * .16}) saturate(${1 - strikeAmount * .26})`;

    strike.style.right = `${(1 - strikeAmount) * 100}%`;
    strike.style.opacity = String(strikeAmount * (1 - replace * .35));

    proof.style.opacity = String(replace);
    proof.style.transform = `translateX(${mix(18, 0, replace)}px)`;

    phone.style.filter = `brightness(${1 - replace * .018})`;
    inspection.style.filter = `brightness(${1 + replace * .018})`;

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();
