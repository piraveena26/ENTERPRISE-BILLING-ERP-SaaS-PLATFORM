import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  changePercentage?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  trend?: 'up' | 'down' | 'neutral';
  sparklineData?: number[];
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  changePercentage,
  changeLabel = 'vs last period',
  icon,
  iconBg = 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
  trend,
  sparklineData,
  onClick,
}) => {
  const isPositive = trend === 'up' || (changePercentage !== undefined && changePercentage >= 0);

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
            {value}
          </h3>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl shrink-0 ${iconBg} shadow-xs`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        {changePercentage !== undefined ? (
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded-md ${
                isPositive
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
              }`}
            >
              {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
              {Math.abs(changePercentage)}%
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[11px]">{changeLabel}</span>
          </div>
        ) : (
          <div className="text-[11px] text-slate-400">Real-time synchronized</div>
        )}

        {/* Mini Sparkline SVG if provided */}
        {sparklineData && sparklineData.length > 1 && (
          <div className="w-20 h-6">
            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
              {(() => {
                const max = Math.max(...sparklineData);
                const min = Math.min(...sparklineData);
                const range = max - min || 1;
                const points = sparklineData
                  .map((val, idx) => {
                    const x = (idx / (sparklineData.length - 1)) * 100;
                    const y = 30 - ((val - min) / range) * 26;
                    return `${x},${y}`;
                  })
                  .join(' ');
                return (
                  <polyline
                    fill="none"
                    stroke={isPositive ? '#10b981' : '#f43f5e'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                );
              })()}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
