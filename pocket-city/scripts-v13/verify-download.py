"""Verify published HTTPS bytes of HTML, review and MiniTool ZIP; no body logging."""
import datetime,hashlib,json,re,sys,urllib.request,concurrent.futures
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];DOWNLOADS=ROOT.parent/'downloads';commit=sys.argv[1];assert re.fullmatch('[0-9a-f]{40}',commit)
names=['outlaw-liberty-city-v0.13-mobile.html','outlaw-liberty-city-v0.13-review.html','outlaw-liberty-city-v0.13-xhs-minitool.zip']
def fetch(task):
 name,url=task;expected=(DOWNLOADS/name).read_bytes()
 try:
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'LibertyCity-DownloadCheck/0.13'}),timeout=45) as response:
   body=response.read();r={'url':url,'resolved_url':response.url,'http_status':response.status,'content_type':response.headers.get('Content-Type'),'content_disposition':response.headers.get('Content-Disposition'),'bytes':len(body),'sha256':hashlib.sha256(body).hexdigest()}
  r['verified']=r['http_status']==200 and body==expected
 except Exception as e:r={'url':url,'verified':False,'error':str(e)}
 return name,r
jobs=[(name,url) for name in names for url in [f'https://github.com/Yangcrazy1/-/raw/{commit}/downloads/{name}',f'https://raw.githubusercontent.com/Yangcrazy1/-/{commit}/downloads/{name}']]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:responses=list(pool.map(fetch,jobs))
results=[]
for name in names:
 attempts=[r for n,r in responses if n==name];assert any(x['verified'] for x in attempts),(name,attempts);results.append({'filename':name,'expected_sha256':hashlib.sha256((DOWNLOADS/name).read_bytes()).hexdigest(),'attempts':attempts})
report={'commit':commit,'retrieved_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'files':results}
for target in [DOWNLOADS,ROOT/'reports/v13']:(target/'outlaw-liberty-city-v0.13-download-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
