import test from 'node:test';
import assert from 'node:assert/strict';
import {CATALOG,makePlant,stateAt,treeGalleryDocument,validateDocument} from '../site/model.js';
import {TREE_PROFILES,treeProfile} from '../site/tree-profiles.js';
import {treeSkeleton} from '../site/tree-model.js';
import {seasonAt,searchCatalog} from '../site/catalog-search.js';
import {plantModel} from '../site/vegetation.js';
const find=latin=>Object.entries(CATALOG).find(([,p])=>p.latin===latin);
const meshKind=(g,kind)=>g.children.find(m=>m.userData.component===kind||m.userData.component?.startsWith(kind+'-'));
function dispose(g){for(const m of g.children){m.geometry?.dispose();if(m.isInstancedMesh)m.dispose();}}
test('rank coverage preserves each of 300 unique plants per retailer category and all 15 published weekly positions',()=>{
 const ranked=Object.values(CATALOG).flatMap(p=>(p.popularity||[]).map(r=>({p,r})));
 for(const category of ['草花','庭木']){const rows=ranked.filter(x=>x.r.publisher==='園芸ネット'&&x.r.category===category);assert.equal(rows.length,300);assert.deepEqual([...new Set(rows.map(x=>x.r.plantOrder))].sort((a,b)=>a-b),Array.from({length:300},(_,i)=>i+1));}
 assert.deepEqual(ranked.filter(x=>x.r.publisher==='おぎはら植物園').map(x=>x.r.rank).sort((a,b)=>a-b),Array.from({length:15},(_,i)=>i+1));
 assert.ok(searchCatalog(CATALOG,{popular:true}).every(([,p])=>p.popularity.length));
});
test('large native and familiar trees retain distinct botanical forms and published adult dimensions',()=>{
 for(const latin of ['Prunus x yedoensis','Cercidiphyllum japonicum','Cinnamomum camphora','Zelkova serrata','Metasequoia glyptostroboides','Ginkgo biloba','Salix babylonica']){const [id,p]=find(latin);assert.ok(p.height[1]>7);assert.ok(treeProfile(p));const plant=makePlant(id,1,2,2);assert.ok(stateAt(plant,{month:6,year:0,reference:true}).height>=p.height[1]);}
 assert.equal(treeProfile(find('Cinnamomum camphora')[1]).leaf,'evergreen');
 const spread=treeSkeleton(TREE_PROFILES['Prunus x yedoensis'],9),vase=treeSkeleton(TREE_PROFILES['Zelkova serrata'],9),cone=treeSkeleton(TREE_PROFILES['Metasequoia glyptostroboides'],9);
 assert.notDeepEqual(spread.segments,vase.segments);assert.notDeepEqual(vase.segments,cone.segments);
 const droops=treeSkeleton(TREE_PROFILES['Salix babylonica'],9).tips;assert.ok(droops.every(t=>t.b[1]<t.a[1]));
 const lower=cone.tips.filter(t=>t.b[1]<.5),upper=cone.tips.filter(t=>t.b[1]>.8),width=a=>a.reduce((s,t)=>s+Math.hypot(t.b[0],t.b[2]),0)/a.length;assert.ok(width(lower)>width(upper)*1.4);
});
test('seasonal foliage does not move branches, evergreen foliage persists and cherry blossoms precede leaves',()=>{
 for(const latin of ['Prunus x yedoensis','Cercidiphyllum japonicum','Ginkgo biloba']){const [id,info]=find(latin),p=makePlant(id,21,2,2);p.height=3;p.spread=2.5;p.leafHeight=3;
  const summer=plantModel(p,{month:6,year:0,reference:false}),winter=plantModel(p,{month:1,year:0,reference:false});
  assert.deepEqual(meshKind(summer,'wood').instanceMatrix.array,meshKind(winter,'wood').instanceMatrix.array);assert.ok(meshKind(summer,'leaf').count>1000);assert.ok(!meshKind(winter,'leaf'));dispose(summer);dispose(winter);
  assert.equal(seasonAt(info,10).autumn,true);
 }
 const cherry=find('Prunus x yedoensis')[1];assert.equal(seasonAt(cherry,4).bloom,true);assert.equal(seasonAt(cherry,4).leafDensity,0);assert.equal(seasonAt(cherry,6).leafDensity,1);
 assert.equal(seasonAt({leaf:'herb',form:'fivepetal',life:'annual',bloom:[1,2,3]},1).dormant,false);
 const camphor=find('Cinnamomum camphora')[1];assert.equal(seasonAt(camphor,1).leafDensity,1);assert.equal(seasonAt(camphor,11).autumn,false);
});
test('gallery, large input dimensions and both old catalog versions survive safe round trips',()=>{
 const d=treeGalleryDocument();assert.equal(d.plans.A.plants.length,6);assert.deepEqual(validateDocument(d),d);
 d.plans.A.plants[0].height=50;d.plans.A.plants[0].leafHeight=50;d.plans.A.plants[0].spread=25;assert.deepEqual(validateDocument(d),d);
 for(const catalogVersion of ['2026-10-09.1','2026-10-10.1']){const old={...d,catalogVersion};assert.equal(validateDocument(old).catalogVersion,d.catalogVersion);assert.equal(old.catalogVersion,catalogVersion);}
 assert.throws(()=>validateDocument({...d,catalogVersion:'future'}));
});
test('every tree leaf topology and low detail render finite independently animated geometry',()=>{
 const reps=new Map();for(const [id,p] of Object.entries(CATALOG)){const profile=treeProfile(p);if(profile&&!reps.has(profile.leafShape))reps.set(profile.leafShape,id);}
 for(const [shape,id] of reps){const p=makePlant(id,32,2,2),g=plantModel(p,{month:6,year:0,reference:false},.45);for(const m of g.children)if(m.isInstancedMesh){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),shape);assert.equal(m.geometry.attributes.gardenWind.count,m.instanceMatrix.count);}dispose(g);}
});
