import React, { useState } from 'react';
import { ActiveTab } from '../types';
import {
  PieChart,
  ClipboardList,
  Calculator,
  PartyPopper,
  LogIn,
  LogOut,
  User as UserIcon,
  Copy,
  Check,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import {
  UserProfile,
  loginWithGoogle,
  logoutUser,
  saveLocalUserProfile,
} from '../lib/firebase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion } from 'motion/react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  guestCount: number;
  user: UserProfile | null;
  onUserChange?: (user: UserProfile | null) => void;
  isCloudSyncing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  guestCount,
  user,
  onUserChange,
  isCloudSyncing,
}) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [guestNameInput, setGuestNameInput] = useState('');
  const [authError, setAuthError] = useState<{
    code?: string;
    message?: string;
    isUnauthorizedDomain?: boolean;
    domain?: string;
  } | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const currentDomain =
    typeof window !== 'undefined' ? window.location.hostname : 'ais-dev-...run.app';

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const res = await loginWithGoogle();
      if (res.user) {
        const profile: UserProfile = {
          uid: res.user.uid,
          displayName: res.user.displayName,
          email: res.user.email,
          photoURL: res.user.photoURL,
          isGuest: false,
        };
        onUserChange?.(profile);
        setIsAuthOpen(false);
      } else if (res.isUnauthorizedDomain) {
        setAuthError({
          isUnauthorizedDomain: true,
          domain: res.currentDomain || currentDomain,
          message: 'Домен среды разработки пока не добавлен в Authorized Domains Firebase.',
        });
      } else if (res.error) {
        setAuthError({
          isUnauthorizedDomain: false,
          domain: currentDomain,
          message: res.error,
        });
      }
    } catch (err: any) {
      setAuthError({
        isUnauthorizedDomain: false,
        domain: currentDomain,
        message: err?.message || 'Не удалось выполнить вход через Google.',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGuestSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestNameInput.trim()) return;

    const guestProfile: UserProfile = {
      uid: 'guest-' + Date.now(),
      displayName: guestNameInput.trim(),
      email: null,
      photoURL: null,
      isGuest: true,
    };
    saveLocalUserProfile(guestProfile);
    onUserChange?.(guestProfile);
    setIsAuthOpen(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    onUserChange?.(null);
    setIsAuthOpen(false);
  };

  const copyDomainToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentDomain);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    } catch {
      // Fallback
    }
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: 'Главная', icon: <PartyPopper size={16} /> },
    { id: 'survey', label: 'Опрос', icon: <ClipboardList size={16} /> },
    { id: 'analytics', label: 'Сводка', icon: <PieChart size={16} /> },
    { id: 'calculator', label: 'Расчёт', icon: <Calculator size={16} /> },
  ];

  return (
    <>
      <header className="w-full flex flex-col gap-3.5">
        {/* Top Bar: Brand, Live Cloud Status, Auth */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 sm:py-3.5 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer select-none text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
              🎂
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-base sm:text-lg font-bold text-slate-900 leading-tight tracking-tight">
                Вкусняхи<span className="text-orange-600">.</span>
              </span>
              <span className="text-xs font-medium text-slate-400 leading-none hidden xs:inline">
                Меню & опрос на праздник
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2.5">
            {/* Live Sync Status Badge */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-600 shadow-2xs"
              title="Синхронизация ответов гостей через Firebase Firestore"
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                    isCloudSyncing ? 'bg-orange-400 opacity-75' : 'bg-emerald-400 opacity-75'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isCloudSyncing ? 'bg-orange-500' : 'bg-emerald-500'
                  }`}
                />
              </span>
              <span className="hidden xs:inline text-slate-500">Гостей:</span>
              <span className="font-bold text-slate-900">{guestCount}</span>
            </div>

            {/* User Auth Trigger */}
            <button
              type="button"
              onClick={() => {
                setGuestNameInput(user?.displayName || '');
                setIsAuthOpen(true);
              }}
              title={
                user
                  ? `Профиль: ${user.displayName || user.email || 'Гость'}`
                  : 'Войти / Указать имя'
              }
              className="h-9 px-3 sm:px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs shadow-2xs flex items-center gap-2 cursor-pointer select-none transition-all"
            >
              {user ? (
                <>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Avatar'}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon size={14} className="text-orange-500" />
                  )}
                  <span className="max-w-[75px] sm:max-w-[110px] truncate font-semibold text-slate-800">
                    {user.displayName?.split(' ')[0] || 'Гость'}
                  </span>
                  {user.isGuest && (
                    <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500">
                      гость
                    </span>
                  )}
                </>
              ) : (
                <>
                  <LogIn size={14} className="text-slate-500" />
                  <span className="font-medium">Войти</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modern Segmented Navigation Tabs */}
        <nav className="p-1.5 bg-slate-200/70 border border-slate-300/40 rounded-2xl flex items-center gap-1.5 shadow-2xs">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`relative flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none ${
                  isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavSegment"
                    className="absolute inset-0 bg-white rounded-xl shadow-xs"
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  />
                )}
                <span className="relative z-10 shrink-0 text-slate-700">{item.icon}</span>
                <span className="relative z-10 whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Authentication & Profile Modal */}
      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-base">
                👤
              </span>
              {user ? 'Профиль участника' : 'Вход в приложение'}
            </DialogTitle>
            <DialogDescription>
              {user
                ? 'Вы можете переключить профиль или указать другое имя для опроса.'
                : 'Войдите через Google или укажите имя гостя для заполнения праздничного меню.'}
            </DialogDescription>
          </DialogHeader>

          {/* Current Logged In State */}
          {user ? (
            <div className="flex flex-col gap-4 py-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Avatar'}
                      className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                      {user.displayName?.charAt(0).toUpperCase() || 'Г'}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">
                      {user.displayName || 'Гость без имени'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {user.email || (user.isGuest ? 'Гостевой профиль' : 'Firebase аккаунт')}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                  <ShieldCheck size={12} /> Активен
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut size={14} className="mr-1.5" />
                  Выйти из профиля
                </Button>
                <Button variant="default" onClick={() => setIsAuthOpen(false)} className="flex-1">
                  Готово
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-1">
              {/* Google Login Option */}
              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="w-full h-11 border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-2.5 text-sm font-semibold text-slate-800 shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                {isLoggingIn ? 'Подключение...' : 'Войти с аккаунтом Google'}
              </Button>

              {/* Notice when auth/unauthorized-domain occurs */}
              {authError?.isUnauthorizedDomain && (
                <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex flex-col gap-2.5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-950 block">
                        Требуется добавить домен в Firebase Console
                      </span>
                      <span>
                        Firebase Auth требует добавить адрес среды в список разрешённых доменов:
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-amber-200/80 font-mono text-[11px] text-slate-700">
                    <span className="truncate">{currentDomain}</span>
                    <button
                      type="button"
                      onClick={copyDomainToClipboard}
                      className="shrink-0 flex items-center gap-1 px-2 py-1 bg-amber-100/70 hover:bg-amber-200 text-amber-900 rounded font-sans text-xs font-semibold cursor-pointer transition-colors"
                    >
                      {copiedDomain ? (
                        <>
                          <Check size={12} className="text-emerald-600" />
                          <span>Скопировано</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Скопировать</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    💡 <strong>Инструкция:</strong> Откройте Firebase Console → <em>Authentication</em> →{' '}
                    <em>Settings</em> → <em>Authorized domains</em> → вставьте скопированный домен. Либо используйте быстрый вход по имени ниже:
                  </p>
                </div>
              )}

              {/* Standard error notice if any other failure */}
              {authError && !authError.isUnauthorizedDomain && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-red-500 shrink-0" />
                  <span>{authError.message}</span>
                </div>
              )}

              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2.5 text-slate-400 font-medium">
                    или укажите имя для опроса
                  </span>
                </div>
              </div>

              {/* Fast Guest Profile Input */}
              <form onSubmit={handleGuestSave} className="flex flex-col gap-2.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Ваше имя или никнейм
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Например: Ксения (Именинница)"
                      value={guestNameInput}
                      onChange={(e) => setGuestNameInput(e.target.value)}
                      maxLength={50}
                      className="text-xs sm:text-sm h-10"
                    />
                    <Button
                      type="submit"
                      disabled={!guestNameInput.trim()}
                      className="h-10 px-4 shrink-0 font-semibold"
                    >
                      <UserCheck size={14} className="mr-1.5" />
                      Сохранить
                    </Button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Имя будет автоматически подставляться в форму опроса и при подсчёте гостей.
                </p>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
