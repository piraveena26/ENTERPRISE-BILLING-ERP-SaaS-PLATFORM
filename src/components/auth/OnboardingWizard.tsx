import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Building,
  Coins,
  Receipt,
  CreditCard,
  Users,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { OnboardingBusinessIllustration } from '../common/SvgIllustrations';
import confetti from 'canvas-confetti';

const STEPS = [
  'Welcome',
  'Business Info',
  'Company Details',
  'Business Type',
  'Currency & FX',
  'Tax Configuration',
  'Financial Year',
  'Invoice Layout',
  'Payment Methods',
  'Users & Roles',
  'Complete Setup',
];

export const OnboardingWizard: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { activeCompany, setCurrency } = useERP();
  const [currentStep, setCurrentStep] = useState(0);

  // Form states
  const [businessName, setBusinessName] = useState(activeCompany.name);
  const [taxNumber, setTaxNumber] = useState(activeCompany.taxRegistrationNumber);
  const [svatNumber, setSvatNumber] = useState(activeCompany.svatNumber || 'SVAT-002941');
  const [businessType, setBusinessType] = useState('Enterprise Wholesale & Distribution');
  const [currency, setSelectedCurrency] = useState('LKR');
  const [vatRate, setVatRate] = useState(18); // 18% standard Sri Lanka VAT
  const [enableSSCL, setEnableSSCL] = useState(true); // 2.5% Sri Lanka SSCL
  const [financialYearStart, setFinancialYearStart] = useState('01-04'); // April 1st standard SL FY
  const [invoicePrefix, setInvoicePrefix] = useState('INV-2026-');

  const completionPercentage = Math.round(((currentStep + 1) / STEPS.length) * 100);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      triggerCelebration();
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-8 text-slate-900 dark:text-slate-100">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg">
            ▲
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Enterprise Setup Wizard</h2>
            <p className="text-xs text-slate-500">Configure your multi-tenant organization</p>
          </div>
        </div>

        {/* Progress Bar Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{completionPercentage}% Completed</span>
            <p className="text-[10px] text-slate-400">Step {currentStep + 1} of {STEPS.length}</p>
          </div>
          <div className="w-24 sm:w-36 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Step Container */}
      <div className="max-w-4xl mx-auto w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto flex flex-col md:flex-row min-h-[500px]">
        {/* Step Indicator Sidebar (Desktop) */}
        <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-800/40 p-6 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">Onboarding Flow</p>
          <div className="space-y-2">
            {STEPS.map((step, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div
                  key={step}
                  onClick={() => idx <= currentStep && setCurrentStep(idx)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : isPast
                      ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
                      : 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                      isCurrent
                        ? 'bg-white text-indigo-600'
                        : isPast
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {isPast ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                  </span>
                  <span className="truncate">{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Body */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Step 1: Welcome */}
            {currentStep === 0 && (
              <div className="text-center py-4">
                <OnboardingBusinessIllustration className="w-64 h-48 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Welcome to Apex Enterprise ERP
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                  Let&apos;s personalize your enterprise workspace in under 3 minutes. We&apos;ll configure your tax profile, multi-currency ledger, and corporate branding.
                </p>
              </div>
            )}

            {/* Step 2: Business Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Business Information</h3>
                <p className="text-xs text-slate-500">Legal corporate identification and trading entity details.</p>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Company Trading Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Registered Address</label>
                  <input
                    type="text"
                    defaultValue="Level 28, World Trade Center, Echelon Square, Colombo 01"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Company Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Registration & Tax Identification</h3>
                <p className="text-xs text-slate-500">Sri Lanka Inland Revenue Department (IRD) & VAT compliance.</p>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">VAT Registration Number (TIN)</label>
                  <input
                    type="text"
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Simplified VAT (SVAT) Number (Optional)</label>
                  <input
                    type="text"
                    value={svatNumber}
                    onChange={(e) => setSvatNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Business Type */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Business Model & Industry</h3>
                <p className="text-xs text-slate-500">We optimize chart of accounts and workflows for your industry.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Enterprise Wholesale & Distribution',
                    'Manufacturing & Assembly',
                    'IT Services & Software Consulting',
                    'Retail & Supermarket Chain',
                    'Logistics & Freight Forwarding',
                    'Import & Export Trading',
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBusinessType(type)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                        businessType === type
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Currency */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Base Reporting Currency</h3>
                <p className="text-xs text-slate-500">Select your default statutory accounting currency.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { code: 'LKR', label: 'Sri Lankan Rupee (Rs.)' },
                    { code: 'USD', label: 'US Dollar ($)' },
                    { code: 'EUR', label: 'Euro (€)' },
                    { code: 'GBP', label: 'British Pound (£)' },
                    { code: 'AED', label: 'UAE Dirham (AED)' },
                    { code: 'SGD', label: 'Singapore Dollar (S$)' },
                  ].map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setSelectedCurrency(c.code);
                        setCurrency(c.code as any);
                      }}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                        currency === c.code
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <p className="font-extrabold text-sm">{c.code}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{c.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Tax Configuration */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Tax & Statutory Compliance</h3>
                <p className="text-xs text-slate-500">Preset with current Sri Lanka Inland Revenue fiscal mandates.</p>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">Value Added Tax (VAT)</p>
                      <p className="text-xs text-slate-400">Current statutory standard rate</p>
                    </div>
                    <span className="text-sm font-extrabold px-3 py-1 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-lg">
                      18.0%
                    </span>
                  </div>
                  <hr className="border-slate-200 dark:border-slate-700" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">Social Security Contribution Levy (SSCL)</p>
                      <p className="text-xs text-slate-400">2.5% statutory turnover levy</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableSSCL}
                        onChange={(e) => setEnableSSCL(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-xs font-bold">{enableSSCL ? 'Enabled (2.5%)' : 'Exempt'}</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Financial Year */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Financial Year Cycle</h3>
                <p className="text-xs text-slate-500">Accounting calendar for audit and period close.</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFinancialYearStart('01-04')}
                    className={`p-4 rounded-xl border text-left text-xs font-semibold ${
                      financialYearStart === '01-04'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <p className="font-extrabold text-sm">April 1 – March 31</p>
                    <p className="text-[11px] text-slate-400 mt-1">Standard for Sri Lanka & UK fiscal years</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinancialYearStart('01-01')}
                    className={`p-4 rounded-xl border text-left text-xs font-semibold ${
                      financialYearStart === '01-01'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <p className="font-extrabold text-sm">January 1 – December 31</p>
                    <p className="text-[11px] text-slate-400 mt-1">Standard calendar year accounting</p>
                  </button>
                </div>
              </div>
            )}

            {/* Step 8: Invoice Layout */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Invoice Numbering & Layout</h3>
                <p className="text-xs text-slate-500">Configure sequential invoice numbering.</p>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Invoice Prefix</label>
                  <input
                    type="text"
                    value={invoicePrefix}
                    onChange={(e) => setInvoicePrefix(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Next invoice: <strong>{invoicePrefix}0005</strong></p>
                </div>
              </div>
            )}

            {/* Step 9: Payment Methods */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Payment Channels</h3>
                <p className="text-xs text-slate-500">Active settlement methods accepted from customers.</p>
                <div className="space-y-2">
                  {[
                    'Direct Bank Remittance (CEFT / SLIPS / SWIFT)',
                    'Online Credit/Debit Cards (Stripe / PayHere LK)',
                    'Commercial Cheques',
                    'Cash Counter Collection',
                  ].map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-medium">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 10: Users */}
            {currentStep === 9 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Administrator & Key Staff</h3>
                <p className="text-xs text-slate-500">Your master tenant owner credentials are configured.</p>
                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs">
                  <p className="font-bold text-slate-900 dark:text-white">Tenant Owner: Priyantha De Silva</p>
                  <p className="text-slate-500">Role: Tenant Owner • Full Administrative & Financial Approval Rights</p>
                </div>
              </div>
            )}

            {/* Step 11: Complete Setup */}
            {currentStep === 10 && (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Enterprise ERP Configuration Complete!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                  Your tenant workspace for <strong>{businessName}</strong> is fully initialized with Sri Lanka tax compliance, multi-currency ledger, and warehouse logistics.
                </p>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-none flex items-center gap-2 cursor-pointer"
            >
              <span>{currentStep === STEPS.length - 1 ? 'Launch ERP Dashboard' : 'Save & Continue'}</span>
              {currentStep === STEPS.length - 1 ? <Sparkles className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 py-2">
        Apex Enterprise Billing & ERP SaaS Platform • Multi-Tenant Compliant
      </div>
    </div>
  );
};
