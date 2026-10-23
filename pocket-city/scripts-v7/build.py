from pathlib import Path
import base64,re,json
P=Path(__file__).resolve().parents[1]
exec((P/'scripts-v9/decorate.py').read_text())
exec((P/'scripts-v10/decorate.py').read_text())
s=(P/'src-v7/runtime-v6-checkpoint.js').read_text()
def rename(name):
    global s
    k=s.rfind('function '+name+'(');assert k>=0,name
    s=s[:k]+s[k:].replace('function '+name+'(','function '+name+'V6(',1)
for f in ['makeCharacter','animateHuman','humanLOD','fastTravel','makeBuilding','makeWorld','updatePeds','startGame','adjustResolution','refreshOneHandHUD','bindControls','staticBatch','capsuleContact','updatePlayer','updateCamera','makeCar','summonVehicle','integrateVehicle','textMaterial','makeStreetNetwork','canBuildHere','makeDistrictLandmarks','makeRoads','groundTexture','moveWithCollision','openMenu','renderInGameModel','place','advanceRoad','quickRoadAdvance','updateGroundPeds','attack']:rename(f)
for name in ['staticBatch','capsuleContact','updatePlayer','updateCamera','makeCar','summonVehicle','integrateVehicle','textMaterial','makeStreetNetwork','canBuildHere','makeDistrictLandmarks','makeRoads','groundTexture','moveWithCollision','openMenu','renderInGameModel']:s=s.replace('function '+name+'V6(', 'function '+name+'V7(')
for name in ['place','advanceRoad','quickRoadAdvance','updateGroundPeds','attack']:s=s.replace('function '+name+'V6(', 'function '+name+'V9(')
s=s.replace('R=154','R='+str(json.loads((P/'src-v11/config.json').read_text())['worldRadius']))
s=s.replace('0.6.0','0.11.0').replace('Mobile v0.6','Mobile v0.7')
s=s.replace('All meshes, textures and sounds below are authored procedurally for this demo.','Humanoid topology/animations: Quaternius, CC0. Clothing texture: generated for this game. Other world assets are procedural.')
s=s.replace('antialias:!coarse','antialias:!coarse').replace('coarse?1.25:1.5','coarse?1.5:1.65')
s=s.replace('const seconds=now/1000,raw=', 'const frameWorkStart7=performance.now();const seconds=now/1000,raw=')
s=s.replace('updateCombat(dt);}', 'updateCombat(dt);updateSolar7(Math.min(raw,2));}')
s=s.replace('updateCamera(dt);uiTick+=dt;', 'if(running)updatePilot10(0);updateCamera(dt);updateOcean10(0);updateSolar7(0);uiTick+=dt;')
s=s.replace('adjustResolution(dt,raw*1000);','adjustResolution(dt,performance.now()-frameWorkStart7);')
s=s.replace('h=[3.4,3.7,3.3,6.7,5.9,4.8,4.0][kind]+rng()*.6','h=[3.6,4.3,5.2,10.5,7.6,6.2,4.8][kind]+rng()*1.4')
s=s.replace('h=[8.4,6.1,3.6,9.5,4.3,11.6,4.0][kind]+rng()*.8','h=[13.4,9.1,4.6,15.5,6.3,17.6,5.0][kind]+rng()*1.2')
s=s.replace('h=[15.5,9.6,7.3,5.8,4.5,7.5,3.5][kind]+rng()*2','h=[24.5,16.6,12.3,7.8,6.5,11.5,5.5][kind]+rng()*3')
# Shared toon facade materials keep the city coherent and preserve batching.
s=s.replace('const m=new THREE.MeshStandardMaterial({map:t,roughness:.91});','const m=new THREE.MeshToonMaterial({map:t});')
# Real solar colors, a small solar disk and procedural sparse night stars.
s=s.replace('horizon:{value:new THREE.Color(0xe0e4cf)}','horizon:{value:new THREE.Color(0xe0e4cf)},sunDir:{value:V(0,1,0)},night:{value:0}')
s=s.replace('uniform vec3 horizon;varying vec3 dir;', 'uniform vec3 horizon;uniform vec3 sunDir;uniform float night;varying vec3 dir;')
s=s.replace('gl_FragColor=vec4(pow(col,vec3(.4545)),1.);','vec3 nd=normalize(dir);float disk=smoothstep(.9993,.9998,dot(nd,sunDir));col=mix(col,vec3(1.,.78,.39),disk*(1.-night));vec3 cell=floor(nd*500.);float star=step(.9985,fract(sin(dot(cell,vec3(12.989,78.233,34.177)))*43758.5453))*night*step(.1,h);col+=vec3(star*.8);float cloudBand=smoothstep(.12,.30,h)*(1.-smoothstep(.55,.78,h));float cloudNoise=sin(dot(nd,vec3(8.,17.,6.)))+.5*sin(dot(nd,vec3(23.,9.,14.)));float cloud=smoothstep(.70,1.18,cloudNoise)*cloudBand*.16*(1.-night);col=mix(col,vec3(.82,.91,.88),cloud);gl_FragColor=vec4(pow(col,vec3(.4545)),1.);')
# More street context in walking view; retain all tested collision constraints.
s=s.replace('activeCar?7.8+rush*2:5.85','activeCar?7.8+rush*2:6.85').replace('activeCar?3.65+rush*.25:3.25','activeCar?3.65+rush*.25:2.80')
data='const CITY_CONFIG11='+json.dumps(json.loads((P/'src-v11/config.json').read_text()),separators=(',',':'))+';\nconst BAY_CONFIG10='+json.dumps(json.loads((P/'src-v10/config.json').read_text()),separators=(',',':'))+';\nconst RIG_DATA_V7='+ (P/'assets/rig-v7.json').read_text()+';\nconst FABRIC_DATA_V7="data:image/jpeg;base64,'+base64.b64encode((P/'assets/tommy-fabric-v7.jpg').read_bytes()).decode()+'";\n'
mods=data+'\n'.join((P/'src-v7'/f).read_text() for f in ['characters.js','world.js','interface.js'])
s=s.replace('function init(){',mods+'\n'+ '\n'.join((P/'src-v8'/f).read_text() for f in ['performance.js','physics-camera.js','vehicles-ui.js'])+'\n'+ '\n'.join((P/'src-v9'/f).read_text() for f in ['geography.js','landmarks.js','art-direction.js','map-ui.js'])+'\n'+ '\n'.join((P/'src-v10'/f).read_text() for f in ['coast-water.js','environment.js','traffic.js','effects.js','characters.js','integration.js'])+'\n'+ '\n'.join((P/'src-v11'/f).read_text() for f in ['compact-city.js','wardrobe.js'])+'\nfunction init(){')
s=s.replace("version:'0.7.0'","version:'0.11.0'")
s=s.replace('bindControls();loadProgress();','bindControls();bindRefinements8();bindEdition9();bindEdition10();loadProgress();')
(P/'game-v7.js').write_text(s)
(P/'game-v8.js').write_text(s)
(P/'game-v9.js').write_text(s)
(P/'game-v10.js').write_text(s)
(P/'game-v11.js').write_text(s)
shell=(P/'src-v7/shell-v6-checkpoint.html').read_text().replace('V0.6','V0.7').replace('v0.6','v0.7').replace('FILE / 0.6','FILE / 0.7')
shell=re.sub(r'<details open><summary>V0\.7 本次更新</summary>.*?</details>','',shell,flags=re.S)
shell=shell.replace('</style>',(P/'src-v7/interface.css').read_text()+'\n'+(P/'src-v8/interface.css').read_text()+'\n'+(P/'src-v9/interface.css').read_text()+'\n</style>')
shell=shell.replace('<button id="qualityBtn"','<button id="timeAdvance7">切换时段：早晨 / 白天 / 夕阳 / 夜晚</button><button id="qualityBtn"')
paths=['M4 3h16v14H8l-4 4Z','M6 3 2 7l3 4 3-2v13h12V9l3 2 3-4-4-4-6 3-4-3Z','M4 8h18v15H4ZM8 8V3h10v5M5 15h16']
util='<div id="solarLabel7">早晨 · 5 分钟 / 天</div><div id="utility7"><button id="utilityMusic7" aria-label="音乐电台"><svg viewBox="0 0 28 28"><path d="M10 4v16a4 4 0 1 1-2-3V6l15-3v15a4 4 0 1 1-2-3V1Z"/></svg></button><button id="utilityClothes7" aria-label="切换服装配色"><svg viewBox="0 0 28 28"><path d="'+paths[1]+'"/></svg></button><button id="utilityItems7" aria-label="随身物品" aria-expanded="false"><svg viewBox="0 0 28 28"><path d="'+paths[2]+'" fill="none" stroke-width="2"/></svg></button><div id="itemDrawer7"><small>POCKET INVENTORY / 物品</small><b>随身武器</b><div class="item-grid7">'
# Copy the eight actual HUD silhouettes into directly selectable inventory slots.
match=re.search(r'const hudWeaponPaths=\[(.*?)\];',s,re.S);assert match
wp=re.findall(r"'([^']+)'",match.group(1));assert len(wp)==8
names=['徒手','棒球棍','手枪','冲锋枪','武士刀','火箭筒','霰弹枪','步枪']
for i,path in enumerate(wp):util+='<button data-item7="'+str(i)+'" aria-label="装备'+names[i]+'" title="'+names[i]+'"><svg viewBox="0 0 64 48"><path d="'+path+'"/></svg></button>'
util+='</div></div></div>'
shell=shell.replace('<div class="toast" id="toast">',util+'<div class="toast" id="toast">')
release='<details open><summary>V0.7 · 漫画城市 / 人体骨骼升级</summary><p>完整 CC0 人体网格与 65 骨骼；站立、走、跑、跳、持枪与近战共用同一人体模型。蓝色花衬衫、白背心、深色西装；卡通服装、发型与随身物品面板。</p><p>修复三城切换后的空街问题；各城区预置人车、近景人口补充；建筑高度层次增加。每次开始为早上 08:00，300 秒一轮白天、夕阳、夜晚、晨曦，暂停菜单和后台停止计时；夜间窗灯与霓虹开启。自动画质优先减少远景负担，分辨率不低于 CSS 像素。</p><p>单人离线 Alpha；包含完整源工程与 Codex 接手说明。实际手机 GPU、热量与上架条件仍需真机验证。角色基础：Quaternius CC0；不包含 GTA 官方模型、商业流行歌曲或平台审批承诺。</p></details>'
shell=shell.replace('<div class="requirements">','<div class="requirements">'+release)
shell=shell.replace('V0.7 · 稳定性与动作升级。','V0.7 · 漫画城市与昼夜。')
shell=shell.replace('场景、人物、车辆、音效和六套原创电台伴奏在本文件中生成，','人体基础与动作使用 Quaternius 的 CC0 资源，经服装分区与骨骼重定向处理；其他场景、车辆、音效和六套原创电台伴奏在本文件中生成，')
(P/'shell-v7.html').write_text(shell)
soft=(P/'software-renderer-v5.js').read_text()
# The browser fallback shares the light cycle but remains a CPU diagnostic path.
soft=soft.replace('const p=t.p,m=t.m,verts=t.vertices;', 'const p=t.p,m=t.m,verts=t.vertices;if(!m.isMeshBasicMaterial)t.shade*=.40+.60*(scene.userData.daylight??1);')
soft=soft.replace("const key=m.uuid+'-'+t.shade;", "const key=m.uuid+'-'+Math.round(t.shade*20);")
# Always fill beneath a texture, including degenerate UV seam triangles.
soft=soft.replace('ctx.closePath();let image=m.map?.image;','ctx.closePath();ctx.fillStyle=(m.color||new THREE.Color(0xddddcc)).clone().multiplyScalar(t.shade).getStyle();if(!m.transparent)ctx.fill();let image=m.map?.image;')
html=shell.replace('<!-- THREE_BUNDLE -->','<script>\n'+(P/'three.min.js').read_text()+'\n</script>').replace('<!-- GAME_BUNDLE -->','<script>\n'+soft+'\n'+s+'\n</script>')
assert len(html.encode())<10_000_000
html=html.replace('V0.7','V0.8').replace('v0.7','v0.8').replace('Mobile v0.7','Mobile v0.8')
html=html.replace('<div class="loading" id="loading"><b>POCKET CITY</b><small>正在构建你的小星球…</small></div>',(P/'src-v8/loading.html').read_text())
html=html.replace('<div class="activity-list fleet-grid">','<p class="fleet-tip8">左右滑动选择 · 点击呼叫到附近 · 走近后上车</p><div class="activity-list fleet-grid">',1)
tank='<button data-vehicle="tank"><span class="activity-icon">TANK</span><div><b>陆行者 · 履带坦克</b><small>重型履带底盘 · 旋转炮塔 · 低速高扭矩</small></div><span>＋</span></button>'
html=html.replace('<button data-vehicle="suv">',tank+'<button data-vehicle="suv">',1)
# Let the browser paint loading UI before evaluating the embedded engine and world.
scripts=re.findall(r'<script>([\s\S]*?)</script>',html)
assert len(scripts)==2,len(scripts)
for i,code in enumerate(scripts):html=html.replace('<script>'+code+'</script>','<script type="text/pocket-source" id="bundle8-'+str(i)+'">'+code+'</script>',1)
html=html.replace('<div class="requirements">','<div class="requirements"><details open><summary>V0.8 · 加载 / 行走 / 载具</summary><p>新增分阶段加载页、城市图集和重复招牌缓存、车辆及路人材质合批；修复持械行走使用站立动作的问题，改善动画淡出、完整高度碰撞与镜头遮挡。新增履带坦克；载具卡片支持手机原生横滑与鼠标拖动，保留出租车、法拉利风格跑车、直升机与战斗机。</p><p>本轮为离线 H5 交付，未执行平台审核。云端软件 GPU 验证不能替代手机真机 FPS 测试。详情见附带的 V0.8 开发说明与报告。</p></details>',1)
html=html.replace('</body>','<script>'+ (P/'src-v8/loader.js').read_text()+'</script></body>')
html=decorateHTML10(decorateHTML9(html)).replace('V0.10','V0.11').replace('v0.10','v0.11').replace('清新海湾，慢一点生活。','小一点的城市，更丰富的生活。')
html=html.replace('<div class="requirements">','<div class="requirements"><details open><summary>V0.11 · 人物稳定 / 紧凑街区</summary><p>按 V0.9 恢复三位主角体型和服装；修复脚部校正跳变、慢帧动作不同步，调整街区楼间距。星球半径从 154 米缩为 116 米，保留三城和全部玩法；新增街角生活设施及轻量远景。安卓真机性能仍待验证。</p></details>',1)
html=html.replace('小星球 · 自由之城','侠盗自由城').replace('<b>自由之城</b>','<b>侠盗自由城</b>').replace('<h1>小星球。<br><em>自由之城。</em></h1>','<h1>侠盗<br><em>自由城</em></h1>').replace('POCKET CITY','OUTLAW LIBERTY CITY')
html=html.replace('<div class="load-stamp8">OUTLAW LIBERTY CITY','<div class="load-stamp8">侠盗自由城')
(P/'dist/index.html').write_text(html)
print('Built V0.11:',len(html.encode()),'bytes; no runtime network dependencies')
