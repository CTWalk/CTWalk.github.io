(() => {
  if (!window.matchMedia('(max-width: 760px)').matches) return;
  if (document.getElementById('mobile-fallback')) return;

  const html = document.documentElement;
  const params = new URLSearchParams(window.location.search);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const testMode = params.get('uiux-test') === '1';
  const TEST_TIME_MS = 6400;
  const REDUCED_TIME_MS = 0;
  const PROFILE_AVATAR = 'https://avatars.githubusercontent.com/u/100585900?v=4';

  const copy = {
    en: {
      titleLines: ['Designed for', 'desktop.'],
      messageLines: [
        'This portfolio is designed as a',
        'desktop-first interactive experience.',
        'For the full project walkthrough,',
        'please view it on a desktop browser.'
      ],
      github: 'Open GitHub ↗'
    },
    zh: {
      titleLines: ['為桌面互動', '而設計'],
      messageLines: [
        '此作品集以桌面互動體驗為主要呈現方式。',
        '建議使用電腦版瀏覽器，以完整查看',
        '專案流程、動態展示與設計細節。'
      ],
      github: '查看 GitHub ↗'
    }
  };

  const style = document.createElement('style');
  style.dataset.mobileFallback = 'true';
  style.textContent = `
    html[data-presentation="mobile-fallback"]{background:#050609;scroll-behavior:auto}
    html[data-presentation="mobile-fallback"] body{margin:0;overflow:hidden;background:#050609}
    html[data-presentation="mobile-fallback"] .nav{z-index:90;background:transparent;border:0;box-shadow:none}
    html[data-presentation="mobile-fallback"] .nav-inner{width:calc(100% - 40px);justify-content:flex-end}
    html[data-presentation="mobile-fallback"] .brand,
    html[data-presentation="mobile-fallback"] .github{display:none!important}
    html[data-presentation="mobile-fallback"] .lang-switch{gap:12px}
    html[data-presentation="mobile-fallback"] .lang-switch button{font-size:.78rem;font-weight:650;color:rgba(255,255,255,.68)}
    html[data-presentation="mobile-fallback"] .lang-switch button.active{color:#fff}

    .mobile-fallback{position:fixed;inset:0;z-index:70;display:block;width:100%;height:100vh;height:100svh;overflow:hidden;isolation:isolate;background:#050609;color:#f6f0e7}
    .mobile-fallback[hidden]{display:none!important}
    .mobile-wave-blur,.mobile-wave-canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
    .mobile-wave-blur{z-index:0;filter:blur(88px) saturate(1.10);opacity:.42;transform:scale(1.08);transform-origin:center}
    .mobile-wave-canvas{z-index:1;display:block;opacity:.96}
    .mobile-wave-fallback{display:none;position:absolute;inset:-28px;z-index:1;pointer-events:none;filter:blur(38px);opacity:.52;background:linear-gradient(to bottom,rgba(65,180,255,.72),rgba(65,180,255,.16) 22%,transparent 48%),linear-gradient(to top,rgba(65,180,255,.68),rgba(65,180,255,.14) 22%,transparent 48%),linear-gradient(to right,rgba(65,180,255,.58),rgba(65,180,255,.12) 18%,transparent 44%),linear-gradient(to left,rgba(65,180,255,.58),rgba(65,180,255,.12) 18%,transparent 44%)}
    .mobile-fallback.webgl-fallback .mobile-wave-fallback{display:block}
    .mobile-fallback.webgl-fallback .mobile-wave-blur,.mobile-fallback.webgl-fallback .mobile-wave-canvas{display:none}
    .mobile-vignette{position:absolute;inset:0;z-index:2;pointer-events:none;background:radial-gradient(ellipse at 50% 49%,rgba(5,6,9,.12) 0%,rgba(5,6,9,.08) 42%,rgba(5,6,9,.00) 74%)}
    .mobile-fallback-inner{position:relative;z-index:4;display:flex;flex-direction:column;width:100%;height:100%;padding:calc(70px + max(24px,env(safe-area-inset-top))) 22px max(30px,env(safe-area-inset-bottom))}

    .mobile-title{margin:0;max-width:6.3ch;color:#f6eee3;font-size:clamp(4.3rem,20.6vw,6.15rem);font-weight:700;line-height:.84;letter-spacing:-.028em;text-wrap:initial;text-shadow:0 16px 52px rgba(0,0,0,.34)}
    .mobile-title-line,.mobile-message-line{display:block}

    .mobile-center{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:15px;padding:20px 0 16px}
    .mobile-profile{display:block;width:112px;height:112px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,255,255,.18);box-shadow:0 18px 56px rgba(0,0,0,.46),0 0 0 1px rgba(255,255,255,.035);background:#0b0b0d}
    .mobile-github{width:max-content;color:#fff;text-decoration:none;font-size:1rem;font-weight:680;line-height:1.2;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,.60)}
    .mobile-github:focus-visible{outline:2px solid #fff;outline-offset:6px}

    .mobile-message{max-width:32ch;margin:0;color:rgba(248,242,234,.94);font-size:1.09rem;font-weight:570;line-height:1.50;letter-spacing:-.006em;text-wrap:pretty}

    .mobile-copy-line{
      opacity:0;
      filter:blur(8px);
      transform:translateY(7px);
      animation:mobileCopyLineIn 1.08s cubic-bezier(.22,.72,.24,1) var(--line-delay,0ms) both;
      will-change:opacity,filter,transform;
    }
    @keyframes mobileCopyLineIn{
      0%{opacity:0;filter:blur(8px);transform:translateY(7px)}
      46%{opacity:.38;filter:blur(3.5px);transform:translateY(3px)}
      100%{opacity:1;filter:blur(0);transform:translateY(0)}
    }
    .mobile-fallback.copy-static .mobile-copy-line{opacity:1;filter:none;transform:none;animation:none;will-change:auto}

    html[lang^="zh"] .mobile-title{max-width:6.3em;font-family:"PingFang TC","Noto Sans TC","Microsoft JhengHei",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:clamp(3.65rem,17vw,5.1rem);font-weight:670;line-height:.97;letter-spacing:-.012em;word-break:keep-all}
    html[lang^="zh"] .mobile-message{max-width:18em;font-size:1.09rem;font-weight:550;line-height:1.68;letter-spacing:.012em;line-break:strict}

    @media(max-height:720px) and (max-width:760px){
      .mobile-fallback-inner{padding-top:80px;padding-bottom:20px}
      .mobile-title{font-size:clamp(3.75rem,18vw,5rem)}
      html[lang^="zh"] .mobile-title{font-size:clamp(3.15rem,15vw,4.2rem)}
      .mobile-center{gap:11px;padding:12px 0 10px}
      .mobile-profile{width:86px;height:86px}
      .mobile-message{font-size:.98rem;line-height:1.42}
      html[lang^="zh"] .mobile-message{font-size:1rem;line-height:1.56}
      .mobile-github{font-size:.9rem}
    }
    @media(max-width:350px){
      .mobile-fallback-inner{padding-inline:18px}
      .mobile-title{font-size:clamp(3.65rem,19vw,4.75rem)}
      html[lang^="zh"] .mobile-title{font-size:clamp(3rem,15.6vw,4rem)}
      .mobile-profile{width:96px;height:96px}
      .mobile-message{font-size:1rem;line-height:1.46}
      html[lang^="zh"] .mobile-message{font-size:1.02rem;line-height:1.58}
    }
  `;
  document.head.appendChild(style);

  const fallback = document.createElement('section');
  fallback.className = 'mobile-fallback';
  if (reducedMotion || testMode) fallback.classList.add('copy-static');
  fallback.id = 'mobile-fallback';
  fallback.setAttribute('aria-labelledby', 'mobile-fallback-title');
  fallback.innerHTML = `
    <canvas class="mobile-wave-blur" id="mobile-wave-blur" aria-hidden="true"></canvas>
    <canvas class="mobile-wave-canvas" id="mobile-wave-canvas" aria-hidden="true"></canvas>
    <div class="mobile-wave-fallback" aria-hidden="true"></div>
    <div class="mobile-vignette" aria-hidden="true"></div>
    <div class="mobile-fallback-inner">
      <h1 class="mobile-title" id="mobile-fallback-title" data-mobile-lines="title"></h1>
      <div class="mobile-center">
        <img class="mobile-profile" src="${PROFILE_AVATAR}" alt="CTWalk GitHub profile" decoding="async" referrerpolicy="no-referrer">
        <a class="mobile-github" href="https://github.com/CTWalk" target="_blank" rel="noreferrer" data-mobile-copy="github"></a>
      </div>
      <p class="mobile-message" data-mobile-lines="message"></p>
    </div>`;

  const main = document.querySelector('main');
  if (main) main.insertAdjacentElement('beforebegin', fallback);
  else document.body.appendChild(fallback);

  const canvas = document.getElementById('mobile-wave-canvas');
  const blurCanvas = document.getElementById('mobile-wave-blur');
  const blurCtx = blurCanvas?.getContext('2d', {alpha:true}) || null;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const gl = canvas ? (canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:false,preserveDrawingBuffer:true,powerPreference:'low-power'}) || canvas.getContext('experimental-webgl')) : null;

  const vertexShaderSource = `
    attribute vec2 position;
    varying vec2 vUv;
    void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}
  `;

  const fragmentShaderSource = `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;

    vec3 hsv2rgb(vec3 c){
      vec3 p=abs(fract(c.xxx+vec3(0.,2./3.,1./3.))*6.-3.);
      return c.z*mix(vec3(1.),clamp(p-1.,0.,1.),c.y);
    }

    float wrapDist(float a,float b){float d=abs(a-b);return min(d,1.-d);}

    float waveEnergy(float s,float t){
      float travel=fract(t*.1.5);
      float phase=6.2831853*(s*1.15-t*.095);
      float broad=.5+.5*sin(phase);
      float secondary=.5+.5*sin(phase*2.05+1.25+sin(t*.33)*.35);
      float tertiary=.5+.5*cos(phase*.53-1.8);
      float crest=pow(clamp(broad*.72+secondary*.20+tertiary*.08,0.,1.),1.55);
      float rolling=1.-smoothstep(.10,.34,wrapDist(s,travel));
      float rollingSoft=1.-smoothstep(.18,.48,wrapDist(s,travel));
      return clamp(crest*.72+rolling*.16+rollingSoft*.12,0.,1.);
    }

    float edgeLight(float distanceToEdge,float energy){
      float depth=.075+.245*energy;
      float normalized=clamp(distanceToEdge/depth,0.,1.);
      float core=pow(1.-smoothstep(0.,1.,normalized),1.65);
      float halo=(1.-smoothstep(depth,depth*1.85,distanceToEdge))*.14*energy;
      float edgeFocus=1.-smoothstep(0.,.11,distanceToEdge);
      return core*(.62+.38*edgeFocus)+halo;
    }

    void main(){
      vec2 uv=vUv;
      float t=uTime;

      float db=uv.y;
      float dr=1.-uv.x;
      float dt=1.-uv.y;
      float dl=uv.x;

      float sb=uv.x*.25;
      float sr=.25+uv.y*.25;
      float st=.50+(1.-uv.x)*.25;
      float sl=.75+(1.-uv.y)*.25;

      float eb=waveEnergy(sb,t);
      float er=waveEnergy(sr,t);
      float et=waveEnergy(st,t);
      float el=waveEnergy(sl,t);

      float ib=edgeLight(db,eb);
      float ir=edgeLight(dr,er);
      float it=edgeLight(dt,et);
      float il=edgeLight(dl,el);

      float intensity=1.-(1.-clamp(ib,0.,.94))*(1.-clamp(ir,0.,.94))*(1.-clamp(it,0.,.94))*(1.-clamp(il,0.,.94));

      float nearest=min(min(db,dr),min(dt,dl));
      float strongest=max(max(eb,er),max(et,el));
      float inwardMist=(1.-smoothstep(.16,.50,nearest))*.055*pow(strongest,1.35);
      intensity=clamp(intensity+inwardMist,0.,1.);

      float edgeBoost=1.-smoothstep(0.,.14,nearest);
      float luminance=.34+.66*edgeBoost;

      float baseHue=fract(.56+t*.09);
      float perimeterPhase=(sb*ib+sr*ir+st*it+sl*il)/max(.001,ib+ir+it+il);
      float hueVariation=.028*sin(6.2831853*(perimeterPhase*1.05-t*.035));
      vec3 color=hsv2rgb(vec3(fract(baseHue+hueVariation),.76,.98));
      vec3 soft=hsv2rgb(vec3(fract(baseHue+hueVariation*.45),.52,.66));
      vec3 finalColor=mix(soft,color,clamp(edgeBoost*.72+strongest*.24,0.,1.))*intensity*luminance;

      float grain=fract(sin(dot(uv,vec2(12.9898,78.233)))*43758.5453);
      finalColor+=vec3((grain-.5)*.006*intensity*luminance);
      float lum=max(finalColor.r,max(finalColor.g,finalColor.b));
      gl_FragColor=vec4(finalColor,clamp(lum*1.12,0.,.96));
    }
  `;

  let program=null;
  let uniforms=null;
  let animationFrame=0;
  let running=false;
  let currentTimeMs=reducedMotion?REDUCED_TIME_MS:0;
  let lastFrameMs=null;

  function selectedLocale(){return html.lang.toLowerCase().startsWith('zh')?'zh':'en';}

  function renderLines(node,lines,startDelay,stepDelay,lineClass){
    node.replaceChildren();
    lines.forEach((line,index)=>{
      const span=document.createElement('span');
      span.className=`mobile-copy-line ${lineClass}`;
      span.style.setProperty('--line-delay',`${startDelay+index*stepDelay}ms`);
      span.textContent=line;
      node.appendChild(span);
    });
  }

  function syncLanguage(){
    const strings=copy[selectedLocale()];
    const title=fallback.querySelector('[data-mobile-lines="title"]');
    const message=fallback.querySelector('[data-mobile-lines="message"]');
    renderLines(title,strings.titleLines,120,145,'mobile-title-line');
    renderLines(message,strings.messageLines,760,135,'mobile-message-line');
    fallback.querySelector('[data-mobile-copy="github"]').textContent=strings.github;
    return html.lang;
  }

  function createShader(type,source){if(!gl)return null;const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){console.warn('[mobile-fallback] WebGL shader compile failed:',gl.getShaderInfoLog(shader));gl.deleteShader(shader);return null;}return shader;}
  function initWebGL(){
    if(!gl)return false;
    const vs=createShader(gl.VERTEX_SHADER,vertexShaderSource),fs=createShader(gl.FRAGMENT_SHADER,fragmentShaderSource);
    if(!vs||!fs)return false;
    program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){console.warn('[mobile-fallback] WebGL program link failed:',gl.getProgramInfoLog(program));return false;}
    const vertices=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    uniforms={time:gl.getUniformLocation(program,'uTime')};
    return true;
  }

  const webglReady=initWebGL();
  if(!webglReady)fallback.classList.add('webgl-fallback');

  function copyBlur(){if(!blurCtx||!blurCanvas||!canvas||!webglReady)return;blurCtx.clearRect(0,0,blurCanvas.width,blurCanvas.height);blurCtx.drawImage(canvas,0,0,blurCanvas.width,blurCanvas.height);}
  function draw(timeMs=0){if(!gl||!program||!uniforms||!webglReady)return;currentTimeMs=Number(timeMs)||0;gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);gl.uniform1f(uniforms.time,currentTimeMs*.001);gl.drawArrays(gl.TRIANGLES,0,6);copyBlur();}
  function resize(){const width=Math.max(1,window.innerWidth),height=Math.max(1,window.innerHeight);if(canvas){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;}if(blurCanvas){blurCanvas.width=Math.max(1,Math.round((width*dpr)/8));blurCanvas.height=Math.max(1,Math.round((height*dpr)/8));blurCanvas.style.width=`${width}px`;blurCanvas.style.height=`${height}px`;}draw(currentTimeMs);}
  function animate(now){if(!running)return;if(lastFrameMs==null)lastFrameMs=now;const delta=Math.min(50,Math.max(0,now-lastFrameMs));lastFrameMs=now;currentTimeMs+=delta;draw(currentTimeMs);animationFrame=requestAnimationFrame(animate);}
  function start(){if(!webglReady||reducedMotion||testMode||running)return getState();running=true;lastFrameMs=null;animationFrame=requestAnimationFrame(animate);return getState();}
  function stop(){running=false;lastFrameMs=null;if(animationFrame)cancelAnimationFrame(animationFrame);animationFrame=0;return getState();}
  function setTime(timeMs){stop();draw(Number(timeMs)||0);return getState();}
  function getState(){return{active:true,presentation:'mobile-fallback',locale:html.lang,reducedMotion,testMode,running,timeMs:currentTimeMs,canvasAvailable:Boolean(webglReady),webglAvailable:Boolean(webglReady),blurAvailable:Boolean(blurCtx),width:window.innerWidth,height:window.innerHeight};}

  syncLanguage();
  const languageObserver=new MutationObserver(syncLanguage);
  languageObserver.observe(html,{attributes:true,attributeFilter:['lang']});
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(!reducedMotion&&!testMode)start();});
  resize();
  if(webglReady){if(reducedMotion)setTime(REDUCED_TIME_MS);else if(testMode)setTime(TEST_TIME_MS);else start();}

  const api=Object.freeze({syncLanguage,start,stop,setTime,getState,testTimeMs:TEST_TIME_MS,reducedTimeMs:REDUCED_TIME_MS});
  Object.defineProperty(window,'__mobileFallback',{configurable:false,enumerable:false,writable:false,value:api});
  window.addEventListener('beforeunload',()=>{stop();languageObserver.disconnect();},{once:true});
  window.dispatchEvent(new CustomEvent('mobile-fallback-ready',{detail:getState()}));
})();