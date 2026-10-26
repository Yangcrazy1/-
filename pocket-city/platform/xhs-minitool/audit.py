"""Run upstream checks, classifying only proven packed-rig URL false positives."""
import importlib.util,re,json,hashlib,base64
from pathlib import Path
BASE=Path(__file__).resolve().parent;ROOT=BASE.parents[1];OUT=ROOT/'reports/xhs-v013'
spec=importlib.util.spec_from_file_location('upstream',BASE/'tools/validate_xhs_tool.py');mod=importlib.util.module_from_spec(spec)
import sys;sys.modules[spec.name]=mod;spec.loader.exec_module(mod)
rig=json.loads((ROOT/'assets/rig-v7.json').read_text());encoded=[]
def collect(x):
 if isinstance(x,dict):
  for value in x.values():collect(value)
 elif isinstance(x,list):
  for value in x:collect(value)
 elif isinstance(x,str) and len(x)>=4 and len(x)%4==0 and re.fullmatch(r'[A-Za-z0-9+/]+={0,2}',x):
  base64.b64decode(x,validate=True);encoded.append(x)
collect(rig)
r=mod.validate(BASE/'dist');errors=[];warnings=[];false=[]
for f in r.findings:
 value=re.search(r'检测到外部 URL：(.+)。所有资源和数据必须本地打包。',f.message)
 if f.code=='EXTERNAL_URL' and value and value.group(1).startswith('//') and re.fullmatch(r'[A-Za-z0-9+/]+=*',value.group(1)) and any(value.group(1) in x for x in encoded):
  false.append({'path':f.path,'line':f.line,'kind':'packed Quaternius geometry/animation base64, not a URL','substring_sha256':hashlib.sha256(value.group(1).encode()).hexdigest()});continue
 target=errors if f.severity=='ERROR' else warnings
 target.append({'path':f.path,'line':f.line,'code':f.code,'message':f.message[:220]})
record={'upstream':'wenyuanw/xhs-minitool@1e526cba484819a1196196fd542979d53f9b5a55','errors':errors,'warnings':warnings,'proven_packed_geometry_false_positives':false,'network_rules_unchanged':True}
(OUT/'static-audit.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'errors':errors,'warnings':warnings,'packed_data_false_positives':len(false)},ensure_ascii=False));assert not errors
