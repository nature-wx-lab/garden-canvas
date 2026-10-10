// Branch topology is constructed before seasonal foliage, so winter reveals the same tree.
// Dimensions belong to the plan; these branching parameters are visual interpretations.
import {foliageKind} from './appearance.js?v=0.9.25';
const TAU=Math.PI*2,clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function rng(seed){let n=seed>>>0;return()=>{n^=n<<13;n^=n>>>17;n^=n<<5;return(n>>>0)/4294967296;};}
const mix=(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*t);
const point=(a,r,y)=>[Math.sin(a)*r,y,Math.cos(a)*r];
// Opposite leaves share a node; successive pairs rotate around the shoot.
export function twigLeafSites(tip,count,arrangement='alternate',terminal=false){
 const paired=arrangement==='opposite',levels=paired?Math.ceil(count/2):count;
 return Array.from({length:count},(_,n)=>{
  const level=paired?Math.floor(n/2):n,t=(terminal?.62:.05)+(terminal?.38:.95)*level/Math.max(1,levels-1);
  return {at:mix(tip.a,tip.b,t),angle:tip.angle+(paired?level*Math.PI/2+(n%2)*Math.PI:n*2.399),index:n};
 });
}
export function treeSkeleton(profile,seed,detail=1){
 const lod=detail<.55?2:1,r=rng(seed*7919+101),segments=[],tips=[],branchSites=[],habit=profile.habit,conic=habit==='pyramidal',vase=habit==='vase',weep=habit==='weeping',column=habit==='columnar',layered=habit==='layered',terminal=profile.architecture==='terminalLeaves',redbud=profile.architecture==='weepingRedbud',airy=profile.architecture==='openCompound',loose=profile.architecture==='looseShrub';
 const trunk=profile.trunk??(vase?.28:habit==='multistem'?.04:conic?.12:weep?.32:layered?.27:.29);
 const birch=profile.architecture==='whiteBirch',lace=profile.architecture==='laceMaple',fringe=profile.architecture==='fringeTree';
 function curve(a,b,radius,bow=.01){
  let last=a;
  for(let j=1;j<=4;j++){const t=j/4,p=mix(a,b,t);p[0]+=Math.sin(t*Math.PI)*bow;p[2]-=Math.sin(t*Math.PI)*bow*.55;segments.push({a:last,b:p,r:radius*(1-t*.45)});last=p;}
 }
 const roots=redbud||loose?3:habit==='multistem'?4:1;
 for(let root=0;root<roots;root++){
  const az=root*2.399+.2,origin=point(az,root?.025:0,0),fork=point(az,roots>1?.08:.018,trunk),top=point(az,conic||column?.015:roots>1?.18:.08,(conic||column?.985:lace?.67:.90)-root*.025);
  curve(origin,fork,.016,.008);for(let k=0;k<5;k++){const a=az+k*TAU/5;curve(origin,point(a,.06,.004),.005,0);}
  if(!vase&&!loose)curve(fork,top,.011,.016);
  const mainCount=loose?5:terminal?9:airy||redbud?7:fringe?12:birch?18:conic?42:vase?13:layered?18:weep?16:roots>1?10:habit==='rounded'?22:20;
  for(let i=0;i<mainCount;i++){
   const f=(i+.3)/mainCount,angle=az+i*2.399+r()*.4;
   let origin=loose?fork:conic||column||birch?mix(fork,top,f*.93):vase?fork:mix(fork,top,f*.57);
   let y,reach;
   if(conic){y=trunk+(.94-trunk)*f;reach=.45*Math.pow(1-f,.85);}
   else if(column){y=.35+f*.6;reach=.22+Math.sin(f*Math.PI)*.18;}
   else if(vase){y=.77+r()*.19;reach=.32+r()*.10;}
   else if(layered){y=.37+Math.floor(i/3)*.115;reach=.44*(1-f*.35);}
   else if(weep){y=(lace?.67:.72)+r()*.15;reach=(lace?.31:.25)+r()*(lace?.11:.17);}
   else if(birch){y=.37+f*.55;reach=.16+.18*Math.sin(f*Math.PI);}
   else if(habit==='spreading'||habit==='irregular'){y=.53+r()*.38;reach=(.46-(y-.53)*.38)*(.86+r()*.18);}
   else {y=.48+f*.42;reach=.23+.18*Math.sin(f*Math.PI);}
   const end=point(angle,reach,y),elbow=mix(origin,end,.52);elbow[1]+=(vase?.035:weep?.10:.018);
   curve(origin,elbow,.007*(1-f*.45),.014);curve(elbow,end,.0045*(1-f*.45),.012);
   for(let j=0;j<5;j++){
    const t=(j+1)/6,q=t<.52?t/.52:(t-.52)/.48,at=t<.52?mix(origin,elbow,q):mix(elbow,end,q),bow=Math.sin(q*Math.PI)*(t<.52?.014:.012);
    at[0]+=bow;at[2]-=bow*.55;branchSites.push({at,angle:angle+j*2.399});
   }
   const laterals=loose?3:terminal||airy?4:fringe||birch?5:conic?10:7;
   for(let j=0;j<laterals;j+=lod){
    const t=(conic?.18:.52)+j*(conic?.085:.43/Math.max(1,laterals-1)),base=t<.52?mix(origin,elbow,t/.52):mix(elbow,end,(t-.52)/.48),side=j%2?1:-1,sa=angle+side*(.5+r()*.65),extent=(conic?.08:.10)*(1-f*.30);
    const target=[base[0]+Math.sin(sa)*extent,base[1]+(vase||column?.10:conic?.014:.035)+r()*.025,base[2]+Math.cos(sa)*extent];
    curve(base,target,.0019,.006);
    for(let k=0;k<(terminal?1:airy||loose?2:4);k+=lod){
     const a=sa+(k-1.5)*.58,start=mix(base,target,.28+k*.18),length=.07+r()*.045;
     let tip=[start[0]+Math.sin(a)*length,start[1]+(weep?-.14-r()*.16:birch?-.035:conic?.005:vase?.065:.026)+r()*.025,start[2]+Math.cos(a)*length];
     const radial=Math.hypot(tip[0],tip[2]);if(radial>.46){tip[0]*=.46/radial;tip[2]*=.46/radial;}tip[1]=clamp(tip[1],.12,.965);
     if(weep){const bend=mix(start,tip,.30);bend[1]+= .025;curve(start,bend,.0010,.004);curve(bend,tip,.00065,.003);}else curve(start,tip,.0009,.006);
     tips.push({a:start,b:tip,angle:a,seed:Math.floor(r()*1e8)});
    }
   }
  }
 }
 return {segments,tips,branchSites,habit,trunk};
}
export function drawTree(b,{profile,info,p,s,detail},kit){
 const {bud,flower,shade}=kit,h=s.height,w=s.spread,a=info?.appearance||{},sk=treeSkeleton({...profile,architecture:a.architecture},p.id,detail),leaf=profile.leafShape||'leaf';
 const bark=profile.bark||'#706653',base=s.leafColor||profile.green||'#50783b',leafKind=foliageKind(info),woodKind=profile.barkPattern?'wood-'+profile.barkPattern:'wood';
 const rootHeight=s.natural.height*sk.trunk;
 const scale=a=>[a[0]*w,a[1]<=sk.trunk?a[1]/sk.trunk*rootHeight:rootHeight+(a[1]-sk.trunk)/(1-sk.trunk)*(h-rootHeight),a[2]*w];
 for(const seg of sk.segments){const young=a.stemColor&&seg.r<(a.architecture==='whiteBirch'?.0035:.0019);b.branch(scale(seg.a),scale(seg.b),Math.max(.0006,seg.r*Math.min(s.natural.height,s.natural.spread*1.3)*(['fineTwigs','whiteBirch','laceMaple'].includes(a.architecture)?.72:1)),young?a.stemColor:bark,young&&a.architecture==='whiteBirch'?'wood-smooth':woodKind);}
 const needle=['needle','pine','feather','scale'].includes(leaf),compound=leaf==='compound';
 const size=a.leafLength||Math.max(Math.min(profile.leafSize||.095,Math.max(.035,w*.095)),w*.023); // Larger distant crowns use a bounded foliage LOD.
 const density=s.leafDensity??(s.dormant?0:1),flowerDensity=s.flowerDensity??(s.bloom?1:0),stride=Math.max(1,Math.round(1/Math.max(.28,detail)));
 if(a.inflorescence==='branchClusters'&&flowerDensity>0&&kit.detailedFlower){
  const random=rng(p.id*3571+17);
  for(let i=0;i<sk.branchSites.length;i+=stride){
   if(random()>flowerDensity)continue;
   const site=sk.branchSites[i],origin=scale(site.at),count=4+Math.floor(random()*5);
   for(let j=0;j<count;j++){
    const angle=site.angle+j*TAU/count,at=[origin[0]+Math.sin(angle)*.010,origin[1]+random()*.008,origin[2]+Math.cos(angle)*.010];
    b.branch(origin,at,.0004,'#824164','peduncle');
    kit.detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius||.007,color:s.flowerColor,shape:a.flowerShape,tilt:.20,yaw:angle},{bud,rand:random,shade});
   }
  }
 }
 for(let i=0;i<sk.tips.length;i+=stride){
  const tip=sk.tips[i],r=rng(tip.seed+19),nodes=a.architecture==='looseShrub'?4:needle?5:compound?4:['terminalLeaves','whiteBirch','fringeTree'].includes(a.architecture)?6:a.architecture==='laceMaple'?14:10;
  const sites=twigLeafSites(tip,nodes,a.arrangement,a.architecture==='terminalLeaves');
  for(let n=0;n<nodes;n++){
   const center=scale(sites[n].at),angle=sites[n].angle;
   const colour=shade(r,a.springShootColor&&s.springFlush&&n>=nodes-2?a.springShootColor:base,.12),visible=r()<density;
   if(visible){
    if(leaf==='feather'){
     // A shoot with opposite flat needles remains legible at garden-view distances.
     const length=Math.max(.14,w*.10)*(s.leafScale??1);b.add('feather','leaf',colour,...center,length,length,length,1.28,angle,0);
    }else if(needle){
     const umbrella=a.architecture==='umbrellaNeedles',needles=umbrella?24:leaf==='pine'?9:leaf==='scale'?6:10;
     if(umbrella&&n!==nodes-1)continue;
     for(let j=0;j<needles;j++){
      const a=angle+j*TAU/needles,sz=umbrella?size:leaf==='pine'?size*1.4:leaf==='feather'?size*.42:size*.7;
      b.add(umbrella?'strap':leaf==='scale'?'narrow':'needle',leafKind,colour,...center,umbrella?sz*.40:leaf==='scale'?sz*.3:leaf==='feather'?sz*.55:sz*.25,sz,sz*.4,umbrella?.95:leaf==='pine'?.65:1.2,a,0);
     }
    }else if(compound){
     const end=[center[0]+Math.sin(angle)*size*1.5,center[1]+size*.16,center[2]+Math.cos(angle)*size*1.5];b.branch(center,end,.00055,base,'petiole');
     const n=a.leafletCounts?.[Math.floor(r()*a.leafletCounts.length)]||a.leaflets||9,leaflet=a.leafletShape||'leaf';
     if(a.compoundType==='trifoliate')for(let j=0;j<3;j++)b.add(leaflet,leafKind,colour,...end,size*.42,size*.60,size*.60,1.2,angle+(j-1)*.78,0);
     else if(a.compoundType==='palmate')for(let j=0;j<n;j++)b.add(a.leafletShape||'serrated',leafKind,colour,...end,size*.4,size*.9,size*.9,1.3,angle+(j-(n-1)/2)*2.8/Math.max(1,n-1),0);
     else{
      for(let j=0;j<n-1;j++){const t=.2+Math.floor(j/2)*.6/Math.max(1,Math.floor((n-1)/2)-1),at=mix(center,end,t);b.add(leaflet,leafKind,colour,...at,size*(a.leafletShape?.75:.40),size*.68,size*.65,1.3,angle+(j%2?1:-1)*.9,0);}
      b.add(leaflet,leafKind,colour,...end,size*(a.leafletShape?.75:.40),size*.72,size*.72,1.3,angle,0);
     }
    }else{
     const pos=[center[0]+Math.sin(angle)*size*.16,center[1]+size*.04,center[2]+Math.cos(angle)*size*.16];b.branch(center,pos,.00045,'#798254','petiole');
     const shape=leaf==='dendropanax'?(n%3===0?'dendropanaxLobed':'rhombic'):leaf==='maple'?'mapleLow':leaf;
     const length=size*(.75+r()*.4)*(s.leafScale??1);b.add(shape,leafKind,colour,...pos,length,length,length,1.32+r()*.28,angle,(r()-.5)*.3);
    }
   }
   const terminalFlower=['cyme','corymb','umbel','panicle','pendantRaceme','terminalSolitary'].includes(a.inflorescence)&&a.architecture!=='longstalkHolly';
   const flowerSite=a.inflorescence!=='pendantRaceme'||i%Math.max(4,stride*2)===0;
   if(flowerSite&&a.inflorescence!=='branchClusters'&&flowerDensity>0&&(!terminalFlower||n===nodes-1)&&r()<flowerDensity*(profile.showy===false&&!a.flowerShape?0:terminalFlower?.75:.16)){
    const pos=[center[0]+Math.sin(angle)*size*.3,center[1]+.015,center[2]+Math.cos(angle)*size*.3],c=profile.flowerColor||s.flowerColor||'#f2e4df';
    if(profile.flowerKind==='cherry'){
     const radius=profile.flowerSize||.024;
     for(let cluster=0;cluster<3;cluster++){
      const ca=cluster*2.399,xx=pos[0]+Math.sin(ca)*radius,zz=pos[2]+Math.cos(ca)*radius,yy=pos[1]+cluster*.006;
      for(let petal=0;petal<5;petal++)b.add('petal','petal',c,xx,yy,zz,radius*1.2,radius,radius,1.45+cluster*.15,petal*TAU/5,0);
      b.add(bud,'seed','#d4c590',xx,yy+.003,zz,.003,.002,.003);
     }
    }else if(profile.flowerKind==='bract'){for(let k=0;k<4;k++)b.add('petal','petal',c,...pos,.045,.055,.045,1.55,k*TAU/4,0);b.add(bud,'seed','#a5b65f',...pos,.01,.01,.01);}
    else if(profile.flowerKind==='magnolia'){for(let k=0;k<9;k++)b.add('petal','petal',c,...pos,.06,.1,.08,.6+(k%3)*.2,k*TAU/9,0);}
    else if(a.inflorescence==='pendantRaceme'&&kit.detailedFlower){
     const length=(a.inflorescenceLength||.3)*(.65+r()*.35),count=Math.round(38*detail),start=pos;let last=start;
     for(let j=0;j<count;j++){
      const t=(j+1)/count,axis=[start[0]+Math.sin(angle)*length*.12*t*t,start[1]-length*t,start[2]+Math.cos(angle)*length*.12*t*t],yaw=j*2.399;
      b.branch(last,axis,.00065,'#8c975e','peduncle');last=axis;
      const at=[axis[0]+Math.sin(yaw)*.018,axis[1]-.008,axis[2]+Math.cos(yaw)*.018];b.branch(axis,at,.0004,'#8c975e','peduncle');
      kit.detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius||.013,color:c,shape:a.flowerShape,yaw},{bud,rand:r,shade});
     }
    }else if(a.flowerShape==='catkin'){
     const length=a.inflorescenceLength||.07;let last=pos;
     for(let j=0;j<18;j++){const t=(j+1)/18,at=[pos[0]+Math.sin(angle)*.018*t,pos[1]-length*t,pos[2]+Math.cos(angle)*.018*t];b.branch(last,at,.00035,'#849259','peduncle');for(let k=0;k<3;k++)b.add(bud,'catkin',c,at[0]+Math.sin(k*TAU/3)*.002,at[1],at[2]+Math.cos(k*TAU/3)*.002,.0018,length/22,.0018);last=at;}
     if(a.architecture==='whiteBirch')for(let j=0;j<10;j++){const t=(j+1)/10,at=[pos[0]-.013,pos[1]+.028*t,pos[2]];b.add(bud,'femaleCatkin','#8f9d66',...at,.0021,.0025,.0021);}
    }else if(a.flowerShape&&kit.detailedFlower){
     const panicle=a.inflorescence==='panicle',axillary=a.inflorescence==='axillaryRaceme',axilUmbel=a.inflorescence==='axillaryUmbel',single=a.architecture==='longstalkHolly';
     const clusters=single?1:panicle?(a.architecture==='fringeTree'?49:23):axillary||axilUmbel?4:['cyme','corymb','umbel'].includes(a.inflorescence)?9:1,length=a.inflorescenceLength||.075;
     const head=single?[pos[0]+Math.sin(angle)*.03,pos[1]-.01,pos[2]+Math.cos(angle)*.03]:[...pos];
     if(single)b.branch(pos,head,.0005,'#81905a','peduncle');
     if(panicle)b.branch(pos,[pos[0],pos[1]+length,pos[2]],.00055,'#81905a','peduncle');
     for(let j=0;j<clusters;j++){
      const aa=j*2.399,f=j/Math.max(1,clusters-1),rr=panicle?(1-f)*length*.40:clusters>1?Math.sqrt(f)*(axillary?.014:axilUmbel?.008:.022):0;
      const at=[head[0]+Math.sin(aa)*rr,head[1]+(panicle?f*length:axillary?f*.035:axilUmbel?.006:0),head[2]+Math.cos(aa)*rr];
      if(clusters>1)b.branch(panicle?[pos[0],at[1],pos[2]]:pos,at,.00025,'#8b9760','peduncle');
      kit.detailedFlower(b,{x:at[0],y:at[1],z:at[2],r:a.flowerRadius||(a.flowerShape==='linearPetals'?.004:clusters>1?.006:profile.flowerSize||.009),color:c,shape:a.flowerShape,petals:a.petals||5,stamenCount:a.stamenCount||2,layers:a.flowerLayers||1,pattern:a.flowerPattern,patternColor:a.flowerPatternColor,palette:a.flowerPalette,tilt:a.flowerShape==='sweetshrub'?.65+r()*.55:0,yaw:angle},{bud,rand:r,shade});
     }
    }else flower(b,...pos,profile.flowerSize||.025,c,r,profile.doubleFlower?3:1,5);
   }
   if(!visible&&density<.25&&n===nodes-1)b.add(bud,'seed',profile.budColor||'#8d604b',...center,.0035,.009,.0035,.3,angle,0);
  }
 }
 return {habit:sk.habit,branches:sk.segments.length,terminals:sk.tips.length};
}
