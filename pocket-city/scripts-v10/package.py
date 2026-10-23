"""Reproducible, tested mobile and source packages with stable English names."""
import argparse,base64,hashlib,json,shutil,subprocess,tempfile,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--output',type=Path,default=ROOT/'deliveries');args=parser.parse_args();out=args.output;out.mkdir(parents=True,exist_ok=True)
html=ROOT/'dist/index.html';data=html.read_bytes();sha=hashlib.sha256(data).hexdigest()
logic=json.loads((ROOT/'verification-v10.json').read_text());smoke=json.loads((ROOT/'reports/v10/browser-smoke.json').read_text());accept=json.loads((ROOT/'reports/v10/acceptance.json').read_text());endurance=json.loads((ROOT/'reports/v10/endurance.json').read_text())
assert logic['passed']==81 and len(data)<10_000_000
for report in [smoke,accept,endurance]:assert report['html_sha256']==sha and not report['pageErrors']
assert not accept['consoleErrors'] and not endurance['consoleErrors'] and endurance['actual_seconds']>=600
assert not smoke['offline_file']['networkRequests'] and accept['traffic_20']=={'stopped':20,'passed':20}
# Rebuild from the actual source independently of the checked-in generated bundles.
with tempfile.TemporaryDirectory(prefix='pocket-v010-rebuild-',dir='/tmp') as folder:
 target=Path(folder)
 for name in ['src-v7','src-v8','src-v9','src-v10','scripts-v7','scripts-v9','scripts-v10','assets']:
  shutil.copytree(ROOT/name,target/name,ignore=shutil.ignore_patterns('__pycache__','*.pyc'))
 for name in ['three.min.js','software-renderer-v5.js']:shutil.copyfile(ROOT/name,target/name)
 (target/'dist').mkdir();subprocess.run(['python3',str(target/'scripts-v7/build.py')],check=True,capture_output=True)
 assert hashlib.sha256((target/'dist/index.html').read_bytes()).hexdigest()==sha,'Source rebuild differs from tested file'
def git(*args):return subprocess.check_output(['git',*args],cwd=ROOT,text=True).strip()
source_commit=git('rev-parse','HEAD');branch=git('branch','--show-current')
before=ROOT/'reports/v10/baseline/bay-before.png';after=ROOT/'reports/v10/bay-after.png'
image=lambda p:'data:image/png;base64,'+base64.b64encode(p.read_bytes()).decode()
comparison='''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fresh Bay V0.10 / Before and After</title><style>body{margin:0;background:#f2eddf;color:#365b4f;font:16px/1.7 system-ui;padding:20px}main{max-width:1300px;margin:auto}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}img{display:block;width:100%;border-radius:14px}h1{font-size:24px}p{font-size:13px}@media(max-width:750px){.grid{grid-template-columns:1fr}}</style><main><h1>清新海湾 / 同机位前后</h1><p>相同镜头位置、四元数、FOV 和 844×390 视口；V0.9 当前工作区基线与 V0.10，云端 WebGL 截图。树木、道具、海岸与 UI 是本轮实际游戏画面，未用概念图替代。</p><div class="grid"><section><b>BEFORE / V0.9</b><img src="'''+image(before)+'''"></section><section><b>AFTER / V0.10</b><img src="'''+image(after)+'''"></section></div></main></html>'''
(ROOT/'reports/v10/before-after.html').write_text(comparison)
summary={'version':'0.10.0','reference_session':'01a16708-2512-71fc-94bc-1e85de06a0a9','repository':'Yangcrazy1/-','source_commit':source_commit,'branch':branch,'html_sha256':sha,'html_bytes':len(data),'source_rebuild_identical':True,'logic_checks':logic['passed'],'same_camera':accept['same_camera_after']['camera']==json.loads((ROOT/'reports/v10/baseline/camera.json').read_text())['camera'],'water_pixel_change':accept['water_pixels'],'control_layouts':len(accept['control_layouts']),'traffic_20':accept['traffic_20'],'preview_resources':accept['preview_resource_recycling'],'endurance_seconds':endurance['actual_seconds'],'endurance_phases':[{k:p[k] for k in ['mode','actual_seconds','frames','average_fps','p95_render_interval_ms']} for p in endurance['phases']],'gpu_note':endurance['environment'],'phone_validation':'Not performed; no physical Android/iPhone available','platform_upload':'Not performed; offline H5 playtest only'}
(ROOT/'reports/v10/build-report.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
mobile=out/'pocket-city-v0.10-mobile.html';shutil.copyfile(html,mobile)
play=out/'pocket-city-v0.10-mobile.zip'
with zipfile.ZipFile(play,'w',zipfile.ZIP_DEFLATED,9) as z:
 for path,name in [(html,'index.html'),(ROOT/'README_V10.md','README.txt'),(ROOT/'ACCEPTANCE_V10.md','acceptance.md'),(ROOT/'src-v10/config.json','materials-traffic-config.json'),(ROOT/'reports/v10/before-after.html','before-after.html'),(ROOT/'reports/v10/build-report.json','test-report.json'),(ROOT/'assets/THREE-LICENSE.txt','licenses/THREE-MIT.txt'),(ROOT/'assets/source/QUATERNIUS-LICENSE.txt','licenses/QUATERNIUS-CC0.txt')]:z.write(path,name)
source=out/'pocket-city-v0.10-source.zip'
with zipfile.ZipFile(source,'w',zipfile.ZIP_DEFLATED,9) as z:
 for p in sorted(ROOT.rglob('*')):
  if not p.is_file():continue
  rel=p.relative_to(ROOT)
  if any(part in {'.git','node_modules','__pycache__','deliveries'} for part in rel.parts):continue
  if p.suffix in {'.pyc','.log'} or p.name.startswith('inspect-') or p.name in {'browser-partial.json','endurance-progress.json'}:continue
  if p.name.startswith('UAL') and p.suffix=='.glb':continue
  z.write(p,Path('pocket-city-v0.10')/rel)
for path,member in [(play,'index.html'),(source,'pocket-city-v0.10/dist/index.html')]:
 with zipfile.ZipFile(path) as z:assert z.testzip() is None and hashlib.sha256(z.read(member)).hexdigest()==sha
for p in [mobile,play,source]:p.chmod(0o644)
checks={p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [mobile,play,source]}
(out/'pocket-city-v0.10-checksums.json').write_text(json.dumps(checks,indent=2)+'\n')
print(json.dumps({'checks':logic['passed'],'source_rebuild':True,'endurance_seconds':endurance['actual_seconds'],'files':checks},ensure_ascii=False))
