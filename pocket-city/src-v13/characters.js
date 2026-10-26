// Continuous CC0 skin topology. Clothing is painted in bind space, never cut
// into independently rounded / weighted triangle islands at the shoulder.
const heroStyle13={key:'coastal13',headTop:1.87};
function sculptPoint13(point,id){
 const p=point.clone(),x=p.x,y=p.y,z=p.z,head=Math.exp(-Math.pow((y-1.70)/.145,4));
 const chest=Math.exp(-Math.pow((y-1.30)/.23,2))*Math.exp(-Math.pow(x/.34,6));
 p.x*=1+(id===0?.075:id===1?.015:.035)*chest;
 p.z*=1+(id===0?.05:.02)*chest;
 if(y>1.49){
  const jaw=Math.exp(-Math.pow((y-1.605)/.055,2)),cheek=Math.exp(-Math.pow((y-1.70)/.065,2));
  p.x*=1+head*((id===1?.075:.025)*jaw+(id===1?-.018:.012)*cheek);
  p.z+=head*Math.exp(-Math.pow(x/.028,2))*Math.exp(-Math.pow((y-1.682)/.035,2))*(id===1?.004:.002);
  p.z-=head*Math.max(0,-z)*.04;
 }
 if(id===0&&y>.18&&y<1.0){const fade=Math.sin((y-.18)/.82*Math.PI),leg=x<0?-.132:.132;p.x=leg+(p.x-leg)*(1+.12*fade);p.z*=1+.08*fade;}
 return p;
}
function heroGeometry13(id){
 const key='continuous13-'+id+(renderer.isSoftwareRenderer?'-canvas':'');if(rig7Geometry.has(key))return rig7Geometry.get(key);
 const source=sourceGeometry7(rig7.meshes[2]),a=source.attributes,raw=a.position.array,canonical=new Map(),groups=new Map();
 for(let i=0;i<a.position.count;i++){
  const p=V().fromBufferAttribute(a.position,i),k=p.toArray().map(x=>Math.round(x*1e6)).join(',');
  if(!groups.has(k))groups.set(k,[]);groups.get(k).push(i);
 }
 const positions=[],normal=[],uv=[],joints=[],weights=[],bind=[],indices=[];
 for(const [key,list] of groups){
  const original=V().fromBufferAttribute(a.position,list[0]),sum=new Map();
  for(const i of list)for(let k=0;k<4;k++){const bone=a.skinIndex.array[i*4+k],w=a.skinWeight.array[i*4+k];sum.set(bone,(sum.get(bone)||0)+w/list.length);}
  const top=[...sum].sort((x,y)=>y[1]-x[1]).slice(0,4);while(top.length<4)top.push([0,0]);const total=top.reduce((s,v)=>s+v[1],0),q=top.map(v=>Math.round(v[1]/total*255));q[0]+=255-q.reduce((s,v)=>s+v,0);
  canonical.set(key,{p:sculptPoint13(original,id),bind:original,j:top.map(v=>v[0]),w:q});
 }
 for(let i=0;i<a.position.count;i++){
  const k=[a.position.getX(i),a.position.getY(i),a.position.getZ(i)].map(x=>Math.round(x*1e6)).join(','),c=canonical.get(k);
  positions.push(...c.p.toArray());bind.push(...c.bind.toArray());joints.push(...c.j);weights.push(...c.w);uv.push(a.uv.getX(i),a.uv.getY(i));
 }
 for(let i=0;i<source.index.count;i+=3){const tri=[0,1,2].map(k=>source.index.getX(i+k));if(tri.reduce((s,j)=>s+a.position.getY(j),0)/3<.105)continue;indices.push(...tri);}
 const body=new THREE.BufferGeometry();body.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));body.setIndex(indices);body.computeVertexNormals();normal.push(...body.attributes.normal.array);body.dispose();
 for(const list of groups.values()){
  const n=V();for(const i of list)n.add(V(normal[i*3],normal[i*3+1],normal[i*3+2]));n.normalize();for(const i of list){normal[i*3]=n.x;normal[i*3+1]=n.y;normal[i*3+2]=n.z;}
 }
 const baseCount=indices.length,geometryGroups=[];
 // Canvas cannot execute the clothing shader. Keep the same closed topology,
 // but bin whole triangles into shirt / trousers / skin for its material path.
 if(renderer.isSoftwareRenderer){
  const bins=[[],[],[]];
  for(let i=0;i<baseCount;i+=3){const tri=indices.slice(i,i+3),x=tri.reduce((s,j)=>s+bind[j*3],0)/3,y=tri.reduce((s,j)=>s+bind[j*3+1],0)/3,z=tri.reduce((s,j)=>s+bind[j*3+2],0)/3,ax=Math.abs(x);let material=2;
   if(y<1)material=1;else if(y<1.565){let dressed=true;if(id===0){const neck=z>0?1.405+.10*(x/.115)**2:1.505+.03*(x/.115)**2;dressed=ax<.22&&!(ax<.115&&y>neck);}else if(id===1)dressed=ax<.53&&!(z>-.035&&ax<.115&&y>1.41+ax*1.1);else dressed=ax<.699&&!(ax<.066&&y>1.5);material=dressed?0:2;}bins[material].push(...tri);
  }
  indices.length=0;for(let i=0;i<bins.length;i++){geometryGroups.push({start:indices.length,count:bins[i].length,materialIndex:i});indices.push(...bins[i]);}
 }else geometryGroups.push({start:0,count:baseCount,materialIndex:0});
 function append(geo,material,bone){
  const start=indices.length,offset=positions.length/3,attrs=geo.attributes;
  for(let i=0;i<attrs.position.count;i++){const p=V().fromBufferAttribute(attrs.position,i);positions.push(...p.toArray());bind.push(...p.toArray());normal.push(attrs.normal.getX(i),attrs.normal.getY(i),attrs.normal.getZ(i));uv.push(attrs.uv?attrs.uv.getX(i):0,attrs.uv?attrs.uv.getY(i):0);joints.push(bone,0,0,0);weights.push(255,0,0,0);}
  if(geo.index)for(const i of geo.index.array)indices.push(offset+i);else for(let i=0;i<attrs.position.count;i++)indices.push(offset+i);
  geometryGroups.push({start,count:indices.length-start,materialIndex:material});geo.dispose();
 }
 for(let i=0;i<2;i++){
  const bone=rig7.joints.findIndex(n=>rig7.bones[n].name===(i?'foot_l':'foot_r')),x=(i?1:-1)*.132;
  append(shoeShell11(x,false),3,bone);append(shoeShell11(x,true),5,bone);
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normal,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('outfitPosition13',new THREE.Float32BufferAttribute(bind,3));g.setAttribute('skinIndex',new THREE.Uint8BufferAttribute(joints,4));g.setAttribute('skinWeight',new THREE.Uint8BufferAttribute(weights,4,true));g.setIndex(indices);for(const x of geometryGroups)g.addGroup(x.start,x.count,x.materialIndex);g.computeBoundingSphere();g.userData={coastal13:true,refined9:true,wardrobe11:true,continuousShoulders:true};rig7Geometry.set(key,g);source.dispose();return g;
}
function clothMaterial13(id,p){
 const key='cloth13-'+id;if(rig7Materials.has(key))return rig7Materials.get(key);
 const old=p.figure.material,shirt=old[0].clone();shirt.gradientMap=freshRamp9;if(id===1)shirt.map=palmPrint9();
 const skin=new THREE.Color(characterDefs[id].skin),denim=old[1].map||humanCloth('denim13-suit',characterDefs[id].pants,'denim').map,jersey=shirt.map||denim;
 shirt.onBeforeCompile=s=>{
  Object.assign(s.uniforms,{skin13:{value:skin},jersey13:{value:jersey},denim13:{value:denim}});
  s.vertexShader='attribute vec3 outfitPosition13;varying vec3 bindPosition13;\n'+s.vertexShader;
  s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nbindPosition13=outfitPosition13;');
  s.fragmentShader='varying vec3 bindPosition13;uniform vec3 skin13;uniform sampler2D jersey13,denim13;\n'+s.fragmentShader;
  const role=String(id);
  s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   vec3 p13=bindPosition13;float ax13=abs(p13.x);vec3 paint13=skin13;
   if(p13.y<1.0){paint13=texture2D(denim13,vec2(p13.x*1.6+.5,p13.y*.95)).rgb;if(p13.y>.974)paint13*=.52;}
   else if(p13.y<1.565){
    bool dressed13=true;
    if(${role}==0){float neck13=p13.z>0.?1.405+.10*pow(p13.x/.115,2.):1.505+.03*pow(p13.x/.115,2.);dressed13=ax13<.22&&!(ax13<.115&&p13.y>neck13);}
    else if(${role}==1)dressed13=ax13<.53&&!(p13.z>-.035&&ax13<.115&&p13.y>1.41+ax13*1.1);
    else dressed13=ax13<.699&&!(ax13<.066&&p13.y>1.50);
    if(dressed13){vec2 clothUV13=vec2(ax13>.25?(ax13-.25)/.36:.5+p13.x*1.7,clamp((p13.y-1.)*1.65,.01,.99));paint13=texture2D(jersey13,clothUV13).rgb;
     if(${role}==0){paint13=vec3(.94,.94,.88);paint13*=.97+.025*sin(p13.x*370.);}
     if(${role}==1&&p13.z>.03&&ax13<.007&&p13.y<1.405){paint13*=.75;if(abs(mod(p13.y-1.03,.065)-.0325)<.005)paint13=vec3(.83,.85,.73);}
     if(${role}==2){paint13=vec3(.035,.055,.07);if(p13.z>.035&&p13.y>1.16&&ax13<.095*(p13.y-1.16)/.35)paint13=vec3(.81,.84,.81);}
    }
   }
   diffuseColor.rgb=paint13;`);
 };
 shirt.customProgramCacheKey=()=> 'continuous-clothing13-'+id;
 const sole=toon7(id===2?0x1e282d:0xa5b2ae,{gradientMap:freshRamp9}),shoe=toon7(id===2?0x202a2e:0xf0eee3,{gradientMap:freshRamp9});
 const result=[shirt,old[1],old[2],shoe,shirt,sole];rig7Materials.set(key,result);return result;
}
function sweptHair13(){
 // Resculpt the licensed scalp's authored sideburns and front hairline. A
 // uniform ellipsoid reads as a helmet; retain the original swept silhouette.
 const g=sourceGeometry7(rig7.hair[1],false),a=g.attributes.position,colors=[],weld=new Map();
 for(let i=0;i<a.count;i++){
  const x=a.getX(i)*1.055,z=a.getZ(i),height=clamp((a.getY(i)-1.70)/.14,0,1),front=Math.max(0,z/.08);
  const y=1.65+(a.getY(i)-1.65)*.97+.008*front*Math.cos(x*15);
  a.setXYZ(i,x-.006*height,y,z-.009*height);
  const strand=.80+.22*Math.pow(Math.max(0,Math.sin(x*235+z*32)),3)+.14*height;colors.push(strand,strand*.98,strand*.94);
  const key=[a.getX(i),a.getY(i),a.getZ(i)].map(v=>Math.round(v*1e6)).join(',');if(!weld.has(key))weld.set(key,[]);weld.get(key).push(i);
 }
 g.computeVertexNormals();const n=g.attributes.normal;
 for(const list of weld.values()){const sum=V();for(const i of list)sum.add(V().fromBufferAttribute(n,i));sum.normalize();for(const i of list)n.setXYZ(i,sum.x,sum.y,sum.z);}
 g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.computeBoundingSphere();return g;
}

function refineCharacter13(p,id){
 p.edition9=true;p.wardrobeStyle9=['white-rib-tank / loose-indigo-denim','turquoise-palm-shirt / swept-back-hair','tailored-city-suit'][id];p.garment.clear();
 const materials=clothMaterial13(id,p);p.figure.material=materials;p.figure.receiveShadow=false;
 for(const child of [...p.body.children]){
  if(child.isSkinnedMesh&&child!==p.figure&&child.material.side===THREE.BackSide){child.removeFromParent();child.material.dispose();continue;}
  if(!child.isSkinnedMesh||child===p.figure)continue;
  const which=child.geometry===rig7Geometry.get('face0')?0:child.geometry===rig7Geometry.get('face1')?1:-1;if(which<0)continue;
  const key='face13-'+id+'-'+which;let geo=rig7Geometry.get(key);
  if(!geo){geo=sourceGeometry7(rig7.meshes[which]);const pos=geo.attributes.position;for(let i=0;i<pos.count;i++){const v=sculptPoint13(V().fromBufferAttribute(pos,i),id);if(id===1&&which===0&&v.y>1.712)v.y=1.714+(v.y-1.714)*.5;pos.setXYZ(i,v.x,v.y,v.z);}geo.computeVertexNormals();rig7Geometry.set(key,geo);}
  child.geometry=geo;child.receiveShadow=false;
 }
 p.hair.geometry.dispose();let hair=id===1?sweptHair13():rig7Hair[id===0?0:1].clone();
 if(id!==1){const a=hair.attributes.position;for(let i=0;i<a.count;i++){const v=sculptPoint13(V().fromBufferAttribute(a,i),id);v.x*=1.10;v.z=-.018+(v.z+.018)*1.08;a.setXYZ(i,v.x,v.y+.003,v.z);}hair.computeVertexNormals();}
 hair.applyMatrix4(bindInverse9(p,p.head));p.hair.geometry=hair;p.hair.material.color.setHex(id===1?0x3b332c:characterDefs[id].hair);p.hair.material.vertexColors=id===1;p.hair.material.gradientMap=freshRamp9;p.hair.receiveShadow=false;
 p.faceDetails.clear();
 for(const sign of [-1,1]){
  const iris=new THREE.Mesh(new THREE.SphereGeometry(.0078,10,7),toon7(id===1?0x36565b:0x2b2b24));iris.scale.set(.72,.92,.46);iris.position.copy(sculptPoint13(V(sign*.032,1.697,.083),id));attachDetail9(p,p.head,iris);p.faceDetails.add(iris); // reparent after binding retains the same head-local transform
 }
 p.figure.userData.edition9=p.wardrobeStyle9;p.figure.userData.wardrobe11={base:'continuous-CC0-v13',skinnedCollar:true,skinnedShoes:true,role:id};p.figure.userData.appearance13={role:id,closedShoulders:true,continuousWeights:true,head:'sculpted-'+id,hair:id===1?'swept-shell':'trimmed-shell'};
}
