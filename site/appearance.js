import {APPEARANCE_DATA} from './appearance-data.js?v=0.6.0';

export const TRAIT_LABELS={leafShape:'葉の形',leafPattern:'葉の模様',persistence:'葉・地上部の季節変化',flowerShape:'花の形',habit:'枝ぶり・草姿',barkColor:'幹の色',barkPattern:'樹皮',emergenceMonths:'芽出し',flowerMonths:'開花月'};
export const TRAIT_VALUES={heart:'心形',round:'円形',kidney:'腎形',triangular:'三角形',lobed:'切れ込みのある葉',compound:'複葉',serrated:'鋸歯のある葉',narrow:'細葉',blade:'線形・剣形',needle:'針形',leaf:'卵形・楕円形',obovate:'倒卵形',spoon:'へら形',arrow:'矢じり形',margin:'覆輪',center:'中斑',spots:'斑点',silverVeins:'銀葉・緑の葉脈',stripes:'縞斑',evergreen:'常緑',semiEvergreen:'半常緑（寒さで変化）',deciduous:'落葉（幹・枝は残る）',winterDormant:'冬に地上部休眠',summerDormant:'夏に地上部休眠',bell:'鐘形',trumpet:'漏斗・ラッパ形',tube:'筒形',urn:'壺形',cup:'杯形',flat:'平開',star:'星形',cross:'十字形',pea:'蝶形',lipped:'唇形',spurred:'距のある花',spoonRay:'スプーン状の花弁',pompon:'ポンポン咲き',smooth:'平滑',peeling:'剥離する樹皮',furrowed:'縦に割れる樹皮',scaly:'鱗片状',lenticels:'皮目',clump:'株立ち',mound:'こんもり',creeping:'地面に広がる',rosette:'ロゼット',upright:'直立',arching:'弓状',spreading:'横に広がる',weeping:'枝垂れ',columnar:'細い直立形',pyramidal:'円錐形',vase:'箒状',rounded:'丸い樹冠',multistem:'根元から株立ち',oval:'卵形の樹冠',layered:'段状の横枝',irregular:'不規則な枝'};

export function attachAppearance(catalog){
 for(const [id,info] of Object.entries(catalog)){
  const a=APPEARANCE_DATA[id];if(!a)continue;
  info.appearance=a;
  if(a.scientificName&&!info.latin)info.latin=a.scientificName;
  // New reference models require morphological evidence. A name alone never clears this gate.
  if(info.form==='unmodeled'&&info.source&&a.leafShape&&a.habit&&a.flowerShape){
   info.form=info.genre==='庭木'?'shrub':'botanical';info.visual='reference';
  }
 }
 return catalog;
}
TRAIT_VALUES.semiDormant='冬は冬芽・株元の葉（半常緑〜落葉）';
TRAIT_VALUES.springEphemeral='春に展葉し、夏以降は地上部休眠';
TRAIT_VALUES.daisy='舌状花と中心の筒状花';
export function foliageKind(info){
 const a=info.appearance||{},pattern=a.leafPattern;
 const base=info.form==='hosta'?'leaf-hosta':'leaf';
 return pattern?base+'-'+pattern+(a.patternColor==='#dbd5a1'?'-gold':''):base==='leaf-hosta'?base:a.leafTexture==='glossy'?'leaf-glossy':'leaf';
}
export function appearanceSummary(info){
 const a=info.appearance||{};
 return ['leafShape','leafPattern','persistence','flowerShape','habit','barkPattern'].filter(k=>a[k]).map(k=>`${TRAIT_LABELS[k]}：${TRAIT_VALUES[a[k]]||a[k]}`).join(' ／ ');
}
