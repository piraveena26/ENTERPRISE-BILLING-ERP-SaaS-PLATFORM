import React, { useState } from 'react';
import {
  Server,
  Building2,
  Users,
  HardDrive,
  Activity,
  DollarSign,
  TrendingUp,
  Sparkles,
  Check,
  ArrowRight,
  ShieldAlert,
  Database,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Tenant, TenantPlan } from '../../types/erp';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatCard } from '../common/StatCard';
import { Table, Column } from '../common/Table';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export const SaasAdminDashboard: React.FC = () => {
  const { tenants, activeTenant, switchTenant, activeCurrency } = useERP();
  const [activeTab, setActiveTab] = useState<'tenants' | 'plans' | 'telemetry'>('tenants');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // SaaS Global Metrics
  const totalMrr = tenants.reduce((sum, t) => sum + t.mrrUSD, 0);
  const totalUsers = tenants.reduce((sum, t) => sum + t.userCount, 0);
  const totalStorageGb = (tenants.reduce((sum, t) => sum + t.storageUsageMb, 0) / 1024).toFixed(1);

  const tenantColumns: Column<Tenant>[] = [
    {
      header: 'Tenant Organization',
      render: (t) => (
        <div className="flex items-center gap-3">
          <img
            src={t.logoUrl}
            alt={t.name}
            className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
          />
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">{t.name}</span>
            <span className="text-xs text-slate-400 font-mono">{t.domain}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Subscription Plan',
      render: (t) => (
        <Badge
          variant={
            t.plan === 'Enterprise'
              ? 'purple'
              : t.plan === 'Business'
              ? 'info'
              : 'neutral'
          }
          size="sm"
        >
          {t.plan}
        </Badge>
      ),
    },
    {
      header: 'Status',
      render: (t) => (
        <Badge variant={t.status === 'active' ? 'success' : 'warning'} dot size="sm">
          {t.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Users / Branches',
      render: (t) => (
        <span className="text-xs font-semibold">
          {t.userCount} Users • {t.branchCount} Branches
        </span>
      ),
    },
    {
      header: 'Monthly MRR',
      align: 'right',
      render: (t) => (
        <span className="font-extrabold text-slate-900 dark:text-white text-xs">
          ${t.mrrUSD}/mo
        </span>
      ),
    },
    {
      header: 'Storage Used',
      render: (t) => (
        <span className="text-xs text-slate-500 font-mono">
          {(t.storageUsageMb / 1024).toFixed(2)} GB
        </span>
      ),
    },
    {
      header: 'Action',
      align: 'center',
      render: (t) => (
        <Button
          variant={activeTenant.id === t.id ? 'primary' : 'outline'}
          size="sm"
          onClick={() => switchTenant(t.id)}
        >
          {activeTenant.id === t.id ? 'Current' : 'Switch Context'}
        </Button>
      ),
    },
  ];

  const plans: {
    plan: TenantPlan;
    priceUSD: number;
    description: string;
    features: string[];
    popular?: boolean;
  }[] = [
    {
      plan: 'Starter',
      priceUSD: 99,
      description: 'Single company billing with Sri Lanka tax compliance.',
      features: [
        'Up to 5 Users',
        '1 Corporate Branch',
        '100 Invoices / Month',
        'Standard VAT & SSCL',
        'Email Support',
      ],
    },
    {
      plan: 'Professional',
      priceUSD: 249,
      description: 'Ideal for scaling regional trading & service companies.',
      features: [
        'Up to 15 Users',
        '2 Branches & Warehouses',
        'Unlimited Invoices',
        'Multi-Currency Support',
        'Full General Ledger',
      ],
    },
    {
      plan: 'Business',
      priceUSD: 499,
      description: 'Comprehensive ERP for manufacturing & distributors.',
      features: [
        'Up to 30 Users',
        '6 Branches & Warehouses',
        'Custom Approval Workflows',
        'Inventory Barcode Scanner',
        'Dedicated Priority SLA',
      ],
      popular: true,
    },
    {
      plan: 'Enterprise',
      priceUSD: 950,
      description: 'Unlimited multi-tenant capacity for global conglomerates.',
      features: [
        'Unlimited Users & Branches',
        'Global Multi-Currency FX Ledger',
        'Custom Role RBAC (13 Roles)',
        'Full API & Webhook Integrations',
        '24/7 Dedicated Account Director',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            SaaS Platform Super-Admin & Multi-Tenancy Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor tenant quotas, monthly recurring revenue (MRR), database storage, and API latency
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total SaaS MRR"
          value={`$${totalMrr.toLocaleString()}`}
          subtitle={`ARR: $${(totalMrr * 12).toLocaleString()}`}
          trend="up"
          changePercentage={21.4}
          icon={<DollarSign className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/40"
        />

        <StatCard
          title="Active Tenants"
          value={`${tenants.length} Organizations`}
          subtitle="99.98% SLA Uptime"
          trend="up"
          changePercentage={12.5}
          icon={<Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/40"
        />

        <StatCard
          title="Total Platform Users"
          value={`${totalUsers} Seats`}
          subtitle="Across all corporate tenants"
          trend="up"
          icon={<Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
          iconBg="bg-purple-50 dark:bg-purple-950/40"
        />

        <StatCard
          title="PostgreSQL Storage"
          value={`${totalStorageGb} GB`}
          subtitle="Automated Daily Backups"
          trend="neutral"
          icon={<Database className="w-5 h-5 text-sky-600 dark:text-sky-400" />}
          iconBg="bg-sky-50 dark:bg-sky-950/40"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('tenants')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-colors ${
            activeTab === 'tenants'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          All Corporate Tenants ({tenants.length})
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-colors ${
            activeTab === 'plans'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Subscription Tiers & Packaging
        </button>
      </div>

      {activeTab === 'tenants' && (
        <Table
          columns={tenantColumns}
          data={tenants}
          keyExtractor={(t) => t.id}
          searchPlaceholder="Search tenants by name, domain, plan..."
        />
      )}

      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => (
            <div
              key={p.plan}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all ${
                p.popular
                  ? 'bg-gradient-to-b from-indigo-900 to-slate-900 text-white shadow-xl ring-2 ring-indigo-500'
                  : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xs'
              }`}
            >
              <div>
                {p.popular && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500 text-white mb-3">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-black">{p.plan}</h3>
                <p className={`text-xs mt-1 leading-snug ${p.popular ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {p.description}
                </p>

                <div className="my-5">
                  <span className="text-3xl font-black">${p.priceUSD}</span>
                  <span className={`text-xs ml-1 ${p.popular ? 'text-indigo-200' : 'text-slate-400'}`}>/ month</span>
                </div>

                <div className="space-y-2.5 text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className={`w-4 h-4 shrink-0 ${p.popular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6">
                <Button
                  variant={p.popular ? 'primary' : 'outline'}
                  className="w-full"
                  onClick={() => alert(`Upgrading tenant to ${p.plan} Edition`)}
                >
                  Configure Plan
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
