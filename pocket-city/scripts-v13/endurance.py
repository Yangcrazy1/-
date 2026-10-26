"""Ten-minute real-time cloud WebGL run. No physical phone FPS claim."""
import json,time,hashlib,statistics,math
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'reports/v13'
original=(ROOT/'dist/index.html').read_text();sha=hashlib.sha256(original.encode()).hexdigest()
probe="""window.__RENDER_INTERVALS10__=[];{let previous=0;function probe10(t){if(previous&&started&&!menuOpen&&!orbit&&!wheelMode&&!document.hidden){const list=window.__RENDER_INTERVALS10__;list.push(t-previous);if(list.length>24000)list.shift();}previous=t;requestAnimationFrame(probe10);}requestAnimationFrame(probe10);}"""
html=original.replace("window.addEventListener('error',e=>",(ROOT/'scripts-v10/qa-api.js').read_text()+probe+"\nwindow.addEventListener('error',e=>",1)
result={'html_sha256':sha,'environment':'Linux Chromium WebGL / SwiftShader, shared cloud CPU; not a physical Android benchmark','viewport':[844,390],'deviceScaleFactor':1,'duration_target_seconds':600,'phases':[],'samples':[]};errors=[];console=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
 page=browser.new_page(viewport={'width':844,'height':390},is_mobile=True,has_touch=True,device_scale_factor=1)
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:console.append(m.text) if m.type=='error' else None)
 page.set_content(html,wait_until='load',timeout=120000);page.wait_for_selector('#loading.hidden',timeout=120000)
 start=time.monotonic()
 for mode,seconds in [('walk',180),('car',180),('heli',120),('jet',120)]:
  initial=page.evaluate('(mode)=>__BAY_QA10__.endurance(mode)',mode);phase_start=time.monotonic();page.evaluate('__RENDER_INTERVALS10__=[]')
  while time.monotonic()-phase_start<seconds:
   page.wait_for_timeout(min(10000,max(50,(seconds-(time.monotonic()-phase_start))*1000)))
   sample=page.evaluate('__BAY_QA10__.sample()');sample.update({'elapsed_seconds':round(time.monotonic()-start,2),'mode':mode});result['samples'].append(sample)
   (OUT/'endurance-progress.json').write_text(json.dumps({'elapsed_seconds':sample['elapsed_seconds'],'phase':mode,'sample':sample,'errors':errors},indent=2)+'\n')
   if len(result['samples'])%3==0:print(json.dumps({'elapsed':sample['elapsed_seconds'],'phase':mode,'calls':sample['render']['calls'],'geometries':sample['memory']['geometries'],'textures':sample['memory']['textures'],'heap':sample['heap']},ensure_ascii=False),flush=True)
  intervals=page.evaluate('__RENDER_INTERVALS10__');ordered=sorted(intervals);mean=sum(intervals)/len(intervals) if intervals else None;p95=ordered[min(len(ordered)-1,math.ceil(len(ordered)*.95)-1)] if ordered else None
  result['phases'].append({'mode':mode,'actual_seconds':round(time.monotonic()-phase_start,2),'frames':len(intervals),'average_fps':1000/mean if mean else None,'p95_render_interval_ms':p95,'begin':initial,'end':page.evaluate('__BAY_QA10__.sample()')})
 result['actual_seconds']=round(time.monotonic()-start,2);result['pageErrors']=errors;result['consoleErrors']=console
 result['resource_notes']='Entering modes creates a retained test vehicle/aircraft; compare begin/end within each phase. Pools remain capped; JavaScript heap varies with GC.'
 page.screenshot(path=str(OUT/'endurance-final.png'));browser.close()
(OUT/'endurance.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
assert result['actual_seconds']>=600 and not errors and not console,(result['actual_seconds'],errors,console)
print(json.dumps({'seconds':result['actual_seconds'],'phases':[{k:v for k,v in x.items() if k not in ['begin','end']} for x in result['phases']],'errors':errors},ensure_ascii=False),flush=True)
