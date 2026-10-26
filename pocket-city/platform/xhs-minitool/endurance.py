"""600 active seconds in the packaged CSP build, local native-SDK mock only."""
import json,time,hashlib,math
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser import BASE,ROOT,OUT,MOCK,POLICY,server,prepare_qa,wait_boot
probe="""window.__RENDER_INTERVALS10__=[];{let previous=0;function probe10(t){if(previous&&started&&!menuOpen&&!orbit&&!wheelMode&&!document.hidden){const list=window.__RENDER_INTERVALS10__;list.push(t-previous);if(list.length>24000)list.shift();}previous=t;requestAnimationFrame(probe10);}requestAnimationFrame(probe10);}"""
srv,url=server();qa=prepare_qa(probe);errors=[];console=[];external=[]
result={'manifest_sha256':hashlib.sha256((OUT/'build.json').read_bytes()).hexdigest(),'base_sha256':json.loads((OUT/'build.json').read_text())['base_sha256'],'environment':'Linux Chromium WebGL / SwiftShader, shared cloud CPU, local native SDK mock; not Xiaohongshu iOS/Android','viewport':[844,390],'deviceScaleFactor':1,'duration_target_seconds':600,'csp':POLICY,'phases':[],'samples':[]}
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader']);context=browser.new_context(viewport={'width':844,'height':390},is_mobile=True,has_touch=True,device_scale_factor=1);context.add_init_script(MOCK)
 def network(route):
  if route.request.url.startswith(url+'/'):route.continue_()
  else:external.append(route.request.url);route.abort()
 context.route('**/*',network);page=context.new_page();page.route('**/assets/game.js',lambda route:route.fulfill(status=200,content_type='text/javascript',body=qa));page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:console.append(m.text) if m.type=='error' else None);page.goto(url+'/',wait_until='load',timeout=120000);wait_boot(page)
 start=time.monotonic()
 for mode,seconds in [('walk',180),('car',180),('heli',120),('jet',120)]:
  initial=page.evaluate('(mode)=>__BAY_QA10__.endurance(mode)',mode);phase_start=time.monotonic();page.evaluate('__RENDER_INTERVALS10__=[]')
  while time.monotonic()-phase_start<seconds:
   page.wait_for_timeout(min(10000,max(50,(seconds-(time.monotonic()-phase_start))*1000)));sample=page.evaluate('__BAY_QA10__.sample()');sample.update(elapsed_seconds=round(time.monotonic()-start,2),mode=mode);result['samples'].append(sample);(OUT/'endurance-progress.json').write_text(json.dumps({'elapsed_seconds':sample['elapsed_seconds'],'phase':mode,'sample':sample,'errors':errors},indent=2)+'\n')
   if len(result['samples'])%3==0:print(json.dumps({'elapsed':sample['elapsed_seconds'],'phase':mode,'calls':sample['render']['calls'],'memory':sample['memory']}),flush=True)
  intervals=page.evaluate('__RENDER_INTERVALS10__');ordered=sorted(intervals);mean=sum(intervals)/len(intervals) if intervals else None;p95=ordered[min(len(ordered)-1,math.ceil(len(ordered)*.95)-1)] if ordered else None;result['phases'].append({'mode':mode,'actual_seconds':round(time.monotonic()-phase_start,2),'frames':len(intervals),'average_fps':1000/mean if mean else None,'p95_render_interval_ms':p95,'begin':initial,'end':page.evaluate('__BAY_QA10__.sample()')})
 result.update(actual_seconds=round(time.monotonic()-start,2),pageErrors=errors,consoleErrors=console,external_requests=external,csp_violations=page.evaluate('__VIOLATIONS__'));page.screenshot(path=str(OUT/'endurance-final.png'));browser.close()
srv.shutdown();result['resource_notes']='Each phase retains one QA vehicle. Geometry and texture caches may grow on new views; heap varies with GC. No phone performance claim.';(OUT/'endurance.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');assert result['actual_seconds']>=600 and not errors and not console and not external and not result['csp_violations'];print(json.dumps({'seconds':result['actual_seconds'],'phases':[{k:v for k,v in x.items() if k not in ['begin','end']} for x in result['phases']],'errors':errors}),flush=True)
