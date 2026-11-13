import {HABITS,treeProfile} from './tree-profiles.js?v=0.9.1149';
import { GENRES, COLORS, createCatalogSearch, catalogPage, seasonAt } from './catalog-search.js?v=0.9.1149';
import {appearanceSummary,TRAIT_LABELS} from './appearance.js?v=0.9.1149';
import { CATALOG, CATALOG_VERSION, plantInfo } from './catalog.js?v=0.9.1149';
import { clone, round, currentPlan, makePlant, replacePlant, editSize, outlineFor, area, circleZonePoints, validOutline, inside, contained, obstaclePoints, canPlant, validateDocument, validSavedCamera, sampleDocument, treeGalleryDocument, annualGalleryDocument, stateAt, pondDepthAt, plantSizeLimits, budget, calendar, observations, TASKS, taskCountLimit, validTaskMinutes } from './model.js?v=0.9.1149';
import { createScene } from './scene.js?v=0.9.1149';

const $=id=>document.getElementById(id),el=(tag,text,className)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;};
let doc=sampleDocument(),selected=null,mode='orbit',addKind='salvia',draft=[],history=[],future=[],preview=null,engine=null,calendarMonth=null,copyPlant=null,previewTrigger=null,previewKind=null,drawingTrigger=null;
const shown=()=>preview||doc,plan=()=>currentPlan(shown()),selectedPlant=()=>plan().plants.find(p=>p.id===selected);
const number=id=>$(id).value.trim()===''?NaN:Number($(id).value),optional=id=>$(id).value.trim()===''?null:Number($(id).value);
const yen=v=>`${v.toLocaleString('ja-JP')}円`,time=(a,b)=>a===b?`${round(a)}分`:`${round(a)}〜${round(b)}分`;
const message=text=>$('status').textContent=text;
const nextId=items=>{let id=1;while(items.some(p=>p.id===id))id++;return id;};
function button(text,action){const b=el('button',text);b.addEventListener('click',action);return b;}
function options(id,values){$(id).replaceChildren(...values.map(([value,text])=>{const o=el('option',text);o.value=value;return o;}));}
function editor(id){for(const b of document.querySelectorAll('[data-editor]')){const active=b.dataset.editor===id;b.setAttribute('aria-pressed',String(active));$(b.dataset.editor).hidden=!active;}}
function insight(id){for(const b of document.querySelectorAll('[data-insight]')){const active=b.dataset.insight===id;b.setAttribute('aria-pressed',String(active));$(b.dataset.insight).hidden=!active;}}
function sourcePlantView(target,kind){
  const plant=target==='selected-source'?selectedPlant():null;
  return plant&&plant.kind===kind?{
    plant,view:{...shown().view,waterDepth:pondDepthAt(plan(),plant.x,plant.z)},
  }:null;
}
function sourceMonthPhase(info,month,placed){
  if(!placed)return seasonAt(info,month);
  const state=stateAt(placed.plant,{...placed.view,month});
  if(!state.present)return {
    ...state,bloom:false,dormant:false,autumn:false,known:true,
    label:state.expired?'この株の生育期間は終了しました':'この株はまだ植え付け前です',
  };
  return state;
}
function updateSourceMonth(box){
  const current=String(shown().view.month),kind=box.dataset.kind;
  const placed=sourcePlantView(box.id,kind);
  const monthState=placed?JSON.stringify([
    placed.plant,placed.view.year,placed.view.reference,placed.view.waterDepth,
  ]):kind;
  const redraw=monthState!==box.dataset.monthState;
  const info=redraw&&kind?plantInfo(kind):null;
  for(const cell of box.querySelectorAll('.phenology button')){
    if(cell.textContent===current)cell.setAttribute('aria-current','date');
    else cell.removeAttribute('aria-current');
    if(info){
      const phase=sourceMonthPhase(info,Number(cell.textContent),placed);
      cell.dataset.phase=phase.bloom?'flower':phase.dormant?'dormant':phase.autumn?'autumn':phase.known?'outside':'unknown';
      cell.title=cell.textContent+'月：'+phase.label;
      cell.setAttribute('aria-label',cell.title);
    }
  }
  if(redraw)box.dataset.monthState=monthState;
}
function sourceCard(target,kind){
  const info=plantInfo(kind),box=$(target);
  if(box.dataset.kind===kind){updateSourceMonth(box);return;}
  box.dataset.kind=kind;
  delete box.dataset.monthState;
  box.replaceChildren(el('strong',info.label),el('p',info.latin||'学名未確認'));
  if(info.appearance?.collection){
   box.replaceChildren(el('strong',info.label),el('p',info.care));
   if(info.appearance.components)for(const id of info.appearance.components)box.append(button(`${plantInfo(id).label}を選ぶ`,()=>chooseKind(id)));
   else box.append(el('p','構成する植物を確認できるまで外観は未対応です。','hint'));
   for(const url of new Set([info.source,...info.appearance.sources.map(s=>s.url)])){const a=el('a','構成・栽培情報の出典 ↗');a.href=url;a.target='_blank';a.rel='noopener noreferrer';box.append(el('br'),a);}return;
  }
  box.append(el('p',`資料の高さ：${info.height?info.height.join('〜')+'m':'未確認'} ／ 幅：${info.spread?info.spread.join('〜')+'m':'未確認'}`));
  if(info.gardenUse){const g=info.gardenUse;box.append(el('strong','地植え越冬の目安：関東など霜の降りる平地'),el('p',g.basis+' '+g.conditions));const a=el('a','地植え・耐寒性の出典 ↗');a.href=g.source;a.target='_blank';a.rel='noopener noreferrer';box.append(a);}
  const tree=treeProfile(info);if(tree)box.append(el('p',HABITS[tree.habit]+' · '+(tree.leaf==='evergreen'?'常緑':'落葉'),'habit-note'));
  if(info.popularity?.length)box.append(el('p',info.popularity.map(r=>`${r.publisher} ${r.category} 人気順 ${r.rank}位（${r.checked}確認）`).join(' ／ '),'hint'));
  box.append(el('p',info.bloomText),el('p',info.care));
  const traits=appearanceSummary(info);if(traits)box.append(el('p',traits,'habit-note'));
  const appearance=info.appearance;
  if(appearance?.architecture==='submergedShoots')box.append(el('p',appearance.shootProfile==='ovalis'?'水深0mでは葉腋の花を、水深がある池では水中葉を参考表示します。水位に応じて茎が伸びる過程は未再現です。':appearance.waterSurfaceModel?'水深2cm未満では水上の姿、それ以上では水中の姿を表示します。水中では花を表示しません。変化する水位に応じた新葉の展開速度、水温・結氷の影響は未再現です。':'水中葉の見本です。「庭をつくる」で池の水深を設定すると、水底から描きます。池の外や水深0mでは、形を見るための見本表示になります。水温・結氷・水質による生育変化は未再現です。','hint'));
  if(appearance?.phenologyRegion==='grower-cold')box.append(el('p','冬姿の参考：おぎはら植物園の寒冷地での記載。暖地の実測時期ではありません。','hint'));
  else if(appearance?.phenologyRegion)box.append(el('p',appearance.phenologyRegion,'hint'));
  if(appearance?.sourceConflict)box.append(el('p',appearance.sourceConflict,'hint'));
  if(appearance?.winterClimateSensitive&&!info.gardenUse)box.append(el('p','冬の葉や花は栽培環境で変わります。寒さへの対処は、育て方と出典の案内を確認してください。','hint'));
  if(appearance?.unconfirmed.length){
   const notes=el('details',undefined,'reference-notes');notes.append(el('summary','参考表示の注意点'));
   const list=el('ul');for(const k of appearance.unconfirmed)list.append(el('li',TRAIT_LABELS[k]||k));notes.append(list);box.append(notes);
  }
  box.append(el('p',appearance?.lifeForm==='moss'?'コケ植物なので花は付けません。胞子のうの季節変化は未確認です。':['evergreenHorsetail','waterHorsetail'].includes(appearance?.architecture)?'シダ植物なので花は付けません。胞子嚢穂の出現月は未確認です。':appearance?.flowerTiming==='months'&&appearance.flowerMonths?.length&&info.bloomKnown!==false?`開花月の記載あり：${appearance.flowerMonths.join('・')}月。出典の地域・栽培条件での目安です。`:!info.bloomKnown&&!appearance?.flowerMonths?.length?'開花月は資料未確認です。実や葉の観賞期を開花月として扱っていません。':'季節表記を月に区分した参考表示。芽出し・落葉の正確な月は、資料に記載がある植物だけ採用しています。','hint'));
  const months=el('div',undefined,'phenology');
  months.setAttribute('aria-label',target==='selected-source'?'選んだ株の12か月の参考':'12か月の開花参考');
  for(let month=1;month<=12;month++){
    months.append(button(String(month),()=>{
      doc.view.month=month;if(preview)preview.view.month=month;calendarMonth=null;syncView();
      const phase=sourceMonthPhase(info,month,sourcePlantView(target,kind));
      message(`${info.label}・${month}月：${phase.label}`);
    }));
  }
  box.append(months);updateSourceMonth(box);
  box.append(el('p',info.form==='unmodeled'?'外観は未対応です。配置すると寸法の枠を表示します。':'資料で分かる特徴を描いた参考3Dです。未確認の細部・月には共通の近似が残ります。全品種の実物同等の再現は未完成です。','hint'));
  for(const [url,title] of [[info.source,info.publisher||'植物情報の出典'],[info.growthSource,'RHS 成株到達の資料'],[tree?.source,'樹形・葉の資料']])if(url){const a=el('a',title+' ↗');a.href=url;a.target='_blank';a.rel='noopener noreferrer';box.append(a,el('br'));}
  for(const source of appearance?.sources||[])if(![info.source,tree?.source].includes(source.url)){
   const a=el('a',`形態・季節の出典（${source.scope==='catalog-entry'?'収録植物':source.scope==='species'?'種の資料':source.scope==='tribe'?'族の参考資料':source.scope==='family'?'科の参考資料':'属の参考資料'}） ↗`);a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';box.append(a,el('br'));
  }
  if(info.source)box.append(el('p',`資料確認 ${info.sourceChecked||CATALOG_VERSION.slice(0,10)}。花期は資料の地域と栽培条件による目安です。`,'hint'));
  else box.append(el('p','名称を収録済み。植物属性は公開資料で確認するまで空欄にしています。','hint'));
}
const searchPlants=createCatalogSearch(CATALOG);
let catalogIndex=0;
function chooseKind(kind,bringCanvasIntoView=true){
 const info=plantInfo(kind);resetMode();sourceCard('catalog-info',kind);$('catalog-info').closest('details').open=true;
 if(info.appearance?.collection){message(info.appearance.components?'セットに含まれる植物を選んでください。':'この混合種の構成植物は未確認です。名前は一覧に残しています。');return;}
 addKind=kind;setMode('add');
 if(bringCanvasIntoView&&mode==='add')focusCanvas();
 message(info.form==='unmodeled'?'庭をクリックすると寸法枠を配置します。植物の外観は未対応です。':'庭をクリックして参考モデルを配置できます。');
}
function drawCatalog(){
  const genre=$('catalog-filter').value,results=searchPlants({query:$('catalog-search').value,genre,color:$('catalog-color').value,status:$('catalog-status').value,popular:$('catalog-popular').checked,habit:$('catalog-habit').value,dryGarden:$('catalog-dry-garden').checked}),page=catalogPage(results,catalogIndex);catalogIndex=page.index;
  $('dry-garden-guide').hidden=!$('catalog-dry-garden').checked;
  $('catalog-count').textContent=`${page.total.toLocaleString('ja-JP')}件${page.total?' ・ '+(page.index*24+1)+'〜'+Math.min(page.total,(page.index+1)*24):''}`;
  $('catalog-page').textContent=`${page.index+1} / ${page.pages}`;$('catalog-prev').disabled=page.index===0;$('catalog-next').disabled=page.index===page.pages-1;$('rose-guide').hidden=genre!=='バラ';
  $('catalog').replaceChildren(...page.entries.map(([k,v])=>{const b=button('',()=>chooseKind(k));b.dataset.kind=k;b.dataset.form=v.form;const swatch=el('span',undefined,'swatch');swatch.dataset.color=(v.colors||['unknown'])[0];b.append(swatch,el('strong',v.label),el('small',`${v.genre} · ${v.appearance?.collection?(v.appearance.components?'中の植物を選ぶ':'混合種・構成未確認'):treeProfile(v)?HABITS[treeProfile(v).habit]:v.form==='unmodeled'?'寸法枠':'参考3D'}`));return b;}));
  if(!page.total)$('catalog').append(el('p','該当する植物がありません。検索語や絞り込みを変えてください。','hint'));setMode(mode);
}
function drawReplacement(){
  const plant=selectedPlant(),control=$('replacement'),search=$('replacement-search');
  const kind=plant&&Object.hasOwn(CATALOG,plant.kind)?plant.kind:'salvia';
  const scope=JSON.stringify([shown().active,plant?.id,kind]);
  const previous=control.dataset.scope===scope?control.value:kind;
  if(control.dataset.scope===scope&&control.dataset.query===search.value)return;
  control.dataset.scope=scope;
  control.dataset.query=search.value;
  const results=searchPlants({query:search.value});
  const matches=results.filter(([,info])=>!info.appearance?.collection),items=matches.slice(0,40);
  if(!items.some(([key])=>key===kind))items.unshift([kind,CATALOG[kind]]);
  options('replacement',items.map(([key,info])=>[key,info.label]));
  control.value=items.some(([key])=>key===previous)?previous:kind;
  const collections=results.length-matches.length;
  $('replacement-count').textContent=`${matches.length}件${matches.length>40?'。先頭40件を表示。名前で絞り込めます。':''}${collections?' セット・混合種は「植える」で構成植物を確認できます。':''}`;
}

function historyEntry(restoreView){
  const document=clone(doc);
  if(!restoreView)return {document};
  const camera=engine?.capture();
  document.view.camera=validSavedCamera(camera)?camera:null;
  return {document,context:{selected,calendarMonth}};
}
function checkpoint(restoreView=false){
  history.push(historyEntry(restoreView));
  if(history.length>40)history.shift();
  future=[];
}
function restoreEdit(from,to){
  if(!from.length||preview)return false;
  const {document,context}=from.pop();
  to.push(historyEntry(!!context));
  if(context){
    selected=context.selected;
    calendarMonth=context.calendarMonth;
  }else document.view=doc.view;
  doc=document;
  resetMode();
  sync();
  if(context){
    if(doc.view.camera)engine?.restore(doc.view.camera);
    else engine?.view('home');
  }
  return true;
}
function mutate(fn,text,afterCommit,restoreView=false){
  if(preview){
    message('交換プレビューを採用するか、元に戻ってから編集してください。');
    return false;
  }
  let checked;
  try{
    const next=clone(doc);
    fn(currentPlan(next),next);
    checked=validateDocument(next);
  }catch(e){
    message(e.message||'入力を確認してください。庭は変更していません。');
    return false;
  }
  checkpoint(restoreView);
  doc=checked;
  resetMode();
  afterCommit?.();
  sync();
  message(text);
  return true;
}
function withPlant(fn,text,allowLocked=false){return mutate(p=>{const target=p.plants.find(p=>p.id===selected);if(!target)throw new Error('先に植物を選んでください。');if(target.locked&&!allowLocked)throw new Error('固定を解除してから編集してください。');fn(target,p);},text);}
const isDrawing=value=>['outline','zone','circle'].includes(value);
const isPlacement=value=>['add','move','clone'].includes(value);
function setMode(value){if(preview&&value!=='orbit'){message('交換プレビューを採用するか、元に戻ってください。');return;}
  if(isDrawing(mode)&&mode!==value){
    draft=[];updateDraft();drawingTrigger=null;
    if(mode==='outline')syncGardenShape();
  }
  if(mode==='clone'&&value!=='clone')copyPlant=null;
  mode=value;
  const drawing=isDrawing(value);
  $('outline-tools').hidden=!drawing;
  $('cancel-placement').hidden=!isPlacement(value);
  for(const id of ['view-home','view-top','view-eye','focus-flower'])$(id).disabled=drawing;
  syncPlantFocusAvailability();
  engine?.editing(drawing);
  engine?.selecting(value==='orbit');
  $('orbit').setAttribute('aria-pressed',String(value==='orbit'));$('viewport').dataset.mode=value;
  const statuses={orbit:`案 ${shown().active} · 3Dの参考表現`,add:`${plantInfo(addKind).label}を置く場所をクリック`,move:'移動先をクリック',clone:'複製する場所をクリック',outline:'庭の外周の角を順番にクリック',zone:'区画の角を順番にクリック',circle:'中心 → 半径の順に2点クリック'};
  $('view-status').textContent=statuses[value];
  syncPlacementButtons();
}
function syncPlacementButtons(){
  const locked=!!selectedPlant()?.locked;
  $('candidate-lock-note').hidden=!locked||!!preview;
  for(const id of ['catalog','candidates']){
    for(const control of $(id).querySelectorAll('button[data-kind]')){
      control.setAttribute('aria-pressed',String(mode==='add'&&control.dataset.kind===addKind));
      if(id==='candidates')control.disabled=locked||!!preview;
    }
  }
}
function focusCanvas(){
  const canvas=$('viewport');
  canvas.scrollIntoView({block:'nearest'});
  canvas.focus({preventScroll:true});
}
function startPlacement(value){
  setMode(value);
  if(mode===value)focusCanvas();
}
function resetMode(){setMode('orbit');}
function select(id){selected=id;setMode('orbit');editor('plant-panel');syncSelection();syncPlantState();syncSceneSelection();if(selectedPlant())message(`${plantInfo(selectedPlant().kind).label}を選びました。`);}
function metrics(target,items){$(target).replaceChildren(...items.map(([value,label])=>{const d=el('div',undefined,'metric');d.append(el('strong',value),el('span',label));return d;}));}
function table(headers,rows){const t=el('table'),head=el('thead'),tr=el('tr');headers.forEach(h=>tr.append(el('th',h)));head.append(tr);const body=el('tbody');rows.forEach(row=>{const r=el('tr');row.forEach(c=>r.append(el('td',c)));body.append(r);});t.append(head,body);return t;}
function itemRow(text,remove){const row=el('div',undefined,'item-row');row.append(el('span',text),button('削除',remove));return row;}
function syncSelected(){const p=selectedPlant();$('no-selection').hidden=!!p;$('selected-fields').hidden=!p;if(!p)return;const info=plantInfo(p.kind),limits=plantSizeLimits(p.kind);$('selected-name').textContent=`#${p.id} ${info.label}`;$('focus-flower').textContent=info.appearance?.shootProfile==='purpleMajesty'?'穂を観察':'花を観察';$('focus-flower').title=info.appearance?.shootProfile==='purpleMajesty'?'風を止めて穂へ寄ります':'風を止めて花へ寄ります';$('lock').textContent=p.locked?'固定を解除':'固定する';$('lock').setAttribute('aria-pressed',String(p.locked));
  for(const id of [
    'move','remove','height','spread','leaf-height','price','plant-x','plant-z','start-year','start-month',
    'role','apply-plant','replacement-search','replacement','preview-replace',
    'scenario-year','future-height','future-spread','future-leaf','apply-scenario','clear-scenario',
    'target-height','target-spread','prune-method','recovery','apply-management','clear-management',
  ])$(id).disabled=p.locked;
  for(const id of ['height','future-height','target-height']){$(id).min=String(limits.minHeight);$(id).step=String(limits.step);}
  for(const id of ['leaf-height','future-leaf']){$(id).min=String(limits.minLeafHeight);$(id).step=String(limits.step);}
  for(const [id,value] of Object.entries({height:p.height,spread:p.spread,'leaf-height':p.leafHeight,price:p.price,'plant-x':p.x,'plant-z':p.z,'start-year':Math.floor(p.start/12),'start-month':p.start%12+1,role:p.role,'scenario-year':p.scenario?.year||3,'future-height':p.scenario?.height??p.height,'future-spread':p.scenario?.spread??p.spread,'future-leaf':p.scenario?.leafHeight??p.leafHeight,'target-height':p.management?.height??p.height,'target-spread':p.management?.spread??p.spread,'prune-method':p.management?.method||'thin',recovery:p.management?.recovery||6}))$(id).value=value??'';
  delete $('price').dataset.edited;
  drawReplacement();$('care-advice').textContent=info.care;
  $('plant-tasks').replaceChildren(...p.tasks.map(t=>itemRow(`${t.month}月 ${TASKS[t.type]} ×${t.count} ／ ${t.repeat==='first'?'初年度':'毎年'} ／ ${t.min===null?'時間未入力':time(t.min,t.max)}`,()=>withPlant(p=>{p.tasks=p.tasks.filter(x=>x.id!==t.id);},'手入れ予定を削除しました。',true))));sourceCard('selected-source',p.kind);
}
function gardenShape({width,depth,outline}){
  const saved=JSON.stringify(outline);
  return ['rectangle','lshape'].find(kind=>JSON.stringify(outlineFor(kind,width,depth))===saved)||'custom';
}
function syncGardenShape(){
  $('shape').value=gardenShape(plan());
}
function syncGarden(){const p=plan();for(const id of ['width','depth','sun','moisture','prep'])$(id).value=p[id];syncGardenShape();p.hours.forEach((h,i)=>$(`hours-${i}`).value=h??'');
  $('zone-list').replaceChildren(...p.zones.map((z,i)=>{const row=itemRow(`${z.kind==='water'?'水面':'花壇'} ${i+1} · ${area(z.points).toFixed(1)}m²`,()=>mutate(p=>p.zones.splice(i,1),'区画を取り除きました。植物は残ります。'));const type=el('select');type.setAttribute('aria-label',`区画${i+1}の種類`);for(const [v,label] of [['soil','花壇'],['water','池・水面']]){const option=el('option',label);option.value=v;type.append(option);}type.value=z.kind||'soil';type.addEventListener('change',()=>{const value=type.value;mutate(p=>{p.zones[i].kind=value;if(value!=='water')delete p.zones[i].depth;},'区画の種類を変更しました。');});row.append(type);if(z.kind==='water'){const label=el('label','水深 (m)'),input=el('input');input.type='number';input.min='0';input.max='2';input.step='.05';input.value=String(z.depth??0);input.setAttribute('aria-label',`水面${i+1}の水深`);const applyDepth=()=>{const depth=Number(input.value);if(input.value.trim()===''||!Number.isFinite(depth)||depth<0||depth>2){message('水深は0〜2mで入力してください。');input.value=String(plan().zones[i].depth??0);return;}mutate(p=>{p.zones[i].depth=depth;},'池の水深を変更しました。');};const apply=button('水深を反映',applyDepth);apply.setAttribute('aria-label',`水面${i+1}の水深を反映`);input.addEventListener('keydown',e=>{if(e.key==='Enter')applyDepth();});label.append(input);row.append(label,apply);}return row;}));
  $('obstacle-list').replaceChildren(...p.obstacles.map((o,i)=>itemRow(`${{house:'建物',path:'通路',fence:'塀'}[o.type]} ${i+1} · ${o.width.toFixed(1)} × ${o.depth.toFixed(1)}m`,()=>mutate(p=>p.obstacles.splice(i,1),'外構を取り除きました。'))));
}
function syncBudget(){const b=budget(plan());metrics('budget-summary',[[yen(b.total),'入力済み価格の小計'],[`${b.unknown}株`,'価格未入力'],[`${b.count}株`,'新規購入する株']]);$('budget-table').replaceChildren(table(['植物・初期サイズ','株数','単価','金額'],b.rows.map(r=>[`${plantInfo(r.kind).label} (${r.height}m × ${r.spread}m)`,r.count,r.price===null?'未入力':yen(r.price),r.price===null?'未確定':yen(r.total)])));}
let calendarDisplay=null;
function syncCalendar(){
  const garden=plan(),year=shown().view.year;
  const selectedMonth=calendarMonth??shown().view.month;
  const redraw=calendarDisplay?.garden!==garden||calendarDisplay.year!==year;
  const months=redraw?calendar(garden,year):calendarDisplay.months;
  const grid=$('calendar');
  if(redraw){
    const total={min:0,max:0,unknown:0,count:0};
    let pruneCount=0;
    for(const m of months){
      total.min+=m.min;
      total.max+=m.max;
      total.unknown+=m.unknown;
      for(const event of m.events){
        total.count+=event.count;
        if(event.type==='prune'||event.type==='cutback')pruneCount++;
      }
      const control=grid.children[m.month-1]??grid.appendChild(button('',()=>{calendarMonth=m.month;syncCalendar();}));
      control.replaceChildren(el('strong',`${m.month}月`),el('span',m.events.length?`${m.events.length}件 · ${time(m.min,m.max)}`:'予定未登録'));
      if(m.unknown)control.append(el('br'),el('span',`時間未入力 ${m.unknown}件`));
      const over=m.available!==null&&m.max>m.available;
      if(m.available!==null){
        const estimate=m.min>m.available?' · 超過':over?' · 超過の可能性':m.unknown?' · 判定未確定':'';
        control.append(el('br'),el('span',`使える ${round(m.available)}分${estimate}`));
      }
      control.classList.toggle('over',over);
    }
    $('care-summary').textContent=`計画開始から ${year}年の予定：${total.count}回。入力済み時間 ${time(total.min,total.max)} / 年${total.unknown?` ＋ 時間未入力 ${total.unknown}件（合計未確定）`:''}。うち剪定・切り戻し ${pruneCount}件。`;
  }
  if(!redraw&&calendarDisplay.selectedMonth===selectedMonth)return;
  for(const [index,control] of Array.from(grid.children).entries()){
    control.setAttribute('aria-pressed',String(index+1===selectedMonth));
  }
  const m=months[selectedMonth-1];
  $('month-tasks').replaceChildren(el('strong',`${selectedMonth}月の予定`),...m.events.map(event=>{
    const item=el('p',`#${event.plantId} ${plantInfo(event.kind).label}：${TASKS[event.type]} ×${event.count} ／ ${event.min===null?'時間未入力':time(event.min*event.count,event.max*event.count)}`);
    item.append(document.createTextNode(' '),button('植物を調整',()=>{select(event.plantId);$('selected-name').focus();}));
    return item;
  }));
  if(!m.events.length)$('month-tasks').append(el('p','植物を選び、「手入れ予定」から追加できます。','hint'));
  calendarDisplay={garden,year,months,selectedMonth};
}
function syncIdeas(){const p=plan(),o=observations(p,shown().view);metrics('observations',[[`${o.visible}株`,'この時点に植わっている株'],[`${o.overlap}組`,'株幅・樹冠の重なり'],[`${o.outside}株`,'外周・外構への張り出し']]);
  const flowers=[...new Set(p.plants.filter(plant=>{const s=stateAt(plant,{...shown().view,waterDepth:pondDepthAt(p,plant.x,plant.z)});return s.present&&s.bloom;}).map(p=>plantInfo(p.kind).label))];$('season-story').textContent=`${shown().view.month}月の開花参考：${flowers.join('、')||'カタログ上の開花表示はありません。枝・葉・枯れ穂も見どころです'}。重なりは平面の幅の参考で、根の競合や栽培可否の判定ではありません。`;
  const candidates=$('candidates'),conditions=JSON.stringify([p.sun,p.moisture]);
  if(candidates.dataset.conditions!==conditions){
    candidates.dataset.conditions=conditions;
    const choices=Object.entries(CATALOG).filter(([,info])=>
      !info.appearance?.collection&&info.sun.includes(p.sun)&&info.moisture.includes(p.moisture)).slice(0,6);
    candidates.replaceChildren(...choices.map(([kind,info])=>{
      const control=button(`${info.label} · ${info.season}`,event=>{
        if(selectedPlant())previewReplacement(kind,event.currentTarget);
        else chooseKind(kind,false);
      });
      control.dataset.kind=kind;
      return control;
    }));
    if(!choices.length)candidates.append(el('p','このカタログでは条件に一致する候補が見つかりません。条件を緩めず、植物の追加収録をお待ちください。','hint'));
  }
  syncPlacementButtons();
  $('time-basis').textContent=shown().view.reference?'資料の成株上限寸法を表示中。指定年の予測ではありません。剪定シナリオは適用しません。通常表示に戻すと元の年数・設定へ戻ります。':`年数と季節は別々に指定できます。成長シナリオ未設定 ${o.unmodeled}株は初期寸法のまま。花期・落葉・葉量は地域差のある参考表現です。`;
}
let comparisonPlans=null,comparisonYear=null;
function syncComparison(){
  const d=shown(),{A,B}=d.plans,year=d.view.year;
  if(comparisonPlans?.A===A&&comparisonPlans?.B===B&&comparisonYear===year)return;
  comparisonPlans=d.plans;
  comparisonYear=year;
  const panel=$('comparison');
  if(!B){
    panel.replaceChildren(el('p','「Bに複製」で現在の庭を残して、別案をつくれます。'));
    return;
  }
  const totals={A:budget(A),B:budget(B)};
  const rows=['A','B'].map(key=>{
    const garden=d.plans[key];
    const cost=totals[key],months=calendar(garden,year);
    const totalsForYear={count:0,min:0,max:0,unknown:false};
    for(const month of months){
      for(const event of month.events)totalsForYear.count+=event.count;
      totalsForYear.min+=month.min;
      totalsForYear.max+=month.max;
      totalsForYear.unknown||=month.unknown>0;
    }
    return [key,`${garden.plants.length}株`,`${yen(cost.total)}${cost.unknown?` ＋ ${cost.unknown}株未入力`:''}`,
      `${totalsForYear.count}回`,`${time(totalsForYear.min,totalsForYear.max)}${totalsForYear.unknown?' ＋ 未入力あり':''}`];
  });
  panel.replaceChildren(table(['案','全株数','購入費','年間作業','年間時間'],rows));
  const a=totals.A,b=totals.B;
  panel.append(el('p',`B − A：株数 ${B.plants.length-A.plants.length}株 ／ 入力済み購入費 ${yen(b.total-a.total)}${a.unknown||b.unknown?'（未入力があるため総額差は未確定）':''}`));
}
function syncPlantButtons(container,plants,describe){
  const focused=container.contains(document.activeElement)?document.activeElement.dataset.plantId:null;
  container.replaceChildren(...plants.map(plant=>{
    const {label,title,selectPlant}=describe(plant);
    const control=button(label,selectPlant);
    control.dataset.plantId=String(plant.id);
    control.setAttribute('aria-pressed',String(plant.id===selected));
    if(title)control.title=title;
    return control;
  }));
  if(focused)container.querySelector(`[data-plant-id="${focused}"]`)?.focus({preventScroll:true});
}
function syncSelection(){const p=plan();
  if(selected&&!p.plants.some(plant=>plant.id===selected))selected=null;
  syncPlantButtons($('specimen-nav'),p.plants.slice(0,16),plant=>{
    const info=plantInfo(plant.kind),tree=treeProfile(info);
    return {label:info.label,title:tree?HABITS[tree.habit]:info.genre,selectPlant:()=>{
      select(plant.id);
      const unavailable=plantFocusUnavailable(plant);
      if(unavailable)message(unavailable);
      else engine?.view('focus');
    }};
  });
  syncPlantButtons($('plant-list'),p.plants,plant=>({
    label:`${plant.locked?'固定 · ':''}#${plant.id} ${plantInfo(plant.kind).label}`,
    selectPlant:()=>select(plant.id),
  }));
  syncSelected();
  syncSpecimenTitles();
}
function sync(){
  const d=shown(),p=plan();
  $('plan-a').setAttribute('aria-pressed',String(d.active==='A'));$('plan-b').setAttribute('aria-pressed',String(d.active==='B'));$('plan-b').disabled=!d.plans.B||!!preview;$('plan-a').disabled=!!preview;$('duplicate-plan').disabled=!!preview||!!doc.plans.B;$('undo').disabled=!history.length||!!preview;$('redo').disabled=!future.length||!!preview;
  $('count').textContent=`${p.plants.length}株`;$('area').textContent=`${area(p.outline).toFixed(1)}m² · ${p.plants.length}株`;
  $('edit-body').inert=!!preview;
  $('preview-bar').hidden=!preview;
  syncSelection();
  syncGarden();
  syncBudget();
  syncView();
  setMode(mode);
}
function syncView(){
  const d=shown();
  for(const key of ['month','year'])$(key).value=d.view[key];
  $('month-label').textContent=`${d.view.month}月`;
  $('year-label').textContent=`${d.view.year}年`;
  $('reference').checked=d.view.reference;
  $('footprints').checked=d.view.footprints;
  syncScene();
  syncPlantState();
  updateSourceMonth($('catalog-info'));
  updateSourceMonth($('selected-source'));
  syncCalendar();
  syncIdeas();
  syncComparison();
}
const unavailablePlantGeometry='この月に観察できる3D形状はありません。';
function plantFocusUnavailable(plant,state=stateAt(plant,shown().view)){
  if(!state.present)return state.expired?'この株の生育期間は終了しました。':'この月はまだ植え付け前です。';
  if(engine&&!engine.hasPlantGeometry(plant.id))return unavailablePlantGeometry;
  return '';
}
function syncPlantFocusAvailability(){
  const plant=selectedPlant();
  $('focus').disabled=isDrawing(mode)||!plant||!!plantFocusUnavailable(plant);
}
function syncSpecimenTitles(){
  const plants=plan().plants;
  for(const button of $('specimen-nav').querySelectorAll('[data-plant-id]')){
    const specimen=plants.find(p=>String(p.id)===button.dataset.plantId);
    if(!specimen)continue;
    const info=plantInfo(specimen.kind),tree=treeProfile(info);
    button.title=plantFocusUnavailable(specimen)||(tree?HABITS[tree.habit]:info.genre);
  }
}
function syncPlantState(){
  syncPlantFocusAvailability();
  syncSpecimenTitles();
  const plant=selectedPlant();
  if(plant){
    const s=stateAt(plant,shown().view),limits=plantSizeLimits(plant.kind);
    const unavailable=plantFocusUnavailable(plant,s);
    if(unavailable){
      $('plant-state').textContent=!s.present&&s.expired
        ?'この株の参考表示は、生育期間が終わりました。植え直す場合は別の株を追加してください。'
        :unavailable;
      return;
    }
    $('plant-state').textContent=`表示：高さ ${s.height.toFixed(limits.digits)}m・幅 ${s.spread.toFixed(2)}m ／ 植えて ${s.age.toFixed(1)}年。${s.unsupported?'目標が主枝より低いため剪定形状は未対応。':s.last?'最後の剪定・切り戻し：'+Math.floor(s.last.at/12)+'年経過時の '+(s.last.at%12+1)+'月。':''}`;
  }
}
function syncScene(){
  engine?.render(plan(),shown().view,selected);
  syncFlowerControl();
}
function syncSceneSelection(){
  engine?.select(selected);
  syncFlowerControl();
}
function syncFlowerControl(){
  $('focus-flower').hidden=!engine?.hasFlower();
}
function previewReplacement(kind,trigger){
  const plant=selectedPlant();
  if(!plant){message('先に交換したい植物を選んでください。');return;}
  if(preview){message('まず現在のプレビューを採用するか、元に戻してください。');return;}
  if(plant.kind===kind){message('交換先に別の植物を選んでください。');return;}
  try{
    const next=clone(doc),target=currentPlan(next);
    const index=target.plants.findIndex(candidate=>candidate.id===plant.id);
    target.plants[index]=replacePlant(plant,kind);
    preview=validateDocument(next);
    previewTrigger=trigger;
    previewKind=kind;
    resetMode();
    const before=budget(currentPlan(doc)),after=budget(target);
    $('preview-title').textContent=`${plantInfo(plant.kind).label} → ${plantInfo(kind).label}`;
    $('preview-diff').textContent=`同じ位置・植える日で比較。入力済み購入費差 ${yen(after.total-before.total)}、価格未入力 ${after.unknown}株。旧植物の手入れ予定は引き継ぎません。`;
    sync();
    $('cancel-preview').focus();
    message('交換をプレビューしています。採用するまで元の案は変更されません。');
  }catch(error){
    preview=null;
    previewTrigger=null;
    previewKind=null;
    message(error.message);
  }
}
function finishReplacement(accept){
  if(!preview)return;
  if(accept){
    checkpoint();
    doc=validateDocument(preview);
  }
  preview=null;
  resetMode();
  sync();
  const replacement=$('replacement');
  if(!accept&&previewTrigger===$('preview-replace')&&Array.from(replacement.options).some(option=>option.value===previewKind)){
    replacement.value=previewKind;
  }
  if(previewTrigger?.isConnected&&!previewTrigger.disabled)previewTrigger.focus();
  else $('viewport').focus();
  previewTrigger=null;
  previewKind=null;
  message(accept?'交換を採用しました。価格や手入れは新しい植物に合わせて設定できます。':'交換を取り消し、元の案へ戻りました。');
}
function startDrawing(value,trigger){
  if(preview)return;
  resetMode();
  drawingTrigger=trigger;
  setMode(value);
  updateDraft();
  engine?.view('top');
  $('outline-tools').scrollIntoView({block:'nearest'});
  focusCanvas();
  message(value==='circle'?'中心と円周の2点をクリックしてください。':'真上の庭で角を順にクリックし、「形を確定」を押します。');
}
function updateDraft(){
  engine?.drawDraft(draft);
  const lengths=draft.slice(1).map((point,index)=>Math.hypot(point[0]-draft[index][0],point[1]-draft[index][1]).toFixed(1));
  $('outline-count').textContent=`${draft.length}点${lengths.length?' · 辺 '+lengths.join(' / ')+'m':''}`;
  $('undo-point').disabled=draft.length===0;
}
function cancelDrawing(){
  const trigger=drawingTrigger;
  resetMode();
  trigger?.focus();
  message('形の編集を取り消しました。');
}
function checkBoundary(p,points){if(p.plants.some(p=>!inside(p.x,p.z,points))||p.zones.some(z=>!contained(z.points,points))||p.obstacles.some(o=>!contained(obstaclePoints(o),points)))throw new Error('新しい外周から植物・花壇・外構がはみ出します。先に移すか取り除いてください。');}
function finishDrawing(){const type=mode,trigger=drawingTrigger;if(!isDrawing(type))return;let points=clone(draft);if(type==='circle'){if(points.length!==2){message('円は中心と円周の2点を選んでください。');return;}points=circleZonePoints(...points);}const garden=plan();if(!validOutline(points,garden.width,garden.depth,type==='outline'?1:.04)){message('庭の寸法内で交差しない形を囲んでください。外周は1m²以上、区画は0.04m²以上です。');return;}const committed=mutate(p=>{if(type==='outline'){checkBoundary(p,points);p.outline=points;}else{if(p.zones.length>=12)throw new Error('花壇と水面は合わせて12区画までです。');p.zones.push({points,kind:$('zone-kind').value,...($('zone-kind').value==='water'?{depth:.3}:{})});}},type==='outline'?'庭の輪郭を変更しました。':'区画を追加しました。');if(committed)trigger?.focus();}
function pick(point){if(preview){if(point.id)select(point.id);return;}if(isDrawing(mode)){if(point.x<0||point.z<0||point.x>plan().width||point.z>plan().depth){message('庭の幅・奥行きの範囲内を選んでください。');return;}if(draft.length>=(mode==='circle'?2:32)){message('「形を確定」を押してください。');return;}draft.push([point.x,point.z]);updateDraft();return;}
  if(isPlacement(mode)){
    if(!canPlant(plan(),point.x,point.z)){
      message('庭の輪郭の内側で、建物・通路・塀のない場所を選んでください。');
      return;
    }
    if(mode==='move'){
      withPlant(p=>{p.x=point.x;p.z=point.z;},'植物を移動しました。');
      return;
    }
    const action=mode,source=copyPlant;
    let created;
    mutate(p=>{
      if(p.plants.length>=100)throw new Error('1案につき100株までです。');
      created=nextId(p.plants);
      p.plants.push(action==='clone'
        ?{...clone(source),id:created,x:point.x,z:point.z,locked:false}
        :makePlant(addKind,created,point.x,point.z));
    },action==='clone'?'同じ設定で植物を複製しました。':'植物を配置しました。初期サイズと植える日を調整できます。',()=>{
      selected=created;
      if(action==='add')setMode('add');
    });
    return;
  }
  if(point.id)select(point.id);else{selected=null;syncSelection();syncSceneSelection();}
}
function bind(){
  for(const b of document.querySelectorAll('[data-editor]'))b.addEventListener('click',()=>editor(b.dataset.editor));for(const b of document.querySelectorAll('[data-insight]'))b.addEventListener('click',()=>insight(b.dataset.insight));
  drawReplacement();$('replacement-search').addEventListener('input',()=>drawReplacement());for(const id of ['start-month','task-month'])options(id,Array.from({length:12},(_,i)=>[i+1,`${i+1}月`]));for(const id of ['start-year','scenario-year'])options(id,Array.from({length:id==='start-year'?11:10},(_,i)=>[i+(id==='start-year'?0:1),`${i+(id==='start-year'?0:1)}年`]));options('task-type',Object.entries(TASKS));$('task-month').value=6;
  for(let i=0;i<12;i++){const label=el('label',`${i+1}月 (時間)`),input=el('input');input.id=`hours-${i}`;input.type='number';input.min=0;input.max=744;input.step=.25;input.placeholder='未設定';label.append(input);$('hours-inputs').append(label);}
  const values=Object.values(CATALOG),collections=values.filter(p=>p.appearance?.collection).length,modeled=values.filter(p=>p.form!=='unmodeled').length;$('catalog-coverage').textContent=`外観の参考表示 ${modeled.toLocaleString('ja-JP')}件 ／ 外観未対応 ${(values.length-modeled-collections).toLocaleString('ja-JP')}件 ／ セット・混合種 ${collections}件。未対応の植物は寸法枠で配置できます。`;
  $('catalog-total').textContent=`${Object.keys(CATALOG).length.toLocaleString('ja-JP')}件`;
  options('catalog-filter',[['all','10ジャンルすべて'],...GENRES.map(g=>[g,`${g} (${Object.values(CATALOG).filter(p=>p.genre===g).length})`])]);options('catalog-color',[['all','花色すべて'],...Object.entries(COLORS)]);
  options('catalog-habit',[['all','樹形すべて'],...Object.entries(HABITS)]);
  function openGallery(build,text){
    const committed=mutate((p,d)=>Object.assign(d,build()),text,()=>{
      selected=null;
      calendarMonth=null;
    },true);
    if(committed){
      engine?.view('home');
      if(matchMedia('(max-width:760px)').matches)$('viewport').scrollIntoView({block:'center'});
    }
  }
  $('tree-gallery').addEventListener('click',()=>openGallery(treeGalleryDocument,
    '樹形の見本を開きました。月を変えると年間の姿を比較できます。「戻す」で元の庭へ戻れます。'));
  $('annual-gallery').addEventListener('click',()=>openGallery(annualGalleryDocument,
    '冬の休眠と常緑の違い、葉の模様と花の形を見比べる庭です。月を変えて確認できます。「戻す」で元の庭へ戻れます。'));
  for(const id of ['catalog-filter','catalog-color','catalog-status','catalog-popular','catalog-habit','catalog-dry-garden'])$(id).addEventListener('change',()=>{catalogIndex=0;drawCatalog();});$('catalog-search').addEventListener('input',()=>{catalogIndex=0;drawCatalog();});
  $('catalog-prev').addEventListener('click',()=>{catalogIndex--;drawCatalog();});$('catalog-next').addEventListener('click',()=>{catalogIndex++;drawCatalog();});drawCatalog();sourceCard('catalog-info','salvia');
  $('orbit').addEventListener('click',()=>{resetMode();message('ドラッグで回転。植物をクリックすると選べます。');});for(const type of ['home','top','eye'])$(`view-${type}`).addEventListener('click',()=>engine?.view(type));$('focus').addEventListener('click',()=>{engine?.view('focus');if(matchMedia('(max-width:760px)').matches)$('viewport').scrollIntoView({block:'center'});});$('focus-flower').addEventListener('click',()=>{const organ=$('focus-flower').textContent==='穂を観察'?'穂':'花';if(!engine?.view('flower')){message(`この月は観察できる${organ}がありません。`);return;}$('wind-select').value='0';engine.wind(0);if(matchMedia('(max-width:760px)').matches)$('viewport').scrollIntoView({block:'center'});message(`${organ}へ寄って風を止めました。ドラッグで角度を変えられます。`);});$('zoom-in').addEventListener('click',()=>engine?.zoom(.8));$('zoom-out').addEventListener('click',()=>engine?.zoom(1.25));
  $('footprints').addEventListener('change',()=>{
    const enabled=$('footprints').checked;
    doc.view.footprints=enabled;
    if(preview)preview.view.footprints=enabled;
    engine?.footprints(enabled);
  });
  for(const key of ['month','year','reference'])$(key).addEventListener(['month','year'].includes(key)?'input':'change',()=>{const value=['month','year'].includes(key)?number(key):$(key).checked;doc.view[key]=value;if(preview)preview.view[key]=value;if(key==='month')calendarMonth=null;syncView();if(key==='reference'&&!isDrawing(mode))engine?.view('home');});
  for(const name of ['A','B'])$(`plan-${name.toLowerCase()}`).addEventListener('click',()=>{if(preview||!doc.plans[name])return;doc.active=name;selected=null;resetMode();sync();message(`案 ${name}に切り替えました。視点と時間は同じです。`);});
  $('duplicate-plan').addEventListener('click',()=>mutate((p,d)=>{if(d.plans.B)throw new Error('案Bはすでにあります。');d.plans.B=clone(p);d.active='B';},'案Aを残し、案Bを作りました。Bを編集して比べられます。'));
  $('undo').addEventListener('click',()=>{if(restoreEdit(history,future))message('編集を1つ戻しました。');});
  $('redo').addEventListener('click',()=>{if(restoreEdit(future,history))message('編集をやり直しました。');});
  $('lock').addEventListener('click',()=>withPlant(p=>{p.locked=!p.locked;},'植物の固定を変更しました。固定中は配置・種類・寸法を変更できません。',true));$('move').addEventListener('click',()=>{if(selectedPlant()?.locked){message('固定を解除してから移動してください。');return;}startPlacement('move');message('庭の移動先をクリックしてください。');});$('clone-plant').addEventListener('click',()=>{copyPlant=clone(selectedPlant());startPlacement('clone');message('複製する場所を庭でクリックしてください。');});$('remove').addEventListener('click',()=>withPlant((p,g)=>{g.plants=g.plants.filter(v=>v.id!==p.id);},'植物を取り除きました。「戻す」で復元できます。'));
  $('price').addEventListener('input',()=>{$('price').dataset.edited='true';});
  $('apply-plant').addEventListener('click',()=>{
    const price=optional('price'),priceEdited=$('price').dataset.edited==='true';
    let resized=false;
    const ok=withPlant(p=>{
      const h=number('height'),w=number('spread'),lh=number('leaf-height'),limits=plantSizeLimits(p.kind);
      const x=number('plant-x'),z=number('plant-z');
      if(!(h>=limits.minHeight&&h<=60&&w>=.1&&w<=60&&lh>=limits.minLeafHeight&&lh<=h))throw new Error(`高さは${limits.minHeight}〜60m、幅は0.1〜60m、葉高は${limits.minLeafHeight}m以上で高さ以下にしてください。`);
      if(!canPlant(plan(),x,z))throw new Error('庭の中で外構に重ならない位置にしてください。');
      if(price!==null&&(!Number.isInteger(price)||price<0||price>10000000))throw new Error('購入単価は0〜10,000,000円の整数で入力してください。');
      resized=h!==p.height||w!==p.spread||lh!==p.leafHeight;
      Object.assign(p,editSize(p,h,w,lh),{x,z,start:number('start-year')*12+number('start-month')-1,
        role:$('role').value,price:resized&&!priceEdited?null:price});
    },'初期サイズ・配置・購入を更新しました。');
    if(ok&&resized)message(priceEdited&&price!==null
      ?'初期サイズと入力した購入単価を保存しました。成長・剪定の寸法は必要に応じて再入力してください。'
      :'初期サイズを更新しました。購入単価と成長・剪定の寸法は解除したため、必要に応じて再入力してください。');
  });
  $('preview-replace').addEventListener('click',event=>previewReplacement($('replacement').value,event.currentTarget));
  $('cancel-preview').addEventListener('click',()=>finishReplacement(false));
  $('accept-preview').addEventListener('click',()=>finishReplacement(true));
  document.addEventListener('keydown',event=>{
    if(!preview||event.key!=='Escape'||event.defaultPrevented||$('help-dialog').open)return;
    event.preventDefault();
    finishReplacement(false);
  });
  $('apply-scenario').addEventListener('click',()=>withPlant(p=>{if(number('future-height')<p.height||number('future-spread')<p.spread||number('future-leaf')<p.leafHeight)throw new Error('成長後の寸法は初期寸法以上にしてください。小さくする場合は剪定設定を使います。');p.scenario={year:number('scenario-year'),height:number('future-height'),spread:number('future-spread'),leafHeight:number('future-leaf')};},'自分で設定した成長シナリオを反映しました。年数スライダーで確認できます。'));$('clear-scenario').addEventListener('click',()=>withPlant(p=>{p.scenario=null;},'年次成長の仮定を解除しました。'));
  $('apply-management').addEventListener('click',()=>withPlant(p=>{p.management={height:number('target-height'),spread:number('target-spread'),method:$('prune-method').value,recovery:number('recovery')};},'剪定寸法と回復の仮定を設定しました。「手入れ予定」に剪定月を登録すると表示に反映します。'));$('clear-management').addEventListener('click',()=>withPlant(p=>{p.management=null;},'剪定の寸法シナリオを解除しました。予定表の作業は残ります。'));
  const updateTaskCount=()=>{
    const limit=taskCountLimit($('task-type').value),input=$('task-count');
    input.max=limit;input.readOnly=limit===1;
    if(limit===1)input.value=1;
  };
  $('task-type').addEventListener('change',updateTaskCount);
  updateTaskCount();
  $('add-task').addEventListener('click',()=>{
    const type=$('task-type').value,count=number('task-count'),min=optional('task-min'),max=optional('task-max');
    const limit=taskCountLimit(type);
    if(!Number.isInteger(count)||count<1||count>limit){message(`月内の回数は${limit===1?'1回':'1〜31回の整数'}で指定してください。`);return;}
    if(!validTaskMinutes(min,max)){message('作業時間は最短・最長ともに未入力にするか、0〜10000分で最短が最長以下になるよう入力してください。');return;}
    const month=number('task-month'),repeat=$('task-repeat').value;
    withPlant(p=>{
      if(p.tasks.length>=36)throw new Error('1株につき手入れ予定は36件までです。');
      if(p.tasks.some(e=>e.type===type&&e.month===month&&e.repeat===repeat))throw new Error('同じ種類・月・繰り返しの予定が登録済みです。');
      p.tasks.push({id:nextId(p.tasks),type,month,repeat,count,min,max});
      calendarMonth=month;
    },'手入れ予定を追加しました。予定表と3Dが同じ剪定月を参照します。',true);
  });
  $('resize-garden').addEventListener('click',()=>{
    const width=number('width'),depth=number('depth');
    if(!(width>=2&&width<=30&&depth>=2&&depth<=30)){
      message('庭の幅と奥行きはそれぞれ2〜30mで入力してください。');
      return;
    }
    const ok=mutate(p=>{
      if(p.plants.some(plant=>plant.locked))throw new Error('固定された植物があります。寸法変更で配置も伸縮するため、先に固定を解除してください。');
      const rx=width/p.width,rz=depth/p.depth,shape=gardenShape(p);
      p.width=width;
      p.depth=depth;
      const scalePoints=points=>points.map(([x,z])=>[round(x*rx),round(z*rz)]);
      p.outline=shape==='custom'?scalePoints(p.outline):outlineFor(shape,width,depth);
      for(const zone of p.zones)zone.points=scalePoints(zone.points);
      for(const obstacle of p.obstacles){
        obstacle.x=round(obstacle.x*rx);
        obstacle.z=round(obstacle.z*rz);
        obstacle.width=round(obstacle.width*rx);
        obstacle.depth=round(obstacle.depth*rz);
      }
      for(const plant of p.plants){
        plant.x=round(plant.x*rx);
        plant.z=round(plant.z*rz);
      }
    },'庭と配置の平面寸法を伸縮しました。');
    if(ok)engine?.view('home');
  });
  $('shape').addEventListener('change',()=>{
    const shape=$('shape').value;
    if(shape==='custom'){startDrawing('outline',$('shape'));return;}
    const ok=mutate(p=>{
      const outline=outlineFor(shape,p.width,p.depth);
      checkBoundary(p,outline);p.outline=outline;
    },'庭の形を変更しました。');
    if(!ok)syncGardenShape();
  });
  for(const [id,kind] of [['draw-outline','outline'],['draw-zone','zone'],['circle-zone','circle']]){
    $(id).addEventListener('click',event=>startDrawing(kind,event.currentTarget));
  }
  $('finish-outline').addEventListener('click',finishDrawing);
  $('undo-point').addEventListener('click',()=>{draft.pop();updateDraft();});
  $('cancel-outline').addEventListener('click',cancelDrawing);
  $('outline-tools').addEventListener('keydown',event=>{
    if(event.key==='Escape')cancelDrawing();
  });
  $('obstacle-type').addEventListener('change',()=>{$('obstacle-height').value={house:2.5,path:.05,fence:1.5}[$('obstacle-type').value];});$('add-obstacle').addEventListener('click',()=>mutate(p=>{if(p.obstacles.length>=16)throw new Error('外構は16個までです。');const o={type:$('obstacle-type').value};for(const key of ['x','z','width','depth','height'])o[key]=number(`obstacle-${key}`);if(!contained(obstaclePoints(o),p.outline))throw new Error('外構全体が庭の輪郭に収まる位置と寸法にしてください。');if(p.plants.some(p=>inside(p.x,p.z,obstaclePoints(o))))throw new Error('外構の内側に植物があります。先に植物を移動してください。');p.obstacles.push(o);},'外構を配置しました。'));$('apply-conditions').addEventListener('click',()=>mutate(p=>{p.sun=$('sun').value;p.moisture=$('moisture').value;},'植物候補を庭の条件で絞りました。'));$('apply-hours').addEventListener('click',()=>mutate(p=>{p.hours=Array.from({length:12},(_,i)=>optional(`hours-${i}`));p.prep=number('prep');},'月別に使える時間を更新しました。作業予定は維持しています。'));
  $('wind-select').value=matchMedia('(prefers-reduced-motion: reduce)').matches?'0':'1';$('wind-select').addEventListener('change',()=>engine?.wind(number('wind-select')));$('light-select').addEventListener('change',()=>engine?.light($('light-select').value));$('viewport').addEventListener('wind-reduced',()=>{$('wind-select').value='0';});
  $('help').addEventListener('click',()=>$('help-dialog').showModal());$('help-close').addEventListener('click',()=>$('help-dialog').close());$('export').addEventListener('click',()=>{if(preview){message('プレビューを採用するか、元に戻ってから保存してください。');return;}const saved=clone(doc);const camera=engine?.capture()||null;const cameraFits=!camera||validSavedCamera(camera);saved.view.camera=cameraFits?camera:null;const blob=new Blob([JSON.stringify(validateDocument(saved),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download='garden-canvas-plan-v2.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);message(cameraFits?'庭と案・視点・予定を保存ファイルに書き出しました。':'庭と案・予定を保存しました。現在の視点は保存できる範囲外です。開くと全体表示に戻ります。');});$('import').addEventListener('click',()=>{if(preview){message('プレビューを終了してから開いてください。');return;}$('file').click();});$('file').addEventListener('change',async()=>{const f=$('file').files[0];if(!f)return;try{if(f.size>3000000)throw new Error('庭ファイルは3MB以内です。');const input=JSON.parse(await f.text()),next=validateDocument(input);checkpoint(true);doc=next;selected=null;calendarMonth=null;resetMode();sync();if(doc.view.camera)engine?.restore(doc.view.camera);else engine?.view('home');message(input.version===1?'旧版の配置を開きました。種類未指定の植物は実在植物へ交換できます。':'保存した庭・案・視点・予定を開きました。');}catch{message('この庭ファイルは開けません。対応する3MB以内のファイルを選んでください。元の庭は変更していません。');}finally{$('file').value='';}});
  $('cancel-placement').addEventListener('click',()=>{
    resetMode();
    focusCanvas();
    message('配置モードを終了しました。');
  });
  $('viewport').addEventListener('keydown',event=>{
    if(event.key!=='Escape'||preview)return;
    if(isDrawing(mode)){cancelDrawing();return;}
    resetMode();
    message('編集モードを終了しました。');
  });$('viewport').addEventListener('render-failed',()=>{$('error').hidden=false;$('error').textContent='3D表示が停止しました。庭を「保存」してから再読込してください。';});
}
bind();
try{engine=createScene($('viewport'),pick);sync();engine.view('home');$('loading').hidden=true;}catch{$('loading').hidden=true;$('error').hidden=false;$('error').textContent='3D表示を開始できません。WebGL 2対応のブラウザーでお試しください。';sync();}
