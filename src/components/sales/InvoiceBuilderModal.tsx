import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Sparkles,
  HelpCircle,
  Building,
  ShieldAlert,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { LineItem, Invoice, InvoiceStatus } from '../../types/erp';
import { formatCurrency, calculateLineItem, calculateInvoiceTotals } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface InvoiceBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceCreated?: (inv: Invoice) => void;
}

export const InvoiceBuilderModal: React.FC<InvoiceBuilderModalProps> = ({
  isOpen,
  onClose,
  onInvoiceCreated,
}) => {
  const { customers, products, activeCurrency, addInvoice, activeCompany } = useERP();

  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().substring(0, 10));
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10)
  );
  const [includeSSCL, setIncludeSSCL] = useState(true); // 2.5% Sri Lanka SSCL
  const [terms, setTerms] = useState(
    'Payment due within 30 days. Remittances payable to Apex Global Enterprises (Pvt) Ltd.'
  );
  const [notes, setNotes] = useState(
    'Certified IRD-compliant electronic tax invoice. Standard VAT and SSCL applied.'
  );

  const [items, setItems] = useState<LineItem[]>([
    {
      id: 'inv-item-1',
      productId: products[0]?.id || '',
      productName: products[0]?.name || '',
      sku: products[0]?.sku || '',
      quantity: 1,
      unitPrice: products[0]?.sellingPrice || 100000,
      discountPercentage: 0,
      taxRatePercentage: 18,
      taxAmount: (products[0]?.sellingPrice || 100000) * 0.18,
      total: (products[0]?.sellingPrice || 100000) * 1.18,
    },
  ]);

  if (!isOpen) return null;

  const selectedCust = customers.find((c) => c.id === customerId) || customers[0];

  const handleAddItem = () => {
    const prod = products[0];
    if (!prod) return;
    const calc = calculateLineItem(1, prod.sellingPrice, 0, 18);
    setItems((prev) => [
      ...prev,
      {
        id: `li-${Date.now()}`,
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        quantity: 1,
        unitPrice: prod.sellingPrice,
        discountPercentage: 0,
        taxRatePercentage: 18,
        taxAmount: calc.taxAmount,
        total: calc.total,
      },
    ]);
  };

  const handleUpdateItem = (index: number, updates: Partial<LineItem>) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const next = { ...item, ...updates };
        const calc = calculateLineItem(next.quantity, next.unitPrice, next.discountPercentage, next.taxRatePercentage);
        return {
          ...next,
          taxAmount: calc.taxAmount,
          total: calc.total,
        };
      })
    );
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Real-time calculations with VAT 18% & SSCL 2.5%
  const totals = calculateInvoiceTotals(items, includeSSCL);

  const handleCreate = (status: InvoiceStatus) => {
    if (!selectedCust || items.length === 0) return;

    const newInvNumber = `INV-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;

    const created = addInvoice({
      invoiceNumber: newInvNumber,
      customerId: selectedCust.id,
      customerName: selectedCust.companyName,
      customerEmail: selectedCust.email,
      customerAddress: selectedCust.billingAddress,
      customerTaxNumber: selectedCust.taxNumber,
      issueDate,
      dueDate,
      items,
      subtotal: totals.subtotal,
      discountTotal: totals.discountTotal,
      vatAmount: totals.vatAmount,
      ssclAmount: totals.ssclAmount,
      taxTotal: totals.taxTotal,
      grandTotal: totals.grandTotal,
      paidAmount: 0,
      outstandingBalance: totals.grandTotal,
      currency: activeCurrency,
      status,
      terms,
      notes,
    });

    if (onInvoiceCreated) {
      onInvoiceCreated(created);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Enterprise Commercial Invoice"
      subtitle="Compliant with Sri Lanka Inland Revenue Department (IRD) VAT & SSCL regulations"
      maxWidth="6xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        {/* Left 8 Cols: Form inputs & item lines */}
        <div className="lg:col-span-8 space-y-5">
          {/* Customer Selection Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Billed Customer *
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName} (TIN: {c.taxNumber})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                {selectedCust.billingAddress} • Credit Limit: {formatCurrency(selectedCust.creditLimit, activeCurrency)}
              </p>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Currency
              </label>
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 font-extrabold text-indigo-700 dark:text-indigo-300">
                {activeCurrency} (Live Transaction Rate)
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Invoice Issue Date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Payment Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Tax Regimes
              </label>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSSCL}
                  onChange={(e) => setIncludeSSCL(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Include 2.5% SSCL
                </span>
              </label>
            </div>
          </div>

          {/* Line items table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold uppercase text-slate-600 dark:text-slate-400">
                Itemized Invoice Lines
              </span>
              <Button variant="outline" size="sm" onClick={handleAddItem} leftIcon={<Plus className="w-3 h-3" />}>
                Add Line Item
              </Button>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-500">
                  <tr>
                    <th className="p-2.5">Product / Service SKU</th>
                    <th className="p-2.5 w-16">Qty</th>
                    <th className="p-2.5 w-28">Unit Price</th>
                    <th className="p-2.5 w-16">Disc %</th>
                    <th className="p-2.5 w-16">VAT %</th>
                    <th className="p-2.5 text-right">Net Total</th>
                    <th className="p-2.5 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-2">
                        <select
                          value={item.productId}
                          onChange={(e) => {
                            const p = products.find((prod) => prod.id === e.target.value);
                            if (p) {
                              handleUpdateItem(idx, {
                                productId: p.id,
                                productName: p.name,
                                sku: p.sku,
                                unitPrice: p.sellingPrice,
                              });
                            }
                          }}
                          className="w-full p-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded text-xs"
                        >
                          {products.map((prod) => (
                            <option key={prod.id} value={prod.id}>
                              {prod.name} [{prod.sku}]
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(idx, { quantity: Number(e.target.value) })}
                          className="w-full p-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded text-xs font-bold text-center"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(idx, { unitPrice: Number(e.target.value) })}
                          className="w-full p-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={item.discountPercentage}
                          onChange={(e) => handleUpdateItem(idx, { discountPercentage: Number(e.target.value) })}
                          className="w-full p-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded text-xs text-center"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.taxRatePercentage}
                          onChange={(e) => handleUpdateItem(idx, { taxRatePercentage: Number(e.target.value) })}
                          className="w-full p-1.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded text-xs text-center"
                        />
                      </td>
                      <td className="p-2 text-right font-bold text-slate-900 dark:text-white">
                        {formatCurrency(item.total, activeCurrency)}
                      </td>
                      <td className="p-2 text-center">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-slate-400 hover:text-rose-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Terms & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Commercial Payment Terms
              </label>
              <textarea
                rows={2}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Statutory Compliance Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Live Interactive Summary Card */}
        <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                Live Invoice Calculation
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                18% VAT + 2.5% SSCL
              </span>
            </div>

            <div className="space-y-3 py-4 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Gross Subtotal</span>
                <span>{formatCurrency(totals.subtotal, activeCurrency)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Discounts Applied</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  -{formatCurrency(totals.discountTotal, activeCurrency)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Net Taxable Base</span>
                <span>{formatCurrency(totals.subtotal - totals.discountTotal, activeCurrency)}</span>
              </div>
              <hr className="border-slate-200 dark:border-slate-700" />
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>VAT (18.0% Standard)</span>
                <span>{formatCurrency(totals.vatAmount, activeCurrency)}</span>
              </div>
              {includeSSCL && (
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>SSCL (2.5% Statutory)</span>
                  <span>{formatCurrency(totals.ssclAmount, activeCurrency)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-700 dark:text-slate-200 font-bold">
                <span>Total Statutory Taxes</span>
                <span>{formatCurrency(totals.taxTotal, activeCurrency)}</span>
              </div>

              <div className="pt-3 border-t-2 border-slate-300 dark:border-slate-600 flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-900 dark:text-white">Grand Total Due</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(totals.grandTotal, activeCurrency)}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Controlled Financial Workflow:</strong> Saving as Draft permits further edits. Submitting advances to Finance Review. Finalizing permanently locks this record.
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2 mt-4">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => handleCreate('Finalized')}
            >
              Finalize & Issue Official Invoice
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => handleCreate('Submitted')}
              >
                Submit for Approval
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleCreate('Draft')}
              >
                Save as Draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
