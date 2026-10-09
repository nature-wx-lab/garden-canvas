import {treeProfile} from './tree-profiles.js?v=0.5.1';
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
 const profile=treeProfile(info),m=month-1,bloom=info.bloom.includes(month),known=info.bloomKnown??!!info.bloom.length;
 const leaf=profile?.leaf||info.leaf;
 let density=1,scale=1,autumn=false,phase=leaf==='unknown'?'葉の季節変化は未確認':'葉の展開期';
 const breakMonth=profile?.budbreak||4,fall=profile?.leafFall||12;
 if(leaf==='deciduous'){
  density=month<breakMonth||month>=fall?0:month===breakMonth?.5:month===fall-1?.42:1;
  scale=month===breakMonth?.65:1;autumn=month>=10&&month<fall;
  phase=density===0?'落葉・枝姿':month===breakMonth?'芽吹き・若葉':autumn?'紅葉・落葉へ':'葉が茂る時期';
 }else if(info.form==='cyclamen'){
  density=[1,1,1,.9,.6,.1,0,0,.25,.7,1,1][m];phase=density<.15?'夏の休眠期':'葉のある時期';
 }else if(['tulip','narcissus','globe'].includes(info.form)&&info.genre==='球根植物'){
  const last=info.bloom.length?Math.max(...info.bloom):5;
  density=month>=Math.max(1,(info.bloom[0]||4)-2)&&month<=last+1?(month===last+1?.4:1):0;scale=month===(info.bloom[0]||4)-2?.4:1;phase=density===0?'地中で休眠':month===last+1?'葉が黄変する時期':'葉の展開期';
 }else if(leaf==='herb'){
  density=info.dormantMonths?info.dormantMonths.includes(month)?0:1:[0,0,.15,.65,1,1,1,1,1,.75,.25,0][m];scale=month===3?.3:month===4?.7:1;phase=density===0?'地上部の休眠':month<5?'芽出し・葉の展開':month>10?'地上部が枯れる時期':'葉が茂る時期';
 }else if(leaf==='grass'){
  phase=[12,1,2,10,11].includes(month)?'枯れ葉・穂の観賞期':month<=4?'新しい葉の展開':'葉と穂の伸長期';
 }else if(['evergreen','semi'].includes(leaf))phase=month===4?'新旧の葉が入れ替わる時期':'葉のある時期';
 if(bloom&&leaf==='herb'){density=Math.max(density,.85);scale=Math.max(scale,.85);phase='開花を支える葉';}
 const dormant=density===0;
 let color=info.leafColor||profile?.green||'#577d42';
 if(profile){color=autumn?profile.autumn:month===breakMonth?profile.spring:profile.green;if(leaf==='evergreen'&&month===breakMonth)color=profile.green;}
 const bloomIndex=info.bloom.indexOf(month),flowerDensity=bloom?(info.bloom.length>2&&(bloomIndex===0||bloomIndex===info.bloom.length-1)?.65:1):0;
 return {bloom,dormant,autumn,known,leafDensity:density,leafScale:scale,leafColor:color,flowerDensity,flowerColor:info.flower,phase,label:bloom?'開花・'+phase:known?phase:phase+'（花期未確認）'};
}
