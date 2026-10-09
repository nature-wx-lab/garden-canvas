import {foliageKind} from './appearance.js?v=0.6.0';
const TAU=Math.PI*2;

// Connected flower parts share an origin. Variation changes size and angle, not taxon identity.
export function detailedFlower(b,{x,y,z,r=.025,color,shape='flat',petals=5,layers=1,pattern,center='#c6ad56',tilt=0},kit){
 const {bud,rand,shade}=kit,kind=pattern?'petal-'+pattern:'petal';
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
  b.add(shape==='star'?'narrow':shape==='spoonRay'?'spoon':'petal',kind,shade(rand,color,.035),x,y+layer*r*.09,z,length*(n>10?.38:.95),length,length,pitch+tilt,a,0);
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
 const leafKind=foliageKind(info),shape=a.leafShape||'leaf',basal=a.arrangement==='basal'||['rosette','clump','mound','creeping'].includes(a.habit),creeping=a.habit==='creeping';
 const count=Math.max(4,Math.round((basal?15:11)*detail)),lh=Math.min(s.leafHeight,h*.62);
 const addLeaf=(at,size,angle,pitch=.95)=>{
  if(shape==='compound'){
   const n=a.leaflets||7,end=[at[0]+Math.sin(angle)*size,at[1]+size*.15,at[2]+Math.cos(angle)*size];b.branch(at,end,.0006,green,'petiole');
   if(a.compoundType==='palmate'){
    for(let j=0;j<n;j++)b.add('serrated',leafKind,kit.shade(rand,green,.06),...end,size*.32,size*.65,size*.65,pitch,angle+(j-(n-1)/2)*2.4/Math.max(1,n-1),0);
   }else{
    for(let j=0;j<n-1;j++){const pair=Math.floor(j/2),t=.2+pair*.6/Math.max(1,Math.floor((n-1)/2)-1),side=j%2?1:-1;b.add('serrated',leafKind,kit.shade(rand,green,.06),at[0]+(end[0]-at[0])*t,at[1]+(end[1]-at[1])*t,at[2]+(end[2]-at[2])*t,size*.34,size*.48,size*.48,pitch,angle+side*.9,0);}
    b.add('serrated',leafKind,green,...end,size*.34,size*.5,size*.5,pitch,angle,0);
   }
  }else b.add(shape,leafKind,kit.shade(rand,green,.07),...at,size,size,size,pitch,angle,(rand()-.5)*.18);
 };
 for(let i=0;i<count;i++){
  const angle=i*2.399,rr=w*.28*Math.sqrt((i+.5)/count),x=Math.sin(angle)*rr,z=Math.cos(angle)*rr,top=h*(.72+rand()*.23),leafSize=Math.min(.18,w*.26,lh*.72);
  if(basal){
   const at=[x*.8,lh*(creeping?.12:.4+rand()*.28),z*.8];b.branch([0,.005,0],at,.002,green,'petiole');addLeaf(at,leafSize*(.8+rand()*.35),angle,creeping?1.5:1.05);
  }else{
   b.branch([x*.15,0,z*.15],[x,top*.83,z],.0018,stemColor,'petiole');
   for(let j=0;j<5;j++){
    const t=.18+j*.14,at=[x*t,top*t,z*t],pairs=a.arrangement==='opposite'?2:a.arrangement==='whorled'?3:1;
    for(let k=0;k<pairs;k++)addLeaf(at,leafSize*(1-t*.5),angle+j*(pairs===1?2.399:1.57)+k*TAU/pairs,.85);
   }
  }
  if(!s.bloom)continue;
  const y=creeping?Math.min(top,lh+.07):top;b.branch([x*.15,.01,z*.15],[x,y,z],.0018,stemColor,'petiole');
  const flower=(xx,yy,zz,r,tilt=0)=>detailedFlower(b,{x:xx,y:yy,z:zz,r,color:s.flowerColor||info.flower,shape:a.flowerShape||'flat',petals:a.petals||5,layers:a.flowerLayers||1,pattern:a.flowerPattern,tilt},{...kit,rand});
  const inf=a.inflorescence||'solitary',florets=Math.max(5,Math.round((inf==='panicle'?26:inf==='head'?36:16)*detail*(s.flowerDensity||1)));
  if(inf==='solitary'||a.flowerShape==='daisy')flower(x,y,z,Math.min(a.flowerShape==='daisy'?.065:.045,w*.16));
  else for(let j=0;j<florets;j++){
   const t=(j+.5)/florets,aa=j*2.399;
   if(['spike','raceme','catkin'].includes(inf)){
    const yy=y-h*.22*t,rr=inf==='raceme'?.028:.008,xx=x+Math.sin(aa)*rr,zz=z+Math.cos(aa)*rr;
    b.branch([x,yy,z],[xx,yy+.004,zz],.0006,green,'petiole');flower(xx,yy,zz,.012,inf==='raceme'?2.3:0);
   }else if(inf==='head'){
    const rr=.04*Math.sqrt(1-(t*2-1)**2);flower(x+Math.sin(aa)*rr,y+(t*2-1)*.04,z+Math.cos(aa)*rr,.008);
   }else{
    const rr=Math.sqrt(t)*Math.min(.095,w*.2)*(inf==='panicle'?1-t*.65:1),yy=inf==='panicle'?y-h*.2+t*h*.2:y+Math.sin(t*Math.PI)*.015;
    const end=[x+Math.sin(aa)*rr,yy,z+Math.cos(aa)*rr];b.branch([x,y-h*.14,z],end,.0007,green,'petiole');flower(...end,.009);
   }
  }
 }
}
