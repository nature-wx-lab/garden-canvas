import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/OrbitControls.js';
import { CATALOG, clone, outlineFor, area, inside, validOutline, validatePlan, samplePlan } from './model.js';

const $ = id => document.getElementById(id);
let plan=samplePlan(), selected=null, mode='orbit', addKind='flower', draft=[], history=[], pointerStart=null;
let scene,camera,renderer,controls,garden,plantsGroup,outlineGroup,selectionRing,dirty=true;
const ray=new THREE.Raycaster(), plane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
const materials=new Map(), shared=[];
const material=(color)=>{ if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.88}));return materials.get(color); };
const sphere=new THREE.SphereGeometry(1,7,5), stem=new THREE.CylinderGeometry(1,1,1,6), blade=new THREE.ConeGeometry(1,1,5);
shared.push(sphere,stem,blade);
const round=value=>Math.round(value*10)/10;
const message=text=>$('status').textContent=text;
const selectedPlant=()=>plan.plants.find(p=>p.id===selected);
function checkpoint(){history.push(clone(plan));if(history.length>30)history.shift();$('undo').disabled=false;}
function setMode(value){mode=value;controls.enabled=value!=='outline';$('orbit').setAttribute('aria-pressed',String(value==='orbit'));for(const el of $('catalog').children)el.setAttribute('aria-pressed',String(value==='add'&&el.dataset.kind===addKind));$('view-status').textContent=value==='add'?`${CATALOG[addKind].label}を置く場所をクリック`:value==='move'?'移動先をクリック':value==='outline'?'庭の角を順番にクリック':'庭の3D表示 · 1目盛り = 1m';$('viewport').dataset.mode=value;}
function mesh(geo,color,x,y,z,sx,sy,sz){const m=new THREE.Mesh(geo,material(color));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;return m;}
function branch(group,a,b,r){const v=new THREE.Vector3(...b).sub(new THREE.Vector3(...a));const m=mesh(stem,0x837261,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,r,v.length(),r);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());group.add(m);}
function buildPlant(p){
  const g=new THREE.Group();g.position.set(p.x-plan.width/2,.035,p.z-plan.depth/2);g.userData.plantId=p.id;
  const h=p.height,w=p.spread,month=plan.month,winter=month===12||month<=2,autumn=month>=10&&month<=11;
  if(p.kind==='deciduous'||p.kind==='evergreen'){
    branch(g,[0,0,0],[0,h*.82,0],Math.max(.02,h*.023));
    const color=p.kind==='evergreen'?0x64846b:autumn?0xb58543:month<=4?0x98ad63:0x77935c;
    for(let i=0;i<9;i++){
      const angle=i*2.399+p.id*.3,r=w*.27*(i<6?1:.65),y=h*(.52+(i%3)*.11),x=Math.cos(angle)*r,z=Math.sin(angle)*r;
      branch(g,[0,h*.28,0],[x,y,z],Math.max(.012,h*.009));
      if(p.kind==='evergreen'||!winter){
        g.add(mesh(sphere,color,x,y,z,w*.23,h*.17,w*.23));
        for(let k=0;k<3;k++)g.add(mesh(sphere,k%2?0x8a9d64:color,x+Math.cos(k*2+i)*w*.1,y+h*.06,z+Math.sin(k*2+i)*w*.1,w*.15,h*.11,w*.16));
      }
    }
    if(!winter||p.kind==='evergreen')g.add(mesh(sphere,color,0,h*.87,0,w*.24,h*.13,w*.24));
  }else if(p.kind==='flower'){
    const foliage=winter?.2:1;
    for(let i=0;i<11;i++){
      const angle=i*2.399,r=w*.31*Math.sqrt((i+1)/11),x=Math.cos(angle)*r,z=Math.sin(angle)*r;
      const leaf=mesh(sphere,winter?0x9a916f:0x648854,x,h*.19*foliage,z,w*.16,h*.24*foliage,w*.08);leaf.rotation.z=Math.cos(angle)*.5;g.add(leaf);
      if(month>=4&&month<=9){
        const y=h*(.55+((i*7)%5)*.09);branch(g,[x,0,z],[x,y,z],.009);
        const color=month<=6?0xb77e9d:0xc3a269;
        for(let k=0;k<5;k++){const a=k*Math.PI*2/5;g.add(mesh(sphere,color,x+Math.cos(a)*w*.047,y,z+Math.sin(a)*w*.047,w*.05,h*.023,w*.05));}
        g.add(mesh(sphere,0xd8b663,x,y+.008,z,w*.033,h*.026,w*.033));
      }
    }
  }else{
    for(let i=0;i<17;i++){
      const angle=i*2.399,r=w*.19*Math.sqrt(i/17),y=h*(.65+((i*11)%7)*.05),color=winter||autumn?0xb4a37a:0x8d9d69;
      const m=mesh(blade,color,Math.cos(angle)*r,y/2,Math.sin(angle)*r,w*.045,y,w*.025);m.rotation.z=Math.cos(angle)*.28;m.rotation.x=Math.sin(angle)*.28;g.add(m);
    }
  }
  return g;
}
function disposeOwned(group){if(!group)return;group.traverse(o=>{if(o.geometry&&!shared.includes(o.geometry))o.geometry.dispose();if(o.material&&!Array.from(materials.values()).includes(o.material)&&o.material!==lineMaterial&&o.material!==ringMaterial)o.material.dispose();});scene.remove(group);}
function rebuild(){
  disposeOwned(garden);disposeOwned(plantsGroup);garden=new THREE.Group();plantsGroup=new THREE.Group();
  const shape=new THREE.Shape(plan.outline.map(([x,z])=>new THREE.Vector2(x-plan.width/2,-z+plan.depth/2)));
  const soil=new THREE.Mesh(new THREE.ShapeGeometry(shape),material(plan.month<=2||plan.month===12?0xadb18c:0xacba83));soil.rotation.x=-Math.PI/2;soil.receiveShadow=true;garden.add(soil);
  const border=plan.outline.concat([plan.outline[0]]).map(([x,z])=>new THREE.Vector3(x-plan.width/2,.035,z-plan.depth/2));
  garden.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(border),lineMaterial));
  const grid=new THREE.GridHelper(Math.ceil(Math.max(plan.width,plan.depth)),Math.ceil(Math.max(plan.width,plan.depth)),0x91a087,0xa9b39f);grid.position.y=.012;grid.material.transparent=true;grid.material.opacity=.26;garden.add(grid);
  const pad=mesh(new THREE.BoxGeometry(plan.width+.6,.16,plan.depth+.6),0xd8d9c4,0,-.16,0,1,1,1);pad.castShadow=false;garden.add(pad);
  scene.add(garden);for(const p of plan.plants)plantsGroup.add(buildPlant(p));scene.add(plantsGroup);updateSelection();dirty=true;
  $('area').textContent=`${area(plan.outline).toFixed(1)} m² · ${plan.plants.length}株`;
  $('count').textContent=`${plan.plants.length}株`;
  const list=$('plant-list');list.replaceChildren();for(const p of plan.plants){const b=document.createElement('button');b.textContent=`${p.id} ${CATALOG[p.kind].label}`;b.setAttribute('aria-pressed',String(p.id===selected));b.addEventListener('click',()=>select(p.id));list.append(b);}
}
const lineMaterial=new THREE.LineBasicMaterial({color:0x69855a});
function updateSelection(){
  if(selectionRing){selectionRing.geometry.dispose();scene.remove(selectionRing);selectionRing=null;}
  const p=selectedPlant();$('no-selection').hidden=!!p;$('selected-fields').hidden=!p;
  if(p){$('kind').value=p.kind;$('height').value=p.height;$('spread').value=p.spread;$('plant-x').value=p.x;$('plant-z').value=p.z;
    selectionRing=new THREE.Mesh(new THREE.RingGeometry(p.spread/2+.08,p.spread/2+.13,48),ringMaterial);selectionRing.rotation.x=-Math.PI/2;selectionRing.position.set(p.x-plan.width/2,.055,p.z-plan.depth/2);scene.add(selectionRing);
  }dirty=true;
}
const ringMaterial=new THREE.MeshBasicMaterial({color:0xf0cc72,side:THREE.DoubleSide});
function select(id){selected=id;setMode('orbit');updateSelection();for(const b of $('plant-list').children)b.setAttribute('aria-pressed',String(b.textContent.startsWith(`${id} `)));message(`${CATALOG[selectedPlant().kind].label}を選びました。寸法や場所を変更できます。`);}
function sync(){ $('width').value=plan.width;$('depth').value=plan.depth;$('month').value=plan.month;$('month-label').textContent=`${plan.month}月`;$('shape').value=JSON.stringify(plan.outline)===JSON.stringify(outlineFor('rectangle',plan.width,plan.depth))?'rectangle':JSON.stringify(plan.outline)===JSON.stringify(outlineFor('lshape',plan.width,plan.depth))?'lshape':'custom';rebuild(); }
function view(type){
  const size=Math.max(plan.width,plan.depth)*Math.max(1,1.4/camera.aspect);controls.target.set(0,0,0);
  camera.position.set(...(type==='top'?[0,size*1.7,.001]:type==='eye'?[size*.9,2,size*1.1]:[size*.95,size*.85,size*1.05]));camera.lookAt(controls.target);controls.update();dirty=true;
}
function groundPoint(event){const box=renderer.domElement.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((event.clientX-box.left)/box.width*2-1,-(event.clientY-box.top)/box.height*2+1),camera);const v=ray.ray.intersectPlane(plane,new THREE.Vector3());return v?{x:round(v.x+plan.width/2),z:round(v.z+plan.depth/2)}:null;}
function handleClick(event){
  const point=groundPoint(event);if(!point)return;
  if(mode==='outline'){
    if(point.x<0||point.x>plan.width||point.z<0||point.z>plan.depth){message('表示中の長方形の範囲内で角を選んでください。');return;}
    if(draft.length>=16){message('角は16点までです。「形を確定」を押してください。');return;}
    draft.push([point.x,point.z]);drawOutline();return;
  }
  if(mode==='add'||mode==='move'){
    if(!inside(point.x,point.z,plan.outline)){message('庭の輪郭の内側を選んでください。');return;}
    if(mode==='add'){
      if(plan.plants.length>=100){message('初期版は100株まで配置できます。');return;}
      checkpoint();const kind=addKind;selected=1;while(plan.plants.some(p=>p.id===selected))selected++;
      plan.plants.push({id:selected,kind,x:point.x,z:point.z,height:CATALOG[kind].height,spread:CATALOG[kind].spread});
      message(`${CATALOG[kind].label}を配置しました。続けて置くか、「眺める・選ぶ」で戻れます。`);
    }else{const p=selectedPlant();if(!p)return;checkpoint();p.x=point.x;p.z=point.z;setMode('orbit');message('植物を移動しました。');}
    rebuild();return;
  }
  const hits=ray.intersectObjects(plantsGroup.children,true);if(hits.length){let obj=hits[0].object;while(obj&&!obj.userData.plantId)obj=obj.parent;if(obj)select(obj.userData.plantId);}else{selected=null;updateSelection();for(const b of $('plant-list').children)b.setAttribute('aria-pressed','false');}
}
function drawOutline(){disposeOwned(outlineGroup);outlineGroup=new THREE.Group();const vertices=draft.map(([x,z])=>new THREE.Vector3(x-plan.width/2,.08,z-plan.depth/2));if(vertices.length>1)outlineGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(vertices),lineMaterial));for(const p of vertices)outlineGroup.add(mesh(sphere,0xc28c37,p.x,p.y,p.z,.08,.06,.08));scene.add(outlineGroup);$('outline-count').textContent=`${draft.length}点`;dirty=true;}
function endOutline(){draft=[];disposeOwned(outlineGroup);outlineGroup=null;$('outline-tools').hidden=true;setMode('orbit');}
function applyOutline(points){if(plan.plants.some(p=>!inside(p.x,p.z,points))){message('輪郭の外に植物が残ります。先に植物を移すか取り除いてください。');return false;}checkpoint();plan.outline=points;endOutline();sync();message('庭の形を変更しました。');return true;}
function bind(){
  for(const [kind,info] of Object.entries(CATALOG)){
    const b=document.createElement('button');b.dataset.kind=kind;b.setAttribute('aria-pressed','false');const icon=document.createElement('span');icon.className=`plant-symbol ${kind}`;icon.setAttribute('aria-hidden','true');b.append(icon,document.createTextNode(info.label));b.addEventListener('click',()=>{if(mode==='outline')endOutline();addKind=kind;setMode('add');message('庭の中をクリックすると配置できます。');});$('catalog').append(b);
    const opt=document.createElement('option');opt.value=kind;opt.textContent=info.label;$('kind').append(opt);
  }
  for(const id of ['width','depth'])$(id).addEventListener('change',()=>{const value=Number($(id).value);if(!Number.isFinite(value)||value<2||value>30){sync();message('庭の寸法は2〜30mで入力してください。');return;}endOutline();const next=clone(plan),ratio=value/plan[id],index=id==='width'?0:1;next[id]=value;next.outline=next.outline.map(p=>p.map((v,i)=>i===index?v*ratio:v));for(const p of next.plants)p[id==='width'?'x':'z']*=ratio;try{validatePlan(next);}catch{sync();message('変更後の輪郭が小さすぎます。庭の形か寸法を見直してください。');return;}checkpoint();plan=next;sync();view('home');message('庭の寸法と植物の配置を伸縮しました。植物自体の寸法は変わりません。');});
  $('shape').addEventListener('change',()=>{const shape=$('shape').value;if(shape==='custom'){draft=[];setMode('outline');$('outline-tools').hidden=false;$('outline-count').textContent='0点';view('top');message('庭の角を順にクリックし、「形を確定」を押してください。');}else if(!applyOutline(outlineFor(shape,plan.width,plan.depth)))sync();});
  $('finish-outline').addEventListener('click',()=>{if(!validOutline(draft,plan.width,plan.depth)){message('交差しない3〜16点で、1m²以上の形を囲んでください。');return;}applyOutline(clone(draft));});
  $('cancel-outline').addEventListener('click',()=>{endOutline();sync();message('形の変更を取り消しました。');});
  $('orbit').addEventListener('click',()=>{endOutline();sync();message('ドラッグで回転、植物をクリックで選択できます。');});
  for(const type of ['home','top','eye'])$(`view-${type}`).addEventListener('click',()=>{if(mode==='outline'){message('形の編集中は真上の視点を使います。');return;}view(type);});
  for(const [id,ratio] of [['zoom-in',.8],['zoom-out',1.25]])$(id).addEventListener('click',()=>{const offset=camera.position.clone().sub(controls.target),distance=Math.min(65,Math.max(2,offset.length()*ratio));camera.position.copy(controls.target).add(offset.setLength(distance));controls.update();dirty=true;});
  $('month').addEventListener('input',()=>{plan.month=Number($('month').value);$('month-label').textContent=`${plan.month}月`;rebuild();});
  for(const [id,key,min,max] of [['height','height',.1,8],['spread','spread',.1,6],['plant-x','x',0,30],['plant-z','z',0,30]])$(id).addEventListener('change',()=>{const p=selectedPlant(),value=Number($(id).value);if(!p)return;if(!Number.isFinite(value)||value<min||value>max||((key==='x'||key==='z')&&!inside(key==='x'?value:p.x,key==='z'?value:p.z,plan.outline))){updateSelection();message('庭の範囲内の位置と、有効な寸法を入力してください。');return;}checkpoint();p[key]=value;rebuild();message('選んだ植物を更新しました。');});
  $('kind').addEventListener('change',()=>{const p=selectedPlant();if(!p)return;checkpoint();p.kind=$('kind').value;rebuild();message('同じ場所・同じ寸法で植物の形を交換しました。');});
  $('move').addEventListener('click',()=>{setMode('move');message('移動したい場所を庭の中でクリックしてください。');});
  $('remove').addEventListener('click',()=>{checkpoint();plan.plants=plan.plants.filter(p=>p.id!==selected);selected=null;setMode('orbit');rebuild();message('植物を取り除きました。「元に戻す」で戻せます。');});
  $('undo').addEventListener('click',()=>{if(!history.length)return;plan=history.pop();selected=null;endOutline();sync();$('undo').disabled=!history.length;message('直前の編集に戻しました。');});
  $('help').addEventListener('click',()=>$('help-dialog').showModal());$('help-close').addEventListener('click',()=>$('help-dialog').close());
  $('export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(validatePlan(plan),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='garden-canvas-plan.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);message('保存ファイルを端末へ書き出しました。庭の寸法と配置が含まれます。');});
  $('import').addEventListener('click',()=>$('file').click());
  $('file').addEventListener('change',async()=>{const file=$('file').files[0];if(!file)return;try{if(file.size>100000)throw new Error('ファイルが大きすぎます。100KB以内の庭データを選んでください。');const next=validatePlan(JSON.parse(await file.text()));checkpoint();plan=next;selected=null;endOutline();sync();view('home');message('保存した庭を開きました。');}catch{message('このファイルは開けません。対応する100KB以内の庭データを選んでください。元の庭は変更していません。');}finally{$('file').value='';}});
  const activePointers=new Set();
  renderer.domElement.addEventListener('pointerdown',e=>{activePointers.add(e.pointerId);pointerStart=activePointers.size===1?{id:e.pointerId,x:e.clientX,y:e.clientY}:null;});
  renderer.domElement.addEventListener('pointermove',e=>{if(pointerStart&&Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)>=5)pointerStart=null;});
  renderer.domElement.addEventListener('pointerup',e=>{activePointers.delete(e.pointerId);if(pointerStart&&pointerStart.id===e.pointerId&&Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)<5)handleClick(e);pointerStart=null;});
  renderer.domElement.addEventListener('pointercancel',e=>{activePointers.delete(e.pointerId);pointerStart=null;});
  $('viewport').addEventListener('keydown',e=>{if(e.key==='Escape'){endOutline();sync();}else if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const offset=camera.position.clone().sub(controls.target);offset.applyAxisAngle(new THREE.Vector3(0,1,0),e.key==='ArrowLeft'?.12:-.12);camera.position.copy(controls.target).add(offset);controls.update();dirty=true;}});
}
function init(){
  scene=new THREE.Scene();scene.background=new THREE.Color(0xe9eee5);camera=new THREE.PerspectiveCamera(40,1,.1,200);
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.setClearColor(0xe9eee5);renderer.domElement.setAttribute('aria-label','庭の3Dキャンバス');$('viewport').append(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xfffff5,0x929b7c,2.7));const sun=new THREE.DirectionalLight(0xfff8df,3.1);sun.position.set(-5,12,6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-22;sun.shadow.camera.right=22;sun.shadow.camera.top=22;sun.shadow.camera.bottom=-22;sun.shadow.bias=-.001;scene.add(sun);
  controls=new OrbitControls(camera,renderer.domElement);controls.maxPolarAngle=Math.PI/2-.04;controls.minDistance=2;controls.maxDistance=65;controls.enableDamping=false;controls.addEventListener('change',()=>{dirty=true;});
  camera.aspect=$('viewport').clientWidth/$('viewport').clientHeight;camera.updateProjectionMatrix();
  new ResizeObserver(()=>{const box=$('viewport'),nextAspect=box.clientWidth/box.clientHeight,ratio=Math.max(1,1.4/nextAspect)/Math.max(1,1.4/camera.aspect);camera.position.sub(controls.target).multiplyScalar(ratio).add(controls.target);renderer.setSize(box.clientWidth,box.clientHeight,false);camera.aspect=nextAspect;camera.updateProjectionMatrix();dirty=true;}).observe($('viewport'));
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();$('error').hidden=false;$('error').textContent='3D表示が停止しました。必要な庭を「保存」してからページを再読込してください。';});
  bind();sync();view('home');setMode('orbit');$('loading').hidden=true;
  renderer.setAnimationLoop(()=>{if(dirty){renderer.render(scene,camera);dirty=false;}});
}
try{init();}catch{ $('loading').hidden=true;$('error').hidden=false;$('error').textContent='この環境では3D表示を開始できません。WebGL 2に対応したブラウザーでお試しください。'; }
