import test from 'node:test';
import assert from 'node:assert/strict';

// Core calculation logic mirroring formatters for test runner
function calculateLineItem(quantity, unitPrice, discountPercentage, taxRatePercentage) {
  const q = Number(quantity) || 0;
  const p = Number(unitPrice) || 0;
  const d = Number(discountPercentage) || 0;
  const t = Number(taxRatePercentage) || 0;

  const subtotal = q * p;
  const discountAmount = subtotal * (d / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableAmount * (t / 100);
  const total = taxableAmount + taxAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    taxableAmount: Math.round(taxableAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

function calculateInvoiceTotals(items, includeSSCL = false) {
  let subtotal = 0;
  let discountTotal = 0;
  let taxTotal = 0;

  for (const item of (items || [])) {
    const itemSub = (item.quantity || 0) * (item.unitPrice || 0);
    const itemDisc = itemSub * ((item.discountPercentage || 0) / 100);
    subtotal += itemSub;
    discountTotal += itemDisc;
    taxTotal += (item.taxAmount || 0);
  }

  const taxableBase = Math.max(0, subtotal - discountTotal);
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

function getAgingBucket(dueDateStr) {
  if (!dueDateStr) return 'Current';
  const due = new Date(dueDateStr).getTime();
  const now = new Date('2026-09-24').getTime();
  const diffDays = Math.floor((now - due) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Current';
  if (diffDays <= 30) return '1-30 Days';
  if (diffDays <= 60) return '31-60 Days';
  if (diffDays <= 90) return '61-90 Days';
  return '90+ Days';
}

// ----------------------------------------------------------------------------
// Unit Tests & Edge Case Validation
// ----------------------------------------------------------------------------

test('Unit Testing: Line item tax and discount calculation', () => {
  // Test case: 2 units @ LKR 100,000, 10% discount, 18% standard VAT
  // Subtotal = 200,000
  // Discount = 20,000
  // Taxable = 180,000
  // VAT 18% = 32,400
  // Total = 212,400
  const result = calculateLineItem(2, 100000, 10, 18);
  assert.equal(result.subtotal, 200000);
  assert.equal(result.discountAmount, 20000);
  assert.equal(result.taxableAmount, 180000);
  assert.equal(result.taxAmount, 32400);
  assert.equal(result.total, 212400);
});

test('Edge Case Validation: Zero quantity and 100% discount inputs', () => {
  const zeroQty = calculateLineItem(0, 50000, 0, 18);
  assert.equal(zeroQty.total, 0);

  const fullDiscount = calculateLineItem(1, 50000, 100, 18);
  assert.equal(fullDiscount.discountAmount, 50000);
  assert.equal(fullDiscount.taxableAmount, 0);
  assert.equal(fullDiscount.taxAmount, 0);
  assert.equal(fullDiscount.total, 0);

  const nullHandling = calculateLineItem(null, undefined, null, null);
  assert.equal(nullHandling.total, 0);
});

test('Unit Testing: Sri Lanka Invoice Totals with 18% VAT & 2.5% SSCL', () => {
  const items = [
    { quantity: 1, unitPrice: 1000000, discountPercentage: 0, taxAmount: 180000 },
  ];
  const totals = calculateInvoiceTotals(items, true);
  // Taxable Base = 1,000,000
  // VAT = 180,000
  // SSCL (2.5%) = 25,000
  // Grand Total = 1,205,000
  assert.equal(totals.subtotal, 1000000);
  assert.equal(totals.vatAmount, 180000);
  assert.equal(totals.ssclAmount, 25000);
  assert.equal(totals.grandTotal, 1205000);
});

test('Regression Testing: Aging classification buckets', () => {
  assert.equal(getAgingBucket('2026-10-01'), 'Current'); // Future due date
  assert.equal(getAgingBucket('2026-09-24'), 'Current'); // Due today
  assert.equal(getAgingBucket('2026-09-10'), '1-30 Days'); // 14 days overdue
  assert.equal(getAgingBucket('2026-08-10'), '31-60 Days'); // 45 days overdue
  assert.equal(getAgingBucket('2026-07-10'), '61-90 Days'); // 76 days overdue
  assert.equal(getAgingBucket('2026-05-10'), '90+ Days'); // 137 days overdue
  assert.equal(getAgingBucket(null), 'Current'); // Graceful fallback
});
