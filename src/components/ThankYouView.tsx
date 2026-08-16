import React, { useState, useEffect } from 'react';
import { SurveyResponse, ActiveTab, ValorantAgent } from '../types';
import { determineValorantAgent, VALORANT_AGENTS, LABELS, SPICE_LEVELS } from '../data/surveyData';
import { Share2, Check, UserPlus, PieChart, Calculator, Sparkles, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import confetti from 'canvas-confetti';

interface ThankYouViewProps {
  response: SurveyResponse | null;
  setActiveTab: (tab: ActiveTab) => void;
  onFillAgain: () => void;
}

export const ThankYouView: React.FC<ThankYouViewProps> = ({ response, setActiveTab, onFillAgain }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  useEffect(() => {
    try {
      const end = Date.now() + 800;
      const colors = ['#EA580C', '#F97316', '#10B981', '#6366F1', '#EC4899'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch (e) {}
  }, []);

  const agent: ValorantAgent = response?.agentId && VALORANT_AGENTS[response.agentId]
    ? VALORANT_AGENTS[response.agentId]
    : response
    ? determineValorantAgent(response)
    : VALORANT_AGENTS.yoru;

  const handleShare = () => {
    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    } catch (e) {}

    const text = `🎂 Мой праздничный паспорт гостя:\n🔥 Агент: ${agent.name} — ${agent.title}\n💬 "${agent.quote}"\n🍕 Мой заказ на вечеринку сохранён!`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const tags: string[] = [];
  if (response) {
    if (response.foodFormat === 'restaurant') {
      tags.push('👨‍🍳 Домашний ресторан');
    } else if (response.foodFormat === 'delivery') {
      tags.push('🍕 Доставка');
    } else {
      tags.push('✨ Ресторан + Доставка');
    }

    if (response.restaurantDishes && response.restaurantDishes.length > 0) {
      tags.push(
        '👨‍🍳 ' +
          response.restaurantDishes
            .slice(0, 2)
            .map((d) => LABELS.restaurantDishes[d]?.replace(/\s.*$/, '') || d)
            .join(' + ')
      );
    }

    if (response.pizza.length > 0 && !response.pizza.includes('no-pizza')) {
      tags.push(
        '🍕 ' +
          response.pizza
            .slice(0, 2)
            .map((p) => LABELS.pizza[p]?.replace(/\s.*$/, '') || p)
            .join(' + ')
      );
    }
    if (response.sushi.length > 0 && !response.sushi.includes('no-sushi')) {
      tags.push(
        '🍣 ' +
          response.sushi
            .slice(0, 2)
            .map((s) => LABELS.sushi[s]?.replace(/\s.*$/, '') || s)
            .join(' + ')
      );
    }
    tags.push(`${SPICE_LEVELS[response.spice]?.emoji || '🌶️'} ${SPICE_LEVELS[response.spice]?.title || 'Норм'}`);
    tags.push(
      response.alcoholPref === 'non-alc'
        ? '🥤 Non-Alc'
        : '🍸 ' + (response.alcoholTypes[0] ? LABELS.alcoholTypes[response.alcoholTypes[0]]?.replace(/\s.*$/, '') : 'Бар')
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-6 sm:gap-8 w-full pb-6"
    >
      {/* Top Badge */}
      <div className="flex justify-center">
        <Badge variant="default" className="text-xs sm:text-sm font-semibold px-4 py-1.5 bg-orange-50 text-orange-700 border-orange-200 shadow-2xs">
          🎮 Твой праздничный паспорт · Valorant
        </Badge>
      </div>

      {/* Main Agent Passport Card */}
      <Card className="relative text-center overflow-hidden bg-white p-7 sm:p-10 border border-slate-200/80 shadow-xs flex flex-col items-center gap-5 sm:gap-6 rounded-2xl">
        {/* Passport Stamp Pill */}
        <div className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
          <Check size={14} className="stroke-[3]" />
          <span>Заказ сохранён</span>
        </div>

        {/* Guest Name & Greeting */}
        <div className="pt-2">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">
            Гость: <span className="text-slate-800 font-extrabold text-sm sm:text-base">{response?.name || 'Друг'}</span>
          </span>
        </div>

        {/* Agent Avatar Frame with Vintage CRT/Cartoon Frame */}
        <div className="relative mx-auto w-full max-w-sm aspect-[4/3] rounded-2xl border-4 border-amber-950/15 shadow-md overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center group">
          {!imgError ? (
            <img
              src={agent.img}
              alt={agent.name}
              referrerPolicy="no-referrer"
              onError={() => {
                // Try fallback to .png if .jpg failed, otherwise show styled fallback
                if (agent.img.endsWith('.jpg')) {
                  const fallbackPng = agent.img.replace('.jpg', '.png');
                  const target = new Image();
                  target.onload = () => {
                    agent.img = fallbackPng;
                    setImgError(false);
                  };
                  target.onerror = () => setImgError(true);
                  target.src = fallbackPng;
                } else {
                  setImgError(true);
                }
              }}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-50 to-orange-100 text-orange-800">
              <span className="text-5xl mb-2">🎬</span>
              <span className="font-heading text-base font-extrabold uppercase tracking-wide">{agent.name}</span>
              <span className="text-xs text-amber-700 mt-1 font-medium">{agent.title}</span>
            </div>
          )}
        </div>

        {/* Agent Name & Title */}
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-900">
            {agent.name}
          </h2>
          <span className="text-xs sm:text-sm font-semibold text-orange-600">
            {agent.title}
          </span>
        </div>

        {/* Agent Quote */}
        <div className="relative text-xs sm:text-sm text-slate-600 bg-slate-50/80 border border-slate-200/80 rounded-2xl py-3.5 px-5 max-w-lg italic flex items-start gap-2.5 leading-relaxed text-left">
          <Quote size={18} className="text-slate-400 shrink-0 mt-0.5" />
          <span>"{agent.quote}"</span>
        </div>

        {/* Guest Order Highlights Chips */}
        {tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 max-w-md pt-1">
            {tags.map((t, idx) => (
              <span
                key={idx}
                className="bg-slate-50 border border-slate-200/80 text-slate-700 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-xl shadow-2xs"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Share Button */}
        <div className="w-full max-w-xs pt-3">
          <Button
            size="lg"
            onClick={handleShare}
            className="w-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 h-12 bg-orange-600 hover:bg-orange-700 text-white shadow-sm"
          >
            {copied ? <Check size={17} /> : <Share2 size={17} />}
            <span>{copied ? 'Скопировано в буфер!' : 'Поделиться паспортом'}</span>
          </Button>
        </div>
      </Card>

      {/* Navigation Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full">
        <Button
          variant="outline"
          onClick={() => setActiveTab('analytics')}
          className="text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 h-11"
        >
          <PieChart size={16} />
          <span>Смотреть сводку</span>
        </Button>

        <Button
          variant="secondary"
          onClick={() => setActiveTab('calculator')}
          className="text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 h-11"
        >
          <Calculator size={16} />
          <span>Калькулятор</span>
        </Button>

        <Button
          variant="outline"
          onClick={onFillAgain}
          className="text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 h-11"
        >
          <UserPlus size={16} />
          <span>Заполнить за друга</span>
        </Button>
      </div>
    </motion.div>
  );
};
