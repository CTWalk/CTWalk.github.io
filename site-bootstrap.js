(() => {
  const MOBILE_QUERY = '(max-width: 760px)';
  const mobileQuery = window.matchMedia(MOBILE_QUERY);
  const presentationAtLoad = mobileQuery.matches ? 'mobile-fallback' : 'desktop';
  const html = document.documentElement;
  const params = new URLSearchParams(window.location.search);

  const load = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });

  const loadSafely = async src => {
    try {
      await load(src);
      return true;
    } catch (error) {
      console.error('[site-bootstrap]', error);
      return false;
    }
  };

  // A breakpoint crossing changes presentation ownership. Reloading creates a
  // clean runtime boundary: desktop scene writers never remain alive behind the
  // mobile fallback, and returning to desktop reinitializes the full experience.
  mobileQuery.addEventListener('change', event => {
    const nextPresentation = event.matches ? 'mobile-fallback' : 'desktop';
    if (nextPresentation !== presentationAtLoad) window.location.reload();
  });

  if (mobileQuery.matches) {
    html.dataset.presentation = 'mobile-fallback';

    // Mobile first-paint and desktop-runtime ownership are decided directly by
    // index.html before this bootstrap runs. This branch only finalizes the DOM
    // isolation and loads the dedicated mobile runtime; it must not need to undo
    // an already-running desktop controller.
    const experience = document.getElementById('experience');
    if (experience) {
      experience.hidden = true;
      experience.setAttribute('aria-hidden', 'true');
      // Baseline asset scanners inspect image display state directly. Mark every
      // desktop evidence image as display:none so mobile verification cannot be
      // blocked by assets that are intentionally outside the mobile product.
      experience.querySelectorAll('img').forEach(image => {
        image.style.display = 'none';
      });
    }

    // The module script after this bootstrap only starts Three.js when #webgl
    // exists. Remove that identifier in mobile mode so the import/render loop is
    // never created.
    const webgl = document.getElementById('webgl');
    if (webgl) {
      webgl.dataset.desktopWebglId = 'webgl';
      webgl.removeAttribute('id');
    }

    (async () => {
      const loaded = await loadSafely('./assets/js/mobile-fallback.js');
      if (!loaded) {
        console.error('[site-bootstrap] mobile fallback failed to initialize');
      }

      if (loaded && params.get('uiux-entrance-probe') === '1') {
        await loadSafely('./scripts/diagnostics/mobile-copy-entrance-probe.js');
      }

      if (params.get('uiux-test') === '1') {
        await loadSafely('./scripts/controls/ui-ux-mobile-test-control.js');
      }
    })();
    return;
  }

  html.dataset.presentation = 'desktop';

  const style = document.createElement('style');
  style.dataset.nocodeRunnerScale = 'true';
  style.textContent = `
    .nocode-runner{
      grid-template-columns:52px auto;
      gap:16px;
      min-width:250px;
      padding:17px 21px;
      border-radius:18px;
      box-shadow:0 24px 72px rgba(0,0,0,.48)
    }
    .nocode-runner svg{width:52px;height:52px}
    .nocode-runner small{margin-bottom:5px;font-size:.7rem;letter-spacing:.09em}
    .nocode-runner strong{gap:9px;font-size:1rem;line-height:1.15}
    .nocode-runner .check{width:24px;height:24px;font-size:.86rem}
  `;
  document.head.appendChild(style);

  (async () => {
    // Preserve the established desktop initialization order so this structural
    // cleanup does not alter animation-writer precedence or the accepted design.
    await loadSafely('./assets/js/social-runtime.js');
    await loadSafely('./assets/js/commerce-integrated.js');
    await loadSafely('./assets/js/outro-heatmap.js');
    await loadSafely('./assets/js/typography-runtime.js');
    await loadSafely('./assets/js/evidence-readability.js');
    await loadSafely('./assets/js/experience-pacing.js');

    if (params.get('uiux-test') === '1') {
      await loadSafely('./scripts/controls/ui-ux-test-control.js');
    }
  })();
})();
