"""Validate matching final evidence; export standalone phone HTML and review HTML."""
import base64,hashlib,json,shutil,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REPORT=ROOT/'reports/v12';OUT=Path('/workspace/outputs');DOWNLOADS=ROOT.parent/'downloads'
data=(ROOT/'dist/index.html').read_bytes();sha=hashlib.sha256(data).hexdigest()
assert len(data)<10_000_000 and '侠盗自由城' in data.decode()
assert all(marker not in data for marker in [b'__DENSE_QA12__',b'__BAY_QA10__',b'__RENDER_INTERVALS10__'])
logic=json.loads((ROOT/'verification-v12.json').read_text());assert logic['passed']==95 and logic['html_sha256']==sha
for name in ['browser-smoke','acceptance','endurance']:
 r=json.loads((REPORT/(name+'.json')).read_text());assert r['html_sha256']==sha,(name,'wrong HTML')
 assert not r.get('pageErrors') and not r.get('consoleErrors'),name
 if name=='endurance':assert r['actual_seconds']>=600
visual=json.loads((REPORT/'visual.json').read_text());assert visual['v012']['html_sha256']==sha and not visual['errors']
with tempfile.TemporaryDirectory(prefix='liberty-v12-') as tmp:
 stage=Path(tmp)/'source';shutil.copytree(ROOT,stage,ignore=shutil.ignore_patterns('node_modules','reports','platform','dist','game-v*.js','verification-*.json','__pycache__','*.pyc'))
 (stage/'dist').mkdir();subprocess.run(['python3','scripts-v7/build.py'],cwd=stage,check=True,capture_output=True)
 assert (stage/'dist/index.html').read_bytes()==data,'Independent build differed'
OUT.mkdir(exist_ok=True);DOWNLOADS.mkdir(exist_ok=True);name='outlaw-liberty-city-v0.12-mobile.html'
for directory in [OUT,DOWNLOADS]:(directory/name).write_bytes(data)
candidate=ROOT/'platform/h5-candidate';(candidate/'index.html').write_bytes(data)
metadata=json.loads((candidate/'upload-status.json').read_text());metadata.update(version='0.12.0',bytes=len(data),sha256=sha,uploadReady=False)
(candidate/'upload-status.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n')
cards=[]
for title,before,after in [('固定路段／相同局部镜头','v011-fixed-camera.png','v012-fixed-camera.png'),('三城街景：圣安地列斯','v011-street-0-portrait.png','v012-street-0-portrait.png'),('三城街景：自由城','v011-street-1-landscape.png','v012-street-1-landscape.png'),('三城街景：洛圣都','v011-street-2-landscape.png','v012-street-2-landscape.png'),('海湾步道','v011-bay-landscape.png','v012-bay-landscape.png')]:
 imgs=['<figure><figcaption>'+label+'</figcaption><img alt="'+label+'" src="data:image/png;base64,'+base64.b64encode((REPORT/file).read_bytes()).decode()+'"></figure>' for label,file in [('V0.11',before),('V0.12',after)]]
 cards.append('<section><h2>'+title+'</h2><div>'+''.join(imgs)+'</div></section>')
review='<!doctype html><html lang="zh"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>侠盗自由城 V0.12 实拍对比</title><style>body{margin:18px;background:#f1ecdd;color:#315a50;font:16px system-ui}main{max-width:1100px;margin:auto}section{margin:28px 0}section div{display:flex;gap:10px}figure{margin:0;width:calc(50% - 5px)}img{width:100%;max-height:650px;object-fit:contain;background:#e4ebe1;border-radius:10px}figcaption{padding:5px}</style><main><h1>侠盗自由城 V0.12</h1><p>左 V0.11，右 V0.12，原始游戏截图。第一组按相同路段索引、相机局部偏移和焦距拍摄；因地图半径改变，绝对相机矩阵不同。其余街景显示各版本真实快速前往落点；海湾入口在新版移至木步道。</p><p>本次缩小地图、收窄街道并保留远景立面，补充木庭院和成组植被。实体安卓帧率未验证。</p>'+''.join(cards)+'</main></html>'
for directory in [OUT,DOWNLOADS]:(directory/'outlaw-liberty-city-v0.12-review.html').write_text(review)
record={'name':name,'bytes':len(data),'sha256':sha,'independent_rebuild':'byte identical','logic_checks':logic['passed'],'endurance_seconds':json.loads((REPORT/'endurance.json').read_text())['actual_seconds'],'platform_upload':'H5 candidate only; actual upload entry/docs pending'}
for directory in [REPORT,OUT,DOWNLOADS]:(directory/'outlaw-liberty-city-v0.12-checksums.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(record,ensure_ascii=False))
