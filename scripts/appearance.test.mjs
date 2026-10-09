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

test('every catalog entry has an explicit evidence record and no unsupported completion claim',()=>{
 assert.deepEqual(Object.keys(APPEARANCE_DATA).sort(),Object.keys(CATALOG).sort());
 const allowed=new Set(['sources','basis','status','unconfirmed','arrangement','inflorescence','flowerShape','habit','leafShape','leafTexture','leafColor','barkColor','barkPattern','petals','persistence','flowerMonths','flowerTiming','emergenceMonths','dormantMonths','leafPattern','patternColor','flowerLayers','flowerPattern','scientificName','phenologyRegion','leafLength','leafRelief','seasonalColors','stemColor','leaflets','compoundType','standingWinter','flowerSeasons','leafMargin','architecture','winterClimateSensitive','lifeForm','flowerPatternColor','outerFlowerPattern','flowerRadius','seedHeadMonths','seedColor','flowerPalette','flowerGuides','foliageMonths','leaflessBloom','flowerOptions','leafletShape','flowerFadeTo','headRadius','inflorescenceLength','leafletCounts','leafUnderside','springShootColor','stamenCount','leafFlushAfterFlower','monthlyLeafColors','bracts','flowerOutsideColor','flowerEyeColor','monthlyPatternColors']);
 for(const [id,a] of Object.entries(APPEARANCE_DATA)){
  assert.ok(Object.keys(a).every(k=>allowed.has(k)),id);assert.ok(['attributes','unconfirmed','partial'].includes(a.status));
  for(const source of a.sources){const u=new URL(source.url);assert.equal(u.protocol,'https:');assert.ok(['www.ogis.co.jp','www.engei.net','plants.ces.ncsu.edu','plantfinder.mobot.org','www.rhs.org.uk','item.rakuten.co.jp','www.nzpcn.org.nz','www.kernock.co.uk','www.rhsplants.co.uk','plantnet.rbgsyd.nsw.gov.au','active.inspection.gc.ca','www.darwinperennials.com','catalog.darwinperennials.com','info.ballseed.com','www.plantdelights.com','hortflora.rbg.vic.gov.au','www.thompson-morgan.com','www.nmns.edu.tw','plants.usda.gov','fitzgerald-nurseries.com','www.ffpri.go.jp','www.hro.or.jp','www.pharm.kumamoto-u.ac.jp','www.rinya.maff.go.jp','www.higashiyama.city.nagoya.jp','www.treesandshrubsonline.org','www1.ous.ac.jp','web.tuat.ac.jp','www.tokyo-park.or.jp','www.cgr.mlit.go.jp','www.aglandscape.co.jp','www.town.kumano.lg.jp','www.env.go.jp','www.forest-akita.jp','powo.science.kew.org','arboretum.harvard.edu','landscapeplants.oregonstate.edu','www.hanahiroba.com','www.paradisegarden-nishiyama.com','www.provenwinners.com','www.botanic.jp','botany.cz','vicflora.rbg.vic.gov.au'].includes(u.hostname));assert.ok(['catalog-entry','species','genus'].includes(source.scope));}
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
