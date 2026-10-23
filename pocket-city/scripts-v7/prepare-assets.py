"""Extract the CC0 Quaternius rig and selected retargeted in-place clips.
No runtime network, general purpose loader, or large animation archive required.
"""
from pathlib import Path
import json,struct,base64
import numpy as np
from PIL import Image
P=Path(__file__).resolve().parents[1]
S=P/'assets/source'
def glb(path):
    b=path.read_bytes(); n=struct.unpack_from('<I',b,12)[0]
    return json.loads(b[20:20+n]),b[28+n:]
def acc(j,b,i):
    a=j['accessors'][i];v=j['bufferViews'][a['bufferView']]
    dtype={5126:'<f4',5123:'<u2',5121:'u1',5125:'<u4'}[a['componentType']]
    size={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}[a['type']]
    off=v.get('byteOffset',0)+a.get('byteOffset',0)
    arr=np.ndarray((a['count'],size),dtype=dtype,buffer=b,offset=off,strides=(v.get('byteStride',np.dtype(dtype).itemsize*size),np.dtype(dtype).itemsize)).copy()
    if a.get('normalized'):arr=arr/np.iinfo(dtype).max
    return arr
def packed(a,dtype):return base64.b64encode(np.asarray(a,dtype=dtype).tobytes()).decode()
def qm(a,b):
    av,bv=a[...,:3],b[...,:3];aw,bw=a[...,3:4],b[...,3:4]
    return np.concatenate((aw*bv+bw*av+np.cross(av,bv),aw*bw-np.sum(av*bv,axis=-1,keepdims=True)),axis=-1)
def qi(q):return np.array([-q[0],-q[1],-q[2],q[3]])
j,b=glb(S/'quaternius-character.glb'); aj,ab=glb(S/'UAL1_Standard.glb')
out={'provenance':'Quaternius Universal Base Characters + Universal Animation Library, CC0 1.0','bones':[],'meshes':[],'clips':[],'hair':[]}
parent={c:i for i,n in enumerate(j['nodes']) for c in n.get('children',[])}
for i,n in enumerate(j['nodes'][:65]):
    out['bones'].append({'name':n['name'],'parent':parent.get(i,-1) if parent.get(i,-1)<65 else -1,'t':n.get('translation',[0,0,0]),'q':n.get('rotation',[0,0,0,1]),'s':n.get('scale',[1,1,1])})
out['joints']=j['skins'][0]['joints'];out['inverses']=packed(acc(j,b,11),'<f4')
for m in j['meshes']:
    pr=m['primitives'][0];a=pr['attributes']; item={}
    for key,gltf,dtype in [('p','POSITION','<f4'),('n','NORMAL','<f4'),('uv','TEXCOORD_0','<f4'),('j','JOINTS_0','u1')]:item[key]=packed(acc(j,b,a[gltf]),dtype)
    weights=np.rint(acc(j,b,a['WEIGHTS_0'])*255).astype(np.int32)
    # Quantized weights MUST total 255: even a 1/255 error magnifies with
    # the planet-space bone translation and creates visible 60 cm spikes.
    weights[np.arange(len(weights)),np.argmax(weights,axis=1)]+=255-weights.sum(axis=1)
    assert np.all(weights.sum(axis=1)==255)
    item['w']=packed(weights,'u1')
    item['ix']=packed(acc(j,b,pr['indices']),'<u2');out['meshes'].append(item)
# Vertex-cluster LOD preserves a closed surface and the same skin joints.
# Shared by distant citizens; the playable hero always retains the authored mesh.
pr=j['meshes'][2]['primitives'][0];attrs=pr['attributes'];pos=acc(j,b,attrs['POSITION']);norm=acc(j,b,attrs['NORMAL']);uv=acc(j,b,attrs['TEXCOORD_0']);joints=acc(j,b,attrs['JOINTS_0']);weights=acc(j,b,attrs['WEIGHTS_0'])
cells={};remap=[];members=[]
for i,v in enumerate(pos):
    key=tuple(np.rint(v/.033).astype(int))+(int(joints[i,np.argmax(weights[i])]),)
    if key not in cells:cells[key]=len(members);members.append([])
    remap.append(cells[key]);members[cells[key]].append(i)
lp=[];ln=[];lu=[];lj=[];lw=[]
for group in members:
    lp.append(pos[group].mean(axis=0));normal=norm[group].mean(axis=0);ln.append(normal/max(.00001,np.linalg.norm(normal)));lu.append(uv[group].mean(axis=0));mix={}
    for i in group:
        for bone,weight in zip(joints[i],weights[i]):mix[int(bone)]=mix.get(int(bone),0)+float(weight)
    top=sorted(mix.items(),key=lambda x:-x[1])[:4];top+= [(0,0)]*(4-len(top));ids,ws=zip(*top);ws=np.array(ws);ws=np.rint(ws/ws.sum()*255).astype(int);ws[0]+=255-int(ws.sum());lj.append(ids);lw.append(ws)
tri=np.array(remap)[acc(j,b,pr['indices']).ravel().reshape(-1,3)];tri=tri[(tri[:,0]!=tri[:,1])&(tri[:,1]!=tri[:,2])&(tri[:,0]!=tri[:,2])]
out['lod']={k:packed(v,t) for k,v,t in [('p',lp,'<f4'),('n',ln,'<f4'),('uv',lu,'<f4'),('j',lj,'u1'),('w',lw,'u1'),('ix',tri,'<u2')]}
print('Citizen LOD:',len(lp),'vertices,',len(tri),'triangles')
amap={n['name']:i for i,n in enumerate(aj['nodes'])}
keep=['Idle_Loop','Walk_Loop','Sprint_Loop','Jump_Loop','Pistol_Idle_Loop','Sword_Idle','Sword_Attack','Punch_Jab']
for name in keep:
    clip=next(a for a in aj['animations'] if a['name']==name); tracks=[];duration=0
    for c in clip['channels']:
        node=c['target']['node'];path=c['target']['path'];n=aj['nodes'][node];bn=n.get('name')
        if bn not in {x['name'] for x in out['bones']}:continue
        if path!='rotation':continue
        sm=clip['samplers'][c['sampler']];times=acc(aj,ab,sm['input']).ravel();values=acc(aj,ab,sm['output'])
        duration=max(duration,float(times[-1]));target=next(x for x in out['bones'] if x['name']==bn)
        # Match the target's rest proportions; preserve animation rotations only.
        delta=qm(np.array(target['q']),qi(np.array(n.get('rotation',[0,0,0,1]))))
        values=qm(delta,values); values/=np.linalg.norm(values,axis=1)[:,None]
        # 20 Hz quaternion tracks, subsequently slerped by THREE.AnimationMixer.
        steps=np.arange(0,times[-1]+1e-5,1/20);steps=np.unique(np.append(steps,times[-1]))
        interp=np.empty((len(steps),4));vv=values.copy()
        for k in range(1,len(vv)):
            if np.dot(vv[k-1],vv[k])<0:vv[k]*=-1
        for k in range(4):interp[:,k]=np.interp(steps,times,vv[:,k])
        interp/=np.linalg.norm(interp,axis=1)[:,None]
        # Constant finger joints need one constant track, not dozens of copies.
        if np.max(np.abs(interp-interp[0]))<.0002:steps=np.array([0]);interp=interp[:1]
        tracks.append({'bone':bn,'t':packed(steps,'<f4'),'q':packed(np.rint(interp*32767),'<i2')})
    out['clips'].append({'name':name,'duration':duration,'tracks':tracks})
for name in ['Hair_Buzzed','Hair_SimpleParted']:
    hj=json.loads((S/(name+'.gltf')).read_text());hb=(S/(name+'.bin')).read_bytes();pr=hj['meshes'][0]['primitives'][0];a=pr['attributes']
    out['hair'].append({'name':name,'p':packed(acc(hj,hb,a['POSITION']),'<f4'),'n':packed(acc(hj,hb,a['NORMAL']),'<f4'),'ix':packed(acc(hj,hb,pr['indices']),'<u2')})
(P/'assets/rig-v7.json').write_text(json.dumps(out,separators=(',',':')))
img=Image.open(P.parent/'generated_images/exec-4eefdc52-55f5-4867-941f-3b1c2f7c8c2a.png').convert('RGB');img.resize((512,512),Image.Resampling.LANCZOS).save(P/'assets/tommy-fabric-v7.jpg',quality=87,optimize=True)
print('Rig package', (P/'assets/rig-v7.json').stat().st_size,'bytes; fabric',(P/'assets/tommy-fabric-v7.jpg').stat().st_size)
