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
} from 'lucide-react';
import { AppModule } from '../../types/erp';

export interface QuickActionsProps {
  onAction: (actionKey: 'create-invoice' | 'create-quote' | 'record-payment' | 'add-customer' | 'add-product' | 'create-po' | 'stock-adjust' | 'view-reports') => void;
  onNavigateModule: (module: AppModule) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction, onNavigateModule }) => {
  const actions = [
    {
      key: 'create-invoice' as const,
      label: 'Create Invoice',
      subtitle: 'Tax compliant billing',
      icon: <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100/80',
      border: 'border-indigo-100 dark:border-indigo-900',
    },
    {
      key: 'create-quote' as const,
      label: 'New Quotation',
      subtitle: 'Send commercial quote',
      icon: <FileSpreadsheet className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      bg: 'bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100/80',
      border: 'border-sky-100 dark:border-sky-900',
    },
    {
      key: 'record-payment' as const,
      label: 'Record Payment',
      subtitle: 'Cash / Bank CEFT / Card',
      icon: <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100/80',
      border: 'border-emerald-100 dark:border-emerald-900',
    },
    {
      key: 'add-customer' as const,
      label: 'Add Customer',
      subtitle: 'Corporate / Wholesale',
      icon: <UserPlus className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      bg: 'bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100/80',
      border: 'border-purple-100 dark:border-purple-900',
    },
    {
      key: 'add-product' as const,
      label: 'Add Product',
      subtitle: 'Catalog & Inventory SKU',
      icon: <PackagePlus className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      bg: 'bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100/80',
      border: 'border-amber-100 dark:border-amber-900',
    },
    {
      key: 'create-po' as const,
      label: 'Purchase Order',
      subtitle: 'Procure stock from vendor',
      icon: <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      bg: 'bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100/80',
      border: 'border-blue-100 dark:border-blue-900',
    },
    {
      key: 'stock-adjust' as const,
      label: 'Stock Adjustment',
      subtitle: 'Warehouse reconciliation',
      icon: <ArrowUpDown className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      bg: 'bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100/80',
      border: 'border-teal-100 dark:border-teal-900',
    },
    {
      key: 'view-reports' as const,
      label: 'Financial Reports',
      subtitle: 'P&L, Balance Sheet, Tax',
      icon: <PieChart className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      bg: 'bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100/80',
      border: 'border-rose-100 dark:border-rose-900',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Quick Business Operations</h3>
          <p className="text-xs text-slate-500">Accelerate daily billing, inventory, and procurement workflows</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {actions.map((act) => (
          <button
            key={act.key}
            onClick={() => onAction(act.key)}
            className={`flex flex-col items-center justify-center text-center p-3.5 rounded-xl border transition-all duration-150 cursor-pointer ${act.bg} ${act.border} hover:scale-[1.02] shadow-2xs`}
          >
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-2xs mb-2">
              {act.icon}
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {act.label}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
              {act.subtitle}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
