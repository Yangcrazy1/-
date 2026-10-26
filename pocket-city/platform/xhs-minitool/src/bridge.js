/* Original MiniTool adapter. Contracts: documented getLaunchOptions / Storage. */
(function (env) {
  'use strict';
  var KEY = 'pocket-city-v4';
  function valid(data) {
    if (!data || data.schema !== 1) return null;
    var result = { schema: 1 };
    ['cash', 'taxiTrips', 'raceWins', 'flightTrips'].forEach(function (key) {
      var value = Number(data[key]);
      result[key] = Number.isFinite(value) ? Math.max(0, Math.min(key === 'cash' ? 10000000 : 100000, value)) : key === 'cash' ? 1992 : 0;
    });
    result.charId = [0, 1, 2].indexOf(data.charId) >= 0 ? data.charId : 0;
    result.quality = ['流畅', '均衡', '精细'].indexOf(data.quality) >= 0 ? data.quality : '流畅';
    return result;
  }
  function version(options) {
    var value = Number(options && options.miniToolEnv && options.miniToolEnv.buildVersion);
    return Number.isFinite(value) && value > 0 ? Math.floor(value / 1000) : 0;
  }
  function bounded(promise, timeout) {
    return new Promise(function (resolve, reject) {
      var timer = setTimeout(function () { reject(new Error('存档读取超时')); }, timeout);
      Promise.resolve(promise).then(function (value) { clearTimeout(timer); resolve(value); }, function (error) { clearTimeout(timer); reject(error); });
    });
  }
  function createStorage(host, notify, timeout) {
    var cached = null, backend = 'memory', writable = false, ready = false, pending = null, flushing = false, error = null;
    var api = host.xhs && host.xhs.miniTool, detected = 0, writes = 0;
    function status(message, warn) { notify(message, !!warn); }
    function fail(cause, message) { error = String(cause && (cause.errMsg || cause.message) || cause); status(message, true); }
    function browserRead() { var text = host.localStorage.getItem(KEY); return text ? valid(JSON.parse(text)) : null; }
    async function prepare() {
      if (ready) return;
      api = host.xhs && host.xhs.miniTool;
      detected = version(host.xhs && host.xhs.launchOptions);
      if (!detected && api && typeof api.getLaunchOptions === 'function') {
        try { detected = version(await bounded(api.getLaunchOptions(), timeout || 1800)); } catch (_) { detected = 0; }
      }
      if (detected >= 9460) {
        backend = 'native';
        if (!api || !['getStorageInfo', 'getStorage', 'setStorage'].every(function (key) { return typeof api[key] === 'function'; })) {
          fail(new Error('Storage 接口不可用'), '当前存档暂不可用，本次进度仅在内存中保留'); ready = true; return;
        }
        try {
          var info = await bounded(api.getStorageInfo(), timeout || 1800);
          if (!info || !Array.isArray(info.keys)) throw new Error('存档状态无法确认');
          if (info.keys.indexOf(KEY) >= 0) {
            var response = await bounded(api.getStorage({ key: KEY }), timeout || 1800);
            cached = valid(typeof response.data === 'string' ? JSON.parse(response.data) : response.data);
            if (!cached) throw new Error('存档格式无效');
          } else {
            // Migrate only after native absence is confirmed; failed reads never
            // overwrite a possibly newer native record with an old browser copy.
            var old = null; try { old = browserRead(); } catch (_) {}
            if (old) { await bounded(api.setStorage({ key: KEY, data: old }), timeout || 1800); cached = old; }
          }
          writable = true; status('进度保存在小红书本机存储中', false);
        } catch (cause) { fail(cause, '存档未能载入，本次仅临时游玩；重新打开可重试'); }
      } else {
        backend = 'browser';
        try { cached = browserRead(); writable = true; status('当前为兼容存档，清理缓存可能丢失进度', false); }
        catch (cause) { backend = 'memory'; fail(cause, '此环境不支持存档，本次进度仅在内存中保留'); }
      }
      ready = true;
    }
    async function flush() {
      if (flushing || !writable || !ready) return;
      flushing = true;
      while (pending) {
        var snapshot = pending; pending = null;
        try {
          if (backend === 'native') {
            var response = await api.setStorage({ key: KEY, data: snapshot });
            if (response && response.errMsg && response.errMsg.indexOf(':fail') >= 0) throw response;
          } else host.localStorage.setItem(KEY, JSON.stringify(snapshot));
          writes++; error = null; status(backend === 'native' ? '进度已保存到小红书本机存储' : '进度已暂存，清理缓存可能丢失', false);
        } catch (cause) { fail(cause, '本次进度未保存，退出后可能丢失；后续保存会重试'); }
      }
      flushing = false;
    }
    return {
      prepare: prepare,
      getItem: function (key) { return key === KEY && cached ? JSON.stringify(cached) : null; },
      setItem: function (key, text) {
        if (key !== KEY) return false;
        try { var data = valid(JSON.parse(text)); if (!data) return false; cached = data; }
        catch (cause) { fail(cause, '本次存档数据无法保存'); return false; }
        if (!ready || !writable) { status('本次进度仅临时保留，尚未保存', true); return false; }
        pending = cached; status('正在保存本机进度…', false); flush(); return true;
      },
      settled: async function () { while (flushing) await new Promise(function (resolve) { setTimeout(resolve, 1); }); },
      state: function () { return { backend: backend, version: detected, writable: writable, ready: ready, writes: writes, error: error, pending: !!pending || flushing }; }
    };
  }
  function polyfills() {
    if (!Object.fromEntries) Object.fromEntries = function (entries) { var result = {}; Array.from(entries).forEach(function (entry) { Object.defineProperty(result, entry[0], { value: entry[1], writable: true, enumerable: true, configurable: true }); }); return result; };
    if (!Array.prototype.flat) Object.defineProperty(Array.prototype, 'flat', { configurable: true, writable: true, value: function (depth) { var d = depth === undefined ? 1 : Number(depth), result = []; this.forEach(function (item) { if (Array.isArray(item) && d > 0) result.push.apply(result, item.flat(d - 1)); else result.push(item); }); return result; } });
    if (!Array.prototype.flatMap) Object.defineProperty(Array.prototype, 'flatMap', { configurable: true, writable: true, value: function (fn, that) { return this.map(fn, that).flat(); } });
  }
  function notify(message, warn) {
    var status = env.document && env.document.getElementById('xhsStorageStatus');
    if (status) { status.textContent = message; status.setAttribute('data-warning', warn ? 'true' : 'false'); }
    if (warn && env.document && typeof env.CustomEvent === 'function') env.dispatchEvent(new env.CustomEvent('outlaw:storage-status', { detail: { message: message } }));
  }
  polyfills();
  var storage = createStorage(env, notify);
  env.OutlawMiniTool = { storage: storage, createStorage: createStorage, validateSave: valid, clientVersion: version, vibrate: function (pattern) { try { if (env.navigator && typeof env.navigator.vibrate === "function") env.navigator.vibrate(pattern); } catch (_) {} }, prepare: function () { return storage.prepare(); } };
  if (env.document && env.document.body) {
    env.document.body.classList.add('xhs-minitool', 'xhs-idle');
    var flex = env.document.createElement('div'); flex.style.cssText = 'position:absolute;visibility:hidden;display:flex;flex-direction:column;row-gap:1px';
    flex.appendChild(env.document.createElement('div')); flex.appendChild(env.document.createElement('div')); env.document.body.appendChild(flex);
    if (flex.scrollHeight !== 1) env.document.documentElement.classList.add('xhs-no-flex-gap'); flex.parentNode.removeChild(flex);
    ['startBtn', 'homeBtn'].forEach(function (id) { var button = env.document.getElementById(id); if (button) button.addEventListener('click', function () { env.document.body.classList.toggle('xhs-idle', id === 'homeBtn'); if (id === 'startBtn' && !storage.state().writable) setTimeout(function () { notify('本次仅临时游玩，存档尚未载入；重新打开可重试', true); }, 0); }); });
    env.document.addEventListener('contextmenu', function (event) { event.preventDefault(); });
  }
})(window);
