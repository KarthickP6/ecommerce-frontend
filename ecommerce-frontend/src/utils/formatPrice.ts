// Utility to format numbers as Indian Rupee currency
export function formatPrice(value: number | null | undefined): string {
  const amount = typeof value === 'number' && !isNaN(value) ? value : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

