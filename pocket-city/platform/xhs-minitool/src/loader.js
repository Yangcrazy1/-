(function () {
  'use strict';
  var label = document.getElementById('loadLabel8'), bar = document.getElementById('loadBar8'), percent = document.getElementById('loadPercent8');
  var timing = { opened: performance.now() }; window.__POCKET_LOAD8__ = timing;
  function progress(value, text) { if (bar) bar.style.width = value + '%'; if (percent) percent.textContent = value + '%'; if (label) label.textContent = text; }
  function fail(error) { var loading = document.getElementById('loading'); loading.classList.remove('hidden'); loading.classList.add('error'); progress(0, '打开失败，请重新进入小工具：' + error.message); }
  function script(path) { return new Promise(function (resolve, reject) { var tag = document.createElement('script'); tag.src = path; tag.onload = resolve; tag.onerror = function () { reject(new Error('包内脚本未能载入')); }; document.body.appendChild(tag); }); }
  function paint() { return new Promise(function (resolve) { requestAnimationFrame(function () { setTimeout(resolve, 20); }); }); }
  window.__loadProgress8 = progress;
  async function begin() {
    try {
      progress(8, '准备小红书离线城市'); await paint();
      await window.OutlawMiniTool.prepare(); progress(18, '整理本机进度');
      await script('./assets/engine.js'); timing.engine = performance.now();
      progress(30, '铺设街道，整理人物与载具'); await paint();
      await script('./assets/game.js');
      if (!window.__POCKET_CITY__) throw new Error('城市未能初始化');
      timing.ready = performance.now(); progress(100, '城市已就绪');
    } catch (error) { fail(error); }
  }
  begin();
})();
