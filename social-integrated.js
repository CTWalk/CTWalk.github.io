(() => {
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
    @media(max-width:760px){
      .nocode-runner{grid-template-columns:44px auto;gap:13px;min-width:220px;padding:14px 17px;border-radius:16px}
      .nocode-runner svg{width:44px;height:44px}
      .nocode-runner small{font-size:.64rem}
      .nocode-runner strong{font-size:.9rem}
      .nocode-runner .check{width:22px;height:22px;font-size:.78rem}
    }
  `;
  document.head.appendChild(style);

  const load = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  load('./english-copy.js')
    .then(() => load('./social-runtime.js'))
    .then(() => load('./commerce-integrated.js'))
    .then(() => load('./outro-heatmap.js'))
    .then(() => load('./typography-runtime.js'))
    .then(() => load('./evidence-readability.js'))
    .then(() => load('./experience-pacing.js'))
    .catch(() => {});
})();
