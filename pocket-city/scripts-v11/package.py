"""Validate final evidence and export only the requested standalone H5 (no ZIP)."""
import base64,hashlib,json,shutil,subprocess,tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1];OUT=Path('/workspace/outputs');DOWNLOADS=ROOT.parent/'downloads';REPORT=ROOT/'reports/v11'
data=(ROOT/'dist/index.html').read_bytes();sha=hashlib.sha256(data).hexdigest()
assert len(data)<10_000_000 and '侠盗自由城' in data.decode()
assert b'__VISUAL11__' not in data and b'__BAY_QA10__' not in data
logic=json.loads((ROOT/'verification-v11.json').read_text());assert logic['passed']==89
for name in ['browser-smoke','acceptance','endurance']:
 report=json.loads((REPORT/(name+'.json')).read_text());assert report['html_sha256']==sha,(name,'wrong HTML')
 assert not report.get('pageErrors') and not report.get('consoleErrors'),name
 if name=='endurance':assert report['actual_seconds']>=600
visual=json.loads((REPORT/'visual.json').read_text());assert visual['v011']['sha256']==sha and not visual['errors']

# Verify that the handoff can rebuild independently of generated bundles/caches.
with tempfile.TemporaryDirectory(prefix='liberty-v11-') as tmp:
 stage=Path(tmp)/'source'
 shutil.copytree(ROOT,stage,ignore=shutil.ignore_patterns('node_modules','reports','platform','dist','game-v*.js','verification-*.json','__pycache__','*.pyc'))
 (stage/'dist').mkdir();subprocess.run(['python3','scripts-v7/build.py'],cwd=stage,check=True,capture_output=True)
 assert (stage/'dist/index.html').read_bytes()==data,'Independent build differed'

OUT.mkdir(exist_ok=True);DOWNLOADS.mkdir(exist_ok=True)
name='outlaw-liberty-city-v0.11-mobile.html'
for directory in [OUT,DOWNLOADS]: (directory/name).write_bytes(data)
candidate=ROOT/'platform/h5-candidate';(candidate/'index.html').write_bytes(data)
metadata=json.loads((candidate/'upload-status.json').read_text());metadata.update(bytes=len(data),sha256=sha,uploadReady=False)
(candidate/'upload-status.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n')

cards=[]
for title,before,after in [('CJ','v010-role-0-front.png','v011-role-0-front.png'),('Tommy','v010-role-1-front.png','v011-role-1-front.png'),('Michael','v010-role-2-front.png','v011-role-2-front.png'),('Street / district 0','v010-street-0.png','v011-street-0.png'),('Street / district 1','v010-street-1.png','v011-street-1.png'),('Bay','v010-bay.png','v011-bay.png')]:
 imgs=['<img alt="'+label+'" src="data:image/png;base64,'+base64.b64encode((REPORT/file).read_bytes()).decode()+'">' for label,file in [('V0.10',before),('V0.11',after)]]
 cards.append('<section><h2>'+title+'</h2><div>'+''.join(imgs)+'</div></section>')
review='<!doctype html><html lang="zh"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>侠盗自由城 V0.11 对比</title><style>body{margin:20px;background:#f1ecdd;color:#315a50;font:16px system-ui}main{max-width:1100px;margin:auto}section{margin:28px 0}section div{display:flex;gap:12px}img{width:calc(50% - 6px);object-fit:contain;max-height:540px;background:#e4ebe1;border-radius:10px}</style><main><h1>侠盗自由城 V0.11</h1><p>左 V0.10，右 V0.11。原始游戏截图，没有修饰。人物使用相同拍摄角度；街道按相同目的地与镜头规则拍摄，地图缩小后绝对相机坐标不同。</p>'+''.join(cards)+'</main></html>'
for directory in [OUT,DOWNLOADS]:(directory/'outlaw-liberty-city-v0.11-review.html').write_text(review)
record={'name':name,'bytes':len(data),'sha256':sha,'independent_rebuild':'byte identical','logic_checks':logic['passed'],'endurance_seconds':json.loads((REPORT/'endurance.json').read_text())['actual_seconds'],'platform_upload':'awaiting actual Xiaohongshu upload entry/docs; H5 candidate only'}
for directory in [REPORT,OUT,DOWNLOADS]:(directory/'outlaw-liberty-city-v0.11-checksums.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(record,ensure_ascii=False))
