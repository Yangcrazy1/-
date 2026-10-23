let wardrobe7=0,inventoryOpen7=false;
function refreshOneHandHUD(){
 refreshOneHandHUDV6();const minutes=Math.floor(solarHours7*60)%1440;setText('gameClock',(solarHours7<5.5||solarHours7>=20?'☾ ':'☀ ')+String(Math.floor(minutes/60)).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0'));setText('solarLabel7',solarPhase7+' · 5 分钟 / 天');
 const s=JSON.parse(document.body.dataset.gameState||'{}'),near=populationNear7();Object.assign(s,{version:'0.7.0',solarHours:solarHours7,solarPhase:solarPhase7,daySeconds:dayElapsed7,cycleSeconds:300,daylight:daylight7,localPopulation:near,populationRepairs:populationRepairs7,heroAsset:player.assetSource,heroModelUUID:player.figure.uuid,heroAnimation:player.animationState,heroBones:player.skeleton.bones.length,heroVertices:player.figure.geometry.attributes.position.count,wardrobe:wardrobe7});document.body.dataset.gameState=JSON.stringify(s);
 for(const b of document.querySelectorAll('[data-item7]'))b.classList.toggle('equipped',Number(b.dataset.item7)===weapon);
}
function changeWardrobe7(){
 wardrobe7=(wardrobe7+1)%3;const d=characterDefs[charId],m=player.figure.material[0],palette=charId===0?[d.shirt,0xd9ceb3,0xf3f3e9]:charId===1?[0xffffff,0x86a9bb,0xe1b0be]:[d.shirt,0x61717a,0x232e3d];m.color.setHex(palette[wardrobe7]);toast(characterDefs[charId].name+' · '+['经典服装','城市配色','夜行配色'][wardrobe7]);updateHUD();
}
function bindControls(){
 bindControlsV6();document.body.classList.add('comic-v7');$('utilityItems7').onclick=()=>{inventoryOpen7=!inventoryOpen7;$('itemDrawer7').classList.toggle('open',inventoryOpen7);$('utilityItems7').setAttribute('aria-expanded',String(inventoryOpen7));};$('utilityClothes7').onclick=changeWardrobe7;$('utilityMusic7').onclick=()=>openMenu('radio');
 for(const b of document.querySelectorAll('[data-item7]'))b.onclick=()=>{setWeapon(Number(b.dataset.item7));inventoryOpen7=false;$('itemDrawer7').classList.remove('open');$('utilityItems7').setAttribute('aria-expanded','false');};
 $('timeAdvance7').onclick=()=>{const times=[0,60,125,175,275],current=times.reduce((best,t,i)=>Math.abs(t-dayElapsed7%300)<Math.abs(times[best]-dayElapsed7%300)?i:best,0);dayElapsed7=times[(current+1)%times.length];updateSolar7(0);updateHUD();closeMenu();toast('时间变为'+solarPhase7+' · 仍按 5 分钟一轮变化');};
 $('qualityBtn').onclick=()=>{const names=['自动','流畅','均衡','精细'],next=(names.indexOf(qualityAuto?'自动':quality)+1)%4;qualityAuto=next===0;quality=qualityAuto?'均衡':names[next];resolutionScale=Math.min(devicePixelRatio,next===1?1.15:next===3?1.9:1.5);renderer.setPixelRatio(resolutionScale);renderer.shadowMap.enabled=next!==1&&!renderer.isSoftwareRenderer;perfAverage=18;perfClock=0;setText('qualityBtn','画质：'+names[next]);applySceneBudget(true);};
}
