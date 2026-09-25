import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Send,
  CheckCircle,
  ArrowRight,
  FileCheck,
  FileText,
  Trash2,
  Calendar,
  User,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Quotation, LineItem } from '../../types/erp';
import { formatCurrency, formatDate, calculateLineItem } from '../../utils/formatters';
import { Table, Column } from '../common/Table';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export const QuotationList: React.FC<{
  onOpenInvoiceDetail?: (invoiceId: string) => void;
}> = () => {
  const {
    quotations,
    customers,
    products,
    activeCurrency,
    addQuotation,
    updateQuotationStatus,
    convertQuotationToOrder,
    convertQuotationToInvoice,
  } = useERP();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);

  // New Quote Form State
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [expiryDays, setExpiryDays] = useState(30);
  const [items, setItems] = useState<LineItem[]>([
    {
      id: 'li-new-1',
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
  const [notes, setNotes] = useState('Standard enterprise quotation valid for 30 calendar days.');

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

  const handleSaveQuotation = (status: Quotation['status'] = 'Draft') => {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust || items.length === 0) return;

    let subtotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;

    items.forEach((item) => {
      const itemSub = item.quantity * item.unitPrice;
      subtotal += itemSub;
      discountTotal += itemSub * (item.discountPercentage / 100);
      taxTotal += item.taxAmount;
    });

    const grandTotal = subtotal - discountTotal + taxTotal;
    const newQuoteNumber = `QUO-2026-${String(quotations.length + 83).padStart(4, '0')}`;

    addQuotation({
      quoteNumber: newQuoteNumber,
      customerId: cust.id,
      customerName: cust.companyName,
      customerEmail: cust.email,
      date: new Date().toISOString().substring(0, 10),
      expiryDate: new Date(Date.now() + expiryDays * 86400000).toISOString().substring(0, 10),
      items,
      subtotal,
      discountTotal,
      taxTotal,
      grandTotal,
      currency: activeCurrency,
      status,
      salespersonName: 'Priyantha De Silva',
      notes,
    });

    setIsCreateModalOpen(false);
  };

  const columns: Column<Quotation>[] = [
    {
      header: 'Quote Number',
      render: (q) => (
        <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
          {q.quoteNumber}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      render: (q) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{q.customerName}</span>
          <span className="text-xs text-slate-400">{q.customerEmail}</span>
        </div>
      ),
    },
    {
      header: 'Date & Validity',
      render: (q) => (
        <div className="text-xs">
          <span>{formatDate(q.date)}</span>
          <span className="text-[10px] text-slate-400 block">Exp: {formatDate(q.expiryDate)}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (q) => {
        const variant =
          q.status === 'Approved'
            ? 'success'
            : q.status === 'Converted'
            ? 'purple'
            : q.status === 'Sent'
            ? 'info'
            : 'neutral';
        return <Badge variant={variant} size="sm">{q.status}</Badge>;
      },
    },
    {
      header: 'Total Amount',
      align: 'right',
      render: (q) => (
        <span className="font-extrabold text-slate-900 dark:text-white text-xs">
          {formatCurrency(q.grandTotal, activeCurrency)}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'center',
      render: (q) => (
        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {q.status === 'Draft' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQuotationStatus(q.id, 'Sent')}
              title="Send to Customer"
            >
              <Send className="w-3.5 h-3.5 mr-1" /> Send
            </Button>
          )}
          {q.status === 'Sent' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQuotationStatus(q.id, 'Approved')}
              title="Customer Approved"
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Approve
            </Button>
          )}
          {q.status === 'Approved' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => convertQuotationToInvoice(q.id)}
            >
              <FileText className="w-3.5 h-3.5 mr-1" /> To Invoice
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedQuote(q)}
          >
            Preview
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Commercial Quotations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Generate itemized proposals, track customer approvals, and convert directly to Sales Orders or Invoices
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Quotation
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={quotations}
        keyExtractor={(q) => q.id}
        searchPlaceholder="Search quotations by quote #, customer..."
        onRowClick={(q) => setSelectedQuote(q)}
      />

      {/* Create Quotation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Commercial Quotation"
        subtitle="Specify customer, products, volume discounts, and 18% VAT"
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Select Customer *
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName} ({c.name})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Validity Period
              </label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              >
                <option value={15}>15 Days</option>
                <option value={30}>30 Days</option>
                <option value={60}>60 Days</option>
              </select>
            </div>
          </div>

          {/* Line items table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold uppercase text-slate-600 dark:text-slate-400">Line Items</span>
              <Button variant="outline" size="sm" onClick={handleAddItem} leftIcon={<Plus className="w-3 h-3" />}>
                Add Item
              </Button>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-500">
                  <tr>
                    <th className="p-2.5">Product SKU</th>
                    <th className="p-2.5 w-20">Qty</th>
                    <th className="p-2.5 w-32">Price ({activeCurrency})</th>
                    <th className="p-2.5 w-20">Disc %</th>
                    <th className="p-2.5 text-right">Total</th>
                    <th className="p-2.5 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {items.map((item, idx) => (
                    <tr key={item.id}>
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
                          className="w-full p-1 bg-transparent border border-slate-200 dark:border-slate-700 rounded text-xs"
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
                          className="w-full p-1 bg-transparent border border-slate-200 dark:border-slate-700 rounded text-xs font-bold"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(idx, { unitPrice: Number(e.target.value) })}
                          className="w-full p-1 bg-transparent border border-slate-200 dark:border-slate-700 rounded text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={item.discountPercentage}
                          onChange={(e) => handleUpdateItem(idx, { discountPercentage: Number(e.target.value) })}
                          className="w-full p-1 bg-transparent border border-slate-200 dark:border-slate-700 rounded text-xs"
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

          <div>
            <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Commercial Terms & Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => handleSaveQuotation('Draft')}>
              Save as Draft
            </Button>
            <Button variant="primary" onClick={() => handleSaveQuotation('Sent')}>
              Send to Customer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Quotation Preview Modal */}
      {selectedQuote && (
        <Modal
          isOpen={!!selectedQuote}
          onClose={() => setSelectedQuote(null)}
          title={`Quotation Preview: ${selectedQuote.quoteNumber}`}
          subtitle={`Issued to ${selectedQuote.customerName}`}
          maxWidth="xl"
          footer={
            <div className="flex gap-2">
              {selectedQuote.status === 'Approved' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    convertQuotationToInvoice(selectedQuote.id);
                    setSelectedQuote(null);
                  }}
                >
                  Convert to Invoice
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                Print / Download PDF
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <p className="font-extrabold text-base text-slate-900 dark:text-white">Apex Global Enterprises</p>
                <p className="text-slate-400">VAT Registration: VAT-109283741-7000</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-sm text-indigo-600">{selectedQuote.quoteNumber}</span>
                <p className="text-slate-400">Valid until: {formatDate(selectedQuote.expiryDate)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-slate-700 dark:text-slate-300">Quotation Breakdown:</p>
              {selectedQuote.items.map((it) => (
                <div key={it.id} className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>{it.quantity}x {it.productName}</span>
                  <span className="font-bold">{formatCurrency(it.total, activeCurrency)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right space-y-1">
              <p>Subtotal: {formatCurrency(selectedQuote.subtotal, activeCurrency)}</p>
              <p>VAT (18%): {formatCurrency(selectedQuote.taxTotal, activeCurrency)}</p>
              <p className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                Grand Total: {formatCurrency(selectedQuote.grandTotal, activeCurrency)}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
