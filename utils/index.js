export function formatAmount (value, maximumSignificantDigits = 3) {
  return new Intl.NumberFormat('en-US', { maximumSignificantDigits }).format(value)
}

export function formatCurrency (value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}
