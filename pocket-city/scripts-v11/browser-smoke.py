"""Real Chromium/WebGL mobile-layout checks; software GPU is not a phone benchmark."""
import json,os,time,hashlib,math
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'reports/v11';OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('POCKET_TEST_URL','http://127.0.0.1:8094/')
results={'html_sha256':hashlib.sha256((ROOT/'dist/index.html').read_bytes()).hexdigest(),'gpu_note':'Chromium headless WebGL with SwiftShader; not a physical phone FPS measurement','viewports':[[844,390],[390,844]],'device_scale_factor':1};errors=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
 page=browser.new_page(viewport={'width':844,'height':390},is_mobile=True,has_touch=True,device_scale_factor=1)
 page.on('pageerror',lambda e:errors.append(str(e)))
 response=page.goto(URL,wait_until='load',timeout=120000)
 page.wait_for_function("document.querySelector('#loading').classList.contains('hidden') || document.querySelector('#loading').classList.contains('error')",timeout=120000)
 assert page.locator('#loading.hidden').count(),'Loader failed: '+page.locator('#loading').inner_text()
 results['loading']=page.evaluate('window.__POCKET_LOAD8__')
 page.screenshot(path=str(OUT/'01-cover-landscape.png'))
 page.locator('#startBtn').click(timeout=120000)
 page.wait_for_timeout(1000)
 results['landscape']=page.evaluate('({state:window.__POCKET_CITY__.state,metrics:window.__POCKET_METRICS8__()})')
 page.screenshot(path=str(OUT/'02-street-landscape.png'))
 # Verify translation and wheel/animation updates in the actual rendered session.
 motion_before=page.evaluate('__POCKET_CITY9__.motion')
 page.wait_for_timeout(3000)
 motion_after=page.evaluate('__POCKET_CITY9__.motion')
 motion={}
 for kind in ['cars','peds']:
  original={a['id']:a for a in motion_before[kind]}
  pairs=[(original[a['id']],a) for a in motion_after[kind] if a['id'] in original]
  moved=[(a,b) for a,b in pairs if math.hypot(a['lat']-b['lat'],a['lon']-b['lon'])*154>.12]
  animated=sum(abs(a.get('wheel',a.get('phase',0))-b.get('wheel',b.get('phase',0)))>.01 for a,b in moved)
  motion[kind]={'sampled':len(pairs),'moved':len(moved),'animated':animated}
  assert len(moved)>=(1 if kind=='cars' else 3) and animated>=1,motion
 results['rendered_motion']=motion

 page.locator('[data-menu="vehicles"]').click(timeout=60000)
 page.locator('#vehicles.active').wait_for(timeout=60000)
 slider=page.locator('#vehicles .fleet-grid')
 before=slider.evaluate('e=>({left:e.scrollLeft,width:e.clientWidth,total:e.scrollWidth,touch:getComputedStyle(e).touchAction})')
 r=slider.bounding_box();cdp=page.context.new_cdp_session(page);x=r['x']+min(r['width']-35,380);y=r['y']+min(r['height']*.45,80)
 cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
 for i in range(1,8):cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x-i*35,'y':y}]})
 cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
 page.wait_for_timeout(350)
 after=slider.evaluate('e=>e.scrollLeft');assert after>before['left']+30,(before,after)
 results['native_fleet_swipe']={'before':before,'after':after}
 page.screenshot(path=str(OUT/'03-fleet-swipe.png'))
 # Safe spawn is exercised by real UI, not by calling an internal summon function.
 tank=page.locator('[data-vehicle="tank"]');tank.scroll_into_view_if_needed();count=page.evaluate('window.__POCKET_CITY__.state.cars');tank.click()
 page.wait_for_timeout(500)
 results['tank_spawn']={'before':count,'after':page.evaluate('window.__POCKET_CITY__.state.cars'),'toast':page.locator('#toast').inner_text()}
 assert results['tank_spawn']['after']==count+1,results['tank_spawn']
 # Touch input changes actual simulated position.
 page.locator('#closeMenu').click() if page.locator('#menu').evaluate("e=>e.classList.contains('open')") else None
 before=page.evaluate('window.__POCKET_CITY__.state.player')
 joy=page.locator('#joystick').bounding_box();jx=joy['x']+joy['width']/2;jy=joy['y']+joy['height']/2
 cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':jx,'y':jy}]})
 cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':jx,'y':jy-joy['height']*.22}]})
 page.wait_for_timeout(2000)
 cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
 after=page.evaluate('window.__POCKET_CITY__.state.player');results['touch_walk']={'before':before,'after':after}
 assert abs(after['lat']-before['lat'])+abs(after['lon']-before['lon'])>1e-5,results['touch_walk']
 # New map and destinations are exercised through visible controls.
 page.locator('[data-menu="atlas9"]').click()
 page.locator('#atlas9.active').wait_for()
 page.screenshot(path=str(OUT/'06-island-map.png'))
 results['edition9']=page.evaluate('__POCKET_CITY9__.state')
 visits=[]
 for dest in ['beach','casino','sphinx']:
  if dest!='beach':page.locator('[data-menu="atlas9"]').click()
  money=page.evaluate('__POCKET_CITY__.state.cash')
  page.locator('#atlas9 [data-dest9="'+dest+'"]').click()
  page.wait_for_timeout(600)
  state=page.evaluate('({game:__POCKET_CITY__.state,edition:__POCKET_CITY9__.state})')
  assert not state['game']['menuOpen'] and state['edition']['walkable'],state
  assert state['game']['cash']==money
  page.screenshot(path=str(OUT/('07-'+dest+'.png')))
  visits.append({'id':dest,'state':state,'toast':page.locator('#toast').inner_text()})
 results['landmarkVisits']=visits
 page.locator('[data-menu="characters"]').first.click()
 for index in [0,1]:
  page.locator('[data-char="'+str(index)+'"]').click()
  page.locator('.sheet').evaluate('e=>e.scrollTop=0')
  page.wait_for_timeout(200)
  assert page.locator('#modelPreview').get_attribute('data-renderer')=='webgl'
  for facing in ['1.5708','3.14159','0']:
   page.locator('[data-facing="'+facing+'"]').click()
  for pose in ['3.3','7','0']:
   page.locator('[data-model-pose="'+pose+'"]').click()
  page.locator('.sheet').evaluate('e=>e.scrollTop=0')
  page.screenshot(path=str(OUT/('08-character-'+str(index)+'.png')))
 page.locator('#closeMenu').click()
 # Switching to portrait must keep the modal usable and the page free of overflow.
 page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(600)
 results['portrait_overflow']=page.evaluate('({body:document.body.scrollWidth,viewport:innerWidth})')
 assert results['portrait_overflow']['body']<=390
 page.screenshot(path=str(OUT/'04-street-portrait.png'))
 page.locator('[data-menu="vehicles"]').click();page.wait_for_timeout(200)
 page.locator('#closeMenu').click();page.locator('[data-menu="atlas9"]').click();page.screenshot(path=str(OUT/'09-map-portrait.png'));page.locator('#closeMenu').click();page.locator('[data-menu="vehicles"]').click()
 results['portrait_modal']=page.locator('.sheet').bounding_box();assert results['portrait_modal']['height']<=844
 page.screenshot(path=str(OUT/'05-fleet-portrait.png'))
 (OUT/'browser-partial.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
 browser.close()
 # Direct-file opening must work with all network requests disallowed.
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
 offline=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 requests=[]
 offline.route('http://**/*',lambda route:(requests.append(route.request.url),route.abort()))
 offline.route('https://**/*',lambda route:(requests.append(route.request.url),route.abort()))
 offline.on('pageerror',lambda e:errors.append(str(e)))
 try:
  offline.goto((ROOT/'dist/index.html').as_uri(),wait_until='load',timeout=120000)
  results['file_protocol']='loaded'
 except Exception as error:
  if 'ERR_BLOCKED_BY_ADMINISTRATOR' not in str(error):raise
  results['file_protocol']='Cloud Chromium policy blocks file navigation; file launch on phones remains unverified.'
  offline.close()
  offline=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
  offline.route('http://**/*',lambda route:(requests.append(route.request.url),route.abort()))
  offline.route('https://**/*',lambda route:(requests.append(route.request.url),route.abort()))
  offline.on('pageerror',lambda e:errors.append(str(e)))
  offline.set_content((ROOT/'dist/index.html').read_text(),wait_until='load',timeout=120000)
 offline.wait_for_selector('#loading.hidden',timeout=120000)
 offline.locator('#startBtn').click(timeout=120000)
 assert offline.evaluate('window.__POCKET_CITY__.state.started')
 results['offline_file']={'started':True,'networkRequests':requests};assert not requests,requests
 browser.close()
results['pageErrors']=errors
def strict_value(value):
 if isinstance(value,float) and not math.isfinite(value):return None
 if isinstance(value,list):return [strict_value(x) for x in value]
 if isinstance(value,dict):return {k:strict_value(v) for k,v in value.items()}
 return value
results=strict_value(results)
(OUT/'browser-smoke.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print(json.dumps(results,ensure_ascii=False,indent=2),flush=True)
assert not errors,errors
