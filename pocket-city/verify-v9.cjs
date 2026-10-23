// Extend the complete prior suite with coastal and landmark behaviors.
const fs=require('fs'),Module=require('module');
let source=fs.readFileSync('verify-v8.cjs','utf8');
const methods=String.raw`
 motion9(){this.restore();fastTravel(0);const cs=cars.filter(c=>c.traffic&&distance(c,player)<50),ps=peds.filter(p=>!p.taxiPassenger&&!p.police&&distance(p,player)<38),before=new Map([...cs,...ps].map(p=>[p,{lat:p.lat,lon:p.lon}]));for(let i=0;i<240;i++){collectAnimations8();updateCars(1/60);updatePeds(1/60);flushAnimations8(1/60);}return {cars:cs.filter(c=>distance(c,before.get(c))>.4).length,peds:ps.filter(p=>distance(p,before.get(p))>.4).length,walks:ps.filter(p=>p.animationState==='Walk_Loop'||p.animationState==='Sprint_Loop').length};},
 fittings9(){return [0,1].map(id=>{const p=makeCharacter(id);let max=0;for(const speed of [0,2,6]){for(let i=0;i<35;i++)animateHuman(p,1/60,speed);p.root.updateMatrixWorld(true);const center=new THREE.Box3().setFromObject(p.hair).getCenter(V()),head=p.head.getWorldPosition(V());max=Math.max(max,head.distanceTo(center));}return {id,max,garment:p.garment.parent===p.chest,hair:p.hair.parent===p.head};});},

 coast9(){this.clear();let edge=null;for(let x=-45;x<0;x+=.2){const a=localPoint9(beach9,x,7),b=localPoint9(beach9,x+.8,7);if(!walkable9(a)&&walkable9(b)){edge={a,b};break;}}if(!edge)return {found:false};const p={...edge.b},heading=headingTo(p,edge.a);for(let i=0;i<120;i++)moveWithCollision(p,heading,.1,.36);return {found:true,land:walkable9(p),travel:distance(edge.b,p),water:!walkable9(edge.a)};},
 islands9(){this.restore();return {land:islandDefs9.every(p=>islandField9(p.lat,p.lon)<.1),water:islandField9(0,1.3)>1,roads:streets.length,pier:walkable9(localPoint9(beach9,-48,0)),beach:surfaceColor9(beach9.lat,beach9.lon)===palette9.sand};},
 visits9(){this.restore();started=true;const out=[];for(const d of landmarks9){const money=cash,w=weapon,ok=visitLandmark9(d.id);out.push({id:d.id,ok,clear:!capsuleContact(player,.36,false,0,true),land:walkable9(player),near:distance(player,d.arrival),preserved:cash===money&&weapon===w,solid:d.id==='beach'||!!capsuleContact(d,.36)});}return out;},
 landmarkSweep9(){this.restore();const d=landmarks9.find(p=>p.id==='sphinx'),p={...d.arrival},heading=headingTo(p,d);for(let i=0;i<150;i++)moveWithCollision(p,heading,.12,.36);return {clear:!capsuleContact(p,.355),stopped:distance(p,d)>5,obstacles:staticObstacles.filter(p=>['绿洲赌场','狮身人面像'].includes(p.kind)).length};},
 clothes9(){return [0,1].map(id=>{const p=makeCharacter(id),a=p.figure.geometry.attributes.skinWeight.array;let normalized=true;for(let i=0;i<a.length;i+=4)if(a[i]+a[i+1]+a[i+2]+a[i+3]!==255)normalized=false;return {id,normalized,vertices:p.figure.geometry.attributes.position.count,tailored:p.figure.geometry.userData.refined9,style:p.wardrobeStyle9,pattern:id!==1||p.figure.material[0].map===palmFabric9};});},
 travelGuard9(){this.restore();activeCar=cars[0];const saved={lat:player.lat,lon:player.lon},ok=visitLandmark9('beach');activeCar=null;return !ok&&distance(saved,player)<.001;},
`;
const checks=String.raw`
check('V09 nearby traffic drives and pedestrians translate with walking animations over four seconds',()=>{const x=api.motion9();console.log('MOTION9',JSON.stringify(x));assert(x.cars>=3&&x.peds>=10&&x.walks>=10,JSON.stringify(x));});
check('V09 hair and clothing remain attached to their intended bones through idle walk sprint',()=>{for(const x of api.fittings9())assert(x.garment&&x.hair&&x.max<.35,JSON.stringify(x));});

check('V09 three island centers are land with sea gaps, a sandy beach and a walkable pier',()=>{const x=api.islands9();assert(x.land&&x.water&&x.beach&&x.pier&&x.roads>=40,JSON.stringify(x));});
check('V09 swept walking stops at the shoreline while preserving land movement',()=>{const x=api.coast9();assert(x.found&&x.land&&x.water&&x.travel<1.2,JSON.stringify(x));});
check('V09 every landmark has a clear reachable arrival without resetting money or weapons',()=>{const xs=api.visits9();assert(xs.length===3);for(const x of xs)assert(x.ok&&x.clear&&x.land&&x.near<8&&x.preserved&&x.solid,JSON.stringify(x));});
check('V09 sphinx sculpture and casino have solid collision and swept approach',()=>{const x=api.landmarkSweep9();assert(x.clear&&x.stopped&&x.obstacles===2,JSON.stringify(x));});
check('V09 tailored clothing retains normalized weighted anatomy and a local palm pattern',()=>{for(const x of api.clothes9())assert(x.normalized&&x.vertices>7000&&x.tailored&&x.style&&x.pattern,JSON.stringify(x));});
check('V09 scenic travel requires leaving the active vehicle',()=>assert(api.travelGuard9()));
check('V09 offline atlas and three destination controls are embedded below 10 MB',()=>{for(const text of ['atlasCanvas9','data-dest9="beach"','data-dest9="casino"','data-dest9="sphinx"','tailoredGeometry9'])assert(html.includes(text),text);assert(Buffer.byteLength(html)<10000000);});
`;
source=source.replace('const methods=String.raw`','const methods=String.raw`'+methods).replace('const checks=String.raw`','const checks=String.raw`'+checks).replaceAll('verification-v8','verification-v9');
const runner=new Module(__filename,module);runner.filename=__filename;runner.paths=module.paths;runner._compile(source,__filename);
