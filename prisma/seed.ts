import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

function randomBetween(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

const herbsData = [
  {
    name: "黄芪",
    aliases: "绵芪、箭芪",
    source: "豆科植物蒙古黄芪或膜荚黄芪的干燥根",
    origin: "甘肃、内蒙古、山西",
    category: "根及根茎类",
    properties: "甘，微温。归肺、脾经",
    efficacy: "补气升阳，固表止汗，利水消肿，生津养血，行滞通痹，托毒排脓，敛疮生肌",
    usage: "9～30g",
    specGrade: "选片、统片",
    description: "黄芪为常用中药，具有补气固表、利水退肿、托毒生肌等功效。主产于甘肃、内蒙古、山西等地。",
  },
  {
    name: "当归",
    aliases: "秦归、云归",
    source: "伞形科植物当归的干燥根",
    origin: "甘肃、云南、四川",
    category: "根及根茎类",
    properties: "甘、辛，温。归肝、心、脾经",
    efficacy: "补血活血，调经止痛，润肠通便",
    usage: "6～12g",
    specGrade: "全当归、当归头、当归身、当归尾",
    description: "当归为常用补血药，有「十方九归」之说。主产于甘肃岷县等地。",
  },
  {
    name: "党参",
    aliases: "潞党、西党、纹党",
    source: "桔梗科植物党参的干燥根",
    origin: "山西、甘肃、四川",
    category: "根及根茎类",
    properties: "甘，平。归脾、肺经",
    efficacy: "健脾益肺，养血生津",
    usage: "9～30g",
    specGrade: "潞党参、纹党参",
    description: "党参为常用补气药，功效类似人参但力较弱。主产于山西、甘肃等地。",
  },
  {
    name: "川芎",
    aliases: "芎藭、小叶川芎",
    source: "伞形科植物川芎的干燥根茎",
    origin: "四川、云南、贵州",
    category: "根及根茎类",
    properties: "辛，温。归肝、胆、心包经",
    efficacy: "活血行气，祛风止痛",
    usage: "3～10g",
    specGrade: "统货、选货",
    description: "川芎为常用活血化瘀药，主产于四川都江堰等地，为四川道地药材。",
  },
  {
    name: "白术",
    aliases: "于术、冬术",
    source: "菊科植物白术的干燥根茎",
    origin: "浙江、安徽、湖南",
    category: "根及根茎类",
    properties: "苦、甘，温。归脾、胃经",
    efficacy: "健脾益气，燥湿利水，止汗，安胎",
    usage: "6～12g",
    specGrade: "浙江白术、安徽白术",
    description: "白术为常用补气健脾药，主产于浙江、安徽等地。",
  },
  {
    name: "甘草",
    aliases: "国老、蜜草",
    source: "豆科植物甘草的干燥根及根茎",
    origin: "内蒙古、甘肃、新疆",
    category: "根及根茎类",
    properties: "甘，平。归心、肺、脾、胃经",
    efficacy: "补脾益气，清热解毒，祛痰止咳，缓急止痛，调和诸药",
    usage: "2～10g",
    specGrade: "条草、毛草、粉草",
    description: "甘草为最常用中药之一，有「十方九草」之称。主产于内蒙古、甘肃等地。",
  },
  {
    name: "茯苓",
    aliases: "云苓、松苓",
    source: "多孔菌科真菌茯苓的干燥菌核",
    origin: "云南、安徽、湖北",
    category: "菌藻类",
    properties: "甘、淡，平。归心、肺、脾、肾经",
    efficacy: "利水渗湿，健脾，宁心",
    usage: "10～15g",
    specGrade: "白茯苓、赤茯苓、茯苓皮",
    description: "茯苓为常用利水渗湿药，主产于云南、安徽等地。",
  },
  {
    name: "金银花",
    aliases: "忍冬花、双花",
    source: "忍冬科植物忍冬的干燥花蕾或带初开的花",
    origin: "山东、河南、河北",
    category: "花类",
    properties: "甘，寒。归肺、心、胃经",
    efficacy: "清热解毒，疏散风热",
    usage: "6～15g",
    specGrade: "一级、二级、统货",
    description: "金银花为常用清热解毒药，主产于山东平邑、河南密县等地。",
  },
  {
    name: "枸杞",
    aliases: "枸杞子、红枸杞",
    source: "茄科植物宁夏枸杞的干燥成熟果实",
    origin: "宁夏、青海、新疆",
    category: "果实种子类",
    properties: "甘，平。归肝、肾经",
    efficacy: "滋补肝肾，益精明目",
    usage: "6～12g",
    specGrade: "宁夏枸杞、青海枸杞",
    description: "枸杞为常用滋补药，主产于宁夏中宁等地，以粒大色红为佳。",
  },
  {
    name: "丹参",
    aliases: "血参、紫丹参",
    source: "唇形科植物丹参的干燥根及根茎",
    origin: "山东、四川、河南",
    category: "根及根茎类",
    properties: "苦，微寒。归心、肝经",
    efficacy: "活血祛瘀，通经止痛，清心除烦，凉血消痈",
    usage: "10～15g",
    specGrade: "山东丹参、四川丹参",
    description: "丹参为常用活血化瘀药，有「一味丹参散，功同四物汤」之说。",
  },
  {
    name: "三七",
    aliases: "田七、金不换",
    source: "五加科植物三七的干燥根及根茎",
    origin: "云南、广西",
    category: "根及根茎类",
    properties: "甘、微苦，温。归肝、胃经",
    efficacy: "散瘀止血，消肿定痛",
    usage: "3～9g",
    specGrade: "20头、30头、40头、60头、80头、120头、无数头",
    description: "三七为名贵止血药，主产于云南文山、广西田阳等地。",
  },
  {
    name: "天麻",
    aliases: "赤箭、定风草",
    source: "兰科植物天麻的干燥块茎",
    origin: "云南、贵州、四川",
    category: "根及根茎类",
    properties: "甘，平。归肝经",
    efficacy: "息风止痉，平抑肝阳，祛风通络",
    usage: "3～10g",
    specGrade: "冬麻、春麻",
    description: "天麻为常用平肝息风药，主产于云南、贵州、四川等地。",
  },
  {
    name: "麦冬",
    aliases: "麦门冬、寸冬",
    source: "百合科植物麦冬的干燥块根",
    origin: "四川、浙江、湖北",
    category: "根及根茎类",
    properties: "甘、微苦，微寒。归心、肺、胃经",
    efficacy: "养阴生津，润肺清心",
    usage: "6～12g",
    specGrade: "川麦冬、杭麦冬",
    description: "麦冬为常用养阴药，主产于四川、浙江等地。",
  },
  {
    name: "柴胡",
    aliases: "北柴胡、南柴胡",
    source: "伞形科植物柴胡或狭叶柴胡的干燥根",
    origin: "河北、山西、甘肃",
    category: "根及根茎类",
    properties: "辛、苦，微寒。归肝、胆、肺经",
    efficacy: "和解表里，疏肝升阳",
    usage: "3～10g",
    specGrade: "北柴胡、南柴胡",
    description: "柴胡为常用解表药，主产于河北、山西等地。",
  },
  {
    name: "板蓝根",
    aliases: "靛青根、蓝靛根",
    source: "十字花科植物菘蓝的干燥根",
    origin: "河北、安徽、江苏",
    category: "根及根茎类",
    properties: "苦，寒。归心、胃经",
    efficacy: "清热解毒，凉血利咽",
    usage: "9～15g",
    specGrade: "统货、选货",
    description: "板蓝根为常用清热解毒药，主产于河北安国、安徽等地。",
  },
  {
    name: "黄连",
    aliases: "川连、味连、雅连",
    source: "毛茛科植物黄连的干燥根茎",
    origin: "四川、湖北、重庆",
    category: "根及根茎类",
    properties: "苦，寒。归心、脾、胃、肝、胆、大肠经",
    efficacy: "清热燥湿，泻火解毒",
    usage: "2～5g",
    specGrade: "味连、雅连、云连",
    description: "黄连为常用清热燥湿药，主产于四川、湖北等地。",
  },
  {
    name: "半夏",
    aliases: "地文、守田",
    source: "天南星科植物半夏的干燥块茎",
    origin: "四川、贵州、河南",
    category: "根及根茎类",
    properties: "辛，温；有毒。归脾、胃、肺经",
    efficacy: "燥湿化痰，降逆止呕，消痞散结",
    usage: "3～9g",
    specGrade: "清半夏、姜半夏、法半夏",
    description: "半夏为常用化痰药，主产于四川、贵州等地。",
  },
  {
    name: "白芍",
    aliases: "金芍药、白芍药",
    source: "毛茛科植物芍药的干燥根",
    origin: "安徽、浙江、四川",
    category: "根及根茎类",
    properties: "苦、酸，微寒。归肝、脾经",
    efficacy: "养血调经，敛阴止汗，柔肝止痛，平抑肝阳",
    usage: "6～15g",
    specGrade: "杭白芍、亳白芍",
    description: "白芍为常用养血药，主产于安徽亳州、浙江等地。",
  },
  {
    name: "陈皮",
    aliases: "橘皮、广陈皮",
    source: "芸香科植物橘及其栽培变种的干燥成熟果皮",
    origin: "广东、四川、浙江",
    category: "果实种子类",
    properties: "苦、辛，温。归肺、脾经",
    efficacy: "理气健脾，燥湿化痰",
    usage: "3～10g",
    specGrade: "广陈皮、川陈皮",
    description: "陈皮为常用理气药，以广东新会产者为佳，称「广陈皮」。",
  },
  {
    name: "红花",
    aliases: "草红花、红蓝花",
    source: "菊科植物红花的干燥花",
    origin: "新疆、河南、四川",
    category: "花类",
    properties: "辛，温。归心、肝经",
    efficacy: "活血通经，散瘀止痛",
    usage: "3～10g",
    specGrade: "新疆红花、河南红花",
    description: "红花为常用活血化瘀药，主产于新疆、河南等地。",
  },
  {
    name: "连翘",
    aliases: "黄花条、连壳",
    source: "木犀科植物连翘的干燥果实",
    origin: "山西、河南、陕西",
    category: "果实种子类",
    properties: "苦，微寒。归肺、心、小肠经",
    efficacy: "清热解毒，消肿散结，疏散风热",
    usage: "6～15g",
    specGrade: "青翘、老翘",
    description: "连翘为常用清热解毒药，主产于山西、河南等地。",
  },
  {
    name: "防风",
    aliases: "屏风、关防风",
    source: "伞形科植物防风的干燥根",
    origin: "黑龙江、吉林、内蒙古",
    category: "根及根茎类",
    properties: "辛、甘，微温。归膀胱、肝、脾经",
    efficacy: "祛风解表，胜湿止痛，止痉",
    usage: "5～10g",
    specGrade: "关防风、西防风",
    description: "防风为常用解表药，主产于东北三省及内蒙古等地。",
  },
  {
    name: "厚朴",
    aliases: "赤朴、烈朴",
    source: "木兰科植物厚朴的干燥干皮、根皮及枝皮",
    origin: "四川、湖北、浙江",
    category: "皮类",
    properties: "苦、辛，温。归脾、胃、肺、大肠经",
    efficacy: "燥湿消痰，下气除满",
    usage: "3～10g",
    specGrade: "筒朴、兜朴、根朴",
    description: "厚朴为常用化湿药，主产于四川、湖北、浙江等地。",
  },
  {
    name: "黄柏",
    aliases: "檗木、檗皮",
    source: "芸香科植物黄皮树的干燥树皮",
    origin: "四川、贵州、云南",
    category: "皮类",
    properties: "苦，寒。归肾、膀胱经",
    efficacy: "清热燥湿，泻火除蒸，解毒疗疮",
    usage: "3～12g",
    specGrade: "川黄柏、关黄柏",
    description: "黄柏为常用清热燥湿药，主产于四川、贵州等地。",
  },
];

const basePrices: Record<string, number> = {
  黄芪: 18.5,
  当归: 35.0,
  党参: 42.0,
  川芎: 22.0,
  白术: 28.0,
  甘草: 15.0,
  茯苓: 20.0,
  金银花: 120.0,
  枸杞: 55.0,
  丹参: 16.0,
  三七: 180.0,
  天麻: 150.0,
  麦冬: 48.0,
  柴胡: 65.0,
  板蓝根: 12.0,
  黄连: 135.0,
  半夏: 95.0,
  白芍: 22.0,
  陈皮: 8.0,
  红花: 85.0,
  连翘: 38.0,
  防风: 55.0,
  厚朴: 18.0,
  黄柏: 25.0,
};

const origins: Record<string, string[]> = {
  黄芪: ["甘肃岷县", "内蒙古武川", "山西浑源"],
  当归: ["甘肃岷县", "云南维西", "四川宝兴"],
  党参: ["山西长治", "甘肃陇西", "四川九寨沟"],
  川芎: ["四川都江堰", "云南大理", "贵州遵义"],
  白术: ["浙江磐安", "安徽亳州", "湖南平江"],
  甘草: ["内蒙古杭锦旗", "甘肃民勤", "新疆阿勒泰"],
  茯苓: ["云南普洱", "安徽岳西", "湖北罗田"],
  金银花: ["山东平邑", "河南密县", "河北巨鹿"],
  枸杞: ["宁夏中宁", "青海柴达木", "新疆精河"],
  丹参: ["山东莒县", "四川中江", "河南方城"],
  三七: ["云南文山", "广西田阳"],
  天麻: ["云南昭通", "贵州大方", "四川青川"],
  麦冬: ["四川绵阳", "浙江慈溪", "湖北襄阳"],
  柴胡: ["河北安国", "山西运城", "甘肃定西"],
  板蓝根: ["河北安国", "安徽太和", "江苏射阳"],
  黄连: ["四川洪雅", "湖北利川", "重庆石柱"],
  半夏: ["四川南充", "贵州毕节", "河南禹州"],
  白芍: ["安徽亳州", "浙江磐安", "四川中江"],
  陈皮: ["广东新会", "四川成都", "浙江衢州"],
  红花: ["新疆裕民", "河南新乡", "四川简阳"],
  连翘: ["山西安泽", "河南洛阳", "陕西商洛"],
  防风: ["黑龙江杜蒙", "吉林白城", "内蒙古赤峰"],
  厚朴: ["四川都江堰", "湖北恩施", "浙江龙泉"],
  黄柏: ["四川洪雅", "贵州遵义", "云南昭通"],
};

const specs: string[] = ["统货", "选货", "一级", "二级", "三级"];

const newsData = [
  {
    title: "2026年中药材春季行情综述：多品种价格回调",
    content:
      "随着春季产新季的到来，中药材市场整体呈现回调态势。据监测数据显示，2026年第一季度，中药材综合200指数较去年末下跌3.2%，其中根及根茎类品种跌幅最为明显。\n\n具体来看，黄芪、当归等大宗品种因种植面积扩大，供应量增加，价格较去年高点回落10%-15%。而三七、天麻等名贵品种受产地气候影响，产量有所下降，价格保持坚挺。\n\n业内人士分析，随着国家中医药政策的持续推进，中药材市场需求长期向好，但短期内需关注产新压力和库存消化情况。建议从业者理性看待市场波动，合理安排购销计划。",
    category: "市场分析",
    source: "中国中药杂志",
    isPublished: true,
    publishedAt: new Date("2026-04-15"),
  },
  {
    title: "国家药监局发布中药材生产质量管理规范新修订版",
    content:
      "近日，国家药品监督管理局正式发布了新修订的《中药材生产质量管理规范》（GAP），新规范将于2026年7月1日起正式实施。\n\n新修订版GAP在原有基础上，重点强化了以下几个方面：一是加强种子种苗管理，要求建立可追溯体系；二是完善农药使用规范，明确禁用农药清单；三是规范采收加工环节，确保药材质量稳定；四是强化质量检验要求，增加检测指标。\n\n业内专家表示，新GAP的实施将有力推动中药材产业规范化、标准化发展，提升中药材整体质量水平，为中医药事业高质量发展奠定基础。",
    category: "政策法规",
    source: "国家药监局官网",
    isPublished: true,
    publishedAt: new Date("2026-04-10"),
  },
  {
    title: "甘肃岷县当归产新情况调研报告",
    content:
      "近日，本网记者赴甘肃岷县实地调研当归产新情况。岷县作为「中国当归之乡」，当归种植面积和产量均占全国60%以上。\n\n据当地农业部门统计，2026年岷县当归种植面积约12万亩，较去年增加约8%。受今年春季气温偏低影响，当归出苗率略低于常年，但总体长势良好。\n\n在价格方面，当前当归鲜货收购价在8-10元/公斤，较去年同期下降约15%。干货市场价在32-38元/公斤，较去年高点有所回落。当地药农表示，虽然价格有所下降，但种植收益仍较为可观。\n\n业内人士预计，随着产新量增加，短期内当归价格仍有下行压力，但长期来看，优质当归的需求依然旺盛，价格有望企稳回升。",
    category: "产地信息",
    source: "中药材天地网",
    isPublished: true,
    publishedAt: new Date("2026-04-08"),
  },
  {
    title: "中药材种植技术革新：智能温室助力道地药材品质提升",
    content:
      "近年来，随着农业科技的发展，智能温室技术在中药材种植领域得到越来越广泛的应用。在云南文山、四川中江等中药材主产区，一批现代化智能温室基地相继建成投产。\n\n智能温室通过精准控制温度、湿度、光照等环境参数，为中药材生长创造最适宜的条件。与传统露天种植相比，智能温室种植的中药材有效成分含量提高20%-30%，产量提高15%-25%，且品质更加稳定。\n\n以三七为例，云南文山某基地采用智能温室种植后，三七皂苷含量较传统种植提高了25%，亩产量提高了18%，农药残留检出率为零。\n\n专家指出，智能温室技术是中药材种植现代化的重要方向，但前期投入较大，建议有条件的产区先行试点，逐步推广。",
    category: "种植技术",
    source: "中国中医药报",
    isPublished: true,
    publishedAt: new Date("2026-04-05"),
  },
  {
    title: "中药材出口持续增长，一带一路沿线国家需求旺盛",
    content:
      "据海关总署最新数据显示，2026年第一季度，我国中药材出口额达8.5亿美元，同比增长12.3%，延续了近年来持续增长的态势。\n\n从出口目的地看，一带一路沿线国家成为中药材出口的重要增长点。其中，东南亚国家需求最为旺盛，出口额同比增长18.5%；中东欧国家市场增速最快，同比增长25.3%。\n\n从品种看，枸杞、当归、黄芪、甘草等传统品种仍是出口主力，合计占出口总额的45%以上。同时，三七、天麻等高附加值品种出口增长迅速，同比增幅超过30%。\n\n业内人士分析，随着中医药在海外的影响力不断扩大，中药材出口前景广阔。但也需注意各国法规差异、质量标准不一等挑战，建议加强国际标准对接和品牌建设。",
    category: "行业动态",
    source: "中国医药保健品进出口商会",
    isPublished: true,
    publishedAt: new Date("2026-04-01"),
  },
  {
    title: "金银花产新在即，市场观望情绪浓厚",
    content:
      "随着金银花产新季临近，市场观望情绪逐渐浓厚。目前山东平邑、河南密县等主产区金银花长势良好，预计产量较去年持平略增。\n\n当前金银花市场价格在110-125元/公斤区间波动，较年初有所回落。商家多持观望态度，等待产新情况明朗后再做采购决策。\n\n分析人士认为，若今年金银花产量正常，价格可能进一步回调至100元/公斤附近。但若遭遇极端天气导致减产，价格仍有反弹可能。",
    category: "市场分析",
    source: "中药材天地网",
    isPublished: true,
    publishedAt: new Date("2026-04-18"),
  },
];

const supplyDemandData = [
  { type: "供应", herbName: "黄芪", quantity: "5000公斤", price: "18元/公斤", origin: "甘肃岷县", contact: "张先生 138****5678", description: "2025年产新货，含量达标，可提供检测报告", status: "approved" },
  { type: "求购", herbName: "当归", quantity: "2000公斤", price: "35元/公斤", origin: "甘肃岷县", contact: "李女士 139****1234", description: "急购当归全归，要求无硫熏，含量合格", status: "approved" },
  { type: "供应", herbName: "三七", quantity: "1000公斤", price: "180元/公斤", origin: "云南文山", contact: "王先生 137****9876", description: "20头三七，春七，干货，含量充足", status: "approved" },
  { type: "求购", herbName: "金银花", quantity: "3000公斤", price: "115元/公斤", origin: "山东平邑", contact: "赵女士 136****5432", description: "求购一等金银花，绿原酸含量4.0%以上", status: "approved" },
  { type: "供应", herbName: "枸杞", quantity: "8000公斤", price: "52元/公斤", origin: "宁夏中宁", contact: "马先生 135****8765", description: "宁夏中宁枸杞，粒大饱满，多糖含量高", status: "approved" },
  { type: "求购", herbName: "丹参", quantity: "1500公斤", price: "16元/公斤", origin: "山东莒县", contact: "刘先生 133****2468", description: "求购山东丹参，丹参酮IIA含量0.2%以上", status: "approved" },
  { type: "供应", herbName: "甘草", quantity: "10000公斤", price: "14元/公斤", origin: "内蒙古杭锦旗", contact: "巴先生 158****1357", description: "内蒙古甘草，条草，甘草酸含量2.0%以上", status: "pending" },
  { type: "求购", herbName: "天麻", quantity: "500公斤", price: "145元/公斤", origin: "云南昭通", contact: "陈女士 159****9753", description: "求购冬麻，天麻素含量0.2%以上", status: "pending" },
  { type: "供应", herbName: "白术", quantity: "3000公斤", price: "26元/公斤", origin: "浙江磐安", contact: "周先生 186****8642", description: "浙江白术，片大肉厚，质量上乘", status: "pending" },
  { type: "求购", herbName: "黄连", quantity: "800公斤", price: "130元/公斤", origin: "四川洪雅", contact: "吴先生 187****7531", description: "求购味连，小檗碱含量5.0%以上", status: "pending" },
];

const marketAnalysisData = [
  {
    title: "2026年二季度中药材市场趋势预测",
    content:
      "综合分析当前中药材市场供需格局、政策环境及气候因素，我们对2026年二季度中药材市场走势做出以下预测：\n\n一、整体趋势：预计二季度中药材市场将呈现「先抑后扬」走势。4-5月受产新压力影响，部分品种价格仍有下行空间；6月起随着库存消化和需求回暖，价格有望逐步企稳。\n\n二、重点品种分析：\n1. 根及根茎类：黄芪、当归等大宗品种供应充裕，价格承压；三七、天麻等名贵品种供需偏紧，价格坚挺。\n2. 果实种子类：枸杞产新在即，价格或有小幅调整；陈皮受陈货库存影响，价格稳中有降。\n3. 花类：金银花产新季来临，需关注天气因素对产量的影响。\n4. 皮类：厚朴、黄柏等品种资源趋紧，价格有上涨预期。\n\n三、风险提示：需关注极端天气、政策调整及国际贸易环境变化等不确定因素对市场的影响。",
    category: "趋势预测",
    isPublished: true,
    publishedAt: new Date("2026-04-20"),
  },
  {
    title: "甘肃道地药材产地供需分析报告",
    content:
      "甘肃省作为我国中药材主产区之一，盛产当归、黄芪、党参、甘草等多个道地品种。本报告对甘肃省主要道地药材的供需状况进行分析。\n\n一、当归：2025年甘肃当归产量约3.5万吨，同比增长5%。国内需求约3.2万吨，出口约0.3万吨，供需基本平衡。预计2026年产量持平略增，价格中枢下移至30-38元/公斤。\n\n二、黄芪：2025年甘肃黄芪产量约5万吨，同比增长8%。受种植面积扩大影响，供应量明显增加，价格承压。预计2026年种植面积将有所回调，价格有望在16-20元/公斤区间企稳。\n\n三、党参：2025年甘肃党参产量约2万吨，与去年持平。需求端保持稳定增长，供需偏紧。预计2026年价格将维持在38-48元/公斤区间。\n\n四、甘草：野生甘草资源持续减少，家种甘草品质参差不齐。2025年甘肃甘草产量约1.5万吨，供需缺口约0.3万吨。预计2026年价格仍有上涨空间。",
    category: "产地分析",
    isPublished: true,
    publishedAt: new Date("2026-04-15"),
  },
  {
    title: "中药材供需格局深度分析：从产能到消费的全链条解读",
    content:
      "近年来，中药材产业经历了从产能扩张到结构调整的转变过程。本报告从种植、加工、流通、消费等全链条视角，深入分析当前中药材供需格局。\n\n一、种植端：2025年全国中药材种植面积约6800万亩，同比增长3%。其中，家种品种占比超过70%，野生品种资源持续萎缩。种植结构方面，大宗品种种植面积稳中有增，名贵品种种植技术突破推动产能提升。\n\n二、加工端：中药材初加工逐步规范化，GAP基地建设加速推进。但深加工能力仍显不足，高附加值产品开发有待加强。\n\n三、流通端：中药材专业市场交易量稳中有升，电商渠道快速发展。仓储物流体系不断完善，但质量追溯体系仍需健全。\n\n四、消费端：中药饮片需求保持5%-8%的年增长率，中成药原料需求稳定。大健康产业带动药食同源品种消费快速增长，年增速超过15%。\n\n五、供需展望：短期内大宗品种供应充裕，价格承压；名贵品种供需偏紧，价格坚挺。长期来看，随着消费升级和产业规范化推进，中药材市场将呈现「量稳质升」的发展态势。",
    category: "供需分析",
    isPublished: true,
    publishedAt: new Date("2026-04-10"),
  },
  {
    title: "三七市场深度分析：从产地到终端的价格传导机制",
    content:
      "三七作为名贵中药材的代表品种，其价格波动一直备受市场关注。本报告从价格传导机制角度，深入分析三七市场的运行规律。\n\n一、产地价格：受种植成本上升和气候因素影响，近年来三七产地收购价持续走高。2026年一季度，云南文山三七（20头）收购价在170-190元/公斤区间波动。\n\n二、批发价格：从产地到批发市场，三七价格加价率约15%-20%。当前批发市场价格在195-220元/公斤。\n\n三、零售价格：终端零售价格受品牌、渠道等因素影响较大，加价率约30%-50%。优质三七零售价可达300元/公斤以上。\n\n四、价格传导特点：三七价格传导存在明显的滞后效应，产地价格变动通常需要1-2个月才能传导至终端市场。此外，市场预期对价格传导有放大效应，容易导致价格超调。\n\n五、趋势判断：预计2026年三七价格将维持高位运行，20头规格价格中枢在175-195元/公斤。需关注产新情况和政策变化对价格的影响。",
    category: "产地分析",
    isPublished: true,
    publishedAt: new Date("2026-04-05"),
  },
];

async function main() {
  console.log("开始清理旧数据...");
  await prisma.marketAnalysis.deleteMany();
  await prisma.priceIndex.deleteMany();
  await prisma.supplyDemand.deleteMany();
  await prisma.newsArticle.deleteMany();
  await prisma.priceQuote.deleteMany();
  await prisma.herb.deleteMany();
  await prisma.user.deleteMany();

  console.log("创建中药材品种...");
  const herbs: Record<string, { id: number }> = {};
  for (const herb of herbsData) {
    const created = await prisma.herb.create({ data: herb });
    herbs[herb.name] = { id: created.id };
    console.log(`  创建品种: ${herb.name} (ID: ${created.id})`);
  }

  console.log("创建30天价格行情数据...");
  const today = new Date();
  for (const [herbName, basePrice] of Object.entries(basePrices)) {
    const herbId = herbs[herbName]?.id;
    if (!herbId) continue;

    let currentPrice = basePrice;
    const herbOrigins = origins[herbName] || ["未知产地"];

    for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
      const date = new Date(today);
      date.setDate(date.getDate() - dayOffset);

      const changePercent = randomBetween(-5, 5);
      const change = randomBetween(-currentPrice * 0.05, currentPrice * 0.05);
      currentPrice = Math.max(currentPrice + change, basePrice * 0.5);
      currentPrice = Math.round(currentPrice * 100) / 100;

      await prisma.priceQuote.create({
        data: {
          herbId,
          price: currentPrice,
          change: Math.round(change * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100,
          origin: randomChoice(herbOrigins),
          spec: randomChoice(specs),
          date,
        },
      });
    }
    console.log(`  ${herbName}: 30天行情数据已创建`);
  }

  console.log("创建资讯文章...");
  for (const news of newsData) {
    const herbName = news.title.includes("当归")
      ? "当归"
      : news.title.includes("金银花")
        ? "金银花"
        : news.title.includes("三七")
          ? "三七"
          : null;
    const herbId = herbName ? herbs[herbName]?.id : null;

    await prisma.newsArticle.create({
      data: {
        ...news,
        herbId: herbId ?? null,
      },
    });
    console.log(`  创建资讯: ${news.title}`);
  }

  console.log("创建供求信息...");
  for (const sd of supplyDemandData) {
    const herbId = herbs[sd.herbName]?.id;
    if (!herbId) continue;

    await prisma.supplyDemand.create({
      data: {
        type: sd.type,
        herbId,
        quantity: sd.quantity,
        price: sd.price,
        origin: sd.origin,
        contact: sd.contact,
        description: sd.description,
        status: sd.status,
      },
    });
    console.log(`  创建供求: ${sd.type} - ${sd.herbName}`);
  }

  console.log("创建价格指数数据...");
  let indexValue = 1250.0;
  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);

    const change = randomBetween(-15, 15);
    const changePercent = (change / indexValue) * 100;
    indexValue = indexValue + change;
    indexValue = Math.round(indexValue * 100) / 100;

    await prisma.priceIndex.create({
      data: {
        name: "中药材综合指数",
        value: indexValue,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        date,
      },
    });
  }
  console.log("  30天综合指数数据已创建");

  console.log("创建市场分析文章...");
  for (const analysis of marketAnalysisData) {
    await prisma.marketAnalysis.create({
      data: analysis,
    });
    console.log(`  创建分析: ${analysis.title}`);
  }

  console.log("创建管理员用户...");
  await prisma.user.create({
    data: {
      username: "admin",
      password: "admin123",
      role: "admin",
    },
  });
  console.log("  管理员用户已创建 (admin/admin123)");

  console.log("\n种子数据创建完成！");
  console.log(`  中药材品种: ${herbsData.length}个`);
  console.log(`  价格行情: ${herbsData.length * 30}条`);
  console.log(`  资讯文章: ${newsData.length}篇`);
  console.log(`  供求信息: ${supplyDemandData.length}条`);
  console.log(`  价格指数: 30天数据`);
  console.log(`  市场分析: ${marketAnalysisData.length}篇`);
  console.log(`  管理员用户: 1个`);
}

main()
  .catch((e) => {
    console.error("种子数据创建失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
