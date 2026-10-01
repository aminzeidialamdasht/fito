import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Dumbbell, TrendingUp, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'داشبورد' },
  { path: '/calendar', icon: Calendar, label: 'تقویم' },
  { path: '/workouts', icon: Dumbbell, label: 'تمرینات' },
  { path: '/progress', icon: TrendingUp, label: 'پیشرفت' },
  { path: '/settings', icon: Settings, label: 'تنظیمات' },
];

export default function BottomNav() {
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t pb-safe ${
      isDark ? 'bg-[#0f172a] border-white/10' : 'bg-white border-gray-200'
    }`}>
      <div className="flex justify-around items-center h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive 
                  ? 'text-teal-500' 
                  : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold">{item.label}</span>
              
              {/* خط نشانگر فعال */}
              {isActive && (
                <div className="absolute top-0 w-12 h-0.5 bg-teal-500 rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
