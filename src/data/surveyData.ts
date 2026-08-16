import {
  FoodFormatType,
  RestaurantDishType,
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
  foodFormat: Record<FoodFormatType, string>;
  restaurantDishes: Record<RestaurantDishType, string>;
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
  foodFormat: {
    restaurant: '👨‍🍳 Домашний ресторан (рецепты как в ресторане)',
    delivery: '🍕 Доставка: Пицца и роллы',
    both: '✨ И ресторанные блюда, и пицца/роллы',
  },
  restaurantDishes: {
    'steak-meat': 'Сочные стейки / Томлёное мясо 🥩',
    'pasta-risotto': 'Авторская паста / Ризотто 🍝',
    'bruschetta-tapas': 'Хрустящие брускетты и тапас 🥖',
    'gourmet-salads': 'Салаты (Буррата, Цезарь с креветками) 🥗',
    'baked-fish': 'Запечённая рыба / Морепродукты 🐟',
    'truffle-dishes': 'Блюда с трюфельным акцентом ✨',
    'baked-veggies': 'Овощи-гриль с пряными травами 🫑',
  },
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
    title: 'Похититель горячего и пиццы',
    role: 'Дуэлянт 💥',
    themeColor: '#3B82F6',
    quote: '«Я заберу этот кусок через портал, пока никто не видит!»',
    img: '/heroes/yoru.jpg',
    lore: 'Обожает пикантную еду, сочные стейки и острую пиццу с пепперони.',
    tags: ['🌶️ Огненный гурман', '🥩 Мясной мастер', '⚡ Скоростной хват'],
  },
  phoenix: {
    id: 'phoenix',
    name: 'PHOENIX',
    title: 'Зажигала праздничного стола',
    role: 'Дуэлянт 🔥',
    themeColor: '#EF4444',
    quote: '«Watch this! Зажигаем свечи и разогреваем стол на максимум!»',
    img: '/heroes/phoenix.jpg',
    lore: 'Первым открывает напитки, берет крылышки BBQ и задает драйв всему вечеру.',
    tags: ['🔥 Душа компании', '⚡ Энергетик-машина', '🍗 BBQ фанат'],
  },
  jett: {
    id: 'jett',
    name: 'JETT',
    title: 'Сверхзвуковой гурман роллов',
    role: 'Дуэлянт 🌪️',
    themeColor: '#06B6D4',
    quote: '«Пока вы моргали, вся Филадельфия уже у меня в тарелке!»',
    img: '/heroes/jett.jpg',
    lore: 'На рывке забирает темпуру, пасту с морепродуктами и холодную колу.',
    tags: ['🍣 Филадельфия-снайпер', '💨 Сверхзвуковая скорость', '🥤 Кола-энтузиаст'],
  },
  reyna: {
    id: 'reyna',
    name: 'REYNA',
    title: 'Королева ресторанных блюд и бара',
    role: 'Дуэлянт 💜',
    themeColor: '#A855F7',
    quote: '«Чем изысканнее блюда и крепче напитки — тем ярче вечер!»',
    img: '/heroes/reyna.jpg',
    lore: 'Ценит высокую ресторанную подачу, стейки прожарки medium и авторские коктейли.',
    tags: ['🍷 Королева ночи', '🥩 Стейки и тапас', '🍸 Барный ультимейт'],
  },
  brimstone: {
    id: 'brimstone',
    name: 'BRIMSTONE',
    title: 'Капитан снабжения и шеф-батя',
    role: 'Специалист 🪖',
    themeColor: '#F97316',
    quote: '«Орбитальный удар еды точно по расписанию!»',
    img: '/heroes/brimstone.jpg',
    lore: 'Следит, чтобы порций хватило всем, открывает крафт и координирует кухню.',
    tags: ['🍺 Светлый лагер', '📋 Главный снабженец', '🧀 4 Сыра авторитет'],
  },
  killjoy: {
    id: 'killjoy',
    name: 'KILLJOY',
    title: 'Инженер ресторанных десертов',
    role: 'Страж 🤖',
    themeColor: '#EAB308',
    quote: '«Я рассчитала идеальный баланс вкуса с точностью до грамма!»',
    img: '/heroes/killjoy.jpg',
    lore: 'Охраняет праздничный торт, авторские эклеры и помнит все аллергии гостей.',
    tags: ['🎂 Хранитель торта', '🍏 Сидр-сомелье', '🔬 Точный расчет'],
  },
  omen: {
    id: 'omen',
    name: 'OMEN',
    title: 'Теневой созерцатель уюта',
    role: 'Специалист 🌑',
    themeColor: '#4F46E5',
    quote: '«Я растворюсь в уюте... с тарелкой запечённых роллов и пасты.»',
    img: '/heroes/omen.jpg',
    lore: 'Выбирает самый уютный диван, безалкогольные напитки и блюда без резких запахов.',
    tags: ['🍱 Запечённый сет', '🥤 Non-Alc мудрец', '🌌 Дзен тусовки'],
  },
  gekko: {
    id: 'gekko',
    name: 'GEKKO',
    title: 'Повелитель начос и тапас',
    role: 'Зачинщик 🦎',
    themeColor: '#84CC16',
    quote: '«Вингман уже несёт соусы, а Диззи выбирает фрукты!»',
    img: '/heroes/gekko.jpg',
    lore: 'Макает хрустящие чипсы в соусы, пробует брускетты и наслаждается музыкой.',
    tags: ['🧀 Начос-магнат', '🍓 Свежие ягоды', '🥳 Легкий на подъем'],
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
  const foodFormat = s.foodFormat || 'both';
  const restDishes = s.restaurantDishes || [];

  if (spice >= 4 && (alcTypes.includes('shots') || pizza.includes('pepperoni') || restDishes.includes('steak-meat'))) {
    return VALORANT_AGENTS.yoru;
  }
  if (
    foodFormat === 'restaurant' &&
    (restDishes.includes('steak-meat') || restDishes.includes('truffle-dishes') || alcTypes.includes('red-wine') || alcTypes.includes('cocktails'))
  ) {
    return VALORANT_AGENTS.reyna;
  }
  if (alcTypes.includes('shots') || alcTypes.includes('whiskey') || alcTypes.includes('tequila')) {
    return VALORANT_AGENTS.reyna;
  }
  if (soft.includes('energy') || pizza.includes('bbq') || snacks.includes('wings')) {
    return VALORANT_AGENTS.phoenix;
  }
  if (sushi.includes('philadelphia') || sushi.includes('tempura') || restDishes.includes('baked-fish')) {
    return VALORANT_AGENTS.jett;
  }
  if (alcTypes.includes('beer-light') || alcTypes.includes('beer-craft') || snacks.includes('meat-cuts')) {
    return VALORANT_AGENTS.brimstone;
  }
  if (desserts.includes('cake') && (alcPref === 'light' || alcTypes.includes('cider') || desserts.includes('cupcakes') || desserts.includes('eclairs'))) {
    return VALORANT_AGENTS.killjoy;
  }
  if (alcPref === 'non-alc' || avoid.length >= 2 || sushi.includes('baked') || restDishes.includes('pasta-risotto')) {
    return VALORANT_AGENTS.omen;
  }
  if (snacks.includes('chips-nachos') || restDishes.includes('bruschetta-tapas') || desserts.includes('fruits')) {
    return VALORANT_AGENTS.gekko;
  }

  return VALORANT_AGENTS.phoenix;
}

export const INITIAL_RESPONSES: SurveyResponse[] = [
  {
    id: 'res-1',
    name: 'Ксюша (Именинница)',
    foodFormat: 'both',
    restaurantDishes: ['bruschetta-tapas', 'gourmet-salads', 'truffle-dishes'],
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
    foodFormat: 'restaurant',
    restaurantDishes: ['steak-meat', 'pasta-risotto'],
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
    wishes: 'Больше сочного мяса и холодного крафта!',
    agentId: 'yoru',
    submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'res-3',
    name: 'Лера',
    foodFormat: 'restaurant',
    restaurantDishes: ['gourmet-salads', 'bruschetta-tapas', 'baked-veggies'],
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
    wishes: 'Пожалуйста, отметьте блюда без морепродуктов отдельно ❤️',
    agentId: 'omen',
    submittedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'res-4',
    name: 'Макс',
    foodFormat: 'delivery',
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
    foodFormat: 'both',
    restaurantDishes: ['pasta-risotto', 'bruschetta-tapas'],
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
