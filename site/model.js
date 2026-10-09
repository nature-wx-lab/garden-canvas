export const CATALOG = Object.freeze({
  deciduous: { label: '落葉樹', height: 2.4, spread: 1.8 },
  evergreen: { label: '常緑樹', height: 2.0, spread: 1.5 },
  flower: { label: '花の宿根草', height: 0.6, spread: 0.65 },
  grass: { label: 'グラス', height: 0.8, spread: 0.7 }
});
export const clone = value => JSON.parse(JSON.stringify(value));
export function outlineFor(shape, width, depth) {
  return shape === 'lshape' ? [[0,0],[width,0],[width,depth*.55],[width*.55,depth*.55],[width*.55,depth],[0,depth]] : [[0,0],[width,0],[width,depth],[0,depth]];
}
export function area(points) { return Math.abs(points.reduce((s,p,i) => { const q=points[(i+1)%points.length]; return s+p[0]*q[1]-q[0]*p[1]; },0)/2); }
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const onSegment=(p,a,b)=>Math.abs(cross(a,b,p))<1e-8 && p[0]>=Math.min(a[0],b[0])-1e-8 && p[0]<=Math.max(a[0],b[0])+1e-8 && p[1]>=Math.min(a[1],b[1])-1e-8 && p[1]<=Math.max(a[1],b[1])+1e-8;
export function inside(x,z,points) {
  let result=false;
  for(let i=0,j=points.length-1;i<points.length;j=i++) {
    const a=points[i],b=points[j]; if(onSegment([x,z],a,b))return true;
    if((a[1]>z)!==(b[1]>z) && x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])result=!result;
  } return result;
}
export function validOutline(points,width,depth) {
  if(!Array.isArray(points)||points.length<3||points.length>16)return false;
  if(points.some(p=>!Array.isArray(p)||p.length!==2||p.some(v=>!Number.isFinite(v))||p[0]<0||p[0]>width||p[1]<0||p[1]>depth))return false;
  if(area(points)<1)return false;
  for(let i=0;i<points.length;i++) {
    const a=points[i],b=points[(i+1)%points.length];
    if(Math.hypot(a[0]-b[0],a[1]-b[1])<.1)return false;
    for(let j=i+1;j<points.length;j++) {
      if(j===i+1||(i===0&&j===points.length-1))continue;
      const c=points[j],d=points[(j+1)%points.length];
      if(onSegment(a,c,d)||onSegment(b,c,d)||onSegment(c,a,b)||onSegment(d,a,b)||(cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0))return false;
    }
  } return true;
}
const within=(v,min,max)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
const exactKeys=(o,keys)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).sort().join('|')===keys.sort().join('|');
export function validatePlan(value) {
  const bad=()=>{throw new Error('対応していない庭データです。元の庭は変更していません。');};
  if(!exactKeys(value,['version','width','depth','outline','plants','month'])||value.version!==1||!within(value.width,2,30)||!within(value.depth,2,30)||!Number.isInteger(value.month)||!within(value.month,1,12)||!validOutline(value.outline,value.width,value.depth)||!Array.isArray(value.plants)||value.plants.length>100)bad();
  const ids=new Set();
  for(const p of value.plants) {
    if(!exactKeys(p,['id','kind','x','z','height','spread'])||!Number.isSafeInteger(p.id)||p.id<1||p.id>1000000||ids.has(p.id)||!Object.hasOwn(CATALOG,p.kind)||!within(p.height,.1,8)||!within(p.spread,.1,6)||!within(p.x,0,value.width)||!within(p.z,0,value.depth)||!inside(p.x,p.z,value.outline))bad();
    ids.add(p.id);
  }
  return clone(value);
}
export function samplePlan() {
  const plants=[['deciduous',1.8,1.8],['evergreen',6.2,1.5],['flower',2.5,4.2],['flower',3.3,4.0],['flower',4.1,4.3],['grass',5.6,3.8],['grass',6.4,3.5]].map(([kind,x,z],i)=>({id:i+1,kind,x,z,height:CATALOG[kind].height,spread:CATALOG[kind].spread}));
  return {version:1,width:8,depth:6,outline:outlineFor('rectangle',8,6),plants,month:6};
}
