"""Deterministic MiniTool ZIP, matched evidence, independent build and CRC."""
from pathlib import Path
import json,hashlib,subprocess,zipfile,io
BASE=Path(__file__).resolve().parent;ROOT=BASE.parents[1];DIST=BASE/'dist';REPORT=ROOT/'reports/xhs-v013';DOWNLOADS=ROOT.parent/'downloads';OUTPUT=Path('/workspace/outputs')
manifest_bytes=(REPORT/'build.json').read_bytes();manifest=json.loads(manifest_bytes);msha=hashlib.sha256(manifest_bytes).hexdigest();base=hashlib.sha256((ROOT/'dist/index.html').read_bytes()).hexdigest();assert manifest['base_sha256']==base
for name in ['bridge-tests','browser','endurance']:
 r=json.loads((REPORT/(name+'.json')).read_text());assert r['manifest_sha256']==msha,(name,'wrong build');assert not r.get('pageErrors') and not r.get('consoleErrors') and not r.get('external_requests') and not r.get('csp_violations'),name
 if name=='endurance':assert r['actual_seconds']>=600
 if name=='bridge-tests':assert r['bridge_checks']==12 and r['es2017_scripts']==4
r=json.loads((REPORT/'static-audit.json').read_text());assert not r['errors'] and not r['warnings'] and not r['proven_packed_geometry_false_positives']
for name,record in manifest['files'].items():
 data=(DIST/name).read_bytes();assert len(data)==record['bytes'] and hashlib.sha256(data).hexdigest()==record['sha256']
# A second build must reproduce the manifest and every file exactly.
subprocess.run(['python3','build.py'],cwd=BASE,check=True,capture_output=True);assert (REPORT/'build.json').read_bytes()==manifest_bytes,'Platform rebuild differed'
allowed={'.html','.css','.js','.json','.png','.jpg','.jpeg','.webp','.svg','.gif','.woff','.woff2'}
files=sorted(p for p in DIST.rglob('*') if p.is_file());assert sum(p.suffix=='.html' for p in files)==1 and (DIST/'index.html').exists();assert set(p.relative_to(DIST).as_posix() for p in files)==set(manifest['files'])
assert all(p.suffix in allowed and not any(x.startswith('.') for x in p.relative_to(DIST).parts) for p in files)
buf=io.BytesIO()
with zipfile.ZipFile(buf,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in files:
  info=zipfile.ZipInfo(p.relative_to(DIST).as_posix(),(2026,10,26,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16;z.writestr(info,p.read_bytes())
data=buf.getvalue();assert len(data)<10*1024*1024
with zipfile.ZipFile(io.BytesIO(data)) as z:assert z.testzip() is None
name='outlaw-liberty-city-v0.13-xhs-minitool.zip'
for target in [DOWNLOADS,OUTPUT]:target.mkdir(exist_ok=True);(target/name).write_bytes(data)
record={'title':'侠盗自由城','filename':name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'manifest_sha256':msha,'base_html_sha256':base,'root':'index.html + assets/','files':len(files),'uncompressed_bytes':sum(p.stat().st_size for p in files),'crc':'pass','rebuild':'byte identical','entry':'https://creator.xiaohongshu.com/new/red-app','local_csp_and_mock_sdk_tested':True,'actual_xhs_container_tested':False,'uploaded':False,'review_approved':False}
for target in [REPORT,DOWNLOADS,OUTPUT]:(target/'outlaw-liberty-city-v0.13-xhs-checksums.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(record,ensure_ascii=False))
