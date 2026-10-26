"""Browser evidence on the delivered H5; QA hooks are injected only for testing."""
import io,json,hashlib,math,time
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image,ImageChops
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'reports/v13';OUT.mkdir(exist_ok=True)
html=(ROOT/'dist/index.html').read_text();sha=hashlib.sha256(html.encode()).hexdigest()
assert '__BAY_QA10__' not in html
html=html.replace("window.addEventListener('error',e=>",(ROOT/'scripts-v10/qa-api.js').read_text().replace('window.__BAY_QA10__={','window.__BAY_QA10__={cameraNow11(){this.bay();menuOpen=true;renderer.render(scene,camera);return {camera:camera.position.toArray(),quaternion:camera.quaternion.toArray(),fov:camera.fov};},')+"\nwindow.addEventListener('error',e=>",1)
results={'html_sha256':sha,'environment':'Chromium WebGL / SwiftShader, not an Android device'};errors=[];shader_errors=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
 page=browser.new_page(viewport={'width':844,'height':390},is_mobile=True,has_touch=True,device_scale_factor=1)
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('console',lambda m:shader_errors.append(m.text) if m.type=='error' else None)
 page.set_content(html,wait_until='load',timeout=120000);page.wait_for_selector('#loading.hidden',timeout=120000)
 camera=page.evaluate('__BAY_QA10__.cameraNow11()')
 results['same_camera_after']=page.evaluate('(data)=>__BAY_QA10__.camera(data)',camera)
 assert results['same_camera_after']['camera']==camera['camera'] and results['same_camera_after']['quaternion']==camera['quaternion']
 a=page.screenshot(path=str(OUT/'bay-after.png'),animations='disabled')
 page.evaluate('__BAY_QA10__.waterStep(1.6)');b=page.screenshot(path=str(OUT/'bay-wave-after.png'))
 im1=Image.open(io.BytesIO(a)).convert('RGB');im2=Image.open(io.BytesIO(b)).convert('RGB');pixels1=list(im1.getdata());pixels2=list(im2.getdata());selected=[i for i,(r,g,bb) in enumerate(pixels1) if i%844<280 and i//844>100 and i//844<330 and g>r*1.13 and bb>r*1.08]
 changed=sum(sum(abs(v-w) for v,w in zip(pixels1[i],pixels2[i]))>=3 for i in selected)
 results['water_pixels']={'selected':len(selected),'changed':changed};assert changed>20,results['water_pixels']
 page.evaluate('__BAY_QA10__.bay()');interactions=page.evaluate('__BAY_QA10__.interactions()');results['water_interactions']=interactions
 assert all(interactions['after']['effectCounters'][kind]>=1 for kind in ['foot','car','rotor']),interactions
 page.screenshot(path=str(OUT/'shallow-interactions.png'))
 results['effects_after_leaving']=page.evaluate('__BAY_QA10__.expire()');assert all(v['active']==0 for v in results['effects_after_leaving'].values())
 print('Water and pooled contacts PASS',flush=True)
 results['traffic_20']=page.evaluate('__BAY_QA10__.trafficFast()');assert results['traffic_20']=={'stopped':20,'passed':20}
 page.evaluate('__BAY_QA10__.foot()');results['night']=page.evaluate('__BAY_QA10__.night()');page.screenshot(path=str(OUT/'bay-night.png'))
 assert results['night']['solar']>=20
 results['overview']=page.evaluate('__BAY_QA10__.overview()');assert results['overview']['overview'];page.screenshot(path=str(OUT/'planet-overview.png'))
 assert not page.evaluate('__BAY_QA10__.overview()')['overview']
 print('Traffic / night / overview PASS',flush=True)
 modes=[]
 for viewport in [{'width':844,'height':390},{'width':390,'height':844},{'width':360,'height':740}]:
  page.set_viewport_size(viewport)
  for mode in ['car','heli','jet']:
   page.evaluate('(mode)=>__BAY_QA10__.ride(mode)',mode);page.wait_for_timeout(150)
   ids=['touchEnter','touchFire']+(['touchLiftUp','touchLiftDown'] if mode!='car' else ['touchJump','touchStop'])+(['flightMode'] if mode=='jet' else [])
   boxes={}
   for id in ids:
    loc=page.locator('#'+id)
    if not loc.is_visible():continue
    box=loc.bounding_box();boxes[id]=box
    assert box['width']>=48 and box['height']>=48,(viewport,mode,id,box)
    assert box['x']>=0 and box['y']>=0 and box['x']+box['width']<=viewport['width']+.1 and box['y']+box['height']<=viewport['height']+.1,(mode,id,box)
   for id,a in boxes.items():
    for other,b in boxes.items():
     if id>=other:continue
     overlap=min(a['x']+a['width'],b['x']+b['width'])-max(a['x'],b['x'])>1 and min(a['y']+a['height'],b['y']+b['height'])-max(a['y'],b['y'])>1
     assert not overlap,(viewport,mode,id,other)
   modes.append({'viewport':viewport,'mode':mode,'boxes':boxes})
   if viewport['width']==390:page.screenshot(path=str(OUT/('controls-'+mode+'-portrait.png')))
   page.evaluate('__BAY_QA10__.foot()')
 print('Nine layouts PASS',flush=True)
 results['control_layouts']=modes
 page.set_viewport_size({'width':390,'height':844});page.evaluate('__BAY_QA10__.ride("jet")')
 joy=page.locator('#joystick').bounding_box();up=page.locator('#touchLiftUp').bounding_box();fire=page.locator('#touchFire').bounding_box();cdp=page.context.new_cdp_session(page)
 points=[{'id':1,'x':joy['x']+joy['width']/2,'y':joy['y']+joy['height']*.22},{'id':2,'x':up['x']+up['width']/2,'y':up['y']+up['height']/2},{'id':3,'x':fire['x']+fire['width']/2,'y':fire['y']+fire['height']/2}]
 cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':points});page.wait_for_timeout(150)
 held=page.evaluate('__BAY_QA10__.controls()');assert held['y']>.1 and held['lift']==1 and held['fire'],held
 cdp.send('Input.dispatchTouchEvent',{'type':'touchCancel','touchPoints':[]});page.wait_for_timeout(100)
 released=page.evaluate('__BAY_QA10__.controls()');assert released['x']==released['y']==released['lift']==0 and not released['fire'],released
 results['multi_touch']={'held':held,'cancelled':released}
 page.locator('[data-menu="vehicles"]').click();page.locator('#vehicles.active').wait_for();before=page.evaluate('__BAY_QA10__.controls()')
 page.locator('.sheet-head').click();after=page.evaluate('__BAY_QA10__.controls()');assert not after['fire'] and after['lift']==0 and after['ammo']==before['ammo']
 results['modal_click_through']=False
 page.locator('#closeMenu').click();page.evaluate('__BAY_QA10__.foot()');page.locator('[data-menu="characters"]').first.click()
 for role in [0,1,2]:page.locator('[data-char="'+str(role)+'"]').click()
 warm=page.evaluate('__BAY_QA10__.previewResources()')
 for role in [0,1,2,0,1,2]:page.locator('[data-char="'+str(role)+'"]').click()
 settled=page.evaluate('__BAY_QA10__.previewResources()')
 assert settled['geometries']<=warm['geometries']+1 and settled['textures']<=warm['textures']+1,(warm,settled)
 results['preview_resource_recycling']={'warm':warm,'after_six_switches':settled}
 page.locator('.sheet').evaluate('e=>e.scrollTop=0');page.screenshot(path=str(OUT/'character-fit-portrait.png'))
 browser.close()
results['pageErrors']=errors;results['consoleErrors']=shader_errors
def strict_value(v):
 if isinstance(v,float) and not math.isfinite(v):return None
 if isinstance(v,dict):return {k:strict_value(x) for k,x in v.items()}
 if isinstance(v,list):return [strict_value(x) for x in v]
 return v
(OUT/'acceptance.json').write_text(json.dumps(strict_value(results),ensure_ascii=False,indent=2,allow_nan=False)+'\n')
print(json.dumps({'same_camera':True,'water_pixels':results['water_pixels'],'traffic':results['traffic_20'],'layouts':len(results['control_layouts']),'effects_recovered':True,'multi_touch_cancel':True,'pageErrors':errors,'consoleErrors':shader_errors},ensure_ascii=False))
assert not errors and not shader_errors,(errors,shader_errors)
