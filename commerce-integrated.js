(() => {
  // CommerceOps scene — QA practice through a negative-path reference example.
  // Semantic verb: DISPROVE.
  //
  // The viewer first sees a tempting conclusion:
  //   message visible -> PASS
  //
  // The scroll strikes out PASS, then reveals what the reference path checks:
  //   persisted coupon = rejected / reason = expired / discount = none
  //
  // The motion carries the teaching point without requiring code literacy.

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
    .commerce-showcase{position:absolute;z-index:9;right:max(2vw,calc((100% - var(--content))/2));top:8%;width:min(59vw,870px);height:min(78vh,720px);overflow:visible;will-change:transform,opacity}
    .commerce-motion-root{position:absolute;inset:0;isolation:isolate}

    .commerce-phone{position:absolute;z-index:5;left:72%;top:50%;height:96%;aspect-ratio:412/915;transform:translate(-50%,-50%);border:1px solid rgba(255,255,255,.26);border-radius:clamp(22px,2.6vw,34px);background:#121417;box-shadow:0 38px 120px rgba(0,0,0,.5),inset 0 0 0 5px rgba(7,8,10,.94);overflow:hidden;will-change:transform,filter}
    .commerce-phone::before{content:"";position:absolute;z-index:8;left:50%;top:9px;width:25%;height:5px;transform:translateX(-50%);border-radius:99px;background:rgba(8,9,11,.82);box-shadow:0 1px 0 rgba(255,255,255,.08)}
    .commerce-phone-screen{position:absolute;inset:6px;border-radius:clamp(17px,2vw,28px);overflow:hidden;background:#f7f5ef}
    .commerce-phone-screen img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;will-change:opacity,transform,filter}
    .commerce-phone-cart{opacity:1}
    .commerce-phone-expired{opacity:0;transform:scale(1.012);filter:brightness(.97)}

    .commerce-exercise{position:absolute;z-index:7;left:23%;top:49%;width:min(44%,390px);height:min(48%,330px);transform:translate(-50%,-50%) rotate(-.6deg);border:1px solid rgba(35,39,44,.18);border-radius:20px;background:#f1eee6;color:#23262b;box-shadow:0 34px 80px rgba(0,0,0,.34);overflow:hidden;will-change:transform,filter}
    .commerce-exercise::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(118deg,rgba(255,255,255,.22),transparent 38%,rgba(70,60,48,.025));mix-blend-mode:multiply}
    .commerce-exercise-head{position:absolute;z-index:3;left:clamp(20px,2.3vw,30px);right:clamp(20px,2.3vw,30px);top:clamp(18px,2vw,25px)}
    .commerce-practice-label{margin:0;color:#74716a;font:760 clamp(.56rem,.72vw,.67rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.11em;text-transform:uppercase}
    .commerce-exercise-title{margin:11px 0 0;color:#22252a;font:700 clamp(1.28rem,1.95vw,1.95rem)/1.05 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:-.035em}

    .commerce-exercise-stage{position:absolute;z-index:2;left:clamp(20px,2.3vw,30px);right:clamp(20px,2.3vw,30px);bottom:clamp(20px,2.3vw,30px);display:flex;flex-direction:column;gap:clamp(14px,1.5vw,20px)}
    .commerce-stage-label{margin:0 0 7px;color:#77736b;font:760 clamp(.53rem,.67vw,.62rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.1em;text-transform:uppercase}

    .commerce-naive{position:relative;will-change:opacity,transform}
    .commerce-naive-line{display:flex;align-items:center;gap:10px;margin:0;color:#393c40;font:620 clamp(.74rem,.94vw,.9rem)/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .commerce-naive-arrow{color:#8a8780;font:700 .9em/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
    .commerce-naive-pass{position:relative;display:inline-flex;align-items:center;padding:4px 8px;border:1px solid rgba(53,119,78,.18);border-radius:7px;background:rgba(53,119,78,.07);color:#397250;font:800 clamp(.68rem,.82vw,.76rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.055em}
    .commerce-strike{position:absolute;z-index:2;left:-4px;right:100%;top:50%;height:2px;background:#9e332a;transform:translateY(-50%) rotate(-4deg);transform-origin:left center;box-shadow:0 0 0 .5px rgba(158,51,42,.32);pointer-events:none;will-change:right,opacity}

    .commerce-proof{opacity:0;transform:translateY(8px);will-change:opacity,transform}
    .commerce-proof-title{margin:0 0 9px;color:#292c31;font:680 clamp(.73rem,.92vw,.88rem)/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .commerce-proof-grid{display:grid;gap:5px;margin:0;padding:0;list-style:none}
    .commerce-proof-grid li{display:grid;grid-template-columns:minmax(62px,.7fr) 1fr;gap:9px;align-items:baseline;color:#51544f;font:560 clamp(.62rem,.76vw,.72rem)/1.28 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .commerce-proof-grid b{color:#7b7871;font:740 clamp(.52rem,.64vw,.59rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.055em;text-transform:uppercase}
    .commerce-proof-grid strong{color:#303338;font-weight:690}
    .commerce-proof-grid .bad{color:#9e332a}

    @media(max-width:760px){
      .commerce-showcase{left:4vw;right:auto;top:6%;width:92vw;height:49vh;max-height:475px}
      .commerce-phone{left:73%;height:98%;border-radius:23px}.commerce-phone-screen{border-radius:18px}
      .commerce-exercise{left:25%;top:47%;width:49%;height:48%;border-radius:14px}
      .commerce-exercise-head{left:13px;right:13px;top:12px}.commerce-practice-label{font-size:.42rem}.commerce-exercise-title{margin-top:6px;font-size:1rem}
      .commerce-exercise-stage{left:13px;right:13px;bottom:13px;gap:10px}.commerce-stage-label{margin-bottom:4px;font-size:.39rem}
      .commerce-naive-line{gap:5px;font-size:.54rem}.commerce-naive-pass{padding:3px 5px;font-size:.47rem;border-radius:5px}
      .commerce-proof-title{margin-bottom:5px;font-size:.53rem}.commerce-proof-grid{gap:3px}.commerce-proof-grid li{grid-template-columns:43px 1fr;gap:4px;font-size:.45rem}.commerce-proof-grid b{font-size:.38rem}
    }
    @media(prefers-reduced-motion:reduce){
      .commerce-phone-cart{opacity:0!important}.commerce-phone-expired{opacity:1!important;transform:none!important;filter:none!important}
      .commerce-strike{right:0!important;opacity:1!important}.commerce-naive{opacity:.42!important}.commerce-proof{opacity:1!important;transform:none!important}
    }
  `;
  document.head.appendChild(style);

  const showcase = document.createElement('div');
  showcase.className = 'commerce-showcase scene-object';
  showcase.setAttribute(
    'aria-label',
    'CommerceOps QA practice negative path. A visible expired message is not enough to pass; the reference check verifies the persisted coupon state, rejection reason, and absence of a discount.'
  );
  showcase.innerHTML = `
    <div class="commerce-motion-root">
      <section class="commerce-exercise">
        <div class="commerce-exercise-head">
          <p class="commerce-practice-label">QA PRACTICE APP · NEGATIVE PATH</p>
          <h3 class="commerce-exercise-title">Expired coupon</h3>
        </div>
        <div class="commerce-exercise-stage">
          <div class="commerce-naive">
            <p class="commerce-stage-label">Tempting conclusion</p>
            <p class="commerce-naive-line">
              <span>Expired message is visible</span>
              <span class="commerce-naive-arrow" aria-hidden="true">→</span>
              <span class="commerce-naive-pass">PASS<span class="commerce-strike" aria-hidden="true"></span></span>
            </p>
          </div>

          <div class="commerce-proof">
            <p class="commerce-stage-label">Reference check</p>
            <p class="commerce-proof-title">Verify the saved business state.</p>
            <ul class="commerce-proof-grid">
              <li><b>Coupon</b><strong class="bad">rejected</strong></li>
              <li><b>Reason</b><strong>expired</strong></li>
              <li><b>Discount</b><strong>none</strong></li>
            </ul>
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
  const naive = showcase.querySelector('.commerce-naive');
  const pass = showcase.querySelector('.commerce-naive-pass');
  const strike = showcase.querySelector('.commerce-strike');
  const proof = showcase.querySelector('.commerce-proof');
  const exercise = showcase.querySelector('.commerce-exercise');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smooth = t => t * t * (3 - 2 * t);
  const ramp = (p, start, end) => smooth(clamp((p - start) / Math.max(.0001, end - start)));
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

  // .00-.22 real product resolves
  // .18-.34 tempting PASS settles
  // .34-.52 PASS is struck out
  // .49-.64 reference evidence appears
  // .64-1.00 stable reading hold
  let raf = 0;
  function render() {
    const p = getScenePhase();

    const productResult = cubicRamp(p, .00, .22);
    cart.style.opacity = String(1 - productResult);
    cart.style.transform = `scale(${1 - productResult * .008})`;
    expired.style.opacity = String(productResult);
    expired.style.transform = `scale(${1.012 - productResult * .012})`;
    expired.style.filter = `brightness(${.97 + productResult * .03})`;

    const naiveIn = ramp(p, .18, .31);
    const strikeAmount = cubicRamp(p, .34, .52);
    const naiveMute = ramp(p, .49, .63);

    naive.style.opacity = String(naiveIn * (1 - naiveMute * .52));
    naive.style.transform = `translateY(${(1 - naiveIn) * 6}px)`;
    pass.style.filter = `saturate(${1 - naiveMute * .55}) brightness(${1 - naiveMute * .1})`;

    strike.style.right = `${(1 - strikeAmount) * 100}%`;
    strike.style.opacity = String(strikeAmount);

    const proofIn = cubicRamp(p, .50, .65);
    proof.style.opacity = String(proofIn);
    proof.style.transform = `translateY(${(1 - proofIn) * 8}px)`;

    exercise.style.transform = `translate(-50%,-50%) rotate(${-0.6 + proofIn * .3}deg) scale(${1 + proofIn * .01})`;
    phone.style.filter = `brightness(${1 - proofIn * .012})`;

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();
