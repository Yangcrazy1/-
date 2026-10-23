(function(){
 const label=document.getElementById('loadLabel8'),bar=document.getElementById('loadBar8'),percent=document.getElementById('loadPercent8');
 const timings={opened:performance.now()};window.__POCKET_LOAD8__=timings;
 function progress(value,text){if(bar)bar.style.width=value+'%';if(percent)percent.textContent=value+'%';if(label)label.textContent=text;}
 function paint(fn){requestAnimationFrame(function(){setTimeout(fn,25);});}
 function fail(error){console.error(error);const loading=document.getElementById('loading');loading.classList.remove('hidden');loading.classList.add('error');progress(0,'打开失败：'+error.message+'。请使用支持 WebGL 的浏览器打开完整 HTML。');}
 window.__loadProgress8=progress;progress(8,'准备城市引擎');
 paint(function(){try{(0,eval)(document.getElementById('bundle8-0').textContent);timings.engine=performance.now();progress(28,'铺设街道，整理人物与载具');paint(function(){try{(0,eval)(document.getElementById('bundle8-1').textContent);timings.ready=performance.now();progress(100,'城市已就绪');}catch(error){fail(error);}});}catch(error){fail(error);}});
})();
