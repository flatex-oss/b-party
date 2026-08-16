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
      className="flex flex-col gap-5 sm:gap-6 w-full pb-6"
    >
      {/* Hero Card */}
      <Card className="p-6 sm:p-10 text-center relative overflow-hidden bg-white border border-slate-200/80 shadow-sm flex flex-col items-center gap-5">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-orange-100/60 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />

        {/* Header Tag */}
        <Badge variant="default" className="text-xs font-semibold px-3 py-1 bg-orange-50 text-orange-700 border-orange-200/80">
          🎂 Праздничный опрос на День Рождения
        </Badge>

        {/* Mascot / Icon Badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-100 border border-orange-200/60 flex items-center justify-center text-3xl sm:text-4xl shadow-xs">
          🍕
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col gap-2 max-w-lg">
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Что закажем <span className="text-orange-600">на тусовку?</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Пройдите опрос за 1 минуту: выберите любимую пиццу, сеты роллов, снеки и бар, чтобы на празднике каждый был сыт и доволен.
          </p>
        </div>

        {/* Primary & Secondary CTAs */}
        <div className="w-full max-w-sm flex flex-col gap-3 pt-2">
          <Button
            onClick={() => setActiveTab('survey')}
            size="lg"
            className="w-full text-base font-semibold flex items-center justify-center gap-2 py-3 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-sm"
          >
            <Sparkles size={18} className="text-amber-300" />
            <span>Пройти опрос</span>
            <ArrowRight size={18} />
          </Button>

          <div className="grid grid-cols-2 gap-2.5 w-full">
            <Button
              variant="outline"
              onClick={() => setActiveTab('analytics')}
              className="text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 py-2.5"
            >
              <PieChart size={15} className="text-slate-500 shrink-0" />
              <span className="truncate">Сводка ({responses.length})</span>
            </Button>

            <Button
              variant="secondary"
              onClick={() => setActiveTab('calculator')}
              className="text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 py-2.5"
            >
              <Calculator size={15} className="text-slate-500 shrink-0" />
              <span className="truncate">Расчёт заказа</span>
            </Button>
          </div>
        </div>

        {/* Live responses ticker pill */}
        {responses.length > 0 && (
          <div className="pt-2 border-t border-slate-100 w-full flex items-center justify-center gap-2 text-xs text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Уже ответили <strong>{responses.length}</strong> {responses.length === 1 ? 'гость' : responses.length < 5 ? 'гостя' : 'гостей'}</span>
          </div>
        )}
      </Card>

      {/* 3 Structured Benefit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full">
        <Card className="p-5 flex flex-col gap-2.5 bg-white border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-600">
            <CheckCircle2 size={18} />
          </div>
          <h3 className="font-heading text-sm font-bold text-slate-900">Без споров о еде</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Суммируем предпочтения по вкусам и видам пиццы и роллов для идеального меню.
          </p>
        </Card>

        <Card className="p-5 flex flex-col gap-2.5 bg-white border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600">
            <ShieldCheck size={18} />
          </div>
          <h3 className="font-heading text-sm font-bold text-slate-900">Учёт аллергий</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Отдельный стоп-лист и контроль остроты гарантируют безопасность каждого гостя.
          </p>
        </Card>

        <Card className="p-5 flex flex-col gap-2.5 bg-white border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600">
            <HeartHandshake size={18} />
          </div>
          <h3 className="font-heading text-sm font-bold text-slate-900">Точный расчёт</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Калькулятор автоматически вычисляет объём порций и ориентировочный бюджет.
          </p>
        </Card>
      </div>
    </motion.div>
  );
};
