import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Filter,
  Search,
  CreditCard,
  Printer,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Invoice, InvoiceStatus } from '../../types/erp';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Table, Column } from '../common/Table';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { InvoiceBuilderModal } from './InvoiceBuilderModal';
import { InvoiceDetailModal } from './InvoiceDetailModal';

export interface InvoiceListProps {
  onOpenRecordPaymentModal?: (invoice: Invoice) => void;
  selectedInvoiceId?: string;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  onOpenRecordPaymentModal,
  selectedInvoiceId,
}) => {
  const { invoices, activeCurrency } = useERP();
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(
    selectedInvoiceId ? invoices.find((i) => i.id === selectedInvoiceId) || null : null
  );

  const statuses = [
    'All',
    'Draft',
    'Submitted',
    'Approved',
    'Finalized',
    'Partially Paid',
    'Paid',
    'Overdue',
    'Cancelled',
  ];

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter === 'All') return true;
    return inv.status === statusFilter;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'Paid':
        return <Badge variant="success" dot size="sm">Paid</Badge>;
      case 'Partially Paid':
        return <Badge variant="warning" dot size="sm">Partially Paid</Badge>;
      case 'Overdue':
        return <Badge variant="danger" dot size="sm">Overdue</Badge>;
      case 'Finalized':
        return <Badge variant="purple" dot size="sm">Finalized</Badge>;
      case 'Approved':
        return <Badge variant="info" dot size="sm">Approved</Badge>;
      case 'Cancelled':
        return <Badge variant="neutral" dot size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="outline" dot size="sm">{status}</Badge>;
    }
  };

  const columns: Column<Invoice>[] = [
    {
      header: 'Invoice #',
      render: (i) => (
        <span className="font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
          {i.invoiceNumber}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      render: (i) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{i.customerName}</span>
          <span className="text-[11px] text-slate-400">{i.customerEmail}</span>
        </div>
      ),
    },
    {
      header: 'Dates',
      render: (i) => (
        <div className="text-xs">
          <span>Issued: {formatDate(i.issueDate)}</span>
          <span className="text-[10px] text-slate-400 block">Due: {formatDate(i.dueDate)}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (i) => getStatusBadge(i.status),
    },
    {
      header: 'Total Amount',
      align: 'right',
      render: (i) => (
        <span className="font-extrabold text-slate-900 dark:text-white text-xs">
          {formatCurrency(i.grandTotal, i.currency)}
        </span>
      ),
    },
    {
      header: 'Balance Due',
      align: 'right',
      render: (i) => (
        <div>
          <span
            className={`font-bold block text-xs ${
              i.outstandingBalance > 0
                ? i.status === 'Overdue'
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-800 dark:text-slate-200'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {formatCurrency(i.outstandingBalance, i.currency)}
          </span>
          {i.paidAmount > 0 && (
            <span className="text-[10px] text-slate-400">
              Paid: {formatCurrency(i.paidAmount, i.currency)}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      align: 'center',
      render: (i) => (
        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveInvoice(i)}
            title="Inspect Invoice"
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> View
          </Button>
          {i.outstandingBalance > 0 && i.status !== 'Cancelled' && onOpenRecordPaymentModal && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onOpenRecordPaymentModal(i)}
              title="Record Payment"
            >
              <CreditCard className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Enterprise Invoices Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time tax billing, credit limits tracking, automated payment reconciliation, and dispute management
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsBuilderOpen(true)}
        >
          Create Invoice
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-3">
        {statuses.map((st) => {
          const count =
            st === 'All'
              ? invoices.length
              : invoices.filter((i) => i.status === st).length;

          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{st}</span>
              <span className="ml-1.5 opacity-75 font-normal">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Invoices Table */}
      <Table
        columns={columns}
        data={filteredInvoices}
        keyExtractor={(i) => i.id}
        searchPlaceholder="Search invoices by INV #, customer, email..."
        onRowClick={(i) => setActiveInvoice(i)}
      />

      {/* Invoice Builder Modal */}
      <InvoiceBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onInvoiceCreated={(newInv) => setActiveInvoice(newInv)}
      />

      {/* Invoice Detail Modal */}
      {activeInvoice && (
        <InvoiceDetailModal
          invoice={activeInvoice}
          onClose={() => setActiveInvoice(null)}
          onOpenRecordPayment={onOpenRecordPaymentModal}
        />
      )}
    </div>
  );
};
