(() => {
  const load = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  load('./social-runtime.js').then(() => load('./commerce-integrated.js')).catch(() => {});
})();
