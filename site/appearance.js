import {APPEARANCE_DATA} from './appearance-data.js?v=0.9.2';

export const TRAIT_LABELS={leafShape:'葉の形',leafPattern:'葉の模様',persistence:'葉・地上部の季節変化',flowerShape:'花の形',habit:'枝ぶり・草姿',barkColor:'幹の色',barkPattern:'樹皮',emergenceMonths:'芽出し',flowerMonths:'開花月'};
export const TRAIT_VALUES={heart:'心形',round:'円形',kidney:'腎形',triangular:'三角形',lobed:'切れ込みのある葉',compound:'複葉',serrated:'鋸歯のある葉',narrow:'細葉',blade:'線形・剣形',needle:'針形',leaf:'卵形・楕円形',obovate:'倒卵形',spoon:'へら形',arrow:'矢じり形',margin:'覆輪',center:'中斑',spots:'斑点',silverVeins:'銀葉・緑の葉脈',stripes:'縞斑',evergreen:'常緑',semiEvergreen:'半常緑（寒さで変化）',deciduous:'落葉（幹・枝は残る）',winterDormant:'冬に地上部休眠',summerDormant:'夏に地上部休眠',bell:'鐘形',trumpet:'漏斗・ラッパ形',tube:'筒形',urn:'壺形',cup:'杯形',flat:'平開',star:'星形',cross:'十字形',pea:'蝶形',lipped:'唇形',spurred:'距のある花',spoonRay:'スプーン状の花弁',pompon:'ポンポン咲き',smooth:'平滑',peeling:'剥離する樹皮',furrowed:'縦に割れる樹皮',scaly:'鱗片状',lenticels:'皮目',clump:'株立ち',mound:'こんもり',creeping:'地面に広がる',rosette:'ロゼット',upright:'直立',arching:'弓状',spreading:'横に広がる',weeping:'枝垂れ',columnar:'細い直立形',pyramidal:'円錐形',vase:'箒状',rounded:'丸い樹冠',multistem:'根元から株立ち',oval:'卵形の樹冠',layered:'段状の横枝',irregular:'不規則な枝'};

export function attachAppearance(catalog){
 for(const [id,info] of Object.entries(catalog)){
  const a=APPEARANCE_DATA[id];if(!a)continue;
  info.appearance=a;
  if(a.scientificName&&!info.latin)info.latin=a.scientificName;
  if(a.lifeForm==='tree'||a.lifeForm==='shrub'){
   info.group=a.lifeForm==='tree'?'木':'低木';
   if(info.genre==='宿根草')info.genre='庭木';
  }
  // Confirmed foliage can be shown independently; an unknown flower is never invented.
  if(info.form==='unmodeled'&&info.source&&a.leafShape&&a.habit){
   info.form=a.lifeForm==='tree'?'tree':a.lifeForm==='shrub'||info.genre==='庭木'?'shrub':'botanical';info.visual='reference';
  }
 }
 return catalog;
}
TRAIT_VALUES.semiDormant='冬は冬芽・株元の葉（半常緑〜落葉）';
TRAIT_VALUES.springEphemeral='春に展葉し、夏以降は地上部休眠';
TRAIT_VALUES.daisy='舌状花と中心の筒状花';
TRAIT_VALUES.springLeafBulb='春に葉が伸び、夏は葉のない花茎に開花';
TRAIT_VALUES.lily='6枚の花被と長い雄しべ';
TRAIT_VALUES.hollyhock='杯状の花弁と筒状に集まる雄しべ';
TRAIT_VALUES.pincushion='小花が集まる頭花と突き出す雄しべ';
TRAIT_VALUES.squill='6枚の花被・青い中央線・短い副花冠';
TRAIT_VALUES.salver='細い筒の先で5枚に平開する花';
TRAIT_VALUES.sedgeSpike='小さな褐色の穂';
Object.assign(TRAIT_VALUES,{standingGrass:'冬も枯れ葉・枯れ穂が残る',lateSpringBulb:'冬〜春に葉、夏秋は地上部休眠',lanceSerrate:'細長い鋸歯のある葉',peltate:'葉の中央に柄がつく盾状葉',wavyStrap:'縁が波打つ帯状葉',discHead:'舌状花のない筒状花の頭花',hangingStraps:'下向きの細長い花弁',oneSidedSpike:'横向きの軸の片側につく小穂',grassPanicle:'枝分かれした細い円錐状の小穂'});
Object.assign(TRAIT_VALUES,{springBulb:'冬〜春に葉と花、夏に地上部休眠',strap:'帯状の葉',sword:'剣形の葉',feather:'羽状に細かく裂ける葉',filigree:'糸状に細かく裂ける葉',violet:'上・横・下で異なる5枚の花弁と距',snowdrop:'下向きの外花被3枚と短い内花被',spikelet:'垂れ下がる小穂',bractedHead:'細かな花の頭状花序ととげ状の苞',columnHead:'柱状の花芯と下向きの舌状花',spathe:'仏炎苞と肉穂花序',stamens:'花弁がなく雄しべが目立つ花'});
export function patternKind(base,pattern,color){
 return pattern?base+'-'+pattern+(/^#[0-9a-f]{6}$/i.test(color||'')?'-'+color.slice(1).toLowerCase():''):base;
}
export function foliageKind(info){
 const a=info.appearance||{},pattern=a.leafPattern;
 const base=info.form==='hosta'?'leaf-hosta':'leaf';
 if(!pattern&&/^#[0-9a-f]{6}$/i.test(a.leafUnderside||''))return 'leaf-glossy-underside-'+a.leafUnderside.slice(1).toLowerCase();
 if(!pattern&&a.leafTexture==='woolly')return 'leaf-woolly';
 return pattern?patternKind(base,pattern,a.patternColor):base==='leaf-hosta'?base:a.leafTexture==='glossy'?'leaf-glossy':a.leafTexture==='scaly'?'leaf-scaly':'leaf';
}
export function appearanceSummary(info){
 const a=info.appearance||{};
 return ['leafShape','leafPattern','persistence','flowerShape','habit','barkPattern'].filter(k=>a[k]).map(k=>`${TRAIT_LABELS[k]}：${TRAIT_VALUES[a[k]]||a[k]}`).join(' ／ ');
}
Object.assign(TRAIT_VALUES,{tridentMaple:'前方に3つに裂けるカエデ葉',dendropanax:'3裂葉と菱状の葉が混生',wavyElliptic:'縁が波打つ楕円葉',oakLance:'先半分に鋸歯のある細長い革質葉',ovateSerrate:'先の尖る楕円形の鋸歯葉',obovateSerrate:'倒卵形の鋸歯葉',lichen:'地衣類の淡い斑紋',linearPetals:'細長い花弁',brushCorolla:'5裂する花冠と多数の長い雄しべ',backToBack:'反り返る5弁花が背中合わせに2輪',catkin:'垂れ下がる雄花序'});

Object.assign(TRAIT_VALUES,{elm:"細かな鋸歯と波状の起伏があるニレ葉",redbudPea:"内側の小さな旗弁と翼弁・竜骨弁",chileanCrocus:"白い喉部の6枚の花被・3本の葯と3本の仮雄しべ"});

Object.assign(TRAIT_VALUES,{biternate:"3つずつ2回に分かれる細い葉",flannelHead:"白い苞と中央の小花（花弁なし）",seasonalAnnual:"春植えの一年草（低温期は地上部なし）"});

Object.assign(TRAIT_VALUES,{sweetshrub:'大きい外花被と小さい内花被が重なる花',hebeFlower:'4裂の小花と2本の突き出す雄しべ'});
TRAIT_VALUES.calycanthus='左右非対称の基部とまばらな鋸歯がある大きな楕円葉';
Object.assign(TRAIT_VALUES,{cranesbill:'5枚の丸い花弁と10本の雄しべ',geraniumPalm:'掌状に深く5裂し鋸歯のある葉',geraniumRound:'丸みのある浅い掌状裂葉',mottle:'淡色の不規則なまだら模様'});
Object.assign(TRAIT_VALUES,{amaranthHead:'色づいた苞が集まる花房と突き出す小花',ruelliaFlower:'細い筒から広がる5裂の漏斗花',deltoidSerrate:'粗い鋸歯をもつ三角状卵形葉'});
Object.assign(TRAIT_VALUES,{pinwheel:'細い筒と同じ向きに重なる5裂の花冠',mosaic:'不規則な面状の斑'});
Object.assign(TRAIT_VALUES,{bullateRound:'葉脈間がふくらむ小さな丸い革質葉',myrtleFour:'4枚の白い花弁と多数の白い雄しべ',corokiaStar:'5枚の細い黄色の花弁',coprosmaFemale:'小さな緑色の雌花と突き出す2本の柱頭',leathery:'厚みのある革質の楕円葉'});
Object.assign(TRAIT_VALUES,{fawnLily:'下向きの花と反り返る6枚の花被',autumnSnowflake:'下向きの6枚の白い花被（緑の先端斑なし）',glorySnow:'白い中心と短い筒をもつ6裂の花',openSquill:'中央線のある6枚の花被（副花冠なし）',azureBell:'口元がくびれない6裂の小さな釣鐘花',autumnBulb:'秋の花・秋〜春の葉、夏は休眠',autumnLeafBulb:'秋〜春に葉、春に開花、夏は地上部休眠'});

Object.assign(TRAIT_VALUES,{woodPoppy:'4枚の花弁状の萼片と多数の黄色い雄しべ',anemonopsis:'下向きの外側の萼片と内側の紫色の先端の花弁',glaucidiumPalm:'7〜11中裂して鋸歯のある大きな掌状葉',anemonopsisLeaflet:'浅く3裂し粗い鋸歯のある卵形の小葉'});

Object.assign(TRAIT_VALUES,{eremophila:'白い毛の萼・白い喉部と褐色の斑点を持つ唇形花',mintBush:'上唇2裂・下唇3裂の小さな唇形花'});
Object.assign(TRAIT_VALUES,{broadToothed:'大きく幅の広い鋸歯葉',blueButterfly:'淡青色の4裂片と濃青色の下唇・弓状の雄しべ',bridalVeil:'垂れる花房・不等な白い5裂片と上向きの長い雄しべ',roseGlory:'細い筒と5裂片・長い雄しべが集まる半球状の花房'});
TRAIT_VALUES.wavyLance='縁がゆるく波打つ細長い披針形の葉';
Object.assign(TRAIT_VALUES,{coolSeasonAnnual:'冬の若い葉・開花後に枯れる一年草',nigella:'5枚の花弁状の萼と暗色の花芯・角のある種子',yellowNigella:'小さい黄色の萼と長く突き出す花芯・傘を返した形の種子',larkspur:'花穂に咲く花と上側の萼の後ろに伸びる距'});
Object.assign(TRAIT_VALUES,{crambeHeart:'大きな心形に広がる凹凸と浅い裂け目のある葉',seaKaleLeaf:'厚く波打ち浅く裂ける青銀色の葉',crambeFlower:'十字に開く4枚の花弁と長短6本の雄しべ',summerFadingCrown:'花後の夏から葉が枯れ、短い地表の株元で越冬'});
Object.assign(TRAIT_VALUES,{reedLeaf:'節から出て先が弓状に垂れる細い葉',canarySpike:'白地に緑の筋がある苞穎の重なった卵形の穂'});
Object.assign(TRAIT_VALUES,{mallowPalm:'丸みのある浅い掌状裂葉',mallowLobed:'浅く3裂し縁に歯のあるアオイの葉',smallMallow:'5枚の杯状花弁と中央で柱状に集まる雄しべ',claspingOvate:'葉柄がなく基部が茎を抱く卵形葉',parahebeFlower:'不等な4裂の花冠と2本の雄しべ',valerianSpur:'細い花筒・基部の距と1本の雄しべ',globulariaSpoon:'へら形で先が丸いか浅くへこむ根元の葉',globulariaHead:'細い5裂花が密集する青紫の球状花房',globulariaEye:'白い小花と青い未開花部が残る球状花房'});

Object.assign(TRAIT_VALUES,{chloranthusLeaf:'光沢と葉脈の凹凸・鋭い鋸歯のある葉',chloranthusSpike:'三叉の白い雄しべが集まる花穂（花弁なし）',acaenaHead:'花弁のない小花と2本の雄しべの球状花序',resedaPinnatifid:'細く多数に羽状深裂する葉',resedaThreeLobed:'主に3裂する細長い葉',resedaFlower:'細かく裂ける不揃いな花弁と突き出す雄しべ'});
Object.assign(TRAIT_VALUES,{bindweedDivided:'細い裂片に深く分かれる銀葉',bindweedFunnel:'5つの折り目をもつ一続きの漏斗状花冠',asteliaBlade:'縦に折れ、細かな銀色の鱗片をもつ剣状葉',asteliaSmall:'小さな6枚の花被が集まる円錐花序',berzeliaHead:'細い枝先につく5弁の小花の球状花房'});

Object.assign(TRAIT_VALUES,{climbing:"支えに沿って登るつる",darkVeins:"銀色の葉に濃い緑の葉脈",porcelainVariegation:"白とピンクの不規則な斑",vineHeart:"先が尖り粗い鋸歯のある心形葉",grapeShallow:"浅く3〜5裂する葉",grapeDivided:"深く3〜5裂する葉",eryngoPalm:"とげをもつ7〜9裂の掌状葉",eryngoStrap:"縁にとげのある硬い帯状葉",eryngoPineapple:"頂部にとげ状の葉をもつ紫の円柱状頭花",eryngoProtea:"長い銀色の苞が取り巻く青灰色の頭花",singleSepalCorymb:"多数の小花と一枚の白い萼を持つ装飾花",ampelopsisFlower:"5枚の小さい花弁と5本の雄しべ"});

Object.assign(TRAIT_VALUES,{balloonCorolla:"風船状の蕾から開く5裂の浅い鐘形花",balloonSplash:"白地に紫の飛び入り絞り",soapwortFlower:"5枚の小花弁と短い萼筒",soapwortTube:"長い萼筒と浅く切れ込む5枚の花弁",cowherbFlower:"膨らむ萼筒と5枚の丸い花弁"});
