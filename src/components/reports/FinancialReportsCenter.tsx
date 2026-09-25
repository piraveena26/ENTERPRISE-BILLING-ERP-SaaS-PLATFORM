import React, { useState } from 'react';
import {
  PieChart,
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
  ArrowRight,
  TrendingUp,
  Landmark,
  ShieldCheck,
  CheckCircle,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface ReportCard {
  id: string;
  title: string;
  category: 'Financial' | 'Sales' | 'Tax' | 'Logistics';
  description: string;
  cadence: 'Monthly' | 'Quarterly' | 'Real-time';
}

export const FinancialReportsCenter: React.FC = () => {
  const { activeCurrency, activeCompany, activeBranch } = useERP();
  const [selectedReport, setSelectedReport] = useState<ReportCard | null>(null);
  const [dateRange, setDateRange] = useState('2026-04-01 to 2026-09-30');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const reportList: ReportCard[] = [
    {
      id: 'pnl',
      title: 'Profit & Loss Statement (P&L)',
      category: 'Financial',
      description: 'Comprehensive statement of corporate revenue, COGS, operating overheads, and net profit margins.',
      cadence: 'Monthly',
    },
    {
      id: 'balance-sheet',
      title: 'Balance Sheet & Financial Position',
      category: 'Financial',
      description: 'Snapshot of enterprise assets, trade liabilities, statutory obligations, and shareholder stated equity.',
      cadence: 'Quarterly',
    },
    {
      id: 'cash-flow',
      title: 'Cash Flow Statement',
      category: 'Financial',
      description: 'Cash inflows and outflows segregated into operating, investing, and financing business activities.',
      cadence: 'Monthly',
    },
    {
      id: 'trial-balance',
      title: 'Adjusted Trial Balance',
      category: 'Financial',
      description: 'Verification of double-entry ledger parity across all asset, liability, equity, income, and expense codes.',
      cadence: 'Monthly',
    },
    {
      id: 'tax-ird',
      title: 'Sri Lanka IRD Statutory Tax Return (VAT & SSCL)',
      category: 'Tax',
      description: 'Itemized 18% VAT output/input schedules, 2.5% SSCL turnover calculations, and SVAT credit schedules.',
      cadence: 'Monthly',
    },
    {
      id: 'receivables-aging',
      title: 'Accounts Receivable Aging Analysis',
      category: 'Financial',
      description: 'Customer credit exposure and delinquent invoice breakdown across 30, 60, and 90+ day intervals.',
      cadence: 'Real-time',
    },
    {
      id: 'sales-analysis',
      title: 'Sales & Billing Performance Report',
      category: 'Sales',
      description: 'Volume and margin velocity ranked by customer tier, product category, and regional branches.',
      cadence: 'Real-time',
    },
    {
      id: 'inventory-val',
      title: 'Inventory Valuation & Stock Turnover',
      category: 'Logistics',
      description: 'Warehouse FIFO valuation, carrying costs, and fast vs slow-moving stock aging telemetry.',
      cadence: 'Monthly',
    },
  ];

  const filteredReports =
    selectedCategory === 'All'
      ? reportList
      : reportList.filter((r) => r.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Financial & Statutory Reports Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Generate audited IFRS/LKAS corporate financial statements and Inland Revenue tax schedules
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'Financial', 'Sales', 'Tax', 'Logistics'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Period: Q1-Q2 FY2026-27</span>
          </div>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredReports.map((rep) => (
          <div
            key={rep.id}
            onClick={() => setSelectedReport(rep)}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                  <PieChart className="w-5 h-5" />
                </span>
                <Badge variant="outline" size="sm">{rep.cadence}</Badge>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-snug">
                {rep.title}
              </h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                {rep.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">{rep.category} Category</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Preview <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Report Preview Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={selectedReport.title}
          subtitle={`Reporting Entity: ${activeCompany.name} • Period: ${dateRange}`}
          maxWidth="2xl"
          footer={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="w-3.5 h-3.5 mr-1" /> Print Report
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert('Exporting verified financial dataset in spreadsheet format...');
                }}
              >
                <Download className="w-3.5 h-3.5 mr-1" /> Export Excel
              </Button>
            </div>
          }
        >
          <div className="space-y-6 text-xs">
            {/* Header info */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <p className="font-extrabold text-sm text-slate-900 dark:text-white">{activeCompany.name}</p>
                <p className="text-slate-400">TIN: {activeCompany.taxRegistrationNumber} • SVAT: {activeCompany.svatNumber}</p>
              </div>
              <Badge variant="success" size="sm">Audited & Reconciled</Badge>
            </div>

            {/* P&L Mock view */}
            {selectedReport.id === 'pnl' && (
              <div className="space-y-3">
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold">
                      <tr>
                        <th className="p-3">Financial Line Category</th>
                        <th className="p-3 text-right">Amount ({activeCurrency})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">Gross Revenue & Services Billed</td>
                        <td className="p-3 text-right font-bold">{formatCurrency(101640000, activeCurrency)}</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-slate-600 dark:text-slate-400 pl-6">Less: Cost of Goods Sold (COGS)</td>
                        <td className="p-3 text-right text-rose-600 font-medium">-{formatCurrency(42100000, activeCurrency)}</td>
                      </tr>
                      <tr className="bg-slate-50/50 dark:bg-slate-800/20 font-bold">
                        <td className="p-3">Gross Profit</td>
                        <td className="p-3 text-right text-emerald-600">{formatCurrency(59540000, activeCurrency)}</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-slate-600 dark:text-slate-400 pl-6">Operating Payroll & Executive Salaries</td>
                        <td className="p-3 text-right text-rose-600 font-medium">-{formatCurrency(14800000, activeCurrency)}</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-slate-600 dark:text-slate-400 pl-6">Datacenter Cloud Operations & AWS SLA</td>
                        <td className="p-3 text-right text-rose-600 font-medium">-{formatCurrency(4950000, activeCurrency)}</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-slate-600 dark:text-slate-400 pl-6">Freight Logistics & Container Delivery</td>
                        <td className="p-3 text-right text-rose-600 font-medium">-{formatCurrency(3120000, activeCurrency)}</td>
                      </tr>
                      <tr className="bg-indigo-50/60 dark:bg-indigo-950/40 text-sm font-black border-t-2 border-indigo-200 dark:border-indigo-800">
                        <td className="p-3 text-indigo-900 dark:text-indigo-200">Net Operating Earnings (EBITDA)</td>
                        <td className="p-3 text-right text-indigo-600 dark:text-indigo-300">
                          {formatCurrency(36670000, activeCurrency)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tax IRD Mock view */}
            {selectedReport.id === 'tax-ird' && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900">
                  <p className="font-bold text-indigo-900 dark:text-indigo-200">
                    Sri Lanka Inland Revenue Department (IRD) Fiscal Schedule
                  </p>
                  <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-0.5">
                    Compliant with Value Added Tax Act No. 14 of 2002 and Social Security Contribution Levy Act No. 25 of 2022.
                  </p>
                </div>
                <div className="space-y-2 border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
                  <div className="flex justify-between py-1">
                    <span>Liable Turnover Subject to Standard 18% VAT</span>
                    <span className="font-bold">{formatCurrency(78200000, activeCurrency)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Output VAT Collected (18.0%)</span>
                    <span className="font-bold text-indigo-600">{formatCurrency(14076000, activeCurrency)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Eligible Input VAT Credit Claimed</span>
                    <span className="font-bold text-emerald-600">-{formatCurrency(7578000, activeCurrency)}</span>
                  </div>
                  <hr className="border-slate-200 dark:border-slate-700" />
                  <div className="flex justify-between py-1 font-bold">
                    <span>Net VAT Payable to Inland Revenue</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(6498000, activeCurrency)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Social Security Contribution Levy Payable (2.5%)</span>
                    <span className="font-bold text-amber-600">{formatCurrency(1955000, activeCurrency)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Generic fallback preview for other reports */}
            {selectedReport.id !== 'pnl' && selectedReport.id !== 'tax-ird' && (
              <div className="p-6 text-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                <FileSpreadsheet className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
                <p className="font-bold text-sm text-slate-900 dark:text-white">{selectedReport.title} Table Data</p>
                <p className="text-slate-400 mt-1">Full statement generated with active multi-currency conversion rates.</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
