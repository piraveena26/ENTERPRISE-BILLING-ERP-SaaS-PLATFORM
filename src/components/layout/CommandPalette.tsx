import React, { useState, useEffect } from 'react';
import { Search, User, FileText, Package, CreditCard, ShoppingCart, Truck, BarChart3, ArrowRight } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { AppModule } from '../../types/erp';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (module: AppModule, recordId?: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectModule,
}) => {
  const { customers, invoices, products, orders, suppliers } = useERP();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        // Trigger handled in parent or global
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search Results
  const matchingCustomers = q ? customers.filter((c) => c.name.toLowerCase().includes(q) || c.companyName.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchingInvoices = q ? invoices.filter((i) => i.invoiceNumber.toLowerCase().includes(q) || i.customerName.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchingProducts = q ? products.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchingOrders = q ? orders.filter((o) => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchingSuppliers = q ? suppliers.filter((s) => s.companyName.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)).slice(0, 3) : [];

  const hasResults =
    matchingCustomers.length > 0 ||
    matchingInvoices.length > 0 ||
    matchingProducts.length > 0 ||
    matchingOrders.length > 0 ||
    matchingSuppliers.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Palette Box */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search customers, invoices, products, purchase orders..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-slate-100 dark:divide-slate-800/60">
          {!query ? (
            <div className="p-4">
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Quick Navigation</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { name: 'Invoices', module: 'Invoices' as AppModule, icon: <FileText className="w-4 h-4 text-indigo-500" /> },
                  { name: 'Customers', module: 'Customers' as AppModule, icon: <User className="w-4 h-4 text-emerald-500" /> },
                  { name: 'Product Catalog', module: 'Products' as AppModule, icon: <Package className="w-4 h-4 text-amber-500" /> },
                  { name: 'Accounting Ledger', module: 'Accounting' as AppModule, icon: <CreditCard className="w-4 h-4 text-purple-500" /> },
                  { name: 'Financial Reports', module: 'Reports' as AppModule, icon: <BarChart3 className="w-4 h-4 text-sky-500" /> },
                  { name: 'Procurement Orders', module: 'Purchases' as AppModule, icon: <Truck className="w-4 h-4 text-rose-500" /> },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      onSelectModule(item.module);
                      onClose();
                    }}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left font-medium transition-colors"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No matching records found for &ldquo;<span className="text-slate-600 dark:text-slate-200">{query}</span>&rdquo;
            </div>
          ) : (
            <>
              {/* Invoices */}
              {matchingInvoices.length > 0 && (
                <div className="py-2">
                  <div className="text-[11px] font-bold uppercase text-slate-400 px-3 mb-1">Invoices</div>
                  {matchingInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => {
                        onSelectModule('Invoices', inv.id);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-indigo-50/60 dark:hover:bg-slate-800 cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white mr-2">{inv.invoiceNumber}</span>
                          <span className="text-slate-500">{inv.customerName}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {inv.currency} {inv.grandTotal.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Customers */}
              {matchingCustomers.length > 0 && (
                <div className="py-2">
                  <div className="text-[11px] font-bold uppercase text-slate-400 px-3 mb-1">Customers</div>
                  {matchingCustomers.map((cust) => (
                    <div
                      key={cust.id}
                      onClick={() => {
                        onSelectModule('Customers', cust.id);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-emerald-50/60 dark:hover:bg-slate-800 cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <User className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold text-slate-900 dark:text-white">{cust.companyName}</span>
                        <span className="text-slate-400 text-[11px]">({cust.name})</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Products */}
              {matchingProducts.length > 0 && (
                <div className="py-2">
                  <div className="text-[11px] font-bold uppercase text-slate-400 px-3 mb-1">Products</div>
                  {matchingProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        onSelectModule('Products', prod.id);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-amber-50/60 dark:hover:bg-slate-800 cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Package className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="font-bold text-slate-900 dark:text-white truncate">{prod.name}</span>
                        <span className="text-slate-400 text-[10px] shrink-0">[{prod.sku}]</span>
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0 ml-2">
                        {prod.currency} {prod.sellingPrice.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
