import json,time,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'reports/v10/baseline'
html=(OUT/'index.html').read_text()
qa="""window.__BASE_CAPTURE10__=()=>{startGame();closeMenu();const p=localPoint9(beach9,-22.3572,6);Object.assign(player,p,{heading:-Math.PI/2});viewYaw=-Math.PI/2;viewPitch=0;dayElapsed7=0;place(player.root,player.lat,player.lon,player.heading,.06);populateDistrict7(player,true);applySceneBudget(true);updateCamera(.1,true);updateSolar7(0);menuOpen=true;renderer.render(scene,camera);return {lat:player.lat,lon:player.lon,yaw:viewYaw,camera:camera.position.toArray(),quaternion:camera.quaternion.toArray(),fov:camera.fov,target:player.root.position.toArray(),render:renderer.info.render,memory:renderer.info.memory};};"""
html=html.replace("window.addEventListener('error',e=>",qa+"window.addEventListener('error',e=>",1)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':844,'height':390},is_mobile=True,has_touch=True,device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='load',timeout=120000);page.wait_for_selector('#loading.hidden',timeout=120000)
 result=page.evaluate('__BASE_CAPTURE10__()');page.screenshot(path=str(OUT/'bay-before.png'),animations='disabled')
 result.update({'viewport':[844,390],'html_sha256':hashlib.sha256((OUT/'index.html').read_bytes()).hexdigest(),'gpu':'SwiftShader, not Android','errors':errors})
 (OUT/'camera.json').write_text(json.dumps(result,indent=2));b.close()
print('Baseline camera and WebGL render recorded.')
