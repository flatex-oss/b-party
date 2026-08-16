import {
  AllergyType,
  PizzaType,
  SushiType,
  SnackType,
  AvoidType,
  AlcoholPrefType,
  AlcoholType,
  SoftDrinkType,
  DessertType,
  ValorantAgent,
  SurveyResponse,
} from '../types';

export const LABELS: {
  allergies: Record<AllergyType, string>;
  pizza: Record<PizzaType, string>;
  sushi: Record<SushiType, string>;
  snacks: Record<SnackType, string>;
  avoid: Record<AvoidType, string>;
  alcoholPref: Record<AlcoholPrefType, string>;
  alcoholTypes: Record<AlcoholType, string>;
  softDrinks: Record<SoftDrinkType, string>;
  desserts: Record<DessertType, string>;
} = {
  allergies: {
    none: 'Всё ем, без аллергий 👍',
    nuts: 'Орехи 🥜',
    seafood: 'Рыба / Морепродукты 🦐',
    lactose: 'Без лактозы 🥛',
    gluten: 'Без глютена 🌾',
    vegetarian: 'Вегетарианец 🌱',
    citrus: 'Цитрусовые 🍊',
    mushrooms: 'Грибы 🍄',
  },
  pizza: {
    pepperoni: 'Пепперони 🍕',
    '4cheese': '4 Сыра 🧀',
    meat: 'Мясная сборная 🥩',
    margarita: 'Маргарита 🍅',
    bbq: 'Цыпленок BBQ 🍗',
    mushrooms: 'Ветчина и грибы 🍄',
    hawaii: 'Гавайская (с ананасом) 🍍',
    'seafood-p': 'С морепродуктами 🦐',
    truffle: 'С трюфельным соусом ✨',
    'no-pizza': 'Пиццу не буду 🙅',
  },
  sushi: {
    philadelphia: 'Филадельфия 🍣',
    california: 'Калифорния 🥑',
    baked: 'Запечённые роллы 🔥',
    tempura: 'Темпура (жареные) 🍤',
    unagi: 'С угрём (Унаги) 🍱',
    spicy: 'Острые / Спайси 🌶️',
    'veggie-sushi': 'Овощные роллы 🥒',
    'no-sushi': 'Роллы не буду 🙅',
  },
  snacks: {
    'chips-nachos': 'Начос / Чипсы с соусом 🧀',
    nuggets: 'Наггетсы / Стрипсы 🍗',
    'cheese-plate': 'Сырная тарелка 🧀',
    'meat-cuts': 'Мясная нарезка / Салями 🥓',
    veggies: 'Свежие овощи с дипом 🥕',
    nuts: 'Орешки / Сухарики 🥜',
    'garlic-bread': 'Чесночные гренки 🧄',
    fries: 'Картофель фри 🍟',
    wings: 'Острые крылышки 🔥',
  },
  avoid: {
    none: 'Мне всё норм 👌',
    pineapple: 'Ананасы в пицце 🍍',
    cilantro: 'Кинза 🌿',
    'super-spicy': 'Сильно острое 🌶️',
    'onion-garlic': 'Лук / Чеснок 🧅',
    mayo: 'Майонезные соусы 🥣',
    olives: 'Оливки / Маслины 🫒',
    'fatty-meat': 'Жирное мясо 🥩',
  },
  alcoholPref: {
    alcohol: '🥂 Пью алкоголь',
    light: '🍷 Чисто символически (легкое)',
    'non-alc': '🥤 Только б/а напитки',
  },
  alcoholTypes: {
    prosecco: 'Игристое / Просекко 🍾',
    'white-wine': 'Белое вино 🥂',
    'red-wine': 'Красное вино 🍷',
    cider: 'Яблочный / Грушевый Сидр 🍏',
    'beer-light': 'Пиво светлое 🍺',
    'beer-craft': 'Крафт / IPA / Пшеничное 🍻',
    gin: 'Джин-тоник 🍸',
    cocktails: 'Авторские коктейли 🍹',
    whiskey: 'Виски / Бурбон 🥃',
    rum: 'Ром с колой 🏴‍☠️',
    shots: 'Шоты / Настойки 🍶',
    tequila: 'Текила с лаймом 🍋',
  },
  softDrinks: {
    cola: 'Кола / Пепси 🥤',
    'cola-zero': 'Кола Zero (без сахара) 🖤',
    juice: 'Сок / Домашний морс 🧃',
    energy: 'Энергетик ⚡',
    water: 'Минералка / Вода с газом 💧',
    lemonade: 'Крафтовый лимонад 🍋',
    'beer-noalc': 'Безалкогольное пиво 🍺',
    tonic: 'Тоник / Швепс 🧊',
  },
  desserts: {
    cake: 'Праздничный торт 🎂',
    icecream: 'Мороженое 🍨',
    fruits: 'Фрукты / Свежие ягоды 🍓',
    cupcakes: 'Капкейки / Пончики 🍩',
    eclairs: 'Эклеры с кремом 🥐',
    none: 'Без сладкого (на диете) 🚫',
  },
};

export const SPICE_LEVELS: Record<number, { title: string; emoji: string; desc: string }> = {
  1: { title: 'Без остроты', emoji: '🟢', desc: 'Нежное и мягкое, никаких сюрпризов' },
  2: { title: 'Лёгкая нотка', emoji: '🟡', desc: 'Приятная пикантность, согревает' },
  3: { title: 'В меру остро', emoji: '🟠', desc: 'Классический огонёк для вкуса' },
  4: { title: 'Остренько', emoji: '🔥', desc: 'Халапеньо и спайси-соусы на полную' },
  5: { title: 'Огонь и пламя', emoji: '💀', desc: 'Каролина Рипер плачет в углу' },
};

export const VALORANT_AGENTS: Record<string, ValorantAgent> = {
  yoru: {
    id: 'yoru',
    name: 'YORU',
    title: 'Межпространственный похититель пиццы',
    role: 'Дуэлянт 💥',
    themeColor: '#3B82F6',
    quote: '«Я заберу этот последний кусок, и вы даже не заметите, как я исчез!»',
    img: 'https://images.contentstack.io/v3/assets/blt370612131b6e0eb3/blt8093ba7b6976694e/600742d8ca193910c2c310b7/Yoru_Artwork.png',
    lore: 'Кидает ослепляющую вспышку прямо в лицо имениннику, телепортируется на кухню за коробкой с Пепперони и выходит из портала с полным бокалом шота. Твоя тяга к острому халапеньо открывает пространственные разломы!',
    tags: ['🌶️ Огненный гурман', '🍕 Пепперони-мастер', '⚡ Скоростной хват'],
  },
  phoenix: {
    id: 'phoenix',
    name: 'PHOENIX',
    title: 'Зажигала и поджигатель вечеринки',
    role: 'Дуэлянт 🔥',
    themeColor: '#EF4444',
    quote: '«Watch this! Зажигаем свечи на торте прямо с рук!»',
    img: 'https://images.contentstack.io/v3/assets/blt370612131b6e0eb3/bltf0200e3da795e0cd/5eb7cdc6ee88132a6f6cfc25/V_AGENTS_587x900_Phx.png',
    lore: 'Орёт фирменную фразу перед каждым открытием шампанского, глушит энергетики литрами и заедает крыльями BBQ. Если кто-то включит грустный трек, мгновенно ставит огненную стену и возвращает вайб!',
    tags: ['🔥 Душа компании', '⚡ Энергетик-машина', '🍗 BBQ фанат'],
  },
  jett: {
    id: 'jett',
    name: 'JETT',
    title: 'Скоростной пожиратель роллов',
    role: 'Дуэлянт 🌪️',
    themeColor: '#06B6D4',
    quote: '«Пока вы моргали, вся Филадельфия уже у меня в тарелке!»',
    img: 'https://images.contentstack.io/v3/assets/blt370612131b6e0eb3/bltceaa6cf20d328bd5/5eb7cdc1b1f2e27c950d2aaa/V_AGENTS_587x900_Jett.png',
    lore: 'На рывке влетает к курьеру, за 0.2 секунды забирает все сеты темпуры и улетает на апдрафте на диван с баночкой ледяной колы. Никто даже не успел сфотографировать накрытый стол!',
    tags: ['🍣 Филадельфия-снайпер', '💨 Сверхзвуковая скорость', '🥤 Кола-энтузиаст'],
  },
  reyna: {
    id: 'reyna',
    name: 'REYNA',
    title: 'Вампир барной стойки',
    role: 'Дуэлянт 💜',
    themeColor: '#A855F7',
    quote: '«Чем крепче шоты — тем бесконечнее длится мой ультимейт!»',
    img: 'https://images.contentstack.io/v3/assets/blt370612131b6e0eb3/blt65e041d8e1215b4d/5eb7cdcba0c7b045e7f1e712/V_AGENTS_587x900_Reyna.png',
    lore: 'Поглощает энергию тех, кто устал после первого часа тусовки. Любит сочную мясную пиццу, настойки и танцы до 5 утра. Любая вечеринка без Рейны закрывается в полночь!',
    tags: ['🍷 Королева ночи', '🥩 Мясной рацион', '🍸 Барный ультимейт'],
  },
  brimstone: {
    id: 'brimstone',
    name: 'BRIMSTONE',
    title: 'Батя стола и капитан доставки',
    role: 'Специалист 🪖',
    themeColor: '#F97316',
    quote: '«Орбитальный удар пиццы точно в срок на координаты тусовки!»',
    img: 'https://images.contentstack.io/v3/assets/blt370612131b6e0eb3/blt26f126a963f9d858/5eb7cdcd98f0607c70c2f8ec/V_AGENTS_587x900_Brimstone.png',
    lore: 'Раскидывает дымы вокруг стола, открывает банку светлого пива с локтя и строго по планшету сверяет чеки, чтобы каждый гость получил ровно по два куска 4 Сыра и порцию гренок!',
    tags: ['🍺 Светлый лагер', '📋 Главный снабженец', '🧀 4 Сыра авторитет'],
  },
  killjoy: {
    id: 'killjoy',
    name: 'KILLJOY',
    title: 'Инженер сладкого стола и сидра',
    role: 'Страж 🤖',
    themeColor: '#EAB308',
    quote: '«Я рассчитала идеальный баланс сахара и яблочного сидра с точностью до грамма!»',
    img: 'https://images.contentstack.io/v3/assets/blt370612131b6e0eb3/blt56da51025556ca64/5eb7cdcbb1f2e27c950d2ab0/V_AGENTS_587x900_Killjoy.png',
    lore: 'Собрала кастомную турель, чтобы охранять торт и свежие эклеры до официального выноса. Точно знает, у кого лактозная непереносимость, и подготовила секретный резервный напиток!',
    tags: ['🎂 Хранитель торта', '🍏 Сидр-сомелье', '🔬 Точный расчет'],
  },
  omen: {
    id: 'omen',
    name: 'OMEN',
    title: 'Теневой чиллер тёмного угла',
    role: 'Специалист 🌑',
    themeColor: '#4F46E5',
    quote: '«Я растворюсь во мраке... но сначала захвачу запечённые роллы.»',
    img: 'https://images.contentstack.io/v3/assets/blt370612131b6e0eb3/blt4e5cd400e558e273/5eb7cdc6a0c7b045e7f1e70e/V_AGENTS_587x900_Omen.png',
    lore: 'Телепортируется в самый уютный угол комнаты с тарелкой горячих роллов и стаканом чистой минералки. Говорит глубоким бархатным голосом, вяжет спицами и следит, чтобы в еде не было кинзы.',
    tags: ['🍱 Запечённый сет', '🥤 Non-Alc мудрец', '🌌 Дзен тусовки'],
  },
  gekko: {
    id: 'gekko',
    name: 'GEKKO',
    title: 'Повелитель начос и милых снеков',
    role: 'Зачинщик 🦎',
    themeColor: '#84CC16',
    quote: '«Вингман уже тащит соус к начос, а Диззи выбирает фрукты!»',
    img: 'https://images.contentstack.io/v3/assets/blt370612131b6e0eb3/blte4a54449ec0c0e58/6407ca8c257ca610815e9a4c/Gekko_KeyArt_587x900.png',
    lore: 'Пришёл со своими питомцами: Вингман встречает доставщика у двери, Трэш разливает морс, а сам Гекко смеётся под музыку и макает хрустящие чипсы в гуакамоле.',
    tags: ['🧀 Начос-магнат', '🍓 Ягодный чилл', '🥳 Легкий на подъем'],
  },
  sage: {
    id: 'sage',
    name: 'SAGE',
    title: 'Хранитель здоровья и баланса',
    role: 'Страж 🌿',
    themeColor: '#10B981',
    quote: '«Я вылечу вас всех свежими овощами, фруктами и чистой водой!»',
    img: 'https://images.contentstack.io/v3/assets/blt370612131b6e0eb3/blt8a627ec10b57fba0/5eb7cdc105e63777f9d01f25/V_AGENTS_587x900_Sage.png',
    lore: 'Ставит ледяную стену перед теми, кто перебрал с шотами, раздаёт стаканы воды с лимоном и нарезает тарелку сочных ягод. Главный ангел-хранитель вашего хорошего самочувствия на утро!',
    tags: ['💧 Водный баланс', '🥗 Здоровый перекус', '💚 Забота о друзьях'],
  },
  raze: {
    id: 'raze',
    name: 'RAZE',
    title: 'Взрывной карнавал и конфетти',
    role: 'Дуэлянт 🎨',
    themeColor: '#F59E0B',
    quote: '«Здесь слишком тихо! Запускаем хлопушки и острые крылья!»',
    img: 'https://images.contentstack.io/v3/assets/blt370612131b6e0eb3/blt6f51759e20cd49f3/5eb7cdc6ee88132a6f6cfc29/V_AGENTS_587x900_Raze.png',
    lore: 'Принесла с собой мощную колонку, цветной дым и двойную порцию острых крылышек. Зажигает под бразильский фанк и за секунду превращает спокойный вечер в безумный рейв!',
    tags: ['🎉 Взрывной вайб', '🍗 Спайси крылышки', '🎶 Саундтрек вечера'],
  },
};

export function determineValorantAgent(s: Partial<SurveyResponse>): ValorantAgent {
  const spice = s.spice || 2;
  const alcTypes = s.alcoholTypes || [];
  const soft = s.softDrinks || [];
  const pizza = s.pizza || [];
  const sushi = s.sushi || [];
  const desserts = s.desserts || [];
  const snacks = s.snacks || [];
  const avoid = s.avoid || [];
  const alcPref = s.alcoholPref || 'alcohol';

  if (spice >= 4 && (alcTypes.includes('shots') || pizza.includes('pepperoni'))) {
    return VALORANT_AGENTS.yoru;
  }
  if (alcTypes.includes('shots') || alcTypes.includes('whiskey') || alcTypes.includes('tequila')) {
    return VALORANT_AGENTS.reyna;
  }
  if (soft.includes('energy') || pizza.includes('bbq') || snacks.includes('wings')) {
    return VALORANT_AGENTS.phoenix;
  }
  if (sushi.includes('philadelphia') && (sushi.includes('tempura') || sushi.includes('baked'))) {
    return VALORANT_AGENTS.jett;
  }
  if (alcTypes.includes('beer-light') || alcTypes.includes('beer-craft') || snacks.includes('meat-cuts')) {
    return VALORANT_AGENTS.brimstone;
  }
  if (desserts.includes('cake') && (alcPref === 'light' || alcTypes.includes('cider') || desserts.includes('cupcakes'))) {
    return VALORANT_AGENTS.killjoy;
  }
  if (alcPref === 'non-alc' && (snacks.includes('veggies') || desserts.includes('fruits'))) {
    return VALORANT_AGENTS.sage;
  }
  if (alcPref === 'non-alc' || avoid.length >= 2 || sushi.includes('baked')) {
    return VALORANT_AGENTS.omen;
  }
  if (snacks.includes('chips-nachos') || desserts.includes('fruits')) {
    return VALORANT_AGENTS.gekko;
  }

  return VALORANT_AGENTS.raze;
}

export const INITIAL_RESPONSES: SurveyResponse[] = [
  {
    id: 'res-1',
    name: 'Ксюша (Именинница)',
    allergies: ['none'],
    pizza: ['pepperoni', '4cheese', 'truffle'],
    sushi: ['philadelphia', 'baked'],
    snacks: ['chips-nachos', 'cheese-plate', 'nuggets'],
    spice: 3,
    avoid: ['cilantro'],
    alcoholPref: 'alcohol',
    alcoholTypes: ['prosecco', 'cider', 'gin'],
    softDrinks: ['cola-zero', 'juice', 'water'],
    desserts: ['cake', 'fruits'],
    wishes: 'Главное чтобы было шумно, вкусно и много торта!',
    agentId: 'killjoy',
    submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'res-2',
    name: 'Артём «Танк»',
    allergies: ['none'],
    pizza: ['meat', 'pepperoni', 'bbq'],
    sushi: ['tempura', 'unagi'],
    snacks: ['wings', 'fries', 'meat-cuts', 'garlic-bread'],
    spice: 5,
    avoid: ['pineapple'],
    alcoholPref: 'alcohol',
    alcoholTypes: ['beer-craft', 'whiskey', 'shots'],
    softDrinks: ['energy', 'cola'],
    desserts: ['none'],
    wishes: 'Больше мяса и холодного пива!',
    agentId: 'yoru',
    submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'res-3',
    name: 'Лера',
    allergies: ['seafood', 'lactose'],
    pizza: ['margarita', 'mushrooms'],
    sushi: ['no-sushi'],
    snacks: ['veggies', 'chips-nachos', 'nuts'],
    spice: 2,
    avoid: ['mayo', 'super-spicy'],
    alcoholPref: 'light',
    alcoholTypes: ['white-wine', 'cider'],
    softDrinks: ['lemonade', 'juice', 'water'],
    desserts: ['fruits', 'eclairs'],
    wishes: 'Пожалуйста, отметьте пиццу без морепродуктов отдельно ❤️',
    agentId: 'sage',
    submittedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'res-4',
    name: 'Макс',
    allergies: ['none'],
    pizza: ['pepperoni', 'hawaii'],
    sushi: ['philadelphia', 'california', 'spicy'],
    snacks: ['chips-nachos', 'nuggets'],
    spice: 4,
    avoid: ['none'],
    alcoholPref: 'alcohol',
    alcoholTypes: ['rum', 'cocktails', 'shots'],
    softDrinks: ['cola', 'tonic'],
    desserts: ['cake', 'icecream'],
    wishes: 'Гавайскую пиццу одобряю, хейтеры пусть завидуют!',
    agentId: 'phoenix',
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'res-5',
    name: 'Даша',
    allergies: ['nuts'],
    pizza: ['4cheese', 'margarita'],
    sushi: ['philadelphia', 'baked', 'unagi'],
    snacks: ['cheese-plate', 'fries'],
    spice: 1,
    avoid: ['onion-garlic', 'super-spicy'],
    alcoholPref: 'non-alc',
    alcoholTypes: [],
    softDrinks: ['lemonade', 'juice', 'cola-zero'],
    desserts: ['cake', 'cupcakes'],
    wishes: 'Я за рулём, так что мне сок и побольше роллов Филадельфия ✨',
    agentId: 'omen',
    submittedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];
