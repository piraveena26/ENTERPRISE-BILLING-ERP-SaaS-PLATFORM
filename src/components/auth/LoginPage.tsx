import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, Lock, Mail, Building2, Sparkles } from 'lucide-react';
import { FinanceIllustration } from '../common/SvgIllustrations';
import { useERP } from '../../context/ERPContext';
import { EnterpriseRole } from '../../types/erp';

export const LoginPage: React.FC = () => {
  const { login, setRole } = useERP();
  const [email, setEmail] = useState('priyantha@apexglobal.lk');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login();
      setIsLoading(false);
    }, 600);
  };

  const handleQuickDemoLogin = (role: EnterpriseRole, demoEmail: string) => {
    setRole(role);
    setEmail(demoEmail);
    setIsLoading(true);
    setTimeout(() => {
      login();
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Left Column: Visual Value Proposition & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-12 flex-col justify-between relative overflow-hidden text-white">
        {/* Subtle grid background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center font-black text-xl shadow-lg">
            ▲
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Apex Enterprise SaaS</h2>
            <p className="text-xs text-indigo-300 font-medium tracking-wide">
              Global Billing & Multi-Tenant ERP Platform
            </p>
          </div>
        </div>

        {/* Center Illustration & Copy */}
        <div className="relative z-10 my-auto py-8">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Enterprise Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
              Everything your business needs to manage, bill, and scale globally.
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              Engineered specifically for Sri Lankan corporate compliance (VAT 18%, SSCL 2.5%, SVAT) alongside seamless international multi-currency trading across Asia, Middle East, and Europe.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-3">
              {[
                'Sri Lanka IRD-compliant tax engine (VAT 18% & SSCL 2.5%)',
                'Multi-tenant, multi-company & multi-warehouse topology',
                'Automated general ledger & bank reconciliation workflows',
                'Enterprise 13-role granular RBAC and audit trail validation',
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <FinanceIllustration className="w-full max-w-sm h-auto text-indigo-400 opacity-90" />
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-indigo-900/60 pt-6">
          <span>© 2026 Apex Global Enterprise Systems</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" /> ISO 27001 & SOC2 Certified
          </span>
        </div>
      </div>

      {/* Right Column: Authentication Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="lg:hidden flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg">
                ▲
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white text-lg">Apex ERP</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Sign in to your portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Enter your corporate credentials or choose a pre-configured role to inspect the system.
            </p>
          </div>

          {/* Quick Demo Role Selector Pills */}
          <div className="p-3.5 bg-indigo-50/70 dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-slate-800">
            <p className="text-[11px] font-bold uppercase text-indigo-900 dark:text-indigo-300 tracking-wider mb-2">
              Instant Demo Access (Select Persona):
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Tenant Owner', 'priyantha@apexglobal.lk')}
                className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-left hover:border-indigo-500 transition-colors shadow-2xs"
              >
                <p className="font-bold text-slate-900 dark:text-white">Tenant Owner</p>
                <p className="text-[10px] text-slate-400">Full executive access</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Finance Manager', 'mahesh.fin@apexglobal.lk')}
                className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-left hover:border-indigo-500 transition-colors shadow-2xs"
              >
                <p className="font-bold text-slate-900 dark:text-white">Finance Manager</p>
                <p className="text-[10px] text-slate-400">Tax, Invoices, Ledger</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Sales Manager', 'sales.mgr@apexglobal.lk')}
                className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-left hover:border-indigo-500 transition-colors shadow-2xs"
              >
                <p className="font-bold text-slate-900 dark:text-white">Sales Executive</p>
                <p className="text-[10px] text-slate-400">Quotes & Orders</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Super Admin', 'admin@enterprisegrid.io')}
                className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-left hover:border-indigo-500 transition-colors shadow-2xs"
              >
                <p className="font-bold text-slate-900 dark:text-white">SaaS Super Admin</p>
                <p className="text-[10px] text-slate-400">Platform & Tenants</p>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <a href="#forgot" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm shadow-md shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to ERP Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
