import React from 'react';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'purple'
  | 'outline';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; dotColor: string; border?: string }> = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
      dotColor: 'bg-emerald-500',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
      dotColor: 'bg-amber-500',
    },
    danger: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800',
      dotColor: 'bg-rose-500',
    },
    info: {
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      text: 'text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800',
      dotColor: 'bg-sky-500',
    },
    purple: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      text: 'text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800',
      dotColor: 'bg-indigo-500',
    },
    neutral: {
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
      dotColor: 'bg-slate-400',
    },
    outline: {
      bg: 'bg-transparent',
      text: 'text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600',
      dotColor: 'bg-slate-500',
    },
  };

  const style = variantStyles[variant] || variantStyles.neutral;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses} ${style.bg} ${style.text} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${style.dotColor}`} />}
      {children}
    </span>
  );
};
