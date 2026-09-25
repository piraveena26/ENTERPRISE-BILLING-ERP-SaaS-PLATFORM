// ============================================================================
// Formatters and Financial Calculation Utilities
// ============================================================================

import { CurrencyCode, CurrencyConfig, LineItem } from '../types/erp';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  LKR: { code: 'LKR', symbol: 'Rs.', name: 'Sri Lankan Rupee', exchangeRateToUSD: 0.0033, decimalPlaces: 2 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRateToUSD: 1.0, decimalPlaces: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', exchangeRateToUSD: 1.09, decimalPlaces: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRateToUSD: 1.28, decimalPlaces: 2 },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', exchangeRateToUSD: 0.27, decimalPlaces: 2 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', exchangeRateToUSD: 0.76, decimalPlaces: 2 },
};

/**
 * Format numeric currency amount accurately based on active currency code
 */
export function formatCurrency(amount: number, currency: CurrencyCode = 'LKR'): string {
  const config = CURRENCIES[currency] || CURRENCIES.LKR;
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: config.decimalPlaces,
    maximumFractionDigits: config.decimalPlaces,
  }).format(amount || 0);

  if (currency === 'LKR') {
    return `LKR ${formattedNumber}`;
  }
  return `${config.symbol}${formattedNumber}`;
}

/**
 * Convert amount between two currencies via USD baseline
 */
export function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount;
  const rateFrom = CURRENCIES[from]?.exchangeRateToUSD || 1;
  const rateTo = CURRENCIES[to]?.exchangeRateToUSD || 1;
  const amountInUSD = amount * rateFrom;
  return amountInUSD / rateTo;
}

/**
 * Calculate line item tax, discount and net total
 * Why this logic exists: Sri Lanka and international ERP laws mandate itemized tax breakdown
 */
export function calculateLineItem(
  quantity: number,
  unitPrice: number,
  discountPercentage: number,
  taxRatePercentage: number
): {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
} {
  const subtotal = quantity * unitPrice;
  const discountAmount = subtotal * (discountPercentage / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (taxRatePercentage / 100);
  const total = taxableAmount + taxAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    taxableAmount: Math.round(taxableAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Calculate totals for a full invoice with Sri Lanka VAT (18%) and optional SSCL (2.5%)
 */
export function calculateInvoiceTotals(
  items: LineItem[],
  includeSSCL: boolean = false
): {
  subtotal: number;
  discountTotal: number;
  vatAmount: number;
  ssclAmount: number;
  taxTotal: number;
  grandTotal: number;
} {
  let subtotal = 0;
  let discountTotal = 0;
  let taxTotal = 0;

  for (const item of items) {
    const itemSub = item.quantity * item.unitPrice;
    const itemDisc = itemSub * (item.discountPercentage / 100);
    subtotal += itemSub;
    discountTotal += itemDisc;
    taxTotal += item.taxAmount;
  }

  const taxableBase = subtotal - discountTotal;
  // Sri Lanka Social Security Contribution Levy (2.5% of liable turnover)
  const ssclAmount = includeSSCL ? Math.round(taxableBase * 0.025 * 100) / 100 : 0;
  const totalTaxes = taxTotal + ssclAmount;
  const grandTotal = taxableBase + totalTaxes;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountTotal: Math.round(discountTotal * 100) / 100,
    vatAmount: Math.round(taxTotal * 100) / 100,
    ssclAmount,
    taxTotal: Math.round(totalTaxes * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
}

/**
 * Format standard ISO date to clean enterprise presentation
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Calculate aging in days from due date
 */
export function calculateAgingDays(dueDate: string): number {
  const due = new Date(dueDate).getTime();
  const now = new Date('2026-09-24').getTime(); // System reference date
  const diffDays = Math.floor((now - due) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Bucket aging into enterprise standard financial categories
 */
export function getAgingBucket(dueDate: string): 'Current' | '1-30 Days' | '31-60 Days' | '61-90 Days' | '90+ Days' {
  const days = calculateAgingDays(dueDate);
  if (days <= 0) return 'Current';
  if (days <= 30) return '1-30 Days';
  if (days <= 60) return '31-60 Days';
  if (days <= 90) return '61-90 Days';
  return '90+ Days';
}
