import json,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'reports/v12'
qa=r'''window.__DENSE_QA12__={
 street(id){window.__DENSE_QA12__.freeze=false;startGame();closeMenu();fastTravel(id);setWeapon(0,false);for(let i=0;i<50;i++)animateHuman(player,1/60,0,false);cameraInitialized=false;applySceneBudget(true);updateCamera(.1,true);updateSolar7(0);updateOcean10(0);menuOpen=true;renderer.render(scene,camera);return {R,player:{lat:player.lat,lon:player.lon},camera:camera.position.toArray(),buildings:buildings.length,render:{...renderer.info.render},memory:{...renderer.info.memory},garden:typeof gardenStats12==='undefined'?null:gardenStats12};},
 bay(){menuOpen=false;if(orbit)toggleOrbit();visitLandmark9('beach');cameraInitialized=false;updateCamera(.1,true);applySceneBudget(true);updateSolar7(0);updateOcean10(0);menuOpen=true;renderer.render(scene,camera);},
 overview(){menuOpen=false;toggleOrbit();updateCamera(.1,true);renderer.render(scene,camera);return {orbit};},
 fixed(){const p=streetPoint(streets[5],306,-(streets[5].width/2+1.1));Object.assign(player,p);viewYaw=p.heading;refreshDistrict(true);updateLabels();updateHUD();place(player.root,p.lat,p.lon,p.heading,.06);for(let i=0;i<60;i++)animateHuman(player,1/60,0,false);const f=frame(p.lat,p.lon,p.heading),anchor=f.n.clone().multiplyScalar(R);camera.position.copy(anchor).addScaledVector(f.f,-6.2).addScaledVector(f.n,3.1).addScaledVector(f.r,.35);camera.up.copy(f.n);camera.lookAt(anchor.clone().addScaledVector(f.n,1.163));camera.fov=55;camera.updateProjectionMatrix();camera.updateMatrixWorld();applySceneBudget(true);menuOpen=true;window.__DENSE_QA12__.freeze=true;clearTimeout(toastTimer);$('toast').classList.remove('show');renderer.render(scene,camera);return {road:5,index:306,offset:[-6.2,3.1,.35],fov:55};},
};const liveCamera12=updateCamera;updateCamera=function(...args){if(!window.__DENSE_QA12__.freeze)liveCamera12(...args);};'''
result={};errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
 for name,file in [('v011',OUT/'baseline/v011.html'),('v012',ROOT/'dist/index.html')]:
  data=file.read_bytes();html=data.decode().replace("window.addEventListener('error',e=>",qa+"window.addEventListener('error',e=>",1)
  page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=1);page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  page.set_content(html,wait_until='load',timeout=120000);page.wait_for_selector('#loading.hidden',timeout=120000)
  states=[]
  for id in range(3):
   states.append(page.evaluate('(id)=>__DENSE_QA12__.street(id)',id));page.screenshot(path=str(OUT/(name+'-street-'+str(id)+'-portrait.png')),animations='disabled')
  page.evaluate('__DENSE_QA12__.bay()');page.screenshot(path=str(OUT/(name+'-bay-portrait.png')),animations='disabled')
  page.set_viewport_size({'width':844,'height':390})
  for id in range(3):
   page.evaluate('(id)=>__DENSE_QA12__.street(id)',id);page.screenshot(path=str(OUT/(name+'-street-'+str(id)+'-landscape.png')),animations='disabled')
  page.evaluate('__DENSE_QA12__.bay()');page.screenshot(path=str(OUT/(name+'-bay-landscape.png')),animations='disabled')
  result[name+'-fixed']=page.evaluate('__DENSE_QA12__.fixed()');page.screenshot(path=str(OUT/(name+'-fixed-camera.png')),animations='disabled')
  page.evaluate('__DENSE_QA12__.freeze=false;__DENSE_QA12__.overview()');page.screenshot(path=str(OUT/(name+'-overview.png')),animations='disabled')
  result[name]={'html_sha256':hashlib.sha256(data).hexdigest(),'states':states};page.close()
 b.close()
result['errors']=errors;(OUT/'visual.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2));assert not errors,errors
