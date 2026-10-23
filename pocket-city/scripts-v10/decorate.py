def decorateHTML10(html):
    html=html.replace('V0.9','V0.10').replace('v0.9','v0.10').replace('VOL. 09','VOL. 10').replace('FILE / 0.9','FILE / 0.10')
    html=html.replace('</style>',(P/'src-v10/interface.css').read_text()+'\n</style>',1)
    html=html.replace('<audio id="radioPlayer"','<div id="flightHeight10" hidden></div><audio id="radioPlayer"',1)
    html=html.replace('三片岛城，一路海风。','清新海湾，慢一点生活。')
    release='<details open><summary>V0.10 · 清新海湾 / 环境 / 动作</summary><p>两层球面微波浪、浅深海色、动态岸沫、干湿沙、限量涟漪与脚印。90 米木栈步道、海风咖啡、礁石、植被和四类道路。路口共享红黄绿与行人通行状态，车辆提前制动、绿灯起步。</p><p>三位主角体型与服装细化、脚底接地、同骨架驾驶姿态与持械支撑手校正。手机操作按步行、驾驶和飞行布局，关键热区至少 48 CSS 像素；离线试玩包含完整资源。中档安卓目标 30 FPS，真机尚待测试。</p></details>'
    return html.replace('<div class="requirements">','<div class="requirements">'+release,1)
