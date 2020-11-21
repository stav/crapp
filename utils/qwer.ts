export function formatAmount (value) {
  return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(value)
}

export function formatCurrency (value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}
