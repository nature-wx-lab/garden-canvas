import {foliageKind,patternKind} from './appearance.js?v=0.8.0';
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
export function detailedFlower(b,{x,y,z,r=.025,color,shape='flat',petals=5,layers=1,pattern,patternColor,palette={},guides=true,outerPattern,center='#c6ad56',stamenCount=2,tilt=0,yaw=0},kit){
 const {bud,rand,shade}=kit,kind=patternKind('petal',pattern,patternColor);
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
  b.add('petal',kind,color,x,y,z,r*1.8,r*1.3,r,.15+tilt,0,0);
  for(const side of [-1,1])b.add('petal',kind,color,x,y,z,r*.6,r,r,1.4+tilt,side*.85,0);
  b.add('petal',kind,shade(rand,color,.035),x,y,z,r*.55,r*.85,r,.7+tilt,Math.PI,0);return;
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
 if(a.architecture==='snowdrop'){drawSnowdrops(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='quakingGrass'){drawQuakingGrass(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='fan'){drawFans(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='nakedScape'){drawNakedScapes(b,{info,s,detail,rand},kit);return;}
 if(leafyViolet){drawLeafyViolets(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='uprightRaceme'||a.architecture==='squill'){drawRacemes(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='pineapple'){drawPineappleLily(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='peltatePair'){drawPeltatePairs(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='bloodroot'){drawBloodroot(b,{info,s,detail,rand},kit);return;}
 if(a.architecture==='funnelUmbel'){drawFunnelUmbels(b,{info,s,detail,rand},kit);return;}
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
