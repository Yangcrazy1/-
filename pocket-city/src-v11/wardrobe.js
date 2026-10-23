// The V0.9 adult body remains the base. Clothing details deform with that body.
// Rigid torso plaques and bare-foot silhouettes were visible regressions.
function wardrobeFront11(id){
 return canvasTexture(256,256,(g,W,H)=>{
  if(id===1)g.drawImage(palmPrint9().image,0,0,W,H);else{g.fillStyle='#293b43';g.fillRect(0,0,W,H);}
  const xy=(x,y)=>[(.5+x*1.7)*W,(1-(y-1)*1.65)*H];
  const poly=(color,points)=>{g.fillStyle=color;g.beginPath();points.forEach((p,i)=>{const [x,y]=xy(...p);i?g.lineTo(x,y):g.moveTo(x,y);});g.closePath();g.fill();};
  if(id===1){
   poly('#529b91',[[-.085,1.50],[-.13,1.43],[-.065,1.39],[0,1.45]]);
   poly('#75bdae',[[.085,1.50],[.13,1.43],[.065,1.39],[0,1.45]]);
   g.strokeStyle='#4d968d';g.lineWidth=2;g.beginPath();g.moveTo(...xy(0,1.43));g.lineTo(...xy(0,1.015));g.stroke();
   g.fillStyle='#e0dfc5';for(let y=1.40;y>1.04;y-=.068){const [x,yy]=xy(.012,y);g.beginPath();g.arc(x,yy,1.6,0,TAU);g.fill();}
  }else{
   poly('#dfdfd0',[[-.075,1.51],[.075,1.51],[.052,1.36],[0,1.15],[-.052,1.36]]);
   poly('#52616a',[[-.09,1.51],[-.155,1.33],[-.105,1.30],[-.15,1.25],[-.025,1.10],[0,1.27]]);
   poly('#354b55',[[.09,1.51],[.155,1.33],[.105,1.30],[.15,1.25],[.025,1.10],[0,1.27]]);
   poly('#617c79',[[0,1.45],[.022,1.39],[.014,1.22],[0,1.18],[-.014,1.22],[-.022,1.39]]);
   poly('#e7e4d7',[[-.075,1.51],[0,1.46],[-.033,1.39],[-.089,1.46]]);
   poly('#c6cec5',[[.075,1.51],[0,1.46],[.033,1.39],[.089,1.46]]);
   g.fillStyle='#8d9d96';for(let y=1.12;y>1.02;y-=.06){const [x,yy]=xy(.025,y);g.beginPath();g.arc(x,yy,1.4,0,TAU);g.fill();}
  }
 });
}
function finishWardrobe11(p,id){
 const key='wardrobe11-'+id;let geo=rig7Geometry.get(key),mats=rig7Materials.get(key);
 // Chest decoration must share the skin, not follow one chest bone as a board.
 p.garment.clear();
 if(!mats){
  const front=toon7(id===1?0xffffff:0xd5e0db,{map:wardrobeFront11(id),gradientMap:freshRamp9});
  const sole=toon7(id===2?0x222d30:0xc3cbbd,{gradientMap:freshRamp9});mats=[...p.figure.material,front,sole];rig7Materials.set(key,mats);
 }
 if(!geo){
  const source=p.figure.geometry,a=source.attributes,bins=Array.from({length:6},()=>[]);
  for(const group of source.groups)for(let i=group.start;i<group.start+group.count;i+=3){
   const vs=[0,1,2].map(k=>source.index.getX(i+k));let material=group.materialIndex;
   const center=vs.reduce((v,j)=>v.add(V().fromBufferAttribute(a.position,j)),V()).multiplyScalar(1/3);
   if(material===3&&center.y<.105)continue;
   if(id>0&&material===0&&Math.abs(center.x)<.215&&center.z>.035)material=4;
   for(const j of vs){const pos=V().fromBufferAttribute(a.position,j),normal=V().fromBufferAttribute(a.normal,j),uv=material===4?[clamp(.5+pos.x*1.7,.01,.99),clamp((pos.y-1)*1.65,.01,.99)]:[a.uv.getX(j),a.uv.getY(j)];bins[material].push({pos,normal,uv,joints:Array.from(a.skinIndex.array.slice(j*4,j*4+4)),weights:Array.from(a.skinWeight.array.slice(j*4,j*4+4))});}
  }
  const append=(g,material,bone)=>{
   const src=g.index?g.toNonIndexed():g,joint=p.skeleton.bones.indexOf(bone);
   for(let j=0;j<src.attributes.position.count;j++)bins[material].push({pos:V().fromBufferAttribute(src.attributes.position,j),normal:V().fromBufferAttribute(src.attributes.normal,j),uv:src.attributes.uv?[src.attributes.uv.getX(j),src.attributes.uv.getY(j)]:[0,0],joints:[joint,0,0,0],weights:[255,0,0,0]});src.dispose();if(src!==g)g.dispose();
  };
  for(let i=0;i<2;i++){
   const x=(i?1:-1)*.132,foot=p.ankles[i];
   append(shoeShell11(x,false),3,foot);
   append(shoeShell11(x,true),5,foot);
   if(id!==2)for(let k=0;k<3;k++)append(new THREE.BoxGeometry(.085,.006,.008).translate(x,.087,-.030+k*.021),5,foot);
  }
  const pos=[],normal=[],uv=[],joints=[],weights=[];geo=new THREE.BufferGeometry();let count=0;
  for(let material=0;material<bins.length;material++){geo.addGroup(count,bins[material].length,material);for(const v of bins[material]){pos.push(...v.pos.toArray());normal.push(...v.normal.toArray());uv.push(...v.uv);joints.push(...v.joints);weights.push(...v.weights);}count+=bins[material].length;}
  geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(normal,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setAttribute('skinIndex',new THREE.Uint8BufferAttribute(joints,4));geo.setAttribute('skinWeight',new THREE.Uint8BufferAttribute(weights,4,true));geo.setIndex(Array.from({length:count},(_,i)=>i));geo.computeBoundingSphere();geo.userData={refined9:true,wardrobe11:true};rig7Geometry.set(key,geo);
 }
 const original=p.figure.geometry;for(const child of p.body.children)if(child.isSkinnedMesh&&child.geometry===original)child.geometry=geo;p.figure.material=mats;
 p.figure.userData.wardrobe11={base:'v0.9',skinnedCollar:true,skinnedShoes:true,role:id};
}

function shoeShell11(x,sole){
 const levels=sole?[[.086,.142,-.044,-.009],[.089,.144,-.044,.003],[.086,.140,-.045,.016]]:[[.085,.138,-.045,.009],[.086,.138,-.045,.033],[.078,.125,-.052,.067],[.061,.100,-.065,.092],[.038,.064,-.078,.108]];
 const positions=[],indices=[],N=20;for(const [w,d,z,y] of levels)for(let i=0;i<N;i++){const a=i/N*TAU,s=Math.sin(a),c=Math.cos(a);positions.push(x+Math.sign(s)*Math.abs(s)**.75*w,y,z+Math.sign(c)*Math.abs(c)**.78*d);}
 for(let j=0;j<levels.length-1;j++)for(let i=0;i<N;i++){const a=j*N+i,b=j*N+(i+1)%N,c=a+N,d=b+N;indices.push(a,b,c,b,d,c);}
 const last=(levels.length-1)*N;for(let i=1;i<N-1;i++)indices.push(last,last+i,last+i+1,0,i+1,i);
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();return g;
}
