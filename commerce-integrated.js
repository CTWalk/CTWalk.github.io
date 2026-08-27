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
    .commerce-phone-expired{opacity:0;transform:scale(1.014);filter:brightness(.97)}
    .commerce-phone-focus{position:absolute;z-index:9;left:50%;top:68%;width:74%;height:15%;transform:translate(-50%,-50%) scale(.96);border:1px solid rgba(158,51,42,.58);border-radius:14px;box-shadow:0 0 0 5px rgba(158,51,42,.05),0 10px 30px rgba(0,0,0,.08);opacity:0;pointer-events:none;will-change:opacity,transform}

    .commerce-task-wrap{position:absolute;z-index:7;left:23%;top:49%;width:min(42%,350px);aspect-ratio:1.03;transform:translate(-50%,-50%) rotate(-1deg);will-change:transform,opacity}
    .commerce-task-stack{position:absolute;inset:0;pointer-events:none}
    .commerce-task-ghost{position:absolute;inset:0;border:1px solid rgba(255,255,255,.13);border-radius:20px;background:rgba(239,236,226,.08);box-shadow:0 24px 70px rgba(0,0,0,.18);opacity:0;will-change:opacity,transform}
    .commerce-task-ghost.one{transform:translate(13px,-9px) rotate(3.2deg)}
    .commerce-task-ghost.two{transform:translate(-10px,10px) rotate(-2.2deg)}
    .commerce-task-ghost span{position:absolute;left:20px;top:18px;color:rgba(255,255,255,.34);font:720 clamp(.48rem,.62vw,.58rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.1em;text-transform:uppercase}

    .commerce-task{position:absolute;inset:0;display:grid;grid-template-rows:47% 53%;border:1px solid rgba(35,39,44,.18);border-radius:20px;background:#f1eee6;color:#23262b;box-shadow:0 34px 80px rgba(0,0,0,.34);overflow:hidden}
    .commerce-task::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(118deg,rgba(255,255,255,.22),transparent 38%,rgba(70,60,48,.025));mix-blend-mode:multiply}
    .commerce-challenge{position:relative;z-index:1;padding:clamp(20px,2.3vw,30px);border-bottom:1px solid rgba(35,39,44,.12)}
    .commerce-kicker{margin:0 0 10px;color:#74716a;font:760 clamp(.56rem,.72vw,.67rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.11em;text-transform:uppercase}
    .commerce-task-title{margin:0;color:#22252a;font:700 clamp(1.28rem,1.95vw,1.95rem)/1.05 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:-.035em}
    .commerce-task-question{margin:15px 0 0;max-width:20ch;color:#4d504d;font:520 clamp(.78rem,.98vw,.96rem)/1.43 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .commerce-task-code{display:inline-flex;margin-top:12px;padding:6px 8px;border:1px solid rgba(36,39,44,.13);border-radius:7px;background:rgba(255,255,255,.44);color:#373a3f;font:700 clamp(.6rem,.74vw,.7rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.02em}

    .commerce-answer{position:relative;z-index:1;overflow:hidden;background:#ebe7dd}
    .commerce-reference{position:absolute;inset:0;padding:clamp(17px,2vw,25px);display:flex;flex-direction:column}
    .commerce-reference-head{margin:0 0 11px;color:#76736c;font:760 clamp(.54rem,.68vw,.63rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.11em;text-transform:uppercase}
    .commerce-checks{display:grid;gap:8px}
    .commerce-check{display:grid;grid-template-columns:44px 1fr auto;gap:8px;align-items:center;min-height:31px;padding:7px 8px;border-top:1px solid rgba(35,39,44,.08);color:#444743;font:580 clamp(.66rem,.8vw,.76rem)/1.25 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;opacity:.14;transform:translateY(5px);will-change:opacity,transform,background}
    .commerce-check:first-child{border-top:0}
    .commerce-check b{color:#858179;font:760 clamp(.54rem,.66vw,.61rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.07em}
    .commerce-check strong{font-weight:650;color:#33363a}
    .commerce-check i{display:grid;width:19px;height:19px;place-items:center;border-radius:50%;background:rgba(60,121,85,.09);color:#397250;font:800 .58rem/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-style:normal;opacity:0;transform:scale(.7);will-change:opacity,transform}
    .commerce-reference-truth{margin:auto 0 0;padding-top:10px;border-top:1px solid rgba(35,39,44,.12);color:#414440;font:700 clamp(.59rem,.72vw,.68rem)/1.35 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;opacity:0;transform:translateY(4px);will-change:opacity,transform}
    .commerce-reference-truth strong{color:#9e332a}

    .commerce-answer-cover{position:absolute;z-index:4;inset:0;display:grid;place-items:center;background:#dfd9cd;color:#77736b;box-shadow:0 -1px 0 rgba(255,255,255,.42),0 -18px 40px rgba(53,47,38,.06);will-change:transform}
    .commerce-answer-cover::before{content:"";position:absolute;top:16px;left:50%;width:38px;height:3px;transform:translateX(-50%);border-radius:99px;background:rgba(73,68,61,.18)}
    .commerce-answer-cover span{font:760 clamp(.56rem,.7vw,.65rem)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.11em;text-transform:uppercase}

    @media(max-width:760px){
      .commerce-showcase{left:4vw;right:auto;top:6%;width:92vw;height:47vh;max-height:455px}
      .commerce-phone{left:73%;height:98%;border-radius:23px}.commerce-phone-screen{border-radius:18px}
      .commerce-task-wrap{left:25%;top:46%;width:47%;transform:translate(-50%,-50%) rotate(-1deg)}
      .commerce-task{border-radius:14px}.commerce-task-ghost{border-radius:14px}
      .commerce-challenge{padding:13px}.commerce-kicker{margin-bottom:6px;font-size:.43rem}.commerce-task-title{font-size:1rem}.commerce-task-question{margin-top:8px;font-size:.61rem;line-height:1.32}.commerce-task-code{margin-top:7px;padding:4px 5px;font-size:.45rem}
      .commerce-reference{padding:11px}.commerce-reference-head{margin-bottom:5px;font-size:.42rem}.commerce-checks{gap:2px}.commerce-check{grid-template-columns:30px 1fr auto;gap:4px;min-height:22px;padding:3px 4px;font-size:.46rem}.commerce-check b{font-size:.39rem}.commerce-check i{width:13px;height:13px;font-size:.39rem}.commerce-reference-truth{padding-top:5px;font-size:.42rem}.commerce-answer-cover span{font-size:.43rem}
      .commerce-phone-focus{top:68%;width:76%;height:15%;border-radius:10px}
    }
    @media(prefers-reduced-motion:reduce){
      .commerce-phone-cart{opacity:0!important}.commerce-phone-expired{opacity:1!important;transform:none!important;filter:none!important}.commerce-phone-focus{opacity:.65!important;transform:translate(-50%,-50%) scale(1)!important}
      .commerce-answer-cover{transform:translateY(-102%)!important}.commerce-check,.commerce-reference-truth{opacity:1!important;transform:none!important}.commerce-check i{opacity:1!important;transform:none!important}.commerce-task-ghost{opacity:.3!important}
    }
  `;
  document.head.appendChild(style);

  const showcase = document.createElement('div');
  showcase.className = 'commerce-showcase scene-object';
  showcase.setAttribute('aria-label', 'CommerceOps QA practice task demonstrated on the real application with a reference answer');
  showcase.innerHTML = `
    <div class="commerce-motion-root">
      <div class="commerce-task-wrap">
        <div class="commerce-task-stack" aria-hidden="true">
          <div class="commerce-task-ghost one"><span>Happy path</span></div>
          <div class="commerce-task-ghost two"><span>Negative path</span></div>
        </div>
        <section class="commerce-task">
          <div class="commerce-challenge">
            <p class="commerce-kicker">QA PRACTICE · NEGATIVE PATH</p>
            <h3 class="commerce-task-title">Expired coupon</h3>
            <p class="commerce-task-question">Apply <strong>WELCOME20</strong>. Did the discount actually apply?</p>
            <span class="commerce-task-code">TEST THE PRODUCT</span>
          </div>
          <div class="commerce-answer">
            <div class="commerce-reference">
              <p class="commerce-reference-head">Reference answer</p>
              <div class="commerce-checks">
                <div class="commerce-check"><b>UI</b><strong>Coupon rejected</strong><i>✓</i></div>
                <div class="commerce-check"><b>TOTAL</b><strong>No discount</strong><i>✓</i></div>
                <div class="commerce-check"><b>STATE</b><strong>Persisted rejected</strong><i>✓</i></div>
              </div>
              <div class="commerce-reference-truth">WELCOME20 · <strong>rejected</strong> · expired</div>
            </div>
            <div class="commerce-answer-cover" aria-hidden="true"><span>Try it first</span></div>
          </div>
        </section>
      </div>

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
  const taskWrap = showcase.querySelector('.commerce-task-wrap');
  const cover = showcase.querySelector('.commerce-answer-cover');
  const checks = [...showcase.querySelectorAll('.commerce-check')];
  const checkMarks = [...showcase.querySelectorAll('.commerce-check i')];
  const truth = showcase.querySelector('.commerce-reference-truth');
  const ghosts = [...showcase.querySelectorAll('.commerce-task-ghost')];

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

    // Beat 1: the task is already readable. Beat 2: the real product performs it.
    const productResult = cubicRamp(p, .23, .39);
    cart.style.opacity = String(1 - productResult);
    cart.style.transform = `scale(${1 - productResult * .012})`;
    expired.style.opacity = String(productResult);
    expired.style.transform = `scale(${1.014 - productResult * .014})`;
    expired.style.filter = `brightness(${.97 + productResult * .03})`;

    const resultFocus = ramp(p, .34, .43) * (1 - ramp(p, .78, .86) * .45);
    focus.style.opacity = String(resultFocus * .82);
    focus.style.transform = `translate(-50%,-50%) scale(${.96 + resultFocus * .04})`;
    phone.style.transform = `translate(-50%,-50%) scale(${1 + productResult * .012})`;
    phone.style.filter = `brightness(${1 - productResult * .025 + resultFocus * .02})`;

    // Beat 3: uncover the answer instead of replacing the task with another object.
    const uncover = cubicRamp(p, .47, .60);
    cover.style.transform = `translateY(${-102 * uncover}%)`;

    // Beat 4: reveal what a good QA check should verify, one item at a time.
    checks.forEach((node, index) => {
      const visible = ramp(p, .58 + index * .075, .65 + index * .075);
      const active = ramp(p, .60 + index * .075, .67 + index * .075);
      node.style.opacity = String(.14 + visible * .86);
      node.style.transform = `translateY(${(1 - visible) * 5}px)`;
      node.style.background = `rgba(255,255,255,${active * .26})`;
      const mark = checkMarks[index];
      if (mark) {
        mark.style.opacity = String(active);
        mark.style.transform = `scale(${.7 + active * .3})`;
      }
    });

    const truthIn = ramp(p, .78, .85);
    truth.style.opacity = String(truthIn);
    truth.style.transform = `translateY(${(1 - truthIn) * 4}px)`;

    // Beat 5: only after one exercise is understood, hint that the repo contains more.
    const more = cubicRamp(p, .84, .94);
    ghosts.forEach((ghost, index) => {
      ghost.style.opacity = String(more * (index === 0 ? .34 : .25));
      const x = index === 0 ? 13 : -10;
      const y = index === 0 ? -9 : 10;
      const r = index === 0 ? 3.2 : -2.2;
      ghost.style.transform = `translate(${x * more}px,${y * more}px) rotate(${r * more}deg)`;
    });
    taskWrap.style.transform = `translate(-50%,-50%) rotate(${-1 + more * .35}deg) scale(${1 - more * .012})`;

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();
