(() => {
  const scene = document.querySelector('.scene[data-scene="3"]');
  const showcase = scene?.querySelector('.social-showcase');
  const experience = document.getElementById('experience');
  if (!scene || !showcase || !experience) return;

  const assets = {
    product: 'https://github.com/user-attachments/assets/46073db9-02ac-4645-8784-721165d7d504',
    signoff: 'https://github.com/user-attachments/assets/b2fc999c-b87a-4b91-8230-870c9c78b193'
  };

  const style = document.createElement('style');
  style.dataset.socialIntegrated = 'true';
  style.textContent = `
    .social-showcase{
      top:11%;right:max(2.5vw,calc((100% - var(--content))/2));width:min(57vw,850px);
      overflow:visible;border:0;border-radius:0;background:transparent;box-shadow:none;backdrop-filter:none;-webkit-backdrop-filter:none
    }
    .social-motion-root{position:absolute;inset:0;isolation:isolate;perspective:1200px;transform-style:preserve-3d}
    .social-product-plane{position:absolute;z-index:3;inset:0;transform-style:preserve-3d;transform-origin:50% 70%;will-change:transform,filter,opacity}
    .social-product-plane img{position:absolute;inset:0;width:100%;height:100%;border:1px solid rgba(255,255,255,.18);border-radius:clamp(15px,1.7vw,25px);box-shadow:0 34px 100px rgba(0,0,0,.43);background:#0d1117;will-change:opacity}
    .social-product-initial{object-fit:cover;object-position:center top}
    .social-vector-world{position:absolute;z-index:6;inset:-4% -5% -6%;pointer-events:none;transform-style:preserve-3d;will-change:opacity,transform,filter}
    .social-vector-world svg{display:block;width:100%;height:100%;overflow:visible}
    .social-line{fill:none;stroke:rgba(231,237,255,.42);stroke-width:1.15;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
    .social-release-base{stroke:rgba(231,237,255,.48)}
    .social-release-marker{fill:#f2f5ff;filter:drop-shadow(0 0 5px rgba(205,218,255,.22))}
    .social-structure-segment{stroke:rgba(238,243,255,.56);opacity:0}
    .social-structure-segment.is-soft{stroke:rgba(231,237,255,.26)}
    .social-scan{stroke:rgba(247,249,255,.82);stroke-width:1.2;opacity:0;vector-effect:non-scaling-stroke}
    .social-guide{fill:none;stroke:rgba(231,237,255,.15);stroke-width:1;stroke-dasharray:3 8;opacity:0;vector-effect:non-scaling-stroke}
    .social-db-icon{opacity:0;transform-origin:370px 238px;will-change:opacity,transform}
    .social-db-part{opacity:0;will-change:opacity}
    .social-db-stroke{fill:none;stroke:rgba(238,243,255,.56);stroke-width:1.35;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
    .social-db-dot{fill:rgba(238,243,255,.42)}
    .social-label-world{position:absolute;z-index:7;inset:-4% -5% -6%;pointer-events:none}
    .social-layer-heading{position:absolute;top:22.5%;transform:translate(-50%,-50%);color:rgba(248,250,255,.9);font:680 clamp(13px,1.15vw,16px)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:1.45px;white-space:nowrap;opacity:0;text-shadow:0 2px 12px rgba(0,0,0,.45);will-change:opacity}
    .social-layer-heading::after{content:"";display:block;width:58px;height:1px;margin:8px auto 0;background:rgba(242,246,255,.34)}
    .social-db-heading{left:37%}
    .social-web-heading{left:68.2%}
    .social-final-phone{position:absolute;z-index:9;left:50%;top:50%;height:92%;aspect-ratio:518/915;transform:translate(-50%,calc(-50% + 18px)) scale(.93);border:1px solid rgba(255,255,255,.26);border-radius:clamp(24px,2.8vw,36px);background:#121417;box-shadow:0 38px 120px rgba(0,0,0,.5),inset 0 0 0 5px rgba(7,8,10,.94);overflow:hidden;opacity:0;will-change:transform,opacity,filter}
    .social-final-phone::before{content:"";position:absolute;z-index:8;left:50%;top:9px;width:22%;height:5px;transform:translateX(-50%);border-radius:99px;background:rgba(8,9,11,.82);box-shadow:0 1px 0 rgba(255,255,255,.08)}
    .social-final-phone-screen{position:absolute;inset:6px;border-radius:clamp(18px,2.1vw,29px);overflow:hidden;background:#f6f3ea}
    .social-final-phone-screen img{display:block;width:100%;height:100%;object-fit:cover;object-position:center top;background:#f6f3ea}

    @media(max-width:760px){
      .social-showcase{left:4vw;right:auto;top:8%;width:92vw;max-height:44vh}
      .social-layer-heading{font-size:13px;letter-spacing:1.15px}
      .social-final-phone{height:86%;border-radius:24px}
      .social-final-phone-screen{border-radius:19px}
    }
    @media(prefers-reduced-motion:reduce){
      .social-product-plane{transform:none!important;filter:none!important;opacity:1!important}
      .social-product-initial{opacity:0!important}
      .social-final-phone{opacity:1!important;transform:translate(-50%,-50%) scale(1)!important;filter:none!important}
      .social-vector-world{opacity:.45!important;transform:none!important;filter:none!important}
      .social-release-base{stroke-dashoffset:0!important}
      .social-release-marker,.social-structure-segment,.social-scan,.social-guide,.social-db-icon{display:none!important}
      .social-layer-heading{opacity:.7!important}
    }
  `;
  document.head.appendChild(style);

  showcase.setAttribute('aria-label', 'SocialPlatform release moving through database and web layers before resolving into the mobile product');
  showcase.innerHTML = `
    <div class="social-motion-root">
      <div class="social-product-plane">
        <img class="social-product-initial" src="${assets.product}" alt="SocialPlatform desktop review queue" />
      </div>

      <div class="social-vector-world" aria-hidden="true">
        <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet">
          <path class="social-line social-release-base" pathLength="1" d="M92 442 H908" />
          <circle class="social-release-marker" cx="92" cy="442" r="5.2" />

          <path class="social-guide social-db-guide" d="M370 442 V122" />
          <path class="social-guide social-web-guide" d="M682 442 V122" />

          <g class="social-db-icon">
            <ellipse class="social-db-stroke social-db-part" cx="370" cy="174" rx="88" ry="20" />
            <path class="social-db-stroke social-db-part" d="M282 174V302" />
            <path class="social-db-stroke social-db-part" d="M458 174V302" />
            <path class="social-db-stroke social-db-part" d="M282 216C282 227 321 236 370 236C419 236 458 227 458 216" />
            <path class="social-db-stroke social-db-part" d="M282 259C282 270 321 279 370 279C419 279 458 270 458 259" />
            <path class="social-db-stroke social-db-part" d="M282 302C282 313 321 322 370 322C419 322 458 313 458 302" />
            <circle class="social-db-dot social-db-part" cx="432" cy="216" r="3.5" />
            <circle class="social-db-dot social-db-part" cx="432" cy="259" r="3.5" />
            <circle class="social-db-dot social-db-part" cx="432" cy="302" r="3.5" />
          </g>

          <g class="social-shared-geometry">
            <line class="social-line social-structure-segment" data-segment="0" />
            <line class="social-line social-structure-segment" data-segment="1" />
            <line class="social-line social-structure-segment" data-segment="2" />
            <line class="social-line social-structure-segment" data-segment="3" />
            <line class="social-line social-structure-segment is-soft" data-segment="4" />
            <line class="social-line social-structure-segment is-soft" data-segment="5" />
            <line class="social-line social-structure-segment is-soft" data-segment="6" />
            <line class="social-line social-structure-segment" data-segment="7" />
            <line class="social-line social-structure-segment" data-segment="8" />
            <line class="social-line social-structure-segment" data-segment="9" />
            <line class="social-line social-structure-segment is-soft" data-segment="10" />
            <line class="social-line social-structure-segment is-soft" data-segment="11" />
            <line class="social-line social-structure-segment" data-segment="12" />
            <line class="social-line social-structure-segment" data-segment="13" />
            <line class="social-line social-structure-segment is-soft" data-segment="14" />
            <line class="social-line social-structure-segment is-soft" data-segment="15" />
          </g>

          <line class="social-scan" x1="0" x2="0" y1="0" y2="0" />
        </svg>
      </div>

      <div class="social-label-world" aria-hidden="true">
        <div class="social-layer-heading social-db-heading">DATABASE</div>
        <div class="social-layer-heading social-web-heading">WEB UI</div>
      </div>

      <div class="social-final-phone" aria-hidden="true">
        <div class="social-final-phone-screen">
          <img src="${assets.signoff}" alt="SocialPlatform moderation rules screen" />
        </div>
      </div>
    </div>
  `;

  const plane = showcase.querySelector('.social-product-plane');
  const initialProduct = showcase.querySelector('.social-product-initial');
  const finalPhone = showcase.querySelector('.social-final-phone');
  const vectorWorld = showcase.querySelector('.social-vector-world');
  const baseLine = showcase.querySelector('.social-release-base');
  const marker = showcase.querySelector('.social-release-marker');
  const dbIcon = showcase.querySelector('.social-db-icon');
  const dbParts = [...showcase.querySelectorAll('.social-db-part')];
  const segments = [...showcase.querySelectorAll('.social-structure-segment')];
  const scan = showcase.querySelector('.social-scan');
  const dbGuide = showcase.querySelector('.social-db-guide');
  const webGuide = showcase.querySelector('.social-web-guide');
  const dbLabel = showcase.querySelector('.social-db-heading');
  const webLabel = showcase.querySelector('.social-web-heading');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  baseLine.style.strokeDasharray = '1';
  baseLine.style.strokeDashoffset = reduced ? '0' : '1';
  if (reduced) return;

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smooth = t => {
    const x = clamp(t);
    return x * x * (3 - 2 * x);
  };
  const easeOut = t => 1 - Math.pow(1 - clamp(t), 4);
  const ramp = (p, start, end, easing = smooth) => easing((p - start) / Math.max(.0001, end - start));
  const mix = (a, b, t) => a + (b - a) * t;

  const collapsed = point => Array.from({ length: 16 }, () => [point[0], point[1], point[0], point[1]]);

  const webGeometry = [
    [498,146,838,146], [838,146,838,334], [838,334,498,334], [498,334,498,146],
    [498,184,838,184], [532,214,622,214], [532,214,532,278], [532,278,622,278],
    [622,214,622,278], [650,214,806,214], [650,238,806,238], [650,262,772,262],
    [650,294,806,294], [682,442,682,334], [518,164,536,164], [544,164,562,164]
  ];

  const finalGeometry = [
    [386,78,614,78], [614,78,614,482], [614,482,386,482], [386,482,386,78],
    [392,102,608,102], [608,102,608,470], [608,470,392,470], [392,470,392,102],
    [470,89,530,89], [444,141,556,141], [444,199,556,199], [444,238,556,238],
    [444,277,556,277], [908,442,614,442], [444,347,556,347], [444,389,544,389]
  ];

  function getScenePhase() {
    const rect = experience.getBoundingClientRect();
    const travel = Math.max(1, experience.offsetHeight - window.innerHeight);
    const progress = clamp(-rect.top / travel);
    const durations = [1.5, 1.5, 2.15, 2.15, 1.5, 3.7];
    const timelineTotal = 12.5;
    const timelinePos = progress * timelineTotal;
    let step = 6;
    let cursor = 0;
    for (let i = 0; i < durations.length; i++) {
      const duration = durations[i];
      if (timelinePos <= cursor + duration) {
        step = i + clamp((timelinePos - cursor) / duration);
        break;
      }
      cursor += duration;
    }
    return clamp(((step - 3) + .56) / .82);
  }

  function setSegment(line, coords) {
    line.setAttribute('x1', coords[0].toFixed(1));
    line.setAttribute('y1', coords[1].toFixed(1));
    line.setAttribute('x2', coords[2].toFixed(1));
    line.setAttribute('y2', coords[3].toFixed(1));
  }

  function interpolateGeometry(from, to, amount) {
    return from.map((coords, index) => coords.map((value, axis) => mix(value, to[index][axis], amount)));
  }

  function applyGeometry(coords, opacity) {
    segments.forEach((line, index) => {
      setSegment(line, coords[index]);
      const stagger = clamp(opacity * 1.22 - index * .018);
      line.style.opacity = String(stagger);
    });
  }

  function setScan(x1, x2, y, opacity) {
    scan.setAttribute('x1', x1.toFixed(1));
    scan.setAttribute('x2', x2.toFixed(1));
    scan.setAttribute('y1', y.toFixed(1));
    scan.setAttribute('y2', y.toFixed(1));
    scan.style.opacity = String(opacity);
  }

  let raf = 0;
  function render() {
    const p = getScenePhase();

    const lineDraw = ramp(p, .14, .21, easeOut);
    const dbTravel = ramp(p, .18, .30);
    const dbOpen = ramp(p, .30, .37);
    const dbClose = ramp(p, .44, .51);
    const dbAmount = dbOpen * (1 - dbClose);
    const dbScan = ramp(p, .36, .44);

    const webTravel = ramp(p, .51, .63);
    const webOpen = ramp(p, .63, .70);
    const webClose = ramp(p, .77, .84);
    const webAmount = webOpen * (1 - webClose);
    const webScan = ramp(p, .69, .77);

    const dbLabelIn = ramp(p, .265, .305, easeOut);
    const dbLabelOut = ramp(p, .475, .525);
    const dbLabelAmount = dbLabelIn * (1 - dbLabelOut);
    const webLabelIn = ramp(p, .585, .625, easeOut);
    const webLabelOut = ramp(p, .795, .845);
    const webLabelAmount = webLabelIn * (1 - webLabelOut);

    // Preserve the DB/Web plateaus; spend the recovered time on the product payoff.
    // The phone now settles by ~92%, leaving a clear final stillness before CueSheet.
    const endTravel = ramp(p, .84, .88);
    const finalFrame = ramp(p, .87, .90);
    const phoneIn = ramp(p, .89, .92);

    const systemEnter = ramp(p, .27, .34);
    const systemExit = ramp(p, .86, .93);
    const systemDepth = systemEnter * (1 - systemExit);
    const activeStructure = Math.max(dbAmount, webAmount, finalFrame * (1 - phoneIn));

    baseLine.style.strokeDashoffset = String(1 - lineDraw);

    let markerX = 92;
    if (p < .30) markerX = mix(92, 370, dbTravel);
    else if (p < .51) markerX = 370;
    else if (p < .63) markerX = mix(370, 682, webTravel);
    else if (p < .84) markerX = 682;
    else markerX = mix(682, 908, endTravel);
    marker.setAttribute('cx', markerX.toFixed(1));
    marker.style.opacity = String(lineDraw * (1 - phoneIn));

    const depthScale = mix(1, .948, systemDepth);
    const depthY = mix(0, -17, systemDepth);
    const depthZ = mix(0, -78, systemDepth);
    const depthTilt = mix(0, 6.4, systemDepth);
    plane.style.transform = `translate3d(0,${depthY}px,${depthZ}px) rotateX(${depthTilt}deg) scale(${depthScale})`;
    plane.style.filter = `brightness(${mix(1, .42, systemDepth)}) saturate(${mix(1, .72, systemDepth)})`;
    plane.style.opacity = String(1 - phoneIn);
    initialProduct.style.opacity = String(1 - phoneIn * .98);

    const cameraPan = ramp(p, .49, .64);
    const cameraLift = Math.max(dbAmount, webAmount) * 6;
    vectorWorld.style.opacity = String(mix(.48, 1, systemDepth) * (1 - phoneIn * .96));
    vectorWorld.style.transform = `translate3d(${mix(0, -18, cameraPan)}px,${mix(14, -cameraLift, systemDepth)}px,70px) scale(${mix(.97, 1.035, systemDepth)})`;
    vectorWorld.style.filter = `brightness(${mix(.92, 1.06, activeStructure)})`;

    const dbCollapsed = collapsed([370, 442]);
    const webCollapsed = collapsed([682, 442]);
    const endCollapsed = collapsed([908, 442]);

    let geometry = dbCollapsed;
    let geometryOpacity = 0;
    if (p < .51) {
      geometry = dbCollapsed;
      geometryOpacity = 0;
    } else if (p < .84) {
      geometry = interpolateGeometry(webCollapsed, webGeometry, webAmount);
      geometryOpacity = webAmount;
    } else {
      geometry = interpolateGeometry(endCollapsed, finalGeometry, finalFrame * (1 - phoneIn * .35));
      geometryOpacity = finalFrame * (1 - phoneIn * .96);
    }
    applyGeometry(geometry, geometryOpacity);

    dbGuide.style.opacity = String(dbAmount * .6);
    dbLabel.style.opacity = String(dbLabelAmount);
    webGuide.style.opacity = String(webAmount * .6);
    webLabel.style.opacity = String(webLabelAmount);

    dbIcon.style.opacity = String(clamp(dbAmount * 1.05));
    dbIcon.style.transform = `translateY(${mix(5, 0, dbAmount)}px) scale(${mix(.98, 1, dbAmount)})`;
    dbParts.forEach((part, index) => {
      part.style.opacity = String(clamp(dbAmount * 1.35 - index * .055));
    });

    if (dbAmount > webAmount && dbAmount > .01) {
      setScan(286, 454, mix(174, 302, dbScan), dbAmount * Math.sin(Math.PI * dbScan));
    } else if (webAmount > .01) {
      setScan(514, 822, mix(202, 314, webScan), webAmount * Math.sin(Math.PI * webScan));
    } else {
      scan.style.opacity = '0';
    }

    finalPhone.style.opacity = String(phoneIn);
    finalPhone.style.transform = `translate(-50%,calc(-50% + ${mix(18, 0, phoneIn)}px)) scale(${mix(.93, 1, phoneIn)})`;
    finalPhone.style.filter = `brightness(${mix(.92, 1, phoneIn)})`;

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(render);
  });
})();