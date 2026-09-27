import React from 'react';
import { useERP } from '../../context/ERPContext';
import { formatCurrency } from '../../utils/formatters';

export const CategoryDonutChart: React.FC = () => {
  const { activeCurrency } = useERP();

  const categories = [
    { name: 'Enterprise Hardware', amount: 58240000, percentage: 48, color: '#4f46e5' },
    { name: 'Cloud & SaaS Licenses', amount: 24500000, percentage: 20, color: '#06b6d4' },
    { name: 'Professional Services', amount: 18900000, percentage: 16, color: '#10b981' },
    { name: 'Executive Office Systems', amount: 12200000, percentage: 10, color: '#f59e0b' },
    { name: 'Networking Telecom', amount: 7200000, percentage: 6, color: '#ec4899' },
  ];

  const total = categories.reduce((sum, c) => sum + c.amount, 0);

  // Calculate SVG stroke dashes for a donut ring
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="bg-white/90 dark:bg-[#0c1220]/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Revenue by Category</h3>
        <p className="text-xs text-slate-500">Distribution across business lines</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-4">
        {/* SVG Donut Circle */}
        <div className="relative w-40 h-40 shrink-0">
          <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90 transform">
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeWidth="20"
            />
            {categories.map((cat, idx) => {
              const dashLength = (cat.percentage / 100) * circumference;
              const dashOffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += cat.percentage;

              return (
                <circle
                  key={idx}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke={cat.color}
                  strokeWidth="20"
                  strokeDasharray={`${dashLength} ${circumference}`}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-500 hover:opacity-80"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Billed</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(total, activeCurrency).split('.')[0]}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2 text-xs">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-600 dark:text-slate-300 truncate">{cat.name}</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white shrink-0 ml-2">
                {cat.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Fastest Growing: Enterprise Hardware (+34%)</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer">View breakdown &rarr;</span>
      </div>
    </div>
  );
};
