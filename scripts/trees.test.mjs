import test from 'node:test';
import assert from 'node:assert/strict';
import {CATALOG,makePlant,stateAt,treeGalleryDocument,validateDocument} from '../site/model.js';
import {TREE_PROFILES,treeProfile} from '../site/tree-profiles.js';
import {treeSkeleton} from '../site/tree-model.js';
import {seasonAt,searchCatalog} from '../site/catalog-search.js';
import {plantModel} from '../site/vegetation.js';
import {detailedFlower} from '../site/plant-detail.js';
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

test('opposite leaf pairs share nodes and terminal leaf clusters leave the inner shoot bare',async()=>{
 const {twigLeafSites}=await import('../site/tree-model.js');
 const tip={a:[0,0,0],b:[0,1,0],angle:.2};
 const opposite=twigLeafSites(tip,8,'opposite');
 for(let i=0;i<8;i+=2){assert.deepEqual(opposite[i].at,opposite[i+1].at);assert.ok(Math.abs(opposite[i+1].angle-opposite[i].angle-Math.PI)<1e-9);}
 const alternate=twigLeafSites(tip,8,'alternate');assert.equal(new Set(alternate.map(s=>s.at[1])).size,8);
 const terminal=twigLeafSites(tip,6,'alternate',true);assert.ok(terminal.every(s=>s.at[1]>=.62));
});
test('native tree foliage and flower architectures render all twelve months without changing the winter skeleton',()=>{
 const ids=['p-ad5f6f3599b3','p-40ae63adf07a','p-ed05ee7abd7d','p-03b2490ecb73','p-2bcf9e0df49e','p-4821ee5374e9','p-70d16c4a0245','p-bb669fddd8e8'];
 for(const id of ids){
  const info=CATALOG[id],p={...makePlant(id,815,2,2),height:2,leafHeight:2,spread:1.8};let wood;
  for(let month=1;month<=12;month++){
   const g=plantModel(p,{month,year:0,reference:false},.45),branch=meshKind(g,'wood');assert.ok(branch,info.label);
   if(wood)assert.deepEqual(branch.instanceMatrix.array,wood,info.label);else wood=branch.instanceMatrix.array.slice();
   if(month===1)assert.equal(!!meshKind(g,'leaf'),info.leaf==='evergreen',info.label);
   for(const mesh of g.children)assert.ok([...mesh.instanceMatrix.array].every(Number.isFinite),info.label+' '+month);
   dispose(g);
  }
 }
 assert.equal(treeProfile(CATALOG['p-40ae63adf07a']).leafShape,'tridentMaple');
 assert.equal(seasonAt(CATALOG['p-bb669fddd8e8'],10).bloom,true);assert.equal(seasonAt(CATALOG['p-bb669fddd8e8'],4).bloom,false);
});
test('white birch, dissected maple, fringe trees and laurel preserve distinct blades and seasonal wood',()=>{
 const ids=['p-099311434563','p-8989a4f8a978','p-be19e942796c','p-c96a46e05e7c','p-0fef6c3a99a6','p-d31d2a2018c0','p-6c21ebc26883','p-0f0f86aa7af9','p-706096647827','p-1e717a58d222','p-b1b31b5fe68a'];
 for(const id of ids){
  const p={...makePlant(id,581,2,2),height:2,leafHeight:2,spread:1.8},info=CATALOG[id];let winterWood;
  for(const month of [1,5,7]){
   const g=plantModel(p,{month,year:0,reference:false},.45),wood=g.children.filter(m=>m.userData.component.startsWith('wood')).map(m=>[...m.instanceMatrix.array]);
   assert.ok(wood.length,info.label);if(month===1)winterWood=wood;else assert.deepEqual(wood,winterWood,info.label);
   const hasLeaves=g.children.some(m=>m.userData.component.startsWith('leaf'));assert.equal(hasLeaves,month!==1||info.leaf==='evergreen',info.label);
   if(month===7&&info.appearance.leafShape!=='compound')assert.ok(g.children.some(m=>m.geometry.userData[info.appearance.leafShape]),info.label);
   if(month===5&&info.appearance.architecture==='fringeTree')assert.ok(g.children.some(m=>m.geometry.userData.fringePetal));
   if(id==='p-099311434563')assert.ok(g.children.some(m=>m.userData.component==='wood-birchPaper'));
   for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),info.label);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),info.label);}dispose(g);
  }
 }
 assert.equal(treeProfile(CATALOG['p-c96a46e05e7c']).habit,'spreading');
 const maple=treeSkeleton({...treeProfile(CATALOG['p-8989a4f8a978']),architecture:'laceMaple'},581);assert.ok(maple.tips.every(t=>t.b[1]<t.a[1]));
 const bay=CATALOG['p-1e717a58d222'];assert.equal(bay.variegated,false);assert.equal(bay.appearance.leafPattern,undefined);
 const parts=shape=>{const out=[];detailedFlower({add:(g,k)=>out.push({g,k}),branch(){}},{x:0,y:0,z:0,r:.016,color:'#eeeecc',shape},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return out;};
 assert.equal(parts('fringeFlower').filter(p=>p.g==='fringePetal').length,4);assert.equal(parts('fringeFlower').filter(p=>p.k==='anther').length,2);
 assert.equal(parts('laurelFlower').filter(p=>p.g==='petal').length,4);assert.equal(parts('laurelFlower').filter(p=>p.k==='anther').length,10);
});
