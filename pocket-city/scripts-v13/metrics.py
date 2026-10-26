"""Publish measured cloud evidence with an explicit physical-device boundary."""
import json,hashlib
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'reports/v13';targets=[('Single HTML',OUT/'endurance.json'),('MiniTool CSP + SDK mock',ROOT/'reports/xhs-v013/endurance.json')]
fig,axes=plt.subplots(3,1,figsize=(11,8));rows=[]
for label,path in targets:
 r=json.loads(path.read_text());samples=r['samples'];t=[x['elapsed_seconds'] for x in samples];axes[0].plot(t,[x['render']['calls'] for x in samples],label=label);axes[1].plot(t,[x['memory']['geometries'] for x in samples],label=label);axes[2].plot(t,[(x.get('heap') or 0)/1048576 for x in samples],label=label)
 rows.append({'build':label,'seconds':r['actual_seconds'],'phases':[{k:p[k] for k in ['mode','average_fps','p95_render_interval_ms','frames']} for p in r['phases']],'begin_memory':samples[0]['memory'],'end_memory':samples[-1]['memory'],'max_draw_calls':max(x['render']['calls'] for x in samples),'max_triangles':max(x['render']['triangles'] for x in samples),'base_sha256':r.get('html_sha256',r.get('base_sha256'))})
for ax,label in zip(axes,['Draw calls / rendered frame','Retained geometry resources','JS heap (MiB; varies with GC)']):ax.set_ylabel(label);ax.grid(alpha=.2);ax.legend(loc='upper left')
axes[2].set_xlabel('Elapsed wall time (seconds)');fig.suptitle('V0.13 - Linux Chromium / SwiftShader cloud measurements\nNOT an Android 30 FPS acceptance result; MiniTool SDK is mocked');fig.tight_layout();fig.savefig(OUT/'cloud-metrics.png',dpi=150);fig.savefig(OUT/'cloud-metrics.svg');plt.close(fig)
(OUT/'metrics-summary.json').write_text(json.dumps(rows,indent=2)+'\n')
lines=['# V0.13 final cloud evidence','','Linux Chromium / WebGL / SwiftShader, shared CPU. No physical Android / iPhone / Xiaohongshu-container acceptance.','', '| Build | Mode | Seconds in complete run | Mean FPS | P95 rendered interval (ms) |','| --- | --- | --- | --- | --- |']
for row in rows:
 for phase in row['phases']:lines.append(f"| {row['build']} | {phase['mode']} | {row['seconds']:.2f} | {phase['average_fps']:.2f} | {phase['p95_render_interval_ms']:.2f} |")
lines+=['','Per-phase begin/end and sampled draws, triangles, geometries, textures and heap are in the corresponding endurance.json. Entering a new mode retains a test vehicle and visits new views; resource cache growth is recorded, not presented as a leak-free proof.','', 'The single-HTML and MiniTool runs are sequential. Different default quality and role mean the FPS values are not a controlled comparison of package formats.','', 'Base HTML SHA-256: `'+hashlib.sha256((ROOT/'dist/index.html').read_bytes()).hexdigest()+'`.']
(OUT/'SUMMARY.md').write_text('\n'.join(lines)+'\n');print(json.dumps(rows,indent=2))
