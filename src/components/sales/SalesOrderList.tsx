import React, { useState } from 'react';
import {
  FileCheck,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Package,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { SalesOrder, OrderStatus } from '../../types/erp';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Table, Column } from '../common/Table';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export const SalesOrderList: React.FC = () => {
  const { orders, activeCurrency, updateOrderStatus, convertOrderToInvoice } = useERP();
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  const statusWorkflow: OrderStatus[] = ['Draft', 'Confirmed', 'Processing', 'Delivered', 'Completed'];

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="success" dot size="sm">Completed</Badge>;
      case 'Delivered':
        return <Badge variant="info" dot size="sm">Delivered</Badge>;
      case 'Processing':
        return <Badge variant="warning" dot size="sm">Processing</Badge>;
      case 'Confirmed':
        return <Badge variant="purple" dot size="sm">Confirmed</Badge>;
      default:
        return <Badge variant="neutral" dot size="sm">{status}</Badge>;
    }
  };

  const columns: Column<SalesOrder>[] = [
    {
      header: 'Order Number',
      render: (o) => (
        <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
          {o.orderNumber}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      render: (o) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{o.customerName}</span>
          <span className="text-[11px] text-slate-400">Dest: {o.shippingAddress.split(',')[0]}</span>
        </div>
      ),
    },
    {
      header: 'Order Date',
      render: (o) => formatDate(o.date),
    },
    {
      header: 'Delivery Target',
      render: (o) => (
        <div className="flex items-center gap-1.5 text-xs">
          <Truck className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatDate(o.deliveryDate)}</span>
        </div>
      ),
    },
    {
      header: 'Fulfillment Status',
      render: (o) => getStatusBadge(o.status),
    },
    {
      header: 'Order Total',
      align: 'right',
      render: (o) => (
        <span className="font-extrabold text-slate-900 dark:text-white text-xs">
          {formatCurrency(o.grandTotal, activeCurrency)}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'center',
      render: (o) => (
        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => convertOrderToInvoice(o.id)}
            title="Generate invoice from this confirmed order"
          >
            <FileText className="w-3.5 h-3.5 mr-1" /> Invoice
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedOrder(o)}
          >
            Workflow
          </Button>
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
            Sales Orders & Fulfillment Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Track confirmed customer purchase orders through warehouse dispatch, carrier shipping, and invoicing
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <Table
        columns={columns}
        data={orders}
        keyExtractor={(o) => o.id}
        searchPlaceholder="Search orders by SO #, customer..."
        onRowClick={(o) => setSelectedOrder(o)}
      />

      {/* Visual Workflow Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Workflow: ${selectedOrder.orderNumber}`}
          subtitle={`Customer: ${selectedOrder.customerName}`}
          maxWidth="xl"
          footer={
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  convertOrderToInvoice(selectedOrder.id);
                  setSelectedOrder(null);
                }}
              >
                Generate Tax Invoice
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-6 text-xs">
            {/* Visual Workflow Stepper: Draft → Confirmed → Processing → Delivered → Completed */}
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-400 mb-3 tracking-wider">
                Fulfillment Lifecycle Progress
              </p>
              <div className="flex items-center justify-between relative">
                {/* Background line */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0" />

                {statusWorkflow.map((st, idx) => {
                  const currentIdx = statusWorkflow.indexOf(selectedOrder.status);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div
                      key={st}
                      onClick={() => updateOrderStatus(selectedOrder.id, st)}
                      className="relative z-10 flex flex-col items-center cursor-pointer group"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isDone
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950'
                            : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[11px] font-bold mt-2 ${
                          isCurrent
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : isDone
                            ? 'text-slate-800 dark:text-slate-200'
                            : 'text-slate-400'
                        }`}
                      >
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items List */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white">Scheduled Line Items</h4>
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold block text-slate-800 dark:text-slate-200">
                      {item.productName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">SKU: {item.sku}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold block">{item.quantity} Units</span>
                    <span className="text-[11px] text-slate-400">
                      {formatCurrency(item.total, activeCurrency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Shipping Destination</span>
                <p className="text-slate-800 dark:text-slate-200 mt-0.5">{selectedOrder.shippingAddress}</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Logistics Tracking</span>
                <p className="font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {selectedOrder.trackingNumber || 'Awaiting Dispatch Courier'}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
