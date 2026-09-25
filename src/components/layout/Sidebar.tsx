import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileCheck,
  FileText,
  CreditCard,
  Users,
  Package,
  Boxes,
  Truck,
  Building,
  Landmark,
  BookOpen,
  PieChart,
  Sliders,
  GitBranch,
  ShieldCheck,
  Server,
  Building2,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { AppModule } from '../../types/erp';

export interface SidebarProps {
  currentModule: AppModule;
  onSelectModule: (module: AppModule) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavGroup {
  name: string;
  items: {
    name: string;
    module: AppModule;
    icon: React.ReactNode;
    badgeCount?: number;
    badgeVariant?: 'danger' | 'warning' | 'info' | 'purple';
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { invoices, orders, products, hasPermission, activeTenant } = useERP();

  // Dynamic badge counts
  const overdueInvoicesCount = invoices.filter((i) => i.status === 'Overdue').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Processing' || o.status === 'Confirmed').length;
  const lowStockCount = products.filter((p) => p.stockQuantity <= p.reorderLevel).length;

  // Open/closed state for collapsible groups
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Sales: true,
    Inventory: true,
    Accounting: true,
    Governance: false,
    Platform: false,
  });

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const navGroups: NavGroup[] = [
    {
      name: 'Main',
      items: [
        {
          name: 'Executive Dashboard',
          module: 'Dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
      ],
    },
    {
      name: 'Sales & Billing',
      items: [
        {
          name: 'Invoices Workspace',
          module: 'Invoices',
          icon: <FileText className="w-4 h-4" />,
          badgeCount: overdueInvoicesCount > 0 ? overdueInvoicesCount : undefined,
          badgeVariant: 'danger',
        },
        {
          name: 'Quotations',
          module: 'Quotations',
          icon: <FileSpreadsheet className="w-4 h-4" />,
        },
        {
          name: 'Sales Orders',
          module: 'Sales Orders',
          icon: <FileCheck className="w-4 h-4" />,
          badgeCount: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
          badgeVariant: 'purple',
        },
        {
          name: 'Payment Collections',
          module: 'Payments',
          icon: <CreditCard className="w-4 h-4" />,
        },
        {
          name: 'Customer CRM',
          module: 'Customers',
          icon: <Users className="w-4 h-4" />,
        },
        {
          name: 'Product Catalog',
          module: 'Products',
          icon: <Package className="w-4 h-4" />,
        },
      ],
    },
    {
      name: 'Operations & Procurement',
      items: [
        {
          name: 'Inventory & Stock',
          module: 'Inventory',
          icon: <Boxes className="w-4 h-4" />,
          badgeCount: lowStockCount > 0 ? lowStockCount : undefined,
          badgeVariant: 'warning',
        },
        {
          name: 'Warehouses',
          module: 'Warehouses',
          icon: <Building className="w-4 h-4" />,
        },
        {
          name: 'Suppliers Directory',
          module: 'Suppliers',
          icon: <Truck className="w-4 h-4" />,
        },
        {
          name: 'Procurement & POs',
          module: 'Purchases',
          icon: <FileCheck className="w-4 h-4" />,
        },
      ],
    },
    {
      name: 'Finance & Accounting',
      items: [
        {
          name: 'Financial Ledger & GL',
          module: 'Accounting',
          icon: <Landmark className="w-4 h-4" />,
        },
        {
          name: 'Financial Reports',
          module: 'Reports',
          icon: <PieChart className="w-4 h-4" />,
        },
      ],
    },
    {
      name: 'Governance & RBAC',
      items: [
        {
          name: 'Permission Matrix',
          module: 'Workflows',
          icon: <ShieldCheck className="w-4 h-4" />,
        },
        {
          name: 'Enterprise Audit Log',
          module: 'Audit Logs',
          icon: <BookOpen className="w-4 h-4" />,
        },
      ],
    },
    {
      name: 'Platform Administration',
      items: [
        {
          name: 'SaaS Platform Admin',
          module: 'SaaS Admin',
          icon: <Server className="w-4 h-4" />,
        },
        {
          name: 'Settings Center',
          module: 'Settings',
          icon: <Sliders className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand & Workspace Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-indigo-200 dark:shadow-none shrink-0">
            ▲
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-sm font-extrabold text-slate-900 dark:text-white truncate tracking-tight">
                Apex Enterprise
              </h1>
              <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest truncate">
                Billing & ERP SaaS
              </p>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hidden lg:flex items-center justify-center cursor-pointer"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Group Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => {
          // Filter items based on permission
          const visibleItems = group.items.filter((item) => hasPermission(item.module, 'View'));
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.name} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {group.name}
                </div>
              )}
              {visibleItems.map((item) => {
                const isActive = currentModule === item.module;

                return (
                  <button
                    key={item.module}
                    onClick={() => onSelectModule(item.module)}
                    title={isCollapsed ? item.name : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <span
                      className={`shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                      }`}
                    >
                      {item.icon}
                    </span>

                    {!isCollapsed && (
                      <>
                        <span className="truncate flex-1 text-left">{item.name}</span>
                        {item.badgeCount !== undefined && (
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                              item.badgeVariant === 'danger'
                                ? 'bg-rose-500 text-white'
                                : item.badgeVariant === 'warning'
                                ? 'bg-amber-500 text-white'
                                : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                            }`}
                          >
                            {item.badgeCount}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Bottom Tenant Plan Status Card */}
      {!isCollapsed && (
        <div className="p-3 m-3 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-800/30 border border-indigo-100/60 dark:border-slate-700/60">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {activeTenant.plan} Edition
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Multi-branch, tax-compliant ERP active.
          </p>
        </div>
      )}
    </aside>
  );
};
