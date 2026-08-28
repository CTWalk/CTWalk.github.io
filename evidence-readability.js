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
    /* Pass 2, second pass: evidence should become visually dominant,
       not merely a few percent larger. Screenshot pixels stay authentic. */

    .scene[data-scene="4"] .cuesheet-desktop{
      left:max(1vw,calc((100% - var(--content))/2));
      top:6.5%;
      width:min(64vw,880px);
      height:min(74vh,710px);
      transform-origin:42% 46%;
      will-change:transform,scale
    }

    .scene[data-scene="4"] .cue-phone-manager,
    .scene[data-scene="4"] .cue-phone-cast{
      transform-origin:center;
      will-change:transform,scale,filter,opacity
    }

    /* The final Social product state should read as the destination,
       not as another small object inside the previous composition. */
    .scene[data-scene="3"] .social-final-phone{
      height:100%;
      scale:1.18;
      transform-origin:center
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
        height:96%;
        scale:1.16
      }
    }

    @media(prefers-reduced-motion:reduce){
      .scene[data-scene="4"] .cuesheet-desktop{scale:1!important}
      .scene[data-scene="4"] .cue-phone-manager,
      .scene[data-scene="4"] .cue-phone-cast{filter:none!important;scale:1!important}
    }
  `;
  document.head.appendChild(style);

  if (reduced || !cueDesktop) return;

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smooth = t => {
    const x = clamp(t);
    return x * x * (3 - 2 * x);
  };
  const ramp = (p, start, end) => smooth((p - start) / Math.max(.0001, end - start));

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

  let raf = 0;
  function render() {
    const rel = getTimelineStep() - 4;
    const phase = clamp((rel + .34) / .68);
    const conflictFocus = ramp(phase, .16, .28) * (1 - ramp(phase, .43, .52));
    const reviewFocus = ramp(phase, .40, .56);
    const focus = Math.max(conflictFocus, reviewFocus);
    const mobile = window.innerWidth <= 760;

    cueDesktop.style.scale = String(1 + focus * (mobile ? .08 : .12));

    cuePhones.forEach((phone, index) => {
      const amount = focus * (index === 0 ? 1 : .92);
      phone.style.scale = String(1 - amount * .16);
      phone.style.filter = `brightness(${1 - amount * .34}) saturate(${1 - amount * .28})`;
    });

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();
