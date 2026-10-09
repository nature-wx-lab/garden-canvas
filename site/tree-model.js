// Branch topology is constructed before seasonal foliage, so winter reveals the same tree.
// Dimensions belong to the plan; these branching parameters are visual interpretations.
const TAU=Math.PI*2,clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function rng(seed){let n=seed>>>0;return()=>{n^=n<<13;n^=n>>>17;n^=n<<5;return(n>>>0)/4294967296;};}
const mix=(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*t);
const point=(a,r,y)=>[Math.sin(a)*r,y,Math.cos(a)*r];
export function treeSkeleton(profile,seed,detail=1){
 const lod=detail<.55?2:1,r=rng(seed*7919+101),segments=[],tips=[],habit=profile.habit,conic=habit==='pyramidal',vase=habit==='vase',weep=habit==='weeping',column=habit==='columnar',layered=habit==='layered';
 const trunk=profile.trunk??(vase?.28:habit==='multistem'?.04:conic?.12:weep?.32:layered?.27:.29);
 function curve(a,b,radius,bow=.01){
  let last=a;
  for(let j=1;j<=4;j++){const t=j/4,p=mix(a,b,t);p[0]+=Math.sin(t*Math.PI)*bow;p[2]-=Math.sin(t*Math.PI)*bow*.55;segments.push({a:last,b:p,r:radius*(1-t*.45)});last=p;}
 }
 const roots=habit==='multistem'?4:1;
 for(let root=0;root<roots;root++){
  const az=root*2.399+.2,origin=point(az,root?.025:0,0),fork=point(az,roots>1?.08:.018,trunk),top=point(az,conic||column?.015:roots>1?.18:.08,.985-root*.035);
  curve(origin,fork,.016,.008);for(let k=0;k<5;k++){const a=az+k*TAU/5;curve(origin,point(a,.06,.004),.005,0);}
  if(!vase)curve(fork,top,.011,.016);
  const mainCount=conic?42:vase?13:layered?18:weep?16:habit==='rounded'?22:20;
  for(let i=0;i<mainCount;i++){
   const f=(i+.3)/mainCount,angle=az+i*2.399+r()*.4;
   let origin=conic||column?mix(fork,top,f*.93):vase?fork:mix(fork,top,f*.57);
   let y,reach;
   if(conic){y=trunk+(.94-trunk)*f;reach=.45*Math.pow(1-f,.85);}
   else if(column){y=.35+f*.6;reach=.22+Math.sin(f*Math.PI)*.18;}
   else if(vase){y=.77+r()*.19;reach=.32+r()*.10;}
   else if(layered){y=.37+Math.floor(i/3)*.115;reach=.44*(1-f*.35);}
   else if(weep){y=.72+r()*.15;reach=.25+r()*.17;}
   else if(habit==='spreading'||habit==='irregular'){y=.53+r()*.38;reach=(.46-(y-.53)*.38)*(.86+r()*.18);}
   else {y=.48+f*.42;reach=.23+.18*Math.sin(f*Math.PI);}
   const end=point(angle,reach,y),elbow=mix(origin,end,.52);elbow[1]+=(vase?.035:weep?.10:.018);
   curve(origin,elbow,.007*(1-f*.45),.014);curve(elbow,end,.0045*(1-f*.45),.012);
   for(let j=0;j<10;j+=lod){
    const t=.18+j*.085,base=t<.52?mix(origin,elbow,t/.52):mix(elbow,end,(t-.52)/.48),side=j%2?1:-1,sa=angle+side*(.5+r()*.65),extent=(conic?.08:.10)*(1-f*.30);
    const target=[base[0]+Math.sin(sa)*extent,base[1]+(vase||column?.10:conic?.014:.035)+r()*.025,base[2]+Math.cos(sa)*extent];
    curve(base,target,.0019,.006);
    for(let k=0;k<4;k+=lod){
     const a=sa+(k-1.5)*.58,start=mix(base,target,.28+k*.18),length=.07+r()*.045;
     let tip=[start[0]+Math.sin(a)*length,start[1]+(weep?-.14-r()*.16:conic?.005:vase?.065:.026)+r()*.025,start[2]+Math.cos(a)*length];
     const radial=Math.hypot(tip[0],tip[2]);if(radial>.46){tip[0]*=.46/radial;tip[2]*=.46/radial;}tip[1]=clamp(tip[1],.12,.965);
     if(weep){const bend=mix(start,tip,.30);bend[1]+= .025;curve(start,bend,.0010,.004);curve(bend,tip,.00065,.003);}else curve(start,tip,.0009,.006);
     tips.push({a:start,b:tip,angle:a,seed:Math.floor(r()*1e8)});
    }
   }
  }
 }
 return {segments,tips,habit,trunk};
}
export function drawTree(b,{profile,p,s,detail},kit){
 const {bud,flower,shade}=kit,h=s.height,w=s.spread,sk=treeSkeleton(profile,p.id,detail),leaf=profile.leafShape||'leaf';
 const bark=profile.bark||'#706653',evergreen=profile.leaf==='evergreen',base=s.leafColor||profile.green||'#50783b';
 const rootHeight=s.natural.height*sk.trunk;
 const scale=a=>[a[0]*w,a[1]<=sk.trunk?a[1]/sk.trunk*rootHeight:rootHeight+(a[1]-sk.trunk)/(1-sk.trunk)*(h-rootHeight),a[2]*w];
 for(const seg of sk.segments)b.branch(scale(seg.a),scale(seg.b),Math.max(.0006,seg.r*Math.min(s.natural.height,s.natural.spread*1.3)),bark);
 const needle=['needle','pine','feather','scale'].includes(leaf),compound=leaf==='compound';
 const size=Math.max(Math.min(profile.leafSize||.095,Math.max(.035,w*.095)),w*.023); // Larger distant crowns use a bounded foliage LOD.
 const density=s.leafDensity??(s.dormant?0:1),flowerDensity=s.flowerDensity??(s.bloom?1:0),stride=Math.max(1,Math.round(1/Math.max(.28,detail)));
 for(let i=0;i<sk.tips.length;i+=stride){
  const tip=sk.tips[i],r=rng(tip.seed+19),nodes=needle?5:compound?5:18;
  for(let n=0;n<nodes;n++){
   const t=.04+n/(nodes-1)*.96,center=scale(mix(tip.a,tip.b,t)),angle=tip.angle+(n%2?1:-1)*(1.05+r()*.65);
   const colour=shade(r,base,.12),visible=r()<density;
   if(visible){
    if(needle){
     const needles=leaf==='pine'?9:leaf==='scale'?6:10;
     for(let j=0;j<needles;j++){
      const a=angle+j*TAU/needles,sz=leaf==='pine'?size*1.4:leaf==='feather'?size*.42:size*.7;
      b.add(leaf==='scale'?'narrow':'needle','leaf',colour,...center,leaf==='scale'?sz*.3:leaf==='feather'?sz*.55:sz*.25,sz,sz*.4,leaf==='pine'?.65:1.2,a,0);
     }
    }else if(compound){
     const end=[center[0]+Math.sin(angle)*size*1.5,center[1]+size*.16,center[2]+Math.cos(angle)*size*1.5];b.branch(center,end,.00055,base,'petiole');
     for(let j=0;j<5;j++)for(const side of [-1,1]){const at=mix(center,end,.2+j*.16),a=angle+side*.9;b.add('leaf','leaf',colour,...at,size*.40,size*.68,size*.65,1.3,a,0);}
    }else{
     const pos=[center[0]+Math.sin(angle)*size*.16,center[1]+size*.04,center[2]+Math.cos(angle)*size*.16];b.branch(center,pos,.00045,'#798254','petiole');
     const shape=['heart','ginkgo','oak','star','serrated','tulipLeaf','leathery'].includes(leaf)?leaf:leaf==='maple'?'mapleLow':leaf;
     const length=size*(.75+r()*.4)*(s.leafScale??1);b.add(shape,'leaf',colour,...pos,length,length,length,1.32+r()*.28,angle,(r()-.5)*.3);
    }
   }
   if(flowerDensity>0&&r()<flowerDensity*(profile.showy===false?0:.38)){
    const a=angle,pos=[center[0]+Math.sin(a)*size*.3,center[1]+.015,center[2]+Math.cos(a)*size*.3],c=profile.flowerColor||s.flowerColor||'#f2e4df';
    if(profile.flowerKind==='cherry'){
     const radius=profile.flowerSize||.024;
     for(let cluster=0;cluster<3;cluster++){
      const ca=cluster*2.399,xx=pos[0]+Math.sin(ca)*radius,zz=pos[2]+Math.cos(ca)*radius,yy=pos[1]+cluster*.006;
      for(let petal=0;petal<5;petal++)b.add('petal','petal',c,xx,yy,zz,radius*1.2,radius,radius,1.45+cluster*.15,petal*TAU/5,0);
      b.add(bud,'seed','#d4c590',xx,yy+.003,zz,.003,.002,.003);
     }
    }else if(profile.flowerKind==='bract'){for(let k=0;k<4;k++)b.add('petal','petal',c,...pos,.045,.055,.045,1.55,k*TAU/4,0);b.add(bud,'seed','#a5b65f',...pos,.01,.01,.01);}
    else if(profile.flowerKind==='magnolia'){for(let k=0;k<9;k++)b.add('petal','petal',c,...pos,.06,.1,.08,.6+(k%3)*.2,k*TAU/9,0);}
    else flower(b,...pos,profile.flowerSize||.025,c,r,profile.doubleFlower?3:1,5);
   }
   if(!visible&&density<.25&&n===nodes-1)b.add(bud,'seed',profile.budColor||'#8d604b',...center,.0035,.009,.0035,.3,angle,0);
  }
 }
 return {habit:sk.habit,branches:sk.segments.length,terminals:sk.tips.length};
}
