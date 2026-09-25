import React, { useState } from 'react';
import {
  Building2,
  Receipt,
  Landmark,
  Users,
  Bell,
  Link,
  Shield,
  CheckCircle,
  Save,
  Globe,
  Lock,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Button } from '../common/Button';

export const SettingsCenter: React.FC = () => {
  const { activeCompany, activeBranch, activeCurrency } = useERP();
  const [activeSection, setActiveSection] = useState<'business' | 'billing' | 'security' | 'integrations'>('business');

  // Business state
  const [companyName, setCompanyName] = useState(activeCompany.name);
  const [taxReg, setTaxReg] = useState(activeCompany.taxRegistrationNumber);
  const [svat, setSvat] = useState(activeCompany.svatNumber || 'SVAT-002941');
  const [email, setEmail] = useState(activeCompany.email);
  const [phone, setPhone] = useState(activeCompany.phone);
  const [address, setAddress] = useState(activeCompany.address);

  // Security state
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          System & Enterprise Settings Center
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure corporate legal identity, Inland Revenue tax numbers, payment gateways, and security policies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          {[
            { id: 'business' as const, label: 'Company & Branches', icon: <Building2 className="w-4 h-4" /> },
            { id: 'billing' as const, label: 'Taxes & Invoicing', icon: <Receipt className="w-4 h-4" /> },
            { id: 'security' as const, label: 'Security & MFA', icon: <Shield className="w-4 h-4" /> },
            { id: 'integrations' as const, label: 'Bank & Gateways', icon: <Link className="w-4 h-4" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeSection === item.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Form Panel */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          {activeSection === 'business' && (
            <div className="space-y-5 text-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Corporate Entity Details</h3>
              <p className="text-slate-400">Legal trading entity information displayed on official tax invoices.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Company Trading Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">VAT TIN Number (Sri Lanka)</label>
                  <input
                    type="text"
                    value={taxReg}
                    onChange={(e) => setTaxReg(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Simplified VAT (SVAT) Number</label>
                  <input
                    type="text"
                    value={svat}
                    onChange={(e) => setSvat(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Official Contact Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Registered Corporate Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button variant="primary" onClick={() => alert('Company profile saved successfully!')}>
                  Save Business Changes
                </Button>
              </div>
            </div>
          )}

          {activeSection === 'billing' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Tax Rules & Invoicing Setup</h3>
              <p className="text-slate-400">Configure statutory rates and sequential numbering.</p>

              <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold block">Sri Lanka Value Added Tax (VAT)</span>
                    <span className="text-slate-400 text-[11px]">Applied to all standard supply of goods and services</span>
                  </div>
                  <span className="font-extrabold text-sm text-indigo-600">18.0%</span>
                </div>
                <hr className="border-slate-200 dark:border-slate-700" />
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold block">Social Security Contribution Levy (SSCL)</span>
                    <span className="text-slate-400 text-[11px]">Turnover levy for wholesale & retail distributors</span>
                  </div>
                  <span className="font-extrabold text-sm text-indigo-600">2.5%</span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Enterprise Security & Compliance</h3>
              <p className="text-slate-400">Enforce authentication guardrails and session policies.</p>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <div>
                    <span className="font-bold block text-slate-900 dark:text-white">Mandatory Two-Factor Authentication (2FA / MFA)</span>
                    <span className="text-slate-400 text-[11px]">Enforce hardware TOTP token for all finance and admin roles</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mfaEnforced}
                    onChange={(e) => setMfaEnforced(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </label>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <span className="font-bold block text-slate-900 dark:text-white">Idle Workstation Inactivity Timeout</span>
                    <span className="text-slate-400 text-[11px]">Automatically terminate session on inactivity</span>
                  </div>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">60 Minutes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Payment Gateways & Banking Bridges</h3>
              <p className="text-slate-400">Connected settlement APIs for Sri Lankan and international payment processing.</p>

              <div className="space-y-3">
                {[
                  { name: 'Commercial Bank of Ceylon (Direct CEFT API)', status: 'Connected', desc: 'Real-time corporate inward remittance webhook' },
                  { name: 'PayHere Sri Lanka (Online Visa/Master/eZ Cash)', status: 'Active', desc: 'Central Bank of Sri Lanka approved aggregator' },
                  { name: 'Stripe International Multi-Currency', status: 'Connected', desc: 'USD / EUR / GBP cross-border card checkout' },
                ].map((int, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{int.name}</span>
                      <span className="text-[11px] text-slate-400">{int.desc}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                      {int.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
