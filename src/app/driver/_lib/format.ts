export function formatCurrency(n: number): string {
  const sign = n < 0 ? '-' : '';
  return `${sign}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatCurrencyCompact(n: number): string {
  return `${n < 0 ? '-' : ''}$${Math.abs(Math.round(n)).toLocaleString('en-US')}`;
}

export function formatMiles(n: number): string {
  return `${n.toLocaleString('en-US', { maximumFractionDigits: 1 })} mi`;
}

export function formatHours(n: number): string {
  return `${n.toLocaleString('en-US', { maximumFractionDigits: 1 })} hr`;
}
