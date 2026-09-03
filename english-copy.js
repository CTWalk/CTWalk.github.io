(() => {
  if (typeof copy === 'undefined' || !copy.en || typeof applyLanguage !== 'function') return;

  Object.assign(copy.en, {
    introTitle: 'I test software from the UI to the database.',
    commerceTitle: 'One user flow.\nVerified across the stack.',
    nocodeTitle: 'Write browser tests\nin YAML.',
    socialTitle: 'One product.\nOne release-quality test bed.',
    cueTitle: 'Replan the rehearsal.\nKeep the schedule stable.',
    recentTitle: 'Find false passes.\nProve them upstream.',
    outroTitle: 'More projects and engineering history\nlive on GitHub.'
  });

  const activeLanguage = document.querySelector('.lang-switch button[aria-pressed="true"]')?.dataset.lang
    || (document.documentElement.lang.startsWith('zh') ? 'zh' : 'en');

  if (activeLanguage === 'en') applyLanguage('en');
})();
