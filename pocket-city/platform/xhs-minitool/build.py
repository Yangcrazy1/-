"""Derive a MiniTool ZIP from the latest tested single HTML; never overwrite it."""
from pathlib import Path
import re,json,hashlib,base64,subprocess,shutil,zipfile
ROOT=Path(__file__).resolve().parents[2];BASE=Path(__file__).resolve().parent
STAGE=BASE/'.staging';DIST=BASE/'dist';REPORT=ROOT/'reports/xhs-v013';STAGE.mkdir(exist_ok=True);REPORT.mkdir(exist_ok=True)
if DIST.exists():shutil.rmtree(DIST)
(DIST/'assets').mkdir(parents=True)
source=(ROOT/'dist/index.html').read_text();base_sha=hashlib.sha256(source.encode()).hexdigest()
assert base_sha=='b35f30af3372f901b3e8590d073f968e0a4fa5cd7663fdbaaebc3fec636a5adf','Review newer workspace baseline before platform build'
blocks=re.findall(r'<script\b([^>]*)>([\s\S]*?)</script>',source)
assert len(blocks)==3 and 'bundle8-1' in blocks[1][0]
game=blocks[1][1]
# URL-safe base64 avoids literal protocol-relative URL false alarms in packed
# binary skin/animation buffers. Decoded bytes stay identical; no URL rule waived.
rig=json.loads((ROOT/'assets/rig-v7.json').read_text())
def urlsafe_rig(obj):
 if isinstance(obj,list):return [urlsafe_rig(v) for v in obj]
 if isinstance(obj,dict):return {k:(v.replace('+','-').replace('/','_') if isinstance(v,str) and k in {'p','n','uv','j','w','ix','q','t','inverses'} else urlsafe_rig(v)) for k,v in obj.items()}
 return obj
replacement=json.dumps(urlsafe_rig(rig),ensure_ascii=False,separators=(',',':'))
start=game.index('const RIG_DATA_V7=')+len('const RIG_DATA_V7=');old,end=json.JSONDecoder().raw_decode(game[start:]);assert old==rig
game=game[:start]+replacement+game[start+end:]
game=game.replace('function unpack7(s,Type){const b=atob(s)',"function unpack7(s,Type){s=s.replace(/-/g,'+').replace(/_/g,'/');const b=atob(s)")

html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',source)
# The CSP forbids the old eval loader; classic package-relative scripts replace it.
html=re.sub(r'<html\b[^>]*>','<html lang="zh-CN">',html,count=1)
html=html.replace('</head>','<link rel="icon" href="./assets/icon.svg" type="image/svg+xml"></head>',1).replace('单文件离线试玩交付','小红书小工具离线版')
html=re.sub(r'<a\b[^>]*>([\s\S]*?)</a>',r'<span>\1</span>',html)
html=html.replace('<button id="fullscreenBtn"','<button aria-label="旋转手机横屏" id="fullscreenBtn"')
html=re.sub(r'<label class="import-button">[\s\S]*?</label>','<span class="import-button">内置电台<input id="musicImport" type="file" accept="image/*" disabled hidden></span>',html)
html=html.replace('六套原创风格伴奏；喜欢的流行歌曲，可从手机导入播放。','六套原创电台伴奏，在小红书内点击播放。')
html=html.replace('选择手机中的 MP3 / M4A。音频只在此浏览器播放，不上传。','小红书小工具不支持选择音频文件，本版保留六套内置电台。')
html=html.replace('<div class="requirements">','<div class="requirements"><p id="xhsStorageStatus" role="status">正在读取本机进度…</p>',1)
html=html.replace('单人离线 Alpha','单人离线试玩').replace('手机请勿使用文件管理器的文本预览。','请重新进入小红书小工具。')
# Extract static base64 images from both HTML and game into actual package files.
images={}
def image_asset(m):
 uri=m.group(0)
 if uri not in images:
  kind=m.group(1);data=base64.b64decode(uri.split(',',1)[1]);name=hashlib.sha256(data).hexdigest()[:14]+('.jpg' if kind in ['jpeg','jpg'] else '.'+kind)
  (DIST/'assets'/name).write_bytes(data);images[uri]='./assets/'+name
 return images[uri]
image_re=re.compile(r'data:image/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+')
html=image_re.sub(image_asset,html);game=image_re.sub(image_asset,game)
# Platform-only integration: exact game functions and save schema are retained.
game=game.replace('localStorage.getItem(', 'window.OutlawMiniTool.storage.getItem(').replace('localStorage.setItem(', 'window.OutlawMiniTool.storage.setItem(')
game=re.sub(r'(?m)^async function fullScreen\([^\n]+',"function fullScreen(){toast('在小红书内请直接旋转手机横屏游玩');}",game)
for name in ['openRadioDB','rememberTracks','restoreTracks']:
 game=re.sub(r'(?m)^(?:async )?function '+name+r'\([^\n]+','',game)
game=re.sub(r'(?m)^function playCustomTrack\([^\n]+',"function playCustomTrack(){toast('小红书内请使用内置电台');return false;}",game)
game=re.sub(r"(?m)^ \$\('musicImport'\)\.addEventListener\('change',[^\n]+",'',game).replace('restoreTracks();','')
game=game.replace('navigator.vibrate?.','window.OutlawMiniTool.vibrate?.')
game=game.replace("quality='均衡',destroyed=false","quality='流畅',destroyed=false").replace('qualityAuto=true,resolutionScale=1.25','qualityAuto=true,resolutionScale=1')
game=game.replace('renderer.setPixelRatio(Math.min(devicePixelRatio,coarse?1.5:1.65));','renderer.setPixelRatio(Math.min(devicePixelRatio,1));')
game=game.replace("请用 Chrome、Edge 或系统浏览器打开下载的 HTML。",'请重新进入小红书小工具。')
game=game.replace("window.addEventListener('error',e=>", "window.addEventListener('outlaw:storage-status',e=>{if(started)toast(e.detail.message);});window.addEventListener('error',e=>",1)
# No production QA hooks; tests may add hooks in a separate routed test script.
if (BASE/'.staging/qa-injection.js').exists():
 qa=(BASE/'.staging/qa-injection.js').read_text();(STAGE/'qa-game-source.js').write_text(game.replace("window.addEventListener('error',e=>",qa+"window.addEventListener('error',e=>",1))
(STAGE/'game-source.js').write_text(game)
(STAGE/'bridge-source.js').write_text((BASE/'src/bridge.js').read_text())
(STAGE/'loader-source.js').write_text((BASE/'src/loader.js').read_text())
names=sorted(set(re.findall(r'\bTHREE\.([A-Za-z0-9_]+)',game)));(STAGE/'three-symbols.json').write_text(json.dumps(names))
# Preserve modern declarations but place Chrome 61 fallbacks immediately before.
def fallback_css(text):
 def declaration(m):
  prop,value=m.group(1),m.group(2);plain=value.replace('!important','').strip();important='!important' if '!important' in value else '';fallback=None
  if prop=='inset':
   parts=plain.split();parts=parts*4 if len(parts)==1 else parts*2 if len(parts)==2 else parts+[parts[1]] if len(parts)==3 else parts
   if len(parts)==4:return ';'.join(k+':'+v+important for k,v in zip(['top','right','bottom','left'],parts))+';'+m.group(0)
  if prop=='gap':return 'grid-gap:'+value+';'+m.group(0)
  if 'max(' in plain or 'min(' in plain or 'clamp(' in plain:
   match=re.match(r'^(?:max|min|clamp)\(\s*([^,()]+)',plain)
   if match:fallback=plain[:match.start()]+match.group(1).strip()
  elif 'env(' in plain:fallback=re.sub(r'env\([^)]*\)','0px',plain)
  elif re.search(r'\bd?vh\b',plain):pass
  if fallback and prop not in ['transform','background','color']:return prop+':'+fallback+important+';'+m.group(0)
  return m.group(0)
 return re.sub(r'([\w-]+)\s*:\s*([^;{}]+);',declaration,text)
styles=re.findall(r'<style[^>]*>([\s\S]*?)</style>',html)
html=re.sub(r'<style[^>]*>[\s\S]*?</style>','<link rel="stylesheet" href="./assets/styles.css">',html,count=1)
css=fallback_css(re.sub(r'@import\s+url\([^)]*\)\s*;','', '\n'.join(styles)))+'\n'+(BASE/'src/platform.css').read_text();(DIST/'assets/styles.css').write_text(css)
html=html.replace('</body>','<script src="./assets/bridge.js"></script><script src="./assets/loader.js"></script></body>')
(DIST/'index.html').write_text(html)
(DIST/'assets/icon.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="#315b51"/><circle cx="64" cy="66" r="43" fill="#b5d2b1"/><path d="M25 85h78v9H25zM37 47h20v38H37zm34-12h22v50H71z" fill="#f5efde"/><path d="M44 54h6v8h-6zm0 15h6v8h-6zm34-27h7v8h-7zm0 15h7v8h-7zm0 15h7v8h-7z" fill="#315b51"/><path d="M63 96V72l-8-5 8-5V30" stroke="#d98f7a" stroke-width="6" fill="none"/></svg>')
license_text=(BASE/'node_modules/three/LICENSE').read_text()
(DIST/'assets/credits.json').write_text(json.dumps({'engine':{'name':'Three.js r160','license':'MIT','text':license_text},'characters':{'name':'Quaternius Universal Base Characters + Universal Animation Library','license':'CC0-1.0'},'game':{'name':'侠盗自由城','assets':'Original procedural city, vehicles and synthesized radio arrangements; original source credits retained.'}},ensure_ascii=False,indent=2)+'\n')
subprocess.run(['node','compile.cjs'],cwd=BASE,check=True)
manifest={'title':'侠盗自由城','version':'0.13.0-xhs','base_sha256':base_sha,'upload_entry':'https://creator.xiaohongshu.com/new/red-app','format':'MiniTool offline HTML/CSS/classic JS ZIP','bridge':'Injected window.xhs.miniTool; no app credentials bundled','files':{p.relative_to(DIST).as_posix():{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(DIST.rglob('*')) if p.is_file()},'containerTested':False,'reviewApproved':False}
(REPORT/'build.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('MiniTool build:',len(manifest['files']),'files,',sum(x['bytes'] for x in manifest['files'].values()),'uncompressed bytes')
