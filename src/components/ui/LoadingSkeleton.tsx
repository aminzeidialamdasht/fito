import { useTheme } from '../../context/ThemeContext';
import { getTokens } from '../../styles/designTokens';

interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'circle';
  width?: string;
  height?: string;
  lines?: number;
  className?: string;
}

export default function LoadingSkeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  className = '',
}: LoadingSkeletonProps) {
  const { theme } = useTheme();
  const tokens = getTokens(theme === 'dark');

  const baseStyle = {
    backgroundColor: tokens.border,
  };

  if (variant === 'circle') {
    return (
      <div
        aria-hidden="true"
        className={`animate-pulse rounded-full ${className}`}
        style={{
          ...baseStyle,
          width: width || '48px',
          height: height || '48px',
        }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div
        aria-hidden="true"
        className={`animate-pulse rounded-2xl ${className}`}
        style={{
          ...baseStyle,
          width: width || '100%',
          height: height || '80px',
        }}
      />
    );
  }

  // text (multi-line)
  return (
    <div aria-hidden="true" className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded"
          style={{
            ...baseStyle,
            width: index === lines - 1 && lines > 1 ? '70%' : (width || '100%'),
            height: height || '12px',
          }}
        />
      ))}
    </div>
  );
}
