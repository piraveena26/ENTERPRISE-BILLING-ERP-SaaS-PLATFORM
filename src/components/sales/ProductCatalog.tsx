import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  AlertTriangle,
  CheckCircle,
  Tag,
  Barcode,
  ArrowUpDown,
  Building,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Product } from '../../types/erp';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Table, Column } from '../common/Table';

export const ProductCatalog: React.FC = () => {
  const { products, categories, activeCurrency, addProduct, adjustStock } = useERP();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustQuantity, setAdjustQuantity] = useState(1);
  const [adjustReason, setAdjustReason] = useState('Physical audit variance');

  // New Product Form state
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Enterprise Hardware');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [costPrice, setCostPrice] = useState(100000);
  const [sellingPrice, setSellingPrice] = useState(150000);
  const [stockQuantity, setStockQuantity] = useState(10);
  const [reorderLevel, setReorderLevel] = useState(5);
  const [unit, setUnit] = useState<Product['unit']>('Units');
  const [imageUrl, setImageUrl] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;

    addProduct({
      name,
      sku: sku.toUpperCase(),
      barcode: barcode || String(Math.floor(100000000000 + Math.random() * 900000000000)),
      category,
      brand: brand || 'Apex Enterprise',
      description: description || 'Enterprise catalog component',
      image:
        imageUrl ||
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80',
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      stockQuantity: Number(stockQuantity),
      reorderLevel: Number(reorderLevel),
      unit,
      taxRate: 18,
      warehouseId: 'wh-colombo-main',
      isActive: true,
      currency: activeCurrency,
    });

    setIsAddModalOpen(false);
    setName('');
    setSku('');
  };

  const handleStockAdjustment = () => {
    if (!selectedProduct) return;
    adjustStock(selectedProduct.id, adjustQuantity, adjustReason);
    setIsAdjustModalOpen(false);
  };

  const tableColumns: Column<Product>[] = [
    {
      header: 'Product Item',
      render: (p) => (
        <div className="flex items-center gap-3">
          <img
            src={p.image}
            alt={p.name}
            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
          />
          <div>
            <span className="font-bold text-slate-900 dark:text-white block hover:text-indigo-600 transition-colors">
              {p.name}
            </span>
            <span className="text-xs text-slate-400">
              SKU: {p.sku} • {p.brand}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
    },
    {
      header: 'Stock Status',
      render: (p) => {
        const isLow = p.stockQuantity <= p.reorderLevel;
        const isOut = p.stockQuantity === 0;

        return (
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOut ? 'bg-rose-500' : isLow ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
            <span className="font-bold text-xs">
              {p.stockQuantity} {p.unit}
            </span>
            {isLow && (
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">(Low)</span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Cost Price',
      render: (p) => formatCurrency(p.costPrice, activeCurrency),
    },
    {
      header: 'Selling Price',
      render: (p) => (
        <span className="font-bold text-indigo-600 dark:text-indigo-400">
          {formatCurrency(p.sellingPrice, activeCurrency)}
        </span>
      ),
    },
    {
      header: 'Margin',
      render: (p) => {
        const margin = Math.round(((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100);
        return <Badge variant={margin >= 30 ? 'success' : 'neutral'} size="sm">{margin}%</Badge>;
      },
    },
    {
      header: 'Action',
      align: 'center',
      render: (p) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProduct(p);
          }}
        >
          View
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
            Product Catalog & SKU Registry
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Multi-tier inventory pricing, barcode indexing, and automated reorder points
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Grid / Table Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === cat.name
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, SKU, brand..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Products Display (Grid or Table) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((prod) => {
            const isLowStock = prod.stockQuantity <= prod.reorderLevel;
            const margin = Math.round(((prod.sellingPrice - prod.costPrice) / prod.sellingPrice) * 100);

            return (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Image container */}
                  <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-xs border border-white/20 shadow-2xs">
                        {prod.brand}
                      </span>
                    </div>
                    {isLowStock && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white shadow-2xs flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>SKU: {prod.sku}</span>
                      <span>{prod.category}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                      {prod.name}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {prod.description}
                    </p>
                  </div>
                </div>

                {/* Footer Pricing & Stock */}
                <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Selling Price</span>
                    <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(prod.sellingPrice, activeCurrency)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Available</span>
                    <span className={`text-xs font-bold ${isLowStock ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}`}>
                      {prod.stockQuantity} {prod.unit}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Table
          columns={tableColumns}
          data={filteredProducts}
          keyExtractor={(p) => p.id}
          searchable={false}
          onRowClick={(p) => setSelectedProduct(p)}
        />
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={selectedProduct.name}
          subtitle={`SKU: ${selectedProduct.sku} • Barcode: ${selectedProduct.barcode}`}
          maxWidth="xl"
          footer={
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdjustModalOpen(true)}
              >
                Adjust Stock Quantity
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedProduct(null)}
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-6 text-xs">
            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full sm:w-56 h-48 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
              />
              <div className="space-y-3 flex-1">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Category & Brand</span>
                  <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {selectedProduct.brand} • {selectedProduct.category}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Description</span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
                    {selectedProduct.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Cost Price</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(selectedProduct.costPrice, activeCurrency)}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900">
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block font-bold uppercase">Selling Price</span>
                    <span className="text-sm font-extrabold text-indigo-700 dark:text-indigo-300">
                      {formatCurrency(selectedProduct.sellingPrice, activeCurrency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warehouse Stock Matrix */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Inventory Logistics Distribution</h4>
              <div className="flex items-center justify-between text-xs">
                <span>Central Logistics Hub (Colombo 10)</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedProduct.stockQuantity} {selectedProduct.unit} (Reorder: {selectedProduct.reorderLevel})
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Standard Tax Rate</span>
                <span className="font-bold text-slate-900 dark:text-white">18% VAT (Sri Lanka Inland Revenue)</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Stock Adjustment Sub-Modal */}
      {isAdjustModalOpen && selectedProduct && (
        <Modal
          isOpen={isAdjustModalOpen}
          onClose={() => setIsAdjustModalOpen(false)}
          title="Stock Adjustment Entry"
          subtitle={`Adjust current stock for ${selectedProduct.name}`}
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Quantity Delta (+ for Inbound, - for Outbound/Scrap)
              </label>
              <input
                type="number"
                value={adjustQuantity}
                onChange={(e) => setAdjustQuantity(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Reason / Audit Documentation
              </label>
              <input
                type="text"
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="e.g. Physical inventory variance, Damaged in transit"
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setIsAdjustModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleStockAdjustment}>
                Commit Adjustment
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Catalog Product"
        subtitle="Configure SKU, inventory parameters, and retail/cost margins"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Product Title / Item Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dell PowerEdge Server R650"
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                SKU Code *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="SRV-R650-01"
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Barcode (EAN-13 / UPC)
              </label>
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="793573190241"
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Cisco Systems"
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Cost Price ({activeCurrency})
              </label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Selling Price ({activeCurrency})
              </label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-indigo-600"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Initial Stock
              </label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Reorder Threshold
              </label>
              <input
                type="number"
                value={reorderLevel}
                onChange={(e) => setReorderLevel(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Product Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Product SKU
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
