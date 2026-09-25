import React, { useState } from 'react';
import {
  Boxes,
  Building,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ArrowUpDown,
  Truck,
  Plus,
  ArrowRight,
  Package,
  Layers,
  MapPin,
  Clock,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Table, Column } from '../common/Table';
import { StockMovement } from '../../types/erp';

export const InventoryDashboard: React.FC = () => {
  const { products, warehouses, stockMovements, activeCurrency, adjustStock } = useERP();
  const [activeTab, setActiveTab] = useState<'overview' | 'warehouses' | 'movements'>('overview');
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustReason, setAdjustReason] = useState('Routine stock audit variance reconciliation');

  const totalStockValue = products.reduce((sum, p) => sum + p.costPrice * p.stockQuantity, 0);
  const totalUnits = products.reduce((sum, p) => sum + p.stockQuantity, 0);
  const lowStockCount = products.filter((p) => p.stockQuantity <= p.reorderLevel).length;

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    adjustStock(selectedProductId, adjustQty, adjustReason);
    setIsAdjustModalOpen(false);
  };

  const movementColumns: Column<StockMovement>[] = [
    {
      header: 'Movement Type',
      render: (sm) => {
        const isOut = sm.type.includes('Outbound') || sm.quantity < 0;
        return (
          <div className="flex items-center gap-2">
            <span
              className={`p-1.5 rounded-lg text-xs font-bold ${
                isOut
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{sm.type}</span>
          </div>
        );
      },
    },
    {
      header: 'Product / SKU',
      render: (sm) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{sm.productName}</span>
          <span className="text-[10px] text-slate-400 font-mono">SKU: {sm.sku}</span>
        </div>
      ),
    },
    {
      header: 'Logistics Facility',
      accessorKey: 'warehouseName',
    },
    {
      header: 'Quantity Delta',
      align: 'right',
      render: (sm) => (
        <span
          className={`font-black text-xs ${
            sm.quantity < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {sm.quantity > 0 ? `+${sm.quantity}` : sm.quantity} Units
        </span>
      ),
    },
    {
      header: 'Reference Doc',
      render: (sm) => (
        <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
          {sm.referenceDoc}
        </span>
      ),
    },
    {
      header: 'Timestamp & Performed By',
      render: (sm) => (
        <div className="text-xs">
          <span>{sm.timestamp}</span>
          <span className="text-[10px] text-slate-400 block">Staff: {sm.performedBy}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Inventory & Multi-Warehouse Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time stock tracking across domestic distribution zones and international logistics depots
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            leftIcon={<ArrowUpDown className="w-4 h-4" />}
            onClick={() => setIsAdjustModalOpen(true)}
          >
            Adjust Stock
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Stock Value"
          value={formatCurrency(totalStockValue, activeCurrency)}
          subtitle="FIFO / Weighted Cost Valuation"
          trend="up"
          changePercentage={4.5}
          icon={<Boxes className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/40"
        />

        <StatCard
          title="Stock In Hand"
          value={`${totalUnits.toLocaleString()} Units`}
          subtitle={`${products.length} Active SKUs Registered`}
          trend="neutral"
          icon={<Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/40"
        />

        <StatCard
          title="Reorder Alerts"
          value={`${lowStockCount} Products`}
          subtitle="Stock below threshold"
          trend="down"
          changePercentage={-2.1}
          icon={<AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          iconBg="bg-amber-50 dark:bg-amber-950/40"
        />

        <StatCard
          title="Active Warehouses"
          value={`${warehouses.length} Facilities`}
          subtitle="Colombo, Kandy, Dubai, SG"
          trend="neutral"
          icon={<Building className="w-5 h-5 text-sky-600 dark:text-sky-400" />}
          iconBg="bg-sky-50 dark:bg-sky-950/40"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Warehouse Facilities Overview
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-colors ${
            activeTab === 'movements'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Stock Movement Trail ({stockMovements.length})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {warehouses.map((wh) => {
            const occupancy = Math.round((wh.currentStockUnits / wh.capacityUnits) * 100);

            return (
              <div
                key={wh.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                      <Building className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" size="sm">{wh.code}</Badge>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                    {wh.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-start gap-1">
                    <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                    <span>{wh.location}</span>
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Current Occupancy</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">
                        {occupancy}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          occupancy > 85 ? 'bg-amber-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${occupancy}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>{wh.currentStockUnits.toLocaleString()} Units</span>
                      <span>Cap: {wh.capacityUnits.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 text-right">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:underline cursor-pointer">
                    Manage Sections &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Movements */}
      {activeTab === 'movements' && (
        <Table
          columns={movementColumns}
          data={stockMovements}
          keyExtractor={(sm) => sm.id}
          searchPlaceholder="Search movements by product, SKU, warehouse, ref..."
        />
      )}

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title="Commit Stock Adjustment"
        subtitle="Log physical count delta with full audit justification"
        maxWidth="md"
      >
        <form onSubmit={handleAdjust} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Select Product SKU *
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Current: {p.stockQuantity} {p.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Quantity Delta (+ for Added, - for Deducted) *
            </label>
            <input
              type="number"
              required
              value={adjustQty}
              onChange={(e) => setAdjustQty(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Audit Reason / Variance Documentation *
            </label>
            <textarea
              rows={2}
              required
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setIsAdjustModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Post Adjustment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
