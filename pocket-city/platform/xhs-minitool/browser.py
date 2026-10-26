"""CSP/offline production boot and injected gameplay regression in local Chromium."""
import functools,http.server,threading,json,hashlib,subprocess,time
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parent;ROOT=BASE.parents[1];OUT=ROOT/'reports/xhs-v013';DIST=BASE/'dist'
POLICY="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' data: blob:; font-src 'self'; connect-src 'none'; worker-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'"
class Handler(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
 def end_headers(self):self.send_header('Content-Security-Policy',POLICY);self.send_header('Cache-Control','no-store');super().end_headers()
def server():
 s=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Handler,directory=str(DIST)));threading.Thread(target=s.serve_forever,daemon=True).start();return s,'http://127.0.0.1:'+str(s.server_address[1])
def prepare_qa(extra=""):
 source=(BASE/'.staging/game-source.js').read_text();qa=(ROOT/'scripts-v10/qa-api.js').read_text();source=source.replace("window.addEventListener('error',e=>",qa+extra+"window.addEventListener('error',e=>",1);(BASE/'.staging/qa-game-source.js').write_text(source)
 subprocess.run([str(BASE/'node_modules/.bin/esbuild'),str(BASE/'.staging/qa-game-source.js'),'--target=es2017,chrome61','--minify','--charset=utf8','--legal-comments=none','--outfile='+str(BASE/'.staging/qa-game.js')],check=True,capture_output=True)
 return (BASE/'.staging/qa-game.js').read_text()
MOCK=r'''window.__XHS_CALLS__=[];window.__SAVE__={schema:1,cash:7777,taxiTrips:2,raceWins:1,flightTrips:3,charId:1,quality:'流畅'};window.__VIOLATIONS__=[];document.addEventListener('securitypolicyviolation',e=>__VIOLATIONS__.push({directive:e.effectiveDirective,blocked:e.blockedURI}));Object.defineProperty(window,'localStorage',{get(){throw Error('browser storage blocked')}});Object.defineProperty(window,'indexedDB',{get(){throw Error('browser database blocked')}});Object.fromEntries=undefined;Array.prototype.flat=undefined;Array.prototype.flatMap=undefined;window.xhs={miniTool:{getLaunchOptions:async()=>({miniToolEnv:{buildVersion:9490001}}),getStorageInfo:async()=>({keys:['pocket-city-v4'],currentSize:1,limitSize:10240}),getStorage:async()=>({data:__SAVE__}),setStorage:async({key,data})=>{__XHS_CALLS__.push({key,data});window.__SAVE__=JSON.parse(JSON.stringify(data));return {errMsg:'setStorage:ok'}}}};'''
def wait_boot(page):
 deadline=time.monotonic()+120
 while time.monotonic()<deadline:
  if page.evaluate('!!window.__POCKET_CITY__'):return
  if page.locator('#loading.error').count():raise AssertionError(page.locator('#loading').inner_text())
  page.wait_for_timeout(200)
 raise AssertionError('startup timeout')
def run():
 srv,url=server();qa=prepare_qa();errors=[];console=[];requests=[]
 result={'manifest_sha256':hashlib.sha256((OUT/'build.json').read_bytes()).hexdigest(),'environment':'Linux Chromium / SwiftShader; not a real Xiaohongshu client','csp':POLICY,'production_boot':{},'qa_hooks_not_in_release':True}
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
  context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=1);context.add_init_script(MOCK)
  def network(route):
   if route.request.url.startswith(url+'/'):route.continue_()
   else:requests.append(route.request.url);route.abort()
  context.route('**/*',network);page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:console.append(m.text) if m.type=='error' else None)
  page.goto(url+'/',wait_until='load',timeout=120000);wait_boot(page)
  state=page.evaluate('({game:__POCKET_CITY__.state,storage:OutlawMiniTool.storage.state(),violations:__VIOLATIONS__,loading:__POCKET_LOAD8__})');assert state['game']['cash']==7777 and state['game']['character']==1 and state['storage']['backend']=='native' and not state['violations'],state
  result['production_boot']=state;page.locator('#startBtn').click();page.wait_for_timeout(400);page.screenshot(path=str(OUT/'production-portrait.png'))
  page.locator('[data-menu="characters"]').first.click();page.locator('[data-char="0"]').click();page.evaluate('OutlawMiniTool.storage.settled()');assert page.evaluate('__SAVE__.charId')==0
  result['native_save']=page.evaluate('({record:__SAVE__,calls:__XHS_CALLS__,state:OutlawMiniTool.storage.state()})');page.locator('#closeMenu').click();page.locator('#fullscreenBtn').click();assert page.evaluate('!document.fullscreenElement')
  # Native callback failures stay visible without breaking the running game.
  page.evaluate('xhs.miniTool.setStorage=async()=>{throw Error("quota")};OutlawMiniTool.storage.setItem("pocket-city-v4",JSON.stringify({...__SAVE__,cash:8888}))');page.evaluate('OutlawMiniTool.storage.settled()');assert page.evaluate('OutlawMiniTool.storage.state().error')
  result['storage_failure_feedback']=page.locator('#xhsStorageStatus').inner_text();assert '未保存' in result['storage_failure_feedback'];result['production_csp_violations']=page.evaluate('__VIOLATIONS__');page.close()
  # The second page receives private hooks in test-only code under the same CSP.
  page=context.new_page();page.route('**/assets/game.js',lambda route:route.fulfill(status=200,content_type='text/javascript',body=qa));page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:console.append(m.text) if m.type=='error' else None)
  page.goto(url+'/',wait_until='load',timeout=120000);wait_boot(page);page.locator('#startBtn').click();print('Production CSP/native boot and failure feedback PASS',flush=True)
  result['traffic']=page.evaluate('__BAY_QA10__.trafficFast()');assert result['traffic']=={'stopped':20,'passed':20}
  layouts=[]
  for viewport in [{'width':844,'height':390},{'width':390,'height':844},{'width':360,'height':740}]:
   page.set_viewport_size(viewport)
   for mode in ['car','heli','jet']:
    page.evaluate('(mode)=>__BAY_QA10__.ride(mode)',mode);page.wait_for_timeout(100)
    ids=['touchEnter','touchFire']+(['touchLiftUp','touchLiftDown'] if mode!='car' else ['touchJump','touchStop'])+(['flightMode'] if mode=='jet' else [])
    boxes={}
    for id in ids:
     element=page.locator('#'+id)
     if not element.is_visible():continue
     b=element.bounding_box();boxes[id]=b;assert b['width']>=48 and b['height']>=48 and b['x']>=0 and b['y']>=0 and b['x']+b['width']<=viewport['width']+.1 and b['y']+b['height']<=viewport['height']+.1,(viewport,mode,id,b)
    for a,x in boxes.items():
     for b,y in boxes.items():
      if a>=b:continue
      assert min(x['x']+x['width'],y['x']+y['width'])-max(x['x'],y['x'])<=1 or min(x['y']+x['height'],y['y']+y['height'])-max(x['y'],y['y'])<=1,(mode,a,b)
    layouts.append({'viewport':viewport,'mode':mode,'boxes':boxes});page.evaluate('__BAY_QA10__.foot()')
   print('Layout PASS',viewport,flush=True)
  result['layouts']=layouts
  page.set_viewport_size({'width':390,'height':844});page.evaluate('__BAY_QA10__.ride("jet")');joy=page.locator('#joystick').bounding_box();up=page.locator('#touchLiftUp').bounding_box();fire=page.locator('#touchFire').bounding_box();cdp=context.new_cdp_session(page)
  points=[{'id':1,'x':joy['x']+joy['width']/2,'y':joy['y']+joy['height']*.22},{'id':2,'x':up['x']+up['width']/2,'y':up['y']+up['height']/2},{'id':3,'x':fire['x']+fire['width']/2,'y':fire['y']+fire['height']/2}];cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':points});page.wait_for_timeout(100);held=page.evaluate('__BAY_QA10__.controls()');cdp.send('Input.dispatchTouchEvent',{'type':'touchCancel','touchPoints':[]});page.wait_for_timeout(100);released=page.evaluate('__BAY_QA10__.controls()');assert held['y']>.1 and held['lift']==1 and held['fire'] and released['x']==released['y']==released['lift']==0 and not released['fire'];result['multitouch']={'held':held,'released':released}
  result['qa_csp_violations']=page.evaluate('__VIOLATIONS__');page.screenshot(path=str(OUT/'flight-portrait.png'));browser.close()
 srv.shutdown();result.update(pageErrors=errors,consoleErrors=console,external_requests=requests);(OUT/'browser.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');assert not errors and not console and not requests and not result['production_csp_violations'] and not result['qa_csp_violations'],(errors,console,requests);print('CSP/browser PASS',flush=True)
if __name__=='__main__':run()
