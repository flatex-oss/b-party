import React, { useState } from 'react';
import { SurveyResponse, ActiveTab } from '../types';
import { LABELS, SPICE_LEVELS, VALORANT_AGENTS } from '../data/surveyData';
import { calculatePartyEstimate, generateTelegramSummary } from '../utils/calculator';
import {
  RefreshCw,
  Copy,
  Check,
  Trash2,
  Search,
  AlertTriangle,
  Download,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Pizza,
  Wine,
  Users,
  Flame,
  ShieldAlert,
  Ban,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import confetti from 'canvas-confetti';

interface AnalyticsViewProps {
  responses: SurveyResponse[];
  onRefresh: () => Promise<void>;
  onDeleteResponse: (id: string) => void;
  onResetDemo: () => void;
  onClearAll: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  responses,
  onRefresh,
  onDeleteResponse,
  onResetDemo,
  onClearAll,
}) => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [copiedTelegram, setCopiedTelegram] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'allergies' | 'non-alc' | 'spicy'>('all');
  const [expandedGuests, setExpandedGuests] = useState<Record<string, boolean>>({});

  const estimate = calculatePartyEstimate(responses);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 450);
  };

  const handleCopyTelegram = () => {
    const text = generateTelegramSummary(estimate, responses);
    navigator.clipboard.writeText(text).then(() => {
      try {
        confetti({ particleCount: 35, spread: 45, origin: { y: 0.8 } });
      } catch (e) {}
      setCopiedTelegram(true);
      setTimeout(() => setCopiedTelegram(false), 2200);
    });
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(responses, null, 2)).then(() => {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2200);
    });
  };

  const toggleGuestExpand = (id: string) => {
    setExpandedGuests((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredResponses = responses.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === 'allergies') {
      return r.allergies.some((a) => a !== 'none');
    }
    if (filterType === 'non-alc') {
      return r.alcoholPref === 'non-alc';
    }
    if (filterType === 'spicy') {
      return r.spice >= 4;
    }
    return true;
  });

  const renderProgressBar = (
    title: string,
    items: { name: string; count: number; percent: number }[],
    icon: React.ReactNode,
    emptyText: string = 'Пока никто не выбрал'
  ) => {
    const maxCount = items.length > 0 ? Math.max(...items.map((i) => i.count), 1) : 1;

    return (
      <Card className="p-6 sm:p-7 bg-white border border-slate-200/80 shadow-xs flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="text-slate-500">{icon}</span>
            <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">{title}</h3>
          </div>
          {items.length > 0 && (
            <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-0.5">
              позиций: {items.length}
            </Badge>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-xs sm:text-sm font-medium text-slate-400 italic py-2">{emptyText}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item, idx) => {
              const barPercent = Math.round((item.count / maxCount) * 100);
              return (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs sm:text-sm text-slate-700">
                    <span className="font-medium truncate pr-2">{item.name}</span>
                    <span className="font-bold text-slate-900 shrink-0 text-xs sm:text-sm">
                      {item.count} {item.count === 1 ? 'голос' : item.count < 5 ? 'голоса' : 'голосов'} ({item.percent}%)
                    </span>
                  </div>
                  <Progress value={barPercent} className="h-2.5" />
                </div>
              );
            })}
          </div>
        )}
      </Card>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="flex flex-col gap-6 sm:gap-8 w-full pb-6"
    >
      {/* Top Banner Card */}
      <Card className="p-6 sm:p-8 text-center bg-white border border-slate-200/80 shadow-xs flex flex-col gap-2">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
          Сводка Заказа Стола
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
          Результаты предпочтений гостей для точного заказа и закупки напитков
        </p>
      </Card>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 w-full">
        <Card className="p-5 sm:p-6 text-center bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center gap-1.5">
          <span className="font-heading text-2xl sm:text-4xl font-extrabold text-orange-600 leading-none">
            {estimate.totalGuests}
          </span>
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-1">
            <Users size={14} /> Гостей
          </span>
        </Card>

        <Card className="p-5 sm:p-6 text-center bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center gap-1.5">
          <span className="font-heading text-2xl sm:text-4xl font-extrabold text-indigo-600 leading-none">
            {estimate.totalGuests > 0
              ? Math.round(
                  (responses.filter((r) => r.alcoholPref !== 'non-alc').length /
                    estimate.totalGuests) *
                    100
                ) + '%'
              : '0%'}
          </span>
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-1">
            <Wine size={14} /> Пьют бар
          </span>
        </Card>

        <Card className="p-5 sm:p-6 text-center bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center gap-1.5">
          <span className="font-heading text-base sm:text-xl font-bold text-emerald-600 leading-none truncate max-w-full">
            {estimate.pizzaBreakdown[0]?.name.replace(/\s.*$/, '') || '—'}
          </span>
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-1">
            <Pizza size={14} /> Топ пицца
          </span>
        </Card>

        <Card className="p-5 sm:p-6 text-center bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center gap-1.5">
          <span className="font-heading text-2xl sm:text-4xl font-extrabold text-amber-600 leading-none">
            {estimate.averageSpice} / 5
          </span>
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-1">
            <Flame size={14} /> Острота
          </span>
        </Card>
      </div>

      {/* Allergies Warning Panel */}
      {estimate.allergiesSummary.length > 0 && (
        <div className="bg-rose-50/90 border border-rose-200 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col gap-4">
          <h3 className="font-heading text-sm sm:text-base font-bold text-rose-900 flex items-center gap-2.5">
            <ShieldAlert size={20} className="text-rose-600 shrink-0" />
            <span>Внимание: Аллергии и ограничения гостей</span>
          </h3>
          <div className="flex flex-col gap-2.5">
            {estimate.allergiesSummary.map((item, idx) => (
              <div key={idx} className="bg-white border border-rose-200/80 rounded-xl p-3.5 text-xs sm:text-sm flex flex-wrap items-center gap-2">
                <span className="text-rose-700 font-bold">
                  {item.allergy}:
                </span>
                <span className="text-slate-700 font-medium">{item.guests.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stop List Warning Panel */}
      {estimate.avoidSummary.length > 0 && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col gap-4">
          <h3 className="font-heading text-sm sm:text-base font-bold text-amber-900 flex items-center gap-2.5">
            <Ban size={20} className="text-amber-600 shrink-0" />
            <span>Стоп-лист (не заказывать)</span>
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {estimate.avoidSummary.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-amber-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm flex items-center gap-2"
              >
                <span className="text-amber-800 font-bold">{item.item}:</span>
                <span className="text-slate-700 font-medium">{item.guests.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Food Preferences Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {renderProgressBar('Формат стола', estimate.foodFormatBreakdown, <span className="text-base">🍽️</span>)}
        {renderProgressBar('Ресторанные домашние блюда', estimate.restaurantBreakdown, <span className="text-base">👨‍🍳</span>)}
        {renderProgressBar('Пицца', estimate.pizzaBreakdown, <Pizza size={17} />)}
        {renderProgressBar('Суши и Роллы', estimate.sushiBreakdown, <span className="text-base">🍣</span>)}
        {renderProgressBar('Алкоголь и Коктейли', estimate.alcoholBreakdown, <Wine size={17} />)}
        {renderProgressBar('Безалкогольные напитки', estimate.softBreakdown, <span className="text-base">🧃</span>)}
        {renderProgressBar('Закуски и Снеки', estimate.snackBreakdown, <span className="text-base">🍟</span>)}
      </div>

      {/* Guest Directory Accordion Card */}
      <Card className="p-6 sm:p-8 bg-white border border-slate-200/80 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 pb-4 border-b border-slate-100">
          <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
            <Users size={20} className="text-slate-600" />
            <span>Ответы гостей ({filteredResponses.length})</span>
          </h3>

          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск по имени..."
              className="h-10 pl-9 text-xs sm:text-sm"
            />
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none ${
              filterType === 'all'
                ? 'bg-orange-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            Все ({responses.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('allergies')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none ${
              filterType === 'allergies'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            ⚠️ С аллергиями
          </button>
          <button
            type="button"
            onClick={() => setFilterType('non-alc')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none ${
              filterType === 'non-alc'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            🥤 Без алкоголя
          </button>
          <button
            type="button"
            onClick={() => setFilterType('spicy')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none ${
              filterType === 'spicy'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            🔥 Любят острое
          </button>
        </div>

        {/* Guest List */}
        {filteredResponses.length === 0 ? (
          <div className="text-center py-10 text-xs sm:text-sm font-medium text-slate-400 italic bg-slate-50 rounded-2xl p-6">
            Ни один гость не найден по заданным параметрам.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredResponses.map((guest) => {
              const isExpanded = !!expandedGuests[guest.id];
              const agent = guest.agentId && VALORANT_AGENTS[guest.agentId] ? VALORANT_AGENTS[guest.agentId] : null;

              return (
                <div
                  key={guest.id}
                  className="bg-slate-50/70 border border-slate-200/80 rounded-2xl overflow-hidden transition-all"
                >
                  <div
                    onClick={() => toggleGuestExpand(guest.id)}
                    className="p-4 sm:p-4.5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100/80 transition-colors gap-3"
                  >
                    <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                      <span className="font-heading text-sm sm:text-base font-bold text-slate-900">
                        {guest.name}
                      </span>
                      {agent && (
                        <Badge variant="default" className="text-xs px-2.5 py-0.5">
                          🎮 {agent.name}
                        </Badge>
                      )}
                      {guest.allergies.some((a) => a !== 'none') && (
                        <Badge variant="destructive" className="text-xs px-2.5 py-0.5">
                          ⚠️ Аллергия
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(guest.submittedAt).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isExpanded ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-4 border-t border-slate-200/60 bg-white text-xs sm:text-sm flex flex-col gap-3">
                      {agent && (
                        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-orange-50/70 border border-orange-200/70">
                          <img
                            src={agent.img}
                            alt={agent.name}
                            className="w-14 h-14 rounded-lg object-cover border border-orange-300 shadow-2xs shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-heading text-xs sm:text-sm font-bold text-orange-950 uppercase tracking-wide">
                              🎮 {agent.name} — {agent.title}
                            </span>
                            <span className="text-xs text-orange-700/90 italic truncate">
                              "{agent.quote}"
                            </span>
                          </div>
                        </div>
                      )}

                      <div>
                        <strong className="text-slate-800">🍽️ Формат меню: </strong>
                        <span className="text-slate-600">
                          {LABELS.foodFormat[guest.foodFormat || 'both']}
                        </span>
                      </div>

                      {guest.restaurantDishes && guest.restaurantDishes.length > 0 && (
                        <div>
                          <strong className="text-slate-800">👨‍🍳 Ресторанные блюда: </strong>
                          <span className="text-slate-600">
                            {guest.restaurantDishes.map((d) => LABELS.restaurantDishes[d] || d).join(', ')}
                          </span>
                        </div>
                      )}

                      <div>
                        <strong className="text-slate-800">🍕 Пицца: </strong>
                        <span className="text-slate-600">
                          {guest.pizza.map((p) => LABELS.pizza[p] || p).join(', ') || '—'}
                        </span>
                      </div>

                      <div>
                        <strong className="text-slate-800">🍣 Роллы: </strong>
                        <span className="text-slate-600">
                          {guest.sushi.map((s) => LABELS.sushi[s] || s).join(', ') || '—'}
                        </span>
                      </div>

                      <div>
                        <strong className="text-slate-800">🍸 Напитки: </strong>
                        <span className="text-slate-600">
                          {guest.alcoholPref === 'non-alc'
                            ? 'Безалкогольное (' + guest.softDrinks.map((d) => LABELS.softDrinks[d] || d).join(', ') + ')'
                            : (guest.alcoholTypes.map((a) => LABELS.alcoholTypes[a] || a).join(', ') || 'Без алкоголя') +
                              ' + ' +
                              guest.softDrinks.map((d) => LABELS.softDrinks[d] || d).join(', ')}
                        </span>
                      </div>

                      <div>
                        <strong className="text-slate-800">🍟 Снеки & Десерты: </strong>
                        <span className="text-slate-600">
                          {guest.snacks.map((sn) => LABELS.snacks[sn] || sn).join(', ')} |{' '}
                          {guest.desserts.map((ds) => LABELS.desserts[ds] || ds).join(', ')}
                        </span>
                      </div>

                      {guest.wishes && (
                        <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 italic text-slate-700">
                          💬 "{guest.wishes}"
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-500 font-medium">
                          Острота: {SPICE_LEVELS[guest.spice]?.title || guest.spice}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Удалить ответ от "${guest.name}"?`)) {
                              onDeleteResponse(guest.id);
                            }
                          }}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 size={14} /> Удалить ответ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Action Toolbar */}
      <div className="flex flex-wrap gap-3 justify-center pt-2">
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-10 text-xs sm:text-sm flex items-center gap-2 px-4"
        >
          <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{isRefreshing ? 'Обновляем...' : 'Обновить'}</span>
        </Button>

        <Button
          variant="default"
          onClick={handleCopyTelegram}
          className="h-10 text-xs sm:text-sm flex items-center gap-2 px-4 bg-orange-600 hover:bg-orange-700"
        >
          {copiedTelegram ? <Check size={15} /> : <Copy size={15} />}
          <span>{copiedTelegram ? 'Скопировано!' : 'Скопировать для Telegram'}</span>
        </Button>

        <Button
          variant="outline"
          onClick={handleCopyJson}
          className="h-10 text-xs sm:text-sm flex items-center gap-2 px-4"
        >
          {copiedJson ? <Check size={15} /> : <Download size={15} />}
          <span>{copiedJson ? 'JSON скопирован' : 'Экспорт JSON'}</span>
        </Button>

        <Button
          variant="ghost"
          onClick={() => {
            if (window.confirm('Очистить всю базу данных и удалить все ответы гостей?')) {
              onClearAll();
            }
          }}
          className="h-10 text-xs sm:text-sm flex items-center gap-2 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          title="Удалить все данные из БД"
        >
          <Trash2 size={14} />
          <span>Очистить всё</span>
        </Button>

        <Button
          variant="ghost"
          onClick={() => {
            if (window.confirm('Сбросить данные до начальных тестовых гостей?')) {
              onResetDemo();
            }
          }}
          className="h-10 text-xs sm:text-sm flex items-center gap-2 px-3 text-slate-500"
          title="Сбросить до демо-ответов"
        >
          <RotateCcw size={14} />
          <span>Демо</span>
        </Button>
      </div>
    </motion.div>
  );
};
