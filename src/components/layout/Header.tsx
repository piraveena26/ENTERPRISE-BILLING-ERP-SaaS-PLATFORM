import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  Building2,
  MapPin,
  ChevronDown,
  Shield,
  Coins,
  LogOut,
  HelpCircle,
  Menu,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { CurrencyCode, EnterpriseRole, AppModule } from '../../types/erp';
import { ALL_ROLES } from '../../data/demoData';
import { CURRENCIES } from '../../utils/formatters';

export interface HeaderProps {
  onOpenCommandPalette: () => void;
  onOpenNotifications: () => void;
  onQuickCreate: (type: 'invoice' | 'quotation' | 'customer' | 'product' | 'payment') => void;
  onToggleSidebar: () => void;
  onNavigateModule: (module: AppModule) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCommandPalette,
  onOpenNotifications,
  onQuickCreate,
  onToggleSidebar,
  onNavigateModule,
}) => {
  const {
    activeTenant,
    activeCompany,
    activeBranch,
    setActiveBranch,
    activeCurrency,
    setCurrency,
    currentRole,
    setRole,
    userSession,
    theme,
    toggleTheme,
    notifications,
    logout,
  } = useERP();

  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 transition-colors">
      {/* Left Area: Mobile hamburger + Global Search Input */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2.5 px-3 py-1.5 w-48 sm:w-64 md:w-80 text-xs sm:text-sm bg-slate-100/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-colors text-left"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">Search ERP records...</span>
          <kbd className="hidden sm:inline-block ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-500">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Quick Create Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs shadow-indigo-200 dark:shadow-none transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {isQuickCreateOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-40 text-xs text-slate-700 dark:text-slate-300 animate-in fade-in zoom-in-95 duration-100"
              onClick={() => setIsQuickCreateOpen(false)}
            >
              <button
                onClick={() => onQuickCreate('invoice')}
                className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 font-medium flex items-center gap-2"
              >
                <span>Create Invoice</span>
              </button>
              <button
                onClick={() => onQuickCreate('quotation')}
                className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 font-medium flex items-center gap-2"
              >
                <span>Create Quotation</span>
              </button>
              <button
                onClick={() => onQuickCreate('payment')}
                className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 font-medium flex items-center gap-2"
              >
                <span>Record Payment</span>
              </button>
              <hr className="my-1 border-slate-100 dark:border-slate-800" />
              <button
                onClick={() => onQuickCreate('customer')}
                className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 font-medium flex items-center gap-2"
              >
                <span>Add Customer</span>
              </button>
              <button
                onClick={() => onQuickCreate('product')}
                className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 font-medium flex items-center gap-2"
              >
                <span>Add Product</span>
              </button>
            </div>
          )}
        </div>

        {/* Currency Switcher */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            title="Active Transaction Currency"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>{activeCurrency}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isCurrencyMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-40 text-xs animate-in fade-in zoom-in-95 duration-100"
              onClick={() => setIsCurrencyMenuOpen(false)}
            >
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((cCode) => (
                <button
                  key={cCode}
                  onClick={() => setCurrency(cCode)}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 ${
                    activeCurrency === cCode ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span>{cCode} - {CURRENCIES[cCode].name}</span>
                  <span>{CURRENCIES[cCode].symbol}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Branch Switcher */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => setIsBranchMenuOpen(!isBranchMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 max-w-[170px]"
            title="Active Operational Branch"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{activeBranch.name.split(' ')[0]} HQ</span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {isBranchMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-40 text-xs animate-in fade-in zoom-in-95 duration-100"
              onClick={() => setIsBranchMenuOpen(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Operating Branches ({activeCompany.branches.length})
              </div>
              {activeCompany.branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBranch(b)}
                  className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 ${
                    activeBranch.id === b.id ? 'font-bold text-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-xs">{b.name}</p>
                    <p className="text-[10px] text-slate-400">{b.city} • Code: {b.code}</p>
                  </div>
                  {b.isHeadquarters && (
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                      HQ
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic RBAC Role Simulation Switcher */}
        <div className="relative hidden xl:block">
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-800"
            title="Simulate Enterprise Role"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="truncate">{currentRole}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {isRoleMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 max-h-72 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-40 text-xs animate-in fade-in zoom-in-95 duration-100"
              onClick={() => setIsRoleMenuOpen(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Switch Role Profile
              </div>
              {ALL_ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setRole(role)}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 ${
                    currentRole === role ? 'font-bold text-indigo-600 bg-indigo-50 dark:bg-slate-800' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Notifications Trigger */}
        <button
          onClick={onOpenNotifications}
          aria-label="Open notifications"
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
          )}
        </button>

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <img
              src={userSession.avatar}
              alt={userSession.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
          </button>

          {isProfileMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-40 text-xs animate-in fade-in zoom-in-95 duration-100"
              onClick={() => setIsProfileMenuOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white text-sm">{userSession.name}</p>
                <p className="text-slate-400 text-[11px] truncate">{userSession.email}</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400">
                  {currentRole}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => onNavigateModule('Settings')}
                  className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Tenant & System Settings
                </button>
                <button
                  onClick={() => onNavigateModule('Audit Logs')}
                  className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Security & Audit Log
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
