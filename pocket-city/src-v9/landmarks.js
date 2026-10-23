// Original coastal props and Egyptian-inspired landmark architecture.
function prop9(point,heading=0,name=''){const g=new THREE.Group();g.name=name;cityGroup.add(g);place(g,point.lat,point.lon,heading);return g;}
function obstacle9(point,heading,w,d,h,kind,minY=0){const f=frame(point.lat,point.lon,heading),proxy=new THREE.Mesh(boxGeo,basic(0xffffff));proxy.matrixAutoUpdate=false;proxy.matrixWorld.compose(f.n.clone().multiplyScalar(R+(h+minY)/2),new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(f.r,f.n,f.f)),V(w,h-minY,d));const b={...point,n:f.n,e:f.r,f:f.f,center:f.n.clone().multiplyScalar(R),w,d,h,minY,kind,mesh:proxy,cameraMeshes:[proxy]};staticObstacles.push(b);buildingMeshes.push(proxy);return b;}
function addBeachBase9(){
 const sand=mat(0xf2ddb1),wood=mat(0xc89d72),cream=mat(0xf5eed8),teal=mat(0x4c9898),coral=mat(0xd8806b);
 const promenade=Array.from({length:49},(_,i)=>localPoint9(beach9,17,-28+i*56/48));roadRibbon9(cityGroup,promenade,3.5,.046,cream);
 const pier=Array.from({length:71},(_,i)=>localPoint9(beach9,-51+i*.96,0));roadRibbon9(cityGroup,pier,2.8,.065,wood);
 for(let i=0;i<65;i++){const x=-50+i;roadRibbon9(cityGroup,[localPoint9(beach9,x,-1.32),localPoint9(beach9,x,1.32)],.045,.074,cream);}
 for(const z of [-1.48,1.48])for(let x=-49;x<13;x+=4){const p=localPoint9(beach9,x,z),g=prop9(p,0,'码头护栏');box(g,cream,0,.5,0,.08,1,.08);box(g,cream,1,.91,0,2,.065,.07);obstacle9(p,0,.12,.12,1,'码头立柱');}
 for(const [x,z,color] of [[-10,-18,0xd68c77],[-2,-12,0x6faaa5],[-11,12,0xe5b35e],[-2,19,0x8dabc3],[7,11,0xd4909e],[6,-20,0x78aaa2]]){
  const p=localPoint9(beach9,x,z),g=prop9(p,0,'沙滩遮阳伞');cyl(g,cream,0,1.05,0,.045,2.1);const cap=new THREE.Mesh(new THREE.ConeGeometry(1.9,.6,12),mat(color));cap.position.y=2.28;g.add(cap);cyl(g,cream,0,2.61,0,.09,.15);box(g,mat(color),.5,.035,1.4,1,.035,2);obstacle9(p,0,.12,.12,2.6,'遮阳伞杆');
 }
 const hutAt=localPoint9(beach9,10,23),hut=prop9(hutAt,Math.PI,'海湾救生屋');for(const x of [-1,1])for(const z of [-.8,.8])box(hut,wood,x,.8,z,.12,1.6,.12);box(hut,cream,0,1.7,0,2.5,.15,2);box(hut,teal,0,2.35,-.4,2.2,1.2,1.2);box(hut,mat(0xc7e3da),0,2.45,.24,1.5,.65,.035);box(hut,coral,0,3.07,0,2.9,.18,2.5);sign(hut,'LIFEGUARD',0,2.85,1.02,2,.3,'#4c8987','#fff5df');obstacle9(hutAt,Math.PI,2.6,2.1,3.2,'海湾救生屋');
 for(const z of [-25,-9,9,26]){const p=localPoint9(beach9,22,z);makePalmAsset(p.lat,p.lon,1.15);obstacle9(p,0,.5,.5,5,'海岸棕榈');const b=prop9(localPoint9(beach9,19.4,z+2),Math.PI/2,'海边长椅');box(b,wood,0,.48,0,1.8,.12,.55);box(b,wood,0,.85,-.27,1.8,.55,.09);for(const x of [-.65,.65])box(b,teal,x,.24,0,.09,.48,.4);}
 for(let i=0;i<4;i++){const points=Array.from({length:31},(_,j)=>localPoint9(beach9,-29-i*5+Math.sin(j*.43+i)*.65,-30+j*2));roadRibbon9(cityGroup,points,.20,.031,mat(0xd1ece0));}
 const title=prop9(localPoint9(beach9,17,-25),Math.PI/2,'海湾入口');sign(title,'LIBERTY BAY',0,2,0,4.2,.7,'#397d79','#fff1cf');for(const x of [-1.7,1.7])box(title,wood,x,1,0,.1,2,.12);
 landmarks9.push({id:'beach',name:'自由城 · 海湾沙滩',district:1,...localPoint9(beach9,-45,0),heading:-Math.PI/2,arrival:localPoint9(beach9,-17,-6),description:'细沙、棕榈、彩色遮阳伞与可步行的海上木栈桥'});
}
function addCasino9(){
 const origin=campus9,h=origin.heading,stone=mat(0xe4c598),ivory=mat(0xf1dfb7),gold=mat(0xca9c4c),blue=mat(0x417d89),glass=mat(0x86b4ae),g=prop9(origin,h,'THE OASIS / 绿洲赌场');
 const approach=Array.from({length:17},(_,i)=>localPoint9(origin,0,7+i*1.8,h));roadRibbon9(cityGroup,approach,6,.04,ivory);
 box(g,stone,0,3.8,0,22,7.6,14);box(g,ivory,0,7.7,0,22.8,.35,14.8);box(g,gold,0,6.2,7.11,22.3,.22,.18);
 for(const x of [-9,-6,-3,3,6,9]){box(g,glass,x,4.2,7.06,2.2,3.4,.06);cyl(g,ivory,x,3.2,8,.42,6.4);cyl(g,gold,x,6.1,8,.58,.32);cyl(g,gold,x,.34,8,.58,.28);}
 box(g,blue,0,2.1,7.09,3.1,4.2,.12);for(const x of [-.8,.8])box(g,gold,x,2,7.19,.045,3.8,.035);
 const pyramid=new THREE.Mesh(new THREE.ConeGeometry(10.3,7.8,4),ivory);pyramid.rotation.y=Math.PI/4;pyramid.position.y=11.7;g.add(pyramid);const peak=new THREE.Mesh(new THREE.ConeGeometry(1.2,1.3,4),gold);peak.rotation.y=Math.PI/4;peak.position.y=15.1;g.add(peak);
 sign(g,'THE OASIS',0,7.07,8.48,8.5,.75,'#346f73','#fff0be');sign(g,'CASINO · 绿洲赌场',0,5.92,8.46,7.2,.44,'#346f73','#f4deb2');
 for(const x of [-10.4,10.4]){box(g,gold,x,1.4,8.2,.5,2.8,.5);const flame=new THREE.Mesh(new THREE.OctahedronGeometry(.55),mat(0xd9ad67));flame.position.set(x,3.1,8.2);g.add(flame);}
 obstacle9(origin,h,23,15,15.8,'绿洲赌场');for(const x of [-9,-6,-3,3,6,9])obstacle9(localPoint9(origin,x,8,h),h,1,1,6.4,'赌场廊柱');
 landmarks9.push({id:'casino',name:'圣安地列斯 · 绿洲赌场',district:0,...origin,heading:h,arrival:localPoint9(origin,0,30,h),description:'金色金字塔、砂岩柱廊与蓝绿玻璃的城市地标'});
 const left=localPoint9(origin,-19,3,h),right=localPoint9(origin,19,3,h),s=nearStreet(left).distance>nearStreet(right).distance?left:right;addSphinx9(s,h);
}
function addSphinx9(p,h){
 const g=prop9(p,h,'狮身人面像'),stone=mat(0xd9b77f),lightStone=mat(0xe6c994),shadow=mat(0xba915d),blue=mat(0x467b87),gold=mat(0xdfb45a);
 box(g,lightStone,0,.22,0,7,.42,12);smoothOrb(g,stone,0,1.48,-.8,2.45,1.38,3.8);for(const x of [-1.9,1.9]){smoothOrb(g,stone,x,.73,3.3,.69,.58,2.2);for(let i=0;i<3;i++)box(g,shadow,x-.28+i*.28,.48,5.38,.045,.24,.08);}
 smoothOrb(g,stone,0,2.35,2,1.25,1.6,1.4);smoothOrb(g,lightStone,0,4.15,2.9,1.13,1.25,.86);box(g,lightStone,0,4.37,3.74,.25,.42,.38);box(g,shadow,0,3.7,3.69,.67,.07,.055);box(g,gold,0,3.2,3.59,.35,.75,.28);
 for(const x of [-1,1]){const hood=box(g,blue,x*1.12,4.07,2.9,.55,2.75,1.25);hood.rotation.z=-x*.15;for(let i=0;i<8;i++)box(g,gold,x*(1.13+(4-i)*.025),3.05+i*.29,3.55,.58,.10,.09);smoothOrb(g,shadow,x*.42,4.6,3.66,.22,.075,.065);box(g,blue,x*.43,4.77,3.6,.57,.12,.08);}
 smoothOrb(g,blue,0,5.33,2.82,1.32,.62,1.1);for(let i=0;i<6;i++)box(g,gold,0,5.07+i*.12,3.5,1.9-i*.16,.047,.045);cyl(g,gold,0,5.73,3.35,.08,.42);smoothOrb(g,gold,0,5.98,3.38,.14,.18,.1);
 const tail=new THREE.Mesh(new THREE.TorusGeometry(1,.12,5,18,Math.PI*1.6),stone);tail.rotation.x=Math.PI/2;tail.position.set(1.6,.68,-3.2);g.add(tail);
 obstacle9(p,h,6.5,11.8,6.2,'狮身人面像');landmarks9.push({id:'sphinx',name:'圣安地列斯 · 狮身人面像',district:0,...p,heading:h,arrival:localPoint9(p,0,12,h),description:'狮身、前爪、人面与蓝金条纹头巾的原创砂岩雕像'});
}
function makeDistrictLandmarks(){makeDistrictLandmarksV7();landmarks9=[];addBeach9();addCasino9();makeBayArchitecture10();addVegetation10();makeSignals10();}
function finishWorld9(){if(atlas8)atlas8.material.gradientMap=freshRamp9;npcPaint8.gradientMap=freshRamp9;scene.userData.edition9={islands:3,landmarks:landmarks9.map(p=>({id:p.id,name:p.name,lat:p.lat,lon:p.lon})),streets:streets.length};mapCache9=null;}
