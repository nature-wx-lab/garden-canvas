import test from 'node:test';
import assert from 'node:assert/strict';
import {CATALOG_VERSION} from '../site/catalog.js';
import {emptyDocument,sampleDocument,validateDocument,makePlant,clone,outlineFor,validOutline,contained,canPlant,stateAt,replacePlant,editSize,budget,calendar,taskEvents,observations,pondDepthAt,plantBaseAt,plantSizeLimits} from '../site/model.js';
const view=(year,month,reference=false)=>({year,month,reference,footprints:false,camera:null});
const fixture=()=>{const d=emptyDocument();d.plans.A.plants=[makePlant('maple',1,2,2)];return d;};
const task=(type,month,repeat='annual',min=10,max=20,count=1)=>({id:1,type,month,repeat,min,max,count});
test('water-surface flowering disappears at the same depth boundary as the rendered flowers',()=>{
 for(const kind of ['p-9802ede000e2','p-891f594612ae']){
  const plant=makePlant(kind,1,2,2);
  assert.equal(stateAt(plant,{...view(0,5),waterDepth:.019}).bloom,true);
  assert.equal(stateAt(plant,{...view(0,5),waterDepth:.02}).bloom,false);
  assert.equal(stateAt(plant,{...view(0,5),waterDepth:.3}).bloom,false);
  assert.equal(stateAt(plant,{...view(0,1),waterDepth:0}).bloom,false);
 }
});
test('recent released catalog saves preserve both plans and camera without mutating input',()=>{
 const doc=fixture();doc.plans.A.plants[0].height=.83;doc.plans.A.plants[0].leafHeight=.4;doc.plans.A.plants[0].price=1245;doc.plans.A.plants[0].locked=true;doc.plans.B=clone(doc.plans.A);doc.plans.B.plants[0].id=2;doc.active='B';doc.view={...doc.view,month:9,year:3,camera:{position:[4,3,5],target:[0,0,0]}};
 for(const revision of ['2026-10-18.10','2026-10-18.12']){const saved={...clone(doc),catalogVersion:revision},before=clone(saved),opened=validateDocument(saved);assert.deepEqual(saved,before);assert.deepEqual(opened,{...doc,catalogVersion:CATALOG_VERSION});}
 const unsupported={...clone(doc),catalogVersion:'2099-01-01.999'},before=clone(unsupported);assert.throws(()=>validateDocument(unsupported));assert.deepEqual(unsupported,before);
});

test('released catalogue revisions preserve saved garden contents when models are enriched',()=>{
 const original=fixture();original.plans.A.plants.push(makePlant('p-281a043a4b8a',2,5,4));
 for(const revision of ['2026-10-10.4','2026-10-10.5','2026-10-10.6','2026-10-10.7','2026-10-10.53','2026-10-10.54','2026-10-10.55','2026-10-10.56','2026-10-10.57','2026-10-10.58','2026-10-12.1','2026-10-12.2','2026-10-12.3','2026-10-12.4','2026-10-13.4','2026-10-13.5','2026-10-13.6','2026-10-13.7','2026-10-13.8','2026-10-13.9','2026-10-13.10','2026-10-13.11','2026-10-13.12','2026-10-13.13','2026-10-13.14','2026-10-13.15','2026-10-13.16','2026-10-13.17','2026-10-13.18','2026-10-13.19','2026-10-13.20','2026-10-13.21','2026-10-13.22','2026-10-13.23','2026-10-13.24','2026-10-13.25','2026-10-13.26','2026-10-13.27','2026-10-13.28','2026-10-13.29','2026-10-13.30','2026-10-13.31','2026-10-13.32','2026-10-13.33','2026-10-13.34','2026-10-13.35','2026-10-13.36','2026-10-13.37','2026-10-13.38','2026-10-13.39','2026-10-13.40','2026-10-13.41','2026-10-13.42','2026-10-13.43','2026-10-13.44','2026-10-13.45','2026-10-13.46','2026-10-14.1','2026-10-14.2','2026-10-14.3','2026-10-14.4','2026-10-14.15','2026-10-14.16','2026-10-14.17','2026-10-14.18','2026-10-14.19','2026-10-14.20','2026-10-14.21','2026-10-14.22','2026-10-14.23','2026-10-14.24','2026-10-14.25','2026-10-14.26','2026-10-14.27','2026-10-14.28','2026-10-14.29','2026-10-14.30','2026-10-14.31','2026-10-14.32','2026-10-14.33','2026-10-14.34','2026-10-14.35','2026-10-14.36','2026-10-14.37','2026-10-14.38','2026-10-14.39','2026-10-14.40','2026-10-14.41','2026-10-14.42','2026-10-14.43','2026-10-14.44','2026-10-14.45','2026-10-14.46','2026-10-14.47','2026-10-14.48','2026-10-14.49','2026-10-14.50','2026-10-14.51','2026-10-14.52','2026-10-14.53','2026-10-14.54','2026-10-14.55','2026-10-15.1','2026-10-15.2','2026-10-15.3','2026-10-15.4','2026-10-15.5','2026-10-15.6','2026-10-15.7','2026-10-15.8','2026-10-15.9','2026-10-15.10','2026-10-15.11','2026-10-15.12','2026-10-15.13','2026-10-15.14','2026-10-15.15','2026-10-15.16','2026-10-15.17','2026-10-15.18','2026-10-15.19','2026-10-15.20','2026-10-15.21','2026-10-15.22','2026-10-15.23','2026-10-15.24','2026-10-15.25','2026-10-15.26','2026-10-15.27','2026-10-15.28','2026-10-15.29','2026-10-15.30','2026-10-15.31','2026-10-15.32','2026-10-15.33','2026-10-15.34','2026-10-15.35','2026-10-15.36','2026-10-15.37','2026-10-15.38','2026-10-15.39','2026-10-15.40','2026-10-15.41','2026-10-15.42','2026-10-15.43','2026-10-15.44','2026-10-15.45','2026-10-15.46','2026-10-15.47','2026-10-15.48','2026-10-15.49','2026-10-15.50','2026-10-15.51','2026-10-15.52','2026-10-16.1','2026-10-16.2','2026-10-16.3','2026-10-16.4','2026-10-16.5','2026-10-16.6','2026-10-16.7','2026-10-16.8','2026-10-16.9','2026-10-16.10','2026-10-16.11','2026-10-16.12','2026-10-18.1','2026-10-18.2','2026-10-18.3','2026-10-18.4','2026-10-18.5','2026-10-18.6','2026-10-18.7','2026-10-18.8','2026-10-18.9','2026-10-18.10','2026-10-18.11','2026-10-18.12','2026-10-18.13','2026-10-18.14','2026-10-18.15','2026-10-18.16','2026-10-18.17','2026-10-18.18','2026-10-18.19','2026-10-18.20','2026-10-18.21','2026-10-18.22','2026-10-18.23','2026-10-18.24','2026-10-18.25','2026-10-18.26','2026-10-18.27','2026-10-18.28','2026-10-18.29','2026-10-18.30','2026-10-18.31','2026-10-18.32','2026-10-18.33','2026-10-18.34','2026-10-18.35','2026-10-18.36','2026-10-18.37','2026-10-18.38','2026-10-18.39','2026-10-18.40','2026-10-18.41','2026-10-18.42','2026-10-18.43','2026-10-18.44','2026-10-18.45','2026-10-18.46','2026-10-18.47','2026-10-18.48','2026-10-18.49','2026-10-18.50','2026-10-18.51','2026-10-18.52','2026-10-18.53','2026-10-18.54','2026-10-18.55','2026-10-18.56','2026-10-18.57','2026-10-18.58','2026-10-14.14','2026-10-14.13','2026-10-14.12','2026-10-14.11','2026-10-14.10','2026-10-14.9','2026-10-14.8','2026-10-14.7','2026-10-14.6','2026-10-14.5',...Array.from({length:62},(_,i)=>`2026-10-11.${i+1}`)]){
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
test('raoulia alone uses millimetre input limits and unrounded initial sizes',()=>{
 const kind='p-27d773c2c05a',p=makePlant(kind,1,2,2),other=makePlant('hosta',2,3,2);
 assert.deepEqual([p.height,p.spread,p.leafHeight],[.006,.3,.003]);
 assert.deepEqual(plantSizeLimits(kind),{minHeight:.003,minLeafHeight:.001,step:.001,digits:3});
 assert.deepEqual(plantSizeLimits('hosta'),{minHeight:.01,minLeafHeight:.005,step:.01,digits:2});
 assert.deepEqual([other.height,other.spread,other.leafHeight],[.35,.3,.19]);
 const exchanged=replacePlant(other,kind);assert.deepEqual([exchanged.height,exchanged.spread,exchanged.leafHeight],[.006,.3,.003]);
});
test('raoulia size, scenario and management survive JSON without relaxing other species',()=>{
 const d=emptyDocument(),p=makePlant('p-27d773c2c05a',1,2,2);d.plans.A.plants=[p];
 Object.assign(p,{height:.003,leafHeight:.001,scenario:{year:2,height:.009,spread:.4,leafHeight:.004},management:{height:.003,spread:.2,method:'trim',recovery:6}});
 assert.deepEqual(validateDocument(JSON.parse(JSON.stringify(d))),d);
 for(const change of [q=>q.height=.00299,q=>q.leafHeight=.00099,q=>q.leafHeight=.00301,q=>q.management.height=.00299,q=>q.scenario.height=.00299,q=>q.scenario.leafHeight=.00099,q=>q.scenario.leafHeight=.01,q=>q.height=NaN]){const bad=clone(d);change(bad.plans.A.plants[0]);assert.throws(()=>validateDocument(bad));}
 const other=emptyDocument();other.plans.A.plants=[makePlant('hosta',1,2,2)];
 for(const change of [q=>q.height=.003,q=>q.leafHeight=.001,q=>q.management={height:.003,spread:.2,method:'trim',recovery:6}]){const bad=clone(other);change(bad.plans.A.plants[0]);assert.throws(()=>validateDocument(bad));}
});
test('raoulia millimetre growth and cutback apply while ordinary pruning limits stay intact',()=>{
 const p=makePlant('p-27d773c2c05a',1,2,2);p.scenario={year:2,height:.01,spread:.4,leafHeight:.005};
 const middle=stateAt(p,view(1,1));assert.ok(Math.abs(middle.height-.008)<1e-12);assert.ok(Math.abs(middle.leafHeight-.004)<1e-12);
 p.scenario=null;p.management={height:.003,spread:.2,method:'trim',recovery:6};p.tasks=[task('cutback',6)];
 assert.equal(stateAt(p,view(0,5)).height,.006);const cut=stateAt(p,view(0,6));assert.equal(cut.unsupported,false);assert.equal(cut.height,.003);assert.equal(cut.leafHeight,.003);assert.equal(stateAt(p,view(0,12)).height,.006);
 const other=makePlant('hosta',2,3,2);other.management={height:.01,spread:.2,method:'trim',recovery:6};other.tasks=[task('cutback',6)];const unchanged=stateAt(other,view(0,6));assert.equal(unchanged.unsupported,true);assert.equal(unchanged.height,other.height);
});
test('raoulia rests just above the visible zone surface and ordinary bases stay unchanged',()=>{
 const d=emptyDocument(),plan=d.plans.A,p=makePlant('p-27d773c2c05a',1,2,2),other=makePlant('hosta',2,2,2);
 assert.equal(plantBaseAt(plan,p),.0008);assert.equal(plantBaseAt(plan,other),.012);
 plan.zones=[{kind:'soil',points:[[1,1],[4,1],[4,4],[1,4]]},{kind:'soil',points:[[1.5,1.5],[3,1.5],[3,3],[1.5,3]]}];
 assert.ok(Math.abs(plantBaseAt(plan,p)-.007)<1e-12);p.x=1.25;assert.ok(Math.abs(plantBaseAt(plan,p)-.0068)<1e-12);p.x=6;assert.equal(plantBaseAt(plan,p),.0008);assert.equal(plantBaseAt(plan,other),.012);
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
import {Box3,PerspectiveCamera,Vector3,Group} from '../site/vendor/three.module.js';
import {OrbitControls} from '../site/vendor/OrbitControls.js';

test('water zones preserve old soil plans and strictly validate new surface kinds',()=>{
 const old=sampleDocument();assert.deepEqual(validateDocument(old),old);
 const d=sampleDocument();d.plans.A.zones[0].kind='water';d.plans.A.zones[1].kind='soil';
 assert.deepEqual(validateDocument(JSON.parse(JSON.stringify(d))),d);
 for(const kind of ['pond','__proto__',null,{},1]){const bad=clone(d);bad.plans.A.zones[0].kind=kind;assert.throws(()=>validateDocument(bad));}
 const bad=clone(d);bad.plans.A.zones[0].depth=3;assert.throws(()=>validateDocument(bad));
});

import {pondMaskCode,CAMERA_FLOOR,CAMERA_MAX_POLAR,keepCameraAboveGround,flowerInspectionView} from '../site/scene.js';
test('flower observation fits upright hanging and low anchors above ground without changing saved gardens',()=>{
 for(const aspect of [.6,1,2])for(const [height,axis]of [[.025,[0,1,0]],[.40,[0,-1,0]],[1.2,[0,-.8,.6]]]){
  const group=new Group();group.position.set(2,.012,-3);group.rotation.y=.6;group.scale.setScalar(.7);group.userData.flowerTargets=[{origin:[.02,height,.01],axis,radius:.04}];const before=JSON.stringify(group.userData.flowerTargets),pose=flowerInspectionView(group,aspect),camera=new PerspectiveCamera(40,aspect,.01,650);assert.ok(pose);assert.ok(pose.position.every(Number.isFinite));assert.ok(pose.target.every(Number.isFinite));assert.ok(pose.position[1]>=CAMERA_FLOOR);assert.equal(JSON.stringify(group.userData.flowerTargets),before);camera.position.fromArray(pose.position);camera.lookAt(new Vector3(...pose.target));camera.updateMatrixWorld();const target=new Vector3(...pose.target).project(camera);assert.ok(Math.abs(target.x)<1e-8&&Math.abs(target.y)<1e-8,'flower target remains centered after ground clamping');assert.ok(target.z>-1&&target.z<1,'target stays inside camera clipping');
  const doc=fixture(),saved=clone(doc);doc.view.camera=pose;assert.deepEqual(validateDocument(clone(doc)).view.camera,pose);assert.deepEqual(doc.plans,saved.plans,'observation changes no garden plants or dimensions');
 }
 for(const anchors of [undefined,{},[],[null],[{}],[{origin:[0,1],axis:[0,1,0],radius:.04}],[{origin:[0,NaN,0],axis:[0,1,0],radius:.04}],[{origin:[0,1,0],axis:[0,0,0],radius:.04}],[{origin:[0,1,0],axis:[0,1,0],radius:0}]]){const group=new Group();group.userData.flowerTargets=anchors;assert.equal(flowerInspectionView(group),null);}
 assert.equal(flowerInspectionView(null),null);
});
test('flower observation uses visible geometry anchors and never offers dormant or absent flowers',()=>{
 for(const [id,month,off]of [['p-766ad87ba1b2',8,1],['p-e1e2a401d139',6,9],['p-b2237cff2e6a',2,8],['p-c02feba517e0',5,7],['p-dcf9b2106055',4,7],['p-f6e75c6600bc',4,8]]){
  const p=makePlant(id,39100,2,2),before=clone(p),g=plantModel(p,view(0,month)),rest=plantModel(p,view(0,off));try{assert.ok(g.userData.flowerTargets?.length>0,id);assert.ok(g.userData.flowerTargets.length<=16,id);assert.ok(flowerInspectionView(g),id);assert.equal(flowerInspectionView(rest),null,id);assert.deepEqual(p,before,id);}finally{for(const group of [g,rest])for(const m of group.children){m.geometry?.dispose();if(m.isInstancedMesh)m.dispose();}}
 }
});

test('flower inspection retains an above-ground look-up camera and floor clamping keeps its target in view',()=>{
 const doc=fixture();doc.view.camera={position:[.20,.18,.10],target:[0,.40,0]};assert.deepEqual(validateDocument(clone(doc)),doc);
 const camera=new PerspectiveCamera(40,1,.01,650),controls=new OrbitControls(camera,null);controls.maxPolarAngle=CAMERA_MAX_POLAR;controls.minDistance=.12;controls.addEventListener('change',()=>keepCameraAboveGround(camera,controls.target));
 camera.position.fromArray(doc.view.camera.position);controls.target.fromArray(doc.view.camera.target);controls.update();assert.ok(camera.position.y<controls.target.y,'a hanging flower can be viewed from below');assert.ok(camera.position.y>=CAMERA_FLOOR);assert.ok(camera.position.distanceTo(new Vector3(...doc.view.camera.position))<1e-10,'restoring a valid saved camera preserves the low angle');
 for(const targetY of [0,.4]){
  controls.target.set(0,targetY,0);camera.position.set(.2,-.2,.1);controls.update();assert.ok(camera.position.y>=CAMERA_FLOOR&&camera.position.y<CAMERA_FLOOR+1e-6);const expected=controls.target.clone().sub(camera.position).normalize();assert.ok(camera.getWorldDirection(new Vector3()).distanceTo(expected)<1e-10,'clamped camera still looks at its target');controls.update();assert.ok(camera.position.y>=CAMERA_FLOOR);
 }
});
test('submerged model bases follow pond depth and ordinary plants stay at surface',()=>{
 const doc=emptyDocument(8,6),p=makePlant('p-790697efed42',12101,2,2);doc.plans.A.zones=[{kind:'water',depth:.4,points:[[1,1],[4,1],[4,4],[1,4]]}];
 assert.equal(plantBaseAt(doc.plans.A,p),-.388);assert.equal(stateAt(p,{...doc.view,waterDepth:.4}).waterDepth,.4);
 p.x=6;assert.equal(plantBaseAt(doc.plans.A,p),.012);
});

test('pond depth preserves flat legacy plans and overlapping zones use the last zone',()=>{
 const d=emptyDocument(),p=d.plans.A,pts=[[1,1],[5,1],[5,4],[1,4]];p.zones=[{points:pts,kind:'water',depth:.5},{points:[[3,2],[6,2],[6,5],[3,5]],kind:'water',depth:.3},{points:[[1.5,1.5],[2.5,1.5],[2.5,2.5],[1.5,2.5]],kind:'soil'}];
 assert.deepEqual(validateDocument(JSON.parse(JSON.stringify(d))),d);assert.equal(pondDepthAt(p,1.2,1.2),.5);assert.equal(pondDepthAt(p,4,3),.3);assert.equal(pondDepthAt(p,2,2),0);assert.equal(pondDepthAt(p,7,5),0);
 assert.equal(plantBaseAt(p,makePlant('maple',3,4,3)),.012);
 for(const depth of [0,.01,.3,2]){const good=clone(d);good.plans.A.zones[0].depth=depth;assert.doesNotThrow(()=>validateDocument(good));}
 for(const depth of [-.1,2.01,NaN,Infinity,'0.3',null]){const bad=clone(d);bad.plans.A.zones[0].depth=depth;assert.throws(()=>validateDocument(bad));}
 const bad=clone(d);bad.plans.A.zones[2].depth=.2;assert.throws(()=>validateDocument(bad));delete p.zones[0].depth;assert.equal(pondDepthAt(p,1.2,1.2),0);assert.doesNotThrow(()=>validateDocument(d));
 const mask=pondMaskCode(p);assert.ok(!mask.includes('--'));assert.ok(!mask.includes('/(0.00000)'));assert.ok(mask.includes('gardenPondDepth=(0.30000)'));assert.ok(mask.includes('gardenZoneOwner=(2.00000)'));
});
