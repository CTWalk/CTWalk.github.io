// Verify D-1 fix: reduced-motion intro title must no longer cross the viewport edge,
// in BOTH locales, and normal motion must be unaffected.
import { chromium } from 'playwright';
import fs from 'node:fs/promises'; import fss from 'node:fs'; import http from 'node:http'; import path from 'node:path';
const repoRoot=process.env.REPO_ROOT, out=process.env.OUT_DIR;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png'};
const server=http.createServer(async(q,r)=>{try{const u=new URL(q.url||'/','http://127.0.0.1');let rel=decodeURIComponent(u.pathname);if(rel==='/')rel='/index.html';const f=path.resolve(repoRoot,`.${rel}`);if(!f.startsWith(repoRoot)){r.writeHead(403).end();return;}if(!(await fs.stat(f)).isFile())throw new Error('nf');r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});fss.createReadStream(f).pipe(r);}catch{r.writeHead(404).end('nf');}});
await new Promise(r=>server.listen(4212,'127.0.0.1',r));
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.EXE});
for (const [vpName,vp] of [['desktop',{width:1440,height:900}],['laptop',{width:1280,height:800}]]) {
 for (const motion of ['reduce','normal']) {
  for (const loc of ['en','zh-TW']) {
    const ctx=await browser.newContext({viewport:vp,deviceScaleFactor:1,locale:'en-US',reducedMotion:motion==='reduce'?'reduce':'no-preference'});
    const page=await ctx.newPage();
    await page.goto('http://127.0.0.1:4212/?uiux-test=1',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>Boolean(window.__portfolioTest));
    let ready=await page.evaluate(()=>window.__portfolioTest.ready());
    for(let i=0;i<4&&!ready.assetsReady;i++) ready=await page.evaluate(()=>window.__portfolioTest.ready());
    await page.evaluate(l=>window.__portfolioTest.setLanguage(l),loc);
    await page.evaluate(()=>window.__portfolioTest.goToCheckpoint('intro.settled'));
    const r=await page.evaluate(()=>{
      const idx=window.__portfolioTest.sceneIds.intro;
      const scene=document.querySelector(`.scene[data-scene="${idx}"]`);
      const t=scene.querySelector('.scene-title');
      const range=document.createRange(); range.selectNodeContents(t);
      const m=new Map();
      for(const q of range.getClientRects()){const k=Math.round(q.top);const c=m.get(k)||{l:1e9,r:-1e9};m.set(k,{l:Math.min(c.l,q.left),r:Math.max(c.r,q.right)});}
      const rows=[...m.entries()].sort((a,b)=>a[0]-b[0]).map(([top,v])=>({left:+v.l.toFixed(1),right:+v.r.toFixed(1)}));
      return {vw:innerWidth, rows, overflow: document.documentElement.scrollWidth>document.documentElement.clientWidth};
    });
    const bad=r.rows.filter(x=>x.right>r.vw-0.5||x.left<0.5);
    await page.screenshot({path:path.join(out,`${vpName}.${motion}.${loc}.png`)});
    console.log(`${vpName}/${motion}/${loc}  vw=${r.vw}  lines=${r.rows.map(x=>`[${x.left}..${x.right}]`).join(' ')}  overflow=${r.overflow}  ${bad.length?'*** CLIPPED ***':'ok'}`);
    await ctx.close();
  }
 }
}
await browser.close(); await new Promise(r=>server.close(r));
