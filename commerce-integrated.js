(() => {
  // CommerceOps scene — one connected QA practice story.
  // The real product result is the source of the explanation:
  // visible message -> tempting PASS -> strike -> persisted-state reference.

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
    .commerce-showcase{position:absolute;z-index:9;right:max(2vw,calc((100% - var(--content))/2));top:8%;width:min(60vw,900px);height:min(78vh,720px);overflow:visible;will-change:transform,opacity}
    .commerce-world{position:absolute;inset:0;isolation:isolate}

    .commerce-scenario{position:absolute;z-index:8;left:12%;top:16%;margin:0;color:rgba(255,255,255,.54);font:740 clamp(.56rem,.72vw,.67rem)/1.15 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.105em;text-transform:uppercase;opacity:.78}
    .commerce-scenario strong{display:block;margin-top:7px;color:rgba(255,255,255,.9);font:650 clamp(1rem,1.45vw,1.4rem)/1.1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:-.02em;text-transform:none}

    .commerce-phone{position:absolute;z-index:5;left:70%;top:50%;height:96%;aspect-ratio:412/915;transform:translate(-50%,-50%);border:1px solid rgba(255,255,255,.26);border-radius:clamp(22px,2.6vw,34px);background:#121417;box-shadow:0 38px 120px rgba(0,0,0,.5),inset 0 0 0 5px rgba(7,8,10,.94);overflow:hidden;will-change:transform,filter}
    .commerce-phone::before{content:"";position:absolute;z-index:8;left:50%;top:9px;width:25%;height:5px;transform:translateX(-50%);border-radius:99px;background:rgba(8,9,11,.82);box-shadow:0 1px 0 rgba(255,255,255,.08)}
    .commerce-phone-screen{position:absolute;inset:6px;border-radius:clamp(17px,2vw,28px);overflow:hidden;background:#f7f5ef}
    .commerce-phone-screen img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;will-change:opacity,transform,filter}
    .commerce-phone-cart{opacity:1}
    .commerce-phone-expired{opacity:0;transform:scale(1.012);filter:brightness(.97)}

    .commerce-ui-focus{position:absolute;z-index:10;left:50%;top:68%;width:75%;height:15%;transform:translate(-50%,-50%) scale(.96);border:1px solid rgba(158,51,42,.62);border-radius:14px;box-shadow:0 0 0 5px rgba(158,51,42,.05),0 14px 32px rgba(0,0,0,.1);opacity:0;pointer-events:none;will-change:opacity,transform}
    .commerce-ui-focus::after{content:"MESSAGE VISIBLE";position:absolute;left:-8px;top:-19px;color:rgba(158,51,42,.88);font:760 clamp(.48rem,.6vw,.56rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.09em;white-space:nowrap}

    .commerce-path{position:absolute;z-index:6;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
    .commerce-path path{fill:none;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
    .commerce-path-main{stroke:rgba(241,238,230,.7);stroke-width:1.25;stroke-dasharray:100;stroke-dashoffset:100;filter:drop-shadow(0 0 8px rgba(255,255,255,.1));will-change:stroke-dashoffset,opacity}
    .commerce-path-proof{stroke:rgba(241,238,230,.52);stroke-width:1.1;stroke-dasharray:100;stroke-dashoffset:100;filter:drop-shadow(0 0 8px rgba(255,255,255,.08));will-change:stroke-dashoffset,opacity}
    .commerce-path circle{fill:#f1eee6;opacity:0;filter:drop-shadow(0 0 7px rgba(255,255,255,.28));will-change:opacity}

    .commerce-naive{position:absolute;z-index:8;left:29%;top:54%;display:flex;align-items:center;gap:10px;opacity:0;transform:translateY(7px);will-change:opacity,transform}
    .commerce-naive-label{color:rgba(255,255,255,.62);font:720 clamp(.58rem,.74vw,.68rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}
    .commerce-pass{position:relative;display:inline-flex;align-items:center;padding:6px 9px;border:1px solid rgba(76,163,111,.22);border-radius:8px;background:rgba(76,163,111,.08);color:#8fd3a9;font:820 clamp(.68rem,.84vw,.78rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.06em;will-change:filter,opacity}
    .commerce-strike{position:absolute;z-index:2;left:-5px;right:100%;top:50%;height:2px;background:#e36f63;transform:translateY(-50%) rotate(-4deg);transform-origin:left center;box-shadow:0 0 0 .5px rgba(227,111,99,.35);pointer-events:none;will-change:right,opacity}

    .commerce-proof{position:absolute;z-index:8;left:13%;top:67%;width:min(34%,300px);opacity:0;transform:translateY(9px);will-change:opacity,transform}
    .commerce-proof-kicker{margin:0 0 7px;color:rgba(255,255,255,.5);font:740 clamp(.5rem,.63vw,.59rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.1em;text-transform:uppercase}
    .commerce-proof-title{margin:0;color:rgba(255,255,255,.92);font:650 clamp(.8rem,1vw,.94rem)/1.25 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:-.01em}
    .commerce-proof-state{display:flex;flex-wrap:wrap;gap:6px 10px;margin:9px 0 0;color:rgba(255,255,255,.72);font:680 clamp(.58rem,.72vw,.67rem)/1.25 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
    .commerce-proof-state strong{color:#f0aaa3;font-weight:760}
    .commerce-proof-state span{white-space:nowrap}

    @media(max-width:760px){
      .commerce-showcase{left:4vw;right:auto;top:6%;width:92vw;height:49vh;max-height:475px}
      .commerce-scenario{left:4%;top:8%;font-size:.42rem}.commerce-scenario strong{margin-top:4px;font-size:.86rem}
      .commerce-phone{left:73%;height:98%;border-radius:23px}.commerce-phone-screen{border-radius:18px}
      .commerce-ui-focus{top:68%;width:77%;height:15%;border-radius:10px}.commerce-ui-focus::after{left:-5px;top:-14px;font-size:.37rem}
      .commerce-naive{left:6%;top:47%;gap:5px}.commerce-naive-label{font-size:.43rem}.commerce-pass{padding:4px 6px;border-radius:5px;font-size:.48rem}
      .commerce-proof{left:5%;top:65%;width:44%}.commerce-proof-kicker{margin-bottom:4px;font-size:.38rem}.commerce-proof-title{font-size:.56rem;line-height:1.2}.commerce-proof-state{gap:3px 6px;margin-top:5px;font-size:.42rem}
    }
    @media(prefers-reduced-motion:reduce){
      .commerce-phone-cart{opacity:0!important}.commerce-phone-expired{opacity:1!important;transform:none!important;filter:none!important}
      .commerce-ui-focus{opacity:.72!important;transform:translate(-50%,-50%) scale(1)!important}
      .commerce-path-main,.commerce-path-proof{stroke-dashoffset:0!important;opacity:1!important}.commerce-path circle{opacity:1!important}
      .commerce-naive{opacity:.48!important;transform:none!important}.commerce-strike{right:0!important;opacity:1!important}.commerce-pass{filter:saturate(.3)!important}
      .commerce-proof{opacity:1!important;transform:none!important}
    }
  `;
  document.head.appendChild(style);

  const showcase = document.createElement('div');
  showcase.className = 'commerce-showcase scene-object';
  showcase.setAttribute(
    'aria-label',
    'CommerceOps QA practice negative path. The real expired-coupon result leads to a tempting pass conclusion, which is rejected before the reference path verifies persisted coupon state.'
  );
  showcase.innerHTML = `
    <div class="commerce-world">
      <p class="commerce-scenario">QA PRACTICE APP · NEGATIVE PATH<strong>Expired coupon</strong></p>

      <div class="commerce-phone">
        <div class="commerce-phone-screen">
          <img class="commerce-phone-cart" src="${assets.cart}" alt="CommerceOps cart before the coupon result resolves" />
          <img class="commerce-phone-expired" src="${assets.expired}" alt="CommerceOps cart showing the rejected WELCOME20 coupon" />
          <div class="commerce-ui-focus" aria-hidden="true"></div>
        </div>
      </div>

      <svg class="commerce-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path class="commerce-path-main" pathLength="100" d="M64 67 C55 67 49 58 42 56 C38 55 35 55 32 55" />
        <path class="commerce-path-proof" pathLength="100" d="M32 55 C27 59 25 66 24 72" />
        <circle class="commerce-path-origin" cx="64" cy="67" r=".65" />
        <circle class="commerce-path-turn" cx="32" cy="55" r=".62" />
      </svg>

      <div class="commerce-naive">
        <span class="commerce-naive-label">Message visible</span>
        <span class="commerce-pass">PASS<span class="commerce-strike" aria-hidden="true"></span></span>
      </div>

      <div class="commerce-proof">
        <p class="commerce-proof-kicker">Reference check</p>
        <p class="commerce-proof-title">Verify the persisted business state.</p>
        <p class="commerce-proof-state">
          <span>coupon <strong>rejected</strong></span>
          <span>reason expired</span>
          <span>discount none</span>
        </p>
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
  const focus = showcase.querySelector('.commerce-ui-focus');
  const mainPath = showcase.querySelector('.commerce-path-main');
  const proofPath = showcase.querySelector('.commerce-path-proof');
  const originDot = showcase.querySelector('.commerce-path-origin');
  const turnDot = showcase.querySelector('.commerce-path-turn');
  const naive = showcase.querySelector('.commerce-naive');
  const pass = showcase.querySelector('.commerce-pass');
  const strike = showcase.querySelector('.commerce-strike');
  const proof = showcase.querySelector('.commerce-proof');

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

  // One connected sentence:
  // .00-.23 real product resolves
  // .18-.32 actual UI result is isolated
  // .27-.43 line grows from that result into the tempting PASS
  // .36-.48 PASS settles
  // .47-.58 PASS is struck out
  // .55-.70 the same line continues into the persisted-state reference
  // .66-1.00 reference holds
  let raf = 0;
  function render() {
    const p = getScenePhase();

    const productResult = cubicRamp(p, .00, .23);
    cart.style.opacity = String(1 - productResult);
    cart.style.transform = `scale(${1 - productResult * .008})`;
    expired.style.opacity = String(productResult);
    expired.style.transform = `scale(${1.012 - productResult * .012})`;
    expired.style.filter = `brightness(${.97 + productResult * .03})`;

    const focusIn = cubicRamp(p, .18, .32);
    focus.style.opacity = String(focusIn * .78);
    focus.style.transform = `translate(-50%,-50%) scale(${.96 + focusIn * .04})`;

    const mainDraw = cubicRamp(p, .27, .43);
    mainPath.style.strokeDashoffset = String(100 * (1 - mainDraw));
    mainPath.style.opacity = String(mainDraw);
    originDot.style.opacity = String(ramp(mainDraw, .12, .34));
    turnDot.style.opacity = String(ramp(mainDraw, .78, 1));

    const naiveIn = cubicRamp(p, .36, .48);
    const strikeAmount = cubicRamp(p, .47, .58);
    const naiveMute = ramp(p, .55, .69);
    naive.style.opacity = String(naiveIn * (1 - naiveMute * .5));
    naive.style.transform = `translateY(${(1 - naiveIn) * 7}px)`;
    pass.style.filter = `saturate(${1 - naiveMute * .62}) brightness(${1 - naiveMute * .08})`;
    strike.style.right = `${(1 - strikeAmount) * 100}%`;
    strike.style.opacity = String(strikeAmount);

    const proofDraw = cubicRamp(p, .55, .70);
    proofPath.style.strokeDashoffset = String(100 * (1 - proofDraw));
    proofPath.style.opacity = String(proofDraw);

    const proofIn = cubicRamp(p, .64, .76);
    proof.style.opacity = String(proofIn);
    proof.style.transform = `translateY(${(1 - proofIn) * 9}px)`;

    phone.style.filter = `brightness(${1 - proofIn * .012})`;

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();
