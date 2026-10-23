// V0.8: shared static atlas, allocation-light distances and render-rate animation.
// Inspired by the MIT Three.js batching and animation examples; see OPEN_SOURCE.md.
let atlas8=null,animationCollect8=false;
const textMaterialCache8=new Map();
function textMaterial(text,bg='#183d38',fg='#d8f0bf',w=512,h=128){const key=[text,bg,fg,w,h].join('|');if(!textMaterialCache8.has(key))textMaterialCache8.set(key,textMaterialV7(text,bg,fg,w,h));return textMaterialCache8.get(key);}
const npcShellCache8=new Map(),npcPaint8=new THREE.MeshToonMaterial({vertexColors:true,gradientMap:gradient});
function paintNPC8(geometry,mats){if(geometry.userData.vertexPaint8)return geometry;const colors=new Float32Array(geometry.attributes.position.count*3);for(const group of geometry.groups){const c=mats[group.materialIndex].color;for(let i=group.start;i<group.start+group.count;i++){const vertex=geometry.index.getX(i);colors.set([c.r,c.g,c.b],vertex*3);}}geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));geometry.clearGroups();geometry.userData.vertexPaint8=true;return geometry;}
const smallOrb8=new THREE.SphereGeometry(1,8,6);
function distance(a,b){const x=Math.sin((b.lat-a.lat)*.5),y=Math.sin((b.lon-a.lon)*.5),h=clamp(x*x+Math.cos(a.lat)*Math.cos(b.lat)*y*y,0,1);return 2*R*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));}
function roundBox(parent,m,x,y,z,w,h,d){const tiny=Math.min(w,h,d)<.11;return mesh(renderer.isSoftwareRenderer||tiny?boxGeo:roundGeo,m,parent,x,y,z,w,h,d);}
function smoothOrb(parent,m,x,y,z,w,h=w,d=w){return mesh(renderer.isSoftwareRenderer?simpleSphere:Math.max(w,h,d)<.32?smallOrb8:softSphere,m,parent,x,y,z,w,h,d);}
function npcShell8(id){
 const key=id%crowdDefs.length;let seed=npcShellCache8.get(key);
 if(!seed){seed=makeCharacterV6(id,true);for(const name of ['pistol','smg','bat','katana','launcher','shotgun','rifle'])if(seed[name])seed[name].name='npc-shell-'+name;npcShellCache8.set(key,seed);}
 const root=new THREE.Group(),body=new THREE.Group(),gun=seed.gun.clone(true),shadow=seed.shadow.clone(true);root.add(body,shadow);body.add(gun);
 const p=Object.assign({},seed,{root,body,gun,shadow,id,phase:rng()*TAU});for(const name of ['pistol','smg','bat','katana','launcher','shotgun','rifle'])p[name]=gun.getObjectByName('npc-shell-'+name)||new THREE.Group();return p;
}
function ensureAtlas8(){
 if(atlas8)return atlas8;const canvas=document.createElement('canvas');canvas.width=canvas.height=4096;const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,4096,4096);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.generateMipmaps=false;texture.minFilter=texture.magFilter=THREE.LinearFilter;
 atlas8={canvas,ctx,texture,tiles:new Map(),next:1,x:8,y:0,row:8,material:new THREE.MeshToonMaterial({map:texture,vertexColors:true,gradientMap:gradient})};return atlas8;
}
function atlasTile8(map){
 const a=ensureAtlas8();if(!map?.image)return {x:0,y:0,w:1,h:1};if(a.tiles.has(map))return a.tiles.get(map);
 const image=map.image,aspect=image.width/Math.max(1,image.height),w=aspect>2?128:128,h=aspect>2?32:aspect<.8?256:128;if(a.x+w+4>4096){a.x=0;a.y+=a.row;a.row=0;}if(a.y+h+4>4096)throw Error('City atlas is full');const t={x:a.x,y:a.y,w,h};a.x+=w+4;a.row=Math.max(a.row,h+4);a.next++;a.ctx.drawImage(image,t.x+2,t.y+2,w,h);a.tiles.set(map,t);a.texture.needsUpdate=true;return t;
}
function staticBatch(root){
 root.updateMatrixWorld(true);const atlas=ensureAtlas8(),buckets=new Map(),remove=[];
 root.traverse(o=>{
  if(!o.isMesh||o.isSkinnedMesh||Array.isArray(o.material))return;
  const m=o.material,emissive=m.emissive&&m.emissive.getHex()>0,eligible=!m.transparent&&!emissive&&!m.isShaderMaterial;
  const material=eligible?atlas.material:m;let g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(o.matrixWorld);
  const pos=g.attributes.position,uv=g.attributes.uv,color=new Float32Array(pos.count*3);
  if(eligible){const t=atlasTile8(m.map),c=m.color||new THREE.Color(0xffffff),coords=new Float32Array(pos.count*2);for(let i=0;i<pos.count;i++){coords[i*2]=(t.x+2+clamp(uv?uv.getX(i):.5,0,1)*t.w)/4096;coords[i*2+1]=1-(t.y+2+t.h-clamp(uv?uv.getY(i):.5,0,1)*t.h)/4096;color.set([c.r,c.g,c.b],i*3);}g.setAttribute('uv',new THREE.BufferAttribute(coords,2));}
  else color.fill(1);
  g.setAttribute('color',new THREE.BufferAttribute(color,3));if(!buckets.has(material))buckets.set(material,[]);buckets.get(material).push(g);remove.push(o);
 });
 for(const o of remove)o.removeFromParent();root.clear();
 for(const [m,list] of buckets){const count=list.reduce((n,g)=>n+g.attributes.position.count,0),g=new THREE.BufferGeometry();for(const [key,size] of [['position',3],['normal',3],['uv',2],['color',3]]){const a=new Float32Array(count*size);let offset=0;for(const item of list){if(item.attributes[key])a.set(item.attributes[key].array,offset);offset+=item.attributes.position.count*size;}g.setAttribute(key,new THREE.BufferAttribute(a,size));}for(const item of list)item.dispose();g.computeBoundingSphere();const o=new THREE.Mesh(g,m);o.castShadow=o.receiveShadow=true;root.add(o);}
}
function collectAnimations8(){animationCollect8=true;}
function flushAnimations8(dt){animationCollect8=false;for(const p of [player,...peds]){if(!p?.visualInput8||p.inTaxi||p.down>0||p.npc&&p.root.parent===actorParking)continue;const v=p.visualInput8;animateHuman(p,Math.min(dt,.1),v.speed,v.armed);}}
