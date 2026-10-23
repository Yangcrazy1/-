// The simulation stays spherical. A local logarithmic projection removes the
// premature visual horizon in street views; overview keeps the real globe.
const cityUniform12={up:{value:V(0,1,0)},enabled:{value:0},radius:{value:R},strength:{value:1}};
let projectionInstalled12=false;
const projectedMaterials12=new WeakSet();
const cityVertex12=`
uniform vec3 cityUp12;
uniform float cityEnabled12,cityRadius12,cityStrength12;
float cityWeight12(vec3 p){float c=clamp(dot(normalize(p),cityUp12),-1.,1.);float d=acos(c)*cityRadius12;return cityEnabled12*cityStrength12*(1.-smoothstep(95.,155.,d));}
vec3 cityFlat12(vec3 p){float r=length(p);if(r<.001||cityEnabled12<.5)return p;vec3 n=p/r;float c=clamp(dot(n,cityUp12),-1.,1.);vec3 t=n-cityUp12*c;float len=length(t),a=atan(len,c);vec3 flattened=cityUp12*r;if(len>.00000001)flattened+=t*(cityRadius12*a/len);return mix(p,flattened,cityWeight12(p));}
vec3 cityNormal12(vec3 normal,vec3 point){vec3 n=normalize(point),v=cross(n,cityUp12);float c=dot(n,cityUp12);vec3 rotated=normal+cross(v,normal)+cross(v,cross(v,normal))/max(.05,1.+c);return normalize(mix(normal,rotated,cityWeight12(point)));}
`;
function flatPoint12(point,origin=player){
 const up=nAt(origin.lat,origin.lon),r=point.length();if(r<1e-6)return point.clone();const n=point.clone().multiplyScalar(1/r),c=clamp(n.dot(up),-1,1),t=n.clone().addScaledVector(up,-c),a=Math.atan2(t.length(),c),d=a*R,w=1-THREE.MathUtils.smoothstep(d,95,155),out=up.clone().multiplyScalar(r);
 if(t.lengthSq()>1e-16)out.addScaledVector(t,R*a/t.length());return point.clone().lerp(out,w);
}
function hookMaterial12(material,object){
 if(!material||projectedMaterials12.has(material)||object===skyDome)return;
 projectedMaterials12.add(material);material.userData.cityProjection12=true;const original=material.onBeforeCompile,cache=material.customProgramCacheKey.call(material);
 material.onBeforeCompile=function(shader,renderer){
  original.call(this,shader,renderer);Object.assign(shader.uniforms,{cityUp12:cityUniform12.up,cityEnabled12:cityUniform12.enabled,cityRadius12:cityUniform12.radius,cityStrength12:cityUniform12.strength});
  let v=shader.vertexShader;
  if(v.includes('#include <project_vertex>')){
   v=v.replace('#include <project_vertex>',`vec4 cityWorldPosition12=vec4(transformed,1.);
    #ifdef USE_BATCHING
    cityWorldPosition12=batchingMatrix*cityWorldPosition12;
    #endif
    #ifdef USE_INSTANCING
    cityWorldPosition12=instanceMatrix*cityWorldPosition12;
    #endif
    cityWorldPosition12=modelMatrix*cityWorldPosition12;
    vec4 mvPosition=viewMatrix*vec4(cityFlat12(cityWorldPosition12.xyz),1.);
    gl_Position=projectionMatrix*mvPosition;`);
   v=v.replace('#include <defaultnormal_vertex>',`#include <defaultnormal_vertex>
    vec4 cityNormalPoint12=vec4(position,1.);
    #ifdef USE_INSTANCING
    cityNormalPoint12=instanceMatrix*cityNormalPoint12;
    #endif
    cityNormalPoint12=modelMatrix*cityNormalPoint12;
    vec3 cityWorldNormal12=vec3(dot(transformedNormal,viewMatrix[0].xyz),dot(transformedNormal,viewMatrix[1].xyz),dot(transformedNormal,viewMatrix[2].xyz));
    transformedNormal=mat3(viewMatrix)*cityNormal12(cityWorldNormal12,cityNormalPoint12.xyz);`);
   v=v.replace('#include <worldpos_vertex>',`#include <worldpos_vertex>
    #if defined(USE_ENVMAP)||defined(DISTANCE)||defined(USE_SHADOWMAP)||defined(USE_TRANSMISSION)||NUM_SPOT_LIGHT_COORDS>0
    worldPosition.xyz=cityFlat12(worldPosition.xyz);
    #endif`);
  }else if(v.includes('vWorld10=n*(')){
   v=v.replace('gl_Position=projectionMatrix*viewMatrix*vec4(vWorld10,1.);','vWaveNormal10=cityNormal12(vWaveNormal10,vWorld10);vWorld10=cityFlat12(vWorld10);gl_Position=projectionMatrix*viewMatrix*vec4(vWorld10,1.);');
  }else if(material.isSpriteMaterial){
   v=v.replace('gl_Position = projectionMatrix * mvPosition;','mvPosition.xyz+=(viewMatrix*vec4(cityFlat12(modelMatrix[3].xyz)-modelMatrix[3].xyz,0.)).xyz;gl_Position=projectionMatrix*mvPosition;');
  }
  shader.vertexShader=cityVertex12+v;
 };
 material.customProgramCacheKey=function(){return cache+'|local-city-projection12';};material.needsUpdate=true;
}
function installProjection12(){
 if(projectionInstalled12||renderer.isSoftwareRenderer)return;projectionInstalled12=true;
 const oldRender=THREE.Object3D.prototype.onBeforeRender,oldShadow=THREE.Object3D.prototype.onBeforeShadow;
 THREE.Object3D.prototype.onBeforeRender=function(r,s,c,g,m,group){oldRender.call(this,r,s,c,g,m,group);if(s===scene)hookMaterial12(m,this);};
 THREE.Object3D.prototype.onBeforeShadow=function(r,o,c,sc,g,m,group){oldShadow.call(this,r,o,c,sc,g,m,group);hookMaterial12(m,this);};
 const renderStack12=[],oldSceneBefore12=THREE.Scene.prototype.onBeforeRender,oldSceneAfter12=THREE.Scene.prototype.onAfterRender;
 THREE.Scene.prototype.onBeforeRender=function(...args){oldSceneBefore12.apply(this,args);renderStack12.push(cityUniform12.enabled.value);const active=this===scene&&!overviewMode&&started;cityUniform12.enabled.value=active?1:0;if(active&&player){cityUniform12.up.value.copy(nAt(player.lat,player.lon));cullCityView12();}};
 THREE.Scene.prototype.onAfterRender=function(...args){oldSceneAfter12.apply(this,args);cityUniform12.enabled.value=renderStack12.pop()??0;};
}
const cameraProxyCache12=new WeakMap();
function cameraObjects12(objects){
 if(renderer.isSoftwareRenderer)return objects;const out=[];
 for(const object of objects){
  const geo=object.geometry;if(!geo)continue;if(!geo.boundingBox)geo.computeBoundingBox();let cache=cameraProxyCache12.get(object);
  if(!cache){cache={mesh:new THREE.Mesh(boxGeo,basic(0x000000))};cache.mesh.matrixAutoUpdate=false;cameraProxyCache12.set(object,cache);}
  const center=geo.boundingBox.getCenter(V()).applyMatrix4(object.matrixWorld),size=geo.boundingBox.getSize(V()),m=object.matrixWorld.elements,axes=[V(m[0],m[1],m[2]).multiplyScalar(size.x),V(m[4],m[5],m[6]).multiplyScalar(size.y),V(m[8],m[9],m[10]).multiplyScalar(size.z)],p=flatPoint12(center);
  const columns=axes.map(a=>flatPoint12(center.clone().addScaledVector(a,.5)).sub(flatPoint12(center.clone().addScaledVector(a,-.5))));
  cache.mesh.matrixWorld.makeBasis(...columns).setPosition(p);out.push(cache.mesh);
 }
 return out;
}
function refreshProjection12(){if(player)cityUniform12.up.value.copy(nAt(player.lat,player.lon));updateFarBlocks12();}

// Explicit screen-only mapping: simulation and weapon rays remain planet-space.
THREE.Vector3.prototype.cityProject12=function(cam){return (projectionInstalled12&&!renderer.isSoftwareRenderer&&started&&!overviewMode?flatPoint12(this):this.clone()).project(cam);};
function screenGround12(x,y){
 if(!projectionInstalled12||!started||overviewMode)return undefined;
 camera.updateMatrixWorld();movementRay.setFromCamera(new THREE.Vector2(x/innerWidth*2-1,-y/innerHeight*2+1),camera);
 const up=nAt(player.lat,player.lon),plane=new THREE.Plane(up,-(R+.083)),hit=V();let out=null;
 for(let i=0;i<3;i++){
  if(!movementRay.ray.intersectPlane(plane,hit))return null;
  const tangent=hit.clone().addScaledVector(up,-hit.dot(up)),d=tangent.length();if(d>94)return null;
  const n=up.clone().multiplyScalar(Math.cos(d/R));if(d>1e-7)n.addScaledVector(tangent,Math.sin(d/R)/d);
  out=fromNormal(n);plane.constant=-(R+groundHeight10(out));
 }
 return out;
}

// Sphere-space bounds are invalid for a tangent view. Cull whole batches using
// their projected bounds rather than disabling view culling for the entire city.
const viewFrustum12=new THREE.Frustum(),viewSphere12=new THREE.Sphere(),viewMatrix12=new THREE.Matrix4();
function cullCityView12(){
 if(!started||overviewMode||!projectionInstalled12)return;
 camera.updateMatrixWorld();viewFrustum12.setFromProjectionMatrix(viewMatrix12.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
 const origin=nAt(player.lat,player.lon).multiplyScalar(R),limit=quality==='流畅'?58:78;
 const visible=(center,radius)=>{viewSphere12.center.copy(flatPoint12(center));viewSphere12.radius=radius;return viewFrustum12.intersectsSphere(viewSphere12);};
 for(const chunk of staticChunks){chunk.root.userData.detailActive12=chunk.center.distanceTo(origin)<limit+chunk.radius;chunk.root.visible=chunk.root.userData.detailActive12&&visible(chunk.center,chunk.radius*1.6);}
 for(const p of peds)if(p.root.parent===actorGroup)p.root.visible=!p.inTaxi&&visible(nAt(p.lat,p.lon).multiplyScalar(R+1),2)&&flatPoint12(p.root.position).distanceTo(camera.position)>1.65;
 for(const c of cars)if(c.root.parent===actorGroup)c.root.visible=c===activeCar||visible(nAt(c.lat,c.lon).multiplyScalar(R+1),4.5);
 for(const h of [...heliFleet,...jetFleet])if(h.root.parent===actorGroup)h.root.visible=h===activeHeli||h===activeJet||visible(h.root.position,8);
}
