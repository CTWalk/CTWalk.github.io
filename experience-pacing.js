(() => {
  const experience = document.getElementById('experience');
  const noCodeScene = document.querySelector('.scene[data-scene="2"]');
  const auditScene = document.querySelector('.scene[data-scene="5"]');
  if (!experience || (!noCodeScene && !auditScene)) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smooth = t => {
    const x = clamp(t);
    return x * x * (3 - 2 * x);
  };

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
    const step = getTimelineStep();

    if (noCodeScene) {
      const rel = step - 2;
      const phase = clamp((rel + .34) / .68);
      const runner = noCodeScene.querySelector('.nocode-runner');
      const stepNodes = [...noCodeScene.querySelectorAll('.nocode-step')];

      // Let the YAML exist quietly before execution begins, then finish the
      // Playwright reveal early enough to create an explicit final reading hold.
      const ranges = [[.12, .38], [.34, .62], [.58, 1.02]];
      const result = smooth(clamp((phase - .72) / .10));

      stepNodes.forEach((stepNode, index) => {
        const range = ranges[index];
        const enter = smooth(clamp((phase - range[0]) / .07));
        const exit = index === 2
          ? 1 - result * .08
          : 1 - smooth(clamp((phase - (range[1] - .07)) / .07));
        const focus = enter * exit;

        stepNode.style.backgroundColor = `rgba(142,169,255,${focus * .15})`;
        stepNode.style.boxShadow = `0 0 0 1px rgba(142,169,255,${focus * .22}),0 0 ${18 * focus}px rgba(142,169,255,${focus * .18})`;
        stepNode.style.opacity = String(.72 + focus * .28);
      });

      if (runner) {
        runner.style.opacity = String(result);
        runner.style.transform = `translate(-50%,calc(-50% + ${(1 - result) * 12}px)) scale(${.96 + result * .04})`;
      }
    }

    if (auditScene) {
      const rel = step - 5;
      const phase = clamp(rel / .72);
      const rows = [...auditScene.querySelectorAll('.audit-row')];
      const activity = auditScene.querySelector('.audit-activity');
      const readStart = .18;
      const readEnd = .72;
      const reading = smooth(clamp((phase - .14) / .06));
      const cardPos = clamp((phase - readStart) / (readEnd - readStart)) * Math.max(0, rows.length - 1);
      const scanProgress = smooth(clamp((phase - .78) / .12));
      const passIn = smooth(clamp((phase - .84) / .08));
      const scannerMode = Math.max(scanProgress, passIn);
      const recede = smooth(clamp(scannerMode));

      // Keep all contributions present, but make the active row the only one
      // asking for serious reading. Once scanning begins, the history becomes
      // background context rather than competing with the scanner/PASS mode.
      rows.forEach((row, index) => {
        const focus = reading * Math.pow(clamp(1 - Math.abs(cardPos - index)), 2);
        const baseOpacity = .14 + focus * .86;
        const baseBrightness = .32 + focus * .70;
        const saturation = .62 + focus * .38;

        row.style.opacity = String(baseOpacity * (1 - recede * .42));
        row.style.filter = `brightness(${baseBrightness * (1 - recede * .12)}) saturate(${saturation})`;
      });

      if (activity) {
        activity.style.opacity = String(.88 * (1 - scannerMode * .82));
      }
    }

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();
