import type { Herb, PriceItem, NewsItem, TradeItem, MarketIndex, HerbCategory, PriceHistory } from '../utils/types'
import { generatePriceHistory } from '../utils/format'

export const herbCategories: HerbCategory[] = [
  { key: 'root', name: '根茎类', icon: '🌿', count: 342 },
  { key: 'fruit', name: '果实类', icon: '🍎', count: 286 },
  { key: 'herb', name: '全草类', icon: '🌱', count: 231 },
  { key: 'flower', name: '花类', icon: '🌸', count: 128 },
  { key: 'bark', name: '皮类', icon: '🪵', count: 95 },
  { key: 'leaf', name: '叶类', icon: '🍃', count: 87 },
  { key: 'animal', name: '动物类', icon: '🦌', count: 76 },
  { key: 'mineral', name: '矿物类', icon: '💎', count: 54 },
  { key: 'resin', name: '树脂类', icon: '🫧', count: 43 },
  { key: 'other', name: '其他类', icon: '📦', count: 68 },
]

export const markets = ['亳州市场', '安国市场', '成都市场', '玉林市场', '廉桥市场', '普宁市场']

export const herbs: Herb[] = [
  {
    id: 1, name: '三七', alias: ['田七', '金不换', '血参'], category: 'root',
    family: '五加科', part: '根及根茎', nature: '温', meridian: ['肝', '胃'],
    efficacy: '散瘀止血，消肿定痛', contraindication: '孕妇慎用',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional+chinese+medicine+sanqi+panax+notoginseng+root+dried+herb+on+rice+paper+background&image_size=square',
    description: '三七为五加科植物三七的干燥根及根茎，主产于云南、广西等地。秋季花开前采挖，洗净，分开主根、支根及根茎，干燥。支根习称"筋条"，根茎习称"剪口"。',
    usage: '煎服3-9g，研粉吞服1-3g；外用适量',
    originLocations: [
      { lat: 23.37, lng: 104.25, name: '云南文山' },
      { lat: 23.79, lng: 108.35, name: '广西百色' },
    ]
  },
  {
    id: 2, name: '当归', alias: ['秦归', '云归', '干归'], category: 'root',
    family: '伞形科', part: '根', nature: '温', meridian: ['肝', '心', '脾'],
    efficacy: '补血活血，调经止痛，润肠通便', contraindication: '湿盛中满者慎用',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional+chinese+medicine+angelica+sinensis+danggui+root+dried+herb+on+rice+paper+background&image_size=square',
    description: '当归为伞形科植物当归的干燥根，主产于甘肃、云南等地。秋末采挖，除去须根及泥沙，待水分稍蒸发后，捆成小把，上棚，用烟火慢慢熏干。',
    usage: '煎服6-12g',
    originLocations: [
      { lat: 34.98, lng: 104.62, name: '甘肃岷县' },
      { lat: 34.08, lng: 103.68, name: '甘肃宕昌' },
    ]
  },
  {
    id: 3, name: '黄芪', alias: ['绵芪', '箭芪'], category: 'root',
    family: '豆科', part: '根', nature: '微温', meridian: ['脾', '肺'],
    efficacy: '补气升阳，固表止汗，利水消肿', contraindication: '表实邪盛者忌用',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional+chinese+medicine+astragalus+huangqi+root+slices+dried+herb+on+rice+paper+background&image_size=square',
    description: '黄芪为豆科植物蒙古黄芪或膜荚黄芪的干燥根，主产于山西、内蒙古、甘肃等地。春秋二季采挖，除去须根及根头，晒干。',
    usage: '煎服9-30g',
    originLocations: [
      { lat: 39.57, lng: 112.73, name: '山西浑源' },
      { lat: 41.82, lng: 111.66, name: '内蒙古武川' },
    ]
  },
  {
    id: 4, name: '金银花', alias: ['忍冬花', '双花', '二宝花'], category: 'flower',
    family: '忍冬科', part: '花蕾', nature: '寒', meridian: ['肺', '心', '胃'],
    efficacy: '清热解毒，疏散风热', contraindication: '脾胃虚寒者慎用',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional+chinese+medicine+honeysuckle+jinyinhua+dried+flowers+on+rice+paper+background&image_size=square',
    description: '金银花为忍冬科植物忍冬的干燥花蕾或带初开的花，主产于山东、河南等地。夏初花开放前采收，干燥。',
    usage: '煎服6-15g',
    originLocations: [
      { lat: 35.55, lng: 117.98, name: '山东平邑' },
      { lat: 33.77, lng: 113.38, name: '河南封丘' },
    ]
  },
  {
    id: 5, name: '枸杞子', alias: ['枸杞红实', '甜菜子'], category: 'fruit',
    family: '茄科', part: '果实', nature: '平', meridian: ['肝', '肾'],
    efficacy: '滋补肝肾，益精明目', contraindication: '脾虚便溏者慎用',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional+chinese+medicine+goji+berries+gouqizi+dried+red+fruits+on+rice+paper+background&image_size=square',
    description: '枸杞子为茄科植物宁夏枸杞的干燥成熟果实，主产于宁夏、甘肃、青海等地。夏秋二季果实呈红色时采收，热风烘干，除去果梗。',
    usage: '煎服6-12g',
    originLocations: [
      { lat: 37.48, lng: 105.67, name: '宁夏中宁' },
      { lat: 36.62, lng: 103.83, name: '甘肃靖远' },
    ]
  },
  {
    id: 6, name: '白芍', alias: ['金芍药', '白芍药'], category: 'root',
    family: '毛茛科', part: '根', nature: '微寒', meridian: ['肝', '脾'],
    efficacy: '养血调经，敛阴止汗，柔肝止痛', contraindication: '阳衰虚寒者不宜用',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional+chinese+medicine+white+peony+baishao+root+slices+dried+herb+on+rice+paper+background&image_size=square',
    description: '白芍为毛茛科植物芍药的干燥根，主产于安徽、浙江等地。夏秋二季采挖，洗净，除去头尾及细根，置沸水中煮后除去外皮或去皮后再煮，晒干。',
    usage: '煎服6-15g',
    originLocations: [
      { lat: 33.87, lng: 115.77, name: '安徽亳州' },
      { lat: 30.27, lng: 120.15, name: '浙江磐安' },
    ]
  },
  {
    id: 7, name: '川芎', alias: ['芎藭', '小叶川芎'], category: 'root',
    family: '伞形科', part: '根茎', nature: '温', meridian: ['肝', '胆', '心包'],
    efficacy: '活血行气，祛风止痛', contraindication: '阴虚火旺者慎用',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional+chinese+medicine+chuanxiong+rhizome+dried+herb+on+rice+paper+background&image_size=square',
    description: '川芎为伞形科植物川芎的干燥根茎，主产于四川等地。夏季当茎上的节盘显著突出，并略带紫色时采挖，除去泥沙，晒后烘干，再去须根。',
    usage: '煎服3-10g',
    originLocations: [
      { lat: 31.13, lng: 104.42, name: '四川都江堰' },
      { lat: 30.82, lng: 103.85, name: '四川崇州' },
    ]
  },
  {
    id: 8, name: '地黄', alias: ['生地', '熟地', '怀地黄'], category: 'root',
    family: '玄参科', part: '根', nature: '寒(生)/微温(熟)', meridian: ['心', '肝', '肾'],
    efficacy: '清热凉血，养阴生津(生地)；补血滋阴，益精填髓(熟地)', contraindication: '脾虚湿滞者不宜用',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional+chinese+medicine+rehmannia+dihuang+root+dried+herb+on+rice+paper+background&image_size=square',
    description: '地黄为玄参科植物地黄的干燥根，主产于河南等地。秋季采挖，除去芦头、须根及泥沙，鲜用或干燥。将地黄缓缓烘焙至约八成干，称"生地黄"；将生地黄蒸至黑润，称"熟地黄"。',
    usage: '生地煎服10-15g，熟地煎服10-30g',
    originLocations: [
      { lat: 35.24, lng: 113.24, name: '河南温县' },
      { lat: 35.08, lng: 113.57, name: '河南武陟' },
    ]
  },
  {
    id: 9, name: '人参', alias: ['棒槌', '山参', '园参'], category: 'root',
    family: '五加科', part: '根及根茎', nature: '微温', meridian: ['脾', '肺', '心', '肾'],
    efficacy: '大补元气，复脉固脱，补脾益肺，生津养血', contraindication: '实热证者忌用，不宜与藜芦同用',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional+chinese+medicine+ginseng+renshen+root+dried+herb+on+rice+paper+background&image_size=square',
    description: '人参为五加科植物人参的干燥根及根茎，主产于吉林、辽宁、黑龙江等地。多于秋季采挖，洗净后经晒干或烘干。',
    usage: '煎服3-9g，另煎兑服',
    originLocations: [
      { lat: 42.88, lng: 126.45, name: '吉林抚松' },
      { lat: 41.73, lng: 125.94, name: '辽宁新宾' },
    ]
  },
  {
    id: 10, name: '板蓝根', alias: ['靛青根', '蓝靛根'], category: 'root',
    family: '十字花科', part: '根', nature: '寒', meridian: ['心', '胃'],
    efficacy: '清热解毒，凉血利咽', contraindication: '体虚而无实火热毒者忌用',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional+chinese+medicine+isatis+root+banlangen+dried+herb+on+rice+paper+background&image_size=square',
    description: '板蓝根为十字花科植物菘蓝的干燥根，主产于河北、江苏等地。秋季采挖，除去泥沙，晒干。',
    usage: '煎服9-15g',
    originLocations: [
      { lat: 38.04, lng: 114.51, name: '河北安国' },
      { lat: 32.06, lng: 118.78, name: '江苏南通' },
    ]
  },
  {
    id: 11, name: '半夏', alias: ['地文', '守田', '水玉'], category: 'root',
    family: '天南星科', part: '块茎', nature: '温', meridian: ['脾', '胃', '肺'],
    efficacy: '燥湿化痰，降逆止呕，消痞散结', contraindication: '阴虚燥咳者忌用，不宜与乌头类同用',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional+chinese+medicine+pinellia+banxia+tuber+dried+herb+on+rice+paper+background&image_size=square',
    description: '半夏为天南星科植物半夏的干燥块茎，主产于四川、湖北、河南等地。夏秋二季采挖，洗净，除去外皮及须根，晒干。',
    usage: '煎服3-9g，一般炮制后用',
    originLocations: [
      { lat: 31.47, lng: 104.17, name: '四川南充' },
      { lat: 32.04, lng: 112.11, name: '湖北襄阳' },
    ]
  },
  {
    id: 12, name: '菊花', alias: ['甘菊', '杭菊', '贡菊'], category: 'flower',
    family: '菊科', part: '头状花序', nature: '微寒', meridian: ['肺', '肝'],
    efficacy: '疏散风热，平肝明目，清热解毒', contraindication: '气虚胃寒者慎用',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional+chinese+medicine+chrysanthemum+juhua+dried+flowers+on+rice+paper+background&image_size=square',
    description: '菊花为菊科植物菊的干燥头状花序，主产于浙江、安徽、河南等地。9-11月花盛开时分批采收，阴干或焙干，或熏蒸后晒干。',
    usage: '煎服5-10g',
    originLocations: [
      { lat: 30.53, lng: 120.18, name: '浙江桐乡' },
      { lat: 30.63, lng: 118.33, name: '安徽黄山' },
    ]
  },
]

const specs: Record<string, string[]> = {
  '三七': ['20头', '40头', '60头', '80头', '120头', '剪口', '筋条', '须'],
  '当归': ['草把', '箱归', '归头', '归身', '归尾'],
  '黄芪': ['统货', '选货', '薄片', '厚片'],
  '金银花': ['统货', '选货', '青花', '白花'],
  '枸杞子': ['280粒', '380粒', '500粒', '特等', '一等'],
  '白芍': ['一二级', '二三级', '黑白芍', '尾芍', '薄片'],
  '川芎': ['统个', '统片', '选片'],
  '地黄': ['生地统货', '熟地统货', '生地片', '熟地片', '40支'],
  '人参': ['生晒参', '红参', '野山参', '移山参'],
  '板蓝根': ['统货', '选货', '片'],
  '半夏': ['清半夏', '法半夏', '姜半夏', '生半夏'],
  '菊花': ['杭白菊', '贡菊', '亳菊', '胎菊'],
}

function generatePrices(): PriceItem[] {
  const items: PriceItem[] = []
  let id = 1
  herbs.forEach(herb => {
    const herbSpecs = specs[herb.name] || ['统货']
    const usedMarkets = markets.slice(0, 2 + Math.floor(Math.random() * 3))
    herbSpecs.slice(0, 2).forEach(spec => {
      usedMarkets.slice(0, 2).forEach(market => {
        const basePrice = 20 + Math.random() * 280
        const dailyChange = (Math.random() - 0.45) * 10
        const monthlyChange = (Math.random() - 0.4) * 20
        const trend: 'up' | 'down' | 'stable' = dailyChange > 1 ? 'up' : dailyChange < -1 ? 'down' : 'stable'
        items.push({
          id: id++,
          herbId: herb.id,
          herbName: herb.name,
          spec,
          market,
          origin: herb.originLocations[0]?.name || '',
          price: Math.round(basePrice * 100) / 100,
          prevPrice: Math.round((basePrice - dailyChange) * 100) / 100,
          dailyChange: Math.round(dailyChange * 100) / 100,
          monthlyChange: Math.round(monthlyChange * 100) / 100,
          trend,
          updateTime: new Date().toISOString().slice(0, 10),
        })
      })
    })
  })
  return items
}

export const prices: PriceItem[] = generatePrices()

export function getPriceHistory(herbId: number): PriceHistory[] {
  const herb = herbs.find(h => h.id === herbId)
  if (!herb) return []
  const herbSpecs = specs[herb.name] || ['统货']
  return herbSpecs.slice(0, 2).map(spec => {
    const basePrice = prices.find(p => p.herbId === herbId)?.price || 50
    const { dates, prices: priceArr } = generatePriceHistory(basePrice, 365)
    return { herbId, spec, market: '亳州市场', dates, prices: priceArr }
  })
}

export const newsList: NewsItem[] = [
  {
    id: 1, title: '浙贝母产新人气高涨，后市走势几何', category: '品种分析',
    summary: '浙贝母进入产新期，新货上市量较往年有所减少，市场关注度持续升温，多商看好后市行情。',
    content: '浙贝母进入产新期，新货上市量较往年有所减少，市场关注度持续升温，多商看好后市行情。据了解，今年浙贝母种植面积较去年缩减约15%，加之部分产区遭遇不利天气，单产有所下降，预计总产量将低于去年水平。目前产区收购价较前期有所上扬，市场走货顺畅，商家购货积极性较高。从长期来看，浙贝母库存消化良好，供需关系趋于改善，后市行情值得持续关注。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese+herbal+medicine+market+analysis+fritillaria+bulb&image_size=landscape_4_3',
    publishTime: '2026-05-13 17:16', viewCount: 3256, relatedHerbs: []
  },
  {
    id: 2, title: '第二批全国中药饮片集采文件正式公告', category: '集采资讯',
    summary: '全国中药饮片联盟采购办公室发布第二批集采文件，涉及多个常用品种，从价格博弈到内功比拼。',
    content: '全国中药饮片联盟采购办公室正式发布第二批全国中药饮片集采文件，本次集采覆盖范围进一步扩大，涉及多个临床常用品种。文件明确了采购规则、质量标准和投标要求，强调从单纯价格竞争转向质量与价格的综合评估。业内人士分析，集采常态化将加速行业洗牌，推动中药材产业向规范化、标准化方向发展。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese+medicine+procurement+conference+professional&image_size=landscape_4_3',
    publishTime: '2026-05-13 10:48', viewCount: 5821, relatedHerbs: []
  },
  {
    id: 3, title: '辽西及冀北野生药材产新调研报告', category: '品种分析',
    summary: '辽西及冀北野生药材产新调研：四大品种采新量锐减，劳动力断层成主因。',
    content: '近期对辽西及冀北地区野生药材产新情况进行了实地调研。调研结果显示，南沙参、苍术、赤芍、防风等四大品种采新量较去年同期锐减30%-50%。劳动力断层是导致采新量下降的主要原因，从事野生药材采挖的劳动力平均年龄已超过55岁，年轻人不愿从事此项工作。加之部分产区生态保护力度加大，可采挖区域缩小，预计短期内野生药材供给偏紧的局面难以改变。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wild+chinese+herbs+mountain+harvesting+landscape&image_size=landscape_4_3',
    publishTime: '2026-05-12 11:31', viewCount: 4102, relatedHerbs: []
  },
  {
    id: 4, title: '金银花多维度调研报告', category: '品种分析',
    summary: '从种植面积、产量、库存、需求等多维度深度解析金银花市场现状及未来趋势。',
    content: '本报告从种植面积、产量、库存、需求等多个维度对金银花市场进行了深度调研。数据显示，近三年金银花种植面积稳步增长，但受天气因素影响，单产波动较大。需求端方面，中成药和保健品领域需求持续增长，茶饮市场成为新的增长点。库存方面，当前社会库存处于中等偏低水平。综合来看，金银花价格短期以稳为主，中长期仍有上行空间。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=honeysuckle+flower+field+harvest+china&image_size=landscape_4_3',
    publishTime: '2026-05-11 09:20', viewCount: 2876, relatedHerbs: [4]
  },
  {
    id: 5, title: '药市九大跌价品种分析', category: '药市动态',
    summary: '近期中药材市场调整，九大品种价格明显回落，深度解析跌价原因及后市预判。',
    content: '近期中药材市场整体呈现调整态势，部分前期涨幅较大的品种出现明显回落。其中，白芍、牡丹皮、知母、紫菀、防风、柴胡、板蓝根、荆芥、薄荷等九大品种跌幅居前。分析认为，此轮回调主要受以下因素影响：一是前期涨幅过大，技术性回调需求强烈；二是部分品种产新在即，新货上市压力增大；三是市场资金面趋紧，商家出货意愿增强。建议从业者理性看待价格波动，关注供需基本面变化。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese+medicine+market+price+chart+decline&image_size=landscape_4_3',
    publishTime: '2026-05-10 15:30', viewCount: 6234, relatedHerbs: [6, 10]
  },
  {
    id: 6, title: '国药乐仁堂原料采购计划公告', category: '采购招标',
    summary: '国药乐仁堂河北药业有限公司发布最新原料采购计划，涉及黄精等20余个品种。',
    content: '国药乐仁堂河北药业有限公司发布最新原料采购计划，本次采购涉及黄精、当归、黄芪、白术等20余个品种，采购总量约500吨。要求供应商具备GSP认证资质，药材质量符合2020版药典标准。有意向的供应商请在公告发布后15日内提交相关资料和报价。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pharmaceutical+company+warehouse+chinese+medicine&image_size=landscape_4_3',
    publishTime: '2026-05-09 14:00', viewCount: 1892, relatedHerbs: [2, 3]
  },
  {
    id: 7, title: '2026年第一季度中药材进出口分析', category: '药市动态',
    summary: '2026年Q1中药材进出口数据出炉，出口额同比增长8.3%，东南亚市场增长显著。',
    content: '据海关数据统计，2026年第一季度我国中药材进出口总额达12.6亿美元，同比增长6.8%。其中出口额8.9亿美元，同比增长8.3%；进口额3.7亿美元，同比增长3.5%。出口方面，东南亚市场增长最为显著，增幅达15.2%，主要出口品种为人参、枸杞、当归等。进口方面，西洋参、乳香、没药等品种进口量增长明显。总体来看，中药材国际贸易保持稳健增长态势。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=international+trade+chinese+medicine+shipping+containers&image_size=landscape_4_3',
    publishTime: '2026-05-08 10:15', viewCount: 3567, relatedHerbs: [9, 5]
  },
  {
    id: 8, title: '当归种植技术规范与田间管理要点', category: '种植技术',
    summary: '详细介绍当归从选地整地到采收加工的全流程种植技术规范及关键田间管理措施。',
    content: '当归喜冷凉湿润气候，适宜在海拔2000-3000米的高寒山区种植。选地以土层深厚、疏松肥沃、排水良好的砂质壤土为宜。播种期一般在6月上中旬，采用条播或撒播方式。田间管理要注意中耕除草、追肥浇水、病虫害防治等关键环节。当归生长周期为2年，第2年10月下旬至11月上旬采挖为宜。采挖后要及时晾晒，防止霉变。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=angelica+sinensis+planting+field+agriculture+china&image_size=landscape_4_3',
    publishTime: '2026-05-07 08:30', viewCount: 2145, relatedHerbs: [2]
  },
]

export const tradeItems: TradeItem[] = [
  { id: 1, type: 'supply', herbName: '水栀', spec: '选', origin: '湖北省宜昌市', quantity: '30吨', price: '电议', contact: '159****9215', publishTime: '2026-05-13', status: 'active', quoteCount: 0, deliveryAddress: '湖北省宜昌市' },
  { id: 2, type: 'supply', herbName: '山药', spec: '切片', origin: '河南省焦作市武陟县', quantity: '100吨', price: '电议', contact: '176****9848', publishTime: '2026-05-13', status: 'active', quoteCount: 0, deliveryAddress: '河南省焦作市' },
  { id: 3, type: 'supply', herbName: '薤白', spec: '统货', origin: '甘肃省庆阳市西峰区', quantity: '10吨', price: '电议', contact: '153****8804', publishTime: '2026-05-12', status: 'active', quoteCount: 0, deliveryAddress: '甘肃省庆阳市' },
  { id: 4, type: 'supply', herbName: '款冬花', spec: '统', origin: '甘肃省陇南市西和县', quantity: '20吨', price: '电议', contact: '190****8888', publishTime: '2026-05-12', status: 'active', quoteCount: 0, deliveryAddress: '甘肃省陇南市' },
  { id: 5, type: 'supply', herbName: '白芍', spec: '统货', origin: '安徽省亳州市', quantity: '30吨', price: '电议', contact: '151****7500', publishTime: '2026-05-11', status: 'active', quoteCount: 0, deliveryAddress: '安徽省亳州市' },
  { id: 6, type: 'supply', herbName: '黄芪', spec: '选货', origin: '甘肃省陇西县', quantity: '50吨', price: '电议', contact: '138****3210', publishTime: '2026-05-11', status: 'active', quoteCount: 0, deliveryAddress: '甘肃省定西市' },
  { id: 7, type: 'supply', herbName: '当归', spec: '草把', origin: '甘肃省岷县', quantity: '20吨', price: '电议', contact: '139****5678', publishTime: '2026-05-10', status: 'active', quoteCount: 0, deliveryAddress: '甘肃省定西市' },
  { id: 8, type: 'demand', herbName: '北沙参', spec: '统货', origin: '不限', quantity: '10公斤', price: '面议', contact: '186****1234', publishTime: '2026-05-13', status: 'active', quoteCount: 7, deliveryAddress: '内蒙古自治区赤峰市喀喇沁旗' },
  { id: 9, type: 'demand', herbName: '益母草', spec: '片', origin: '山东省枣庄市', quantity: '1吨', price: '面议', contact: '137****5678', publishTime: '2026-05-13', status: 'active', quoteCount: 42, deliveryAddress: '山东省枣庄市' },
  { id: 10, type: 'demand', herbName: '蛇床子', spec: '统货', origin: '山东省德州市庆云县', quantity: '25吨', price: '面议', contact: '158****9012', publishTime: '2026-05-12', status: 'active', quoteCount: 14, deliveryAddress: '山东省德州市' },
  { id: 11, type: 'demand', herbName: '地黄', spec: '40支', origin: '河南省焦作市武陟县', quantity: '50吨', price: '面议', contact: '135****3456', publishTime: '2026-05-12', status: 'active', quoteCount: 6, deliveryAddress: '不限' },
  { id: 12, type: 'demand', herbName: '金银花', spec: '选货', origin: '不限', quantity: '5吨', price: '面议', contact: '189****7890', publishTime: '2026-05-11', status: 'active', quoteCount: 23, deliveryAddress: '广东省广州市' },
]

export function generateMarketIndex(): MarketIndex[] {
  const data: MarketIndex[] = []
  const now = new Date()
  let composite = 1250
  let herb = 1320
  let animal = 1180
  let mineral = 1050

  for (let i = 365; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    composite += (Math.random() - 0.48) * 5
    herb += (Math.random() - 0.48) * 6
    animal += (Math.random() - 0.47) * 4
    mineral += (Math.random() - 0.49) * 3
    data.push({
      date: date.toISOString().slice(0, 10),
      compositeIndex: Math.round(composite * 100) / 100,
      herbIndex: Math.round(herb * 100) / 100,
      animalIndex: Math.round(animal * 100) / 100,
      mineralIndex: Math.round(mineral * 100) / 100,
    })
  }
  return data
}

export const marketIndexData = generateMarketIndex()
