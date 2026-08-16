import { SurveyResponse, RestaurantDishType, FoodFormatType } from '../types';
import { LABELS, SPICE_LEVELS } from '../data/surveyData';

export interface PartyOrderEstimate {
  totalGuests: number;
  foodFormatBreakdown: { name: string; count: number; percent: number }[];
  restaurantBreakdown: { name: string; count: number; percent: number }[];
  pizzaCount: number;
  sushiPieces: number;
  sushiSets: number;
  alcoholLiters: number;
  beerCans: number;
  wineBottles: number;
  softDrinkLiters: number;
  snackPackages: number;
  cakeWeightKg: number;
  pizzaBreakdown: { name: string; count: number; percent: number }[];
  sushiBreakdown: { name: string; count: number; percent: number }[];
  alcoholBreakdown: { name: string; count: number; percent: number }[];
  softBreakdown: { name: string; count: number; percent: number }[];
  snackBreakdown: { name: string; count: number; percent: number }[];
  allergiesSummary: { allergy: string; guests: string[] }[];
  avoidSummary: { item: string; guests: string[] }[];
  averageSpice: number;
}

export function calculatePartyEstimate(responses: SurveyResponse[]): PartyOrderEstimate {
  const total = responses.length;
  if (total === 0) {
    return {
      totalGuests: 0,
      foodFormatBreakdown: [],
      restaurantBreakdown: [],
      pizzaCount: 0,
      sushiPieces: 0,
      sushiSets: 0,
      alcoholLiters: 0,
      beerCans: 0,
      wineBottles: 0,
      softDrinkLiters: 0,
      snackPackages: 0,
      cakeWeightKg: 0,
      pizzaBreakdown: [],
      sushiBreakdown: [],
      alcoholBreakdown: [],
      softBreakdown: [],
      snackBreakdown: [],
      allergiesSummary: [],
      avoidSummary: [],
      averageSpice: 2,
    };
  }

  // Food format breakdown
  const formatCounts: Record<string, number> = {};
  responses.forEach((r) => {
    const fmt = r.foodFormat || 'both';
    formatCounts[fmt] = (formatCounts[fmt] || 0) + 1;
  });
  const foodFormatBreakdown = Object.entries(formatCounts).map(([fmt, count]) => ({
    name: LABELS.foodFormat[fmt as FoodFormatType] || fmt,
    count,
    percent: Math.round((count / total) * 100),
  })).sort((a, b) => b.count - a.count);

  // Restaurant dishes breakdown
  const restCounts: Record<string, number> = {};
  responses.forEach((r) => {
    if (r.restaurantDishes && Array.isArray(r.restaurantDishes)) {
      r.restaurantDishes.forEach((d) => {
        restCounts[d] = (restCounts[d] || 0) + 1;
      });
    }
  });
  const restaurantBreakdown = Object.entries(restCounts).map(([d, count]) => ({
    name: LABELS.restaurantDishes[d as RestaurantDishType] || d,
    count,
    percent: Math.round((count / total) * 100),
  })).sort((a, b) => b.count - a.count);

  // Count pizza eaters
  const pizzaEaters = responses.filter((r) => !r.pizza.includes('no-pizza') && r.pizza.length > 0).length;
  // Recommended standard: 1 pizza (30cm) per 2.2 people
  const pizzaCount = Math.max(1, Math.ceil(pizzaEaters / 2.2));

  // Count sushi eaters
  const sushiEaters = responses.filter((r) => !r.sushi.includes('no-sushi') && r.sushi.length > 0).length;
  // ~8-10 pieces per person
  const sushiPieces = sushiEaters * 8;
  const sushiSets = Math.max(1, Math.ceil(sushiPieces / 32)); // ~32 pcs per party combo set

  // Alcohol calculations
  const drinkers = responses.filter((r) => r.alcoholPref === 'alcohol').length;
  const lightDrinkers = responses.filter((r) => r.alcoholPref === 'light').length;
  const nonDrinkers = responses.filter((r) => r.alcoholPref === 'non-alc').length;

  const beerLovers = responses.filter((r) => r.alcoholTypes.some((a) => a.startsWith('beer'))).length;
  const wineLovers = responses.filter((r) => r.alcoholTypes.some((a) => a.includes('wine') || a === 'prosecco')).length;

  const beerCans = Math.ceil(beerLovers * 3 + lightDrinkers * 0.5);
  const wineBottles = Math.ceil((wineLovers * 0.6) + (lightDrinkers * 0.4));
  const alcoholLiters = Number(((drinkers * 0.8) + (lightDrinkers * 0.3)).toFixed(1));

  // Soft drinks
  const softDrinkLiters = Number((total * 0.9 + nonDrinkers * 0.6).toFixed(1));

  // Snacks & Cake
  const snackPackages = Math.ceil(total * 1.5);
  const cakeWeightKg = Number((Math.max(1, total * 0.15)).toFixed(1));

  // Item vote tallies
  function getBreakdown<T extends string>(
    key: keyof SurveyResponse,
    labelMap: Record<T, string>,
    exclude: string[] = ['none', 'no-pizza', 'no-sushi']
  ) {
    const counts: Record<string, number> = {};
    responses.forEach((r) => {
      const val = r[key];
      if (Array.isArray(val)) {
        val.forEach((item) => {
          if (!exclude.includes(item)) {
            counts[item] = (counts[item] || 0) + 1;
          }
        });
      }
    });

    const entries = Object.entries(counts).map(([k, count]) => ({
      name: labelMap[k as T] || k,
      count,
      percent: Math.round((count / total) * 100),
    }));

    return entries.sort((a, b) => b.count - a.count);
  }

  const pizzaBreakdown = getBreakdown('pizza', LABELS.pizza);
  const sushiBreakdown = getBreakdown('sushi', LABELS.sushi);
  const alcoholBreakdown = getBreakdown('alcoholTypes', LABELS.alcoholTypes);
  const softBreakdown = getBreakdown('softDrinks', LABELS.softDrinks);
  const snackBreakdown = getBreakdown('snacks', LABELS.snacks);

  // Allergies Map
  const allergiesMap = new Map<string, string[]>();
  responses.forEach((r) => {
    r.allergies.forEach((alg) => {
      if (alg !== 'none') {
        const label = LABELS.allergies[alg] || alg;
        const current = allergiesMap.get(label) || [];
        current.push(r.name);
        allergiesMap.set(label, current);
      }
    });
  });

  const allergiesSummary = Array.from(allergiesMap.entries()).map(([allergy, guests]) => ({
    allergy,
    guests,
  }));

  // Avoid Map
  const avoidMap = new Map<string, string[]>();
  responses.forEach((r) => {
    r.avoid.forEach((av) => {
      if (av !== 'none') {
        const label = LABELS.avoid[av] || av;
        const current = avoidMap.get(label) || [];
        current.push(r.name);
        avoidMap.set(label, current);
      }
    });
  });

  const avoidSummary = Array.from(avoidMap.entries()).map(([item, guests]) => ({
    item,
    guests,
  }));

  // Average Spice
  const spiceSum = responses.reduce((acc, r) => acc + (r.spice || 2), 0);
  const averageSpice = Number((spiceSum / total).toFixed(1));

  return {
    totalGuests: total,
    foodFormatBreakdown,
    restaurantBreakdown,
    pizzaCount,
    sushiPieces,
    sushiSets,
    alcoholLiters,
    beerCans,
    wineBottles,
    softDrinkLiters,
    snackPackages,
    cakeWeightKg,
    pizzaBreakdown,
    sushiBreakdown,
    alcoholBreakdown,
    softBreakdown,
    snackBreakdown,
    allergiesSummary,
    avoidSummary,
    averageSpice,
  };
}

export function generateTelegramSummary(estimate: PartyOrderEstimate, responses: SurveyResponse[]): string {
  const lines: string[] = [];

  lines.push('🎉 🎂 ИТОГОВЫЙ ЗАКАЗ НА ДЕНЬ РОЖДЕНИЯ 🎂 🎉');
  lines.push(`👥 Всего ответов от гостей: ${estimate.totalGuests}`);
  lines.push('');

  if (estimate.foodFormatBreakdown.length > 0) {
    lines.push('🍽️ ФОРМАТ СТОЛА:');
    estimate.foodFormatBreakdown.forEach((f) => {
      lines.push(`• ${f.name} — ${f.count} чел. (${f.percent}%)`);
    });
    lines.push('');
  }

  if (estimate.restaurantBreakdown.length > 0) {
    lines.push('👨‍🍳 РЕСТОРАННЫЕ ДОМАШНИЕ БЛЮДА (ТОП ВЫБОРА):');
    estimate.restaurantBreakdown.slice(0, 4).forEach((d) => {
      lines.push(`• ${d.name} — ${d.count} голосов (${d.percent}%)`);
    });
    lines.push('');
  }

  lines.push('🍕 ПИЦЦА (рекомендовано ' + estimate.pizzaCount + ' шт.):');
  if (estimate.pizzaBreakdown.length > 0) {
    estimate.pizzaBreakdown.slice(0, 4).forEach((p) => {
      lines.push(`• ${p.name} — ${p.count} голосов (${p.percent}%)`);
    });
  } else {
    lines.push('• Без пиццы');
  }
  lines.push('');

  lines.push(`🍣 СУШИ & РОЛЛЫ (~${estimate.sushiPieces} шт. / ${estimate.sushiSets} больших сета):`);
  if (estimate.sushiBreakdown.length > 0) {
    estimate.sushiBreakdown.slice(0, 4).forEach((s) => {
      lines.push(`• ${s.name} — ${s.count} голосов (${s.percent}%)`);
    });
  }
  lines.push('');

  lines.push('🍸 БАР & НАПИТКИ:');
  lines.push(`• Пиво/Сидр: ~${estimate.beerCans} банок`);
  lines.push(`• Вино/Игристое: ~${estimate.wineBottles} бутылок`);
  lines.push(`• Соки, вода, лимонады: ~${estimate.softDrinkLiters} литров`);
  if (estimate.alcoholBreakdown.length > 0) {
    lines.push('Топ алкоголя: ' + estimate.alcoholBreakdown.slice(0, 3).map((a) => a.name).join(', '));
  }
  lines.push('');

  if (estimate.allergiesSummary.length > 0) {
    lines.push('⚠️ ВАЖНО: АЛЛЕРГИИ ГОСТЕЙ:');
    estimate.allergiesSummary.forEach((a) => {
      lines.push(`• ${a.allergy}: ${a.guests.join(', ')}`);
    });
    lines.push('');
  }

  if (estimate.avoidSummary.length > 0) {
    lines.push('🚫 СТОП-ЛИСТ (НЕ ЗАКАЗЫВАТЬ):');
    estimate.avoidSummary.forEach((av) => {
      lines.push(`• ${av.item}: ${av.guests.join(', ')}`);
    });
    lines.push('');
  }

  lines.push(`🌶️ Средняя острота стола: ${estimate.averageSpice} / 5 (${SPICE_LEVELS[Math.round(estimate.averageSpice)]?.title || 'Норм'})`);
  lines.push(`🎂 Торт: ~${estimate.cakeWeightKg} кг`);
  lines.push('');
  lines.push('📋 Список гостей: ' + responses.map((r) => r.name).join(', '));

  return lines.join('\n');
}
