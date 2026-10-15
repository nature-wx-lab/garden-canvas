import {treeProfile} from './tree-profiles.js?v=0.9.319';
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
 }else if(a.persistence==='summerDormant'||info.form==='cyclamen'){
  density=[1,1,1,.9,.6,.1,0,0,.25,.7,1,1][m];phase=density<.15?'夏の休眠期':'葉のある時期';
 }else if(['tulip','narcissus','globe'].includes(info.form)&&info.genre==='球根植物'){
  const last=flowerMonths.length?Math.max(...flowerMonths):5;
  density=month>=Math.max(1,(flowerMonths[0]||4)-2)&&month<=last+1?(month===last+1?.4:1):0;scale=month===(flowerMonths[0]||4)-2?.4:1;phase=density===0?'地中で休眠':month===last+1?'葉が黄変する時期':'葉の展開期';
 }else if(a.persistence==='semiDormant'&&[12,1,2].includes(month)){
  density=.35;scale=.65;phase='冬芽・株元の葉（寒さで変化）';
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
 if(a.architecture==='gilleniaSprays'){scale=1;phase=a.calyxMonths?.includes(month)?'花後に残る赤い萼の参考（果実・残存月と結実量は未確認）':'互生する三出複葉と細い星形の花（伸長・花数・紅葉時期は参考）';}
 if(a.architecture==='fireflyCymes'){scale=1;phase=[12,1,2].includes(month)?'国内の少ない残葉・紅葉の参考（冬の成株写真、残存量・月境界は未確認）':'対生葉と二出分枝、切れ込みのある八重花（花数・花弁数・月別伸長は参考）';}
 if(a.architecture==='snowtipMat'){scale=1;phase=[12,1,2].includes(month)?'冬苗の少ない残葉を参考表示（掲載写真は切戻し株、未剪定の冬姿は未確認）':'這う赤い茎と小さい対生葉・白い5弁花（花数・成長・月別葉量は参考）';}
 if(a.architecture==='actaeaRacemes'){scale=1;phase=a.seedHeadMonths?.includes(month)?'秋冬の未剪定写真を参考にした袋状の実と枯れ茎（結実量・残存月・倒伏は未校正）':[12,1,2].includes(month)?'冬の落葉と未剪定の枯れ茎の参考（品種固有の冬写真は未確認）':'複葉と雄しべの目立つ花穂（花量・花茎形成・地域差は参考）';}
 if(a.architecture==='astrantiaUmbels'){scale=1;phase='掌状の株元葉と総苞に囲まれた小花（花齢・花量・剪定・成長は参考）';}
 if(a.architecture==='cerintheCymes'){scale=1;phase=[12,1,2].includes(month)?'保護された早春苗を参考にした残葉（成株の冬姿・霜害は未確認）':'互生する丸い銀緑葉と青紫の苞・下向きの筒花（一年草の表示枠、実寿命・連続開花は未予測）';}
 if(a.architecture==='unifloraMats'){scale=1;phase=[12,1,2].includes(month)?a.shootProfile==='swan'?'冬苗写真の枯色の茎と少数の紅葉（残存量は参考）':'国内低温管理の地上部なしの参考（暖地は常緑、月境界は未校正）':'低く広がる対生葉と膨らんだ萼・品種別の白花（剪定と生育は未予測）';}
 if(a.architecture==='maitaiCrowns'){scale=1;phase=[12,1,2].includes(month)?'冬の少ない株元葉と未剪定の茎の参考（冬姿写真・残存量は未確認）':month===6?'夏の小さな一重花の参考（5弁への切替時期・実温度は未校正）':'大きな先端小葉のある株元葉と杏〜桃の半八重花（花齢・花数・成長は参考）';}
 if(a.architecture==='richardsoniiTrails'){scale=1;phase=[1,2].includes(month)?'国内低温管理の少ない残葉と茎の参考（落葉する場合もあり、冬姿写真・残存量・月境界は未確認）':'横へ伸びる茎と上2裂・下3裂の青花（国内の春〜初冬を参考表示、夏の花量・切戻し再開花は未校正）';}
 if(a.architecture==='phuopsisHeads'){scale=1;phase=[12,1,2].includes(month)?'国内の低温管理苗の少ない残葉と茎の参考（完全落葉する場合もあり、残存量・月境界は未校正）':'輪生状の細葉・葉状托葉と桃色の筒花の頭花（長い花柱、切戻し・自然増殖・年次成長は未予測）';}
 if(a.architecture==='alchemillaCymes'){scale=1;phase='ひだのある単葉と黄緑の小花（花弁なし・萼と副萼各4枚、剪定と月別生育は未予測）';}
 if(a.architecture==='doubleRaggedRobin'){scale=1;phase=[12,1,2].includes(month)?'国内の紅葉した少ない残葉と未剪定の茎の参考（残存量・月境界は未校正）':'細い根出葉と分枝する茎・細裂する白八重花（花弁数は近似、秋の返り咲き・剪定は未予測）';}
 if(a.architecture==='pinnatePolemonium'){scale=1;phase=[12,1,2].includes(month)?'国内寒冷地の少ない羽状葉と茎を参考表示（暖地は常緑・海外の落葉表記と地域差あり）':'小葉が並ぶ羽状複葉と5裂花（葉色・花齢による色・残葉量は近似、剪定と年次成長は未予測）';}
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
 else if(groundDormant)phase=a.architecture==='compositusRosettes'?'国内の低温管理苗の落葉期を参考表示（冬の写真・成株の残葉は未確認）':a.architecture==='erigeronHeads'?'低温管理苗の落葉期を参考表示（冬の実物写真・成株の残葉と残茎は未確認）':a.architecture==='orlayaUmbels'?'花後に枯れる一年草（翌年の株は新たな植付けで表現）':a.architecture==='redValerian'?'国内の低温管理苗の地上部なしの参考（暖地の残葉・未剪定成株の冬姿は未確認）':a.architecture==='gilleniaSprays'?'国内の低温管理苗の地上部なしの参考（未剪定の成茎・暖地・休眠月の境界は未校正）':a.architecture==='astrantiaUmbels'?(['beauty','billion'].includes(a.shootProfile)?'種から推定した冬の地上部休眠（品種固有の冬写真・地域差は未確認）':'国内の低温管理苗の地上部なしの参考（暖地・未剪定株の冬姿は未校正）'):a.architecture==='alchemillaCymes'?'国内の冬の地上部休眠を参考表示（月境界・地域差は未校正）':a.architecture==='springPhloxTrails'?'国内の寒冷地・低温管理の苗案内に合わせ地上部なしを参考表示（暖地の常緑・半常緑とは異なる）':a.persistence==='frostDormantTuber'?'霜後の地上部休眠（冬期の表示目安）':info.life==='annual'?'一年草の生育期外（低温期の参考）':'地上部のない休眠期';
 const bloomIndex=flowerMonths.indexOf(month),flowerDensity=bloom?(a.monthlyFlowerDensity?.[m]??(a.architecture==='avalanche'&&month>=7?.24:flowerMonths.length>2&&(bloomIndex===0||bloomIndex===flowerMonths.length-1)?.65:1)):0;
 const shootScale=['gardenGerberaCrowns','bengalCrowns','brunneraCultivarSprays','wildPrimroseCrowns','belarinaCrowns','irishPrimulaCrowns','atropScabiosaCymes','dwarfScabiosaCrowns','famaScabiosaCymes','queenMoonScabiosa','frilledScabiosaCymes','knautiaMeadowCymes','cephalariaTallCymes','succisellaPearlCymes','knautiaCultivarCymes','drumstickPaperyHeads','teaselSpinyShoots','tangoCoreopsisShoots','giantDaisyShoots','amberboaHeads','jacobaeaShrubs','berlandieraCymes','berkheyaWingedShoots','hieraciumHairyShoots','raouliaMats','cottonThistleWings','jurineaNoddingHeads','cotulaCushions','artichokeCrowns','leptinellaMats','craspediaGlobes','syneilesisUmbrellas','koreanAsterShoots','marshalliaHeads','belliumRunners','miyakowasureCrowns','compositusRosettes','karvinskianusTrails','erigeronHeads','linumCymes','chalcedonicaHeads','roseCampion','redValerian','orlayaUmbels','sanguisorbaSpikes','aruncusPlumes','dropwortRosettes','ulmariaSprays','filipendulaSprays','gilleniaSprays','fireflyCymes','snowtipMat','actaeaRacemes','astrantiaUmbels','cerintheCymes','unifloraMats','maitaiCrowns','richardsoniiTrails','phuopsisHeads','alchemillaCymes','doubleRaggedRobin','pinnatePolemonium','carolinaPhloxHeads','springPhloxTrails','physostegiaRows','subsessilisWhorls','uprightFaassenii','limeCatmintMound','nervosaHeads','tallNepetaSpires','simpleCatmintBranches','pinkCatmintBranches','giantCatmintShoots','pajamasCymes','catmintMounds','rupestrisBranches','hybridHyssopSpikes','rugosaHyssopSpikes','roseSageBracts','broadSagePanicles','rockinRacemes','guaraniticaShoots','rustySageCalyces','discolorBranches','clevelandWhorls','whiteSageShrub','claryPanicles','pineappleSageBranches','tallBlueSpires','pratensisRosettes','smallSageMounds','patensShoots','cherrySageBranches','officinalisMounds','leucanthaCanes','indigoSpires','perovskiaShoots','dichondraMat','helichrysumFoliage','cushionBush','artemisiaCushion','cerastiumMat','shastaCultivars','bellisRosettes','vincaRunners','paniclePhlox','chocolateCosmos','autumnAnemone','oxfordMat','melinisTussock','nemorosaWhorls','linariaRacemes','lamiumRunners','cloverStolons','crimsonClover','tiarellaCrowns','heucheraCrowns','ajugaMats','persicariaShoots','pelargoniumErodium','cranesbill','pulmonariaCrowns','perennialVioletShoots','softSucculents','haworthiaCrowns','ribbedSucculents','caudexPlants','agaveRosettes','stoneSucculents','necklacePlants','fleshyGardenPlants','mixedGardenPlants','lateGardenHerbs','uncommonGardenTree','marginGardenPlants','submergedShoots','forestPlants','poppyShoots','rosetteSpires','tubularHerbShoots','leycesteriaCanes','smallPeaHerbs','rhodiolaCrown','seasonalClimbers','betonyGermander','texturedMints','iberisCorymbs','astilbePlumes','aquilegiaCymes','dianthusCymes','verbenaBranches','scabiousHabit','sideritisSpikes','silverMintSpikes','marrubiumWhorls','leonotisTiers','keiskeaRacemes','isodonPanicles','chelonopsisAxils','triporaCymes','leucosceptrumSpikes','melittisAxils','puschkiniaScapes','bletillaShoots','roseaSpire','rugosaSpire','nierembergiaMat','goldenStrawberry','moonCarrot','flamingoRunners','pimpinellaRose','hairyChervil','pinkHogweed','michauxiaAxis','jasioneHeads','tracheliumCorymb','helleboreProfile','shastaAlaska','primroseRosette','gerberaRosette','brunneraSprays','tapienMat','stolonPhlox'].includes(a.architecture)||a.architecture==='beeBalm'&&a.standingWinter&&a.seedHeadMonths?.includes(month)?1:a.persistence==='semiDormant'&&a.architecture!=='beeBalm'&&[12,1,2].includes(month)?.15:!woody&&!dormant&&scale<1?scale:1;
 const headPhase=a.architecture==='berzelia'?bloom?'flower':[11,12,1,2].includes(month)?'bud':'dry':null;
 const retainedSummerLeaves=!!a.winterLeafLength&&[11,12,1,2,3].includes(month);
 if(retainedSummerLeaves)phase='春葉が落ち、小さな夏葉が冬を越す時期（地域差あり）';
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
 return {bloom,dormant,retainedSummerLeaves,groundDormant,shootScale,autumn,known,month,seasonName:season,flowerBuds:!bloom&&!!a.budMonths?.includes(month),headPhase,fruitStage,flowerFinished,springFlush:[4,5].includes(month),seedHeads:!!a.seedHeadMonths?.includes(month),leafDensity:density,leafScale:scale,leafColor:color,flowerDensity,flowerColor:a.monthlyFlowerColors?.[m]||info.flower,leafPatternColor:a.monthlyPatternColors?.[m]||a.patternColor,phase,timingBasis:a.flowerTiming==='months'?'資料に月の記載あり':'季節からの表示上の目安',label:bloom?'開花・'+phase:known?phase:phase+'（花期未確認）'};
}
