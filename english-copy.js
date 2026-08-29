(() => {
  if (typeof copy === 'undefined' || !copy.en || typeof applyLanguage !== 'function') return;

  const titleStyle = document.createElement('style');
  titleStyle.dataset.englishTitleWrapping = 'true';
  titleStyle.textContent = `
    html[lang="en"] .scene-title{
      max-width:18ch;
      white-space:normal;
      text-wrap:balance
    }
    html[lang="en"] .intro .scene-title{max-width:15ch}
    html[lang="en"] .scene.center:not(.intro) .scene-title{max-width:20ch}

    @media(max-width:760px){
      html[lang="en"] .scene-title{max-width:16ch}
      html[lang="en"] .intro .scene-title{max-width:15ch}
      html[lang="en"] .scene.center:not(.intro) .scene-title{max-width:18ch}
    }
  `;
  document.head.appendChild(titleStyle);

  Object.assign(copy.en, {
    title: 'CTWalk | QA / SDET Engineer',
    description: 'QA/SDET engineer working on web, API, database, mobile, CI and product debugging.',
    introLabel: 'QA / SDET · SOFTWARE ENGINEERING',
    introTitle: 'I test software from the UI to the database.',
    introBody: 'I automate web, API, database and mobile checks, then run them in CI. When one fails, I trace the failure before deciding whether the test or the product needs fixing.',
    scroll: 'Scroll',
    commerceTitle: 'A checkout can fail in more than one place.',
    commerceBody: 'For this demo, I follow a checkout through the browser, API, database, webhook and notification, and verify the result at each step.',
    nocodeTitle: 'I keep test steps readable.',
    nocodeBody: 'The YAML says what the test should do. Playwright executes it. I keep locators, failure output and CI config outside the YAML so UI changes are easier to update.',
    socialTitle: 'I run one release through all of these checks.',
    socialBody: 'Build, API, database, performance, web and mobile checks all run against the same version.',
    cueTitle: 'I also build my own products.',
    cueBody: "CueSheet is a rehearsal scheduler I built. If someone's availability changes, it can rebuild the schedule while trying to keep the existing plan intact.",
    approachLabel: 'How I work',
    approachTitle: 'I decide what proves the result, then pick the tool.',
    approachBody: 'I test at the layer that can confirm the outcome. I control the test state and keep the logs or artifacts I need to debug a failure.',
    recentLabel: 'Recently',
    recentTitle: "Lately I've been testing AI tooling too.",
    recentBody: "I check what was actually evaluated, what happens when input is missing, and whether a failure can be reproduced. It's a newer area of my QA work.",
    viewRepo: 'View repository',
    outroTitle: 'More of my work is on GitHub.',
    openGithub: 'Open GitHub'
  });

  const activeLanguage = document.querySelector('.lang-switch button[aria-pressed="true"]')?.dataset.lang
    || (document.documentElement.lang.startsWith('zh') ? 'zh' : 'en');

  if (activeLanguage === 'en') applyLanguage('en');
})();
