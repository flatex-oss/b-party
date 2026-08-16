import React, { useState } from 'react';
import {
  SurveyResponse,
  ActiveTab,
  AllergyType,
  PizzaType,
  SushiType,
  SnackType,
  AlcoholType,
  SoftDrinkType,
  DessertType,
  AvoidType,
  AlcoholPrefType,
} from '../types';
import { LABELS, SPICE_LEVELS, determineValorantAgent } from '../data/surveyData';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  Flame,
  Check,
  AlertCircle,
  Pizza,
  Wine,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import confetti from 'canvas-confetti';

interface SurveyViewProps {
  onComplete: (response: SurveyResponse) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<boolean>(false);
  const [allergies, setAllergies] = useState<AllergyType[]>(['none']);
  const [pizza, setPizza] = useState<PizzaType[]>(['pepperoni', '4cheese']);
  const [sushi, setSushi] = useState<SushiType[]>(['philadelphia']);
  const [snacks, setSnacks] = useState<SnackType[]>(['chips-nachos']);
  const [spice, setSpice] = useState<number>(2);
  const [avoid, setAvoid] = useState<AvoidType[]>(['none']);
  const [alcoholPref, setAlcoholPref] = useState<AlcoholPrefType>('light');
  const [alcoholTypes, setAlcoholTypes] = useState<AlcoholType[]>(['cider', 'beer-light']);
  const [softDrinks, setSoftDrinks] = useState<SoftDrinkType[]>(['cola', 'water']);
  const [desserts, setDesserts] = useState<DessertType[]>(['cake']);
  const [wishes, setWishes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const toggleMultiSelect = <T extends string>(
    currentList: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    value: T,
    noneValue: T
  ) => {
    if (value === noneValue) {
      setList([noneValue]);
      return;
    }

    let next = currentList.filter((item) => item !== noneValue);
    if (next.includes(value)) {
      next = next.filter((item) => item !== value);
      if (next.length === 0) next = [noneValue];
    } else {
      next.push(value);
    }
    setList(next);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!name.trim()) {
        setNameError(true);
        return;
      }
      setNameError(false);
    }

    if (step < 4) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setStep(1);
      setNameError(true);
      return;
    }

    setIsSubmitting(true);

    const tempResponse: Partial<SurveyResponse> = {
      name: name.trim(),
      allergies,
      pizza,
      sushi,
      snacks,
      spice,
      avoid,
      alcoholPref,
      alcoholTypes: alcoholPref === 'non-alc' ? [] : alcoholTypes,
      softDrinks,
      desserts,
      wishes: wishes.trim(),
    };

    const agent = determineValorantAgent(tempResponse);

    const fullResponse: SurveyResponse = {
      id: 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8),
      name: name.trim(),
      allergies,
      pizza,
      sushi,
      snacks,
      spice,
      avoid,
      alcoholPref,
      alcoholTypes: alcoholPref === 'non-alc' ? [] : alcoholTypes,
      softDrinks,
      desserts,
      wishes: wishes.trim(),
      agentId: agent.id,
      submittedAt: new Date().toISOString(),
    };

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EA580C', '#F97316', '#10B981', '#6366F1', '#EC4899'],
      });
    } catch (e) {}

    setTimeout(() => {
      onComplete(fullResponse);
      setIsSubmitting(false);
    }, 400);
  };

  const renderChip = (
    label: string,
    isActive: boolean,
    onClick: () => void,
    variant: 'default' | 'danger' | 'mint' = 'default',
    key?: React.Key
  ) => {
    let activeStyles = 'bg-orange-50 text-orange-950 border-orange-500 ring-1 ring-orange-500/30 font-semibold';
    if (variant === 'danger') {
      activeStyles = 'bg-rose-50 text-rose-950 border-rose-500 ring-1 ring-rose-500/30 font-semibold';
    } else if (variant === 'mint') {
      activeStyles = 'bg-emerald-50 text-emerald-950 border-emerald-500 ring-1 ring-emerald-500/30 font-semibold';
    }

    return (
      <button
        key={key}
        type="button"
        onClick={onClick}
        className={`min-h-[42px] px-3.5 py-2 rounded-xl border text-xs sm:text-sm transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer select-none whitespace-nowrap ${
          isActive
            ? activeStyles
            : 'bg-slate-50/80 hover:bg-slate-100/90 text-slate-700 border-slate-200/80 font-medium'
        }`}
      >
        {isActive && <Check size={14} className="shrink-0 stroke-[2.5]" />}
        <span>{label}</span>
      </button>
    );
  };

  const stepsMeta = [
    { num: 1, title: 'Гость', icon: <User size={14} /> },
    { num: 2, title: 'Еда', icon: <Pizza size={14} /> },
    { num: 3, title: 'Снеки', icon: <Flame size={14} /> },
    { num: 4, title: 'Бар', icon: <Wine size={14} /> },
  ];

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 pb-6">
      {/* Modern Stepper Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs font-semibold">
              Шаг {step} из 4
            </Badge>
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              {step === 1 && 'Знакомство и аллергии'}
              {step === 2 && 'Пицца и роллы'}
              {step === 3 && 'Закуски и острота'}
              {step === 4 && 'Барная карта и десерты'}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {step * 25}%
          </span>
        </div>

        <Progress value={step * 25} className="h-2" />

        {/* Step Tabs */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {stepsMeta.map((s) => {
            const isDone = s.num < step;
            const isCurrent = s.num === step;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num < step || (s.num === 2 && name.trim())) {
                    setStep(s.num);
                  }
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                  isCurrent
                    ? 'bg-orange-50 border border-orange-200 text-orange-700 font-semibold'
                    : isDone
                    ? 'bg-slate-50 border border-slate-200 text-slate-600'
                    : 'text-slate-400 opacity-60'
                }`}
              >
                <span>{isDone ? '✓' : s.num}</span>
                <span className="hidden xs:inline">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: NAME & ALLERGIES */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="w-full"
          >
            <Card className="p-5 sm:p-7 bg-white border border-slate-200/80 shadow-xs flex flex-col gap-6">
              <CardHeader className="p-0 pb-4 border-b border-slate-100">
                <CardTitle className="text-xl sm:text-2xl text-slate-900 flex items-center gap-2">
                  <span>👋</span> Как тебя зовут?
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1 text-slate-500">
                  Укажи имя или никнейм, чтобы мы зарезервировали твои любимые блюда:
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 flex flex-col gap-6">
                {/* Name Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Твоё имя или никнейм <span className="text-orange-600">*</span>
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (e.target.value.trim()) setNameError(false);
                    }}
                    placeholder="Например: Алина, Влад, MaxPower"
                    className={nameError ? 'border-red-500 ring-2 ring-red-500/20' : ''}
                    autoFocus
                  />
                  {nameError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-medium text-red-600 flex items-center gap-1 mt-0.5"
                    >
                      <AlertCircle size={14} /> Пожалуйста, укажи имя перед переходом к выбору блюд!
                    </motion.p>
                  )}
                </div>

                {/* Allergies / Diets */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert size={16} className="text-rose-600" />
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Есть аллергии или ограничения?
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        'none',
                        'nuts',
                        'seafood',
                        'lactose',
                        'gluten',
                        'vegetarian',
                        'citrus',
                        'mushrooms',
                      ] as AllergyType[]
                    ).map((alg) => {
                      const isActive = allergies.includes(alg);
                      const isNone = alg === 'none';
                      return renderChip(
                        LABELS.allergies[alg],
                        isActive,
                        () => toggleMultiSelect(allergies, setAllergies, alg, 'none'),
                        isNone ? 'default' : 'danger',
                        alg
                      );
                    })}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-0 pt-4 border-t border-slate-100">
                <Button
                  onClick={handleNextStep}
                  size="lg"
                  className="w-full text-sm sm:text-base font-semibold flex items-center justify-center gap-2 py-3 bg-orange-600 hover:bg-orange-700 shadow-sm"
                >
                  <span>Дальше: Пицца и роллы</span>
                  <ArrowRight size={18} />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* STEP 2: PIZZA & SUSHI */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="w-full"
          >
            <Card className="p-5 sm:p-7 bg-white border border-slate-200/80 shadow-xs flex flex-col gap-6">
              <CardHeader className="p-0 pb-4 border-b border-slate-100">
                <CardTitle className="text-xl sm:text-2xl text-slate-900 flex items-center gap-2">
                  <span>🍕</span> Пицца, суши и роллы
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1 text-slate-500">
                  Выбирай всё, что с удовольствием съешь на празднике:
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 flex flex-col gap-6">
                {/* Pizza */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    🍕 Любимая пицца:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        'pepperoni',
                        '4cheese',
                        'meat',
                        'margarita',
                        'bbq',
                        'mushrooms',
                        'hawaii',
                        'seafood-p',
                        'truffle',
                        'no-pizza',
                      ] as PizzaType[]
                    ).map((p) => {
                      const isActive = pizza.includes(p);
                      return renderChip(
                        LABELS.pizza[p],
                        isActive,
                        () => toggleMultiSelect(pizza, setPizza, p, 'no-pizza'),
                        'default',
                        p
                      );
                    })}
                  </div>
                </div>

                {/* Sushi */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    🍣 Роллы и сеты:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        'philadelphia',
                        'california',
                        'baked',
                        'tempura',
                        'unagi',
                        'spicy',
                        'veggie-sushi',
                        'no-sushi',
                      ] as SushiType[]
                    ).map((s) => {
                      const isActive = sushi.includes(s);
                      return renderChip(
                        LABELS.sushi[s],
                        isActive,
                        () => toggleMultiSelect(sushi, setSushi, s, 'no-sushi'),
                        'default',
                        s
                      );
                    })}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-0 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handlePrevStep} className="w-full text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 py-2.5">
                  <ArrowLeft size={16} />
                  <span>Назад</span>
                </Button>
                <Button onClick={handleNextStep} className="w-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 py-2.5 bg-orange-600 hover:bg-orange-700">
                  <span>Снеки и острота</span>
                  <ArrowRight size={16} />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* STEP 3: SNACKS, SPICE & STOP-LIST */}
        {step === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="w-full"
          >
            <Card className="p-5 sm:p-7 bg-white border border-slate-200/80 shadow-xs flex flex-col gap-6">
              <CardHeader className="p-0 pb-4 border-b border-slate-100">
                <CardTitle className="text-xl sm:text-2xl text-slate-900 flex items-center gap-2">
                  <span>🍟</span> Закуски, острота и стоп-лист
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1 text-slate-500">
                  Что поставить поближе к дивану, а чего избегать:
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 flex flex-col gap-6">
                {/* Snacks */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    🍟 Снеки к столу:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        'chips-nachos',
                        'nuggets',
                        'cheese-plate',
                        'meat-cuts',
                        'veggies',
                        'nuts',
                        'garlic-bread',
                        'fries',
                        'wings',
                      ] as SnackType[]
                    ).map((snk) => {
                      const isActive = snacks.includes(snk);
                      return renderChip(
                        LABELS.snacks[snk],
                        isActive,
                        () => {
                          if (isActive) {
                            setSnacks(snacks.filter((s) => s !== snk));
                          } else {
                            setSnacks([...snacks, snk]);
                          }
                        },
                        'default',
                        snk
                      );
                    })}
                  </div>
                </div>

                {/* Spice Level Segmented Cards */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1.5">
                    <Flame size={16} className="text-orange-600" />
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Уровень остроты:
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((lvl) => {
                      const isSelected = spice === lvl;
                      const info = SPICE_LEVELS[lvl];
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSpice(lvl)}
                          className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer select-none ${
                            isSelected
                              ? 'bg-orange-50 border-orange-500 ring-1 ring-orange-500/30'
                              : 'bg-slate-50/70 hover:bg-slate-100/90 border-slate-200/80 text-slate-700'
                          }`}
                        >
                          <span className="text-lg">{info.emoji}</span>
                          <span className="text-xs font-bold text-slate-900 leading-tight">
                            {info.title}
                          </span>
                          <span className="text-[10px] text-slate-500 leading-tight line-clamp-2">
                            {info.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stop List */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    🚫 Стоп-лист (чего ТОЧНО не должно быть):
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        'none',
                        'pineapple',
                        'cilantro',
                        'super-spicy',
                        'onion-garlic',
                        'mayo',
                        'olives',
                        'fatty-meat',
                      ] as AvoidType[]
                    ).map((av) => {
                      const isActive = avoid.includes(av);
                      const isNone = av === 'none';
                      return renderChip(
                        LABELS.avoid[av],
                        isActive,
                        () => toggleMultiSelect(avoid, setAvoid, av, 'none'),
                        isNone ? 'default' : 'danger',
                        av
                      );
                    })}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-0 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handlePrevStep} className="w-full text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 py-2.5">
                  <ArrowLeft size={16} />
                  <span>Назад</span>
                </Button>
                <Button onClick={handleNextStep} className="w-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 py-2.5 bg-orange-600 hover:bg-orange-700">
                  <span>Бар и напитки</span>
                  <ArrowRight size={16} />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* STEP 4: BAR, DESSERTS & WISHES */}
        {step === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="w-full"
          >
            <Card className="p-5 sm:p-7 bg-white border border-slate-200/80 shadow-xs flex flex-col gap-6">
              <CardHeader className="p-0 pb-4 border-b border-slate-100">
                <CardTitle className="text-xl sm:text-2xl text-slate-900 flex items-center gap-2">
                  <span>🍸</span> Барная карта и десерты
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1 text-slate-500">
                  Финальный штрих для атмосферного вечера:
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 flex flex-col gap-6">
                {/* Alcohol Pref Format */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    🍾 Твой формат напитков:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(['alcohol', 'light', 'non-alc'] as AlcoholPrefType[]).map((pref) => {
                      const isActive = alcoholPref === pref;
                      return renderChip(
                        LABELS.alcoholPref[pref],
                        isActive,
                        () => setAlcoholPref(pref),
                        'default',
                        pref
                      );
                    })}
                  </div>
                </div>

                {/* Alcohol Types */}
                {alcoholPref !== 'non-alc' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-3 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4"
                  >
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      🍸 Что налить в бокал?
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          'prosecco',
                          'white-wine',
                          'red-wine',
                          'cider',
                          'beer-light',
                          'beer-craft',
                          'gin',
                          'cocktails',
                          'whiskey',
                          'rum',
                          'shots',
                          'tequila',
                        ] as AlcoholType[]
                      ).map((alc) => {
                        const isActive = alcoholTypes.includes(alc);
                        return renderChip(
                          LABELS.alcoholTypes[alc],
                          isActive,
                          () => {
                            if (isActive) {
                              setAlcoholTypes(alcoholTypes.filter((a) => a !== alc));
                            } else {
                              setAlcoholTypes([...alcoholTypes, alc]);
                            }
                          },
                          'default',
                          alc
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Soft Drinks */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    🧃 Безалкогольные напитки:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        'cola',
                        'cola-zero',
                        'juice',
                        'energy',
                        'water',
                        'lemonade',
                        'beer-noalc',
                        'tonic',
                      ] as SoftDrinkType[]
                    ).map((drk) => {
                      const isActive = softDrinks.includes(drk);
                      return renderChip(
                        LABELS.softDrinks[drk],
                        isActive,
                        () => {
                          if (isActive) {
                            setSoftDrinks(softDrinks.filter((d) => d !== drk));
                          } else {
                            setSoftDrinks([...softDrinks, drk]);
                          }
                        },
                        'mint',
                        drk
                      );
                    })}
                  </div>
                </div>

                {/* Desserts */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    🍰 Сладкое и десерты:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(
                      ['cake', 'icecream', 'fruits', 'cupcakes', 'eclairs', 'none'] as DessertType[]
                    ).map((dst) => {
                      const isActive = desserts.includes(dst);
                      return renderChip(
                        LABELS.desserts[dst],
                        isActive,
                        () => toggleMultiSelect(desserts, setDesserts, dst, 'none'),
                        'default',
                        dst
                      );
                    })}
                  </div>
                </div>

                {/* Wishes */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    💬 Пожелания имениннику или по заказу:
                  </label>
                  <Textarea
                    value={wishes}
                    onChange={(e) => setWishes(e.target.value)}
                    placeholder="Любимый соус, трек для плейлиста или просто тёплые слова..."
                    className="h-20"
                  />
                </div>
              </CardContent>

              <CardFooter className="p-0 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handlePrevStep} className="w-full text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 py-2.5">
                  <ArrowLeft size={16} />
                  <span>Назад</span>
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white shadow-sm"
                >
                  <Sparkles size={16} className={isSubmitting ? 'animate-spin' : ''} />
                  <span>{isSubmitting ? 'Сохраняем...' : 'Отправить'}</span>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
