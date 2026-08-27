(() => {
  // CommerceOps scene — negative-path validation thesis.
  // Semantic verb: DISPROVE. The strikethrough is the argument.
  //
  //   "expect(page).toContain('expired')"     ← what a weak test asserts
  //   "db.coupon_reject.reason === 'expired'" ← what the test we ship asserts
  //
  // Same verb prefix, same right-hand value, one word swapped: page → db.
  // The scroll draws a red strike across the first line, then fades the second in below it.

  const scene = document.querySelector('.scene[data-scene="1"]');
  const experience = document.getElementById('experience');
  const oldPlate = scene?.querySelector('.commerce-plate');
  if (!scene || !experience || !oldPlate) return;

  const assets = {
    cart:    'https://raw.githubusercontent.com/CTWalk/CommerceOps/main/assets/showcase/cart-412x915.png',
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

    .commerce-exercise{position:absolute;z-index:7;left:23%;top:49%;width:min(44%,380px);height:min(46%,320px);transform:translate(-50%,-50%) rotate(-.6deg);border:1px solid rgba(35,39,44,.18);border-radius:20px;background:#f1eee6;color:#23262b;box-shadow:0 34px 80px rgba(0,0,0,.34);overflow:hidden;will-change:transform,filter}
    .commerce-exercise::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(118deg,rgba(255,255,255,.22),transparent 38%,rgba(70,60,48,.025));mix-blend-mode:multiply}

    .commerce-exercise-head{position:absolute;z-index:3;left:clamp(20px,2.3vw,30px);right:clamp(20px,2.3vw,30px);top:clamp(18px,2vw,25px)}
    .commerce-practice-label{margin:0;color:#74716a;font:760 clamp(.56rem,.72vw,.67rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.11em;text-transform:uppercase}
    .commerce-exercise-title{margin:11px 0 0;color:#22252a;font:700 clamp(1.28rem,1.95vw,1.95rem)/1.05 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:-.035em}

    /* The two-assertion stage. Same shape twice; that's the point. */
    .commerce-exercise-stage{position:absolute;z-index:2;left:clamp(20px,2.3vw,30px);right:clamp(20px,2.3vw,30px);bottom:clamp(20px,2.3vw,30px);display:flex;flex-direction:column;gap:clamp(12px,1.4vw,18px)}

    .assertion-row{position:relative;will-change:opacity,transform}
    .assertion-label{margin:0 0 clamp(5px,.65vw,8px);color:#77736b;font:760 clamp(.54rem,.68vw,.63rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.1em;text-transform:uppercase}
    .assertion-code{position:relative;margin:0;color:#2e3135;font:700 clamp(.72rem,.9vw,.86rem)/1.35 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.015em}
    .assertion-code .k{color:#9e332a}                    /* the swapped word — highlight the argument */

    /* Naive assertion — starts crisp, ends dimmed under a red strike */
    .assertion-naive .assertion-code{color:#2e3135;transition:none}
    .assertion-strike{position:absolute;left:-2px;right:100%;top:50%;height:2px;background:#9e332a;transform:translateY(-50%);pointer-events:none;box-shadow:0 0 0 .5px rgba(158,51,42,.35);will-change:right,opacity}

    /* Reference assertion — hidden at the start, resolves after the strike */
    .assertion-proof{opacity:0;transform:translateY(6px);will-change:opacity,transform}
    .assertion-proof .assertion-code{color:#22252a}

    /* Tail tag that anchors the takeaway */
    .commerce-tail{position:absolute;z-index:3;left:clamp(20px,2.3vw,30px);right:clamp(20px,2.3vw,30px);bottom:calc(-1 * clamp(6px,.8vw,10px));display:none}

    @media(max-width:760px){
      .commerce-showcase{left:4vw;right:auto;top:6%;width:92vw;height:49vh;max-height:475px}
      .commerce-phone{left:73%;height:98%;border-radius:23px}.commerce-phone-screen{border-radius:18px}
      .commerce-exercise{left:25%;top:47%;width:49%;height:47%;border-radius:14px}
      .commerce-exercise-head{left:13px;right:13px;top:12px}.commerce-practice-label{font-size:.43rem}.commerce-exercise-title{margin-top:6px;font-size:1rem}
      .commerce-exercise-stage{left:13px;right:13px;bottom:13px;gap:10px}
      .assertion-label{margin-bottom:4px;font-size:.4rem}
      .assertion-code{font-size:.53rem;line-height:1.3}
    }
    @media(prefers-reduced-motion:reduce){
      .commerce-phone-cart{opacity:0!important}
      .commerce-phone-expired{opacity:1!important;transform:none!important;filter:none!important}
      .assertion-strike{right:0!important;opacity:1!important}
      .assertion-naive .assertion-code{color:#8a8781!important}
      .assertion-proof{opacity:1!important;transform:none!important}
    }
  `;
  document.head.appendChild(style);

  const showcase = document.createElement('div');
  showcase.className = 'commerce-showcase scene-object';
  showcase.setAttribute(
    'aria-label',
    'CommerceOps negative-path exercise. A weak assertion on the page text is crossed out and replaced with an assertion against the persisted database state.'
  );
  showcase.innerHTML = `
    <div class="commerce-motion-root">
      <section class="commerce-exercise">
        <div class="commerce-exercise-head">
          <p class="commerce-practice-label">NEGATIVE PATH · COMMERCEOPS</p>
          <h3 class="commerce-exercise-title">Expired coupon</h3>
        </div>
        <div class="commerce-exercise-stage">
          <div class="assertion-row assertion-naive">
            <p class="assertion-label">A junior asserts</p>
            <p class="assertion-code">
              expect(<span class="k">page</span>).toContain('expired')
              <span class="assertion-strike" aria-hidden="true"></span>
            </p>
          </div>
          <div class="assertion-row assertion-proof">
            <p class="assertion-label">The test we ship</p>
            <p class="assertion-code">
              <span class="k">db</span>.coupon_reject.reason === 'expired'
            </p>
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

  const phone   = showcase.querySelector('.commerce-phone');
  const cart    = showcase.querySelector('.commerce-phone-cart');
  const expired = showcase.querySelector('.commerce-phone-expired');
  const naive   = showcase.querySelector('.assertion-naive');
  const naiveCode = naive.querySelector('.assertion-code');
  const strike  = showcase.querySelector('.assertion-strike');
  const proof   = showcase.querySelector('.assertion-proof');
  const exercise = showcase.querySelector('.commerce-exercise');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smooth = t => t * t * (3 - 2 * t);
  const ramp = (p, start, end) => smooth(clamp((p - start) / Math.max(.0001, end - start)));
  const cubicOut = t => 1 - Math.pow(1 - clamp(t), 3);
  const cubicRamp = (p, start, end) => cubicOut((p - start) / Math.max(.0001, end - start));

  // Preserved from the previous file — same duration table, same scene 1 slice math.
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

  // Scene-local phase ranges. Every range earns a job.
  //
  //   .00 – .22  cart → expired coupon result on the phone (real screenshot swap)
  //   .18 – .34  naive assertion arrives, crisp
  //   .34 – .52  RED STRIKE draws across it  ← the semantic beat
  //   .48 – .64  naive dims, reference assertion fades in below
  //   .64 – 1.0  reading hold — two lines stable and legible
  //
  // The strike range overlaps the naive-arrival tail on purpose: the viewer sees
  // it settle for a half-beat before it gets disproved. That short belief is what
  // the disproof is disproving.

  let raf = 0;
  function render() {
    const p = getScenePhase();

    // Phone: cart → expired coupon
    const productResult = cubicRamp(p, .00, .22);
    cart.style.opacity = String(1 - productResult);
    cart.style.transform = `scale(${1 - productResult * .008})`;
    expired.style.opacity = String(productResult);
    expired.style.transform = `scale(${1.012 - productResult * .012})`;
    expired.style.filter = `brightness(${.97 + productResult * .03})`;

    // Naive assertion — enters, then gets muted after the strike lands
    const naiveIn = ramp(p, .18, .30);
    const strikeAmount = cubicRamp(p, .34, .52);
    const naiveMute = ramp(p, .48, .62);

    naive.style.opacity = String(naiveIn * (1 - naiveMute * .55));
    naive.style.transform = `translateY(${(1 - naiveIn) * 6}px)`;
    naiveCode.style.color = `rgba(46,49,53,${1 - naiveMute * .55})`;

    // The strike draws left → right by animating "right" from 100% to 0
    strike.style.right = `${(1 - strikeAmount) * 100}%`;
    strike.style.opacity = String(strikeAmount * (1 - ramp(p, .92, 1.0) * .2));

    // Reference assertion — resolves in place under the naive line
    const proofIn = cubicRamp(p, .50, .64);
    proof.style.opacity = String(proofIn);
    proof.style.transform = `translateY(${(1 - proofIn) * 8}px)`;

    // Micro-settle: card recenters slightly as the argument lands
    exercise.style.transform =
      `translate(-50%,-50%) rotate(${-0.6 + proofIn * .35}deg) scale(${1 + proofIn * .012})`;
    phone.style.filter = `brightness(${1 - proofIn * .015})`;

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();
