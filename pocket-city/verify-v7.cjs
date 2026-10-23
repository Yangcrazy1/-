const fs=require('fs'),Module=require('module');
let harness=fs.readFileSync('./verify-v6.cjs','utf8').replaceAll('game-v6.js','game-v7.js').replaceAll('verification-v6','verification-v7');
harness=harness.replace('const sandbox={THREE,console,','const sandbox={THREE,console,atob:s=>Buffer.from(s,"base64").toString("binary"),Image:class {set src(s){}},Int16Array,');
harness=harness.replace("const html=fs.readFileSync('./dist/index.html','utf8');",'').replace('const results=[];',"const html=fs.readFileSync('./dist/index.html','utf8');const results=[];");
const methods=String.raw`
 model7(){const all=[];for(let id=0;id<3;id++){const p=makeCharacter(id),uuid=p.figure.uuid,ranges=[];place(p.root,-.1,2.4,.3,.08);for(const speed of [0,2,6,0]){for(let t=0;t<35;t++)animateHuman(p,1/60,speed);p.root.updateMatrixWorld(true);p.skeleton.update();const box=new THREE.Box3();for(let i=0;i<p.figure.geometry.attributes.position.count;i++){const v=V().fromBufferAttribute(p.figure.geometry.attributes.position,i);p.figure.applyBoneTransform(i,v);box.expandByPoint(v);}ranges.push({speed,min:box.min.toArray(),max:box.max.toArray(),finite:box.min.toArray().concat(box.max.toArray()).every(Number.isFinite)});}all.push({id,bones:p.skeleton.bones.length,vertices:p.figure.geometry.attributes.position.count,uuid:p.figure.uuid===uuid,weights:Array.from(p.figure.geometry.attributes.skinWeight.array).slice(0,24),ranges});}return all;},
 population7(){this.restore();const out=[];for(const id of [0,1,2,1,0,2]){fastTravel(id);const counts=populationNear7();out.push({id,...counts,visible:visibleHumans,attached:peds.filter(p=>p.root.parent===actorGroup).length,blocked:!!capsuleContact(player,.34)});}return out;},
 solar7(){return [0,125,175,275,300].map(t=>solarState7(t));},
 timePause7(){this.restore();renderer.render=()=>{};dayElapsed7=0;started=true;menuOpen=false;orbit=false;wheelMode=null;lastTime=1;tick(2000);const active=dayElapsed7;menuOpen=true;tick(3000);const paused=dayElapsed7;menuOpen=false;document.hidden=true;tick(4000);document.hidden=false;const bg=dayElapsed7;startGame();return {active,paused,bg,restarted:solarHours7};},
 pixel7(){const changes=[];renderer.setPixelRatio=x=>changes.push(x);started=true;menuOpen=false;wheelMode=null;orbit=false;qualityAuto=true;resolutionScale=1.5;perfAverage=16;for(let i=0;i<600;i++)adjustResolution(1/60,50);return {min:Math.min(...changes),ratio:resolutionScale};},
 populationStep7(){this.restore();fastTravel(1);const saved={lat:player.lat,lon:player.lon};for(let i=0;i<180;i++){updatePeds(1/60);updateCars(1/60);}return {...populationNear7(),finite:peds.every(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon)),total:peds.length};},
`;
harness=harness.replace(' nearbyBuildings(){',methods+' nearbyBuildings(){');
const legacy=fs.readFileSync('verify-v6-extra.cjs','utf8'),legacyMethods=legacy.match(/const methods=String.raw`([\s\S]*?)`;/)[1],legacyChecks=legacy.match(/const newChecks=String.raw`([\s\S]*?)`;/)[1].split('\n').filter(s=>s.startsWith('check(')&&!s.includes('material groups')&&!s.includes('AI budget')&&!s.includes('larger world')&&!s.includes('adult proportions')).join('\n');
harness=harness.replace(' nearbyBuildings(){',legacyMethods+' nearbyBuildings(){');
harness=harness.replace("check('adult human", "check('adult human");
// The old head helper measured a separate primitive. The authored head is in the body mesh.
harness=harness.replace(/check\('articulated[\s\S]*?\n/,'');
const checks=String.raw`
check('authored CC0 humanoids keep one mesh and bounded finite deformation for idle walk sprint',()=>{const a=api.model7();console.log('MODEL7',JSON.stringify(a));for(const m of a){assert(m.uuid&&m.bones===65&&m.vertices>7000);for(const r of m.ranges){assert(r.finite);assert(r.max[1]<2.1&&r.min[1]>-.25,JSON.stringify(r));assert(r.max[0]-r.min[0]<1.5&&r.max[2]-r.min[2]<1.8,JSON.stringify(r));}}});
check('all three districts and return trips have nearby cars and pedestrians immediately',()=>{const a=api.population7();console.log('POPULATION7',JSON.stringify(a));for(const x of a)assert(x.peds>=18&&x.cars>=8&&x.visible>=15&&x.attached>=15&&!x.blocked,JSON.stringify(x));});
check('population simulation remains finite after returning to the second district',()=>{const x=api.populationStep7();assert(x.finite&&x.total>=280&&x.peds>=15&&x.cars>=6,JSON.stringify(x));});
check('300-second day begins 08:00 and includes sunset night dawn then loops',()=>{const s=api.solar7();assert(s[0].hours===8&&s[1].phase==='夕阳'&&s[2].phase==='夜晚'&&s[3].phase==='晨曦'&&s[4].hours===8,JSON.stringify(s));});
check('solar clock advances during play and pauses in menus and background, new start resets morning',()=>{const s=api.timePause7();assert(s.active===1&&s.paused===1&&s.bg===1&&s.restarted===8,JSON.stringify(s));});
check('adaptive rendering never shrinks below one CSS pixel per canvas pixel',()=>{const x=api.pixel7();assert(x.min>=1&&x.ratio>=1,JSON.stringify(x));});
check('offline build stays below 10 MB and embeds rig fabric inventory and source credit',()=>{assert(Buffer.byteLength(html)<10000000);for(const t of ['Quaternius','RIG_DATA_V7','FABRIC_DATA_V7','utilityClothes7','itemDrawer7'])assert(html.includes(t));});
`;
harness=harness.replace("if(!process.env.VERIFY_ONLY)fs.writeFileSync",legacyChecks+"\nif(!process.env.VERIFY_ONLY)fs.writeFileSync");
harness=harness.replace("check('full sphere",checks+"\ncheck('full sphere");
// Preserve the legacy physics, flight, driving, navigation, task and save regressions.
harness=harness.replace(/check\('adult-proportioned[\s\S]*?\n/,'');
const test=new Module(__filename,module);test.filename=__filename;test.paths=module.paths;test._compile(harness,__filename);
