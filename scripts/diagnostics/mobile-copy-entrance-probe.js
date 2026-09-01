(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('uiux-entrance-probe') !== '1') return;

  const fallback = document.getElementById('mobile-fallback');
  if (!fallback) {
    console.error('[mobile-copy-entrance-probe] #mobile-fallback not found');
    return;
  }

  const style = document.createElement('style');
  style.dataset.mobileCopyEntranceProbe = 'true';
  style.textContent = `
    .mobile-copy-entrance-probe{
      position:fixed;
      z-index:140;
      left:12px;
      right:12px;
      bottom:max(12px,env(safe-area-inset-bottom));
      max-height:44vh;
      overflow:auto;
      padding:12px;
      border:1px solid rgba(255,255,255,.28);
      border-radius:12px;
      background:rgba(6,8,12,.94);
      box-shadow:0 16px 48px rgba(0,0,0,.5);
      color:#fff;
      font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
      -webkit-backdrop-filter:blur(14px);
      backdrop-filter:blur(14px);
    }
    .mobile-copy-entrance-probe strong{display:block;margin-bottom:7px;font-size:12px}
    .mobile-copy-entrance-probe pre{margin:0 0 9px;white-space:pre-wrap;word-break:break-word;color:rgba(255,255,255,.82)}
    .mobile-copy-entrance-probe-actions{display:flex;gap:8px;position:sticky;bottom:0;padding-top:6px;background:linear-gradient(transparent,rgba(6,8,12,.98) 30%)}
    .mobile-copy-entrance-probe button{flex:1;min-height:38px;border:1px solid rgba(255,255,255,.34);border-radius:8px;background:rgba(255,255,255,.08);color:#fff;font:600 12px/1 system-ui,-apple-system,sans-serif}
    .mobile-copy-entrance-probe-events{max-height:76px;overflow:auto;margin-bottom:4px;color:rgba(174,220,255,.9)}
  `;
  document.head.appendChild(style);

  const panel = document.createElement('aside');
  panel.className = 'mobile-copy-entrance-probe';
  panel.setAttribute('aria-label', 'Mobile copy entrance diagnostic');
  panel.innerHTML = `
    <strong>Mobile copy entrance probe</strong>
    <pre data-probe-state></pre>
    <div class="mobile-copy-entrance-probe-events" data-probe-events></div>
    <div class="mobile-copy-entrance-probe-actions">
      <button type="button" data-probe-replay>Replay fade</button>
      <button type="button" data-probe-refresh>Refresh state</button>
    </div>
  `;
  document.body.appendChild(panel);

  const stateNode = panel.querySelector('[data-probe-state]');
  const eventsNode = panel.querySelector('[data-probe-events]');
  const replayButton = panel.querySelector('[data-probe-replay]');
  const refreshButton = panel.querySelector('[data-probe-refresh]');
  const eventLog = [];

  function copyLines(){
    return [...fallback.querySelectorAll('.mobile-copy-line')];
  }

  function log(message){
    const elapsed = Math.round(performance.now());
    eventLog.push(`${elapsed}ms ${message}`);
    while (eventLog.length > 8) eventLog.shift();
    eventsNode.textContent = eventLog.join('\n');
  }

  function snapshot(){
    const firstLine = copyLines()[0] || null;
    const computed = firstLine ? getComputedStyle(firstLine) : null;
    const animations = firstLine && typeof firstLine.getAnimations === 'function'
      ? firstLine.getAnimations().map(animation => ({
          playState: animation.playState,
          currentTime: animation.currentTime == null ? null : Math.round(Number(animation.currentTime)),
          startTime: animation.startTime == null ? null : Math.round(Number(animation.startTime))
        }))
      : [];

    return {
      readyState: document.readyState,
      visibility: document.visibilityState,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      uiuxTest: params.get('uiux-test') === '1',
      copyStatic: fallback.classList.contains('copy-static'),
      copyEnter: fallback.classList.contains('copy-enter'),
      lineCount: copyLines().length,
      animationName: computed?.animationName || null,
      animationPlayState: computed?.animationPlayState || null,
      animationDuration: computed?.animationDuration || null,
      opacity: computed?.opacity || null,
      filter: computed?.filter || null,
      transform: computed?.transform || null,
      activeAnimations: animations
    };
  }

  function refresh(){
    stateNode.textContent = JSON.stringify(snapshot(), null, 2);
  }

  function replay(){
    if (fallback.classList.contains('copy-static')) {
      log('Replay blocked: copy-static is active');
      refresh();
      return;
    }

    fallback.classList.remove('copy-enter');
    log('Replay: copy-enter removed');
    refresh();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fallback.classList.add('copy-enter');
        log('Replay: copy-enter added after 2 RAF');
        refresh();
      });
    });
  }

  fallback.addEventListener('animationstart', event => {
    if (event.animationName !== 'mobileCopyLineIn') return;
    log(`animationstart: ${event.target.textContent}`);
    refresh();
  }, true);

  fallback.addEventListener('animationend', event => {
    if (event.animationName !== 'mobileCopyLineIn') return;
    log(`animationend: ${event.target.textContent}`);
    refresh();
  }, true);

  fallback.addEventListener('animationcancel', event => {
    if (event.animationName !== 'mobileCopyLineIn') return;
    log(`animationcancel: ${event.target.textContent}`);
    refresh();
  }, true);

  replayButton.addEventListener('click', replay);
  refreshButton.addEventListener('click', refresh);
  document.addEventListener('visibilitychange', refresh);

  log('Probe attached');
  refresh();
})();
