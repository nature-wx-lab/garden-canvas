import {foliageKind,patternKind} from './appearance.js?v=0.9.75';
import * as THREE from './vendor/three.module.js';
const TAU=Math.PI*2;
export function pomeShrubLeafPoint(type,t,u){
 const pyr=type==='harlequin',cycle=(t*18)%1,tooth=pyr&&t>.12&&t<.92?1+.036*(cycle<.7?cycle/.7:(1-cycle)/.3):1;
 const width=Math.pow(Math.sin(Math.PI*t),pyr?.53:.60)*(.88+.20*t)*tooth;
 return [u*width*.5,t,.044*u*u*Math.sin(Math.PI*t)-.035*t*t];
}
export function pomeShrubFlowerGeometry(){
 const pos=[],uv=[],ix=[];
 for(let k=0;k<5;k++){
  const az=k*TAU/5,base=pos.length/3,rows=16,cols=8;
  for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
   const t=i/rows,u=j/cols*2-1,r=.17+.83*t,width=.47*Math.pow(Math.sin(Math.PI*t),.50),y=.10+.19*Math.sin(Math.PI*t*.8)+.045*u*u;
   pos.push(Math.sin(az)*r+Math.cos(az)*u*width,y,Math.cos(az)*r-Math.sin(az)*u*width);uv.push(j/cols,t);
   if(i<rows&&j<cols){const q=base+i*(cols+1)+j;ix.push(q,q+cols+1,q+1,q+1,q+cols+1,q+cols+2);}
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.pomeShrubFlower={petals:5};return g;
}
function drawPomeShrubs(b,{info,s,detail,rand},kit){
 const a=info.appearance,pyr=a.shootProfile==='harlequin',h=s.height,w=s.spread,leaves=[],tips=[],wood=[],type=a.shootProfile;
 const shoot=(origin,az,rise,reach,order)=>{
  const bend=pyr?.14:.26,path=t=>[origin[0]+Math.sin(az)*reach*t,origin[1]+rise*((1+bend)*t-bend*t*t)-h*(pyr?.012:.045)*t*t*t,origin[2]+Math.cos(az)*reach*t],steps=8,count=order===0?18:order===1?12:7;
  for(let j=1;j<=steps;j++)wood.push({from:path((j-1)/steps),to:path(j/steps),r:(order===0?.004:order===1?.0017:.0008)*(1-.73*j/steps),order});
  for(let j=1;j<=count;j++){
   const t=.05+j*.91/count,at=path(t),angle=az+j*2.399963;
   leaves.push({at,az:angle,roll:rand(),size:.70+rand()*.30,young:j===count});
   if(order<2&&j>1&&j<count&&j%(order===0?2:3)===0){
    const side=j%4<2?-1:1,theta=az+side*(.48+rand()*.48),length=(order===0?.16:.067)*( .75+rand()*.45);
    shoot(at,theta,h*length*(.7+rand()*.75),w*length*(pyr?.85:1.1),order+1);
   }
  }
  if(order===2)tips.push({at:path(.92),az,roll:rand()});
 };
 for(let k=0;k<Math.round(22*detail);k++){
  const az=k*2.399963+rand()*.32,low=k%3===0;
  shoot([Math.sin(az)*w*.025,0,Math.cos(az)*w*.025],az,h*(low?.16+rand()*.15:.35+rand()*.43),w*(low?.35:.16+rand()*.17),0);
 }
 for(const n of wood){
  b.branch(n.from,n.to,n.r,n.order===0?a.barkColor:a.stemColor,'wood-pome-shrub');
  if(pyr&&n.r>.004)b.add(kit.bud,'lenticel-pome-shrub','#b3a090',n.to[0],n.to[1],n.to[2]+n.r,.0006,.00045,.0004);
 }
 for(const n of leaves){
  if(pyr&&n.roll>Math.max(.84,s.leafDensity))continue;
  const young=n.young&&[4,5].includes(s.month),L=a.leafLength*n.size*(young?.68:1),f=flowerFrame(b,n.at,.68+n.roll*.85,n.az),color=young?(pyr?'#b08c73':'#9ba58d'):s.leafColor;
  f.branch([0,0,0],[0,.0025,0],.0003,a.stemColor,'petiole-pome-shrub');
  const kind=pyr?`leaf-pome-harlequin-${s.leafPatternColor.slice(1)}-underside-b7bf9e`:'leaf-pome-silver-underside-c2c4b4';
  f.add('pome-'+type,kind,kit.shade(rand,color,.028),0,.0025,0,L*a.leafWidth/a.leafLength,L,L);
  if(pyr&&n.roll<.010)f.branch([0,0,0],[.002,.011,.002],.0008,'#926d54','thorn-pome-shrub');
 }
 const ripe=a.fruitMonths.includes(s.month),green=a.greenFruitMonths?.includes(s.month);
 for(const n of tips){
  const fruit=!pyr&&(ripe||green)&&n.roll<([2,3,4,5].includes(s.month)?.12:.50),flower=s.bloom&&n.roll<(pyr?.12:.38);
  if(!fruit&&!flower)continue;
  const cluster=flowerFrame(b,n.at,.50,n.az),count=fruit?5:pyr?13:7,spread=fruit?.010:.014;
  for(let j=0;j<count;j++){
   const az=j*2.399963,rad=spread*Math.sqrt((j+.5)/count),at=[Math.sin(az)*rad,.012+rand()*.005,Math.cos(az)*rad];cluster.branch([0,0,0],at,.00027,a.stemColor,'pedicel-pome-shrub');
   const f=flowerFrame(cluster,at,fruit?1.6:rand()*.40,az),R=fruit?a.fruitRadius*(green?.75:1):a.flowerRadius;
   if(fruit){
    f.add(kit.bud,'fruit-glossy-pome-shrub',kit.shade(rand,green?'#87935e':a.fruitColor,.025),0,R,0,R,R*.93,R);
    f.add(kit.bud,'calyx-eye-pome-shrub','#624f3f',0,R*1.89,0,R*.32,R*.08,R*.32);
    for(let k=0;k<5;k++)f.add(kit.cone,'calyx-tooth-pome-shrub',green?'#758356':'#89705b',Math.sin(k*TAU/5)*R*.26,R*1.90,Math.cos(k*TAU/5)*R*.26,R*.12,R*.34,R*.12,.48,k*TAU/5,0);
   }else{
    f.add('pomeFlower','petal-pome-shrub',s.flowerColor,0,0,0,R,R,R);f.add(kit.bud,'flower-disc-pome-shrub','#c6bf8b',0,R*.12,0,R*.24,R*.10,R*.24);
    for(let k=0;k<a.stamenCount;k++){
     const theta=k*TAU/a.stamenCount,end=[Math.sin(theta)*R*.38,R*(.42+(k%3)*.05),Math.cos(theta)*R*.38];f.branch([end[0]*.4,R*.12,end[2]*.4],end,R*.018,'#e4d9be','filament-pome-shrub');f.add(kit.bud,'anther-pome-shrub','#b09b73',...end,R*.049,R*.039,R*.044);
    }
   }
  }
 }
}

export function ardisiaLeafPoint(type,t,u){
 const tall=type==='benikujaku',phase=t*(tall?12:21),cycle=phase%1,teeth=t>.05&&t<.96?(tall?.035*Math.cos(phase*TAU):.055*(cycle<.72?cycle/.72:(1-cycle)/.28)):0;
 const width=Math.pow(Math.sin(Math.PI*t),tall?.70:.76)*(1.02-.14*t)*(1+teeth),wave=(tall?.006:.004)*Math.cos(phase*TAU)*Math.pow(Math.abs(u),3);
 return [u*width*.5,t,Math.sin(Math.PI*t)*(.05*u*u+wave)-.08*t*t];
}
export function ardisiaFlowerGeometry(){
 const pos=[],uv=[],ix=[];
 for(let k=0;k<5;k++){
  const az=k*TAU/5,start=pos.length/3,rows=14,cols=6;
  for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
   const t=i/rows,u=j/cols*2-1,r=.10+.90*t,width=.40*Math.pow(Math.sin(Math.PI*t),.81),y=.06+.20*Math.sin(Math.PI*t)-.17*t*t;
   pos.push(Math.sin(az)*r+Math.cos(az)*u*width,y,Math.cos(az)*r-Math.sin(az)*u*width);uv.push(j/cols,t);
   if(i<rows&&j<cols){const q=start+i*(cols+1)+j;ix.push(q,q+cols+1,q+1,q+1,q+cols+1,q+cols+2);}
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.ardisiaFlower={lobes:5};return g;
}
function drawArdisia(b,{info,s,detail,rand},kit){
 const a=info.appearance,type=a.shootProfile,tall=type==='benikujaku',h=s.height,w=s.spread,leaves=[],clusters=[],shoots=tall?1:Math.round(15*detail);
 const addLeaves=(at,angle,tier,level)=>{
  const count=tall?6:4;
  for(let k=0;k<count;k++){
   const az=angle+k*(tall?2.399963:TAU/count),rise=tall?(k-(count-1)*.5)*h*.027:k*.0015,origin=[at[0],at[1]+rise,at[2]];
   if(tall)b.branch(at,origin,.0014,a.stemColor,'wood-ardisia-leafy-shoot');
   leaves.push({at:origin,az,young:tier===1&&k>=3,size:.73+rand()*.26,roll:rand(),level});
  }
 };
 for(let i=0;i<shoots;i++){
  const az=i*2.399963,rad=tall?0:w*.31*Math.sqrt((i+.5)/shoots),root=[Math.sin(az)*rad,0,Math.cos(az)*rad],height=h*(tall?.80:.27+rand()*.39),tip=[root[0]+Math.sin(az)*h*.025,height,root[2]+Math.cos(az)*h*.025];
  b.branch(root,tip,tall?Math.min(.007,h*.02):.00125,a.barkColor,'wood-ardisia');
  for(let tier=0;tier<2;tier++){const at=tip.map((v,k)=>k===1?v-h*(tier===0?.18:0):v);addLeaves(at,az+tier*.63,tier,tier);}
  if(tall){
   for(let branch=0;branch<6;branch++){
    const angle=branch*2.399963,base=[0,h*(.35+branch*.065),0],end=[Math.sin(angle)*w*.13,h*(.43+branch*.065),Math.cos(angle)*w*.13];b.branch(base,end,.0022,a.barkColor,'wood-ardisia-lateral');
    addLeaves(end,angle,branch>3?1:0,branch);clusters.push({at:end,az:angle,roll:rand()});
   }
  }else clusters.push({at:[tip[0],tip[1]-h*.15,tip[2]],az,roll:rand()});
 }
 for(const n of leaves){
  const flush=tall&&n.young&&s.month>=6&&s.month<=10,L=a.leafLength*n.size*(flush?.80:1),P=.004,f=flowerFrame(b,n.at,n.young?.50+n.roll*.52:1.01+n.roll*.55,n.az),kind=`leaf-ardisia-${type}${flush?'-flush':''}-underside-${a.leafUnderside.slice(1)}`;
  f.branch([0,0,0],[0,P,0],.00035,a.stemColor,'petiole-ardisia');f.add('ardisia-'+type,kind,kit.shade(rand,tall?(flush?'#70465e':n.level<2?'#4f6247':'#49484b'):a.leafColor,.035),0,P,0,L*a.leafWidth/a.leafLength,L,L);
  if(tall)for(let k=1;k<10;k++)for(const side of [-1,1]){const p=ardisiaLeafPoint(type,k/12,side);f.add(kit.bud,'leaf-gland-ardisia','#746359',p[0]*L*a.leafWidth/a.leafLength,P+p[1]*L,p[2]*L,.00035,.00045,.00030);}
 }
 for(const n of clusters){
  const flower=s.bloom&&(tall||n.roll<.52),ripe=a.fruitMonths.includes(s.month),green=a.greenFruitMonths.includes(s.month),fruit=(ripe||green)&&n.roll<(tall?.70:type==='white'?.16:.25);
  if(!flower&&!fruit)continue;
  const downward=flowerFrame(b,n.at,2.73,n.az),len=tall?.038:.013,spread=tall?.021:.008,count=flower?(tall?9:3):(tall?6:1);
  downward.branch([0,0,0],[0,len*.50,0],.00055,a.stemColor,'peduncle-ardisia');
  for(let j=0;j<count;j++){
   const az=j*2.399963,rad=spread*Math.sqrt((j+.5)/count),at=[Math.sin(az)*rad,len*(.68+(j%3)*.16),Math.cos(az)*rad];downward.branch([0,len*.50,0],at,.00025,a.stemColor,'pedicel-ardisia');
   const f=flowerFrame(downward,at,.2,az);
   if(fruit){const R=a.fruitRadius*(green?.73:1);f.add(kit.bud,'fruit-glossy-ardisia',ripe?a.fruitColor:'#81935e',0,R*.70,0,R,R,R);for(let k=0;k<5;k++)f.add('ardisia-white','calyx-ardisia','#65805b',0,0,0,R*.24,R*.45,R*.45,.72,k*TAU/5,0);}
   else{
    const R=a.flowerRadius;f.add('ardisiaFlower','petal-ardisia',s.flowerColor,0,0,0,R,R,R);
    for(let k=0;k<5;k++){const az=k*TAU/5;f.add(kit.cone,'anther-ardisia','#dab468',Math.sin(az)*R*.13,R*.28,Math.cos(az)*R*.13,R*.10,R*.62,R*.10,-.10,az,0);}
    f.branch([0,0,0],[0,R*.94,0],R*.024,'#dfd0a8','style-ardisia');
   }
  }
 }
}

export function callicarpaLeafPoint(type,t,u){
 const small=type==='dichotoma',serrate=t>(small?.49:.06)&&t<.94,cycle=(t*(small?11:24))%1,tooth=serrate?1+(small?.15:.055)*(cycle<.70?cycle/.70:(1-cycle)/.30):1;
 const width=Math.pow(Math.sin(Math.PI*t),.88)*(small?.64+.66*t:1.08-.28*t)*tooth,vein=.004*Math.cos(t*18*Math.PI-Math.abs(u)*3);
 return [u*width*.5,t,(.035*u*u+vein*Math.abs(u))*Math.sin(Math.PI*t)-.055*t*t];
}
export function callicarpaFlowerGeometry(){
 const g=osmanthusFlowerGeometry(false);g.userData={callicarpaFlower:{lobes:4}};return g;
}
function drawCallicarpa(b,{info,s,detail,rand},kit){
 const a=info.appearance,type=a.shootProfile,h=s.height,w=s.spread,small=type==='dichotoma',large=type==='large',nodes=[],wood=[],canes=Math.round(12*detail);
 const shoot=(origin,az,rise,reach,order)=>{
  const path=t=>[origin[0]+Math.sin(az)*reach*t,origin[1]+rise*(1.88*t-.88*t*t)-h*(small?.25:.14)*t*t*t,origin[2]+Math.cos(az)*reach*t],steps=12;
  for(let n=1;n<=steps;n++)wood.push({from:path((n-1)/steps),to:path(n/steps),r:(order===0?.008:.0025)*(1-.74*n/steps)});
  const count=order===0?10:7;
  for(let n=1;n<=count;n++){
   const t=.06+n*.90/count,at=path(t),roll=rand();nodes.push({at,above:path(Math.min(.98,t+.014)),az:az+n*Math.PI/2,roll,t,order,size:.60+rand()*.40});
   if(order===0&&[2,4,6,8].includes(n))for(const side of [-1,1])shoot(at,az+side*(.65+rand()*.30),h*(.20+rand()*.19),w*(.18+rand()*.08),1);
  }
 };
 for(let k=0;k<canes;k++){const az=k*2.399963+rand()*.3;shoot([Math.sin(az)*w*.025,0,Math.cos(az)*w*.025],az,h*(.50+rand()*.32),w*(.24+rand()*.15),0);}
 for(const q of wood){
  b.branch(q.from,q.to,q.r,a.barkColor,'wood-callicarpa');
  if(q.r>.003){const at=q.to;for(let k=0;k<2;k++)b.add(kit.bud,'lenticel-callicarpa','#b8aa91',at[0]+Math.sin(k*3.1)*q.r*.75,at[1]-.004,at[2]+Math.cos(k*3.1)*q.r*.75,.0006,.0005,.0005);}
 }
 for(const n of nodes){
  for(let side=0;side<2;side++){
   const az=n.az+side*Math.PI,roll=(n.roll+side*.371)%1;
   if(s.leafDensity>0&&roll<s.leafDensity){
    const len=a.leafLength*n.size*s.leafScale,pet=.004,at=[n.at[0]+Math.sin(az)*pet,n.at[1]+pet*.3,n.at[2]+Math.cos(az)*pet],f=flowerFrame(b,at,.74+n.roll*.85,az),col=s.autumn?'#a7a35c':a.leafColor;
    b.branch(n.at,at,.00035,a.stemColor,'petiole-callicarpa');f.add('callicarpa-'+type,`leaf-callicarpa-${type}-underside-99a279`,kit.shade(rand,col,.046),0,0,0,len*a.leafWidth/a.leafLength,len,len,0,(n.roll-.5)*.45,0);
   }else if(s.leafDensity===0)b.add(kit.bud,'winter-bud-callicarpa','#99897c',n.at[0]+Math.sin(az)*.002,n.at[1]+.001,n.at[2]+Math.cos(az)*.002,.001,.0035,.001,.30,az,0);
  }
  const ripe=a.fruitMonths.includes(s.month),green=a.greenFruitMonths.includes(s.month),show=s.bloom||ripe||green;
  if(!show||n.t<.25||n.t>.88||n.order===0&&n.roll>.45||s.month===11&&n.roll>.28)continue;
  // Dichotoma peduncles arise slightly above the opposing petioles.
  const at=small?n.above:n.at,az=n.az+1.45,cluster=flowerFrame(b,at,.65,az),stalk=small?.008:large?.017:.015,spread=large?.026:small?.010:.018;
  cluster.branch([0,0,0],[0,stalk,0],.00035,a.stemColor,'peduncle-callicarpa');
  const total=large?66:small?24:type==='pink'?22:12;
  for(let j=0;j<total;j++){
   const theta=j*2.399963,rad=spread*Math.sqrt((j+.5)/total),pt=[Math.sin(theta)*rad,stalk+.006*Math.cos(theta*1.72)+.004*(1-rad/spread),Math.cos(theta)*rad],branch=[pt[0]*.45,stalk,pt[2]*.45];
   cluster.branch([0,stalk,0],branch,.00018,a.stemColor,'cyme-callicarpa');cluster.branch(branch,pt,.00014,a.stemColor,'pedicel-callicarpa');
   if(s.bloom){
    const f=flowerFrame(cluster,pt,.20+(j%3)*.23,theta),R=a.flowerRadius;f.branch([0,0,0],[0,.002,0],.00045,'#c9a5c0','corolla-tube-callicarpa');f.add('callicarpaFlower','petal-callicarpa',s.flowerColor,0,.002,0,R,R,R);
    for(let k=0;k<4;k++){const an=k*TAU/4,end=[Math.sin(an)*.0011,.005,Math.cos(an)*.0011];f.branch([Math.sin(an)*.0005,.002,Math.cos(an)*.0005],end,.00008,'#c3aac0','filament-callicarpa');f.add(kit.bud,'anther-callicarpa','#dabf69',...end,.00035,.00030,.00025);}
    f.branch([0,.002,0],[.0003,.0055,0],.00008,'#d3c5c5','style-callicarpa');
   }else{
    const R=a.fruitRadius*(green?.70:1),color=green?'#91a26d':type==='pink'&&s.month===10?'#d0b4c6':a.fruitColor;
    cluster.add(kit.bud,'fruit-glossy-callicarpa',kit.shade(rand,color,.025),...pt,R,R*.92,R);cluster.add(kit.bud,'stigma-callicarpa','#ad9987',pt[0],pt[1]+R*.91,pt[2],R*.17,R*.06,R*.17);
   }
  }
 }
}

export function gardeniaLeafPoint(type,t,u){
 const round=type==='maruba',width=Math.pow(Math.sin(Math.PI*t),round?.55:.78)*(round?.75+.45*t:1.10-.22*t),vein=.003*Math.cos(t*15*Math.PI-u*2)*Math.sin(Math.PI*t);
 return [u*width*.5,t,.038*Math.sin(Math.PI*t)*u*u-.042*t*t+vein*Math.abs(u)];
}
export function gardeniaCorollaGeometry(type){
 const pos=[],uv=[],ix=[],double=type==='double'||type==='radicans',rings=double?4:1;
 for(let ring=0;ring<rings;ring++)for(let k=0;k<(ring===0?6:ring===1?7:ring===2?8:6);k++){
  const n=ring===0?6:ring===1?7:ring===2?8:6,az=k*TAU/n+ring*.54,start=pos.length/3,rows=24,cols=8,scale=1-ring*.20;
  for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
   const t=i/rows,u=j/cols*2-1,r=scale*(.08+t*.92),width=scale*(type==='maruba'?.46:double?.52:.36)*Math.pow(Math.sin(Math.PI*t),type==='maruba'?.57:.83),twist=.15*t;
   const x=u*width+twist*r,y=ring*.12+.10*Math.sin(Math.PI*t)-.09*t*t+u*u*(double?.19:.065)+ring*.12*t*t+.015*Math.sin(u*11+t*13)*Math.sin(Math.PI*t);
   pos.push(Math.sin(az)*r+Math.cos(az)*x,y,Math.cos(az)*r-Math.sin(az)*x);uv.push(j/cols,t);
   if(i<rows&&j<cols){const m=start+i*(cols+1)+j;ix.push(m,m+cols+1,m+1,m+1,m+cols+1,m+cols+2);}
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.gardeniaFlower={rings,lobes:6,joinedAtTube:true};return g;
}
export function gardeniaFruitGeometry(){
 const p=[],uv=[],ix=[],rows=28,cols=72;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,theta=j/cols*TAU,r=Math.pow(Math.sin(Math.PI*t),.70)*(.43+.07*t)*(1+.22*Math.pow(Math.max(0,Math.cos(theta*6)),5));p.push(Math.cos(theta)*r,t,Math.sin(theta)*r);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;ix.push(k,k+1,k+cols+1,k+1,k+cols+2,k+cols+1);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.gardeniaFruit={ridges:6};return g;
}
function drawGardenia(b,{info,s,detail,rand},kit){
 const a=info.appearance,type=a.shootProfile,h=s.height,w=s.spread,small=type==='radicans',tips=[],leaves=[],canes=small?7:5,leafL=Math.min(a.leafLength,w*.24),point=(az,r,y)=>[Math.sin(az)*r,y,Math.cos(az)*r];
 for(let k=0;k<canes;k++){
  const az=k*TAU/canes+rand()*.3,root=point(az,w*.025,0),fork=point(az,w*.13,h*(small?.19:.28));b.branch(root,fork,Math.min(.014,h*.017),a.barkColor,'wood-gardenia-base');
  const count=Math.round((small?7:9)*detail);
  for(let j=0;j<count;j++){
   const theta=az+(rand()-.5)*2.6,top=h*(.34+rand()*.44),r=w*(.12+rand()*.24),end=point(theta,r,top),mid=fork.map((v,z)=>v+(end[z]-v)*.52);mid[1]+=.02;
   b.branch(fork,mid,.0035,a.barkColor,'wood-gardenia-branch');b.branch(mid,end,.0024,a.stemColor,'stem-gardenia-shoot');
   for(let branch=0;branch<3;branch++){
    const yaw=theta+(branch-1)*.82,base=mid.map((v,z)=>v+(end[z]-v)*(.28+branch*.23)),length=Math.min(.13,h*.22),tip=[base[0]+Math.sin(yaw)*length*.60,base[1]+length*(.56+rand()*.25),base[2]+Math.cos(yaw)*length*.60];
    b.branch(base,tip,.00135,a.stemColor,'stem-gardenia-terminal');
    for(let node=1;node<=3;node++){
     const t=.20+node*.23,at=base.map((v,z)=>v+(tip[z]-v)*t),whorl=j%7===0?3:2;
     for(let l=0;l<whorl;l++)leaves.push({at,az:yaw+node*Math.PI/2+l*TAU/whorl,roll:rand(),young:node===3,size:.72+rand()*.35});
    }
    tips.push({at:tip,az:yaw,roll:rand()});
   }
  }
 }
 // Low lateral shoots keep the natural shrub clothed near its base.
 for(let i=0;i<Math.round(18*detail);i++){
  const az=i*2.399963,base=point(az,w*.035,h*.07),tip=point(az,w*(.22+rand()*.15),h*(.16+rand()*.18));b.branch(base,tip,.0019,a.stemColor,'stem-gardenia-low');
  for(let node=1;node<=5;node++)for(let side=0;side<2;side++)leaves.push({at:base.map((v,k)=>v+(tip[k]-v)*(.16+node*.16)),az:az+node*Math.PI/2+side*Math.PI,roll:rand(),young:node===5,size:.73+rand()*.22});
 }
 for(const n of leaves){
  const young=n.young&&[4,5].includes(s.month),L=leafL*n.size*(young?.76:1),frame=flowerFrame(b,n.at,.50+n.roll*1.04,n.az),paint=type==='variegated'?'variegated':'plain';
  frame.branch([0,0,0],[0,.006,0],.0006,a.stemColor,'petiole-gardenia');
  frame.add('gardenia-'+type,`leaf-gardenia-${paint}-underside-7d8f6b`,kit.shade(rand,young?'#789c53':a.leafColor,.035),0,.006,0,L*a.leafWidth/a.leafLength,L,L,0,(n.roll-.5)*.34,0);
  if(n.young)frame.add('gardenia-radicans','stipule-gardenia','#8b9863',0,0,0,.003,.006,.006,0,Math.PI,0);
 }
 for(const [i,n] of tips.entries()){
  const ripe=a.fruitMonths?.includes(s.month)&&i%4===0,green=a.greenFruitMonths?.includes(s.month)&&i%4===0,flower=s.bloom&&n.roll<.38&&!ripe,frame=flowerFrame(b,n.at,n.roll*.80,n.az),R=a.flowerRadius;
  if(ripe||green){
   const color=ripe?'#d89435':'#7b9251';frame.add('gardeniaFruit','fruit-gardenia-six-ridges',color,0,0,0,.017,.032,.017);
   for(let k=0;k<6;k++){const az=k*TAU/6;frame.add('gardenia-radicans','sepal-gardenia-retained',ripe?'#9b7645':'#719454',Math.sin(az)*.003,.030,Math.cos(az)*.003,.0025,.012,.012,.45,az,0);}continue;
  }
  if(!flower)continue;
  frame.branch([0,0,0],[0,R*.65,0],R*.14,'#e2ddbd','corolla-tube-gardenia');
  for(let k=0;k<6;k++){const az=k*TAU/6;frame.add('gardenia-radicans','sepal-gardenia','#70854c',Math.sin(az)*R*.10,R*.15,Math.cos(az)*R*.10,R*.09,R*.46,R*.46,.43,az,0);}
  const old=n.roll<.11,color=old?'#e7d4a2':'#f4f1df';frame.add('gardenia-corolla-'+type,'petal-gardenia',color,0,R*.65,0,R,R,R,0,n.roll*TAU,0);
  if(!['double','radicans'].includes(type)){
   frame.add(kit.bud,'style-gardenia','#e1c573',0,R*.79,0,R*.07,R*.22,R*.07);frame.add(kit.bud,'stigma-gardenia','#e7ce7c',0,R*1.06,0,R*.12,R*.12,R*.075);
   for(let k=0;k<6;k++){const az=k*TAU/6;frame.add(kit.bud,'anther-gardenia','#c5a665',Math.sin(az)*R*.16,R*.70,Math.cos(az)*R*.16,R*.024,R*.13,R*.025,Math.sin(az)*.9,0,Math.cos(az)*.9);}
  }
 }
}

export function sarcandraLeafPoint(t,u){
 const cycle=(t*18)%1,tooth=t>.08&&t<.96?1+.10*(cycle<.72?cycle/.72:(1-cycle)/.28):1;
 const width=Math.pow(Math.sin(Math.PI*t),.77)*(.96+.13*t)*tooth;
 return [u*width*.5,t,.037*Math.sin(Math.PI*t)*u*u+.003*Math.sin(t*18*Math.PI)*Math.abs(u)-.065*t*t];
}
function drawSarcandra(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,dark=a.shootProfile==='dark',mixed=a.shootProfile==='mixed',tips=[],leaves=[],N=Math.max(8,Math.round(18*detail));
 const youngSeason=[4,5,6].includes(s.month),groups=mixed?2:1;
 for(let group=0;group<groups;group++)for(let i=0;i<N;i++){
  const az=i*2.399963+rand()*.5,offset=mixed?(group===0?-1:1)*w*.18:0,r=w*(mixed?.16:.28)*Math.sqrt((i+.5)/N),top=h*(.48+rand()*.37),base=[offset+Math.sin(az)*r*.40,0,Math.cos(az)*r*.40],count=7;let last=base;
  for(let j=1;j<=count;j++){
   const t=j/count,at=[base[0]+Math.sin(az)*r*t*.63,top*t,base[2]+Math.cos(az)*r*t*.63],color=dark?'#66453e':j>3?'#68834d':'#887454';
   b.branch(last,at,Math.min(.004,h*.005)*(1-t*.40),color,'stem-sarcandra-cane');last=at;
   b.add(kit.bud,'node-sarcandra',color,...at,.0035,.002,.0035);
   if(j>=2)for(let side=0;side<2;side++)leaves.push({at,az:az+j*Math.PI/2+side*Math.PI,roll:rand(),size:.8+rand()*.30,young:j===count});
   if(j===4&&i%3===0)for(let side=0;side<2;side++){
    const theta=az+side*Math.PI,end=[at[0]+Math.sin(theta)*w*.12,at[1]+h*.19,at[2]+Math.cos(theta)*w*.12];
    b.branch(at,end,.0023,color,'stem-sarcandra-axillary');
    for(let node=1;node<=2;node++)for(let sign=0;sign<2;sign++)leaves.push({at:at.map((v,k)=>v+(end[k]-v)*node/2),az:theta+node*Math.PI/2+sign*Math.PI,roll:rand(),size:.76+rand()*.2,young:node===2});
    tips.push({at:end,az:theta,fruit:group===1?'yellow':a.shootProfile,roll:rand()});
   }
  }tips.push({at:last,az,fruit:group===1?'yellow':a.shootProfile,roll:rand()});
 }
 for(const n of leaves){
  const young=n.young&&youngSeason,L=Math.min(a.leafLength*n.size,w*(mixed?.26:.35))*(young?.70:1),pitch=young?.12+n.roll*.20:1.08+n.roll*.48,frame=flowerFrame(b,n.at,pitch,n.az),petiole=.012*n.size;
  frame.branch([0,0,0],[0,petiole,0],.0009,dark?'#66453e':'#718f4b','petiole-sarcandra');
  const color=dark?(young?'#654037':'#425c45'):(young?'#8caa59':a.leafColor),back=dark?'788571':'8c9e72';
  frame.add('sarcandraLeaf',`leaf-sarcandra-${young?'young':'mature'}-underside-${back}`,kit.shade(rand,color,.055),0,petiole,0,L*a.leafWidth/a.leafLength,L,L,0,(n.roll-.5)*.64,0);
 }
 for(const n of tips){
  const fruit=a.fruitMonths?.includes(s.month),green=a.greenFruitMonths?.includes(s.month);
  if(!s.bloom&&!fruit&&!green)continue;
  if(dark&&(fruit||green))continue;
  const f=flowerFrame(b,n.at,.10+n.roll*.20,n.az),axis=.032,stemColor=dark?'#704b45':fruit?'#977246':'#83944d';
  f.branch([0,0,0],[0,axis,0],.0012,stemColor,'inflorescence-sarcandra-axis');
  for(let fork=0;fork<3;fork++){
   const yaw=fork*TAU/3,reach=.011,root=[0,axis*.45,0],end=[Math.sin(yaw)*reach,axis*(.83+fork*.12),Math.cos(yaw)*reach];f.branch(root,end,.0007,stemColor,'inflorescence-sarcandra-branch');
   for(let second=0;second<2;second++){
    const theta=yaw+(second===0?-.55:.55),tip=[end[0]+Math.sin(theta)*.007,end[1]+.013, end[2]+Math.cos(theta)*.007];f.branch(end,tip,.00045,stemColor,'inflorescence-sarcandra-tip');
    for(let j=0;j<4;j++){
     const t=(j+.5)/4,ang=j*2.399963+theta,position=end.map((v,k)=>v+(tip[k]-v)*t);position[0]+=Math.sin(ang)*.0025;position[2]+=Math.cos(ang)*.0025;
     const ff=flowerFrame(f,position,.3,ang);
     if(fruit||green){const color=green?'#819456':n.fruit==='yellow'?'#e6ae3c':'#d45236';ff.add(kit.bud,`fruit-glossy-sarcandra-${green?'green':n.fruit==='yellow'?'yellow':'red'}`,color,0,0,0,.0032,.0031,.0032);ff.add(kit.bud,'stigma-sarcandra-retained','#765a38',0,.0031,0,.0005,.00025,.0005);}
     else {ff.add(kit.bud,'ovary-sarcandra','#95aa5e',0,0,0,.0009,.0011,.0009);ff.add(kit.bud,'stigma-sarcandra','#c5cc86',0,.0011,0,.00035,.0002,.00035);ff.add(kit.bud,'stamen-sarcandra-single','#d1d5a1',0,.0006,-.001,.00055,.0012,.00035);}
    }
   }
  }
 }
}

export function nandinaLeafPoint(type,t,u){
 const wide=type==='otafuku'||type==='twilight',profile=Math.pow(Math.sin(Math.PI*t),wide?.65:.88)*(1.06-.14*t);
 return [u*profile*.5,t,Math.sin(Math.PI*t)*(.016+(type==='otafuku'?.11:.045)*u*u)-(type==='otafuku'?.055:.018)*t*t];
}
export function nandinaFlowerGeometry(){
 const p=[],uv=[],ix=[],rows=16,cols=4;
 for(let k=0;k<6;k++){
  const start=p.length/3,az=k*TAU/6;
  for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
   const t=i/rows,u=j/cols*2-1,r=.17+.83*t,width=.27*Math.pow(Math.sin(Math.PI*t),.77);
   p.push(Math.sin(az)*r+Math.cos(az)*u*width,.12+.17*Math.sin(Math.PI*t)-.14*t*t+.08*u*u,Math.cos(az)*r-Math.sin(az)*u*width);uv.push(j/cols,t);
   if(i<rows&&j<cols){const n=start+i*(cols+1)+j;ix.push(n,n+cols+1,n+1,n+1,n+cols+1,n+cols+2);}
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.nandinaFlower={petals:6};return g;
}
function drawNandina(b,{info,s,detail,rand},kit){
 const a=info.appearance,type=a.shootProfile,h=s.height,w=s.spread,tall=type==='white',winter=[11,12,1,2].includes(s.month)||type==='seika'&&s.month<=4,growing=s.month>=4&&s.month<=(type==='seika'?9:6),tips=[],leaves=[],N=Math.round((tall?12:type==='twilight'?36:24)*detail);
 for(let i=0;i<N;i++){
  const az=i*2.399963+rand()*.25,rad=w*.28*Math.sqrt((i+.5)/N),top=h*(tall?.45+rand()*.32:.26+rand()*.38),base=[Math.sin(az)*rad*.5,0,Math.cos(az)*rad*.5],count=tall?13:type==='twilight'?11:9;let prev=base;
  for(let j=1;j<=count;j++){
   const t=j/count,at=[base[0]+Math.sin(az)*rad*t*.55,top*t,base[2]+Math.cos(az)*rad*t*.55],old=t<.7;
   b.branch(prev,at,Math.min(.006,h*.006)*(1-t*.52),old?a.barkColor:a.stemColor,old?'wood-nandina-cane':'stem-nandina-cane');prev=at;
   b.add(kit.bud,'leaf-scar-nandina','#8e896c',...at,Math.min(.0048,h*.0048)*(1-t*.48),.0003,Math.min(.0048,h*.0048)*(1-t*.48));
   if(j>=(tall?5:1))leaves.push({at,az:az+j*2.399963,roll:rand(),young:j>=count-1,outer:i>N*.4||j>=count-1,size:.8+rand()*.2});
  }tips.push({at:prev,az,roll:rand()});
 }
 for(const n of leaves){
  if(n.roll>s.leafDensity)continue;
  const young=n.young&&growing,frond=Math.min(tall?.34:type==='twilight'?.18:type==='otafuku'?.20:.28,w*(tall?.5:.55))*n.size,f=flowerFrame(b,n.at,.50+n.roll*.86,n.az),stalk=type==='twilight'&&young?'#c88395':a.stemColor,small=type==='otafuku'||type==='twilight',pairs=small?1:2;
  let last=[0,0,0];
  for(let j=1;j<=5;j++){const at=[0,frond*j/5,.013*Math.sin(j*Math.PI/5)];f.branch(last,at,.00075,stalk,'rachis-nandina-primary');last=at;}
  const blade=(origin,angle,relative,terminal=false)=>{
   const L=a.leafLength*n.size*(young?.75:1)*(terminal?1.1:1),pitch=-.12+rand()*.55,ff=flowerFrame(f,origin,0,0),outer=n.outer&&relative>.25;
   let color=s.leafColor;
   if(type==='lemon')color=outer?(growing?'#c4d271':'#aec763'):'#4e784d';
   else if(type==='murasaki'&&young)color='#754961';
   else if(type==='seika'&&young)color='#a84e51';
   else if(type==='otafuku'&&young&&!winter)color='#a9995a';
   else if(type==='white'&&young)color='#98aa72';
   else if(type==='twilight')color=young?'#c5949d':winter?'#9d777e':'#598158';
   const paint=type==='twilight'?(young?'young':n.outer?'mottled':'old'):'plain',back=new THREE.Color(color).lerp(new THREE.Color('#a1aea0'),.25).getHexString();
   ff.add('nandina-'+type,`leaf-nandina-${type}-${paint}-underside-${back}`,kit.shade(rand,color,.037),0,0,0,L*a.leafWidth/a.leafLength,L,L,pitch,0,-angle);
  };
  for(let j=0;j<pairs;j++)for(const side of [-1,1]){
   const y=frond*(small?.43:.30+j*.30),reach=frond*(small?.29:.35)*(1-j*.20),start=[0,y,.010],end=[side*reach,y+frond*.12,.016];f.branch(start,end,.00050,stalk,'rachis-nandina-secondary');
   if(small){
    for(const sign of [-1,1])blade([end[0]*.70,end[1]-.01,end[2]],side*.90+sign*.56,.7);
    blade(end,side*.67,.9,true);
   }else{
    for(let l=0;l<2;l++){
     const t=.45+l*.27,mid=start.map((v,k)=>v+(end[k]-v)*t);
     for(const sign of [-1,1]){
      const tip=[mid[0]+side*frond*.055,mid[1]+sign*frond*.078,mid[2]+.007];f.branch(mid,tip,.00030,stalk,'rachis-nandina-tertiary');
      blade(tip,side*.8+sign*.43,t);blade([tip[0]*.94,tip[1],tip[2]],side*.8-sign*.54,t);
     }
    }blade(end,side*.75,1,true);
   }
  }
  const terminalPairs=type==='otafuku'?1:2;
  for(let j=0;j<terminalPairs;j++)for(const side of [-1,1])blade([0,frond*(.78+j*.12),.008],side*.82,.9);
  blade(last,0,1,true);
 }
 for(const [i,n] of tips.entries()){
  if(!s.bloom&&!a.fruitMonths?.includes(s.month))continue;
  if(type!=='white'&&i!==0)continue;
  if(type==='white'&&i%3!==0)continue;
  const fruit=!s.bloom,len=type==='twilight'?.07:type==='murasaki'?.13:tall?.23:.15,R=a.flowerRadius,frame=flowerFrame(b,n.at,fruit?.23:.12,n.az),whorls=type==='twilight'?5:7;let prev=[0,0,0];
  for(let j=1;j<=whorls;j++){
   const t=j/whorls,at=[0,len*t,0];frame.branch(prev,at,.0009,'#8c9670','panicle-nandina-axis');prev=at;
   for(let k=0;k<3;k++){
    const az=k*TAU/3+j*.91,reach=len*.38*(1-t*.78),end=[Math.sin(az)*reach,len*t+len*.07,Math.cos(az)*reach];frame.branch(at,end,.0004,'#a7977c','panicle-nandina-branch');
    const count=fruit?3:type==='twilight'?4:type==='seika'?8:5;
    for(let m=0;m<count;m++){
     const u=(m+.5)/count,an=m*2.399963,spread=len*.065,point=[end[0]*u+Math.sin(an)*spread,end[1]+len*.085*u,end[2]*u+Math.cos(an)*spread];frame.branch(end,point,.00020,'#a99d7e','panicle-nandina-pedicel');
     const f2=flowerFrame(frame,point,.35+u*.8,an);
     if(fruit){f2.add(kit.bud,'fruit-nandina-white',kit.shade(rand,a.fruitColor,.025),0,0,0,.004,.0042,.004);f2.add(kit.bud,'stigma-nandina-retained','#82765b',0,.0041,0,.00065,.0003,.00065);continue;}
     if(m===count-1&&j===whorls){f2.add(kit.bud,'bud-nandina',a.flowerPalette.bud,0,R*.50,0,R*.31,R*.61,R*.31);continue;}
     f2.add('nandinaCorolla',type==='twilight'?'petal-nandina-twilight':'petal-nandina',s.flowerColor,0,0,0,R,R,R);
     f2.add(kit.bud,'ovary-nandina','#e3d5b6',0,R*.26,0,R*.17,R*.28,R*.17);f2.add(kit.bud,'stigma-nandina','#d6aa71',0,R*.64,0,R*.08,R*.07,R*.08);
     for(let z=0;z<6;z++){const theta=z*TAU/6,point=[Math.sin(theta)*R*.27,R*.43,Math.cos(theta)*R*.27];f2.add(kit.bud,'anther-nandina','#d7bd68',...point,R*.09,R*.24,R*.08,Math.sin(theta)*.10,0,Math.cos(theta)*.10);}
    }
   }
  }
 }
}

export function euonymusLeafPoint(type,t,u){
 const rounded=type==='happiness',obovate=type==='compactus'||type==='gold';
 const profile=Math.pow(Math.sin(Math.PI*t),rounded?.53:.68)*(obovate?.71+.58*t:1),tooth=t>.16&&t<.96?1+.024*Math.sin(t*(rounded?70:132)):1;
 return [u*profile*tooth*.5,t,Math.sin(Math.PI*t)*(.016+u*u*(type==='compactus'?.032:.075))];
}
export function euonymusFlowerGeometry(){
 const p=[],uv=[],ix=[],rows=12,cols=4;
 for(let k=0;k<4;k++){
  const start=p.length/3,az=k*TAU/4;
  for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
   const t=i/rows,u=j/cols*2-1,r=.24+.76*t,width=.37*Math.pow(Math.sin(Math.PI*t),.55);
   p.push(Math.sin(az)*r+Math.cos(az)*u*width,.10+.16*Math.sin(Math.PI*t)+.07*u*u,Math.cos(az)*r-Math.sin(az)*u*width);uv.push(j/cols,t);
   if(i<rows&&j<cols){const n=start+i*(cols+1)+j;ix.push(n,n+cols+1,n+1,n+1,n+cols+1,n+cols+2);}
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.euonymusFlower={petals:4};return g;
}
export function euonymusWingGeometry(){
 const p=[],uv=[],ix=[],rows=12;
 for(let k=0;k<4;k++){
  const offset=p.length/3,az=k*TAU/4;
  for(let i=0;i<=rows;i++)for(let side=0;side<2;side++){
   const t=i/rows,r=side?1+.85*Math.pow(Math.sin(Math.PI*t),.35)*(1+.09*Math.sin(t*25)):0.75;
   p.push(Math.sin(az)*r,t-.5,Math.cos(az)*r);uv.push(side,t);
   if(i<rows&&side===0){const n=offset+i*2;ix.push(n,n+1,n+2,n+1,n+3,n+2);}
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.euonymusWings=4;return g;
}
function drawEuonymus(b,{info,s,detail,rand},kit){
 const a=info.appearance,type=a.shootProfile,h=s.height,w=s.spread,decid=type==='compactus',small=type==='dandel'||type==='happiness',nodes=[],wood=[],leaders=[],nLeaders=small?7:decid?4:2,baseTop=small?.23:decid?.30:.62;
 for(let k=0;k<nLeaders;k++){
  const angle=k*TAU/nLeaders,path=[[0,0,0]];
  for(let j=1;j<=6;j++){
   const t=j/6,at=[Math.sin(angle)*w*.08*t,baseTop*h*t,Math.cos(angle)*w*.08*t];wood.push({from:path.at(-1),to:at,r:h*(small?.009:.016)*(1-t*.62),old:true,wings:decid});path.push(at);
  }leaders.push(path);
 }
 const shoot=(root,az,rise,reach,order)=>{
  let previous=root;const N=order===0?8:small?7:6;
  for(let j=0;j<N;j++){
   const t=(j+1)/N,an=az+.16*Math.sin(t*4+az),at=[root[0]+Math.sin(an)*reach*t,root[1]+rise*t+reach*.07*Math.sin(Math.PI*t),root[2]+Math.cos(an)*reach*t];
   wood.push({from:previous,to:at,r:(order===0?.006:order===1?.0017:.00055)*Math.max(.28,Math.min(h,3))*(1-t*.6),old:order===0,wings:decid&&(order===0||order===1&&j<4)});previous=at;
   if(order>0)nodes.push({at,an:an+j*Math.PI/2,order,t,roll:rand(),size:.8+rand()*.2});
   if(order===0&&j>=1&&j<=6)shoot(at,an+(j%2?1:-1)*(.68+rand()*.50),h*(small?.055:.055)*(.6+rand()*.8),w*.13*(1-t*.20),1);
   if(order===1&&(j===1||j===3||j===5))shoot(at,an+(j%4<2?1:-1)*(.68+rand()*.52),h*.03,w*.060,2);
   if(type==='happiness'&&order===2&&j===3)shoot(at,an+.93,h*.025,w*.026,3);
  }
 };
 const count=Math.round((small?22:21+Math.min(w*2,8))*detail);
 for(let i=0;i<count;i++){
  const t=(i+.5)/count,level=(small?.025:.06)+(small?.16:decid?.21:.46)*t,point=level/baseTop*6,j=Math.min(5,Math.floor(point)),tr=leaders[i%nLeaders],root=tr[j].map((v,k)=>v+(tr[j+1][k]-v)*(point-j)),tip=(small?.27:.30)+(small?.53:.54)*rand(),reach=w*.40*Math.sqrt(Math.max(.18,1-Math.pow((tip-.51)/.43,2)));
  shoot(root,i*2.399963+rand()*.24,h*tip-root[1],reach,0);
 }
 if(small)for(let i=0;i<12;i++){
  const az=i*2.399963+rand()*.2,root=leaders[i%nLeaders][1];
  shoot(root,az,h*(.14+rand()*.15),w*(.22+rand()*.14),0);
 }
 for(const q of wood){
  b.branch(q.from,q.to,q.r,q.old?a.barkColor:a.stemColor,q.old?'wood-euonymus':'stem-euonymus');
  if(q.wings){
   const from=new THREE.Vector3(...q.from),to=new THREE.Vector3(...q.to),v=to.clone().sub(from),length=v.length(),rotation=new THREE.Euler(0,0,0,'YXZ').setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));
   b.add('euonymusWings','cork-wing-euonymus','#9a8870',...from.add(to).multiplyScalar(.5).toArray(),Math.max(.0018,q.r*1.35),length,Math.max(.0018,q.r*1.35),rotation.x,rotation.y,rotation.z);
  }
 }
 for(const n of nodes){
  const spring=[4,5].includes(s.month),young=n.t>.76,winter=[11,12,1,2].includes(s.month);
  for(const side of [-1,1]){
   if(s.leafDensity===0||(n.roll+(side===-1?.37:0))%1>s.leafDensity)continue;
   const az=n.an+(side===1?0:Math.PI),P=type==='happiness'?.004:.006,L=a.leafLength*n.size*s.leafScale*(spring&&young?.73:1),at=[n.at[0]+Math.sin(az)*P,n.at[1]+P*.30,n.at[2]+Math.cos(az)*P],f=flowerFrame(b,at,.75+n.roll*.55,az);
   let color=s.leafColor;
   if(type==='happiness')color=young?(spring?'#c7d77c':'#d8c847'):n.t>.36?'#bab94b':'#45613b';
   if(type==='gold'&&young)color=spring?'#dbd875':'#a9b35b';
   b.branch(n.at,at,small?.00020:.00045,a.stemColor,'petiole-euonymus');
   const back=decid&&s.autumn?new THREE.Color(color).lerp(new THREE.Color('#b58d79'),.25).getHexString():type==='happiness'||type==='gold'&&young?new THREE.Color(color).lerp(new THREE.Color('#a5ae80'),.22).getHexString():a.leafUnderside.slice(1);
   f.add('euonymus-'+type,`leaf-euonymus-${type}${type==='dandel'?(winter?'-pink':spring&&young?'-white':'-cream'):''}-underside-${back}`,kit.shade(rand,color,.034),0,0,0,L*a.leafWidth/a.leafLength,L,L);
  }
  if(decid&&s.leafDensity===0&&n.t>.8)b.add(kit.bud,'bud-euonymus-winter','#866b4e',...n.at,.0015,.0032,.0015,.15,n.an,0);
  if(type==='happiness'||n.order!==1||n.t<.28||n.t>.83||n.roll>(type==='dandel'?.045:.24))continue;
  if(!s.bloom&&!a.fruitMonths?.includes(s.month))continue;
  const origin=n.at,az=n.an+1.1,cyme=flowerFrame(b,origin,decid?1.7:1.1,az),stalk=decid?.012:.022;
  cyme.branch([0,0,0],[0,stalk,0],.00028,a.stemColor,'peduncle-euonymus');
  const flowers=decid?3:7;
  for(let k=0;k<flowers;k++){
   const theta=k*2.399963,r=k===0?0:stalk*.6,y=stalk+(k===0?stalk*.40:stalk*.65),at=[Math.sin(theta)*r,y,Math.cos(theta)*r],f=flowerFrame(cyme,at,.3,theta),R=a.flowerRadius;
   cyme.branch([0,stalk,0],at,.00018,a.stemColor,'pedicel-euonymus');
   if(s.bloom){
    f.add(kit.bud,'disc-euonymus','#9eaf75',0,R*.11,0,R*.34,R*.12,R*.34);f.add('euonymusCorolla','petal-euonymus',s.flowerColor,0,0,0,R,R,R);
    for(let l=0;l<4;l++){
     const angle=l*TAU/4+Math.PI/4,point=[Math.sin(angle)*R*.29,R*.40,Math.cos(angle)*R*.29];
     f.add(kit.bud,'calyx-euonymus','#839766',Math.sin(angle)*R*.36,0,Math.cos(angle)*R*.36,R*.24,R*.08,R*.24);
     f.branch([point[0],R*.16,point[2]],point,R*.02,'#cdd0a0','filament-euonymus');f.add(kit.bud,'anther-euonymus','#d7ca89',...point,R*.10,R*.10,R*.07);
    }f.add(kit.bud,'style-euonymus','#bac290',0,R*.30,0,R*.045,R*.18,R*.045);
   }else if(k<(decid?2:4)){
    const radius=.0043,open=(n.roll*13.1+k*.27)%1>.18;
    f.add(kit.bud,'fruit-euonymus-capsule','#b86e7b',0,0,0,radius*(open?.64:1),radius*.9,radius*(open?.64:1));
    if(open){
     for(let v=0;v<4;v++){const ang=v*TAU/4;f.add('euonymus-happiness','capsule-valve-euonymus','#b87583',Math.sin(ang)*radius*.36,0,Math.cos(ang)*radius*.36,radius*.90,radius*1.4,radius*1.4,1.6,ang,0);}
     const seeds=decid?1:2;for(let v=0;v<seeds;v++)f.add(kit.bud,'aril-euonymus','#d96835',(v-(seeds-1)*.5)*radius*.80,-radius*.72,radius*.36,radius*.46,radius*.62,radius*.45);
    }
   }
  }
 }
}

export function osmanthusLeafPoint(type,t,u){
 const holly=['kaori','oni','shima','goshiki'].includes(type),small=type==='kaori',spines=small?[.19,.35,.51,.67,.81]:[.23,.48,.72],base=Math.pow(Math.sin(Math.PI*t),holly?.77:.73)*(1.02-.14*t);
 let width=base*(holly?.68:1);
 if(holly)for(const v of spines)width+=(small?.32:.52)*Math.max(0,1-Math.abs(t-v)/(small?.075:.11));
 else width*=1+(t>.40?.018*Math.sin(t*112):0);
 return [u*width*.5,t,Math.sin(Math.PI*t)*(.035+u*u*(holly?.085:.07))+(holly?.042:.009)*Math.sin(t*(small?32:22))*u*u];
}
export function osmanthusFlowerGeometry(holly=false){
 const p=[],uv=[],ix=[],rings=4,sides=12;
 for(let j=0;j<=rings;j++)for(let k=0;k<=sides;k++){
  const t=j/rings,an=k*TAU/sides,r=.17+.12*t*t;p.push(Math.sin(an)*r,t*.45,Math.cos(an)*r);uv.push(k/sides,t*.3);
  if(j<rings&&k<sides){const q=j*(sides+1)+k;ix.push(q,q+1,q+sides+1,q+1,q+sides+2,q+sides+1);}
 }
 for(let l=0;l<4;l++){
  const start=p.length/3,an=l*TAU/4,rows=12,cols=6;
  for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
   const t=i/rows,u=j/cols*2-1,r=.27+.73*t,width=.40*Math.pow(Math.sin(Math.PI*t),.56),y=.45+.17*Math.sin(Math.PI*t)-(holly?.42:.13)*t*t+.07*u*u*Math.sin(Math.PI*t);
   p.push(Math.sin(an)*r+Math.cos(an)*u*width,y,Math.cos(an)*r-Math.sin(an)*u*width);uv.push(j/cols,.3+.7*t);
   if(i<rows&&j<cols){const q=start+i*(cols+1)+j;ix.push(q,q+cols+1,q+1,q+1,q+cols+1,q+cols+2);}
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.osmanthusFlower={lobes:4,reflexed:holly};return g;
}
function drawOsmanthus(b,{info,s,detail,rand},kit){
 const a=info.appearance,type=a.shootProfile,h=s.height,w=s.spread,holly=['kaori','oni','shima','goshiki'].includes(type),small=type==='kaori',nodes=[],wood=[],leader=[],top=h*(small?.76:.61),radius=h*(small?.013:.018);
 for(let j=0;j<=8;j++)leader.push([Math.sin(j*.71)*w*.013,top*j/8,Math.sin(j*.93)*w*.01]);
 for(let j=1;j<leader.length;j++)wood.push({from:leader[j-1],to:leader[j],r:radius*(1-j*.09),old:true});
 const shoot=(root,az,rise,reach,order)=>{
  let previous=root;const N=order===0?8:small?7:6;
  for(let j=0;j<N;j++){
   const t=(j+1)/N,an=az+.17*Math.sin(t*4+az),at=[root[0]+Math.sin(an)*reach*t,root[1]+rise*t+reach*.08*Math.sin(Math.PI*t),root[2]+Math.cos(an)*reach*t];wood.push({from:previous,to:at,r:(order===0?.006:order===1?.0018:.00055)*Math.max(.5,Math.min(h,3))*(1-t*.63),old:order===0});previous=at;
   if(order>0)nodes.push({at,an:an+j*Math.PI/2,order,t,roll:rand(),size:.72+rand()*.28});
   if(order===0&&j>=2&&j<=6)shoot(at,an+(j%2?1:-1)*.91,h*.075,w*.12*(1-t*.3),1);
   if(order===1&&(j===1||j===3||j===5))shoot(at,an+(j%4<2?1:-1)*.98,h*.025,w*.046,2);
   if(small&&order===2&&(j===2||j===4))shoot(at,an+(j===2?1:-1)*.93,h*.010,w*.021,3);
  }
 };
 const count=Math.round((small?22:19+Math.min(w*2,7))*detail);
 for(let i=0;i<count;i++){
  const t=(i+.5)/count,level=(small?.06:.12)+(small?.55:.40)*t,point=level/(top/h)*8,j=Math.min(7,Math.floor(point)),root=leader[j].map((v,k)=>v+(leader[j+1][k]-v)*(point-j)),tip=.30+.59*rand(),reach=w*.39*Math.sqrt(Math.max(.12,1-Math.pow((tip-.54)/.47,2)));
  shoot(root,i*2.399963+rand()*.22,h*tip-root[1],reach,0);
 }
 for(const q of wood)b.branch(q.from,q.to,q.r,q.old?a.barkColor:a.stemColor,q.old?'wood-osmanthus-lenticels':'stem-osmanthus');
 for(const n of nodes){
  const young=[4,5].includes(s.month)&&n.t>.72;
  for(const side of [-1,1]){
   if((n.roll+(side===-1?.31:0))%1>s.leafDensity)continue;
   const az=n.an+(side===1?0:Math.PI),P=small?.0012:.005,L=a.leafLength*n.size*(young?.68:1),at=[n.at[0]+Math.sin(az)*P,n.at[1]+P*.3,n.at[2]+Math.cos(az)*P],f=flowerFrame(b,at,.92+n.roll*.66,az),color=young?(a.springShootColor||'#80965b'):s.leafColor;
   b.branch(n.at,at,small?.00015:.00055,a.stemColor,'petiole-osmanthus');
   f.add('osmanthus-'+type,`leaf-osmanthus-${type}${young?'-young':''}-underside-${a.leafUnderside.slice(1)}`,kit.shade(rand,color,.033),0,0,0,L*a.leafWidth/a.leafLength,L,L);
  }
  if(n.t>.83||n.t<.25||n.roll>(small?.14:.24))continue;
  const before=a.budMonths.includes(s.month);if(!s.bloom&&!before)continue;
  if(s.bloom&&(n.roll*7.7)%1>(s.flowerDensity||1))continue;
  for(const side of [-1,1]){
   const az=n.an+(side===1?0:Math.PI),P=small?.002:.005,at=[n.at[0]+Math.sin(az)*P,n.at[1]+.002,n.at[2]+Math.cos(az)*P],f=flowerFrame(b,at,.85,az),N=small?4:holly?6:12;
   for(let k=0;k<N;k++){
    const t=(k+.5)/N,an=k*2.399963,r=(small?.004:holly?.006:.009)*Math.sqrt(t),end=[Math.sin(an)*r,.002+(small?.004:holly?.007:.013)*t,Math.cos(an)*r],R=a.flowerRadius,closed=!s.bloom||k%11===0,ff=flowerFrame(f,end,.65+1.1*t,an);
    f.branch([0,0,0],end,.00014,a.stemColor,'pedicel-osmanthus');
    if(closed){ff.add(kit.bud,'bud-osmanthus',a.flowerPalette.bud,0,R*.28,0,R*.34,R*.48,R*.34);continue;}
    for(let l=0;l<4;l++){const theta=l*TAU/4;ff.add(kit.bud,'calyx-osmanthus','#8e9a61',Math.sin(theta)*R*.16,-R*.03,Math.cos(theta)*R*.16,R*.13,R*.18,R*.13);}
    ff.add(holly?'osmanthusHollyCorolla':'osmanthusGoldCorolla','petal-osmanthus',s.flowerColor,0,0,0,R,R,R);
    for(let l=0;l<2;l++){const sign=l===0?-1:1,from=[sign*R*.16,R*.18,0],end=[sign*R*.30,R*(holly?1.12:.62),0];ff.branch(from,end,R*.023,'#e5d5a4','filament-osmanthus');ff.add(kit.bud,'anther-osmanthus','#cbbb78',...end,R*.13,R*.18,R*.07);}
    ff.add(kit.bud,'reduced-pistil-osmanthus','#b6b07b',0,R*.22,0,R*.075,R*.14,R*.075);
   }
  }
 }
}

export function magnoliaLeafPoint(type,t,u){
 const broad=['denudata','sunrise','kobus'].includes(type),coco=type==='coco',profile=Math.pow(Math.sin(Math.PI*t),coco?.85:.64)*(broad?.63+.65*t:1.02-.12*t);
 return [u*profile*.5,t,Math.sin(Math.PI*t)*(.02+.07*u*u)+(coco?.008:.003)*Math.sin(t*20)*u*u];
}
export function magnoliaTepalGeometry(type,outer=false){
 const pos=[],uv=[],ix=[],rows=24,cols=6,coco=type==='coco',cup=['sunrise','denudata'].includes(type),big=['grandiflora','baby'].includes(type),thin=type==='kobus'||type==='portwine';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,width=(coco?.88:cup?.72:big?.92:thin?.45:.55)*Math.pow(Math.sin(Math.PI*t),.58),r=coco&&!outer?.07+Math.sin(Math.PI*t)*.91:cup?.10+.72*Math.sin(t*Math.PI*.68):.08+.92*t,y=coco&&!outer?t*1.75:cup?t*1.65:type==='kobus'?.22*Math.sin(Math.PI*t)-.12*t*t:big?.18*t+.30*t*t:.34*Math.sin(Math.PI*t*.7);
  pos.push(u*width,y+.06*u*u*Math.sin(Math.PI*t)+.015*Math.sin(u*8)*t*t,r);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;ix.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.magnoliaTepal={type,outer};return g;
}
function drawMagnolia(b,{info,s,detail,rand},kit){
 const a=info.appearance,type=a.shootProfile,h=s.height,w=s.spread,decid=a.persistence==='deciduous',big=['grandiflora','baby'].includes(type),axillary=['portwine','fairy','coco'].includes(type),pyramid=a.habit==='pyramidal',upright=type==='fairy',wood=[],nodes=[],tips=[];
 const leaders=type==='denudata'||type==='portwine'?3:1,leaderTop=type==='denudata'?.38:pyramid?.88:upright?.78:.48,trunks=[];
 for(let k=0;k<leaders;k++){
  const angle=k*TAU/leaders,top=h*leaderTop,reach=leaders>1?w*.10:0,path=[[0,0,0]];
  let previous=[0,0,0];
  for(let j=1;j<=7;j++){const t=j/7,at=[Math.sin(angle)*reach*t+Math.sin(t*4)*w*.009,top*t,Math.cos(angle)*reach*t];wood.push({from:previous,to:at,r:h*(leaders>1?.014:.019)*(1-t*.80),old:true});previous=at;path.push(at);}trunks.push(path);
 }
 const shoot=(root,az,rise,reach,order)=>{
  let previous=root;const n=order===0?8:6;
  for(let j=0;j<n;j++){
   const t=(j+1)/n,an=az+.13*Math.sin(t*4+az),at=[root[0]+Math.sin(an)*reach*t,root[1]+rise*t+reach*.055*Math.sin(Math.PI*t),root[2]+Math.cos(an)*reach*t];
   wood.push({from:previous,to:at,r:(order===0?.010:order===1?.0031:.0011)*Math.max(.4,Math.min(h,3))*(1-t*.68),old:order===0||order===1&&j<2});previous=at;
   const node={at,an:an+j*2.399963,order,t,size:.78+rand()*.22,roll:rand()};if(order>0)nodes.push(node);if(order>0&&j===n-1)tips.push(node);
   if(order===0&&j>=2&&j<=6)shoot(at,an+(j%2?1:-1)*.9,h*(upright?.13:.055)*(1-t*.3),w*.10*(1-t*.35),1);
   if(order===1&&(j===2||j===4))shoot(at,an+(j===2?1:-1)*1.10,h*.025,w*.05,2);
   if(order===2&&w>2.1&&j===3)shoot(at,an+.95,h*.025,w*.025,3);
  }
 };
 const count=Math.round((16+Math.min(w*2,12))*detail);
 for(let i=0;i<count;i++){
  const t=(i+.5)/count,angle=i*2.399963+rand()*.24,base=leaders>1?i%leaders:0,level=pyramid?.14+.65*t:upright?.10+.42*t:type==='denudata'?.10+.25*t:.14+.27*t,point=level/leaderTop*7,segment=Math.min(6,Math.floor(point)),part=point-segment,root=trunks[base][segment].map((v,j)=>v+(trunks[base][segment+1][j]-v)*part),tip=.35+.56*((i*.618034+.19)%1),reach=w*(pyramid?.40*(1-t*.78):upright?.26*(1-t*.4):.39*Math.sqrt(Math.max(.15,1-Math.pow((tip-.60)/.42,2)))),rise=pyramid?h*.10:upright?h*(.28+.10*t):h*tip-root[1];
  shoot(root,angle,rise,reach,0);
 }
 for(const q of wood)b.branch(q.from,q.to,q.r,q.old?a.barkColor:a.stemColor,q.old?'wood-magnolia-'+(big&&h>4?'plates':type==='kobus'?'lenticels':'smooth'):'stem-magnolia');
 for(const n of nodes){
  if(n.roll>s.leafDensity||s.leafDensity===0)continue;
  const L=a.leafLength*n.size*s.leafScale,P=type==='fairy'?0:type==='coco'?.007:L*.11,an=n.an,at=[n.at[0]+Math.sin(an)*P,n.at[1]+P*.25,n.at[2]+Math.cos(an)*P],f=flowerFrame(b,at,.65+n.roll*.65,an),spring=s.month>=4&&s.month<=5&&n.t>.72;
  if(P)b.branch(n.at,at,.00085,a.stemColor,'petiole-magnolia');
  f.add(a.leafShape,`leaf-magnolia-${big?'felt':decid?'soft':'glossy'}-underside-${a.leafUnderside.slice(1)}`,kit.shade(rand,spring?'#82975e':s.autumn?'#b5a25b':s.leafColor,.035),0,0,0,L*a.leafWidth/a.leafLength,L,L);
  if(type==='fairy'&&n.order===1&&n.roll<.09){const f2=flowerFrame(b,n.at,.9,an+Math.PI);f2.add(a.leafShape,'leaf-magnolia-glossy-underside-718564',s.leafColor,0,0,0,L*a.leafWidth/a.leafLength,L,L);}
  // Stipule scars encircle woody magnolia shoots; these rings persist after leaves fall.
 }
 for(const n of nodes)if(n.order===1&&n.t<.4)b.add(kit.bud,'stipule-scar-magnolia','#a3a18b',...n.at,.0024,.0005,.0024);
 const buds=a.budMonths.includes(s.month),fruits=a.fruitMonths?.includes(s.month),flower=(n)=>{
  const R=a.flowerRadius,az=n.an+1.8,offset=type==='coco'?.015:axillary?.008:R*.08,base=[n.at[0]+Math.sin(az)*offset,n.at[1]+(type==='coco'?-.012:axillary?.004:R*.13),n.at[2]+Math.cos(az)*offset],f=flowerFrame(b,base,type==='coco'?2.65:axillary?.9+n.roll*.8:decid?.12+n.roll*.30:.30+n.roll*.55,az),closed=!s.bloom||(n.roll*13.7)%1<.13;
  b.branch(n.at,base,.0015,a.stemColor,'pedicel-magnolia');
  if(closed){f.add(kit.bud,'bud-magnolia-hairy',a.flowerPalette.bud,0,R*.35,0,R*.24,R*.50,R*.24);return;}
  f.add(kit.bud,'receptacle-magnolia','#dfd4b0',0,R*.04,0,R*.22,R*.12,R*.22);
  const N=a.petals;
  for(let k=0;k<N;k++){
   const layer=Math.floor(k/3),az=k*TAU/3+(layer%2?Math.PI/3:0),scale=1-layer*.09,outer=type==='coco'&&k<3,shape=outer?'magnoliaTepal-coco-outer':'magnoliaTepal-'+type;
   const color=outer?'#b1bd8a':s.flowerColor,kind=outer?'sepal-magnolia-coco':'petal-magnolia-'+type;
   f.add(shape,kind,color,0,layer*R*.035,0,R*scale,R*scale,R*scale,0,az,0);
  }
  if(type==='kobus'){
   for(let k=0;k<3;k++)f.add('magnoliaTepal-kobus','sepal-magnolia-kobus','#9a9e7a',0,-R*.02,0,R*.12,R*.1,R*.33,0,k*TAU/3,0);
   f.add('magnolia-kobus','leaf-magnolia-flower-bract','#83966a',R*.12,-R*.04,0,R*.28,R*.62,R*.62,1.30,az+1.0,0);
  }
  f.add(kit.bud,'gynoecium-magnolia','#abb577',0,R*.43,0,R*.16,R*.37,R*.16);
  for(let j=0;j<a.pistilCount;j++){
   const theta=j*2.399963,t=(j+.5)/a.pistilCount,r=R*.15*Math.sqrt(1-Math.pow(2*t-1,2)),y=R*(.17+t*.62),at=[Math.sin(theta)*r,y,Math.cos(theta)*r];
   f.add(kit.bud,'carpel-magnolia','#acb77b',...at,R*.045,R*.073,R*.033,0,theta,0);f.branch(at,[at[0]*1.22,y+R*.05,at[2]*1.22],R*.009,'#c4c994','stigma-magnolia');
  }
  for(let j=0;j<a.stamenCount;j++){
   const an=j*2.399963,t=(j+.5)/a.stamenCount,r=R*(.17+.11*t),root=[Math.sin(an)*r,R*.06,Math.cos(an)*r],tip=[Math.sin(an)*r*1.2,R*(.25+.11*(1-t)),Math.cos(an)*r*1.2];
   f.branch(root,tip,R*.008,'#d4c8ab','filament-magnolia');f.add(kit.bud,'anther-magnolia',type==='portwine'?'#8c645b':type==='fairy'?'#b39a83':'#d4c69a',...tip,R*.019,R*.052,R*.016,.15,an,0);
  }
 };
 for(const n of axillary?nodes:tips){
  if(axillary&&(n.order!==1||n.t>.78)||n.roll>.47)continue;
  if(s.bloom&&n.roll<(s.flowerDensity||1)*.47||buds)flower(n);
  if(fruits&&n.roll<.14){
   const R=a.fruitRadius,typeK=type==='kobus',base=[n.at[0],n.at[1]+R*.4,n.at[2]],f=flowerFrame(b,base,typeK?.9:.3,n.an);
   const bend=t=>typeK?R*.60*Math.sin(Math.PI*t):0;
   if(typeK){for(let k=0;k<5;k++){const t=(k+.5)/5;f.add(kit.bud,'aggregate-magnolia',a.fruitColor,bend(t),R*2*t,0,R*.30,R*.29,R*.30);}}
   else f.add(kit.bud,'aggregate-magnolia',a.fruitColor,0,R,0,R*.43,R,R*.43);
   for(let j=0;j<20;j++){const t=(j+.5)/20,an=j*2.399963,r=R*.48*Math.sin(Math.PI*t),pt=[bend(t)+Math.sin(an)*r,R*2*t,Math.cos(an)*r];f.add(kit.bud,'follicle-magnolia',a.fruitColor,...pt,R*.18,R*.20,R*.13,0,an,0);if(j%3===0){const end=[pt[0]+Math.sin(an)*R*.06,pt[1]-R*.40,pt[2]+Math.cos(an)*R*.06];f.branch(pt,end,.00025,'#dbd8bc','seed-thread-magnolia');f.add(kit.bud,'seed-magnolia','#b84a35',...end,R*.13,R*.18,R*.10);}}
  }
 }
}

export function camelliaLeafPoint(type,t,u){
 const tea=type==='sayama'||type==='yabukita',fold=type==='sayama',wide=type==='kamo';
 const teeth=(Math.floor(t*36)%2?.975:1.025),profile=Math.pow(Math.sin(Math.PI*t),wide?.67:.86)*(wide?1.08-.15*t:1.02-.10*t)*teeth;
 return [u*profile*.5,t,Math.sin(Math.PI*t)*(.024+(fold?.17:.045)*u*u)+(fold?.022:.005)*Math.sin(t*(tea?38:32))*u*u];
}
export function camelliaCorollaGeometry(type){
 const pos=[],uv=[],ix=[],outer=[],petals=type==='elina'||type==='robiraki'?5:type==='sayama'||type==='yabukita'?7:6,rows=16,cols=6;
 for(let l=0;l<petals;l++){
  const start=pos.length/3,an=l*TAU/petals+(l%2?.045:0),cup=type==='kamo'?.72:type==='elina'?.70:type==='robiraki'?.15:.32;
  for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
   const t=i/rows,u=j/cols*2-1,r=.10+.90*t,width=(type==='elina'?.65:.74)*Math.pow(Math.sin(Math.PI*t),.49),x=u*width,y=cup*Math.sin(t*Math.PI*.58)+.045*u*u*Math.sin(Math.PI*t)+.02*Math.sin(u*11+l)*t*t;
   pos.push(Math.sin(an)*r+Math.cos(an)*x,y,Math.cos(an)*r-Math.sin(an)*x);uv.push(j/cols,i/rows);outer.push(l<2?1:0);
   if(i<rows&&j<cols){const k=start+i*(cols+1)+j;ix.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.setAttribute('camelliaOuter',new THREE.Float32BufferAttribute(outer,1));g.userData.camelliaFlower={type,petals,outerPinkPetals:type==='elina'?2:0};return g;
}
export function camelliaStamenGeometry(type,part){
 const pos=[],uv=[],ix=[],count={elina:25,sayama:100,yabukita:100,robiraki:80,taiwan:45,kamo:110}[type],tube=type==='kamo'||type==='elina';
 for(let k=0;k<count;k++){
  const an=k*2.399963,edge=Math.sqrt((k+.5)/count),r=(tube?.17:.30)*edge,H=type==='elina'?1.24:type==='kamo'?.82:.65,h=H*(1-.23*edge+.05*Math.sin(k*1.9));
  const end=[Math.sin(an)*r,h,Math.cos(an)*r];
  if(part==='anthers'){
   const st=pos.length/3,R=type==='elina'?.048:.025;
   for(const v of [[R,0,0],[-R,0,0],[0,R*.75,0],[0,-R*.75,0],[0,0,R*.70],[0,0,-R*.70]]){pos.push(...end.map((n,j)=>n+v[j]));uv.push(.5,.5);}
   for(const f of [[0,2,4],[2,1,4],[1,3,4],[3,0,4],[2,0,5],[1,2,5],[3,1,5],[0,3,5]])ix.push(...f.map(n=>n+st));
  }else for(let plane=0;plane<2;plane++){
   const st=pos.length/3;
   for(let j=0;j<=4;j++)for(const sign of [-1,1]){
    const t=j/4,q=[end[0]*(tube?.70+.3*t:t*t),h*t,end[2]*(tube?.70+.3*t:t*t)];q[plane===0?0:2]+=sign*(type==='elina'?.011:.006);pos.push(...q);uv.push(sign===1?1:0,t);
    if(j<4&&sign===-1){const v=st+j*2;ix.push(v,v+1,v+2,v+1,v+3,v+2);}
   }
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.camelliaStamens={type,part,count};return g;
}
function drawCamellia(b,{info,s,detail,rand},kit){
 const a=info.appearance,typ=a.shootProfile,elina=typ==='elina',tea=['sayama','yabukita'].includes(typ),h=s.height,w=s.spread,wood=[],nodes=[],tips=[];
 const leader=elina?.97:a.habit==='rounded'?.47:.72,trunk=[];
 for(let j=0;j<=8;j++)trunk.push([Math.sin(j*.68)*w*.009,h*leader*j/8,Math.sin(j*1.12)*w*.008]);
 for(let j=1;j<trunk.length;j++)wood.push({from:trunk[j-1],to:trunk[j],r:h*.015*(1-j*.10),old:true});
 const shoot=(root,az,rise,reach,order)=>{
  const n=order===0?9:order===1?7:6;let previous=root;
  for(let j=0;j<n;j++){
   const t=(j+1)/n,an=az+.12*Math.sin(t*4+az),droop=elina?(order===0?reach*.48:reach*.65)*Math.pow(Math.max(0,(t-.38)/.62),1.35):0;
   const at=[root[0]+Math.sin(an)*reach*t,root[1]+rise*t+reach*(elina?.22:.05)*Math.sin(Math.PI*t)-droop,root[2]+Math.cos(an)*reach*t];
   wood.push({from:previous,to:at,r:(order===0?.008:order===1?.0023:order===2?.0009:.00055)*Math.max(.3,Math.min(h,2))*(1-t*.65),old:order===0&&j<5});previous=at;
   const node={at,an:an+j*2.399963,t,order,size:.78+rand()*.22,roll:rand()};if(order>0)nodes.push(node);if(j===n-1&&order>=1)tips.push(node);
   if(order===0&&j>=2&&j<=7)shoot(at,an+(j%2?1:-1)*(.62+rand()*.54),h*(tea?.13:elina?.08:.10)*(1-t*.3),w*(elina?.18:.14)*(1-t*.35),1);
   if(order===1&&(j===1||j===3||j===5))shoot(at,an+(j%4<2?1:-1)*1.03,h*(tea?.055:.030),w*(elina?.060:.050),2);
   if(order===2&&(j===2||j===4)&&(!elina||w>1.1))shoot(at,an+(j===2?1:-1)*.82,h*.018,w*.025,3);
  }
 };
 const count=Math.round((elina?17:18+Math.min(w*2,6))*detail);
 for(let i=0;i<count;i++){
  const t=(i+.5)/count,an=i*2.399963+rand()*.18,rounded=a.habit==='rounded',level=elina?.20+.72*t:rounded?.12+.32*t:.12+.40*t,root=[Math.sin(level*5.44)*w*.009,h*level,Math.sin(level*8.96)*w*.008];
  const tip=rounded?.30+.58*((i*.6180339+.29)%1):0,reach=w*(elina?.45*(1-t*.60):rounded?.38*Math.sqrt(Math.max(.12,1-Math.pow((tip-.57)/.41,2))):.33*Math.sqrt(1-t*t*.68)),rise=elina?reach*.20:rounded?h*tip-root[1]:h*(.26+.18*t);
  wood.push({from:trunk[Math.min(8,Math.round(level/leader*8))],to:root,r:h*.004,old:true});shoot(root,an,rise,reach,0);
 }
 for(const q of wood)if(q.from.some((v,i)=>v!==q.to[i]))b.branch(q.from,q.to,q.r,q.old?a.barkColor:a.stemColor,q.old?'wood-camellia-smooth':'stem-camellia');
 for(const n of nodes){
  const spring=s.month>=3&&s.month<=5,young=spring&&n.t>.72,L=a.leafLength*n.size*(young?.72:1),P=elina?.0033:.0055,an=n.an,at=[n.at[0]+Math.sin(an)*P,n.at[1]+P*.35,n.at[2]+Math.cos(an)*P],f=flowerFrame(b,at,(typ==='sayama'?.48:.80)+n.roll*.48,an);
  b.branch(n.at,at,.00045,a.stemColor,'petiole-camellia');
  f.add(a.leafShape,`leaf-camellia-${typ==='sayama'?'leathery':'glossy'}-underside-${a.leafUnderside.slice(1)}`,kit.shade(rand,young?(elina?a.springShootColor:tea?'#8baf50':'#718b50'):s.leafColor,.035),0,0,0,L*a.leafWidth/a.leafLength,L,L);
  if(young&&elina){const q=camelliaLeafPoint(typ,.18,.6).map((v,j)=>v*L*(j===0?a.leafWidth/a.leafLength:1));f.branch(q,[q[0]+.0002,q[1],q[2]+.0004],.000035,'#b9ac94','hair-camellia-young');}
 }
 const before=a.budMonths.includes(s.month),show=s.bloom||before;
 if(!show)return;
 const flower=(node,k)=>{
  const R=a.flowerRadius,az=node.an+1.9+k*2.0,at=[node.at[0]+Math.sin(az)*R*.38,node.at[1]+(elina?-R*.6:R*.2),node.at[2]+Math.cos(az)*R*.38],f=flowerFrame(b,at,elina?2.8:tea?1.8:1.0+node.roll*.75,az),closed=!s.bloom||node.roll<.13;
  b.branch(node.at,at,elina?.0003:.0007,a.stemColor,'pedicel-camellia');f.add(kit.bud,'calyx-camellia','#859267',0,-R*.05,0,R*.26,R*.17,R*.26);
  if(closed){
   f.add(kit.bud,'bud-camellia-flower',a.flowerPalette.bud,0,R*.28,0,R*(elina?.35:.46),R*(elina?.60:.48),R*(elina?.35:.46));
   if(typ==='kamo'&&s.bloom){f.branch([0,R*.61,0],[0,R*.97,0],R*.011,'#e6ddba','style-camellia-protruding');f.add(kit.bud,'stigma-camellia-protruding','#d7d19e',0,R*.99,0,R*.028,R*.019,R*.028);}return;
  }
  f.add(kit.bud,'receptacle-camellia','#e5dcc1',0,R*.02,0,R*.20,R*.04,R*.20);
  f.add(a.flowerShape,elina?'petal-camellia-pinkoutside':'petal-camellia',s.flowerColor,0,0,0,R,R,R);
  f.add('camellia-filaments-'+typ,'filaments-camellia','#f0e9d5',0,0,0,R,R,R);
  f.add('camellia-anthers-'+typ,'anthers-camellia','#d7b153',0,0,0,R,R,R);
  const style=elina?1.5:typ==='kamo'?.90:.75;f.branch([0,0,0],[0,R*style,0],R*.012,'#e6ddbb','style-camellia');
  for(let j=0;j<3;j++){const an=j*TAU/3;f.add(kit.bud,'stigma-camellia','#d9d1ab',Math.sin(an)*R*.024,R*style,Math.cos(an)*R*.024,R*.018,R*.010,R*.018);}
 };
 for(const n of tea||elina?nodes:tips){
  // Tea and Elina flowers sit in leaf axils; large camellias flower near shoot ends.
  if((tea||elina)&&(n.order!==1||n.t>.80)||n.roll>.42)continue;
  flower(n,0);if(elina&&n.roll>.30)flower(n,1);
 }
}

export function oliveLeafPoint(type,t,u){
 const sharp=type==='oliveSharp',russian=type==='russianOliveLance',profile=Math.pow(Math.sin(Math.PI*t),sharp?.90:.73)*(russian?1.10-.18*t:1.04-.08*t);
 return [u*profile*.5,t,Math.sin(Math.PI*t)*(.033+.065*u*u)+.012*Math.sin(t*9)*u*t];
}
export function oliveFlowerGeometry(russian=false){
 const pos=[],uv=[],ix=[],sides=12,rings=6;
 for(let j=0;j<=rings;j++)for(let k=0;k<=sides;k++){
  const t=j/rings,an=k*TAU/sides,r=russian?.16+.19*t*t:.27+.25*t*t;
  pos.push(Math.sin(an)*r,t,Math.cos(an)*r);uv.push(k/sides,t*.4);
  if(j<rings&&k<sides){const q=j*(sides+1)+k;ix.push(q,q+1,q+sides+1,q+1,q+sides+2,q+sides+1);}
 }
 for(let l=0;l<4;l++){
  const start=pos.length/3,an=l*TAU/4,rows=8,cols=4;
  for(let i=0;i<=rows;i++)for(let k=0;k<=cols;k++){
   const t=i/rows,u=k/cols*2-1,r=(russian?.35:.52)+(russian?.65:.48)*t,width=(russian?.32:.40)*Math.pow(Math.sin(Math.PI*t),russian?1:.6),x=u*width;
   pos.push(Math.sin(an)*r+Math.cos(an)*x,1+(russian?.24:.2)*t+.06*Math.sin(Math.PI*t)*u*u,Math.cos(an)*r-Math.sin(an)*x);uv.push(k/cols,.4+.6*t);
   if(i<rows&&k<cols){const q=start+i*(cols+1)+k;ix.push(q,q+1,q+cols+1,q+1,q+cols+2,q+cols+1);}
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.oliveFlower={lobes:4,organ:russian?'calyx':'corolla'};return g;
}
export function oliveFruitGeometry(type){
 const p=[],uv=[],ix=[],rows=16,cols=16;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,an=j*TAU/cols,y=1-2*t,bulge=type==='lucca'?.72+.40*t:type==='mission'?.97-.35*t:type==='nevadillo'?.95+.1*t:1,r=Math.pow(Math.sin(Math.PI*t),type==='mission'?.83:.65)*bulge;
  p.push(Math.sin(an)*r+(type==='nevadillo'?.16*Math.sin(Math.PI*t)*t:0),y,Math.cos(an)*r);uv.push(j/cols,t);
  if(i<rows&&j<cols){const q=i*(cols+1)+j;ix.push(q,q+1,q+cols+1,q+1,q+cols+2,q+cols+1);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.oliveFruit=type;return g;
}
function drawOlives(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,typ=a.shootProfile,russian=typ==='russian',upright=a.habit==='upright'||a.habit==='columnar',column=a.habit==='columnar',nodes=[],wood=[],fruitSites=[];
 const trunk=[],baseRadius=Math.max(.010,h*.017);
 for(let i=0;i<=5;i++)trunk.push([Math.sin(i*.83)*w*.018,h*.40*i/5,Math.sin(i*1.27)*w*.012]);
 for(let i=1;i<trunk.length;i++)wood.push({from:trunk[i-1],to:trunk[i],r:baseRadius*(1-i*.10),old:true});
 const shoot=(root,az,rise,reach,order)=>{
  let prev=root;const n=order===0?8:order===1?7:5;
  for(let j=0;j<n;j++){
   const t=(j+1)/n,an=az+.16*Math.sin(t*5+az),sag=(russian||a.habit==='spreading')?.08:.02;
   const at=[root[0]+Math.sin(an)*reach*t,root[1]+rise*t+h*.025*Math.sin(Math.PI*t)-h*sag*t*t*(order===0?1:.2),root[2]+Math.cos(an)*reach*t];
   wood.push({from:prev,to:at,r:(order===0?.0052:order===1?.0014:.0006)*Math.max(.55,Math.min(2.6,h))*(1-t*.65),old:order===0&&j<4});prev=at;
   if(order>0)nodes.push({at,an:az+j*(russian?2.4:Math.PI/2),t,order,roll:rand(),size:.7+rand()*.3});
   if(order===0&&j>=2&&j<=6){const side=j%2?1:-1;shoot(at,an+side*(.70+rand()*.48),h*(upright?.10:.045)*(1-t*.35),w*(column?.050:.080)*(1-t*.35),1);}
   if(order===1&&(j===2||j===4))shoot(at,an+(j===2?1:-1)*.86,h*.028,w*.038,2);
   if(order===2&&(j===1||j===3))shoot(at,an+(j===1?1:-1)*1.12,h*.015,w*.025,3);
  }
 };
 const count=Math.max(9,Math.round((13+Math.min(8,w*3))*detail));
 for(let i=0;i<count;i++){
  const an=i*2.399963+rand()*.25,t=(i+.5)/count,root=[Math.sin(t*4.15)*w*.018,h*(.24+t*.48),Math.sin(t*6.35)*w*.012];
  // Irregular co-leaders and lateral branches, never a spherical cloud of detached leaves.
  const edge=Math.sqrt((i+.45)/count),reach=upright?w*(column?.30:.35)*Math.pow(Math.sin(Math.PI*(.13+t*.80)),.7)*(.85+rand()*.15):w*.44*edge,tipY=upright?h*(.56+.40*t):h*(.47+.43*Math.sqrt(1-edge*edge)),rise=tipY-root[1]+h*((russian||a.habit==='spreading')?.08:.02);
  b.branch(trunk[Math.min(5,Math.floor(t*4)+1)],root,baseRadius*.4,a.barkColor,'wood-olive-fork');shoot(root,an,rise,reach,0);
 }
 for(const q of wood)b.branch(q.from,q.to,q.r,q.old?a.barkColor:a.stemColor,q.old?(russian?'wood-russian-olive':h>3?'wood-olive-furrow':'wood-olive-smooth'):'stem-olive-scaly');
 for(const n of nodes){
  if(russian&&n.order===1&&n.t<.80&&n.roll<.10){const tip=[n.at[0]+Math.sin(n.an)*.020,n.at[1]+.009,n.at[2]+Math.cos(n.an)*.020];b.branch(n.at,tip,.0011,'#847864','thorn-russian-olive');}
  if(s.leafDensity===0){b.add(kit.bud,'bud-russian-olive','#a79c83',...n.at,.0014,.0028,.0014);continue;}
  for(const side of russian?[1]:[-1,1]){
   const roll=(n.roll+(side===-1?.43:0))%1;if(roll>s.leafDensity)continue;
   const an=n.an+(side===1?0:Math.PI),newLeaf=[4,5].includes(s.month)&&n.t>.70,L=a.leafLength*n.size*(russian?s.leafScale:newLeaf?.77:1),P=russian?.006:.003,at=[n.at[0]+Math.sin(an)*P,n.at[1]+P*.3,n.at[2]+Math.cos(an)*P],f=flowerFrame(b,at,.77+roll*.95,an);
   b.branch(n.at,at,.00045,a.stemColor,'petiole-olive');
   f.add(a.leafShape,`leaf-olive-${russian?'scaly':'glossy'}-underside-${a.leafUnderside.slice(1)}`,kit.shade(rand,newLeaf?'#829663':s.leafColor,.045),0,0,0,L*a.leafWidth/a.leafLength,L,L);
  }
  // Flowering sites belong to last year's axillary nodes, below the newest terminal leaves.
  if(n.order!==1||n.t>.68||n.roll>.28)continue;
  const length=a.inflorescenceLength,an=n.an,at=[n.at[0]+Math.sin(an)*length*.2,n.at[1]+length*.15,n.at[2]+Math.cos(an)*length*.2],fr=flowerFrame(b,at,russian?1.7:.75,an);
  if(a.fruitMonths.includes(s.month)&&n.roll<.19)fruitSites.push({at,an,roll:n.roll});
  const before=!s.bloom&&a.flowerMonths.includes(s.month+1);if(!s.bloom&&!before)continue;
  b.branch(n.at,at,.0006,a.stemColor,'peduncle-olive');
  const nf=russian?2:22;
  for(let k=0;k<nf;k++){
   const t=(k+.5)/nf,theta=k*2.399963,r=russian?.007:length*.22*(1-t*.55),end=[Math.sin(theta)*r,length*(russian?.20:.88)*t,Math.cos(theta)*r],f=flowerFrame(fr,end,russian?.15:1.15,theta),R=a.flowerRadius,F=a.flowerLength;
   fr.branch([0,0,0],[0,end[1],0],.00035,a.stemColor,'rachis-olive');fr.branch([0,end[1]*.65,0],end,.00020,a.stemColor,'pedicel-olive');
   if(before||k%9===0){f.add(kit.bud,'bud-olive-flower',a.flowerPalette.bud,0,F*.40,0,R*.5,F*.5,R*.5);continue;}
   if(!russian)for(let l=0;l<4;l++){const theta=l*TAU/4;f.add(kit.bud,'sepal-olive','#a0ac7a',Math.sin(theta)*R*.22,0,Math.cos(theta)*R*.22,R*.18,F*.24,R*.18);}
   f.add(russian?'russianOliveCalyx':'oliveCorolla',russian?'sepal-russian-olive-silver':'petal-olive',s.flowerColor,0,0,0,R,F,R);
   for(let j=0;j<a.stamenCount;j++){const theta=j*TAU/a.stamenCount+(russian?Math.PI/4:0),r=R*(russian?.22:.24);f.add(kit.bud,'anther-olive','#cec076',Math.sin(theta)*r,F*.98,Math.cos(theta)*r,R*.15,F*.12,R*.11);}
   f.branch([0,0,0],[0,F*(russian?1.06:.74),0],.00010,'#babd81','style-olive');f.add(kit.bud,'stigma-olive','#c0c690',0,F*(russian?1.08:.76),0,R*.10,F*.04,R*.10);
  }
 }
 for(const q of fruitSites){
  const scale=s.month===7?.42:s.month===8?.72:1,n=russian?2:q.roll<.07?2:1;
  for(let k=0;k<n;k++){
   const R=a.fruitRadius*scale,an=q.an+k*1.8,top=[q.at[0]+Math.sin(an)*.009,q.at[1]-.005,q.at[2]+Math.cos(an)*.009],center=[top[0],top[1]-R*.90,top[2]],ripe=russian?s.month>=9:typ==='mission'?s.month>=12:s.month>=11,turning=!russian&&s.month>=(typ==='mission'?11:10),green=russian?'#b0baa7':'#839646',color=ripe?a.fruitColor:turning?(q.roll<.09?'#856475':'#a2a553'):green;
   b.branch(q.at,top,.00055,a.stemColor,'fruit-stalk-olive');b.add('oliveFruit-'+(russian?'russian':['mission','lucca','nevadillo'].includes(typ)?typ:'oval'),russian?'fruit-russian-olive-scaly':'fruit-glossy-olive',color,...center,R*.63,R,R*.63,0,an,.08);
  }
 }
}

export function syringaLeafPoint(type,t,u){
 const heart=type==='syringaCordate',elliptic=type==='syringaElliptic';
 const width=Math.pow(Math.sin(Math.PI*t),heart?.62:.76)*(heart?1.35-.55*t:elliptic?.95+.04*t:1.12-.30*t);
 const base=heart?-.55*Math.sin(Math.PI*t)*Math.abs(u)*(1-t):0;
 return [u*width*.5,t+base,Math.sin(Math.PI*t)*(.025+.06*u*u)+.007*Math.sin(t*31)*Math.abs(u)];
}
export function syringaCorollaGeometry(){
 const p=[],uv=[],ix=[],rings=5,sides=10;
 for(let j=0;j<=rings;j++)for(let k=0;k<=sides;k++){
  const t=j/rings,an=k*TAU/sides,r=.12+.065*t*t;p.push(Math.sin(an)*r,t,Math.cos(an)*r);uv.push(k/sides,t*.20);
  if(j<rings&&k<sides){const i=j*(sides+1)+k;ix.push(i,i+sides+1,i+1,i+1,i+sides+1,i+sides+2);}
 }
 for(let lobe=0;lobe<4;lobe++){
  const an=lobe*TAU/4,start=p.length/3,rows=8,cols=4;
  for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
   const t=i/rows,u=j/cols*2-1,width=.40*Math.pow(Math.sin(Math.PI*t),.56),r=.17+.81*t,x=u*width,y=1+.075*Math.sin(Math.PI*t)+.11*u*u*Math.sin(Math.PI*t)-.025*t;
   p.push(Math.sin(an)*r+Math.cos(an)*x,y,Math.cos(an)*r-Math.sin(an)*x);uv.push(j/cols,.22+.78*t);
   if(i<rows&&j<cols){const v=start+i*(cols+1)+j;ix.push(v,v+1,v+cols+1,v+1,v+cols+2,v+cols+1);}
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.syringaCorolla={lobes:4,tubular:true};return g;
}
function drawSyringa(b,{info,s,detail,rand},kit){
 const a=info.appearance,typ=a.shootProfile,small=a.habit==='rounded',h=s.height,w=s.spread,nodes=[],wood=[],tips=[],count=Math.max(4,Math.round((small?11:6)*detail));
 const shoot=(root,az,rise,reach,order)=>{
  let prev=root;const num=order===0?8:order===1?6:5;
  for(let j=0;j<num;j++){
   const t=(j+1)/num,an=az+.12*Math.sin(t*7+az),at=[root[0]+Math.sin(an)*reach*t,root[1]+rise*(t+.06*Math.sin(Math.PI*t)),root[2]+Math.cos(an)*reach*t];
   wood.push({from:prev,to:at,r:(order===0?.015:order===1?.004:.0013)*Math.max(.45,Math.min(1.7,h))*(1-t*.6),old:order===0&&j<4});prev=at;
   nodes.push({at,an:an+j*Math.PI/2,order,t,roll:rand(),size:.73+.27*rand()});
   if(order===0&&j>=1&&j<=6)for(const side of [-1,1])shoot(at,an+side*(.6+.42*rand()),h*(small?.13:.21)*(1-t),w*(small?.15:.12)*(1-t*.25),1);
   if(order===1&&(j===2||j===4))for(const side of [-1,1])shoot(at,an+side*.75,h*.045,w*.065,2);
   if(j===num-1)tips.push({at,an,roll:rand(),index:tips.length,order});
  }
 };
 for(let i=0;i<count;i++){
  const an=i*2.399963+(rand()-.5)*.35,edge=Math.sqrt((i+.35)/count),root=[Math.sin(an)*w*.065*edge,0,Math.cos(an)*w*.065*edge];
  shoot(root,an,h*(small?.89*Math.sqrt(1-.82*edge*edge):.58+.33*rand()),w*(small?.33:.24)*edge,0);
 }
 for(const q of wood)b.branch(q.from,q.to,q.r,q.old?a.barkColor:a.stemColor,q.old?'wood-syringa-lenticels':small?'stem-syringa':'stem-syringa-angular');
 for(const n of nodes){
  if(n.order===0&&n.t<.30)continue;
  if(s.leafDensity===0){for(const side of [-1,1])b.add(kit.bud,'bud-syringa-winter','#887c62',n.at[0]+Math.sin(n.an)*side*.002,n.at[1],n.at[2]+Math.cos(n.an)*side*.002,.0016,.0032,.0016,.35,n.an,0);continue;}
  for(const side of [-1,1]){
   const roll=(n.roll+(side===1?.39:0))%1;if(roll>s.leafDensity)continue;
   const an=n.an+(side===1?Math.PI:0),L=a.leafLength*n.size*s.leafScale,P=L*(small?.10:.21),at=[n.at[0]+Math.sin(an)*P,n.at[1]+P*.25,n.at[2]+Math.cos(an)*P],f=flowerFrame(b,at,.77+roll*.66,an);
   b.branch(n.at,at,.0007,a.stemColor,'petiole-syringa');
   f.add(a.leafShape,typ==='aucuba'?`leaf-syringa-aucuba-${Math.floor(roll*4)}`:typ==='kim'?'leaf-syringa-hairy':'leaf-syringa',kit.shade(rand,s.leafColor,.07),0,0,0,L*a.leafWidth/a.leafLength,L,L);
   if(typ==='kim')for(let k=0;k<3;k++){const p=syringaLeafPoint(a.leafShape,.30+k*.17,(roll-.5)*1.1).map((v,j)=>v*L*(j===0?a.leafWidth/a.leafLength:1));f.branch(p,[p[0]+.0003,p[1]+.0006,p[2]-.0002],.000035,'#b7c0a3','hair-syringa');}
  }
 }
 const before=!s.bloom&&a.flowerMonths.includes(s.month+1);if(!s.bloom&&!before)return;
 for(const tip of tips){
  // Flowering shoots occur through the crown. The two terminal panicles share a woody fork.
  if(tip.order===0||tip.roll>(small?.28:.24)*(s.bloom?s.flowerDensity:1))continue;
  for(const pair of [-1,1]){
   const L=a.inflorescenceLength*(.8+.20*((tip.roll*7)%1)),yaw=tip.an+pair*.65,base=[tip.at[0]+Math.sin(yaw)*L*.07,tip.at[1]+L*.04,tip.at[2]+Math.cos(yaw)*L*.07],frame=flowerFrame(b,base,.15+tip.roll*.25,yaw);
   b.branch(tip.at,base,.0014,a.stemColor,'panicle-stem-syringa');frame.branch([0,0,0],[0,L*.87,0],.0012,'#8e9b72','rachis-syringa');
   const flowers=small?42:64;
   for(let k=0;k<flowers;k++){
    const t=(k+.5)/flowers,an=k*2.399963,rad=L*.29*Math.pow(1-t,.65),at=[Math.sin(an)*rad,L*(.12+.74*t),Math.cos(an)*rad],fork=[0,L*t*.70,0];
    frame.branch(fork,at,.0004,'#92a47b','pedicel-syringa');
    const f=flowerFrame(frame,at,.40+Math.PI/3*(1-t),an),R=a.flowerRadius*(.88+.12*Math.sin(k*2.17)**2),length=a.flowerLength,closed=before||t>.78||k%11===0;
    f.add(kit.bud,'calyx-syringa','#91a276',0,0,0,R*.23,length*.16,R*.23);
    if(closed){f.add(kit.bud,'bud-syringa-flower',a.flowerPalette.bud,0,length*.25,0,R*.30,length*.38,R*.30);continue;}
    for(let layer=0;layer<a.flowerLayers;layer++)f.add('syringaCorolla',typ==='lilawonder'?'petal-syringa-rim':'petal-syringa',s.flowerColor,0,layer===0?0:length*(.82+layer*.09),0,R*(1-layer*.20),length*(layer===0?1:.32),R*(1-layer*.20),0,layer*.67,0);
    if(a.stamenCount){
     for(const side of [-1,1])f.add(kit.bud,'anther-syringa','#c4b878',R*.10*side,length*.80,0,R*.06,length*.065,R*.055);
     f.branch([0,0,0],[0,length*.69,0],.00007,'#c7c99c','style-syringa');for(const side of [-1,1])f.add(kit.bud,'stigma-syringa-lobe','#c6c996',R*.025*side,length*.70,0,R*.025,length*.025,R*.025);
    }
   }
  }
 }
}

export function hamamelidPoint(type,t,u){
 const ribbon=type==='loropetalumRibbon',loro=type==='loropetalumOvate',sym=type==='fothergillaSymmetric';
 if(ribbon){const angle=.8*Math.sin(t*5.5),width=.5*Math.pow(Math.sin(Math.PI*t),.20);return [u*width*Math.cos(angle)+.08*Math.sin(t*8)*t,t-.12*t*t,.15*Math.sin(t*4.7)+u*width*.15*Math.sin(angle)];}
 const teething=loro?1:t<.48?1:1-.13*(1-Math.abs(Math.sin((t-.48)*Math.PI*16)));
 const outline=Math.pow(Math.sin(Math.PI*t),loro?.69:.54)*(loro?1.08-.28*t:1.04-.10*t)*teething;
 const offset=sym?0:.075*Math.sin(Math.PI*t)*(1-t),y=t+(!sym?.045*u*Math.sin(Math.PI*t):0);
 return [u*outline*.5+offset,y,Math.sin(Math.PI*t)*(.025+.075*u*u)+(loro?.006:.018)*Math.cos(t*Math.PI*16)*Math.abs(u)];
}
// A flower head has no petals. Crossed ribbons retain fine stamens without thousands of cylinders.
export function fothergillaHeadGeometry(part){
 const pos=[],uv=[],ix=[],flowers=20,stamens=16;
 const dot=(at,r)=>{
  const start=pos.length/3;for(const q of [[r,0,0],[-r,0,0],[0,r,0],[0,-r,0],[0,0,r],[0,0,-r]]){pos.push(...at.map((x,k)=>x+q[k]));uv.push(.5,.5);}
  for(const q of [[0,2,4],[2,1,4],[1,3,4],[3,0,4],[2,0,5],[1,2,5],[3,1,5],[0,3,5]])ix.push(...q.map(x=>x+start));
 };
 for(let i=0;i<flowers;i++){
  const az=i*2.399963,y=.10+.56*(i+.5)/flowers,base=[Math.sin(az)*.06,y,Math.cos(az)*.06];
  for(let k=0;k<stamens;k++){
   const an=az+(k/(stamens-1)-.5)*2.7,r=.29+.085*Math.sin(k*2.13+i*1.97)**2,dy=.05+Math.cos(k*2.399963)*.14,end=[base[0]+Math.sin(an)*r,y+dy,base[2]+Math.cos(an)*r];
   if(part==='anthers'){dot(end,.014);continue;}
   for(let plane=0;plane<2;plane++){
    const start=pos.length/3;for(let step=0;step<=3;step++)for(const sign of [-1,1]){
     const t=step/3,q=base.map((v,j)=>v+(end[j]-v)*t+(j===1?.045*Math.sin(Math.PI*t):0));q[plane===0?0:2]+=sign*.004;pos.push(...q);uv.push(sign===1?1:0,t);
     if(step<3&&sign===-1){const v=start+step*2;ix.push(v,v+1,v+2,v+1,v+3,v+2);}
    }
   }
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.fothergillaHead={part,flowers,stamens,petals:0};return g;
}
function drawHamamelid(b,{info,s,detail,rand},kit){
 const a=info.appearance,typ=a.shootProfile,loro=a.architecture==='loropetalumShoots',creeping=typ==='ruby',weeping=typ==='plum',major=typ==='major',h=s.height,w=s.spread,nodes=[],tips=[],wood=[],count=Math.round((loro?creeping?7:12+Math.min(6,h*2):major?6:9)*detail);
 const shoot=(root,az,rise,reach,order)=>{
  let prev=root;const num=order===0?10:order===1?7:order===2?(loro&&!creeping?6:4):4;
  for(let j=0;j<num;j++){
   const t=(j+1)/num,zig=(j%2?1:-1)*(loro?.018:.038)*reach,an=az+.12*Math.sin(t*5+az),bow=creeping?.4:weeping?.67:loro?.26:.10;
   const at=[root[0]+Math.sin(an)*reach*t+Math.cos(an)*zig,Math.max(.015,root[1]+rise*(t+bow*Math.sin(Math.PI*t))-(weeping&&order>0?Math.min(h*.11,reach*.30)*t*t:0)),root[2]+Math.cos(an)*reach*t-Math.sin(an)*zig];
   wood.push({from:prev,to:at,r:(order===0?.010:order===1?.0028:.0009)*Math.max(.25,Math.min(1.8,h))*(1-t*.66),old:order===0&&j<5});prev=at;
   nodes.push({at,an:an+(j%2?1:-1)*Math.PI/2,order,t,roll:rand(),size:.78+.22*rand()});
   if(order===0&&j>=1&&j<=7)shoot(at,an+(j%2?1:-1)*(.70+rand()*.5),h*(creeping?.13:major?.25:.16)*(1-t),w*(creeping?.10:major?.15:.17)*(1-t*.4),1);
   if(order===1&&(j===1||j===3||j===5))shoot(at,an+(j%2?1:-1)*.85,h*(creeping?.09:.045),w*(creeping?.04:.060),2);
   if(loro&&!creeping&&order===2&&(j===1||j===3))shoot(at,an+(j===1?1:-1)*.8,h*.015,w*.026,3);
   if(j===num-1)tips.push({at,an,index:tips.length,roll:rand()});
  }
 };
 for(let i=0;i<count;i++){
  const an=i*2.399963+(rand()-.5)*.45,edge=Math.sqrt((i+.5)/count),root=[Math.sin(an)*w*.05*edge,0,Math.cos(an)*w*.05*edge];
  const rise=h*(creeping?.20+.25*rand():major?.55+.35*rand():.92*Math.sqrt(1-.78*edge*edge));
  shoot(root,an,rise,w*(creeping?.40:major?.24:.32)*edge,0);
 }
 for(const q of wood)b.branch(q.from,q.to,q.r,q.old?a.barkColor:a.stemColor,q.old?'wood-smooth':loro?'stem-loropetalum':'stem-fothergilla');
 for(const n of nodes){
  if(n.order===0&&n.t<.21)continue;
  if(s.leafDensity===0){b.add(kit.bud,'bud-fothergilla-downy','#a99475',...n.at,.0012,.0024,.0012,.25,n.an,0);continue;}
  if(n.roll>s.leafDensity)continue;
  const an=n.an,L=a.leafLength*n.size*s.leafScale,pet=L*.09,at=[n.at[0]+Math.sin(an)*pet,n.at[1]+pet*.25,n.at[2]+Math.cos(an)*pet],f=flowerFrame(b,at,.90+n.roll*.53,an);
  b.branch(n.at,at,.0005,a.stemColor,loro?'petiole-loropetalum':'petiole-fothergilla');
  const young=loro&&n.t>.65&&[4,5,6].includes(s.month),base=young?(typ==='beni'?'#8e5c70':typ==='sitisai'?'#bb829b':'#845566'):s.leafColor,autumn=!loro&&[10,11].includes(s.month);
  const kind=loro?(typ==='sitisai'?`leaf-loropetalum-mottled-${Math.floor(n.roll*3)}`:'leaf-loropetalum-woolly'):autumn?`leaf-fothergilla-autumn-${major?'major':typ}`:'leaf-fothergilla-woolly';
  f.add(a.leafShape,kind,kit.shade(rand,base,.075),0,0,0,L*a.leafWidth/a.leafLength,L,L);
  // Fine radiating hairs remain on the underside; their placement is a visual approximation.
  for(let k=0;k<(loro?1:2);k++){
   const point=hamamelidPoint(a.leafShape,.28+k*.24,(n.roll-.5)*1.2).map((v,j)=>v*L*(j===0?a.leafWidth/a.leafLength:1));point[2]-=.0002;
   for(let z=0;z<4;z++){const az=z*TAU/4;f.branch(point,[point[0]+Math.sin(az)*.00035,point[1]+Math.cos(az)*.00035,point[2]-.00015],.000025,'#c7c8b4',loro?'hair-loropetalum':'hair-fothergilla');}
  }
 }
 const before=!s.bloom&&a.flowerMonths.includes(s.month+1);
 for(const tip of tips){
  if(tip.roll>(loro?creeping?.56:.24:.55))continue;
  if(!loro){
   if(s.bloom){
    const f=flowerFrame(b,tip.at,.10+tip.roll*.5,tip.an),len=a.inflorescenceLength;
    f.branch([0,0,0],[0,len*.66,0],.00065,'#8d9572','rachis-fothergilla');
    f.add('fothergillaFilaments','filaments-fothergilla',s.flowerColor,0,0,0,len,len,len);
    f.add('fothergillaAnthers','anthers-fothergilla','#d9cd91',0,0,0,len,len,len);
    for(let k=0;k<20;k++){const az=k*2.399963,y=len*(.10+.56*(k+.5)/20);f.add(kit.bud,'calyx-fothergilla','#a8b18f',Math.sin(az)*len*.06,y,Math.cos(az)*len*.06,len*.035,len*.05,len*.035);}
   }else if(before)b.add(kit.bud,'bud-fothergilla-flower-downy','#b2a78d',...tip.at,.004,.009,.004,.2,tip.an,0);
   else if(a.fruitMonths.includes(s.month)&&tip.index%3===0){
    const f=flowerFrame(b,tip.at,.2,tip.an);
    for(let k=0;k<4;k++){
     const az=k*2.399963,at=[Math.sin(az)*.004,k*.006,Math.cos(az)*.004];f.add(kit.bud,'fruit-fothergilla-capsule',a.fruitColor,...at,.003,.004,.003);
     for(const side of [-1,1]){const mid=[at[0]+side*.002,at[1]+.005,at[2]],end=[at[0]+side*.003,at[1]+.006,at[2]+.0005];f.branch(at,mid,.00035,a.fruitColor,'horn-fothergilla');f.branch(mid,end,.0002,a.fruitColor,'horn-fothergilla');}
    }
   }
   continue;
  }
  if(!s.bloom&&!before)continue;if(s.bloom&&tip.roll>s.flowerDensity*(creeping?.56:.24))continue;
  for(let j=0;j<4;j++){
   const az=j*2.399963,at=[tip.at[0]+Math.sin(az)*.007,tip.at[1]+.002*j,tip.at[2]+Math.cos(az)*.007],f=flowerFrame(b,at,.25+tip.roll*.8,az+tip.an),L=a.flowerLength;
   f.add(kit.bud,'calyx-loropetalum','#885777',0,0,0,.0018,.0013,.0018);
   if(before||j===3&&tip.index%4===0){f.add(kit.bud,'bud-loropetalum',s.flowerColor,0,.001,0,.0027,.003,.0027);continue;}
   for(let k=0;k<4;k++){
    const an=k*TAU/4;f.add('loropetalumRibbon','petal-loropetalum',s.flowerColor,Math.sin(an)*.001,.0005,Math.cos(an)*.001,.0015,L,L,1.20+Math.sin(k+tip.index)*.20,an,0);
    f.add('narrow','sepal-loropetalum','#995675',0,0,0,.0018,.0022,.001,1,an,0);
    const st=[Math.sin(an)*.0012,.0017,Math.cos(an)*.0012];f.add(kit.bud,'anther-loropetalum','#b76287',...st,.00030,.0004,.00025);
    f.branch(st,[st[0]*.6,.0021,st[2]*.6],.00013,'#bd7695','connective-loropetalum');
    f.add('narrow','staminode-loropetalum','#a77391',0,0,0,.0005,.0007,.0005,.5,an+Math.PI/4,0);
   }
  }
 }
}

export function deutziaPoint(type,t,u){
 const petal=type==='deutziaPetal',leaf=type==='deutziaLance'||type==='deutziaOvate';
 const width=Math.pow(Math.sin(Math.PI*t),petal?.72:.80)*(petal?.50+.52*t:type==='deutziaLance'?1.05-.35*t:1.14-.27*t)*(leaf?1-.055*(1-Math.abs(Math.sin(t*Math.PI*15))):1);
 return [u*width*.5,t,Math.sin(Math.PI*t)*(.024+(petal?.14:.042)*u*u)+.010*t*t];
}
function drawDeutzia(b,{info,s,detail,rand},kit){
 const a=info.appearance,typ=a.shootProfile,compact=['hana','cherry'].includes(typ),shisen=typ==='setchuenensis',double=typ==='pompon',h=s.height,w=s.spread,nodes=[],tips=[],wood=[],count=Math.round((compact?15:shisen?10:12)*detail);
 const shoot=(root,az,rise,reach,order)=>{
  const num=order===0?9:order===1?6:4;let prev=root;
  for(let j=0;j<num;j++){
   const t=(j+1)/num,an=az+.13*Math.sin(t*4+az),at=[root[0]+Math.sin(an)*reach*t,root[1]+rise*(.78*t+.30*Math.sin(Math.PI*t)),root[2]+Math.cos(an)*reach*t];
   wood.push({from:prev,to:at,r:(order===0?.0045:order===1?.0015:.00065)*(1-t*.6),old:order===0&&j<5});prev=at;nodes.push({at,an:an+j*Math.PI/2,roll:rand(),size:.72+.28*rand(),t,order});
   if(order===0&&j>=1&&j<=6)for(const side of [-1,1])shoot(at,an+side*(.65+.5*rand()),h*(1-t)*.20,w*.13*(1-t*.50),1);
   if(order===1&&j===3)shoot(at,an+(rand()>.5?1:-1)*.75,h*.045,w*.075,2);
   if(order>0&&j===num-1)tips.push({at,an,roll:rand(),index:tips.length});
  }
 };
 for(let i=0;i<count;i++){
  const an=i*2.399963+(rand()-.5)*.3,edge=Math.sqrt((i+.2)/count),root=[Math.sin(an)*w*.07*edge,0,Math.cos(an)*w*.07*edge];
  shoot(root,an,h*(compact?.98*Math.sqrt(1-.88*edge*edge):.56+.40*rand()),w*(compact?.34:.37)*edge,0);
 }
 for(const q of wood)b.branch(q.from,q.to,q.r,q.old?a.barkColor:a.stemColor,q.old?(shisen?'wood-peeling':'wood-smooth'):'stem-deutzia');
 for(const n of nodes){
  if(n.order===0&&n.t<.24)continue;
  if(s.leafDensity===0){b.add(kit.bud,'bud-deutzia-winter','#8f775d',...n.at,.0007,.0015,.0007,0,n.an,0);continue;}
  for(let j=0;j<2;j++){
   const roll=(n.roll+j*.381)%1;if(roll>s.leafDensity)continue;
   const an=n.an+j*Math.PI,L=a.leafLength*n.size*s.leafScale,P=L*.07,at=[n.at[0]+Math.sin(an)*P,n.at[1]+P*.2,n.at[2]+Math.cos(an)*P];b.branch(n.at,at,.00035,a.stemColor,'petiole-deutzia');
   const f=flowerFrame(b,at,.70+roll*.75,an),young=typ==='beni'&&n.t>.72&&s.month>=4&&s.month<=6,col=kit.shade(rand,young?'#87696d':s.leafColor,.07);
   f.add(a.leafShape,shisen?'leaf-deutzia-woolly-underside-a4b09c':'leaf-deutzia-woolly',col,0,0,0,L*a.leafWidth/a.leafLength,L,L);
   for(let k=0;k<(shisen?3:1);k++){
    const t=.35+k*.18,u=k%2?.4:-.4,q=deutziaPoint(a.leafShape,t,u).map((v,i)=>v*L*(i===0?a.leafWidth/a.leafLength:1));
    for(let z=0;z<4;z++){const az=z*TAU/4;f.branch(q,[q[0]+Math.cos(az)*.00035,q[1]+Math.sin(az)*.00035,q[2]-.00018],.000027,'#c6cebc','hair-deutzia-stellate');}
   }
  }
 }
 const before=!s.bloom&&a.flowerMonths.includes(s.month+1);if(!s.bloom&&!before)return;
 const flower=(at,az,pitch,seed)=>{
  const f=flowerFrame(b,at,pitch,az),r=a.flowerRadius,closed=before||seed%7===0,pal=a.flowerPalette;
  f.add(kit.bud,'calyx-deutzia','#829479',0,0,0,r*.25,r*.24,r*.25);
  for(let j=0;j<5;j++)f.add('narrow','sepal-deutzia','#8b9c7e',0,0,0,r*.22,r*.35,r*.3,.85,j*TAU/5,0);
  if(closed){f.add(kit.bud,'bud-deutzia-flower',pal.bud,0,r*.35,0,r*.46,r*.61,r*.46);return;}
  const layers=a.flowerLayers;
  for(let layer=0;layer<layers;layer++)for(let j=0;j<5;j++){
   const an=j*TAU/5+layer*.41,scale=1-layer*.15,col=double&&seed%3===0?'#ede4e4':s.flowerColor,kind=['gracilis','lime','setchuenensis'].includes(typ)?'petal-deutzia-plain':`petal-deutzia-${typ}-${pal.outside.slice(1)}`;
   f.add('deutziaPetal',kind,col,Math.sin(an)*r*.07,r*.1+layer*r*.07,Math.cos(an)*r*.07,r*.71*scale,r*1.04*scale,r,1.08-layer*.19,an,0);
  }
  for(let j=0;j<a.stamenCount;j++){
   const an=j*TAU/10,outer=j%2===0,L=r*(outer?.64:.46),end=[Math.sin(an)*r*.30,L,Math.cos(an)*r*.30];
   f.add('narrow','wing-deutzia-filament','#dedac4',Math.sin(an)*r*.15,r*.12,Math.cos(an)*r*.15,r*.12,L*.67,r*.05,.20,an,0);
   f.branch([Math.sin(an)*r*.15,r*.15,Math.cos(an)*r*.15],end,r*.012,'#e7e2d0','filament-deutzia');
   for(const sign of [-1,1]){const from=[end[0],L*.80,end[2]],to=[end[0]+Math.cos(an)*sign*r*.06,L*.94,end[2]-Math.sin(an)*sign*r*.06];f.branch(from,to,r*.02,'#e2dfcc','tooth-deutzia-filament');}
   f.add(kit.bud,'anther-deutzia','#cbb47b',...end,r*.052,r*.035,r*.046);
  }
  for(let j=0;j<a.pistilCount;j++){const an=j*TAU/a.pistilCount,end=[Math.sin(an)*r*.12,r*.74,Math.cos(an)*r*.12];f.branch([0,r*.08,0],end,r*.013,'#cdd1b4','style-deutzia');f.add(kit.bud,'stigma-deutzia','#c8caa2',...end,r*.032,r*.025,r*.032);}
 };
 for(const tip of tips){
  if(tip.roll>(compact?.70:shisen?.61:.51))continue;
  // After the early flush, fewer new panicles appear rather than a mass of permanently closed buds.
  if(shisen&&s.month>=7&&tip.roll>s.flowerDensity*.62)continue;
  const n=double?22:shisen?32:18,length=shisen?.070:compact?.085:.11,rad=double?.025:shisen?.034:.020;
  for(let j=0;j<n;j++){
   const t=(j+.5)/n,az=j*2.399963,sy=double?1-2*t:0,R=double?rad*Math.sqrt(1-sy*sy):rad*(1-t*.72),fork=[tip.at[0]+(compact?Math.sin(tip.an)*length*t*.65:0),tip.at[1]+(double?rad:compact?length*(.45*Math.sin(Math.PI*t)-.25*t):length*t),tip.at[2]+(compact?Math.cos(tip.an)*length*t*.65:0)];
   const at=[fork[0]+Math.sin(az)*R,fork[1]+(double?rad*sy:shisen?.014*(1-t):-.010),fork[2]+Math.cos(az)*R];
   b.branch(tip.at,fork,.00055,a.stemColor,'raceme-deutzia');b.branch(fork,at,.00025,a.stemColor,'pedicel-deutzia');flower(at,az,double?Math.acos(sy):shisen?.25+tip.roll*.45:.75+tip.roll*.65,tip.index*37+j);
  }
 }
}
export function viburnumLeafPoint(type,t,u){
 const lobed=type==='viburnumLobed',coarse=type==='viburnumCoarse',small=type==='viburnumObovate',hairy=type==='viburnumHairy';
 let width=Math.pow(Math.sin(Math.PI*t),small?.68:.76)*(small?.55+.75*t:1.16-.36*t);
 if(lobed){
  const outline=[[0,0],[.12,.56],[.32,.90],[.42,1],[.53,.52],[.60,.34],[.76,.44],[1,0]];
  for(let i=1;i<outline.length;i++)if(t<=outline[i][0]){const [x,y]=outline[i-1],[xx,yy]=outline[i];width=y+(yy-y)*(t-x)/(xx-x);break;}
 }
 const teeth=type==='viburnumLaurel'?1:1-(coarse?.14:lobed?.10:small?.025:.075)*(1-Math.abs(Math.sin(t*Math.PI*(coarse?12:18))));
 const relief=(coarse||hairy?.016:.004)*Math.cos(t*Math.PI*20)*Math.abs(u);
 return [u*width*teeth*.5,t,Math.sin(t*Math.PI)*(.035+.08*u*u)+relief];
}
function drawViburnum(b,{info,s,detail,rand},kit){
 const a=info.appearance,typ=a.shootProfile,h=s.height,w=s.spread,small=typ==='reifler',sparse=typ==='otoko',upright=a.habit==='upright',hairy=['carlesii','sterile'].includes(typ),ball=['snowball','sterile'].includes(typ),nodes=[],tips=[],wood=[];
 const count=Math.max(4,Math.round((small?9:sparse?4:6)*detail));
 // Complete the woody skeleton first; leaf fall and fruiting cannot consume its random sequence.
 const shoot=(root,az,rise,reach,order)=>{
  let prev=root;const num=order===0?7:order===1?6:4;
  for(let j=0;j<num;j++){
   const t=(j+1)/num,an=az+.10*Math.sin(t*6+az),at=[root[0]+Math.sin(an)*reach*t,root[1]+rise*(t+.10*Math.sin(Math.PI*t)),root[2]+Math.cos(an)*reach*t];
   wood.push({from:prev,to:at,r:(order===0?.013:order===1?.004:.0014)*Math.max(.5,Math.min(1.7,h))*(1-t*.6),old:order===0&&j<5,order});prev=at;
   nodes.push({at,an:an+j*Math.PI/2,order,t,roll:rand(),size:.78+rand()*.22});
   if(order===0&&j<=5)for(const side of [-1,1]){
    const rest=1-t;shoot(at,an+side*(.65+rand()*.7),h*(upright?.30:.22)*rest,w*(sparse?.21:.19)*(1-.5*t),1);
   }
   if(order===1&&(j===2||j===4))shoot(at,an+(j===2?1:-1)*(.65+rand()*.5),h*.07,w*.10,2);
   if(order>0&&j===num-1)tips.push({at,an,index:tips.length,roll:rand()});
  }
 };
 for(let i=0;i<count;i++){
  const an=i*2.399963+(rand()-.5)*.4,edge=Math.sqrt((i+.5)/count),root=[Math.sin(an)*w*.065*edge,0,Math.cos(an)*w*.065*edge],rise=upright?.77+.20*rand():sparse?.56+.40*rand():.69+.27*rand();
  shoot(root,an,h*rise,w*(upright?.23:.32)*edge,0);
 }
 for(const q of wood){
  b.branch(q.from,q.to,q.r,q.old?a.barkColor:a.stemColor,q.old?'wood-viburnum-'+a.barkPattern:'stem-viburnum');
  if(hairy&&!q.old){const at=q.to;b.branch(at,[at[0]+.001,at[1]+.0006,at[2]],.00005,'#c8c9b8','hair-viburnum-shoot');}
 }
 for(const n of nodes){
  if(n.order===0&&n.t<.65)continue;
  if(s.leafDensity===0){b.add(kit.bud,'bud-viburnum-winter','#88765b',...n.at,.0015,.003,.0015,0,n.an,0);continue;}
  for(let j=0;j<2;j++){
   const roll=(n.roll+j*.381)%1;if(roll>s.leafDensity)continue;
   const an=n.an+j*Math.PI,len=a.leafLength*n.size*(n.order===2?.86:1)*s.leafScale,petiole=len*(typ==='snowball'||typ==='onondaga'?.24:small?.065:.12),at=[n.at[0]+Math.sin(an)*petiole,n.at[1]+petiole*.25,n.at[2]+Math.cos(an)*petiole];
   b.branch(n.at,at,.00065,typ==='otoko'?'#9c6673':a.stemColor,'petiole-viburnum');
   if(typ==='snowball')for(const side of [-1,1]){
    b.add(kit.bud,'gland-viburnum','#9c9d62',at[0]+side*.0015,at[1]-.002,at[2],.0013,.00055,.0013);
    b.add('narrow','stipule-viburnum','#729555',...n.at,.0008,.008,.001,1.1,an+side*.4,0);
   }
   const f=flowerFrame(b,at,.75+roll*.55,an),color=kit.shade(rand,s.leafColor,.055),kind=hairy?'leaf-viburnum-woolly':small||['french','tinus','muffin'].includes(typ)?'leaf-glossy-viburnum':'leaf-viburnum';
   f.add(a.leafShape,kind,color,0,0,0,len*a.leafWidth/a.leafLength,len,len);
   if(a.leafShape==='viburnumLobed')for(const side of [-1,1])f.branch([0,len*.08,len*.008],[side*len*.34,len*.43,len*.05],.00020,'#81916c','vein-viburnum');
   if(hairy||typ==='otoko')for(let k=0;k<4;k++){
    const t=(k+1)/6,side=k%2?1:-1,q=viburnumLeafPoint(a.leafShape,t,side*.8).map((v,i)=>v*len*(i===0?a.leafWidth/a.leafLength:1));
    f.branch(q,[q[0]+.0006*side,q[1],q[2]-.0005],.000035,'#c6cbb9','hair-viburnum-leaf');
   }
  }
 }
 const before=!s.bloom&&a.flowerMonths.includes(s.month===12?1:s.month+1),fruit=a.fruitMonths.includes(s.month);
 if(!s.bloom&&!before&&!fruit)return;
 const floret=(at,pitch,yaw,r,sterile,seed)=>{
  const f=flowerFrame(b,at,pitch,yaw),L=sterile?.0012:a.flowerLength,green=ball&&(before||seed%7===0),col=green?'#ced7aa':s.flowerColor;
  if(before||!sterile&&(seed*.618)%1>s.flowerDensity){f.add(kit.bud,'bud-viburnum-flower',a.flowerPalette.bud,0,L*.4,0,r*.42,L*.7,r*.42);return;}
  f.add('viburnumTube','corolla-viburnum',typ==='carlesii'?'#d4b4b7':col,0,0,0,r,L,r);
  for(let j=0;j<5;j++){
   const an=j*TAU/5;f.add('petal',sterile?'petal-viburnum-sterile':'petal-viburnum-fertile',col,Math.sin(an)*r*.16,L,Math.cos(an)*r*.16,r*.80,r*.92,r,1.42,an,0);
   if(!sterile){const end=[Math.sin(an)*r*.30,L+r*.42,Math.cos(an)*r*.30];f.branch([0,L*.6,0],end,r*.016,'#d3d3b5','filament-viburnum');f.add(kit.bud,'anther-viburnum','#c0b477',...end,r*.065,r*.045,r*.060);}
  }
  if(!sterile)f.add(kit.bud,'stigma-viburnum','#bbca9a',0,L*.4,0,r*.13,r*.11,r*.13);
 };
 for(const tip of tips){
  if(tip.roll>(sparse?.28:small?.42:ball?.30:.31))continue;
  const fruitHead=fruit&&(!s.bloom||tip.index%3===0),R=a.headRadius,stem=sparse?.025:R*.48,center=[tip.at[0],tip.at[1]+stem,tip.at[2]];b.branch(tip.at,center,.0012,a.stemColor,'peduncle-viburnum');
  const n=fruitHead?(sparse?7:19):ball?(typ==='sterile'?135:80):sparse?11:small?23:typ==='carlesii'?54:72;
  for(let j=0;j<n;j++){
   const az=j*2.399963,edge=Math.sqrt((j+.5)/n),sy=ball?1-2*(j+.5)/n:0,rad=ball?R*Math.sqrt(1-sy*sy):R*edge;
   const at=[center[0]+Math.sin(az)*rad,center[1]+(ball?R*sy:sparse?-.022*edge:typ==='carlesii'?R*.65*Math.sqrt(1-edge*edge):R*.20*(1-edge*edge)),center[2]+Math.cos(az)*rad];
   const fork=[center[0]+Math.sin(az)*rad*.45,center[1]+(sparse?-.006:R*.11),center[2]+Math.cos(az)*rad*.45];
   b.branch(center,fork,.00065,sparse?'#b17076':a.stemColor,'rachis-viburnum');b.branch(fork,at,.00030,sparse?'#b17076':a.stemColor,'pedicel-viburnum');
   if(fruitHead){const r=a.fruitRadius,col=typ==='carlesii'&&s.month===9?'#a54c4b':a.fruitColor;b.add(kit.bud,'fruit-glossy-viburnum',col,...at,r,r*(sparse?1.2:1),r*(sparse?.85:1));b.add(kit.bud,'scar-viburnum-fruit','#716b53',at[0],at[1]+r*.9,at[2],r*.20,r*.05,r*.20);continue;}
   floret(at,ball?Math.acos(sy):sparse?Math.PI*.68:typ==='carlesii'?edge*.9:.12+edge*.30,az,a.flowerRadius,ball,tip.index*157+j);
  }
  if(typ==='onondaga'&&!fruitHead)for(let j=0;j<9;j++){
   const az=j*TAU/9,at=[center[0]+Math.sin(az)*R*1.02,center[1],center[2]+Math.cos(az)*R*1.02];b.branch(center,at,.0007,a.stemColor,'pedicel-viburnum');floret(at,.5,az,.012,true,tip.index*9+j);
  }
 }
}
export function abeliaLeafPoint(type,t,u){
 const mos=type==='zabeliaOvate',teeth=mos?1:1-.065*(1-Math.abs(Math.sin(t*Math.PI*11))),width=Math.pow(Math.sin(Math.PI*t),mos?.83:.92)*(1.12-.30*t)*teeth;
 return [u*width*.5,t,.036*Math.sin(t*Math.PI)+.06*u*u*Math.sin(t*Math.PI)+.006*Math.sin(t*35)*u*u];
}
function drawAbelia(b,{info,s,detail,rand},kit){
 const a=info.appearance,typ=a.shootProfile,mos=typ==='mosanensis',compact=a.habit==='rounded',h=s.height,w=s.spread,nodes=[],tips=[],segs=[],count=Math.max(5,Math.round((compact?10:8)*detail));
 // Generate all wood before seasonal organs so winter does not rearrange branches.
 const shoot=(root,az,up,reach,order,index)=>{
  let prev=root;const num=order===0?7:order===1?6:5;
  for(let j=0;j<num;j++){
   const t=(j+1)/num,ang=az+.17*Math.sin(t*5+index),at=[root[0]+Math.sin(ang)*reach*t,root[1]+up*(.80*t+.32*Math.sin(Math.PI*t)),root[2]+Math.cos(ang)*reach*t];
   const radius=(order===0?.007:order===1?.0024:.0010)*Math.max(.5,Math.min(1.5,h))*(1-t*.55);
   segs.push({from:prev,to:at,radius,old:order===0&&j<4,order});prev=at;
   nodes.push({at,an:ang+j*Math.PI/2,t,order,roll:rand(),size:.8+.2*rand()});
   if(order===0&&j<=4)for(const sign of [-1,1])shoot(at,ang+sign*(.60+rand()*.35),up*(1-t)*(.46+rand()*.15),w*.17*(.7+rand()*.4),1,index+j+sign);
   if(order===1&&(j===2||j===4))shoot(at,ang+(j===2?1:-1)*(.68+rand()*.25),up*.20,w*.09*(.7+rand()*.5),2,index+j);
   if(order>0&&j===num-1)tips.push({at,an:ang,index:tips.length,roll:rand()});
  }
 };
 for(let i=0;i<count;i++){
  const an=i*2.399963,edge=Math.sqrt(i/count),root=[Math.sin(an)*w*.065*edge,0,Math.cos(an)*w*.065*edge],height=h*(compact?1-.66*edge:.45+.52*rand());
  shoot(root,an,height,w*(compact?.24:.30)*(1+.1*rand()),0,i);
 }
 for(const q of segs){
  b.branch(q.from,q.to,q.radius,q.old?a.barkColor:a.stemColor,q.old?(mos?'wood-zabelia-sixGrooves':'wood-abelia-old'):'stem-abelia');
  if(!q.old&&q.order===1){const mid=q.from.map((v,i)=>(v+q.to[i])*.5);b.branch(mid,[mid[0]+.001,mid[1]+.0008,mid[2]],.000045,'#b8b09e','hair-abelia-shoot');}
 }
 const leafyNodes=[];
 for(const n of nodes){
  leafyNodes.push(n);
  if(n.order>0){let prev=n.at;for(let k=1;k<=1;k++){const az=n.an+.65,at=[n.at[0]+Math.sin(az)*a.leafLength*.27*k,n.at[1]+a.leafLength*.18*k,n.at[2]+Math.cos(az)*a.leafLength*.27*k];b.branch(prev,at,.0006,a.stemColor,'stem-abelia');prev=at;leafyNodes.push({...n,at,an:n.an+k*Math.PI/2,size:n.size*(1-.12*k)});}}
 }
 for(const n of leafyNodes){
  if(n.order===0&&n.t<.36)continue;
  const young=n.t>.8&&s.month>=3&&s.month<=9,whorl=!mos&&n.order===0&&n.t>.7?3:2;
  for(let j=0;j<whorl;j++){
   const az=n.an+j*TAU/whorl,len=a.leafLength*n.size*(n.order===0?1:.84)*(young?.75:1),roll=(n.roll+j*.381)%1;
   if(s.leafDensity===0||roll>s.leafDensity)continue;
   const petiole=len*(mos?.045:.07),at=[n.at[0]+Math.sin(az)*petiole,n.at[1]+petiole*.3,n.at[2]+Math.cos(az)*petiole];b.branch(n.at,at,.0004,a.stemColor,'petiole-abelia');
   const f=flowerFrame(b,at,.72+roll*.60,az),color=typ==='bronze'&&young?a.springShootColor:s.leafColor,shade=kit.shade(rand,color,.045),kind=a.leafPattern?`leaf-abelia-margin-${s.leafPatternColor}-${typ==='lucky'?'narrow':'wide'}`:'leaf-abelia-glossy';
   f.add(a.leafShape,kind,shade,0,0,0,len*a.leafWidth/a.leafLength,len,len);
   if(mos)for(let k=0;k<5;k++){const t=(k+.4)/5,side=k%2?1:-1,q=abeliaLeafPoint(a.leafShape,t,side).map((v,i)=>v*len*(i===0?a.leafWidth/a.leafLength:1));f.branch(q,[q[0]+side*.00035,q[1],q[2]+.00025],.00004,'#c6c9b8','hair-zabelia-leaf');}
  }
  if(s.leafDensity===0)b.add(kit.bud,'bud-abelia-winter','#897263',...n.at,.0008,.0020,.0008,0,n.an,0);
 }
 const first=Math.min(...a.flowerMonths),after=s.month>Math.max(...a.flowerMonths)||mos&&s.month>=7,persistent=s.month>=first;
 if(!s.bloom&&!persistent)return;
 const flower=(at,az,pitch,seed)=>{
  const f=flowerFrame(b,at,pitch,az),L=a.flowerLength,r=a.flowerRadius,sepals=mos?5:[2,3,5][seed%3],spent=after||!s.bloom||seed%7===0,col=typ==='magic'&&seed%3===0?'#d9bccb':s.flowerColor;
  f.add(kit.bud,'ovary-abelia','#988577',0,-L*.12,0,r*.18,L*.22,r*.18);
  for(let j=0;j<sepals;j++)f.add('petal','calyx-abelia',a.flowerPalette.sepal,0,0,0,L*.20,L*.48,L*.25,1.12,j*TAU/sepals,0);
  if(spent)return;
  if((seed*.618)%1>s.flowerDensity){f.add(kit.bud,'bud-abelia-flower',a.flowerPalette.bud,0,L*.46,0,r*.32,L*.57,r*.32);return;}
  f.add(mos?'zabeliaTube':'abeliaTube','corolla-abelia',mos?a.flowerPalette.outside:col,0,0,0,r,L*.81,r);
  for(let j=0;j<5;j++){
   const an=j*TAU/5,lower=j<3,size=mos&&lower?1.12:1;
   f.add('petal','petal-abelia',col,Math.sin(an)*r*.34,L*.80,Math.cos(an)*r*.34,r*.78*size,r*.78*size,r,1.26,an,0);
  }
  for(let j=0;j<4;j++){
   const an=j*TAU/4,end=[Math.sin(an)*r*.19,L*(j<2?.92:.84),Math.cos(an)*r*.19];f.branch([0,L*.39,0],end,r*.018,'#e2d9c8','filament-abelia');f.add(kit.bud,'anther-abelia','#c6b9a0',...end,r*.045,r*.10,r*.045);
  }
  f.branch([0,L*.18,0],[r*.045,L*.98,0],r*.016,'#cbd0b4','style-abelia');f.add(kit.bud,'stigma-abelia','#c5c7ac',r*.045,L*.98,0,r*.040,r*.035,r*.040);
  if(!mos)for(let j=0;j<7;j++){const an=j*TAU/7,q=[Math.sin(an)*r*.29,L*.69,Math.cos(an)*r*.29];f.branch(q,[q[0]*.9,L*.80,q[2]*.9],.000025,'#ece8e0','hair-abelia-throat');}
 };
 for(const tip of tips){
  if(!mos&&tip.roll>.68||after&&tip.roll>.46)continue;
  const n=mos?9:3,rad=mos?.017:.009;
  for(let j=0;j<n;j++){
   const az=tip.an+j*2.399963,reach=rad*Math.sqrt((j+1)/n),q=[tip.at[0]+Math.sin(az)*reach,tip.at[1]+rad*.4*(1-j/n),tip.at[2]+Math.cos(az)*reach];
   b.branch(tip.at,q,.00045,a.stemColor,'pedicel-abelia');flower(q,az,mos?.4+j/n*1.0:.95+tip.roll*.7,tip.index*17+j);
  }
 }
}


export function calaminthaLeafPoint(type,t,u){
 const large=type==='calaminthaLarge',teeth=large?8:5,edge=1-(large?.075:.035)*(1-Math.abs(Math.sin(t*Math.PI*teeth)));
 const width=Math.pow(Math.sin(Math.PI*t),.65)*(.99-.17*t)*edge;
 return [u*width*.5,t,.037*Math.sin(Math.PI*t)+.025*u*u*Math.sin(Math.PI*t)+.006*Math.cos(t*teeth*Math.PI*2)*u*u];
}
function drawCalamintha(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,typ=a.shootProfile,large=['grandiflora','variegata'].includes(typ),winter=[12,1,2].includes(s.month),rest=winter&&!s.bloom,low=rest&&a.persistence==='semiDormant',h=s.height,w=s.spread,L=a.leafLength*s.leafScale,green=s.leafColor;
 const stem=(from,to,r,color,kind)=>{const dir=new THREE.Vector3(...to).sub(new THREE.Vector3(...from)),len=dir.length(),rot=new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()),'YXZ');b.add('squareStem',kind,color,...from,r,len,r,rot.x,rot.y,rot.z);};
 const leaf=(at,an,len,young=false)=>{
  const tip=[at[0]+Math.sin(an)*len*.15,at[1]+len*.045,at[2]+Math.cos(an)*len*.15];b.branch(at,tip,.0004,a.stemColor,'petiole-calamintha');
  const f=flowerFrame(b,tip,.84+rand()*.62,an),kind=typ==='variegata'?`leaf-calamintha-marble-${Math.floor(rand()*3)}`:'leaf-calamintha-hairy';
  f.add(a.leafShape,kind,kit.shade(rand,young?'#946f6c':green,.035),0,0,0,len*a.leafWidth/a.leafLength,len,len);
  for(let k=0;k<9;k++){const t=(k+.4)/9,side=k%2?1:-1,q=calaminthaLeafPoint(a.leafShape,t,side).map((v,i)=>v*len*(i===0?a.leafWidth/a.leafLength:1));f.branch(q,[q[0]+side*.00030,q[1],q[2]+.00018],.000025,'#c9cdba','hair-calamintha');}
 };
 const flower=(at,an)=>{
  const len=a.flowerLength,r=a.flowerRadius,f=flowerFrame(b,at,1.0+rand()*.48,an),color=s.flowerColor;
  f.add('calaminthaTube','calyx-calamintha','#849d72',0,0,0,r*.62,len*.44,r*.62);
  for(let j=0;j<5;j++){const ang=j*TAU/5,lower=j<2;f.add('narrow','calyxTooth-calamintha','#849d72',Math.sin(ang)*r*.14,len*.32,Math.cos(ang)*r*.14,r*.15,len*(lower?.21:.12),r,.20,ang,0);}
  for(let j=0;j<8;j++){const an=j*TAU/8,q=[Math.sin(an)*r*.14,len*.39,Math.cos(an)*r*.14];f.branch(q,[q[0]*1.6,len*.47,q[2]*1.6],.000022,'#e1decf','calyxHair-calamintha');}
  if(!s.bloom||rand()>s.flowerDensity){f.add(kit.bud,'bud-calamintha',color,0,len*.52,0,r*.23,len*.25,r*.20);return;}
  f.add('calaminthaTube','corolla-calamintha',color,0,len*.25,0,r,len*.69,r);
  for(const sign of [-1,1])f.add('petal','upperLip-calamintha',color,sign*r*.055,len*.92,-r*.14,r*.39,r*.51,r,-.63,sign*.10,0);
  for(const j of [-1,0,1])f.add('broadRuffledPetal','petal-calamintha-spots',color,j*r*.20,len*.94,r*.12,r*(j===0?.65:.42),r*(j===0?.85:.53),r,1.0,j*.48,0);
  for(let k=0;k<4;k++){
   const sign=k%2?1:-1,end=[sign*r*(k<2?.10:.18),len*(k<2?.99:.88),-r*.07];f.branch([sign*r*.10,len*.68,-r*.05],end,r*.014,'#c8beca','filament-calamintha');f.add(kit.bud,'anther-calamintha','#d7cfdd',...end,r*.038,r*.025,r*.048);
  }
  f.branch([0,len*.7,0],[0,len*1.06,0],r*.010,'#c9bed1','style-calamintha');
  for(const sign of [-1,1])f.branch([0,len*1.06,0],[sign*r*.055,len*(sign<0?1.14:1.10),r*.015],r*.007,'#c9bed1','stigma-calamintha');
 };
 if(low){
  for(let i=0;i<11;i++){const an=i*2.399963,at=[Math.sin(an)*w*.17*Math.sqrt(i/11),.004,Math.cos(an)*w*.17*Math.sqrt(i/11)];for(let k=0;k<4;k++)leaf(at,an+k*Math.PI/2,Math.min(.009,a.leafLength*.3),true);}return;
 }
 const count=Math.max(5,Math.round((large?11:15)*detail)),scale=s.bloom?1:rest?.40:s.shootScale;
 const shoot=(root,az,length,reach,order)=>{
  let prev=root;const nodes=large?5:7;
  for(let j=0;j<nodes;j++){
   const t=(j+.45+rand()*.35)/nodes,ang=az+.20*Math.sin(t*5+az),at=[root[0]+Math.sin(ang)*reach*t,root[1]+length*t,root[2]+Math.cos(ang)*reach*t];stem(prev,at,(large?.0011:.0007)*(1-t*.50),a.stemColor,'stem-calamintha');prev=at;
   for(const sign of [-1,1])if(j===0||rand()<s.leafDensity)leaf(at,ang+j*Math.PI/2+sign*Math.PI/2,L*(1-(large?.28:.48)*t)*(order?.90:1));
   if(order===0&&j<(large?2:3)&&!rest)for(const sign of [-1,1])shoot(at,ang+sign*(.72+rand()*.22),length*(1-t)*(.58+.20*rand()),w*(large?.20:.16)*(1-t*.4),1);
   if((s.bloom||s.flowerBuds)&&t>(large?.48:.30))for(const sign of [-1,1]){
    const aa=ang+sign*Math.PI/2,reach=large?.012:typ==='pink'?.045:.022,tip=[at[0]+Math.sin(aa)*reach,at[1]+reach*.25,at[2]+Math.cos(aa)*reach];b.branch(at,tip,.00030,a.stemColor,'cyme-calamintha');
    const n=typ==='pink'?2:large?2:4;for(let k=0;k<n;k++){
     const an=aa+(k-(n-1)/2)*.5,end=[tip[0]+Math.sin(an)*a.flowerLength*.35,tip[1]+k*a.flowerLength*.18,tip[2]+Math.cos(an)*a.flowerLength*.35];b.branch(tip,end,.00023,a.stemColor,'pedicel-calamintha');flower(end,an);
    }
   }
  }
 };
 for(let i=0;i<count;i++){
  const an=i*2.399963,edge=Math.sqrt(i/count),rad=w*(large?.18:.13)*edge,root=[Math.sin(an)*rad,.006,Math.cos(an)*rad];shoot(root,an,h*(large?1-.50*edge:(typ==='blue'?.94-.34*edge:.65+.30*rand()))*scale,w*(large?.24:.19)*scale,0);
 }
}

export function lysimachiaLeafPoint(type,t,u){
 const coin=type==='lysimachiaCoin',ovate=type==='lysimachiaOvate',breadth=Math.pow(Math.sin(Math.PI*t),coin?.50:ovate?.65:.86)*(ovate?1.18-.38*t:1);
 return [u*breadth*.5,t,.042*Math.sin(Math.PI*t)+.024*u*u*Math.sin(Math.PI*t)+.004*Math.sin(23*t)*Math.abs(u)];
}
function drawLysimachia(b,{info,s,view,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,typ=a.shootProfile,tall=['alexander','firecracker'].includes(typ),cold=[12,1,2,3].includes(view.month),rosette=typ==='firecracker'&&cold,h=s.height,w=s.spread,L=a.leafLength*s.leafScale,green=s.leafColor;
 const young=[3,4].includes(view.month),leaf=(at,an,len,shape=a.leafShape,pitch=null)=>{
  const end=[at[0]+Math.sin(an)*len*.13,at[1]+len*.065,at[2]+Math.cos(an)*len*.13];b.branch(at,end,.00065,a.stemColor,'petiole-lysimachia');
  const age=Math.floor(rand()*3),kind=`leaf-lysimachia-${typ}-${young?'spring':'summer'}-${age}`,width=shape==='lysimachiaCoin'?len:len*a.leafWidth/a.leafLength;
  b.add(shape,kind,kit.shade(rand,green,.04),...end,width,len,len,pitch??(.88+rand()*.78),an,(rand()-.5)*.13);
  if(typ==='firecracker')for(let k=0;k<6;k++){const t=(k+.5)/6,q=at.map((v,i)=>v+(end[i]-v)*t);b.branch(q,[q[0]+.0008,q[1]+.0005,q[2]],.00007,'#c3b9a3','petioleHair-lysimachia');}
 };
 const flower=(pt,pitch,yaw)=>{
  const r=a.flowerRadius,f=flowerFrame(b,pt,pitch,yaw);
  if(!s.bloom||rand()>s.flowerDensity){f.add(kit.bud,'bud-lysimachia','#a4b270',0,0,0,r*.25,r*.35,r*.25);return;}
  f.add('tube','corollaBase-lysimachia','#cdac40',0,-r*.15,0,r*.14,r*.27,r*.14);
  for(let k=0;k<5;k++){
   f.add('lysimachiaCorolla','petal-lysimachia',kit.shade(rand,s.flowerColor,.025),0,0,0,r,r,r,0,k*TAU/5,0);
   f.add('narrow','sepal-lysimachia','#718858',0,-r*.12,0,r*.22,r*.58,r,1.18,k*TAU/5+.24,0);
   const an=k*TAU/5,tip=[Math.sin(an)*r*.16,r*.33,Math.cos(an)*r*.16];f.branch([Math.sin(an)*r*.07,0,Math.cos(an)*r*.07],tip,r*.013,'#e5d477','filament-lysimachia');f.add(kit.bud,'anther-lysimachia','#cebd64',...tip,r*.066,r*.078,r*.044);
  }
  f.branch([0,0,0],[r*.025,r*.44,0],r*.017,'#bdba60','style-lysimachia');f.add(kit.bud,'stigma-lysimachia','#d1c777',r*.025,r*.44,0,r*.026,r*.027,r*.026);
 };
 if(rosette){
  const crowns=Math.max(4,Math.round(9*detail));for(let i=0;i<crowns;i++){const an=i*2.399963,reach=w*.28*Math.sqrt(i/crowns),root=[Math.sin(an)*reach,.004,Math.cos(an)*reach];for(let k=0;k<14;k++)if(k===0||rand()<s.leafDensity)leaf(root,an+k*2.399963,.027*(.65+.35*rand()),'lysimachiaCoin',.75+rand()*.68);}return;
 }
 if(tall){
  const n=Math.max(4,Math.round((typ==='alexander'?11:9)*detail));
  for(let i=0;i<n;i++){
   const an=i*2.399963,rr=Math.max(0,w*.40-L)*Math.sqrt(i/n),root=[Math.sin(an)*rr,.005,Math.cos(an)*rr],hh=h*(i===0?.96:.64+rand()*.30)*s.shootScale,bend=(rand()-.5)*w*.20,nodes=typ==='alexander'?13:10;let prev=root;
   for(let j=0;j<nodes;j++){
    const t=(j+.60+rand()*.38)/nodes,at=[root[0]+Math.sin(an)*bend*t*t,hh*t,root[2]+Math.cos(an)*bend*t*t];b.branch(prev,at,.0020*(1-t*.56),a.stemColor,'stem-lysimachia');prev=at;
    const whorl=typ==='alexander'?3+j%2:2,az=an+j*Math.PI/2+(rand()-.5)*.35;
    for(let k=0;k<whorl;k++){
     const ang=az+k*TAU/whorl;if(rand()<s.leafDensity)leaf(at,ang,L*(.65+.35*(1-t)));
     if((s.bloom||s.flowerBuds)&&t>(typ==='alexander'?.35:.47)){
      const long=typ==='firecracker',reach=long?.035+rand()*.037:.009+rand()*.009,end=[at[0]+Math.sin(ang)*reach,at[1]+(long?.003:.012),at[2]+Math.cos(ang)*reach];b.branch(at,end,.0006,a.stemColor,'pedicel-lysimachia');flower(end,long?1.42+rand()*.45:.70+rand()*.65,ang);
     }
    }
   }
  }return;
 }
 const paths=Math.max(5,Math.round(16*detail)),nodes=Math.max(5,Math.min(18,Math.round(w/(typ==='aurea'?.035:.045)))),arms=[];
 const trail=(root,an,reach,steps,lift)=>{
  let prev=root;for(let j=0;j<steps;j++){
   const t=(j+1)/steps,az=an+.26*Math.sin(t*4.5+an),at=[root[0]+Math.sin(az)*reach*t,.009+Math.sin(t*Math.PI/2)*lift,root[2]+Math.cos(az)*reach*t];b.branch(prev,at,.0011,a.stemColor,'runner-lysimachia');prev=at;
   const len=L*(.62+.38*Math.sin(Math.PI*t*.88));for(const sign of [-1,1])if(j===steps-1||rand()<s.leafDensity)leaf(at,az+sign*Math.PI/2,len,'lysimachia'+(typ==='aurea'?'Coin':'Ovate'),1.0+rand()*.55);
   if(j===Math.floor(steps*.5)&&steps>5)arms.push({root:at,an:az+(rand()<.5?-1:1)*1.0,reach:reach*.33});
   if(typ==='aurea'&&(s.bloom||s.flowerBuds)&&j%3===0){const end=[at[0]+Math.sin(az)*.014,at[1]+.009,at[2]+Math.cos(az)*.014];b.branch(at,end,.0005,a.stemColor,'pedicel-lysimachia');flower(end,.15+rand()*.55,az);}
   if(typ!=='aurea'&&j===steps-1&&(s.bloom||s.flowerBuds))for(let k=0;k<4;k++){
    const aa=az+k*2.4,end=[at[0]+Math.sin(aa)*.014,at[1]+.008+k*.0015,at[2]+Math.cos(aa)*.014];b.branch(at,end,.0005,a.stemColor,'pedicel-lysimachia');flower(end,.12+rand()*.5,aa);
   }
  }
 };
 for(let i=0;i<paths;i++){const an=i*2.399963+(rand()-.5)*.3;trail([0,.008,0],an,Math.max(.02,w*.48-L*.45)*(.65+.35*rand()),nodes,Math.max(.004,h-L*.35-a.flowerRadius)*(.55+.4*rand()));}
 for(const arm of arms)trail(arm.root,arm.an,arm.reach,4,Math.max(.004,h*.45));
}

export function delphiniumLeafPoint(type,t,angle){
 const fine=type==='delphiniumFinePalm',lobes=fine?[-2.2,-1.1,0,1.1,2.2]:[-2.4,-1.6,-.8,0,.8,1.6,2.4];
 const near=Math.min(...lobes.map(v=>Math.abs(v-angle))),core=Math.exp(-Math.pow(near/(fine?.16:.22),2));
 const divisions=Math.max(Math.exp(-Math.pow((near-.18)/.05,2)),Math.exp(-Math.pow((near-.30)/.05,2)));
 const lobe=Math.max(core,divisions*(fine?.67:0)),tooth=1-.09*Math.pow(Math.max(0,Math.cos(angle*43)),4);
 const notch=1-.96*Math.exp(-Math.pow((Math.abs(angle)-Math.PI)/.20,2)),edge=(.72+.28*Math.cos(angle))*(fine?.13+.87*lobe:.26+.74*lobe)*tooth*notch;
 const r=t*edge;return [Math.sin(angle)*r*1.12,Math.cos(angle)*r,.045*t*t+.012*Math.cos(angle*7)*t*t];
}

function drawDelphinium(b,{info,s,p,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,typ=a.shootProfile,fine=a.flowerPalette.open,h=s.height,w=s.spread,L=Math.min(a.leafLength,w*.36)*s.leafScale;
 const green=s.leafColor,palette=a.flowerPalette,color=a.flowerOptions?.[p.id%a.flowerOptions.length]||s.flowerColor,heads=typ==='pacific'?3:5;
 const leaf=(base,an,len,pitch)=>{
  const end=[base[0]+Math.sin(an)*len*.45,base[1]+len*.24,base[2]+Math.cos(an)*len*.45];b.branch(base,end,.0012,green,'petiole-delphinium');
  b.add(a.leafShape,'leaf-delphinium',kit.shade(rand,green,.045),...end,len*a.leafWidth/a.leafLength,len,len,pitch,an,(rand()-.5)*.16);
 };
 const basal=Math.max(10,Math.round(23*detail));
 for(let j=0;j<basal;j++)if(j===0||rand()<s.leafDensity){const an=j*2.399963;leaf([Math.sin(an)*w*.09,.012,Math.cos(an)*w*.09],an,L*(.6+.4*rand()),.48+rand()*.92);}
 if(!s.bloom&&!s.flowerBuds)return;
 const flower=(pt,an,r,young,progress)=>{
  const f=flowerFrame(b,pt,Math.PI/2-.18,an),spurScale=fine?1.1:.82;
  if(young){
   f.add(kit.bud,'bud-delphinium',palette.bud,0,r*.05,0,r*.30,r*.40,r*.30,.4,0,0);
   f.add('delphiniumSpur','spur-bud-delphinium',palette.bud,0,-r*.15,-r*.10,r*.8,r*.8*spurScale,r*.8);return;
  }
  const shadeColor=typ==='green'?new THREE.Color(color).lerp(new THREE.Color('#b9cba0'),Math.max(0,progress-.3)*.42):color;
  const angles=[Math.PI,Math.PI-1.13,Math.PI+1.13,-.63,.63],kind=typ==='green'?'sepal-delphinium-greenedge':'sepal-delphinium';
  for(let layer=0;layer<a.flowerLayers;layer++)for(let j=0;j<5;j++){
   const size=r*(1-layer*.18),az=angles[j]+layer*.42;f.add('broadRuffledPetal',kind,kit.shade(rand,shadeColor,.025),0,layer*r*.035,0,size*(fine?.91:1.03),size,size,1.15-layer*.19,az,0);
  }
  f.add('delphiniumSpur','spur-delphinium',color,0,-r*.10,-r*.15,r,r*spurScale,r);
  const hasBee=typ!=='green'||rand()>.35;
  if(hasBee){
   for(const sign of [-1,1]){
    f.add('petal','petal-delphinium-upper',palette.bee,sign*r*.055,r*.12,-r*.015,r*.15,r*.25,r,.95,Math.PI+sign*.28,0);
    f.add('broadRuffledPetal','petal-delphinium-bee',palette.bee,sign*r*.045,r*.13,r*.02,r*.22,r*.36,r,1.12,sign*.38,0);
    for(let k=0;k<9;k++){const y=r*(.15+.13*k/9),x=sign*r*(.04+.055*k/9),z=r*(.07+.15*k/9);f.branch([x,y,z],[x+sign*r*.020,y+r*.035,z+r*.014],r*.0035,palette.bee,'beard-delphinium');}
   }
  }
  for(let j=0;j<18;j++){const an=j*2.399;f.add(kit.bud,'anther-delphinium','#9d9379',Math.sin(an)*r*.075,r*.16,Math.cos(an)*r*.075,r*.017,r*.018,r*.022);}
 };
 for(let i=0;i<heads;i++){
  const az=i*2.399963,root=[Math.sin(az)*w*.055,.008,Math.cos(az)*w*.055],reach=w*(i===0?.02:.18),height=h*(i===0?.96:.76+rand()*.16)*(s.flowerBuds?.65:1),top=[Math.sin(az)*reach,height,Math.cos(az)*reach];
  const length=Math.min(a.inflorescenceLength,height*.56),start=height-length;let prev=root;
  for(let k=1;k<=10;k++){
   const t=k/10,at=[root[0]+(top[0]-root[0])*t,height*t,root[2]+(top[2]-root[2])*t];b.branch(prev,at,.0035*(1-t*.6),a.stemColor,'stem-delphinium');prev=at;
   if(t<(fine?.67:.52))leaf(at,az+k*2.399963,L*(1-t*.62),.66+rand()*.82);
  }
  const n=Math.max(14,Math.round((fine?36:typ==='pacific'?62:74)*detail));
  for(let j=0;j<n;j++){
   const t=(j+.4)/n,an=j*2.399963+az,yy=start+length*t,axis=[root[0]+(top[0]-root[0])*yy/height,yy,root[2]+(top[2]-root[2])*yy/height];
   const rr=a.flowerRadius*(.82+.18*(1-t)),ped=rr*(fine?1.2:.83)*(1-t*.35)*(.84+.32*rand()),end=[axis[0]+Math.sin(an)*ped,yy+rr*.13,axis[2]+Math.cos(an)*ped];
   b.branch(axis,end,.00075,a.stemColor,'pedicel-delphinium');
   if(j%3===0)b.add('narrow','bract-delphinium',green,...axis,rr*.18,rr*.80,rr,.60,an,0);
   const young=s.flowerBuds||t>.80||t>.40&&rand()>s.flowerDensity;flower(end,an,rr,young,t);
  }
 }
}

export function saxifrageLeafPoint(type,t,angle){
 const sax=type==='saxifrageCordate',round=type==='bergeniaRound';
 const notch=1-.92*Math.exp(-Math.pow((Math.abs(angle)-Math.PI)/(sax?.19:round?.22:.10),2));
 const scallop=1-(sax?.085:.024)*Math.pow(Math.max(0,Math.cos(angle*(sax?9:26))),4);
 const edge=(.58+.42*Math.cos(angle))*notch*scallop;
 const r=t*edge,x=Math.sin(angle)*r*(sax?1.25:round?1.17:.92),y=Math.cos(angle)*r;
 const vein=Math.cos(angle*(sax?7:6)),fold=(round?.040:.025)*vein*t*t;
 return [x,y,.11*t*t+fold+.019*Math.sin(angle*17)*t*t];
}

function drawSaxifragaceae(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,typ=a.shootProfile,sax=a.architecture==='saxifrageRosettes',h=s.height,w=s.spread;
 const L=Math.min(a.leafLength,w*(sax?.22:.44))*s.leafScale,stem=a.stemColor,crowns=[];
 const leaf=(base,an,size,age)=>{
  const rise=sax?Math.min(h*a.foliageHeightRatio,size*.48):Math.min(h*a.foliageHeightRatio*.60,L*.85)*(1-age*.85),tip=[base[0]+Math.sin(an)*size*.13,base[1]+rise,base[2]+Math.cos(an)*size*.13];
  b.branch(base,tip,sax?.0009:.0032,stem,sax?'petiole-saxifrage':'petiole-bergenia');
  const f=flowerFrame(b,tip,(sax?.65:.30)+age*(sax?.90:1.20)+(rand()-.5)*.18,an),ratio=a.leafWidth/a.leafLength;
  const kind=sax?`leaf-saxifrage-${typ}-${age>.7?'green':age<.22?'pale':'variegated'}`:typ==='dumbo'?'leaf-bergenia-hairy':'leaf-bergenia-glossy';
  f.add(a.leafShape,kind,kit.shade(rand,s.leafColor,.045),0,0,0,size*ratio,size,size);
  if(sax||typ==='dumbo')for(let j=0;j<26;j++){
   const angle=-Math.PI+(j+.3)*TAU/26,p=saxifrageLeafPoint(a.leafShape,1,angle),q=p.map((v,k)=>v*size*(k===0?ratio:1));
   f.branch(q,[q[0]+Math.sin(angle)*.0011,q[1]+Math.cos(angle)*.0011,q[2]+.0007],.00009,'#bac3a8',sax?'hair-saxifrage':'hair-bergenia');
  }
 };
 const n=sax?7:4;
 for(let i=0;i<n;i++){
  const az=i*2.399963,reach=i===0?0:Math.max(0,w*.48-L*.76)*Math.sqrt(i/n),at=[Math.sin(az)*reach,.010,Math.cos(az)*reach];crowns.push(at);
  if(i){
   if(sax){const prev=[0,.012,0];for(let k=1;k<=6;k++){const t=k/6,p=[at[0]*t,.014+.006*Math.sin(t*Math.PI),at[2]*t];b.branch(prev,p,.0007,stem,'runner-saxifrage');prev.splice(0,3,...p);}}
   else b.branch([0,.017,0],at,.009,'#89694f','rhizome-bergenia');
  }
  const count=Math.max(4,Math.round((sax?7:8)*detail));
  for(let j=0;j<count;j++)if(j===0||rand()<s.leafDensity)leaf(at,j*2.399963+az,L*(.53+.47*j/count)*(sax&&i>3?.72:1),j/count);
 }
 if(!s.bloom&&!s.flowerBuds)return;
 const heads=Math.max(2,Math.round((sax?5:typ==='snow'?7:5)*detail)),r=a.flowerRadius;
 const flower=(pt,pitch,yaw,young=false)=>{
  const f=flowerFrame(b,pt,pitch,yaw),calyx=sax?'#8a6571':typ==='snow'?'#8ba76e':'#9b5066';
  if(young){f.add(kit.bud,sax?'bud-saxifrage':'bud-bergenia',calyx,0,r*.2,0,r*.19,r*.28,r*.19);return;}
  if(sax){
   for(const sign of [-1,1])f.add('narrow','petal-saxifrage-long','#eeeade',0,0,0,r*.36,r*(sign<0?1.35:1.18),r,1.58,sign*.34,0);
   for(const an of [Math.PI-.75,Math.PI,Math.PI+.75])f.add('petal','petal-saxifrage-spotted','#eeeade',0,0,0,r*.38,r*.32,r,1.48,an,0);
  }else{
   f.add('tube','calyx-bergenia',calyx,0,-r*.40,0,r*.39,r*.48,r*.39);
   for(let k=0;k<5;k++){
    f.add('petal','petal-bergenia',kit.shade(rand,s.flowerColor,.025),0,0,0,r*.86,r*.91,r,.82,k*TAU/5,0);
    if(typ==='sakura')f.add('petal','petal-bergenia-inner',s.flowerColor,0,r*.05,0,r*.40,r*.53,r,.53,k*TAU/5+.35,.12);
   }
  }
  for(let k=0;k<5;k++)f.add('narrow',sax?'sepal-saxifrage':'sepal-bergenia',calyx,0,-r*.12,0,r*.30,r*.42,r,sax?1.9:.47,k*TAU/5,0);
  f.add(kit.bud,sax?'ovary-saxifrage':'ovary-bergenia',sax?'#ceca99':typ==='snow'?'#a6b380':'#a9687e',0,r*.07,0,r*.18,r*.18,r*.18);
  for(let k=0;k<10;k++){
   const an=k*TAU/10,end=[Math.sin(an)*r*(sax?.34:.25),r*(sax?.27:.40),Math.cos(an)*r*(sax?.34:.25)];
   f.branch([0,0,0],end,r*.009,typ==='dumbo'?'#aa637e':'#d9c9cb',sax?'filament-saxifrage':'filament-bergenia');
   f.add(kit.bud,sax?'anther-saxifrage':'anther-bergenia',sax?'#bd8f92':typ==='snow'?'#b4ac89':'#a48386',...end,r*.034,r*.027,r*.038);
  }
  for(const sign of [-1,1])f.branch([sign*r*.055,r*.07,0],[sign*r*.12,r*(sax?.31:.37),0],r*.014,'#b8b48b',sax?'style-saxifrage':'style-bergenia');
 };
 for(let i=0;i<heads;i++){
  const root=crowns[i%crowns.length],az=i*2.399963,top=[root[0]+Math.sin(az)*w*.04,h*(.77+rand()*.18),root[2]+Math.cos(az)*w*.04];
  b.branch(root,top,sax?.0010:.0035,stem,sax?'scape-saxifrage':'scape-bergenia');
  const branches=sax?7:6;
  for(let j=0;j<branches;j++){
   const t=(j+.4)/branches,an=az+j*2.399963,reach=(sax?Math.min(.11,w*.25):Math.min(.08,w*.21))*(1-t*.65),base=[top[0],top[1]*(sax?.55+t*.40:.77+t*.18),top[2]],end=[base[0]+Math.sin(an)*reach,base[1]+h*.07,base[2]+Math.cos(an)*reach];
   b.branch(base,end,sax?.00045:.0014,stem,sax?'panicle-saxifrage':'panicle-bergenia');
   for(let k=0;k<(sax?3:5);k++){
    const aa=an+k*2.4,rr=r*(sax?1.3:1.9),pt=[end[0]+Math.sin(aa)*rr,end[1]+(k/5-.3)*rr,end[2]+Math.cos(aa)*rr];
    b.branch(end,pt,sax?.00028:.0007,stem,sax?'pedicel-saxifrage':'pedicel-bergenia');flower(pt,sax?Math.PI/2+.15:.3+rand()*1.15,aa,s.flowerBuds||rand()>s.flowerDensity);
   }
  }
 }
}

export function agapanthusPoint(type,t,u){
 if(type==='leaf'){
  const breadth=(.45+.55*Math.sin(Math.PI*Math.min(.95,t*1.07))**.35)*(t>.89?Math.sqrt((1-t)/.11):1);
  return [u*breadth*.5,1.78*t-.82*t*t,.20*t+.68*t*t+u*u*.03*Math.sin(Math.PI*t)];
 }
 const closed=type==='closed',angle=u*Math.PI/(type==='diamond'?12:6),opening=Math.max(0,(t-.46)/.54),taper=t<.55?1:Math.pow(Math.max(0,Math.cos((t-.55)/.45*Math.PI/2)),.52);
 const radius=closed?.08+.53*Math.pow(Math.sin(Math.PI*t),1.35):.065+.18*t*t+.42*opening*opening;
 return [Math.sin(angle*taper)*radius,t-(closed?0:.12*opening*opening),Math.cos(angle*taper)*radius];
}

function drawAgapanthus(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,type=a.shootProfile,h=s.height,w=s.spread,green=s.leafColor,L=Math.min(a.leafLength,w*.55)*s.leafScale,stem=a.stemColor;
 const crowns=[],n=Math.max(3,Math.round((type==='summer'?7:5)*detail));
 const leafKind=type==='silver'&&[3,4,5,6,7].includes(s.month)?'leaf-agapanthus-margin':'leaf-agapanthus'+(type==='northern'?'-purplebase':'');
 for(let i=0;i<n;i++){
  const az=i*2.399963,rr=w*.13*Math.sqrt((i+.2)/n),at=[Math.sin(az)*rr,.008,Math.cos(az)*rr];crowns.push(at);
  const leaves=type==='summer'?14:12;
  for(let k=0;k<leaves;k++){
   const size=L*(.60+.4*k/leaves),an=az+(k%2?Math.PI:0)+(rand()-.5)*.24,pitch=k<3?-.38:.02+rand()*.34;
   if(k!==0&&rand()>s.leafDensity)continue;
   b.add('agapanthusLeaf',leafKind,kit.shade(rand,green,.055),at[0],at[1]+.002*k,at[2],Math.min(a.leafWidth,w*.075)*s.leafScale,size,size,pitch,an,0);
  }
 }
 const before=s.flowerBuds;if(!s.bloom&&!before)return;
 const heads=Math.max(2,Math.round((type==='summer'?8:type==='queen'||type==='umbrella'?5:6)*detail)),r=a.flowerRadius,hr=Math.min(a.headRadius,w*.22),pal=a.flowerPalette;
 for(let i=0;i<heads;i++){
  const root=crowns[i%crowns.length],az=i*2.399963,top=[root[0]+Math.sin(az)*w*.23,h*(.69+rand()*.24)-hr*.40,root[2]+Math.cos(az)*w*.23];
  if(before){top[1]*=.76;b.branch(root,top,Math.min(.008,h*.010),stem,'scape-agapanthus');b.add(kit.bud,'spathe-agapanthus','#849c65',...top,hr*.35,hr*.73,hr*.35);continue;}
  b.branch(root,top,Math.min(.008,h*.010),stem,'scape-agapanthus');
  for(let q=0;q<2;q++)b.add('iberisEntire','bract-agapanthus','#b7ac89',...top,hr*.30,hr*.55,hr*.3,1.5,q*Math.PI+az,0);
  const count=Math.max(18,Math.round(pal.count*detail));
  for(let j=0;j<count;j++){
   const t=(j+.4)/count,an=j*2.399963,yv=1-t*1.35,rv=Math.sqrt(Math.max(0,1-yv*yv)),pedicel=hr*(.86+rand()*.14),pt=[top[0]+Math.sin(an)*rv*pedicel,top[1]+yv*pedicel,top[2]+Math.cos(an)*rv*pedicel];
   b.branch(top,pt,Math.min(.001,h*.0018),type==='black'?'#4f4d59':stem,'pedicel-agapanthus');
   const young=t<.23||rand()>s.flowerDensity,pendulous=['queen','fireworks','enigma'].includes(type),pitch=young?Math.acos(yv):pendulous?1.28+t*.90:Math.acos(yv)+.18,f=flowerFrame(b,pt,pitch,an);
   if(young){const pale=['queen','fireworks','enigma'].includes(type);f.add(kit.bud,'bud-agapanthus',pale?'#d7d7df':pal.bud,0,r*.34,0,r*.10,r*.32,r*.10);f.add(kit.bud,'bud-agapanthus',pal.base,0,r*.08,0,r*.075,r*.17,r*.075);continue;}
   const petals=a.petals,shape=type==='pleno'?'agapanthusClosed':type==='diamond'?'agapanthusDiamond':'agapanthusTepal',kind=`petal-agapanthus-${pal.base.slice(1)}-${pal.stripe.slice(1)}`;
   for(let k=0;k<petals;k++){
    const layer=type==='pleno'&&k>=6?1:0,angle=k*TAU/(type==='pleno'?6:petals)+(layer?.35:0),sz=r*(layer?.77:1);
    f.add(shape,kind,kit.shade(rand,s.flowerColor,.025),0,layer*r*.14,0,sz*.75,sz,sz*.75,layer?.10:0,angle,0);
   }
   for(let k=0;k<a.stamenCount;k++){
    const an=k*TAU/a.stamenCount,to=[Math.sin(an)*r*.27,r*1.02,Math.cos(an)*r*.27];
    f.branch([Math.sin(an)*r*.11,r*.24,Math.cos(an)*r*.11],to,r*.014,'#ddd7df','filament-agapanthus');f.add(kit.bud,'anther-agapanthus',type==='diamond'?'#c2b792':'#a59ca9',...to,r*.017,r*.014,r*.042);
   }
   if(type!=='pleno')f.branch([0,r*.20,0],[0,r*1.04,0],r*.018,'#d2d4c8','style-agapanthus');
  }
 }
}

// Palmately lobed leaves share a petiole origin, not a feather-shaped midrib.
export function heucherellaLeafPoint(type,t,angle){
 const seven=type.endsWith('7'),lobes=seven?[-2.5,-1.67,-.83,0,.83,1.67,2.5]:[-2.2,-1.1,0,1.1,2.2];
 const depth=type==='oak5'?.48:type==='pointed5'?.43:type==='cut5'?.53:type==='plum7'?.72:.82;
 const width=type==='pointed5'?.24:type==='oak5'?.35:.43;
 const near=Math.min(...lobes.map(a=>Math.abs(angle-a))),lobe=Math.exp(-Math.pow(near/width,2));
 const secondary=type==='oak5'||type==='cut5'?1-(type==='oak5'?.15:.08)*Math.pow(Math.max(0,Math.cos(angle*17)),4):1;
 const crenate=1-.035*Math.pow(Math.max(0,Math.cos(angle*(seven?44:36))),4);
 const notch=1-.94*Math.exp(-Math.pow((Math.abs(angle)-Math.PI)/.18,2));
 const edge=(.64+.36*Math.cos(angle))*(depth+(1-depth)*lobe)*secondary*crenate*notch;
 const r=t*edge,x=Math.sin(angle)*r*.90,y=Math.cos(angle)*r;
 const fold=.025*Math.cos(near*12)*t*t+.04*Math.sin(angle*3)*t*t+(type==='oak5'?.04*Math.sin(angle*8)*t*t:0);
 return [x,y,.14*t*t+fold+.018*Math.sin(angle*18)*t*t];
}

export function heucherellaCalyxGeometry(){
 const p=[],uv=[],ix=[],rows=10,cols=50;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,an=j/cols*TAU,tip=t>.55?(t-.55)/.45:0,lobe=Math.pow((1+Math.cos(an*5))/2,2),r=.18+.23*Math.sin(t*Math.PI*.64)+.12*tip*lobe,y=t*(1-.25*tip*(1-lobe));
  p.push(Math.sin(an)*r,y,Math.cos(an)*r);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;ix.push(k,k+1,k+cols+1,k+1,k+cols+2,k+cols+1);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.heucherellaCalyx=true;return g;
}

function drawHeucherella(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,typ=a.shootProfile,trailing=['copper','plum','yellowstone'].includes(typ),h=s.height,w=s.spread,lh=Math.min(s.leafHeight||h,h*a.foliageHeightRatio),L=Math.min(a.leafLength,w*.32)*s.leafScale;
 const leafKind=`leaf-heucherella-${a.leafShape}-${s.leafPatternColor.slice(1)}-${a.leafPattern}-${a.leafUnderside.slice(1)}-${a.leafTexture}`;
 const leaf=(base,an,size,outer=false)=>{
  const rise=lh*(outer?.27:.35+rand()*.35),reach=size*(outer?.40:.50),tip=[base[0]+Math.sin(an)*reach,base[1]+rise,base[2]+Math.cos(an)*reach];
  const bend=[(base[0]+tip[0])*.5,base[1]+rise*.74,(base[2]+tip[2])*.5];
  b.branch(base,bend,.0014,a.stemColor,'petiole-heucherella');b.branch(bend,tip,.0010,a.stemColor,'petiole-heucherella');
  const leafColor=typ==='copper'?new THREE.Color(s.leafColor).lerp(new THREE.Color(size<L*.74?'#b88080':'#a18e65'),.42):s.leafColor;
  b.add('heucherella-'+a.leafShape,leafKind,kit.shade(rand,leafColor,.045),...tip,size*a.leafWidth/a.leafLength*1.07,size,size,1.15+rand()*.72,an,(rand()-.5)*.28);
 };
 const crowns=[];
 if(trailing){
  const arms=Math.max(4,Math.round(8*detail));
  for(let i=0;i<arms;i++){
   const angle=i*2.399963,reach=Math.max(0,w*.5-L*.70),nodes=[[0,.012,0]];
   for(let k=1;k<=7;k++){const t=k/7,an=angle+Math.sin(t*4+i)*.17;nodes.push([Math.sin(an)*reach*t,.018+lh*.30*Math.sin(t*Math.PI),Math.cos(an)*reach*t]);b.branch(nodes[k-1],nodes[k],.002,a.stemColor,'runner-heucherella');}
   for(let k=1;k<=7;k++){
    const at=nodes[k];if(k===2||k===5)crowns.push(at);
    for(let j=0;j<2;j++)if(rand()<s.leafDensity)leaf(at,angle+(j?1:-1)*1.2,L*(.57+.35*k/7),true);
   }
  }
 }else{
  for(let i=0;i<5;i++){const an=i*2.399963,r=i===0?0:w*.17;crowns.push([Math.sin(an)*r,.012,Math.cos(an)*r]);}
  const leaves=Math.max(6,Math.round(12*detail));
  for(const at of crowns)for(let j=0;j<leaves;j++)if(j===0||rand()<s.leafDensity){const angle=j*2.399963+rand()*.15;leaf(at,angle,L*(.58+.42*j/leaves));}
 }
 if(!s.bloom)return;
 const n=a.flowerAbundance==='rare'?1:Math.max(3,Math.round((typ==='bridget'?11:trailing?8:9)*detail)),r=a.flowerRadius,stem=a.stemColor;
 for(let i=0;i<n;i++){
  const root=crowns[i%crowns.length]||[0,.012,0],az=i*2.399963,top=[root[0]+Math.sin(az)*w*.11,h*(.80+rand()*.17),root[2]+Math.cos(az)*w*.11],len=Math.min(a.inflorescenceLength,h*.52),bottom=[top[0]*.9,Math.max(root[1]+.01,top[1]-len),top[2]*.9];
  b.branch(root,bottom,.0012,stem,'scape-heucherella');b.branch(bottom,top,.0008,stem,'raceme-heucherella');
  const count=Math.round((typ==='tapestry'?110:typ==='bridget'?90:65)*detail);
  for(let j=0;j<count;j++){
   const t=(j+.5)/count,an=j*2.399963,at=bottom.map((v,k)=>v+(top[k]-v)*t),rad=(.010+(1-t)*.014)*(typ==='tapestry'?1.45:1),pt=[at[0]+Math.sin(an)*rad,at[1]+.003,at[2]+Math.cos(an)*rad];
   b.branch(at,pt,.00022,stem,'pedicel-heucherella');
   if(t>.86||rand()>s.flowerDensity){b.add(kit.bud,'bud-heucherella',s.flowerColor,...pt,r*.36,r*.50,r*.36);continue;}
   const f=flowerFrame(b,pt,1.78+rand()*.40,an),calyx=typ==='plum'?'#b888a5':s.flowerColor;
   f.add('heucherellaCalyx','sepal-heucherella',calyx,0,0,0,r,r,r);
   for(let q=0;q<5;q++){
    const aa=q*TAU/5+.63;
    f.add('iberisEntire','petal-heucherella',s.flowerColor,Math.sin(aa)*r*.32,r*.56,Math.cos(aa)*r*.32,r*.22,r*.83,r,.46,aa,0);
   }
   for(let q=0;q<a.stamenCount;q++){
    const aa=q*TAU/a.stamenCount,tip=[Math.sin(aa)*r*.44,r*1.15,Math.cos(aa)*r*.44];
    f.branch([0,r*.5,0],tip,.000055,'#dedaca','filament-heucherella');f.add(kit.bud,'anther-heucherella','#d1c5a7',...tip,r*.06,r*.075,r*.04);
   }
   if(a.pistilCount===10){
    for(let q=0;q<10;q++){const an=q*TAU/10,x=Math.sin(an)*r*.19,z=Math.cos(an)*r*.19;f.add(kit.bud,'ovary-heucherella','#b1bd7a',x,r*.52,z,r*.09,r*.28,r*.09);f.branch([x,r*.50,z],[x*1.3,r*1.1,z*1.3],r*.035,'#dfd6ca','style-heucherella');}
   }else for(const side of [-1,1])f.branch([0,r*.3,0],[side*r*.15,r*1.20,0],r*.045,'#dfd6ca','style-heucherella');
  }
 }
}

export function iberisPoint(type,t,u){
 const sn=Math.max(0,Math.sin(Math.PI*t));
 if(type==='petal'){
  const width=t<.27?.04+.12*t:.47*Math.pow(Math.sin(Math.PI*(t-.21)/.79),.42);
  return [u*width,t,.09*t*t-.045*u*u*sn];
 }
 const teeth=type==='toothed'?1-.25*Math.pow(Math.max(0,Math.cos((t-.15)*TAU*4.4)),6)*sn:1;
 return [u*.5*Math.pow(sn,.55)*(.7+.3*t)*teeth,t,.03*t*t+.035*u*u*sn-.008*Math.exp(-u*u*55)*sn];
}

function iberisFlower(b,at,r,color,yaw,rand,kit){
 const f=flowerFrame(b,at,.06,yaw);
 for(let j=0;j<4;j++){
  const an=j<2?(j===0?-.54:.54):j===2?2.34:3.94,len=r*(j<2?1:.46);
  f.add('iberisPetal','petal-iberis',kit.shade(rand,color,.028),Math.sin(an)*r*.07,.0003,Math.cos(an)*r*.07,len*.68,len,len,1.47,an,0);
  f.add('iberisEntire','calyx-iberis','#809265',0,-.0008,0,r*.30,r*.30,r*.30,1.67,an,0);
 }
 for(let j=0;j<6;j++){
  const an=j*TAU/6,rr=r*.16,top=[Math.sin(an)*rr,r*(j<4?.30:.23),Math.cos(an)*rr];
  f.branch([0,0,0],top,r*.013,'#e2daac','filament-iberis');f.add(kit.bud,'anther-iberis','#c7b264',...top,r*.048,r*.037,r*.030);
 }
 f.add(kit.bud,'stigma-iberis','#a2a768',0,r*.24,0,r*.05,r*.04,r*.05);
}

function drawIberis(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,type=a.shootProfile,annual=['amara','umbellata'].includes(type),tall=annual||type==='mermaid'||type==='pinkice',h=s.height*(annual?s.leafDensity===0?1:s.leafScale:1),w=s.spread*(annual?s.leafDensity===0?1:Math.max(.3,s.leafScale):1),L=Math.min(a.leafLength,w*.22)*s.leafScale,stem=a.stemColor,leafKind=a.leafTexture==='glossy'?'leaf-iberis-glossy':'leaf-iberis',leafShape=['amara','mermaid'].includes(type)?'iberisToothed':'iberisEntire',after=s.seedHeads,show=s.bloom||after;
 const n=Math.max(8,Math.round((type==='mermaid'?20:annual?22:48)*detail)),headR=Math.min(a.headRadius,w*.18),r=a.flowerRadius;
 for(let i=0;i<n;i++){
  const az=i*2.399963,rr=w*.35*Math.sqrt((i+.3)/n),topY=h*(tall?.65+rand()*.23:.34+rand()*.33),nodes=[[0,.007,0],[Math.sin(az)*rr*.58,h*(tall?.25:.09),Math.cos(az)*rr*.58],[Math.sin(az)*rr,topY,Math.cos(az)*rr]];
  for(let j=1;j<3;j++){
   b.branch(nodes[j-1],nodes[j],annual?.0008:.0010,j===1&&!annual?a.barkColor:stem,j===1&&!annual?'woodyBranch-iberis':'stem-iberis');
   for(let k=0;k<14;k++)if((i===0&&k===0)||rand()<s.leafDensity){
    if(s.leafDensity===0)continue;
    const t=(k+.5)/14,pt=nodes[j-1].map((v,d)=>v+(nodes[j][d]-v)*t),angle=az+k*2.399963,len=L*(.66+rand()*.34);
    b.add(leafShape,leafKind,kit.shade(rand,s.leafColor,.05),...pt,len*a.leafWidth/a.leafLength,len,len,.62+rand()*.65,angle,0);
   }
  }
  // Short leafy side shoots fill the mat; the flower stalks emerge above them.
  for(let q=0;q<3;q++){
   const t=.35+q*.23,root=nodes[1].map((v,d)=>v+(nodes[2][d]-v)*t),an=az+(q%2?1:-1)*.9,len=w*(annual?.09:.13),tip=[root[0]+Math.sin(an)*len,root[1]+h*.09,root[2]+Math.cos(an)*len];
   b.branch(root,tip,.0006,stem,'leafyShoot-iberis');
   for(let k=0;k<13;k++)if(rand()<s.leafDensity){const u=(k+.4)/13,pt=root.map((v,d)=>v+(tip[d]-v)*u),ll=L*(.74+rand()*.26);b.add(leafShape,leafKind,kit.shade(rand,s.leafColor,.05),...pt,ll*a.leafWidth/a.leafLength,ll,ll,.50+rand()*.8,an+k*2.399963,0);}
  }
  if(!show)continue;
  const branches=type==='mermaid'?3:2;
  for(let q=0;q<branches;q++){
   const an=az+q*TAU/branches,at=nodes[2],center=[at[0]+Math.sin(an)*w*.10,Math.min(h*.98,at[1]+h*.14+(q===0?.02:0)),at[2]+Math.cos(an)*w*.10];
   b.branch(at,center,.0007,stem,'peduncle-iberis');
   const count=type==='mermaid'?52:type==='amara'?85:38;
   if(after&&type!=='umbellata')b.branch(center,[center[0],center[1]+h*.20,center[2]],.00045,'#9b9167','fruitAxis-iberis');
   for(let j=0;j<count;j++){
    const t=(j+.35)/count,angle=j*2.399963,elongated=after&&type!=='umbellata',rad=headR*(elongated?.55:Math.sqrt(t)),raised=elongated?h*.20*(1-t):type==='amara'?h*.10*(1-t):headR*.24*(1-t),pt=[center[0]+Math.sin(angle)*rad,center[1]+raised,center[2]+Math.cos(angle)*rad];
    const root=[center[0],center[1]+(elongated?raised-.005:-.012),center[2]];
    b.branch(root,pt,.0002,after?'#9b9167':stem,'pedicel-iberis');
    if(after){
     const f=flowerFrame(b,pt,.7,angle),sz=type==='amara'?.0022:.003;
     for(const side of [-1,1])f.add(kit.bud,'silicle-iberis','#a7a071',side*sz*.36,0,0,sz*.63,sz,sz*.23);
     f.branch([0,sz*.2,0],[0,sz*1.4,0],.00012,'#927e58','style-iberis');
    }else if(t<.17||rand()>s.flowerDensity){
     b.add(kit.bud,'flowerBud-iberis',type==='pinkice'?'#ae879f':type==='mermaid'?'#a684b0':'#bac5a1',...pt,r*.22,r*.27,r*.22);
    }else{
     const pal=a.flowerPalette,color=pal?new THREE.Color(pal.opening).lerp(new THREE.Color(pal.mature),t).getStyle():s.flowerColor;
     iberisFlower(b,pt,r*(.84+rand()*.16),color,angle,rand,kit);
    }
   }
  }
 }
}

export function astilbeLeafPoint(t,u){
 const sn=Math.max(0,Math.sin(Math.PI*t)),teeth=.88+.085*Math.cos(t*TAU*14)+.035*Math.cos(t*TAU*28);
 return [u*.5*Math.pow(sn,.74)*teeth*(1.08-.24*t),t,.075*u*u*sn+.055*t*t-.018*Math.exp(-u*u*80)*sn];
}

// One shared small flower contains five narrow petals and ten filaments.
export function astilbeFloretGeometry(){
 const p=[],uv=[],ix=[];
 const quad=(a,b,c,d)=>{const n=p.length/3;p.push(...a,...b,...c,...d);uv.push(0,0,1,0,0,1,1,1);ix.push(n,n+1,n+2,n+1,n+3,n+2);};
 for(let j=0;j<5;j++){
  const a=j*TAU/5,point=(t,u)=>[Math.sin(a)*(t*.92)+Math.cos(a)*u*.09*Math.sin(Math.PI*t),t*.50+.16*t*t,Math.cos(a)*(t*.92)-Math.sin(a)*u*.09*Math.sin(Math.PI*t)];
  for(let k=0;k<4;k++)quad(point(k/4,-1),point(k/4,1),point((k+1)/4,-1),point((k+1)/4,1));
 }
 for(let j=0;j<10;j++){
  const a=j*TAU/10,r=.35,base=[Math.sin(a)*.06,.08,Math.cos(a)*.06],top=[Math.sin(a)*r,.91,Math.cos(a)*r],off=[Math.cos(a)*.013,0,-Math.sin(a)*.013];
  quad(base.map((v,d)=>v-off[d]),base.map((v,d)=>v+off[d]),top.map((v,d)=>v-off[d]),top.map((v,d)=>v+off[d]));
  const n=p.length/3;p.push(top[0]-.037,top[1],top[2],top[0]+.037,top[1],top[2],top[0],top[1]+.05,top[2]);uv.push(0,0,1,0,.5,1);ix.push(n,n+1,n+2);
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.astilbeFloret=true;return g;
}

function drawAstilbe(b,{info,s,p,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,pal=a.flowerPalette,h=s.height,w=s.spread,L=Math.min(a.leafLength,w*.19)*s.leafScale,green=s.leafColor,stem=a.stemColor,blend=(x,y,t)=>new THREE.Color(x).lerp(new THREE.Color(y),t).getStyle();
 const leaf=(at,an,len,compound=true)=>{
  const f=flowerFrame(b,at,-(.52+rand()*.6),an),axis=len*(compound?2.1:1.3);
  f.branch([0,0,0],[0,axis,0],.00085,stem,'petiole-astilbe');
  for(let j=-1;j<=1;j++){
   const az=j*.83,from=[0,axis*(j===0?1:.73),0],ll=len*(j===0?1:.87),end=[Math.sin(az)*ll*.9,from[1]+Math.cos(az)*ll*.9,0];
   f.branch(from,end,.0006,stem,'rachis-astilbe');
   for(let k=compound?-1:0;k<= (compound?1:0);k++){
    const ang=az+k*.9,base=[end[0]+Math.sin(ang)*ll*.22,end[1]+Math.cos(ang)*ll*.22,0],size=ll*(k===0?1:.76);
    f.branch(end,base,.0003,stem,'petiolule-astilbe');f.add('astilbeLeaflet',a.leafTexture==='glossy'?'leaf-astilbe-glossy':'leaf-astilbe',kit.shade(rand,green,.04),...base,size*a.leafWidth/a.leafLength,size,size,0,0,-ang);
   }
  }
 };
 const leaves=Math.max(6,Math.round(42*detail));
 for(let i=0;i<leaves;i++)if(i===0||rand()<s.leafDensity){const an=i*2.399963,rr=w*.22*Math.sqrt(rand());leaf([Math.sin(an)*rr,.009,Math.cos(an)*rr],an,L*(.67+rand()*.33));}
 const before=s.month===Math.min(...a.flowerMonths)-1,after=s.seedHeads;
 if(!s.bloom&&!before&&!after)return;
 const n=Math.max(4,Math.round((a.shootProfile==='irrlicht'?13:9)*detail)),flower=pal.plantColors?pal.plantColors[(p?.id||0)%pal.plantColors.length]:s.flowerColor;
 for(let i=0;i<n;i++){
  const an=i*2.399963,rr=w*.25*Math.sqrt(rand()),base=[Math.sin(an)*rr,.008,Math.cos(an)*rr],pl=Math.min(a.inflorescenceLength,h*.48)*(before?.58:1),topH=h*(.72+.24*rand())*(before?.65:1),root=[base[0]+Math.sin(an)*w*.06,topH-pl,base[2]+Math.cos(an)*w*.06];
  b.branch(base,root,.0018,stem,'stem-astilbe');for(let j=1;j<=3;j++)if(rand()<s.leafDensity){const t=j/4,at=base.map((v,k)=>v+(root[k]-v)*t);leaf(at,an+j*2.399963,L*(.73-j*.12),j<3);}
  const frame=flowerFrame(b,root,.05+rand()*.18,an),curve=pal.arching?.36:.035,path=t=>[0,pl*t,pl*curve*t*t];let last=path(0);
  for(let j=1;j<=12;j++){const at=path(j/12);frame.branch(last,at,.00075*(1-j/20),stem,'panicleAxis-astilbe');last=at;}
  const age=(i*.37)%1,tint=after?pal.dry:before?(a.shootProfile==='lime'?'#9e6571':'#a1ad79'):pal.opening?blend(pal.opening,pal.mature||flower,age):flower;
  for(let j=0;j<20;j++){
   const t=.055+j*.046,az=j*2.399963,at=path(t),branchLength=pl*pal.width*(1-t)*(.82+.18*rand()),bend=pal.arching?-.5:.34,end=[at[0]+Math.sin(az)*branchLength,at[1]+branchLength*bend,at[2]+Math.cos(az)*branchLength];
   frame.branch(at,end,.00045,stem,'panicleBranch-astilbe');
   const count=Math.max(2,Math.round((9+23*(1-t))*detail));
   for(let k=0;k<count;k++){
    const u=(k+.3)/count,node=at.map((v,d)=>v+(end[d]-v)*u),sideAz=az+(k%2?1:-1)*.9,sub=branchLength*.30*(1-u)+.002,tip=[node[0]+Math.sin(sideAz)*sub,node[1]+sub*.5,node[2]+Math.cos(sideAz)*sub];frame.branch(node,tip,.0002,stem,'panicleTwig-astilbe');
    for(let q=0;q<5;q++){
     const fa=q*TAU/5+k*1.2,rad=.0054,pt=[tip[0]+Math.sin(fa)*rad,tip[1]+(q-2)*.0018,tip[2]+Math.cos(fa)*rad],size=a.flowerRadius*(.75+rand()*.35);
     if(before||after)frame.add(kit.bud,before?'flowerBud-astilbe':'seedHead-astilbe',tint,...pt,size*.55,size*.80,size*.55);
     else frame.add('astilbeFloret','petal-astilbe',kit.shade(rand,tint,.03),...pt,size,size,size,.50+rand()*1.4,fa,0);
    }
   }
  }
 }
}

export function aquilegiaPoint(type,t,u){
 const sn=Math.max(0,Math.sin(Math.PI*t));
 if(type==='leaf'){
  const notch=1-.32*Math.exp(-(((t-.51)/.055)**2)),lobes=.68+.32*Math.pow(.5+.5*Math.cos((t-.23)*TAU*2.2),.65),crenate=.955+.045*Math.cos(t*TAU*13);
  return [u*.58*Math.pow(sn,.66)*lobes*notch*crenate,t,.035*t*t+.075*u*u*sn-.02*Math.exp(-u*u*70)*sn];
 }
 const pointed=type==='pointed',width=pointed?.27*Math.pow(sn,.80):.44*Math.pow(sn,.43),curl=pointed?.13:.25;
 return [u*width,t,curl*t*t-.13*u*u*sn+.012*Math.sin(t*11+u*3)*sn];
}

function aquilegiaFlower(b,at,a,col,pitch,yaw,rand,kit){
 const f=flowerFrame(b,at,pitch,yaw),r=a.flowerRadius,pal=a.flowerPalette,type=a.shootProfile,barlow=type==='barlow',tower=type==='tower',winky=type==='winky',small=type==='ecalcarata',canada=type==='canadensis';
 const base=barlow&&pal.opening&&rand()<.35?pal.opening:col;
 const petalKind=pal.tip?'petal-aquilegia-tip-'+pal.tip.slice(1):'petal-aquilegia';
 if(barlow){
  for(let k=0;k<pal.layers;k++)for(let j=0;j<5;j++){
   const an=j*TAU/5+k*.61,len=r*(1.07-k*.085),tilt=1.02-k*.20;
   f.add('aquilegiaPointed',petalKind,kit.shade(rand,base,.04),Math.sin(an)*r*.04,r*k*.07,Math.cos(an)*r*.04,len*.87,len,len,tilt,an,0);
  }
 }else{
  for(let j=0;j<5;j++){
   const an=j*TAU/5,sepKind=pal.stripe?'petal-aquilegia-stripe-'+pal.stripe.slice(1):'petal-aquilegia-sepal';
   f.add('aquilegiaPointed',sepKind,col,0,0,0,r*(small?.70:.91),r*(small?1.05:1.32),r,small?1.10:1.18,an,0);
  }
  for(let k=0;k<(pal.layers||1);k++)for(let j=0;j<5;j++){
   const an=j*TAU/5+Math.PI/5+k*.52,rad=r*(.19-k*.035),len=r*(tower?1.55:winky?1.00:type==='buergeriana'?1.26:small?1.12:.82)*(1-k*.11),tilt=tower?.12+winky*.05:winky?.66-k*.21:small?.14:type==='buergeriana'?.12:.51;
   f.add('aquilegiaRounded',petalKind,pal.inner||col,Math.sin(an)*rad,r*k*.15,Math.cos(an)*rad,len*(tower?.67:.80),len,len,tilt,an,0);
   if(k===0&&pal.spur){
    const len=r*pal.spur;let prev=[Math.sin(an)*rad,0,Math.cos(an)*rad];
    for(let n=1;n<=12;n++){
     const t=n/12,rr=rad+r*(.14*t+.30*Math.sin(t*Math.PI)*(pal.curve||0)),back=-len*t+len*(pal.curve||0)*Math.pow(Math.max(0,(t-.65)/.35),2)*.30,pt=[Math.sin(an)*rr,back,Math.cos(an)*rr];
     f.branch(prev,pt,r*(.12*Math.pow(1-t,.86)+.012),col,'spur-aquilegia');prev=pt;
    }
    f.add(kit.bud,'spurTip-aquilegia',col,...prev,r*.026,r*.026,r*.026);
   }
  }
 }
 const length=r*(canada?1.82:barlow?.70:tower?1.12:type==='buergeriana'?1.06:.94);
 for(let j=0;j<(small?12:barlow?16:28);j++){
  const an=j*2.399963,rr=r*(.08+.14*Math.sqrt(rand())),top=[Math.sin(an)*rr,length*(.78+.22*rand()),Math.cos(an)*rr];
  f.branch([0,r*.10,0],top,r*.009,'#d8cf8f','filament-aquilegia');f.add(kit.bud,'anther-aquilegia','#ccbb60',...top,r*.032,r*.053,r*.025);
 }
}

function drawAquilegia(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,type=a.shootProfile,small=type==='ecalcarata',h=s.height,w=s.spread,L=Math.min(a.leafLength,w*.21)*s.leafScale,green=s.leafColor,stem=a.stemColor;
 const leaf=(at,az,len,biternate=true,pitch=.82)=>{
  const f=flowerFrame(b,at,-pitch,az),leaflet=(base,angle,ll)=>{
   const end=[base[0]+Math.sin(angle)*ll*.30,base[1]+Math.cos(angle)*ll*.30,base[2]];f.branch(base,end,.00035,stem,'petiolule-aquilegia');
   f.add('aquilegiaLeaflet','leaf-aquilegia',kit.shade(rand,green,.055),...end,ll*a.leafWidth/a.leafLength,ll,ll,0,0,-angle);
  };
  const trunk=len*(biternate?2.1:1.15);f.branch([0,0,0],[0,trunk,0],.00055,stem,'petiole-aquilegia');
  for(let j=-1;j<=1;j++){
   const an=j*.93,origin=[0,trunk*(j===0?1:.70),0],length=len*(biternate?1.20:.32),tip=[Math.sin(an)*length,origin[1]+Math.cos(an)*length,0];
   f.branch(origin,tip,.0004,stem,'leafRachis-aquilegia');
   if(biternate)for(let k=-1;k<=1;k++)leaflet(tip,an+k*.92,len*(j===0?1:.86)*(k===0?1:.85));else leaflet(tip,an,len*.83);
  }
 };
 const leaves=Math.max(5,Math.round((small?10:22)*detail));
 for(let i=0;i<leaves;i++)if(i===0||rand()<s.leafDensity){const an=i*2.399963,rr=w*.19*Math.sqrt(rand());leaf([Math.sin(an)*rr,.009,Math.cos(an)*rr],an,L*(.70+.3*rand()),true,.57+rand()*.57);}
 if(!s.bloom)return;
 const stems=Math.max(3,Math.round((small?9:type==='winky'?9:type==='canadensis'?8:7)*detail));
 for(let i=0;i<stems;i++){
  const an=i*2.399963,rr=w*.11*Math.sqrt(rand()),base=[Math.sin(an)*rr,.009,Math.cos(an)*rr],height=h*(.68+.23*rand()),reach=w*(small?.19:.12),nodes=[];
  for(let j=0;j<=5;j++){
   const t=j/5,pt=[base[0]+Math.sin(an)*reach*t*t,height*t,base[2]+Math.cos(an)*reach*t*t];nodes.push(pt);
   if(j){b.branch(nodes[j-1],pt,small?.0005:.0012,stem,'stem-aquilegia');if(j<5&&rand()<s.leafDensity)leaf(pt,an+j*2.399963,L*(.8-j*.13),j<3,.76);}
  }
  for(let k=0;k<(small?7:4);k++){
   const az=an+k*2.399963,start=nodes[3+k%3],side=w*(small?.20:.16)*(.4+rand()*.6),up=h*(.08+rand()*.13),nodding=!['winky','chrysantha','koralle'].includes(type),pitch=nodding?Math.PI-.3-rand()*.4:type==='koralle'?1.25+rand()*.35:.18+rand()*.68,end=[start[0]+Math.sin(az)*side,start[1]+up-(nodding?h*.03:0),start[2]+Math.cos(az)*side],middle=[(start[0]+end[0])*.5,start[1]+up,(start[2]+end[2])*.5];
   let prev=start;for(let j=1;j<=6;j++){const t=j/6,q=1-t,pt=start.map((v,d)=>q*q*v+2*q*t*middle[d]+t*t*end[d]);b.branch(prev,pt,small?.00035:.00065,stem,'pedicel-aquilegia');prev=pt;}
   if((i+k)%7===0||rand()>s.flowerDensity)b.add(kit.bud,'flowerBud-aquilegia',type==='barlow'?'#8b9281':s.flowerColor,...end,a.flowerRadius*.29,a.flowerRadius*.48,a.flowerRadius*.29,pitch,az,0);
   else aquilegiaFlower(b,end,a,s.flowerColor,pitch,az,rand,kit);
  }
 }
}

export function dianthusLeafPoint(t,u){
 const sn=Math.max(0,Math.sin(Math.PI*t)),width=.5*Math.pow(sn,.72)*(.84+.16*t);
 return [u*width,t,.035*t*t+.04*u*u*sn-.014*Math.exp(-u*u*90)*sn];
}

// Petal limbs have actual gaps between the fringes, not a star-shaped decal.
export function dianthusPetalPoint(type,t,u){
 const deep=['superbus','arenarius'].includes(type),teeth=type==='superbus'?21:type==='arenarius'?9:type==='chinensis'?15:type==='ranman'?17:11;
 const tooth=Math.pow(Math.max(0,Math.cos((u+.037)*Math.PI*teeth)),.65),depth=type==='superbus'?.51:type==='arenarius'?.42:type==='chinensis'?.15:type==='ranman'?.22:.09;
 const edge=1-depth+depth*tooth,rr=.08+(edge-.08)*t,an=u*(.13+.40*Math.min(1,t*2.5)),curl=deep?.10:.045;
 return [Math.sin(an)*rr,.035*t+curl*Math.sin(u*13+t*3)*t*t+.035*u*u*t,Math.cos(an)*rr];
}

function drawDianthus(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,type=a.shootProfile,h=s.height,w=s.spread,mat=['deltoides','arenarius'].includes(type),cluster=type==='barbatus',arching=type==='orihime',winter=[12,1,2].includes(s.month),green=s.leafColor,stem=a.stemColor,L=Math.min(a.leafLength,w*.45),lk=foliageKind(info);
 const leaf=(at,az,len,pitch=1.0)=>{const f=flowerFrame(b,at,-pitch,az);f.add('dianthusLeaf',lk,kit.shade(rand,green,.04),0,0,0,len*a.leafWidth/a.leafLength,len,len);};
 const branch=(from,to,r=.00085,kind='stem-dianthus')=>b.branch(from,to,r,stem,kind);
 const bloom=(at,az,index)=>{
  const count=cluster?16:type==='knappii'?5:1,rr=cluster?.022:type==='knappii'?.012:0;
  for(let j=0;j<count;j++){
   const an=az+j*2.399963,rad=rr*Math.sqrt((j+.5)/count),pt=[at[0]+Math.sin(an)*rad,at[1]+rr*.42*Math.sqrt(1-rad/(rr||1)),at[2]+Math.cos(an)*rad],open=s.bloom&&((j+index)%7!==0||count===1),tilt=arching?.65+rand()*.35:rand()*.40;
   branch(at,pt,.00035,'pedicel-dianthus');
   if(cluster)for(let q=0;q<3;q++){const bn=an+q*TAU/3;leaf(pt,bn,.010,.45+q*.1);}
   if(open)detailedFlower(b,{x:pt[0],y:pt[1],z:pt[2],r:a.flowerRadius,color:s.flowerColor,shape:'dianthusFringed',layers:a.flowerLayers||1,tilt,yaw:an,palette:{profile:type,eye:a.flowerEyeColor,rim:a.flowerPatternColor}},{...kit,rand});
   else b.add(kit.bud,'flowerBud-dianthus',green,...pt,.0025,.008,.0025);
  }
 };
 // Separate short leafy shoots persist after the taller flowering stems die back.
 const tufts=Math.max(5,Math.round((mat?72:cluster?13:18)*detail));
 for(let i=0;i<tufts;i++){
  const az=i*2.399963,rad=w*(mat?.43:.23)*Math.sqrt((i+.5)/tufts),base=[Math.sin(az)*rad,.004,Math.cos(az)*rad],tip=[base[0]+Math.sin(az)*L*.26,.008+L*.18,base[2]+Math.cos(az)*L*.26];branch(base,tip,.00065,'basalShoot-dianthus');
  for(let k=0;k<(mat?5:3);k++)for(let side=0;side<2;side++)if(rand()<s.leafDensity){const t=k/(mat?5:3),at=base.map((v,d)=>v+(tip[d]-v)*t);leaf(at,az+k*.65+side*Math.PI,L*(.57+.4*rand())*s.leafScale,.72+k*.17+rand()*.3);}
 }
 if(winter&&!s.bloom)return;
 const n=Math.max(4,Math.round((mat?48:type==='ranman'?29:cluster?9:type==='knappii'?17:14)*detail)),heightFactor=s.bloom?1:.50;
 for(let i=0;i<n;i++){
  const az=i*2.399963,rad=w*(mat?.36:type==='ranman'?.38:.18)*Math.sqrt(rand()),origin=[Math.sin(az)*rad,.008,Math.cos(az)*rad],rise=h*(.62+.24*rand())*heightFactor,reach=w*(arching?.45:.10)*(rand()*.55+.45),path=[];
  for(let k=0;k<=6;k++){const t=k/6;path.push([origin[0]+Math.sin(az)*reach*t*t,origin[1]+rise*(arching?Math.sin(t*2.25):t),origin[2]+Math.cos(az)*reach*t*t]);if(k){branch(path[k-1],path[k],cluster?.0014:.0008);if(k<6){b.add(kit.bud,'stemNode-dianthus',green,...path[k],.0016,.0019,.0016);for(let side=0;side<2;side++)if(rand()<s.leafDensity)leaf(path[k],az+k*Math.PI/2+side*Math.PI,L*(.83-k*.08),.68+k*.08);}}}
  if(s.bloom){
   bloom(path[6],az,i);
   if(!cluster)for(let k=0;k<(mat?1:2);k++){
    const root=path[4+k],an=az+(k?-.9:.9),end=[root[0]+Math.sin(an)*w*.10,root[1]+h*(.15+rand()*.06),root[2]+Math.cos(an)*w*.10];branch(root,end,.0006,'branch-dianthus');for(let side=0;side<2;side++)leaf(root,an+side*Math.PI,L*.4,.87);bloom(end,an,i+k+1);
   }
  }
 }
}

export function verbenaLeafPoint(type,t,u){
 const sn=Math.max(0,Math.sin(Math.PI*t)),bampton=type==='verbenaBampton';
 let width=.5*Math.pow(sn,.8)*(.92+.08*Math.cos(t*TAU*13));
 if(bampton)width*=.35+.65*Math.pow(.5+.5*Math.cos((t-.30)*TAU*2.2),.65);
 if(type==='verbenaLance')width+=.18*Math.exp(-(((t-.065)/.045)**2));
 return [u*width,t,.05*t*t+.052*u*u*sn+.008*Math.sin((t-Math.abs(u)*.19)*70)*Math.sin(Math.abs(u)*Math.PI)];
}

// The five lobes share a continuous throat; the centre is an opening, not a daisy disc.
export function verbenaCorollaGeometry(){
 const p=[],uv=[],ix=[],rows=12,cols=100;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,an=j/cols*TAU,edge=.60+.40*Math.pow(.5+.5*Math.cos(an*5),.40),flared=Math.max(0,(t-.45)/.55),r=t<.45?.12+.02*t/.45:.14+(edge-.14)*flared,yy=t<.45?-1.6+t/.45*1.48:-.12+.20*flared+.07*flared*flared;
  p.push(Math.sin(an)*r,yy,Math.cos(an)*r);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;ix.push(k,k+1,k+cols+1,k+1,k+cols+2,k+cols+1);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.verbenaCorolla=true;return g;
}

function drawVerbena(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,type=a.shootProfile,h=s.height,w=s.spread,bampton=type==='bampton',hastata=type==='hastata',winter=[12,1,2].includes(s.month),green=s.leafColor,stem=bampton?green:a.stemColor,L=Math.min(a.leafLength,w*.5)*s.leafScale,lk=foliageKind(info);
 const leaf=(at,az,len,pitch=1.0,upper=false)=>{const f=flowerFrame(b,at,-pitch,az);f.add(bampton&&upper?'verbenaHastata':a.leafShape,lk,kit.shade(rand,green,.045),0,0,0,len*a.leafWidth/a.leafLength,len,len);};
 const stalk=(from,to,r,kind='stem-verbena')=>{
  const start=new THREE.Vector3(...from),end=new THREE.Vector3(...to),dir=end.clone().sub(start),len=dir.length(),q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()),e=new THREE.Euler().setFromQuaternion(q,'YXZ'),mid=start.add(end).multiplyScalar(.5);
  if(len>.0001)b.add('verbenaSquareStem',kind,stem,...mid.toArray(),r,len,r,e.x,e.y,e.z);
 };
 const floret=(at,pitch=0,yaw=0,color=s.flowerColor)=>detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius,color,shape:'verbenaSalver',tilt:pitch,yaw},{...kit,rand});
 const head=(at,az,index)=>{
  const rr=a.headRadius,active=s.bloom;
  if(hastata||bampton){
   const len=bampton?.14:.11,lean=bampton?.50:.30,tip=[at[0]+Math.sin(az)*len*lean,at[1]+len,at[2]+Math.cos(az)*len*lean],count=bampton?26:60,phase=.27+((index*.173)%1)*.38;
   stalk(at,tip,bampton?.00035:.00065,'flowerSpike');
   for(let j=0;j<count;j++){
    const t=j/(count-1),an=j*2.39996,base=at.map((v,k)=>v+(tip[k]-v)*t),r=bampton?.0013:rr*(.62+.38*(1-t)),pt=[base[0]+Math.sin(an)*r,base[1],base[2]+Math.cos(an)*r],open=active&&Math.abs(t-phase)<(bampton?.045:.13);
    b.add(kit.bud,'calyx-verbena',bampton?green:t<phase?'#687e53':'#819360',...pt,r*.44,.0018,r*.44);
    if(open){const v=new THREE.Vector3(0,a.flowerRadius*1.9,0).applyEuler(new THREE.Euler(.95,an,0,'YXZ'));floret(pt.map((n,k)=>n+v.toArray()[k]),.95,an);}
   }return;
  }
  const count=type==='meteor'?32:48;
  for(let j=0;j<count;j++){
   const t=(j+.5)/count,an=j*2.399963,r=rr*Math.sqrt(t),pt=[at[0]+Math.sin(an)*r,at[1]+rr*.3*Math.sqrt(1-t),at[2]+Math.cos(an)*r];
   b.add(kit.bud,'calyx-verbena','#786079',pt[0],pt[1]-.003,pt[2],.0012,.0025,.0012);
   if(active&&(j+index)%9!==0)floret(pt,.16*Math.sqrt(t),an,kit.shade(rand,s.flowerColor,.035));
   else b.add(kit.bud,'flowerBud-verbena','#9a79a0',...pt,.0014,.0026,.0014);
  }
 };
 if(s.leafDensity>0)for(let j=0;j<Math.round((bampton?20:36)*detail*s.leafDensity);j++){
  const an=j*2.399963,rr=w*.12*Math.sqrt(rand());leaf([Math.sin(an)*rr,.006+rand()*.02,Math.cos(an)*rr],an,L*(.68+.32*rand()),1.12+rand()*.30);
 }
 if(winter&&!s.bloom)return;
 const count=Math.max(3,Math.round((bampton?8:hastata?8:type==='meteor'?12:9)*detail));
 for(let i=0;i<count;i++){
  const az=i*2.399963,base=[Math.sin(az)*w*.12,.005,Math.cos(az)*w*.12],top=[Math.sin(az)*w*.22,h*(bampton?.52+.15*rand():.61+.17*rand()),Math.cos(az)*w*.22];let prev=base;
  for(let j=1;j<=6;j++){
   const t=j/6,at=base.map((v,k)=>v+(top[k]-v)*t);stalk(prev,at,(hastata?.0017:.0012)*(1-t*.35));prev=at;
   if(rand()<s.leafDensity)for(const side of [0,Math.PI])leaf(at,az+j*Math.PI/2+side,L*(1-t*.78),.80+rand()*.30,j>3);
   if(j<3||!s.bloom)continue;
   const branchCount=bampton?2:hastata&&j>3?2:j>4?2:0;
   for(let k=0;k<branchCount;k++){
    const an=az+j*Math.PI/2+k*Math.PI,reach=w*(bampton?.28:hastata?.16:.21)*(1-t*.45),end=[at[0]+Math.sin(an)*reach,at[1]+h*(bampton?.20:.12),at[2]+Math.cos(an)*reach];stalk(at,end,bampton?.0005:.00085,'branch-verbena');
    const joint=at.map((v,d)=>v+(end[d]-v)*.60);for(const side of [0,Math.PI])leaf(joint,an+Math.PI/2+side,L*.20,.9,true);
    head(end,an,i*12+j*2+k);
    if(bampton||type==='meteor'||type==='lollipop'){
     const fork=[joint[0]+Math.sin(an+.8)*reach*.46,joint[1]+h*.12,joint[2]+Math.cos(an+.8)*reach*.46];stalk(joint,fork,.0006,'branch-verbena');head(fork,an+.8,i*7+j+k);
    }
   }
  }
  if(s.bloom)head(top,az,i);
 }
}

// Head florets are fused at their bases; each outer floret has an enlarged lip.
export function scabiousLeafPoint(type,t,u){
 const sn=Math.max(0,Math.sin(Math.PI*t)),entire=['caucasicaBasal','succisella','teasel','meltonBasal'].includes(type),fine=['ochroleuca','anthemifolia'].includes(type),basal=type.endsWith('Basal');
 let width=.5*Math.pow(sn,basal?.65:.78)*(basal?.42+.72*t:1);
 if(!entire)width*=basal?.66+.34*Math.pow(.5+.5*Math.cos((t-.10)*TAU*3),.6):.12+.88*Math.pow(.5+.5*Math.cos((t-.07)*TAU*(fine?6:3.8)),fine?1.3:.68);
 else if(type==='teasel')width*=.93+.07*Math.cos(t*TAU*12);
 return [u*width,t,.045*u*u*sn+.05*t*t+(type==='teasel'?.025*Math.sin(t*TAU*10)*sn:0)];
}

export function scabiousHeadGeometry(type,part){
 const pos=[],uv=[],idx=[],sphere=type==='succisella',large=type==='caucasica'||type==='anthemifolia',knautia=type==='knautia',ceph=type==='cephalaria',n=sphere?100:large?66:82,lobes=knautia||ceph||sphere?4:5;
 const quad=(a,b,c,d)=>{const o=pos.length/3;for(const v of [a,b,c,d])pos.push(...v);uv.push(0,0,1,0,0,1,1,1);idx.push(o,o+2,o+1,o+1,o+2,o+3);};
 for(let j=0;j<n;j++){
  const t=(j+.5)/n,az=j*2.399963,rho=sphere?Math.sqrt(1-(1-2*t)**2):Math.sqrt(t)*(large?.43:.61),outer=!sphere&&t>.76,yy=sphere?1-2*t:(large?.05:.36)*Math.sqrt(1-t),base=new THREE.Vector3(Math.sin(az)*rho,yy,Math.cos(az)*rho);
  const axis=sphere?base.clone().normalize():new THREE.Vector3(Math.sin(az)*(outer?.75:.14),1,Math.cos(az)*(outer?.75:.14)).normalize(),q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),axis),length=sphere?.18:large&&outer?.22:.15,fr=sphere?.047:large&&outer?.095:.049;
  const world=v=>new THREE.Vector3(...v).applyQuaternion(q).add(base).toArray();
  if(part==='petals'){
   for(let k=0;k<6;k++){const aa=k*TAU/6,bb=(k+1)*TAU/6;quad(world([Math.sin(aa)*fr*.36,0,Math.cos(aa)*fr*.36]),world([Math.sin(bb)*fr*.36,0,Math.cos(bb)*fr*.36]),world([Math.sin(aa)*fr,length,Math.cos(aa)*fr]),world([Math.sin(bb)*fr,length,Math.cos(bb)*fr]));}
   for(let k=0;k<lobes;k++){
    const angle=az+k*TAU/lobes,lip=outer?(.5+.5*Math.cos(k*TAU/lobes))**2:0,L=fr*(large?1.6+4.2*lip:1.4+2.2*lip),width=fr*(large?1.7:1.35),o=pos.length/3,rows=12,cols=10;
    for(let row=0;row<=rows;row++)for(let col=0;col<=cols;col++){
     const s=row/rows,u=col/cols*2-1,edge=Math.pow(Math.max(0,Math.sin(Math.PI*s)),.36),rr=fr*.58+L*s,xx=u*width*edge*(1-.12*Math.cos(s*TAU*3)),wave=(large?.025:.010)*Math.sin(s*23+u*9)*Math.abs(u)**3*edge;
     pos.push(...world([Math.sin(angle)*rr+Math.cos(angle)*xx,length+.15*L*s+.20*L*s*s+wave,Math.cos(angle)*rr-Math.sin(angle)*xx]));uv.push(col/cols,s);
     if(row<rows&&col<cols){const b=o+row*(cols+1)+col;idx.push(b,b+cols+1,b+1,b+1,b+cols+1,b+cols+2);}
    }
   }
  }else for(let k=0;k<4;k++){
   const aa=az+k*TAU/4,tip=[Math.sin(aa)*fr*.9,length+(k%2?.23:.19),Math.cos(aa)*fr*.9],w=part==='anthers'?.020:.0035;
   if(part==='anthers'){quad(world([tip[0]-w,tip[1],tip[2]-w*.6]),world([tip[0]+w,tip[1],tip[2]-w*.6]),world([tip[0]-w,tip[1]+w*.6,tip[2]+w*.6]),world([tip[0]+w,tip[1]+w*.6,tip[2]+w*.6]));}
   else quad(world([-w,length*.4,0]),world([w,length*.4,0]),world([tip[0]-w,tip[1],tip[2]]),world([tip[0]+w,tip[1],tip[2]]));
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData.scabiousHead=type;g.userData.part=part;return g;
}

function scabiousHead(b,at,r,a,color,kit,tone=.5,yaw=0,seed=false){
 const {rand}=kit,bud='scabBud',type=a.shootProfile,f=flowerFrame(b,at,(rand()-.5)*.24,yaw),bract=a.leafPattern?patternKind('bract',a.leafPattern,a.patternColor):'involucre';
 if(type==='teasel'){
  const co=seed?'#927950':'#8b9a66';f.add(bud,'teaselReceptacle',co,0,r*.65,0,r*.72,r*1.30,r*.72);
  for(let j=0;j<230;j++){const t=(j+.5)/230,an=j*2.399963,rho=Math.sqrt(1-(1-2*t)**2)*r*.74,yy=r*(.65+(1-2*t)*1.30),base=[Math.sin(an)*rho,yy,Math.cos(an)*rho],end=[Math.sin(an)*(rho+r*.28),yy+r*.18,Math.cos(an)*(rho+r*.28)];f.branch(base,end,r*.013,co,'teaselSpine');
   if(!seed&&(Math.abs(t-(.5-tone*.25))<.065||Math.abs(t-(.5+tone*.25))<.065)){
    const fl=flowerFrame(f,end,Math.PI/2-(.5-t)*1.0,an);fl.add('trumpet','petal-teasel',color,0,0,0,r*.085,r*.20,r*.085);
    for(let k=0;k<4;k++)fl.add('petal','petal-teasel',color,0,r*.18,0,r*.06,r*.10,r*.10,-1.20,k*TAU/4,0);
   }
  }
  for(let k=0;k<8;k++){
   const an=k*TAU/8,begin=[0,-r*.43,0],mid=[Math.sin(an)*r*1.55,-r*.45,Math.cos(an)*r*1.55],end=[Math.sin(an)*r*1.28,r*2.5,Math.cos(an)*r*1.28];f.branch(begin,mid,r*.025,co,'teaselBract');f.branch(mid,end,r*.018,co,'teaselBract');
  }return;
 }
 if(seed&&type==='stellata'){
  f.add(bud,'seedReceptacle','#7f8159',0,0,0,r*.83,r*.83,r*.83);
  for(let j=0;j<38;j++){
   const t=(j+.5)/38,an=j*2.399963,yy=1-2*t,rr=Math.sqrt(1-yy*yy),at=[Math.sin(an)*rr*r*.82,yy*r*.82,Math.cos(an)*rr*r*.82],cup=flowerFrame(f,at,Math.acos(yy),an);
   cup.add('trumpet','seedCup','#d5c6a4',0,0,0,r*.26,r*.40,r*.26);
   for(let k=0;k<10;k++){const aa=k*TAU/10;cup.branch([0,r*.02,0],[Math.sin(aa)*r*.26,r*.37,Math.cos(aa)*r*.26],r*.005,'#998761','seedRib');}
   for(let k=0;k<5;k++){const aa=k*TAU/5;cup.branch([0,r*.16,0],[Math.sin(aa)*r*.14,r*.30,Math.cos(aa)*r*.14],r*.014,'#665c41','seedStar');}
  }return;
 }
 const head=['amethyst','stellata','columbaria'].includes(type)?'columbaria':type==='ochroleuca'?'columbaria':type;
 const co=a.flowerPalette?.whitePink?new THREE.Color('#e8e1d5').lerp(new THREE.Color('#d2a5ba'),tone*.21).getStyle():color,pk=a.flowerPalette?.edge&&tone>.38?patternKind('petal','primroseEdge',a.flowerPalette.edge):'petal-scabious';
 f.add(head+'ScabPetals',pk,co,0,0,0,r,r,r);f.add(head+'ScabStamens','filament-scabious','#d6d2c8',0,0,0,r,r,r);f.add(head+'ScabAnthers','anther-scabious',type==='succisella'?'#c5b0cd':'#ece2d4',0,0,0,r,r,r);
 if(type!=='succisella'){
  f.add(bud,'receptacle-scabious',co,0,r*.03,0,r*.52,r*.23,r*.52);
  for(let k=0;k<10;k++)f.add('scabLeaf-caucasicaBasal',bract,'#708350',0,-r*.12,0,r*.24,r*.80,r*.80,-1.85,k*TAU/10,0);
  if(tone<.35)for(let j=0;j<24;j++){const t=(j+.5)/24,an=j*2.399963,rr=r*.23*Math.sqrt(t);f.add(bud,'floretBud-scabious',a.flowerPalette?.dark?'#603950':'#9ba36c',Math.sin(an)*rr,r*(.32+.04*(1-t)),Math.cos(an)*rr,r*.041,r*.058,r*.041);}
 }
}

function drawScabious(b,{info,s,p,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,type=a.shootProfile,h=s.height,w=s.spread,green=s.leafColor,lk=foliageKind(info),winter=[12,1,2].includes(s.month),teasel=type==='teasel',cauc=type==='caucasica',ceph=type==='cephalaria',succ=type==='succisella',low=['columbaria','ochroleuca'].includes(type),seed=!!s.seedHeads&&!s.biennialRosette,basalOnly=(winter&&!s.bloom&&!seed)||s.biennialRosette,L=Math.min(a.leafLength,w*.60)*s.leafScale;
 const leaf=(at,an,len,basal=false,pitch=1.12)=>{
  const shape=basal?a.basalLeafShape:a.leafShape,ratio=(basal?a.basalLeafWidth:a.leafWidth)/a.leafLength,f=flowerFrame(b,at,-pitch,an);f.add(shape,lk,kit.shade(rand,green,.04),0,0,0,len*ratio,len,len);
  if(teasel){f.branch([0,0,.002],[0,len,.002],len*.003,'#adb897','leafMidrib');for(let j=0;j<9;j++){const t=.12+j*.09;f.branch([0,len*t,.003],[0,len*t+.003,.008],.00035,'#bdc5a6','leafSpine');}}
 };
 if(s.leafDensity>0)for(let i=0;i<Math.round((ceph?28:teasel?18:type==='knautia'?64:40)*detail*s.leafDensity);i++){
  const an=i*2.39996,reach=w*(teasel?.08:.16)*Math.sqrt(rand());leaf([Math.sin(an)*reach,.007+rand()*.018,Math.cos(an)*reach],an,L*(.75+.25*rand()),true,.95+rand()*.5);
 }
 if(basalOnly)return;
 const count=Math.round((teasel?1:ceph?9:succ?14:low?19:cauc?14:16)*detail),dry=seed&&!s.bloom,stem=dry?'#907c56':a.stemColor;
 for(let i=0;i<count;i++){
  const az=i*2.399963,reach=w*(teasel?.04:.05+.29*Math.sqrt(rand())),height=h*(teasel?.89:ceph?.49+.12*rand():succ?.41+.11*rand():low?.30+.16*rand():cauc?.29+.17*rand():.46+.14*rand());let prev=[Math.sin(az)*w*.035,.004,Math.cos(az)*w*.035];const nodes=teasel?9:6;
  for(let j=1;j<=nodes;j++){
   const t=j/nodes,at=[Math.sin(az)*reach*t,height*t,Math.cos(az)*reach*t];b.branch(prev,at,teasel?.005*(1-t*.7):ceph?.002:.0012,stem,teasel?'teaselStem':'stem-scabious');prev=at;
   if(!dry&&s.leafDensity>0)for(const side of [0,1]){const an=az+j*Math.PI/2+side*Math.PI;leaf(at,an,L*(teasel?1-t*.55:.72-t*.35),false,.85+rand()*.35);}
   if(teasel){
    if(!dry)b.add('trumpet','leafCup',green,...at,.012,.009,.012);
    for(let k=0;k<3;k++){const an=az+k*TAU/3;b.branch(at,[at[0]+Math.sin(an)*.007,at[1]+.008,at[2]+Math.cos(an)*.007],.0007,'#b2b695','stemSpine');}
    if(j>=5&&j%2&&j<9)for(const side of [0,1]){const turn=az+j*Math.PI/2+side*Math.PI,tip=[at[0]+Math.sin(turn)*w*.35,at[1]+h*.16,at[2]+Math.cos(turn)*w*.35];b.branch(at,tip,.0026,stem,'teaselBranch');if(s.bloom||seed)scabiousHead(b,tip,a.flowerRadius*.76,a,s.flowerColor,{...kit,rand},rand(),turn,seed);}
   }
  }
  const active=s.bloom||seed||a.budMonths?.includes(s.month);if(!active)continue;
  for(let k=0;k<(teasel?1:cauc||low?2:3);k++){
   const az2=az+(k-1)*.78,tip=[prev[0]+Math.sin(az2)*w*(ceph?.12:.08),prev[1]+h*(teasel?.03:cauc?.35+.12*rand():low?.36+.10*rand():ceph?.29+.12*rand():.20+.14*rand()),prev[2]+Math.cos(az2)*w*(ceph?.12:.08)];b.branch(prev,tip,teasel?.0024:.0008,stem,'peduncle-scabious');
   if(!s.bloom&&!seed||(i+k)%9===0&&!teasel&&!seed){b.add('scabBud','flowerBud-scabious',succ?'#c3a4b5':'#8b9b67',...tip,a.flowerRadius*.37,a.flowerRadius*.18,a.flowerRadius*.37);continue;}
   let color=s.flowerColor;if(a.flowerPalette?.milky&&[3,4,10,11].includes(s.month))color='#dfcbd4';if(succ)color=new THREE.Color('#d8c1d8').lerp(new THREE.Color('#e5e4e4'),rand()).getStyle();
   scabiousHead(b,tip,a.flowerRadius*(.85+.15*rand()),a,color,{...kit,rand},rand(),az2,seed);
  }
 }
}

// Asteraceae use separate foliage silhouettes and inflorescence architectures.
export function asterLeafPoint(type,t,u){
 const sn=Math.max(0,Math.sin(Math.PI*t)),silver=['silverDust','jacobaea'].includes(type),thistle=['cottonThistle','artichoke','berkheya'].includes(type),mum=['crystalMum','frostyMum'].includes(type),fern=['cotula','leptinella','jurinea'].includes(type),spoon=['bellium','hieracium','raoulia'].includes(type);
 let width=.5*Math.pow(sn,spoon?.57:.78)*(spoon?.34+.78*t:1);
 if(silver||thistle||mum||fern||type==='berlandiera'||type==='amberboa'){
  const n=silver?3.8:thistle?4.3:mum?2.5:fern?8:type==='berlandiera'?2.8:3.4,depth=silver?.83:thistle?.61:mum?.47:fern?.92:.62;
  width*=1-depth+depth*Math.pow(.5+.5*Math.cos((t-.17)*TAU*n),silver?.5:thistle?.65:fern?2.2:.55);
 }
 if(['koreanAster','miyakowasure','giantDaisy','crystalMum','frostyMum','eupatorium'].includes(type))width*=.83+.17*((t*13)%1);
 if(type==='syneilesis')width*=.70+.30*((t*13)%1);
 return [u*width,t,(thistle?.14:silver?.10:.045)*u*u*sn+.07*t*t+.018*Math.sin(t*31)*u*u];
}

// Florets are one reusable geometry per head type, avoiding hundreds of meshes
// per capitulum. Tubes, corolla lobes and projecting styles remain distinguishable.
export function asterFloretGeometry(type,styles=false){
 const p=[],uv=[],ix=[],sphere=type==='craspedia',small=type==='eupatorium'||type==='syneilesis',mar=type==='marshallia',amber=type==='amberboa',cot=type==='cotula',n=sphere?240:small?7:mar?65:cot?80:170;
 const ribbon=(v,q,width)=>{const start=p.length/3;for(const plane of [0,1]){const b=p.length/3;for(const sign of [-1,1])for(const pt of [v,q]){p.push(pt[0]+(!plane?sign*width:0),pt[1],pt[2]+(plane?sign*width:0));uv.push(sign===1?1:0,pt===v?0:1);}ix.push(b,b+2,b+1,b+1,b+2,b+3);}return start;};
 for(let j=0;j<n;j++){
  const t=(j+.5)/n,az=j*2.39996,r=sphere?Math.sqrt(1-(1-2*t)**2):Math.sqrt(t)*(small?.55:.84),base=[Math.sin(az)*r,sphere?1-2*t:cot?.16*(1-t):.24*(1-t),Math.cos(az)*r];
  const direction=sphere?[base[0],base[1],base[2]]:[Math.sin(az)*(mar?.55:amber?.5:.17),1,Math.cos(az)*(mar?.55:amber?.5:.17)],len=sphere?.13:small?.7:mar?.50:cot?.11:amber&&t>.7?.6:.42,end=base.map((v,k)=>v+direction[k]*len),thick=sphere?.021:small?.08:cot?.035:.026;
  if(styles){
   const tip=end.map((v,k)=>v+direction[k]*(small?.5:mar?.30:.18));ribbon(end,tip,small?.014:.008);
   for(const side of [-1,1])ribbon(tip,[tip[0]+Math.cos(az)*side*(small?.2:.07),tip[1]+.10,tip[2]-Math.sin(az)*side*(small?.2:.07)],small?.010:.006);
  }else{
   ribbon(base,end,thick);
   for(let k=0;k<5;k++){const a=az+k*TAU/5,flare=small?.13:sphere?.055:mar?.15:amber?.22:cot?.052:.075;
    ribbon(end,[end[0]+Math.sin(a)*flare,end[1]+(mar?.11:small?.10:.045),end[2]+Math.cos(a)*flare],thick*.42);
   }
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.asterFlorets=type;return g;
}

function asterHead(b,{at,r,type,color,tone=.5,yaw=0},kit){
 const {rand,bud,shade}=kit,f=flowerFrame(b,at,(rand()-.5)*.30,yaw),double=['crystalMum','frostyMum','peacockAster'].includes(type),ligulate=type==='hieracium',thistle=['artichoke','cottonThistle','jurinea'].includes(type),rayless=thistle||['craspedia','cotula','raoulia','leptinella','amberboa','marshallia','eupatorium','syneilesis'].includes(type),carrot=type==='carrotCone',berk=type==='berkheya',berl=type==='berlandiera',spider=type==='echibeckia';
 const flowerColor=carrot?new THREE.Color('#d88a50').lerp(new THREE.Color('#c36c8d'),tone).getStyle():color;
 if(rayless){
  const shape=['raoulia','leptinella'].includes(type)?'cotula':thistle?'thistle':type,sy=type==='craspedia'?1:type==='amberboa'?.8:1;
  f.add(shape+'Florets','petal-aster-florets',flowerColor,0,0,0,r,r*sy,r);
  if(!['craspedia','cotula','raoulia','leptinella'].includes(type))f.add(shape+'Styles','style-aster',type==='eupatorium'||type==='syneilesis'?'#eee5df':type==='marshallia'?'#decde2':'#d5b2d5',0,0,0,r,r*sy,r);
  if(type==='craspedia')f.add(bud,'receptacle','#c3b13e',0,0,0,r*.94,r*.94,r*.94);
  else f.add(bud,'involucre',thistle?'#789071':'#799054',0,-r*.20,0,r*(thistle?.85:.77),r*(thistle?.65:.26),r*(thistle?.85:.77));
  if(thistle||type==='amberboa'){
   const large=type==='artichoke',rings=large?5:3;
   for(let k=0;k<rings;k++)for(let j=0;j<11;j++){
    const az=j*TAU/11+k*.43,rr=r*(.68+.07*k),yy=r*(-.67+k*.14);
    f.add('asterBerkheya','involucre-scale',large?shade(rand,'#798666',.10):'#a0b1a0',Math.sin(az)*rr,yy,Math.cos(az)*rr,r*(large?.64:.19),r*(large?.67:.48),r*(large?.67:.48),large?.20:.88,az,0);
    if(!large)f.branch([Math.sin(az)*rr,yy+r*.12,Math.cos(az)*rr],[Math.sin(az)*r*1.1,yy+r*.38,Math.cos(az)*r*1.1],r*.009,'#c1b29a','spine');
   }
  }
  return;
 }
 const rays=type==='bellium'?14:berl?8:spider?27:berk?28:type==='miyakowasure'?15:type==='giantDaisy'?25:type==='koreanAster'?30:carrot?15:type==='silverDust'||type==='jacobaea'?11:double?24:30,rings=double?4:ligulate?4:1,disk=berk?.40:berl?.38:spider?.21:carrot?.47:.28;
 f.add(bud,'involucre','#6a814f',0,-r*.1,0,r*.30,r*.17,r*.30);
 for(let ring=0;ring<rings;ring++)for(let j=0;j<rays-Math.floor(ring*3);j++){
  const count=rays-Math.floor(ring*3),az=j*TAU/count+ring*.43+(rand()-.5)*.09,len=r*(.88-ring*.135)*( .92+rand()*.13),co=double&&ring>1?new THREE.Color(flowerColor).lerp(new THREE.Color('#ece1e2'),ring*.065).getStyle():flowerColor;
  f.add(ligulate||berl?'daisyShallowRay':'daisyRoundRay',spider?'petal-daisy-eye-97584f-60':'petal-aster-rays',shade(rand,co,.045),Math.sin(az)*r*.12,r*ring*.055,Math.cos(az)*r*.12,len*(spider?.085:berk?.23:carrot?.28:berl?.50:double?.28:.27),len,len,carrot?.35:-ring*.19+(rand()-.5)*.13,az,0);
 }
 if(carrot){
  f.add(bud,'receptacle-inner',flowerColor,0,r*.30,0,r*.51,r*.48,r*.51);
  // A raised cushion of narrow inner ray florets, with an outer drooping skirt.
  for(let j=0;j<190;j++){
   const t=(j+.5)/190,az=j*2.39996,rr=r*.60*Math.sqrt(t),yy=r*(.17+.68*Math.sqrt(1-t)),length=r*(.13+.11*t);
   f.add('daisyRoundRay','petal-aster-inner',shade(rand,flowerColor,.04),Math.sin(az)*rr,yy,Math.cos(az)*rr,length*.45,length,length,-.95+1.1*t,az,0);
  }
 }else if(!double&&!ligulate){
  const center=berk?'#443449':berl?'#83915b':spider?'#4c373c':'#b1a545';
  f.add(bud,'disc-aster',center,0,r*.05,0,r*disk,r*(spider?.22:.1),r*disk);
  for(let j=0;j<64;j++){const t=(j+.5)/64,az=j*2.39996,rr=r*disk*Math.sqrt(t),at=[Math.sin(az)*rr,r*(.09+(spider?.17:.08)*(1-t)),Math.cos(az)*rr];
   f.add(bud,'discFloret-aster',berl&&t>.6?'#7e453b':center,...at,r*.027,r*.046,r*.027);
   if(j%2===0)f.add(bud,'anther-aster',berk?'#eee7dc':'#d9bf63',at[0],at[1]+r*.04,at[2],r*.012,r*.018,r*.012);
  }
 }
 if(berl||berk)for(let j=0;j<(berl?8:13);j++)f.add(berl?'asterBellium':'asterBerkheya','involucre-leaf','#819862',0,-r*.16,0,r*(berl?.72:.30),r*.80,r*.80,1.45,j*TAU/(berl?8:13),0);
}

function drawAsteraceae(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,type=a.shootProfile,w=s.spread,h=s.height,green=s.leafColor,stem=a.stemColor,lk=foliageKind(info),winter=[12,1,2].includes(s.month),basalWinter=a.persistence==='semiDormant'&&winter,mat=['cotula','raoulia','bellium','leptinella'].includes(type),rosette=['artichoke','cottonThistle','craspedia','hieracium','berkheya','jurinea','marshallia','berlandiera'].includes(type),thistle=['artichoke','cottonThistle','berkheya'].includes(type),mum=['crystalMum','frostyMum'].includes(type),heads=[],mix=(a,b,t)=>a.map((v,k)=>v+(b[k]-v)*t),point=(az,r,y)=>[Math.sin(az)*r,y,Math.cos(az)*r];
 const len=Math.min(a.leafLength,w*(type==='syneilesis'?.8:.57))*s.leafScale,wide=len*a.leafWidth/a.leafLength;
 const branch=(v,q,r=.0008,kind='stem')=>b.branch(v,q,r,stem,kind);
 const leaf=(at,yaw,scale=1,pitch=1.15)=>{
  const L=len*scale,W=wide*scale,f=flowerFrame(b,at,-pitch,yaw),shape=a.leafShape;
  if(type==='leptinella'){
   f.branch([0,0,0],[0,L,0],.00017,'#868264','leafRachis');
   for(let n=0;n<10;n++)for(const side of [-1,1]){const t=(n+.8)/11,co=n>7?'#89975b':green;f.add('asterBellium',lk,kit.shade(rand,co,.05),0,L*t,0,W*.5,L*.16,L*.16,0,0,side*1.12);}
  }else if(type==='eupatorium'){
   f.add(shape,lk,green,0,0,0,W*.39,L,L);
   for(const side of [-1,1])f.add(shape,lk,green,0,L*.14,0,W*.29,L*.64,L*.64,0,0,side*.66);
  }else{
   f.add(shape,lk,kit.shade(rand,green,.055),0,0,0,W,L,L,0,0,(rand()-.5)*.07);
   if(thistle){
    for(let n=0;n<9;n++)for(const side of [-1,1]){const t=.15+n*.085,q=asterLeafPoint(type,t,side),from=[q[0]*W,q[1]*L,q[2]*L],to=[from[0]+side*L*.032,from[1]+L*.025,from[2]+L*.01];f.branch(from,to,L*.0011,'#c4b399','spine');}
   }
   if(type==='hieracium')for(let j=0;j<18;j++){const t=.1+rand()*.78,u=rand()*2-1,q=asterLeafPoint(type,t,u),v=[q[0]*W,q[1]*L,q[2]*L];f.branch(v,[v[0]+(rand()-.5)*.002,v[1]+.001,v[2]+.0035],.000055,'#dbe1ce','leafHair');}
  }
 };
 const showHead=(base,end,az)=>heads.push({base,end,az,tone:rand(),chance:rand()});
 if(type==='syneilesis'){
  const emerging=[3,4].includes(s.month),n=Math.max(3,Math.round(7*detail));
  for(let i=0;i<n;i++){
   const az=i*2.39996,r=w*(.10+.25*Math.sqrt((i+.5)/n)),end=point(az,r,h*(emerging?.22:.52+.12*rand()));branch(point(az,r*.7,0),end,.0022,'petiole');
   const R=len*.5*(emerging?.70:1),f=flowerFrame(b,end,0,az);
   for(let j=0;j<8;j++){const aa=j*TAU/8;f.add('asterSyneilesis',lk,green,0,0,0,R*.46,R,R,emerging?-2.70:-1.43,aa,0);
    if(emerging)for(let k=0;k<6;k++){const t=.16+k*.13;f.branch(point(aa,R*.30*t,-R*t),point(aa,R*.30*t+.004,-R*t-.003),.00009,'#d1d6bc','budHair');}}
   if(s.bloom){const top=point(az,r,h*(.87+rand()*.10));branch(end,top,.0014);for(let j=0;j<11;j++){const b0=mix(end,top,.42+j*.045),aa=az+j*2.4,q=[b0[0]+Math.sin(aa)*w*.07,b0[1]+h*.08,b0[2]+Math.cos(aa)*w*.07];showHead(b0,q,aa);}}
  }
 }else if(mat){
  const tiny=type==='raoulia',count=Math.max(25,Math.round((tiny?2400:type==='leptinella'?500:180)*detail));
  for(let i=0;i<count;i++){
   const az=i*2.39996+(rand()-.5)*.45,r=w*.46*Math.sqrt((i+.5)/count)*( .93+rand()*.07),base=point(az,r,0),y=tiny?h*(.45+rand()*.3):h*(type==='bellium'?.07:.16),top=point(az,r,y);branch(base,top,tiny?.00023:.0005,'creepingStem');
   for(let j=0;j<(tiny?8:type==='leptinella'?2:5);j++)leaf(top,rand()*TAU,.7+rand()*.3,.60+rand()*.70);
   if(s.bloom&&i%5===0)showHead(top,point(az,r,h*(.72+rand()*.24)),az);
  }
 }else if(rosette){
  const n=Math.max(1,Math.round((type==='artichoke'||type==='cottonThistle'?1:type==='craspedia'?7:type==='hieracium'?7:5)*detail)),first=s.biennialRosette;
  for(let i=0;i<n;i++){
   const az=i*2.39996,rr=w*(n===1?.02:.26*Math.sqrt((i+.5)/n)),base=point(az,rr,.012);
   for(let j=0;j<(type==='craspedia'?15:thistle?13:9);j++)if(rand()<Math.max(.3,s.leafDensity))leaf(base,j*2.399+az,.68+rand()*.32,basalWinter||first?1.28:thistle?1.06+rand()*.36:.55+rand()*.85);
   if(basalWinter||first||!s.bloom&&!a.seedHeadMonths?.includes(s.month)&&s.month!==a.flowerMonths[0]-1)continue;
   const top=point(az,rr*1.3,h*(.72+rand()*.2)),middle=mix(base,top,.52),stemR=type==='artichoke'?.013:type==='cottonThistle'?.008:type==='craspedia'?.0012:.0021;branch(base,middle,stemR);branch(middle,top,stemR*.65);
   if(type!=='craspedia')for(let j=0;j<7;j++){const t=.10+j*.10,at=mix(base,top,t),aa=az+j*2.399;leaf(at,aa,(1-t)*.73,.83);
    if(thistle){const f=flowerFrame(b,at,0,aa);f.add(a.leafShape,'stemWing',green,0,0,0,len*.15,h*.10,h*.10,0,0,0);}
   }
   if(type==='hieracium')for(let j=0;j<50;j++){const t=rand(),at=mix(base,top,t),aa=j*2.399;branch(at,[at[0]+Math.sin(aa)*.005,at[1]+.002,at[2]+Math.cos(aa)*.005],.00006,'stemHair');}
   showHead(middle,top,az);
   if(type!=='craspedia')for(let j=0;j<(thistle?5:3);j++){const t=.53+j*.07,at=mix(base,top,t),aa=az+j*2.399,end=[at[0]+Math.sin(aa)*w*(thistle?.20:.15),Math.min(h*.98,at[1]+h*.20),at[2]+Math.cos(aa)*w*(thistle?.20:.15)];branch(at,end,stemR*.35);showHead(at,end,aa);}
  }
 }else{
  const silver=['jacobaea','silverDust'].includes(type),n=Math.max(4,Math.round((mum?17:silver?10:type==='peacockAster'?9:12)*detail));
  for(let i=0;i<n;i++){
   const az=i*2.39996,r=w*(.07+.32*Math.sqrt((i+.5)/n)),base=point(az,r*.18,.006),end=point(az,r,h*(basalWinter?.04+rand()*.04:(mum?.50:silver?.43:.68)+rand()*.15));branch(base,end,silver?.0022:mum?.0016:.0013);
   const nodes=silver?7:mum?9:11;
   for(let j=0;j<nodes;j++){
    const t=.12+j*.78/nodes,at=mix(base,end,t),aa=az+j*2.399;
    if(!(type==='peacockAster'&&s.month>=9&&j<3)&&rand()<s.leafDensity)for(let side=0;side<(type==='eupatorium'?2:1);side++)leaf(at,aa+side*Math.PI,(.85-.35*t)*(basalWinter?.6:1),.77+rand()*.55);
    if(j<4||j%2===0||basalWinter)continue;
    const tip=[at[0]+Math.sin(aa)*w*.12,at[1]+h*.16,at[2]+Math.cos(aa)*w*.12];branch(at,tip,.0006);leaf(mix(at,tip,.45),aa,.5,.82);showHead(tip,[tip[0],tip[1]+h*.10,tip[2]],aa);
   }
   if(!basalWinter)showHead(end,[end[0],Math.min(h-a.flowerRadius,end[1]+h*.15),end[2]],az);
  }
 }
 if(s.bloom)for(const q of heads){
  if(q.chance>(s.flowerDensity||1)*.82)continue;
  branch(q.base,q.end,Math.min(.0012,h*.003),'peduncle');
  if(type==='eupatorium'||['silverDust','jacobaea'].includes(type)){
   const cluster=type==='eupatorium'?17:8,reach=type==='eupatorium'?.034:.025;
   for(let j=0;j<cluster;j++){const aa=j*2.399,rr=reach*Math.sqrt((j+.5)/cluster),at=[q.end[0]+Math.sin(aa)*rr,q.end[1]+reach*.35*(1-rr/reach),q.end[2]+Math.cos(aa)*rr];branch(q.end,at,.00035,'inflorescenceAxis');asterHead(b,{at,r:a.flowerRadius,type,color:info.flower,tone:q.tone,yaw:aa},{...kit,rand});}
  }else asterHead(b,{at:q.end,r:a.flowerRadius,type,color:info.flower,tone:q.tone,yaw:q.az},{...kit,rand});
 }
 if(type==='jurinea'&&a.seedHeadMonths?.includes(s.month))for(const q of heads.filter((_,i)=>i%2===0)){
  branch(q.base,q.end,.0009,'seedStem');for(let j=0;j<55;j++){const y=1-2*(j+.5)/55,rr=Math.sqrt(1-y*y),az=j*2.399,R=a.flowerRadius*1.2,end=q.end.map((v,k)=>v+[Math.sin(az)*rr,y,Math.cos(az)*rr][k]*R);b.branch(q.end,end,.00010,'#dddccf','pappus');for(let k=0;k<3;k++)b.branch(end,[end[0]+Math.sin(k*2.1)*R*.23,end[1]+R*.15,end[2]+Math.cos(k*2.1)*R*.23],.00005,'#e7e5da','pappusHair');}
 }
}


// Cultivar heads: true-size rays, teeth, overlapping pompons and tubular discs.
// Flower age varies within a clump; temperature colour is only a seasonal guide.
export function daisyRayPoint(type,t,u){
 const broad=type==='daisyNotchedRay',notch=type==='daisyShallowRay'?.045:broad?.15:.018,sn=Math.max(0,Math.sin(t*Math.PI));
 const edge=1-notch*Math.pow(.5+.5*Math.cos((u+1)*Math.PI*(broad?4:3)),8)*Math.pow(t,8),width=.5*Math.pow(sn,broad?.36:.58)*(.35+.65*t);
 return [u*width,.075*u*u*sn+.032*Math.sin(u*18)*sn+.09*t*t,t*edge];
}
export function daisyLeafPoint(type,t,u){
 const sn=Math.max(0,Math.sin(Math.PI*t)),cut=['brachyFine','brachyBroad','brachyRound','margueriteCut'].includes(type),round=type==='brachyRound',narrow=type==='brachyFine'||type==='margueriteCut',lobes=type==='margueriteCut'?5:round?2:4;
 let width=.5*Math.pow(sn,type==='gazaniaSpoon'?.48:.78)*(type==='gazaniaSpoon'?.38+t*.65:1);
 if(cut)width*=.09+.91*Math.pow(.5+.5*Math.cos((t-.18)*TAU*lobes),narrow?3.2:round?.55:1.7);
 if(type==='bidensCut')width*=.38+.62*Math.pow(.5+.5*Math.cos((t-.2)*TAU*2),.55);
 if(type==='osteoToothed'||type==='bidensCut')width*=.82+.18*((t*9)%1);
 return [u*width,t,.045*u*u*sn+.07*t*t+(type==='gazaniaSpoon'?.055*Math.abs(u)*sn:0)];
}

function drawDaisyBranches(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,type=a.shootProfile,coreo=type.startsWith('coreopsis'),brachy=type.startsWith('brachy'),gaz=type==='gazaniaSpoon',osteo=type==='osteoToothed',marg=type==='margueriteCut',grand=type==='coreopsisGrandiflora',winter=a.persistence==='semiDormant'&&[12,1,2].includes(s.month)&&!s.bloom,h=s.height,w=s.spread,green=s.leafColor,leafKind=foliageKind(info),st=a.stemColor;
 const L=Math.min(a.leafLength,h*(gaz?.7:.35),w*.3)*s.leafScale,W=L*a.leafWidth/a.leafLength,sites=[];
 const mix=(v,q,t)=>v.map((x,k)=>x+(q[k]-x)*t),point=(az,r,y)=>[Math.sin(az)*r,y,Math.cos(az)*r];
 const line=(v,q,r,part='stem')=>b.branch(v,q,r,st,part);
 const leaf=(at,az,size=1,split=false)=>{
  const f=flowerFrame(b,at,-(.72+rand()*.75),az),len=L*size;
  if(split){
   f.branch([0,0,0],[0,len*.8,0],.00023,green,'leafRachis');
   f.add('coreopsisFine',leafKind,green,0,len*.33,0,W*.67,len*.67,len,0,0,0);
   for(let q=0;q<(type==='coreopsisPinnate'?2:1);q++)for(const side of [-1,1])f.add('coreopsisFine',leafKind,kit.shade(rand,green,.035),0,len*(.22+q*.2),0,W*.6,len*(.58-q*.12),len,0,0,side*(.65+q*.1));
  }else f.add(type,leafKind,kit.shade(rand,green,.055),0,0,0,W*size,len,len,0,0,(rand()-.5)*.25);
 };
 const stems=Math.max(8,Math.round((brachy?38:gaz?24:grand?23:marg?19:30)*detail));
 for(let stem=0;stem<stems;stem++){
  const az=stem*2.39996+rand()*.28,radius=w*(.045+.38*Math.sqrt((stem+.5)/stems)),height=h*(winter?.045+rand()*.06:(brachy?.28:coreo?.47:.40)+rand()*(brachy?.35:coreo?.27:.32)),base=point(az,radius*(gaz?.54:brachy?.40:coreo?.32:.22),.005),mid=point(az+.07,radius*.62,height*.5),tip=point(az,radius,height);
  if(gaz){
   const crown=point(az,radius*.66,h*(.08+rand()*.28));line(base,crown,.0014,'stem');for(let j=0;j<9;j++)leaf(mix(base,crown,.4+j/15),az+j*2.399,.82+rand()*.18);
   sites.push({base:crown,end:point(az,radius,h*(.70+rand()*.23)),tone:rand(),chance:rand(),yaw:az});continue;
  }
  line(base,mid,Math.min(.0012,h*.005),marg||osteo?'wood-daisy-base':'stem');line(mid,tip,Math.min(.0008,h*.003));
  const nodes=brachy?8:grand?9:coreo?7:6;
  for(let n=0;n<nodes;n++){
   const t=.12+n*.83/nodes,at=t<.5?mix(base,mid,t*2):mix(mid,tip,(t-.5)*2),yaw=az+n*(coreo||type==='bidensCut'?Math.PI/2:2.39996);
   for(let side=0;side<(a.arrangement==='opposite'?2:1);side++)if(rand()<s.leafDensity)leaf(at,yaw+side*Math.PI,(.7+rand()*.3)*(winter?.70:1),coreo&&(type==='coreopsisPinnate'||grand&&n>4||type==='coreopsisBroad'&&n%3===1));
   if(n<2||n>nodes-2||winter)continue;
   for(let side=0;side<(brachy?2:1);side++){
    const aa=yaw+(side?1:-1)*.75,reach=Math.min(w*.16,L*(brachy?2.2:2.6)),end=[at[0]+Math.sin(aa)*reach,Math.min(h*.86,at[1]+h*(brachy?.07:.10)),at[2]+Math.cos(aa)*reach];line(at,end,.00045);
    for(let j=1;j<=4;j++)if(rand()<s.leafDensity)leaf(mix(at,end,j/5),aa+j*2.1,.6+rand()*.2,coreo&&type==='coreopsisPinnate');
    if(n%2===1)sites.push({base:end,end:[end[0]+Math.sin(aa)*L*.5,Math.min(h-a.flowerRadius,end[1]+h*(brachy?.30:coreo?.18:.25)),end[2]+Math.cos(aa)*L*.5],tone:rand(),chance:rand(),yaw:aa});
   }
  }
  if(!winter)sites.push({base:tip,end:[tip[0],Math.min(h-a.flowerRadius,tip[1]+h*(brachy?.33:coreo?.18:.24)),tip[2]],tone:rand(),chance:rand(),yaw:az});
 }
 if(!s.bloom)return;
 for(const q of sites){
  if(q.chance>(s.flowerDensity??1)*.8)continue;
  line(q.base,q.end,Math.min(.00065,h*.0024),'peduncle');
  const pal={...a.flowerPalette},pattern=pal.profile,age=q.tone,autumn=[9,10,11].includes(s.month),hot=[7,8].includes(s.month);let color=info.flower;
  const blend=(first,last,t)=>new THREE.Color(first).lerp(new THREE.Color(last),t).getStyle();
  if(pattern==='ageOrange')color=blend(info.flower,'#d58b50',age);
  if(pattern==='agePink')color=blend(info.flower,'#d79fb8',age);
  if(pattern==='ageCream')color=blend(info.flower,'#eee4bb',age);
  if(pattern==='summerPale')color=hot?'#e8dfe1':'#d3b0cd';
  if(pattern==='redSatin')color=autumn?'#862440':'#ae3e66';
  pal.coverage=pattern==='rim'?.85:pattern==='cosmic'?(autumn?.60:.18)+age*.2:pattern==='redShift'?(autumn?.62:.22)+age*.16:pattern==='starEye'?.16+age*.27:pattern==='goldBase'?.36:.48;
  if(pattern==='redShift'&&!autumn)color=blend('#eee4c1','#e0cb74',age);
  if(pattern==='starEye'&&age>.77)pal.rim=pal.base;
  detailedFlower(b,{x:q.end[0],y:q.end[1],z:q.end[2],r:a.flowerRadius*(.90+age*.10),color,shape:'daisyCultivarHead',palette:pal,tilt:(rand()-.5)*.65,yaw:q.yaw},{...kit,rand});
 }
}


// Myrtaceae share floral structures, but their leaf blades, phyllotaxy and
// branching are kept separate. Units are metres after instancing.
export function myrtaceousLeafPoint(type,t,u){
 const s=Math.pow(Math.max(0,Math.sin(Math.PI*t)),type==='feijoaOval'?.53:type==='teaBlunt'?.55:1.02),blunt=type==='feijoaOval'||type==='teaBlunt';
 const width=.5*s*(blunt?.87+.14*t:1.03-.16*t),curl=type==='feijoaOval'?.10:type==='teaBlunt'?.16:.045;
 return [u*width,t,curl*u*u*s+.035*t*t];
}

// One shared mesh contains each flower's fine filaments, including the five
// joined staminal bundles of Melaleuca. Tips are separate yellow anthers.
export function myrtaceousFlowerGeometry(type,part){
 const p=[],uv=[],ix=[];
 const ribbon=(points,width)=>{
  for(let plane=0;plane<2;plane++){
   const start=p.length/3;
   for(let j=0;j<points.length;j++)for(const sign of [-1,1]){
    const v=points[j];p.push(v[0]+(plane?0:sign*width/2),v[1],v[2]+(plane?sign*width/2:0));uv.push(sign===1?1:0,j/(points.length-1));
    if(j<points.length-1&&sign===-1){const k=start+j*2;ix.push(k,k+1,k+2,k+1,k+3,k+2);}
   }
  }
 };
 const dot=(v,r)=>{const start=p.length/3;for(const q of [[-r,0,0],[r,0,0],[0,r,0],[0,0,r],[0,0,-r]]){p.push(v[0]+q[0],v[1]+q[1],v[2]+q[2]);uv.push(.5,.5);}ix.push(start,start+2,start+3,start+1,start+3,start+2,start,start+4,start+2,start+1,start+2,start+4);};
 const line=(base,end,bend=.02,width=.007)=>{
  const points=[];for(let j=0;j<=5;j++){const t=j/5;points.push(base.map((v,k)=>v+(end[k]-v)*t+(k===1?bend*Math.sin(t*Math.PI):0)));}
  if(part==='filaments')ribbon(points,width);else dot(end,width*1.7);
 };
 const brush=type.endsWith('Brush'),claws=type==='thymifoliaStamens';
 if(brush){
  const call=type==='callistemonBrush',lin=type==='linariifoliaBrush',squar=type==='squarrosaBrush',flowers=call?28:15,hairs=call?22:lin?36:squar?9:20;
  for(let flower=0;flower<flowers;flower++){
   const az=flower*2.39996,y=.06+.87*(flower+.5)/flowers,base=[Math.sin(az)*.035,y,Math.cos(az)*.035];
   for(let bundle=0;bundle<(call?1:5);bundle++){
    const bAngle=bundle*TAU/5;
    const root=[base[0]+Math.sin(az)*.045,base[1]+Math.sin(bAngle)*.022,base[2]+Math.cos(az)*.045];
    if(part==='filaments'&&!call)ribbon([base,root],.009);
    for(let k=0;k<hairs;k++){
     const a=az+(call?(k/(hairs-1)-.5)*2:(bundle-2)*.18+(k/(hairs-1)-.5)*.65),r=(call?.36:lin?.40:squar?.26:.31)*( .84+.16*Math.sin(flower*3.7+k*2.9)**2),end=[base[0]+Math.sin(a)*r,y+Math.cos(k*2.399+bAngle)*r*.5,base[2]+Math.cos(a)*r];
     line(root,end,.028,call?.006:.004);
    }
   }
  }
 }else if(claws){
  for(let bundle=0;bundle<5;bundle++){
   const az=bundle*TAU/5,root=[Math.sin(az)*.32,.10,Math.cos(az)*.32];
   if(part==='filaments')ribbon([[0,0,0],root],.06);
   for(let k=0;k<40;k++){
    const angle=az+(k/39-.5)*1.03,reach=.74+.24*Math.sin(k*2.399)**2,points=[];
    for(let j=0;j<=8;j++){
     const t=j/8,r=.32+(reach-.32)*Math.sin(t*Math.PI*.70),y=.10+.25*t+.23*Math.pow(t,3);points.push([Math.sin(angle)*r,y,Math.cos(angle)*r]);
    }
    if(part==='filaments')ribbon(points,.007);else dot(points.at(-1),.011);
   }
  }
 }else{
  const feij=type==='feijoaStamens',myrt=type==='myrtusStamens',count=feij?38:myrt?85:35;
  for(let k=0;k<count;k++){
   const an=k*2.39996,rad=(feij?.46:myrt?.78:.40)*Math.sqrt((k+.6)/count),y=feij?1.28-rad*.20:myrt?.84-rad*.37:.30;
   line([Math.sin(an)*.10,0,Math.cos(an)*.10],[Math.sin(an)*rad,y,Math.cos(an)*rad],.10,feij?.022:myrt?.011:.009);
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.myrtaceousFlower=type;g.userData.part=part;return g;
}

function drawMyrtaceousTree(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,type=a.shootProfile,feijoa=type==='feijoa',myrtus=type==='myrtus',tea=['brachyandrum','scoparium','lanigerum'].includes(type),low=type==='thymifolia',formanii=type==='formanii',fine=!feijoa&&!myrtus,wide=a.habit==='spreading'||a.habit==='arching',upright=a.habit==='upright';
 const leafLength=Math.min(a.leafLength,h*.13,w*.13),wood=a.barkColor,young=a.stemColor,sites=[],flowers=[];
 const mix=(a,b,t)=>a.map((v,k)=>v+(b[k]-v)*t),rad=(az,r,y)=>[Math.sin(az)*r,y,Math.cos(az)*r];
 const curve=(points,r,youngBranch=false)=>{for(let k=1;k<points.length;k++)b.branch(points[k-1],points[k],r*(1-.5*k/points.length),youngBranch?young:wood,youngBranch?'wood-myrtaceous-shoot':'wood-'+a.barkPattern);};
 const trunks=feijoa?3:low?5:4;
 for(let main=0;main<trunks;main++){
  const az=main*2.399+.1*rand(),base=rad(az,w*.025,.004),fork=rad(az,w*.07,h*(low?.07:feijoa?.22:.13)),radius=Math.min(.026,h*(low?.008:.013));
  curve([base,rad(az+.08,w*.042,fork[1]*.6),fork],radius);
  for(let arm=0;arm<(fine?7:6);arm++){
   const an=az+(arm-3)*.61+(rand()-.5)*.27,reach=w*((feijoa||myrtus)?(arm<2?.13+rand()*.10:.26+rand()*.11):arm<2?.05+arm*.10:upright?.18+rand()*.1:.25+rand()*.13),top=h*((feijoa||myrtus)?(arm<2?.80+rand()*.10:.47+rand()*.30):low?(arm>3?.22+rand()*.24:.58+rand()*.32):arm===0?.94:.45+rand()*.38),end=rad(an,reach,top),bend=mix(fork,end,.5);bend[1]+=h*(wide?.06:.015);
   curve([fork,bend,end],radius*.47);
   const count=Math.max(4,Math.round((fine?14:12)*detail));
   for(let twig=0;twig<count;twig++){
    const t=.16+.82*(twig+.12+rand()*.75)/count,at=t<.5?mix(fork,bend,t*2):mix(bend,end,(t-.5)*2),angle=an+(twig%2?1:-1)*(.48+rand()*.67),reach=Math.min(w*(wide?.20:.15),fine?.23:.34)*(.57+rand()*.65),tip=[at[0]+Math.sin(angle)*reach,Math.min(h-leafLength*.5,at[1]+h*(low?.07:wide?.035+rand()*.10:.08+rand()*.08)),at[2]+Math.cos(angle)*reach];
    const r=Math.hypot(tip[0],tip[2]),limit=w*.47-leafLength*.60;if(r>limit){tip[0]*=limit/r;tip[2]*=limit/r;}
    curve([at,mix(at,tip,.5),tip],Math.min(fine?.0006:.0023,h*.0017),true);
    const nodes=fine?24:11;
    for(let n=0;n<nodes;n++){
     const u=.08+.9*(n+.5)/nodes,node=mix(at,tip,u),opposite=a.arrangement==='opposite',number=formanii&&n>10?3:opposite?2:1;
     for(let side=0;side<number;side++)sites.push({at:node,yaw:angle+side*TAU/number+n*(number>1?Math.PI/2:2.39996),pitch:.70+rand()*.80,roll:(rand()-.5)*.4,size:.76+rand()*.24,tone:rand(),chance:rand(),young:n>nodes-3});
     if((feijoa||myrtus)&&n%3===2){
      const forkAngle=angle+(n%2?1:-1)*(.65+rand()*.65),forkLength=leafLength*(1.1+rand()*.8),last=[node[0]+Math.sin(forkAngle)*forkLength,node[1]+forkLength*(.35+rand()*.4),node[2]+Math.cos(forkAngle)*forkLength];curve([node,last],.00065,true);
      for(let j=1;j<=4;j++)for(let side=0;side<2;side++)sites.push({at:mix(node,last,j/4),yaw:forkAngle+side*Math.PI+j*Math.PI/2,pitch:.6+rand()*1.15,roll:(rand()-.5)*.65,size:.77+rand()*.23,tone:rand(),chance:rand(),young:j===4});
     }
     // Fine twiglets carry true-size small leaves, not enlarged broad blades.
     if(fine&&n%4===1)for(let sideTwig=0;sideTwig<(low?2:1);sideTwig++){
      const an2=angle+(sideTwig?1:-1)*( .7+rand()*.8),shortEnd=[node[0]+Math.sin(an2)*reach*.35,node[1]+h*(.016+rand()*.032),node[2]+Math.cos(an2)*reach*.35];curve([node,shortEnd],.00020,true);
      const littleNodes=low?10:5;for(let q=1;q<=littleNodes;q++)for(let side=0;side<(opposite?2:1);side++)sites.push({at:mix(node,shortEnd,q/littleNodes),yaw:an2+side*Math.PI+q*(opposite?1.57:2.399),pitch:.8+rand()*.7,roll:0,size:.66+rand()*.24,tone:rand(),chance:rand(),young:q===5});
     }
     if((feijoa?n===1||n===3:low?n===5||n===10:myrtus||tea?n===nodes-3:n===nodes-2))flowers.push({at:node,yaw:angle,pitch:.25+rand()*.95,tone:rand(),chance:rand()});
    }
   }
  }
 }
 const leafKind=['bracteata','linariifolia','squarrosa','callistemon'].includes(type)?'leaf-myrtaceae-veins':foliageKind(info);
 for(const q of sites){
  if(q.chance>s.leafDensity)continue;
  const len=leafLength*q.size*s.leafScale,color=q.young&&a.springShootColor&&(a.flushMonths||[]).includes(s.month)?a.springShootColor:s.leafColor,petiole=len*(feijoa?.12:myrtus?.06:.025),at=[q.at[0]+Math.sin(q.yaw)*petiole,q.at[1]+petiole*.23,q.at[2]+Math.cos(q.yaw)*petiole];
  if(feijoa||myrtus)b.branch(q.at,at,Math.min(.0007,len*.011),young,'petiole');
  b.add(a.leafShape,leafKind,kit.shade(()=>q.tone,color,.06),...at,len*a.leafWidth/a.leafLength,len,len,-q.pitch,q.yaw,q.roll);
 }
 const fruit=(a.fruitMonths||[]).includes(s.month);
 if(!s.bloom&&!fruit)return;
 for(const q of flowers){
  if(q.chance>(fruit?.08:(s.flowerDensity??1)*(feijoa?.30:myrtus?.28:tea?.55:low?.35:.24)))continue;
  const r=a.flowerRadius||.01,end=[q.at[0]+Math.sin(q.yaw)*r,q.at[1]+r,q.at[2]+Math.cos(q.yaw)*r];
  if(fruit){
   const fr=a.fruitRadius;b.branch(q.at,[end[0],end[1]-fr*.45,end[2]],.0006,young,'fruitPedicel');
   b.add(kit.bud,'fruit',a.fruitColor,end[0],end[1]-fr*1.3,end[2],fr*(feijoa?.63:1),fr,fr*(feijoa?.63:1),.20,q.yaw,0);
   if(feijoa)for(let k=0;k<4;k++)b.add('teaBlunt','persistentCalyx','#867b5e',end[0],end[1]-fr*2.22,end[2],fr*.26,fr*.27,fr*.27,1.85,q.yaw+k*TAU/4,0);
   continue;
  }
  b.branch(q.at,end,.0006,young,'peduncle');
  const frame=flowerFrame(b,end,q.pitch,q.yaw),cp=a.flowerPalette,kind=feijoa?'feijoaStamens':myrtus?'myrtusStamens':tea?'teaStamens':low?'thymifoliaStamens':type+'Brush',scale=(feijoa||myrtus||tea||low)?r:a.inflorescenceLength;
  if(feijoa||myrtus||tea){
   const petals=feijoa?4:5;
   for(let k=0;k<petals;k++){
    const an=k*TAU/petals;
    frame.add('myrtaceousPetal',feijoa?'petal-feijoa-outside-f5efdf':'petal-myrtaceous',feijoa?'#bc547c':'#f5f0df',0,0,0,r,r,r,0,an,0);
    if(feijoa)frame.add('teaBlunt','sepal','#a4ab8d',0,-r*.08,0,r*.22,r*.38,r*.30,1.95,an,0);
   }
   frame.add(kit.bud,'floralCup',cp.center,0,r*.025,0,r*(feijoa?.23:.19),r*.10,r*(feijoa?.23:.19),0,0,0);
  }
  frame.add(kind+'Filaments','stamen-'+type,cp.stamens,0,0,0,scale,scale,scale,0,0,0);
  frame.add(kind+'Tips','anther-'+type,low?'#ded5ce':cp.anthers,0,0,0,scale,scale,scale,0,0,0);
  if(!feijoa&&!myrtus&&!tea&&!low){
   frame.branch([0,0,0],[0,scale*1.12,0],.0007,young,'flowerAxis');
   if(type==='callistemon')for(let j=0;j<4;j++)frame.add(a.leafShape,leafKind,s.leafColor,0,scale*(.97+j*.07),0,leafLength*.6*a.leafWidth/a.leafLength,leafLength*.6,leafLength*.6,-.6,j*2.399,0);
  }
 }
}

export function cotinusLeafPoint(t,u){
 const wave=Math.pow(Math.max(0,Math.sin(Math.PI*t)),.53),width=.445*wave*(.64+.40*t);
 return [u*width,t,.037*u*u*wave+.045*t*t];
}

// Cotinus smoke is elongated, hairy sterile pedicels. These shared meshes keep
// the open branching panicle visible through the hairs, without a solid blob.
export function smokePanicleGeometry(part){
 const p=[],uv=[],ix=[];let state=379;
 const rand=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
 const ribbon=(from,to,width,bend=0)=>{
  const direction=new THREE.Vector3(...to).sub(new THREE.Vector3(...from)),side=new THREE.Vector3(direction.z,.13,-direction.x).normalize();
  for(let plane=0;plane<2;plane++){
   const start=p.length/3,cross=plane?new THREE.Vector3().crossVectors(direction,side).normalize():side;
   for(let j=0;j<=3;j++)for(const sign of [-1,1]){
    const t=j/3,v=new THREE.Vector3(...from).addScaledVector(direction,t).addScaledVector(side,bend*Math.sin(t*Math.PI)).addScaledVector(cross,sign*width*.5*(1-t*.5));p.push(...v.toArray());uv.push(sign===1?1:0,t);
    if(j<3&&sign===-1){const k=start+j*2;ix.push(k,k+1,k+2,k+1,k+3,k+2);}
   }
  }
 };
 const dotFlower=(at,yaw)=>{
  for(let k=0;k<5;k++){
   const angle=yaw+k*TAU/5,side=angle+Math.PI/2,start=p.length/3;
   for(const [r,s] of [[0,0],[.009,-.0036],[.014,0],[.009,.0036]]){p.push(at[0]+Math.sin(angle)*r+Math.sin(side)*s,at[1]+r*.20,at[2]+Math.cos(angle)*r+Math.cos(side)*s);uv.push(s/.0072+.5,r/.014);}
   ix.push(start,start+1,start+2,start,start+2,start+3);
  }
 };
 if(part==='axis')ribbon([0,0,0],[.012,1,0],.0045);
 for(let n=0;n<15;n++)for(let j=0;j<3;j++){
  const t=.10+n*.058,angle=n*2.399+j*TAU/3,reach=.37*Math.pow(Math.sin(Math.PI*t),.75)*(1-t*.25),base=[.012*t,t,0],tip=[Math.sin(angle)*reach,t+.075+rand()*.035,Math.cos(angle)*reach];
  if(part==='axis')ribbon(base,tip,.0022);
  for(let k=0;k<8;k++){
   const u=(k+.65)/8,at=base.map((v,l)=>v+(tip[l]-v)*u),az=angle+(k%2?-1:1)*(.45+rand()*.48),length=.075+rand()*.065,end=[at[0]+Math.sin(az)*length,at[1]+length*.7,at[2]+Math.cos(az)*length];
   if(part==='axis')ribbon(at,end,.0010,.004);
   if(part==='flower'&&k%3===0)dotFlower(end,az);
   for(let q=0;q<6;q++){
    const v=(q+.5)/6,root=at.map((z,l)=>z+(end[l]-z)*v),an=az+q*2.399,rr=.022+rand()*.034,finish=[root[0]+Math.sin(an)*rr,root[1]+rr*(.18+rand()*.8),root[2]+Math.cos(an)*rr],bend=(rand()-.5)*.030;
    if(part==='hair')ribbon(root,finish,.00065,bend);
   }
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData.smokePanicle=part;return g;
}

function drawSmokeTree(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,wood=a.barkColor,young=a.stemColor,leafLength=Math.min(a.leafLength,w*.12,h*.13),panicle=Math.min(a.inflorescenceLength,h*.27,w*.30),leaves=[],ends=[],spread=a.habit==='spreading';
 const mix=(x,y,t)=>x.map((v,k)=>v+(y[k]-v)*t),point=(angle,r,y)=>[Math.sin(angle)*r,y,Math.cos(angle)*r];
 const curve=(points,r,color=wood,kind='wood-smoke')=>{for(let k=1;k<points.length;k++)b.branch(points[k-1],points[k],r*(1-k/(points.length+1)),color,kind);};
 // All random geometry is prepared before month filtering, retaining the same
 // trunks and twigs in winter, spring and summer.
 for(let main=0;main<4;main++){
  const az=main*2.399+rand()*.3,foot=point(az,w*.017,.006),fork=point(az,w*.10,h*(.22+rand()*.07)),r=Math.min(.034,h*.015)*(main===0?1:.79);
  curve([foot,point(az-.12,w*.026,h*.17),fork],r);
  for(let arm=0;arm<7;arm++){
   const an=az+(arm-3)*.71+(rand()-.5)*.22,reach=w*(arm<2?.08+arm*.12:.29+rand()*.065),level=h*(arm<2?.82-arm*.06:.42+rand()*.30),end=point(an,reach,Math.min(h-panicle*.55,level)),bend=mix(fork,end,.5);bend[1]+=h*.03;
   curve([fork,bend,end],r*.47);
   const count=Math.max(4,Math.round((spread?12:10)*detail));
   for(let twig=0;twig<count;twig++){
    const t=.19+.78*(twig+.5)/count,at=t<.5?mix(fork,bend,t*2):mix(bend,end,(t-.5)*2),angle=an+(twig%2?1:-1)*(.46+rand()*.63),reach=Math.min(w*.18,.28)*( .76+rand()*.32),top=[at[0]+Math.sin(angle)*reach,at[1]+h*(.065+rand()*.08),at[2]+Math.cos(angle)*reach];
    const radius=Math.hypot(top[0],top[2]),limit=w*.47-leafLength*.65;
    if(radius>limit){top[0]*=limit/radius;top[2]*=limit/radius;}
    top[1]=Math.min(h-panicle*.42,top[1]);curve([at,mix(at,top,.5),top],Math.min(.0042,h*.003),young,'wood-smoke-shoot');
    const nodes=9+Math.round(rand()*3);
    for(let n=0;n<nodes;n++){
     const u=.17+.80*(n+.5)/nodes,root=mix(at,top,u),yaw=angle+n*2.39996,petiole=leafLength*(.18+rand()*.08),out=[root[0]+Math.sin(yaw)*petiole,root[1]+petiole*.43,root[2]+Math.cos(yaw)*petiole];
     leaves.push({root,out,yaw,pitch:.40+rand()*.95,roll:(rand()-.5)*.70,size:.72+rand()*.28,visibility:rand(),tone:rand()});
    }
    ends.push({at:top,yaw:angle,pitch:.10+rand()*.32,size:.76+rand()*.24,visibility:rand(),tone:rand()});
   }
  }
 }
 for(const q of leaves){
  if(q.visibility>s.leafDensity)continue;
  const len=leafLength*q.size*s.leafScale;
  b.branch(q.root,q.out,Math.min(.0009,len*.014),young,'petiole');
  b.add('cotinusLeaf','leaf-cotinus',kit.shade(()=>q.tone,s.leafColor,.060),...q.out,len*(a.leafWidth/a.leafLength)/.76,len,len,q.pitch,q.yaw,q.roll);
 }
 if(!s.bloom)return;
 const first=a.flowerMonths[0],early=s.month===first,late=a.flowerMonths.indexOf(s.month)>0,cp=a.flowerPalette;
 for(const q of ends){
  if(q.visibility>(s.flowerDensity||1)*.54)continue;
  const scale=panicle*q.size*(early?.72:1),phase=cp.mixed?q.tone:early?.12:.90,color=new THREE.Color(cp.early).lerp(new THREE.Color(cp.late),phase).getStyle();
  b.add('smokeAxis','panicleAxis',kit.shade(()=>q.tone,early?'#88935f':color,.035),...q.at,scale,scale,scale,q.pitch,q.yaw,0);
  if(early)b.add('smokeFlower','tinyFlower','#c6c276',...q.at,scale,scale,scale,q.pitch,q.yaw,0);
  // Flowering dates and the later hairy phase overlap; exact transitions remain
  // marked as illustrative in each plant's source notes.
  b.add('smokeHair','smokeHair',kit.shade(()=>q.tone,color,.045),...q.at,scale,scale,scale,q.pitch,q.yaw,0);
  if(cp.dense&&late)b.add('smokeHair','smokeHair',color,...q.at,scale*.96,scale*.98,scale*.96,q.pitch,q.yaw+.31,0);
 }
}

// A shoot contains its actual small leaves. Instances distribute connected shoots,
// rather than using oversized needles to stand in for a whole conifer crown.
export const CONIFER_SHOOTS={
 thujaSpray:{length:.18,leaf:.0028,width:.0015,flat:true},
 hinokiSpray:{length:.18,leaf:.002,width:.0015,flat:true,blunt:true},
 sawaraSpray:{length:.18,leaf:.003,width:.0013,flat:true},
 cypressSpray:{length:.18,leaf:.0025,width:.0012},
 juniperSpray:{length:.18,leaf:.003,width:.0011},
 blueStarSpray:{length:.12,leaf:.008,width:.0013,awl:true,whorl:3},
 squarrosaSpray:{length:.12,leaf:.005,width:.0011,awl:true,whorl:4},
 yewFlatSpray:{length:.16,leaf:.024,width:.0028,yew:true,flat:true},
 yewSpiralSpray:{length:.14,leaf:.020,width:.003,yew:true},
 mopCord:{length:.26,leaf:.002,width:.001,cord:true}
};
export function coniferShootGeometry(type,young=false){
 const c=CONIFER_SHOOTS[type],pos=[],uv=[],idx=[],up=new THREE.Vector3(0,1,0);let leafCount=0;
 const surface=(origin,direction,len,width,leaf=true)=>{
  const q=new THREE.Quaternion().setFromUnitVectors(up,new THREE.Vector3(...direction).normalize()),rows=leaf&&c.yew?3:leaf&&c.awl?2:1,cols=2,start=pos.length/3;
  if(!leaf){
   for(let k=0;k<=1;k++)for(let j=0;j<5;j++){
    const an=j*TAU/4,at=new THREE.Vector3(Math.sin(an)*width*.5,k*len,Math.cos(an)*width*.5).applyQuaternion(q).add(new THREE.Vector3(...origin));pos.push(...at.toArray());uv.push(j/4,k);
    if(!k&&j<4){const n=start+j;idx.push(n,n+5,n+1,n+1,n+5,n+6);}
   }
   return;
  }
  if(leaf&&!c.yew){
   // Four vertices preserve a real leaf outline without tessellating a sub-mm face.
   // The middle pair is essential: rounded scales cannot be sampled only at their tips.
   const middle=c.blunt?.64:.31,vertices=[[0,0,0],[-width*.5,len*middle,0],[0,len,width*.15],[width*.5,len*middle,0]];
   for(const [i,v] of vertices.entries()){const at=new THREE.Vector3(...v).applyQuaternion(q).add(new THREE.Vector3(...origin));pos.push(...at.toArray());uv.push(i===1?0:i===3?1:.5,i===0?0:i===2?1:middle);}
   idx.push(start,start+1,start+2,start,start+2,start+3);return;
  }
  for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
   const t=i/rows,u=j-1,envelope=leaf?(c.yew?Math.pow(Math.sin(Math.PI*t),.27):c.blunt?Math.pow(Math.sin(Math.PI*t),.45):1-t):1;
   const v=new THREE.Vector3(u*width*.5*envelope,t*len,leaf?width*.19*(1-u*u)*Math.sin(Math.PI*t):0).applyQuaternion(q).add(new THREE.Vector3(...origin));
   pos.push(v.x,v.y,v.z);uv.push(j/cols,t);
   if(i<rows&&j<cols){const k=start+i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
  }
 };
 const shoot=(root,dir,len)=>{
  const v=new THREE.Vector3(...dir).normalize(),q=new THREE.Quaternion().setFromUnitVectors(up,v),nodes=Math.ceil(len/(c.yew?.005:c.awl?.0035:c.leaf*.54));
  if(!young)surface(root,dir,len,c.cord?.0026:c.yew?.0015:.0018,false);
  for(let n=0;n<nodes;n++){
   const t=n/nodes,isYoung=t>.76;if(isYoung!==young)continue;
   const at=new THREE.Vector3(...root).addScaledVector(v,len*t),count=c.yew?(c.flat?2:1):c.awl?c.whorl:2;
   for(let j=0;j<count;j++){
    const an=c.yew?(c.flat?j*Math.PI+Math.PI/2:n*2.39996):j*TAU/count+(c.awl?n%2*Math.PI/count:n%2*Math.PI/2),spread=c.yew?.94:c.awl?.65:.20;
    const direction=new THREE.Vector3(Math.sin(an)*spread,c.yew?.32:c.awl?.76:.98,Math.cos(an)*spread*(c.flat?.24:1)).normalize().applyQuaternion(q),size=c.leaf*(.73+.27*Math.sin(t*Math.PI));
    surface(at.toArray(),direction.toArray(),size,c.width);leafCount++;
   }
  }
 };
 shoot([0,0,0],[0,1,c.cord?.22:0],c.length);
 for(let n=0;n<(c.yew?4:c.cord?6:7);n++)for(const side of [-1,1]){
  const t=.10+n*(c.yew?.20:.115),dir=[side*(c.flat?.62:.45),.78,c.flat?.02:Math.sin(n*2.2)*.44],len=c.length*(1-t)*(c.yew?.72:c.cord?.35:.56),root=[0,c.length*t,c.cord?c.length*t*.22:0],v=new THREE.Vector3(...dir).normalize();
  shoot(root,dir,len);
  for(let j=0;j<(c.yew?0:c.awl?2:3);j++)for(const sign of [-1,1]){
   const u=.22+j*.24,at=new THREE.Vector3(...root).addScaledVector(v,len*u).toArray(),branch=[dir[0]+sign*.55,dir[1]*.62,dir[2]+(c.flat?0:sign*.18)];
   shoot(at,branch,len*(1-u)*.50);
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData.coniferShoot=type;g.userData.young=young;g.userData.leafCount=leafCount;return g;
}

function drawConiferSprays(b,{info,s,detail,rand},kit){
 const a=info.appearance,c=CONIFER_SHOOTS[a.shootProfile],h=s.height,w=s.spread,mound=['rounded','mound'].includes(a.habit),cord=c.cord,yew=c.yew,flat=c.flat,wood=a.barkColor,woodKind='wood-'+a.barkPattern;
 const lerp=(x,y,t)=>x.map((v,k)=>v+(y[k]-v)*t),shoots=[];
 const curved=(points,r)=>{for(let k=1;k<points.length;k++)b.branch(points[k-1],points[k],r*(1-k/(points.length+2)),wood,woodKind);};
 const count=Math.round((cord?50:mound?66:92)*Math.max(.35,detail)),r0=Math.max(.006,Math.min(.055,h*.010)),top=mound?h*.055:h*.98;
 curved([[0,0,0],[w*.008,top*.35,0],[-w*.006,top*.70,w*.008],[0,top,0]],r0);
 for(let i=0;i<count;i++){
  const t=(i+.6)/count,az=i*2.39996+(rand()-.5)*.28,level=mound?.16+t*.68:.025+t*.88,extent=w*(mound?.40:.38)*(mound?Math.sqrt(1-Math.pow(t,1.35)):Math.pow(1-t,.85)),base=[0,h*(mound?.035:level),0];
  const end=[Math.sin(az)*extent,h*(mound?level:level+(a.habit==='columnar'?.15:.075)*(1-t)),Math.cos(az)*extent],bend=lerp(base,end,.55);bend[1]+=h*(cord?.10:.025);
  curved([base,bend,end],r0*(mound?.53:.45)*(1-t*.72));
  for(let k=0;k<5;k++)for(const side of [-1,1]){
   const u=.20+k*.19,at=lerp(base,end,u),sideAz=az+side*(.70+rand()*.15),reach=extent*(.28-.10*u),out=[at[0]+Math.sin(sideAz)*reach,at[1]+h*(cord?.025:yew?.045:.065)*(1-t),at[2]+Math.cos(sideAz)*reach];
   curved([at,lerp(at,out,.6),out],Math.min(.0045,r0*.17)*(1-t*.45));
   const subdivisions=cord?3:2;
   for(let j=0;j<subdivisions;j++){
    const f=(j+1)/subdivisions,root=lerp(at,out,f),yaw=sideAz+(rand()-.5)*.85,pitch=cord?1.60+f*.52:a.habit==='columnar'?.18+rand()*.48:flat?.70+rand()*.48:yew?.34+rand()*.7:.12+rand()*.67;
    shoots.push({root,yaw,pitch,roll:(rand()-.5)*(flat?1.5:.8),young:j===subdivisions-1,variation:rand(),size:(.86+rand()*.23)*(mound?1:.55+.45*Math.pow(1-t,.25))});
   }
  }
 }
 // A short living leader gives a cone its fine apex. Mounded cultivars have none.
 if(!mound)shoots.push({root:[0,h-c.length*.86,0],yaw:0,pitch:0,roll:0,young:true,variation:.5,size:.86});
 for(const q of shoots){
  const isFlush=a.flushMonths?.includes(s.month),base=s.leafColor,kind=a.leafPattern?patternKind('leaf',a.leafPattern,s.leafPatternColor):flat&&!yew?'leaf-conifer-'+a.shootProfile:foliageKind(info),color=kit.shade(()=>q.variation,base,.040);
  const winter=s.seasonName==='winter',tipColor=a.winterTipColor&&winter?a.winterTipColor:isFlush&&a.springShootColor?a.springShootColor:base;
  const size=q.size*Math.min(1,h/(c.length*3),w/(c.length*3));
  b.add(a.shootProfile,kind,color,...q.root,size,size,size,q.pitch,q.yaw,q.roll);
  b.add(a.shootProfile+'Young',isFlush&&a.springShootColor?'leaf':kind,kit.shade(()=>q.variation,tipColor,.026),...q.root,size,size,size,q.pitch,q.yaw,q.roll);
 }
}

export function roseLeafPoint(t,u){
 const tooth=t*27%1,serration=1+.065*(tooth<.72?tooth/.72:(1-tooth)/.28),width=.33*Math.pow(Math.max(0,Math.sin(Math.PI*t)),.76)*serration;
 return [u*width,t,.035*u*u*Math.sin(Math.PI*t)+.014*Math.sin(t*39-Math.abs(u)*5)*Math.abs(u)*Math.sin(Math.PI*t)+.09*t*t];
}

export function silverMintLeafPoint(type,t,u){
 const sid=type==='sideritisLeaf',mint=type==='menthaLance',marr=type==='marrubiumRound',teeth=marr?9:mint?15:20,edge=sid?1:1+(marr?.055:.06)*Math.cos(t*TAU*teeth),width=(sid?.12:mint?.14:marr?.43:.39)*Math.pow(Math.max(0,Math.sin(Math.PI*t)),marr?.52:.7)*edge;
 return [u*width,t,(sid?.14:.055)*u*u*Math.sin(Math.PI*t)+(marr?.021:.009)*Math.sin(t*48-Math.abs(u)*6)*Math.abs(u)*Math.sin(Math.PI*t)+.055*t*t];
}

export function woodlandMintLeafPoint(type,t,u){
 const mel=type==='melittisCrenate',narrow=type==='keiskeaLance',broad=type==='triporaOvate'||type==='isodonOvate',teeth=mel?13:broad?12:20;
 const tooth=t*teeth%1,edge=mel?1+.055*Math.cos(t*Math.PI*teeth*2):1+(narrow?.065:.085)*(tooth<.78?tooth/.78:(1-tooth)/.22),width=(mel?.39:narrow?.19:broad?.34:.28)*Math.pow(Math.max(0,Math.sin(Math.PI*t)),mel?.52:.73)*edge;
 return [u*width,t,.036*u*u*Math.sin(Math.PI*t)+.014*Math.sin(t*42-Math.abs(u)*5)*Math.abs(u)*Math.sin(Math.PI*t)+.07*t*t];
}

// The same surface equation positions both the lamina and its attached hairs.
export function salviniaPoint(type,t,u){
 const sn=Math.max(0,Math.sin(Math.PI*t)),width=(type==='salviniaFlat'?.32:.50)*Math.pow(sn,.48);
 if(type==='salviniaHood')return [width*Math.sin(u*1.65)/1.65,t,-.34*(1-Math.cos(u*1.65))*Math.pow(sn,.35)-.12*t*t];
 if(type==='salviniaFolded')return [u*width*.80,t,-.34*Math.pow(Math.abs(u),.85)*Math.pow(sn,.52)-.023*Math.sin(t*13+u)*u*u*sn];
 return [u*width,t,-.014*u*u*sn-.008*t*t];
}

export function alceaLeafPoint(type,t,an){
 const rug=type==='rugosaPalm',edge=(rug?.68+.32*Math.pow((1+Math.cos(an*5))/2,.75):.85+.15*Math.cos(an*5))*(.965+.035*Math.cos(an*64)),r=t*edge;
 return [Math.sin(an)*r*.55,(Math.cos(an)*r+.70)*.57,.065*r*r+(rug?.026:.012)*Math.sin(r*47-an*2)*Math.sin(an*7)*r];
}

function flowerFrame(b,origin,pitch,yaw){
 const rotation=new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch,yaw,0,'YXZ'));
 const point=values=>new THREE.Vector3(...values).applyQuaternion(rotation).add(new THREE.Vector3(...origin)).toArray();
 return {
  add(shape,kind,color,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0){
   const q=rotation.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(rx,ry,rz,'YXZ'))),e=new THREE.Euler().setFromQuaternion(q,'YXZ');
   b.add(shape,kind,color,...point([x,y,z]),sx,sy,sz,e.x,e.y,e.z);
  },
  branch(from,to,r,color,kind){b.branch(point(from),point(to),r,color,kind);}
 };
}

// Connected flower parts share an origin. Variation changes size and angle, not taxon identity.
export function detailedFlower(b,{x,y,z,r=.025,color,shape='flat',petals=5,layers=1,pattern,patternColor,palette={},guides=true,outerPattern,center='#c6ad56',stamenCount=2,bracts=12,tilt=0,yaw=0},kit){
 const {bud,rand,shade}=kit,kind=patternKind('petal',pattern,patternColor);
 if(shape==='daisyCultivarHead'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),pompon=palette.profile==='pompon',brachy=palette.type.startsWith('brachy'),coreo=palette.type.startsWith('coreopsis'),rays=palette.rays||8,ratio=palette.diskRatio||.25,rayShape=coreo?(palette.notches<.1?'daisyShallowRay':'daisyNotchedRay'):'daisyRoundRay';
  f.add(bud,'receptacle','#728255',0,-r*.10,0,r*.29,r*.16,r*.29);
  const colorHex=col=>new THREE.Color(col).getHexString();
  let paint='petal-daisy';
  if(palette.base){const mode=palette.profile==='stripes'?'stripes':palette.profile==='rim'?'rim':'eye',coverage=Math.round((palette.coverage||.45)*5)/5;paint+='-'+mode+'-'+colorHex(palette.base)+'-'+Math.round(coverage*100);}
  if(palette.rim)paint+='-rimAccent-'+colorHex(palette.rim);
  const rings=pompon?10:brachy&&rays>28?2:1,per=pompon?18:Math.ceil(rays/rings);
  for(let ring=0;ring<rings;ring++){
   const t=ring/Math.max(1,rings-1),n=pompon?Math.max(8,per-ring):per;
   for(let j=0;j<n;j++){
    const az=j*TAU/n+ring*2.39996+(rand()-.5)*.07,lr=r*(pompon?.9*Math.sqrt(1-t*t*.97):.90-ring*.16),rad=pompon?r*(.05+.12*(1-t)):r*.14;
    f.add(rayShape,paint,shade(rand,color,.022),Math.sin(az)*rad,pompon?r*t*.78:0,Math.cos(az)*rad,lr*(pompon?.46:palette.rayWidth||.5),lr,lr,pompon?-.10-t*.30:(rand()-.5)*.10,az,0);
   }
  }
  if(!pompon){
   const n=brachy?44:70;
   for(let j=0;j<n;j++){
    const t=(j+.5)/n,an=j*2.39996,rr=r*ratio*Math.sqrt(t),yy=r*(.08+.10*(1-t)),tip=[Math.sin(an)*rr,yy,Math.cos(an)*rr],co=t>.57&&palette.type!=='osteoToothed'?'#c7ac48':palette.center;
    f.add(bud,'discFloret',co,...tip,r*.022,r*.037,r*.022);
    if(j%2===0)f.add(bud,'anther',palette.type==='osteoToothed'?'#a591b4':'#dac373',tip[0],yy+r*.032,tip[2],r*.009,r*.012,r*.009);
   }
  }
  for(let j=0;j<8;j++)f.add('coreopsisFine','involucre','#6e8854',0,-r*.14,0,r*.13,r*.46,r*.46,1.28,j*TAU/8,0);
  return;
 }
 if(shape==='gardenRose'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),count=petals,high=palette.profile==='high',chalice=palette.profile==='chalice',deep=palette.profile==='deepCup'||chalice,rosette=palette.profile==='rosette',flat=palette.profile==='flat'||rosette,wave=palette.wavy;
  const rings=Math.max(2,Math.ceil(count/(rosette?9:7))),per=Math.floor(count/rings);
  for(let layer=0,j=0;layer<rings;layer++){
   const n=per+(layer<count%rings?1:0),t=layer/(rings-1),len=r*(1-(palette.exposedStamens?.30:.83)*t),level=r*(high?.60:deep?.70:flat?.13:.40)*t;
   for(let k=0;k<n;k++,j++){
    const an=k*TAU/n+layer*2.39996+Math.sin(j*4.7)*.085,col=palette.inner?new THREE.Color(color).lerp(new THREE.Color(palette.inner),t*.85):color,pk=(palette.rim?'petal-rose-rim-'+(palette.rimWidth?'broad-':'')+palette.rim.slice(1):'petal-rose')+(palette.outside?'-outside-'+palette.outside.slice(1):''),qx=rosette&&t>.4?Math.sin(j%4*Math.PI/2)*r*.065:0,qz=rosette&&t>.4?Math.cos(j%4*Math.PI/2)*r*.065:0;
    f.add(palette.banksiae?'banksiaePetal':chalice&&t<.6?'roseChalicePetal':palette.notched?'roseNotchedPetal':palette.jewel?'roseJewelPetal':wave||deep&&t>.3?'roseWavedPetal':(high||palette.pointed)&&t>.4?'rosePointedPetal':'roseRoundPetal',pk,shade(rand,col,.018),qx,level+r*(rand()-.5)*.055,qz,len*(.88+rand()*.18),len*(palette.exposedStamens?.32:chalice&&t<.6?1.05:deep?1.48:high?1.05:flat?.56:.93),len*(.93+rand()*.12),(rand()-.5)*(rosette||deep&&t>.3?.42:.18),an,(rand()-.5)*.27);
   }
  }
  if(palette.buttonEye)for(let j=0;j<9;j++)f.add('roseRoundPetal','petal-button-eye',palette.inner||color,Math.sin(j*2.399)*r*.035,r*.25,Math.cos(j*2.399)*r*.035,r*.10,r*.12,r*.10,.1,j*2.399,0);
  if(palette.exposedStamens){
   f.add(bud,'receptacleCenter','#c9b25b',0,r*.04,0,r*.18,r*.045,r*.18);
   for(let j=0;j<48;j++){const az=j*2.399,rr=r*(.08+.15*Math.sqrt((j+.5)/48)),at=[Math.sin(az)*rr,r*(.15+.08*Math.sin(j)),Math.cos(az)*rr];f.branch([at[0]*.7,r*.04,at[2]*.7],at,r*.014,'#d2b455','filament');f.add(bud,'anther','#a88748',...at,r*.026,r*.024,r*.018);}
  }
  f.add(bud,'receptacle','#70834b',0,-r*.12,0,r*.16,r*.17,r*.16);
  for(let j=0;j<5;j++)f.add(palette.banksiae?'banksiaeSepal':'roseSepal','sepal','#6f8250',0,-r*.08,0,r*.48,r*.56,r*.48,1.75,j*TAU/5,0);
  return;
 }
 if(['sideritisLips','menthaFloret','marrubiumLips','leonotisHood'].includes(shape)){
  const sid=shape==='sideritisLips',mint=shape==='menthaFloret',marr=shape==='marrubiumLips',leo=shape==='leonotisHood',f=flowerFrame(b,[x,y,z],tilt,yaw),length=r*(mint?.85:leo?1.15:1.0);
  f.add('woodlandMintTube','corollaTube',color,0,0,0,r*(leo?.50:1),length,r*(leo?.50:1));
  if(mint){
   for(let j=0;j<4;j++)f.add('mintLip','corollaLobe',color,0,length,0,r*(j===0?.95:.76),r*.74,r,1.05,j*TAU/4,0);
  }else if(leo){
   f.add('leonotisHood','hood',color,0,length,0,r,r*1.05,r);
   for(let j=-1;j<=1;j++)f.add('mintLip','reducedLowerLobe',color,j*r*.10,length,r*.15,r*.21,r*.28,r,2.48,j*.6,0);
   for(let j=0;j<44;j++){
    const tt=rand(),u=rand()*2-1,at=[Math.sin(u*1.35)*r*.19,length+tt*r*1.05,Math.cos(u*1.35)*r*.22-.16*tt*tt*r];
    f.branch(at,[at[0]+u*r*.04,at[1]+r*.013,at[2]+r*.032],r*.0025,'#e6a36b','corollaHair');
   }
  }else{
   for(let j=0;j<(marr?2:1);j++)f.add('mintLip','upperLobe',color,(j-(marr?.5:0))*r*.18,length,-r*.12,r*(marr?.45:.80),r*.72,r,-.40,(j-.5)*.15,0);
   for(let j=-1;j<=1;j++)f.add('mintLip','lowerLobe',color,j*r*.27,length,r*.12,r*(j===0?1:.45),r*(j===0?.78:.40),r,1.25,j*.7,0);
  }
  if(!leo)f.add('woodlandMintTube','calyxTube','#9caa83',0,-r*.45,0,r*.92,r*(sid?1.40:1.15),r*.92);
  const count=leo?8:5;
  for(let j=0;j<count;j++){
   const an=j*TAU/count,base=[Math.sin(an)*r*.22,-r*.35,Math.cos(an)*r*.22],tip=[Math.sin(an)*r*.34,r*(leo?(j===0?.68:.28):.55),Math.cos(an)*r*.34];
   f.branch(base,tip,r*(leo?.023:.028),'#8e9d78','calyxTooth');
  }
  for(let j=0;j<4;j++){
   const xx=(j-1.5)*r*.12,reach=length+r*(mint?1.0:leo?.90:.28),zz=leo?-r*.02:-r*.12;
   f.branch([xx,length*.35,zz],[xx,reach,zz],r*.018,mint?'#d6d0e5':color,'filament');f.add(bud,'anther',mint?'#bcafce':'#ac9a62',xx,reach,zz,r*.038,r*.046,r*.03);
  }
  const reach=length+r*(mint?1.1:leo?.87:.31);f.branch([0,length*.2,0],[0,reach,0],r*.014,color,'style');
  for(const side of [-1,1])f.branch([0,reach,0],[side*r*.07,reach+r*.12,0],r*.011,color,'stigma');
  return;
 }
 if(['keiskeaWhite','isodonDark','chelonopsisBell','triporaBlue','leucosceptrumCream','melittisBicolor'].includes(shape)){
  const trip=shape==='triporaBlue',mel=shape==='melittisBicolor',che=shape==='chelonopsisBell',iso=shape==='isodonDark',kei=shape==='keiskeaWhite',f=flowerFrame(b,[x,y,z],tilt,yaw),tubeLength=r*(che?2.3:mel?1.1:trip?.60:1.1),tube=che?'chelonopsisTube':mel?'melittisTube':'woodlandMintTube';
  f.add(tube,'corollaTube',color,0,0,0,r*(che?1.7:1),tubeLength,r*(che?1.7:1));
  // A green calyx surrounds the basal tube; Melittis has three broad calyx lobes.
  const calyxCount=mel?3:5;
  for(let j=0;j<calyxCount;j++)f.add('mintLip','calyx',palette.calyx||'#758758',0,-r*.08,0,r*(mel?.55:.30),r*(che?.7:.5),r,.23,j*TAU/calyxCount,0);
  if(trip){
   for(const az of [1.12,2.44,3.84,5.16])f.add('mintLip','upperLobe',color,0,tubeLength,0,r*.70,r*.95,r,1.20,az,0);
   f.add('mintLip','petal-tripora-lower',color,0,tubeLength,0,r*.85,r*1.45,r,1.12,0,0);
  }else if(iso){
   for(let j=0;j<4;j++)f.add('mintLip','upperLobe',color,(j-1.5)*r*.17,tubeLength,-r*.14,r*.32,r*.78,r,-.62,(j-1.5)*.35,0);
   f.add('mintLip','lowerLobe',color,0,tubeLength,r*.16,r*.88,r*.73,r,1.13,0,0);
  }else{
   const upper=kei?2:1;
   for(let j=0;j<upper;j++)f.add('mintLip','upperLobe',mel?'#f0eee8':color,(j-(upper-1)/2)*r*.22,tubeLength,-r*.19,r*(kei?.48:mel?1.05:.7),r*(che?.4:mel?.9:.40),r,-1.02,0,0);
   for(let j=-1;j<=1;j++){
    const central=j===0,c=mel?(central?'#985480':'#f1efec'):color;
    f.add('mintLip',mel&&central?'petal-melittis-lower':'lowerLobe',c,j*r*.30,tubeLength,r*.16,r*(central?.85:.55),r*(central?(che?1.0:mel?1.1:.58):.45),r,1.10,j*.8,0);
   }
  }
  if(trip){
   for(let j=0;j<5;j++){
    const style=j===4,xx=(j-1.5)*r*.15,len=r*(style?3.3:2.55+j*.10);let prev=[xx,tubeLength,0];
    for(let k=1;k<=18;k++){const an=k/18*Math.PI*.79,at=[xx,tubeLength+Math.sin(an)*len,-(1-Math.cos(an))*len*.72];f.branch(prev,at,r*.014,style?'#cfccd7':'#e4e2db',style?'archedStyle':'archedFilament');prev=at;}
    if(style){for(const side of [-1,1])f.branch(prev,[prev[0]+side*r*.09,prev[1]-r*.17,prev[2]-.08*r],r*.012,'#9687a5','stigma');}
    else for(const side of [-1,1])f.add(bud,'anther','#b89b5f',prev[0]+side*r*.055,prev[1],prev[2],r*.055,r*.035,r*.085,0,.4,0);
   }
  }else{
   const reach=mel||che?tubeLength*.88:tubeLength+r*(kei?1.45:iso?.65:1.1);
   for(let j=0;j<4;j++){const xx=(j-1.5)*r*.13,yy=reach+(j>=2?r*.14:0),zz=-r*.10;f.branch([xx,tubeLength*.55,zz],[xx,yy,zz],r*.014,mel?'#eee9e4':color,'filament');f.add(bud,'anther',kei?'#b8a0af':mel?'#b6aa7a':'#b8aa72',xx,yy,zz,r*.045,r*.042,r*.030);}
   f.branch([0,tubeLength*.4,0],[0,reach+r*.1,0],r*.012,color,'style');
  }
  return;
 }
 if(shape==='puschkiniaStar'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  for(let j=0;j<6;j++)f.add('puschkiniaTepal','petal-center-85aacc',color,0,0,0,r,r,r,1.09,j*TAU/6,0);
  f.add('puschkiniaCorona','staminalCorona','#f0f0df',0,0,0,r,r,r);
  for(let j=0;j<6;j++){const an=j*TAU/6,at=[Math.sin(an)*r*.17,r*.31,Math.cos(an)*r*.17];f.branch([at[0],r*.22,at[2]],at,r*.016,'#e4e3c1','filament');f.add(bud,'anther','#c1ba74',...at,r*.052,r*.035,r*.030,0,an,0);}
  f.branch([0,0,0],[0,r*.30,0],r*.017,'#d4dabc','style');return;
 }
 if(shape==='bletillaOrchid'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  // One dorsal and two lower sepals; two lateral petals and a separate ventral lip.
  for(const az of [0,2.30,-2.30])f.add('bletillaSepal','sepal',color,0,0,0,r,r,r,.04,0,az);
  for(const az of [-1.18,1.18])f.add('bletillaPetal','petal',color,0,0,.0001,r,r,r,.04,0,az);
  f.add('bletillaLip','petal-bletilla-lip',color,0,0,r*.10,r,r,r,0,0,Math.PI);
  // Five raised, wavy longitudinal lamellae on the lip.
  for(let j=-2;j<=2;j++)for(let k=0;k<18;k++){
   const t=.12+k*.043,t2=t+.043,xx=j*r*.066,zz=t=>r*(.10+.23*t*t+.028*Math.sin(t*65+j));
   f.branch([xx,-r*t,zz(t)],[xx,-r*t2,zz(t2)],r*.017,'#f0ecef','lipLamella');
  }
  f.add(bud,'column','#ece7ee',0,-r*.20,r*.15,r*.09,r*.28,r*.073,.05,0,0);
  f.add(bud,'antherCap','#eae5db',0,-r*.42,r*.15,r*.09,r*.055,r*.09);
  return;
 }
 if(shape==='alceaRuffled'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),single=layers===1,frill=palette.frilled,pk=palette.ripple?'petal-alcea-ripple':'petal-alcea-veins';
  for(let j=0;j<7;j++)f.add('monocotNarrowTepal','epicalyx','#839471',0,-r*.12,0,r*.58,r*.41,r*.41,1.12,j*TAU/7,0);
  for(let j=0;j<5;j++)f.add('monocotBroadTepal','calyx','#8b9b76',0,-r*.06,0,r*.45,r*.48,r*.48,.66,j*TAU/5,0);
  for(let j=0;j<5;j++)f.add(frill?'alceaFrilledPetal':'alceaBroadPetal',pk,shade(rand,color,.025),0,0,0,r,r,r,1.15+(rand()-.5)*.08,j*TAU/5,0);
  if(!single)for(let l=0;l<5;l++)for(let j=0;j<9;j++){
   const an=j*TAU/9+l*.61+(rand()-.5)*.13,len=r*(.71-l*.095)*(1+(rand()-.5)*.16),rr=r*(.18-l*.027);
   f.add(frill?'alceaFrilledPetal':'alceaBroadPetal',pk,shade(rand,color,.035),Math.sin(an)*rr,r*(.055+l*.048),Math.cos(an)*rr,len*(.62+rand()*.15),len,len,.85-l*.13+(rand()-.5)*.26,an,(rand()-.5)*.20);
  }
  if(single){
   f.branch([0,0,0],[0,r*.56,0],r*.057,'#d7cd91','staminalColumn');
   for(let j=0;j<55;j++){const an=j*2.399,yy=r*(.10+j/55*.39),at=[Math.sin(an)*r*.095,yy,Math.cos(an)*r*.095];f.branch([0,yy*.95,0],at,r*.008,'#dad098','filament');f.add(bud,'anther','#cfb76b',...at,r*.033,r*.020,r*.027);}
   for(let j=0;j<20;j++){const an=j*TAU/20;f.branch([0,r*.49,0],[Math.sin(an)*r*.06,r*.63,Math.cos(an)*r*.06],r*.008,'#d8d1ab','styleBranch');}
  }return;
 }
 if(['libertiaWhite','anthericumStar','tofieldiaStar','ornithogalumStar','rhodoxisStar','siculumBell','aristeaBlue'].includes(shape)){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),lib=shape==='libertiaWhite',ant=shape==='anthericumStar',tof=shape==='tofieldiaStar',orn=shape==='ornithogalumStar',rho=shape==='rhodoxisStar',sic=shape==='siculumBell',ari=shape==='aristeaBlue';
  for(let j=0;j<6;j++){
   const inner=j%2===1,an=j*TAU/6,len=r*(lib&&!inner?.65:1),geom=sic?'siculumTepal':lib&&inner?'libertiaInnerTepal':orn||ant&&!inner||tof?'monocotNarrowTepal':'monocotBroadTepal',pk=sic?'petal-center-a76a82':orn?'petal-center-94a176':'petal';
   f.add(geom,pk,shade(rand,color,.018),0,0,0,len*(rho?.57:ari?.48:ant&&inner?.68:1),len,len,sic?.08:1.24,an,0);
   if(sic)f.add('siculumTepal','perianthBase','#9aaa77',0,-r*.015,0,r*.30,r*.29,r*.29,.08,an,0);
  }
  const count=lib||ari?3:6,rr=r*(sic?.23:.28),yy=r*(sic?.83:ant?.65:lib?.35:.39);
  f.add(bud,lib||ari||rho?'inferiorOvary':'ovary','#a4b276',0,-r*(lib||ari||rho?.24:0),0,r*.16,r*.21,r*.16);
  for(let j=0;j<count;j++){
   const an=j*TAU/count,at=[Math.sin(an)*rr,yy,Math.cos(an)*rr];
   if(orn)f.add('monocotNarrowTepal','flattenedFilament','#d6dcb6',0,r*.04,0,r*.35,r*.54,r*.54,.50,an,0);
   else f.branch([Math.sin(an)*rr*.6,0,Math.cos(an)*rr*.6],at,r*.015,'#d4d5b9','filament');
   f.add(bud,'anther',tof?'#e0dfc9':lib?'#ae9856':ari?'#b3a979':'#c9b84f',...at,r*.041,r*(lib||ari||ant?.13:.07),r*.031,0,an,0);
  }
  if(tof)for(let j=0;j<3;j++){const an=j*TAU/3;f.branch([0,r*.12,0],[Math.sin(an)*r*.075,r*.29,Math.cos(an)*r*.075],r*.022,'#dedfc3','style');}
  else{
   const yy=r*(ant?1.10:sic?.90:lib?.43:ari?.43:.44);f.branch([0,0,0],[0,yy,0],r*.019,'#dcd7b3','style');
   if(lib||ari||rho)for(let j=0;j<3;j++){const an=j*TAU/3;f.branch([0,yy,0],[Math.sin(an)*r*.13,yy+r*.045,Math.cos(an)*r*.13],r*.022,'#dedbd0','stigmaLobe');}
  }
  if(tof)for(let j=0;j<3;j++)f.add('monocotBroadTepal','bracteole','#91a276',0,-r*.20,0,r*.48,r*.26,r*.26,.32,j*TAU/3,0);
  return;
 }
 if(['onosmaTube','mertensiaBell','gromwellSalver','nierembergiaCup','stellariaSplit','dryasEight','strawberryFive'].includes(shape)){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),onos=shape==='onosmaTube',mert=shape==='mertensiaBell',grom=shape==='gromwellSalver',cup=shape==='nierembergiaCup',star=shape==='stellariaSplit',dry=shape==='dryasEight',straw=shape==='strawberryFive',n=dry?8:5;
  if(onos||mert||grom||cup)f.add(shape,'petal',color,0,0,0,r,r,r);
  else for(let j=0;j<n;j++)f.add(star?'stellariaPetal':'lowHerbPetal','petal',shade(rand,color,.02),0,0,0,r,r,r,1.36,j*TAU/n,0);
  for(let j=0;j<n;j++){
   const an=j*TAU/n;f.add('narrow','sepal','#7c8c63',0,-r*.10,0,r*(onos?.27:.20),r*(onos?1.45:mert?.65:.62),r,.50,an,0);
   if(straw)f.add('narrow','epicalyx','#7c8c63',0,-r*.11,0,r*.12,r*.44,r,.75,an+Math.PI/5,0);
  }
  if(star||dry||straw)f.add(bud,straw?'receptacle':'carpelHead',dry?'#bcae57':'#a7b27c',0,r*.1,0,r*(dry?.30:.18),r*.14,r*(dry?.30:.18));
  const stamens=dry?38:straw?20:star?10:5;
  for(let j=0;j<stamens;j++){
   const an=j*2.399,rr=r*(dry?.22+.28*(j/stamens):star?.33:j%2?.27:.22),yy=r*(onos?2.1:mert?1.48:grom?.76:cup?.83:dry?.22+(j%5)*.045:star?.30+(j%2)*.1:.36+(j%3)*.035),at=[Math.sin(an)*rr,yy,Math.cos(an)*rr];
   f.branch([at[0]*.65,r*.07,at[2]*.65],at,r*.014,star?'#e2ded0':'#d6c478','filament');f.add(bud,'anther',star?'#c06c58':grom?'#967354':'#cbb656',...at,r*(star?.060:.043),r*(onos?.19:.045),r*.026,0,an,0);
  }
  if(star)for(let j=0;j<3;j++){
   const an=j*TAU/3,mid=[Math.sin(an)*r*.04,r*.31,Math.cos(an)*r*.04],tip=[Math.sin(an)*r*.14,r*.37,Math.cos(an)*r*.14];f.branch([0,r*.11,0],mid,r*.015,'#eeebdb','style');f.branch(mid,tip,r*.015,'#eeebdb','styleTip');
  }else if(dry||straw)for(let j=0;j<24;j++){
   const an=j*2.399,rr=r*.19*Math.sqrt((j+.5)/24);f.branch([Math.sin(an)*rr,r*.13,Math.cos(an)*rr],[Math.sin(an)*rr,r*.23,Math.cos(an)*rr],r*.012,'#bfbd7b','style');
  }else{
   const yy=r*(onos?3.02:mert?2.12:grom?.75:1.00);f.branch([0,0,0],[0,yy,0],r*.020,'#c5cba0','style');
   if(cup)for(const side of [-1,1])f.add(bud,'stigma','#c9bd64',side*r*.05,yy,0,r*.09,r*.035,r*.05);
   else f.add(bud,'stigma','#c8ccb0',0,yy,0,r*.04,r*.04,r*.04);
  }
  return;
 }
 if(shape==='apiaceaeFloret'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);f.add(bud,'stylopodium','#a6ab80',0,0,0,r*.28,r*.10,r*.24);
  for(let j=0;j<5;j++){
   const an=j*TAU/5,len=r*(palette.outer&&(j===0||j===1||j===4)?1.85:1),at=[Math.sin(an)*r*.63,r*.65,Math.cos(an)*r*.63];
   f.add('apiaceaePetal','petal',color,0,0,0,len,len,len,1.42,an,0);
   f.branch([0,r*.03,0],at,r*.018,'#d9c8ce','filament');f.add(bud,'anther',palette.darkAnthers?'#b5a4b1':'#d9d3c0',...at,r*.10,r*.065,r*.07,0,an,0);
  }
  for(const side of [-1,1])f.branch([side*r*.045,r*.06,0],[side*r*.24,r*.34,0],r*.028,'#c7cba2','style');return;
 }
 if(['edraianthusBell','wahlenbergiaBell','phyteumaFloret','jasioneFloret','tracheliumFloret','michauxiaReflexed'].includes(shape)){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),mich=shape==='michauxiaReflexed',phy=shape==='phyteumaFloret',jas=shape==='jasioneFloret',tra=shape==='tracheliumFloret',wahl=shape==='wahlenbergiaBell',n=mich?8:5;
  if(mich){
   f.add(bud,'ovary','#99a76c',0,-r*.05,0,r*.23,r*.19,r*.23);
   for(let j=0;j<n;j++){
    const an=j*TAU/n;f.add('michauxiaLobe','petal',color,0,0,0,r,r,r,0,an,0);
    f.add('narrow','sepal','#6e8051',0,-r*.12,0,r*.20,r*.55,r*.55,2.1,an,0);
    f.add('narrow','calyxAppendage','#6e8051',0,-r*.12,0,r*.15,r*.26,r*.26,2.65,an+Math.PI/n,0);
    f.branch([0,0,0],[Math.sin(an)*r*.11,r*.40,Math.cos(an)*r*.11],r*.012,'#dad6b7','filament');f.add(bud,'anther','#cec18a',Math.sin(an)*r*.11,r*.40,Math.cos(an)*r*.11,r*.028,r*.070,r*.019);
   }
   let last=[0,0,0];for(let k=1;k<=14;k++){
    const t=k/14,at=[0,t*r*1.08,-r*.19*t*t];f.branch(last,at,r*.023,'#d0ca9e','style');
    for(let j=0;j<9;j++){const an=j*TAU/9+k*.19;f.branch(at,[Math.sin(an)*r*.070,at[1]+r*.014,at[2]+Math.cos(an)*r*.070],r*.006,'#ded3aa','pollenHair');}last=at;
   }
   for(let j=0;j<n;j++){const an=j*TAU/n;f.branch(last,[Math.sin(an)*r*.10,last[1]+r*.06,last[2]+Math.cos(an)*r*.10],r*.015,'#c7c694','stigma');}return;
  }
  if(shape.endsWith('Bell'))f.add(shape,wahl?'petal-wahlenbergia':'petal',color,0,0,0,r,r,r);
  else if(phy){
   f.add('tube','corollaTube',color,0,r*.11,0,r*.055,r*.22,r*.055);
   for(let j=0;j<5;j++)f.add('phyteumaLobe','petal',color,0,r*.18,0,r,r,r,.12,j*TAU/5,0);
  }else{
   f.add('tube','corollaTube',color,0,r*(tra?1.45:.45),0,r*.17,r*(tra?2.9:.9),r*.17);
   for(let j=0;j<5;j++)f.add(jas?'jasioneLobe':'narrow','petal',color,0,r*(tra?2.9:.9),0,r*(jas?1:.70),r,r,1.33,j*TAU/5,0);
  }
  for(let j=0;j<5;j++)f.add('narrow','sepal','#758154',0,-r*.06,0,r*.18,r*(wahl?.70:.50),r,.6,j*TAU/5,0);
  const styleTop=wahl?r*.93:phy?r*1.34:jas?r*1.7:tra?r*5.1:r*1.56;
  f.branch([0,r*.05,0],[0,styleTop,0],r*(tra?.038:jas?.036:.022),jas?'#a3abd8':tra?'#a6a0bf':'#d4cbe4','style');
  if(jas||tra){
   f.add(bud,'stigma',jas?'#e4e1f1':'#c7c0d5',0,styleTop,0,r*(jas?.07:.09),r*(jas?.14:.08),r*(jas?.07:.09));
  }else for(let j=0;j<3;j++){const an=j*TAU/3;f.branch([0,styleTop,0],[Math.sin(an)*r*.10,styleTop+r*.05,Math.cos(an)*r*.10],r*.025,'#d5cee0','stigma');}
  if(!wahl)for(let j=0;j<5;j++){
   const an=j*TAU/5,rr=jas?r*.11:r*.07,at=[Math.sin(an)*rr,r*(jas?.68:tra?1.8:.36),Math.cos(an)*rr];
   f.add(bud,jas?'connateAnther':'anther',jas?'#b4a4ca':'#c0b5c9',...at,r*.04,r*.16,r*.04,0,an,0);
  }
  return;
 }
 if(shape==='bacopaCorolla'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  f.add('bacopaCorolla','petal-bacopa',color,0,0,0,r,r,r);
  for(let j=0;j<5;j++){const wide=j%2===0;f.add('bacopaSpoon','sepal','#7f9360',0,0,0,r*(wide?.9:.26),r*.89,r*.7,.28,j*TAU/5,0);}
  for(let j=0;j<4;j++){
   const an=(j+.5)*TAU/4,at=[Math.sin(an)*r*.13,r*(j<2?.65:.49),Math.cos(an)*r*.13];
   f.branch([at[0],r*.2,at[2]],at,r*.016,'#d3cec3','filament');f.add(bud,'anther','#e5dec8',...at,r*.072,r*.056,r*.045);
  }
  f.branch([0,r*.16,0],[0,r*.61,0],r*.021,'#bac39a','style');
  for(const side of [-1,1])f.add(bud,'stigma','#cdd4b0',side*r*.033,r*.64,0,r*.042,r*.028,r*.026);
  return;
 }
 if(shape==='spurgeCyathium'||shape==='snowSpurgeCyathium'){
  const snow=shape==='snowSpurgeCyathium',f=flowerFrame(b,[x,y,z],tilt,yaw),gland=palette.gland||'#b6a35b',bk=palette.margin?patternKind('bract','margin',palette.margin):'bract';
  if(snow){
   for(let l=0;l<2;l++)for(let j=0;j<5;j++)f.add('snowSpurgeBract','petaloidBract',shade(rand,color,.03),0,l*r*.06,0,r*(1-l*.22),r*(1-l*.22),r*(1-l*.22),1.33-l*.12,j*TAU/5+l*.4,0);
  }else for(let side=0;side<2;side++)f.add('spurgeBract',bk,color,0,0,0,r,r,r,1.18,side*Math.PI,0);
  f.add(bud,'cyathium','#94a765',0,r*.08,0,r*.28,r*.20,r*.28);
  for(let j=0;j<(snow?5:4);j++){
   const an=j*TAU/(snow?5:4),at=[Math.sin(an)*r*.24,r*.25,Math.cos(an)*r*.24];
   f.add(bud,'nectary',gland,...at,r*.12,r*.047,r*.071,0,an,0);
   if(!snow&&!palette.brownBracts)for(const side of [-1,1]){const aa=an+side*.3,end=[Math.sin(aa)*r*.36,r*.23,Math.cos(aa)*r*.36];f.branch(at,end,r*.018,gland,'nectaryHorn');}
  }
  f.branch([0,r*.10,0],[0,r*.39,0],r*.023,'#c2c49b','femalePedicel');
  for(let j=0;j<3;j++){const an=j*TAU/3;f.add(bud,'ovary','#9aaa76',Math.sin(an)*r*.068,r*.40,Math.cos(an)*r*.068,r*.089,r*.097,r*.089);}
  for(let j=0;j<6;j++){const an=j*TAU/6,at=[Math.sin(an)*r*.15,r*.34,Math.cos(an)*r*.15];f.branch([0,r*.1,0],at,r*.007,'#dcd9a8','filament');f.add(bud,'anther','#cfbd65',...at,r*.027,r*.017,r*.019);}
  return;
 }
 if(shape==='gauraButterfly'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),pk=palette.margin?patternKind('petal','primroseEdge',palette.margin):palette.blush?patternKind('petal','blush',palette.blush):'petal';
  f.add('tube','hypanthium',palette.whiteBud?'#d6d8b7':'#a4737b',0,-r*.27,0,r*.065,r*.54,r*.065);
  for(let j=0;j<4;j++){
   f.add('gauraPetal',pk,shade(rand,color,.025),0,0,0,r,r,r,1.48,[-1.43,-.46,.46,1.43][j],0);
   f.add('narrow','sepal',palette.whiteBud?'#c4cf9e':'#9a6570',0,-r*.20,0,r*.12,r*.65,r*.65,2.6,j*TAU/4,0);
  }
  // The eight filaments project below the fan of four petals.
  for(let j=0;j<8;j++){
   const side=(j-3.5)/3.5,len=r*(1.03+.12*Math.cos(j)),end=[side*r*.45,r*.60,-len];let from=[0,0,0];
   for(let k=1;k<=5;k++){const t=k/5,at=[end[0]*t,end[1]*Math.sin(t*Math.PI*.6),end[2]*t];f.branch(from,at,r*.007,palette.pink?'#cf8ca2':'#e2ddcd','filament');from=at;}
   f.add(bud,'anther','#c4b27c',...from,r*.055,r*.020,r*.024,0,j*.4,0);
  }
  f.branch([0,0,0],[0,r*.40,-r*1.34],r*.012,'#d5b7b7','style');
  for(let j=0;j<4;j++){const an=j*TAU/4;f.branch([0,r*.40,-r*1.34],[Math.sin(an)*r*.09,r*(.40+.09*Math.cos(an)),-r*1.36],r*.014,'#d8c5bb','stigma');}
  return;
 }
 if(['diphylleiaFlower','jeffersoniaFlower','ranzaniaBell','deinantheCup','kirengeshomaBell','pteridophyllumCross','woodlandPoppy','parnassiaFlower','cornusHerbHead','araliaUmbel'].includes(shape)){
  const hanging=['ranzaniaBell','deinantheCup','kirengeshomaBell','pteridophyllumCross'].includes(shape),f=flowerFrame(b,[x,y,z],(hanging?Math.PI-.35:0)+tilt,yaw),parn=shape==='parnassiaFlower',kir=shape==='kirengeshomaBell',ran=shape==='ranzaniaBell',dein=shape==='deinantheCup',corn=shape==='cornusHerbHead',fern=shape==='pteridophyllumCross',poppy=shape==='woodlandPoppy';
  const count=corn||fern||poppy?4:ran||shape==='diphylleiaFlower'?6:shape==='jeffersoniaFlower'?8:dein?7:5;
  for(let j=0;j<count;j++){
   const an=j*TAU/count,pitch=kir?.18:ran?.72:dein?.87:fern?.85:1.31,len=kir?r*2.4:r;
   f.add(kir?'kirengeshomaPetal':'woodlandPetal',corn?'bract':ran?'petaloidSepal':'petal',shade(rand,color,.035),Math.sin(an)*r*(kir?.34:0),0,Math.cos(an)*r*(kir?.34:0),len*(kir?.43:corn?.83:fern?.64:.95),len,len,pitch,an,0);
   if(ran)f.add('woodlandPetal','petal','#e7e6d3',0,r*.13,0,r*.40,r*.42,r*.42,.57,an+.15,0);
  }
  if(corn){
   for(let j=0;j<16;j++){
    const an=j*2.399,rr=r*.30*Math.sqrt((j+.5)/16),at=[Math.sin(an)*rr,r*.10,Math.cos(an)*rr];
    for(let k=0;k<4;k++){const ka=k*TAU/4;f.add('petal','petal','#4c3a4e',...at,r*.090,r*.14,r*.14,.84,ka,0);f.add(bud,'anther','#dad5b7',at[0]+Math.sin(ka)*r*.057,at[1]+r*.15,at[2]+Math.cos(ka)*r*.057,r*.016,r*.018,r*.016);}
   }return;
  }
  const stamens=parn||shape==='araliaUmbel'?5:fern?4:poppy||dein?46:kir?10:count;
  for(let j=0;j<stamens;j++){
   const an=j*2.399,rr=r*(poppy||dein?.15+.30*Math.sqrt((j+.5)/stamens):.22),yy=r*(kir?1.20:dein?.37+rand()*.20:.38),at=[Math.sin(an)*rr,yy,Math.cos(an)*rr],co=dein?'#b1b1cb':'#d3b75f';
   f.branch([0,r*.02,0],at,r*.010,dein?'#aaa9ca':'#d9d8ba','filament');f.add(bud,'anther',co,...at,r*.043,r*.029,r*.022,0,an,0);
  }
  f.add(bud,'ovary',parn?'#a0b17b':'#a9b48a',0,r*.08,0,r*.11,r*.13,r*.11);
  if(parn)for(let j=0;j<5;j++){
   const an=j*TAU/5,frame=flowerFrame(f,[0,0,0],0,an),petalFrame=flowerFrame(frame,[0,0,0],1.31,0);
   for(let v=-4;v<=4;v++){let from=[0,0,.00006];for(let k=1;k<=10;k++){const t=k/11,u=v*.17,width=.56*Math.pow(Math.sin(Math.PI*t),.38),at=[r*u*width*.95,r*t,r*(.12*t*t+.16*u*u*Math.sin(Math.PI*t))+.00005];petalFrame.branch(from,at,r*.0027,'#aabca2','petalVein');from=at;}}
   for(let v=0;v<11;v++){const aa=(v/10-.5)*1.2,at=[Math.sin(aa)*r*.27,r*.25,Math.cos(aa)*r*.52];frame.branch([0,r*.05,r*.15],at,r*.006,'#cad3a5','staminode');frame.add(bud,'staminodeGland','#d1bb64',...at,r*.025,r*.024,r*.025);}
  }return;
 }
 if(shape==='primroseFlower'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),double=layers>1,pk=palette.lilac?'petal-primrose-lilac':palette.stripe?'petal-primrose-stripe':palette.edge?patternKind('petal','primroseEdge',palette.edge):'petal';
  f.add('tube','calyx','#85915b',0,-r*.37,0,r*.20,r*.56,r*.20);
  for(let l=0;l<layers;l++)for(let j=0;j<5;j++){
   const an=j*TAU/5+l*.58,len=r*(1-l*.13),col=l>1&&palette.center?palette.center:color;
   f.add('primrosePetal',pk,kit.shade(rand,col,.035),0,l*r*.035,0,len,len,len,(double?1.24:1.40)-l*.16,an,0);
  }
  if(layers<=2){
   for(let j=0;j<5;j++){const an=j*TAU/5;f.add('petal','petal',palette.eye||'#d8b848',0,r*.018,0,r*.23,r*.26,r*.26,1.4,an,0);}
   f.add(kit.bud,'throat','#858354',0,r*.065,0,r*.069,r*.016,r*.069);
  }return;
 }
 if(shape==='gerberaHead'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),disc=r*(layers>2?.26:.24),rays=palette.species?23:32;
  for(let layer=0;layer<2;layer++)for(let j=0;j<16;j++)f.add('narrow','involucre','#708351',0,-r*(.06+layer*.08),0,r*.35,r*.49,r,1.35+layer*.17,j*TAU/16+layer*.13,0);
  for(let l=0;l<layers;l++)for(let j=0;j<rays;j++){
   const an=j*TAU/rays+l*.33,len=r*(l<2?.81:.51-(l-2)*.09),col=l>1?palette.inner||color:color,pk=palette.edge?patternKind('petal','primroseEdge',palette.edge):'petal';
   f.add('gerberaRay',pk,kit.shade(rand,col,.035),Math.sin(an)*disc*.72,l*r*.018,Math.cos(an)*disc*.72,len*(palette.species?.72:1),len,len,1.45-l*.06,an,0);
  }
  for(let j=0;j<180;j++){
   const t=(j+.5)/180,an=j*2.399963,rr=disc*Math.sqrt(t);f.add(kit.bud,'discFloret',t>.80?(palette.disc==='#a2a371'?'#d4c899':'#cbb88c'):palette.disc,Math.sin(an)*rr,r*(.07+.065*Math.sqrt(1-t)),Math.cos(an)*rr,r*.018,r*.027,r*.018);
  }return;
 }
 if(shape==='dianthusFringed'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),type=palette.profile||'superbus',tube=type==='superbus'?1.3:type==='arenarius'?.95:type==='barbatus'?.95:.85;
  f.add('tube','calyx-dianthus',type==='superbus'?'#797464':'#79875c',0,-r*tube*.50,0,r*.13,r*tube,r*.13);
  for(let j=0;j<5;j++){const an=j*TAU/5;f.add('narrow','calyxTooth-dianthus','#79875c',Math.sin(an)*r*.12,-r*.12,Math.cos(an)*r*.12,r*.09,r*.20,r*.09,-.12,an,0);}
  for(let j=0;j<4;j++)f.add('narrow','epicalyx-dianthus','#77805c',0,-r*tube*.94,0,r*.11,r*tube*.45,r*.12,-.22,j*TAU/4,0);
  const pk=palette.eye?'petal-dianthus-eye-'+palette.eye.slice(1):palette.rim?'petal-dianthus-rim-'+palette.rim.slice(1):'petal-dianthus';
  for(let l=0;l<layers;l++)for(let j=0;j<5;j++){const rr=r*(1-l*.22);f.add('dianthusPetal-'+type,pk,kit.shade(rand,color,.018),0,l*r*.055,0,rr,rr,rr,0,j*TAU/5+l*.47+(rand()-.5)*.035,0);}
  f.add(bud,'flowerThroat-dianthus','#a6a587',0,r*.003,0,r*.066,r*.020,r*.066);
  for(let j=0;j<10;j++){const an=j*TAU/10,from=[Math.sin(an)*r*.036,r*.012,Math.cos(an)*r*.036],to=[Math.sin(an)*r*.15,r*(j%2?.31:.23),Math.cos(an)*r*.15];f.branch(from,to,r*.009,'#d1c5bf','stamen-dianthus');f.add(bud,'anther-dianthus',type==='superbus'?'#c5b899':'#8c7b82',...to,r*.025,r*.042,r*.022);}
  for(let j=0;j<2;j++){const from=[0,0,0],bend=[(j?1:-1)*r*.045,r*.28,0],to=[(j?1:-1)*r*.14,r*.37,r*.022];f.branch(from,bend,r*.014,'#d8cac8','style-dianthus');f.branch(bend,to,r*.012,'#d8cac8','style-dianthus');}return;
 }
 if(['verbenaSalver','tapienFloret'].includes(shape)){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);f.add('verbenaCorolla','petal-verbena',color,0,0,0,r,r,r);
  f.add(kit.bud,'flowerThroat','#62526e',0,-r*.12,0,r*.13,r*.02,r*.13);
  for(let j=0;j<4;j++){const aa=j*TAU/4;f.add(kit.bud,'anther-verbena','#d7c6ba',Math.sin(aa)*r*.07,-r*.05,Math.cos(aa)*r*.07,r*.025,r*.018,r*.025);}return;
 }
 if(['brunneraFlower','stolonPhloxFlower'].includes(shape)){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),br=shape==='brunneraFlower',tube=br?.45:shape==='tapienFloret'?1.5:1.65,pk=palette.edge?patternKind('petal','primroseEdge',palette.edge):'petal';
  f.add('tube','petal',color,0,-r*tube*.48,0,r*.10,r*tube,r*.10);
  for(let j=0;j<5;j++)f.add('smallSalverPetal',pk,color,0,0,0,r*(br?1.05:.81),r,r,1.48,j*TAU/5,0);
  f.add(kit.bud,'flowerEye',br?'#dddcc3':shape==='tapienFloret'?'#dad6c3':'#b69a68',0,r*.025,0,r*.14,r*.02,r*.14);return;
 }
 if(shape==='sunflowerHead'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),disc=r*.57;
  f.add(bud,'receptacle','#71864c',0,-r*.08,0,disc,r*.14,disc);
  for(let layer=0;layer<2;layer++)for(let j=0;j<20;j++){
   const an=j*TAU/20+layer*.14,len=r*(layer?.51:.57);
   f.add('sunflowerRay','petal',shade(rand,color,.05),Math.sin(an)*disc*.81,layer*r*.025,Math.cos(an)*disc*.81,len*.74,len,len,1.39+(rand()-.5)*.15,an,0);
  }
  for(let j=0;j<720;j++){
   const t=(j+.5)/720,an=j*2.399963,rr=disc*Math.sqrt(t),yy=r*(.07+.10*Math.sqrt(1-t));
   f.add(bud,'discFloret',shade(rand,t>.40?'#b59b41':'#7f8744',.06),Math.sin(an)*rr,yy,Math.cos(an)*rr,r*.018,r*(t>.40?.045:.023),r*.018,0,an,0);
  }
  for(let layer=0;layer<3;layer++)for(let j=0;j<10;j++){const an=j*TAU/10+layer*.29;f.add('sunflowerBract','involucre','#718c50',Math.sin(an)*disc*.64,-r*(.08+layer*.023),Math.cos(an)*disc*.64,r*.45,r*.45,r,1.55+layer*.15,an,0);}return;
 }
 if(shape==='gardenDaisy'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),n=palette.rayCount||28,disc=r*.28;
  for(let j=0;j<12;j++)f.add('narrow','involucre','#6c854d',0,-r*.09,0,r*.31,r*.38,r,1.27,j*TAU/12,0);
  for(let j=0;j<n;j++){const an=j*TAU/n;f.add('gardenRay','petal',shade(rand,color,.025),Math.sin(an)*disc*.55,0,Math.cos(an)*disc*.55,r*.90,r*.90,r*.90,1.45+(rand()-.5)*.10,an,0);}
  for(let j=0;j<100;j++){const t=(j+.5)/100,an=j*2.399,rr=disc*Math.sqrt(t);f.add(bud,'discFloret',shade(rand,palette.disc||'#cbb049',.04),Math.sin(an)*rr,r*(.09+.07*Math.sqrt(1-t)),Math.cos(an)*rr,r*.025,r*.031,r*.025);}
  return;
 }
 if(shape==='scabiosaHead'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  for(let j=0;j<10;j++)f.add('narrow','involucre','#6a8152',0,-r*.09,0,r*.45,r*.44,r,1.63,j*TAU/10,0);
  for(let j=0;j<72;j++){
   const t=(j+.5)/72,an=j*2.399,rr=r*.66*Math.sqrt(t),yy=r*(.18+.32*Math.sqrt(1-t)),at=[Math.sin(an)*rr,yy,Math.cos(an)*rr],outer=t>.74;
   const fl=flowerFrame(f,at,outer?.37:0,an),fr=r*(outer?.19:.12);fl.add('trumpet','petal',shade(rand,color,.05),0,-fr*.38,0,fr*.59,fr*.70,fr*.59);
   for(let k=0;k<5;k++){const ka=k*TAU/5,len=fr*(outer&&k<3?2.1:1);fl.add('petal','petal',color,0,fr*.28,0,len*.75,len,len,1.10,ka,0);}
   for(let k=0;k<4;k++){const ka=k*TAU/4,end=[Math.sin(ka)*fr*.25,fr*(.88+k%2*.19),Math.cos(ka)*fr*.25];fl.branch([0,0,0],end,r*.005,'#d7d0c5','filament');fl.add(bud,'anther','#e3ddcc',...end,r*.014,r*.010,r*.014);}
  }return;
 }
 if(shape==='delphiniumBee'){
  const f=flowerFrame(b,[x,y,z],Math.PI/2+tilt,yaw);
  for(let l=0;l<layers;l++)for(let j=0;j<5;j++){const an=j*TAU/5+l*.55,len=r*(1-l*.20);f.add('broadRuffledPetal','sepal',shade(rand,color,.035),0,l*r*.04,0,len,len,len,1.1-l*.17,an,0);}
  f.add('tube','spur',color,0,-r*.39,r*.08,r*.15,r*.80,r*.15,-.40,0,0);
  for(let j=0;j<4;j++)f.add('petal','petal','#dedbd0',0,r*.16,0,r*.24,r*.36,r,1.0,j*TAU/4,0);
  for(let j=0;j<16;j++){const an=j*2.399;f.add(bud,'anther','#9f976d',Math.sin(an)*r*.10,r*.23,Math.cos(an)*r*.10,r*.019,r*.025,r*.019);}return;
 }
 if(shape==='hollyhockCup'||shape==='portulacaDouble'||shape==='oenotheraCup'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),holly=shape==='hollyhockCup',oen=shape==='oenotheraCup',port=!holly&&!oen,count=oen?4:5;
  const pk=oen?'petal-oenothera-veins':port&&palette.mermaid?'petal-portulaca-mermaid':'petal';
  for(let k=0;k<(holly?7:oen?4:2);k++)f.add('leaf','calyx','#809461',0,-r*.09,0,r*.32,r*.42,r,1.28,k*TAU/(holly?7:oen?4:2),0);
  for(let l=0;l<(oen?1:layers);l++)for(let j=0;j<count;j++){
   const an=j*TAU/count+l*.48,len=r*(1-l*(holly?.12:.10));f.add('broadRuffledPetal',pk,shade(rand,color,.025),0,l*r*.045,0,len,len,len,(oen?1.18:1.07)-l*.11,an,0);
  }
  if(oen){
   for(let j=0;j<8;j++){const an=j*TAU/8,end=[Math.sin(an)*r*.24,r*.33,Math.cos(an)*r*.24];f.branch([0,0,0],end,r*.012,'#ddd1a3','filament');f.add(bud,'anther','#d3b348',...end,r*.06,r*.019,r*.022,0,an,0);}
   f.branch([0,0,0],[0,r*.52,0],r*.018,'#d5d1a2','style');for(let j=0;j<4;j++){const an=j*TAU/4;f.branch([0,r*.52,0],[Math.sin(an)*r*.19,r*.56,Math.cos(an)*r*.19],r*.022,'#dddbb7','stigma');}
  }else if(holly&&layers===1){
   f.add('tube','staminalColumn','#d9bf83',0,r*.20,0,r*.10,r*.60,r*.10);
   for(let j=0;j<38;j++){const an=j*2.399;f.add(bud,'anther','#d4b367',Math.sin(an)*r*.09,r*(.10+j*.012),Math.cos(an)*r*.09,r*.028,r*.021,r*.028);}
  }else if(port&&!palette.mermaid){
   for(let j=0;j<35;j++){const an=j*2.399,end=[Math.sin(an)*r*.18,r*(.23+.10*rand()),Math.cos(an)*r*.18];f.branch([0,0,0],end,r*.008,'#bc608b','filament');f.add(bud,'anther','#d4b15f',...end,r*.025,r*.020,r*.025);}
  }return;
 }
 if(shape==='solanumStar'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);f.add('solanumStar','petal',color,0,0,0,r,r,r);
  for(let j=0;j<5;j++){const an=j*TAU/5;f.add('narrow','calyx','#6e8860',0,-r*.1,0,r*.25,r*.38,r,.83,an,0);f.add(bud,'anther',palette.pepper?'#51415f':'#d6b947',Math.sin(an)*r*.12,r*.18,Math.cos(an)*r*.12,r*.045,r*.20,r*.046,.08,an,0);}
  f.branch([0,0,0],[0,r*.45,0],r*.012,'#c0bd8b','style');return;
 }
 if(shape==='mesembFlower'||shape==='coreopsisHead'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),mesemb=shape==='mesembFlower',count=mesemb?52:8;
  f.add(bud,'receptacle',mesemb?'#9a537a':'#9f8c48',0,-r*.04,0,r*.23,r*.12,r*.23);
  for(let j=0;j<count;j++){
   const an=j*TAU/count,rr=mesemb?r*(.90+.10*Math.sin(j*2.3)):r;
   f.add(mesemb?'calendulaRay':'coreopsisRay',mesemb?patternKind('petal','base','#e2dccb'):'petal',shade(rand,color,.035),Math.sin(an)*r*.12,0,Math.cos(an)*r*.12,rr*(mesemb?.43:1),rr,rr,mesemb?-.08:1.42,an,0);
  }
  for(let j=0;j<(mesemb?56:65);j++){
   const t=(j+.5)/(mesemb?56:65),an=j*2.399,rr=r*.27*Math.sqrt(t),tip=[Math.sin(an)*rr,r*(.10+.07*(1-t)),Math.cos(an)*rr];
   if(mesemb){f.branch([tip[0],0,tip[2]],tip,r*.010,'#873b62','filament');f.add(bud,'anther','#cbad56',...tip,r*.025,r*.026,r*.021);}
   else f.add(bud,'discFloret',t>.6?'#d7b451':'#9e813f',...tip,r*.029,r*.045,r*.029);
  }
  for(let j=0;j<(mesemb?5:8);j++)f.add('narrow','calyx','#75855c',0,-r*.10,0,r*.34,r*.34,r,1.15,j*TAU/(mesemb?5:8),0);return;
 }
 if(shape==='pinkSageLips'){
  const f=flowerFrame(b,[x,y,z],Math.PI/2+tilt,yaw);
  f.add('trumpet','petal',color,0,-r*.45,0,r*.42,r*1.02,r*.42,.20,0,0);
  f.add('petal','petal',color,0,r*.55,r*.05,r*.98,r*.84,r,1.18,0,0);
  f.add('petal','petal',color,0,r*.47,-r*.02,r*.82,r*1.02,r,1.72,Math.PI,0);
  f.add('tube','calyx','#9a7a83',0,-r*.83,0,r*.25,r*.42,r*.25,.2,0,0);
  for(let j=0;j<4;j++){
   const side=j%2?1:-1,x=side*r*(.13+j*.025),base=[x,-r*.16,0],mid=[x,r*.77,-r*.28],end=[x,r*1.50,-r*.72];
   f.branch(base,mid,r*.012,'#c4a2bd','filament');f.branch(mid,end,r*.012,'#c4a2bd','filament');f.add(bud,'anther','#6e4c6a',...end,r*.04,r*.025,r*.03);
  }
  f.branch([0,-r*.1,0],[0,r*1.60,r*.2],r*.012,'#c6a2b5','style');return;
 }
 if(shape==='nasturtiumFlower'){
  const f=flowerFrame(b,[x,y,z],Math.PI/2+tilt,yaw),paint=palette.orchid&&!palette.faded?'petal-nasturtium-flame':'petal';
  for(let j=0;j<5;j++)f.add('narrow','calyx','#939760',0,-r*.12,0,r*.6,r*.65,r,1.05,j*TAU/5,0);
  f.add('tube','spur',palette.cream?'#c3c187':'#abb17a',0,-r*.38,r*.02,r*.15,r*.80,r*.15,-.55,0,0);
  for(let layer=0;layer<layers;layer++)for(let j=0;j<5;j++){
   const an=[-.63,.63,1.97,Math.PI,4.31][j],len=r*(1-layer*.18),upper=j<2;
   f.add('nasturtiumPetal',paint,shade(rand,color,.025),Math.sin(an)*r*.12,layer*r*.035,Math.cos(an)*r*.12,len*(upper?1:1.05),len,len,1.37-layer*.18,an+layer*.24,0);
   if(!upper&&layer===0)for(const side of [-1,1])for(let k=0;k<5;k++){
    const q=flowerFrame(f,[Math.sin(an)*r*.17,0,Math.cos(an)*r*.17],0,an),yy=r*(.10+k*.043),xx=side*r*(.07+k*.008);
    q.branch([xx,.015,yy],[xx+side*r*.12,r*.04,yy+r*.06],r*.007,palette.cream?'#e0ce8b':'#d7b65f','petalFringe');
   }
  }
  for(let j=0;j<8;j++){const an=j*2.399,tip=[Math.sin(an)*r*.15,r*.28,Math.cos(an)*r*.13];f.branch([0,-r*.1,0],tip,r*.013,'#d4b47b','filament');f.add(bud,'anther','#d3b474',...tip,r*.04,r*.055,r*.03);}
  return;
 }
 if(shape==='morningGloryFunnel'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  f.add(palette.star?'morningGloryStar':'morningGloryRound',palette.picotee?'petal-morning-picotee':'petal-morning',color,0,-r*.8,0,r,r,r);
  for(let j=0;j<5;j++){const an=j*TAU/5;f.add('narrow','calyx','#819761',0,-r*.85,0,r*.23,r*.61,r,.50,an,0);const tip=[Math.sin(an)*r*.095,-r*.20,Math.cos(an)*r*.095];f.branch([0,-r*.67,0],tip,r*.012,'#dedcc2','filament');f.add(bud,'anther','#ddd5b3',...tip,r*.025,r*.037,r*.025);}return;
 }
 if(shape==='corncockleFlower'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  f.add('tube','calyx','#86986c',0,-r*.68,0,r*.68,r*.72,r*.68);
  for(let j=0;j<5;j++){const an=j*TAU/5;f.add('corncockleLeaf','sepal','#93a17b',0,-r*.26,0,r*.8,r*1.1,r,1.0,an+Math.PI/5,0);f.add('corncocklePetal','petal-corncockle',shade(rand,color,.025),0,0,0,r,r,r,1.30,an,0);}
  for(let j=0;j<10;j++){const an=j*TAU/10;f.add(bud,'anther','#bdbe91',Math.sin(an)*r*.14,r*.12,Math.cos(an)*r*.14,r*.02,r*.027,r*.023);}return;
 }
 if(shape==='snapdragonLips'){
  const f=flowerFrame(b,[x,y,z],Math.PI/2+tilt,yaw),tube=palette.tube||color,lip=palette.lip||color;
  f.add('trumpet','petal',tube,0,-r*.63,0,r*.90,r*1.34,r*.85);
  for(const side of [-1,1])f.add('petal','petal',lip,side*r*.18,r*.64,r*.06,r*.94,r*.61,r,1.00,side*.51,0);
  for(let j=0;j<3;j++){const an=Math.PI+(j-1)*.65;f.add('petal','petal',lip,Math.sin(an)*r*.12,r*.50,-r*.20,r*.71,r*.58,r,1.76,an,0);}
  f.add(bud,'palate',palette.palate,0,r*.63,-r*.15,r*.34,r*.26,r*.23);
  for(let j=0;j<5;j++)f.add('leaf','calyx','#73855b',0,-r*.66,0,r*.38,r*.28,r,.62,j*TAU/5,0);return;
 }
 if(shape==='calendulaHead'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),crest=palette.crest,disc=r*(crest?.13:.24);
  for(let j=0;j<16;j++)f.add('narrow','involucre','#60804b',0,-r*.10,0,r*.24,r*.27,r,1.27,j*TAU/16,0);
  for(let layer=0;layer<layers;layer++)for(let j=0;j<28;j++){
   const an=j*TAU/28+layer*.41,len=r*(1-layer*.11),kind=palette.outside?'petal-dahlia-outside-'+palette.outside.slice(1):'petal';
   f.add('calendulaRay',kind,shade(rand,color,.035),Math.sin(an)*disc*.40,layer*r*.04,Math.cos(an)*disc*.40,len,len,len,-layer*.16,an,0);
  }
  if(crest)for(let j=0;j<140;j++){
   const t=(j+.5)/140,an=j*2.399,rr=r*.59*Math.sqrt(t),len=r*(.12+.15*t);
   f.add('calendulaRay',patternKind('petal','tip','#7d4832'),shade(rand,'#c59851',.02),Math.sin(an)*rr,r*(.10+.13*(1-t)),Math.cos(an)*rr,len,len,len,-.86,an,0);
  }
  f.add(bud,'receptacle',palette.disc,0,r*.05,0,disc,r*.07,disc);
  for(let j=0;j<100;j++){const t=(j+.5)/100,an=j*2.399,rr=disc*Math.sqrt(t);f.add(bud,'discFloret',t>.75?'#bd8c42':palette.disc,Math.sin(an)*rr,r*.105,Math.cos(an)*rr,r*.019,r*.027,r*.019);}
  return;
 }
 if(shape==='nemophilaCup'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  f.add('nemophilaCup',palette.fiveSpots?'petal-nemophila-spots':'petal-nemophila-blue',color,0,0,0,r,r,r);
  for(let j=0;j<5;j++){
   const an=j*TAU/5,tip=[Math.sin(an)*r*.24,r*.23,Math.cos(an)*r*.24];
   f.add('narrow','calyx','#78965f',0,-r*.10,0,r*.50,r*.42,r,1.17,an,0);
   f.branch([0,0,0],tip,r*.010,'#dfded4','filament');f.add(bud,'anther','#68667a',...tip,r*.043,r*.023,r*.026,.2,an,0);
  }
  f.branch([0,0,0],[0,r*.24,0],r*.012,'#c1cbad','style');return;
 }
 if(shape==='californiaPoppyCup'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  f.add(bud,'receptacle','#90a084',0,-r*.015,0,r*.23,r*.055,r*.23);
  for(let layer=0;layer<layers;layer++)for(let j=0;j<4;j++){
   const len=r*(1-layer*.17),an=j*TAU/4+layer*.62;
   f.add(palette.frill?'poppyFrill':'poppyCup','petal',shade(rand,color,.04),0,layer*r*.04,0,len,len,len,layer*.07,an,0);
  }
  for(let j=0;j<32;j++){const an=j*2.399,rr=r*(.10+.14*Math.sqrt((j+.5)/32)),tip=[Math.sin(an)*rr,r*(.35+.12*rand()),Math.cos(an)*rr];f.branch([0,0,0],tip,r*.009,'#dcae4a','filament');f.add(bud,'anther','#d3a447',...tip,r*.022,r*.06,r*.021);}
  for(let j=0;j<4;j++){const an=j*TAU/4;f.branch([0,r*.16,0],[Math.sin(an)*r*.17,r*.50,Math.cos(an)*r*.17],r*.013,'#bda850','stigma');}return;
 }
 if(shape==='alyssumCross'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  for(let j=0;j<4;j++){const an=j*TAU/4;f.add('petal','petal',color,Math.sin(an)*r*.08,0,Math.cos(an)*r*.08,r*.91,r*.91,r,1.37,an,0);f.add('narrow','calyx','#889974',0,-r*.10,0,r*.23,r*.24,r,1.1,an,0);}
  f.add(bud,'ovary','#aab581',0,r*.05,0,r*.13,r*.13,r*.13);
  for(let j=0;j<6;j++){const an=j*TAU/6,tip=[Math.sin(an)*r*.22,r*(j<4?.18:.12),Math.cos(an)*r*.22];f.branch([0,0,0],tip,r*.016,'#d2cfab','filament');f.add(bud,'anther','#c5b667',...tip,r*.046,r*.027,r*.038);}return;
 }
 if(shape==='pericallisHead'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),disc=r*.22;
  for(let j=0;j<12;j++)f.add('narrow','involucre','#66804b',0,-r*.11,0,r*.48,r*.29,r,1.42,j*TAU/12,0);
  const paint=palette.ring?patternKind('petal','base','#eee7df'):'petal';
  for(let j=0;j<16;j++){const turn=j*TAU/16;f.add('petal',paint,shade(rand,color,.018),Math.sin(turn)*disc*.6,0,Math.cos(turn)*disc*.6,r*(palette.slender?.32:.47),r*.92,r,1.47+(rand()-.5)*.12,turn,0);}
  f.add(bud,'receptacle','#47344b',0,r*.018,0,disc,r*.095,disc);
  for(let j=0;j<84;j++){const t=(j+.5)/84,turn=j*2.399,rad=disc*Math.sqrt(t),yy=r*(.052+.038*(1-t));f.add(bud,'discFloret',t>.78?'#9f8364':'#4e3658',Math.sin(turn)*rad,yy,Math.cos(turn)*rad,r*.019,r*.036,r*.019);}
  return;
 }
 if(shape==='nemesiaLips'){
  const f=flowerFrame(b,[x,y,z],Math.PI/2+tilt,yaw),upper=palette.upper||color,lower=palette.lower||color;
  f.add('trumpet','petal',upper,0,-r*.3,0,r*.38,r*.62,r*.38);
  // Four lobes form the upper fan; the broad lower lip has a shallow central cleft.
  for(let j=0;j<4;j++){const turn=[-.86,-.28,.28,.86][j];f.add('petal','petal',shade(rand,upper,.03),Math.sin(turn)*r*.12,r*.15,r*.06,r*.77,r*.69,r,1.20,turn,0);}
  const lowerKind=palette.rim?patternKind('petal','margin',palette.rim):'petal';
  for(const side of [-1,1])f.add('petal',lowerKind,shade(rand,lower,.025),side*r*.14,r*.18,-r*.03,r*.89,r*.86,r,1.60,Math.PI+side*.22,0);
  f.add(bud,'palate',palette.palate||'#d3ae55',0,r*.28,-r*.23,r*.27,r*.16,r*.19);
  for(let j=0;j<5;j++)f.add('narrow','calyx','#708b4c',0,-r*.33,0,r*.45,r*.32,r,.46,j*TAU/5,0);
  f.add('tube','spur',upper,0,-r*.38,-r*.07,r*.072,r*.30,r*.072,.65,0,0);return;
 }
 if(shape==='helleboreCup'||shape==='helleboreBell'||shape==='tessenFlower'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),tessen=shape==='tessenFlower',bell=shape==='helleboreBell',sepal=tessen?'clematisSepal':bell?'helleboreBell':palette.sword?'helleboreSword':palette.frill?'helleboreFrill':'helleboreSepal';
  const sepalKind=tessen?'sepal-clematis-green':palette.paint?'sepal-hellebore-'+palette.paint:palette.pinkBack?'sepal-hellebore-pinkback':patternKind('sepal',pattern,patternColor);
  const whorls=tessen?1:Math.max(1,layers);
  for(let layer=0;layer<whorls;layer++){
   const n=layer?7+layer*2:tessen?6:5,size=1-layer*.13;
   for(let j=0;j<n;j++)f.add(sepal,sepalKind,shade(rand,color,.025),0,layer*r*.035,0,r*size,r*size,r*size,layer*.10,j*TAU/n+.10+layer*.41,0);
  }
  if(tessen){
   for(let j=0;j<85;j++){const t=(j+.5)/85,an=j*2.399,rad=r*.34*Math.sqrt(t),yy=r*.30*Math.sqrt(1-t),len=r*(.20+.14*t);f.add('narrow','petal','#40274c',Math.sin(an)*rad,yy,Math.cos(an)*rad,len*.55,len,len,.15+t*.80,an,0);}return;
  }
  // The coloured parts are sepals; the true petals form small tubular nectaries.
  if(whorls===1)for(let j=0;j<10;j++){
   const an=j*TAU/10,rr=r*.23;
   if(palette.semiDouble)f.add('helleboreFrill','nectary',palette.nectary||color,Math.sin(an)*rr,r*.07,Math.cos(an)*rr,r*.29,r*.53,r*.53,.46,an,0);
   else f.add('tube','nectary',palette.nectary||'#8a9b52',Math.sin(an)*rr,r*.10,Math.cos(an)*rr,r*.055,r*.22,r*.055,.18,an,0);
  }
  for(let j=0;j<48;j++){
   const t=(j+.5)/48,an=j*2.399,rr=r*(.07+.20*Math.sqrt(t)),at=[Math.sin(an)*rr,r*(bell?.53:.26+.17*t),Math.cos(an)*rr];
   f.branch([0,0,0],at,r*.008,'#d6d6a6','filament');f.add(bud,'anther','#e0dcac',...at,r*.025,r*.032,r*.022,.2,an,.2);
  }
  for(let j=0;j<5;j++){const an=j*TAU/5;f.add(bud,'carpel','#9ba967',Math.sin(an)*r*.055,r*.23,Math.cos(an)*r*.055,r*.035,r*.14,r*.035,.1,an,0);}
  return;
 }
 if(shape==='speciesTulipFlower'||shape==='earlyCrocusFlower'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),crocus=shape==='earlyCrocusFlower',name=palette.pattern||'sara',pointed=name.startsWith('clusiana')||name.startsWith('persian'),tepal=crocus?'crocusCup':pointed?'tulipPointed':'tulipCup';
  for(let j=0;j<6;j++){
   const paint=name.startsWith('clusiana')?j%2===0?'clusiana-outer-'+(palette.yellow?'yellow':'white'):'plain':name;
   f.add(tepal,'petal-bulb-'+paint,shade(rand,color,.014),0,0,0,r*(j%2?.98:1.02),r,r,0,j*TAU/6,0);
  }
  for(let j=0;j<(crocus?3:6);j++){
   const an=j*TAU/(crocus?3:6),tip=[Math.sin(an)*r*.19,r*(crocus?.65:.56),Math.cos(an)*r*.19];
   f.branch([0,0,0],tip,r*.013,crocus?'#e8c776':'#b7b689','filament');f.add(bud,'anther',crocus?'#e5b948':'#60593e',...tip,r*.042,r*.13,r*.034);
  }
  if(crocus){
   f.branch([0,0,0],[0,r*.71,0],r*.015,'#e4a147','style');
   for(let j=0;j<3;j++){const an=j*TAU/3;f.branch([0,r*.71,0],[Math.sin(an)*r*.20,r*.86,Math.cos(an)*r*.20],r*.035,'#e38935','stigma');}
  }else{
   f.add(bud,'ovary','#bcc08a',0,r*.28,0,r*.095,r*.24,r*.095);
   for(let j=0;j<3;j++){const an=j*TAU/3;f.add(bud,'stigma','#d0ca88',Math.sin(an)*r*.040,r*.52,Math.cos(an)*r*.040,r*.070,r*.025,r*.070);}
  }
  return;
 }
 if(shape==='liliumFlower'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),name=palette.pattern||'proposal',reflex=['kuruma','claude','snowy','pinkmorning'].includes(name),trumpet=name==='regale',funnel=['rubellum','japonicum'].includes(name),tepal=reflex?palette.curl===false?'liliumHalfReflex':'liliumReflex':trumpet?'liliumTrumpet':funnel?'liliumFunnel':'liliumTepal';
  for(let j=0;j<6;j++)f.add(tepal,'petal-lilium-'+name,shade(rand,color,.018),0,0,0,r*(j%2?1:.73),r,r,0,j*TAU/6,0);
  const projection=trumpet?1.65:funnel?1.28:reflex?1.35:.88;
  for(let j=0;j<6;j++){
   const an=j*TAU/6,tip=[Math.sin(an)*r*.25,r*projection,Math.cos(an)*r*.25],mid=[tip[0]*.48,r*projection*.56,tip[2]*.48];
   f.branch([0,0,0],mid,r*.012,'#cad09a','filament');f.branch(mid,tip,r*.010,'#cdd6a1','filament');
   f.add(bud,'anther',palette.anther||'#934327',...tip,r*.037,r*.12,r*.033,.18,an,.18);
  }
  const end=[0,r*(projection+.12),0];f.branch([0,0,0],end,r*.016,'#b8c78f','style');
  for(let j=0;j<3;j++){const an=j*TAU/3;f.add(bud,'stigma','#b3bc78',Math.sin(an)*r*.030,end[1],Math.cos(an)*r*.030,r*.040,r*.024,r*.040);}
  return;
 }
 if(shape==='muscariUrn'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  f.add('muscariUrn','petal-muscari-mouth',color,0,0,0,r,r,r);
  // The six stamens sit inside the narrow mouth, not outside like a lily.
  for(let j=0;j<6;j++){const an=j*TAU/6;f.add(bud,'anther','#c8c395',Math.sin(an)*r*.20,r*1.38,Math.cos(an)*r*.20,r*.045,r*.085,r*.045);}return;
 }
 if(shape==='hyacinthFlower'||shape==='freesiaFlower'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),hy=shape==='hyacinthFlower',throat=palette.throat||color;
  f.add('freesiaTube','petal',hy?color:throat,0,0,0,r*(hy?.55:1),r*(hy?.48:1),r*(hy?.55:1));
  const layers=hy?1:palette.style==='double'?2:1;
  for(let layer=0;layer<layers;layer++)for(let j=0;j<6;j++){
   const an=j*TAU/6+layer*.52,rr=r*(hy?.16:.29),len=r*(hy?1:layer?.70:1.10),flowerKind=hy?'petal':'petal-freesia-'+throat.slice(1)+(palette.veins&&j>=2&&j<=4?'-veins':'');
   f.add(hy?'hyacinthReflex':'freesiaLobe',flowerKind,shade(rand,color,.015),Math.sin(an)*rr,r*(hy?.49:1.08+layer*.08),Math.cos(an)*rr,len*(hy?.85:j===0?1.14:1),len,len,hy?.25:layer?.28:.67,an,0);
  }
  for(let j=0;j<(hy?6:3);j++){
   const an=j*TAU/(hy?6:3),tip=[Math.sin(an)*r*.13,r*(hy?.58:1.45),Math.cos(an)*r*.13];f.branch([0,0,0],tip,r*.011,'#d9d1b1','filament');f.add(bud,'anther',hy?'#ac986a':'#e0d8bf',...tip,r*.04,r*(hy?.045:.15),r*.032);
  }
  if(!hy){f.branch([0,0,0],[0,r*1.56,0],r*.014,'#e7dfc7','style');for(let j=0;j<3;j++){const an=j*TAU/3;f.branch([0,r*1.56,0],[Math.sin(an)*r*.12,r*1.72,Math.cos(an)*r*.12],r*.012,'#e7dfc7','stigma');}}
  return;
 }
 if(shape==='irisFlower'||shape==='blackberryFlower'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),blackberry=shape==='blackberryFlower',beard=palette.bearded,flat=palette.flat,snake=palette.snake,pattern=palette.pattern||'gold';
  f.branch([0,-r*.40,0],[0,0,0],r*.075,'#a2af76','perianthTube');
  for(let j=0;j<(blackberry?6:3);j++){
   const an=j*TAU/(blackberry?6:3),part=flowerFrame(f,[0,0,0],0,an);
   part.add(beard?'irisBeardedFall':snake?'irisSnakeFall':flat||blackberry?'irisDietesFall':'irisFall','petal-iris-'+pattern+'-fall',shade(rand,color,.018),0,0,0,r*(blackberry?.56:1),r,r);
   if(!blackberry){
    const std=flowerFrame(f,[0,0,0],0,an+Math.PI/3);
    std.add(flat?'irisDietesFall':beard?'irisBeardedStandard':'irisStandard','petal-iris-'+pattern+'-standard',color,0,r*.02,0,r*(flat?.52:snake?.55:1),r*(snake?.45:flat?.68:1),r*(flat?.68:1));
    const styleColor=flat?'#b6a3d2':color;
    part.add('irisStyle','petaloidStyle',styleColor,0,r*.10,0,r,r,r);
    for(const side of [-1,1])part.add('petal','styleCrest',styleColor,side*r*.048,r*.34,r*.62,r*.17,r*.30,r*.30,.70,side*.70,0);
    part.branch([0,0,r*.10],[0,r*.15,r*.45],r*.016,'#d5cfa5','filament');
    part.add(bud,'anther','#ccbd76',0,r*.15,r*.42,r*.03,r*.045,r*.14);
    if(beard)for(let k=0;k<42;k++){
     const t=k/41,xx=Math.sin(k*2.399)*r*.07,at=[xx,r*(.22*Math.sin(t*.50*Math.PI)-.33*Math.pow(t*.50,3))+.004*r,r*(.19+t*.34)],end=[xx,at[1]+r*.075,at[2]];
     part.branch(at,end,r*.009,'#d5b765','beard');part.add(bud,'beardTip','#e6e1cf',...end,r*.009,r*.014,r*.009);
    }
   }
  }
  if(blackberry)for(let j=0;j<3;j++){
   const an=j*TAU/3,tip=[Math.sin(an)*r*.13,r*.30,Math.cos(an)*r*.13];f.branch([0,0,0],tip,r*.018,'#dbb36e','filament');f.add(bud,'anther','#caad4e',...tip,r*.039,r*.10,r*.035);
  }
  return;
 }
 if(shape==='narcissusFlower'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),hoop=palette.corona==='hoop',split=palette.corona==='split',corona=palette.color||color;
  f.branch([0,-r*.40,0],[0,0,0],r*.10,'#a7b080','perianthTube');
  for(let j=0;j<6;j++){
   const an=j*TAU/6,len=r*(hoop?.80:1);
   f.add(hoop?'narrow':palette.reflexed?'narcissusNarrowTepal':'narcissusTepal','petal',shade(rand,color,.018),0,(j%2)*r*.025,0,len*(hoop?.14:1),len,len,hoop?1.20:palette.reflexed?1.96:1.48,an,0);
   if(split)f.add('narcissusSplitCorona','corona',corona,0,r*(j%2?.13:.08),0,r*.70,r*.69,r*.69,1.40,an,0);
  }
  const length=r*(palette.length||.35),width=r*(palette.width||.32);
  if(!split)f.add(hoop?'narcissusHoop':palette.corona==='trumpet'?'narcissusTrumpet':'narcissusCup','corona',corona,0,r*.03,0,width,length,width);
  for(let j=0;j<6;j++){
   const an=j*TAU/6,tip=[Math.sin(an)*r*.09,length*(hoop?.78:.55),Math.cos(an)*r*.09];
   f.branch([0,0,0],tip,r*.009,'#e4d8a0','filament');f.add(bud,'anther','#d5ae49',...tip,r*.035,r*.07,r*.026);
  }
  f.branch([0,0,0],[0,length*.70,0],r*.013,'#d1d29a','style');f.add(bud,'stigma','#cfcd8d',0,length*.70,0,r*.045,r*.023,r*.045);return;
 }
 if(shape==='dahliaHead'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),single=layers<=2||palette.openDisc,disc=r*(single?.23:.055),sector=rand()*TAU;
  for(let j=0;j<8;j++)f.add('leaf','bract','#70804e',0,-r*.06,0,r*.27,r*.34,r,1.9,j*TAU/8,0);
  f.add(bud,'receptacle',palette.disc||'#69412d',0,0,0,r*.26,r*.18,r*.26);
  for(let layer=0;layer<layers;layer++){
   const t=layer/Math.max(1,layers-1),count=single?petals:Math.max(7,Math.round(petals*(1-t*.50))),length=r*(single?1-layer*.12:1-t*.73),rr=single?disc*.65:r*.04;
   for(let j=0;j<count;j++){
    const an=j*TAU/count+layer*.47,variation=palette.informal?(rand()-.5)*.25:(rand()-.5)*.06;
    const whiteSector=palette.sector&&((an-sector+TAU)%TAU)<(palette.sector==='variable'?1.9:1.1);
    const colorHere=whiteSector?palette.sectorColor||'#f0e6e3':shade(rand,color,.028),outside=palette.outside;
    let surface=(whiteSector?'petal':kind)+'-dahlia';
    if(outside)surface+='-outside-'+outside.replace('#','');
    f.add(palette.split?'dahliaSplitRay':palette.informal?'dahliaTwistedRay':palette.round?'dahliaRoundRay':'dahliaRay',surface,colorHere,
     Math.sin(an)*rr,r*(single?layer*.07:t*.20),Math.cos(an)*rr,length*(palette.narrow?.70:single?1.10:1.05),length,length,
     (single?1.48-layer*.12:1.80-t*1.45)+variation,an,variation*.35);
   }
  }
  // Single and semi-double heads show tubular disc florets, not a featureless ball.
  if(!single){
   f.add(bud,'rayBud',color,0,r*.27,0,r*.08,r*.13,r*.08);
   for(let j=0;j<7;j++)f.add('dahliaRay','petal-dahlia',color,0,r*.24,0,r*.12,r*.19,r*.19,.34,j*TAU/7,0);
  }else{
   f.add(bud,'disc',palette.disc||'#5a3837',0,r*.055,0,disc,disc*.47,disc);
   for(let j=0;j<84;j++){
    const t=(j+.5)/84,an=j*2.399,rr=disc*Math.sqrt(t),yy=r*.065+disc*.43*Math.sqrt(1-t),at=[Math.sin(an)*rr,yy,Math.cos(an)*rr],open=t>.37;
    const fl=flowerFrame(f,at,.38*Math.sqrt(t),an),len=r*.065;
    fl.add('tube','discFloret',open?'#d8b452':palette.disc||'#5a3837',0,0,0,len*.22,len,len*.22);
    if(open)for(let k=0;k<5;k++)fl.add('narrow','anther','#d6b14b',0,len*.65,0,len*.28,len*.43,len,.95,k*TAU/5,0);
   }
  }return;
 }
 if(shape==='fringeFlower'||shape==='laurelFlower'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),fringe=shape==='fringeFlower';
  for(let j=0;j<4;j++){
   const an=j*TAU/4;f.add(fringe?'fringePetal':'petal','petal',color,0,0,0,r*(fringe?1:.60),r,r,fringe?1.28+rand()*.30:1.16,an,0);
   if(fringe)f.add('narrow','sepal','#8f9e72',0,0,0,r*.07,r*.10,r,.6,an,0);
  }
  const count=fringe?2:10;
  for(let j=0;j<count;j++){
   const an=j*TAU/count,tip=[Math.sin(an)*r*(fringe?.065:.26),r*(fringe?.14:.65),Math.cos(an)*r*(fringe?.065:.26)];
   f.branch([0,0,0],tip,r*(fringe?.008:.019),'#d9d4aa','filament');f.add(bud,'anther','#c8bd73',...tip,r*(fringe?.025:.085),r*(fringe?.038:.09),r*(fringe?.02:.05));
   if(!fringe&&j>5)for(const side of [-1,1])f.add(bud,'nectary','#c8c072',Math.sin(an)*r*.11+side*r*.055,r*.12,Math.cos(an)*r*.11,r*.034,r*.032,r*.030);
  }
  return;
 }
 if(shape==='rhododendronFunnel'||shape==='azaleaFunnel'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),az=shape==='azaleaFunnel';
  f.add(shape,kind,color,0,0,0,r,r,r);
  for(let k=0;k<5;k++)f.add('narrow','sepal','#81945d',0,0,0,r*.22,r*.25,r,.70,k*TAU/5,0);
  for(let k=0;k<stamenCount;k++){
   const an=k*TAU/stamenCount,at=[Math.sin(an)*r*.17,r*.72,Math.cos(an)*r*.17],tip=[Math.sin(an)*r*.31,r*(1.48+.14*Math.cos(an)),Math.cos(an)*r*.31+r*.13];
   f.branch([0,r*.08,0],at,r*.010,'#e5d6bd','filament');f.branch(at,tip,r*.010,'#e5d6bd','filament');f.add(bud,'anther','#ad8766',...tip,r*.035,r*.050,r*.027);
  }
  f.branch([0,0,0],[r*.1,r*1.7,r*.34],r*.013,'#d6c2ac','style');f.add(bud,'stigma','#b2a477',r*.1,r*1.7,r*.34,r*.035,r*.025,r*.035);
  if(palette.spots!==false)for(let k=0;k<(az?9:18);k++){
   const t=.62+.25*rand(),an=(rand()-.5)*.62,rad=(az?.06+.94*Math.pow(t,2.4):.09+.93*Math.pow(t,1.7))*.97,yy=(az?1.35:1.25)*t;
   f.add(bud,'petalSpot',palette.spots||'#997956',Math.sin(an)*rad*r,yy*r,Math.cos(an)*rad*r,r*.026,r*.013,r*.022,.8,an,0);
  }return;
 }
 if(shape==='kalmiaCup'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),outside=palette.outside||color;
  f.add('kalmiaCup',kind+'-outside-'+outside.replace('#',''),color,0,0,0,r,r,r);
  for(let k=0;k<10;k++){
   const an=k*TAU/10,tip=[Math.sin(an)*r*.73,r*.30,Math.cos(an)*r*.73],elbow=[Math.sin(an)*r*.35,r*.42,Math.cos(an)*r*.35];
   f.branch([0,r*.025,0],elbow,r*.010,'#e5d5d8','filament');f.branch(elbow,tip,r*.010,'#e5d5d8','filament');f.add(bud,'anther','#9a556c',...tip,r*.03,r*.03,r*.04);
  }
  f.branch([0,0,0],[r*.05,r*.50,r*.1],r*.016,'#b6bc86','style');return;
 }
 if(shape==='pierisUrn'||shape==='blueberryUrn'||shape==='enkianthusBell'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),bell=shape==='enkianthusBell',willow=palette.willow;
  f.add(willow?'enkianthusRound':shape,bell&&!willow?'petal-enkianthus-veins':'petal',color,0,0,0,r,r,r);
  for(let k=0;k<5;k++)f.add('narrow','sepal','#94a073',0,0,0,r*.25,r*.48,r,.40,k*TAU/5,0);
  // The stamens are enclosed, as in the narrow-mouthed ericaceous corolla.
  for(let k=0;k<10;k++){const an=k*TAU/10,tip=[Math.sin(an)*r*.20,r*.65,Math.cos(an)*r*.20];f.branch([0,0,0],tip,r*.018,'#c5b788','filament');f.add(bud,'anther','#927356',...tip,r*.040,r*.06,r*.035);}
  return;
 }
 if(shape==='gaillardiaHead'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),pin=palette.pin,dry=palette.dry,core=r*(pin?.52:.40),disc=dry?'#87745f':palette.disc||'#723944';
  for(let j=0;j<22;j++)f.add('narrow','bract',dry?'#8d8767':'#7d9166',0,-r*.12,0,r*.25,r*.40,r,.95,j*TAU/22,0);
  f.add(bud,dry?'seed':'receptacle',disc,0,0,0,core,core*.75,core);
  if(!dry)for(let j=0;j<petals;j++){
   const an=j*TAU/petals+.04*rand(),rr=core*.80,len=r-rr;
   f.add(pin?'gaillardiaSplitRay':'gaillardiaRay',kind,color,Math.sin(an)*rr,0,Math.cos(an)*rr,len*(pin?.90:1.4),len,len,1.40+rand()*.30,an,0);
  }
  for(let j=0;j<120;j++){
   const t=(j+.5)/120,an=j*2.399,rr=core*Math.sqrt(t),yy=core*.66*Math.sqrt(1-t),at=[Math.sin(an)*rr,yy,Math.cos(an)*rr],fl=flowerFrame(f,at,.40*Math.sqrt(t),an),len=r*.13;
   if(dry){fl.add('narrow','seed',j%3?'#9a8c72':'#796553',0,0,0,len*.32,len,len,.2,an,0);continue;}
   fl.add('tube','petal',t<.20?'#a89b50':disc,0,0,0,len*.18,len*.65,len*.18);
   for(let k=0;k<5;k++)fl.add('narrow','petal',t<.20?'#aba357':disc,0,len*.45,0,len*.3,len*.42,len,.9,k*TAU/5,0);
   if(t>.30&&t<.83){const tip=[0,len*1.0,0];fl.branch([0,0,0],tip,len*.026,'#dabd71','style');for(const side of [-1,1])fl.branch(tip,[side*len*.15,len*1.13,0],len*.025,'#d4b46b','stigma');}
  }return;
 }
 if(shape==='monardaHead'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),dry=palette.dry,tiered=palette.tiered,rad=r*.40;
  for(let j=0;j<10;j++)f.add('leaf','bract',dry?'#8c7867':palette.bract||'#7f6a75',0,-r*.10,0,r*.45,r*.8,r,1.45,j*TAU/10,0);
  f.add(bud,dry?'seed':'receptacle',dry?'#776656':'#716378',0,0,0,rad,rad*.72,rad);
  for(let j=0;j<64;j++){
   const t=(j+.5)/64,an=j*2.399,rr=rad*Math.sqrt(t),at=[Math.sin(an)*rr,rad*.62*Math.sqrt(1-t),Math.cos(an)*rr],fl=flowerFrame(f,at,.35+t*.65,an),len=r*(tiered?.54:.72)*(.88+rand()*.15);
   if(dry){fl.add('tube','seed','#84715d',0,0,0,len*.075,len*.25,len*.075);continue;}
   fl.add('tube','calyx','#796278',0,0,0,len*.075,len*.34,len*.075);
   fl.add('monardaTube','petal',color,0,0,0,len,len,len);
   fl.add('narrow','petal',color,0,len*.78,len*.29,len*.48,len*.36,len,.3,0,0);
   for(const side of [-1,0,1])fl.add('petal','petal',color,side*len*.048,len*.78,len*.35,len*(side===0?.25:.12),len*(side===0?.31:.16),len,1.2,side*.75,0);
   for(const side of [-1,1]){const tip=[side*len*.033,len*1.12,len*.30];fl.branch([side*len*.02,len*.68,len*.25],tip,len*.009,'#e3cfd4','filament');fl.add(bud,'anther','#ac978b',...tip,len*.035,len*.025,len*.02);}
   fl.branch([0,len*.75,len*.25],[0,len*1.16,len*.38],len*.008,'#e3cdd9','style');
  }return;
 }
 if(shape==='balloonCorolla'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),double=layers>1;
  for(let j=0;j<(double?2:1);j++){const size=r*(j?.78:1);f.add('balloonCorolla',pattern==='balloonSplash'?'petal-balloon-splash':'petal-balloon',color,0,j*r*.18,0,size,size,size,0,j*.61,0);}
  for(let j=0;j<5;j++){
   const aa=j*TAU/5;f.add('narrow','sepal','#739576',0,0,0,r*.36,r*.46,r,.9,aa,0);
   const anther=[Math.sin(aa)*r*.12,r*.29,Math.cos(aa)*r*.12];f.branch([0,r*.05,0],anther,r*.025,'#d3c7b1','filament');f.add(bud,'anther','#cfc6aa',...anther,r*.035,r*.13,r*.025);
   const lobe=[Math.sin(aa)*r*.19,r*.69,Math.cos(aa)*r*.19];f.branch([0,r*.58,0],lobe,r*.027,'#dbd4ba','stigma');
  }
  f.branch([0,0,0],[0,r*.60,0],r*.035,'#d5cfb5','style');return;
 }
 if(['soapwortFlower','soapwortTube','cowherbFlower'].includes(shape)){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),cow=shape==='cowherbFlower',tube=shape==='soapwortTube'?r*1.6:r*.95;
  if(cow)f.add('cowherbCalyx','sepal','#96b19a',0,-tube,0,r*.73,tube/1.45,r*.73);
  else f.branch([0,-tube,0],[0,0,0],r*.12,shape==='soapwortTube'?'#927c89':'#8a8579','calyx');
  for(let j=0;j<5;j++){const an=j*TAU/5;f.add('soapwortPetal',cow?'petal-soapwort-veins':'petal',color,0,0,0,r*(cow?1.05:.78),r,r,1.44,an,0);if(!cow&&shape==='soapwortTube')for(const side of [-1,1])f.add('petal','coronalScale',color,Math.sin(an)*r*.14,0,Math.cos(an)*r*.14,r*.09,r*.19,r*.19,.22,an+side*.2,0);}
  return;
 }
 if(shape==='eryngoPineapple'||shape==='eryngoProtea'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),purple=shape==='eryngoPineapple',dry=palette.dry,bract=dry?'#a09479':purple?'#9258a5':'#c0c8bb',head=dry?'#95856e':purple?'#733191':'#59617b',length=purple?.030:.035,rad=purple?.009:.012,outer=purple?9:20;
  for(let j=0;j<outer;j++){const an=j*TAU/outer,len=purple?.033:.085*(.8+.2*Math.cos(j));f.add('eryngoBract','bract',bract,0,0,0,len*.5,len,len,purple?1.25:1.1+(j%2)*.18,an,0);}
  f.add(bud,dry?'seed':'receptacle',head,0,length*.5,0,rad,length*.54,rad);
  if(purple)for(let j=0;j<7;j++){const len=.027*(.7+rand()*.3);f.add('eryngoBract','bract',bract,0,length,0,len*.47,len,len,.15+rand()*.5,j*TAU/7,0);}
  for(let j=0;j<150;j++){
   const t=(j+.5)/150,an=j*2.399,rr=rad*Math.sqrt(1-Math.pow(2*t-1,2)),fl=flowerFrame(f,[Math.sin(an)*rr,length*t,Math.cos(an)*rr],Math.PI/2,an),size=.002;
   fl.add('eryngoBract',dry?'seed':'bract',bract,0,0,0,size*.28,size*(purple?3:1.5),size,.15,0,0);
   if(dry)continue;
   for(let k=0;k<5;k++){const aa=k*TAU/5,end=[Math.sin(aa)*size*.55,size*(purple?2.0:.75),Math.cos(aa)*size*.55];fl.add('petal','petal',head,0,0,0,size*.32,size*.65,size,1.1,aa,0);fl.branch([0,0,0],end,.000045,head,'filament');fl.add(bud,'anther',head,...end,.00019,.0003,.00015);}
   for(const side of [-1,1])fl.branch([0,0,0],[side*.00035,.0025,0],.00004,head,'style');
  }return;
 }
 if(shape==='ampelopsisFlower'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);f.add(bud,'nectary','#b1b968',0,0,0,r*.40,r*.22,r*.40);
  for(let j=0;j<5;j++){const aa=j*TAU/5,end=[Math.sin(aa)*r*.58,r*.65,Math.cos(aa)*r*.58];f.add('petal','petal',color,0,0,0,r*.38,r,r,1.65,aa,0);f.branch([0,0,0],end,r*.02,'#c8d3a8','filament');f.add(bud,'anther','#d5ce86',...end,r*.10,r*.08,r*.06);}f.branch([0,0,0],[0,r*.6,0],r*.03,'#b0bd87','style');return;
 }
 if(shape==='singleSepalCorymb'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),n=120;
  for(let j=0;j<12;j++){const an=j*TAU/12,at=[Math.sin(an)*r*.8,.013,Math.cos(an)*r*.8],out=[Math.sin(an)*r,.023,Math.cos(an)*r];f.branch([0,-.015,0],at,.0008,'#a6b47c','peduncle');f.branch(at,out,.0004,'#acb885','pedicel');f.add('heart','sepal',color,...out,.026,.034,.034,.85+rand()*.4,an,0);}
  for(let j=0;j<n;j++){const t=(j+.5)/n,an=j*2.399,rr=r*.75*Math.sqrt(t),at=[Math.sin(an)*rr,.017*Math.sqrt(1-t),Math.cos(an)*rr];f.branch([0,-.012,0],at,.00020,'#a9b785','pedicel');f.add(bud,'ovary','#c7cc93',...at,.0013,.0014,.0013);for(let k=0;k<10;k++){const aa=k*TAU/10,tip=[at[0]+Math.sin(aa)*.0027,at[1]+.0032+(k%2)*.001,at[2]+Math.cos(aa)*.0027];f.branch(at,tip,.000045,color,'filament');f.add(bud,'anther','#e4dfb7',...tip,.00038,.00035,.00025);}}
  return;
 }
 if(shape==='bindweedFunnel'){
  const f=flowerFrame(b,[x,y-r*.65,z],tilt,yaw);
  f.add('bindweedFunnel',patternKind('petal','base',palette.eye),color,0,0,0,r,r,r);
  for(let j=0;j<5;j++){
   const an=j*TAU/5,tip=[Math.sin(an)*r*.10,r*.35,Math.cos(an)*r*.10];
   f.add('narrow','sepal','#82905c',0,0,0,r*.44,r*.30,r,.15,an,0);
   f.branch([0,r*.06,0],tip,r*.012,'#ded8ac','filament');f.add(bud,'anther','#d8cd9a',...tip,r*.035,r*.06,r*.025);
  }
  f.branch([0,r*.06,0],[0,r*.43,0],r*.015,'#e8debd','style');return;
 }
 if(shape==='asteliaSmall'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  for(let j=0;j<6;j++)f.add('petal','petal',color,0,0,0,r*.35,r,r,1.10,j*TAU/6,0);
  f.add(bud,'nectary','#948466',0,r*.10,0,r*.18,r*.12,r*.18);return;
 }
 if(shape==='berzeliaHead'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),n=palette.small?65:90,dry=palette.dry,closed=palette.closed;
  f.add(bud,closed?'bud':dry?'seed':'receptacle',closed?'#a3b478':dry?'#8f7b5d':'#c5c795',0,0,0,r*.86,r*.86,r*.86);
  for(let j=0;j<n;j++){
   const t=(j+.5)/n,an=j*2.399,yy=1-2*t,rr=Math.sqrt(1-yy*yy),fl=flowerFrame(f,[Math.sin(an)*rr*r*.86,yy*r*.86,Math.cos(an)*rr*r*.86],Math.acos(yy),an),size=r*.21;
   if(closed||dry){fl.add(bud,closed?'bud':'seed',closed?'#b1be83':'#9d8767',0,0,0,size*.40,size*.45,size*.40);continue;}
   for(let k=0;k<5;k++){
    const a=k*TAU/5,end=[Math.sin(a)*size*.32,size*.9,Math.cos(a)*size*.32];
    fl.add('petal','petal',color,0,0,0,size*.45,size*.63,size,.6,a,0);fl.branch([0,0,0],end,size*.035,color,'filament');fl.add(bud,'anther',color,...end,size*.07,size*.08,size*.06);
   }fl.branch([0,0,0],[0,size,0],size*.028,color,'style');
  }return;
 }
 if(shape==='chloranthusSpike'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);f.branch([0,0,0],[0,r,0],r*.035,'#aab77a','rachis');
  for(let j=0;j<21;j++){
   const t=j/21,an=j*2.399,root=[Math.sin(an)*r*.035,r*t,Math.cos(an)*r*.035],unit=flowerFrame(f,root,.75,an),length=r*(.25+.07*Math.sin(t*Math.PI));
   unit.add(bud,'ovary','#b4bd83',0,0,0,r*.045,r*.065,r*.045);
   for(const side of [-1,0,1]){const tip=[side*length*.24,length,length*.14];unit.branch([0,0,0],tip,r*.013,color,'filament');unit.add(bud,'filament',color,...tip,r*.018,r*.027,r*.018);}
  }return;
 }
 if(shape==='acaenaHead'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),n=palette.blue?80:20;
  f.add(bud,'receptacle','#8c7965',0,0,0,r*.8,r*.8,r*.8);
  for(let j=0;j<n;j++){
   const t=(j+.5)/n,an=j*2.399,yy=1-2*t,rr=Math.sqrt(1-yy*yy),fl=flowerFrame(f,[Math.sin(an)*rr*r*.85,yy*r*.85,Math.cos(an)*rr*r*.85],Math.acos(yy),an),size=r*(palette.blue?.22:.32);
   for(let k=0;k<4;k++)fl.add('narrow','sepal','#9b9682',0,0,0,size,size,size,1.2,k*TAU/4,0);
   for(const side of [-1,1]){const at=[side*size*.25,size*.75,0];fl.branch([side*size*.08,0,0],at,size*.025,'#dfd7c7','filament');fl.add(bud,'anther',palette.anther,...at,size*.20,size*.15,size*.11);}
  }return;
 }
 if(shape==='resedaFlower'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),white=palette.white;
  for(let j=0;j<petals;j++){
   const angle=j*TAU/petals,length=r*(white?1:j<2?1:.68),lobes=white||j<2?3:j<4?2:1,base=flowerFrame(f,[0,0,0],1.15,angle);
   base.add('narrow','petal',color,0,0,0,length*.32,length*.42,length,.05,0,0);
   for(let k=0;k<lobes;k++)base.add('narrow','petal',color,0,length*.27,0,length*.42,length*.72,length,0,0,(k-(lobes-1)/2)*.42);
   f.add('narrow','sepal','#8ca46b',0,-r*.08,0,r*.55,r*.6,r,1.4,angle,0);
  }
  f.add(bud,'ovary','#99aa74',0,0,0,r*.23,r*.27,r*.23);
  for(let j=0;j<stamenCount;j++){const an=j*2.399,tip=[Math.sin(an)*r*.39,r*.5,Math.cos(an)*r*.39];f.branch([Math.sin(an)*r*.12,0,Math.cos(an)*r*.12],tip,r*.016,color,'filament');f.add(bud,'anther','#c7c289',...tip,r*.09,r*.055,r*.06);}return;
 }
 if(shape==='smallMallow'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),eye=palette.eye||'#c6ab55';
  for(let j=0;j<5;j++){
   f.add('petal',kind,color,0,0,0,r*1.3,r*1.08,r,.92,j*TAU/5,0);
   f.add('narrow','sepal','#7c9562',0,-r*.12,0,r*.75,r*.45,r,.7,j*TAU/5,0);
  }
  f.add('tube','filament',eye,0,0,0,r*.13,r*.45,r*.13);
  for(let j=0;j<36;j++){
   const an=j*2.399,yy=r*(.14+.30*j/36),rr=r*.21;f.add(bud,'anther','#d5b044',Math.sin(an)*rr,yy,Math.cos(an)*rr,r*.05,r*.055,r*.045);
  }return;
 }
 if(shape==='parahebeFlower'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),white=palette.white,petalKind=white?'petal-base-a778a7-guide':'petal';
  for(let j=0;j<4;j++)f.add('petal',petalKind,color,0,0,0,r*(j===2?.63:1.04),r,r,1.4,j*TAU/4,0);
  f.add(bud,'nectary',white?'#acba65':'#b2badd',0,0,0,r*.15,r*.05,r*.15);
  for(const side of [-1,1]){
   const at=[side*r*.38,r*.50,-r*.16];f.branch([side*r*.12,0,0],at,r*.018,'#e0dce7','filament');f.add(bud,'anther','#99658b',...at,r*.09,r*.045,r*.045);
  }f.branch([0,0,0],[0,r*.58,r*.18],r*.017,'#cdc7d7','style');return;
 }
 if(shape==='valerianSpur'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  f.add('tube','petal',color,0,-r*2.4,0,r*.10,r*2.4,r*.10);
  for(let j=0;j<5;j++)f.add('petal','petal',color,0,0,0,r*.62,r*(j===0?1.12:1),r,1.34,j*TAU/5,0);
  f.branch([0,-r*1.8,r*.05],[0,-r*3.25,r*.40],r*.07,color,'spur');
  f.branch([r*.10,0,0],[r*.18,r*.58,0],r*.013,color,'filament');f.add(bud,'anther','#cba6b1',r*.18,r*.58,0,r*.055,r*.08,r*.045);
  f.branch([-r*.04,0,0],[-r*.11,r*.67,r*.10],r*.012,color,'style');return;
 }
 if(shape==='globulariaHead'||shape==='globulariaEye'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),eye=shape==='globulariaEye',n=96;
  for(let j=0;j<14;j++)f.add('narrow','bract','#62744f',0,-r*.23,0,r*.55,r*.68,r,1.8,j*TAU/14,0);
  for(let j=0;j<n;j++){
   const t=(j+.5)/n,an=j*2.399,rr=r*.90*Math.sqrt(t),at=[Math.sin(an)*rr,r*.45*Math.sqrt(1-t),Math.cos(an)*rr],blue=eye&&t<.18,c=blue?'#566fba':color;
   if(blue){f.add(bud,'bud',c,...at,r*.11,r*.13,r*.11);continue;}
   const fl=flowerFrame(f,at,Math.sqrt(t)*.75,an),length=r*(eye?.36:.57);
   fl.add('tube','petal',c,0,0,0,r*.035,length,r*.035);
   for(let k=0;k<(eye?3:5);k++)fl.add('narrow','petal',c,0,length,0,r*.32,length*.76,r,.65,k*(eye?.35:TAU/5)-(eye?.35:0),0);
   if(!eye)for(let k=0;k<4;k++)fl.add(bud,'anther','#54618a',Math.sin(k*TAU/4)*r*.07,length*1.1,Math.cos(k*TAU/4)*r*.07,r*.019,r*.026,r*.019);
  }return;
 }
 if(shape==='canarySpike'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),dry=palette.dry,green=dry?'#a99972':'#527948';
  f.branch([0,0,0],[0,r*2,0],r*.08,green,'rachis');
  for(let j=0;j<90;j++){
   const t=(j+.5)/90,an=j*2.399,rr=r*.44*Math.pow(Math.sin(Math.PI*t),.58),at=[Math.sin(an)*rr,t*r*1.65,Math.cos(an)*rr];
   for(const side of [-1,1])f.add('canaryGlume',patternKind('sepal','canaryVeins',green),dry?'#c7bd9a':'#e4e8d8',...at,r*.46,r*.54,r*.54,.18,an+side*.30,side*.08);
  }return;
 }
 if(shape==='crambeFlower'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  for(let j=0;j<4;j++){f.add('petal','petal',color,0,0,0,r*.92,r,r,1.25,j*TAU/4,0);f.add('narrow','sepal','#81915b',0,-r*.13,0,r*.65,r*.47,r,1.15,j*TAU/4+.3,0);}
  for(let j=0;j<6;j++){
   const an=j*TAU/6,length=j<4?.42:.28,at=[Math.sin(an)*r*.19,r*length,Math.cos(an)*r*.19];
   f.branch([0,0,0],at,r*.02,'#d7d7ab','filament');f.add(bud,'anther','#d2bb58',...at,r*.038,r*.048,r*.025);
   if(j<4)f.branch([at[0]*.7,at[1]*.55,at[2]*.7],[at[0]*1.3,at[1]*.68,at[2]*1.3],r*.018,'#bb96a7','filament');
  }f.add(bud,'carpel','#9caa7a',0,r*.16,0,r*.085,r*.19,r*.085);return;
 }
 if(shape==='nigella'||shape==='yellowNigella'){
  const yellow=shape==='yellowNigella',dry=palette.dry,f=flowerFrame(b,[x,y,z],tilt,yaw),seed=palette.seed||dry,core=seed?(dry?'#baae82':'#879967'):yellow?'#7c925b':'#4c354b';
  if(!seed){
   for(let j=0;j<5;j++)f.add('petal','sepal',color,0,0,0,r*(yellow?.73:1.17),r*(yellow?.70:1.08),r,yellow?2.0:1.26,j*TAU/5,0);
   for(let j=0;j<8;j++)for(const side of [-1,1])f.add('petal','petal',yellow?'#ad9a43':'#675067',Math.sin(j*TAU/8)*r*.27,0,Math.cos(j*TAU/8)*r*.27,r*.095,r*.21,r,.8,j*TAU/8+side*.20,0);
   for(let j=0;j<40;j++){
    const an=j*2.399,rr=r*(.30+(j%4)*.04),at=[Math.sin(an)*rr,r*(.20+(j%3)*.06),Math.cos(an)*rr];
    f.branch([0,0,0],at,r*.012,yellow?'#cdb754':'#6d4b63','filament');f.add(bud,'anther',yellow?'#c3ae59':'#403348',...at,r*.028,r*.055,r*.025);
   }
  }
  const carpels=yellow?7:5;
  for(let j=0;j<carpels;j++){
   const an=j*TAU/carpels,rr=r*(yellow?.19:seed?.34:.16),length=r*(yellow?1.12:seed?.82:.34),at=[Math.sin(an)*rr,0,Math.cos(an)*rr];
   f.add(bud,seed?'seed':'carpel',core,at[0],length*.5,at[2],r*(yellow?.08:seed?.23:.09),length*.5,r*(yellow?.08:seed?.23:.09),0,an,0);
   const curl=yellow?.58:.70,curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(at[0],length,at[2]),new THREE.Vector3(Math.sin(an)*r*curl,length+r*.48,Math.cos(an)*r*curl),new THREE.Vector3(Math.sin(an)*r*(curl+.12),length-r*.06,Math.cos(an)*r*(curl+.12)));let prev=curve.getPoint(0).toArray();
   for(let k=1;k<=7;k++){const to=curve.getPoint(k/7).toArray();f.branch(prev,to,r*.018,core,seed?'seed':'style');prev=to;}
  }return;
 }
 if(shape==='larkspur'){
  const f=flowerFrame(b,[x,y,z],Math.PI/2+tilt,yaw);
  for(let layer=0;layer<layers;layer++)for(let j=0;j<5;j++){
   const size=1-layer*.17;f.add('petal',layer===0?patternKind('sepal',pattern,patternColor):kind,color,0,layer*r*.09,0,r*1.03*size,r*size,r,.96-layer*.18,j*TAU/5+layer*.44,0);
  }
  const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,0,r*.15),new THREE.Vector3(0,-r*.9,r*.35),new THREE.Vector3(0,-r*1.35,r*.62));let prev=curve.getPoint(0).toArray();
  for(let j=1;j<=8;j++){const at=curve.getPoint(j/8).toArray();f.branch(prev,at,r*.11*(1-j/10),color,'spur');prev=at;}
  for(let j=0;j<3;j++)f.add('petal','petal',color,0,r*.10,0,r*.36,r*.40,r,.55,j*TAU/3,0);
  for(let j=0;j<12;j++){const an=j*2.399;f.add(bud,'anther','#bea88d',Math.sin(an)*r*.12,r*.19,Math.cos(an)*r*.12,r*.021,r*.035,r*.021);}
  return;
 }
 if(['blueButterfly','bridalVeil','roseGlory'].includes(shape)){
  const blue=shape==='blueButterfly',rose=shape==='roseGlory',f=flowerFrame(b,[x,y,z],tilt,yaw),tube=blue?.42:rose?1.9:.9;
  f.add('tube','petal',color,0,-tube*r,0,r*.12,tube*r,r*.12);
  for(let j=0;j<5;j++){
   const an=blue?[-1.15,-.50,.50,1.15,Math.PI][j]:j*TAU/5,lower=blue&&j===4;
   f.add('petal','petal',lower?'#554dae':color,0,0,0,r*(rose?.43:lower?.90:.78),r*(lower?1.18:1),r,1.45,an,0);
   f.add('narrow','sepal',blue?'#92a075':rose?'#934866':'#8e5a66',0,-tube*r,0,r*.55,r*(rose?.45:.70),r,.38,j*TAU/5,0);
  }
  // Four curved filaments and a separate style emerge from the corolla throat.
  for(let j=0;j<5;j++){
   const style=j===4,side=j%2?1:-1,reach=style?1.3:1.1+(j>>1)*.30;
   const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,-r*.14,0),new THREE.Vector3(side*r*.2,r*2.0,-r*.30),new THREE.Vector3(style?0:side*r*reach,r*(rose?1.45:1.65),-r*(blue?.9:1.25)));
   let prev=curve.getPoint(0).toArray();
   for(let k=1;k<=7;k++){const next=curve.getPoint(k/7).toArray();f.branch(prev,next,r*.013,blue?'#a596c6':rose?'#edd9e4':'#efeee5','filament');prev=next;}
   if(!style)f.add(bud,'anther',blue?'#6e5696':rose?'#b39aaf':'#bca7ac',...prev,r*.035,r*.065,r*.025);
   else for(const sign of [-1,1])f.branch(prev,[prev[0]+sign*r*.045,prev[1]+r*.07,prev[2]],r*.012,blue?'#8974b8':'#ddd4d1','stigma');
  }return;
 }
 if(['eremophila','mintBush','pityrodiaFlower','groundIvyFlower'].includes(shape)){
  const wool=shape==='eremophila',pity=shape==='pityrodiaFlower',ivy=shape==='groundIvyFlower',f=flowerFrame(b,[x,y,z],Math.PI/2+tilt,yaw),length=wool||pity?2.2:ivy?1.5:1.0;
  f.add('trumpet','petal',color,0,0,0,r*.74,r*length,r*.74);
  // The two lips have unequal lobes; the lower centre lobe is enlarged.
  for(const side of [-1,1])f.add('petal','petal',color,side*r*.14,r*length,r*.08,r*.72,r*.62,r,.55,side*.34,side*-.2);
  for(let j=-1;j<=1;j++)f.add('petal',wool?patternKind('petal','spots',patternColor):'petal',wool?'#e9e8dc':color,j*r*.20,r*length,-r*.15,r*(j===0?1.15:.70),r*(j===0?.82:.61),r,1.7,Math.PI+j*.55,0);
  for(let j=0;j<(wool||pity||ivy?5:2);j++)f.add(wool||pity||ivy?'narrow':'petal',wool||pity?'leaf-woolly':'leaf',ivy?'#8b9b69':'#b9bfae',0,-r*.10,0,r*(wool||pity?1.1:.55),r*(wool||pity?1.20:.45),r,.2,j*TAU/(wool||pity||ivy?5:2),0);
  for(let j=0;j<4;j++){const an=j*TAU/4;f.add(bud,'anther','#d6c3aa',Math.sin(an)*r*.10,r*length*.82,Math.cos(an)*r*.10,r*.032,r*.045,r*.032);}
  return;
 }
 if(shape==='gardeniaFlower'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  f.add('tube','petal',color,0,-r*.44,0,r*.17,r*.48,r*.17);
  for(let j=0;j<6;j++){
   f.add('petal','petal',color,0,0,0,r*1.15,r*1.05,r,1.17,j*TAU/6,.14);
   f.add('narrow','sepal','#72935b',0,-r*.33,0,r*.65,r*.46,r,.8,j*TAU/6,0);
  }
  f.add(bud,'stigma','#d4c88c',0,r*.16,0,r*.09,r*.12,r*.09);return;
 }
 if(shape==='woodPoppy'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  // These four showy organs are sepals; Glaucidium has no petals.
  for(let j=0;j<4;j++)f.add('petal','sepal',color,0,0,0,r*1.55,r*1.06,r,.96,j*TAU/4,0);
  for(let j=0;j<70;j++){
   const an=j*2.399,rr=r*.30*Math.sqrt((j+.5)/70),at=[Math.sin(an)*rr,r*(.17+.06*(1-rr/r)),Math.cos(an)*rr];
   f.branch([at[0]*.35,0,at[2]*.35],at,r*.010,'#e5d7aa','peduncle');f.add(bud,'anther','#d8be63',...at,r*.024,r*.036,r*.024);
  }
  for(const side of [-1,1])f.add(bud,'carpel','#a4b374',side*r*.035,r*.10,0,r*.040,r*.15,r*.040,0,0,side*-.20);return;
 }
 if(shape==='anemonopsis'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),double=layers>1;
  for(let layer=0;layer<(double?3:1);layer++)for(let j=0;j<8;j++){
   const rr=r*(1-layer*.14);f.add('petal','sepal',color,0,-layer*r*.055,0,rr*.70,rr,rr,1.95+layer*.16,j*TAU/8+layer*.21,0);
  }
  for(let j=0;j<10;j++)f.add('petal',kind,'#e4d1e1',Math.sin(j*TAU/10)*r*.13,0,Math.cos(j*TAU/10)*r*.13,r*.42,r*.68,r,Math.PI-.15,j*TAU/10,0);
  for(let j=0;j<20;j++){
   const an=j*2.399,rr=r*.13*Math.sqrt(j/20);f.branch([0,0,0],[Math.sin(an)*rr,-r*.44,Math.cos(an)*rr],r*.008,'#eee2c8','peduncle');f.add(bud,'anther','#d6c59a',Math.sin(an)*rr,-r*.44,Math.cos(an)*rr,r*.02,r*.025,r*.02);
  }return;
 }
 if(shape==='myrtleFour'||shape==='corokiaStar'||shape==='coprosmaFemale'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),myrtle=shape==='myrtleFour',female=shape==='coprosmaFemale',n=myrtle?4:5;
  if(female)f.add('tube','petal',color,0,-r*.50,0,r*.30,r*.50,r*.30);
  for(let j=0;j<n;j++)f.add(myrtle?'petal':'narrow','petal',color,0,0,0,r*(myrtle?1.12:1.9),r,r,myrtle?.87:1.39,j*TAU/n,0);
  if(female){
   for(const side of [-1,1])f.branch([0,0,0],[side*r*.65,r*1.7,0],r*.020,'#d6d8ac','stigma');
  }else{
   const count=myrtle?48:5;
   for(let j=0;j<count;j++){
    const an=j*2.399,reach=myrtle?r*(.32+.52*(j%5)/4):r*.20,end=[Math.sin(an)*reach,r*(myrtle?.7:.27),Math.cos(an)*reach];
    f.branch([0,0,0],end,r*.010,myrtle?'#efece3':'#dac377','peduncle');f.add(bud,'anther',myrtle?'#eee6cf':'#c5a842',...end,r*.028,r*.026,r*.028);
   }
  }return;
 }
 if(shape==='fawnLily'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  for(let j=0;j<6;j++){
   const an=j*TAU/6;
   f.add('recurvedTepal',kind,color,0,0,0,r*.90,r*1.5,r*1.5,Math.PI,an,0);
   const end=[Math.sin(an)*r*.12,-r*.64,Math.cos(an)*r*.12];
   f.branch([0,0,0],end,r*.016,color,'peduncle');f.add(bud,'anther',palette.anther||'#d4bd6a',...end,r*.036,r*.14,r*.033);
  }
  f.branch([0,0,0],[0,-r*.84,0],r*.018,color,'peduncle');return;
 }
 if(shape==='autumnSnowflake'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  f.add(bud,'ovary','#aa8587',0,r*.10,0,r*.24,r*.25,r*.24);
  for(let j=0;j<6;j++)f.add('petal',kind,color,0,0,0,r*.86,r*1.70,r,Math.PI-.22,j*TAU/6,0);
  for(let j=0;j<6;j++){const an=j*TAU/6;f.add(bud,'anther','#dac786',Math.sin(an)*r*.15,-r*.95,Math.cos(an)*r*.15,r*.040,r*.16,r*.040);}
  return;
 }
 if(shape==='azureBell'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);f.add('bell6','petal',color,0,0,0,r*2,r*1.6,r*2,Math.PI,0,0);return;
 }
 if(shape==='glorySnow'||shape==='openSquill'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  if(shape==='glorySnow')f.add('tube','petal','#e9e8da',0,-r*.10,0,r*.4,r*.30,r*.4);
  for(let j=0;j<6;j++){
   const an=j*TAU/6;f.add('petal',kind,color,0,0,0,r*.60,r,r,1.03,an,0);
   const end=[Math.sin(an)*r*.10,r*.27,Math.cos(an)*r*.10];f.branch([0,0,0],end,r*.022,'#eee9d7','peduncle');f.add(bud,'anther','#d7c99a',...end,r*.04,r*.08,r*.04);
  }return;
 }
 if(shape==='pinwheel'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  f.add('tube','petal',color,0,-r*.85,0,r*.16,r*.61,r*.16);
  f.add('trumpet','petal',color,0,-r*.25,0,r*.28,r*.29,r*.28);
  for(let j=0;j<5;j++){
   const an=j*TAU/5;
   f.add('narrow','leaf','#768660',Math.sin(an)*r*.07,-r*.83,Math.cos(an)*r*.07,r*.12,r*.31,r,.13,an,0);
   // Off-centre, identically handed lobes create the overlapping pinwheel corolla.
   const lobe=flowerFrame(f,[Math.sin(an)*r*.06,0,Math.cos(an)*r*.06],0,an);
   lobe.add('petal','petal',color,r*.13,0,0,r*.65,r*.91,r,1.52,-.35,-.08);
   f.add(bud,'anther','#c6aa65',Math.sin(an)*r*.06,r*.04,Math.cos(an)*r*.06,r*.024,r*.035,r*.024);
  }return;
 }
 if(shape==='amaranthHead'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw),dry=palette.dry;
  for(let j=0;j<76;j++){
   const t=(j+.5)/76,an=j*2.399,pitch=Math.acos(2*t-1),rr=r*.71*Math.sin(pitch),at=[Math.sin(an)*rr,(2*t-1)*r*.78,Math.cos(an)*rr];
   f.add('petal',dry?'seed':'bract',shade(rand,color,.045),...at,r*.28,r*.41,r*.25,pitch,an,0);
   if(!dry&&j%3===0&&t>.23){const ray=flowerFrame(f,at,pitch,an);ray.add('tube','petal',palette.tip||'#e7d29a',0,r*.15,0,r*.060,r*.40,r*.060);ray.add(bud,'anther',palette.tip||'#e7d29a',0,r*.53,0,r*.055,r*.035,r*.055);}
  }return;
 }
 if(shape==='ruelliaFlower'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);f.add('trumpet','petal',color,0,-r*.6,0,r*.85,r*.9,r*.85);
  for(let j=0;j<5;j++){const an=j*TAU/5;f.add('petal','petal',color,Math.sin(an)*r*.13,r*.20,Math.cos(an)*r*.13,r*1.20,r*.85,r,1.22,an,0);}
  return;
 }
 if(shape==='cranesbill'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  for(let j=0;j<5;j++){
   f.add('narrow','leaf','#698158',0,-r*.05,0,r*.45,r*.58,r,1.85,j*TAU/5+.63,0);
   f.add('petal',guides?kind+'-cranesbill-veins':kind,color,0,0,0,r*1.30,r,r,1.18,j*TAU/5,0);
  }
  for(let j=0;j<10;j++){
   const an=j*TAU/10,end=[Math.sin(an)*r*.16,r*.24,Math.cos(an)*r*.16];
   f.branch([0,0,0],end,r*.014,'#ded8d3','peduncle');f.add(bud,'anther','#584251',...end,r*.037,r*.025,r*.045);
  }
  f.branch([0,0,0],[0,r*.32,0],r*.021,'#d7b6ce','peduncle');return;
 }
 if(shape==='sweetshrub'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  // Numerous overlapping tepals, with a smaller, differently coloured inner whorl.
  for(let layer=0;layer<3;layer++)for(let j=0;j<8;j++){
   const small=layer===2,an=j*TAU/8+layer*.39,length=r*(small?.48:1-layer*.14);
   f.add('petal',small&&pattern?kind:'petal',small?palette.inner||color:color,0,layer*r*.07,0,length*.80,length,length,small?.50:1.08-layer*.18,an,0);
  }
  for(let j=0;j<18;j++){const an=j*2.399,rr=r*.17*Math.sqrt(j/18);f.add(bud,'anther','#cfbb83',Math.sin(an)*rr,r*.28,Math.cos(an)*rr,r*.025,r*.09,r*.025);}
  return;
 }
 if(shape==='hebeFlower'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);f.add('tube','petal',color,0,0,0,r*.35,r*.48,r*.35);
  for(let j=0;j<4;j++)f.add('petal','petal',color,0,r*.46,0,r*.66,r*(j===2?.62:.83),r,1.38,j*TAU/4,0);
  for(const side of [-1,1]){const at=[side*r*.42,r*1.4,r*.05];f.branch([0,r*.35,0],at,r*.028,color,'peduncle');f.add(bud,'anther','#8e7890',...at,r*.11,r*.14,r*.08);}
  f.branch([0,r*.2,0],[0,r*1.6,r*.2],r*.018,color,'peduncle');return;
 }
 if(shape==='flannelHead'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  // The white rays are involucral bracts; Actinotus helianthi has no petals.
  for(let j=0;j<bracts;j++)f.add('petal','petal-woolly-tip-78976a','#efeee3',0,0,0,r*.66,r,r,1.24,j*TAU/bracts,0);
  for(let j=0;j<38;j++){
   const an=j*2.399,rr=r*.28*Math.sqrt((j+.5)/38),at=[Math.sin(an)*rr,r*.12,Math.cos(an)*rr];
   f.add(bud,'seed',j%3?'#b8c5a1':'#dedec4',...at,r*.046,r*.067,r*.046);
   for(let k=0;k<3;k++){const aa=k*TAU/3,end=[at[0]+Math.sin(aa)*r*.030,at[1]+r*.05,at[2]+Math.cos(aa)*r*.030];f.branch(at,end,r*.008,'#eee7d0','peduncle');}
  }return;
 }
 if(shape==='chileanCrocus'){
  // Six tepals join a narrow throat; only three of the six stamens bear anthers.
  b.add('tube','petal','#edf0e3',x,y,z,r*.62,r*.65,r*.62);
  for(let j=0;j<6;j++){
   const an=j*TAU/6,at=[x+Math.sin(an)*r*.11,y+r*.65,z+Math.cos(an)*r*.11];
   b.add('petal',patternKind('petal','base',patternColor||'#edf0e3'),color,...at,r*.72,r*1.20,r,.87,an,0);
   const end=[x+Math.sin(an)*r*.22,y+r*.94,z+Math.cos(an)*r*.22];
   b.branch([x,y+r*.55,z],end,r*.018,'#f0ead8','peduncle');
   if(j%2===0)b.add(bud,'anther','#dbb654',...end,r*.055,r*.14,r*.055,.3,an,0);
   else b.add('narrow','staminode','#f1ebda',...end,r*.15,r*.20,r*.15,.5,an,0);
  }
  b.branch([x,y+r*.5,z],[x,y+r*1.08,z],r*.018,'#f2edda','peduncle');return;
 }
 if(shape==='redbudPea'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  // The small banner sits inside the longer wings, unlike a typical pea flower.
  f.add('petal','petal-violet-guide',color,0,0,0,r*.85,r*.82,r,.02,0,0);
  for(const side of [-1,1]){
   f.add('petal',kind,color,side*r*.04,0,r*.04,r*.75,r*1.05,r,.22,side*.25,side*.40);
   f.add('petal',kind,shade(rand,color,.025),side*r*.05,0,r*.06,r*.55,r*.80,r,1.40,side*.12,side*.10);
  }
  f.add('tube','petal',shade(rand,color,-.15),0,-r*.28,-r*.06,r*.48,r*.3,r*.48,.2,0,0);return;
 }
 if(shape==='linearPetals'){
  for(let j=0;j<petals;j++)b.add('narrow',kind,color,x,y,z,r*.60,r,r,1.15,j*TAU/petals,0);
  for(let k=0;k<stamenCount;k++){const an=k*TAU/stamenCount,end=[x+Math.sin(an)*r*.20,y+r*.40,z+Math.cos(an)*r*.20];b.branch([x,y,z],end,r*.018,color,'peduncle');b.add(bud,'seed','#d2c99d',...end,r*.045,r*.08,r*.045);}
  return;
 }
 if(shape==='brushCorolla'){
  for(let j=0;j<5;j++)b.add('petal',kind,color,x,y,z,r*.72,r,r,1.42,j*TAU/5,0);
  for(let j=0;j<24;j++){
   const an=j*2.399,t=.25+.65*(j%5)/4,end=[x+Math.sin(an)*r*t,y+r*(.45+.50*(1-t)),z+Math.cos(an)*r*t];
   b.branch([x,y,z],end,r*.012,color,'peduncle');b.add(bud,'seed','#e3dcc0',...end,r*.030,r*.030,r*.030);
  }return;
 }
 if(shape==='backToBack'){
  for(const side of [-1,1]){
   const frame=flowerFrame(b,[x,y,z],side*Math.PI/2,yaw);
   for(let j=0;j<5;j++)frame.add('narrow',kind,color,0,r*.04,0,r*.60,r,r,1.86,j*TAU/5,0);
   frame.add(bud,'seed',color,0,r*.04,0,r*.14,r*.12,r*.14);
  }return;
 }
 if(shape==='salver'){
  b.add('tube',kind,color,x,y-r*1.10,z,r*.18,r*.72,r*.18);
  for(let j=0;j<5;j++)b.add('petal',kind,color,x,y,z,r*.85,r,r,1.46,j*TAU/5,0);
  return;
 }
 if(shape==='discHead'){
  // Ironweed has only disc florets: do not add the surrounding daisy rays.
  b.add(bud,'leaf','#67724e',x,y-r*.18,z,r*.55,r*.40,r*.55);
  for(let j=0;j<23;j++){
   const an=j*2.399,rr=r*.70*Math.sqrt((j+.5)/23),xx=x+Math.sin(an)*rr,zz=z+Math.cos(an)*rr,yy=y+r*.12*(1-rr/r);
   b.add('tube',kind,color,xx,yy,zz,r*.18,r*.52,r*.18);
   for(const side of [-1,1])b.branch([xx,yy+r*.37,zz],[xx+side*r*.06,yy+r*.69,zz],r*.009,color,'peduncle');
  }return;
 }
 if(shape==='hangingStraps'){
  for(let j=0;j<petals;j++)b.add('petal',kind,color,x,y,z,r*.28,r*1.7,r*1.2,Math.PI-.12,j*TAU/petals,0);
  return;
 }
 if(shape==='violet'){
  // A bilateral corolla: two upper, two lateral and one lower petal, one nectar spur.
  for(const [angle,width,length,guide,position] of [[-.43,.70,1.23,false,'upper'],[.43,.70,1.23,false,'upper'],[-1.35,1.12,1.08,true,'lateral'],[1.35,1.12,1.08,true,'lateral'],[Math.PI,1.28,1.20,true,'lower']]){
   const surface=guide&&guides?(pattern?kind+'-guide':'petal-violet-guide'):kind;
   b.add('petal',surface,palette[position]||color,x,y,z,r*width,r*length,r,.16+tilt,yaw,angle);
  }
  b.add(bud,'seed','#e1c966',x+Math.sin(yaw)*r*.04,y,z+Math.cos(yaw)*r*.04,r*.12,r*.08,r*.07);
  b.add('tube','petal',color,x,y,z,r*.14,r*.65,r*.14,-1.3+tilt,yaw,0);
  return;
 }
 if(shape==='snowdrop'){
  b.add(bud,'leaf','#719054',x,y+r*.07,z,r*.24,r*.28,r*.24);
  for(let j=0;j<3;j++)b.add('petal',outerPattern==='greenTip'?'petal-snowdrop-outer':'petal','#f4f4e9',x,y,z,r*.78,r*1.70,r,Math.PI-.39,j*TAU/3,0);
  for(let layer=0;layer<layers;layer++)for(let j=0;j<3;j++)b.add('petal','petal-snowdrop-inner','#f0f1db',x,y-r*.05,z,r*(.52-layer*.06),r*(.94-layer*.1),r,Math.PI-.10-layer*.12,j*TAU/3+1.05+layer*.43,0);
  return;
 }
 if(shape==='squill'){
  for(let j=0;j<6;j++)b.add('petal',kind,color,x,y,z,r*.65,r,r,.95,j*TAU/6,0);
  b.add('bell6','petal','#ebeee9',x,y,z,r*.42,r*.31,r*.42);
  return;
 }
 if(shape==='lily'){
  // Six separate tepals rise from a short funnel, with six stamens and a pistil.
  const orient=(xx,yy,zz)=>[x+xx*Math.cos(yaw)+zz*Math.sin(yaw),y+yy,z-xx*Math.sin(yaw)+zz*Math.cos(yaw)];
  for(let j=0;j<6;j++){
   const an=j*TAU/6,tip=orient(Math.sin(an)*r*.14,r*.16,Math.cos(an)*r*.14);
   b.add('petal',kind,color,...tip,r*.63,r*1.35,r*1.2,.75,yaw+an,0);
   const end=orient(Math.sin(an)*r*.35,r*1.45,Math.cos(an)*r*.35);
   b.branch([x,y,z],end,r*.013,color,'peduncle');b.add(bud,'seed','#aa9253',...end,r*.085,r*.035,r*.035,0,yaw+an,0);
  }
  b.branch([x,y,z],orient(0,r*1.55,0),r*.015,color,'peduncle');
  return;
 }
 if(shape==='spikelet'){
  // Flattened, hanging, overlapping glumes. No petal or pollen-ball substitute.
  for(let j=0;j<7;j++)for(const side of [-1,1]){
   const t=j/7,width=Math.sin((t+.18)*Math.PI/1.3)*r*.72;
   b.add('petal','seed',shade(rand,color,.06),x+side*width*.17,y-t*r*1.45,z,r*.73*(1-t*.6),r*.68,r*.18,Math.PI+.04,yaw,side*.5);
  }
  return;
 }
 if(shape==='bractedHead'){
  b.add(bud,'seed',color,x,y+r*.55,z,r*.62,r*.94,r*.62);
  for(let j=0;j<44;j++){
   const t=(j+.5)/44,an=j*2.399,rr=r*.66*Math.sqrt(1-(t*2-1)**2);
   b.add('tube',kind,shade(rand,color,.10),x+Math.sin(an)*rr,y-r*.27+t*r*1.62,z+Math.cos(an)*rr,r*.09,r*.19,r*.09,1.2,an,0);
  }
  for(let j=0;j<7;j++)b.add('serrated','leaf',color,x,y-r*.19,z,r*.34,r*2.0,r*1.4,1.65,j*TAU/7,0);
  return;
 }
 if(shape==='columnHead'){
  b.add(bud,'seed','#736641',x,y+r*.65,z,r*.32,r*1.15,r*.32);
  for(let j=0;j<8;j++)b.add('petal',kind,color,x,y,z,r*.80,r*1.50,r*1.2,2.32,j*TAU/8,0);
  return;
 }
 if(shape==='pincushion'){
  for(let j=0;j<44;j++){
   const an=j*2.399,rr=r*.72*Math.sqrt((j+.5)/44),yy=y+Math.sqrt(Math.max(0,r*r-rr*rr))*.43;
   const xx=x+Math.sin(an)*rr,zz=z+Math.cos(an)*rr;
   b.add('tube',kind,color,xx,yy,zz,r*.22,r*.26,r*.22);
   b.branch([xx,yy,zz],[xx,yy+r*.32,zz],r*.012,'#dbcbbc','peduncle');b.add(bud,'seed','#dcd6c3',xx,yy+r*.33,zz,r*.038,r*.030,r*.038);
  }
  for(let j=0;j<14;j++){
   const an=j*TAU/14,xx=x+Math.sin(an)*r*.62,zz=z+Math.cos(an)*r*.62;
   for(let k=-1;k<=1;k++)b.add('petal',kind,color,xx,y,zz,r*.23,r*.55,r*.5,1.4,an+k*.3,0);
  }
  return;
 }
 if(shape==='hollyhock'){
  const whorls=layers>1?6:1;
  for(let l=0;l<whorls;l++)for(let j=0;j<5;j++)b.add('petal',kind,kit.shade(rand,color,.035),x,y+r*l*.06,z,r*(1-l*.095),r*(1-l*.10),r,.83+l*.055,j*TAU/5+l*.58,0);
  if(whorls===1){
   b.add('spadix','seed','#d9bd83',x,y,z,r*.18,r*.67,r*.18);
   for(let j=0;j<28;j++){const an=j*2.399,yy=y+r*(.20+j*.015);b.add(bud,'seed','#cfad66',x+Math.sin(an)*r*.075,yy,z+Math.cos(an)*r*.075,r*.035,r*.025,r*.035);}
  }
  return;
 }
 if(shape==='spathe'){
  b.add('spathe','petal','#d3d7a7',x,y-r*2,z,r*3.4,r*4,r*3.4,.10,yaw,0);
  b.add('spadix','seed','#b6a344',x,y-r*1.8,z+r*.14,r*.50,r*2.8,r*.50,.04,yaw,0);
  return;
 }
 if(shape==='stamens'){
  for(let j=0;j<5;j++)b.add('petal','seed','#876b50',x,y,z,r*.6,r*.5,r*.5,1.1,j*TAU/5,0);
  for(let j=0;j<12;j++){
   const an=j*2.399,rr=r*(.3+rand()*.5),end=[x+Math.sin(an)*rr,y+r*(.6+rand()*.5),z+Math.cos(an)*rr];
   b.branch([x,y,z],end,r*.025,'#a92c37','petiole');b.add(bud,'petal','#bd3341',...end,r*.16,r*.20,r*.11);
  }
  return;
 }
 if(shape==='daisy'){
  for(let layer=0;layer<layers;layer++)for(let j=0;j<petals;j++){
   const a=j*TAU/petals+layer*.3;b.add('petal',kind,shade(rand,color,.04),x,y+layer*r*.06,z,r*.32,r,r,1.75-layer*.12,a,0);
  }
  b.add(bud,'seed',center,x,y+r*.12,z,r*.27,r*.20,r*.27);return;
 }
 if(['bell','trumpet','tube','urn'].includes(shape)){
  b.add(petals===6&&['bell','trumpet'].includes(shape)?shape+'6':shape,kind,color,x,y,z,r,r*1.6,r,tilt,0,0);
  return;
 }
 if(shape==='pea'){
  const f=flowerFrame(b,[x,y,z],tilt,yaw);
  f.add('petal',kind,color,0,0,0,r*1.8,r*1.3,r,.15,0,0);
  for(const side of [-1,1]){
   f.add('petal',kind,color,0,0,0,r*.6,r,r,1.4,side*.85,0);
   f.add('petal',kind,shade(rand,color,.035),side*r*.03,0,0,r*.40,r*.85,r,1.25,side*.08,side*.08);
  }return;
 }
 if(shape==='lipped'){
  b.add('tube',kind,color,x,y,z,r*.35,r*.85,r*.35,1.15+tilt,0,0);
  b.add('petal',kind,color,x,y+r*.20,z+r*.45,r*.85,r,r,.65+tilt,0,0);
  for(let j=-1;j<=1;j++)b.add('petal',kind,color,x,y,z+r*.62,r*.55,r*.7,r,1.9+tilt,j*.6,0);return;
 }
 const n=shape==='cross'?4:petals,l=shape==='pompon'?5:layers;
 for(let layer=0;layer<l;layer++)for(let j=0;j<n;j++){
  const a=j*TAU/n+layer*.4,length=r*(1-layer*.12),pitch=shape==='cup'?.72:shape==='pompon'?.7+layer*.23:1.5-layer*.14;
  b.add(shape==='star'?'narrow':shape==='spoonRay'?'spoon':'petal',kind,shade(rand,color,.035),x,y+layer*r*.09,z,length*(shape==='star'?2.8:n>10?.38:.95),length,length,pitch+tilt,a,0);
  if(shape==='spurred')b.add('tube',kind,color,x,y,z,r*.12,r*.8,r*.12,2.8,a,0);
 }
 b.add(bud,'seed',center,x,y+r*.05,z,r*.17,r*.09,r*.17);
 // Individually visible stamens replace a single large pollen ball in open flowers.
 if(n<=6&&l===1)for(let j=0;j<9;j++){
  const a=j*TAU/9,xx=x+Math.sin(a)*r*.17,zz=z+Math.cos(a)*r*.17;
  b.branch([xx,y,zz],[xx,y+r*.22,zz],r*.012,'#dbd4b2','petiole');
  b.add(bud,'seed',center,xx,y+r*.23,zz,r*.03,r*.02,r*.03);
 }
}

function drawHelleboreProfiles(b,{info,s,detail,rand},kit){
 const a=info.appearance,palette=a.flowerPalette||{},h=s.height,w=s.spread,caulescent=palette.caulescent,fine=palette.fine,green=s.leafColor,stem=a.stemColor||'#6e8b53';
 const compound=(at,yaw,size,bract=false)=>{
  const n=bract?3:a.leaflets||7,leafKind=palette.silver?'leaf-hellebore-silver':foliageKind(info);
  for(let j=0;j<n;j++){
   // Pedate blades spread from short connected lateral axes, not a stack of discs.
   const off=(j-(n-1)/2)/Math.max(1,(n-1)/2),angle=yaw+off*(n===3?1.06:1.42),reach=size*(n===3?.16:fine?.33:.11)*Math.abs(off),root=[at[0]+Math.sin(angle)*reach,at[1]-.025*size*Math.abs(off),at[2]+Math.cos(angle)*reach];
   if(reach)b.branch(at,root,size*.008,stem,'petiole');
   const length=size*(.78+.22*Math.cos(off*1.5)),width=n===3?.78:fine?.58:.38;
   b.add(fine&&!bract?'helleboreFineLeaf':a.leafShape==='vesicariusLeaf'?'vesicariusLeaf':'helleboreLeaf',leafKind,kit.shade(rand,green,.035),...root,length*width*s.leafScale,length*s.leafScale,length*s.leafScale,1.16+Math.abs(off)*.28+(rand()-.5)*.10,angle,(rand()-.5)*.08);
  }
 };
 const curved=(points,r,kind)=>{
  const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'centripetal'),segments=12;
  let previous=points[0];
  for(let j=1;j<=segments;j++){const next=curve.getPoint(j/segments).toArray();b.branch(previous,next,r*(1-j/segments*.24),stem,kind);previous=next;}
 };
 const count=caulescent?3:5;
 for(let i=0;i<count;i++){
  const an=i*2.399,extent=w*(caulescent?.13:.12),top=[Math.sin(an)*extent,h*(.62+rand()*.20),Math.cos(an)*extent],bend=[top[0]*.38,h*.43,top[2]*.38];
  if(caulescent||s.bloom)curved([[0,0,0],bend,top],caulescent?.0035:.0028,caulescent?'stem':'scape');
  if(caulescent&&s.leafDensity>0)for(let node=0;node<Math.ceil(3*s.leafDensity);node++){
   const t=.20+node*.25,attach=[top[0]*t,h*t*.84,top[2]*t],yaw=an+node*2.3,rr=Math.min(w*.19,h*.25),end=[attach[0]+Math.sin(yaw)*rr,attach[1]+h*.07,attach[2]+Math.cos(yaw)*rr];
   curved([attach,[(attach[0]+end[0])*.5,attach[1]+h*.06,(attach[2]+end[2])*.5],end],.0017,'petiole');compound(end,yaw,Math.min(a.leafLength||.10,w*.28,h*.42));
  }
  if(!s.bloom)continue;
  for(let j=0;j<(palette.fewFlowers?2:caulescent?5:3);j++){
   const yaw=an+j*2.18,rr=Math.min(w*.18,.060)*(.65+rand()*.4),tip=[top[0]+Math.sin(yaw)*rr,top[1]+h*(.04+rand()*.10),top[2]+Math.cos(yaw)*rr],neck=[tip[0]-Math.sin(yaw)*.009,tip[1]+.018,tip[2]-Math.cos(yaw)*.009];
   curved([top,[(top[0]+neck[0])*.5,neck[1]-.003,(top[2]+neck[2])*.5],neck,tip],.0017,'pedicel');
   if(j===0&&s.leafDensity>0)compound(top,yaw,Math.min(.060,h*.17),true);
   detailedFlower(b,{x:tip[0],y:tip[1],z:tip[2],r:Math.min(a.flowerRadius,h*.19),color:s.flowerColor,shape:a.flowerShape,layers:a.flowerLayers||1,pattern:a.flowerPattern,patternColor:a.flowerPatternColor,palette,tilt:(palette.tilt||2.25)+(rand()-.5)*.24,yaw},{...kit,rand});
  }
 }
 if(!caulescent&&s.leafDensity>0)for(let i=0;i<Math.ceil(7*s.leafDensity);i++){
  const an=i*2.399,rr=w*(.13+rand()*.12),end=[Math.sin(an)*rr,h*(.24+rand()*.14),Math.cos(an)*rr];
  curved([[0,0,0],[end[0]*.52,end[1]*.72,end[2]*.52],end],.002,'petiole');compound(end,an,Math.min(a.leafLength||.10,w*.33,h*.50));
 }
}

function drawTessen(b,{info,s,detail,rand},kit){
 const h=s.height,w=s.spread,a=info.appearance,green=s.leafColor;
 for(const x of [-w*.35,w*.35])b.branch([x,0,0],[x,h,0],.006,'#aeaa8d','support');
 for(let j=1;j<6;j++)b.branch([-w*.35,h*j/6,0],[w*.35,h*j/6,0],.0028,'#aeaa8d','support');
 for(let i=0;i<5;i++){
  let prev=[(i-2)*w*.055,0,.02];
  for(let j=1;j<=16;j++){
   const t=j/16,an=i*1.51+t*7.7,at=[Math.sin(an)*w*.31,h*t*(.87+i*.025),Math.cos(an)*.035];b.branch(prev,at,.0016,'#847764','vine');prev=at;
   if(s.leafDensity>0)for(const side of [-1,1]){
    const yaw=an+side*1.4,end=[at[0]+Math.sin(yaw)*.046,at[1]+.008,at[2]+Math.cos(yaw)*.046];b.branch(at,end,.00065,green,'petiole');
    for(let k=-1;k<=1;k++){const leafYaw=yaw+k*.65; b.add('leaf','leaf',kit.shade(rand,green,.04),...end,.039,k===0?.075:.058,.065,1.05,leafYaw,0);}
   }
   if(s.bloom&&j>4&&j%3===0){const yaw=an*.3,tip=[at[0]+Math.sin(yaw)*.05,at[1]+.075,at[2]+.12];b.branch(at,tip,.0011,green,'peduncle');detailedFlower(b,{x:tip[0],y:tip[1],z:tip[2],r:a.flowerRadius,color:s.flowerColor,shape:'tessenFlower',tilt:1.15,yaw},{...kit,rand});}
  }
 }
}

function drawSmallSpringBulbs(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,palette=a.flowerPalette||{},crocus=a.architecture==='earlyCrocus',sara=palette.pattern==='sara',n=crocus?8:palette.variants?6:3;
 for(let i=0;i<n;i++){
  const yaw=i*2.399,rr=Math.sqrt(i/n)*Math.min(w*.25,crocus?.055:.09),x=Math.sin(yaw)*rr,z=Math.cos(yaw)*rr,r=Math.min(a.flowerRadius,h*(crocus?.28:.24)),flowerHeight=r*(crocus?1.22:sara?1.4:1.72),top=h*(.89+rand()*.11),head=[x+Math.sin(yaw)*h*.035,top-flowerHeight,z+Math.cos(yaw)*h*.035];
  const leafCount=crocus?6:3;
  for(let j=0;j<leafCount;j++){
   const t=crocus?0:j*.12,at=[x,t*h,z],angle=yaw+j*(crocus?2.399:Math.PI),len=Math.min(a.leafLength,h*(crocus?1.05:sara?.90:.77))*(.86+rand()*.14),width=palette.leafWidth*(j===2&&!crocus?.65:1);
   b.add(crocus?'crocusLinear':sara?'saraLeaf':'speciesTulipLeaf',crocus?'leaf-crocus-stripe':'leaf-lilium-parallel',kit.shade(rand,s.leafColor,.032),...at,width,len,len,crocus?.18+rand()*.30:sara?.76+j*.10:.30+j*.14,angle,0);
  }
  if(!s.bloom)continue;
  b.branch([x,0,z],head,crocus?.0011:.002,'#7a955c',crocus?'perianthTube':'scape');
  const variant=palette.variants?.[i%palette.variants.length]||{},p={...palette,...variant};
  detailedFlower(b,{x:head[0],y:head[1],z:head[2],r,color:variant.color||s.flowerColor,shape:a.flowerShape,palette:p,tilt:.04+rand()*.10,yaw},{...kit,rand});
 }
}

function drawLilies(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,palette=a.flowerPalette||{},whorled=a.arrangement==='whorled',kuruma=palette.pattern==='kuruma',native=a.architecture==='nativeLily',heads=[],green=s.leafColor,top=h*.95,lean=Math.min(.035,h*.035),stemColor=a.stemColor||'#648052';
 const axis=t=>[lean*Math.sin(t*1.4),top*t,lean*.4*t*t],stemRadius=Math.min(.004,h*.005);
 for(let j=0;j<12;j++)b.branch(axis(j/12),axis((j+1)/12),stemRadius*(1-j/18),stemColor,'stem');
 const leafAt=(t,an,len,width)=>{const at=axis(t);b.add('liliumLeaf','leaf-lilium-parallel',kit.shade(rand,green,.035),...at,width,len,len,.88+rand()*.40,an,(rand()-.5)*.12);};
 if(whorled){
  const levels=kuruma?[.28,.47]:[.19,.32,.45,.56];
  for(const t of levels)for(let j=0;j<8;j++)leafAt(t,j*TAU/8+t,Math.min(a.leafLength,h*.28,w*.40),palette.leafWidth);
  for(let j=0;j<6;j++)leafAt(.60+j*.048,j*2.399,Math.min(a.leafLength*.40,h*.13),palette.leafWidth*.45);
 }else{
  const count=native?15:a.architecture==='trumpetLily'?52:35;
  for(let j=0;j<count;j++){const t=.075+j/count*.73,len=Math.min(a.leafLength,h*.30,w*.42)*(.68+.32*Math.sin(Math.PI*t));leafAt(t,j*2.399,len,palette.leafWidth*(.78+.22*Math.sin(Math.PI*t)));}
 }
 if(!s.bloom)return;
 const count=palette.count||4,r=Math.min(a.flowerRadius,h*.18),raceme=whorled&&!kuruma;
 for(let j=0;j<count;j++){
  const t=raceme?.62+j/count*.37:.80+j/count*.18,an=j*2.399+.4,root=axis(t),reach=Math.min(w*.30,h*.20)*(raceme?.95-j/count*.45:1-j/count*.48),tip=[root[0]+Math.sin(an)*reach,root[1]+(whorled?.035:.030),root[2]+Math.cos(an)*reach],end=[tip[0]+Math.sin(an)*.012,tip[1]-(whorled?.025:0),tip[2]+Math.cos(an)*.012];
  b.branch(root,tip,stemRadius*.45,stemColor,'pedicel');b.branch(tip,end,stemRadius*.35,stemColor,'pedicel');
  const isBud=count>3&&j===count-1;
  if(isBud)b.add(kit.bud,'flowerBud','#a8af83',...end,r*.20,r*.75,r*.20,.45,an,0);
  else heads.push({at:end,an});
 }
 for(const {at,an} of heads)detailedFlower(b,{x:at[0],y:at[1],z:at[2],r,color:s.flowerColor,shape:'liliumFlower',palette,tilt:palette.tilt,yaw:an},{...kit,rand});
}

function drawSpringRacemes(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,hy=a.architecture==='hyacinth',freesia=a.architecture==='freesia',palette=a.flowerPalette||{},n=Math.max(2,Math.round((hy?3:freesia?5:8)*detail)),heads=[];
 for(let i=0;i<n;i++){
  const yaw=i*2.399,rr=Math.sqrt(i/n)*Math.min(w*.25,hy?.08:.09),x=Math.sin(yaw)*rr,z=Math.cos(yaw)*rr,top=h*(.91+rand()*.09);
  for(let j=0;j<(hy?5:freesia?6:4);j++){
   const angle=freesia?yaw+(j%2)*Math.PI:yaw+j*2.399,len=h*(hy?.60:freesia?.66:palette.longLeaf?1.0:.73)*(.80+rand()*.20),width=hy?.024:freesia?.016:palette.width||.008;
   b.add(hy?'hyacinthStrap':freesia?'irisSword':'muscariLeaf',hy?'leaf-glossy':freesia?'leaf-iris-parallel':'leaf',kit.shade(rand,s.leafColor,.035),x,.004,z,width/(hy?.114:freesia?.068:.048),len,len,.09+rand()*.12,angle,0);
  }
  if(!s.bloom)continue;
  const base=hy?top*.31:freesia?top*.77:top-Math.min(palette.head||.06,h*.38);
  b.branch([x,0,z],[x,base,z],hy?.004:freesia?.0018:.0016,'#879c67','scape');
  if(freesia){
   let previous=[x,base,z];
   for(let j=0;j<8;j++){
    const t=j/7,reach=h*.34*t,at=[x+Math.sin(yaw)*reach,base+h*(.04+.10*Math.sin(t*2)),z+Math.cos(yaw)*reach];
    b.branch(previous,at,.0012,'#8ca36d','rachis');b.add('narrow','bract','#96aa72',...at,.006,.018,.018,.70,yaw,0);
    if(j<5)heads.push({at,yaw:yaw+(j%2?.14:-.14),color:s.flowerColor,tilt:.68,shape:'freesiaFlower',r:a.flowerRadius*(1-j*.045)});
    else b.add(kit.bud,'flowerBud',j===5?s.flowerColor:'#9aaf75',at[0],at[1]+.004,at[2],.004,.014-(j-5)*.003,.004,.60,yaw,0);
    previous=at;
   }
   continue;
  }
  b.branch([x,base,z],[x,top,z],hy?.004:.0015,'#8fa471','rachis');
  const count=hy?52:110,headLength=top-base;
  for(let j=0;j<count;j++){
   const t=(j+.5)/count,an=j*2.399+yaw,rr=(hy?.016:.006)*(.55+.45*Math.sin(Math.PI*t)),at=[x+Math.sin(an)*rr,base+t*headLength,z+Math.cos(an)*rr],root=[x,at[1],z],young=t>(palette.whiteTop||.85);
   b.branch(root,at,hy?.0007:.00030,'#96a574','pedicel');
   const color=!hy&&young?palette.tip||s.flowerColor:!hy&&palette.earlyColor&&t>.55?palette.earlyColor:s.flowerColor;
   if(t>.94)b.add(kit.bud,'flowerBud',color,...at,hy?.0035:.0026,hy?.005:.003,hy?.0035:.0026);
   else heads.push({at,yaw:an,color,tilt:hy?1.76:2.06,shape:hy?'hyacinthFlower':'muscariUrn',r:a.flowerRadius*(.93-t*.12)});
  }
 }
 for(const {at,yaw,color,tilt,shape,r} of heads)detailedFlower(b,{x:at[0],y:at[1],z:at[2],r,color,shape,palette,tilt,yaw},{...kit,rand});
}

function drawIrises(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,mini=a.architecture==='miniIris',snake=a.architecture==='snakeIris',hio=a.architecture==='blackberryLily',beard=a.architecture==='beardedIris',quill=mini||snake,green=s.leafColor,kind=foliageKind(info),n=Math.max(3,Math.round((quill?6:4)*detail)),heads=[];
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=Math.sqrt(i/n)*Math.min(w*.25,quill?.075:.14),x=Math.sin(an)*rr,z=Math.cos(an)*rr,top=h*(.77+rand()*.14),head=[x+Math.sin(an)*h*.03,top,z+Math.cos(an)*h*.03];
  // Sword leaves overlap in two ranks within a fan, rather than radiating like grass.
  const count=quill?3:7;
  for(let j=0;j<count;j++){
   const side=j%2?1:-1,rank=Math.floor(j/2),len=h*(mini?(s.bloom?.64:1.08):snake?1.25:hio?.52:beard?.69:.92)*(1-rank*.10)*(1+rand()*.07),width=quill?Math.min(.003,h*.023):Math.min(hio?.029:beard?.035:.026,h*.054),yaw=an+(side<0?Math.PI:0),tilt=.06+rank*.115+rand()*.045;
   const color=kit.shade(rand,green,.025);
   if(j/count<s.leafDensity)b.add(quill?'irisQuill':'irisSword',quill?kind:'leaf-iris-parallel',color,x+Math.sin(an)*side*rank*.003,.004,z+Math.cos(an)*side*rank*.003,width/(quill?.008:.068),len,len,tilt,yaw,0);
  }
  if(!s.bloom&&!s.seedHeads&&!s.flowerBuds)continue;
  b.branch([x,0,z],head,Math.min(.004,h*.009),s.seedHeads?'#978367':'#81996c','scape');
  const branches=hio?5:beard?2:1;
  for(let j=0;j<branches;j++){
   const yaw=an+j*2.399,reach=hio?h*(.075+j*.022):j?h*.07:0,at=[head[0]+Math.sin(yaw)*reach,head[1]-(j===0?0:h*.12)+j*h*.027,head[2]+Math.cos(yaw)*reach];
   b.branch(j===0?head:[head[0],head[1]-h*.18,head[2]],at,Math.min(.0017,h*.006),s.seedHeads?'#9c8768':'#8c9e71','pedicel');
   const spatheLength=hio?.018:h*.12;
   b.add('narrow','spathe',s.seedHeads?'#b09a72':'#a2ac7e',...at,hio?.005:quill?.008:.013,spatheLength,spatheLength,.42,yaw,0);
   heads.push({at,yaw,j});
  }
 }
 for(const {at,yaw,j} of heads){
  const r=a.flowerRadius;
  if(hio&&s.seedHeads&&!s.bloom){
   const f=flowerFrame(b,at,0,yaw);
   for(let k=0;k<3;k++)f.add('irisFall','capsule','#b3a37d',0,0,0,r*.35,r*.55,r*.55,0,k*TAU/3,0);
   for(let k=0;k<16;k++){const t=(k+.5)/16,an=k*2.399,rr=.009*Math.sqrt(1-Math.pow(t*2-1,2));f.add(kit.bud,'seed','#252724',Math.sin(an)*rr,t*.024,Math.cos(an)*rr,.0038,.0041,.0038);}continue;
  }
  if(!s.bloom||hio&&j%3===2){b.add(kit.bud,'flowerBud','#a7aa72',...at,r*.15,r*.48,r*.15,.25,yaw,0);continue;}
  detailedFlower(b,{x:at[0],y:at[1],z:at[2],r,color:s.flowerColor,shape:a.flowerShape,palette:a.flowerPalette,tilt:snake?1.0:hio?.25:0,yaw},{...kit,rand});
 }
}

function drawNarcissus(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,palette=a.flowerPalette||{},hoop=palette.corona==='hoop',green=s.leafColor,kind=foliageKind(info),bulbs=Math.max(3,Math.round(5*detail));
 for(let i=0;i<bulbs;i++){
  const an=i*2.399,rr=Math.sqrt(i/bulbs)*Math.min(w*.26,.11),x=Math.sin(an)*rr,z=Math.cos(an)*rr;
  // Each bulb has a basal fan, never leaves spaced up a flowering stem.
  for(let j=0;j<(hoop?5:4);j++){
   const len=h*(.60+rand()*.29),width=hoop?.0022:Math.min(.013,h*.037),yaw=an+(j%2)*Math.PI+(rand()-.5)*.32;
   b.add('narcissusLeaf',kind,kit.shade(rand,green,.035),x+(j-1.5)*.002,.006,z,width/.028,len,len,.06+rand()*.20,yaw,0);
  }
  if(!s.bloom&&!s.flowerBuds)continue;
  const top=h*(.79+rand()*.14),head=[x+Math.sin(an)*h*.035,top,z+Math.cos(an)*h*.035];
  b.branch([x,0,z],head,Math.min(.003,h*.009),'#7e996b','scape');
  b.add('narrow','spathe','#bba67d',...head,.012,.045,.045,.70,an+.7,0);
  const n=palette.count||1,r=a.flowerRadius||.035;
  for(let j=0;j<n;j++){
   const yaw=an+(j-(n-1)/2)*(n===2?1.18:TAU/n),reach=n===1?r*.45:r*(1.0+.35*(j%2)),at=[head[0]+Math.sin(yaw)*reach,top+(n===1?0:(j%3)*r*.27),head[2]+Math.cos(yaw)*reach];
   b.branch(head,at,Math.min(.0014,h*.005),'#93a276','pedicel');
   if(!s.bloom){b.add(kit.bud,'flowerBud','#c5c49c',...at,r*.18,r*.52,r*.18,.75,yaw,0);continue;}
   const fc=palette.fade&&j%3===0?palette.fade:s.flowerColor;
   detailedFlower(b,{x:at[0],y:at[1],z:at[2],r,color:fc,shape:'narcissusFlower',palette,tilt:palette.reflexed?1.92+rand()*.14:hoop?1.08+rand()*.18:1.24+rand()*.23,yaw},{...kit,rand});
  }
 }
}

function drawDahlias(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,tree=a.architecture==='treeDahlia',compact=a.architecture==='compactDahlia',green=s.leafColor,kind=foliageKind(info),stem=a.stemColor||'#77885a',growth=s.shootScale||1;
 const leaf=(at,angle,size,n=5)=>{
  const length=size*.76,end=[at[0]+Math.sin(angle)*length,at[1]+length*.20,at[2]+Math.cos(angle)*length],shape=a.leafletShape||'dahliaLeaf';
  b.branch(at,end,Math.min(.0014,size*.012),stem,'petiole');
  for(let j=0;j<n-1;j++){
   const pair=Math.floor(j/2),t=.24+pair*.30,side=j%2?1:-1,root=at.map((v,k)=>v+(end[k]-v)*t),an=angle+side*1.12,tip=[root[0]+Math.sin(an)*size*.12,root[1]+size*.035,root[2]+Math.cos(an)*size*.12];
   b.branch(root,tip,size*.006,stem,'petiolule');
   if(tree&&n>5){for(const sign of [-1,1])b.add(shape,kind,kit.shade(rand,green,.035),...tip,size*.34,size*.38,size*.38,1.40,an+sign*.8,0);}
   b.add(shape,kind,kit.shade(rand,green,.045),...tip,size*(tree?.43:.63),size*.64,size*.64,1.30+rand()*.17,an,0);
  }
  b.add(shape,kind,green,...end,size*.76,size*.82,size*.82,1.18+rand()*.20,angle,0);
 };
 const heads=[],count=tree?3:compact?4:3;
 for(let i=0;i<count;i++){
  const an=i*2.399,rad=w*(tree?.11:compact?.24:.23)*Math.sqrt(i/count),top=h*(i===0?1:.74+rand()*.19),tip=[Math.sin(an)*rad,top*.88,Math.cos(an)*rad],base=[tip[0]*.18,0,tip[2]*.18],nodes=tree?9:6;
  b.branch(base,tip,Math.min(tree?.018:.007,h*.016),stem,'stem');
  for(let j=0;j<nodes;j++){
   const t=.14+j*.68/(nodes-1),at=tip.map((v,k)=>k===1?v*t:base[k]+(v-base[k])*t),size=Math.min(tree?.32:.17,w*(compact?.25:.23))*(1-t*.30)*Math.min(1,growth*1.6);
   b.add(kit.bud,'node',stem,...at,h*(tree?.006:.007),h*.004,h*(tree?.006:.007));
   for(const side of [0,1])leaf(at,an+j*Math.PI/2+side*Math.PI,size,tree?9:j>=nodes-2?1:j===nodes-3?3:5);
   if(j===nodes-3||tree&&j===nodes-2){
    for(const side of [-1,1]){
     const angle=an+side*1.15,end=[at[0]+Math.sin(angle)*w*(tree?.28:.26),top*(tree?.88:.78+rand()*.12),at[2]+Math.cos(angle)*w*(tree?.28:.26)];
     b.branch(at,end,Math.min(.005,h*.007),stem,'stem');
     for(const side2 of [0,1])leaf(at.map((v,k)=>v+(end[k]-v)*.55),angle+side2*Math.PI,Math.min(.14,w*.22),3);
     heads.push({at:end,angle});
    }
   }
  }
  heads.push({at:[tip[0],top,tip[2]],from:tip,angle:an});
 }
 for(let i=0;i<heads.length;i++){
  const {at,from,angle}=heads[i],r=Math.min(a.flowerRadius||(compact?.042:.065),h*.30),root=from||[at[0]*.94,at[1]-h*.10,at[2]*.94];
  if(!s.bloom)continue;
  const flower=i%4!==1;
  b.branch(root,at,Math.min(.003,h*.004),stem,'peduncle');
  if(!flower){b.add(kit.bud,'bud','#7e8b58',...at,r*.20,r*.22,r*.20);for(let j=0;j<8;j++)b.add('narrow','bract','#6b7947',at[0],at[1]-r*.16,at[2],r*.18,r*.31,r,.60,j*TAU/8,0);continue;}
  detailedFlower(b,{x:at[0],y:at[1],z:at[2],r,color:s.flowerColor,shape:'dahliaHead',petals:a.petals||16,layers:a.flowerLayers||5,pattern:a.flowerPattern,patternColor:a.flowerPatternColor,palette:a.flowerPalette,tilt:tree?1.85:1.0+rand()*.35,yaw:angle},{...kit,rand});
 }
}

export function drawDetailedHerb(b,{info,s,p,detail,rand,month},kit){
 if(info.appearance?.architecture==='pomeShrubSprays'){drawPomeShrubs(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='ardisiaShoots'){drawArdisia(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='callicarpaArches'){drawCallicarpa(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='gardeniaBranches'){drawGardenia(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='sarcandraCanes'){drawSarcandra(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='nandinaCanes'){drawNandina(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='euonymusBranches'){drawEuonymus(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='osmanthusAxils'){drawOsmanthus(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='magnoliaBranches'){drawMagnolia(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='camelliaBranches'){drawCamellia(b,{info,s,detail,rand},kit);return;}
 if(['oliveBranches','russianOliveBranches'].includes(info.appearance?.architecture)){drawOlives(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='syringaPanicles'){drawSyringa(b,{info,s,detail,rand},kit);return;}
 if(['loropetalumShoots','fothergillaBranches'].includes(info.appearance?.architecture)){drawHamamelid(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='deutziaSprays'){drawDeutzia(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='viburnumBranches'){drawViburnum(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='abeliaCanes'){drawAbelia(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='calaminthaCymes'){drawCalamintha(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='lysimachiaShoots'){drawLysimachia(b,{info,s,view:{month},detail,rand},kit);return;}
 if(info.appearance?.architecture==='delphiniumSpires'){drawDelphinium(b,{info,s,p,detail,rand},kit);return;}
 if(['saxifrageRosettes','bergeniaRhizomes'].includes(info.appearance?.architecture)){drawSaxifragaceae(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='agapanthusFans'){drawAgapanthus(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='heucherellaCrowns'){drawHeucherella(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='iberisCorymbs'){drawIberis(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='astilbePlumes'){drawAstilbe(b,{info,s,p,detail,rand},kit);return;}
 if(info.appearance?.architecture==='aquilegiaCymes'){drawAquilegia(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='dianthusCymes'){drawDianthus(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='verbenaBranches'){drawVerbena(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='scabiousHabit'){drawScabious(b,{info,s,p,detail,rand},kit);return;}
 if(info.appearance?.architecture==='asteraceaeHabit'){drawAsteraceae(b,{info,s,p,detail,rand},kit);return;}
 if(info.appearance?.architecture==='daisyBranches'){drawDaisyBranches(b,{info,s,p,detail,rand},kit);return;}
 if(info.appearance?.architecture==='myrtaceousTree'){drawMyrtaceousTree(b,{info,s,p,detail,rand},kit);return;}
 if(info.appearance?.architecture==='smokeTree'){drawSmokeTree(b,{info,s,p,detail,rand},kit);return;}
 if(info.appearance?.architecture==='coniferSprays'){drawConiferSprays(b,{info,s,p,detail,rand},kit);return;}
 if(info.appearance?.architecture==='gardenRoseCanes'){drawGardenRose(b,{info,s,p,detail,rand},kit);return;}
 if(['sideritisSpikes','silverMintSpikes','marrubiumWhorls','leonotisTiers'].includes(info.appearance?.architecture)){drawSilverMints(b,{info,s,p,detail,rand},kit);return;}
 if(['keiskeaRacemes','isodonPanicles','chelonopsisAxils','triporaCymes','leucosceptrumSpikes','melittisAxils'].includes(info.appearance?.architecture)){drawWoodlandMints(b,{info,s,p,detail,rand},kit);return;}
 if(['puschkiniaScapes','bletillaShoots'].includes(info.appearance?.architecture)){drawSpringOrchidBulb(b,{info,s,p,detail,rand},kit);return;}
 if(['roseaSpire','rugosaSpire'].includes(info.appearance?.architecture)){drawAlceaSpires(b,{info,s,p,detail,rand},kit);return;}
 if(['libertiaFans','anthericumPanicle','tofieldiaRaceme','ornithogalumRaceme','rhodoxisClump','siculumUmbel','aristeaFans'].includes(info.appearance?.architecture)){drawMonocotProfiles(b,{info,s,detail,rand},kit);return;}
 if(['onosmaRosette','buglossoidesShoots','mertensiaMat','nierembergiaMat','stellariaCushion','dryasMat','goldenStrawberry'].includes(info.appearance?.architecture)){drawLowHerbs(b,{info,s,detail,rand},kit);return;}
 if(['silverCaraway','moonCarrot','flamingoRunners','pimpinellaRose','hairyChervil','pinkHogweed'].includes(info.appearance?.architecture)){drawApiaceae(b,{info,s,detail,rand},kit);return;}
 if(['edraianthusTuft','phyteumaHeads','michauxiaAxis','jasioneHeads','tracheliumCorymb','wahlenbergiaTuft'].includes(info.appearance?.architecture)){drawBellFamily(b,{info,s,detail,rand},kit);return;}
 if(['waterCoin','marsileaMutica','bacopaCaroliniana','bacopaLanigera','bacopaMonnieri'].includes(info.appearance?.architecture)){drawWaterMargin(b,{info,s,detail,rand},kit);return;}
 if(['waterHyacinth','amazonFrogbit','salviniaNatans','salviniaMolesta','salviniaCucullata'].includes(info.appearance?.architecture)){drawFreeFloaters(b,{info,s,detail,rand},kit);return;}
 if(['waterArrowhead','nupharEmergent','floatingHeart','waterPoppy'].includes(info.appearance?.architecture)){drawFloatingAquatics(b,{info,s,detail,rand},kit);return;}
 if(['umbrellaSedge','dwarfPapyrus','waterHorsetail','twigRush'].includes(info.appearance?.architecture)){drawAquaticReeds(b,{info,s,detail,rand},kit);return;}
 if(['blueFescue','snowTussock','goldMillet','redMelica','crystalSedge','redHookSedge','goldMatRush','goldDwarfBamboo','sweetFlagFans','whitetopSedge'].includes(info.appearance?.architecture)){drawGrassAndSedgeProfiles(b,{info,s,detail,rand},kit);return;}
 if(['spurgeCanes','spurgeDome','snowSpurge','gauraWands'].includes(info.appearance?.architecture)){drawSpurgesAndGaura(b,{info,s,detail,rand},kit);return;}
 if(['diphylleiaUmbrella','jeffersoniaBasal','ranzaniaTrifoliate','deinantheCymes','kirengeshomaBells','pteridophyllumFern','hylomeconPinnate','eomeconBasal','araliaHerb','saururusRaceme','parnassiaScapes','cornusHerb'].includes(info.appearance?.architecture)){drawWoodlandSpecies(b,{info,s,detail,rand},kit);return;}
 if(['primroseRosette','gerberaRosette','brunneraSprays'].includes(info.appearance?.architecture)){drawBasalFlowerForms(b,{info,s,detail,rand},kit);return;}
 if(['tapienMat','stolonPhlox'].includes(info.appearance?.architecture)){drawLowFlowerMats(b,{info,s,detail,rand},kit);return;}
 if(info.appearance?.architecture==='sunspot'){drawSunspot(b,{info,s,rand},kit);return;}
 if(['uprightYellow','annualScabiosa','shastaAlaska','pacificDelphinium','summerHollyhock','pinkEveningPrimrose','creamFalls','doublePortulaca'].includes(info.appearance?.architecture)){drawGardenFlowerForms(b,{info,s,p,detail,rand},kit);return;}
 if(['foxFace','ornamentalKale','ornamentalPepper','crimsonClover','livingstoneDaisy','pinkSage','compactPinkCoreopsis'].includes(info.appearance?.architecture)){drawFruitAndLeafPlants(b,{info,s,p,detail,rand},kit);return;}
 if(s.groundDormant)return;
 const a=info.appearance||{},h=s.height,w=s.spread,green=s.leafColor||info.leafColor||'#587e45',stemColor=a.stemColor||green;
 const leafKind=foliageKind(info),shape=a.leafMargin==='crenate'?'crenate':a.leafShape||'leaf',leafyViolet=a.architecture==='leafyViolet',basal=!leafyViolet&&(a.arrangement==='basal'||['rosette','clump','mound','creeping'].includes(a.habit)),creeping=a.habit==='creeping';
 if(['calendula','nemophila','californiaPoppy','sweetAlyssum','basketOfGold'].includes(a.architecture)){drawSpringAnnuals(b,{info,s,detail,rand},kit);return;}
 if(['nasturtium','morningGlory','corncockle','snapdragon'].includes(a.architecture)){drawVineAndSpikeAnnuals(b,{info,s,detail,rand},kit);return;}
 if(['wireVine','groundIvy','dichondraMat'].includes(a.architecture)){drawGroundRunners(b,{info,s,detail,rand},kit);return;}
 if(['archingSedge','remoteSedge','pampasPlume'].includes(a.architecture)){drawOrnamentalGrasses(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='redHakone'){drawRedHakone(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='senetti'||a.architecture==='nesia'){drawCoolFloweringMounds(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='foxtailAsparagus'){drawFoxtailAsparagus(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='persianShield'){drawPersianShield(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='narcissus'){drawNarcissus(b,{info,s,detail,rand},kit);return;}
 if(['orientalLily','trumpetLily','nativeLily','martagonLily'].includes(a.architecture)){drawLilies(b,{info,s,detail,rand},kit);return;}
 if(['speciesTulip','earlyCrocus'].includes(a.architecture)){drawSmallSpringBulbs(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='helleboreProfile'){drawHelleboreProfiles(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='tessen'){drawTessen(b,{info,s,detail,rand},kit);return;}
 if(['muscari','hyacinth','freesia'].includes(a.architecture)){drawSpringRacemes(b,{info,s,detail,rand},kit);return;}
 if(['miniIris','beardedIris','snakeIris','dietes','blackberryLily'].includes(a.architecture)){drawIrises(b,{info,s,detail,rand},kit);return;}
 if(['compactDahlia','tallDahlia','treeDahlia'].includes(a.architecture)){drawDahlias(b,{info,s,detail,rand},kit);return;}
 if(a.architecture?.startsWith('celosia')){drawCelosias(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='beeBalm'||a.architecture==='tieredMonarda'){drawMonardas(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='airyGaillardia'||a.architecture==='compactGaillardia'){drawGaillardias(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='hydrangeaVine'||a.architecture==='porcelainVine'){drawDetailedVines(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='balloonFlower'||a.architecture==='compactBalloon'){drawBalloonFlowers(b,{info,s,detail,rand},kit);return;}
 if(['rockSoapwort','tallSoapwort','cowherb'].includes(a.architecture)){drawSoapworts(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='purpleEryngo'||a.architecture==='proteaEryngo'){drawDistinctEryngiums(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='silverBush'||a.architecture==='silveryBindweed'){drawSilverBindweeds(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='astelia'){drawAstelias(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='berzelia'){drawBerzelias(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='chloranthus'){drawChloranthus(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='acaenaMat'){drawAcaena(b,{info,s,detail,rand},kit);return;}
 if(['whiteMignonette','yellowMignonette'].includes(a.architecture)){drawReseda(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='snowdrop'){drawSnowdrops(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='quakingGrass'){drawQuakingGrass(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='ribbonReed'||a.architecture==='canaryGrass'){drawReedGrasses(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='trailingMallow'||a.architecture==='globeMallow'){drawSmallMallows(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='avalanche'||a.architecture==='diggerSpeedwell'){drawParahebes(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='globeDaisy'||a.architecture==='blueEyeShrub'){drawGlobularias(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='redValerian'){drawRedValerian(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='fan'){drawFans(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='nakedScape'){drawNakedScapes(b,{info,s,detail,rand},kit);return;}
 if(leafyViolet){drawLeafyViolets(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='uprightRaceme'||a.architecture==='squill'){drawRacemes(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='pineapple'){drawPineappleLily(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='peltatePair'){drawPeltatePairs(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='bloodroot'){drawBloodroot(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='funnelUmbel'){drawFunnelUmbels(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='chileanCrocus'){drawChileanCrocus(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='flannel'){drawFlannel(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='compactHebe'){drawCompactHebe(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='lotus'){drawLotus(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='cranesbill'){drawCranesbill(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='starJasmine'||a.architecture==='hatsuyuki'){drawStarJasmine(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='giantCrambe'||a.architecture==='seaKale'){drawCrambes(b,{info,s,detail,rand},kit);return;}
 if(['nigella','yellowNigella','larkspur'].includes(a.architecture)){drawFineAnnuals(b,{info,s,detail,rand},kit);return;}
 if(['blueButterfly','bridalVeil','roseGlory'].includes(a.architecture)){drawGlorybowers(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='blueberryCanes'){drawBlueberries(b,{info,s,detail,rand},kit);return;}
 if(['rhododendronTruss','fineAzalea','terminalPieris','kalmiaCluster','tieredEnkianthus','archingLeucothoe'].includes(a.architecture)){drawEricaceousShrubs(b,{info,s,detail,rand},kit);return;}
 if(['wireShrub','mirrorShrub','myrtleShrub','eremophila','mintBush','saltbush','gardeniaShrub','limeFelt','pityrodia','dustyMiller'].includes(a.architecture)){drawSmallShrubs(b,{info,s,detail,rand},kit);return;}
 if(['woodPoppy','anemonopsis'].includes(a.architecture)){drawWoodlandFlowers(b,{info,s,detail,rand},kit);return;}
 if(['fawnLily','smallSquill','autumnSnowflake','azureMuscari'].includes(a.architecture)){drawSmallBulbs(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='axillaryFunnel'){drawAxillaryFunnels(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='globeAmaranth'){drawGlobeAmaranth(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='mistflower'){drawMistflower(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='floweringTobacco'){drawFloweringTobacco(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='sedge'){drawSedges(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='creepingPhlox'){drawCreepingPhlox(b,{info,s,detail,rand},kit);return;}
 if(['mosquitoGrass','prairiePanicle'].includes(a.architecture)){drawDistinctGrasses(b,{info,s,detail,rand},kit);return;}
 const count=Math.max(4,Math.round((basal?15:11)*detail)),lh=Math.min(s.leafHeight,h*.62);
 const addLeaf=(at,size,angle,pitch=.95)=>{
  if(shape==='compound'){
   const n=a.leaflets||7,end=[at[0]+Math.sin(angle)*size,at[1]+size*.15,at[2]+Math.cos(angle)*size];b.branch(at,end,.0006,green,'petiole');
   if(a.compoundType==='palmate'){
    for(let j=0;j<n;j++)b.add('serrated',leafKind,kit.shade(rand,green,.06),...end,size*.32,size*.65,size*.65,pitch,angle+(j-(n-1)/2)*2.4/Math.max(1,n-1),0);
   }else{
    for(let j=0;j<n-1;j++){const pair=Math.floor(j/2),t=.2+pair*.6/Math.max(1,Math.floor((n-1)/2)-1),side=j%2?1:-1;b.add(a.leafletShape||'serrated',leafKind,kit.shade(rand,green,.06),at[0]+(end[0]-at[0])*t,at[1]+(end[1]-at[1])*t,at[2]+(end[2]-at[2])*t,size*.34,size*.48,size*.48,pitch,angle+side*.9,0);}
    b.add(a.leafletShape||'serrated',leafKind,green,...end,size*.34,size*.5,size*.5,pitch,angle,0);
   }
  }else b.add(shape,leafKind,kit.shade(rand,green,.07),...at,size,size,size,pitch,angle,(rand()-.5)*.18);
 };
 for(let i=0;i<count;i++){
  const angle=i*2.399,rr=w*.28*Math.sqrt((i+.5)/count),x=Math.sin(angle)*rr,z=Math.cos(angle)*rr,top=h*(.72+rand()*.23),leafSize=a.leafLength||Math.min(leafyViolet?.055:.18,w*(leafyViolet?.16:.26),lh*.72);
  if(basal){
   const at=[x*.8,lh*(creeping?.12:.4+rand()*.28),z*.8];b.branch([0,.005,0],at,.002,green,'petiole');addLeaf(at,leafSize*(.8+rand()*.35),angle,creeping?1.5:1.05);
  }else{
   b.branch([x*.15,0,z*.15],[x,top*.83,z],.0018,stemColor,'petiole');
   for(let j=0;j<5;j++){
    const t=.18+j*.14,at=[x*t,top*t,z*t],pairs=a.arrangement==='opposite'?2:a.arrangement==='whorled'?3:1;
    for(let k=0;k<pairs;k++)addLeaf(at,leafSize*(1-t*.5),angle+j*(pairs===1?2.399:1.57)+k*TAU/pairs,.85);
   }
  }
  if(!s.bloom||!a.flowerShape)continue;
  const y=creeping?Math.min(top,lh+.07):top;b.branch([x*.15,.01,z*.15],[x,y,z],a.architecture==='wiryHeads'?.0009:.0018,stemColor,'peduncle');
  if(a.architecture==='wiryHeads')for(let j=0;j<3;j++){
   const t=.18+j*.15,at=[x*t,y*t,z*t];b.add('feather',leafKind,green,...at,Math.min(.10,w*.2),.13,.13,1.1,angle+j*2.399,0);
  }
  const flower=(xx,yy,zz,r,tilt=0)=>detailedFlower(b,{x:xx,y:yy,z:zz,r:a.flowerRadius||r,color:s.flowerColor||info.flower,shape:a.flowerShape,petals:a.petals||5,layers:a.flowerLayers||1,pattern:a.flowerPattern,patternColor:a.flowerPatternColor,palette:a.flowerPalette,guides:a.flowerGuides,tilt,yaw:angle},{...kit,rand});
  const inf=a.inflorescence||'solitary',florets=Math.max(5,Math.round((inf==='panicle'?26:inf==='head'?36:16)*detail*(s.flowerDensity||1)));
  if(inf==='compoundUmbel'){
   const primary=Math.max(5,Math.round(10*detail)),radius=Math.min(.09,w*.22);
   for(let j=0;j<primary;j++){
    const an=j*TAU/primary,head=[x+Math.sin(an)*radius,y+Math.sin(j)*.004,z+Math.cos(an)*radius];
    b.branch([x,y-h*.12,z],head,.00065,green,'petiole');
    for(let k=0;k<7;k++){
     const aa=k*2.399,rr=.015*Math.sqrt((k+.5)/7),tip=[head[0]+Math.sin(aa)*rr,head[1]+.014,head[2]+Math.cos(aa)*rr];
     b.branch(head,tip,.00023,green,'petiole');flower(...tip,.0025);
    }
   }
  }else if(inf==='solitary'||['daisy','pincushion'].includes(a.flowerShape))flower(x,y,z,Math.min(a.flowerShape==='daisy'?.065:a.flowerShape==='violet'?.022:a.flowerShape==='pincushion'?.03:.045,w*(a.flowerShape==='violet'?.08:.16)));
  else for(let j=0;j<florets;j++){
   const t=(j+.5)/florets,aa=j*2.399;
   if(['spike','raceme','catkin'].includes(inf)){
    const yy=y-(a.inflorescenceLength||h*.22)*t,rr=a.headRadius||(inf==='raceme'?.028:.008),xx=x+Math.sin(aa)*rr,zz=z+Math.cos(aa)*rr;
    b.branch([x,yy,z],[xx,yy+.004,zz],.0006,green,'petiole');flower(xx,yy,zz,.012,inf==='raceme'?2.3:0);
   }else if(inf==='head'){
    const radius=a.headRadius||.04,rr=radius*Math.sqrt(1-(t*2-1)**2),at=[x+Math.sin(aa)*rr,y+(t*2-1)*radius,z+Math.cos(aa)*rr];
    detailedFlower(flowerFrame(b,at,Math.acos(t*2-1),aa),{x:0,y:0,z:0,r:a.flowerRadius||.008,color:s.flowerColor||info.flower,shape:a.flowerShape,petals:a.petals||5,layers:a.flowerLayers||1,pattern:a.flowerPattern,patternColor:a.flowerPatternColor},{...kit,rand});
   }else{
    const rr=Math.sqrt(t)*Math.min(.095,w*.2)*(inf==='panicle'?1-t*.65:1),yy=inf==='panicle'?y-h*.2+t*h*.2:y+Math.sin(t*Math.PI)*.015;
    const end=[x+Math.sin(aa)*rr,yy,z+Math.cos(aa)*rr];b.branch([x,y-h*.14,z],end,.0007,green,'petiole');flower(...end,.009);
   }
  }
 }
}

function drawSmallBulbs(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,fawn=a.architecture==='fawnLily',acis=a.architecture==='autumnSnowflake',muscari=a.architecture==='azureMuscari',n=Math.max(1,Math.round((fawn?3:7)*detail)),length=Math.min(a.leafLength||.15,h*(fawn?.58:.8),w*(fawn?.8:1.3));
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.25*Math.sqrt((i+.5)/n),root=[Math.sin(an)*rr,.002,Math.cos(an)*rr],top=h*(.78+rand()*.14);
  const leaves=fawn||!acis&&!muscari?2:acis?6:3;
  for(let j=0;j<leaves;j++){
   const yaw=an+j*TAU/leaves,size=length*(.88+rand()*.18);
   b.add(fawn?'leaf':acis?'blade':'strap',foliageKind(info),kit.shade(rand,green,.035),...root,size*(fawn?.68:acis?.20:.65),size,size,fawn?.88:acis?.20+rand()*.45:.12+rand()*.20,yaw,0);
  }
  if(!s.bloom)continue;
  const axis=[root[0],top,root[2]],stemColor=a.stemColor||green;b.branch(root,[axis[0],top*(acis?.85:fawn?.93:muscari?.98:.90),axis[2]],acis?.0007:.0013,stemColor,'peduncle');
  if(muscari){
   const florets=34;
   for(let j=0;j<florets;j++){
    const t=j/florets,yaw=an+j*2.399,radius=.007*(1-t*.35),at=[axis[0]+Math.sin(yaw)*radius,top*(.65+t*.33),axis[2]+Math.cos(yaw)*radius];
    b.branch([axis[0],at[1],axis[2]],at,.0003,green,'peduncle');detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius,color:s.flowerColor,shape:'azureBell',tilt:.10,yaw},{...kit,rand});
   }continue;
  }
  const flowers=fawn?(info.latin.includes('Pagoda')?5:3):acis?3:6;
  for(let j=0;j<flowers;j++){
   const yaw=an+j*2.399,t=(j+.5)/flowers,at=[axis[0],top*(fawn?.56+t*.37:acis?.85:.35+t*.6),axis[2]],reach=fawn?.035:acis?.018:.018*(1-t*.3),tip=[at[0]+Math.sin(yaw)*reach,at[1]+(fawn||acis?-.002:.008),at[2]+Math.cos(yaw)*reach];
   if(fawn||acis){const arch=[at[0]+Math.sin(yaw)*reach*.60,at[1]+reach*.38,at[2]+Math.cos(yaw)*reach*.60];b.branch(at,arch,.0006,stemColor,'peduncle');b.branch(arch,tip,.00055,stemColor,'peduncle');}
   else b.branch(at,tip,.0006,stemColor,'peduncle');
   detailedFlower(b,{x:tip[0],y:tip[1],z:tip[2],r:a.flowerRadius,color:s.flowerColor,shape:a.flowerShape,pattern:a.flowerPattern,patternColor:a.flowerPatternColor,palette:a.flowerPalette,tilt:fawn||acis?.10+rand()*.15:.55+rand()*.35,yaw},{...kit,rand});
  }
 }
}

function drawWoodlandFlowers(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,poppy=a.architecture==='woodPoppy',n=Math.max(1,Math.round((poppy?5:4)*detail*(s.leafDensity??1))),leafy=(s.leafDensity??1)>0;
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.18*Math.sqrt((i+.5)/n),root=[Math.sin(an)*rr,0,Math.cos(an)*rr],stemTop=h*(poppy?(s.bloom?.64:.96):.93)*(.85+rand()*.14),end=[root[0]+Math.sin(an)*w*.07,stemTop,root[2]+Math.cos(an)*w*.07];
  if(poppy){
   b.branch(root,end,.0023,green,'petiole');
   for(let j=0;j<3;j++){
    const t=.56+j*.16,at=root.map((v,k)=>v+(end[k]-v)*t),yaw=an+j*2.399,size=(j===2?.054:a.leafLength||.17)*(s.bloom?.65:1)*(s.leafScale??1),length=j===2?0:size*.52;
    const tip=[at[0]+Math.sin(yaw)*length,at[1]+length*.25,at[2]+Math.cos(yaw)*length];
    if(leafy){b.branch(at,tip,.0012,green,'petiole');b.add(j===2?'crenate':'glaucidiumPalm','leaf-palm',kit.shade(rand,green,.05),...tip,size,size,size,1.06+rand()*.23,yaw,0);}
   }
   if(s.bloom)detailedFlower(b,{x:end[0],y:end[1],z:end[2],r:a.flowerRadius,color:s.flowerColor,shape:'woodPoppy',tilt:.10+rand()*.23,yaw:an},{...kit,rand});
  }else{
   const compound=(base,yaw,scale)=>{
    const main=[base[0]+Math.sin(yaw)*w*.14*scale,base[1]+h*.12*scale,base[2]+Math.cos(yaw)*w*.14*scale];b.branch(base,main,.0012,green,'petiole');
    for(let j=0;j<3;j++){
     const aa=yaw+(j-1)*.92,secondary=[main[0]+Math.sin(aa)*w*.12*scale,main[1]+h*.025,main[2]+Math.cos(aa)*w*.12*scale];b.branch(main,secondary,.00075,green,'petiole');
     for(let k=0;k<3;k++){
      const az=aa+(k-1)*.88,size=(a.leafLength||.075)*scale*(k===1?1:.86)*(s.leafScale??1),at=[secondary[0]+Math.sin(az)*size*.18,secondary[1]+size*.04,secondary[2]+Math.cos(az)*size*.18];
      b.branch(secondary,at,.00045,green,'petiole');b.add('anemonopsisLeaflet','leaf',kit.shade(rand,green,.05),...at,size*.95,size,size,1.13,az,0);
     }
    }
   };
   b.branch(root,end,.0022,'#6a7361','petiole');
   if(leafy)for(let j=0;j<4;j++)compound(root.map((v,k)=>v+(end[k]-v)*(.16+j*.13)),an+j*2.399,1-j*.13);
   if(s.bloom){b.add(kit.bud,'bud','#ae90ac',...end,.0045,.005,.0045);for(let j=0;j<6;j++){
    const t=.56+j*.076,at=root.map((v,k)=>v+(end[k]-v)*t),yaw=an+j*2.399,reach=w*(.20-j*.022),joint=[at[0]+Math.sin(yaw)*reach*.70,at[1]+h*.04,at[2]+Math.cos(yaw)*reach*.70],tip=[at[0]+Math.sin(yaw)*reach,at[1]-h*.045,at[2]+Math.cos(yaw)*reach];
    let prev=at;for(let k=1;k<=7;k++){const f=k/7,q=1-f,node=at.map((v,n)=>v*q*q+2*joint[n]*q*f+tip[n]*f*f);b.branch(prev,node,.00085*(1-f*.25),'#716a64','peduncle');prev=node;}
    if(rand()<.23)b.add(kit.bud,'bud','#b89eb8',...tip,.005,.0045,.005);
    else detailedFlower(b,{x:tip[0],y:tip[1],z:tip[2],r:a.flowerRadius*(.88+rand()*.14),color:s.flowerColor,shape:'anemonopsis',layers:a.flowerLayers||1,pattern:a.flowerPattern,patternColor:a.flowerPatternColor,tilt:.1,yaw},{...kit,rand});
   }}
  }
 }
}

function drawBalloonFlowers(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,compact=a.architecture==='compactBalloon',green=s.leafColor,count=Math.max(4,Math.round((compact?11:7)*detail)),flowers=[];
 for(let i=0;i<count;i++){
  const an=i*2.399,rad=w*.27*Math.sqrt((i+.5)/count),root=[Math.sin(an)*rad*.4,.008,Math.cos(an)*rad*.4],top=[Math.sin(an)*rad,h*(.72+rand()*.23),Math.cos(an)*rad],nodes=compact?6:9;
  let prev=root;
  for(let j=1;j<=nodes;j++){
   const t=j/nodes,at=root.map((v,k)=>v+(top[k]-v)*t);b.branch(prev,at,.0016*(1-t*.45),green,'stem');
   if(j<nodes)for(let k=0;k<(j<3?2:1);k++){
    const yaw=an+j*2.399+k*Math.PI,len=Math.min(a.leafLength,w*.22)*(.6+.4*Math.sin(t*Math.PI));b.add(a.leafShape,foliageKind(info),kit.shade(rand,green,.055),...at,len,len,len,.95+rand()*.5,yaw,0);
   }
   if(j===nodes-2||compact&&j===nodes-3){const yaw=an+j,side=[at[0]+Math.sin(yaw)*w*.11,at[1]+h*(compact?.12:.09),at[2]+Math.cos(yaw)*w*.11];b.branch(at,side,.001,green,'peduncle');flowers.push({at:side,yaw,closed:(i+j)%3===0});}
   prev=at;
  }
  flowers.push({at:top,yaw:an,closed:i%4===0});
 }
 if(s.bloom)for(const {at,yaw,closed} of flowers){
  if(closed){const r=.0115;b.add('balloonBud','bud',kit.shade(rand,green,.06),...at,r,r,r,.10,yaw,0);for(let j=0;j<5;j++)b.add('narrow','sepal',green,...at,.008,.012,.012,.8,j*TAU/5,0);}
  else detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:.028,color:s.flowerColor,shape:'balloonCorolla',layers:a.flowerLayers,pattern:a.flowerPattern,tilt:.6+rand()*.75,yaw},{...kit,rand});
 }
}

function drawSoapworts(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,rock=a.architecture==='rockSoapwort',cow=a.architecture==='cowherb',green=s.leafColor,stemColor=a.stemColor||green,flowers=[],count=Math.max(1,Math.round((rock?40:cow?1:9)*detail));
 const leafPair=(at,yaw,size)=>{for(const side of [-1,1])b.add(a.leafShape,foliageKind(info),kit.shade(rand,green,.05),...at,size,size,size,1.02,yaw+(side===1?Math.PI:0),0);};
 for(let i=0;i<count;i++){
  const an=i*2.399,rad=rock?w*(.25+rand()*.20):cow?0:w*.28*Math.sqrt((i+.5)/count),root=[Math.sin(an)*rad*.15,.007,Math.cos(an)*rad*.15],top=[Math.sin(an)*rad,h*(rock?.35+rand()*.5:cow?.50:.65+rand()*.25),Math.cos(an)*rad],nodes=rock?9:7;
  let prev=root;
  for(let j=1;j<=nodes;j++){
   const t=j/nodes,at=root.map((v,k)=>v+(top[k]-v)*t);if(rock)at[1]+=.02*Math.sin(t*Math.PI);b.branch(prev,at,rock?.00065:.0017,stemColor,'stem');leafPair(at,an+j*1.57,Math.min(a.leafLength,w*.2)*(rock?.85:1-t*.4));
   if(rock&&j>2){const yaw=an+(j%2?1:-1)*.8,end=[at[0]+Math.sin(yaw)*.065,at[1]+h*.23,at[2]+Math.cos(yaw)*.065];b.branch(at,end,.0004,stemColor,'peduncle');
    for(let k=1;k<=3;k++){const t=k/4,pt=at.map((v,n)=>v+(end[n]-v)*t);leafPair(pt,yaw+k*1.57,a.leafLength*(.7+rand()*.3));}
    const central=[end[0],end[1]+.026,end[2]];b.branch(end,central,.0003,stemColor,'pedicel');flowers.push({at:central,yaw});for(let k=0;k<7;k++){const aa=k*2.399+yaw,rr=.027*Math.sqrt((k+.5)/7),pt=[end[0]+Math.sin(aa)*rr,end[1]+.028+rand()*.012,end[2]+Math.cos(aa)*rr];b.branch(end,pt,.0003,stemColor,'pedicel');flowers.push({at:pt,yaw:yaw+k});}}
   prev=at;
  }
  if(!rock){
   const fork=(at,depth,yaw,spread)=>{
    if(depth===0){flowers.push({at,yaw});return;}
    leafPair(at,yaw,Math.min(a.leafLength,w*.2)*(cow?.11*depth:.32*depth));
    for(const sign of [-1,1]){const aa=yaw+sign*(.55+rand()*.40),end=[at[0]+Math.sin(aa)*spread,at[1]+h*(cow?.053+rand()*.022:.048+rand()*.02),at[2]+Math.cos(aa)*spread];b.branch(at,end,.0007,stemColor,'peduncle');fork(end,depth-1,aa+sign*.6,spread*.68);}
   };fork(top,cow?6:2,an,w*(cow?.20:.04));
  }
 }
 if(s.bloom)for(const {at,yaw} of flowers)detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius,color:s.flowerColor,shape:a.flowerShape,tilt:.25+rand()*.85,yaw},{...kit,rand});
}

function drawDistinctEryngiums(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,purple=a.architecture==='purpleEryngo',dry=s.seedHeads,green=dry?a.seedColor:s.leafColor,leaves=[],heads=[];
 if(!purple){
  // The flowering crown is replaced by neighbouring evergreen rosettes after flowering.
  for(let i=0;i<4;i++){
   const an=i*2.399,root=i===0?[0,.009,0]:[Math.sin(an)*w*.20,.009,Math.cos(an)*w*.20];
   for(let j=0;j<18;j++){const angle=j*2.399+i,len=Math.min(.30,w*.62)*(.65+rand()*.35),color=kit.shade(rand,green,.06),tilt=.50+rand()*.80;if(i!==0||!s.flowerFinished)b.add('eryngoStrap','leaf',color,...root,len,len,len,tilt,angle,0);}
  }
  if(!s.bloom)return;
 }
 const base=[0,.015,0],fork=[w*.018,h*.43,0];b.branch(base,fork,purple?.003:.004,green,'petiole');
 for(let j=0;j<8;j++){const t=(j+.5)/8,at=base.map((v,k)=>v+(fork[k]-v)*t);leaves.push({at,yaw:j*2.399,size:Math.min(purple?.10:.20,w*.35),upper:false});}
 const count=purple?Math.max(5,Math.round(9*detail)):3;
 for(let i=0;i<count;i++){
  const an=i*2.399,spread=w*(.22+rand()*.18),at=[fork[0],h*(.40+i/count*.15),0],joint=[Math.sin(an)*spread*.6,h*(.61+rand()*.12),Math.cos(an)*spread*.6],tip=[Math.sin(an)*spread,h*(.82+rand()*.12),Math.cos(an)*spread];
  if(!purple){at[0]=fork[0];at[1]=h*.43;at[2]=0;joint[0]=i?Math.sin(an)*spread*.35:0;joint[1]=h*(i?.59:.7);joint[2]=i?Math.cos(an)*spread*.35:0;tip[0]=i?Math.sin(an)*spread:0;tip[1]=h*(i?.68+i*.09:.94);tip[2]=i?Math.cos(an)*spread:0;}
  b.branch(at,joint,.0019,green,'petiole');b.branch(joint,tip,.0013,purple&&(s.bloom||dry)?dry?a.seedColor:'#91608f':green,'petiole');
  for(let j=0;j<3;j++){const t=j/3,pt=joint.map((v,k)=>v+(tip[k]-v)*t);leaves.push({at:pt,yaw:an+j*2.399,size:Math.min(purple?.085:.15,w*.28),upper:true});}
  heads.push({at:tip,yaw:an});
  if(purple&&i%2===0){const side=[joint[0]+Math.sin(an+.8)*w*.15,joint[1]+h*.10,joint[2]+Math.cos(an+.8)*w*.15];b.branch(joint,side,.0012,green,'petiole');heads.push({at:side,yaw:an+.8});}
 }
 if(!dry)for(const l of leaves){const color=purple&&l.upper&&s.bloom?'#8d6991':green;b.add(purple?'eryngoPalm':'eryngoStrap','leaf',color,...l.at,l.size,l.size,l.size,1.03,l.yaw,0);}
 if(s.bloom||dry)for(const {at,yaw} of heads)detailedFlower(b,{x:at[0],y:at[1],z:at[2],color:s.flowerColor,shape:a.flowerShape,palette:{dry},tilt:0,yaw},{...kit,rand});
}

function drawDetailedVines(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,hydrangea=a.architecture==='hydrangeaVine',green=s.leafColor,wood=a.barkColor||'#857360',kind=a.barkPattern?'wood-'+a.barkPattern:'wood',leaves=[],flowers=[];
 // The visible frame denotes a trained vine; it is not a self-supporting tree trunk.
 for(const x of [-w*.35,w*.35])b.branch([x,0,-.05],[x,h,-.05],.006,'#a49c84','support');
 for(let j=1;j<7;j++)b.branch([-w*.35,h*j/7,-.05],[w*.35,h*j/7,-.05],.003,'#a49c84','support');
 const stems=Math.max(3,Math.round(4*detail)),nodes=Math.min(48,Math.max(12,Math.ceil(h/.13)));
 const addLeaves=(at,an,index)=>{
  for(const side of hydrangea?[-1,1]:[index%2?1:-1]){
   const yaw=an+side*1.0,size=Math.min(hydrangea?.12:.12,w*.15),tip=[at[0]+Math.sin(yaw)*size*.40,at[1]+size*.07,at[2]+Math.cos(yaw)*size*.40];leaves.push({at,tip,yaw,size});
  }
 };
 for(let i=0;i<stems;i++){
  let prev=[(i-(stems-1)/2)*w*.04,.008,.025];
  for(let j=1;j<=nodes;j++){
   const t=j/nodes,xx=Math.sin(i*1.8+t*5.5)*w*.28,at=[xx,h*t,.02+Math.sin(t*12+i)*.026];b.branch(prev,at,.0045*(1-t*.65),wood,kind);addLeaves(at,i+j*1.2,j);
   if(j%3===0&&j<nodes-1){
    const side=j%2?1:-1,end=[Math.max(-w*.40,Math.min(w*.40,xx+side*w*.23)),at[1]+h*.055,at[2]+.05];b.branch(at,end,.0018,a.stemColor||wood,kind);
    for(let k=1;k<=5;k++){const v=k/5,pt=at.map((x,l)=>x+(end[l]-x)*v);addLeaves(pt,i+k*1.6,k);}
    flowers.push({at:end,yaw:i+j});
   }
   if(hydrangea){
    for(let k=0;k<3;k++){const tip=[at[0]+(k-1)*.005,at[1]-.007,-.045];b.branch(at,tip,.00035,'#8f8271','aerialRoot');}
   }else if(j%3!==0){
    // The forked tendril arises opposite a leaf and curls toward the support.
    const side=j%2?-1:1,base=[at[0]+side*.035,at[1]+.018,at[2]-.012];b.branch(at,base,.0006,a.stemColor,'tendril');
    for(const fork of [-1,1]){let q=base;for(let k=1;k<=12;k++){const t=k/12,ang=t*TAU*1.3,rad=.010*(1-t*.65),pt=[base[0]+side*t*.024+Math.cos(ang)*rad,base[1]+fork*t*.014+Math.sin(ang)*rad,base[2]-t*.025];b.branch(q,pt,.00035,a.stemColor,'tendril');q=pt;}}
   }prev=at;
  }
 }
 if(s.leafDensity>0)for(const l of leaves){
  if(rand()>s.leafDensity)continue;b.branch(l.at,l.tip,.0008,a.stemColor||'#a46f73','petiole');const leafKind=a.leafPattern==='porcelainVariegation'?(s.springFlush?'leaf-porcelain-faint':'leaf-porcelain'):foliageKind(info);
  b.add(a.leafShape,leafKind,kit.shade(rand,green,.045),...l.tip,l.size*s.leafScale,l.size*s.leafScale,l.size*s.leafScale,1.65+(rand()-.5)*.8,l.yaw,0);
 }
 for(const {at,yaw} of flowers){
  if(hydrangea){if(s.bloom)detailedFlower(b,{x:at[0],y:at[1]+.025,z:at[2]+.025,r:(a.inflorescenceLength||.15)*.5,color:s.flowerColor,shape:'singleSepalCorymb',tilt:.4,yaw},{...kit,rand});continue;}
  if(!s.bloom&&!s.fruitStage)continue;
  const top=[at[0],at[1]+.027,at[2]+.03];b.branch(at,top,.001,a.stemColor,'peduncle');
  for(let j=0;j<15;j++){const an=j*2.399,rr=.035*Math.sqrt((j+.5)/15),pt=[top[0]+Math.sin(an)*rr,top[1]+.015*Math.sin(j),top[2]+Math.cos(an)*rr];b.branch(top,pt,.00055,a.stemColor,'pedicel');
   if(s.fruitStage){const palette=s.fruitStage==='early'?['#bbc69b','#bfacbf','#989fbb']:['#a7b3b9','#7faac0','#7779a8','#b49bbd'];b.add(kit.bud,'fruit',palette[j%4]||palette[0],...pt,.0038,.0036,.0038);}
   else detailedFlower(b,{x:pt[0],y:pt[1],z:pt[2],r:.0024,color:s.flowerColor,shape:'ampelopsisFlower',yaw:an},{...kit,rand});
  }
 }
}

function drawSilverBindweeds(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,creep=a.architecture==='silveryBindweed',green=s.leafColor,leaves=[],flowers=[],n=Math.round((creep?18:26)*detail);
 const leaf=(at,yaw,size)=>{
  const end=[at[0]+Math.sin(yaw)*size*.23,at[1]+size*.10,at[2]+Math.cos(yaw)*size*.23];b.branch(at,end,.00035,green,'petiole');
  if(creep){
   b.add('bindweedDivided','leaf-woolly',green,...end,size,size,size,1.25,yaw,0);
  }else b.add('leaf','leaf-woolly',kit.shade(rand,green,.04),...end,size*.35,size,size,.58+rand()*.7,yaw,0);
 };
 for(let i=0;i<n;i++){
  const an=i*2.399,reach=w*(.06+rand()*.34),root=[Math.sin(an)*w*.035,.008,Math.cos(an)*w*.035],height=h*(.93-.40*Math.pow(reach/(w*.4),2));let prev=root;
  for(let j=1;j<=14;j++){
   const t=j/14,aa=an+Math.sin(t*5+i)*.17,at=[root[0]+Math.sin(aa)*reach*t,creep?.009+Math.sin(t*Math.PI)*h*.28:height*t,root[2]+Math.cos(aa)*reach*t];
   b.branch(prev,at,(creep?.0012:.0032)*(1-t*.72),creep?'#8f9a7c':'#9b927b',creep?'runner':'wood');
   if(j>2)leaves.push({at,yaw:aa+j*2.399,size:Math.min(creep?.055:.07,h*.23)});
   if(j>6&&j%3===0){
    const side=aa+(j%2?1.4:-1.4),tip=[at[0]+Math.sin(side)*w*.105,at[1]+h*(creep?.15:.16),at[2]+Math.cos(side)*w*.105];b.branch(at,tip,creep?.0007:.0015,green,creep?'runner':'wood');
    for(let k=1;k<=8;k++){const v=k/8,pt=at.map((x,l)=>x+(tip[l]-x)*v);leaves.push({at:pt,yaw:side+k*2.399,size:Math.min(creep?.042:.058,h*.21)});}
    flowers.push({at:tip,yaw:side});
   }prev=at;
  }flowers.push({at:prev,yaw:an});
 }
 for(const l of leaves)leaf(l.at,l.yaw,l.size);
 if(s.bloom)for(const {at,yaw} of flowers){
  if(rand()>.70*s.flowerDensity)continue;
  const tip=[at[0]+Math.sin(yaw)*.009,at[1]+Math.min(.045,h*.18),at[2]+Math.cos(yaw)*.009];b.branch(at,tip,.00055,green,'peduncle');
  if(rand()<.17){b.add(kit.bud,'bud',creep?'#b7658f':'#d2b8b4',...tip,.003,.009,.003,.2,yaw,0);continue;}
  detailedFlower(b,{x:tip[0],y:tip[1],z:tip[2],r:a.flowerRadius||.018,color:s.flowerColor,shape:'bindweedFunnel',palette:{eye:a.flowerEyeColor},tilt:.1+rand()*.75,yaw},{...kit,rand});
 }
}

function drawAstelias(b,{info,s,detail,rand},kit){
 const h=s.height,w=s.spread,a=info.appearance,green=s.leafColor,n=Math.max(3,Math.round(5*detail));
 for(let i=0;i<n;i++){
  const an=i*2.399,reach=i===0?0:w*.10,root=[Math.sin(an)*reach,.006,Math.cos(an)*reach],rotation=rand()*TAU;
  for(let j=0;j<15;j++){
   const age=j/14,angle=rotation+(j%3)*TAU/3+Math.sin(j*2)*.11,length=h*(.55+Math.sin(age*Math.PI)*.38+rand()*.08),pitch=.04+age*Math.atan(w*.23/h);
   b.add(j<3?'asteliaYoung':'asteliaBlade','leaf-astelia',kit.shade(rand,green,.08),root[0],root[1]+(1-age)*h*.035,root[2],length*.8,length,w*.45,pitch,angle,(rand()-.5)*.12);
  }
  if(!s.bloom||i>1)continue;
  const end=[root[0],h*.46,root[2]];b.branch(root,end,.0032,'#94907c','peduncle');
  for(let j=0;j<7;j++){
   const t=j/7,aa=an+j*2.399,axis=[root[0],h*(.20+t*.24),root[2]],tip=[axis[0]+Math.sin(aa)*w*.14*(1-t*.5),axis[1]+h*.09,axis[2]+Math.cos(aa)*w*.14*(1-t*.5)];b.branch(axis,tip,.0012,'#979475','rachis');
   for(let k=0;k<9;k++){const v=k/9,ang=aa+k*2.399,at=axis.map((x,l)=>x+(tip[l]-x)*v),out=[at[0]+Math.sin(ang)*.006,at[1]+.002,at[2]+Math.cos(ang)*.006];b.branch(at,out,.0003,'#949276','pedicel');detailedFlower(b,{x:out[0],y:out[1],z:out[2],r:.004,color:s.flowerColor,shape:'asteliaSmall',tilt:1.2,yaw:ang},{...kit,rand});}
  }
 }
}

function drawBerzelias(b,{info,s,detail,rand},kit){
 const h=s.height,w=s.spread,a=info.appearance,small=info.label.includes('ピッコロ'),green=s.leafColor,leaves=[],heads=[],n=Math.max(6,Math.round(10*detail));
 const spray=(from,to,r,yaw,terminal)=>{
  let prev=from;
  const steps=Math.min(140,Math.max(24,Math.ceil(Math.hypot(...to.map((v,k)=>v-from[k]))/.005)));
  for(let j=1;j<=steps;j++){
   const t=j/steps,at=from.map((v,k)=>v+(to[k]-v)*t);at[0]+=Math.sin(t*Math.PI)*w*.014*Math.sin(yaw);at[2]+=Math.sin(t*Math.PI)*w*.014*Math.cos(yaw);b.branch(prev,at,r*.4*(1-t*.65),'#87995b','wood');
   for(let k=0;k<6;k++)leaves.push({at,yaw:yaw+k*TAU/6+j*.35,length:a.leafLength*(.75+rand()*.25)});
   prev=at;
  }
  if(terminal)heads.push({at:to,yaw});
 };
 for(let i=0;i<n;i++){
  const an=i*2.399,reach=w*(.12+rand()*.23),root=[Math.sin(an)*w*.025,.01,Math.cos(an)*w*.025],top=[Math.sin(an)*reach,h*(.72+rand()*.23),Math.cos(an)*reach];spray(root,top,.0045,an,true);
  for(let j=0;j<4;j++){
   const t=.30+j*.14,at=root.map((v,k)=>v+(top[k]-v)*t),aa=an+(j%2?1.1:-1.1),tip=[at[0]+Math.sin(aa)*w*.13,at[1]+h*(.22-j*.025),at[2]+Math.cos(aa)*w*.13];spray(at,tip,.0018,aa,true);
   if(j>0){const mid=at.map((v,k)=>v+(tip[k]-v)*.5),end=[mid[0]+Math.sin(aa+.8)*w*.05,mid[1]+h*.09,mid[2]+Math.cos(aa+.8)*w*.05];spray(mid,end,.0008,aa+.8,false);}
  }
 }
 for(const l of leaves)b.add('needle','leaf',kit.shade(rand,green,.035),...l.at,l.length*1.7,l.length,l.length,.63,l.yaw,0);
 for(const {at,yaw} of heads){
  const count=small?4:3;
  for(let j=0;j<count;j++){
   const aa=yaw+j*2.399,reach=j===0?0:Math.min(.022,w*.025),tip=[at[0]+Math.sin(aa)*reach,at[1]+.013+(j===0?.012:0),at[2]+Math.cos(aa)*reach];b.branch(at,tip,.00075,a.stemColor,'peduncle');
   detailedFlower(b,{x:tip[0],y:tip[1],z:tip[2],r:small?.005:.0075,color:s.flowerColor,shape:'berzeliaHead',palette:{small,closed:s.headPhase==='bud',dry:s.headPhase==='dry'},yaw:aa},{...kit,rand});
  }
 }
}

function drawChloranthus(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,n=Math.max(5,Math.round(14*detail)),green=s.leafColor;
 for(let i=0;i<n;i++){
  const yaw=i*2.399,rr=w*.29*Math.sqrt((i+.5)/n),base=[Math.sin(yaw)*rr,0,Math.cos(yaw)*rr],height=h*(.60+rand()*.30),top=[base[0]+Math.sin(yaw)*.006,height,base[2]+Math.cos(yaw)*.006];
  b.branch(base,top,.0014,a.stemColor,'stem');
  for(let j=0;j<4;j++){
   const angle=yaw+j*Math.PI/2,at=[top[0],height-(j%2)*.007,top[2]],size=Math.min(.085,h*.32)*(.83+rand()*.24),tip=[at[0]+Math.sin(angle)*.007,at[1]+.003,at[2]+Math.cos(angle)*.007];
   b.branch(at,tip,.00055,a.stemColor,'petiole');b.add('chloranthusLeaf',foliageKind(info),green,...tip,size,size,size,s.bloom?.45:1.28,angle,(rand()-.5)*.10);
  }
  if(s.bloom){const rise=Math.min(.055,h*.25),at=[top[0],top[1]+rise,top[2]];b.branch(top,at,.0012,'#9ea756','peduncle');detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.inflorescenceLength,color:s.flowerColor,shape:'chloranthusSpike',yaw},{...kit,rand});}
 }
}

function drawAcaena(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,blue=a.leafletShape==='acaenaToothed',green=s.leafColor,n=Math.max(12,Math.round(24*detail)),heads=[];
 for(let i=0;i<n;i++){
  const angle=rand()*TAU,rootAngle=i*2.399,rootRadius=w*.27*Math.sqrt((i+.5)/n),root=[Math.sin(rootAngle)*rootRadius,.004,Math.cos(rootAngle)*rootRadius],reach=w*(.10+rand()*.12),curve=(rand()-.5)*1.2;let prev=root;
  for(let j=1;j<=12;j++){
   const t=j/12,node=[root[0]+Math.sin(angle+t*curve)*reach*t,.008+h*.06*Math.sin(t*3.7),root[2]+Math.cos(angle+t*curve)*reach*t];b.branch(prev,node,.0006,'#855f63','stolon');prev=node;
   for(const side of [-1,1]){
    const yaw=angle+side*(1.0+rand()*.7),length=Math.min(a.leafLength,w*.17)*(.65+rand()*.35),f=flowerFrame(b,node,1.13+rand()*.12,yaw);
    f.branch([0,0,0],[0,length,0],.00025,'#85646a','rachis');
    for(let k=0;k<6;k++)for(const direction of [-1,1]){
     const q=.15+k*.12,size=length*(.08+k*.025),at=[direction*.0003,length*q,0];
     f.add(a.leafletShape,foliageKind(info),green,...at,size,size,size,.08,0,direction*(.95+rand()*.12));
    }
    const size=length*.23;f.add(a.leafletShape,foliageKind(info),green,0,length*.87,0,size,size,size,.03,0,0);
   }
   if(j===9&&i%2===0)heads.push({base:node,at:[node[0]+Math.sin(angle)*.008,Math.min(.10,h*(.58+rand()*.32)),node[2]+Math.cos(angle)*.008],yaw:angle});
  }
 }
 if(s.bloom)for(const {base,at,yaw} of heads){b.branch(base,at,.00065,blue?'#8b4659':'#917965','peduncle');detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.headRadius,color:s.flowerColor,shape:'acaenaHead',palette:{...a.flowerPalette,blue},yaw},{...kit,rand});}
}

function drawReseda(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,white=a.architecture==='whiteMignonette',green=s.leafColor,n=Math.max(6,Math.round(12*detail)),heads=[];
 const leaf=(at,yaw,size,pitch)=>{
  const f=flowerFrame(b,at,pitch,yaw),pairs=white?7:1;
  f.add('narrow','leaf',green,0,0,0,size*.42,size,size,.04,0,0);
  for(let k=0;k<pairs;k++)for(const side of [-1,1]){
   const q=white?.13+k*.11:.39,lobe=size*(white?.30:.47)*(1-q*.25);f.add('narrow','leaf',green,0,size*q,0,lobe*(white?.65:.80),lobe,lobe,.06,0,side*(1.05+rand()*.14));
  }
 };
 for(let i=0;i<n;i++){
  const angle=i*2.399,rr=w*.27*Math.sqrt((i+.5)/n),top=h*(.55+rand()*.18),base=[Math.sin(angle)*rr*.22,0,Math.cos(angle)*rr*.22];let prev=base;
  leaf(base,angle,Math.min(.10,w*.31),1.22);
  for(let j=1;j<=9;j++){
   const t=j/9,node=[base[0]+Math.sin(angle)*rr*t,top*t,base[2]+Math.cos(angle)*rr*t];b.branch(prev,node,.0013,green,'stem');prev=node;
   if(j<8)leaf(node,angle+j*2.399,Math.min(.10,w*.32)*(1-t*.53),.73);
   if(j===5||j===7){const yaw=angle+j*2.399,tip=[node[0]+Math.sin(yaw)*w*.14,node[1]+h*.15,node[2]+Math.cos(yaw)*w*.14];b.branch(node,tip,.0008,green,'stem');leaf(node,yaw,.052,.69);heads.push({at:tip,yaw,length:h*.23});}
  }
  heads.push({at:prev,yaw:angle,length:h*.34});
 }
 if(!s.bloom)return;
 for(const {at:base,yaw,length} of heads){
  const count=Math.max(30,Math.round((white?90:68)*detail));let prev=base;
  for(let j=0;j<count;j++){
   const t=j/count,at=[base[0]+Math.sin(yaw)*w*.04*t*t,base[1]+length*t,base[2]+Math.cos(yaw)*w*.04*t*t],an=yaw+j*2.399,rr=.009*(1-t*.7),flower=[at[0]+Math.sin(an)*rr,at[1]+.002,at[2]+Math.cos(an)*rr];
   b.branch(prev,at,.00055,green,'rachis');prev=at;b.branch(at,flower,.00022,green,'pedicel');
   if(t>.82)b.add(kit.bud,'bud','#a4ac6e',...flower,.0018,.0023,.0018);
   else detailedFlower(b,{x:flower[0],y:flower[1],z:flower[2],r:a.flowerRadius*(.8+.2*Math.sin(Math.PI*t)),color:s.flowerColor,shape:'resedaFlower',palette:{white},petals:a.petals,stamenCount:a.stamenCount,tilt:.9,yaw:an},{...kit,rand});
  }
 }
}

function drawSmallMallows(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,creep=a.architecture==='trailingMallow',green=s.leafColor,leaves=[],flowers=[],n=Math.max(6,Math.round((creep?11:13)*detail));
 for(let i=0;i<n;i++){
  const an=i*2.399,reach=w*(creep?.44:.34)*(.65+rand()*.30),height=h*(creep?.12:.68+rand()*.20),base=[0,.008,0];let prev=base;
  for(let j=1;j<=10;j++){
   const t=j/10,at=[Math.sin(an)*reach*t,height*t+(creep?Math.sin(t*Math.PI)*h*.12:0),Math.cos(an)*reach*t];b.branch(prev,at,Math.max(.0006,(creep?.0022:h*.004)*(1-t*.7)),creep?green:'#9b9b7d',creep?'stem':'wood');prev=at;
   const yaw=an+j*2.399,size=Math.min(creep?.06:.038,w*.14),tip=[at[0]+Math.sin(yaw)*size*.20,at[1]+size*.14,at[2]+Math.cos(yaw)*size*.20];leaves.push({at,tip,yaw,size});
   if(j>2&&j<10){
    const rise=creep?h*(.30+rand()*.45):h*.15,side=[at[0]+Math.sin(yaw)*reach*.20,at[1]+rise,at[2]+Math.cos(yaw)*reach*.20];
    b.branch(at,side,.00065,green,'peduncle');flowers.push({at:side,yaw,bud:rand()>.62});
    if(!creep&&j%2===1){
     const length=w*(.17+rand()*.10),lift=h*(.14+rand()*.08);let previous=at;
     for(let k=1;k<=5;k++){
      const q=k/5,node=[at[0]+Math.sin(yaw)*length*q,at[1]+lift*q,at[2]+Math.cos(yaw)*length*q],ay=yaw+k*2.399,leafSize=size*(.85-k*.045),leafTip=[node[0]+Math.sin(ay)*leafSize*.18,node[1]+leafSize*.13,node[2]+Math.cos(ay)*leafSize*.18];
      b.branch(previous,node,.0008*(1-q*.3),'#9b9b7d','wood');previous=node;leaves.push({at:node,tip:leafTip,yaw:ay,size:leafSize});
      if(k>2){const flower=[node[0]+Math.sin(ay)*.013,node[1]+.016,node[2]+Math.cos(ay)*.013];b.branch(node,flower,.0004,green,'peduncle');flowers.push({at:flower,yaw:ay,bud:k===5});}
     }
    }
   }
  }
 }
 for(const {at,tip,yaw,size} of leaves){b.branch(at,tip,.0006,green,'petiole');b.add(a.leafShape,foliageKind(info),green,...tip,size,size,size,.75,yaw,0);}
 if(s.bloom)for(const {at,yaw,bud:closed} of flowers){
  if(closed){b.add(kit.bud,'bud',green,...at,a.flowerRadius*.29,a.flowerRadius*.40,a.flowerRadius*.29);continue;}
  detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius,color:s.flowerColor,shape:'smallMallow',pattern:a.flowerPattern,patternColor:a.flowerPatternColor,palette:{eye:a.flowerEyeColor||a.flowerPatternColor},tilt:.25,yaw},{...kit,rand});
 }
}

function drawParahebes(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,creeping=a.architecture==='diggerSpeedwell',green=s.leafColor,leaves=[],flowerSites=[],n=Math.max(7,Math.round((creeping?13:18)*detail));
 for(let i=0;i<n;i++){
  const an=i*2.399,reach=w*.43*(.6+rand()*.35),height=h*(creeping?.16:.53)*( .75+rand()*.2);let prev=[0,.006,0];
  for(let j=1;j<=9;j++){
   const t=j/9,at=[Math.sin(an)*reach*t,height*Math.sin(t*1.9),Math.cos(an)*reach*t];b.branch(prev,at,Math.max(.0005,h*.009*(1-t*.6)),creeping?green:a.barkColor,'wood');prev=at;
   for(const side of [-1,1])leaves.push({at,yaw:an+j*Math.PI/2+(side<0?Math.PI:0),size:Math.min(a.leafLength,w*.17)*(.6+rand()*.4),pitch:creeping?.9:.60});
   if(j===6||j===9)flowerSites.push({at,yaw:an+j});
  }
 }
 for(const {at,yaw,size,pitch} of leaves)b.add(a.leafShape,foliageKind(info),green,...at,size,size,size,pitch,yaw,0);
 if(!s.bloom)return;
 for(let i=0;i<flowerSites.length;i++){
  if(!creeping&&i%4!==0&&s.flowerDensity<.5)continue;
  const {at:base,yaw}=flowerSites[i],length=h*(creeping?.76:.55),lean=w*(creeping?.14:.10),nodes=creeping?30:15;let prev=base;
  for(let j=1;j<=nodes;j++){
   const t=j/nodes,at=[base[0]+Math.sin(yaw)*lean*t*t,base[1]+length*(t-.14*t*t),base[2]+Math.cos(yaw)*lean*t*t];b.branch(prev,at,.00055,green,'peduncle');prev=at;
   if(j<3)continue;const aa=yaw+j*2.399,flower=[at[0]+Math.sin(aa)*.013,at[1]+.003,at[2]+Math.cos(aa)*.013];b.branch(at,flower,.00025,green,'pedicel');
   if(t>.82)b.add(kit.bud,'bud',green,...flower,.0012,.0024,.0012);
   else detailedFlower(b,{x:flower[0],y:flower[1],z:flower[2],r:a.flowerRadius,color:s.flowerColor,shape:'parahebeFlower',palette:{white:!creeping},tilt:.8,yaw:aa},{...kit,rand});
  }
 }
}

function drawRedValerian(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,n=Math.max(7,Math.round(14*detail)),heads=[];
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.29*Math.sqrt((i+.5)/n),top=h*(.65+rand()*.27);let prev=[Math.sin(an)*rr*.15,0,Math.cos(an)*rr*.15];
  for(let j=1;j<=7;j++){
   const t=j/7,at=[Math.sin(an)*rr*t,top*t,Math.cos(an)*rr*t];b.branch(prev,at,h*.0034,green,'stem');prev=at;
   if(j<6)for(const side of [-1,1]){
    const yaw=an+j*Math.PI/2+(side<0?Math.PI:0),size=Math.min(.095,w*.26)*(1-t*.44),petiole=j<3?size*.20:0,tip=[at[0]+Math.sin(yaw)*petiole,at[1]+petiole*.4,at[2]+Math.cos(yaw)*petiole];
    if(petiole)b.branch(at,tip,.0007,green,'petiole');b.add(j<3?'narrow':'claspingOvate','leaf',green,...tip,size*(j<3?1.7:.63),size,size,.85,yaw,0);
   }
   if(j>=5){
    const aa=an+j*2.399,reach=w*.10,tip=[at[0]+Math.sin(aa)*reach,at[1]+h*.065,at[2]+Math.cos(aa)*reach];b.branch(at,tip,.0008,green,'peduncle');heads.push({at:tip,yaw:aa,radius:w*(j===7?.10:.055)});
   }
  }
 }
 if(s.bloom)for(const {at,yaw,radius} of heads){
  const count=Math.max(8,Math.round(24*detail));
  for(let k=0;k<5;k++){
   const angle=yaw+k*2.399,offset=k===0?0:radius*.58,center=[at[0]+Math.sin(angle)*offset,at[1]+radius*(k===0?1.15:.45+rand()*.35),at[2]+Math.cos(angle)*offset],clusterRadius=radius*(.42+rand()*.09);
   b.branch(at,center,.00042,green,'peduncle');
   for(let j=0;j<count;j++){
    const t=(j+.5)/count,an=j*2.399,rr=clusterRadius*Math.sqrt(t),tip=[center[0]+Math.sin(an)*rr,center[1]+clusterRadius*.85*Math.sqrt(1-t),center[2]+Math.cos(an)*rr];
    b.branch(center,tip,.00018,green,'pedicel');detailedFlower(b,{x:tip[0],y:tip[1],z:tip[2],r:a.flowerRadius,color:s.flowerColor,shape:'valerianSpur',yaw:an,tilt:.65*Math.sqrt(t)},{...kit,rand});
   }
  }
 }
}

function drawGlobularias(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,woody=a.architecture==='blueEyeShrub',green=s.leafColor,leaves=[],heads=[];
 if(!woody){
  const n=Math.max(5,Math.round(11*detail));
  for(let i=0;i<n;i++){
   const an=i*2.399,rr=w*.30*Math.sqrt((i+.5)/n),base=[Math.sin(an)*rr,.004,Math.cos(an)*rr];
   for(let j=0;j<9;j++){const size=Math.min(.07,w*.22)*(.65+rand()*.35);leaves.push({at:base,shape:'globulariaSpoon',size,yaw:j*2.399,pitch:1.15});}
   if(s.bloom){const top=[base[0]+Math.sin(an)*w*.05,h*(.63+rand()*.27),base[2]+Math.cos(an)*w*.05];b.branch(base,top,.0008,green,'peduncle');
    for(let j=1;j<=5;j++)leaves.push({at:base.map((v,k)=>v+(top[k]-v)*j/7),shape:'narrow',size:.021,yaw:an+j*2.399,pitch:.35});heads.push({at:top,yaw:an});}
  }
 }else{
  for(let i=0;i<5;i++){
   const an=i*2.399,top=[Math.sin(an)*w*.18,h*(.48+rand()*.16),Math.cos(an)*w*.18];b.branch([0,.008,0],top,h*.006,a.barkColor,'wood');
   for(let j=0;j<9;j++){
    const t=.28+j*.075,base=top.map(v=>v*t),aa=an+j*2.399,reach=w*.28*(.65+rand()*.35),tip=[base[0]+Math.sin(aa)*reach,base[1]+h*.28,base[2]+Math.cos(aa)*reach];b.branch(base,tip,h*.0022,a.barkColor,'wood');
    for(let k=0;k<11;k++){const q=.50+k*.045,at=base.map((v,l)=>v+(tip[l]-v)*q);leaves.push({at,shape:'narrow',size:Math.min(.075,w*.16),yaw:aa+k*2.399,pitch:.70});}
    heads.push({at:tip,yaw:aa});
    for(const side of [-1,1]){
     const joint=base.map((v,l)=>v+(tip[l]-v)*.55),yaw=aa+side*1.12,end=[joint[0]+Math.sin(yaw)*w*.16,joint[1]+h*(.12+rand()*.06),joint[2]+Math.cos(yaw)*w*.16];b.branch(joint,end,h*.0009,a.barkColor,'wood');
     for(let k=0;k<8;k++){const q=.4+k*.083,at=joint.map((v,l)=>v+(end[l]-v)*q);leaves.push({at,shape:'narrow',size:Math.min(.06,w*.13),yaw:yaw+k*2.399,pitch:.65});}
     heads.push({at:end,yaw});
    }
   }
  }
 }
 for(const {at,shape,size,yaw,pitch} of leaves)b.add(shape,foliageKind(info),green,...at,size*(woody?1.7:1),size,size,pitch,yaw,0);
 if(s.bloom)for(const {at,yaw} of heads)for(let i=0;i<(woody?3:1);i++){
  const aa=yaw+i*2.399,tip=[at[0]+Math.sin(aa)*(woody?.018:0),at[1]+(woody?.025:0),at[2]+Math.cos(aa)*(woody?.018:0)];
  if(woody)b.branch(at,tip,.00055,green,'pedicel');detailedFlower(b,{x:tip[0],y:tip[1],z:tip[2],r:a.headRadius,color:s.flowerColor,shape:woody?'globulariaEye':'globulariaHead',tilt:.18,yaw:aa},{...kit,rand});
 }
}

function drawReedGrasses(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,annual=a.architecture==='canaryGrass',dry=s.dormant,green=dry?'#aa9c7a':s.leafColor,leafKind=a.leafPattern?patternKind('leaf',a.leafPattern,s.leafPatternColor):foliageKind(info),n=Math.max(8,Math.round((annual?24:38)*detail));
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.29*Math.sqrt((i+.5)/n),base=[Math.sin(an)*rr,0,Math.cos(an)*rr],height=h*(.58+rand()*.37),lean=w*.10*(rand()-.5);let prev=base;
  for(let j=1;j<=7;j++){
   const t=j/7,at=[base[0]+Math.sin(an)*lean*t*t,height*t,base[2]+Math.cos(an)*lean*t*t];b.branch(prev,at,Math.max(.0007,h*.0015),green,'culm');prev=at;
   if(j<7){
    const length=Math.min(annual?.32:.36,h*(annual?.35:.55))*(.7+rand()*.3),yaw=an+(j%2?Math.PI:0);
    if(dry)continue;
    b.add('reedLeaf',leafKind,green,...at,length*(annual?.68:1),length,length,annual?-.15:0,yaw,0);
    b.branch([at[0],at[1]-height*.065,at[2]],at,h*.0022,green,'sheath');
   }
  }
  if(annual&&(s.bloom||s.seedHeads))detailedFlower(b,{x:prev[0],y:prev[1],z:prev[2],r:a.inflorescenceLength/2,color:s.flowerColor,shape:'canarySpike',palette:{dry},yaw:an,tilt:lean},{...kit,rand});
 }
}

function drawCrambes(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,giant=a.architecture==='giantCrambe',green=s.leafColor,leaves=Math.max(8,Math.round(18*detail)),size=Math.min(a.leafLength,w*.33,h*(giant?.32:.69));
 // The large species retains only a short crown during its summer-to-winter rest.
 if(s.dormant){for(let j=0;j<3;j++)b.branch([Math.sin(j*2.4)*.013,0,Math.cos(j*2.4)*.013],[Math.sin(j*2.4)*.018,.018,Math.cos(j*2.4)*.018],.004,'#93816a','crown');return;}
 for(let j=0;j<leaves;j++){
  const yaw=j*2.399,length=size*(.7+rand()*.35),rr=w*.07*Math.sqrt(j/leaves),root=[Math.sin(yaw)*rr,.009,Math.cos(yaw)*rr],at=[root[0]+Math.sin(yaw)*length*.22,length*.14,root[2]+Math.cos(yaw)*length*.22];
  b.branch(root,at,length*.022,green,'petiole');b.add(a.leafShape,'leaf',kit.shade(rand,green,.05),...at,length,length,length,.75+rand()*.60,yaw,(rand()-.5)*.18);
 }
 if(!s.bloom&&!s.seedHeads)return;
 const stems=giant?3:5;
 for(let i=0;i<stems;i++){
  const yaw=i*2.399,base=[Math.sin(yaw)*w*.10,.012,Math.cos(yaw)*w*.10],top=[Math.sin(yaw)*w*.16,h*(giant?.66+rand()*.08:.70+rand()*.18),Math.cos(yaw)*w*.16];b.branch(base,top,h*(giant?.004:.008),green,'stem');
  const arms=giant?12:7;
  for(let j=0;j<arms;j++){
   const t=giant?.58+j*.032:.35+j*.05,root=base.map((v,k)=>v+(top[k]-v)*t),an=yaw+j*2.399,reach=w*(giant?.40:.22)*Math.sqrt(1-j/(arms+1)),end=[root[0]+Math.sin(an)*reach,giant?h*(.58+.27*Math.sqrt(j/arms))+(rand()-.5)*h*.08:root[1]+h*.23,root[2]+Math.cos(an)*reach];b.branch(root,end,giant?.002:.0018,green,'peduncle');
   for(let k=0;k<(giant?9:6);k++){
    const q=giant?.52+k*.060:.28+k*.072,at=root.map((v,n)=>v+(end[n]-v)*q),az=an+(k%2?1:-1)*1.0,radius=w*(giant?.065:.050),tip=[at[0]+Math.sin(az)*radius,at[1]+h*(giant?.08:.05),at[2]+Math.cos(az)*radius];b.branch(at,tip,.0006,green,'peduncle');
    const n=Math.max(4,Math.round((giant?80:10)*detail));
    for(let f=0;f<n;f++){
     const aa=f*2.399,rr=radius*(giant?.36:.48)*Math.sqrt((f+.5)/n),head=[tip[0]+Math.sin(aa)*rr,tip[1]+radius*.4+rand()*.024,tip[2]+Math.cos(aa)*rr];
     if(!giant||f%5===0)b.branch(tip,head,.00013,green,'peduncle');
     if(s.seedHeads&&!s.bloom)b.add(kit.bud,'seed','#9ea983',...head,.0035,.004,.0035);
     else if(giant&&f%32!==0){const r=a.flowerRadius;b.add('tinyCross','petal',s.flowerColor,...head,r,r,r,(rand()-.5)*.6,aa,0);}
     else detailedFlower(b,{x:head[0],y:head[1],z:head[2],r:a.flowerRadius,color:s.flowerColor,shape:'crambeFlower',tilt:.22,yaw:aa},{...kit,rand});
    }
   }
  }
 }
}

function drawFineAnnuals(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,lark=a.architecture==='larkspur',yellow=a.architecture==='yellowNigella',young=!s.bloom&&!s.seedHeads,dry=s.seedHeads&&!s.bloom,green=dry?'#a69b78':s.leafColor,scale=young?.45:1,flowers=[];
 const leafSites=[];const fineLeaf=(at,yaw,size)=>leafSites.push({at,yaw,size,pitch:.8+rand()*.35,fraction:.7+rand()*.3,chance:rand()});
 const shoots=Math.max(4,Math.round((lark?9:yellow?10:15)*detail));
 b.branch([0,.004,0],[0,h*.42*scale,0],h*.0035,green,'stem');
 for(let i=0;i<shoots;i++){
  const yaw=i*2.399,reach=w*(yellow?.18:lark?.28:.36)*Math.sqrt((i+.5)/shoots)*(young?.6:1),top=h*(.55+rand()*.36)*scale,base=h*(.10+(i%4)*.08)*scale;let prev=[0,base,0];
  const nodes=lark?24:9;
  for(let j=1;j<=nodes;j++){
   const t=j/nodes,at=[Math.sin(yaw)*reach*t,base+(top-base)*t,Math.cos(yaw)*reach*t];b.branch(prev,at,Math.max(.0006,h*(yellow?.0038:.0022)*(1-t*.45)),green,'stem');prev=at;
   if(t<(lark?.70:.88)&&(!lark||j%2===0))fineLeaf(at,yaw+j*2.399,Math.min(lark?.06:.09,w*.19));
   if(lark&&t>.37&&!young){
    const aa=yaw+j*2.399,at2=[at[0]+Math.sin(aa)*.025,at[1]+.007,at[2]+Math.cos(aa)*.025];b.branch(at,at2,.00065,green,'peduncle');flowers.push({at:at2,yaw:aa,top:t>.88});
   }else if(!lark&&j===nodes)flowers.push({at,yaw,top:false});
   if(!lark&&!young&&j===6){
    for(const side of [-1,1]){
     const aa=yaw+side*.7,at2=[at[0]+Math.sin(aa)*reach*.35,at[1]+h*.19,at[2]+Math.cos(aa)*reach*.35];b.branch(at,at2,h*.0014,green,'stem');fineLeaf(at2,aa,.035);flowers.push({at:at2,yaw:aa,top:false});
    }
   }
  }
 }
 for(const {at,yaw,size,pitch,fraction,chance} of leafSites){
  if(s.leafDensity===0||chance>(s.leafDensity??1))continue;
  const f=flowerFrame(b,at,pitch,yaw),length=size*fraction;
  f.branch([0,0,0],[0,length,0],.0003,green,'petiole');
  for(let j=1;j<=6;j++)for(const side of [-1,1]){
   const t=j/7,extent=length*(lark?.32:.38)*Math.sin(Math.PI*t),start=[0,length*t,0],end=[side*extent,length*(t+.16),0];
   f.branch(start,end,.00030,green,'leaf');
   for(let k=1;k<=3;k++)for(const sign of [-1,1]){const u=k/4,node=start.map((v,i)=>v+(end[i]-v)*u);f.branch(node,[node[0]+side*length*.08,node[1]+sign*length*.07,.002],.00023,green,'leaf');}
  }
 }
 for(const f of flowers){
  const r=a.flowerRadius||.018;
  if(dry&&lark){b.add(kit.bud,'seed','#b3a17b',...f.at,.003,.010,.003);continue;}
  if(!s.bloom&&!dry)continue;
  if(lark&&f.top){b.add(kit.bud,'bud',s.flowerColor,...f.at,r*.31,r*.44,r*.31);continue;}
  detailedFlower(b,{x:f.at[0],y:f.at[1],z:f.at[2],r,color:s.flowerColor,shape:a.flowerShape,layers:a.flowerLayers||1,pattern:a.flowerPattern,patternColor:a.flowerPatternColor,palette:{dry},tilt:lark?-.14:.12,yaw:f.yaw},{...kit,rand});
 }
}

function drawGlorybowers(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,rose=a.architecture==='roseGlory',veil=a.architecture==='bridalVeil',green=s.leafColor,wood=a.barkColor||'#817761',young=a.stemColor||'#829169',leaves=[],ends=[];
 const leafSize=Math.min(a.leafLength,h*.32,w*.34),kind=a.leafPattern?patternKind('leaf',a.leafPattern,s.leafPatternColor||a.patternColor):foliageKind(info);
 const shoots=Math.max(rose?5:4,Math.round((rose?9:veil?7:13)*detail)),origin=[0,.008,0];
 const pair=(at,yaw,scale=1)=>{for(let side=0;side<2;side++)leaves.push({at,yaw:yaw+side*Math.PI,size:leafSize*scale*(.78+rand()*.23),chance:rand(),pitch:1.05+rand()*.30,shade:rand()});};
 if(!rose)b.branch(origin,[0,h*.42,0],h*.011,wood,a.barkPattern?'wood-'+a.barkPattern:'wood');
 // Branches are generated independently of foliage and flowering month.
 for(let i=0;i<shoots;i++){
  const yaw=i*2.399,rr=w*(rose?.25:.34)*Math.sqrt((i+.7)/shoots),base=rose?[Math.sin(yaw)*rr*.42,.008,Math.cos(yaw)*rr*.42]:[0,h*(.22+(i%3)*.095),0],top=h*(.65+rand()*.25),tip=[Math.sin(yaw)*rr,top,Math.cos(yaw)*rr];let prev=base;
  for(let j=1;j<=7;j++){
   const t=j/7,at=[base[0]+(tip[0]-base[0])*t,base[1]+(tip[1]-base[1])*(veil?Math.sin(t*1.45)/Math.sin(1.45):t),base[2]+(tip[2]-base[2])*t];
   b.branch(prev,at,Math.max(.0008,h*(rose?.006:.004)*(1-t*.7)),j<3?wood:young,j<3&&a.barkPattern?'wood-'+a.barkPattern:'wood');prev=at;
   if(j>1)pair(at,yaw+j*Math.PI/2,j>5?.68:1);
   if(!rose&&j===5){
    const sy=yaw+(i%2?1:-1)*1.1,side=[at[0]+Math.sin(sy)*w*.12,at[1]+h*.11,at[2]+Math.cos(sy)*w*.12];b.branch(at,side,h*.0017,young,'wood');pair(side,sy,.64);ends.push({at:side,yaw:sy,phase:rand()});
   }
  }ends.push({at:tip,yaw,phase:rand()});
 }
 for(const l of leaves){
  if(l.chance>(s.leafDensity??1))continue;
  const size=l.size*(s.leafScale??1),petiole=size*(rose?.28:.09),at=[l.at[0]+Math.sin(l.yaw)*petiole,l.at[1]+petiole*.30,l.at[2]+Math.cos(l.yaw)*petiole];
  b.branch(l.at,at,Math.max(.0002,size*.011),young,'petiole');
  b.add(a.leafShape,kind,kit.shade(()=>l.shade,green,.045),...at,size*(rose||veil?1:.65),size,size,l.pitch,l.yaw,0);
 }
 if(!s.bloom)return;
 for(const f of ends){
  const r=a.flowerRadius,head=rose?.075:.06,axis=veil?Math.min(.25,h*.28):0,count=Math.max(veil?10:rose?36:7,Math.round((veil?25:rose?110:15)*detail));
  if(veil){
   let prev=f.at;
   for(let j=1;j<=12;j++){const t=j/12,at=[f.at[0]+Math.sin(f.yaw)*axis*.26*t,f.at[1]-axis*t,f.at[2]+Math.cos(f.yaw)*axis*.26*t];b.branch(prev,at,.0008,'#995c62','peduncle');prev=at;}
  }
  for(let j=0;j<count;j++){
   const t=(j+.5)/count,an=j*2.399,rr=head*Math.sqrt(t),center=veil?[f.at[0]+Math.sin(f.yaw)*axis*.26*t,f.at[1]-axis*t,f.at[2]+Math.cos(f.yaw)*axis*.26*t]:f.at;
   const at=[center[0]+Math.sin(an)*rr*(veil?.55:1),center[1]+(veil?-.01:head*(.65+Math.sqrt(1-t)*.6)),center[2]+Math.cos(an)*rr*(veil?.55:1)];
   b.branch(center,at,.00055,rose?'#9b5772':veil?'#996467':'#81936c','peduncle');
   if(rose&&j%5===0){b.add(kit.bud,'bud','#a54a79',...at,r*.48,r*.65,r*.48);continue;}
   if(rand()>(s.flowerDensity??1))continue;
   detailedFlower(b,{x:at[0],y:at[1],z:at[2],r,color:s.flowerColor,shape:a.flowerShape,tilt:veil?1.5:rose?.3:1.05,yaw:an},{...kit,rand});
  }
 }
}

function drawBlueberries(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,small=a.leafLength<.02,column=a.habit==='columnar',upright=a.habit==='upright',wood=a.barkColor||'#918a79',young=a.stemColor||'#99946e',size=Math.min(a.leafLength,h*.20,w*.16),leaves=[],clusters=[];
 const mix=(p,q,t)=>p.map((v,i)=>v+(q[i]-v)*t),segment=(p,q,r)=>b.branch(p,q,r,wood,a.barkPattern?'wood-'+a.barkPattern:'wood');
 // Persistent canes and their lateral fruiting twigs are built independently of season.
 const canes=small?16:7;
 for(let i=0;i<canes;i++){
  const an=i*2.399+rand()*.35,radial=Math.sqrt((i+.5)/canes),reach=w*(column?.13:upright?.15+.11*radial:.15+.18*radial)*(.8+rand()*.20),top=h*(column?.68+rand()*.21:upright?.59+.30*Math.sqrt(1-radial*radial):.40+.48*Math.sqrt(1-radial*radial)),base=[Math.sin(an)*w*.025,0,Math.cos(an)*w*.025];let prev=base;
  for(let j=1;j<=8;j++){
   const t=j/8,node=[Math.sin(an)*reach*t,top*t,Math.cos(an)*reach*t];segment(prev,node,h*.009*(1-t*.83));prev=node;
   if(j<2)continue;
   for(let side=0;side<(small?4:3);side++){
    const yaw=an+j*2.399+side*1.9,len=w*(column?.10:small?.14:.17)*(.7+rand()*.4),tip=[node[0]+Math.sin(yaw)*len,node[1]+h*(column?.15:upright?.11:small?.08:.075),node[2]+Math.cos(yaw)*len];let old=node;
    const nodes=small?12:10;
    for(let k=1;k<=nodes;k++){
     const tt=k/nodes,at=mix(node,tip,tt);at[1]+=Math.sin(tt*Math.PI)*h*.015;segment(old,at,h*.0015*(1-tt*.7));old=at;
     leaves.push({at,yaw:yaw+(k%2?1:-1)*1.1+rand()*.3,size:size*(.70+rand()*.3),chance:rand(),shade:rand(),young:k>7,pitch:.65+rand()*.65});
     if(k%3===0){
      const da=yaw+(k%2?1:-1)*1.05,end=[at[0]+Math.sin(da)*len*.50,at[1]+h*.045,at[2]+Math.cos(da)*len*.50];segment(at,end,h*.0006);
      for(let q=1;q<=6;q++)leaves.push({at:mix(at,end,q/6),yaw:da+(q%2?1:-1)*1.2,size:size*(.70+rand()*.3),chance:rand(),shade:rand(),young:q===6,pitch:.65+rand()*.65});
     }
    }
    clusters.push({at:mix(node,tip,.88),yaw,chance:rand(),count:small?3:5+Math.floor(rand()*4),phase:rand()});
   }
  }
 }
 for(const l of leaves){
  if(l.chance>s.leafDensity)continue;
  const at=[l.at[0]+Math.sin(l.yaw)*size*.10,l.at[1]+size*.035,l.at[2]+Math.cos(l.yaw)*size*.10],color=l.young&&s.springFlush?a.springShootColor:s.leafColor;
  b.branch(l.at,at,size*.013,young,'petiole');b.add('blueberryLeaf',small?'leaf-blueberry-wax':foliageKind(info),kit.shade(()=>l.shade,color,.055),...at,l.size,l.size,l.size,l.pitch,l.yaw,0);
 }
 if(!s.bloom&&!s.fruitStage)return;
 for(const c of clusters){
  if(c.chance>(small?.38:.6))continue;
  const radius=a.flowerRadius,fruitR=a.fruitRadius,len=small?.018:.042;
  for(let j=0;j<c.count;j++){
   const an=c.yaw+j*2.399,t=(j+.5)/c.count,from=[c.at[0]+Math.sin(c.yaw)*len*t*.45,c.at[1]-len*t*.25,c.at[2]+Math.cos(c.yaw)*len*t*.45],at=[from[0]+Math.sin(an)*len*.4,from[1]-len*(.35+t*.32),from[2]+Math.cos(an)*len*.4];
   b.branch(c.at,from,.00055,young,'flowerStem');b.branch(from,at,.00035,young,'pedicel');
   if(s.bloom){detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:radius*(.90+.10*Math.sin(j)**2),shape:'blueberryUrn',color:info.flower,tilt:Math.PI-.12,yaw:an},{...kit,rand});continue;}
   // Individual berries ripen unevenly within one cluster; the five calyx lobes remain.
   const mature=s.fruitStage==='ripe'&&((j+c.phase*5)%5)>1.1,r=fruitR*(mature?1:.74),color=mature?a.fruitColor:j%3===0?'#b69b9e':'#b8c0a0',frame=flowerFrame(b,at,Math.PI-.35,an);
   frame.add('blueberryFruit',mature?'fruit-blueberry-wax':'fruit',color,0,r*.65,0,r,r,r);
   frame.add(kit.bud,'fruitCalyx',mature?'#41434f':'#907c70',0,r*1.42,0,r*.34,r*.075,r*.34);
   for(let k=0;k<5;k++)frame.add('narrow','fruitCalyx',mature?'#57606c':'#97a580',Math.sin(k*TAU/5)*r*.29,r*1.44,Math.cos(k*TAU/5)*r*.29,r*.52,r*.56,r*.56,.72,k*TAU/5,0);
  }
 }
}

function drawEricaceousShrubs(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,arch=a.architecture,az=arch==='fineAzalea',pieris=arch==='terminalPieris',kalmia=arch==='kalmiaCluster',enk=arch==='tieredEnkianthus',leuco=arch==='archingLeucothoe',column=a.habit==='columnar';
 const wood=a.barkColor||'#8a7564',young=a.stemColor||wood,woodKind=a.barkPattern?'wood-'+a.barkPattern:'wood',leafSize=Math.min(a.leafLength||.08,h*.22,w*.23),leaves=[],ends=[],axils=[];
 const mix=(p,q,t)=>p.map((x,i)=>x+(q[i]-x)*t),curve=(points,r)=>{for(let k=1;k<points.length;k++)b.branch(points[k-1],points[k],Math.max(.0004,r*(1-k/points.length*.78)),wood,woodKind);};
 const addLeaf=(at,yaw,size,youngLeaf=false)=>leaves.push({at,yaw,size,pitch:1.08+rand()*.78,roll:(rand()-.5)*.3,chance:rand(),shade:rand(),young:youngLeaf});
 // Build the persistent branch graph first. Random draws here never depend on month.
 if(leuco){
  const count=Math.max(9,Math.round(18*detail));
  for(let i=0;i<count;i++){
   const an=i*2.399+rand()*.32,reach=w*(.20+.23*rand()),peak=h*(.54+.39*rand()),points=[];
   for(let k=0;k<=10;k++){const t=k/10;points.push([Math.sin(an)*reach*t,peak*Math.sin(t*1.82),Math.cos(an)*reach*t]);}
   curve(points,h*.0055);
   for(let k=3;k<=10;k++){
    const at=points[k],yaw=an+(k%2?1:-1)*1.16;addLeaf(at,yaw,leafSize*(.72+rand()*.3),k>8);
    if(k%2===1){
     const side=an+(k%4===1?1:-1)*1.1,tip=[at[0]+Math.sin(side)*w*.11,at[1]+h*.05,at[2]+Math.cos(side)*w*.11];curve([at,mix(at,tip,.54),tip],h*.0015);
     for(let j=1;j<=5;j++)addLeaf(mix(at,tip,j/5),side+(j%2?1:-1)*1.05,leafSize*(.66+rand()*.25),j===5);
    }
    if(k===5||k===8)axils.push({at,yaw:an,chance:rand()});
   }
  }
 }else{
  const roots=4,tiers=4,twigs=Math.max(2,Math.round(Math.min(7,(az?5:3)*Math.sqrt(Math.max(.8,w/.85)))*detail));
  for(let root=0;root<roots;root++){
   const angle=root*2.399+rand()*.3,lean=w*(column?.065:.12),height=h*(.61+.20*rand()),base=[Math.sin(angle)*w*.03,0,Math.cos(angle)*w*.03],middle=[-Math.sin(angle)*lean*.17,height*.20,Math.cos(angle)*lean*.25],top=[Math.sin(angle)*lean,height,Math.cos(angle)*lean];
   curve([base,middle,top],h*(enk?.010:.013));
   for(let shoot=0;shoot<3;shoot++){
    const yaw=angle+shoot*2.1,tip=[top[0]+Math.sin(yaw)*w*.045,top[1]+h*(.035+.04*rand()),top[2]+Math.cos(yaw)*w*.045];curve([top,mix(top,tip,.53),tip],h*.0013);
    for(let k=0;k<(az?9:7);k++)addLeaf(mix(top,tip,.54+k*.055),yaw+k*2.399,leafSize*(.66+rand()*.32),k>4);
    ends.push({at:tip,yaw,chance:rand(),shade:rand(),size:.88+rand()*.22});
   }
   for(let tier=0;tier<tiers;tier++){
    const t=.06+(tier+.20)/tiers*.82,start=mix(middle,top,t),yaw=angle+tier*2.16+rand()*.48,reach=w*(column?.19:.25)*(1-t*.34),rise=h*(enk?.025:.09)*(.65+rand()*.5),end=[start[0]+Math.sin(yaw)*reach,start[1]+rise,start[2]+Math.cos(yaw)*reach];
    const elbow=mix(start,end,.51);elbow[1]+=h*.025;curve([start,elbow,end],h*.0038);
    for(let j=0;j<twigs;j++){
     const from=mix(elbow,end,(j+.25)/twigs),direction=yaw+(j%2?1:-1)*(.72+rand()*.66),length=w*(az?.080:enk?.10:.095)*(.8+rand()*.25),tip=[from[0]+Math.sin(direction)*length,from[1]+h*(enk?.07:.085)*(.6+rand()*.6),from[2]+Math.cos(direction)*length];
     const joint=mix(from,tip,.5);joint[1]+=h*.015;curve([from,joint,tip],h*.0013);
     // Alternate leaves are crowded on the short terminal internodes; older
     // leaves sit farther back, leaving the fork structure visible between sprays.
     const nodes=az?11:enk?6:pieris?11:9;
     for(let k=0;k<nodes;k++){
      const t=az?.28+.70*k/nodes:.57+.40*k/nodes,at=mix(from,tip,t),an=direction+k*2.399;
      addLeaf(at,an,leafSize*(.68+rand()*.35),k>nodes-3);
     }
     ends.push({at:tip,yaw:direction,chance:rand(),shade:rand(),size:.88+rand()*.22});
    }
   }
  }
 }
 const leafKind=foliageKind(info);
 for(const l of leaves){
  if(s.retainedSummerLeaves?!l.young:l.chance>(s.leafDensity??1))continue;
  const length=l.size*(s.retainedSummerLeaves?a.winterLeafLength/a.leafLength:s.leafScale??1),color=l.young&&s.springFlush&&a.springShootColor?a.springShootColor:s.leafColor,at=[l.at[0]+Math.sin(l.yaw)*length*.11,l.at[1]+length*.025,l.at[2]+Math.cos(l.yaw)*length*.11];
  b.branch(l.at,at,Math.max(.00012,length*.013),young,'petiole');b.add(a.leafShape,leafKind,kit.shade(()=>l.shade,color,.065),...at,length,length,length,l.pitch,l.yaw,l.roll);
 }
 function raceme(at,yaw,chance){
  const clusters=pieris?4:1;
  for(let group=0;group<clusters;group++){
   const an=yaw+(group-(clusters-1)/2)*.58,len=Math.min(a.inflorescenceLength||.085,h*.23),count=enk?8:14;let prev=at;
   for(let j=0;j<count;j++){
    const t=(j+1)/count,node=[at[0]+Math.sin(an)*len*t,at[1]+len*(.22*t-.82*t*t),at[2]+Math.cos(an)*len*t];
    b.branch(prev,node,.0005,young,'flowerStem');prev=node;
    for(let side=0;side<(enk?1:2);side++){
     const aa=an+(side?1:-1)*1.1,flowerAt=[node[0]+Math.sin(aa)*len*.10,node[1]-len*.15,node[2]+Math.cos(aa)*len*.10],r=a.flowerRadius*(.8+.2*Math.sin(j*2.2+group)**2);
     b.branch(node,flowerAt,.00028,young,'pedicel');
     if(s.bloom)detailedFlower(b,{x:flowerAt[0],y:flowerAt[1],z:flowerAt[2],r,color:info.flower,shape:a.flowerShape,palette:a.flowerPalette,tilt:Math.PI-.10,yaw:aa},{...kit,rand});
     else if(s.flowerBuds)b.add(kit.bud,'flowerBud',a.flowerPalette?.bud||'#9f9776',...flowerAt,r*.56,r*.80,r*.56);
     else if(s.seedHeads)b.add(kit.bud,'seed','#967e5d',...flowerAt,r*.56,r*.64,r*.56);
    }
   }
  }
 }
 if(leuco){if(s.bloom)for(const f of axils)if(f.chance<.5*s.flowerDensity)raceme(f.at,f.yaw,f.chance);return;}
 for(const tip of ends){
  if(pieris||enk){if((s.bloom||s.flowerBuds||s.seedHeads)&&tip.chance<(pieris?.38:.60))raceme(tip.at,tip.yaw,tip.chance);continue;}
  if(!s.bloom){
   if(s.flowerBuds&&tip.chance<.6){
    const size=Math.min(az?.006:.013,h*.033),f=flowerFrame(b,tip.at,.18,tip.yaw);f.add(kit.bud,'flowerBud','#9b9b66',0,size*.45,0,size*.52,size,size*.52);
    for(let k=0;k<16;k++){const t=k/16,an=k*2.399,rad=size*.40*Math.sin(Math.PI*(t*.80+.08));f.add('petal','budScale',k%2?'#a5a377':'#938669',Math.sin(an)*rad,size*(t*1.4-.2),Math.cos(an)*rad,size*.47,size*.66,size*.47,.15,an,0);}
   }continue;
  }
  if(tip.chance>(az?.78:.58)*s.flowerDensity)continue;
  const count=a.flowerPalette?.count||(kalmia?19:12),head=Math.min(a.headRadius||(kalmia?.055:.065),h*.15,w*.17),radius=Math.min(a.flowerRadius,h*.1),base=tip.at;
  for(let j=0;j<count;j++){
   const t=(j+.5)/count,an=j*2.399+tip.yaw,tilt=.22+Math.sqrt(t)*1.18,rr=head*Math.sqrt(t),at=[base[0]+Math.sin(an)*rr,base[1]+head*.65*Math.sqrt(1-t),base[2]+Math.cos(an)*rr];b.branch(base,at,.00065,young,'pedicel');
   if(kalmia&&j%6===0){b.add('kalmiaBud','flowerBud',a.flowerPalette.bud,...at,radius*.80,radius*1.4,radius*.80,.3,an,0);continue;}
   const fc=a.flowerFadeTo&&j%4!==0?a.flowerFadeTo:info.flower;
   detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:radius*tip.size,color:fc,shape:a.flowerShape,pattern:a.flowerPattern,patternColor:a.flowerPatternColor,palette:a.flowerPalette,stamenCount:a.stamenCount,tilt,yaw:an},{...kit,rand});
  }
 }
}

function drawVineAndSpikeAnnuals(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,arch=a.architecture,leafKind=foliageKind(info),size=Math.min(a.leafLength,h*.40,w*.32);
 if(arch==='morningGlory'){
  // The visible support is an example of training, not a naturally rigid stem.
  const andon=!!a.flowerPalette?.andon;
  if(andon){
   for(let i=0;i<3;i++){const an=i*TAU/3;b.branch([Math.sin(an)*w*.30,0,Math.cos(an)*w*.30],[Math.sin(an)*w*.30,h,Math.cos(an)*w*.30],.0035,'#a7a082','support');}
   for(const t of [.32,.62,.92])for(let j=0;j<40;j++){const an=j*TAU/40,an2=(j+1)*TAU/40;b.branch([Math.sin(an)*w*.30,h*t,Math.cos(an)*w*.30],[Math.sin(an2)*w*.30,h*t,Math.cos(an2)*w*.30],.002,'#aaa38a','support');}
  }else{
   for(const x of [-w*.30,w*.30])b.branch([x,0,0],[x,h,0],.0035,'#a7a082','support');
   for(let k=1;k<7;k++)b.branch([-w*.30,h*k/7,0],[w*.30,h*k/7,0],.002,'#aaa38a','support');
  }
  for(let i=0;i<4;i++){
   let prev=[(i-1.5)*w*.10,.005,0];const baseX=andon?Math.sin(i*TAU/3)*w*.30:(i%2?1:-1)*w*.30,baseZ=andon?Math.cos(i*TAU/3)*w*.30:0;
   for(let j=1;j<=28;j++){
    const t=j/28,turn=i*1.3+t*TAU*5,at=[baseX+Math.sin(turn)*.012,h*t*.96,baseZ+Math.cos(turn)*.014];b.branch(prev,at,.0018,a.stemColor,'vine');prev=at;
    if(j%2)continue;
    const outward=turn+i,reach=w*(.13+.08*rand()),len=size*(.58+.42*Math.sin(t*Math.PI*.86)),leafAt=[at[0]+Math.sin(outward)*reach,at[1]+len*.14,at[2]+Math.cos(outward)*reach];
    b.branch(at,leafAt,.0011,green,'petiole');b.add(a.leafShape,leafKind,kit.shade(rand,green,.055),...leafAt,len,len,len,.65+rand()*.55,outward,(rand()-.5)*.25);
    if(!s.bloom||j<8||j%4)continue;
    const turnF=outward+.75,tip=[at[0]+Math.sin(turnF)*reach,at[1]+h*.018,at[2]+Math.cos(turnF)*reach];b.branch(at,tip,.0012,green,'peduncle');
    if(j===28){b.add('tube','flowerBud',green,...tip,.012,a.flowerRadius*.9,.012,.35,turnF,0);continue;}
    detailedFlower(b,{x:tip[0],y:tip[1],z:tip[2],r:a.flowerRadius*(.85+.15*rand()),color:s.flowerColor,shape:a.flowerShape,palette:a.flowerPalette,tilt:.70+rand()*.40,yaw:turnF},{...kit,rand});
   }
  }return;
 }
 if(arch==='nasturtium'){
  const count=Math.round((a.habit==='creeping'?18:13)*detail);
  for(let i=0;i<count;i++){
   const angle=i*2.399,reach=w*(.17+.29*Math.sqrt((i+.5)/count));let prev=[Math.sin(angle)*w*.02,.008,Math.cos(angle)*w*.02];
   for(let j=1;j<=10;j++){
    const t=j/10,turn=angle+.14*Math.sin(j*1.6),at=[Math.sin(turn)*reach*t,h*(.035+.20*Math.sin(t*Math.PI)),Math.cos(turn)*reach*t];b.branch(prev,at,.0025,a.stemColor,'creepingStem');prev=at;
    const yaw=angle+j*2.399,len=size*(.55+.45*rand()),petiole=h*(.16+.36*rand()),tip=[at[0]+Math.sin(yaw)*len*.45,at[1]+petiole,at[2]+Math.cos(yaw)*len*.45];
    b.branch(at,tip,.0014,green,'petiole');b.add('nasturtiumShield','leaf-nasturtium',kit.shade(rand,green,.05),...tip,len*.5,len*.5,len*.5,.06+rand()*.42,yaw,(rand()-.5)*.28);
    if(!s.bloom||j<4||j%3)continue;
    const flowerAt=[at[0]+Math.sin(yaw+.9)*len*.7,at[1]+h*(.46+.25*rand()),at[2]+Math.cos(yaw+.9)*len*.7];b.branch(at,flowerAt,.0012,green,'peduncle');
    const stage=(i+j)%3,faded=stage===2,fc=faded?a.flowerFadeTo:s.flowerColor,palette={...a.flowerPalette,faded:a.flowerPalette?.orchid&&stage!==1};
    detailedFlower(b,{x:flowerAt[0],y:flowerAt[1],z:flowerAt[2],r:a.flowerRadius*(.81+.19*rand()),color:fc,shape:a.flowerShape,layers:a.flowerLayers,palette,tilt:-.55+rand()*.34,yaw},{...kit,rand});
   }
  }return;
 }
 const snap=arch==='snapdragon',compact=h<.35,count=Math.round((snap?compact?18:12:13)*detail);
 for(let i=0;i<count;i++){
  const angle=i*2.399,reach=w*(.06+.29*Math.sqrt((i+.5)/count)),height=h*(snap?.49+.14*rand():.62+.21*rand()),nodes=snap?8:6;let prev=[Math.sin(angle)*w*.04,.003,Math.cos(angle)*w*.04];const points=[];
  for(let j=1;j<=nodes;j++){
   const t=j/nodes,at=[Math.sin(angle)*reach*t,height*t,Math.cos(angle)*reach*t];b.branch(prev,at,snap?.0017:.0012,a.stemColor,'stem');prev=at;points.push(at);
   for(let side=0;side<(!snap||j<5?2:1);side++){
    const turn=angle+j*Math.PI/2+side*Math.PI,len=size*(.62+.38*Math.sin(t*Math.PI));b.add(a.leafShape,leafKind,kit.shade(rand,green,.04),...at,len,len,len,snap?.59:.38,turn,(rand()-.5)*.18);
   }
  }
  if(!s.bloom)continue;
  if(snap){
   const spike=h*(compact?.36:.33),top=[prev[0],height+spike,prev[2]];b.branch(prev,top,.0015,a.stemColor,'rachis');
   for(let j=0;j<13;j++){
    const t=j/12,an=angle+j*2.399,rr=a.flowerRadius*.42,at=[prev[0]+Math.sin(an)*rr,height+spike*t,prev[2]+Math.cos(an)*rr],r=a.flowerRadius*(1-.25*t);
    if(j>9){b.add(kit.bud,'flowerBud',j>11?green:a.flowerPalette.tube,...at,r*.36,r*.53,r*.36,.18,an,0);continue;}
    b.branch([prev[0],at[1],prev[2]],at,.00055,green,'pedicel');detailedFlower(b,{x:at[0],y:at[1],z:at[2],r,color:s.flowerColor,shape:a.flowerShape,palette:a.flowerPalette,tilt:-.30,yaw:an},{...kit,rand});
   }
  }else for(let k=0;k<3;k++){
   const turn=angle+(k-1)*.95,base=points[points.length-1-k],at=[base[0]+Math.sin(turn)*w*.12,base[1]+h*(.12+.06*rand()),base[2]+Math.cos(turn)*w*.12];b.branch(base,at,.0009,green,'peduncle');
   if((i+k)%6===0){b.add('tube','flowerBud',green,...at,.009,.024,.009);continue;}
   detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius*(.86+.14*rand()),color:s.flowerColor,shape:a.flowerShape,tilt:.16+rand()*.55,yaw:turn},{...kit,rand});
  }
 }
}

function drawSunspot(b,{info,s,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,ll=Math.min(a.leafLength,w*.55,h*.25),stem=Math.min(.012,h*.011),tip=[h*.014,h*.92,0];
 let prev=[0,0,0];
 for(let j=1;j<=14;j++){
  const t=j/14,at=[Math.sin(t*2)*h*.016,h*t*.92,0];b.branch(prev,at,stem*(1-t*.50),green,'stem');prev=at;
  if(j===14)continue;
  const count=j<4?2:1;
  for(let k=0;k<count;k++){
   const an=j*2.399+k*Math.PI,len=ll*(.44+.56*Math.sin(Math.PI*(t*.88+.03))),reach=len*.40,leafAt=[at[0]+Math.sin(an)*reach,at[1]+len*.14,Math.cos(an)*reach];
   b.branch(at,leafAt,stem*.16,green,'petiole');b.add('sunflowerLeaf','leaf-woolly',kit.shade(rand,green,.07),...leafAt,len,len,len,1.03+(rand()-.5)*.25,an,.10*Math.sin(j));
  }
 }
 const r=Math.min(a.flowerRadius,w*.34,h*.20);b.branch(prev,tip,stem*.5,green,'peduncle');
 if(s.bloom)detailedFlower(b,{x:tip[0],y:tip[1],z:tip[2],r,color:s.flowerColor,shape:'sunflowerHead',tilt:1.20,yaw:.22},{...kit,rand});
 else if(s.month<=7){const f=flowerFrame(b,tip,.42,.22);f.add(kit.bud,'flowerBud','#6c8450',0,r*.11,0,r*.33,r*.37,r*.33);for(let j=0;j<20;j++)f.add('sunflowerBract','involucre',green,0,0,0,r*.58,r*.58,r,.48,j*2.399,0);}
}

function drawGardenFlowerForms(b,{info,s,p,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,h=s.height,w=s.spread,arch=a.architecture,green=s.leafColor,kind=foliageKind(info),ll=Math.min(a.leafLength,h*.72,w*.48);
 const leaf=(at,turn,len=ll,pitch=1.1,shape=a.leafShape)=>b.add(shape,kind,kit.shade(rand,green,.045),...at,len,len,len,pitch,turn,(rand()-.5)*.15);
 const flower=(at,yaw,options={})=>detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius,color:s.flowerColor,shape:a.flowerShape,layers:a.flowerLayers||1,palette:a.flowerPalette,tilt:.18,yaw,...options},{...kit,rand});
 if(arch==='creamFalls'){
  const cold=[10,11,12,1,2].includes(s.month),n=Math.round(170*detail);
  for(let i=0;i<n;i++){
   const an=i*2.399,t=(i+.5)/n,dry=cold||i%5===0&&s.month<=5,reach=w*(.17+.29*Math.sqrt(t)),top=h*(.27+.27*rand())*(1-t*.20);
   b.add('grassRibbon','leaf-grass',kit.shade(rand,dry?'#b5a680':green,.05),Math.sin(an)*w*.04,.005,Math.cos(an)*w*.04,.0027,top/.84,reach/.98,0,an,0);
  }
  if(!s.bloom&&!s.seedHeads)return;
  for(let i=0;i<Math.round(24*detail);i++){
   const an=i*2.399,reach=w*(.10+.28*Math.sqrt((i+.5)/24)),top=h*(.60+.29*rand()),base=[Math.sin(an)*w*.03,.008,Math.cos(an)*w*.03],tip=[Math.sin(an)*reach,top,Math.cos(an)*reach],dry=!s.bloom,color=dry?'#b7aa87':s.flowerColor;
   b.branch(base,tip,.00085,dry?'#ae9f7a':'#859366','culm');const f=flowerFrame(b,tip,.55+rand()*.26,an),len=a.inflorescenceLength*(.85+.25*rand());
   f.branch([0,0,0],[0,len,0],.00065,color,'rachis');
   for(let j=0;j<100;j++){
    const t=(j+.5)/100,turn=j*2.399,radius=len*.27*Math.pow(Math.sin(Math.PI*t),.55),at=[Math.sin(turn)*radius*.20,len*t,Math.cos(turn)*radius*.20];
    f.add(kit.bud,dry?'seed':'spikelet',color,...at,.0009,.002,.0009);
    for(let k=0;k<7;k++){
     const yaw=turn+(k-3)*.31,end=[at[0]+Math.sin(yaw)*radius,at[1]+len*(.11+.05*rand()),at[2]+Math.cos(yaw)*radius];
     f.branch(at,end,.00010,color,dry?'seedBristle':'bristle');
    }
   }
  }return;
 }
 if(arch==='doublePortulaca'){
  for(let i=0;i<Math.round(28*detail);i++){
   const an=i*2.399,reach=w*(.12+.32*Math.sqrt((i+.5)/28));let prev=[0,.005,0];
   for(let j=1;j<=9;j++){
    const t=j/9,at=[Math.sin(an)*reach*t,h*(.08+.28*Math.sin(t*Math.PI*.85)),Math.cos(an)*reach*t];b.branch(prev,at,.0019,a.stemColor,'succulentStem');prev=at;
    for(let k=0;k<3;k++)leaf(at,an+j*2.399+k*TAU/3,ll*(.65+.30*rand()),.52+rand()*.35);
    if(j===5||j===8){const turn=an+(j===5?1:-1)*.70,end=[at[0]+Math.sin(turn)*w*.06,at[1]+h*.25,at[2]+Math.cos(turn)*w*.06];b.branch(at,end,.0014,a.stemColor,'succulentStem');for(let k=0;k<5;k++)leaf(end,turn+k*2.399,ll*.78,.76);
     if(s.bloom&&(i+j)%5!==0){const color=a.flowerPalette.mermaid?'#c060a0':(i+j)%3===0?'#d1a5bd':'#e4d9d5';flower(end,turn,{color,tilt:.12+rand()*.30});}
     else if(s.bloom)b.add(kit.bud,'flowerBud','#91a065',...end,.005,.007,.005);
    }
   }
  }return;
 }
 if(arch==='summerHollyhock'||arch==='pacificDelphinium'){
  const holly=arch==='summerHollyhock',n=holly?3:4;
  for(let i=0;i<n;i++){
   const an=i*2.399,reach=w*(i===0?.03:.18),height=h*(i===0?.94:holly?.73:.68+.17*rand()),base=[Math.sin(an)*w*.03,.005,Math.cos(an)*w*.03];let prev=base;
   for(let j=1;j<=14;j++){
    const t=j/14,at=[Math.sin(an)*reach*t,height*t,Math.cos(an)*reach*t];b.branch(prev,at,(holly?.006:.004)*(1-t*.70),a.stemColor,'stem');prev=at;
    const turn=an+j*2.399;
    if(j<(holly?12:7)){
     const len=ll*(1-t*(holly?.64:.62)),pet=len*(holly?.50:.75),end=[at[0]+Math.sin(turn)*pet,at[1]+pet*.18,at[2]+Math.cos(turn)*pet];b.branch(at,end,.0011,green,'petiole');leaf(end,turn,len,1.10);
    }
    if(!s.bloom||j<(holly?5:7))continue;
    const r=a.flowerRadius*(.80+.20*(1-t)),end=[at[0]+Math.sin(turn)*r*.55,at[1]+r*.13,at[2]+Math.cos(turn)*r*.55];b.branch(at,end,.0012,green,'pedicel');
    if(j>12){b.add(kit.bud,'flowerBud',green,...end,r*.25,r*.35,r*.25);continue;}
    const layers=holly&&a.flowerPalette?.mixedLayers&&p.id%2===0?1:a.flowerLayers;
    flower(end,turn,{r,layers,tilt:holly?1.12:-.15});
    if(!holly){const turn2=turn+Math.PI,at2=[at[0]+Math.sin(turn2)*r*.56,at[1]+h*.018,at[2]+Math.cos(turn2)*r*.56];b.branch(at,at2,.0009,green,'pedicel');flower(at2,turn2,{r:r*.93,tilt:-.20});}
   }
  }
  for(let j=0;j<14;j++)leaf([Math.sin(j*2.399)*w*.04,.009,Math.cos(j*2.399)*w*.04],j*2.399,ll*(.70+.30*rand()),1.12+rand()*.30);
  return;
 }
 const scab=arch==='annualScabiosa',shasta=arch==='shastaAlaska',yellow=arch==='uprightYellow',oen=arch==='pinkEveningPrimrose',winter=shasta&&[12,1,2].includes(s.month);
 if(scab||shasta||yellow)for(let i=0;i<Math.round((shasta?32:22)*detail);i++){
  const an=i*2.399,r=w*.15*Math.sqrt((i+.5)/32);leaf([Math.sin(an)*r,.006,Math.cos(an)*r],an,ll*(.72+.28*rand()),1.14+rand()*.25,scab?'scabiosaBasal':a.leafShape);
 }
 if(winter)return;
 for(let i=0;i<Math.round((scab?20:shasta?21:yellow?27:26)*detail);i++){
  const an=i*2.399,reach=w*(.06+.30*Math.sqrt(rand())),height=h*(scab?.38+.16*rand():shasta?.70+.18*rand():yellow?.42+.14*rand():.55+.20*rand()),base=[Math.sin(an)*w*.035,.003,Math.cos(an)*w*.035];let prev=base;
  for(let j=1;j<=6;j++){
   const t=j/6,at=[Math.sin(an)*reach*t,height*t,Math.cos(an)*reach*t];b.branch(prev,at,shasta?.0018:yellow?.0014:.0011,a.stemColor,'stem');prev=at;
   for(let side=0;side<(scab?2:1);side++)leaf(at,an+j*(scab?Math.PI/2:2.399)+side*Math.PI,ll*(1-t*.48),.91+rand()*.2);
   if(oen&&j>=4&&s.bloom){const turn=an+j*2.399,end=[at[0]+Math.sin(turn)*.022,at[1]+.019,at[2]+Math.cos(turn)*.022];b.branch(at,end,.00075,green,'pedicel');flower(end,turn,{tilt:.28+rand()*.55,r:a.flowerRadius*(.82+.18*rand())});}
  }
  if(!s.bloom||oen)continue;
  for(let k=0;k<(shasta?1:3);k++){
   const turn=an+(k-1)*.76,length=h*(scab?.28+.15*rand():yellow?.28+.11*rand():.04+.07*rand()),end=[prev[0]+Math.sin(turn)*w*.07,prev[1]+length,prev[2]+Math.cos(turn)*w*.07];b.branch(prev,end,.0009,green,'peduncle');
   if((i+k)%7===0){b.add(kit.bud,'flowerBud',green,...end,a.flowerRadius*.23,a.flowerRadius*.27,a.flowerRadius*.23);continue;}
   flower(end,turn,{r:a.flowerRadius*(.85+.15*rand()),tilt:.08+rand()*.30});
  }
 }
}

function drawFruitAndLeafPlants(b,{info,s,p,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,arch=a.architecture,green=s.leafColor,leafKind=foliageKind(info),ll=Math.min(a.leafLength,h*.6,w*.42);
 const leaf=(at,turn,len=ll,pitch=.98,color=green,kind=leafKind)=>b.add(a.leafShape,kind,kit.shade(rand,color,.035),...at,len,len,len,pitch,turn,(rand()-.5)*.16);
 const flower=(at,turn,r=a.flowerRadius,tilt=.25)=>detailedFlower(b,{x:at[0],y:at[1],z:at[2],r,color:s.flowerColor,shape:a.flowerShape,palette:a.flowerPalette,tilt,yaw:turn},{...kit,rand});
 if(arch==='ornamentalKale'){
  const vanilla=p.id%2===0,cold=[1,1,.55,.10,0,0,0,0,0,.25,.85,1][s.month-1],bolting=s.kaleBolting||0,stemHeight=h*.68*bolting,leafSize=Math.min(a.leafLength,w*.47,h*.78),n=vanilla?31:25;
  b.branch([0,0,0],[0,stemHeight+h*.07,0],Math.max(.005,w*.020),a.stemColor,'stem');
  for(let i=0;i<n;i++){
   const t=i/(n-1),an=i*2.399,y=stemHeight+h*(.04+.12*t),len=leafSize*(1-.65*t)*(.93+.12*rand()),colored=Math.max(0,Math.min(1,(t-.12)*1.6))*cold;
   const target=vanilla?t>.81?'#c898ab':'#e4dec9':t>.66?'#93425e':'#7e3d60',color=new THREE.Color(green).lerp(new THREE.Color(target),colored).getStyle();
   leaf([Math.sin(an)*w*.035*(1-t),y,Math.cos(an)*w*.035*(1-t)],an,len,1.46-t*.97+(rand()-.5)*.12,color,'leaf-glossy');
  }
  if(bolting){
   for(let j=0;j<6;j++){const an=j*2.399;leaf([0,stemHeight*(.12+j*.13),0],an,leafSize*.48,1.18,green,'leaf-glossy');}
   if(s.bloom)for(let k=0;k<5;k++){
    const an=k*2.399,base=[0,stemHeight*.77,0],tip=[Math.sin(an)*w*.12,h*(.75+.19*rand()),Math.cos(an)*w*.12];b.branch(base,tip,.0018,a.stemColor,'flowerStem');
    for(let j=0;j<15;j++){const turn=an+j*2.399,at=[tip[0]+Math.sin(turn)*.018,tip[1]+(j/15-.5)*h*.12,tip[2]+Math.cos(turn)*.018];b.branch([tip[0],at[1],tip[2]],at,.0006,a.stemColor,'pedicel');if(j>11)b.add(kit.bud,'flowerBud',green,...at,.002,.003,.002);else flower(at,turn,.007,.40);}
   }
  }return;
 }
 if(arch==='foxFace'||arch==='ornamentalPepper'){
  const fox=arch==='foxFace',variant=a.flowerPalette?.pepper,count=fox?4:variant==='flash'?7:10,fruit=s.fruitStage&&s.leafDensity>0;
  for(let i=0;i<count;i++){
   const angle=i*2.399,reach=w*(fox?.12+.25*Math.sqrt((i+.5)/count):.04+.32*Math.sqrt((i+.5)/count)),height=h*(fox?.66+.28*rand():.48+.27*rand()),nodes=fox?9:7;let prev=[0,.005,0];
   for(let j=1;j<=nodes;j++){
    const t=j/nodes,at=[Math.sin(angle)*reach*t,height*t,Math.cos(angle)*reach*t];b.branch(prev,at,fox?.006*(1-t*.65):.0024*(1-t*.55),a.stemColor,'stem');prev=at;
    const turn=angle+j*2.399,len=ll*(.67+.32*Math.sin(t*Math.PI));
    const leafAt=[at[0]+Math.sin(turn)*len*.26,at[1]+len*.08,at[2]+Math.cos(turn)*len*.26];b.branch(at,leafAt,fox?.0015:.0007,a.stemColor,'petiole');leaf(leafAt,turn,len,1.06);
    if(!fox&&j>1)for(const side of [-1,1]){
     const an=turn+side*.81,end=[at[0]+Math.sin(an)*w*(variant==='flash'?.14:.09),at[1]+h*(variant==='flash'?.045:.10),at[2]+Math.cos(an)*w*(variant==='flash'?.14:.09)];b.branch(at,end,.0008,a.stemColor,'twig');
     for(let k=0;k<3;k++)leaf([at[0]+(end[0]-at[0])*(k+1)/3,at[1]+(end[1]-at[1])*(k+1)/3,at[2]+(end[2]-at[2])*(k+1)/3],an+k*2.399,len*.90,.84+rand()*.4);
    }
    if(j<3)continue;
    if(fruit&&(fox||j%2===0)){
     const out=turn+1.0,rr=fox?a.fruitRadius*2:variant==='rain'?.045:variant==='calico'?.021:variant==='flash'?a.fruitRadius:.03,tip=[at[0]+Math.sin(out)*rr*.6,at[1]+rr*.10,at[2]+Math.cos(out)*rr*.6];b.branch(at,tip,fox?.0022:.001,a.stemColor,'fruitPedicel');
     const f=flowerFrame(b,tip,fox?1.55:rand()*.3,out),color=fox?s.fruitStage==='early'?'#8f9f5e':a.fruitColor:variant==='candle'?(i+j)%3===0?'#d2a057':'#583c6c':variant==='calico'?a.flowerPalette.fruitColors[(i+j)%3]:a.fruitColor;
     f.add(fox?'foxFaceFruit':variant==='flash'?kit.bud:'pepperFruit','fruit-glossy',color,0,0,0,rr,rr,rr);
     for(let k=0;k<5;k++){
      const an=k*TAU/5;
      if(fox)f.add(kit.bud,'fruit-glossy',color,Math.sin(an)*rr*.29,rr*.17,Math.cos(an)*rr*.29,rr*.13,rr*.23,rr*.13,-.9,an,0);
      f.add('narrow','fruitCalyx',fox?'#8b946a':'#635765',0,rr*.012,0,rr*.22,rr*.16,rr,1.28,an,0);
     }
    }
    if(s.bloom&&j>4&&j%2){const tip=[at[0]+Math.sin(turn)*.02,at[1]+.01,at[2]+Math.cos(turn)*.02];b.branch(at,tip,.0005,a.stemColor,'pedicel');flower(tip,turn,a.flowerRadius,1.30);}
   }
  }return;
 }
 if(arch==='livingstoneDaisy'){
  const n=Math.round(24*detail);
  for(let i=0;i<n;i++){
   const angle=i*2.399,reach=w*(.12+.30*Math.sqrt((i+.5)/n));let prev=[0,.003,0];
   for(let j=1;j<=7;j++){
    const t=j/7,at=[Math.sin(angle)*reach*t,h*(.04+.11*Math.sin(t*Math.PI)),Math.cos(angle)*reach*t];b.branch(prev,at,.002,a.stemColor,'succulentStem');prev=at;
    for(const side of [-1,1])leaf(at,angle+side*1.12+j*.28,ll*(.68+.30*rand()),.85+rand()*.35,green,'leaf-ice-cells');
    if(s.bloom&&j>=5&&j%2){const tip=[at[0],at[1]+Math.min(.025,h*.3),at[2]];b.branch(at,tip,.0018,a.stemColor,'peduncle');flower(tip,angle,a.flowerRadius*(.85+.15*rand()),.10+rand()*.22);}
   }
  }return;
 }
 const clover=arch==='crimsonClover',sage=arch==='pinkSage',n=Math.round((sage?12:clover?24:32)*detail);
 for(let i=0;i<n;i++){
  const angle=i*2.399,reach=w*(.035+.33*Math.sqrt((i+.5)/n)),height=h*(sage?.57+.20*rand():clover?.67+.20*rand():.39+.28*rand()),nodes=sage?7:clover?5:7;let prev=[0,.006,0];
  for(let j=1;j<=nodes;j++){
   const t=j/nodes,at=[Math.sin(angle)*reach*t,height*t,Math.cos(angle)*reach*t];b.branch(prev,at,sage?.0025:clover?.0013:.0009,a.stemColor,sage&&j<3?'wood-smooth':'stem');prev=at;
   for(let side=0;side<(clover?1:2);side++){
    const turn=angle+j*Math.PI/2+side*Math.PI,len=ll*(.75+.25*rand()),tip=[at[0]+Math.sin(turn)*len*.47,at[1]+len*.14,at[2]+Math.cos(turn)*len*.47];b.branch(at,tip,.0006,green,'petiole');
    if(clover){const f=flowerFrame(b,tip,.85,turn);for(let k=-1;k<=1;k++)f.add('cloverLeaflet','leaf-woolly',kit.shade(rand,green,.04),0,0,0,len,len,len,0,0,k*1.23);}
    else leaf(tip,turn,len,sage?1.0:.85);
    if(!clover&&j>2){const twig=[tip[0]+Math.sin(turn)*w*.06,tip[1]+h*.045,tip[2]+Math.cos(turn)*w*.06];b.branch(at,twig,.0006,green,'twig');for(let k=0;k<3;k++)leaf(twig,turn+k*2.399,len*.72,.7+rand()*.5);}
   }
  }
  if(!s.bloom)continue;
  if(clover){
   const length=Math.min(a.inflorescenceLength,h*.20),base=[prev[0],height+h*.06,prev[2]];b.branch(prev,base,.001,green,'peduncle');b.branch(base,[base[0],base[1]+length,base[2]],.001,green,'rachis');
   for(let j=0;j<82;j++){
    const t=(j+.5)/82,an=j*2.399,rr=length*.16*Math.pow(Math.sin(Math.PI*t),.48),at=[base[0]+Math.sin(an)*rr,base[1]+length*t,base[2]+Math.cos(an)*rr];
    if(t>.91){b.add(kit.bud,'flowerBud','#82956a',...at,.0009,.0014,.0009);continue;}
    detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius,color:s.flowerColor,shape:'pea',tilt:.20,yaw:an},{...kit,rand});
    b.add('narrow','calyx','#a4a47c',...at,.0015,.003,.0015,.7,an,0);
   }
  }else if(sage){
   const length=Math.min(.18,h*.24);b.branch(prev,[prev[0],height+length,prev[2]],.001,a.stemColor,'rachis');
   for(let j=0;j<8;j++)for(let k=0;k<4;k++){
    const an=angle+k*TAU/4+j*.3,at=[prev[0]+Math.sin(an)*.005,height+length*j/8,prev[2]+Math.cos(an)*.005];
    if(j>5)b.add('petal','flowerBud','#9d8490',...at,.003,.004,.002,.30,an,0);else flower(at,an,a.flowerRadius,-.10);
   }
  }else for(let k=0;k<3;k++){
   const an=angle+(k-1)*.8,tip=[prev[0]+Math.sin(an)*w*.07,height+h*(.19+.13*rand()),prev[2]+Math.cos(an)*w*.07];b.branch(prev,tip,.0006,green,'peduncle');
   if((i+k)%5===0)b.add(kit.bud,'flowerBud','#8b9066',...tip,.0025,.004,.0025);else flower(tip,an,a.flowerRadius*(.82+.18*rand()),.05+rand()*.4);
  }
 }
}

function drawSpringAnnuals(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,arch=a.architecture,green=s.leafColor,nem=arch==='nemophila',cal=arch==='calendula',poppy=arch==='californiaPoppy',gold=arch==='basketOfGold',aly=arch==='sweetAlyssum'||gold;
 const leafKind=a.leafPattern?patternKind('leaf',a.leafPattern,s.leafPatternColor):foliageKind(info),size=Math.min(a.leafLength,h*(poppy?.52:nem?.32:.48),w*(poppy?.48:.28));
 const leaf=(at,len,an,pitch=.94,basal=false)=>{
  if(poppy){
   const f=flowerFrame(b,at,basal?.30+rand()*.60:pitch,an);
   // The blade divides in threes twice, ending in flattened, blunt linear segments.
   const divide=(base,length,turn,depth)=>{
    const end=[base[0]+Math.sin(turn)*length,base[1]+Math.cos(turn)*length,base[2]+length*.06];f.branch(base,end,.00036,green,'rachis');
    for(const side of [-1,0,1]){
     const angle=turn+side*.77,child=length*(side===0?.78:.70);
     if(depth)divide(end,child,angle,depth-1);
     else f.add('poppySegment','leaf',kit.shade(rand,green,.03),...end,child,child,child,0,0,-angle);
    }
   };
   divide([0,0,0],len*.43,0,1);return;
  }
  const pitchHere=basal?.55+rand()*.80:pitch+(rand()-.5)*.30;
  b.add(a.leafShape,leafKind,kit.shade(rand,green,.045),...at,len,len,len,pitchHere,an,(rand()-.5)*.17);
 };
 if(cal||poppy||gold)for(let i=0;i<Math.round((poppy?42:gold?70:17)*detail);i++){
  const an=i*2.399,rr=w*(gold?.31:poppy?.18:.13)*Math.sqrt(rand()),at=[Math.sin(an)*rr,h*(gold?.03:poppy?.02+.10*rand():.018),Math.cos(an)*rr];
  leaf(at,size*(.55+.45*rand()),an,.72,true);
 }
 const n=Math.max(7,Math.round((cal?10:nem?24:poppy?12:gold?40:70)*detail));
 for(let i=0;i<n;i++){
  const angle=i*2.399,reach=w*(.05+(aly?.38:.35)*Math.sqrt((i+.5)/n)),height=h*(cal?.42+.25*rand():poppy?.18+.12*rand():gold?.43+.18*rand():nem?.19+.30*rand():.42+.27*rand()),nodes=cal?5:nem?7:poppy?3:6;
  const points=[];let prev=[Math.sin(angle)*w*.025,.003,Math.cos(angle)*w*.025];
  for(let j=1;j<=nodes;j++){
   const t=j/nodes,an=angle+(j%2-.5)*.13,at=[Math.sin(an)*reach*t,height*(nem?Math.pow(t,1.8):t),Math.cos(an)*reach*t];
   b.branch(prev,at,cal?.0017:poppy?.0012:gold?.0012:.0009,a.stemColor,'stem');prev=at;points.push(at);
   for(let side=0;side<(nem?2:1);side++){
    const turn=angle+j*2.399+side*Math.PI,len=size*(.48+.45*Math.sin(t*Math.PI*.9));leaf(at,len,turn,nem?1.2:poppy?.9:.97);
   }
   if(aly&&j>1)for(const side of [-1,1]){
    const turn=angle+side*.86,reach=w*.044,end=[at[0]+Math.sin(turn)*reach,at[1]+h*.025,at[2]+Math.cos(turn)*reach];b.branch(at,end,.00045,green,'leafyTwig');
    for(let k=0;k<3;k++)leaf([at[0]+(end[0]-at[0])*k/2,at[1]+(end[1]-at[1])*k/2,at[2]+(end[2]-at[2])*k/2],size*(.7+.3*rand()),turn+k*2.399,.7+rand()*.5);
   }
  }
  if(!s.bloom)continue;
  const heads=cal?2:poppy?2:nem?3:gold?2:3;
  for(let k=0;k<heads;k++){
   const an=angle+k*2.19,base=points[Math.max(0,points.length-1-k)],rr=w*(cal?.045:poppy?.055:nem?.033:.025),at=[base[0]+Math.sin(an)*rr,base[1]+h*(cal?.22+.08*rand():poppy?.54+.12*rand():nem?.13:.15+.05*rand()),base[2]+Math.cos(an)*rr];
   b.branch(base,at,cal?.0012:poppy?.0010:.0006,a.stemColor,'peduncle');
   if(aly){
    const count=Math.round((gold?22:24)*s.flowerDensity),head=a.headRadius;
    for(let j=0;j<Math.max(3,count);j++){
     const t=(j+.5)/Math.max(3,count),turn=j*2.399,dist=head*Math.sqrt(t),tip=[at[0]+Math.sin(turn)*dist,at[1]+head*(gold?.26:.70)*Math.sqrt(1-t),at[2]+Math.cos(turn)*dist];
     b.branch(at,tip,.00024,green,'pedicel');
     if(t<.18){b.add(kit.bud,'flowerBud','#a6af85',...tip,.0012,.0018,.0012);continue;}
     detailedFlower(b,{x:tip[0],y:tip[1],z:tip[2],r:a.flowerRadius*(.80+.20*rand()),color:s.flowerColor,shape:a.flowerShape,tilt:Math.sqrt(t)*.65,yaw:turn},{...kit,rand});
    }
   }else{
    const r=a.flowerRadius*(.81+.19*rand());
    if((i+k)%7===1){
     b.add(kit.bud,'flowerBud',green,...at,r*(poppy?.20:.31),r*(poppy?.46:.20),r*(poppy?.20:.31),poppy?.2:0,an,0);
     if(poppy)b.add(kit.cone,'calyxCap',green,at[0],at[1]+r*.44,at[2],r*.18,r*.48,r*.18);continue;
    }
    detailedFlower(b,{x:at[0],y:at[1],z:at[2],r,color:s.flowerColor,shape:a.flowerShape,layers:a.flowerLayers,palette:a.flowerPalette,tilt:.15+rand()*.63,yaw:an},{...kit,rand});
   }
  }
 }
}

function drawCoolFloweringMounds(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,senetti=a.architecture==='senetti',n=Math.max(12,Math.round((senetti?14:34)*detail)),size=Math.min(a.leafLength,h*.24,w*(senetti?.30:.18)),green=s.leafColor;
 if(senetti)for(let i=0;i<Math.round(18*detail);i++){
  const turn=i*2.399,len=size*(.65+.35*rand()),reach=w*(.04+.09*rand()),root=[Math.sin(turn)*w*.026,.008,Math.cos(turn)*w*.026],at=[Math.sin(turn)*reach,h*(.045+.10*rand()),Math.cos(turn)*reach];
  b.branch(root,at,.0011,a.stemColor,'petiole');b.add(a.leafShape,'leaf-palm',kit.shade(rand,green,.06),...at,len,len,len,.60+rand()*.95,turn,(rand()-.5)*.48);
 }
 for(let i=0;i<n;i++){
  const angle=i*2.399,reach=w*(.07+.29*Math.sqrt((i+.5)/n)),height=h*(.28+.35*rand()),root=[Math.sin(angle)*w*.065,.005,Math.cos(angle)*w*.065];let prev=root;
  const nodes=senetti?3:6;
  for(let j=1;j<=nodes;j++){
   const t=(j-.35+rand()*.35)/nodes,at=[Math.sin(angle)*reach*t,height*t,Math.cos(angle)*reach*t];b.branch(prev,at,senetti?.0018:.0010,a.stemColor,'stem');prev=at;
   if(j===1)continue;
   for(let side=0;side<(senetti?1:2);side++){
    const turn=senetti?angle+j*2.399:angle+j*Math.PI/2+side*Math.PI,len=size*(.48+.52*Math.sin(t*Math.PI*.89)),petiole=senetti?len*.28:len*.05,end=[at[0]+Math.sin(turn)*petiole,at[1]+petiole*.2,at[2]+Math.cos(turn)*petiole];
    b.branch(at,end,.00065,a.stemColor,'petiole');b.add(a.leafShape,senetti?'leaf-palm':'leaf',kit.shade(rand,green,.05),...end,len,len,len,(senetti?.60:1.1)+rand()*(senetti?1.08:.15),turn,(rand()-.5)*(senetti?.58:.10));
   }
  }
  if(!s.bloom)continue;
  const count=senetti?7:11;
  for(let j=0;j<count;j++){
   const fraction=j/(count-1),turn=angle+j*2.399,reachFlower=w*(senetti?.04:.04),yy=senetti?h*(.16+.11*rand()):h*(.10+.19*fraction),at=[prev[0]+Math.sin(turn)*reachFlower,prev[1]+yy,prev[2]+Math.cos(turn)*reachFlower];
   b.branch(prev,at,senetti?.00095:.0005,a.stemColor,'peduncle');
   if(!senetti&&j%3===0)for(const side of [-1,1]){const leaf=size*.46,an=turn+(side===1?Math.PI:0);b.add(a.leafShape,'leaf',green,at[0],at[1]-yy*.25,at[2],leaf,leaf,leaf,1.12,an,0);}
   if(!senetti&&j>8||senetti&&j===6&&i%3===0){b.add(kit.bud,'bud',green,...at,senetti?.003:.0018,senetti?.004:.0025,senetti?.003:.0018);continue;}
   const radius=a.flowerRadius*(.89+.11*rand());
   detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:radius,color:s.flowerColor,shape:a.flowerShape,palette:a.flowerPalette,tilt:senetti?.16+rand()*.48:-.62+rand()*.30,yaw:turn},{...kit,rand});
  }
 }
}

function drawOrnamentalGrasses(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,pampas=a.architecture==='pampasPlume',remote=a.architecture==='remoteSedge',winter=s.seasonName==='winter',n=Math.round((pampas?360:210)*detail),foliageHeight=h*(pampas?.48:.91),width=pampas?.012:remote?.0026:.0045;
 const kind=a.leafPattern?patternKind('leaf-grass',a.leafPattern,a.patternColor):'leaf-grass';
 for(let i=0;i<n;i++){
  const t=(i+.5)/n,angle=i*2.399,reach=w*(.13+.34*Math.sqrt(t)),height=foliageHeight*(.62+.38*rand())*(1-.30*t),base=[Math.sin(angle)*w*.035,.003,Math.cos(angle)*w*.035];
  const dry=winter&&(remote||pampas&&t>.32),color=dry?'#b3a27e':s.leafColor;
  b.add('grassRibbon',dry?'leaf-grass':kind,kit.shade(rand,color,.065),...base,width*(.75+.25*rand()),height/.84,reach/.98,0,angle,(rand()-.5)*.035);
 }
 if(!s.bloom&&!s.seedHeads)return;
 const heads=Math.max(3,Math.round((pampas?a.flowerPalette?.abundant?19:10:remote?22:17)*detail)),dry=!s.bloom;
 for(let i=0;i<heads;i++){
  const angle=i*2.399,reach=w*(pampas?.28:.34)*Math.sqrt((i+.5)/heads),top=h*(pampas?.72+.27*rand():.71+.27*rand()),plume=pampas?h*(.20+.04*rand()):remote?h*.43:h*.27;
  const root=[Math.sin(angle)*w*.035,.008,Math.cos(angle)*w*.035],tip=[Math.sin(angle)*reach,top,Math.cos(angle)*reach];
  const axis=new THREE.Vector3(tip[0]-root[0],top,tip[2]-root[2]).normalize(),radial=new THREE.Vector3(Math.cos(angle),0,-Math.sin(angle)),cross=new THREE.Vector3().crossVectors(axis,radial).normalize();
  b.branch(root,tip,pampas?.003:.0009,dry?'#aa9973':'#8a9761','culm');
  if(pampas){
   const nodes=64,color=dry?'#bcad8b':s.flowerColor;
   for(let j=0;j<nodes;j++){
    const t=(j+.5)/nodes,at=new THREE.Vector3(...tip).addScaledVector(axis,-plume*(1-t)),radius=plume*.22*Math.pow(Math.sin(Math.PI*t),.72)*(1-.3*t);
    for(let k=0;k<5;k++){
     const turn=j*2.399+k*TAU/5,dir=radial.clone().multiplyScalar(Math.cos(turn)).addScaledVector(cross,Math.sin(turn)),end=at.clone().addScaledVector(dir,radius).addScaledVector(axis,plume*.065);
     b.branch(at.toArray(),end.toArray(),Math.min(.00025,h*.00010),color,dry?'seedBranch':'panicleBranch');
     for(let q=0;q<10;q++){
      const f=(q+.8)/10,base=at.clone().lerp(end,f),length=plume*(.035+.025*rand()),side=radial.clone().multiplyScalar(Math.cos(turn+q*2.399)).addScaledVector(cross,Math.sin(turn+q*2.399)),hair=axis.clone().multiplyScalar(.60).addScaledVector(dir,.55).addScaledVector(side,.30).normalize();
      b.add('needle',dry?'seed-pampas-fiber':'sepal-pampas-fiber',kit.shade(rand,color,.045),...base.toArray(),length*2.8,length,length,Math.acos(hair.y),Math.atan2(hair.x,hair.z),0);
     }
    }
   }
  }else{
   const nodes=remote?5:3;
   for(let j=0;j<nodes;j++){
    const t=j/(nodes-1),at=new THREE.Vector3(...tip).addScaledVector(axis,-plume*(1-t)),turn=angle+j*2.399,length=remote?.009:.019,side=new THREE.Vector3(Math.sin(turn),.32,Math.cos(turn)).normalize();
    const end=at.clone().addScaledVector(side,length*.30);b.branch(at.toArray(),end.toArray(),.00045,'#90935e','pedicel');
    b.add(kit.bud,dry?'seed':'spikelet',dry?'#a69570':s.flowerColor,...end.toArray(),length*.19,length*.52,length*.19,.28,turn,0);
    if(remote)b.add('hakoneBlade','leaf-grass',s.leafColor,...at.toArray(),length*1.4,length*5,length*5,1.10,turn,0);
   }
  }
 }
}

function drawRedHakone(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,winter=s.seasonName==='winter',red=!winter&&(s.seasonName==='spring'||s.seasonName==='autumn'||s.month===6),n=Math.round(43*detail),length=Math.min(a.leafLength,h*.48,w*.26);
 for(let i=0;i<n;i++){
  const angle=i*2.399,reach=w*(.12+.27*Math.sqrt((i+.5)/n)),top=h*(.65+.24*rand()),curve=new THREE.CatmullRomCurve3([[0,.008,0],[Math.sin(angle)*reach*.28,top*.62,Math.cos(angle)*reach*.28],[Math.sin(angle)*reach*.66,top*.88,Math.cos(angle)*reach*.66],[Math.sin(angle)*reach,top*.75,Math.cos(angle)*reach]].map(v=>new THREE.Vector3(...v)));let prev=curve.getPoint(0).toArray();
  for(let j=1;j<=8;j++){
   const t=j/8,at=curve.getPoint(t).toArray();b.branch(prev,at,.0011*(1-t*.35),winter?'#b09c76':'#7b9a55','culm');prev=at;
   if(j<2)continue;
   const yaw=angle+(j%2?.85:-.85),size=length*(.57+.43*Math.sin(t*Math.PI*.82)),kind=red&&i%4!==1?patternKind('leaf-grass','tip',i%5===0?'#bc645c':'#99514c'):'leaf-grass';
   b.add('hakoneBlade',kind,kit.shade(rand,s.leafColor,.05),...at,size,size,size,.86+t*.44,yaw,(rand()-.5)*.08);
  }
  if(s.bloom&&i%3===0){
   const start=curve.getPoint(1),top=start.clone().add(new THREE.Vector3(Math.sin(angle)*h*.10,h*.20,Math.cos(angle)*h*.10));b.branch(start.toArray(),top.toArray(),.0005,'#a7a47b','peduncle');
   for(let j=0;j<8;j++){const t=(j+.5)/8,at=start.clone().lerp(top,t),turn=j*2.399,end=at.clone().add(new THREE.Vector3(Math.sin(turn),.3,Math.cos(turn)).multiplyScalar(h*.09*(1-t*.7)));b.branch(at.toArray(),end.toArray(),.0003,'#a7a47b','pedicel');b.add(kit.bud,'spikelet',s.flowerColor,...end.toArray(),.0012,.0035,.0012,.30,turn,0);}
  }
 }
}

function drawGroundRunners(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,ivy=a.architecture==='groundIvy',dichondra=a.architecture==='dichondraMat',low=ivy||dichondra,count=Math.max(10,Math.round((dichondra?52:ivy?30:42)*detail)),sites=[],flowers=[];
 for(let i=0;i<count;i++){
  const angle=i*2.399,reach=w*(.18+.30*Math.sqrt((i+.5)/count)),phase=rand()*TAU;
  const curve=new THREE.CatmullRomCurve3([[0,.006,0],[Math.sin(angle+.18)*reach*.40,low?h*.10:h*(.20+rand()*.35),Math.cos(angle+.18)*reach*.40],[Math.sin(angle-.18)*reach*.74,low?h*.12:h*(.25+rand()*.4),Math.cos(angle-.18)*reach*.74],[Math.sin(angle)*reach,low?h*.08:h*(.13+rand()*.20),Math.cos(angle)*reach]].map(v=>new THREE.Vector3(...v)));
  let prev=curve.getPoint(0).toArray();
  for(let j=1;j<=30;j++){
   const t=j/30,at=curve.getPoint(t).toArray();b.branch(prev,at,ivy?.0010:.00055,a.stemColor,low?'runner':'wood');prev=at;
   if(j%2)continue;
   if(low&&j%6===0)b.branch(at,[at[0],.001,at[2]],.00033,'#928775','root');
   for(let q=0;q<(ivy?2:1);q++){
    const yaw=angle+(ivy?q*Math.PI+j*.45:j*2.399)+phase,length=(a.leafLength||.02)*(.70+.30*rand()),rise=dichondra?h*(.28+.32*rand()):ivy?h*(.15+.5*rand()):length*.22,petiole=dichondra?length*.90:ivy?length*.60:length*.22;
    const end=[at[0]+Math.sin(yaw)*petiole,at[1]+rise,at[2]+Math.cos(yaw)*petiole];
    const shade=rand(),chance=rand();sites.push({at,end,yaw,length,shade,chance});
    if(ivy&&j%6===0)flowers.push({at,yaw,chance});
   }
  }
 }
 for(const f of sites){if(f.chance>s.leafDensity)continue;b.branch(f.at,f.end,ivy?.00065:.00023,a.stemColor,'petiole');b.add(a.leafShape,foliageKind(info),kit.shade(()=>f.shade,s.leafColor,.06),...f.end,f.length,f.length,f.length,dichondra?1.40:ivy?1.16:1.00+f.shade*.42,f.yaw,0);}
 if(s.bloom)for(const f of flowers){if(f.chance>.35*s.flowerDensity)continue;const at=[f.at[0],f.at[1]+h*.20,f.at[2]];b.branch(f.at,at,.0003,a.stemColor,'pedicel');detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius,color:s.flowerColor,shape:a.flowerShape,tilt:.2,yaw:f.yaw},{...kit,rand});}
}

function drawPersianShield(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,shoots=Math.max(5,Math.round(10*detail)),length=Math.min(a.leafLength,h*.45,w*.32);
 for(let i=0;i<shoots;i++){
  const angle=i*2.399,reach=w*.27*Math.sqrt((i+.5)/shoots),top=h*(.48+.45*rand()),root=[Math.sin(angle)*w*.035,.005,Math.cos(angle)*w*.035];let prev=root;
  for(let j=1;j<=7;j++){
   const t=j/7,at=[Math.sin(angle)*reach*t,top*t,Math.cos(angle)*reach*t];b.branch(prev,at,.0022*(1-t*.60),a.stemColor,'stem');prev=at;
   if(j<2)continue;
   for(const side of [-1,1]){
    const yaw=angle+j*Math.PI/2+(side===1?Math.PI:0),size=length*(.48+.52*Math.sin(t*Math.PI*.82))*(.9+rand()*.1),end=[at[0]+Math.sin(yaw)*size*.15,at[1]+size*.06,at[2]+Math.cos(yaw)*size*.15];
    b.branch(at,end,.0009,a.stemColor,'petiole');b.add(a.leafShape,'leaf-persian-metal',kit.shade(rand,s.leafColor,.05),...end,size,size,size,1.05+rand()*.16,yaw,(rand()-.5)*.09);
   }
  }
 }
}

function drawFoxtailAsparagus(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,count=Math.max(9,Math.round(21*detail));
 for(let i=0;i<count;i++){
  const angle=i*2.399,reach=w*(.07+.38*Math.sqrt((i+.5)/count)),top=h*(.56+.40*(1-i/count)),length=a.leafLength||.016;
  const curve=new THREE.CatmullRomCurve3([[0,.008,0],[Math.sin(angle)*reach*.18,top*.38,Math.cos(angle)*reach*.18],[Math.sin(angle)*reach*.55,top*.82,Math.cos(angle)*reach*.55],[Math.sin(angle)*reach,top,Math.cos(angle)*reach]].map(v=>new THREE.Vector3(...v)));
  const tube=Math.min(w*.068,h*.1),young=i%8===0,green=young?'#8eaf59':s.leafColor;let prev=curve.getPoint(0).toArray();
  for(let j=1;j<=56;j++){
   const t=j/56,at=curve.getPoint(t),axis=curve.getTangent(t).normalize();b.branch(prev,at.toArray(),.0018*(1-t*.82),a.stemColor,'stem');prev=at.toArray();
   if(j<4)continue;
   const radial=new THREE.Vector3(Math.cos(angle),0,-Math.sin(angle)).normalize(),cross=new THREE.Vector3().crossVectors(axis,radial).normalize(),radius=tube*Math.pow(Math.sin(Math.PI*(t-.035)),.7);
   for(let side=0;side<6;side++){
    const turn=j*2.399+side*TAU/6,dir=radial.clone().multiplyScalar(Math.cos(turn)).addScaledVector(cross,Math.sin(turn)),end=at.clone().addScaledVector(dir,radius).addScaledVector(axis,length*.55);b.branch(at.toArray(),end.toArray(),.00020,green,'branchlet');
    for(let k=0;k<10;k++){
     const f=(k+.7)/10,base=at.clone().lerp(end,f),spin=turn+k*2.399,sideDir=radial.clone().multiplyScalar(Math.cos(spin)).addScaledVector(cross,Math.sin(spin)),needleDir=dir.clone().multiplyScalar(.55).addScaledVector(axis,.4).addScaledVector(sideDir,.65).normalize(),size=length*(.68+.32*Math.sin(f*Math.PI));
     const pitch=Math.acos(Math.max(-1,Math.min(1,needleDir.y))),yaw=Math.atan2(needleDir.x,needleDir.z);
     b.add('needle','leaf',kit.shade(rand,green,.035),...base.toArray(),size*1.60,size,size,pitch,yaw,0);
    }
   }
  }
 }
}

function drawSmallShrubs(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,wire=a.architecture==='wireShrub',myrtle=a.architecture==='myrtleShrub',column=a.habit==='columnar',vase=a.habit==='vase',wool=a.architecture==='eremophila',mint=a.architecture==='mintBush';
 const felt=['limeFelt','pityrodia','dustyMiller'].includes(a.architecture),gardenia=a.architecture==='gardeniaShrub',salt=a.architecture==='saltbush',lime=a.architecture==='limeFelt',dust=a.architecture==='dustyMiller';
 const leafLength=Math.min(a.leafLength||(wire?.024:.019),h*(felt?.35:.13),w*(felt?.22:.10)),wood=a.barkColor||(wool||felt?a.stemColor:'#796b5c'),young=a.stemColor||wood,green=s.leafColor;
 const kind=a.leafPattern?patternKind(a.leafTexture==='glossy'?'leaf-glossy':'leaf',a.leafPattern,s.leafPatternColor||a.patternColor):foliageKind(info),sites=[],flowerSites=[],alternate=a.arrangement==='alternate';
 // The complete branch graph is built before leaves and flowers, independently of month.
 const shoots=Math.max(7,Math.round((felt?lime?14:9:gardenia?11:wire?15:column?23:20)*detail)),lowBase=felt||gardenia||salt;
 const forks=[];
 for(let root=0;root<4;root++){
  const an=root*2.399,base=[Math.sin(an)*w*.023,.008,Math.cos(an)*w*.023],fork=[Math.sin(an)*w*.10,h*((lowBase?.04:wool?.10:.23)+root*.025),Math.cos(an)*w*.10];
  b.branch(base,fork,h*.008*(1-root*.09),wood,a.barkPattern?'wood-'+a.barkPattern:'wood');forks.push(fork);
 }
 for(let i=0;i<shoots;i++){
  const an=i*2.399,reach=w*(wire?.32:.28)*Math.sqrt((i+.6)/shoots),top=h*(.48+(vase?.32:.39)*rand()),root=forks[i%4];let prev=root;
  for(let j=1;j<=9;j++){
   const t=j/9,aa=an+(wire?(j%2?1:-1)*.25:Math.sin(t*3)*.10),at=[root[0]*(1-t)+Math.sin(aa)*reach*t,root[1]+(top-root[1])*t,root[2]*(1-t)+Math.cos(aa)*reach*t];
   b.branch(prev,at,Math.max(.0005,h*.0038*(1-t*.88)),j<4?wood:young,j<4&&a.barkPattern?'wood-'+a.barkPattern:'wood');prev=at;
   if(j<2)continue;
   const sides=wire?1:2;
   for(let side=0;side<sides;side++){
    const sign=sides===1?(j%2?1:-1):(side?1:-1),yaw=an+sign*(wire?1.24:1.0),length=w*(column?.055:wire?.14:.12)*(.65+rand()*.45),rise=h*(vase?.17:column?.12:wire?.018:.08);let twig=at;
    const nodes=felt?lime?8:4:gardenia?5:wire?5:column?12:8;
    for(let k=1;k<=nodes;k++){
     const f=k/nodes,az=yaw+(wire?(k%2?1:-1)*.43:.02*Math.sin(k)),node=[at[0]+Math.sin(az)*length*f,at[1]+rise*f,at[2]+Math.cos(az)*length*f];
     b.branch(twig,node,Math.max(.00022,h*.00085*(1-f*.62)),young,'wood');twig=node;
     const leaves=wire?(vase?1:3):alternate?1:2;
     for(let q=0;q<leaves;q++)sites.push({at:node,yaw:az+(wire?(k%2?1:-1)*1.1+(q-1)*.7:alternate?k*2.399:q*Math.PI+k*Math.PI/2),size:leafLength*(.76+rand()*.28),pitch:.88+rand()*.68,roll:(rand()-.5)*.25,young:k===nodes,chance:rand(),shade:rand()});
     if(k%3===0&&!dust){
      // Short side shoots fill the crown without inflating the actual leaf blades.
      const axis=az+(k%2?1:-1)*1.0,tip=[node[0]+Math.sin(axis)*length*.30,node[1]+h*(wire?.028:.045),node[2]+Math.cos(axis)*length*.30];let part=node;
      for(let v=1;v<=3;v++){
       const t=v/3,at=node.map((x,n)=>x+(tip[n]-x)*t);b.branch(part,at,.00025,young,'wood');part=at;
       for(let q=0;q<(alternate?1:2);q++)sites.push({at,yaw:axis+q*Math.PI+v*(alternate?2.399:1.57),size:leafLength*(.68+rand()*.28),pitch:.75+rand()*.75,roll:(rand()-.5)*.2,young:v===3,chance:rand(),shade:rand()});
      }
     }
     const chance=rand();if((mint||gardenia||dust?k===nodes:k%3===1)&&chance<(gardenia||dust?.32:wool||mint?.19:.12))flowerSites.push({at:node,yaw:az,chance});
    }
   }
  }
 }
 for(const l of sites){
  if(l.chance>(s.leafDensity??1))continue;
  const at=[l.at[0]+Math.sin(l.yaw)*l.size*.13,l.at[1]+l.size*.03,l.at[2]+Math.cos(l.yaw)*l.size*.13],color=salt&&s.seasonName==='winter'&&l.shade<.17?'#a76863':a.springShootColor&&l.young&&s.springFlush?a.springShootColor:green;
  b.branch(l.at,at,Math.max(.00011,l.size*.015),young,'petiole');
  b.add(a.leafShape,kind,kit.shade(()=>l.shade,color,.075),...at,l.size*(myrtle?1.05:wire?.70:.80),l.size,l.size,l.pitch,l.yaw,l.roll);
 }
 if(s.bloom&&a.flowerShape)for(const f of flowerSites){
  if(f.chance>(s.flowerDensity??1))continue;
  const r=a.flowerRadius||.004,end=[f.at[0]+Math.sin(f.yaw)*r*2,f.at[1]+r*2.4,f.at[2]+Math.cos(f.yaw)*r*2];b.branch(f.at,end,.00025,young,'peduncle');
  detailedFlower(b,{x:end[0],y:end[1],z:end[2],r,color:s.flowerColor,shape:a.flowerShape,pattern:a.flowerPattern,patternColor:a.flowerPatternColor,tilt:.3,yaw:f.yaw},{...kit,rand});
 }
}

function drawStarJasmine(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,n=Math.max(12,Math.round(Math.min(64,22+w*16)*detail)),size=Math.min(a.leafLength||.05,h*.42,w*.16);
 const hatsuyuki=a.architecture==='hatsuyuki';
 const leafKind=patternKind('leaf-glossy',a.leafPattern,s.leafPatternColor||a.patternColor),flowers=[];
 const leafPair=(at,angle,young,white=false)=>{
  for(const side of [-1,1]){
   const yaw=angle+side*Math.PI/2,length=size*(young?.76:1)*(.8+rand()*.25),end=[at[0]+Math.sin(yaw)*.002,at[1]+.002,at[2]+Math.cos(yaw)*.002];
   b.branch(at,end,.00045,green,'petiole');
   const color=a.springShootColor&&young&&s.seasonName!=='winter'?a.springShootColor:hatsuyuki&&white?'#e3e3cf':green;
   const kind=hatsuyuki?(young||white?'leaf-glossy':leafKind):young&&a.springShootColor&&s.seasonName!=='winter'?'leaf-glossy':leafKind;
   b.add('leathery',kind,kit.shade(rand,color,.04),...end,length*.70,length,length,1.0+rand()*.28,yaw,(rand()-.5)*.1);
  }
 };
 for(let i=0;i<n;i++){
  const an=i*2.399,reach=w*(.13+.31*Math.sqrt((i+.5)/n)),phase=rand()*TAU,root=[Math.sin(an)*reach*.11,.008,Math.cos(an)*reach*.11];let prev=root;
  for(let j=1;j<=12;j++){
   const t=j/12,yaw=an+Math.sin(t*4+phase)*.18,at=[Math.sin(yaw)*reach*t,h*(.09+Math.sin(t*Math.PI)*.15)+.006,Math.cos(yaw)*reach*t];
   b.branch(prev,at,.0018*(1-t*.62),'#877763','wood');prev=at;
   leafPair(at,yaw,j>10,hatsuyuki&&j>=8&&j<=10);
   if(j<4||j%3!==0)continue;
   const side=j%2?1:-1,sa=yaw+side*.92,end=[at[0]+Math.sin(sa)*size*.85,at[1]+h*(.27+rand()*.24),at[2]+Math.cos(sa)*size*.85];
   let branch=at;
   for(let k=1;k<=4;k++){
    const node=at.map((v,index)=>v+(end[index]-v)*k/4);b.branch(branch,node,.00075,'#8b815e','wood');branch=node;leafPair(node,sa+k*.4,k===4,hatsuyuki&&k===3);
   }
   const chance=rand(),fade=rand(),pitch=.15+rand()*.5;
   if(chance<.36)flowers.push({at:end,sa,fade,pitch,chance});
  }
 }
 // Flower creation consumes randomness only after the complete perennial branch structure.
 if(s.bloom)for(const f of flowers){
  if(f.chance>s.flowerDensity)continue;
  const stalk=[f.at[0],f.at[1]+.025,f.at[2]],color=new THREE.Color(s.flowerColor).lerp(new THREE.Color(a.flowerFadeTo||s.flowerColor),f.fade).getStyle();b.branch(f.at,stalk,.0005,green,'peduncle');
  for(let k=0;k<3;k++){
   const yaw=f.sa+k*TAU/3,end=[stalk[0]+Math.sin(yaw)*.012,stalk[1]+.008,stalk[2]+Math.cos(yaw)*.012];b.branch(stalk,end,.00035,green,'peduncle');
   detailedFlower(b,{x:end[0],y:end[1],z:end[2],r:a.flowerRadius||.01,color,shape:'pinwheel',tilt:f.pitch,yaw},{...kit,rand});
  }
 }
}

function drawLotus(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,n=Math.max(8,Math.round((a.habit==='arching'?18:30)*detail)),length=a.leafLength||.016;
 const leaf=(at,angle,young=false)=>{
  const joint=[at[0]+Math.sin(angle)*length*.30,at[1]+length*.10,at[2]+Math.cos(angle)*length*.30];b.branch(at,joint,.0004,green,'petiole');
  const color=a.springShootColor&&young?a.springShootColor:green;
  for(let k=0;k<5;k++){
   const base=k<2?at:joint,aa=angle+(k<2?(k?1:-1)*1.2:(k-3)*.72),size=length*(k<2?.73:1);
   b.add(a.leafletShape||'leaf',foliageKind(info),kit.shade(rand,color,.035),...base,size*(a.leafletShape==='narrow'?1.6:.53),size,size,.86+rand()*.25,aa,0);
  }
 };

 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.42*Math.sqrt((i+.5)/n),middle=[Math.sin(an)*rr*.62,h*(.5+rand()*.34),Math.cos(an)*rr*.62],end=[Math.sin(an)*rr,h*(a.habit==='arching'?.55:.42+rand()*.3),Math.cos(an)*rr];
  b.branch([0,0,0],middle,.0018,'#899075','petiole');b.branch(middle,end,.001,green,'petiole');
  for(let j=0;j<12;j++){const t=(j+.6)/12;leaf(middle.map(v=>v*t),an+j*2.399);}
  for(let side=-1;side<=1;side++){
   const yaw=an+side*.6,start=middle.map(v=>v*.65),tip=[end[0]+Math.sin(yaw)*w*.08,end[1]+h*(side===0?.04:.14),end[2]+Math.cos(yaw)*w*.08];b.branch(start,tip,.0008,green,'petiole');
   for(let j=0;j<9;j++){
    const at=start.map((v,k)=>v+(tip[k]-v)*(j+.5)/9);leaf(at,yaw+j*2.399,j>6);
   }
   if(!s.bloom||side!==0||rand()>s.flowerDensity)continue;
   const head=[tip[0],tip[1]+.025,tip[2]];b.branch(tip,head,.0006,green,'peduncle');
   for(let k=0;k<4;k++){
    const yaw=an+k*TAU/4,at=[head[0]+Math.sin(yaw)*.006,head[1],head[2]+Math.cos(yaw)*.006];b.branch(head,at,.0003,green,'peduncle');
    detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius||.008,color:s.flowerColor,shape:'pea',yaw},{...kit,rand});
   }
  }
 }
}

function drawCompactHebe(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,n=Math.max(8,Math.round(24*detail)),size=Math.min(.038,h*.12);
 const leafKind=patternKind('leaf-glossy',a.leafPattern,s.leafPatternColor||a.patternColor);
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.32*Math.sqrt((i+.5)/n),fork=[Math.sin(an)*rr*.30,h*.07,Math.cos(an)*rr*.30];
  b.branch([0,0,0],fork,.002,'#827663','wood');
  for(let side=-1;side<=1;side++){
   const yaw=an+side*.45,tip=[Math.sin(yaw)*rr,h*(.22+.60*Math.sqrt(1-(rr/(w*.34))**2))*(.9+rand()*.1),Math.cos(yaw)*rr];
   b.branch(fork,tip,.0013,green,'petiole');
   for(let j=0;j<8;j++)for(const pair of [-1,1]){
    const t=(j+.2)/8,at=fork.map((v,k)=>v+(tip[k]-v)*t),angle=yaw+j*Math.PI/2+(pair===1?Math.PI:0),length=size*(.8+rand()*.2);
    b.add('leathery',leafKind,kit.shade(rand,a.springShootColor&&s.springFlush&&j>5?a.springShootColor:green,.035),...at,length*.53,length,length,.72+rand()*.3,angle,0);
   }
   if(!s.bloom||side!==0||rand()>s.flowerDensity)continue;
   const len=Math.min(.075,h*.2),top=[tip[0]+Math.sin(yaw)*len*.4,tip[1]+len,tip[2]+Math.cos(yaw)*len*.4];b.branch(tip,top,.0007,green,'peduncle');
   for(let j=0;j<34*detail;j++){
    const t=(j+.5)/(34*detail),angle=j*2.399,axis=tip.map((v,k)=>v+(top[k]-v)*t),at=[axis[0]+Math.sin(angle)*.005,axis[1],axis[2]+Math.cos(angle)*.005];
    b.branch(axis,at,.0003,green,'peduncle');detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:.0036,color:s.flowerColor,shape:'hebeFlower',tilt:1.15,yaw:angle},{...kit,rand});
   }
  }
 }
}

function drawFlannel(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,n=Math.max(5,Math.round(12*detail));
 const leaf=(at,yaw)=>{
  // Two orders of three narrow divisions, on a short petiole.
  const size=Math.min(.05,w*.22),joint=[at[0]+Math.sin(yaw)*size*.30,at[1]+size*.15,at[2]+Math.cos(yaw)*size*.30];
  b.branch(at,joint,.0007,green,'petiole');
  for(let k=-1;k<=1;k++){
   const aa=yaw+k*.9,end=[joint[0]+Math.sin(aa)*size*.30,joint[1]+size*.12,joint[2]+Math.cos(aa)*size*.30];b.branch(joint,end,.0005,green,'petiole');
   for(let j=-1;j<=1;j++)b.add('narrow','leaf-woolly',kit.shade(rand,green,.03),...end,size*1.3,size*.55,size*.55,.70+rand()*.55,aa+j*.65,0);
  }
 };
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.25*Math.sqrt((i+.5)/n),tip=[Math.sin(an)*rr,h*(.50+rand()*.23),Math.cos(an)*rr];
  const fork=[tip[0]*.45,h*.13,tip[2]*.45];b.branch([0,0,0],fork,.0023,green,'petiole');b.branch(fork,tip,.0015,green,'petiole');
  for(let j=0;j<7;j++){
   const t=.06+j*.14,at=fork.map((v,k)=>v+(tip[k]-v)*t),yaw=an+j*2.399;leaf(at,yaw);
   if(j%2===0){
    const side=[at[0]+Math.sin(yaw)*w*.14,at[1]+h*.09,at[2]+Math.cos(yaw)*w*.14];b.branch(at,side,.001,green,'petiole');
    for(let k=0;k<4;k++)leaf(at.map((v,axis)=>v+(side[axis]-v)*(k+.4)/4),yaw+k*2.399);
   }
  }
  if(s.bloom){const at=[tip[0],tip[1]+Math.min(.065,h*.16),tip[2]];b.branch(tip,at,.0012,green,'peduncle');detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius||.035,color:'#efeee3',shape:'flannelHead',bracts:a.bracts||12,tilt:(rand()-.5)*1.15,yaw:an},{...kit,rand});}
 }
}

function drawMistflower(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,n=Math.max(5,Math.round(14*detail)),leafKind=foliageKind(info);
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.34*Math.sqrt((i+.5)/n),x=Math.sin(an)*rr,z=Math.cos(an)*rr,top=h*(.68+rand()*.25),base=[x*.75,0,z*.75];let prev=base;
  for(let j=1;j<=7;j++){
   const t=j/8,at=[x*(.75+.25*t),top*t,z*(.75+.25*t)];b.branch(prev,at,.0018*(1-t*.45),a.stemColor,'petiole');prev=at;
   for(const side of [-1,1]){
    const aa=an+j*1.57+(side===1?Math.PI:0),size=Math.min(a.leafLength,w*.22)*(1-t*.28),tip=[at[0]+Math.sin(aa)*size*.22,at[1]+size*.16,at[2]+Math.cos(aa)*size*.22];
    b.branch(at,tip,.0007,green,'petiole');b.add('deltoidSerrate',leafKind,kit.shade(rand,green,.05),...tip,size,size,size,1.1,aa,0);
   }
   if(j!==5&&j!==7)continue;
   const cyme=[at[0]+Math.sin(an+j)*w*.10,top*(j===5?.88:1),at[2]+Math.cos(an+j)*w*.10];b.branch(at,cyme,.0011,a.stemColor,'peduncle');
   if(!s.bloom)continue;
   for(let k=0;k<18;k++){
    const aa=k*2.399,r=.045*Math.sqrt((k+.5)/18),tip=[cyme[0]+Math.sin(aa)*r,cyme[1]+.028,cyme[2]+Math.cos(aa)*r];b.branch(cyme,tip,.00045,green,'peduncle');
    detailedFlower(b,{x:tip[0],y:tip[1],z:tip[2],r:.006,color:s.flowerColor,shape:'discHead'},{...kit,rand});
   }
  }
 }
}

function drawAxillaryFunnels(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,n=Math.max(5,Math.round(16*detail)),leafKind=foliageKind(info);
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.31*Math.sqrt((i+.5)/n),top=h*(.65+rand()*.3),point=t=>[Math.sin(an)*rr*(.75+.25*t),top*t,Math.cos(an)*rr*(.75+.25*t)];let prev=point(0);
  for(let j=1;j<=7;j++){
   const t=j/8,at=point(t);b.branch(prev,at,.0013,green,'petiole');prev=at;
   for(const side of [-1,1]){
    const yaw=an+j*1.57+(side===1?Math.PI:0),size=Math.min(a.leafLength,h*.55)*(1-t*.30);
    b.add(a.leafShape,leafKind,kit.shade(rand,green,.05),...at,size,size,size,.95,yaw,0);
    if(s.bloom&&j>=5&&rand()<.5*s.flowerDensity){const end=[at[0]+Math.sin(yaw)*size*.25,at[1]+h*.09,at[2]+Math.cos(yaw)*size*.25];b.branch(at,end,.0007,green,'peduncle');detailedFlower(b,{x:end[0],y:end[1],z:end[2],r:a.flowerRadius,color:s.flowerColor,shape:'ruelliaFlower',tilt:.6+rand()*.55,yaw},{...kit,rand});}
   }
  }
 }
}

function drawGlobeAmaranth(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,dry=s.seedHeads&&!s.bloom,green=dry?'#998e70':s.leafColor,leafKind=foliageKind(info),n=Math.max(6,Math.round((info.life==='annual'?12:18)*detail));
 const leaf=(at,an,size)=>b.add('leaf',leafKind,kit.shade(rand,green,.05),...at,size*.70,size,size,1.03,an,0);
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.30*Math.sqrt((i+.5)/n),top=h*(.66+rand()*.25),end=[Math.sin(an)*rr,top,Math.cos(an)*rr];let prev=[0,.005,0];
  for(let j=1;j<=6;j++){
   const t=j/7,at=[end[0]*t,end[1]*t,end[2]*t];b.branch(prev,at,.0014,green,'petiole');prev=at;
   if(!dry)for(const side of [-1,1])leaf(at,an+j*1.57+(side===1?Math.PI:0),Math.min(.075,h*.20)*(1-t*.3));
   if(j<3)continue;
   const sa=an+(j%2?1:-1)*.8,branchEnd=[at[0]+Math.sin(sa)*w*.14,Math.min(h,at[1]+h*.20),at[2]+Math.cos(sa)*w*.14];b.branch(at,branchEnd,.0009,green,'petiole');
   if(!dry)for(const side of [-1,1])leaf(branchEnd,sa+side*1.2,Math.min(.05,h*.14));
   if(!s.bloom&&!dry)continue;
   const flowerEnd=[branchEnd[0]+Math.sin(sa)*h*.045,branchEnd[1]+h*.09,branchEnd[2]+Math.cos(sa)*h*.045];b.branch(branchEnd,flowerEnd,.00075,green,'peduncle');
   detailedFlower(b,{x:flowerEnd[0],y:flowerEnd[1],z:flowerEnd[2],r:a.flowerRadius,color:dry?a.seedColor:s.flowerColor,shape:'amaranthHead',palette:dry?{dry:true}:a.flowerPalette},{...kit,rand});
  }
 }
}

function drawCranesbill(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,small=a.leafShape==='geraniumRound',n=Math.round(26*detail),leafKind=patternKind('leaf-palm',a.leafPattern,a.patternColor),size=Math.min(small?.032:.078,w*.19,h*.28);
 const leaf=(at,an,t)=>{
  const length=size*(1-t*.35)*(.8+rand()*.35),end=[at[0]+Math.sin(an)*length*.55,at[1]+length*.60,at[2]+Math.cos(an)*length*.55];
  b.branch(at,end,.00065,green,'petiole');b.add(a.leafShape,leafKind,kit.shade(rand,green,.06),...end,length,length,length,1.18+rand()*.25,an,0);
 };
 const flower=(at,an)=>{
  const end=[at[0]+Math.sin(an)*h*.08,at[1]+h*(small?.18:.14),at[2]+Math.cos(an)*h*.08],radius=a.flowerRadius||.02;
  b.branch(at,end,.00065,green,'peduncle');
  const color=a.flowerFadeTo?new THREE.Color(s.flowerColor).lerp(new THREE.Color(a.flowerFadeTo),rand()).getStyle():s.flowerColor;
  detailedFlower(b,{x:end[0],y:end[1],z:end[2],r:radius,color,shape:'cranesbill',pattern:a.flowerPattern,patternColor:a.flowerPatternColor,tilt:(rand()-.5)*.90,yaw:an},{...kit,rand});
 };
 for(let i=0;i<n;i++){
  const an=i*2.399,reach=w*(.10+rand()*.34),top=h*(.42+rand()*.30),point=t=>[Math.sin(an)*reach*t,top*Math.sin(t*Math.PI*.90)+.008,Math.cos(an)*reach*t];
  let prev=[0,.005,0];
  for(let j=1;j<=9;j++){
   const t=j/9,at=point(t);b.branch(prev,at,.0011*(1-t*.40),green,'petiole');prev=at;
   for(const side of [-1,1])leaf(at,an+side*(.9+j*.12),t);
   if(j<3||j%2===0)continue;
   const side=j%4===1?-1:1,sa=an+side*.88,tip=[at[0]+Math.sin(sa)*reach*.32,at[1]+h*.11,at[2]+Math.cos(sa)*reach*.32];b.branch(at,tip,.0007,green,'petiole');leaf(tip,sa,t);
   if(s.bloom&&rand()<s.flowerDensity)for(const offset of [-.7,.7])flower(tip,sa+offset);
  }
 }
}

function drawFloweringTobacco(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,large=info.latin.startsWith('Nicotiana mutabilis');
 for(let j=0;j<8;j++){
  const yaw=j*2.399,size=Math.min(large?.35:.23,w*.72)*(.65+rand()*.35);
  b.add('leaf',foliageKind(info),kit.shade(rand,green,.04),0,.004,0,size*.8,size,size,1.05+rand()*.20,yaw,0);
 }
 const top=[0,h*.87,0];b.branch([0,0,0],top,.005,green,'petiole');
 for(let j=0;j<6;j++){
  const t=.17+j*.11,yaw=j*2.399,size=Math.min(large?.26:.18,w*.53)*(1-t*.8);
  b.add('leaf',foliageKind(info),green,0,h*t,0,size*.75,size,size,1.1,yaw,0);
 }
 const count=Math.max(8,Math.round((large?30:23)*detail));
 for(let i=0;i<count;i++){
  const an=i*2.399,t=(i+.5)/count,origin=[0,h*(.38+t*.47),0],reach=w*.40*(1-t*.65),tip=[Math.sin(an)*reach,h*(.68+t*.29),Math.cos(an)*reach];
  b.branch(origin,tip,.0014,green,'petiole');
  if(!s.bloom)continue;
  for(let j=0;j<3;j++){
   const yaw=an+j*.8,at=[tip[0]+Math.sin(yaw)*.026,tip[1]-.015*j,tip[2]+Math.cos(yaw)*.026];b.branch(tip,at,.0006,green,'peduncle');
   const f=flowerFrame(b,at,large?1.7:2.6,yaw),r=a.flowerRadius||.012;
   const colour=a.flowerFadeTo?new THREE.Color(s.flowerColor).lerp(new THREE.Color(a.flowerFadeTo),rand()):s.flowerColor;
   const kind=a.flowerOutsideColor?'petal-underside-'+a.flowerOutsideColor.slice(1):'petal';
   f.add('trumpet',kind,colour,0,0,0,r,r*2.5,r);
   if(a.flowerEyeColor)f.add(kit.bud,'seed',a.flowerEyeColor,0,r*1.9,0,r*.20,r*.025,r*.20);
  }
 }
}

function drawChileanCrocus(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,n=Math.max(1,Math.round(4*detail));
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.20*Math.sqrt(i/n),x=Math.sin(an)*rr,z=Math.cos(an)*rr;
  for(let j=0;j<2+i%2;j++){
   const size=Math.min(.10,h*1.04)*(.78+rand()*.22);
   b.add('strap',foliageKind(info),kit.shade(rand,green,.035),x,0,z,size*.6,size,size,.15+j*.15,an+j*2.1,0);
  }
  if(!s.bloom)continue;
  const radius=a.flowerRadius||.018,top=Math.max(.012,h*(.75+rand()*.14)-radius*1.6);
  const at=[x+Math.sin(an)*.004,top,z+Math.cos(an)*.004];
  b.branch([x,0,z],at,.0012,green,'peduncle');
  detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:radius,color:s.flowerColor,shape:'chileanCrocus',patternColor:a.flowerPatternColor},{...kit,rand});
 }
}

function drawSedges(b,{info,s,detail,rand},kit){
 const h=s.height,w=s.spread,green=s.leafColor,n=Math.round(105*detail);
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.08*Math.sqrt((i+.5)/n),length=h*(.86+rand()*.36);
  b.add('blade',foliageKind(info),kit.shade(rand,green,.04),Math.sin(an)*rr,0,Math.cos(an)*rr,length*.32,length,length,.12+rand()*.65,an,0);
 }
 if(s.bloom)for(let i=0;i<9*detail;i++){
  const an=i*2.399,tip=[Math.sin(an)*w*.16,h*(.70+rand()*.15),Math.cos(an)*w*.16];
  b.branch([tip[0]*.2,0,tip[2]*.2],tip,.0008,green,'peduncle');
  for(let k=0;k<3;k++){
   const yy=tip[1]-k*.045,x=tip[0]+Math.sin(an)*k*.006,z=tip[2]+Math.cos(an)*k*.006;
   for(let j=0;j<18;j++){const yaw=j*2.399,t=j/18;b.add('narrow','seed','#89754e',x+Math.sin(yaw)*.002,yy+t*.02,z+Math.cos(yaw)*.002,.006,.005,.005,.7,yaw,0);}
  }
 }
}

function drawCreepingPhlox(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,n=Math.round(13*detail);
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.36*Math.sqrt((i+.5)/n),end=[Math.sin(an)*rr,h*.14,Math.cos(an)*rr];
  b.branch([0,.006,0],end,.0015,green,'petiole');
  for(let j=0;j<6;j++){
   const t=.15+j*.15,at=end.map(v=>v*t),size=Math.min(.045,w*.13);
   for(const side of [-1,1])b.add(a.leafShape||'leaf',foliageKind(info),kit.shade(rand,green,.045),...at,size*.65,size,size,1.30,an+side*Math.PI/2,0);
  }
  if(!s.bloom)continue;
  const top=h*(.70+rand()*.24);b.branch(end,[end[0],top,end[2]],.0012,green,'peduncle');
  for(let j=0;j<7;j++){
   const yaw=j*2.399,rr=Math.sqrt(j/7)*Math.min(.042,w*.12),at=[end[0]+Math.sin(yaw)*rr,top+rand()*.009,end[2]+Math.cos(yaw)*rr];
   b.branch([end[0],top-.02,end[2]],at,.0005,green,'peduncle');
   detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius||Math.min(.014,w*.07),shape:'salver',color:s.flowerColor},{...kit,rand});
  }
 }
}

function drawPineappleLily(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,n=Math.max(1,Math.round(3*detail));
 for(let i=0;i<n;i++){
  const an=i*2.399,x=Math.sin(an)*w*.12,z=Math.cos(an)*w*.12,top=h*(.84+.12*rand());
  for(let j=0;j<9;j++){
   const yaw=j*2.399+i,size=Math.min(h*.64,w*.65)*(.78+rand()*.2);
   b.add('wavyStrap',foliageKind(info),kit.shade(rand,green,.05),x,.008,z,size*1.8,size,size,.35+rand()*.75,yaw,0);
  }
  if(!s.bloom)continue;
  b.branch([x,0,z],[x,top*.92,z],.0065,green,'peduncle');
  // The top tuft belongs to the flower stalk, above the cylindrical raceme.
  for(let j=0;j<11;j++)b.add('wavyStrap',foliageKind(info),green,x,top*.91,z,h*.25,h*.15,h*.15,.6+rand()*.65,j*2.399,0);
  for(let j=0;j<Math.round(67*detail);j++){
   const t=j/(67*detail),yaw=j*2.399,at=[x+Math.sin(yaw)*.024,top*(.43+.43*t),z+Math.cos(yaw)*.024];
   b.branch([x,at[1],z],at,.001,green,'peduncle');
   detailedFlower(flowerFrame(b,at,1.25,yaw),{x:0,y:0,z:0,r:.013,color:s.flowerColor,shape:'star',petals:6,center:'#6a4155'},{...kit,rand});
  }
 }
}

function drawPeltatePairs(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,n=Math.max(1,Math.round(3*detail));
 for(let i=0;i<n;i++){
  const an=i*2.399,x=Math.sin(an)*w*.16,z=Math.cos(an)*w*.16,top=h*(.70+rand()*.18),joint=[x,top*.70,z],diameter=Math.min(.30,w*.56);
  b.branch([x*.5,0,z*.5],joint,.006,green,'petiole');
  for(const side of [-1,1]){
   const yaw=an+side*Math.PI/2,at=[x+Math.sin(yaw)*w*.18,top+(side<0?-.045:0),z+Math.cos(yaw)*w*.18];
   b.branch(joint,at,.004,green,'petiole');b.add('peltate',foliageKind(info),kit.shade(rand,green,.035),...at,diameter,diameter,diameter,1.48,yaw,side*.08);
  }
  if(s.bloom)for(let j=0;j<6;j++){
   const yaw=j*2.399,at=[x+Math.sin(yaw)*.035,joint[1]-.03-rand()*.04,z+Math.cos(yaw)*.035];
   b.branch(joint,at,.001,'#855352','peduncle');
   detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:.023,color:s.flowerColor,shape:'hangingStraps',petals:a.petals||7},{...kit,rand});
  }
 }
}

function drawBloodroot(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,n=Math.max(2,Math.round(9*detail));
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.31*Math.sqrt((i+.5)/n),x=Math.sin(an)*rr,z=Math.cos(an)*rr,top=h*(.67+rand()*.23),size=Math.min(.15,w*.42)*(s.bloom?.60:1),at=[x,top*.50,z];
  b.branch([x*.85,0,z*.85],at,.0018,green,'petiole');
  b.add('lobed',foliageKind(info),kit.shade(rand,green,.04),...at,size,size,size,s.bloom?.45:1.30,an,0);
  if(s.bloom){
   b.branch([x*.85,0,z*.85],[x,top,z],.0015,'#748251','peduncle');
   // Pink forms fade to white as each flower opens, not by changing all flowers at once.
   const color=a.flowerFadeTo?kit.shade(()=>.5,s.flowerColor,0).lerp(new THREE.Color(a.flowerFadeTo),rand()):s.flowerColor;
   detailedFlower(b,{x,y:top,z,r:.021,color,shape:'flat',petals:a.petals||10,layers:a.flowerLayers||1},{...kit,rand});
  }
 }
}

function drawFunnelUmbels(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,n=Math.max(2,Math.round(5*detail));
 for(let i=0;i<n;i++){
  const an=i*2.399,x=Math.sin(an)*w*.21,z=Math.cos(an)*w*.21,top=h*(.76+rand()*.2);
  for(let j=0;j<3;j++)b.add('strap',foliageKind(info),green,x,0,z,h*.45,h*.60,h*.60,.35+j*.16,an+j*2.1,0);
  if(!s.bloom)continue;
  const origin=[x,top*.78,z];b.branch([x,0,z],origin,.0025,green,'peduncle');
  for(let j=0;j<17;j++){
   const yaw=j*2.399,rr=Math.min(.095,w*.24)*Math.sqrt((j+.5)/17),at=[x+Math.sin(yaw)*rr,top-rr*.35,z+Math.cos(yaw)*rr];
   b.branch(origin,at,.00075,green,'peduncle');
   detailedFlower(flowerFrame(b,at,.65,yaw),{x:0,y:0,z:0,r:.014,color:s.flowerColor,shape:'trumpet',petals:6,pattern:a.flowerPattern,patternColor:a.flowerPatternColor},{...kit,rand});
  }
 }
}

function drawDistinctGrasses(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,mosquito=a.architecture==='mosquitoGrass',n=Math.max(12,Math.round((mosquito?60:48)*detail));
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.17*Math.sqrt((i+.5)/n),x=Math.sin(an)*rr,z=Math.cos(an)*rr,size=h*(mosquito?.36:.55)*(.6+rand()*.4);
  b.add('blade',foliageKind(info),kit.shade(rand,green,.05),x,0,z,size*(mosquito?.35:.5),size,size,.15+rand()*.7,an,0);
 }
 if(!s.bloom&&!s.seedHeads)return;
 const stems=Math.max(6,Math.round((mosquito?24:14)*detail)),color=s.bloom?(mosquito?'#847283':'#bba476'):(a.seedColor||'#a6987a');
 for(let i=0;i<stems;i++){
  const an=i*2.399,rr=w*.27*Math.sqrt((i+.5)/stems),x=Math.sin(an)*rr,z=Math.cos(an)*rr,top=h*(.65+rand()*.30),joint=[x*.55,top*.53,z*.55],tip=[x,top,z];
  b.branch([x*.14,0,z*.14],joint,.001,green,'peduncle');b.branch(joint,tip,.0008,green,'peduncle');
  if(mosquito){
   for(let k=0;k<2;k++){
    const start=[x,top-k*.04,z],len=.036+rand()*.016,end=[x+Math.sin(an)*len,top-k*.04,z+Math.cos(an)*len];
    b.branch(start,end,.0006,color,'seed');
    for(let j=0;j<27;j++){
     const t=j/26,at=[start[0]+(end[0]-start[0])*t,start[1],start[2]+(end[2]-start[2])*t],endlet=[at[0],at[1]-.008*(.7+Math.sin(t*Math.PI)*.3),at[2]];
     b.branch(at,endlet,.00032,color,'seed');b.add('narrow','seed',color,...at,.003,.009,.009,Math.PI,an,0);
    }
   }
  }else{
   const len=Math.min(.28,h*.24);
   for(let j=0;j<44;j++){
    const t=j/44,yaw=j*2.399,yy=top-len+t*len,reach=.04*(1-t)*(.5+rand()*.5),end=[x+Math.sin(yaw)*reach,yy+len*.08,z+Math.cos(yaw)*reach];
    b.branch([x,yy,z],end,.0005,color,'seed');
    for(let k=0;k<3;k++){
     const at=[end[0]+Math.sin(yaw+k)*.003,end[1]+k*.004,end[2]+Math.cos(yaw+k)*.003];
     b.add('narrow','seed',color,...at,.009,.012,.012,.2,yaw,0);
     b.branch(at,[at[0]+.003,at[1]+.016,at[2]],.00015,color,'seed');
     if(s.bloom)b.add(kit.bud,'petal','#d7bb65',at[0]+.002,at[1]+.004,at[2],.0009,.0025,.0009);
    }
   }
  }
 }
}

function drawRacemes(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,small=a.architecture==='squill',n=Math.max(1,Math.round((small?7:3)*detail));
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*(small?.25:.20)*Math.sqrt((i+.5)/n),x=Math.sin(an)*rr,z=Math.cos(an)*rr,top=h*(.82+rand()*.14);
  if(small){
   for(const side of [-1,1])b.add('strap',foliageKind(info),green,x,0,z,top*.50,top*.8,top*.8,.23,an+side*Math.PI/2,0);
  }else{
   b.branch([x,0,z],[x,top*.90,z],.0045,green,'petiole');
   for(let j=0;j<9;j++){
    const t=.05+j*.085,yaw=an+j*2.399,size=Math.min(.19,w*.49)*(1-t*.8),tip=[x+Math.sin(yaw)*size*.45,top*t,z+Math.cos(yaw)*size*.45];
    b.branch([x,top*t-size*.12,z],tip,.0012,green,'petiole');
    b.add(a.leafShape,foliageKind(info),kit.shade(rand,green,.05),...tip,size,size,size,1.20,yaw,0);
   }
  }
  if(!s.bloom||!a.flowerShape)continue;
  b.branch([x,0,z],[x,top,z],small?.0015:.0035,green,'peduncle');
  const florets=small?9:13;
  for(let j=0;j<florets;j++){
   const t=j/florets,yaw=an+j*2.399,yy=top*(small?.36+t*.57:.33+t*.63),reach=small?.013:Math.min(w*.20,.06),tip=[x+Math.sin(yaw)*reach,yy,z+Math.cos(yaw)*reach];
   b.branch([x,yy-.008,z],tip,small?.0006:.0015,green,'peduncle');
   detailedFlower(flowerFrame(b,tip,small?1.28:1.45,yaw),{x:0,y:0,z:0,r:small?.009:Math.min(.052,w*.21),color:s.flowerColor||info.flower,shape:a.flowerShape,petals:a.petals||5,layers:a.flowerLayers||1,pattern:a.flowerPattern,patternColor:a.flowerPatternColor},{...kit,rand});
  }
 }
}

function drawLeafyViolets(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,leaf=foliageKind(info),shape=a.leafMargin==='crenate'?'crenate':a.leafMargin==='serrated'?'serrated':a.leafShape||'leaf';
 const n=Math.max(10,Math.round(29*detail)),length=a.leafLength||Math.min(.055,w*.17),r=a.flowerRadius||Math.min(.022,w*.072);
 for(let i=0;i<n;i++){
  const an=i*2.399,rad=w*.37*Math.sqrt((i+.5)/n),x=Math.sin(an)*rad,z=Math.cos(an)*rad,top=h*(.42+.18*(1-rad/(w*.4))+rand()*.08);
  const root=[x*.3,.005,z*.3],elbow=[x*.70,top*.36,z*.70],end=[x,top,z];
  b.branch(root,elbow,.0011,green,'petiole');b.branch(elbow,end,.0009,green,'petiole');
  for(let j=0;j<6;j++){
   const t=.22+j*.125,yaw=an+j*2.399,at=[root[0]+(x-root[0])*t,top*t,root[2]+(z-root[2])*t],tip=[at[0]+Math.sin(yaw)*length*.2,at[1]+length*.07,at[2]+Math.cos(yaw)*length*.2];
   b.branch(at,tip,.00045,green,'petiole');
   b.add(shape,leaf,kit.shade(rand,green,.045),...tip,length*(.75+rand()*.20),length*(1-t*.22),length,1.13+rand()*.18,yaw,0);
   // Small stipules stay at the node rather than becoming extra opposite leaves.
   b.add('narrow',leaf,green,...at,length*.15,length*.30,length*.25,.80,yaw+1.2,0);
  }
  if(!s.bloom)continue;
  const flower=[x*1.03,Math.max(top+.025,h*(.69+.17*rand()))-r*.2,z*1.03],neck=[flower[0],flower[1]-r*.4,flower[2]-r*.18];
  b.branch([x*.86,top*.65,z*.86],neck,.00085,green,'peduncle');b.branch(neck,flower,.00065,green,'peduncle');
  for(let j=0;j<5;j++)b.add('narrow','leaf',green,...flower,r*.15,r*.42,r*.25,2.2,an+j*TAU/5,0);
  detailedFlower(b,{x:flower[0],y:flower[1],z:flower[2],r,color:info.flower,shape:'violet',pattern:a.flowerPattern,patternColor:a.flowerPatternColor,palette:a.flowerPalette,guides:a.flowerGuides,yaw:an,tilt:-.12},{...kit,rand});
 }
}

function drawNakedScapes(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,n=Math.max(2,Math.round(5*detail));
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.22*Math.sqrt((i+.5)/n),x=Math.sin(an)*rr,z=Math.cos(an)*rr;
  if(s.leafDensity>0)for(let k=0;k<6;k++){
   const length=Math.min(h*.8,s.leafHeight)*(1-rand()*.13);
   b.add('strap',foliageKind(info),kit.shade(rand,green,.04),x,0,z,length*.6,length,length,.14+k*.055,an+k*2.399,0);
  }
  if(!s.bloom)continue;
  const top=h*(.68+rand()*.20);b.branch([x,0,z],[x,top,z],.0032,green,'peduncle');
  for(let j=0;j<6;j++){
   const yaw=j*TAU/6+an,reach=Math.min(w*.14,.05),tip=[x+Math.sin(yaw)*reach,top+h*.025,z+Math.cos(yaw)*reach];
   b.branch([x,top,z],tip,.0012,green,'peduncle');
   detailedFlower(flowerFrame(b,tip,.76,yaw),{x:0,y:0,z:0,r:a.flowerRadius||.034,color:info.flower,shape:a.flowerShape,petals:6,pattern:a.flowerPattern,patternColor:a.flowerPatternColor},{...kit,rand});
  }
 }
}

function drawSnowdrops(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,n=Math.max(3,Math.round(9*detail));
 for(let i=0;i<n;i++){
  const angle=i*2.399,rr=w*.26*Math.sqrt((i+.5)/n),x=Math.sin(angle)*rr,z=Math.cos(angle)*rr,top=h*(.79+rand()*.14),length=top*.78;
  for(const side of [-1,1])b.add('strap',foliageKind(info),kit.shade(rand,green,.04),x,.008,z,length*.53,length,length,.15+rand()*.1,angle+side*Math.PI/2,0);
  const bend=[x,top-h*.05,z],neck=[x+Math.sin(angle)*h*.09,top,z+Math.cos(angle)*h*.09],tip=[x+Math.sin(angle)*h*.15,top-h*.07,z+Math.cos(angle)*h*.15];
  if(!s.bloom)continue;
  b.branch([x,0,z],bend,.0014,green,'petiole');b.branch(bend,neck,.0011,green,'petiole');b.branch(neck,tip,.0009,green,'petiole');
  b.add('narrow','leaf',green,...bend,h*.08,h*.15,h*.08,.8,angle,0);
  detailedFlower(b,{x:tip[0],y:tip[1],z:tip[2],r:Math.min(.025,h*.095),shape:'snowdrop',color:'#f5f4e9',layers:a.flowerLayers||1,outerPattern:a.outerFlowerPattern},{...kit,rand});
 }
}

function drawFans(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,large=info.latin.startsWith('Phormium'),n=Math.max(3,Math.round((large?4:7)*detail));
 for(let i=0;i<n;i++){
  const angle=i*2.399,rr=w*.19*Math.sqrt(i/n),x=Math.sin(angle)*rr,z=Math.cos(angle)*rr,leafH=Math.min(s.leafHeight,h*(large?.96:.73));
  for(let j=-3;j<=3;j++){
   const pitch=Math.abs(j)*.19,length=leafH*(1-Math.abs(j)*.09)*(1+rand()*.08),yaw=angle+(j<0?Math.PI:0);
   b.add('sword',foliageKind(info),kit.shade(rand,green,.04),x,.006,z,length*(large?1:.36),length,length,pitch,yaw,0);
  }
  if(!s.bloom||!a.flowerShape)continue;
  const top=h*(.86+rand()*.12);b.branch([x,0,z],[x,top,z],large?.004:.001,green,'petiole');
  if(!large){
   b.add('sword','leaf',green,x,top-.035,z,.045,.05,.045,.35,angle,0);
   detailedFlower(b,{x,y:top,z,r:a.flowerRadius||.012,color:info.flower,shape:a.flowerShape,petals:6,center:'#d2b339'},{...kit,rand});
  }else for(let k=0;k<8;k++){
   const an=k*2.399,yy=top-h*.23+k*h*.028,end=[x+Math.sin(an)*w*.12,yy+h*.03,z+Math.cos(an)*w*.12];
   b.branch([x,yy,z],end,.0015,green,'petiole');
   for(let f=0;f<3;f++)detailedFlower(b,{x:end[0],y:end[1]+f*.016,z:end[2],r:.014,color:info.flower,shape:'tube',tilt:.85,yaw:an},{...kit,rand});
  }
 }
}

function drawQuakingGrass(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,green=s.leafColor,n=Math.max(5,Math.round(19*detail));
 for(let i=0;i<n;i++){
  const angle=i*2.399,rr=w*.16*Math.sqrt((i+.5)/n),x=Math.sin(angle)*rr,z=Math.cos(angle)*rr,length=s.leafHeight*(.7+rand()*.3);
  b.add('blade',foliageKind(info),kit.shade(rand,green,.07),x,0,z,length*.34,length,length,.10,angle,0);
  if(!s.bloom&&!s.seedHeads)continue;
  const top=h*(.80+rand()*.18),tip=[x+Math.sin(angle)*w*.12,top,z+Math.cos(angle)*w*.12];
  b.branch([x,0,z],tip,.0008,green,'petiole');
  for(let j=0;j<6;j++){
   const an=angle+j*2.399,yy=top-j*h*.025,reach=w*(.07+j*.013),elbow=[tip[0]+Math.sin(an)*reach,yy+h*.04,tip[2]+Math.cos(an)*reach],end=[elbow[0]+Math.sin(an)*.009,yy-h*.025,elbow[2]+Math.cos(an)*.009];
   b.branch([tip[0],yy-h*.08,tip[2]],elbow,.0004,green,'petiole');b.branch(elbow,end,.0003,green,'petiole');
   detailedFlower(b,{x:end[0],y:end[1],z:end[2],r:Math.min(.009,h*.021),shape:'spikelet',color:s.seedHeads?(a.seedColor||'#b2a078'):'#8c9970',yaw:an},{...kit,rand});
  }
 }
}

function drawCelosias(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,dracula=a.architecture==='celosiaDracula',crest=dracula||a.architecture==='celosiaCrest',plume=a.architecture.includes('Plume'),open=a.architecture==='celosiaOpenPlume',green=s.leafColor,stem=a.stemColor,heads=[],flowerLength=Math.min(a.inflorescenceLength,h*.35),main=[w*.018,h-flowerLength,0];
 const leafAt=(at,yaw,size)=>{const end=[at[0]+Math.sin(yaw)*size*.13,at[1]+size*.05,at[2]+Math.cos(yaw)*size*.13];b.branch(at,end,.00065,stem,'petiole');b.add(a.leafShape,foliageKind(info),kit.shade(rand,green,.07),...end,size*(a.leafShape==='wavyLance'?1.5:1),size,size,.82+rand()*.7,yaw,(rand()-.5)*.15);};
 b.branch([0,.003,0],main,dracula?.005:.0035,stem,'stem');
 for(let j=0;j<11;j++){const t=.12+j*.08,at=main.map(v=>v*t),yaw=j*2.399;leafAt(at,yaw,Math.min(a.leafLength,w*.45)*(.72+.28*Math.sin(t*Math.PI)));}
 heads.push({at:main,len:flowerLength,yaw:.3});
 if(!dracula)for(let j=0;j<Math.round((crest?7:12)*detail);j++){
  const t=.22+j*.048,root=main.map(v=>v*t),yaw=j*2.399,rr=w*(.26+rand()*.08),len=flowerLength*(.50+rand()*.33),tip=[Math.sin(yaw)*rr,h*(.57+rand()*.26)-len,Math.cos(yaw)*rr];
  b.branch(root,tip,.0018,stem,'stem');
  for(let k=1;k<6;k++){const f=k/6,at=root.map((v,i)=>v+(tip[i]-v)*f);leafAt(at,yaw+k*2.399,Math.min(a.leafLength,w*.35)*(.75-f*.30));}
  heads.push({at:tip,len,yaw});
 }
 if(!s.bloom)return;
 const littleSpike=(frame,origin,length,width,color,tipColor)=>{
  frame.branch(origin,[origin[0],origin[1]+length,origin[2]],Math.min(.0012,width*.18),color,'rachis');
  frame.add(kit.bud,'sepal',color,origin[0],origin[1]+length*.43,origin[2],width*.90,length*.43,width*.90);
  for(let k=0;k<110;k++){
   const t=(k+.5)/110,an=k*2.399,rr=width*Math.pow(Math.sin(Math.PI*t),.7),at=[origin[0]+Math.sin(an)*rr,origin[1]+t*length,origin[2]+Math.cos(an)*rr],scale=Math.min(.005,length*.16)*(1-t*.45),col=kit.shade(rand,t>.67?tipColor:color,.05);
   for(let q=0;q<3;q++)frame.add('celosiaTepal','sepal',col,...at,scale*.40,scale,scale,.30+q*.15,an+q*TAU/3,0);
   if(k%7===0&&t<.60)frame.add(kit.bud,'anther',col,at[0],at[1]+scale*.7,at[2],.00055,.0006,.00055);
  }
 };
 for(const {at,len,yaw} of heads){
  const f=flowerFrame(b,at,.07+rand()*.14,yaw),col=a.flowerPalette?.chimera&&rand()>.5?a.flowerPalette.tip:s.flowerColor,tip=a.flowerPalette?.tip||col;
  if(crest){
   f.add('celosiaCrest','sepal-celosia-velvet',col,0,0,0,len*(dracula?1.25:.8),len,len*(dracula?1.2:1),0,.25,0);
   for(let j=0;j<180;j++){const t=.10+rand()*.8,an=j*2.399,profile=Math.pow(Math.sin(t*Math.PI),.66),fold=1+.22*Math.sin(an*11+t*10)+.10*Math.sin(an*23-t*17),at=[Math.cos(an)*profile*fold*.82*len*(dracula?1.25:.8),t*len,Math.sin(an)*profile*fold*.38*len*(dracula?1.2:1)];f.add(kit.bud,'sepal-celosia-velvet',a.flowerPalette?.tip!==s.flowerColor&&Math.sin(an*3+t*12)>.85?tip:kit.shade(rand,col,.10),...at,len*.013,len*.020,len*.013);}
  }else if(plume){
   littleSpike(f,[0,0,0],len,Math.min(.009,len*.08),col,tip);
   for(let k=0;k<(open?7:16);k++){
    const t=.08+k*(open?.075:.042),an=k*2.399,branch=flowerFrame(f,[0,len*t,0],(open?.8:.48)+(rand()-.5)*.14,an),length=len*(open?.65:.57)*(1-t*.60);
    littleSpike(branch,[0,0,0],length,Math.min(.0065,length*.08),a.flowerPalette?.base&&k<3?a.flowerPalette.base:col,tip);
   }
  }else littleSpike(f,[0,0,0],len,Math.min(.014,len*.16),col,tip);
 }
}

function drawMonardas(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,tiered=a.architecture==='tieredMonarda',winter=s.winter,dry=s.seedHeads&&!s.bloom,green=s.leafColor,n=Math.max(3,Math.round((tiered?7:13)*detail));
 if(winter&&!tiered){
  if(a.persistence==='semiDormant')for(let j=0;j<16;j++){const an=j*2.399,rr=w*.22*Math.sqrt((j+.5)/16);b.add('ovateSerrate','leaf',green,Math.sin(an)*rr,.006,Math.cos(an)*rr,.020,.023,.023,1.1,an,0);}
  if(!a.standingWinter)return;
 }
 for(let i=0;i<n;i++){
  const yaw=i*2.399,rr=w*.32*Math.sqrt((i+.4)/n),root=[Math.sin(yaw)*rr*.8,.005,Math.cos(yaw)*rr*.8],top=[Math.sin(yaw)*rr,h*(.78+(Math.sin(i*2.73)+1)*.085),Math.cos(yaw)*rr],nodes=tiered?8:9;
  const color=dry?'#897360':a.stemColor;
  // Four-sided cross section is visible at the stem tips and leaf nodes.
  const vec=new THREE.Vector3(...top).sub(new THREE.Vector3(...root)),q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),vec.clone().normalize()),e=new THREE.Euler().setFromQuaternion(q,'YXZ');
  b.add('squareStem','stem',color,...root,.003,vec.length(),.003,e.x,e.y,e.z);
  if(!winter)for(let j=1;j<nodes;j++){
   const t=(j+.16*Math.sin(i*4.1+j*2.9))/nodes,at=root.map((v,k)=>v+(top[k]-v)*t),len=Math.min(a.leafLength,w*.31)*(1-t*.38);
   if(s.leafDensity>0)for(const side of [0,Math.PI]){const an=yaw+j*Math.PI/2+side;b.add(a.leafShape,foliageKind(info),kit.shade(rand,green,.055),...at,len,len,len,1.08+rand()*.25,an,0);}
  }
  if(s.bloom||dry)for(let j=0;j<(tiered?4:1);j++){
   const t=tiered?.60+j*.12:1,at=root.map((v,k)=>v+(top[k]-v)*t);
   detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius*(tiered?1-j*.09:1),color:s.flowerColor,shape:'monardaHead',palette:{...a.flowerPalette,tiered,dry},tilt:.05+rand()*.12,yaw},{...kit,rand});
  }
 }
}

function drawGaillardias(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,compact=a.architecture==='compactGaillardia',green=s.leafColor,n=Math.max(5,Math.round((compact?18:15)*detail)),heads=[];
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.33*Math.sqrt((i+.5)/n),root=[Math.sin(an)*rr*.50,.007,Math.cos(an)*rr*.50],low=[Math.sin(an)*rr*.8,h*.19,Math.cos(an)*rr*.8],top=[Math.sin(an)*rr,h*(.55+rand()*.38),Math.cos(an)*rr];
  b.branch(root,low,.0016,green,'stem');b.branch(low,top,.0011,green,'peduncle');
  for(let j=0;j<7;j++){
   const t=.12+j*.105,at=root.map((v,k)=>v+(low[k]-v)*t),yaw=an+j*2.399,len=Math.min(a.leafLength,w*.33)*(.74+rand()*.25);b.add(a.leafShape,foliageKind(info),kit.shade(rand,green,.05),...at,len,len,len,.80+rand()*.55,yaw,0);
  }
  for(let j=1;j<3;j++){const t=j*(compact?.16:.12),at=low.map((v,k)=>v+(top[k]-v)*t),len=Math.min(a.leafLength*.48,w*.16);b.add('wavyLance',foliageKind(info),green,...at,len,len,len,1.1,an+j*2.399,0);}
  heads.push({at:top,yaw:an,dry:i%7===0});
 }
 if(s.bloom||s.seedHeads)for(const {at,yaw,dry} of heads){
  detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius*(.87+rand()*.13),color:s.flowerColor,shape:'gaillardiaHead',petals:a.petals,pattern:a.flowerPattern,patternColor:a.flowerPatternColor,palette:{...a.flowerPalette,dry:dry||!s.bloom},tilt:.20+rand()*.5,yaw},{...kit,rand});
 }
}

function drawBasalFlowerForms(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,prim=a.architecture==='primroseRosette',gerb=a.architecture==='gerberaRosette',br=!prim&&!gerb,green=s.leafColor,stem=a.stemColor;
 if(s.groundDormant)return;
 const kind=br&&a.leafPattern?foliageKind(info):prim||br?'leaf-rugose':foliageKind(info),leafSize=Math.min(a.leafLength,w*(br?.37:.52),h*(prim?1.0:gerb?.80:.49)),leafCount=Math.max(7,Math.round((prim?28:gerb?19:23)*detail*s.leafDensity));
 for(let j=0;j<leafCount;j++){
  const an=j*2.399,outer=j/leafCount,len=leafSize*(.62+.38*outer),base=[Math.sin(an)*w*.025,.004,Math.cos(an)*w*.025],tip=br?[Math.sin(an)*w*.17,h*(.20+.12*rand()),Math.cos(an)*w*.17]:base;
  if(br)b.branch(base,tip,Math.min(.0016,w*.004),stem,'petiole');
  b.add(a.leafShape,kind,kit.shade(rand,green,.07),...tip,len,len,len,br?.82+outer*.45:prim?.30+outer*1.01:.27+outer*.94,an,(rand()-.5)*.11);
 }
 if(!s.bloom)return;
 const heads=Math.max(2,Math.round((prim?10:gerb?7:9)*detail*s.flowerDensity));
 for(let j=0;j<heads;j++){
  const an=j*2.399,rr=w*(prim?.20:gerb?.18:.22)*Math.sqrt((j+.5)/heads),tip=[Math.sin(an)*rr,h*(prim&&!a.flowerPalette?.umbel?.61+rand()*.15:.73+rand()*.22),Math.cos(an)*rr],root=[tip[0]*.1,.006,tip[2]*.1],r=Math.min(a.flowerRadius,h*(prim?.25:.30));
  b.branch(root,tip,Math.min(gerb?.0028:br?.0007:.0013,h*.016),stem,'scape');
  if(gerb)for(let k=0;k<22;k++){const t=.08+k*.039,aa=k*2.399,at=root.map((v,n)=>v+(tip[n]-v)*t);b.branch(at,[at[0]+Math.sin(aa)*.0018,at[1]+.001,at[2]+Math.cos(aa)*.0018],.00009,'#bdc4ac','scapeHair');}
  const flower=(at,size,pitch,yaw,palette=a.flowerPalette)=>detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:size,color:prim&&palette.aged&&j%3===1?palette.aged:s.flowerColor,shape:a.flowerShape,layers:a.flowerLayers||1,palette:palette||{},tilt:pitch,yaw},{...kit,rand});
  if(br){
   for(let k=0;k<7;k++){
    const angle=an+k*2.399,at=[tip[0]+Math.sin(angle)*w*.11,tip[1]+h*(.025+k*.018),tip[2]+Math.cos(angle)*w*.11],start=[tip[0]*.8,tip[1]*.80,tip[2]*.8];b.branch(start,at,.0004,stem,'pedicel');
    for(let f=0;f<3;f++){const aa=angle+f*2.0,end=[at[0]+Math.sin(aa)*.011,at[1]+f*.009,at[2]+Math.cos(aa)*.011];b.branch(at,end,.00022,stem,'pedicel');flower(end,r,.50+rand()*.45,aa);}
   }
  }else if(prim&&a.flowerPalette?.umbel){
   for(let k=0;k<4;k++){const angle=an+k*TAU/4,end=[tip[0]+Math.sin(angle)*r*1.25,tip[1]+r*.5,tip[2]+Math.cos(angle)*r*1.25];b.branch(tip,end,.0006,stem,'pedicel');flower(end,r,.55,angle);}
  }else flower(tip,r,gerb?.30+rand()*.65:.25+rand()*.50,an);
 }
}

function drawLowFlowerMats(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,h=s.height,w=s.spread,tap=a.architecture==='tapienMat',n=Math.max(5,Math.round((tap?36:12)*detail)),green=s.leafColor,stem=a.stemColor,leaf=foliageKind(info),nodes=7;
 for(let i=0;i<n;i++){
  const an=i*2.399,length=w*(.28+rand()*.18),root=[0,.007,0];let from=root;
  for(let k=1;k<=nodes;k++){
   const t=k/nodes,aa=an+Math.sin(k*.73+i)*.12,at=[Math.sin(aa)*length*t,.008+h*(tap?.13:.045)*Math.sin(t*Math.PI),Math.cos(aa)*length*t];
   b.branch(from,at,tap?.0007:.001,stem,'stolon');
   if(k%2===0)b.branch(at,[at[0],0,at[2]],.00035,'#918266','nodeRoot');
   for(const side of [0,Math.PI])if(rand()<s.leafDensity){const len=Math.min(a.leafLength,w*(tap?.10:.13))*(.68+rand()*.30);b.add(a.leafShape,leaf,kit.shade(rand,green,.05),...at,len,len,len,tap?-1.18:1.18,aa+Math.PI/2+side,0);}
   if(s.bloom&&k%2===1&&rand()<s.flowerDensity){
    const tip=[at[0]+Math.sin(aa)*w*.025,h*(.67+rand()*.29),at[2]+Math.cos(aa)*w*.025];b.branch(at,tip,.0007,stem,'flowerStem');
    for(let l=1;l<=(tap?4:2);l++)for(const side of [0,Math.PI]){const t2=l*(tap?.16:.21),pt=at.map((v,d)=>v+(tip[d]-v)*t2),len=a.leafLength*(tap?.63:.40);b.add(a.leafShape,leaf,green,...pt,len,len,len,tap?-.90:.90,aa+l+side,0);}
    const count=tap?14:4,rad=tap?a.headRadius:a.flowerRadius*1.1;
    for(let f=0;f<count;f++){const a2=f*2.399,rr=rad*Math.sqrt((f+.5)/count),end=[tip[0]+Math.sin(a2)*rr,tip[1]+rad*.3*(1-rr/rad),tip[2]+Math.cos(a2)*rr];b.branch(tip,end,.0002,stem,'pedicel');detailedFlower(b,{x:end[0],y:end[1],z:end[2],r:a.flowerRadius,color:s.flowerColor,shape:a.flowerShape,tilt:tap?.12:.25,yaw:a2},{...kit,rand});}
   }
   from=at;
  }
 }
}

function drawWoodlandSpecies(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,h=s.height,w=s.spread,arch=a.architecture,green=s.leafColor,stem=a.stemColor,kind=foliageKind(info),leafSize=Math.min(a.leafLength,w*.44),density=s.leafDensity,n=Math.max(2,Math.round((arch==='saururusRaceme'?8:arch==='cornusHerb'?12:arch==='araliaHerb'?3:5)*detail*density));
 const flower=(at,pitch=0,yaw=0,r=a.flowerRadius)=>detailedFlower(b,{x:at[0],y:at[1],z:at[2],r,color:s.flowerColor,shape:a.flowerShape,tilt:pitch,yaw},{...kit,rand});
 const leaf=(origin,len,pitch,yaw,color=green,shape=a.leafShape,component=kind)=>b.add(shape,component,kit.shade(rand,color,.045),...origin,len,len,len,pitch,yaw,0);
 const stalk=(from,to,r=.001)=>b.branch(from,to,r,stem,'stem');
 const fruit=(at,index=0)=>{const rr=a.fruitRadius||.004;b.add(kit.bud,'fruit',s.fruitStage==='early'?'#809b61':a.fruitColor,...at,rr,rr*1.12,rr);if(arch==='diphylleiaUmbrella')b.add(kit.bud,'fruitBloom','#8797af',at[0],at[1]+rr*.18,at[2],rr*.97,rr*.93,rr*.97);};
 const compound=(from,length,pitch,yaw,twice=false)=>{
  const f=flowerFrame(b,from,pitch,yaw);f.branch([0,0,0],[0,length,0],.0007,stem,'rachis');
  if(twice){
   for(let k=0;k<2;k++)for(const side of [-1,1]){
    const base=[0,length*(.26+k*.34),0],ln=length*(.52-k*.10),theta=side*.93,tip=[Math.sin(theta)*ln,base[1]+Math.cos(theta)*ln,0];f.branch(base,tip,.0008,stem,'secondaryRachis');
    for(let j=0;j<2;j++)for(const ss of [-1,1]){const t=.33+j*.36,pt=base.map((v,d)=>v+(tip[d]-v)*t),ll=ln*(.72-j*.08);f.add('araliaLeaflet',kind,kit.shade(rand,green,.05),...pt,ll,ll,ll,.10,0,-theta+ss*1.10);}
    const terminal=ln*.77;f.add('araliaLeaflet',kind,green,...tip,terminal,terminal,terminal,.10,0,-theta);
   }
   f.add('araliaLeaflet',kind,green,0,length*.90,0,length*.42,length*.42,length*.42,.08,0,0);return;
  }
  for(let k=0;k<3;k++)for(const side of [-1,1]){
   const t=.28+k*.23,at=[0,length*t,0],ln=length*(.39-k*.05),rotation=-side*1.04;
   f.add(a.leafShape,kind,kit.shade(rand,green,.05),...at,ln,ln,ln,.08,0,rotation);
  }
  f.add(twice?'araliaLeaflet':a.leafShape,kind,green,0,length*.90,0,length*.42,length*.42,length*.42,.08,0,0);
 };
 if(['jeffersoniaBasal','eomeconBasal','parnassiaScapes','pteridophyllumFern'].includes(arch)){
  const fern=arch==='pteridophyllumFern',parn=arch==='parnassiaScapes',eo=arch==='eomeconBasal',total=Math.max(5,Math.round((fern?17:parn?25:18)*detail*density));
  for(let j=0;j<total;j++){
   const an=j*2.399,rr=w*.18*Math.sqrt((j+.5)/total),origin=[Math.sin(an)*rr*.4,.005,Math.cos(an)*rr*.4],at=[Math.sin(an)*rr,h*(parn?.08:eo?.35:.45),Math.cos(an)*rr],len=leafSize*(.72+rand()*.28);
   if(fern){
    const f=flowerFrame(b,origin,.35+j/total*.89,an);f.branch([0,0,0],[0,len,0],.0006,green,'leafRachis');
    for(let k=0;k<19;k++)for(const side of [-1,1]){const t=.12+k*.045,ll=len*.22*Math.pow(Math.sin(Math.PI*t),.72);f.add('narrow','leaf',kit.shade(rand,green,.05),0,len*t,0,ll*.61,ll,ll,.08,0,-side*(1.1+.20*t));}
   }else {b.branch(origin,at,.0007,eo?'#92b4a7':stem,'petiole');leaf(at,len,eo?1.2:.91,an);}
  }
  if(!s.bloom)return;
  const flowers=Math.max(2,Math.round((fern?4:parn?7:eo?5:9)*detail*s.flowerDensity));
  for(let j=0;j<flowers;j++){
   const an=j*2.399,rr=w*.22*Math.sqrt((j+.5)/flowers),top=[Math.sin(an)*rr,h*(.73+rand()*.23),Math.cos(an)*rr];stalk([top[0]*.3,.007,top[2]*.3],top,fern?.00065:.001);
   if(parn){const at=[top[0]*.66,top[1]*.42,top[2]*.66];leaf(at,leafSize*.80,.85,an+2.1);flower(top,.12,an);}
   else if(fern){for(let k=0;k<11;k++){const t=.48+k*.045,at=[top[0]*t,top[1]*t,top[2]*t],aa=an+k*2.399,end=[at[0]+Math.sin(aa)*.014,at[1]-.005,at[2]+Math.cos(aa)*.014];b.branch(at,end,.0003,stem,'pedicel');flower(end,0,aa);}}
   else if(eo){for(let k=0;k<3;k++){const aa=an+k*2.399,end=[top[0]+Math.sin(aa)*w*.10,top[1]+h*(k*.04),top[2]+Math.cos(aa)*w*.10];stalk([top[0]*.8,top[1]*.72,top[2]*.8],end,.0007);flower(end,.1,aa);}}
   else flower(top,.2,an);
  }return;
 }
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.27*Math.sqrt((i+.5)/n),root=[Math.sin(an)*rr*.50,.005,Math.cos(an)*rr*.50],top=[Math.sin(an)*rr,h*(.70+rand()*.20),Math.cos(an)*rr];
  stalk(root,top,arch==='araliaHerb'?.004:arch==='kirengeshomaBells'?.0025:arch==='cornusHerb'?.0007:.0017);
  const at=t=>root.map((v,k)=>v+(top[k]-v)*t);
  if(arch==='diphylleiaUmbrella'){
   for(let k=0;k<2;k++){const from=at(.65+k*.15),aa=an+k*Math.PI,end=[from[0]+Math.sin(aa)*w*.16,from[1]+h*.06,from[2]+Math.cos(aa)*w*.16];b.branch(from,end,.0012,stem,'petiole');leaf(end,Math.min(leafSize*(k?.74:1.10),w*.53),1.42,aa);}
  }else if(arch==='ranzaniaTrifoliate'){
   for(let k=0;k<2;k++){const from=at(.48+k*.24),aa=an+k*Math.PI,end=[from[0]+Math.sin(aa)*w*.18,from[1]+h*.10,from[2]+Math.cos(aa)*w*.18];b.branch(from,end,.0009,stem,'petiole');for(let j=0;j<3;j++){const az=aa+(j-1)*1.10,len=leafSize*(j===1?1:.8),tip=[end[0]+Math.sin(az)*len*.16,end[1]+.005,end[2]+Math.cos(az)*len*.16];b.branch(end,tip,.0005,stem,'petiolule');leaf(tip,len,1.20,az);}}
  }else if(arch==='deinantheCymes'||arch==='kirengeshomaBells'||arch==='cornusHerb'){
   const dein=arch==='deinantheCymes',corn=arch==='cornusHerb',pairs=dein?2:corn?4:4;
   for(let k=0;k<pairs;k++)for(const side of [0,Math.PI]){const t=dein?.61+k*.20:.23+k*.17,from=at(t),aa=an+k*1.57+side,len=leafSize*(dein?1:corn?.65+.09*k:1-k*.11),end=[from[0]+Math.sin(aa)*len*.15,from[1]+len*.08,from[2]+Math.cos(aa)*len*.15];b.branch(from,end,.0005,stem,'petiole');leaf(end,len,1.17,aa);}
  }else if(arch==='hylomeconPinnate'){
   for(let k=0;k<4;k++){const aa=an+k*2.399;compound(k<2?root:at(.51+k*.07),leafSize*2.2,1.16,aa);}
  }else if(arch==='araliaHerb'){
   for(let k=0;k<5;k++)compound(at(.23+k*.135),Math.min(w*.37,.37)*(1-k*.065),.9+k*.08,an+k*2.399,true);
  }else if(arch==='saururusRaceme'){
   for(let k=0;k<7;k++){const from=at(.22+k*.10),aa=an+k*2.399,len=leafSize*(k<4?1:.87-(k-4)*.10),end=[from[0]+Math.sin(aa)*len*.14,from[1]+len*.04,from[2]+Math.cos(aa)*len*.14],white=s.bloom&&k>=4;b.branch(from,end,.0006,stem,'petiole');leaf(end,len,1.04,aa,white?'#e1e3cb':green,a.leafShape,white?'leaf-whiteFloral':kind);}
  }
  if(arch==='saururusRaceme'&&s.bloom){
   let prev=top;const length=Math.min(.16,h*.30);
   for(let j=0;j<48;j++){
    const t=(j+1)/48,pt=[top[0]+Math.sin(an)*length*.63*t,top[1]+length*(Math.sin(t*Math.PI*.85)*.45-.12*t),top[2]+Math.cos(an)*length*.63*t];b.branch(prev,pt,.00065,stem,'raceme');
    for(let side=0;side<2;side++){const aa=j*2.399+side*Math.PI,base=[pt[0]+Math.sin(aa)*.002,pt[1],pt[2]+Math.cos(aa)*.002];for(let k=0;k<6;k++){const ak=k*TAU/6,end=[base[0]+Math.sin(ak)*.0012,base[1]+.0017,base[2]+Math.cos(ak)*.0012];b.branch(base,end,.00009,'#dedfc6','filament');b.add(kit.bud,'anther','#e8e5ce',...end,.00035,.0005,.0003);}}prev=pt;
   }continue;
  }
  if(!(s.bloom||s.fruitStage&&a.fruitMonths))continue;
  const count=arch==='araliaHerb'?12:arch==='cornusHerb'?1:arch==='hylomeconPinnate'?2:arch==='ranzaniaTrifoliate'?4:arch==='kirengeshomaBells'?4:arch==='deinantheCymes'?7:9;
  for(let j=0;j<count;j++){
   const aa=an+j*2.399,radius=w*(arch==='araliaHerb'?.17:arch==='cornusHerb'?0:.11)*Math.sqrt((j+.5)/count),hanging=arch==='ranzaniaTrifoliate'||arch==='kirengeshomaBells'||arch==='deinantheCymes',end=[top[0]+Math.sin(aa)*radius,top[1]+(hanging?-1:1)*h*(.02+j*.010),top[2]+Math.cos(aa)*radius];
   b.branch(arch==='araliaHerb'?at(.72+j*.02):top,end,.0006,stem,'pedicel');
   if(arch==='araliaHerb')for(let k=0;k<23;k++){const theta=k*2.399,cos=1-2*(k+.5)/23,sin=Math.sqrt(1-cos*cos),rr=.015,pt=[end[0]+Math.sin(theta)*sin*rr,end[1]+cos*rr,end[2]+Math.cos(theta)*sin*rr];b.branch(end,pt,.00025,stem,'umbelRay');if(s.bloom)flower(pt,Math.acos(cos),theta);else fruit(pt,k);}
   else if(s.bloom)flower(end,arch==='deinantheCymes'?.32:0,aa);
   else if(arch==='cornusHerb')for(let k=0;k<7;k++){const theta=k*2.399,rr=.005*Math.sqrt((k+.5)/7);fruit([end[0]+Math.sin(theta)*rr,end[1]+.002,end[2]+Math.cos(theta)*rr],k);}
   else fruit(end,j);
  }
 }
}

function drawSpurgesAndGaura(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,h=s.height,w=s.spread,arch=a.architecture,green=s.leafColor,stem=a.stemColor,pal=a.flowerPalette||{},kind=foliageKind({...info,appearance:{...a,patternColor:s.leafPatternColor}}),leafSize=Math.min(a.leafLength,w*.37),density=s.leafDensity;
 const line=(from,to,r,component='stem',color=stem)=>b.branch(from,to,r,color,component);
 const leaf=(at,len,an,pitch=1.05)=>b.add(a.leafShape,kind,kit.shade(rand,green,.055),...at,len,len,len,pitch,an,(rand()-.5)*.38);
 const flower=(at,r=a.flowerRadius,pitch=.16,an=0)=>detailedFlower(b,{x:at[0],y:at[1],z:at[2],r,color:s.flowerColor,shape:a.flowerShape,palette:pal,tilt:pitch,yaw:an},{...kit,rand});
 if(arch==='gauraWands'){
  const n=Math.max(4,Math.round((pal.compact?15:19)*detail*density)),active=s.bloom||s.month>Math.max(...a.flowerMonths),shootHeight=active?h:h*.39;
  for(let j=0;j<Math.round(32*detail*density);j++){const an=j*2.399,rr=w*.10*Math.sqrt((j+.5)/32);leaf([Math.sin(an)*rr,.01,Math.cos(an)*rr],leafSize*(.7+rand()*.4),an,.50+rand()*.9);}
  const wand=(from,an,height,radius,index)=>{
   const path=t=>[from[0]+Math.sin(an)*radius*t*t,from[1]+height*t,from[2]+Math.cos(an)*radius*t*t];let previous=from;
   for(let k=1;k<=15;k++){
    const t=k/15,at=path(t);line(previous,at,Math.max(.00045,h*.0012)*(1-t*.50),t>.53?'flowerStem':'stem');previous=at;
    if(k<9){const ln=leafSize*(.86-.07*k),az=an+k*2.399;leaf(at,ln,az,.85+k*.05);}
    if(active&&k>=10){
     const az=an+k*2.399,end=[at[0]+Math.sin(az)*a.flowerRadius*.7,at[1]+a.flowerRadius*.12,at[2]+Math.cos(az)*a.flowerRadius*.7];line(at,end,.00035,'pedicel');
     if(s.bloom&&k>=10&&k<=12&&((k+index)%3!==0))flower(end,a.flowerRadius*(.83+rand()*.17),-1.10,az);
     else if(s.bloom&&k>12)b.add(kit.bud,'bud',pal.whiteBud?'#d3d3ae':pal.pink?'#82415e':'#af737f',...end,.0018,a.flowerRadius*.40,.0018,-.18,az,.1);
     else if(!s.bloom&&k<=12)b.add(kit.bud,'spentFruit','#77684e',...end,.0018,.0033,.0018);
    }
   }
   return path;
  };
  for(let i=0;i<n;i++){
   const an=i*2.399,rr=w*.19*Math.sqrt((i+.5)/n),root=[Math.sin(an)*rr,.006,Math.cos(an)*rr],height=shootHeight*(.65+rand()*.33),radius=w*(pal.upright?.075:.20),path=wand(root,an,height,radius,i);
   if(active)for(let j=0;j<(pal.compact?2:1);j++){const start=path(.35+j*.12),aa=an+(j?1:-1)*.74;wand(start,aa,height*(.50-j*.09),w*.17,i+j+1);}
  }return;
 }
 const snow=arch==='snowSpurge',dome=arch==='spurgeDome';
 if(snow||dome){
  const n=Math.max(4,Math.round((snow?18:15)*detail*density));
  const twig=(from,an,length,spread,level)=>{
   const top=[from[0]+Math.sin(an)*spread,from[1]+length,from[2]+Math.cos(an)*spread];line(from,top,Math.max(.00035,h*.0022)*(1+level*.30));
   const count=level?4:3;
   for(let k=1;k<=count;k++){
    const t=k/(count+1),at=from.map((v,j)=>v+(top[j]-v)*t),ll=leafSize*(snow?.65+.10*level:.70+.13*level);
    for(let side=0;side<(snow?2:1);side++)leaf(at,ll,an+k*2.399+side*Math.PI,1.08);
   }
   if(level){for(let j=0;j<2;j++)twig(top,an+(j?1:-1)*.85,length*.58,spread*.67+leafSize*.15,level-1);}
   else if(s.bloom){
    for(let j=0;j<(snow?14:6);j++){
     const aa=an+j*2.399,rr=a.flowerRadius*(snow?4.5:3.1)*Math.sqrt((j+.5)/(snow?14:6)),at=[top[0]+Math.sin(aa)*rr,top[1]+a.flowerRadius*(1+j*.14),top[2]+Math.cos(aa)*rr];line(top,at,.0003,'cyathiumPedicel');flower(at,a.flowerRadius*(.8+rand()*.2),.15+rand()*.3,aa);
    }
   }
  };
  for(let i=0;i<n;i++){const an=i*2.399,rr=w*.09*Math.sqrt((i+.5)/n);twig([Math.sin(an)*rr,.006,Math.cos(an)*rr],an,h*(snow?.24+rand()*.16:.32+rand()*.17),w*.14,snow?3:2);}
  return;
 }
 // Alternate spiral foliage, old lower leaf scars, and shorter non-flowering shoots.
 const n=Math.max(5,Math.round(11*detail));
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.23*Math.sqrt((i+.5)/n),flowering=s.bloom&&i%3!==1,topHeight=h*(flowering?.61:.52+rand()*.22),root=[Math.sin(an)*rr*.53,.007,Math.cos(an)*rr*.53],top=[Math.sin(an)*rr,topHeight,Math.cos(an)*rr],at=t=>root.map((v,k)=>v+(top[k]-v)*t);
  line(root,top,.003*(h/.6)**.5);
  const nLeaves=Math.round((flowering?40:58)*detail*density);
  for(let j=0;j<nLeaves;j++){
   const t=.20+.80*(j+.5)/nLeaves,origin=at(t),az=an+j*2.399,len=leafSize*(.72+.28*Math.sin(Math.PI*t))*(t>.90?.72:1),pitch=2.08-t*1.43+(rand()-.5)*.24+(pal.redStems&&s.winter?.28:0);
   leaf(origin,len,az,pitch);
  }
  for(let j=0;j<8;j++){const p=at(.035+j*.02);b.add(kit.bud,'leafScar','#aa9a80',p[0]+Math.sin(j*2.399)*.002,p[1],p[2]+Math.cos(j*2.399)*.002,.0013,.00055,.0013);}
  if(!flowering)continue;
  const length=h*.29,headTop=[top[0],top[1]+length,top[2]];line(top,headTop,.002,'flowerStem');
  for(let k=0;k<8;k++){
   const t=k/8,center=[top[0],top[1]+length*t,top[2]],ray=w*(.055+.035*t),arms=k<4?3:5;
   for(let j=0;j<arms;j++){
    const aa=an+j*TAU/arms+k*1.47,end=[center[0]+Math.sin(aa)*ray,center[1]+length*.12,center[2]+Math.cos(aa)*ray];line(center,end,.0006,'cymeRay');
    flower(end,a.flowerRadius*(.8+.2*rand()),.6,aa);
    if(k>3)for(let fork=0;fork<2;fork++){const ak=aa+(fork?1:-1)*.65,tip=[end[0]+Math.sin(ak)*a.flowerRadius*1.5,end[1]+a.flowerRadius*1.7,end[2]+Math.cos(ak)*a.flowerRadius*1.5];line(end,tip,.0004,'cymeFork');flower(tip,a.flowerRadius*.83,.48,ak);}
   }
  }
 }
}

function drawGrassAndSedgeProfiles(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,arch=a.architecture,h=s.height,w=s.spread,col=s.leafColor,kind=foliageKind({...info,appearance:{...a,patternColor:s.leafPatternColor}});
 const snow=arch==='snowTussock',millet=arch==='goldMillet',melica=arch==='redMelica',crystal=arch==='crystalSedge',hook=arch==='redHookSedge',rush=arch==='goldMatRush',flag=arch==='sweetFlagFans',white=arch==='whitetopSedge',fescue=arch==='blueFescue';
 const blade=(at,length,yaw,pitch,width=1)=>b.add(a.leafShape,kind,kit.shade(rand,col,.06),...at,length*width,length,length,pitch,yaw,(rand()-.5)*.13);
 const line=(from,to,r,color=col,part='culm')=>{
  if(white&&part==='culm'){
   const v=new THREE.Vector3(...from),end=new THREE.Vector3(...to),direction=end.clone().sub(v),len=direction.length(),rotation=new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),direction.normalize()),'YXZ');
   b.add('triangularCulm',part,color,...v.add(end).multiplyScalar(.5).toArray(),r,len,r,rotation.x,rotation.y,rotation.z);
  }else b.branch(from,to,r,color,part);
 };
 const curve=(path,r,color=col,part='culm',steps=15)=>{let old=path(0);for(let k=1;k<=steps;k++){const at=path(k/steps);line(old,at,r,color,part);old=at;}};
 const glume=(at,len,yaw,pitch,color)=>{
  b.add('grassGlume','glume',color,...at,len,len,len,pitch,yaw,0);
  b.add('grassGlume','glume',color,...at,len*.86,len*.92,len*.85,pitch,yaw+.9,0);
 };
 if(arch==='goldDwarfBamboo'){
  const n=Math.round(23*detail),foliage=[];
  for(let i=0;i<n;i++){
   const an=i*2.399,rr=w*.36*Math.sqrt((i+.5)/n),root=[Math.sin(an)*rr,0,Math.cos(an)*rr],height=h*(.56+rand()*.40),tip=[root[0]+Math.sin(an)*w*.05,height,root[2]+Math.cos(an)*w*.05];
   line(root,tip,.0017,'#9b9c60','bambooCulm');
   for(let k=1;k<9;k++){
    const t=k/9,at=root.map((v,j)=>v+(tip[j]-v)*t),yaw=an+(k%2)*Math.PI,len=Math.min(a.leafLength,w*.26),end=[at[0]+Math.sin(yaw)*len*.39,at[1]+len*.22,at[2]+Math.cos(yaw)*len*.39];
    b.add(kit.bud,'bambooNode','#998d5c',...at,.0024,.0011,.0024);line(at,end,.0008,'#b2a46b','bambooTwig');
    foliage.push({end,len,yaw});
   }
  }
  for(const {end,len,yaw} of foliage)if(s.leafDensity>0&&rand()<=s.leafDensity)for(let j=0;j<3;j++)blade(end,len*(.65+rand()*.35),yaw+(j-1)*.68,.74+rand()*.75);
  return;
 }
 const count=Math.max(20,Math.round((fescue?780:snow?290:millet?100:melica?110:crystal?165:rush?220:flag?180:white?100:260)*detail*s.leafDensity));
 for(let i=0;i<count;i++){
  const an=i*2.399,rr=w*(flag?.20:.18)*Math.sqrt((i+.5)/count),root=[Math.sin(an)*rr,.003,Math.cos(an)*rr];
  let length=h*(snow?.57:millet?.66:melica?.47:white?.61:1.0)*(.52+rand()*.46);
  let yaw=an,pitch=.12+rand()*.65,width=1;
  if(flag){const fan=Math.floor(i/15),fanYaw=fan*2.399;root[0]=Math.sin(fanYaw)*w*.21;root[2]=Math.cos(fanYaw)*w*.21;yaw=fanYaw+(i%2?Math.PI:0)+(rand()-.5)*.13;pitch=.06+(i%15)/15*.85;width=a.leafWidth/(length*.018);}
  if(fescue){pitch=.02+rand()*1.1;width=.0012/(length*.018);}
  if(crystal){pitch=.13+rand()*1.12;length=Math.min(a.leafLength,h*.91)*(.58+rand()*.42);}
  if(millet)width=1.35;
  blade(root,length,yaw,pitch,width);
  if(crystal&&i%2===0){
   const f=flowerFrame(b,root,pitch,yaw);
   for(const side of [-1,1])for(let j=1;j<13;j++){
    const t=j/13,at=[side*length*.035,length*t,length*(.12*t*t+.006+.012*Math.sin(t*6))],end=[at[0]+side*.0015,at[1]+.002+rand()*.002,at[2]+.0007];
    f.branch(at,end,.00010,'#dce0d6','membranousEdge');
   }
  }
 }
 if(!s.bloom&&!s.seedHeads)return;
 const stems=Math.max(3,Math.round((snow?27:millet?14:melica?28:crystal?8:rush?11:flag?5:white?25:hook?10:24)*detail)),flowerColor=s.bloom?s.flowerColor:(a.seedColor||'#b5a483');
 for(let i=0;i<stems;i++){
  const an=i*2.399,rr=w*.21*Math.sqrt((i+.5)/stems),root=[Math.sin(an)*rr*.5,.003,Math.cos(an)*rr*.5],top=h*(snow||melica?.70+rand()*.29:flag?.54+rand()*.22:crystal?1.06+rand()*.32:rush?.45+rand()*.25:.80+rand()*.22),reach=w*(snow?.37:melica?.25:.14);
  const path=t=>[root[0]+Math.sin(an)*reach*t*t,top*(snow||melica?Math.sin(t*1.86)/.96:t),root[2]+Math.cos(an)*reach*t*t],tip=path(1);curve(path,Math.max(.00045,h*.0013));
  if(melica||millet)for(let node=0;node<4;node++){
   const t=.12+node*.105,at=path(t),yaw=an+(node%2)*Math.PI,len=h*(.22-node*.026);
   line(path(t-.045),at,.0019,col,'leafSheath');blade(at,len,yaw,.83+node*.10,millet?1.35:1);
  }
  if(white){
   const f=flowerFrame(b,tip,-.04,an),n=3+i%4;
   for(let j=0;j<n;j++){const len=.035+.025*rand();f.add('whitetopBract',patternKind('bract','tip','#517d46'),'#efeee2',0,0,0,len,len,len,1.40+rand()*.20,j*TAU/n,0);}
   for(let j=0;j<20;j++){const aa=j*2.399,r=.004*Math.sqrt((j+.5)/20);f.add(kit.bud,'spikelet',s.bloom?'#d0c5a0':'#8d7050',Math.sin(aa)*r,.002+rand()*.003,Math.cos(aa)*r,.0011,.0020,.0010);}
  }else if(flag){
   const f=flowerFrame(b,path(.75),-.30,an),len=Math.min(.075,h*.45);f.add(a.leafShape,kind,col,0,0,0,len*.7,len*1.6,len*1.6,.2,0,0);
   f.branch([0,0,0],[0,len,0],.0017,'#bdbd76','spadix');
   for(let j=0;j<120;j++){const aa=j*2.399,yy=len*j/120;f.add(kit.bud,'spadixFlower','#c7c783',Math.sin(aa)*.002,yy,Math.cos(aa)*.002,.0008,.0006,.0008);}
  }else if(crystal||hook||rush){
   const groups=rush?9:1;
   for(let g=0;g<groups;g++){
    const ya=an+g*2.399,center=rush?[tip[0]+Math.sin(ya)*.018,tip[1]-g*.017,tip[2]+Math.cos(ya)*.018]:tip;
    if(rush)line(path(Math.max(.2,1-g*.045)),center,.0006,col,'flowerBranch');
    const n=hook?32:rush?9:22;
    for(let j=0;j<n;j++){
     const aa=j*2.399,at=[center[0]+Math.sin(aa)*.003,center[1]+(hook?j*.0013:Math.cos(j*.7)*.004),center[2]+Math.cos(aa)*.003];
     if(rush){b.add(kit.bud,'flower',flowerColor,...at,.0017,.0035,.0017);}
     else glume(at,hook?.003:.004,aa,.65,flowerColor);
     if(hook&&!s.bloom){const hookEnd=[at[0]+.001,at[1]+.004,at[2]];line(at,hookEnd,.00013,'#8b7150','seedHook');line(hookEnd,[hookEnd[0]+.001,hookEnd[1]-.0015,hookEnd[2]],.00013,'#8b7150','seedHook');}
    }
   }
  }else if(melica){
   for(let j=0;j<44;j++){
    const t=.48+j*.0115,at=path(t),ya=an+(j%3-1)*.40,reach=.006+rand()*.005,end=[at[0]+Math.sin(ya)*reach,at[1]-.008,at[2]+Math.cos(ya)*reach];line(at,end,.00025,flowerColor,'spikeletPedicel');
    for(let k=0;k<3;k++)glume([end[0],end[1]-k*.003,end[2]],.0065,ya+k*.22,2.6,flowerColor);
   }
  }else{
   // Airy millet panicles, compact fescue spikelets, and long pendulous snow-tussock panicles.
   const tiers=snow?16:millet?9:8;
   for(let j=0;j<tiers;j++){
    const t=.56+j/tiers*.42,at=path(t),ya=an+j*2.399;
    for(let arm=0;arm<(snow?5:3);arm++){
     const az=ya+arm*TAU/(snow?5:3),ray=(snow?.08:millet?.075:.025)*(1-(t-.5)*1.2),drop=snow?-.16:millet?.025:.035;
     const branch=q=>[at[0]+Math.sin(az)*ray*q,at[1]+drop*q*q,at[2]+Math.cos(az)*ray*q];curve(branch,.00025,flowerColor,'panicleBranch',snow?8:4);
     for(let k=1;k<=(snow?14:millet?5:4);k++){
      const q=k/(snow?14:millet?5:4),p=branch(q),end=[p[0]+Math.cos(az)*.006,p[1]-(snow?.008:.002),p[2]+Math.sin(az)*.006];line(p,end,.00015,flowerColor,'spikeletPedicel');glume(end,snow?.007:millet?.003:.006,az,snow?2.6:.35,flowerColor);
     }
    }
   }
  }
 }
}

function drawAquaticReeds(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,arch=a.architecture,h=s.height,w=s.spread,umbrella=arch==='umbrellaSedge',papyrus=arch==='dwarfPapyrus',horsetail=arch==='waterHorsetail',rush=arch==='twigRush',green=s.leafColor,stem=a.stemColor;
 const section=(shape,from,to,r,color,part)=>{
  const v=new THREE.Vector3(...from),end=new THREE.Vector3(...to),dir=end.clone().sub(v),len=dir.length(),e=new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()),'YXZ');
  b.add(shape,part,color,...v.add(end).multiplyScalar(.5).toArray(),r,len,r,e.x,e.y,e.z);
 };
 const line=(from,to,r,color=stem,part='culm')=>horsetail&&part==='culm'?section('horsetailCulm',from,to,r,color,part):umbrella||papyrus?section('triangularCulm',from,to,r,color,part):b.branch(from,to,r,color,part);
 const glume=(at,len,yaw,pitch,color)=>{b.add('grassGlume','glume',color,...at,len,len,len,pitch,yaw,0);b.add('grassGlume','glume',color,...at,len*.85,len*.88,len*.85,pitch,yaw+1.1,0);};
 const spikelet=(at,len,yaw,pitch,color)=>{
  const f=flowerFrame(b,at,pitch,yaw);f.branch([0,0,0],[0,len,0],.0002,color,'spikeletAxis');
  for(let k=0;k<10;k++){const side=k%2?1:-1;f.add('grassGlume','glume',color,side*.00035,len*k/10,0,.0022,.0022,.0022,.25,side*Math.PI/2,0);}
 };
 if(rush){
  const n=Math.round(110*detail*s.leafDensity);
  for(let j=0;j<n;j++){
   const an=j*2.399,rr=w*.23*Math.sqrt((j+.5)/n),len=h*(.44+rand()*.54),width=a.leafWidth/(.008*len);
   b.add('twigRushBlade','leaf-glossy',kit.shade(rand,green,.045),Math.sin(an)*rr,0,Math.cos(an)*rr,len*width,len,len,.015+rand()*.20,an,0);
  }
 }
 const n=Math.max(4,Math.round((horsetail?74:rush?15:papyrus?19:25)*detail*(rush?1:s.leafDensity)));
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*(horsetail?.32:.24)*Math.sqrt((i+.5)/n),root=[Math.sin(an)*rr,.002,Math.cos(an)*rr],height=h*(horsetail?.53+rand()*.45:papyrus?.61+rand()*.29:umbrella?.52+rand()*.39:.82+rand()*.17),reach=w*(horsetail?.055:papyrus?.10:umbrella?.07:.025),path=t=>[root[0]+Math.sin(an)*reach*t*t,height*t,root[2]+Math.cos(an)*reach*t*t],tip=path(1),radius=horsetail?.0017:papyrus?.0024:umbrella?.0023:.0018;
  let old=root;for(let k=1;k<=12;k++){const at=path(k/12);line(old,at,radius*(1-.18*k/12));old=at;}
  if(horsetail){
   for(let k=1;k<=12;k++){
    const t=k/13,at=path(t),r=radius*(1-.18*t),f=flowerFrame(b,at,0,an);
    f.add('horsetailCulm','sheath','#758866',0,-.0017,0,r*1.10,.0034,r*1.10);
    for(let j=0;j<18;j++){const aa=j*TAU/18;f.add('horsetailSheath','sheathTooth','#393f2d',Math.sin(aa)*r,.0001,Math.cos(aa)*r,.0015,.0022,.0015,.05,aa,0);}
    if(i%5===0&&k>=5&&k<=8)for(let j=0;j<5;j++){
     const aa=an+j*TAU/5,ll=Math.min(.10,h*.19)*(1-(k-5)*.13),end=[at[0]+Math.sin(aa)*ll*.7,at[1]+ll*.8,at[2]+Math.cos(aa)*ll*.7];b.branch(at,end,.0005,stem,'whorledBranch');
     for(let z=1;z<4;z++){const p=at.map((v,q)=>v+(end[q]-v)*z/4);b.add(kit.bud,'branchSheath','#515a3e',...p,.0008,.001,.0008);}
    }
   }
   // No decorative flowers: spore-cone timing is not established for this entry.
   continue;
  }
  if(umbrella||papyrus){
   for(let j=0;j<3;j++)b.add('reducedSheath','basalSheath','#867651',root[0],.002,root[2],.005,h*.12,.006,.02,an+j*TAU/3,0);
   const f=flowerFrame(b,tip,0,an),bracts=umbrella?a.bracts:3;
   for(let j=0;j<bracts;j++){
    const az=j*TAU/bracts+(rand()-.5)*.12,len=umbrella?Math.min(a.leafLength,w*.48)*(.67+rand()*.33):Math.min(.08,w*.25)*(.60+rand()*.4),width=umbrella?a.leafWidth/(.054*len):.43;
    f.add('umbrellaBract','bract',kit.shade(rand,green,.06),0,0,0,len*width,len,len,umbrella?.65+rand()*.94:1.7+rand()*.2,az,0);
   }
   if(papyrus){
    const rays=Math.round(126*detail),young=s.month===5,rr=Math.min(.16,w*.28)*(young?.62:1);
    for(let j=0;j<rays;j++){
     const az=j*2.399,t=(j+.5)/rays,elevation=-.22+1.34*t,length=rr*(.76+rand()*.24);let previous=[0,0,0],end;
     for(let k=1;k<=8;k++){const q=k/8,horizontal=length*Math.cos(elevation)*(q+.10*q*q);end=[Math.sin(az)*horizontal,length*(Math.sin(elevation)*q-.15*q*q),Math.cos(az)*horizontal];f.branch(previous,end,.00036,stem,'umbelRay');previous=end;}
     if(!s.bloom)continue;
     const cluster=flowerFrame(f,end,0,az);
     for(let k=0;k<4;k++){
      const ya=k*TAU/4,p=[Math.sin(ya)*.005,.004,Math.cos(ya)*.005];cluster.branch([0,0,0],p,.0002,stem,'secondaryRay');spikeletLocal(cluster,p,.008,ya,.9,s.month===9?'#9c795b':'#9ba976');
     }
    }
   }else if(s.bloom){
    for(let j=0;j<9;j++){
     const aa=j*2.399,rr=Math.min(.085,w*.18)*(.38+rand()*.62),end=[tip[0]+Math.sin(aa)*rr,tip[1]+rr*(.3+rand()*.7),tip[2]+Math.cos(aa)*rr];b.branch(tip,end,.00045,stem,'umbelRay');
     for(let k=0;k<5;k++)spikelet(end,.009,aa+k*TAU/5,1.1,s.month>=9?'#957456':'#a4ad7f');
    }
   }
  }else if(rush){
   for(let k=1;k<=2;k++){
    const at=path(.24+k*.23),len=h*.15;b.add('twigRushBlade','leaf',green,...at,len*.6,len,len,.22,an+k*Math.PI,0);b.add(kit.bud,'culmNode','#718e4f',...at,.002,.003,.002);
   }
   if(s.bloom)for(let k=0;k<8;k++){
    const t=.70+k*.035,at=path(t),aa=an+k*2.399,end=[at[0]+Math.sin(aa)*.011,at[1]+.014,at[2]+Math.cos(aa)*.011];b.branch(at,end,.0006,stem,'panicleBranch');
    for(let j=0;j<18;j++){const az=j*2.399,pt=[end[0]+Math.sin(az)*.005,end[1]+j*.0009,end[2]+Math.cos(az)*.005];glume(pt,.0048,az,.42,s.flowerColor);}
   }
  }
 }
 function spikeletLocal(builder,at,len,yaw,pitch,color){
  const f=flowerFrame(builder,at,pitch,yaw);f.branch([0,0,0],[0,len,0],.00015,color,'spikeletAxis');
  for(let j=0;j<8;j++)f.add('grassGlume','glume',color,(j%2?1:-1)*.0003,len*j/8,0,.0017,.0017,.0017,.27,j%2*Math.PI,0);
 }
}

function drawGardenRose(b,{info,s,p,detail,rand},kit){
 const a=info.appearance,pal=a.flowerPalette,h=s.height,w=s.spread,green=s.leafColor,stem=a.stemColor,climb=pal.climber,ramble=pal.rambling,banks=pal.banksiae,canes=pal.canes||(ramble?9:7),nodes=climb?Math.max(9,Math.min(24,Math.ceil(h/.22))):7,leafLen=Math.min(a.leafLength,w*.17),heads=[],leaves=[],mix=(x,y,t)=>x.map((v,k)=>v+(y[k]-v)*t);
 const prickles=(from,to,seed,lateral=false)=>{
  if(pal.thornless||!pal.pricklesPerMetre&&pal.fewPrickles&&seed%3!==0)return;
  const dist=Math.hypot(...to.map((v,i)=>v-from[i])),density=lateral?(pal.lateralPricklesPerMetre??pal.pricklesPerMetre):pal.pricklesPerMetre,n=density?Math.round(dist*density):pal.manyPrickles?3:1;
  for(let q=0;q<n;q++){
   const at=mix(from,to,(q+.5)/n),yaw=(seed+q)*2.399,reach=pal.prickleLength||Math.min(.007,h*.006),bend=[at[0]+Math.sin(yaw)*reach*.72,at[1],at[2]+Math.cos(yaw)*reach*.72],tip=[at[0]+Math.sin(yaw)*reach,at[1]-reach*.48,at[2]+Math.cos(yaw)*reach];
   b.branch(at,bend,reach*.27,'#8d6d53','prickle');b.branch(bend,tip,reach*.09,'#8d6d53','prickle');
  }
  for(let q=0,small=Math.round(dist*(pal.smallPricklesPerMetre||0));q<small;q++){
   const at=mix(from,to,(q+.5)/small),yaw=(seed+q)*2.399,reach=.0015,tip=[at[0]+Math.sin(yaw)*reach,at[1]-reach*.4,at[2]+Math.cos(yaw)*reach];
   b.branch(at,tip,.00032,'#9c6d59','smallPrickle');
  }
 };
 // Structural branching is built before foliage so winter retains the same canes.
 for(let i=0;i<canes;i++){
  const yaw=i*2.399+.2,reach=w*(climb?.38:.21+pal.lean*.37),top=h*(.60+.34*((i*3%7)/6)),root=[Math.sin(yaw)*w*.045,0,Math.cos(yaw)*w*.045];let prev=root;
  for(let j=1;j<=nodes;j++){
   const t=j/nodes,rr=reach*Math.pow(t,pal.stiff?2.1:climb?1.55:1.16),rise=banks?Math.sin(t*Math.PI*.66):ramble?Math.sin(t*Math.PI*.61):pal.arching?Math.sin(t*Math.PI*.52):t,at=[root[0]+Math.sin(yaw)*rr,top*rise,root[2]+Math.cos(yaw)*rr];
   b.branch(prev,at,Math.min(banks?.008:pal.stiff?.014:.010,h*.008)*(1-t*.64),j<4?(a.barkColor||'#88755e'):stem,'wood-rose-cane');prickles(prev,at,i*13+j);
   b.add(kit.bud,'axillaryBud','#865d51',at[0],at[1],at[2],.0019,.004,.0018,.2,yaw+j,0);
   if(j>2){
    const az=yaw+(j%2?1:-1)*1.18,side=w*(ramble?.16:climb?.14:.12),end=[at[0]+Math.sin(az)*side,Math.min(h*.97,at[1]+h*(ramble?.035-.12*t*t:climb?.08:.16)),at[2]+Math.cos(az)*side];
    b.branch(at,end,Math.min(.003,h*.0021),stem,'wood-rose-lateral');prickles(at,end,i*17+j,true);
    if(!banks&&(climb?(j%2===0||j===nodes):j>=nodes-1))heads.push({at:end,yaw:az,seed:i*nodes+j});
    for(let k=1;k<=4;k++)leaves.push({at:mix(at,end,k/5),yaw:az+(k%2?1:-1)*1.13,size:(k===4?.78:1),young:k===4});
    if(climb)for(let q=1;q<=2;q++){
     // Leaf-bearing side shoots follow the cane; the mature vine is not a bare
     // pole with an enlarged flower and a handful of leaves at its tip.
     const base=mix(at,end,q/3),turn=az+(q%2?1:-1)*(1.05+(i%3)*.16),len=Math.min(.40,w*.15)*(.72+((i+j+q)%5)*.07),tip=[base[0]+Math.sin(turn)*len,base[1]+len*(ramble?.15-.55*t:.48),base[2]+Math.cos(turn)*len];
     b.branch(base,tip,Math.min(.0018,h*.0007),stem,'wood-rose-shoot');prickles(base,tip,i*23+j*3+q,true);
     for(let k=1;k<=5;k++)leaves.push({at:mix(base,tip,k/6),yaw:turn+(k%2?1:-1)*1.28,size:.82+.06*(k%3),young:k===5});
     if(banks&&(j%2===0||j===nodes))heads.push({at:tip,yaw:turn,seed:i*nodes*2+j*2+q});
    }
   }
   leaves.push({at,yaw:yaw+(j%2?1:-1)*(1.03+.07*(i%4)),size:.85+.12*(j%3)});prev=at;
  }
 }
 if(pal.autumnLongShoots&&(s.month>=8||s.month<=2))for(const head of heads){
  if(head.seed%3!==0)continue;
  const base=head.at,end=[base[0]+Math.sin(head.yaw)*w*.09,base[1]+h*.23,base[2]+Math.cos(head.yaw)*w*.09];
  b.branch(base,end,.0017,stem,'seasonalFlowerShoot');prickles(base,end,head.seed);
  for(let j=1;j<=4;j++)leaves.push({at:mix(base,end,j/5),yaw:head.yaw+(j%2?1:-1),size:.85});head.at=end;
 }
 for(let i=0;i<leaves.length;i++){
  const row=leaves[i];if(s.leafDensity===0||(i*.618%1)>s.leafDensity)continue;
  const len=leafLen*row.size*s.leafScale,f=flowerFrame(b,row.at,.68+(i%6)*.14,row.yaw),axis=len*(pal.rachisScale||1.65),lc=kit.shade(rand,pal.youngLeaf&&row.young&&s.month<11?pal.youngLeaf:green,.04),counts=a.leafletCounts||[5,7],pairs=(counts[i%counts.length]-1)/2,width=a.leafWidth?a.leafWidth/(a.leafLength*.66):1;
  f.branch([0,0,0],[0,axis,0],.0007,stem,'leafRachis');
  if(!banks||row.young&&[3,4].includes(s.month))for(const side of [-1,1])f.add(banks?'banksiaeSepal':'roseSepal','stipule',green,0,len*.14,0,len*(banks?.065:.17),len*(banks?.15:.28),len,.10,side*.6,0);
  if(banks)for(let q=0;q<8;q++){const at=[0,axis*(q+.5)/8,0],yaw=q*2.399;f.branch(at,[Math.sin(yaw)*.0012,at[1]+.0007,Math.cos(yaw)*.0012],.00015,'#a9b596','rachisHair');}
  for(let j=0;j<pairs;j++)for(const side of [-1,1]){
   const t=.28+j*.28,at=[side*len*.10,axis*t,0],ll=len*(.64+j*.12),ff=flowerFrame(f,at,.05,0),roll=side*1.03;
   f.branch([0,axis*t,0],at,.00045,stem,'petiolule');ff.add('roseLeaflet',a.leafTexture==='glossy'?'leaf-glossy-rose':'leaf-rose',lc,0,0,0,ll*width,ll,ll,0,0,roll);
  }
  f.add('roseLeaflet',a.leafTexture==='glossy'?'leaf-glossy-rose':'leaf-rose',lc,0,axis,0,len*width,len,len);
 }
 for(const head of heads){
  if(!s.bloom&&!s.flowerBuds)continue;
  const n=pal.cluster||1,eligible=(head.seed*.381966%1)<s.flowerDensity;
  for(let j=0;j<n;j++){
   const az=head.yaw+j*2.399,rr=j===0?0:a.flowerRadius*(banks?3.8*Math.sqrt(j/n):1.8),at=[head.at[0]+Math.sin(az)*rr,head.at[1]+(banks?.020+(j%3)*.004:j===0?.035:.02),head.at[2]+Math.cos(az)*rr];b.branch(head.at,at,banks?.00065:.0015,stem,'peduncle');
   if(!eligible||!s.bloom||j>0&&(j+head.seed)%5===0){
    const f=flowerFrame(b,at,.12,az),r=a.flowerRadius;f.add(kit.bud,'flowerBud',pal.budColor||pal.rim||s.flowerColor,0,r*.10,0,r*.21,r*.38,r*.21);
    for(let q=0;q<5;q++)f.add(banks?'banksiaeSepal':'roseSepal','budSepal',green,0,-r*.1,0,r*.40,r*.58,r*.40,.28,q*TAU/5,0);
   }else{
    const hot=[7,8].includes(s.month),aged=pal.ageTo&&head.seed%3!==0,baseColor=hot&&pal.summerColor?pal.summerColor:s.flowerColor,fc=aged?new THREE.Color(baseColor).lerp(new THREE.Color(pal.ageTo),(head.seed%3)*.38):baseColor,displayPalette={...pal,...(aged||hot&&pal.summerColor?{inner:fc}:{}),...(hot&&pal.summerRound?{notched:false}: {})};
    detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius*(hot&&pal.summerRound?.78:1),color:fc,shape:'gardenRose',petals:a.petals,palette:displayPalette,tilt:pal.upward?.04+(head.seed%3)*.035:.38+(head.seed%4)*.16,yaw:az},{...kit,rand});
   }
  }
 }
}

function drawSilverMints(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,arch=a.architecture,sid=arch==='sideritisSpikes',mint=arch==='silverMintSpikes',marr=arch==='marrubiumWhorls',leo=arch==='leonotisTiers',h=s.height,w=s.spread,green=s.leafColor,stem=a.stemColor,scale=s.leafScale,winter=[12,1,2].includes(s.month),leafLength=Math.min(a.leafLength,w*.35);
 const square=(from,to,r,kind='squareStem',color=stem)=>{const start=new THREE.Vector3(...from),end=new THREE.Vector3(...to),d=end.clone().sub(start),q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize()),e=new THREE.Euler().setFromQuaternion(q);b.add('mintSquareStem',kind,color,...start.add(end).multiplyScalar(.5).toArray(),r,d.length(),r,e.x,e.y,e.z);};
 const leaf=(at,len,yaw,pitch)=>{
  const f=flowerFrame(b,at,pitch,yaw);f.add(a.leafShape,leo?'leaf':'leaf-woolly',kit.shade(rand,green,.035),0,0,0,len,len,len);
  const point=(t,u)=>silverMintLeafPoint(a.leafShape,t,u).map(v=>v*len);
  for(let j=0;j<10;j++)f.branch(point(j/11,0),point((j+1)/11,0),len*.003,leo?'#9aa57d':'#b5baab','midrib');
  for(let j=2;j<9;j++)for(const side of [-1,1])f.branch(point(j/10,0),point((j+.5)/10,side*.8),len*.0012,leo?'#99a67b':'#bcc1b5','lateralVein');
  for(let j=0;j<(sid?45:marr?40:mint?22:8);j++){
   const t=.05+rand()*.9,u=(rand()-.5)*1.8,at=point(t,u);f.branch(at,[at[0]+(rand()-.5)*.0008,at[1]+.0005,at[2]+(sid?.0011:.0007)],.000055,leo?'#bec3a5':'#d1d4c9','leafHair');
  }
 };
 const flower=(at,yaw,tilt,sz=1)=>detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius*sz,shape:a.flowerShape,color:s.flowerColor,yaw,tilt},{...kit,rand});
 const spike=(at,yaw,len)=>{
  const tip=[at[0]+Math.sin(yaw)*len*.12,at[1]+len,at[2]+Math.cos(yaw)*len*.12];square(at,tip,.0012,'flowerAxis');
  const rows=sid?10:19;
  for(let j=0;j<rows;j++){
   const t=j/rows,center=at.map((v,n)=>v+(tip[n]-v)*t),turn=yaw+j*Math.PI/2;
   if(sid)for(const side of [0,Math.PI])b.add('sideritisBract','bract','#bac681',...center,.018,.018,.018,1.1,turn+side,0);
   for(let k=0;k<(sid?8:10);k++){
    const az=turn+k*TAU/(sid?8:10),rad=sid?.0035:.0032*(1-t*.7),pos=[center[0]+Math.sin(az)*rad,center[1],center[2]+Math.cos(az)*rad];
    if(j>rows-4)b.add(kit.bud,'flowerBud',sid?'#c5cd91':'#a9b588',...pos,sid?.0024:.0012,sid?.0032:.0018,sid?.0024:.0012);
    else flower(pos,az,sid?1.25:1.04,sid?1:1-t*.20);
   }
  }
 };
 const lionHead=(at,yaw)=>{
  // The green spiny calyces form the ball; orange corollas open around a ring.
  const rad=.021;
  for(const side of [0,Math.PI])b.add('menthaLance','narrowBract',green,...at,.045,.065,.065,1.20,yaw+side,0);
  for(let j=0;j<3;j++)for(let k=0;k<22;k++){
   const az=yaw+k*TAU/22+j*.16,lat=(j-1)*.62,pos=[at[0]+Math.sin(az)*rad*Math.cos(lat),at[1]+Math.sin(lat)*rad,at[2]+Math.cos(az)*rad*Math.cos(lat)],f=flowerFrame(b,pos,Math.PI/2-lat,az);
   f.add('woodlandMintTube','spinyCalyx','#849267',0,0,0,.007,.013,.007);
   for(let q=0;q<8;q++){const an=q*TAU/8;f.branch([Math.sin(an)*.002,.010,Math.cos(an)*.002],[Math.sin(an)*.003,.016+(q===0?.004:0),Math.cos(an)*.003],.00019,'#9daa7b','calyxSpine');}
   if(j===1&&k%4!==0)flower(pos,az,1.42);
  }
 };
 if(leo){
  const mainH=h*.96*scale,root=[0,.005,0];let prev=root;
  for(let j=1;j<=10;j++){
   const t=j/10,at=[Math.sin(t*1.8)*w*.035,mainH*t,Math.cos(t*1.5)*w*.025];square(prev,at,.006*(1-t*.65),'squareStem',j<2?'#8b8764':stem);prev=at;
   if(j<7&&rand()<s.leafDensity)for(const side of [-1,1]){
    const yaw=j*Math.PI/2+(side<0?Math.PI:0),len=leafLength*(1-t*.4)*scale,end=[at[0]+Math.sin(yaw)*len*.35,at[1]-.015,at[2]+Math.cos(yaw)*len*.35];b.branch(at,end,.0016,stem,'petiole');leaf(end,len,yaw,1.02);
   }
   if(s.bloom&&j>=6&&j%2===0)lionHead(at,j*.9);
   if(j===3||j===4){
    const yaw=j*2.3,tip=[at[0]+Math.sin(yaw)*w*.31*scale,mainH*(j===3?.79:.90),at[2]+Math.cos(yaw)*w*.31*scale];let base=at;
    for(let k=1;k<=5;k++){
     const t=k/5,joint=at.map((v,n)=>v+(tip[n]-v)*t);square(base,joint,.0036*(1-t*.45),'axillaryShoot');base=joint;
     if(k<4&&rand()<s.leafDensity)for(const side of [-1,1])leaf(joint,leafLength*(.72-t*.2)*scale,yaw+side*Math.PI/2,1.10);
     if(s.bloom&&(k===3||k===5))lionHead(joint,yaw+k*.4);
    }
   }
  }
  return;
 }
 const count=Math.max(5,Math.round((sid?13:mint?8:20)*detail)),topFactor=winter?(sid?.24:.35):sid?(s.bloom?.61:.47):marr?(s.bloom?.90:.55):.84;
 for(let i=0;i<count;i++){
  const yaw=i*2.399,rr=w*(sid?.18:mint?.23:.10)*Math.sqrt((i+.5)/count),root=[Math.sin(yaw)*rr,.005,Math.cos(yaw)*rr],height=h*topFactor*(.70+rand()*.30)*(mint?scale:1),reach=w*(sid?.12:mint?.08:.24),nodes=sid?5:7;let prev=root;
  for(let j=1;j<=nodes;j++){
   const t=j/nodes,at=[root[0]+Math.sin(yaw)*reach*t*t,height*t,root[2]+Math.cos(yaw)*reach*t*t],turn=yaw+j*Math.PI/2;square(prev,at,sid?.0018:mint?.0018:.0012,'squareStem',winter&&j<2?'#929181':stem);prev=at;
   if(rand()<s.leafDensity)for(const side of [-1,1]){
    const az=turn+(side<0?Math.PI:0),len=leafLength*(1-t*(sid?.14:.35))*(winter?.8:1)*(mint?scale:1),petiole=marr?len*.28:.002,end=[at[0]+Math.sin(az)*petiole,at[1],at[2]+Math.cos(az)*petiole];
    if(marr)b.branch(at,end,.00045,stem,'petiole');leaf(end,len,az,sid?.45+rand()*.30:marr?.91+rand()*.25:.85+rand()*.28);
   }
   if(marr&&s.bloom&&j>=3)for(let k=0;k<20;k++){
    const az=turn+k*TAU/20,rad=.004,at2=[at[0]+Math.sin(az)*rad,at[1]+(k%2)*.002,at[2]+Math.cos(az)*rad];flower(at2,az,1.05);
   }
   if(mint&&j===4&&s.bloom)for(const side of [-1,1]){
    const az=yaw+side*1.0,tip=[at[0]+Math.sin(az)*w*.14,at[1]+height*.32,at[2]+Math.cos(az)*w*.14];square(at,tip,.0011,'axillaryShoot');
    for(let q=1;q<=2;q++){const p=at.map((v,n)=>v+(tip[n]-v)*q/3);for(const side of [-1,1])leaf(p,leafLength*.62,az+side*Math.PI/2,.94);}
    spike(tip,az,.065);
   }
  }
  if(s.bloom&&(sid||mint))spike(prev,yaw,sid?Math.min(.16,h*.38):.09);
 }
}

function drawWoodlandMints(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,arch=a.architecture,kei=arch==='keiskeaRacemes',iso=arch==='isodonPanicles',che=arch==='chelonopsisAxils',trip=arch==='triporaCymes',leu=arch==='leucosceptrumSpikes',mel=arch==='melittisAxils',dead=s.dormant,green=s.leafColor,stem=dead?'#8b7b66':a.stemColor,h=s.height,w=s.spread,scale=s.leafScale;
 const square=(from,to,r,kind='squareStem')=>{const start=new THREE.Vector3(...from),end=new THREE.Vector3(...to),d=end.clone().sub(start),q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize()),e=new THREE.Euler().setFromQuaternion(q);b.add('mintSquareStem',kind,stem,...start.add(end).multiplyScalar(.5).toArray(),r,d.length(),r,e.x,e.y,e.z);};
 const leaf=(at,len,yaw)=>{
  const f=flowerFrame(b,at,.88+rand()*.42,yaw),kind=trip?'leaf-tripora-margin':'leaf';f.add(a.leafShape,kind,kit.shade(rand,green,.035),0,0,0,len,len,len);
  const point=(t,u)=>woodlandMintLeafPoint(a.leafShape,t,u).map(v=>v*len);
  for(let j=0;j<9;j++)f.branch(point(j/10,0),point((j+1)/10,0),len*.004,leu?'#a4ae58':'#799668','midrib');
  for(let j=2;j<9;j++)for(const side of [-1,1])f.branch(point(j/10,0),point((j+.7)/10,side*.85),len*.0015,leu?'#adb860':'#7f956c','lateralVein');
  if(mel||kei||leu)for(let j=0;j<(mel?30:10);j++){const t=.1+rand()*.8,u=(rand()-.5)*1.8,at=point(t,u);f.branch(at,[at[0],at[1]+.0003,at[2]+.0008],.000045,'#b1bc9d','leafHair');}
 };
 const flower=(at,yaw,tilt=1.35,sz=1)=>detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius*sz,color:s.flowerColor,shape:a.flowerShape,tilt,yaw},{...kit,rand});
 const n=Math.max(3,Math.round((trip?10:che?4:mel?5:6)*detail));
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*.16*Math.sqrt((i+.5)/n),root=[Math.sin(an)*rr,.004,Math.cos(an)*rr],top=h*(.72+rand()*.25)*(dead?1:scale),reach=w*(trip?.18:iso?.11:.08),nodes=iso?8:6;let prev=root;
  for(let j=1;j<=nodes;j++){
   const t=j/(nodes+1),at=[root[0]+Math.sin(an)*reach*t*t,top*t,root[2]+Math.cos(an)*reach*t*t],turn=an+j*Math.PI/2;square(prev,at,.0024*(1-t*.4),dead?'standingDeadStem':'squareStem');prev=at;
   if(!dead&&rand()<s.leafDensity)for(const side of [-1,1]){
    const yaw=turn+(side<0?Math.PI:0),len=Math.min(a.leafLength,w*(kei?.26:.34))*(1-t*.37)*scale,end=[at[0]+Math.sin(yaw)*len*.12,at[1]+len*.035,at[2]+Math.cos(yaw)*len*.12];b.branch(at,end,.0009,stem,'petiole');leaf(end,len,yaw);
   }
   if(trip&&!dead&&j>=2&&j<=4){
    // Snow Fairy makes a branched leafy mound; leaves also occupy axillary shoots.
    const yaw=turn+(j%2?Math.PI:0),tip=[at[0]+Math.sin(yaw)*w*.20,at[1]+top*.18,at[2]+Math.cos(yaw)*w*.20];let last=at;
    for(let k=1;k<=3;k++){
     const t=k/3,joint=at.map((v,n)=>v+(tip[n]-v)*t);square(last,joint,.0013*(1-t*.3),'axillaryShoot');last=joint;
     if(rand()<s.leafDensity)for(const side of [-1,1]){
      const az=yaw+Math.PI/2+(side<0?Math.PI:0),len=a.leafLength*(.92-t*.22)*scale,end=[joint[0]+Math.sin(az)*len*.1,joint[1]+len*.02,joint[2]+Math.cos(az)*len*.1];b.branch(joint,end,.0005,stem,'petiole');leaf(end,len,az);
     }
    }
    if(s.bloom)for(let k=-1;k<=1;k++){const az=yaw+k*.65,end=[tip[0]+Math.sin(az)*.016,tip[1]+.016,tip[2]+Math.cos(az)*.016];b.branch(tip,end,.0003,stem,'cymePedicel');flower(end,az,1.5);}
   }
   if(kei&&j>=3){
    for(const side of [-1,1]){
     const yaw=turn+(side<0?Math.PI:0),tip=[at[0]+Math.sin(yaw)*w*.11,at[1]+top*.19,at[2]+Math.cos(yaw)*w*.11];b.branch(at,tip,.0012,stem,dead?'standingDeadRaceme':'racemeAxis');
     if(s.bloom)for(let k=0;k<22;k++){
      const tt=(k+.5)/22,axis=at.map((v,n)=>v+(tip[n]-v)*tt),end=[axis[0]+Math.sin(yaw)*.004,axis[1],axis[2]+Math.cos(yaw)*.004];b.branch(axis,end,.0003,stem,'pedicel');
      if(k>17)b.add(kit.bud,'flowerBud','#bcc39c',...end,.0018,.0023,.0018);else flower(end,yaw,.98);
     }
    }
   }else if((che||mel)&&s.bloom&&j>=3){
    for(const side of [-1,1])for(let k=0;k<2;k++){
     const yaw=turn+(side<0?Math.PI:0)+(k-.5)*.40,end=[at[0]+Math.sin(yaw)*.012,at[1]-.003,at[2]+Math.cos(yaw)*.012];b.branch(at,end,.001,stem,'pedicel');flower(end,yaw,che?2.15:1.65);
    }
   }else if((iso||trip)&&j>=3&&s.bloom){
    for(const side of [-1,1]){
     const yaw=turn+(side<0?Math.PI:0),end=[at[0]+Math.sin(yaw)*w*.19,at[1]+top*.10,at[2]+Math.cos(yaw)*w*.19];b.branch(at,end,.00085,stem,'cymeAxis');
     for(let k=0;k<3;k++){
      const t=(k+1)/3,base=at.map((v,n)=>v+(end[n]-v)*t);
      if(trip&&k<2&&rand()<s.leafDensity)for(const side of [-1,1])leaf(base,a.leafLength*(.55-t*.2)*scale,yaw+side*Math.PI/2);
      for(let q=0;q<(iso?3:2);q++){
       const az=yaw+(q-1)*.75,tip=[base[0]+Math.sin(az)*(iso?.027:.015),base[1]+.015,base[2]+Math.cos(az)*(iso?.027:.015)];b.branch(base,tip,.0003,stem,'cymePedicel');
       if((i+j+k+q)%3===0)b.add(kit.bud,'flowerBud',iso?'#7e8b67':'#a4a7b7',...tip,iso?.0014:.0024,iso?.002:.0034,iso?.0014:.0024);
       else flower(tip,az,iso?1.65:1.5);
      }
     }
    }
   }
  }
  if(leu&&s.bloom){
   const length=Math.min(.10,h*.22),base=prev,tip=[base[0],base[1]+length,base[2]];b.branch(base,tip,.0015,stem,'spikeAxis');
   for(let j=0;j<10;j++)for(let k=0;k<10;k++){
    const yaw=an+k*TAU/10+j*.20,at=[base[0]+Math.sin(yaw)*.003,base[1]+length*j/10,base[2]+Math.cos(yaw)*.003];
    if(j>7)b.add(kit.bud,'flowerBud','#d8d7a7',...at,.0017,.0023,.0017);else flower(at,yaw,1.10);
   }
  }
 }
}

function drawSpringOrchidBulb(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,orchid=a.architecture==='bletillaShoots',h=s.height,w=s.spread,green=s.leafColor,stem=a.stemColor,n=Math.max(2,Math.round((orchid?5:6)*detail)),scale=s.leafScale;
 for(let i=0;i<n;i++){
  const an=i*2.399,rr=w*(orchid?.20:.29)*Math.sqrt((i+.5)/n),x=Math.sin(an)*rr,z=Math.cos(an)*rr,top=h*(.80+rand()*.18)*(orchid?scale:1);
  if(orchid){
   const tip=[x+Math.sin(an)*w*.055,top*.58,z+Math.cos(an)*w*.055];b.branch([x,.005,z],tip,.0024,stem,'leafyStem');
   for(let j=0;j<5;j++){
    const t=.08+j*.115,len=Math.min(a.leafLength,h*.68)*(j===4?.82:1)*scale,yaw=an+j*Math.PI,at=[x+(tip[0]-x)*t/.58,top*t,z+(tip[2]-z)*t/.58];
    b.add('bletillaPlicate','leaf',kit.shade(rand,green,.03),...at,a.leafWidth*scale,len,len,.35+j*.07,yaw,0);
    b.branch([at[0],at[1]-.012,at[2]],[at[0],at[1]+.019,at[2]],.0030,green,'leafSheath');
   }
   if(!s.bloom)continue;
   let prev=tip;const fl=5;
   for(let j=0;j<fl;j++){
    const t=j/(fl-1),turn=an+(j%2?-.9:.9),at=[tip[0]+Math.sin(an)*.015*t,top*(.62+t*.35),tip[2]+Math.cos(an)*.015*t];b.branch(prev,at,.0016*(1-t*.4),stem,'racemeAxis');prev=at;
    const end=[at[0]+Math.sin(turn)*.019,at[1]+.009,at[2]+Math.cos(turn)*.019];b.branch(at,end,.0012,stem,'inferiorOvary');
    if(j===fl-1){b.add(kit.bud,'flowerBud','#86759c',...end,.0035,.011,.0035,.30,turn,0);continue;}
    detailedFlower(b,{x:end[0],y:end[1],z:end[2],shape:a.flowerShape,color:s.flowerColor,r:a.flowerRadius,tilt:.08,yaw:turn},{...kit,rand});
   }
  }else{
   // Each bulb retains a pair of basal leaves, with two independent flowering scapes.
   for(const side of [-1,1]){
    const len=Math.min(a.leafLength,top*.95)*(.85+rand()*.15)*scale;
    b.add('puschkiniaStrap','leaf',s.month>=5?'#9eab6d':green,x+side*.002,.003,z,a.leafWidth,len,len,.22,an+side*Math.PI/2,0);
   }
   if(!s.bloom)continue;
   for(let axis=0;axis<2;axis++){
    const az=an+axis*2.4,bx=x+Math.sin(az)*.009,bz=z+Math.cos(az)*.009,tall=top*(axis?.85:1);
    b.branch([bx,.004,bz],[bx,tall,bz],.0009,stem,'floralScape');
    for(let j=0;j<10;j++){
     const t=j/10,turn=az+j*2.399,at=[bx,tall*(.42+t*.54),bz],end=[bx+Math.sin(turn)*.006,at[1]+.002,bz+Math.cos(turn)*.006];b.branch(at,end,.00032,stem,'pedicel');
     if(j===9){b.add(kit.bud,'flowerBud','#c5d7d9',...end,.0021,.0035,.0021,.20,turn,0);continue;}
     detailedFlower(b,{x:end[0],y:end[1],z:end[2],shape:a.flowerShape,color:s.flowerColor,r:a.flowerRadius,tilt:1.25+(rand()-.5)*.2,yaw:turn},{...kit,rand});
    }
   }
  }
 }
}

function drawAlceaSpires(b,{info,s,p,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,rug=a.architecture==='rugosaSpire',h=s.height,w=s.spread,stem=a.stemColor,baseLen=Math.min(a.leafLength,w*.40),early=[1,2,3,4,11,12].includes(s.month),ripple=a.flowerPalette.ripple&&s.flowerColor===a.flowerOptions?.[0],single=rug||ripple;
 const leaf=(origin,len,angle,pitch)=>{
  const f=flowerFrame(b,origin,pitch,angle);f.add(a.leafShape,'leaf-alcea-underside-b7bdaa',kit.shade(rand,s.leafColor,.025),0,0,0,len,len,len);
  const center=[0,.70*.57*len,0];f.branch([0,0,0],center,.00065,'#9da883','bladeBase');
  for(let j=-2;j<=2;j++){
   const aa=j*TAU/5,end=alceaLeafPoint(a.leafShape,.88,aa).map(v=>v*len);f.branch(center,end,.00032,'#a2ae88','palmateVein');
   for(let k=2;k<=6;k++)for(const side of [-1,1]){const t=k/8,from=center.map((v,n)=>v+(end[n]-v)*t),to=alceaLeafPoint(a.leafShape,t+.13,aa+side*.18).map(v=>v*len);f.branch(from,to,.00011,'#8d9d7d','lateralVein');}
  }
  for(let j=0;j<(rug?35:22);j++){
   const t=.18+rand()*.72,aa=(rand()-.5)*Math.PI*1.7,at=alceaLeafPoint(a.leafShape,t,aa).map(v=>v*len);at[2]-=.0004;
   for(let k=0;k<4;k++){const az=k*TAU/4;f.branch(at,[at[0]+Math.sin(az)*.0006,at[1]+Math.cos(az)*.0006,at[2]-.0005],.000045,'#bdc5ac','stellateHair');}
  }
 };
 for(let i=0;i<Math.round((rug?19:13)*detail*s.leafDensity);i++){
  // Retained rugosa leaves stay mature-sized; fewer leaves do not imply miniature blades.
  const an=i*2.399,len=baseLen*(.70+rand()*.3)*(rug&&early?.95:(early?.60:1)*s.leafScale),root=[Math.sin(an)*w*.035,.006,Math.cos(an)*w*.035],end=[Math.sin(an)*len*.27,.012+len*.20,Math.cos(an)*len*.27];b.branch(root,end,.0018,stem,'petiole');leaf(end,len,an,1.10+rand()*.2);
 }
 if(early)return;
 const count=rug?4:3,progress=(s.month-(a.flowerMonths?.[0]||5))/Math.max(1,(a.flowerMonths?.length||4)-1),lo=.29+Math.max(0,progress)*.33,hi=Math.min(.96,lo+.39);
 for(let i=0;i<count;i++){
  const an=i*2.399,root=[Math.sin(an)*w*.045,.008,Math.cos(an)*w*.045],tall=h*(i===0?.96:.71+rand()*.16),reach=w*(i===0?.035:.19);let prev=root;
  for(let j=1;j<=18;j++){
   const t=j/18,at=[root[0]+Math.sin(an)*reach*t*t,tall*t,root[2]+Math.cos(an)*reach*t*t],turn=an+j*2.399;b.branch(prev,at,.007*(1-t*.74),stem,'floweringStem');
   for(let k=0;k<10;k++){const pos=prev.map((v,n)=>v+(at[n]-v)*(k+.5)/10),az=k*2.399;pos[0]+=Math.sin(az)*.004*(1-t*.6);pos[2]+=Math.cos(az)*.004*(1-t*.6);b.branch(pos,[pos[0]+Math.sin(az)*.0015,pos[1]+.0004,pos[2]+Math.cos(az)*.0015],.00006,'#bbc3aa','stemHair');}prev=at;
   if(j<15&&rand()<s.leafDensity){const len=baseLen*(1-t*.65),end=[at[0]+Math.sin(turn)*len*.47,at[1]+len*.08,at[2]+Math.cos(turn)*len*.47];b.branch(at,end,.0015*(1-t*.4),stem,'petiole');leaf(end,len,turn,.98+rand()*.2);}
   if(j<5)continue;
   const r=a.flowerRadius*(.9+rand()*.1),end=[at[0]+Math.sin(turn)*r*.45,at[1]+r*.1,at[2]+Math.cos(turn)*r*.45];b.branch(at,end,.0019,stem,'pedicel');
   if(s.bloom&&t>=lo&&t<=hi){detailedFlower(b,{x:end[0],y:end[1],z:end[2],r,color:s.flowerColor,shape:a.flowerShape,layers:single?1:a.flowerLayers,palette:{...a.flowerPalette,ripple},tilt:1.15,yaw:turn},{...kit,rand});}
   else if((s.bloom&&t<lo)||s.seedHeads){
    const f=flowerFrame(b,end,1.15,turn),color=s.seedHeads?'#a59679':'#91a077';f.add(kit.bud,'schizocarp',color,0,0,0,r*.23,r*.07,r*.23);
    for(let k=0;k<25;k++){const az=k*TAU/25;f.add(kit.bud,'mericarp',color,Math.sin(az)*r*.21,r*.01,Math.cos(az)*r*.21,r*.031,r*.062,r*.029,0,az,0);}
    for(let k=0;k<5;k++)f.add('monocotBroadTepal','persistentCalyx',color,0,-r*.025,0,r*.20,r*.24,r*.24,1.1,k*TAU/5,0);
   }else if(s.bloom||s.month===5){
    const f=flowerFrame(b,end,.25,turn);f.add(kit.bud,'flowerBud','#9eab80',0,0,0,r*.21,r*.29,r*.21);for(let k=0;k<5;k++)f.add('monocotBroadTepal','budCalyx',stem,0,-r*.14,0,r*.18,r*.41,r*.31,.2,k*TAU/5,0);
   }
  }
 }
}

function drawMonocotProfiles(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,arch=a.architecture,lib=arch==='libertiaFans',ant=arch==='anthericumPanicle',tof=arch==='tofieldiaRaceme',orn=arch==='ornithogalumRaceme',rho=arch==='rhodoxisClump',sic=arch==='siculumUmbel',ari=arch==='aristeaFans',h=s.height,w=s.spread,stem=a.stemColor,leafLen=Math.min(a.leafLength,h*(lib?.98:tof?.47:rho?.72:.62)),leafWidth=Math.min(a.leafWidth,w*.065),fans=Math.max(3,Math.round((rho?25:lib?11:ari?8:tof?14:ant?7:sic?3:5)*detail)),bases=[];
 const leaf=(at,len,yaw,pitch,width=leafWidth)=>{
  const f=flowerFrame(b,at,pitch,yaw),kind=lib?patternKind('leaf','center',s.leafPatternColor):'leaf';
  f.add(a.leafShape,kind,kit.shade(rand,s.leafColor,.04),0,0,0,width,len,len);
  if(lib||tof||ari||sic||rho){const folded=sic||rho||ari;f.branch([0,0,-.0001],[0,len*.90,(lib?.035:folded?.15:.12)*len*.81-.0001],.00011,lib?'#b79a60':'#92a577','leafKeel');}
  if(rho)for(let j=0;j<9;j++){const t=.1+rand()*.8,side=j%2?1:-1,xx=side*width*.45*Math.pow(Math.sin(t*Math.PI),.28),from=[xx,len*t,len*.15*t*t+.0001];f.branch(from,[xx+side*.00045,from[1]+.0003,from[2]+.0006],.000045,'#c2c6a7','leafHair');}
 };
 for(let i=0;i<fans;i++){
  const an=i*2.399,rr=w*(rho?.32:lib?.30:.23)*Math.sqrt((i+.5)/fans),root=[Math.sin(an)*rr,.005,Math.cos(an)*rr];bases.push(root);
  const count=Math.round((rho?7:lib?9:tof?8:ari?9:ant?13:6)*s.leafDensity);
  for(let j=0;j<count;j++){
   const fan=lib||tof||ari,side=j%2?1:-1,pitch=fan?side*(.12+(j/count)*.63):.16+rand()*.65,yaw=fan?an:an+j*2.399,len=leafLen*(.48+rand()*.52)*s.leafScale,at=[root[0]+Math.sin(an)*side*j*.0007,root[1]+(count-j)*.00025,root[2]+Math.cos(an)*side*j*.0007];leaf(at,len,yaw,pitch);
  }
 }
 if(!s.bloom&&!(sic&&s.seedHeads))return;
 const curve=(from,to,rad,kind,archHeight=0)=>{let prev=from;for(let j=1;j<=7;j++){const t=j/7,at=from.map((v,k)=>v+(to[k]-v)*t+(k===1?archHeight*Math.sin(Math.PI*t):0));b.branch(prev,at,rad*(1-t*.25),stem,kind);prev=at;}};
 const flower=(at,yaw,tilt=0,scale=1)=>detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius*scale,color:s.flowerColor,shape:a.flowerShape,tilt,yaw},{...kit,rand});
 if(rho){
  const n=Math.max(3,Math.round(fans*1.5*s.flowerDensity));for(let i=0;i<n;i++){
   const root=bases[i%bases.length],an=i*2.399,at=[root[0]+Math.sin(an)*.02,h*(.53+rand()*.34),root[2]+Math.cos(an)*.02];curve(root,at,.00075,'flowerScape');
   if(i%7===1)b.add(kit.bud,'flowerBud','#b5628b',...at,.002,.009,.002);else flower(at,an,.12+rand()*.28);
  }return;
 }
 if(sic){
  for(let i=0;i<bases.length;i++){
   const root=bases[i],an=i*2.399,top=[root[0],h*(.82+rand()*.12),root[2]];curve(root,top,.0026,'floralScape');
   if(s.bloom)b.add('monocotBroadTepal','paperySpathe','#b4aa8c',...top,.025,.030,.030,1.8,an,0);
   const n=Math.round(22*detail),headRadius=Math.min(.075,w*.35);
   for(let j=0;j<n;j++){
    const aa=j*2.399,rr=headRadius*(.38+.62*Math.sqrt((j+.5)/n)),at=[top[0]+Math.sin(aa)*rr,top[1]+(s.seedHeads?.04+rand()*.025:-.018-rand()*.042),top[2]+Math.cos(aa)*rr];curve(top,at,.00065,'umbelRay',s.seedHeads?.005:.018);
    if(s.seedHeads){b.add(kit.bud,'uprightCapsule','#a99773',...at,.005,.009,.005);for(let k=0;k<3;k++)b.add('siculumTepal','dryPerianth','#b7a685',...at,.006,.009,.009,.05,k*TAU/3,0);}
    else flower(at,aa,2.55+rand()*.4,.87+rand()*.13);
   }
  }return;
 }
 const scapes=Math.max(3,Math.round((lib?7:ant?8:tof?25:orn?4:9)*detail*s.flowerDensity));
 for(let i=0;i<scapes;i++){
  const root=bases[i%bases.length],an=i*2.399,topH=h*(lib?.59+rand()*.17:tof?.79+rand()*.2:ant?.72+rand()*.24:.76+rand()*.23),lean=(tof?.03:ant?.04:.02),top=[root[0]+Math.sin(an)*lean,topH,root[2]+Math.cos(an)*lean];curve(root,top,lib?.0012:ant?.001:tof?.00065:orn?.0019:.0018,ari?'wingedScape':'flowerScape');
  if(ari){
   // A pair of thin laminae forms the two wings, separate from the stem core.
   const ff=flowerFrame(b,root,0,an);for(const side of [-1,1])ff.add('monocotNarrowTepal','stemWing',stem,0,0,side*.0008,.012,topH,.002,0,0,0);
  }
  if(tof||orn){
   const n=tof?25:34,start=tof?.63:.46;
   for(let j=0;j<n;j++){
    const t=start+(1-start)*j/n,aa=j*2.399,base=root.map((v,k)=>v+(top[k]-v)*t),rr=tof?.009:.017*(1-(j/n)*.55),at=[base[0]+Math.sin(aa)*rr,base[1]+(tof?.002:.006),base[2]+Math.cos(aa)*rr];curve(base,at,tof?.00025:.00048,'racemePedicel');
    b.add('monocotNarrowTepal','floralBract',stem,...base,.0015,tof?.003:.008,.003,.3,aa,0);
    if(j>n*.78)b.add(kit.bud,'flowerBud',orn?'#a7b47c':'#b8c6a3',...at,tof?.0014:.002,tof?.0028:.006,tof?.0014:.002,0,aa,0);
    else flower(at,aa,tof?1.0:.7,.82+rand()*.18);
   }
  }else{
   const tiers=lib?4:ant?7:6;
   for(let j=0;j<tiers;j++){
    const t=(lib?.42:.40)+j/tiers*(lib?.49:.53),aa=an+j*2.399,base=root.map((v,k)=>v+(top[k]-v)*t),reach=(lib?.025:ant?.07:.055)*(1-j/tiers*.55),end=[base[0]+Math.sin(aa)*reach,base[1]+h*(lib?.07:.06),base[2]+Math.cos(aa)*reach];curve(base,end,lib?.0008:ant?.00055:.0009,'panicleBranch');
    if(ari)leaf(base,.03+rand()*.02,aa,.47,.004);
    if(lib||ari)b.add('monocotNarrowTepal','scariousBract',lib?'#a09170':'#a28267',...end,lib?.006:.009,lib?.015:.014,.006,.25,aa,0);
    const count=lib?3:ant?4:4;
    for(let k=0;k<count;k++){
     const az=aa+k*1.1,dd=lib?.012:ant?.013:.006,at=[end[0]+Math.sin(az)*dd,end[1]+dd*(.35+k*.25),end[2]+Math.cos(az)*dd];curve(end,at,.0004,'flowerPedicel');
     if(k===3||ari&&k===2){b.add(kit.bud,ari&&k===2?'spentFlower':'flowerBud',ari&&k===2?'#817489':lib?'#a7ad80':ant?'#bbc6a0':'#787dac',...at,.0016,ari?.003:.005,.0016);}
     else flower(at,az,.45+rand()*.5,.88+rand()*.12);
    }
   }
  }
 }
}

function drawLowHerbs(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,arch=a.architecture,onos=arch==='onosmaRosette',bug=arch==='buglossoidesShoots',mert=arch==='mertensiaMat',cup=arch==='nierembergiaMat',star=arch==='stellariaCushion',dry=arch==='dryasMat',straw=arch==='goldenStrawberry',winter=[12,1,2].includes(s.month),h=s.height,w=s.spread,green=s.leafColor,stem=a.stemColor,len=Math.min(a.leafLength,w*(straw?.22:.42)),leaves=[];
 const leaf=(at,size,an,pitch)=>{
  const f=flowerFrame(b,at,pitch,an);f.add(a.leafShape,dry?'leaf-glossy-underside-b7bca6':mert?'leaf-glossy':'leaf',kit.shade(rand,green,.045),0,0,0,size,size,size);
  f.branch([0,0,-.00003],[0,size*.91,-size*.074],Math.min(.00022,size*.005),mert?'#bcc8c8':straw?'#d0d17c':'#92a17b','leafVein');
  if(dry||straw)for(let j=1;j<=7;j++)for(const side of [-1,1]){
   const t=j/9,ww=size*.31*Math.sin(t*Math.PI),base=[0,size*(t-.07),-size*.085*(t-.07)**2];f.branch(base,[side*ww,size*t,-size*.085*t*t+size*.035],.00009,straw?'#c2ca78':'#7f9167','lateralVein');
  }
  if(onos||bug||straw)for(let j=0;j<(onos?32:bug?12:10);j++){
   const t=.10+rand()*.78,xx=(rand()-.5)*size*(onos?.15:.27),from=[xx,t*size,-.085*t*t*size-.0003],hh=onos?.002:bug?.0007:.0006;f.branch(from,[xx+.0003,from[1]+hh*.2,from[2]-hh],onos?.00009:.00005,'#bfc4ab','leafHair');
  }
 };
 const flowers=[];
 if(straw){
  const count=Math.max(4,Math.round(48*detail*s.leafDensity));
  for(let i=0;i<count;i++){
   const an=i*2.399,rr=w*.26*Math.sqrt((i+.5)/count),root=[Math.sin(an)*rr*.45,.006,Math.cos(an)*rr*.45],at=[Math.sin(an)*rr,h*(.12+rand()*.51),Math.cos(an)*rr],size=len*(.78+rand()*.22)*s.leafScale;
   b.branch(root,at,.0008,stem,'petiole');for(const side of [-1,0,1]){const angle=an+side*1.12,tip=[at[0]+Math.sin(angle)*size*.09,at[1]+.001,at[2]+Math.cos(angle)*size*.09];b.branch(at,tip,.00035,stem,'leafRachis');leaf(tip,size,angle,.95+rand()*.40);}
   if(i%6===0)flowers.push({root,at:[at[0]+Math.sin(an)*.025,h*(.40+rand()*.22),at[2]+Math.cos(an)*.025],an});
  }
 }else if(onos){
  const count=Math.max(8,Math.round(80*detail*s.leafDensity));
  for(let i=0;i<count;i++){
   const an=i*2.399,rr=w*.20*Math.sqrt((i+.5)/count),at=[Math.sin(an)*rr,.009+rand()*.015,Math.cos(an)*rr];leaf(at,len*(.60+rand()*.40)*s.leafScale,an,.55+rand()*.72);
  }
 }else{
  const shoots=Math.max(4,Math.round((star?82:cup?138:dry?92:mert?18:11)*detail*s.leafDensity));
  for(let i=0;i<shoots;i++){
   const an=i*2.399,rr=w*.39*Math.sqrt((i+.5)/shoots),trailing=bug&&s.month>=8,root=[Math.sin(an)*rr*.08,.006,Math.cos(an)*rr*.08],steps=bug||mert?7:5;let from=root;
   for(let j=1;j<=steps;j++){
    const t=j/steps,angle=an+.25*Math.sin(t*5+i),rise=bug&&!trailing?h*.67*t:h*(star?.43:mert?.30:cup?.34:.23)*Math.sin(t*Math.PI*.74),at=[Math.sin(angle)*rr*t,root[1]+rise,Math.cos(angle)*rr*t];
    b.branch(from,at,dry?.0013:mert?.0014:bug?.0011:.00050,stem,dry?'woodyCreeper':bug&&trailing?'vegetativeShoot':'herbStem');
    const size=len*(.68+rand()*.32)*s.leafScale,leafAngle=angle+(j%2?1.1:-1.1);leaf(at,size,leafAngle,bug?.95:mert?.95+rand()*.4:1.15+rand()*.28);if(star)leaf(at,size,leafAngle+Math.PI,1.18);
    if(bug)for(let k=0;k<6;k++){const pt=from.map((v,n)=>v+(at[n]-v)*(k+.5)/6);b.branch(pt,[pt[0]+.0007*Math.sin(k*2.399),pt[1]+.0002,pt[2]+.0007*Math.cos(k*2.399)],.00006,'#b4bb9e','stemHair');}
    from=at;
   }
   if(!winter&&!trailing&&i%(mert||bug?2:7)===0)flowers.push({root:from,at:[from[0],mert?from[1]+.018:h*(.59+rand()*.32),from[2]],an});
  }
 }
 if(onos&&s.bloom&&!winter){
  const count=Math.max(2,Math.round(6*detail));
  for(let i=0;i<count;i++){
   const an=i*2.399,rr=w*.13,root=[Math.sin(an)*rr,.009,Math.cos(an)*rr],tip=[root[0]+Math.sin(an)*w*.12,h*(.77+rand()*.22),root[2]+Math.cos(an)*w*.12];let from=root;
   for(let j=1;j<=6;j++){
    const t=j/6,at=[root[0]+(tip[0]-root[0])*t*t,tip[1]*t,root[2]+(tip[2]-root[2])*t*t];b.branch(from,at,.0020*(1-.45*t),stem,'flowerStem');if(j<6)leaf(at,len*(.67-.05*j),an+j*2.399,.75);
    for(let k=0;k<12;k++){const pt=from.map((v,n)=>v+(at[n]-v)*(k+.5)/12),aa=k*2.399;b.branch(pt,[pt[0]+Math.sin(aa)*.002,pt[1]+.0005,pt[2]+Math.cos(aa)*.002],.00009,'#b7ba9f','stemHair');}from=at;
   }
   for(let j=0;j<9;j++){
    const aa=an+j*.9,rr=.017+(j%3)*.008,at=[tip[0]+Math.sin(aa)*rr,tip[1]-.01*(j%3),tip[2]+Math.cos(aa)*rr];let from=tip;for(let k=1;k<=8;k++){const t=k/8,pt=[tip[0]+(at[0]-tip[0])*t,tip[1]+(at[1]-tip[1])*t+.012*Math.sin(t*Math.PI),tip[2]+(at[2]-tip[2])*t];b.branch(from,pt,.0009*(1-t*.3),stem,'cymeBranch');from=pt;}
    detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius*(.8+rand()*.2),color:s.flowerColor,shape:a.flowerShape,tilt:2.65+rand()*.22,yaw:aa},{...kit,rand});
   }
  }
  return;
 }
 if(winter)return;
 const count=Math.round(flowers.length*(s.bloom?s.flowerDensity:1));
 for(let i=0;i<count;i++){
  const {root,at,an}=flowers[i];
  if(!s.bloom&&!s.seedHeads&&!(straw&&s.fruitStage))continue;
  let scapeFrom=root;for(let k=1;k<=5;k++){const t=k/5,pt=[root[0]+(at[0]-root[0])*t+Math.sin(an)*.004*Math.sin(t*Math.PI),root[1]+(at[1]-root[1])*t,root[2]+(at[2]-root[2])*t+Math.cos(an)*.004*Math.sin(t*Math.PI)];b.branch(scapeFrom,pt,dry?.0007:straw?.0008:.00045,stem,'flowerScape');scapeFrom=pt;}
  if(dry&&s.seedHeads&&!s.bloom){
   b.add(kit.bud,'seedHead','#ada183',...at,.0024,.0025,.0024);
   for(let j=0;j<35;j++){
    const aa=j*2.399,rr=.011*Math.sqrt((j+.5)/35),end=[at[0]+Math.sin(aa)*rr,at[1]+.010+rand()*.015,at[2]+Math.cos(aa)*rr];b.branch(at,end,.00012,'#b4aa91','persistentStyle');
    for(let k=1;k<9;k++){const t=k/10,pt=at.map((v,n)=>v+(end[n]-v)*t);for(const side of [-1,1])b.branch(pt,[pt[0]+Math.sin(aa+side)*.0025,pt[1]+.001,pt[2]+Math.cos(aa+side)*.0025],.00004,'#d4ceba','styleHair');}
   }
  }else if(straw&&s.fruitStage&&i%3!==0){
   const ripe=i%3===1,r=a.fruitRadius,pt=[at[0],at[1]-r*1.4,at[2]];
   b.add(kit.bud,'fleshyReceptacle',ripe?a.fruitColor:'#b7bb7a',...pt,r,r*1.35,r);
   for(let j=0;j<62;j++){
    const t=(j+.5)/62,yy=1-2*t,aa=j*2.399,rr=r*Math.sqrt(1-yy*yy);b.add(kit.bud,'achene',ripe?'#b7a575':'#b9b379',pt[0]+Math.sin(aa)*rr,pt[1]+yy*r*1.35,pt[2]+Math.cos(aa)*rr,.00030,.00046,.00022,0,aa,0);
   }
   for(let j=0;j<5;j++)b.add('narrow','fruitCalyx',stem,pt[0],pt[1]+r*1.2,pt[2],r*.22,r*.60,r,1.2,j*TAU/5,0);
  }else if(s.bloom){
   const n=mert?8:bug?4:1;
   for(let j=0;j<n;j++){
    const aa=an+j*2.399,rr=n===1?0:mert?.015:.017,tip=[at[0]+Math.sin(aa)*rr,at[1]+(n===1?0:.004*(j%3)),at[2]+Math.cos(aa)*rr];if(n>1)b.branch(at,tip,.00036,stem,'cymeBranch');
    detailedFlower(b,{x:tip[0],y:tip[1],z:tip[2],r:a.flowerRadius,color:mert&&j%3===0?'#bc7f9f':s.flowerColor,shape:a.flowerShape,tilt:mert?2.28+rand()*.38:bug?.70+rand()*.4:.08+rand()*.22,yaw:aa},{...kit,rand});
   }
  }
 }
}

function drawApiaceae(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,arch=a.architecture,silver=arch==='silverCaraway',moon=arch==='moonCarrot',flam=arch==='flamingoRunners',pimp=arch==='pimpinellaRose',cherv=arch==='hairyChervil',hog=arch==='pinkHogweed',winter=[12,1,2].includes(s.month),h=s.height,w=s.spread,len=Math.min(a.leafLength,w*(hog?.62:.55)),green=s.leafColor,stem=a.stemColor,lk=flam?patternKind('leaf','flamingoMargin',s.leafPatternColor):silver?'leaf-woolly':'leaf';
 const blade=(f,at,length,angle,shape=a.leafShape)=>{
  const ff=flowerFrame(f,at,.1,0);ff.add(shape,lk,kit.shade(rand,green,.06),0,0,0,length,length,length,0,0,angle);
  const vein=flowerFrame(ff,[0,0,0],0,0),end=[-Math.sin(angle)*length*.9,Math.cos(angle)*length*.9,-length*.063];vein.branch([0,0,-.00003],end,Math.min(.0005,length*.006),silver?'#c0c7b3':'#91a06c','leafVein');
  if(hog||silver)for(let j=0;j<(silver?10:20);j++){
   const t=.1+rand()*.76,x=(rand()-.5)*length*.19,pt=[x*Math.cos(angle)-Math.sin(angle)*t*length,x*Math.sin(angle)+Math.cos(angle)*t*length,-.08*t*t*length-.0003];ff.branch(pt,[pt[0]+.0003,pt[1]+.0002,pt[2]-(silver?.0006:.0015)],silver?.00006:.00012,'#bfc5ae','leafHair');
  }
 };
 const compound=(f,length,depth=0)=>{
  const pairs=silver?13:hog?3:pimp?3:flam?2:cherv?3:5;f.branch([0,0,0],[0,length,0],Math.min(.0013,length*.008),stem,'leafRachis');
  for(let j=0;j<pairs;j++)for(const side of [-1,1]){
   const t=(silver?.13:.23)+j*(silver?.79:.61)/Math.max(1,pairs-1),at=[0,length*t,0],ll=length*(silver?.19:hog?.36:pimp?.32:flam?.30:cherv?.55:.38)*(1-t*.72);
   if(depth>0){const f2=flowerFrame(f,at,.06,side*.18);const proxy={add:(shape,kind,color,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0)=>{const aa=side*.90;f2.add(shape,kind,color,x*Math.cos(aa)-y*Math.sin(aa),x*Math.sin(aa)+y*Math.cos(aa),z,sx,sy,sz,rx,ry,rz+aa);},branch:(from,to,r,col,kind)=>{const aa=side*.90,tr=p=>[p[0]*Math.cos(aa)-p[1]*Math.sin(aa),p[0]*Math.sin(aa)+p[1]*Math.cos(aa),p[2]];f2.branch(tr(from),tr(to),r,col,kind);}};compound(proxy,ll,depth-1);}
   else blade(f,at,ll,side*.86);
  }
  blade(f,[0,length*.84,0],length*(silver?.15:.29),0,pimp?'chervilLeaflet':a.leafShape);
 };
 const leaves=Math.max(7,Math.round((silver?32:flam?46:moon?38:hog?13:25)*detail*s.leafDensity));
 for(let i=0;i<leaves;i++){
  const an=i*2.399,rr=w*(flam?.32:.12)*Math.sqrt((i+.5)/leaves),at=[Math.sin(an)*rr,.01,Math.cos(an)*rr],ll=len*(.67+rand()*.33)*s.leafScale,f=flowerFrame(b,at,.65+rand()*.63,an);
  compound(f,ll,moon||cherv||flam&&i%4===0?1:0);
  if(flam&&i>0){const root=[at[0]*.53,.006,at[2]*.53];b.branch(root,at,.0008,stem,'stolon');}
 }
 if(winter||!s.bloom)return;
 const shoots=Math.max(2,Math.round((silver?13:moon?3:flam?5:hog?3:5)*detail));
 const umbel=(at,hr,angle)=>{
  const rays=silver?1:moon?24:pimp?12:hog?20:flam?8:12,n=silver?20:moon?80:hog?24:20;
  if(!pimp&&!silver)for(let j=0;j<(hog?4:8);j++)b.add('narrow','involucre',stem,...at,hr*.13,hr*.21,hr*.21,1.65,j*TAU/8,0);
  for(let ray=0;ray<rays;ray++){
   const ra=ray*2.399+angle,fr=silver?0:hr*Math.sqrt((ray+.5)/rays),center=[at[0]+Math.sin(ra)*fr,at[1]+(silver?0:hr*(.27+.32*Math.sqrt(1-(ray+.5)/rays))),at[2]+Math.cos(ra)*fr],sr=silver?hr:moon?hr*.12:hog?hr*.16:hr*.16;
   if(!silver)b.branch(at,center,moon?.0007:.00045,stem,'umbelRay');
   if(!pimp)for(let j=0;j<(silver?7:moon?15:6);j++)b.add('narrow','involucel',stem,center[0],center[1]-.001,center[2],sr*.20,sr*.59,sr*.59,1.48,j*TAU/(silver?7:moon?15:6),0);
   for(let j=0;j<n;j++){
    const t=(j+.5)/n,fa=j*2.399,polar=1-1.7*t,fr=sr*(moon?Math.sqrt(1-polar*polar):Math.sqrt(t)),tip=[center[0]+Math.sin(fa)*fr,center[1]+sr*(moon?.65+polar:.30*Math.sqrt(1-t)),center[2]+Math.cos(fa)*fr];b.branch(center,tip,.00010,stem,'umbelPedicel');
    const outer=hog&&t>.71,co=moon&&ray%7===2?'#d9bcc5':pimp&&ray%3===1?'#e2c2d0':s.flowerColor;
    detailedFlower(b,{x:tip[0],y:tip[1],z:tip[2],r:a.flowerRadius,color:co,shape:'apiaceaeFloret',palette:{outer,darkAnthers:moon},tilt:moon?Math.acos(polar):.05,yaw:fa},{...kit,rand});
   }
  }
 };
 for(let i=0;i<shoots;i++){
  const an=i*2.399,rr=w*(flam?.27:.09)*Math.sqrt((i+.5)/shoots),root=[Math.sin(an)*rr,.01,Math.cos(an)*rr],top=h*(.65+rand()*.30),tip=[root[0]+Math.sin(an)*w*.13,top,root[2]+Math.cos(an)*w*.13],thick=hog?.006:moon?.0038:silver?.0007:flam?.0009:.0016,points=[root];
  for(let k=1;k<=5;k++){
   const t=k/5,pt=[root[0]+(tip[0]-root[0])*t*t,top*t,root[2]+(tip[2]-root[2])*t*t];b.branch(points.at(-1),pt,thick*(1-t*.42),stem,'umbelStem');
   if(hog||moon)for(let rib=0;rib<7;rib++){const ra=rib*TAU/7,offset=p=>[p[0]+Math.sin(ra)*thick*.63,p[1],p[2]+Math.cos(ra)*thick*.63];b.branch(offset(points.at(-1)),offset(pt),thick*.07,moon?'#c5ccb6':'#929c6b','stemRidge');}
   if((hog||cherv||silver)&&k<5)for(let hair=0;hair<20;hair++){
    const q=(hair+.5)/20,ra=hair*2.399,start=points.at(-1).map((v,n)=>v+(pt[n]-v)*q),r=hog?.0025:.0008;b.branch(start,[start[0]+Math.sin(ra)*r,start[1]+.0006,start[2]+Math.cos(ra)*r],hog?.0001:.00005,'#b9bea8','stemHair');
   }
   if(!silver&&k<4){const ff=flowerFrame(b,pt,1.1,an+k*2.399);compound(ff,len*(.60-k*.10),moon||cherv?1:0);b.add(kit.bud,'leafSheath',stem,...pt,thick*1.7,thick*3.4,thick*1.7);}
   points.push(pt);
  }
  umbel(tip,a.headRadius,an);
  if(!silver&&!flam)for(const side of [-1,1]){
   const angle=an+side*1.15,at=[tip[0]+Math.sin(angle)*w*.20,tip[1]*.85,tip[2]+Math.cos(angle)*w*.20];b.branch(points[3],at,thick*.50,stem,'umbelBranch');umbel(at,a.headRadius*.63,angle);
  }
 }
}

function drawBellFamily(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,arch=a.architecture,mich=arch==='michauxiaAxis',tra=arch==='tracheliumCorymb',phy=arch==='phyteumaHeads',jas=arch==='jasioneHeads',edra=arch==='edraianthusTuft',wahl=arch==='wahlenbergiaTuft',h=s.height,w=s.spread,len=Math.min(a.leafLength,w*(mich?.50:.27)),winter=[12,1,2].includes(s.month),leafKind=wahl?'leaf-wahlenbergia':mich?'leaf-rough':'leaf',green=s.leafColor;
 const leaf=(at,size,yaw,pitch,shape=a.leafShape)=>{
  const f=flowerFrame(b,at,pitch,yaw);f.add(shape,leafKind,kit.shade(rand,green,.05),0,0,0,size,size,size);
  f.branch([0,0,-.00002],[0,size*.90,-size*.105],Math.min(.00035,size*.007),'#8f9b64','leafVein');
  if(mich)for(let j=0;j<14;j++){const t=.12+rand()*.71,u=(rand()-.5)*.24,at=[u*size,t*size,-.13*t*t*size-.001];f.branch(at,[at[0]+.0006,at[1]+.0005,at[2]-.0012],.000075,'#c2c5a3','leafHair');}
 };
 const leaves=Math.max(8,Math.round((mich?23:tra?18:edra?100:wahl?86:60)*detail*s.leafDensity));
 for(let i=0;i<leaves;i++){
  const an=i*2.399,rr=w*(mich||tra?.10:.27)*Math.sqrt((i+.2)/leaves),at=[Math.sin(an)*rr,.007,Math.cos(an)*rr],ll=len*(.63+rand()*.37)*s.leafScale;
  if(phy){const tip=[at[0]+Math.sin(an)*ll*.40,.010+ll*.12,at[2]+Math.cos(an)*ll*.40];b.branch(at,tip,.00045,a.stemColor,'petiole');leaf(tip,ll*.69,an,1.1);}
  else leaf(at,ll,an,.73+rand()*.64);
 }
 if(winter&&!edra)return;
 if(!s.bloom&&!mich&&!tra)return;
 const stems=Math.max(3,Math.round((mich?3:tra?5:edra?12:wahl?22:phy?13:15)*detail)),scales=s.bloom?1:.54;
 for(let i=0;i<stems;i++){
  const an=i*2.399,rr=w*(mich?.09:.26)*Math.sqrt((i+.5)/stems),root=[Math.sin(an)*rr,.008,Math.cos(an)*rr],top=h*(.62+rand()*.36)*scales,lean=w*(edra?.18:mich?.04:.09),points=[root];
  for(let k=1;k<=7;k++){
   const t=k/7,at=[root[0]+Math.sin(an)*lean*t*t,top*t,root[2]+Math.cos(an)*lean*t*t];b.branch(points.at(-1),at,mich?.0045*(1-t*.60):tra?.0019*(1-t*.52):.00065,a.stemColor,mich||tra?'floweringAxis':'flowerScape');points.push(at);
   if((mich||tra||phy)&&k<6){const size=len*(1-k*.12);leaf(at,size,an+k*2.399,1.05,phy?'edraianthusLinear':a.leafShape);}
   if(mich)for(let j=0;j<12;j++){const angle=j*2.399,pt=points[k-1].map((v,n)=>v+(at[n]-v)*(j+.3)/12);b.branch(pt,[pt[0]+Math.sin(angle)*.0027,pt[1]+.0008,pt[2]+Math.cos(angle)*.0027],.00013,'#b5ba91','stemHair');}
  }
  if(!s.bloom)continue;
  const end=points.at(-1),heads=[];
  if(mich){
   for(let j=1;j<7;j++){
    const angle=an+j*2.399,rr=w*(.10+.15*(1-j/7)),at=[end[0]+Math.sin(angle)*rr,top*(.30+j*.095),end[2]+Math.cos(angle)*rr],base=points[Math.max(1,j-1)];b.branch(base,at,.0016,a.stemColor,'pedicel');
    if(j%4===0){b.add(kit.bud,'bud','#cfd1b7',...at,a.flowerRadius*.23,a.flowerRadius*.59,a.flowerRadius*.23,.4,angle,0);continue;}
    detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius*(.86+rand()*.14),color:s.flowerColor,shape:a.flowerShape,tilt:2.12,yaw:angle},{...kit,rand});
   }continue;
  }
  if(tra){
   for(let j=0;j<4;j++){const angle=an+j*TAU/4,at=[end[0]+Math.sin(angle)*w*.14,end[1]-(j?top*.065:0),end[2]+Math.cos(angle)*w*.14];b.branch(points[5],at,.0009,a.stemColor,'corymbBranch');heads.push(at);}
  }else heads.push(end);
  for(const head of heads){
   if(wahl){
    detailedFlower(b,{x:head[0],y:head[1],z:head[2],r:a.flowerRadius,color:s.flowerColor,shape:a.flowerShape,tilt:.40+rand()*.60,yaw:an},{...kit,rand});continue;
   }
   if(edra){
    for(let j=0;j<10;j++)b.add('edraianthusLinear','involucre','#778a51',...head,.027,.027,.027,1.6,j*TAU/10,0);
    for(let j=0;j<6;j++){const angle=j*2.399,rr=.009*Math.sqrt((j+.5)/6),at=[head[0]+Math.sin(angle)*rr,head[1],head[2]+Math.cos(angle)*rr];detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius,color:s.flowerColor,shape:a.flowerShape,tilt:.15+rand()*.35,yaw:angle},{...kit,rand});}continue;
   }
   const hr=a.headRadius*(tra?.70:1),n=tra?88:phy?26:130;
   if(phy||jas)for(let j=0;j<(phy?7:12);j++)b.add('edraianthusLinear','involucre','#768551',head[0],head[1]-.003,head[2],phy?hr*1.90:hr*.78,phy?hr*1.90:hr*.78,hr,1.80,j*TAU/(phy?7:12),0);
   for(let j=0;j<n;j++){
    const t=(j+.5)/n,angle=j*2.399,polar=1-1.65*t,rad=hr*(tra?Math.sqrt(t):Math.sqrt(1-polar*polar)),at=[head[0]+Math.sin(angle)*rad,head[1]+hr*(tra?.10+.12*(1-t):.65+polar),head[2]+Math.cos(angle)*rad];
    if(tra)b.branch(head,at,.00020,a.stemColor,'corymbPedicel');
    detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius*(.86+rand()*.14),color:kit.shade(rand,s.flowerColor,.055),shape:a.flowerShape,tilt:tra?.1:Math.acos(polar),yaw:angle},{...kit,rand});
   }
  }
 }
}

function drawWaterMargin(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,arch=a.architecture,coin=arch==='waterCoin',fern=arch==='marsileaMutica',smooth=arch==='bacopaMonnieri',yellow=arch==='bacopaLanigera',w=s.spread,h=s.height,len=Math.min(a.leafLength,w*.14),green=s.leafColor;
 if(coin||fern){
  const count=Math.max(7,Math.round(62*detail*s.leafDensity));
  for(let i=0;i<count;i++){
   const an=i*2.399,rr=w*.38*Math.sqrt((i+.3)/count),x=Math.sin(an)*rr,z=Math.cos(an)*rr,top=h*(.43+rand()*.56),base=[x,-.006,z],at=[x+Math.sin(an)*h*.09,top,z+Math.cos(an)*h*.09],ll=len*(.71+rand()*.29)*s.leafScale;
   b.branch(base,at,coin?.00062:.00055,a.stemColor,'petiole');
   if(coin){
    const f=flowerFrame(b,at,Math.PI/2+(rand()-.5)*.23,an);f.add('waterCoinShield','leaf-coin-glossy',kit.shade(rand,green,.06),0,0,0,ll,ll,ll);
    for(let j=0;j<11;j++){
     const angle=j*TAU/11,rr=ll*.48,tip=[Math.sin(angle)*rr,Math.cos(angle)*rr,-ll*.031];f.branch([0,0,-ll*.001],tip,ll*.0034,'#91a760','leafVein');
    }
   }else{
    const f=flowerFrame(b,at,.03,an);
    for(let j=0;j<4;j++)f.add('marsileaWedge','leaf-marsilea',kit.shade(rand,green,.075),0,0,0,ll,ll,ll,Math.PI/2+(rand()-.5)*.12,j*TAU/4,0);
   }
   if(coin&&s.bloom&&i%6===0){
    const fx=x+len*.65,fz=z+len*.33,hh=top*1.13;b.branch([fx,.006,fz],[fx,hh,fz],.0005,a.stemColor,'flowerScape');
    for(let node=0;node<4;node++)for(let j=0;j<6;j++){
     const an=j*TAU/6+node*.3,at=[fx+Math.sin(an)*.005,hh*(.44+node*.17),fz+Math.cos(an)*.005],r=a.flowerRadius,f=flowerFrame(b,at,.7,an);
     b.branch([fx,at[1]-.002,fz],at,.00014,a.stemColor,'pedicel');
     for(let k=0;k<5;k++){
      const angle=k*TAU/5;f.add('waterPetal','petal',s.flowerColor,0,0,0,r*.55,r,r,1.41,angle,0);
      const tip=[Math.sin(angle)*r*.35,r*.45,Math.cos(angle)*r*.35];f.branch([0,0,0],tip,r*.017,'#dedccd','filament');f.add(kit.bud,'anther','#ddd2a4',...tip,r*.09,r*.06,r*.06);
     }
     for(const side of [-1,1])f.branch([side*r*.07,0,0],[side*r*.17,r*.34,0],r*.028,'#a5b185','style');
    }
   }
  }
  return;
 }
 const shoots=Math.max(6,Math.round((smooth?30:40)*detail*s.leafDensity));
 for(let i=0;i<shoots;i++){
  const an=i*2.399,rr=w*.34*Math.sqrt((i+.2)/shoots),cx=Math.sin(an)*rr,cz=Math.cos(an)*rr,top=h*(smooth?.12+rand()*.72:.35+rand()*.63),lean=smooth?w*.18:len*.6+rand()*w*.10,segments=Math.max(4,Math.min(10,Math.round(top/(len*.75))));let prior=[cx,.006,cz];
  for(let k=0;k<segments;k++){
   const t=(k+1)/segments,at=[cx+Math.sin(an)*lean*t,.007+top*t*t,cz+Math.cos(an)*lean*t];b.branch(prior,at,smooth?.00065:yellow?.001:.00085,a.stemColor,'aquaticStem');
   if(!smooth)for(let hair=0;hair<(yellow?24:8);hair++){
    const f=hair/(yellow?24:8),angle=hair*2.399,root=prior.map((v,n)=>v+(at[n]-v)*f),end=[root[0]+Math.sin(angle)*(yellow?.0015:.0008),root[1]+.0003,root[2]+Math.cos(angle)*(yellow?.0015:.0008)];b.branch(root,end,.000045,'#c6cfab','stemHair');
   }
   const ll=len*(.72+rand()*.28)*(k===segments-1?.61:1)*s.leafScale,angle=an+k*Math.PI/2;
   for(const side of [-1,1]){
    const f=flowerFrame(b,at,1.02+(rand()-.5)*.22,angle+(side===1?0:Math.PI));f.add(a.leafShape,yellow?'leaf-bacopa-veins':'leaf-glossy',kit.shade(rand,green,.055),0,0,0,ll,ll,ll);
    f.branch([0,0,-.00004],[0,ll*.91,-ll*.051],.00009,yellow?'#d1d894':'#8fa365','leafVein');
   }
   if(s.bloom&&k>=segments-3&&(i+k)%3===0){
    const r=a.flowerRadius,flower=[at[0]+Math.sin(angle)*len*.75,at[1]+len*.24,at[2]+Math.cos(angle)*len*.75];b.branch(at,flower,.0003,a.stemColor,'pedicel');
    detailedFlower(b,{x:flower[0],y:flower[1],z:flower[2],r,color:s.flowerColor,shape:'bacopaCorolla',tilt:1.0,yaw:angle},{...kit,rand});
   }
   prior=at;
  }
 }
}

function drawFreeFloaters(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,arch=a.architecture,fern=arch.startsWith('salvinia'),hyacinth=arch==='waterHyacinth',nat=arch==='salviniaNatans',hood=arch==='salviniaCucullata',w=s.spread,h=s.height,len=Math.min(a.leafLength,w*(hyacinth?.34:.18)),green=s.leafColor;
 if(fern){
  const shoots=Math.max(4,Math.round(14*detail*s.leafDensity)),nodes=5;
  for(let i=0;i<shoots;i++){
   const an=i*2.399,rr=w*.29*Math.sqrt((i+.5)/shoots),origin=[Math.sin(an)*rr,.010,Math.cos(an)*rr],axis=flowerFrame(b,origin,0,an+rand()*2),step=len*(.73+rand()*.16);
   let prior=[0,0,0];
   for(let k=0;k<nodes;k++){
    const at=[Math.sin(k*.70+i)*len*.25,0,(k-(nodes-1)/2)*step];if(k)axis.branch(prior,at,.0005,'#6d7244','floatingAxis');prior=at;
    for(const side of [-1,1]){
     const ll=len*(.68+rand()*.36),f=flowerFrame(axis,at,Math.PI/2+(rand()-.5)*.13,side*Math.PI/2+(rand()-.5)*.55);
     f.add(a.leafShape,'leaf-salvinia',kit.shade(rand,green,.06),0,0,0,ll,ll,ll);
     // Natans hairs have free branches, molesta branches reconnect, cucullata hairs are simple.
     for(let row=0;row<5;row++)for(let col=0;col<5;col++){
      const t=.13+row*.16,u=(col-2)*.34,pt=salviniaPoint(a.leafShape,t,u).map(v=>v*ll),tip=[pt[0],pt[1],pt[2]-ll*(nat?.045:.055)];
      f.branch(pt,tip,ll*.005,'#b2c18b','leafPapilla');
      if(hood)f.branch(tip,[tip[0]+ll*.008,tip[1]+ll*.012,tip[2]-ll*.033],ll*.0018,'#d1d8b0','simpleLeafHair');
      else for(let q=0;q<4;q++){
       const angle=q*TAU/4,mid=[tip[0]+Math.sin(angle)*ll*.028,tip[1]+Math.cos(angle)*ll*.028,tip[2]-ll*.026];
       f.branch(tip,mid,ll*.0016,'#c7d1ab',nat?'freeLeafHair':'joinedLeafHair');
       if(!nat)f.branch(mid,[tip[0],tip[1],tip[2]-ll*.062],ll*.0016,'#c7d1ab','joinedLeafHair');
      }
     }
    }
   }
  }return;
 }
 const rosettes=hyacinth?3:Math.max(3,Math.round(9*detail*s.leafDensity));let previous=null;
 for(let i=0;i<rosettes;i++){
  const angle=i*2.399,rr=w*(hyacinth?.21:.34)*Math.sqrt((i+.25)/rosettes),cx=Math.sin(angle)*rr,cz=Math.cos(angle)*rr,center=[cx,.012,cz];
  if(previous)b.branch(previous,center,hyacinth?.0018:.0009,a.stemColor,'stolon');previous=center;
  const count=hyacinth?7:6;
  for(let j=0;j<count;j++){
   const an=angle+j*TAU/count+(rand()-.5)*.18,ll=len*(.76+rand()*.28),reach=hyacinth?ll*.34:ll*.14,yy=hyacinth?Math.min(h*.49,ll*.8)*(.65+rand()*.35):.017+rand()*.001,at=[cx+Math.sin(an)*reach,yy,cz+Math.cos(an)*reach];
   b.branch(center,at,hyacinth?.002:.0009,a.stemColor,'petiole');
   if(hyacinth){const mid=center.map((v,n)=>v+(at[n]-v)*.58);b.add(kit.bud,'inflatedPetiole',kit.shade(rand,'#77964b',.04),...mid,ll*.18,Math.max(.008,yy*.39),ll*.18,.15,an,0);}
   const f=flowerFrame(b,at,hyacinth?.72+rand()*.5:Math.PI/2+(rand()-.5)*.07,an);
   f.add(a.leafShape,'leaf-glossy',kit.shade(rand,green,.055),0,0,0,ll,ll,ll);
   if(!hyacinth)f.add(a.leafShape,'spongyUnderside','#91a363',0,0,.0015,ll*.97,ll*.99,ll*.45);
   for(let v=-3;v<=3;v++){
    let prior=[0,0,-.00013];for(let k=1;k<=16;k++){
     const t=k/17,u=v*.21,width=(hyacinth?.55:.48)*Math.pow(Math.sin(t*Math.PI),.48),pt=[u*width*ll,t*ll,(-.10*u*u*Math.sin(t*Math.PI)-.035*t*t)*ll-.00013];
     f.branch(prior,pt,hyacinth?.00013:.00005,'#789750','leafVein');prior=pt;
    }
   }
  }
  if(!s.bloom)continue;
  if(hyacinth){
   const top=Math.min(h,.32)*(.88+rand()*.1),bottom=Math.min(top*.52,len*.85),r=Math.min(a.flowerRadius,w*.083,top*.15);
   b.branch(center,[cx,top,cz],.003,a.stemColor,'flowerScape');
   for(let k=0;k<8;k++){
    const an=angle+k*2.399,at=[cx+Math.sin(an)*r*.27,bottom+(top-bottom)*k/8,cz+Math.cos(an)*r*.27],f=flowerFrame(b,at,1.06,an);
    f.add('tube','perianthTube','#a59cb9',0,-r*.28,0,r*.09,r*.58,r*.09);
    for(let j=0;j<6;j++){const upper=j===3,pr=r*(upper?1.12:.94);f.add('hyacinthTepal',upper?'petal-hyacinth-eye':'petal-hyacinth-veins',kit.shade(rand,s.flowerColor,.025),0,0,0,pr,pr,pr,1.33,j*TAU/6,0);}
    for(let j=0;j<6;j++){
     const an=j*TAU/6,hh=r*(j<3?.60:.39),tip=[Math.sin(an)*r*.10,hh,-r*.18];
     f.branch([Math.sin(an)*r*.07,0,Math.cos(an)*r*.07],tip,r*.009,'#c5b3cd','filament');f.add(kit.bud,'anther','#817589',...tip,r*.030,r*.044,r*.023);
    }
    f.branch([0,0,0],[0,r*.51,-r*.16],r*.012,'#b9c2a4','style');
    for(let j=0;j<3;j++){const an=j*TAU/3;f.add(kit.bud,'stigma','#d6d1b1',Math.sin(an)*r*.025,r*.54,-r*.16+Math.cos(an)*r*.025,r*.023,r*.017,r*.023);}
   }
  }else if(i%2===0){
   const r=a.flowerRadius,at=[cx,.022,cz],f=flowerFrame(b,at,.15,angle);
   // Male flowers have three narrow petals; female flowers expose divided styles.
   for(let j=0;j<3;j++){
    const an=j*TAU/3;f.add('nupharSmallPetal','petal','#eeeeda',0,0,0,r*.60,r,r,1.29,an,0);f.add('nupharSmallPetal','sepal','#a7b07d',0,-.0003,0,r*.5,r*.7,r*.7,1.5,an+.4,0);
   }
   f.add(kit.bud,'staminalColumn','#d4d2a9',0,r*.22,0,r*.09,r*.24,r*.09);
   for(let j=0;j<6;j++){const an=j*TAU/6;f.add(kit.bud,'anther','#c8ba72',Math.sin(an)*r*.09,r*.47,Math.cos(an)*r*.09,r*.065,r*.085,r*.04);}
   const female=flowerFrame(b,[cx+len*.3,.020,cz],0,angle);
   female.add(kit.bud,'ovary','#819d63',0,0,0,r*.23,r*.29,r*.23);
   for(let j=0;j<6;j++){
    const an=j*TAU/6,base=[0,r*.16,0],fork=[Math.sin(an)*r*.35,r*.36,Math.cos(an)*r*.35];female.branch(base,fork,r*.015,'#d8d7b4','style');
    for(const side of [-1,1])female.branch(fork,[Math.sin(an+side*.19)*r*.86,r*.42,Math.cos(an+side*.19)*r*.86],r*.010,'#d8d7b4','dividedStigma');
   }
  }
 }
}

function drawFloatingAquatics(b,{info,s,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance,arch=a.architecture,arrow=arch==='waterArrowhead',nuphar=arch==='nupharEmergent',poppy=arch==='waterPoppy',floating=!arrow&&!nuphar,h=s.height,w=s.spread,green=s.leafColor,stem=a.stemColor;
 const leaves=Math.max(5,Math.round((floating?38:arrow?24:14)*detail*s.leafDensity)),size=Math.min(a.leafLength,w*(floating?.23:.39),floating?a.leafLength:h*(arrow?.55:.76));
 function blade(at,length,pitch,yaw){
  const f=flowerFrame(b,at,pitch,yaw);f.add(a.leafShape,'leaf-glossy',kit.shade(rand,green,.048),0,0,0,length,length,length);
  if(arrow){for(const side of [-1,0,1]){let from=[0,0,-.0001];for(let k=1;k<=16;k++){const t=k/16,pos=[side*length*.073*Math.sin(t*Math.PI),t*length,length*.10*t*t-.00012];f.branch(from,pos,.00015,'#739453','leafVein');from=pos;}}}
  else{
   f.branch([0,0,-.0002],[0,length*.86,-.0002],.00024,'#79965a','leafVein');
   for(let k=1;k<=7;k++)for(const sign of [-1,1]){const t=k/9,x=sign*length*(nuphar?.26:.40)*Math.sin(t*Math.PI);f.branch([0,length*t,-.0002],[x,length*(t+.07),-.0002],.00012,'#718d52','leafVein');}
  }
 }
 for(let i=0;i<leaves;i++){
  const an=i*2.399963,rr=w*(floating?.39:.16)*Math.sqrt((i+.5)/leaves),x=Math.sin(an)*rr,z=Math.cos(an)*rr,len=size*(.76+rand()*.34),pitch=floating?Math.PI/2+(rand()-.5)*.11:arrow?.10+rand()*.70:.65+rand()*.65;
  const origin=[x,floating?.014+rand()*.002:h*(arrow?.31:.43)*( .55+rand()*.45),z];
  if(!floating)b.branch([x*.43,0,z*.43],origin,arrow?.0014:.0028,stem,'petiole');
  blade(origin,len,pitch,an+(rand()-.5)*.8);
 }
 if(!s.bloom)return;
 const count=Math.max(1,Math.round((arrow?4:nuphar?5:9)*detail*s.flowerDensity)),r=Math.min(a.flowerRadius,w*.08,h*(floating?.32:.12));
 for(let i=0;i<count;i++){
  const an=i*2.399+1,rr=w*(floating?.34:.13)*Math.sqrt((i+.5)/count),x=Math.sin(an)*rr,z=Math.cos(an)*rr,top=h*(.80+rand()*.16),root=[x*.8,0,z*.8];
  if(arrow){
   b.branch(root,[x,top,z],.0013,stem,'flowerScape');
   for(let level=0;level<5;level++)for(let j=0;j<3;j++){
    const angle=an+j*TAU/3,node=[x,top*(.47+level*.12),z],tip=[x+Math.sin(angle)*h*.075,node[1]+h*.025,z+Math.cos(angle)*h*.075];
    b.branch(node,tip,.00055,stem,'pedicel');
    const f=flowerFrame(b,tip,.35+rand()*.55,angle);
    for(let k=0;k<3;k++){const aa=k*TAU/3;f.add('waterPetal','petal','#f4f2e5',0,0,0,r,r,r,1.42,aa,0);f.add('narrow','sepal','#6b824c',0,-r*.08,0,r*.3,r*.45,r*.45,1.6,aa+.5,0);}
    f.add(kit.bud,'carpelHead','#819852',0,r*.08,0,r*.25,r*.22,r*.25);
    for(let k=0;k<34;k++){const aa=k*2.399,rrr=r*.24*Math.sqrt((k+.5)/34);f.add(kit.bud,'stigma','#a0af60',Math.sin(aa)*rrr,r*(.17+.12*Math.sqrt(1-(rrr/r/.25)**2)),Math.cos(aa)*rrr,r*.026,r*.029,r*.026);}
   }
   continue;
  }
  const yy=floating?Math.min(h,.07+(poppy?.03:0))* (.70+rand()*.3):top;
  b.branch(root,[x,yy,z],nuphar?.0027:.0011,stem,'peduncle');const f=flowerFrame(b,[x,yy,z],.04+rand()*.18,an);
  if(nuphar){
   for(let k=0;k<5;k++)f.add('waterPetal','petaloidSepal',kit.shade(rand,s.flowerColor,.018),0,-r*.06,0,r,r,r,1.03,k*TAU/5,0);
   for(let k=0;k<17;k++){const aa=k*TAU/17;f.add('nupharSmallPetal','petal','#dcb735',Math.sin(aa)*r*.35,r*.02,Math.cos(aa)*r*.35,r*.36,r*.36,r*.36,1.78,aa,0);}
   for(let k=0;k<52;k++){const aa=k*2.399,rrr=r*(.21+.28*Math.sqrt((k+.5)/52));f.add('nupharSmallPetal','stamen','#d2a844',Math.sin(aa)*rrr,r*.18,Math.cos(aa)*rrr,r*.19,r*.24,r*.24,.75,aa,0);}
   f.add(kit.bud,'ovary','#bba24a',0,r*.21,0,r*.22,r*.27,r*.22);
   f.add(kit.bud,'stigmaticDisc','#d8b157',0,r*.43,0,r*.27,r*.040,r*.27);
   for(let k=0;k<12;k++){const aa=k*TAU/12;f.branch([0,r*.47,0],[Math.sin(aa)*r*.245,r*.47,Math.cos(aa)*r*.245],r*.008,'#b99749','stigmaRay');}
  }else{
   const petals=poppy?3:5;
   for(let k=0;k<petals;k++){
    const pf=flowerFrame(f,[0,0,0],poppy?0:1.40,k*TAU/petals);
    pf.add(poppy?'waterPoppyPetal':'waterPetal','petal',kit.shade(rand,s.flowerColor,.018),0,0,0,r,r,r);
    if(!poppy)for(let n=1;n<34;n++)for(const sign of [-1,1]){
     const t=n/35,width=.68*Math.pow(Math.sin(Math.PI*t),.35)*(.20+.8*t),zz=.23*t*t+.22*Math.sin(t*Math.PI)+.004*Math.sin(t*35+sign*4),at=[sign*width*r,t*r,zz*r];
     pf.branch(at,[at[0]+sign*r*(.035+rand()*.055),at[1]+r*.025,at[2]],r*.003,'#e9d16a','corollaFringe');
    }
   }
   f.add(kit.bud,'throat',poppy?'#765339':'#c6b647',0,r*.10,0,r*.24,r*.02,r*.24);
   for(let k=0;k<(poppy?24:5);k++){const aa=k*2.399,rrr=r*(poppy?.16:.12);const tip=[Math.sin(aa)*rrr,r*(poppy?.22:.16),Math.cos(aa)*rrr];f.branch([0,0,0],tip,r*.007,poppy?'#71513d':'#c4b554','filament');f.add(kit.bud,'anther',poppy?'#8a7048':'#d7c461',...tip,r*.025,r*.032,r*.016);}
   f.add(kit.bud,'stigma','#c5c28a',0,r*.22,0,r*.058,r*.022,r*.058);
  }
 }
}
