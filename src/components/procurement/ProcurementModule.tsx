import React, { useState } from 'react';
import {
  Truck,
  Plus,
  FileCheck,
  CheckCircle,
  Clock,
  Building,
  Mail,
  Phone,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Supplier, PurchaseOrder } from '../../types/erp';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatCard } from '../common/StatCard';
import { Table, Column } from '../common/Table';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export const ProcurementModule: React.FC = () => {
  const { suppliers, purchaseOrders, activeCurrency } = useERP();
  const [activeTab, setActiveTab] = useState<'pos' | 'suppliers'>('pos');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  const totalPayables = suppliers.reduce((sum, s) => sum + s.outstandingPayable, 0);
  const pendingOrdersCount = purchaseOrders.filter((po) => po.status !== 'Received' && po.status !== 'Billed').length;

  const poColumns: Column<PurchaseOrder>[] = [
    {
      header: 'PO Number',
      render: (po) => (
        <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
          {po.poNumber}
        </span>
      ),
    },
    {
      header: 'Supplier / Vendor',
      accessorKey: 'supplierName',
      render: (po) => (
        <span className="font-bold text-slate-900 dark:text-white block">{po.supplierName}</span>
      ),
    },
    {
      header: 'Order Date',
      render: (po) => formatDate(po.orderDate),
    },
    {
      header: 'Expected Delivery',
      render: (po) => formatDate(po.expectedDeliveryDate),
    },
    {
      header: 'Approval Status',
      render: (po) => (
        <Badge
          variant={po.approvalLevel === 'Approved' ? 'success' : 'warning'}
          size="sm"
        >
          {po.approvalLevel}
        </Badge>
      ),
    },
    {
      header: 'Order Amount',
      align: 'right',
      render: (po) => (
        <span className="font-extrabold text-slate-900 dark:text-white text-xs">
          {formatCurrency(po.grandTotal, po.currency)}
        </span>
      ),
    },
    {
      header: 'Action',
      align: 'center',
      render: (po) => (
        <Button variant="outline" size="sm" onClick={() => setSelectedPO(po)}>
          Inspect PO
        </Button>
      ),
    },
  ];

  const supplierColumns: Column<Supplier>[] = [
    {
      header: 'Supplier Organization',
      render: (s) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{s.companyName}</span>
          <span className="text-xs text-slate-400">Rep: {s.name}</span>
        </div>
      ),
    },
    {
      header: 'Country',
      accessorKey: 'country',
    },
    {
      header: 'Tax ID',
      render: (s) => <span className="font-mono text-xs">{s.taxNumber}</span>,
    },
    {
      header: 'Rating',
      render: (s) => (
        <span className="font-bold text-amber-500">★ {s.rating.toFixed(1)} / 5.0</span>
      ),
    },
    {
      header: 'Trade Payable Due',
      align: 'right',
      render: (s) => (
        <span className="font-bold text-rose-600 dark:text-rose-400 text-xs">
          {formatCurrency(s.outstandingPayable, s.currency)}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (s) => <Badge variant={s.status === 'Active' ? 'success' : 'neutral'} dot size="sm">{s.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Procurement & Supplier Vendor Relations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Automated vendor requisitions, tiered purchase order approvals, and trade payables management
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Accounts Payable"
          value={formatCurrency(totalPayables, activeCurrency)}
          subtitle="Vendor Obligations"
          trend="neutral"
          icon={<Truck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/40"
        />

        <StatCard
          title="Active Purchase Orders"
          value={`${purchaseOrders.length} Orders`}
          subtitle={`${pendingOrdersCount} In Fulfillment Pipeline`}
          trend="up"
          changePercentage={14.0}
          icon={<FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/40"
        />

        <StatCard
          title="Registered Suppliers"
          value={`${suppliers.length} Vendors`}
          subtitle="Tier-1 Global & Local"
          trend="neutral"
          icon={<Building className="w-5 h-5 text-sky-600 dark:text-sky-400" />}
          iconBg="bg-sky-50 dark:bg-sky-950/40"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('pos')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-colors ${
            activeTab === 'pos'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Purchase Orders ({purchaseOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-colors ${
            activeTab === 'suppliers'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Approved Suppliers Directory ({suppliers.length})
        </button>
      </div>

      {activeTab === 'pos' ? (
        <Table
          columns={poColumns}
          data={purchaseOrders}
          keyExtractor={(po) => po.id}
          searchPlaceholder="Search purchase orders..."
          onRowClick={(po) => setSelectedPO(po)}
        />
      ) : (
        <Table
          columns={supplierColumns}
          data={suppliers}
          keyExtractor={(s) => s.id}
          searchPlaceholder="Search suppliers by name, country, tax..."
        />
      )}

      {/* PO Detail Modal */}
      {selectedPO && (
        <Modal
          isOpen={!!selectedPO}
          onClose={() => setSelectedPO(null)}
          title={`Purchase Order: ${selectedPO.poNumber}`}
          subtitle={`Vendor: ${selectedPO.supplierName}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Approval Status:</span>
                <span className="ml-2 font-extrabold text-emerald-600">{selectedPO.approvalLevel}</span>
              </div>
              <p className="text-slate-400">Delivery Target: {formatDate(selectedPO.expectedDeliveryDate)}</p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Procurement Items:</span>
              {selectedPO.items.map((it) => (
                <div key={it.id} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold block text-slate-900 dark:text-white">{it.productName}</span>
                    <span className="text-[11px] text-slate-400">Qty: {it.quantity} Units • Unit Cost: {formatCurrency(it.unitPrice, selectedPO.currency)}</span>
                  </div>
                  <span className="font-extrabold text-indigo-600">
                    {formatCurrency(it.total, selectedPO.currency)}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-right pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
              <p>Subtotal: {formatCurrency(selectedPO.subtotal, selectedPO.currency)}</p>
              <p>VAT (18%): {formatCurrency(selectedPO.taxTotal, selectedPO.currency)}</p>
              <p className="text-base font-black text-indigo-600">
                Total Commitment: {formatCurrency(selectedPO.grandTotal, selectedPO.currency)}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
