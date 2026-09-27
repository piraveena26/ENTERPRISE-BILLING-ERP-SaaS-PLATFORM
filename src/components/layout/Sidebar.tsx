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
  PieChart,
  Sliders,
  ShieldCheck,
  Server,
  Building2,
  ChevronDown,
  ChevronRight,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  Search,
  CircleDot,
  Dot,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { AppModule } from '../../types/erp';

export interface SidebarProps {
  currentModule: AppModule;
  onSelectModule: (module: AppModule) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  name: string;
  module: AppModule;
  icon: React.ReactNode;
  badgeCount?: number;
  badgeVariant?: 'danger' | 'warning' | 'info' | 'purple';
}

interface NavGroup {
  name: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { invoices, orders, products, hasPermission, activeTenant, activeCompany, activeBranch } = useERP();

  // Dynamic badge counts
  const overdueInvoicesCount = invoices.filter((i) => i.status === 'Overdue').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Processing' || o.status === 'Confirmed').length;
  const lowStockCount = products.filter((p) => p.stockQuantity <= p.reorderLevel).length;

  // Collapsible category groups to prevent clutter
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    'Governance & RBAC': false,
    'Platform Administration': false,
  });

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const navGroups: NavGroup[] = [
    {
      name: 'Core Overview',
      items: [
        {
          name: 'Executive Dashboard',
          module: 'Dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
      ],
    },
    {
      name: 'Billing & Commercial',
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
          name: 'Treasury & Payments',
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
      name: 'Supply & Operations',
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
      name: 'Ledger & Audit',
      items: [
        {
          name: 'General Ledger (GL)',
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
          icon: <Server className="w-4 h-4" />,
        },
      ],
    },
    {
      name: 'Platform Administration',
      items: [
        {
          name: 'SaaS Multi-Tenant Hub',
          module: 'SaaS Admin',
          icon: <Building2 className="w-4 h-4" />,
        },
        {
          name: 'System Settings',
          module: 'Settings',
          icon: <Sliders className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 bg-white/95 dark:bg-[#070b14]/95 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800/60 flex flex-col transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Executive Workspace Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/60 dark:border-slate-800/60 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 flex items-center justify-center text-white font-black text-base shadow-sm shadow-indigo-500/25 shrink-0 ring-1 ring-white/20">
            ▲
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate tracking-tight">
                  Apex Global
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              </div>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate">
                Enterprise ERP
              </p>
            </div>
          )}
        </div>

        {/* Sidebar collapse button */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors hidden lg:flex items-center justify-center cursor-pointer bg-transparent border-0"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => hasPermission(item.module, 'View'));
          if (visibleItems.length === 0) return null;

          const isGroupCollapsed = !isCollapsed && collapsedGroups[group.name];

          return (
            <div key={group.name} className="space-y-0.5">
              {!isCollapsed && (
                <div
                  onClick={() => toggleGroup(group.name)}
                  className="flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500/80 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <span>{group.name}</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 opacity-60 ${
                      isGroupCollapsed ? '-rotate-90' : 'rotate-0'
                    }`}
                  />
                </div>
              )}

              {!isGroupCollapsed && (
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const isActive = currentModule === item.module;

                    return (
                      <button
                        key={item.module}
                        onClick={() => onSelectModule(item.module)}
                        title={isCollapsed ? item.name : undefined}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer group relative border-0 outline-none text-left ${
                          isActive
                            ? 'bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                            : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                        } ${isCollapsed ? 'justify-center px-0' : ''}`}
                      >
                        {/* Active Accent Bar */}
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-600 dark:bg-indigo-400" />
                        )}

                        <span
                          className={`shrink-0 transition-colors ${
                            isActive
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                          }`}
                        >
                          {item.icon}
                        </span>

                        {!isCollapsed && (
                          <>
                            <span className="truncate flex-1 tracking-tight">{item.name}</span>
                            {item.badgeCount !== undefined && (
                              <span
                                className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-tight ${
                                  item.badgeVariant === 'danger'
                                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                                    : item.badgeVariant === 'warning'
                                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                    : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
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
              )}
            </div>
          );
        })}
      </div>

      {/* Sleek Executive Tenant Plan Status Footer */}
      {!isCollapsed && (
        <div className="p-3 m-3 rounded-xl bg-slate-50/80 dark:bg-[#0c1220] border border-slate-200/60 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              {activeTenant.plan} Tier
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200/50 dark:border-indigo-800/50">
              SOC2
            </span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
            {activeCompany.branches.length} Branches • IRD VAT Compliant
          </p>
        </div>
      )}
    </aside>
  );
};
