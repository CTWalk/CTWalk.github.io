(() => {
  if (typeof copy === 'undefined' || !copy.en || typeof applyLanguage !== 'function') return;

  Object.assign(copy.en, {
    introTitle: 'I test software\nFrom UI to DB',
    introBody: 'I build automation across web, API, database, mobile and CI. When something fails, I trace it to the source—and fix the product when the test is not the problem.',
    commerceTitle: 'One flow\nChecked all the way',
    commerceBody: 'CommerceOps is a realistic commerce QA practice environment. Test checkout and failure cases first, then compare the coverage with reference verification paths to see what was missed.',
    nocodeTitle: 'Readable tests\nMaintainable locators',
    nocodeBody: "YAML describes the test flow. Playwright executes it. Locators, failure evidence and CI stay separate, so UI changes don't rewrite the test intent.",
    socialTitle: 'One release path\nEvidence at every layer',
    socialBody: 'Build, API, database, performance, web E2E and mobile smoke checks all verify the same role-based product. Together they form one release gate instead of isolated test suites.',
    cueTitle: 'Replan the rehearsal\nKeep it stable',
    cueBody: 'CueSheet is a deployed rehearsal scheduler. When availability changes, it finds a new conflict-free plan while preserving as much of the published schedule as possible.',
    recentTitle: 'Same QA questions\nNewer kind of system',
    recentBody: 'Decision Contract Audit replays frozen decisions against reliability contracts. I apply the same QA method upstream too: missing data, zero checks or skipped cases should not quietly become a pass.',
    outroTitle: 'More of my work is on GitHub'
  });

  const activeLanguage = document.querySelector('.lang-switch button[aria-pressed="true"]')?.dataset.lang
    || (document.documentElement.lang.startsWith('zh') ? 'zh' : 'en');

  if (activeLanguage === 'en') applyLanguage('en');
})();
