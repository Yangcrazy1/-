// Full-height capsule checks and iterative, height-aware overlap recovery.
function capsuleContact(p,radius=.36,ignoreLow=false,height=0,includeCars=false,ignoreActor=null){
 height+=groundHeight10(p);const v=nAt(p.lat,p.lon).multiplyScalar(R);
 for(const b of nearbyColliders(v,radius+1)){if(ignoreLow&&b.vaultable||height>=(b.h??Infinity)+.03||height+1.76<=(b.minY||0)+.02)continue;const hit=circleContact(v,b,radius);if(hit)return hit;}
 if(includeCars){for(const c of cars){if(c===ignoreActor||height>2.6)continue;let cache=c.contactCache8;if(!cache||cache.lat!==c.lat||cache.lon!==c.lon||cache.heading!==c.heading||cache.width!==c.width||cache.len!==c.len)c.contactCache8=cache={lat:c.lat,lon:c.lon,heading:c.heading,width:c.width,len:c.len,shape:collisionShape(c,true)};if(cache.shape.center.distanceToSquared(v)>Math.max(4.7,(c.len||4)/2+1)**2)continue;const hit=circleContact(v,cache.shape,radius);if(hit)return {...hit,object:c};}for(const h of [...heliFleet,...jetFleet]){if(h===ignoreActor||h.altitude>height+2||distance(h,p)>8)continue;const hit=circleContact(v,h.type==='fighter'?jetFootprint(h):helicopterFootprint(h),radius);if(hit)return {...hit,object:h};}}
 return null;
}
function resolveOverlap8(p,radius=.38,height=0){for(let i=0;i<8;i++){const hit=capsuleContact(p,radius,false,height,true);if(!hit)return true;setSurfacePosition(p,displaceWorld(p,hit.normal.clone().multiplyScalar(Math.min(.7,hit.penetration+.003))));}return !capsuleContact(p,radius,false,height,true);}
function updatePlayer(dt){updatePlayerV7(dt);if(!activeCar&&!activeHeli&&!activeJet&&!vault){resolveOverlap8(player,.38,jumpHeight);place(player.root,player.lat,player.lon,player.heading,jumpHeight+.06);smoothPlayerSupport11(dt);}}
function cameraCandidate8(target,desired,up,objects){
 let limit=target.distanceTo(desired),direction=desired.clone().sub(target).normalize(),side=V().crossVectors(direction,up).normalize();
 for(const offset of [V(),up.clone().multiplyScalar(.20),up.clone().multiplyScalar(-.20),side.clone().multiplyScalar(.20),side.clone().multiplyScalar(-.20)]){camRay.set(target.clone().add(offset),direction);camRay.far=limit;const hit=camRay.intersectObjects(objects,false)[0];if(hit)limit=Math.min(limit,Math.max(.62,hit.distance-.23));}
 return target.clone().addScaledVector(direction,limit);
}
function updateCamera(dt,force=false){
 if(!started||orbit||activeCar||activeHeli||activeJet){updateCameraV7(dt,force);return;}
 overviewState(false);const a=frame(player.lat,player.lon,viewYaw),anchor=a.n.clone().multiplyScalar(R),support=player.visualSupport11??groundHeight10(player),target=anchor.clone().addScaledVector(a.n,1.08+support+jumpHeight*.7).addScaledVector(a.f,.05),objects=nearbyColliders(anchor,20).filter(b=>b.mesh).flatMap(b=>b.cameraMeshes||[b.mesh]);
 for(const c of cars)if(distance(c,player)<13){const shape=collisionShape(c,true),h=c.tank?2.25:c.type==='van'?2.15:1.65,proxy=c.cameraProxy8||(c.cameraProxy8=new THREE.Mesh(boxGeo,basic(0x000000)));proxy.matrixAutoUpdate=false;proxy.matrixWorld.compose(shape.center.clone().addScaledVector(shape.n,h/2),new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(shape.e,shape.n,shape.f)),V(shape.w,h,shape.d));objects.push(proxy);}
 let desired=null,best=-Infinity,selected=0,candidates=[];for(const [side,height] of [[.35,3.1],[-.65,3.9],[1.3,4.2],[-1.5,4.4],[.35,5.9],[-3,5.7],[3,5.7]]){const candidate=anchor.clone().addScaledVector(a.f,-6.2-viewPitch*.8).addScaledVector(a.n,height+support+viewPitch*2).addScaledVector(a.r,side),safe=cameraCandidate8(target,candidate,a.n,objects),score=Math.min(1,target.distanceTo(safe)/target.distanceTo(candidate))*10-Math.abs(side)*.2-(height-3.6)*.15;candidates.push({safe,score});if(score>best){best=score;desired=safe;selected=candidates.length-1;}}
 const previous=candidates[player.cameraSlot11??0];if(previous&&previous.score+CITY_CONFIG11.cameraHysteresis>=best){desired=previous.safe;}else player.cameraSlot11=selected;
 if(force||!cameraInitialized){camera.position.copy(desired);cameraInitialized=true;}else camera.position.lerp(desired,1-Math.exp(-Math.min(dt,.1)*9));camera.position.copy(cameraCandidate8(target,camera.position,a.n,objects));if(camera.position.length()<R+.65)camera.position.normalize().multiplyScalar(R+.65);
 camera.up.copy(a.n);camera.lookAt(target);camera.fov=lerp(camera.fov,innerWidth<innerHeight?61:55,1-Math.exp(-dt*6));camera.updateProjectionMatrix();if(skyDome){skyDome.position.copy(camera.position);skyDome.material.uniforms.localUp.value.copy(a.n);}if(scene.fog){scene.fog.near=65;scene.fog.far=170;}
}

// A curb is physical, but the rendered body need not snap vertically by 8 cm.
function smoothPlayerSupport11(dt){
 const floor=groundHeight10(player),previous=player.visualSupportPoint11;
 if(player.visualSupport11===undefined||!previous||distance(previous,player)>2)player.visualSupport11=floor;
 else player.visualSupport11=lerp(player.visualSupport11,floor,1-Math.exp(-dt*22));
 player.visualSupportPoint11={lat:player.lat,lon:player.lon};
 player.root.position.setLength(R+player.visualSupport11+jumpHeight+.06);
}
