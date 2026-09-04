(() => {
  if (typeof copy === 'undefined' || !copy.en || typeof applyLanguage !== 'function') return;

  Object.assign(copy.en, {
    introTitle: 'I test software\nFrom UI to DB',
    commerceTitle: 'One flow\nChecked all the way through',
    nocodeTitle: 'Readable tests\nMaintainable locators',
    socialTitle: 'One release path\nEvidence at every layer',
    cueTitle: 'Replan the rehearsal\nKeep it stable',
    recentTitle: 'Same QA questions\nNewer kind of system',
    outroTitle: 'More of my work is on GitHub'
  });

  const activeLanguage = document.querySelector('.lang-switch button[aria-pressed="true"]')?.dataset.lang
    || (document.documentElement.lang.startsWith('zh') ? 'zh' : 'en');

  if (activeLanguage === 'en') applyLanguage('en');
})();
