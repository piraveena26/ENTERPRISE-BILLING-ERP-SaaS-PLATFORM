import React from 'react';
import {
  TrendingUp,
  DollarSign,
  AlertCircle,
  ShoppingBag,
  ArrowUpRight,
  Boxes,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  FileText,
  CreditCard,
  Building2,
  Calendar,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { formatCurrency } from '../../utils/formatters';
import { StatCard } from '../common/StatCard';
import { RevenueChart } from './RevenueChart';
import { CategoryDonutChart } from './CategoryDonutChart';
import { AgingChart } from './AgingChart';
import { QuickActions } from './QuickActions';
import { AppModule } from '../../types/erp';

export interface MainDashboardProps {
  onNavigateModule: (module: AppModule) => void;
  onOpenQuickCreate: (type: 'invoice' | 'quotation' | 'customer' | 'product' | 'payment') => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  onNavigateModule,
  onOpenQuickCreate,
}) => {
  const {
    userSession,
    activeCompany,
    activeBranch,
    activeCurrency,
    invoices,
    customers,
    products,
    auditLogs,
  } = useERP();

  // Metrics computation
  const totalOutstanding = invoices.reduce((sum, i) => sum + i.outstandingBalance, 0);
  const overdueTotal = invoices
    .filter((i) => i.status === 'Overdue')
    .reduce((sum, i) => sum + i.outstandingBalance, 0);

  const totalStockValue = products.reduce((sum, p) => sum + p.costPrice * p.stockQuantity, 0);
  const lowStockCount = products.filter((p) => p.stockQuantity <= p.reorderLevel).length;

  const handleQuickAction = (key: string) => {
    switch (key) {
      case 'create-invoice':
        onOpenQuickCreate('invoice');
        break;
      case 'create-quote':
        onOpenQuickCreate('quotation');
        break;
      case 'record-payment':
        onOpenQuickCreate('payment');
        break;
      case 'add-customer':
        onOpenQuickCreate('customer');
        break;
      case 'add-product':
        onOpenQuickCreate('product');
        break;
      case 'create-po':
        onNavigateModule('Purchases');
        break;
      case 'stock-adjust':
        onNavigateModule('Inventory');
        break;
      case 'view-reports':
        onNavigateModule('Reports');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Business Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>{activeCompany.name} • {activeBranch.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good morning, {userSession.name}
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm mt-1 max-w-xl">
            Financial ledger reconciled, Sri Lanka Inland Revenue tax registers up to date, and logistics terminals operational.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 text-xs">
            <span className="text-indigo-300 block text-[10px] uppercase font-bold">Fiscal Period</span>
            <span className="font-extrabold">Q3 2026-27 (Active)</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-emerald-500/20 backdrop-blur-xs border border-emerald-400/30 text-emerald-300 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">ERP Engine Online</span>
          </div>
        </div>
      </div>

      {/* 6 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Gross Revenue"
          value={formatCurrency(101640000, activeCurrency)}
          subtitle="YTD Billed Revenue"
          changePercentage={18.4}
          sparklineData={[60, 72, 68, 85, 92, 105]}
          icon={<DollarSign className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/40"
        />

        <StatCard
          title="Receivables"
          value={formatCurrency(totalOutstanding, activeCurrency)}
          subtitle={`Overdue: ${formatCurrency(overdueTotal, activeCurrency)}`}
          changePercentage={-4.2}
          changeLabel="aging exposure"
          sparklineData={[40, 45, 38, 42, 35, 30]}
          icon={<Clock className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
          iconBg="bg-rose-50 dark:bg-rose-950/40"
        />

        <StatCard
          title="Sales This Month"
          value={formatCurrency(25800000, activeCurrency)}
          subtitle="vs LKR 22.4M last month"
          changePercentage={22.1}
          sparklineData={[15, 18, 16, 21, 23, 26]}
          icon={<ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/40"
        />

        <StatCard
          title="Total Expenses"
          value={formatCurrency(64970000, activeCurrency)}
          subtitle="COGS & Operational"
          changePercentage={6.8}
          changeLabel="controlled OPEX"
          sparklineData={[50, 52, 54, 58, 61, 65]}
          icon={<TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          iconBg="bg-amber-50 dark:bg-amber-950/40"
        />

        <StatCard
          title="Net Profit"
          value={formatCurrency(36670000, activeCurrency)}
          subtitle="EBITDA Margin 36.1%"
          changePercentage={14.8}
          sparklineData={[20, 24, 22, 28, 32, 37]}
          icon={<Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
          iconBg="bg-purple-50 dark:bg-purple-950/40"
        />

        <StatCard
          title="Stock Valuation"
          value={formatCurrency(totalStockValue, activeCurrency)}
          subtitle={`${lowStockCount} items at reorder point`}
          changePercentage={-1.5}
          changeLabel="turnover velocity"
          sparklineData={[100, 102, 105, 108, 110, 112]}
          icon={<Boxes className="w-5 h-5 text-sky-600 dark:text-sky-400" />}
          iconBg="bg-sky-50 dark:bg-sky-950/40"
        />
      </div>

      {/* Prominent Quick Actions */}
      <QuickActions
        onAction={handleQuickAction}
        onNavigateModule={onNavigateModule}
      />

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <CategoryDonutChart />
        </div>
      </div>

      {/* Secondary Chart & Aging Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AgingChart />
        </div>

        {/* Top Enterprise Customers Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Enterprise Clients</h3>
              <p className="text-xs text-slate-500">Highest revenue contributors</p>
            </div>
            <button
              onClick={() => onNavigateModule('Customers')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View all &rarr;
            </button>
          </div>

          <div className="space-y-3 my-2">
            {customers.slice(0, 4).map((cust, idx) => (
              <div
                key={cust.id}
                onClick={() => onNavigateModule('Customers')}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-black text-slate-400 w-4 text-center">
                    #{idx + 1}
                  </span>
                  <img
                    src={cust.avatar}
                    alt={cust.companyName}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {cust.companyName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {cust.customerType} • {cust.city}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatCurrency(cust.totalSpent, activeCurrency).split('.')[0]}
                  </p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Active Client</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Customer Retention Rate: 96.8%</span>
            <span className="text-slate-500">Average Credit: 30 Days</span>
          </div>
        </div>

        {/* Top Fast-Moving Products Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">High-Velocity Products</h3>
              <p className="text-xs text-slate-500">Top revenue generating catalog items</p>
            </div>
            <button
              onClick={() => onNavigateModule('Products')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Catalog &rarr;
            </button>
          </div>

          <div className="space-y-3 my-2">
            {products.slice(0, 4).map((prod) => (
              <div
                key={prod.id}
                onClick={() => onNavigateModule('Products')}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {prod.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      SKU: {prod.sku} • Stock: {prod.stockQuantity} {prod.unit}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatCurrency(prod.sellingPrice, activeCurrency).split('.')[0]}
                  </p>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">{prod.brand}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Inventory turnover: 8.4x / year</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Healthy supply</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Enterprise Activity</h3>
            <p className="text-xs text-slate-500">Real-time audit log stream across billing, inventory, and ledger</p>
          </div>
          <button
            onClick={() => onNavigateModule('Audit Logs')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Full Audit Trail &rarr;
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    {log.action}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    By <strong className="text-slate-700 dark:text-slate-300">{log.user}</strong> ({log.role}) • Module: {log.module}
                  </p>
                  {log.reason && (
                    <p className="text-[11px] text-slate-400 italic mt-0.5 line-clamp-1">
                      Reason: &ldquo;{log.reason}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-slate-400 block">{log.timestamp}</span>
                <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
