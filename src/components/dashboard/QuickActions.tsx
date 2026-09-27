import React from 'react';
import {
  FileText,
  FileSpreadsheet,
  CreditCard,
  UserPlus,
  PackagePlus,
  Truck,
  ArrowUpDown,
  PieChart,
  Sparkles,
} from 'lucide-react';
import { AppModule } from '../../types/erp';

export interface QuickActionsProps {
  onAction: (actionKey: 'create-invoice' | 'create-quote' | 'record-payment' | 'add-customer' | 'add-product' | 'create-po' | 'stock-adjust' | 'view-reports') => void;
  onNavigateModule: (module: AppModule) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    {
      key: 'create-invoice' as const,
      label: 'New Invoice',
      desc: 'Tax compliant',
      icon: <FileText className="w-4 h-4 text-indigo-500" />,
    },
    {
      key: 'create-quote' as const,
      label: 'Quotation',
      desc: 'Price proposal',
      icon: <FileSpreadsheet className="w-4 h-4 text-sky-500" />,
    },
    {
      key: 'record-payment' as const,
      label: 'Record Payment',
      desc: 'CEFT / Cash',
      icon: <CreditCard className="w-4 h-4 text-emerald-500" />,
    },
    {
      key: 'add-customer' as const,
      label: 'Add Customer',
      desc: 'Credit ledger',
      icon: <UserPlus className="w-4 h-4 text-purple-500" />,
    },
    {
      key: 'add-product' as const,
      label: 'Add Product',
      desc: 'Catalog SKU',
      icon: <PackagePlus className="w-4 h-4 text-amber-500" />,
    },
    {
      key: 'create-po' as const,
      label: 'Purchase Order',
      desc: 'Vendor PO',
      icon: <Truck className="w-4 h-4 text-blue-500" />,
    },
    {
      key: 'stock-adjust' as const,
      label: 'Stock Adjust',
      desc: 'Audit count',
      icon: <ArrowUpDown className="w-4 h-4 text-teal-500" />,
    },
    {
      key: 'view-reports' as const,
      label: 'Reports',
      desc: 'P&L / Tax IRD',
      icon: <PieChart className="w-4 h-4 text-rose-500" />,
    },
  ];

  return (
    <div className="bg-white/80 dark:bg-[#0c1220]/80 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Executive Command Deck
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Quick Workflows</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {actions.map((act) => (
          <button
            key={act.key}
            onClick={() => onAction(act.key)}
            className="flex flex-col items-start p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800/60 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-150 cursor-pointer group text-left shadow-2xs hover:shadow-sm hover:-translate-y-0.5"
          >
            <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-2xs mb-2.5 group-hover:scale-105 transition-transform">
              {act.icon}
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
              {act.label}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate w-full">
              {act.desc}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
