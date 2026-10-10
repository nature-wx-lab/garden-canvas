import {treeProfile} from './tree-profiles.js?v=0.9.100';
import { CATALOG, LEGACY, CATALOG_VERSION, plantInfo } from './catalog.js?v=0.9.100';
import { seasonAt } from './catalog-search.js?v=0.9.100';
export { CATALOG, plantInfo };
export const MODEL_VERSION='scenario-1';
export const TASKS={prune:'剪定',cutback:'切り戻し',water:'水やり',feed:'施肥',divide:'株分け',weed:'草取り',other:'その他の手入れ'};
export const clone=value=>JSON.parse(JSON.stringify(value));
export const round=v=>Math.round(v*100)/100;
export const dateIndex=view=>view.year*12+view.month-1;
export const currentPlan=doc=>doc.plans[doc.active];
const within=(v,min,max)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
const integer=(v,min,max)=>Number.isInteger(v)&&within(v,min,max);
const keys=(o,expected)=>o&&Object.getPrototypeOf(o)===Object.prototype&&Object.keys(o).sort().join('|')===[...expected].sort().join('|');
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const onSegment=(p,a,b)=>Math.abs(cross(a,b,p))<1e-8&&p[0]>=Math.min(a[0],b[0])-1e-8&&p[0]<=Math.max(a[0],b[0])+1e-8&&p[1]>=Math.min(a[1],b[1])-1e-8&&p[1]<=Math.max(a[1],b[1])+1e-8;
export function inside(x,z,points){let result=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if(onSegment([x,z],a,b))return true;if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])result=!result;}return result;}
export const zoneAt=(plan,x,z)=>plan.zones.findLast(zone=>inside(x,z,zone.points));
export const area=points=>Math.abs(points.reduce((s,p,i)=>{const q=points[(i+1)%points.length];return s+p[0]*q[1]-q[0]*p[1];},0)/2);
export const outlineFor=(shape,w,d)=>shape==='lshape'?[[0,0],[w,0],[w,d*.55],[w*.55,d*.55],[w*.55,d],[0,d]]:[[0,0],[w,0],[w,d],[0,d]];
export function validOutline(points,w,d,minArea=1){
  if(!Array.isArray(points)||points.length<3||points.length>32||points.some(p=>!Array.isArray(p)||p.length!==2||!within(p[0],0,w)||!within(p[1],0,d))||area(points)<minArea)return false;
  for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if(Math.hypot(a[0]-b[0],a[1]-b[1])<.05)return false;for(let j=i+1;j<points.length;j++){if(j===i+1||(i===0&&j===points.length-1))continue;const c=points[j],e=points[(j+1)%points.length];if(onSegment(a,c,e)||onSegment(b,c,e)||onSegment(c,a,b)||onSegment(e,a,b)||(cross(a,b,c)*cross(a,b,e)<0&&cross(c,e,a)*cross(c,e,b)<0))return false;}}return true;
}
export function contained(inner,outer){
  // Split every edge at boundary intersections, then test each interval.
  for(let i=0;i<inner.length;i++){
    const a=inner[i],b=inner[(i+1)%inner.length],dx=b[0]-a[0],dz=b[1]-a[1],length=dx*dx+dz*dz,ts=[0,1];
    if(!inside(a[0],a[1],outer))return false;
    for(let j=0;j<outer.length;j++){
      const c=outer[j],d=outer[(j+1)%outer.length],ex=d[0]-c[0],ez=d[1]-c[1],den=dx*ez-dz*ex;
      if(Math.abs(den)>1e-10){const t=((c[0]-a[0])*ez-(c[1]-a[1])*ex)/den,u=((c[0]-a[0])*dz-(c[1]-a[1])*dx)/den;if(t>0&&t<1&&u>=0&&u<=1)ts.push(t);}
      else if(Math.abs(cross(a,b,c))<1e-8&&length>0)for(const p of [c,d]){const t=((p[0]-a[0])*dx+(p[1]-a[1])*dz)/length;if(t>0&&t<1)ts.push(t);}
    }
    ts.sort((a,b)=>a-b);for(let j=1;j<ts.length;j++){const t=(ts[j-1]+ts[j])/2;if(!inside(a[0]+dx*t,a[1]+dz*t,outer))return false;}
  }return true;
}
export const obstaclePoints=o=>[[o.x,o.z],[o.x+o.width,o.z],[o.x+o.width,o.z+o.depth],[o.x,o.z+o.depth]];
export const canPlant=(plan,x,z)=>inside(x,z,plan.outline)&&!plan.obstacles.some(o=>inside(x,z,obstaclePoints(o)));
export function makePlant(kind,id,x,z){
  const info=plantInfo(kind),tree=info.group==='木',arch=info.appearance?.architecture,floater=arch?.startsWith('salvinia')?.03:arch==='amazonFrogbit'?.06:arch==='waterHyacinth'?.3:['waterCoin','marsileaMutica','bacopaCaroliniana','bacopaLanigera','bacopaMonnieri'].includes(arch)?.12:null,height=floater??(tree?1.5:info.group==='低木'?.65:info.form==='grass'?.65:.35),spread=tree?round(height*(treeProfile(info)?.spread&&treeProfile(info)?.height?Math.min(1.6,treeProfile(info).spread[1]/treeProfile(info).height[1]):.65)):info.group==='低木'?.55:.3;
  return {id,kind,x,z,height,spread,leafHeight:round(info.leaf==='herb'||info.leaf==='grass'?height*.55:height),start:0,role:'new',price:null,locked:false,scenario:null,management:null,tasks:[]};
}
export function replacePlant(p,kind){if(p.locked)throw new Error('固定を解除してから交換してください。');const next=makePlant(kind,p.id,p.x,p.z);next.start=p.start;next.role=p.role;return next;}
export function editSize(p,height,spread,leafHeight){const next=clone(p);if(height!==p.height||spread!==p.spread||leafHeight!==p.leafHeight){next.price=null;next.scenario=null;next.management=null;}Object.assign(next,{height,spread,leafHeight});return next;}
export function taskEvents(p,year){
  const result=[];for(const t of p.tasks){const at=year*12+t.month-1;if(at<p.start||(['annual','biennial'].includes(plantInfo(p.kind).life)&&at>=p.start+(plantInfo(p.kind).life==='biennial'?24:12))||t.repeat==='first'&&at>=p.start+12)continue;result.push({...t,at,plantId:p.id,kind:p.kind});}return result;
}
export function stateAt(p,view){
  const age=dateIndex(view)-p.start,info=plantInfo(p.kind),expired=['annual','biennial'].includes(info.life)&&age>=(info.life==='biennial'?24:12);
  const biennialLast=Math.max(...(info.appearance?.flowerMonths?.length?info.appearance.flowerMonths:[8])),biennialFlowerYear=Math.floor((p.start+12)/12)+(p.start%12>=biennialLast?1:0),biennialFlowerEnd=biennialFlowerYear*12+biennialLast;
  const standingDead=expired&&info.life==='biennial'&&info.appearance?.standingAfterDeathMonths?.includes(view.month)&&dateIndex(view)>=biennialFlowerEnd&&dateIndex(view)<(biennialFlowerYear+1)*12+2,present=age>=0&&(!expired||!!standingDead);
  let height=p.height,spread=p.spread,leafHeight=p.leafHeight;
  let basis=p.scenario?'自分の成長シナリオ':'年次成長は未設定';
  if(p.scenario){const t=Math.max(0,Math.min(1,age/(p.scenario.year*12)));height+=(p.scenario.height-height)*t;spread+=(p.scenario.spread-spread)*t;leafHeight+=(p.scenario.leafHeight-leafHeight)*t;}
  if(view.reference&&info.height){height=info.height[1];spread=info.spread?.[1]??p.spread;leafHeight=height*(p.leafHeight/p.height);basis=info.spread?'資料の成株上限（年数に非対応）':'資料の高さ上限・幅は入力値';}
  const natural={height,spread,leafHeight},trunkHeight=info.group==='木'||['maple','olive'].includes(info.form)?height*.3:0;
  let last=null,unsupported=false;
  if(p.management&&!view.reference&&present){
    for(let year=0;year<=view.year;year++)for(const e of taskEvents(p,year))if(['prune','cutback'].includes(e.type)&&e.at<=dateIndex(view)&&(!last||last.at<e.at))last=e;
    unsupported=p.management.height<trunkHeight+.15;
    if(last&&!unsupported){const recovery=Math.min(1,(dateIndex(view)-last.at)/p.management.recovery);height=Math.min(height,p.management.height)+(height-Math.min(height,p.management.height))*recovery;spread=Math.min(spread,p.management.spread)+(spread-Math.min(spread,p.management.spread))*recovery;leafHeight=Math.min(leafHeight,height);}
  }
  const season=seasonAt(info,view.month),flowerOptions=info.appearance?.flowerOptions;
  if(info.life==='annual'&&info.appearance?.persistence==='coolSeasonAnnual'){
    const last=(info.appearance.flowerMonths||info.bloom).at(-1)||6;
    const floweringYear=Math.floor(p.start/12)+(p.start%12>=last?1:0);
    if(dateIndex(view)>=floweringYear*12+last){
      // An old annual does not become an autumn seedling without a new planting.
      Object.assign(season,{bloom:false,dormant:true,groundDormant:!season.seedHeads,leafDensity:0,leafScale:0,shootScale:1,phase:season.seedHeads?'花後の枯れ茎・種子（残した場合）':'花後に生育終了'});
      season.label=season.phase;
    }
  }
  const warmEnd=info.appearance?.foliageMonths?.includes(12)?12:11;
  if(info.life==='annual'&&info.appearance?.persistence==='warmSeasonAnnual'&&dateIndex(view)>=Math.floor(p.start/12)*12+warmEnd){
    Object.assign(season,{bloom:false,dormant:true,groundDormant:true,leafDensity:0,leafScale:0,shootScale:1,phase:'低温期を迎えて生育終了',label:'低温期を迎えて生育終了'});
  }
  if(info.appearance?.architecture==='ornamentalKale'){
    const firstSpring=Math.floor(p.start/12)+(p.start%12>=4?1:0),springIndex=firstSpring*12+1;
    // The first winter rosette elongates in spring. An uncut stem does not
    // revert to a fresh seedling when the calendar reaches the next autumn.
    season.kaleBolting=Math.max(0,Math.min(1,(dateIndex(view)-springIndex+1)/3));
  }
  if(info.life==='biennial'){
    season.biennialRosette=age<12;
    if(season.biennialRosette){season.bloom=false;season.flowerDensity=0;season.phase='二年草の初年ロゼット（苗齢未入力の目安）';season.label=season.phase;}
    if(info.appearance?.seedHeadMonths){
      season.seedHeads=season.seedHeads&&dateIndex(view)>=biennialFlowerEnd;
      if(season.seedHeads)Object.assign(season,{groundDormant:false,bloom:false,leafDensity:0,leafScale:0,shootScale:1,phase:'花後の枯れ茎・種子頭（残した場合）',label:'花後の枯れ茎・種子頭（残した場合）'});
    }
  }
  if(flowerOptions?.length)season.flowerColor=flowerOptions[(p.id-1)%flowerOptions.length];
  return {present,expired,standingDead:!!standingDead,...season,age:Math.max(0,age)/12,height,spread,leafHeight,natural,trunkHeight,basis,last,unsupported,winter:[12,1,2].includes(view.month)};
}
export function budget(plan){const rows=new Map();let total=0,unknown=0,count=0;for(const p of plan.plants){if(p.role!=='new')continue;count++;const key=[p.kind,p.height,p.spread,p.price].join('|');if(!rows.has(key))rows.set(key,{kind:p.kind,height:p.height,spread:p.spread,price:p.price,count:0,total:0});const row=rows.get(key);row.count++;if(p.price===null)unknown++;else{total+=p.price;row.total+=p.price;}}return {total,unknown,count,rows:[...rows.values()]};}
export function calendar(plan,year){return Array.from({length:12},(_,i)=>{const events=plan.plants.flatMap(p=>taskEvents(p,year)).filter(t=>t.month===i+1);let min=events.length?plan.prep:0,max=min,unknown=0;for(const e of events){if(e.min===null||e.max===null)unknown++;else{min+=e.min*e.count;max+=e.max*e.count;}}return {month:i+1,events,min,max,unknown,available:plan.hours[i]===null?null:plan.hours[i]*60};});}
export function observations(plan,view){let overlap=0,outside=0,unmodeled=0;const visible=plan.plants.map(p=>({p,s:stateAt(p,view)})).filter(v=>v.s.present);for(let i=0;i<visible.length;i++){const {p,s}=visible[i];if(!p.scenario&&!view.reference)unmodeled++;for(let j=i+1;j<visible.length;j++){const q=visible[j];if(Math.hypot(p.x-q.p.x,p.z-q.p.z)<(s.spread+q.s.spread)/2)overlap++;}if(Array.from({length:24},(_,n)=>{const a=n*Math.PI/12;return !canPlant(plan,p.x+Math.cos(a)*s.spread/2,p.z+Math.sin(a)*s.spread/2);}).some(Boolean))outside++;}return {overlap,outside,unmodeled,visible:visible.length};}
function migrateV1(v){
  const bad=()=>{throw new Error('旧版ファイルの形式が不正です。');};
  if(!keys(v,['version','width','depth','outline','plants','month'])||!integer(v.month,1,12)||!Array.isArray(v.plants)||v.plants.length>100)bad();
  const doc=emptyDocument(v.width,v.depth);doc.view.month=v.month;const plan=doc.plans.A;plan.outline=v.outline;
  plan.plants=v.plants.map(p=>{if(!keys(p,['id','kind','x','z','height','spread'])||!['deciduous','evergreen','flower','grass'].includes(p.kind))bad();return {...makePlant(p.kind==='grass'?'legacy_grass':p.kind,p.id,p.x,p.z),height:p.height,spread:p.spread,leafHeight:p.height*.6};});return doc;
}
export function validateDocument(input){
  const bad=()=>{throw new Error('対応していない庭データ、または範囲外の値です。元の庭は変更していません。');};
  const v=input?.version===1?migrateV1(input):['2026-10-09.1','2026-10-10.1','2026-10-10.2','2026-10-10.3','2026-10-10.4','2026-10-10.5','2026-10-10.6','2026-10-10.7','2026-10-10.8','2026-10-10.9','2026-10-10.10','2026-10-10.11','2026-10-10.12','2026-10-10.13','2026-10-10.14','2026-10-10.15','2026-10-10.16','2026-10-10.17','2026-10-10.18','2026-10-10.19','2026-10-10.20','2026-10-10.21','2026-10-10.22','2026-10-10.23','2026-10-10.24','2026-10-10.25','2026-10-10.26','2026-10-10.27','2026-10-10.28','2026-10-10.29','2026-10-10.30','2026-10-10.31','2026-10-10.32','2026-10-10.33','2026-10-10.34','2026-10-10.35','2026-10-10.36','2026-10-10.37','2026-10-10.38','2026-10-10.39','2026-10-10.40','2026-10-10.41','2026-10-10.42','2026-10-10.43','2026-10-10.44','2026-10-10.45','2026-10-10.46','2026-10-10.47','2026-10-10.48','2026-10-10.49','2026-10-10.50','2026-10-10.51','2026-10-10.52','2026-10-10.53','2026-10-10.54','2026-10-10.55','2026-10-10.56','2026-10-10.57','2026-10-10.58','2026-10-10.59','2026-10-10.60','2026-10-10.61','2026-10-10.62','2026-10-10.63','2026-10-10.64','2026-10-10.65','2026-10-10.66',...Array.from({length:37},(_,i)=>`2026-10-11.${i+1}`)].includes(input?.catalogVersion)?{...input,catalogVersion:CATALOG_VERSION}:input;
  if(!keys(v,['version','modelVersion','catalogVersion','active','plans','view'])||v.version!==2||v.modelVersion!==MODEL_VERSION||v.catalogVersion!==CATALOG_VERSION||!['A','B'].includes(v.active)||!keys(v.plans,['A','B'])||!v.plans.A||!v.plans[v.active])bad();
  const view=v.view;
  if(!keys(view,['month','year','reference','footprints','camera'])||!integer(view.month,1,12)||!integer(view.year,0,10)||typeof view.reference!=='boolean'||typeof view.footprints!=='boolean')bad();
  if(view.camera!==null&&(!keys(view.camera,['position','target'])||!['position','target'].every(k=>Array.isArray(view.camera[k])&&view.camera[k].length===3&&view.camera[k].every(n=>within(n,-500,500)))||Math.hypot(...view.camera.position.map((n,i)=>n-view.camera.target[i]))<.1||view.camera.position[1]<.1))bad();
  for(const plan of Object.values(v.plans)){
    if(plan===null)continue;
    if(!keys(plan,['width','depth','outline','plants','zones','obstacles','hours','prep','sun','moisture'])||!within(plan.width,2,30)||!within(plan.depth,2,30)||!validOutline(plan.outline,plan.width,plan.depth)||!Array.isArray(plan.plants)||plan.plants.length>100||!Array.isArray(plan.zones)||plan.zones.length>12||!Array.isArray(plan.obstacles)||plan.obstacles.length>16||!Array.isArray(plan.hours)||plan.hours.length!==12||plan.hours.some(h=>h!==null&&!within(h,0,744))||!within(plan.prep,0,600)||!['sun','part','shade'].includes(plan.sun)||!['drained','moist'].includes(plan.moisture))bad();
    for(const z of plan.zones)if(!(keys(z,['points'])||keys(z,['points','kind'])&&['soil','water'].includes(z.kind))||!validOutline(z.points,plan.width,plan.depth,.04)||!contained(z.points,plan.outline))bad();
    for(const o of plan.obstacles)if(!keys(o,['type','x','z','width','depth','height'])||!['house','path','fence'].includes(o.type)||!within(o.x,0,30)||!within(o.z,0,30)||!within(o.width,.1,30)||!within(o.depth,.1,30)||!within(o.height,.02,8)||!contained(obstaclePoints(o),plan.outline))bad();
    const ids=new Set();
    for(const p of plan.plants){
      if(!keys(p,['id','kind','x','z','height','spread','leafHeight','start','role','price','locked','scenario','management','tasks'])||!integer(p.id,1,1000000)||ids.has(p.id)||typeof p.kind!=='string'||!(Object.hasOwn(CATALOG,p.kind)||Object.hasOwn(LEGACY,p.kind))||!within(p.height,.01,60)||!within(p.spread,.1,60)||!within(p.leafHeight,.005,p.height)||!within(p.x,0,plan.width)||!within(p.z,0,plan.depth)||!canPlant(plan,p.x,p.z)||!integer(p.start,0,131)||!['new','existing','reference'].includes(p.role)||p.price!==null&&!integer(p.price,0,10000000)||typeof p.locked!=='boolean'||!Array.isArray(p.tasks)||p.tasks.length>36)bad();ids.add(p.id);
      const s=p.scenario;if(s!==null&&(!keys(s,['year','height','spread','leafHeight'])||!integer(s.year,1,10)||!within(s.height,p.height,60)||!within(s.spread,p.spread,60)||!within(s.leafHeight,p.leafHeight,s.height)))bad();
      const m=p.management;if(m!==null&&(!keys(m,['height','spread','method','recovery'])||!within(m.height,.01,60)||!within(m.spread,.1,60)||!['thin','trim'].includes(m.method)||!integer(m.recovery,1,36)))bad();
      const taskIds=new Set();for(const t of p.tasks){if(!keys(t,['id','type','month','repeat','count','min','max'])||!integer(t.id,1,1000)||taskIds.has(t.id)||!Object.hasOwn(TASKS,t.type)||!integer(t.month,1,12)||!['annual','first'].includes(t.repeat)||!integer(t.count,1,t.type==='water'?31:1)||!(t.min===null&&t.max===null||within(t.min,0,10000)&&within(t.max,t.min,10000)))bad();taskIds.add(t.id);}
    }
  }return clone(v);
}
export function emptyDocument(width=8,depth=6){return {version:2,modelVersion:MODEL_VERSION,catalogVersion:CATALOG_VERSION,active:'A',plans:{A:{width,depth,outline:outlineFor('rectangle',width,depth),plants:[],zones:[],obstacles:[],hours:Array(12).fill(null),prep:0,sun:'part',moisture:'moist'},B:null},view:{month:6,year:0,reference:false,footprints:false,camera:null}};}
export function sampleDocument(){const doc=emptyDocument();doc.plans.A.plants=[['maple',1.6,1.5],['hydrangea',6.2,1.4],['rose',2,3.7],['salvia',3.1,4.2],['echinacea',4,4.1],['grass',5.6,3.9],['hosta',1.3,2.7],['sedum',6.7,4.6]].map(([k,x,z],i)=>makePlant(k,i+1,x,z));doc.plans.A.zones=[{points:[[.5,.5],[3,.5],[3,4.8],[.5,4.8]]},{points:[[4.8,.5],[7.5,.5],[7.5,5.3],[4.8,5.3]]}];return doc;}

export function treeGalleryDocument(){
 const d=emptyDocument(20,13),specimens=[['Prunus x yedoensis',3.3,3,3.6],['Cercidiphyllum japonicum',10,3,4.2],['Metasequoia glyptostroboides',16,3,5.2],['Zelkova serrata',3.3,9.6,3.6],['Salix babylonica',10,9.6,3.5],['Ginkgo biloba',16,9.6,4.4]];
 d.plans.A.plants=specimens.flatMap(([latin,x,z,h],i)=>{const item=Object.entries(CATALOG).find(([,v])=>v.latin===latin);if(!item)return [];const p=makePlant(item[0],i+1,x,z);const ratio=p.spread/p.height;p.height=h;p.spread=round(h*ratio);p.leafHeight=h;p.role='reference';return [p];});return d;
}
export function annualGalleryDocument(){
 const d=emptyDocument(5,4),entries=Object.entries(CATALOG),choose=predicate=>entries.find(([,p])=>predicate(p))?.[0];
 const ids=['hosta',choose(p=>p.form==='hosta'&&p.appearance?.leafPattern==='margin'),choose(p=>p.form==='heuchera'&&p.appearance?.leafColor),choose(p=>p.form==='hellebore'&&p.appearance?.flowerLayers===3),'salvia',choose(p=>p.form==='fivepetal'&&p.appearance?.leafPattern==='silverVeins')||'echinacea'];
 d.plans.A.plants=ids.filter(Boolean).map((id,i)=>{const p=makePlant(id,i+1,1+(i%3)*1.5,1+Math.floor(i/3)*1.9);p.height=id==='salvia'?.55:.45;p.spread=.85;p.leafHeight=.3;p.role='reference';return p;});return d;
}
