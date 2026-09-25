// ============================================================================
// Enterprise Billing & ERP SaaS Platform - Core Domain Models & Type System
// Supporting Multi-Tenancy, Multi-Company, Multi-Currency, and RBAC
// ============================================================================

export type CurrencyCode = 'LKR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SGD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  exchangeRateToUSD: number; // For multi-currency conversion
  decimalPlaces: number;
}

export type TenantPlan = 'Starter' | 'Professional' | 'Business' | 'Enterprise';

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: TenantPlan;
  logoUrl?: string;
  country: string;
  taxNumber: string;
  status: 'active' | 'suspended' | 'trial';
  createdAt: string;
  renewalDate: string;
  storageUsageMb: number;
  apiCallsThisMonth: number;
  userCount: number;
  branchCount: number;
  mrrUSD: number;
}

export interface Company {
  id: string;
  tenantId: string;
  name: string;
  legalName: string;
  taxRegistrationNumber: string; // e.g. Sri Lanka TIN / VAT
  svatNumber?: string; // Simplified VAT for Sri Lanka
  currency: CurrencyCode;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  logo: string;
  branches: Branch[];
}

export interface Branch {
  id: string;
  companyId: string;
  name: string;
  code: string;
  city: string;
  isHeadquarters: boolean;
  warehouses: Warehouse[];
}

export interface Warehouse {
  id: string;
  branchId: string;
  name: string;
  code: string;
  location: string;
  capacityUnits: number;
  currentStockUnits: number;
}

// ----------------------------------------------------------------------------
// RBAC Roles & Permissions
// ----------------------------------------------------------------------------
export type EnterpriseRole =
  | 'Super Admin'
  | 'Tenant Owner'
  | 'Administrator'
  | 'Finance Manager'
  | 'Accountant'
  | 'Sales Manager'
  | 'Sales Executive'
  | 'Purchase Manager'
  | 'Inventory Manager'
  | 'Warehouse Staff'
  | 'Cashier'
  | 'Auditor'
  | 'Employee';

export type PermissionAction =
  | 'View'
  | 'Create'
  | 'Edit'
  | 'Delete'
  | 'Approve'
  | 'Finalize'
  | 'Cancel'
  | 'Export'
  | 'Print'
  | 'Refund'
  | 'Adjust'
  | 'Post'
  | 'Reverse';

export type AppModule =
  | 'Dashboard'
  | 'Customers'
  | 'Products'
  | 'Quotations'
  | 'Sales Orders'
  | 'Invoices'
  | 'Payments'
  | 'Credit Notes'
  | 'Inventory'
  | 'Warehouses'
  | 'Suppliers'
  | 'Purchases'
  | 'Goods Received'
  | 'Accounting'
  | 'Reports'
  | 'Workflows'
  | 'SaaS Admin'
  | 'Settings'
  | 'Audit Logs';

export type PermissionMatrixState = Record<EnterpriseRole, Record<AppModule, Record<PermissionAction, boolean>>>;

export interface UserSession {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: EnterpriseRole;
  tenantId: string;
  activeCompanyId: string;
  activeBranchId: string;
  activeWarehouseId?: string;
  preferredCurrency: CurrencyCode;
}

// ----------------------------------------------------------------------------
// CRM & Sales Entities
// ----------------------------------------------------------------------------
export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  avatar: string;
  customerType: 'Enterprise' | 'Corporate' | 'Wholesale' | 'Retail' | 'Government';
  taxNumber: string;
  currency: CurrencyCode;
  creditLimit: number;
  outstandingBalance: number;
  totalSpent: number;
  status: 'Active' | 'On Hold' | 'Inactive';
  billingAddress: string;
  shippingAddress: string;
  city: string;
  country: string;
  paymentTermsDays: number;
  lastTransactionDate: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  code: string;
  itemCount: number;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  brand: string;
  description: string;
  image: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  reorderLevel: number;
  unit: 'Units' | 'Kg' | 'Meters' | 'Hours' | 'Licenses';
  taxRate: number; // e.g. 18% VAT, 2.5% SSCL
  warehouseId: string;
  isActive: boolean;
  currency: CurrencyCode;
}

export interface LineItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
  taxRatePercentage: number;
  taxAmount: number;
  total: number;
}

export type QuotationStatus = 'Draft' | 'Sent' | 'Approved' | 'Converted' | 'Rejected' | 'Expired';

export interface Quotation {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  expiryDate: string;
  items: LineItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
  currency: CurrencyCode;
  status: QuotationStatus;
  salespersonName: string;
  notes: string;
}

export type OrderStatus = 'Draft' | 'Confirmed' | 'Processing' | 'Delivered' | 'Completed' | 'Cancelled';

export interface SalesOrder {
  id: string;
  orderNumber: string;
  quotationId?: string;
  customerId: string;
  customerName: string;
  date: string;
  deliveryDate: string;
  items: LineItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  currency: CurrencyCode;
  status: OrderStatus;
  paymentStatus: 'Pending' | 'Partially Paid' | 'Paid';
  shippingAddress: string;
  trackingNumber?: string;
}

export type InvoiceStatus = 'Draft' | 'Submitted' | 'Approved' | 'Finalized' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-0001
  orderId?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerTaxNumber?: string;
  issueDate: string;
  dueDate: string;
  items: LineItem[];
  subtotal: number;
  discountTotal: number;
  vatAmount: number; // e.g. 18%
  ssclAmount?: number; // e.g. 2.5% Social Security Contribution Levy (Sri Lanka)
  taxTotal: number;
  grandTotal: number;
  paidAmount: number;
  outstandingBalance: number;
  currency: CurrencyCode;
  status: InvoiceStatus;
  terms: string;
  notes: string;
  approvedBy?: string;
  finalizedAt?: string;
  hasCreditNote?: boolean;
}

export type PaymentMethod = 'Bank Transfer' | 'Card' | 'Online Gateway' | 'Cash' | 'Cheque';

export interface Payment {
  id: string;
  paymentNumber: string; // e.g. PAY-2026-0089
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: CurrencyCode;
  paymentDate: string;
  method: PaymentMethod;
  referenceNumber: string;
  bankAccount?: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  notes?: string;
}

// ----------------------------------------------------------------------------
// Procurement & Inventory
// ----------------------------------------------------------------------------
export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  currency: CurrencyCode;
  taxNumber: string;
  outstandingPayable: number;
  rating: number;
  status: 'Active' | 'Pending' | 'Blacklisted';
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  items: LineItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  currency: CurrencyCode;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Received' | 'Billed' | 'Cancelled';
  approvalLevel: 'Pending Manager' | 'Pending Finance' | 'Approved';
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'Inbound Purchase' | 'Outbound Sale' | 'Adjustment' | 'Transfer In' | 'Transfer Out';
  warehouseName: string;
  quantity: number;
  referenceDoc: string;
  timestamp: string;
  performedBy: string;
  reason?: string;
}

// ----------------------------------------------------------------------------
// Accounting & Finance
// ----------------------------------------------------------------------------
export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

export interface ChartAccount {
  id: string;
  accountNumber: string; // e.g. 1010, 2010, 4010
  name: string;
  type: AccountType;
  currency: CurrencyCode;
  balance: number;
  isDebitNormal: boolean;
  isActive: boolean;
}

export interface JournalEntryLine {
  accountId: string;
  accountNumber: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  reference: string;
  narration: string;
  lines: JournalEntryLine[];
  totalDebit: number;
  totalCredit: number;
  status: 'Posted' | 'Draft' | 'Reversed';
  createdBy: string;
}

// ----------------------------------------------------------------------------
// Audit Log, Notification & Workflow
// ----------------------------------------------------------------------------
export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: EnterpriseRole;
  action: string;
  module: AppModule;
  recordId: string;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Blocked';
  beforeState?: string;
  afterState?: string;
  reason?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'invoice' | 'payment' | 'approval' | 'stock' | 'system';
  severity: 'info' | 'warning' | 'critical' | 'success';
  timestamp: string;
  read: boolean;
  linkModule?: AppModule;
}

export interface ApprovalWorkflowNode {
  id: string;
  stepName: string;
  requiredRole: EnterpriseRole;
  thresholdAmount?: number;
  currency?: CurrencyCode;
  conditionDescription: string;
  status: 'active' | 'optional';
}
