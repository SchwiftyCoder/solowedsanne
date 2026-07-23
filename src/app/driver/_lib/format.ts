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

// "8:30" -> 8.5; plain decimals ("8.5") still work
export function parseHoursInput(raw: string): number {
  const str = raw.trim();
  if (!str) return 0;
  const m = str.match(/^(\d+):([0-5]?\d)$/);
  if (m) return Number(m[1]) + Number(m[2]) / 60;
  const n = parseFloat(str);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function formatHoursHM(n: number): string {
  const total = Math.round(n * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

// decimal hours -> "8:30", for prefilling inputs
export function formatHoursClock(n: number): string {
  const total = Math.round(Math.max(n, 0) * 60);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}
