import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/OrbitControls.js';
import { plantInfo, stateAt, inside } from './model.js';

// Reproducible procedural models: no photos, random remote assets or network requests.
const materials=new Map(),shared=new Set();
const mat=color=>{if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.86,side:THREE.DoubleSide}));return materials.get(color);};
const geo=g=>{shared.add(g);return g;};
const cylinder=geo(new THREE.CylinderGeometry(1,1,1,7)),sphere=geo(new THREE.SphereGeometry(1,9,6)),cone=geo(new THREE.ConeGeometry(1,1,7)),box=geo(new THREE.BoxGeometry(1,1,1));
function leafGeometry(type){const shape=new THREE.Shape();if(type==='maple'){const pts=[[0,-.24],[-.25,-.35],[-.2,-.06],[-.53,.02],[-.3,.22],[-.34,.58],[-.12,.37],[0,.88],[.12,.37],[.34,.58],[.3,.22],[.53,.02],[.2,-.06],[.25,-.35]];shape.moveTo(...pts[0]);pts.slice(1).forEach(p=>shape.lineTo(...p));}else{shape.moveTo(0,0);shape.bezierCurveTo(-.48,.25,-.3,.78,0,1);shape.bezierCurveTo(.3,.78,.48,.25,0,0);}return geo(new THREE.ShapeGeometry(shape,5));}
const leaf=leafGeometry('oval'),mapleLeaf=leafGeometry('maple');
function rng(seed){let s=(seed*2654435761)>>>0;return ()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return (s>>>0)/4294967296;};}
const temp=new THREE.Object3D(),up=new THREE.Vector3(0,1,0);
function builder(group){const batches=new Map();function add(geometry,color,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0){const key=geometry.uuid+'-'+color;if(!batches.has(key))batches.set(key,{geometry,color,items:[]});temp.position.set(x,y,z);temp.scale.set(sx,sy,sz);temp.rotation.set(rx,ry,rz);temp.updateMatrix();batches.get(key).items.push(temp.matrix.clone());}
function branch(a,b,r,color='#79634c'){const dir=new THREE.Vector3(...b).sub(new THREE.Vector3(...a));const m=new THREE.Matrix4().compose(new THREE.Vector3(...a).add(new THREE.Vector3(...b)).multiplyScalar(.5),new THREE.Quaternion().setFromUnitVectors(up,dir.clone().normalize()),new THREE.Vector3(r,dir.length(),r));const key=cylinder.uuid+'-'+color;if(!batches.has(key))batches.set(key,{geometry:cylinder,color,items:[]});batches.get(key).items.push(m);}
return {add,branch,finish(){for(const {geometry,color,items} of batches.values()){const m=new THREE.InstancedMesh(geometry,mat(color),items.length);items.forEach((matrix,i)=>m.setMatrixAt(i,matrix));m.castShadow=true;m.receiveShadow=true;m.computeBoundingSphere();group.add(m);}}};}
function plantModel(p,view){
  const s=stateAt(p,view),info=plantInfo(p.kind),g=new THREE.Group();g.userData.plantId=p.id;if(!s.present)return g;
  const b=builder(g),rand=rng(p.id),h=s.height,w=s.spread,lh=s.leafHeight,form=info.form;
  const dormant=s.winter&&info.leaf!=='evergreen'&&info.leaf!=='semi';
  const clipped=p.management?.method==='trim'&&s.last&&!s.unsupported;
  if(['maple','olive'].includes(form)){
    const leafColor=form==='olive'?'#91a18a':s.autumn?'#bc6540':view.month<5?'#93ab60':'#628341';
    b.branch([0,0,0],[.035,s.trunkHeight+.08,0],Math.max(.025,s.natural.height*.016));
    const crownBottom=Math.min(s.trunkHeight,h*.5),crownH=h-crownBottom;
    for(let i=0;i<11;i++){
      const a=i*2.399,ring=i<7?1:.6,x=Math.cos(a)*w*.34*ring,z=Math.sin(a)*w*.34*ring,y=crownBottom+crownH*(.24+(i%4)*.15);
      b.branch([0,s.trunkHeight*.85,0],[x,y,z],Math.max(.012,s.natural.height*.007));
      const count=Math.min(100,Math.max(20,Math.round(w*w*22/11)));
      for(let j=0;j<count;j++){
        const angle=rand()*Math.PI*2,r=Math.sqrt(rand()),dx=Math.cos(angle)*w*.2*r,dz=Math.sin(angle)*w*.2*r,dy=(rand()-.4)*crownH*.36;
        const xx=x+dx,zz=z+dz,yy=Math.max(crownBottom,y+dy);
        if(j%12===0)b.branch([x,y,z],[xx,yy,zz],.005);
        if(!dormant){const size=form==='olive'?.13:.16;if(clipped&&Math.hypot(xx,zz)>w*.47)continue;b.add(form==='maple'?mapleLeaf:leaf,leafColor,xx,Math.min(h-.06,yy),zz,size*(form==='olive'?.28:1),size,.9,rand()*2-.7,rand()*6,rand()*1.8-.9);}
      }
    }
  }else if(['rose','hydrangea'].includes(form)){
    for(let i=0;i<Math.min(32,Math.max(7,Math.round(w*12)));i++){
      const a=i*2.399,r=w*.35*Math.sqrt(rand()),x=Math.cos(a)*r,z=Math.sin(a)*r,y=h*(.65+rand()*.25);b.branch([x*.2,0,z*.2],[x,y,z],.009);
      if(!dormant){for(let j=1;j<7;j++){const t=j/7,side=j%2?1:-1;b.add(leaf,form==='rose'?'#486e44':'#69834c',x*t,y*t,z*t,form==='rose'?.08:.15,form==='rose'?.13:.22,1,.5,side*1.7+a,side*.8);}
        if(s.bloom){if(form==='hydrangea'){for(let j=0;j<24;j++){const t=j/24,an=j*2.399;b.add(sphere,view.month>=9?'#bdac95':info.flower,x+Math.cos(an)*.09*(1-t),y+t*.18,z+Math.sin(an)*.09*(1-t),.045,.024,.045);}}else{for(let j=0;j<9;j++){const an=j*2.399;b.add(sphere,info.flower,x+Math.cos(an)*.032,y+j*.002,z+Math.sin(an)*.032,.038,.014,.03,.15,an,.2);}}}
      }
    }
  }else if(form==='hosta'){
    if(!dormant){const count=Math.min(48,Math.max(8,Math.round(w*w*50)));for(let i=0;i<count;i++){const a=i*2.399,r=w*.35*Math.sqrt(rand()),x=Math.cos(a)*r,z=Math.sin(a)*r,y=lh*(.45+rand()*.4);b.branch([0,.02,0],[x,y,z],.006,'#738c66');b.add(leaf,i%3?'#789585':'#889e92',x,y*.6,z,w*.28,Math.min(lh*.65,.36),1,-.8,a,Math.cos(a)*.4);}if(s.bloom)for(let i=0;i<4;i++){const x=(rand()-.5)*w*.4,z=(rand()-.5)*w*.4;b.branch([x,0,z],[x,h,z],.005,'#869773');for(let j=0;j<6;j++)b.add(cone,info.flower,x+.02,h-j*.027,z,.016,.035,.016,0,0,.8);}}
  }else if(form==='grass'){
    const color=s.winter||s.autumn?'#bdac78':'#7e9e8b',count=Math.min(130,Math.max(22,Math.round(w*w*130)));
    for(let i=0;i<count;i++){const a=i*2.399,r=w*.3*Math.sqrt(rand()),x=Math.cos(a)*r,z=Math.sin(a)*r,y=lh*(.55+rand()*.45);for(let k=0;k<3;k++){const t=k/3;b.branch([x*t,y*t,z*t],[x*(t+1/3),y*(t+1/3),z*(t+1/3)],.007*(1-t),color);}b.add(leaf,color,x*.7,y*.7,z*.7,.024,Math.min(h*.45,.5),1,-.3,a,Math.cos(a)*.5);if(view.month>=7||view.month<=2){const top=h*(.75+rand()*.2);b.branch([x,0,z],[x,top,z],.002,color);if(i%3===0)for(let j=0;j<5;j++){const dx=(rand()-.5)*.1,dz=(rand()-.5)*.1;b.branch([x,top-.15,z],[x+dx,top-j*.018,z+dz],.001,'#b69a79');b.add(sphere,info.flower,x+dx,top-j*.018,z+dz,.008,.014,.008);}}}
  }else{
    const count=Math.min(80,Math.max(7,Math.round(w*w*55))),winterHeads=dormant&&['daisy','sedum'].includes(form);
    for(let i=0;i<count;i++){
      const a=i*2.399,r=w*.36*Math.sqrt(rand()),x=Math.cos(a)*r,z=Math.sin(a)*r,y=h*(.72+rand()*.22),color=form==='lavender'?'#849283':'#71905a';
      if(!dormant){b.branch([x*.5,0,z*.5],[x,lh*.85,z],.003,color);for(let j=0;j<4;j++){const q=j/4;b.add(form==='sedum'?sphere:leaf,color,x*.8,lh*(.15+q*.65),z*.8,form==='sedum'?.045:form==='lavender'?.017:.05,form==='sedum'?.02:Math.min(lh*.5,.15),form==='sedum'?.025:1,.3,a+j*1.8,j%2?.55:-.55);}}
      if(s.bloom||winterHeads){b.branch([x,0,z],[x,y,z],.003,winterHeads?'#9a866b':color);
        if(form==='daisy'){if(s.bloom)for(let k=0;k<10;k++){const an=k*Math.PI/5;b.add(leaf,info.flower,x,y-.007,z,.021,.075,1,Math.PI/2+.25,0,an);}b.add(cone,winterHeads?'#725a3e':'#99703f',x,y+.012,z,.025,.035,.025);}
        else if(form==='sedum'){for(let k=0;k<12;k++){const an=k*2.399,rr=.07*Math.sqrt(k/12);b.add(sphere,winterHeads?'#947661':info.flower,x+Math.cos(an)*rr,y,z+Math.sin(an)*rr,.024,.013,.024);}}
        else{for(let k=0;k<9;k++){const an=k*2.399;b.add(sphere,info.flower,x+Math.cos(an)*.013,y+k*.009,z+Math.sin(an)*.013,.014,.011,.014);}}
      }
    }
  }
  b.finish();return g;
}
export function createScene(container,onPick){
  const scene=new THREE.Scene();scene.background=new THREE.Color('#e8ede3');scene.fog=new THREE.Fog('#e8ede3',60,160);
  const camera=new THREE.PerspectiveCamera(38,container.clientWidth/container.clientHeight,.05,250),renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(container.clientWidth,container.clientHeight,false);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.setClearColor('#e8ede3');renderer.domElement.setAttribute('aria-label','庭の3Dキャンバス');container.append(renderer.domElement);
  const controls=new OrbitControls(camera,renderer.domElement);controls.maxPolarAngle=Math.PI/2-.025;controls.minDistance=.6;controls.maxDistance=120;controls.enableDamping=false;
  scene.add(new THREE.HemisphereLight('#fff8e7','#8c987d',2.6));const sun=new THREE.DirectionalLight('#fff5dc',3);sun.position.set(-8,16,9);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24});sun.shadow.bias=-.0004;scene.add(sun);
  let dirty=true,root=null,plants=null,draft=null,plan=null,view=null,selection=null;
  controls.addEventListener('change',()=>{dirty=true;});
  function dispose(group){if(!group)return;group.traverse(o=>{if(o.geometry&&!shared.has(o.geometry))o.geometry.dispose();if(o.isInstancedMesh)o.dispose();if(o.material&&!Array.from(materials.values()).includes(o.material))o.material.dispose();});scene.remove(group);}
  function line(points,color,group=root,opacity=1){const material=new THREE.LineBasicMaterial({color,transparent:opacity<1,opacity});const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),material);group.add(l);return l;}
  function polygon(points,y,color){const shape=new THREE.Shape(points.map(([x,z])=>new THREE.Vector2(x-plan.width/2,-z+plan.depth/2)));const m=new THREE.Mesh(new THREE.ShapeGeometry(shape),mat(color));m.rotation.x=-Math.PI/2;m.position.y=y;m.receiveShadow=true;root.add(m);}
  function circle(x,z,r,color,y=.04){line(Array.from({length:65},(_,i)=>{const a=i*Math.PI/32;return new THREE.Vector3(x-plan.width/2+Math.cos(a)*r,y,z-plan.depth/2+Math.sin(a)*r);}),color);}
  function render(next,nextView,id){plan=next;view=nextView;selection=id;dispose(root);root=new THREE.Group();plants=new THREE.Group();root.add(plants);scene.add(root);
    polygon(plan.outline,0,'#a7b57d');line([...plan.outline,plan.outline[0]].map(([x,z])=>new THREE.Vector3(x-plan.width/2,.025,z-plan.depth/2)),'#7e9062');
    for(const z of plan.zones){polygon(z.points,.012,'#998466');line([...z.points,z.points[0]].map(([x,z])=>new THREE.Vector3(x-plan.width/2,.025,z-plan.depth/2)),'#cebea2');}
    if(view.footprints){const verts=[];for(let x=0;x<=plan.width;x++)for(let z=0;z<plan.depth;z+=.25)if(inside(x,z,plan.outline)&&inside(x,z+.25,plan.outline))verts.push(new THREE.Vector3(x-plan.width/2,.018,z-plan.depth/2),new THREE.Vector3(x-plan.width/2,.018,z+.25-plan.depth/2));for(let z=0;z<=plan.depth;z++)for(let x=0;x<plan.width;x+=.25)if(inside(x,z,plan.outline)&&inside(x+.25,z,plan.outline))verts.push(new THREE.Vector3(x-plan.width/2,.018,z-plan.depth/2),new THREE.Vector3(x+.25-plan.width/2,.018,z-plan.depth/2));root.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(verts),new THREE.LineBasicMaterial({color:'#ecedd9',transparent:true,opacity:.45})));}
    for(const o of plan.obstacles){const g=new THREE.Group(),b=builder(g),cx=o.x+o.width/2-plan.width/2,cz=o.z+o.depth/2-plan.depth/2;if(o.type==='house'){b.add(box,'#d5cebb',cx,o.height/2,cz,o.width,o.height,o.depth);b.add(box,'#6d7e74',cx,o.height+.06,cz,o.width+.1,.12,o.depth+.1);for(let k=0;k<Math.max(1,Math.floor(o.width));k++)b.add(box,'#8aacab',o.x-plan.width/2+(k+.5)*o.width/Math.max(1,Math.floor(o.width)),o.height*.55,o.z+o.depth-plan.depth/2+.01,.4,o.height*.24,.025);}else if(o.type==='path'){b.add(box,'#d5ceba',cx,.025,cz,o.width,.05,o.depth);}else{b.add(box,'#8c8069',cx,o.height/2,cz,o.width,o.height,o.depth);}b.finish();root.add(g);}
    for(const p of plan.plants){const s=stateAt(p,view);if(!s.present)continue;const g=plantModel(p,view);g.position.set(p.x-plan.width/2,.022,p.z-plan.depth/2);plants.add(g);if(view.footprints)circle(p.x,p.z,s.spread/2,'#a9bec2');if(p.id===id){circle(p.x,p.z,s.spread/2+.06,'#d09932',.05);if(p.management){circle(p.x,p.z,p.management.spread/2,'#6a9fa2',p.management.height);for(const a of [0,Math.PI]){const x=p.x-plan.width/2+Math.cos(a)*p.management.spread/2,z=p.z-plan.depth/2;line([new THREE.Vector3(x,.04,z),new THREE.Vector3(x,p.management.height,z)],'#6a9fa2');}}}}
    dirty=true;
  }
  function setView(type){if(!plan)return;const visible=plan.plants.map(p=>({p,s:stateAt(p,view)})).filter(v=>v.s.present),maxHeight=Math.max(0,...visible.map(v=>v.s.height)),extent=Math.max(plan.width,plan.depth,maxHeight*1.4,...visible.flatMap(({p,s})=>[Math.abs(p.x-plan.width/2)*2+s.spread,Math.abs(p.z-plan.depth/2)*2+s.spread]));const size=extent*Math.max(1,1.6/camera.aspect);controls.target.set(0,type==='eye'||type==='top'?.4:Math.max(.4,maxHeight*.25),0);if(type==='focus'&&selection){const p=plan.plants.find(p=>p.id===selection),s=stateAt(p,view);controls.target.set(p.x-plan.width/2,s.height*.4,p.z-plan.depth/2);const d=Math.max(1.4,s.height,s.spread)*Math.max(1,1/camera.aspect);camera.position.copy(controls.target).add(new THREE.Vector3(d,d*.6,d));}else camera.position.set(...(type==='top'?[0,size*1.65,.001]:type==='eye'?[size*.7,1.6,size*.85]:[size*.8,size*.8,size*.9]));camera.lookAt(controls.target);controls.update();dirty=true;}
  new ResizeObserver(()=>{const aspect=container.clientWidth/container.clientHeight,ratio=Math.max(1,1.6/aspect)/Math.max(1,1.6/camera.aspect);camera.position.sub(controls.target).multiplyScalar(ratio).add(controls.target);renderer.setSize(container.clientWidth,container.clientHeight,false);camera.aspect=aspect;camera.updateProjectionMatrix();dirty=true;}).observe(container);
  const ray=new THREE.Raycaster(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0),pointers=new Set();let start=null;
  renderer.domElement.addEventListener('pointerdown',e=>{pointers.add(e.pointerId);start=pointers.size===1?{id:e.pointerId,x:e.clientX,y:e.clientY}:null;});renderer.domElement.addEventListener('pointermove',e=>{if(start&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>=5)start=null;});renderer.domElement.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);start=null;});renderer.domElement.addEventListener('pointerup',e=>{pointers.delete(e.pointerId);if(start&&e.pointerId===start.id&&plan){const rect=renderer.domElement.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const point=ray.ray.intersectPlane(plane,new THREE.Vector3());let id=null;const hits=ray.intersectObjects(plants.children,true);if(hits.length){let obj=hits[0].object;while(obj&&!obj.userData.plantId)obj=obj.parent;id=obj?.userData.plantId??null;}if(point)onPick({x:Math.round((point.x+plan.width/2)*10)/10,z:Math.round((point.z+plan.depth/2)*10)/10,id});}start=null;});
  container.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();camera.position.sub(controls.target).applyAxisAngle(up,e.key==='ArrowLeft'?.12:-.12).add(controls.target);controls.update();dirty=true;}});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();container.dispatchEvent(new CustomEvent('render-failed'));});renderer.setAnimationLoop(()=>{if(dirty){renderer.render(scene,camera);dirty=false;}});
  return {render,view:setView,editing:value=>{controls.enabled=!value;},zoom:ratio=>{const offset=camera.position.clone().sub(controls.target);offset.setLength(Math.min(120,Math.max(.6,offset.length()*ratio)));camera.position.copy(controls.target).add(offset);controls.update();dirty=true;},capture:()=>({position:camera.position.toArray(),target:controls.target.toArray()}),restore:c=>{if(!c)return;camera.position.fromArray(c.position);controls.target.fromArray(c.target);controls.update();dirty=true;},drawDraft:points=>{dispose(draft);draft=new THREE.Group();scene.add(draft);if(plan&&points.length){const vs=points.map(([x,z])=>new THREE.Vector3(x-plan.width/2,.06,z-plan.depth/2));line(vs,'#b67730',draft);for(const v of vs){const m=new THREE.Mesh(sphere,mat('#b67730'));m.position.copy(v);m.scale.setScalar(.06);draft.add(m);}}dirty=true;}};
}
