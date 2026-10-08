import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Sparkles, TrendingUp, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getTokens } from '../styles/designTokens';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'داشبورد' },
  { path: '/programs', icon: Calendar, label: 'برنامه‌ها' },
  { path: '/generate/workout', icon: Sparkles, label: 'تولید', isCenter: true },
  { path: '/progress', icon: TrendingUp, label: 'پیشرفت' },
  { path: '/profile', icon: User, label: 'پروفایل' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const tokens = getTokens(isDark);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{
        background: isDark
          ? 'rgba(11, 15, 26, 0.85)'
          : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${tokens.border}`,
      }}
    >
      <div className="flex justify-around items-end h-[72px] px-2 relative">
        {NAV_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <div key={item.path} className="relative -top-5 flex flex-col items-center">
                <button
                  onClick={() => navigate(item.path)}
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, ${tokens.accentStrong}, ${tokens.accent})`,
                    boxShadow: `0 8px 24px ${tokens.accentSoft}`,
                  }}
                  aria-label={item.label}
                >
                  <Icon size={26} color="#fff" strokeWidth={2.2} />
                </button>
                <span
                  className="text-[10px] font-bold mt-1"
                  style={{ color: isActive ? tokens.accent : tokens.textSub }}
                >
                  {item.label}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors relative"
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all"
                style={{
                  background: isActive ? tokens.accentSoft : 'transparent',
                  color: isActive ? tokens.accent : tokens.textSub,
                }}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span
                className="text-[10px] font-bold leading-tight"
                style={{ color: isActive ? tokens.accent : tokens.textSub }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
