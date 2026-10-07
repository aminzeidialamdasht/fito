import type { InputHTMLAttributes } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getTokens } from '../../styles/designTokens';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  inputSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function Input({
  label,
  error,
  hint,
  inputSize = 'md',
  fullWidth = true,
  className = '',
  ...rest
}: InputProps) {
  const { theme } = useTheme();
  const tokens = getTokens(theme === 'dark');

  const sizeClass = {
    sm: 'py-2 px-3 text-xs',
    md: 'py-2.5 px-4 text-sm',
    lg: 'py-3.5 px-5 text-base',
  }[inputSize];

  const borderColor = error ? tokens.danger : tokens.border;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          className="mb-1.5 block text-xs font-bold"
          style={{ color: tokens.textSub }}
        >
          {label}
        </label>
      )}
      <input
        {...rest}
        className={`rounded-xl border outline-none transition-colors min-h-[44px] ${sizeClass} ${fullWidth ? 'w-full' : ''} ${className}`}
        style={{
          backgroundColor: tokens.surface,
          borderColor,
          color: tokens.textMain,
        }}
        dir="rtl"
      />
      {error && (
        <p className="mt-1 text-xs font-semibold" style={{ color: tokens.danger }}>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1 text-xs" style={{ color: tokens.textSub }}>
          {hint}
        </p>
      )}
    </div>
  );
}
