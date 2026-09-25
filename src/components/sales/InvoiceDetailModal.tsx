import React, { useState } from 'react';
import {
  Printer,
  Download,
  Mail,
  CreditCard,
  FileMinus,
  CheckCircle,
  Building,
  QrCode,
  ShieldCheck,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Invoice } from '../../types/erp';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onOpenRecordPayment?: (invoice: Invoice) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  onClose,
  onOpenRecordPayment,
}) => {
  const { activeCompany, activeCurrency, issueCreditNote, payments } = useERP();
  const [isCreditNoteModalOpen, setIsCreditNoteModalOpen] = useState(false);
  const [creditNoteReason, setCreditNoteReason] = useState('Product return / Commercial discount renegotiation');

  if (!invoice) return null;

  // Payments tied to this invoice
  const relatedPayments = payments.filter((p) => p.invoiceId === invoice.id);

  const handleIssueCreditNote = () => {
    issueCreditNote(invoice.id, creditNoteReason);
    setIsCreditNoteModalOpen(false);
    onClose();
  };

  const getStatusBadge = () => {
    switch (invoice.status) {
      case 'Paid':
        return <Badge variant="success" size="md">PAID IN FULL</Badge>;
      case 'Partially Paid':
        return <Badge variant="warning" size="md">PARTIALLY SETTLED</Badge>;
      case 'Overdue':
        return <Badge variant="danger" size="md">OVERDUE</Badge>;
      case 'Finalized':
        return <Badge variant="purple" size="md">FINALIZED / ISSUED</Badge>;
      case 'Approved':
        return <Badge variant="info" size="md">FINANCE APPROVED</Badge>;
      case 'Cancelled':
        return <Badge variant="neutral" size="md">CANCELLED / CREDITED</Badge>;
      default:
        return <Badge variant="outline" size="md">DRAFT</Badge>;
    }
  };

  return (
    <Modal
      isOpen={!!invoice}
      onClose={onClose}
      title={`Tax Invoice: ${invoice.invoiceNumber}`}
      subtitle={`Customer: ${invoice.customerName}`}
      maxWidth="4xl"
      footer={
        <div className="flex flex-wrap items-center justify-between w-full gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Cryptographically Certified Inland Revenue Register</span>
          </div>

          <div className="flex items-center gap-2">
            {invoice.status !== 'Paid' && invoice.status !== 'Cancelled' && onOpenRecordPayment && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onOpenRecordPayment(invoice)}
              >
                <CreditCard className="w-3.5 h-3.5 mr-1" /> Record Payment
              </Button>
            )}

            {invoice.status !== 'Cancelled' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreditNoteModalOpen(true)}
              >
                <FileMinus className="w-3.5 h-3.5 mr-1 text-rose-500" /> Credit Note
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="w-3.5 h-3.5 mr-1" /> Print
            </Button>
          </div>
        </div>
      }
    >
      <div className="p-4 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-xs space-y-6">
        {/* Invoice Header: Company Brand + Invoice Meta */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-base">
                ▲
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {activeCompany.name}
              </h3>
            </div>
            <p className="text-slate-500">{activeCompany.address}, {activeCompany.city}</p>
            <p className="text-slate-500">Phone: {activeCompany.phone} • Email: {activeCompany.email}</p>
            <div className="flex flex-wrap gap-3 mt-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                VAT Reg: <strong>{activeCompany.taxRegistrationNumber}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                SVAT No: <strong>{activeCompany.svatNumber}</strong>
              </span>
            </div>
          </div>

          <div className="text-right sm:text-right w-full sm:w-auto">
            <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tight">
              {invoice.invoiceNumber}
            </h2>
            <div className="mt-2 mb-3">{getStatusBadge()}</div>
            <p className="text-slate-500">
              Issue Date: <strong className="text-slate-900 dark:text-white">{formatDate(invoice.issueDate)}</strong>
            </p>
            <p className="text-slate-500">
              Payment Due: <strong className="text-slate-900 dark:text-white">{formatDate(invoice.dueDate)}</strong>
            </p>
          </div>
        </div>

        {/* Bill To & Ship To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Billed To Customer:
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{invoice.customerName}</h4>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5">{invoice.customerAddress}</p>
            <p className="text-slate-500 mt-1">Tax ID / TIN: <strong>{invoice.customerTaxNumber || 'Exempt / Not Provided'}</strong></p>
            <p className="text-slate-500">Email: {invoice.customerEmail}</p>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Compliance & Verification:
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Authorizer: <strong>{invoice.approvedBy || 'Finance Director'}</strong>
            </p>
            <p className="text-slate-500">Finalized Stamp: {invoice.finalizedAt || formatDate(invoice.issueDate)}</p>
            <p className="text-slate-500">Base Currency: <strong className="text-indigo-600">{invoice.currency}</strong></p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Product Description & SKU</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Disc %</th>
                <th className="p-3 text-right">VAT Rate</th>
                <th className="p-3 text-right">Net Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoice.items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-3 text-slate-400">{idx + 1}</td>
                  <td className="p-3">
                    <span className="font-bold text-slate-900 dark:text-white block">{item.productName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</span>
                  </td>
                  <td className="p-3 text-center font-bold">{item.quantity}</td>
                  <td className="p-3 text-right font-medium">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                  <td className="p-3 text-right text-slate-500">{item.discountPercentage}%</td>
                  <td className="p-3 text-right font-medium">{item.taxRatePercentage}%</td>
                  <td className="p-3 text-right font-extrabold text-slate-900 dark:text-white">
                    {formatCurrency(item.total, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tax Breakdown & Totals */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
          {/* Digital Payment Instructions & QR */}
          <div className="w-full sm:max-w-md p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                <QrCode className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Automated Bank Settlement (CEFT / RTGS)
                </span>
                <p className="text-[11px] text-slate-400">Commercial Bank of Ceylon • Corporate A/C 1000849201</p>
                <p className="text-[10px] text-slate-400 font-mono">SWIFT: CCEYLKLX • Ref: {invoice.invoiceNumber}</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
              Terms: {invoice.terms}
            </p>
          </div>

          {/* Mathematical Summary Card */}
          <div className="w-full sm:w-80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Taxable Subtotal</span>
              <span>{formatCurrency(invoice.subtotal - invoice.discountTotal, invoice.currency)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Sri Lanka VAT (18%)</span>
              <span>{formatCurrency(invoice.vatAmount, invoice.currency)}</span>
            </div>
            {invoice.ssclAmount && invoice.ssclAmount > 0 && (
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>SSCL Turnover Levy (2.5%)</span>
                <span>{formatCurrency(invoice.ssclAmount, invoice.currency)}</span>
              </div>
            )}
            <hr className="border-slate-200 dark:border-slate-700" />
            <div className="flex justify-between items-baseline text-sm font-black text-slate-900 dark:text-white">
              <span>Total Invoice Amount</span>
              <span className="text-lg text-indigo-600 dark:text-indigo-400">
                {formatCurrency(invoice.grandTotal, invoice.currency)}
              </span>
            </div>
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
              <span>Paid to Date</span>
              <span>{formatCurrency(invoice.paidAmount, invoice.currency)}</span>
            </div>
            <div className="flex justify-between text-rose-600 dark:text-rose-400 font-extrabold text-sm pt-1 border-t border-slate-200 dark:border-slate-700">
              <span>Remaining Balance Due</span>
              <span>{formatCurrency(invoice.outstandingBalance, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {/* Payment History Audit Section */}
        {relatedPayments.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-2">
              Payment Settlement Trail ({relatedPayments.length})
            </h4>
            <div className="space-y-1.5">
              {relatedPayments.map((p) => (
                <div key={p.id} className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white mr-2">{p.paymentNumber}</span>
                    <span className="text-slate-500">{p.method} • Ref: {p.referenceNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
                      +{formatCurrency(p.amount, p.currency)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{formatDate(p.paymentDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Credit Note Issue Modal */}
      {isCreditNoteModalOpen && (
        <Modal
          isOpen={isCreditNoteModalOpen}
          onClose={() => setIsCreditNoteModalOpen(false)}
          title="Issue Financial Credit Note"
          subtitle={`Credit adjustment against ${invoice.invoiceNumber}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300">
              <p className="font-bold">Accounting Rule Notice:</p>
              <p className="mt-1">
                This will reverse the outstanding receivable ({formatCurrency(invoice.outstandingBalance, invoice.currency)}) from the customer&apos;s ledger and mark the invoice as cancelled.
              </p>
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Reason for Credit Note *
              </label>
              <textarea
                rows={3}
                value={creditNoteReason}
                onChange={(e) => setCreditNoteReason(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" onClick={() => setIsCreditNoteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleIssueCreditNote}>
                Confirm & Issue Credit Note
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
};
