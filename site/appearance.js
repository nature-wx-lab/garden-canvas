import {APPEARANCE_DATA} from './appearance-data.js?v=0.9.857';

export const TRAIT_LABELS={leafShape:'葉の形',leafPattern:'葉の模様',persistence:'葉・地上部の季節変化',flowerShape:'花の形',habit:'枝ぶり・草姿',barkColor:'幹の色',barkPattern:'樹皮',emergenceMonths:'芽出し',flowerMonths:'開花月'};
const CONIFER_LABELS={flatScale:'平たい小枝に十字対生する鱗片葉',appressedScale:'細い枝を覆う小さな鱗片葉',softAwl:'柔らかい針状の幼形葉',threadScale:'糸状に垂れる枝を覆う鱗片葉',spiralYew:'らせん状に並ぶ平たい針葉',flatYew:'左右に開く平たい針葉',whorledAwl:'3輪生し白い帯を持つ針葉',bluntScale:'先の丸い鱗片葉と葉裏の白い気孔帯',pointedScale:'先の尖る鱗片葉と葉裏の白い気孔帯'};
export const TRAIT_VALUES={heart:'心形',round:'円形',kidney:'腎形',triangular:'三角形',lobed:'切れ込みのある葉',compound:'複葉',serrated:'鋸歯のある葉',narrow:'細葉',blade:'線形・剣形',needle:'針形',leaf:'卵形・楕円形',obovate:'倒卵形',spoon:'へら形',arrow:'矢じり形',margin:'覆輪',center:'中斑',spots:'斑点',silverVeins:'銀葉・緑の葉脈',redVeins:'赤い葉脈',stripes:'縞斑',evergreen:'常緑',semiEvergreen:'半常緑（寒さで変化）',deciduous:'落葉（幹・枝は残る）',winterDormant:'冬に地上部休眠',summerDormant:'夏に地上部休眠',bell:'鐘形',trumpet:'漏斗・ラッパ形',tube:'筒形',urn:'壺形',cup:'杯形',flat:'平開',star:'星形',cross:'十字形',pea:'蝶形',lipped:'唇形',spurred:'距のある花',spoonRay:'スプーン状の花弁',pompon:'ポンポン咲き',smooth:'平滑',peeling:'剥離する樹皮',furrowed:'縦に割れる樹皮',fissured:'割れ目のある樹皮',scaly:'鱗片状',lenticels:'皮目',clump:'株立ち',mound:'こんもり',creeping:'地面に広がる',trailing:'横枝が這うように広がる',rosette:'ロゼット',upright:'直立',arching:'弓状',spreading:'横に広がる',weeping:'枝垂れ',columnar:'細い直立形',pyramidal:'円錐形',vase:'箒状',rounded:'丸い樹冠',multistem:'根元から株立ち',oval:'卵形の樹冠',layered:'段状の横枝',irregular:'不規則な枝'};
Object.assign(TRAIT_VALUES,{ovate:'卵形の葉',ovateDentate:'鋸歯のある卵形の葉',ovateCrenulate:'丸い鋸歯のある卵形の葉',linear:'線形の細い葉'});
Object.assign(TRAIT_VALUES,{oxfordLeaf:'対生する小さな葉の参考',oxfordFourLobes:'白い中心をもつ青い4裂花の参考'});
Object.assign(TRAIT_VALUES,{lanceolate:'披針形の葉'});
Object.assign(TRAIT_VALUES,{pinnate:'小葉が羽状に並ぶ葉'});
Object.assign(TRAIT_VALUES,{rugosaSourceCordateReference:'対生する鋸歯と心形の基部がある広い葉の参考',rugosaSourceTwoLipReference:'4本の雄しべ・2裂の上唇と3裂の下唇がある筒状小花の参考'});
Object.assign(TRAIT_VALUES,{retailMonardaSerrateReference:'対生する鋸歯のある単葉の参考',retailMonardaTwoLipReference:'細い上唇と3裂の下唇をもつ筒状小花の参考'});
Object.assign(TRAIT_VALUES,{ruelliaNarrowReference:'細長い対生葉の参考',ruelliaFunnelReference:'5裂の縁へ広がる漏斗花の参考',axillaryCyme:'葉腋の集散花序'});
Object.assign(TRAIT_VALUES,{argutifoliusEmeraldNetworkReference:'銀緑の地に緑の網目がある葉の写真例'});
Object.assign(TRAIT_VALUES,{argutifoliusSpinyTrifoliateReference:'茎上に付く厚い3小葉と粗い刺状の鋸歯の参考',argutifoliusGreenCupReference:'5枚の丸い淡緑の萼が杯状になり、房でうつむく花の参考',argutifoliusGreenNetworkReference:'濃い緑の葉に細かい網目の葉脈',argutifoliusSilverNetworkReference:'銀灰色の地に緑の網目脈がある葉'});
Object.assign(TRAIT_VALUES,{lividusCaulineTrifoliateReference:'茎上に付く3小葉（側小葉は非対称、葉裏は淡紫）の参考',lividusNoddingCupReference:'淡緑の内面と桃色を帯びる外面の5枚の萼がある、うつむく花の参考',lividusWhiteVeinReference:'灰緑の表面に細かい銀白色の網目',lividusSilverVeinReference:'銀白色がより広がる細かい網目'});
Object.assign(TRAIT_VALUES,{nigerSnowDriftReference:'細くやや尖る白い花弁状部分が重なる星形の八重花の参考',nigerSnowDriftLeafReference:'細めの鋸歯のある小葉へ分かれた根生葉の参考'});
Object.assign(TRAIT_VALUES,{nigerSeedDoubleReference:'実生で形に幅がある白い八重花の写真例',nigerSingleCupReference:'白い5枚の花弁状の萼片と黄色の中心の一重花の参考',nigerBrushVariegation:'不規則な刷毛目・吹掛け状のクリーム色の斑',nigerVeinMarbling:'葉脈に沿って広がる白いマーブル模様'});
Object.assign(TRAIT_VALUES,{nigerCultivarDividedReference:'長い葉柄と鋸歯のある掌状に分かれた根生葉の参考',nigerFantasyDoubleReference:'白い外側と小さな内側の花弁状部分が重なる八重花の参考',nigerTwinDoubleReference:'大きな内側の花弁状部分が重なる八重花と咲き進みの色の参考'});
Object.assign(TRAIT_VALUES,{woodlandPhloxOppositeReference:'はう茎と立つ茎に対生する単葉の参考',woodlandPhloxFiveLobeReference:'細い筒と5裂する平らな花冠の参考'});
Object.assign(TRAIT_VALUES,{mallowPalmateReference:'葉柄があり掌状に裂ける互生の単葉の参考',mallowFivePetalReference:'5枚の花弁と濃い筋・雄しべ筒の参考'});
Object.assign(TRAIT_VALUES,{retailPeachBellRosetteReference:'桃葉キキョウの根出葉ロゼットと細い茎葉の参考',retailPeachBellCupReference:'外向きに開く5裂の鐘形花の参考'});
Object.assign(TRAIT_VALUES,{fineAmsoniaThreadReference:'互生する糸状の全縁葉の参考',fineAmsoniaCiliateReference:'互生する細葉と新葉の縁毛の参考',fineAmsoniaTubeStarReference:'小さく5裂する淡青色の筒状花冠の参考'});
Object.assign(TRAIT_VALUES,{stormcloudBroadLanceReference:'互生する広めの単葉と春の銀色葉脈の参考',stormcloudTubeStarReference:'黒い花茎と淡青色の5裂する筒状花冠の品種参考'});
Object.assign(TRAIT_VALUES,{amsoniaEllipticaLanceReference:'茎上に互生する細い全縁の単葉の参考',amsoniaEllipticaTubeStarReference:'細い筒と5裂の星形花冠の種形態参考',terminalThyrseReference:'茎頂で短く分枝する花序の参考'});
Object.assign(TRAIT_VALUES,{tulbaghiaLinearReference:'白銀の覆輪のある細い根生葉の参考',tulbaghiaTubeCoronaReference:'細い花被筒・6裂片・3つの副花冠の種形態参考'});
Object.assign(TRAIT_VALUES,{delavayiThreePinnateReference:'3回に分かれる複葉と切れ込みのある小葉の参考',delavayiSepalStamenReference:'4萼片と多数の雄しべを持つ小花の種形態参考'});
Object.assign(TRAIT_VALUES,{chrysanthemumRuffledReference:'淡桃色の波打つ部分が多く重なる頭花の外観参考',chrysanthemumWinterMixtureReference:'2株混色商品の写真に見える2つの花型（品種名との対応は未確認）',mixedChrysanthemumPotReference:'2品種2株の商品を1入力で参考表示（実株数・購入単位の自動分割なし）'});
Object.assign(TRAIT_VALUES,{chrysanthemumCreamBurgundyReference:'淡色の先と紫紅の基部・黄緑の花心の参考（写真の段階差は未同定）',chrysanthemumYellowBurgundyReference:'黄色の先と赤紫の内側・緑黄の花心の参考',chrysanthemumPinkDoubleReference:'淡桃色の縁と濃桃色の内側が重なる頭花の外観参考'});
Object.assign(TRAIT_VALUES,{chrysanthemumCurledReference:'反り返る細い白い部分と中央の短い部分の外観参考（中央器官は未同定）',chrysanthemumDaisyReference:'黄色い舌状部分と緑～黄の露出した花心の参考',chrysanthemumBoatReference:'赤い内側と黄色い縁の舟形部分・大きな黄緑の中央の外観参考'});
Object.assign(TRAIT_VALUES,{chrysanthemumLobedReference:'羽状の切れ込みと歯がある互生の単葉の参考',chrysanthemumSpoonReference:'黄色い筒状部分と赤いスプーン状の先・露出した花心の参考',chrysanthemumPomponReference:'黄色い舌状部分が密に集まる球状のポンポン咲きの参考',chrysanthemumDahliaReference:'白い外側と黄緑色の内側が重なるダリア咲きの外観参考'});
Object.assign(TRAIT_VALUES,{annLeysClaspingReference:'種資料の茎を抱く全縁の互生単葉の参考',annLeysExteriorReference:'細長い緑～黒紫の片が集まる特殊な頭花の外観（各器官・内部構造は未同定）'});
Object.assign(TRAIT_VALUES,{princeLanceolateReference:'先寄りに少数の歯がある細い黒紫の互生単葉',violettaClaspingReference:'茎を抱く全縁の互生単葉',monchOblongReference:'写真の広めの互生単葉（葉縁と微細毛は未照合）',gardenAsterCapitulumReference:'品種ごとの舌状花と五裂筒状花からなる頭花'});
Object.assign(TRAIT_VALUES,{showmakersClaspingReference:'茎を抱く無柄の全縁の互生単葉',showmakersDoubleCapitulumReference:'ドーム状の分枝にまとまる八重頭花'});
Object.assign(TRAIT_VALUES,{callistephusOvateReference:'互生する卵形～へら状の粗い鋸歯単葉',callistephusCapitulumReference:'重なる舌状花と黄色の五裂筒状花の頭花'});
Object.assign(TRAIT_VALUES,{gaillardiaLeafReference:'基部と茎に互生する毛を帯びた単葉',gaillardiaFloretReference:'三裂する舌状花と五裂筒状花の頭花'});
Object.assign(TRAIT_VALUES,{achilleaLinearReference:'互生する細い鋸歯単葉',achilleaDissectedReference:'互生する深裂単葉・羽毛状の細かい切込み',achilleaDoubleReference:'多数の象牙白の舌状花が重なる離れた頭花',achilleaRadiateReference:'舌状花と五裂筒状花が集まる平たい頭花群'});
Object.assign(TRAIT_VALUES,{autumnJoySucculentReference:'粉白を帯びる肉厚の単葉・鈍い鋸歯',autumnJoyCarpelReference:'小さな淡色花弁と大きな赤桃色心皮が目立つ平たい花房'});
Object.assign(TRAIT_VALUES,{milleniumBladeReference:'夏にも残る厚みと光沢のある平たい根生葉',milleniumSphereReference:'球状の散形花序・6枚の花被片と中央小器官の参考'});
Object.assign(TRAIT_VALUES,{limelightSimpleReference:'対生する卵形の単葉・細鋸歯と目立つ葉脈',limelightPanicleReference:'円錐状の花房・4枚の拡大萼と小さな両性花の参考'});
Object.assign(TRAIT_VALUES,{magnusLeafReference:'根生葉と上ほど葉柄が短くなる互生の粗毛葉',magnusHeadReference:'広く開く赤紫の舌状花と中央の尖った鱗片・筒状花をもつ頭花'});
Object.assign(TRAIT_VALUES,{altPmCurlRef:'小さく丸みがある葉が強くカールする参考形',altPmSmallRef:'小さい先の尖る卵形の対生葉',altPmKotaRef:'細長い先の尖る単葉',alternantheraKotaMargin:'灰緑色の中央と桃～淡クリーム色の不規則な縁、紫を帯びる裏面'});
Object.assign(TRAIT_VALUES,{altTxCurledLeafRef:'幅広く丸みのある葉が強くカールする写真の参考形',altTxMarbleLeafRef:'緩く波打つ幅広い卵形～楕円形の葉',altTxCatsLeafRef:'幅広い卵形の葉と不規則な波打ち',alternantheraTexturedMottle:'写真を参考にした緑・黄・赤桃・紫の不規則な斑'});
Object.assign(TRAIT_VALUES,{alternantheraOvateRef:'対生する先の尖った卵形～楕円形の単葉',pinkShadeTricolor:'季節で混ざり方が変わるピンク・緑・紫の葉',alternantheraPaperyHead:'紙質の花被片が集まる小さな有柄頭花'});
Object.assign(TRAIT_VALUES,{artPowisDivided:'銀白の毛と細く二次分割する葉、冬の短い裂片',artLudoVariable:'銀灰色の細い単葉と実生で異なる浅い裂片'});
Object.assign(TRAIT_VALUES,{artFineSilverCut:'毛に覆われ細く深く裂ける葉',artRoundedWhiteLobes:'白い毛と丸い裂片を持つ深裂した単葉',artSeasonalGold:'芽吹きの黄金色から夏の淡いライム色',artTinyHeads:'総苞に包まれた小さな筒状花の集合'});
Object.assign(TRAIT_VALUES,{mukdeniaPalmate:'長い葉柄と5～7の裂片・鋸歯のある単葉',mukdeniaRedTips:'初夏の赤い葉先と季節で変化する葉色',mukdeniaWhiteStar:'大きな白萼片と短い白花弁の星形小花',erythropodaRound:'小さい丸い灰緑の浅裂葉と鋸歯',erythropodaApetalous:'4萼片と4副萼片、花弁のない黄緑の小花'});
Object.assign(TRAIT_VALUES,{heucheraSixLobe:'6つの主裂片と二次裂片のある単葉',heucheraFineHair:'軟らかな細毛を帯びるマットな葉',heucheraSmooth:'大きな凹凸を作らない滑らかな葉'});
Object.assign(TRAIT_VALUES,{heucheraWarmVeil:'季節で変化する暖色の葉と淡い被膜',heucheraRedCenter:'黄緑の葉の赤い中心と葉脈周辺の模様'});
Object.assign(TRAIT_VALUES,{heucheraSevenLobe:'心形の基部と7つの浅い裂片をもつ単葉',heucheraCuppedFrill:'上向きのくぼみと深い裂片・フリルのある単葉',heucheraVeil:'葉脈間の淡い被膜と暗い葉脈',heucheraCultivarBell:'5裂の萼筒に小さな5花弁・5雄しべ・2花柱',thyrse:'集散花序が並ぶ円錐状の花序'});
Object.assign(TRAIT_VALUES,{rodgersiaCompound:'短い軸で小葉の群が分かれる擬似羽状の複葉',rodgersiaPetalLess:'花弁がなく色づく5裂の萼・10雄しべの参考'});
Object.assign(TRAIT_VALUES,{astilboidesPlate:'葉柄が内側に付く丸い浅裂の大葉',darmeraShield:'葉柄が内側に付く鋸歯と掌状裂の傘葉',astilboidesTinyFlower:'4枚の離生花弁・8雄しべ・2花柱の小花の参考',darmeraCymoseFlower:'5花弁・10雄しべ・2花柱の花が葉に先行'});
Object.assign(TRAIT_VALUES,{rheumBroadLeaf:'波打つ大きな心形の根出葉',rheumPalmateLeaf:'掌状に深く裂けて鋸歯のある大葉',rheumSepaloidCup:'分かれた6花被・通常9雄しべ・3花柱の小花'});
Object.assign(TRAIT_VALUES,{atropCultivarLeaves:'幅広く鋸歯のある根出葉と細く深裂する対生の茎葉',atropCultivarHead:'盛り上がる5裂の小花・4本の雄しべ・品種別の蕾と白い花縁'});
Object.assign(TRAIT_VALUES,{pincushionNurseryLeaves:'幅広く浅い鋸歯のある根出葉と細かく裂ける茎葉',retailBlueLeaves:'深い切れ込みと細かな鋸歯のある根出葉・細い裂片の茎葉',pincushionPinkHead:'桃色の周辺花と茶桃色の未開花中央部・5裂花冠',retailBlueHead:'濃い青紫の周辺花と高く盛り上がる小花・白い雄しべ'});
Object.assign(TRAIT_VALUES,{dwarfScabiosaLeaves:'根元の浅く裂ける葉と細かく羽状に裂ける茎葉・細かな毛',dwarfScabiosaHead:'中央が盛り上がる小さな5裂花冠と大きい周辺花・4本の雄しべ'});
Object.assign(TRAIT_VALUES,{famaLeaves:'細長い根出葉と少数の深い切れ込みを持つ対生する茎葉',famaCuppedHead:'上へ反る大きな周辺花と波打つ5裂花冠・未開花の中央小花'});
Object.assign(TRAIT_VALUES,{arvensisLeaves:'毛と丸い鋸歯のある根出葉・上部の深く裂ける対生葉',meltonLeaves:'幅広い披針形の根出葉・細かく裂ける対生する茎葉',arvensisHead:'淡いライラック色の不等4裂花冠と4本の雄しべを持つ両性花の参考',meltonHead:'株ごとに色が異なる桃色〜ライラック色の4裂する小花'});
Object.assign(TRAIT_VALUES,{cephalariaPinnate:'大きな頂裂片と鋸歯のある羽状葉・上部では小さくなる対生葉',cephalariaYellowHead:'外側の小花が大きく先に開く淡黄色の4裂花冠',succisellaLeaves:'株元のへら形の葉と、花茎に対生する細長い葉',succisellaPearlHead:'桃色の蕾から白く開く球形の花頭・大きな周辺花なし'});

export function attachAppearance(catalog){
 Object.assign(TRAIT_VALUES,{singleRose:'5枚の花弁と多数の黄色い雄しべを持つ一重のバラ',semiDoubleRose:'丸い花弁が重なり雄しべが見える半八重のバラ',anemoneRose:'細い内側の花弁状部分が重なる小さな房咲きのバラ'});
Object.assign(TRAIT_VALUES,CONIFER_LABELS);
 Object.assign(TRAIT_VALUES,{puschkiniaStrap:'球根ごとに2枚の細い帯状葉',bletillaPlicate:'平行な折り目と葉鞘のある細長い葉',puschkiniaStar:'青い中央線のある6枚の花被・筒状の副花冠',bletillaOrchid:'5枚の花被とひだのある唇弁・中心の蕊柱'});
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
Object.assign(TRAIT_VALUES,{vincaJennyLeaf:'光沢のある無斑の披針形〜長楕円葉',vincaMinorLeaf:'中央付近が広く、基部が円形〜くさび形の小さな厚めの楕円葉',vincaWhiteEye:'淡紫桃の花冠に大きな白い中心と薄い白縁'});
Object.assign(TRAIT_VALUES,{vincaLeaf:'丸みのある基部と尖る先端を持つ卵形の対生葉',vincaMargin:'緑の中心と不規則な白クリームの覆輪',vincaCenter:'淡黄クリームの中斑と不規則な暗緑の外縁・緑の島',vincaPinwheel:'細い花筒から片側へ流れる風車形の5裂花冠'});
Object.assign(TRAIT_VALUES,{openingActPinkadot:'ピンクアドットの分枝する株姿の参考',openingActRomance:'ロマンスの分枝する株姿の参考',openingActStar:'淡色の花冠中央に濃桃色の星模様の参考'});
Object.assign(TRAIT_VALUES,{evaCullumReference:'エバクルーンの桃色の目と円錐状の花房の参考',elizabethPhloxReference:'エリザベスの淡い覆輪葉と桃色の花房の参考',olympusPhloxReference:'オリンパスの覆輪葉・赤い新葉・白い目の花の参考'});
Object.assign(TRAIT_VALUES,{annualPhloxReferences:'一年草フロックスの一回の開花期までの参考',annualPhloxIsabellina:'イザベリーナの淡色の花と柔らかな分枝の参考',annualPhloxCherryCaramel:'チェリーキャラメルの赤い目と柔らかな分枝の参考',annualPhloxLeaf:'下部は対生・上部は互生し、付け根で茎を抱く毛のある単葉の参考',lowerOppositeUpperAlternate:'下部の葉は対生・上部は互生（種資料の参考）',annualPhloxEye:'クリーム色の花の中央に赤紫色の目の参考'});
Object.assign(TRAIT_VALUES,{paniclePhloxLeaf:'全縁で先が尖り、側脈が葉縁へ湾曲する対生葉',paniclePhloxFlower:'長い花筒と平らに開く5裂花冠・5裂の萼',phloxSplash:'白地に桃色の細い放射筋と不規則な色の区画'});
Object.assign(TRAIT_VALUES,{linariaLeaf:'細い灰緑の線形葉',linariaLips:'後方に細い距を持つ小さな二唇形花'});
Object.assign(TRAIT_VALUES,{heliLinear:'白い毛に覆われ縁が巻く細長い葉',heliBroad:'縁が反り白い毛に覆われる幅広の銀緑葉',heliPapery:'白い乾いた質感の苞が重なる黄色い中心の頭花'});
TRAIT_VALUES.cushionScale='銀白色の小枝に沿う細い小さな葉';
TRAIT_VALUES.artemisiaSilver='細く尖った裂片へ羽状に分かれる銀白色の葉';
Object.assign(TRAIT_VALUES,{palmatelyLobed:'暗紫色の葉脈と鋸歯を持つ掌状の単葉',pinnateWithPalmateTerminal:'小さい側小葉と掌状に裂けた大きい頂小葉',fivePetalStamenSprays:'丸い5枚の花弁と細い雄しべを持つ小花の集まり'});
TRAIT_VALUES.actaeaBroadCompound='幅広く裂けた、つやの少ない銅葉の複葉';
TRAIT_VALUES.actaeaDeepCompound='深く裂けた銅葉の小葉に分かれる複葉';
TRAIT_VALUES.actaeaPaleBrush='白〜ごく淡い桃色の雄しべが目立つ総状花序';
TRAIT_VALUES.actaeaCompound='鋸歯のある小葉に分かれる複葉';
TRAIT_VALUES.actaeaBrush='細い雄しべが目立つ白い総状花序';
TRAIT_VALUES.astrantiaPalm='鋸歯のある掌状の根出葉と小さな茎葉';
TRAIT_VALUES.astrantiaUmbel='総苞に囲まれた散形の小花（外側は花弁ではなく苞）';
TRAIT_VALUES.cerintheClasping='茎を抱く丸い灰緑の葉（若葉に白い斑点）';
TRAIT_VALUES.cerintheTube='青紫の苞から下向きに垂れる濃紫の筒状花';
TRAIT_VALUES.inflatedSingleSilene='ふくらんだ萼と先が2裂する5枚の白い花弁';
TRAIT_VALUES.doubleSwanSilene='ふくらんだ萼と細かな花弁が重なる白い八重花';
TRAIT_VALUES.semiDoubleGeum='花弁が重なる半八重花（夏は小さな一重花の参考）';
TRAIT_VALUES.doubleFringedSilene='細く裂ける花弁が重なる白い八重花';
TRAIT_VALUES.semiDormant='冬は冬芽・株元の葉（半常緑〜落葉）';
Object.assign(TRAIT_VALUES,{lamiumSterlingLeaf:'浅い心形の基部と丸い鋸歯・凹凸のある卵形葉',lamiumGaleobdolonLeaf:'先が尖り鋸歯のある細長い卵形葉',lamiumSilver:'細い緑の葉縁・葉脈を残す銀葉',lamiumBands:'緑の中央脈の左右にある不規則な銀色の帯',lamiumLips:'兜状の上唇と3裂の下唇を持つ小さな花'});
TRAIT_VALUES.springEphemeral='春に展葉し、夏以降は地上部休眠';
TRAIT_VALUES.daisy='舌状花と中心の筒状花';
TRAIT_VALUES.springLeafBulb='春に葉が伸び、夏は葉のない花茎に開花';
TRAIT_VALUES.lily='6枚の花被と長い雄しべ';
TRAIT_VALUES.hollyhock='杯状の花弁と筒状に集まる雄しべ';
TRAIT_VALUES.pincushion='小花が集まる頭花と突き出す雄しべ';
TRAIT_VALUES.squill='6枚の花被・青い中央線・短い副花冠';
TRAIT_VALUES.salver='細い筒の先で5枚に平開する花';
TRAIT_VALUES.sedgeSpike='小さな褐色の穂';
Object.assign(TRAIT_VALUES,{sideritisLeaf:'灰白の毛に覆われた細長い葉',menthaLance:'白い毛と浅い鋸歯のある細長い無柄の葉',marrubiumRound:'白い毛と丸い鋸歯のある小さな丸葉',leonotisOvate:'長い葉柄と鋸歯を持つ幅広い卵形葉',sideritisLips:'幅広い淡緑色の苞の間に咲く淡黄の唇形花',menthaFloret:'ほぼ等しい4裂の花冠と長く出る4本の雄しべ',marrubiumLips:'2裂する上唇と3裂の下唇を持つ輪状の小花',leonotisHood:'毛に覆われた長い上唇と小さく折れ返る下唇'});

Object.assign(TRAIT_VALUES,{keiskeaLance:'細かい鋸歯のある長楕円葉',isodonOvate:'鋸歯のある卵形の対生葉',chelonopsisElliptic:'先の尖る楕円形の鋸歯葉',triporaOvate:'不規則な白い縁斑のある小さな卵形葉',leucosceptrumBroad:'葉脈が目立つ広楕円形の鋸歯葉',melittisCrenate:'丸い鋸歯と深い葉脈・毛のある卵形葉',keiskeaWhite:'片側に並ぶ白い小花と突き出す4本の雄しべ',isodonDark:'上側4裂・舟形の下側1裂の濃紫色の小花',chelonopsisBell:'長い筒と短い上唇・3裂の下唇',triporaBlue:'不等な5裂花冠と弓状の4本の雄しべ・花柱',leucosceptrumCream:'短い上唇と3裂の下唇・4本の雄しべ',melittisBicolor:'白い上唇と紫色の中央下唇・3裂の萼'});

Object.assign(TRAIT_VALUES,{standingGrass:'冬も枯れ葉・枯れ穂が残る',lateSpringBulb:'冬〜春に葉、夏秋は地上部休眠',lanceSerrate:'細長い鋸歯のある葉',peltate:'葉の中央に柄がつく盾状葉',wavyStrap:'縁が波打つ帯状葉',discHead:'舌状花のない筒状花の頭花',hangingStraps:'下向きの細長い花弁',oneSidedSpike:'横向きの軸の片側につく小穂',grassPanicle:'枝分かれした細い円錐状の小穂'});
Object.assign(TRAIT_VALUES,{springBulb:'冬〜春に葉と花、夏に地上部休眠',strap:'帯状の葉',sword:'剣形の葉',feather:'羽状に細かく裂ける葉',filigree:'糸状に細かく裂ける葉',violet:'上・横・下で異なる5枚の花弁と距',snowdrop:'下向きの外花被3枚と短い内花被',spikelet:'垂れ下がる小穂',bractedHead:'細かな花の頭状花序ととげ状の苞',columnHead:'柱状の花芯と下向きの舌状花',spathe:'仏炎苞と肉穂花序',stamens:'花弁がなく雄しべが目立つ花'});
export function patternKind(base,pattern,color){
 return pattern?base+'-'+pattern+(/^#[0-9a-f]{6}$/i.test(color||'')?'-'+color.slice(1).toLowerCase():''):base;
}
Object.assign(TRAIT_VALUES,{fescueNeedle:'折り畳まれた細い針状葉',milletBlade:'平たく柔らかな線形葉',sedgeRibbon:'細い帯状葉',ficiniaBlade:'切形の先端と白い薄膜の葉縁',lomandraBlade:'先端に小さな裂けのある細葉',acorusBlade:'二列に重なり扇状に開く細葉',goldBambooLeaf:'尖った笹葉',sweetFlagSpadix:'葉状の苞の横につく細い肉穂花序',whitetopHead:'緑の先端を持つ白い苞と中央の小穂'});
export function foliageKind(info){
 const a=info.appearance||{},pattern=a.leafPattern;
 const base=info.form==='hosta'?'leaf-hosta':'leaf';
 if(!pattern&&/^#[0-9a-f]{6}$/i.test(a.leafUnderside||''))return (a.leafTexture==='glossy'?'leaf-glossy':'leaf')+'-underside-'+a.leafUnderside.slice(1).toLowerCase();
 if(!pattern&&a.leafTexture==='woolly')return 'leaf-woolly';
 return pattern?patternKind(base,pattern,a.patternColor):base==='leaf-hosta'?base:a.leafTexture==='glossy'?'leaf-glossy':a.leafTexture==='scaly'?'leaf-scaly':'leaf';
}
Object.assign(TRAIT_VALUES,{umbrellaBract:'茎の頂部に傘状に開く細長い苞',reducedSheath:'普通の葉は退化し、株元に鞘を残す',horsetailSheath:'節を囲む鞘と輪生する黒い小さな歯',twigRushBlade:'基部は厚く、先端は平たい硬い直立葉',protectedWinter:'寒期は屋内等へ移して保護（自然な休眠と区別）'});
Object.assign(TRAIT_VALUES,{campionLeaf:'対生する幅広い葉',fireflyDouble:'細かな花弁が重なる八重花'});
Object.assign(TRAIT_VALUES,{lavenderLinear:'細い線状の葉',lavenderSandLeaf:'銀白色の細い葉',lavenderMerlotLeaf:'切れ込みのある斑入りの葉',lavenderLips:'上下の唇に分かれる小花',gilleniaTrifoliate:'鋸歯のある3枚の小葉',gilleniaStar:'細い5枚の花弁が星形に開く花',rough:'粗い樹皮'});
Object.assign(TRAIT_VALUES,{cosmosPinnatifid:'単葉と切れ込みのある葉の参考',cosmosHead:'舌状花と中心の筒状花が集まる頭花',silverDropLeaf:'対生する丸〜楕円の銀青色の幼葉',momoiroLeaf:'切れ込みと鋸歯のある細めの葉',whiteAnemoneLeaf:'切れ込みと鋸歯のある幅広い葉',melinisBlade:'株元から弓なりに伸びる細い葉',hairyPanicle:'毛のある小穂が枝分かれして広がる穂',anemoneSaucer:'花弁状の萼片と多数のおしべをもつ浅い花'});
export function appearanceSummary(info){
 const a=info.appearance||{};
 return ['leafShape','leafPattern','persistence','flowerShape','habit','barkPattern'].filter(k=>a[k]).map(k=>`${TRAIT_LABELS[k]}：${TRAIT_VALUES[a[k]]||a[k]}`).join(' ／ ');
}
Object.assign(TRAIT_VALUES,{waterCoinShield:'中央に柄が付き、浅い波状の縁を持つ丸い盾状葉',marsileaWedge:'1本の柄の先で4枚に開く扇形の小葉',marsileaBand:'小葉を横切る淡色部と褐色を帯びる帯',bacopaOvate:'厚い対生葉・基部が茎を抱く卵形',bacopaRound:'白い網状の斑が入る黄緑の丸い対生葉',bacopaSpoon:'基部がくさび形に細まる小さなへら形の対生葉',bacopaVeins:'白〜淡黄色の網状の葉脈斑',waterCoinWhorls:'細い軸の数段に輪生する小さな5弁花',bacopaCorolla:'上2裂・下3裂の筒状花冠と内部の長短2対の雄しべ',managedSubmerged:'冬は沈水させて保護する管理例（自然な休眠とは区別）'});
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

Object.assign(TRAIT_VALUES,{winterSubmerged:'冬は水上葉が消え、水中葉で越冬',sagittariaLong:'長い柄の先に付く細長い楕円葉',sagittariaFemale:'白い3弁と緑色の雌しべの集合',nupharSagittate:'基部が矢じり形に切れ込む長い葉',nupharCup:'黄色い5枚の萼・内側の小花弁・円盤状の柱頭',floatingCordate:'切れ込みのある丸い浮葉',waterPoppyCordate:'光沢のある広卵形〜心形の浮葉',fringedWaterFlower:'縁が細かい房状になる黄色い5裂花冠',waterPoppyCup:'淡黄色の3弁が重なり濃い花心を囲む花'});

Object.assign(TRAIT_VALUES,{salviniaFlat:'対になった平たい楕円の浮葉・先端が離れた分岐毛',salviniaFolded:'二つ折りで波打つ浮葉・先端がつながる4分岐の毛',salviniaHood:'縁がフード状に巻く浮葉・分岐しない毛',hyacinthOrbicular:'膨らんだ葉柄の先に付く光沢のある丸い葉',frogbitOrbicular:'短い柄の丸い浮葉・葉裏に海綿状の組織',hyacinthEye:'淡紫の6裂花被・上側の裂片に黄色と紫の斑紋',frogbitFlowers:'細い3弁の雄花と分かれた柱頭の雌花',sporeAnnual:'冬は浮葉が消え胞子で越冬する一年性の水生シダ'});

Object.assign(TRAIT_VALUES,{edraianthusLinear:'細い線形の葉',phyteumaBasal:'長い葉柄を持つ卵形の根元の葉と細い茎葉',michauxiaRough:'粗い毛と鋸歯を持つ長い葉',jasioneOblong:'根元に集まる細長い葉',tracheliumSerrate:'濃色で粗い鋸歯のある卵形葉',wahlenbergiaLeaf:'白い軟骨質の細い縁がある小さな葉',edraianthusBell:'上向きの5裂鐘形花の集まり',phyteumaFloret:'細い5裂片と長い花柱を持つ小花の球状花序',michauxiaReflexed:'強く反る8〜10裂の白い花冠と長い花柱',jasioneFloret:'基部で葯が輪になる5裂の小花の球状花序',tracheliumFloret:'細長い筒と5裂花冠・長い花柱の散房花序',wahlenbergiaBell:'青い脈のある5裂の淡青白色の鐘形花'});

Object.assign(TRAIT_VALUES,{silverCarawayLeaf:'銀白色の毛を持つ小葉が多数並ぶ羽状複葉',seseliSegment:'銀灰緑で細かく分かれる羽状の葉',oenantheLeaflet:'粗い鋸歯とピンク〜クリームの斑を持つ小葉',pimpinellaLeaflet:'卵形の小葉が対になり、先端が3裂する複葉',chervilLeaflet:'大きな3つの部分から羽状に細分する柔らかい葉',heracleumLeaflet:'粗い毛があり大きく深く裂ける小葉',apiaceaeFloret:'5弁・5本の雄しべと2本の花柱を持つ小花',flamingoMargin:'寒期にピンク、暖期にクリームになる不規則な葉縁斑'});

Object.assign(TRAIT_VALUES,{onosmaBristly:'剛毛を持つ細長い根生葉',buglossoidesLance:'伏した毛のある互生する披針形葉',mertensiaFleshy:'厚く毛のない青灰色の全縁葉',nierembergiaSpoon:'密生する小さなへら形の全縁葉',stellariaPointed:'先端が尖る革質の小さな対生葉',dryasCrenate:'丸い鋸歯と凹凸のある厚い葉・白い毛の葉裏',strawberryLeaflet:'大きい鋸歯をもつ三出複葉',onosmaTube:'下向きの淡黄色の筒状花と突き出す花柱',mertensiaBell:'青と桃色の小さな下向きの釣鐘花',gromwellSalver:'細い筒から5裂して平開する青紫の花',nierembergiaCup:'細い花筒の先に上向きに開く白い杯状花',stellariaSplit:'深く割れる5枚の花弁と10本の雄しべ・赤い葯',dryasEight:'通常8枚の白い花弁と多数の黄色い雄しべ',strawberryFive:'5枚の白い花弁と約20本の雄しべ'});

Object.assign(TRAIT_VALUES,{libertiaSword:'硬い扇状の剣葉・冬春の橙色の筋',anthericumRibbon:'花茎より短い弓なりの細葉',tofieldiaSword:'二列に並ぶ薄い剣状葉',ornithogalumRibbon:'花期に枯れ込む灰緑色の細い根生葉',rhodoxisKeeled:'折れ目と細毛のある小さな根生葉',siculumKeeled:'折れ目のある幅広い根生葉',aristeaSword:'扇状に並ぶ柔らかい剣葉',libertiaWhite:'大小3枚ずつの白い花被',anthericumStar:'細い外花被・幅広い内花被と長い花柱',tofieldiaStar:'小さな6花被・6本の雄しべと3花柱',ornithogalumStar:'緑の筋を持つ細い6花被',rhodoxisStar:'黄色い葯が見える桃紫色の6花被',siculumBell:'下向きの釣鐘花・桃色の筋と緑の基部',aristeaBlue:'6枚の青い花被と褐色の薄い苞',floweringLeafBulb:'開花中に葉が枯れ込む球根',siculumBulb:'花後に葉が枯れて球根で休眠'});

Object.assign(TRAIT_VALUES,{roseaPalm:'毛と浅い掌状の切れ込み・丸い鋸歯を持つ葉',rugosaPalm:'凹凸と掌状の切れ込みが強い灰緑色の葉',alceaRuffled:'広い外花弁と中心の細かな八重花弁・一重では雄しべ筒'});

Object.assign(TRAIT_VALUES,{gardenRoseCanes:"品種別の木立ち・つる性の枝",gardenRose:"花径・花弁数・重なりを分けた八重のバラ",roseLeaflet:"先の尖った鋸歯のある卵形小葉"});

Object.assign(TRAIT_VALUES,{cotinusObovate:'先が丸く、縁に鋸歯のない倒卵形の葉',smokePedicels:'小さな5弁花と、花後に伸びて毛が目立つ花柄',smokeTree:'根元から分かれて外へ開くスモークツリーの枝'});

Object.assign(TRAIT_VALUES,{myrtaceousTree:'樹種別の常緑の枝と葉',feijoaOval:'白い毛の葉裏と厚い丸先の楕円葉',myrtusPointed:'光沢のある尖った対生葉',teaBlunt:'縁が内側へ巻く小さな丸先の葉',melaleucaOvate:'複数の縦脈を持つ短い卵形の対生葉',teaPointed:'細く尖った全縁葉',feijoaBrush:'巻き返る4弁と赤い長い雄しべ・黄色い葯',myrtusFive:'白い5弁と多数の長い白い雄しべ',teaFive:'小さな5弁と短い雄しべ',melaleucaClaws:'5つに分かれ先が内側へ曲がる雄しべの束',bottlebrush:'長い雄しべが集まる円筒形の花穂'});

Object.assign(TRAIT_VALUES,{daisyBranches:'葉のつく枝から伸びる細い花茎',coreopsisFine:'細い対生葉',coreopsisBroad:'対生する披針形葉と一部の側裂片',coreopsisPinnate:'細く羽状に分かれる対生葉',coreopsisGrandiflora:'幅のある下葉と分裂する上部の葉',bidensCut:'粗い鋸歯を持ち3つに裂ける葉',brachyFine:'線形の裂片へ深く切れ込む小葉',brachyBroad:'やや幅広い尖った裂片を持つ小葉',brachyRound:'丸みのある裂片を持つ小葉',margueriteCut:'灰緑色の細かく分裂する葉',gazaniaSpoon:'厚く細長いへら形葉と淡い葉裏',osteoToothed:'枝先に集まる厚めの互生の鋸歯葉',daisyCultivarHead:'品種別の舌状花・花色の分布と中央の筒状花'});

Object.assign(TRAIT_VALUES,{asterTaxonHead:"種類別の舌状花・筒状花・総苞をもつ頭花",asterEupatorium:"鋸歯のある3裂葉",asterSilverDust:"丸い裂片へ深く分かれ白毛を持つ銀葉",asterKoreanAster:"細長く鋸歯のある互生葉",asterCrystalMum:"幅広く浅い裂片と鋸歯を持つ菊葉",asterJacobaea:"不規則な切れ込みと白毛のある葉",asterPeacockAster:"細い茎に沿う小さな披針形葉",asterCarrotCone:"ややざらつく幅のある披針形葉",asterFrostyMum:"浅く裂けて丸い鋸歯を持つ菊葉",asterAmberboa:"下部に切れ込みのある淡緑の葉",asterArtichoke:"大きく深裂する銀緑の葉",asterEchibeckia:"ざらつく細長い葉",asterCraspedia:"基部に集まる毛のある細長い銀葉",asterCottonThistle:"白毛・棘と茎へ下がる翼を持つ葉",asterCotula:"細い裂片に羽状に分かれる銀葉",asterRaoulia:"密に重なる微細な灰白葉",asterGiantDaisy:"長い茎に付く鋸歯のある披針形葉",asterHieracium:"白く長い毛が生える小さな卵形葉",asterBerkheya:"大きな波状葉と縁の棘・白い葉裏",asterBerlandiera:"先端が広く基部へ切れ込む琴形葉",asterBellium:"小さいへら形葉",asterMiyakowasure:"浅い鋸歯のある細長い葉",asterSyneilesis:"傘状に開く大きな掌状深裂葉",asterJurinea:"株元に集まる切れ込んだ葉",asterLeptinella:"黒褐色の羽状葉と緑色の若い先端",asterMarshallia:"3本の葉脈のある互生の披針形葉"});

Object.assign(TRAIT_VALUES,{scabiousTaxonHead:'種類別の小花・雄しべ・総苞からなる頭花'});
for(const type of ['knautia','caucasica','anthemifolia','atropurpurea','ochroleuca','columbaria','amethyst','cephalaria','stellata'])TRAIT_VALUES['scabLeaf-'+type]='羽状に切れ込む対生の茎葉';
for(const type of ['knautia','anthemifolia','atropurpurea','ochroleuca','columbaria','amethyst','cephalaria','stellata'])TRAIT_VALUES['scabLeaf-'+type+'Basal']='株元のへら形・琴形または切れ込みのある葉';
Object.assign(TRAIT_VALUES,{'scabLeaf-caucasica':'株元と異なり切れ込みのある茎葉','scabLeaf-caucasicaBasal':'切れ込みのない灰緑色の根生葉','scabLeaf-meltonBasal':'細長い根生葉','scabLeaf-succisella':'細長い披針形の対生葉','scabLeaf-teasel':'対生し基部が杯状につながる棘のある葉'});

Object.assign(TRAIT_VALUES,{verbenaLance:'茎を抱く基部と鋸歯を持つ細長い対生葉',verbenaHastata:'葉脈と鋸歯が目立つ長い対生葉',verbenaBampton:'基部に深い切れ込みと鋸歯のある銅色の対生葉',verbenaSalver:'細い筒の先が5裂する小花'});

Object.assign(TRAIT_VALUES,{dianthusLeaf:'対生し、基部が茎を抱く線状・披針形の葉',dianthusFringed:'縁が裂ける5枚の花弁と細い筒状の萼'});

Object.assign(TRAIT_VALUES,{aquilegiaLeaflet:'丸い切れ込みのある小葉が三つずつ分かれる複葉',aquilegiaFlower:'萼・内側の花弁・距の有無を品種に合わせた花'});

Object.assign(TRAIT_VALUES,{astilbeLeaflet:'先の尖った小葉に重なる鋸歯を持つ三出複葉',astilbePanicle:'細い枝へ小花が密に付く羽毛状の円錐花序'});

Object.assign(TRAIT_VALUES,{iberisEntire:'柄がなく互生する細い全縁の葉',iberisToothed:'柄がなく互生する浅い切れ込みのある葉',iberisUnequal:'外側2枚が大きい4弁花の集まる花序'});
Object.assign(TRAIT_VALUES,{round5:'丸い5裂の掌状葉',round7:'浅く7裂する丸い掌状葉',cut5:'中央裂片が長い5裂の掌状葉',oak5:'二次裂片も深く切れ込む掌状葉',pointed5:'カエデ形に深く切れ込む葉',plum7:'丸い7裂片と浅い二次裂片を持つ葉',veil:'銀緑の葉面と掌状に分かれる葉脈',veins:'掌状に枝分かれする葉脈',heucherellaBell:'5裂の萼と細い花弁がつく小さな鐘形花'});
Object.assign(TRAIT_VALUES,{agapanthusStrap:'根元から2列に重なる帯状葉',agapanthusTrumpet:'6裂する筒状のラッパ形花',agapanthusDouble:'通常より花被片の多い白い花',agapanthusClosed:'花被片が重なり開ききらない袋咲き',distichous:'2列・扇状'});

Object.assign(TRAIT_VALUES,{saxifrageCordate:'白い葉脈と毛のある腎形〜心形の丸葉',bergeniaRound:'細毛を帯びた大きな丸葉',bergeniaObovate:'厚く光沢があり、細かい鋸歯を持つ倒卵形の葉',saxifrageUnequal:'小さい上3枚と長い下2枚・上花弁に斑点',bergeniaCup:'短い筒から5枚が開く杯状の花'});

Object.assign(TRAIT_VALUES,{delphiniumFinePalm:'細い裂片に深く裂ける掌状葉',delphiniumLobedPalm:'5〜7方向に裂け、縁にも切れ込みのある掌状葉',delphiniumProfile:'花弁状の萼・背面の距・中央の小さな花弁'});

Object.assign(TRAIT_VALUES,{lysimachiaCoin:'対生する丸い全縁葉',lysimachiaOvate:'小さな卵形の対生葉',lysimachiaLance:'先が尖り葉脈のある長卵形葉',lysimachiaCup:'基部で合着する5裂の黄花冠と雄しべ5本'});

Object.assign(TRAIT_VALUES,{calaminthaSmall:'浅い鋸歯と細毛のある小さな卵形葉',calaminthaLarge:'大きめの鋸歯と細毛のある卵形葉',calaminthaLips:'長い花筒・浅く割れた上唇・3裂の下唇・中に収まる雄しべ'});

Object.assign(TRAIT_VALUES,{abeliaCanes:'株元から分かれ、外へ湾曲する細い木質枝',abeliaSerrate:'小さな鋸歯・光沢・尖った先をもつ卵形葉',zabeliaOvate:'ほぼ全縁で葉縁と脈上に毛がある細長い卵形葉',abeliaFunnel:'長い筒と5裂する口・4本の雄しべ・花後に残る萼'});

Object.assign(TRAIT_VALUES,{viburnumBranches:'対生する枝葉と種に応じた直立・開張する木質枝',viburnumLaurel:'硬く光沢のある全縁の長卵形葉',viburnumCoarse:'角ばる鋸歯と目立つ側脈のある卵形葉',viburnumHairy:'葉裏に毛がある鋸歯の卵形葉',viburnumObovate:'小さく先側が広い倒卵形葉',viburnumLobed:'大きく3裂し鋸歯のある掌状葉',viburnumSterileBall:'雄しべ・雌しべのない装飾花のみの球状花序',viburnumLacecap:'中央の小さな両性花と周囲の白い装飾花',viburnumSparse:'疎らに垂れる小さな5裂花',viburnumCorymb:'5裂の花筒と5本の雄しべをもつ花の集まり'});

Object.assign(TRAIT_VALUES,{deutziaSprays:'株元から細い枝が弓状に広がり、短枝に花房をつける',deutziaLance:'細かな鋸歯と星状毛がある披針形の対生葉',deutziaOvate:'星状毛のある卵形〜披針形葉',deutziaStar:'5弁花と翼のある10本の雄しべ・3本の花柱',deutziaDouble:'重なる花弁の八重小花が球状に集まる',stellateHair:'細かな星状毛'});

Object.assign(TRAIT_VALUES,{loropetalumShoots:"細かく分岐する枝と互生葉。品種で開張・枝垂れ・ほふくを区別",fothergillaBranches:"株元から分かれ、互生する節で緩くジグザグに伸びる枝",loropetalumOvate:"非対称の基部と細かな毛がある卵形葉",fothergillaSymmetric:"対称な基部と上半分の鋸歯がある青緑の広い葉",fothergillaAsymmetric:"非対称な基部と上半分の鋸歯、凹凸の葉脈がある広い葉",loropetalumRibbons:"細く波打つ通常4枚の花弁と短い4本の雄しべ",fothergillaBrush:"花弁がなく、白い雄しべと黄色い葯が集まるブラシ状の花序",quilted:"側脈に沿って凹凸のある葉面"});

Object.assign(TRAIT_VALUES,{syringaPanicles:"対生葉と枝分かれ、先端に対になりやすい円錐花序",syringaSmall:"小さな卵形〜浅い心形の全縁葉",syringaCordate:"尖った先端と心形の基部をもつ全縁葉",syringaElliptic:"細かな毛のある楕円〜長卵形の葉",syringaTubular:"細い花筒の先が通常4裂し、内部に2本の雄しべ",syringaDouble:"4裂の花冠が重なった八重花"});

Object.assign(TRAIT_VALUES,{oliveLance:'縁が内側へ巻く革質の細い対生葉・葉裏は銀白色',oliveSharp:'細長く先の尖る対生葉',russianOliveLance:'銀色の鱗片で覆われた細長い互生葉',oliveCorolla:'葉腋の小さな4裂花冠と2本の黄色い雄しべ',russianOliveCalyx:'外側が銀白・内側が黄色の4裂する筒状の萼（花弁なし）'});
TRAIT_VALUES.oliveGreen='明るい緑色の細長い対生葉';

Object.assign(TRAIT_VALUES,{osmanthusCorolla:"葉腋に集まる4裂花冠と2本の雄しべ",osmanthusAxils:"十字対生の葉と葉腋の花束",magnoliaTepals:"螺旋状に重なる花被と中央の雄しべ・雌しべ"});
Object.assign(TRAIT_VALUES,{"osmanthus-kaori":"棘のある約1.3cmの極小葉","osmanthus-oni":"大きな棘と光沢を持つ厚い対生葉","osmanthus-shima":"大きな棘と白い覆輪のある対生葉","osmanthus-goshiki":"細かなクリーム色の散り斑と棘のある葉","osmanthus-gold":"細長く厚い革質の対生葉","osmanthus-repeat":"新芽が赤い細長い対生葉","osmanthus-red":"光沢のある長楕円形の対生葉"});

Object.assign(TRAIT_VALUES,{euonymusBranches:"向かい合う葉と枝・葉腋の小花",euonymusCyme:"4枚の花弁と4本の雄しべを持つ小さな集散花序",corkyWings:"枝に縦に残るコルク質の翼","euonymus-dandel":"広い白い覆輪と丸い鋸歯のある小葉","euonymus-compactus":"秋に紅葉する細かな鋸歯の対生葉","euonymus-happiness":"長さ約2cm・丸い先端の細長い光沢葉","euonymus-gold":"新葉がレモン色になる厚い対生葉"});

Object.assign(TRAIT_VALUES,{nandinaCanes:"根元から立つ竹状の幹と繰り返し枝分かれする複葉",nandinaPanicle:"枝先の円錐花序と6枚の花弁・6本の黄色い雄しべ",tripinnate:"三回羽状複葉（小葉へ向けて葉軸が繰り返し分岐）","nandina-otafuku":"幅広くふくらみのある小葉","nandina-murasaki":"紫色の新葉をもつ細長い全縁の小葉","nandina-twilight":"白と桃色の斑・先の尖る楕円形の小葉","nandina-lemon":"明るい黄緑と内側の緑の細長い小葉","nandina-white":"白実ナンテンの細長い全縁の小葉","nandina-seika":"夏も新葉が赤く、冬も紅葉する小葉"});

Object.assign(TRAIT_VALUES,{sarcandraCanes:"まばらに枝分かれする直立茎と対生の葉",sarcandraToothed:"光沢と鋭い鋸歯を持つ厚い長楕円形葉",sarcandraApetalous:"花弁も萼もなく、雌しべの背側に雄しべ1本を持つ小花"});

Object.assign(TRAIT_VALUES,{gardeniaBranches:"株元から分かれ対生の葉を付けるクチナシの枝",gardeniaSix:"筒状の基部から6裂して開く白い花冠",gardeniaLayered:"厚い白い花弁が巻き重なる八重花","gardenia-maruba":"丸い先端と光沢をもつ小さな全縁葉","gardenia-radicans":"細長く光沢のある小さな全縁葉","gardenia-variegated":"クリーム色の不規則な外斑のある全縁葉","gardenia-double":"光沢と葉脈のくぼみのある長楕円形の全縁葉","gardenia-single":"対生または3輪生する光沢のある全縁葉"});

Object.assign(TRAIT_VALUES,{callicarpaArches:"株元から伸びて弓なりにしなる細枝と対生葉",callicarpaFour:"小さな4裂花冠から突き出す4本の雄しべ","callicarpa-shijimurasaki":"白い散り斑と細かな鋸歯を持つ単葉","callicarpa-dichotoma":"上半分だけに粗い鋸歯を持つ小さな単葉","callicarpa-large":"大きく先が尖り全体に鋸歯を持つ単葉","callicarpa-pink":"桃色の果実を付ける株の楕円形の単葉"});

Object.assign(TRAIT_VALUES,{ardisiaShoots:"直立茎の上部に集まる互生葉と葉の下の花・実",ardisiaStar:"下向きの小さな5裂花と中央に集まる尖った葯","ardisia-benikujaku":"波状の丸い鋸歯・歯間の腺体・紅色の砂子斑","ardisia-white":"細かい鋸歯と白い外斑を持つ革質の単葉","ardisia-gold":"黄白色の広い外斑と緑の中心を持つ単葉"});

Object.assign(TRAIT_VALUES,{pomeShrubSprays:'小さな互生葉を密生させる細かい分枝',cotoneasterSilver:'縁に銀白の毛が見える小さな楕円形の単葉',pyracanthaRound:'丸みのある細かい鋸歯葉と不規則な外斑',pomeFive:'5枚の丸い花弁と多数の雄しべが集まる小花'});

Object.assign(TRAIT_VALUES,{southernShrubs:'細葉・複葉・輪生葉を分けた低木の枝',leucospermumToothed:'葉先に歯を持つ厚い長倒卵形の葉',isopogonForked:'溝のある円柱状の裂片へ分かれる葉',acaciaBipinnate:'二回羽状に分かれる小さな複葉',manukaPointed:'硬く尖った小さな互生葉',westringiaNarrow:'白い覆輪のある細い輪生葉',leucospermumPins:'曲がる花柱と花粉提示部・巻き返す花被の針山状花序',isopogonHead:'細い花被が開く桃紫色の頭状花序',acaciaSpike:'葉腋から出る多数の雄しべが集まる黄色い穂',manukaSingle:'暗色の花托を囲む5弁の赤花',manukaDouble:'暗色の中心を囲む縮れた桃色の八重花',westringiaLips:'喉に斑点がある淡紫色〜白の二唇形花',capeProteaceae:'プロテア・リューカデンドロン・グレビレアの異なる枝と花序',proteaCordate:'基部が心形〜耳状になる灰緑色の幅広い革質葉',proteaLeathery:'全縁で厚い楕円形〜倒卵形の互生葉',leucadendronNarrow:'枝先の苞へ続く細長い互生葉',grevilleaAlpina:'毛を帯びる小さな丸葉・裏へ巻く葉縁',proteaInvolucre:'重なる総苞に囲まれた多数の細い小花',leucadendronBracts:'色づく苞とその中心の小さな花序',grevilleaCurled:'赤い基部・黄の巻き返す花被・長い花柱と花粉提示部',banksiaBranches:'幅広い輪生葉の樹木と細葉の株立ち低木を分けた枝',banksiaCoast:'白い葉裏と褐色の脈がある輪生の長倒卵形葉',banksiaTelmatiaea:'縁が裏へ巻く短い線形の互生葉',banksiaHeath:'先端が小さく二つに分かれる短い線形葉',banksiaLeptophylla:'松葉のように細長い互生葉',banksiaHairpin:'小さな鋸歯を持つ細長い線形葉',banksiaGlobe:'短い側枝に付く球形〜卵形の花序・曲がる花柱',banksiaHookedSpike:'多数の細い花被と曲がった花柱を持つ円柱形の花序',rivinaRacemes:'上部の葉腋から伸びる花序に花と実が混在する枝',rivinaOvate:'先が尖った薄い卵形の互生葉',rivinaKasuri:'葉脈に沿う白さと細かな斑が入り縁が波打つ卵形葉',rivinaFourSepals:'白〜淡桃色の4枚の萼・4本の雄しべを持つ小花',leadwortBranches:'地下茎で広がる宿根草と弓なりに伸びる低木の枝',ceratostigmaLeaf:'縁に細毛のある卵形の互生葉・秋に赤銅色へ',plumbagoOvate:'薄い卵形の互生葉',plumbagoAuriculate:'基部が耳状に張り出す倒披針形の葉',ceratostigmaHead:'赤褐色の萼から伸びる青い筒状5裂花',plumbagoSpike:'長い穂に間隔をあけて付く赤い筒状5裂花',plumbagoCluster:'粘着性の腺毛がある萼と淡青色の筒状5裂花',pittosporumBranches:'互生葉を密につける枝と種類ごとの枝先・葉腋の花',tobiraObovate:'枝先に集まる厚い長倒卵形の葉',pittosporumSmall:'丸みのある小葉・縁が軽く波打つ',pittosporumWavy:'縁が波打つ薄い楕円形の葉',tobiraCluster:'枝先に集まる白い5弁花・後に淡黄へ',pittosporumTube:'葉腋の小さな暗赤褐色の筒状5弁花',hypericumShoots:'対生する葉・枝先の黄色い花と種類ごとに異なる草姿',hypericumOvate:'全縁で広い卵形の対生葉',hypericumGold:'黄金色からライム色に変わる楕円形の葉',hypericumSilver:'短毛を帯びた小さな銀色の楕円葉',hypericumStamens:'黄色い5枚の花弁・束状に広がる多数の雄しべ',ruscusCladodes:'常緑の葉状枝を付ける株立ちの細い茎',danaeCladode:'両端が細い笹状の葉状枝・縦に走る脈',ruscusCladode:'先端が刺状の硬い卵形の葉状枝',danaeRaceme:'枝先の短い花序に付く小さな鐘状花',ruscusCladodeFlower:'葉状枝中央の小さな花・花被片は3枚ずつ2段',hardyHibiscusCanes:'株元から毎春伸び直す茎と大きな互生葉',hibiscusBroad:'先が尖り浅い鋸歯のある広い卵形の葉',hibiscusPalm:'細長い裂片へ深く切れ込むモミジ状の葉',hibiscusColumn:'5枚の幅広い花弁・中央の雄しべ筒と5裂の柱頭'});

Object.assign(TRAIT_VALUES,{ninebarkLobed:'細かな鋸歯と3裂する濃紫葉',spiraeaBroad:'青緑色の広卵形葉と紫赤の新葉',rhaphiolepisSmall:'枝先に密集する小さな革質の互生葉',hallianaOvate:'先が尖り細かな鋸歯のある楕円葉',japonicaDoubleSerrate:'重鋸歯のある卵形の互生葉',ninebarkCorymb:'小さな5弁花が半球状に集まる花房',spiraeaCorymb:'長い雄しべを持つ白い小花の散房花序',rhaphiolepisFive:'紅色の中心と5枚の白い花弁',hallianaSemiDouble:'長い花柄に下がる桃色の半八重花',japonicaFive:'枝に沿って咲く淡紅色の5弁花'});

Object.assign(TRAIT_VALUES,{fullmoonNine:'丸い輪郭に7〜11の浅い裂片と細かな重鋸歯',norwayFive:'大きく尖った5裂片を持つ掌状葉',spruceQuadrangular:'1枚ずつらせん状につく四角い断面の針葉',maplePendant:'細い柄から垂れる暗赤色の小花'});

Object.assign(TRAIT_VALUES,{wisteriaPinnate:'1本の葉軸に奇数枚の全縁の小葉が並ぶ羽状複葉',broomSmall:'細い緑枝に付く小さな単葉と下部の三出葉',hagiNarrow:'細長い三小葉',hagiRound:'丸みの強い三小葉',campylotropisSmall:'小さく丸い三小葉と白い毛のある葉裏',woodyPeaFlower:'大きい旗弁・左右の翼弁・舟形に合わさる竜骨弁'});

Object.assign(TRAIT_VALUES,{peonyLobed:'二回に分かれる複葉と深く3裂する小葉',peonyEntire:'二回三出複葉・全縁の幅広い小葉',peonyLayers:'品種ごとに層数の異なる大きな花弁と多数の雄しべ',woodlandPeonyCup:'水平に開かず杯状に重なる花弁と3〜4個の雌しべ'});

Object.assign(TRAIT_VALUES,{sakakiEntire:'細長い全縁の革質互生葉',ilexSerrate:'細かい鋸歯と短毛のある互生葉',marylineWavy:'波打つ革質葉・黄色い中斑と銀灰色の葉裏',myrtlePointed:'小さく先の尖る全縁の対生葉と油点',sakakiBell:'葉腋から下向きに開く白い5弁花',ilexFemale:'淡紫色の小花・中心の子房と円盤状柱頭',oleasterCalyx:'4裂する小さな萼筒（花弁なし）',myrtleFive:'5枚の白い花弁と多数の細い雄しべ'});

Object.assign(TRAIT_VALUES,{vitexThree:'幅広い1〜3小葉・紫の葉裏',vitexPalmate:'対生する掌状複葉・細い5〜7小葉',vitexLips:'上唇2裂・下唇3裂と長短2対の雄しべ'});

Object.assign(TRAIT_VALUES,{silverPrivetOvate:'白い覆輪の小さな全縁対生葉',tinyPrivet:'短い節間に密につく極小の楕円葉',oleanderLance:'主に3輪生する厚い細葉・淡い中央脈',privetFour:'短い筒と4裂する白い小花・2本の雄しべ',oleanderCorona:'重なり合う花冠と筒口の細く裂けた副花冠'});

Object.assign(TRAIT_VALUES,{leucoSpoon:'星状毛に覆われた全縁の銀色の小さな倒卵形葉',incanaToothed:'粗い鋸歯のある対生葉・銀白色の葉裏',sorbetOval:'無毛の小さな楕円葉と不規則な黄色い覆輪',caryopterisLance:'対生する灰緑の細長い葉と浅い鋸歯',leucoBell:'葉腋に1輪ずつ咲く上2裂・下3裂の筒状花と下唇の斑点',caryopterisFringe:'段状に集まる小花・上4裂と縁が細裂する長い下唇・4本の長い雄しべ'});

Object.assign(TRAIT_VALUES,{illiciumLance:'枝先に集まる光沢のある全縁の革質葉',ceanothusSmall:'3本の主脈がある小さく厚い光沢葉',ceanothusOvate:'細かな鋸歯と3本の主脈がある薄い卵形葉',illiciumStraps:'細い帯状の花被が幾重にも開く花',illiciumCup:'幅広く厚い花被が重なる小さな杯状花',ceanothusHoods:'5枚の匙状の花弁・5枚の萼・5本の雄しべが集まる小花の花房'});

Object.assign(TRAIT_VALUES,{rosemaryRevolute:'葉縁が裏へ巻き込む細い対生葉と白い葉裏',santolinaSegments:'銀白色の短毛と丸く細かな裂片のある互生葉',rosemaryBilabiate:'上唇2裂・下唇3裂、蜜標と2本の長い雄しべ',santolinaDiscoid:'長い花茎に多数の筒状花が集まる黄色い半球形の頭花'});

Object.assign(TRAIT_VALUES,{jasminePinnate:'対生する奇数羽状複葉と先端の大きい小葉',honeysuckleOvate:'全縁の対生葉と品種により花房下で合着する葉',jasmineSalver:'細長い花筒の先が5裂して広がる白い花',honeysuckleLips:'上唇4裂・下唇1枚の長い花筒と5本の雄しべ'});

Object.assign(TRAIT_VALUES,{buddlejaAlternate:'互生する細い全縁葉と灰白色の葉裏',buddlejaLance:'対生する尖った細葉・細かい鋸歯と白い葉裏',buddlejaTube:'橙色の喉部と先が4裂する小さい筒状花',axillaryHeads:'前年枝に沿って並ぶ小花群',spacedHeads:'球状の小花群が間隔をあけて連なる花穂'});

Object.assign(TRAIT_VALUES,{ballotaRound:'白い毛と深いしわを持つ丸い対生葉',phlomisHeart:'粗いしわのある心形葉と上ほど小さい茎葉',phlomisArrow:'根元の三角状心形葉と鋸歯のある小さな茎葉',saltHastate:'先が尖る小さな三角形〜ほこ形の葉',saltOval:'銀緑色の小さく丸みのある葉',phlomisHood:'フード状の上唇・3裂する下唇と萼'});

Object.assign(TRAIT_VALUES,{lambEar:'厚い長楕円形の葉を覆う白い毛',betonyLeaf:'丸い鋸歯としわのある小判形の葉',orientalGermander:'細い裂片に深く切れ込む葉',poliumLeaf:'縁が巻き白い毛に覆われた細い葉',germanderOvate:'粗いしわと鋸歯のある対生葉',betonyLips:'上唇と3裂した下唇を持つ筒状花',germanderLip:'上唇がほぼなく下唇と雄しべが目立つ花'});

Object.assign(TRAIT_VALUES,{hopBlade:'掌状に深く裂ける黄金色の葉',akebiLeaflet:'弱い波状鋸歯と散り斑のある3〜5小葉',henryLeaflet:'銀色の葉脈と鋸歯のある3〜5小葉',grapeBlade:'3〜5裂し鋸歯のある銅葉',angelIvyBlade:'白い不規則な覆輪のある3〜5裂葉',telosmaHeart:'3本の基部葉脈を持つ対生する心形葉',hopBracts:'細い花柱と重なる苞を持つ雌花',akebiaSepals:'花弁のない3枚の萼と雌雄異花',grapeStamens:'花弁が脱落して雄しべが見える小花',telosmaStar:'長い筒から5裂する黄緑〜淡黄の花'});

Object.assign(TRAIT_VALUES,{rhodiolaNarrow:'互生する細長い多肉質の葉',smallPeaOval:'先端小葉を伴う羽状の小葉',lotusSlender:'3〜5枚に分かれる細い小葉',lotusSilky:'絹毛のある5枚の小葉',lotusNeedle:'輪生状に見える針状の小葉',rhodiolaCrown:'直立し先だけ反る細い花弁が集まる花穂',peaStandardWingsKeel:'旗弁・翼弁・竜骨弁を分けた蝶形花',parrotBeak:'反る旗弁と鎌状に尖る竜骨弁'});

Object.assign(TRAIT_VALUES,{penstemonBroad:'銅葉にもなる細かな鋸歯のある対生葉',penstemonNarrow:'細長い対生葉',penstemonLinear:'特に細い線状の対生葉',phygeliusOvate:'細かな鋸歯のある卵形の対生葉',rehmanniaCrenate:'深い鋸歯と毛のある根出葉・互生葉',leycesteriaOvate:'先が長く尖る卵形の対生葉',bilabiateFiveLobedTube:'筒部から上下2唇・5裂に開く花',hangingFiveLobedTube:'下垂する筒状で先が5裂する花'});

Object.assign(TRAIT_VALUES,{plantagoRibbed:'複数の縦脈が目立つ広い根出葉',acanthusVariegated:'白い斑と深い切れ込みのある葉',acanthusBroad:'幅広く波状に裂けるアカンサスの葉',acanthusSpiny:'細かく深く裂け、縁が尖る葉',francoaLyrate:'先の裂片が大きい波状の根出葉',fourLobedPapery:'小さな4裂の薄い花冠',fourPetalCross:'4枚の花弁を十字状に開く花',acanthusLowerLip:'大きな萼の下に3裂の下唇だけを持つ花冠'});

Object.assign(TRAIT_VALUES,{poppyOriental:'毛があり深く羽状に裂けたオリエンタルポピーの葉',poppyGlaucous:'白粉を帯びた厚い裂葉と茎を抱く上葉',poppyCambrica:'淡緑色で羽状に裂けるカンブリカの葉',poppyRhoeas:'粗い毛と不規則な切れ込みのあるヒナゲシの葉',poppyRupifragum:'柔らかい綿毛と鋸歯を持つ灰緑色の葉',poppyCrumpledCup:'薄くしわのある杯状の花弁と多数の雄しべ'});

Object.assign(TRAIT_VALUES,{'namedTreeLeaf-redRobin':'厚く光沢と鋸歯のある楕円形の葉','namedTreeLeaf-genpei':'細長い鋸歯葉と葉柄の蜜腺','namedTreeLeaf-natsumatsuri':'短い葉柄と全縁の小さい楕円形の葉','namedTreeLeaf-ena':'不規則な白覆輪のある心形の葉','namedTreeLeaf-hakuro':'対生する細長い斑入りの葉','namedTreeLeaf-asahiyama':'鋸歯と尖った先端を持つ卵形の葉','namedTreeLeaf-osuzu':'対生し表面の粗い全縁の長い葉','namedTreeLeaf-annabelle':'大きい鋸歯と心形の基部を持つ対生葉',crepe:'細い基部と縮れた白覆輪の6枚の花弁',waxyCup:'黄色い17〜19枚の花被が半開するロウバイの花'});

Object.assign(TRAIT_VALUES,{bipinnateFern:'広い三角形の二回羽状葉',ostrichFrond:'基部と先端が細くなる羽根状の葉',irisSword:'扇状に並ぶ剣状葉',coptisFiveLeaflets:'5小葉に分かれる常緑の葉',gunneraPalmate:'大きく掌状に裂ける葉',phylaSpoon:'葉先側に鋸歯のある対生葉',cottonHairy:'銀色の毛に覆われた対生葉',asperulaWhorl:'葉と托葉が輪生する細葉',fringedIris:'黄の隆起と紫斑がある3枚の外花被・3枚の内花被',coptisSepals:'白い5萼片と黄色い小さな花弁',gunneraPanicle:'微小花が集まる円錐花序',phylaHead:'小さい筒状花が密集する花穂',cottonNotched:'先が浅く2裂する5枚の白い花弁',asperulaTubes:'長い花筒と4裂する小さな花冠'});

Object.assign(TRAIT_VALUES,{cabombaFan:'対生する扇状の細裂葉',ceratophyllumFork:'輪生する二又に分かれた葉',egeriaWhorl:'細かな鋸歯と中脈のある輪生葉',ovalisAlternate:'互生する卵形葉',palustrisOpposite:'対生する赤い楕円形葉',rotalaSubmerged:'水中で細長くなる対生葉',glossoSpoon:'匍匐茎に対生するへら形葉',hygrophilaOpposite:'対生する長楕円形の葉',waterTurion:'低温期は短く密な冬芽',submergedPersistent:'保護された水中で葉を保つ参考条件',cabombaPerianth:'白い3萼片と3花弁・黄色い蜜腺',egeriaPetals:'白い3花弁と黄色い雄しべ',ludwigiaApetalous:'花弁のない4萼片の小花',glossoLips:'上下の唇に分かれる5裂の小花'});

Object.assign(TRAIT_VALUES,{hairCulm:'細い緑の稈と基部の葉鞘',greenRotalaLeaf:'赤くならない対生の細葉',nanjenshanWhorl:'細長い葉が3〜5枚輪生',pearlWhorl:'小さく弓なりの葉',largePearlRound:'十字対生する明るい丸葉',newPearlRound:'匍匐茎の小さな丸葉',cobraPhyllode:'横に連なる株から出る平たい細葉',hairSpikelet:'稈の先に付く小さな鱗片の穂',cobraUmbel:'小さな白い5弁花が集まる散形花序'});

Object.assign(TRAIT_VALUES,{mossTriangular:'三角形に広がる茎葉体',mossIrregular:'不規則に枝分かれする細い茎葉体',myrioPectinate:'羽状に細裂した葉が輪生',goldJennyRound:'対生する黄金色の丸葉',indicaWaterLeaf:'水中の細葉と水上の丸葉',rotalaFlowerLeaf:'短い節間に重なる細長い葉',najasFineLeaf:'細かな鋸歯と褐色の中脈がある細葉',jennyCup:'葉腋に付く黄色い5裂の杯形花',indicaSpike:'穂に集まる小さなピンクの4弁花'});

Object.assign(TRAIT_VALUES,{marginGardenPlants:'種類ごとの水辺・低木の形態',helvolaBlade:'基部に切れ込みがある小型の浮葉・暗い斑点',callaArrow:'長い葉柄と矢じり形の葉',lavateraLobed:'灰緑で浅く掌状に裂ける葉',hibbertiaFine:'細く平たい線形葉',helvolaFlower:'淡黄色の細長い多花弁と多数の雄しべ',callaSpathe:'白い仏炎苞と黄色い肉穂花序',lavateraBicolor:'濃い花脈・花底がある5弁と雄しべの柱',hibbertiaFive:'先がくぼむ黄色い5弁花',callaRhizome:'夏休み・冬の枯れ込みと春秋の葉出し'});

Object.assign(TRAIT_VALUES,{uncommonGardenTree:'種類ごとの分枝と葉',snowCrestSpray:'細い鱗片葉・白い枝葉が混じる',whiteEmpireSpray:'白青緑の細い針状の若葉',uncommonCamphor:'3行脈と波打つ縁の革質葉',uncommonUme:'卵形で細かい鋸歯の葉',uncommonWakaki:'先がとがり鋸歯がある葉',uncommonUnryu:'曲がる枝に互生する小さな葉',uncommonJacaranda:'二回羽状の細かい複葉',uncommonCalliandra:'一対の羽片に多数の細かい小葉',uncommonBaobab:'幼葉と掌状複葉の参考',uncommonPlumFlower:'淡桃色の八重花',uncommonWakakiFlower:'若葉とともに咲く白い5弁花',uncommonJacarandaFlower:'分枝した花序に紫の筒状花',uncommonCalliandraFlower:'白い基部と桃色の先端を持つ多数の雄しべ'});

Object.assign(TRAIT_VALUES,{lateGardenHerbs:'種類ごとの葉と花序',lateSnowDragon:'白い縦筋がある弓状の細い葉',lateSweetViolet:'浅い丸い鋸歯と心形の基部がある根生葉',lateTalinum:'厚みのあるへら形の斑入り葉',lateSennichi:'対生する先のとがった卵形の葉',lateVeronica:'対生する細長い鋸歯葉',lateGentian:'対生する3本の葉脈をもつ全縁葉',lateTalinumFlower:'5弁の桃色の小花と多数の黄色い雄しべ',lateSennichiHead:'赤紫の小さな苞が重なる細い頭花',lateVeronicaSpike:'下から開く4裂の小花と2本の雄しべ',lateGentianDouble:'淡紫青の筒状花冠が重なる八重花'});

Object.assign(TRAIT_VALUES,{mixedCalylophus:'細い枝に並ぶ小さな線形葉',mixedAptenia:'厚みのある対生の卵形葉',mixedCyclamen:'心形の葉と銀色の模様',mixedAcalypha:'鋸歯と白緑の細かな斑がある互生葉',mixedDasylirion:'小さな鉤状の刺が縁にある硬い帯状葉',mixedEmpetrum:'縁が巻き込む小さな針状葉',mixedDacrycarpus:'左右に開く幼形針葉と小さな成葉',mixedApteniaFlower:'赤紫の細い花弁が多数並ぶ花',mixedCyclamenFlower:'花の基部から上へ反り返る5枚の花弁',mixedAcalyphaFlower:'赤い糸状部分が密集する尾状の花序',mixedGiliaFlower:'淡紫・白・暗紫・黄の喉をもつ5裂の花'});

Object.assign(TRAIT_VALUES,{fleshyStacked:'十字対生で重なる三角形の厚葉',fleshyBean:'青白い粉を帯びる丸い小さな厚葉',fleshySpoon:'種類ごとに幅・厚みが異なるへら形〜楕円形の多肉葉',fleshyPendantBell:'下を向く筒状花と外へ反り返る5裂の先端'});

Object.assign(TRAIT_VALUES,{pearlLeaf:'透明な細い筋と小さな先端を持つ球形の厚葉',dolphinLeaf:'曲がった厚葉と背びれ状の突起',chainStem:'3稜の節がずれて鎖状につながる緑色の茎',curledNeedle:'細くねじれて巻く根生葉',minuteLeaf:'新しい先端の極小葉・早落して緑色の茎を残す',cageFlower:'基部が膨らむ筒と先端でつながる5裂片の籠状部'});

Object.assign(TRAIT_VALUES,{pairedBody:'2枚が合着し中央に裂け目がある多肉質の葉体',wartedStem:'葉や刺のない凹凸のある多肉茎',fiveRibStem:'稜に突起が並ぶ角張った多肉茎',tongueFleshy:'先の丸い舌状の厚葉',summerSheathed:'夏は乾いた旧葉の皮を残し、秋に新葉が現れる',summerClosed:'夏は葉を閉じたロゼットを残す',mesembFlower:'多数の細い花弁状の仮雄しべと中央の雄しべ'});

Object.assign(TRAIT_VALUES,{spinySucculentBlade:'幅広く湾曲する厚葉と、縁の鋸歯・先端の刺'});

Object.assign(TRAIT_VALUES,{heartCaudex:'細いつるにつくハート形の葉',caudexBlade:'太い枝の先端に集まる厚葉',caudexFunnel:'先端が5裂する漏斗形の合弁花',caudexSummerRest:'夏に葉を落とし、露出塊根を残す参考',caudexWinterRest:'低温期に葉を落とし、幹と枝を残す参考'});

Object.assign(TRAIT_VALUES,{retainedSucculentStem:'保護栽培で地上に残る多肉質の茎',cactusBowl:'多くの花被片を重ねる杯状の花',cactusFunnel:'多くの花被片を重ねる漏斗状の花'});

Object.assign(TRAIT_VALUES,{haworthiaThickLeaf:'種類ごとに異なる厚葉と、窓・網目・突起・ノギ'});

Object.assign(TRAIT_VALUES,{redMaple:'主な3裂と小さな下部2裂・粗い鋸歯を持つ単葉',redMapleCluster:'葉より先に枝に集まる小さな赤い花',maple:'深く掌状に裂けた鋸歯のある単葉',maplePendant:'新しい枝から下垂する小さな5弁花'});

TRAIT_VALUES.scrambling='長い枝を支えに誘引する（自力では巻きつかない）';

Object.assign(TRAIT_VALUES,{storkbillHeart:"丸い浅裂葉と心形の基部",storkbillShallow:"5〜7浅裂する丸い有毛葉",storkbillPalm:"細い裂片に分かれる掌状葉",storkbillFine:"銀色で細かく裂ける羽状の葉",storkbillPinnate:"歯のある幅広い小葉が羽状に並ぶ葉",storkbillFlower:"上側2枚と下側3枚で形・模様が異なる5弁花"});

Object.assign(TRAIT_VALUES,{persicariaCordate:"心形の基部と長い先端・少し波打つ葉面",persicariaTepals:"穂に並ぶ5枚の小さい花被と8本の雄しべ"});

Object.assign(TRAIT_VALUES,{japonicaLeaf:'株元に広がる、しわと鋸歯のある広いへら形の葉',candelabraPrimula:'長い花筒と先端がくぼむ5裂の花冠・段状の輪生花'});

Object.assign(TRAIT_VALUES,{ajugaSmall:'小さなへら形の対生葉',ajugaObovate:'丸い鋸歯としわのある広い倒卵形葉',ajugaCrisped:'強く縮れ、縁が内側に巻く光沢葉',ajugaIncised:'粗く深い切れ込みと尖った歯のある対生葉',ajugaLips:'短い2裂の上唇と大きな3裂の下唇・4本の雄しべ'});

Object.assign(TRAIT_VALUES,{shallow7:'浅い7裂と丸い鋸歯のある葉',cut7:'切れ込みの深い7裂葉',ruffle7:'波打つ縁を持つ7裂葉',frill7:'細かく縮れる7裂葉',heucheraBell:'5裂する小さな萼筒と花弁・5本の雄しべ・2本の花柱'});

Object.assign(TRAIT_VALUES,{narrow5:'細長い裂片に分かれる5裂葉',lace5:'深い切れ込みと鋸歯のある葉',fine5:'細い裂片を持つ深裂葉',tiarellaRaceme:'細い5花弁と10本の雄しべが目立つ総状花序'});

Object.assign(TRAIT_VALUES,{brunneraSilverMargin:'銀葉と緑の網状葉脈・クリーム色の覆輪',brunneraCorolla:'白い喉部と丸い5裂・短い筒の小花'});

Object.assign(TRAIT_VALUES,{trifoliumLeaf:'丸〜倒卵形の小葉3枚（四つ葉が出る系統は4枚も）',cloverPeaHead:'小さな蝶形花が集まる頭花・花穂',cloverBlack:'黒紫の葉と細い緑の縁',cloverPink:'銀緑の葉・春秋のピンク色と暗色の中心',cloverRouge:'淡緑〜銀色の葉と赤紫の中央斑',cloverWine:'赤紫の葉と付け根側の緑色の模様',cloverWilliams:'赤褐色と緑の葉',cloverGold:'黄金色の葉と淡い山形斑',cloverFour:'黒紫の四つ葉系統と緑の縁',cloverCrimson:'毛のある緑の三小葉'});

Object.assign(TRAIT_VALUES,{mahoniaPinnate:'細長い小葉が左右と先端に並ぶ羽状複葉',mahoniaRaceme:'枝先から立つ黄色い小花の総状花序'});

Object.assign(TRAIT_VALUES,{cerastiumWool:'白い軟毛に覆われた細長い対生葉',cerastiumNotched:'先端が2裂する白い花弁5枚と分枝した花序'});
Object.assign(TRAIT_VALUES,{shastaFrilled:'細い舌状花が重なる品種別の八重・糸状の頭花'});
Object.assign(TRAIT_VALUES,{bellisSpoon:'地際に集まる浅い鋸歯のへら形葉',bellisHead:'葉のない花茎の先に1つ付く小さな頭花'});
Object.assign(TRAIT_VALUES,{oleariaSmokyLeaf:'白い毛を帯びた小さなへら形〜倒卵形の互生葉',oleariaAxillary:'葉の付け根にある小さな黄色い頭花の参考'});

Object.assign(TRAIT_VALUES,{ulmariaPinnate:'大小の側小葉と3裂する頂小葉が並ぶ羽状複葉',ulmariaCream:'葉の中央と主脈に沿う不規則なクリーム色の斑',ulmariaSingle:'白い5弁花と細い雄しべが集まる円錐状の花房',ulmariaDouble:'小さな丸い花弁が幾重にも重なる白い八重花'});

Object.assign(TRAIT_VALUES,{dropwortPinnate:'深い鋸歯の小葉が多数並ぶ、株元中心の細かい羽状複葉',dropwortDouble:'細長い白い花弁が重なる八重花'});

Object.assign(TRAIT_VALUES,{aruncusCompound:'鋭い重鋸歯の小葉が枝分かれして並ぶ複葉',aruncusPlume:'細い枝に微小な5弁花が密集する羽状の花穂'});

Object.assign(TRAIT_VALUES,{aruncusFine:'小さく深く切れ込む小葉が密に集まる細かな複葉'});

Object.assign(TRAIT_VALUES,{burnetNarrowCompound:'細く深い鋸歯の小葉が羽状に並ぶ複葉',burnetBroadCompound:'青灰緑で幅広い鋸歯の小葉が羽状に並ぶ複葉',burnetFilaments:'花弁がなく4枚の萼と長い雄しべが集まる下垂する花穂'});

Object.assign(TRAIT_VALUES,{branching:'細い茎が枝分かれする草姿',orlayaDivided:'2〜3回細かく分かれる羽状の葉',orlayaLace:'傘状の小花房が集まり、外向きの花弁だけ大きく2裂する白花'});

Object.assign(TRAIT_VALUES,{centranthusLeaves:'下葉は柄のある披針形、上葉は茎を抱く灰緑色の対生葉',centranthusThyrse:'細い花筒・距・5裂の花冠と1本の雄しべを持つ小花の房'});

Object.assign(TRAIT_VALUES,{roseCampionLeaves:'毛で銀白色になるへら形の根出葉と小さくなる対生の茎葉',roseCampionSingle:'白地に桃色が差す、先が浅くくぼむ5枚の花弁',roseCampionDouble:'濃い赤紫の花弁が重なる八重花'});

Object.assign(TRAIT_VALUES,{chalcedonicaLeaves:'緑色で毛のある卵形〜披針形の対生葉',chalcedonicaFlowers:'先が深く2裂する5枚の花弁を持つ、茎先の密な小花房'});

TRAIT_VALUES.linariaPeachyLeaf='灰緑色のやや幅広い披針形葉（交配品種の写真を参考）';

Object.assign(TRAIT_VALUES,{linumLeaf:'細い灰緑色の全縁葉（偽輪生に見える密な節を参考）',linumBlue:'濃青の脈がある5枚の空色花弁と5雄しべ・5花柱'});

Object.assign(TRAIT_VALUES,{miyakowasureLeaf:'互生する大きな鋸歯のある長楕円葉と、翼のある葉柄をもつ根生葉',miyakowasureHead:'紫の舌状花と淡黄色の筒状花を持つ頭花・2列の総苞片'});

Object.assign(TRAIT_VALUES,{belliumLeaf:'全縁で丸みのある小さなへら形葉・株元のロゼット',belliumHead:'無葉の花茎につく1cm未満の白い頭花・黄色い筒状花'});

Object.assign(TRAIT_VALUES,{marshalliaLeaf:'根元に多く上へ小さくなる、明瞭な3本の葉脈を持つ細長い葉',marshalliaHead:'舌状花がなく、反り返る5裂花冠と二裂花柱を持つ小花の頭花'});

Object.assign(TRAIT_VALUES,{koreanAsterLeaf:'互生し上へ小さくなる、ほぼ無毛の尖った披針形葉。花期に根生葉がなくなる',koreanAsterHead:'淡紫色の舌状花と黄色い筒状花、半球形の総苞を持つ頂生頭花'});

Object.assign(TRAIT_VALUES,{syneilesisUmbrellaLeaf:'春に白毛を帯びて下へ閉じ、後に傘状に開く掌状深裂葉。下葉は楯状、上葉は底着',syneilesisPanicle:'白〜淡紅色の小花を集める頂部の円錐花序。開花まで数年を要する'});

Object.assign(TRAIT_VALUES,{craspediaWoollyLeaf:'株元に集まる銀緑色の細長い有毛葉と複数の縦の葉脈',craspediaGlomerule:'各花茎の先に1個の球。黄色い苞と部分頭花、その中の小花が集まる複合花序'});

Object.assign(TRAIT_VALUES,{leptinellaPinnatifid:'黒褐色の羽状深裂葉。細かい裂片が葉軸につながり、先端に緑が残る',leptinellaButton:'無葉の短い花茎の先に小さな淡黄緑〜白の頭花。雌雄と細部は未同定'});

Object.assign(TRAIT_VALUES,{artichokeLobedLeaf:'株元に広がる大きな銀緑の羽状深裂葉と、茎に互生する小さな葉',artichokeScalyHead:'肉厚で重なる総苞に包まれた蕾と、紫の細い筒状花が密集する大きな頭花'});

Object.assign(TRAIT_VALUES,{cotulaDividedLeaf:'細かく二重に裂けた柔らかな銀灰色の葉が低く密生',cotulaButton:'非常に細い無葉花茎の先の黄色いボタン状花。小花の詳細は未同定'});

Object.assign(TRAIT_VALUES,{jurineaDividedLeaf:'株元に多い羽状深裂葉と少数の茎葉。葉裏は灰白色。小苗は切れ込みの少ない葉',jurineaNoddingHead:'曲がる花茎に横・下向きにも咲く赤紫の頭花と、先が曲がる細い総苞片。花後は白い冠毛'});

Object.assign(TRAIT_VALUES,{cottonSpinyLeaf:'銀灰色の裂葉。葉縁に棘があり、茎葉は上ほど小さい',cottonSpinyHead:'棘を持つ細い総苞片に囲まれた紫の筒状花。分枝した茎には棘付きの翼'});

Object.assign(TRAIT_VALUES,{raouliaImbricateLeaf:'長さ2mm以下のへら形の葉が、短い枝先で約5列に密に重なる。灰白色の伏せた毛',raouliaTinyHead:'径4〜5mmの小さな頭花。12〜20個の漏斗形小花と黄みのある総苞片。大きな舌状花はない'});

Object.assign(TRAIT_VALUES,{hieraciumHairyLeaf:'長い白毛のある単純葉。下葉はへら形〜披針形、上の茎葉は無柄で基部が広い',hieraciumLigulateHead:'黄色い5歯の舌状花だけからなる頭花。長い白毛の総苞と丸い蕾、1茎に1〜4頭花'});

Object.assign(TRAIT_VALUES,{berkheyaSpinyLeaf:'波打つ棘のある葉。裏は白い毛があり、茎葉の基部が翼状に続く',berkheyaPollenHead:'淡紫の舌状花と暗紫の筒状花、白い花粉。棘のある総苞が花後に閉じる'});

Object.assign(TRAIT_VALUES,{berlandieraLyrateLeaf:'互生する有柄の単純葉。羽状の切れ込みと柔らかい毛',berlandieraRadiateHead:'黄色い舌状花8枚と赤褐色の筒状花・緑の未熟小花、丸い緑の総苞'});

Object.assign(TRAIT_VALUES,{jacobaeaWoollyLeaf:'白毛に覆われた互生の単純葉。丸い裂片と深浅の切れ込み、下葉には葉柄',jacobaeaCorymbHead:'分枝した花茎の小さな黄色い頭花。舌状花と筒状花、白毛のある総苞'});

Object.assign(TRAIT_VALUES,{giantDaisySerrateLeaf:'互生する無柄の細長い単純葉。粗い鋸歯と葉の基部の裂け、細かな腺点',giantDaisyRadiateHead:'白い舌状花と丸く盛り上がる黄色い筒状花、重なる緑の総苞',amberboaHairyLeaf:'株元の有柄のへら形葉と、茎の細い互生葉。白い毛と浅い切れ込み',amberboaRadiantHead:'ライラック色の細く5裂する周辺の筒状花と淡い中央の小花。暗い縁と短い棘を持つ総苞'});

Object.assign(TRAIT_VALUES,{carrotCakeLeaf:"互生する有柄の細い卵形葉。全縁のうねり、羽状の葉脈と短い剛毛",carrotCakeAnemoneHead:"下を向く外側の舌状花と、中央に盛り上がる筒状花。橙色から桃色がかる八重の花"});

Object.assign(TRAIT_VALUES,{empressCompoundLeaf:'対生する小型の複葉。細長く鋸歯のある小葉が離れ、上部は小さい葉',empressCorymbHead:'桃色の総苞に淡桃色の筒状花を集め、白い二股の花柱が突き出す花房'});

Object.assign(TRAIT_VALUES,{crystalLobedLeaf:"有柄で互生する切れ込みの深い緑葉",crystalDecorativeHead:"濃い赤紫の幅広い舌状花が重なり、内側が立ち上がる厚い八重花",frostyLobedLeaf:"互生する有柄の切れ込みのある葉。表裏に細かい毛",frostyDecorativeHead:"白い舌状花が多層に重なる小輪の八重花",electraObovate:"毛のある幅広い倒卵形〜倒披針形の葉。茎葉は互生",electraQuilledHead:"筒状に巻いた二色の舌状花と、中央に盛り上がる筒状花"});

Object.assign(TRAIT_VALUES,{ruriLanceolateLeaf:"互生する細い披針形の葉。枝先ほど小さくなり、開花時は下葉が少ない",ruriDoubleHead:"細い青紫の舌状花が重なり、中央に小さな黄緑色の筒状花が見える八重花"});

Object.assign(TRAIT_VALUES,{brascoPinnatifidLeaf:'葉柄がなく羽状に切れ込むへら形の互生葉',brascoSingleHead:'紫色の舌状花と黄緑から黄色になる筒状花'});

Object.assign(TRAIT_VALUES,{frescoLobedLeaf:'丸みのある裂片を持つ幅広い互生葉',frescoPinkHead:'丸みのある桃色の舌状花と黄色の筒状花'});

Object.assign(TRAIT_VALUES,{petitFineLobes:'細い線形の裂片に分かれる小葉',supremeFineLobes:'細く深く裂け、先が少し曲がる互生葉',petitLavenderHead:'淡いラベンダー色の小さな舌状花と黄色の中心',supremeWhiteHead:'白い細い舌状花と黄緑から黄色の中心'});

Object.assign(TRAIT_VALUES,{goldenSphereLeaf:'葉柄のない対生の倒披針形葉。丸い先端と全縁',goldenSphereHead:'黄金色の舌状花が中心まで丸く重なる八重花。筒状花はない'});

Object.assign(TRAIT_VALUES,{marmaladePinnateLeaf:'長い葉柄を持ち、3〜5裂する対生葉と上部の細い単葉',garnetLanceolateLeaf:'対生する細長い単葉。丸い先と全縁、短い葉柄',marmaladeSingleHead:'8枚の杏色〜橙色の舌状花、黄色い基部と筒状花',garnetSingleHead:'先端が浅く3裂する桃赤色の舌状花と暗赤紫の基部、中央の筒状花'});

Object.assign(TRAIT_VALUES,{rubyPinnatifidLeaf:'対生し、3〜5枚の細い裂片に分かれる有柄の葉',redshiftLanceolateLeaf:'葉柄のない対生の披針形葉。時に片側へ細長い裂片',rubyFrostHead:'不規則なクリーム色の縁が暗赤色を囲む8枚の舌状花と、黄色〜褐色の中心',redshiftHead:'夏は淡黄の舌状花に暗赤の目、低温期は赤い面積が広がる花'});

Object.assign(TRAIT_VALUES,{starClusterLinearLeaf:'対生する無柄の細い線形葉。全縁で先が尖る',fullMoonTrifidLeaf:'対生する無柄の3裂葉と細い単葉。裂片は全縁',starClusterHead:'白い舌状花に暗紫の目、低温期は紫の縁と淡い紫の色付き',fullMoonHead:'幅広い8枚の舌状花が重なる大輪。黄色からクリーム色へ咲き進む'});

Object.assign(TRAIT_VALUES,{canaryLeaf:'表は緑、裏は白い披針形〜へら形の葉。一部は中ほどに深い切れ込み',prettyBidensLeaf:'対生する幅広い鋸歯葉。上部には3裂・3小葉状の葉も混じる',canaryHead:'淡いクリーム色から基部の黄橙色へのグラデーション。黒い目模様のない頭花',prettyBidensHead:'淡い桃色に濃い筋の入る舌状花と、黄色い筒状花の中心'});
Object.assign(TRAIT_VALUES,{redSatinLeaf:'無柄で対生する線形葉。単葉と細い3裂葉が混在',chameleonLeaf:'無柄で対生する細長い単葉。一部は2裂する',redSatinHead:'細い8枚の舌状花。夏の赤紫から秋の濃いワイン色へ',chameleonHead:'8枚の舌状花と内側の小さな花弁状器官。白から桃色へ咲き進む'});
Object.assign(TRAIT_VALUES,{iceWineDividedLeaf:'無柄で対生し、3〜5本の細い裂片に分かれる葉',cosmicLinearLeaf:'無柄で対生する細い線形の単葉',iceWineHead:'9〜11枚の白い舌状花と、はっきりしたベリー紫の目・赤褐色の中心',cosmicHead:'白い8枚の舌状花が互い違いに重なり、低温や咲き進みで赤紫の目と縁が広がる'});

Object.assign(TRAIT_VALUES,{tangoLinear:'対生する細い単葉（品種写真を参考）',tangoDivided:'細い裂片へ分かれる対生葉（品種写真を参考）',tangoHead:'先端に切れ込みのある約8枚の舌状花・褐色の筒状花と黄色い花柱'});

Object.assign(TRAIT_VALUES,{angelicDissected:'灰緑色で二段に深く切れ込む互生葉',angelicPinkHead:'細長い桃色の舌状花と黄色い筒状花・重なる総苞片'});

Object.assign(TRAIT_VALUES,{teaselCorrugated:'浅い鋸歯としわのある単葉・対生葉の基部が杯状につながる',teaselRingHeads:'卵形から円柱形の棘ある花穂・4裂する小花が輪状に開花'});

Object.assign(TRAIT_VALUES,{drumstickLeaves:'下部は鋸歯のあるへら形・上部は羽状に切れ込む対生葉',drumstickFlowers:'中心は白く周囲は淡青の大きな小花・花後は紙状の杯と暗色の星形の萼'});

Object.assign(TRAIT_VALUES,{knautiaMarsLeaves:'切れ込む根出葉と、全縁から羽状中裂の対生葉',knautiaThunderLeaves:'クリーム色で縁取られた倒披針形の対生葉。一部は左右2対に切れ込む',knautiaMarsHead:'ルビー色の4裂する小花と白っぽい葯を集めた小さな花頭',knautiaThunderHead:'赤紫の小花を集めた花頭と、クリーム色で縁取られた13枚前後の総苞片'});

Object.assign(TRAIT_VALUES,{pinkLaceLeaves:'幅広く丸い鋸歯のある根出葉・花茎では深く裂ける葉',amethystPinkLeaves:'幅広い根出葉と細く裂ける対生葉・よく枝分かれする株',pinkLaceFrill:'外側が大きくフリル状に開く桃紫の花頭',amethystPinkDome:'淡い藤桃色の周辺花と高く盛り上がる淡色の小花'});

Object.assign(TRAIT_VALUES,{whiteQueenLeaves:'灰緑の細長い根出葉・花茎の少数の長い裂片に分かれる葉',moonDanceLeaves:'幅広く丸い鋸歯のある根出葉・花茎の非常に細く裂ける葉',whiteQueenHead:'大きな白い周辺花と小さな中央花が輪状に開く花頭',moonDanceHead:'淡黄色の小花と、花後に小さな杯と萼の毛を残す花頭'});

Object.assign(TRAIT_VALUES,{belarinaLeaf:'しわと丸い鋸歯のある楕円形または倒披針形の根出葉',belarinaFlower:'品種別の多層八重花と大きな萼',irishPrimulaLeaf:'細かな丸い鋸歯と網状のしわを持つ根出葉',irishPrimulaFlower:'浅く切れ込む5裂花・白い筋または淡い縁の八重花'});

Object.assign(TRAIT_VALUES,{wildPrimroseLeaf:'深い網目状のしわと浅い鋸歯を持つへら形の根出葉',wildPrimroseFlower:'毛のある花柄に単生する淡黄色の5裂花冠・株ごとに異なる花柱の高さ'});

Object.assign(TRAIT_VALUES,{bengalLeaf:'波打つ縁と不規則な切れ込みを持つ有毛の根出葉',bengalHead:'先端が3裂する舌状花・短い移行花・中心の細かな小花からなる大輪の頭花'});

Object.assign(TRAIT_VALUES,{gardenGerberaLeaf:'広い先端と切れ込みのある根出葉',gardenGerberaHead:'品種ごとの舌状花・短い移行花と中心の小花を持つ頭花'});

Object.assign(TRAIT_VALUES,{wildGerberaLeaf:'若葉は浅く成葉は深く裂ける毛のある根出葉',wildGerberaHead:'細い舌状花と短い内側の小花を持つ原種ガーベラの頭花'});

Object.assign(TRAIT_VALUES,{woodlandPhloxBasal:'匍匐枝の大きなへら形葉と花茎の小葉',woodlandPhloxSalver:'細い筒から開く5裂の花冠'});

Object.assign(TRAIT_VALUES,{tapienDissectedLeaf:'細かく深く裂けた対生葉と毛のある匍匐枝',tapienRunnerSalver:'中央につぼみを残す房と先端がくぼむ5裂の小花'});

Object.assign(TRAIT_VALUES,{peachBellBasalLeaf:'細かな鋸歯のある細長い根出葉と小さな互生の茎葉',peachBellCup:'横〜斜め上を向く5裂の広い釣鐘形花冠'});

Object.assign(TRAIT_VALUES,{harebellBasalLeaf:'丸い根出葉と互生する糸状の茎葉',harebellCup:'細い枝先で下を向く5裂の釣鐘形の花'});

Object.assign(TRAIT_VALUES,{clusterBellBasalLeaf:'細かな鋸歯と毛のある卵形〜披針形の根出葉と小さな互生茎葉',clusterBellCup:'上向きの5裂の小花が茎先と上部の葉腋へ集まる',clusterBellCalyxBud:'細裂する白い萼と青紫の蕾の観賞段階（開花後は未確認）'});

Object.assign(TRAIT_VALUES,{milkBellBasalLeaf:'細かな鋸歯と葉脈の起伏をもつ卵形〜披針形葉と小さな互生茎葉',milkBellCup:'上部で枝分かれする円錐状の花序と、広く開く5裂の小花'});

Object.assign(TRAIT_VALUES,{alpineBellLeaf:'低く密集し、細かい鋸歯と葉脈の起伏をもつ小葉',alpineBellCup:'低い株から立つ大きな5裂の釣鐘形花冠（青花は長い毛を描写）'});

Object.assign(TRAIT_VALUES,{noddingBellBasalLeaf:'毛と鋸歯をもつ心形の根出葉と小さな互生茎葉',noddingBellOpenCup:'片側へ並ぶ下向きの5裂の青い釣鐘形花',noddingBellNarrowCup:'弓状の花茎に並ぶ細長い5裂の白い釣鐘形花'});

Object.assign(TRAIT_VALUES,{lanternBellBasalLeaf:'毛や葉脈の起伏と鋸歯をもつ心形の根出葉・小さな互生茎葉',lanternBellCup:'下向きの長い5裂の釣鐘形合弁花',lanternBellDouble:'外側と内側の2つの花冠が重なる下向きの二重咲き'});

Object.assign(TRAIT_VALUES,{gardenBellAmethystLeaf:'鋸歯と葉脈の起伏をもつ大きな卵形〜長楕円形の葉',gardenBellIrisLeaf:'丸い鋸歯をもつ小さな心形〜卵形葉',gardenBellMajesticLeaf:'葉脈が目立ち、浅い鋸歯をもつ卵形の小葉',gardenBellAmethystCup:'立つ花茎に並ぶ、長い5裂のやや下向きの釣鐘形花',gardenBellIrisStar:'浅い杯状の基部から大きく開く5裂の青紫の花',gardenBellMajesticCup:'低い株から横〜斜め上を向く、ふくらんだ5裂の青い釣鐘形花'});

Object.assign(TRAIT_VALUES,{adenophoraLinearLeaf:'短い葉柄と低い鋸歯をもつ細長い互生茎葉',adenophoraLanceLeaf:'3〜6枚の輪生を参考に一節4枚で描く披針形の葉',adenophoraHeartLeaf:'属の資料を参考にした心形の根元の葉',adenophoraBellCup:'下を向く5浅裂の釣鐘形花冠と、花冠内の花柱',adenophoraSmallCup:'小さい筒状の5裂花冠から長く突き出す花柱',adenophoraDoubleBell:'外側と内側の花冠を重ねた八重咲きの参考'});

Object.assign(TRAIT_VALUES,{balloonLeaf:'短い葉柄と鋸歯をもち、葉脈が目立つ卵形〜披針形の葉',rockSoapwortLeaf:'小さい全縁の対生葉',tallSoapwortLeaf:'3本の主脈が目立つ幅広い対生の単葉',cowherbLeaf:'茎を抱く青緑色の対生葉',trainedVineHeart:'細かい鋸歯と葉脈の起伏がある心形〜卵形の対生葉',trainedVineShallow:'浅く裂け、基部から5本の葉脈が広がる互生葉',trainedVineDivided:'深く裂け、基部から葉脈が広がる互生葉'});

Object.assign(TRAIT_VALUES,{silverBushLeaf:'絹毛に覆われた細長い銀葉',bindweedBasalLeaf:'種の下葉を参考にした幅広い基部の葉'});

Object.assign(TRAIT_VALUES,{berzeliaNeedle:'細く密につく針状葉'});

Object.assign(TRAIT_VALUES,{snowdropConvolute:'葉元で一方が他方を巻く青灰緑の帯状葉',snowdropPleated:'縦のひだがある幅広い青灰緑の葉',snowdropBroad:'商品写真を参考にした幅広い帯状葉（種は未確認）'});

Object.assign(TRAIT_VALUES,{grapeArchLeaf:'溝と平行脈があり、先が弓状に下がる細長い根出葉',grapeGutterLeaf:'平行な脈と浅い溝のある半直立の根出葉',grapeUrn:'6浅裂する小さな花口がくびれた壺形の合着花被',grapeAzure:'開口がくびれず、青い縦線と6浅裂のある鐘形の合着花被'});

Object.assign(TRAIT_VALUES,{squillGutterLeaf:'全縁で浅い溝と平行脈のある帯状の根出葉',earlySquillFlower:'星形に開く6枚の花被と6雄しべ・品種別の中央線や白い花心'});

Object.assign(TRAIT_VALUES,{erythroniumOvate:'浅い波と平行脈・立体的な溝をもつ一対の広い卵形葉',erythroniumFaintMottle:'写真の控えめな葉斑を参考にした不規則な色むら',reflexFawnLily:'反り返る6枚の花被と、下向きに伸びる6雄しべ・花柱'});

Object.assign(TRAIT_VALUES,{acisThreadLeaf:'糸のように細く、先が尖る根出葉',acisAutumnBell:'緑の先端斑がない6枚の白い花被と、下向きの小さな鐘形花'});

Object.assign(TRAIT_VALUES,{tecoGutterLeaf:'浅い溝と平行脈のある細長い根出葉2〜3枚の参考',tecoFunnel:'白い喉部がある6裂の漏斗形花被・前側3雄しべと後側3仮雄しべ'});

Object.assign(TRAIT_VALUES,{bluebellStrapLeaf:'株元から出る光沢のある細い帯状葉',englishBluebellFlower:'片側に垂れる細い鐘形花と強く反り返る6枚の花被先端'});

Object.assign(TRAIT_VALUES,{spanishStrapLeaf:'株元から出る幅のある帯状葉と平行脈',spanishBluebellFlower:'茎の周囲に付く6枚の花被の鐘形花・掲載写真を参考にした花先'});

Object.assign(TRAIT_VALUES,{fritWideLeaf:'茎に付く幅のある披針形の葉',fritLanceLeaf:'茎に付く先の尖る細い披針形の葉',fritCirroseLeaf:'対生〜輪生する細葉と、巻く上部の葉先',fritillariaBell:'6枚の花被でできた下向きの鐘形花・種ごとの花色と模様'});

Object.assign(TRAIT_VALUES,{branchedRaceme:'小花のまとまりが片側に並ぶ分枝した花序',convallariaElliptic:'株元に対になって出る楕円形の葉と平行脈',convallariaClusterBell:'小さな鐘形花が密集して八重に見える花'});

Object.assign(TRAIT_VALUES,{coumRounded:'丸形〜弱い心形の葉',coumSilver:'緑の縁や葉脈を残す銀色の葉（個体差あり）',coumVariable:'緑葉〜銀模様の葉（実生による個体差あり）',coumReflexed:'短く丸い5裂片が反り返る花と基部の色斑（個体差あり）'});

Object.assign(TRAIT_VALUES,{confusumThickHeart:'厚く光沢があり、角ばった切れ込みのある心形葉',cypriumHeart:'浅い波状の縁と銀斑のある心形葉',ciliciumOval:'卵形〜心形の小葉と淡い斑',cyclamenMottle:'緑地に淡緑〜銀色の不規則な斑（個体差あり）',cyclamenWithAuricles:'5裂片が反り返り、花口に耳状の部分がある花',cyclamenWithoutAuricles:'細い5裂片が反り返り、花口に耳状の部分がない花'});

Object.assign(TRAIT_VALUES,{camassiaKeel:'株元から出る細長い葉と浅い溝・平行脈',camassiaRegularStar:'6枚の花被が放射状に開く花と6本の雄しべ'});

Object.assign(TRAIT_VALUES,{retailTulipNarrow:'下部の茎に互生する細長い葉と平行脈',annikaBicolor:'外側が濃いピンク、内側がアプリコット色の6枚の花被',oculataBlueEye:'白い6枚の花被の内側に青い基部と黒い雄しべ'});

Object.assign(TRAIT_VALUES,{borderTulipBroad:'下部の茎に互生する幅広い灰緑色の葉と平行脈',queenDarkCup:'深い黒紫色のカップ状の花',springGreenCup:'クリーム白の花被の中央に緑の帯が入る花',slawaOrangeEdge:'紫の花被にオレンジの縁が入る花'});

Object.assign(TRAIT_VALUES,{bulbocodiumTerete:'株元から出る細い半円柱状の葉',narcissusKeel:'株元から出る細長い葉と浅い折れ・平行脈',goldenHoopFlower:'細い6枚の花被と大きく開く黄色のラッパ',thaliaNoddingFlower:'2輪ずつうつむく白花と後ろへ反る細い花被',minnowSmallCup:'白〜淡レモン色の花被と小さな黄色のカップが房咲きになる花',paperwhiteSmallCup:'白い花被と小さな白いカップが房咲きになる花'});

Object.assign(TRAIT_VALUES,{martagonParallel:'茎を囲む輪生葉と上部のまばらな葉・平行脈',martagonRecurved:'下向きの6枚の花被が強く巻き返り、6本の雄しべが垂れる花',pinkMorningOpen:'淡い縁と斑点のあるピンクの花被が、やや下向きに開く花'});

Object.assign(TRAIT_VALUES,{nativeLanceolate:'茎に互生する披針形の葉と平行脈',regaleLinear:'茎にまばらに互生する細長い線形葉',rubellumFunnel:'淡い桃色の6枚の花被が開く小型の漏斗形の花',japonicumFunnel:'横向きの淡い桃色の漏斗形花と赤褐色の葯',auratumReflex:'白地に黄色い筋と赤褐色の斑点、先が反る大輪の花',regaleTrumpet:'内側の黄色いのどと、外側に桃色の筋が入る長い白いラッパ花'});

Object.assign(TRAIT_VALUES,{pleatedIrisSword:'縦ひだと平行脈のある扇状の剣形葉'});

Object.assign(TRAIT_VALUES,{daylilyStrap:'二列の株元から弓なりに広がる帯状葉'});

Object.assign(TRAIT_VALUES,{alliumRound:'細い円筒状の葉',alliumLinear:'株元や茎の下部から出る細長い葉'});

Object.assign(TRAIT_VALUES,{gardenAnemoneLeaf:'三つに分かれ、さらに深く切れ込む株元の葉',gardenAnemoneSepals:'花弁状の萼と多数の雄しべ、中央の雌しべ群',gardenAnemoneTuber:'秋植えの冬〜春の葉と花、夏の休眠（温暖地の参考）'});

Object.assign(TRAIT_VALUES,{cannaPaddle:'葉鞘で茎を抱く大きな一枚葉',cannaAsymmetric:'花弁状の仮雄しべと片側の葯を持つ非対称の花',cannaWhitePatch:'緑の葉に不規則な白斑',cannaYellowVeins:'緑の葉に細い黄色の筋',cannaBronzeMottle:'緑が混ざる銅紫色の葉',cannaRedVeins:'緑の葉に赤黒い葉脈'});

Object.assign(TRAIT_VALUES,{singleTulipBroad:'互い違いに付き葉鞘で茎を抱く幅広い葉',singleTulipCup:'外側3枚・内側3枚の花被片が重なる一重の杯形花'});

Object.assign(TRAIT_VALUES,{sourceTulipPointed:'細く尖った花被の先が外へ反る一重花',sourceTulipWavy:'中央に緑が入り縁がゆるく波打つ一重花'});

Object.assign(TRAIT_VALUES,{slenderTulipNarrow:'細い線形の葉が茎に互い違いに付く',slenderTulipBicolor:'外側3枚の色と内側の淡色が対比する小花',slenderTulipWhite:'細長い白い花被片と淡い黄色の基部',annikaRetailPinkEye:'淡い桃色の花被片と濃紫色の基部がある開いた花'});

Object.assign(TRAIT_VALUES,{minorTulipNarrow:'細い互生葉と茎を抱く葉の基部',sylvestrisNodding:'曲がる花首と尖った黄花・下向きの蕾',minorTulipYellowEye:'桃〜紫色の花被片と大きな黄色い基部',minorTulipBlueEye:'白い花被片と青紫の基部・濃い葯',minorTulipPinkEdge:'桃色の縁と白い中央、暗い紫の基部',minorTulipHilde:'白い内側と桃色の外側、黄色い基部の小花',minorTulipDouble:'赤い八重の花弁状部分と緑筋のある外側',fewFlowerTulip:'1本の花茎に複数花（最大3花の資料を参照）',basalTulipBouquet:'一つの球から複数花をつける参考例'});

Object.assign(TRAIT_VALUES,{doubleTulipLayeredCup:'花弁状部分が不規則に重なる八重の杯形花',semiDoubleTulipCup:'白い花弁状部分が少なめに重なる半八重の花'});

Object.assign(TRAIT_VALUES,{rainLilyChannel:'根元から出る浅い溝のある細長い葉',rainLilyFunnel:'短い筒から開く6枚の花被と長い黄色の葯'});

Object.assign(TRAIT_VALUES,{branched:'分枝して複数の花をつける',parrotRuffledCup:'ひだと切れ込みのあるパーロット咲きの花被',branchedTulipCup:'1本の茎から分かれる複数の杯状花'});

Object.assign(TRAIT_VALUES,{milkweedBroad:'灰緑色で幅広い対生葉',milkweedLanceolate:'全縁の細長い披針形葉',milkweedCrown:'下へ反る5裂花冠と5組の袋・角からなる副花冠'});

Object.assign(TRAIT_VALUES,{mat:'低いマット状に広がる',armeriaFine:'芝のように密生する細い根生葉',armeriaPaperyHead:'紙質の総苞に囲まれ、5弁の小花が集まる頭花'});

Object.assign(TRAIT_VALUES,{meadowTrifoliumNarrow:'細長い3枚の小葉からなる複葉',meadowTrifoliumObovate:'先が丸い倒卵形の3枚の小葉',meadowPeaSpike:'蝶形花と長い萼の歯をもつ円柱状の花穂',hopPeaHead:'黄色い蝶形花が松かさ状に集まる小花房',silkyCalyxHead:'小さな白桃色の蝶形花と、長い毛のある萼の穂'});

Object.assign(TRAIT_VALUES,{somekawaSword:'目立つ中脈のない剣状の根出葉',somekawaThreeFalls:'赤紫に濃い砂子模様の外花被片3枚と、立ち上がる内花被片3枚・花柱の枝'});

Object.assign(TRAIT_VALUES,{paraneeFloating:'基部に深い切れ込みがある丸い浮葉',paraneeMottle:'緑の浮葉に入る暗紫色の不規則な斑',paraneeYellowStreaks:'黄色に紅色の筋・斑が入り、多数の花弁が重なる花'});

Object.assign(TRAIT_VALUES,{eucomisWavyStrap:'緩やかに波打つ幅広い帯状の根出葉',eucomisStarRaceme:'小さな6枚の花被を持つ星形の花穂と、頂部の葉に似た苞の房'});

Object.assign(TRAIT_VALUES,{rudyGrass:'球根ごとに2〜3枚の細い根出葉（花期の残葉は条件で変化）',rudySixLobedFunnel:'白地に青紫の筋・6裂して開く漏斗形の花と、2段に付く6本の雄しべ'});

Object.assign(TRAIT_VALUES,{head:'頭状花序',maxiDahliaDouble:'多数の舌状花が重なる八重の頭花と2列の総苞'});

Object.assign(TRAIT_VALUES,{darkDahliaCutLeaf:"銅葉の深い切れ込みと粗い鋸歯"});

Object.assign(TRAIT_VALUES,{emperorDahliaLeaf:'長く尖る鋸歯のある小葉と、若株・成株で異なる複葉の参考例'});

Object.assign(TRAIT_VALUES,{cannaBronzeSolid:'深い銅色の単葉（光や葉齢による見え方は参考）',cannaBronzeStripes:'銅色の単葉に入る赤〜橙色の細い縞'});

Object.assign(TRAIT_VALUES,{arctotisLyrate:'銀毛に覆われ、先の部分が広く深く切れ込む葉',arctotisWavy:'銀毛に覆われ、縁が波打つ幅広いへら形の葉',arctotisHead:'1列の舌状花と、5裂する筒状花の花芯・数列の総苞'});

Object.assign(TRAIT_VALUES,{tanacetumSilverLobed:'銀灰色で羽状に深く裂ける葉',tanacetumFineDivided:'細かく羽状に分かれる柔らかい緑葉',tanacetumCrispGold:'細かな裂片が縮れて重なる黄金葉',tanacetumSmallHeads:'枝分かれしてドーム状に広がる白い小さな頭花',tanacetumRedHead:'赤い舌状花と盛り上がる黄色い筒状花の頭花',tanacetumRareButtons:'ほとんど開花しない品種（まれな花は未再現）'});

Object.assign(TRAIT_VALUES,{baptisiaTrifoliate:'葉柄の先につく全縁の3小葉',baptisiaPea:'旗弁・左右の翼弁と竜骨弁を分けた蝶形花',baptisiaArchingPea:'直立する葉茎から横へ弓なりに下がる花穂の蝶形花'});

Object.assign(TRAIT_VALUES,{veronicaFourLobed:'短い筒から広がる大小4裂の花冠',veronicaBroadLeaf:'対生する鋸歯のある幅広い長楕円葉',veronicaNarrowLeaf:'対生する細長い鋸歯葉'});

Object.assign(TRAIT_VALUES,{veronicaCreamEdge:'灰緑の葉に細い乳白色の縁取り',veronicaPairsThrees:'対生を基に一部の節で3枚を輪生する参考例'});

Object.assign(TRAIT_VALUES,{veronicaMatLeaf:'対生する小さな丸みのある鋸歯葉',veronicaPectinateLeaf:'深い切れ込みをもつ灰緑の小さな単葉'});

TRAIT_VALUES.veronicaOrnataLeaf='銀灰緑の卵状披針形葉（微細な毛は未再現）';

Object.assign(TRAIT_VALUES,{veronicastrumReferences:'輪生葉の段と分枝花穂を持つクガイソウ類の参考3D',veronicastrumLeaf:'鋸歯のある披針形の輪生葉',veronicastrumTube:'浅い4裂の筒形花冠と2本の突出する雄しべ'});

Object.assign(TRAIT_VALUES,{hollyhockReferences:'互生葉と杯状の花を持つホリーホックの参考3D',hollyhockReference:'一重～半八重の杯状花と雄しべ筒'});

Object.assign(TRAIT_VALUES,{echinaceaReferences:'舌状花・円錐形の花芯と互生葉を持つエキナセアの参考3D',echinaceaHeadReference:'舌状花と筒状花・尖った鱗片のある頭花',echinaceaLeaf:'粗い鋸歯のある卵形～披針形の葉'});

Object.assign(TRAIT_VALUES,{echinaceaAngustifoliaLeaf:'細い全縁葉と3本の主脈'});

Object.assign(TRAIT_VALUES,{echinaceaAvalancheLeaf:'長い葉柄に続く細い卵形の鋸歯葉'});

Object.assign(TRAIT_VALUES,{swanAnemoneReferences:'スワン系アネモネの分枝・複葉・花の表裏を分けた参考3D',basalWhorled:'根生葉と分枝点の総苞葉の輪生',swanAnemoneSepals:'花弁状の萼片と多数の雄しべ・雌しべ'});

Object.assign(TRAIT_VALUES,{oreganoBractReferences:'対生葉・重なる苞葉・小さな唇形花を分けた花オレガノの参考3D',oreganoBilabiate:'筒につながる上2・下3裂の唇形花',oreganoRoundLeaf:'丸い～卵円形の全縁葉',oreganoSmallLeaf:'小さな卵形の全縁葉'});

Object.assign(TRAIT_VALUES,{oreganoFeltLeaf:'白い綿毛に覆われた丸い全縁葉'});

Object.assign(TRAIT_VALUES,{echinopsReferences:'深裂した互生葉と1花の小頭花が集まるエキノプスの参考3D',compoundGlobe:'1花ずつの小頭花が球状に集合',echinopsTubularFive:'5裂する筒状花と葯筒・2裂柱頭',echinopsBroadLeaf:'羽状に深く切れ込む棘のある葉',echinopsNarrowLeaf:'細い裂片に深く切れ込む棘のある葉'});

Object.assign(TRAIT_VALUES,{heliopsisReferences:'対生の鋸歯葉・分枝花茎と品種別のヘリオプシス頭花',heliopsisCompositeHead:'舌状花と盛り上がる筒状花の中心',heliopsisPetaloidHead:'多くの花弁状部分を重ねる小輪の八重頭花',heliopsisSerrateLeaf:'鋸歯のある卵形～披針形の対生葉',heliopsisCurledLeaf:'湾曲した鋸歯葉と緑の葉脈が残る白・桃色の斑'});

Object.assign(TRAIT_VALUES,{heleniumReferences:'互生する葉・翼のある茎と品種別のヘレニウム頭花',heleniumLanceolateLeaf:'互生する披針形の単葉',heleniumShortRayHead:'短い舌状花と丸い花芯',heleniumDomedHead:'切れ込みのある舌状花と盛り上がる花芯',heleniumRolledRayHead:'筒状と開いた舌状花・表裏の色を分けた花芯'});

Object.assign(TRAIT_VALUES,{patriniaReferences:'対生する葉と細かく分枝するオミナエシ類の集散花序',patriniaFiveLobedCorolla:'短い筒で合着した小さな5裂の花冠',patriniaDividedLeaf:'5～7裂を参考にした羽状に深く裂ける葉',patriniaBroadLeaf:'粗い鋸歯のある幅広い葉と下部の裂ける葉'});

Object.assign(TRAIT_VALUES,{oxypetalumReferences:'毛のある対生葉・細い枝とオキシペタラムの星形花',oxypetalumStarCorolla:'基部で合着する5裂花冠と中央の副花冠',oxypetalumCordateLeaf:'細かな毛のある卵形～心形の対生葉',oxypetalumWeakTwining:'やや巻きつく細い枝（支え方は未再現）'});

Object.assign(TRAIT_VALUES,{ligulariaReferences:'長い葉柄の葉と品種別のリグラリア頭花',ligulariaCompositeHead:'細い舌状花と筒状花の中心を持つ頭花',ligulariaCupLeaf:'小型で縁が波打ち、杯状になりやすい葉',ligulariaJaggedLeaf:'不規則に深く切れ込む鋸歯葉',ligulariaMistLeaf:'細かな斑が入る大きな心形～腎形の葉',ligulariaRoundLeaf:'長い葉柄に付く心形～腎形の大きな葉'});

Object.assign(TRAIT_VALUES,{aegopodiumCompound:'3小葉または2回3出の複葉・側小葉の切れ込みと鋸歯',aegopodiumUmbel:'主軸から小花房へ二段に分かれる白い複散形花序・5花弁と5雄しべ'});

Object.assign(TRAIT_VALUES,{chocolateReferenceLeaf:'春の銅紫色から夏の淡い葉、初冬の黄葉へ変わる対生の鋸歯葉',mistflowerReferenceLeaf:'基部が広く、葉脈が目立つ三角状～卵形の対生する鋸歯葉',eupatorieaeDiscHeads:'舌状花を持たない筒状小花のみの頭花・5裂花冠と長く分かれる花柱枝'});

Object.assign(TRAIT_VALUES,{panicumReferenceBlade:'茎の節に互生する平行脈の線形葉と基部の葉',twoFloretPanicumSpikelets:'不等長の苞穎に包まれる2小花の小穂（下位は不稔・雄性、上位は稔性の参考）'});

Object.assign(TRAIT_VALUES,{featherReedReferenceBlade:'茎の節と株元から出る細い平行脈の葉',featherReedExterior:'細かな小穂の外形と基部の毛を参考にした羽毛状の円錐花序'});

Object.assign(TRAIT_VALUES,{stipoidBladeReference:'株元と茎の節に付く針状・巻き込み・折れた細葉の種別参考',stipoidSingleFloret:'1小花の小穂と種ごとに異なる芒・護穎の毛の参考'});

Object.assign(TRAIT_VALUES,{hakoneCaulineBlade:'弓状の茎の節に交互に付く笹状の葉の参考',hakoneMultiFloretSpikelet:'対になる枝と5〜10小花・短い芒をもつ小穂の種参考'});

Object.assign(TRAIT_VALUES,{liriopeBasalStrap:'根元に束生する帯状葉の種・品種参考',liriopeSixFreeTepals:'小花の房と6枚の離れた花被片・6本の雄しべの参考'});

Object.assign(TRAIT_VALUES,{ophioRetailStrap:'黒葉・細い白斑葉の販売株の参考',ophioNoddingSixTepals:'下向きの6枚の花被片と短い花糸の属参考',ophioSnowFoliageOnly:'花期・花姿が未確認のため葉だけを表示'});

Object.assign(TRAIT_VALUES,{oshimensisShortSpikes:'短い褐色の穂の集まりの外観参考',oshimensisArchingBlades:'新葉が立ち、成葉が弓状に地際へ垂れる常緑葉の参考',oshimensisSpikesExterior:'褐色の穂と淡い糸状部の外観参考（内部構造は未再現）',oshimensisCreamCenter:'緑の縁とクリーム色の中央斑',oshimensisWhiteMargin:'緑の中央と白い覆輪の参考',oshimensisGoldCenter:'暗緑の縁と黄色の中央斑'});

Object.assign(TRAIT_VALUES,{fineCarexGroupedSpikes:'葉状苞のある枝に短い穂を分けて付ける外観参考',fineCarexSeparatedSpikes:'細い柄に間隔を空ける褐色の穂の外観参考',fineCarexUprightBlades:'細葉が立ち上がり先で広がる常緑株の参考',fineCarexArchingBlades:'細い緑葉が弓状に広がる常緑株の参考',fineCarexCurledBlades:'細く柔らかい葉と巻く葉先の参考',fineCarexCreamCenter:'暗緑の縁とクリーム色の中央斑',fineCarexExteriorSpikes:'小さな褐色の穂の外観参考（性器官・果実内部は未再現）'});

Object.assign(TRAIT_VALUES,{blueCarexSeparatedSpikes:'細長い上部の穂と、柄を分けた褐色の穂の外観参考',blueCarexLaxSpikes:'斜めに広がる細い花茎の小穂の外観参考',blueCarexNarrowBlades:'幅2〜3mmを参考にした青緑の細葉',blueCarexBroadBlades:'幅約1/2インチを参考にした青銀色の広い葉',blueCarexDarkExterior:'柄を分ける暗褐色の穂の外観参考（性器官・果実内部は未再現）',blueCarexPaleExterior:'葉の間に斜めに付く黄白〜淡褐色の小穂の外観参考'});

Object.assign(TRAIT_VALUES,{otherCarexFringedSpikes:'直立する褐色の穂と淡い糸状部の外観参考',otherCarexRemoteSpikes:'細い茎に大きく間隔を空ける小穂の外観参考',otherCarexSpringSpikes:'春の小さな黄緑〜淡褐色の穂の外観参考',otherCarexSparseSpikes:'直立する細い軸と疎らな小穂の外観参考',otherCarexBroadLanceolate:'短い葉のある茎に付く黄中斑の幅広い披針形葉の参考',otherCarexFineArches:'細く柔らかく広がる緑の葉の参考',otherCarexStrapArches:'立ち上がって先が弓状に曲がる細長い葉の参考',otherCarexBrownPaleFringe:'褐色の穂と淡い糸状の外観参考（性器官・果実内部は未再現）',otherCarexPaleRemote:'大きく離れた淡黄緑色の小穂の外観参考',otherCarexSparseExterior:'小さな穂と表面の疎らな細片の外観参考'});

Object.assign(TRAIT_VALUES,{fescueReferenceNeedle:'細く内側へ折れた針状の葉の参考',fescueReferencePanicle:'細い直立茎の先で枝分かれする小穂の外観参考',fescueReferenceSpikelets:'細い分枝に付く小穂の表面参考（花粉・果実内部は未再現）'});

Object.assign(TRAIT_VALUES,{pennisetumArchingBlades:'株元と茎の節に付き、立ち上がって弓状に垂れる線形葉の参考',pennisetumBristledSpikes:'細い花茎の先で色と開き方が異なる、ブラシ状の穂の外観参考'});

Object.assign(TRAIT_VALUES,{tenderPennisetumBlades:'株元と茎の節に付く、紫銅色または緑の細い弓状の葉の参考',curvedRubrumBrush:'弓状に垂れる長い赤紫〜淡褐色の穂の外観参考',villosumPlumoseBrush:'細い小穂から長い柔らかな毛を広げる白い穂の外観参考'});

Object.assign(TRAIT_VALUES,{brizaBlades:'株元と茎に付く細い葉の参考',noddingBrizaSpikelets:'疎らな分枝から垂れる小さな丸みのある小穂',clusteredBrizaSpikelets:'弓状の茎に比較的密につく銀緑色の小穂'});

Object.assign(TRAIT_VALUES,{broadMilletBlades:'節と株元から弓状に広がる幅広い葉の参考',melicaNarrowBlades:'株元と茎に付く細い葉の参考',denseMilletSpike:'直立する長い紫の穂の外観参考',laxMiliumPanicle:'細かな枝に小穂が疎らにつく参考',redMelicaPanicle:'赤紫色の小穂が並ぶ垂れる穂の参考',silkyMelicaSpike:'小さな絹毛の房が並ぶ短い白穂の参考'});

Object.assign(TRAIT_VALUES,{acorusUnifacialBlade:'2列に重なる、目立つ中肋のない剣状葉（種の参考）',acorusReferenceSpadix:'葉のような苞の脇に出る、細い円柱状の花序',spadix:'肉穂花序・小花が密につく軸'});

Object.assign(TRAIT_VALUES,{hookReferenceBlade:'硬めの細い銅赤色の帯状葉',hookReferenceSpike:'細い褐色の小穂の外観参考（果胞とフックは未再現）',matrushReferenceBlade:'中心が立ち、外周が弓状に垂れる黄金の細葉',matrushMaleReference:'葉の中に房を作る小さな黄白色の雄花の原品種参考',snowReferenceBlade:'株元から広がる、やや幅のある長い細葉',snowReferencePanicle:'密で太さがあり、枝垂れる小穂と反る芒の参考',crystalReferenceBlade:'平行な縁と切形の先、ほつれる白い薄膜のある硬い葉',crystalReferenceHead:'細茎の先に単独で付く小さな丸い褐色の花頭'});

Object.assign(TRAIT_VALUES,{whitetopReferenceBlade:'茎の下部に3列に付く細い葉の種の参考',whitetopReferenceHead:'白い基部と緑の先の総苞・中央の小穂・花被のない小花',goldenBambooReferenceBlade:'細い枝に交互に付く、黄地に太さの違う緑の条を持つ笹葉',tristichous:'3列に並ぶ参考'});

Object.assign(TRAIT_VALUES,{bergeniaObovate:'厚みと丸い縁をもつ倒卵形の葉',bergeniaCup:'房状に集まる杯形の花の参考'});

Object.assign(TRAIT_VALUES,{bergeniaRound:'細かい毛をもつ大きな丸葉の参考'});

Object.assign(TRAIT_VALUES,{saxifrageCordate:'葉脈と毛のある丸い心形葉の参考',saxifrageUnequal:'大小の花弁が非対称につく白い花の参考'});

Object.assign(TRAIT_VALUES,{autumnAnemoneReferences:'シュウメイギクの分枝・複葉・一重と八重を分けた参考3D',autumnSwanLeaflet:'幅広い切れ込みと鋸歯のある小葉'});

Object.assign(TRAIT_VALUES,{autumnNarrowLeaflet:'細い切れ込みのあるシュウメイギクの小葉'});

Object.assign(TRAIT_VALUES,{hatsuneMottle:'黄緑の不規則な斑（写真による参考模様）'});

Object.assign(TRAIT_VALUES,{anemoneCultivarReferences:'宿根アネモネの分枝・複葉と品種ごとの花形・表裏色を分けた参考3D'});

Object.assign(TRAIT_VALUES,{sterniiThreeLeaflets:'茎上の3小葉・銀青灰〜白銀の表と細かな鋸歯',sterniiCuppedSepals:'うつむく緑白の5萼・桃紫を帯びる背面と疎らな房'});

Object.assign(TRAIT_VALUES,{sterniiRockiesLeaflets:'茎上の3小葉・銀灰の幅広い葉と深く尖る鋸歯'});

Object.assign(TRAIT_VALUES,{sterniiSpottedLeaflets:'茎上の3小葉・緑の地に白や桃の細かな斑',sterniiGoldenLeaflets:'茎上の3小葉・緑〜黄の葉と赤紫の脈（写真の一例）',sterniiPinkSepals:'うつむく桃系の5萼と疎らな房（写真の一例）'});
