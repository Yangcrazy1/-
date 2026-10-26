"""Export the final single HTML plus actual before/after review, no playable ZIP."""
import base64,hashlib,json,shutil,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REPORT=ROOT/'reports/v13';OUTPUT=Path('/workspace/outputs');DOWNLOADS=ROOT.parent/'downloads'
data=(ROOT/'dist/index.html').read_bytes();sha=hashlib.sha256(data).hexdigest();assert len(data)<10_000_000
assert all(x not in data for x in [b'__HERO_QA13__',b'__DENSE_QA12__',b'__BAY_QA10__',b'__RENDER_INTERVALS10__'])
logic=json.loads((ROOT/'verification-v13.json').read_text());assert logic['passed']==98 and logic['html_sha256']==sha
for name in ['software-smoke','browser-smoke','acceptance','endurance']:
 r=json.loads((REPORT/(name+'.json')).read_text());assert r['html_sha256']==sha,(name,'wrong HTML');assert not r.get('pageErrors') and not r.get('consoleErrors'),name
 if name=='endurance':assert r['actual_seconds']>=600
visual=json.loads((REPORT/'visual.json').read_text());assert visual['v013']['html_sha256']==sha and not visual['errors']
with tempfile.TemporaryDirectory(prefix='liberty-v13-') as tmp:
 stage=Path(tmp)/'source';shutil.copytree(ROOT,stage,ignore=shutil.ignore_patterns('node_modules','reports','platform','dist','game-v*.js','verification-*.json','__pycache__','*.pyc'))
 (stage/'dist').mkdir();subprocess.run(['python3','scripts-v7/build.py'],cwd=stage,check=True,capture_output=True);assert (stage/'dist/index.html').read_bytes()==data,'Independent rebuild differed'
OUTPUT.mkdir(exist_ok=True);DOWNLOADS.mkdir(exist_ok=True);name='outlaw-liberty-city-v0.13-mobile.html'
for out in [OUTPUT,DOWNLOADS]:(out/name).write_bytes(data)
cards=[]
for title,before,after in [('Tommy 发际线、脸型与开领','v012-hero-1-face.png','v013-hero-1-face.png'),('CJ 走路与连续肩部','v012-hero-0-walk.png','v013-hero-0-walk.png'),('沿用相同路段与局部镜头','v012-fixed-camera.png','v013-fixed-camera.png'),('自由城海岛建筑','v012-street-1.png','v013-street-1.png'),('暖色沙岸与木栈道','v012-bay.png','v013-bay.png')]:
 imgs=['<figure><figcaption>'+label+'</figcaption><img alt="'+label+'" src="data:image/png;base64,'+base64.b64encode((REPORT/file).read_bytes()).decode()+'"></figure>' for label,file in [('V0.12',before),('V0.13',after)]];cards.append('<section><h2>'+title+'</h2><div>'+''.join(imgs)+'</div></section>')
review='<!doctype html><html lang="zh"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>侠盗自由城 V0.13 实拍对比</title><style>body{margin:18px;background:#f1ecdd;color:#315a50;font:16px system-ui}main{max-width:1100px;margin:auto}section{margin:28px 0}section div{display:flex;gap:10px}figure{margin:0;width:calc(50% - 5px)}img{width:100%;max-height:650px;object-fit:contain;background:#e4ebe1;border-radius:10px}figcaption{padding:5px}</style><main><h1>侠盗自由城 V0.13</h1><p>左 V0.12，右 V0.13，实际游戏网格的原始渲染截图。人物使用相同光照、镜头、动作时间和朝向；街区固定对比沿用相同路段、局部相机偏移和焦距。其他街景取实际落点，车流和行人因运行时刻不同会变化。没有修饰截图。</p><p>连续肩部与权重、Tommy 头脸与后梳发型、橙蓝立面和白窗框。实机安卓与小红书容器尚未验证。</p>'+''.join(cards)+'</main></html>'
for out in [OUTPUT,DOWNLOADS]:(out/'outlaw-liberty-city-v0.13-review.html').write_text(review)
record={'name':name,'bytes':len(data),'sha256':sha,'independent_rebuild':'byte identical','logic_checks':98,'endurance_seconds':json.loads((REPORT/'endurance.json').read_text())['actual_seconds'],'phone_device_tested':False,'xhs_file':'outlaw-liberty-city-v0.13-xhs-minitool.zip (separate platform delivery)'}
for out in [REPORT,OUTPUT,DOWNLOADS]:(out/'outlaw-liberty-city-v0.13-checksums.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(record,ensure_ascii=False))
