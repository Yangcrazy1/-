"""Package only a build that matches its successful browser/logic reports."""
import argparse,hashlib,json,shutil,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--output',type=Path,default=ROOT/'deliveries');args=parser.parse_args();out=args.output;out.mkdir(parents=True,exist_ok=True)
html=ROOT/'dist/index.html';digest=hashlib.sha256(html.read_bytes()).hexdigest();browser=json.loads((ROOT/'reports/v09/browser-smoke.json').read_text());logic=json.loads((ROOT/'verification-v9.json').read_text())
assert browser['html_sha256']==digest,'Browser report does not match current HTML'
assert not browser['pageErrors'] and not browser['offline_file']['networkRequests']
assert logic['passed']==70 and html.stat().st_size<10_000_000
report={'version':'0.9.0','kind':'mobile H5 playtest','html_bytes':html.stat().st_size,'html_sha256':digest,'regression_checks':logic['passed'],'rendered_motion':browser['rendered_motion'],'native_fleet_swipe':browser['native_fleet_swipe'],'browser_errors':browser['pageErrors'],'offline_network_requests':browser['offline_file']['networkRequests'],'limitations':['Cloud Chromium uses SwiftShader; no physical phone FPS validation.','Cloud policy blocks file navigation; the same HTML was run from memory with network disabled.','Download success on the user phone is unconfirmed.','Casino is an exterior landmark; no platform upload or review was performed.']}
(ROOT/'reports/v09/build-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
mobile=out/'pocket-city-v0.9-mobile.html';shutil.copyfile(html,mobile)
with zipfile.ZipFile(out/'pocket-city-v0.9-mobile.zip','w',zipfile.ZIP_DEFLATED,9) as z:
 z.write(html,'index.html');z.write(ROOT/'README_V09.md','README.txt');z.write(ROOT/'reports/v09/build-report.json','test-report.json')
source=out/'pocket-city-v0.9-source.zip'
with zipfile.ZipFile(source,'w',zipfile.ZIP_DEFLATED,9) as z:
 for p in sorted(ROOT.rglob('*')):
  if not p.is_file():continue
  rel=p.relative_to(ROOT)
  if any(part in {'.git','node_modules','__pycache__','deliveries'} for part in rel.parts):continue
  if p.suffix in {'.pyc','.log'} or p.name.startswith('inspect-') or p.name=='browser-partial.json':continue
  if p.name.startswith('UAL') and p.suffix=='.glb':continue
  z.write(p,Path('pocket-city-v0.9')/rel)
for p in [out/'pocket-city-v0.9-mobile.zip',source]:
 with zipfile.ZipFile(p) as z:
  assert z.testzip() is None
  data=z.read('index.html' if p.name.endswith('mobile.zip') else 'pocket-city-v0.9/dist/index.html')
  assert hashlib.sha256(data).hexdigest()==digest
for p in [mobile,out/'pocket-city-v0.9-mobile.zip',source]:p.chmod(0o644)
(out/'pocket-city-v0.9-checksums.json').write_text(json.dumps({p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [mobile,out/'pocket-city-v0.9-mobile.zip',source]},indent=2)+'\n')
print(json.dumps({'files':[{ 'name':p.name,'bytes':p.stat().st_size} for p in [mobile,out/'pocket-city-v0.9-mobile.zip',source]],'checks':logic['passed'],'html_sha256':digest},ensure_ascii=False))
