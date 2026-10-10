import test from 'node:test';
import assert from 'node:assert/strict';
import {CATALOG,CATALOG_VERSION} from '../site/catalog.js';
import {EXPANDED_CATALOG} from '../site/catalog-data.js';
import {GENRES,COLORS,searchCatalog,catalogPage,seasonAt} from '../site/catalog-search.js';
import {emptyDocument,sampleDocument,validateDocument,makePlant,stateAt,taskEvents} from '../site/model.js';
import {plantModel} from '../site/vegetation.js';
import {EXTENDED_FORMS} from '../site/botanical-models.js';
const entries=Object.entries(CATALOG),view=month=>({month,year:0,reference:false});
const fields='label latin genre form group leaf height spread bloom bloomKnown flower leafColor variegated colors sun moisture life growth season care bloomText bloomBasis source publisher sourceChecked aliases selectionSource visual popularity'.split(' ').sort();
test('catalog contains real plant names across all ten requested genres with a bounded public schema',()=>{
 assert.ok(entries.length>=3000);assert.deepEqual([...new Set(entries.map(([,p])=>p.genre))].sort(),[...GENRES].sort());
 for(const [id,p] of Object.entries(EXPANDED_CATALOG)){
  assert.match(id,/^p-[a-f0-9]{12}$/);assert.deepEqual(Object.keys(p).sort(),fields);assert.ok(p.label.length>1&&p.label.length<130);
  assert.doesNotMatch(p.label,/専用土|肥料|マルチングチップ|リットル入り/);
  assert.ok(p.colors.every(c=>Object.hasOwn(COLORS,c)));assert.equal(new Set(p.bloom).size,p.bloom.length);assert.ok(p.bloom.every(m=>Number.isInteger(m)&&m>=1&&m<=12));
  for(const key of ['height','spread'])if(p[key])assert.ok(p[key].length===2&&p[key].every(v=>Number.isFinite(v)&&v>0&&v<=60)&&p[key][0]<=p[key][1],p.label+' '+key);
  if(p.source){const u=new URL(p.source);assert.equal(u.protocol,'https:');assert.ok(['patents.google.com','patents.justia.com','ec.keiseirose.co.jp','www.baranoie.com','onlinelibrary.wiley.com','www.naro.go.jp','tojaku.co.jp','japr.or.jp','www.tokyo-shoyaku.com','www.fp-k.org','www.town.taketoyo.lg.jp','www.akb.jp','world-plants.com','naegibu.com','sakisansou.ocnk.net','www.rhsplants.co.uk','www.suntory.co.jp','hakusan1.co.jp','www.knollgardens.co.uk','www.awaji.ac.jp','plantnet.rbgsyd.nsw.gov.au','www.nzplants.auckland.ac.nz','mastergardener.extension.wisc.edu','www.lullfitz.com.au','www.grahamrice.com','www.wakaizumi-farm.com', 'kanekyu.net', 'mag.nhk-book.co.jp', 'www.botanischetuinen.nl', 'yokoyama-nursery.jp','www.ashwoodnurseries.com','gobotany.nativeplanttrust.org','store.shopping.yahoo.co.jp','www.ugui-vc.jp','www.tba.or.jp','wiki.irises.org','www.dwarfirissociety.org','www.zahradnictvi-spomysl.cz','item.rakuten.co.jp','hakusan1.co.jp','shop.takii.co.jp','www.agsfan.com','sakata-netshop.com','tbg.kahaku.go.jp','satsukibonsai-4s.jp','www.takii.co.jp','www.ogis.co.jp','www.engei.net','plants.ces.ncsu.edu','ask.ifas.ufl.edu','www.rhs.org.uk','www.darwinperennials.com','info.ballseed.com','fitzgerald-nurseries.com','www.ffpri.go.jp','www.hro.or.jp','www.pharm.kumamoto-u.ac.jp','www.rinya.maff.go.jp','www.higashiyama.city.nagoya.jp','www.treesandshrubsonline.org','www1.ous.ac.jp','web.tuat.ac.jp','www.tokyo-park.or.jp','www.cgr.mlit.go.jp','www.aglandscape.co.jp','www.town.kumano.lg.jp','www.env.go.jp','www.forest-akita.jp'].includes(u.hostname));assert.equal(u.username,'');assert.equal(u.password,'');}
  else {assert.equal(p.height,null);assert.equal(p.spread,null);assert.deepEqual(p.bloom,[]);assert.deepEqual(p.colors,['unknown']);assert.equal(p.form,'unmodeled');}
 }
});
test('all catalog pages are reachable once and empty results remain well-formed',()=>{
 const found=[];for(let i=0;i<Math.ceil(entries.length/24);i++)found.push(...catalogPage(entries,i).entries.map(([id])=>id));
 assert.deepEqual(found,entries.map(([id])=>id));assert.equal(catalogPage([],99).pages,1);assert.equal(catalogPage([],99).index,0);assert.equal(catalogPage(entries,-3).index,0);
});
test('name search handles kana, aliases, spaces and combined genre/color/source filters',()=>{
 assert.ok(searchCatalog(CATALOG,{query:'いろは もみじ'}).some(([id])=>id==='maple'));
 const rose=searchCatalog(CATALOG,{genre:'バラ',color:'pink',status:'sourced'});assert.ok(rose.length>0);assert.ok(rose.every(([,p])=>p.genre==='バラ'&&p.colors.includes('pink')&&p.source));
 for(const [id,p] of entries.filter(([,p])=>p.aliases?.length).slice(0,12))assert.ok(searchCatalog(CATALOG,{query:p.aliases[0]}).some(([found])=>found===id));
 assert.ok(searchCatalog(CATALOG,{status:'pending'}).every(([,p])=>!p.source));assert.equal(searchCatalog(CATALOG,{query:'<script>unlisted</script>'}).length,0);
 for(const name of ['カレックス(エヴェレスト)','カレックス(エヴァロロ)','矮性パンパスグラス(白)','矮性パンパスグラス(赤)'])assert.ok(entries.some(([,p])=>p.label===name),name);
});
test('old saved catalogs migrate without changing plant IDs, plans or the input document',()=>{
 const old=sampleDocument();old.catalogVersion='2026-10-09.1';const copy=JSON.stringify(old),next=validateDocument(old);
 assert.equal(JSON.stringify(old),copy);assert.equal(next.catalogVersion,CATALOG_VERSION);assert.deepEqual(next.plans,old.plans);assert.deepEqual(next.view,old.view);
 assert.equal(validateDocument({...old,catalogVersion:'2026-10-10.2'}).catalogVersion,CATALOG_VERSION);
 assert.throws(()=>validateDocument({...old,catalogVersion:'unknown-future'}));
 for(const genre of GENRES){const [id]=entries.find(([,p])=>p.genre===genre),doc=emptyDocument();doc.plans.A.plants=[makePlant(id,1,2,2)];assert.deepEqual(validateDocument(doc),doc);}
});
test('unknown spread stays an input dimension and annuals do not silently regrow next year',()=>{
 const [id]=entries.find(([,p])=>p.height&&!p.spread),p=makePlant(id,1,2,2);const s=stateAt(p,{...view(6),reference:true});assert.equal(s.spread,p.spread);assert.ok(Number.isFinite(s.height));
 const [annual]=entries.find(([,p])=>p.life==='annual'),a=makePlant(annual,2,2,2);a.start=10;a.tasks=[{id:1,type:'feed',month:10,repeat:'annual',count:1,min:1,max:2}];
 assert.equal(stateAt(a,{...view(10),year:0}).present,false);assert.equal(stateAt(a,{...view(10),year:1}).present,true);assert.equal(stateAt(a,{...view(11),year:1}).expired,true);assert.equal(taskEvents(a,1).length,1);assert.equal(taskEvents(a,2).length,0);
});
test('winter flowering and unknown phenology remain distinct from dormant deciduous plants',()=>{
 const hellebore=entries.find(([,p])=>p.form==='hellebore'&&p.bloom.includes(1));assert.ok(hellebore);assert.equal(seasonAt(hellebore[1],1).bloom,true);
 assert.equal(seasonAt(CATALOG.maple,1).dormant,true);assert.equal(seasonAt(CATALOG.olive,1).dormant,false);
 const pending=entries.find(([,p])=>!p.source)[1];assert.equal(seasonAt(pending,1).known,false);assert.equal(seasonAt(pending,1).dormant,false);
});
test('each represented new form renders finite geometry in winter and its flowering month',()=>{
 const representatives=new Map();for(const [id,p] of entries)if(EXTENDED_FORMS.has(p.form)&&!representatives.has(p.form))representatives.set(p.form,[id,p]);assert.ok(representatives.size>=15);
 for(const [form,[id,info]] of representatives)for(const month of new Set([1,info.bloom[0]||6])){
  const p=makePlant(id,10,2,2),g=plantModel(p,view(month));assert.equal(g.userData.plantId,10);
  g.traverse(o=>{if(!o.geometry)return;assert.ok([...o.geometry.attributes.position.array].every(Number.isFinite),form);if(o.isInstancedMesh){assert.ok(o.count>0);assert.ok([...o.instanceMatrix.array].every(Number.isFinite),form);assert.equal(o.geometry.attributes.gardenWind.count,o.instanceMatrix.count);assert.ok(o.count<=o.instanceMatrix.count);}o.geometry.dispose();if(o.isInstancedMesh)o.dispose();});
 }
 const [id]=entries.find(([,p])=>p.form==='unmodeled'),g=plantModel(makePlant(id,11,2,2),view(6));assert.equal(g.userData.unmodeled,true);assert.equal(g.children.length,1);assert.equal(g.children[0].material.wireframe,true);g.children[0].geometry.dispose();g.children[0].material.dispose();
});
