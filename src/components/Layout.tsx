import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Dumbbell, Calendar,
  Trophy, Menu, X, Sun, Moon, Home,
  Sparkles, Apple, Pill, Zap, FileText
} from 'lucide-react';
import { useState } from 'react';
import { getPersianDate } from '../utils/jalali';
import { APP_VERSION } from '../version';
import { useTheme } from '../context/ThemeContext';
import { FEATURE_FLAGS } from '../engine/version';

const mainItems = [
  { path: '/', label: 'داشبورد', icon: LayoutDashboard },
  { path: '/programs', label: 'برنامه‌های من', icon: Dumbbell },
  { path: '/history', label: 'تاریخچه تمرینات', icon: FileText },
  { path: '/calendar', label: 'تقویم', icon: Calendar },
  { path: '/progress', label: 'پیشرفت', icon: Trophy },
  { path: '/profile', label: 'پروفایل', icon: User },
];

const generatorItems = [
  { path: '/generate/workout', label: 'برنامه تمرینی', icon: Dumbbell, enabled: FEATURE_FLAGS.offlineWorkout },
  { path: '/generate/nutrition', label: 'برنامه تغذیه', icon: Apple, enabled: FEATURE_FLAGS.offlineNutrition },
  { path: '/generate/supplement', label: 'برنامه مکمل', icon: Pill, enabled: FEATURE_FLAGS.offlineSupplements },
  { path: '/generate/compact', label: 'برنامه فشرده', icon: Zap, enabled: FEATURE_FLAGS.compactWorkout },
];

const bottomNavItems = [
  { path: '/', label: 'داشبورد', icon: Home },
  { path: '/programs', label: 'برنامه‌ها', icon: Dumbbell },
  { path: '/generate/workout', label: 'تولید', icon: Sparkles },
  { path: '/history', label: 'تاریخچه', icon: FileText },
  { path: '/progress', label: 'پیشرفت', icon: Trophy },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const renderNavItem = (item: any, compact: boolean) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path ||
      (item.path !== '/' && location.pathname.startsWith(item.path));
    const isDisabled = item.enabled === false;

    return (
      <button
        key={item.path}
        onClick={() => {
          if (isDisabled) {
            alert(`${item.label} به‌زودی در دسترس خواهد بود!`);
            return;
          }
          navigate(item.path);
          if (compact) setMenuOpen(false);
        }}
        disabled={isDisabled}
        className={`flex items-center gap-3 rounded-xl text-sm transition-all ${
          compact ? 'px-4 py-3.5' : 'px-4 py-3'
        } ${
          isActive
            ? isDark ? 'bg-[#d4af37]/15 text-[#d4af37] font-bold' : 'bg-[#a78bfa]/15 text-[#8b5cf6] font-bold'
            : isDisabled
            ? isDark ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
            : isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-[#7c3aed]/70 hover:text-[#8b5cf6] hover:bg-[#f5f3ff]'
        }`}
      >
        <Icon size={compact ? 20 : 18} />
        <span className="flex-1 text-right">{item.label}</span>
        {isDisabled && (
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
            isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-500'
          }`}>
            به‌زودی
          </span>
        )}
      </button>
    );
  };

  return (
    <div className={'min-h-screen flex flex-col theme-transition ' + (
      isDark ? 'bg-transparent' : 'bg-transparent'
    )}>
      <header className={'fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b theme-transition ' + (
        isDark ? 'bg-[#0c0c0c]/70 border-white/5' : 'bg-white/70 border-[#a78bfa]/20'
      )}>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(!menuOpen)} className={'lg:hidden p-2 rounded-xl transition-all ' + (isDark ? 'text-[#d4af37] hover:bg-[#d4af37]/10' : 'text-[#8b5cf6] hover:bg-[#a78bfa]/10')}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="flex items-center gap-3">
              <div className={'w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden ' + (isDark ? 'bg-[#0f0e1f] shadow-lg shadow-[#d4af37]/20' : 'bg-[#0f0e1f] shadow-md')}>
                <img src="/fito-icon.png" alt="فیتو" className="w-9 h-9 object-contain" />
              </div>
              <div>
                <h1 className={'font-bold text-base sm:text-lg leading-tight ' + (isDark ? 'text-white' : 'text-[#312e81]')}>فیتو</h1>
                <p className={'text-[10px] sm:text-xs ' + (isDark ? 'text-gray-500' : 'text-[#7c3aed]/70')}>{APP_VERSION} · Fito · {getPersianDate()}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className={'p-2 rounded-xl transition-all ' + (isDark ? 'bg-white/5 border border-white/10 text-[#d4af37]' : 'bg-[#f5f3ff] border border-[#a78bfa]/30 text-[#8b5cf6]')} title={isDark ? 'تم روشن' : 'تم تاریک'}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <div className="h-16 lg:h-[68px] flex-shrink-0" />

      <div className="flex flex-1">
        <aside className={'hidden lg:flex flex-col w-60 border-l p-4 gap-1 sticky top-[68px] h-[calc(100vh-68px)] overflow-y-auto theme-transition ' + (isDark ? 'bg-[#0c0c0c]/60 border-white/5 backdrop-blur-xl' : 'bg-white/60 border-[#a78bfa]/10 backdrop-blur-xl')}>
          <div className="mb-2 px-3">
            <p className={'text-xs font-bold ' + (isDark ? 'text-gray-500' : 'text-[#7c3aed]/70')}>منوی اصلی</p>
          </div>
          {mainItems.map(item => renderNavItem(item, false))}

          <div className="my-3 px-3">
            <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
          </div>

          <div className="mb-2 px-3 flex items-center gap-2">
            <Sparkles size={12} className={isDark ? 'text-[#d4af37]' : 'text-[#8b5cf6]'} />
            <p className={'text-xs font-bold ' + (isDark ? 'text-gray-500' : 'text-[#7c3aed]/70')}>تولید برنامه</p>
          </div>
          {generatorItems.map(item => renderNavItem(item, false))}
        </aside>

        {menuOpen && (
          <div className="lg:hidden fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
            <aside className={'w-72 h-full p-5 flex flex-col gap-1 shadow-2xl overflow-y-auto ' + (isDark ? 'bg-[#0c0c0c]' : 'bg-white')} onClick={e => e.stopPropagation()}>
              <div className={'flex items-center gap-3 mb-6 pb-5 border-b ' + (isDark ? 'border-white/10' : 'border-[#a78bfa]/20')}>
                <div className={'w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden ' + (isDark ? 'bg-[#0f0e1f]' : 'bg-[#0f0e1f]')}>
                  <img src="/fito-icon.png" alt="فیتو" className="w-11 h-11 object-contain" />
                </div>
                <div>
                  <span className={'font-bold text-lg block ' + (isDark ? 'text-white' : 'text-[#312e81]')}>فیتو</span>
                  <span className={'text-xs ' + (isDark ? 'text-gray-500' : 'text-[#7c3aed]/70')}>Fito · مربی هوشمند آفلاین</span>
                </div>
              </div>

              {mainItems.map(item => renderNavItem(item, true))}

              <div className="my-3">
                <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
              </div>

              <div className="mb-2 flex items-center gap-2 px-2">
                <Sparkles size={14} className={isDark ? 'text-[#d4af37]' : 'text-[#8b5cf6]'} />
                <p className={'text-xs font-bold ' + (isDark ? 'text-gray-500' : 'text-[#7c3aed]/70')}>تولید برنامه</p>
              </div>
              {generatorItems.map(item => renderNavItem(item, true))}
            </aside>
          </div>
        )}

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8 overflow-auto pb-36 lg:pb-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>

      <nav className={'lg:hidden fixed bottom-0 left-0 right-0 z-50 theme-transition ' + (isDark ? 'bg-[#0c0c0c]/70 backdrop-blur-2xl border-t border-white/5' : 'bg-white/70 backdrop-blur-2xl border-t border-[#a78bfa]/20')}>
        <div className="flex justify-around items-center py-2 px-1">
          {bottomNavItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <button key={item.path} onClick={() => navigate(item.path)} className={'relative flex flex-col items-center gap-0.5 min-w-[56px] px-1 py-1 rounded-2xl transition-all ' + (isActive ? (isDark ? 'text-[#d4af37]' : 'text-[#8b5cf6]') : (isDark ? 'text-gray-500' : 'text-[#7c3aed]/50'))}>
                <div className={'w-11 h-11 rounded-2xl flex items-center justify-center transition-all ' + (isActive ? (isDark ? 'bg-[#d4af37]/15 shadow-lg shadow-[#d4af37]/10' : 'bg-[#a78bfa]/15') : '')}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className={'text-[10px] ' + (isActive ? 'font-bold' : 'font-medium')}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
