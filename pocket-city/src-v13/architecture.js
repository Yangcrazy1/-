// Original island-city art direction, inspired by the user's coastal reference.
const islandStyle13={cream:0xf6f1e6,navy:0x244a68,roof:0x3a759c,coral:0xde7950};
Object.assign(themes[0],{build:[0xe9a05f,0xdf7958,0xf2ce8e,0xc96f58,0xa9c9c4,0xf0dfbd],roof:0x457ba2,road:0x34454c});
Object.assign(themes[1],{build:[0x58b5bd,0xf0ae78,0xe37f64,0x94cbd2,0xe6d8b9,0x9facce],roof:0x3573a2,road:0x364b56});
Object.assign(themes[2],{build:[0x3d6287,0x7d9ab1,0xdfb78c,0x93bec7,0xd8835c,0xd7dce0],roof:0x2b5070,road:0x34454c});
Object.assign(characterDefs[0],{shirt:0xf6f3e8,pants:0x35577d,skin:0x956443,hair:0x222925});
Object.assign(characterDefs[1],{shirt:0x43aeb7,pants:0x29445e,skin:0xd3a280,hair:0x2b2926});
Object.assign(palette9,{ocean:0x24aeca,shallows:0x78dcd4,sand:0xefd09b,grass:[0x8abd76,0x87bd83,0x8dbb88]});
function buildingFacade(kind,color){
 const key='island13-'+cityId+'-'+kind+'-'+color;if(buildingFaceCache.has(key))return buildingFaceCache.get(key);
 // Preserve the world generator's old random sequence without drawing 4,500
 // near-invisible noise rectangles into every facade texture.
 // canvasTexture already restores the world RNG; no random draws escape it.
 const t=canvasTexture(256,512,(g,W,H)=>{
  g.fillStyle='#'+new THREE.Color(color).getHexString();g.fillRect(0,0,W,H);
  const floors=cityId===0?[1,1,1,3,2,2,1][kind]:cityId===1?[4,3,1,4,2,5,1][kind]:[7,4,3,2,2,3,1][kind],columns=cityId===2&&kind===0?3:2,row=H/floors,col=W/columns;
  for(let y=0;y<floors;y++){
   g.fillStyle='#ffffff65';g.fillRect(0,y*row,W,3);
   for(let x=0;x<columns;x++){
    const xx=x*col+col*.22,yy=y*row+row*.20,ww=col*.56,hh=row*(cityId===0?.43:.55);
    g.fillStyle='#1e384929';g.fillRect(xx-5,yy-3,ww+13,hh+14);
    g.fillStyle='#fcf6e9';g.fillRect(xx-5,yy-5,ww+10,hh+11);
    const grad=g.createLinearGradient(xx,yy,xx+ww,yy+hh);grad.addColorStop(0,'#6f9fb9');grad.addColorStop(.46,'#315c7c');grad.addColorStop(1,'#26465f');g.fillStyle=grad;g.fillRect(xx,yy,ww,hh);
    g.fillStyle='#e5f0ed55';g.beginPath();g.moveTo(xx+2,yy+2);g.lineTo(xx+ww*.65,yy+2);g.lineTo(xx+2,yy+hh*.8);g.fill();
    g.fillStyle='#f7f2e4';g.fillRect(xx+ww*.49,yy,2.5,hh);if(cityId!==2)g.fillRect(xx,yy+hh*.53,ww,2.5);
    g.fillStyle='#ffffed';g.fillRect(xx-7,yy+hh+5,ww+14,4);
   }
  }
  g.fillStyle='#ffffff22';g.fillRect(0,0,4,H);g.fillStyle='#1a415118';g.fillRect(W-3,0,3,H);
 });
 const material=new THREE.MeshToonMaterial({map:t,gradientMap:freshRamp9});buildingFaceCache.set(key,material);return material;
}
function decorateIslandBuilding13(g,b,index){
 const w=b.w/g.scale.x,d=b.d/g.scale.z,h=b.h/g.scale.y,cream=mat(islandStyle13.cream),blue=mat(themes[cityId].roof),front=d/2+.10;
 box(g,cream,0,h-.02,0,w+.20,.15,d+.20);box(g,cream,0,.17,0,w+.14,.24,d+.14);
 if(index%3===1){for(const x of [-w/2+.06,w/2-.06])box(g,cream,x,h/2,front,.11,h,.10);}
 if(index%7===2){box(g,blue,0,2.65,front+.40,w*.94,.16,1.05);box(g,cream,0,2.48,front+.88,w*.94,.23,.10);}
 if(index%8===0&&h>6){box(g,blue,0,h+.38,0,w*.66,.55,d*.67);box(g,cream,0,h+.69,0,w*.70,.10,d*.72);}
}
function surfaceColor9(lat,lon){
 const p={lat,lon},d=coastDistance10(p);if(d>13)return 0x299cbd;if(d>3)return 0x3fc9cc;if(d>0)return 0x9be5d8;if(d> -5)return 0xcba875;if(d> -13||inBeach9(p))return palette9.sand;return palette9.grass[districtAt(lat,lon)];
}
function finishCity13(){
 const root=new THREE.Group();root.name='White coastal bridge rails';world.add(root);const white=mat(0xf1e8d5),stone=mat(0xc6b394);let used=0;
 outer:for(const road of streets.slice(0,11))for(let i=4;i<road.points.length-7;i+=6){
  const p=road.points[i],field=islandField9(p.lat,p.lon);if(field<1.02||field>1.26||waterDepth10(p)<1.1)continue;
  const next=road.points[i+6],h=headingTo(p,next),length=Math.min(8,distance(p,next)),center=movePoint(p,h,length/2),floor=.083+bridgeLift10(center);
  for(const sign of [-1,1]){const side=road.width/2+1.18,q=movePoint(center,h+sign*Math.PI/2,side),g=new THREE.Group();root.add(g);placeV9(g,q.lat,q.lon,h,floor);
   box(g,white,0,.75,0,.14,.16,length);for(const z of [-length/2,length/2])box(g,stone,0,.37,z,.18,.75,.20);obstacle9(q,h,.22,length,.91,'海岸桥白栏',floor+.15);
  }
  if(++used>=36)break outer;
 }
 root.userData.rails13=used;if(!renderer.isSoftwareRenderer)staticBatch(root);root.traverse(o=>{if(o.isMesh){o.frustumCulled=false;o.castShadow=false;}});buildCollisionGrid();
}
