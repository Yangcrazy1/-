def decorateHTML9(html):
    html=html.replace('V0.8','V0.9').replace('v0.8','v0.9').replace('VOL. 08','VOL. 09').replace('FILE / 0.7','FILE / 0.9')
    html=html.replace('罪恶都市</b>','自由城 · 海湾</b>').replace('VICE COAST / 1986','LIBERTY BAY / 1986').replace('粉蓝装饰艺术建筑<br>霓虹、海岸、落日','清新岛城与海湾沙滩<br>栈桥、棕榈与落日').replace('蓝色短袖花衬衫','青绿棕榈印花衬衫')
    html=html.replace('<button data-tab="guide"','<button data-tab="atlas9">地图</button><button data-tab="guide"',1)
    html=html.replace('<div class="quickbar">','<div class="quickbar"><button class="glass" data-menu="atlas9">地图</button>',1)
    places='''<div class="places9"><button data-dest9="beach"><em>B / LIBERTY BAY</em><b>海湾沙滩 ↗</b><small>棕榈、遮阳伞和海上木栈桥</small></button><button data-dest9="casino"><em>C / THE OASIS</em><b>绿洲赌场 ↗</b><small>砂岩柱廊与金色金字塔屋顶</small></button><button data-dest9="sphinx"><em>S / THE SPHINX</em><b>狮身人面像 ↗</b><small>蓝金头巾、砂岩狮身与前爪</small></button></div>'''
    panel='''<div class="panel" id="atlas9"><div class="atlas-heading9"><small>POCKET ATLAS / 09</small><h2>三片岛城，一路海风。</h2><p>桥梁连接完整球面世界。沿公路驾驶，也可以下车后直接前往景点。</p></div><div class="atlas-frame9"><canvas id="atlasCanvas9" width="960" height="420" aria-label="三座岛城、街道、桥梁与景点地图"></canvas></div><div class="atlas-legend9"><span>● 你的位置</span><span>B 海湾沙滩</span><span>C 绿洲赌场</span><span>S 狮身人面像</span></div>'''+places+'</div>'
    html=html.replace('<div class="panel" id="radio">',panel+'<div class="panel" id="radio">',1)
    html=html.replace('<div class="panel" id="cities"><div class="cards">','<div class="panel" id="cities">'+places+'<div class="cards">',1)
    release='<details open><summary>V0.9 · 海湾 / 岛城 / 绿洲</summary><p>三岛海岸与局部街网、自由城海湾沙滩和木栈桥、圣安地列斯绿洲赌场与狮身人面像。打开「地图」可前往景点；水面边界阻止步行与汽车驶入，跨海道路仍可通行。赌场目前是外部场景地标。</p><p>CJ 白背心与宽松牛仔裤、Tommy 青绿棕榈衬衫和后梳发型；角色页面展示实际完整蒙皮模型。海玻璃绿、奶油白和暖砂岩配色。保留原有车辆、任务、飞行、电台和存档。</p></details>'
    html=html.replace('<div class="requirements">','<div class="requirements">'+release,1)
    html=html.replace('V0.7 · 漫画城市与昼夜。','V0.9 · 三片岛城，一路海风。')
    return html
