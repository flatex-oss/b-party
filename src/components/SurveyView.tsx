import React, { useState } from 'react';
import {
  SurveyResponse,
  ActiveTab,
  FoodFormatType,
  RestaurantDishType,
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
  UtensilsCrossed,
  ChefHat,
  Truck,
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
  defaultName?: string;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ onComplete, defaultName }) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>(defaultName || '');
  const [nameError, setNameError] = useState<boolean>(false);
  const [foodFormat, setFoodFormat] = useState<FoodFormatType>('both');
  const [restaurantDishes, setRestaurantDishes] = useState<RestaurantDishType[]>([
    'steak-meat',
    'pasta-risotto',
    'bruschetta-tapas',
  ]);
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
      foodFormat,
      restaurantDishes: foodFormat !== 'delivery' ? restaurantDishes : [],
      allergies,
      pizza: foodFormat !== 'restaurant' ? pizza : ['no-pizza'],
      sushi: foodFormat !== 'restaurant' ? sushi : ['no-sushi'],
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
      foodFormat,
      restaurantDishes: foodFormat !== 'delivery' ? restaurantDishes : [],
      allergies,
      pizza: foodFormat !== 'restaurant' ? pizza : ['no-pizza'],
      sushi: foodFormat !== 'restaurant' ? sushi : ['no-sushi'],
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
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#EA580C', '#F97316', '#10B981', '#6366F1', '#EC4899'],
      });
    } catch (e) {}

    setTimeout(() => {
      onComplete(fullResponse);
      setIsSubmitting(false);
    }, 300);
  };

  const renderChip = (
    label: string,
    isActive: boolean,
    onClick: () => void,
    variant: 'default' | 'danger' | 'mint' = 'default',
    key?: React.Key
  ) => {
    let activeStyles =
      'bg-orange-50/90 text-orange-950 border-orange-500 ring-2 ring-orange-500/20 font-bold shadow-xs';
    if (variant === 'danger') {
      activeStyles =
        'bg-rose-50/90 text-rose-950 border-rose-500 ring-2 ring-rose-500/20 font-bold shadow-xs';
    } else if (variant === 'mint') {
      activeStyles =
        'bg-emerald-50/90 text-emerald-950 border-emerald-500 ring-2 ring-emerald-500/20 font-bold shadow-xs';
    }

    return (
      <button
        key={key}
        type="button"
        onClick={onClick}
        className={`min-h-[44px] px-4 py-2.5 rounded-xl border text-xs sm:text-sm leading-snug transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer select-none text-left active:scale-[0.98] ${
          isActive
            ? activeStyles
            : 'bg-slate-50/80 hover:bg-slate-100/90 text-slate-700 border-slate-200/80 font-medium'
        }`}
      >
        {isActive && <Check size={15} className="shrink-0 stroke-[2.5]" />}
        <span>{label}</span>
      </button>
    );
  };

  const stepsMeta = [
    { num: 1, title: 'Формат', icon: <User size={14} /> },
    { num: 2, title: 'Блюда', icon: <UtensilsCrossed size={14} /> },
    { num: 3, title: 'Снеки', icon: <Flame size={14} /> },
    { num: 4, title: 'Бар', icon: <Wine size={14} /> },
  ];

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-8 pb-6">
      {/* Modern Stepper Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Badge variant="default" className="text-xs font-semibold px-2.5 py-1">
              Шаг {step} из 4
            </Badge>
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {step === 1 && 'Имя и формат меню'}
              {step === 2 && 'Выбор блюд и рецептов'}
              {step === 3 && 'Закуски и острота'}
              {step === 4 && 'Барная карта и десерты'}
            </span>
          </div>
          <span className="text-xs font-extrabold text-slate-400">
            {step * 25}%
          </span>
        </div>

        <Progress value={step * 25} className="h-2.5" />

        {/* Step Tabs */}
        <div className="grid grid-cols-4 gap-2 pt-1">
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
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  isCurrent
                    ? 'bg-orange-50 border border-orange-200 text-orange-700 shadow-2xs'
                    : isDone
                    ? 'bg-slate-50 border border-slate-200/80 text-slate-700'
                    : 'text-slate-400 opacity-60 hover:opacity-80'
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
        {/* STEP 1: NAME, FOOD FORMAT & ALLERGIES */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="w-full"
          >
            <Card className="p-6 sm:p-8 bg-white border border-slate-200/80 shadow-xs flex flex-col gap-7 sm:gap-8">
              <CardHeader className="p-0 pb-5 border-b border-slate-100 flex flex-col gap-1.5">
                <CardTitle className="text-xl sm:text-2xl text-slate-900 flex items-center gap-2.5">
                  <span>👋</span> Твоё имя и формат стола
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Укажи имя и выбери, какой формат еды для праздника тебе ближе:
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 flex flex-col gap-7 sm:gap-8">
                {/* Name Input */}
                <div className="flex flex-col gap-2.5">
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
                    className={`h-12 text-sm sm:text-base px-4 ${nameError ? 'border-red-500 ring-2 ring-red-500/20' : ''}`}
                    autoFocus
                  />
                  {nameError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-semibold text-red-600 flex items-center gap-1.5 mt-1"
                    >
                      <AlertCircle size={15} /> Пожалуйста, укажи имя перед переходом к выбору блюд!
                    </motion.p>
                  )}
                </div>

                {/* Food Format Main Selector */}
                <div className="flex flex-col gap-3.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    🍽️ Основной формат меню на вечер:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* Restaurant Style */}
                    <button
                      type="button"
                      onClick={() => setFoodFormat('restaurant')}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer select-none ${
                        foodFormat === 'restaurant'
                          ? 'bg-orange-50/90 border-orange-500 ring-2 ring-orange-500/20 shadow-xs'
                          : 'bg-slate-50/80 hover:bg-slate-100/90 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-orange-100/80 text-orange-700 flex items-center justify-center font-bold">
                          <ChefHat size={20} />
                        </div>
                        {foodFormat === 'restaurant' && (
                          <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center">
                            <Check size={13} className="stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Домашний ресторан</div>
                        <div className="text-xs text-slate-500 leading-relaxed mt-0.5">
                          Блюда по ресторанным рецептам: сочные стейки, авторская паста, тапас, салаты
                        </div>
                      </div>
                    </button>

                    {/* Delivery Style */}
                    <button
                      type="button"
                      onClick={() => setFoodFormat('delivery')}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer select-none ${
                        foodFormat === 'delivery'
                          ? 'bg-orange-50/90 border-orange-500 ring-2 ring-orange-500/20 shadow-xs'
                          : 'bg-slate-50/80 hover:bg-slate-100/90 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center font-bold">
                          <Truck size={20} />
                        </div>
                        {foodFormat === 'delivery' && (
                          <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center">
                            <Check size={13} className="stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Пицца и роллы</div>
                        <div className="text-xs text-slate-500 leading-relaxed mt-0.5">
                          Классическая быстрая доставка: горячая пицца, сеты суши и роллов, снеки
                        </div>
                      </div>
                    </button>

                    {/* Both Styles */}
                    <button
                      type="button"
                      onClick={() => setFoodFormat('both')}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer select-none ${
                        foodFormat === 'both'
                          ? 'bg-orange-50/90 border-orange-500 ring-2 ring-orange-500/20 shadow-xs'
                          : 'bg-slate-50/80 hover:bg-slate-100/90 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center font-bold">
                          <Sparkles size={20} />
                        </div>
                        {foodFormat === 'both' && (
                          <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center">
                            <Check size={13} className="stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">И то, и другое</div>
                        <div className="text-xs text-slate-500 leading-relaxed mt-0.5">
                          Комбо-формат: и изысканные домашние блюда, и любимая пицца с роллами
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Allergies / Diets */}
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={18} className="text-rose-600" />
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Есть аллергии или ограничения?
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5 sm:gap-3">
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

              <CardFooter className="p-0 pt-6 border-t border-slate-100">
                <Button
                  onClick={handleNextStep}
                  size="lg"
                  className="w-full h-12 text-sm sm:text-base font-semibold flex items-center justify-center gap-2.5 bg-orange-600 hover:bg-orange-700 shadow-sm"
                >
                  <span>Дальше: Выбор блюд</span>
                  <ArrowRight size={18} />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* STEP 2: RESTAURANT DISHES / PIZZA & SUSHI */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="w-full"
          >
            <Card className="p-6 sm:p-8 bg-white border border-slate-200/80 shadow-xs flex flex-col gap-7 sm:gap-8">
              <CardHeader className="p-0 pb-5 border-b border-slate-100 flex flex-col gap-1.5">
                <CardTitle className="text-xl sm:text-2xl text-slate-900 flex items-center gap-2.5">
                  <span>🍽️</span> Выбор блюд для стола
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Отметь всё, что с удовольствием попробуешь на празднике:
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 flex flex-col gap-7 sm:gap-8">
                {/* SECTION 1: RESTAURANT RECIPES (if chosen) */}
                {(foodFormat === 'restaurant' || foodFormat === 'both') && (
                  <div className="flex flex-col gap-3.5 bg-orange-50/40 border border-orange-100 rounded-2xl p-5">
                    <div className="flex items-center gap-2">
                      <ChefHat size={18} className="text-orange-600" />
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        👨‍🍳 Блюда уровня ресторана (домашний шеф):
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2.5 sm:gap-3">
                      {(
                        [
                          'steak-meat',
                          'pasta-risotto',
                          'bruschetta-tapas',
                          'gourmet-salads',
                          'baked-fish',
                          'truffle-dishes',
                          'baked-veggies',
                        ] as RestaurantDishType[]
                      ).map((dish) => {
                        const isActive = restaurantDishes.includes(dish);
                        return renderChip(
                          LABELS.restaurantDishes[dish],
                          isActive,
                          () => {
                            if (isActive) {
                              setRestaurantDishes(restaurantDishes.filter((d) => d !== dish));
                            } else {
                              setRestaurantDishes([...restaurantDishes, dish]);
                            }
                          },
                          'default',
                          dish
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SECTION 2: PIZZA (if delivery/both) */}
                {(foodFormat === 'delivery' || foodFormat === 'both') && (
                  <div className="flex flex-col gap-3.5">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      🍕 Любимая пицца:
                    </h3>
                    <div className="flex flex-wrap gap-2.5 sm:gap-3">
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
                )}

                {/* SECTION 3: SUSHI & ROLLS (if delivery/both) */}
                {(foodFormat === 'delivery' || foodFormat === 'both') && (
                  <div className="flex flex-col gap-3.5">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      🍣 Сеты роллов и суши:
                    </h3>
                    <div className="flex flex-wrap gap-2.5 sm:gap-3">
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
                )}
              </CardContent>

              <CardFooter className="p-0 pt-6 border-t border-slate-100 grid grid-cols-2 gap-3.5">
                <Button variant="outline" onClick={handlePrevStep} className="h-11 sm:h-12 w-full text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
                  <ArrowLeft size={16} />
                  <span>Назад</span>
                </Button>
                <Button onClick={handleNextStep} className="h-11 sm:h-12 w-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-sm">
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
            <Card className="p-6 sm:p-8 bg-white border border-slate-200/80 shadow-xs flex flex-col gap-7 sm:gap-8">
              <CardHeader className="p-0 pb-5 border-b border-slate-100 flex flex-col gap-1.5">
                <CardTitle className="text-xl sm:text-2xl text-slate-900 flex items-center gap-2.5">
                  <span>🍟</span> Закуски, острота и стоп-лист
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Что поставить к столу и чего категорически избегать:
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 flex flex-col gap-7 sm:gap-8">
                {/* Snacks */}
                <div className="flex flex-col gap-3.5">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    🍟 Снеки и закуски:
                  </h3>
                  <div className="flex flex-wrap gap-2.5 sm:gap-3">
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
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-center gap-2">
                    <Flame size={18} className="text-orange-600" />
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Уровень остроты:
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[1, 2, 3, 4, 5].map((lvl) => {
                      const isSelected = spice === lvl;
                      const info = SPICE_LEVELS[lvl];
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSpice(lvl)}
                          className={`p-3 sm:p-4 rounded-xl border text-center flex flex-col items-center justify-between min-h-[96px] gap-1.5 transition-all cursor-pointer select-none ${
                            isSelected
                              ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20 shadow-2xs font-bold'
                              : 'bg-slate-50/70 hover:bg-slate-100/90 border-slate-200/80 text-slate-700'
                          }`}
                        >
                          <span className="text-2xl sm:text-3xl">{info.emoji}</span>
                          <span className="text-xs font-bold text-slate-900 leading-tight">
                            {info.title}
                          </span>
                          <span className="text-[10px] text-slate-500 leading-tight">
                            {info.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stop List */}
                <div className="flex flex-col gap-3.5">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    🚫 Стоп-лист (чего ТОЧНО не должно быть в твоей порции):
                  </h3>
                  <div className="flex flex-wrap gap-2.5 sm:gap-3">
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

              <CardFooter className="p-0 pt-6 border-t border-slate-100 grid grid-cols-2 gap-3.5">
                <Button variant="outline" onClick={handlePrevStep} className="h-11 sm:h-12 w-full text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
                  <ArrowLeft size={16} />
                  <span>Назад</span>
                </Button>
                <Button onClick={handleNextStep} className="h-11 sm:h-12 w-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-sm">
                  <span>Бар и десерты</span>
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
            <Card className="p-6 sm:p-8 bg-white border border-slate-200/80 shadow-xs flex flex-col gap-7 sm:gap-8">
              <CardHeader className="p-0 pb-5 border-b border-slate-100 flex flex-col gap-1.5">
                <CardTitle className="text-xl sm:text-2xl text-slate-900 flex items-center gap-2.5">
                  <span>🍸</span> Барная карта и десерты
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Финальный штрих для отличного вечера:
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 flex flex-col gap-7 sm:gap-8">
                {/* Alcohol Pref Format */}
                <div className="flex flex-col gap-3.5">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    🍾 Твой формат напитков:
                  </h3>
                  <div className="flex flex-wrap gap-2.5 sm:gap-3">
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
                    className="flex flex-col gap-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5"
                  >
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      🍸 Что налить в бокал:
                    </h3>
                    <div className="flex flex-wrap gap-2.5 sm:gap-3">
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
                <div className="flex flex-col gap-3.5">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    🧃 Безалкогольные напитки:
                  </h3>
                  <div className="flex flex-wrap gap-2.5 sm:gap-3">
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
                <div className="flex flex-col gap-3.5">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    🍰 Сладкое и десерты:
                  </h3>
                  <div className="flex flex-wrap gap-2.5 sm:gap-3">
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
                <div className="flex flex-col gap-2.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    💬 Пожелания имениннику или комментарий:
                  </label>
                  <Textarea
                    value={wishes}
                    onChange={(e) => setWishes(e.target.value)}
                    placeholder="Любимый соус, трек для плейлиста или просто тёплые слова..."
                    className="h-24 p-3.5 text-sm"
                  />
                </div>
              </CardContent>

              <CardFooter className="p-0 pt-6 border-t border-slate-100 grid grid-cols-2 gap-3.5">
                <Button variant="outline" onClick={handlePrevStep} className="h-11 sm:h-12 w-full text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
                  <ArrowLeft size={16} />
                  <span>Назад</span>
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="h-11 sm:h-12 w-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-sm"
                >
                  <Sparkles size={17} className={isSubmitting ? 'animate-spin' : ''} />
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
