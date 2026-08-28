(() => {
  const experience = document.getElementById('experience');
  const cueScene = document.querySelector('.scene[data-scene="4"]');
  const cueDesktop = cueScene?.querySelector('.cuesheet-desktop');
  const cuePhones = cueScene ? [...cueScene.querySelectorAll('.cue-phone-manager,.cue-phone-cast')] : [];
  const socialPhone = document.querySelector('.scene[data-scene="3"] .social-final-phone');
  if (!experience || (!cueDesktop && !socialPhone)) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const style = document.createElement('style');
  style.dataset.evidenceReadability = 'true';
  style.textContent = `
    /* Pass 2 refinement: keep CueSheet's continuous evidence focus while
       SocialPlatform uses the restrained 92% -> 98% final-phone treatment. */

    .scene[data-scene="4"] .cuesheet-desktop{
      left:max(1vw,calc((100% - var(--content))/2));
      top:6.5%;
      width:min(64vw,880px);
      height:min(74vh,710px);
      transform-origin:42% 46%;
      will-change:transform,scale,filter
    }

    .scene[data-scene="4"] .cue-phone-manager,
    .scene[data-scene="4"] .cue-phone-cast{
      transform-origin:center;
      will-change:transform,scale,filter,opacity
    }

    .scene[data-scene="3"] .social-final-phone{
      height:98%;
      scale:1
    }

    @media(max-width:760px){
      .scene[data-scene="4"] .cuesheet-desktop{
        left:2vw;
        right:auto;
        top:4.5%;
        width:96vw;
        height:54vh;
        transform-origin:center top
      }
      .scene[data-scene="4"] .cue-phone-manager,
      .scene[data-scene="4"] .cue-phone-cast{
        display:none!important
      }
      .scene[data-scene="3"] .social-final-phone{
        height:94%;
        scale:1
      }
    }

    @media(prefers-reduced-motion:reduce){
      .scene[data-scene="4"] .cuesheet-desktop{scale:1.08!important;filter:none!important}
      .scene[data-scene="4"] .cue-phone-manager,
      .scene[data-scene="4"] .cue-phone-cast{filter:none!important;scale:1!important}
      .scene[data-scene="3"] .social-final-phone{scale:1!important}
    }
  `;
  document.head.appendChild(style);

  if (reduced) return;

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smoother = t => {
    const x = clamp(t);
    return x * x * x * (x * (x * 6 - 15) + 10);
  };
  const ramp = (p, start, end) => smoother((p - start) / Math.max(.0001, end - start));
  const damp = (current, target, lambda, dt) =>
    current + (target - current) * (1 - Math.exp(-lambda * dt / 1000));

  function getTimelineStep() {
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
    return step;
  }

  let cueFocus = 0;
  let cueContextYield = 0;
  let initialized = false;
  let lastFrame = performance.now();
  let raf = 0;

  function render(now) {
    const dt = Math.min(50, Math.max(1, now - lastFrame));
    lastFrame = now;
    const step = getTimelineStep();
    const mobile = window.innerWidth <= 760;

    // Match the native CueSheet phase exactly. One continuous camera move spans
    // workspace -> conflict -> review, so the viewer never feels a reset between states.
    const cueRel = step - 4;
    const cuePhase = clamp((cueRel + .34) / .68);
    const cuePrimary = ramp(cuePhase, .10, .64);
    const cueSettle = ramp(cuePhase, .64, .84);
    const cueTarget = cuePrimary * .88 + cueSettle * .12;
    const contextTarget = ramp(cuePhase, .08, .38);

    if (!initialized) {
      cueFocus = cueTarget;
      cueContextYield = contextTarget;
      initialized = true;
    } else {
      cueFocus = damp(cueFocus, cueTarget, 9.5, dt);
      cueContextYield = damp(cueContextYield, contextTarget, 10.5, dt);
    }

    if (cueDesktop) {
      const maxLift = mobile ? .08 : .12;
      cueDesktop.style.scale = String(1 + cueFocus * maxLift);
      cueDesktop.style.filter = `brightness(${1 + cueFocus * .025})`;
    }

    cuePhones.forEach((phone, index) => {
      const offset = index === 0 ? 1 : .94;
      const amount = cueContextYield * offset;
      phone.style.scale = String(1 - amount * .13);
      phone.style.filter = `brightness(${1 - amount * .28}) saturate(${1 - amount * .22})`;
    });

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else {
      lastFrame = performance.now();
      raf = requestAnimationFrame(render);
    }
  });
})();
