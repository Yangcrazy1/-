"""Unedited in-game captures; test hooks are never included in delivery."""
import json,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'reports/v11';OUT.mkdir(exist_ok=True)
QA=r'''window.__VISUAL11__={
 street(id){startGame();closeMenu();fastTravel(id);player.speed=0;weapon=0;setWeapon(0,false);for(let i=0;i<60;i++)animateHuman(player,1/60,0,false);cameraInitialized=false;applySceneBudget(true);updateCamera(.1,true);updateSolar7(0);if(typeof updateOcean10==='function')updateOcean10(0);menuOpen=true;renderer.render(scene,camera);return {position:{lat:player.lat,lon:player.lon},camera:camera.position.toArray(),frame:renderer.info.render,buildings:buildings.length};},
 overview(){menuOpen=false;toggleOrbit();updateCamera(.1,true);renderer.render(scene,camera);return {mode:orbit};},
 portrait(id,angle,pose){const p=makeCharacter(id),s=new THREE.Scene();s.background=new THREE.Color(0xe4ebe1);s.add(new THREE.HemisphereLight(0xf3f8f3,0x9baf9b,1.3));const key=new THREE.DirectionalLight(0xffeedb,1.8);key.position.set(-2,4,4);s.add(key);s.add(p.root);p.root.rotation.y=angle;p.shadow.visible=false;p.gun.visible=false;for(let i=0;i<60;i++)animateHuman(p,1/60,pose,false);const c=new THREE.PerspectiveCamera(34,300/430,.05,20);c.position.set(.03,1.00,3.45);c.lookAt(0,.89,0);const canvas=document.createElement('canvas'),r=new THREE.WebGLRenderer({canvas,antialias:true});r.setSize(300,430);r.outputColorSpace=THREE.SRGBColorSpace;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.12;r.render(s,c);const url=canvas.toDataURL('image/png');r.dispose();if(typeof releasePreview10==='function')releasePreview10(p);return url;},
 bay(){menuOpen=false;if(orbit)toggleOrbit();visitLandmark9('beach');cameraInitialized=false;updateCamera(.1,true);applySceneBudget(true);updateSolar7(0);if(typeof updateOcean10==='function')updateOcean10(0);menuOpen=true;renderer.render(scene,camera);},
};'''
results={};errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
 for name,path in [('v010',OUT/'baseline/v010.html'),('v011',ROOT/'dist/index.html')]:
  html=path.read_text();html=html.replace("window.addEventListener('error',e=>",QA+"window.addEventListener('error',e=>",1)
  page=b.new_page(viewport={'width':844,'height':390},is_mobile=True,has_touch=True,device_scale_factor=1);page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  page.set_content(html,wait_until='load',timeout=120000);page.wait_for_selector('#loading.hidden',timeout=120000)
  results[name]={'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'streets':[]}
  for id in [0,1,2]:
   results[name]['streets'].append(page.evaluate('(id)=>__VISUAL11__.street(id)',id));page.screenshot(path=str(OUT/(name+'-street-'+str(id)+'.png')),animations='disabled')
  page.evaluate('__VISUAL11__.bay()');page.screenshot(path=str(OUT/(name+'-bay.png')),animations='disabled')
  page.evaluate('__VISUAL11__.overview()');page.screenshot(path=str(OUT/(name+'-map.png')),animations='disabled')
  import base64
  for role in [0,1,2]:
   for facing,angle in [('front',0),('side',1.5707963268),('back',3.1415926536)]:
    data=page.evaluate('([id,angle])=>__VISUAL11__.portrait(id,angle,0)',[role,angle]);(OUT/(name+'-role-'+str(role)+'-'+facing+'.png')).write_bytes(base64.b64decode(data.split(',')[1]))
  page.close()
 b.close()
results['errors']=errors;(OUT/'visual.json').write_text(json.dumps(results,indent=2)+'\n')
for name in ['v010','v011']:
 canvas=Image.new('RGB',(900,430*3+35),'#e4ebe1');draw=ImageDraw.Draw(canvas);draw.text((12,10),name+' / CJ, Tommy, Michael / front, side, back',fill='#264f46')
 for role in [0,1,2]:
  for col,facing in enumerate(['front','side','back']):canvas.paste(Image.open(OUT/(name+'-role-'+str(role)+'-'+facing+'.png')),(col*300,role*430+35))
 canvas.save(OUT/(name+'-roles.png'))
print(json.dumps({'errors':errors,'captures':'reports/v11','hash':results['v011']['sha256']}));assert not errors,errors
