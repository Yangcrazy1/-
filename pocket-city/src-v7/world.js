// Deterministic local population and a real-time 300-second solar cycle.
const districtAnchors7=[{lat:-.14,lon:0},{lat:-.10,lon:2.55},{lat:.12,lon:-1.55}];
let populationClock7=0,populationRepairs7=0,dayElapsed7=0,solarHours7=8,solarPhase7='早晨',daylight7=1,skyBodies7=null;
const nightGlass7=[0,1,2].map(i=>new THREE.MeshBasicMaterial({color:[0xffd18c,0xffb8da,0xb8d9ff][i],transparent:true,opacity:0,depthWrite:false}));
function populationNear7(origin=player){return {peds:peds.filter(p=>!p.inTaxi&&distance(p,origin)<38).length,cars:cars.filter(c=>!c.wrecked&&distance(c,origin)<55).length};}
function populateDistrict7(origin,force=false){
 if(!player||!streetSamples.length)return;const candidates=streetSamples.filter(s=>distance(s,origin)<46&&distance(s,origin)>7).sort((a,b)=>distance(a,origin)-distance(b,origin));if(!candidates.length)return;
 const count=populationNear7(origin),pedNeeded=Math.max(0,24-count.peds),carNeeded=Math.max(0,11-count.cars),farPeds=peds.filter(p=>!p.taxiPassenger&&!p.inTaxi&&!p.police&&p.down<=0&&p!==lockPed&&p!==job?.passenger&&distance(p,origin)>85&&distance(p,player)>(force?0:75)),farCars=cars.filter(c=>!c.police&&!c.wrecked&&c!==activeCar&&!c.rangeTarget&&!c.passengerAboard&&!c.marked&&distance(c,origin)>90&&distance(c,player)>(force?0:80));
 let n=0;for(let k=0;k<candidates.length*6&&n<pedNeeded&&farPeds.length;k++){const sample=candidates[Math.floor(k/6)],sign=k%2?1:-1,index=clamp(sample.index+Math.floor((k%6)/2)-1,1,sample.street.points.length-2);let q=null,side=0;for(const width of [.75,.95,.6,1.15].map(x=>sample.street.width/2+x)){const at=streetPoint(sample.street,index,width*sign);if(distance(at,origin)>37||!force&&distance(at,origin)<17||capsuleContact(at,.36,false,0,true)||peds.some(p=>distance(p,at)<1.25))continue;q=at;side=width*sign;break;}if(!q)continue;const p=farPeds.pop();Object.assign(p,{lat:q.lat,lon:q.lon,heading:q.heading,road:sample.street,roadIndex:index,roadDir:k%2?1:-1,side,speed:.75+(k%7)*.10,down:0,panic:0,pause:0,hp:100});p.body.rotation.set(0,0,0);place(p.root,p.lat,p.lon,p.heading,.08);animateHuman(p,.08,p.speed);n++;}
 let cnum=0;for(let k=0;k<candidates.length&&cnum<carNeeded&&farCars.length;k++){const sample=candidates[(k*11)%candidates.length],dir=k%2?1:-1,q=streetPoint(sample.street,sample.index,-1.65,dir);if(sample.street.pedestrian10||!force&&distance(q,origin)<25||cars.some(c=>distance(c,q)<6.4)||collides(q.lat,q.lon,1.05))continue;const c=farCars.pop();Object.assign(c,{lat:q.lat,lon:q.lon,heading:q.heading,road:sample.street,roadIndex:sample.index,roadDir:dir,traffic:true,occupied:true,cruise:6+(k%5),speed:4,turnWait:0,disabled:0});place(c.root,c.lat,c.lon,c.heading,.06);cnum++;}
 populationRepairs7+=n+cnum;if(force)ensureArrivalCrowd12(origin);
}
function fastTravel(id){const ok=fastTravelV6(id);if(ok){populateDistrict7(player,true);budgetClock=1;applySceneBudget(true);place(player.root,player.lat,player.lon,player.heading,.08);updateCamera(.016,true);updateHUD();}return ok;}
function makeBuilding(lat,lon,index,heading){
 const g=makeBuildingV6(lat,lon,index,heading),b=buildings[buildings.length-1];if(index%2===0&&b.h>5){const w=b.w/g.scale.x,d=b.d/g.scale.z;for(let y=3.4;y<b.h-.8;y+=3.0)for(const x of [-.27,.27]){const pane=new THREE.Mesh(new THREE.PlaneGeometry(w*.19,.64),nightGlass7[cityId]);pane.position.set(x*w,y,d/2+.063);pane.castShadow=false;g.add(pane);}}
 addFacadeDetail10(g,b,index);b.heading=heading;g.userData.building12=b;addWarmFacade12(g,b,index);return g;
}
function makeWorld(){atlas8=null;makeWorldV6();for(const base of districtAnchors7)populateDistrict7(base,true);populateDistrict7(player,true);populationClock7=0;applySceneBudget(true);updateSolar7(0);finishWorld9();finishWorld10();makeDistantCity11();finishCity12();}
function updatePeds(dt){updatePedsV6(dt);for(const p of peds)if(p.root.parent===actorGroup&&!p.inTaxi&&p.down<=0&&distance(p,player)<26){if(capsuleContact(p,.33,false,0,true)){resolveOverlap8(p,.34,0);place(p.root,p.lat,p.lon,p.heading,.06);}}populationClock7+=dt;if(populationClock7>3){populationClock7=0;if(!orbit){populateDistrict7(player);applySceneBudget(true);}}}
function solarState7(seconds){const h=(8+seconds/300*24)%24,elevation=Math.sin((h-6)/24*TAU),day=THREE.MathUtils.smoothstep(elevation,-.13,.35),sunset=Math.exp(-(((h-18.1)/1.18)**2)),dawn=Math.exp(-(((h-6.1)/1.1)**2));return {hours:h,elevation,day,sunset,dawn,phase:h<5.5||h>=20?'夜晚':h<7?'晨曦':h<10?'早晨':h<16.7?'白天':h<19.4?'夕阳':'暮色'};}
function updateSolar7(dt){
 dayElapsed7+=dt;const st=solarState7(dayElapsed7);solarHours7=st.hours;solarPhase7=st.phase;daylight7=st.day;if(!scene||!player||overviewMode)return;
 const top=new THREE.Color(0x12213f).lerp(new THREE.Color(0x9ed6e7),st.day).lerp(new THREE.Color(0x8a698d),st.sunset*.7),horizon=new THREE.Color(0x35465d).lerp(new THREE.Color(0xc9e3df),st.day).lerp(new THREE.Color(0xf6a56e),st.sunset*.92).lerp(new THREE.Color(0xe4b6a4),st.dawn*.55);
 scene.background.copy(top);if(scene.fog)scene.fog.color.copy(horizon);const f=frame(player.lat,player.lon,0),theta=(st.hours-6)/24*TAU,dir=f.n.clone().multiplyScalar(Math.sin(theta)).addScaledVector(f.r,Math.cos(theta)).addScaledVector(f.f,-.3).normalize(),anchor=f.n.clone().multiplyScalar(R);
 light.intensity=lerp(.30,1.8,st.day);light.color.setHex(st.sunset>.1?0xffc08c:st.day>.5?0xfff3df:0x9ab8ef);light.position.copy(anchor).addScaledVector(dir,76);if(st.day<.1)light.position.copy(anchor).addScaledVector(f.n,55).addScaledVector(f.r,-35);light.target.position.copy(anchor);light.target.updateMatrixWorld();light.castShadow=st.day>.15&&quality!=='流畅';
 const ambient=scene.children.find(o=>o.isHemisphereLight);if(ambient){ambient.intensity=lerp(.65,1.3,st.day);ambient.color.setHex(st.day>.5?0xe4efef:0x97b5e0);ambient.groundColor.setHex(st.day>.5?0xa9b8a0:0x39415a);}
 for(const m of nightGlass7)m.opacity=(1-st.day)*.88;if(skyDome){const u=skyDome.material.uniforms;u.zenith.value.copy(top);u.horizon.value.copy(horizon);if(u.sunDir){u.sunDir.value.copy(dir);u.night.value=1-st.day;}}
 scene.userData.daylight=st.day;
}
function startGame(){dayElapsed7=0;startGameV6();updateSolar7(0);populateDistrict7(player,true);applySceneBudget(true);}
function adjustResolution(dt,cpuMs){
 if(!started||menuOpen||wheelMode||orbit)return;perfAverage=lerp(perfAverage,Math.min(cpuMs,120),.06);perfClock+=dt;
 // Quality adjusts workload first. Never scale below the canvas CSS resolution.
 if(qualityAuto&&perfClock>3){perfClock=0;const cap=Math.min(devicePixelRatio,coarse?1.6:1.75),floor=Math.min(devicePixelRatio,1.15),next=perfAverage>27?Math.max(floor,resolutionScale-.08):perfAverage<16?Math.min(cap,resolutionScale+.05):resolutionScale;quality=perfAverage>30?'流畅':'均衡';if(Math.abs(next-resolutionScale)>.025){resolutionScale=next;renderer.setPixelRatio?.(next);}budgetClock=1;}
}
