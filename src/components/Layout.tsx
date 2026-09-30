import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Brain, Dumbbell, Calendar,
  Import, Trophy, Menu, X, Sun, Moon, Apple, Pill
} from 'lucide-react';
import { useState } from 'react';
import { toPersianNumber, getPersianDate } from '../utils/jalali';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { path: '/', label: 'داشبورد', icon: LayoutDashboard },
  { path: '/profile', label: 'پروفایل', icon: User },
  { path: '/prompt', label: 'پرامپت', icon: Brain },
  { path: '/import', label: 'تمرین', icon: Import },
  { path: '/nutrition', label: 'تغذیه', icon: Apple },
  { path: '/supplements', label: 'مکمل', icon: Pill },
  { path: '/calendar', label: 'تقویم', icon: Calendar }, // فقط اینجا تقویم داریم
  { path: '/progress', label: 'پیشرفت', icon: Trophy },
];

// در نوار پایین، تقویم را جایگزین اجرا می‌کنیم
const bottomNavItems = [
  { path: '/', label: 'داشبورد', icon: LayoutDashboard },
  { path: '/calendar', label: 'تقویم', icon: Calendar }, // تغییر از workout به calendar
  { path: '/nutrition', label: 'تغذیه', icon: Apple },
  { path: '/supplements', label: 'مکمل', icon: Pill },
  { path: '/progress', label: 'پیشرفت', icon: Trophy },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={'min-h-screen flex flex-col theme-transition ' + (
      isDark
        ? 'bg-[#080808]'
        : 'bg-gradient-to-br from-[#f0fdfa] via-[#ffffff] to-[#ecfdf5]'
    )}>
      <header className={'fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b theme-transition ' + (
        isDark
          ? 'bg-[#0c0c0c]/90 border-white/5'
          : 'bg-white/95 border-[#14b8a6]/20'
      )}>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={'lg:hidden p-2 rounded-xl transition-all ' + (
                isDark ? 'text-[#14b8a6] hover:bg-[#14b8a6]/10' : 'text-[#0d9488] hover:bg-[#14b8a6]/10'
              )}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="flex items-center gap-3">
              <div className={'w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden ' + (
                isDark
                  ? 'bg-[#0D0D1A] shadow-lg shadow-[#88C038]/20'
                  : 'bg-[#0D0D1A] shadow-md'
              )}>
                <img src="/coachino-icon.png" alt="کوچینو" className="w-9 h-9 object-contain" />
              </div>
              <div>
                <h1 className={'font-bold text-base sm:text-lg leading-tight ' + (
                  isDark ? 'text-white' : 'text-[#0d9488]'
                )}>
                  کوچینو
                </h1>
                <p className={'text-[10px] sm:text-xs ' + (isDark ? 'text-gray-500' : 'text-[#0f766e]/70')}>
                  Coachino · {getPersianDate()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={'p-2 rounded-xl transition-all ' + (
                isDark
                  ? 'bg-white/5 border border-white/10 text-[#14b8a6]'
                  : 'bg-[#f0fdfa] border border-[#14b8a6]/30 text-[#0d9488]'
              )}
              title={isDark ? 'تم روشن' : 'تم تاریک'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <div className="h-16 lg:h-[68px] flex-shrink-0" />

      <div className="flex flex-1">
        <aside className={'hidden lg:flex flex-col w-60 border-l p-4 gap-1 sticky top-[68px] h-[calc(100vh-68px)] overflow-y-auto theme-transition ' + (
          isDark ? 'bg-[#0c0c0c] border-white/5' : 'bg-white/50 border-[#14b8a6]/10'
        )}>
          <div className="mb-4 px-3">
            <p className={'text-xs font-bold ' + (isDark ? 'text-gray-500' : 'text-[#0f766e]/70')}>منوی اصلی</p>
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={'group flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ' + (
                  isActive
                    ? (isDark ? 'bg-[#14b8a6]/15 text-[#14b8a6] font-bold' : 'bg-[#14b8a6]/15 text-[#0d9488] font-bold')
                    : (isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-[#0f766e]/70 hover:text-[#0d9488] hover:bg-[#f0fdfa]')
                )}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {menuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
            <aside
              className={'w-72 h-full p-5 flex flex-col gap-1 shadow-2xl ' + (
                isDark ? 'bg-[#0c0c0c]' : 'bg-white'
              )}
              onClick={e => e.stopPropagation()}
            >
              <div className={'flex items-center gap-3 mb-6 pb-5 border-b ' + (isDark ? 'border-white/10' : 'border-[#14b8a6]/20')}>
                <div className={'w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden ' + (
                  isDark ? 'bg-[#0D0D1A]' : 'bg-[#0D0D1A]'
                )}>
                  <img src="/coachino-icon.png" alt="کوچینو" className="w-11 h-11 object-contain" />
                </div>
                <div>
                  <span className={'font-bold text-lg block ' + (isDark ? 'text-white' : 'text-[#0d9488]')}>کوچینو</span>
                  <span className={'text-xs ' + (isDark ? 'text-gray-500' : 'text-[#0f766e]/70')}>Coachino · دستیار هوشمند بدنسازی</span>
                </div>
              </div>
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setMenuOpen(false); }}
                    className={'flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all ' + (
                      isActive
                        ? (isDark ? 'bg-[#14b8a6]/15 text-[#14b8a6] font-bold' : 'bg-[#14b8a6]/15 text-[#0d9488] font-bold')
                        : (isDark ? 'text-gray-300 hover:bg-white/5' : 'text-[#0f766e]/70 hover:bg-[#f0fdfa]')
                    )}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </aside>
          </div>
        )}

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8 overflow-auto pb-28 lg:pb-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>

      <nav className={'lg:hidden fixed bottom-0 left-0 right-0 z-40 theme-transition ' + (
        isDark
          ? 'bg-[#0c0c0c]/95 backdrop-blur-xl border-t border-white/5'
          : 'bg-white/95 backdrop-blur-xl border-t border-[#14b8a6]/20'
      )}>
        <div className="flex justify-around items-center py-2.5 px-2">
          {bottomNavItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={'relative flex flex-col items-center gap-1 min-w-[56px] px-2 py-1 rounded-2xl transition-all ' + (
                  isActive
                    ? (isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]')
                    : (isDark ? 'text-gray-500' : 'text-[#0f766e]/50')
                )}
              >
                <div className={'w-10 h-10 rounded-2xl flex items-center justify-center transition-all ' + (
                  isActive ? (isDark ? 'bg-[#14b8a6]/15' : 'bg-[#14b8a6]/15') : ''
                )}>
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
