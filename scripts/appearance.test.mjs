import test from 'node:test';
import assert from 'node:assert/strict';
import {CATALOG,makePlant,stateAt,annualGalleryDocument,validateDocument} from '../site/model.js';
import {APPEARANCE_DATA} from '../site/appearance-data.js';
import {seasonAt} from '../site/catalog-search.js';
import {plantModel} from '../site/vegetation.js';
import {drawTree} from '../site/tree-model.js';
import {detailedFlower,drawDetailedHerb} from '../site/plant-detail.js';
import {foliageKind} from '../site/appearance.js';
const view=month=>({month,year:0,reference:false});
const dispose=g=>{for(const m of g.children){m.geometry?.dispose();if(m.isInstancedMesh)m.dispose();}};

test('ericaceous shrubs keep their individual wood across winter and spring and distinguish five floral structures',()=>{
 const examples=[['p-f10e134c30c8',4,'rhododendronFunnel'],['p-5159dfb9a37c',4,'azaleaFunnel'],['p-603e7904443b',3,'pierisUrn'],['p-d81eb65f16f6',5,'kalmiaCup'],['p-c552992733f6',5,'enkianthusBell'],['p-1058eee70625',4,'pierisUrn']];
 for(const [id,month,shape] of examples){
  const p=makePlant(id,561,2,2),summer=plantModel(p,view(month)),winter=plantModel(p,view(1));
  const wood=g=>g.children.filter(m=>m.userData.component.startsWith('wood')).map(m=>[...m.instanceMatrix.array]);
  assert.ok(wood(winter).length,id);assert.deepEqual(wood(winter),wood(summer),id);
  assert.ok(summer.children.some(m=>m.geometry.userData[shape]),id);
  assert.equal(winter.children.some(m=>m.userData.component.startsWith('leaf')),id!=='p-c552992733f6',id);
  for(const g of [winter,summer]){for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);}
 }
});
test('ericaceous cultivar details do not confuse flower rims, leaf margins or winter red leaves',()=>{
 const yoho=CATALOG['p-ac15463f27b0'],frost=CATALOG['p-603e7904443b'],osbo=CATALOG['p-007c1975f1e7'],scarlet=CATALOG['p-1058eee70625'];
 assert.equal(yoho.appearance.leafPattern,undefined);assert.equal(yoho.appearance.flowerPattern,'rhododendronRim');assert.equal(frost.appearance.leafPattern,'margin');assert.equal(osbo.appearance.flowerPattern,undefined);
 assert.equal(seasonAt(scarlet,1).leafDensity,1);assert.notEqual(seasonAt(scarlet,1).leafColor,seasonAt(scarlet,7).leafColor);
 assert.equal(seasonAt(frost,1).flowerBuds,true);assert.equal(seasonAt(frost,3).flowerBuds,false);assert.equal(seasonAt(frost,3).bloom,true);
 const parts=[];detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch(){}},{x:0,y:0,z:0,color:'#eee',shape:'kalmiaCup'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.equal(parts.filter(p=>p.kind==='anther').length,10);assert.equal(parts.filter(p=>p.shape==='kalmiaCup').length,1);
});

test('balloon flowers have connected five-lobed corollas, inflated buds and complete winter dieback',()=>{
 for(const id of ['p-565ee45c51d5','p-44f97cf79bf4','p-000781af85b9','p-daa064e003e3','p-f46d74ba4101']){
  const p=makePlant(id,541,2,2),winter=plantModel(p,view(1)),summer=plantModel(p,view(7));
  assert.equal(winter.children.length,0);assert.ok(summer.children.some(m=>m.geometry.userData.balloonBud));assert.ok(summer.children.some(m=>m.geometry.userData.balloonCorolla));
  assert.equal(summer.children.some(m=>m.userData.component==='petal-balloon-splash'),id==='p-44f97cf79bf4');
  for(const m of summer.children)assert.ok([...m.instanceMatrix.array].every(Number.isFinite));dispose(summer);
 }
 const parts=[];detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch:(a,b,r,c,kind)=>parts.push({kind})},{x:0,y:0,z:0,r:.028,color:'#7767aa',shape:'balloonCorolla',layers:2},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.equal(parts.filter(p=>p.shape==='balloonCorolla').length,2);assert.equal(parts.filter(p=>p.kind==='anther').length,5);assert.equal(parts.filter(p=>p.kind==='stigma').length,5);
});

test('soapworts preserve domestic winter distinctions and do not turn cowherb into a perennial',()=>{
 const snow=makePlant('p-22e219879524',542,2,2),rock=makePlant('p-825e967e9c4a',543,2,2),tall=makePlant('p-32106ff38f0a',544,2,2),cow=makePlant('p-91f07ff1c009',545,2,2);
 assert.equal(plantModel(rock,view(1)).children.length,0);
 for(const p of [snow,tall,cow]){const winter=plantModel(p,view(1));assert.ok(winter.children.some(m=>m.userData.component.startsWith('leaf')));dispose(winter);}
 assert.ok(stateAt(tall,view(1)).shootScale<.2);assert.equal(CATALOG[tall.kind].appearance.compoundType,undefined);assert.equal(CATALOG[tall.kind].appearance.flowerLayers,1);
 assert.equal(stateAt(cow,view(9)).groundDormant,true);assert.equal(stateAt(cow,{...view(5),year:1}).present,false);
 const flower=plantModel(cow,view(5));assert.ok(flower.children.some(m=>m.geometry.userData.cowherbCalyx));dispose(flower);
});

test('woody climbers lose winter leaves without losing their supporting stems; porcelain berries follow flowers',()=>{
 for(const id of ['p-8a7a81df41f2','p-f18c6641444c','p-69e7e8e3af56','p-5fec2e343923']){
  const p=makePlant(id,531,2,2),winter=plantModel(p,view(1)),summer=plantModel(p,view(6)),autumn=plantModel(p,view(9));
  const wood=g=>g.children.filter(m=>m.userData.component.startsWith('wood')).map(m=>Array.from(m.instanceMatrix.array));
  assert.ok(wood(winter).length);assert.deepEqual(wood(winter),wood(summer));assert.deepEqual(wood(winter),wood(autumn));
  assert.ok(!winter.children.some(m=>m.userData.component.startsWith('leaf')||m.userData.component==='fruit'));
  assert.ok(summer.children.some(m=>m.userData.component.startsWith('leaf')));
  const hydrangea=CATALOG[id].appearance.architecture==='hydrangeaVine';
  assert.ok(summer.children.some(m=>m.userData.component===(hydrangea?'aerialRoot':'tendril')));
  assert.equal(autumn.children.some(m=>m.userData.component==='fruit'),!hydrangea);
  for(const g of [winter,summer,autumn]){for(const m of g.children)assert.ok([...m.instanceMatrix.array].every(Number.isFinite));dispose(g);}
 }
 const parts=[];detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch(){}},{x:0,y:0,z:0,r:.075,color:'#fff',shape:'singleSepalCorymb'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.equal(parts.filter(p=>p.kind==='sepal').length,12);assert.equal(parts.filter(p=>p.kind==='anther').length,1200);assert.ok(!parts.some(p=>p.kind==='petal'));
 assert.equal(seasonAt(CATALOG['p-69e7e8e3af56'],8).bloom,false);assert.equal(seasonAt(CATALOG['p-69e7e8e3af56'],8).fruitStage,'early');
});

test('purple eryngo dies after flowering while protea eryngo retains neighbouring evergreen rosettes',()=>{
 const purple=makePlant('p-c8c917cb2b80',532,2,2),protea=makePlant('p-07ea6016b5e3',533,2,2);
 assert.equal(CATALOG[purple.kind].life,'annual');assert.equal(stateAt(purple,{...view(6),year:1}).present,false);
 const young=plantModel(purple,view(1)),dry=plantModel(purple,view(12));
 assert.ok(young.children.some(m=>m.userData.component.startsWith('leaf')));assert.ok(dry.children.some(m=>m.userData.component==='seed'));assert.ok(!dry.children.some(m=>m.userData.component.startsWith('leaf')||m.userData.component==='petal'));dispose(young);dispose(dry);
 const winter=plantModel(protea,view(1)),autumn=plantModel(protea,view(10));
 assert.ok(winter.children.some(m=>m.userData.component.startsWith('leaf')));assert.ok(autumn.children.some(m=>m.userData.component.startsWith('leaf')));assert.equal(seasonAt(CATALOG[protea.kind],10).flowerFinished,true);dispose(winter);dispose(autumn);
});

test('every catalog entry has an explicit evidence record and no unsupported completion claim',()=>{
 assert.deepEqual(Object.keys(APPEARANCE_DATA).sort(),Object.keys(CATALOG).sort());
 const allowed=new Set(['sources','basis','status','unconfirmed','arrangement','inflorescence','flowerShape','habit','leafShape','leafTexture','leafColor','barkColor','barkPattern','petals','persistence','flowerMonths','flowerTiming','emergenceMonths','dormantMonths','leafPattern','patternColor','flowerLayers','flowerPattern','scientificName','phenologyRegion','leafLength','leafRelief','seasonalColors','stemColor','leaflets','compoundType','standingWinter','flowerSeasons','leafMargin','architecture','winterClimateSensitive','lifeForm','flowerPatternColor','outerFlowerPattern','flowerRadius','seedHeadMonths','seedColor','flowerPalette','flowerGuides','foliageMonths','leaflessBloom','flowerOptions','leafletShape','flowerFadeTo','headRadius','inflorescenceLength','leafletCounts','leafUnderside','springShootColor','stamenCount','leafFlushAfterFlower','monthlyLeafColors','bracts','flowerOutsideColor','flowerEyeColor','monthlyPatternColors','budMonths','fruitMonths','fruitRadius','fruitColor','winterLeafLength']);
 for(const [id,a] of Object.entries(APPEARANCE_DATA)){
  assert.ok(Object.keys(a).every(k=>allowed.has(k)),id);assert.ok(['attributes','unconfirmed','partial'].includes(a.status));
  for(const source of a.sources){const u=new URL(source.url);assert.equal(u.protocol,'https:');assert.ok(['satsukibonsai-4s.jp','www.kkr.mlit.go.jp','tbg.kahaku.go.jp','sernecportal.org','www.efloras.org','www.royalvanzanten.com','www.panamseed.com','www.fleuroselect.com','hakusan1.co.jp','plantsofhawaii.org','www.takii.co.jp','shop.takii.co.jp','bibliotecadelbotanico.org','w3.biosci.utexas.edu','www.gardentrials.com','pmc.ncbi.nlm.nih.gov','pza.sanbi.org','floraseries.landcareresearch.co.nz','staff.fukuoka-edu.ac.jp','flora.uniud.it','www3.gobiernodecanarias.org','www.nzflora.info','agrobiodiversity.uniag.sk','www.ogis.co.jp','www.engei.net','plants.ces.ncsu.edu','plantfinder.mobot.org','www.rhs.org.uk','item.rakuten.co.jp','www.nzpcn.org.nz','www.kernock.co.uk','www.rhsplants.co.uk','plantnet.rbgsyd.nsw.gov.au','active.inspection.gc.ca','www.darwinperennials.com','catalog.darwinperennials.com','info.ballseed.com','www.plantdelights.com','hortflora.rbg.vic.gov.au','www.thompson-morgan.com','www.nmns.edu.tw','plants.usda.gov','fitzgerald-nurseries.com','www.ffpri.go.jp','www.hro.or.jp','www.pharm.kumamoto-u.ac.jp','www.rinya.maff.go.jp','www.higashiyama.city.nagoya.jp','www.treesandshrubsonline.org','www1.ous.ac.jp','web.tuat.ac.jp','www.tokyo-park.or.jp','www.cgr.mlit.go.jp','www.aglandscape.co.jp','www.town.kumano.lg.jp','www.env.go.jp','www.forest-akita.jp','powo.science.kew.org','arboretum.harvard.edu','landscapeplants.oregonstate.edu','www.hanahiroba.com','www.paradisegarden-nishiyama.com','www.provenwinners.com','www.botanic.jp','botany.cz','vicflora.rbg.vic.gov.au','www.nparks.gov.sg','provenwinners.jp','pacificbulbsociety.org','keys.landcareresearch.co.nz','plantipp.eu','www.wairere.nz','hosho.ees.hokudai.ac.jp','www.hokudai.ac.jp','www.lab.toho-u.ac.jp','eprints.lib.hokudai.ac.jp','www.town.karuizawa.lg.jp','library.dbca.wa.gov.au','www.hinshu2.maff.go.jp','matsunaga-kadan.com','oniduka.base.shop'].includes(u.hostname));assert.ok(['catalog-entry','species','genus'].includes(source.scope));}
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
test('summer flowers preserve opposite leaves, bracted heads and the documented winter distinction',()=>{
 const parts=[];detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch(){}},{x:0,y:0,z:0,color:'#cd66a2',shape:'amaranthHead',palette:{tip:'#e3af58'}},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.ok(parts.filter(p=>p.kind==='bract').length>50);assert.ok(parts.some(p=>p.kind==='anther'));assert.ok(!parts.some(p=>p.kind==='petal'&&p.shape==='petal'));
 for(const id of ['p-8d016a17fdc9','p-a92a80a9701a']){
  const p=makePlant(id,413,2,2);assert.equal(CATALOG[id].appearance.arrangement,'opposite');assert.equal(seasonAt(CATALOG[id],1).groundDormant,false);
  assert.equal(seasonAt(CATALOG[id],7).bloom,false);const g=plantModel(p,view(8));assert.ok(g.children.some(m=>m.userData.component==='petal'));dispose(g);
 }
 assert.equal(plantModel(makePlant('p-4fd14a60fc7f',415,2,2),view(1)).children.length,0);
 const dry=plantModel(makePlant('p-771fe3fdbf03',416,2,2),view(1));assert.ok(dry.children.some(m=>m.userData.component==='seed'));assert.ok(!dry.children.some(m=>m.userData.component==='anther'));dispose(dry);
 const annual=makePlant('p-3cefec433578',417,2,2);assert.equal(plantModel(annual,view(1)).children.length,0);assert.equal(stateAt(annual,{...view(6),year:1}).present,false);
});
test('star jasmine keeps its perennial creeping wood and distinct variegation through winter',()=>{
 for(const id of ['p-80db4c717520','p-14d3d08c7235','p-e09876a84582','p-a10fa59634ba','p-6c518cb68dc1']){
  const p=makePlant(id,421,2,2),summer=plantModel(p,view(6)),winter=plantModel(p,view(1));
  const wood=g=>g.children.filter(m=>m.userData.component==='wood').map(m=>[...m.instanceMatrix.array]);
  assert.ok(wood(summer).length>0);assert.deepEqual(wood(summer),wood(winter));
  assert.ok(winter.children.some(m=>m.userData.component.startsWith('leaf')));
  if(id!=='p-14d3d08c7235')assert.ok(summer.children.some(m=>m.userData.component.includes('mosaic')));
  dispose(summer);dispose(winter);
 }
 const white=plantModel(makePlant('p-14d3d08c7235',422,2,2),view(6));assert.ok(white.children.some(m=>m.userData.component==='anther'));dispose(white);
 assert.ok(CATALOG['p-80db4c717520'].height[1]<=.2);assert.ok(CATALOG['p-14d3d08c7235'].height[1]<1);
});
test('small bulbs distinguish spring dormancy, autumn flowers and recurved or unconstricted flowers',()=>{
 for(const id of ['p-8f8cd8c0c33d','p-4df8a087cdeb','p-db9489e27120','p-19ea7408e3ef','p-789e60b36291','p-040659e18f2b','p-91482789209b']){
  const p=makePlant(id,431,2,2);assert.equal(plantModel(p,view(7)).children.length,0);
  const spring=plantModel(p,view(3));assert.ok(spring.children.length>0);
  if(id==='p-8f8cd8c0c33d')assert.ok(spring.children.some(m=>m.geometry.userData.recurvedTepal));dispose(spring);
 }
 const p=makePlant('p-35f78064f6e3',432,2,2),autumn=plantModel(p,view(9)),winter=plantModel(p,view(1));
 assert.ok(autumn.children.some(m=>m.userData.component==='anther'));assert.ok(!autumn.children.some(m=>m.userData.component.startsWith('leaf')));
 assert.ok(winter.children.some(m=>m.userData.component.startsWith('leaf')));assert.ok(!winter.children.some(m=>m.userData.component==='anther'));assert.equal(plantModel(p,view(7)).children.length,0);dispose(autumn);dispose(winter);
 const parts=[];detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch(){}},{x:0,y:0,z:0,color:'#749dd1',shape:'azureBell'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});assert.deepEqual(parts,[{shape:'bell6',kind:'petal'}]);
});
test('cranesbills retain their lobed foliage, five petals, ten anthers and distinct winter habit',()=>{
 const parts=[];detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch(){}},{x:0,y:0,z:0,color:'#7c77b5',shape:'cranesbill'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.equal(parts.filter(p=>p.shape==='petal').length,5);assert.equal(parts.filter(p=>p.kind==='anther').length,10);
 for(const id of ['p-281a043a4b8a','p-17d8d9870aad','p-9a250949ed67']){
  const p=makePlant(id,410,2,2);assert.equal(plantModel(p,view(1)).children.length,0);
  const summer=plantModel(p,view(6));assert.ok(summer.children.some(m=>m.userData.component==='anther'));assert.ok(summer.children.some(m=>m.geometry.userData.palmateLobes===5));dispose(summer);
 }
 const penny=plantModel(makePlant('p-8d23e50bf880',411,2,2),view(1));assert.ok(penny.children.some(m=>m.userData.component.startsWith('leaf')));assert.ok(!penny.children.some(m=>m.userData.component==='anther'));dispose(penny);
});
test('Chilean blue crocus has six tepals, three anthers and no leaves in summer',()=>{
 const parts=[];detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch(){}},{x:0,y:0,z:0,color:'#396ec4',shape:'chileanCrocus'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.equal(parts.filter(p=>p.shape==='petal').length,6);assert.equal(parts.filter(p=>p.kind==='anther').length,3);assert.equal(parts.filter(p=>p.kind==='staminode').length,3);
 for(const id of ['p-f2be143fe8e2','p-be58de2d72b1','p-0c17f5e6428b','p-d60390169c0f']){
  const info=CATALOG[id],p=makePlant(id,391,2,2);assert.equal(info.appearance.leafPattern,undefined);assert.deepEqual(info.appearance.emergenceMonths,[1,2]);
  for(const month of [2,3,4]){const g=plantModel(p,view(month));assert.ok(g.children.some(m=>m.userData.component==='anther'));dispose(g);}
  for(const month of [7,8,9])assert.equal(plantModel(p,view(month)).children.length,0);
 }
});
test('flannel flowers retain ten bracts and protected evergreen leaves; annual tobacco does not regrow next year',()=>{
 const info=CATALOG['p-c1a8de3aa502'],parts=[];
 detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch(){}},{x:0,y:0,z:0,color:'#ffffff',shape:info.appearance.flowerShape,bracts:info.appearance.bracts},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.equal(parts.filter(p=>p.kind==='petal-woolly-tip-78976a').length,10);assert.ok(!parts.some(p=>p.kind==='petal'));
 const winter=plantModel(makePlant('p-c1a8de3aa502',396,2,2),view(1));assert.ok(winter.children.some(m=>m.userData.component==='leaf-woolly'));assert.ok(!winter.children.some(m=>m.userData.component.startsWith('petal')));dispose(winter);
 for(const id of ['p-9d11003cdcf2','p-b6018a56b0fc','p-eb1f476e1f78']){
  const p=makePlant(id,397,2,2);assert.equal(plantModel(p,view(1)).children.length,0);assert.equal(stateAt(p,{...view(6),year:1}).present,false);
  const bloom=plantModel(p,view(6));assert.ok(bloom.children.some(m=>m.userData.component.startsWith('petal')));dispose(bloom);
 }
 const tinker=CATALOG['p-9d11003cdcf2'].appearance;assert.equal(tinker.flowerOutsideColor,'#85915c');
 const changing=CATALOG['p-eb1f476e1f78'];assert.notEqual(changing.flower,changing.appearance.flowerFadeTo);assert.ok(changing.appearance.flowerEyeColor);
});
test('redbud flowers attach to old branches before its leaves and goldchain racemes hang down',()=>{
 const redbud=CATALOG['p-91a9e7ebc098'];assert.equal(seasonAt(redbud,3).leafDensity,0);assert.equal(seasonAt(redbud,3).bloom,true);assert.equal(seasonAt(redbud,6).leafDensity,1);
 const g=plantModel(makePlant('p-91a9e7ebc098',392,2,2),view(3));assert.ok(g.children.some(m=>m.userData.component.startsWith('petal')));assert.ok(!g.children.some(m=>m.userData.component.startsWith('leaf')));dispose(g);
 const p=makePlant('p-d31d2a2018c0',393,2,2),info=CATALOG[p.kind],branches=[];
 drawTree({add(){},branch:(from,to,r,c,kind)=>{if(kind==='peduncle'&&r===.00065)branches.push({from,to});}},{profile:{habit:'spreading',leafShape:'compound'},info,p,s:stateAt(p,view(5)),detail:.45},{bud:'bud',shade:(_,c)=>c,detailedFlower(){},flower(){}});
 assert.ok(branches.length>100);assert.ok(branches.every(({from,to})=>to[1]<from[1]));assert.equal(seasonAt(info,1).leafDensity,0);
 const elm=CATALOG['p-f446d616f1b5'];assert.notEqual(seasonAt(elm,4).leafColor,seasonAt(elm,6).leafColor);assert.equal(elm.appearance.flowerShape,undefined);assert.equal(elm.bloomKnown,false);
});
test('sweetshrubs retain winter wood while evergreen hebes retain paired leaves and change their winter colour',()=>{
 for(const id of ['p-108e05754c2f','p-1e6d5ebbf170','p-a1731a43eebc']){
  const g=plantModel(makePlant(id,398,2,2),view(1));assert.ok(g.children.some(m=>m.userData.component.startsWith('wood')));assert.ok(!g.children.some(m=>m.userData.component.startsWith('leaf')));dispose(g);
  const flowering=plantModel(makePlant(id,398,2,2),view(6));assert.ok(flowering.children.some(m=>m.userData.component==='anther'));dispose(flowering);
 }
 for(const id of ['p-eda5b577dd43','p-621be978a2f2','p-a425a22329b4']){
  const info=CATALOG[id],winter=seasonAt(info,1),summer=seasonAt(info,6);assert.equal(info.appearance.arrangement,'opposite');assert.equal(winter.leafDensity,1);
  assert.ok(winter.leafColor!==summer.leafColor||winter.leafPatternColor!==summer.leafPatternColor);
  const g=plantModel(makePlant(id,399,2,2),view(1));assert.ok(g.children.some(m=>m.userData.component.startsWith('leaf')));assert.ok(!g.children.some(m=>m.userData.component.startsWith('petal')));dispose(g);
 }
 const parts=[];detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch(){}},{x:0,y:0,z:0,shape:'hebeFlower',color:'#aa88bb'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.equal(parts.filter(p=>p.shape==='petal').length,4);assert.equal(parts.filter(p=>p.kind==='anther').length,2);
});
test('snowdrops flower with leaves in late winter and leave no above-ground plant in summer',()=>{
 for(const [id,info] of Object.entries(CATALOG).filter(([,p])=>p.appearance?.architecture==='snowdrop')){
  for(const month of info.appearance.flowerMonths||info.bloom){
   const s=seasonAt(info,month);assert.equal(s.bloom,true,info.label);assert.ok(s.leafDensity>0);
   const g=plantModel(makePlant(id,307,2,2),view(month));assert.ok(g.children.some(m=>m.userData.component==='petal-snowdrop-inner'));dispose(g);
  }
  assert.equal(plantModel(makePlant(id,308,2,2),view(8)).children.length,0,info.label);
 }
 for(const info of Object.values(CATALOG))for(const month of info.appearance?.flowerMonths||[]){
  assert.equal(seasonAt(info,month).groundDormant,false,'Source flowering contradicts dormancy: '+info.label);
 }
});
test('bilateral flowers, snowdrop whorls and grass spikelets preserve their defining structures',()=>{
 const record=shape=>{
  const parts=[],b={add:(geometry,kind,...rest)=>parts.push({geometry,kind,rest}),branch:()=>{}};
  detailedFlower(b,{x:0,y:0,z:0,color:'#eeeeee',shape},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return parts;
 };
 const violet=record('violet');assert.equal(violet.filter(p=>p.geometry==='petal').length,5);assert.equal(violet.filter(p=>p.geometry==='tube').length,1);
 const snowdrop=record('snowdrop');assert.equal(snowdrop.filter(p=>p.kind==='petal').length,3);assert.equal(snowdrop.filter(p=>p.kind==='petal-snowdrop-inner').length,3);
 const spikelet=record('spikelet');assert.ok(spikelet.length>8);assert.ok(spikelet.every(p=>p.kind==='seed'));
});
test('leaf and seedhead colour evidence apply to the correct organs',()=>{
 const named=label=>Object.values(CATALOG).find(p=>p.label===label);
 const pink=named('ニューサイラン ピンクストライプ');assert.match(foliageKind(pink),/margin-cc91a6$/);
 assert.equal(pink.form,'botanical');assert.ok(!pink.appearance.flowerShape,'Do not invent an unconfirmed flower');
 const briza=named('ブリザ トリロバ');assert.ok(!briza.appearance.seasonalColors?.summer);assert.equal(seasonAt(briza,9).seedHeads,true);
 const olive=named('ロシアンオリーブ');assert.equal(seasonAt(olive,5).leafColor,'#a4b6ab');assert.equal(seasonAt(olive,1).dormant,true);
});
test('spring-leaf bulbs keep their flowering scapes when their leaves are absent',()=>{
 const id='p-7df89ac2d223',info=CATALOG[id],p=makePlant(id,316,2,2);
 for(const month of [1,7,10])assert.equal(plantModel(p,view(month)).children.length,0);
 const spring=plantModel(p,view(4));assert.ok(spring.children.some(m=>m.userData.component.startsWith('leaf')));assert.ok(!spring.children.some(m=>m.userData.component.startsWith('petal')));dispose(spring);
 for(const month of [8,9]){
  const state=seasonAt(info,month),g=plantModel(p,view(month));assert.equal(state.leafDensity,0);assert.equal(state.bloom,true);assert.equal(state.groundDormant,false);
  assert.ok(g.children.some(m=>m.userData.component==='peduncle'));assert.ok(g.children.some(m=>m.userData.component.startsWith('petal-tip')));assert.ok(!g.children.some(m=>m.userData.component.startsWith('leaf')));dispose(g);
 }
});
test('documented violet cultivar colours and guide markings remain distinct',()=>{
 const sky=CATALOG['p-fa65e71e69b4'].appearance,lilac=CATALOG['p-7fa1c8b2a609'].appearance;
 assert.equal(sky.flowerGuides,true);assert.equal(lilac.flowerGuides,false);assert.notEqual(sky.flowerPalette.upper,sky.flowerPalette.lower);assert.ok(sky.leafLength>lilac.leafLength);
 const parts=[],b={add:(geometry,kind,color)=>parts.push({geometry,kind,color}),branch(){}};
 detailedFlower(b,{x:0,y:0,z:0,color:'#eeeeee',shape:'violet',palette:sky.flowerPalette,pattern:sky.flowerPattern,patternColor:sky.flowerPatternColor,guides:sky.flowerGuides},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.equal(parts.filter(p=>p.kind.endsWith('-guide')).length,3);assert.equal(parts.filter(p=>p.geometry==='petal'&&p.color===sky.flowerPalette.upper).length,2);
});
test('striped squill keeps its blue marking on six tepals, not on its leaves',()=>{
 for(const id of ['p-a7106714e1f1','p-d4013ed52006']){
  const a=CATALOG[id].appearance;assert.equal(a.petals,6);assert.equal(a.flowerShape,'squill');assert.equal(a.leafPattern,undefined);assert.equal(a.flowerPattern,'center');
  assert.equal(plantModel(makePlant(id,319,2,2),view(8)).children.length,0);
 }
 const parts=[],b={add:(geometry,kind)=>parts.push({geometry,kind}),branch(){}};
 detailedFlower(b,{x:0,y:0,z:0,color:'#ffffff',shape:'squill',pattern:'center'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.equal(parts.filter(p=>p.geometry==='petal').length,6);assert.equal(parts.filter(p=>p.geometry==='bell6').length,1);
});
test('seed-mixture colours remain consistent for each placed individual across the year',()=>{
 const id='p-5aa887b5e439',one=makePlant(id,321,2,2),two=makePlant(id,322,3,2);
 assert.notEqual(stateAt(one,view(6)).flowerColor,stateAt(two,view(6)).flowerColor);
 assert.equal(stateAt(one,view(6)).flowerColor,stateAt(one,view(8)).flowerColor);
 assert.equal(plantModel(one,view(1)).children.length,0);
});
test('summer and winter dormancy follow the different bulb and rhizome cycles',()=>{
 for(const id of ['p-c6e0ce0d4ed9','p-436ce24edcd9']){
  const p=makePlant(id,350,2,2);
  for(const month of [1,8,11])assert.equal(plantModel(p,view(month)).children.length,0);
  const spring=plantModel(p,view(4));assert.ok(spring.children.some(m=>m.userData.component==='petal'));dispose(spring);
 }
 const pineapple=makePlant('p-ff41c5e8521e',351,2,2);
 assert.equal(plantModel(pineapple,view(1)).children.length,0);assert.notEqual(seasonAt(CATALOG[pineapple.kind],4).leafColor,seasonAt(CATALOG[pineapple.kind],8).leafColor);
 const triteleia=makePlant('p-1cbeca1453ae',352,2,2);
 for(const month of [8,9,10])assert.equal(plantModel(triteleia,view(month)).children.length,0);
 assert.equal(seasonAt(CATALOG[triteleia.kind],1).leafDensity,1);
 const july=plantModel(triteleia,view(7));assert.ok(july.children.some(m=>m.userData.component.startsWith('petal')));assert.ok(!july.children.some(m=>m.userData.component.startsWith('leaf')));dispose(july);
});
test('standing winter grasses keep dry foliage and distinctive seed structures',()=>{
 for(const id of ['p-f181b6640980','p-30f4df68a97a','p-a12f93626235']){
  const s=seasonAt(CATALOG[id],1);assert.equal(s.groundDormant,false);assert.equal(s.seedHeads,true);
  const g=plantModel(makePlant(id,354,2,2),view(1));assert.ok(g.children.some(m=>m.userData.component==='seed'));assert.ok(g.children.some(m=>m.userData.component.startsWith('leaf')));assert.ok(!g.children.some(m=>m.userData.component==='petal'));dispose(g);
 }
});
test('peltate leaves shelter pendant flowers and ironweed never receives daisy rays',()=>{
 const info=CATALOG['p-8530ed8d222b'],p=makePlant('p-8530ed8d222b',357,2,2),parts=[];
 drawDetailedHerb({add:(shape,kind,color,x,y,z)=>parts.push({shape,kind,x,y,z}),branch(){}},{info,s:stateAt(p,view(4)),p,detail:1,rand:()=>.5},{bud:'bud',shade:(_,c)=>c});
 const leaves=parts.filter(p=>p.shape==='peltate'),flowers=parts.filter(p=>p.kind==='petal');assert.equal(leaves.length,6);assert.ok(flowers.length>0);assert.ok(Math.max(...flowers.map(p=>p.y))<Math.min(...leaves.map(p=>p.y)));
 const petals=[];detailedFlower({add:(shape,kind)=>petals.push({shape,kind}),branch(){}},{x:0,y:0,z:0,shape:'discHead',color:'#894ca6'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});assert.ok(petals.filter(p=>p.kind==='petal').every(p=>p.shape==='tube'));
});
test('phlox corollas have five spreading lobes on one tube and Carex retains the correct variegation',()=>{
 const parts=[];detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch(){}},{x:0,y:0,z:0,shape:'salver',color:'#eeeeee'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.equal(parts.filter(p=>p.shape==='petal').length,5);assert.equal(parts.filter(p=>p.shape==='tube').length,1);
 for(const info of Object.values(CATALOG).filter(p=>p.latin.startsWith('Phlox'))){assert.equal(info.appearance.flowerShape,'salver');assert.equal(info.appearance.petals,5);}
 const everoro=CATALOG['p-ab429729420b'],everest=CATALOG['p-ba5a0872d571'];
 assert.equal(everoro.appearance.leafPattern,'center');assert.equal(everest.appearance.leafPattern,'margin');
 for(const info of [everoro,everest])assert.equal(seasonAt(info,1).leafDensity,1);
});
test('sourced woody life forms retain branches and an unknown flower stays absent',()=>{
 const id=Object.keys(CATALOG).find(id=>CATALOG[id].latin.startsWith('Parrotia persica'));assert.ok(id);assert.ok(['tree','shrub'].includes(CATALOG[id].form));
 const tree=plantModel(makePlant(id,317,2,2),view(1));assert.ok(tree.children.some(m=>m.userData.component?.startsWith('wood')));dispose(tree);
 const pink=Object.entries(CATALOG).find(([,p])=>p.label==='ニューサイラン ピンクストライプ');
 const g=plantModel(makePlant(pink[0],318,2,2),view(6));assert.ok(g.children.some(m=>m.userData.component.startsWith('leaf')));assert.ok(!g.children.some(m=>m.userData.component.startsWith('petal')));dispose(g);
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

test('small evergreen shrubs keep their fine wood, seasonal variegation and distinct flowers',()=>{
 const ids=['p-ab4b73d25c35','p-deba525ca936','p-c877dc8c3da9','p-bfc0ee71af97','p-930c12b01ff3','p-81a5b0b71415','p-ef0fd5d0e23f'];
 for(const id of ids){
  const p=makePlant(id,433,2,2),summer=plantModel(p,view(6)),winter=plantModel(p,view(1));
  const wood=g=>g.children.filter(m=>m.userData.component.startsWith('wood')).map(m=>[m.userData.component,Array.from(m.instanceMatrix.array)]);
  assert.deepEqual(wood(summer),wood(winter),id);assert.ok(winter.children.some(m=>m.userData.component.startsWith('leaf')),id);
  if(id==='p-ef0fd5d0e23f'){assert.ok(summer.children.some(m=>m.geometry.userData.bullate));assert.notEqual(seasonAt(CATALOG[id],1).leafPatternColor,seasonAt(CATALOG[id],6).leafPatternColor);}
  for(const g of [summer,winter]){for(const m of g.children)assert.ok([...m.instanceMatrix.array].every(Number.isFinite));dispose(g);}
 }
 const record=shape=>{const parts=[];detailedFlower({add:(geometry,kind)=>parts.push({geometry,kind}),branch:(a,b,r,c,kind)=>parts.push({kind})},{x:0,y:0,z:0,r:.004,color:'#eeeecc',shape},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return parts;};
 assert.equal(record('myrtleFour').filter(p=>p.geometry==='petal').length,4);
 assert.equal(record('myrtleFour').filter(p=>p.kind==='anther').length,48);
 assert.equal(record('corokiaStar').filter(p=>p.geometry==='narrow').length,5);
 assert.equal(record('coprosmaFemale').filter(p=>p.kind==='stigma').length,2);
 assert.equal(record('coprosmaFemale').filter(p=>p.kind==='anther').length,0);
});

test('woodland perennials distinguish sepals, compound leaves and complete winter dieback',()=>{
 const record=(shape,layers=1)=>{const parts=[];detailedFlower({add:(geometry,kind)=>parts.push({geometry,kind}),branch(){}},{x:0,y:0,z:0,r:.03,color:'#ded0e0',shape,layers},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return parts;};
 const poppy=record('woodPoppy');assert.equal(poppy.filter(p=>p.kind==='sepal').length,4);assert.equal(poppy.filter(p=>p.kind==='carpel').length,2);assert.equal(poppy.filter(p=>p.kind==='petal').length,0);
 assert.equal(record('anemonopsis').filter(p=>p.kind==='sepal').length,8);assert.equal(record('anemonopsis',3).filter(p=>p.kind==='sepal').length,24);
 for(const id of ['p-314236d1056b','p-b2294b83d59b','p-c4216e00fd87','p-2ed45d98362a']){
  const p=makePlant(id,440,2,2);assert.equal(plantModel(p,view(1)).children.length,0,id);
  const m=CATALOG[id].appearance.architecture==='woodPoppy'?4:8,g=plantModel(p,view(m));assert.ok(g.children.some(m=>m.userData.component==='sepal'),id);
  for(const child of g.children)assert.ok([...child.instanceMatrix.array].every(Number.isFinite),id);dispose(g);
 }
});

test('Australian shrubs keep woolly alternate leaves distinct from narrow and broad variegated mintbush leaves',()=>{
 const silver=CATALOG['p-99200802e07f'],narrow=CATALOG['p-5ded43f9b419'],broad=CATALOG['p-1b3f07b3036f'];
 assert.equal(silver.appearance.arrangement,'alternate');assert.equal(narrow.appearance.arrangement,'opposite');assert.notEqual(narrow.appearance.leafShape,broad.appearance.leafShape);
 assert.notEqual(seasonAt(broad,1).leafPatternColor,seasonAt(broad,6).leafPatternColor);
 for(const id of ['p-99200802e07f','p-dc7f89ffc613','p-5ded43f9b419','p-1b3f07b3036f']){
  const p=makePlant(id,450,2,2),spring=plantModel(p,view(4)),winter=plantModel(p,view(1));
  assert.ok(spring.children.some(m=>m.userData.component==='anther'),id);assert.ok(!winter.children.some(m=>m.userData.component==='anther'),id);
  assert.ok(winter.children.some(m=>m.userData.component.startsWith('leaf')),id);
  if(id==='p-99200802e07f')assert.ok(spring.children.some(m=>m.userData.component==='leaf-woolly'));
  for(const g of [spring,winter]){for(const m of g.children)assert.ok([...m.instanceMatrix.array].every(Number.isFinite));dispose(g);}
 }
});

test('glorybowers distinguish butterfly corollas, hanging panicles and deciduous suckering shrubs',()=>{
 const parts=[];detailedFlower({add:(shape,kind,color)=>parts.push({shape,kind,color}),branch(){}},{x:0,y:0,z:0,color:'#b0c6e6',shape:'blueButterfly'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.equal(parts.filter(p=>p.kind==='petal'&&p.shape==='petal').length,5);assert.equal(parts.filter(p=>p.kind==='petal'&&p.color==='#554dae').length,1);assert.equal(parts.filter(p=>p.kind==='anther').length,4);
 for(const id of ['p-7c51c37e8599','p-60496d393518','p-ce1eaf50b885']){
  const p=makePlant(id,460,2,2),summer=plantModel(p,view(id==='p-60496d393518'?10:8)),winter=plantModel(p,view(1));
  const wood=g=>g.children.filter(m=>m.userData.component.startsWith('wood')).map(m=>[m.userData.component,Array.from(m.instanceMatrix.array)]);
  assert.deepEqual(wood(summer),wood(winter),id);assert.ok(summer.children.some(m=>m.userData.component==='anther'),id);
  assert.equal(winter.children.some(m=>m.userData.component.startsWith('leaf')),id!=='p-ce1eaf50b885',id);
  for(const g of [summer,winter]){for(const m of g.children)assert.ok([...m.instanceMatrix.array].every(Number.isFinite));dispose(g);}
 }
 assert.equal(seasonAt(CATALOG['p-60496d393518'],6).bloom,false);assert.equal(seasonAt(CATALOG['p-60496d393518'],10).bloom,true);
});

test('cool-season annuals retain young winter leaves but do not regrow after their flowering cycle',()=>{
 const ids=['p-fc28707d1143','p-6f55989d531c','p-be7b48352e96','p-256aa8c76bb6','p-61e0b96679a0','p-6c983212a22c'];
 for(const id of ids){
  const p=makePlant(id,470,2,2),winter=stateAt(p,view(1)),summer=plantModel(p,view(6));
  assert.equal(CATALOG[id].life,'annual');assert.equal(winter.groundDormant,false);assert.ok(winter.shootScale<.4);
  assert.ok(summer.children.some(m=>m.userData.component.startsWith('sepal')),id);dispose(summer);
  const old=stateAt(p,view(11));assert.equal(old.leafDensity,0,id);assert.equal(old.bloom,false);
  const next={...p,start:9};assert.ok(stateAt(next,view(11)).leafDensity>0,id);
  assert.equal(stateAt(p,{...view(6),year:1}).present,false);
 }
 const growing=plantModel(makePlant('p-6f55989d531c',471,2,2),view(6)),transformer=plantModel(makePlant('p-6f55989d531c',471,2,2),view(12));
 const stems=g=>g.children.filter(m=>m.userData.component==='stem').map(m=>Array.from(m.instanceMatrix.array));assert.deepEqual(stems(growing),stems(transformer));dispose(growing);assert.ok(transformer.children.some(m=>m.userData.component==='seed'));assert.ok(!transformer.children.some(m=>m.userData.component.startsWith('leaf')));dispose(transformer);
 const white=plantModel(makePlant('p-6c983212a22c',472,2,2),view(6));assert.ok(white.children.some(m=>m.userData.component==='spur'));dispose(white);
 const picotee=plantModel(makePlant('p-61e0b96679a0',473,2,2),view(6));assert.ok(picotee.children.some(m=>m.userData.component==='sepal-margin-aa90bd'));dispose(picotee);
});

test('sea kales distinguish a summer-fading crown from winter dieback and preserve four petals with six stamens',()=>{
 const large=makePlant('p-16d9473aa170',480,2,2),small=makePlant('p-79693d1b1381',481,2,2);
 const crown=plantModel(large,view(1));assert.ok(crown.children.some(m=>m.userData.component==='crown'));assert.ok(!crown.children.some(m=>m.userData.component.startsWith('leaf')));dispose(crown);
 assert.equal(plantModel(small,view(1)).children.length,0);assert.equal(seasonAt(CATALOG[large.kind],9).leafDensity,0);assert.ok(seasonAt(CATALOG[small.kind],9).leafDensity>0);
 const seed=plantModel(small,view(6));assert.ok(seed.children.some(m=>m.userData.component==='seed'));assert.ok(!seed.children.some(m=>m.userData.component==='anther'));dispose(seed);
 const parts=[];detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch(){}},{x:0,y:0,z:0,r:.0056,color:'#eeeade',shape:'crambeFlower'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.equal(parts.filter(p=>p.kind==='petal').length,4);assert.equal(parts.filter(p=>p.kind==='anther').length,6);
});

test('reed leaves lose green winter foliage while annual canary grass does not regrow in autumn',()=>{
 for(const id of ['p-e4d14379f3a0','p-ce059fcc6a2f']){
  const p=makePlant(id,482,2,2),summer=plantModel(p,view(6)),winter=plantModel(p,view(1));
  assert.ok(summer.children.some(m=>m.geometry.userData.archingReedLeaf));assert.ok(winter.children.some(m=>m.userData.component==='culm'));assert.ok(!winter.children.some(m=>m.userData.component.startsWith('leaf')));
  assert.ok(!summer.children.some(m=>m.userData.component.startsWith('sepal')),'Unknown flowering season must not invent a panicle');
  for(const g of [summer,winter]){for(const m of g.children)assert.ok([...m.instanceMatrix.array].every(Number.isFinite));dispose(g);}
 }
 const autumn=plantModel(makePlant('p-e4d14379f3a0',483,2,2),view(10));assert.ok(autumn.children.some(m=>m.userData.component==='leaf-stripes-dcaebe'));dispose(autumn);
 const p=makePlant('p-3a7b9b932473',484,2,2),bloom=plantModel(p,view(6));assert.ok(bloom.children.some(m=>m.userData.component==='sepal-canaryVeins-527948'));dispose(bloom);
 assert.equal(plantModel(p,view(10)).children.length,0);assert.equal(stateAt(p,{...view(6),year:1}).present,false);
});

test('mallows, speedwells, valerian and globe daisies retain distinct winter structures and floral organs',()=>{
 const ids=['p-1e5437ee2bd7','p-8f59c8a9888f','p-5c9cc85ba529','p-4345fea9e95d','p-b7cd76520581','p-0c6e0a887f42','p-4a8a59960764','p-bcf4c6b6a5b0','p-37c503d24b05','p-547a022619db'];
 const dieback=new Set(['p-1e5437ee2bd7','p-8f59c8a9888f','p-4a8a59960764','p-bcf4c6b6a5b0']);
 for(const id of ids){
  const p=makePlant(id,490,2,2),winter=plantModel(p,view(1)),summer=plantModel(p,view(id==='p-0c6e0a887f42'?6:5));
  if(dieback.has(id))assert.equal(winter.children.length,0,id);
  else assert.ok(winter.children.some(m=>m.userData.component.startsWith('leaf')),id);
  assert.ok(summer.children.some(m=>m.userData.component.startsWith('petal')),id);
  const wood=g=>g.children.filter(m=>m.userData.component==='wood').map(m=>Array.from(m.instanceMatrix.array));
  if(['p-5c9cc85ba529','p-4345fea9e95d','p-b7cd76520581','p-0c6e0a887f42','p-547a022619db'].includes(id)){assert.ok(wood(summer).length);assert.deepEqual(wood(summer),wood(winter),id);}
  for(const g of [summer,winter]){for(const m of g.children)assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);dispose(g);}
 }
 const record=shape=>{const parts=[];detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch:(a,b,r,c,kind)=>parts.push({kind})},{x:0,y:0,z:0,r:.006,color:'#eeeade',shape},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return parts;};
 assert.equal(record('smallMallow').filter(p=>p.shape==='petal').length,5);
 assert.equal(record('parahebeFlower').filter(p=>p.shape==='petal').length,4);
 assert.equal(record('parahebeFlower').filter(p=>p.kind==='anther').length,2);
 assert.equal(record('valerianSpur').filter(p=>p.kind==='anther').length,1);
 assert.equal(record('valerianSpur').filter(p=>p.kind==='spur').length,1);
 assert.ok(seasonAt(CATALOG['p-b7cd76520581'],6).flowerDensity>seasonAt(CATALOG['p-b7cd76520581'],8).flowerDensity);
});

test('chloranthus is petal-less, acaena stays evergreen and domestic mignonette life cycles remain distinct',()=>{
 for(const id of ['p-7c89f4e9de4e','p-f803ec8edf0e']){
  const p=makePlant(id,501,2,2),spring=plantModel(p,view(4));assert.equal(plantModel(p,view(1)).children.length,0);assert.ok(spring.children.some(m=>m.userData.component==='filament'));assert.ok(!spring.children.some(m=>m.userData.component.startsWith('petal')));dispose(spring);
 }
 const leafCounts=[];
 for(const id of ['p-1b5b5fe5d852','p-20964346be80']){
  const p=makePlant(id,502,2,2),winter=plantModel(p,view(1)),summer=plantModel(p,view(7));
  const leaves=g=>g.children.filter(m=>m.geometry.userData.acaenaLeaflet).reduce((n,m)=>n+m.count,0);assert.equal(leaves(winter),leaves(summer));assert.ok(leaves(summer)>100);leafCounts.push(leaves(summer));
  assert.ok(summer.children.some(m=>m.userData.component==='anther'));assert.ok(!summer.children.some(m=>m.userData.component.startsWith('petal')));dispose(winter);dispose(summer);
 }
 const yellow=makePlant('p-44c9558101f1',503,2,2),white=makePlant('p-24490dd2b2df',504,2,2);
 assert.equal(stateAt(yellow,view(10)).groundDormant,true);assert.equal(stateAt(yellow,{...view(6),year:1}).present,false);assert.equal(stateAt(white,{...view(6),year:1}).present,true);
 const whiteWinter=plantModel(white,view(1));assert.ok(whiteWinter.children.some(m=>m.userData.component.startsWith('leaf')));dispose(whiteWinter);
});
test('silver plants retain documented winter foliage and distinguish Japanese berzelia buds from flowers',()=>{
 for(const id of ['p-2b334e413f89','p-81879c76470e','p-928f3f1df9b2','p-52d2b36dbaff','p-4a12e89d278a']){
  const winter=plantModel(makePlant(id,521,2,2),view(1));assert.ok(winter.children.some(m=>m.userData.component.startsWith('leaf')));assert.equal(seasonAt(CATALOG[id],1).groundDormant,false);dispose(winter);
 }
 const mary=CATALOG['p-c12c4f2a095b'];assert.equal(mary.appearance.persistence,undefined);assert.ok(mary.appearance.unconfirmed.includes('persistence'));assert.equal(mary.leaf,'unknown');
 for(const id of ['p-52d2b36dbaff','p-4a12e89d278a']){
  const p=makePlant(id,522,2,2),winter=plantModel(p,view(1)),spring=plantModel(p,view(4)),summer=plantModel(p,view(7));
  assert.ok(winter.children.some(m=>m.userData.component==='bud'));assert.ok(!winter.children.some(m=>m.userData.component==='petal'));
  assert.ok(spring.children.some(m=>m.userData.component==='petal'));assert.ok(spring.children.some(m=>m.userData.component==='style'));
  assert.ok(summer.children.some(m=>m.userData.component==='seed'));assert.ok(!summer.children.some(m=>m.userData.component==='petal'));
  const wood=g=>g.children.filter(m=>m.userData.component==='wood').map(m=>[...m.instanceMatrix.array]);assert.deepEqual(wood(winter),wood(spring));assert.deepEqual(wood(winter),wood(summer));
  dispose(winter);dispose(spring);dispose(summer);
 }
 const astelia=makePlant('p-928f3f1df9b2',523,2,2),winter=plantModel(astelia,view(1)),summer=plantModel(astelia,view(6));
 const blades=g=>g.children.find(m=>m.geometry.userData.asteliaBlade);assert.ok(blades(winter));assert.deepEqual([...blades(winter).instanceMatrix.array],[...blades(summer).instanceMatrix.array]);assert.notEqual(stateAt(astelia,view(1)).leafColor,stateAt(astelia,view(6)).leafColor);dispose(winter);dispose(summer);
});

test('celosia distinguishes cockscombs, terminal Dracula heads and branched plumes without post-winter regrowth',()=>{
 const ids=['p-0d7284ac4c9f','p-7d6b310a39da','p-25f6d511fd01','p-579dd16aa7f5','p-747988314240'];
 for(const id of ids){
  const p=makePlant(id,551,2,2),summer=plantModel(p,view(9)),winter=plantModel(p,view(1));assert.equal(winter.children.length,0,id);
  assert.ok(summer.children.some(m=>m.userData.component.startsWith('sepal')),id);
  assert.equal(summer.children.some(m=>m.geometry.userData.celosiaCrest),['p-0d7284ac4c9f','p-7d6b310a39da'].includes(id));
  for(const m of summer.children)assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);dispose(summer);
  const autumnPlant={...p,start:8};assert.equal(stateAt(autumnPlant,{...view(5),year:1}).groundDormant,true,id);assert.equal(stateAt(p,{...view(9),year:1}).present,false,id);
 }
 assert.equal(seasonAt(CATALOG['p-579dd16aa7f5'],8).bloom,false);assert.equal(seasonAt(CATALOG['p-579dd16aa7f5'],10).bloom,true);
 const counts=id=>{const g=plantModel(makePlant(id,552,2,2),view(9));const n=g.children.filter(m=>m.geometry.userData.celosiaCrest).reduce((n,m)=>n+m.count,0);dispose(g);return n;};
 assert.ok(counts('p-7d6b310a39da')<counts('p-0d7284ac4c9f'));
});

test('monarda winter seed stems keep their height while Bergamo remains a flowering-cycle annual',()=>{
 for(const id of ['p-1d891e02bfb8','p-1c5cbca2e8b7']){
  const p=makePlant(id,553,2,2),summer=plantModel(p,view(7)),winter=plantModel(p,view(1));
  const stems=g=>g.children.find(m=>m.geometry.userData.squareStem);assert.ok(stems(summer));assert.ok(stems(winter));assert.deepEqual([...stems(summer).instanceMatrix.array],[...stems(winter).instanceMatrix.array]);
  assert.deepEqual(summer.scale.toArray(),winter.scale.toArray());assert.ok(winter.children.some(m=>m.userData.component==='seed'));assert.ok(!winter.children.some(m=>m.userData.component.startsWith('petal')));
  assert.ok(summer.children.some(m=>m.geometry.userData.monardaTube));dispose(summer);dispose(winter);
 }
 const berg=makePlant('p-0d0942c2daa1',554,2,2);assert.equal(CATALOG[berg.kind].life,'annual');assert.equal(stateAt(berg,view(10)).groundDormant,true);assert.equal(stateAt(berg,{...view(7),year:1}).present,false);
 assert.equal(plantModel(makePlant('p-521d2705f039',555,2,2),view(1)).children.length,0);
});

test('gaillardias have distinct ray proportions and patterns and documented winter dieback',()=>{
 for(const id of ['p-c72a3b014377','p-e37cb35247ad','p-d6e55daa5fd3','p-374d3d02fcb2','p-97744f7111c2']){
  const p=makePlant(id,556,2,2),g=plantModel(p,view(7));assert.equal(plantModel(p,view(1)).children.length,0,id);assert.equal(CATALOG[id].appearance.arrangement,'alternate');
  assert.ok(g.children.some(m=>m.userData.component==='receptacle'));assert.ok(g.children.some(m=>m.userData.component==='stigma'));
  if(id==='p-374d3d02fcb2')assert.ok(g.children.some(m=>m.userData.component==='petal-gaillardiaYellowRim-bd6249'));
  if(id==='p-97744f7111c2')assert.ok(g.children.some(m=>m.userData.component==='petal-gaillardiaRedBase-bd6249'));
  for(const m of g.children)assert.ok([...m.instanceMatrix.array].every(Number.isFinite));dispose(g);
 }
 assert.equal(seasonAt(CATALOG['p-97744f7111c2'],12).bloom,true);assert.equal(seasonAt(CATALOG['p-97744f7111c2'],1).bloom,false);
});

test('blueberry flowers become crowned waxy berries without changing the woody canes',()=>{
 for(const id of ['p-533203cb79c5','p-4f35979ad7ec','p-aa626158efcd','p-e80f8d914048']){
  const p=makePlant(id,571,2,2),spring=plantModel(p,view(4)),summer=plantModel(p,view(7)),winter=plantModel(p,view(1));
  const wood=g=>g.children.filter(m=>m.userData.component.startsWith('wood')).map(m=>[...m.instanceMatrix.array]);assert.deepEqual(wood(spring),wood(summer));assert.deepEqual(wood(spring),wood(winter));
  assert.ok(spring.children.some(m=>m.geometry.userData.blueberryUrn));assert.ok(summer.children.some(m=>m.geometry.userData.blueberryFruit));assert.ok(summer.children.some(m=>m.userData.component==='fruitCalyx'));
  assert.ok(!winter.children.some(m=>m.geometry.userData.blueberryFruit));assert.ok(winter.children.some(m=>m.userData.component.startsWith('leaf')));
  for(const g of [spring,summer,winter]){for(const m of g.children)assert.ok([...m.instanceMatrix.array].every(Number.isFinite));dispose(g);}
 }
 assert.equal(CATALOG['p-e80f8d914048'].appearance.habit,'rounded');assert.equal(CATALOG['p-4f35979ad7ec'].appearance.habit,'columnar');
 assert.equal(seasonAt(CATALOG['p-aa626158efcd'],5).fruitStage,'early');assert.equal(seasonAt(CATALOG['p-aa626158efcd'],8).fruitStage,null);
});
test('mountain azalea winters with small terminal summer leaves and preserves the original cultivar search alias',()=>{
 const p=makePlant('p-ba911bf5481a',572,2,2),summer=plantModel(p,view(7)),winter=plantModel(p,view(1));
 const leaves=g=>g.children.filter(m=>m.userData.component.startsWith('leaf'));
 assert.ok(leaves(winter).reduce((n,m)=>n+m.count,0)<leaves(summer).reduce((n,m)=>n+m.count,0));assert.ok(leaves(winter).length);
 const lengths=g=>leaves(g).flatMap(m=>Array.from({length:m.count},(_,i)=>Math.hypot(...m.instanceMatrix.array.slice(i*16+4,i*16+7))));
 assert.ok(Math.max(...lengths(winter))<Math.max(...lengths(summer))*.6);dispose(winter);dispose(summer);
 assert.equal(CATALOG['p-5d084bf2f871'].label,'サツキ 笠の雪');assert.ok(CATALOG['p-5d084bf2f871'].aliases.includes('サツキ 傘の雪'));
 const enk=plantModel(makePlant('p-1268eb07f3c9',573,2,2),view(1));assert.ok(enk.children.some(m=>m.userData.component.startsWith('wood')));assert.ok(!enk.children.some(m=>m.userData.component.startsWith('leaf')));dispose(enk);
});
