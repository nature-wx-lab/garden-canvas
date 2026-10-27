import {treeProfile} from './tree-profiles.js?v=0.9.891';
// Search never discards catalog records; paging only bounds the visible DOM.
export const GENRES=['庭木','宿根草','一年草','カラーリーフ','球根植物','バラ','クリスマスローズ','クレマチス','多肉','水生植物'];
export const COLORS={red:'赤',pink:'ピンク',white:'白',yellow:'黄',orange:'オレンジ・杏',purple:'紫・藤',blue:'青',green:'緑',dark:'黒・褐色',mixed:'複色',unknown:'花色未確認'};
export const normalizeSearch=text=>String(text).normalize('NFKC').toLowerCase().replace(/[\u30a1-\u30f6]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60)).replace(/[\s・：:'‘’"“”()（）\-]/g,'');
export function searchCatalog(catalog,{query='',genre='all',color='all',status='all',popular=false,habit='all',dryGarden=false}={}){
  const words=String(query).trim().split(/\s+/).filter(Boolean).map(normalizeSearch);
  return Object.entries(catalog).filter(([,p])=>
    (!dryGarden||p.gardenUse?.climate==='frost-lowland')&&(!popular||p.popularity?.length>0)&&(habit==='all'||treeProfile(p)?.habit===habit)&&(genre==='all'||p.genre===genre)&&(color==='all'||(p.colors||['unknown']).includes(color))&&
    (status==='all'||(status==='sourced'?!!p.source:!p.source))&&
    words.every(word=>normalizeSearch([p.label,p.latin,...(p.aliases||[])].join(' ')).includes(word)));
}
export function catalogPage(entries,page=0,size=24){
  const pages=Math.max(1,Math.ceil(entries.length/size)),index=Math.max(0,Math.min(pages-1,page));
  return {entries:entries.slice(index*size,(index+1)*size),index,pages,total:entries.length};
}
// Month curves show a temperate-garden reference, not a location-specific phenology forecast.
export function seasonAt(info,month){
 const profile=treeProfile(info),a=info.appearance||{},m=month-1,flowerMonths=a.flowerMonths||(a.flowerSeasons?.includes('earlySpring')?[3,4]:info.bloom);
 let bloom=flowerMonths.includes(month);const known=!!a.flowerMonths||!!a.flowerSeasons||(info.bloomKnown??!!flowerMonths.length);
 const leaf={evergreen:'evergreen',semiEvergreen:'semi',semiDormant:'herb',deciduous:'deciduous',winterDormant:'herb',winterSubmerged:'herb',frostDormantTuber:'herb',seasonalAnnual:'herb',warmSeasonAnnual:'herb'}[a.persistence]||profile?.leaf||info.leaf;
 let density=1,scale=1,autumn=false,phase=leaf==='unknown'?'葉の季節変化は未確認':'葉の展開期';
 const breakMonth=a.emergenceMonths?.[0]||(a.leafFlushAfterFlower&&flowerMonths.length?Math.min(12,Math.max(...flowerMonths)+1):profile?.budbreak||4),fall=profile?.leafFall||12;
 if(a.foliageMonths){
  density=a.foliageMonths.includes(month)?1:0;scale=1;
  phase=density?'資料の葉の展開期':'葉のない時期';
 }else if(a.persistence==='coldLeaflessHelleboreReference'){
  density=[12,1].includes(month)?0:1;scale=1;phase=density===0?'低温管理の落葉参考（暖地では残葉する場合）':'葉のある管理参考（春夏秋の葉量は未校正）';
 }else if(a.persistence==='autumnHellebore'){
  density=[1,1,1,1,1,.50,0,0,0,.25,.70,1][m];scale=month===10?.35:month===11?.75:1;
  phase=density===0?'夏休眠・地上部のない時期':month===10?'10月からの秋の葉出し':month===6?'6〜7月の枯れ込み':'秋〜春の葉';
 }else if(a.persistence==='deciduousHellebore'){
  density=[0,.12,.50,.90,1,1,1,1,1,.80,.25,0][m];scale=month===2?.35:month===3?.65:1;
  phase=density===0?'古葉が枯れた時期（開花と葉の展開は別）':month<=3?'花と前後する新葉の展開（表示目安）':month>=10?'古葉が枯れる時期（表示目安）':'葉のある時期';
 }else if(a.persistence==='frostDormantTuber'){
  // Sources describe frost dieback and spring shoots. These month boundaries
  // are a temperate display convention, not a cultivar-specific emergence date.
  density=[0,0,0,.30,.75,1,1,1,1,1,.70,0][m];scale=month===4?.25:month===5?.65:1;
  phase=density===0?'霜後の地上部休眠（冬期の表示目安）':month<=5?'塊根からの春の芽出し（表示目安）':'霜が来るまでの葉と茎';
 }else if(a.persistence==='caudexSummerRest'){
  density=[1,1,1,.9,.65,.15,0,0,.30,.7,1,1][m];scale=month===9?.5:1;
  phase=density===0?'夏休眠・露出した塊根を残す姿（境界月は表示目安）':'秋〜春のつると葉（夏も葉を保つ株あり）';
 }else if(a.persistence==='caudexWinterRest'){
  density=[0,0,.10,.35,.8,1,1,1,1,.75,.25,0][m];scale=month===3?.35:month===4?.65:1;
  phase=density===0?'保護越冬・幹と枝を残す落葉姿（境界月は表示目安）':'暖期の葉・温度に応じた芽出し（表示目安）';
 }else if(a.persistence==='callaRhizome'){
  density=[0,0,.30,.75,1,1,.25,0,0,.30,.65,.20][m];scale=[0,0,.4,.75,1,1,1,0,0,.4,.7,.5][m];
  phase=density===0?'葉のない時期（夏休み・寒さによる冬の枯れ込み）':month===3||month===10?'根茎からの葉出し（国内栽培例の表示目安）':month===7?'高温期の葉の枯れ込み（表示目安）':'春・秋の葉（保護条件で変化）';
 }else if(a.persistence==='summerFadingCrown'){
  density=[0,0,.35,.8,1,1,.6,.25,0,0,0,0][m];scale=month===3?.5:month===4?.8:1;
  phase=density===0?'根と地表の短い株元で休眠':month>=7?'花後の夏から葉が枯れる時期（表示目安）':'春の葉と初夏の花（表示目安）';
 }else if(a.persistence==='warmSeasonAnnual'){
  density=[0,0,0,.30,.8,1,1,1,1,1,.5,0][m];scale=month===4?.35:month===5?.75:1;phase=density?'暖かい時期の一年草（植付け・霜で変化）':'低温で生育終了する一年草';
 }else if(a.persistence==='coolSeasonAnnual'){
  const first=flowerMonths[0]||5,last=flowerMonths.at(-1)||6;
  density=bloom?1:month>last&&month<10?0:.60;
  scale=bloom?1:month>=10||month<=2?.22:month<first?.50:1;
  phase=bloom?'資料の開花期（地域差のある参考）':density?'秋播き・春植えの若い葉（植え時で変化）':'花後に枯れる一年草';
 }else if(a.persistence==='gardenAnemoneTuber'){
  density=[.75,.95,1,1,.85,.25,0,0,0,.15,.40,.65][m];scale=month===10?.40:month===11?.70:month===12?.80:month===6?.70:1;
  phase=density===0?'塊茎で夏の休眠（温暖地の秋植えの参考）':month===6?'花後に葉が黄変する時期（境界月は目安）':month>=10?'秋植え後の葉出し（植え時・寒さで変化）':'冬〜春に葉を育てる温暖地の参考';
 }else if(a.persistence==='autumnBulb'){
  // Acis flowers before or with its autumn foliage; summer rest is not winter dieback.
  density=[1,1,1,1,.8,.25,0,0,0,.4,1,1][m];scale=month===10?.65:1;
  phase=density===0?'夏の休眠・葉のない時期（表示目安）':month===10?'花とともに葉が出る時期（表示目安）':'秋〜春の葉（表示目安）';
 }else if(a.persistence==='autumnLeafBulb'){
  density=[1,1,1,1,.6,.2,0,0,.3,.7,1,1][m];scale=month===9?.55:1;
  phase=density===0?'球根で夏の休眠':month>=9&&month<=10?'秋の葉出し（資料の地域での参考）':'秋〜春の葉（表示目安）';
 }else if(a.persistence==='lateSpringBulb'){
  // Triteleia foliage overwinters, wanes at flowering, and is absent in summer/autumn.
  density=[1,1,1,1,.8,.4,0,0,0,0,0,.5][m];scale=month===12?.65:1;
  phase=density===0?'球根で夏秋の休眠':month>=5&&month<=6?'花期に葉が黄変する時期':'冬〜春の葉（表示目安）';
 }else if(a.persistence==='narcissusBulb'){
  // Source-backed spring flowering and post-flower senescence; precise shoot
  // dates are a temperate display convention, not cultivar observations.
  density=[.4,.75,1,1,1,.25,0,0,0,0,0,.15][m];scale=month===12?.25:month===1?.45:month===2?.75:1;
  phase=density===0?'球根で夏秋の休眠（表示目安）':month===6?'花後の葉が黄変する時期（表示目安）':month===12||month<=2?'冬〜早春の葉出し（地域・植え時で変化）':'春の葉と花';
 }else if(a.persistence==='winterLeafIris'){
  density=[.8,1,1,1,1,.25,0,0,0,0,0,.35][m];scale=month===12?.4:month===1?.7:1;
  phase=density===0?'地下の貯蔵器官で夏秋の休眠':month<=2||month===12?'冬の葉出し（表示上の目安）':'春の葉・初夏の黄変（表示上の目安）';
 }else if(a.persistence==='floweringLeafBulb'){
  // Ornithogalum pyrenaicum loses foliage during flowering, not two months later.
  // Domestic source gives a season, so boundary months remain display conventions.
  const first=flowerMonths[0]||4,last=flowerMonths.at(-1)||5;
  density=month<Math.max(1,first-2)||month>last?0:month===first-2?.35:month===first?.45:month===last?0:1;
  scale=month===first-2?.4:1;phase=density===0?'球根で休眠（境界月は表示目安）':month>=first?'開花中に葉が枯れる時期（表示目安）':'花茎より先に展開する根生葉';
 }else if(a.persistence==='siculumBulb'){
  density=[0,0,.4,1,1,.55,0,0,0,0,0,0][m];scale=month===3?.5:1;
  phase=density===0?'球根で休眠（境界月は表示目安）':month===6?'花後に葉が枯れる時期（表示目安）':'春の根生葉と初夏の花';
 }else if(a.persistence==='springBulb'){
  // Late-winter snowdrops retain their leaves through flowering, then die back.
  // Month boundaries are a temperate display convention; sources describe the cycle.
  const winterMonth=n=>n>8?n-12:n,window=(flowerMonths.length?flowerMonths:[2,3]).map(winterMonth);
  const first=Math.min(...window),last=Math.max(...window),start=first-1,finish=Math.min(6,last+2),position=winterMonth(month);
  density=position<start||position>finish?0:position===start?.55:position===finish?.3:1;
  scale=position===start?.65:1;phase=density===0?'球根で休眠（地上部なし）':position===finish?'花後の葉が黄変する時期':'冬〜春の葉と花（表示目安）';
 }else if(a.persistence==='standingGrass'){
  phase=[12,1,2,10,11].includes(month)?'枯れ葉・穂（刈り戻し前の参考）':month<=4?'新しい葉の展開':'葉と穂の伸長期';
 }else if(leaf==='deciduous'&&!['summerDormant','springEphemeral'].includes(a.persistence)){
  density=month<breakMonth||month>=fall?0:month===breakMonth?.5:month===fall-1?.42:1;
  scale=month===breakMonth?.65:1;autumn=month>=10&&month<fall;
  phase=density===0?'落葉・枝姿':month===breakMonth?'芽吹き・若葉':autumn?'紅葉・落葉へ':'葉が茂る時期';
 }else if(a.persistence==='springEphemeral'){
  density=[0,0,.5,1,1,.3,0,0,0,0,0,0][m];scale=month===3?.6:1;phase=density===0?'地上部がない休眠期':'春の葉と花（表示目安）';
 }else if(['retailTulipCrowns','borderTulipCrowns'].includes(a.architecture)){
  density=[0,.2,1,1,.65,.15,0,0,0,0,0,0][m];scale=month===2?.45:1;
  phase=density===0?'球根で休眠（境界月は表示目安）':month===2?'早春の葉出し（表示目安）':month>=5&&!bloom?'花後に葉を残し黄変へ（表示目安）':'春の葉と花';
 }else if(a.architecture==='camassiaRacemes'){
  density=[0,0,.4,1,1,.75,.15,0,0,0,0,0][m];scale=month===3?.55:1;
  phase=density===0?'球根で休眠（境界月は表示目安）':month===3?'春の葉出し（表示目安）':month>=6?'花後に葉が黄変する時期（表示目安）':'春の根生葉と花';
 }else if(a.architecture==='autumnCyclamenCrowns'){
  const type=a.flowerPalette?.type;density=(type==='confusum'?[1,1,1,1,.55,0,0,0,0,.15,.60,1]:type==='cyprium'?[1,1,1,1,.6,0,0,0,0,.4,.75,1]:[1,1,1,1,.5,0,0,0,0,.6,.8,1])[m];scale=month===10?.65:1;
  phase=density===0?'塊茎で夏の休眠（境界月は表示目安）':month===10?'秋の花と葉出し（表示目安）':month===5?'春の葉の黄変（表示目安）':'秋〜春の葉';
 }else if(a.architecture==='coumCrowns'){
  density=[1,1,1,1,.4,0,0,0,0,.35,.8,1][m];scale=month===10?.55:1;
  phase=density===0?'塊茎で夏の休眠（境界月は表示目安）':month===10?'秋の葉出し（表示目安）':month===5?'春の葉の黄変（表示目安）':'秋〜春の丸い葉';
 }else if(a.persistence==='summerDormant'||info.form==='cyclamen'){
  density=[1,1,1,.9,.6,.1,0,0,.25,.7,1,1][m];phase=density<.15?'夏の休眠期':'葉のある時期';
 }else if(['tulip','narcissus','globe'].includes(info.form)&&info.genre==='球根植物'){
  const last=flowerMonths.length?Math.max(...flowerMonths):5;
  density=month>=Math.max(1,(flowerMonths[0]||4)-2)&&month<=last+1?(month===last+1?.4:1):0;scale=month===(flowerMonths[0]||4)-2?.4:1;phase=density===0?'地中で休眠':month===last+1?'葉が黄変する時期':'葉の展開期';
 }else if(a.persistence==='semiDormant'&&[12,1,2].includes(month)){
  density=.35;scale=.65;phase='冬芽・株元の葉（寒さで変化）';
 }else if(a.architecture==='convallariaClusters'){
  density=[0,0,.35,1,1,1,1,1,1,.7,.2,0][m];scale=month===3?.5:1;
  phase=density===0?'地下茎で越冬（境界月は表示目安）':month>=10?'秋の葉の黄変（表示目安）':month===3?'春の葉出し（表示目安）':'春〜秋に残る葉（表示目安）';
 }else if(leaf==='herb'){
  density=a.dormantMonths?a.dormantMonths.includes(month)?0:1:[0,0,.15,.65,1,1,1,1,1,.75,.25,0][m];scale=month===3?.3:month===4?.7:1;phase=density===0?'地上部の休眠':month<5?'芽出し・葉の展開':month>10?'地上部が枯れる時期':'葉が茂る時期';
 }else if(leaf==='grass'){
  phase=[12,1,2,10,11].includes(month)?'枯れ葉・穂の観賞期':month<=4?'新しい葉の展開':'葉と穂の伸長期';
 }else if(leaf==='semi'&&[12,1,2,3].includes(month)){density=.55;phase='一部の葉が残る低温期（寒さで変化）';}
 else if(['evergreen','semi'].includes(leaf))phase=month===4?'新旧の葉が入れ替わる時期':'葉のある時期';
 // Winter bloom is not evidence of evergreen foliage. Explicit dormancy wins.
 if(bloom&&leaf==='herb'&&!a.persistence){density=Math.max(density,.85);scale=Math.max(scale,.85);phase='開花を支える葉';}
 if(a.dormantMonths?.includes(month)){density=0;scale=0;phase='資料の地上部休眠期';}
 else if(a.dormantMonths?.includes(month===1?12:month-1)){density=.35;scale=.55;phase='休眠後の葉の展開（表示目安）';}
 if(a.emergenceMonths?.includes(month)&&!a.dormantMonths?.includes(month)){density=.3;scale=.45;phase='資料の芽出し期';}
 if(a.monthlyLeafDensity?.[m]!==undefined)density=a.monthlyLeafDensity[m];
 if(a.architecture==='lysimachiaShoots'&&a.shootProfile==='rissy'){
  // Only the winter zero is revised; retain the former explicit-dormancy
  // spring/autumn curves so nonwinter organ placement and random order stay fixed.
  density=[12,1,2].includes(month)?.55:month===3?.35:1;scale=month===3?.55:month===4?.7:1;
  phase=[12,1,2].includes(month)?'寒冷期に一部の葉を残す参考（葉量・月境界は未校正）':month===3?'休眠後の葉の展開（表示目安）':month===4?'芽出し・葉の展開':month===11?'地上部が枯れる時期':'葉が茂る時期';
 }
 if(a.architecture==='nonRepensTrifolium'){phase=[12,1,2,3].includes(month)?'低温管理苗の説明を参考に一部の葉を残す表示（成株の冬姿・葉量は未校正）':a.flowerPalette.type==='rubens'?'立ち上がる多年草の3出複葉と長い花穂（季節の伸長比は参考）':'一年草の現在の株を参考表示（秋の実生・翌年のこぼれ種の更新は未予測）';}
 if(a.architecture==='asclepiasReferences'){
  if(a.flowerPalette.type==='speciosa'){
   if([3,4].includes(month))density=0;else if(month===5)density=.15;else if(month===6)density=.65;
   scale=month===5?.3:month===6?.7:1;
   phase=density===0?'寒冷地の芽出し前の参考（販売元は5月中旬から芽出し、暖地・月境界は未確認）':month===5?'寒冷地で5月中旬から芽出し始める参考（伸長割合と5月の開花は未確認）':bloom?'幅広い対生葉と球状の花房（6〜8月は季節換算、6月の伸長割合は未計測）':'花後の葉の参考（果実・冬の残葉と地域差は未確認）';
  }else{scale=month===3?.3:month===4?.7:1;phase=density===0?'寒冷地で地上部を整理した休眠株の参考（冬の残葉・越冬は地域差）':bloom?'種・品種別の葉と副花冠をもつ小花（季節表記からの参考花期）':month<=4?'春の伸長の参考（芽出しと月境界は未確認）':'花後も残る葉の参考（冬の残葉と地域差は未確認）';}
 }
 if(a.architecture==='pinkRainLily'){density=1;scale=1;phase=[12,1,2].includes(month)?'冬の残葉は未確認のため葉姿を保持（常緑・露地越冬の保証ではありません）':bloom?'細い根生葉と1本の花茎に1輪の花（降雨による一斉開花は未予測）':'細い根生葉の参考（冬の残葉と月別の葉量は未確認）';}
 if(['nativeLilyReferences','martagonReferences'].includes(a.architecture))phase=density===0?'球根で冬の越冬（境界月は表示目安）':bloom?(a.architecture==='martagonReferences'?'輪生葉と下向きの花（資料の地域での参考）':'互生葉と6枚の花被（資料の地域での参考）'):month<5?'春の茎葉の伸長（表示目安）':month>=10?'茎葉が黄変して枯れる時期（表示目安）':'花後も残る茎と葉（表示目安）';
 if(a.architecture==='acisAutumnScapes'){scale=month===9?.85:1;phase=density===0?'球根で夏の休眠（表示目安）':bloom?'秋の花と細い葉（掲載写真の一例・展葉時期に個体差）':month===6?'細い葉が黄変する時期（表示目安）':'秋〜春の糸状葉（表示目安）';}
 if(['brunneraSprays','brunneraCultivarSprays'].includes(a.architecture)){scale=[0,0,.42,.62,.85,1,1,1,1,1,.85,0][m];phase=density===0?'寒冷地の冬は地上部なし（暖地では残葉あり）':month<6?'小さな春葉と花茎（葉の大きさは参考補間）':'花後に広がる大きな葉（葉量は参考）';}
 if(a.architecture==='bergeniaRhizomes'){
  phase=bloom?'根茎から出る厚い葉と花（花期・色・葉量は参考）':'葉と切り取らず残した花茎の参考表示（茎の残存期間・結実は未確認）';
 }
 if(a.architecture==='vincaRunners'){
  scale=1;
  phase=[12,1,2].includes(month)?'冬の匍匐茎と残葉の参考表示（地域差・茎の残存・月別葉量は未確認）':'匍匐茎と対生葉・短い立ち上がり（花期以外の葉量と茎の残存は参考）';
  if(a.shootProfile==='jenny'&&bloom)phase='晩冬〜春の花と無斑葉（2〜5月は参考換算・開始月と月別葉量は未確認）';
 }
 if(a.architecture==='paniclePhlox'){
  scale=1;
  phase=[12,1,2].includes(month)?'冬の枯れ茎の参考表示（残存量・月境界・株元葉は未確認）':month<6?'対生葉と直立茎の展開（芽出し月・伸長量は参考）':'直立する株と枝分かれした花序（花期は国内資料・葉量は参考）';
 }
 if(a.architecture==='dichondraMat'){scale=1;phase='地面を這う茎と長い葉柄（冬の残葉量・葉色は地域差のある参考）';}
 if(a.architecture==='helichrysumFoliage'){scale=1;phase='銀葉を残す株と切らずに残した花茎（花期・葉量・枯れ茎の残存は参考）';}
 if(a.architecture==='cushionBush'){scale=1;phase='銀白色の細枝と枝に沿う小さな葉（国内の花期・寒害・蒸れは未予測）';}
 if(a.architecture==='artemisiaCushion'){scale=1;phase=[12,1,2].includes(month)?'冬の低い銀葉のロゼット（残葉量・月の境界は参考）':'細かく裂ける銀葉の株（葉量・花数・夏の蒸れは未予測）';}
 if(a.architecture==='cerastiumMat'){scale=1;phase='地表に広がる銀白色の対生葉（夏の蒸れ・冬の残葉量・剪定は未予測）';}
 if(a.architecture==='shastaCultivars'){scale=1;phase=[12,1,2].includes(month)?'冬の少ない株元葉と未剪定の枯れ茎の参考（残存量・厳寒地の枯れ込みは未予測）':'互生する鋸歯葉と品種別の八重花（花弁数・花期・伸長は参考）';}
 if(a.architecture==='bellisRosettes'){scale=1;phase=[12,1,2].includes(month)?'地際のロゼット葉で越冬（残葉・紅葉の量は参考）':'ロゼット葉から伸びる葉のない花茎（夏越し・連続開花は地域と環境に依存）';}
 if(a.architecture==='oleariaSmoky'){scale=1;phase='白い枝と銀葉（夏越し・屋外越冬は環境に依存、葉量は未予測）';}
 if(a.architecture==='mahoniaCanes'){scale=1;phase=bloom?'枝先に集まる黄色い花房（国内資料の11〜12月を参考表示）':'常緑の羽状複葉（低温での着色・葉量は参考、結実は未再現）';}
 if(a.architecture==='guaraniticaShoots'){scale=1;phase='大きな対生葉と黒い萼・青い筒状花（地下茎・剪定・地域別の伸長は未予測）';}
 if(a.architecture==='rustySageCalyces'){scale=1;phase='銀灰色の葉と錆桃色の花・花後の萼（残存期間・冬咲き・霜害は未予測）';}
 if(a.architecture==='giantDaisyShoots'){scale=1;density=[12,1,2].includes(month)?.25:1;phase=bloom?'葉の多い直立茎の上部で分枝し、白い舌状花と盛り上がる黄色い花心（晩夏〜秋の参考）':[12,1,2].includes(month)?'短い株元の茎に少量の葉を残す冬の参考。低温管理苗と無剪定成株の違いは未校正':'互生する無柄の鋸歯葉と直立茎。月別の伸長・葉量は参考';}
 if(a.architecture==='amberboaHeads'){scale=1;density=[12,1,2].includes(month)?.3:1;phase=bloom?'細く裂けたライラック色の周辺花と淡い中央花。夏は花数が減る国内記載を参考表示':[12,1,2].includes(month)?'低温管理苗を参考に少量の株元葉を残す。暖地の一年草化・無剪定成株は未予測':'株元の有柄葉と茎の細い互生葉。分枝後の長い花柄は先端に葉がない';}
 if(a.architecture==='jacobaeaShrubs'){scale=1;density=1;phase=bloom?'銀葉の株から伸びる花茎と小さな黄色い頭花。花期は国内資料の参考、苗齢別の開花は未予測':'白い毛を持つ互生の裂葉と分枝する株。年間の銀葉は国内資料、月別葉量・寒害・剪定は未校正';}
 if(a.architecture==='berlandieraCymes'){scale=1;density=[12,1,2].includes(month)?.35:1;phase=bloom?'黄色い舌状花8枚、赤褐色の小花と緑の未熟小花（春〜初夏の参考）':month===7?'花後の緑の総苞杯を残す仮の参考。保持月数は未確認':[12,1,2].includes(month)?'株元に少量の葉を残す仮の冬姿。国内の冬葉は未確認':'互生する有柄の羽状に裂けた単純葉と分枝する茎（葉寸法・葉量は参考）';}
 if(a.architecture==='berkheyaWingedShoots'){scale=1;density=[12,1,2].includes(month)?.3:1;phase=bloom?'棘のある翼状の茎、淡紫の舌状花と暗い花心・白い花粉（初夏〜夏の参考）':[12,1,2].includes(month)?'大葉が減り、株元に小さな葉を残す冬の参考姿':month===5?'棘のある総苞に包まれた蕾。月は仮の参考':month>=9?'花後に閉じた総苞。保持期間は未確認':'棘と波打つ縁を持つロゼット葉の参考姿';}
 if(a.architecture==='hieraciumHairyShoots'){scale=1;density=[12,1,2].includes(month)?.55:1;phase=bloom?'長い白毛のある茎と総苞。黄色い舌状花だけでできた頭花（初夏の参考）':[12,1,2].includes(month)?'株元に葉を残す仮の参考姿。国内の冬葉量・落葉は未確認':'緑のへら形の葉と長い白毛。葉の付く茎が少数に分枝する参考姿';}
 if(a.architecture==='raouliaMats'){scale=1;density=[12,1,2].includes(month)?.35:[7,8].includes(month)?.65:1;phase=bloom?'灰白色の細かな葉のマットに、小さな淡黄色の頭花（夏の参考）':[12,1,2].includes(month)?'低温で葉が減る参考姿。残葉・落葉の程度は地域と管理により変わる':'短い枝先に小葉が重なる低いマット（夏の枯れ込み・回復速度は未校正）';}
 if(a.architecture==='cottonThistleWings'){scale=1;phase=bloom?'棘付きの翼を持つ分枝した茎と、紫の筒状花が集まる頭花（未開花株はロゼット）':[12,1,2].includes(month)?'未開花株が葉を広げて越冬する参考姿':month===6?'棘のある総苞に包まれた蕾（開花可能な株の参考）':'銀灰色の裂葉が残る参考姿。開花後の同じ株は再生させない';}
 if(a.architecture==='jurineaNoddingHeads'){scale=1;phase=bloom?'弓なりの花茎に横・下向きにも咲く赤紫の頭花（小株は苗葉の参考）':a.seedHeadMonths?.includes(month)?'花後の白い冠毛を残した参考姿（国内の保持月数は未実測）':[12,1,2].includes(month)?'冬芽と株元に少量の小葉が残る低温管理苗の参考（地域差は未校正）':'株元の細裂葉。小苗には切れ込みの少ない葉もある';}
 if(a.architecture==='cotulaCushions'){scale=1;phase=bloom?'細かな銀葉の低いクッションと、細い無葉花茎の黄色いボタン状花':[12,1,2].includes(month)?'冬に葉が減る半常緑の参考姿（地域・管理による残葉量は未校正）':'柔らかな銀色の細裂葉が地表を覆う（広がり速度と花後の刈込みは参考）';}
 if(a.architecture==='artichokeCrowns'){scale=1;phase=bloom?'肉厚の苞が重なる大きな頂端花と、側枝の小さな花・蕾（小株は葉の参考）':[12,1,2].includes(month)?'低温管理苗を参考に地上部を省略（無剪定成株・暖地の残葉と残茎は未校正）':month===6?'大きな裂葉と総苞に包まれた蕾（国内の初夏写真からの参考）':'株元から広がる銀緑色の大きな裂葉（月別の葉量・切戻しは参考）';}
 if(a.architecture==='leptinellaMats'){scale=1;phase=bloom?'地表の黒褐色の羽状深裂葉と、葉先の緑・小さな淡黄緑〜白い頭花（花色には資料差）':[12,1,2].includes(month)?'低い葉が残る参考姿（半常緑性が根拠・冬の残葉量と実写は未確認）':'地下茎で低く広がる、黒褐色の細かな葉と緑の葉先（広がり速度は未予測）';}
 if(a.architecture==='craspediaGlobes'){scale=1;phase=bloom?'銀色の有毛葉から長い花茎が伸び、各先端に黄色い球状の複合花序（国内流通株の参考）':[12,1,2].includes(month)?'銀緑色の根生葉が残る参考姿（国内の冬の実写と残葉量は未確認）':'株元に集まる細長い有毛葉（花茎の発生・残存月は参考）';}
 if(a.architecture==='syneilesisUmbrellas'){scale=1;phase=bloom?'開花株の参考期：掌状深裂葉と頂部の小花の円錐花序（小株には花茎を省略）':[12,1,2].includes(month)?'地上部がなくなる冬の休眠（低温管理苗の実写を参考）':[3,4].includes(month)?'白い毛を帯びた、すぼめた傘状の春の葉（展開月境界は参考）':'深く切れ込んだ傘状の葉（若い株と開花株では葉数・付き方が異なる）';}
 if(a.architecture==='koreanAsterShoots'){scale=1;phase=bloom?'互生する披針形葉と淡紫色の頭花・花期に根生葉を失う参考姿':[12,1,2].includes(month)?'冬の地上部休眠（国内本文が根拠・冬の実写は未確認）':month<=6?'春の根生葉と伸びる茎（葉量と月境界は参考）':'上ほど小さくなる茎葉（花後の残茎期間は未校正）';}
 if(a.architecture==='marshalliaHeads'){scale=1;phase=bloom?'三脈の細長い葉と、筒状花だけが集まる淡桃色の頭花（国内流通株の参考）':[12,1,2].includes(month)?'低温管理苗を参考にした少数の根生葉（冬の実写・無剪定成株は未確認）':'根元に多く上ほど小さくなる三脈の葉（月別の残茎・葉量は参考）';}
 if(a.architecture==='belliumRunners'){scale=1;phase=bloom?'低いロゼットと無葉の花茎・小さな白花（夏越し可能な環境での参考）':[12,1,2].includes(month)?'低温管理苗を参考に減葉した姿（冬の実写・地域ごとの残葉量は未確認）':'匍匐茎で広がる小さなロゼット葉（葉量・茎長は写真近似）';}
 if(a.architecture==='miyakowasureCrowns'){scale=1;phase=bloom?'春の互生する鋸歯葉と紫の頭花（国内の流通株を参考）':[12,1,2].includes(month)?'低温期の少ない残葉（冬の実写と残葉率は未確認）':month===3?'早春の根生葉と短い芽出し（苗写真を参考）':'花後の低いロゼット葉で越夏する参考姿（月別の葉量は未校正）';}
 if(a.architecture==='compositusRosettes'){scale=1;phase=bloom?'低い三出状の裂葉と毛のある花茎・淡紫の頭花（国内流通株の参考）':'花茎を切った低い裂葉の参考（夏の切戻し・葉量は未校正）';}
 if(a.architecture==='karvinskianusTrails'){scale=1;phase=[12,1,2].includes(month)?'低温管理苗を参考にした低い茎と残葉（無剪定成株・暖地の冬姿は未校正）':bloom?'低く広がる枝先の白から桃色の小花（咲き進みの異なる花を混在表示）':'低く広がる細い茎と全縁・切れ込み葉（月別の草姿は参考）';}
 if(a.architecture==='erigeronHeads'){scale=1;phase=[12,1,2].includes(month)?'低温管理苗の落葉期を参考表示（成株の残葉・残茎・地域差は未校正）':bloom?a.shootProfile==='rosa'?'分枝する茎先の桃色の半八重花（切戻し後の秋の再開花は自動表示しない）':a.shootProfile==='prosperity'?'短い節間と細かな分枝の淡い青紫花（連続開花・花がら摘みの効果は未予測）':a.shootProfile==='azure'?'分枝した茎先の細い青紫の舌状花（初夏・晩秋を月へ参考換算）':'1本の茎先に1花。赤から橙への咲き進みを混在表示（月別の色ではない）':'互生する細長い葉と株元の葉（花後の残茎量・草姿は参考）';}
 if(a.architecture==='linumCymes'){scale=1;phase=[11,12,1,2].includes(month)?'低温管理苗を参考にした低い葉茎（成株の残葉・残茎・地域差は未校正）':a.seedHeadMonths?.includes(month)?'花後の球形蒴果の参考（結実量・熟期・残存月は未校正）':bloom?'細い灰緑の茎葉と青い5花弁（一日の落花は自動表示しない）':'花後の細い灰緑の茎葉（秋の再開花は自動表示しない）';}
 if(a.architecture==='chalcedonicaHeads'){scale=1;phase=[10,11,12,1,2].includes(month)?'花茎を切った株元葉の参考（冬の残葉量・落葉は地域差がある）':'対生する緑葉と茎先の小花房（切戻し後の秋の再開花は自動表示しない）';}
 if(a.architecture==='roseCampion'){scale=1;phase=[10,11,12,1,2].includes(month)?'低い銀葉のロゼット（花後に花茎を切った管理例・月別葉量は参考）':'銀白色の対生葉と枝分かれする花茎（国内の春〜初夏を月へ参考換算）';}
 if(a.architecture==='redValerian'){scale=1;phase=bloom?'細い花筒と1雄しべを持つ白・紅色の小花房（晩春〜初夏の参考）':month>=10?'寒冷地での秋の葉色の参考（月境界と暖地の残葉は未校正）':'対生する灰緑の葉と分枝する茎（花期・草姿は地域差のある参考）';}
 if(a.architecture==='orlayaUmbels'){scale=1;phase=a.seedHeadMonths?.includes(month)?'花後の果実と枯れ茎の参考（残存月・結実量は未校正）':bloom?'細かな複葉と外側花弁が大きい白い花房（花数・寸法は近似）':month===9?'花後に枯れる時期（翌年の株は新たな植付けで表現）':'新しく植えた秋播き苗の葉姿の参考（冬の実測・地域差は未確認）';}
 if(a.architecture==='sanguisorbaSpikes'){scale=1;phase=[12,1,2].includes(month)?'低温で落葉した残茎の参考（冬の成株写真・残存量は未確認）':'羽状複葉と垂れる花穂（花弁はなく萼と雄しべ、花量・地域別の開花月は未校正）';}
 if(a.architecture==='aruncusPlumes'){scale=1;phase=a.seedHeadMonths?.includes(month)?'花後の穂が残る参考（緑から秋の橙、冬の褐色へ。結実の内部・残存月は未照合）':[12,1,2].includes(month)?'低温で落葉した未剪定茎の参考（冬苗と異なる成株の残存量は未確認）':'鋸歯のある複葉と白い羽状の花穂（雄花を参考にした近似、性別・花量・伸長は未確認）';}
 if(a.architecture==='aruncusPlumes'&&a.shootProfile==='noble')phase=[12,1].includes(month)?'紅葉後の少ない株元葉と残茎の参考（冬苗写真からの近似、落葉月・成株の姿は未校正）':month===2?'低温期に落葉した参考（月境界・暖地の残葉は未校正）':a.seedHeadMonths?.includes(month)?'花後の穂が残る参考（褐色と残存月は未校正、結実の内部は未確認）':'低い細かな切れ込み葉と白い花穂（販売株の性別・花量・年次成長は未確認）';
 if(a.architecture==='dropwortRosettes'){scale=1;phase=[12,1,2].includes(month)?'少ない株元葉と未剪定茎の参考（冬の成株写真・残葉量と残存月は未確認）':'株元の細かい羽状複葉と白い八重花（花弁数・花量・伸長は参考）';}
 if(a.architecture==='ulmariaSprays'){scale=1;phase=[12,1,2].includes(month)?'低温で落葉した未剪定茎の参考（品種の冬写真・残葉量・残存月は未確認）':'大小の小葉が並ぶ複葉と白い円錐状の花房（品種別の葉色・八重花、花量と伸長は参考）';}
 if(a.architecture==='filipendulaSprays'){scale=1;phase=[12,1,2].includes(month)?'低温期に落葉した未剪定の茎の参考（品種別の冬写真・残葉量・残存月は未確認）':'掌状に裂ける葉と小花を集めた花房（花量・伸長・紅葉時期は参考）';}
 if(a.architecture==='rodgersiaCultivarReferences'){scale=month===4?.60:1;phase=a.calyxMonths?.includes(month)?'花後に残る萼の参考（開花した株・結実は未確認）':density===0?'低温管理・霜後に地上部を整理した冬の参考（未剪定の花茎は未再現）':'複葉と花弁のない小花の参考（株齢・発色と気温応答は未校正）';}
 if(a.architecture==='gilleniaSprays'){scale=1;phase=a.calyxMonths?.includes(month)?'花後に残る赤い萼の参考（果実・残存月と結実量は未確認）':'互生する三出複葉と細い星形の花（伸長・花数・紅葉時期は参考）';}
 if(a.architecture==='fireflyCymes'){scale=1;phase=[12,1,2].includes(month)?'国内の少ない残葉・紅葉の参考（冬の成株写真、残存量・月境界は未確認）':'対生葉と二出分枝、切れ込みのある八重花（花数・花弁数・月別伸長は参考）';}
 if(a.architecture==='snowtipMat'){scale=1;phase=[12,1,2].includes(month)?'冬苗の少ない残葉を参考表示（掲載写真は切戻し株、未剪定の冬姿は未確認）':'這う赤い茎と小さい対生葉・白い5弁花（花数・成長・月別葉量は参考）';}
 if(a.architecture==='actaeaRacemes'){scale=1;phase=a.seedHeadMonths?.includes(month)?'秋冬の未剪定写真を参考にした袋状の実と枯れ茎（結実量・残存月・倒伏は未校正）':[12,1,2].includes(month)?'冬の落葉と未剪定の枯れ茎の参考（品種固有の冬写真は未確認）':'複葉と雄しべの目立つ花穂（花量・花茎形成・地域差は参考）';}
 if(a.architecture==='astrantiaUmbels'){scale=1;phase='掌状の株元葉と総苞に囲まれた小花（花齢・花量・剪定・成長は参考）';}
 if(a.architecture==='cerintheCymes'){scale=1;phase=[12,1,2].includes(month)?'保護された早春苗を参考にした残葉（成株の冬姿・霜害は未確認）':'互生する丸い銀緑葉と青紫の苞・下向きの筒花（一年草の表示枠、実寿命・連続開花は未予測）';}
 if(a.architecture==='unifloraMats'){scale=1;phase=[12,1,2].includes(month)?a.shootProfile==='swan'?'冬苗写真の枯色の茎と少数の紅葉（残存量は参考）':'国内低温管理の地上部なしの参考（暖地は常緑、月境界は未校正）':'低く広がる対生葉と膨らんだ萼・品種別の白花（剪定と生育は未予測）';}
 if(a.architecture==='maitaiCrowns'){scale=1;phase=[12,1,2].includes(month)?'国内掲載の低温管理苗の少ない根出葉（長い花茎は整理した参考、未剪定成株は未確認）':month===6?'夏の小さな一重花の参考（5弁への切替時期・実温度は未校正）':'大きな先端小葉のある株元葉と杏〜桃の半八重花（花齢・花数・成長は参考）';}
 if(a.architecture==='richardsoniiTrails'){scale=1;phase=[1,2].includes(month)?'国内低温管理の少ない残葉と茎の参考（落葉する場合もあり、冬姿写真・残存量・月境界は未確認）':'横へ伸びる茎と上2裂・下3裂の青花（国内の春〜初冬を参考表示、夏の花量・切戻し再開花は未校正）';}
 if(a.architecture==='phuopsisHeads'){scale=1;phase=[12,1,2].includes(month)?'国内の低温管理苗の少ない残葉と茎の参考（完全落葉する場合もあり、残存量・月境界は未校正）':'輪生状の細葉・葉状托葉と桃色の筒花の頭花（長い花柱、切戻し・自然増殖・年次成長は未予測）';}
 if(a.architecture==='alchemillaCymes'){scale=1;phase='ひだのある単葉と黄緑の小花（花弁なし・萼と副萼各4枚、剪定と月別生育は未予測）';}
 if(a.architecture==='doubleRaggedRobin'){scale=1;phase=[12,1,2].includes(month)?'国内の紅葉した少ない残葉と未剪定の茎の参考（残存量・月境界は未校正）':'細い根出葉と分枝する茎・細裂する白八重花（花弁数は近似、秋の返り咲き・剪定は未予測）';}
 if(a.architecture==='pinnatePolemonium'){scale=1;phase=[12,1,2].includes(month)?(a.shootProfile==='purpleRain'?'国内の冬苗の低い羽状葉と花茎を省く管理例（未剪定の成株とは異なり地域差あり）':'国内寒冷地の少ない羽状葉と茎を参考表示（冬写真未確認・暖地や海外と地域差あり）'):'小葉が並ぶ羽状複葉と5裂花（葉色・花齢による色・残葉量は近似、剪定と年次成長は未予測）';}
 if(a.architecture==='carolinaPhloxHeads'){scale=1;phase=[12,1,2].includes(month)?'国内寒冷地の少ない残葉と茎の参考（暖地は常緑・残葉量と成茎の残存は未校正）':'細い直立茎と対生葉・丸い頂生花房（自然増殖・年次成長・剪定は未予測）';}
 if(a.architecture==='springPhloxTrails'){scale=1;phase=[12,1,2].includes(month)?'国内の寒冷地・低温管理の苗案内に合わせ地上部なしを参考表示（暖地の常緑・半常緑とは異なる）':'細い対生葉・横に伸びる茎と枝先の花房（自然増殖・色変化の時期・年次成長は未予測）';}
 if(a.architecture==='physostegiaRows'){scale=1;phase='細い対生葉と4列の桃色の筒花、秋冬の小さな芽（成茎の冬姿は未確認のため保持、常緑性を保証しない）';}
 if(a.architecture==='subsessilisWhorls'){scale=1;phase=[12,1,2].includes(month)?'国内資料の落葉と冬芽を参考表示（残存量・月境界は未校正）':'広い緑葉と大きな淡桃色の筒状花（花量・寸法・色は写真からの近似）';}
 if(a.architecture==='uprightFaassenii'){scale=1;phase='直立する細い花穂と灰緑葉（冬姿未確認のため葉姿を保持、常緑や越冬を保証しない）';}
 if(a.architecture==='limeCatmintMound'){scale=1;phase='低い黄金葉の株と青花（春の明るさ・残葉率・切戻し再開花は参考）';}
 if(a.architecture==='nervosaHeads'){scale=1;phase=[12,1,2].includes(month)?'RHSの落葉性から冬の葉なしを参考表示（国内冬芽と枯れ穂の残存は未確認）':'細い対生葉と密な円筒花穂（寸法・花量・月境界は参考）';}
 if(a.architecture==='tallNepetaSpires'){scale=1;phase=[12,1,2].includes(month)?a.shootProfile==='tuberosa'?'冬に残る段状の枯れ穂と冬芽（切戻しを行わない参考）':'落葉後の茎と少ない冬芽（葉量・残存期間は参考）':'高く直立する種別の花穂と対生葉（切戻しによる再開花・倒伏は未予測）';}
 if(a.architecture==='simpleCatmintBranches'){scale=1;phase=a.shootProfile==='blue'?'灰緑の葉と青紫の小花（冬姿未確認のため葉姿を保持、常緑や越冬を保証しない）':[12,1,2].includes(month)?'寒冷地の冬芽と切らずに残した茎の参考（残葉量・枯れ茎の残存は未校正）':'銀灰の葉と白い小花（切戻し再開花と月別の葉量は参考）';}
 if(a.architecture==='discolorBranches'){scale=1;phase='白い葉裏と下向きの暗紫花（冬は保護した生存株の参考、露地越冬は未予測）';}
 if(a.architecture==='clevelandWhorls'){scale=1;phase='銀灰色の葉と段状の輪生花（成株の参考、剪定・開花年齢・地域差は未予測）';}
 if(a.architecture==='whiteSageShrub'){scale=1;phase='銀白色の単葉と高く伸びる花序（成株の参考、開花年齢・剪定・霜害は未予測）';}
 if(a.architecture==='claryPanicles'){scale=1;phase='大きなしわ葉・分枝する花序と苞（生存株・無剪定の参考、株齢とこぼれ種は未予測）';}
 if(a.architecture==='pineappleSageBranches'){scale=1;phase='対生する幅広い葉と赤い筒状花（無剪定の参考・霜害や季節の伸長は未予測）';}
 if(a.architecture==='tallBlueSpires'){scale=1;phase='細い茎と対生葉、種別の青花（剪定・倒伏・地下茎の拡大・季節差は未予測）';}
 if(a.architecture==='pratensisRosettes'){scale=1;phase=[12,1,2].includes(month)?'地際の冬芽と残した枯れ茎の参考（剪定・腐朽・地域差は未予測）':'低い葉群と段状に咲く花穂（切り戻しによる反復開花は未予測）';}
 if(a.architecture==='smallSageMounds'){scale=1;phase='小さく分枝する株と種別の細葉・銀葉・銅葉（着色時期・冬の残葉・剪定は参考）';}
 if(a.architecture==='patensShoots'){scale=1;phase='対生する広い葉と大きく開く二唇形花（開花・地域差は参考）';}
 if(a.architecture==='cherrySageBranches'){scale=1;phase=['hotLips','amethystLips'].includes(a.shootProfile)?'枝先の単色・白・二色の花の混在例（温度による配色・剪定・地域差は未予測）':'小さな対生葉と枝先の品種別の花（剪定・地域差・冬の残葉量は参考）';}
 if(a.architecture==='officinalisMounds'){scale=1;phase='しわのある対生葉と品種別の斑・若葉・寒期の色（葉量・着色時期・剪定は未予測）';}
 if(a.architecture==='leucanthaCanes'){scale=1;phase=[12,1,2].includes(month)?'低温期の枯れ込みの参考（保護・暖地の残葉量は未予測）':'細い対生葉とビロード状の萼（短日・気温・摘芯による変化は未予測）';}
 if(a.architecture==='indigoSpires'){scale=1;phase=[12,1,2].includes(month)?'寒冷地の落葉と切らずに残した茎の参考（残存量は未検証）':'大きな対生葉と長く曲がる青紫の花穂（地域差・伸長・剪定は未予測）';}
 if(a.architecture==='perovskiaShoots'){scale=1;phase=[12,1,2].includes(month)?'落葉後も切らずに残した枝の参考（残存量・暖地の葉量は未予測）':'銀色の対生葉と疎らに枝分かれする花序（品種差・伸長・剪定は未予測）';}
 if(a.architecture==='lavenderMounds'){scale=1;phase=[12,1,2].includes(month)?'冬の常緑葉と残した花茎（残葉・枯れ穂の量は参考）':'細い対生葉と長い花茎（花後の剪定・二番花は未予測）';}
 if(a.architecture==='chocolateCosmos'){scale=1;phase=density===0?'地上部が枯れた冬の参考（防寒・枯れ茎の残存期間は別条件）':'低い葉群と長い花茎（花期・葉量は地域と管理で変化）';}
 if(a.architecture==='silverDropJuvenile'){scale=1;phase='銀青色の対生する幼葉の参考（成木葉への移行・寒害は未予測）';}
 if(a.architecture==='autumnAnemone'){
  scale=1;phase=[12,1,2].includes(month)?'地上部が枯れ、切らずに残した花茎の参考（残存・倒伏は未予測）':bloom?'葉の上に広がる秋の一重花（花数・色・葉量は参考）':'葉と花茎の参考（芽出し・花茎発生月は未校正）';
 }
 if(a.architecture==='oxfordMat'){
  scale=1;phase=bloom?'低く広がる葉と白目の青い花（花期と花数は参考）':[11,12,1,2].includes(month)?'銅色の冬葉（着色と残葉量は地域差のある参考）':'葉のクッション状の広がり（枝の伸長量は未予測）';
 }
 if(a.architecture==='melinisTussock'){
  scale=1;
  phase=[12,1,2,3].includes(month)?'寒冷地の少ない葉と切らずに残した穂の参考（越冬・倒伏は未予測）':bloom?'青緑の細葉と白〜赤の穂（新旧の穂の混在を参考表示）':'芽出しと残した穂の参考（発生月と残存期間は未確認）';
 }
 if(a.architecture==='nemorosaWhorls'){
  scale=1;
  phase=[12,1,2].includes(month)?'冬の株元と切り取らず残した枯れ茎（残葉量・倒伏時期は参考）':bloom?'対生葉・輪状に集まる小花（花期は出典地域の参考）':'花前・花後の花茎と萼を残す参考表示（発生・残存月と再開花は未校正）';
 }
 if(a.architecture==='linariaRacemes'){
  scale=1;
  phase=[12,1,2].includes(month)?'冬の花茎なし・株元の新芽（管理例からの仮表示・月境界と残葉量は未確認）':month<5?'株元から伸びる細い茎葉（伸長量・時期は参考）':'直立する細い茎葉（花期は国内資料・月別の姿は参考）';
 }
 if(a.architecture==='lamiumRunners'){
  // Domestic growers describe winter leaf loss, while the species may retain
  // foliage in mild climates. These residual leaves are an explicit illustration.
  scale=[.45,.45,.60,.85,1,1,1,1,1,.95,.70,.45][m];
  phase=[12,1,2].includes(month)?'冬の地際と残葉の仮表示（地域差・月別葉量は未確認）':month<=4?'春の対生葉と短い新梢（芽出し月・葉量は表示目安）':'匍匐茎から広がる対生葉（葉量・広がる速さは参考）';
 }
 if(a.architecture==='gardenRoseCanes'&&a.monthlyLeafDensity)phase=density===0?'冬の落葉・枝を残す管理例':month===3?'3月の芽吹き（関東の管理例）':month>=11?'低温で葉が減る時期（残葉率は目安）':'葉のあるバラ（剪定・気温で変化）';
 if(a.flowerPalette?.wildRose)phase=density===0?'落葉した枝（境界月は表示目安）':a.persistence==='evergreen'?'常緑の葉（低温時の残葉率は未実測）':month<=4?'春の若葉（境界月は表示目安）':'葉のある時期（色・葉量は参考）';
 if(a.flowerPalette?.carpetMound)phase=density===0?'冬管理後の落葉した枝（暖地の残葉は未実測）':month<=4?'春の展葉（境界月・葉量は表示目安）':month>=11?'低温で葉が減る時期（残葉率は目安）':'葉のある低い株（葉量・剪定姿は参考）';
 if(a.flowerPalette?.driftMound)phase=density===0?'冬管理後の落葉した枝（自然落葉量は地域差あり）':month<=4?'春の展葉（時期と葉量は参考補間）':month===12?'初霜で開花が終わる時期（残花・残葉は地域差あり）':month===11?'晩秋の低い株（初霜で開花が変化）':'葉のある低い株（葉量・剪定姿は参考）';
 if(a.flowerPalette?.polyanthaReference)phase=density===0?'冬管理後の落葉枝（自然な残葉率は地域差あり）':month<=4?'春の展葉（境界月・葉量は参考）':month>=11?'晩秋から葉が減る時期（残葉量は目安）':'小型の木立バラ（花の色・数は参考）';
 if(a.flowerPalette?.delbardReference||a.flowerPalette?.climbingReference)phase=density===0?'冬管理後の落葉枝（自然な残葉量は地域差あり）':month<=4?'春の展葉（境界月・葉量は参考）':month>=11?'晩秋から葉が減る時期（残葉量は目安）':'品種別の枝と花（開花月の換算は参考）';
 if(a.flowerPalette?.trueBloom)phase=density===0?'冬の落葉した木質枝（管理後の参考）':month<=4?'春の展葉（時期・葉量は参考補間）':month>=11?'晩秋から葉が減る時期（境界月は未実測）':'葉のあるバラ（花期の月換算は参考）';
 if(a.architecture==='gardenRoseCanes'&&a.persistence==='semiEvergreen')phase=[11,12,1,2,3].includes(month)?'一部の葉が残る半常緑の枝（寒さで落葉量が変化）':'葉のある時期（新旧の葉の入れ替わりは目安）';
 if(a.flowerPalette?.hips&&(a.fruitMonths?.includes(month)||a.greenFruitMonths?.includes(month)))phase+='・'+(a.fruitMonths?.includes(month)?'実を残した枝（結実条件・残存月は参考）':'若い実（花後の参考）');
 if(a.architecture==='submergedShoots'&&!a.dormantMonths?.includes(month)&&!a.emergenceMonths?.includes(month))phase=['cabomba','ceratophyllum'].includes(a.shootProfile)&&[12,1,2].includes(month)?'水底の冬芽（低温期の参考）':'水中葉（保護された水中の参考条件）';
 if(a.waterSurfaceModel)phase='葉（水深で水上・水中の姿を切替）';
 if(a.lifeForm==='moss')phase='水中の茎葉体（保護された水中の参考条件）';
 if(a.architecture==='pelargoniumErodium'&&a.flowerPalette.type==='pearl')phase=density===0?'夏冬の落葉した茎（露地管理の参考・月は気温で変化）':'春秋の葉と花（暖地の露地管理の参考）';
 const dormant=density===0;
 let color=info.leafColor||profile?.green||'#577d42';
 if(profile){color=autumn?profile.autumn:month===breakMonth?profile.spring:profile.green;if(leaf==='evergreen'&&month===breakMonth)color=profile.green;}
 if(a.leafColor&&!autumn)color=a.leafColor;
 if(a.monthlyLeafColors?.[m])color=a.monthlyLeafColors[m];
 const season=month>=3&&month<=5?'spring':month>=6&&month<=8?'summer':month>=9&&month<=11?'autumn':'winter';
 if(a.seasonalColors?.[season])color=a.seasonalColors[season];
 const woody=!!profile||['tree','shrub','conifer','maple','olive','rose','hydrangea','clematis','climbingrose','mophead','lavender'].includes(info.form);
 const leaflessFlowering=!!a.leaflessBloom&&bloom&&dormant;
 const groundDormant=dormant&&!woody&&!((['coolSeasonAnnual','siculumBulb'].includes(a.persistence)||a.architecture==='poppyShoots')&&a.seedHeadMonths?.includes(month))&&!a.standingWinter&&!leaflessFlowering&&(leaf==='herb'||a.architecture==='poppyShoots'||!!a.foliageMonths||['deciduousHellebore','summerDormant','springEphemeral','springBulb','lateSpringBulb','autumnBulb','autumnLeafBulb'].includes(a.persistence)||['cyclamen','tulip','narcissus','globe'].includes(info.form));
 if(groundDormant)bloom=false;
 if(leaflessFlowering)phase='葉のない花茎の開花期';
 else if(groundDormant)phase=a.architecture==='compositusRosettes'?'国内の低温管理苗の落葉期を参考表示（冬の写真・成株の残葉は未確認）':a.architecture==='erigeronHeads'?'低温管理苗の落葉期を参考表示（冬の実物写真・成株の残葉と残茎は未確認）':a.architecture==='orlayaUmbels'?'花後に枯れる一年草（翌年の株は新たな植付けで表現）':a.architecture==='redValerian'?'国内の低温管理苗の地上部なしの参考（暖地の残葉・未剪定成株の冬姿は未確認）':a.architecture==='gilleniaSprays'?'国内の低温管理苗の地上部なしの参考（未剪定の成茎・暖地・休眠月の境界は未校正）':a.architecture==='astrantiaUmbels'?(a.shootProfile==='magic'?'国内の低温管理苗の落葉期を参考表示（写真の短い切り株は未再現、未剪定株の冬姿は未校正）':'国内の低温管理苗の地上部なしの参考（暖地・未剪定株の冬姿は未校正）'):a.architecture==='unifloraMats'?'国内の低温管理苗の地上部なしの参考（早春苗の写真は冬の成株と別、暖地の冬姿は未校正）':a.architecture==='alchemillaCymes'?'国内の冬の地上部休眠を参考表示（月境界・地域差は未校正）':a.architecture==='springPhloxTrails'?'国内の寒冷地・低温管理の苗案内に合わせ地上部なしを参考表示（暖地の常緑・半常緑とは異なる）':a.persistence==='frostDormantTuber'?'霜後の地上部休眠（冬期の表示目安）':info.life==='annual'?'一年草の生育期外（低温期の参考）':'地上部のない休眠期';
 const bloomIndex=flowerMonths.indexOf(month),flowerDensity=bloom?(a.monthlyFlowerDensity?.[m]??(a.architecture==='avalanche'&&month>=7?.24:flowerMonths.length>2&&(bloomIndex===0||bloomIndex===flowerMonths.length-1)?.65:1)):0;
 const shootScale=['thibetanusReferences','argutifoliusReferences','lividusReferences','nigerCultivarReferences','rugosaSourceReferences','bergamoAnnualReference','ogisMonardaColourReferences','retailMonardaReferences','ruelliaTropicstarReference','woodlandPhloxReferences','mallowReferences','retailPeachBellReferences','fineAmsoniaReferences','stormcloudReferences','amsoniaEllipticaReferences','tulbaghiaReferences','delavayiReferences','chrysanthemumReferences','annLeysReferences','gardenAsterReferences','showmakersAsterReferences','callistephusReferences','gaillardiaSourceReferences','achilleaReferences','autumnJoyReferences','milleniumAlliumReferences','limelightHydrangeaReferences','magnusEchinaceaReferences','reedFoliageReferences','canaryReferences','sorghastrumReferences','boutelouaReferences','sandLovegrassReference','sesleriaReference','imperataRedReference','cortaderiaReferences','moliniaReferences','deschampsiaReferences','miscanthusReferences','elymusReferences','schizachyriumReferences','andropogonReferences','chasmanthiumReferences','luzulaSelectReference','redVeinDockReference','hordeumReference','planumReferences','whitetopReferences','goldenBambooReferences','tussockReferences','acorusReferences','milletMelicaReferences','brizaReferences','pennisetumReferences','fescueReferences','blueFescue','otherCarexReferences','blueCarexReferences','fineCarexReferences','oshimensisReferences','ophiopogonReferences','liriopeReferences','hakonechloaReferences','stipoidReferences','calamagrostisReferences','panicumReferences','tallEupatorieae','muhlenbergiaPanicles','adenophoraArches','gardenBellShoots','lanternBellCrowns','noddingBellRacemes','alpineBellMats','milkBellPanicles','clusterBellShoots','harebellThreads','peachBellRacemes','tapienRunners','woodlandPhloxStolons','wildGerberaCrowns','gardenGerberaCrowns','bengalCrowns','brunneraCultivarSprays','wildPrimroseCrowns','belarinaCrowns','irishPrimulaCrowns','atropScabiosaCymes','dwarfScabiosaCrowns','famaScabiosaCymes','queenMoonScabiosa','frilledScabiosaCymes','knautiaMeadowCymes','cephalariaTallCymes','succisellaPearlCymes','knautiaCultivarCymes','drumstickPaperyHeads','teaselSpinyShoots','tangoCoreopsisShoots','giantDaisyShoots','amberboaHeads','jacobaeaShrubs','berlandieraCymes','berkheyaWingedShoots','hieraciumHairyShoots','raouliaMats','cottonThistleWings','jurineaNoddingHeads','cotulaCushions','artichokeCrowns','leptinellaMats','craspediaGlobes','syneilesisUmbrellas','koreanAsterShoots','marshalliaHeads','belliumRunners','miyakowasureCrowns','compositusRosettes','karvinskianusTrails','erigeronHeads','linumCymes','chalcedonicaHeads','roseCampion','redValerian','orlayaUmbels','sanguisorbaSpikes','aruncusPlumes','dropwortRosettes','ulmariaSprays','filipendulaSprays','gilleniaSprays','fireflyCymes','snowtipMat','actaeaRacemes','astrantiaUmbels','cerintheCymes','unifloraMats','maitaiCrowns','richardsoniiTrails','phuopsisHeads','alchemillaCymes','doubleRaggedRobin','pinnatePolemonium','carolinaPhloxHeads','springPhloxTrails','physostegiaRows','subsessilisWhorls','uprightFaassenii','limeCatmintMound','nervosaHeads','tallNepetaSpires','simpleCatmintBranches','pinkCatmintBranches','giantCatmintShoots','pajamasCymes','catmintMounds','rupestrisBranches','hybridHyssopSpikes','rugosaHyssopSpikes','roseSageBracts','broadSagePanicles','rockinRacemes','guaraniticaShoots','rustySageCalyces','discolorBranches','clevelandWhorls','whiteSageShrub','claryPanicles','pineappleSageBranches','tallBlueSpires','pratensisRosettes','smallSageMounds','patensShoots','cherrySageBranches','officinalisMounds','leucanthaCanes','indigoSpires','perovskiaShoots','dichondraMat','helichrysumFoliage','cushionBush','artemisiaCushion','cerastiumMat','shastaCultivars','bellisRosettes','vincaRunners','paniclePhlox','annualPhloxReferences','chocolateCosmos','autumnAnemone','oxfordMat','melinisTussock','nemorosaWhorls','linariaRacemes','lamiumRunners','cloverStolons','crimsonClover','tiarellaCrowns','heucheraCrowns','ajugaMats','persicariaShoots','pelargoniumErodium','cranesbill','pulmonariaCrowns','perennialVioletShoots','softSucculents','haworthiaCrowns','ribbedSucculents','caudexPlants','agaveRosettes','stoneSucculents','necklacePlants','fleshyGardenPlants','mixedGardenPlants','lateGardenHerbs','uncommonGardenTree','marginGardenPlants','submergedShoots','forestPlants','poppyShoots','rosetteSpires','tubularHerbShoots','leycesteriaCanes','smallPeaHerbs','rhodiolaCrown','seasonalClimbers','betonyGermander','texturedMints','iberisCorymbs','astilbePlumes','aquilegiaCymes','dianthusCymes','verbenaBranches','scabiousHabit','sideritisSpikes','silverMintSpikes','marrubiumWhorls','leonotisTiers','keiskeaRacemes','isodonPanicles','chelonopsisAxils','triporaCymes','leucosceptrumSpikes','melittisAxils','puschkiniaScapes','bletillaShoots','roseaSpire','rugosaSpire','nierembergiaMat','goldenStrawberry','moonCarrot','flamingoRunners','pimpinellaRose','hairyChervil','pinkHogweed','michauxiaAxis','jasioneHeads','tracheliumCorymb','helleboreProfile','shastaAlaska','primroseRosette','gerberaRosette','brunneraSprays','tapienMat','stolonPhlox'].includes(a.architecture)||a.architecture==='beeBalm'&&a.standingWinter&&a.seedHeadMonths?.includes(month)?1:a.persistence==='semiDormant'&&a.architecture!=='beeBalm'&&[12,1,2].includes(month)?.15:!woody&&!dormant&&scale<1?scale:1;
 const headPhase=a.architecture==='berzelia'?bloom?'flower':[11,12,1,2].includes(month)?'bud':'dry':null;
 const retainedSummerLeaves=!!a.winterLeafLength&&[11,12,1,2,3].includes(month);
 if(retainedSummerLeaves)phase='春葉が落ち、小さな夏葉が冬を越す時期（地域差あり）';
 if(a.architecture==='redVeinDockReference'){scale=1;phase=[12,1,2].includes(month)?'国内低温管理苗の紅葉・少葉ロゼットの参考（暖地常緑・完全落葉の条件と残葉量は未予測）':bloom?'赤紫の網目脈と小さな6花被・6雄蕊・3花柱の参考（器官は属資料、月換算は未校正）':'赤紫の葉脈と根生葉の参考（花後の花茎を切る管理例、芽出し・生長・こぼれ種は未予測）';}
 if(a.architecture==='hordeumReference'){scale=1;phase=[12,1,2].includes(month)?'国内低温管理苗の少葉と紅葉の参考（暖地の常緑・完全落葉の条件、残葉量は未校正）':bloom?'春〜初夏の細い芒と3小穂群の外観参考（開花月・本数・色の変化は未予測）':'花後の穂を切り戻した葉群の参考（出穂・枯れ込み・こぼれ種・夏越しは未予測）';}
 if(a.architecture==='planumReferences'){scale=1;phase=[12,1,2].includes(month)?'国内低温管理苗の少葉ロゼットの参考（残葉量・完全落葉・未剪定の枯れ茎は地域と管理で変化）':bloom?'三つ又の枝・青い総苞・密集した小花の参考（開花月と花数は未校正）':'根生葉のロゼットの参考（花茎を切り取る管理例、芽出し・伸長時期と再開花は未予測）';}
 if(a.architecture==='whitetopReferences'){scale=month===3?.4:month===4?.75:1;phase=groundDormant?'国内販売元の冬の地上部休眠の参考（暖地の常緑や冬の切戻しは別条件）':bloom?'白基部と緑先の総苞・中央の小穂・花被のない小花の参考（海外の種の微細構造）':'細い葉の参考（芽出し・花茎の伸長・水深と凍害は未予測）';}
 if(a.architecture==='goldenBambooReferences'){scale=1;phase=[12,1,2].includes(month)?'国内寒冷地の未剪定で葉を落とし稈・節・枝と冬芽を残す参考（半常緑株や切戻し株とは別条件）':month<=4?'春の明るい黄葉と緑の縞の参考（3月頃の芽吹きからの近似、再生量は未予測）':'節から枝分かれする細稈と黄地に緑の条を持つ笹葉の参考（地下茎拡大と花期・周期は未予測）';}
 if(a.architecture==='deschampsiaReferences'){scale=1;phase=a.seedHeadMonths?.includes(month)?'緑の株元の葉と、未剪定で残した乾いた穂の参考（寒冷地の葉枯れ・剪定とは別条件）':a.shootProfile==='northernLights'?'低い株元のクリーム斑の葉と控えめな背の高い穂の参考（葉のピンク色・開花日は未校正）':a.shootProfile==='goldtau'?'緑の株元と黄味のある細い花茎・開いた穂の参考':'緑の株元と明緑から白っぽく見える細かな穂の参考（国内写真の色を優先）';}
 if(a.architecture==='miscanthusReferences'){scale=[0,0,0,.3,.7,1,1,1,1,.9,.6,0][m];phase=a.seedHeadMonths?.includes(month)?'咲いた場合に残る枯れ穂と古葉の参考（地域や剪定による残存量は未校正）':month<=5?'古い茎を春までに整理した株元の芽の参考':a.shootProfile==='goldBar'?'黄色い横斑と直立する低い株の参考（穂は咲いた場合の例で、短い生育期では開花しない記録あり）':a.shootProfile==='morningLight'?'細い葉の白い筋と赤い穂の条件付き参考（開花しない海外試験記録もあり）':'緑葉から紫・赤・橙へ紅葉し白い穂が残る参考（紅葉の順序・開始日は未校正）';}
 if(a.architecture==='elymusReferences'){scale=a.shootProfile==='magellanicus'?[.6,.6,.65,.8,1,1,1,1,1,1,.8,.6][m]:[0,0,.15,.5,.85,1,1,1,1,.9,.6,0][m];phase=a.shootProfile==='magellanicus'?'青白い葉と短い芒の穂の参考（寒冷地の冬は葉が減り、暖地の常緑状態とは異なる）':a.seedHeadMonths?.includes(month)?'未剪定の枯れ穂と古葉を残す参考（種子形成・残存量は未校正）':a.shootProfile==='hystrix'?'初夏の開いたブラシ状の穂の参考（掲載元の花期欄との食い違いがあり月は条件付き）':'青灰色の葉と長い芒を持つ穂の参考（国内の開花日・下垂時期は未校正）';}
 if(a.architecture==='schizachyriumReferences'){scale=[0,0,0,.30,.70,1,1,1,1,.9,.65,0][m];phase=a.seedHeadMonths?.includes(month)?'秋冬の未剪定の枯れ穂と古葉の参考（種子や残存量は未校正）':month<=5?'古い茎を整理した株元からの芽出しの参考':a.shootProfile==='chameleon'?'白い縦斑から秋の赤ピンク色へ変化する参考':a.shootProfile==='haHaTonka'?'銀色の毛を持つ葉と単独の穂の参考（毛密度は未計測）':'成株の青緑葉と単独の穂の参考（苗や多湿では緑がかる）';}
 if(a.architecture==='andropogonReferences'){scale=[0,0,0,.35,.70,1,1,1,1,.9,.65,0][m];phase=a.seedHeadMonths?.includes(month)?'未剪定の枯れ穂と茎を残す参考（紅葉・残存量・種子形成は未校正）':month<=5?'春までに古茎を整理した株元の芽の参考（芽出し月・伸長量は目安）':a.shootProfile==='blackhawks'?'庭植えの暗色葉と三叉状の穂の参考（夏の鉢苗は緑になる条件差あり）':'青緑葉から赤い葉・茎へ変わる参考（暖地の紅葉開始は11月頃という国内案内、地域差は未校正）';}
 if(a.architecture==='chasmanthiumReferences'){scale=a.shootProfile==='laxumSlender'?[.55,.55,.30,.60,.85,1,1,1,1,.9,.7,.55][m]:[0,0,.12,.45,.8,1,1,1,1,.95,.4,0][m];phase=a.seedHeadMonths?.includes(month)?'未剪定で枯れ穂を残した参考（種子の形成・量は描かず、暖地と剪定苗は別条件）':month<=4?'古い茎と穂を整理した株元の芽・若葉の参考（芽出しと伸長量は未校正）':a.shootProfile==='laxumSlender'?'細い葉と直立する小さな小穂の参考（国内寸法単位の記載に疑義、幅は未確認）':'互生の広い葉と垂れる扁平な小穂の参考（国内の正確な小花数・開花日は未計測）';}
 if(a.architecture==='luzulaSelectReference'){scale=1;phase=[12,1,2].includes(month)?'常緑葉に少し枯葉と紅葉が混ざる寒冷地の参考':'厚い緑葉と白い軟毛、初夏の小さな褐色花序の参考（国内Selectの花器・厳密な月は未計測）';}
 if(a.architecture==='tussockReferences'){scale=1;phase=a.shootProfile==='hookRubra'?'国内ルブラの銅赤色〜黒褐色の常緑葉と、晩夏〜秋の細い穂の参考（分類同定・果胞・フックは未確認）':a.shootProfile==='hookFiredance'?'銅赤色の細葉と小さな褐色の穂の参考（日本の花期・果実の発達は未確認）':a.shootProfile==='matrushGold'?'中心が立ち、外周が垂れる黄金葉と葉中の雄花の参考（原品種の構造、国内の同一性と凍害は未確認）':a.shootProfile==='crystalTruncata'?'先が切れた硬い葉と、ほつれる白い薄膜の縁の参考（毛の被覆ではありません）':[12,1,2].includes(month)?'未剪定で残穂と一部の葉を残す冬の参考（国内の半常緑〜落葉の地域差は未校正）':'密な穂が垂れるスノーグラスの参考（NZの季節を日本の暦へ移していません）';}
 if(a.architecture==='acorusReferences'){scale=[12,1,2].includes(month)?(a.shootProfile==='acorusMasamune'?.82:.94):1;phase=[12,1,2].includes(month)?'冬の残葉の参考（葉量・倒れ方・寒冷地の落葉は未校正）':bloom?'2列に重なる剣状葉と、葉状苞の脇の細い花序（小花は種・科の参考構造）':'扇状に重なる細い剣状葉の参考（地下茎の拡大・生育量は未予測）';}
 if(a.architecture==='milletMelicaReferences'){scale=month===3?.5:month===4?.8:1;phase=a.shootProfile==='purpleMajesty'?(groundDormant?'低温期に生育を終える一年草の参考（翌年の再生はしません）':a.seedHeadMonths?.includes(month)?'十分な日照で発色した株と紫の穂の参考（8月頃出穂・9〜10月着色、開花日とは別）':'十分な日照で発色した株の参考（緑の若苗からの変色時期は未予測）'):a.shootProfile==='goldenMilium'?'柔らかい黄金葉と疎らな小穂の参考（高温による葉色の変化と冬の残葉率は未校正）':groundDormant?'国内の低温管理苗・冬の地上部なしの参考（未剪定の成株の残穂は未確認）':a.shootProfile==='melicaRed'?'細い緑葉と垂れる赤紫色の穂の外観参考（夏〜秋の月換算、正確な花期は未確認）':'半球状の細葉と短い白い絹毛の穂の参考（国内の初夏〜盛夏を月換算）';}
 if(a.architecture==='brizaReferences'){scale=month===3?.5:month===4?.8:1;phase=[12,1,2].includes(month)?'低温で葉が落ち、切らずに枯れ穂を残す参考（切戻し苗・暖地の半常緑株とは別条件）':a.seedHeadMonths?.includes(month)?'未剪定で褐色の小穂を残す参考（褐変と残存月は未校正）':bloom?'細い葉と垂れる小穂の外観参考（器官数・花粉・結実は未再現）':'細い葉の参考（芽出し・茎の伸長・剪定後の再生は未校正）';}
 if(a.architecture==='pennisetumReferences'){scale=month===3?.35:month===4?.7:1;phase=groundDormant?'国内の寒冷地・低温管理苗の地上部なしの参考（暖地・未剪定成株の残穂は別条件）':[12,1,2].includes(month)?'未剪定で褐色の葉・穂を残す冬の参考（低温管理で切り戻した販売苗とは別条件）':month===3||month===4?'早春に古葉・古穂を整理した管理例と新葉の参考（再生量・月境界は未予測）':bloom?'開花段階の異なる穂が混在する外観参考（微細器官・種子形成は未再現）':'弓状の細葉と株立ちの参考（葉数・草姿・年次拡大は近似）';}
 if(a.shootProfile?.startsWith('fescue')){scale=1;phase=bloom?'細い花茎から枝分かれする小穂の外観参考（小花・果実内部は未再現）':[12,1,2].includes(month)?a.shootProfile==='fescueIntense'?'枯葉が少ない常緑の青銀葉の参考（低温応答・地域差は未校正）':'冬も葉を残し古葉が混ざる未剪定株の参考（枯葉量・切戻し後は未校正）':a.shootProfile==='fescueScoparia'?'短い緑葉が密生する低い半球形の参考（流通名の同定は未確認）':a.shootProfile==='fescueGolden'?'黄色と銀灰色が混ざる細葉の参考（真夏の緑がかり・発色は近似）':'青銀色の細葉の参考（夏の発色・葉数と曲がりは近似）';}
 if(a.architecture==='otherCarexReferences'){const cold=['aurea','banana'].includes(a.shootProfile);scale=groundDormant?0:cold?(month===3?.55:month===4?.8:1):1;phase=groundDormant?'寒冷地の冬の地上部休眠の参考（暖地の残葉・未剪定の残茎・境界月は未校正）':a.shootProfile==='remota'&&[12,1,2].includes(month)?'英国販売園の褐色の葉を残す冬姿の参考（好条件の緑葉・日本の冬は未校正）':a.shootProfile==='morrow'?(bloom?'常緑の覆輪葉と春の小穂の参考（既存名とRHS資料名の同定差は未確認）':'常緑の覆輪葉の参考（既存名とRHS資料名の同定差は未確認）'):cold&&month===3?'春の展葉の参考（芽出し日・葉量・月の境界は未校正）':bloom?a.shootProfile==='aurea'?'直立する褐色の穂と淡い糸状部の外観参考':a.shootProfile==='remota'?'大きく間隔を空けた淡黄緑色の小穂の外観参考':'広い黄中斑の葉と疎らな小穂の外観参考':'品種・販売株の葉姿の参考（葉数・発色・年次拡大は未校正）';}
 if(a.architecture==='blueCarexReferences'){scale=1;phase=[12,1,2].includes(month)?'寒冷地で葉が少なくなる未剪定株の冬の参考（霜の少ない地域では常緑、葉量は未校正）':bloom?a.shootProfile==='bunny'?'葉の間に斜めに付く黄白〜淡褐色の小さな穂の外観参考':'細い上部の穂と、柄を分ける暗褐色の穂の外観参考（性器官・果実内部は未再現）':[7,8].includes(month)?'真夏にやや緑がかる青葉の参考（発色・気象応答は未校正）':'青緑〜青銀色の株立ちの参考（葉幅・株の拡大は近似）';}
 if(a.architecture==='fineCarexReferences'){scale=1;phase=[12,1,2].includes(month)?'未剪定で常緑葉を残す冬の成株の参考（古葉・地域差は未校正）':a.shootProfile==='bronze'?'細い茶褐〜オリーブ色の葉と巻く葉先の参考（国内の花期は未確認）':bloom?'小さな褐色の穂を枝や細い柄に付ける外観参考（性器官・果実内部は未再現）':['jenneke','frosted'].includes(a.shootProfile)&&[7,8].includes(month)?'真夏にやや緑がかる細葉の参考（発色・境界月は未校正）':'細葉と株立ちの常緑姿の参考（葉数・年次拡大は未校正）';}
 if(a.architecture==='oshimensisReferences'){scale=1;phase=[12,1,2].includes(month)?'常緑葉を残す未剪定成株の冬の参考（古葉の傷み・地域差は未校正）':a.shootProfile==='goldRetail'?'販売表記Everirroのライム色の葉の参考（品種同定・発色条件は未確認）':a.shootProfile==='evergold'&&[7,8].includes(month)?'真夏にやや緑がかる中央斑の参考（割合・気象応答・境界月は未校正）':bloom?'短い褐色の穂と淡い糸状部の外観参考（性配置・果胞・果実内部は未再現）':'立ち上がる新葉と地際へ垂れる常緑葉の参考（葉数・年次拡大は未校正）';}
 if(a.architecture==='ophiopogonReferences'){scale=a.shootProfile==='vittatus'&&[12,1,2].includes(month)?.90:1;phase=a.shootProfile==='snow'?'販売写真の常緑の白斑葉の参考（種同定・花期・花姿が未確認のため花は非表示）':a.shootProfile==='black'?([12,1,2].includes(month)?'黒葉を残す未剪定成株の冬の参考（低温管理苗の切戻しとは別条件）':bloom?'淡紫の下向きの小花の参考（国内とKPUの開花時期に差あり）':'黒葉と緑を残す基部の参考（芽数・発色・月境界は未校正）'):[12,1,2].includes(month)?'保護・暖地で葉を残す冬の参考（耐寒性・葉枯れと剪定後の再生は未予測）':bloom?'葉の間の低い位置の白い小花の販売写真参考（花の内部は属の近似）':'白い縦斑の細葉の販売写真参考（種・品種の同定は販売表示まで）';}
 if(a.architecture==='liriopeReferences'){const managed=!['silver','unnamed'].includes(a.shootProfile);scale=managed?(month===1?.20:month===2?.18:month===12?.30:month===3?.35:month===4?.70:1):[12,1,2].includes(month)?.90:1;phase=managed&&[12,1,2].includes(month)?'国内の低温管理苗で古葉を切り戻した冬の参考（未剪定成株は別条件）':managed&&month<=4?'切戻し後の新葉の参考（芽出し・再生量・月境界は未予測）':a.shootProfile==='blonde'?(month<=6?'白い新葉から淡緑へ変わる春〜初夏の参考（発色・月境界は未校正）':'夏の黄緑葉と青紫の花の参考（常に白い葉ではありません）'):a.shootProfile==='ingot'?'春の黄葉と日向で淡くなる葉の参考（半日陰の発色・照度応答は未校正）':bloom?'6枚の花被片をもつ小花の房の参考（開花月・花数は資料からの目安）':'常緑の帯状葉を残す株姿の参考（残葉量・冬の傷みは未校正）';}
 if(a.architecture==='hakonechloaReferences'){scale=month===3?.30:month===4?.65:month===5?.90:1;phase=[12,1,2].includes(month)?'枯葉を冬も残す未剪定の参考（残葉量・月境界は未校正）':month<=4?'新芽前に枯葉を整理した管理例（芽出し日・再生量は未予測）':bloom?'葉の間に上がる目立たない穂の参考（8〜9月は季節記述からの目安）':month>=10?'秋の橙褐色と、斑入り型の赤みの参考（発色・境界月は未校正）':'節に交互に葉を付けて垂れる草姿の参考（品種同定・年次拡大は未検証）';}
 if(a.architecture==='stipoidReferences'){scale=a.shootProfile==='nassella'?1:month===3?.40:month===4?.75:1;phase=groundDormant?'国内の低温管理株で地上部を整理した冬の参考（未剪定成株の残穂は未確認）':a.shootProfile==='nassella'?([12,1,2,11].includes(month)?'RHSの春まで枯葉を残す案内を参考にした褐色の葉（国内の冬姿・残穂は未確認）':'針状の細葉と長い芒の参考（販売名エンジェルヘアー・品種固定性は未確認）'):a.seedHeadMonths?.includes(month)?(a.shootProfile==='allgau'?'小麦色の穂と枯れた葉を残す未剪定の参考（残存量・月境界は未校正）':'秋の白い綿状の残穂の参考（結実・種子散布・月境界は未校正）'):bloom?'低い細葉の上に上がる柔らかな穂の参考（開花月の換算は目安）':'春の細葉と株姿の参考（芽出し時期・葉量は未校正）';}
 if(a.architecture==='rugosaSourceReferences'){scale=1;phase=bloom?(a.shootProfile==='golden'?'国内の初夏を5～6月へ換算した小花の参考（明示月ではない）':'国内販売元に明記された5～10月の小花の参考'):a.seedHeadMonths?.includes(month)?'未剪定の成株で花後の穂を残す参考（実際の種子と残存月は未校正、販売苗は別条件）':'対生する鋸歯葉と冬の管理条件による参考（月別葉量・成長は未予測）';}
 if(a.architecture==='bergamoAnnualReference'){scale=1;phase=bloom?'国外品種試験の6～8月を参照した段状の二唇形花（国内は夏）':'一年草の参考姿。小さい冬苗・春の姿と蕾月は未校正、同じ株の翌年再生はしません。';}
 if(a.architecture==='ogisMonardaColourReferences'){scale=1;phase=a.seedHeadMonths?.includes(month)?'長野の未剪定の成株で丸い花後の頭と茎を残す参考（冬の残葉量・月境界は未校正、切戻し苗は別条件）':bloom?'夏を6～8月へ換算した二唇形小花の写真例（花色別商品で品種未固定、明示月ではない）':'対生の鋸歯葉と春に花殻を整理した参考（月境界・成長量は未予測）';}
 if(a.architecture==='retailMonardaReferences'){scale=1;phase=[1,2,12].includes(month)?(a.shootProfile==='pink'?'冬に地上部が枯れる販売苗を参考にした落葉と残した茎（残存量・花殻・冬芽は未確認）':'冬姿未確認のため花のない暖期の葉姿を保持する未検証参考（常緑・越冬成功の断定なし）'):bloom?'国内販売元の明示花期・対生の鋸歯葉と苞に囲まれた二唇形小花の参考（属の形態、商品実測ではない）':'花のない茎葉の参考（伸長・花後の花殻・種子・月別葉量は未校正）';}
 if(a.architecture==='ruelliaTropicstarReference'){scale=1;phase=[1,2,12].includes(month)?'温度を保護した冬の残葉の参考（戸外の生存や全国一律の越冬は未予測）':bloom?'国内販売元の8～10月の5裂漏斗花と細い対生葉の参考（1日花の時間変化は未再現）':'細い対生葉と分岐茎の参考（月別の葉量・成長量は未校正）';}
 if(a.architecture==='wildHelleboreReferences'&&['purpurascens','torquatus','cyclophyllus','abruzzicus','multifidus','croaticus','dumetorum','serbicus','viridis'].includes(a.shootProfile)){scale=1;phase=density===0?'寒冷地で冬に葉を整理し短い茎を残す管理例（暖地の残葉・自然落葉率は未予測）':month>=6&&month<=11?'夏越し後に根生葉の群を減らした少葉の参考（密度・月の区切りは実測ではない）':'根生葉と別の花軸の参考（春の展葉量・花数は未校正）';}
 if(a.architecture==='wildHelleboreReferences'&&a.shootProfile==='bocconei'){scale=1;density=1;phase=[12,1].includes(month)?'冬の古葉を切らず一部の葉を残す保護管理の参考（剪定した苗・残葉率は別条件）':month>=6&&month<=11?'夏越し後に根生葉の群を減らした少葉の参考（密度・境界月は未実測）':'根生葉と花径5〜6cmを参考にした花の参考（展葉量・花数は未校正）';}
 if(a.architecture==='wildHelleboreReferences'&&a.shootProfile==='liguricus'){scale=1;density=1;phase=[6,7,8,12,1].includes(month)?'夏冬の褪色を近似した常緑の残葉の保護例（未剪定・強さと境界月は未実測）':'健康な常緑の根生葉と花後に上部の花軸を整理した参考（新葉量・切戻し後の再生は未校正）';}
 if(a.architecture==='wildHelleboreReferences'&&a.shootProfile==='odorus'){scale=1;density=1;phase=bloom?'根生葉と別に伸びる花軸と黄緑の皿形花の参考（晩冬〜春を2〜5月へ換算）':'花後に上部の花軸を整理し、健康な根生葉を残す保護管理の参考（寒冷時の落葉率・新葉量は未予測）';}
 if(a.architecture==='argutifoliusReferences'){scale=1;density=1;phase=bloom?'国内販売元の晩冬〜春を2〜5月へ換算した、緑の杯状花の房咲きの参考（花数・連続開花は未予測）':[12,1,2].includes(month)?'葉付きの有茎と厚い3小葉を残す保護条件の冬姿の参考（低温苗の紅葉・寒害・残葉率は未予測）':'葉付きの有茎を残し上部の花房を花後に整理した管理例の参考（夏の葉減り・新葉量は未予測）';}
 if(a.architecture==='lividusReferences'){scale=1;density=1;phase=bloom?'国内販売元の晩冬〜春を2〜5月へ換算した、うつむく花の参考（銀葉型の花は基本種共通との本文に基づく）':[12,1,2].includes(month)?'葉付きの有茎と3小葉を残す保護条件の冬姿の参考（低温での紅葉・寒害と残葉率は未予測）':'葉付きの有茎を残し上部の花序を花後に整理した管理例の参考（夏の葉減り・新葉量は未予測）';}
 if(a.architecture==='nigerCultivarReferences'){scale=1;phase=bloom?'国内販売元の冬〜春を12〜5月へ換算した八重花の参考（葉は保護条件・同じ株の花期や若株の花形は未予測）':[12,1,2].includes(month)?'低温のハウス苗で葉を残す保護条件の参考（寒冷地の古葉落葉・露地の越冬は別条件）':'花後の花茎を整理し根生葉を残す参考（月別の展葉量・自然な花茎消失日は未予測）';}
 if(a.architecture==='nigerCultivarReferences'&&['seedDouble','variegata','marble'].includes(a.shootProfile)){scale=1;phase=a.shootProfile==='marble'?'国内販売元の冬〜春は花期の参考案内。品種の花姿は未確認のため3Dは葉脈に沿う白斑の葉だけを表示（葉は保護条件）':bloom?(a.shootProfile==='seedDouble'?'実生で花形に幅のある白い八重花の写真例（冬〜春の月換算・葉は保護条件）':'不規則な刷毛目状の斑と白い一重の萼片の写真例（冬〜春の月換算・葉は保護条件）'):'花後に花茎を整理して葉を残す管理の参考（月別の葉量・斑の変化・古葉落葉は未予測）';}
 if(a.architecture==='nigerCultivarReferences'&&a.shootProfile==='snowDrift'){scale=1;phase=bloom?'15cm大苗の実物写真を参考にした細弁の白い八重花（冬〜春の月換算・葉は保護条件）':'細めの小葉と花後に花茎を整理した管理の参考（小苗のラベル・正確な展葉量・古葉落葉月は未採用・未予測）';}
 if(a.architecture==='woodlandPhloxReferences'){scale=1;phase=[1,2,12].includes(month)?(a.shootProfile==='retailWhite'?'国内商品本文の半常緑と表の落葉が不一致のため、少葉を選んだ冬の未検証参考（月別の残葉量・越冬は未予測）':a.shootProfile==='montrose'?'国内販売元の冬のロゼットを選んだ参考（月別の葉量は未校正）':'英国品種資料の半常緑性を選んだ冬の保護参考（日本の地植えの越冬保証ではない）'):bloom?(a.shootProfile==='retailWhite'?'国内販売元に明記された4〜6月頃の白い5裂花と淡桃紫の喉部の参考':a.shootProfile==='montrose'?'国内販売元に明記された3～5月の淡青色の花と白覆輪の参考':'英国品種資料の季節表現を月へ換算した花の参考（国内の明示月ではない）'):'対生葉のはう茎と立つ茎の参考（節の発根・成長量は未予測）';}
 if(a.architecture==='mallowReferences'){scale=1;phase=groundDormant?'ブルーファウンテンの低温管理で枯れ茎を整理した冬の参考（未剪定株は別条件）':[1,2,12].includes(month)?(a.shootProfile==='zebrina'?'ゼブリナの保護した切戻し株の少ない根出葉の参考（国内の冬姿は未検証）':'ビバーフェルムの保護した少葉の未検証参考（寿命・葉の残り方は未確認）'):bloom?'初夏の5枚の花弁と濃い筋の参考（国内の明示月ではない）':'掌状の葉と伸びる枝の参考（年次成長・秋の再開花は未予測）';}
 if(a.architecture==='retailPeachBellReferences'){scale=1;phase=bloom?'国内販売元に明記された5～6月の白花・青花の参考（同一株の開花日は未予測）':[1,2,12].includes(month)?'冬の小さなロゼットを残す保護条件の参考（寒冷時の完全落葉は別条件）':[9,10,11].includes(month)?'花茎を整理して根出葉を残す管理参考（自然な消失時期ではない）':'根出葉と細い茎葉の参考（芽出し・蕾の月境界は未観測）';}
 if(a.architecture==='fineAmsoniaReferences'){scale=1;phase=groundDormant?'冬の枯れ茎を株元で整理した管理参考（自然消失・越冬成功を保証しません）':a.shootProfile==='hubrichtii'?(month<=5?'低い位置の開花・蕾と糸葉の参考（月境界・実際の草丈は未校正）':month===6?'低い花茎と伸びる新枝の参考（年内変化で年次成長ではない）':'花後に伸びる糸葉の枝と黄葉の参考（月別の成長量は未予測）'):'高い位置の小花群・互生する細葉と黄葉の参考（新葉の縁毛・月別葉量は未校正）';}
 if(a.architecture==='stormcloudReferences'){scale=1;phase=bloom?'国内の販売元ごとの季節表現を月へ換算した参考（明示月・現物の開花保証ではない）':[1,2,12].includes(month)?'冬の少ない残葉と茎を残す保護条件の参考（落葉・寒害・地域差は未予測）':[3,4,5].includes(month)?'春の黒軸と銀色葉脈の参考（小さい入力を株齢と読み替えず・実株は若株で色が弱い場合あり）':'広がる枝葉と黄葉の参考（月別の葉量・年次成長・剪定応答は未校正）';}
 if(a.architecture==='amsoniaEllipticaReferences'){scale=1;phase=groundDormant?'国内の低温管理・落葉と花茎を整理した参考（枯茎の自然消失・越冬成功は未予測）':bloom?'国内で明示された5～6月の花と茎上の互生葉の参考（株姿・花数は未実測）':month===11?'黄葉と落葉途中の参考（11月という境界と残葉率は未実測）':'互生する細い葉と直立茎の参考（年次成長・剪定応答は未予測）';}
 if(a.architecture==='tulbaghiaReferences'){scale=1;phase=bloom?'国内の初夏～秋を5～11月へ換算した参考（連続開花・花後の再開花時期は未保証）':[1,2,3,12].includes(month)?'寒冷地の低温管理で葉が減る参考（残葉率・寒害・越冬成功は未予測）':'白銀の覆輪葉と株元の参考（年次成長・芽出し月は未校正）';}
 if(a.architecture==='delavayiReferences'){scale=1;phase=groundDormant?'冬の落葉と花後の茎を整理した参考（月境界・未剪定の枯茎・地域差は未校正）':bloom?'国内の初夏を5～6月へ換算した参考（英国・中国の花期とは別条件）':month===11?'晩秋の黄葉と落葉途中の参考（黄葉月・葉量は未実測）':'互生する3回複葉と細い茎の参考（年次成長・剪定応答は未予測）';}
 if(a.architecture==='chrysanthemumReferences'&&a.shootProfile==='winterDuet'){scale=1;phase=bloom?'東海地方基準12月～翌1月の2株混色の写真参考（各色の品種名対応・越冬・翌年再生は未確認）':'未確認月は葉姿を保持する参考（常緑や越冬を保証せず・実株数を自動分割しない）';}
 else if(a.architecture==='chrysanthemumReferences'&&a.flowerPalette?.regime==='naturalMayJuly'){scale=1;phase=[1,2,12].includes(month)?'花後の枯茎を整理し株元の芽を保護した参考（冬姿・越冬は未保証）':bloom?'通常栽培5～7月の参考（電照販売株8～9月とは別条件・生育年で管理条件を推定しない）':'通常栽培の参考（電照・販売時の草丈と成長後の株姿は別条件）';}
 else if(a.architecture==='chrysanthemumReferences'){scale=1;phase=[1,2,12].includes(month)?'花後の枯茎を整理し株元の芽と小さい葉を保護した参考（越冬成功・自然な一律消失は未保証）':bloom?'国内の明示月に沿う品種別頭花の参考（東海地方基準・年次成長と現物解剖は未校正）':'互生する切れ込み葉と摘芯後の分枝株の参考（摘芯応答・年次成長は未予測）';}
 if(a.architecture==='annLeysReferences'){scale=1;phase=bloom?'緑～黒紫の細長い片からなる頭花の外観参考（器官同定・内部構造・稔性は未確認）':'国内の季節表記から選ぶ参考月と寒冷地の花後整理例（年次成長は未予測）';}
 if(a.architecture==='gardenAsterReferences'){scale=1;phase=bloom?(a.shootProfile==='crimsonBrocade'?'国内販売元の明示月に沿う頭花の参考（年次成長・月別実物照合は未校正）':'国内の季節表記から選ぶ品種別頭花の参考（月別実物照合・連続開花は未予測）'):'寒冷地で花後整理した管理例（全国の冬姿・年次成長は未予測）';}
 if(a.architecture==='showmakersAsterReferences'){scale=1;phase=bloom?'国内の秋表記から選ぶ八重頭花の参考（月別実物照合・施設作型は未予測）':'花後整理を含む寒冷期の管理例（全国の越冬・年次成長は未予測）';}
 if(a.architecture==='callistephusReferences'){scale=1;phase=bloom?'品種別の枝分岐・頭花の参考（播種・施設作型による開花は未予測）':'春植えの一年草の参考（花後は整理し再植栽なしの翌年自動再生はしない）';}
 if(a.architecture==='gaillardiaSourceReferences'){scale=1;phase=a.seedHeadMonths?.includes(month)?'球状の花がらを残す参考例（果実・種子は未再現）':bloom?'品種別の三裂舌状花と筒状花の参考（連続開花・再開花は未予測）':'単葉と枝分岐の参考（冬は枯れ茎を整理した低温管理例）';}
 if(a.architecture==='achilleaReferences'){scale=1;phase=a.seedHeadMonths?.includes(month)?'花がらを残す秋の管理例（実際の果実・種子は未再現）':bloom?'品種ごとの頭花の参考（連続開花と切戻し後の再開花は未予測）':'品種ごとの葉の参考（冬は低温管理で枯れ茎を整理した例）';}
 if(a.architecture==='autumnJoyReferences'){scale=1;phase=month===3?'古い茎と花房を整理し短い葉を示す管理例（萌芽日は未校正）':a.seedHeadMonths?.includes(month)?'枯れた花房と茎を残す冬の管理例（種子・果実は未再現）':bloom?'小さな淡色花弁と大きな赤桃色心皮が目立つ花型の参考':'厚みのある単葉と茎の参考（天候・年次成長は未予測）';}
 if(a.architecture==='milleniumAlliumReferences'){scale=1;phase=month===3?'低温管理苗の小さな芽出しを参考表示（成株の萌芽日は未校正）':a.seedHeadMonths?.includes(month)?'淡褐色の花がらと緑の葉を残す管理例（果実・種子は未再現）':bloom?'夏も残る葉と球状花序の参考（花数・開花日は未校正）':density===0?'冬に枯れた地上部を整理した低温管理例（暖地の残葉は別条件）':'厚みのある平たい根生葉の参考（年次伸長は未予測）';}
 if(a.architecture==='limelightHydrangeaReferences'){scale=1;phase=a.seedHeadMonths?.includes(month)?'乾いた萼と枝を残す花後の管理例（冬の残存量は未校正）':bloom?'4枚の拡大萼と内部の小花からなる円錐花房（色・花数は参考）':month===3?'3月に古い花房を整理する管理例（剪定反応・萌芽日は未予測）':density===0?'落葉後に木質の枝を残す参考（冬姿・樹齢は未校正）':'対生の単葉と当年枝の参考（伸長・開花能力は未予測）';}
 if(a.architecture==='magnusEchinaceaReferences'){scale=1;phase=month===3?'春に枯れ茎と古い頭花を整理した管理例（剪定後の回復は未校正）':a.seedHeadMonths?.includes(month)?'花後の枯れ茎と尖った鱗片を残す管理例（残存月・結実量は未校正）':bloom?'水平に広く開く赤紫の舌状花と円錐上の小花の参考（花器・開花段階は模式例）':'根生葉と互生の茎葉（萌芽日・年次成長は未校正）';}
 if(a.architecture==='hostaCultivarReferences'){scale=month===4?.65:month===5?.85:1;phase=groundDormant?'国内の低温管理で枯葉を整理した休眠期（地上部なし・月境界は未校正）':bloom?'品種別の葉と葉上に伸びる総状花序の参考（初夏～盛夏を月換算）':month===4?'4～5月の展葉を参考表示（萌芽日は地域・品種で変化）':'品種別の葉と斑の季節参考（発色・苗齢・葉齢は未予測）';}
 if(a.architecture==='reedFoliageReferences'){scale=month===3?.35:month===4?.65:1;phase=[12,1,2].includes(month)?'落葉後の枯れ茎を残す未剪定の参考（実際の残存率・刈込みは未確認）':a.shootProfile==='dawn'&&[9,10,11].includes(month)?'秋にピンクを帯びる縞葉の参考（着色月・量は未校正）':'節に互生する白い縞葉の参考（登録学名との種対応・花期は未確認）';}
 if(a.architecture==='canaryReferences')phase=groundDormant?'夏に生育を終える一年草（翌年の自然発芽は自動予測せず新たな植付けで表現）':a.seedHeadMonths?.includes(month)?'花後に乾いた包穎を残す参考（種子は未表示）':bloom?'国内の初夏の穂と白い翼・緑の葉脈の参考（月境界は目安）':'初夏まで育つ耐寒性一年草の葉（播種日・苗齢・発芽は未予測）';
 if(a.architecture==='sorghastrumReferences'){scale=month===3?.35:month===4?.65:1;phase=groundDormant?'国内の落葉株を春の芽出し前に整理した冬の管理例（海外の未剪定の残穂は別条件）':a.seedHeadMonths?.includes(month)?'花後の乾いた穂を残す秋の参考（種子・残存率は未再現）':bloom?'銀青色の葉と品種別の穂の参考（日本の正確な開花日は未予測）':'銀青色の葉と直立する茎の参考（地下茎での拡大は未予測）';}
 if(a.architecture==='boutelouaReferences'){scale=month===3?.35:month===4?.65:1;phase=a.seedHeadMonths?.includes(month)?'乾いた水平の穂と少ない古葉を残す未剪定の冬の参考（刈込みは別条件）':bloom?'片側に2列で小穂が並ぶ水平な穂の参考（開花数・密度は未計測）':'細葉の株元と春の伸長の参考（芽出し日・苗齢は未予測）';}
 if(a.architecture==='sandLovegrassReference'){scale=month===3?.55:month===4?.8:1;phase=[12,1,2].includes(month)?'休眠期に錆褐色の葉を残す米国の種資料を参考にした未剪定例（国内の冬姿は未確認）':a.seedHeadMonths?.includes(month)?'秋の赤味のある葉と紫を帯びる枯れ穂の参考（種子は未表示）':bloom?'国内の初夏の細かな花の参考（暦月と小穂密度は目安）':'新葉と細い互生の茎葉の参考（芽出し日や年次成長は未校正）';}
 if(a.architecture==='sesleriaReference'){scale=1;phase=a.seedHeadMonths?.includes(month)?'秋に乾いた短い穂を残す参考（残存期間は未校正）':bloom?'若緑色の葉と短い白い穂の参考':month>=10||month<=2?'黄葉〜橙褐色の葉を残す温暖地の参考（極寒冷地の落葉は別条件）':'明るい若緑色の葉の参考';}
 if(a.architecture==='imperataRedReference'){scale=month===3?.45:month===4?.75:1;phase=groundDormant?'国内の落葉後に株元で整理した冬の管理例（地下茎・冬芽は未再現）':bloom?'国内の初夏という記載に基づく咲いた場合の参考（個体の開花能力は未予測）':month>=9?'葉全体が黄・赤になる秋の参考（日照と地域差は未校正）':'緑の葉元から赤い葉先へ変わる参考（色の割合は未計測）';}
 if(a.architecture==='cortaderiaReferences'){scale=1;phase=a.seedHeadMonths?.includes(month)?'乾いた穂と残葉を残す未剪定の温暖地参考（寒冷地の落葉・刈込みは別条件）':bloom?'国内写真を参考にした白〜ごく淡い桃色の毛のある穂（個体の性別・苗齢は推定しません）':'長い線形葉が放射状に広がる参考（大小入力は寸法例で苗齢ではありません）';}
 if(a.architecture==='moliniaReferences'){scale=1;phase=a.seedHeadMonths?.includes(month)?'黄色くなる茎と乾いた細い穂を残す未剪定の参考（残存量は未校正）':bloom?'縞のある株元の葉と細かく枝分かれする穂の参考':'国内の低温管理で冬に地上部を整理した参考（温暖地の残葉は別条件）';}
 if(a.architecture==='calamagrostisReferences'){scale=month===3?.30:month===4?.65:month===5?.85:1;phase=month<=4&&month>=3?'冬の終わりに地際で整理し、新葉が伸びる管理例（剪定日・芽出しは未校正）':a.seedHeadMonths?.includes(month)?'開花後の褐色の穂を残す未剪定の参考（残存量・月境界は未校正）':bloom?'細かく枝分かれした開いた穂の参考（花期の月換算は目安）':'茎の節に付く細葉と株姿の参考（葉幅・密度は未校正）';}
 if(a.architecture==='panicumReferences'){scale=month===4?.30:month===5?.65:1;phase=month===3?'冬の終わりに地際で整理した参考例（自然な消失・実際の剪定日とは別）':a.seedHeadMonths?.includes(month)?'開花後の穂と枯れた葉を残す未剪定の参考（残存量・月境界は未校正）':bloom?'細かな2小花の小穂と品種別の葉の参考（開花月は季節記述からの目安）':month<=5?'春の伸長と葉先の色の参考（芽出し日・着色は未校正）':'茎に互生する線形葉と品種別の株姿（葉幅・密度・季節色は参考）';}
 if(a.architecture==='tallEupatorieae'){scale=month===3?.35:month===4?.70:1;phase=groundDormant?'国内の低温管理苗の地上部なしの参考（未剪定成株・暖地・月境界は別条件）':a.shootProfile==='ivory'?'輪生葉と初回6～7月の白花。切戻しが条件の秋の再開花は自動表示しません':a.shootProfile==='atropurpureum'?(a.seedHeadMonths?.includes(month)?'未剪定で枯れた花序と茎を残す参考（果実・冠毛・残存月は未校正）':month===6?'初夏の輪生葉と蕾の参考（開花への切替日は未校正）':'暗い茎・輪生葉と平らな集合花房の参考'):a.shootProfile==='pinkFrost'?'広いクリーム斑と季節の赤みの参考（斑量・着色時期は未校正）':a.shootProfile==='hagoromo'?'細裂する単葉と桃色の小花の参考（原種・交雑来歴は未確定）':'対生する3裂葉と単純な上部葉・白い小花の参考（微毛・腺点・成長は未校正）';}
 if(a.architecture==='muhlenbergiaPanicles'){scale=1;phase=groundDormant?'国内の低温管理苗で地上部を整理した冬の参考（暖地・未剪定成株とは別条件）':a.seedHeadMonths?.includes(month)?'未剪定で枯れ穂を残す冬の参考（残存量・月境界・霜は未校正）':a.shootProfile==='whiteCloud'?'白い穂の参考例（販売苗の花色は未確認・先祖返りの可能性あり）':a.shootProfile==='reverchonii'?'低い位置から広がる細かな円錐花序と葉（冬の枯れ穂の保持は未確認）':'種別の細葉と細かな円錐花序の参考（密度・成長・剪定・月境界は未校正）';}
 if(a.architecture==='eupatorieaeReferences')phase=groundDormant?'国内の低温管理苗の地上部なしの参考（境界月・暖地・未剪定成株は未校正）':a.shootProfile==='chocolate'?(month===12?'初冬の黄葉と白花の写真を参考表示（実際の月・残葉量は未予測）':month<5?'春の濃い銅葉の参考（芽出し時期は未校正）':month<9?'夏の淡い銅葉と新葉の参考（色の変化は未校正）':'葉と白い頭花の参考'):month<5?'低温期から芽吹く対生葉の参考（実時期は未校正）':'対生する鋸歯葉と分枝した株姿の参考';
 if(a.architecture==='aegopodiumReferences')phase=groundDormant?'国内の低温管理苗の地上部なしの参考（暖地・未剪定株・月境界は未校正）':month===3?'芽吹き直後の緑葉の模式例（実際の時期・割合は未校正）':month===4?'緑の若葉と斑入り葉の混在例（切替日は未予測）':'斑入りの複葉が広がる参考姿（地下茎の伸長は未予測）';
 if(a.architecture==='oxypetalumReferences'&&[12,1,2].includes(month))phase='保護・剪定後に少ない葉を残す冬の管理例（凍害・自然な残葉量は未予測）';
 if(a.architecture==='patriniaReferences'&&a.standingWinter&&[12,1,2].includes(month))phase='冬の枯れ茎と乾いた集散花序を残す管理例（残存期間・結実は未確認）';
 if(a.architecture==='veronicastrumReferences'&&a.standingWinter&&[12,1,2].includes(month))phase='冬の枯れ茎と花後の穂を残した管理例（暦月は目安）';
 if(a.persistence==='winterSubmerged')phase=groundDormant?'水上葉のない時期（水中葉で越冬）':'水上葉と水中葉のある時期';
 if(a.persistence==='managedSubmerged')phase=groundDormant?'冬は沈水させて保護する管理例（水上表示なし・月は目安）':'暖期の水上形を表示する管理例（月は目安）';
 if(a.architecture==='haworthiaCrowns')phase=[7,8].includes(month)?'保護栽培・高温期も厚葉を残す姿（参考）':'保護栽培・厚葉の株姿（参考）';
 if(a.architecture==='ribbedSucculents')phase=bloom?'保護栽培・開花条件を満たした株の参考':'保護栽培・地上の多肉質の茎を残す姿（参考）';
 if(a.architecture==='agaveRosettes')phase='開花前のロゼット（参考）。開花年齢・結実後の枯死は未再現';
 if(a.architecture==='stoneSucculents'&&a.shootProfile==='conophytum')phase=[6,7,8].includes(month)?'乾いた旧葉の皮に包まれた夏の休眠姿（境界月は目安）':'旧葉から出た多肉質の葉体（参考）';
 if(a.architecture==='stoneSucculents'&&a.shootProfile==='dodrantale')phase=[6,7,8].includes(month)?'葉を閉じた夏の休眠姿（境界月は目安）':'開いたロゼット（参考）';
 if(a.architecture==='necklacePlants'&&a.shootProfile==='drimia')phase=density===0?'露出した球根を残す冬の姿（境界月は表示目安）':'細葉と細く分かれる花茎（表示目安）';
 if(a.architecture==='mixedGardenPlants'&&a.shootProfile==='cyclamen')phase='涼しく管理して葉を残す栽培例（高温時の夏休眠は別条件）';
 if(a.architecture==='mixedGardenPlants'&&a.shootProfile==='gilia')phase=groundDormant?'花後に枯れる一年草（翌年の自然再生は保証なし）':'秋播き・春植えの一年草の参考';
 if(a.persistence==='protectedWinter')phase=groundDormant?'冬は保護場所へ移動する想定（屋外表示なし）':'保護越冬した株を暖期に戻す想定';
 if(a.persistence==='sporeAnnual')phase=groundDormant?'浮葉のない時期・胞子で越冬（翌年の再生は未表示）':'関東の生育期の参考・花をつけない水生シダ';
 const fruitStage=a.fruitMonths?.includes(month)?'ripe':a.fruitMonths?.includes(month===12?1:month+1)?'early':a.architecture==='porcelainVine'&&[8,9,10,11].includes(month)?month===8?'early':'ripe':null,flowerFinished=a.architecture==='proteaEryngo'&&month>Math.max(...flowerMonths);
 if(a.sourceConflict)phase+='／'+a.sourceConflict;
 return {bloom,dormant,retainedSummerLeaves,groundDormant,shootScale,autumn,known,month,seasonName:season,flowerBuds:!bloom&&!!a.budMonths?.includes(month),headPhase,fruitStage,flowerFinished,springFlush:[4,5].includes(month),seedHeads:!!a.seedHeadMonths?.includes(month),leafDensity:density,leafScale:scale,leafColor:color,flowerDensity,flowerColor:a.monthlyFlowerColors?.[m]||info.flower,leafPatternColor:a.monthlyPatternColors?.[m]||a.patternColor,phase,timingBasis:['fernFrondReferences','athyriumFormReferences','paintedFernReferences','crestedEaredFernReferences'].includes(a.architecture)?'花をつけないシダ植物':a.flowerTiming==='months'?'資料に月の記載あり':'季節からの表示上の目安',label:bloom?'開花・'+phase:known?phase:phase+'（花期未確認）'};
}
