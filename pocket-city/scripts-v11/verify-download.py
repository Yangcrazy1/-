"""Retrieve the published HTML over HTTPS and compare actual bytes."""
import hashlib,json,subprocess,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];data=(ROOT/'dist/index.html').read_bytes()
commit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
base=f'https://github.com/Yangcrazy1/-/raw/{commit}/downloads/outlaw-liberty-city-v0.11-mobile.html'
out=[]
for suffix in ['', '?download=1']:
 url=base+suffix
 with urllib.request.urlopen(url,timeout=45) as r:
  downloaded=r.read();record={'url':url,'final_url':r.geturl(),'status':r.status,'bytes':len(downloaded),'sha256':hashlib.sha256(downloaded).hexdigest(),'content_type':r.headers.get('Content-Type'),'content_disposition':r.headers.get('Content-Disposition')}
 assert r.status==200 and downloaded==data,record;out.append(record)
result={'commit':commit,'files':out,'verified':True,'phone_file_open':'not verified on physical handset'}
for parent in [ROOT/'reports/v11',ROOT.parent/'downloads',Path('/workspace/outputs')]:
 (parent/'outlaw-liberty-city-v0.11-download-verification.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
