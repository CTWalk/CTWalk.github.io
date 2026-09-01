import { chromium } from 'playwright';
import crypto from 'node:crypto'; import fs from 'node:fs/promises'; import fss from 'node:fs'; import http from 'node:http'; import path from 'node:path';
const repoRoot=process.env.REPO_ROOT, outDir=process.env.OUT_DIR, exe=process.env.EXE;
const t={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png'};
const s=http.createServer(async(q,r)=>{try{const u=new URL(q.url||'/','http://x');let rel=decodeURIComponent(u.pathname);if(rel==='/')rel='/index.html';const f=path.resolve(repoRoot,`.${rel}`);if(!(await fs.stat(f)).isFile())throw 0;r.writeHead(200,{'content-type':t[path.extname(f)]||'application/octet-stream'});fss.createReadStream(f).pipe(r);}catch{r.writeHead(404).end('nf');}});
await new Promise(r=>s.listen(4193,'127.0.0.1',r));
const b=await chromium.launch({headless:true,executablePath:exe});
const cv=await (await b.newContext()).newPage(); await cv.setContent('<canvas id="c"></canvas>');
await fs.mkdir(outDir,{recursive:true});
async function shot(tag,vp){const c=await b.newContext({viewport:vp,deviceScaleFactor:1,locale:'en-US'});const p=await c.newPage();
  await p.goto('http://127.0.0.1:4193/?uiux-test=1',{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>Boolean(window.__portfolioTest));
  let r0=await p.evaluate(()=>window.__portfolioTest.ready()); for(let i=0;i<4&&!r0.assetsReady;i++) r0=await p.evaluate(()=>window.__portfolioTest.ready());
  await p.evaluate(()=>window.__portfolioTest.setLanguage('en'));
  await p.evaluate(()=>window.__portfolioTest.goToCheckpoint('intro.settled'));
  const f=path.join(outDir,tag+'.png'); await p.screenshot({path:f}); await c.close();
  return {f,sha:crypto.createHash('sha256').update(await fs.readFile(f)).digest('hex')};}
async function diff(a,bb){const [x,y]=await Promise.all([fs.readFile(a),fs.readFile(bb)]);
  return cv.evaluate(async ([p,q])=>{const L=s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src=s;});const [A,B]=await Promise.all([L(p),L(q)]);
    const c=document.getElementById('c');c.width=A.width;c.height=A.height;const g=c.getContext('2d',{willReadFrequently:true});
    g.drawImage(A,0,0);const da=g.getImageData(0,0,c.width,c.height).data;g.clearRect(0,0,c.width,c.height);g.drawImage(B,0,0);const db=g.getImageData(0,0,c.width,c.height).data;
    let n=0,max=0,x0=1e9,y0=1e9,x1=-1,y1=-1;
    for(let i=0;i<da.length;i+=4){const d=Math.max(Math.abs(da[i]-db[i]),Math.abs(da[i+1]-db[i+1]),Math.abs(da[i+2]-db[i+2]));
      if(d>0){n++;if(d>max)max=d;const pi=i/4,px=pi%c.width,py=(pi/c.width)|0;if(px<x0)x0=px;if(px>x1)x1=px;if(py<y0)y0=py;if(py>y1)y1=py;}}
    return {differingPixels:n,percent:+(100*n/(da.length/4)).toFixed(5),maxChannelDelta:max,boundingRegion:n?{x0,y0,x1,y1}:null};},[`data:image/png;base64,${x.toString('base64')}`,`data:image/png;base64,${y.toString('base64')}`]);}
const a=await shot('laptop.intro.pass1',{width:1280,height:800});
const bb=await shot('laptop.intro.pass2',{width:1280,height:800});
console.log('laptop intro.settled:', a.sha===bb.sha?'BYTE-IDENTICAL':JSON.stringify(await diff(a.f,bb.f)));
await b.close(); await new Promise(r=>s.close(r));
