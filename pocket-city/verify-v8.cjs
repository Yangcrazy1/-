// Add behavior regressions to the complete V0.7 suite without weakening it.
const fs=require('fs'),Module=require('module');
let source=fs.readFileSync('verify-v7.cjs','utf8');
const methods=String.raw`
 npcCar8(){this.clear();const c=makeCar();Object.assign(c,{lat:0,lon:0,heading:0});cars=[c];const p=makeCharacter(1,true);Object.assign(p,{lat:-.08,lon:0,heading:0,down:0,inTaxi:false});for(let i=0;i<140;i++)moveWithCollision(p,0,3.5/60,.34);return {lat:p.lat,clear:!capsuleContact(p,.33,false,0,true)};},

 armedWalk8(){this.clear();setWeapon(2,false);const p=player,id=p.figure.uuid;let max=0,last=p.legs[0].quaternion.clone();for(let i=0;i<100;i++){animateHuman(p,1/60,2.5,true);max=Math.max(max,last.angleTo(p.legs[0].quaternion));last.copy(p.legs[0].quaternion);}return {state:p.animationState,mesh:id===p.figure.uuid,max};},
 blend8(){this.clear();const p=player;for(let round=0;round<12;round++)for(const speed of [0,2,6,2,0])for(let i=0;i<20;i++)animateHuman(p,1/60,speed,false);for(let i=0;i<60;i++)animateHuman(p,1/60,0,false);return {active:Object.values(p.actions).filter(a=>a.isRunning()&&a.getEffectiveWeight()>.001).length,finite:p.skeleton.bones.every(b=>b.quaternion.toArray().every(Number.isFinite))};},
 canopy8(){this.clear();const f=frame(0,0);staticObstacles=[{center:f.n.clone().multiplyScalar(R),n:f.n,e:f.r,f:f.f,w:3,d:3,minY:2.2,h:2.5}];buildCollisionGrid();return {under:!!capsuleContact({lat:0,lon:0},.38,false,0),jump:!!capsuleContact({lat:0,lon:0},.38,false,.7),above:!!capsuleContact({lat:0,lon:0},.38,false,2.6)};},
 overlap8(){this.clear();this.addWall();player.lat=player.lon=0;resolveOverlap8(player,.38,0);return !capsuleContact(player,.375);},
 tank8(){this.clear();const c=makeCar(0x849078,'tank');Object.assign(c,{lat:0,lon:0,heading:0,occupied:false});cars=[c];activeCar=c;for(let i=0;i<240;i++)integrateVehicle(c,1/60,1,.25,false,true);const cap=c.speed;activeCar=null;const tank=makeCar(0x849078,'tank');Object.assign(tank,{lat:0,lon:0,heading:0});cars=[tank];player.lat=0;player.lon=-3/R;place(player.root,player.lat,player.lon,0,.06);started=true;menuOpen=false;wheelMode=null;orbit=false;findNearestCar();enterExit();const boarded=activeCar===tank;if(boarded){tank.speed=0;enterExit();}return {cap,tracks:tank.wheels.length,boarded,exited:!activeCar,clear:!capsuleContact(player,.36,false,0,true),turret:!!tank.turret,width:tank.width};},
 tankWall8(){this.clear();this.addWall();const c=makeCar(0x849078,'tank');Object.assign(c,{lat:-.08,lon:0,heading:0,speed:15});cars=[c];for(let i=0;i<120;i++)integrateVehicle(c,1/60,1,0,false,true);return {lat:c.lat,clear:!carContact(c,c)};},
 atlas8(){this.restore();const chunk=staticChunks.reduce((x,c)=>x+c.root.children.length,0);return {tiles:atlas8.tiles.size,geometries:chunk,chunks:staticChunks.length,cache:textMaterialCache8.size};},
 npcStyle8(){const a=makeCharacter(0,true),b=makeCharacter(1,true);return {different:a.figure.geometry!==b.figure.geometry,single:!Array.isArray(a.figure.material)&&!Array.isArray(b.figure.material),weighted:a.figure.geometry.attributes.skinWeight.count>1000};},
`;
const checks=String.raw`
check('V08 pedestrians stop at parked vehicle bodies instead of walking through them',()=>{const x=api.npcCar8();assert(x.lat*154< -2.1&&x.clear,JSON.stringify(x));});

check('V08 armed walking animates legs while keeping the same weighted body',()=>{const x=api.armedWalk8();assert(x.state==='Walk_Loop'&&x.mesh&&x.max>.005,JSON.stringify(x));});
check('V08 repeated animation transitions settle without accumulating active actions',()=>{const x=api.blend8();assert(x.active<=2&&x.finite,JSON.stringify(x));});
check('V08 canopy capsule permits walking underneath but blocks a jumping head',()=>{const x=api.canopy8();assert(!x.under&&x.jump&&!x.above,JSON.stringify(x));});
check('V08 height-aware depenetration repairs an existing wall overlap',()=>assert(api.overlap8()));
check('V08 tank has tracks turret speed cap safe boarding and exit',()=>{const x=api.tank8();assert(x.cap<=15&&x.tracks===12&&x.turret&&x.width>2.5&&x.boarded&&x.exited&&x.clear,JSON.stringify(x));});
check('V08 tank swept hull cannot tunnel through a thin wall',()=>{const x=api.tankWall8();assert(x.lat*154< -2.6&&x.clear,JSON.stringify(x));});
check('V08 opaque city uses a shared atlas and cached signs',()=>{const x=api.atlas8();console.log('ATLAS8',JSON.stringify(x));assert(x.tiles>100&&x.tiles<1024&&x.geometries<2200&&x.cache>10,JSON.stringify(x));});
check('V08 NPC styles retain different painted weighted surfaces with one body draw',()=>{const x=api.npcStyle8();assert(x.different&&x.single&&x.weighted,JSON.stringify(x));});
check('V08 offline loader and swipeable tank fleet are embedded in a small file',()=>{for(const x of ['POCKET_LOAD8','load-track8','data-vehicle="tank"','scroll-snap-type:x','html,body{touch-action:auto}'])assert(html.includes(x),x);assert(Buffer.byteLength(html)<10000000);});
`;
source=source.replace('const methods=String.raw`','const methods=String.raw`'+methods).replace('const checks=String.raw`','const checks=String.raw`'+checks);
source=source.replaceAll('verification-v7','verification-v8');
const runner=new Module(__filename,module);runner.filename=__filename;runner.paths=module.paths;runner._compile(source,__filename);
