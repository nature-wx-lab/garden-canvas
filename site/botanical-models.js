// Distinct botanical silhouettes, still reference geometry rather than scanned specimens.
const TAU=Math.PI*2;
export const EXTENDED_FORMS=new Set(['airy','torch','hellebore','clematis','climbingrose','conifer','tree','shrub','mophead','heuchera','fern','cyclamen','tulip','narcissus','iris','lily','globe','bell','rosette','cactus','waterlily','floating','aquatic','fivepetal']);
export function drawBotanical(b,{info,s,p,detail,rand},kit){
 const {bud,cone,flower,shade}=kit,h=s.height,w=s.spread,form=info.form;
 const green=s.leafColor||info.leafColor||'#567447',brown='#80715b',color=info.flower,dormant=s.dormant;
 const count=n=>Math.max(1,Math.round(n*detail));
 const leaf=(x,y,z,size,a,pitch=1.05,shape='leaf',base=green)=>{
  b.add(shape,'leaf',shade(rand,base,.08),x,y,z,size*.8,size,size,pitch,a,0);
  if(info.variegated)b.add(shape,'leaf','#c8ccaa',x,y+.0007,z,size*.33,size*.95,size,pitch,a,0);
 };
 const flatFlower=(x,y,z,r,petals=5,layers=1,tilt=0)=>{
  for(let layer=0;layer<layers;layer++)for(let j=0;j<petals;j++){
   const a=j*TAU/petals+layer*.45,length=r*(1-layer*.16);
   b.add('petal','petal',shade(rand,color,.04),x,y+layer*r*.05,z,length*.85,length,length,Math.PI/2+tilt-layer*.1,a,0);
  }
  b.add(bud,'seed','#c8ad52',x,y+.008,z,r*.14,.009,r*.14);
 };
 if(form==='airy'){
  if(dormant)return;
  for(let i=0;i<count(11);i++){
   const a=i*2.399,x=Math.sin(a)*w*.25,z=Math.cos(a)*w*.25,y=h*(.6+rand()*.35);b.branch([0,0,0],[x,y,z],.0015,green);
   for(let k=1;k<5;k++){const t=k/6;leaf(x*t,y*t,z*t,Math.min(.08,w*.16),a+k*2.4,.8,'serrated');}
   if(s.bloom)for(let j=0;j<count(9);j++){const aa=j*2.399,rr=Math.sqrt(j/9)*Math.min(.12,w*.2),end=[x+Math.sin(aa)*rr,y+.04-rand()*.04,z+Math.cos(aa)*rr];b.branch([x,y-.08,z],end,.00065,green);flatFlower(...end,.014,5);}
  }return;
 }
 if(form==='torch'){
  if(dormant)return;
  for(let i=0;i<count(34);i++)leaf(0,.01,0,Math.min(w*.85,h*.7),i*2.399,.45,'blade');
  if(s.bloom)for(let i=0;i<count(5);i++){
   const a=i*2.399,x=Math.sin(a)*w*.2,z=Math.cos(a)*w*.2,y=h*(.78+rand()*.18);b.branch([x,0,z],[x,y,z],.004,green);
   for(let j=0;j<count(110);j++){const t=j/count(110),aa=j*2.399,rr=.025*Math.sin(t*Math.PI);b.add('petal','petal',color,x+Math.sin(aa)*rr,y-.22+t*.22,z+Math.cos(aa)*rr,.012,.026,.021,2.5,aa,0);}
  }return;
 }
 if(['tree','shrub','conifer'].includes(form)){
  const trunk=form==='shrub'?.06:h*.27;
  b.branch([0,0,0],[w*.025,h*.92,0],Math.max(.008,h*.012),brown);
  for(let i=0;i<count(form==='shrub'?22:32);i++){
   const t=(i+.5)/count(form==='shrub'?22:32),a=i*2.399,r=w*.42*(form==='conifer'?(1-t):Math.sin(Math.PI*t)*.7+.25),y=trunk+(h-trunk)*t;
   const end=[Math.sin(a)*r,y,Math.cos(a)*r],base=[0,y*.75,0];
   b.branch(base,end,Math.max(.002,h*.004)*(1-t*.7),brown);
   if(dormant)continue;
   if(form==='conifer'){
    for(let j=0;j<9;j++){const q=j/9,xx=end[0]*q,zz=end[2]*q;for(const side of [-1,1])b.add('blade','leaf',shade(rand,green),xx,y-.06+q*.06,zz,.055,Math.min(.18,h*.12),.07,.7,a+side*.8,0);}
   }else for(let j=0;j<count(28);j++){
    const t2=rand(),aa=j*2.399,r2=w*.14*Math.sqrt(rand()),xx=end[0]+Math.sin(aa)*r2,zz=end[2]+Math.cos(aa)*r2,yy=y+(rand()-.5)*h*.12;
    leaf(xx,yy,zz,Math.min(.13,w*.17),aa,1.1);if(s.bloom&&j%9===0)flatFlower(xx,yy+.025,zz,.04);
   }
  }
  return;
 }
 if(['clematis','climbingrose'].includes(form)){
  // An explicitly visible support represents a trained climbing plant.
  for(const x of [-w*.34,w*.34])b.branch([x,0,0],[x,h,0],.007,'#aeaa8d');
  for(let j=1;j<6;j++)b.branch([-w*.34,h*j/6,0],[w*.34,h*j/6,0],.003,'#aeaa8d');
  for(let i=0;i<5;i++){
   const phase=i*1.6;let prev=[(i-2)*w*.06,0,.018];
   for(let j=1;j<19;j++){
    const t=j/19,a=phase+t*8,x=Math.sin(a)*w*.3,y=t*h,z=Math.cos(a)*.035;
    b.branch(prev,[x,y,z],.0025,brown);prev=[x,y,z];if(dormant)continue;
    for(const side of [-1,1]){const leafAngle=a+side*1.25;leaf(x,y,z,Math.min(.1,w*.16),leafAngle);leaf(x+Math.sin(leafAngle)*.04,y-.02,z+.02,.055,leafAngle+.6);}
    if(s.bloom&&j>5&&j%3===0){if(form==='climbingrose')flower(b,x,y,z+.04,.065,color,rand,3);else flatFlower(x,y,z+.04,.08,6);}
   }
  }
  return;
 }
 if(form==='heuchera'||form==='hellebore'){
  if(dormant)return;
  for(let i=0;i<count(24);i++){
   const a=i*2.399,r=w*.26*Math.sqrt(rand()),x=Math.sin(a)*r,z=Math.cos(a)*r,y=h*.25*(.6+rand()*.5),size=Math.min(w*.31,.18);
   b.branch([0,0,0],[x,y,z],.0025,green);
   if(form==='hellebore')for(let j=-3;j<=3;j++)leaf(x,y,z,size*.85,a+j*.32,.95,'narrow');
   else leaf(x,y,z,size,a,1.35,'hosta');
  }
  if(s.bloom)for(let i=0;i<count(form==='hellebore'?9:8);i++){
   const a=i*2.399,x=Math.sin(a)*w*.24,z=Math.cos(a)*w*.24,y=h*(.75+rand()*.22);
   b.branch([0,0,0],[x*.7,y*.78,z*.7],.003,green);b.branch([x*.7,y*.78,z*.7],[x,y,z],.002,green);
   if(form==='hellebore'){
    for(let j=0;j<5;j++)b.add('petal','petal',shade(rand,color,.05),x,y,z,.06,.06,.06,2.1,j*TAU/5,0);
    for(let j=0;j<12;j++){const a2=j*TAU/12;b.add(bud,'seed','#cbca91',x+Math.sin(a2)*.011,y-.008,z+Math.cos(a2)*.011,.0025,.008,.0025);}
   }else for(let j=0;j<18;j++){const t=j/18,a2=j*2.399;b.add(bud,'petal',color,x+Math.sin(a2)*.028*(1-t),y-.17+t*.17,z+Math.cos(a2)*.028*(1-t),.005,.008,.005);}
  }
  return;
 }
 if(form==='fern'){
  if(dormant)return;
  for(let i=0;i<count(12);i++){const a=i*2.399;let prev=[0,0,0];for(let j=1;j<18;j++){
   const t=j/18,r=w*.46*t,x=Math.sin(a)*r,z=Math.cos(a)*r,y=h*Math.sin(t*Math.PI*.65);b.branch(prev,[x,y,z],.0015,green);prev=[x,y,z];
   for(const side of [-1,1])leaf(x,y,z,w*.18*Math.sin(t*Math.PI),a+side*1.3,1.3,'narrow');
  }}return;
 }
 if(form==='rosette'||form==='floating'){
  if(dormant)return;
  const heads=form==='floating'?5:1;
  for(let head=0;head<heads;head++){
   const a0=head*2.399,cx=head?Math.sin(a0)*w*.3:0,cz=head?Math.cos(a0)*w*.3:0,size=form==='floating'?w*.25:w*.49;
   for(let i=0;i<count(42);i++){
    const a=i*2.399,t=i/count(42),len=size*(1-t*.75);
    if(form==='rosette')b.add(bud,'leaf',shade(rand,green,.08),cx+Math.sin(a)*len*.53,h*.10+t*h*.6,cz+Math.cos(a)*len*.53,len*.23,h*.10,len*.65,.16+Math.sin(a)*.14,a,0);
    else leaf(cx,.025,cz,len,a,1.4,'hosta');
   }
  }return;
 }
 if(form==='cactus'){
  for(let i=0;i<3;i++){
   const x=(i-1)*w*.22,y=i===1?h*.5:h*.32,hh=i===1?h:h*.62;
   b.add(bud,'leaf',green,x,y,0,w*.17,hh*.52,w*.17);
   for(let j=0;j<count(70);j++){const a=(j%10)*TAU/10,yy=(Math.floor(j/10)+.8)/8*hh;
    b.branch([x+Math.sin(a)*w*.15,yy,Math.cos(a)*w*.15],[x+Math.sin(a)*(w*.15+.015),yy+.007,Math.cos(a)*(w*.15+.015)],.0006,'#d8cdb2');
   }
  }return;
 }
 if(form==='waterlily'){
  if(dormant)return;
  for(let i=0;i<count(11);i++){
   const a=i*2.399,r=w*.31*Math.sqrt(rand()),x=Math.sin(a)*r,z=Math.cos(a)*r;
   b.add(bud,'leaf',shade(rand,green),x,.012,z,w*.15,.004,w*.145);
  }
  if(s.bloom)for(let i=0;i<2;i++)flatFlower((i-.5)*w*.3,Math.min(h,.09),0,Math.min(w*.18,.14),11,3);
  return;
 }
 if(form==='aquatic'){
  if(dormant)return;
  for(let i=0;i<count(16);i++){
   const a=i*2.399,x=Math.sin(a)*w*.3,z=Math.cos(a)*w*.3,hh=h*(.6+rand()*.4);
   b.branch([x,0,z],[x,hh,z],.001,green);
   for(let j=1;j<9;j++)for(let k=0;k<5;k++)leaf(x,hh*j/9,z,Math.min(.06,w*.12),k*TAU/5+j,.95,'narrow');
  }return;
 }
 if(form==='mophead'){
  for(let i=0;i<count(14);i++){
   const a=i*2.399,x=Math.sin(a)*w*.3,z=Math.cos(a)*w*.3,y=h*(.6+rand()*.2);
   b.branch([x*.1,0,z*.1],[x,y,z],.004,brown);if(dormant)continue;
   for(let j=1;j<5;j++)leaf(x*j/5,y*j/5,z*j/5,Math.min(w*.18,.16),a+j*2.4,.7);
   if(s.bloom)for(let j=0;j<count(38);j++){const t=(j+.5)/count(38),aa=j*2.399,rr=Math.sqrt(1-Math.pow(2*t-1,2))*.095;flatFlower(x+Math.sin(aa)*rr,y+(2*t-1)*.07,z+Math.cos(aa)*rr,.024,4);}
  }return;
 }
 // Bulbs and smaller flowering plants retain their own flower/leaf architecture.
 if(dormant)return;
 const stems=count(form==='fivepetal'?26:form==='cyclamen'?11:7);
 for(let i=0;i<stems;i++){
  const a=i*2.399,r=w*.3*Math.sqrt(rand()),x=Math.sin(a)*r,z=Math.cos(a)*r,y=h*(.70+rand()*.24),len=Math.min(h*.55,w*.75);
  if(['tulip','narcissus','iris','lily','globe','bell'].includes(form)){
   for(let j=0;j<3;j++)leaf(x*.5,.02,z*.5,len,a+j*2,form==='iris'?.18:.32,form==='tulip'?'leaf':'blade');
  }else for(let j=0;j<3;j++)leaf(x*.65,h*.14+j*h*.06,z*.65,Math.min(w*.22,.09),a+j*2,1.15,form==='cyclamen'?'hosta':'leaf');
  if(!s.bloom)continue;
  b.branch([x*.5,0,z*.5],[x,y,z],.0025,green);
  const radius=Math.min(form==='fivepetal'?.04:.06,w*.25);
  if(form==='tulip'){
   for(let j=0;j<6;j++){const aa=j*TAU/6;b.add('petal','petal',shade(rand,color),x+Math.sin(aa)*radius*.12,y,z+Math.cos(aa)*radius*.12,radius*1.15,radius*1.55,radius, .32,aa,0);}
   b.add(bud,'seed','#72622f',x,y+.025,z,.006,.015,.006);
  }else if(form==='narcissus'){
   flatFlower(x,y,z,radius,6);for(let j=0;j<10;j++)b.add('petal','petal',color,x,y+.005,z,radius*.38,radius*.55,radius*.6,.5,j*TAU/10,0);
  }else if(form==='iris'){
   for(let j=0;j<3;j++){const aa=j*TAU/3;b.add('petal','petal',color,x,y,z,radius*.8,radius*1.2,radius,.2,aa,0);b.add('petal','petal',color,x,y,z,radius*.75,radius*1.3,radius,2.15,aa+1,0);}
  }else if(form==='globe'){
   for(let j=0;j<count(38);j++){const t=(j+.5)/count(38),aa=j*2.399,rr=Math.sqrt(1-Math.pow(2*t-1,2))*radius;b.add(bud,'petal',color,x+Math.sin(aa)*rr,y+(2*t-1)*radius,z+Math.cos(aa)*rr,.008,.009,.008);}
  }else if(form==='cyclamen'){
   for(let j=0;j<5;j++)b.add('petal','petal',color,x,y,z,radius*.4,radius*1.6,radius,.1,j*TAU/5,0);
  }else if(form==='bell'){
   for(let j=0;j<5;j++)for(let k=0;k<5;k++)b.add('petal','petal',color,x+Math.sin(j*2.4)*.018,y-j*.035,z+Math.cos(j*2.4)*.018,.018,.029,.028,2.9,k*TAU/5,0);
  }else flatFlower(x,y,z,radius,form==='lily'?6:5);
 }
}
