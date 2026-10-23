import json,hashlib
from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
import os
os.environ.setdefault('MPLCONFIGDIR','/tmp/pocket-v010-mpl')
os.environ.setdefault('XDG_CACHE_HOME','/tmp/pocket-v010-cache')
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'reports/v10'
r=json.loads((OUT/'endurance.json').read_text());assert r['html_sha256']==hashlib.sha256((ROOT/'dist/index.html').read_bytes()).hexdigest()
samples=r['samples'];minutes=[x['elapsed_seconds']/60 for x in samples]
plt.rcParams.update({'font.size':10,'axes.spines.top':False,'axes.spines.right':False,'figure.facecolor':'#f6f1e5','axes.facecolor':'#fbf8ef'})
fig,axes=plt.subplots(3,1,figsize=(10,8),sharex=True,layout='constrained')
axes[0].plot(minutes,[x['render']['calls'] for x in samples],color='#477e72',label='Draw calls');axes[0].set_ylabel('Draw calls');axes[0].grid(alpha=.15)
axes[1].plot(minutes,[x['memory']['geometries'] for x in samples],color='#bb805c',label='Geometries');axes[1].plot(minutes,[x['memory']['textures'] for x in samples],color='#4d93a7',label='Textures');axes[1].set_ylabel('Resource count');axes[1].legend();axes[1].grid(alpha=.15)
axes[2].plot(minutes,[(x['heap'] or 0)/1e6 for x in samples],color='#868c68');axes[2].set_ylabel('Reported JS heap / MB');axes[2].set_xlabel('Elapsed wall-clock minutes');axes[2].grid(alpha=.15)
for ax in axes:
 for start,end,label in [(0,3,'Walk'),(3,6,'Drive'),(6,8,'Helicopter'),(8,10,'Fighter')]:
  ax.axvspan(start,end,color='#b5cdb5',alpha=.09 if start%2 else .18)
  if ax is axes[0]:ax.text((start+end)/2,1.02,label,transform=ax.get_xaxis_transform(),ha='center',fontsize=9)
fig.suptitle('V0.10 — 10-minute cloud WebGL endurance\nSwiftShader / shared CPU: not an Android FPS benchmark',fontsize=12)
fig.savefig(OUT/'endurance-chart.png',dpi=150);fig.savefig(OUT/'endurance-chart.svg');plt.close(fig)
lines=['# V0.10 实测摘要','',f'记录时间：{datetime.now(ZoneInfo("Asia/Shanghai")).isoformat(timespec="seconds")}。','',f'HTML SHA-256：`{r["html_sha256"]}`。',f'真实墙钟持续运行：{r["actual_seconds"]:.2f} 秒。脚本／Shader 错误：{len(r["pageErrors"])+len(r["consoleErrors"])}。','','下表是云端 Chromium / SwiftShader 结果，不能用于声称安卓达到 30 FPS。','','| 阶段 | 秒 | 平均 FPS | P95 渲染帧间隔 ms | 几何 begin→end | 纹理 begin→end |','| --- | ---: | ---: | ---: | --- | --- |']
for p in r['phases']:
 a,b=p['begin']['memory'],p['end']['memory'];lines.append(f'| {p["mode"]} | {p["actual_seconds"]:.2f} | {p["average_fps"]:.2f} | {p["p95_render_interval_ms"]:.2f} | {a["geometries"]} → {b["geometries"]} | {a["textures"]} → {b["textures"]} |')
lines+=['','绘制／三角形范围：'+f'{min(x["render"]["calls"] for x in samples)}–{max(x["render"]["calls"] for x in samples)} calls，{min(x["render"]["triangles"] for x in samples)}–{max(x["render"]["triangles"] for x in samples)} triangles。','', '资源数随首次漫游加载新区、人物骨骼与测试车辆增加，当前保留这些有限的场景缓存，不能说成“全程零增长”。JS 堆采用浏览器报告值，可能被量化；它不是 GPU 字节或整个浏览器进程内存。','', '81 项逻辑回归、WebGL 离线／滑动／人车运动、20 次信控车辆通行、20 次行人保护过街、9 组触控布局、三指取消、特效池回收、模型预览资源回收和同机位水面像素变化均有独立报告。','', '仍需实体安卓进行 30 FPS 目标、10 分钟温升和本地文件打开验证；当前没有手机设备。']
(OUT/'SUMMARY.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({'seconds':r['actual_seconds'],'fps':{p['mode']:round(p['average_fps'],2) for p in r['phases']},'errors':r['pageErrors'],'chart':'reports/v10/endurance-chart.png'},ensure_ascii=False))
