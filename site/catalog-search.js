// Search never discards catalog records; paging only bounds the visible DOM.
export const GENRES=['庭木','宿根草','一年草','カラーリーフ','球根植物','バラ','クリスマスローズ','クレマチス','多肉','水生植物'];
export const COLORS={red:'赤',pink:'ピンク',white:'白',yellow:'黄',orange:'オレンジ・杏',purple:'紫・藤',blue:'青',green:'緑',dark:'黒・褐色',mixed:'複色',unknown:'花色未確認'};
export const normalizeSearch=text=>String(text).normalize('NFKC').toLowerCase().replace(/[\u30a1-\u30f6]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60)).replace(/[\s・：:'‘’"“”()（）\-]/g,'');
export function searchCatalog(catalog,{query='',genre='all',color='all',status='all'}={}){
  const words=String(query).trim().split(/\s+/).filter(Boolean).map(normalizeSearch);
  return Object.entries(catalog).filter(([,p])=>
    (genre==='all'||p.genre===genre)&&(color==='all'||(p.colors||['unknown']).includes(color))&&
    (status==='all'||(status==='sourced'?!!p.source:!p.source))&&
    words.every(word=>normalizeSearch([p.label,p.latin,...(p.aliases||[])].join(' ')).includes(word)));
}
export function catalogPage(entries,page=0,size=24){
  const pages=Math.max(1,Math.ceil(entries.length/size)),index=Math.max(0,Math.min(pages-1,page));
  return {entries:entries.slice(index*size,(index+1)*size),index,pages,total:entries.length};
}
// Month conversion is an explicit display convention, not a local bloom forecast.
export function seasonAt(info,month){
  const bloom=info.bloom.includes(month),known=info.bloomKnown??!!info.bloom.length;
  const dormant=info.dormantMonths?.includes(month)??([12,1,2].includes(month)&&['deciduous','herb'].includes(info.leaf));
  const autumn=[10,11].includes(month)&&info.leaf==='deciduous';
  return {bloom,dormant,autumn,known,label:bloom?'花の時期（参考）':dormant?'落葉・休眠（参考）':known?'開花期の外（参考）':'花期未確認'};
}
