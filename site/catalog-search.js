import {treeProfile} from './tree-profiles.js?v=0.9.1';
// Search never discards catalog records; paging only bounds the visible DOM.
export const GENRES=['庭木','宿根草','一年草','カラーリーフ','球根植物','バラ','クリスマスローズ','クレマチス','多肉','水生植物'];
export const COLORS={red:'赤',pink:'ピンク',white:'白',yellow:'黄',orange:'オレンジ・杏',purple:'紫・藤',blue:'青',green:'緑',dark:'黒・褐色',mixed:'複色',unknown:'花色未確認'};
export const normalizeSearch=text=>String(text).normalize('NFKC').toLowerCase().replace(/[\u30a1-\u30f6]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60)).replace(/[\s・：:'‘’"“”()（）\-]/g,'');
export function searchCatalog(catalog,{query='',genre='all',color='all',status='all',popular=false,habit='all'}={}){
  const words=String(query).trim().split(/\s+/).filter(Boolean).map(normalizeSearch);
  return Object.entries(catalog).filter(([,p])=>
    (!popular||p.popularity?.length>0)&&(habit==='all'||treeProfile(p)?.habit===habit)&&(genre==='all'||p.genre===genre)&&(color==='all'||(p.colors||['unknown']).includes(color))&&
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
 const leaf={evergreen:'evergreen',semiEvergreen:'semi',semiDormant:'herb',deciduous:'deciduous',winterDormant:'herb',seasonalAnnual:'herb'}[a.persistence]||profile?.leaf||info.leaf;
 let density=1,scale=1,autumn=false,phase=leaf==='unknown'?'葉の季節変化は未確認':'葉の展開期';
 const breakMonth=a.emergenceMonths?.[0]||(a.leafFlushAfterFlower&&flowerMonths.length?Math.min(12,Math.max(...flowerMonths)+1):profile?.budbreak||4),fall=profile?.leafFall||12;
 if(a.foliageMonths){
  density=a.foliageMonths.includes(month)?1:0;scale=1;
  phase=density?'資料の葉の展開期':'葉のない時期';
 }else if(a.persistence==='summerFadingCrown'){
  density=[0,0,.35,.8,1,1,.6,.25,0,0,0,0][m];scale=month===3?.5:month===4?.8:1;
  phase=density===0?'根と地表の短い株元で休眠':month>=7?'花後の夏から葉が枯れる時期（表示目安）':'春の葉と初夏の花（表示目安）';
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
 const dormant=density===0;
 let color=info.leafColor||profile?.green||'#577d42';
 if(profile){color=autumn?profile.autumn:month===breakMonth?profile.spring:profile.green;if(leaf==='evergreen'&&month===breakMonth)color=profile.green;}
 if(a.leafColor&&!autumn)color=a.leafColor;
 if(a.monthlyLeafColors?.[m])color=a.monthlyLeafColors[m];
 const season=month>=3&&month<=5?'spring':month>=6&&month<=8?'summer':month>=9&&month<=11?'autumn':'winter';
 if(a.seasonalColors?.[season])color=a.seasonalColors[season];
 const woody=!!profile||['tree','shrub','conifer','maple','olive','rose','hydrangea','clematis','climbingrose','mophead','lavender'].includes(info.form);
 const leaflessFlowering=!!a.leaflessBloom&&bloom&&dormant;
 const groundDormant=dormant&&!woody&&!(a.persistence==='coolSeasonAnnual'&&a.seedHeadMonths?.includes(month))&&!a.standingWinter&&!leaflessFlowering&&(leaf==='herb'||!!a.foliageMonths||['summerDormant','springEphemeral','springBulb','lateSpringBulb','autumnBulb','autumnLeafBulb'].includes(a.persistence)||['cyclamen','tulip','narcissus','globe'].includes(info.form));
 if(groundDormant)bloom=false;
 if(leaflessFlowering)phase='葉のない花茎の開花期';
 else if(groundDormant)phase=info.life==='annual'?'一年草の生育期外（低温期の参考）':'地上部のない休眠期';
 const bloomIndex=flowerMonths.indexOf(month),flowerDensity=bloom?(a.architecture==='avalanche'&&month>=7?.24:flowerMonths.length>2&&(bloomIndex===0||bloomIndex===flowerMonths.length-1)?.65:1):0;
 const shootScale=a.persistence==='semiDormant'&&[12,1,2].includes(month)?.15:!woody&&!dormant&&scale<1?scale:1;
 const headPhase=a.architecture==='berzelia'?bloom?'flower':[11,12,1,2].includes(month)?'bud':'dry':null;
 const fruitStage=a.architecture==='porcelainVine'&&[8,9,10,11].includes(month)?month===8?'early':'ripe':null,flowerFinished=a.architecture==='proteaEryngo'&&month>Math.max(...flowerMonths);
 return {bloom,dormant,groundDormant,shootScale,autumn,known,headPhase,fruitStage,flowerFinished,springFlush:[4,5].includes(month),seedHeads:!!a.seedHeadMonths?.includes(month),leafDensity:density,leafScale:scale,leafColor:color,flowerDensity,flowerColor:info.flower,leafPatternColor:a.monthlyPatternColors?.[m]||a.patternColor,phase,timingBasis:a.flowerTiming==='months'?'資料に月の記載あり':'季節からの表示上の目安',label:bloom?'開花・'+phase:known?phase:phase+'（花期未確認）'};
}
