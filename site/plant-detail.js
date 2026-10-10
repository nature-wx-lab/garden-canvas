import {foliageKind,patternKind} from './appearance.js?v=0.9.2';
import * as THREE from './vendor/three.module.js';
const TAU=Math.PI*2;

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
 if(shape==='eremophila'||shape==='mintBush'){
  const wool=shape==='eremophila',f=flowerFrame(b,[x,y,z],Math.PI/2+tilt,yaw),length=wool?2.2:1.0;
  f.add('trumpet','petal',color,0,0,0,r*.74,r*length,r*.74);
  // The two lips have unequal lobes; the lower centre lobe is enlarged.
  for(const side of [-1,1])f.add('petal','petal',color,side*r*.14,r*length,r*.08,r*.72,r*.62,r,.55,side*.34,side*-.2);
  for(let j=-1;j<=1;j++)f.add('petal',wool?patternKind('petal','spots',patternColor):'petal',wool?'#e9e8dc':color,j*r*.20,r*length,-r*.15,r*(j===0?1.15:.70),r*(j===0?.82:.61),r,1.7,Math.PI+j*.55,0);
  for(let j=0;j<(wool?5:2);j++)f.add(wool?'narrow':'petal',wool?'leaf-woolly':'leaf','#b9bfae',0,-r*.10,0,r*(wool?1.1:.55),r*(wool?1.20:.45),r,.2,j*TAU/(wool?5:2),0);
  for(let j=0;j<4;j++){const an=j*TAU/4;f.add(bud,'anther','#d6c3aa',Math.sin(an)*r*.10,r*length*.82,Math.cos(an)*r*.10,r*.032,r*.045,r*.032);}
  return;
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

export function drawDetailedHerb(b,{info,s,p,detail,rand},kit){
 if(s.groundDormant)return;
 const a=info.appearance||{},h=s.height,w=s.spread,green=s.leafColor||info.leafColor||'#587e45',stemColor=a.stemColor||green;
 const leafKind=foliageKind(info),shape=a.leafMargin==='crenate'?'crenate':a.leafShape||'leaf',leafyViolet=a.architecture==='leafyViolet',basal=!leafyViolet&&(a.arrangement==='basal'||['rosette','clump','mound','creeping'].includes(a.habit)),creeping=a.habit==='creeping';
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
 if(a.architecture==='starJasmine'){drawStarJasmine(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='giantCrambe'||a.architecture==='seaKale'){drawCrambes(b,{info,s,detail,rand},kit);return;}
 if(['nigella','yellowNigella','larkspur'].includes(a.architecture)){drawFineAnnuals(b,{info,s,detail,rand},kit);return;}
 if(['blueButterfly','bridalVeil','roseGlory'].includes(a.architecture)){drawGlorybowers(b,{info,s,detail,rand},kit);return;}
 if(['wireShrub','mirrorShrub','myrtleShrub','eremophila','mintBush'].includes(a.architecture)){drawSmallShrubs(b,{info,s,detail,rand},kit);return;}
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

function drawSmallShrubs(b,{info,s,detail,rand},kit){
 const a=info.appearance,h=s.height,w=s.spread,wire=a.architecture==='wireShrub',myrtle=a.architecture==='myrtleShrub',column=a.habit==='columnar',vase=a.habit==='vase',wool=a.architecture==='eremophila',mint=a.architecture==='mintBush';
 const leafLength=Math.min(a.leafLength||(wire?.024:.019),h*.13,w*.10),wood=a.barkColor||(wool?a.stemColor:'#796b5c'),young=a.stemColor||wood,green=s.leafColor;
 const kind=a.leafPattern?patternKind(a.leafTexture==='glossy'?'leaf-glossy':'leaf',a.leafPattern,s.leafPatternColor||a.patternColor):foliageKind(info),sites=[],flowerSites=[],alternate=a.arrangement==='alternate';
 // The complete branch graph is built before leaves and flowers, independently of month.
 const shoots=Math.max(9,Math.round((wire?15:column?23:20)*detail));
 const forks=[];
 for(let root=0;root<4;root++){
  const an=root*2.399,base=[Math.sin(an)*w*.023,.008,Math.cos(an)*w*.023],fork=[Math.sin(an)*w*.10,h*((wool?.10:.23)+root*.025),Math.cos(an)*w*.10];
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
    const nodes=wire?5:column?12:8;
    for(let k=1;k<=nodes;k++){
     const f=k/nodes,az=yaw+(wire?(k%2?1:-1)*.43:.02*Math.sin(k)),node=[at[0]+Math.sin(az)*length*f,at[1]+rise*f,at[2]+Math.cos(az)*length*f];
     b.branch(twig,node,Math.max(.00022,h*.00085*(1-f*.62)),young,'wood');twig=node;
     const leaves=wire?(vase?1:3):alternate?1:2;
     for(let q=0;q<leaves;q++)sites.push({at:node,yaw:az+(wire?(k%2?1:-1)*1.1+(q-1)*.7:alternate?k*2.399:q*Math.PI+k*Math.PI/2),size:leafLength*(.76+rand()*.28),pitch:.88+rand()*.68,roll:(rand()-.5)*.25,young:k===nodes,chance:rand(),shade:rand()});
     if(k%3===0){
      // Short side shoots fill the crown without inflating the actual leaf blades.
      const axis=az+(k%2?1:-1)*1.0,tip=[node[0]+Math.sin(axis)*length*.30,node[1]+h*(wire?.028:.045),node[2]+Math.cos(axis)*length*.30];let part=node;
      for(let v=1;v<=3;v++){
       const t=v/3,at=node.map((x,n)=>x+(tip[n]-x)*t);b.branch(part,at,.00025,young,'wood');part=at;
       for(let q=0;q<(alternate?1:2);q++)sites.push({at,yaw:axis+q*Math.PI+v*(alternate?2.399:1.57),size:leafLength*(.68+rand()*.28),pitch:.75+rand()*.75,roll:(rand()-.5)*.2,young:v===3,chance:rand(),shade:rand()});
      }
     }
     const chance=rand();if((mint?k>nodes-3:k%3===1)&&chance<(wool||mint?.19:.12))flowerSites.push({at:node,yaw:az,chance});
    }
   }
  }
 }
 for(const l of sites){
  if(l.chance>(s.leafDensity??1))continue;
  const at=[l.at[0]+Math.sin(l.yaw)*l.size*.13,l.at[1]+l.size*.03,l.at[2]+Math.cos(l.yaw)*l.size*.13],color=a.springShootColor&&l.young&&s.springFlush?a.springShootColor:green;
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
 const leafKind=patternKind('leaf-glossy',a.leafPattern,s.leafPatternColor||a.patternColor),flowers=[];
 const leafPair=(at,angle,young)=>{
  for(const side of [-1,1]){
   const yaw=angle+side*Math.PI/2,length=size*(young?.76:1)*(.8+rand()*.25),end=[at[0]+Math.sin(yaw)*.002,at[1]+.002,at[2]+Math.cos(yaw)*.002];
   b.branch(at,end,.00045,green,'petiole');
   const color=a.springShootColor&&young&&!s.winter?a.springShootColor:green;
   b.add('leathery',young&&a.springShootColor&&!s.winter?'leaf-glossy':leafKind,kit.shade(rand,color,.04),...end,length*.53,length,length,1.0+rand()*.28,yaw,(rand()-.5)*.1);
  }
 };
 for(let i=0;i<n;i++){
  const an=i*2.399,reach=w*(.13+.31*Math.sqrt((i+.5)/n)),phase=rand()*TAU,root=[Math.sin(an)*reach*.11,.008,Math.cos(an)*reach*.11];let prev=root;
  for(let j=1;j<=12;j++){
   const t=j/12,yaw=an+Math.sin(t*4+phase)*.18,at=[Math.sin(yaw)*reach*t,h*(.09+Math.sin(t*Math.PI)*.15)+.006,Math.cos(yaw)*reach*t];
   b.branch(prev,at,.0018*(1-t*.62),'#877763','wood');prev=at;
   leafPair(at,yaw,j>10);
   if(j<4||j%3!==0)continue;
   const side=j%2?1:-1,sa=yaw+side*.92,end=[at[0]+Math.sin(sa)*size*.85,at[1]+h*(.27+rand()*.24),at[2]+Math.cos(sa)*size*.85];
   let branch=at;
   for(let k=1;k<=4;k++){
    const node=at.map((v,index)=>v+(end[index]-v)*k/4);b.branch(branch,node,.00075,'#8b815e','wood');branch=node;leafPair(node,sa+k*.4,k===4);
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
