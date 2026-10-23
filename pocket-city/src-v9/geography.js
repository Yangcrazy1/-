// Three connected island districts, clear local grids and walkable coastal paths.
const islandDefs9=[{id:0,lat:-.04,lon:0,w:.78,h:1.12,name:'圣安地列斯'},{id:1,lat:-.08,lon:2.55,w:.69,h:1.08,name:'自由城 · 海湾'},{id:2,lat:.12,lon:-1.55,w:.63,h:1.07,name:'洛圣都市区'}];
const beach9={lat:-.18,lon:2.03};
let roadGrid9=new Map(),landmarks9=[],campus9=null,mapCache9=null,landmarkRoot9=null;
const palette9={ocean:0x69b6b7,shallows:0x9fd4cc,sand:0xf1dfb4,grass:[0xb3c69e,0xb8cdb1,0xaec5aa]};
function islandField9(lat,lon){let best=9;for(const d of islandDefs9){const x=wrap(lon-d.lon)*Math.cos(d.lat)/d.w,z=(lat-d.lat)/d.h,r=Math.hypot(x,z),ripple=.035*Math.sin(lon*13+lat*6)+.026*Math.sin(lat*17-lon*5);best=Math.min(best,r+ripple);}return Math.abs(lat)>1.25?Math.min(best,.75):best;}
function beachLocal9(p){const f=frame(beach9.lat,beach9.lon),delta=nAt(p.lat,p.lon).multiplyScalar(R).sub(f.n.multiplyScalar(R));return {x:delta.dot(f.r),z:delta.dot(f.f)};}
function inBeach9(p,padding=0){const q=beachLocal9(p);return q.x>-23-padding&&q.x<20+padding&&Math.abs(q.z)<25+padding;}
function surfaceColor9(lat,lon){const field=islandField9(lat,lon);if(field>1.04)return palette9.ocean;if(field>1)return palette9.shallows;if(field>.91||inBeach9({lat,lon}))return palette9.sand;return palette9.grass[districtAt(lat,lon)];}
function localPoint9(origin,x,z,heading=0){let p=movePoint(origin,heading,z);return movePoint(p,transportedHeading(origin,p,heading)+Math.PI/2,x);}
function mapXY9(p,W,H){return [((wrap(p.lon+2.55)+TAU)%TAU)/TAU*W,(1.20-p.lat)/2.4*H];}
function groundTexture(){return canvasTexture(1536,768,(g,W,H)=>{for(let y=0;y<H;y+=6)for(let x=0;x<W;x+=6){const lat=Math.PI/2-(y+3)/H*Math.PI,lon=(x+3)/W*TAU-Math.PI;g.fillStyle='#'+new THREE.Color(surfaceColor9(lat,lon)).getHexString();g.fillRect(x,y,6,6);}for(const pass of [0,1]){g.strokeStyle=pass?'#526a6a':'#f0ead9';g.lineCap='round';g.lineJoin='round';for(const s of streets){g.lineWidth=pass?1.4:3.2;g.beginPath();let prev=null;for(const p of s.points){const x=(p.lon+Math.PI)/TAU*W,y=(Math.PI/2-p.lat)/Math.PI*H;if(!prev||Math.abs(x-prev)>W/2)g.moveTo(x,y);else g.lineTo(x,y);prev=x;}g.stroke();}}});}
function rebuildConnections9(){
 const bins=new Map(),seen=new Map(),cell=6;junctions=[];
 for(const s of streets)for(let i=0;i<s.points.length;i+=2){const p=s.points[i],v=nAt(p.lat,p.lon).multiplyScalar(R),c=[Math.floor(v.x/cell),Math.floor(v.y/cell),Math.floor(v.z/cell)];
  for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++)for(const q of bins.get([c[0]+x,c[1]+y,c[2]+z].join(','))||[]){if(q.s===s||v.distanceToSquared(q.v)>16)continue;const a=Math.min(s.id,q.s.id),b=Math.max(s.id,q.s.id),key=a+'-'+b,list=seen.get(key)||[];if(list.some(n=>n.distanceToSquared(v)<16*16))continue;list.push(v);seen.set(key,list);junctions.push({a,b,ia:s.id===a?i:q.i,ib:s.id===a?q.i:i,lat:p.lat,lon:p.lon});}
  const key=c.join(',');if(!bins.has(key))bins.set(key,[]);bins.get(key).push({s,i,v});
 }
}
function buildRoadGrid9(){
 roadGrid9.clear();for(const s of streets)for(let i=0;i<s.points.length-1;i+=2){const a=nAt(s.points[i].lat,s.points[i].lon).multiplyScalar(R),end=s.points[Math.min(i+2,s.points.length-1)],b=nAt(end.lat,end.lon).multiplyScalar(R),ab=b.clone().sub(a),radius=s.width/2+2.05,seg={a,b,ab,len:ab.lengthSq(),radius};const lo=[Math.min(a.x,b.x)-radius,Math.min(a.y,b.y)-radius,Math.min(a.z,b.z)-radius].map(n=>Math.floor(n/12)),hi=[Math.max(a.x,b.x)+radius,Math.max(a.y,b.y)+radius,Math.max(a.z,b.z)+radius].map(n=>Math.floor(n/12));for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){const key=x+','+y+','+z;if(!roadGrid9.has(key))roadGrid9.set(key,[]);roadGrid9.get(key).push(seg);}}
}
function onRoad9(p,radius=.32){if(!roadGrid9.size)return false;const v=nAt(p.lat,p.lon).multiplyScalar(R),key=[v.x,v.y,v.z].map(x=>Math.floor(x/12)).join(',');for(const s of roadGrid9.get(key)||[]){const d=v.clone().sub(s.a),t=clamp(d.dot(s.ab)/Math.max(1e-8,s.len),0,1);if(d.addScaledVector(s.ab,-t).lengthSq()<(s.radius-radius)**2)return true;}return false;}
function walkable9(p,radius=.32){if(islandField9(p.lat,p.lon)<.992)return true;if(onRoad9(p,radius))return true;const q=beachLocal9(p);return q.x>-53&&q.x<18&&Math.abs(q.z)<1.4;}
function chooseCampus9(){let best=null,score=-Infinity;for(let lat=.20;lat<.88;lat+=.055)for(let lon=.12;lon<.62;lon+=.055){const p={lat,lon};if(islandField9(lat,lon)>.83||inBeach9(p))continue;const near=nearStreet(p),value=near.distance-Math.max(0,distance(p,islandDefs9[0])-100)*.08;if(value>score){score=value;best={...p,heading:headingTo(p,near.sample),clearance:near.distance};}}return best||{lat:.4,lon:.3,heading:Math.PI,clearance:20};}
function makeStreetNetwork(){
 makeStreetNetworkV7();
 for(const [id,d] of islandDefs9.entries()){
  for(const x of [-23,0,23])addStreet(['格罗夫','海湾','中央'][id]+'纵街 '+(x+23),Array.from({length:57},(_,i)=>localPoint9(d,x,-40+i*1.5)),false,5.8);
  for(const z of [-30,-8,14,36])addStreet(['花园','海湾','中央'][id]+'横街 '+(z+30),Array.from({length:49},(_,i)=>localPoint9(d,-36+i*1.5,z)),false,5.5);
  const nearest=nearStreet(d).sample;if(nearest&&distance(nearest,d)>2)addStreet('街区接驳 '+id,Array.from({length:25},(_,i)=>fromNormal(nAt(d.lat,d.lon).lerp(nAt(nearest.lat,nearest.lon),i/24))),false,5.8);
 }
 const entry=localPoint9(beach9,19,0),near=nearStreet(entry).sample;if(near)addStreet('海风步道连接路',Array.from({length:25},(_,i)=>fromNormal(nAt(entry.lat,entry.lon).lerp(nAt(near.lat,near.lon),i/24))),false,4.8);
 campus9=chooseCampus9();rebuildConnections9();buildRoadGrid9();mapCache9=null;
}
function canBuildHere(p){if(islandField9(p.lat,p.lon)>.91||inBeach9(p,7)||campus9&&distance(p,campus9)<31)return false;return canBuildHereV7(p);}
function moveWithCollision(a,heading,meters,radius=.36){if(!roadGrid9.size||!walkable9(a,radius))return moveWithCollisionV7(a,heading,meters,radius);const from={lat:a.lat,lon:a.lon},steps=Math.max(1,Math.ceil(Math.abs(meters)/.19)),step=meters/steps;let h=heading;for(let i=0;i<steps;i++){const next=movePoint(a,h,step);if(!walkable9(next,radius))break;const prev={lat:a.lat,lon:a.lon};if(moveWithCollisionV7(a,h,step,radius)<.000001)break;h=transportedHeading(prev,a,h);}return distance(from,a);}
function integrateVehicle(c,dt,throttle,steer,brake,boost=false){const before={lat:c.lat,lon:c.lon},onLand=walkable9(c,.8);integrateVehicleV8(c,dt,throttle,steer,brake,boost);if(onLand&&!walkable9(c,.8)){c.lat=before.lat;c.lon=before.lon;c.speed*=-.12;c.slip=0;}}
function roadRibbon9(root,points,width,height,material){const m=ribbon(points.map(p=>[p.lat,p.lon]),width,height,material,root);m.castShadow=false;m.geometry.computeBoundingSphere();const center=m.geometry.boundingSphere.center.clone();m.geometry.translate(-center.x,-center.y,-center.z);m.position.copy(center);return m;}
function makeRoads(){if(renderer.isSoftwareRenderer)return;const root=new THREE.Group();root.name='岛屿道路与跨海桥';world.add(root);const curb=mat(0xc9cfbc),walk=mat(0xeee8d8),road=mat(0x607577),paint=basic(0xfff2cc);for(const s of streets){for(let i=0;i<s.points.length-1;i+=22){const points=s.points.slice(i,Math.min(i+23,s.points.length));if(points.length<2)continue;roadRibbon9(root,points,s.width+4.2,.025,curb);roadRibbon9(root,points,s.width+3.7,.052,walk);roadRibbon9(root,points,s.width,.083,road);}for(let i=0;i<s.points.length-3;i+=12)roadRibbon9(root,s.points.slice(i,i+4),.11,.105,paint);}
 const white=basic(0xf5f1df);for(const j of junctions){if(Math.abs(j.lat)>1.25)continue;const heading=streetPoint(streets[j.a],j.ia).heading;for(const i of [-3,-2,-1,0,1,2,3]){const p=movePoint(j,heading,i*.72);roadRibbon9(root,[movePoint(p,heading-Math.PI/2,2.8),movePoint(p,heading+Math.PI/2,2.8)],.34,.113,white);}}
 chunkStatic(root);root.traverse(o=>{o.castShadow=false;});
}
