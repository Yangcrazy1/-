"""Force WebGL absence and verify actual Canvas renderer clothing separation."""
import hashlib,json
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'reports/v13';data=(ROOT/'dist/index.html').read_bytes();html=data.decode();errors=[];messages=[]
force="<script>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/i.test(type)?null:get.call(this,type,...args);};}</script>"
qa="""window.__CANVAS_QA13__={sample(){return {software:renderer.isSoftwareRenderer,groups:player.figure.geometry.groups.map(g=>g.materialIndex),skin:player.figure.material[2].color.getHexString(),shirt:player.figure.material[0].color.getHexString(),vertices:player.figure.geometry.attributes.position.count};}};"""
html=html.replace('<head>','<head>'+force,1).replace("window.addEventListener('error',e=>",qa+"window.addEventListener('error',e=>",1)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);page=b.new_page(viewport={'width':640,'height':360},is_mobile=True,has_touch=True,device_scale_factor=1);page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:messages.append(m.text) if m.type=='error' else None);page.set_content(html,wait_until='load',timeout=120000);page.wait_for_selector('#loading.hidden',timeout=120000);page.locator('#startBtn').click();state=page.evaluate('__CANVAS_QA13__.sample()');assert state['software'] and all(id in state['groups'] for id in [0,1,2,3,5]) and state['skin']!=state['shirt'];page.screenshot(path=str(OUT/'software-street.png'));page.locator('[data-menu="characters"]').first.click();page.screenshot(path=str(OUT/'software-character.png'));b.close()
r={'html_sha256':hashlib.sha256(data).hexdigest(),'environment':'Linux Chromium; all WebGL contexts deliberately disabled','state':state,'pageErrors':errors,'expected_webgl_failure_messages':messages};(OUT/'software-smoke.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print(json.dumps(r,ensure_ascii=False));assert not errors
