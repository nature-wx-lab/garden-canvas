import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/OrbitControls.js';
import { plantInfo, stateAt, inside, canPlant, zoneAt } from './model.js?v=0.9.70';
import { plantModel, batch, wind, random, sharedGeometry, sharedMaterials } from './vegetation.js?v=0.9.70';

const sceneMaterials=new Map(),up=new THREE.Vector3(0,1,0);
function mat(color){if(!sceneMaterials.has(color))sceneMaterials.set(color,new THREE.MeshStandardMaterial({color,roughness:.92}));return sceneMaterials.get(color);}
const sphere=new THREE.SphereGeometry(1,8,6),box=new THREE.BoxGeometry(1,1,1);sharedGeometry.add(sphere);sharedGeometry.add(box);
function grainTexture(type){
  const size=256,data=new Uint8Array(size*size*4),rand=random(type==='grass'?421:718);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const i=(y*size+x)*4,coarse=Math.sin(x/size*Math.PI*6)*Math.cos(y/size*Math.PI*4)*5,grain=(rand()-.5)*(type==='grass'?28:43);
    const base=type==='grass'?[87,106,57]:[128,106,79];
    for(let k=0;k<3;k++)data[i+k]=Math.max(0,Math.min(255,base[k]+coarse+grain));data[i+3]=255;
  }
  const t=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2.5,2.5);t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t;
}
const turfTexture=grainTexture('grass'),soilTexture=grainTexture('soil');
const turf=new THREE.MeshStandardMaterial({map:turfTexture,bumpMap:turfTexture,bumpScale:.014,roughness:1});
const soil=new THREE.MeshStandardMaterial({map:soilTexture,bumpMap:soilTexture,bumpScale:.023,roughness:1});
sharedMaterials.add(turf);sharedMaterials.add(soil);
const waterNormals=new Uint8Array(128*128*4);
for(let y=0;y<128;y++)for(let x=0;x<128;x++){const i=(y*128+x)*4,phase=x/128*Math.PI*12+y/128*Math.PI*8;waterNormals[i]=128+Math.round(15*Math.cos(phase));waterNormals[i+1]=128+Math.round(11*Math.sin(phase+y/128*Math.PI*4));waterNormals[i+2]=254;waterNormals[i+3]=255;}
const rippleTexture=new THREE.DataTexture(waterNormals,128,128,THREE.RGBAFormat);rippleTexture.wrapS=rippleTexture.wrapT=THREE.RepeatWrapping;rippleTexture.magFilter=THREE.LinearFilter;rippleTexture.needsUpdate=true;
const water=new THREE.MeshPhysicalMaterial({color:'#537b73',roughness:.25,metalness:.18,clearcoat:.65,clearcoatRoughness:.25,normalMap:rippleTexture,normalScale:new THREE.Vector2(.3,.3)});sharedMaterials.add(water);
const shadowSize=64,shadowData=new Uint8Array(shadowSize*shadowSize*4);
for(let y=0;y<shadowSize;y++)for(let x=0;x<shadowSize;x++){const i=(y*shadowSize+x)*4,r=Math.hypot(x/63*2-1,y/63*2-1);shadowData[i]=33;shadowData[i+1]=39;shadowData[i+2]=20;shadowData[i+3]=Math.max(0,Math.round((1-Math.min(1,r))**2*90));}
const contactTexture=new THREE.DataTexture(shadowData,shadowSize,shadowSize,THREE.RGBAFormat);contactTexture.needsUpdate=true;contactTexture.magFilter=THREE.LinearFilter;
const contactMaterial=new THREE.MeshBasicMaterial({map:contactTexture,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});sharedMaterials.add(contactMaterial);
const contactGeometry=new THREE.PlaneGeometry(1,1);sharedGeometry.add(contactGeometry);

export function createScene(container,onPick){
  const scene=new THREE.Scene();scene.background=new THREE.Color('#cbd2c6');scene.fog=new THREE.Fog('#cbd2c6',100,600);
  const camera=new THREE.PerspectiveCamera(40,container.clientWidth/container.clientHeight,.01,650);
  const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setSize(container.clientWidth,container.clientHeight,false);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
  renderer.domElement.setAttribute('aria-label','風に揺れる庭の3Dキャンバス');container.append(renderer.domElement);
  const controls=new OrbitControls(camera,renderer.domElement);controls.maxPolarAngle=Math.PI/2-.025;controls.minDistance=.12;controls.maxDistance=400;controls.enableDamping=false;
  const hemisphere=new THREE.HemisphereLight('#e6efff','#77704b',1.7);scene.add(hemisphere);
  const sun=new THREE.DirectionalLight('#fff0d2',2.8);sun.position.set(-7,12,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.0002;sun.shadow.normalBias=.013;sun.shadow.radius=2.5;sun.shadow.intensity=.72;sun.shadow.camera.near=.5;sun.shadow.camera.far=350;scene.add(sun);
  const sky=new THREE.Mesh(new THREE.SphereGeometry(500,20,12),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{top:{value:new THREE.Color('#adc5d0')},bottom:{value:new THREE.Color('#e3e0ce')}},vertexShader:'varying vec3 skyDirection; void main(){skyDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec3 skyDirection;uniform vec3 top;uniform vec3 bottom;void main(){float t=smoothstep(-0.05,0.65,normalize(skyDirection).y);gl_FragColor=vec4(mix(bottom,top,t),1.0);#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'}));
  // Shader directives need their own lines.
  sky.material.fragmentShader=sky.material.fragmentShader.replace(';#include',';\n#include');scene.add(sky);
  const backdrop=new THREE.Mesh(new THREE.PlaneGeometry(180,180),new THREE.MeshStandardMaterial({color:'#bbc0a8',roughness:1}));backdrop.rotation.x=-Math.PI/2;backdrop.position.y=-.19;backdrop.receiveShadow=true;scene.add(backdrop);
  let dirty=true,root=null,plants=null,draft=null,plan=null,view=null,selection=null,visible=true,windLevel=1,frameCount=0,lastDraw=0,lastTick=0,elapsed=0;
  const textureStatus=document.createElement('div');textureStatus.className='texture-status';textureStatus.textContent='芝と土の質感を読み込み中…';textureStatus.setAttribute('role','status');container.append(textureStatus);
  let texturesLoaded=0,textureFailed=false;container.dataset.textures='loading';
  const loader=new THREE.TextureLoader();
  for(const [material,asset,scale] of [[turf,'leafy_grass',.5],[soil,'brown_mud_02',1/1.3]])for(const [slot,suffix] of [['map','diff'],['normalMap','nor_gl']]){
    loader.load(`./textures/${asset}_${suffix}_1k.jpg`,texture=>{
      texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(scale,scale);texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
      if(slot==='map')texture.colorSpace=THREE.SRGBColorSpace;
      material[slot]=texture;material.bumpMap=null;material.normalScale.set(.65,.65);material.needsUpdate=true;dirty=true;
      if(++texturesLoaded===4&&!textureFailed){textureStatus.remove();container.dataset.textures='ready';}
    },undefined,()=>{textureFailed=true;container.dataset.textures='fallback';textureStatus.textContent='地面の質感を読み込めず簡易表示中。保存後に再読込できます。';dirty=true;});
  }
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');windLevel=reduced.matches?0:1;wind.strength.value=windLevel;
  const visibilityObserver=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;dirty=true;lastTick=0;},{threshold:0});visibilityObserver.observe(container);
  document.addEventListener('visibilitychange',()=>{lastTick=0;dirty=true;});
  reduced.addEventListener('change',e=>{if(e.matches){setWind(0);container.dispatchEvent(new CustomEvent('wind-reduced'));}});
  controls.addEventListener('change',()=>{dirty=true;});
  function dispose(group){if(!group)return;group.traverse(o=>{if(o.geometry&&!sharedGeometry.has(o.geometry))o.geometry.dispose();if(o.isInstancedMesh)o.dispose();if(o.material&&!sharedMaterials.has(o.material)&&!Array.from(sceneMaterials.values()).includes(o.material))o.material.dispose();});scene.remove(group);}
  function line(points,color,group=root,opacity=1){const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color,transparent:opacity<1,opacity}));group.add(l);return l;}
  function polygon(points,y,material){const shape=new THREE.Shape(points.map(([x,z])=>new THREE.Vector2(x-plan.width/2,-z+plan.depth/2)));const m=new THREE.Mesh(new THREE.ShapeGeometry(shape),material);m.rotation.x=-Math.PI/2;m.position.y=y;m.receiveShadow=true;root.add(m);return shape;}
  function circle(x,z,r,color,y=.04){line(Array.from({length:65},(_,i)=>{const a=i*Math.PI/32;return new THREE.Vector3(x-plan.width/2+Math.cos(a)*r,y,z-plan.depth/2+Math.sin(a)*r);}),color);}
  function solid(color,x,y,z,sx,sy,sz){const m=new THREE.Mesh(box,mat(color));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;root.add(m);return m;}
  function groundDetail(){
    const rand=random(923),group=new THREE.Group(),lawn=batch(group,.08,.1,.3),mulch=new THREE.Group(),pebbleGeometry=new THREE.IcosahedronGeometry(1,0),matrices=[],colors=[];
    const candidates=Math.min(7000,Math.round(plan.width*plan.depth*180));
    for(let i=0;i<candidates;i++){
      const x=rand()*plan.width,z=rand()*plan.depth;if(!canPlant(plan,x,z))continue;
      const zone=zoneAt(plan,x,z);if(zone?.kind==='water')continue;
      if(zone){
        const dummy=new THREE.Object3D(),size=.015+rand()*.025;dummy.position.set(x-plan.width/2,.018,z-plan.depth/2);dummy.rotation.set(rand(),rand()*6,rand());dummy.scale.set(size,.008+rand()*.008,size*.42);dummy.updateMatrix();matrices.push(dummy.matrix.clone());colors.push(new THREE.Color().setHSL(.07+rand()*.025,.32+rand()*.15,.16+rand()*.14));
      }else{
        const h=.025+rand()*.028;
        lawn.add('blade','grass',new THREE.Color().setHSL(.22+rand()*.045,.23+rand()*.12,.24+rand()*.1),x-plan.width/2,.002,z-plan.depth/2,.022,h,h*.6,.1,rand()*6,0);
      }
    }
    lawn.finish({castShadow:false});root.add(group);
    if(matrices.length){const chips=new THREE.InstancedMesh(pebbleGeometry,mat('#ffffff'),matrices.length);matrices.forEach((m,i)=>{chips.setMatrixAt(i,m);chips.setColorAt(i,colors[i]);});chips.receiveShadow=true;mulch.add(chips);root.add(mulch);}else pebbleGeometry.dispose();
  }
  function render(next,nextView,id){
    plan=next;view=nextView;selection=id;dispose(root);root=new THREE.Group();plants=new THREE.Group();root.add(plants);scene.add(root);
    const shape=polygon(plan.outline,0,turf);const earth=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.18,bevelEnabled:false}),mat('#807357'));earth.rotation.x=-Math.PI/2;earth.position.y=-.186;earth.castShadow=true;earth.receiveShadow=true;root.add(earth);
    for(const [i,z] of plan.zones.entries()){polygon(z.points,.006+i*.0002,z.kind==='water'?water:soil);line([...z.points,z.points[0]].map(([x,z])=>new THREE.Vector3(x-plan.width/2,.012,z-plan.depth/2)),z.kind==='water'?'#6c8981':'#756d51');}
    groundDetail();
    if(view.footprints){const verts=[];for(let x=0;x<=plan.width;x++)for(let z=0;z<plan.depth;z+=.25)if(inside(x,z,plan.outline)&&inside(x,z+.25,plan.outline))verts.push(new THREE.Vector3(x-plan.width/2,.014,z-plan.depth/2),new THREE.Vector3(x-plan.width/2,.014,z+.25-plan.depth/2));for(let z=0;z<=plan.depth;z++)for(let x=0;x<plan.width;x+=.25)if(inside(x,z,plan.outline)&&inside(x+.25,z,plan.outline))verts.push(new THREE.Vector3(x-plan.width/2,.014,z-plan.depth/2),new THREE.Vector3(x+.25-plan.width/2,.014,z-plan.depth/2));root.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(verts),new THREE.LineBasicMaterial({color:'#f2efcd',transparent:true,opacity:.48})));}
    for(const o of plan.obstacles){const cx=o.x+o.width/2-plan.width/2,cz=o.z+o.depth/2-plan.depth/2;
      if(o.type==='house'){solid('#c8c1ad',cx,o.height/2,cz,o.width,o.height,o.depth);solid('#606c64',cx,o.height+.06,cz,o.width+.16,.12,o.depth+.16);for(let k=0;k<Math.max(1,Math.floor(o.width));k++)solid('#637d7c',o.x-plan.width/2+(k+.5)*o.width/Math.max(1,Math.floor(o.width)),o.height*.55,o.z+o.depth-plan.depth/2+.014,.4,o.height*.24,.025);}
      else if(o.type==='path'){solid('#b7b0a0',cx,.015,cz,o.width,.03,o.depth);const tiles=Math.min(45,Math.ceil(o.depth/.6));for(let j=1;j<tiles;j++)solid('#878a7b',cx,.032,o.z+j*o.depth/tiles-plan.depth/2,o.width,.002,.012);}
      else{solid('#827660',cx,o.height/2,cz,o.width,o.height,o.depth);const count=Math.min(80,Math.ceil(o.width/.16));for(let j=0;j<count;j++)solid('#a0947b',o.x+(j+.5)*o.width/count-plan.width/2,o.height/2,cz,o.width/count*.87,o.height,o.depth+.025);}
    }
    const detail=Math.min(1,Math.sqrt(18/Math.max(1,plan.plants.length)));
    for(const p of plan.plants){const s=stateAt(p,view);if(!s.present)continue;const g=plantModel(p,view,detail);g.position.set(p.x-plan.width/2,.012,p.z-plan.depth/2);plants.add(g);
      const contact=new THREE.Mesh(contactGeometry,contactMaterial);contact.rotation.x=-Math.PI/2;contact.position.set(g.position.x,.012,g.position.z);contact.scale.set(s.spread*.95,s.spread*.95,1);if(zoneAt(plan,p.x,p.z)?.kind!=='water')root.add(contact);
      if(view.footprints)circle(p.x,p.z,s.spread/2,'#9bb9b1');if(p.id===id){circle(p.x,p.z,s.spread/2+.06,'#d2b05f',.018);if(p.management){circle(p.x,p.z,p.management.spread/2,'#7bacad',p.management.height);for(const a of [0,Math.PI]){const x=p.x-plan.width/2+Math.cos(a)*p.management.spread/2,z=p.z-plan.depth/2;line([new THREE.Vector3(x,.04,z),new THREE.Vector3(x,p.management.height,z)],'#7bacad');}}}
    }
    const size=Math.max(plan.width,plan.depth)+8;Object.assign(sun.shadow.camera,{left:-size/2,right:size/2,top:size/2,bottom:-size/2});sun.shadow.camera.updateProjectionMatrix();
    container.dataset.plantCount=String(plants.children.length);dirty=true;
  }
  function setWind(value){windLevel=[0,1,1.7].includes(Number(value))?Number(value):0;wind.strength.value=windLevel;container.dataset.wind=String(windLevel);lastTick=0;dirty=true;}
  function setLight(value){const evening=value==='evening';sun.position.set(...(evening?[-11,6,5]:[-7,12,8]));sun.color.set(evening?'#ffd7a0':'#fff0d2');sun.intensity=evening?2.3:2.8;hemisphere.intensity=evening?1.3:1.7;sky.material.uniforms.top.value.set(evening?'#bac3ce':'#adc5d0');sky.material.uniforms.bottom.value.set(evening?'#e7cdb0':'#e3e0ce');dirty=true;}
  function setView(type){
    if(!plan)return;
    if(type==='focus'&&selection){const p=plan.plants.find(p=>p.id===selection),s=stateAt(p,view);controls.target.set(p.x-plan.width/2,s.height*.52,p.z-plan.depth/2);const d=Math.max(.16,s.height*1.20,s.spread*1.12)*Math.max(1,1/camera.aspect);camera.position.copy(controls.target).add(new THREE.Vector3(d,d*.48,d));}
    else{
      const bounds=new THREE.Box3(new THREE.Vector3(-plan.width/2,0,-plan.depth/2),new THREE.Vector3(plan.width/2,.1,plan.depth/2));
      for(const p of plan.plants){const s=stateAt(p,view);if(!s.present)continue;for(const sign of [-1,1])bounds.expandByPoint(new THREE.Vector3(p.x-plan.width/2+sign*s.spread/2,s.height,p.z-plan.depth/2+sign*s.spread/2));}
      const center=bounds.getCenter(new THREE.Vector3());controls.target.set(center.x,type==='eye'?.7:center.y*.18,center.z);
      const direction=type==='top'?new THREE.Vector3(0,1,.0001):type==='eye'?new THREE.Vector3(.8,.06,1):new THREE.Vector3(.82,.66,1);direction.normalize();
      const right=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),direction).normalize(),up=new THREE.Vector3().crossVectors(direction,right),tan=Math.tan(camera.fov*Math.PI/360);let distance=2;
      const fitPoints=plan.outline.map(([x,z])=>new THREE.Vector3(x-plan.width/2,0,z-plan.depth/2));
      for(const p of plan.plants){const s=stateAt(p,view);if(s.present)for(const dx of [-1,1])for(const dz of [-1,1])fitPoints.push(new THREE.Vector3(p.x-plan.width/2+dx*s.spread/2,s.height,p.z-plan.depth/2+dz*s.spread/2));}
      for(const point of fitPoints){const delta=point.sub(controls.target);distance=Math.max(distance,delta.dot(direction)+1.13*Math.max(Math.abs(delta.dot(right))/(tan*camera.aspect),Math.abs(delta.dot(up))/tan));}
      camera.position.copy(controls.target).addScaledVector(direction,distance);if(type==='eye')camera.position.y=1.6;
    }
    camera.lookAt(controls.target);controls.update();dirty=true;
  }
  new ResizeObserver(()=>{const aspect=container.clientWidth/container.clientHeight,ratio=Math.max(1,1.6/aspect)/Math.max(1,1.6/camera.aspect);camera.position.sub(controls.target).multiplyScalar(ratio).add(controls.target);renderer.setSize(container.clientWidth,container.clientHeight,false);camera.aspect=aspect;camera.updateProjectionMatrix();dirty=true;}).observe(container);
  const ray=new THREE.Raycaster(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0),pointers=new Set();let start=null;
  renderer.domElement.addEventListener('pointerdown',e=>{pointers.add(e.pointerId);start=pointers.size===1?{id:e.pointerId,x:e.clientX,y:e.clientY}:null;});renderer.domElement.addEventListener('pointermove',e=>{if(start&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>=5)start=null;});renderer.domElement.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);start=null;});renderer.domElement.addEventListener('pointerup',e=>{pointers.delete(e.pointerId);if(start&&e.pointerId===start.id&&plan){const rect=renderer.domElement.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const point=ray.ray.intersectPlane(plane,new THREE.Vector3());let id=null;const hits=ray.intersectObjects(plants.children,true);if(hits.length){let obj=hits[0].object;while(obj&&!obj.userData.plantId)obj=obj.parent;id=obj?.userData.plantId??null;}if(point)onPick({x:Math.round((point.x+plan.width/2)*10)/10,z:Math.round((point.z+plan.depth/2)*10)/10,id});}start=null;});
  container.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();camera.position.sub(controls.target).applyAxisAngle(up,e.key==='ArrowLeft'?.12:-.12).add(controls.target);controls.update();dirty=true;}});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();container.dispatchEvent(new CustomEvent('render-failed'));});renderer.setAnimationLoop(now=>{
    if(document.hidden||!visible){lastTick=0;return;}
    const moving=windLevel>0;if(!moving&&!dirty){lastTick=0;return;}
    const interval=1000/(plan?.plants.length>40?24:30);if(!dirty&&now-lastDraw<interval)return;
    if(moving&&lastTick)elapsed+=Math.min(.1,(now-lastTick)/1000);lastTick=now;wind.time.value=elapsed;
    renderer.render(scene,camera);lastDraw=now;dirty=false;container.dataset.frames=String(++frameCount);container.dataset.windTime=elapsed.toFixed(2);
  });
  return {render,wind:setWind,light:setLight,view:setView,editing:value=>{controls.enabled=!value;},zoom:ratio=>{const offset=camera.position.clone().sub(controls.target);offset.setLength(Math.min(120,Math.max(controls.minDistance,offset.length()*ratio)));camera.position.copy(controls.target).add(offset);controls.update();dirty=true;},capture:()=>({position:camera.position.toArray(),target:controls.target.toArray()}),restore:c=>{if(!c)return;camera.position.fromArray(c.position);controls.target.fromArray(c.target);controls.update();dirty=true;},drawDraft:points=>{dispose(draft);draft=new THREE.Group();scene.add(draft);if(plan&&points.length){const vs=points.map(([x,z])=>new THREE.Vector3(x-plan.width/2,.06,z-plan.depth/2));line(vs,'#b67730',draft);for(const v of vs){const m=new THREE.Mesh(sphere,mat('#b67730'));m.position.copy(v);m.scale.setScalar(.06);draft.add(m);}}dirty=true;}};
}
