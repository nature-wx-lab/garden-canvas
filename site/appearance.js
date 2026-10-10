import {APPEARANCE_DATA} from './appearance-data.js?v=0.9.26';

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
Object.assign(TRAIT_VALUES,{calendulaLeaf:'毛のあるへら形の葉',calendulaHead:'重なる舌状花と筒状花の花芯',nemophilaLeaf:'丸い裂片に羽状に切れ込む葉',nemophilaCup:'連続した浅い杯状の5裂花冠',tripartitePoppyLeaf:'3つずつ繰り返し分かれる青緑色の細葉',californiaPoppyCup:'薄い花弁が重なる杯状花',alyssumLeaf:'細い披針形の葉',auriniaLeaf:'銀緑色の毛のあるへら形の葉',alyssumCross:'4枚の丸い花弁が十字に並ぶ小花'});
Object.assign(TRAIT_VALUES,{nasturtiumShield:'中央に柄が付く丸い盾状葉',nasturtiumFlower:'5弁の不均等な花と後ろに伸びる距',morningGloryLeaf:'心形の基部と3つに分かれる葉',morningGloryFunnel:'連続した漏斗状の花冠',corncockleLeaf:'茎を抱く細い対生葉',corncockleFlower:'5弁に濃い線が入る花と突き出す萼',snapdragonLeaf:'細長い全縁葉',snapdragonLips:'膨らむ下唇が喉を閉じる唇形花',climbing:'支えに巻きつき登る'});
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

Object.assign(TRAIT_VALUES,{warmSeasonAnnual:'暖かい時期に生育し、低温で終わる一年草',celosiaCrest:'ひだが折り重なる鶏冠状の花序',celosiaPlume:'枝分かれする羽毛状の花序',celosiaSpike:'細長い穂状の花序',monardaHead:'苞に囲まれた細長い唇形の小花',gaillardiaHead:'3裂した舌状花と盛り上がる筒状花',gaillardiaLobed:'羽状に切れ込む単葉'});

Object.assign(TRAIT_VALUES,{rhododendronLeaf:'厚みがあり枝先に集まる細長い革質葉',pierisLeaf:'細かい鋸歯のある倒披針形の葉',rhododendronFunnel:'波打つ5裂花冠と10本の雄しべ',azaleaFunnel:'5裂の漏斗状花冠と5本の雄しべ',kalmiaCup:'五角形の杯状花冠と曲がった10本の雄しべ',pierisUrn:'口元がくびれた下向きの壺形花',enkianthusBell:'細い柄で垂れる筋のある鐘形花',leucothoeMarble:'白地と緑が入り混じる散り斑'});

Object.assign(TRAIT_VALUES,{blueberryLeaf:'全縁で先がとがる楕円形の葉',blueberryUrn:'口が狭い下向きの壺形花'});
Object.assign(TRAIT_VALUES,{birchLeaf:'重鋸歯と細い側脈を持つ卵形葉',birchPaper:'白い樹皮と横長の皮目・薄い剥離',laceMaple:'7裂片がさらに細かく切れ込む掌状葉',fringeLeaf:'対生する厚みのある卵形・楕円葉',fringeFlower:'4本の細い花冠裂片と2本の雄しべ',laurelLeaf:'縁が波打つ光沢のある細長い全縁葉',laurelFlower:'葉腋に集まる4枚の花被と雄しべ'});

Object.assign(TRAIT_VALUES,{frostDormantTuber:'霜後に地上部が枯れ、塊根から春に再萌芽',dahliaHead:'舟形の舌状花が重なる頭花、一重系は中央に筒状花',dahliaLeaf:'粗い鋸歯のある小葉',dahliaCutLeaf:'深く切れ込む小葉'});

Object.assign(TRAIT_VALUES,{narcissusLeaf:'基部から出る溝のある線形葉',narcissusFlower:'6枚の花被と立体的な副冠',narcissusBulb:'冬〜春に葉、花後に黄変し夏秋は球根で休眠'});
Object.assign(TRAIT_VALUES,{irisSword:'二列に重なり扇状に広がる剣形葉',irisQuill:'四角い断面をもつ細長い葉',irisFlower:'外花被3枚・内花被3枚・花弁状の花柱',blackberryFlower:'斑点のある6枚の花被と3本の雄しべ',winterLeafIris:'冬に葉を出し初夏に枯れ、夏秋は休眠'});
Object.assign(TRAIT_VALUES,{hyacinthStrap:'肉厚で光沢のある幅広い帯状葉',muscariLeaf:'溝があり弓状に伸びる線形葉',muscariUrn:'口がくびれ6つに浅く裂ける小さな壺形花',hyacinthFlower:'短い花筒と強く反り返る6枚の花被',freesiaFlower:'漏斗形の花筒と不等な6裂片・3本の雄しべ'});

Object.assign(TRAIT_VALUES,{liliumLeaf:'細長い全縁の平行脈の葉',liliumFlower:'6枚の花被・6本の長い雄しべと3裂する柱頭'});

Object.assign(TRAIT_VALUES,{speciesTulipFlower:'上向きの6枚の花被・6本の雄しべと短い3裂の柱頭',earlyCrocusFlower:'杯状の6枚の花被・3本の雄しべと3分岐の柱頭',saraLeaf:'縁が強く波打ち横に広がる幅広い葉',speciesTulipLeaf:'青緑色で茎を抱く細長い葉',crocusLinear:'中央に銀白線が入る細い線形葉'});

Object.assign(TRAIT_VALUES,{helleboreCup:'5枚の杯状の萼・筒状蜜腺・多数の雄しべ',helleboreBell:'下向きに重なる5枚の萼の鐘形花',tessenFlower:'白い6枚の萼と中央の紫色の弁化した雄しべ',helleboreLeaf:'葉先に鋸歯がある革質の小葉',helleboreFineLeaf:'細く深く分かれる鋸歯の小葉',deciduousHellebore:'古葉は冬に枯れ、開花と前後して新葉を展開',climbing:'支持体に沿って登るつる'});

Object.assign(TRAIT_VALUES,{autumnHellebore:'10月から葉出し、6〜7月に枯れて夏休眠',vesicariusLeaf:'幅のある小葉に深い切れ込みと鋸歯'});

Object.assign(TRAIT_VALUES,{feltOval:'毛に覆われる厚い楕円葉',feltRound:'毛に覆われる小さな丸葉',wireRound:'細い柄をもつ小さな丸葉',groundIvyLeaf:'丸い鋸歯のある腎形の葉',newLookLeaf:'丸い大きな切れ込みのある幅広い銀葉',curlyLeucothoe:'強く反り返り波打つ厚い葉',persianLeaf:'太い葉脈と浅い鋸歯のある細長い葉',gardeniaFlower:'クチナシの筒と重なり合う裂片（一重型の参考）',pityrodiaFlower:'白い毛の萼と桃色の筒状の唇形花',groundIvyFlower:'葉腋に付く小さな筒状の唇形花'});

Object.assign(TRAIT_VALUES,{grassRibbon:'弓なりに垂れる細い帯状葉',hakoneBlade:'茎に付く細い竹葉状の葉',dichondraLeaf:'切れ込みのある丸い腎形葉',pericallisLeaf:'丸く広い鋸歯葉',pericallisHead:'暗い花芯を囲む舌状花',nemesiaLips:'上唇4裂・広い下唇と膨らんだ喉部',sedgeSpike:'短い小穂',featherPanicle:'枝分かれした羽毛状の穂'});

Object.assign(TRAIT_VALUES,{foxFaceLeaf:"毛のある大きな浅裂葉",solanumStar:"5裂の星形花と中央の葯",kaleRound:"大きく波打つ丸い照葉",pepperLeaf:"先の尖った全縁葉",pepperMosaic:"白・紫・緑の不規則な斑",cloverLeaflet:"毛のある丸〜倒卵形の小葉",crimsonRaceme:"赤い蝶形花が集まる細長い花穂",iceSpoon:"粒状の貯水細胞をもつ多肉質のへら形葉",bladderCells:"膨らんだ細胞が輝く表面",mesembFlower:"細い多数の花弁と中央の雄しべ",pinkSageLeaf:"丸みのある鋸歯をもつ卵形葉",pinkSageLips:"曲がる花筒と上下の唇・突き出す雄しべ",coreopsisLinear:"細い線形の対生葉",coreopsisHead:"先が裂けた舌状花と黄色い筒状花"});

Object.assign(TRAIT_VALUES,{multicauleSpoon:'少数の歯をもつ肉厚のへら形葉',shastaLeaf:'粗い鋸歯がある細長い照葉',scabiosaLobed:'茎では羽状に裂け、株元ではへら形の葉',delphiniumPalm:'5〜7裂する掌状の単葉',hollyhockPalm:'丸く浅く裂ける毛のある葉',oenotheraLeaf:'波打つ歯のある細長い葉',portulacaNeedle:'多肉質の円柱状の葉',gardenDaisy:'一列の舌状花と黄色い筒状花',scabiosaHead:'外側の小花が大きい頭花と突き出す雄しべ',delphiniumBee:'八重の花被と後ろに伸びる距',hollyhockCup:'杯状の花弁と一重花の雄しべの柱',oenotheraCup:'脈のある4枚の花弁・8本の雄しべ・十字の柱頭',portulacaDouble:'薄い花弁が重なる八重花',creamBristleHead:'長い毛に覆われるクリーム色の小さな穂',purpleFlash:'暗紫の葉に淡紫〜白の不規則な模様'});

Object.assign(TRAIT_VALUES,{sunflowerLeaf:'粗い鋸歯と毛をもつ大きな卵形〜心形葉',sunflowerHead:'大きな花芯と黄色い舌状花・重なる総苞片',morningMottle:'緑の蝉葉に散らばる不規則な白斑'});

Object.assign(TRAIT_VALUES,{primroseLeaf:'丸い鋸歯と深いしわのある倒卵形葉',gerberaLeaf:'羽状の切れ込みと波打つ縁の根生葉',brunneraHeart:'くぼんだ葉脈と毛のある大きな心形葉',tapienLeaf:'細い裂片に深く切れ込む対生葉',stolonPhloxLeaf:'匍匐茎に対生する全縁の広い葉',primroseFlower:'短い筒と丸い花弁・品種別の一重〜八重花',gerberaHead:'重なる舌状花と細かい筒状花の頭花',brunneraFlower:'白い目と短い筒をもつ5裂の小花',tapienFloret:'小さな5裂花が枝先に集まる花房',stolonPhloxFlower:'細い筒と平らに開く5裂の花冠',brunneraMargin:'不規則な白い葉の覆輪',brunneraSilver:'銀葉に濃緑の網状葉脈'});

Object.assign(TRAIT_VALUES,{diphylleiaShield:'葉の裏側に柄がつく大きな掌状の盾状葉',jeffersoniaKidney:'頂端が浅く2裂する丸い腎形葉',ranzaniaLeaflet:'3出複葉を作る掌状に浅く裂ける小葉',deinantheBifid:'先端が2つに分かれる鋸歯葉',kirengeshomaPalm:'対生する掌状裂葉',pteridophyllumComb:'櫛状に深く分かれるシダ状の根生葉',hylomeconSegment:'羽状に2〜3対に深く裂ける広い葉',eomeconKidney:'波状の丸い鋸歯をもつ腎形〜心形葉',araliaLeaflet:'2〜3回羽状複葉の鋸歯のある小葉',saururusHeart:'基部が心形・上部は開花時に白化する葉',parnassiaHeart:'小型の心形根生葉と茎を抱く1枚の葉',cornusHerbLeaf:'茎に間隔をあけて対生する弓状脈の葉',diphylleiaFlower:'白い6枚の花弁と黄色い雄しべ',jeffersoniaFlower:'淡青紫の6〜8枚の花弁',ranzaniaBell:'下向きの淡紅紫の萼片と小さな白い花弁',deinantheCup:'厚い6〜8枚の花弁と多数の青紫の雄しべ',kirengeshomaBell:'先だけ開く厚い黄色の5弁の鐘形花',pteridophyllumCross:'下向きの小さな白い4弁花',woodlandPoppy:'4枚の広い花弁と多数の黄色い雄しべ',parnassiaFlower:'5枚の有脈花弁と先端に小球がある5組の仮雄しべ',cornusHerbHead:'4枚の白い総苞と中央の暗紫色の小花',araliaUmbel:'小さな5弁花が集まる球状散形花序',saururusFlower:'花弁のない小花と6本ほどの雄しべの花穂'});

Object.assign(TRAIT_VALUES,{spurgeLinearLeaf:'螺旋状に密につく細長い全縁葉',spurgeBroadLeaf:'互生するやや幅のある披針形葉',snowSpurgeLeaf:'細い枝に対生する小さな楕円葉',gauraLeaf:'株元と花茎につく細い披針形葉',spurgeCyathium:'2枚の苞と中央の蜜腺・杯状花序（花弁なし）',snowSpurgeCyathium:'小さな杯状花序と多数の白い花弁状の苞',gauraButterfly:'4枚の花弁と8本の長い雄しべ'});
