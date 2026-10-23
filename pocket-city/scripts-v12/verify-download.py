"""Fetch published HTML over HTTPS and compare exact bytes, without logging bodies."""
import datetime,hashlib,json,sys,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];DOWNLOADS=ROOT.parent/'downloads';commit=sys.argv[1];results=[]
for name in ['outlaw-liberty-city-v0.12-mobile.html','outlaw-liberty-city-v0.12-review.html']:
 data=(DOWNLOADS/name).read_bytes();expected=hashlib.sha256(data).hexdigest();urls=[f'https://github.com/Yangcrazy1/-/raw/{commit}/downloads/{name}',f'https://raw.githubusercontent.com/Yangcrazy1/-/{commit}/downloads/{name}'];attempts=[]
 for url in urls:
  try:
   with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'LibertyCity-DownloadCheck/0.12'}),timeout=45) as response:
    body=response.read();r={'url':url,'resolved_url':response.url,'http_status':response.status,'content_type':response.headers.get('Content-Type'),'content_disposition':response.headers.get('Content-Disposition'),'bytes':len(body),'sha256':hashlib.sha256(body).hexdigest()}
   r['verified']=r['http_status']==200 and body==data;attempts.append(r)
  except Exception as e:attempts.append({'url':url,'verified':False,'error':str(e)})
 assert any(a['verified'] for a in attempts),(name,attempts)
 results.append({'filename':name,'expected_sha256':expected,'attempts':attempts})
report={'commit':commit,'retrieved_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'files':results}
(DOWNLOADS/'outlaw-liberty-city-v0.12-download-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
