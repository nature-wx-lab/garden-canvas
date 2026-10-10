import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyDocument,sampleDocument,validateDocument,makePlant,clone,outlineFor,validOutline,contained,canPlant,stateAt,replacePlant,editSize,budget,calendar,taskEvents,observations} from '../site/model.js';
const view=(year,month,reference=false)=>({year,month,reference,footprints:false,camera:null});
const fixture=()=>{const d=emptyDocument();d.plans.A.plants=[makePlant('maple',1,2,2)];return d;};
const task=(type,month,repeat='annual',min=10,max=20,count=1)=>({id:1,type,month,repeat,min,max,count});
test('released catalogue revisions preserve saved garden contents when models are enriched',()=>{
 const original=fixture();original.plans.A.plants.push(makePlant('p-281a043a4b8a',2,5,4));
 for(const revision of ['2026-10-10.4','2026-10-10.5','2026-10-10.6','2026-10-10.7','2026-10-10.53','2026-10-10.54','2026-10-10.55','2026-10-10.56','2026-10-10.57','2026-10-10.58',...Array.from({length:13},(_,i)=>`2026-10-11.${i+1}`)]){
  const saved={...clone(original),catalogVersion:revision};assert.deepEqual(validateDocument(saved),original);
 }
});
test('new document round-trips two plans, task ranges and camera without losing semantics',()=>{const d=sampleDocument();d.plans.B=clone(d.plans.A);d.active='B';d.plans.B.plants[0].tasks=[task('prune',2)];d.view.camera={position:[4,6,8],target:[0,1,0]};assert.deepEqual(validateDocument(JSON.parse(JSON.stringify(d))),d);});
test('v1 file migrates positions and preserves unidentified plant status',()=>{const old={version:1,width:8,depth:6,outline:outlineFor('rectangle',8,6),plants:[{id:3,kind:'grass',x:2,z:2,height:.8,spread:.7}],month:10};const d=validateDocument(old);assert.equal(d.plans.A.plants[0].kind,'legacy_grass');assert.equal(d.plans.A.plants[0].height,.8);assert.equal(d.view.month,10);assert.equal(d.version,2);});
test('invalid v1 fields, duplicate ids, unknown species and prototype names fail closed',()=>{for(const change of [d=>d.plans.A.plants.push(clone(d.plans.A.plants[0])),d=>d.plans.A.plants[0].kind='toString',d=>d.plans.A.plants[0].kind=['maple'],d=>{d.plans.B=d.plans.A;d.plans.A=null;d.active='B';},d=>d.plans.A.plants[0].kind='__proto__',d=>d.plans.A.plants[0].height=NaN,d=>d.plans.A.plants[0].email='unexpected',d=>d.plans.A.width=31,d=>d.view.year=11,d=>d.catalogVersion='future',d=>d.plans.A.plants[0].leafHeight=99]){const d=fixture();change(d);assert.throws(()=>validateDocument(d));}const d=fixture();d.plans.A=JSON.parse('{"__proto__":{}}');assert.throws(()=>validateDocument(d));});
test('limits constrain geometry, tasks, finite numbers and imported camera',()=>{for(const change of [d=>d.plans.A.plants=Array.from({length:101},(_,i)=>makePlant('salvia',i+1,2,2)),d=>d.plans.A.plants[0].tasks=Array.from({length:37},(_,i)=>({...task('prune',2),id:i+1})),d=>d.plans.A.hours[3]=Infinity,d=>d.view.camera={position:[0,0,0],target:[0,0,0]},d=>d.plans.A.plants[0].price=-1,d=>d.plans.A.plants[0].tasks=[task('prune',2,'annual',20,10)],d=>d.plans.A.plants[0].tasks=[task('prune',2,'annual',null,10)],d=>d.plans.A.plants[0].tasks=[task('prune',2,'annual',10,20,3)]]){const d=fixture();change(d);assert.throws(()=>validateDocument(d));}});
test('outline rejects self intersections and edges crossing a concave boundary',()=>{assert.equal(validOutline([[0,0],[8,6],[8,0],[0,6]],8,6),false);const l=outlineFor('lshape',8,6);assert.equal(contained([[1,1],[7,2],[2,5]],l),false);assert.equal(contained([[.5,.5],[2,.5],[2,2],[.5,2]],l),true);const notch=[[0,0],[8,0],[8,6],[4.01,6],[4.01,2],[4,2],[4,6],[0,6]];assert.equal(contained([[1,3],[7,3],[1,4]],notch),false);});
test('obstacles block planting and invalid geometry never silently drops plants',()=>{const d=fixture();d.plans.A.obstacles.push({type:'path',x:1,z:1,width:2,depth:2,height:.05});assert.equal(canPlant(d.plans.A,2,2),false);assert.throws(()=>validateDocument(d));assert.equal(d.plans.A.plants.length,1);});
test('garden zones and obstacles must remain fully inside the outline',()=>{const d=emptyDocument();d.plans.A.outline=outlineFor('lshape',8,6);d.plans.A.zones=[{points:[[1,1],[7,2],[2,5]]}];assert.throws(()=>validateDocument(d));d.plans.A.zones=[];d.plans.A.obstacles=[{type:'house',x:4,z:3,width:2,depth:2,height:2}];assert.throws(()=>validateDocument(d));});
test('unspecified annual growth stays unknown and mature reference is independent of elapsed year',()=>{const p=makePlant('maple',1,2,2);assert.equal(stateAt(p,view(5,6)).height,p.height);assert.equal(stateAt(p,view(5,6)).basis,'年次成長は未設定');assert.equal(stateAt(p,view(0,6,true)).height,stateAt(p,view(10,6,true)).height);assert.notEqual(stateAt(p,view(0,6,true)).height,p.height);});
test('year and season are separate; winter does not reset a perennial clump',()=>{const p=makePlant('hosta',1,2,2);p.scenario={year:3,height:.8,spread:1,leafHeight:.6};const winter=stateAt(p,view(3,1)),summer=stateAt(p,view(3,6));assert.equal(winter.spread,1);assert.equal(summer.spread,1);assert.equal(winter.winter,true);assert.equal(summer.bloom,true);});
test('future planting has no invented earlier history',()=>{const p=makePlant('salvia',1,2,2);p.start=24;p.scenario={year:3,height:.9,spread:.6,leafHeight:.4};assert.equal(stateAt(p,view(1,12)).present,false);assert.equal(stateAt(p,view(2,1)).height,p.height);assert.equal(stateAt(p,view(5,1)).height,.9);});
test('replacement preserves place and planting date, not price, model or tasks',()=>{const p=makePlant('rose',1,2,3);p.start=24;p.price=900;p.tasks=[task('prune',2)];const q=replacePlant(p,'hosta');assert.equal(q.start,24);assert.equal(q.x,p.x);assert.equal(q.id,p.id);assert.equal(q.price,null);assert.deepEqual(q.tasks,[]);assert.equal(q.height,.35);p.locked=true;assert.throws(()=>replacePlant(p,'hosta'));});
test('size changes invalidate obsolete prices and scenario targets',()=>{const p=makePlant('rose',1,2,2);p.price=1000;p.scenario={year:3,height:1,spread:1,leafHeight:1};assert.equal(editSize(p,p.height,p.spread,p.leafHeight).price,1000);const q=editSize(p,.7,.6,.6);assert.equal(q.price,null);assert.equal(q.scenario,null);});
test('low ground covers round-trip at their documented centimetre height while zero is rejected',()=>{
 const d=fixture(),p=d.plans.A.plants[0];Object.assign(p,{kind:'p-2a0099e60c2c',height:.03,leafHeight:.025,spread:.5});assert.equal(validateDocument(d).plans.A.plants[0].height,.03);
 p.height=0;assert.throws(()=>validateDocument(d));p.height=.03;p.leafHeight=.04;assert.throws(()=>validateDocument(d));
});
test('unknown price is not zero; existing and reference plants do not enter purchase total',()=>{const d=sampleDocument(),p=d.plans.A.plants;p[0].price=5000;p[1].role='existing';p[1].price=9000;p[2].role='reference';p[3].price=0;const b=budget(d.plans.A);assert.equal(b.total,5000);assert.equal(b.count,6);assert.equal(b.unknown,4);});
test('first year means first 12 months after planting, crossing the year boundary',()=>{const p=makePlant('rose',1,2,2);p.start=10;p.tasks=[task('feed',3,'first')];assert.equal(taskEvents(p,0).length,0);assert.equal(taskEvents(p,1).length,1);assert.equal(taskEvents(p,2).length,0);});
test('calendar and pruning appearance use identical event dates and deterministic jumps',()=>{const d=fixture(),p=d.plans.A.plants[0];p.management={height:1,spread:.6,method:'trim',recovery:6};p.tasks=[task('prune',3)];const before=stateAt(p,view(0,2)),at=stateAt(p,view(0,3)),late=stateAt(p,view(0,9));assert.equal(before.last,null);assert.equal(at.height,1);assert.equal(at.trunkHeight,before.trunkHeight);assert.equal(at.last.at,calendar(d.plans.A,0)[2].events[0].at);assert.equal(late.height,p.height);stateAt(p,view(5,10));assert.deepEqual(stateAt(p,view(0,3)),at);});
test('unachievable cut below structural trunk remains natural and explicitly unsupported',()=>{const p=makePlant('maple',1,2,2);p.management={height:.2,spread:.2,method:'trim',recovery:6};p.tasks=[task('prune',3)];const s=stateAt(p,view(0,3));assert.equal(s.unsupported,true);assert.equal(s.height,p.height);});
test('work estimate retains unknown durations, sums water visits and preparation only once per active month',()=>{const d=fixture(),p=d.plans.A.plants[0];p.tasks=[task('water',6,'annual',2,4,10),{...task('feed',6,'annual',null,null),id:2}];d.plans.A.prep=15;d.plans.A.hours[5]=.5;const c=calendar(d.plans.A,0);assert.equal(c[5].min,35);assert.equal(c[5].max,55);assert.equal(c[5].unknown,1);assert.equal(c[5].available,30);assert.equal(c[4].min,0);assert.equal(p.tasks.length,2);});
test('A/B deep copy can be edited without mutating original and preserves shared view',()=>{const d=fixture();d.plans.B=clone(d.plans.A);d.plans.B.plants[0].height=2;d.active='B';assert.equal(d.plans.A.plants[0].height,1.5);assert.equal(validateDocument(d).view.month,6);});
test('occupancy ignores not-yet-planted plants and distinguishes overlap from viability',()=>{const d=fixture();d.plans.A.plants.push(makePlant('rose',2,2.1,2));assert.equal(observations(d.plans.A,view(0,6)).overlap,1);d.plans.A.plants[1].start=12;assert.equal(observations(d.plans.A,view(0,6)).overlap,0);});

// Render-model invariants: seasons must not relocate woody branches or corrupt geometry.
import {plantModel,sharedGeometry} from '../site/vegetation.js';
const disposeModel=g=>g.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.isInstancedMesh)o.dispose();});
test('all plant forms produce finite independent wind geometry in summer and winter',()=>{
  for(const kind of ['maple','olive','rose','hydrangea','salvia','echinacea','lavender','hosta','grass','sedum','deciduous','evergreen','flower','legacy_grass'])for(const month of [1,8]){
    const p=makePlant(kind,17,2,2),g=plantModel(p,view(0,month));
    assert.equal(g.userData.plantId,p.id);
    g.traverse(o=>{if(!o.isInstancedMesh)return;assert.ok(o.count>0);assert.ok([...o.instanceMatrix.array].every(Number.isFinite));assert.ok([...o.geometry.attributes.position.array].every(Number.isFinite));assert.ok([...o.geometry.attributes.normal.array].every(Number.isFinite));assert.equal(o.geometry.attributes.gardenWind.count,o.count);assert.ok(o.customDepthMaterial);assert.ok(Number.isFinite(o.boundingSphere.radius));});disposeModel(g);
  }
  for(const geometry of sharedGeometry)assert.equal(geometry.attributes.gardenWind,undefined);
});
test('leaf loss preserves the same woody branch structure',()=>{
  for(const kind of ['maple','olive','rose','hydrangea']){
    const p=makePlant(kind,9,2,2),summer=plantModel(p,view(0,8)),winter=plantModel(p,view(0,1));
    const branches=g=>g.children.filter(o=>o.material?.customProgramCacheKey()==='garden-0.3-wood').map(o=>[...o.instanceMatrix.array]);
    assert.ok(JSON.stringify(branches(summer))===JSON.stringify(branches(winter)),kind+' branch positions changed');assert.deepEqual(summer.scale.toArray(),winter.scale.toArray(),kind+' seasonal scale changed');disposeModel(summer);disposeModel(winter);
  }
});
test('dense-garden detail reduction retains plant identity and reduces geometry instances',()=>{
  for(const kind of ['maple','hydrangea','grass']){
    const p={...makePlant(kind,21,2,2),height:2,spread:2,leafHeight:1.2},normal=plantModel(p,view(0,8),1),reduced=plantModel(p,view(0,8),.42);
    const count=g=>g.children.reduce((n,o)=>n+(o.count||0),0);
    assert.equal(normal.userData.plantId,reduced.userData.plantId);assert.ok(count(reduced)>0&&count(reduced)<count(normal));disposeModel(normal);disposeModel(reduced);
  }
});

test('maple uses broad palmate blades and preserves input dimensions',()=>{
  for(const [height,spread] of [[1.5,.85],[2.5,2.5]]){
    const p={...makePlant('maple',4,2,2),height,spread,leafHeight:height},g=plantModel(p,view(0,6));
    const leaves=g.children.find(o=>o.material?.customProgramCacheKey()==='garden-0.3-maple');assert.ok(leaves);
    leaves.geometry.computeBoundingBox();const bounds=leaves.geometry.boundingBox;
    assert.ok(bounds.max.x-bounds.min.x>1.2*(bounds.max.y-bounds.min.y),'blade should fan sideways, not form a vertical strap');
    let facingUp=0;for(let i=0;i<leaves.count;i++){const a=leaves.instanceMatrix.array,offset=i*16;const normalY=Math.abs(a[offset+9])/Math.hypot(a[offset+8],a[offset+9],a[offset+10]);if(normalY>.7)facingUp++;}
    assert.ok(facingUp/leaves.count>.75,'most blades should spread across the canopy rather than stand upright');
    g.updateMatrixWorld(true);const actual=new Box3().setFromObject(g);assert.ok(Math.abs(actual.max.y-height)<.001);assert.ok(actual.max.x<=spread/2+.001&&actual.min.x>=-spread/2-.001&&actual.max.z<=spread/2+.001&&actual.min.z>=-spread/2-.001);disposeModel(g);
  }
});
import {Box3} from '../site/vendor/three.module.js';

test('water zones preserve old soil plans and strictly validate new surface kinds',()=>{
 const old=sampleDocument();assert.deepEqual(validateDocument(old),old);
 const d=sampleDocument();d.plans.A.zones[0].kind='water';d.plans.A.zones[1].kind='soil';
 assert.deepEqual(validateDocument(JSON.parse(JSON.stringify(d))),d);
 for(const kind of ['pond','__proto__',null,{},1]){const bad=clone(d);bad.plans.A.zones[0].kind=kind;assert.throws(()=>validateDocument(bad));}
 const bad=clone(d);bad.plans.A.zones[0].depth=3;assert.throws(()=>validateDocument(bad));
});
