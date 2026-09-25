import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { AppModule, Invoice } from '../../types/erp';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CommandPalette } from './CommandPalette';
import { NotificationsDrawer } from './NotificationsDrawer';
import { MainDashboard } from '../dashboard/MainDashboard';
import { CustomerList } from '../sales/CustomerList';
import { ProductCatalog } from '../sales/ProductCatalog';
import { QuotationList } from '../sales/QuotationList';
import { SalesOrderList } from '../sales/SalesOrderList';
import { InvoiceList } from '../sales/InvoiceList';
import { PaymentModule } from '../sales/PaymentModule';
import { InventoryDashboard } from '../inventory/InventoryDashboard';
import { ProcurementModule } from '../procurement/ProcurementModule';
import { AccountingModule } from '../accounting/AccountingModule';
import { FinancialReportsCenter } from '../reports/FinancialReportsCenter';
import { PermissionMatrix } from '../rbac/PermissionMatrix';
import { SaasAdminDashboard } from '../saas/SaasAdminDashboard';
import { SettingsCenter } from '../settings/SettingsCenter';
import { AuditLogView } from '../settings/AuditLogView';
import { InvoiceBuilderModal } from '../sales/InvoiceBuilderModal';

export const AppShell: React.FC = () => {
  const { currentRole } = useERP();
  const [currentModule, setCurrentModule] = useState<AppModule>('Dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickInvoiceOpen, setIsQuickInvoiceOpen] = useState(false);
  const [activePaymentInvoice, setActivePaymentInvoice] = useState<Invoice | null>(null);

  const handleQuickCreate = (type: 'invoice' | 'quotation' | 'customer' | 'product' | 'payment') => {
    switch (type) {
      case 'invoice':
        setIsQuickInvoiceOpen(true);
        break;
      case 'quotation':
        setCurrentModule('Quotations');
        break;
      case 'customer':
        setCurrentModule('Customers');
        break;
      case 'product':
        setCurrentModule('Products');
        break;
      case 'payment':
        setCurrentModule('Payments');
        break;
    }
  };

  const handleOpenRecordPaymentModal = (invoice: Invoice) => {
    setActivePaymentInvoice(invoice);
    setCurrentModule('Payments');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100">
      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-xs"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Desktop & Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:static lg:transform-none transition-transform duration-200 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar
          currentModule={currentModule}
          onSelectModule={(mod) => {
            setCurrentModule(mod);
            setIsMobileSidebarOpen(false);
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Application Header */}
        <Header
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onQuickCreate={handleQuickCreate}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onNavigateModule={(mod) => setCurrentModule(mod)}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentModule === 'Dashboard' && (
              <MainDashboard
                onNavigateModule={(mod) => setCurrentModule(mod)}
                onOpenQuickCreate={handleQuickCreate}
              />
            )}
            {currentModule === 'Customers' && <CustomerList />}
            {currentModule === 'Products' && <ProductCatalog />}
            {currentModule === 'Quotations' && <QuotationList />}
            {currentModule === 'Sales Orders' && <SalesOrderList />}
            {currentModule === 'Invoices' && (
              <InvoiceList
                onOpenRecordPaymentModal={handleOpenRecordPaymentModal}
              />
            )}
            {currentModule === 'Payments' && (
              <PaymentModule initialInvoice={activePaymentInvoice} />
            )}
            {(currentModule === 'Inventory' || currentModule === 'Warehouses') && (
              <InventoryDashboard />
            )}
            {(currentModule === 'Suppliers' || currentModule === 'Purchases' || currentModule === 'Goods Received') && (
              <ProcurementModule />
            )}
            {currentModule === 'Accounting' && <AccountingModule />}
            {currentModule === 'Reports' && <FinancialReportsCenter />}
            {currentModule === 'Workflows' && <PermissionMatrix />}
            {currentModule === 'SaaS Admin' && <SaasAdminDashboard />}
            {currentModule === 'Settings' && <SettingsCenter />}
            {currentModule === 'Audit Logs' && <AuditLogView />}
          </div>
        </main>
      </div>

      {/* Global Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectModule={(mod) => setCurrentModule(mod)}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateModule={(mod) => setCurrentModule(mod)}
      />

      {/* Quick Invoice Builder Modal */}
      <InvoiceBuilderModal
        isOpen={isQuickInvoiceOpen}
        onClose={() => setIsQuickInvoiceOpen(false)}
        onInvoiceCreated={() => setCurrentModule('Invoices')}
      />
    </div>
  );
};
