let farBlocks12=null,gardenDecks12=[],gardenStats12={trees:0,shrubs:0,decks:0,far:0};
function compactRoads12(){for(const s of streets)if(!s.pedestrian10)s.width=Math.max(s.kind10==='residential'?4.8:5.2,Math.min(5.9,s.width*.78));}
function addWarmFacade12(g,b,index){
 const w=b.w/g.scale.x,d=b.d/g.scale.z,wood=timber10(),green=mat(0x7f9b79),clay=mat(0xc68e70);
 if(index%3===0){
  for(let k=0;k<5;k++)box(g,wood,-w*.42+k*w*.21,.48,d/2+.07,w*.19,.72,.09);
  for(const x of [-w*.40,w*.40]){box(g,wood,x,1.47,d/2+.08,.09,2.2,.10);box(g,clay,x,.28,d/2+.30,.45,.50,.40);smoothOrb(g,green,x,.70,d/2+.30,.37,.42,.30);}
 }
 if(index%8===1){
  box(g,wood,0,2.63,d/2+.35,w*.88,.12,.8);
  for(const x of [-.3,0,.3])box(g,wood,w*x,2.73,d/2+.30,.08,.10,1.1);
  const front=localPoint9(b,0,d*g.scale.z/2+.35,b.heading??0);
  // Camera sees the overhang, walking may pass beneath it.
  obstacle9(front,b.heading??0,w*g.scale.x*.9,.9,2.82,'木雨棚',2.55);
 }
}
function makeFarBlocks12(){
 if(farBlocks12)farBlocks12.removeFromParent();if(renderer.isSoftwareRenderer){farBlocks12=null;return;}
 const tx=canvasTexture(128,256,(g,W,H)=>{g.fillStyle='#f2efe0';g.fillRect(0,0,W,H);for(let y=15;y<H-8;y+=31)for(const x of [19,75]){g.fillStyle='#647d7b';g.fillRect(x,y,32,20);g.fillStyle='#c4d2c2';g.fillRect(x,y,1,20);g.fillRect(x+15,y,1,20);g.fillStyle='#d9dfcd';g.fillRect(x-2,y+20,36,2);}});
 farBlocks12=new THREE.InstancedMesh(boxGeo,new THREE.MeshToonMaterial({map:tx,gradientMap:freshRamp9}),buildings.length);farBlocks12.name='Persistent low-cost distant facades';farBlocks12.castShadow=false;farBlocks12.receiveShadow=false;farBlocks12.frustumCulled=false;farBlocks12.instanceMatrix.setUsage(THREE.DynamicDrawUsage);world.add(farBlocks12);updateFarBlocks12(true);
}
let farClock12=0;
function updateFarBlocks12(force=false){
 if(!farBlocks12||!player)return;if(!force&&worldTime-farClock12<.18)return;farClock12=worldTime;
 const dummy=new THREE.Object3D(),origin=nAt(player.lat,player.lon).multiplyScalar(R);let count=0;
 for(const b of buildings){const d=origin.distanceTo(b.center);if(d>158||b.detailChunk12?.userData.detailActive12!==false)continue;
  const f=frame(b.lat,b.lon,b.heading||0);dummy.position.copy(b.center).addScaledVector(b.n,b.h/2);dummy.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(f.r,b.n,f.f));dummy.scale.set(b.w,b.h,b.d);dummy.updateMatrix();farBlocks12.setMatrixAt(count,dummy.matrix);farBlocks12.setColorAt(count,new THREE.Color(themes[b.district??0].build[(count*3)%6]));count++;
 }
 farBlocks12.count=count;farBlocks12.instanceMatrix.needsUpdate=true;if(farBlocks12.instanceColor)farBlocks12.instanceColor.needsUpdate=true;gardenStats12.far=count;
}
function detailGround12(p){
 if(!gardenDecks12.length)return null;const v=nAt(p.lat,p.lon).multiplyScalar(R);
 for(const d of gardenDecks12){if(v.distanceToSquared(d.center)>14)continue;const delta=v.clone().sub(d.center);if(Math.abs(delta.dot(d.e))<d.w/2&&Math.abs(delta.dot(d.f))<d.d/2)return .06;}
 return null;
}
function addCourtyards12(){
 gardenDecks12=[];gardenStats12={trees:0,shrubs:0,decks:0,far:0};const wood=timber10(),sage=mat(0x8aa27e);
 for(const g of [...cityGroup.children]){
  const p=g.userData.pocket12;if(!p)continue;const f=frame(p.lat,p.lon,p.heading);gardenDecks12.push({center:f.n.clone().multiplyScalar(R),e:f.r,f:f.f,w:4.5,d:4});
  for(let i=0;i<12;i++)box(g,wood,0,.01,-1.82+i*.33,4.5,.1,.315);
  for(const x of [-2.12,2.12]){box(g,wood,x,.48,-1.8,.08,.86,.08);box(g,wood,x,.85,-1.0,.07,.07,1.65);}
  box(g,wood,0,.85,-1.82,4.3,.07,.07);obstacle9(localPoint9(p,0,-1.82,p.heading),p.heading,4.3,.12,.95,'庭院木栏');
  for(const x of [-1.7,1.7])for(let k=0;k<3;k++)smoothOrb(g,sage,x+(k-1)*.17,.47,-1.35,.3,.33,.28);
  gardenStats12.decks++;
 }
}
function addGardenClusters12(){
 const sites=[];
 for(const d of islandDefs9)for(let z=-74;z<=74;z+=9)for(let x=-62;x<=62;x+=9){
  const p=localPoint9(d,x+(Math.round(z/9)%2)*2.5,z),near=nearStreet(p);
  if(sites.length>=100||islandField9(p.lat,p.lon)>.88||near.distance<near.sample.street.width/2+2.2||coastDistance10(p)>-13||timberSurface10(p)!==null||reserveBay10(p)||campus9&&distance(p,campus9)<27||buildings.some(b=>distance(b,p)<Math.hypot(b.w,b.d)/2+1.2)||staticObstacles.some(b=>distance(b,p)<2.0)||sites.some(s=>distance(s,p)<4.5))continue;sites.push({...p,scale:.75+(sites.length%5)*.12});
 }
 for(let z=-39;z<42;z+=7)for(const offset of [14,19]){const p=localPoint9(beach9,shoreX10(z)+offset,z),near=nearStreet(p);if(waterDepth10(p)>.05||timberSurface10(p)!==null||near.distance<near.sample.street.width/2+1.9||buildings.some(b=>distance(b,p)<Math.hypot(b.w,b.d)/2+1.4)||staticObstacles.some(b=>distance(b,p)<1.6)||sites.some(b=>distance(b,p)<3.6))continue;sites.push({...p,scale:1.1+(sites.length%3)*.15});}
 const leaf=foliageMaterial10(),crowns=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),leaf,sites.length*4),trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.09,.17,3,7),timber10(),sites.length),shrubs=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),leaf,sites.length*3),dummy=new THREE.Object3D();
 const shadowMap=canvasTexture(32,32,(g,W,H)=>{const gradient=g.createRadialGradient(16,16,2,16,16,16);gradient.addColorStop(0,'#0000004a');gradient.addColorStop(1,'#00000000');g.fillStyle=gradient;g.fillRect(0,0,W,H);}),shadows=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false,side:THREE.DoubleSide}),sites.length);
 let ci=0,si=0;for(let i=0;i<sites.length;i++){
  const p=sites[i],f=frame(p.lat,p.lon),q=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(f.r,f.n,f.f)),base=f.n.clone().multiplyScalar(R);
  dummy.quaternion.copy(q);dummy.position.copy(base).addScaledVector(f.n,1.5*p.scale);dummy.scale.setScalar(p.scale);dummy.updateMatrix();trunks.setMatrixAt(i,dummy.matrix);
  for(let k=0;k<4;k++){dummy.position.copy(base).addScaledVector(f.n,(2.6+k*.42)*p.scale).addScaledVector(f.r,Math.sin(i+k*2.6)*.6*p.scale).addScaledVector(f.f,Math.cos(i+k*2.3)*.45*p.scale);dummy.scale.set(1.2*p.scale,(1.15-k*.1)*p.scale,1.1*p.scale);dummy.updateMatrix();crowns.setMatrixAt(ci,dummy.matrix);crowns.setColorAt(ci++,new THREE.Color([0x91a982,0xa9bd91,0x789b7d,0xb0c49c][(i+k)%4]));}
  for(let k=0;k<3;k++){dummy.position.copy(base).addScaledVector(f.n,.28).addScaledVector(f.r,Math.cos(k*2.1+i)*1.1).addScaledVector(f.f,Math.sin(k*2.1+i)*1.1);dummy.scale.set(.4,.35,.5);dummy.updateMatrix();shrubs.setMatrixAt(si,dummy.matrix);shrubs.setColorAt(si++,new THREE.Color(k%2?0x9ab68b:0x739b79));}
  dummy.position.copy(base).addScaledVector(f.n,.009);dummy.quaternion.copy(q).multiply(new THREE.Quaternion().setFromAxisAngle(V(1,0,0),-Math.PI/2));dummy.scale.set(3.4*p.scale,3.1*p.scale,1);dummy.updateMatrix();shadows.setMatrixAt(i,dummy.matrix);obstacle9(p,0,.32*p.scale,.32*p.scale,3*p.scale,'庭院树干');
 }
 for(const mesh of [crowns,trunks,shrubs,shadows]){mesh.castShadow=false;mesh.frustumCulled=false;addInstanceSet12(mesh);}gardenStats12.trees=sites.length;gardenStats12.shrubs=si;
}
function finishCity12(){
 installProjection12();addGardenClusters12();makeFarBlocks12();scene.traverse(o=>{if(o.isMesh||o.isSprite||o.isLine)o.frustumCulled=false;});buildCollisionGrid();const bay=landmarks9.find(d=>d.id==='beach');if(bay){bay.arrival=localPoint9(beach9,shoreX10(-16)+8,-16);bay.viewHeading12=0;}document.body?.classList.add('edition12');
}

function arrivalPoint12(id){
 const base=districtAnchors7[id],candidates=[];
 for(const s of streets){if(s.pedestrian10||s.id<11)continue;for(let i=8;i<s.points.length-8;i+=2){
  if(distance(s.points[i],base)>48)continue;
  for(const sign of [-1,1]){const p=streetPoint(s,i,sign*(s.width/2+.8));if(waterDepth10(p)>.05||capsuleContact(p,.42,false,0,true)||heliFleet.some(h=>distance(h,p)<12))continue;
   const nearby=buildings.filter(b=>distance(b,p)<25),ahead=movePoint(p,p.heading,13),framing=buildings.filter(b=>distance(b,ahead)<14).length;
   for(const direction of [0,Math.PI]){const heading=wrap(p.heading+direction),forward=movePoint(p,heading,24),far=movePoint(p,heading,40),depth=buildings.filter(b=>distance(b,forward)<18).length+buildings.filter(b=>distance(b,far)<18).length*.6;candidates.push({p:{...p,heading},score:nearby.length*2+depth-distance(p,base)*.03});}
  }
 }}
 candidates.sort((a,b)=>b.score-a.score);const sample=nearStreet(base).sample;
 return candidates[0]?.p||streetPoint(sample.street,sample.index,sample.street.width/2+.9);
}

function parkArrivalTaxi12(spawn){
 const taxi=cars.find(c=>c.marked&&!c.police);if(!taxi)return;const near=nearStreet(spawn).sample;
 for(const offset of [-3,3,-5,5,-7,7]){const p=streetPoint(near.street,clamp(near.index+offset,2,near.street.points.length-3),-1.25);if(carContact(taxi,p)||cars.some(c=>c!==taxi&&distance(c,p)<5)||!vehicleAllowed10(p))continue;Object.assign(taxi,p,{speed:0,traffic:false,occupied:false});place(taxi.root,taxi.lat,taxi.lon,taxi.heading,.06);return;}
}

// Canvas fallback has no instancing. Bake the same static placements into a
// shared mesh instead of silently drawing every crown at the world origin.
function addInstanceSet12(mesh){
 if(!renderer.isSoftwareRenderer){world.add(mesh);return mesh;}
 if(mesh.material.transparent)return null;
 const source=mesh.geometry,positions=[],normals=[],uv=[],indices=[],matrix=new THREE.Matrix4();let offset=0;
 for(let i=0;i<mesh.count;i++){mesh.getMatrixAt(i,matrix);const g=source.clone().applyMatrix4(matrix),p=g.attributes.position,n=g.attributes.normal,t=g.attributes.uv;positions.push(...p.array);if(n)normals.push(...n.array);if(t)uv.push(...t.array);if(g.index)for(const index of g.index.array)indices.push(index+offset);else for(let j=0;j<p.count;j++)indices.push(j+offset);offset+=p.count;g.dispose();}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));if(normals.length)g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));if(uv.length)g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);const baked=new THREE.Mesh(g,mesh.material);world.add(baked);return baked;
}

// Arrivals may already have a full population behind the camera. Seed a few
// safe sidewalk walkers in front during the transition, never during play.
function ensureArrivalCrowd12(origin){
 const sample=nearStreet(origin).sample;if(!sample||sample.street.pedestrian10)return;
 const road=sample.street,step=road.length/(road.points.length-1),dir=Math.cos(wrap(origin.heading-sample.heading))>=0?1:-1;
 const pool=peds.filter(p=>!p.police&&!p.taxiPassenger&&!p.inTaxi&&p.down<=0&&p!==lockPed&&p!==job?.passenger&&distance(p,origin)>35).sort((a,b)=>distance(b,origin)-distance(a,origin));let count=0;
 for(const ahead of [6,10,14,18,23,27])for(const sign of [-1,1]){
  if(count>=6||!pool.length)return;const index=clamp(sample.index+dir*Math.round(ahead/Math.max(.1,step)),2,road.points.length-3),side=sign*(road.width/2+.8),p=streetPoint(road,index,side,dir);
  if(distance(p,origin)<4||distance(p,origin)>30||capsuleContact(p,.36,false,0,true)||peds.some(q=>distance(p,q)<1.15))continue;
  const actor=pool.pop();Object.assign(actor,p,{road,roadIndex:index,roadDir:dir,side,speed:.9+(count%4)*.12,down:0,panic:0,pause:0,hp:100});place(actor.root,actor.lat,actor.lon,actor.heading,.08);animateHuman(actor,.08,actor.speed);count++;
 }
 populationRepairs7+=count;
}
