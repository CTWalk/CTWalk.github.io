(() => {
  const style = document.createElement('style');
  style.dataset.evidenceReadability = 'true';
  style.textContent = `
    /* Pass 2: give authentic product evidence enough physical territory.
       Do not alter screenshot content, crop strategy, or product UI. */

    /* CueSheet: the desktop state is the evidence-bearing surface.
       Phones remain supporting context on desktop. */
    .scene[data-scene="4"] .cuesheet-desktop{
      left:max(2vw,calc((100% - var(--content))/2));
      top:8%;
      width:min(61vw,830px);
      height:min(72vh,690px)
    }

    /* SocialPlatform: preserve the screen-matched frame, but let the
       final real-product state occupy more of the existing showcase. */
    .scene[data-scene="3"] .social-final-phone{
      height:98%
    }

    @media(max-width:760px){
      /* A shrunk desktop-plus-two-phones composition makes every surface
         unreadable. Give the active desktop evidence the viewport instead. */
      .scene[data-scene="4"] .cuesheet-desktop{
        left:3vw;
        right:auto;
        top:6%;
        width:94vw;
        height:50vh
      }
      .scene[data-scene="4"] .cue-phone-manager,
      .scene[data-scene="4"] .cue-phone-cast{
        display:none!important
      }

      .scene[data-scene="3"] .social-final-phone{
        height:94%
      }
    }
  `;
  document.head.appendChild(style);
})();
