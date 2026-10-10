import test from 'node:test';
import assert from 'node:assert/strict';
import {CATALOG,makePlant,stateAt,annualGalleryDocument,validateDocument} from '../site/model.js';
import {APPEARANCE_DATA} from '../site/appearance-data.js';
import {seasonAt} from '../site/catalog-search.js';
import {plantModel} from '../site/vegetation.js';
import {drawTree} from '../site/tree-model.js';
import {detailedFlower,drawDetailedHerb,coniferShootGeometry,CONIFER_SHOOTS} from '../site/plant-detail.js';
import {foliageKind} from '../site/appearance.js';
const view=month=>({month,year:0,reference:false});
const dispose=g=>{for(const m of g.children){m.geometry?.dispose();if(m.isInstancedMesh)m.dispose();}};

test('Delphinium distinguishes annual renewal, perennial winter loss, palmate leaves and spurred single or double flowers',()=>{
 const entries=Object.entries(CATALOG).filter(([,p])=>p.appearance?.architecture==='delphiniumSpires');assert.equal(entries.length,6);
 for(const [i,[id,info]] of entries.entries())for(let month=1;month<=12;month++){
  const p=makePlant(id,7200+i,2,2),st=stateAt(p,view(month)),g=plantModel(p,view(month));
  const count=k=>g.children.filter(m=>m.userData.component.startsWith(k)).reduce((n,m)=>n+m.count,0);
  if(st.groundDormant){assert.equal(g.children.length,0,id+':'+month);continue;}
  assert.ok(count('leaf-delphinium')>0);assert.equal(count('sepal-delphinium')>0,st.bloom,id+':'+month);
  if(st.bloom){assert.equal(count('sepal-delphinium'),count('spur-delphinium')*5*info.appearance.flowerLayers);assert.ok(count('beard-delphinium')>0);}
  if([1,2,12].includes(month))assert.equal(info.life,'annual');
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);
 }
 const p=makePlant('p-54918635b6af',7240,2,2);assert.equal(stateAt(p,{...view(5),year:1}).present,false);assert.ok(stateAt(p,view(10)).groundDormant);
 for(const id of ['p-6c1f697002ea','p-7ab92c7156f3','p-f3e9a60bb693']){const p=makePlant(id,7241,2,2);assert.equal(stateAt(p,{...view(7),year:1}).present,true);assert.ok(seasonAt(CATALOG[id],3).leafScale<seasonAt(CATALOG[id],7).leafScale);}
 assert.notEqual(CATALOG['p-7ab92c7156f3'].appearance.flowerPalette.bee,CATALOG['p-f3e9a60bb693'].appearance.flowerPalette.bee);
 assert.notEqual(CATALOG['p-aedc6ad21e16'].appearance.leafShape,CATALOG['p-7ab92c7156f3'].appearance.leafShape);
});

test('Saxifragaceae keep winter rosettes, unequal petals, hairy leaves and distinct rhizomes or runners',()=>{
 const entries=Object.entries(CATALOG).filter(([,p])=>['saxifrageRosettes','bergeniaRhizomes'].includes(p.appearance?.architecture));assert.equal(entries.length,7);
 for(const [i,[id,info]] of entries.entries())for(let month=1;month<=12;month++){
  const p=makePlant(id,7100+i,2,2),st=stateAt(p,view(month)),g=plantModel(p,view(month)),sax=info.appearance.architecture==='saxifrageRosettes';
  const count=k=>g.children.filter(m=>m.userData.component.startsWith(k)).reduce((n,m)=>n+m.count,0);
  assert.equal(st.groundDormant,false);assert.ok(count(sax?'leaf-saxifrage':'leaf-bergenia')>0);assert.ok(count(sax?'runner-saxifrage':'rhizome-bergenia')>0);
  assert.equal(count(sax?'petal-saxifrage':'petal-bergenia')>0,st.bloom);
  if(sax&&st.bloom){assert.equal(count('petal-saxifrage-long')*3,count('petal-saxifrage-spotted')*2);assert.equal(count('anther-saxifrage'),count('petal-saxifrage-long')*5);}
  if(sax||info.appearance.shootProfile==='dumbo')assert.ok(count(sax?'hair-saxifrage':'hair-bergenia')>0);
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);
 }
 assert.equal(seasonAt(CATALOG['p-f9b0afaaa4ca'],10).bloom,true);assert.equal(seasonAt(CATALOG['p-8df7e24225e1'],10).bloom,false);
 assert.notEqual(seasonAt(CATALOG['p-8df7e24225e1'],1).leafColor,seasonAt(CATALOG['p-8df7e24225e1'],7).leafColor);
 assert.ok(seasonAt(CATALOG['p-5710cb13f030'],1).leafDensity<seasonAt(CATALOG['p-5710cb13f030'],7).leafDensity);
 assert.equal(CATALOG['p-f9b0afaaa4ca'].spread,null,'40cm or more is not an upper bound');
});

test('Agapanthus fans distinguish cold winter loss, bicolour trumpets, closed doubles and fading leaf margins',()=>{
 const entries=Object.entries(CATALOG).filter(([,p])=>p.appearance?.architecture==='agapanthusFans');assert.equal(entries.length,15);
 for(const [i,[id,info]] of entries.entries())for(let month=1;month<=12;month++){
  const p=makePlant(id,7000+i,2,2),st=stateAt(p,view(month)),g=plantModel(p,view(month)),has=k=>g.children.some(m=>m.userData.component.startsWith(k));
  if(st.groundDormant){assert.equal(g.children.length,0,id+':'+month);continue;}
  assert.ok(has('leaf-agapanthus'));assert.equal(g.userData.architecture,'agapanthusFans');assert.equal(has('petal-agapanthus'),st.bloom,id+':'+month);assert.equal(has('spathe-agapanthus'),st.flowerBuds);
  if(st.bloom){const count=k=>g.children.filter(m=>m.userData.component.startsWith(k)).reduce((n,m)=>n+m.count,0);assert.equal(count('anther-agapanthus'),count('petal-agapanthus')/info.appearance.petals*info.appearance.stamenCount);}
  if(info.appearance.shootProfile==='silver')assert.equal(has('leaf-agapanthus-margin'),[3,4,5,6,7].includes(month));
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);
 }
 const winter=entries.filter(([,p])=>seasonAt(p,1).groundDormant);assert.equal(winter.length,14);assert.equal(seasonAt(CATALOG['p-e0e65a82a219'],1).groundDormant,false);
 assert.equal(CATALOG['p-4b10b55a8582'].height[1],.7);assert.equal(CATALOG['p-202a392f3c9a'].appearance.flowerShape,'agapanthusClosed');assert.equal(CATALOG['p-fdf562bb983f'].appearance.petals,12);
});

test('Heucherella preserves palmate foliage, trailing stems and rare or stamenless flowers throughout the year',()=>{
 const entries=Object.entries(CATALOG).filter(([,p])=>p.appearance?.architecture==='heucherellaCrowns');assert.equal(entries.length,12);
 for(const [i,[id,info]] of entries.entries())for(let month=1;month<=12;month++){
  const p=makePlant(id,6900+i,2,2),st=stateAt(p,view(month)),g=plantModel(p,view(month)),has=k=>g.children.some(m=>m.userData.component.startsWith(k));
  assert.equal(st.groundDormant,false,id+':'+month);assert.ok(has('leaf-heucherella'));assert.equal(g.userData.architecture,'heucherellaCrowns');
  assert.equal(has('petal-heucherella'),st.bloom,id+':'+month);assert.equal(has('anther-heucherella'),st.bloom&&info.appearance.stamenCount>0,id);
  assert.equal(has('runner-heucherella'),['copper','plum','yellowstone'].includes(info.appearance.shootProfile));
  assert.ok(!has('fruit'));assert.ok(!has('seed'));
  if(st.bloom){
   const count=k=>g.children.filter(m=>m.userData.component===k).reduce((n,m)=>n+m.count,0);
   assert.equal(count('petal-heucherella')/5,count('sepal-heucherella'));
   assert.equal(count('anther-heucherella'),count('sepal-heucherella')*info.appearance.stamenCount);
   if(info.appearance.pistilCount===10)assert.equal(count('ovary-heucherella'),count('sepal-heucherella')*10);
   if(info.appearance.flowerAbundance==='rare')assert.equal(count('scape-heucherella'),1);
  }
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);
 }
 const types=new Set(entries.map(([,p])=>p.appearance.leafShape));assert.equal(types.size,6);
 const butter=CATALOG['p-db772e42cb59'];assert.notEqual(seasonAt(butter,5).leafColor,seasonAt(butter,1).leafColor);
 assert.equal(CATALOG['p-88a52b6656d9'].colors[0],'white');assert.ok(CATALOG['p-26174da2b69e'].label.startsWith('ヒューケラ '));assert.ok(CATALOG['p-26174da2b69e'].aliases.includes('ヒューケレラ パープルレインフォレスト'));
});

test('Iberis has unequal four-petal flowers, alternate narrow leaves and distinct annual or woody persistence',()=>{
 const entries=Object.entries(CATALOG).filter(([,p])=>p.appearance?.architecture==='iberisCorymbs');assert.equal(entries.length,6);
 for(const [i,[id,info]] of entries.entries())for(let month=1;month<=12;month++){
  const p=makePlant(id,6800+i,2,2),st=stateAt(p,view(month)),g=plantModel(p,view(month)),has=k=>g.children.some(m=>m.userData.component.startsWith(k));
  if(st.groundDormant){assert.equal(g.children.length,0,id+':'+month);continue;}
  assert.equal(g.userData.architecture,'iberisCorymbs');assert.equal(has('leaf-iberis'),st.leafDensity>0,id+':'+month);assert.equal(has('petal-iberis'),st.bloom,id+':'+month);
  if(st.bloom){const petals=g.children.filter(m=>m.userData.component==='petal-iberis').reduce((n,m)=>n+m.count,0),anthers=g.children.filter(m=>m.userData.component==='anther-iberis').reduce((n,m)=>n+m.count,0);assert.equal(petals/4,anthers/6);assert.ok(has('calyx-iberis'));}
  if(st.seedHeads){assert.ok(has('silicle-iberis'));assert.ok(!has('petal-iberis'));}
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);
 }
 for(const id of ['p-b8c696cb1219','p-9eceb7b51353']){
  const p=makePlant(id,6830,2,2);assert.ok(stateAt(p,view(1)).leafDensity>0);assert.ok(stateAt(p,view(8)).groundDormant);assert.ok(stateAt(p,view(10)).groundDormant);
  p.start=9;assert.ok(stateAt(p,view(10)).leafDensity>0);assert.ok(stateAt(p,{month:5,year:1,reference:false}).bloom);
 }
 for(const id of ['p-8b51fff607a6','p-568a5f2af1e5','p-4cbad797febb']){const g=plantModel(makePlant(id,6840,2,2),view(1));assert.ok(g.children.some(m=>m.userData.component==='woodyBranch-iberis'));dispose(g);}
 assert.equal(CATALOG['p-130143e942df'].appearance.seedHeadMonths,undefined);assert.equal(CATALOG['p-130143e942df'].appearance.leafShape,'iberisToothed');
 const colors=new Set([1,2,3,4].map(i=>stateAt(makePlant('p-b8c696cb1219',i,2,2),view(5)).flowerColor));assert.equal(colors.size,4);
});

test('Astilbe keeps divided serrate leaves, branched plumes, flower-free autumn heads and winter disappearance',()=>{
 const entries=Object.entries(CATALOG).filter(([,p])=>p.appearance?.architecture==='astilbePlumes');assert.equal(entries.length,12);
 for(const [i,[id]] of entries.entries())for(let month=1;month<=12;month++){
  const p=makePlant(id,6700+i,2,2),st=stateAt(p,view(month)),g=plantModel(p,view(month)),has=k=>g.children.some(m=>m.userData.component.startsWith(k));
  if(st.groundDormant){assert.equal(g.children.length,0,id+':'+month);continue;}
  assert.equal(g.userData.architecture,'astilbePlumes');assert.ok(has('leaf-astilbe'),id+':'+month);assert.equal(has('petal-astilbe'),st.bloom,id+':'+month);
  if(st.bloom||st.seedHeads){assert.ok(has('panicleBranch-astilbe'));assert.ok(has('panicleTwig-astilbe'));}
  if(st.seedHeads){assert.ok(has('seedHead-astilbe'));assert.ok(!has('petal-astilbe'));}
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);
 }
 for(const [id] of entries)assert.ok(stateAt(makePlant(id,6740,2,2),view(1)).groundDormant);
 assert.deepEqual(CATALOG['p-0422e56920c8'].appearance.flowerMonths,[6,7,8]);
 const lime=makePlant('p-b4d3c8b74625',6741,2,2);assert.notEqual(stateAt(lime,view(4)).leafColor,stateAt(lime,view(8)).leafColor);
 const mocha=makePlant('p-b1991b29a607',6742,2,2);assert.notEqual(stateAt(mocha,view(4)).leafColor,stateAt(mocha,view(8)).leafColor);assert.ok(CATALOG[mocha.kind].appearance.flowerPalette.arching);
 assert.equal(CATALOG['p-b2887e0b4dbf'].appearance.flowerPalette.dry,'#929966');
});

test('Aquilegia separates spurless doubles and bells from long or curved spurs and removes winter tops',()=>{
 const entries=Object.entries(CATALOG).filter(([,p])=>p.appearance?.architecture==='aquilegiaCymes');assert.equal(entries.length,15);
 for(const [i,[id,info]] of entries.entries())for(let month=1;month<=12;month++){
  const p=makePlant(id,6600+i,2,2),st=stateAt(p,view(month)),g=plantModel(p,view(month)),has=k=>g.children.some(m=>m.userData.component.startsWith(k));
  if(st.groundDormant){assert.equal(g.children.length,0,id+':'+month);continue;}
  assert.equal(g.userData.architecture,'aquilegiaCymes');assert.ok(has('leaf-aquilegia'),id+':'+month);assert.ok(has('leafRachis-aquilegia'));assert.equal(has('petal-aquilegia'),st.bloom,id+':'+month);
  assert.equal(has('spur-aquilegia'),st.bloom&&['winky','chrysantha','koralle','buergeriana','canadensis'].includes(info.appearance.shootProfile),id+':'+month);
  if(st.bloom){assert.ok(has('anther-aquilegia'));assert.ok(has('pedicel-aquilegia'));}
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);
 }
 for(const [id] of entries)for(const month of [1,2,12])assert.ok(stateAt(makePlant(id,6620,2,2),view(month)).groundDormant);
 assert.deepEqual(CATALOG['p-a5dcd891a603'].appearance.flowerMonths,[5,6,7]);assert.deepEqual(CATALOG['p-fd46ba5c5819'].appearance.flowerMonths,[4,5,6]);
 assert.equal(CATALOG['p-5fb031cbf04a'].appearance.flowerMonths.includes(9),false);
 const nora=plantModel(makePlant('p-59a0cf40e2e0',6621,2,2),view(5));assert.ok(nora.children.some(m=>m.userData.component.startsWith('petal-aquilegia-tip')));dispose(nora);
});

test('Dianthus keeps five fringed petals, paired simple leaves and source-specific winter and flowering seasons',()=>{
 const rows=Object.entries(CATALOG).filter(([,p])=>p.appearance?.architecture==='dianthusCymes');assert.equal(rows.length,12);
 for(const [i,[id,info]] of rows.entries())for(let month=1;month<=12;month++){
  const p=makePlant(id,6500+i,2,2),st=stateAt(p,view(month)),g=plantModel(p,view(month)),has=k=>g.children.some(m=>m.userData.component.startsWith(k));
  if(st.groundDormant){assert.equal(g.children.length,0,id+':'+month);continue;}
  assert.equal(g.userData.architecture,'dianthusCymes');assert.ok(has('leaf'),id+':'+month);assert.equal(has('petal-dianthus'),st.bloom,id+':'+month);
  if(st.bloom){assert.ok(has('calyx-dianthus'));assert.ok(has('style-dianthus'));assert.ok(has('epicalyx-dianthus'));}
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}
  dispose(g);
 }
 for(const id of ['p-a1a50fbc1525','p-42c8fe4bac77','p-3cd1e27a8030'])assert.equal(stateAt(makePlant(id,6530,2,2),view(1)).groundDormant,true);
 for(const id of ['p-47f878ad504a','p-85a1652c0694','p-7518054c3c6f','p-2ba08079c9c5'])assert.equal(stateAt(makePlant(id,6531,2,2),view(1)).groundDormant,false);
 assert.ok(stateAt(makePlant('p-a1adee4eacd3',6532,2,2),view(1)).bloom);assert.equal(stateAt(makePlant('p-a1adee4eacd3',6532,2,2),view(8)).bloom,false);
 const annual=makePlant('p-2e21db161a63',6533,2,2);assert.ok(stateAt(annual,view(5)).bloom);assert.ok(stateAt(annual,view(7)).groundDormant);assert.ok(stateAt(annual,view(10)).groundDormant);
 const monk=makePlant('p-2ba08079c9c5',6534,2,2);assert.notEqual(stateAt(monk,view(1)).leafColor,stateAt(monk,view(8)).leafColor);
});

test('verbena distinguishes terminal heads, progressive spikes, creeping mats and winter basal leaves',()=>{
 const rows=Object.entries(CATALOG).filter(([,p])=>p.appearance?.architecture==='verbenaBranches'||p.appearance?.architecture==='tapienMat');assert.equal(rows.length,10);
 for(const [i,[id,info]] of rows.entries())for(let month=1;month<=12;month++){
  const p=makePlant(id,6400+i,2,2),st=stateAt(p,view(month)),g=plantModel(p,view(month)),has=k=>g.children.some(m=>m.userData.component.startsWith(k));
  assert.equal(has('petal'),st.bloom,id+':'+month);
  if(st.groundDormant)assert.equal(g.children.length,0,id+':'+month);
  else {assert.ok(has('leaf'),id+':'+month);for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite));assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite));}}
  if(st.bloom&&['hastata','bampton'].includes(info.appearance.shootProfile))assert.ok(has('flowerSpike'));
  if(st.bloom&&info.appearance.architecture==='tapienMat')assert.ok(has('stolon'));
  dispose(g);
 }
 for(const id of ['p-b4dedb0c3b62','p-15a8dbc3b5db','p-7869cffdff1b']){const g=plantModel(makePlant(id,6415,2,2),view(1));assert.ok(g.children.some(m=>m.userData.component.startsWith('leaf')));assert.ok(!g.children.some(m=>m.userData.component.startsWith('stem')));dispose(g);}
 for(const id of ['p-2f74695617ac','p-af0bf411d347','p-1cfdd4f3b3ef'])assert.ok(stateAt(makePlant(id,6416,2,2),view(1)).groundDormant);
 assert.equal(CATALOG['p-af0bf411d347'].appearance.habit,'upright');
 assert.deepEqual(CATALOG['p-7869cffdff1b'].appearance.flowerMonths,[4,5,6,7,8,9,10,11]);
});

test('31 scabious profiles preserve florets, basal winter leaves, seed cups and biennial teasel',()=>{
 const entries=Object.entries(CATALOG).filter(([,p])=>p.appearance?.architecture==='scabiousHabit');assert.equal(entries.length,31);
 for(const [i,[id,info]] of entries.entries()){
  const p=makePlant(id,6100+i,2,2);
  for(let month=1;month<=12;month++){
   const st=stateAt(p,view(month)),g=plantModel(p,view(month)),has=k=>g.children.some(m=>m.userData.component.startsWith(k));
   if(st.groundDormant){assert.equal(g.children.length,0,id+':'+month);continue;}
   assert.equal(g.userData.architecture,'scabiousHabit');assert.equal(has('petal'),st.bloom,id+':'+month);
   if(st.leafDensity>0)assert.ok(has('leaf'),id+':'+month);
   assert.ok(!has('discFloret'),id+': daisies must not replace scabious');
   if(info.appearance.shootProfile==='succisella')assert.ok(!has('involucre'),id+': no enlarged outer florets');
   for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);
  }
 }
 for(const id of ['p-3c99bf4428bf','p-714c22be3735','p-f929d5901779']){const g=plantModel(makePlant(id,6200,2,2),view(1));assert.ok(g.children.some(m=>m.userData.component.startsWith('leaf')));assert.ok(!g.children.some(m=>m.userData.component.startsWith('stem')));dispose(g);}
 assert.equal(stateAt(makePlant('p-e63ef5461f19',6201,2,2),view(1)).groundDormant,true);
 const winterFlower=makePlant('p-7f57675b7ac0',6202,2,2);assert.ok(stateAt(winterFlower,view(1)).bloom);assert.equal(stateAt(winterFlower,view(7)).bloom,false);
 const drum=plantModel(makePlant('p-8b222ce12af1',6203,2,2),view(8));assert.ok(drum.children.some(m=>m.userData.component==='seedCup'));assert.ok(!drum.children.some(m=>m.userData.component.startsWith('petal')));dispose(drum);
 const teasel=makePlant('p-b2f07807e418',6204,2,2);assert.ok(stateAt(teasel,view(8)).biennialRosette);assert.equal(stateAt(teasel,{...view(1),year:1}).seedHeads,false);
 const bloom=plantModel(teasel,{...view(7),year:1});assert.ok(bloom.children.some(m=>m.userData.component==='petal-teasel'));assert.ok(bloom.children.some(m=>m.userData.component==='leafCup'));dispose(bloom);
 const january={...view(1),year:2},st=stateAt(teasel,january),dead=plantModel(teasel,january);assert.ok(st.standingDead);assert.ok(st.present);assert.equal(st.leafDensity,0);assert.ok(dead.children.some(m=>m.userData.component==='teaselReceptacle'));assert.ok(!dead.children.some(m=>m.userData.component.startsWith('leaf')));dispose(dead);
 assert.equal(stateAt(teasel,{...view(3),year:2}).present,false);
});

test('Asteraceae preserve rosettes, silver and dissected foliage, rayless heads and biennial lifespan',()=>{
 const entries=Object.entries(CATALOG).filter(([,p])=>p.appearance?.architecture==='asteraceaeHabit');assert.equal(entries.length,25);
 for(const [i,[id,info]] of entries.entries()){
  const p=makePlant(id,6000+i,2,2);
  for(let month=1;month<=12;month++){
   const st=stateAt(p,view(month)),g=plantModel(p,view(month)),has=k=>g.children.some(m=>m.userData.component.startsWith(k));
   if(st.groundDormant){assert.equal(g.children.length,0,id+':'+month);continue;}
   assert.equal(g.userData.architecture,'asteraceaeHabit');assert.ok(has('leaf'),id+':'+month);
   assert.equal(has('petal-'),st.bloom,id+':'+month);
   if(['craspedia','cotula','raoulia','leptinella','artichoke','cottonThistle','jurinea','marshallia','eupatorium','syneilesis'].includes(info.appearance.shootProfile))assert.ok(!has('petal-aster-rays'),id);
   for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);
  }
 }
 for(const id of ['p-413953ffa883','p-a65193340585','p-4e634cdede06','p-da2c164af57d','p-9ebc70425360','p-b3ded22bcf26','p-a426d8adbfca','p-3e720131ca63'])assert.equal(seasonAt(CATALOG[id],1).groundDormant,true,id);
 for(const id of ['p-a4614b2e3705','p-38a0315b1459','p-8169d1a9555a','p-0e59147efe23'])assert.equal(seasonAt(CATALOG[id],1).groundDormant,false,id);
 assert.deepEqual(CATALOG['p-a426d8adbfca'].appearance.flowerMonths,[6,7]);
 assert.deepEqual(CATALOG['p-7188d7ffb443'].appearance.flowerMonths,[6,7,9,10,11]);
 assert.deepEqual(CATALOG['p-f5131a8542c9'].appearance.flowerMonths,[9,10,11]);
 assert.equal(CATALOG['p-f5131a8542c9'].height,null);
 assert.equal(CATALOG['p-51cd86dd10f9'].latin,'Berlandiera lyrata');
 const thistle=makePlant('p-5a9afc3c9bdc',6012,2,2);
 assert.ok(stateAt(thistle,view(8)).biennialRosette);assert.equal(stateAt(thistle,view(8)).bloom,false);
 const second={...view(8),year:1};assert.ok(stateAt(thistle,second).bloom);assert.ok(plantModel(thistle,second).children.some(m=>m.userData.component==='petal-aster-florets'));
 assert.equal(stateAt(thistle,{...view(8),year:2}).present,false);
 const silver=CATALOG['p-a4614b2e3705'];assert.equal(foliageKind(silver),'leaf-woolly');
 assert.notEqual(CATALOG['p-5d9d19a10ef5'].appearance.leafColor,'#654756');
 const june=plantModel(makePlant('p-c66dc5e68f24',6022,2,2),view(6)),july=plantModel(makePlant('p-c66dc5e68f24',6022,2,2),view(7));
 assert.ok(june.children.some(m=>m.userData.component==='petal-aster-florets'));assert.ok(july.children.some(m=>m.userData.component==='pappus'));assert.ok(!july.children.some(m=>m.userData.component.startsWith('petal')));dispose(june);dispose(july);
});


test('daisy cultivars keep distinct leaves, flower patterns and winter organs in all months',()=>{
 const entries=Object.entries(CATALOG).filter(([,p])=>p.appearance?.architecture==='daisyBranches');assert.equal(entries.length,24);
 for(const [i,[id,info]] of entries.entries()){
  const p=makePlant(id,5900+i,2,2);
  for(let month=1;month<=12;month++){
   const st=stateAt(p,view(month)),g=plantModel(p,view(month)),has=k=>g.children.some(m=>m.userData.component.startsWith(k));
   if(st.groundDormant){assert.equal(g.children.length,0,id+':'+month);continue;}
   assert.equal(g.userData.architecture,'daisyBranches');assert.ok(has('leaf'),id+':'+month);
   assert.equal(has('petal-daisy'),st.bloom,id+':'+month);assert.ok(!g.children.some(m=>m.userData.component==='petal'));
   if(info.appearance.flowerPalette.profile==='pompon')assert.ok(!has('discFloret'));else assert.equal(has('discFloret'),st.bloom);
   for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite));assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite));}dispose(g);
  }
 }
 for(const id of ['p-c0fbf1923906','p-2f5d835d32f1','p-3e005440003f','p-88d246083b1f','p-fe9ba8e0d24b','p-c746d7e0f4ea','p-31bb8f24c44b','p-d32e8cbb65df','p-59035ffb8618'])assert.equal(seasonAt(CATALOG[id],1).groundDormant,true,id);
 for(const id of ['p-ee2893d69cba','p-e727a4189874']){assert.equal(seasonAt(CATALOG[id],1).groundDormant,false);assert.ok(seasonAt(CATALOG[id],1).shootScale<.2);}
 assert.notEqual(CATALOG['p-143c726fe441'].appearance.leafShape,CATALOG['p-ef395a34253d'].appearance.leafShape);
 assert.equal(CATALOG['p-59035ffb8618'].appearance.flowerPalette.profile,'pompon');assert.equal(CATALOG['p-457c186d13b8'].appearance.flowerPalette.profile,'plain');
 assert.equal(CATALOG['p-c31838efba91'].appearance.flowerPalette.profile,'goldBase');assert.equal(CATALOG['p-c31838efba91'].latin,"Gazania hybrid 'FLOGAZLEM'");
 assert.ok(!seasonAt(CATALOG['p-c1dc792b059c'],8).bloom);assert.ok(seasonAt(CATALOG['p-c1dc792b059c'],9).bloom);
 assert.ok(seasonAt(CATALOG['p-ed2c262b5e63'],3).bloom);assert.ok(!seasonAt(CATALOG['p-ed2c262b5e63'],12).bloom);
 assert.notEqual(seasonAt(CATALOG['p-ef395a34253d'],1).leafColor,seasonAt(CATALOG['p-ef395a34253d'],6).leafColor);
});

test('Myrtaceae retain evergreen frameworks, species leaf types and independently timed flowers and fruit',()=>{
 const entries=Object.entries(CATALOG).filter(([,p])=>p.appearance?.architecture==='myrtaceousTree');assert.equal(entries.length,20);
 for(const [i,[id,info]] of entries.entries()){
  const plant=makePlant(id,5800+i,2,2);let woody;
  for(let month=1;month<=12;month++){
   const g=plantModel(plant,view(month)),has=k=>g.children.some(m=>m.userData.component.startsWith(k)),wood=g.children.filter(m=>m.userData.component.startsWith('wood')).map(m=>[...m.instanceMatrix.array]);
   if(month===1)woody=wood;else assert.deepEqual(wood,woody,id+':'+month);
   assert.equal(g.userData.architecture,'myrtaceousTree');assert.ok(has('leaf'));assert.ok(wood.length);
   assert.equal(has('stamen-'),(info.appearance.flowerMonths||[]).includes(month),id+':'+month);
   assert.equal(has('fruit'),(info.appearance.fruitMonths||[]).includes(month),id+':'+month);
   assert.ok(!g.children.some(m=>m.userData.component==='petal'));
   for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite));assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite));}dispose(g);
  }
 }
 assert.equal(CATALOG['p-955ebb006bcf'].bloomKnown,false);assert.equal(CATALOG['p-955ebb006bcf'].height[1],11);
 assert.equal(CATALOG['p-bc455edfb4d0'].latin,'Callistemon sp.');assert.equal(CATALOG['p-3991f2bc25de'].latin,'Leptospermum sp.');
 assert.equal(CATALOG['p-5c490e082f6e'].appearance.leafPattern,'margin');
 assert.equal(CATALOG['p-0ad615967045'].appearance.leafShape,'melaleucaOvate');
 assert.notEqual(seasonAt(CATALOG['p-195624f061a9'],1).leafColor,seasonAt(CATALOG['p-195624f061a9'],6).leafColor);
 assert.equal(CATALOG['p-1c1ef99ebbe3'].appearance.habit,'upright');assert.equal(CATALOG['p-71e4c559edc8'].appearance.fruitMonths[0],11);
});

test('smoke trees lose winter leaves while keeping open forks and hairy pedicels distinct from tiny flowers',()=>{
 const entries=Object.entries(CATALOG).filter(([,p])=>p.appearance?.architecture==='smokeTree');assert.equal(entries.length,16);
 for(const [i,[id,info]] of entries.entries()){
  const p=makePlant(id,5700+i,2,2);let wood;
  for(let month=1;month<=12;month++){
   const g=plantModel(p,view(month)),has=k=>g.children.some(m=>m.userData.component===k),structure=g.children.filter(m=>m.userData.component.startsWith('wood-smoke')).map(m=>[...m.instanceMatrix.array]);
   if(month===1)wood=structure;else assert.deepEqual(structure,wood,id);
   assert.equal(g.userData.architecture,'smokeTree');assert.ok(structure.length);
   assert.equal(has('smokeHair'),info.appearance.flowerMonths.includes(month),id+':'+month);
   if([12,1,2,3].includes(month)){assert.ok(!has('leaf-cotinus'));assert.ok(!has('smokeHair'));}
   if(month===info.appearance.flowerMonths[0])assert.ok(has('tinyFlower'));
   if(month===6){assert.ok(has('leaf-cotinus'));assert.ok(has('panicleAxis'));assert.ok(!has('tinyFlower'));assert.ok(g.children.some(m=>m.geometry.userData.smokePanicle==='hair'));}
   assert.ok(!g.children.some(m=>m.userData.component==='petal'));
   for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite));assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite));}dispose(g);
  }
 }
 for(const id of ['p-28018b1b58ad','p-2a2d4c73c0a6']){assert.equal(CATALOG[id].appearance.leafPattern,undefined);assert.equal(CATALOG[id].height[1],2);}
 assert.equal(CATALOG['p-2f7d16c0e81d'].appearance.leafColor,'#698950');
 assert.equal(CATALOG['p-94b6789a6aff'].latin,"Cotinus 'Grace'");assert.equal(CATALOG['p-94b6789a6aff'].height[1],8);
 assert.ok(CATALOG['p-b9e98ab37550'].appearance.inflorescenceLength>=.4);
 assert.ok(seasonAt(CATALOG['p-85fd9b501614'],9).bloom);assert.ok(!seasonAt(CATALOG['p-0420e28273e5'],9).bloom);
 assert.notEqual(seasonAt(CATALOG['p-ad8d49f224be'],6).leafColor,seasonAt(CATALOG['p-ad8d49f224be'],11).leafColor);
});

test('conifers retain their woody framework and fine shoots throughout all twelve months',()=>{
 const ids=['p-da9dae3b0ef6','p-645baee46f84','p-97362e178bca','p-ca2ba9d7f2ae','p-06b34527803c','p-538cff375f14','p-dfcaa4864cdc','p-d989aaedd656','p-e9d9692fb78e','p-60958bea7a03','p-a91034780f33','p-8542f4a28a73'];
 for(const [i,id] of ids.entries()){
  const p=makePlant(id,5600+i,2,2);let wood;
  for(let month=1;month<=12;month++){
   const g=plantModel(p,view(month)),structure=g.children.filter(m=>m.userData.component.startsWith('wood')).map(m=>[...m.instanceMatrix.array]);
   if(month===1)wood=structure;else assert.deepEqual(structure,wood,id);
   assert.equal(g.userData.architecture,'coniferSprays');assert.ok(g.children.some(m=>m.userData.component.startsWith('leaf')));
   assert.ok(!g.children.some(m=>/petal|anther|fruit/.test(m.userData.component)));
   for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite));assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite));}
   dispose(g);
  }
 }
 for(const type of Object.keys(CONIFER_SHOOTS)){
  const old=coniferShootGeometry(type),young=coniferShootGeometry(type,true);
  assert.ok(old.userData.leafCount>10&&young.userData.leafCount>0);assert.notEqual(old.attributes.position.count,young.attributes.position.count);
  old.computeBoundingBox();assert.ok(old.boundingBox.max.y<.28);old.dispose();young.dispose();
 }
 assert.equal(CONIFER_SHOOTS.blueStarSpray.whorl,3);assert.equal(CONIFER_SHOOTS.hinokiSpray.blunt,true);assert.equal(CONIFER_SHOOTS.yewFlatSpray.flat,true);
 assert.ok(CATALOG['p-dfcaa4864cdc'].height[1]<=1);assert.equal(CATALOG['p-dfcaa4864cdc'].appearance.habit,'rounded');
 assert.equal(CATALOG['p-06b34527803c'].appearance.flushMonths.join(','),'5,6');
 assert.notEqual(seasonAt(CATALOG['p-d989aaedd656'],1).leafColor,seasonAt(CATALOG['p-d989aaedd656'],6).leafColor);
 assert.equal(CATALOG['p-60958bea7a03'].appearance.flowerShape,undefined);
});

test('banksiae retains winter leaves and thornless flowering side shoots unlike deciduous modern roses',()=>{
 const ids=['p-1edaa057c3f2','p-4bb8a3ddcba8','p-d3a5fcf40552','p-fd8bdc2e9fb7','p-c5604355e054','p-bcb27e2b8a16'];
 for(const [i,id] of ids.entries()){
  const p=makePlant(id,5500+i,2,2),banks=i===2||i===3;let winterWood;
  for(let month=1;month<=12;month++){
   const g=plantModel(p,view(month)),has=k=>g.children.some(m=>m.userData.component.startsWith(k)),wood=g.children.filter(m=>m.userData.component.startsWith('wood-rose')).map(m=>[...m.instanceMatrix.array]);
   if(month===1)winterWood=wood;else assert.deepEqual(wood,winterWood);
   assert.equal(has('prickle'),![1,2,3].includes(i));
   if([1,2,12].includes(month)){assert.equal(has('leaf'),banks);assert.ok(!has('petal-rose'));assert.ok(has('wood-rose'));}
   if(month===5){assert.ok(has('petal-rose'));assert.equal(has('rachisHair'),banks);assert.equal(g.children.some(m=>m.geometry.userData.banksiaePetal),banks);}
   if(banks){assert.equal(has('petal-rose'),[4,5].includes(month));assert.equal(has('stipule'),[3,4].includes(month));assert.ok(has('wood-rose-shoot'));}
   if(i===1||i===4)assert.equal(has('petal-rose'),[5,6].includes(month));
   for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite));assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite));}dispose(g);
  }
 }
 const banks=CATALOG[ids[2]].appearance;assert.ok(Math.abs(banks.leafWidth/banks.leafLength-.4)<1e-8);assert.deepEqual(banks.leafletCounts,[3,5,5]);
 assert.equal(CATALOG[ids[0]].appearance.flowerPalette.outside,'#eee6d9');
 assert.ok(CATALOG[ids[1]].appearance.unconfirmed.some(t=>t.includes('完全な一季咲き')));
 assert.ok(CATALOG[ids[4]].appearance.unconfirmed.some(t=>t.includes('秋の返り咲き')));
});

test('Austin roses preserve sourced petals, upright cups, chalices, leaflets and winter canes',()=>{
 const ids=['p-61be90f970d6','p-d56666e81aff','p-71787e1aa6c8','p-f87549ff8342','p-a5dc0118e478'],counts=[140,33,43,46,83];
 for(const [i,id] of ids.entries()){
  const a=CATALOG[id].appearance,parts=[];
  detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch(){}},{x:0,y:0,z:0,color:CATALOG[id].flower,r:a.flowerRadius,shape:a.flowerShape,petals:a.petals,palette:a.flowerPalette},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
  assert.equal(parts.filter(p=>p.kind.startsWith('petal-rose')).length,counts[i]);
  assert.equal(parts.some(p=>p.kind.includes('-outside-')),i===3);
  assert.equal(parts.some(p=>p.shape==='roseChalicePetal'),i===2);
  const p=makePlant(id,5400+i,2,2);let firstWood;
  for(let month=1;month<=12;month++){
   const g=plantModel(p,view(month)),has=k=>g.children.some(m=>m.userData.component.startsWith(k)),wood=g.children.filter(m=>m.userData.component.startsWith('wood-rose')).map(m=>[...m.instanceMatrix.array]);
   if(month===1)firstWood=wood;else assert.deepEqual(wood,firstWood);
   if([1,2,12].includes(month)){assert.ok(has('wood-rose'));assert.ok(!has('leaf'));assert.ok(!has('petal-rose'));}
   if(month===5){assert.ok(has('petal-rose'));assert.ok(has('leaf'));assert.equal(has('smallPrickle'),i===3);}
   for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite));assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite));}dispose(g);
  }
 }
 assert.deepEqual(CATALOG[ids[0]].appearance.leafletCounts,[7]);
 assert.ok(CATALOG[ids[0]].appearance.flowerPalette.upward);
 assert.notEqual(seasonAt(CATALOG[ids[3]],3).leafColor,seasonAt(CATALOG[ids[3]],6).leafColor);
 assert.equal(CATALOG[ids[4]].appearance.leafWidth,.045);
 assert.ok(CATALOG[ids[2]].appearance.unconfirmed.some(t=>t.includes('未採用')));
});

test('modern rose cultivars distinguish deep cups, jewel tips, cut petals and seasonal shoots',()=>{
 const ids=['p-4c42e5c92fab','p-1f3a131fd1d2','p-7daa11056df4','p-7c75d5724815','p-e4ab56f533c7','p-ab963b7f66d6','p-c597aacf0d2b','p-cfb9f5fa925c','p-c5b4cbd26c93','p-c78c405a8f03','p-d69d9c727481','p-96b87c788ac5','p-a68566b93240'];
 for(const [i,id] of ids.entries()){
  const p=makePlant(id,5300+i,2,2);let winterWood;
  for(let month=1;month<=12;month++){
   const g=plantModel(p,view(month)),has=k=>g.children.some(m=>m.userData.component.startsWith(k)),wood=g.children.filter(m=>m.userData.component.startsWith('wood-rose')).map(m=>[...m.instanceMatrix.array]);
   if(month===1)winterWood=wood;else assert.deepEqual(wood,winterWood);
   if([1,2,12].includes(month)){assert.ok(!has('leaf'));assert.ok(!has('petal'));assert.ok(has('wood-rose'));}
   if(month===5){assert.ok(has('petal-rose'));if(i===4)assert.ok(g.children.some(m=>m.geometry.userData.roseJewelPetal));if(i===6)assert.ok(has('anther'));}
   if(i===0)assert.equal(has('seasonalFlowerShoot'),month>=8||month<=2);
   if(i===11&&[5,8].includes(month))assert.equal(g.children.some(m=>m.geometry.userData.roseNotchedPetal),month===5);
   for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite));assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite));}dispose(g);
  }
  assert.ok(CATALOG[id].appearance.unconfirmed.some(t=>t.startsWith('花弁数')),'approximate counts remain disclosed');
 }
 assert.ok(CATALOG[ids[10]].appearance.flowerPalette.summerColor);
 assert.equal(CATALOG[ids[9]].appearance.flowerPalette.profile,'deepCup');
});

test('climbing roses distinguish single and repeat seasons, button eyes and exposed stamens',()=>{
 const ids=['p-8b959100d6a5','p-6011d93a3dfc','p-3fe6c8d496cf','p-dcb3c7378b3d','p-84d62ab0b18c','p-583035d6f662','p-46c7ea1f1f3f','p-52a69d0190a3','p-731b605dcf5a'];
 for(const [i,id] of ids.entries()){
  const info=CATALOG[id],p=makePlant(id,5200+i,2,2);let winterWood;
  for(let month=1;month<=12;month++){
   const g=plantModel(p,view(month)),has=k=>g.children.some(m=>m.userData.component.startsWith(k)),wood=g.children.filter(m=>m.userData.component.startsWith('wood-rose')).map(m=>[...m.instanceMatrix.array]);
   if(month===1)winterWood=wood;else assert.deepEqual(wood,winterWood);
   assert.ok(has('wood-rose'));if([1,2,12].includes(month)){assert.ok(!has('leaf'));assert.ok(!has('petal'));}
   if(month===5){assert.ok(has('petal-rose'));if(i===5)assert.ok(has('petal-button-eye'));if(i===8)assert.ok(has('anther'));}
   if(i===5&&month===10)assert.ok(!has('petal'));
   for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite));assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite));}dispose(g);
  }
 }
 const a=CATALOG[ids[5]].appearance;assert.ok(a.flowerPalette.rambling);assert.ok(a.flowerPalette.buttonEye);
 for(const id of [ids[4],ids[6],ids[7]]){assert.equal(seasonAt(CATALOG[id],8).bloom,false);assert.ok(seasonAt(CATALOG[id],10).flowerDensity<.3);}
 assert.ok(CATALOG[ids[3]].appearance.flowerPalette.ageTo);assert.ok(CATALOG[ids[0]].appearance.flowerPalette.rimWidth);
});

test('eight garden roses distinguish petal counts, rims, canes and leafless winter wood',()=>{
 const ids=['p-8b9c35e7dce9','p-5783228b0f93','p-81cf1325d049','p-dc62dd0183aa','p-8a2e1f357d5f','p-3def2072cc37','p-90ba8f0b4835','p-2ccb229fb3e3'];
 const petals=[25,28,25,38,45,65,29,38];
 for(const [i,id] of ids.entries()){
  const info=CATALOG[id],a=info.appearance,parts=[];
  detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch(){}},{x:0,y:0,z:0,r:a.flowerRadius,color:info.flower,shape:a.flowerShape,petals:a.petals,palette:a.flowerPalette},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
  assert.equal(parts.filter(p=>p.kind.startsWith('petal-rose')).length,petals[i]);assert.equal(parts.filter(p=>p.kind==='sepal').length,5);
  assert.equal(parts.some(p=>p.kind.includes('-rim-')),i===0||i===3);
  const p=makePlant(id,5100+i,2,2);let winterWood;
  for(let month=1;month<=12;month++){
   const g=plantModel(p,view(month)),has=k=>g.children.some(m=>m.userData.component.startsWith(k)),wood=g.children.filter(m=>m.userData.component.startsWith('wood-rose')).map(m=>[...m.instanceMatrix.array]);
   assert.ok(has('wood-rose'));assert.ok(has('prickle'));assert.ok(has('axillaryBud'));
   if(month===1)winterWood=wood;else assert.deepEqual(wood,winterWood,'canes persist through seasons');
   if([1,2,12].includes(month)){assert.ok(!has('leaf'));assert.ok(!has('petal-rose'));assert.equal(g.userData.groundDormant,undefined);}
   if(month===5){assert.ok(has('leaf'));assert.ok(has('stipule'));assert.ok(has('petal-rose'));assert.ok(g.children.some(m=>m.geometry.userData.roseLeaflet));}
   for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite));assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite));}dispose(g);
  }
 }
 assert.ok(CATALOG[ids[6]].appearance.flowerPalette.climber);assert.ok(CATALOG[ids[6]].appearance.flowerPalette.fewPrickles);
 assert.ok(seasonAt(CATALOG[ids[1]],10).flowerDensity<seasonAt(CATALOG[ids[1]],5).flowerDensity);
 assert.equal(seasonAt(CATALOG[ids[0]],3).phase,'資料の芽出し期');
});

test('silver mints separate woolly leaves, bracts, flower whorls and winter protection',()=>{
 const ids=['p-392d375c6493','p-acac58e58bb3','p-5d21e5f253ee','p-79fe91add73c'];
 for(const [i,id] of ids.entries())for(let month=1;month<=12;month++){
  const g=plantModel(makePlant(id,5000+i,2,2),view(month)),has=k=>g.children.some(m=>m.userData.component===k);
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}
  if(month===1){if(i===0||i===2){assert.ok(has('leaf-woolly'));assert.ok(!has('flowerAxis'));assert.ok(!has('corollaTube'));}else assert.equal(g.children.length,0,id);}
  if(month===(i===3?9:6)){
   assert.ok(has('squareStem'));assert.ok(has('leafHair'));assert.ok(has('corollaTube'));
   if(i===0){assert.ok(has('bract'));assert.ok(g.children.some(m=>m.geometry.userData.sideritisBract));}
   if(i===1){assert.ok(has('corollaLobe'));assert.ok(has('flowerAxis'));assert.ok(has('axillaryShoot'));}
   if(i===2){assert.ok(has('upperLobe'));assert.ok(!has('flowerAxis'));}
   if(i===3){assert.ok(has('spinyCalyx'));assert.ok(has('calyxSpine'));assert.ok(has('corollaHair'));assert.ok(has('reducedLowerLobe'));}
  }
  assert.equal(seasonAt(CATALOG[id],month).shootScale,1);dispose(g);
 }
 for(const [i,id] of ids.entries()){
  const ps=[];detailedFlower({add:(shape,kind)=>ps.push({shape,kind}),branch:(from,to,r,color,kind)=>ps.push({kind})},{x:0,y:0,z:0,shape:CATALOG[id].appearance.flowerShape,color:'#ddd'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
  assert.equal(ps.filter(p=>p.kind==='calyxTooth').length,i===3?8:5);assert.equal(ps.filter(p=>p.kind==='anther').length,4);
  if(i===0)assert.equal(ps.filter(p=>p.kind==='upperLobe').length,1);
  if(i===1)assert.equal(ps.filter(p=>p.kind==='corollaLobe').length,4);
  if(i===2)assert.equal(ps.filter(p=>p.kind==='upperLobe').length,2);
  if(i===3){assert.equal(ps.filter(p=>p.kind==='hood').length,1);assert.equal(ps.filter(p=>p.kind==='reducedLowerLobe').length,3);assert.equal(ps.filter(p=>p.kind==='corollaHair').length,44);}
 }
 for(const month of [12,1,2,3])assert.match(seasonAt(CATALOG[ids[3]],month).phase,/保護場所/);
 const doc=annualGalleryDocument();doc.plans.A.plants=ids.map((id,i)=>makePlant(id,5000+i,1+i*.4,2));assert.doesNotThrow(()=>validateDocument(doc));
});

test('woodland mints retain species lips, opposite leaves, variegation and winter stem behavior',()=>{
 const ids=['p-75ee98edb6cf','p-14343a8fc519','p-ffc559551f56','p-36787612a56c','p-c745bf454f2c','p-370762c841b1'];
 for(const [i,id] of ids.entries())for(let month=1;month<=12;month++){
  const g=plantModel(makePlant(id,4900+i,2,2),view(month)),has=k=>g.children.some(m=>m.userData.component===k);
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}
  if(month===1){
   if(i===0){assert.ok(has('standingDeadStem'));assert.ok(has('standingDeadRaceme'));assert.ok(!has('leaf'));assert.ok(!has('anther'));}
   else assert.equal(g.children.length,0,id);
  }
  if(month===(i===5?5:9)){
   assert.ok(has('squareStem'));assert.ok(has('corollaTube'));assert.ok(has('midrib'));assert.ok(has('lateralVein'));
   if(i===3){assert.ok(has('leaf-tripora-margin'));assert.ok(has('archedFilament'));assert.ok(has('archedStyle'));assert.ok(has('petal-tripora-lower'));}
   if(i===5){assert.ok(has('leafHair'));assert.ok(has('petal-melittis-lower'));}
   if(i===0)assert.ok(has('racemeAxis'));
   if(i===4)assert.ok(has('spikeAxis'));
  }
  if(month===7&&i===5){assert.ok(has('leaf'));assert.ok(!has('corollaTube'));}
  assert.equal(seasonAt(CATALOG[id],month).shootScale,1);dispose(g);
 }
 for(const [i,id] of ids.entries()){
  const shape=CATALOG[id].appearance.flowerShape,ps=[];detailedFlower({add:(shape,kind)=>ps.push({shape,kind}),branch:(from,to,r,color,kind)=>ps.push({kind})},{x:0,y:0,z:0,shape,color:'#ddd'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
  assert.equal(ps.filter(p=>p.kind==='calyx').length,i===5?3:5);
  assert.equal(ps.filter(p=>p.kind==='upperLobe').length,i===0?2:[1,3].includes(i)?4:1);
  assert.equal(ps.filter(p=>p.kind==='anther').length,i===3?8:4);
  if(i===3){assert.equal(ps.filter(p=>p.kind==='archedFilament').length,4*18);assert.equal(ps.filter(p=>p.kind==='archedStyle').length,18);}
 }
 assert.notEqual(seasonAt(CATALOG[ids[1]],9).leafColor,seasonAt(CATALOG[ids[1]],11).leafColor);
 const doc=annualGalleryDocument();doc.plans.A.plants=ids.map((id,i)=>makePlant(id,4900+i,1+i*.4,2));assert.doesNotThrow(()=>validateDocument(doc));
});

test('striped squills and blue ground orchid retain their distinct organs and seasonal leaves',()=>{
 const ids=['p-a7106714e1f1','p-d4013ed52006','p-45bb27f13e66'];
 for(const id of ids)for(let month=1;month<=12;month++){
  const orchid=id===ids[2],g=plantModel(makePlant(id,4800,2,2),view(month)),has=k=>g.children.some(m=>m.userData.component===k);
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}
  if(month===1||!orchid&&month>=7)assert.equal(g.children.length,0,id);
  if(month===(orchid?5:4)){assert.ok(has(orchid?'lipLamella':'staminalCorona'));assert.ok(has(orchid?'column':'anther'));assert.ok(!has(orchid?'staminalCorona':'column'));}
  if(month===8&&orchid){assert.ok(has('leaf'));assert.ok(!has('lipLamella'));}
  if(month===5&&!orchid){assert.ok(has('leaf'));assert.ok(!has('staminalCorona'));}
  dispose(g);
 }
 for(const shape of ['puschkiniaStar','bletillaOrchid']){
  const ps=[];detailedFlower({add:(shape,kind)=>ps.push({shape,kind}),branch:(from,to,r,color,kind)=>ps.push({kind})},{x:0,y:0,z:0,shape,color:'#ddd'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
  if(shape==='puschkiniaStar'){assert.equal(ps.filter(p=>p.kind==='anther').length,6);assert.equal(ps.filter(p=>p.shape==='puschkiniaTepal').length,6);assert.equal(ps.filter(p=>p.kind==='staminalCorona').length,1);}
  else{assert.equal(ps.filter(p=>p.kind==='sepal').length,3);assert.equal(ps.filter(p=>p.kind==='petal').length,2);assert.equal(ps.filter(p=>p.kind==='lipLamella').length,90);assert.equal(ps.filter(p=>p.kind==='column').length,1);}
 }
});

test('alcea cultivars keep basal winter leaves, hairy blades and distinct double flower organs',()=>{
 const ids=['p-5aa887b5e439','p-e5751ffbccdf','p-a91ea7f5104d','p-45f5acc7be7a','p-8c6bdede5462','p-176020827f01','p-a71bf6087bae'];
 for(const id of ids)for(let month=1;month<=12;month++){
  const g=plantModel(makePlant(id,4701,2,2),view(month)),has=k=>g.children.some(m=>m.userData.component===k);
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}
  if(month===1){if(id===ids[6]){assert.ok(has('leaf-alcea-underside-b7bdaa'));assert.ok(!has('floweringStem'));}else assert.equal(g.children.length,0,id);}
  if(month===6){assert.ok(has('stellateHair'));assert.ok(has('stemHair'));assert.ok(has('calyx'));assert.ok(has('epicalyx'));assert.equal(has('staminalColumn'),id===ids[6]||id===ids[4]);}
  if(month===10)assert.ok(has('mericarp'));
  dispose(g);
 }
 const parts=layers=>{const out=[];detailedFlower({add:(shape,kind)=>out.push({shape,kind}),branch:(from,to,r,color,kind)=>out.push({kind})},{x:0,y:0,z:0,shape:'alceaRuffled',layers,color:'#dddddd'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return out;};
 for(const layers of [1,6]){const ps=parts(layers);assert.equal(ps.filter(x=>x.kind==='calyx').length,5);assert.equal(ps.filter(x=>x.kind==='epicalyx').length,7);assert.equal(ps.filter(x=>x.kind==='petal-alcea-veins').length,layers===1?5:50);assert.equal(ps.filter(x=>x.kind==='anther').length,layers===1?55:0);}
 const dark=plantModel(makePlant(ids[4],4701,2,2),view(6)),white=plantModel(makePlant(ids[4],4702,2,2),view(6));
 assert.ok(dark.children.some(m=>m.userData.component==='petal-alcea-ripple'));assert.ok(!white.children.some(m=>m.userData.component==='petal-alcea-ripple'));assert.ok(!white.children.some(m=>m.userData.component==='staminalColumn'));dispose(dark);dispose(white);
 assert.ok(CATALOG[ids[2]].height[1]<CATALOG[ids[0]].height[1]);
 const flowerY=month=>{const g=plantModel(makePlant(ids[0],4701,2,2),view(month)),p=g.children.find(m=>m.userData.component==='petal-alcea-veins'),ys=Array.from({length:p.count},(_,i)=>p.instanceMatrix.array[i*16+13]);dispose(g);return ys.reduce((a,b)=>a+b,0)/ys.length;};
 assert.ok(flowerY(9)>flowerY(6),'flowers progress up the stem');
 const winterPlant=makePlant(ids[6],4706,2,2);winterPlant.spread=.6;
 const rosette=plantModel(winterPlant,view(1)),blade=rosette.children.find(m=>m.userData.component==='leaf-alcea-underside-b7bdaa');blade.computeBoundingBox();
 assert.ok(blade.boundingBox.max.y>.055,'retained leaves sit above short lawn blades');
 assert.ok(blade.boundingBox.max.x-blade.boundingBox.min.x>.20,'winter leaves retain a mature basal blade size');dispose(rosette);
});

test('seven monocots separate fans, racemes, flower organs and leafless bulb phases',()=>{
 const ids=['p-2cd7939ef0a4','p-1a778ae3707d','p-627c04df8f36','p-f0c5907f4bfd','p-82befeb10f78','p-be8815c76ab6','p-8ab41e05ecf8'];
 for(const id of ids)for(let month=1;month<=12;month++){
  const g=plantModel(makePlant(id,4601,2,2),view(month)),has=k=>g.children.some(m=>m.userData.component===k);
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}
  if(month===1){if([ids[1],ids[3],ids[4],ids[5]].includes(id))assert.equal(g.children.length,0,id);else assert.ok(g.children.some(m=>m.userData.component.startsWith('leaf')),id);}
  if(id===ids[3]&&month===5){assert.ok(has('anther'));assert.ok(!g.children.some(m=>m.userData.component==='leaf'));assert.equal(seasonAt(CATALOG[id],5).groundDormant,false);}
  if(id===ids[3]&&month===7)assert.equal(g.children.length,0,id);
  if(id===ids[5]&&[6,7].includes(month))assert.equal(g.children.find(m=>m.userData.component==='floralScape').count,21,'all three seven-segment scapes stay connected as leaves die');
  if(id===ids[5]&&month===7){assert.ok(has('uprightCapsule'));assert.ok(!has('anther'));assert.ok(!has('leaf'));}
  if(id===ids[5]&&month===9)assert.equal(g.children.length,0,id);
  if(id===ids[6]&&month===6){assert.ok(has('stemWing'));assert.ok(has('scariousBract'));assert.ok(has('spentFlower'));}
  if(id===ids[2]&&month===6)assert.ok(has('bracteole'));
  dispose(g);
 }
 const parts=shape=>{const out=[];detailedFlower({add:(shape,kind)=>out.push({shape,kind}),branch:(from,to,r,color,kind)=>out.push({kind})},{x:0,y:0,z:0,shape,color:'#dddddd'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return out;};
 for(const shape of ['libertiaWhite','anthericumStar','tofieldiaStar','ornithogalumStar','rhodoxisStar','siculumBell','aristeaBlue']){
  const ps=parts(shape);assert.equal(ps.filter(x=>x.kind.startsWith('petal')).length,6,shape);assert.equal(ps.filter(x=>x.kind==='anther').length,['libertiaWhite','aristeaBlue'].includes(shape)?3:6,shape);
 }
 assert.equal(parts('libertiaWhite').filter(x=>x.shape==='libertiaInnerTepal').length,3);
 assert.equal(parts('tofieldiaStar').filter(x=>x.kind==='style').length,3);
 assert.equal(parts('ornithogalumStar').filter(x=>x.kind==='flattenedFilament').length,6);
 assert.notEqual(seasonAt(CATALOG[ids[0]],1).leafPatternColor,seasonAt(CATALOG[ids[0]],7).leafPatternColor);
 assert.ok(seasonAt(CATALOG[ids[2]],1).leafDensity>0);assert.equal(seasonAt(CATALOG[ids[4]],1).groundDormant,true);
});

test('seven low herbs distinguish hairy and succulent foliage, seasonal shoots and floral organs',()=>{
 const ids=['p-eb3e85895cf0','p-3ae4c4420803','p-1e2973ec88a8','p-6538675cf4cc','p-51ca617a418b','p-565b7daf5926','p-b4a7d7ba619b'];
 for(const id of ids)for(let month=1;month<=12;month++){
  const g=plantModel(makePlant(id,4501,2,2),view(month)),has=k=>g.children.some(m=>m.userData.component===k);
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}
  if(month===1){if([ids[1],ids[2],ids[4]].includes(id))assert.equal(g.children.length,0,id);else assert.ok(g.children.some(m=>m.userData.component.startsWith('leaf')),id);assert.ok(!has('flowerScape'));}
  if(month===6){
   assert.ok(has('petal'),id);
   if(id===ids[0]){assert.ok(has('stemHair'));assert.ok(has('leafHair'));}
   if(id===ids[2]){assert.ok(!has('leafHair'));assert.ok(g.children.some(m=>m.geometry.userData.mertensiaBell));}
   if(id===ids[5])assert.ok(has('woodyCreeper'));
   if(id===ids[6]){assert.ok(has('achene'));assert.ok(!has('stolon'));}
  }
  if(id===ids[1]&&month===9){assert.ok(has('vegetativeShoot'));assert.ok(!has('petal'));}
  if(id===ids[5]&&month===7){assert.ok(has('persistentStyle'));assert.ok(has('styleHair'));assert.ok(!has('petal'));}
  dispose(g);
 }
 const parts=shape=>{const out=[];detailedFlower({add:(shape,kind)=>out.push({shape,kind}),branch:(from,to,r,color,kind)=>out.push({kind})},{x:0,y:0,z:0,shape,color:'#dddddd'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return out;};
 const star=parts('stellariaSplit');assert.equal(star.filter(x=>x.kind==='petal').length,5);assert.equal(star.filter(x=>x.kind==='anther').length,10);assert.equal(star.filter(x=>x.kind==='style').length,3);
 assert.equal(parts('dryasEight').filter(x=>x.kind==='petal').length,8);assert.equal(parts('strawberryFive').filter(x=>x.kind==='anther').length,20);
 assert.notEqual(seasonAt(CATALOG[ids[6]],4).leafColor,seasonAt(CATALOG[ids[6]],7).leafColor);
});

test('six apiaceae entries retain compound leaves, taxon-specific umbels and seasonal variegation',()=>{
 const ids=['p-aef5861c9934','p-8ae8436e0447','p-3d77c4cf31de','p-014321ba95e1','p-875d4066c833','p-6750381fd202'];
 for(const id of ids)for(let month=1;month<=12;month++){
  const g=plantModel(makePlant(id,4401,2,2),view(month));
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}
  const has=k=>g.children.some(m=>m.userData.component===k);
  if(month===1){assert.ok(g.children.some(m=>m.userData.component.startsWith('leaf')),id);assert.ok(!has('umbelStem'));}
  if(month===6){
   assert.ok(has('umbelPedicel'));assert.ok(has('style'));
   if(id===ids[0]){assert.ok(!has('umbelRay'));assert.ok(has('leafHair'));}
   if(id===ids[1]||id===ids[5])assert.ok(has('stemRidge'));
   if(id===ids[2]){assert.ok(has('stolon'));assert.ok(g.children.some(m=>m.userData.component.startsWith('leaf-flamingoMargin')));}
   if(id===ids[3]){assert.ok(!has('involucre'));assert.ok(!has('involucel'));}
   if(id===ids[4]||id===ids[5])assert.ok(has('stemHair'));
  }
  dispose(g);
 }
 assert.notEqual(seasonAt(CATALOG[ids[2]],3).leafPatternColor,seasonAt(CATALOG[ids[2]],7).leafPatternColor);
 assert.equal(CATALOG[ids[0]].appearance.persistence,undefined);
 assert.equal(seasonAt(CATALOG[ids[5]],9).bloom,true);assert.equal(seasonAt(CATALOG[ids[5]],10).bloom,false);
 const parts=[];detailedFlower({add:(shape,kind,color,x,y,z,sx,sy)=>parts.push({shape,kind,sy}),branch:(from,to,r,color,kind)=>parts.push({kind})},{x:0,y:0,z:0,r:.002,shape:'apiaceaeFloret',palette:{outer:true},color:'#dddddd'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.equal(parts.filter(x=>x.kind==='petal').length,5);assert.equal(parts.filter(x=>x.kind==='anther').length,5);assert.equal(parts.filter(x=>x.kind==='style').length,2);assert.equal(parts.filter(x=>x.kind==='petal'&&x.sy>.002).length,3);
});

test('six bell-family plants distinguish flower organs, inflorescences and winter rosettes',()=>{
 const ids=['p-20b373fb3c17','p-2268ce28505f','p-90cc6dd478a9','p-b514c491182e','p-1637451f56c4','p-f7156a3cf3ed'];
 for(const id of ids)for(let month=1;month<=12;month++){
  const g=plantModel(makePlant(id,4301,2,2),view(month));
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}
  if(month===1){
   if(id===ids[1])assert.equal(g.children.length,0);else assert.ok(g.children.some(m=>m.userData.component.startsWith('leaf')),id);
   assert.ok(!g.children.some(m=>['floweringAxis','flowerScape','corymbPedicel'].includes(m.userData.component)),id);
  }
  if(month===6){
   if(id===ids[0])assert.ok(g.children.some(m=>m.geometry.userData.edraianthusBell));
   if(id===ids[1])assert.ok(g.children.some(m=>m.geometry.userData.phyteumaLobe));
   if(id===ids[2])assert.ok(g.children.some(m=>m.userData.component==='pollenHair'));
   if(id===ids[3])assert.ok(g.children.some(m=>m.userData.component==='connateAnther'));
   if(id===ids[4])assert.ok(g.children.some(m=>m.userData.component==='corymbPedicel'));
   if(id===ids[5]){assert.ok(g.children.some(m=>m.geometry.userData.wahlenbergiaBell));assert.ok(!g.children.some(m=>m.userData.component==='anther'));}
  }
  dispose(g);
 }
 const parts=shape=>{const out=[];detailedFlower({add:(shape,kind)=>out.push({shape,kind}),branch:(from,to,r,color,kind)=>out.push({kind})},{x:0,y:0,z:0,shape,color:'#dddddd'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return out;};
 const mich=parts('michauxiaReflexed');assert.equal(mich.filter(x=>x.shape==='michauxiaLobe').length,8);assert.equal(mich.filter(x=>x.kind==='stigma').length,8);assert.equal(mich.filter(x=>x.kind==='anther').length,8);
 assert.equal(parts('jasioneFloret').filter(x=>x.kind==='stigma').length,1);assert.equal(parts('jasioneFloret').filter(x=>x.kind==='connateAnther').length,5);
 assert.equal(parts('wahlenbergiaBell').filter(x=>x.kind==='stigma').length,3);
 assert.equal(CATALOG[ids[0]].appearance.persistence,undefined);assert.equal(CATALOG[ids[0]].latin,'Edraianthus sp.');
 for(const id of ids)assert.notEqual(CATALOG[id].appearance.flowerTiming,'months');
});

test('water margin plants distinguish peltate leaves, four fern leaflets and opposite bacopa foliage',()=>{
 const ids=['p-76c710fd7cde','p-d5909b1c35c5','p-ba247cf299e6','p-b4a83f923387','p-f8b68a8f740f'];
 for(const id of ids)for(let month=1;month<=12;month++){
  const p=makePlant(id,4201,2,2),g=plantModel(p,view(month));
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}
  if(month===1)assert.equal(g.children.length,0,id);
  if(month===7){
   const has=name=>g.children.some(m=>m.userData.component===name);
   if(id===ids[0]){assert.ok(g.children.some(m=>m.geometry.userData.waterCoinShield));assert.ok(has('flowerScape'));}
   if(id===ids[1]){const leaves=g.children.find(m=>m.geometry.userData.marsileaWedge);assert.equal(leaves.count%4,0);assert.ok(!has('anther'));assert.equal(seasonAt(CATALOG[id],month).bloom,false);}
   if(id===ids[2]||id===ids[3]){assert.ok(has('stemHair'));assert.ok(has('petal-bacopa'));assert.ok(g.children.some(m=>m.geometry.userData.bacopaCorolla));}
   if(id===ids[3])assert.ok(has('leaf-bacopa-veins'));
   if(id===ids[4]){assert.ok(g.children.some(m=>m.geometry.userData.bacopaSpoon));assert.ok(!has('stemHair'));assert.ok(!has('petal-bacopa'));assert.equal(seasonAt(CATALOG[id],month).known,false);}
  }
  dispose(g);
 }
 assert.match(seasonAt(CATALOG[ids[0]],1).label,/沈水.*管理例/);
 const parts=[],b={add:(shape,kind)=>parts.push({shape,kind}),branch(){}};
 detailedFlower(b,{x:0,y:0,z:0,r:.005,color:'#ddddee',shape:'bacopaCorolla'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.equal(parts.filter(p=>p.kind==='anther').length,4);assert.equal(parts.filter(p=>p.kind==='sepal').length,5);assert.equal(parts.filter(p=>p.kind==='stigma').length,2);
});

test('35 rosette and mat entries retain distinct flower structures and winter foliage',()=>{
 const arches=['primroseRosette','gerberaRosette','brunneraSprays','tapienMat','stolonPhlox'];
 const entries=Object.entries(CATALOG).filter(([,p])=>arches.includes(p.appearance?.architecture));assert.equal(entries.length,35);
 for(const [id,info] of entries)for(let month=1;month<=12;month++){
  const p=makePlant(id,3501,2,2),g=plantModel(p,view(month));
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}
  if(month===1){if(info.appearance.architecture==='brunneraSprays'||id==='p-1cfdd4f3b3ef')assert.equal(g.children.length,0,id);else assert.ok(g.children.some(m=>m.userData.component.startsWith('leaf')),id);}
  if(month===8&&info.appearance.architecture==='stolonPhlox')assert.ok(!g.children.some(m=>m.userData.component==='flowerStem'));
  dispose(g);
 }
 assert.equal(CATALOG['p-d251546513d8'].appearance.leafPattern,undefined);
 assert.equal(CATALOG['p-eeddf45705e0'].appearance.leafPattern,undefined);
 assert.equal(seasonAt(CATALOG['p-8457f2663992'],12).bloom,true);
 assert.equal(seasonAt(CATALOG['p-8aec06913708'],4).bloom,false);
 const parts=[];detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch(){}},{x:0,y:0,z:0,color:'#eee',shape:'gerberaHead',layers:4,palette:{disc:'#333333'}},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.equal(parts.filter(p=>p.shape==='gerberaRay').length,128);assert.equal(parts.filter(p=>p.kind==='discFloret').length,180);
});

test('seed assortments preserve their source names and refer to separate botanically distinct plants',()=>{
 const ids=['p-99d0794b6b0d','p-4fa517f083d1'],pack=CATALOG['p-ab9110a04a6f'];
 assert.deepEqual(pack.appearance.components,ids);assert.equal(pack.form,'unmodeled');
 assert.equal(CATALOG[ids[1]].height[1],1.2);assert.equal(CATALOG[ids[0]].height,null);
 for(const [id,a] of Object.entries(APPEARANCE_DATA))if(a.components){assert.equal(a.collection,'assortment');assert.equal(new Set(a.components).size,a.components.length);for(const child of a.components){assert.ok(CATALOG[child],id);assert.ok(!CATALOG[child].appearance.collection);}}
 for(const id of ids)for(let month=1;month<=12;month++){
  const g=plantModel(makePlant(id,3401,2,2),view(month));for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}if([1,2,12].includes(month))assert.equal(g.children.length,0);dispose(g);
 }
 const sunflower=plantModel(makePlant(ids[1],3402,2,2),view(8)),morning=plantModel(makePlant(ids[0],3403,2,2),view(8));
 assert.ok(sunflower.children.some(m=>m.geometry.userData.sunflowerLeaf));assert.ok(sunflower.children.some(m=>m.userData.component==='discFloret'));assert.ok(!sunflower.children.some(m=>m.userData.component==='support'));
 assert.ok(morning.children.some(m=>m.userData.component==='support'));assert.ok(morning.children.some(m=>m.userData.component.startsWith('leaf-morningMottle')));assert.ok(!morning.children.some(m=>m.userData.component==='discFloret'));
 dispose(sunflower);dispose(morning);
 for(const id of ['p-d7e7ca9d053b','p-3dcbda4e401f','p-39a474e5a3fd']){assert.equal(CATALOG[id].appearance.collection,'seedMixture');assert.deepEqual(CATALOG[id].bloom,[]);assert.equal(CATALOG[id].form,'unmodeled');}
});

test('garden annuals and corrected perennials retain their organ structures and winter life cycles',()=>{
 const ids=['p-2a5b37983b21','p-5d75f1ae4997','p-a354a22e1dd7','p-b256aaf37c02','p-db707ffc5146','p-fb7a9affec35','p-54918635b6af','p-2cf364e777f9','p-96949665479a','p-3658ef87557a','p-9462b1b1a60a','p-a82b1a9b31fc','p-005ed6f28b42','p-44a6bfe3331b'];
 for(const id of ids)for(let month=1;month<=12;month++){
  const g=plantModel(makePlant(id,3301,2,2),view(month));for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);
 }
 const parts=(shape,extra={})=>{const out=[];detailedFlower({add:(shape,kind,color)=>out.push({shape,kind,color}),branch:(from,to,r,color,kind)=>out.push({kind})},{x:0,y:0,z:0,color:'#c4a7c9',shape,...extra},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return out;};
 const oen=parts('oenotheraCup');assert.equal(oen.filter(x=>x.kind==='petal-oenothera-veins').length,4);assert.equal(oen.filter(x=>x.kind==='anther').length,8);assert.equal(oen.filter(x=>x.kind==='stigma').length,4);
 assert.equal(parts('delphiniumBee',{layers:2}).filter(x=>x.kind==='spur').length,1);
 assert.equal(parts('hollyhockCup').filter(x=>x.kind==='staminalColumn').length,1);assert.equal(parts('hollyhockCup',{layers:5}).filter(x=>x.kind==='staminalColumn').length,0);
 assert.equal(parts('scabiosaHead').filter(x=>x.kind==='anther').length,72*4);
 assert.ok(parts('portulacaDouble',{layers:6,palette:{mermaid:true}}).some(x=>x.kind==='petal-portulaca-mermaid'));
 for(const id of ['p-fb7a9affec35','p-3658ef87557a','p-9462b1b1a60a'])assert.equal(CATALOG[id].life,'perennial');
 const shasta=plantModel(makePlant('p-fb7a9affec35',3302,2,2),view(1));assert.ok(shasta.children.some(x=>x.geometry.userData.shastaLeaf));assert.ok(!shasta.children.some(x=>x.userData.component==='stem'||x.userData.component==='discFloret'));dispose(shasta);
 assert.equal(plantModel(makePlant('p-3658ef87557a',3303,2,2),view(1)).children.length,0);
 const cream=plantModel(makePlant('p-9462b1b1a60a',3304,2,2),view(1));assert.ok(cream.children.some(x=>x.userData.component==='seedBristle'));assert.ok(!cream.children.some(x=>x.userData.component==='bristle'));dispose(cream);
 const flash=plantModel(makePlant('p-a82b1a9b31fc',3305,2,2),view(9));assert.ok(flash.children.some(x=>x.userData.component.startsWith('leaf-purpleFlash')));assert.ok(!flash.children.some(x=>x.geometry.userData.pepperFruit));dispose(flash);
 const pink=makePlant('p-44a6bfe3331b',3306,2,2);pink.start=4;assert.equal(stateAt(pink,view(12)).bloom,true);assert.equal(stateAt(pink,{...view(1),year:1}).groundDormant,true);
});

test('ornamental fruit, winter kale and small annuals keep distinct organs and dated annual endings',()=>{
 const ids=['p-2673b7ee5407','p-555eb9d2ee8c','p-3a3c359bb429','p-ce7e61872af9','p-890749606b69','p-aa558d9c279e','p-dcde9009b020','p-ca95e20664c7','p-8561b3e74ece'];
 for(const id of ids)for(let month=1;month<=12;month++){
  const g=plantModel(makePlant(id,3201,2,2),view(month));for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);
 }
 const fox=makePlant(ids[0],3201,2,2),summer=plantModel(fox,view(8)),autumn=plantModel(fox,view(10));
 assert.ok(!summer.children.some(m=>m.userData.component==='fruit-glossy'));assert.ok(autumn.children.some(m=>m.userData.component==='fruit-glossy'));assert.ok(!autumn.children.some(m=>/thorn|prickle/.test(m.userData.component)));assert.equal(stateAt(fox,view(10)).bloom,false);dispose(summer);dispose(autumn);
 const kale=makePlant(ids[1],3202,2,2),winter=plantModel(kale,view(1));
 assert.ok(winter.children.some(m=>m.userData.component==='leaf-glossy'));assert.equal(stateAt(kale,view(1)).kaleBolting,0);assert.equal(stateAt(kale,view(4)).kaleBolting,1);assert.equal(stateAt(kale,{...view(1),year:1}).kaleBolting,1);dispose(winter);
 const pepper=makePlant(ids[2],3203,2,2);pepper.start=4;
 assert.equal(stateAt(pepper,view(12)).bloom,true);assert.equal(stateAt(pepper,{...view(1),year:1}).groundDormant,true);
 assert.equal(plantModel(makePlant(ids[5],3205,2,2),view(8)).children.length,0);
 assert.equal(plantModel(makePlant(ids[6],3206,2,2),view(8)).children.length,0);
 for(const [shape,anthers] of [['solanumStar',5],['pinkSageLips',4],['mesembFlower',56]]){
  const out=[];detailedFlower({add:(shape,kind)=>out.push({shape,kind}),branch(){}},{x:0,y:0,z:0,color:'#b579a3',shape},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});assert.equal(out.filter(p=>p.kind==='anther').length,anthers,shape);
 }
 const clover=CATALOG[ids[5]].appearance;assert.equal(clover.leaflets,3);assert.equal(clover.inflorescenceLength,.05);
 assert.equal(CATALOG[ids[6]].appearance.leafTexture,'bladderCells');
 const pink=makePlant(ids[8],3209,2,2);pink.start=4;assert.equal(stateAt(pink,view(12)).bloom,true);
});

test('nasturtiums, morning glories and snapdragons preserve connected flower structures and annual planting cycles',()=>{
 const ids=['p-a0032b10b5dd','p-f0cc4f8c54d2','p-fca9b8064485','p-c87242eb7237','p-69b32ed7ceb6','p-fad2544ebf9b','p-6cfb0fb6d32e','p-bf6d05b25251'];
 for(const id of ids)for(let month=1;month<=12;month++){
  const g=plantModel(makePlant(id,3101,2,2),view(month));for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);
 }
 const components=(shape,extras={})=>{const out=[];detailedFlower({add:(shape,kind,color)=>out.push({shape,kind,color}),branch(){}},{x:0,y:0,z:0,color:'#eeeeee',shape,...extras},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return out;};
 const nast=components('nasturtiumFlower',{palette:{orchid:true}});assert.equal(nast.filter(p=>p.shape==='nasturtiumPetal').length,5);assert.equal(nast.filter(p=>p.kind==='spur').length,1);assert.equal(nast.filter(p=>p.kind==='anther').length,8);
 assert.equal(components('nasturtiumFlower',{layers:3}).filter(p=>p.shape==='nasturtiumPetal').length,15);
 assert.ok(components('morningGloryFunnel',{palette:{star:true}}).some(p=>p.shape==='morningGloryStar'));assert.ok(components('morningGloryFunnel',{palette:{picotee:true}}).some(p=>p.kind==='petal-morning-picotee'));
 const corn=components('corncockleFlower');assert.equal(corn.filter(p=>p.kind==='petal-corncockle').length,5);assert.equal(corn.filter(p=>p.kind==='sepal').length,5);
 const snap=components('snapdragonLips',{palette:CATALOG['p-6cfb0fb6d32e'].appearance.flowerPalette});assert.ok(snap.some(p=>p.shape==='trumpet'&&p.color==='#e9e5cc'));assert.equal(snap.filter(p=>p.kind==='palate').length,1);
 for(const id of ['p-c87242eb7237','p-69b32ed7ceb6']){const p=makePlant(id,3102,2,2),summer=plantModel(p,view(8));assert.ok(summer.children.some(m=>m.userData.component==='support'));assert.ok(summer.children.some(m=>m.userData.component==='vine'));assert.equal(plantModel(p,view(12)).children.length,0);dispose(summer);}
 const candy=makePlant('p-bf6d05b25251',3103,2,2);candy.start=9;
 assert.ok(stateAt(candy,view(11)).bloom);assert.ok(!stateAt(candy,{...view(1),year:1}).groundDormant);assert.equal(stateAt(candy,{...view(7),year:1}).groundDormant,true);
});

test('spring annuals keep species flower structure and never become new autumn seedlings; perennial alyssums keep foliage',()=>{
 const annual=['p-409548bac9d3','p-411631280d5a','p-720a489d48f3','p-8a7dd8045e6b','p-1a0a1c3e9648','p-a5a729ddcef7','p-15e083e6747c','p-336e559a86c5','p-b6f60d3de0cb','p-04ac064d8f8a'],perennial=['p-a140132da4f5','p-ca0c6cc7eae8'];
 for(const id of [...annual,...perennial])for(let month=1;month<=12;month++){
  const p=makePlant(id,3001,2,2),g=plantModel(p,view(month));
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);
  if(annual.includes(id)&&month>CATALOG[id].appearance.flowerMonths.at(-1))assert.equal(stateAt(p,view(month)).groundDormant,true,id);
 }
 const components=(shape,extras={})=>{const out=[];detailedFlower({add:(shape,kind,color)=>out.push({shape,kind,color}),branch(){}},{x:0,y:0,z:0,color:'#eeeeee',shape,...extras},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return out;};
 const spots=components('nemophilaCup',{palette:{fiveSpots:true}});assert.equal(spots.filter(p=>p.shape==='nemophilaCup'&&p.kind==='petal-nemophila-spots').length,1);assert.equal(spots.filter(p=>p.kind==='anther').length,5);
 assert.equal(components('californiaPoppyCup').filter(p=>p.shape==='poppyCup').length,4);assert.equal(components('californiaPoppyCup',{layers:3,palette:{frill:true}}).filter(p=>p.shape==='poppyFrill').length,12);
 assert.equal(components('alyssumCross').filter(p=>p.kind==='petal').length,4);assert.equal(components('alyssumCross').filter(p=>p.kind==='anther').length,6);
 assert.ok(components('calendulaHead',{palette:CATALOG['p-8a7dd8045e6b'].appearance.flowerPalette}).some(p=>p.kind.startsWith('petal-tip-')));
 const perennialPlant=makePlant('p-a140132da4f5',3002,2,2),summer=plantModel(perennialPlant,view(8)),winter=plantModel(perennialPlant,view(1));
 assert.ok(summer.children.some(m=>m.userData.component==='leaf-margin-728b77'));assert.ok(winter.children.some(m=>m.userData.component==='leaf-margin-dddeda'));assert.ok(seasonAt(CATALOG[perennialPlant.kind],8).flowerDensity<seasonAt(CATALOG[perennialPlant.kind],4).flowerDensity);dispose(summer);dispose(winter);
 const gold=plantModel(makePlant('p-ca0c6cc7eae8',3003,2,2),view(1));assert.ok(gold.children.some(m=>m.geometry.userData.auriniaLeaf));assert.ok(!gold.children.some(m=>m.userData.component==='petal'));dispose(gold);
});

test('Senetti flowers through winter and does not reappear after summer; Nesia flower lips retain cultivar colours',()=>{
 const senetti=['p-5fd79f9fdf8e','p-ba620150858c','p-028d369d213e','p-90e3e0ad25b4'],nesia=['p-58a3abf41afa','p-48919842c3e7','p-68dbd4a9f4d3','p-820aba07d3b0'];
 for(const id of [...senetti,...nesia])for(const month of [1,4,7,10]){const g=plantModel(makePlant(id,2900,2,2),view(month));for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);}
 for(const id of senetti){
  const p=makePlant(id,2901,2,2),winter=plantModel(p,view(1));assert.ok(winter.children.some(m=>m.userData.component==='discFloret'));assert.ok(winter.children.some(m=>m.geometry.userData.pericallisLeaf));dispose(winter);
  for(const month of [7,10,11])assert.equal(plantModel(p,view(month)).children.length,0);
  const autumn={...p,start:9};assert.equal(stateAt(autumn,{...view(1),year:1}).bloom,true);assert.equal(stateAt(autumn,{...view(7),year:1}).groundDormant,true);
 }
 const parts=(shape,palette)=>{const out=[];detailedFlower({add:(shape,kind,color)=>out.push({shape,kind,color}),branch(){}},{x:0,y:0,z:0,shape,palette,color:'#eee'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return out;};
 const flower=parts('nemesiaLips',CATALOG['p-68dbd4a9f4d3'].appearance.flowerPalette);assert.equal(flower.filter(v=>v.shape==='petal'&&v.color==='#bb97ba').length,4);assert.equal(flower.filter(v=>v.shape==='petal'&&v.color==='#ebd17e').length,2);assert.equal(flower.filter(v=>v.kind==='palate').length,1);assert.equal(flower.filter(v=>v.kind==='spur').length,1);
 for(const id of nesia){assert.equal(CATALOG[id].appearance.persistence,undefined);assert.equal(CATALOG[id].leaf,'unknown');assert.equal(seasonAt(CATALOG[id],7).bloom,false);assert.equal(seasonAt(CATALOG[id],4).bloom,true);}
});

test('sedges, Hakone grass, pampas and dichondra preserve distinct blades and winter structures',()=>{
 const ids=['p-c19433cc1905','p-2f94b58411e5','p-b519b598a40b','p-451586f34e64','p-4df4fbfb85eb','p-2a0099e60c2c','p-394d2af5ae3b','p-b93961d8d984','p-783d34d03aa4','p-4a49787ed844','p-a762731bea9d'];
 for(const id of ids)for(const month of [1,4,7,10]){
  const g=plantModel(makePlant(id,2810+ids.indexOf(id),2,2),view(month));
  assert.ok(g.children.some(m=>m.userData.component?.startsWith('leaf')),id);
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);
 }
 for(const [id,pattern] of [['p-c19433cc1905','center'],['p-b519b598a40b','margin']]){const g=plantModel(makePlant(id,2825,2,2),view(1));assert.ok(g.children.some(m=>m.userData.component.startsWith('leaf-grass-'+pattern)));dispose(g);}
 const hakone=makePlant('p-451586f34e64',2826,2,2);
 for(const [month,red] of [[5,true],[6,true],[8,false],[10,true],[1,false]]){const g=plantModel(hakone,view(month));assert.equal(g.children.some(m=>m.userData.component.startsWith('leaf-grass-tip')),red);assert.ok(g.children.some(m=>m.geometry.userData.hakoneBlade));dispose(g);}
 const pampas=makePlant('p-4df4fbfb85eb',2827,2,2);
 for(const [month,flowers,seeds] of [[5,false,false],[9,true,false],[1,false,true]]){const g=plantModel(pampas,view(month));assert.equal(g.children.some(m=>m.userData.component==='sepal-pampas-fiber'),flowers);assert.equal(g.children.some(m=>m.userData.component==='seed-pampas-fiber'),seeds);dispose(g);}
 const mat=plantModel(makePlant('p-2a0099e60c2c',2828,2,2),view(7));assert.ok(mat.children.some(m=>m.geometry.userData.dichondraLeaf));assert.ok(mat.children.some(m=>m.userData.component==='root'));assert.ok(!mat.children.some(m=>m.userData.component==='wood'));dispose(mat);
 assert.deepEqual(APPEARANCE_DATA['p-783d34d03aa4'],APPEARANCE_DATA['p-c19433cc1905']);assert.deepEqual(APPEARANCE_DATA['p-451586f34e64'],APPEARANCE_DATA['p-4a49787ed844']);
});

test('hellebore flower types keep patterns off leaves and vesicarius has autumn shoots and summer rest',()=>{
 const ids=['p-47f8307e2da1','p-ce328c0baac2','p-a4acefdeecae','p-ec134103e1cc','p-54562b0a4538','p-7a9dfcd0a936','p-c7f6647f8fbc','p-c6eaaebd38ce','p-da7cb23c3a1a','p-a71227f04232','p-564520aef9bf','p-75b9c60305a8','p-a11d308ee0ef'];
 for(const id of ids){
  const p=makePlant(id,641,2,2);
  for(let month=1;month<=12;month++){const g=plantModel(p,view(month));for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);}
 }
 const v=makePlant('p-7a9dfcd0a936',642,2,2);
 for(const month of [7,8,9])assert.equal(plantModel(v,view(month)).children.length,0);
 const leafCount=m=>{const g=plantModel(v,view(m)),n=g.children.filter(m=>m.userData.component.startsWith('leaf')).reduce((n,m)=>n+m.count,0);dispose(g);return n;};
 assert.ok(leafCount(1)>leafCount(10));assert.ok(leafCount(10)>0);assert.ok(seasonAt(CATALOG[v.kind],10).leafScale<.6);
 for(const id of ['p-f4cad868cb84','p-951f12b04685','p-f8e59da460c6','p-daf462f19a50','p-d7c1a8e07e96','p-2a5f159d1ccd','p-5d965d48109c','p-20e7c262ad67']){
  assert.equal(CATALOG[id].appearance.leafPattern,undefined);const g=plantModel(makePlant(id,643,2,2),view(3));assert.ok(!g.children.some(m=>/^leaf-(spots|center|stripes)/.test(m.userData.component)));dispose(g);
 }
 const parts=(layers,palette={})=>{const out=[];detailedFlower({add:(shape,kind)=>out.push({shape,kind}),branch:()=>{}},{x:0,y:0,z:0,shape:'helleboreCup',layers,palette,color:'#ddd'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return out;};
 const double=parts(3),semi=parts(1,{semiDouble:true});assert.equal(double.filter(p=>p.kind==='nectary').length,0);assert.equal(double.filter(p=>p.kind==='sepal').length,25);assert.equal(semi.filter(p=>p.kind==='nectary'&&p.shape==='helleboreFrill').length,10);
 assert.ok(parts(3,{sword:true}).some(p=>p.shape==='helleboreSword'));
});

test('hellebore profiles separate winter flowers from spring leaf growth and preserve evergreen leaves',()=>{
 const deciduous=['p-793b0a4cae4a','p-423146713075','p-8ca3ba776116','p-30ee1c6dbf0c'],evergreen=['p-acae07fc1fe8','p-43c33a152eb1','p-7fcba962f645','p-6d405bb73d21'];
 for(const id of [...deciduous,...evergreen,'p-da7116e429d5']){
  const p=makePlant(id,631,2,2);p.height=CATALOG[id].height[1];
  for(let month=1;month<=12;month++){const g=plantModel(p,view(month));for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);}
  if(deciduous.includes(id)){assert.equal(plantModel(p,view(12)).children.length,0,id);assert.equal(seasonAt(CATALOG[id],2).shootScale,1);}
  if(evergreen.includes(id)){const g=plantModel(p,view(1));assert.ok(g.children.some(m=>m.userData.component.startsWith('leaf')),id);dispose(g);}
 }
 for(const id of ['p-793b0a4cae4a','p-423146713075','p-30ee1c6dbf0c']){const g=plantModel(makePlant(id,632,2,2),view(1));assert.ok(g.children.some(m=>m.userData.component==='anther'));assert.ok(!g.children.some(m=>m.userData.component.startsWith('leaf')));dispose(g);}
 const vine=makePlant('p-da7116e429d5',633,2,2),winter=plantModel(vine,view(1)),summer=plantModel(vine,view(6));
 const stems=g=>g.children.filter(m=>m.userData.component==='vine').map(m=>[...m.instanceMatrix.array]);assert.deepEqual(stems(winter),stems(summer));assert.ok(stems(winter).length);assert.ok(!winter.children.some(m=>m.userData.component.startsWith('leaf')));assert.ok(summer.children.some(m=>m.userData.component==='sepal-clematis-green'));dispose(winter);dispose(summer);
 const parts=shape=>{const out=[];detailedFlower({add:(shape,kind)=>out.push({shape,kind}),branch:(a,b,r,c,kind)=>out.push({kind})},{x:0,y:0,z:0,shape,color:'#ddd'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return out;};
 for(const shape of ['helleboreCup','helleboreBell']){const p=parts(shape);assert.equal(p.filter(p=>p.kind==='sepal').length,5);assert.equal(p.filter(p=>p.kind==='nectary').length,10);assert.equal(p.filter(p=>p.kind==='anther').length,48);}
 assert.equal(parts('tessenFlower').filter(p=>p.kind==='sepal-clematis-green').length,6);
});

test('early crocus and species tulips preserve distinct leaves, flowering windows and summer rest',()=>{
 for(const [id,leaf,flowerMonth] of [['p-5a34fd922abd','crocusLinear',2],['p-57395457be8b','saraLeaf',4],['p-a03e1d959c29','speciesTulipLeaf',3],['p-db2eceb588df','speciesTulipLeaf',4]]){
  const p=makePlant(id,621,2,2);p.height=CATALOG[id].height[1];
  assert.equal(plantModel(p,view(8)).children.length,0,id);assert.equal(plantModel(p,view(12)).children.length,0,id);
  assert.equal(seasonAt(CATALOG[id],flowerMonth).bloom,true,id);assert.equal(seasonAt(CATALOG[id],5).bloom,false,id);
  const after=plantModel(p,view(5));assert.ok(after.children.some(m=>m.geometry.userData[leaf]),id);dispose(after);
  for(let month=1;month<=12;month++){const g=plantModel(p,view(month));for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);}
 }
 assert.equal(seasonAt(CATALOG['p-57395457be8b'],2).bloom,false);
 const parts=shape=>{const out=[];detailedFlower({add:(shape,kind)=>out.push({shape,kind}),branch:(a,b,r,c,kind)=>out.push({kind})},{x:0,y:0,z:0,shape,color:'#ddd',palette:{pattern:'clusiana'}},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return out;};
 const crocus=parts('earlyCrocusFlower'),tulip=parts('speciesTulipFlower');
 assert.equal(crocus.filter(p=>p.kind==='anther').length,3);assert.equal(tulip.filter(p=>p.kind==='anther').length,6);
 assert.equal(crocus.filter(p=>p.kind==='stigma').length,3);assert.equal(tulip.filter(p=>p.kind==='ovary').length,1);
 assert.equal(tulip.filter(p=>p.kind==='petal-bulb-clusiana-outer-white').length,3);
});

test('lilies keep post-bloom stems and leaves, disappear in winter and distinguish regional flowering',()=>{
 const ids=['p-392c5c138700','p-94f40439ccf6','p-f9c4c1d9516c','p-93b32f544b95','p-7dee70379f12','p-02278595e2b4','p-4fd5c4cf997f','p-766ad87ba1b2','p-eb357ca3a902','p-f51b46ab9078','p-e1e2a401d139','p-0f9140ebfaaa','p-e60d3f1b54fd'];
 for(const id of ids){
  const p=makePlant(id,611,2,2);assert.equal(plantModel(p,view(1)).children.length,0,id);
  const after=plantModel(p,view(9));assert.ok(after.children.some(m=>m.geometry.userData.liliumLeaf),id);assert.ok(!after.children.some(m=>m.userData.component.startsWith('petal-lilium')),id);dispose(after);
  for(let month=1;month<=12;month++){const g=plantModel(p,view(month));for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);}
 }
 assert.equal(seasonAt(CATALOG['p-f9c4c1d9516c'],6).bloom,true);assert.equal(seasonAt(CATALOG['p-f9c4c1d9516c'],8).bloom,false);
 assert.equal(seasonAt(CATALOG['p-766ad87ba1b2'],6).bloom,false);assert.equal(seasonAt(CATALOG['p-766ad87ba1b2'],8).bloom,true);
 assert.equal(seasonAt(CATALOG['p-eb357ca3a902'],8).bloom,false);
});
test('lilium tepals and six stamens follow upward, outward and downward flower axes',()=>{
 for(const [id,tepal,direction] of [['p-94f40439ccf6','liliumTepal',1],['p-f9c4c1d9516c','liliumTrumpet',0],['p-4fd5c4cf997f','liliumFunnel',-1],['p-0f9140ebfaaa','liliumReflex',-1]]){
  const parts=[],a=CATALOG[id].appearance;detailedFlower({add:(shape,kind,color,x,y,z)=>parts.push({shape,kind,x,y,z}),branch(){}},{x:0,y:0,z:0,r:a.flowerRadius,color:'#eee',shape:'liliumFlower',palette:a.flowerPalette,tilt:a.flowerPalette.tilt},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
  assert.equal(parts.filter(p=>p.shape===tepal).length,6);const stamens=parts.filter(p=>p.kind==='anther');assert.equal(stamens.length,6);
  const center=stamens.reduce((n,p)=>n+p.y,0)/6;
  if(direction)assert.equal(Math.sign(center),direction);else assert.ok(Math.abs(center)<a.flowerRadius*.06);
 }
 const leaves=id=>{const out=[],info=CATALOG[id],p=makePlant(id,612,2,2),s=stateAt(p,view(6));drawDetailedHerb({add:(shape,kind,color,x,y,z)=>{if(shape==='liliumLeaf')out.push({y});},branch(){}},{info,p,s,detail:1,rand:()=>.5},{bud:'bud',shade:(_,c)=>c});return out;};
 const whorled=leaves('p-e1e2a401d139'),alternate=leaves('p-392c5c138700');assert.ok(whorled.filter(p=>p.y===whorled[0].y).length>=6);assert.equal(alternate.filter(p=>p.y===alternate[0].y).length,1);
});

test('spring racemes retain post-flowering foliage and rest in summer without winter flowers',()=>{
 const ids=['p-0ee7dee3eb63','p-8b533b243e51','p-5f4e8f2b98cd','p-a1cc3b916321','p-22edb96199c8','p-89a52aa63fc6','p-292e2b8d70b9','p-78167af46f86','p-de59451c1ae6','p-21250dff15b3','p-1b6da361575a','p-718a3437316d','p-e19de18723c1'];
 for(const id of ids){
  const p=makePlant(id,601,2,2);assert.equal(plantModel(p,view(8)).children.length,0,id);assert.equal(seasonAt(CATALOG[id],1).bloom,false,id);assert.ok(seasonAt(CATALOG[id],5).leafDensity>0,id);
  for(let month=1;month<=12;month++){const g=plantModel(p,view(month));for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);}
 }
 assert.equal(seasonAt(CATALOG['p-0ee7dee3eb63'],3).bloom,false);assert.equal(seasonAt(CATALOG['p-5f4e8f2b98cd'],11).groundDormant,false);
});
test('urns, reflexed hyacinth tepals and one-sided freesia sprays are anatomically distinct',()=>{
 const collect=(shape,palette={})=>{const parts=[];detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch(){}},{x:0,y:0,z:0,r:.02,color:'#ddd',shape,palette},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return parts;};
 const muscari=collect('muscariUrn'),hyacinth=collect('hyacinthFlower'),freesia=collect('freesiaFlower'),double=collect('freesiaFlower',{style:'double',throat:'#ddccaa'});
 assert.equal(muscari.filter(p=>p.shape==='muscariUrn').length,1);assert.equal(hyacinth.filter(p=>p.shape==='hyacinthReflex').length,6);assert.equal(freesia.filter(p=>p.shape==='freesiaLobe').length,6);assert.equal(double.filter(p=>p.shape==='freesiaLobe').length,12);assert.equal(freesia.filter(p=>p.kind==='anther').length,3);
 for(const [id,shape] of [['p-0ee7dee3eb63','muscariUrn'],['p-89a52aa63fc6','hyacinthReflex'],['p-718a3437316d','freesiaLobe']]){const g=plantModel(makePlant(id,602,2,2),view(4));assert.ok(g.children.some(m=>m.geometry.userData[shape]));dispose(g);}
 assert.equal(CATALOG['p-22edb96199c8'].appearance.flowerPalette.tip,'#eeeade');assert.ok(CATALOG['p-0ee7dee3eb63'].aliases.includes('ムスカリ ジェニーロビンソン'));
});

test('irises distinguish bulb summer rest, evergreen fans and standing winter seed capsules',()=>{
 const minis=['p-83455ccfe550','p-e07c146d9e20','p-5ab42afe5e28','p-5b3272352a33'];
 for(const id of [...minis,'p-275ac3f1523d'])assert.equal(plantModel(makePlant(id,591,2,2),view(8)).children.length,0,id);
 assert.equal(seasonAt(CATALOG['p-5b3272352a33'],2).bloom,true);assert.equal(seasonAt(CATALOG['p-5b3272352a33'],5).bloom,false);
 for(const id of ['p-484a855549fa','p-aabbf0fdf849']){const g=plantModel(makePlant(id,592,2,2),view(1));assert.ok(g.children.some(m=>m.geometry.userData.irisSword));dispose(g);}
 const p=makePlant('p-dc11862bb284',593,2,2),summer=plantModel(p,view(7)),winter=plantModel(p,view(1));
 const scape=g=>g.children.filter(m=>m.userData.component==='scape').map(m=>[...m.instanceMatrix.array]);assert.deepEqual(scape(summer),scape(winter));
 assert.ok(winter.children.some(m=>m.userData.component==='capsule'));assert.ok(winter.children.some(m=>m.userData.component==='seed'));assert.ok(!winter.children.some(m=>m.userData.component.startsWith('petal')));dispose(summer);dispose(winter);
 for(const id of [...minis,'p-275ac3f1523d','p-484a855549fa','p-aabbf0fdf849','p-dc11862bb284'])for(let month=1;month<=12;month++){
  const g=plantModel(makePlant(id,594,2,2),view(month));for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}dispose(g);
 }
});
test('iris flowers separate three falls, three standards, three styles and beards',()=>{
 for(const id of ['p-83455ccfe550','p-e07c146d9e20','p-5ab42afe5e28','p-5b3272352a33','p-275ac3f1523d','p-484a855549fa','p-aabbf0fdf849','p-dc11862bb284']){
  const a=CATALOG[id].appearance,parts=[];detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch(){}},{x:0,y:0,z:0,r:a.flowerRadius,color:CATALOG[id].flower,shape:a.flowerShape,palette:a.flowerPalette},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
  const hio=id==='p-dc11862bb284';assert.equal(parts.filter(p=>p.kind.endsWith('-fall')).length,hio?6:3);assert.equal(parts.filter(p=>p.kind.endsWith('-standard')).length,hio?0:3);assert.equal(parts.filter(p=>p.kind==='petaloidStyle').length,hio?0:3);assert.equal(parts.filter(p=>p.kind==='anther').length,3);
  assert.equal(parts.some(p=>p.kind==='beardTip'),id==='p-aabbf0fdf849');
 }
});

test('narcissus bulbs distinguish winter foliage, winter flowers and summer dormancy',()=>{
 const paper=CATALOG['p-b2237cff2e6a'],golden=CATALOG['p-05ede9b738cf'],thalia=CATALOG['p-461a3f1117fe'];
 assert.equal(seasonAt(paper,1).bloom,true);assert.equal(seasonAt(golden,1).bloom,false);assert.equal(seasonAt(golden,11).groundDormant,false);assert.equal(seasonAt(thalia,1).groundDormant,false);
 for(const id of ['p-b2237cff2e6a','p-05ede9b738cf','p-461a3f1117fe','p-3fc822f8c514','p-f6e75c6600bc']){
  const p=makePlant(id,581,2,2);assert.equal(plantModel(p,view(8)).children.length,0);
  const g=plantModel(p,view(id==='p-b2237cff2e6a'?1:4));assert.ok(g.children.some(m=>m.geometry.userData.narcissusLeaf));assert.ok(g.children.some(m=>m.userData.component==='spathe'));
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite));assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite));}dispose(g);
 }
});
test('narcissus flowers have six tepals and stamens around open cups or split coronas',()=>{
 for(const [id,corona] of [['p-05ede9b738cf','narcissusHoop'],['p-7515ad4e3b8e','narcissusCup'],['p-f6e75c6600bc','narcissusTrumpet'],['p-3fc822f8c514','narcissusSplitCorona']]){
  const parts=[],a=CATALOG[id].appearance;detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch(){}},{x:0,y:0,z:0,r:a.flowerRadius,color:'#eee',shape:'narcissusFlower',palette:a.flowerPalette},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
  assert.equal(parts.filter(p=>p.kind==='petal').length,6);assert.equal(parts.filter(p=>p.kind==='anther').length,6);assert.equal(parts.filter(p=>p.shape===corona).length,corona==='narcissusSplitCorona'?6:1);
 }
 assert.equal(CATALOG['p-b2237cff2e6a'].appearance.flowerPalette.color,'#eeeade');assert.equal(CATALOG['p-461a3f1117fe'].appearance.flowerPalette.count,2);
});

test('dahlias distinguish frost dieback, summer rest and late tree-dahlia flowering',()=>{
 const maxi=CATALOG['p-71dc3b33c599'],labella=CATALOG['p-1cdcecfd96de'],tree=CATALOG['p-a6871a1f89cd'];
 assert.equal(seasonAt(maxi,8).bloom,false);assert.equal(seasonAt(labella,8).bloom,true);assert.equal(seasonAt(tree,7).bloom,false);assert.equal(seasonAt(tree,11).bloom,true);
 assert.deepEqual(tree.appearance.flowerMonths,[10,11,12,1]);assert.match(tree.bloomText,/初霜/);assert.equal(seasonAt(tree,1).bloom,false);
 for(const id of ['p-71dc3b33c599','p-1cdcecfd96de','p-a6871a1f89cd','p-0c809fb897d3','p-04e6395e6b6f']){
  const p=makePlant(id,571,2,2);assert.equal(plantModel(p,view(1)).children.length,0);assert.equal(plantModel(p,view(3)).children.length,0);
  const young=plantModel(p,view(4)),summer=plantModel(p,view(id==='p-a6871a1f89cd'?11:7));assert.ok(young.scale.y<summer.scale.y);assert.ok(summer.children.some(m=>m.userData.component==='node'));
  assert.ok(summer.children.some(m=>m.geometry.userData.dahliaLeaf||m.geometry.userData.dahliaCutLeaf));
  for(const g of [young,summer]){for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite));assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite));}dispose(g);}
 }
});
test('dahlia single flowers expose disc florets; decorative flowers have cupped overlapping rays and cultivar markings',()=>{
 const collect=layers=>{const parts=[];detailedFlower({add:(shape,kind)=>parts.push({shape,kind}),branch(){}},{x:0,y:0,z:0,r:.05,color:'#d56',shape:'dahliaHead',petals:layers===1?8:16,layers},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return parts;};
 const single=collect(1),double=collect(6);assert.equal(single.filter(p=>p.shape==='dahliaRay').length,8);assert.equal(single.filter(p=>p.kind==='discFloret').length,84);assert.ok(double.filter(p=>p.shape==='dahliaRay').length>60);assert.equal(double.filter(p=>p.kind==='discFloret').length,0);
 const noble=plantModel(makePlant('p-2f4cd5c4df5b',572,2,2),view(7)),prima=plantModel(makePlant('p-04e6395e6b6f',573,2,2),view(7));
 assert.ok(noble.children.some(m=>m.geometry.userData.dahliaTwistedRay&&m.userData.component.includes('outside-844985')));assert.ok(prima.children.some(m=>m.geometry.userData.dahliaSplitRay));dispose(noble);dispose(prima);
});

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
 const allowed=new Set(['sources','basis','status','unconfirmed','arrangement','inflorescence','flowerShape','habit','leafShape','leafTexture','leafColor','barkColor','barkPattern','petals','persistence','flowerMonths','flowerTiming','emergenceMonths','dormantMonths','leafPattern','patternColor','flowerLayers','flowerPattern','scientificName','phenologyRegion','leafLength','leafWidth','leafRelief','seasonalColors','stemColor','leaflets','compoundType','standingWinter','flowerSeasons','leafMargin','architecture','winterClimateSensitive','lifeForm','flowerPatternColor','outerFlowerPattern','flowerRadius','seedHeadMonths','seedColor','flowerPalette','flowerGuides','foliageMonths','leaflessBloom','flowerOptions','leafletShape','flowerFadeTo','headRadius','inflorescenceLength','leafletCounts','leafUnderside','springShootColor','stamenCount','leafFlushAfterFlower','monthlyLeafColors','bracts','flowerOutsideColor','flowerEyeColor','monthlyPatternColors','budMonths','fruitMonths','fruitRadius','fruitColor','winterLeafLength','monthlyFlowerDensity','collection','components','shootProfile','flushMonths','winterTipColor','basalLeafShape','basalLeafWidth','standingAfterDeathMonths','foliageHeightRatio','flowerAbundance','pistilCount']);
 for(const [id,a] of Object.entries(APPEARANCE_DATA)){
  assert.ok(Object.keys(a).every(k=>allowed.has(k)),id);assert.ok(['attributes','unconfirmed','partial'].includes(a.status));
  for(const source of a.sources){const u=new URL(source.url);assert.equal(u.protocol,'https:');assert.ok(['delphinium.co.nz','www.terranovanurseries.com','www.danzigeronline.com','www.syngentaflowers.com','www.maff.go.jp','www.iplant.cn','www.e878.net','esveld.nl','nwipb.cas.cn','growwild.kew.org','frais.ocnk.net','anbg.gov.au','www.fws.gov','store.provenwinners.jp','www.kincho-engei.co.jp','x7772506.xaas3.jp','www.tanakanursery.com','www.anbg.gov.au','www.dcceew.gov.au','smoketree-miyabi.com','www.pepinieres-minier.fr','www.tokyo-aff.or.jp','woodyplants.cals.cornell.edu','www.missouribotanicalgarden.org','himenobaraen.jp','www.flowerpark.or.jp','starrosesandplants.com','patents.google.com','patents.justia.com','www.davidaustinroses.co.uk','www.davidaustinrosesaustralia.com','shinomiya-rose.com','ec.keiseirose.co.jp','www.keiseirose.co.jp','www.baranoie.com','www.jacksonandperkins.com','www.komatsugarden-online.com','www.mdpi.com','www.ema.europa.eu','www.biolveg.uma.es','academic.oup.com','sys01.lib.hkbu.edu.hk','plantdatabase.kpu.ca','botsoc.scot','www.infoflora.ch','darcyeverest.co.uk','resources.austplants.com.au','www.logan.qld.gov.au','plant-directory.ifas.ufl.edu','link.springer.com','onlinelibrary.wiley.com','www.naro.go.jp','tojaku.co.jp','japr.or.jp','www.tokyo-shoyaku.com','www.fp-k.org','www.town.taketoyo.lg.jp','www.akb.jp','ecgrowers.com','www.barrault-plantes-jardins.com','world-plants.com','naegibu.com','sakisansou.ocnk.net','harvest.cals.ncsu.edu','iwasaki.shop-pro.jp','efloras.org','www.pref.gifu.lg.jp','www.crug-farm.co.uk','nikko-bg.jp','mortonarb.org','fumakilla.jp','www.sakataseed.co.jp','www.lsuagcenter.com','keybase.rbg.vic.gov.au','extension.oregonstate.edu','linnet.geog.ubc.ca','www.suntory.co.jp','hakusan1.co.jp','www.knollgardens.co.uk','www.awaji.ac.jp','plantnet.rbgsyd.nsw.gov.au','www.nzplants.auckland.ac.nz','mastergardener.extension.wisc.edu','www.lullfitz.com.au','www.grahamrice.com','www.wakaizumi-farm.com', 'kanekyu.net', 'mag.nhk-book.co.jp', 'www.botanischetuinen.nl', 'yokoyama-nursery.jp','www.ashwoodnurseries.com','gobotany.nativeplanttrust.org','store.shopping.yahoo.co.jp','www.ugui-vc.jp','www.tba.or.jp','wiki.irises.org','www.dwarfirissociety.org','www.zahradnictvi-spomysl.cz','www.agsfan.com','sakata-netshop.com','satsukibonsai-4s.jp','www.kkr.mlit.go.jp','tbg.kahaku.go.jp','sernecportal.org','www.efloras.org','www.royalvanzanten.com','www.panamseed.com','www.fleuroselect.com','hakusan1.co.jp','plantsofhawaii.org','www.takii.co.jp','shop.takii.co.jp','bibliotecadelbotanico.org','w3.biosci.utexas.edu','www.gardentrials.com','pmc.ncbi.nlm.nih.gov','pza.sanbi.org','floraseries.landcareresearch.co.nz','staff.fukuoka-edu.ac.jp','flora.uniud.it','www3.gobiernodecanarias.org','www.nzflora.info','agrobiodiversity.uniag.sk','www.ogis.co.jp','www.engei.net','plants.ces.ncsu.edu','plantfinder.mobot.org','www.rhs.org.uk','item.rakuten.co.jp','www.nzpcn.org.nz','www.kernock.co.uk','www.rhsplants.co.uk','plantnet.rbgsyd.nsw.gov.au','active.inspection.gc.ca','www.darwinperennials.com','catalog.darwinperennials.com','info.ballseed.com','www.plantdelights.com','hortflora.rbg.vic.gov.au','www.thompson-morgan.com','www.nmns.edu.tw','plants.usda.gov','fitzgerald-nurseries.com','www.ffpri.go.jp','www.hro.or.jp','www.pharm.kumamoto-u.ac.jp','www.rinya.maff.go.jp','www.higashiyama.city.nagoya.jp','www.treesandshrubsonline.org','www1.ous.ac.jp','web.tuat.ac.jp','www.tokyo-park.or.jp','www.cgr.mlit.go.jp','www.aglandscape.co.jp','www.town.kumano.lg.jp','www.env.go.jp','www.forest-akita.jp','powo.science.kew.org','arboretum.harvard.edu','landscapeplants.oregonstate.edu','www.hanahiroba.com','www.paradisegarden-nishiyama.com','www.provenwinners.com','www.botanic.jp','botany.cz','vicflora.rbg.vic.gov.au','www.nparks.gov.sg','provenwinners.jp','pacificbulbsociety.org','keys.landcareresearch.co.nz','plantipp.eu','www.wairere.nz','hosho.ees.hokudai.ac.jp','www.hokudai.ac.jp','www.lab.toho-u.ac.jp','eprints.lib.hokudai.ac.jp','www.town.karuizawa.lg.jp','library.dbca.wa.gov.au','www.hinshu2.maff.go.jp','matsunaga-kadan.com','oniduka.base.shop'].includes(u.hostname));assert.ok(['catalog-entry','species','genus'].includes(source.scope));}
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
 assert.ok(branches.length>0);assert.ok(branches.every(({from,to})=>to[1]<from[1]));assert.ok(branches.reduce((sum,{from,to})=>sum+from[1]-to[1],0)>.3);assert.equal(seasonAt(info,1).leafDensity,0);
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
  if(info.appearance.persistence==='frostDormantTuber'&&[12,1,2,3].includes(month)){
   assert.equal(info.appearance.winterClimateSensitive,true);assert.match(info.bloomText,/初霜/);assert.equal(seasonAt(info,month).bloom,false);continue;
  }
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
  const a=CATALOG[id].appearance;assert.equal(a.petals,6);assert.equal(a.flowerShape,'puschkiniaStar');assert.equal(a.leafPattern,undefined);assert.equal(a.flowerPattern,'center');
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
 for(const info of Object.values(CATALOG).filter(p=>p.latin.startsWith('Phlox'))){assert.ok(['salver','stolonPhloxFlower'].includes(info.appearance.flowerShape));assert.equal(info.appearance.petals,5);}
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
 assert.equal(CATALOG['p-e80f8d914048'].appearance.habit,'rounded');assert.equal(CATALOG['p-4f35979ad7ec'].appearance.habit,'upright');
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

test('color foliage preserves runners, cladodes, curled blades and distinct cold responses',()=>{
 const ids=['p-57f19df26a3c','p-422c087e0692','p-32c7825992d8','p-eb429e26e526','p-a67ededf32ab','p-c451bcb63552','p-7dc171d474a5','p-466651213635','p-627fa82cc170','p-2430707877bf','p-fcf701c2d967','p-f4089e534d2a','p-88568c98d224'];
 for(const id of ids)for(const month of [1,4,7,10]){
  const g=plantModel(makePlant(id,2700+ids.indexOf(id),2,2),view(month));
  for(const m of g.children)if(m.instanceMatrix)assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);
  if(month===7)assert.ok(g.children.some(m=>m.userData.component?.startsWith('leaf')),id);
  dispose(g);
 }
 const wire=makePlant('p-32c7825992d8',2800,2,2),summer=plantModel(wire,view(7)),winter=plantModel(wire,view(1));
 const wood=g=>g.children.filter(m=>m.userData.component==='wood').map(m=>[...m.instanceMatrix.array]);
 assert.deepEqual(wood(summer),wood(winter));assert.equal(CATALOG[wire.kind].height,null);dispose(summer);dispose(winter);
 const asparagus=makePlant('p-f4089e534d2a',2801,2,2),a=plantModel(asparagus,view(7));
 assert.ok(a.children.some(m=>m.userData.component==='branchlet'));assert.equal(plantModel(asparagus,view(1)).children.length,0);dispose(a);
 const shield=makePlant('p-fcf701c2d967',2802,2,2),metal=plantModel(shield,view(7));
 assert.ok(metal.children.some(m=>m.userData.component==='leaf-persian-metal'));assert.equal(stateAt(shield,{...view(7),year:1}).present,false);dispose(metal);
 const curly=plantModel(makePlant('p-2430707877bf',2803,2,2),view(7));assert.ok(curly.children.some(m=>m.geometry.userData.curlyLeucothoe));dispose(curly);
 const cup=[];detailedFlower({add:(shape,kind)=>cup.push({shape,kind}),branch(){}},{x:0,y:0,z:0,color:'#ccb0c0',shape:'pityrodiaFlower'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.equal(cup.filter(v=>v.kind==='leaf-woolly').length,5);assert.equal(cup.filter(v=>v.kind==='anther').length,4);
});

test('woodland species keep distinct leaves, floral organs and deciduous versus evergreen winters',()=>{
 const ids=['p-a2c1bedeba15','p-05d0d5b209af','p-e40d2e90ed99','p-ef9d51f9251b','p-42c921ac7405','p-077197bd2d12','p-131798d06a5a','p-c178a12b9952','p-c6993b2b58d9','p-b19b52046099','p-a926241debf9','p-152c7f8ab71a'];
 for(const id of ids)for(let month=1;month<=12;month++){
  const p=makePlant(id,3600,2,2),g=plantModel(p,view(month));
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}
  if(month===1){if(['p-077197bd2d12','p-a926241debf9'].includes(id))assert.ok(g.children.some(m=>m.userData.component.startsWith('leaf')),id);else assert.equal(g.children.length,0,id);}
  dispose(g);
 }
 const collect=shape=>{const parts=[];detailedFlower({add:(mesh,kind)=>parts.push({mesh,kind}),branch(){}},{x:0,y:0,z:0,color:'#dddddd',shape},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});return parts;};
 for(const [shape,n] of [['woodlandPoppy',4],['diphylleiaFlower',6],['deinantheCup',7],['kirengeshomaBell',5],['pteridophyllumCross',4],['parnassiaFlower',5]])assert.equal(collect(shape).filter(p=>p.kind==='petal').length,n,shape);
 assert.equal(collect('ranzaniaBell').filter(p=>p.kind==='petaloidSepal').length,6);assert.equal(collect('ranzaniaBell').filter(p=>p.kind==='petal').length,6);
 assert.equal(collect('cornusHerbHead').filter(p=>p.kind==='bract').length,4);assert.equal(collect('parnassiaFlower').filter(p=>p.kind==='staminodeGland').length,55);
 const sa=makePlant('p-b19b52046099',3601,2,2),bloom=plantModel(sa,view(6)),late=plantModel(sa,view(9));
 assert.ok(bloom.children.some(m=>m.userData.component==='leaf-whiteFloral'));assert.ok(!late.children.some(m=>m.userData.component==='leaf-whiteFloral'));assert.ok(!bloom.children.some(m=>m.userData.component==='petal'));dispose(bloom);dispose(late);
 const ar=plantModel(makePlant('p-c6993b2b58d9',3602,2,2),view(10));assert.ok(ar.children.some(m=>m.userData.component==='fruit'));assert.ok(!ar.children.some(m=>m.userData.component.startsWith('wood')));dispose(ar);
 const d=validateDocument(JSON.parse(JSON.stringify(annualGalleryDocument())));assert.ok(d);
});

test('20 spurges and gauras use distinct leaf and reproductive organs through all twelve months',()=>{
 const entries=Object.entries(CATALOG).filter(([,p])=>['spurgeCanes','spurgeDome','snowSpurge','gauraWands'].includes(p.appearance?.architecture));assert.equal(entries.length,20);
 for(const [id,info] of entries)for(let month=1;month<=12;month++){
  const p=makePlant(id,3701,2,2),g=plantModel(p,view(month));
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}
  if(month===1){if(['gauraWands','spurgeDome','snowSpurge'].includes(info.appearance.architecture))assert.equal(g.children.length,0,id);else assert.ok(g.children.some(m=>m.userData.component.startsWith('leaf')),id);}
  if(info.appearance.architecture==='spurgeCanes'&&month===5){assert.ok(g.children.some(m=>m.userData.component==='nectary'));assert.ok(!g.children.some(m=>m.userData.component==='petal'));}
  dispose(g);
 }
 const parts=[],builder={add:(shape,kind)=>parts.push({shape,kind}),branch(){}};
 detailedFlower(builder,{x:0,y:0,z:0,color:'#eeeeee',shape:'gauraButterfly'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.equal(parts.filter(p=>p.shape==='gauraPetal').length,4);assert.equal(parts.filter(p=>p.kind==='anther').length,8);
 parts.length=0;detailedFlower(builder,{x:0,y:0,z:0,color:'#baba55',shape:'spurgeCyathium'},{bud:'bud',rand:()=>.5,shade:(_,c)=>c});
 assert.equal(parts.filter(p=>p.kind==='bract').length,2);assert.equal(parts.filter(p=>p.kind==='nectary').length,4);assert.equal(parts.filter(p=>p.kind==='petal').length,0);
 const snow=makePlant('p-5ae965788b29',3730,2,2);assert.equal(stateAt(snow,{...view(6),year:1}).present,false);
 assert.notEqual(seasonAt(CATALOG['p-4c1fd39eace3'],1).leafPatternColor,seasonAt(CATALOG['p-4c1fd39eace3'],6).leafPatternColor);
 assert.equal(seasonAt(CATALOG['p-f7fafcbd6c8a'],1).bloom,false);
});

test('twelve grasses and sedges preserve leaf apices, heads and winter persistence',()=>{
 const arches=['blueFescue','snowTussock','goldMillet','redMelica','crystalSedge','redHookSedge','goldMatRush','goldDwarfBamboo','sweetFlagFans','whitetopSedge'];
 const entries=Object.entries(CATALOG).filter(([,p])=>arches.includes(p.appearance?.architecture));assert.equal(entries.length,12);
 for(const [id,info] of entries)for(let month=1;month<=12;month++){
  const g=plantModel(makePlant(id,3801,2,2),view(month));
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}
  if(month===1){if(['redMelica','whitetopSedge'].includes(info.appearance.architecture))assert.equal(g.children.length,0,id);else if(info.appearance.architecture!=='goldDwarfBamboo')assert.ok(g.children.some(m=>m.userData.component.startsWith('leaf')),id);}
  if(month===6&&info.appearance.architecture==='whitetopSedge'){assert.ok(g.children.some(m=>m.userData.component==='bract-tip-517d46'));assert.ok(!g.children.some(m=>m.userData.component==='petal'));assert.ok(g.children.some(m=>m.userData.component==='culm'&&m.geometry.parameters.radialSegments===3));}
  if(month===6&&info.appearance.architecture==='sweetFlagFans')assert.ok(g.children.some(m=>m.userData.component==='spadixFlower'));
  if(info.appearance.architecture==='crystalSedge')assert.ok(g.children.some(m=>m.userData.component==='membranousEdge'));
  dispose(g);
 }
 const bamboo=makePlant('p-2450337a047a',3801,2,2),winter=plantModel(bamboo,view(1)),summer=plantModel(bamboo,view(6));
 assert.ok(!winter.children.some(m=>m.userData.component.startsWith('leaf')));assert.ok(summer.children.some(m=>m.userData.component.startsWith('leaf')));
 for(const name of ['bambooCulm','bambooNode','bambooTwig'])assert.deepEqual(winter.children.find(m=>m.userData.component===name).instanceMatrix.array,summer.children.find(m=>m.userData.component===name).instanceMatrix.array);
 dispose(winter);dispose(summer);
 assert.notEqual(seasonAt(CATALOG['p-de19f78331f2'],1).leafColor,seasonAt(CATALOG['p-de19f78331f2'],4).leafColor);
});

test('aquatic reeds distinguish bracts, rays, sheaths and cold-protected winter absence',()=>{
 const ids=['p-00897f5fd75a','p-f32a65d4f1da','p-fbb7825413ec','p-553aaea797a9','p-91d5d4c1fdcd'];
 for(const id of ids)for(let month=1;month<=12;month++){
  const g=plantModel(makePlant(id,3901,2,2),view(month));
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}
  if(month===1){if(id==='p-91d5d4c1fdcd')assert.ok(g.children.some(m=>m.userData.component.startsWith('leaf')),id);else assert.equal(g.children.length,0,id);}
  if(id==='p-553aaea797a9'&&month===7){assert.ok(g.children.some(m=>m.userData.component==='sheathTooth'));assert.ok(g.children.some(m=>m.userData.component==='whorledBranch'));assert.ok(!g.children.some(m=>m.userData.component==='petal'||m.userData.component==='anther'));assert.equal(seasonAt(CATALOG[id],month).bloom,false);}
  if(id==='p-fbb7825413ec'&&month===7){assert.ok(g.children.some(m=>m.userData.component==='umbelRay'));assert.ok(g.children.some(m=>m.userData.component==='glume'));assert.ok(!g.children.some(m=>m.userData.component.startsWith('leaf')));}
  if(id==='p-00897f5fd75a'&&month===7){assert.ok(g.children.some(m=>m.geometry.userData.umbrellaBract));assert.ok(g.children.some(m=>m.userData.component==='basalSheath'));}
  dispose(g);
 }
 const tropical=CATALOG['p-fbb7825413ec'];
 for(const m of [10,11,12,1,2,3,4]){assert.equal(seasonAt(tropical,m).groundDormant,true);assert.match(seasonAt(tropical,m).label,/保護場所/);}
 assert.equal(CATALOG['p-fbb7825413ec'].life,'perennial');assert.match(CATALOG['p-fbb7825413ec'].latin,/prolifer/);
 assert.equal(CATALOG['p-553aaea797a9'].appearance.flowerMonths,undefined);
 assert.equal(seasonAt(CATALOG['p-91d5d4c1fdcd'],1).groundDormant,false);
});

test('floating aquatics separate female flowers, sepals, fringes and underwater winter leaves',()=>{
 const ids=['p-8d877dd373db','p-b038c25453b8','p-a9c345dcea4e','p-f2e4c7935581'];
 for(const id of ids)for(let month=1;month<=12;month++){
  const p=makePlant(id,4000,2,2);p.height=id==='p-8d877dd373db'?.6:id==='p-b038c25453b8'?.4:.12;p.spread=.55;p.leafHeight=p.height*.7;
  const g=plantModel(p,view(month));
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}
  if(month===1)assert.equal(g.children.length,0,id);
  if(month===7){
   const has=name=>g.children.some(m=>m.userData.component===name);
   assert.ok(has('leaf-glossy'));
   if(id===ids[0]){assert.ok(has('carpelHead'));assert.ok(!has('anther'));}
   if(id===ids[1]){assert.ok(has('petaloidSepal'));assert.ok(has('stigmaticDisc'));assert.ok(has('petal'));}
   if(id===ids[2])assert.ok(has('corollaFringe'));
   if(id===ids[3]){assert.ok(has('throat'));assert.ok(!has('corollaFringe'));}
  }
  dispose(g);
 }
 for(const id of ids.slice(0,2)){assert.equal(CATALOG[id].appearance.persistence,'winterSubmerged');assert.match(seasonAt(CATALOG[id],1).phase,/水中葉/);}
 assert.match(seasonAt(CATALOG[ids[3]],1).phase,/保護場所/);
});

test('free floating aquatics retain species hair types, flower asymmetry and distinct winter survival',()=>{
 const ids=['p-daa12b3e6d9f','p-b012252eaf20','p-e9f5ab2a40d1','p-0d9f8d98a2e2','p-c76bbcb60009'];
 for(const id of ids)for(let month=1;month<=12;month++){
  const p=makePlant(id,4100,2,2),g=plantModel(p,view(month)),has=name=>g.children.some(m=>m.userData.component===name);
  for(const m of g.children){assert.ok([...m.instanceMatrix.array].every(Number.isFinite),id);assert.ok([...m.geometry.attributes.position.array].every(Number.isFinite),id);}
  if([1,2,3,12].includes(month))assert.equal(g.children.length,0,id);
  if(month===7){
   if(id===ids[0]){assert.ok(has('inflatedPetiole'));assert.ok(has('petal-hyacinth-eye'));assert.ok(has('perianthTube'));}
   if(id===ids[1]){assert.ok(has('spongyUnderside'));assert.ok(has('dividedStigma'));assert.ok(has('staminalColumn'));}
   if(id===ids[2]){assert.ok(has('freeLeafHair'));assert.ok(!has('joinedLeafHair'));assert.equal(stateAt(p,{...view(7),year:1}).present,false);}
   if(id===ids[3]){assert.ok(has('joinedLeafHair'));assert.ok(!has('freeLeafHair'));}
   if(id===ids[4]){assert.ok(has('simpleLeafHair'));assert.ok(!has('joinedLeafHair'));}
   if(id!==ids[0]&&id!==ids[1]){assert.ok(!has('petal'));assert.ok(!has('anther'));}
  }
  dispose(g);
 }
 assert.match(seasonAt(CATALOG[ids[2]],1).phase,/胞子/);assert.equal(seasonAt(CATALOG[ids[2]],4).groundDormant,false);
 for(const id of [ids[0],ids[1],ids[3],ids[4]]){assert.match(seasonAt(CATALOG[id],1).phase,/保護場所/);assert.equal(seasonAt(CATALOG[id],4).groundDormant,true);assert.equal(seasonAt(CATALOG[id],5).groundDormant,false);}
 const doc=annualGalleryDocument();doc.plans.A.plants=ids.map((id,i)=>makePlant(id,4200+i,1+i*.4,2));assert.doesNotThrow(()=>validateDocument(doc));
});
