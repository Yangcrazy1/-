let meleePending10=null;
// V0.11 restores the V0.9 geometry, hair and bind-space wardrobe unchanged.
// Never deform a shared body a second time or add a detached shoe shell.
function refineCharacter10(p,id,npc){
 p.root.userData.ground10=true;if(npc)return;finishWardrobe11(p,id);
 p.figure.userData.fit10={sharedSkeleton:true,bodyUUID:p.figure.uuid,role:id,headStyle:['square-buzz','swept-jaw','mature-brow'][id],geometryBaseline:'v0.9'};
 p.poseState10={speed:0,jump:0,landing:0,sit:0,corrections:new Map()};
}
// Smooth authored rotations before contact correction, without changing bind poses.
function smoothAuthoredPose11(p,dt){
 if(p.npc||dt<=0)return;if(!p.authoredFilter11)p.authoredFilter11=new Map();
 const alpha=1-Math.exp(-dt*28);
 for(const b of p.skeleton.bones){let q=p.authoredFilter11.get(b);if(!q){q=b.quaternion.clone();p.authoredFilter11.set(b,q);}else q.slerp(b.quaternion,alpha);b.quaternion.copy(q);}
}
function applyStableCorrection11(state,bone,base,desired,dt,maxAngle=.55){
 const target=base.clone().invert().multiply(desired),angle=2*Math.acos(clamp(Math.abs(target.w),0,1));
 if(angle>maxAngle)target.slerp(new THREE.Quaternion(),1-maxAngle/angle);
 let current=state.corrections.get(bone);if(!current){current=new THREE.Quaternion();state.corrections.set(bone,current);}
 current.slerp(target,1-Math.exp(-Math.min(dt,.1)*CITY_CONFIG11.footCorrectionHz));
 bone.quaternion.copy(base).multiply(current);bone.updateWorldMatrix(false,true);
}
function rotateBone10(bone,from,to,blend=1){if(from.lengthSq()<1e-8||to.lengthSq()<1e-8)return;const delta=new THREE.Quaternion().setFromUnitVectors(from.normalize(),to.normalize()),world=bone.getWorldQuaternion(new THREE.Quaternion()),parent=bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert(),target=parent.multiply(delta.multiply(world));bone.quaternion.slerp(target,blend);bone.updateWorldMatrix(false,true);}
function solveLimb10(upper,lower,end,target,bend,blend=1){const a=upper.getWorldPosition(V()),b=lower.getWorldPosition(V()),c=end.getWorldPosition(V()),l1=a.distanceTo(b),l2=b.distanceTo(c),delta=target.clone().sub(a),d=clamp(delta.length(),Math.abs(l1-l2)+.005,l1+l2-.003),u=delta.normalize(),side=bend.clone().addScaledVector(u,-bend.dot(u)).normalize(),along=(l1*l1-l2*l2+d*d)/(2*d),height=Math.sqrt(Math.max(0,l1*l1-along*along)),knee=a.clone().addScaledVector(u,along).addScaledVector(side,height);rotateBone10(upper,b.sub(a),knee.sub(a),blend);const joint=lower.getWorldPosition(V()),tip=end.getWorldPosition(V());rotateBone10(lower,tip.sub(joint),target.clone().sub(joint),blend);}
function finishPose10(p,dt,speed,armed){
 if(!p.authored||p.npc||!p.poseState10)return;const state=p.poseState10,active=p===player&&(activeCar||activeHeli||activeJet),onPlanet=p.root.position.length()>R*.9;
 state.speed=lerp(state.speed,speed,1-Math.exp(-dt*9));
 if(active){
  state.sit=Math.min(1,state.sit+dt/.18);p.pilotWeapon10=weapon;p.gun.visible=false;p.body.position.y=lerp(-.045,-.48,state.sit);p.body.rotation.set(0,0,0);p.root.updateMatrixWorld(true);
  const f=frame(p.lat,p.lon,p.heading);for(let i=0;i<2;i++){const target=p.root.position.clone().addScaledVector(f.f,.45).addScaledVector(f.r,i?.13:-.13).addScaledVector(f.n,-.02);solveLimb10(p.legs[i],p.knees[i],p.ankles[i],target,f.f,1);}return;
 }
 state.sit=Math.max(0,state.sit-dt/.18);if(p.pilotWeapon10!==undefined){p.gun.visible=weapon>0;p.pilotWeapon10=undefined;state.corrections.clear();}
 if(p===player){if(state.jump>.12&&jumpHeight<.02)state.landing=.18;state.jump=jumpHeight;state.landing=Math.max(0,state.landing-dt);}
 const settle=state.landing>0?Math.sin(state.landing/.18*Math.PI)*.022:0;
 p.body.position.y=lerp(-.045,-.48,state.sit)-settle;
 // Let the authored gait control the knees: the former phase-based IK gate
 // abruptly moved an ankle up to 24 cm between adjacent sprint frames.
 if(!vault||p!==player)p.body.rotation.x=lerp(p.body.rotation.x,0,1-Math.exp(-dt*12));
 if(p===player&&onPlanet&&!vault){
  p.root.updateMatrixWorld(true);const bases=p.legs.flatMap((b,i)=>[b,p.knees[i]]).map(b=>[b,b.quaternion.clone()]);
  const grounded=1-THREE.MathUtils.smoothstep(jumpHeight,0,.12),f=frame(p.lat,p.lon,p.heading);
  for(let i=0;i<2;i++){
   const ankle=p.ankles[i].getWorldPosition(V()),point=fromNormal(ankle),floor=groundHeight10(point),height=ankle.length()-R;
   // The authored ankle-to-sole distance is 9.6 cm, not 14.5 cm.
   const near=1-THREE.MathUtils.smoothstep(height-floor,.14,.24),raise=clamp(floor+.098-height,-.025,CITY_CONFIG11.maxFootCorrection)*near*grounded;
   if(Math.abs(raise)>1e-5){
    const a=p.legs[i].getWorldPosition(V()),k=p.knees[i].getWorldPosition(V()),bend=k.sub(a);if(bend.lengthSq()<1e-7)bend.copy(f.f);
    const target=ankle.clone().addScaledVector(ankle.clone().normalize(),raise);
    solveLimb10(p.legs[i],p.knees[i],p.ankles[i],target,bend,1);
   }
  }
  const desired=bases.map(([b,base])=>[b,base,b.quaternion.clone()]);for(const [b,base] of bases)b.quaternion.copy(base);
  for(const [b,base,q] of desired)applyStableCorrection11(state,b,base,q,dt);
 }
 if(armed&&weapon>=3&&weapon!==4&&weapon!==5){p.root.updateMatrixWorld(true);const target=p.gun.localToWorld(V(.015,.07,.27)),up=onPlanet?nAt(p.lat,p.lon):V(0,1,0);solveLimb10(p.arms[1],p.elbows[1],p.hands[1],target,up.multiplyScalar(-1),.65);}
 if(meleePending10&&p===player)p.arms[0].quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(V(1,0,0),-.28));
}
function attack(){if((weapon<2||weapon===4)&&started&&!menuOpen&&!orbit&&!wheelMode&&!activeCar&&!activeHeli&&!activeJet){if(cooldown>0||meleePending10)return;meleePending10={weapon,time:.105};attackTime=.30;return;}attackV9();}
function updateMelee10(dt){if(!meleePending10)return;meleePending10.time-=dt;if(meleePending10.time>0)return;const pending=meleePending10;meleePending10=null;if(weapon!==pending.weapon||activeCar||activeHeli||activeJet)return;attackV9();attackTime=Math.max(attackTime,.18);}
function updatePilot10(dt){if(!player)return;const ride=activeCar||activeHeli||activeJet;if(!ride)return;player.root.visible=true;player.root.userData.ground10=false;const altitude=activeCar?.2:(ride.altitude||0)+.25;placeV9(player.root,ride.lat,ride.lon,ride.heading,altitude);const f=frame(ride.lat,ride.lon,ride.heading);player.root.position.addScaledVector(f.r,activeCar?-.28:0);player.root.userData.ground10=true;ride.driver&&(ride.driver.visible=false);if(dt>0)animateHuman(player,Math.min(dt,.05),0,false);}

function releasePreview10(p){if(!p||p===player)return;const sharedGeometry=new Set([boxGeo,cylGeo,sphereGeo,roundGeo,softSphere,simpleSphere,smallOrb8,...rig7Geometry.values(),...rig7Hair]),sharedMaterial=new Set([npcPaint8,...matCache.values(),...detailedClothCache.values(),...rig7Materials.values()].flat()),sharedTextures=new Set([...sharedMaterial].map(m=>m.map).filter(Boolean)),geometries=new Set(),materials=new Set();p.root.traverse(o=>{if(o.geometry&&!sharedGeometry.has(o.geometry))geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])if(m&&!sharedMaterial.has(m))materials.add(m);});for(const g of geometries)g.dispose();for(const m of materials){if(m.map&&!sharedTextures.has(m.map))m.map.dispose();m.dispose();}p.skeleton.dispose();p.root.removeFromParent();previewRenderer9?.renderLists.dispose();}
