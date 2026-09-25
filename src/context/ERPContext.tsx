// ============================================================================
// Enterprise ERP Global Application Context & State Management
// Enforcing Single Source of Truth, Enterprise Workflows & Financial Invariants
// ============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Tenant,
  Company,
  Branch,
  Warehouse,
  Customer,
  Product,
  ProductCategory,
  Quotation,
  SalesOrder,
  Invoice,
  Payment,
  Supplier,
  PurchaseOrder,
  StockMovement,
  ChartAccount,
  JournalEntry,
  AuditLog,
  NotificationItem,
  ApprovalWorkflowNode,
  PermissionMatrixState,
  EnterpriseRole,
  CurrencyCode,
  AppModule,
  PermissionAction,
  UserSession,
  InvoiceStatus,
  OrderStatus,
} from '../types/erp';
import {
  INITIAL_TENANTS,
  INITIAL_COMPANY,
  INITIAL_CUSTOMERS,
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_QUOTATIONS,
  INITIAL_ORDERS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_CHART_OF_ACCOUNTS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_APPROVAL_WORKFLOW,
  generateDefaultPermissions,
} from '../data/demoData';

interface ERPContextType {
  // Authentication & Session
  isAuthenticated: boolean;
  isOnboarded: boolean;
  userSession: UserSession;
  login: (email?: string, password?: string) => void;
  logout: () => void;
  completeOnboarding: (data: Partial<Company>) => void;

  // Multi-Tenancy & Org Hierarchy
  tenants: Tenant[];
  activeTenant: Tenant;
  activeCompany: Company;
  activeBranch: Branch;
  activeWarehouse?: Warehouse;
  setActiveBranch: (branch: Branch) => void;
  setActiveWarehouse: (warehouse: Warehouse) => void;
  switchTenant: (tenantId: string) => void;

  // Preferences & Appearance
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeCurrency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;

  // RBAC & Permissions
  currentRole: EnterpriseRole;
  setRole: (role: EnterpriseRole) => void;
  permissionMatrix: PermissionMatrixState;
  updatePermission: (role: EnterpriseRole, module: AppModule, action: PermissionAction, allowed: boolean) => void;
  hasPermission: (module: AppModule, action: PermissionAction) => boolean;

  // Core ERP Entities
  customers: Customer[];
  products: Product[];
  categories: ProductCategory[];
  quotations: Quotation[];
  orders: SalesOrder[];
  invoices: Invoice[];
  payments: Payment[];
  warehouses: Warehouse[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  stockMovements: StockMovement[];
  chartOfAccounts: ChartAccount[];
  journalEntries: JournalEntry[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  approvalWorkflow: ApprovalWorkflowNode[];

  // Entity Action Handlers
  addCustomer: (customer: Omit<Customer, 'id' | 'tenantId' | 'totalSpent' | 'outstandingBalance' | 'lastTransactionDate'>) => void;
  updateCustomer: (customer: Customer) => void;

  addProduct: (product: Omit<Product, 'id' | 'tenantId'>) => void;
  updateProduct: (product: Product) => void;

  addQuotation: (quotation: Omit<Quotation, 'id'>) => void;
  updateQuotationStatus: (id: string, status: Quotation['status']) => void;
  convertQuotationToOrder: (quotationId: string) => string;
  convertQuotationToInvoice: (quotationId: string) => string;

  addSalesOrder: (order: Omit<SalesOrder, 'id'>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  convertOrderToInvoice: (orderId: string) => string;

  addInvoice: (invoice: Omit<Invoice, 'id'>) => Invoice;
  updateInvoiceStatus: (id: string, newStatus: InvoiceStatus) => void;
  issueCreditNote: (invoiceId: string, reason: string) => void;

  recordPayment: (payment: Omit<Payment, 'id'>) => void;

  recordStockMovement: (movement: Omit<StockMovement, 'id' | 'timestamp'>) => void;
  adjustStock: (productId: string, quantityDelta: number, reason: string) => void;

  createJournalEntry: (entry: Omit<JournalEntry, 'id' | 'status'>) => void;

  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;

  addAuditRecord: (action: string, module: AppModule, recordId: string, status?: 'Success' | 'Warning' | 'Blocked', reason?: string) => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);

  // Global Tenant & Org state
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [activeTenant, setActiveTenant] = useState<Tenant>(INITIAL_TENANTS[0]);
  const [activeCompany, setActiveCompany] = useState<Company>(INITIAL_COMPANY);
  const [activeBranch, setActiveBranch] = useState<Branch>(INITIAL_COMPANY.branches[0]);
  const [activeWarehouse, setActiveWarehouse] = useState<Warehouse | undefined>(INITIAL_COMPANY.branches[0]?.warehouses[0]);

  // Preferences
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>('LKR');
  const [currentRole, setCurrentRole] = useState<EnterpriseRole>('Tenant Owner');

  // RBAC Matrix
  const [permissionMatrix, setPermissionMatrix] = useState<PermissionMatrixState>(generateDefaultPermissions());

  // Entity datasets
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories] = useState<ProductCategory[]>(INITIAL_CATEGORIES);
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [orders, setOrders] = useState<SalesOrder[]>(INITIAL_ORDERS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(INITIAL_COMPANY.branches.flatMap((b) => b.warehouses));
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(INITIAL_STOCK_MOVEMENTS);
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartAccount[]>(INITIAL_CHART_OF_ACCOUNTS);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(INITIAL_JOURNAL_ENTRIES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [approvalWorkflow, setApprovalWorkflow] = useState<ApprovalWorkflowNode[]>(INITIAL_APPROVAL_WORKFLOW);

  // User Session
  const [userSession, setUserSession] = useState<UserSession>({
    id: 'usr-001',
    name: 'Priyantha De Silva',
    email: 'priyantha@apexglobal.lk',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
    role: currentRole,
    tenantId: activeTenant.id,
    activeCompanyId: activeCompany.id,
    activeBranchId: activeBranch.id,
    preferredCurrency: activeCurrency,
  });

  // Dark Mode Sync to root class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Keep session synced with role & currency
  useEffect(() => {
    setUserSession((prev) => ({
      ...prev,
      role: currentRole,
      preferredCurrency: activeCurrency,
      activeBranchId: activeBranch.id,
    }));
  }, [currentRole, activeCurrency, activeBranch]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const login = () => {
    setIsAuthenticated(true);
    addAuditRecord('User logged in to tenant portal', 'Settings', 'usr-001', 'Success');
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const completeOnboarding = (data: Partial<Company>) => {
    if (data.name) {
      setActiveCompany((prev) => ({ ...prev, ...data }));
    }
    setIsOnboarded(true);
    addAuditRecord('Completed Enterprise Onboarding Wizard', 'Settings', activeCompany.id, 'Success');
  };

  const switchTenant = (tenantId: string) => {
    const found = tenants.find((t) => t.id === tenantId);
    if (found) {
      setActiveTenant(found);
      addAuditRecord(`Switched tenant context to ${found.name}`, 'SaaS Admin', found.id, 'Success');
    }
  };

  const hasPermission = (module: AppModule, action: PermissionAction): boolean => {
    // Super Admin has unrestricted permissions
    if (currentRole === 'Super Admin' || currentRole === 'Tenant Owner') return true;
    return !!permissionMatrix[currentRole]?.[module]?.[action];
  };

  const updatePermission = (role: EnterpriseRole, module: AppModule, action: PermissionAction, allowed: boolean) => {
    setPermissionMatrix((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [module]: {
          ...prev[role][module],
          [action]: allowed,
        },
      },
    }));
    addAuditRecord(`Modified permission: ${role} -> ${module} [${action}] = ${allowed}`, 'Workflows', role, 'Success');
  };

  const addAuditRecord = (
    action: string,
    module: AppModule,
    recordId: string,
    status: 'Success' | 'Warning' | 'Blocked' = 'Success',
    reason?: string
  ) => {
    const newRecord: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: userSession.name,
      role: currentRole,
      action,
      module,
      recordId,
      ipAddress: '192.168.10.42 (Active Session)',
      status,
      reason,
    };
    setAuditLogs((prev) => [newRecord, ...prev]);
  };

  // Customers
  const addCustomer = (customerData: Omit<Customer, 'id' | 'tenantId' | 'totalSpent' | 'outstandingBalance' | 'lastTransactionDate'>) => {
    const newCust: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      tenantId: activeTenant.id,
      totalSpent: 0,
      outstandingBalance: 0,
      lastTransactionDate: new Date().toISOString().substring(0, 10),
    };
    setCustomers((prev) => [newCust, ...prev]);
    addAuditRecord(`Created customer ${newCust.companyName}`, 'Customers', newCust.id);
  };

  const updateCustomer = (cust: Customer) => {
    setCustomers((prev) => prev.map((c) => (c.id === cust.id ? cust : c)));
    addAuditRecord(`Updated customer profile: ${cust.companyName}`, 'Customers', cust.id);
  };

  // Products
  const addProduct = (productData: Omit<Product, 'id' | 'tenantId'>) => {
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      tenantId: activeTenant.id,
    };
    setProducts((prev) => [newProd, ...prev]);
    addAuditRecord(`Added product to catalog: ${newProd.name} (${newProd.sku})`, 'Products', newProd.id);
  };

  const updateProduct = (prod: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === prod.id ? prod : p)));
    addAuditRecord(`Updated product details: ${prod.name}`, 'Products', prod.id);
  };

  // Quotations
  const addQuotation = (quotationData: Omit<Quotation, 'id'>) => {
    const newQuote: Quotation = {
      ...quotationData,
      id: `quote-${Date.now()}`,
    };
    setQuotations((prev) => [newQuote, ...prev]);
    addAuditRecord(`Created quotation ${newQuote.quoteNumber}`, 'Quotations', newQuote.id);
  };

  const updateQuotationStatus = (id: string, status: Quotation['status']) => {
    setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    addAuditRecord(`Updated quotation ${id} status to ${status}`, 'Quotations', id);
  };

  const convertQuotationToOrder = (quotationId: string): string => {
    const quote = quotations.find((q) => q.id === quotationId);
    if (!quote) return '';

    const newOrderNumber = `SO-2026-${String(orders.length + 43).padStart(4, '0')}`;
    const newOrder: SalesOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      quotationId: quote.id,
      customerId: quote.customerId,
      customerName: quote.customerName,
      date: new Date().toISOString().substring(0, 10),
      deliveryDate: new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10),
      items: quote.items,
      subtotal: quote.subtotal,
      taxTotal: quote.taxTotal,
      grandTotal: quote.grandTotal,
      currency: quote.currency,
      status: 'Confirmed',
      paymentStatus: 'Pending',
      shippingAddress: 'Client Headquarters Delivery Site',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setQuotations((prev) => prev.map((q) => (q.id === quotationId ? { ...q, status: 'Converted' } : q)));
    addAuditRecord(`Converted Quotation ${quote.quoteNumber} to Sales Order ${newOrderNumber}`, 'Sales Orders', newOrder.id);
    return newOrder.id;
  };

  const convertQuotationToInvoice = (quotationId: string): string => {
    const quote = quotations.find((q) => q.id === quotationId);
    if (!quote) return '';

    const newInvNumber = `INV-2026-${String(invoices.length + 5).padStart(4, '0')}`;
    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: newInvNumber,
      customerId: quote.customerId,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      customerAddress: 'Registered Client Office Address',
      issueDate: new Date().toISOString().substring(0, 10),
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10),
      items: quote.items,
      subtotal: quote.subtotal,
      discountTotal: quote.discountTotal,
      vatAmount: quote.taxTotal,
      ssclAmount: 0,
      taxTotal: quote.taxTotal,
      grandTotal: quote.grandTotal,
      paidAmount: 0,
      outstandingBalance: quote.grandTotal,
      currency: quote.currency,
      status: 'Draft',
      terms: 'Payment due within 30 days of issue.',
      notes: `Generated directly from Quotation ${quote.quoteNumber}`,
    };

    setInvoices((prev) => [newInv, ...prev]);
    setQuotations((prev) => prev.map((q) => (q.id === quotationId ? { ...q, status: 'Converted' } : q)));
    addAuditRecord(`Generated Invoice ${newInvNumber} from Quotation ${quote.quoteNumber}`, 'Invoices', newInv.id);
    return newInv.id;
  };

  // Orders
  const addSalesOrder = (orderData: Omit<SalesOrder, 'id'>) => {
    const newOrder: SalesOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
    };
    setOrders((prev) => [newOrder, ...prev]);
    addAuditRecord(`Created Sales Order ${newOrder.orderNumber}`, 'Sales Orders', newOrder.id);
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    addAuditRecord(`Updated Sales Order ${id} to ${status}`, 'Sales Orders', id);
  };

  const convertOrderToInvoice = (orderId: string): string => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return '';

    const newInvNumber = `INV-2026-${String(invoices.length + 5).padStart(4, '0')}`;
    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: newInvNumber,
      orderId: order.id,
      customerId: order.customerId,
      customerName: order.customerName,
      customerEmail: 'accounts@client.lk',
      customerAddress: order.shippingAddress,
      issueDate: new Date().toISOString().substring(0, 10),
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10),
      items: order.items,
      subtotal: order.subtotal,
      discountTotal: 0,
      vatAmount: order.taxTotal,
      ssclAmount: 0,
      taxTotal: order.taxTotal,
      grandTotal: order.grandTotal,
      paidAmount: 0,
      outstandingBalance: order.grandTotal,
      currency: order.currency,
      status: 'Submitted',
      terms: 'Standard commercial invoice terms apply.',
      notes: `Derived from confirmed Sales Order ${order.orderNumber}`,
    };

    setInvoices((prev) => [newInv, ...prev]);
    addAuditRecord(`Generated Invoice ${newInvNumber} from Sales Order ${order.orderNumber}`, 'Invoices', newInv.id);
    return newInv.id;
  };

  // Invoices
  // Note: Financial controls rule: Draft -> Submit -> Approve -> Finalize -> Paid
  const addInvoice = (invoiceData: Omit<Invoice, 'id'>): Invoice => {
    const newInv: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
    };
    setInvoices((prev) => [newInv, ...prev]);

    // Update customer outstanding balance
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === newInv.customerId
          ? {
              ...c,
              outstandingBalance: c.outstandingBalance + newInv.outstandingBalance,
              totalSpent: c.totalSpent + newInv.grandTotal,
              lastTransactionDate: newInv.issueDate,
            }
          : c
      )
    );

    addAuditRecord(`Created Invoice ${newInv.invoiceNumber} (${newInv.currency} ${newInv.grandTotal})`, 'Invoices', newInv.id);
    return newInv;
  };

  const updateInvoiceStatus = (id: string, newStatus: InvoiceStatus) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== id) return inv;
        // Check if finalizing: lock and stamp
        const finalizedAt = newStatus === 'Finalized' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : inv.finalizedAt;
        const approvedBy = newStatus === 'Approved' || newStatus === 'Finalized' ? `${userSession.name} (${userSession.role})` : inv.approvedBy;
        return {
          ...inv,
          status: newStatus,
          finalizedAt,
          approvedBy,
        };
      })
    );
    addAuditRecord(`Updated Invoice ${id} status to ${newStatus}`, 'Invoices', id);
  };

  const issueCreditNote = (invoiceId: string, reason: string) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;

    setInvoices((prev) =>
      prev.map((i) => (i.id === invoiceId ? { ...i, hasCreditNote: true, status: 'Cancelled' as InvoiceStatus } : i))
    );

    // Relieve customer outstanding balance
    setCustomers((prev) =>
      prev.map((c) => (c.id === inv.customerId ? { ...c, outstandingBalance: Math.max(0, c.outstandingBalance - inv.outstandingBalance) } : c))
    );

    addAuditRecord(`Issued Credit Note against ${inv.invoiceNumber}. Reason: ${reason}`, 'Credit Notes', invoiceId, 'Success', reason);
    addNotification({
      title: 'Credit Note Issued',
      message: `Credit note issued for ${inv.invoiceNumber} (${inv.currency} ${inv.grandTotal}).`,
      type: 'invoice',
      severity: 'warning',
      linkModule: 'Invoices',
    });
  };

  // Payments
  const recordPayment = (paymentData: Omit<Payment, 'id'>) => {
    const newPay: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
    };
    setPayments((prev) => [newPay, ...prev]);

    // Update invoice paid and outstanding
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === newPay.invoiceId) {
          const newPaid = inv.paidAmount + newPay.amount;
          const newOutstanding = Math.max(0, inv.grandTotal - newPaid);
          const newStatus: InvoiceStatus = newOutstanding === 0 ? 'Paid' : 'Partially Paid';
          return {
            ...inv,
            paidAmount: newPaid,
            outstandingBalance: newOutstanding,
            status: newStatus,
          };
        }
        return inv;
      })
    );

    // Update customer outstanding
    setCustomers((prev) =>
      prev.map((c) => (c.id === newPay.customerId ? { ...c, outstandingBalance: Math.max(0, c.outstandingBalance - newPay.amount) } : c))
    );

    // Automated accounting ledger entry: Debit Bank, Credit Accounts Receivable
    const journalLineBank = {
      accountId: 'acc-1020',
      accountNumber: '1020',
      accountName: 'Commercial Bank of Ceylon',
      debit: newPay.amount,
      credit: 0,
      description: `Payment received ${newPay.paymentNumber} ref: ${newPay.referenceNumber}`,
    };
    const journalLineAR = {
      accountId: 'acc-1200',
      accountNumber: '1200',
      accountName: 'Accounts Receivable (Trade Debtors)',
      debit: 0,
      credit: newPay.amount,
      description: `Customer allocation for ${newPay.customerName}`,
    };

    const newJE: JournalEntry = {
      id: `je-${Date.now()}`,
      entryNumber: `JV-2026-${String(journalEntries.length + 46).padStart(4, '0')}`,
      date: newPay.paymentDate,
      reference: newPay.paymentNumber,
      narration: `Automated payment entry: ${newPay.method} receipt for Invoice ${newPay.invoiceNumber}`,
      lines: [journalLineBank, journalLineAR],
      totalDebit: newPay.amount,
      totalCredit: newPay.amount,
      status: 'Posted',
      createdBy: `${userSession.name} (Auto-Posting)`,
    };
    setJournalEntries((prev) => [newJE, ...prev]);

    // Update chart of accounts balances
    setChartOfAccounts((prev) =>
      prev.map((acc) => {
        if (acc.accountNumber === '1020') return { ...acc, balance: acc.balance + newPay.amount };
        if (acc.accountNumber === '1200') return { ...acc, balance: Math.max(0, acc.balance - newPay.amount) };
        return acc;
      })
    );

    addAuditRecord(`Recorded payment ${newPay.paymentNumber} for ${newPay.currency} ${newPay.amount}`, 'Payments', newPay.id);
    addNotification({
      title: 'Payment Received',
      message: `${newPay.customerName} settled ${newPay.currency} ${newPay.amount} via ${newPay.method}.`,
      type: 'payment',
      severity: 'success',
      linkModule: 'Payments',
    });
  };

  // Stock movements
  const recordStockMovement = (movementData: Omit<StockMovement, 'id' | 'timestamp'>) => {
    const newMove: StockMovement = {
      ...movementData,
      id: `sm-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setStockMovements((prev) => [newMove, ...prev]);

    // Update product quantity
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === newMove.productId) {
          const updatedStock = p.stockQuantity + newMove.quantity;
          return { ...p, stockQuantity: updatedStock };
        }
        return p;
      })
    );

    addAuditRecord(`Stock movement (${newMove.type}): ${newMove.productName} delta ${newMove.quantity}`, 'Inventory', newMove.productId);
  };

  const adjustStock = (productId: string, quantityDelta: number, reason: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    recordStockMovement({
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      type: 'Adjustment',
      warehouseName: activeBranch.warehouses[0]?.name || 'Central Logistics Terminal',
      quantity: quantityDelta,
      referenceDoc: `ADJ-${new Date().toISOString().substring(0, 10)}`,
      performedBy: userSession.name,
      reason,
    });
  };

  // Accounting
  const createJournalEntry = (entryData: Omit<JournalEntry, 'id' | 'status'>) => {
    const newEntry: JournalEntry = {
      ...entryData,
      id: `je-${Date.now()}`,
      status: 'Posted',
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
    addAuditRecord(`Posted Journal Entry ${newEntry.entryNumber}`, 'Accounting', newEntry.id);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newItem, ...prev]);
  };

  return (
    <ERPContext.Provider
      value={{
        isAuthenticated,
        isOnboarded,
        userSession,
        login,
        logout,
        completeOnboarding,

        tenants,
        activeTenant,
        activeCompany,
        activeBranch,
        activeWarehouse,
        setActiveBranch,
        setActiveWarehouse,
        switchTenant,

        theme,
        toggleTheme,
        activeCurrency,
        setCurrency: setActiveCurrency,

        currentRole,
        setRole: setCurrentRole,
        permissionMatrix,
        updatePermission,
        hasPermission,

        customers,
        products,
        categories,
        quotations,
        orders,
        invoices,
        payments,
        warehouses,
        suppliers,
        purchaseOrders,
        stockMovements,
        chartOfAccounts,
        journalEntries,
        auditLogs,
        notifications,
        approvalWorkflow,

        addCustomer,
        updateCustomer,
        addProduct,
        updateProduct,
        addQuotation,
        updateQuotationStatus,
        convertQuotationToOrder,
        convertQuotationToInvoice,
        addSalesOrder,
        updateOrderStatus,
        convertOrderToInvoice,
        addInvoice,
        updateInvoiceStatus,
        issueCreditNote,
        recordPayment,
        recordStockMovement,
        adjustStock,
        createJournalEntry,
        markNotificationAsRead,
        clearAllNotifications,
        addNotification,
        addAuditRecord,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = (): ERPContextType => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
