(() => {
  const style = document.createElement('style');
  style.dataset.readabilityTypography = 'true';
  style.textContent = `
    :root{
      --text-micro:clamp(.75rem,.72rem + .12vw,.82rem);
      --text-small:clamp(.86rem,.82rem + .16vw,.94rem);
      --text-ui:clamp(.94rem,.9rem + .16vw,1rem)
    }

    html[lang="en"] .scene-title{
      max-width:18ch;
      white-space:normal;
      text-wrap:balance
    }
    html[lang="en"] .intro .scene-title{max-width:15ch}
    html[lang="en"] .scene.center:not(.intro) .scene-title{max-width:20ch}

    .scene-label{
      font-size:var(--text-small);
      letter-spacing:.085em
    }

    .scene-link{
      font-size:var(--text-ui)
    }

    .github{
      font-size:.94rem
    }

    .lang-switch button{
      font-size:.9rem
    }

    .code-plate pre{
      font-size:clamp(.86rem,1.05vw,.98rem);
      line-height:1.65
    }

    .nocode-runner small{
      font-size:.78rem
    }

    .audit-row{
      font-size:clamp(.78rem,.9vw,.88rem);
      line-height:1.32
    }

    .audit-row strong,
    .audit-row > div > span{
      transform:none!important
    }

    @media(max-width:760px){
      html[lang="en"] .scene-title{max-width:16ch}
      html[lang="en"] .intro .scene-title{max-width:15ch}
      html[lang="en"] .scene.center:not(.intro) .scene-title{max-width:18ch}
      .scene-label{font-size:.84rem}
      .scene-link{font-size:.98rem}
      .lang-switch button{font-size:.88rem}
      .code-plate pre{font-size:.8rem;line-height:1.55}
      .nocode-runner small{font-size:.75rem}
      .audit-row{font-size:.75rem;line-height:1.3;padding:7px 8px;gap:8px}
    }
  `;
  document.head.appendChild(style);
})();
