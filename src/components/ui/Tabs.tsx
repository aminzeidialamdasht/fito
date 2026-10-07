import { useTheme } from '../../context/ThemeContext';
import { getTokens } from '../../styles/designTokens';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  fullWidth?: boolean;
}

export default function Tabs({
  tabs,
  activeId,
  onChange,
  fullWidth = true,
}: TabsProps) {
  const { theme } = useTheme();
  const tokens = getTokens(theme === 'dark');

  return (
    <div
      className={`flex gap-1 rounded-xl border p-1 ${fullWidth ? 'w-full' : ''}`}
      style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all min-h-[36px] disabled:opacity-40 ${isActive ? 'shadow-sm' : ''}`}
            style={{
              backgroundColor: isActive ? tokens.accent : 'transparent',
              color: isActive ? '#ffffff' : tokens.textSub,
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
