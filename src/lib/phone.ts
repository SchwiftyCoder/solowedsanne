// Normalizes a raw phone string to E.164. "00" is the international dialing
// prefix used in place of "+" outside the Americas.
export function normalizePhone(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  if (digits.startsWith('00') && digits.length > 2) return `+${digits.slice(2)}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length > 0) return `+${digits}`;
  return '';
}
