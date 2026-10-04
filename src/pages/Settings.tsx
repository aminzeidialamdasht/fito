import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-gray-900'}`}>
      <h1 className="text-2xl font-bold mb-6">تنظیمات</h1>
      
      <div className={`rounded-2xl p-5 border ${isDark ? 'bg-[#1e293b] border-white/5' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <span className="font-bold">حالت تاریک / روشن</span>
          <button 
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
              isDark ? 'bg-violet-500 text-black' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {isDark ? 'روشن' : 'تاریک'}
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-center text-xs opacity-50">Fito v1.4.1</p>
    </div>
  );
}
