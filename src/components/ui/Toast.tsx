import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getTokens } from '../../styles/designTokens';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: ToastType;
  duration?: number;
}

export default function Toast({
  isOpen,
  onClose,
  message,
  type = 'info',
  duration = 3000,
}: ToastProps) {
  const { theme } = useTheme();
  const tokens = getTokens(theme === 'dark');

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const config: Record<ToastType, { color: string; icon: typeof Info }> = {
    success: { color: tokens.success, icon: CheckCircle2 },
    error: { color: tokens.danger, icon: XCircle },
    warning: { color: tokens.warning, icon: AlertCircle },
    info: { color: tokens.info, icon: Info },
  };

  const { color, icon: Icon } = config[type];

  return (
    <div
      className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border px-4 py-3 shadow-lg animate-slide-up"
      style={{
        backgroundColor: tokens.surface,
        borderColor: color,
        minWidth: '280px',
        maxWidth: '90vw',
      }}
      role="alert"
    >
      <Icon size={20} style={{ color }} />
      <p className="flex-1 text-sm font-semibold" style={{ color: tokens.textMain }}>
        {message}
      </p>
      <button
        type="button"
        onClick={onClose}
        aria-label="بستن"
        className="shrink-0 opacity-60 hover:opacity-100"
        style={{ color: tokens.textSub }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
