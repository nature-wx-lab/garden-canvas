import test from 'node:test';
import assert from 'node:assert/strict';
import {CATALOG,makePlant,stateAt,annualGalleryDocument,validateDocument} from '../site/model.js';
import {APPEARANCE_DATA} from '../site/appearance-data.js';
import {seasonAt} from '../site/catalog-search.js';
import {plantModel} from '../site/vegetation.js';
import {drawTree} from '../site/tree-model.js';
const view=month=>({month,year:0,reference:false});
const dispose=g=>{for(const m of g.children){m.geometry?.dispose();if(m.isInstancedMesh)m.dispose();}};

test('every catalog entry has an explicit evidence record and no unsupported completion claim',()=>{
 assert.deepEqual(Object.keys(APPEARANCE_DATA).sort(),Object.keys(CATALOG).sort());
 const allowed=new Set(['sources','basis','status','unconfirmed','arrangement','inflorescence','flowerShape','habit','leafShape','leafTexture','leafColor','barkColor','barkPattern','petals','persistence','flowerMonths','flowerTiming','emergenceMonths','dormantMonths','leafPattern','patternColor','flowerLayers','flowerPattern','scientificName','phenologyRegion','leafLength','leafRelief','seasonalColors','stemColor','leaflets','compoundType','standingWinter','flowerSeasons','leafMargin','architecture','winterClimateSensitive']);
 for(const [id,a] of Object.entries(APPEARANCE_DATA)){
  assert.ok(Object.keys(a).every(k=>allowed.has(k)),id);assert.ok(['attributes','unconfirmed','partial'].includes(a.status));
  for(const source of a.sources){const u=new URL(source.url);assert.equal(u.protocol,'https:');assert.ok(['www.ogis.co.jp','www.engei.net','plants.ces.ncsu.edu','plantfinder.mobot.org','www.rhs.org.uk','item.rakuten.co.jp'].includes(u.hostname));assert.ok(['catalog-entry','species','genus'].includes(source.scope));}
  for(const [field,index] of Object.entries(a.basis)){assert.ok(Object.hasOwn(a,field));assert.ok(Number.isInteger(index)&&index>=0&&index<a.sources.length,id+':'+field);}
  for(const field of ['flowerMonths','emergenceMonths','dormantMonths'])if(a[field])assert.ok(a[field].length>0&&a[field].every(m=>Number.isInteger(m)&&m>=1&&m<=12),id);
  for(let m=1;m<=12;m++){const s=seasonAt(CATALOG[id],m);assert.ok(s.leafDensity>=0&&s.leafDensity<=1);assert.ok(s.leafScale>=0&&s.leafScale<=1);if(s.groundDormant)assert.equal(s.bloom,false);}
 }
});
test('winter loss removes the whole herbaceous plant while dormant trees keep their wood',()=>{
 const h=makePlant('hosta',301,2,2),winter=plantModel(h,view(1)),summer=plantModel(h,view(6));
 assert.equal(winter.children.length,0);assert.equal(winter.userData.groundDormant,true);assert.ok(summer.children.length>0);dispose(summer);
 const tree=plantModel(makePlant('maple',302,2,2),view(1));assert.ok(tree.children.some(m=>m.userData.component?.startsWith('wood')));assert.ok(!tree.children.some(m=>m.userData.component?.startsWith('leaf')));dispose(tree);
 const explicit={form:'hosta',leaf:'herb',bloom:[1],appearance:{persistence:'winterDormant',dormantMonths:[1,2]}};
 assert.equal(seasonAt(explicit,1).groundDormant,true);assert.equal(seasonAt(explicit,1).bloom,false);
});
test('semi-evergreen and basal winter leaves are not erased like fully dormant herbs',()=>{
 const semi={form:'botanical',leaf:'unknown',bloom:[],appearance:{persistence:'semiEvergreen'}},basal={...semi,appearance:{persistence:'semiDormant'}};
 assert.equal(seasonAt(semi,1).groundDormant,false);assert.ok(seasonAt(basal,1).leafDensity>0);assert.ok(seasonAt(basal,1).shootScale<.3);
 const summerRest={...semi,appearance:{persistence:'summerDormant'}};assert.equal(seasonAt(summerRest,7).groundDormant,true);assert.equal(seasonAt(summerRest,1).groundDormant,false);
});
test('source monthly flowering is shared by the calendar and the rendered state',()=>{
 const item=Object.entries(CATALOG).find(([,p])=>p.appearance?.flowerMonths&&p.form!=='unmodeled');assert.ok(item);
 const [id,info]=item,plant=makePlant(id,303,2,2);
 for(let m=1;m<=12;m++)assert.equal(stateAt(plant,view(m)).bloom,seasonAt(info,m).bloom);
});
test('source context does not confuse winter dieback, summer growth rest and retained seedheads',()=>{
 const named=label=>{const p=Object.values(CATALOG).find(p=>p.label===label);assert.ok(p,label);return p;};
 const panicum=named('パニカム ノースウインド');assert.equal(seasonAt(panicum,7).groundDormant,false);assert.equal(panicum.appearance.standingWinter,true);
 for(const name of ['イベリス ゴールデンキャンディ','ラベンダー シルバーサンド'])assert.equal(seasonAt(named(name),1).groundDormant,false);
 assert.equal(seasonAt(named('ガステリア 美鈴の富士'),7).groundDormant,false);
 const ephem=named('クリスマスローズ チベタヌス');assert.equal(seasonAt(ephem,4).bloom,true);for(const m of [1,7,10])assert.equal(seasonAt(ephem,m).groundDormant,true);
 const variable=named('マツバギク おひさま花火 リド マゼンタホワイトアイ');assert.equal(variable.appearance.winterClimateSensitive,true);assert.equal(seasonAt(variable,1).groundDormant,false);
 const summerTree={form:'shrub',leaf:'deciduous',bloom:[],appearance:{persistence:'summerDormant'}};
 assert.equal(seasonAt(summerTree,7).dormant,true);assert.equal(seasonAt(summerTree,7).groundDormant,false);assert.equal(seasonAt(summerTree,1).dormant,false);
});
test('a tree uses its sourced flower form rather than losing it to the branch angle',()=>{
 const flowers=[],b={branch(){},add(){}},appearance={flowerShape:'bell',inflorescence:'cyme',petals:5};
 drawTree(b,{profile:{habit:'rounded',leafShape:'leaf'},info:{appearance},p:{id:7},s:{height:2,spread:2,natural:{height:2,spread:2},leafDensity:1,flowerDensity:1},detail:.35},{bud:'bud',shade:(_r,c)=>c,flower(){assert.fail('generic flower fallback');},detailedFlower(_b,f){flowers.push(f);}});
 assert.ok(flowers.length>0);assert.ok(flowers.every(f=>f.shape==='bell'&&f.petals===5));
});
test('new leaf patterns and floral architectures produce finite geometry at both seasonal boundaries',()=>{
 const representatives=new Map();
 for(const [id,p] of Object.entries(CATALOG)){
  const a=p.appearance;if(p.form==='unmodeled'||!a?.leafShape)continue;
  const key=[p.form,a.leafShape,a.flowerShape,a.leafPattern,a.leafRelief,a.persistence].join('|');
  if(!representatives.has(key))representatives.set(key,id);
 }
 for(const [key,id] of representatives){
  const info=CATALOG[id];for(const month of [1,info.appearance.flowerMonths?.[0]||info.bloom[0]||6]){
   const g=plantModel(makePlant(id,304,2,2),view(month),.35);
   for(const m of g.children){if(m.isInstancedMesh){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),key);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),key);}}
   dispose(g);
  }
 }
});
test('the annual comparison garden is editable and survives a save round trip',()=>{
 const d=annualGalleryDocument();assert.equal(d.plans.A.plants.length,6);assert.deepEqual(validateDocument(d),d);
 assert.equal(d.plans.A.plants[0].kind,'hosta');assert.ok(d.plans.A.plants.some(p=>CATALOG[p.kind].form==='heuchera'));
});
