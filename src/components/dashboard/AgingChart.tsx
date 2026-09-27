import React from 'react';
import { useERP } from '../../context/ERPContext';
import { formatCurrency, getAgingBucket } from '../../utils/formatters';

export const AgingChart: React.FC = () => {
  const { invoices, activeCurrency } = useERP();

  // Aggregate outstanding balance by aging bucket
  const buckets: Record<string, { amount: number; count: number; color: string; bg: string }> = {
    Current: { amount: 0, count: 0, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500' },
    '1-30 Days': { amount: 0, count: 0, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500' },
    '31-60 Days': { amount: 0, count: 0, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500' },
    '61-90 Days': { amount: 0, count: 0, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500' },
    '90+ Days': { amount: 0, count: 0, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500' },
  };

  invoices.forEach((inv) => {
    if (inv.outstandingBalance > 0) {
      const bucket = getAgingBucket(inv.dueDate);
      if (buckets[bucket]) {
        buckets[bucket].amount += inv.outstandingBalance;
        buckets[bucket].count += 1;
      }
    }
  });

  const totalOutstanding = Object.values(buckets).reduce((sum, b) => sum + b.amount, 0) || 1;

  return (
    <div className="bg-white/90 dark:bg-[#0c1220]/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Outstanding Receivables Aging</h3>
          <p className="text-xs text-slate-500">Credit risk exposure by payment terms</p>
        </div>
        <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
          Risk Managed
        </span>
      </div>

      {/* Segmented Bar */}
      <div className="space-y-3 my-2">
        <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden">
          {Object.entries(buckets).map(([name, item]) => {
            const widthPct = (item.amount / totalOutstanding) * 100;
            if (widthPct === 0) return null;
            return (
              <div
                key={name}
                style={{ width: `${widthPct}%` }}
                className={`${item.bg} h-full transition-all duration-300`}
                title={`${name}: ${widthPct.toFixed(1)}%`}
              />
            );
          })}
        </div>

        {/* Detailed Rows */}
        <div className="space-y-2 pt-2">
          {Object.entries(buckets).map(([name, item]) => {
            const pct = Math.round((item.amount / totalOutstanding) * 100) || 0;
            return (
              <div key={name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.bg}`} />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{name}</span>
                  <span className="text-[10px] text-slate-400">({item.count} inv)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatCurrency(item.amount, activeCurrency)}
                  </span>
                  <span className="text-slate-400 w-8 text-right font-medium text-[11px]">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
        <span className="text-slate-500">
          Total Receivables: <strong className="text-slate-900 dark:text-white">{formatCurrency(totalOutstanding, activeCurrency)}</strong>
        </span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer">
          Send payment reminders &rarr;
        </span>
      </div>
    </div>
  );
};
