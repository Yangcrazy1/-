"""Start/reuse a local H5 server; never stop an unrelated process."""
from pathlib import Path
import argparse,os,signal,subprocess,sys,time,urllib.request
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=8090);parser.add_argument('--stop',action='store_true');args=parser.parse_args()
state=Path('/workspace/.cloud-setup');(state/'logs').mkdir(parents=True,exist_ok=True);pidfile=state/f'h5-{args.port}.pid'
if args.stop:
 if pidfile.exists():
  pid=int(pidfile.read_text());cmd=Path(f'/proc/{pid}/cmdline')
  if cmd.exists() and b'http.server' in cmd.read_bytes() and str(ROOT/'dist').encode() in cmd.read_bytes():os.kill(pid,signal.SIGTERM)
  pidfile.unlink()
 print('Stopped the helper-owned server, if present.');raise SystemExit(0)
def ready():
 try:
  with urllib.request.urlopen(f'http://127.0.0.1:{args.port}/',timeout=2) as response:return response.status==200 and b'__POCKET_LOAD8__' in response.read()
 except Exception:return False
if ready():print(f'H5 server is ready on port {args.port}.');raise SystemExit(0)
with (state/'logs'/f'h5-{args.port}.log').open('ab') as logfile:
 process=subprocess.Popen([sys.executable,'-m','http.server',str(args.port),'--bind','127.0.0.1','--directory',str(ROOT/'dist')],cwd=ROOT,stdout=logfile,stderr=logfile,start_new_session=True)
for attempt in range(40):
 if process.poll() is not None:raise SystemExit(f'Server exited: inspect {state}/logs/h5-{args.port}.log')
 if ready():pidfile.write_text(str(process.pid));print(f'H5 server ready; PID {process.pid}, port {args.port}.');break
 time.sleep(.1)
else:raise SystemExit('Server did not become ready.')
