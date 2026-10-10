import {treeProfile} from './tree-profiles.js?v=0.9.36';
import {foliageKind} from './appearance.js?v=0.9.36';
import {detailedFlower,drawDetailedHerb,salviniaPoint,alceaLeafPoint} from './plant-detail.js?v=0.9.36';
import {drawTree} from './tree-model.js?v=0.9.36';
import { EXTENDED_FORMS, drawBotanical } from './botanical-models.js?v=0.9.36';
import * as THREE from './vendor/three.module.js';
import { plantInfo, stateAt } from './model.js?v=0.9.36';

// Geometry, colours and movement are illustrative. Plant dimensions come from the plan.
export const sharedGeometry=new Set(),sharedMaterials=new Set();
export const wind={time:{value:0},strength:{value:1}};
export function random(seed){let s=(seed*2654435761)>>>0;return ()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return (s>>>0)/4294967296;};}
const keep=g=>{sharedGeometry.add(g);return g;};
const stem=keep(new THREE.CylinderGeometry(.62,1,1,7,2)),bud=keep(new THREE.SphereGeometry(1,8,6)),cone=keep(new THREE.ConeGeometry(1,1,9));
const TAU=Math.PI*2;
const shapes={};
for(const type of ['roseaPalm','rugosaPalm','alceaBroadPetal','alceaFrilledPetal']){
 const p=[],uv=[],ix=[],leaf=type.endsWith('Palm'),rows=36,cols=leaf?140:30;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1;
  if(leaf){const an=u*Math.PI*.94;p.push(...alceaLeafPoint(type,t,an));uv.push(.5+Math.sin(an)*t*.5,.5+Math.cos(an)*t*.5);}
  else{const fringe=type==='alceaFrilledPetal',sn=Math.max(0,Math.sin(t*Math.PI)),ruffle=Math.sin(u*(fringe?59:24)+t*3)*Math.pow(t,5),width=.57*Math.pow(sn,.38)*(.32+t*.68)*(1+(fringe?.09:.035)*Math.sin(t*56));p.push(u*width,t*(1-.09*Math.exp(-u*u*28)*Math.pow(t,8)),.12*u*u*sn+(fringe?.10:.06)*ruffle+.03*t*t);uv.push(j/cols,t);}
  if(i<rows&&j<cols){const k=i*(cols+1)+j;ix.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
// Flattened equitant fans, arching ribbons and six distinct petaloid segments.
for(const type of ['libertiaSword','anthericumRibbon','tofieldiaSword','ornithogalumRibbon','rhodoxisKeeled','siculumKeeled','aristeaSword','monocotNarrowTepal','monocotBroadTepal','libertiaInnerTepal','siculumTepal']){
 const p=[],uv=[],ix=[],rows=40,cols=18,petal=type.endsWith('Tepal'),bell=type==='siculumTepal',ribbon=type.endsWith('Ribbon'),fold=type.endsWith('Keeled')||type==='aristeaSword',lib=type==='libertiaSword';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,sn=Math.max(0,Math.sin(t*Math.PI)),width=(petal?(type==='monocotNarrowTepal'?.16:bell?.30:.50):.5)*Math.pow(sn,petal?.50:.28)*(petal?.30+t*.70:1),tip=type==='libertiaInnerTepal'?1-.075*Math.exp(-u*u*35)*Math.pow(t,8):1;
  const y=bell?t*1.28:t*tip,z=bell?.08+.56*Math.sin(t*1.3):petal?.06*t*t+.16*u*u*sn:ribbon?.55*t*t*t:lib?.035*t*t:fold?.15*t*t+.026*Math.abs(u)*sn:.12*t*t;
  p.push(u*width,y,z);uv.push(j/cols,t);if(i<rows&&j<cols){const k=i*(cols+1)+j;ix.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
// Seven low herbs: leaf thickness, teeth, bifid petals and continuous corolla tubes.
for(const type of ['onosmaBristly','buglossoidesLance','mertensiaFleshy','nierembergiaSpoon','stellariaPointed','dryasCrenate','strawberryLeaflet','stellariaPetal','lowHerbPetal','onosmaTube','mertensiaBell','gromwellSalver','nierembergiaCup']){
 const p=[],uv=[],ix=[],rows=40,corolla=['onosmaTube','mertensiaBell','gromwellSalver','nierembergiaCup'].includes(type),cols=corolla?100:24;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,sn=Math.max(0,Math.sin(Math.PI*t));
  if(corolla){
   const an=j/cols*TAU,onos=type==='onosmaTube',mert=type==='mertensiaBell',cup=type==='nierembergiaCup',fl=Math.max(0,(t-.55)/.45),lobe=.5+.5*Math.cos(an*5);
   const rr=onos?.15+.50*Math.sin(t*Math.PI*.72):mert?.15+.34*t+.34*fl:cup?.06+.10*t+.84*Math.pow(fl,.58):.12+.85*Math.pow(fl,.66);
   const radius=rr*(1-(onos?.025:mert?.13:cup?.10:.18)*(1-lobe)*fl),yy=t*(onos?2.8:mert?2.15:cup?1.5:1.55)-(cup?.55:!onos&&!mert?.6:.10)*fl;
   p.push(Math.sin(an)*radius,yy+(cup?.018*Math.sin(an*20)*fl:0),Math.cos(an)*radius);uv.push(j/cols,t);
  }else{
   const ono=type==='onosmaBristly',bug=type==='buglossoidesLance',mert=type==='mertensiaFleshy',spoon=type==='nierembergiaSpoon',star=type==='stellariaPointed',dry=type==='dryasCrenate',straw=type==='strawberryLeaflet',petal=type==='lowHerbPetal',split=type==='stellariaPetal';
   const width=(ono?.105:bug?.18:mert?.34:spoon?.22:star?.22:dry?.38:straw?.36:split?.25:.55)*Math.pow(sn,star?.9:dry?.44:straw?.55:.65)*(spoon?.13+t*.87:petal?.35+t*.65:1),teeth=dry?1-.12*Math.pow((1+Math.cos(t*TAU*7))/2,2):straw?1-.14*(1-((t*13)%1)):1;
   p.push(u*width*teeth,split?t*(1-.56*Math.exp(-u*u*45)*Math.pow(t,6)):t,(petal||split?.11:-.085)*t*t+(mert?.067:dry?.08:petal?.19:.026)*u*u*sn+(dry||straw?.022*Math.sin(t*42-Math.abs(u)*8)*Math.abs(u)*sn:0));uv.push(j/cols,t);
  }
  if(i<rows&&j<cols){const k=i*(cols+1)+j;ix.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['silverCarawayLeaf','seseliSegment','oenantheLeaflet','pimpinellaLeaflet','chervilLeaflet','heracleumLeaflet','apiaceaePetal']){
 const p=[],uv=[],ix=[],rows=40,cols=18,petal=type==='apiaceaePetal',fine=type==='seseliSegment',large=type==='heracleumLeaflet',cut=large||type==='chervilLeaflet';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,sn=Math.max(0,Math.sin(t*Math.PI)),width=(petal?.56:fine?.085:large?.40:.26)*Math.pow(sn,petal?.42:fine?.55:.65),lobes=cut?.42+.58*Math.pow((1+Math.cos(t*Math.PI*(large?6:8)))/2,.55):1,teeth=petal||fine?1:1-.10*Math.pow((1+Math.cos(t*Math.PI*30))/2,2);
  p.push(u*width*lobes*teeth,petal?t*(1-.18*Math.exp(-u*u*34)*Math.pow(t,8)):t,petal?.16*t*t+.12*u*u*sn:-.08*t*t+.035*u*u*sn+.010*Math.sin(t*31-Math.abs(u)*8)*sn);
  uv.push(j/cols,t);if(i<rows&&j<cols){const k=i*(cols+1)+j;ix.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
// Distinct laminae and continuous bell corollas for six Campanulaceae forms.
for(const type of ['edraianthusLinear','phyteumaBasal','michauxiaRough','jasioneOblong','tracheliumSerrate','wahlenbergiaLeaf','michauxiaLobe','jasioneLobe','phyteumaLobe','edraianthusBell','wahlenbergiaBell']){
 const p=[],uv=[],ix=[],rows=32,cols=type.endsWith('Bell')?100:18;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,sn=Math.max(0,Math.sin(Math.PI*t));
  if(type.endsWith('Bell')){
   const an=j/cols*TAU,open=type==='wahlenbergiaBell',lobe=.60+.40*Math.pow((1+Math.cos(an*5))/2,.55),rr=(.18+t*(open?.69:.45))*(t<.6?1:1-(1-lobe)*(t-.6)/.4),yy=t*(open?1.10:1.75)-(open?.12:.04)*Math.pow(t,5);
   p.push(Math.sin(an)*rr,yy,Math.cos(an)*rr);
  }else if(type==='michauxiaLobe'){
   p.push(u*.19*Math.pow(sn,.52),.32*Math.sin(t*Math.PI*1.25)-.43*t*t,.08+Math.sin(t*Math.PI*.72)*.96);
  }else if(type==='jasioneLobe'){
   p.push(u*.18*Math.pow(sn,.52),t,.10*t*t);
  }else if(type==='phyteumaLobe'){
   p.push(u*.035*Math.pow(sn,.45),t,.22*Math.sin(t*Math.PI));
  }else{
   const linear=type==='edraianthusLinear',phy=type==='phyteumaBasal',rough=type==='michauxiaRough',jas=type==='jasioneOblong',tra=type==='tracheliumSerrate',width=(linear?.033:phy?.28:rough?.20:jas?.14:tra?.30:.17)*Math.pow(sn,linear?.45:phy?.6:.7)*(phy?1.22-t*.50:jas||type==='wahlenbergiaLeaf'?.20+t*.8:1),serr=phy||rough||tra?1-.075*Math.pow((1+Math.cos(t*Math.PI*(tra?34:22)))/2,2):1;
   p.push(u*width*serr,t,-.13*t*t-.032*u*u*sn+.015*Math.sin(t*31-Math.abs(u)*7)*Math.abs(u)*sn);
  }
  uv.push(j/cols,t);if(i<rows&&j<cols){const k=i*(cols+1)+j;ix.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
// Peltate Hydrocotyle leaves attach at the centre, not at a basal notch.
for(const type of ['waterCoinShield','marsileaWedge','bacopaOvate','bacopaRound','bacopaSpoon','bacopaCorolla']){
 const p=[],uv=[],ix=[],rows=28,cols=type==='waterCoinShield'||type==='bacopaCorolla'?120:24,coin=type==='waterCoinShield',fern=type==='marsileaWedge',corolla=type==='bacopaCorolla';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,an=j/cols*Math.PI*2;
  if(coin){
   const rr=t*.5*(.964+.036*Math.cos(an*11));p.push(Math.sin(an)*rr,Math.cos(an)*rr,-.038*t*t+.007*Math.cos(an*11)*t);uv.push(.5+Math.sin(an)*t*.5,.5+Math.cos(an)*t*.5);
  }else if(fern){
   const angle=u*.65,rr=t*(.81+.19*Math.cos(u*Math.PI/2));p.push(Math.sin(angle)*rr,Math.cos(angle)*rr,-.025*t*t+.045*u*u*t);uv.push(j/cols,t);
  }else if(corolla){
   const fl=Math.max(0,(t-.58)/.42),lobe=.77+.23*Math.cos(an*5),rr=.15+t*.11+Math.pow(fl,.72)*.72*lobe*(1+.09*Math.cos(an));
   p.push(Math.sin(an)*rr,t<.58?t*1.10:.638+.15*Math.pow(fl,.5)+.055*fl*Math.cos(an*5),Math.cos(an)*rr);uv.push(j/cols,t);
  }else{
   const spoon=type==='bacopaSpoon',round=type==='bacopaRound',sn=Math.max(0,Math.sin(t*Math.PI)),width=(spoon?.19:round?.47:.38)*Math.pow(sn,.47)*(spoon?.15+.85*t:1);
   p.push(u*width,t,-.045*u*u*sn-.06*t*t+.008*Math.pow(Math.cos(t*26-Math.abs(u)*8),2)*sn);uv.push(j/cols,t);
  }
  if(i<rows&&j<cols){const k=i*(cols+1)+j;ix.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['salviniaFlat','salviniaFolded','salviniaHood','hyacinthOrbicular','frogbitOrbicular','hyacinthTepal']){
 const p=[],uv=[],ix=[],rows=32,cols=20,fern=type.startsWith('salvinia'),petal=type==='hyacinthTepal';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,sn=Math.max(0,Math.sin(t*Math.PI));
  if(fern)p.push(...salviniaPoint(type,t,u));
  else{
   const width=(petal?.47:type==='hyacinthOrbicular'?.55:.48)*Math.pow(sn,petal?.44:.48)*(petal?.20+.80*t:1);
   p.push(u*width,t,petal?.08*t*t+.08*u*u*sn:-.10*u*u*sn-.035*t*t);
  }
  uv.push(j/cols,t);if(i<rows&&j<cols){const k=i*(cols+1)+j;ix.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
// Aquatic blades have an open basal sinus; their petiole attaches at the notch.
for(const type of ['nupharSagittate','floatingCordate','waterPoppyCordate']){
 const p=[0,.43,0],uv=[.5,.5],ix=[],n=96,rows=12,nuphar=type==='nupharSagittate',poppy=type==='waterPoppyCordate';
 for(let row=1;row<=rows;row++)for(let j=0;j<=n;j++){
  const t=j/n*Math.PI*2,r=row/rows,cs=Math.cos(t),sn=Math.sin(t),base=Math.max(0,-cs);
  const ex=sn*(nuphar?.29:poppy?.46:.50)*(1+(nuphar?.03:.13)*base),ey=.43+.57*cs+.14*Math.exp(-(((t-Math.PI)/.16)**2));
  const wave=nuphar?1:1+.012*Math.sin(t*(poppy?14:24));
  const x=ex*r*wave,y=.43+(ey-.43)*r,z=.020*r*r+.012*Math.sin(t*4)*r*r;
  p.push(x,y,z);uv.push(.5+x,y);
  if(row===1&&j<n)ix.push(0,1+j,2+j);
  else if(row>1&&j<n){const k=1+(row-2)*(n+1)+j;ix.push(k,k+n+1,k+1,k+1,k+n+1,k+n+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['sagittariaLong','waterPetal','waterPoppyPetal','nupharSmallPetal']){
 const p=[],uv=[],ix=[],rows=28,cols=12,leaf=type==='sagittariaLong',small=type==='nupharSmallPetal';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,width=(leaf?.105:small?.13:type==='waterPoppyPetal'?1.12:.68)*Math.pow(Math.sin(Math.PI*t),leaf?.73:small?.18:.35)*(leaf?1:.20+.8*t);
  if(type==='waterPoppyPetal'){const angle=u*Math.PI/3*1.07,rr=t*(.85+.15*Math.cos(u*Math.PI/2));p.push(Math.sin(angle)*rr,.42*t*t+.035*u*u*t,Math.cos(angle)*rr);}else p.push(u*width,t,(leaf?.10:.23)*t*t+(leaf?.025:.22)*u*u*Math.sin(t*Math.PI)+.004*Math.sin(t*35+u*4)*Math.abs(u));uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;ix.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
shapes.horsetailCulm=keep(new THREE.CylinderGeometry(1,1,1,18,1));
for(const type of ['umbrellaBract','twigRushBlade','reducedSheath','horsetailSheath']){
 const p=[],uv=[],ix=[],rows=28,cols=8,bract=type==='umbrellaBract',rush=type==='twigRushBlade';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,wide=(bract?.027:rush?.004:.20)*Math.pow(1-t,bract?.68:rush?.35:1),fold=rush?.004*(1-t):.018;
  p.push(u*wide,t,(bract?.24:rush?.07:.035)*t*t+fold*Math.abs(u)*(1-t));uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;ix.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
shapes.triangularCulm=keep(new THREE.CylinderGeometry(1,1,1,3,1));
// Narrow leaves retain their own cross-section and apex instead of sharing a broad blade.
for(const type of ['fescueNeedle','milletBlade','sedgeRibbon','ficiniaBlade','lomandraBlade','acorusBlade','goldBambooLeaf','whitetopBract','grassGlume']){
 const p=[],uv=[],ix=[],rows=32,cols=6,needle=type==='fescueNeedle',square=type==='ficiniaBlade',bamboo=type==='goldBambooLeaf',glume=type==='grassGlume',bract=type==='whitetopBract';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,wide=(square?.035:bamboo?.12:glume?.23:bract?.09:type==='milletBlade'?.032:type==='sedgeRibbon'?.012:.009);
  const taper=square?1:bamboo||glume?Math.pow(Math.sin(Math.PI*t),.65):Math.pow(1-t,needle?.42:.55),bend=square?.12:bamboo?.08:glume?.04:bract?.22:needle?.44:.58;
  const yy=t-(type==='lomandraBlade'&&i===rows?.02*(.5+.5*Math.cos(j*Math.PI)):0);
  p.push(u*wide*taper,yy,bend*t*t+Math.abs(u)*(needle?.009:.006)*taper+.012*Math.sin(t*6)*Math.abs(u));uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;ix.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
// Spurge bracts are paired leaves around the cyathium, not petals.
for(const type of ['spurgeLinearLeaf','spurgeBroadLeaf','snowSpurgeLeaf','spurgeBract','snowSpurgeBract','gauraLeaf','gauraPetal']){
 const pos=[],uv=[],idx=[],gaura=type==='gauraPetal',bract=type==='spurgeBract',small=type==='snowSpurgeBract',rows=small?8:bract?12:24,cols=small?6:10;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,sn=Math.max(0,Math.sin(Math.PI*t));
  let width=(bract?.68:gaura?.50:small?.38:type==='snowSpurgeLeaf'?.34:type==='spurgeBroadLeaf'?.21:type==='gauraLeaf'?.12:.135)*Math.pow(sn,bract?.34:gaura?.52:.60);
  if(gaura||small)width*=.20+.85*t;
  if(type==='gauraLeaf')width*=.97+.03*Math.cos(t*46);
  const rib=.005*Math.pow(Math.sin((t-Math.abs(u)*.26)*34),2)*Math.sin(Math.abs(u)*Math.PI);
  pos.push(u*width,t,(bract?.23:gaura?.04:.10)*t*t+(bract?.27:gaura?.11:.055)*u*u*sn+rib);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
// Woodland leaves: petiole attachment, apical clefts and teeth are geometry.
for(const type of ['diphylleiaShield','jeffersoniaKidney','ranzaniaLeaflet','kirengeshomaPalm','eomeconKidney']){
 const pos=[],uv=[],idx=[],rows=24,cols=160,shield=type==='diphylleiaShield',kidney=type==='jeffersoniaKidney'||type==='eomeconKidney',kir=type==='kirengeshomaPalm';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,an=(j/cols-.5)*Math.PI*(shield?1.98:1.82),tooth=type==='eomeconKidney'?.96+.04*Math.cos(an*18):kidney?1:.975+.025*Math.cos(an*65),lobes=shield?(.70+.30*Math.pow(.5+.5*Math.cos(an*6),.8)):kir?(.55+.45*Math.pow(.5+.5*Math.cos(an*5),.7)):type==='ranzaniaLeaflet'?.87+.13*Math.cos(an*3):1;
  const notch=type==='jeffersoniaKidney'?1-.24*Math.exp(-an*an/ .040):1,rr=t*tooth*lobes*notch,wide=kidney?.61:.53;
  pos.push(Math.sin(an)*rr*wide,(Math.cos(an)*rr+(shield?0:.82))*.55,.08*rr*rr+.014*Math.cos(an*(shield?6:kir?5:8))*rr);uv.push(.5+Math.sin(an)*t*.5,.5+Math.cos(an)*t*.5);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['deinantheBifid','hylomeconSegment','araliaLeaflet','saururusHeart','parnassiaHeart','cornusHerbLeaf','woodlandPetal','kirengeshomaPetal']){
 const pos=[],uv=[],idx=[],rows=56,cols=24,heart=type==='saururusHeart'||type==='parnassiaHeart',dein=type==='deinantheBifid',petal=type.endsWith('Petal'),bell=type==='kirengeshomaPetal',corn=type==='cornusHerbLeaf';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,sn=Math.max(0,Math.sin(Math.PI*t));let width=(petal?.56:heart?.44:dein?.38:corn?.30:type==='araliaLeaflet'?.38:.29)*Math.pow(sn,petal?.38:.65);
  if(heart)width=.46*Math.pow(Math.sin((.13+.87*t)*Math.PI),.80);
  if(!heart&&!petal&&!corn)width*=.92+.08*Math.cos(t*(dein?82:72));
  if(type==='hylomeconSegment')width*=.86+.14*Math.cos(t*23);
  const yy=t-(dein?.18*Math.pow(t,7)*Math.exp(-u*u*14):0)-(heart?.12*(1-t)*Math.sin(Math.abs(u)*Math.PI/2):0),rib=dein?.010*Math.sin((t-Math.abs(u)*.24)*50)*Math.sin(Math.abs(u)*Math.PI):0;
  pos.push(u*width,yy,(petal?.12:.065)*t*t+(bell?.20:petal?.16:.07)*u*u*sn+rib);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
// Curved meshes retain the basal notch, venation relief and divided leaf margins.
for(const type of ['primroseLeaf','gerberaLeaf','brunneraHeart','tapienLeaf','stolonPhloxLeaf','primrosePetal','gerberaRay','smallSalverPetal']){
 const pos=[],uv=[],idx=[],rows=64,cols=20,prim=type==='primroseLeaf',gerb=type==='gerberaLeaf',heart=type==='brunneraHeart',tap=type==='tapienLeaf',petal=type.endsWith('Petal'),ray=type==='gerberaRay';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,sn=Math.max(0,Math.sin(Math.PI*t));
  let width=(heart?.49:prim?.42:gerb?.30:tap?.27:ray?.12:petal?.59:.24)*Math.pow(sn,petal?.31:ray?.39:.65);
  if(heart)width=.47*Math.pow(Math.sin((.16+.84*t)*Math.PI),.68);
  if(prim)width*=(.49+.51*t)*(.965+.035*Math.cos(t*108));
  if(gerb)width*=(.32+.85*t)*(.62+.38*Math.pow(.5+.5*Math.cos(t*36+.6),.65));
  if(tap)width*=.07+.93*Math.pow(.5+.5*Math.cos(t*37),3);
  const ribbed=(prim||heart? .012*Math.pow(Math.sin((t-Math.abs(u)*.28)*41),2)*Math.sin(Math.abs(u)*Math.PI):gerb?.010*Math.cos(t*36)*u*u:0);
  const edge=type==='primrosePetal'?.025*Math.sin(t*29+u*22)*Math.pow(Math.abs(u),3)*sn:0;
  pos.push(u*width,t-(heart?.105*(1-t)*Math.sin(Math.abs(u)*Math.PI/2):0),.10*t*t+(petal?.18:ray?.04:.07)*u*u*sn+ribbed+edge);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}

for(const type of ['multicauleSpoon','shastaLeaf','scabiosaBasal','scabiosaLobed','oenotheraLeaf','gardenRay','broadRuffledPetal']){
 const pos=[],uv=[],idx=[],rows=48,cols=18,petal=type==='broadRuffledPetal',ray=type==='gardenRay',split=type==='scabiosaLobed';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,sn=Math.max(0,Math.sin(Math.PI*t));
  let width=(petal?.74:ray?.15:split?.30:type==='shastaLeaf'?.19:.26)*Math.pow(sn,petal?.37:ray?.40:.68);
  if(!petal&&!ray)width*=.32+.80*t;
  if(split)width*=.14+.86*Math.pow(.5+.5*Math.cos((t-.05)*Math.PI*9),.48);
  else if(!petal&&!ray)width*=.89+.11*Math.cos(t*Math.PI*(type==='multicauleSpoon'?9:15));
  const edge=petal?.050*Math.sin(t*31+u*18)*Math.pow(Math.abs(u),3)*sn:0;
  pos.push(u*width,t,(petal?.24:.12)*t*t+(petal?.20:.06)*u*u*sn+edge);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['delphiniumPalm','hollyhockPalm']){
 const pos=[],uv=[],idx=[],rows=20,cols=140,holly=type==='hollyhockPalm';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,an=(j/cols-.5)*Math.PI*1.82,edge=holly?(.86+.14*Math.cos(an*5.5))*(.98+.02*Math.cos(an*58)):(.39+.61*Math.pow(.5+.5*Math.cos(an*6),.66))*(.87+.13*Math.cos(an*26)),r=t*edge;
  pos.push(Math.sin(an)*r*.51,(Math.cos(an)*r+.65)*.57,.10*r*r+.025*Math.cos(an*6)*r);uv.push(.5+Math.sin(an)*t*.5,.5+Math.cos(an)*t*.5);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
{
 const pos=[],uv=[],idx=[],rows=18,cols=12;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,an=j/cols*Math.PI*2,rr=.075*Math.pow(Math.sin(Math.PI*t),.36);
  pos.push(Math.sin(an)*rr,t,Math.cos(an)*rr+.08*t*t);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData.portulacaNeedle=true;shapes.portulacaNeedle=keep(g);
}
for(const type of ['foxFaceLeaf','pepperLeaf','kaleRound','cloverLeaflet','iceSpoon','pinkSageLeaf','coreopsisLinear','coreopsisRay']){
 const kale=type==='kaleRound',pos=[],uv=[],idx=[],rows=kale?96:40,cols=kale?32:18,fox=type==='foxFaceLeaf',clover=type==='cloverLeaflet',ice=type==='iceSpoon',sage=type==='pinkSageLeaf',ray=type==='coreopsisRay';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,sin=Math.max(0,Math.sin(Math.PI*t));
  let width=(kale?.63:fox?.52:clover?.50:ice?.25:sage?.39:ray?.41:type==='coreopsisLinear'?.037:.22)*Math.pow(sin,kale||clover?.49:ray?.30:.73);
  if(kale)width*=(.30+.90*t)*(1+.08*Math.sin(t*35));
  if(fox)width*=.64+.36*Math.pow(.5+.5*Math.cos((t-.1)*Math.PI*7),.6);
  if(sage||clover)width*=.95+.05*Math.cos(t*Math.PI*(sage?17:28));
  if(ice)width*=.35+.90*t;
  const wave=kale?.056*Math.sin(t*35+u*5)*Math.pow(Math.abs(u),3)*sin:fox?.018*Math.sin(t*27)*u*u:0;
  const tip=ray?-.14*Math.pow(t,9)*(.5+.5*Math.cos(u*Math.PI*3)):0;
  pos.push(u*width,t+tip,(kale?.23:ice?.08:.13)*t*t+(ice?.12:.08)*u*u*sin+wave);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['solanumStar','pepperFruit','foxFaceFruit']){
 const pos=[],uv=[],idx=[],rows=26,cols=60,star=type==='solanumStar',fox=type==='foxFaceFruit';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,an=j/cols*Math.PI*2,rad=star?t*(.69+.31*Math.cos(an*5)):(fox?.48:.17)*Math.pow(Math.sin(Math.PI*t),fox?.58:.60)*(1.23-.65*t),y=star?.09*t+.08*t*t*Math.cos(an*5):t;
  pos.push(Math.sin(an)*rad,y,Math.cos(an)*rad);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['nasturtiumShield','morningGloryRound','morningGloryStar']){
 const pos=[],uv=[],idx=[],rows=28,cols=100,leaf=type==='nasturtiumShield',star=type==='morningGloryStar';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,an=j/cols*Math.PI*2,edge=leaf?1+.025*Math.cos(an*9):star?.81+.19*Math.cos(an*5):.98+.025*Math.cos(an*5),r=leaf?t*edge:(.06+.94*Math.pow(t,2.25))*edge;
  const y=leaf?.11*t*t+.024*Math.sin(an*9)*t*t:1.0*t-.10*Math.pow(t,5)+.035*Math.cos(an*5)*t*t;
  pos.push(Math.sin(an)*r,y,Math.cos(an)*r);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['nasturtiumPetal','corncocklePetal','corncockleLeaf','snapdragonLeaf']){
 const pos=[],uv=[],idx=[],rows=32,cols=14,leaf=type.endsWith('Leaf'),corn=type==='corncocklePetal';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,sin=Math.max(0,Math.sin(Math.PI*t)),width=(leaf?type==='corncockleLeaf'?.066:.15:corn?.65:.64)*Math.pow(sin,leaf?.78:.43)*(leaf?1:.36+.72*t);
  pos.push(u*width,t,.15*t*t+.032*u*u*sin+(leaf?0:.023*Math.sin(u*14+t*27)*Math.pow(Math.abs(u),3)*sin));uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['calendulaLeaf','nemophilaLeaf','alyssumLeaf','auriniaLeaf','poppySegment','calendulaRay','poppyCup','poppyFrill']){
 const pos=[],uv=[],idx=[],rows=40,cols=16,ray=type==='calendulaRay',cup=type==='poppyCup'||type==='poppyFrill',nem=type==='nemophilaLeaf',spoon=type==='calendulaLeaf'||type==='auriniaLeaf';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,sin=Math.max(0,Math.sin(Math.PI*t)),frill=type==='poppyFrill';
  let width=(cup?.86:ray?.18:type==='poppySegment'?.17:type==='alyssumLeaf'?.17:nem?.31:.23)*Math.pow(sin,cup?.40:ray?.37:spoon?.60:.77);
  if(nem)width*=.28+.72*Math.pow(.5+.5*Math.cos((t-.08)*Math.PI*10),.62);
  if(spoon)width*=.36+.80*t;
  const ripple=cup?(.010+(frill?.075:0))*Math.sin(u*18+t*27)*Math.pow(Math.abs(u),3)*sin:ray?.015*Math.cos(u*9)*sin:.018*Math.cos(t*22)*u*u*sin;
  const yy=cup?.88*t-.14*t*t:ray?.14*t*t:t,zz=cup?.04+.91*t:ray?t:.17*t*t;
  pos.push(u*width,yy+ripple,zz+(cup?-.13:.042)*u*u*sin);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
{
 // A single fused corolla, with five rounded lobes around its continuous cup.
 const pos=[],uv=[],idx=[],rows=22,cols=100;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,an=j/cols*Math.PI*2,r=t*(.90+.10*Math.cos(an*5)*Math.pow(t,6));
  pos.push(Math.sin(an)*r,.34*t*t+.018*Math.cos(an*5)*t,Math.cos(an)*r);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData.nemophilaCup=true;shapes.nemophilaCup=keep(g);
}
for(const type of ['feltOval','feltRound','wireRound','groundIvyLeaf','dichondraLeaf','pericallisLeaf','newLookLeaf','curlyLeucothoe','persianLeaf']){
 const pos=[],uv=[],idx=[],rows=32,cols=12,ivy=type==='groundIvyLeaf',kidney=type==='dichondraLeaf',pericallis=type==='pericallisLeaf',dust=type==='newLookLeaf',curly=type==='curlyLeucothoe',persian=type==='persianLeaf',round=type==='feltRound'||type==='wireRound';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,sin=Math.max(0,Math.sin(Math.PI*t));
  let width=(ivy?.69:pericallis?.59:kidney?.65:dust?.62:curly?.40:persian?.26:round?.52:.44)*Math.pow(sin,ivy||kidney||pericallis?.42:round?.49:dust?.62:.84);
  if(ivy)width*=.92+.08*Math.cos(t*Math.PI*12);
  if(pericallis)width*=.92+.08*Math.cos(t*Math.PI*15);
  if(dust)width*=.82+.18*Math.cos((t-.12)*Math.PI*9);
  if(persian)width*=i%2?.985:1.015;
  const relief=persian?.024*Math.cos(t*38-Math.abs(u)*8)*Math.abs(u)*sin:curly?.08*Math.sin(t*23)*u*u*sin:.013*Math.cos(t*24)*u*u*sin;
  const y=curly?.72*Math.sin(t*2.2):t-(ivy||kidney||pericallis?.23*Math.exp(-Math.pow((t-.14)/.14,2))*u*u:0),z=curly?.60*(1-Math.cos(t*2.2)):.16*t*t;
  pos.push(u*width,y,z+.075*u*u*sin+relief);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['grassRibbon','hakoneBlade']){
 const pos=[],uv=[],idx=[],rows=36,cols=4,ribbon=type==='grassRibbon';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,width=ribbon?.5*Math.pow(1-t,.55):.13*Math.pow(Math.sin(Math.PI*t),.70);
  pos.push(u*width,ribbon?.84*Math.sin(t*2.65):t,ribbon?.52*(1-Math.cos(t*2.65))+.009*Math.abs(u):.25*t*t+.03*Math.abs(u)*Math.sin(Math.PI*t));uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['helleboreSepal','helleboreBell','helleboreSword','helleboreFrill','clematisSepal','helleboreLeaf','helleboreFineLeaf','vesicariusLeaf']){
 const pos=[],uv=[],idx=[],rows=40,cols=18,leaf=type.endsWith('Leaf'),fine=type==='helleboreFineLeaf',bell=type==='helleboreBell',clematis=type==='clematisSepal',sword=type==='helleboreSword',frill=type==='helleboreFrill',vesicarius=type==='vesicariusLeaf';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,sin=Math.max(0,Math.sin(Math.PI*t)),width=(leaf?fine?.11:vesicarius?.62:.39:clematis?.40:sword?.35:.69)*Math.pow(sin,leaf?.82:clematis||sword?.85:.44)*(leaf&&t>.26?(i%2?.93:1.05):1)*(vesicarius?.70+.30*Math.cos(t*5*Math.PI):1);
  const height=leaf?t:bell?1.1*t:.09*t+.32*t*t,radial=leaf?.12*t+.30*t*t*t:bell?.63*Math.sin(t*1.95):t;
  const wave=frill?.07*Math.sin(u*14+t*24)*Math.pow(Math.abs(u),3)*sin:sword?.17*u*t*t+.025*Math.sin(t*23)*u:0;
  pos.push(u*width,height+(leaf?.040:.033)*u*u*sin+wave,radial+(leaf?.12:-.1)*u*u*sin);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['tulipCup','tulipPointed','crocusCup','saraLeaf','speciesTulipLeaf','crocusLinear']){
 const pos=[],uv=[],idx=[],rows=40,cols=18,leaf=type.endsWith('Leaf')||type==='crocusLinear',sara=type==='saraLeaf',crocus=type==='crocusCup',linear=type==='crocusLinear',pointed=type==='tulipPointed';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,sin=Math.max(0,Math.sin(Math.PI*t)),width=leaf?.50*Math.pow(sin,linear?.18:sara?.64:.83):.52*Math.pow(sin,pointed?.72:.43);
  const radius=leaf?(sara?.52:.21)*t*t:.025+(crocus?.67:pointed?.58:.69)*Math.sin(t*(crocus?1.8:1.43));
  const height=leaf?t:(crocus?1.22:pointed?1.72:1.40)*t;
  const wave=sara?.052*Math.sin(t*33)*Math.pow(Math.abs(u),3)*sin:0;
  pos.push(u*width,height+wave,radius+(leaf?.045:-.20)*u*u*sin);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['liliumLeaf','liliumTepal','liliumTrumpet','liliumFunnel','liliumReflex','liliumHalfReflex']){
 const pos=[],uv=[],idx=[],rows=44,cols=18,leaf=type==='liliumLeaf',trumpet=type==='liliumTrumpet',funnel=type==='liliumFunnel',reflex=type==='liliumReflex'||type==='liliumHalfReflex',half=type==='liliumHalfReflex';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,sin=Math.max(0,Math.sin(Math.PI*t)),width=leaf?.5*Math.pow(sin,.85):reflex?.27*Math.pow(sin,.64):(.019+.52*Math.pow(sin,.70))*(trumpet?(.35+.65*t):1);
  const radial=leaf?.13*t*t:reflex?.83*Math.sin(t*(half?1.9:2.8)):.025+(trumpet?.96*Math.pow(t,2.8):funnel?.95*Math.pow(t,1.8):1.03*Math.pow(t,1.38));
  const height=leaf?t:reflex?.64*Math.sin(t*(half?2.3:3.90)):trumpet?1.85*t-.43*Math.pow(t,4):funnel?1.24*t-.43*t*t*t:1.20*t-.85*Math.pow(t,3);
  const ripple=leaf?0:.018*Math.sin(t*36)*Math.pow(Math.abs(u),3)*sin;
  pos.push(u*width,height+.065*u*u*sin+ripple,radial+(leaf?.025:.055)*u*u*sin);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['muscariUrn','freesiaTube']){
 const pos=[],uv=[],idx=[],rows=24,cols=60,urn=type==='muscariUrn';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,an=j/cols*Math.PI*2,rad=urn?.14+.72*Math.pow(Math.max(0,Math.sin(t*Math.PI*.91)),.64):.085+.28*Math.pow(t,1.5),rim=Math.pow(t,13),lobe=.5+.5*Math.cos(an*6);
  const rr=rad+(urn?.055:0)*lobe*rim,y=t*(urn?1.65:1.12)+(urn?.065:0)*lobe*rim;
  pos.push(Math.sin(an)*rr,y,Math.cos(an)*rr);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+1,k+cols+1,k+1,k+cols+2,k+cols+1);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['hyacinthStrap','muscariLeaf','hyacinthReflex','freesiaLobe']){
 const pos=[],uv=[],idx=[],rows=32,cols=12,leaf=type==='hyacinthStrap'||type==='muscariLeaf',hy=type==='hyacinthStrap',freesia=type==='freesiaLobe';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,sin=Math.max(0,Math.sin(Math.PI*t)),width=leaf?(hy?.057:.024)*Math.pow(Math.max(0,Math.sin(Math.PI*(t*.92+.08))),.25):Math.pow(sin,freesia?.56:.70)*(freesia?.55:.28);
  const y=leaf?t:freesia?t:.80*Math.sin(t*2.4),z=leaf?(hy?.21:.60)*t*t+.045*u*u*sin:freesia?.18*u*u*sin+.12*t*t:.72*t;
  pos.push(u*width,y,z);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
{
 // A four-petalled silhouette for the thousands of subpixel flowers in a crambe spray.
 // Representative full flowers retain their sepals, filaments and anthers nearby.
 const positions=[],uv=[];
 for(let j=0;j<4;j++){
  const an=j*Math.PI/2,c=Math.cos(an),s=Math.sin(an),ring=[[0,.07],[-.40,.58],[-.30,.95],[.30,.95],[.40,.58]];
  for(let k=1;k<ring.length-1;k++)for(const [x,y] of [ring[0],ring[k],ring[k+1]]){positions.push(x*c+y*s,.12*y*y,-x*s+y*c);uv.push(x+.5,y);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();shapes.tinyCross=keep(g);
}
function curvedLeaf(type){
  const chloranthus=type==='chloranthusLeaf',elm=type==='elm',corrugated=type==='hostaCorrugated'||elm||chloranthus,ruffled=type==='hostaRuffled',wavy=type==='wavyStrap',slender=type==='wavyLance',undulate=type==='wavyElliptic'||slender;if(corrugated&&!elm&&!chloranthus||ruffled)type='hosta';if(wavy)type='strap';
  const cabbage=type==='seaKaleLeaf'||type==='crambeHeart',birch=type==='birchLeaf',laurel=type==='laurelLeaf';
  const positions=[],uvs=[],indices=[],rows=chloranthus||birch?32:type==='needle'?2:type==='crenate'?40:ruffled||cabbage||laurel?28:type==='serrated'?20:14,cols=type==='needle'?1:corrugated?16:ruffled||cabbage||birch||laurel?8:4;
  for(let i=0;i<=rows;i++){
    const t=i/rows;
    let width=Math.pow(Math.sin(Math.PI*t),.85)*.43;
    if(type==='narrow')width*=.2;
    if(slender)width*=.30;
    if(type==='petal')width=Math.pow(Math.sin(Math.PI*t),.58)*.4;
    if(type==='hosta')width=Math.pow(Math.sin(Math.PI*t),.64)*.53;
    if(type==='blade'||type==='needle')width=(1-t)*.055;
    if(type==='sword')width=.046*Math.pow(1-t,.4);
    if(type==='strap')width=.082*Math.pow(Math.sin(Math.PI*t*.88+.16),.22);
    if(chloranthus)width*=1.05*(i%2?.91:1.05);
    if(type==='serrated')width*=i%2?.93:1.02;
    if(type==='lanceSerrate')width*=.24*(i%2?.94:1.03);
    if(type==='ovateSerrate')width*=.55*(i%2?.92:1.02);
    if(type==='broadToothed')width*=1.10*(1-t*.30)*(i%2?.91:1.05);
    if(cabbage)width=Math.pow(Math.sin(Math.PI*t),type==='crambeHeart'?.50:.67)*.52*(1+.16*Math.sin(t*27))*(i%2?.97:1.02);
    if(elm)width*=.75*(i%2?.91:1.02);
    if(type==='calycanthus')width*=i%5===2?1.025:1;
    if(type==='obovateSerrate')width*=Math.pow(t,.35)*1.2*(i%2?.94:1.02);
    if(type==='oakLance')width*=.37*(t>.48?(i%2?.90:1.07):1);
    if(wavy)width*=1+.10*Math.sin(t*35);
    if(type==='crenate')width*=1+.035*Math.cos(t*Math.PI*20);
    if(type==='leathery')width*=.9;
    if(type==='rhododendronLeaf')width*=.49*Math.pow(Math.max(.00001,Math.sin(Math.PI*t)),-.12);
    if(type==='pierisLeaf')width*=.40*Math.pow(t,.17)*(i%2?.985:1.015);
    if(type==='blueberryLeaf')width*=.58;
    if(birch)width*=.88*(1-t*.46)*(i%4===0?1.10:i%2?.94:1.02);
    if(laurel)width*=.42*(1+.045*Math.sin(t*27));
    if(type==='fringeLeaf')width*=.66*(1-t*.13);
    for(let j=0;j<=cols;j++){
      const u=j/cols*2-1,x=u*width+(elm?.055*Math.sin(Math.PI*t):type==='calycanthus'?.06*Math.sin(Math.PI*t)*(1-t):0);
      const cup=(type==='petal'?.18:type==='hosta'?.2:.12)*u*u*Math.sin(Math.PI*t);
      const bend=type==='blade'?.62*t*t:type==='sword'?.19*t*t:type==='strap'?.34*t*t:type==='petal'?.28*t*t:.23*t*t;
      const relief=laurel?.040*Math.sin(t*27)*u*u*Math.sin(Math.PI*t):birch?.015*Math.cos(t*48-Math.abs(u)*8)*Math.abs(u)*Math.sin(Math.PI*t):corrugated?.021*Math.cos(u*25+Math.sin(t*4)*1.6)*Math.sin(Math.PI*t)*Math.sin(Math.PI*j/cols):ruffled?.06*Math.sin(t*32)*Math.pow(Math.abs(u),3)*Math.sin(Math.PI*t):undulate?(slender?.014:.065)*Math.sin(t*23)*Math.pow(Math.abs(u),2)*Math.sin(Math.PI*t):0;
      const cabbageFold=cabbage?.075*Math.sin(t*29)*Math.pow(Math.abs(u),3)*Math.sin(Math.PI*t)+.027*Math.cos(t*48-Math.abs(u)*10)*Math.abs(u)*Math.sin(Math.PI*t):0;
      positions.push(x,t-(type==='crambeHeart'?.18*Math.exp(-Math.pow((t-.12)/.13,2))*u*u:0),bend+cup+relief+cabbageFold+(type==='sword'?Math.abs(x)*.55:.014*Math.cos(t*24+Math.abs(u)*8)*Math.abs(u)));uvs.push(j/cols,t);
      if(i<rows&&j<cols){const a=i*(cols+1)+j,b=a+cols+1;indices.push(a,b,a+1,b,b+1,a+1);}
    }
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();g.userData[type]=true;return keep(g);
}
for(const type of ['birchLeaf','fringeLeaf','laurelLeaf'])shapes[type]=curvedLeaf(type);
// Falls curve away from the flower centre; standards rise above it.
// The style branches are separate petaloid organs, not extra petals.
for(const type of ['irisFall','irisStandard','irisBeardedFall','irisBeardedStandard','irisStyle','irisDietesFall','irisSnakeFall','irisSword','irisQuill']){
 const pos=[],uv=[],idx=[],rows=36,cols=16,leaf=type==='irisSword',quill=type==='irisQuill',standard=type.includes('Standard'),beard=type.includes('Bearded'),style=type==='irisStyle',flat=type==='irisDietesFall',snake=type==='irisSnakeFall';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,sin=Math.max(0,Math.sin(Math.PI*t));
  let width=leaf?.034*Math.pow(1-t,.38):quill?.004*(1-t*.50):style?.13*Math.pow(sin,.65):standard?(beard?.47:.14)*Math.pow(sin,.62):(.04+(beard?.49:flat?.40:snake?.22:.34)*Math.pow(sin,.6))*Math.pow(t,.28);
  if(i===rows)width=0;
  const ruffle=beard?.038*Math.sin(t*47+Math.abs(u)*8)*Math.pow(Math.abs(u),3)*sin:0;
  let y=standard?t*(beard?1.25:1.20):style?.30*Math.sin(t*1.4):flat?.09*Math.sin(Math.PI*t):.22*Math.sin(t*Math.PI)-.33*Math.pow(t,3),z=standard?.21*Math.sin(t*3.8):t*(style?.74:snake?.72:1);
  if(leaf){y=t;z=.09*t*t+Math.abs(u)*width*.7;}
  else if(quill){y=t;z=.06*t*t+.004*(1-t*.50)*Math.sin(j/cols*Math.PI*2);}
  else {y+=.055*u*u*sin+ruffle;z+=standard?.04*u*u*sin:0;}
  pos.push(quill?.004*(1-t*.5)*Math.cos(j/cols*Math.PI*2):u*width,y,z);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['narcissusLeaf','narcissusTepal','narcissusNarrowTepal','narcissusSplitCorona']){
 const pos=[],uv=[],idx=[],rows=32,cols=12,leaf=type==='narcissusLeaf',split=type==='narcissusSplitCorona',narrow=type==='narcissusNarrowTepal';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,width=leaf?.014*Math.pow(Math.max(0,Math.sin(Math.PI*(t*.96+.02))),.18):Math.pow(Math.max(0,Math.sin(Math.PI*t)),split?.42:.63)*(narrow?.24:split?.55:.41);
  const fold=leaf?.003*Math.abs(u):.008*Math.cos(t*19-Math.abs(u)*5)*Math.abs(u)*Math.sin(Math.PI*t);
  pos.push(u*width,t,leaf?.20*t*t+fold:.12*u*u*Math.sin(Math.PI*t)+fold+(split?.045*Math.sin(t*23)*Math.pow(Math.abs(u),3):narrow?.13*u*t*t:0));uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['narcissusCup','narcissusTrumpet','narcissusHoop']){
 const pos=[],uv=[],idx=[],rows=24,cols=96,hoop=type==='narcissusHoop',trumpet=type==='narcissusTrumpet';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,an=j/cols*Math.PI*2,radius=(hoop?.07+.93*t:trumpet?.46+.54*Math.pow(t,2.3):.54+.46*Math.pow(t,1.4))*(1+.025*Math.cos(an*18)*t);
  const rim=Math.pow(t,9),y=t+rim*(.055*Math.sin(an*17)+.022*Math.cos(an*31));
  pos.push(Math.sin(an)*(radius+.06*rim*Math.sin(an*17)),y,Math.cos(an)*(radius+.06*rim*Math.sin(an*17)));uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+1,k+cols+1,k+1,k+cols+2,k+cols+1);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['dahliaLeaf','dahliaCutLeaf','dahliaRay','dahliaRoundRay','dahliaTwistedRay','dahliaSplitRay']){
 const positions=[],uv=[],idx=[],rows=32,cols=12,leaf=type.includes('Leaf'),cut=type==='dahliaCutLeaf',round=type==='dahliaRoundRay',twist=type==='dahliaTwistedRay',split=type==='dahliaSplitRay';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,serration=leaf?(i%2?.89:1.03):1;
  let width=Math.pow(Math.max(0,Math.sin(Math.PI*t)),leaf?.85:round?.50:.71)*(leaf?.33:.37)*serration;
  if(cut)width*=1-.40*Math.pow(.5+.5*Math.cos((t-.25)*Math.PI*6),3)*Math.sin(Math.PI*t);
  const curl=leaf?.11:.17,rotation=twist?.30*Math.sin(t*4):0,x=u*width,y=t-(split?.08*Math.exp(-Math.pow(u/.23,2))*Math.pow(t,9):0);
  const z=(leaf?.19:-.16)*t*t+curl*u*u*Math.sin(Math.PI*t)+(twist?.11*Math.sin(t*22)*Math.pow(Math.abs(u),3):0);
  positions.push(x*Math.cos(rotation)-z*Math.sin(rotation),y,x*Math.sin(rotation)+z*Math.cos(rotation));uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['leaf','blueberryLeaf','rhododendronLeaf','pierisLeaf','chloranthusLeaf','narrow','lanceSerrate','ovateSerrate','broadToothed','seaKaleLeaf','crambeHeart','obovateSerrate','oakLance','wavyElliptic','wavyLance','elm','calycanthus','hosta','hostaCorrugated','hostaRuffled','petal','blade','sword','strap','wavyStrap','needle','serrated','crenate','leathery'])shapes[type]=curvedLeaf(type);
{
 const g=new THREE.SphereGeometry(1,20,14),p=g.attributes.position;
 for(let i=0;i<p.count;i++){const y=p.getY(i);p.setY(i,y*.82-.13*Math.pow(Math.max(0,y),9));}p.needsUpdate=true;g.computeVertexNormals();g.userData.blueberryFruit=true;shapes.blueberryFruit=keep(g);
}
// A connected corolla, rather than five disconnected triangles, preserves the
// fused flower tube, folds and outline as the camera moves around a flower.
for(const type of ['rhododendronFunnel','azaleaFunnel','kalmiaCup','kalmiaBud','pierisUrn','blueberryUrn','enkianthusBell','enkianthusRound']){
 const pos=[],uv=[],idx=[],rows=22,cols=80,kalmia=type==='kalmiaCup',closed=type==='kalmiaBud',urn=type==='pierisUrn'||type==='blueberryUrn',bell=type.startsWith('enkianthus');
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,an=j/cols*Math.PI*2,lobe=.5+.5*Math.cos(an*5),rib=.5+.5*Math.cos(an*10);
  let radius=.09+.93*Math.pow(t,1.7),y=1.25*t-.17*Math.pow(t,5)*(1-lobe);
  if(type==='azaleaFunnel'){radius=.06+.94*Math.pow(t,2.4);y=1.35*t-.33*Math.pow(t,4)*(1-lobe);}
  if(kalmia){const a=(an+Math.PI/5)%(Math.PI*2/5)-Math.PI/5;radius=t*.82/Math.cos(a);y=.48*Math.pow(t,2.7)+.06*rib*Math.pow(t,6);}
  else if(closed){radius=Math.sin(Math.PI*t)*(.55+.20*rib);y=t;}
  else if(urn){radius=.16+.72*Math.pow(Math.sin(Math.PI*t*.90),.67);y=2.05*t+.08*lobe*Math.pow(t,10);}
  else if(bell){radius=type==='enkianthusRound'?.14+.84*Math.sin(Math.PI*t*.90):.14+.76*Math.sin(Math.PI*t*.69);y=(type==='enkianthusRound'?1.25:1.70)*t-.10*lobe*Math.pow(t,5);}
  if(!closed&&!urn&&!bell&&!kalmia){radius*=1-.14*(1-lobe)*Math.pow(t,4);y+=.045*Math.sin(an*27)*Math.pow(t,9);}
  pos.push(Math.sin(an)*radius,y,Math.cos(an)*radius);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+1,k+cols+1,k+1,k+cols+2,k+cols+1);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[type]=true;shapes[type]=keep(g);
}
for(const type of ['asteliaBlade','asteliaYoung']){
 const points=[],uv=[],idx=[],rows=32,cols=8;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,width=.048*Math.pow(1-t,.58),young=type==='asteliaYoung',angle=t*(young?1.15:2.2),bend=(1-Math.cos(angle))*(young?.3:.45),rise=Math.sin(angle)*(young?1.095:1);
  points.push(u*width,rise,bend+Math.abs(u)*width*.70+.0016*Math.cos(u*26)*Math.sin(Math.PI*t));uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData.asteliaBlade=true;shapes[type]=keep(g);
}
{
 const positions=[],uvs=[],indices=[],rows=24,cols=4;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,width=.027*Math.pow(1-t,.45),angle=t*2.95;
  positions.push(u*width,Math.sin(angle)*.42,(1-Math.cos(angle))*.34+Math.abs(u)*.006);uvs.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;indices.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();g.userData.archingReedLeaf=true;shapes.reedLeaf=keep(g);
}
{
 const positions=[],uvs=[],indices=[],rows=20,cols=12;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,width=.49*Math.sqrt(Math.max(0,1-Math.pow(2*t-1,2))),edge=Math.sin(Math.PI*t),relief=.035*Math.pow(Math.sin(t*19+Math.abs(u)*2.1),2)*Math.sin(Math.PI*j/cols)*edge;
  positions.push(u*width,t-(i===rows?.018*(1-Math.abs(u)):0),.13*t*t+.10*u*u*edge+relief);uvs.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;indices.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();g.userData.bullate=true;shapes.bullateRound=keep(g);
}
{
 const points=[],uv=[],indices=[],rows=24,cols=6;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,width=.23*Math.pow(Math.sin(Math.PI*t),.8);
  points.push(u*width,Math.sin(t*3.4)*.37,(1-Math.cos(t*3.4))*.34+u*u*.04*Math.sin(Math.PI*t));uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;indices.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();g.userData.recurvedTepal=true;shapes.recurvedTepal=keep(g);
}

// Lobed and fan-shaped blades have their own outlines, rather than a recoloured oval.
function outlineLeaf(points){
 const shape=new THREE.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();
 const g=new THREE.ShapeGeometry(shape),pos=g.attributes.position,uv=g.attributes.uv;
 // Match curvedLeaf's front-face orientation, including contrasting undersides.
 const index=g.index;for(let i=0;i<index.count;i+=3){const swap=index.getX(i+1);index.setX(i+1,index.getX(i+2));index.setX(i+2,swap);}
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);pos.setZ(i,.055*x*x+.025*Math.sin(y*4));uv.setXY(i,x+.5,y);}
 g.computeVertexNormals();return keep(g);
}
shapes.soapwortPetal=outlineLeaf([[0,0],[-.10,.38],[-.30,.57],[-.38,.80],[-.27,.96],[-.08,1],[0,.94],[.08,1],[.27,.96],[.38,.80],[.30,.57],[.10,.38]]);
{const g=new THREE.CylinderGeometry(1,1,1,4);g.translate(0,.5,0);g.userData.squareStem=true;shapes.squareStem=keep(g);}
shapes.celosiaTepal=outlineLeaf([[0,0],[-.13,.37],[0,1],[.13,.37]]);
shapes.gaillardiaRay=outlineLeaf([[0,0],[-.09,.27],[-.19,.58],[-.24,.83],[-.19,.97],[-.11,1],[-.075,.90],[0,1.025],[.075,.90],[.11,1],[.19,.97],[.24,.83],[.19,.58],[.09,.27]]);
shapes.gaillardiaSplitRay=outlineLeaf([[0,0],[-.04,.48],[-.13,.68],[-.23,.94],[-.18,1],[-.05,.78],[0,1.08],[.05,.78],[.18,1],[.23,.94],[.13,.68],[.04,.48]]);
shapes.gaillardiaLobed=outlineLeaf([[0,0],[-.05,.10],[-.19,.18],[-.08,.26],[-.26,.36],[-.10,.44],[-.28,.57],[-.11,.64],[-.22,.80],[0,1],[.22,.80],[.11,.64],[.28,.57],[.10,.44],[.26,.36],[.08,.26],[.19,.18],[.05,.10]]);
{
 const p=[],uv=[],idx=[],rows=28,cols=120;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,an=j/cols*Math.PI*2,profile=Math.pow(Math.sin(t*Math.PI),.66),fold=1+.22*Math.sin(an*11+t*10)+.10*Math.sin(an*23-t*17);
  p.push(Math.cos(an)*profile*fold*.82,t+profile*.026*Math.sin(an*17+t*29),Math.sin(an)*profile*fold*.38);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+1,k+cols+1,k+1,k+cols+2,k+cols+1);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData.celosiaCrest=true;shapes.celosiaCrest=keep(g);
}
{
 const p=[],uv=[],idx=[],rows=16,cols=16;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,an=j/cols*Math.PI*2,rr=.050+.030*t;
  p.push(Math.sin(an)*rr,t*.82,t*t*.32+Math.cos(an)*rr);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+1,k+cols+1,k+1,k+cols+2,k+cols+1);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData.monardaTube=true;shapes.monardaTube=keep(g);
}
for(const name of ['balloonCorolla','balloonBud','cowherbCalyx']){
 const p=[],uv=[],idx=[],rows=20,cols=80,bloom=name==='balloonCorolla',calyx=name==='cowherbCalyx';
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,an=j/cols*Math.PI*2,fold=Math.cos(an*5),outline=.72+.28*Math.pow((1+fold)/2,2),rr=bloom?(.09+t*.91)*(1-(1-outline)*Math.pow(t,3)):calyx?(.32+.28*Math.sin(t*Math.PI))*(1+.10*fold):Math.pow(Math.sin(t*Math.PI),.72)*(1-.065*Math.cos(an*5));
  p.push(Math.sin(an)*rr,bloom?.55*Math.sin(t*Math.PI/2)+.08*fold*t*t:calyx?t*1.45:t*1.55,Math.cos(an)*rr);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+1,k+cols+1,k+1,k+cols+2,k+cols+1);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData[name]=true;shapes[name]=keep(g);
}
const featherEdge=[[0,0]];
for(let j=0;j<16;j++){const t=.025+j*.059,width=.28*Math.sin((t+.1)*Math.PI/1.18);featherEdge.push([-.018,t],[-width,t+.029],[-.018,t+.045]);}
featherEdge.push([0,1]);for(let j=15;j>=0;j--){const t=.025+j*.059,width=.28*Math.sin((t+.1)*Math.PI/1.18);featherEdge.push([.018,t+.045],[width,t+.029],[.018,t]);}shapes.feather=outlineLeaf(featherEdge);
const filigree=[[0,0]];
for(let j=0;j<22;j++){const t=.02+j*.043,w=.28*Math.sin((t+.13)*Math.PI/1.25);filigree.push([-.006,t],[-w,t+.10],[-.006,t+.015]);}
filigree.push([0,1]);for(let j=21;j>=0;j--){const t=.02+j*.043,w=.28*Math.sin((t+.13)*Math.PI/1.25);filigree.push([.006,t+.015],[w,t+.10],[.006,t]);}shapes.filigree=outlineLeaf(filigree);
shapes.heart=outlineLeaf([[0,0],[-.16,-.08],[-.34,.02],[-.44,.23],[-.43,.42],[-.31,.67],[0,1],[.31,.67],[.43,.42],[.44,.23],[.34,.02],[.16,-.08]]);
shapes.morningGloryLeaf=outlineLeaf([[0,0],[-.16,-.10],[-.37,-.02],[-.49,.20],[-.56,.46],[-.35,.49],[-.22,.35],[-.23,.57],[-.12,.79],[0,1],[.12,.79],[.23,.57],[.22,.35],[.35,.49],[.56,.46],[.49,.20],[.37,-.02],[.16,-.10]]);shapes.morningGloryLeaf.userData.morningGloryLeaf=true;
shapes.sunflowerRay=outlineLeaf([[0,0],[-.11,.25],[-.20,.60],[-.15,.86],[-.05,.98],[0,1],[.08,.94],[.18,.71],[.19,.48],[.07,.13]]);
shapes.sunflowerBract=outlineLeaf([[0,0],[-.13,.08],[-.21,.35],[-.14,.65],[0,1],[.14,.65],[.21,.35],[.13,.08]]);
{
 const pts=[[0,0],[-.14,-.06],[-.28,.01]];
 for(let j=0;j<24;j++){const t=j/24,y=.04+t*.93,w=.40*Math.pow(Math.sin((t+.21)*Math.PI/1.21),.77)*(j%2?1:.91);pts.push([-w,y]);}
 pts.push([0,1]);for(let j=23;j>=0;j--){const t=j/24,y=.04+t*.93,w=.40*Math.pow(Math.sin((t+.21)*Math.PI/1.21),.77)*(j%2?1:.91);pts.push([w,y]);}pts.push([.28,.01],[.14,-.06]);shapes.sunflowerLeaf=outlineLeaf(pts);shapes.sunflowerLeaf.userData.sunflowerLeaf=true;
}
{
 const pts=[[0,0],[-.18,-.07],[-.32,.03]];
 for(let j=0;j<27;j++){const t=j/27,y=.07+t*.9,w=.43*Math.pow(Math.sin((t+.18)*Math.PI/1.18),.75)*(j%2?1:.94);pts.push([-w,y]);}
 pts.push([0,1]);for(let j=26;j>=0;j--){const t=j/27,y=.07+t*.9,w=.43*Math.pow(Math.sin((t+.18)*Math.PI/1.18),.75)*(j%2?1:.94);pts.push([w,y]);}pts.push([.32,.03],[.18,-.07]);shapes.vineHeart=outlineLeaf(pts);
}
for(const name of ['grapeShallow','grapeDivided']){
 const deep=name==='grapeDivided',edge=[[0,0],[-.16,-.07],[-.35,.06],[-.47,.24],[-.30,.32],[-.53,.57],[-.29,.65],[-(deep?.10:.25),deep?.40:.59],[-.18,.85],[0,1],[.18,.85],[deep?.10:.25,deep?.40:.59],[.29,.65],[.53,.57],[.30,.32],[.47,.24],[.35,.06],[.16,-.07]],pts=[];
 for(let i=0;i<edge.length;i++){const a=edge[i],b=edge[(i+1)%edge.length],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy),n=Math.max(2,Math.ceil(length/.065));for(let j=0;j<n;j++){const t=j/n,tooth=j%2?.012:0;pts.push([a[0]+dx*t-dy/length*tooth,a[1]+dy*t+dx/length*tooth]);}}
 shapes[name]=outlineLeaf(pts);shapes[name].userData.porcelainLobedLeaf=true;
}
for(const name of ['eryngoStrap','eryngoBract']){
 const pts=[[0,0]],wide=name==='eryngoBract';
 for(let j=0;j<15;j++){const t=.025+j*.064,w=(wide?.13:.07)*Math.pow(Math.sin(Math.PI*t),.55);pts.push([-w,t],[-w-(wide?.07:.055),t+.035],[-w*.93,t+.032]);}
 pts.push([0,1]);for(let j=14;j>=0;j--){const t=.025+j*.064,w=(wide?.13:.07)*Math.pow(Math.sin(Math.PI*t),.55);pts.push([w*.93,t+.032],[w+(wide?.07:.055),t+.035],[w,t]);}shapes[name]=outlineLeaf(pts);
 if(!wide){const p=shapes[name].attributes.position;for(let j=0;j<p.count;j++){const t=p.getY(j);p.setY(j,Math.sin(t*1.7)/1.7);p.setZ(j,p.getZ(j)+(1-Math.cos(t*1.7))*.43);}shapes[name].computeVertexNormals();}
}
{
 const pts=[[0,0]];
 for(let j=0;j<7;j++){
  const an=(j-3)*.40,len=.5+.5*Math.cos(an),p=(a,r)=>[Math.sin(a)*r,Math.cos(a)*r];
  pts.push(p(an-.12,.16),p(an-.08,len*.5),p(an-.14,len*.68),p(an-.045,len*.70),p(an-.04,len*.86),p(an,len),p(an+.04,len*.86),p(an+.045,len*.7),p(an+.14,len*.68),p(an+.08,len*.5),p(an+.12,.16));
 }shapes.eryngoPalm=outlineLeaf(pts);
}
shapes.ginkgo=outlineLeaf([[0,0],[-.11,.3],[-.42,.62],[-.55,.86],[-.45,.93],[-.34,.99],[-.18,1],[-.06,.94],[0,.82],[.06,.94],[.18,1],[.34,.99],[.45,.93],[.55,.86],[.42,.62],[.11,.3]]);
shapes.oak=outlineLeaf([[0,0],[-.18,.12],[-.24,.22],[-.13,.27],[-.34,.38],[-.37,.48],[-.2,.53],[-.36,.67],[-.31,.78],[-.15,.75],[-.15,.92],[0,1],[.15,.92],[.15,.75],[.31,.78],[.36,.67],[.2,.53],[.37,.48],[.34,.38],[.13,.27],[.24,.22],[.18,.12]]);
shapes.star=outlineLeaf([[0,0],[-.38,.12],[-.2,.35],[-.6,.55],[-.21,.58],[0,1],[.21,.58],[.6,.55],[.2,.35],[.38,.12]]);
shapes.tridentMaple=outlineLeaf([[0,0],[-.22,.11],[-.34,.29],[-.48,.68],[-.18,.56],[-.11,.79],[0,1],[.11,.79],[.18,.56],[.48,.68],[.34,.29],[.22,.11]]);
shapes.dendropanaxLobed=outlineLeaf([[0,0],[-.25,.09],[-.4,.35],[-.52,.75],[-.17,.55],[0,1],[.17,.55],[.52,.75],[.4,.35],[.25,.09]]);
shapes.rhombic=outlineLeaf([[0,0],[-.27,.10],[-.42,.42],[-.25,.70],[0,1],[.25,.70],[.42,.42],[.27,.10]]);
shapes.tulipLeaf=outlineLeaf([[0,0],[-.32,.14],[-.45,.4],[-.27,.5],[-.43,.85],[-.12,.80],[0,.7],[.12,.80],[.43,.85],[.27,.5],[.45,.4],[.32,.14]]);
shapes.triangular=outlineLeaf([[0,0],[-.46,.06],[-.29,.44],[0,1],[.29,.44],[.46,.06]]);
{
 const points=[[0,0]];
 for(let j=0;j<5;j++){
  const an=(j-2)*.55,length=[.65,.86,1,.86,.65][j],point=(angle,r)=>[Math.sin(angle)*r,Math.cos(angle)*r];
  points.push(point(an-.10,.17),point(an-.025,length*.83),point(an,length),point(an+.025,length*.83),point(an+.10,.17));
 }
 shapes.bindweedDivided=outlineLeaf(points);
}
{
 const edge=[[0,0],[-.28,.02],[-.48,.16]];
 for(let j=0;j<12;j++){const y=.18+j*.062,wide=.49*(1-y);edge.push([-wide*(j%2?1:1.20),y]);}
 edge.push([0,1]);for(let j=11;j>=0;j--){const y=.18+j*.062,wide=.49*(1-y);edge.push([wide*(j%2?1:1.20),y]);}edge.push([.48,.16],[.28,.02]);shapes.deltoidSerrate=outlineLeaf(edge);
}
shapes.arrow=outlineLeaf([[0,0],[-.4,-.12],[-.24,.4],[0,1],[.24,.4],[.4,-.12]]);
shapes.spoon=outlineLeaf([[0,0],[-.055,.38],[-.32,.59],[-.34,.84],[-.17,.98],[0,1],[.17,.98],[.34,.84],[.32,.59],[.055,.38]]);
shapes.canaryGlume=outlineLeaf([[0,0],[-.13,.20],[-.27,.66],[-.24,.83],[0,1],[.24,.83],[.27,.66],[.13,.20]]);
for(const type of ['acaenaRounded','acaenaToothed']){
 const pts=[[0,0]],round=type==='acaenaRounded';
 for(let i=0;i<=80;i++){const t=i/80,an=(-145+t*290)*Math.PI/180,rad=.47*(1+(round?.065:.095)*Math.cos(an*(round?12:8)));pts.push([Math.sin(an)*rad,.42+Math.cos(an)*rad]);}
 shapes[type]=outlineLeaf(pts);shapes[type].userData.acaenaLeaflet=true;
}
shapes.claspingOvate=outlineLeaf([[0,0],[-.21,-.08],[-.41,.08],[-.46,.34],[-.32,.68],[0,1],[.32,.68],[.46,.34],[.41,.08],[.21,-.08]]);
shapes.globulariaSpoon=outlineLeaf([[0,0],[-.05,.32],[-.24,.51],[-.32,.77],[-.28,.94],[-.13,.98],[0,.94],[.13,.98],[.28,.94],[.32,.77],[.24,.51],[.05,.32]]);
for(const type of ['mallowPalm','mallowLobed']){
 const pts=[[0,0]],round=type==='mallowPalm';
 for(let i=0;i<=180;i++){
  const an=(-145+i*290/180)*Math.PI/180,r=(round?.47:.41)+(round?.085:.16)*Math.cos(an*(round?5:3)),tooth=1+.045*Math.cos(an*45);
  pts.push([Math.sin(an)*r*tooth,.26+Math.cos(an)*r*tooth]);
 }
 shapes[type]=outlineLeaf(pts);shapes[type].userData.mallowLobes=round?5:3;
}
shapes.obovate=outlineLeaf([[0,0],[-.12,.22],[-.35,.6],[-.35,.82],[-.18,.99],[0,1],[.18,.99],[.35,.82],[.35,.6],[.12,.22]]);
// Peltate blades are centred on their stalk attachment, with eight broad lobes.
{
 const pts=[];
 for(let j=0;j<128;j++){const an=j*Math.PI*2/128,rr=.44*(1+.10*Math.cos(an*8))*(1+.012*Math.cos(an*64));pts.push([Math.sin(an)*rr,Math.cos(an)*rr]);}
 shapes.peltate=outlineLeaf(pts);
}
for(const name of ['geraniumPalm','geraniumRound','glaucidiumPalm']){
 const pts=[[0,0]];
 for(let j=0;j<=180;j++){
  const an=(-150+j*300/180)*Math.PI/180,deep=name==='geraniumPalm',poppy=name==='glaucidiumPalm',r=(poppy?.46:deep?.30:.54)+(poppy?.27:deep?.46:.20)*Math.pow(.5+.5*Math.cos(an*(poppy?10:6)),.55),tooth=1+(poppy?.055:.026)*Math.cos(an*(poppy?100:72));
  pts.push([Math.sin(an)*r*tooth,.22+Math.cos(an)*r*tooth]);
 }
 shapes[name]=outlineLeaf(pts);shapes[name].userData.palmateLobes=name==='glaucidiumPalm'?9:5;
}
shapes.anemonopsisLeaflet=outlineLeaf([[0,0],[-.15,.03],[-.28,.12],[-.24,.16],[-.39,.27],[-.32,.32],[-.44,.51],[-.34,.48],[-.29,.65],[-.24,.56],[-.22,.75],[-.17,.71],[-.14,.88],[-.10,.83],[0,1],[.10,.83],[.14,.88],[.17,.71],[.22,.75],[.24,.56],[.29,.65],[.34,.48],[.44,.51],[.32,.32],[.39,.27],[.24,.16],[.28,.12],[.15,.03]]);
for(const name of ['round','kidney','lobed']){
 const pts=[[0,0]];
 for(let j=0;j<=84;j++){
  const a=-Math.PI*.9+j/84*Math.PI*1.8,rr=name==='lobed'?.43*(1+.11*Math.cos(a*7)):.46;
  pts.push([Math.sin(a)*rr,.40+Math.cos(a)*rr*(name==='kidney'?.75:1)]);
 }shapes[name]=outlineLeaf(pts);
}
{
 const p=[],uv=[],idx=[],rows=22,cols=18;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,u=j/cols*2-1,width=.40*Math.pow(Math.sin(Math.PI*t),.72),angle=u*1.8;
  p.push(Math.sin(angle)*width,t,(1-Math.cos(angle))*width*.70-.18*t*t);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();shapes.spathe=keep(g);
 const spadix=new THREE.CylinderGeometry(.13,.15,1,12);spadix.translate(0,.5,0);shapes.spadix=keep(spadix);
}
for(const name of ['bell','trumpet','tube','urn','bell6','trumpet6']){
 const base=name.replace('6',''),lobes=name.endsWith('6')?6:5;
 const positions=[],uv=[],indices=[],rings=12,sides=25;
 for(let j=0;j<=rings;j++)for(let k=0;k<=sides;k++){
  const t=j/rings,a=k/sides*Math.PI*2;
  let r=base==='tube'?.16+t*.09:base==='urn'?.09+Math.sin(t*Math.PI*.85)*.37:base==='trumpet'?.1+Math.pow(t,3)*.52:.10+.40*Math.sin(t*Math.PI*.48);
  r*=1+Math.max(0,t-.7)*.65*Math.cos(a*lobes);
  positions.push(Math.sin(a)*r,t+Math.max(0,t-.8)*.45*Math.cos(a*lobes),Math.cos(a)*r);uv.push(k/sides,t);
  if(j<rings&&k<sides){const i=j*(sides+1)+k;indices.push(i,i+sides+1,i+1,i+1,i+sides+1,i+sides+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();shapes[name]=keep(g);
}
{
 const p=[],uv=[],idx=[],rows=20,cols=60;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,an=j/cols*Math.PI*2,rr=(.07+.93*Math.pow(t,1.9))*(1+.022*Math.cos(5*an)*t),crease=.035*Math.cos(5*an)*t*t;
  p.push(Math.sin(an)*rr,.82*t+crease+.009*Math.sin(35*an)*t*t,Math.cos(an)*rr);uv.push(j/cols,t);
  if(i<rows&&j<cols){const k=i*(cols+1)+j;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();shapes.bindweedFunnel=keep(g);
}

// Acer palmatum: seven radiating, deeply divided lobes, with fine marginal teeth.
// The blade grows from the petiole origin, not along a serrated strap.
function mapleLeaf(steps=16,rings=[.45,1]){
  const edge=[],positions=[0,0,0],uvs=[.5,.3/1.3],indices=[];
  const lobes=[[-102,.54],[-68,.86],[-34,.99],[0,1.02],[34,.97],[68,.84],[102,.52]];
  edge.push([-.035,-.07]);
  for(let l=0;l<lobes.length;l++)for(let step=0;step<=steps;step++){
    const t=step/steps,angle=(lobes[l][0]-17+t*34)*Math.PI/180;
    let radius=.30+(lobes[l][1]-.30)*Math.pow(Math.sin(Math.PI*t),1.08);
    if(step%2===1)radius-=.028*Math.sin(Math.PI*t);
    edge.push([Math.sin(angle)*radius,Math.cos(angle)*radius]);
  }
  edge.push([.035,-.07]);
  const count=edge.length;
  for(const fraction of rings)for(const [ex,ey] of edge){
    const x=ex*fraction,y=ey*fraction;
    const angle=Math.atan2(x,y),rib=Math.cos(angle/(34*Math.PI/180)*Math.PI*2);
    const z=.028*Math.sin(fraction*Math.PI)*rib-.035*fraction*fraction+.012*Math.sin(angle*2)*fraction;
    positions.push(x,y,z);uvs.push(x/2.1+.5,(y+.3)/1.3);
  }
  for(let j=0;j<count;j++){
    const next=(j+1)%count;indices.push(0,1+j,1+next);
    for(let ring=0;ring<rings.length-1;ring++){
      const a=1+ring*count+j,b=1+ring*count+next,c=a+count,d=b+count;indices.push(a,c,b,b,c,d);
    }
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeVertexNormals();geometry.userData.palmateLobes=7;return keep(geometry);
}
shapes.maple=mapleLeaf();shapes.mapleLow=mapleLeaf(8,[1]);
{
 // Seven deeply cut lobes with secondary incisions remain one connected blade.
 const edge=[[0,0]],point=(a,r)=>[Math.sin(a)*r,Math.cos(a)*r];
 for(let l=0;l<7;l++){
  const angle=(l-3)*.53,length=.94-.15*Math.abs(l-3);
  edge.push(point(angle-.22,.09));
  for(let j=1;j<=9;j++){const t=j/10,wide=.085*Math.sin(Math.PI*t);edge.push(point(angle-wide,t*length),point(angle-wide*.27,(t+.017)*length));}
  edge.push(point(angle,length));
  for(let j=9;j>=1;j--){const t=j/10,wide=.085*Math.sin(Math.PI*t);edge.push(point(angle+wide*.27,(t+.017)*length),point(angle+wide,t*length));}
  edge.push(point(angle+.22,.09));
 }
 shapes.laceMaple=outlineLeaf(edge);shapes.laceMaple.userData.palmateLobes=7;shapes.laceMaple.userData.laceMaple=true;
}
{
 const p=[],uv=[],idx=[],rows=20;
 for(let i=0;i<=rows;i++)for(let j=0;j<3;j++){
  const t=i/rows,u=j-1,twist=t*1.45,width=.048*Math.pow(Math.sin(Math.PI*t),.42);
  p.push(u*width*Math.cos(twist)+.11*Math.sin(t*2.5),t,u*width*Math.sin(twist)+.22*t*t-.10*Math.sin(t*Math.PI));uv.push(j/2,t);
  if(i<rows&&j<2){const k=i*3+j;idx.push(k,k+3,k+1,k+1,k+3,k+4);}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();g.userData.fringePetal=true;shapes.fringePetal=keep(g);
}
const windGLSL=`
attribute vec4 gardenWind;
uniform float gardenTime;
uniform float gardenStrength;
varying vec3 gardenLocal;
vec3 bendGarden(vec3 p) {
 float h=max(gardenWind.x,0.05);
 float level=clamp(p.y/h,0.0,1.15);
 float phase=gardenWind.z;
 vec2 root=modelMatrix[3].xz;
 float travelling=sin(gardenTime*1.35-root.x*0.38-root.y*0.24);
 float detail=sin(gardenTime*2.27+phase+p.x*1.8)*0.24;
 float amplitude=min(h,3.0)*gardenWind.y*gardenStrength;
 float sway=(travelling+detail)*amplitude*pow(level,1.65);
 float leafTip=clamp(position.y,0.0,1.0);
 float flutter=sin(gardenTime*4.1+phase+p.x*9.0+p.z*5.0)*0.005*gardenWind.w*gardenStrength*leafTip*leafTip*level;
 return p+vec3(sway+flutter,-abs(sway)*0.025,sway*0.42+flutter*0.6);
}
`;
function windShader(shader,kind){
  shader.uniforms.gardenTime=wind.time;shader.uniforms.gardenStrength=wind.strength;
  shader.vertexShader=windGLSL+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>',`
    vec4 gardenPosition=vec4(transformed,1.0);
    #ifdef USE_INSTANCING
      gardenPosition=instanceMatrix*gardenPosition;
    #endif
    gardenLocal=gardenPosition.xyz;
    gardenPosition.xyz=bendGarden(gardenPosition.xyz);
    vec4 mvPosition=modelViewMatrix*gardenPosition;
    gl_Position=projectionMatrix*mvPosition;
  `).replace('#include <worldpos_vertex>',`
    #if defined(USE_ENVMAP) || defined(DISTANCE) || defined(USE_SHADOWMAP) || defined(USE_TRANSMISSION) || NUM_SPOT_LIGHT_COORDS > 0
      vec4 worldPosition=modelMatrix*gardenPosition;
    #endif
  `);
  if(kind==='depth')return;
  shader.fragmentShader='varying vec3 gardenLocal;\n'+shader.fragmentShader;
  if(kind==='maple'){
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      vec2 leaf=vec2((vUv.x-0.5)*2.1,vUv.y*1.3-0.3);
      float veins=1.0;
      for(int i=-3;i<=3;i++){
        float a=float(i)*0.593412;vec2 dir=vec2(sin(a),cos(a));
        float along=dot(leaf,dir);
        if(along>0.0){float d=abs(leaf.x*dir.y-leaf.y*dir.x);veins=min(veins,d);}
      }
      float rib=1.0-smoothstep(0.003,0.009,veins);
      float fine=pow(max(0.0,cos((length(leaf)*0.65+veins)*180.0)),18.0);
      diffuseColor.rgb*=0.9+0.12*vUv.y;diffuseColor.rgb+=diffuseColor.rgb*(rib*0.28+fine*0.035);
    `);
    shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
      totalEmissiveRadiance+=diffuseColor.rgb*0.10;
    `);
  }else if(kind==='fruit-blueberry-wax'){
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float wax=smoothstep(-0.30,0.36,sin(vUv.x*43.0+sin(vUv.y*29.0))*cos(vUv.y*31.0)+0.3*sin(vUv.x*281.0)*cos(vUv.y*197.0));
      diffuseColor.rgb*=0.55+0.50*wax;
    `);
  }else if(kind.startsWith('leaf')||kind.startsWith('petal')||kind.startsWith('sepal')||kind.startsWith('bract-')||kind==='grass'){
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float fold=abs(vUv.x-0.5)*2.0;
      float midrib=1.0-smoothstep(0.012,0.025,abs(vUv.x-0.5));
      float veins=pow(max(0.0,cos((vUv.y-fold*0.33)*75.0)),16.0);
      float shade=mix(0.77,1.08,fold)*mix(0.85,1.05,vUv.y);
      diffuseColor.rgb*=shade;
      diffuseColor.rgb+=diffuseColor.rgb*(midrib*0.23+veins*0.055);
    `);
    if(kind==='petal-alcea-veins'||kind==='petal-alcea-ripple')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      float ribs=pow(max(0.0,cos(atan((vUv.x-.5)*1.2,vUv.y+.09)*96.0+sin(vUv.y*15.0)*.15)),20.0);diffuseColor.rgb*=1.0-.17*ribs;
      ${kind==='petal-alcea-ripple'?`float pale=smoothstep(.46+.05*sin(vUv.x*87.0),.97,vUv.y);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.62,.44,.58),pale*.80);`:''}
      #include <emissivemap_fragment>`);
    if(kind==='leaf-alcea-underside-b7bdaa')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      float quilt=pow(abs(sin(vUv.x*133.0+sin(vUv.y*53.0))*sin(vUv.y*147.0+cos(vUv.x*47.0))),4.0);diffuseColor.rgb*=.89+.17*quilt;
      #include <emissivemap_fragment>`);
    if(kind.startsWith('leaf-morningMottle'))shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      float mottles=sin(vUv.x*24.0+sin(vUv.y*31.0)*1.5)*sin(vUv.y*21.0+sin(vUv.x*17.0));
      float fine=sin(vUv.x*123.0)*cos(vUv.y*173.0)*.12;
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.69,.74,.60),smoothstep(.58,.79,mottles+fine));
      #include <emissivemap_fragment>`);
    if(kind.startsWith('leaf-purpleFlash'))shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      float cloud=sin(vUv.x*5.0+sin(vUv.y*4.0)*1.3)+sin(vUv.y*6.0-vUv.x*2.0)*.6;
      float fleck=sin(vUv.x*191.0+sin(vUv.y*143.0)*2.0)*sin(vUv.y*203.0);
      float purplePatch=smoothstep(.99,1.36,cloud+fleck*.07);
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.62,.49,.66),purplePatch*.83);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.74,.72,.65),smoothstep(1.49,1.59,cloud));
      #include <emissivemap_fragment>`);
    if(kind==='petal-portulaca-mermaid')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      float streak=sin(vUv.x*43.0+sin(vUv.y*17.0)*2.0)*.10+sin(vUv.x*131.0)*.035;
      float pink=1.0-smoothstep(.52+streak,.77+streak,vUv.y);
      diffuseColor.rgb=mix(vec3(.89,.85,.83),diffuseColor.rgb,pink);\n#include <emissivemap_fragment>`);
    if(kind==='petal-oenothera-veins')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      float ray=pow(max(0.0,cos(atan((vUv.x-.5)*1.1,vUv.y+.04)*62.0+sin(vUv.y*17.0)*.20)),30.0);
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.57,.26,.40),ray*.35*smoothstep(.06,.60,vUv.y));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.77,.76,.32),1.0-smoothstep(.02,.22,vUv.y));\n#include <emissivemap_fragment>`);
    if(kind.startsWith('leaf-pepperMosaic'))shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      float cloud=sin(vUv.x*15.0+sin(vUv.y*13.0)*2.0)+sin(vUv.y*23.0-vUv.x*8.0)*.62;
      float fleck=sin(vUv.x*193.0+sin(vUv.y*167.0)*2.0)*sin(vUv.y*219.0);
      float white=smoothstep(.26,.43,cloud+fleck*.19),purple=smoothstep(-.85,-.60,cloud)*(1.0-white);
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.65,.38,.68),purple*.74);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.78,.78,.68),white);
      #include <emissivemap_fragment>`);
    if(kind==='leaf-ice-cells')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      vec2 cell=fract(vUv*vec2(31.0,63.0))-.5;float bead=1.0-smoothstep(.12,.28,length(cell));
      diffuseColor.rgb+=vec3(.13,.14,.10)*bead;\n#include <emissivemap_fragment>`);
    if(kind.startsWith('petal-nemophila'))shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      float sector=fract(vUv.x*5.0+0.5)-0.5;
      float lines=pow(max(0.0,cos(sector*52.0+vUv.y*4.0)),28.0)*vUv.y;
      ${kind.endsWith('-spots')?'float spot=1.0-smoothstep(.83,1.03,length(vec2(sector/.105,(vUv.y-.87)/.13)));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.18,.11,.36),spot);':'float eye=1.0-smoothstep(.19,.55,vUv.y);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.77,.82,.81),eye);'}
      diffuseColor.rgb*=1.0-lines*.09;
      #include <emissivemap_fragment>`);
    if(kind==='leaf-nasturtium')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      float ray=1.0-smoothstep(.007,.023,abs(fract(vUv.x*9.0+.5)-.5));
      float net=pow(max(0.0,cos(vUv.y*91.0+sin(vUv.x*56.5)*3.0)),22.0)*.045;
      diffuseColor.rgb+=vec3(.10,.12,.07)*(ray*.62+net);\n#include <emissivemap_fragment>`);
    if(kind.startsWith('petal-morning'))shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      float throat=1.0-smoothstep(.30,.68,vUv.y);float foldRay=pow(max(0.0,cos(vUv.x*31.4159)),30.0);
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.80,.83,.72),throat);diffuseColor.rgb*=1.0-foldRay*.14;
      ${kind.endsWith('-picotee')?'float rim=smoothstep(.955+.014*sin(vUv.x*163.0),.985,vUv.y);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.84,.83,.78),rim);':''}
      #include <emissivemap_fragment>`);
    if(kind==='petal-nasturtium-flame')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      float streak=sin(vUv.x*119.0+sin(vUv.y*61.0)*1.8)*.10+sin(vUv.x*273.0)*.035;
      float yellow=smoothstep(.30+streak,.38+streak,vUv.y)*(1.0-smoothstep(.70+streak,.87+streak,vUv.y));
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.78,.59,.18),yellow);\n#include <emissivemap_fragment>`);
    if(kind==='petal-corncockle')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      float guide=1.0-smoothstep(.013,.026,min(abs(vUv.x-.5),abs(abs(vUv.x-.5)-.17*vUv.y)));
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.85,.82,.78),1.0-smoothstep(.10,.53,vUv.y));diffuseColor.rgb*=1.0-guide*.36*smoothstep(.08,.30,vUv.y);\n#include <emissivemap_fragment>`);
    if(kind.startsWith('leaf-hosta'))shader.fragmentShader=shader.fragmentShader.replace('cos((vUv.y-fold*0.33)*75.0)','cos((vUv.x-0.5)*70.0)');
    if(kind==='leaf-persian-metal')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`float network=max(midrib,pow(max(0.0,cos((vUv.y-fold*.32)*38.0)),22.0)*smoothstep(.03,.11,fold));float edge=smoothstep(.88,.99,fold);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.036,.10,.047),max(network,edge));diffuseColor.rgb+=vec3(.030,.020,.040)*(1.0-network)*pow(max(0.0,sin(vUv.x*521.0)*cos(vUv.y*413.0)),8.0);if(!gl_FrontFacing)diffuseColor.rgb=vec3(.188,.053,.131);\n#include <emissivemap_fragment>`);
    if(kind==='leaf-iris-parallel')shader.fragmentShader=shader.fragmentShader.replace('cos((vUv.y-fold*0.33)*75.0)','cos((vUv.x-0.5)*95.0)');
    if(kind==='leaf-lilium-parallel')shader.fragmentShader=shader.fragmentShader.replace('cos((vUv.y-fold*0.33)*75.0)','cos((vUv.x-0.5)*31.4)');
    if(kind==='leaf-crocus-stripe')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.62,.67,.58),1.0-smoothstep(.09,.16,fold));\n#include <emissivemap_fragment>`);
    if(kind==='leaf-hellebore-silver')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`float net=min(abs(sin(vUv.x*22.0+sin(vUv.y*31.0)*.4)),abs(sin(vUv.y*26.0+sin(vUv.x*35.0)*.55)));float silver=1.0-smoothstep(.06,.21,net);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.55,.60,.53),silver*.73);\n#include <emissivemap_fragment>`);
    if(kind==='sepal-hellebore-pinkback')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`if(!gl_FrontFacing){diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.42,.17,.26),.30+.40*vUv.y);}else{diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.30,.38,.14),1.0-smoothstep(.08,.38,vUv.y));}\n#include <emissivemap_fragment>`);
    if(kind.startsWith('sepal-hellebore-')&&kind!=='sepal-hellebore-pinkback'){
      const name=kind.slice(16),linear=hex=>{const c=new THREE.Color(hex);return `vec3(${c.r.toFixed(5)},${c.g.toFixed(5)},${c.b.toFixed(5)})`;};
      let paint='float rim=max(smoothstep(.78,.97,fold),smoothstep(.84,.99,vUv.y));float base=1.0-smoothstep(.13,.55,vUv.y);';
      if(['goldPicotee','goldFlash','pinkBand','greenRim','vesicarius'].includes(name)){
       const tone=linear(name==='greenRim'?'#7b9952':name==='pinkBand'?'#b77986':name==='vesicarius'?'#783b50':'#983d54');
       paint+=`diffuseColor.rgb=mix(diffuseColor.rgb,${tone},${name==='goldFlash'?'base*.94':name==='pinkBand'?'smoothstep(.42,.92,vUv.y)*.88':name==='vesicarius'?'smoothstep(.65,.95,vUv.y)':'rim'});`;
       if(name==='goldPicotee')paint+=`diffuseColor.rgb=mix(diffuseColor.rgb,${tone},base*.83);if(!gl_FrontFacing)diffuseColor.rgb=mix(diffuseColor.rgb,${tone},.67);`;
      }
      if(['goldSpots','goldSand','goldBlotch','guttatus'].includes(name)){
       const sand=name==='goldSand',blotch=name==='goldBlotch';
       paint+=`float specks=smoothstep(${blotch?'.12,.38':'.73,.92'},sin(vUv.x*${sand?'173.0':'69.0'}+cos(vUv.y*27.0))*sin(vUv.y*${sand?'191.0':'81.0'}+sin(vUv.x*47.0)));diffuseColor.rgb=mix(diffuseColor.rgb,${linear('#87354b')},specks*${blotch?'(1.0-smoothstep(.37,.78,vUv.y))':'.90'});`;
      }
      if(name==='pinkVeins')paint+=`float network=max(midrib,pow(max(0.0,cos((vUv.y-fold*.37)*31.0)),30.0)*.75);diffuseColor.rgb=mix(diffuseColor.rgb,${linear('#b36f86')},network*.45);`;
      shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',paint+'\n#include <emissivemap_fragment>');
    }
    if(kind==='sepal-clematis-green')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`float line=(1.0-smoothstep(.11,.29,fold))*(1.0-smoothstep(.80,1.0,vUv.y));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.54,.60,.30),line*.42);\n#include <emissivemap_fragment>`);
    if(kind.startsWith('petal-bulb-')){
      const name=kind.slice(11),linear=hex=>{const c=new THREE.Color(hex);return `vec3(${c.r.toFixed(5)},${c.g.toFixed(5)},${c.b.toFixed(5)})`;};
      let paint='';
      if(name==='sara')paint=`float flame=(1.0-smoothstep(.25,.73,fold))*(smoothstep(.30,.78,vUv.y));diffuseColor.rgb=mix(diffuseColor.rgb,${linear('#e88031')},flame);`;
      else if(name.startsWith('persian'))paint=`float stripe=smoothstep(.65+.025*sin(vUv.y*34.0),.83,fold);float grain=.92+.08*sin(vUv.x*521.0)*cos(vUv.y*617.0);diffuseColor.rgb=mix(diffuseColor.rgb,${linear('#e4d5dc')}*grain,stripe*.94);diffuseColor.rgb=mix(diffuseColor.rgb,${linear('#c6b355')},1.0-smoothstep(.10,.22,vUv.y));`;
      else if(name.startsWith('clusiana-outer'))paint=`if(!gl_FrontFacing){float band=1.0-smoothstep(.60,.94,fold);diffuseColor.rgb=mix(diffuseColor.rgb,${linear(name.endsWith('yellow')?'#c45a3f':'#a94062')},band);}`;
      else if(name==='crocus-striped')paint=`float stripe=smoothstep(.35,.60,sin(vUv.x*32.0+sin(vUv.y*7.0)*.5));diffuseColor.rgb=mix(diffuseColor.rgb,${linear('#77519d')},stripe*.80);`;
      shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',paint+'\n#include <emissivemap_fragment>');
    }
    if(kind.startsWith('petal-lilium-')){
      const name=kind.slice(13),linear=hex=>{const c=new THREE.Color(hex);return `vec3(${c.r.toFixed(5)},${c.g.toFixed(5)},${c.b.toFixed(5)})`;};
      let paint='float band=(1.0-smoothstep(.12,.55,fold))*(1.0-smoothstep(.70,.97,vUv.y));';
      if(name==='frontera'||name==='candy')paint+=`diffuseColor.rgb=mix(diffuseColor.rgb,${linear(name==='frontera'?'#c74685':'#c53375')},band*.94);`;
      if(name==='kaveri')paint+=`float rim=max(smoothstep(.53,.92,fold),smoothstep(.83,.98,vUv.y));diffuseColor.rgb=mix(diffuseColor.rgb,${linear('#edc044')},rim);`;
      if(name==='conca')paint+=`diffuseColor.rgb=mix(diffuseColor.rgb,${linear('#e5cc5c')},(1.0-smoothstep(.12,.88,vUv.y))*.92);`;
      if(name==='auratum')paint+=`diffuseColor.rgb=mix(diffuseColor.rgb,${linear('#d6ba4f')},(1.0-smoothstep(.12,.27,fold))*.95);`;
      if(name==='regale')paint+=`if(gl_FrontFacing){diffuseColor.rgb=mix(diffuseColor.rgb,${linear('#d9c05a')},1.0-smoothstep(.36,.72,vUv.y));}else{diffuseColor.rgb=mix(diffuseColor.rgb,${linear('#a35b75')},(1.0-smoothstep(.22,.64,fold))*(1.0-smoothstep(.83,1.0,vUv.y)));}`;
      if(['frontera','candy','auratum','kuruma','claude','pinkmorning'].includes(name)){
       const small=['frontera','candy'].includes(name),spot=linear(name==='claude'?'#bb7543':name==='pinkmorning'?'#a05055':'#6f2939');
       paint+=`float specks=smoothstep(${small?'.86,.95':'.73,.88'},sin(vUv.x*81.0+sin(vUv.y*33.0))*cos(vUv.y*91.0+cos(vUv.x*39.0)))*(1.0-smoothstep(${small?'.34,.61':'.62,.95'},vUv.y));diffuseColor.rgb=mix(diffuseColor.rgb,${spot},specks*.90);`;
      }
      shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',paint+'\n#include <emissivemap_fragment>');
    }
    if(kind==='leaf-blueberry-wax')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.58,0.67,0.67),0.13+0.08*sin(vUv.x*199.0)*cos(vUv.y*173.0));\n#include <emissivemap_fragment>`);
    const surface=kind.replace(/-outside-[0-9a-f]{6}$/,'').replace(/-dahlia$/,'').replace(/-cranesbill-veins$/,'').replace(/-guide$/,'').replace('woolly-','').replace('glossy-','').replace('palm-','').replace('grass-',''),hex=surface.match(/-([0-9a-f]{6})$/)?.[1];
    const pattern=surface.replace(/^(leaf|petal|sepal|bract)-/,'').replace(/^hosta-?/,'').replace(/-(?:gold|[0-9a-f]{6})$/,'');
    const c=hex?new THREE.Color('#'+hex):null;
    const tint=c?`vec3(${c.r.toFixed(5)},${c.g.toFixed(5)},${c.b.toFixed(5)})`:kind.startsWith('petal')?'vec3(0.34,0.07,0.23)':kind.endsWith('-gold')?'vec3(0.70,0.69,0.32)':'vec3(0.79,0.83,0.72)';
    if(kind==='leaf-rugose'||kind.includes('brunnera'))shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float cells=pow(abs(sin(vUv.x*114.0+sin(vUv.y*93.0))*sin(vUv.y*127.0)),7.0);
      diffuseColor.rgb*=0.91+0.13*cells;
    `);
    if(kind.startsWith('petal-hyacinth-'))shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      float vein=pow(max(0.0,cos(atan(vUv.x-.5,vUv.y+.08)*31.0+sin(vUv.y*19.0)*.5)),24.0);
      diffuseColor.rgb*=1.0-.16*vein;
      ${kind==='petal-hyacinth-eye'?`float eye=length(vec2((vUv.x-.5)*3.8,(vUv.y-.66)*4.5));
      float halo=1.0-smoothstep(.72,1.20,eye);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.30,.19,.52),halo*.73);
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.92,.74,.13),1.0-smoothstep(.50,.65,eye));`:''}
      #include <emissivemap_fragment>`);
    if(kind==='leaf-marsilea')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      float band=smoothstep(.34,.40,vUv.y)*(1.0-smoothstep(.63,.72,vUv.y));
      float marsileaVeins=pow(max(0.0,cos(vUv.x*53.0+sin(vUv.y*19.0))),20.0);
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.19,.22,.09),band*.47);diffuseColor.rgb*=1.0+.16*marsileaVeins;
      #include <emissivemap_fragment>`);
    if(kind==='leaf-bacopa-veins')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      float bacopaFold=abs(vUv.x-.5)*2.0;float bacopaMidrib=1.0-smoothstep(.018,.070,bacopaFold);
      float side=pow(max(0.0,cos((vUv.y-bacopaFold*.28)*32.0)),22.0)*(1.0-smoothstep(.80,1.0,bacopaFold));
      float mesh=pow(max(0.0,cos(vUv.x*39.0+sin(vUv.y*34.0))*cos(vUv.y*43.0)),10.0);
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.73,.78,.46),max(max(bacopaMidrib,side)*.78,mesh*.30));
      #include <emissivemap_fragment>`);
    if(kind==='petal-wahlenbergia')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`float wahlVein=pow(max(0.0,cos(vUv.x*94.2478)),26.0);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.52,.56,.76),wahlVein*.35);
      #include <emissivemap_fragment>`);
    if(kind==='leaf-wahlenbergia')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`float wahlEdge=smoothstep(.94,.995,abs(vUv.x-.5)*2.0);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.77,.79,.62),wahlEdge*.76);
      #include <emissivemap_fragment>`);
    if(kind==='petal-bacopa')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      float vein=pow(max(0.0,cos(vUv.x*94.2478+sin(vUv.y*16.0)*.3)),25.0);diffuseColor.rgb*=1.0-.16*vein;
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.74,.73,.68),(1.0-smoothstep(.56,.70,vUv.y))*.27);
      #include <emissivemap_fragment>`);
    if(kind==='leaf-salvinia')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      vec2 cells=fract(vUv*vec2(21.0,32.0))-.5;float papilla=1.0-smoothstep(.10,.28,length(cells));
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.68,.75,.45),papilla*.24);
      #include <emissivemap_fragment>`);
    if(kind==='petal-primrose-lilac')shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float lace=max(max(smoothstep(0.82,0.98,abs(vUv.x-0.5)*2.0),1.0-smoothstep(0.18,0.52,vUv.y)),0.55*pow(max(0.0,cos(vUv.x*35.0+sin(vUv.y*11.0))),7.0));
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.85,0.83,0.77),lace);
    `);
    if(kind==='petal-primrose-stripe')shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float streak=pow(max(0.0,cos(vUv.x*23.0+sin(vUv.y*8.0)*0.6)),12.0);
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.86,0.81,0.78),streak*0.65);
    `);
    const masks={flamingoMargin:'smoothstep(.58+.12*sin(vUv.y*31.0)+.04*cos(vUv.y*63.0),.80,fold)',primroseEdge:'max(smoothstep(0.80,0.96,fold),smoothstep(0.94,0.99,vUv.y))',brunneraMargin:'smoothstep(0.70+0.12*sin(vUv.y*39.0),0.91,fold)',brunneraSilver:'max(max(midrib,pow(max(0.0,cos((vUv.y-fold*0.35)*39.0)),20.0)),0.34*pow(max(0.0,cos(vUv.x*91.0+sin(vUv.y*97.0)*1.4)*cos(vUv.y*117.0+sin(vUv.x*85.0))),12.0))',base:'1.0-smoothstep(0.18,0.52,vUv.y)',tip:'smoothstep(0.5,0.92,vUv.y)',blush:'(1.0-smoothstep(0.20,0.65,vUv.y))*(1.0-smoothstep(0.25,0.75,fold))',margin:'smoothstep(0.61+0.035*sin(vUv.y*53.0),0.79,fold)',center:'1.0-smoothstep(0.25+0.07*sin(vUv.y*36.0),0.47,fold)',stripes:'smoothstep(0.48,0.64,sin(vUv.x*39.0+sin(vUv.y*7.0)*0.65))',spots:'smoothstep(0.73,0.9,sin(vUv.x*79.0+cos(vUv.y*27.0))*sin(vUv.y*91.0+sin(vUv.x*47.0)))',silverVeins:'(1.0-midrib)*(1.0-smoothstep(0.16,0.33,abs(sin((vUv.y-fold*0.38)*32.0))))'};
    masks.mottle='smoothstep(0.23,0.69,sin(vUv.x*11.0+sin(vUv.y*9.0))*cos(vUv.y*13.0+sin(vUv.x*10.0)))';
    masks.canaryVeins='1.0-smoothstep(0.018,0.041,min(abs(vUv.x-0.5),abs(abs(vUv.x-0.5)-0.14)))';
    masks.mosaic='smoothstep(-0.12,0.23,sin(vUv.x*14.0+sin(vUv.y*9.0)*1.7)*cos(vUv.y*12.0+sin(vUv.x*7.0)*1.4)+0.15*sin(vUv.y*49.0+vUv.x*31.0))';
    masks.darkVeins='max(midrib,pow(max(0.0,cos((vUv.y-fold*0.40)*40.0)),24.0)*smoothstep(0.02,0.13,fold))';
    masks.gaillardiaYellowRim='1.0-smoothstep(0.78+0.025*sin(vUv.x*38.0),0.86,vUv.y)';
    masks.gaillardiaRedBase='1.0-smoothstep(0.40+0.06*cos(vUv.x*29.0),0.52,vUv.y)';
    masks.rhododendronRim='smoothstep(0.79+0.025*sin(vUv.x*94.2),0.97,vUv.y)';
    masks.rhododendronThroat='1.0-smoothstep(0.27,0.73,vUv.y)';
    masks.kalmiaBand='smoothstep(0.65,0.76,vUv.y)*(1.0-smoothstep(0.91,0.99,vUv.y))*smoothstep(-0.28,0.19,sin(vUv.x*31.416)+0.6*sin(vUv.x*319.0)*cos(vUv.y*303.0))';
    masks.leucothoeMarble='smoothstep(-0.46,0.0,sin(vUv.x*13.0+sin(vUv.y*8.0)*1.6)*cos(vUv.y*14.0)+0.32*sin(vUv.x*117.0)*cos(vUv.y*131.0))';
    if(kind==='petal-muscari-mouth')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`float mouth=smoothstep(.89,.95,vUv.y);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.88,.87,.79),mouth*.85);\n#include <emissivemap_fragment>`);
    if(kind.startsWith('petal-freesia-')){
      const tone=new THREE.Color('#'+kind.split('-')[2]),rgb=`vec3(${tone.r.toFixed(5)},${tone.g.toFixed(5)},${tone.b.toFixed(5)})`;
      shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`float throat=(1.0-smoothstep(.12,.62,vUv.y))*(1.0-smoothstep(.20,.78,fold));diffuseColor.rgb=mix(diffuseColor.rgb,${rgb},throat*.85);${kind.endsWith('-veins')?'float freesiaVeins=pow(max(0.0,cos(atan(vUv.x-.5,vUv.y+.10)*28.0)),30.0)*(1.0-smoothstep(.18,.58,vUv.y));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.42,.09,.065),freesiaVeins*.80);':''}\n#include <emissivemap_fragment>`);
    }
    if(kind.startsWith('petal-iris-')){
      const iris=kind.slice(11),fall=iris.endsWith('-fall'),name=iris.replace(/-(fall|standard)$/,'');
      const wash=name==='frozen'?'vec3(0.46,0.59,0.74)':name==='hodgkin'?'vec3(0.26,0.42,0.53)':'vec3(0.32,0.42,0.60)';
      let paint='';
      if(name==='batik')paint='float streak=sin(vUv.x*53.0+sin(vUv.y*11.0)*1.3)+0.5*sin(vUv.x*113.0-vUv.y*7.0);float bands=smoothstep(-0.70,0.22,streak+0.85*sin(vUv.y*17.0+vUv.x*13.0));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.23,0.047,0.43),bands);';
      else if(name==='tuberosa'&&fall)paint='float velvet=smoothstep(0.49,0.56,vUv.y);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.025,0.023,0.032),velvet);';
      else if(name==='blackberry')paint='float flecks=smoothstep(0.64,0.88,sin(vUv.x*61.0+sin(vUv.y*27.0))*cos(vUv.y*49.0+sin(vUv.x*19.0)));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.43,0.047,0.021),flecks);';
      else{
       if(['painted','hodgkin','frozen'].includes(name))paint+=`float blue=smoothstep(${name==='hodgkin'?'0.10,0.80':'0.56,0.97'},vUv.y);diffuseColor.rgb=mix(diffuseColor.rgb,${wash},blue*${name==='frozen'?'0.28':'0.23'});`;
       if(['painted','hodgkin'].includes(name))paint+='float lines=pow(max(0.0,cos(atan((vUv.x-.5)*.7,vUv.y+.02)*72.0+sin(vUv.y*20.0)*.35)),23.0);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.18,0.28,0.41),lines*smoothstep(.18,.92,vUv.y)*.50);';
       if(fall&&['gold','painted','hodgkin','dietes'].includes(name))paint+='float signal=(1.0-smoothstep(.10,.25,abs(vUv.x-.5)))*smoothstep(.16,.30,vUv.y)*(1.0-smoothstep(.55,.71,vUv.y));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.73,.47,.065),signal*.90);';
       if(fall&&['painted','hodgkin','dietes'].includes(name))paint+='float dots=smoothstep(.65,.87,sin(vUv.x*69.0+cos(vUv.y*43.0))*cos(vUv.y*71.0+sin(vUv.x*29.0)))*(1.0-smoothstep(.48,.81,vUv.y));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.13,.17,.22),dots*.90);';
      }
      shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',paint+'\n#include <emissivemap_fragment>');
    }
    if(kind==='sepal-celosia-velvet')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`diffuseColor.rgb*=0.92+0.08*sin(vUv.x*499.0)*cos(vUv.y*401.0);\n#include <emissivemap_fragment>`);
    if(kind.startsWith('petal-balloon'))shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`float balloonRib=pow(max(0.0,cos(vUv.x*31.4159)),40.0);float fineRib=pow(max(0.0,cos(vUv.x*219.91+sin(vUv.y*24.0)*0.7)),28.0)*smoothstep(0.15,0.75,vUv.y);diffuseColor.rgb*=0.70+0.30*vUv.y-0.20*balloonRib-0.07*fineRib;${kind.endsWith('splash')?'float splash=smoothstep(0.51,0.66,sin(vUv.x*42.0+sin(vUv.y*9.0)*0.4)*cos(vUv.x*27.0-vUv.y*1.4));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.18,0.10,0.38),splash*0.85);':''}\n#include <emissivemap_fragment>`);
    if(kind==='petal-soapwort-veins')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`diffuseColor.rgb*=1.0-0.28*pow(max(0.0,cos(atan(vUv.x-0.5,vUv.y+0.02)*22.0)),20.0)*(1.0-smoothstep(0.15,0.65,vUv.y));\n#include <emissivemap_fragment>`);
    if(kind.startsWith('leaf-porcelain'))shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`float patches=smoothstep(-0.18,0.30,sin(vUv.x*15.0+sin(vUv.y*11.0)*1.7)*cos(vUv.y*13.0+sin(vUv.x*17.0))+0.16*sin(vUv.x*61.0+vUv.y*43.0));diffuseColor.rgb=mix(diffuseColor.rgb,mix(vec3(0.83,0.83,0.74),vec3(0.79,0.45,0.52),smoothstep(0.35,0.75,sin(vUv.x*8.0+vUv.y*9.0))),patches*${kind.endsWith('faint')?'0.18':'0.92'});\n#include <emissivemap_fragment>`);
    if(masks[pattern])shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`diffuseColor.rgb=mix(diffuseColor.rgb,${tint},(${masks[pattern]})*${pattern==='mottle'?'0.34':'0.86'});\n#include <emissivemap_fragment>`);
    const outsideHex=kind.match(/-outside-([0-9a-f]{6})$/)?.[1];
    if(kind.includes('-dahlia'))shader.fragmentShader=shader.fragmentShader.replace('cos((vUv.y-fold*0.33)*75.0)','cos(vUv.x*61.0+sin(vUv.y*8.0)*0.45)');
    if(kind.startsWith('leaf-grass'))shader.fragmentShader=shader.fragmentShader.replace('cos((vUv.y-fold*0.33)*75.0)','cos(vUv.x*69.0)');
    if(outsideHex){const out=new THREE.Color('#'+outsideHex);shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`if(${kind.includes('-dahlia')?'!':''}gl_FrontFacing)diffuseColor.rgb=mix(diffuseColor.rgb,vec3(${out.r.toFixed(5)},${out.g.toFixed(5)},${out.b.toFixed(5)}),0.92);\n#include <emissivemap_fragment>`);}
    if(kind==='petal-enkianthus-veins')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`float enkVeins=pow(max(0.0,cos(vUv.x*125.664+sin(vUv.y*8.0)*0.4)),28.0);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.48,0.11,0.22),0.55*enkVeins+0.23*smoothstep(0.72,0.99,vUv.y));\n#include <emissivemap_fragment>`);
    if(kind.startsWith('leaf-palm'))shader.fragmentShader=shader.fragmentShader.replace('float midrib=1.0-smoothstep(0.012,0.025,abs(vUv.x-0.5));',`vec2 palm=vec2(vUv.x-0.5,vUv.y-0.22);float radial=abs(sin(atan(palm.x,palm.y)*3.0))*length(palm);float midrib=1.0-smoothstep(0.002,0.008,radial);`);
    if(kind.endsWith('-cranesbill-veins'))shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`float petalVeins=pow(max(0.0,cos(atan(vUv.x-0.5,vUv.y+0.08)*19.0+sin(vUv.y*8.0)*0.13)),35.0);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.14,0.055,0.17),petalVeins*0.58*smoothstep(0.04,0.18,vUv.y));\n#include <emissivemap_fragment>`);
    if(kind==='petal-snowdrop-inner'||kind==='petal-snowdrop-outer')shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`float mark=smoothstep(0.53,0.61,vUv.y)*(1.0-smoothstep(0.78,0.89,vUv.y))* (1.0-smoothstep(0.21,0.35,abs(vUv.x-0.5)));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.17,0.34,0.08),mark);\n#include <emissivemap_fragment>`);
    if(kind.endsWith('-guide'))shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`float guide=(1.0-smoothstep(0.20,0.57,vUv.y))*pow(max(0.0,cos(atan(vUv.x-0.5,vUv.y+0.02)*16.0)),20.0);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.10,0.035,0.13),guide*0.85);\n#include <emissivemap_fragment>`);
    if(kind==='leaf-scaly')shader.fragmentShader=shader.fragmentShader.replace('veins*0.055','veins*0.025+pow(max(0.0,sin(vUv.x*211.0)*cos(vUv.y*193.0)),10.0)*0.18');
    if(kind==='leaf-astelia'){
      shader.fragmentShader=shader.fragmentShader.replace('veins*0.055','pow(max(0.0,cos(vUv.x*90.0)),12.0)*0.20+pow(max(0.0,sin(vUv.x*211.0)*cos(vUv.y*193.0)),10.0)*0.16');
      shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.57,0.58,0.53),0.52*pow(max(0.0,cos(vUv.x*39.0+sin(vUv.y*6.0)*0.15)),3.0));\n#include <emissivemap_fragment>`);
    }
    if(kind.includes('woolly'))shader.fragmentShader=shader.fragmentShader.replace('veins*0.055','veins*0.025+pow(max(0.0,sin(vUv.x*411.0+vUv.y*149.0)*cos(vUv.y*337.0)),6.0)*0.16');
    if(kind.includes('-underside-')&&c)shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`if(!gl_FrontFacing)diffuseColor.rgb=mix(diffuseColor.rgb,${tint},0.80);\n#include <emissivemap_fragment>`);
    // A small transmitted-light approximation softens thin leaf undersides.
    shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
      totalEmissiveRadiance+=diffuseColor.rgb*${kind.startsWith('petal')?'0.075':'0.10'};
    `);
  }else if(kind.startsWith('wood')){
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float ridges=sin(vUv.x*71.0+sin(vUv.y*23.0)*0.8)*sin(vUv.x*33.0-vUv.y*4.0);
      diffuseColor.rgb*=0.84+0.16*ridges;
    `);
    if(kind==='wood-smooth')shader.fragmentShader=shader.fragmentShader.replace('0.84+0.16*ridges','0.96+0.04*ridges');
    if(kind==='wood-lichen')shader.fragmentShader=shader.fragmentShader.replace('diffuseColor.rgb*=0.84+0.16*ridges;',`float lichenMask=sin(vUv.x*21.0+sin(vUv.y*53.0))*sin(vUv.y*37.0+cos(vUv.x*17.0));
      diffuseColor.rgb=mix(diffuseColor.rgb*(0.94+0.06*ridges),vec3(0.55,0.60,0.51),smoothstep(0.10,0.48,lichenMask)*0.82);`);
    if(kind==='wood-lenticels')shader.fragmentShader=shader.fragmentShader.replace('0.84+0.16*ridges','0.92-0.23*pow(max(0.0,sin(vUv.y*147.0+sin(vUv.x*24.0))),18.0)');
    if(kind==='wood-birchPaper')shader.fragmentShader=shader.fragmentShader.replace('diffuseColor.rgb*=0.84+0.16*ridges;',`float lenticel=pow(max(0.0,sin(vUv.y*183.0+floor(vUv.x*19.0)*1.7)),34.0)*smoothstep(-0.15,0.50,sin(vUv.x*63.0));
      float peel=smoothstep(0.75,0.96,sin(vUv.y*31.0+sin(vUv.x*8.0)*0.6))*smoothstep(0.1,0.6,sin(vUv.x*16.0));
      diffuseColor.rgb=diffuseColor.rgb*(0.96+0.04*ridges)*(1.0-lenticel*0.65);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.57,0.49,0.40),peel*0.35);`);
    if(kind==='wood-peeling'||kind==='wood-scaly')shader.fragmentShader=shader.fragmentShader.replace('0.84+0.16*ridges','0.82+0.18*sin(floor(vUv.x*17.0)*13.0+floor(vUv.y*27.0)*5.0)');
  }
}
const materialCache=new Map();
function material(kind){
  if(materialCache.has(kind))return materialCache.get(kind);
  const m=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:kind.startsWith('fruit-glossy')?.32:kind.startsWith('leaf-glossy')?.42:kind.startsWith('leaf')||kind==='maple'?.76:.88,side:THREE.DoubleSide});
  m.defines={USE_UV:''};m.onBeforeCompile=s=>windShader(s,kind);m.customProgramCacheKey=()=>`garden-0.3-${kind}`;
  materialCache.set(kind,m);sharedMaterials.add(m);return m;
}
const depth=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,side:THREE.DoubleSide});depth.onBeforeCompile=s=>windShader(s,'depth');depth.customProgramCacheKey=()=> 'garden-wind-depth-0.3';sharedMaterials.add(depth);
const dummy=new THREE.Object3D(),up=new THREE.Vector3(0,1,0),colour=new THREE.Color();
export function batch(group,height=1,flex=.06,phase=0){
  const entries=new Map();
  function push(geometry,kind,matrix,color,flutter=0){
    const key=geometry.uuid+kind;if(!entries.has(key))entries.set(key,{geometry,kind,items:[],colors:[],wind:[]});const e=entries.get(key);e.items.push(matrix.clone());colour.set(color);e.colors.push(colour.clone());e.wind.push(height,flex,phase,flutter);
  }
  function add(shape,kind,color,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0){
    dummy.position.set(x,y,z);dummy.scale.set(sx,sy,sz);dummy.rotation.set(rx,ry,rz,'YXZ');dummy.updateMatrix();push(typeof shape==='string'?shapes[shape]:shape,kind,dummy.matrix,color,['leaf-salvinia','leaf-marsilea','leaf-coin-glossy'].includes(kind)?0:kind.startsWith('leaf')||kind.startsWith('petal')||kind.startsWith('sepal')||kind.startsWith('bract-')||['maple','grass'].includes(kind)?1:0);
  }
  function branch(a,b,r,color,kind='wood'){
    const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),dir=vb.clone().sub(va),length=dir.length();if(length<.0001)return;
    const matrix=new THREE.Matrix4().compose(va.add(vb).multiplyScalar(.5),new THREE.Quaternion().setFromUnitVectors(up,dir.normalize()),new THREE.Vector3(r,length,r));push(stem,kind,matrix,color);
  }
  return {add,branch,finish({castShadow=true}={}){for(const e of entries.values()){
    // Wind parameters belong to this mesh; shared shape buffers remain immutable.
    const geometry=e.geometry.clone();geometry.setAttribute('gardenWind',new THREE.InstancedBufferAttribute(new Float32Array(e.wind),4));
    const mesh=new THREE.InstancedMesh(geometry,material(e.kind),e.items.length);mesh.userData.component=e.kind;e.items.forEach((m,i)=>{mesh.setMatrixAt(i,m);mesh.setColorAt(i,e.colors[i]);});mesh.customDepthMaterial=depth;mesh.castShadow=castShadow&&!e.kind.endsWith('-pampas-fiber')&&!['bristle','seedBristle'].includes(e.kind);mesh.receiveShadow=!e.kind.endsWith('-pampas-fiber')&&!['bristle','seedBristle'].includes(e.kind);mesh.computeBoundingSphere();mesh.boundingSphere.radius+=Math.min(height,3)*flex*2+.03;group.add(mesh);
  }}};
}
const palette=(rand,base,variation=.09)=>{const c=new THREE.Color(base);c.offsetHSL((rand()-.5)*.04,(rand()-.5)*.1,(rand()-.5)*variation);return c;};
function petalFlower(b,x,y,z,r,color,rand,layers=1,petals=null){
  for(let layer=0;layer<layers;layer++)for(let k=0;k<(petals||(layers>1?7:11));k++){
    const a=k*Math.PI*2/(petals||(layers>1?7:11))+layer*.6,length=r*(1-layer*.19)*(1+(rand()-.5)*.14);
    b.add('petal','petal',palette(rand,color,.055),x+Math.sin(a)*r*.11,y+layer*r*.07,z+Math.cos(a)*r*.11,length*.37,length,length,Math.PI/2+(layers>1?-.18-layer*.15:.2),a,0);
  }
  b.add(layers>1?bud:cone,'seed',layers>1?'#bd9572':'#926025',x,y+(layers>1?.005:r*.14),z,r*.22,r*(layers>1?.09:.35),r*.22);
}
// Connected forks and opposite pairs of petioles replace floating leaf clouds.
function mapleModel(b,p,s,view,detail,clipped,info){
  const h=s.height,w=s.spread,rand=random(p.id*3001+11),trunk=info.appearance?.barkColor||'#888476',woodKind=info.appearance?.barkPattern?'wood-'+info.appearance.barkPattern:'wood';
  const point=(a,r,y)=>[Math.sin(a)*r,y,Math.cos(a)*r];
  const mix=(a,c,t)=>a.map((v,i)=>v+(c[i]-v)*t);
  const curved=(points,r,color)=>{
    for(let i=1;i<points.length;i++)b.branch(points[i-1],points[i],r*Math.pow(.66,i-1),color,woodKind);
  };
  const foot=[0,0,0],fork=[w*.014,s.trunkHeight,-w*.009],trunkRadius=Math.max(.009,s.natural.height*.010);
  curved([foot,[-w*.014,s.trunkHeight*.48,w*.006],fork],trunkRadius,trunk);
  // A few surface roots anchor the stem without adding a skirt of trunk polygons.
  for(let i=0;i<4;i++){const a=i*1.57+rand()*.3;curved([[0,.025,0],point(a,trunkRadius*2.3,.012),point(a,trunkRadius*3.5,0)],trunkRadius*.36,trunk);}
  const orientation=rand()*Math.PI*2,crownH=Math.max(.12,h-s.trunkHeight);
  const leafLength=Math.min(.072,Math.max(.042,w*.075));
  const twigCount=Math.max(4,Math.min(30,Math.round((3+w*6.4)*Math.pow(detail,.85))));
  const nodeCount=Math.max(3,Math.min(14,Math.round((3+w*2.4)*Math.pow(detail,.85))));
  for(let leader=0;leader<3;leader++){
    const rand=random(p.id*7907+leader*601+3),a=orientation+leader*Math.PI*2/3+(rand()-.5)*.3;
    const tipY=h-leafLength*.25-crownH*(leader===0?0:leader===1?.13:.22);
    const end=point(a,w*(leader===0?.10:.22),tipY);
    const elbow=point(a,w*.08,s.trunkHeight+crownH*.46);
    curved([fork,mix(fork,elbow,.5),elbow,mix(elbow,end,.55),end],trunkRadius*.67,trunk);
    for(let pair=0;pair<3;pair++)for(const side of [-1,1]){
      const rr=random(p.id*13007+leader*503+pair*73+(side+1)*19);
      const t=.15+pair*.32+rr()*.10+leader*.018,origin=t<.46?mix(fork,elbow,t/.46):mix(elbow,end,(t-.46)/.54);
      const angle=a+side*(.78+rr()*.35),extent=w*(.36-pair*.035)*(clipped?.90:1);
      const target=point(angle,extent,Math.min(h-leafLength*.55,origin[1]+crownH*(.12+rr()*.045)));
      const middle=mix(origin,target,.56);middle[1]+=.02*crownH;
      curved([origin,mix(origin,middle,.5),middle,target],Math.max(.0025,trunkRadius*.31)*(1-pair*.16),trunk);
      for(let j=0;j<twigCount;j++){
        const tr=random(p.id*17011+leader*887+pair*211+(side+1)*53+j*17);
        const at=.25+.72*(j+.5)/twigCount,attach=at<.56?mix(origin,middle,at/.56):mix(middle,target,(at-.56)/.44);
        const yaw=angle+(j%2?1:-1)*(.65+tr()*.55),length=Math.min(w*.21,.12+w*.11)*(.65+tr()*.5);
        const shoot=[attach[0]+Math.sin(yaw)*length,Math.min(h-leafLength*.5,attach[1]+crownH*(.015+tr()*.14)),attach[2]+Math.cos(yaw)*length];
        const radius=Math.hypot(shoot[0],shoot[2]),maxRadius=Math.max(.02,w/2-leafLength*.9);
        if(radius>maxRadius){shoot[0]*=maxRadius/radius;shoot[2]*=maxRadius/radius;}
        const joint=mix(attach,shoot,.52);joint[1]+=.012;
        curved([attach,joint,shoot],Math.min(.003,Math.max(.0007,w*.0015)),view.month<5?'#927458':'#7d7955');
        for(let node=0;node<nodeCount;node++)for(const leafSide of [-1,1]){
          const leafRand=random(p.id*19001+leader*971+pair*241+(side+1)*67+j*29+node*7+(leafSide+1));
          const pos=mix(joint,shoot,(node+.25)/nodeCount),leafYaw=yaw+leafSide*(.9+leafRand()*.35),size=leafLength*(.80+leafRand()*.36);
          const stemLength=size*(.4+leafRand()*.2),pitch=.88+leafRand()*1.15;
          const petiole=[pos[0]+Math.sin(leafYaw)*stemLength,pos[1]+size*(leafRand()*.58-.20),pos[2]+Math.cos(leafYaw)*stemLength];
          if(clipped&&Math.hypot(petiole[0],petiole[2])>w*.48)continue;
          b.branch(pos,petiole,Math.max(.00035,size*.006),'#897b4e','petiole');
          const roll=(leafRand()-.5)*.22;
          const base=s.autumn?(leafRand()>.45?'#b95427':'#be7929'):view.month<5?'#81a047':'#638536';
          b.add(detail<.7?'mapleLow':'maple','maple',palette(leafRand,base,.075),...petiole,size,size,size,pitch,leafYaw,roll);
        }
      }
    }
    // A light terminal spray keeps the central leader from ending in a bare spike.
    for(let k=0;k<12;k++){
      const aa=a+k*2.4,at=mix(elbow,end,.82+k*.014),size=leafLength*(.7+rand()*.2),petiole=[at[0]+Math.sin(aa)*size*.45,at[1],at[2]+Math.cos(aa)*size*.45];
      b.branch(at,petiole,.00045,'#897b4e','petiole');b.add(detail<.7?'mapleLow':'maple','maple',palette(rand,s.autumn?'#b8642c':'#719243',.07),...petiole,size,size,size,1.45+rand()*.2,aa,0);
    }
  }
}
export function plantModel(p,view,detail=1){
  const s=stateAt(p,view),info=plantInfo(p.kind),g=new THREE.Group();g.userData.plantId=p.id;if(!s.present)return g;
  if(s.groundDormant){g.userData.groundDormant=true;return g;}
  const rand=random(p.id),h=s.height,w=s.spread,lh=s.leafHeight,form=info.form;
  const profile=treeProfile(info),woody=!!profile||['maple','olive'].includes(form),flex=woody?.025:form==='grass'?.105:.065,b=batch(g,h,flex,p.id*1.73);
  const dormant=s.dormant,clipped=p.management?.method==='trim'&&s.last&&!s.unsupported;
  if(form==='unmodeled'){
    const frame=new THREE.Mesh(new THREE.BoxGeometry(w,h,w),new THREE.MeshBasicMaterial({color:'#aeb5a3',wireframe:true,transparent:true,opacity:.42}));frame.position.y=h/2;g.add(frame);g.userData.unmodeled=true;
  }else if(['saltbush','gardeniaShrub','limeFelt','pityrodia','dustyMiller','wireVine','hatsuyuki','blueberryCanes','rhododendronTruss','fineAzalea','terminalPieris','kalmiaCluster','tieredEnkianthus','archingLeucothoe','hydrangeaVine','porcelainVine','silverBush','berzelia','wireShrub','mirrorShrub','myrtleShrub','eremophila','mintBush','blueButterfly','bridalVeil','roseGlory','blueEyeShrub'].includes(info.appearance?.architecture)){g.userData.architecture=info.appearance.architecture;drawDetailedHerb(b,{info,s,p,detail,rand},{bud,cone,shade:palette});
  }else if(profile&&form!=='maple'){g.userData.architecture=drawTree(b,{profile,info,p,s,detail},{bud,flower:petalFlower,detailedFlower,shade:palette});
  }else if((form==='botanical'||['fivepetal','airy','spike','bell','globe'].includes(form))&&info.appearance?.leafShape){drawDetailedHerb(b,{info,s,p,detail,rand},{bud,cone,shade:palette});
  }else if(info.appearance?.architecture==='tessen'){drawDetailedHerb(b,{info,s,p,detail,rand},{bud,cone,shade:palette});
  }else if(EXTENDED_FORMS.has(form)){drawBotanical(b,{info,s,p,detail,rand},{bud,cone,flower:petalFlower,detailedFlower,shade:palette,foliageKind});
  }else if(form==='maple'){mapleModel(b,p,s,view,detail,clipped,info);
  }else if(woody){
    const base=form==='olive'?'#738569':s.autumn?'#ae542a':view.month<5?'#6f8b3f':'#4f7033';
    const forkY=s.trunkHeight,topY=Math.max(forkY,h*.74),trunkColor=form==='olive'?'#807863':'#71664e';
    const trunk=[[0,0,0],[-w*.012,forkY*.55,w*.01],[w*.022,forkY,w*.012],[w*.045,topY,-w*.026]];
    for(let j=1;j<trunk.length;j++)b.branch(trunk[j-1],trunk[j],Math.max(.013,s.natural.height*.016)*(1-(j-1)*.22),trunkColor);
    const branchCount=form==='olive'?13:12;
    for(let i=0;i<branchCount;i++){const rand=random(p.id*100003+i*1021+23);
      const a=i*2.399+rand()*.4,level=(i+.5)/branchCount,crownBase=Math.min(forkY,h*.45),crownH=h-crownBase;
      const ring=(.85-.45*level)*(clipped?.88:1),x=Math.cos(a)*w*.47*ring,z=Math.sin(a)*w*.47*ring,y=crownBase+crownH*(.25+level*.58);
      const start=[w*.02*(1-level),forkY+(topY-forkY)*level*.55,0],mid=[x*.45,(start[1]+y)*.48,z*.42];
      b.branch(start,mid,Math.max(.005,h*.008)*(1-level*.55),trunkColor);b.branch(mid,[x,y,z],Math.max(.003,h*.004),trunkColor);
      const twigs=Math.max(4,Math.round(Math.min(20,Math.max(6,w*5))*detail));
      for(let j=0;j<twigs;j++){const rand=random(p.id*100003+i*1021+j*43+5);
        const ta=j*2.399+rand(),r=Math.sqrt(rand())*w*(.16+level*.04),tx=x+Math.cos(ta)*r,tz=z+Math.sin(ta)*r,ty=Math.min(h-.04,y+(rand()-.2)*crownH*.25);
        const tip=[tx,ty,tz],joint=[x+(tx-x)*.35,y+(ty-y)*.3,z+(tz-z)*.35];
        b.branch([x,y,z],joint,Math.max(.0015,h*.0009),trunkColor);b.branch(joint,tip,Math.max(.001,h*.00055),trunkColor);
        if(dormant)continue;
        const count=Math.max(8,Math.round(Math.min(30,Math.max(10,w*9))*detail)),leafSize=form==='olive'?.105:.12;
        for(let k=0;k<count;k++){
          const t=rand(),aa=k*2.399+ta,rr=Math.sqrt(rand())*Math.min(.22,w*.095),xx=tx+Math.cos(aa)*rr,zz=tz+Math.sin(aa)*rr,yy=Math.min(h-.045,ty+(rand()-.45)*Math.min(.3,crownH*.2));
          if(clipped&&Math.hypot(xx,zz)>w*.48)continue;
          const size=leafSize*(.72+rand()*.5);
          b.add(form==='maple'?'maple':'narrow','leaf',palette(rand,base,.13),xx,yy,zz,size,size, size, -.45+rand()*1.4,aa,rand()*.7-.35);
        }
      }
    }
  }else if(['rose','hydrangea'].includes(form)){
    const n=Math.max(6,Math.round(Math.min(60,Math.max(10,w*w*65))*detail)),base=form==='rose'?'#47643a':'#587440';
    for(let i=0;i<n;i++){const rand=random(p.id*100003+i*1021+41);
      const a=i*2.399+rand()*.3,r=w*.39*Math.sqrt(rand()),x=Math.cos(a)*r,z=Math.sin(a)*r,y=h*(.52+rand()*.38),origin=[x*.18,0,z*.18];
      b.branch(origin,[x*.6,y*.48,z*.65],.005,'#687042');b.branch([x*.6,y*.48,z*.65],[x,y,z],.003,'#5e743f');
      if(dormant)continue;
      for(let j=0;j<5;j++){
        const t=.22+j*.14,an=a+j*2.2,sz=(form==='rose'?.07:.16)*(.8+rand()*.3);
        const lx=x*t+Math.sin(an)*.025,lz=z*t+Math.cos(an)*.025;
        b.add('leaf','leaf',palette(rand,base),lx,y*t,lz,sz,sz*(form==='rose'?1.4:1.3),sz,-.15+rand()*.5,an,.25);
        if(form==='rose')for(const sign of [-1,1])b.add('leaf','leaf',palette(rand,base),lx+Math.sin(an+sign*.6)*sz*.45,y*t+.02,lz+Math.cos(an+sign*.6)*sz*.45,sz*.7,sz,sz,.35,an+sign*.6,0);
      }
      if(s.bloom){if(form==='rose'){petalFlower(b,x,y,z,.065*(.8+rand()*.3),info.flower,rand,3);if(i%3===0)petalFlower(b,x+.05,y-.025,z-.035,.048,info.flower,rand,3);}else{
        const florets=Math.max(18,Math.round(42*detail));for(let j=0;j<florets;j++){const t=j/florets,an=j*2.399,rr=.1*(1-t)*Math.sqrt(rand()),xx=x+Math.cos(an)*rr,zz=z+Math.sin(an)*rr,yy=y+t*.2;for(let k=0;k<4;k++)b.add('petal','petal',palette(rand,view.month>=9?'#ba9e9c':'#dce4b4',.09),xx,yy,zz,.022,.025,.025,1.1,k*Math.PI/2,0);}
      }}
    }
  }else if(form==='hosta'){
    if(!dormant){const count=Math.max(10,Math.round(Math.min(42,Math.max(12,w*w*42))*detail));for(let i=0;i<count;i++){const rand=random(p.id*100003+i*1021+71);
      const a=i*2.399,t=(i+.5)/count,r=w*.16*Math.sqrt(t),x=Math.sin(a)*r,z=Math.cos(a)*r,y=lh*(.72-t*.32),length=Math.min(.45,w*.43,info.appearance?.leafLength||Math.max(.12,w*.38))*(.76+t*.24);
      const shape=info.appearance?.leafShape==='narrow'?'narrow':info.appearance?.leafRelief==='corrugated'?'hostaCorrugated':info.appearance?.leafRelief==='ruffled'?'hostaRuffled':'hosta';
      b.branch([0,0,0],[x,y,z],.004,info.appearance?.stemColor||'#7c9064','petiole');b.add(shape,foliageKind(info),palette(rand,s.leafColor||'#6b8675',.06),x,y,z,length*.85,length,length,.72+t*.70,a,(rand()-.5)*.13);
    }if(s.bloom)for(let i=0;i<5;i++){const x=(rand()-.5)*w*.45,z=(rand()-.5)*w*.45;b.branch([x*.5,0,z*.5],[x,h*.96,z],.003,'#7c9064','petiole');for(let j=0;j<7;j++){const a=j*2.4;detailedFlower(b,{x:x+Math.sin(a)*.025,y:yClamp(h-j*.035),z:z+Math.cos(a)*.025,r:.035,color:info.flower,shape:'trumpet',petals:6,tilt:2.3},{bud,rand,shade:palette});}}}
  }else if(form==='grass'){
    const base=(info.leaf==='grass'||info.leaf==='herb'||info.leaf==='deciduous')&&(s.winter||s.autumn)?'#b3a176':info.leafColor||'#749386',count=Math.max(32,Math.round(Math.min(260,Math.max(48,w*w*250))*detail));
    for(let i=0;i<count;i++){const rand=random(p.id*100003+i*1021+71);
      const a=i*2.399,r=w*.18*Math.sqrt(rand()),x=Math.cos(a)*r,z=Math.sin(a)*r,height=lh*(.65+rand()*.35),length=height/.9;
      b.add('blade','grass',palette(rand,base,.12),x,0,z,.11,length,Math.min(w*.65,length*.56),.03+rand()*.12,a,0);
      if((s.bloom||info.leaf==='grass'&&(view.month>=7||view.month<=2))&&i%5===0){const top=h*(.78+rand()*.2),xx=x+Math.sin(a)*w*.18,zz=z+Math.cos(a)*w*.18;b.branch([x,0,z],[xx,top,zz],.0014,base,'grass');for(let j=0;j<10;j++){const an=j*2.399,rr=.035+rand()*.045,end=[xx+Math.sin(an)*rr,top-j*.011,zz+Math.cos(an)*rr];b.branch([xx,top-.16,zz],end,.00065,'#a39478','grass');b.add(bud,'seed',palette(rand,'#bfa5a0',.08),...end,.004,.011,.004);}}
    }
  }else{
    const count=Math.max(8,Math.round(Math.min(110,Math.max(12,w*w*110))*detail)),winterHeads=dormant&&['daisy','sedum'].includes(form),base=form==='lavender'?'#7b8870':'#50713b';
    for(let i=0;i<count;i++){const rand=random(p.id*100003+i*1021+71);
      const a=i*2.399,r=w*.34*Math.sqrt(rand()),x=Math.cos(a)*r,z=Math.sin(a)*r,y=h*(.65+rand()*.31),mid=[x*.5,lh*.45,z*.6];
      if(!dormant){b.branch([x*.15,0,z*.15],mid,.0017,base,'grass');for(let j=0;j<5;j++){
        const t=j/5,an=a+j*2.39,yy=lh*(.12+t*.65),sz=form==='lavender'?.065:form==='sedum'?.07:Math.min(.16,lh*.65);
        if(form==='sedum')b.add(bud,'leaf',palette(rand,base),x*.8,yy,z*.8,sz*.55,sz*.16,sz*.32,.25,an,.4);
        else b.add(form==='lavender'?'narrow':'leaf','leaf',palette(rand,base),x*.6,yy,z*.6,sz*.7,sz,sz,.75,an,0);
      }}
      if(s.bloom||winterHeads){const top=[x,y,z];b.branch([x*.15,0,z*.15],mid,.0018,winterHeads?'#887453':base,'grass');b.branch(mid,top,.0014,winterHeads?'#887453':base,'grass');
        if(form==='daisy'){if(s.bloom)petalFlower(b,x,y,z,.07*(.8+rand()*.3),info.flower,rand);else b.add(cone,'seed','#746246',x,y,z,.02,.038,.02);}
        else if(form==='sedum'){for(let k=0;k<16;k++){const an=k*2.399,rr=.06*Math.sqrt(k/16);b.add(bud,'petal',palette(rand,winterHeads?'#927559':info.flower,.1),x+Math.cos(an)*rr,y+(rand()-.5)*.012,z+Math.sin(an)*rr,.015,.011,.015);}}
        else{for(let k=0;k<12;k++){const an=k*2.399,t=k/12,rr=.014*(1-t*.55);b.add(bud,'petal',palette(rand,info.flower,.12),x+Math.cos(an)*rr,y+t*.085,z+Math.sin(an)*rr,.009*(1-t*.45),.008,.009*(1-t*.45));}}
      }
    }
  }
  b.finish();
  if(form==='maple'){
    // Use the same full-leaf envelope in every season; remove deciduous parts afterwards.
    g.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(g),radius=Math.max(Math.abs(bounds.min.x),Math.abs(bounds.max.x),Math.abs(bounds.min.z),Math.abs(bounds.max.z));
    if(radius>0&&bounds.max.y>0){const horizontal=w/(2*radius);g.scale.set(horizontal,h/bounds.max.y,horizontal);}
    if(dormant)for(const mesh of [...g.children])if(['garden-0.3-maple','garden-0.3-petiole'].includes(mesh.material?.customProgramCacheKey())){g.remove(mesh);mesh.geometry.dispose();mesh.dispose();}
  }
  if((!profile||form==='maple')&&!['roseaSpire','rugosaSpire','libertiaFans','anthericumPanicle','tofieldiaRaceme','ornithogalumRaceme','rhodoxisClump','siculumUmbel','aristeaFans','chloranthus','acaenaMat','woodPoppy','anemonopsis','nigella','yellowNigella','larkspur'].includes(info.appearance?.architecture)){
    // Thin the same deterministic leaf set through budbreak and leaf-fall.
    for(const mesh of [...g.children]){
      const kind=mesh.material?.customProgramCacheKey?.();
      if(!mesh.isInstancedMesh||!(kind?.startsWith('garden-0.3-leaf')||['garden-0.3-maple','garden-0.3-petiole'].includes(kind)))continue;
      // Keep connected supporting stalks during partial leaf-out. Sampling them
      // independently from blades leaves floating foliage and severed shoots.
      const density=kind==='garden-0.3-petiole'?(s.leafDensity>0?1:0):(s.leafDensity??1),r=random(p.id*3571+41),matrix=new THREE.Matrix4(),color=new THREE.Color();let kept=0;
      for(let i=0;i<mesh.count;i++)if(r()<density){mesh.getMatrixAt(i,matrix);mesh.getColorAt(i,color);if(kind!=='garden-0.3-petiole')matrix.scale(new THREE.Vector3(s.leafScale??1,s.leafScale??1,s.leafScale??1));mesh.setMatrixAt(kept,matrix);mesh.setColorAt(kept,color);kept++;}
      mesh.count=kept;if(!kept){g.remove(mesh);mesh.geometry.dispose();mesh.dispose();}else{
        // Each retained instance keeps an independent wind record after seasonal thinning.
        const windData=mesh.geometry.getAttribute('gardenWind');
        if(windData.count!==kept){
          mesh.geometry.setAttribute('gardenWind',new THREE.InstancedBufferAttribute(windData.array.slice(0,kept*4),4));
          mesh.instanceMatrix=new THREE.InstancedBufferAttribute(mesh.instanceMatrix.array.slice(0,kept*16),16);
          mesh.instanceColor=new THREE.InstancedBufferAttribute(mesh.instanceColor.array.slice(0,kept*3),3);
        }
        mesh.instanceMatrix.needsUpdate=true;mesh.instanceColor.needsUpdate=true;mesh.computeBoundingSphere();
      }
    }
  }
  if(s.shootScale<1&&!woody&&!['rose','hydrangea','clematis','climbingrose','mophead'].includes(form))g.scale.multiplyScalar(s.shootScale);
  return g;
}
const yClamp=y=>Math.max(.03,y);
