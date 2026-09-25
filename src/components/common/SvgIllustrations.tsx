import React from 'react';

// ============================================================================
// Enterprise Custom SVG Illustrations
// Scalable, theme-aware graphics for Dashboards, Onboarding, and Empty States
// ============================================================================

export const FinanceIllustration: React.FC<{ className?: string }> = ({ className = 'w-64 h-48' }) => (
  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="finGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
      </linearGradient>
    </defs>
    {/* Background Platform Grid */}
    <rect x="20" y="30" width="360" height="240" rx="16" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1.5" />
    {/* Floating Card 1: Revenue Metric */}
    <rect x="45" y="60" width="140" height="75" rx="12" fill="white" className="dark:fill-slate-800" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.06))" />
    <circle cx="70" cy="85" r="14" fill="#e0e7ff" />
    <path d="M65 85L69 89L75 81" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="95" y="78" width="70" height="8" rx="4" fill="#94a3b8" />
    <rect x="95" y="94" width="45" height="12" rx="4" fill="#4f46e5" />
    {/* Floating Card 2: Growth Trend */}
    <rect x="210" y="60" width="145" height="120" rx="12" fill="white" className="dark:fill-slate-800" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.06))" />
    <path d="M225 150 C 245 130, 260 145, 280 110 C 300 85, 320 95, 340 75" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
    <path d="M225 150 C 245 130, 260 145, 280 110 C 300 85, 320 95, 340 75 L 340 165 L 225 165 Z" fill="url(#chartGrad)" />
    {/* Floating Card 3: Enterprise Ledger Bar */}
    <rect x="45" y="155" width="310" height="90" rx="12" fill="white" className="dark:fill-slate-800" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.06))" />
    <line x1="65" y1="180" x2="335" y2="180" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
    <rect x="65" y="195" width="80" height="8" rx="4" fill="#6366f1" />
    <rect x="65" y="215" width="120" height="6" rx="3" fill="#cbd5e1" />
    <rect x="260" y="195" width="75" height="26" rx="6" fill="#10b981" fillOpacity="0.15" />
    <text x="297" y="212" textAnchor="middle" fill="#059669" fontSize="11" fontWeight="700">VERIFIED</text>
  </svg>
);

export const EmptyInvoicesIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-40' }) => (
  <svg viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="invDocGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
    </defs>
    <rect x="75" y="30" width="150" height="180" rx="14" fill="url(#invDocGrad)" stroke="#cbd5e1" strokeWidth="2" />
    {/* Fold corner */}
    <path d="M195 30 L225 60 L195 60 Z" fill="#cbd5e1" />
    <rect x="95" y="65" width="55" height="10" rx="4" fill="#4f46e5" />
    <rect x="95" y="85" width="110" height="6" rx="3" fill="#94a3b8" />
    <rect x="95" y="100" width="110" height="6" rx="3" fill="#94a3b8" />
    <rect x="95" y="125" width="110" height="35" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="1" />
    <circle cx="150" cy="185" r="14" fill="#e0e7ff" />
    <path d="M145 185H155M150 180V190" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const EmptyWarehouseIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-40' }) => (
  <svg viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M40 180L150 120L260 180L150 240L40 180Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
    <path d="M150 120V240" stroke="#94a3b8" strokeWidth="1.5" />
    {/* Pallet Stack */}
    <rect x="100" y="80" width="40" height="40" rx="4" fill="#6366f1" fillOpacity="0.8" />
    <rect x="150" y="60" width="45" height="45" rx="4" fill="#818cf8" fillOpacity="0.8" />
    <rect x="120" y="30" width="42" height="42" rx="4" fill="#4f46e5" />
    <circle cx="150" cy="190" r="25" fill="#f1f5f9" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M140 190H160" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const OnboardingBusinessIllustration: React.FC<{ className?: string }> = ({ className = 'w-72 h-56' }) => (
  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="30" y="40" width="340" height="220" rx="16" fill="white" stroke="#e2e8f0" className="dark:fill-slate-800 dark:stroke-slate-700" strokeWidth="2" />
    {/* Header bar */}
    <rect x="30" y="40" width="340" height="40" rx="16" fill="#4f46e5" />
    <circle cx="55" cy="60" r="5" fill="#fca5a5" />
    <circle cx="72" cy="60" r="5" fill="#fde047" />
    <circle cx="89" cy="60" r="5" fill="#86efac" />
    <rect x="120" y="54" width="160" height="12" rx="6" fill="#ffffff" fillOpacity="0.3" />
    {/* Body content setup */}
    <rect x="60" y="105" width="80" height="75" rx="8" fill="#e0e7ff" />
    <circle cx="100" cy="135" r="18" fill="#4f46e5" />
    <path d="M94 135L98 139L106 131" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="160" y="110" width="180" height="14" rx="4" fill="#334155" className="dark:fill-slate-200" />
    <rect x="160" y="132" width="130" height="10" rx="4" fill="#94a3b8" />
    <rect x="160" y="150" width="150" height="10" rx="4" fill="#94a3b8" />
    <rect x="60" y="200" width="280" height="35" rx="8" fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="1" />
    <text x="200" y="222" textAnchor="middle" fill="#059669" fontSize="12" fontWeight="700">Tax Compliant Setup Ready</text>
  </svg>
);
