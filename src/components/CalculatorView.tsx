import React, { useState } from 'react';
import { SurveyResponse, ActiveTab } from '../types';
import { calculatePartyEstimate } from '../utils/calculator';
import { Copy, Check, Pizza, Wine, Cake, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import confetti from 'canvas-confetti';

interface CalculatorViewProps {
  responses: SurveyResponse[];
  setActiveTab: (tab: ActiveTab) => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({ responses }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const pizzaPrice = 750;
  const sushiSetPrice = 1800;
  const drinksBudgetPerPerson = 600;
  const cakePrice = 2200;

  const estimate = calculatePartyEstimate(responses);

  const totalPizzas = estimate.pizzaCount;
  const pizzaBreakdownSuggestions: { name: string; qty: number }[] = [];
  if (estimate.pizzaBreakdown.length > 0 && totalPizzas > 0) {
    let remaining = totalPizzas;
    estimate.pizzaBreakdown.slice(0, 4).forEach((p, idx) => {
      if (remaining <= 0) return;
      const count = idx === 0 ? Math.max(1, Math.ceil(remaining * 0.45)) : Math.max(1, Math.floor(remaining / 2));
      const allocated = Math.min(count, remaining);
      pizzaBreakdownSuggestions.push({ name: p.name, qty: allocated });
      remaining -= allocated;
    });
    if (remaining > 0 && pizzaBreakdownSuggestions.length > 0) {
      pizzaBreakdownSuggestions[0].qty += remaining;
    }
  }

  const totalCost =
    totalPizzas * pizzaPrice +
    estimate.sushiSets * sushiSetPrice +
    estimate.totalGuests * drinksBudgetPerPerson +
    (estimate.totalGuests > 0 ? cakePrice : 0);

  const perPersonCost = estimate.totalGuests > 0 ? Math.round(totalCost / estimate.totalGuests) : 0;

  const handleCopyShoppingList = () => {
    const lines: string[] = [];
    lines.push('🛒 🎂 СПИСОК ПОКУПОК И ЗАКАЗА ДЛЯ ТУСОВКИ 🎂');
    lines.push(`👥 Гостей: ${estimate.totalGuests} чел.`);
    lines.push('');
    lines.push(`🍕 ПИЦЦА (${totalPizzas} шт. по 30-35 см):`);
    pizzaBreakdownSuggestions.forEach((p) => {
      lines.push(`• ${p.name} — ${p.qty} шт.`);
    });
    lines.push('');
    lines.push(`🍣 СУШИ (${estimate.sushiSets} больших комбо-сета / ~${estimate.sushiPieces} шт.):`);
    estimate.sushiBreakdown.slice(0, 3).forEach((s) => {
      lines.push(`• ${s.name}`);
    });
    lines.push('');
    lines.push('🍸 БАР И НАПИТКИ:');
    lines.push(`• Пиво / Сидр: ~${estimate.beerCans} банок`);
    lines.push(`• Вино / Игристое: ~${estimate.wineBottles} бутылок`);
    lines.push(`• Соки / Вода / Кола: ~${estimate.softDrinkLiters} литров`);
    lines.push('');
    lines.push(`🎂 Торт: ~${estimate.cakeWeightKg} кг`);
    lines.push(`🍟 Снеки / Чипсы: ~${estimate.snackPackages} больших пачек`);
    lines.push('');
    lines.push(`💰 Примерный общий бюджет: ~${totalCost.toLocaleString('ru-RU')} ₽ (~${perPersonCost} ₽ / гость)`);

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
      } catch (e) {}
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="flex flex-col gap-5 sm:gap-6 w-full pb-6"
    >
      {/* Title Card */}
      <Card className="p-6 text-center bg-white border border-slate-200/80 shadow-xs flex flex-col gap-1">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
          Калькулятор Доставки & Покупок
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Автоматический расчёт нужного количества порций, напитков и бюджета на {estimate.totalGuests} гостей
        </p>
      </Card>

      {/* Suggested Delivery Plan Card */}
      <Card className="p-5 sm:p-7 bg-white border border-slate-200/80 shadow-xs flex flex-col gap-6">
        {/* Pizza section */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-600">
                <Pizza size={20} />
              </div>
              <div>
                <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                  Пицца на заказ
                </h3>
                <span className="text-xs text-slate-500 font-normal">
                  Рекомендация: <strong>{totalPizzas} шт.</strong> (1 пицца на ~2 человека)
                </span>
              </div>
            </div>
            <Badge variant="default" className="text-xs font-semibold px-2.5 py-1 self-start sm:self-auto">
              {totalPizzas} шт.
            </Badge>
          </div>

          {pizzaBreakdownSuggestions.length > 0 && (
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-700">
                Рекомендуемый состав заказа по голосам:
              </span>
              <div className="flex flex-col gap-1.5">
                {pizzaBreakdownSuggestions.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-slate-700 font-medium">• {p.name}</span>
                    <span className="font-semibold text-orange-600">{p.qty} шт.</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sushi Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
              <span className="text-lg">🍣</span>
            </div>
            <div>
              <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                Суши и Роллы
              </h3>
              <span className="text-xs text-slate-500 font-normal">
                ~{estimate.sushiPieces} кусочков (по 8-10 шт. на любителя)
              </span>
            </div>
          </div>
          <Badge variant="success" className="text-xs font-semibold px-2.5 py-1 self-start sm:self-auto">
            {estimate.sushiSets} {estimate.sushiSets === 1 ? 'сет' : estimate.sushiSets < 5 ? 'сета' : 'сетов'}
          </Badge>
        </div>

        {/* Bar & Drinks Grid */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600">
              <Wine size={16} />
            </div>
            <div>
              <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                Бар & Безалкогольные напитки
              </h3>
              <span className="text-xs text-slate-500 font-normal">
                С учётом соотношения гостей
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 text-center flex flex-col items-center gap-0.5">
              <span className="font-heading text-base sm:text-lg font-bold text-slate-900 block">~{estimate.beerCans} банок</span>
              <span className="text-xs text-slate-500 font-medium">🍺 Пиво & Сидр</span>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 text-center flex flex-col items-center gap-0.5">
              <span className="font-heading text-base sm:text-lg font-bold text-slate-900 block">~{estimate.wineBottles} бут.</span>
              <span className="text-xs text-slate-500 font-medium">🍾 Игристое & Вино</span>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 text-center flex flex-col items-center gap-0.5">
              <span className="font-heading text-base sm:text-lg font-bold text-slate-900 block">~{estimate.softDrinkLiters} л.</span>
              <span className="text-xs text-slate-500 font-medium">🧃 Соки, Кола, Вода</span>
            </div>
          </div>
        </div>

        {/* Cake & Snacks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-pink-50 border border-pink-200/60 flex items-center justify-center text-pink-600 shrink-0">
              <Cake size={18} />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Праздничный торт:</span>
              <span className="font-heading text-sm sm:text-base font-bold text-slate-900">
                ~{estimate.cakeWeightKg} кг (150г / чел.)
              </span>
            </div>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0">
              <span className="text-base">🍟</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Снеки & Начос:</span>
              <span className="font-heading text-sm sm:text-base font-bold text-slate-900">
                ~{estimate.snackPackages} больших пачек
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Estimated Total Budget Card */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 p-6 sm:p-7 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <DollarSign size={18} />
            </div>
            <div>
              <h3 className="font-heading text-base sm:text-lg font-bold text-white">Примерный бюджет</h3>
              <p className="text-xs text-slate-400">Ориентировочный расчёт на всю компанию</p>
            </div>
          </div>
          <span className="font-heading text-2xl sm:text-3xl font-extrabold text-orange-400">
            ~{totalCost.toLocaleString('ru-RU')} ₽
          </span>
        </div>

        <div className="text-xs sm:text-sm text-slate-300">
          В среднем <strong className="text-white">~{perPersonCost.toLocaleString('ru-RU')} ₽ на 1 гостя</strong> при заказе всей еды и бара.
        </div>

        <Button
          size="lg"
          onClick={handleCopyShoppingList}
          className="w-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 py-3 bg-orange-600 hover:bg-orange-700 text-white"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'Список покупок скопирован!' : 'Скопировать список покупок в буфер'}</span>
        </Button>
      </Card>
    </motion.div>
  );
};
