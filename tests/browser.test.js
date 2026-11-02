const { chromium, devices } = require('playwright');
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=require('path').join(__dirname,'..'), SHOTS=process.argv[2]||require('os').tmpdir();
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2'};
const srv=http.createServer((q,r)=>{let p=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';fs.readFile(p,(e,b)=>{if(e){r.writeHead(404);r.end();}else{r.writeHead(200,{'content-type':types[path.extname(p)]||'text/plain'});r.end(b);}})}).listen(8123);
const B='http://localhost:8123/';
const results=[]; const ok=(n,c,x='')=>{results.push([c?'PASS':'FAIL',n,x]);};
const sizes={ 'iPhone SE (320)':{viewport:{width:320,height:568},dsf:2},'iPhone SE3 (375)':{viewport:{width:375,height:667},dsf:2},'iPhone 14 (390)':{viewport:{width:390,height:844},dsf:3},'iPhone 15 Pro Max (430)':{viewport:{width:430,height:932},dsf:3},'Android (360)':{viewport:{width:360,height:800},dsf:3},'iPad (768)':{viewport:{width:768,height:1024},dsf:2},'Desktop (1440)':{viewport:{width:1440,height:900},dsf:1}};
async function answer(p,fn){ for(;;){ const names=await p.$$eval('#qForm fieldset input:first-of-type',els=>els.map(e=>e.name)); for(const n of names){ await p.$eval(`input[name="${n}"][value="${fn(n)}"]`,e=>e.click()); } const last=(await p.textContent('#btnNext')).includes('See'); await p.click('#btnNext'); if(last) break; await p.waitForFunction(()=>1); await p.waitForTimeout(20);} await p.waitForSelector('#panel-results.is-on'); }
async function audit(p,label){
 const r=await p.evaluate(()=>{const de=document.documentElement;const small=[];const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){if(!n.textContent.trim())continue;const e=n.parentElement;if(!e.offsetParent&&getComputedStyle(e).position!=='fixed')continue;const fs=parseFloat(getComputedStyle(e).fontSize);if(fs<14&&!e.closest('svg'))small.push(e.className+':'+fs);}
 const tap=[];document.querySelectorAll('a[href],button,summary,label.opt,label.day,input:not([type=radio]):not([type=checkbox]),textarea').forEach(e=>{if(!e.offsetParent)return;if(e.closest('.foot,.bounds__help,.calc__disclaimer'))return;const b=e.getBoundingClientRect();if(b.width<44&&!(e.tagName==='A')||b.height<44&&e.tagName!=='A'&&!e.matches('summary')){tap.push((e.id||e.className||e.tagName)+` ${b.width|0}x${b.height|0}`)}else if(e.tagName==='A'&&b.height<36&&innerWidth<1000)tap.push('A:'+(e.textContent.trim().slice(0,20))+` ${b.width|0}x${b.height|0}`)});
 return {sw:de.scrollWidth,cw:de.clientWidth,small:[...new Set(small)].slice(0,6),tap:[...new Set(tap)].slice(0,8)}});
 ok(label+' no sideways scroll',r.sw<=r.cw,`${r.sw}/${r.cw}`);ok(label+' text >=14px',r.small.length===0,r.small.join(' '));ok(label+' tap targets',r.tap.length===0,r.tap.join(' | '));
}
(async()=>{
 const br=await chromium.launch();
 for(const [name,s] of Object.entries(sizes)){
  const ctx=await br.newContext({viewport:s.viewport,deviceScaleFactor:s.dsf,isMobile:s.viewport.width<1000,hasTouch:s.viewport.width<1000,userAgent:s.viewport.width<500?devices['iPhone 14'].userAgent:undefined});
  const p=await ctx.newPage(); const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto(B+'index.html');await audit(p,name+' home');
  await p.screenshot({path:`${SHOTS}/${s.viewport.width}-home.png`,fullPage:true});
  await p.goto(B+'calculator.html');await audit(p,name+' intro');
  await p.fill('#goal','Sleep through the night');await p.click('#startForm button');await p.waitForSelector('#panel-assess.is-on');
  await audit(p,name+' assessment');await p.$eval('input[name="action-0"][value="3"]',e=>e.click());
  await p.screenshot({path:`${SHOTS}/${s.viewport.width}-q.png`});
  if(s.viewport.width<1000){const span=p.locator('input[name="action-1"][value="10"] + span');await span.scrollIntoViewIfNeeded();const b=await span.boundingBox();await p.touchscreen.tap(b.x+b.width/2,b.y+b.height/2);await p.waitForTimeout(30);ok(name+' real tap selects',await p.locator('input[name="action-1"][value="10"]').isChecked());}
  const lab=await p.textContent('#progLabel');ok(name+' progress label',/[12] of 18/.test(lab),lab);
  await answer(p,n=>(n.length*3)%11);
  await audit(p,name+' results');await p.screenshot({path:`${SHOTS}/${s.viewport.width}-results.png`,fullPage:true});
  ok(name+' no errors',errs.length===0,errs.join(';'));await ctx.close();
 }
 // behaviour at iPhone 14
 const ctx=await br.newContext({...devices['iPhone 14'],defaultBrowserType:undefined,permissions:['clipboard-read','clipboard-write'],acceptDownloads:true});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(B+'calculator.html');
 await p.click('#startForm button');ok('empty goal stays on intro',await p.isVisible('#panel-intro.is-on'));
 await p.fill('#goal','    ');await p.click('#startForm button');ok('spaces-only goal rejected',await p.isVisible('#panel-intro.is-on'));
 await p.fill('#goal','<img src=x onerror=alert(1)> “Quoted”');await p.click('#startForm button');await p.waitForSelector('#panel-assess.is-on');
 await p.click('#btnNext');ok('unanswered blocks Next',(await p.textContent('#qHint')).includes('both'));ok('stays step 1',p.url().endsWith('#q1'));
 await p.$eval('input[name="action-0"][value="4"]',e=>e.click());await p.click('#btnNext');ok('one missing flagged',(await p.textContent('#qHint')).includes('One question'));
 ok('missing highlighted',await p.locator('.q--missing').count()===1);
 await p.$eval('input[name="action-1"][value="6"]',e=>e.click());await p.click('#btnNext');await p.waitForTimeout(50);ok('moves to q2',p.url().endsWith('#q2'));
 await p.waitForTimeout(600);const sy=await p.evaluate(()=>scrollY);ok('new step starts at top',sy===0,'scrollY '+sy);
 await p.$eval('input[name="focus-0"][value="7"]',e=>e.click());
 await p.reload();await p.waitForTimeout(100);ok('refresh keeps step',p.url().endsWith('#q2')&&await p.isVisible('#panel-assess.is-on'));
 ok('refresh keeps answer',await p.locator('input[name="focus-0"][value="7"]').isChecked());
 await p.goBack();await p.waitForTimeout(100);ok('browser back returns to q1',p.url().endsWith('#q1'));ok('back keeps answers',await p.locator('input[name="action-0"][value="4"]').isChecked());
 await p.goForward();await p.waitForTimeout(100);ok('browser forward',p.url().endsWith('#q2'));
 await p.goto(B+'calculator.html#q9');await p.waitForTimeout(100);ok('cannot skip ahead by URL',p.url().endsWith('#q2'),p.url());
 await p.goto(B+'calculator.html');await p.waitForTimeout(100);ok('resume card shown',(await p.textContent('#returning')).includes('unfinished'));
 await p.click('#returning .btn--sun');await p.waitForTimeout(100);ok('resume goes to next unanswered',p.url().endsWith('#q2'));
 const pick=n=>n==='action-0'?4:n==='action-1'?6:(n.charCodeAt(0)+n.length)%11;
 await answer(p,pick);
 const t1=await p.evaluate(()=>document.getElementById('panel-results').innerText);
 ok('goal rendered as text, not HTML',await p.locator('#panel-results img[src="x"]').count()===0);
 const entries=()=>p.evaluate(()=>JSON.parse(localStorage['dps.readiness.v1']).length);
 ok('one saved attempt',await entries()===1);
 await p.reload();await p.waitForTimeout(100);ok('refresh keeps results',await p.isVisible('#panel-results.is-on'));
 ok('refreshed results identical',(await p.evaluate(()=>document.getElementById('panel-results').innerText))===t1);
 await p.goBack();await p.waitForTimeout(100);ok('back from results reaches q9',/#q9$/.test(p.url()),p.url());
 await p.click('#btnNext');await p.waitForSelector('#panel-results.is-on');ok('resubmitting does not duplicate',await entries()===1);
 // tracker
 await p.$$eval('#trackerDays input',(l)=>l[0].click());await p.$$eval('#trackerDays input',(l)=>l[2].click());await p.fill('#trackerNote','Slept better on day 3');
 await p.reload();await p.waitForTimeout(100);ok('tracker persists',await p.locator('#trackerDays input:checked').count()===2&&(await p.inputValue('#trackerNote'))==='Slept better on day 3');
 ok('tracker status',(await p.textContent('#trackerStatus')).includes('2 of 7'));
 await p.click('#btnCopy');await p.waitForTimeout(100);const clip=await p.evaluate(()=>navigator.clipboard.readText()).catch(e=>'ERR '+e);ok('copy report',clip.includes('Reflection score')&&clip.includes('not a prediction')&&clip.includes('2 of 7'),clip.slice(0,40));
 const [dl]=await Promise.all([p.waitForEvent('download'),p.click('#btnDownload')]);ok('download report',dl.suggestedFilename()==='readiness-report.txt');
 const wa=await p.getAttribute('#btnTalk','href');ok('WhatsApp carries result',wa.startsWith('https://wa.me/917009925750')&&decodeURIComponent(wa).includes('Score:'),wa.slice(0,60));
 // identical inputs in a clean browser
 const c2=await br.newContext({...devices['iPhone 14']});const q=await c2.newPage();await q.goto(B+'calculator.html');await q.fill('#goal','<img src=x onerror=alert(1)> “Quoted”');await q.click('#startForm button');await q.waitForSelector('#panel-assess.is-on');await answer(q,pick);
 const sa=await p.textContent('#scoreNum'),sb=await q.textContent('#scoreNum'),ra=await p.textContent('#reading'),rb=await q.textContent('#reading');ok('identical inputs identical result',sa===sb&&ra===rb,sa+'/'+sb);await c2.close();
 // follow-up
 await p.click('#btnFollow');await p.waitForSelector('#panel-assess.is-on');await answer(p,n=>Math.min(10,pick(n)+2));
 ok('follow-up saved as second attempt',await entries()===2);ok('comparison shown',await p.isVisible('#history'));
 const h=await p.textContent('#historySub');ok('comparison labelled self-reported',h.includes('own answers')&&h.includes('Up'),h);
 await p.screenshot({path:`${SHOTS}/followup.png`,fullPage:true});
 // different goal not compared
 await p.click('#btnNew');await p.waitForTimeout(100);ok('new outcome returns to intro',await p.isVisible('#panel-intro.is-on'));
 await p.fill('#goal','Different goal');await p.click('#startForm button');await p.waitForSelector('#panel-assess.is-on');await answer(p,()=>5);
 ok('different goal not compared',!(await p.isVisible('#history')));
 const flat=await p.textContent('#reading');ok('flat answers explained',flat.includes('about the same'),flat.slice(0,50));ok('flat hides contradictory strongest',!(await p.isVisible('#calloutStrong')));
 // extremes
 for(const [v,txt] of [[0,'bottom of the scale'],[10,'top of the scale']]){await p.click('#btnNew');await p.waitForTimeout(50);await p.fill('#goal','Edge '+v);await p.click('#startForm button');await p.waitForSelector('#panel-assess.is-on');await answer(p,()=>v);ok(`all ${v}s wording`,(await p.textContent('#reading')).includes(txt));ok(`all ${v}s score`,(await p.textContent('#scoreNum'))===String(v*10));}
 ok('no script errors in flow',errs.length===0,errs.join(';'));
 // corrupt & blocked storage
 const c3=await br.newContext({...devices['iPhone 14']});const r=await c3.newPage();const e3=[];r.on('pageerror',e=>e3.push(e.message));await r.goto(B+'calculator.html');await r.evaluate(()=>{localStorage['dps.readiness.v1']='{bad';localStorage['dps.readiness.draft.v1']='nope'});await r.reload();await r.waitForTimeout(100);ok('corrupt storage survives',await r.isVisible('#panel-intro.is-on')&&e3.length===0,e3.join(';'));await c3.close();
 const c4=await br.newContext({...devices['iPhone 14']});await c4.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})});const s=await c4.newPage();const e4=[];s.on('pageerror',e=>e4.push(e.message));await s.goto(B+'calculator.html');await s.fill('#goal','Blocked');await s.click('#startForm button');await s.waitForSelector('#panel-assess.is-on');await answer(s,()=>6);ok('works with storage blocked',(await s.textContent('#scoreNum'))==='60'&&e4.length===0,e4.join(';'));await c4.close();
 // homepage
 const c5=await br.newContext({...devices['iPhone 14']});const h5=await c5.newPage();await h5.goto(B+'index.html');
 ok('10 level detail panels',await h5.locator('.step__more').count()===10);ok('5 fields each',await h5.locator('.level > div').count()===50);
 ok('sample lesson hidden until supplied',!(await h5.isVisible('#sample')));ok('feedback hidden until supplied',!(await h5.isVisible('#feedback')));
 ok('hero leads to check',(await h5.getAttribute('.hero__actions .btn--sun','href'))==='calculator.html');
 const html=fs.readFileSync(ROOT+'/index.html','utf8')+fs.readFileSync(ROOT+'/calculator.html','utf8');ok('no external scripts',!/<script[^>]+src="http/.test(html));
 await c5.close();
 await br.close();srv.close();
 const f=results.filter(r=>r[0]==='FAIL');console.log(`${results.length-f.length}/${results.length} passed`);f.forEach(r=>console.log(r.join(' | ')));
})().catch(e=>{console.error(e);process.exit(1)});
