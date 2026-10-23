// Metres remain physical metres: only the planet contracts, never the people.
let cityStats11={frontages:0,infill:0,pockets:0,reefs:0},distantRoot11=null;
function previewFootprint11(p){
 const saved=seed,w=(3.9+rng()*1.45)*1.04,d=(4+rng()*1.4)*1.04;seed=saved;
 const f=frame(p.lat,p.lon,p.facing11??wrap(p.heading-Math.PI/2));
 return {center:f.n.clone().multiplyScalar(R),n:f.n,e:f.r,f:f.f,w:w+.34,d:d+.38};
}
function canPlaceBuilding11(p){
 if(buildings.length>=CITY_CONFIG11.maxBuildings||Math.abs(p.lat)>1.28||islandField9(p.lat,p.lon)>.935||reserveBay10(p)||campus9&&distance(p,campus9)<31)return false;
 const candidate=previewFootprint11(p),spawn=streetPoint(streets[5],306,-(streets[5].width/2+1.1));
 if(circleContact(nAt(spawn.lat,spawn.lon).multiplyScalar(R),candidate,.7))return false;
 for(const b of buildings)if(distance(b,p)<13&&shapeContact(candidate,{...b,w:b.w+.22,d:b.d+.22}))return false;
 for(const b of staticObstacles)if((b.minY||0)<1.8&&distance(b,p)<12&&shapeContact(candidate,b))return false;
 // Test the actual rectangle, rather than rejecting every narrow urban parcel.
 for(const x of [-1,0,1])for(const z of [-1,1]){
  const q=fromNormal(candidate.center.clone().addScaledVector(candidate.e,x*candidate.w/2).addScaledVector(candidate.f,z*candidate.d/2));
  if(onRoad9(q,-.05)||waterDepth10(q)>.08||reserveBay10(q))return false;
 }
 return true;
}
function makeCompactFrontages11(index){
 cityStats11={frontages:0,infill:0,pockets:0,reefs:0};
 const savedCity=cityId;
 for(const s of streets){
  if(s.pedestrian10)continue;let last=-50;
  for(let i=4;i<s.points.length-4;i++){
   if(s.cumulative[i]-last<CITY_CONFIG11.frontagePitch)continue;last=s.cumulative[i];
   for(const side of [-1,1]){
    const p=streetPoint(s,i,side*(s.width/2+CITY_CONFIG11.frontageClearance));p.facing11=wrap(p.heading-side*Math.PI/2);
    if(!canPlaceBuilding11(p))continue;cityId=districtAt(p.lat,p.lon);theme=themes[cityId];
    const root=makeBuilding(p.lat,p.lon,index++,p.facing11),b=buildings[buildings.length-1];b.heading=p.facing11;b.frontage11=s.id;root.name='Continuous street frontage';cityStats11.frontages++;
   }
  }
 }
 // Back courts and small shop rows occupy usable gaps left by intersecting roads.
 for(const d of islandDefs9)for(let z=-88;z<=88;z+=6)for(let x=-72;x<=72;x+=6){
  const p=localPoint9(d,x+(Math.round(z/6)%2)*2,z),near=nearStreet(p);
  if(near.distance<8.4||near.distance>22)continue;p.heading=near.sample.heading;p.facing11=headingTo(p,near.sample);
  if(!canPlaceBuilding11(p))continue;cityId=districtAt(p.lat,p.lon);theme=themes[cityId];
  const root=makeBuilding(p.lat,p.lon,index++,p.facing11),b=buildings[buildings.length-1];b.heading=p.facing11;b.infill11=true;root.name='Neighbourhood courtyard / shop';cityStats11.infill++;
 }
 cityId=savedCity;theme=themes[savedCity];return index;
}
function makePocketPlaces11(){
 const wood=timber10(),sage=mat(0x7f9b83),cream=mat(0xe5dcca),clay=mat(0xc28b70);
 for(const d of islandDefs9){let count=0;
  for(let z=-64;z<=64;z+=14)for(let x=-58;x<=58;x+=14){
   const p=localPoint9(d,x,z),near=nearStreet(p);
   if(count>=9||near.distance<5||near.distance>18||!walkable9(p)||waterDepth10(p)>.05||reserveBay10(p)||campus9&&distance(p,campus9)<30||buildings.some(b=>distance(b,p)<Math.hypot(b.w,b.d)/2+2.0)||staticObstacles.some(b=>distance(b,p)<3.5))continue;
   const heading=headingTo(p,near.sample),g=prop9(p,heading,'Neighbourhood pocket place');g.userData.pocket12={...p,heading};
   // A useful rest stop, not another empty square. Keep an unobstructed centre.
   box(g,mat(0xcfc8b0),0,.018,0,4.6,.035,4.1);
   box(g,wood,-1.35,.48,0,.55,.12,1.7);box(g,wood,-1.61,.83,0,.09,.65,1.7);
   for(const z0 of [-.6,.6])box(g,sage,-1.35,.24,z0,.38,.42,.08);
   const bench=localPoint9(p,-1.4,0,heading);obstacle9(bench,heading,.7,1.9,1.2,'街角木长椅');
   for(const side of [-1,1]){box(g,clay,side*1.65,.28,-1.4,.58,.54,.55);smoothOrb(g,sage,side*1.65,.76,-1.4,.48,.55,.46);}
   if(count%3===0){box(g,cream,1.3,1.2,0,.1,2.4,.1);box(g,sage,1.3,2.26,0,1.3,.55,.08);sign(g,['GROVE / MARKET','BAY / BOOKS','CITY / TRAM'][d.id],1.3,2.28,.06,1.18,.25,'#59786a','#f5e9ce');}
   else{box(g,sage,1.5,.55,.9,.45,1.05,.45);box(g,cream,1.5,1.09,.9,.5,.07,.5);obstacle9(localPoint9(p,1.5,.9,heading),heading,.5,.5,1.2,'街角垃圾桶');}
   cityStats11.pockets++;count++;
  }
 }
}
function makeDistantCity11(){
 if(distantRoot11)distantRoot11.removeFromParent();distantRoot11=new THREE.Group();distantRoot11.name='Bay headlands and distant tree silhouettes';world.add(distantRoot11);
 const stone=mat(0x9aa68f),green=mat(0x92aa90),tree=mat(0x799783),dummy=new THREE.Object3D(),crowns=new THREE.InstancedMesh(simpleRock10,tree,30);let used=0;
 // Real spherical offshore rock groups rise from the water, framing the bay.
 for(const [x,z,w,h,depth] of [[-67,-49,16,8,11],[-82,-25,13,6,10],[-77,43,18,9,12],[-56,68,15,7,11]]){
  const p=localPoint9(beach9,x,z);if(islandField9(p.lat,p.lon)<1.02||onRoad9(p))continue;
  const g=new THREE.Group();distantRoot11.add(g);placeV9(g,p.lat,p.lon,.3+x*.02,-1.0);
  const rock=new THREE.Mesh(simpleRock10,stone);rock.position.y=h*.29;rock.scale.set(w/2,h*.68,depth/2);g.add(rock);
  const cap=new THREE.Mesh(simpleRock10,green);cap.position.y=h*.72;cap.scale.set(w*.32,h*.10,depth*.34);g.add(cap);
  obstacle9(p,.3+x*.02,w*.83,depth*.83,h,'海湾远景礁岸');cityStats11.reefs++;
  g.updateMatrixWorld(true);
  for(let i=0;i<5;i++){
   dummy.position.set((i-2)*w*.105,h*.80+.55,Math.sin(i*2.7)*depth*.14);dummy.position.applyMatrix4(g.matrixWorld);
   const f=frame(p.lat,p.lon);dummy.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(f.r,f.n,f.f));dummy.scale.set(1.0,1.6,1.0);dummy.updateMatrix();crowns.setMatrixAt(used++,dummy.matrix);
  }
 }
 crowns.count=used;crowns.castShadow=false;distantRoot11.add(crowns);distantRoot11.traverse(o=>{o.castShadow=false;o.receiveShadow=false;});
 // One batched background group: no lights, animated actors or transparent layers.
 if(!renderer.isSoftwareRenderer){distantRoot11.remove(crowns);staticBatch(distantRoot11);distantRoot11.add(crowns);}buildCollisionGrid();
}
