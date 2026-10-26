import json,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'reports/v13'
base=(ROOT/'scripts-v12/visual.py').read_text();q=base.split("qa=r'''")[1].split("'''",1)[0]
q+=r'''window.__HERO_QA13__={
 render(id,pose,facing,close){if(this.actor)releasePreview10(this.actor);const p=makeCharacter(id);this.actor=p;const s=new THREE.Scene();s.background=new THREE.Color(0xe4ebe1);s.add(new THREE.HemisphereLight(0xf3f8f3,0x9baf9b,1.3));const light=new THREE.DirectionalLight(0xffeedb,1.8);light.position.set(-2,4,4);s.add(light);s.add(p.root);p.shadow.visible=false;p.gun.visible=false;p.root.rotation.y=facing;for(let i=0;i<40;i++)animateHuman(p,1/60,pose,false);const c=new THREE.PerspectiveCamera(close?30:34,400/600,.01,20);c.position.set(0,close?1.60:1.08,close?1.60:3.55);c.lookAt(0,close?1.57:.94,0);if(!this.renderer){const canvas=document.createElement('canvas');canvas.id='heroCapture13';Object.assign(canvas.style,{position:'fixed',inset:'0',zIndex:999999,width:'400px',height:'600px'});document.body.append(canvas);this.renderer=new THREE.WebGLRenderer({canvas,antialias:true});this.renderer.setPixelRatio(1);this.renderer.setSize(400,600,false);this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.12;}this.renderer.render(s,c);menuOpen=true;return {vertices:p.figure.geometry.attributes.position.count,triangles:p.figure.geometry.index.count/3,metadata:p.figure.userData.appearance13||null};},hide(){document.querySelector('#heroCapture13').style.display='none';}};'''
results={};errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
 for label,file in [('v012',OUT/'baseline/v012.html'),('v013',ROOT/'dist/index.html')]:
  data=file.read_bytes();html=data.decode().replace("window.addEventListener('error',e=>",q+"window.addEventListener('error',e=>",1)
  page=b.new_page(viewport={'width':844,'height':600},is_mobile=True,has_touch=True,device_scale_factor=1);page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  page.set_content(html,wait_until='load',timeout=120000);page.wait_for_selector('#loading.hidden',timeout=120000)
  results[label]={'html_sha256':hashlib.sha256(data).hexdigest(),'heroes':[]}
  for id in [0,1,2]:
   for pose,facing,close,name in [(0,0,False,'front'),(0,0,True,'face'),(3.3,.6,False,'walk'),(7,3.14159,False,'run-back')]:
    info=page.evaluate('(x)=>__HERO_QA13__.render(...x)',[id,pose,facing,close]);results[label]['heroes'].append({'id':id,'pose':name,**info});page.locator('#heroCapture13').screenshot(path=str(OUT/f'{label}-hero-{id}-{name}.png'))
  page.evaluate('__HERO_QA13__.hide();__DENSE_QA12__.street(0)');page.set_viewport_size({'width':844,'height':390});results[label]['camera']=page.evaluate('__DENSE_QA12__.fixed()');page.screenshot(path=str(OUT/f'{label}-fixed-camera.png'))
  results[label]['cities']=[]
  for id in range(3):
   results[label]['cities'].append(page.evaluate('(id)=>__DENSE_QA12__.street(id)',id));page.screenshot(path=str(OUT/f'{label}-street-{id}.png'))
  page.evaluate('__DENSE_QA12__.bay()');page.screenshot(path=str(OUT/f'{label}-bay.png'));page.close()
 b.close()
results['errors']=errors;(OUT/'visual.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'errors':errors,'versions':list(results)},ensure_ascii=False));assert not errors,errors
