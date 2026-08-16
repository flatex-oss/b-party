import React from 'react';
import { ActiveTab } from '../types';
import { PieChart, ClipboardList, Calculator, PartyPopper, Cloud, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { User, loginWithGoogle, logoutUser } from '../lib/firebase';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  guestCount: number;
  user: User | null;
  isCloudSyncing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  guestCount,
  user,
  isCloudSyncing,
}) => {
  const handleAuthAction = async () => {
    if (user) {
      if (window.confirm(`Выйти из аккаунта ${user.displayName || user.email}?`)) {
        await logoutUser();
      }
    } else {
      try {
        await loginWithGoogle();
      } catch (err) {
        console.error('Google login error:', err);
      }
    }
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: 'Главная', icon: <PartyPopper size={16} /> },
    { id: 'survey', label: 'Опрос', icon: <ClipboardList size={16} /> },
    { id: 'analytics', label: 'Сводка', icon: <PieChart size={16} /> },
    { id: 'calculator', label: 'Расчёт', icon: <Calculator size={16} /> },
  ];

  return (
    <header className="w-full flex flex-col gap-3">
      {/* Top Bar: Brand, Live Cloud Status, Auth */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 cursor-pointer select-none text-left focus:outline-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
            🎂
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-sm sm:text-base font-bold text-slate-900 leading-tight tracking-tight">
              Вкусняхи<span className="text-orange-600">.</span>
            </span>
            <span className="text-[11px] font-medium text-slate-400 leading-none hidden xs:inline">
              Меню & опрос на ДР
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {/* Live Sync Status Badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200/70 rounded-lg text-xs font-medium text-slate-600"
            title="Синхронизация ответов гостей через Firebase Firestore"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isCloudSyncing ? 'bg-orange-400 opacity-75' : 'bg-emerald-400 opacity-75'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isCloudSyncing ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className="hidden xs:inline text-slate-500">Гостей:</span>
            <span className="font-semibold text-slate-900">{guestCount}</span>
          </div>

          {/* User Auth Action */}
          <button
            type="button"
            onClick={handleAuthAction}
            title={user ? `Вы вошли как ${user.displayName || user.email}` : 'Войти через Google'}
            className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer select-none transition-all"
          >
            {user ? (
              <>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Avatar'}
                    className="w-4 h-4 rounded-full"
                  />
                ) : (
                  <UserIcon size={13} className="text-slate-500" />
                )}
                <span className="max-w-[70px] sm:max-w-[100px] truncate">
                  {user.displayName?.split(' ')[0] || 'Профиль'}
                </span>
                <LogOut size={12} className="text-slate-400 hover:text-red-500 ml-0.5" />
              </>
            ) : (
              <>
                <LogIn size={13} className="text-slate-500" />
                <span>Войти</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modern Segmented Navigation Tabs */}
      <nav className="p-1 bg-slate-200/60 rounded-xl flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`relative flex-1 py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none ${
                isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavSegment"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs"
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
  );
};
