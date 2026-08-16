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
      className="flex flex-col gap-5 sm:gap-6 w-full pb-6"
    >
      {/* Top Badge */}
      <div className="flex justify-center">
        <Badge variant="default" className="text-xs font-semibold px-3 py-1 bg-orange-50 text-orange-700 border-orange-200">
          🎮 Твой праздничный паспорт · Valorant
        </Badge>
      </div>

      {/* Main Agent Passport Card */}
      <Card className="relative text-center overflow-hidden bg-white p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col items-center gap-4">
        {/* Passport Stamp Pill */}
        <div className="absolute top-3.5 right-3.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-2xs">
          <Check size={12} className="stroke-[3]" />
          <span>Заказ сохранён</span>
        </div>

        {/* Guest Name & Greeting */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Гость: <span className="text-slate-800 font-extrabold">{response?.name || 'Друг'}</span>
          </span>
        </div>

        {/* Agent Avatar Frame */}
        <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-2 border-orange-200 shadow-sm overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center">
          {!imgError ? (
            <img
              src={agent.img}
              alt={agent.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-orange-50 text-orange-700">
              <span className="text-3xl mb-1">🎮</span>
              <span className="font-heading text-xs font-bold uppercase">{agent.name}</span>
            </div>
          )}
        </div>

        {/* Agent Name & Title */}
        <div className="flex flex-col gap-0.5">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
            {agent.name}
          </h2>
          <span className="text-xs sm:text-sm font-semibold text-orange-600">
            {agent.title}
          </span>
        </div>

        {/* Agent Quote */}
        <div className="relative text-xs sm:text-sm text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl py-3 px-4 max-w-md italic flex items-center gap-2">
          <Quote size={16} className="text-slate-400 shrink-0 self-start mt-0.5" />
          <span>"{agent.quote}"</span>
        </div>

        {/* Guest Order Highlights Chips */}
        {tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 max-w-md pt-1">
            {tags.map((t, idx) => (
              <span
                key={idx}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-lg"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Share Button */}
        <div className="w-full max-w-xs pt-2">
          <Button
            size="lg"
            onClick={handleShare}
            className="w-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 py-3 bg-orange-600 hover:bg-orange-700 text-white shadow-sm"
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            <span>{copied ? 'Скопировано в буфер!' : 'Поделиться паспортом'}</span>
          </Button>
        </div>
      </Card>

      {/* Navigation Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
        <Button
          variant="outline"
          onClick={() => setActiveTab('analytics')}
          className="text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 py-2.5"
        >
          <PieChart size={15} />
          <span>Смотреть сводку</span>
        </Button>

        <Button
          variant="secondary"
          onClick={() => setActiveTab('calculator')}
          className="text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 py-2.5"
        >
          <Calculator size={15} />
          <span>Калькулятор</span>
        </Button>

        <Button
          variant="outline"
          onClick={onFillAgain}
          className="text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 py-2.5"
        >
          <UserPlus size={15} />
          <span>Заполнить за друга</span>
        </Button>
      </div>
    </motion.div>
  );
};
