import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Building,
  ArrowUpRight,
  Filter,
  CheckCircle,
  Clock,
  FileText,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Customer } from '../../types/erp';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Table, Column } from '../common/Table';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export const CustomerList: React.FC = () => {
  const { customers, invoices, activeCurrency, addCustomer, updateCustomer } = useERP();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'statement'>('overview');

  // New Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustCompany, setNewCustCompany] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustType, setNewCustType] = useState<Customer['customerType']>('Enterprise');
  const [newCustCredit, setNewCustCredit] = useState(10000000);
  const [newCustTax, setNewCustTax] = useState('VAT-70019283-7000');
  const [newCustAddress, setNewCustAddress] = useState('Colombo, Sri Lanka');

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustCompany.trim() || !newCustName.trim()) return;

    addCustomer({
      name: newCustName,
      companyName: newCustCompany,
      email: newCustEmail || 'finance@client.lk',
      phone: newCustPhone || '+94 11 234 5678',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
      customerType: newCustType,
      taxNumber: newCustTax,
      currency: activeCurrency,
      creditLimit: Number(newCustCredit),
      status: 'Active',
      billingAddress: newCustAddress,
      shippingAddress: newCustAddress,
      city: 'Colombo',
      country: 'Sri Lanka',
      paymentTermsDays: 30,
    });

    setIsAddModalOpen(false);
    setNewCustName('');
    setNewCustCompany('');
  };

  const columns: Column<Customer>[] = [
    {
      header: 'Customer & Company',
      render: (c) => (
        <div className="flex items-center gap-3">
          <img
            src={c.avatar}
            alt={c.companyName}
            className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
          />
          <div>
            <span className="font-bold text-slate-900 dark:text-white block hover:text-indigo-600 transition-colors">
              {c.companyName}
            </span>
            <span className="text-xs text-slate-400">
              {c.name} • {c.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Type',
      render: (c) => (
        <Badge
          variant={
            c.customerType === 'Enterprise'
              ? 'purple'
              : c.customerType === 'Corporate'
              ? 'info'
              : c.customerType === 'Wholesale'
              ? 'warning'
              : 'neutral'
          }
          size="sm"
        >
          {c.customerType}
        </Badge>
      ),
    },
    {
      header: 'Status',
      render: (c) => (
        <Badge variant={c.status === 'Active' ? 'success' : 'danger'} dot size="sm">
          {c.status}
        </Badge>
      ),
    },
    {
      header: 'Credit Facility',
      render: (c) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
            {formatCurrency(c.creditLimit, activeCurrency)}
          </span>
          <span className="text-[10px] text-slate-400">{c.paymentTermsDays} Days Terms</span>
        </div>
      ),
    },
    {
      header: 'Outstanding Balance',
      align: 'right',
      render: (c) => (
        <div>
          <span
            className={`font-bold block text-xs ${
              c.outstandingBalance > 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {formatCurrency(c.outstandingBalance, activeCurrency)}
          </span>
          <span className="text-[10px] text-slate-400">
            Total Billed: {formatCurrency(c.totalSpent, activeCurrency).split('.')[0]}
          </span>
        </div>
      ),
    },
    {
      header: 'Action',
      align: 'center',
      render: (c) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCustomer(c);
          }}
        >
          Profile
        </Button>
      ),
    },
  ];

  // Customer Invoices for the profile modal
  const customerInvoices = selectedCustomer
    ? invoices.filter((i) => i.customerId === selectedCustomer.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Customer CRM & Credit Accounts
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage enterprise clients, corporate credit facilities, and multi-currency billing ledgers
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Customer
        </Button>
      </div>

      {/* Customer Table */}
      <Table
        columns={columns}
        data={customers}
        keyExtractor={(c) => c.id}
        searchPlaceholder="Search customers by name, company, email, city..."
        searchFilter={(c, q) =>
          c.name.toLowerCase().includes(q) ||
          c.companyName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q)
        }
        onRowClick={(c) => setSelectedCustomer(c)}
      />

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Enterprise Customer"
        subtitle="Set up corporate identity, tax registration, and credit parameters"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Company Legal Name *
              </label>
              <input
                type="text"
                required
                value={newCustCompany}
                onChange={(e) => setNewCustCompany(e.target.value)}
                placeholder="e.g. Lanka Logistics Global PLC"
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Primary Contact Person *
              </label>
              <input
                type="text"
                required
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                placeholder="e.g. Sanjeewa Wickramasinghe"
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Corporate Email
              </label>
              <input
                type="email"
                value={newCustEmail}
                onChange={(e) => setNewCustEmail(e.target.value)}
                placeholder="procurement@client.lk"
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={newCustPhone}
                onChange={(e) => setNewCustPhone(e.target.value)}
                placeholder="+94 11 200 4000"
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Customer Category
              </label>
              <select
                value={newCustType}
                onChange={(e) => setNewCustType(e.target.value as any)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              >
                <option value="Enterprise">Enterprise</option>
                <option value="Corporate">Corporate</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Retail">Retail</option>
                <option value="Government">Government / State</option>
              </select>
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                VAT / TIN Tax Number
              </label>
              <input
                type="text"
                value={newCustTax}
                onChange={(e) => setNewCustTax(e.target.value)}
                placeholder="VAT-100234900-7000"
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Credit Limit Facility ({activeCurrency})
              </label>
              <input
                type="number"
                value={newCustCredit}
                onChange={(e) => setNewCustCredit(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Billing & Dispatch Address
              </label>
              <textarea
                rows={2}
                value={newCustAddress}
                onChange={(e) => setNewCustAddress(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Customer Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Customer Profile Detailed Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={
            <div className="flex items-center gap-3">
              <img
                src={selectedCustomer.avatar}
                alt={selectedCustomer.companyName}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <span className="text-base font-extrabold block">{selectedCustomer.companyName}</span>
                <span className="text-xs text-slate-400 font-normal">
                  {selectedCustomer.customerType} • TIN: {selectedCustomer.taxNumber}
                </span>
              </div>
            </div>
          }
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 font-bold border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Financial Overview
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`px-4 py-2 font-bold border-b-2 transition-colors ${
                  activeTab === 'invoices'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Invoices ({customerInvoices.length})
              </button>
              <button
                onClick={() => setActiveTab('statement')}
                className={`px-4 py-2 font-bold border-b-2 transition-colors ${
                  activeTab === 'statement'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Customer Statement
              </button>
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 3 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                    <p className="text-[11px] font-bold uppercase text-slate-400">Total Billed</p>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                      {formatCurrency(selectedCustomer.totalSpent, activeCurrency)}
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">Lifetime Customer</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                    <p className="text-[11px] font-bold uppercase text-slate-400">Outstanding Due</p>
                    <p className="text-lg font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                      {formatCurrency(selectedCustomer.outstandingBalance, activeCurrency)}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">30-day billing terms</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                    <p className="text-[11px] font-bold uppercase text-slate-400">Approved Credit Limit</p>
                    <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                      {formatCurrency(selectedCustomer.creditLimit, activeCurrency)}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Facility Available</p>
                  </div>
                </div>

                {/* Details list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-white">Contact & Billing</h4>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>Contact:</strong> {selectedCustomer.name}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>Email:</strong> {selectedCustomer.email}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>Phone:</strong> {selectedCustomer.phone}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>Address:</strong> {selectedCustomer.billingAddress}
                    </p>
                  </div>

                  <div className="space-y-2 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-white">Tax & Commercial Policies</h4>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>Tax Number:</strong> {selectedCustomer.taxNumber}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>Payment Terms:</strong> Net {selectedCustomer.paymentTermsDays} Days
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>Operating Currency:</strong> {selectedCustomer.currency}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>Last Transaction:</strong> {formatDate(selectedCustomer.lastTransactionDate)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Invoices */}
            {activeTab === 'invoices' && (
              <div className="space-y-3">
                {customerInvoices.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No invoices recorded for this client yet.</p>
                ) : (
                  customerInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white mr-2">{inv.invoiceNumber}</span>
                        <Badge
                          variant={
                            inv.status === 'Paid'
                              ? 'success'
                              : inv.status === 'Overdue'
                              ? 'danger'
                              : inv.status === 'Partially Paid'
                              ? 'warning'
                              : 'purple'
                          }
                          size="sm"
                        >
                          {inv.status}
                        </Badge>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Issue: {formatDate(inv.issueDate)} • Due: {formatDate(inv.dueDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-sm block">
                          {formatCurrency(inv.grandTotal, activeCurrency)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Due: {formatCurrency(inv.outstandingBalance, activeCurrency)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab: Statement */}
            {activeTab === 'statement' && (
              <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Customer Statement of Account</h4>
                    <p className="text-[11px] text-slate-500">As of {formatDate('2026-09-24')}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    Print Statement
                  </Button>
                </div>
                <div className="space-y-1">
                  <p><strong>Customer:</strong> {selectedCustomer.companyName}</p>
                  <p><strong>Current Outstanding Balance:</strong> <span className="text-rose-600 font-bold">{formatCurrency(selectedCustomer.outstandingBalance, activeCurrency)}</span></p>
                  <p><strong>Status:</strong> All entries verified with General Ledger Trade Receivables.</p>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
