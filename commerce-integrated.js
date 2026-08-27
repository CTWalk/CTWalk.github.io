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
    .commerce-showcase{position:absolute;z-index:9;right:max(2vw,calc((100% - var(--content))/2));top:8%;width:min(59vw,870px);height:min(78vh,720px);overflow:visible;will-change:transform,opacity}
    .commerce-motion-root{position:absolute;inset:0;isolation:isolate}

    .commerce-phone{position:absolute;z-index:5;left:72%;top:50%;height:96%;aspect-ratio:412/915;transform:translate(-50%,-50%);border:1px solid rgba(255,255,255,.26);border-radius:clamp(22px,2.6vw,34px);background:#121417;box-shadow:0 38px 120px rgba(0,0,0,.5),inset 0 0 0 5px rgba(7,8,10,.94);overflow:hidden;will-change:transform,filter}
    .commerce-phone::before{content:"";position:absolute;z-index:8;left:50%;top:9px;width:25%;height:5px;transform:translateX(-50%);border-radius:99px;background:rgba(8,9,11,.82);box-shadow:0 1px 0 rgba(255,255,255,.08)}
    .commerce-phone-screen{position:absolute;inset:6px;border-radius:clamp(17px,2vw,28px);overflow:hidden;background:#f7f5ef}
    .commerce-phone-screen img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;will-change:opacity,transform,filter}
    .commerce-phone-cart{opacity:1}
    .commerce-phone-expired{opacity:0;transform:scale(1.012);filter:brightness(.97)}
    .commerce-phone-focus{position:absolute;z-index:9;left:50%;top:68%;width:74%;height:15%;transform:translate(-50%,-50%) scale(.965);border:1px solid rgba(158,51,42,.5);border-radius:14px;box-shadow:0 0 0 5px rgba(158,51,42,.045),0 10px 30px rgba(0,0,0,.08);opacity:0;pointer-events:none;will-change:opacity,transform}

    .commerce-exercise{position:absolute;z-index:7;left:23%;top:49%;width:min(42%,350px);height:min(44%,300px);transform:translate(-50%,-50%) rotate(-.6deg);border:1px solid rgba(35,39,44,.18);border-radius:20px;background:#f1eee6;color:#23262b;box-shadow:0 34px 80px rgba(0,0,0,.34);overflow:hidden;will-change:transform,filter}
    .commerce-exercise::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(118deg,rgba(255,255,255,.22),transparent 38%,rgba(70,60,48,.025));mix-blend-mode:multiply}
    .commerce-exercise-head{position:absolute;z-index:3;left:clamp(20px,2.3vw,30px);right:clamp(20px,2.3vw,30px);top:clamp(18px,2vw,25px)}
    .commerce-practice-label{margin:0;color:#74716a;font:760 clamp(.56rem,.72vw,.67rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.11em;text-transform:uppercase}
    .commerce-exercise-title{margin:11px 0 0;color:#22252a;font:700 clamp(1.28rem,1.95vw,1.95rem)/1.05 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:-.035em}
    .commerce-exercise-stage{position:absolute;z-index:2;left:clamp(20px,2.3vw,30px);right:clamp(20px,2.3vw,30px);bottom:clamp(20px,2.3vw,30px);height:42%}
    .commerce-question,.commerce-reference{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;will-change:opacity,transform}
    .commerce-question{opacity:1}
    .commerce-reference{opacity:0;transform:translateY(9px)}
    .commerce-stage-label{margin:0 0 8px;color:#77736b;font:760 clamp(.54rem,.68vw,.63rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.1em;text-transform:uppercase}
    .commerce-question p,.commerce-reference p{margin:0;color:#444743;font:540 clamp(.78rem,.98vw,.96rem)/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .commerce-question strong{color:#25282d;font-weight:720}
    .commerce-reference-code{margin:0 0 7px;color:#2e3135;font:760 clamp(.72rem,.88vw,.84rem)/1.15 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.015em}
    .commerce-reference-result{color:#9e332a!important;font-weight:700!important}
    .commerce-reference-state{margin-top:5px!important;color:#565953!important;font:650 clamp(.61rem,.75vw,.7rem)/1.3 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace!important}
    .commerce-transition-rule{position:absolute;z-index:1;left:0;right:0;bottom:0;height:2px;background:rgba(35,39,44,.09);overflow:hidden}
    .commerce-transition-rule::after{content:"";display:block;width:100%;height:100%;background:#9e332a;transform:translateX(-100%);will-change:transform}

    @media(max-width:760px){
      .commerce-showcase{left:4vw;right:auto;top:6%;width:92vw;height:47vh;max-height:455px}
      .commerce-phone{left:73%;height:98%;border-radius:23px}.commerce-phone-screen{border-radius:18px}
      .commerce-exercise{left:25%;top:46%;width:47%;height:43%;border-radius:14px}
      .commerce-exercise-head{left:13px;right:13px;top:12px}.commerce-practice-label{font-size:.43rem}.commerce-exercise-title{margin-top:6px;font-size:1rem}
      .commerce-exercise-stage{left:13px;right:13px;bottom:13px;height:44%}.commerce-stage-label{margin-bottom:5px;font-size:.4rem}.commerce-question p,.commerce-reference p{font-size:.58rem;line-height:1.32}.commerce-reference-code{font-size:.53rem}.commerce-reference-state{font-size:.45rem!important}
      .commerce-phone-focus{top:68%;width:76%;height:15%;border-radius:10px}
    }
    @media(prefers-reduced-motion:reduce){
      .commerce-phone-cart{opacity:0!important}.commerce-phone-expired{opacity:1!important;transform:none!important;filter:none!important}.commerce-phone-focus{opacity:.6!important;transform:translate(-50%,-50%) scale(1)!important}
      .commerce-question{opacity:0!important}.commerce-reference{opacity:1!important;transform:none!important}.commerce-transition-rule::after{transform:none!important}
    }
  `;
  document.head.appendChild(style);

  const showcase = document.createElement('div');
  showcase.className = 'commerce-showcase scene-object';
  showcase.setAttribute('aria-label', 'CommerceOps QA practice exercise shown on the real application with its reference answer');
  showcase.innerHTML = `
    <div class="commerce-motion-root">
      <section class="commerce-exercise">
        <div class="commerce-exercise-head">
          <p class="commerce-practice-label">QA PRACTICE APP</p>
          <h3 class="commerce-exercise-title">Expired coupon</h3>
        </div>
        <div class="commerce-exercise-stage">
          <div class="commerce-question">
            <p class="commerce-stage-label">Challenge</p>
            <p>Apply <strong>WELCOME20</strong>.<br>Did the discount actually apply?</p>
          </div>
          <div class="commerce-reference">
            <p class="commerce-stage-label">Reference</p>
            <p class="commerce-reference-code">WELCOME20</p>
            <p class="commerce-reference-result">Rejected · no discount</p>
            <p class="commerce-reference-state">persisted state: rejected</p>
          </div>
          <div class="commerce-transition-rule" aria-hidden="true"></div>
        </div>
      </section>

      <div class="commerce-phone">
        <div class="commerce-phone-screen">
          <img class="commerce-phone-cart" src="${assets.cart}" alt="CommerceOps cart screen before the coupon result" />
          <img class="commerce-phone-expired" src="${assets.expired}" alt="CommerceOps cart showing the expired WELCOME20 coupon result" />
          <div class="commerce-phone-focus" aria-hidden="true"></div>
        </div>
      </div>
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
  const focus = showcase.querySelector('.commerce-phone-focus');
  const exercise = showcase.querySelector('.commerce-exercise');
  const question = showcase.querySelector('.commerce-question');
  const reference = showcase.querySelector('.commerce-reference');
  const transitionRule = showcase.querySelector('.commerce-transition-rule::after');
  const rule = showcase.querySelector('.commerce-transition-rule');

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

  let raf = 0;
  function render() {
    const p = getScenePhase();

    // One story: read the challenge, watch the real product, then reveal the reference in the same place.
    const productResult = cubicRamp(p, .27, .45);
    const answer = cubicRamp(p, .48, .64);
    const holdFocus = ramp(p, .37, .47) * (1 - ramp(p, .73, .83));

    cart.style.opacity = String(1 - productResult);
    cart.style.transform = `scale(${1 - productResult * .01})`;
    expired.style.opacity = String(productResult);
    expired.style.transform = `scale(${1.012 - productResult * .012})`;
    expired.style.filter = `brightness(${.97 + productResult * .03})`;

    question.style.opacity = String(1 - answer);
    question.style.transform = `translateY(${-answer * 7}px)`;
    reference.style.opacity = String(answer);
    reference.style.transform = `translateY(${(1 - answer) * 9}px)`;

    // The thin rule is the only explicit transition cue between question and answer.
    rule.style.setProperty('--commerce-answer', String(answer));
    rule.style.background = `linear-gradient(90deg,#9e332a 0%,#9e332a ${answer * 100}%,rgba(35,39,44,.09) ${answer * 100}%,rgba(35,39,44,.09) 100%)`;

    focus.style.opacity = String(holdFocus * .72);
    focus.style.transform = `translate(-50%,-50%) scale(${.965 + holdFocus * .035})`;

    phone.style.filter = `brightness(${1 - answer * .018})`;
    exercise.style.transform = `translate(-50%,-50%) rotate(${-0.6 + answer * .35}deg) scale(${1 + answer * .012})`;

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();
