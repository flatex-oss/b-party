import React from 'react';
import { ActiveTab, SurveyResponse } from '../types';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, PieChart, Calculator, ArrowRight, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

interface LandingViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  responses: SurveyResponse[];
}

export const LandingView: React.FC<LandingViewProps> = ({ setActiveTab, responses }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-6 sm:gap-8 w-full pb-6"
    >
      {/* Hero Card */}
      <Card className="p-8 sm:p-12 text-center relative overflow-hidden bg-white border border-slate-200/80 shadow-sm flex flex-col items-center gap-6 sm:gap-7">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-52 h-52 rounded-full bg-orange-100/60 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />

        {/* Header Tag */}
        <Badge variant="default" className="text-xs font-semibold px-3.5 py-1.5 bg-orange-50 text-orange-700 border-orange-200/80 shadow-2xs">
          🎂 Праздничный опрос на День Рождения
        </Badge>

        {/* Mascot / Icon Badge */}
        <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-3xl bg-gradient-to-br from-orange-50 to-amber-100 border border-orange-200/60 flex items-center justify-center text-4xl sm:text-5xl shadow-2xs">
          🍕
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col gap-3 max-w-xl">
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Что приготовим <span className="text-orange-600">и закажем на праздник?</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Пройдите опрос за 1 минуту: выберите между домашними блюдами ресторанного уровня, доставкой пиццы и роллов, укажите любимый бар и закуски.
          </p>
        </div>

        {/* Primary & Secondary CTAs */}
        <div className="w-full max-w-md flex flex-col gap-3.5 pt-2">
          <Button
            onClick={() => setActiveTab('survey')}
            size="lg"
            className="w-full text-base font-semibold flex items-center justify-center gap-2.5 h-12 sm:h-13 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-sm"
          >
            <Sparkles size={19} className="text-amber-300" />
            <span>Пройти опрос</span>
            <ArrowRight size={19} />
          </Button>

          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => setActiveTab('analytics')}
              className="h-11 text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
            >
              <PieChart size={16} className="text-slate-500 shrink-0" />
              <span className="truncate">Сводка ({responses.length})</span>
            </Button>

            <Button
              variant="secondary"
              onClick={() => setActiveTab('calculator')}
              className="h-11 text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
            >
              <Calculator size={16} className="text-slate-500 shrink-0" />
              <span className="truncate">Расчёт заказа</span>
            </Button>
          </div>
        </div>

        {/* Live responses ticker pill */}
        {responses.length > 0 && (
          <div className="pt-4 border-t border-slate-100 w-full flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Уже ответили <strong className="text-slate-800">{responses.length}</strong> {responses.length === 1 ? 'гость' : responses.length < 5 ? 'гостя' : 'гостей'}</span>
          </div>
        )}
      </Card>

      {/* 3 Structured Benefit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 w-full">
        <Card className="p-6 sm:p-7 flex flex-col gap-3.5 bg-white border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-600 shadow-2xs">
            <CheckCircle2 size={20} />
          </div>
          <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">Без споров о еде</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Суммируем предпочтения по вкусам и видам пиццы и роллов для идеального меню.
          </p>
        </Card>

        <Card className="p-6 sm:p-7 flex flex-col gap-3.5 bg-white border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600 shadow-2xs">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">Учёт аллергий</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Отдельный стоп-лист и контроль остроты гарантируют безопасность каждого гостя.
          </p>
        </Card>

        <Card className="p-6 sm:p-7 flex flex-col gap-3.5 bg-white border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600 shadow-2xs">
            <HeartHandshake size={20} />
          </div>
          <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">Точный расчёт</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Калькулятор автоматически вычисляет объём порций и ориентировочный бюджет.
          </p>
        </Card>
      </div>
    </motion.div>
  );
};
