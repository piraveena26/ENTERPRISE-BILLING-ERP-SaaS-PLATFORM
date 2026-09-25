import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  ArrowDownLeft,
  Clock,
  AlertCircle,
  RotateCcw,
  CheckCircle,
  Building,
  Landmark,
  Receipt,
  Printer,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Payment, PaymentMethod, Invoice } from '../../types/erp';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatCard } from '../common/StatCard';
import { Table, Column } from '../common/Table';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export interface PaymentModuleProps {
  initialInvoice?: Invoice | null;
}

export const PaymentModule: React.FC<PaymentModuleProps> = ({ initialInvoice }) => {
  const { payments, invoices, activeCurrency, recordPayment } = useERP();

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(!!initialInvoice);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    initialInvoice?.id || invoices.find((i) => i.outstandingBalance > 0)?.id || ''
  );
  const [amount, setAmount] = useState<number>(
    initialInvoice?.outstandingBalance || 1000000
  );
  const [method, setMethod] = useState<PaymentMethod>('Bank Transfer');
  const [reference, setReference] = useState('SL-CEFT-');
  const [bankAccount, setBankAccount] = useState('Commercial Bank of Ceylon - A/C 1000849201');
  const [notes, setNotes] = useState('Direct CEFT settlement via corporate banking portal.');

  const [inspectPayment, setInspectPayment] = useState<Payment | null>(null);

  // Compute KPI cards
  const totalCollected = payments
    .filter((p) => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingReceivables = invoices.reduce((sum, i) => sum + i.outstandingBalance, 0);

  const overdueAmount = invoices
    .filter((i) => i.status === 'Overdue')
    .reduce((sum, i) => sum + i.outstandingBalance, 0);

  const targetInvoice = invoices.find((i) => i.id === selectedInvoiceId);

  const handleRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetInvoice || amount <= 0) return;

    const newPaymentNumber = `PAY-2026-${String(payments.length + 83).padStart(4, '0')}`;

    recordPayment({
      paymentNumber: newPaymentNumber,
      invoiceId: targetInvoice.id,
      invoiceNumber: targetInvoice.invoiceNumber,
      customerId: targetInvoice.customerId,
      customerName: targetInvoice.customerName,
      amount: Number(amount),
      currency: targetInvoice.currency,
      paymentDate: new Date().toISOString().substring(0, 10),
      method,
      referenceNumber: reference || `REF-${Date.now()}`,
      bankAccount,
      status: 'Completed',
      notes,
    });

    setIsRecordModalOpen(false);
  };

  const columns: Column<Payment>[] = [
    {
      header: 'Payment ID',
      render: (p) => (
        <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
          {p.paymentNumber}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      render: (p) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{p.customerName}</span>
          <span className="text-[11px] text-slate-400 font-mono">Invoice: {p.invoiceNumber}</span>
        </div>
      ),
    },
    {
      header: 'Payment Channel',
      render: (p) => (
        <div className="flex items-center gap-1.5 text-xs">
          <Landmark className="w-3.5 h-3.5 text-slate-400" />
          <span>{p.method}</span>
        </div>
      ),
    },
    {
      header: 'Reference',
      render: (p) => (
        <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
          {p.referenceNumber}
        </span>
      ),
    },
    {
      header: 'Date',
      render: (p) => formatDate(p.paymentDate),
    },
    {
      header: 'Status',
      render: (p) => (
        <Badge variant={p.status === 'Completed' ? 'success' : 'warning'} dot size="sm">
          {p.status}
        </Badge>
      ),
    },
    {
      header: 'Amount Received',
      align: 'right',
      render: (p) => (
        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs">
          +{formatCurrency(p.amount, p.currency)}
        </span>
      ),
    },
    {
      header: 'Receipt',
      align: 'center',
      render: (p) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setInspectPayment(p);
          }}
        >
          <Receipt className="w-3.5 h-3.5 mr-1" /> Receipt
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Treasury & Payment Collections
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Automated inward remittances, bank deposits reconciliation, and customer credit recovery
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsRecordModalOpen(true)}
        >
          Record Inward Payment
        </Button>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Collected"
          value={formatCurrency(totalCollected, activeCurrency)}
          subtitle="Processed & Reconciled"
          trend="up"
          changePercentage={12.4}
          icon={<ArrowDownLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/40"
        />

        <StatCard
          title="Pending Collections"
          value={formatCurrency(pendingReceivables, activeCurrency)}
          subtitle="Total Trade Receivables"
          trend="neutral"
          icon={<Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/40"
        />

        <StatCard
          title="Overdue Accounts"
          value={formatCurrency(overdueAmount, activeCurrency)}
          subtitle="Requires Collector Action"
          trend="down"
          changePercentage={-8.5}
          icon={<AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
          iconBg="bg-rose-50 dark:bg-rose-950/40"
        />

        <StatCard
          title="Reversal & Refunds"
          value={formatCurrency(0, activeCurrency)}
          subtitle="Zero chargebacks"
          trend="neutral"
          icon={<RotateCcw className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          iconBg="bg-amber-50 dark:bg-amber-950/40"
        />
      </div>

      {/* Payments Table */}
      <Table
        columns={columns}
        data={payments}
        keyExtractor={(p) => p.id}
        searchPlaceholder="Search payments by ID, customer, reference..."
        onRowClick={(p) => setInspectPayment(p)}
      />

      {/* Record Payment Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Payment Settlement"
        subtitle="Post receipt to customer balance & automate Bank General Ledger entry"
        maxWidth="lg"
      >
        <form onSubmit={handleRecord} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Select Invoice to Settle *
            </label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => {
                setSelectedInvoiceId(e.target.value);
                const inv = invoices.find((i) => i.id === e.target.value);
                if (inv) setAmount(inv.outstandingBalance);
              }}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold"
            >
              {invoices
                .filter((i) => i.status !== 'Cancelled')
                .map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} — {inv.customerName} (Due: {formatCurrency(inv.outstandingBalance, inv.currency)})
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Amount Received ({targetInvoice?.currency || activeCurrency}) *
              </label>
              <input
                type="number"
                required
                min={1}
                max={targetInvoice?.outstandingBalance}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Payment Channel *
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold"
              >
                <option value="Bank Transfer">Bank Transfer (CEFT / SLIPS / SWIFT)</option>
                <option value="Online Gateway">Online Gateway (Visa / MasterCard / PayHere LK)</option>
                <option value="Card">Corporate Credit Card POS</option>
                <option value="Cheque">Commercial Crossed Cheque</option>
                <option value="Cash">Cash Counter Collection</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Deposit Destination Bank Account
              </label>
              <select
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              >
                <option value="Commercial Bank of Ceylon - A/C 1000849201">
                  Commercial Bank of Ceylon (Primary Operational)
                </option>
                <option value="Hatton National Bank - A/C 7001928410">
                  Hatton National Bank (Merchant Account)
                </option>
                <option value="HSBC Offshore USD Escrow - A/C 440918230">
                  HSBC Offshore Escrow (USD Exports)
                </option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Transaction / Slip Reference *
              </label>
              <input
                type="text"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. CEFT-88912401"
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Internal Ledger Narration
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300">
            <strong>Automated Double-Entry Accounting:</strong> Submitting will create a Journal Voucher (Debit: Commercial Bank 1020, Credit: Accounts Receivable 1200) and update the customer&apos;s live credit limit.
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setIsRecordModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Post Payment to Ledger
            </Button>
          </div>
        </form>
      </Modal>

      {/* Payment Receipt Modal */}
      {inspectPayment && (
        <Modal
          isOpen={!!inspectPayment}
          onClose={() => setInspectPayment(null)}
          title={`Official Payment Receipt: ${inspectPayment.paymentNumber}`}
          subtitle={`Issued to ${inspectPayment.customerName}`}
          maxWidth="md"
          footer={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="w-3.5 h-3.5 mr-1" /> Print Official Receipt
              </Button>
            </div>
          }
        >
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">Apex Global Enterprises</span>
              <span className="font-mono font-bold text-indigo-600">{inspectPayment.paymentNumber}</span>
            </div>
            <p><strong>Customer:</strong> {inspectPayment.customerName}</p>
            <p><strong>Settled Invoice:</strong> {inspectPayment.invoiceNumber}</p>
            <p><strong>Payment Channel:</strong> {inspectPayment.method}</p>
            <p><strong>Reference:</strong> {inspectPayment.referenceNumber}</p>
            <p><strong>Date:</strong> {formatDate(inspectPayment.paymentDate)}</p>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm font-black">
              <span>Amount Received:</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {formatCurrency(inspectPayment.amount, inspectPayment.currency)}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
