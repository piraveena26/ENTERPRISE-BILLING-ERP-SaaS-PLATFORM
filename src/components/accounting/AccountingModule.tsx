import React, { useState } from 'react';
import {
  Landmark,
  BookOpen,
  Plus,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Building,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { ChartAccount, JournalEntry } from '../../types/erp';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatCard } from '../common/StatCard';
import { Table, Column } from '../common/Table';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export const AccountingModule: React.FC = () => {
  const { chartOfAccounts, journalEntries, activeCurrency, createJournalEntry } = useERP();
  const [activeTab, setActiveTab] = useState<'coa' | 'journal'>('coa');
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  // New Journal Voucher Form
  const [jvDate, setJvDate] = useState(new Date().toISOString().substring(0, 10));
  const [jvRef, setJvRef] = useState('JV-MANUAL-');
  const [jvNarration, setJvNarration] = useState('Period end depreciation and accruals adjustment');
  const [debitAccountId, setDebitAccountId] = useState(chartOfAccounts[0]?.id || '');
  const [creditAccountId, setCreditAccountId] = useState(chartOfAccounts[1]?.id || '');
  const [jvAmount, setJvAmount] = useState(500000);

  // Compute Balances
  const totalAssets = chartOfAccounts.filter((a) => a.type === 'Asset').reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = chartOfAccounts.filter((a) => a.type === 'Liability').reduce((sum, a) => sum + a.balance, 0);
  const totalEquity = chartOfAccounts.filter((a) => a.type === 'Equity').reduce((sum, a) => sum + a.balance, 0);
  const totalRevenue = chartOfAccounts.filter((a) => a.type === 'Revenue').reduce((sum, a) => sum + a.balance, 0);

  const handlePostJV = (e: React.FormEvent) => {
    e.preventDefault();
    const debAcc = chartOfAccounts.find((a) => a.id === debitAccountId);
    const credAcc = chartOfAccounts.find((a) => a.id === creditAccountId);
    if (!debAcc || !credAcc || jvAmount <= 0) return;

    createJournalEntry({
      entryNumber: `JV-2026-${String(journalEntries.length + 47).padStart(4, '0')}`,
      date: jvDate,
      reference: jvRef,
      narration: jvNarration,
      lines: [
        {
          accountId: debAcc.id,
          accountNumber: debAcc.accountNumber,
          accountName: debAcc.name,
          debit: jvAmount,
          credit: 0,
          description: jvNarration,
        },
        {
          accountId: credAcc.id,
          accountNumber: credAcc.accountNumber,
          accountName: credAcc.name,
          debit: 0,
          credit: jvAmount,
          description: jvNarration,
        },
      ],
      totalDebit: jvAmount,
      totalCredit: jvAmount,
      createdBy: 'Priyantha De Silva (Senior Accountant)',
    });

    setIsJournalModalOpen(false);
  };

  const coaColumns: Column<ChartAccount>[] = [
    {
      header: 'Account Code',
      render: (a) => (
        <span className="font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
          {a.accountNumber}
        </span>
      ),
    },
    {
      header: 'Account Title',
      accessorKey: 'name',
      render: (a) => (
        <span className="font-bold text-slate-900 dark:text-white block">{a.name}</span>
      ),
    },
    {
      header: 'Category',
      render: (a) => {
        const variant =
          a.type === 'Asset'
            ? 'success'
            : a.type === 'Liability'
            ? 'danger'
            : a.type === 'Revenue'
            ? 'purple'
            : a.type === 'Expense'
            ? 'warning'
            : 'neutral';
        return <Badge variant={variant} size="sm">{a.type}</Badge>;
      },
    },
    {
      header: 'Normal Balance',
      render: (a) => (
        <span className="text-xs text-slate-500 font-semibold">
          {a.isDebitNormal ? 'Debit (DR)' : 'Credit (CR)'}
        </span>
      ),
    },
    {
      header: 'Current Book Balance',
      align: 'right',
      render: (a) => (
        <span className="font-extrabold text-slate-900 dark:text-white text-xs">
          {formatCurrency(a.balance, a.currency)}
        </span>
      ),
    },
  ];

  const journalColumns: Column<JournalEntry>[] = [
    {
      header: 'Voucher Number',
      render: (je) => (
        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
          {je.entryNumber}
        </span>
      ),
    },
    {
      header: 'Date',
      render: (je) => formatDate(je.date),
    },
    {
      header: 'Reference',
      render: (je) => <span className="font-mono text-xs">{je.reference}</span>,
    },
    {
      header: 'Narration & Memo',
      accessorKey: 'narration',
      render: (je) => (
        <span className="text-xs text-slate-700 dark:text-slate-300 line-clamp-1">
          {je.narration}
        </span>
      ),
    },
    {
      header: 'Debit Total',
      align: 'right',
      render: (je) => (
        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
          {formatCurrency(je.totalDebit, activeCurrency)}
        </span>
      ),
    },
    {
      header: 'Credit Total',
      align: 'right',
      render: (je) => (
        <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">
          {formatCurrency(je.totalCredit, activeCurrency)}
        </span>
      ),
    },
    {
      header: 'Action',
      align: 'center',
      render: (je) => (
        <Button variant="outline" size="sm" onClick={() => setSelectedEntry(je)}>
          Inspect
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            General Ledger & Chart of Accounts
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Double-entry accounting, statutory tax ledgers, and automated journal voucher postings
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsJournalModalOpen(true)}
        >
          Post Journal Entry
        </Button>
      </div>

      {/* 4 Accounting Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Assets"
          value={formatCurrency(totalAssets, activeCurrency)}
          subtitle="Cash, AR & Inventory"
          trend="up"
          changePercentage={8.2}
          icon={<Landmark className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/40"
        />

        <StatCard
          title="Total Liabilities"
          value={formatCurrency(totalLiabilities, activeCurrency)}
          subtitle="Trade Payables, VAT & SSCL"
          trend="neutral"
          icon={<CreditCard className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          iconBg="bg-amber-50 dark:bg-amber-950/40"
        />

        <StatCard
          title="Shareholders Equity"
          value={formatCurrency(totalEquity, activeCurrency)}
          subtitle="Stated Capital + Retained"
          trend="up"
          icon={<Building className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/40"
        />

        <StatCard
          title="Book Revenue"
          value={formatCurrency(totalRevenue, activeCurrency)}
          subtitle="Recognized Gross Sales"
          trend="up"
          changePercentage={18.4}
          icon={<TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
          iconBg="bg-purple-50 dark:bg-purple-950/40"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('coa')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-colors ${
            activeTab === 'coa'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Chart of Accounts ({chartOfAccounts.length})
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-colors ${
            activeTab === 'journal'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          General Journal Vouchers ({journalEntries.length})
        </button>
      </div>

      {activeTab === 'coa' ? (
        <Table
          columns={coaColumns}
          data={chartOfAccounts}
          keyExtractor={(a) => a.id}
          searchPlaceholder="Search accounts by code, title, type..."
        />
      ) : (
        <Table
          columns={journalColumns}
          data={journalEntries}
          keyExtractor={(je) => je.id}
          searchPlaceholder="Search journal entries..."
          onRowClick={(je) => setSelectedEntry(je)}
        />
      )}

      {/* Post Journal Entry Modal */}
      <Modal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        title="Post General Journal Voucher"
        subtitle="Ensure debits equal credits before posting to general ledger"
        maxWidth="lg"
      >
        <form onSubmit={handlePostJV} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Voucher Date
              </label>
              <input
                type="date"
                value={jvDate}
                onChange={(e) => setJvDate(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Reference Code
              </label>
              <input
                type="text"
                value={jvRef}
                onChange={(e) => setJvRef(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Debit Account (DR) *
            </label>
            <select
              value={debitAccountId}
              onChange={(e) => setDebitAccountId(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold"
            >
              {chartOfAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  [{a.accountNumber}] {a.name} ({a.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Credit Account (CR) *
            </label>
            <select
              value={creditAccountId}
              onChange={(e) => setCreditAccountId(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold"
            >
              {chartOfAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  [{a.accountNumber}] {a.name} ({a.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Voucher Amount ({activeCurrency}) *
            </label>
            <input
              type="number"
              min={1}
              required
              value={jvAmount}
              onChange={(e) => setJvAmount(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-indigo-600"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Ledger Narration & Memo *
            </label>
            <textarea
              rows={2}
              required
              value={jvNarration}
              onChange={(e) => setJvNarration(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setIsJournalModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Post to Ledger
            </Button>
          </div>
        </form>
      </Modal>

      {/* Inspect Journal Entry Modal */}
      {selectedEntry && (
        <Modal
          isOpen={!!selectedEntry}
          onClose={() => setSelectedEntry(null)}
          title={`Journal Voucher: ${selectedEntry.entryNumber}`}
          subtitle={`Reference: ${selectedEntry.reference}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <p><strong>Date:</strong> {formatDate(selectedEntry.date)}</p>
              <p><strong>Narration:</strong> {selectedEntry.narration}</p>
              <p><strong>Authorizer:</strong> {selectedEntry.createdBy}</p>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold">
                  <tr>
                    <th className="p-2.5">Account Code & Title</th>
                    <th className="p-2.5 text-right">Debit (DR)</th>
                    <th className="p-2.5 text-right">Credit (CR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedEntry.lines.map((l, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5">
                        <span className="font-mono text-indigo-600 font-bold mr-1.5">[{l.accountNumber}]</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{l.accountName}</span>
                      </td>
                      <td className="p-2.5 text-right font-bold text-emerald-600">
                        {l.debit > 0 ? formatCurrency(l.debit, activeCurrency) : '—'}
                      </td>
                      <td className="p-2.5 text-right font-bold text-indigo-600">
                        {l.credit > 0 ? formatCurrency(l.credit, activeCurrency) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
